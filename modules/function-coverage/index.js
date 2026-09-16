// E1 scaffold: not in manifest; js/functions.js remains source of truth until cutover.
// ESM public API — initFunctionCoverage(scheduler)
// Classic js/functions.js still owns runtime; this is a bridge only.

import * as pools from "./lib/pools.js";
import * as bands from "./lib/bands.js";
import * as duty from "./lib/duty.js";
import * as assign from "./lib/assign.js";

export function initFunctionCoverage(scheduler) {
  bindDutyApi(scheduler);
  bindPoolsApi(scheduler);
  bindBandsApi(scheduler);
  return scheduler;
}

// Re-export all duty module functions (real implementations + bindDutyApi)
export {
  bindDutyApi,
  lineRoleKey,
  isOpsFunctionRole,
  lineIsDfoTagged,
  getRotationDuty,
  lineStartMin,
  phaseOfStart,
  isAmSide,
  computeShiftAnchors,
  lineCoversSlot,
  bandForMinute,
  clearLineFunctions,
} from "./lib/duty.js";

// Re-export all pools module functions (real implementations + bindPoolsApi)
export {
  bindPoolsApi,
  ensureFunctionCoverage,
  getFunctionMode,
  fteCapsByRoleSex,
  capFunctionPoolsToFte,
  buildCertifiedPools,
  bagPoolTotal,
  dfoPoolTotal,
} from "./lib/pools.js";

// Bare named re-exports from lib/bands.js (same style as duty/pools)
export {
  bindBandsApi,
  syncFunctionModeUi,
  fillFunctionCoverageForm,
  openFunctionCoverageModal,
  closeFunctionCoverageModal,
  renderFunctionBandsTable,
  readFunctionBandsFromDom,
  updateFunctionCoveragePreview,
  ensureExtraPositions,
  readExtraPositionsFromDom,
  renderExtraPositions,
  addExtraPosition,
  buildExtraPositionLines,
} from "./lib/bands.js";

// Named re-exports of all lib modules for future wiring
export { pools, bands, assign };