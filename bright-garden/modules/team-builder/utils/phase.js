import { memberLine } from './pool.js';

export function teamPhaseInfo(team) {
    const S = window.Scheduler; // Bridge
    let best = 24 * 60;
    let phase = "AM";
    const anchors = (S.computeShiftAnchors && S.computeShiftAnchors()) || { am: 8 * 60, pm: 14 * 60 };
    const thr = (S.state?.functionCoverage?.phaseThresholdMin) || 15;

    (team.members || []).forEach(mid => {
        const p = memberLine(mid);
        if (!p) return;

        const sm = p.startMin != null ? p.startMin : 0;
        if (sm < best) {
            best = sm;
            const sh = S.getShift && p.shiftId ? S.getShift(p.shiftId) : null;
            if (sh && sh.phase && sh.phase !== "auto") {
                const map = { opening: "Opening", am: "AM", pm: "PM", closing: "Closing" };
                phase = map[sh.phase] || "AM";
            } else if (S.phaseOfStart) {
                phase = S.phaseOfStart(sm, anchors, thr);
            } else {
                phase = sm < (anchors.pm || 14 * 60) ? "AM" : "PM";
            }
        }
    });

    const rank = { Opening: 0, AM: 1, PM: 2, Closing: 3 };
    return { startMin: best, phase, rank: rank[phase] ?? 1 };
}

export function isShiftAM(startMin) {
    return (startMin || 0) < 11 * 60;
}
