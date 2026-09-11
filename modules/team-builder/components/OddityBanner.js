import { teams } from '../stores/teamBuilderStore.js';
import { teamMemberCounts } from '../utils/team.js';

function archTarget() {
    const S = window.Scheduler;
    const stso = Math.max(0, +(S.$("arch-stso") && S.$("arch-stso").value) || 1);
    const ltso = Math.max(0, +(S.$("arch-ltso") && S.$("arch-ltso").value) || 0);
    const tso = Math.max(0, +(S.$("arch-tso") && S.$("arch-tso").value) || 0);
    return { stso, ltso, tso, size: stso + ltso + tso };
}

function teamOddities(team) {
    const flags = [];
    if (!team) return flags;
    const c = teamMemberCounts(team);
    const arch = archTarget();
    const fill = arch.size ? c.total / arch.size : 1;

    if (arch.size && fill < 0.7) flags.push({ code: "FILL", label: `${Math.round(fill * 100)}% filled` });
    if (arch.ltso > 0 && (c.LTSO.M + c.LTSO.F) < 1) flags.push({ code: "NOLTSO", label: "no LTSO" });

    const m = c.STSO.M + c.LTSO.M + c.TSO.M;
    const f = c.STSO.F + c.LTSO.F + c.TSO.F;
    const tot = m + f;
    if (tot >= 3 && Math.abs(m - f) / tot >= 0.4) flags.push({ code: "SEX", label: `${m}M/${f}F` });

    return flags;
}

function collectOddities() {
    const fill = [], noltso = [], sex = [];
    (teams || []).forEach(t => {
        const name = t.name || t.id;
        teamOddities(t).forEach(f => {
            if (f.code === "FILL") fill.push(name);
            if (f.code === "NOLTSO") noltso.push(name);
            if (f.code === "SEX") sex.push(name);
        });
    });
    return { fill, noltso, sex };
}

function ensureBanner() {
    let bar = document.getElementById("team-oddity-top");
    if (bar) return bar;
    bar = document.createElement("div");
    bar.id = "team-oddity-top";
    bar.style.cssText = "font-family:ui-monospace,Consolas,monospace;font-size:0.82rem;letter-spacing:0.06em;padding:0.4rem 1rem;border-bottom:1px solid #c47b2b55;background:#1a140c;color:#e8dcc8;pointer-events:none;";
    const header = document.querySelector(".console-header");
    if (header && header.parentNode) {
        header.parentNode.insertBefore(bar, header.nextSibling);
    } else {
        document.body.insertBefore(bar, document.body.firstChild);
    }
    return bar;
}

export function refreshTeamOddityBanner() {
    const bar = ensureBanner();
    if (!teams.length) {
        bar.style.display = "none";
        return;
    }
    bar.style.display = "block";
    const o = collectOddities();
    const n = o.fill.length + o.noltso.length + o.sex.length;

    if (!n) {
        bar.style.borderBottomColor = "#3d6b4555";
        bar.style.color = "#b7c9b0";
        bar.textContent = `TEAMS CHECK  OK  ·  ${teams.length} team(s)  ·  none under 70%  ·  all have LTSO  ·  sex split ok`;
        return;
    }

    bar.style.borderBottomColor = "#c47b2b";
    bar.style.color = "#e8dcc8";
    const parts = [];
    if (o.fill.length) parts.push(`${o.fill.length} under 70% (${o.fill.join(", ")})`);
    if (o.noltso.length) parts.push(`${o.noltso.length} no LTSO (${o.noltso.join(", ")})`);
    if (o.sex.length) parts.push(`${o.sex.length} sex split (${o.sex.join(", ")})`);
    bar.textContent = `TEAMS CHECK  ${parts.join("   ·   ")}`;
}
