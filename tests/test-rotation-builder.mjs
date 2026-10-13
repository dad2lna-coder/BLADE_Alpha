import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { RB_DEMO } from "../modules/rotation-builder/data/rbDemo.js";
import { defaultConfig } from "../modules/rotation-builder/stores/rotationStore.js";
import { ingestWorkbook, parseRemarks } from "../modules/rotation-builder/utils/roster.js";
import {
  lanesFor,
  laneDemand,
  staffFor,
  ingestProjections
} from "../modules/rotation-builder/utils/projections.js";
import { sheetWindow, solve, scheduleBreaks, seatAllows, buildSeats } from "../modules/rotation-builder/utils/engine.js";
import { sheetAOA, aoaToCsv, rotationWorkbook } from "../modules/rotation-builder/actions/export.js";
import { rb } from "../modules/rotation-builder/stores/rotationStore.js";

const require = createRequire(import.meta.url);
const XLSX = require("../lib/xlsx.full.min.js");
globalThis.XLSX = XLSX;

const cfg = defaultConfig();
const locId = "CKPT-A12";
const date = "2026-09-06";
const loc = cfg.locations[locId];

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function runSolve(seed) {
  const win = sheetWindow(cfg, loc, "AM", "", "");
  const people = staffFor(RB_DEMO.roster, locId, date, win.first, win.last + cfg.rules.slot, cfg, {}, "AM");
  return {
    win,
    res: solve(cfg, {
      locId,
      loc,
      shift: "AM",
      win,
      activeLanes: {},
      people,
      seed,
      locks: {}
    })
  };
}

function codesOf(res) {
  return res.people.map((p) => {
    const row = res.grid[p.k + "|" + p.s] || [];
    return p.k + ":" + row.map((c) => (c && c.c) || "").join(",");
  }).join("\n");
}

// Roster import round-trips RB_DEMO through csv, xlsx, and xls.
function demoToRows(officers) {
  const head = ["KronosID", "EmployeeName", "Job Title", "Position", "Location", "Shift", "Start", "End", "Sex", "Quals", "Date", "Remarks"];
  const body = officers.map((p) => {
    const hh = (m) => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
    let remarks = "";
    if (p.nt && p.nt.includes("Call off")) remarks = "CALL OFF";
    else if (p.nt && p.nt.some((n) => String(n).toLowerCase().startsWith("leave"))) remarks = "LEAVE: SICK";
    return [p.k, p.n, p.ti, p.po, p.lo, p.sh, hh(p.s), hh(p.e), p.x, p.q, p.d, remarks];
  });
  return [head, ...body];
}

function readBuffer(bookType, aoa) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(wb, ws, "Roster");
  const out = XLSX.write(wb, { bookType, type: "array" });
  return ingestWorkbook(out, cfg);
}

const sample = RB_DEMO.roster.filter((p) => p.k === "10001" || p.k === "10021" || p.k === "10023");
assert.equal(sample.length, 3, "RB_DEMO sample officers");
const aoa = demoToRows(sample);

for (const kind of ["csv", "xlsx", "xls"]) {
  const got = readBuffer(kind, aoa);
  const byK = Object.fromEntries(got.rows.map((r) => [r.k, r]));
  assert.equal(byK["10001"].n, "Rivera, Ana");
  assert.equal(byK["10001"].lo, "CKPT-A12");
  assert.equal(byK["10001"].sh, "AM");
  assert.equal(byK["10001"].s, 240);
  assert.equal(byK["10001"].e, 750);
  assert.equal(byK["10001"].x, "F");
  assert.ok(byK["10001"].q.includes("Z"));
  assert.equal(byK["10021"].ab.length, 1, kind + " call-off becomes an absence");
  assert.equal(byK["10021"].ab[0], null);
  assert.equal(byK["10023"].lo, "CKPT-A21");
}

assert.equal(parseRemarks("CALL OFF").drop, false);
assert.deepEqual(parseRemarks("CALL OFF").absent, [null]);
assert.equal(parseRemarks("SHIFT TRADED AWAY").drop, true);

// Projections turn passenger counts into lane demand.
const hour7 = RB_DEMO.proj["CKPT-A12|2026-09-06"][7];
assert.equal(lanesFor(hour7, cfg).need, Math.ceil(420 / 150));
assert.equal(lanesFor({ std: 80, pre: 40 }, cfg).need, 1);
const separate = clone(cfg);
separate.proj = clone(cfg.proj);
separate.proj.mode = "separate";
const splitNeed = lanesFor({ std: 150, pre: 260 }, separate);
assert.equal(splitNeed.need, 2);

const projAoa = [
  ["Date", "Terminal", "Checkpoint", "Metrics", "Sum of Value", "Hour of Day"],
  ["2026-09-06", "A", "A21", "Standard Projection", 300, 8],
  ["2026-09-06", "A", "A21", "PreCheck Projection", 90, 8]
];
const projWb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(projWb, XLSX.utils.aoa_to_sheet(projAoa), "Proj");
const projBuf = XLSX.write(projWb, { bookType: "xlsx", type: "array" });
const ingested = ingestProjections(projBuf, cfg);
assert.equal(ingested.data["CKPT-A21|2026-09-06"][8].std, 300);
assert.equal(ingested.data["CKPT-A21|2026-09-06"][8].pre, 90);

const { win, res } = runSolve(42);
assert.ok(res.people.length > 5, "demo staff made it onto the sheet");
const demand = laneDemand({
  locId,
  date,
  cols: res.cols,
  seats: res.seats,
  people: res.people
}, cfg, RB_DEMO.proj);
const seven = demand.perCol.find((c) => c.hr === 7);
assert.ok(seven, "hour 7 column");
assert.equal(seven.need, Math.min(3, Math.ceil(420 / 150)));
assert.equal(seven.pax, 420);

// Z qualification blocks CT lanes.
const ctSeat = { id: "T1", code: "T1", fam: "T", ct: 1, mod: 1 };
assert.equal(seatAllows(cfg, { quals: "1234", restrict: null }, ctSeat), false);
assert.equal(seatAllows(cfg, { quals: "1234Z", restrict: null }, ctSeat), true);
const ctCodes = new Set(
  buildSeats(cfg, locId, loc, "AM", win, {}).filter((s) => s.ct).map((s) => s.code)
);
assert.ok(ctCodes.size > 0, "A12 has a CT lane");
for (const p of res.people) {
  if (!String(p.quals || "").includes("Z")) {
    const row = res.grid[p.k + "|" + p.s] || [];
    for (const cell of row) {
      assert.equal(ctCodes.has(cell && cell.c), false, p.n + " without Z on " + (cell && cell.c));
    }
  }
}

// Body Scanner gender pairing: mixed pair, or an explicit diagnostic.
let mixed = 0;
let same = 0;
for (let c = 0; c < res.cols.length; c++) {
  let sexA = null;
  let sexB = null;
  for (const p of res.people) {
    const cell = (res.grid[p.k + "|" + p.s] || [])[c];
    if (!cell) continue;
    if (cell.id === "SO1-A") sexA = p.sex;
    if (cell.id === "SO1-B") sexB = p.sex;
  }
  if (sexA && sexB) {
    if (sexA !== sexB) mixed += 1;
    else same += 1;
  }
}
const pairingNotes = res.diag.filter((d) => /pairing not met/i.test(d.m));
assert.ok(mixed > 0, "at least one mixed Body Scanner pair");
assert.equal(same, pairingNotes.length, "same-sex Body Scanner columns are flagged");

// Breaks sit inside the sheet, stay apart, and a long shift asks for two.
const nCols = res.cols.length;
let longBreaks = 0;
for (const p of res.people) {
  for (const i of p.breaks) {
    assert.ok(i > 0 && i < nCols - 1, "break off the edge columns");
  }
  for (let i = 1; i < p.breaks.length; i++) {
    assert.ok(p.breaks[i] - p.breaks[i - 1] >= 2, "breaks stay apart");
  }
  if ((p.e - p.s) / 60 >= cfg.rules.brkHours && p.breaks.length === 2) longBreaks += 1;
}
assert.ok(longBreaks > 0, "a 6-hour-plus officer received two breaks");

const diag = [];
const brPeople = clone(res.people).slice(0, 1);
brPeople[0].mod = 1;
brPeople[0].breaks = [];
scheduleBreaks(cfg, brPeople, res.cols, { 1: res.seats.filter((s) => s.mod === 1) }, diag);
assert.ok(brPeople[0].breaks.length >= 1);

// Fixed seed is stable and different from another seed.
const again = runSolve(42);
const other = runSolve(99);
assert.equal(codesOf(res), codesOf(again.res));
assert.notEqual(codesOf(res), codesOf(other.res));
const seed42 = codesOf(res);
assert.ok(seed42.startsWith("10016:"), "Ali leads the TSO rank order");
let hash = 0;
for (let i = 0; i < seed42.length; i++) hash = (hash * 33 + seed42.charCodeAt(i)) >>> 0;
assert.equal(hash, 3950596385, "seed 42 signature");

// CSV and Excel tables follow the sheet grid.
rb.sheet = {
  locId,
  date,
  shift: "AM",
  seed: 42,
  cols: res.cols,
  people: res.people,
  seats: res.seats,
  grid: res.grid,
  diag: res.diag
};
rb.cfg = cfg;
const rows = sheetAOA();
assert.equal(rows[0][0], "CERT?");
assert.equal(rows[0][1], "NAME");
assert.equal(rows[0][4], "0400");
const csv = aoaToCsv(rows);
assert.ok(csv.includes("Rivera, Ana") || csv.includes("Chen, Wei"));
assert.equal(csv.split("\r\n").length, rows.length);
const book = rotationWorkbook(XLSX);
const names = book.SheetNames;
assert.deepEqual(names, ["AM", "Notes"]);
const sheet = XLSX.utils.sheet_to_json(book.Sheets.AM, { header: 1, raw: false, defval: "" });
assert.equal(sheet[0][1], "NAME");
assert.ok(sheet.some((r) => String(r[1]).includes(",")));
const notes = XLSX.utils.sheet_to_json(book.Sheets.Notes, { header: 1, raw: false, defval: "" });
assert.equal(notes[0][0], "Location");
assert.equal(notes[0][1], locId);

console.log("rotation-builder tests ok");
