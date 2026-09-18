// Centralized state for the Team Builder module
export let teams = [];
export let pool = [];
export let filters = { role: "ALL", start: "", rdo: "" };
export let selected = {};
export let formOpts = { startWindowMin: 30, allowOneRdo: false };
export let buildOpen = false;

let teamSeq = 1;

function padTeamNum(n, width) {
    let w = width || 2;
    let s = String(n);
    while (s.length < w) s = "0" + s;
    return s;
}

export function setBuildOpen(v) {
    buildOpen = !!v;
}

/** Keep Scheduler.teams.teams pointing at THIS array. Never reassign `teams`. */
export function syncSchedulerBridge(S) {
    if (!S) return;
    S.teams = S.teams || {};
    S.teams.teams = teams;
}

export function replaceAllTeams(list) {
    teams.length = 0;
    (list || []).forEach(function (raw) {
        if (!raw || typeof raw !== "object") return;
        teams.push({
            id: raw.id,
            name: raw.name,
            members: Array.isArray(raw.members) ? raw.members.map(Number).filter(function (n) { return !isNaN(n); }) : [],
            followMe: !!raw.followMe,
            phase: raw.phase != null ? raw.phase : null,
            modSetId: raw.modSetId != null ? raw.modSetId : null
        });
    });
    var maxN = 0;
    teams.forEach(function (t) {
        var m = /^T(\d+)$/.exec(String(t.id || ""));
        if (m) maxN = Math.max(maxN, Number(m[1]));
    });
    teamSeq = Math.max(teamSeq, maxN + 1);
}

export function createTeam(name) {
    const n = teamSeq++;
    const width = Math.max(2, String(teams.length + 1).length);
    const t = {
        id: "T" + n,
        name: name != null && name !== "" ? String(name) : "Team " + padTeamNum(n, width),
        members: [],
        followMe: false,
        phase: null
    };
    teams.push(t);
    return t;
}

export function getTeamById(id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id === id) return teams[i];
    }
    return null;
}

export function removeTeam(id) {
    const idx = teams.findIndex(t => t.id === id);
    if (idx !== -1) teams.splice(idx, 1);
}

export function renameTeam(id, name) {
    const t = getTeamById(id);
    if (t) t.name = name;
}

export function addMemberToTeam(teamId, poolId) {
    const team = getTeamById(teamId);
    if (!team) return false;
    poolId = +poolId;

    if (team.members.indexOf(poolId) !== -1) return false;

    teams.forEach(t => {
        if (t.id !== teamId) {
            t.members = t.members.filter(m => m !== poolId);
        }
    });

    team.members.push(poolId);
    return true;
}

export function removeMemberFromTeam(teamId, poolId) {
    const team = getTeamById(teamId);
    if (!team) return;
    poolId = +poolId;
    team.members = team.members.filter(m => m !== poolId);
}

export function getSelectedIds() {
    return Object.keys(selected).filter(k => selected[k]).map(k => +k);
}

export function clearSelection() {
    selected = {};
}

export function assignSelectedToTeam(targetTeamId) {
    if (!targetTeamId) return;
    const ids = getSelectedIds();
    if (!ids.length) return;
    const team = getTeamById(targetTeamId);
    if (!team) return;

    const want = new Set(ids.map(Number));
    teams.forEach(t => {
        if (t.id === targetTeamId) return;
        t.members = (t.members || []).filter(m => !want.has(+m));
    });
    const have = new Set((team.members || []).map(Number));
    want.forEach(id => {
        if (!have.has(id)) {
            team.members.push(id);
            have.add(id);
        }
    });
    clearSelection();
}
