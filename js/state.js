/** State trampoline — defaults live in modules/setup-panel/stores/setupStore.js */
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
})(window.Scheduler);
