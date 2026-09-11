import { pool, teams, formOpts, createTeam } from '../stores/teamBuilderStore.js';
import { collectTeamPool, memberLine } from './pool.js';
import { renumberTeamsByStart, teamMemberCounts, sexOf } from './team.js';
import { startMins, startsClose } from './time.js';

function parseRdoDays(p) {
    if (p && Array.isArray(p.rdoDays)) return p.rdoDays.map(Number).filter(d => d >= 0 && d <= 6);
    if (p && Array.isArray(p.line && p.line.rdoDays)) return p.line.rdoDays.map(Number).filter(d => d >= 0 && d <= 6);
    const raw = (p && p.rdo != null) ? String(p.rdo) : "";
    if (!raw) return [];
    return raw.split(/[/,]+/).map(x => parseInt(x, 10)).filter(d => d >= 0 && d <= 6);
}

function rdoOverlap(a, b) {
    const da = parseRdoDays(a), db = parseRdoDays(b);
    const set = new Set(da);
    let n = 0;
    db.forEach(d => { if (set.has(d)) n++; });
    return n;
}

function rdoExact(a, b) {
    const ka = parseRdoDays(a).slice().sort().join(",");
    const kb = parseRdoDays(b).slice().sort().join(",");
    return ka === kb && ka !== "";
}

function teamSexScore(team, candidate) {
    const c = teamMemberCounts(team);
    let m = c.STSO.M + c.LTSO.M + c.TSO.M;
    let f = c.STSO.F + c.LTSO.F + c.TSO.F;
    if (sexOf(candidate) === "F") f++; else m++;
    return Math.abs(m - f) / Math.max(1, m + f);
}

function roleSexScore(team, role, candidate) {
    const c = teamMemberCounts(team);
    let m = c[role].M;
    let f = c[role].F;
    if (sexOf(candidate) === "F") f++; else m++;
    return Math.abs(m - f) / Math.max(1, m + f);
}


export function autoFormTeams() {
    collectTeamPool();
    if (!pool.length) return;

    const S = window.Scheduler; // Bridge for UI elements
    const stsoPer = Math.max(0, +(S.$("arch-stso") && S.$("arch-stso").value) || 1);
    const ltsoPer = Math.max(0, +(S.$("arch-ltso") && S.$("arch-ltso").value) || 0);
    const tsoPer = Math.max(0, +(S.$("arch-tso") && S.$("arch-tso").value) || 0);
    const windowMin = formOpts.startWindowMin;
    const allowOne = formOpts.allowOneRdo;

    const byRole = { STSO: [], LTSO: [], TSO: [] };
    pool.forEach(p => { (byRole[p.role] || byRole.TSO).push(p); });

    const nTeams = byRole.STSO.length;
    if (!nTeams) return;

    teams.length = 0; // Clear existing teams
    for (let i = 0; i < nTeams; i++) createTeam();

    const used = {};
    byRole.STSO.sort((a, b) => (startMins(a) ?? 0) - (startMins(b) ?? 0) || String(a.rdo || "").localeCompare(String(b.rdo || "")));
    byRole.STSO.forEach((p, idx) => {
        const team = teams[idx];
        if (!team) return;
        team.members.push(p.id);
        used[p.id] = true;
    });

    renumberTeamsByStart();

    teams.forEach(team => {
        const anchor = memberLine(team.members[0]);
        if (!anchor) return;

        ["STSO", "LTSO", "TSO"].forEach(role => {
            const c = teamMemberCounts(team);
            const have = c[role].M + c[role].F;
            const target = role === "STSO" ? stsoPer : role === "LTSO" ? ltsoPer : tsoPer;
            const need = Math.max(0, target - have);
            if (need === 0) return;

            const candidates = byRole[role].filter(p => !used[p.id]);
            const scored = candidates.map(p => {
                let q = 0;
                if (startsClose(p, anchor, windowMin)) {
                    if (rdoExact(p, anchor)) q = 3;
                    else if (allowOne && rdoOverlap(p, anchor) >= 1) q = 1;
                }
                return { p, q, opp: (role === "LTSO" && sexOf(p) !== sexOf(anchor)) ? 1 : 0, teamSex: teamSexScore(team, p), roleSex: roleSexScore(team, role, p) };
            }).filter(c => c.q > 0);

            scored.sort((a, b) => b.q - a.q || b.opp - a.opp || a.teamSex - b.teamSex || a.roleSex - b.roleSex);
            scored.slice(0, need).forEach(item => {
                team.members.push(item.p.id);
                used[item.p.id] = true;
            });
        });
    });
}
