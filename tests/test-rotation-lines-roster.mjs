import assert from "node:assert/strict";
import { linesToRoster } from "../modules/rotation-builder/utils/linesToRoster.js";
import { useGeneratedLines } from "../modules/rotation-builder/actions/linesRoster.js";
import { rb, defaultConfig } from "../modules/rotation-builder/stores/rotationStore.js";
import { staffFor } from "../modules/rotation-builder/utils/projections.js";
import { presentAt, solve, sheetWindow } from "../modules/rotation-builder/utils/engine.js";
import { lineRoleKey } from "../modules/function-coverage/lib/duty.js";
import { weekdaySun0, addDays } from "../modules/shared/utils/dates.js";

const START = "2026-09-06";
const WEEKS = 2;
const SPAN = WEEKS * 7;
const LOC = "CKPT-A01";

assert.equal(weekdaySun0(START), 0, "fixture starts on Sunday");

function iso(offset) {
  return addDays(START, offset).toISODate();
}

function fill(status) {
  return Array(SPAN).fill(status);
}

function workExcept(skip) {
  return Array.from({ length: SPAN }, (_, i) => (skip(i) ? "RDO" : "WORK"));
}

const shifts = {
  DAY: {
    id: "DAY",
    name: "PM",
    start: "08:00",
    end: "16:00",
    dayTimes: { "1": { start: "09:30", end: "17:30" } }
  },
  SPLIT: {
    id: "SPLIT",
    name: "AM",
    start: "05:00",
    end: "17:00",
    segments: [
      { start: "05:00", end: "10:00" },
      { start: "12:00", end: "17:00" }
    ]
  },
  NSPLIT: {
    id: "NSPLIT",
    name: "AM",
    start: "22:00",
    end: "07:00",
    segments: [
      { start: "22:00", end: "01:00" },
      { start: "03:00", end: "07:00" }
    ]
  }
};

function segmentsFor(line, dow) {
  const shift = shifts[line.shiftId];
  if (!shift) return null;
  const key = String(dow);
  const dt = shift.dayTimes && shift.dayTimes[key];
  if (dt && Array.isArray(dt.segments) && dt.segments.length >= 2) return dt.segments.slice();
  if (dt && dt.start && dt.end) return [{ start: dt.start, end: dt.end }];
  if (Array.isArray(shift.segments) && shift.segments.length === 2) return shift.segments.slice();
  return [{ start: shift.start, end: shift.end }];
}

const rotation = {
  bagRot: "BAG",
  trnRot: "TRAINING",
  dfoRot: "DFO",
  dfoPax: "PAX"
};

function rotationDuty(id, offset) {
  void offset;
  return Object.prototype.hasOwnProperty.call(rotation, id) ? rotation[id] : null;
}

function line(partial) {
  return Object.assign({
    sex: "M",
    function: "PAX",
    shiftId: "DAY",
    shiftName: "PM",
    certPool: "B"
  }, partial);
}

const lines = [
  line({ id: 42, lineCode: "PAX 042", certPool: "A" }),
  line({ id: "rdo", lineCode: "RDO 001" }),
  line({ id: "bagRot", lineCode: "BAG ROT" }),
  line({ id: "bagFn", lineCode: "BAG FN", function: "BAG" }),
  line({ id: "trnRot", lineCode: "TRN ROT" }),
  line({ id: "dfoRot", lineCode: "DFO ROT" }),
  line({ id: "dfoFn", lineCode: "DFO FN", function: "DFO" }),
  line({ id: "dfoPax", lineCode: "DFO PAX", function: "DFO" }),
  line({ id: "esti", lineCode: "ESTI 001", empClass: "ESTI", isTraining: true, function: "PAX" }),
  line({ id: "msti", lineCode: "MSTI 001", empClass: "MSTI", extraName: "MSTI", function: "PAX" }),
  line({ id: "stso", lineCode: "STSO 003", isStso: true, empClass: "STSO", certPool: "A" }),
  line({ id: "ltso", lineCode: "LTSO 004", isLtso: true, empClass: "LTSO", certPool: "B" }),
  line({ id: "custom", lineCode: "DAY CUSTOM", dayTimes: { "1": { start: "06:15", end: "14:15" } } }),
  line({ id: "base", lineCode: "DAY BASE", startTime: "07:00", endTime: "15:00", shiftName: "AM" }),
  line({ id: "night", lineCode: "NIGHT 01", startTime: "22:00", endTime: "06:00", shiftName: "AM", shiftId: "NSPLIT" }),
  line({ id: "split", lineCode: "SPLIT 01", shiftId: "SPLIT", shiftName: "PM" }),
  line({
    id: "splitDay",
    lineCode: "SPLIT DAY",
    shiftId: "SPLIT",
    dayTimes: { "3": { start: "08:00", end: "16:00" } }
  }),
  line({ id: "nsplit", lineCode: "NSPLIT 01", shiftId: "NSPLIT", shiftName: "AM" })
];

const schedule = {};
for (const ln of lines) schedule[ln.id] = fill("WORK");
schedule.rdo = fill("RDO");
schedule.mix = workExcept((i) => i % 2 === 1);
lines.push(line({ id: "mix", lineCode: "MIX 001" }));

assert.throws(
  () => linesToRoster({ lines: [], locId: LOC, seamAM: "11:00" }),
  (err) => err instanceof Error && err.message === "No generated lines. Generate lines first."
);
assert.throws(
  () => linesToRoster({ lines: null, locId: LOC }),
  (err) => err.message === "No generated lines. Generate lines first."
);
assert.throws(
  () => linesToRoster({ lines, schedule, rotationDuty, startDate: START, weekCount: WEEKS, segmentsFor, roleOf: lineRoleKey, locId: "", seamAM: "11:00" }),
  (err) => err.message === "Select a checkpoint first. Add the real checkpoint in Configuration, then load."
);
assert.throws(
  () => linesToRoster({ lines, locId: "   ", seamAM: "11:00", weekCount: 1, startDate: START, schedule, segmentsFor, roleOf: lineRoleKey }),
  (err) => err.message === "Select a checkpoint first. Add the real checkpoint in Configuration, then load."
);

const { rows, dates } = linesToRoster({
  lines,
  schedule,
  rotationDuty,
  startDate: START,
  weekCount: WEEKS,
  segmentsFor,
  roleOf: lineRoleKey,
  locId: LOC,
  seamAM: "11:00"
});

function of(id) {
  return rows.filter((r) => r.k === String(id));
}

for (const id of ["rdo", "bagRot", "bagFn", "trnRot", "dfoRot", "dfoFn", "esti", "msti"]) {
  assert.equal(of(id).length, 0, id + " gives no rows");
}

assert.equal(of(42).length, SPAN, "PAX gives one row per work day for the full period");
assert.equal(of("mix").length, SPAN / 2, "RDO offsets are skipped inside the period");
assert.equal(of("dfoPax").length, SPAN, "explicit PAX rotation is kept; DFO function is not a fallback");

const pax = of(42)[0];
assert.equal(pax.k, "42");
assert.equal(pax.n, "PAX 042");
assert.equal(pax.ti, "TSO");
assert.equal(pax.po, "");
assert.equal(pax.lo, LOC);
assert.equal(pax.q, "");
assert.deepEqual(pax.tr, []);
assert.deepEqual(pax.nt, ["BLADE line PAX 042"]);
assert.equal(pax.x, "M");
assert.equal(of("stso")[0].ti, "STSO");
assert.equal(of("ltso")[0].ti, "LTSO");
assert.ok(of("stso").every((r) => r.q === "" && r.certPool == null));
assert.ok(of(42).every((r) => r.q === ""));
assert.ok(of("ltso").every((r) => r.q === ""));
assert.equal(JSON.stringify(rows).includes("Z"), false, "no Z anywhere");

assert.deepEqual(dates, Array.from({ length: SPAN }, (_, i) => iso(i)));
assert.deepEqual(dates, [...dates].sort());
assert.ok(of(42).every((r, i) => r.d === iso(i)));

const sun = of("custom").find((r) => r.d === iso(0));
const mon = of("custom").find((r) => r.d === iso(1));
const dayMon = of(42).find((r) => r.d === iso(1));
const daySun = of(42).find((r) => r.d === iso(0));
const dayTue = of(42).find((r) => r.d === iso(2));
assert.equal(daySun.s, 8 * 60);
assert.equal(daySun.e, 16 * 60);
assert.equal(dayMon.s, 9 * 60 + 30, "shift.dayTimes changes Monday only");
assert.equal(dayMon.e, 17 * 60 + 30);
assert.equal(dayTue.s, 8 * 60, "Tuesday keeps the shift default");
assert.equal(dayTue.e, 16 * 60);
assert.equal(mon.s, 6 * 60 + 15, "line.dayTimes wins over shift.dayTimes");
assert.equal(mon.e, 14 * 60 + 15);
assert.equal(sun.s, 8 * 60, "line.dayTimes does not leak onto Sunday");
assert.deepEqual(mon.ab, []);

for (const r of of("base")) {
  assert.equal(r.s, 7 * 60, "line.startTime/endTime beat shift.dayTimes");
  assert.equal(r.e, 15 * 60);
  assert.equal(r.sh, "AM", "shift name AM/PM is ignored");
}

const night = of("night")[0];
assert.equal(night.s, 22 * 60);
assert.equal(night.e, 6 * 60 + 1440, "overnight end gets +1440");
assert.equal(night.sh, "PM", "22:00 is PM even when the shift is named AM");
assert.deepEqual(night.ab, []);

for (const r of of("split")) {
  assert.equal(r.s, 5 * 60);
  assert.equal(r.e, 17 * 60);
  assert.deepEqual(r.ab, [[10 * 60, 12 * 60]]);
  assert.equal(r.sh, "AM", "05:00 is AM even when the shift is named PM");
}

const wed = of("splitDay").find((r) => r.d === iso(3));
const splitSun = of("splitDay").find((r) => r.d === iso(0));
assert.deepEqual(wed.ab, [], "line.dayTimes replaces the split on Wednesday");
assert.equal(wed.s, 8 * 60);
assert.equal(wed.e, 16 * 60);
assert.deepEqual(splitSun.ab, [[10 * 60, 12 * 60]]);

const overnightSplit = of("nsplit")[0];
assert.equal(overnightSplit.s, 22 * 60);
assert.equal(overnightSplit.e, 7 * 60 + 1440);
assert.deepEqual(overnightSplit.ab, [[1 * 60 + 1440, 3 * 60 + 1440]]);

function seamRow(start, seam, shiftName) {
  const id = "seam";
  const got = linesToRoster({
    lines: [line({ id, lineCode: "SEAM", startTime: start, endTime: "19:00", shiftName, shiftId: "DAY" })],
    schedule: { [id]: fill("WORK") },
    rotationDuty: () => null,
    startDate: START,
    weekCount: 1,
    segmentsFor,
    roleOf: lineRoleKey,
    locId: LOC,
    seamAM: seam
  });
  return got.rows[0];
}

const amEdge = seamRow("10:59", "11:00", "PM");
assert.equal(amEdge.s, 10 * 60 + 59);
assert.equal(amEdge.sh, "AM", "10:59 is AM");
const pmEdge = seamRow("11:00", "11:00", "AM");
assert.equal(pmEdge.s, 11 * 60);
assert.equal(pmEdge.sh, "PM", "11:00 is PM");
const moved = seamRow("10:59", "10:00", "AM");
assert.equal(moved.sh, "PM", "a custom seamAM moves 10:59 to PM");

const titles = defaultConfig().titles;
assert.equal(titles.STSO, 0);
const stsoPeople = staffFor(of("stso"), LOC, iso(0), 0, 24 * 60, defaultConfig(), {}, "AM");
assert.ok(stsoPeople.length > 0);
assert.equal(stsoPeople.filter((p) => titles[p.ti] !== 0).length, 0, "titles filter drops STSO");

const cfg = defaultConfig();
cfg.locations["CKPT-T01"] = {
  t: "A", open: "04:00", close: "20:00",
  mods: [[{ n: 1, ct: 0 }]],
  kcm: null,
  exit: { am: 0, pm: 0 }
};
const splitRow = of("split").find((r) => r.d === iso(0));
const splitRoster = [{ ...splitRow, lo: "CKPT-T01" }];
const win = sheetWindow(cfg, cfg.locations["CKPT-T01"], "AM", "", "");
const people = staffFor(splitRoster, "CKPT-T01", splitRow.d, win.first, win.last + cfg.rules.slot, cfg, {}, "AM");
assert.equal(people.length, 1);
const person = people[0];
assert.equal(presentAt(person, 8 * 60, cfg.rules.slot), "on");
assert.equal(presentAt(person, 10 * 60 + 30, cfg.rules.slot), "lv");
const res = solve(cfg, {
  locId: "CKPT-T01",
  loc: cfg.locations["CKPT-T01"],
  shift: "AM",
  win,
  activeLanes: {},
  people,
  seed: 1,
  locks: {}
});
assert.ok(!res.error, res.error || "solve");
const gapCol = res.cols.indexOf(10 * 60 + 30);
assert.ok(gapCol >= 0);
const gapCell = res.grid[person.k + "|" + person.s][gapCol];
assert.equal(gapCell.t, "lv");
assert.equal(gapCell.c, "LV");
const onCol = res.cols.indexOf(8 * 60);
assert.notEqual(res.grid[person.k + "|" + person.s][onCol].t, "lv");

/* ---- click handler: replace, do not append, do not touch scheduler ---- */
const els = {};
function fakeEl(value) {
  return { value: value == null ? "" : value, innerHTML: "", textContent: "", className: "" };
}
for (const id of ["iLoc", "iDate", "rosterInfo", "toast"]) els[id] = fakeEl("");
els.iDate.value = "1999-01-01";
globalThis.document = { getElementById(id) { return els[id] || null; } };

const mem = {};
globalThis.indexedDB = {
  open() {
    const req = {};
    queueMicrotask(() => {
      req.result = {
        objectStoreNames: { contains() { return true; } },
        transaction() {
          return {
            objectStore() {
              return {
                get(k) {
                  const r = {};
                  queueMicrotask(() => { r.result = mem[k]; if (r.onsuccess) r.onsuccess(); });
                  return r;
                },
                put(v, k) {
                  mem[k] = JSON.parse(JSON.stringify(v));
                  const r = {};
                  queueMicrotask(() => { if (r.onsuccess) r.onsuccess(); });
                  return r;
                },
                delete(k) {
                  delete mem[k];
                  const r = {};
                  queueMicrotask(() => { if (r.onsuccess) r.onsuccess(); });
                  return r;
                },
                getAllKeys() {
                  const r = {};
                  queueMicrotask(() => { r.result = Object.keys(mem); if (r.onsuccess) r.onsuccess(); });
                  return r;
                }
              };
            }
          };
        }
      };
      if (req.onsuccess) req.onsuccess({ target: req });
    });
    return req;
  }
};

const keptRoster = [{ k: "keep", n: "Kept" }];
const keptMeta = { file: "old file", source: "old source", rows: 1, when: "then", dates: ["2020-01-01"], unknown: { Q: 1 } };
const keptSheet = { id: "on-screen" };
rb.roster = keptRoster;
rb.meta = keptMeta;
rb.sheet = keptSheet;

const scheduler = {
  state: {
    lines: [],
    schedule: {},
    startDate: START,
    weekCount: 1,
    shifts: Object.values(shifts),
    coverage: { touched: false },
    setup: { touched: false }
  },
  getRotationDuty: rotationDuty,
  getEffectiveShiftSegments(shiftId, dow) {
    return segmentsFor({ shiftId }, dow);
  },
  lineRoleKey
};

useGeneratedLines(scheduler);
assert.equal(rb.roster, keptRoster, "no lines leaves the roster");
assert.equal(rb.meta, keptMeta, "no lines leaves meta");
assert.equal(rb.sheet, keptSheet, "no lines leaves the sheet");
assert.equal(els.toast.textContent, "No generated lines. Generate lines first.");

scheduler.state.lines = lines.slice();
scheduler.state.schedule = schedule;
els.iLoc.value = "";
useGeneratedLines(scheduler);
assert.equal(rb.roster, keptRoster, "empty checkpoint leaves the roster");
assert.equal(rb.meta, keptMeta, "empty checkpoint leaves meta");
assert.equal(rb.sheet, keptSheet, "empty checkpoint leaves the sheet");
assert.equal(els.toast.textContent, "Select a checkpoint first. Add the real checkpoint in Configuration, then load.");

const firstLine = line({ id: "first", lineCode: "FIRST 1", certPool: "A" });
const secondLine = line({ id: "second", lineCode: "SECOND 2", certPool: "B", sex: "F" });
const oneWeek = fill("WORK").slice(0, 7);
scheduler.state.lines = [firstLine];
scheduler.state.schedule = { first: oneWeek.slice() };
scheduler.state.weekCount = 1;
els.iLoc.value = "CKPT-A01";
els.iDate.value = "1999-01-01";
let before = JSON.parse(JSON.stringify(scheduler.state));
useGeneratedLines(scheduler);
assert.deepEqual(scheduler.state, before, "scheduler state is unchanged by the load");
assert.equal(rb.sheet, keptSheet, "a successful load does not rebuild the sheet");
assert.equal(rb.meta.source, "BLADE lines");
assert.equal(rb.meta.file, "BLADE lines");
assert.equal(rb.meta.rows, 7);
assert.deepEqual(rb.meta.unknown, {});
assert.deepEqual(rb.meta.dates, Array.from({ length: 7 }, (_, i) => iso(i)));
assert.equal(rb.roster.length, 7);
assert.ok(rb.roster.every((r) => r.k === "first" && r.lo === "CKPT-A01" && r.q === ""));
assert.equal(els.iDate.value, iso(0), "a date outside the roster moves to the first date");
assert.match(els.rosterInfo.innerHTML, /BLADE lines/);
await new Promise((resolve) => setTimeout(resolve, 30));
assert.equal(mem.rosterMeta.source, "BLADE lines");
assert.equal(mem.roster.length, 7);

els.iDate.value = iso(3);
before = JSON.parse(JSON.stringify(scheduler.state));
scheduler.state.lines = [secondLine];
scheduler.state.schedule = { second: oneWeek.slice() };
els.iLoc.value = "CKPT-B09";
const stateAfterSwap = JSON.parse(JSON.stringify(scheduler.state));
useGeneratedLines(scheduler);
assert.deepEqual(scheduler.state, stateAfterSwap);
assert.equal(rb.roster.length, 7);
assert.ok(rb.roster.every((r) => r.k === "second" && r.lo === "CKPT-B09"), "second load replaces, it does not append");
assert.equal(rb.roster.some((r) => r.k === "first"), false);
assert.equal(rb.meta.source, "BLADE lines");
assert.deepEqual(rb.meta.dates, Array.from({ length: 7 }, (_, i) => iso(i)));
assert.equal(els.iDate.value, iso(3), "a date that is still in the roster stays put");
assert.equal(rb.sheet, keptSheet);

const frozenRoster = JSON.parse(JSON.stringify(rb.roster));
scheduler.state.lines[0].lineCode = "EDITED";
scheduler.state.lines[0].function = "BAG";
scheduler.state.schedule.second[0] = "RDO";
scheduler.state.coverage.touched = true;
assert.deepEqual(JSON.parse(JSON.stringify(rb.roster)), frozenRoster, "editing lines after a load does not touch the loaded roster");
assert.equal(rb.sheet, keptSheet, "editing lines after a load does not touch the sheet");

console.log("rotation lines roster tests ok");
