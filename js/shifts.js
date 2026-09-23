/** Shift math — classic script. Setup-tab table/UI lives in modules/setup-panel. */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";

  S.getShift = function (id) {
    return (S.state.shifts || []).find(function (x) { return x.id === id; });
  };

  S.shiftBadge = function (id) {
    var i = (S.state.shifts || []).findIndex(function (x) { return x.id === id; });
    return S.BADGES[(i >= 0 ? i : 0) % S.BADGES.length];
  };

  S.shiftLabel = function (s) {
    if (!s) return "\u2014";
    return String(s.start).replace(":", "") + "-" + String(s.end).replace(":", "");
  };

  S.getEffectiveShiftTimes = function (shiftId, dow) {
    var s = S.getShift(shiftId);
    if (!s) return { start: "00:00", end: "00:00", isOverride: false };
    var key = String(dow);
    if (s.dayTimes && s.dayTimes[key] &&
        S.isValidTimeText(s.dayTimes[key].start) &&
        S.isValidTimeText(s.dayTimes[key].end)) {
      return { start: s.dayTimes[key].start, end: s.dayTimes[key].end, isOverride: true };
    }
    return { start: s.start, end: s.end, isOverride: false };
  };

  S.shiftHasDayOverrides = function (shiftId) {
    var s = S.getShift(shiftId);
    return !!(s && s.dayTimes && Object.keys(s.dayTimes).length);
  };

  S.shiftCoversSlot = function (shiftId, slotStart, dow) {
    var times = (dow != null) ? S.getEffectiveShiftTimes(shiftId, dow) : null;
    var s = S.getShift(shiftId);
    if (!s && !times) return false;
    var a = S.timeToMin(times ? times.start : s.start);
    var b = S.timeToMin(times ? times.end : s.end);
    return slotStart >= a && slotStart < b;
  };

  S.shiftOverlapsWindow = function (s, openMin, closeMin) {
    if (!s) return false;
    return S.timeToMin(s.start) < closeMin && S.timeToMin(s.end) > openMin;
  };

  S.targetWorkDays = function (shiftId, empClass) {
    if (empClass === "STSO" || empClass === "LTSO") {
      var s0 = S.getShift(shiftId);
      return s0 && (+s0.paid || 8) >= 10 ? 4 : 5;
    }
    var s = S.getShift(shiftId);
    if (s && (+s.paid || 8) >= 10) return 4;
    if (empClass === "PT") return 3;
    return 5;
  };

  S.consecutiveRdos = function (count, start) {
    var n = Math.max(2, Math.min(3, count || 2));
    var out = [];
    for (var i = 0; i < n; i++) out.push((start + i) % 7);
    return out;
  };

  S.rdoCountForShift = function (shift, empClass) {
    var work = S.targetWorkDays(shift && shift.id, empClass || "FT");
    return Math.max(1, 7 - work);
  };

  S.normalizeShift = function (raw, index) {
    var fallbackId = "S" + (index + 1);
    var id = raw && raw.id ? String(raw.id) : fallbackId;
    var name = raw && raw.name ? String(raw.name) : id;
    var start = raw && S.isValidTimeText(raw.start) ? raw.start : "08:00";
    var end = raw && S.isValidTimeText(raw.end) ? raw.end : "16:30";
    var paid = S.safeNumber(raw && raw.paid, 8, 1, 24);
    var force = Math.floor(S.safeNumber(raw && raw.force, 0, 0, null));
    var ltsoForce = Math.floor(S.safeNumber(raw && raw.ltsoForce, 0, 0, null));
    var stsoForce = Math.floor(S.safeNumber(raw && raw.stsoForce, 0, 0, null));
    var rdoHard = Array.isArray(raw && raw.rdoHard)
      ? raw.rdoHard.map(Number).filter(function (x) {
          return Number.isInteger(x) && x >= 0 && x <= 6;
        })
      : [];
    var dayTimes = null;
    if (raw && raw.dayTimes && typeof raw.dayTimes === "object") {
      dayTimes = {};
      for (var k in raw.dayTimes) {
        if (!Object.prototype.hasOwnProperty.call(raw.dayTimes, k)) continue;
        var dt = raw.dayTimes[k];
        if (dt && S.isValidTimeText(dt.start) && S.isValidTimeText(dt.end)) {
          dayTimes[String(k)] = { start: dt.start, end: dt.end };
        }
      }
      if (!Object.keys(dayTimes).length) dayTimes = null;
    }
    var phase = (raw && raw.phase) || "auto";
    if (["auto", "opening", "am", "pm", "closing"].indexOf(phase) < 0) phase = "auto";
    return {
      id: id, name: name, start: start, end: end, paid: paid,
      force: force, ltsoForce: ltsoForce, stsoForce: stsoForce, rdoHard: rdoHard,
      dayTimes: dayTimes, phase: phase
    };
  };
})(window.Scheduler);
