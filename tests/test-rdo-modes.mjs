import assert from "node:assert";
import { attachShiftMath, assignRdoDays, consecutiveRdos, hardDaysMatchingMode } from "../modules/setup-panel/utils/shiftMath.js";
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

function neighbors(c) {
  return { prev: (c + 6) % 7, next: (c + 1) % 7 };
}

function isThreeRun(days) {
  function touch(a, b) {
    var d = Math.abs(a - b);
    return d === 1 || d === 6;
  }
  var links = 0;
  for (var i = 0; i < days.length; i++) {
    for (var j = i + 1; j < days.length; j++) if (touch(days[i], days[j])) links++;
  }
  return links >= 2;
}

function assertPinnedPair(days, c) {
  assert.ok(days.indexOf(c) >= 0, "missing constraint " + c + " in " + days.join("-"));
  var nb = neighbors(c);
  assert.ok(days.indexOf(nb.prev) >= 0 || days.indexOf(nb.next) >= 0, "no consecutive pair on " + c + " in " + days.join("-"));
}

// 4×10: pin any DOW, consecutive pair with that day, third day flexes and is not always glued on.
for (var c4 = 0; c4 < 7; c4++) {
  var flexPatterns = {};
  var loose = 0;
  for (var s4 = 0; s4 < 10; s4++) {
    var p4 = assignRdoDays(S, { rdoMode: "4x10", rdoConstraint: c4, rdoHard: [0, 6] }, 3, s4);
    assert.strictEqual(p4.rdoDays.length, 3, "4x10 count for day " + c4);
    assertPinnedPair(p4.rdoDays, c4);
    assert.strictEqual(p4.hard, false);
    flexPatterns[keyOf(p4.rdoDays)] = true;
    if (!isThreeRun(p4.rdoDays)) loose++;
  }
  assert.ok(Object.keys(flexPatterns).length >= 2, "4x10 flex differs by line for day " + c4);
  assert.ok(loose > 0, "4x10 does not force a 3-day block for day " + c4);
}
assert.strictEqual(hardDaysMatchingMode({ rdoMode: "4x10", rdoConstraint: 0, rdoHard: [3, 4] }).join("-"), "0");
assert.strictEqual(hardDaysMatchingMode({ rdoMode: "off", rdoConstraint: 0, rdoHard: [3] }), null);
assert.strictEqual(hardDaysMatchingMode({ rdoMode: "4x10", rdoHard: [1] }), null, "mode without a day does not invent Tuesday");

// 5×8: pin any DOW. Second RDO is only the day before or after. No before+after pattern.
for (var c5 = 0; c5 < 7; c5++) {
  var nb = neighbors(c5);
  var seenSide = {};
  for (var s5 = 0; s5 < 4; s5++) {
    var p5 = assignRdoDays(S, { rdoMode: "5x8", rdoConstraint: c5, rdoHard: [0, 6] }, 2, s5);
    assert.strictEqual(p5.rdoDays.length, 2, "5x8 count for day " + c5);
    assert.ok(p5.rdoDays.indexOf(c5) >= 0, "5x8 works the pin " + c5);
    var other = p5.rdoDays.filter(function (d) { return d !== c5; });
    assert.strictEqual(other.length, 1);
    assert.ok(other[0] === nb.prev || other[0] === nb.next, "5x8 second day " + other[0] + " is not adjacent to " + c5);
    assert.notStrictEqual(keyOf(p5.rdoDays), keyOf([nb.prev, nb.next]), "before+after pattern removed");
    seenSide[other[0]] = true;
  }
  assert.ok(seenSide[nb.prev] && seenSide[nb.next], "5x8 rotates both sides for day " + c5);
}
assert.strictEqual(hardDaysMatchingMode({ rdoMode: "5x8", rdoConstraint: 5 }).join("-"), "5");

// Split times do not change the pattern. Constraint is Friday, not a baked-in Tuesday.
var plain = { rdoMode: "5x8", rdoConstraint: 5, paid: 8 };
var split = {
  rdoMode: "5x8",
  rdoConstraint: 5,
  paid: 8,
  segments: [{ start: "06:00", end: "10:00" }, { start: "13:00", end: "17:00" }]
};
assert.deepStrictEqual(
  assignRdoDays(S, plain, 2, 1).rdoDays,
  assignRdoDays(S, split, 2, 1).rdoDays,
  "split shift uses the same RDO mode"
);

// normalizeShift persists mode + constraint, including Sunday (0), and still keeps split segments as times only.
var norm = S.normalizeShift({
  id: "SX",
  name: "Split",
  paid: 10,
  rdoMode: "4x10",
  rdoConstraint: "0",
  rdoHard: [3],
  segments: [{ start: "05:00", end: "10:00" }, { start: "12:00", end: "16:30" }]
}, 0);
assert.strictEqual(norm.rdoMode, "4x10");
assert.strictEqual(norm.rdoConstraint, 0);
assert.deepStrictEqual(norm.rdoHard, [3]);
assert.strictEqual(norm.segments.length, 2);
assert.strictEqual(norm.segments[0].start, "05:00");
var round = S.normalizeShift(norm, 0);
assert.strictEqual(round.rdoMode, "4x10");
assert.strictEqual(round.rdoConstraint, 0);

// Generate path: buildLines on a 4×10 shift pinned to Friday.
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
    rdoConstraint: 5
  }]
};
var lines = buildLines(S, { S10: 6 });
assert.strictEqual(lines.length, 6, "built 6 lines");
var builtKeys = {};
var builtLoose = 0;
lines.forEach(function (line) {
  assert.strictEqual(line.rdoDays.length, 3, line.lineCode);
  assertPinnedPair(line.rdoDays, 5);
  var pin = hardDaysMatchingMode(S.state.shifts[0]);
  pin.forEach(function (d) { assert.ok(line.rdoDays.indexOf(d) >= 0, "hard pin missing on " + line.lineCode); });
  builtKeys[keyOf(line.rdoDays)] = true;
  if (!isThreeRun(line.rdoDays)) builtLoose++;
});
assert.ok(Object.keys(builtKeys).length >= 2, "buildLines varies the flex day");
assert.ok(builtLoose > 0, "buildLines does not force three consecutive RDOs");

S.state.startDate = "2026-10-04";
S.state.weekCount = 1;
lines.forEach(function (line) {
  var sched = buildScheduleForLine(S, line, 7);
  assert.strictEqual(sched[5], "RDO", "schedule Friday is RDO for " + line.lineCode);
  line.rdoDays.forEach(function (d) {
    assert.strictEqual(sched[d], "RDO", "schedule respects rdo day " + d);
  });
});

// classGenerate on a 5×8 shift pinned to Sunday.
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
    rdoHard: [3],
    rdoMode: "5x8",
    rdoConstraint: 0
  }]
};
generateClass(S5, "TSO", { S8: { M: 3, F: 3 } });
var classLines = (S5.state.lines || []).filter(function (l) { return l.shiftId === "S8" && !l.isShortfall; });
assert.ok(classLines.length >= 4, "class generate placed lines");
var classSides = {};
classLines.forEach(function (line) {
  assert.strictEqual(line.rdoDays.length, 2);
  assert.ok(line.rdoDays.indexOf(0) >= 0, "Sunday pin missing");
  var other = line.rdoDays.filter(function (d) { return d !== 0; })[0];
  assert.ok(other === 6 || other === 1, "class second RDO " + other + " is not adjacent to Sunday");
  var sched = S5.state.schedule[line.id];
  assert.ok(sched, "schedule built");
  assert.strictEqual(sched[0], "RDO");
  for (var dow = 0; dow < 7; dow++) {
    if (sched[dow] === "RDO") assert.ok(dow === 0 || dow === 1 || dow === 6, "scheduled RDO " + dow);
  }
  classSides[other] = true;
});
assert.ok(classSides[6] && classSides[1], "class generate rotates both adjacent days");

console.log("ALL CONSTRAINT-DAY RDO MODE TESTS PASSED");
