cuted as an ES Module. It maintains its own private scope
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
    unassignedStaff: [] // Populated dynamically from legacy scheduler lines
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
    if (window.state && Array.isArray(window.state.teams) && window.state.teams.length > 0) {
        return window.state.teams;
    }
    if (scheduler && Array.isArray(scheduler.teams) && scheduler.teams.length > 0) {
        return scheduler.teams;
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

    // Dynamically align local team references with the core active teams
    const activeTeams = getActiveTeams(scheduler);
    
    let allLines = [];
    if (window.state && Array.isArray(window.state.lines)) {
        allLines = window.state.lines;
    } else if (scheduler && Array.isArray(scheduler.lines)) {
        allLines = scheduler.lines;
    } else if (scheduler && Array.isArray(scheduler.staff)) {
        allLines = scheduler.staff.map(s => typeof s === 'string' ? { lineCode: s, team: "\\__none_\\_" } : s);
    }

    // Map members for each active team from the core state lines
    activeTeams.forEach(team => {
        const teamId = team.id;
        const members = [];
        
        // Match by line.team
        allLines.forEach(line => {
            if (line.team === teamId) {
                const code = line.lineCode || line.id || line.name;
                if (code && !members.includes(code)) {
                    members.push(code);
                }
            }
        });
        
        // Also sync back to team.members if the core team object expects it
        team.members = members;
    });

    // Populate unassignedStaff by filtering lines that are unassigned
    state.unassignedStaff = allLines
        .filter(line => {
            const teamVal = line.team;
            return !teamVal || teamVal === "\\__none_\\_" || teamVal === "\\\\__none_\\\\\\_" || teamVal === "__none__";
        })
        .map(line => line.lineCode || line.id || line.name || line);

    console.log("Team Builder synced with legacy state:", {
        totalLines: allLines.length,
        unassigned: state.unassignedStaff.length,
        teamsCount: activeTeams.length
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
            <div class="team-card" style="border: 1px solid var(--term-green); margin-bottom: 15px; padding: 10px; background: rgba(0,20,0,0.2); border-radius: 6px;">
                <div style="font-weight: bold; border-bottom: 1px dashed var(--term-green); padding-bottom: 5px; margin-bottom: 8px; color: var(--term-green);">
                    ▶ ${teamName.toUpperCase()} [${membersList.length} / 4]
                </div>
                <div class="team-members-list" style="min-height: 40px; display: flex; flex-direction: column; gap: 5px;">
                    ${membersList.length === 0 
                        ? `<span style="color: var(--term-dim); font-style: italic;">[ NO STAFF ASSIGNED ]</span>` 
                        : membersList.map(member => `
                            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(51, 255, 51, 0.1); padding: 3px 6px; border-radius: 4px;">
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
            <div class="status-box" style="border: 1px dashed var(--term-amber); color: var(--term-amber); padding: 15px; text-align: center; background: rgba(240, 165, 0, 0.05); font-family: var(--mono); font-size: 0.85rem; border-radius: 6px;">
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
    const scheduler = window.mySchedulerInstance;
    
    // Find the line in core state and set its assigned team ID
    let targetLine = null;
    if (window.state && Array.isArray(window.state.lines)) {
        targetLine = window.state.lines.find(line => (line.lineCode || line.id || line.name) === memberName);
    }
    
    if (targetLine) {
        targetLine.team = teamId;
        console.log(`Updated core line ${memberName} team to ${teamId}`);
    }

    // Trigger full scheduler re-render which syncs and updates both panels
    if (scheduler && typeof scheduler.renderAll === 'function') {
        scheduler.renderAll();
    } else {
        syncStateWithLegacy(scheduler);
        renderTeamBuilder();
    }
}

function removeStaffFromTeam(memberName, teamId) {
    const scheduler = window.mySchedulerInstance;
    
    // Reset core line's team parameter to unassigned
    let targetLine = null;
    if (window.state && Array.isArray(window.state.lines)) {
        targetLine = window.state.lines.find(line => (line.lineCode || line.id || line.name) === memberName);
    }
    
    if (targetLine) {
        targetLine.team = "\\__none_\\_";
        console.log(`Updated core line ${memberName} team to unassigned`);
    }

    // Trigger full scheduler re-render
    if (scheduler && typeof scheduler.renderAll === 'function') {
        scheduler.renderAll();
    } else {
        syncStateWithLegacy(scheduler);
        renderTeamBuilder();
    }
}

// ==========================================
// 4. AUTO-FORMING ALGORITHM
// ==========================================
function autoFormTeams() {
    const scheduler = window.mySchedulerInstance;
    
    let allLines = [];
    if (window.state && Array.isArray(window.state.lines)) {
        allLines = window.state.lines;
    } else if (scheduler && Array.isArray(scheduler.lines)) {
        allLines = scheduler.lines;
    }
    
    if (allLines.length === 0) {
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

    // Filter out unassigned lines
    const unassignedLines = allLines.filter(line => {
        const teamVal = line.team;
        return !teamVal || teamVal === "\\__none_\\_" || teamVal === "\\\\__none_\\\\\\_" || teamVal === "__none__";
    });

    const stsoPool = unassignedLines.filter(line => (line.role || "").toUpperCase() === "STSO");
    const ltsoPool = unassignedLines.filter(line => (line.role || "").toUpperCase() === "LTSO");
    const tsoPool = unassignedLines.filter(line => (line.role || "").toUpperCase() === "TSO" || !(line.role));

    // Clear existing assignments for the active teams first in the core lines
    activeTeams.forEach(team => {
        allLines.forEach(line => {
            if (line.team === team.id) {
                line.team = "\\__none_\\_";
            }
        });
    });

    // Distribute among the active teams in core lines
    activeTeams.forEach(team => {
        const teamId = team.id;
        let assignedCount = 0;

        // Assign STSOs
        for (let i = 0; i < archStso; i++) {
            if (stsoPool.length > 0 && assignedCount < 4) {
                const line = stsoPool.shift();
                line.team = teamId;
                assignedCount++;
            }
        }
        // Assign LTSOs
        for (let i = 0; i < archLtso; i++) {
            if (ltsoPool.length > 0 && assignedCount < 4) {
                const line = ltsoPool.shift();
                line.team = teamId;
                assignedCount++;
            }
        }
        // Assign TSOs
        for (let i = 0; i < archTso; i++) {
            if (tsoPool.length > 0 && assignedCount < 4) {
                const line = tsoPool.shift();
                line.team = teamId;
                assignedCount++;
            }
        }
    });

    // Re-render
    if (scheduler && typeof scheduler.renderAll === 'function') {
        scheduler.renderAll();
    } else {
        syncStateWithLegacy(scheduler);
        renderTeamBuilder();
    }
    console.log("Operational teams auto-formed dynamically in core state.");
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
