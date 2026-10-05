/**
 * Bid Planner Module Entry Point
 */

import { bindBidPlannerUI } from "./js/ui.js";
import { bindEbidUI } from "./js/ebidUi.js";

export function initBidPlanner(scheduler) {
  const S = scheduler || window.Scheduler;
  bindEbidUI(S);
  bindBidPlannerUI(S);
}

export default initBidPlanner;
