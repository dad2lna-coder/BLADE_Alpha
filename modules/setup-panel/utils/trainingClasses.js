/** ESTI / MSTI — training-dept classes. Own counts, lines, team, cert slice.
 *  Not PT TSO. Not ops FTE. Do not consume FT/PT/LTSO/STSO sex pools.
 *  Extra-position cards named ESTI/MSTI must not build a second PT path.
 */

export var TRAINING_CLASSES = ["ESTI", "MSTI"];

export function isTrainingClassName(name) {
  var s = String(name == null ? "" : name).trim().toUpperCase();
  return s === "ESTI" || s === "MSTI";
}

export function isTrainingLine(line) {
  if (!line) return false;
  if (line.isTraining || line.trainingClass) return true;
  if (isTrainingClassName(line.empClass) || isTrainingClassName(line.position) ||
      isTrainingClassName(line.extraName) || isTrainingClassName(line.role)) {
    return true;
  }
  return false;
}

function num0(v) {
  var n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function trainingHeadcount(S) {
  var st = (S && S.state) || {};
  return { ESTI: num0(st.esti), MSTI: num0(st.msti) };
}

export function trainingTotal(S) {
  var h = trainingHeadcount(S);
  return h.ESTI + h.MSTI;
}

function pickShiftQueue(shifts, need) {
  var listed = shifts && shifts.length ? shifts : [];
  var queue = [];
  if (!listed.length) {
    var fb = { id: "", name: "Shift", start: "04:00", end: "20:30", paid: 8, rdoHard: [] };
    for (var i = 0; i < need; i++) queue.push(fb);
    return queue;
  }
  for (var k = 0; k < need; k++) queue.push(listed[k % listed.length]);
  return queue;
}

function rdoDaysFor(S, def, workDays, seed) {
  var rdoCount = Math.max(1, 7 - workDays);
  var hard = Array.isArray(def && def.rdoHard)
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
  } else if (S && S.consecutiveRdos) {
    rdoDays = S.consecutiveRdos(rdoCount, seed);
  } else {
    rdoDays = [0, 6];
  }
  while (rdoDays.length < rdoCount) {
    for (var e = 0; e < 7 && rdoDays.length < rdoCount; e++) {
      if (rdoDays.indexOf(e) < 0) rdoDays.push(e);
    }
  }
  return { rdoDays: rdoDays, hard: hard.length > 0 };
}

export function buildTrainingClassLines(S) {
  var out = [];
  var counts = trainingHeadcount(S);
  var shifts = (S.state && S.state.shifts) || [];
  var fallback = shifts[0] || { id: "", name: "Shift", start: "04:00", end: "20:30", paid: 8, rdoHard: [] };
  TRAINING_CLASSES.forEach(function (cls, ci) {
    var n = counts[cls] || 0;
    if (!n) return;
    var parked = pickShiftQueue(shifts.length ? shifts : [fallback], n);
    var idBase = 40000 + ci * 1000;
    for (var idx = 0; idx < n; idx++) {
      var def = parked[idx] || fallback;
      var workDays = S.targetWorkDays ? S.targetWorkDays(def.id, "FT") : ((+def.paid || 8) >= 10 ? 4 : 5);
      var rdo = rdoDaysFor(S, def, workDays, (idBase + idx) % 7);
      out.push({
        id: idBase + idx + 1,
        lineCode: cls + " " + String(idx + 1).padStart(2, "0"),
        shiftId: def.id,
        shiftName: def.name,
        shiftLabel: S.shiftLabel ? S.shiftLabel(def) : ((def.start || "") + "-" + (def.end || "")),
        empClass: cls,
        position: cls,
        role: cls,
        isLtso: false,
        isStso: false,
        isExtra: true,
        isTraining: true,
        trainingClass: cls,
        extraPositionId: "training-" + cls,
        extraName: cls,
        opsFte: false,
        sex: "",
        function: "",
        rdoDays: rdo.rdoDays,
        rdoHard: rdo.hard,
        paid: def.paid || 8
      });
    }
  });
  return out;
}

export function formTrainingTeams(S) {
  var lines = (S && S.state && S.state.lines) || [];
  S.teams = S.teams || { teams: [] };
  if (!Array.isArray(S.teams.teams)) S.teams.teams = [];
  var byType = {};
  var ids = {};
  lines.forEach(function (l) {
    if (!isTrainingLine(l)) return;
    var key = String(l.trainingClass || l.empClass || l.extraName || "").trim().toUpperCase();
    if (!isTrainingClassName(key)) return;
    ids[+l.id] = key;
    if (!byType[key]) byType[key] = [];
    byType[key].push(l.id);
  });
  Object.keys(byType).forEach(function (typeName) {
    var team = S.teams.teams.find(function (t) {
      return t.trainingGroup === typeName || t.extraGroup === typeName || t.name === typeName;
    });
    if (!team) {
      team = {
        id: "TR-" + typeName,
        name: typeName,
        members: [],
        followMe: false,
        phase: null,
        extraGroup: typeName,
        trainingGroup: typeName
      };
      S.teams.teams.push(team);
    }
    team.extraGroup = typeName;
    team.trainingGroup = typeName;
    team.name = typeName;
    team.members = byType[typeName].slice();
  });
  S.teams.teams.forEach(function (t) {
    if (t.trainingGroup && byType[t.trainingGroup]) {
      t.members = byType[t.trainingGroup].slice();
      return;
    }
    t.members = (t.members || []).filter(function (m) {
      return !ids[+m] || (t.trainingGroup && ids[+m] === t.trainingGroup);
    });
  });
  return byType;
}

export function attachTrainingClasses(S) {
  if (!S) return;
  S.isTrainingClassName = isTrainingClassName;
  S.isTrainingLine = isTrainingLine;
  S.buildTrainingClassLines = function () { return buildTrainingClassLines(S); };
  S.formTrainingTeams = function () { return formTrainingTeams(S); };
}
