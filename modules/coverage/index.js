/** Coverage module — matrix, bars, shift mix, cuts. */
import { attachRender } from "./actions/render.js";
import { bindCoverageUI } from "./actions/bind.js";
import { applyCoverageCutsToLines, initCuts } from "./components/cuts.js";
import { attachHourly } from "./utils/hourly.js";

export function initCoverage(scheduler) {
  const S = scheduler || window.Scheduler;
  attachHourly(S);
  S.coverageView = S.coverageView || {
    stso: false,
    ltso: false,
    tso: true,
    funcView: "all"
  };

  attachRender(S);
  S.applyCoverageCutsToLines = function () {
    return applyCoverageCutsToLines(S);
  };

  bindCoverageUI(S);
  initCuts(S);

  if (S.renderCoverageBars) S.renderCoverageBars();
}
