import assert from "node:assert";
import { lineMatchesCoverageFilter, computeHourlyByDow } from "../modules/coverage/utils/hourly.js";
import { computeRoleMatrixByDow } from "../modules/reports/deviation.js";

function createMockScheduler() {
  const S = {
    state: {
      open: "06:00",
      close: "18:00",
      startDate: "2026-09-28",
      weekCount: 1,
      lines: [
        { id: "L1", shiftId: "S1", sex: "M", function: "DFO", functionEligible: { dfo: true } },
        { id: "L2", shiftId: "S1", sex: "F", function: "TSO", functionEligible: { pax: true } }
      ],
      shifts: [
        { id: "S1", name: "AM", start: "06:00", end: "14:00" }
      ],
      schedule: {
        "L1": ["WORK", "WORK", "WORK", "WORK", "WORK", "RDO", "RDO"],
        "L2": ["WORK", "WORK", "WORK", "WORK", "WORK", "RDO", "RDO"]
      },
      functionRotation: {
        "L1": ["BAG", "PAX", null, "DFO", "BAG", "RDO", "RDO"],
        "L2": ["BAG", "PAX", null, null, null, "RDO", "RDO"]
      }
    },
    coverageView: { stso: true, ltso: true, tso: true, funcView: "all" },
    timeToMin(t) {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    },
    getShift(id) {
      return S.state.shifts.find(s => s.id === id);
    },
    lineRoleKey(line) {
      return "TSO";
    },
    getRotationDuty(lineId, dayOff) {
      const rot = S.state.functionRotation[lineId];
      return rot ? rot[dayOff] : null;
    },
    coverageSlots() {
      return [360, 390, 420];
    }
  };
  return S;
}

console.log("Running Filter Semantics tests...");

const S = createMockScheduler();
const lineDfo = S.state.lines[0];
const lineReg = S.state.lines[1];

S.coverageView.funcView = "dfo";
assert.strictEqual(lineMatchesCoverageFilter(S, lineDfo, 0), true, "DFO person on BAG day is in DFO mode");
assert.strictEqual(lineMatchesCoverageFilter(S, lineReg, 0), false, "Regular person on BAG day is NOT in DFO mode");

S.coverageView.funcView = "bag";
assert.strictEqual(lineMatchesCoverageFilter(S, lineDfo, 0), true, "DFO person on BAG day is in BAG mode");
assert.strictEqual(lineMatchesCoverageFilter(S, lineReg, 0), true, "Regular person on BAG day is in BAG mode");

S.coverageView.funcView = "pax";
assert.strictEqual(lineMatchesCoverageFilter(S, lineDfo, 0), false, "DFO person on BAG day is NOT in PAX mode");
assert.strictEqual(lineMatchesCoverageFilter(S, lineReg, 0), false, "Regular person on BAG day is NOT in PAX mode");

S.coverageView.funcView = "all";
assert.strictEqual(lineMatchesCoverageFilter(S, lineDfo, 0), true, "DFO person on BAG day is in ALL mode");
assert.strictEqual(lineMatchesCoverageFilter(S, lineReg, 0), true, "Regular person on BAG day is in ALL mode");

S.coverageView.funcView = "dfo";
assert.strictEqual(lineMatchesCoverageFilter(S, lineDfo, 1), true, "DFO person on PAX day is in DFO mode");
assert.strictEqual(lineMatchesCoverageFilter(S, lineReg, 1), false, "Regular person on PAX day is NOT in DFO mode");

S.coverageView.funcView = "bag";
assert.strictEqual(lineMatchesCoverageFilter(S, lineDfo, 1), false, "DFO person on PAX day is NOT in BAG mode");
assert.strictEqual(lineMatchesCoverageFilter(S, lineReg, 1), false, "Regular person on PAX day is NOT in BAG mode");

S.coverageView.funcView = "pax";
assert.strictEqual(lineMatchesCoverageFilter(S, lineDfo, 1), true, "DFO person on PAX day is in PAX mode");
assert.strictEqual(lineMatchesCoverageFilter(S, lineReg, 1), true, "Regular person on PAX day is in PAX mode");

const totalRpt = computeRoleMatrixByDow(S, { mode: "total" });
const dfoRpt = computeRoleMatrixByDow(S, { mode: "dfoPool" });
const bagRpt = computeRoleMatrixByDow(S, { mode: "baggage" });
const paxRpt = computeRoleMatrixByDow(S, { mode: "passenger" });

assert.strictEqual(totalRpt.matrix[0][0].TSO.M + totalRpt.matrix[0][0].TSO.F, 2, "Total report counts both L1(M) and L2(F)");
assert.strictEqual(dfoRpt.matrix[0][0].TSO.M, 1, "DFO report counts L1(M) on BAG day");
assert.strictEqual(dfoRpt.matrix[0][0].TSO.F, 0, "DFO report excludes L2(F)");
assert.strictEqual(bagRpt.matrix[0][0].TSO.M + bagRpt.matrix[0][0].TSO.F, 2, "BAG report counts both L1 and L2 on BAG day");
assert.strictEqual(paxRpt.matrix[0][0].TSO.M + paxRpt.matrix[0][0].TSO.F, 0, "PAX report excludes both L1 and L2 on BAG day");

assert.strictEqual(paxRpt.matrix[0][1].TSO.M + paxRpt.matrix[0][1].TSO.F, 2, "PAX report counts both L1 and L2 on PAX day");

console.log("Filter Semantics tests PASSED successfully!");
