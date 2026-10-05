/**
 * eBid 45-column export from live Alpha lines.
 * Cert pool stays in column 13. D01 follows the schedule start date.
 */
import assert from "node:assert/strict";
import {
  EBID_HEADERS,
  rowsFromScheduler,
  rowsFromLines,
  rowsFromCsv,
  rowsFromJsonPayload,
  rowToCells,
  toCsv,
  runQa,
  suggestForm,
  hoursFromSpan,
  bidLineIdFromLine,
  looksLikeEbidExport
} from "../modules/bid-planner/js/ebid.js";

function weekSchedule(startIso, rdoDows) {
  const rdo = new Set(rdoDows);
  const [y, m, d] = startIso.split("-").map(Number);
  const out = [];
  for (let i = 0; i < 14; i++) {
    const dt = new Date(Date.UTC(y, m - 1, d + i));
    out.push(rdo.has(dt.getUTCDay()) ? "RDO" : "WORK");
  }
  return out;
}

const form = {
  airportCode: "DFW",
  bidEventId: "DFW2026-10",
  startDate: "2026-10-07",
  endDate: "2026-12-31",
  shiftTypeMode: "Airport"
};

function ctx(extra) {
  return Object.assign({
    schedule: {},
    shifts: [{ id: "S1", name: "0330", start: "03:30", end: "12:00" }],
    teams: [],
    getShift: (id) => (id === "S1" ? { id: "S1", start: "03:30", end: "12:00" } : null),
    teamResolver: () => ({ id: "t1", name: "01" })
  }, form, extra || {});
}

const line = {
  id: 1,
  lineCode: "Line 001",
  shiftId: "S1",
  shiftLabel: "0330-1200",
  empClass: "PT",
  position: "TSO",
  sex: "M",
  function: "PAX",
  certPool: "B",
  rdoDays: [1, 2],
  paid: 8
};

function mapped(overrides, contextExtra) {
  const rowLine = Object.assign({}, line, overrides || {});
  const schedule = {};
  schedule[rowLine.id] = weekSchedule("2026-10-07", rowLine.rdoDays || []);
  return rowsFromLines([rowLine], ctx(Object.assign({ schedule }, contextExtra || {})))[0];
}

assert.equal(EBID_HEADERS.length, 45);
assert.equal(EBID_HEADERS[0], "Airport Code");
assert.equal(EBID_HEADERS[6], "Patdown Req");
assert.equal(EBID_HEADERS[12], "Public Bid Line Comments");
assert.equal(EBID_HEADERS[13], "D01 Shift Time");
assert.equal(EBID_HEADERS[27], "D01 Shift Type");
assert.equal(EBID_HEADERS[41], "RDOs");
assert.equal(EBID_HEADERS[44], "Days/Week");
assert.equal(looksLikeEbidExport(EBID_HEADERS), true);

assert.equal(hoursFromSpan("0330-1200"), 8);
assert.equal(hoursFromSpan("1000-1400"), 4);
assert.equal(hoursFromSpan("0900-1300 1500-1900"), 7.5);
assert.equal(hoursFromSpan("2200-0630"), 8);

assert.equal(bidLineIdFromLine({ id: 1, lineCode: "Line 001" }), "1001");
assert.equal(bidLineIdFromLine({ id: 14, lineCode: "ESTI 014" }), "ESTI 014");
assert.equal(bidLineIdFromLine({ id: 1001, lineCode: "1001" }), "1001");

const row = mapped();
const cells = rowToCells(row);
assert.equal(cells.length, 45);
assert.equal(cells[4], "1001");
assert.equal(cells[5], "Team 01");
assert.equal(cells[6], "Male");
assert.equal(cells[7], "TSO");
assert.equal(cells[8], "PAX", "cert pool B must not become BAG");
assert.equal(cells[9], "PT");
assert.equal(cells[10], "0330-1200");
assert.equal(cells[12], "Pool B");
assert.equal(cells[13], "0330-1200", "D01 is Wednesday 2026-10-07, a work day");
assert.equal(cells[18], "RDO", "D06 is Monday");
assert.equal(cells[19], "RDO", "D07 is Tuesday");
assert.equal(cells[27], "Airport");
assert.equal(cells[32], "", "RDO shift type stays blank");
assert.equal(cells[41], "MO/TU");
assert.equal(cells[42], "8");
assert.equal(cells[43], "80");
assert.equal(cells[44], "5");

const dfo = mapped({
  id: 2,
  lineCode: "Line 002",
  empClass: "STSO",
  position: "STSO",
  isStso: true,
  sex: "F",
  function: "DFO",
  certPool: "A"
});
assert.equal(dfo.title, "STSO");
assert.equal(dfo.schedType, "FT");
assert.equal(dfo.certification, "DUAL");
assert.equal(dfo.publicComments, "Pool A");
assert.notEqual(dfo.certification, "BAG");

const trainer = mapped({
  id: 3,
  lineCode: "ESTI 014",
  empClass: "FT",
  extraName: "ESTI",
  function: "TRAINING",
  isTraining: true,
  certPool: "A",
  sex: "F"
});
assert.equal(trainer.bidLineId, "ESTI 014");
assert.equal(trainer.title, "ESTI");
assert.equal(trainer.certification, "PAX");
assert.ok(trainer.dayShiftTypes.every((t) => t === "Training" || t === ""));
assert.ok(trainer.warnings.some((w) => /TRAINING/.test(w)));

const split = rowsFromLines([{
  id: 4,
  lineCode: "Line 004",
  shiftId: "SP",
  sex: "M",
  empClass: "FT",
  function: "BAG",
  certPool: "A",
  rdoDays: [0, 6]
}], ctx({
  schedule: { 4: weekSchedule("2026-10-07", [0, 6]) },
  getShift: () => ({
    id: "SP",
    segments: [
      { start: "09:00", end: "13:00" },
      { start: "15:00", end: "19:00" }
    ]
  }),
  shifts: []
}))[0];
assert.equal(split.shiftTime, "0900-1300 1500-1900");
assert.equal(split.shiftTime.length, 19);
assert.equal(split.certification, "BAG");
assert.equal(split.hoursPerDay, 7.5);

const capped = mapped({ rdoDays: [], id: 5, lineCode: "Line 005", empClass: "FT", certPool: "A" });
assert.equal(capped.hoursPerPP, 80);
assert.equal(capped.capped, true);

const qa = runQa([row, dfo]);
assert.equal(qa.empty, false);
assert.equal(qa.errors, 0, JSON.stringify(qa.issues.filter((i) => i.level === "error"), null, 2));
assert.equal(qa.ft, 1);
assert.equal(qa.pt, 1);
assert.equal(qa.male, 1);
assert.equal(qa.female, 1);

const broken = mapped({ certPool: "A" });
broken.dayShiftTypes[5] = "Airport";
const badQa = runQa([broken]);
assert.ok(badQa.issues.some((i) => i.code === "rdo-type" && i.level === "error"));

const dup = runQa([row, Object.assign({}, row)]);
assert.ok(dup.issues.some((i) => i.code === "line-id" && /duplicated/.test(i.message)));

const emptySched = { state: { lines: [], schedule: {}, shifts: [] } };
assert.equal(rowsFromScheduler(emptySched, form).length, 0);
const emptyQa = runQa([]);
assert.equal(emptyQa.empty, true);
assert.equal(emptyQa.total, 0);
assert.equal(emptyQa.issues.length, 0);
const blankSuggest = suggestForm({ state: {} });
assert.equal(blankSuggest.airportCode, "");
assert.equal(blankSuggest.bidEventId, "");
assert.equal(blankSuggest.startDate, "");
assert.ok(!/AAA/.test(JSON.stringify(blankSuggest)));

const live = rowsFromScheduler({
  state: {
    airportCode: "DFW",
    startDate: "2026-10-07",
    lines: [line],
    schedule: { 1: weekSchedule("2026-10-07", [1, 2]) },
    shifts: [{ id: "S1", start: "03:30", end: "12:00" }]
  },
  getAirportCode: () => "DFW",
  getShift: (id) => (id === "S1" ? { id: "S1", start: "03:30", end: "12:00" } : null),
  teamMetaForLine: () => ({ name: "7" })
}, form);
assert.equal(live.length, 1);
assert.equal(live[0].workgroup, "Team 07");
assert.equal(live[0].publicComments, "Pool B");
assert.equal(rowToCells(live[0])[12], "Pool B");

const csv = [
  "Team,Line,Shift,Start,End,Position,Emp,Sex,Function,Cert pool,RDOs,Paid,Sun,Mon,Tue,Wed,Thu,Fri,Sat,Hours",
  "01,Line 001,0330,03:30,12:00,TSO,FT,F,PAX,B,\"Mon,Tue\",32,RDO,RDO,0330-1200,0330-1200,0330-1200,0330-1200,0330-1200,20"
].join("\n");
const imported = rowsFromCsv(csv, form);
assert.equal(imported.error, "");
assert.equal(imported.rows[0].certification, "PAX");
assert.equal(imported.rows[0].publicComments, "Pool B");
assert.equal(imported.rows[0].schedType, "FT", "weekly hours must not flip FT to PT");
assert.equal(imported.rows[0].dayShiftTimes[0], "0330-1200");
assert.equal(imported.rows[0].dayShiftTimes[5], "RDO");

const ebidCsv = rowsFromCsv(toCsv([row]), form);
assert.match(ebidCsv.error, /already a 45-column/);
assert.equal(ebidCsv.rows.length, 0);

const parsed = toCsv([row, dfo]).split(/\r\n/);
assert.equal(parsed.length, 3);
assert.equal(parsed[0].split(",").length, 45);
assert.match(parsed[1], /"Pool B"/);
assert.match(parsed[2], /"DUAL"/);
assert.doesNotMatch(parsed[1], /AAA2020/);

const jsonRows = rowsFromJsonPayload({
  config: { startDate: "2026-10-07", shifts: [{ id: "S1", start: "03:30", end: "12:00" }] },
  results: {
    lines: [Object.assign({}, line, { function: "PAX", certPool: "B" })],
    schedule: { 1: weekSchedule("2026-10-07", [1, 2]) },
    teams: [{ id: "t", name: "2", members: [1] }]
  }
}, form);
assert.equal(jsonRows.error, "");
assert.equal(jsonRows.rows[0].certification, "PAX");
assert.equal(jsonRows.rows[0].publicComments, "Pool B");
assert.equal(jsonRows.rows[0].workgroup, "Team 02");
assert.equal(jsonRows.rows[0].bidLineId, "1001");

const noTeam = runQa([mapped({}, { teamResolver: () => null, teams: [] })]);
assert.ok(noTeam.issues.some((i) => i.code === "team" && i.level === "warn"));

console.log("ebid upload tests passed");
