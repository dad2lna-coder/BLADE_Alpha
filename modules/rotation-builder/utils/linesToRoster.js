/** Pure map from generated lines to rotation roster rows. No DOM, no scheduler. */
import { addDays, weekdaySun0 } from "../../shared/utils/dates.js";
import { t2m } from "./time.js";

const SKIP = { BAG: 1, TRAINING: 1, DFO: 1 };

function isoDate(startDate, offset) {
  const d = addDays(startDate, offset);
  if (d && typeof d.toISODate === "function") return d.toISODate();
  if (d && typeof d.toFormat === "function") return d.toFormat("yyyy-MM-dd");
  return String(d || "");
}

function scheduleRow(schedule, line) {
  if (!schedule) return [];
  if (Array.isArray(schedule)) return schedule;
  const row = schedule[line.id] != null ? schedule[line.id] : schedule[String(line.id)];
  return Array.isArray(row) ? row : [];
}

function isTrainingLine(line) {
  if (!line) return false;
  if (line.isTraining || line.trainingClass) return true;
  const parts = [line.empClass, line.extraName, line.position, line.role];
  for (let i = 0; i < parts.length; i++) {
    const s = String(parts[i] == null ? "" : parts[i]).trim().toUpperCase();
    if (s === "ESTI" || s === "MSTI") return true;
  }
  return false;
}

function dutyOf(line, offset, rotationDuty) {
  let cell = "";
  if (typeof rotationDuty === "function") {
    const raw = rotationDuty(line.id, offset);
    if (raw != null && String(raw).trim() !== "") cell = String(raw).trim().toUpperCase();
  }
  /* Rotation cell wins, and a DFO cell stays DFO — no DFO→PAX fallback. */
  if (cell === "BAG" || cell === "DFO" || cell === "TRAINING") return cell;
  if (isTrainingLine(line)) return "TRAINING";
  if (cell) return cell;
  const fn = String(line.function == null ? "" : line.function).trim().toUpperCase();
  if (fn === "BAG" || fn === "DFO" || fn === "PAX" || fn === "TRAINING") return fn;
  return "";
}

function dayTimesFor(line, dow) {
  if (!line || !line.dayTimes) return null;
  const dt = line.dayTimes[dow] != null ? line.dayTimes[dow] : line.dayTimes[String(dow)];
  return dt && typeof dt === "object" ? dt : null;
}

function segmentsFromCustom(dt) {
  if (!dt) return null;
  if (Array.isArray(dt.segments) && dt.segments.length >= 2) {
    const pair = dt.segments.slice(0, 2);
    if (pair.every((seg) => seg && t2m(seg.start) != null && t2m(seg.end) != null)) return pair;
  }
  if (t2m(dt.start) != null && t2m(dt.end) != null) return [{ start: dt.start, end: dt.end }];
  return null;
}

function rawSegments(line, dow, segmentsFor) {
  const custom = segmentsFromCustom(dayTimesFor(line, dow));
  if (custom) return custom;
  if (line && t2m(line.startTime) != null && t2m(line.endTime) != null) {
    return [{ start: line.startTime, end: line.endTime }];
  }
  if (typeof segmentsFor === "function") {
    const segs = segmentsFor(line, dow);
    if (Array.isArray(segs) && segs.length) {
      const cleaned = segs.filter((seg) => seg && t2m(seg.start) != null && t2m(seg.end) != null);
      if (cleaned.length) return cleaned;
    }
  }
  return null;
}

/* Clock times walk forward from the first start. A time that is not after the
   previous one crossed midnight, so it gains +1440 — same rule as roster ingest. */
function onTimeline(segs) {
  const parsed = segs.map((seg) => ({ start: t2m(seg.start), end: t2m(seg.end) }));
  if (!parsed.length || parsed.some((seg) => seg.start == null || seg.end == null)) return null;
  if (parsed[0].end <= parsed[0].start) parsed[0].end += 1440;
  let prev = parsed[0].end;
  for (let i = 1; i < parsed.length; i++) {
    if (parsed[i].start < prev) parsed[i].start += 1440;
    if (parsed[i].end <= parsed[i].start) parsed[i].end += 1440;
    prev = parsed[i].end;
  }
  return parsed;
}

function gapsOf(timed) {
  const ab = [];
  for (let i = 1; i < timed.length; i++) {
    if (timed[i].start > timed[i - 1].end) ab.push([timed[i - 1].end, timed[i].start]);
  }
  return ab;
}

/**
 * linesToRoster({ lines, schedule, rotationDuty, startDate, weekCount, segmentsFor, roleOf, locId, seamAM })
 * → { rows, dates }
 * One row per PAX (or other non-skipped) work day. Does not read or write scheduler state.
 */
export function linesToRoster(opts) {
  const o = opts || {};
  const lines = o.lines;
  if (!Array.isArray(lines) || !lines.length) {
    throw new Error("No generated lines. Generate lines first.");
  }
  const locId = String(o.locId == null ? "" : o.locId).trim();
  if (!locId) {
    throw new Error("Select a checkpoint first. Add the real checkpoint in Configuration, then load.");
  }

  const weeks = Number(o.weekCount);
  const span = Number.isFinite(weeks) && weeks > 0 ? Math.floor(weeks) * 7 : 0;
  const seam = t2m(o.seamAM);
  const roleOf = typeof o.roleOf === "function" ? o.roleOf : (() => "TSO");
  const rows = [];

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    if (!line) continue;
    const sched = scheduleRow(o.schedule, line);
    for (let offset = 0; offset < span; offset++) {
      if (sched[offset] !== "WORK") continue;
      const duty = dutyOf(line, offset, o.rotationDuty);
      if (SKIP[duty]) continue;

      const date = isoDate(o.startDate, offset);
      const dow = weekdaySun0(date);
      const raw = rawSegments(line, dow, o.segmentsFor);
      if (!raw) continue;
      const timed = onTimeline(raw);
      if (!timed) continue;

      const s = timed[0].start;
      const e = timed[timed.length - 1].end;
      const lineCode = line.lineCode;
      rows.push({
        k: String(line.id),
        n: lineCode,
        ti: roleOf(line),
        po: "",
        lo: locId,
        d: date,
        sh: s < seam ? "AM" : "PM",
        s: s,
        e: e,
        x: line.sex,
        q: "",
        ab: gapsOf(timed),
        tr: [],
        nt: ["BLADE line " + lineCode]
      });
    }
  }

  const dates = [...new Set(rows.map((r) => r.d))].filter(Boolean).sort();
  return { rows, dates };
}
