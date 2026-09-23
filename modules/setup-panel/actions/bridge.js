/** Bridge exported helpers onto window.Scheduler so legacy code can call them. */
import { syncHoursFromAirfield } from "../utils/sync.js";
import { paintFunctionCoverage } from "./paint.js";
import { snapshotFte, applyFte, collectSetupInputs, exportStaffingConfig } from "../utils/fte.js";

export function bridgeScheduler(S) {
  if (!S) return;
  S.rebuildSetupTab = function () {
    syncHoursFromAirfield(S);
    paintFunctionCoverage(S);
    if (S.renderShiftsTable) S.renderShiftsTable();
    if (S.renderExtraPositions) S.renderExtraPositions();
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
  S.collectSetupInputs = function () { return collectSetupInputs(S); };
  S.exportStaffingConfig = function () { return exportStaffingConfig(S); };

  if (typeof S.exportJson === "function" && !S.exportJson._setupCollectWrapped) {
    var origExport = S.exportJson;
    S.exportJson = function () {
      collectSetupInputs(S);
      return origExport.apply(S, arguments);
    };
    S.exportJson._setupCollectWrapped = true;
  }
}
