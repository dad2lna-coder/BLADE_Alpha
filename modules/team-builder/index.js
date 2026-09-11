/**
 * ▲ BLADE AIRPORT OPS v2.0 // TEAM BUILDER MODULE
 * PATH: /modules/team-builder/index.js
 * 
 * This file is executed as an ES Module. It maintains its own private scope
 * and explicitly registers a lifecycle bridge on the window object to 
 * coordinate state updates with the legacy terminal scheduler.
 */

// ==========================================
// 1. MODULE-LEVEL PRIVATE STATE
// ==========================================
const state = {
    teams: [
        { id: "team-alpha", name: "Alpha Gate Ramp", members: [] },
        { id: "team-bravo", name: "Bravo Baggage Ops", members: [] },
        { id: "team-charlie", name: "Charlie Terminal Ops", members: [] }
    ],
    unassignedStaff: [] // Populated dynamically from legacy scheduler
};

// ==========================================
// 2. STATE SYNCHRONIZATION & RENDERING
// ==========================================

/**
 * Syncs the local unassigned pool with the legacy scheduler's staff list.
 * Prevents duplicates by checking which staff are already assigned to active teams.
 * @param {object} scheduler - The legacy scheduler instance
 */
function syncStateWithLegacy(scheduler) {
    if (!scheduler || !scheduler.staff) return;

    // 1. Gather all currently assigned staff members across all teams
    const assignedStaffNames = new Set();
    state.teams.forEach(team => {
        team.members.forEach(member => assignedStaffNames.add(member));
    });

    // 2. Filter unassigned pool to contain only staff not currently on teams
    state.unassignedStaff = scheduler.staff.filter(
        staffMember => !assignedStaffNames.has(staffMember)
    );

    console.log("Team Builder synced with legacy state:", {
        assigned: Array.from(assignedStaffNames),
        unassigned: state.unassignedStaff
    });
}

/**
 * Main render function that draws the retro terminal components
 * into the DOM containers on the index page.
 */
function renderTeamBuilder() {
    const teamRoot = document.getElementById("team-builder-root");
    const poolRoot = document.getElementById("unassigned-pool-root");

    // Safety check: Exit if the elements do not exist in the DOM
    if (!teamRoot || !poolRoot) {
        console.warn("Team Builder DOM targets missing. Postponing render.");
        return;
    }

    // --- RENDER TEAMS PANEL ---
    let teamsHTML = '';
    state.teams.forEach(team => {
        teamsHTML += `
            <div class="team-card" style="border: 1px solid var(--term-green); margin-bottom: 15px; padding: 10px; background: rgba(0,20,0,0.2);">
                <div style="font-weight: bold; border-bottom: 1px dashed var(--term-green); padding-bottom: 5px; margin-bottom: 8px;">
                    ▶ ${team.name.toUpperCase()} [${team.members.length} / 4]
                </div>
                <div class="team-members-list" style="min-height: 40px; display: flex; flex-direction: column; gap: 5px;">
                    ${team.members.length === 0 
                        ? `<span style="color: var(--term-dim); font-style: italic;">[ NO STAFF ASSIGNED ]</span>` 
                        : team.members.map(member => `
                            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(51, 255, 51, 0.1); padding: 3px 6px;">
                                <span>⚡ ${member}</span>
                                <button class="action-btn remove-btn" data-team-id="${team.id}" data-member-name="${member}" 
                                        style="background: transparent; border: 1px solid red; color: red; font-family: inherit; font-size: 0.8rem; cursor: pointer;">
                                    RELEASE
                                </button>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        `;
    });
    teamRoot.innerHTML = teamsHTML;

    // --- RENDER UNASSIGNED POOL ---
    if (state.unassignedStaff.length === 0) {
        poolRoot.innerHTML = `
            <div class="status-box" style="border-color: var(--term-amber); color: var(--term-amber);">
                ALL OPERATIONS STAFF ASSIGNED. NO IDLE WORKERS IN POOL.
            </div>
        `;
    } else {
        let poolHTML = '<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">';
        state.unassignedStaff.forEach(staff => {
            poolHTML += `
                <li style="display: flex; justify-content: space-between; align-items: center; border: 1px dashed var(--term-green); padding: 6px 10px; background: rgba(0, 10, 0, 0.4);">
                    <span>👤 ${staff.toUpperCase()}</span>
                    <div style="display: flex; gap: 5px;">
                        ${state.teams.map(team => `
                            <button class="action-btn assign-btn" data-team-id="${team.id}" data-member-name="${staff}"
                                    style="background: var(--term-dim); border: 1px solid var(--term-green); color: var(--term-green); font-family: inherit; font-size: 0.75rem; cursor: pointer; padding: 2px 4px;">
                                + ${team.name.split(' ')[0]}
                            </button>
                        `).join('')}
                    </div>
                </li>
            `;
        });
        poolHTML += '</ul>';
        poolRoot.innerHTML = poolHTML;
    }
}

// ==========================================
// 3. EVENT DELEGATION ENGINE
// ==========================================
function setupEventListeners() {
    const f4Panel = document.getElementById("tab-teams");
    if (!f4Panel) return;

    // Attach single listener to container root to avoid orphaned handlers during rewrites
    f4Panel.addEventListener("click", (event) => {
        const target = event.target;

        // --- HANDLE ASSIGNMENT ACTION ---
        if (target.classList.contains("assign-btn")) {
            const teamId = target.getAttribute("data-team-id");
            const memberName = target.getAttribute("data-member-name");
            assignStaffToTeam(memberName, teamId);
        }

        // --- HANDLE REMOVAL ACTION ---
        if (target.classList.contains("remove-btn")) {
            const teamId = target.getAttribute("data-team-id");
            const memberName = target.getAttribute("data-member-name");
            removeStaffFromTeam(memberName, teamId);
        }
    });
}

function assignStaffToTeam(memberName, teamId) {
    const team = state.teams.find(t => t.id === teamId);
    if (!team) return;

    if (team.members.length >= 4) {
        alert("CRITICAL WARNING: Team capacity limit reached (MAX 4 per team).");
        return;
    }

    if (!team.members.includes(memberName)) {
        team.members.push(memberName);
        // Resynchronize and update UI
        syncStateWithLegacy(window.mySchedulerInstance);
        renderTeamBuilder();
        console.log(`Assigned ${memberName} to ${team.name}`);
    }
}

function removeStaffFromTeam(memberName, teamId) {
    const team = state.teams.find(t => t.id === teamId);
    if (!team) return;

    team.members = team.members.filter(member => member !== memberName);
    // Resynchronize and update UI
    syncStateWithLegacy(window.mySchedulerInstance);
    renderTeamBuilder();
    console.log(`Released ${memberName} from ${team.name}`);
}

// ==========================================
// 4. THE MONKEY PATCH SYNC PLUG
// ==========================================
function installLegacyMonkeyPatch(schedulerInstance) {
    // Save original render call
    const originalRenderAll = schedulerInstance.renderAll;

    // Override the function safely
    schedulerInstance.renderAll = function(...args) {
        // 1. Run the legacy scheduler operations first
        originalRenderAll.apply(this, args);

        // 2. Intercept and run the Team Builder modules state synchronization
        console.log("✈️ Modular Bridge intercepted scheduler.renderAll(). Syncing team views.");
        syncStateWithLegacy(schedulerInstance);
        renderTeamBuilder();
    };

    console.log("⚙️ Legacy Scheduler engine patched successfully.");
}

// ==========================================
// 5. GLOBAL INTERFACE INITIALIZATION (THE BRIDGE)
// ==========================================

/**
 * Boots the modular script and coordinates with the legacy scheduler instance.
 * @param {object} schedulerInstance - Instantiated legacy driver object
 */
export function initTeamBuilder(schedulerInstance) {
    console.log("Initializing Team Builder module loader...");
    
    // Install event listeners first (done once)
    setupEventListeners();

    // Patch the legacy schedule engine's rendering thread
    installLegacyMonkeyPatch(schedulerInstance);

    // Run first-time synchronizations
    syncStateWithLegacy(schedulerInstance);
    renderTeamBuilder();

    console.log("▲ TEAM BUILDER MODULE PIPELINE READY.");
}

// Bind directly to global scope so Main index Page's bootstrap script can find it
window.initTeamBuilder = initTeamBuilder;
