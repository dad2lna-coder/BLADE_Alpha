// ESM public API — initFunctionCoverage(scheduler)

import * as pools from "./lib/pools.js";
import * as bands from "./lib/bands.js";
import * as duty from "./lib/duty.js";
import * as assign from "./lib/assign.js";
import * as shifts from "./lib/shifts.js";
import * as coverage from "./lib/coverage.js";
import * as migrate from "./lib/migrate.js";

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
  renderFunctionShiftsTable, readFunctionBandsFromDom, readFunctionCoverageFromDom,
  updateFunctionCoveragePreview, ensureExtraPositions,
  readExtraPositionsFromDom, renderExtraPositions, addExtraPosition,
  buildExtraPositionLines, bindFunctionCoverageUi, addFcShiftRequirement, addFcBand
} from "./lib/bands.js";

import {
  bindAssignApi, generateFunctionAssignments, markDfo, markBag,
  applyShiftFunctionRequirements
} from "./lib/assign.js";

import {
  bindShiftsApi, getConfiguredFunctionShifts, getShiftRequirement,
  getEligibleLinesForShift
} from "./lib/shifts.js";

import { bindCoverageCalcApi, computeAssignedCoverage, countAssignedAtSlot } from "./lib/coverage.js";
import { migrateFunctionCoverageConfig } from "./lib/migrate.js";

export function initFunctionCoverage(scheduler) {
  scheduler = scheduler || (typeof window !== "undefined" ? window.Scheduler : null);
  if (!scheduler) return null;
  bindDutyApi(scheduler);
  bindPoolsApi(scheduler);
  bindShiftsApi(scheduler);
  bindCoverageCalcApi(scheduler);
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
  scheduler.bandForMinute = bandForMinute; // legacy: extra-position / unmapped bands only
  scheduler.openFunctionCoverageModal = openFunctionCoverageModal;
  scheduler.closeFunctionCoverageModal = closeFunctionCoverageModal;
  scheduler.renderFunctionBandsTable = renderFunctionBandsTable;
  scheduler.renderFunctionShiftsTable = renderFunctionShiftsTable;
  scheduler.readFunctionBandsFromDom = readFunctionBandsFromDom;
  scheduler.readFunctionCoverageFromDom = readFunctionCoverageFromDom;
  scheduler.updateFunctionCoveragePreview = updateFunctionCoveragePreview;
  scheduler.capFunctionPoolsToFte = capFunctionPoolsToFte;
  scheduler.buildCertifiedPools = buildCertifiedPools;
  scheduler.generateFunctionAssignments = generateFunctionAssignments;
  scheduler.applyShiftFunctionRequirements = applyShiftFunctionRequirements;
  scheduler.getConfiguredFunctionShifts = getConfiguredFunctionShifts;
  scheduler.getShiftRequirement = getShiftRequirement;
  scheduler.getEligibleLinesForShift = getEligibleLinesForShift;
  scheduler.addFcShiftRequirement = addFcShiftRequirement;
  scheduler.addFcBand = addFcBand;
  scheduler.computeAssignedCoverage = computeAssignedCoverage;
  scheduler.countAssignedAtSlot = countAssignedAtSlot;
  scheduler.migrateFunctionCoverageConfig = migrateFunctionCoverageConfig;
  scheduler.ensureExtraPositions = ensureExtraPositions;
  scheduler.readExtraPositionsFromDom = readExtraPositionsFromDom;
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
  renderFunctionShiftsTable,
  readFunctionBandsFromDom,
  readFunctionCoverageFromDom,
  updateFunctionCoveragePreview,
  ensureExtraPositions,
  readExtraPositionsFromDom,
  renderExtraPositions,
  addExtraPosition,
  buildExtraPositionLines,
  bindFunctionCoverageUi,
  addFcShiftRequirement,
  addFcBand,
} from "./lib/bands.js";

export {
  bindAssignApi,
  generateFunctionAssignments,
  markDfo,
  markBag,
  applyShiftFunctionRequirements,
} from "./lib/assign.js";

export {
  bindShiftsApi,
  getConfiguredFunctionShifts,
  getShiftRequirement,
  getEligibleLinesForShift,
} from "./lib/shifts.js";

export {
  bindCoverageCalcApi,
  computeAssignedCoverage,
  countAssignedAtSlot,
} from "./lib/coverage.js";

export { migrateFunctionCoverageConfig } from "./lib/migrate.js";

export { pools, bands, assign, shifts, coverage, migrate };
