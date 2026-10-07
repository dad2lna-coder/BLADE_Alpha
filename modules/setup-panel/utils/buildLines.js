/** Turn allocated headcounts into bid lines. */
import { assignRdoDays } from "./shiftMath.js";
import { placedRdosOk, normalizeRdoPins } from "./rdoBlock.js";

function dutySpread(counts) {
  var lo = counts[0], hi = counts[0];
  for (var i = 1; i < 7; i++) {
    if (counts[i] < lo) lo = counts[i];
    if (counts[i] > hi) hi = counts[i];
  }
  return hi - lo;
}

function addDutyDays(counts, rdoDays) {
  var next = counts.slice();
  var off = {};
  (rdoDays || []).forEach(function (d) { off[Number(d)] = true; });
  for (var d = 0; d < 7; d++) if (!off[d]) next[d]++;
  return next;
}

/** Try the seed and the next six. Lowest score wins. Seed wins only when scores still tie. */
function pickBalancedRdos(S, def, rdoCount, seed, avoid, scoreOf) {
  var best = null;
  var bestScore = Infinity;
  var bestK = 99;
  var lastFail = null;
  for (var k = 0; k < 7; k++) {
    var placed = assignRdoDays(
      S,
      def,
      rdoCount,
      (seed + k) % 7,
      avoid ? { avoidDays: avoid } : undefined
    );
    if (!placedRdosOk(placed)) { lastFail = placed; continue; }
    var score = scoreOf(placed.rdoDays);
    if (score < bestScore || (score === bestScore && k < bestK)) {
      best = placed;
      bestScore = score;
      bestK = k;
    }
  }
  return best || lastFail;
}

function hourGrid(S, shifts) {
  if (!S || typeof S.shiftCoversSlot !== "function" || typeof S.timeToMin !== "function") return null;
  if (!S.state || !S.state.open || !S.state.close) return null;
  var openMin = S.timeToMin(S.state.open);
  var closeMin = S.timeToMin(S.state.close);
  if (!(closeMin > openMin)) return null;
  var slots = [];
  for (var t = openMin; t < closeMin; t += 30) slots.push(t);
  var coverable = [];
  for (var i = 0; i < slots.length; i++) {
    var hit = false;
    for (var s = 0; s < shifts.length; s++) {
      if (S.shiftCoversSlot(shifts[s].id, slots[i])) { hit = true; break; }
    }
    coverable.push(hit);
  }
  if (!coverable.some(function (h) { return h; })) return null;
  var grid = [];
  for (var d = 0; d < 7; d++) {
    grid[d] = [];
    for (var j = 0; j < slots.length; j++) grid[d][j] = 0;
  }
  return { slots: slots, coverable: coverable, grid: grid };
}

function paintHourGrid(S, hg, shiftId, rdoDays, sign) {
  var off = {};
  (rdoDays || []).forEach(function (d) { off[Number(d)] = true; });
  for (var d = 0; d < 7; d++) {
    if (off[d]) continue;
    for (var i = 0; i < hg.slots.length; i++) {
      if (!hg.coverable[i]) continue;
      if (S.shiftCoversSlot(shiftId, hg.slots[i], d)) hg.grid[d][i] += sign;
    }
  }
}

function hourSpread(hg, shiftId, covers) {
  var lo = Infinity, hi = -Infinity;
  for (var d = 0; d < 7; d++) {
    for (var i = 0; i < hg.slots.length; i++) {
      if (!hg.coverable[i]) continue;
      if (shiftId && covers && !covers(shiftId, hg.slots[i])) continue;
      var v = hg.grid[d][i];
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
  }
  if (lo === Infinity) return 0;
  return hi - lo;
}

export function createPRNG(seed) {
  var s = (seed >>> 0) || 1;
  return function () {
    var t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle(arr, prng) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(prng() * (i + 1));
    var tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
}

export function getBandKey(S, shiftId) {
  var shifts = (S && S.state && S.state.shifts) || [];
  var shift = shifts.find(function (s) { return s.id === shiftId; });
  if (!shift) return shiftId || "default";
  if (shift.crewGroupId) return "crew_" + shift.crewGroupId;
  var groups = (S && S.state && S.state.shiftCrewGroups) || [];
  var group = groups.find(function (g) { return g.shiftIds && g.shiftIds.indexOf(shiftId) !== -1; });
  if (group) return "crew_" + group.id;
  return shiftId;
}

function takeFromPools(S, pools, preferLongFt, placed, preferPt) {
  placed = placed || { M: 0, F: 0 };
  function take(emp, sex) {
    var key = emp + sex;
    if (pools[key] > 0) { pools[key]--; return { empClass: emp, sex: sex }; }
    return null;
  }
  var startM = (S.state.ftM || 0) + (S.state.ptM || 0);
  var startF = (S.state.ftF || 0) + (S.state.ptF || 0);
  var startT = startM + startF;
  var targetFShare = startT > 0 ? startF / startT : 0.5;
  function pickSex(emp) {
    var mLeft = pools[emp + "M"] || 0, fLeft = pools[emp + "F"] || 0;
    if (mLeft <= 0 && fLeft <= 0) return null;
    if (mLeft <= 0) return take(emp, "F");
    if (fLeft <= 0) return take(emp, "M");
    var placedT = placed.M + placed.F;
    if (placedT === 0) return targetFShare >= 0.5 ? take(emp, "F") : take(emp, "M");
    var currentFShare = placed.F / placedT;
    if (currentFShare < targetFShare - 0.02) return take(emp, "F");
    if (currentFShare > targetFShare + 0.02) return take(emp, "M");
    return mLeft >= fLeft ? take(emp, "M") : take(emp, "F");
  }
  if (preferLongFt) return pickSex("FT");
  if (preferPt) return pickSex("PT") || pickSex("FT");
  var ftLeft = (pools.FTM || 0) + (pools.FTF || 0);
  var ptLeft = (pools.PTM || 0) + (pools.PTF || 0);
  if (ftLeft > 0) return pickSex("FT");
  if (ptLeft > 0) return pickSex("PT");
  return null;
}

function noteRejectedRdos(S, placed, label, seen) {
  if (!S.state) return;
  if (!Array.isArray(S.state.issues)) S.state.issues = [];
  var why = (placed && placed.error) || "RDO block does not fit";
  var msg = label + ": " + why + ".";
  if (seen[msg]) return;
  seen[msg] = true;
  S.state.issues.push(msg);
}

function makeLineFromPerson(S, def, person, id) {
  var workDays = S.targetWorkDays(def.id, person.empClass);
  var rdoCount = 7 - workDays;
  var seed = (id - 1) % 7;
  var placed = assignRdoDays(S, def, rdoCount, seed);
  if (!placedRdosOk(placed)) return null;
  return {
    id: id,
    lineCode: "Line " + String(id).padStart(3, "0"),
    shiftId: def.id,
    shiftName: def.name,
    shiftLabel: S.shiftLabel(def),
    empClass: person.empClass,
    sex: person.sex,
    function: "",
    rdoDays: placed.rdoDays,
    rdoHard: placed.hard,
    paid: person.empClass === "PT"
      ? (function () {
          var hours = +(S.state && S.state.ptHoursPerDay);
          return Number.isFinite(hours) && hours > 0 ? Math.min(12, hours) : 4;
        })()
      : (def.paid || 8)
  };
}

export function buildLines(S, counts) {
  var pools = { FTM: S.state.ftM || 0, FTF: S.state.ftF || 0, PTM: S.state.ptM || 0, PTF: S.state.ptF || 0 };
  var placedGlobal = { M: 0, F: 0 };
  var shifts = S.state.shifts || [];
  var order = [];
  shifts.forEach(function (def) {
    var need = counts[def.id] || 0;
    if (need > 0 && (def.force || 0) > 0) order.push(def);
  });
  shifts.forEach(function (def) {
    var need = counts[def.id] || 0;
    if (need > 0 && !(def.force > 0)) order.push(def);
  });

  var hasActiveSeed = S.state && typeof S.state.activeSeed === "number";
  var prng = hasActiveSeed ? createPRNG(S.state.activeSeed + 500) : null;

  // Collect line slots per shift
  var slots = [];
  order.forEach(function (def) {
    var need = counts[def.id] || 0;
    var bandKey = getBandKey(S, def.id);
    var isLong = (+def.paid || 8) >= 10;
    for (var i = 0; i < need; i++) {
      slots.push({
        def: def,
        bandKey: bandKey,
        isLong: isLong,
        shiftIndex: i
      });
    }
  });

  // Group slots by bandKey
  var bands = {};
  slots.forEach(function (slot) {
    if (!bands[slot.bandKey]) bands[slot.bandKey] = [];
    bands[slot.bandKey].push(slot);
  });

  // Pass 1: Assign RDO seeds round-robin within each role x bandKey using seeded offset
  Object.keys(bands).forEach(function (bk) {
    var bSlots = bands[bk];
    var seedOffset = prng ? Math.floor(prng() * 7) : 0;
    var seedIdx = seedOffset;
    bSlots.forEach(function (slot) {
      slot.rdoSeed = seedIdx % 7;
      seedIdx++;
    });
  });

  // Pass 2: Assign sex and empClass (FT/PT) from pools onto slots across bands
  var remainingNonLongSeats = 0;
  slots.forEach(function (slot) {
    if (!slot.isLong) remainingNonLongSeats++;
  });

  var lines = [], id = 1;
  var rdoRejects = {};
  var hourCov = hourGrid(S, shifts);

  // Interleave slots by RDO seeds within each band using seeded bucket shuffle
  Object.keys(bands).forEach(function (bk) {
    var bSlots = bands[bk];
    var seedBuckets = {};
    bSlots.forEach(function (s) {
      var k = s.rdoSeed;
      if (!seedBuckets[k]) seedBuckets[k] = [];
      seedBuckets[k].push(s);
    });

    var maxLen = 0;
    Object.keys(seedBuckets).forEach(function (k) {
      if (seedBuckets[k].length > maxLen) maxLen = seedBuckets[k].length;
    });

    var seedOrder = prng ? seededShuffle([0, 1, 2, 3, 4, 5, 6], prng) : [0, 1, 2, 3, 4, 5, 6];
    var orderedSlots = [];
    for (var i = 0; i < maxLen; i++) {
      for (var sIdx = 0; sIdx < 7; sIdx++) {
        var s = seedOrder[sIdx];
        if (seedBuckets[s] && seedBuckets[s][i]) {
          orderedSlots.push(seedBuckets[s][i]);
        }
      }
    }

    // Calculate PT quota for this band fill across non-long seats
    var fillNeed = 0;
    orderedSlots.forEach(function (s) {
      if (!s.isLong) fillNeed++;
    });
    var ptLeft = (pools.PTM || 0) + (pools.PTF || 0);
    var ptQuota = 0;
    if (fillNeed > 0 && remainingNonLongSeats > 0 && ptLeft > 0) {
      ptQuota = Math.round((fillNeed * ptLeft) / remainingNonLongSeats);
      ptQuota = Math.max(0, Math.min(fillNeed, Math.min(ptLeft, ptQuota)));
    }
    var ptPlacedInFill = 0;

    // Assign people to orderedSlots
    orderedSlots.forEach(function (slot) {
      var def = slot.def;
      var isLong = slot.isLong;
      var preferPt = false;
      if (!isLong) {
        preferPt = ptPlacedInFill < ptQuota;
      }
      var person = takeFromPools(S, pools, isLong, placedGlobal, preferPt);
      if (!person) {
        S.state.issues.push(def.name + ": pool empty or 4x10 needs FT.");
        if (!isLong) {
          remainingNonLongSeats = Math.max(0, remainingNonLongSeats - 1);
        }
        return;
      }
      if (!isLong) {
        if (person.empClass === "PT") {
          ptPlacedInFill++;
        }
        remainingNonLongSeats = Math.max(0, remainingNonLongSeats - 1);
      }
      placedGlobal[person.sex]++;
      slot.person = person;

      // Compute correct workDays and rdoDays based on assigned empClass (FT vs PT)
      var workDays = S.targetWorkDays(slot.def.id, person.empClass);
      var rdoCount = 7 - workDays;
      var placed = hourCov
        ? pickBalancedRdos(S, slot.def, rdoCount, slot.rdoSeed, null, function (rdoDays) {
            paintHourGrid(S, hourCov, slot.def.id, rdoDays, 1);
            var spread = hourSpread(hourCov, slot.def.id, S.shiftCoversSlot);
            paintHourGrid(S, hourCov, slot.def.id, rdoDays, -1);
            return spread;
          })
        : assignRdoDays(S, slot.def, rdoCount, slot.rdoSeed);
      if (!placedRdosOk(placed)) {
        noteRejectedRdos(S, placed, def.name || def.id || "shift", rdoRejects);
        slot.person = null;
        return;
      }
      slot.rdoDays = placed.rdoDays;
      slot.rdoHard = placed.hard;
      if (hourCov) paintHourGrid(S, hourCov, slot.def.id, placed.rdoDays, 1);
    });
  });

  // Build final lines array in slot order
  slots.forEach(function (slot) {
    if (!slot.person) return;
    if (!slot.rdoDays || !slot.rdoDays.length) return;
    lines.push({
      id: id,
      lineCode: "Line " + String(id).padStart(3, "0"),
      shiftId: slot.def.id,
      shiftName: slot.def.name,
      shiftLabel: S.shiftLabel(slot.def),
      empClass: slot.person.empClass,
      sex: slot.person.sex,
      function: "",
      rdoDays: slot.rdoDays,
      rdoHard: slot.rdoHard,
      paid: slot.person.empClass === "PT"
        ? (function () {
            var hours = +(S.state && S.state.ptHoursPerDay);
            return Number.isFinite(hours) && hours > 0 ? Math.min(12, hours) : 4;
          })()
        : (slot.def.paid || 8)
    });
    id++;
  });

  return lines;
}

function takeSupervisoryFromPools(pools, targetFShare, placed, preferSex) {
  placed = placed || { M: 0, F: 0 };
  function take(sex) {
    if (pools[sex] > 0) { pools[sex]--; return sex; }
    return null;
  }
  if (preferSex === "M" || preferSex === "F") {
    var preferred = take(preferSex);
    if (preferred) return preferred;
  }
  if (pools.M <= 0 && pools.F <= 0) return null;
  if (pools.M <= 0) return take("F");
  if (pools.F <= 0) return take("M");
  var placedT = placed.M + placed.F;
  if (placedT === 0) return targetFShare >= 0.5 ? take("F") : take("M");
  var currentFShare = placed.F / placedT;
  if (currentFShare < targetFShare - 0.02) return take("F");
  if (currentFShare > targetFShare + 0.02) return take("M");
  return pools.M >= pools.F ? take("M") : take("F");
}

function pairKeyOf(rdoDays, pins) {
  var pin = {};
  (pins || []).forEach(function (d) { pin[Number(d)] = true; });
  var extra = [];
  (rdoDays || []).forEach(function (d) {
    var n = Number(d);
    if (!pin[n]) extra.push(n);
  });
  if (!extra.length) (rdoDays || []).forEach(function (d) { extra.push(Number(d)); });
  extra.sort(function (a, b) { return a - b; });
  return extra.join("-");
}

function femaleGapCount(femaleOn, rdoDays, pins) {
  var off = {};
  (rdoDays || []).forEach(function (d) { off[Number(d)] = true; });
  var pin = {};
  (pins || []).forEach(function (d) { pin[Number(d)] = true; });
  var gaps = 0;
  for (var d = 0; d < 7; d++) {
    if (pin[d]) continue;
    var on = femaleOn[d] || 0;
    if (!off[d]) on += 1;
    if (on < 1) gaps++;
  }
  return gaps;
}

export function buildSupervisoryLines(S, supCounts, supType, opts) {
  var isLtso = supType === "LTSO";
  var partners = (opts && opts.partners) || [];
  var pools = {
    M: isLtso ? (S.state.ltsoM || 0) : (S.state.stsoM || 0),
    F: isLtso ? (S.state.ltsoF || 0) : (S.state.stsoF || 0)
  };
  var totalM = pools.M;
  var totalF = pools.F;
  var totalSup = totalM + totalF;
  var targetFShare = totalSup > 0 ? totalF / totalSup : 0.5;
  var placedGlobal = { M: 0, F: 0 };
  var forceField = isLtso ? "ltsoForce" : "stsoForce";

  var hasActiveSeed = S.state && typeof S.state.activeSeed === "number";
  var prng = hasActiveSeed ? createPRNG(S.state.activeSeed + (isLtso ? 2000 : 1000)) : null;

  var shifts = S.state.shifts || [];
  var order = [];
  shifts.forEach(function (def) {
    var need = supCounts[def.id] || 0;
    if (need > 0 && (def[forceField] || 0) > 0) order.push(def);
  });
  shifts.forEach(function (def) {
    var need = supCounts[def.id] || 0;
    if (need > 0 && !(def[forceField] > 0)) order.push(def);
  });

  // Collect slots
  var slots = [];
  order.forEach(function (def) {
    var need = supCounts[def.id] || 0;
    var bandKey = getBandKey(S, def.id);
    for (var i = 0; i < need; i++) {
      slots.push({
        def: def,
        bandKey: bandKey
      });
    }
  });

  // Partition by bandKey
  var bands = {};
  slots.forEach(function (slot) {
    if (!bands[slot.bandKey]) bands[slot.bandKey] = [];
    bands[slot.bandKey].push(slot);
  });

  // Seeds first so sex can be chosen before RDO windows. Window choice needs sex.
  Object.keys(bands).forEach(function (bk) {
    var bSlots = bands[bk];
    var seedOffset = prng ? Math.floor(prng() * 7) : 0;
    var seedIdx = seedOffset;
    bSlots.forEach(function (slot) {
      slot.rdoSeed = seedIdx % 7;
      seedIdx++;
    });
  });

  // Pass 1: sex from M/F pools. LTSO prefers the opposite STSO sex on that shift.
  // That roster preference does not place calendar days.
  Object.keys(bands).forEach(function (bk) {
    var bSlots = bands[bk];
    var seedBuckets = {};
    bSlots.forEach(function (s) {
      var k = s.rdoSeed;
      if (!seedBuckets[k]) seedBuckets[k] = [];
      seedBuckets[k].push(s);
    });

    var maxLen = 0;
    Object.keys(seedBuckets).forEach(function (k) {
      if (seedBuckets[k].length > maxLen) maxLen = seedBuckets[k].length;
    });

    var seedOrder = prng ? seededShuffle([0, 1, 2, 3, 4, 5, 6], prng) : [0, 1, 2, 3, 4, 5, 6];
    var orderedSlots = [];
    for (var i = 0; i < maxLen; i++) {
      for (var sIdx = 0; sIdx < 7; sIdx++) {
        var s = seedOrder[sIdx];
        if (seedBuckets[s] && seedBuckets[s][i]) {
          orderedSlots.push(seedBuckets[s][i]);
        }
      }
    }

    var ltsoSexOnShift = {};
    orderedSlots.forEach(function (slot) {
      var prefer = null;
      if (isLtso && partners.length) {
        var mates = partners.filter(function (l) { return l && l.shiftId === slot.def.id; });
        var mStso = 0, fStso = 0;
        mates.forEach(function (l) {
          if (l.sex === "F") fStso++;
          else if (l.sex === "M") mStso++;
        });
        var have = ltsoSexOnShift[slot.def.id] || { M: 0, F: 0 };
        var wantF = mStso - have.F;
        var wantM = fStso - have.M;
        if (wantF > wantM && pools.F > 0) prefer = "F";
        else if (wantM > wantF && pools.M > 0) prefer = "M";
        else if (wantF > 0 && pools.F > 0 && wantM <= 0) prefer = "F";
        else if (wantM > 0 && pools.M > 0 && wantF <= 0) prefer = "M";
      }
      var sex = takeSupervisoryFromPools(pools, targetFShare, placedGlobal, prefer);
      if (!sex) {
        S.state.issues.push(slot.def.name + ": " + supType + " pool empty.");
        return;
      }
      placedGlobal[sex]++;
      slot.sex = sex;
      if (isLtso) {
        if (!ltsoSexOnShift[slot.def.id]) ltsoSexOnShift[slot.def.id] = { M: 0, F: 0 };
        ltsoSexOnShift[slot.def.id][sex]++;
      }
    });
  });

  // Pass 2: RDO windows. Flatten this class's on-duty counts, then
  // penalize a weekday pair already used by this class or by STSO partners.
  // Female lines also cover non-pin days that no female STSO/LTSO is working.
  // The pin may stay empty. STSO pin blocks still share only the pin.
  var rdoRejects = {};
  var stsoTaken = [];
  var duty = [0, 0, 0, 0, 0, 0, 0];
  var pairUse = {};
  var femaleOn = [0, 0, 0, 0, 0, 0, 0];
  var shiftById = {};
  shifts.forEach(function (def) { shiftById[def.id] = def; });
  partners.forEach(function (p) {
    if (!p || !p.rdoDays || !p.rdoDays.length) return;
    var sh = shiftById[p.shiftId];
    var pins = sh ? normalizeRdoPins(sh) : [];
    var key = pairKeyOf(p.rdoDays, pins);
    if (key) pairUse[key] = (pairUse[key] || 0) + 1;
    if (p.sex === "F") {
      var off = {};
      p.rdoDays.forEach(function (d) { off[Number(d)] = true; });
      for (var d = 0; d < 7; d++) if (!off[d]) femaleOn[d]++;
    }
  });

  var rdoSlots = [];
  slots.forEach(function (slot) { if (slot.sex) rdoSlots.push(slot); });
  rdoSlots.sort(function (a, b) {
    if (a.sex === b.sex) return 0;
    return a.sex === "F" ? -1 : 1;
  });

  rdoSlots.forEach(function (slot) {
    var workDays = (+slot.def.paid || 8) >= 10 ? 4 : 5;
    var rdoCount = 7 - workDays;
    var pins = normalizeRdoPins(slot.def);
    var exclusive = !isLtso && pins.length > 0;
    var placed = pickBalancedRdos(
      S,
      slot.def,
      rdoCount,
      slot.rdoSeed,
      exclusive ? stsoTaken : null,
      function (rdoDays) {
        var gaps = slot.sex === "F" ? femaleGapCount(femaleOn, rdoDays, pins) : 0;
        var spread = dutySpread(addDutyDays(duty, rdoDays));
        var reuse = pairUse[pairKeyOf(rdoDays, pins)] || 0;
        return gaps * 1000 + spread * 10 + reuse;
      }
    );
    if (!placedRdosOk(placed)) {
      noteRejectedRdos(S, placed, slot.def.name || slot.def.id || "shift", rdoRejects);
      slot.rdoDays = null;
      return;
    }
    slot.rdoDays = placed.rdoDays;
    slot.rdoHard = placed.hard;
    duty = addDutyDays(duty, placed.rdoDays);
    var won = pairKeyOf(placed.rdoDays, pins);
    if (won) pairUse[won] = (pairUse[won] || 0) + 1;
    if (slot.sex === "F") {
      var wonOff = {};
      placed.rdoDays.forEach(function (d) { wonOff[Number(d)] = true; });
      for (var d = 0; d < 7; d++) if (!wonOff[d]) femaleOn[d]++;
    }
    if (!isLtso) {
      placed.rdoDays.forEach(function (d) {
        if (stsoTaken.indexOf(d) < 0) stsoTaken.push(d);
      });
    }
  });

  // Build lines
  var lines = [];
  var startId = isLtso ? 20000 : 10000;
  var id = startId;

  slots.forEach(function (slot) {
    if (!slot.sex) return;
    if (!slot.rdoDays || !slot.rdoDays.length) return;
    lines.push({
      id: id,
      lineCode: supType + " " + String(lines.length + 1).padStart(2, "0"),
      shiftId: slot.def.id,
      shiftName: slot.def.name,
      shiftLabel: S.shiftLabel(slot.def),
      empClass: supType,
      position: supType,
      isLtso: isLtso,
      isStso: !isLtso,
      sex: slot.sex,
      function: "",
      rdoDays: slot.rdoDays,
      rdoHard: slot.rdoHard,
      paid: slot.def.paid || 8
    });
    id++;
  });

  return lines;
}
