// E1 scaffold: not in manifest; js/functions.js remains source of truth until cutover.
// ESM public API — initFunctionCoverage(scheduler)
// Classic js/functions.js still owns runtime; this is a bridge only.

import * as pools from "./lib/pools.js";
import * as bands from "./lib/bands.js";
import * as duty from "./lib/duty.js";
import * as assign from "./lib/assign.js";

import {
  bindDutyApi, lineRoleKey, isOpsFunctionRole, lineIsDfoTagged, getRotationDuty,
  lineStartMin, phaseOfStart, isAmSide, computeShiftAnchors, lineCoversSlot,
  bandForMinute, clearLineFunctions
} from "./lib/duty.js";

import {
  bindPoolsApi, ensureFunctionCoverage, getFunctionMode, fteCapsByRoleSex,
  capFunctionPoolsToFte, buildCertifiedPools, bagPoolTotal, dfoPoolTotal
} from "./lib/pools.js";

import {
  bindBandsApi, syncFunctionModeUi, fillFunctionCoverageForm,
  openFunctionCoverageModal, closeFunctionCoverageModal, renderFunctionBandsTable,
  readFunctionBandsFromDom, updateFunctionCoveragePreview, ensureExtraPositions,
  readExtraPositionsFromDom, renderExtraPositions, addExtraPosition,
  buildExtraPositionLines, bindFunctionCoverageUi
} from "./lib/bands.js";

import {
  bindAssignApi, generateFunctionAssignments, markDfo, markBag,
  fillBandShortfalls, bagSlotCounts, worstBagCoverage
} from "./lib/assign.js";

export function initFunctionCoverage(scheduler) {
  scheduler = scheduler || (typeof window !== "undefined" ? window.Scheduler : null);
  if (!scheduler) return null;
  bindDutyApi(scheduler);
  bindPoolsApi(scheduler);
  bindBandsApi(scheduler);
  bindAssignApi(scheduler);
  scheduler.fteCapsByRoleSex = fteCapsByRoleSex;
  scheduler.ensureFunctionCoverage = ensureFunctionCoverage;
  scheduler.getFunctionMode = getFunctionMode;
  scheduler.syncFunctionModeUi = syncFunctionModeUi;
  scheduler.fillFunctionCoverageForm = fillFunctionCoverageForm;
  scheduler.computeShiftAnchors = computeShiftAnchors;
  scheduler.phaseOfStart = phaseOfStart;
  scheduler.isAmSide = isAmSide;
  scheduler.lineStartMin = lineStartMin;
  scheduler.lineRoleKey = lineRoleKey;
  scheduler.isOpsFunctionRole = isOpsFunctionRole;
  scheduler.lineIsDfoTagged = lineIsDfoTagged;
  scheduler.getRotationDuty = getRotationDuty;
  scheduler.lineCoversSlot = lineCoversSlot;
  scheduler.bandForMinute = bandForMinute;
  scheduler.openFunctionCoverageModal = openFunctionCoverageModal;
  scheduler.closeFunctionCoverageModal = closeFunctionCoverageModal;
  scheduler.renderFunctionBandsTable = renderFunctionBandsTable;
  scheduler.readFunctionBandsFromDom = readFunctionBandsFromDom;
  scheduler.updateFunctionCoveragePreview = updateFunctionCoveragePreview;
  scheduler.capFunctionPoolsToFte = capFunctionPoolsToFte;
  scheduler.buildCertifiedPools = buildCertifiedPools;
  scheduler.generateFunctionAssignments = generateFunctionAssignments;
  scheduler.ensureExtraPositions = ensureExtraPositions;
  scheduler.readExtraPositionsFromDom = readExtraPositionsFromDom;
  scheduler.renderExtraPositions = renderExtraPositions;
  scheduler.addExtraPosition = addExtraPosition;
  scheduler.buildExtraPositionLines = buildExtraPositionLines;
  scheduler.clearLineFunctions = clearLineFunctions;
  scheduler.initFunctionCoverage = initFunctionCoverage;
  bindFunctionCoverageUi();
  return scheduler;
}

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
  bindFunctionCoverageUi,
} from "./lib/bands.js";

export {
  bindAssignApi,
  generateFunctionAssignments,
  markDfo,
  markBag,
  fillBandShortfalls,
  bagSlotCounts,
  worstBagCoverage,
} from "./lib/assign.js";

export { pools, bands, assign };
