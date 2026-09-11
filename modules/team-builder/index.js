/**
 * ▲ BLADE AIRPORT OPS v2.0 // TEAM BUILDER MODULE
 * PATH: /modules/team-builder/index.js
 * 
 * Directly synchronizes with the core application state (window.state.lines and
 * window.state.teams) to dynamically auto-form AM and PM teams, bind bid lines,
 * and update the native BLADE team boards and build controls.
 */

// ==========================================
// 1. APPLICATION STATE HELPERS
// ==========================================

/**
 * Retrieves the core application state safely.
 * @returns {object} The global state object
 */
function getAppState() {
    if (window.state && typeof window.state === "object") {
        return window.state;
    }
    if (window.mySchedulerInstance && window.mySchedulerInstance.state) {
        return window.mySchedulerInstance.state;
    }
    if (window.Scheduler && window.Scheduler.state) {
        return window.Scheduler.state;
    }
    return {};
}

/**
 * Returns all bid lines currently registered in the application.
 * @returns {Array} Array of bid line objects
 */
function getLines() {
    const appState = getAppState();
    if (Array.isArray(appState.lines)) {
        return appState.lines;
    }
    if (window.mySchedulerInstance && Array.isArray(window.mySchedulerInstance.lines)) {
        return window.mySchedulerInstance.lines;
    }
    return [];
}

/**
 * Returns all active operational teams (AM and PM).
 * @returns {Array} Array of team objects
 */
function getTeams() {
    const appState = getAppState();
    if (!Array.isArray(appState.teams)) {
        appState.teams = [];
    }
    return appState.teams;
}

/**
 * Determines whether a line belongs to the AM or PM phase based on its shift timing.
 * @param {object} line - The bid line object
 * @returns {string} "AM" or "PM"
 */
function getLinePhase(line) {
    if (line.phase) return String(line.phase).toUpperCase();
    if (line.ampm) return String(line.ampm).toUpperCase();

    const shiftStr = String(line.shift || line.shiftId || line.start || line.window || "");
    const match = shiftStr.match(/(\d{1,2}):?(\d{2})/);
    if (match) {
        const hour = parseInt(match[1], 10);
        return hour < 12 ? "AM" : "PM";
    }
    if (/PM/i.test(shiftStr)) return "PM";
    return "AM";
}

/**
 * Determines if a line is currently unassigned to any team.
 * @param {object} line - The bid line object
 * @returns {boolean} True if unassigned
 */
function isLineUnassigned(line) {
    if (!line.team) return true;
    const t = String(line.team).trim();
    return t === "" || t === "__none__" || t === "\\__none_\\_" || t === "-";
}

/**
 * Returns the line's standardized role (STSO, LTSO, or TSO).
 * @param {object} line - The bid line object
 * @returns {string} The role code
 */
function getLineRole(line) {
    const r = String(line.role || line.emp || "").toUpperCase();
    if (r.includes("STSO")) return "STSO";
    if (r.includes("LTSO")) return "LTSO";
    return "TSO";
}

// ==========================================
// 2. AUTO-FORMING ALGORITHM (AM & PM)
// ==========================================

/**
 * Auto-forms AM and PM teams using the active bid lines according
 * to the supervisor/officer architecture inputs.
 */
export function autoFormTeams() {
    const lines = getLines();
    if (!lines || lines.length === 0) {
        alert("WARNING: No bid lines found.\n\nPlease go to the [F1] SETUP tab, configure your FTE staffing, and click the '[GEN] GENERATE' button first.");
        return;
    }

    const appState = getAppState();
    const archStso = parseInt(document.getElementById("arch-stso")?.value, 10) || 1;
    const archLtso = parseInt(document.getElementById("arch-ltso")?.value, 10) || 1;
    const archTso = parseInt(document.getElementById("arch-tso")?.value, 10) || 6;

    // Reset team assignments on all lines
    lines.forEach(line => {
        line.team = "__none__";
        line.teamId = null;
    });

    // Clear existing teams array
    appState.teams = [];

    // Bucket unassigned lines by Phase and Role
    const amBuckets = { STSO: [], LTSO: [], TSO: [] };
    const pmBuckets = { STSO: [], LTSO: [], TSO: [] };

    lines.forEach(line => {
        const phase = getLinePhase(line);
        const role = getLineRole(line);
        if (phase === "AM") {
            amBuckets[role].push(line);
        } else {
            pmBuckets[role].push(line);
        }
    });

    /**
     * Builds teams for a specific phase (AM or PM).
     * @param {string} phase - "AM" or "PM"
     * @param {object} buckets - Object containing STSO, LTSO, TSO arrays
     * @returns {Array} List of newly formed team objects
     */
    function buildPhaseTeams(phase, buckets) {
        const phaseTeams = [];
        const totalOfficers = buckets.TSO.length;
        const totalSup = buckets.STSO.length + buckets.LTSO.length;

        if (totalOfficers === 0 && totalSup === 0) {
            return phaseTeams;
        }

        // Calculate team count based on officer capacity and supervisor counts
        let teamCount = Math.ceil(totalOfficers / Math.max(1, archTso));
        if (archStso > 0 && buckets.STSO.length > 0) {
            const stsoTeams = Math.floor(buckets.STSO.length / archStso);
            if (stsoTeams > 0) teamCount = Math.max(teamCount, stsoTeams);
        }
        if (teamCount < 1) teamCount = 1;

        // Instantiate team objects
        for (let i = 1; i <= teamCount; i++) {
            const teamId = `team-${phase.toLowerCase()}-${i}`;
            const teamObj = {
                id: teamId,
                name: String(i),
                phase: phase,
                ampm: phase,
                timeOfDay: phase,
                lines: [],
                lineIds: []
            };
            phaseTeams.push(teamObj);
        }

        // Helper to distribute lines across teams
        function distribute(roleList, countPerTeam) {
            for (let c = 0; c < countPerTeam; c++) {
                phaseTeams.forEach(team => {
                    if (roleList.length > 0) {
                        const line = roleList.shift();
                        line.team = team.id;
                        line.teamId = team.id;
                        team.lines.push(line);
                        team.lineIds.push(line.id || line.lineCode || line.code);
                    }
                });
            }
        }

        // Distribute STSOs, LTSOs, and TSOs
        distribute(buckets.STSO, archStso);
        distribute(buckets.LTSO, archLtso);
        distribute(buckets.TSO, archTso);

        // Evenly balance remaining TSOs among teams
        let roundRobinIndex = 0;
        while (buckets.TSO.length > 0) {
            const team = phaseTeams[roundRobinIndex % phaseTeams.length];
            const line = buckets.TSO.shift();
            line.team = team.id;
            line.teamId = team.id;
            team.lines.push(line);
            team.lineIds.push(line.id || line.lineCode || line.code);
            roundRobinIndex++;
        }

        return phaseTeams;
    }

    const newAmTeams = buildPhaseTeams("AM", amBuckets);
    const newPmTeams = buildPhaseTeams("PM", pmBuckets);

    appState.teams = [...newAmTeams, ...newPmTeams];

    // Synchronize UI elements
    updateTeamCountHint();
    triggerNativeRenders();
    renderTeamBuilder();

    console.log(`Auto-form completed: ${appState.teams.length} teams built (${newAmTeams.length} AM, ${newPmTeams.length} PM).`);
}

// ==========================================
// 3. UI SYNCHRONIZATION & NATIVE RENDERS
// ==========================================

/**
 * Updates the team count hint element next to the Build button.
 */
function updateTeamCountHint() {
    const hint = document.getElementById("team-count-hint");
    if (!hint) return;

    const teams = getTeams();
    if (teams.length === 0) {
        hint.textContent = "No teams yet - click + New team";
        return;
    }

    const amCount = teams.filter(t => (t.phase || t.ampm || "").toUpperCase() === "AM").length;
    const pmCount = teams.filter(t => (t.phase || t.ampm || "").toUpperCase() === "PM").length;
    hint.textContent = `${teams.length} teams formed (${amCount} AM, ${pmCount} PM)`;
}

/**
 * Triggers all available core application renderers so that the
 * AM/PM boards and lines tables refresh immediately.
 */
function triggerNativeRenders() {
    const S = window.mySchedulerInstance || window.Scheduler;

    if (typeof window.renderTeams === "function") {
        try { window.renderTeams(); } catch (e) { console.warn("renderTeams:", e); }
    }
    if (window.teamCore && typeof window.teamCore.renderTeams === "function") {
        try { window.teamCore.renderTeams(); } catch (e) { console.warn("teamCore.renderTeams:", e); }
    }
    if (typeof window.renderLines === "function") {
        try { window.renderLines(); } catch (e) { console.warn("renderLines:", e); }
    }
    if (S && typeof S.renderAll === "function") {
        try { S.renderAll(); } catch (e) { console.warn("S.renderAll:", e); }
    } else if (typeof window.renderAll === "function") {
        try { window.renderAll(); } catch (e) { console.warn("renderAll:", e); }
    }

    // Refresh the team filter select in the Bid Lines tab
    const teamFilter = document.getElementById("lines-filter-team");
    if (teamFilter) {
        const teams = getTeams();
        const currentVal = teamFilter.value;
        teamFilter.innerHTML = `<option value="">All</option><option value="\\__none_\\_">Unassigned</option>`;
        teams.forEach(t => {
            const opt = document.createElement("option");
            opt.value = t.id;
            opt.textContent = `${t.phase || ""} Team ${t.name || t.id}`.trim();
            teamFilter.appendChild(opt);
        });
        teamFilter.value = currentVal;
    }
}

/**
 * Renders the supervisor dashboard summary inside the modular containers.
 */
function renderTeamBuilder() {
    const teamRoot = document.getElementById("team-builder-root");
    const poolRoot = document.getElementById("unassigned-pool-root");

    if (!teamRoot || !poolRoot) return;

    const lines = getLines();
    const teams = getTeams();

    const unassigned = lines.filter(isLineUnassigned);
    const unassignedTso = unassigned.filter(l => getLineRole(l) === "TSO").length;
    const unassignedLtso = unassigned.filter(l => getLineRole(l) === "LTSO").length;
    const unassignedStso = unassigned.filter(l => getLineRole(l) === "STSO").length;

    const amTeams = teams.filter(t => (t.phase || t.ampm || "").toUpperCase() === "AM");
    const pmTeams = teams.filter(t => (t.phase || t.ampm || "").toUpperCase() === "PM");

    // --- RENDER ALLOCATOR STATUS CARDS ---
    teamRoot.innerHTML = `
        <div class="team-card" style="border: 1px solid var(--term-green); padding: 12px; background: rgba(0, 30, 0, 0.3); border-radius: 6px;">
            <div style="font-weight: bold; border-bottom: 1px dashed var(--term-green); padding-bottom: 5px; margin-bottom: 8px; color: var(--term-green); font-family: var(--mono);">
                ▶ AM TEAMS DEPLOYMENT [${amTeams.length} TEAMS]
            </div>
            <div style="font-size: 0.85rem; color: var(--text);">
                ${amTeams.length === 0 
                    ? `<span style="color: var(--term-dim); font-style: italic;">[ NO AM TEAMS FORMED ]</span>` 
                    : amTeams.map(t => {
                        const count = Array.isArray(t.lines) ? t.lines.length : (Array.isArray(t.lineIds) ? t.lineIds.length : 0);
                        return `<span class="badge badge-am" style="margin: 2px 4px 2px 0;">AM Team ${t.name}: ${count} lines</span>`;
                    }).join(' ')
                }
            </div>
        </div>

        <div class="team-card" style="border: 1px solid var(--term-green); padding: 12px; background: rgba(0, 30, 0, 0.3); border-radius: 6px;">
            <div style="font-weight: bold; border-bottom: 1px dashed var(--term-green); padding-bottom: 5px; margin-bottom: 8px; color: var(--term-green); font-family: var(--mono);">
                ▶ PM TEAMS DEPLOYMENT [${pmTeams.length} TEAMS]
            </div>
            <div style="font-size: 0.85rem; color: var(--text);">
                ${pmTeams.length === 0 
                    ? `<span style="color: var(--term-dim); font-style: italic;">[ NO PM TEAMS FORMED ]</span>` 
                    : pmTeams.map(t => {
                        const count = Array.isArray(t.lines) ? t.lines.length : (Array.isArray(t.lineIds) ? t.lineIds.length : 0);
                        return `<span class="badge badge-pm" style="margin: 2px 4px 2px 0;">PM Team ${t.name}: ${count} lines</span>`;
                    }).join(' ')
                }
            </div>
        </div>
    `;

    // --- RENDER UNASSIGNED POOL STATUS ---
    if (unassigned.length === 0) {
        poolRoot.innerHTML = `
            <div class="status-box" style="border: 1px dashed var(--term-green); color: var(--term-green); padding: 10px; text-align: center; background: rgba(0, 30, 0, 0.2); font-family: var(--mono); font-size: 0.85rem; border-radius: 6px;">
                ✔ ALL ${lines.length} BID LINES ARE CURRENTLY ASSIGNED TO ACTIVE TEAMS.
            </div>
        `;
    } else {
        poolRoot.innerHTML = `
            <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center; justify-content: space-between; padding: 8px 12px; border: 1px dashed var(--term-amber); background: rgba(240, 165, 0, 0.08); border-radius: 6px; font-family: var(--mono); font-size: 0.85rem;">
                <span style="color: var(--term-amber); font-weight: bold;">⚡ UNALLOCATED LINES: ${unassigned.length} OF ${lines.length}</span>
                <span style="color: var(--text);">TSO: <b>${unassignedTso}</b> | LTSO: <b>${unassignedLtso}</b> | STSO: <b>${unassignedStso}</b></span>
            </div>
        `;
    }
}

// ==========================================
// 4. EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    const autoFormBtn = document.getElementById("btn-team-auto-form");
    if (autoFormBtn && !autoFormBtn._bound) {
        autoFormBtn._bound = true;
        autoFormBtn.addEventListener("click", (e) => {
            e.preventDefault();
            autoFormTeams();
        });
    }

    const buildBtn = document.getElementById("btn-team-build");
    if (buildBtn && !buildBtn._bound) {
        buildBtn._bound = true;
        buildBtn.addEventListener("click", () => {
            const teams = getTeams();
            if (teams.length === 0) {
                alert("Please click 'Auto-form teams' or '+ New team' before building the schedule.");
                return;
            }
            const docks = document.getElementById("team-follow-docks");
            if (docks) {
                docks.hidden = false;
                docks.classList.add("is-active");
            }
        });
    }

    const newTeamBtn = document.getElementById("btn-team-new");
    if (newTeamBtn && !newTeamBtn._bound) {
        newTeamBtn._bound = true;
        newTeamBtn.addEventListener("click", () => {
            setTimeout(() => {
                updateTeamCountHint();
                renderTeamBuilder();
            }, 100);
        });
    }
}

// ==========================================
// 5. LIFECYCLE HOOKS & MONKEY PATCH
// ==========================================
function installLegacyMonkeyPatch(schedulerInstance) {
    if (!schedulerInstance || typeof schedulerInstance.renderAll !== "function") return;
    if (schedulerInstance.renderAll._teamBuilderWrapped) return;

    const originalRenderAll = schedulerInstance.renderAll;

    schedulerInstance.renderAll = function(...args) {
        originalRenderAll.apply(this, args);
        updateTeamCountHint();
        renderTeamBuilder();
    };
    schedulerInstance.renderAll._teamBuilderWrapped = true;
}

// ==========================================
// 6. INITIALIZATION BRIDGE
// ==========================================
let teamBuilderInitialized = false;

export function initTeamBuilder(schedulerInstance) {
    if (teamBuilderInitialized) return;
    teamBuilderInitialized = true;

    window.mySchedulerInstance = schedulerInstance;

    setupEventListeners();
    installLegacyMonkeyPatch(schedulerInstance);
    updateTeamCountHint();
    renderTeamBuilder();

    console.log("Team Builder module successfully initialized and bridged to BLADE application state.");
}

// Expose globally for bootstrap script
window.initTeamBuilder = initTeamBuilder;
window.autoFormTeams = autoFormTeams;
