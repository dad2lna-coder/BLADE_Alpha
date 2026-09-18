import { memberLine } from '../utils/pool.js';
import { getTeamById } from '../stores/teamBuilderStore.js';
import { teamMemberCounts } from '../utils/team.js';
import { lineCardHtml } from './LineCard.js';

/** Team ids whose member lists are currently painted. Compact-by-default. */
export const expandedTeamIds = new Set();

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

function compactHintHtml(team) {
    const n = (team.members && team.members.length) || 0;
    return `<div class="team-board-compact muted">${n} member${n === 1 ? "" : "s"} — expand</div>`;
}

function membersHtmlFor(team) {
    const html = (team.members || []).map(mid => {
        const p = memberLine(mid);
        return p ? lineCardHtml(p, { removable: true, teamId: team.id }) : "";
    }).join("");
    return html || '<div class="team-board-empty muted">Drag lines here</div>';
}

export function paintTeamMembers(teamId) {
    const team = getTeamById(teamId);
    const list = document.querySelector('.team-board-list[data-team-id="' + teamId + '"]');
    if (!team || !list) return;
    expandedTeamIds.add(String(teamId));
    list.setAttribute("data-members-painted", "1");
    list.innerHTML = membersHtmlFor(team);
}

export function collapseTeamMembers(teamId) {
    const team = getTeamById(teamId);
    const list = document.querySelector('.team-board-list[data-team-id="' + teamId + '"]');
    expandedTeamIds.delete(String(teamId));
    if (!list) return;
    list.removeAttribute("data-members-painted");
    list.innerHTML = team ? compactHintHtml(team) : "";
}

export function restoreExpandedBoards() {
    expandedTeamIds.forEach(function (id) {
        const details = document.querySelector('.team-board[data-team-id="' + id + '"]');
        if (details) details.open = true;
        paintTeamMembers(id);
    });
}

export function teamBoardHtml(t) {
    const expanded = expandedTeamIds.has(String(t.id));
    const body = expanded ? membersHtmlFor(t) : compactHintHtml(t);
    return `<details class="team-board card" data-team-id="${t.id}"${expanded ? " open" : ""}>
        <summary class="team-board-head section-title">
            <input type="text" class="team-name-input" value="${String(t.name || "").replace(/"/g, "&quot;")}" data-team-id="${t.id}" onclick="event.stopPropagation()">
            ${teamCountsHeaderHtml(t)}
            <div class="team-board-actions">
                <label class="follow-me-label" title="Follow Me (dock this team on screen)" onclick="event.stopPropagation()"><input type="checkbox" data-team-follow="${t.id}" ${t.followMe ? "checked" : ""}> Follow</label>
                <button type="button" class="btn btn-red" data-remove-team="${t.id}">✕</button>
            </div>
        </summary>
        <div class="team-board-list" data-team-id="${t.id}"${expanded ? " data-members-painted=\"1\"" : ""}>${body}</div>
    </details>`;
}
