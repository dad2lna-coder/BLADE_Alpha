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
  if (!S || S._bagViewRolePatch) return;
  var orig = S.computeHourlyByDow;
  if (typeof orig !== "function") return;
  S._bagViewRolePatch = true;
  S.computeHourlyByDow = function () {
    var cv = S.coverageView || (S.coverageView = { stso: false, ltso: false, tso: true, funcView: "all" });
    var prevS = cv.stso, prevL = cv.ltso, prevT = cv.tso;
    if (cv.funcView === "bag") {
      cv.stso = true;
      cv.ltso = true;
      cv.tso = true;
    }
    try {
      return orig.call(S);
    } finally {
      cv.stso = prevS;
      cv.ltso = prevL;
      cv.tso = prevT;
    }
  };
}

export function bindSetupActions(S) {
  if (!S) return;
  if (typeof S.generateFunctionAssignments === "function") {
    S.generateFcAssignments = S.generateFunctionAssignments;
  }
  S.addFcBand = S.addFcBand || function () { addFcBandClassic(S); };
  patchBagViewRoles(S);

  function bindOnce(el, type, fn) {
    if (!el || el._spBound) return;
    el._spBound = true;
    el.addEventListener(type, fn);
  }
  bindOnce(document.getElementById("fc-add-band"), "click", function (e) {
    e.preventDefault();
    S.addFcBand();
  });
  bindOnce(document.getElementById("fc-generate"), "click", function (e) {
    e.preventDefault();
    const fn = S.generateFunctionAssignments || S.generateFcAssignments;
    if (typeof fn === "function") fn.call(S);
  });
  bindOnce(document.getElementById("btn-add-shift"), "click", function (e) {
    e.preventDefault();
    if (S.addShift) S.addShift();
  });
  bindOnce(document.getElementById("btn-save-staffing"), "click", function () {
    if (S.exportStaffingConfig) S.exportStaffingConfig();
  });
}
