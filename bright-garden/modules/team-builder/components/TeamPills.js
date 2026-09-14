import { teams } from '../stores/teamBuilderStore.js';
import { teamPhaseInfo } from '../utils/phase.js';
import { teamAnchorMeta, teamSexTotals, teamSexBarHtml } from '../utils/team.js';

export function teamSummaryHtml(t, opts = {}) {
    const pinned = !!t.followMe;
    const meta = teamAnchorMeta(t);
    const sex = teamSexTotals(t);
    const name = String(t.name || t.id).replace(/</g, "&lt;");

    return `<button type="button" class="btn team-summary-pill${pinned ? " is-pinned" : ""}" data-pin-team="${t.id}" title="${pinned ? "Unpin " : "Pin "}${name}" style="display:flex;flex-direction:column;align-items:stretch;text-align:left;padding:0.35rem 0.45rem;min-width:0;${pinned ? "outline:1px solid #60a5fa;" : ""}">
        <strong style="font-size:0.85rem">${name}${opts.badge && pinned ? " · pinned" : ""}</strong>
        <span class="muted" style="font-size:0.72rem">RDO ${meta.rdo}</span>
        <span class="muted" style="font-size:0.72rem">${meta.shift} · ${meta.start}</span>
        <span style="font-size:0.72rem"><span class="sex-m">${sex.m}M</span>/<span class="sex-f">${sex.f}F</span> · ${sex.t}T</span>
        ${teamSexBarHtml(sex)}
    </button>`;
}

function ensureTeamPicklist() {
    let existing = document.getElementById("team-picklist");
    if (existing) return existing;

    const poolEl = document.getElementById("team-pool");
    if (!poolEl || !poolEl.parentNode) return null;

    const wrap = document.createElement("div");
    wrap.id = "team-picklist";
    wrap.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;margin-bottom:0.75rem;";
    wrap.innerHTML = `
        <div class="team-pick-panel">
            <div class="section-title" style="margin:0 0 0.35rem;font-size:0.8rem">Opening / AM</div>
            <div id="team-pills-am" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(8.6rem,1fr));gap:0.35rem"></div>
        </div>
        <div class="team-pick-panel">
            <div class="section-title" style="margin:0 0 0.35rem;font-size:0.8rem">PM / Closing</div>
            <div id="team-pills-pm" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(8.6rem,1fr));gap:0.35rem"></div>
        </div>`;
    poolEl.parentNode.insertBefore(wrap, poolEl);
    return wrap;
}

export function renderTeamPills() {
    ensureTeamPicklist();
    const amEl = document.getElementById("team-pills-am");
    const pmEl = document.getElementById("team-pills-pm");

    const am = [], pm = [];
    (teams || []).forEach(t => {
        const info = teamPhaseInfo(t);
        if (info.phase === "PM" || info.phase === "Closing") {
            pm.push(t);
        } else {
            am.push(t);
        }
    });

    if (amEl) amEl.innerHTML = am.length ? am.map(t => teamSummaryHtml(t)).join("") : '<span class="muted" style="font-size:0.75rem">No AM teams</span>';
    if (pmEl) pmEl.innerHTML = pm.length ? pm.map(t => teamSummaryHtml(t)).join("") : '<span class="muted" style="font-size:0.75rem">No PM teams</span>';
}
