let api = null;

import { normalizeRequirements, openingAndClosingShifts, lineOnShift } from "./shifts.js";
import { migrateFunctionCoverageConfig } from "./migrate.js";

export function bindPoolsApi(scheduler) {
  api = scheduler;
}

// Local helper (classic equivalent, not exported)
function num0(v) { return Math.max(0, Math.floor(+v || 0)); }

// Exported: bag pool total from classic
export function bagPoolTotal(fc) {
  return num0(fc.poolStsoBagM) + num0(fc.poolStsoBagF) + num0(fc.poolLtsoBagM) + num0(fc.poolLtsoBagF) +
    num0(fc.poolTsoBagM) + num0(fc.poolTsoBagF);
}

// Exported: dfo pool total from classic
export function dfoPoolTotal(fc) {
  return num0(fc.poolStsoDfoM) + num0(fc.poolStsoDfoF) + num0(fc.poolLtsoDfoM) + num0(fc.poolLtsoDfoF) +
    num0(fc.poolTsoDfoM) + num0(fc.poolTsoDfoF);
}

// Exported: initialize function coverage state from api.state
export function ensureFunctionCoverage() {
  if (!api.state.functionCoverage) api.state.functionCoverage = {};
  var fc = api.state.functionCoverage;
  ["poolStsoDfoM","poolStsoDfoF","poolLtsoDfoM","poolLtsoDfoF","poolTsoDfoM","poolTsoDfoF",
   "poolStsoBagM","poolStsoBagF","poolLtsoBagM","poolLtsoBagF","poolTsoBagM","poolTsoBagF"].forEach(function (k) {
    if (fc[k] == null) fc[k] = 0;
  });
  if (fc.poolStsoDfo == null) fc.poolStsoDfo = num0(fc.poolStsoDfoM) + num0(fc.poolStsoDfoF);
  if (fc.poolLtsoDfo == null) fc.poolLtsoDfo = num0(fc.poolLtsoDfoM) + num0(fc.poolLtsoDfoF);
  if (fc.poolTsoDfo == null) fc.poolTsoDfo = num0(fc.poolTsoDfoM) + num0(fc.poolTsoDfoF);
  if (fc.poolBag == null) fc.poolBag = bagPoolTotal(fc);
  if (!fc.poolStsoDfoM && !fc.poolStsoDfoF && fc.poolStsoDfo) fc.poolStsoDfoM = fc.poolStsoDfo;
  if (!fc.poolLtsoDfoM && !fc.poolLtsoDfoF && fc.poolLtsoDfo) fc.poolLtsoDfoM = fc.poolLtsoDfo;
  if (!fc.poolTsoDfoM && !fc.poolTsoDfoF && fc.poolTsoDfo) fc.poolTsoDfoM = fc.poolTsoDfo;
  if (!fc.poolTsoBagM && !fc.poolTsoBagF && fc.poolBag) fc.poolTsoBagM = fc.poolBag;
  if (fc.amPmSplit == null) fc.amPmSplit = true;
  if (fc.phaseThresholdMin == null) fc.phaseThresholdMin = 15;
  if (fc.bias == null) fc.bias = "none";
  if (!api.state.functionRotation) api.state.functionRotation = {};

  if (Array.isArray(fc.bands) && fc.bands.length && !fc._bandMigrationAttempted) {
    fc._bandMigrationAttempted = true;
    migrateFunctionCoverageConfig(fc, {
      shifts: (api.state && api.state.shifts) || [],
      issues: api.state && api.state.issues
    });
  }

  fc.requirements = normalizeRequirements(fc.requirements);
  if (!Array.isArray(fc.requirementShiftIds)) fc.requirementShiftIds = [];
  if (!fc.requirementShiftIds.length) {
    ["STSO", "LTSO", "TSO"].forEach(function (role) {
      Object.keys(fc.requirements[role] || {}).forEach(function (id) {
        if (fc.requirementShiftIds.indexOf(id) < 0) fc.requirementShiftIds.push(id);
      });
    });
  }

  delete fc.stsoIsDfo; delete fc.poolDfo; delete fc.poolPax;
  syncDerivedMode(fc);
  return fc;
}

// Exported: derive mode from ensured coverage
export function getFunctionMode() {
  return syncDerivedMode(ensureFunctionCoverage());
}

// Exported: FTE caps by role/sex from scheduler state
export function fteCapsByRoleSex() {
  var st = api.state || {};
  return {
    STSO: { M: num0(st.stsoM), F: num0(st.stsoF) },
    LTSO: { M: num0(st.ltsoM), F: num0(st.ltsoF) },
    TSO: { M: num0(st.ftM) + num0(st.ptM), F: num0(st.ftF) + num0(st.ptF) }
  };
}

// Exported: cap function pools to FTE from classic
export function capFunctionPoolsToFte(fc, issues) {
  fc = fc || ensureFunctionCoverage();
  var caps = fteCapsByRoleSex();
  function capPair(role, bagMKey, bagFKey, dfoMKey, dfoFKey) {
    var capM = caps[role].M, capF = caps[role].F;
    var reqBagM = num0(fc[bagMKey]), reqBagF = num0(fc[bagFKey]);
    var reqDfoM = num0(fc[dfoMKey]), reqDfoF = num0(fc[dfoFKey]);
    if (reqBagM > capM) { if (issues) issues.push("BAG " + role + " M pool " + reqBagM + " exceeds FTE " + capM + " — capped."); reqBagM = capM; }
    if (reqBagF > capF) { if (issues) issues.push("BAG " + role + " F pool " + reqBagF + " exceeds FTE " + capF + " — capped."); reqBagF = capF; }
    var remM = Math.max(0, capM - reqBagM), remF = Math.max(0, capF - reqBagF);
    if (reqDfoM > remM) { if (issues) issues.push("DFO " + role + " M pool " + reqDfoM + " exceeds remaining FTE " + remM + " after BAG — capped."); reqDfoM = remM; }
    if (reqDfoF > remF) { if (issues) issues.push("DFO " + role + " F pool " + reqDfoF + " exceeds remaining FTE " + remF + " after BAG — capped."); reqDfoF = remF; }
    fc[bagMKey] = reqBagM; fc[bagFKey] = reqBagF; fc[dfoMKey] = reqDfoM; fc[dfoFKey] = reqDfoF;
  }
  capPair("STSO", "poolStsoBagM", "poolStsoBagF", "poolStsoDfoM", "poolStsoDfoF");
  capPair("LTSO", "poolLtsoBagM", "poolLtsoBagF", "poolLtsoDfoM", "poolLtsoDfoF");
  capPair("TSO", "poolTsoBagM", "poolTsoBagF", "poolTsoDfoM", "poolTsoDfoF");
  syncDerivedMode(fc);
  return fc;
}

// Exported: sync derived mode (used by ensureFunctionCoverage and getFunctionMode)
function syncDerivedMode(fc) {
  var bag = bagPoolTotal(fc) > 0, dfo = dfoPoolTotal(fc) > 0;
  fc.poolBag = bagPoolTotal(fc);
  fc.poolStsoDfo = num0(fc.poolStsoDfoM) + num0(fc.poolStsoDfoF);
  fc.poolLtsoDfo = num0(fc.poolLtsoDfoM) + num0(fc.poolLtsoDfoF);
  fc.poolTsoDfo = num0(fc.poolTsoDfoM) + num0(fc.poolTsoDfoF);
  fc.mode = bag && dfo ? "both" : bag ? "bag" : dfo ? "dfo" : "none";
  return fc;
}

// Exported: build certified pools from classic js/functions.js
export function buildCertifiedPools(fc) {
  fc = fc || ensureFunctionCoverage();
  var lines = api.state.lines || [];
  lines.forEach(function (l) {
    if (l.isExtra || l.extraPositionId) return;
    l.functionEligible = { dfo: false, bag: false, pax: false };
    l.function = "";
  });
  var anchors = api.computeShiftAnchors();
  var thr = fc.phaseThresholdMin || 15;
  var oc = openingAndClosingShifts();

  function ensureEligible(line) {
    if (!line.functionEligible || typeof line.functionEligible !== "object") line.functionEligible = { dfo: false, bag: false, pax: false };
    return line.functionEligible;
  }

  function unused(role, sex) {
    return lines.filter(function (l) {
      if (l.isExtra || l.extraPositionId) return false;
      var el = ensureEligible(l);
      return api.lineRoleKey(l) === role && l.sex === sex && !el.bag && !el.dfo;
    });
  }

  function markBag(role, sex, n) {
    if (!n || n <= 0) return { total: 0 };
    var pool = unused(role, sex).slice();
    pool.sort(function (a, b) { return api.lineStartMin(a) - api.lineStartMin(b) || String(a.id).localeCompare(String(b.id)); });
    var taken = 0;
    for (var i = 0; i < pool.length && taken < n; i++) { ensureEligible(pool[i]).bag = true; taken++; }
    return { total: taken };
  }

  function markDfo(role, sex, n) {
    if (!n || n <= 0) return { am: 0, pm: 0, total: 0 };
    var pool = unused(role, sex).slice();
    pool.sort(function (a, b) { return api.lineStartMin(a) - api.lineStartMin(b) || String(a.id).localeCompare(String(b.id)); });
    var amSide = pool.filter(function (l) { return api.isAmSide(api.lineStartMin(l), anchors, thr); });
    var pmSide = pool.filter(function (l) { return !api.isAmSide(api.lineStartMin(l), anchors, thr); });
    amSide.sort(function (a, b) {
      var aOpen = lineOnShift(a, oc.open) ? 0 : 1;
      var bOpen = lineOnShift(b, oc.open) ? 0 : 1;
      if (aOpen !== bOpen) return aOpen - bOpen;
      return api.lineStartMin(a) - api.lineStartMin(b) || String(a.id).localeCompare(String(b.id));
    });
    pmSide.sort(function (a, b) {
      var aClose = lineOnShift(a, oc.close) ? 0 : 1;
      var bClose = lineOnShift(b, oc.close) ? 0 : 1;
      if (aClose !== bClose) return aClose - bClose;
      return api.lineStartMin(a) - api.lineStartMin(b) || String(a.id).localeCompare(String(b.id));
    });
    var needAm = fc.amPmSplit ? Math.ceil(n / 2) : n;
    var needPm = fc.amPmSplit ? Math.floor(n / 2) : 0;
    if (amSide.length < needAm) { needPm += needAm - amSide.length; needAm = amSide.length; }
    if (pmSide.length < needPm) { needAm = Math.min(amSide.length, needAm + (needPm - pmSide.length)); needPm = pmSide.length; }
    while (needAm + needPm > n) { if (needPm >= needAm && needPm > 0) needPm--; else if (needAm > 0) needAm--; else break; }
    function take(arr, count) {
      var taken = 0;
      for (var i = 0; i < arr.length && taken < count; i++) {
        var el = ensureEligible(arr[i]); if (el.bag || el.dfo) continue; el.dfo = true; taken++;
      }
      return taken;
    }
    var gotAm = take(amSide, needAm), gotPm = take(pmSide, needPm), short = n - gotAm - gotPm;
    if (short > 0) gotPm += take(unused(role, sex), short);
    return { am: gotAm, pm: gotPm, total: gotAm + gotPm };
  }

  var bag = {
    stso: { m: markBag("STSO", "M", fc.poolStsoBagM).total, f: markBag("STSO", "F", fc.poolStsoBagF).total },
    ltso: { m: markBag("LTSO", "M", fc.poolLtsoBagM).total, f: markBag("LTSO", "F", fc.poolLtsoBagF).total },
    tso: { m: markBag("TSO", "M", fc.poolTsoBagM).total, f: markBag("TSO", "F", fc.poolTsoBagF).total }
  };
  bag.stso.total = bag.stso.m + bag.stso.f;
  bag.ltso.total = bag.ltso.m + bag.ltso.f;
  bag.tso.total = bag.tso.m + bag.tso.f;
  var dfo = {
    stso: markDfo("STSO", "M", fc.poolStsoDfoM), stsoF: markDfo("STSO", "F", fc.poolStsoDfoF),
    ltso: markDfo("LTSO", "M", fc.poolLtsoDfoM), ltsoF: markDfo("LTSO", "F", fc.poolLtsoDfoF),
    tso: markDfo("TSO", "M", fc.poolTsoDfoM), tsoF: markDfo("TSO", "F", fc.poolTsoDfoF)
  };
  return {
    bag: bag,
    stso: { total: dfo.stso.total + dfo.stsoF.total, am: dfo.stso.am + dfo.stsoF.am, pm: dfo.stso.pm + dfo.stsoF.pm },
    ltso: { total: dfo.ltso.total + dfo.ltsoF.total, am: dfo.ltso.am + dfo.ltsoF.am, pm: dfo.ltso.pm + dfo.ltsoF.pm },
    tso: { total: dfo.tso.total + dfo.tsoF.total, am: dfo.tso.am + dfo.tsoF.am, pm: dfo.tso.pm + dfo.tsoF.pm },
    anchors: anchors
  };
}
