/**
 * ▲ BLADE AIRPORT OPS v2.0 // TEAM BUILDER MODULE
 * PATH: /modules/team-builder/index.js
 * 
 * Production ES Module for BLADE team forming.
 * Bridges the central Scheduler state with the modular teams store,
 * manages native AM/PM team boards, and binds the Auto-Form engine.
 */

import { store } from './store.js';
import { TeamBoards } from './TeamBoards.js';
import { TeamPills } from './TeamPills.js';
import { autoForm } from './utils/autoForm.js';

// ==========================================
// 1. AUTO-FORM DISPATCHER
// ==========================================

/**
 * Executes the real auto-form engine and cascades renders.
 */
export function autoFormTeams() {
    const S = window.Scheduler || (store && store.scheduler);

    // 1. Run the autoForm algorithm from utils/autoForm.js
    if (typeof autoForm === 'function') {
        try {
            autoForm(S, store);
        } catch (err) {
            console.error('Error during autoForm execution:', err);
        }
    } else {
        console.warn('autoForm export from utils/autoForm.js is not a function.');
    }

    // 2. Cascade render updates to the application
    if (S && typeof S.renderAll === 'function') {
        S.renderAll();
    } else if (typeof window.renderAll === 'function') {
        window.renderAll();
    }

    if (typeof window.renderLines === 'function') {
        window.renderLines();
    }

    // 3. Re-render modular boards if exposed
    if (TeamBoards && typeof TeamBoards.render === 'function') {
        TeamBoards.render();
    }
    if (TeamPills && typeof TeamPills.render === 'function') {
        TeamPills.render();
    }
}

// ==========================================
// 2. UI EVENT BINDINGS
// ==========================================

/**
 * Attaches event listeners to the native team forming action controls.
 */
export function bindTeamUI() {
    // --- AUTO-FORM TEAMS BUTTON ---
    const autoFormBtn = document.getElementById('btn-team-auto-form');
    if (autoFormBtn && !autoFormBtn._modularBound) {
        autoFormBtn._modularBound = true;
        autoFormBtn.addEventListener('click', (e) => {
            e.preventDefault();
            autoFormTeams();
        });
    }

    // --- NEW TEAM BUTTON ---
    const newTeamBtn = document.getElementById('btn-team-new');
    if (newTeamBtn && !newTeamBtn._modularBound) {
        newTeamBtn._modularBound = true;
        newTeamBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (store && typeof store.addTeam === 'function') {
                store.addTeam();
            } else if (TeamBoards && typeof TeamBoards.addNewTeam === 'function') {
                TeamBoards.addNewTeam();
            }
            const S = window.Scheduler || (store && store.scheduler);
            if (S && typeof S.renderAll === 'function') {
                S.renderAll();
            }
        });
    }

    // --- BUILD BUTTON (FLOATING DOCKS TOGGLE) ---
    const buildBtn = document.getElementById('btn-team-build');
    if (buildBtn && !buildBtn._modularBound) {
        buildBtn._modularBound = true;
        buildBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const docks = document.getElementById('team-follow-docks');
            if (docks) {
                docks.hidden = !docks.hidden;
                docks.classList.toggle('is-active', !docks.hidden);
            }
        });
    }
}

// ==========================================
// 3. MODULE INITIALIZATION & BRIDGE
// ==========================================
let isInitialized = false;

/**
 * Boots the team builder module and bridges it with the legacy Scheduler instance.
 * @param {object} schedulerInstance - The global Scheduler instance
 */
export function initTeamBuilder(schedulerInstance) {
    if (isInitialized) return;
    isInitialized = true;

    const S = schedulerInstance || window.Scheduler;

    // Attach scheduler to store
    if (store) {
        if (typeof store.init === 'function') {
            store.init(S);
        } else {
            store.scheduler = S;
        }
    }

    // Initialize native UI components
    if (TeamBoards && typeof TeamBoards.init === 'function') {
        TeamBoards.init(S);
    }
    if (TeamPills && typeof TeamPills.init === 'function') {
        TeamPills.init(S);
    }

    // Bind event handlers
    bindTeamUI();

    // Initial render
    if (S && typeof S.renderAll === 'function') {
        S.renderAll();
    }

    console.log('Team Builder module booted: autoForm bound to #btn-team-auto-form.');
}

// Expose globally for legacy scripts and testing
window.initTeamBuilder = initTeamBuilder;
window.autoFormTeams = autoFormTeams;
window.bindTeamUI = bindTeamUI;
