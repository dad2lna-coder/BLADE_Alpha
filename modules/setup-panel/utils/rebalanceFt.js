/**
 * Interactive band-delta class rebalance planner and engine.
 */

export function getLinesForClass(lines, classKey) {
  if (!Array.isArray(lines)) return [];
  return lines.filter(function (l) {
    if (!l) return false;

    var isExtra = !!(l.isExtra || l.extraPositionId || (l.extraName && l.extraName !== "ESTI" && l.extraName !== "MSTI"));
    var isTraining = !!(l.isTraining || l.training || l.trainingClass || l.empClass === "ESTI" || l.empClass === "MSTI" || l.extraName === "ESTI" || l.extraName === "MSTI");

    if (classKey === "STSO") {
      return (l.isStso || l.empClass === "STSO" || l.position === "STSO") && !isExtra && !isTraining;
    }
    if (classKey === "LTSO") {
      return (l.isLtso || l.empClass === "LTSO" || l.position === "LTSO") && !isExtra && !isTraining;
    }
    if (classKey === "TSO_FT") {
      return (l.empClass === "FT" || !l.empClass) && !l.isPt && l.empClass !== "PT" && !l.isStso && !l.isLtso && l.empClass !== "STSO" && l.empClass !== "LTSO" && !isExtra && !isTraining;
    }
    if (classKey === "TSO_PT") {
      return (l.empClass === "PT" || l.isPt) && !l.isStso && !l.isLtso && l.empClass !== "STSO" && l.empClass !== "LTSO" && !isExtra && !isTraining;
    }
    if (classKey === "TSO_ALL") {
      return !l.isStso && !l.isLtso && l.empClass !== "STSO" && l.empClass !== "LTSO" && !isExtra && !isTraining;
    }
    if (classKey === "ESTI") {
      return l.empClass === "ESTI" || l.trainingClass === "ESTI" || l.extraName === "ESTI";
    }
    if (classKey === "MSTI") {
      return l.empClass === "MSTI" || l.trainingClass === "MSTI" || l.extraName === "MSTI";
    }
    if (classKey.indexOf("EXTRA_") === 0) {
      var extraIdOrName = classKey.substring(6);
      return isExtra && (String(l.extraPositionId) === extraIdOrName || String(l.extraName) === extraIdOrName || String(l.position) === extraIdOrName);
    }
    return false;
  });
}

export function getAvailableClasses(S) {
  var options = [
    { key: "TSO_FT", label: "TSO — FT" },
    { key: "TSO_PT", label: "TSO — PT" },
    { key: "TSO_ALL", label: "TSO — All" },
    { key: "STSO", label: "STSO" },
    { key: "LTSO", label: "LTSO" },
    { key: "ESTI", label: "ESTI" },
    { key: "MSTI", label: "MSTI" }
  ];

  var extraSeen = {};
  var extraList = (S && S.state && S.state.extraPositions) || [];
  extraList.forEach(function (ep) {
    var idOrName = ep.id || ep.name;
    var key = "EXTRA_" + idOrName;
    var label = ep.name || ep.id || "Extra Position";
    if (!extraSeen[key]) {
      extraSeen[key] = true;
      options.push({ key: key, label: "Extra: " + label });
    }
  });

  var lines = (S && S.state && S.state.lines) || [];
  lines.forEach(function (l) {
    if (l.isExtra || l.extraPositionId) {
      var idOrName = l.extraPositionId || l.extraName || l.position;
      var key = "EXTRA_" + idOrName;
      if (idOrName && !extraSeen[key]) {
        extraSeen[key] = true;
        options.push({ key: key, label: "Extra: " + (l.extraName || l.position || idOrName) });
      }
    }
  });

  return options;
}

export function getClassBandMin(S, shift, classKey) {
  if (!S || !shift) return "—";

  // Try reading from S.state.functionCoverage bands
  var fcBands = (S.state && S.state.functionCoverage && S.state.functionCoverage.bands) || [];
  var fcBand = fcBands.find(function (b) { return b.shiftId === shift.id || b.shift === shift.name; });

  if (classKey === "STSO") {
    if (shift.stsoForce) return shift.stsoForce;
    if (fcBand && fcBand.stsoMin != null) return fcBand.stsoMin;
    return "—";
  }
  if (classKey === "LTSO") {
    if (shift.ltsoForce) return shift.ltsoForce;
    if (fcBand && fcBand.ltsoMin != null) return fcBand.ltsoMin;
    return "—";
  }
  if (classKey === "TSO_FT" || classKey === "TSO_PT" || classKey === "TSO_ALL") {
    if (shift.force) return shift.force;
    if (fcBand && fcBand.tsoMin != null) return fcBand.tsoMin;
    return "—";
  }

  return "—";
}

var DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatRdos(rdoDays) {
  if (!Array.isArray(rdoDays) || !rdoDays.length) return "None";
  var sorted = rdoDays.slice().map(Number).sort(function (a, b) { return a - b; });
  return sorted.map(function (d) { return DAYS_SHORT[d] || d; }).join("-");
}

export function proposeClassMoves(S, classKey, deltas) {
  if (!S || !S.state) return { proposals: [], error: "No Scheduler state" };

  var lines = S.state.lines || [];
  var shifts = S.state.shifts || [];
  var classLines = getLinesForClass(lines, classKey);

  if (!classLines.length) {
    return { proposals: [], error: "No lines generated in selected class" };
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

      // Current F counts on donor and receiver
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

export function approveClassRebalance(S, moves) {
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

  var statusMsg = "Rebalanced " + movedCount + " line(s).";
  if (S.updateStatus) S.updateStatus(statusMsg);
  if (typeof window !== "undefined" && window.alert) {
    window.alert(statusMsg);
  }

  // Re-assign cert pools if present
  if (S.assignCertPools) {
    try { S.assignCertPools(); } catch (e) { console.error("rebalanceFt assignCertPools", e); }
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

export function attachRebalanceFt(S) {
  if (!S) return;
  S.getLinesForClass = getLinesForClass;
  S.getAvailableClasses = function () { return getAvailableClasses(S); };
  S.getClassBandMin = function (shift, classKey) { return getClassBandMin(S, shift, classKey); };
  S.proposeClassMoves = function (classKey, deltas) { return proposeClassMoves(S, classKey, deltas); };
  S.approveClassRebalance = function (moves) { return approveClassRebalance(S, moves); };
}
