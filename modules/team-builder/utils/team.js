import { teams } from '../stores/teamBuilderStore.js';
import { teamPhaseInfo } from './phase.js';
import { memberLine } from './pool.js';

export function sexOf(p) {
    return p && p.sex === "F" ? "F" : "M";
}

export function roleOf(line) {
    if (line.isStso) return "STSO";
    if (line.isLtso) return "LTSO";
    return "TSO";
}

export function rdoKey(line) {
    return (line.rdoDays || []).slice().sort((a, b) => a - b).join(",");
}

export function rdoLabel(line) {
    const S = window.Scheduler; // Bridge
    const days = S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const k = rdoKey(line);
    if (!k) return "—";
    return k.split(",").map(i => days[+i] || i).join(",");
}

export function teamMemberCounts(team) {
    const c = { STSO: { M: 0, F: 0 }, LTSO: { M: 0, F: 0 }, TSO: { M: 0, F: 0 }, total: 0 };
    (team.members || []).forEach(mid => {
        const p = memberLine(mid);
        if (!p) return;
        c.total++;
        const role = p.role === "STSO" || p.role === "LTSO" ? p.role : "TSO";
        c[role][sexOf(p)]++;
    });
    return c;
}

export function renumberTeamsByStart() {
    teams.sort((a, b) => {
        const ia = teamPhaseInfo(a);
        const ib = teamPhaseInfo(b);
        if (ia.rank !== ib.rank) return ia.rank - ib.rank;
        if (ia.startMin !== ib.startMin) return ia.startMin - ib.startMin;
        return String(a.id).localeCompare(String(b.id));
    });
    const width = Math.max(2, String(teams.length).length);
    teams.forEach((t, i) => {
        const info = teamPhaseInfo(t);
        t.phase = info.phase;
        t.name = String(i + 1).padStart(width, '0');
    });
}

export function teamAnchorMeta(team) {
    let best = null, bestMin = 24 * 60;
    (team.members || []).forEach(mid => {
        const p = memberLine(mid);
        if (!p) return;
        const sm = p.startMin != null ? p.startMin : 24 * 60;
        if (sm < bestMin) {
            bestMin = sm;
            best = p;
        }
    });
    if (!best) return { rdo: "—", start: "—", shift: "—" };
    return {
        rdo: best.rdoLabel || "—",
        start: best.start || "—",
        shift: best.shiftName || best.shiftId || "—"
    };
}

export function teamSexTotals(team) {
    const c = teamMemberCounts(team);
    const m = c.STSO.M + c.LTSO.M + c.TSO.M;
    const f = c.STSO.F + c.LTSO.F + c.TSO.F;
    return { m, f, t: m + f };
}

export function teamSexBarHtml(sex) {
    const tot = sex.t;
    const mPct = tot ? Math.round((100 * sex.m) / tot) : 50;
    const fPct = tot ? 100 - mPct : 50;
    return `<div class="team-sex-bar" style="display:flex;height:4px;border-radius:2px;overflow:hidden;margin-top:0.25rem;background:#2a2a2a">
        <span style="width:${mPct}%;background:#3b82f6"></span>
        <span style="width:${fPct}%;background:#ec4899"></span>
    </div>`;
}
