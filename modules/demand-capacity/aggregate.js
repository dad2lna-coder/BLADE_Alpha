/**
 * Bucket originating volume across 30-min slots from ETD−120 through ETD−45.
 * Slot grid matches staffing capacity (coverageSlots preferred).
 */

export function emptyDemandByDow(slotCount) {
  var n = Math.max(0, slotCount | 0);
  var out = [];
  for (var d = 0; d < 7; d++) {
    var row = [];
    for (var i = 0; i < n; i++) row.push(0);
    out.push(row);
  }
  return out;
}

export function wrapMin(m) {
  return ((Number(m) % 1440) + 1440) % 1440;
}

/** Inclusive window [ETD−120, ETD−45] in clock minutes (may wrap midnight). */
export function volumeWindow(etdMin) {
  return {
    start: wrapMin(Number(etdMin) - 120),
    end: wrapMin(Number(etdMin) - 45)
  };
}

export function landMinFromEtd(etdMin) {
  return volumeWindow(etdMin).start;
}

export function slotInVolumeWindow(slotStart, winStart, winEnd) {
  var s = Number(slotStart);
  if (winStart <= winEnd) return s >= winStart && s <= winEnd;
  return s >= winStart || s <= winEnd;
}

export function slotsForEtd(slots, etdMin) {
  var win = volumeWindow(etdMin);
  var out = [];
  var list = slots || [];
  for (var i = 0; i < list.length; i++) {
    if (slotInVolumeWindow(list[i], win.start, win.end)) out.push(i);
  }
  return out;
}

export function bucketFlights(flights, slots, multiplier) {
  var demandByDow = emptyDemandByDow(slots.length);
  var unplaced = 0;
  var mult = Number(multiplier);
  if (!Number.isFinite(mult) || mult < 0) mult = 1;
  var list = flights || [];
  for (var f = 0; f < list.length; f++) {
    var row = list[f];
    if (!row) continue;
    var dow = row.dow;
    if (dow == null || dow < 0 || dow > 6) continue;
    var lf = Number(row.loadFactor);
    if (!Number.isFinite(lf) || lf < 0) lf = 1;
    var vol = (row.seats * lf * row.pctOrig * mult);
    if (!Number.isFinite(vol) || vol === 0) continue;
    var idxs = slotsForEtd(slots, row.etdMin);
    if (!idxs.length) {
      unplaced += 1;
      continue;
    }
    var share = vol / idxs.length;
    for (var i = 0; i < idxs.length; i++) demandByDow[dow][idxs[i]] += share;
  }
  demandByDow.unplaced = unplaced;
  return demandByDow;
}
