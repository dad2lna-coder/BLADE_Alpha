import test from "node:test";
import assert from "node:assert/strict";

import { bridgeScheduler } from "../modules/setup-panel/actions/bridge.js";
import { initLineHelpers } from "../modules/shared/lines/helpers.js";
import { initFunctionCoverage } from "../modules/function-coverage/index.js";
import { defaultShifts } from "../modules/setup-panel/stores/setupStore.js";

function createMockScheduler() {
  const S = {
    $: () => null,
    state: {
      startDate: "2025-01-05",
      weekCount: 1,
      open: "03:30",
      close: "23:00",
      ftM: 4, ftF: 4,
      ptM: 0, ptF: 0,
      ptHoursPerDay: 4,
      ptDaysPerWeek: 5,
      stsoM: 2, stsoF: 2,
      ltsoM: 1, ltsoF: 1,
      esti: 0, msti: 0,
      extraPositions: [],
      shifts: [
        { id: "S1", name: "0330", start: "03:30", end: "12:00", paid: 8, stsoForce: 1, ltsoForce: 1, force: 2 },
        { id: "S2", name: "1200", start: "12:00", end: "20:30", paid: 8, stsoForce: 1, ltsoForce: 0, force: 2 }
      ],
      lines: [],
      schedule: {},
      functionRotation: {},
      issues: [],
      shiftCrewGroups: [],
      generateSeed: "1"
    },
    timeToMin: (t) => {
      const p = String(t || "00:00").split(":");
      return (+p[0] || 0) * 60 + (+p[1] || 0);
    },
    safeNumber: (value, fallback, min, max) => {
      let n = Number(value);
      if (!Number.isFinite(n)) n = fallback;
      if (typeof min === "number") n = Math.max(min, n);
      if (typeof max === "number") n = Math.min(max, n);
      return n;
    },
    isValidTimeText: (value) => typeof value === "string" && /^\d{2}:\d{2}$/.test(value),
    shiftLabel: (s) => (s.start || "") + "–" + (s.end || ""),
    rdoCountForShift: () => 2,
    targetWorkDays: () => 5,
    consecutiveRdos: (count, seed) => [seed % 7, (seed + 1) % 7],
    getShift: (id) => S.state.shifts.find((s) => s.id === id),
    lineRoleKey: (l) => l.isStso || l.empClass === "STSO" ? "STSO" : (l.isLtso || l.empClass === "LTSO" ? "LTSO" : "TSO"),
    lineStartMin: (l) => {
      const sh = S.getShift(l.shiftId);
      return sh ? S.timeToMin(sh.start) : 0;
    },
    isAmSide: (startMin) => startMin < 720,
    computeShiftAnchors: () => ({ amStart: 210, pmStart: 720 }),
    updateStatus: () => {}
  };

  bridgeScheduler(S);
  initLineHelpers(S);
  initFunctionCoverage(S);
  return S;
}

function makeSplit(id, name, force) {
  return {
    id: id,
    name: name,
    paid: 8,
    force: force,
    ltsoForce: 0,
    stsoForce: 0,
    rdoHard: [],
    start: "05:00",
    end: "17:00",
    segments: [
      { start: "05:00", end: "09:00" },
      { start: "13:00", end: "17:00" }
    ]
  };
}

test("addShift after a fresh load does not reuse an existing id when shiftSeq is 1", () => {
  const S = createMockScheduler();
  S.state.shifts = defaultShifts();
  S.shiftSeq = 1;
  const before = new Set(S.state.shifts.map((s) => s.id));
  assert.equal(before.size, 5);

  S.addShift();
  S.addShift();

  const ids = S.state.shifts.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  const added = ids.filter((id) => !before.has(id));
  assert.deepEqual(added, ["S6", "S7"]);
});

test("two split shifts with unique ids both receive lines", () => {
  const S = createMockScheduler();
  S.state.ftM = 2;
  S.state.ftF = 2;
  S.state.ptM = 0;
  S.state.ptF = 0;
  S.state.stsoM = 0;
  S.state.stsoF = 0;
  S.state.ltsoM = 0;
  S.state.ltsoF = 0;
  S.state.shifts = [
    makeSplit("S6", "Split A", 2),
    makeSplit("S7", "Split B", 2)
  ];
  S.state.lines = [];

  S.generate();

  const byId = {};
  S.state.lines.forEach((line) => {
    byId[line.shiftId] = (byId[line.shiftId] || 0) + 1;
    const shift = S.getShift(line.shiftId);
    assert.ok(shift, "line shift exists");
    assert.equal(shift.name, line.shiftName);
  });
  assert.ok(byId.S6 > 0, "first split has lines");
  assert.ok(byId.S7 > 0, "second split has lines");
});

test("per-shift targets stay separate and generateClass gives both splits lines", () => {
  const S = createMockScheduler();
  S.state.ftM = 4;
  S.state.ftF = 2;
  S.state.ptM = 0;
  S.state.ptF = 0;
  S.state.stsoM = 0;
  S.state.stsoF = 0;
  S.state.ltsoM = 0;
  S.state.ltsoF = 0;
  S.state.shifts = [
    makeSplit("S6", "Split A", 2),
    makeSplit("S7", "Split B", 2)
  ];
  S.state.lines = [];
  S._perShiftTargets = null;

  const targets = S.initPerShiftTargetsForClass("TSO");
  assert.notEqual(targets.S6, targets.S7);
  const otherM = targets.S7.M;
  targets.S6.M += 1;
  assert.equal(targets.S7.M, otherM);
  assert.ok(targets.S6.M > 0 && targets.S7.M > 0);

  S.generateClass("TSO", targets);

  const byId = {};
  S.state.lines.forEach((line) => {
    if (!S.belongsToClass(line, "TSO")) return;
    byId[line.shiftId] = (byId[line.shiftId] || 0) + 1;
  });
  assert.ok(byId.S6 > 0, "generateClass gave the first split lines");
  assert.ok(byId.S7 > 0, "generateClass gave the second split lines");
});

test("duplicate ids from normalizeShift are repaired without sharing objects", () => {
  const S = createMockScheduler();
  const sharedSegments = [
    { start: "06:00", end: "10:00" },
    { start: "14:00", end: "18:00" }
  ];
  const sharedDayTimes = { "2": { start: "06:30", end: "10:30" } };
  const sharedHard = [0, 6];
  const sharedPins = [0];
  const raw = {
    id: "S9",
    segments: sharedSegments,
    dayTimes: sharedDayTimes,
    rdoHard: sharedHard,
    rdoPins: sharedPins,
    force: 1,
    paid: 8,
    crewGroupId: "CG1"
  };

  const first = S.normalizeShift(Object.assign({}, raw, { name: "Split A" }), 0);
  const second = S.normalizeShift(Object.assign({}, raw, { name: "Split B" }), 1);
  first.segments = second.segments;
  first.dayTimes = second.dayTimes;
  first.rdoHard = second.rdoHard;
  first.rdoPins = second.rdoPins;

  S.state.shifts = [first, second];
  S.state.shiftCrewGroups = [{ id: "CG1", name: "Crew", shiftIds: ["S9"] }];
  S.state.lines = [{ id: 1, shiftId: "S9", shiftName: "Split A" }];
  S.state.issues = [];

  S.ensureUniqueShiftIds();

  assert.equal(S.state.shifts[0].id, "S9");
  assert.notEqual(S.state.shifts[1].id, "S9");
  assert.equal(new Set(S.state.shifts.map((s) => s.id)).size, 2);
  assert.equal(S.state.lines[0].shiftId, "S9");

  S.state.shifts[1].segments[0].start = "07:00";
  S.state.shifts[1].dayTimes["2"].start = "07:15";
  S.state.shifts[1].rdoHard.push(3);
  S.state.shifts[1].rdoPins.push(5);

  assert.equal(S.state.shifts[0].segments[0].start, "06:00");
  assert.equal(S.state.shifts[0].dayTimes["2"].start, "06:30");
  assert.deepEqual(S.state.shifts[0].rdoHard, [0, 6]);
  assert.deepEqual(S.state.shifts[0].rdoPins, [0]);

  const groupIds = S.state.shiftCrewGroups[0].shiftIds;
  assert.ok(groupIds.indexOf(S.state.shifts[0].id) !== -1);
  assert.ok(groupIds.indexOf(S.state.shifts[1].id) !== -1);
  assert.equal(S.state.issues.length, 1);
  assert.match(S.state.issues[0], /regenerate/i);
});
