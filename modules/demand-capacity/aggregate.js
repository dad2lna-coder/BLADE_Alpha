/**
 * Bucket originating volume into 30-min slots (ETD − 2h) and align
 * process-capacity airportPax onto the same slot list.
 */

export function demandSlots(S) {
  if (S && typeof S.capacitySlots === "function") return S.capacitySlots().slice();
  if (S && typeof S.coverageSlots === "function") return S.coverageSlots().slice();
  return [];
}

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

export function landMinFromEtd(etdMin) {
  var land = Number(etdMin) - 120;
  if (land < 0) land += 1440;
  return ((land % 1440) + 1440) % 1440;
}

function slotIndexFor(slots, slotIndex, landMin) {
  var bucket = Math.floor(landMin / 30) * 30;
  if (slotIndex.has(bucket)) return slotIndex.get(bucket);
  for (var i = 0; i < slots.length; i++) {
    var start = slots[i];
    var end = start + 30;
    if (landMin >= start && landMin < end) return i;
    if (end > 1440) {
      var wrap = landMin + 1440;
      if (wrap >= start && wrap < end) return i;
    }
  }
  return null;
}

export function bucketFlights(flights, slots, multiplier) {
  var demandByDow = emptyDemandByDow(slots.length);
  var slotIndex = new Map();
  for (var i = 0; i < slots.length; i++) slotIndex.set(slots[i], i);
  var mult = Number(multiplier);
  if (!Number.isFinite(mult) || mult < 0) mult = 1;
  var list = flights || [];
  for (var f = 0; f < list.length; f++) {
    var row = list[f];
    if (!row) continue;
    var dow = row.dow;
    if (dow == null || dow < 0 || dow > 6) continue;
    var landMin = landMinFromEtd(row.etdMin);
    var si = slotIndexFor(slots, slotIndex, landMin);
    if (si == null) continue;
    var vol = (row.seats * row.pctOrig * mult);
    if (!Number.isFinite(vol) || vol === 0) continue;
    demandByDow[dow][si] += vol;
  }
  return demandByDow;
}

/**
 * Map computeLaneCapacityMatrix() rows onto the demand slot list by minute.
 * Capacity series is airportPax (pax per 30-min), never FTE / headcount.
 */
export function alignAirportPax(matrix, slots) {
  var airportPaxBySlot = [];
  var byMin = new Map();
  var rows = (matrix && matrix.rows) || [];
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r];
    if (!row || row.slot == null) continue;
    byMin.set(row.slot, Number(row.airportPax) || 0);
  }
  for (var i = 0; i < slots.length; i++) {
    airportPaxBySlot.push(byMin.has(slots[i]) ? byMin.get(slots[i]) : 0);
  }
  var checkpoints = (matrix && matrix.checkpoints) || [];
  var empty = !checkpoints.length;
  return {
    slots: slots.slice(),
    airportPaxBySlot: airportPaxBySlot,
    empty: empty,
    peakPax: matrix && matrix.peakPax != null ? matrix.peakPax : 0,
    rates: (matrix && matrix.rates) || null
  };
}

export function pullProcessCapacity(S, slots) {
  var compute = (S && (S.computeLaneCapacityMatrix || S.computeCapacity)) || null;
  if (typeof compute !== "function") {
    return { slots: (slots || []).slice(), airportPaxBySlot: (slots || []).map(function () { return 0; }), empty: true, peakPax: 0, rates: null };
  }
  var matrix = compute.call(S);
  return alignAirportPax(matrix, slots || []);
}
