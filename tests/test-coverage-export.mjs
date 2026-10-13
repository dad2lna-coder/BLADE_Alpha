import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { attachHourly, coverageSlots } from "../modules/coverage/utils/hourly.js";
import { buildCoverageWorkbook } from "../modules/coverage/actions/exportExcel.js";

const require = createRequire(import.meta.url);
const ExcelJS = require("../lib/exceljs.min.js");

function createScheduler() {
  const work = ["WORK", "WORK", "WORK", "WORK", "WORK", "WORK", "WORK"];
  const lines = [
    { id: "stso-m", shiftId: "S1", empClass: "STSO", sex: "M", function: "DFO" },
    { id: "stso-f", shiftId: "S1", empClass: "STSO", sex: "F", function: "DFO" },
    { id: "ltso-m", shiftId: "S1", empClass: "LTSO", sex: "M", function: "DFO" },
    { id: "tso-f", shiftId: "S1", empClass: "FT", sex: "F", function: "DFO" },
    { id: "tso-m1", shiftId: "S1", empClass: "FT", sex: "M", function: "DFO" },
    { id: "tso-m2", shiftId: "S1", empClass: "FT", sex: "M", function: "DFO" }
  ];
  const schedule = {};
  lines.forEach((line) => { schedule[line.id] = work.slice(); });

  const S = {
    DAYS: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    state: {
      open: "04:00",
      close: "06:00",
      startDate: "2026-09-06",
      weekCount: 1,
      lines,
      shifts: [{ id: "S1", name: "AM", start: "04:00", end: "12:00" }],
      schedule
    },
    coverageView: { stso: false, ltso: true, tso: false, funcView: "dfo" },
    timeToMin(t) {
      const p = String(t || "00:00").split(":");
      return (+p[0] || 0) * 60 + (+p[1] || 0);
    },
    getShift(id) {
      return S.state.shifts.find((s) => s.id === id) || null;
    },
    lineRoleKey(line) {
      if (line.empClass === "STSO") return "STSO";
      if (line.empClass === "LTSO") return "LTSO";
      return "TSO";
    }
  };
  attachHourly(S);
  return S;
}

function cellText(value) {
  if (value == null) return "";
  if (typeof value === "object" && value.richText) {
    return value.richText.map((p) => p.text).join("");
  }
  return String(value);
}

function parts(value) {
  const text = cellText(value).trim();
  if (!text) return null;
  if (text.includes("/")) {
    const bits = text.split("/").map((n) => Number(n));
    assert.equal(bits.length, 3, "M/F/T cell " + text);
    bits.forEach((n) => assert.equal(Number.isFinite(n), true));
    return bits;
  }
  const n = Number(text);
  assert.equal(Number.isFinite(n), true, "numeric cell " + text);
  return n;
}

function addParts(a, b) {
  if (a == null) return b;
  if (b == null) return a;
  if (Array.isArray(a)) return a.map((n, i) => n + b[i]);
  return a + b;
}

function sameParts(a, b) {
  if (a == null || b == null) return a == null && b == null;
  if (Array.isArray(a)) return a.every((n, i) => n === b[i]);
  return Math.abs(a - b) < 1e-9;
}

function sheetGrid(sheet) {
  const rows = [];
  const last = sheet.rowCount;
  for (let r = 1; r <= last; r++) {
    const vals = [];
    for (let c = 1; c <= 9; c++) vals.push(sheet.getRow(r).getCell(c).value);
    rows.push(vals);
  }
  return rows;
}

const S = createScheduler();
const view = S.coverageView;
const before = JSON.parse(JSON.stringify(view));
const slots = coverageSlots(S);
const wb = buildCoverageWorkbook(S, ExcelJS);

assert.equal(S.coverageView, view, "coverageView object is restored");
assert.deepEqual(S.coverageView, before, "coverageView filters are unchanged after export");

const names = wb.worksheets.map((sheet) => sheet.name);
assert.deepEqual(names, ["All", "STSO", "LTSO", "TSO"]);

const grids = {};
names.forEach((name) => {
  const rows = sheetGrid(wb.getWorksheet(name));
  assert.equal(rows.length, 1 + slots.length + 1, name + " row count");
  rows.forEach((row) => assert.equal(row.length, 1 + 7 + 1, name + " column count"));
  assert.equal(cellText(rows[0][0]), "Time");
  assert.deepEqual(rows[0].slice(1, 8).map(cellText), S.DAYS);
  assert.equal(cellText(rows[0][8]), "Avg T");
  assert.equal(cellText(rows[rows.length - 1][0]), "Day total*");
  assert.equal(cellText(rows[rows.length - 1][8]), "");
  for (let i = 0; i < slots.length; i++) {
    assert.equal(cellText(rows[i + 1][0]), S.slotLabel(slots[i]));
  }
  grids[name] = rows;
});

const all = grids.All;
for (let r = 1; r < all.length; r++) {
  for (let c = 1; c < 9; c++) {
    const sum = ["STSO", "LTSO", "TSO"].reduce((acc, name) => addParts(acc, parts(grids[name][r][c])), null);
    assert.ok(sameParts(sum, parts(all[r][c])), "row " + r + " col " + c + " " + JSON.stringify(sum) + " vs " + cellText(all[r][c]));
  }
}

assert.equal(parts(grids.All[1][1]).join("/"), "4/2/6");
assert.equal(parts(grids.STSO[1][1]).join("/"), "1/1/2");
assert.equal(parts(grids.LTSO[1][1]).join("/"), "1/0/1");
assert.equal(parts(grids.TSO[1][1]).join("/"), "2/1/3");

console.log("test-coverage-export: ok");
