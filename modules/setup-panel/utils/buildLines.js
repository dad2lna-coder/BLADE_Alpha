/** Turn allocated headcounts into bid lines. */

function takeFromPools(S, pools, preferLongFt, placed) {
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
  var ftLeft = (pools.FTM || 0) + (pools.FTF || 0);
  var ptLeft = (pools.PTM || 0) + (pools.PTF || 0);
  if (ftLeft > 0) return pickSex("FT");
  if (ptLeft > 0) return pickSex("PT");
  return null;
}

function makeLineFromPerson(S, def, person, id) {
  var workDays = S.targetWorkDays(def.id, person.empClass);
  var rdoCount = 7 - workDays;
  var seed = (id - 1) % 7;
  var hard = Array.isArray(def.rdoHard)
    ? def.rdoHard.map(Number).filter(function (x) { return x >= 0 && x <= 6; })
    : [];
  var rdoDays;
  if (hard.length > 0) {
    rdoDays = hard.slice();
    if (rdoDays.length < rdoCount) {
      for (var d = 0; d < 7 && rdoDays.length < rdoCount; d++) {
        if (rdoDays.indexOf(d) < 0) rdoDays.push(d);
      }
    } else if (rdoDays.length > rdoCount) rdoDays = rdoDays.slice(0, rdoCount);
  } else rdoDays = S.consecutiveRdos(rdoCount, seed);
  return {
    id: id,
    lineCode: "Line " + String(id).padStart(3, "0"),
    shiftId: def.id,
    shiftName: def.name,
    shiftLabel: S.shiftLabel(def),
    empClass: person.empClass,
    sex: person.sex,
    function: "",
    rdoDays: rdoDays,
    rdoHard: hard.length > 0,
    paid: def.paid || 8
  };
}

export function buildLines(S, counts) {
  var lines = [], id = 1;
  var pools = { FTM: S.state.ftM || 0, FTF: S.state.ftF || 0, PTM: S.state.ptM || 0, PTF: S.state.ptF || 0 };
  var placedGlobal = { M: 0, F: 0 };
  function fillShift(def, need) {
    var placed = 0;
    while (placed < need) {
      var isLong = (+def.paid || 8) >= 10;
      var person = takeFromPools(S, pools, isLong, placedGlobal);
      if (!person) break;
      placedGlobal[person.sex]++;
      lines.push(makeLineFromPerson(S, def, person, id));
      id++; placed++;
    }
    if (placed < need) {
      S.state.issues.push(def.name + ": needed " + need + " people, only placed " + placed + " (pool empty or 4×10 needs FT).");
    }
  }
  (S.state.shifts || []).forEach(function (def) {
    var need = counts[def.id] || 0;
    if (need > 0 && (def.force || 0) > 0) fillShift(def, need);
  });
  (S.state.shifts || []).forEach(function (def) {
    var need = counts[def.id] || 0;
    if (need > 0 && !(def.force > 0)) fillShift(def, need);
  });
  return lines;
}

function takeSupervisoryFromPools(pools, targetFShare, placed) {
  placed = placed || { M: 0, F: 0 };
  function take(sex) {
    if (pools[sex] > 0) { pools[sex]--; return sex; }
    return null;
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

export function buildSupervisoryLines(S, supCounts, supType) {
  var lines = [];
  var isLtso = supType === "LTSO";
  var id = isLtso ? 20000 : 10000;
  var pools = {
    M: isLtso ? (S.state.ltsoM || 0) : (S.state.stsoM || 0),
    F: isLtso ? (S.state.ltsoF || 0) : (S.state.stsoF || 0)
  };
  var totalM = isLtso ? (S.state.ltsoM || 0) : (S.state.stsoM || 0);
  var totalF = isLtso ? (S.state.ltsoF || 0) : (S.state.stsoF || 0);
  var totalSup = totalM + totalF;
  var targetFShare = totalSup > 0 ? totalF / totalSup : 0.5;
  var placedGlobal = { M: 0, F: 0 };
  var forceField = isLtso ? "ltsoForce" : "stsoForce";

  function fill(def, need) {
    var placed = 0;
    while (placed < need) {
      var sex = takeSupervisoryFromPools(pools, targetFShare, placedGlobal);
      if (!sex) break;
      placedGlobal[sex]++;
      var workDays = (+def.paid || 8) >= 10 ? 4 : 5;
      var rdoCount = 7 - workDays;
      var hard = Array.isArray(def.rdoHard)
        ? def.rdoHard.map(Number).filter(function (x) { return x >= 0 && x <= 6; })
        : [];
      var rdoDays;
      if (hard.length > 0) {
        rdoDays = hard.slice();
        if (rdoDays.length < rdoCount) {
          for (var d = 0; d < 7 && rdoDays.length < rdoCount; d++) {
            if (rdoDays.indexOf(d) < 0) rdoDays.push(d);
          }
        } else if (rdoDays.length > rdoCount) rdoDays = rdoDays.slice(0, rdoCount);
      } else rdoDays = S.consecutiveRdos(rdoCount, (id - 1) % 7);
      lines.push({
        id: id,
        lineCode: supType + " " + String(lines.length + 1).padStart(2, "0"),
        shiftId: def.id,
        shiftName: def.name,
        shiftLabel: S.shiftLabel(def),
        empClass: supType,
        position: supType,
        isLtso: isLtso,
        isStso: !isLtso,
        sex: sex,
        function: "",
        rdoDays: rdoDays,
        rdoHard: hard.length > 0,
        paid: def.paid || 8
      });
      id++; placed++;
    }
    if (placed < need) S.state.issues.push(def.name + ": " + supType + " needed " + need + ", placed " + placed + ".");
  }

  (S.state.shifts || []).forEach(function (def) {
    var need = supCounts[def.id] || 0;
    if (need > 0 && (def[forceField] || 0) > 0) fill(def, need);
  });
  (S.state.shifts || []).forEach(function (def) {
    var need = supCounts[def.id] || 0;
    if (need > 0 && !(def[forceField] > 0)) fill(def, need);
  });
  return lines;
}
