import { pool } from '../stores/teamBuilderStore.js';
import { assignedIds } from '../utils/pool.js';
import { teams } from '../stores/teamBuilderStore.js';
import { teamMemberCounts } from '../utils/team.js';

function computeTeamStats() {
    const assigned = assignedIds();
    const total = pool.length;
    let assignedN = 0;
    pool.forEach(p => { if (assigned.has(p.id)) assignedN++; });

    const teamRows = teams.map(t => ({
        id: t.id,
        name: t.name || t.id,
        counts: teamMemberCounts(t),
        followMe: !!t.followMe
    }));

    return { total, assigned: assignedN, unassigned: total - assignedN, teamRows };
}

export function renderTeamStats() {
    const body = document.getElementById("team-stats-body");
    if (!body) return;

    const s = computeTeamStats();
    const pct = s.total ? Math.round((100 * s.assigned) / s.total) : 0;

    function roleBits(c) {
        return ["STSO", "LTSO", "TSO"].map(r => {
            const m = c[r].M, f = c[r].F;
            if (!m && !f) return "";
            return `${r} <span class="sex-m">${m}M</span>/<span class="sex-f">${f}F</span>`;
        }).filter(Boolean).join(" · ");
    }

    const rows = s.teamRows.map(row => {
        const bits = roleBits(row.counts) || "—";
        const c = row.counts;
        const allM = c.STSO.M + c.LTSO.M + c.TSO.M;
        const allF = c.STSO.F + c.LTSO.F + c.TSO.F;
        const fPct = allM + allF ? Math.round((100 * allF) / (allM + allF)) : 0;
        return `<div class="team-stat-team-line"><strong>${String(row.name).replace(/</g, "&lt;")}</strong> <span class="muted">(${row.counts.total} · ${fPct}%F)</span> ${bits}${row.followMe ? ' <span class="team-follow-badge">follow</span>' : ""}</div>`;
    }).join("");

    body.innerHTML = `
        <div class="team-stat-summary">
            <div><strong>${s.assigned}</strong> / ${s.total} assigned (${pct}%)</div>
            <div class="muted">${s.unassigned} still in pool</div>
            <div class="team-stat-bar"><div class="team-stat-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="team-stat-teams">${rows || '<p class="muted">No teams yet.</p>'}</div>`;
}
