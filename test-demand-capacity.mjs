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
  emptyDemandByDow,
  demandSlots,
  alignAirportPax,
  pullProcessCapacity
} from "./modules/demand-capacity/aggregate.js";

function slotsFrom(open, close) {
  var start = Math.floor(open / 30) * 30;
  var end = Math.ceil(close / 30) * 30;
  var out = [];
  for (var m = start; m < end; m += 30) out.push(m);
  return out;
}

// --- parse ---
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

var headers = ["AIRPORT", "DAY_OF_WEEK", "ETD", "CAPACITY", "PERCENT_ORIGINATING"];
var map = headerMapFromRow(headers);
assert.deepEqual(missingRequired(map), []);
var flight = parseFlightRow(["DAL", "Friday", 1023, 110, 0.8], map, 1);
assert.equal(flight.dow, 5);
assert.equal(flight.etdMin, 623);
assert.equal(flight.volume, 110 * 0.8);

var parsed = parseVolumeRows([
  ["DAY_OF_WEEK", "ETD", "CAPACITY", "PERCENT_ORIGINATING"],
  ["Monday", 1023, 110, 0.8],
  ["bad", "xx", "no", "no"],
  ["Sunday", 400, 50, 1]
], 1.5);
assert.equal(parsed.rowCount, 2);
assert.equal(parsed.skipped, 1);
assert.equal(parsed.flights[0].volume, 110 * 0.8 * 1.5);

assert.ok(missingRequired(headerMapFromRow(["FOO", "BAR"])).length >= 3);

// --- aggregate ---
assert.equal(landMinFromEtd(623), 503);
assert.equal(landMinFromEtd(60), 1380); // 01:00 − 2h wraps to 23:00

var slots = slotsFrom(210, 1380); // 03:30–23:00
var S = {
  capacitySlots: function () { return slots.slice(); },
  coverageSlots: function () { throw new Error("must prefer capacitySlots"); },
  computeHourlyByDow: function () { throw new Error("must not use computeHourlyByDow"); }
};
assert.deepEqual(demandSlots(S), slots);

var demand = bucketFlights([
  { dow: 5, etdMin: 623, seats: 110, pctOrig: 0.8 },
  { dow: 1, etdMin: 240, seats: 100, pctOrig: 1 } // land 02:00 — before 03:30, skip
], slots, 1);
var friIdx = slots.indexOf(Math.floor(503 / 30) * 30);
assert.ok(friIdx >= 0);
assert.equal(demand[5][friIdx], 88);
assert.equal(demand[1].reduce(function (a, b) { return a + b; }, 0), 0);

var matrix = {
  checkpoints: [{ key: "t1c1" }],
  rows: slots.map(function (slot, i) {
    return { slot: slot, airportPax: i === 0 ? 1170 : 900 };
  }),
  peakPax: 1170,
  rates: { STD: 150, PRE: 240, MIX: 195 }
};
var aligned = alignAirportPax(matrix, slots);
assert.equal(aligned.empty, false);
assert.equal(aligned.airportPaxBySlot[0], 1170);
assert.equal(aligned.airportPaxBySlot[1], 900);
assert.equal(aligned.airportPaxBySlot.length, slots.length);

var shifted = slots.slice(2);
var remapped = alignAirportPax(matrix, shifted);
assert.equal(remapped.airportPaxBySlot.length, shifted.length);
assert.equal(remapped.airportPaxBySlot[0], matrix.rows[2].airportPax);

S.computeLaneCapacityMatrix = function () { return matrix; };
S.computeCapacity = S.computeLaneCapacityMatrix;
var pulled = pullProcessCapacity(S, slots);
assert.equal(pulled.airportPaxBySlot[0], 1170);

var emptyS = {
  computeLaneCapacityMatrix: function () {
    return { checkpoints: [], rows: [], peakPax: 0, rates: { STD: 150, PRE: 240, MIX: 195 } };
  }
};
assert.equal(pullProcessCapacity(emptyS, slots).empty, true);

assert.equal(emptyDemandByDow(3)[0].length, 3);

console.log("test-demand-capacity: ok");
