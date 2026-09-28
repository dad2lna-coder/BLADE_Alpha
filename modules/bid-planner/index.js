/**
 * Bid Planner Module Entry Point
 */

import { bindBidPlannerUI } from "./js/ui.js";

export function initBidPlanner(scheduler) {
  const S = scheduler || window.Scheduler;
  bindBidPlannerUI(S);
}

export default initBidPlanner;
