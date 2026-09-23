/** Setup Panel — owns Setup-tab inputs, shifts table, extra positions, staffing export. */
import { ensureStyles } from "./utils/sync.js";
import { bridgeScheduler } from "./actions/bridge.js";
import { renderAll, bindSetupActions } from "./actions/render.js";

let _boundDomContentLoaded = false;

function seedStartDate(S) {
  var el = document.getElementById("cfg-start");
  if (!el) return;
  if (!el.value && S.parseStartDate && S.toDateInputValue) {
    var d = S.parseStartDate(null);
    el.value = S.toDateInputValue(d);
    if (S.state) S.state.startDate = d;
  }
}

export function initSetupPanel(scheduler) {
  const S = scheduler || window.Scheduler;
  ensureStyles();
  bridgeScheduler(S);
  seedStartDate(S);

  if (!_boundDomContentLoaded) {
    _boundDomContentLoaded = true;
    document.addEventListener("DOMContentLoaded", function () {
      seedStartDate(S);
      renderAll(S);
      setTimeout(function () { renderAll(S); }, 400);
    });
  }

  window.addEventListener("blade-intro-done", function () {
    renderAll(S);
    setTimeout(function () { renderAll(S); }, 200);
  });

  bindSetupActions(S);
  if (S.initShiftDayTimes) S.initShiftDayTimes();

  if (typeof S.initFunctionCoverage === "function") {
    var addBtn = document.getElementById("fc-add-band");
    if (!S._funcCoverageBound || (addBtn && !addBtn._fcBound)) {
      S._funcCoverageBound = false;
      S.initFunctionCoverage(S);
    } else if (S.fillFunctionCoverageForm) {
      try { S.fillFunctionCoverageForm(); } catch (e) {}
    }
  }

  renderAll(S);
}
