/** Rendering — classic script */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";

  S.dayLabel = function (offset) {
    var base = S.state.startDate ? S.state.startDate : S.parseStartDate(null);
    var d = base.add(offset, "day");
    return S.DAYS[d.day()] + " " + (d.month() + 1) + "/" + d.date();
  };

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

    function isDfoLine(line) {
      if (!line) return false;
      return line.function === "DFO" || !!(line.functionEligible && line.functionEligible.dfo);
    }

    function funcOk(line, dayOff) {
      var fv = cv.funcView || "all";
      if (fv === "all") return true;
      var duty = S.getRotationDuty ? S.getRotationDuty(line.id, dayOff) : null;
      if (fv === "dfo") return isDfoLine(line) && duty !== "BAG";
      if (fv === "bag") return duty === "BAG";
      if (fv === "pax") return duty === "PAX";
      return true;
    }
  }
})(window.Scheduler);
