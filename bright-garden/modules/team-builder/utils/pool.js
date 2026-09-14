import { pool, filters, teams } from '../stores/teamBuilderStore.js';
import { roleOf, rdoKey, rdoLabel } from './team.js';
import { startOf, startLabel } from './time.js';

export function collectTeamPool() {
    const S = window.Scheduler; // Bridge
    const lines = (S.state && S.state.lines) ? S.state.lines : [];

    pool.length = 0; // Clear and repopulate
    lines.forEach(l => {
        pool.push({
            id: l.id,
            lineCode: l.lineCode || ("L" + l.id),
            role: roleOf(l),
            start: startLabel(l),
            startMin: startOf(l),
            rdo: rdoKey(l),
            rdoLabel: rdoLabel(l),
            sex: l.sex || "—",
            empClass: l.empClass || "",
            shiftId: l.shiftId,
            shiftName: (S.getShift && S.getShift(l.shiftId)) ? S.getShift(l.shiftId).name : l.shiftId,
            paid: l.paid || 0
        });
    });

    const valid = new Set(pool.map(p => p.id));
    teams.forEach(t => {
        t.members = (t.members || []).filter(m => valid.has(+m)).map(Number);
    });
}

export function getFilteredPool() {
    return pool.filter(p => {
        if (filters.role && filters.role !== "ALL" && p.role !== filters.role) return false;
        if (filters.start && p.start !== filters.start) return false;
        if (filters.rdo !== "" && filters.rdo != null) {
            const day = String(filters.rdo);
            const days = (p.rdo || "").split(",").filter(Boolean);
            if (days.indexOf(day) === -1) return false;
        }
        return true;
    });
}

export function memberLine(poolId) {
    poolId = +poolId;
    for (let i = 0; i < pool.length; i++) {
        if (pool[i].id === poolId) return pool[i];
    }
    return null;
}

export function assignedIds() {
    const set = new Set();
    teams.forEach(t => { t.members.forEach(m => set.add(m)); });
    return set;
}

export function unassignedPool() {
    const assigned = assignedIds();
    return getFilteredPool().filter(p => !assigned.has(p.id));
}

export function groupPoolByRole(list) {
    const groups = { TSO: [], LTSO: [], STSO: [] };
    list.forEach(p => {
        (groups[p.role] || groups.TSO).push(p);
    });
    return groups;
}
