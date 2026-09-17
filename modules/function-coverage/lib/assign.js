// ESM assign helpers (full E5) — real implementations from js/functions.js
import { lineRoleKey, lineCoversSlot, getRotationDuty } from "./duty.js";
import { lineStartMin, isAmSide, computeShiftAnchors } from "./duty.js";
import { ensureFunctionCoverage, bagPoolTotal, dfoPoolTotal, capFunctionPoolsToFte, buildCertifiedPools } from "./pools.js";
import { readFunctionBandsFromDom, closeFunctionCoverageModal } from "./bands.js";

let api = null;

export function bindAssignApi(scheduler) {
  api = scheduler;
}

function bandSlots(band) {
  var start = api.timeToMin(band.start), end = api.timeToMin(band.end);
  if (end <= start) end += 1440;
  var slots = [];
  for (var m = start; m < end; m += 30) slots.push(m % 1440);
  return slots;
}

function worksDay(line, d) {
  var sched = api.state.schedule[line.id] || api.state.schedule[String(line.id)];
  if (!sched) return false;
  return sched[d] === "WORK";
}

export function bagSlotCounts(d, band, role) {
  var slots = bandSlots(band);
  var counts = [];
  for (var i = 0; i < slots.length; i++) counts.push(0);
  (api.state.lines || []).forEach(function (l) {
    if (lineRoleKey(l) !== role) return;
    if (!worksDay(l, d) || getRotationDuty(l.id, d) !== "BAG") return;
    for (var i = 0; i < slots.length; i++) {
      if (lineCoversSlot(l, d, slots[i])) counts[i]++;
    }
  });
  return counts;
}

export function worstBagCoverage(d, band, role) {
  var slots = bandSlots(band);
  if (!slots.length) return 0;
  var counts = bagSlotCounts(d, band, role);
  var have = counts[0];
  for (var i = 1; i < counts.length; i++) if (counts[i] < have) have = counts[i];
  return have;
}

function ensureEligible(line) {
  if (!line.functionEligible || typeof line.functionEligible !== "object") {
    line.functionEligible = { dfo: false, bag: false, pax: false };
  }
  return line.functionEligible;
}

function unused(role, sex, fc) {
  var lines = api.state.lines || [];
  return lines.filter(function (l) {
    if (l.isExtra || l.extraPositionId) return false;
    var el = ensureEligible(l);
    return lineRoleKey(l) === role && l.sex === sex && !el.bag && !el.dfo;
  });
}

export function markBag(role, sex, n, fc) {
  if (!n || n <= 0) return { total: 0 };
  fc = fc || ensureFunctionCoverage();
  var lines = unused(role, sex, fc).slice();
  lines.sort(function (a, b) {
    return lineStartMin(a) - lineStartMin(b) || String(a.id).localeCompare(String(b.id));
  });
  var taken = 0;
  for (var i = 0; i < lines.length && taken < n; i++) {
    ensureEligible(lines[i]).bag = true;
    taken++;
  }
  return { total: taken };
}

export function markDfo(role, sex, n, fc) {
  if (!n || n <= 0) return { am: 0, pm: 0, total: 0 };
  fc = fc || ensureFunctionCoverage();
  var anchors = computeShiftAnchors();
  var thr = fc.phaseThresholdMin || 15;
  var pool = unused(role, sex, fc).slice();
  pool.sort(function (a, b) {
    return lineStartMin(a) - lineStartMin(b) || String(a.id).localeCompare(String(b.id));
  });
  var amSide = pool.filter(function (l) { return isAmSide(lineStartMin(l), anchors, thr); });
  var pmSide = pool.filter(function (l) { return !isAmSide(lineStartMin(l), anchors, thr); });
  var bands = fc.bands || [];
  var openBand = bands[0];
  var closeBand = bands[bands.length - 1];
  function coversBandStart(line, band) {
    if (!band) return false;
    var bandStart = api.timeToMin(band.start);
    var sh = api.getShift(line.shiftId);
    if (!sh) return false;
    var shStart = api.timeToMin(sh.start);
    var shEnd = api.timeToMin(sh.end);
    if (shEnd <= shStart) shEnd += 1440;
    if (bandStart >= shStart && bandStart < shEnd) return true;
    return false;
  }
  amSide.sort(function (a, b) {
    var aOpen = coversBandStart(a, openBand) ? 0 : 1;
    var bOpen = coversBandStart(b, openBand) ? 0 : 1;
    if (aOpen !== bOpen) return aOpen - bOpen;
    return lineStartMin(a) - lineStartMin(b) || String(a.id).localeCompare(String(b.id));
  });
  pmSide.sort(function (a, b) {
    var aClose = coversBandStart(a, closeBand) ? 0 : 1;
    var bClose = coversBandStart(b, closeBand) ? 0 : 1;
    if (aClose !== bClose) return aClose - bClose;
    return lineStartMin(a) - lineStartMin(b) || String(a.id).localeCompare(String(b.id));
  });
  var needAm = fc.amPmSplit ? Math.ceil(n / 2) : n;
  var needPm = fc.amPmSplit ? Math.floor(n / 2) : 0;
  if (amSide.length < needAm) { needPm += needAm - amSide.length; needAm = amSide.length; }
  if (pmSide.length < needPm) { needAm = Math.min(amSide.length, needAm + (needPm - pmSide.length)); needPm = pmSide.length; }
  var closeNeed = 0;
  if (closeBand) {
    if (role === "STSO") closeNeed = closeBand.stsoMin || 0;
    else if (role === "LTSO") closeNeed = closeBand.ltsoMin || 0;
    else if (role === "TSO") closeNeed = closeBand.tsoMin || 0;
  }
  var closeCapable = closeBand
    ? pmSide.filter(function (line) { return coversBandStart(line, closeBand); })
    : [];
  var needClose = Math.min(closeNeed, closeCapable.length, n);
  needPm = Math.max(needPm, needClose);
  if (needAm + needPm > n) needAm = n - needPm;
  if (needAm < 0) { needAm = 0; needPm = Math.min(n, needPm); }
  while (needAm + needPm > n) {
    if (needPm >= needAm && needPm > 0) needPm--;
    else if (needAm > 0) needAm--;
    else break;
  }
  function take(arr, count) {
    var taken = 0;
    for (var i = 0; i < arr.length && taken < count; i++) {
      var el = ensureEligible(arr[i]);
      if (el.bag || el.dfo) continue;
      el.dfo = true;
      taken++;
    }
    return taken;
  }
  var gotClose = take(closeCapable, needClose);
  var gotAm = take(amSide, needAm);
  var stillNeedPm = Math.max(0, needPm - gotClose);
  var gotPm = gotClose + take(pmSide, stillNeedPm);
  var short = n - gotAm - gotPm;
  if (short > 0) gotPm += take(unused(role, sex, fc), short);
  return { am: gotAm, pm: gotPm, total: gotAm + gotPm };
}

function paintAfterAssign() {
  if (api.renderCoverageBars) api.renderCoverageBars();
  if (api.renderReports) api.renderReports();
  window.dispatchEvent(new CustomEvent("lines:request-render"));
  if (!api.__USE_SVELTE_LINES && api.renderLines) api.renderLines();
}

function setDuty(lineId, dayIndex, fn) {
  var key = String(lineId);
  if (!api.state.functionRotation) api.state.functionRotation = {};
  if (!api.state.functionRotation[key]) api.state.functionRotation[key] = [];
  while (api.state.functionRotation[key].length <= dayIndex) api.state.functionRotation[key].push(null);
  api.state.functionRotation[key][dayIndex] = fn;
  return true;
}

function getDuty(lineId, dayIndex) {
  var row = api.state.functionRotation[String(lineId)];
  if (!row) return null;
  var cell = row[dayIndex];
  if (cell == null || cell === "") return null;
  return cell;
}

export function fillBandShortfalls(d, fc, bagFillCount) {
  fc = fc || ensureFunctionCoverage();
  bagFillCount = bagFillCount || {};
  var days = (api.state.weekCount || 1) * 7;
  (fc.bands || []).forEach(function (band) {
    [["STSO", band.stsoMin, band.stsoMax], ["LTSO", band.ltsoMin, band.ltsoMax], ["TSO", band.tsoMin, band.tsoMax]].forEach(function (pair) {
      var role = pair[0], need = pair[1] || 0, maxC = pair[2];
      if (maxC == null) maxC = need;
      if (maxC < need) maxC = need;
      if (need <= 0) return;
      var slots = bandSlots(band);
      var counts = bagSlotCounts(d, band, role);
      var slotShort = [];
      for (var i = 0; i < slots.length; i++) slotShort.push(need - counts[i]);
      var totalShort = slotShort.reduce(function (a, b) { return a + Math.max(0, b); }, 0);
      if (totalShort <= 0) return;
      function countFuncDays(line) {
        var n = 0;
        for (var dd = 0; dd < days; dd++) {
          if (getDuty(line.id, dd) === "BAG") n++;
        }
        return n + (bagFillCount[String(line.id)] || 0);
      }
      while (totalShort > 0) {
        var cands = (api.state.lines || []).filter(function (l) {
          if (!ensureEligible(l).dfo) return false;
          if (lineRoleKey(l) !== role) return false;
          if (!worksDay(l, d) || getDuty(l.id, d) === "BAG") return false;
          var coversShort = false;
          var allCoveredShortAtMax = true;
          var wouldExceedMax = false;
          for (var i = 0; i < slots.length; i++) {
            if (!lineCoversSlot(l, d, slots[i])) continue;
            if (counts[i] >= maxC) wouldExceedMax = true;
            if (counts[i] < need) {
              coversShort = true;
              if (counts[i] < maxC) allCoveredShortAtMax = false;
            }
          }
          if (!coversShort) return false;
          if (wouldExceedMax) return false;
          if (allCoveredShortAtMax) return false;
          return true;
        }).sort(function (a, b) {
          var da = countFuncDays(a), db = countFuncDays(b);
          if (da !== db) return da - db;
          if (fc.bias === "male") { if (a.sex !== b.sex) return a.sex === "M" ? -1 : 1; }
          else if (fc.bias === "female") { if (a.sex !== b.sex) return a.sex === "F" ? -1 : 1; }
          return lineStartMin(a) - lineStartMin(b) || String(a.id).localeCompare(String(b.id));
        });
        if (!cands.length) break;
        var chosen = cands[0];
        setDuty(chosen.id, d, "BAG");
        bagFillCount[String(chosen.id)] = (bagFillCount[String(chosen.id)] || 0) + 1;
        for (var i = 0; i < slots.length; i++) {
          if (lineCoversSlot(chosen, d, slots[i])) {
            counts[i]++;
            if (slotShort[i] > 0) {
              slotShort[i]--;
              totalShort--;
            }
          }
        }
      }
    });
  });
}

export function generateFunctionAssignments(opts) {
  opts = opts || {};
  var fc = opts.fromGenerate ? ensureFunctionCoverage() : (readFunctionBandsFromDom() || ensureFunctionCoverage());
  if (!api.state.issues) api.state.issues = [];
  capFunctionPoolsToFte(fc, api.state.issues);
  api.state.functionRotation = {};
  (api.state.lines || []).forEach(function (l) {
    if (l.isExtra || l.extraPositionId) return;
    l.function = "";
    l.functionEligible = { dfo: false, bag: false, pax: false };
  });
  if (!api.state.lines || !api.state.lines.length) {
    paintAfterAssign();
    if (!opts.fromGenerate && api.updateStatus) api.updateStatus("Generate lines first.");
    return;
  }
  var poolStats = buildCertifiedPools(fc);
  var days = (api.state.weekCount || 1) * 7;
  var bagFillCount = {};
  (api.state.lines || []).forEach(function (l) {
    if (!ensureEligible(l).bag) return;
    l.function = "BAG";
    for (var d = 0; d < days; d++) if (worksDay(l, d)) setDuty(l.id, d, "BAG");
  });
  (api.state.lines || []).forEach(function (l) {
    if (ensureEligible(l).bag) return;
    if (ensureEligible(l).dfo) l.function = "DFO";
  });
  for (var d = 0; d < days; d++) fillBandShortfalls(d, fc, bagFillCount);
  (api.state.lines || []).forEach(function (l) {
    if (l.isExtra || l.extraPositionId) return;
    if (ensureEligible(l).bag) return;
    if (ensureEligible(l).dfo) {
      for (var di = 0; di < days; di++) {
        if (!worksDay(l, di)) continue;
        if (!getDuty(l.id, di)) setDuty(l.id, di, "PAX");
      }
      return;
    }
    ensureEligible(l).pax = true;
    l.function = "PAX";
    for (var dj = 0; dj < days; dj++) if (worksDay(l, dj)) setDuty(l.id, dj, "PAX");
  });
  var shortfalls = [];
  for (var d2 = 0; d2 < Math.min(7, days); d2++) {
    (fc.bands || []).forEach(function (band) {
      var miss = [];
      [["STSO", band.stsoMin || 0], ["LTSO", band.ltsoMin || 0], ["TSO", band.tsoMin || 0]].forEach(function (pair) {
        var role = pair[0], need = pair[1];
        if (need <= 0) return;
        var have = worstBagCoverage(d2, band, role);
        if (have < need) miss.push(role + " " + have + "/" + need);
      });
      if (miss.length) shortfalls.push((api.DAYS[d2 % 7] || d2) + " " + band.start + "-" + band.end + ": " + miss.join(", "));
    });
  }
  if (shortfalls.length) {
    shortfalls.slice(0, 10).forEach(function (msg) { api.state.issues.push("Baggage band short: " + msg); });
    if (api.renderIssues) api.renderIssues();
  }
  paintAfterAssign();
  var msg = "BAG " + (poolStats.bag.stso.total + poolStats.bag.ltso.total + poolStats.bag.tso.total) +
    " \u00b7 DFO " + (poolStats.stso.total + poolStats.ltso.total + poolStats.tso.total) + " \u00b7 leftover PAX";
  if (shortfalls.length) msg += " \u00b7 SHORT " + shortfalls.length + " day/band(s)";
  var hint = api.$("cert-assign-hint"); if (hint) hint.textContent = msg;
  if (!opts.fromGenerate && api.updateStatus) api.updateStatus(msg);
  if (!opts.fromGenerate) closeFunctionCoverageModal();
}
