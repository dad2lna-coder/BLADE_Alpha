/** Shift lookup, coverage windows, RDO counts, normalize. */
import { assignBlockRdos, normalizeRdoBlock, normalizeRdoPins } from "./rdoBlock.js";
export function getShift(S, id) {
  return (S.state.shifts || []).find(function (x) { return x.id === id; });
}

export function shiftBadge(S, id) {
  var i = (S.state.shifts || []).findIndex(function (x) { return x.id === id; });
  return S.BADGES[(i >= 0 ? i : 0) % S.BADGES.length];
}

export function shiftLabel(s) {
  if (!s) return "\u2014";
  if (s.segments && Array.isArray(s.segments) && s.segments.length === 2) {
    return String(s.segments[0].start).replace(":", "") + "-" + String(s.segments[0].end).replace(":", "") +
      " / " + String(s.segments[1].start).replace(":", "") + "-" + String(s.segments[1].end).replace(":", "");
  }
  return String(s.start).replace(":", "") + "-" + String(s.end).replace(":", "");
}

export function getEffectiveShiftSegments(S, shiftId, dow) {
  var s = getShift(S, shiftId);
  if (!s) return [{ start: "00:00", end: "00:00" }];
  var key = String(dow);
  if (s.dayTimes && s.dayTimes[key]) {
    var dt = s.dayTimes[key];
    if (dt.segments && Array.isArray(dt.segments) && dt.segments.length === 2) {
      if (S.isValidTimeText(dt.segments[0].start) && S.isValidTimeText(dt.segments[0].end) &&
          S.isValidTimeText(dt.segments[1].start) && S.isValidTimeText(dt.segments[1].end)) {
        return [
          { start: dt.segments[0].start, end: dt.segments[0].end },
          { start: dt.segments[1].start, end: dt.segments[1].end }
        ];
      }
    }
    if (S.isValidTimeText(dt.start) && S.isValidTimeText(dt.end)) {
      return [{ start: dt.start, end: dt.end }];
    }
  }
  if (s.segments && Array.isArray(s.segments) && s.segments.length === 2) {
    return [
      { start: s.segments[0].start, end: s.segments[0].end },
      { start: s.segments[1].start, end: s.segments[1].end }
    ];
  }
  return [{ start: s.start, end: s.end }];
}

export function getEffectiveShiftTimes(S, shiftId, dow) {
  var s = getShift(S, shiftId);
  if (!s) return { start: "00:00", end: "00:00", isOverride: false };
  var key = String(dow);
  if (s.dayTimes && s.dayTimes[key] &&
      S.isValidTimeText(s.dayTimes[key].start) &&
      S.isValidTimeText(s.dayTimes[key].end)) {
    return { start: s.dayTimes[key].start, end: s.dayTimes[key].end, isOverride: true };
  }
  return { start: s.start, end: s.end, isOverride: false };
}

export function shiftHasDayOverrides(S, shiftId) {
  var s = getShift(S, shiftId);
  return !!(s && s.dayTimes && Object.keys(s.dayTimes).length);
}

export function shiftCoversSlot(S, shiftId, slotStart, dow) {
  var segs = (dow != null) ? getEffectiveShiftSegments(S, shiftId, dow) : null;
  if (!segs) {
    var s = getShift(S, shiftId);
    if (!s) return false;
    segs = s.segments && s.segments.length === 2 ? s.segments : [{ start: s.start, end: s.end }];
  }
  for (var i = 0; i < segs.length; i++) {
    var seg = segs[i];
    var a = S.timeToMin(seg.start);
    var b = S.timeToMin(seg.end);
    if (b <= a) {
      if (slotStart >= a || slotStart < b) return true;
    } else {
      if (slotStart >= a && slotStart < b) return true;
    }
  }
  return false;
}

export function shiftOverlapsWindow(S, s, openMin, closeMin) {
  if (!s) return false;
  return S.timeToMin(s.start) < closeMin && S.timeToMin(s.end) > openMin;
}

export function targetWorkDays(S, shiftId, empClass) {
  if (empClass === "PT") {
    var days = Math.round(+(S.state && S.state.ptDaysPerWeek));
    return Number.isFinite(days) && days > 0 ? Math.max(1, Math.min(6, days)) : 3;
  }
  if (empClass === "STSO" || empClass === "LTSO") {
    var s0 = getShift(S, shiftId);
    return s0 && (+s0.paid || 8) >= 10 ? 4 : 5;
  }
  var s = getShift(S, shiftId);
  if (s && (+s.paid || 8) >= 10) return 4;
  return 5;
}

export function consecutiveRdos(count, start) {
  var n = Math.max(1, Math.min(6, count || 2));
  var out = [];
  for (var i = 0; i < n; i++) out.push((start + i) % 7);
  return out;
}


/** "off" | "4x10" | "5x8". Unknown values stay off so legacy hard RDOs keep working. */
export function normalizeRdoMode(raw) {
  var m = "";
  if (raw && typeof raw === "object") m = raw.rdoMode != null ? String(raw.rdoMode) : "";
  else if (raw != null) m = String(raw);
  m = m.trim().toLowerCase();
  if (m === "4x10" || m === "4\u00d710" || m === "pair" || m === "consecutive") return "4x10";
  if (m === "5x8" || m === "5\u00d78" || m === "adjacent" || m === "adj") return "5x8";
  return "off";
}

/** Sun=0 … Sat=6, or null when unset. */
export function normalizeConstraintDay(raw) {
  var v = raw;
  if (raw && typeof raw === "object") v = raw.rdoConstraint;
  if (v == null || v === "") return null;
  var n = Number(v);
  if (Number.isInteger(n) && n >= 0 && n <= 6) return n;
  return null;
}

export function rdoModeActive(shift) {
  return normalizeRdoMode(shift) !== "off" && normalizeConstraintDay(shift) != null;
}

function legacyRdoDays(S, shift, rdoCount, seed) {
  var hard = Array.isArray(shift && shift.rdoHard)
    ? shift.rdoHard.map(Number).filter(function (x) { return x >= 0 && x <= 6; })
    : [];
  var rdoDays;
  if (hard.length > 0) {
    rdoDays = hard.slice();
    if (rdoDays.length < rdoCount) {
      for (var d = 0; d < 7 && rdoDays.length < rdoCount; d++) {
        if (rdoDays.indexOf(d) < 0) rdoDays.push(d);
      }
    }
  } else if (S && S.consecutiveRdos) {
    rdoDays = S.consecutiveRdos(rdoCount, seed);
  } else {
    rdoDays = consecutiveRdos(rdoCount, seed);
  }
  while (rdoDays.length < rdoCount) {
    var before = rdoDays.length;
    for (var e = 0; e < 7 && rdoDays.length < rdoCount; e++) {
      if (rdoDays.indexOf(e) < 0) rdoDays.push(e);
    }
    if (rdoDays.length === before) break;
  }
  return { rdoDays: rdoDays, hard: hard.length > 0, mode: "off" };
}

/**
 * Place RDOs for one line.
 * No block: copy hard days and pad Sunday-first, else a soft consecutive block from seed.
 * Block 2–4: a consecutive block, then the pin if it is not already in that block. Flex fills only what is still short.
 * A 4×10 pin is not glued to the block (Tue + Fri–Sat is legal). A 5×8 pin sits inside the two-day block.
 * opts.avoidDays, when passed, keeps non-pin days off days already taken. Omit it for the legacy pick.
 * Split Start2/End2 is time-only; this does not read segments.
 */
export function assignRdoDays(S, shift, rdoCount, seed, opts) {
  var count = Math.max(1, Math.min(6, rdoCount || 2));
  var s = Number(seed);
  if (!Number.isFinite(s)) s = 0;
  s = Math.abs(Math.floor(s));
  var placed = assignBlockRdos(shift, count, s, opts);
  if (placed) return placed;
  return legacyRdoDays(S, shift, count, s);
}

export function rdoCountForShift(S, shift, empClass) {
  var work = targetWorkDays(S, shift && shift.id, empClass || "FT");
  return Math.max(1, 7 - work);
}

/** Next numeric suffix for an S<n> id. Skips any id already in use. */
export function nextShiftSeq(shifts) {
  var used = Object.create(null);
  var maxN = 0;
  (shifts || []).forEach(function (s) {
    if (!s || s.id == null || s.id === "") return;
    var id = String(s.id);
    used[id] = true;
    var m = /^S(\d+)$/.exec(id);
    if (!m) return;
    var n = parseInt(m[1], 10);
    if (n > maxN) maxN = n;
  });
  var next = maxN + 1;
  while (used["S" + next]) next += 1;
  return next;
}

export function nextShiftId(shifts) {
  return "S" + nextShiftSeq(shifts);
}

export function cloneDayTimes(dayTimes) {
  if (!dayTimes || typeof dayTimes !== "object") return null;
  var out = {};
  Object.keys(dayTimes).forEach(function (k) {
    var v = dayTimes[k];
    if (!v || typeof v !== "object") {
      out[k] = v;
      return;
    }
    var copy = {};
    if (v.start != null) copy.start = v.start;
    if (v.end != null) copy.end = v.end;
    if (Array.isArray(v.segments)) {
      copy.segments = v.segments.map(function (seg) {
        return seg ? { start: seg.start, end: seg.end } : seg;
      });
    }
    out[k] = copy;
  });
  return out;
}

function cloneSegments(segments) {
  if (!Array.isArray(segments)) return segments;
  return segments.map(function (seg) {
    return seg ? { start: seg.start, end: seg.end } : seg;
  });
}

function shiftsShareNested(shifts) {
  var seen = [];
  function hit(v) {
    if (v == null || typeof v !== "object") return false;
    if (seen.indexOf(v) !== -1) return true;
    seen.push(v);
    return false;
  }
  var shared = false;
  (shifts || []).forEach(function (s) {
    if (!s) return;
    if (hit(s.segments)) shared = true;
    if (Array.isArray(s.segments)) {
      s.segments.forEach(function (seg) { if (hit(seg)) shared = true; });
    }
    if (hit(s.dayTimes)) shared = true;
    if (s.dayTimes && typeof s.dayTimes === "object") {
      Object.keys(s.dayTimes).forEach(function (k) {
        var dt = s.dayTimes[k];
        if (hit(dt)) shared = true;
        if (dt && Array.isArray(dt.segments)) {
          if (hit(dt.segments)) shared = true;
          dt.segments.forEach(function (seg) { if (hit(seg)) shared = true; });
        }
      });
    }
    if (hit(s.rdoHard)) shared = true;
    if (hit(s.rdoPins)) shared = true;
  });
  return shared;
}

var DUPLICATE_SHIFT_ID_NOTE = "Duplicate shift ids were split onto new ids. Regenerate lines so each shift has its own lines.";

/**
 * Keep the first shift for each id. Later repeats get a fresh S<n>.
 * segments, dayTimes, rdoHard, and rdoPins are copied so shifts do not share objects.
 * Lines stay on the first shift. Crew-group membership follows the new ids.
 * One issue note asks the user to regenerate when anything was renumbered.
 */
export function ensureUniqueShiftIds(S) {
  if (!S || !S.state || !Array.isArray(S.state.shifts)) return false;
  var shifts = S.state.shifts;
  var groups = Array.isArray(S.state.shiftCrewGroups) ? S.state.shiftCrewGroups : [];

  var membership = shifts.map(function (s) {
    var ids = [];
    if (!s) return ids;
    if (s.crewGroupId) ids.push(String(s.crewGroupId));
    var sid = s.id == null ? "" : String(s.id);
    groups.forEach(function (g) {
      if (!g || g.id == null || !Array.isArray(g.shiftIds) || !sid) return;
      var gid = String(g.id);
      if (g.shiftIds.map(String).indexOf(sid) !== -1 && ids.indexOf(gid) < 0) ids.push(gid);
    });
    return ids;
  });

  var taken = Object.create(null);
  shifts.forEach(function (s) {
    if (!s || s.id == null || s.id === "") return;
    taken[String(s.id)] = true;
  });

  function freshId() {
    var maxN = 0;
    Object.keys(taken).forEach(function (id) {
      var m = /^S(\d+)$/.exec(id);
      if (!m) return;
      var n = parseInt(m[1], 10);
      if (n > maxN) maxN = n;
    });
    var n = maxN + 1;
    var id = "S" + n;
    while (taken[id]) {
      n += 1;
      id = "S" + n;
    }
    taken[id] = true;
    return id;
  }

  var seen = Object.create(null);
  var renamed = false;
  shifts.forEach(function (s) {
    if (!s) return;
    var id = s.id == null ? "" : String(s.id);
    if (seen[id]) {
      s.id = freshId();
      renamed = true;
      return;
    }
    seen[id] = true;
  });

  if (renamed || shiftsShareNested(shifts)) {
    shifts.forEach(function (s) {
      if (!s) return;
      if (Array.isArray(s.segments)) s.segments = cloneSegments(s.segments);
      if (s.dayTimes && typeof s.dayTimes === "object") s.dayTimes = cloneDayTimes(s.dayTimes);
      if (Array.isArray(s.rdoHard)) s.rdoHard = s.rdoHard.slice();
      if (Array.isArray(s.rdoPins)) s.rdoPins = s.rdoPins.slice();
    });
  }

  if (renamed) {
    groups.forEach(function (g) {
      if (!g || g.id == null) return;
      var gid = String(g.id);
      var nextIds = [];
      shifts.forEach(function (s, i) {
        if (!s || membership[i].indexOf(gid) < 0) return;
        if (nextIds.indexOf(s.id) < 0) nextIds.push(s.id);
      });
      g.shiftIds = nextIds;
    });
    if (!Array.isArray(S.state.issues)) S.state.issues = [];
    if (S.state.issues.indexOf(DUPLICATE_SHIFT_ID_NOTE) < 0) {
      S.state.issues.push(DUPLICATE_SHIFT_ID_NOTE);
    }
  }
  return renamed;
}

export function normalizeShift(S, raw, index) {
  var fallbackId = "S" + (index + 1);
  var id = raw && raw.id ? String(raw.id) : fallbackId;
  var name = raw && raw.name ? String(raw.name) : id;

  var segments = null;
  if (raw && raw.segments && Array.isArray(raw.segments) && raw.segments.length === 2) {
    var seg0 = raw.segments[0];
    var seg1 = raw.segments[1];
    if (seg0 && seg1 &&
        S.isValidTimeText(seg0.start) && S.isValidTimeText(seg0.end) &&
        S.isValidTimeText(seg1.start) && S.isValidTimeText(seg1.end)) {
      var m0Start = S.timeToMin(seg0.start);
      var m0End = S.timeToMin(seg0.end);
      var m1Start = S.timeToMin(seg1.start);
      var m1End = S.timeToMin(seg1.end);
      if (m0End > m0Start && m1End > m1Start && m1Start > m0End) {
        segments = [
          { start: seg0.start, end: seg0.end },
          { start: seg1.start, end: seg1.end }
        ];
      }
    }
  }

  var start = segments ? segments[0].start : (raw && S.isValidTimeText(raw.start) ? raw.start : "08:00");
  var end = segments ? segments[1].end : (raw && S.isValidTimeText(raw.end) ? raw.end : "16:30");

  var paid = S.safeNumber(raw && raw.paid, 8, 1, 24);
  var force = Math.floor(S.safeNumber(raw && raw.force, 0, 0, null));
  var ltsoForce = Math.floor(S.safeNumber(raw && raw.ltsoForce, 0, 0, null));
  var stsoForce = Math.floor(S.safeNumber(raw && raw.stsoForce, 0, 0, null));
  var rdoHard = Array.isArray(raw && raw.rdoHard)
    ? raw.rdoHard.map(Number).filter(function (x) {
        return Number.isInteger(x) && x >= 0 && x <= 6;
      })
    : [];

  var dayTimes = null;
  if (raw && raw.dayTimes && typeof raw.dayTimes === "object") {
    dayTimes = {};
    for (var k in raw.dayTimes) {
      if (!Object.prototype.hasOwnProperty.call(raw.dayTimes, k)) continue;
      var dt = raw.dayTimes[k];
      if (dt) {
        if (dt.segments && Array.isArray(dt.segments) && dt.segments.length === 2) {
          var d0 = dt.segments[0], d1 = dt.segments[1];
          if (d0 && d1 && S.isValidTimeText(d0.start) && S.isValidTimeText(d0.end) &&
              S.isValidTimeText(d1.start) && S.isValidTimeText(d1.end)) {
            var dm0s = S.timeToMin(d0.start), dm0e = S.timeToMin(d0.end);
            var dm1s = S.timeToMin(d1.start), dm1e = S.timeToMin(d1.end);
            if (dm0e > dm0s && dm1e > dm1s && dm1s > dm0e) {
              dayTimes[String(k)] = {
                start: d0.start,
                end: d1.end,
                segments: [
                  { start: d0.start, end: d0.end },
                  { start: d1.start, end: d1.end }
                ]
              };
              continue;
            }
          }
        }
        if (S.isValidTimeText(dt.start) && S.isValidTimeText(dt.end)) {
          dayTimes[String(k)] = { start: dt.start, end: dt.end };
        }
      }
    }
    if (!Object.keys(dayTimes).length) dayTimes = null;
  }

  var phase = (raw && raw.phase) || "auto";
  if (["auto", "opening", "am", "pm", "closing"].indexOf(phase) < 0) phase = "auto";
  var crewGroupId = raw && raw.crewGroupId ? String(raw.crewGroupId) : "";

  var rdoMode = normalizeRdoMode(raw);
  var rdoConstraint = normalizeConstraintDay(raw);
  var rdoBlock = normalizeRdoBlock(raw);
  var rdoPins = normalizeRdoPins(raw);
  var rdoPinRequired = !!(raw && (raw.rdoPinRequired === true || raw.rdoPinRequired === 1 || raw.rdoPinRequired === "true"));
  if (rdoBlock) rdoHard = rdoPins.slice();

  var result = {
    id: id, name: name, start: start, end: end, paid: paid,
    force: force, ltsoForce: ltsoForce, stsoForce: stsoForce, rdoHard: rdoHard,
    rdoMode: rdoMode, rdoConstraint: rdoConstraint,
    rdoBlock: rdoBlock, rdoPins: rdoPins, rdoPinRequired: rdoPinRequired,
    dayTimes: dayTimes, phase: phase, crewGroupId: crewGroupId
  };
  if (segments) result.segments = segments;
  return result;
}

export function getBandKey(S, shiftId) {
  var s = getShift(S, shiftId);
  if (!s) return String(shiftId || "");
  if (s.crewGroupId && S && S.state && Array.isArray(S.state.shiftCrewGroups)) {
    var grp = S.state.shiftCrewGroups.find(function (g) { return g && g.id === s.crewGroupId; });
    if (grp && Array.isArray(grp.shiftIds) && grp.shiftIds.indexOf(s.id) >= 0) {
      return grp.id;
    }
  }
  return s.id;
}

export function attachShiftMath(S) {
  if (!S) return;
  S.getShift = function (id) { return getShift(S, id); };
  S.shiftBadge = function (id) { return shiftBadge(S, id); };
  S.shiftLabel = shiftLabel;
  S.getEffectiveShiftSegments = function (shiftId, dow) { return getEffectiveShiftSegments(S, shiftId, dow); };
  S.getEffectiveShiftTimes = function (shiftId, dow) { return getEffectiveShiftTimes(S, shiftId, dow); };
  S.shiftHasDayOverrides = function (shiftId) { return shiftHasDayOverrides(S, shiftId); };
  S.shiftCoversSlot = function (shiftId, slotStart, dow) { return shiftCoversSlot(S, shiftId, slotStart, dow); };
  S.shiftOverlapsWindow = function (s, openMin, closeMin) { return shiftOverlapsWindow(S, s, openMin, closeMin); };
  S.targetWorkDays = function (shiftId, empClass) { return targetWorkDays(S, shiftId, empClass); };
  S.consecutiveRdos = consecutiveRdos;
  S.normalizeRdoMode = normalizeRdoMode;
  S.normalizeConstraintDay = normalizeConstraintDay;
  S.rdoModeActive = rdoModeActive;
  S.normalizeRdoBlock = normalizeRdoBlock;
  S.normalizeRdoPins = normalizeRdoPins;
  S.assignRdoDays = function (shift, rdoCount, seed, opts) { return assignRdoDays(S, shift, rdoCount, seed, opts); };
  S.rdoCountForShift = function (shift, empClass) { return rdoCountForShift(S, shift, empClass); };
  S.normalizeShift = function (raw, index) { return normalizeShift(S, raw, index); };
  S.getBandKey = function (shiftId) { return getBandKey(S, shiftId); };
  S.nextShiftSeq = function () { return nextShiftSeq(S.state && S.state.shifts); };
  S.nextShiftId = function () { return nextShiftId(S.state && S.state.shifts); };
  S.ensureUniqueShiftIds = function () { return ensureUniqueShiftIds(S); };
}
