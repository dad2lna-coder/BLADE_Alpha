import assert from "node:assert";
import { buildLines } from "../modules/setup-panel/utils/buildLines.js";

console.log("Running PT Proportional Placement tests...");

const mockS = {
  state: {
    ftM: 10,
    ftF: 10,
    ptM: 5,
    ptF: 5,
    ptHoursPerDay: 4,
    issues: [],
    shifts: [
      { id: "S1", name: "AM 8h", paid: 8 },
      { id: "S2", name: "PM 8h", paid: 8 },
      { id: "S3", name: "LONG 10h", paid: 10 }
    ]
  },
  targetWorkDays(shiftId, empClass) {
    return 5;
  },
  shiftLabel(def) {
    return def.name;
  },
  consecutiveRdos(rdoCount, seed) {
    return [0, 1];
  }
};

const counts = { S1: 10, S2: 10, S3: 10 };
const lines = buildLines(mockS, counts);

assert.strictEqual(lines.length, 30, "Total generated lines should be 30");

const ptLines = lines.filter(l => l.empClass === "PT");
assert.strictEqual(ptLines.length, 10, "All 10 PT employees should be placed");

const ptByShift = ptLines.reduce((acc, l) => {
  acc[l.shiftId] = (acc[l.shiftId] || 0) + 1;
  return acc;
}, {});

console.log("PT placement breakdown by shift:", ptByShift);

// Requirement: Long shift must be FT-only (0 PT placed on S3)
assert.strictEqual(ptByShift["S3"] || 0, 0, "Long shift (S3) must have 0 PT lines (FT-only)");

// Requirement: PT lines must be placed on >= 2 distinct non-long shifts (not all PT on one shift/band)
const distinctPtShifts = Object.keys(ptByShift);
assert.ok(
  distinctPtShifts.length >= 2,
  `PT lines must be placed on >= 2 distinct non-long shifts (got ${distinctPtShifts.length})`
);

assert.ok(
  (ptByShift["S1"] || 0) > 0 && (ptByShift["S2"] || 0) > 0,
  "Both non-long shifts (S1 and S2) must receive PT lines"
);

console.log("PT Proportional Placement tests PASSED successfully!");
