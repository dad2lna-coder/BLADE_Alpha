/**
 * Interactive 1:1 M<->F shift seat swap planner and engine.
 */

import { getLinesForClass, getAvailableClasses, formatRdos } from "./rebalanceFt.js";

export function getLinesForSwapClass(lines, classKey) {
  return getLinesForClass(lines, classKey);
}

export function proposeSexSwaps(S, classKey, selectedShiftIds) {
  if (!S || !S.state) return { proposals: [], error: "No Scheduler state" };

  if (!Array.isArray(selectedShiftIds) || selectedShiftIds.length < 2) {
    return { proposals: [], error: "Select at least 2 shifts to swap seats." };
  }

  var lines = S.state.lines || [];
  var allShifts = S.state.shifts || [];

  var selectedShifts = allShifts.filter(function (s) {
    return selectedShiftIds.indexOf(s.id) >= 0;
  });

  if (selectedShifts.length < 2) {
    return { proposals: [], error: "Select at least 2 valid shifts to swap seats." };
  }

  var classLines = getLinesForSwapClass(lines, classKey).filter(function (l) {
    return selectedShiftIds.indexOf(l.shiftId) >= 0 && !(S.isLineScheduleLocked && S.isLineScheduleLocked(l));
  });

  if (!classLines.length) {
    return { proposals: [], error: "No lines in selected class on selected shifts." };
  }

  // Group lines by shiftId and sex
  var shiftM = {};
  var shiftF = {};
  selectedShifts.forEach(function (s) {
    shiftM[s.id] = classLines.filter(function (l) { return l.shiftId === s.id && l.sex === "M"; });
    shiftF[s.id] = classLines.filter(function (l) { return l.shiftId === s.id && l.sex === "F"; });
  });

  // Target female share across selected shifts
  var totalCount = classLines.length;
  var totalF = classLines.filter(function (l) { return l.sex === "F"; }).length;
  var targetFShare = totalCount > 0 ? totalF / totalCount : 0.5;

  var swapPairs = [];

  // Helper to compute RDO after for a line moving to a target shift
  function computeRdoAfter(line, targetShift) {
    var rdoBefore = line.rdoDays || [];
    var rdoAfter = rdoBefore.slice();
    var note = "Shift seat swap";

    var hard = Array.isArray(targetShift.rdoHard) ? targetShift.rdoHard.map(Number).filter(function (x) { return x >= 0 && x <= 6; }) : [];
    if (hard.length > 0) {
      var missingHard = hard.filter(function (d) { return rdoBefore.indexOf(d) < 0; });
      if (missingHard.length > 0) {
        rdoAfter = hard.slice();
        for (var d = 0; d < 7 && rdoAfter.length < rdoBefore.length; d++) {
          if (rdoAfter.indexOf(d) < 0) rdoAfter.push(d);
        }
        note = "Updated RDOs for hard RDO constraint";
      }
    }
    return { rdoBefore: rdoBefore, rdoAfter: rdoAfter, note: note };
  }

  var usedLineIds = {};

  // Pair shifts: look for shift A with M surplus / M available and shift B with F surplus / F available
  var changed = true;
  while (changed) {
    changed = false;

    // Rank shifts by female share ascending (most M-heavy first) and descending (most F-heavy first)
    var mHeavyShifts = selectedShifts.slice().sort(function (sa, sb) {
      var mA = shiftM[sa.id].length, fA = shiftF[sa.id].length, totA = mA + fA;
      var mB = shiftM[sb.id].length, fB = shiftF[sb.id].length, totB = mB + fB;
      var shareA = totA > 0 ? fA / totA : targetFShare;
      var shareB = totB > 0 ? fB / totB : targetFShare;
      return shareA - shareB;
    });

    var fHeavyShifts = selectedShifts.slice().sort(function (sa, sb) {
      var mA = shiftM[sa.id].length, fA = shiftF[sa.id].length, totA = mA + fA;
      var mB = shiftM[sb.id].length, fB = shiftF[sb.id].length, totB = mB + fB;
      var shareA = totA > 0 ? fA / totA : targetFShare;
      var shareB = totB > 0 ? fB / totB : targetFShare;
      return shareB - shareA;
    });

    for (var i = 0; i < mHeavyShifts.length && !changed; i++) {
      var shiftA = mHeavyShifts[i];

      // Find unused M line on shiftA
      var lineM = shiftM[shiftA.id].find(function (l) { return !usedLineIds[l.id]; });
      if (!lineM) continue;

      for (var j = 0; j < fHeavyShifts.length && !changed; j++) {
        var shiftB = fHeavyShifts[j];
        if (shiftA.id === shiftB.id) continue;

        // Find unused F line on shiftB
        var lineF = shiftF[shiftB.id].find(function (l) { return !usedLineIds[l.id]; });
        if (!lineF) continue;

        // Calculate female shares before swap
        var countA = classLines.filter(function (l) { return l.shiftId === shiftA.id; }).length;
        var countB = classLines.filter(function (l) { return l.shiftId === shiftB.id; }).length;
        var fA = shiftF[shiftA.id].length;
        var fB = shiftF[shiftB.id].length;
        var shareA = countA > 0 ? fA / countA : targetFShare;
        var shareB = countB > 0 ? fB / countB : targetFShare;

        // Swap is beneficial if shiftA is M-heavy (shareA <= targetFShare) and shiftB is F-heavy (shareB >= targetFShare)
        if (shareA <= targetFShare || shareB >= targetFShare || (shareA < shareB)) {
          usedLineIds[lineM.id] = true;
          usedLineIds[lineF.id] = true;

          // Remove lineM and lineF from candidates
          shiftM[shiftA.id] = shiftM[shiftA.id].filter(function (l) { return l.id !== lineM.id; });
          shiftF[shiftB.id] = shiftF[shiftB.id].filter(function (l) { return l.id !== lineF.id; });

          var mRes = computeRdoAfter(lineM, shiftB);
          var fRes = computeRdoAfter(lineF, shiftA);

          var notes = "Seat exchange between " + (shiftA.name || shiftA.id) + " and " + (shiftB.name || shiftB.id);
          if (mRes.note.includes("hard") || fRes.note.includes("hard")) {
            notes += " (Hard RDO updated)";
          }

          swapPairs.push({
            lineM: lineM,
            lineF: lineF,
            shiftA: shiftA,
            shiftB: shiftB,
            rdoMBefore: mRes.rdoBefore,
            rdoMAfter: mRes.rdoAfter,
            rdoFBefore: fRes.rdoBefore,
            rdoFAfter: fRes.rdoAfter,
            notes: notes
          });

          changed = true;
        }
      }
    }
  }

  if (!swapPairs.length) {
    return { proposals: [], error: "No M<->F seat swap pairs available across selected shifts." };
  }

  return { proposals: swapPairs, error: null };
}

export function approveSexSwaps(S, swapPairs) {
  if (!S || !S.state) return false;
  S.state.issues = S.state.issues || [];

  if (!Array.isArray(swapPairs) || swapPairs.length === 0) {
    var msg0 = "No swap pairs checked to approve.";
    if (S.updateStatus) S.updateStatus(msg0);
    return false;
  }

  var shifts = S.state.shifts || [];
  var lines = S.state.lines || [];

  var swappedCount = 0;
  var days = S.state.weekCount ? S.state.weekCount * 7 : 7;

  swapPairs.forEach(function (pair) {
    var lineM = lines.find(function (l) { return String(l.id) === String(pair.lineMId); });
    var lineF = lines.find(function (l) { return String(l.id) === String(pair.lineFId); });
    if (!lineM || !lineF) return;
    if (S.isLineScheduleLocked && (S.isLineScheduleLocked(lineM) || S.isLineScheduleLocked(lineF))) return;

    var shiftA = shifts.find(function (s) { return s.id === pair.shiftAId; });
    var shiftB = shifts.find(function (s) { return s.id === pair.shiftBId; });
    if (!shiftA || !shiftB) return;

    // Line M moves to Shift B
    lineM.shiftId = shiftB.id;
    lineM.shiftName = shiftB.name;
    lineM.shiftLabel = S.shiftLabel ? S.shiftLabel(shiftB) : ((shiftB.start || "") + "–" + (shiftB.end || ""));
    if (lineM.startTime !== undefined) lineM.startTime = shiftB.start;
    if (lineM.endTime !== undefined) lineM.endTime = shiftB.end;
    if (lineM.start !== undefined) lineM.start = shiftB.start;
    if (lineM.end !== undefined) lineM.end = shiftB.end;
    if (Array.isArray(pair.rdoMAfter) && pair.rdoMAfter.length > 0) {
      lineM.rdoDays = pair.rdoMAfter.slice();
    }

    // Line F moves to Shift A
    lineF.shiftId = shiftA.id;
    lineF.shiftName = shiftA.name;
    lineF.shiftLabel = S.shiftLabel ? S.shiftLabel(shiftA) : ((shiftA.start || "") + "–" + (shiftA.end || ""));
    if (lineF.startTime !== undefined) lineF.startTime = shiftA.start;
    if (lineF.endTime !== undefined) lineF.endTime = shiftA.end;
    if (lineF.start !== undefined) lineF.start = shiftA.start;
    if (lineF.end !== undefined) lineF.end = shiftA.end;
    if (Array.isArray(pair.rdoFAfter) && pair.rdoFAfter.length > 0) {
      lineF.rdoDays = pair.rdoFAfter.slice();
    }

    // Rebuild schedules
    if (S.buildScheduleForLine && S.state.schedule) {
      S.state.schedule[lineM.id] = S.buildScheduleForLine(lineM, days);
      S.state.schedule[lineF.id] = S.buildScheduleForLine(lineF, days);
    }

    swappedCount++;
  });

  if (swappedCount === 0) {
    var msgNoSwap = "No M<->F seat swaps were made.";
    if (S.updateStatus) S.updateStatus(msgNoSwap);
    return false;
  }

  var statusMsg = "Swapped " + swappedCount + " M<->F pair(s) (" + (swappedCount * 2) + " lines).";
  if (S.updateStatus) S.updateStatus(statusMsg);
  if (typeof window !== "undefined" && window.alert) {
    window.alert(statusMsg);
  }

  // Re-assign cert pools if present
  if (S.assignCertPools) {
    try { S.assignCertPools(); } catch (e) { console.error("swapSex assignCertPools", e); }
  }

  // Refresh matrix & lines views
  if (S.renderRdoMatrixModal) S.renderRdoMatrixModal();
  if (S.renderAll) S.renderAll();
  if (S.renderLines) S.renderLines();
  if (S.__USE_SVELTE_LINES && typeof window !== "undefined") {
    try { window.dispatchEvent(new CustomEvent("lines:request-render")); } catch (e) {}
  }

  return true;
}

export function attachSwapSex(S) {
  if (!S) return;
  S.getLinesForSwapClass = function (classKey) { return getLinesForSwapClass((S.state && S.state.lines) || [], classKey); };
  S.getSwapAvailableClasses = function () { return getAvailableClasses(S); };
  S.proposeSexSwaps = function (classKey, selectedShiftIds) { return proposeSexSwaps(S, classKey, selectedShiftIds); };
  S.approveSexSwaps = function (swapPairs) { return approveSexSwaps(S, swapPairs); };
}
