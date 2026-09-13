/**
 * Setup Panel — thin orchestrator.
 * Bridges the legacy window.Scheduler setup helpers so the panel can be
 * loaded as a module (like team-builder) instead of a global script.
 */

function ensureStyles() {
  if (document.getElementById("setup-panel-css")) return;
  const link = document.createElement("link");
  link.id = "setup-panel-css";
  link.rel = "stylesheet";
  link.href = "modules/setup-panel/styles/setup-panel.css";
  document.head.appendChild(link);
}

function val(id, fallback) {
  const el = document.getElementById(id);
  return el && el.value != null && el.value !== "" ? el.value : fallback;
}

function syncHoursFromAirfield(S) {
  const cfg = S.getAirportConfig && S.getAirportConfig();
  const open = (cfg && cfg.startTime) || "03:30";
  const close = (cfg && cfg.endTime) || "23:00";
  let o = document.getElementById("cfg-open");
  let c = document.getElementById("cfg-close");
  if (o) o.value = open;
  if (c) c.value = close;
  if (S.state) { S.state.open = open; S.state.close = close; }
}

function paintFunctionCoverage(S) {
  if (S.ensureFunctionCoverage) S.ensureFunctionCoverage();
  if (S.fillFunctionCoverageForm) {
    try { S.fillFunctionCoverageForm(); } catch (e) {}
  }
  if (S.renderFunctionBandsTable) S.renderFunctionBandsTable();
  if (S.updateFunctionCoveragePreview) S.updateFunctionCoveragePreview();
  let save = document.getElementById("btn-save-staffing");
  if (save && !save._bound) {
    save._bound = true;
    save.addEventListener("click", function () {
      if (S.exportStaffingConfig) S.exportStaffingConfig();
    });
  }
}

function snapshotFte(S) {
  return {
    ftM: +(val("cfg-ft-m", S.state && S.state.ftM) || 0),
    ftF: +(val("cfg-ft-f", S.state && S.state.ftF) || 0),
    ptM: +(val("cfg-pt-m", S.state && S.state.ptM) || 0),
    ptF: +(val("cfg-pt-f", S.state && S.state.ptF) || 0),
    ltsoM: +(val("cfg-ltso-m", S.state && S.state.ltsoM) || 0),
    ltsoF: +(val("cfg-ltso-f", S.state && S.state.ltsoF) || 0),
    stsoM: +(val("cfg-stso-m", S.state && S.state.stsoM) || 0),
    stsoF: +(val("cfg-stso-f", S.state && S.state.stsoF) || 0)
  };
}

function applyFte(S, fte) {
  if (!fte) return;
  function put(id, v) {
    let el = document.getElementById(id);
    if (el && v != null) el.value = v;
  }
  put("cfg-ft-m", fte.ftM); put("cfg-ft-f", fte.ftF);
  put("cfg-pt-m", fte.ptM); put("cfg-pt-f", fte.ptF);
  put("cfg-ltso-m", fte.ltsoM); put("cfg-ltso-f", fte.ltsoF);
  put("cfg-stso-m", fte.stsoM); put("cfg-stso-f", fte.stsoF);
  if (!S.state) return;
  if (fte.ftM != null) S.state.ftM = +fte.ftM || 0;
  if (fte.ftF != null) S.state.ftF = +fte.ftF || 0;
  if (fte.ptM != null) S.state.ptM = +fte.ptM || 0;
  if (fte.ptF != null) S.state.ptF = +fte.ptF || 0;
  if (fte.ltsoM != null) S.state.ltsoM = +fte.ltsoM || 0;
  if (fte.ltsoF != null) S.state.ltsoF = +fte.ltsoF || 0;
  if (fte.stsoM != null) S.state.stsoM = +fte.stsoM || 0;
  if (fte.stsoF != null) S.state.stsoF = +fte.stsoF || 0;
}

function bindOnce(el, type, fn) {
  if (!el || el._spBound) return;
  el._spBound = true;
  el.addEventListener(type, fn);
}

let _boundDomContentLoaded = false;

/** Bridge exported helpers onto window.Scheduler so legacy code can call them. */
function bridgeScheduler(S) {
  if (!S) return;
  S.rebuildSetupTab = function () {
    syncHoursFromAirfield(S);
    paintFunctionCoverage(S);
  };
  S.snapshotFte = function () { return snapshotFte(S); };
  S.applyFte = function (fte) { applyFte(S, fte); };
}

export function renderAll(S) {
  syncHoursFromAirfield(S);
  paintFunctionCoverage(S);
}

export function initSetupPanel(scheduler) {
  const S = scheduler || window.Scheduler;
  ensureStyles();
  bridgeScheduler(S);

  if (!_boundDomContentLoaded) {
    _boundDomContentLoaded = true;
    document.addEventListener("DOMContentLoaded", function () {
      renderAll(S);
      setTimeout(function () { renderAll(S); }, 400);
    });
  }

  window.addEventListener("blade-intro-done", function () {
    renderAll(S);
    setTimeout(function () { renderAll(S); }, 200);
  });

  bindOnce(document.getElementById("fc-add-band"), "click", function (e) {
    e.preventDefault();
    if (S.addFcBand) S.addFcBand();
  });
  bindOnce(document.getElementById("fc-generate"), "click", function (e) {
    e.preventDefault();
    if (S.generateFcAssignments) S.generateFcAssignments();
  });
  bindOnce(document.getElementById("btn-add-shift"), "click", function (e) {
    e.preventDefault();
    if (S.addShift) S.addShift();
  });
  bindOnce(document.getElementById("btn-save-staffing"), "click", function () {
    if (S.exportStaffingConfig) S.exportStaffingConfig();
  });

  renderAll(S);
}
