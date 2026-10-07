import assert from "node:assert";
import { attachShiftMath, assignRdoDays, consecutiveRdos } from "../modules/setup-panel/utils/shiftMath.js";
import { lockedRdoNotes } from "../modules/setup-panel/utils/rdoBlock.js";
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

function isConsecutiveBlock(days) {
  var s = days.slice().sort(function (a, b) { return a - b; });
  if (s.length < 2) return false;
  var breaks = 0;
  for (var i = 0; i < s.length; i++) {
    var a = s[i];
    var b = s[(i + 1) % s.length];
    if ((b - a + 7) % 7 !== 1) breaks++;
  }
  return breaks === 1;
}

function keyOf(days) {
  return days.slice().sort(function (a, b) { return a - b; }).join("-");
}

var S = stub();

for (var seed = 0; seed < 7; seed++) {
  for (var count = 1; count <= 3; count++) {
    var soft = assignRdoDays(S, { rdoMode: "off", rdoHard: [] }, count, seed);
    assert.deepStrictEqual(soft.rdoDays, consecutiveRdos(count, seed), "soft consecutive seed " + seed);
    assert.strictEqual(soft.mode, "off");
  }
}
var padded = assignRdoDays(S, { rdoHard: [3] }, 2, 5);
assert.deepStrictEqual(padded.rdoDays, [3, 0], "hard Wednesday still pads Sunday when no block is set");
var kept = assignRdoDays(S, { rdoHard: [2, 3, 6] }, 2, 0);
assert.deepStrictEqual(kept.rdoDays, [2, 3, 6], "extra hard days are kept");

[2, 3, 4].forEach(function (block) {
  var keys = {};
  for (var s = 0; s < 7; s++) {
    var placed = assignRdoDays(S, { rdoBlock: block, rdoPins: [] }, block, s);
    assert.strictEqual(placed.ok, true);
    assert.strictEqual(placed.rdoDays.length, block, "block " + block);
    assert.ok(isConsecutiveBlock(placed.block), "block " + block + " " + placed.block);
    assert.deepStrictEqual(placed.flex, []);
    keys[keyOf(placed.block)] = true;
  }
  assert.strictEqual(Object.keys(keys).length, 7, "block " + block + " rotates");
});

var flexHist = [0, 0, 0, 0, 0, 0, 0];
for (var flexSeed = 0; flexSeed < 70; flexSeed++) {
  var flexPlaced = assignRdoDays(S, { rdoBlock: 2, rdoPins: [] }, 3, flexSeed);
  assert.strictEqual(flexPlaced.flex.length, 1);
  flexHist[flexPlaced.flex[0]]++;
}
assert.ok(Math.max.apply(null, flexHist) - Math.min.apply(null, flexHist) <= 1, "flex " + flexHist.join(","));
assert.ok(flexHist[1] <= flexHist[4], "Monday is not heavier than Thursday");

for (var pin = 0; pin < 7; pin++) {
  var pinKeys = {};
  for (var pinSeed = 0; pinSeed < 10; pinSeed++) {
    var pinPlaced = assignRdoDays(S, { rdoBlock: 2, rdoPins: [pin], rdoHard: [0, 6] }, 3, pinSeed);
    assert.ok(pinPlaced.rdoDays.indexOf(pin) >= 0, "missing pin " + pin);
    assert.ok(pinPlaced.block.indexOf(pin) < 0, "block stole pin " + pin);
    assert.ok(isConsecutiveBlock(pinPlaced.block));
    pinKeys[keyOf(pinPlaced.block)] = true;
  }
  assert.ok(Object.keys(pinKeys).length >= 2, "pin " + pin + " rotates");
}

var missed = assignRdoDays(S, { rdoBlock: 2, rdoPinRequired: true, rdoPins: [], rdoHard: [1, 2] }, 2, 4);
assert.strictEqual(missed.ok, false);
assert.deepStrictEqual(missed.rdoDays, []);
assert.ok(String(missed.error).indexOf("no day") >= 0);

var tight = assignRdoDays(S, { rdoBlock: 4, rdoPins: [0, 3] }, 4, 1);
assert.strictEqual(tight.ok, false);
assert.ok(String(tight.error).indexOf("without using the pin") >= 0);

var plain = { rdoBlock: 3, rdoPins: [5], paid: 10 };
var split = {
  rdoBlock: 3,
  rdoPins: [5],
  paid: 10,
  segments: [{ start: "06:00", end: "10:00" }, { start: "13:00", end: "17:00" }]
};
assert.deepStrictEqual(assignRdoDays(S, plain, 4, 2).rdoDays, assignRdoDays(S, split, 4, 2).rdoDays);

var norm = S.normalizeShift({
  id: "SX", name: "Split", paid: 10,
  rdoBlock: "4", rdoPins: ["0"], rdoPinRequired: true, rdoHard: [3],
  segments: [{ start: "05:00", end: "10:00" }, { start: "12:00", end: "16:30" }]
}, 0);
assert.strictEqual(norm.rdoBlock, 4);
assert.deepStrictEqual(norm.rdoPins, [0]);
assert.strictEqual(norm.rdoPinRequired, true);
assert.deepStrictEqual(norm.rdoHard, [0]);
assert.strictEqual(norm.segments[0].start, "05:00");

S.state = {
  ftM: 4, ftF: 2, ptM: 0, ptF: 0, issues: [],
  shifts: [{
    id: "S10", name: "4x10", start: "06:00", end: "16:30", paid: 10, force: 0,
    rdoHard: [0, 6], rdoBlock: 2, rdoPins: [5], rdoPinRequired: true
  }]
};
var lines = buildLines(S, { S10: 6 });
assert.strictEqual(lines.length, 6);
var built = {};
lines.forEach(function (line) {
  assert.ok(line.rdoDays.indexOf(5) >= 0, line.lineCode);
  var others = line.rdoDays.filter(function (d) { return d !== 5; });
  assert.strictEqual(others.length, 2);
  assert.ok(isConsecutiveBlock(others), others.join("-"));
  built[keyOf(others)] = true;
});
assert.ok(Object.keys(built).length >= 2);
S.state.startDate = "2026-10-04";
S.state.weekCount = 1;
lines.forEach(function (line) {
  assert.strictEqual(buildScheduleForLine(S, line, 7)[5], "RDO");
});

var lockHost = stub();
lockHost.getShift = function () { return { id: "S10", rdoBlock: 2, rdoPins: [5] }; };
lockHost.rdoCountForShift = function () { return 3; };
var stale = { id: 8, lineCode: "Line 008", shiftId: "S10", empClass: "FT", rdoDays: [0, 1, 2] };
var fresh = { id: 9, lineCode: "Line 009", shiftId: "S10", empClass: "FT", rdoDays: [1, 2, 5] };
var notes = lockedRdoNotes(lockHost, [stale, fresh]);
assert.ok(stale.rdoDays.indexOf(5) >= 0);
assert.deepStrictEqual(fresh.rdoDays, [1, 2, 5]);
assert.ok(notes.some(function (n) { return n.indexOf("refreshed") >= 0; }));
assert.ok(notes.some(function (n) { return n.indexOf("kept") >= 0; }));

var S5 = stub();
S5.state = {
  open: "04:00", close: "22:00", weekCount: 1, startDate: "2026-10-04",
  ftM: 3, ftF: 3, ptM: 0, ptF: 0, lines: [], schedule: {}, functionRotation: {}, issues: [],
  shifts: [{
    id: "S8", name: "5x8", start: "08:00", end: "16:30", paid: 8, force: 0,
    rdoBlock: 2, rdoPins: [0], rdoPinRequired: true
  }]
};
generateClass(S5, "TSO", { S8: { M: 3, F: 3 } });
var classLines = (S5.state.lines || []).filter(function (l) { return l.shiftId === "S8" && !l.isShortfall; });
assert.ok(classLines.length >= 4);
classLines.forEach(function (line) {
  assert.ok(line.rdoDays.indexOf(0) >= 0);
  var others = line.rdoDays.filter(function (d) { return d !== 0; });
  assert.ok(isConsecutiveBlock(others), "class " + line.rdoDays);
  assert.strictEqual(S5.state.schedule[line.id][0], "RDO");
});

console.log("ALL CONSTRAINT-DAY RDO MODE TESTS PASSED");
