/** Schedule trampoline — generate lives in modules/setup-panel/actions/generate.js */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";
  if (!S.generate) {
    S.generate = function () {
      if (typeof S._setupGenerate === "function") return S._setupGenerate();
      if (S.updateStatus) S.updateStatus("Setup module not loaded — generate unavailable.");
    };
  }
  if (!S.buildScheduleForLine) {
    S.buildScheduleForLine = function (line, days) {
      if (S.updateStatus) S.updateStatus("Setup module not loaded — schedule builder unavailable.");
      var arr = [];
      for (var i = 0; i < (days || 0); i++) arr[i] = "RDO";
      return arr;
    };
  }
})(window.Scheduler);
