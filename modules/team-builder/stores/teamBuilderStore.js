'''
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

export function createTeam(name) {
    const n = teamSeq++;
    const width = Math.max(2, String(teams.length + 1).length);
    const t = {
        id: "T" + n,
        name: name != null && name !== "" ? String(name) : padTeamNum(n, width),
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
    teams = teams.filter(t => t.id !== id);
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

    // Remove from any other team first
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

    let n = 0;
    ids.forEach(id => {
        if (addMemberToTeam(targetTeamId, id)) n++;
    });
    clearSelection();
}
'''
