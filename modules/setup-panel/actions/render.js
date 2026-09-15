/** Render setup panel and bind one-shot event actions. */
import { syncHoursFromAirfield } from "../utils/sync.js";
import { paintFunctionCoverage } from "./paint.js";

export function renderAll(S) {
  syncHoursFromAirfield(S);
  paintFunctionCoverage(S);
  if (S.renderShiftsTable) S.renderShiftsTable();
}

function addFcBandClassic(S) {
  if (typeof S.readFunctionBandsFromDom === "function") S.readFunctionBandsFromDom();
  const fc = typeof S.ensureFunctionCoverage === "function"
    ? S.ensureFunctionCoverage()
    : (S.state && S.state.functionCoverage);
  if (!fc) return;
  if (!Array.isArray(fc.bands)) fc.bands = [];
  fc.bands.push({ start: "12:00", end: "16:00", stso: 0, ltso: 0, tso: 0 });
  if (S.renderFunctionBandsTable) S.renderFunctionBandsTable();
  if (S.updateFunctionCoveragePreview) S.updateFunctionCoveragePreview();
}

function patchBagViewRoles(S) {
  /* Role filters stay user-controlled on every coverage lens, including Baggage. */
  return S;
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
      S.state.functionCoverage = Object.assign(S.state.functionCoverage || {}, incoming);
      if (S.ensureFunctionCoverage) S.ensureFunctionCoverage();
      if (S.fillFunctionCoverageForm) S.fillFunctionCoverageForm();
    }
  };
}

export function bindSetupActions(S) {
  if (!S) return;
  S.addFcBand = S.addFcBand || function () { addFcBandClassic(S); };
  patchBagViewRoles(S);
  patchImportCoverage(S);

  function bindOnce(el, type, fn) {
    if (!el || el._spBound) return;
    el._spBound = true;
    el.addEventListener(type, fn);
  }
  bindOnce(document.getElementById("fc-add-band"), "click", function (e) {
    e.preventDefault();
    S.addFcBand();
  });
  bindOnce(document.getElementById("btn-add-shift"), "click", function (e) {
    e.preventDefault();
    if (S.addShift) S.addShift();
  });
  bindOnce(document.getElementById("btn-save-staffing"), "click", function () {
    if (S.exportStaffingConfig) S.exportStaffingConfig();
  });
}
