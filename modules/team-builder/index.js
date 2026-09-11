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
} from './stores/teamBuilderStore.js';
import { getSelectedIds } from './stores/teamBuilderStore.js';


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
import { collectTeamPool } from './utils/pool.js';
import { autoFormTeams } from './utils/autoForm.js';
import { getLineById, writeAssignmentsToLegacyState } from './utils/sync.js';

/**
 * Master Render Function
 * Coordinates redrawing all components when state changes.
 */
function renderAll() {
    const S = window.Scheduler;
    destroySortables();
    collectTeamPool(); // Refresh the pool from the main app's state

    // Refresh UI components
    refreshTeamOddityBanner();
    renderTeamFilters();
    renderTeamPills();
    renderUnassignedPool();
    applyFollowMe();
    renderTeamBoards();
    renderTeamStats();
    
    // Write assignments back to the main application state
    if (S && S.state && S.state.lines) {
        writeAssignmentsToLegacyState(S.state.lines);
    }

    // Re-initialize drag-and-drop
    initSortables(onDragEnd); 
}

function onDragEnd() {
    syncTeamsFromDom();
    renderAll();
    // Re-render the main application's lines tab if it's visible
    if (window.Scheduler && typeof window.Scheduler.renderLines === 'function') {
        window.Scheduler.renderLines();
    }
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
            renderAll(); // A render is needed to update other parts of the UI
        } else if (t.getAttribute('data-select-line') != null) {
            const id = +t.getAttribute('data-select-line');
            if (t.checked) {
                selected[id] = true;
            } else {
                delete selected[id];
            }
            renderTeamFilters(); // Just update the filter bar with the count
        }
    });

    document.addEventListener('click', (e) => {
        const t = e.target;
        if (!t) return;
        const closest = (selector) => t.closest ? t.closest(selector) : null;
        const target = closest('[data-remove-team]') || closest('[data-remove-member]') || closest('[data-pin-team]') || closest('#btn-build-close, #team-detail-close');


        if (t.id === 'btn-team-auto-form') {
            autoFormTeams();
            renderAll();
        } else if (t.id === 'btn-team-build') {
            applyFollowMe(true);
            renderPinnedSummaries();
            initSortables(onDragEnd);
        } else if (target && target.matches('[data-pin-team]')) {
            toggleTeamPin(target.getAttribute('data-pin-team'));
            renderAll();
        } else if (t.id === 'btn-team-new' || t.id === 'btn-team-new-dock') {
            createTeam();
            renderAll();
        } else if (t.id === 'btn-team-clear-filters') {
            filters.role = "ALL";
            filters.start = "";
            filters.rdo = "";
            document.getElementById('team-filter-role').value = "ALL";
            document.getElementById('team-filter-start').value = "";
            document.getElementById('team-filter-rdo').value = "";
            renderAll();
        } else if (t.id === 'btn-team-assign') {
            assignSelectedToTeam(document.getElementById('team-assign-target').value);
            renderAll();
        } else if (t.id === 'btn-team-select-all') {
            selectAllVisible();
            renderAll();
        } else if (t.id === 'btn-team-clear-sel') {
            clearSelection();
            renderAll();
        } else if (target && target.matches('[data-remove-team]')) {
            if (confirm('Are you sure you want to remove this entire team?')) {
                removeTeam(target.getAttribute('data-remove-team'));
                renderAll();
            }
        } else if (target && target.matches('[data-remove-member]')) {
            removeMemberFromTeam(target.getAttribute('data-from-team'), target.getAttribute('data-remove-member'));
            renderAll();
        } else if (target && target.matches('#btn-build-close, #team-detail-close')) {
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
    // Make the scheduler instance available to modules that need it
    // This is the "bridge" to the legacy app's state
    window.Scheduler = window.Scheduler || scheduler;

    injectAutoFormControls();
    bindTeamUI();
    collectTeamPool();
    renderAll();
    initFloatPanels();

    // Monkey-patch the main app's render function to keep the team builder in sync
    const prevRenderAll = scheduler.renderAll;
    scheduler.renderAll = function(...args) {
        if (typeof prevRenderAll === 'function') {
            prevRenderAll.apply(this, args);
        }
        if (document.querySelector("#tab-teams.active")) {
            collectTeamPool();
            renderAll();
        }
    };
    
    // Also patch the line renderer to ensure data is fresh
    const prevRenderLines = scheduler.renderLines;
    scheduler.renderLines = function(...args) {
        if (document.querySelector("#tab-teams.active")) {
            collectTeamPool();
            renderAll();
        }
        if (typeof prevRenderLines === 'function') {
            prevRenderLines.apply(this, args);
        }
    };
}
