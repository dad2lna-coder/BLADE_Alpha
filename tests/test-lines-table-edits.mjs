import assert from "node:assert";
import { initLineHelpers } from "../modules/shared/lines/helpers.js";
import { initRowModel, dowToScheduleOffset } from "../modules/lines-table/row-model.js";

const Scheduler = {
  state: {
    startDate: "2026-03-01",
    weekCount: 1,
    shifts: [
      { id: "S1", name: "AM Shift", start: "06:00", end: "14:30", paid: 8 },
      { id: "S2", name: "PM Shift", start: "14:00", end: "22:30", paid: 8 }
    ],
    lines: [
      { id: "101", lineCode: "L01", shiftId: "S1", empClass: "FT", isStso: true, sex: "M", function: "BAG" },
      { id: "102", lineCode: "L02", shiftId: "S2", empClass: "FT", isLtso: true, sex: "F", function: "PAX" },
      { id: "103", lineCode: "L03", shiftId: "S1", empClass: "PT", sex: "M", function: "DFO" }
    ],
    schedule: {
      "101": ["WORK", "WORK", "WORK", "WORK", "WORK", "RDO", "RDO"],
      "102": ["WORK", "WORK", "WORK", "WORK", "WORK", "RDO", "RDO"],
      "103": ["WORK", "WORK", "WORK", "RDO", "RDO", "RDO", "RDO"]
    },
    functionRotation: {
      "101": ["BAG", "BAG", "BAG", "BAG", "BAG", null, null],
      "102": ["PAX", "PAX", "PAX", "PAX", "PAX", null, null],
      "103": ["DFO", "DFO", "DFO", null, null, null, null]
    }
  },
  getShift(id) {
    return (Scheduler.state.shifts || []).find(s => s.id === id);
  },
  getEffectiveShiftTimes(shiftId, dow) {
    var s = Scheduler.getShift(shiftId);
    if (!s) return { start: "00:00", end: "00:00" };
    var key = String(dow);
    if (s.dayTimes && s.dayTimes[key] && s.dayTimes[key].start && s.dayTimes[key].end) {
      return { start: s.dayTimes[key].start, end: s.dayTimes[key].end };
    }
    return { start: s.start, end: s.end };
  },
  timeToMin(t) {
    if (!t) return 0;
    const parts = String(t).split(":").map(Number);
    return parts[0] * 60 + (parts[1] || 0);
  },
  isValidTimeText(t) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(t || ""));
  }
};

initLineHelpers(Scheduler);
initRowModel(Scheduler);

console.log("Testing Lines Table Filtering & Sorting...");

// Test Search Filter
Scheduler.linesView.searchCode = "L02";
let filtered = Scheduler.filterLinesForView(Scheduler.state.lines);
assert.strictEqual(filtered.length, 1, "Should filter down to L02");
assert.strictEqual(filtered[0].lineCode, "L02");

Scheduler.linesView.searchCode = "";

// Test Duty Filter
Scheduler.linesView.filterDuty = "BAG";
filtered = Scheduler.filterLinesForView(Scheduler.state.lines);
assert.strictEqual(filtered.length, 1, "Should filter BAG duty line");
assert.strictEqual(filtered[0].lineCode, "L01");

Scheduler.linesView.filterDuty = "DFO";
filtered = Scheduler.filterLinesForView(Scheduler.state.lines);
assert.strictEqual(filtered.length, 1, "Should filter DFO duty line");
assert.strictEqual(filtered[0].lineCode, "L03");

Scheduler.linesView.filterDuty = "";

// Test Start Time Sorting
Scheduler.linesView.sortBy = "start";
Scheduler.linesView.sortDir = "asc";
let sorted = Scheduler.sortLinesForView(Scheduler.state.lines);
assert.strictEqual(sorted[0].shiftId, "S1");

// Test Shift Start Time Editing
const shiftS1 = Scheduler.getShift("S1");
assert.strictEqual(shiftS1.start, "06:00");
shiftS1.start = "05:30";
shiftS1.end = "14:00";

const rowModels = Scheduler.getLineRowModels();
const row1 = rowModels.find(r => r.id === "101");
assert.strictEqual(row1.start, "05:30", "Row model should reflect updated shift start time");
assert.strictEqual(row1.end, "14:00", "Row model should reflect updated shift end time");

// Test Per-Line Time Isolation (editing line 101 start time must not mutate line 103 on same shift or shift definition)
const line101 = Scheduler.state.lines.find(l => l.id === "101");
const line103 = Scheduler.state.lines.find(l => l.id === "103");

line101.startTime = "05:00";
line101.endTime = "13:30";

const lineRows = Scheduler.getLineRowModels();
const row101 = lineRows.find(r => r.id === "101");
const row103 = lineRows.find(r => r.id === "103");

assert.strictEqual(row101.start, "05:00", "Line 101 start time updated");
assert.strictEqual(row101.end, "13:30", "Line 101 end time updated");
assert.strictEqual(shiftS1.start, "05:30", "Shared shift S1 start time remains unchanged");
assert.strictEqual(row103.start, "05:30", "Sibling line 103 on same shift S1 remains unchanged");

// Test Day-Specific Duty Filter
Scheduler.linesView.filterDuty = "BAG";
Scheduler.linesView.filterDay = "0"; // Sunday
let dayFiltered = Scheduler.filterLinesForView(Scheduler.state.lines);
assert.strictEqual(dayFiltered.length, 1, "Line 101 is BAG on Sunday");

Scheduler.linesView.filterDay = "5"; // Friday (RDO for 101)
dayFiltered = Scheduler.filterLinesForView(Scheduler.state.lines);
assert.strictEqual(dayFiltered.length, 0, "No lines are BAG on Friday");

Scheduler.linesView.filterDuty = "";
Scheduler.linesView.filterDay = "";

// Test TRAINING Duty for ESTI Line
const estiLine = { id: "201", lineCode: "ESTI 01", shiftId: "S1", empClass: "ESTI", position: "ESTI", isTraining: true, opsFte: false };
const estiRow = Scheduler.lineToRowModel(estiLine, ["WORK", "WORK", "WORK", "WORK", "WORK", "RDO", "RDO"], {});
assert.strictEqual(estiRow.dayDuties[0], "TRAINING", "ESTI line work day defaults to TRAINING duty");

// Test TRAINING Filter Fallback Without Rotation Entries
Scheduler.state.lines.push(estiLine);
Scheduler.state.schedule["201"] = ["WORK", "WORK", "WORK", "WORK", "WORK", "RDO", "RDO"];
Scheduler.linesView.filterDuty = "TRAINING";
Scheduler.linesView.filterDay = "0";
let trainingFiltered = Scheduler.filterLinesForView(Scheduler.state.lines);
assert.strictEqual(trainingFiltered.length, 1, "TRAINING filter matches ESTI line on Sunday");
assert.strictEqual(trainingFiltered[0].id, "201");

// Test Per-Day Line Time Isolation
line101.dayTimes = { "0": { start: "04:00", end: "12:30" } };
const updatedRows = Scheduler.getLineRowModels();
const row101Day = updatedRows.find(r => r.id === "101");
const row103Day = updatedRows.find(r => r.id === "103");
assert.strictEqual(row101Day.dayStarts[0], "04:00", "Line 101 day 0 start time updated");
assert.strictEqual(row103Day.dayStarts[0], "05:30", "Sibling line 103 day 0 start time unaffected");

Scheduler.linesView.filterDuty = "";
Scheduler.linesView.filterDay = "";

// Wednesday start: column d reads schedule[offset] whose weekdaySun0 is d.
// 2026-10-07 is Wednesday. Tue (2) lands at offset 6, not under Sat.
const wedMap = dowToScheduleOffset("2026-10-07", 1);
assert.strictEqual(wedMap[2], 6, "Tuesday column maps to offset 6 when start is Wednesday");
assert.strictEqual(wedMap[3], 0, "Wednesday column is the start offset");
assert.strictEqual(wedMap[0], 4, "Sunday column is offset 4");
assert.deepStrictEqual(dowToScheduleOffset("2026-03-01", 1), { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }, "Sunday start stays identity");
assert.strictEqual(dowToScheduleOffset("2026-10-05", 1)[2], 1, "Monday start: Tuesday is offset 1");

Scheduler.state.startDate = "2026-10-07";
const wedLine = {
  id: "301",
  lineCode: "L-WED",
  shiftId: "S1",
  empClass: "FT",
  sex: "M",
  function: "PAX",
  rdoDays: [2],
  paid: 8,
  dayTimes: { "2": { start: "04:00", end: "12:00" } }
};
const wedSched = ["WORK", "WORK", "WORK", "WORK", "WORK", "WORK", "RDO"];
const wedRow = Scheduler.lineToRowModel(wedLine, wedSched, {
  dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  rotationDutyResolver: function (_id, off) { return off === 6 ? "BAG" : "PAX"; }
});
assert.strictEqual(wedRow.days[2], "RDO", "Tue column shows the Tuesday RDO");
assert.strictEqual(wedRow.dayDuties[2], "OFF", "Tue column duty is OFF");
assert.strictEqual(wedRow.days[6], "WORK", "Sat column is not the Tuesday offset");
assert.ok(String(wedRow.rdos).indexOf("Tue") >= 0, "RDOs text names Tue");
assert.strictEqual(wedRow.days[0], "WORK", "Sun column follows Sunday's offset");
assert.strictEqual(wedRow.hours, 48, "Six work offsets count");
assert.strictEqual(wedRow.dayStarts[2], "04:00", "Tue time stays on weekday key, not schedule offset");

const wedWork = ["WORK", "WORK", "WORK", "WORK", "WORK", "WORK", "WORK"];
const wedDuty = Scheduler.lineToRowModel(Object.assign({}, wedLine, { rdoDays: [] }), wedWork, {
  rotationDutyResolver: function (_id, off) { return off === 6 ? "BAG" : "PAX"; }
});
assert.strictEqual(wedDuty.dayDuties[2], "BAG", "Tue column reads rotation at the Tuesday offset");
assert.strictEqual(wedDuty.dayDuties[6], "PAX", "Sat column does not read the Tuesday rotation slot");

Scheduler.state.startDate = "2026-03-01";

console.log("ALL LINES TABLE EDIT & FILTER TESTS PASSED SUCCESSFULLY!");
