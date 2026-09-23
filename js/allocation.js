/** Allocation trampoline — real logic is modules/setup-panel/utils/{slots,headcounts,buildLines,certs}.js */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";
  function missing(name) {
    return function () {
      if (S.updateStatus) S.updateStatus("Setup module not loaded — " + name + " unavailable.");
      return name === "allocateShiftHeadcounts" || name === "allocateSupervisoryHeadcounts"
        ? { counts: {}, mode: "none" }
        : [];
    };
  }
  if (!S.operatingSlots) S.operatingSlots = missing("operatingSlots");
  if (!S.refineBalance) S.refineBalance = function (counts) { return counts || {}; };
  if (!S.allocateShiftHeadcounts) S.allocateShiftHeadcounts = missing("allocateShiftHeadcounts");
  if (!S.allocateSupervisoryHeadcounts) S.allocateSupervisoryHeadcounts = missing("allocateSupervisoryHeadcounts");
  if (!S.buildLines) S.buildLines = missing("buildLines");
  if (!S.buildSupervisoryLines) S.buildSupervisoryLines = missing("buildSupervisoryLines");
  if (!S.clearLineFunctions) S.clearLineFunctions = function () {};
  if (!S.assignCertifications) S.assignCertifications = missing("assignCertifications");
})(window.Scheduler);
