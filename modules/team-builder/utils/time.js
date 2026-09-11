export function startOf(line) {
    const S = window.Scheduler; // Bridge
    const sh = S.getShift ? S.getShift(line.shiftId) : null;
    return sh ? S.timeToMin(sh.start) : 0;
}

export function startLabel(line) {
    const S = window.Scheduler; // Bridge
    const sh = S.getShift ? S.getShift(line.shiftId) : null;
    return sh ? sh.start : "—";
}

export function startMins(p) {
    if (p && p.startMin != null && p.startMin !== "") return +p.startMin;
    const m = String(p && p.start || "").match(/^(\d{1,2}):(\d{2})/);
    if (!m) return null;
    return (+m[1]) * 60 + (+m[2]);
}

export function startsClose(a, b, windowMin) {
    const ma = startMins(a), mb = startMins(b);
    if (ma == null || mb == null) return String(a.start || "") === String(b.start || "");
    const diff = Math.abs(ma - mb);
    return Math.min(diff, 24 * 60 - diff) <= windowMin;
}
