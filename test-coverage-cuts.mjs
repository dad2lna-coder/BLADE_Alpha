import assert from "node:assert/strict";
import { applyCoverageCutsToLines } from "./modules/coverage/components/cuts.js";
import { parseStartDate, addDays, weekdaySun0, dj } from "./modules/shared/utils/dates.js";

const S = {
  parseStartDate,
  addDays,
  weekdaySun0,
  dj,
  lineRoleKey: (line) => line.position || "TSO",
  buildScheduleForLine: (line, days) => {
    const rdo = new Set(line.rdoDays || []);
    const arr = [];
    for (let i = 0; i < days; i++) {
      const dow = (i + 2) % 7; // Monday = 1
      arr.push(rdo.has(dow) ? "RDO" : "WORK");
    }
    return arr;
  },
  state: {
    weekCount: 1,
    startDate: "2026-09-01",
    lines: [
      { id: 1, shiftId: "S1", position: "TSO", sex: "M", rdoDays: [0, 6] },
      { id: 2, shiftId: "S1", position: "TSO", sex: "M", rdoDays: [0, 6] },
      { id: 3, shiftId: "S1", position: "TSO", sex: "M", rdoDays: [0, 6] },
      { id: 4, shiftId: "S1", position: "TSO", sex: "M", rdoDays: [0, 6] },
      { id: 5, shiftId: "S1", position: "TSO", sex: "M", rdoDays: [0, 6] }
    ],
    schedule: {},
    coverageCuts: [
      {
        id: "c1",
        enabled: true,
        pct: 20,
        shiftId: "S1",
        roles: { STSO: true, LTSO: true, TSO: true },
        sexes: { M: true, F: true },
        days: [1] // Monday
      }
    ],
    issues: []
  }
};

// Apply coverage cuts
const touched = applyCoverageCutsToLines(S);

assert.ok(touched > 0, "should touch at least 1 line");
assert.ok(S.state.issues.some((iss) => iss.includes("Coverage cuts")), "should add issue note");

// Check touched line has Monday (1) in rdoDays
const touchedLine = S.state.lines.find((l) => l.rdoDays.includes(1));
assert.ok(touchedLine, "touched line should have Monday in rdoDays");

console.log("test-coverage-cuts: ok");
