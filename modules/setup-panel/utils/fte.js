/** FTE snapshot / apply — bridge between DOM inputs and S.state */
import { val } from "../utils/sync.js";

export function snapshotFte(S) {
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

export function applyFte(S, fte) {
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