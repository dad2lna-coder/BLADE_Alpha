/** Setup owns generate: snapshot inputs, then run allocation + line schedule. */
import { parseStartDate, addDays, weekdaySun0 } from "../../shared/utils/dates.js";

export function buildScheduleForLine(S, line, days) {
  var rdo = new Set((line.rdoDays || []).map(Number));
  var arr = [];
  for (var i = 0; i < days; i++) {
    var dow = i % 7;
    arr.push(rdo.has(dow) ? "RDO" : "WORK");
  }
  return arr;
}

export function generate(S) {
  S.state.issues = [];
  if (S.collectSetupInputs) S.collectSetupInputs();
  if (S.readShiftsFromDom) S.readShiftsFromDom();

  // Handle active seed for generation
  var seedInput = String(S.state.generateSeed || "random").trim().toLowerCase();
  if (!seedInput || seedInput === "random") {
    S.state.activeSeed = Math.floor(Math.random() * 2147483647);
  } else {
    var parsedSeed = parseInt(seedInput, 10);
    S.state.activeSeed = Number.isFinite(parsedSeed) ? Math.abs(parsedSeed) : 42;
  }

  if (!S.state.shifts || !S.state.shifts.length) {
    S.state.issues.push("Add at least one shift with a start and end time.");
    if (S.renderAll) S.renderAll();
    if (S.updateStatus) S.updateStatus("No shifts defined.");
    return;
  }
  S.state.shifts.forEach(function (s) {
    if (!s.rdoHard || !s.rdoHard.length) return;
    var need = S.rdoCountForShift(s, "FT");
    if (s.rdoHard.length !== need) {
      if (s.rdoHard.length > need) {
        S.state.issues.push(s.name + ": hard RDOs checked " + s.rdoHard.length + " day(s) exceeds pattern target " + need + " (paid " + s.paid + "h). Extra hard days kept; work-day count drops.");
      } else {
        S.state.issues.push(s.name + ": hard RDOs checked " + s.rdoHard.length + " day(s); padded to pattern target " + need + " (paid " + s.paid + "h).");
      }
    }
  });

  if (S.readExtraPositionsFromDom) S.readExtraPositionsFromDom();
  var extraHead = 0;
  ((S.state && S.state.extraPositions) || []).forEach(function (p) {
    extraHead += (+p.m || 0) + (+p.f || 0);
  });
  var trainingHead = (+S.state.esti || 0) + (+S.state.msti || 0);
  var total = S.state.ftM + S.state.ftF + S.state.ptM + S.state.ptF;
  if (total <= 0 && extraHead <= 0 && trainingHead <= 0) {
    S.state.issues.push("Set FT/PT male and female headcounts above zero, or add an extra type with people.");
    S.state.lines = [];
    S.state.schedule = {};
    if (S.renderAll) S.renderAll();
    if (S.updateStatus) S.updateStatus("No staff to schedule.");
    return;
  }
  var openMin = S.timeToMin(S.state.open);
  var closeMin = S.timeToMin(S.state.close);
  if (closeMin <= openMin) {
    S.state.issues.push("Close time must be after open time.");
    if (S.renderAll) S.renderAll();
    return;
  }

  var existingLockedLines = [];
  if (S.state.lines && Array.isArray(S.state.lines) && S.isLineScheduleLocked) {
    existingLockedLines = S.state.lines.filter(function (l) { return S.isLineScheduleLocked(l); });
  }

  var usedIds = new Set();
  existingLockedLines.forEach(function (l) {
    if (l.id != null) usedIds.add(l.id);
  });

  function adjustCountsForLocked(counts, lockedLines, filterFn) {
    var adj = Object.assign({}, counts || {});
    lockedLines.forEach(function (l) {
      if (filterFn(l) && l.shiftId && adj[l.shiftId] > 0) {
        adj[l.shiftId]--;
      }
    });
    return adj;
  }

  var isTsoLine = function (l) {
    if (l.isLtso || l.isStso || l.empClass === "LTSO" || l.empClass === "STSO") return false;
    if (l.isExtra || l.extraPositionId || l.isTraining || l.trainingClass) return false;
    return true;
  };
  var isLtsoLine = function (l) { return l.isLtso || l.empClass === "LTSO"; };
  var isStsoLine = function (l) { return l.isStso || l.empClass === "STSO"; };

  var lockedTso = existingLockedLines.filter(isTsoLine);
  var lockedLtso = existingLockedLines.filter(isLtsoLine);
  var lockedStso = existingLockedLines.filter(isStsoLine);
  var lockedOther = existingLockedLines.filter(function (l) {
    return !isTsoLine(l) && !isLtsoLine(l) && !isStsoLine(l);
  });

  // Calculate sex pools subtraction for locked lines
  var lockedFTM = 0, lockedFTF = 0, lockedPTM = 0, lockedPTF = 0;
  lockedTso.forEach(function (l) {
    if (l.empClass === "FT") {
      if (l.sex === "M") lockedFTM++;
      else if (l.sex === "F") lockedFTF++;
    } else if (l.empClass === "PT") {
      if (l.sex === "M") lockedPTM++;
      else if (l.sex === "F") lockedPTF++;
    }
  });

  var lockedLtsoM = 0, lockedLtsoF = 0;
  lockedLtso.forEach(function (l) {
    if (l.sex === "M") lockedLtsoM++;
    else if (l.sex === "F") lockedLtsoF++;
  });

  var lockedStsoM = 0, lockedStsoF = 0;
  lockedStso.forEach(function (l) {
    if (l.sex === "M") lockedStsoM++;
    else if (l.sex === "F") lockedStsoF++;
  });

  var lockedExtraCounts = {};
  var lockedTrainingCounts = { ESTI: 0, MSTI: 0 };
  lockedOther.forEach(function (l) {
    if (l.isTraining || l.trainingClass) {
      var cls = String(l.trainingClass || l.empClass || "").trim().toUpperCase();
      if (cls === "ESTI" || cls === "MSTI") {
        lockedTrainingCounts[cls] = (lockedTrainingCounts[cls] || 0) + 1;
      }
    } else if (l.isExtra || l.extraPositionId) {
      var posId = l.extraPositionId || "extra-1";
      if (!lockedExtraCounts[posId]) lockedExtraCounts[posId] = { M: 0, F: 0 };
      if (l.sex === "M") lockedExtraCounts[posId].M++;
      else if (l.sex === "F") lockedExtraCounts[posId].F++;
    }
  });

  // Ensure locked lines refresh shift metadata
  existingLockedLines.forEach(function (l) {
    var sh = S.getShift ? S.getShift(l.shiftId) : null;
    if (sh) {
      l.shiftName = sh.name;
      l.shiftLabel = S.shiftLabel ? S.shiftLabel(sh) : ((sh.start || "") + "–" + (sh.end || ""));
      if (l.startTime !== undefined) l.startTime = sh.start;
      if (l.endTime !== undefined) l.endTime = sh.end;
      if (l.start !== undefined) l.start = sh.start;
      if (l.end !== undefined) l.end = sh.end;
    }
  });

  var tsoLines = [];
  var mode = "extras";
  var tsoPools = {
    FTM: Math.max(0, (S.state.ftM || 0) - lockedFTM),
    FTF: Math.max(0, (S.state.ftF || 0) - lockedFTF),
    PTM: Math.max(0, (S.state.ptM || 0) - lockedPTM),
    PTF: Math.max(0, (S.state.ptF || 0) - lockedPTF)
  };
  var remainingTso = tsoPools.FTM + tsoPools.FTF + tsoPools.PTM + tsoPools.PTF;

  if (total > 0 && remainingTso > 0) {
    var allocation = S.allocateShiftHeadcounts(total, openMin, closeMin);
    var counts = adjustCountsForLocked(allocation.counts, lockedTso, isTsoLine);
    mode = allocation.mode;
    tsoLines = S.buildLines(counts, { pools: tsoPools, usedIds: usedIds });
  } else if (total > 0) {
    var allocOnly = S.allocateShiftHeadcounts(total, openMin, closeMin);
    mode = allocOnly.mode;
  }
  S.state.mode = mode;

  var ltsoPools = {
    M: Math.max(0, (S.state.ltsoM || 0) - lockedLtsoM),
    F: Math.max(0, (S.state.ltsoF || 0) - lockedLtsoF)
  };
  var ltsoTotal = ltsoPools.M + ltsoPools.F;
  var ltsoLines = [];
  if (ltsoTotal > 0) {
    var ltsoAlloc = S.allocateSupervisoryHeadcounts(ltsoTotal, openMin, closeMin, "ltsoForce", tsoLines);
    ltsoLines = S.buildSupervisoryLines(ltsoAlloc.counts || {}, "LTSO", { pools: ltsoPools, usedIds: usedIds });
  }

  var stsoPools = {
    M: Math.max(0, (S.state.stsoM || 0) - lockedStsoM),
    F: Math.max(0, (S.state.stsoF || 0) - lockedStsoF)
  };
  var stsoTotal = stsoPools.M + stsoPools.F;
  var stsoLines = [];
  if (stsoTotal > 0) {
    var stsoAlloc = S.allocateSupervisoryHeadcounts(stsoTotal, openMin, closeMin, "stsoForce", tsoLines);
    stsoLines = S.buildSupervisoryLines(stsoAlloc.counts || {}, "STSO", { pools: stsoPools, usedIds: usedIds });
  }

  var extraLines = S.buildExtraPositionLines ? S.buildExtraPositionLines({ lockedExtraCounts: lockedExtraCounts, usedIds: usedIds }) : [];
  var trainingLines = S.buildTrainingClassLines ? S.buildTrainingClassLines({ lockedTrainingCounts: lockedTrainingCounts, usedIds: usedIds }) : [];

  S.state.lines = [].concat(
    lockedTso, tsoLines,
    lockedLtso, ltsoLines,
    lockedStso, stsoLines,
    lockedOther, extraLines, trainingLines
  );

  var days = S.state.weekCount * 7;
  S.state.schedule = {};
  S.state.lines.forEach(function (line) {
    S.state.schedule[line.id] = buildScheduleForLine(S, line, days);
  });

  if (S.readFunctionBandsFromDom) S.readFunctionBandsFromDom();
  var fcMode = S.getFunctionMode ? S.getFunctionMode() : "none";
  if (S.generateFunctionAssignments) {
    S.generateFunctionAssignments({ fromGenerate: true });
  } else if (S.clearLineFunctions) {
    S.clearLineFunctions();
  }
  if (S.assignCertPools) S.assignCertPools();

  var dayTotals = [];
  (function formExtraTeamsOnSameLines() {
    var lines = S.state.lines || [];
    var reserved = { TSO: true, LTSO: true, STSO: true, FT: true, PT: true };
    function extraTypeKey(l) {
      var name = String(l.extraName || l.position || "").trim();
      if (name && !reserved[name]) return name;
      return "";
    }
    S.teams = S.teams || { teams: [] };
    if (!Array.isArray(S.teams.teams)) S.teams.teams = [];
    var extraByType = {};
    var extraIds = {};
    lines.forEach(function (l) {
      if (!(l.isExtra || l.extraPositionId)) return;
      if (l.isTraining || (S.isTrainingLine && S.isTrainingLine(l))) return;
      var inOps = S.lineInOpsCoverage ? S.lineInOpsCoverage(l) : !!l.opsFte;
      if (!inOps) return;
      extraIds[+l.id] = true;
      var key = extraTypeKey(l);
      if (!key) return;
      if (!extraByType[key]) extraByType[key] = [];
      extraByType[key].push(l.id);
    });
    Object.keys(extraByType).forEach(function (typeName) {
      var team = S.teams.teams.find(function (t) { return t.extraGroup === typeName || t.name === typeName; });
      if (!team) {
        team = { id: "TX-" + typeName, name: typeName, members: [], followMe: false, phase: null, extraGroup: typeName };
        S.teams.teams.push(team);
      }
      team.extraGroup = typeName;
      team.name = typeName;
      var have = {};
      (team.members || []).forEach(function (m) { have[+m] = true; });
      extraByType[typeName].forEach(function (id) {
        if (!have[+id]) team.members.push(id);
      });
    });
    S.teams.teams.forEach(function (t) {
      var tName = String(t.name || "").trim().toUpperCase();
      var reservedTeam = reserved[tName] || reserved[String(t.extraGroup || "").trim().toUpperCase()];
      if (t.extraGroup && extraByType[t.extraGroup]) {
        t.members = extraByType[t.extraGroup].slice();
        return;
      }
      t.members = (t.members || []).filter(function (m) {
        var line = lines.find(function (l) { return +l.id === +m; });
        if (line && (line.isExtra || line.extraPositionId)) {
          var inOps = S.lineInOpsCoverage ? S.lineInOpsCoverage(line) : !!line.opsFte;
          if (!inOps) return false;
        }
        if (!extraIds[+m]) return true;
        if (t.extraGroup && extraByType[t.extraGroup] && extraByType[t.extraGroup].indexOf(m) >= 0) return true;
        return !reservedTeam && !!t.extraGroup;
      });
    });
    if (S.formTrainingTeams) S.formTrainingTeams();
  })();
  if (S.renderTeams) {
    try { S.renderTeams(); } catch (e) {}
  }

  var workingLines = S.state.lines.filter(function (l) {
    if (l.isLtso || l.isStso) return false;
    if (l.isExtra || l.extraPositionId) return !!l.opsFte;
    return true;
  });
  for (var d = 0; d < Math.min(7, days); d++) {
    dayTotals.push(workingLines.filter(function (l) {
      return S.state.schedule[l.id][d] === "WORK";
    }).length);
  }
  var dMin = Math.min.apply(null, dayTotals);
  var dMax = Math.max.apply(null, dayTotals);
  if (dMax - dMin > Math.max(2, Math.ceil(total * 0.15))) {
    S.state.issues.push("Day-of-week TSO headcount still varies " + dMin + "\u2013" + dMax + " (RDO stagger). Prefer varied seeds are already applied.");
  }
  try {
    if (S.renderAll) S.renderAll();
    if (S.renderCoverageBars) S.renderCoverageBars();
    if (S.__USE_SVELTE_LINES) {
      window.dispatchEvent(new CustomEvent("lines:request-render"));
    } else if (S.renderLines) S.renderLines();
  } catch (err) {
    console.error("generate UI refresh", err);
  }
  if (S.updateStatus) {
    S.updateStatus(
      "Scheduled " + S.state.lines.length + " lines (FT " + S.state.ftM + "/" + S.state.ftF +
      " \u00b7 PT " + S.state.ptM + "/" + S.state.ptF +
      " \u00b7 LTSO " + S.state.ltsoM + "/" + S.state.ltsoF +
      " \u00b7 STSO " + S.state.stsoM + "/" + S.state.stsoF +
      " \u00b7 ESTI " + (S.state.esti || 0) +
      " \u00b7 MSTI " + (S.state.msti || 0) +
      ") \u00b7 " + mode + " \u00b7 " + S.state.weekCount + " wk" +
      (fcMode && fcMode !== "none" ? " \u00b7 " + String(fcMode).toUpperCase() + " duties" : "") +
      (S.state.issues.length ? " \u00b7 " + S.state.issues.length + " note(s)" : "")
    );
  }
}

export function attachGenerate(S) {
  if (!S) return;
  S.buildScheduleForLine = function (line, days) {
    return buildScheduleForLine(S, line, days);
  };
  S._setupGenerate = function () { return generate(S); };
  S.generate = function () { return generate(S); };
}
