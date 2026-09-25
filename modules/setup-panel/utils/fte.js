/** FTE / period / extra / FC form snapshot — Setup module owns these inputs. */
import { val } from "./sync.js";
import { setupStore } from "../stores/setupStore.js";

export function snapshotFte(S) {
  const fte = {
    ftM: +(val("cfg-ft-m", S.state && S.state.ftM) || 0),
    ftF: +(val("cfg-ft-f", S.state && S.state.ftF) || 0),
    ptM: +(val("cfg-pt-m", S.state && S.state.ptM) || 0),
    ptF: +(val("cfg-pt-f", S.state && S.state.ptF) || 0),
    ptHoursPerDay: +(val("cfg-pt-hours", S.state && S.state.ptHoursPerDay) || 4),
    ptDaysPerWeek: +(val("cfg-pt-days", S.state && S.state.ptDaysPerWeek) || 3),
    ltsoM: +(val("cfg-ltso-m", S.state && S.state.ltsoM) || 0),
    ltsoF: +(val("cfg-ltso-f", S.state && S.state.ltsoF) || 0),
    stsoM: +(val("cfg-stso-m", S.state && S.state.stsoM) || 0),
    stsoF: +(val("cfg-stso-f", S.state && S.state.stsoF) || 0)
  };
  setupStore.fte = fte;
  return fte;
}

export function snapshotPeriod(S) {
  const period = {
    open: val("cfg-open", (S.state && S.state.open) || "03:30"),
    close: val("cfg-close", (S.state && S.state.close) || "23:00"),
    weeks: Math.max(1, Math.min(8, +(val("cfg-weeks", S.state && S.state.weekCount) || 1))),
    start: val("cfg-start", "")
  };
  setupStore.period = period;
  return period;
}

export function applyFte(S, fte) {
  if (!fte) return;
  function put(id, v) {
    const el = document.getElementById(id);
    if (el && v != null) el.value = v;
  }
  put("cfg-ft-m", fte.ftM); put("cfg-ft-f", fte.ftF);
  put("cfg-pt-m", fte.ptM); put("cfg-pt-f", fte.ptF);
  if (fte.ptHoursPerDay != null) put("cfg-pt-hours", fte.ptHoursPerDay);
  if (fte.ptDaysPerWeek != null) put("cfg-pt-days", fte.ptDaysPerWeek);
  put("cfg-ltso-m", fte.ltsoM); put("cfg-ltso-f", fte.ltsoF);
  put("cfg-stso-m", fte.stsoM); put("cfg-stso-f", fte.stsoF);
  if (!S.state) return;
  S.state.ftM = +fte.ftM || 0;
  S.state.ftF = +fte.ftF || 0;
  S.state.ptM = +fte.ptM || 0;
  S.state.ptF = +fte.ptF || 0;
  var hours = +fte.ptHoursPerDay;
  S.state.ptHoursPerDay = Number.isFinite(hours) && hours > 0 ? Math.min(12, hours) : 4;
  var days = Math.round(+fte.ptDaysPerWeek);
  S.state.ptDaysPerWeek = Number.isFinite(days) && days > 0 ? Math.max(1, Math.min(6, days)) : 3;
  S.state.ltsoM = +fte.ltsoM || 0;
  S.state.ltsoF = +fte.ltsoF || 0;
  S.state.stsoM = +fte.stsoM || 0;
  S.state.stsoF = +fte.stsoF || 0;
}

function readSetupCompanions(S) {
  if (S.readShiftsFromDom) {
    try { S.readShiftsFromDom(); } catch (e) {}
  }
  if (S.readExtraPositionsFromDom) {
    try { S.readExtraPositionsFromDom(); } catch (e) {}
  }
  if (S.readFunctionCoverageFromDom) {
    try { S.readFunctionCoverageFromDom(); } catch (e) {}
  } else if (S.readFunctionBandsFromDom) {
    try { S.readFunctionBandsFromDom(); } catch (e) {}
  }
  setupStore.extraPositions = (S.state && S.state.extraPositions) || [];
  setupStore.functionCoverage = (S.state && S.state.functionCoverage) || null;
}

export function collectSetupInputs(S) {
  const fte = snapshotFte(S);
  const period = snapshotPeriod(S);
  applyFte(S, fte);
  if (S.state) {
    S.state.open = period.open;
    S.state.close = period.close;
    S.state.weekCount = period.weeks;
    if (S.parseStartDate) S.state.startDate = S.parseStartDate(period.start || null);
  }
  readSetupCompanions(S);
  return {
    fte: fte,
    period: period,
    extraPositions: setupStore.extraPositions,
    functionCoverage: setupStore.functionCoverage,
    shifts: (S.state && S.state.shifts) || []
  };
}

export function exportStaffingConfig(S) {
  const snap = collectSetupInputs(S);
  const payload = {
    app: "blade-staffing",
    version: 1,
    savedAt: S.dj ? S.dj().toISOString() : new Date().toISOString(),
    fte: snap.fte,
    functionCoverage: snap.functionCoverage,
    extraPositions: snap.extraPositions || []
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const filename = (S.exportFileName && S.exportFileName("Staffing", ".json")) || "staffing.json";
  if (S.saveBlob) {
    S.saveBlob(blob, filename);
  } else {
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  try { localStorage.setItem("blade.staffingJson", JSON.stringify(payload)); } catch (e) {}
  if (S.updateStatus) S.updateStatus("Saved staffing (FTE + function coverage + extra positions).");
  return payload;
}
