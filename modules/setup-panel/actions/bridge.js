/** Bridge exported helpers onto window.Scheduler so legacy code can call them. */
import { syncHoursFromAirfield } from "../utils/sync.js";
import { paintFunctionCoverage } from "./paint.js";
import { snapshotFte, applyFte, collectSetupInputs, exportStaffingConfig } from "../utils/fte.js";
import { attachShiftsTable } from "./shiftsTable.js";
import { attachExtraPositions } from "../utils/extraPositions.js";
import { attachGenerate } from "./generate.js";
import { attachAllocation } from "./allocation.js";
import { attachShiftMath } from "../utils/shiftMath.js";
import { attachAirportStub } from "../utils/airportStub.js";

export function bridgeScheduler(S) {
  if (!S) return;
  attachShiftMath(S);
  attachShiftsTable(S);
  attachExtraPositions(S);
  attachAllocation(S);
  attachGenerate(S);
  attachAirportStub(S);

  S.rebuildSetupTab = function () {
    syncHoursFromAirfield(S);
    paintFunctionCoverage(S);
    if (S.renderShiftsTable) S.renderShiftsTable();
    if (S.renderExtraPositions) S.renderExtraPositions();
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
