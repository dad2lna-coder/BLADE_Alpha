/** Shift-math trampoline — real logic is modules/setup-panel/utils/shiftMath.js */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";
  if (!S.getShift) S.getShift = function (id) {
    return (S.state.shifts || []).find(function (x) { return x.id === id; });
  };
  if (!S.shiftLabel) S.shiftLabel = function (s) {
    if (!s) return "\u2014";
    return String(s.start).replace(":", "") + "-" + String(s.end).replace(":", "");
  };
  if (!S.consecutiveRdos) {
    S.consecutiveRdos = function (count, start) {
      var n = Math.max(2, Math.min(3, count || 2));
      var out = [];
      for (var i = 0; i < n; i++) out.push((start + i) % 7);
      return out;
    };
  }
})(window.Scheduler);
