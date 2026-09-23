/** Shared constants + hollow state bag. Setup-panel seeds real defaults. */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";
  S.DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  S.BADGES = ["badge-open", "badge-am", "badge-pm", "badge-close", "badge-4x10"];
  S.state = S.state || {
    lines: [],
    schedule: {},
    extraPositions: [],
    issues: [],
    shifts: [],
    functionCoverage: { mode: "none" }
  };
  S.shiftSeq = S.shiftSeq || 1;
  S.defaultShifts = function () {
    if (S.state && S.state.shifts && S.state.shifts.length) return S.state.shifts.slice();
    return [];
  };
})(window.Scheduler);
