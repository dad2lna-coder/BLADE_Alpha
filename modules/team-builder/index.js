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

/**
 * Master Render Function
 * Coordinates redrawing all components when state changes.
 */
function renderAll() {
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

    // Write assignments back to legacy state
    writeAssignmentsToLegacyState();

    // Re-initialize drag-and-drop
    initSortables(onDragEnd);
}

function onDragEnd() {
    syncTeamsFromDom();
    renderAll();
}

/**
 * Writes the current team assignments from the module's state
 * back to the main application's (legacy) state object.
 */
function writeAssignmentsToLegacyState() {
    const S = window.Scheduler;
    if (!S || !S.state || !S.state.lines) {
        console.warn("TeamBuilder: Main scheduler state not ready for sync.");
        return;
    }

    const lineToTeamMap = new Map();
    teams.forEach(team => {
        team.members.forEach(memberId => {
            lineToTeamMap.set(+memberId, { teamId: team.id, teamName: team.name });
        });
    });

    S.state.lines.forEach(line => {
        const assignment = lineToTeamMap.get(line.id);
        if (assignment) {
            line.teamId = assignment.teamId;
            line.teamName = assignment.teamName;
        } else {
            delete line.teamId;
            delete line.teamName;
        }
    });

    // After syncing, tell the main app to re-render its lines if the function exists
    if (typeof S.renderLines === 'function') {
        S.renderLines();
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
            renderAll();
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
            renderAll();
        } else if (t.id === 'btn-team-build') {
            applyFollowMe(true);
            renderPinnedSummaries();
            initSortables(onDragEnd);
        } else if (closest('[data-pin-team]')) {
            toggleTeamPin(closest('[data-pin-team]').getAttribute('data-pin-team'));
            renderAll();
        } else if (t.id === 'btn-team-new' || t.id === 'btn-team-new-dock') {
            createTeam();
            renderAll();
        } else if (t.id === 'btn-team-clear-filters') {
            filters.role = "ALL";
            filters.start = "";
            filters.rdo = "";
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
        } else if (closest('[data-remove-team]')) {
            removeTeam(closest('[data-remove-team]').getAttribute('data-remove-team'));
            renderAll();
        } else if (closest('[data-remove-member]')) {
            removeMemberFromTeam(closest('[data-from-team]').getAttribute('data-remove-member'));
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
 */
export function initTeamBuilder(scheduler) {
    window.Scheduler = window.Scheduler || scheduler;

    const teamsTab = document.querySelector('.tab-btn[data-tab="teams"]');
    if (teamsTab) {
        teamsTab.addEventListener('click', () => {
            // Only run the full init/render if it hasn't been done yet
            if (document.querySelector('#team-pool') && !document.querySelector('#team-pool').children.length) {
                injectAutoFormControls();
                bindTeamUI();
                collectTeamPool();
                renderAll();
                initFloatPanels();
            }
        }, { once: true }); // Use { once: true } so this only fires the very first time the tab is clicked.
    }
}
