/** Setup owns generate: snapshot inputs, then run allocation + line schedule. */

export function buildScheduleForLine(S, line, days) {
  var arr = [];
  var rdo = new Set((line.rdoDays || []).map(Number));
  var need = S.targetWorkDays(line.shiftId, line.empClass);
  var base = S.state.startDate ? S.state.startDate : S.parseStartDate(null);
  var weeks = Math.ceil(days / 7);
  for (var w = 0; w < weeks; w++) {
    var weekOffsets = [];
    for (var i = 0; i < 7; i++) {
      var off = w * 7 + i;
      if (off >= days) break;
      weekOffsets.push({ off: off, dow: base.add(off, "day").day() });
    }
    var weekVal = {};
    weekOffsets.forEach(function (x) {
      weekVal[x.off] = rdo.has(x.dow) ? "RDO" : "WORK";
    });
    var workOffs = weekOffsets
      .filter(function (x) { return weekVal[x.off] === "WORK"; })
      .sort(function (a, b) { return a.dow - b.dow; });
    workOffs.forEach(function (x, idx) {
      weekVal[x.off] = idx < need ? "WORK" : "RDO";
    });
    weekOffsets.forEach(function (x) { arr[x.off] = weekVal[x.off]; });
  }
  for (var i = 0; i < days; i++) if (!arr[i]) arr[i] = "RDO";
  return arr.slice(0, days);
}

export function generate(S) {
  S.state.issues = [];
  if (S.collectSetupInputs) S.collectSetupInputs();
  if (S.readShiftsFromDom) S.readShiftsFromDom();

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
      S.state.issues.push(s.name + ": hard RDOs checked " + s.rdoHard.length + " day(s); pattern expects " + need + " (paid " + s.paid + "h). Days kept; work-day count may adjust.");
    }
  });

  var total = S.state.ftM + S.state.ftF + S.state.ptM + S.state.ptF;
  if (total <= 0) {
    S.state.issues.push("Set FT/PT male and female headcounts above zero.");
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

  var allocation = S.allocateShiftHeadcounts(total, openMin, closeMin);
  var counts = allocation.counts;
  var mode = allocation.mode;
  S.state.mode = mode;
  var tsoLines = S.buildLines(counts);

  var ltsoTotal = S.state.ltsoM + S.state.ltsoF;
  var ltsoLines = [];
  if (ltsoTotal > 0) {
    var ltsoAlloc = S.allocateSupervisoryHeadcounts(ltsoTotal, openMin, closeMin, "ltsoForce", tsoLines);
    ltsoLines = S.buildSupervisoryLines(ltsoAlloc.counts || {}, "LTSO");
  }
  var stsoTotal = S.state.stsoM + S.state.stsoF;
  var stsoLines = [];
  if (stsoTotal > 0) {
    var stsoAlloc = S.allocateSupervisoryHeadcounts(stsoTotal, openMin, closeMin, "stsoForce", tsoLines);
    stsoLines = S.buildSupervisoryLines(stsoAlloc.counts || {}, "STSO");
  }
  if (S.readExtraPositionsFromDom) S.readExtraPositionsFromDom();
  var extraLines = S.buildExtraPositionLines ? S.buildExtraPositionLines() : [];
  S.state.lines = [].concat(tsoLines, ltsoLines, stsoLines, extraLines);

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

  var dayTotals = [];
  var workingLines = S.state.lines.filter(function (l) { return !l.isLtso && !l.isStso && !l.isExtra; });
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
  if (S.renderAll) S.renderAll();
  if (S.renderCoverageBars) S.renderCoverageBars();
  if (S.__USE_SVELTE_LINES) {
    window.dispatchEvent(new CustomEvent("lines:request-render"));
  } else if (S.renderLines) S.renderLines();
  if (S.updateStatus) {
    S.updateStatus(
      "Scheduled " + S.state.lines.length + " lines (FT " + S.state.ftM + "/" + S.state.ftF +
      " \u00b7 PT " + S.state.ptM + "/" + S.state.ptF +
      " \u00b7 LTSO " + S.state.ltsoM + "/" + S.state.ltsoF +
      " \u00b7 STSO " + S.state.stsoM + "/" + S.state.stsoF +
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
