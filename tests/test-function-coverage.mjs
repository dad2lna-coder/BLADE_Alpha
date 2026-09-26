import assert from "node:assert/strict";
import { initFunctionCoverage } from "../modules/function-coverage/index.js";

const S = {
  $: () => null,
  state: {
    startDate: "2026-09-01",
    weekCount: 1,
    fte: {
      FT: { M: 10, F: 10 },
      PT: { M: 0, F: 0 },
      LTSO: { M: 2, F: 2 },
      STSO: { M: 1, F: 1 }
    },
    shifts: [],
    lines: [],
    schedule: {}
  },
  timeToMin: (t) => {
    const [h, m] = String(t).split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  },
  slotLabel: (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
  coverageSlots: () => [210, 240, 270, 300, 330],
  getShift: () => ({ start: "03:30", end: "23:00" }),
  getEffectiveShiftTimes: () => ({ start: "03:30", end: "23:00" }),
  updateStatus: () => {},
  renderIssues: () => {}
};

initFunctionCoverage(S);
S.ensureFunctionCoverage();
console.log(S.state.functionCoverage);

assert.equal(typeof S.initFunctionCoverage, "function");
assert.equal(typeof S.generateFunctionAssignments, "function");
assert.equal(typeof S.ensureFunctionCoverage, "function");

console.log("test-function-coverage: ok");
