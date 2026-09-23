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

export function computeHourlyByDow(S) {
  var slots = coverageSlots(S);
  var cv = S.coverageView || { stso: false, ltso: false, tso: true, funcView: "all" };
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
  function roleOk(line) {
    var role = S.lineRoleKey ? S.lineRoleKey(line) : "TSO";
    if (role === "STSO") return !!cv.stso;
    if (role === "LTSO") return !!cv.ltso;
    return !!cv.tso;
  }
  function funcOk(line, dayOff) {
    var fv = cv.funcView || "all";
    if (fv === "all") return true;
    var duty = S.getRotationDuty ? S.getRotationDuty(line.id, dayOff) : null;
    if (fv === "dfo") {
      var lineIsDfo = line.function === "DFO" || (line.functionEligible && line.functionEligible.dfo);
      return lineIsDfo && duty !== "BAG";
    }
    if (fv === "bag") return duty === "BAG";
    if (fv === "pax") return duty === "PAX";
    return true;
  }
  (S.state.lines || []).forEach(function (line) {
    if (!roleOk(line)) return;
    if (!S.getShift(line.shiftId)) return;
    var isM = line.sex === "M";
    for (var dow = 0; dow < 7; dow++) {
      var off = dowToOffset[dow];
      if (off == null) continue;
      if ((S.state.schedule[line.id] || [])[off] !== "WORK") continue;
      if (!funcOk(line, off)) continue;
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
  S.computeHourlyByDow = function () { return computeHourlyByDow(S); };
  S.coverageView = S.coverageView || { stso: false, ltso: false, tso: true, funcView: "all" };
  if (!S.renderCoverageBars) S.renderCoverageBars = function () {};
  if (!S.renderShiftSummary) S.renderShiftSummary = function () {};
}
