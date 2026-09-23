/** Render setup panel and bind one-shot event actions. */
import { syncHoursFromAirfield } from "../utils/sync.js";
import { paintFunctionCoverage } from "./paint.js";

export function renderAll(S) {
  syncHoursFromAirfield(S);
  paintFunctionCoverage(S);
  if (S.renderShiftsTable) S.renderShiftsTable();
  if (S.renderExtraPositions) S.renderExtraPositions();
}

function addFcBandClassic(S) {
  if (typeof S.addFcShiftRequirement === "function") {
    S.addFcShiftRequirement();
    return;
  }
  if (typeof S.addFcBand === "function" && S.addFcBand !== addFcBandClassic) {
    S.addFcBand();
    return;
  }
  if (typeof S.readFunctionBandsFromDom === "function") S.readFunctionBandsFromDom();
  if (typeof S.ensureFunctionCoverage === "function") S.ensureFunctionCoverage();
  if (S.renderFunctionShiftsTable) S.renderFunctionShiftsTable();
  else if (S.renderFunctionBandsTable) S.renderFunctionBandsTable();
  if (S.updateFunctionCoveragePreview) S.updateFunctionCoveragePreview();
}

function patchImportCoverage(S) {
  if (!S || S._fcImportPatch || typeof S.applyPayload !== "function") return;
  S._fcImportPatch = true;
  var orig = S.applyPayload;
  S.applyPayload = function (payload) {
    orig.call(S, payload);
    var cfg = payload && (payload.config || payload.legacy || payload);
    var incoming = cfg && cfg.functionCoverage;
    if (incoming && typeof incoming === "object" && S.state) {
      incoming._bandMigrationAttempted = false;
      S.state.functionCoverage = Object.assign(S.state.functionCoverage || {}, incoming);
      if (S.ensureFunctionCoverage) S.ensureFunctionCoverage();
      if (S.fillFunctionCoverageForm) S.fillFunctionCoverageForm();
    }
    if (payload && payload.fte && S.applyFte) S.applyFte(payload.fte);
    if (S.renderExtraPositions) S.renderExtraPositions();
  };
}

export function bindSetupActions(S) {
  if (!S) return;
  S.addFcBand = S.addFcShiftRequirement || S.addFcBand || function () { addFcBandClassic(S); };
  patchImportCoverage(S);

  function bindOnce(el, type, fn) {
    if (!el || el._spBound) return;
    el._spBound = true;
    el.addEventListener(type, fn);
  }
  var addShiftBtn = document.getElementById("fc-add-band");
  if (addShiftBtn && !addShiftBtn._fcBound) {
    bindOnce(addShiftBtn, "click", function (e) {
      e.preventDefault();
      if (S.addFcShiftRequirement) S.addFcShiftRequirement();
      else if (S.addFcBand) S.addFcBand();
    });
  }
  bindOnce(document.getElementById("btn-add-position"), "click", function (e) {
    e.preventDefault();
    if (S.addExtraPosition) S.addExtraPosition("MSTI");
  });
  bindOnce(document.getElementById("btn-add-shift"), "click", function (e) {
    e.preventDefault();
    if (S.addShift) S.addShift();
  });
  bindOnce(document.getElementById("btn-save-staffing"), "click", function () {
    if (S.exportStaffingConfig) S.exportStaffingConfig();
  });
}
