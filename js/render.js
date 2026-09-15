/** Rendering — classic script */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";

  S.dayLabel = function (offset) {
    var base = S.state.startDate ? S.state.startDate : S.parseStartDate(null);
    var d = base.add(offset, "day");
    return S.DAYS[d.day()] + " " + (d.month() + 1) + "/" + d.date();
  };

  /** Build 30-minute slot list (minutes from midnight) covering open→close */
  S.coverageSlots = function () {
    var openMin = S.timeToMin(S.state.open);
    var closeMin = S.timeToMin(S.state.close);
    var start = Math.floor(openMin / 30) * 30;
    var end = Math.ceil(closeMin / 30) * 30;
    var slots = [];
    for (var m = start; m < end; m += 30) slots.push(m);
    return slots;
  };

  S.slotLabel = function (mins) {
    var h = Math.floor(mins / 60);
    var mm = mins % 60;
    return String(h).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
  };

  S.coverageView = S.coverageView || {
    stso: false,
    ltso: false,
    tso: true,
    funcView: "all"
  };

  S.computeHourlyByDow = function () {
    var slots = S.coverageSlots();
    var cv = S.coverageView || { stso: false, ltso: false, tso: true, funcView: "all" };
    var base = S.state.startDate ? S.state.startDate : S.parseStartDate(null);
    var dowToOffset = {};
    var days = Math.min(7, (S.state.weekCount || 1) * 7);
    for (var off = 0; off < days; off++) {
      var dt = base.add(off, "day");
      var dow = dt.day();
      if (dowToOffset[dow] == null) dowToOffset[dow] = off;
    }

    var matrix = slots.map(function () {
      return [0, 1, 2, 3, 4, 5, 6].map(function () {
        return { m: 0, f: 0, t: 0 };
      });
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
      if (fv === "dfo") return duty === "DFO";
      if (fv === "bag") return duty === "BAG";
      if (fv === "pax") return duty === "PAX";
      return true;
    }

    S.state.lines.forEach(function (line) {
      if (!roleOk(line)) return;
      if (!S.getShift(line.shiftId)) return;
      var isM = line.sex === "M";
      for (var dow = 0; dow < 7; dow++) {
        var off = dowToOffset[dow];
        if (off == null) continue;
        if ((S.state.schedule[line.id] || [])[off] !== "WORK") continue;
        if (!funcOk(line, off)) continue;
        var times = S.getEffectiveShiftTimes
          ? S.getEffectiveShiftTimes(line.shiftId, dow)
          : { start: S.getShift(line.shiftId).start, end: S.getShift(line.shiftId).end };
        var a = S.timeToMin(times.start);
        var b = S.timeToMin(times.end);
        slots.forEach(function (slot, si) {
          if (a < slot + 30 && b > slot) {
            if (isM) matrix[si][dow].m++;
            else matrix[si][dow].f++;
            matrix[si][dow].t++;
          }
        });
      }
    });
    return { slots: slots, matrix: matrix, dowToOffset: dowToOffset };
  };
})(window.Scheduler);
