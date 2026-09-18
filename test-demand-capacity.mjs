import assert from "node:assert/strict";
import {
  parseDow,
  etdToMin,
  parseSeats,
  parsePctOrig,
  parseFlightRow,
  parseVolumeRows,
  headerMapFromRow,
  missingRequired
} from "./modules/demand-capacity/parse.js";
import {
  landMinFromEtd,
  bucketFlights,
  emptyDemandByDow
} from "./modules/demand-capacity/aggregate.js";
import {
  demandSlots,
  computeStaffCapacity,
  roleAllowed,
  PAX_PER_SLOT,
  PAX_PER_HOUR
} from "./modules/demand-capacity/staffing.js";

function slotsFrom(open, close) {
  var start = Math.floor(open / 30) * 30;
  var end = Math.ceil(close / 30) * 30;
  var out = [];
  for (var m = start; m < end; m += 30) out.push(m);
  return out;
}

function workWeek() {
  return ["WORK", "WORK", "WORK", "WORK", "WORK", "WORK", "WORK"];
}

function makeS(lines, opts) {
  opts = opts || {};
  var slots = opts.slots || slotsFrom(210, 1380);
  var schedule = {};
  var duties = opts.duties || {};
  lines.forEach(function (l) {
    schedule[l.id] = opts.schedule || workWeek();
  });
  return {
    coverageSlots: function () { return slots.slice(); },
    capacitySlots: function () { throw new Error("must prefer coverageSlots"); },
    computeLaneCapacityMatrix: function () { throw new Error("must not use lane matrix"); },
    computeCapacity: function () { throw new Error("must not use computeCapacity"); },
    computeHourlyByDow: function () { throw new Error("must not use computeHourlyByDow"); },
    lineRoleKey: function (line) {
      if (line.isStso) return "STSO";
      if (line.isLtso) return "LTSO";
      return "TSO";
    },
    getShift: function () { return { start: "03:30", end: "23:00" }; },
    getEffectiveShiftTimes: function () { return { start: "03:30", end: "23:00" }; },
    timeToMin: function (t) {
      var p = String(t).split(":");
      return (+p[0] || 0) * 60 + (+p[1] || 0);
    },
    lineCoversSlot: function (line, dayOff, slot) {
      var sched = this.state.schedule[line.id] || [];
      if (sched[dayOff] !== "WORK") return false;
      return slot >= 210 && slot < 1380;
    },
    getRotationDuty: function (id, dayOff) {
      if (Object.prototype.hasOwnProperty.call(duties, id)) return duties[id];
      return opts.defaultDuty === undefined ? "PAX" : opts.defaultDuty;
    },
    state: { lines: lines, schedule: schedule, weekCount: 1 }
  };
}

assert.equal(parseDow("Sunday"), 0);
assert.equal(parseDow("monday"), 1);
assert.equal(parseDow("Friday"), 5);
assert.equal(parseDow(0), 0);
assert.equal(parseDow("6"), 6);
assert.equal(parseDow("nope"), null);

assert.equal(etdToMin(1023), 623);
assert.equal(etdToMin("1023"), 623);
assert.equal(etdToMin("10:23"), 623);
assert.equal(etdToMin(1554), 15 * 60 + 54);
assert.equal(etdToMin(5), 5);
assert.equal(etdToMin(1060), null);

assert.equal(parseSeats(110), 110);
assert.equal(parsePctOrig(0.8), 0.8);

var headers = ["AIRPORT", "DAY_OF_WEEK", "ETD", "CAPACITY", "LOAD_FACTOR", "PERCENT_ORIGINATING"];
var map = headerMapFromRow(headers);
assert.deepEqual(missingRequired(map), []);
var flight = parseFlightRow(["DAL", "Friday", 1023, 110, 0.84, 0.8], map, 1);
assert.equal(flight.dow, 5);
assert.equal(flight.etdMin, 623);
assert.equal(flight.volume, 110 * 0.84 * 0.8);
assert.equal(parseFlightRow(["DAL", "Friday", 1023, 110, 84, 80], map, 1).volume, 110 * 0.84 * 0.8);

var parsed = parseVolumeRows([
  ["DAY_OF_WEEK", "ETD", "CAPACITY", "LOAD_FACTOR", "PERCENT_ORIGINATING"],
  ["Monday", 1023, 110, 0.84, 0.8],
  ["bad", "xx", "no", "no", "no"],
  ["Sunday", 400, 50, 1, 1]
], 1.5);
assert.equal(parsed.rowCount, 2);
assert.equal(parsed.skipped, 1);
assert.equal(parsed.flights[0].volume, 110 * 0.84 * 0.8 * 1.5);

assert.ok(missingRequired(headerMapFromRow(["FOO", "BAR"])).length >= 3);

assert.equal(landMinFromEtd(623), 503);
assert.equal(landMinFromEtd(60), 1380);

var slots = slotsFrom(210, 1380);
var Sslots = makeS([]);
assert.deepEqual(demandSlots(Sslots), slots);

var demand = bucketFlights([
  { dow: 5, etdMin: 623, seats: 110, loadFactor: 0.84, pctOrig: 0.8 },
  { dow: 1, etdMin: 240, seats: 100, loadFactor: 1, pctOrig: 1 }
], slots, 1);
var friIdx = slots.indexOf(Math.floor(503 / 30) * 30);
assert.ok(friIdx >= 0);
assert.equal(demand[5][friIdx], 110 * 0.84 * 0.8);
assert.equal(demand[1].reduce(function (a, b) { return a + b; }, 0), 0);

assert.equal(emptyDemandByDow(3)[0].length, 3);

assert.equal(PAX_PER_HOUR, 36);
assert.equal(PAX_PER_SLOT, 18);
assert.equal(roleAllowed("TSO", "tso"), true);
assert.equal(roleAllowed("LTSO", "tso"), false);
assert.equal(roleAllowed("LTSO", "tso-ltso"), true);
assert.equal(roleAllowed("STSO", "tso-ltso"), false);

var tso60 = [];
for (var i = 1; i <= 60; i++) tso60.push({ id: i, shiftId: "S1" });
var S60 = makeS(tso60);
var cap60 = computeStaffCapacity(S60, slots, "tso");
assert.equal(cap60.empty, false);
assert.equal(cap60.countsByDow[0][0], 60);
assert.equal(cap60.capacityByDow[0][0], 60 * 18);
assert.equal(cap60.capacityByDow[0][0], 1080);
assert.equal(cap60.capacityByDow[0][0] * 2, 2160);

var mixed = [
  { id: 1, shiftId: "S1" },
  { id: 2, shiftId: "S1" },
  { id: 3, shiftId: "S1" }
];
var Sbag = makeS(mixed, { duties: { 1: "PAX", 2: "BAG", 3: "DFO" } });
var capBag = computeStaffCapacity(Sbag, slots, "tso");
assert.equal(capBag.countsByDow[0][0], 1);
assert.equal(capBag.capacityByDow[0][0], 18);

var Sunset = makeS([{ id: 1, shiftId: "S1" }], { defaultDuty: null });
assert.equal(computeStaffCapacity(Sunset, slots, "tso").countsByDow[0][0], 1);

var roles = [
  { id: 1, shiftId: "S1" },
  { id: 2, shiftId: "S1", isLtso: true },
  { id: 3, shiftId: "S1", isStso: true }
];
var Sroles = makeS(roles);
var capTso = computeStaffCapacity(Sroles, slots, "tso");
var capBoth = computeStaffCapacity(Sroles, slots, "tso-ltso");
assert.equal(capTso.countsByDow[0][0], 1);
assert.equal(capBoth.countsByDow[0][0], 2);
assert.equal(capBoth.capacityByDow[0][0], 36);

var Srdo = makeS([{ id: 1, shiftId: "S1" }], {
  schedule: ["RDO", "WORK", "WORK", "WORK", "WORK", "WORK", "WORK"]
});
var capRdo = computeStaffCapacity(Srdo, slots, "tso");
assert.equal(capRdo.countsByDow[0][0], 0);
assert.equal(capRdo.countsByDow[1][0], 1);

console.log("test-demand-capacity: ok");
