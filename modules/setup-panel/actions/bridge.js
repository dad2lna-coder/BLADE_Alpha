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
import { attachSetupState } from "../stores/setupStore.js";
import { attachExportBoard } from "./exportBoard.js";

function safeAttach(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error("setup-panel bridge:", name, err);
  }
}

export function bridgeScheduler(S) {
  if (!S) return;

  safeAttach("attachSetupState", function () { attachSetupState(S); });
  safeAttach("attachGenerate", function () { attachGenerate(S); });
  safeAttach("attachShiftMath", function () { attachShiftMath(S); });
  safeAttach("attachShiftsTable", function () { attachShiftsTable(S); });
  safeAttach("attachExtraPositions", function () { attachExtraPositions(S); });
  safeAttach("attachAllocation", function () { attachAllocation(S); });
  safeAttach("attachAirportStub", function () { attachAirportStub(S); });
  safeAttach("attachExportBoard", function () { attachExportBoard(S); });

  safeAttach("rebuildSetupTab", function () {
    S.rebuildSetupTab = function () {
      syncHoursFromAirfield(S);
      paintFunctionCoverage(S);
      if (S.renderShiftsTable) S.renderShiftsTable();
      if (S.renderExtraPositions) S.renderExtraPositions();
    };
  });
  safeAttach("snapshotFte", function () {
    S.snapshotFte = function () { return snapshotFte(S); };
  });
  safeAttach("applyFte", function () {
    S.applyFte = function (fte) { applyFte(S, fte); };
  });
  safeAttach("collectSetupInputs", function () {
    S.collectSetupInputs = function () { return collectSetupInputs(S); };
  });
  safeAttach("exportStaffingConfig", function () {
    S.exportStaffingConfig = function () { return exportStaffingConfig(S); };
  });

  safeAttach("exportJson", function () {
    if (typeof S.exportJson === "function" && !S.exportJson._setupCollectWrapped) {
      var origExport = S.exportJson;
      S.exportJson = function () {
        collectSetupInputs(S);
        return origExport.apply(S, arguments);
      };
      S.exportJson._setupCollectWrapped = true;
    }
  });

  if (typeof S._setupGenerate !== "function" || typeof S.generate !== "function") {
    console.error("setup-panel bridge: generate not attached", {
      _setupGenerate: typeof S._setupGenerate,
      generate: typeof S.generate
    });
    if (S.updateStatus) S.updateStatus("Setup generate failed to attach — check console.");
  }
}
