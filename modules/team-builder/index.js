// 1. Import State & Store Mutations
import {
  teams,
  pool,
  filters,
  selected,
  createTeam,
  removeTeam,
  renameTeam,
  clearSelection,
  assignSelectedToTeam,
  removeMemberFromTeam,
  getSelectedIds,
  setBuildOpen,
  syncSchedulerBridge,
} from './stores/teamBuilderStore.js';


// 2. Import UI Rendering Functions
import { renderTeamBoards } from './components/TeamBoards.js';
import { renderUnassignedPool, selectAllVisible } from './components/UnassignedPool.js';
import { renderTeamStats } from './components/TeamStats.js';
import { renderTeamPills } from './components/TeamPills.js';
import { renderTeamFilters } from './components/TeamFilters.js';
import { renderPinnedSummaries } from './components/FollowMeDock.js';
import { injectAutoFormControls } from './components/AutoFormControls.js';
import { refreshTeamOddityBanner } from './components/OddityBanner.js';

// 3. Import Actions and Utilities
import { initSortables, destroySortables, syncTeamsFromDom } from './actions/dnd.js';
import { applyFollowMe, initFloatPanels, closeTeamUi, toggleTeamPin } from './actions/floatPanel.js';
import { collectTeamPool, assignedIds, getFilteredPool } from './utils/pool.js';
import { autoFormTeams } from './utils/autoForm.js';

function bridgeAndRenderLines() {
    const S = window.Scheduler;
    if (S) syncSchedulerBridge(S);
    if (S && typeof S.renderLines === "function") S.renderLines();
}

function updateTeamCountHint() {
    const el = document.getElementById("team-count-hint");
    if (!el) return;
    const n = (teams || []).length;
    if (!n) {
        el.textContent = "No teams yet — click + New team";
        return;
    }
    const assigned = assignedIds().size;
    const filteredPool = getFilteredPool().length;
    el.textContent = n + " team(s) · " + assigned + " assigned · " + filteredPool + " in pool (filtered)";
}

/**
 * Master Render Function
 * Coordinates redrawing all components when state changes.
 */
function renderAll() {
    destroySortables();
    collectTeamPool(); // Refresh the pool from the main app's state

    refreshTeamOddityBanner();
    renderTeamFilters();
    renderTeamPills();
    renderUnassignedPool();
    applyFollowMe();
    renderTeamBoards();
    renderPinnedSummaries();
    renderTeamStats();
    updateTeamCountHint();

    initSortables(onDragEnd);
}

function onDragEnd() {
    syncTeamsFromDom();
    bridgeAndRenderLines();
    renderAll();
}

/**
 * Event Binding
 * Listens for user interactions and routes them to the correct functions.
 */
function bindTeamUI() {
    document.addEventListener('change', (e) => {
        const t = e.target;
        if (!t) return;

        if (t.id === 'team-filter-role') {
            filters.role = t.value;
            renderAll();
        } else if (t.id === 'team-filter-start') {
            filters.start = t.value;
            renderAll();
        } else if (t.id === 'team-filter-rdo') {
            filters.rdo = t.value;
            renderAll();
        } else if (t.classList.contains('team-name-input')) {
            renameTeam(t.getAttribute('data-team-id'), t.value);
            bridgeAndRenderLines();
        } else if (t.getAttribute('data-select-line') != null) {
            const id = +t.getAttribute('data-select-line');
            if (t.checked) {
                selected[id] = true;
            } else {
                delete selected[id];
            }
            renderTeamFilters();
        }
    });

    document.addEventListener('click', (e) => {
        const t = e.target;
        if (!t) return;
        const closest = (selector) => t.closest ? t.closest(selector) : null;

        if (t.id === 'btn-team-auto-form') {
            autoFormTeams();
            bridgeAndRenderLines();
            renderAll();
        } else if (t.id === 'btn-team-build') {
            setBuildOpen(true);
            applyFollowMe(true);
            renderPinnedSummaries();
            initSortables(onDragEnd);
        } else if (closest('[data-pin-team]')) {
            toggleTeamPin(closest('[data-pin-team]').getAttribute('data-pin-team'));
            renderAll();
        } else if (t.id === 'btn-team-new' || t.id === 'btn-team-new-dock') {
            createTeam();
            bridgeAndRenderLines();
            renderAll();
        } else if (t.id === 'btn-team-clear-filters') {
            filters.role = 'ALL';
            filters.start = '';
            filters.rdo = '';
            renderAll();
        } else if (t.id === 'btn-team-assign') {
            assignSelectedToTeam(document.getElementById('team-assign-target').value);
            bridgeAndRenderLines();
            renderAll();
        } else if (t.id === 'btn-team-select-all') {
            selectAllVisible();
            renderAll();
        } else if (t.id === 'btn-team-clear-sel') {
            clearSelection();
            renderAll();
        } else if (closest('[data-remove-team]')) {
            removeTeam(closest('[data-remove-team]').getAttribute('data-remove-team'));
            bridgeAndRenderLines();
            renderAll();
        } else if (closest('[data-remove-member]')) {
            removeMemberFromTeam(closest('[data-remove-member]').getAttribute('data-from-team'), closest('[data-remove-member]').getAttribute('data-remove-member'));
            bridgeAndRenderLines();
            renderAll();
        } else if (closest('#btn-build-close, #team-detail-close')) {
            e.preventDefault();
            e.stopPropagation();
            closeTeamUi();
            renderAll();
        }
    });
}

/**
 * Public Initialization API
 * The ONLY function called by the external application.
 */
export function initTeamBuilder(scheduler) {
    window.Scheduler = window.Scheduler || scheduler;
    syncSchedulerBridge(window.Scheduler);

    injectAutoFormControls();
    bindTeamUI();
    collectTeamPool();
    renderAll();
    initFloatPanels();

    const prevRenderAll = scheduler.renderAll;
    scheduler.renderAll = function(...args) {
        if (typeof prevRenderAll === 'function') {
            prevRenderAll.apply(this, args);
        }
        if (document.querySelector('#tab-teams.active')) {
            collectTeamPool();
            renderAll();
        }
    };
}
