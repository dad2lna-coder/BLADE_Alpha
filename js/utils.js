/** Classic attach for scripts that load before ESM. Dates are Luxon. */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";

  S.state = S.state || {
    lines: [],
    schedule: {},
    extraPositions: [],
    issues: [],
    shifts: [],
    functionCoverage: { mode: "none" }
  };
  S.shiftSeq = S.shiftSeq || 1;

  function DT() {
    if (!window.luxon || !window.luxon.DateTime) throw new Error("luxon is not loaded");
    return window.luxon.DateTime;
  }

  S.$ = function (id) {
    return document.getElementById(id);
  };

  S.timeToMin = function (t) {
    if (!t || typeof t !== "string") return 0;
    var p = t.split(":");
    return (+p[0] || 0) * 60 + (+p[1] || 0);
  };

  S.minToTime = function (m) {
    var normalized = ((m % 1440) + 1440) % 1440;
    var h = Math.floor(normalized / 60);
    var mm = normalized % 60;
    return String(h).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
  };

  S.safeNumber = function (value, fallback, min, max) {
    var n = Number(value);
    if (!Number.isFinite(n)) n = fallback;
    if (typeof min === "number") n = Math.max(min, n);
    if (typeof max === "number") n = Math.min(max, n);
    return n;
  };

  S.isValidTimeText = function (value) {
    return typeof value === "string" && /^\d{2}:\d{2}$/.test(value);
  };

  S.setInputValue = function (id, value) {
    var el = S.$(id);
    if (el != null && value != null) el.value = value;
  };

  S.updateStatus = function (msg) {
    var el = S.$("status");
    if (el) el.textContent = msg;
  };

  S.parseStartDate = function (val) {
    var Lux = DT();
    if (!val) return Lux.now().startOf("day");
    if (typeof val === "string") {
      var iso = Lux.fromISO(val.slice(0, 10));
      if (iso.isValid) return iso.startOf("day");
    }
    if (val && typeof val.toJSDate === "function") return Lux.fromJSDate(val.toJSDate()).startOf("day");
    if (val instanceof Date) return Lux.fromJSDate(val).startOf("day");
    if (val && val.isValid && val.toISODate) return val.startOf ? val.startOf("day") : val;
    return Lux.now().startOf("day");
  };

  S.toDateInputValue = function (d) {
    return S.parseStartDate(d).toFormat("yyyy-MM-dd");
  };

  S.dj = function (val) {
    var dt = S.parseStartDate(val);
    return {
      startOf: function () { return S.dj(dt.toISODate()); },
      format: function (fmt) {
        var map = { "YYYY-MM-DD": "yyyy-MM-dd" };
        return dt.toFormat(map[fmt] || fmt);
      },
      add: function (n) {
        return S.dj(dt.plus({ days: n }).toISODate());
      },
      day: function () { return dt.weekday % 7; },
      toISODate: function () { return dt.toISODate(); },
      toJSDate: function () { return dt.toJSDate(); }
    };
  };
})(window.Scheduler);
