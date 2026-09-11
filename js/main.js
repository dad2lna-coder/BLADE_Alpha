/** Entry point — classic scripts, works from file:// and OneDrive */
window.Scheduler = window.Scheduler || {};

(function (S) {
  "use strict";

  // --- FIX IS HERE ---
  // Expose the main renderLines function to the global Scheduler object
  // so our new module can call it. This must be in the outer scope.
  if (typeof renderLines === 'function') {
    S.renderLines = renderLines;
  }
  // --- END FIX ---

  function safeInit(name, fn) {
    if (typeof fn !== "function") return;
    try {
      fn();
    } catch (err) {
      console.error("Init failed:", name, err);
      if (S.updateStatus) S.updateStatus("Init warning: " + name + " failed.");
    }
  }

  function init() {
    if (S.$("cfg-start") && !S.$("cfg-start").value) {
      var d = S.parseStartDate(null);
      S.$("cfg-start").value = S.toDateInputValue(d);
      S.state.startDate = d;
    }

    document.querySelectorAll(".tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        S.switchTab(btn.dataset.tab);
      });
    });

    const instructionsModal = S.$('instructions-modal');
    const instructionsBtn = S.$('btn-instructions');
    // ... (rest of the instructions logic remains the same)

    if (S.$("btn-generate")) S.$("btn-generate").addEventListener("click", S.generate);
    if (S.$("btn-export")) S.$("btn-export").addEventListener("click", S.exportJson);
    if (S.$("btn-import")) {
      // ... (import logic remains the same)
    }
    if (S.$("file-import")) {
      // ... (import logic remains the same)
    }
    if (S.$("btn-clear")) S.$("btn-clear").addEventListener("click", S.clearAll);
    if (S.$("btn-export-lines-excel")) {
      // ... (export logic remains the same)
    }
    if (S.$("btn-add-shift")) {
      // ... (add shift logic remains the same)
    }

    safeInit("airport", S.initAirportConfig);
    safeInit("shifts", S.renderShiftsTable);
    // CRITICAL: The original init for teams MUST be removed.
    // safeInit("teams", S.initTeams); 
    safeInit("shiftDayTimes", S.initShiftDayTimes);
    safeInit("functionCoverage", S.initFunctionCoverage);
    safeInit("reports", S.initReports);
    safeInit("linesUI", S.bindLinesUI);
    safeInit("capacity", S.initCapacity);

    S.updateStatus("BLADE Alpha Build — boot 20260904f");
    if (S.renderAll) S.renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);

})(window.Scheduler);
