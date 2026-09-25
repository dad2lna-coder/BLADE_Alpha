let api = null;

import { normalizeRequirements, openingAndClosingShifts, lineOnShift, getShiftRequirement } from "./shifts.js";
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

function shiftStartMin(shiftId) {
  var sh = api.getShift ? api.getShift(shiftId) : null;
  if (!sh) return 1e9;
  if (api.timeToMin && sh.start != null) return api.timeToMin(sh.start);
  return 1e9;
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
    var targets = [];
    var seen = {};
    var fromReqs = false;
    var recs = (fc.requirements && fc.requirements[role]) || {};
    Object.keys(recs).forEach(function (id) {
      var req = getShiftRequirement(role, id, fc);
      if (req.min <= 0 && req.max <= 0) return;
      if (typeof api.getShift === "function" && !api.getShift(id)) return;
      var key = String(id);
      if (seen[key]) return;
      seen[key] = true;
      targets.push(key);
      fromReqs = true;
    });
    if (!targets.length) {
      pool.forEach(function (l) {
        if (!l || l.shiftId == null || l.shiftId === "") return;
        var key = String(l.shiftId);
        if (seen[key]) return;
        seen[key] = true;
        targets.push(key);
      });
    }
    targets.sort(function (a, b) {
      var d = shiftStartMin(a) - shiftStartMin(b);
      if (d) return d;
      return String(a).localeCompare(String(b));
    });

    var buckets = {};
    targets.forEach(function (id) { buckets[id] = []; });
    pool.forEach(function (l) {
      var key = l.shiftId != null ? String(l.shiftId) : "";
      if (buckets[key]) buckets[key].push(l);
    });
    function sortLines(arr) {
      arr.sort(function (a, b) {
        return api.lineStartMin(a) - api.lineStartMin(b) || String(a.id).localeCompare(String(b.id));
      });
    }
    targets.forEach(function (id) { sortLines(buckets[id]); });

    var nAlloc = Math.min(n, pool.length);
    var weights = targets.map(function (id) {
      if (!fromReqs) return 1;
      return Math.max(getShiftRequirement(role, id, fc).min, 1);
    });
    var sumW = 0;
    weights.forEach(function (w) { sumW += w; });
    if (!sumW) sumW = 1;

    var quotas = [];
    var fracs = [];
    var assigned = 0;
    targets.forEach(function (id, i) {
      var raw = nAlloc * weights[i] / sumW;
      var q = Math.floor(raw);
      quotas[i] = q;
      assigned += q;
      fracs.push({ i: i, frac: raw - q });
    });
    fracs.sort(function (a, b) {
      if (b.frac !== a.frac) return b.frac - a.frac;
      return a.i - b.i;
    });
    var leftover = nAlloc - assigned;
    for (var fi = 0; fi < fracs.length && leftover > 0; fi++) {
      quotas[fracs[fi].i]++;
      leftover--;
    }

    leftover = 0;
    targets.forEach(function (id, i) {
      var cap = buckets[id].length;
      if (quotas[i] > cap) {
        leftover += quotas[i] - cap;
        quotas[i] = cap;
      }
    });
    while (leftover > 0) {
      var best = -1;
      var bestRem = -1;
      for (var si = 0; si < targets.length; si++) {
        var rem = buckets[targets[si]].length - quotas[si];
        if (rem <= 0) continue;
        if (rem > bestRem) {
          bestRem = rem;
          best = si;
        }
      }
      if (best < 0) break;
      quotas[best]++;
      leftover--;
    }

    var tagged = [];
    targets.forEach(function (id, i) {
      var arr = buckets[id];
      var want = quotas[i];
      for (var j = 0; j < arr.length && tagged.length < n && want > 0; j++) {
        var el = ensureEligible(arr[j]);
        if (el.bag || el.dfo) continue;
        el.dfo = true;
        tagged.push(arr[j]);
        want--;
      }
    });
    if (tagged.length < n) {
      var rest = unused(role, sex).slice();
      sortLines(rest);
      for (var k = 0; k < rest.length && tagged.length < n; k++) {
        var el2 = ensureEligible(rest[k]);
        if (el2.bag || el2.dfo) continue;
        el2.dfo = true;
        tagged.push(rest[k]);
      }
    }

    var gotAm = 0, gotPm = 0;
    tagged.forEach(function (l) {
      if (api.isAmSide(api.lineStartMin(l), anchors, thr)) gotAm++;
      else gotPm++;
    });
    return { am: gotAm, pm: gotPm, total: tagged.length };
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
