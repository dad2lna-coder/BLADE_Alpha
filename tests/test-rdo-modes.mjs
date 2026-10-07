import assert from "node:assert";
import { attachShiftMath, assignRdoDays, consecutiveRdos } from "../modules/setup-panel/utils/shiftMath.js";
import { buildLines } from "../modules/setup-panel/utils/buildLines.js";
import { buildScheduleForLine } from "../modules/setup-panel/actions/generate.js";
import { generateClass } from "../modules/setup-panel/utils/classGenerate.js";

function timeToMin(t) {
  var parts = String(t || "0:0").split(":").map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}

function stub() {
  var S = {
    state: { shifts: [] },
    timeToMin: timeToMin,
    isValidTimeText: function (t) { return /^\d{2}:\d{2}$/.test(String(t || "")); },
    safeNumber: function (v, d) { return Number.isFinite(+v) ? +v : d; },
    DAYS: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  };
  attachShiftMath(S);
  return S;
}

function isConsecutivePair(a, b) {
  var diff = Math.abs(a - b);
  return diff === 1 || diff === 6;
}

function keyOf(days) {
  return days.slice().sort(function (a, b) { return a - b; }).join("-");
}

var S = stub();

// Legacy soft consecutive block is unchanged when mode is off.
for (var seed = 0; seed < 7; seed++) {
  for (var count = 1; count <= 3; count++) {
    var soft = assignRdoDays(S, { rdoMode: "off", rdoHard: [] }, count, seed);
    assert.deepStrictEqual(soft.rdoDays, consecutiveRdos(count, seed), "soft consecutive seed " + seed + " count " + count);
    assert.strictEqual(soft.hard, false);
    assert.strictEqual(soft.mode, "off");
  }
}

// Legacy hard RDOs: copy, then pad Sunday-first. Do not truncate extras.
var padded = assignRdoDays(S, { rdoHard: [3], rdoMode: "off" }, 2, 5);
assert.deepStrictEqual(padded.rdoDays, [3, 0], "hard Wednesday pads with Sunday");
assert.strictEqual(padded.hard, true);
var kept = assignRdoDays(S, { rdoHard: [2, 3, 6] }, 2, 0);
assert.deepStrictEqual(kept.rdoDays, [2, 3, 6], "extra hard days are kept");

// Mode without a day falls back to legacy, including a split shift's hard days.
var splitLegacy = {
  rdoMode: "4x10",
  rdoHard: [1],
  segments: [{ start: "05:00", end: "10:00" }, { start: "12:00", end: "17:00" }]
};
assert.deepStrictEqual(assignRdoDays(S, splitLegacy, 2, 0).rdoDays, [1, 0], "mode without a day stays legacy");

// 4×10 + Tuesday: every line off Tuesday; the other two are a consecutive pair; pairs can differ.
var tue = 2;
var pairKeys = {};
for (var i = 0; i < 5; i++) {
  var placed = assignRdoDays(S, { rdoMode: "4x10", rdoConstraint: tue, rdoHard: [0, 6] }, 3, i);
  assert.strictEqual(placed.rdoDays.length, 3, "4x10 places 3 RDOs");
  assert.ok(placed.rdoDays.indexOf(tue) >= 0, "Tuesday is always off");
  var rest = placed.rdoDays.filter(function (d) { return d !== tue; });
  assert.strictEqual(rest.length, 2);
  assert.ok(isConsecutivePair(rest[0], rest[1]), "other two are consecutive, got " + rest.join("-"));
  assert.ok(rest.indexOf(tue) < 0);
  pairKeys[keyOf(rest)] = true;
  assert.strictEqual(placed.hard, false, "mode does not mark the hard-checkbox flag");
}
assert.ok(Object.keys(pairKeys).length >= 2, "consecutive pairs differ by seed");

// Hard Sunday/Saturday are not forced once 4×10 mode is on (seed 1 → Wed–Thu).
var ignoredHard = assignRdoDays(S, { rdoMode: "4x10", rdoConstraint: 2, rdoHard: [0, 6] }, 3, 1);
assert.ok(ignoredHard.rdoDays.indexOf(0) < 0 && ignoredHard.rdoDays.indexOf(6) < 0, "mode replaces hard pad");

// 5×8: both RDOs sit in {day before, constraint, day after}. Patterns rotate.
var zone = { 1: true, 2: true, 3: true };
var fiveKeys = {};
for (var j = 0; j < 3; j++) {
  var five = assignRdoDays(S, { rdoMode: "5x8", rdoConstraint: 2, rdoHard: [0, 6] }, 2, j);
  assert.strictEqual(five.rdoDays.length, 2);
  five.rdoDays.forEach(function (d) {
    assert.ok(zone[d], "RDO " + d + " is outside the Tuesday window");
  });
  fiveKeys[keyOf(five.rdoDays)] = five.rdoDays.slice();
}
assert.deepStrictEqual(fiveKeys["1-2"], [1, 2], "before + constraint");
assert.deepStrictEqual(fiveKeys["2-3"], [2, 3], "constraint + after");
assert.deepStrictEqual(fiveKeys["1-3"], [1, 3], "before + after");

// Split times do not change the pattern.
var plain = { rdoMode: "5x8", rdoConstraint: 4, paid: 8 };
var split = {
  rdoMode: "5x8",
  rdoConstraint: 4,
  paid: 8,
  segments: [{ start: "06:00", end: "10:00" }, { start: "13:00", end: "17:00" }]
};
assert.deepStrictEqual(
  assignRdoDays(S, plain, 2, 2).rdoDays,
  assignRdoDays(S, split, 2, 2).rdoDays,
  "split shift uses the same RDO mode"
);

// normalizeShift persists mode + constraint and still keeps split segments as times only.
var norm = S.normalizeShift({
  id: "SX",
  name: "Split",
  paid: 10,
  rdoMode: "4x10",
  rdoConstraint: "2",
  rdoHard: [0],
  segments: [{ start: "05:00", end: "10:00" }, { start: "12:00", end: "16:30" }]
}, 0);
assert.strictEqual(norm.rdoMode, "4x10");
assert.strictEqual(norm.rdoConstraint, 2);
assert.deepStrictEqual(norm.rdoHard, [0]);
assert.strictEqual(norm.segments.length, 2);
assert.strictEqual(norm.segments[0].start, "05:00");
var round = S.normalizeShift(norm, 0);
assert.strictEqual(round.rdoMode, "4x10");
assert.strictEqual(round.rdoConstraint, 2);

// Generate path: buildLines on a 4×10 shift.
S.state = {
  ftM: 4,
  ftF: 2,
  ptM: 0,
  ptF: 0,
  issues: [],
  shifts: [{
    id: "S10",
    name: "4x10",
    start: "06:00",
    end: "16:30",
    paid: 10,
    force: 0,
    rdoHard: [0, 6],
    rdoMode: "4x10",
    rdoConstraint: 2
  }]
};
var lines = buildLines(S, { S10: 6 });
assert.strictEqual(lines.length, 6, "built 6 lines");
var builtPairs = {};
lines.forEach(function (line) {
  assert.ok(line.rdoDays.indexOf(2) >= 0, line.lineCode + " missing Tuesday");
  var others = line.rdoDays.filter(function (d) { return d !== 2; });
  assert.strictEqual(others.length, 2, line.lineCode + " rdo " + line.rdoDays);
  assert.ok(isConsecutivePair(others[0], others[1]), line.lineCode + " pair " + others);
  builtPairs[keyOf(others)] = true;
});
assert.ok(Object.keys(builtPairs).length >= 2, "buildLines rotates pairs across lines");

S.state.startDate = "2026-10-04";
S.state.weekCount = 1;
lines.forEach(function (line) {
  var sched = buildScheduleForLine(S, line, 7);
  assert.strictEqual(sched[2], "RDO", "schedule Tuesday is RDO for " + line.lineCode);
  line.rdoDays.forEach(function (d) {
    assert.strictEqual(sched[d], "RDO", "schedule respects rdo day " + d);
  });
});

// classGenerate on a 5×8 shift writes the same window into the schedule.
var S5 = stub();
S5.state = {
  open: "04:00",
  close: "22:00",
  weekCount: 1,
  startDate: "2026-10-04",
  ftM: 3,
  ftF: 3,
  ptM: 0,
  ptF: 0,
  lines: [],
  schedule: {},
  functionRotation: {},
  issues: [],
  shifts: [{
    id: "S8",
    name: "5x8",
    start: "08:00",
    end: "16:30",
    paid: 8,
    force: 0,
    rdoHard: [0],
    rdoMode: "5x8",
    rdoConstraint: 2
  }]
};
generateClass(S5, "TSO", { S8: { M: 3, F: 3 } });
var classLines = (S5.state.lines || []).filter(function (l) { return l.shiftId === "S8" && !l.isShortfall; });
assert.ok(classLines.length >= 4, "class generate placed lines");
var classKeys = {};
classLines.forEach(function (line) {
  assert.strictEqual(line.rdoDays.length, 2);
  line.rdoDays.forEach(function (d) {
    assert.ok(d >= 1 && d <= 3, "class RDO " + d + " left the Tuesday window");
  });
  var sched = S5.state.schedule[line.id];
  assert.ok(sched, "schedule built");
  for (var dow = 0; dow < 7; dow++) {
    if (sched[dow] === "RDO") assert.ok(dow >= 1 && dow <= 3, "scheduled RDO " + dow + " is not adjacent");
  }
  classKeys[keyOf(line.rdoDays)] = true;
});
assert.ok(Object.keys(classKeys).length >= 2, "class generate rotates 5x8 patterns");

console.log("ALL CONSTRAINT-DAY RDO MODE TESTS PASSED");
