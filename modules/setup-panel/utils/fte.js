/** FTE snapshot / apply — Setup module owns these inputs. */
import { val } from "./sync.js";
import { setupStore } from "../stores/setupStore.js";

export function snapshotFte(S) {
  const fte = {
    ftM: +(val("cfg-ft-m", S.state && S.state.ftM) || 0),
    ftF: +(val("cfg-ft-f", S.state && S.state.ftF) || 0),
    ptM: +(val("cfg-pt-m", S.state && S.state.ptM) || 0),
    ptF: +(val("cfg-pt-f", S.state && S.state.ptF) || 0),
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
  put("cfg-ltso-m", fte.ltsoM); put("cfg-ltso-f", fte.ltsoF);
  put("cfg-stso-m", fte.stsoM); put("cfg-stso-f", fte.stsoF);
  if (!S.state) return;
  S.state.ftM = +fte.ftM || 0;
  S.state.ftF = +fte.ftF || 0;
  S.state.ptM = +fte.ptM || 0;
  S.state.ptF = +fte.ptF || 0;
  S.state.ltsoM = +fte.ltsoM || 0;
  S.state.ltsoF = +fte.ltsoF || 0;
  S.state.stsoM = +fte.stsoM || 0;
  S.state.stsoF = +fte.stsoF || 0;
}

export function collectSetupInputs(S) {
  const fte = snapshotFte(S);
  const period = snapshotPeriod(S);
  applyFte(S, fte);
  if (!S.state) return { fte, period };
  S.state.open = period.open;
  S.state.close = period.close;
  S.state.weekCount = period.weeks;
  if (S.parseStartDate) S.state.startDate = S.parseStartDate(period.start || null);
  return { fte, period };
}
