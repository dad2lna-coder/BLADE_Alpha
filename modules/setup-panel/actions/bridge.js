/** Bridge exported helpers onto window.Scheduler so legacy code can call them. */
import { syncHoursFromAirfield } from "../utils/sync.js";
import { paintFunctionCoverage } from "../actions/paint.js";
import { snapshotFte, applyFte } from "../utils/fte.js";

export function bridgeScheduler(S) {
  if (!S) return;
  S.rebuildSetupTab = function () {
    syncHoursFromAirfield(S);
    paintFunctionCoverage(S);
    if (S.renderShiftsTable) S.renderShiftsTable();
  };
  S.addShift = function () {
    if (!S.readShiftsFromDom || !S.state || !S.state.shifts || !S.renderShiftsTable) return;
    S.readShiftsFromDom();
    var id = "S" + S.shiftSeq++;
    S.state.shifts.push({
      id: id,
      name: "Shift",
      start: "08:00",
      end: "16:30",
      paid: 8,
      force: 0,
      ltsoForce: 0,
      stsoForce: 0,
      rdoHard: []
    });
    S.renderShiftsTable();
  };
  S.snapshotFte = function () { return snapshotFte(S); };
  S.applyFte = function (fte) { applyFte(S, fte); };
}