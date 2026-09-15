/** Setup Panel — thin orchestrator.
 * Bridges the legacy window.Scheduler setup helpers so the panel can be
 * loaded as a module (like team-builder) instead of a global script.
 */
import { ensureStyles } from "./utils/sync.js";
import { bridgeScheduler } from "./actions/bridge.js";
import { renderAll, bindSetupActions } from "./actions/render.js";

let _boundDomContentLoaded = false;

export function initSetupPanel(scheduler) {
  const S = scheduler || window.Scheduler;
  ensureStyles();
  bridgeScheduler(S);

  if (!_boundDomContentLoaded) {
    _boundDomContentLoaded = true;
    document.addEventListener("DOMContentLoaded", function () {
      renderAll(S);
      setTimeout(function () { renderAll(S); }, 400);
    });
  }

  window.addEventListener("blade-intro-done", function () {
    renderAll(S);
    setTimeout(function () { renderAll(S); }, 200);
  });

  bindSetupActions(S);

  // Classic initFunctionCoverage may have run before panel.html existed.
  // Re-run once the setup panel DOM is mounted. bindOnce covers add-band.
  if (typeof S.initFunctionCoverage === "function") {
    if (!S._funcCoverageBound) S._funcCoverageBound = false;
    S.initFunctionCoverage();
  }

  renderAll(S);
}
