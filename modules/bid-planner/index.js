/**
 * Bid Planner Module Entry Point
 */

import { bindMilesUI } from "./js/miles/bind.js";
import { bindEbidUI } from "./js/ebidUi.js";

export function initBidPlanner(scheduler) {
  const S = scheduler || window.Scheduler;
  bindEbidUI(S);
  bindMilesUI(S);
}

export default initBidPlanner;
