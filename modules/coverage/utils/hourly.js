import { parseStartDate, addDays, weekdaySun0 } from "../../shared/utils/dates.js";

export function coverageSlots(S) {
  var openMin = S.timeToMin(S.state.open);
  var closeMin = S.timeToMin(S.state.close);
  var start = Math.floor(openMin / 30) * 30;
  var end = Math.ceil(closeMin / 30) * 30;
  var slots = [];
  for (var m = start; m < end; m += 30) slots.push(m);
  return slots;
}

export function slotLabel(mins) {
  var h = Math.floor(mins / 60);
  var mm = mins % 60;
  return String(h).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
}

export function lineMatchesCoverageFilter(S, line, dayOff) {
  var cv = S.coverageView || { stso: false, ltso: false, tso: true, funcView: "all" };

  var role = S.lineRoleKey ? S.lineRoleKey(line) : "TSO";
  if (role === "STSO" && !cv.stso) return false;
  if (role === "LTSO" && !cv.ltso) return false;
  if (role === "TSO" && !cv.tso) return false;
  if (role !== "STSO" && role !== "LTSO" && role !== "TSO" && !cv.tso) return false;

  var fv = cv.funcView || "all";
  if (fv === "all") return true;

  var rawDuty = S.getRotationDuty ? S.getRotationDuty(line.id, dayOff) : null;
  var duty = rawDuty ? String(rawDuty).toUpperCase() : null;
  if (duty === "BAGGAGE") duty = "BAG";
  if (duty === "PASSENGER") duty = "PAX";

  if (fv === "dfo") {
    return line.function === "DFO" || !!(line.functionEligible && (line.functionEligible.dfo || line.functionEligible.DFO));
  }
  if (fv === "bag") return duty === "BAG";
  if (fv === "pax") return duty !== "BAG";

  return true;
}

export function computeHourlyByDow(S) {
  var slots = coverageSlots(S);
  var base = parseStartDate(S.state.startDate);
  var dowToOffset = {};
  var days = Math.min(7, (S.state.weekCount || 1) * 7);
  for (var off = 0; off < days; off++) {
    var dow = weekdaySun0(addDays(base, off));
    if (dowToOffset[dow] == null) dowToOffset[dow] = off;
  }
  var matrix = slots.map(function () {
    return [0, 1, 2, 3, 4, 5, 6].map(function () { return { m: 0, f: 0, t: 0 }; });
  });

  (S.state.lines || []).forEach(function (line) {
    if (!S.getShift(line.shiftId)) return;
    var isM = line.sex === "M";
    for (var dow = 0; dow < 7; dow++) {
      var off = dowToOffset[dow];
      if (off == null) continue;
      if ((S.state.schedule[line.id] || [])[off] !== "WORK") continue;
      if (!lineMatchesCoverageFilter(S, line, off)) continue;
      slots.forEach(function (slot, si) {
        var covers = false;
        if (S.lineCoversSlot) covers = S.lineCoversSlot(line, off, slot);
        else {
          var times = S.getEffectiveShiftTimes
            ? S.getEffectiveShiftTimes(line.shiftId, dow)
            : { start: S.getShift(line.shiftId).start, end: S.getShift(line.shiftId).end };
          var a = S.timeToMin(times.start);
          var b = S.timeToMin(times.end);
          covers = b <= a ? (slot >= a || slot < b) : (slot >= a && slot < b);
        }
        if (covers) {
          if (isM) matrix[si][dow].m++;
          else matrix[si][dow].f++;
          matrix[si][dow].t++;
        }
      });
    }
  });
  return { slots: slots, matrix: matrix, dowToOffset: dowToOffset };
}

export function attachHourly(S) {
  if (!S) return;
  S.coverageSlots = function () { return coverageSlots(S); };
  S.slotLabel = slotLabel;
  S.lineMatchesCoverageFilter = function (line, dayOff) { return lineMatchesCoverageFilter(S, line, dayOff); };
  S.computeHourlyByDow = function () { return computeHourlyByDow(S); };
  S.coverageView = S.coverageView || { stso: false, ltso: false, tso: true, funcView: "all" };
  if (!S.renderCoverageBars) S.renderCoverageBars = function () {};
  if (!S.renderShiftSummary) S.renderShiftSummary = function () {};
}
