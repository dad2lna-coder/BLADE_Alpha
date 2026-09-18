/**
 * Bucket originating volume across 30-min slots from ETD−120 through ETD−30.
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

/** Inclusive window [ETD−120, ETD−30] in clock minutes (may wrap midnight). */
export function volumeWindow(etdMin) {
  return {
    start: wrapMin(Number(etdMin) - 120),
    end: wrapMin(Number(etdMin) - 30)
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

export var DEFAULT_ARRIVAL_WEIGHTS_PCT = [40, 30, 20, 10];
export var CURVE_WEIGHTS = [0.4, 0.3, 0.2, 0.1];

export function slotsForEtd(slots, etdMin) {
  var win = volumeWindow(etdMin);
  var out = [];
  var list = slots || [];
  for (var i = 0; i < list.length; i++) {
    if (slotInVolumeWindow(list[i], win.start, win.end)) out.push(i);
  }
  out.sort(function (a, b) { return list[a] - list[b]; });
  return out;
}

export function normalizeArrivalWeights(raw) {
  var src = Array.isArray(raw) && raw.length ? raw : DEFAULT_ARRIVAL_WEIGHTS_PCT;
  var nums = [];
  var sum = 0;
  for (var i = 0; i < 4; i++) {
    var n = Number(src[i]);
    if (!Number.isFinite(n) || n < 0) n = 0;
    nums.push(n);
    sum += n;
  }
  if (!sum) return CURVE_WEIGHTS.slice();
  return nums.map(function (n) { return n / sum; });
}

/** 40/30/20/10 on 4 slots; same pattern renormalized if the list is not length 4. */
export function curveWeights(n, raw) {
  var base = normalizeArrivalWeights(raw);
  var count = n | 0;
  if (count <= 0) return [];
  if (count === 4) return base;
  var out = [];
  var sum = 0;
  var i;
  if (count < 4) {
    for (i = 0; i < count; i++) { out.push(base[i]); sum += base[i]; }
  } else {
    for (i = 0; i < count; i++) {
      var t = i * 3 / (count - 1);
      var a = Math.floor(t);
      var f = t - a;
      var w = a >= 3 ? base[3] : base[a] * (1 - f) + base[a + 1] * f;
      out.push(w);
      sum += w;
    }
  }
  if (!sum) return out;
  for (i = 0; i < out.length; i++) out[i] /= sum;
  return out;
}

export function bucketFlights(flights, slots, multiplier, arrivalWeights) {
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
    var weights = curveWeights(idxs.length, arrivalWeights);
    for (var i = 0; i < idxs.length; i++) demandByDow[dow][idxs[i]] += vol * weights[i];
  }
  demandByDow.unplaced = unplaced;
  return demandByDow;
}
