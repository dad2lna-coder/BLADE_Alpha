/**
 * Interactive band-delta DFO people rebalance planner and engine.
 */

export function isDfoEligibleLine(l) {
  if (!l) return false;

  var isExtra = !!(l.isExtra || l.extraPositionId || (l.extraName && l.extraName !== "ESTI" && l.extraName !== "MSTI"));
  var isTraining = !!(l.isTraining || l.training || l.trainingClass || l.empClass === "ESTI" || l.empClass === "MSTI" || l.extraName === "ESTI" || l.extraName === "MSTI");
  if (isExtra || isTraining) return false;

  var fe = l.functionEligible || {};
  var isBagBlock = !!(fe.bag || fe.BAG);
  if (isBagBlock) return false;

  var isDfo = l.function === "DFO" || !!(fe.dfo || fe.DFO);
  return isDfo;
}

export function getDfoLinesForClass(lines, classKey) {
  if (!Array.isArray(lines)) return [];
  return lines.filter(function (l) {
    if (!isDfoEligibleLine(l)) return false;

    if (classKey === "STSO") {
      return l.isStso || l.empClass === "STSO" || l.position === "STSO";
    }
    if (classKey === "LTSO") {
      return l.isLtso || l.empClass === "LTSO" || l.position === "LTSO";
    }
    if (classKey === "TSO_FT") {
      return (l.empClass === "FT" || !l.empClass) && !l.isPt && l.empClass !== "PT" && !l.isStso && !l.isLtso && l.empClass !== "STSO" && l.empClass !== "LTSO";
    }
    if (classKey === "TSO_PT") {
      return (l.empClass === "PT" || l.isPt) && !l.isStso && !l.isLtso && l.empClass !== "STSO" && l.empClass !== "LTSO";
    }
    if (classKey === "TSO_ALL") {
      return !l.isStso && !l.isLtso && l.empClass !== "STSO" && l.empClass !== "LTSO";
    }
    return false;
  });
}

export function getDfoAvailableClasses() {
  return [
    { key: "TSO_ALL", label: "TSO — All" },
    { key: "TSO_FT", label: "TSO — FT" },
    { key: "TSO_PT", label: "TSO — PT" },
    { key: "STSO", label: "STSO" },
    { key: "LTSO", label: "LTSO" }
  ];
}

export function getDfoBandMin(S, shift, classKey) {
  if (!S || !shift) return "—";

  var role = "TSO";
  if (classKey === "STSO") role = "STSO";
  else if (classKey === "LTSO") role = "LTSO";

  var fc = S.state && S.state.functionCoverage;
  if (fc && fc.requirements && fc.requirements[role] && fc.requirements[role][shift.id]) {
    var req = fc.requirements[role][shift.id];
    if (req && req.min != null) return req.min;
  }

  var fcBands = (fc && fc.bands) || [];
  var fcBand = fcBands.find(function (b) { return b.shiftId === shift.id || b.shift === shift.name; });

  if (role === "STSO") {
    if (shift.stsoForce != null) return shift.stsoForce;
    if (fcBand && fcBand.stsoMin != null) return fcBand.stsoMin;
  } else if (role === "LTSO") {
    if (shift.ltsoForce != null) return shift.ltsoForce;
    if (fcBand && fcBand.ltsoMin != null) return fcBand.ltsoMin;
  } else {
    if (shift.force != null) return shift.force;
    if (fcBand && fcBand.tsoMin != null) return fcBand.tsoMin;
  }

  return "—";
}

var DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatRdos(rdoDays) {
  if (!Array.isArray(rdoDays) || !rdoDays.length) return "None";
  var sorted = rdoDays.slice().map(Number).sort(function (a, b) { return a - b; });
  return sorted.map(function (d) { return DAYS_SHORT[d] || d; }).join("-");
}

export function proposeDfoMoves(S, classKey, deltas) {
  if (!S || !S.state) return { proposals: [], error: "No Scheduler state" };

  var lines = S.state.lines || [];
  var shifts = S.state.shifts || [];
  var classLines = getDfoLinesForClass(lines, classKey);

  if (!classLines.length) {
    return { proposals: [], error: "No DFO-eligible lines in selected class" };
  }

  // Verify net deltas = 0
  var netDelta = 0;
  shifts.forEach(function (s) {
    netDelta += (deltas[s.id] || 0);
  });

  if (netDelta !== 0) {
    return { proposals: [], error: "Deltas must sum to 0 (current net delta: " + (netDelta > 0 ? "+" + netDelta : netDelta) + ")" };
  }

  var donorShifts = shifts.filter(function (s) { return (deltas[s.id] || 0) < 0; });
  var receiverShifts = shifts.filter(function (s) { return (deltas[s.id] || 0) > 0; });

  if (!donorShifts.length || !receiverShifts.length) {
    return { proposals: [], error: null };
  }

  // Remaining counts needed to move
  var donorNeeds = {};
  donorShifts.forEach(function (s) { donorNeeds[s.id] = Math.abs(deltas[s.id]); });

  var receiverNeeds = {};
  receiverShifts.forEach(function (s) { receiverNeeds[s.id] = deltas[s.id]; });

  // Overall class female ratio
  var totalClassCount = classLines.length;
  var totalClassFemale = classLines.filter(function (l) { return l.sex === "F"; }).length;
  var targetFShare = totalClassCount > 0 ? totalClassFemale / totalClassCount : 0.5;

  var proposals = [];

  // Build pairs of donor and receiver
  donorShifts.forEach(function (dShift) {
    var dNeed = donorNeeds[dShift.id];
    var dLines = classLines.filter(function (l) {
      return l.shiftId === dShift.id && !(S.isLineScheduleLocked && S.isLineScheduleLocked(l));
    });

    while (dNeed > 0 && dLines.length > 0) {
      // Pick best receiver shift
      var rShift = receiverShifts.find(function (rs) { return receiverNeeds[rs.id] > 0; });
      if (!rShift) break;

      // Current F counts on donor
      var dFCount = dLines.filter(function (l) { return l.sex === "F"; }).length;
      var dFShare = dLines.length > 0 ? dFCount / dLines.length : 0;

      // Prefer moving F if donor has surplus F%, or M if donor has surplus M%
      var preferF = dFShare > targetFShare;

      // Select candidate line from dLines
      var candidateLine = dLines.find(function (l) { return preferF ? l.sex === "F" : l.sex === "M"; }) || dLines[0];

      // Compute RDO after for candidateLine on rShift
      var rdoBefore = candidateLine.rdoDays || [];
      var rdoAfter = rdoBefore.slice();
      var rdoNote = "Shift move";

      var hard = Array.isArray(rShift.rdoHard) ? rShift.rdoHard.map(Number).filter(function (x) { return x >= 0 && x <= 6; }) : [];
      if (hard.length > 0) {
        var missingHard = hard.filter(function (d) { return rdoBefore.indexOf(d) < 0; });
        if (missingHard.length > 0) {
          rdoAfter = hard.slice();
          for (var d = 0; d < 7 && rdoAfter.length < rdoBefore.length; d++) {
            if (rdoAfter.indexOf(d) < 0) rdoAfter.push(d);
          }
          rdoNote = "Updated RDOs for shift hard RDOs";
        }
      }

      proposals.push({
        line: candidateLine,
        fromShift: dShift,
        toShift: rShift,
        rdoBefore: rdoBefore,
        rdoAfter: rdoAfter,
        note: rdoNote
      });

      // Remove candidateLine from dLines
      dLines = dLines.filter(function (l) { return l.id !== candidateLine.id; });
      donorNeeds[dShift.id]--;
      receiverNeeds[rShift.id]--;
      dNeed--;
    }
  });

  return { proposals: proposals, error: null };
}

export function approveDfoRebalance(S, moves) {
  if (!S || !S.state) return false;
  S.state.issues = S.state.issues || [];

  if (!Array.isArray(moves) || moves.length === 0) {
    var msg0 = "No moves checked to approve.";
    if (S.updateStatus) S.updateStatus(msg0);
    return false;
  }

  var shifts = S.state.shifts || [];
  var lines = S.state.lines || [];

  var movedCount = 0;
  var days = S.state.weekCount ? S.state.weekCount * 7 : 7;

  moves.forEach(function (m) {
    var line = lines.find(function (l) { return String(l.id) === String(m.lineId); });
    if (!line) return;
    if (S.isLineScheduleLocked && S.isLineScheduleLocked(line)) return;
    var targetShift = shifts.find(function (s) { return s.id === m.targetShiftId; });
    if (!targetShift) return;

    var shiftChanged = line.shiftId !== targetShift.id;
    var rdoChanged = false;

    if (Array.isArray(m.rdoAfter) && m.rdoAfter.length > 0) {
      var oldSorted = (line.rdoDays || []).slice().sort().join(",");
      var newSorted = m.rdoAfter.slice().sort().join(",");
      if (oldSorted !== newSorted) {
        line.rdoDays = m.rdoAfter.slice();
        rdoChanged = true;
      }
    }

    if (shiftChanged) {
      line.shiftId = targetShift.id;
      line.shiftName = targetShift.name;
      line.shiftLabel = S.shiftLabel ? S.shiftLabel(targetShift) : ((targetShift.start || "") + "–" + (targetShift.end || ""));
      if (line.startTime !== undefined) line.startTime = targetShift.start;
      if (line.endTime !== undefined) line.endTime = targetShift.end;
      if (line.start !== undefined) line.start = targetShift.start;
      if (line.end !== undefined) line.end = targetShift.end;
    }

    if (shiftChanged || rdoChanged) {
      movedCount++;
      if (S.buildScheduleForLine && S.state.schedule) {
        S.state.schedule[line.id] = S.buildScheduleForLine(line, days);
      }
    }
  });

  if (movedCount === 0) {
    var msgNoMove = "No shift changes were made for checked lines.";
    if (S.updateStatus) S.updateStatus(msgNoMove);
    return false;
  }

  var statusMsg = "Rebalanced " + movedCount + " DFO line(s).";
  if (S.updateStatus) S.updateStatus(statusMsg);
  if (typeof window !== "undefined" && window.alert) {
    window.alert(statusMsg);
  }

  // Re-assign cert pools if present
  if (S.assignCertPools) {
    try { S.assignCertPools(); } catch (e) { console.error("rebalanceDfo assignCertPools", e); }
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

export function attachRebalanceDfo(S) {
  if (!S) return;
  S.isDfoEligibleLine = isDfoEligibleLine;
  S.getDfoLinesForClass = function (classKey) { return getDfoLinesForClass((S.state && S.state.lines) || [], classKey); };
  S.getDfoAvailableClasses = getDfoAvailableClasses;
  S.getDfoBandMin = function (shift, classKey) { return getDfoBandMin(S, shift, classKey); };
  S.proposeDfoMoves = function (classKey, deltas) { return proposeDfoMoves(S, classKey, deltas); };
  S.approveDfoRebalance = function (moves) { return approveDfoRebalance(S, moves); };
}
