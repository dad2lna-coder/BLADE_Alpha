/**
 * PAX staffing capacity: qualifying people × 36 pax/hour per slot.
 * Never uses lane/equipment airportPax.
 */
import { emptyDemandByDow } from "./aggregate.js";

export var PAX_PER_HOUR = 36;
export var PAX_PER_SLOT = 36;

export function demandSlots(S) {
  if (S && typeof S.coverageSlots === "function") return S.coverageSlots().slice();
  if (S && typeof S.capacitySlots === "function") return S.capacitySlots().slice();
  return [];
}

export function normalizeRoleMode(mode) {
  return mode === "tso-ltso" ? "tso-ltso" : "tso";
}

export function roleAllowed(role, mode) {
  if (role === "TSO") return true;
  if (role === "LTSO") return mode === "tso-ltso";
  return false;
}

export function roleKey(S, line) {
  if (S && typeof S.lineRoleKey === "function") return S.lineRoleKey(line);
  if (!line) return "TSO";
  if (line.isStso || line.empClass === "STSO") return "STSO";
  if (line.isLtso || line.empClass === "LTSO") return "LTSO";
  return "TSO";
}

export function dowToScheduleOffset(S) {
  var map = {};
  var base = S && S.state && S.state.startDate;
  if (!base || typeof base.add !== "function" || typeof base.day !== "function") {
    for (var d = 0; d < 7; d++) map[d] = d;
    return map;
  }
  var days = Math.min(7, (S.state.weekCount || 1) * 7);
  for (var off = 0; off < days; off++) {
    var dow = base.add(off, "day").day();
    if (map[dow] == null) map[dow] = off;
  }
  return map;
}

export function isPaxDuty(S, line, dayOff) {
  if (!line) return false;
  var duty = null;
  if (S && typeof S.getRotationDuty === "function") duty = S.getRotationDuty(line.id, dayOff);
  else if (line.function === "BAG" || line.function === "DFO" || line.function === "PAX") duty = line.function;
  if (duty === "BAG" || duty === "DFO") return false;
  return true;
}

function lineCovers(S, line, dayOff, slot, dow) {
  if (S && typeof S.lineCoversSlot === "function") return !!S.lineCoversSlot(line, dayOff, slot);
  var sched = (S.state && S.state.schedule && (S.state.schedule[line.id] || S.state.schedule[String(line.id)])) || [];
  if (sched[dayOff] !== "WORK") return false;
  var times = S.getEffectiveShiftTimes ? S.getEffectiveShiftTimes(line.shiftId, dow) : null;
  if (!times) {
    var sh = S.getShift ? S.getShift(line.shiftId) : null;
    if (!sh) return false;
    times = { start: sh.start, end: sh.end };
  }
  var a = S.timeToMin(times.start);
  var b = S.timeToMin(times.end);
  if (b <= a) return slot >= a || slot < b;
  return slot >= a && slot < b;
}

/**
 * capacityByDow[d][slot] = qualifyingCount × 36 (pax/hour).
 * Qualifying: role toggle + WORK + PAX duty + shift covers slot.
 */
export function computeStaffCapacity(S, slots, roleMode) {
  var mode = normalizeRoleMode(roleMode);
  var n = (slots || []).length;
  var capacityByDow = emptyDemandByDow(n);
  var countsByDow = emptyDemandByDow(n);
  var lines = (S && S.state && S.state.lines) || [];
  var empty = !lines.length;
  var offMap = dowToScheduleOffset(S);
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var role = roleKey(S, line);
    if (!roleAllowed(role, mode)) continue;
    if (S.getShift && line.shiftId && !S.getShift(line.shiftId)) continue;
    for (var dow = 0; dow < 7; dow++) {
      var off = offMap[dow];
      if (off == null) continue;
      var sched = (S.state.schedule && (S.state.schedule[line.id] || S.state.schedule[String(line.id)])) || [];
      if (sched[off] !== "WORK") continue;
      if (!isPaxDuty(S, line, off)) continue;
      for (var si = 0; si < n; si++) {
        if (!lineCovers(S, line, off, slots[si], dow)) continue;
        countsByDow[dow][si] += 1;
        capacityByDow[dow][si] += PAX_PER_SLOT;
      }
    }
  }
  return {
    slots: (slots || []).slice(),
    capacityByDow: capacityByDow,
    countsByDow: countsByDow,
    empty: empty,
    roleMode: mode,
    paxPerSlot: PAX_PER_SLOT,
    paxPerHour: PAX_PER_HOUR
  };
}

export function capacityLegend(mode) {
  return normalizeRoleMode(mode) === "tso-ltso" ? "TSO+LTSO capacity" : "TSO capacity";
}
