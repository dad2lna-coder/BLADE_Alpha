import { pool, filters, teams } from '../stores/teamBuilderStore.js';
import { getSelectedIds } from '../stores/teamBuilderStore.js';

export function renderTeamFilters() {
    const bar = document.getElementById("team-filters");
    if (!bar) return;

    const S = window.Scheduler; // Bridge for S.DAYS
    const starts = {};
    pool.forEach(p => { starts[p.start] = true; });
    const startOpts = '<option value="">All starts</option>' + Object.keys(starts).sort().map(s => `<option value="${s}"${filters.start === s ? " selected" : ""}>${s}</option>`).join("");

    const dayNames = S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const rdoOpts = '<option value="">Any RDO day</option>' + dayNames.map((name, i) => `<option value="${i}"${String(filters.rdo) === String(i) ? " selected" : ""}>${name}</option>`).join("");

    const teamOpts = '<option value="">— Select team —</option>' + teams.map(t => `<option value="${t.id}">${t.name || t.id}</option>`).join("");
    const selCount = getSelectedIds().length;

    bar.innerHTML = `
        <label>Role <select id="team-filter-role">
            <option value="ALL"${filters.role === "ALL" ? " selected" : ""}>All</option>
            <option value="TSO"${filters.role === "TSO" ? " selected" : ""}>TSO</option>
            <option value="LTSO"${filters.role === "LTSO" ? " selected" : ""}>LTSO</option>
            <option value="STSO"${filters.role === "STSO" ? " selected" : ""}>STSO</option>
        </select></label>
        <label>Start <select id="team-filter-start">${startOpts}</select></label>
        <label>RDO <select id="team-filter-rdo">${rdoOpts}</select></label>
        <button type="button" class="btn" id="btn-team-clear-filters">Clear filters</button>
        <span class="team-assign-bar">
            <label>Add selected to <select id="team-assign-target">${teamOpts}</select></label>
            <button type="button" class="btn btn-amber" id="btn-team-assign">Add to team${selCount ? ` (${selCount})` : ""}</button>
            <button type="button" class="btn" id="btn-team-select-all">Select all visible</button>
            <button type="button" class="btn" id="btn-team-clear-sel">Clear selection</button>
        </span>`;
}
