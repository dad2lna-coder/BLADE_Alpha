// Derived 30-minute coverage from assigned generated lines.
// Not used to decide function assignment — measurement only.
import { lineRoleKey, lineCoversSlot, getRotationDuty } from "./duty.js";

let api = null;

export function bindCoverageCalcApi(scheduler) {
  api = scheduler;
}

function lineDuty(line, dayIndex) {
  var d = getRotationDuty(line.id, dayIndex);
  if (d) return d;
  if (line.function === "BAG" || line.function === "DFO" || line.function === "PAX") return line.function;
  return null;
}

export function countAssignedAtSlot(dayIndex, slotMin, opts) {
  opts = opts || {};
  if (!api || !api.state) return 0;
  var n = 0;
  (api.state.lines || []).forEach(function (line) {
    if (!line) return;
    if (opts.includeExtra) { /* extra positions may be counted by caller */ }
    else if (line.isExtra || line.extraPositionId) return;
    if (typeof api.getShift === "function" && !api.getShift(line.shiftId)) return;
    if (opts.role && lineRoleKey(line) !== opts.role) return;
    if (!lineCoversSlot(line, dayIndex, slotMin)) return;
    if (opts.duty) {
      if (lineDuty(line, dayIndex) !== opts.duty) return;
    }
    n++;
  });
  return n;
}

/**
 * Headcount at each 30-minute slot from assigned lines.
 * cells: [{ dayIndex, slotMin, role, function, count }]
 */
export function computeAssignedCoverage(opts) {
  opts = opts || {};
  if (!api || !api.state) return { slots: [], cells: [] };
  var openMin = api.timeToMin ? api.timeToMin(api.state.open || "03:30") : 0;
  var closeMin = api.timeToMin ? api.timeToMin(api.state.close || "23:00") : 24 * 60;
  var start = Math.floor(openMin / 30) * 30;
  var end = Math.ceil(closeMin / 30) * 30;
  var slots = [];
  for (var m = start; m < end; m += 30) slots.push(m);
  var days = opts.days != null ? opts.days : ((api.state.weekCount || 1) * 7);
  var roles = opts.roles || ["STSO", "LTSO", "TSO"];
  var duties = opts.duties || ["BAG", "DFO", "PAX"];
  var cells = [];
  for (var d = 0; d < days; d++) {
    for (var i = 0; i < slots.length; i++) {
      var slot = slots[i];
      for (var r = 0; r < roles.length; r++) {
        for (var f = 0; f < duties.length; f++) {
          var c = countAssignedAtSlot(d, slot, { role: roles[r], duty: duties[f] });
          if (c > 0 || opts.includeZeros) {
            cells.push({
              dayIndex: d,
              slotMin: slot,
              role: roles[r],
              function: duties[f],
              count: c
            });
          }
        }
      }
    }
  }
  return { slots: slots, cells: cells, days: days };
}
