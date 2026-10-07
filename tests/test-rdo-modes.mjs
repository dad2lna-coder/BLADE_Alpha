import assert from "node:assert";
import { attachShiftMath, assignRdoDays, consecutiveRdos } from "../modules/setup-panel/utils/shiftMath.js";
import { lockedRdoNotes, placedRdosOk, assignBlockRdos } from "../modules/setup-panel/utils/rdoBlock.js";
import { buildLines, buildSupervisoryLines } from "../modules/setup-panel/utils/buildLines.js";
import { buildScheduleForLine } from "../modules/setup-panel/actions/generate.js";
import { attachGenerate } from "../modules/setup-panel/actions/generate.js";
import { generateClass } from "../modules/setup-panel/utils/classGenerate.js";
import { attachShiftsTable } from "../modules/setup-panel/actions/shiftsTable.js";
import { rdoConstraintHtml } from "../modules/setup-panel/actions/rdoConstraintUi.js";

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

function weekendOnly(days) {
  return days.length > 0 && days.every(function (d) { return d === 0 || d === 5 || d === 6; });
}

function containingBlock(days, pin, length) {
  for (var start = 0; start < 7; start++) {
    var block = [];
    for (var i = 0; i < length; i++) block.push((start + i) % 7);
    if (block.indexOf(pin) < 0) continue;
    if (block.every(function (d) { return days.indexOf(d) >= 0; })) return block;
  }
  return null;
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
  for (var pinSeed = 0; pinSeed < 14; pinSeed++) {
    var pinPlaced = assignRdoDays(S, { rdoBlock: 2, rdoPins: [pin], rdoHard: [0, 6] }, 3, pinSeed);
    assert.strictEqual(pinPlaced.ok, true);
    assert.ok(pinPlaced.block.indexOf(pin) < 0, "4x10 pair swallowed pin " + pin);
    assert.ok(pinPlaced.rdoDays.indexOf(pin) >= 0, "days include pin " + pin);
    assert.strictEqual(pinPlaced.block.length, 2);
    assert.ok(isConsecutiveBlock(pinPlaced.block));
    assert.deepStrictEqual(pinPlaced.flex, []);
    assert.strictEqual(pinPlaced.rdoDays.length, 3);
    pinKeys[keyOf(pinPlaced.block)] = true;
  }
  assert.ok(Object.keys(pinKeys).length >= 2, "pin " + pin + " rotates");
}

var tueFriSat = assignRdoDays(S, { rdoBlock: 2, rdoPins: [2] }, 3, 3);
assert.deepStrictEqual(tueFriSat.block, [5, 6], "Tue pin seed lands on Fri-Sat");
assert.deepStrictEqual(tueFriSat.rdoDays, [2, 5, 6]);
assert.ok(tueFriSat.block.indexOf(1) < 0 && tueFriSat.rdoDays.indexOf(1) < 0, "Tuesday pin does not force Monday off");

var missed = assignRdoDays(S, { rdoBlock: 2, rdoPinRequired: true, rdoPins: [], rdoHard: [1, 2] }, 2, 4);
assert.strictEqual(missed.ok, false);
assert.strictEqual(placedRdosOk(missed), false);
assert.deepStrictEqual(missed.rdoDays, []);
assert.ok(String(missed.error).indexOf("no day") >= 0);

var tight = assignRdoDays(S, { rdoBlock: 2, rdoPins: [0, 3] }, 2, 1);
assert.strictEqual(tight.ok, false);
assert.deepStrictEqual(tight.rdoDays, []);
assert.ok(String(tight.error).indexOf("do not fit") >= 0);

var fits = assignRdoDays(S, { rdoBlock: 4, rdoPins: [0, 3] }, 4, 1);
assert.strictEqual(fits.ok, true);
assert.deepStrictEqual(fits.block, [0, 1, 2, 3]);
assert.ok(fits.block.indexOf(0) >= 0 && fits.block.indexOf(3) >= 0);

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

var html = rdoConstraintHtml(S, { id: "S1", rdoBlock: 2, rdoPins: [2] });
["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach(function (lab) {
  assert.ok(html.indexOf(">" + lab + "<") >= 0, "label " + lab);
});
assert.ok(html.indexOf(">S<") < 0 && html.indexOf(">T<") < 0, "single-letter S/T collision");
assert.ok(html.indexOf("always off") >= 0);
assert.ok(html.indexOf("does not have to") >= 0);
assert.ok(html.indexOf("must include") < 0);
assert.strictEqual((html.match(/class="rdo-row/g) || []).length, 1);
assert.ok(html.indexOf('data-pin="2" checked') >= 0);

function patternLines(paid, block, pin, heads) {
  var host = stub();
  host.state = {
    ftM: heads, ftF: 0, ptM: 0, ptF: 0, issues: [],
    startDate: "2026-10-04", weekCount: 1,
    shifts: [{
      id: "S1", name: paid >= 10 ? "4x10" : "5x8",
      start: "06:00", end: paid >= 10 ? "16:30" : "14:30",
      paid: paid, force: 0,
      rdoBlock: block, rdoPins: [pin], rdoPinRequired: true, rdoHard: [5, 6]
    }]
  };
  var lines = buildLines(host, { S1: heads });
  assert.strictEqual(lines.length, heads, paid + " block " + block);
  var rdoCount = paid >= 10 ? 3 : 2;
  var keys = {};
  lines.forEach(function (line) {
    assert.ok(placedRdosOk({ rdoDays: line.rdoDays, ok: true }), "empty rdoDays");
    assert.notDeepStrictEqual(line.rdoDays, []);
    assert.ok(line.rdoDays.indexOf(pin) >= 0, line.lineCode);
    assert.strictEqual(line.rdoDays.length, block + Math.max(0, rdoCount - block));
    var rest = line.rdoDays.filter(function (d) { return d !== pin; });
    var outside = rest.length === block && isConsecutiveBlock(rest);
    var win = outside ? rest.slice().sort(function (a, b) { return a - b; }) : containingBlock(line.rdoDays, pin, block);
    assert.ok(win, "block missing in " + line.rdoDays);
    assert.ok(isConsecutiveBlock(win));
    if (!outside && pin >= 1 && pin <= 4) {
      assert.strictEqual(weekendOnly(win), false, "weekend home " + win);
      assert.notStrictEqual(keyOf(win), "5-6");
      assert.notStrictEqual(keyOf(win), "0-6");
    }
    keys[keyOf(win)] = true;
    assert.strictEqual(buildScheduleForLine(host, line, 7)[pin], "RDO");
  });
  return keys;
}

var tue = 2;
var tueBlock2by8 = patternLines(8, 2, tue, 8);
assert.ok(tueBlock2by8["1-2"], "5x8 block 2 missing Mon-Tue");
assert.ok(tueBlock2by8["2-3"], "5x8 block 2 missing Tue-Wed");
var tueBlock3by8 = patternLines(8, 3, tue, 8);
assert.ok(tueBlock3by8["0-1-2"] && tueBlock3by8["1-2-3"] && tueBlock3by8["2-3-4"], "5x8 block 3 " + Object.keys(tueBlock3by8));
var tueBlock2by10 = patternLines(10, 2, tue, 8);
assert.ok(tueBlock2by10["5-6"], "4x10 Tue pin can be Fri-Sat " + Object.keys(tueBlock2by10));
assert.ok(!tueBlock2by10["1-2"] && !tueBlock2by10["2-3"], "4x10 does not glue Monday or Wednesday to Tuesday");
var tueBlock3by10 = patternLines(10, 3, tue, 8);
assert.ok(tueBlock3by10["0-1-2"] && tueBlock3by10["1-2-3"] && tueBlock3by10["2-3-4"], "4x10 block 3 " + Object.keys(tueBlock3by10));

var bad = stub();
bad.state = {
  ftM: 2, ftF: 0, ptM: 0, ptF: 0, issues: [],
  shifts: [{
    id: "S1", name: "5x8", start: "08:00", end: "16:30", paid: 8, force: 0,
    rdoBlock: 2, rdoPins: [1, 4]
  }]
};
var badLines = buildLines(bad, { S1: 2 });
assert.strictEqual(badLines.length, 0);
assert.ok(badLines.every(function (line) { return line.rdoDays && line.rdoDays.length; }));
assert.ok(bad.state.issues.some(function (msg) { return msg.indexOf("do not fit") >= 0; }));

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
  assert.strictEqual(line.rdoDays.length, 3);
  var rest = line.rdoDays.filter(function (d) { return d !== 5; });
  assert.ok(isConsecutiveBlock(rest), line.rdoDays.join("-"));
  built[keyOf(rest)] = true;
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
var staleRest = stale.rdoDays.filter(function (d) { return d !== 5; });
assert.ok(isConsecutiveBlock(staleRest), stale.rdoDays.join("-"));
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
  assert.ok(line.rdoDays && line.rdoDays.length);
  assert.ok(line.rdoDays.indexOf(0) >= 0);
  assert.strictEqual(line.rdoDays.length, 2);
  assert.ok(isConsecutiveBlock(line.rdoDays), "class " + line.rdoDays);
  assert.ok(containingBlock(line.rdoDays, 0, 2));
  assert.strictEqual(S5.state.schedule[line.id][0], "RDO");
});

var R = stub();
attachGenerate(R);
attachShiftsTable(R);
R.state = {
  activeSeed: 3,
  weekCount: 1,
  startDate: "2026-10-04",
  issues: [],
  lines: [{
    id: 1,
    lineCode: "Line 001",
    shiftId: "S1",
    shiftName: "5x8",
    empClass: "FT",
    sex: "M",
    paid: 8,
    rdoDays: [5, 6]
  }],
  schedule: { 1: ["WORK", "WORK", "WORK", "WORK", "WORK", "RDO", "RDO"] },
  shifts: [{
    id: "S1", name: "5x8", paid: 8, rdoBlock: 2, rdoPins: [2], rdoPinRequired: true
  }]
};
R.respinSelectedSlices(["5x8 · FT TSO · M"], { keepSeed: true, nonce: 1 });
var spun = R.state.lines[0];
assert.ok(spun.rdoDays && spun.rdoDays.length, "respin left rdoDays empty");
assert.notDeepStrictEqual(spun.rdoDays.slice().sort(function (a, b) { return a - b; }), [5, 6]);
assert.ok(spun.rdoDays.indexOf(2) >= 0);
var spunBlock = containingBlock(spun.rdoDays, 2, 2);
assert.ok(spunBlock);
assert.strictEqual(weekendOnly(spunBlock), false);
assert.ok(keyOf(spunBlock) === "1-2" || keyOf(spunBlock) === "2-3", spunBlock.join("-"));
assert.strictEqual(R.state.schedule[1][2], "RDO");

var keptDays = spun.rdoDays.slice();
R.state.shifts[0].rdoPins = [1, 4];
R.respinSelectedSlices(["5x8 · FT TSO · M"], { keepSeed: true, nonce: 2 });
assert.deepStrictEqual(R.state.lines[0].rdoDays, keptDays);
assert.notDeepStrictEqual(R.state.lines[0].rdoDays, []);

function sharedDays(lines) {
  var acc = lines[0].rdoDays.slice();
  for (var i = 1; i < lines.length; i++) {
    acc = acc.filter(function (d) { return lines[i].rdoDays.indexOf(Number(d)) >= 0; });
  }
  return acc.map(Number).sort(function (a, b) { return a - b; });
}

function supHost(shifts, counts) {
  return {
    state: {
      stsoM: counts.stsoM || 0,
      stsoF: counts.stsoF || 0,
      ltsoM: counts.ltsoM || 0,
      ltsoF: counts.ltsoF || 0,
      issues: [],
      activeSeed: counts.activeSeed,
      shifts: shifts,
      shiftCrewGroups: counts.groups || []
    },
    shiftLabel: function (s) { return s.name; },
    DAYS: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  };
}

function pinShift(id, paid, pin, force) {
  return {
    id: id,
    name: id,
    start: "06:00",
    end: paid >= 10 ? "16:30" : "14:30",
    paid: paid,
    stsoForce: force,
    ltsoForce: force,
    rdoBlock: 2,
    rdoPins: [pin],
    rdoPinRequired: true
  };
}

function assertStsoPinPair(lines, pin, rdoLen) {
  assert.strictEqual(lines.length, 2);
  lines.forEach(function (line) {
    assert.strictEqual(line.empClass, "STSO");
    assert.ok(line.rdoDays.indexOf(pin) >= 0, line.lineCode + " missing pin");
    assert.strictEqual(line.rdoDays.length, rdoLen);
    if (rdoLen === 2) {
      var win = containingBlock(line.rdoDays, pin, 2);
      assert.ok(win, "block missing " + line.rdoDays);
      assert.ok(isConsecutiveBlock(win));
      assert.strictEqual(weekendOnly(win), false);
    } else {
      var rest = line.rdoDays.filter(function (d) { return d !== pin; });
      assert.ok(isConsecutiveBlock(rest), "4x10 pair " + rest);
    }
  });
  assert.deepStrictEqual(sharedDays(lines), [pin]);
}

assert.deepStrictEqual(assignBlockRdos({ rdoBlock: 2, rdoPins: [2] }, 2, 0).block, [1, 2]);
assert.deepStrictEqual(assignBlockRdos({ rdoBlock: 2, rdoPins: [2] }, 2, 1).block, [2, 3]);
assert.deepStrictEqual(assignBlockRdos({ rdoBlock: 2, rdoPins: [2] }, 3, 3).rdoDays, [2, 5, 6]);
assert.deepStrictEqual(assignBlockRdos({ rdoBlock: 2, rdoPins: [2] }, 3, 3).flex, []);

var seededSame = assignBlockRdos({ rdoBlock: 2, rdoPins: [2] }, 2, 0, { avoidDays: [] });
assert.deepStrictEqual(seededSame.rdoDays, [1, 2]);
var seededOther = assignBlockRdos({ rdoBlock: 2, rdoPins: [2] }, 2, 0, { avoidDays: seededSame.rdoDays });
assert.deepStrictEqual(seededOther.rdoDays, [2, 3]);
var seededNone = assignBlockRdos({ rdoBlock: 2, rdoPins: [2] }, 2, 4, { avoidDays: [1, 2, 3] });
assert.strictEqual(seededNone.ok, false);
assert.ok(String(seededNone.error).indexOf("non-pin") >= 0);

var flexA = assignBlockRdos({ rdoBlock: 2, rdoPins: [2] }, 3, 3, { avoidDays: [] });
assert.deepStrictEqual(flexA.rdoDays, [2, 5, 6]);
var flexB = assignBlockRdos({ rdoBlock: 2, rdoPins: [2] }, 3, 3, { avoidDays: flexA.rdoDays });
assert.strictEqual(flexB.ok, true);
assert.ok(flexB.rdoDays.indexOf(5) < 0 && flexB.rdoDays.indexOf(6) < 0);
assert.deepStrictEqual(
  flexA.rdoDays.filter(function (d) { return flexB.rdoDays.indexOf(d) >= 0; }).sort(),
  [2]
);

var thuA = assignBlockRdos({ rdoBlock: 2, rdoPins: [4] }, 2, 0, { avoidDays: [] });
var thuB = assignBlockRdos({ rdoBlock: 2, rdoPins: [4] }, 2, 0, { avoidDays: thuA.rdoDays });
assert.deepStrictEqual(thuA.block, [3, 4]);
assert.deepStrictEqual(thuB.block, [4, 5]);

function placePair(paid, pin, how) {
  var force = how === "one" ? 2 : 1;
  var shifts = how === "one"
    ? [pinShift("S1", paid, pin, force)]
    : [pinShift("S1", paid, pin, force), pinShift("S2", paid, pin, force)];
  if (how === "band") {
    shifts[0].crewGroupId = "cg";
    shifts[1].crewGroupId = "cg";
  }
  var counts = how === "one" ? { S1: 2 } : { S1: 1, S2: 1 };
  var host = supHost(shifts, { stsoM: 1, stsoF: 1 });
  return { host: host, lines: buildSupervisoryLines(host, counts, "STSO") };
}

["one", "split", "band"].forEach(function (how) {
  var pair8 = placePair(8, 2, how);
  assertStsoPinPair(pair8.lines, 2, 2);
  assert.strictEqual(pair8.host.state.issues.length, 0, how + " 5x8 issues");
  var pair10 = placePair(10, 2, how);
  assertStsoPinPair(pair10.lines, 2, 3);
  assert.strictEqual(pair10.host.state.issues.length, 0, how + " 4x10 issues " + pair10.host.state.issues);
});

var thuLines = placePair(8, 4, "split").lines;
assertStsoPinPair(thuLines, 4, 2);

var seenWindows = {};
for (var sweep = 0; sweep < 24; sweep++) {
  var shifts = [pinShift("S1", 10, 2, 2)];
  var host = supHost(shifts, { stsoM: 2, stsoF: 0, activeSeed: sweep });
  var swept = buildSupervisoryLines(host, { S1: 2 }, "STSO");
  assertStsoPinPair(swept, 2, 3);
  swept.forEach(function (line) {
    var rest = line.rdoDays.filter(function (d) { return d !== 2; });
    seenWindows[keyOf(rest)] = true;
  });
}
assert.ok(seenWindows["5-6"], "seeds did not reach Fri-Sat " + Object.keys(seenWindows));
assert.ok(Object.keys(seenWindows).length >= 2);

var crowdShifts = [pinShift("S1", 8, 2, 3)];
var crowd = supHost(crowdShifts, { stsoM: 2, stsoF: 1 });
var crowdLines = buildSupervisoryLines(crowd, { S1: 3 }, "STSO");
assert.strictEqual(crowdLines.length, 2);
assert.deepStrictEqual(sharedDays(crowdLines), [2]);
assert.ok(crowd.state.issues.some(function (msg) { return msg.indexOf("non-pin") >= 0; }));
assert.ok(crowdLines.every(function (line) { return line.rdoDays.length === 2; }));

var ltsoHost = supHost(
  [pinShift("S1", 8, 2, 1), pinShift("S2", 8, 2, 1)],
  { ltsoM: 2 }
);
var ltsoLines = buildSupervisoryLines(ltsoHost, { S1: 1, S2: 1 }, "LTSO");
assert.strictEqual(ltsoLines.length, 2);
assert.ok(!ltsoHost.state.issues.some(function (msg) { return msg.indexOf("non-pin") >= 0; }));
var ltsoPairs = ltsoLines.map(function (line) {
  return line.rdoDays.filter(function (d) { return d !== 2; }).slice().sort(function (a, b) { return a - b; }).join("-");
});
assert.notStrictEqual(ltsoPairs[0], ltsoPairs[1], "LTSO recycled one pair " + ltsoPairs);

function nonPinPair(line, pin) {
  return line.rdoDays.filter(function (d) { return d !== pin; }).slice().sort(function (a, b) { return a - b; }).join("-");
}

var femShift = [pinShift("S1", 10, 2, 1)];
var femStsoHost = supHost(femShift, { stsoF: 1 });
var femStso = buildSupervisoryLines(femStsoHost, { S1: 1 }, "STSO");
var femLtsoHost = supHost(femShift, { ltsoF: 1 });
var femLtso = buildSupervisoryLines(femLtsoHost, { S1: 1 }, "LTSO", { partners: femStso });
assert.strictEqual(femStso.length, 1);
assert.strictEqual(femLtso.length, 1);
var femaleOn = [0, 0, 0, 0, 0, 0, 0];
femStso.concat(femLtso).forEach(function (line) {
  assert.strictEqual(line.sex, "F");
  var off = {};
  line.rdoDays.forEach(function (d) { off[d] = true; });
  for (var d = 0; d < 7; d++) if (!off[d]) femaleOn[d]++;
});
for (var day = 0; day < 7; day++) {
  if (day === 2) continue;
  assert.ok(femaleOn[day] >= 1, "non-pin day " + day + " has no female lead " + femaleOn);
}
assert.notStrictEqual(nonPinPair(femStso[0], 2), nonPinPair(femLtso[0], 2));

var clumpHost = supHost([pinShift("S1", 10, 2, 4)], { ltsoM: 4 });
var clumpLines = buildSupervisoryLines(clumpHost, { S1: 4 }, "LTSO");
var clumpKeys = {};
clumpLines.forEach(function (line) { clumpKeys[nonPinPair(line, 2)] = true; });
assert.ok(Object.keys(clumpKeys).length >= 4, "leadership pairs clumped " + Object.keys(clumpKeys));

console.log("ALL CONSTRAINT-DAY RDO MODE TESTS PASSED");
