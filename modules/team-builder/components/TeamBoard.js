import { memberLine } from '../utils/pool.js';
import { teamMemberCounts } from '../utils/team.js';
import { lineCardHtml } from './LineCard.js';

function teamCountsHeaderHtml(team) {
    const c = teamMemberCounts(team);
    function bit(role) {
        const m = c[role].M, f = c[role].F;
        if (!m && !f) return "";
        const tot = m + f;
        const fPct = tot ? Math.round((100 * f) / tot) : 0;
        return `<span class="team-count-chip">${role} <span class="sex-m">${m}M</span>/<span class="sex-f">${f}F</span> <span class="muted">(${fPct}%F)</span></span>`;
    }
    const allM = c.STSO.M + c.LTSO.M + c.TSO.M;
    const allF = c.STSO.F + c.LTSO.F + c.TSO.F;
    const allT = allM + allF;
    const overallF = allT ? Math.round((100 * allF) / allT) : 0;
    return `<span class="team-counts-header" title="Assigned by role and sex"><span class="team-count-total">${c.total}</span> <span class="team-count-chip">F% ${overallF}</span> ${bit("STSO")}${bit("LTSO")}${bit("TSO")}</span>`;
}

export function teamBoardHtml(t) {
    const membersHtml = t.members.map(mid => {
        const p = memberLine(mid);
        return p ? lineCardHtml(p, { removable: true, teamId: t.id }) : "";
    }).join("");

    return `<div class="team-board card" data-team-id="${t.id}">
        <div class="team-board-head section-title">
            <input type="text" class="team-name-input" value="${String(t.name || "").replace(/"/g, "&quot;")}" data-team-id="${t.id}">
            ${teamCountsHeaderHtml(t)}
            <div class="team-board-actions">
                <label class="follow-me-label" title="Follow Me (dock this team on screen)"><input type="checkbox" data-team-follow="${t.id}" ${t.followMe ? "checked" : ""}> Follow</label>
                <button type="button" class="btn btn-red" data-remove-team="${t.id}">✕</button>
            </div>
        </div>
        <div class="team-board-list" data-team-id="${t.id}">${membersHtml || '<div class="team-board-empty muted">Drag lines here</div>'}</div>
    </div>`;
}
