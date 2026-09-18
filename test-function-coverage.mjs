import assert from "node:assert/strict";
import { bindDutyApi, lineRoleKey, lineStartMin, isAmSide, computeShiftAnchors, lineCoversSlot, getRotationDuty, clearLineFunctions } from "./modules/function-coverage/lib/duty.js";
import { bindPoolsApi, ensureFunctionCoverage, capFunctionPoolsToFte, buildCertifiedPools } from "./modules/function-coverage/lib/pools.js";
import { bindShiftsApi, getEligibleLinesForShift, getShiftRequirement, getConfiguredFunctionShifts } from "./modules/function-coverage/lib/shifts.js";
import { bindAssignApi, generateFunctionAssignments, applyShiftFunctionRequirements } from "./modules/function-coverage/lib/assign.js";
import { bindCoverageCalcApi, countAssignedAtSlot } from "./modules/function-coverage/lib/coverage.js";
import { migrateFunctionCoverageConfig } from "./modules/function-coverage/lib/migrate.js";

function timeToMin(t) {
  var p = String(t || "0:0").split(":");
  return (+p[0] || 0) * 60 + (+p[1] || 0);
}

function workWeek(pattern) {
  var out = [];
  for (var i = 0; i < 7; i++) out.push(pattern[i] || "RDO");
  return out;
}

function makeApi(opts) {
  opts = opts || {};
  var shifts = opts.shifts || [
    { id: "S0400", name: "0400", start: "04:00", end: "12:30", paid: 8, rdoHard: [] },
    { id: "S0600", name: "0600", start: "06:00", end: "14:30", paid: 8, rdoHard: [] },
    { id: "S1300", name: "1300", start: "13:00", end: "21:30", paid: 8, rdoHard: [] }
  ];
  var api = {
    DAYS: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    timeToMin: timeToMin,
    slotLabel: function (m) {
      var h = Math.floor(m / 60), mm = m % 60;
      return String(h).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
    },
    getShift: function (id) { return shifts.find(function (s) { return s.id === id; }); },
    getEffectiveShiftTimes: function (id) {
      var s = api.getShift(id);
      return s ? { start: s.start, end: s.end, isOverride: false } : { start: "00:00", end: "00:00" };
    },
    $: function () { return null; },
    updateStatus: function () {},
    renderIssues: function () {},
    renderCoverageBars: function () {},
    renderReports: function () {},
    state: {
      open: "03:30",
      close: "23:00",
      weekCount: 1,
      ftM: 20, ftF: 20, ptM: 0, ptF: 0,
      ltsoM: 10, ltsoF: 10, stsoM: 10, stsoF: 10,
      shifts: shifts,
      lines: opts.lines || [],
      schedule: opts.schedule || {},
      issues: [],
      functionRotation: {},
      functionCoverage: Object.assign({
        poolStsoBagM: 0, poolStsoBagF: 0, poolLtsoBagM: 0, poolLtsoBagF: 0, poolTsoBagM: 0, poolTsoBagF: 0,
        poolStsoDfoM: 0, poolStsoDfoF: 0, poolLtsoDfoM: 0, poolLtsoDfoF: 0, poolTsoDfoM: 0, poolTsoDfoF: 0,
        amPmSplit: true, phaseThresholdMin: 15, bias: "none",
        requirements: { STSO: {}, LTSO: {}, TSO: {} },
        requirementShiftIds: []
      }, opts.fc || {})
    }
  };
  bindDutyApi(api);
  bindPoolsApi(api);
  bindShiftsApi(api);
  bindCoverageCalcApi(api);
  bindAssignApi(api);
  api.lineRoleKey = lineRoleKey;
  api.lineStartMin = lineStartMin;
  api.isAmSide = isAmSide;
  api.computeShiftAnchors = computeShiftAnchors;
  api.lineCoversSlot = lineCoversSlot;
  api.getRotationDuty = getRotationDuty;
  api.clearLineFunctions = clearLineFunctions;
  api.ensureFunctionCoverage = ensureFunctionCoverage;
  api.readFunctionBandsFromDom = function () { return api.state.functionCoverage; };
  return api;
}

function stsoLine(id, shiftId, sex) {
  return { id: id, lineCode: "L" + id, shiftId: shiftId, empClass: "STSO", isStso: true, sex: sex || "M", function: "", isExtra: false };
}

function tsoLine(id, shiftId, sex) {
  return { id: id, lineCode: "L" + id, shiftId: shiftId, empClass: "FT", isStso: false, isLtso: false, sex: sex || "M", function: "", isExtra: false };
}

function allWork(ids) {
  var s = {};
  ids.forEach(function (id) { s[id] = workWeek(["WORK","WORK","WORK","WORK","WORK","RDO","RDO"]); });
  return s;
}

function bagCount(api, role, shiftId) {
  return (api.state.lines || []).filter(function (l) {
    return lineRoleKey(l) === role && String(l.shiftId) === String(shiftId) && l.function === "BAG";
  }).length;
}

var passed = 0, failed = 0;
function check(name, fn) {
  try {
    fn();
    passed++;
    console.log("PASS", name);
  } catch (e) {
    failed++;
    console.log("FAIL", name, e && e.message ? e.message : e);
  }
}

check("Test 1: one shift min 2 max 3 assigns within limits", function () {
  var lines = [stsoLine(1,"S0400"), stsoLine(2,"S0400"), stsoLine(3,"S0400"), stsoLine(4,"S0400"), stsoLine(5,"S0400")];
  var api = makeApi({
    lines: lines,
    schedule: allWork([1,2,3,4,5]),
    fc: { requirements: { STSO: { S0400: { min: 2, max: 3 } }, LTSO: {}, TSO: {} }, requirementShiftIds: ["S0400"] }
  });
  var result = generateFunctionAssignments({ fromGenerate: true });
  var n = bagCount(api, "STSO", "S0400");
  assert.ok(n >= 2 && n <= 3, "assigned " + n);
  assert.equal(result.diagnostics[0].status, "OK");
  assert.equal(result.diagnostics[0].eligible, 5);
});

check("Test 2: multiple shifts evaluated independently", function () {
  var lines = [];
  var sched = {};
  function add(n, shift, startId) {
    for (var i = 0; i < n; i++) {
      var id = startId + i;
      lines.push(stsoLine(id, shift));
      sched[id] = workWeek(["WORK","WORK","WORK","WORK","WORK","RDO","RDO"]);
    }
  }
  add(5, "S0400", 1);
  add(4, "S0600", 10);
  add(6, "S1300", 20);
  var api = makeApi({
    lines: lines, schedule: sched,
    fc: { requirements: { STSO: {
      S0400: { min: 2, max: 3 },
      S0600: { min: 1, max: 2 },
      S1300: { min: 2, max: 3 }
    }, LTSO: {}, TSO: {} }, requirementShiftIds: ["S0400","S0600","S1300"] }
  });
  generateFunctionAssignments({ fromGenerate: true });
  var a = bagCount(api, "STSO", "S0400");
  var b = bagCount(api, "STSO", "S0600");
  var c = bagCount(api, "STSO", "S1300");
  assert.ok(a >= 2 && a <= 3, "0400 " + a);
  assert.ok(b >= 1 && b <= 2, "0600 " + b);
  assert.ok(c >= 2 && c <= 3, "1300 " + c);
});

check("Test 3: insufficient staffing reports shortfall, does not invent people", function () {
  var lines = [stsoLine(1,"S0400"), stsoLine(2,"S0400"), stsoLine(3,"S0400")];
  var api = makeApi({
    lines: lines, schedule: allWork([1,2,3]),
    fc: { requirements: { STSO: { S0400: { min: 5, max: 5 } }, LTSO: {}, TSO: {} }, requirementShiftIds: ["S0400"] }
  });
  var result = generateFunctionAssignments({ fromGenerate: true });
  assert.equal(bagCount(api, "STSO", "S0400"), 3);
  assert.equal(result.diagnostics[0].status, "SHORT");
  assert.equal(result.diagnostics[0].assigned, 3);
  assert.equal(result.diagnostics[0].eligible, 3);
  assert.ok(api.state.issues.some(function (m) { return /STSO .* 3 \/ 5/.test(m); }), api.state.issues.join("; "));
  assert.equal(api.state.lines.length, 3);
});

check("Test 4: max cap with ten eligible", function () {
  var lines = [];
  var sched = {};
  for (var i = 1; i <= 10; i++) { lines.push(stsoLine(i, "S0400")); sched[i] = workWeek(["WORK","WORK","WORK","WORK","WORK","RDO","RDO"]); }
  var api = makeApi({
    lines: lines, schedule: sched,
    fc: { requirements: { STSO: { S0400: { min: 2, max: 3 } }, LTSO: {}, TSO: {} }, requirementShiftIds: ["S0400"] }
  });
  generateFunctionAssignments({ fromGenerate: true });
  var n = bagCount(api, "STSO", "S0400");
  assert.ok(n <= 3, "assigned " + n);
  assert.ok(n >= 2, "assigned " + n);
});

check("Test 5: coverage follows 04:00-12:30 assignment", function () {
  var lines = [stsoLine(1,"S0400"), stsoLine(2,"S0400")];
  var api = makeApi({
    lines: lines, schedule: allWork([1,2]),
    fc: { requirements: { STSO: { S0400: { min: 2, max: 2 } }, LTSO: {}, TSO: {} }, requirementShiftIds: ["S0400"] }
  });
  generateFunctionAssignments({ fromGenerate: true });
  assert.equal(countAssignedAtSlot(0, timeToMin("04:00"), { role: "STSO", duty: "BAG" }), 2);
  assert.equal(countAssignedAtSlot(0, timeToMin("12:00"), { role: "STSO", duty: "BAG" }), 2);
  assert.equal(countAssignedAtSlot(0, timeToMin("12:30"), { role: "STSO", duty: "BAG" }), 0);
  assert.equal(countAssignedAtSlot(0, timeToMin("03:30"), { role: "STSO", duty: "BAG" }), 0);
});

check("Test 6: different shift lengths", function () {
  var shifts = [
    { id: "S0400", name: "0400", start: "04:00", end: "12:30", paid: 8, rdoHard: [] },
    { id: "S10", name: "4x10", start: "10:30", end: "20:00", paid: 10, rdoHard: [] }
  ];
  var lines = [stsoLine(1,"S0400"), stsoLine(2,"S10")];
  var api = makeApi({
    shifts: shifts, lines: lines, schedule: allWork([1,2]),
    fc: { requirements: { STSO: { S0400: { min: 1, max: 1 }, S10: { min: 1, max: 1 } }, LTSO: {}, TSO: {} }, requirementShiftIds: ["S0400","S10"] }
  });
  generateFunctionAssignments({ fromGenerate: true });
  assert.equal(countAssignedAtSlot(0, timeToMin("11:00"), { role: "STSO", duty: "BAG" }), 2);
  assert.equal(countAssignedAtSlot(0, timeToMin("05:00"), { role: "STSO", duty: "BAG" }), 1);
  assert.equal(countAssignedAtSlot(0, timeToMin("16:00"), { role: "STSO", duty: "BAG" }), 1);
  assert.equal(countAssignedAtSlot(0, timeToMin("20:00"), { role: "STSO", duty: "BAG" }), 0);
});

check("Test 7: overnight shift crosses midnight", function () {
  var shifts = [{ id: "SNIGHT", name: "NIGHT", start: "22:00", end: "06:30", paid: 8, rdoHard: [] }];
  var lines = [stsoLine(1,"SNIGHT"), stsoLine(2,"SNIGHT")];
  var api = makeApi({
    shifts: shifts, lines: lines, schedule: allWork([1,2]),
    fc: { requirements: { STSO: { SNIGHT: { min: 2, max: 2 } }, LTSO: {}, TSO: {} }, requirementShiftIds: ["SNIGHT"] }
  });
  generateFunctionAssignments({ fromGenerate: true });
  assert.equal(countAssignedAtSlot(0, timeToMin("22:00"), { role: "STSO", duty: "BAG" }), 2);
  assert.equal(countAssignedAtSlot(0, timeToMin("00:00"), { role: "STSO", duty: "BAG" }), 2);
  assert.equal(countAssignedAtSlot(0, timeToMin("06:00"), { role: "STSO", duty: "BAG" }), 2);
  assert.equal(countAssignedAtSlot(0, timeToMin("06:30"), { role: "STSO", duty: "BAG" }), 0);
  assert.equal(countAssignedAtSlot(0, timeToMin("21:30"), { role: "STSO", duty: "BAG" }), 0);
});

check("Test 8: weekly WORK/RDO — no function duty on RDO", function () {
  var lines = [stsoLine(1,"S0400"), stsoLine(2,"S0400")];
  var api = makeApi({
    lines: lines,
    schedule: {
      1: workWeek(["WORK","RDO","WORK","WORK","WORK","RDO","RDO"]),
      2: workWeek(["WORK","WORK","WORK","WORK","WORK","RDO","RDO"])
    },
    fc: { requirements: { STSO: { S0400: { min: 2, max: 2 } }, LTSO: {}, TSO: {} }, requirementShiftIds: ["S0400"] }
  });
  generateFunctionAssignments({ fromGenerate: true });
  assert.equal(getRotationDuty(1, 0), "BAG");
  assert.equal(getRotationDuty(1, 1), null);
  assert.equal(countAssignedAtSlot(1, timeToMin("04:00"), { role: "STSO", duty: "BAG" }), 1);
  assert.equal(countAssignedAtSlot(0, timeToMin("04:00"), { role: "STSO", duty: "BAG" }), 2);
});

check("Test 9: sex-specific BAG pool still honored as preference", function () {
  var lines = [
    stsoLine(1,"S0400","M"), stsoLine(2,"S0400","M"),
    stsoLine(3,"S0400","F"), stsoLine(4,"S0400","F")
  ];
  var api = makeApi({
    lines: lines, schedule: allWork([1,2,3,4]),
    fc: {
      poolStsoBagM: 2, poolStsoBagF: 0,
      requirements: { STSO: { S0400: { min: 2, max: 2 } }, LTSO: {}, TSO: {} },
      requirementShiftIds: ["S0400"]
    }
  });
  generateFunctionAssignments({ fromGenerate: true });
  var bag = api.state.lines.filter(function (l) { return l.function === "BAG"; });
  assert.equal(bag.length, 2);
  assert.ok(bag.every(function (l) { return l.sex === "M"; }), "expected male BAG from pool");
});

check("Test 10: regeneration rebuilds, does not accumulate", function () {
  var lines = [stsoLine(1,"S0400"), stsoLine(2,"S0400"), stsoLine(3,"S0400")];
  var api = makeApi({
    lines: lines, schedule: allWork([1,2,3]),
    fc: { requirements: { STSO: { S0400: { min: 2, max: 2 } }, LTSO: {}, TSO: {} }, requirementShiftIds: ["S0400"] }
  });
  generateFunctionAssignments({ fromGenerate: true });
  generateFunctionAssignments({ fromGenerate: true });
  assert.equal(bagCount(api, "STSO", "S0400"), 2);
  var rot = api.state.functionRotation["1"] || api.state.functionRotation[1];
  assert.ok(rot);
  var bagDays = rot.filter(function (d) { return d === "BAG"; }).length;
  assert.equal(bagDays, 5);
});

check("leftover lines are PAX, extra positions ignored", function () {
  var lines = [
    stsoLine(1,"S0400"), stsoLine(2,"S0400"),
    { id: 99, lineCode: "MSTI 01", shiftId: "S0400", empClass: "MSTI", isExtra: true, extraPositionId: "extra-1", sex: "M", function: "" }
  ];
  var api = makeApi({
    lines: lines,
    schedule: allWork([1,2,99]),
    fc: { requirements: { STSO: { S0400: { min: 1, max: 1 } }, LTSO: {}, TSO: {} }, requirementShiftIds: ["S0400"] }
  });
  generateFunctionAssignments({ fromGenerate: true });
  assert.equal(getEligibleLinesForShift("STSO", "S0400").length, 2);
  var extra = api.state.lines.find(function (l) { return l.id === 99; });
  assert.equal(extra.function, "");
  var leftover = api.state.lines.find(function (l) { return l.function === "PAX"; });
  assert.ok(leftover, "expected leftover PAX");
});

check("DFO pool still tags DFO and does not convert everyone to BAG", function () {
  var lines = [];
  var sched = {};
  for (var i = 1; i <= 6; i++) { lines.push(stsoLine(i, "S0400")); sched[i] = workWeek(["WORK","WORK","WORK","WORK","WORK","RDO","RDO"]); }
  var api = makeApi({
    lines: lines, schedule: sched,
    fc: {
      poolStsoDfoM: 2,
      requirements: { STSO: { S0400: { min: 2, max: 2 } }, LTSO: {}, TSO: {} },
      requirementShiftIds: ["S0400"]
    }
  });
  generateFunctionAssignments({ fromGenerate: true });
  var bag = api.state.lines.filter(function (l) { return l.function === "BAG"; }).length;
  var dfo = api.state.lines.filter(function (l) { return l.function === "DFO"; }).length;
  var pax = api.state.lines.filter(function (l) { return l.function === "PAX"; }).length;
  assert.equal(bag, 2);
  assert.equal(dfo, 2);
  assert.equal(pax, 2);
});

check("migration: exact start/end maps; unmatched bands preserved", function () {
  var fc = {
    bands: [
      { start: "04:00", end: "12:30", stsoMin: 2, stsoMax: 3, ltsoMin: 0, ltsoMax: 0, tsoMin: 0, tsoMax: 0 },
      { start: "01:00", end: "02:00", stsoMin: 9, stsoMax: 9, ltsoMin: 0, ltsoMax: 0, tsoMin: 0, tsoMax: 0 }
    ]
  };
  var issues = [];
  var result = migrateFunctionCoverageConfig(fc, {
    shifts: [{ id: "S0400", name: "0400", start: "04:00", end: "12:30" }],
    issues: issues
  });
  assert.equal(result.mapped, 1);
  assert.equal(fc.requirements.STSO.S0400.min, 2);
  assert.equal(fc.requirements.STSO.S0400.max, 3);
  assert.equal(fc.bands.length, 1);
  assert.equal(fc.bands[0].start, "01:00");
  assert.ok(issues.length >= 1);
});

check("migration: ambiguous duplicate shifts not guessed", function () {
  var fc = { bands: [{ start: "04:00", end: "12:30", stsoMin: 2, stsoMax: 2 }] };
  var result = migrateFunctionCoverageConfig(fc, {
    shifts: [
      { id: "A", name: "A", start: "04:00", end: "12:30" },
      { id: "B", name: "B", start: "04:00", end: "12:30" }
    ],
    issues: []
  });
  assert.equal(result.mapped, 0);
  assert.ok(result.ambiguous.length);
  assert.ok(fc.bands && fc.bands.length === 1);
  assert.ok(!fc.requirements || !fc.requirements.STSO || !fc.requirements.STSO.A);
});

check("helpers: getShiftRequirement / getConfiguredFunctionShifts", function () {
  var api = makeApi({
    fc: { requirements: { STSO: { S0400: { min: 2, max: 3 } }, LTSO: {}, TSO: {} }, requirementShiftIds: ["S0400"] }
  });
  ensureFunctionCoverage();
  var req = getShiftRequirement("STSO", "S0400");
  assert.equal(req.min, 2);
  assert.equal(req.max, 3);
  var configured = getConfiguredFunctionShifts(api.state.functionCoverage);
  assert.equal(configured.length, 1);
  assert.equal(configured[0].id, "S0400");
});

console.log("\n" + passed + " passed, " + failed + " failed");
if (failed) process.exit(1);
console.log("ALL FUNCTION COVERAGE CHECKS PASSED");
