/**
 * ▲ BLADE AIRPORT OPS v2.0 // TEAM BUILDER MODULE
 * PATH: /modules/team-builder/index.js
 * 
 * This file is executed as an ES Module. It maintains its own private scope
 * and explicitly registers a lifecycle bridge on the window object to 
 * coordinate state updates with the legacy terminal scheduler.
 */

// ==========================================
// 1. MODULE-LEVEL STATE (DYNAMIC OVERRIDES)
// ==========================================
const state = {
    // Falls back to mock structures ONLY if the legacy app exposes no programmatic teams
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
 * Resolves the active operational teams by reading from the core scheduler state.
 * @param {object} scheduler - The legacy scheduler instance
 * @returns {Array} List of active operational team objects
 */
function getActiveTeams(scheduler) {
    if (scheduler && Array.isArray(scheduler.teams)) {
        return scheduler.teams;
    }
    if (window.state && Array.isArray(window.state.teams)) {
        return window.state.teams;
    }
    // Fallback to local default array if legacy scheduler contains no teams
    return state.teams;
}

/**
 * Syncs the local unassigned pool with the legacy scheduler's staff list.
 * Prevents duplicates by checking which staff are already assigned to active teams.
 * @param {object} scheduler - The legacy scheduler instance
 */
function syncStateWithLegacy(scheduler) {
    if (!scheduler) return;

    // Dynamically align local team references with the core application's active teams
    const activeTeams = getActiveTeams(scheduler);
    if (activeTeams !== state.teams) {
        state.teams = activeTeams;
    }

    if (!scheduler.staff) {
        state.unassignedStaff = [];
        return;
    }

    // 1. Gather all currently assigned staff members across all active teams
    const assignedStaffNames = new Set();
    state.teams.forEach(team => {
        if (Array.isArray(team.members)) {
            team.members.forEach(member => assignedStaffNames.add(member));
        }
    });

    // 2. Filter unassigned pool to contain only staff not currently on teams
    state.unassignedStaff = scheduler.staff.filter(
        staffMember => !assignedStaffNames.has(staffMember)
    );

    console.log("Team Builder synced with legacy state:", {
        assigned: Array.from(assignedStaffNames),
        unassigned: state.unassignedStaff,
        teamsCount: state.teams.length
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
        return;
    }

    // Ensure we are referencing the correct active teams
    const activeTeams = getActiveTeams(window.mySchedulerInstance);

    // --- RENDER TEAMS PANEL ---
    let teamsHTML = '';
    activeTeams.forEach(team => {
        const membersList = Array.isArray(team.members) ? team.members : [];
        const teamId = team.id || team.name.toLowerCase().replace(/\s+/g, '-');
        const teamName = team.name || "Unnamed Team";

        teamsHTML += `
            <div class="team-card" style="border: 1px solid var(--term-green); margin-bottom: 15px; padding: 10px; background: rgba(0,20,0,0.2);">
                <div style="font-weight: bold; border-bottom: 1px dashed var(--term-green); padding-bottom: 5px; margin-bottom: 8px; color: var(--term-green);">
                    ▶ ${teamName.toUpperCase()} [${membersList.length} / 4]
                </div>
                <div class="team-members-list" style="min-height: 40px; display: flex; flex-direction: column; gap: 5px;">
                    ${membersList.length === 0 
                        ? `<span style="color: var(--term-dim); font-style: italic;">[ NO STAFF ASSIGNED ]</span>` 
                        : membersList.map(member => `
                            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(51, 255, 51, 0.1); padding: 3px 6px;">
                                <span style="color: var(--term-green);">⚡ ${member}</span>
                                <button class="action-btn remove-btn" data-team-id="${teamId}" data-member-name="${member}" 
                                        style="background: transparent; border: 1px solid red; color: red; font-family: inherit; font-size: 0.8rem; cursor: pointer; padding: 2px 6px; border-radius: 4px;">
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
            <div class="status-box" style="border: 1px dashed var(--term-amber); color: var(--term-amber); padding: 15px; text-align: center; background: rgba(240, 165, 0, 0.05); font-family: var(--mono); font-size: 0.85rem;">
                ALL OPERATIONS STAFF ASSIGNED. NO IDLE WORKERS IN POOL.
            </div>
        `;
    } else {
        let poolHTML = '<ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">';
        state.unassignedStaff.forEach(staff => {
            poolHTML += `
                <li style="display: flex; justify-content: space-between; align-items: center; border: 1px dashed var(--term-green); padding: 6px 10px; background: rgba(0, 10, 0, 0.4); border-radius: 4px;">
                    <span style="color: var(--term-green); font-family: var(--mono); font-size: 0.85rem;">👤 ${staff.toUpperCase()}</span>
                    <div style="display: flex; gap: 5px;">
                        ${activeTeams.map(team => {
                            const teamId = team.id || team.name.toLowerCase().replace(/\s+/g, '-');
                            const shortLabel = (team.name || "").split(' ')[0] || "Team";
                            return `
                                <button class="action-btn assign-btn" data-team-id="${teamId}" data-member-name="${staff}"
                                        style="background: rgba(0,20,0,0.3); border: 1px solid var(--term-green); color: var(--term-green); font-family: inherit; font-size: 0.75rem; cursor: pointer; padding: 3px 6px; border-radius: 4px;">
                                    + ${shortLabel}
                                </button>
                            `;
                        }).join('')}
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

    // --- BIND AUTO-FORM TEAMS BUTTON ---
    const autoFormBtn = document.getElementById("btn-team-auto-form");
    if (autoFormBtn) {
        autoFormBtn.addEventListener("click", () => {
            autoFormTeams();
        });
    }
}

function assignStaffToTeam(memberName, teamId) {
    const activeTeams = getActiveTeams(window.mySchedulerInstance);
    const team = activeTeams.find(t => (t.id === teamId || t.name.toLowerCase().replace(/\s+/g, '-') === teamId));
    if (!team) return;

    if (!Array.isArray(team.members)) {
        team.members = [];
    }

    if (team.members.length >= 4) {
        alert("CRITICAL WARNING: Team capacity limit reached (MAX 4 per team).");
        return;
    }

    if (!team.members.includes(memberName)) {
        team.members.push(memberName);
        // Resynchronize and update UI
        syncStateWithLegacy(window.mySchedulerInstance);
        renderTeamBuilder();
        console.log(`Assigned ${memberName} to ${team.name || teamId}`);
    }
}

function removeStaffFromTeam(memberName, teamId) {
    const activeTeams = getActiveTeams(window.mySchedulerInstance);
    const team = activeTeams.find(t => (t.id === teamId || t.name.toLowerCase().replace(/\s+/g, '-') === teamId));
    if (!team) return;

    if (Array.isArray(team.members)) {
        team.members = team.members.filter(member => member !== memberName);
    }
    // Resynchronize and update UI
    syncStateWithLegacy(window.mySchedulerInstance);
    renderTeamBuilder();
    console.log(`Released ${memberName} from ${team.name || teamId}`);
}

// ==========================================
// 4. AUTO-FORMING ALGORITHM
// ==========================================
function autoFormTeams() {
    const scheduler = window.mySchedulerInstance;
    if (!scheduler || !scheduler.staff || scheduler.staff.length === 0) {
        alert("WARNING: No operations staff lines found.\n\nPlease configure your FTE variables in the [F1] SETUP tab and click the global '[GEN] GENERATE' button at the top header first to compile your staff registry.");
        return;
    }

    // Retrieve active dynamic teams list from core state
    const activeTeams = getActiveTeams(scheduler);
    if (activeTeams.length === 0) {
        alert("WARNING: No active operational teams exist to form. Please build or add a team first.");
        return;
    }

    // Retrieve active configuration inputs
    const archStso = parseInt(document.getElementById("arch-stso")?.value) || 0;
    const archLtso = parseInt(document.getElementById("arch-ltso")?.value) || 0;
    const archTso = parseInt(document.getElementById("arch-tso")?.value) || 0;

    // Clear existing assignments for all dynamic teams
    activeTeams.forEach(team => {
        team.members = [];
    });

    // Create a pool of unassigned staff to distribute
    const pool = [...scheduler.staff];

    // Filter staff by roles based on typical name-string roles
    const stsoStaff = pool.filter(name => name.toUpperCase().includes("STSO"));
    const ltsoStaff = pool.filter(name => name.toUpperCase().includes("LTSO"));
    const tsoStaff = pool.filter(name => !name.toUpperCase().includes("STSO") && !name.toUpperCase().includes("LTSO"));

    // Distribute among the active teams according to architectural inputs
    activeTeams.forEach(team => {
        if (!Array.isArray(team.members)) {
            team.members = [];
        }

        // Assign STSOs
        for (let i = 0; i < archStso; i++) {
            if (stsoStaff.length > 0 && team.members.length < 4) {
                team.members.push(stsoStaff.shift());
            }
        }
        // Assign LTSOs
        for (let i = 0; i < archLtso; i++) {
            if (ltsoStaff.length > 0 && team.members.length < 4) {
                team.members.push(ltsoStaff.shift());
            }
        }
        // Assign TSOs
        for (let i = 0; i < archTso; i++) {
            if (tsoStaff.length > 0 && team.members.length < 4) {
                team.members.push(tsoStaff.shift());
            }
        }
    });

    // Update pool synchronization and re-render
    syncStateWithLegacy(scheduler);
    renderTeamBuilder();
    console.log("Operational teams auto-formed dynamically using current team listings.");
}

// ==========================================
// 5. THE MONKEY PATCH SYNC PLUG
// ==========================================
function hasTeamBuilderDom() {
    return !!(document.getElementById("team-builder-root") && document.getElementById("unassigned-pool-root"));
}

function installLegacyMonkeyPatch(schedulerInstance) {
    if (!schedulerInstance || typeof schedulerInstance.renderAll !== "function") return;
    if (schedulerInstance.renderAll._teamBuilderWrapped) return;
    if (!hasTeamBuilderDom()) return;

    const originalRenderAll = schedulerInstance.renderAll;

    schedulerInstance.renderAll = function(...args) {
        originalRenderAll.apply(this, args);
        if (!hasTeamBuilderDom()) return;
        syncStateWithLegacy(schedulerInstance);
        renderTeamBuilder();
    };
    schedulerInstance.renderAll._teamBuilderWrapped = true;
    schedulerInstance.renderAll._teamBuilderUnwrap = function () {
        if (typeof originalRenderAll === "function") {
            schedulerInstance.renderAll = originalRenderAll;
        }
    };
}

// ==========================================
// 6. GLOBAL INTERFACE INITIALIZATION (THE BRIDGE)
// ==========================================

/**
 * Boots the modular script and coordinates with the legacy scheduler instance.
 * @param {object} schedulerInstance - Instantiated legacy driver object
 */
let teamBuilderInitialized = false;

export function initTeamBuilder(schedulerInstance) {
    if (teamBuilderInitialized) return;
    teamBuilderInitialized = true;

    // Mount the scheduler reference to the window scope for access by event tasks
    window.mySchedulerInstance = schedulerInstance;

    if (!hasTeamBuilderDom()) {
        console.warn("Modular Team Builder containers missing from DOM. Aborting initialization.");
        return;
    }

    setupEventListeners();
    installLegacyMonkeyPatch(schedulerInstance);
    syncStateWithLegacy(schedulerInstance);
    renderTeamBuilder();
}

// Bind directly to global scope so Main index Page's bootstrap script can find it
window.initTeamBuilder = initTeamBuilder;
