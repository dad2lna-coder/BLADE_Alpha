/** Setup Generate Modal — view models for the Svelte 5 dialog.
 *  Generation, parity, and DFO cert moves stay in the plain JS engines.
 *  The component calls these helpers and those engines. It does not reimplement them.
 */
import { getBandKey } from "../utils/buildLines.js";
import { formatRdos } from "../utils/rebalanceDfo.js";
import { parseStartDate, addDays, weekdaySun0 } from "../../shared/utils/dates.js";

export function getModalClassOptions(S) {
  var options = [
    { key: "STSO", label: "STSO" },
    { key: "LTSO", label: "LTSO" },
    { key: "TSO", label: "TSO" },
    { key: "MSTI", label: "MSTI" },
    { key: "ESTI", label: "ESTI" }
  ];

  var extraList = (S && S.state && S.state.extraPositions) || [];
  extraList.forEach(function (pos) {
    var name = String(pos.name || pos.id || "Position").trim();
    options.push({
      key: "EXTRA_" + pos.id,
      label: "Extra: " + name
    });
  });

  return options;
}

export function initPerShiftTargetsForClass(S, classKey) {
  S._perShiftTargets = S._perShiftTargets || {};
  if (S._perShiftTargets[classKey]) return S._perShiftTargets[classKey];

  var shifts = (S.state && S.state.shifts) || [];
  var targets = {};
  shifts.forEach(function (s) { targets[s.id] = { M: 0, F: 0 }; });

  var lines = (S.state && S.state.lines) || [];
  var classLines = lines.filter(function (l) { return S.belongsToClass ? S.belongsToClass(l, classKey) : false; });

  if (classLines.length) {
    classLines.forEach(function (l) {
      if (!l.shiftId || !targets[l.shiftId]) return;
      if (l.isShortfall) return;
      if (l.sex === "F") targets[l.shiftId].F++;
      else targets[l.shiftId].M++;
    });
  } else {
    var hc = S.getClassHeadcount ? S.getClassHeadcount(classKey) : { M: 0, F: 0, total: 0 };
    if (shifts.length > 0) {
      var isTrain = classKey === "MSTI" || classKey === "ESTI";
      if (isTrain) {
        var remTrain = hc.total;
        for (var k = 0; k < shifts.length; k++) {
          var trShiftId = shifts[k].id;
          var takeTr = Math.floor(remTrain / (shifts.length - k));
          targets[trShiftId].M = takeTr;
          remTrain -= takeTr;
        }
      } else {
        var mM = hc.M, mF = hc.F;
        for (var i = 0; i < shifts.length; i++) {
          var sId = shifts[i].id;
          var takeM = Math.floor(mM / (shifts.length - i));
          var takeF = Math.floor(mF / (shifts.length - i));
          targets[sId].M = takeM;
          targets[sId].F = takeF;
          mM -= takeM;
          mF -= takeF;
        }
      }
    }
  }

  S._perShiftTargets[classKey] = targets;
  return targets;
}

function isTrainClass(classKey) {
  return classKey === "MSTI" || classKey === "ESTI";
}

function targetSums(shifts, targets) {
  var sumM = 0;
  var sumF = 0;
  shifts.forEach(function (s) {
    var t = targets[s.id] || { M: 0, F: 0 };
    sumM += (+t.M || 0);
    sumF += (+t.F || 0);
  });
  return { sumM: sumM, sumF: sumF };
}

export function readTargetView(S) {
  var options = getModalClassOptions(S);
  if (!S._activeTargetClass) S._activeTargetClass = options[0] ? options[0].key : "STSO";
  var classKey = S._activeTargetClass;
  var hc = S.getClassHeadcount ? S.getClassHeadcount(classKey) : { M: 0, F: 0, total: 0 };
  var targets = initPerShiftTargetsForClass(S, classKey);
  var shifts = (S.state && S.state.shifts) || [];
  shifts.forEach(function (s) {
    if (!targets[s.id]) targets[s.id] = { M: 0, F: 0 };
  });
  var sums = targetSums(shifts, targets);
  var train = isTrainClass(classKey);
  var info;
  if (train) {
    var totalSum = sums.sumM + sums.sumF;
    var shortTotal = Math.max(0, hc.total - totalSum);
    info = "Total: " + totalSum + " / " + hc.total + " targeted (" + shortTotal + " shortfall)";
  } else {
    var shortM = Math.max(0, hc.M - sums.sumM);
    var shortF = Math.max(0, hc.F - sums.sumF);
    info = "Male: " + sums.sumM + " / " + hc.M + " (" + shortM + " shortfall) | Female: " + sums.sumF + " / " + hc.F + " (" + shortF + " shortfall)";
  }
  var rows = shifts.map(function (s) {
    var t = targets[s.id] || { M: 0, F: 0 };
    var curM = +t.M || 0;
    var curF = +t.F || 0;
    var canIncM = !train && (sums.sumM < hc.M);
    var canIncF = !train && (sums.sumF < hc.F);
    var canIncTot = train ? ((sums.sumM + sums.sumF) < hc.total) : (canIncM || canIncF);
    return {
      id: s.id,
      name: s.name || s.id,
      time: (s.start || "") + (s.end ? "–" + s.end : ""),
      m: curM,
      f: curF,
      total: curM + curF,
      train: train,
      canIncM: canIncM,
      canIncF: canIncF,
      canIncTot: canIncTot
    };
  });
  return { classKey: classKey, options: options, info: info, rows: rows };
}

export function setActiveTargetClass(S, classKey) {
  if (!S) return;
  S._activeTargetClass = classKey;
}

export function stepTarget(S, shiftId, kind) {
  if (!S) return;
  var classKey = S._activeTargetClass;
  var targets = initPerShiftTargetsForClass(S, classKey);
  var slot = targets[shiftId];
  if (!slot) return;
  var hc = S.getClassHeadcount ? S.getClassHeadcount(classKey) : { M: 0, F: 0, total: 0 };
  var shifts = (S.state && S.state.shifts) || [];
  var sums = targetSums(shifts, targets);
  var train = isTrainClass(classKey);
  if (kind === "m+") {
    if (sums.sumM < hc.M) slot.M++;
  } else if (kind === "m-") {
    if (slot.M > 0) slot.M--;
  } else if (kind === "f+") {
    if (sums.sumF < hc.F) slot.F++;
  } else if (kind === "f-") {
    if (slot.F > 0) slot.F--;
  } else if (kind === "t+") {
    if (train) {
      if ((sums.sumM + sums.sumF) < hc.total) slot.M++;
    } else if (sums.sumM < hc.M) {
      slot.M++;
    } else if (sums.sumF < hc.F) {
      slot.F++;
    }
  } else if (kind === "t-") {
    if (slot.F > 0) slot.F--;
    else if (slot.M > 0) slot.M--;
  }
}

export function getBandLabel(S, bandKey) {
  if (bandKey.indexOf("crew_") === 0) {
    var cgId = bandKey.substring(5);
    var groups = (S.state && S.state.shiftCrewGroups) || [];
    var grp = groups.find(function (g) { return g.id === cgId; });
    if (grp) return "Group: " + (grp.name || grp.id);
  }
  var shifts = (S.state && S.state.shifts) || [];
  var sh = shifts.find(function (s) { return s.id === bandKey; });
  if (sh) return (sh.name || sh.id) + (sh.start ? " (" + sh.start + "–" + sh.end + ")" : "");
  return bandKey;
}

export function readWeekdayView(S) {
  var lines = (S.state && S.state.lines) || [];
  var schedule = (S.state && S.state.schedule) || {};
  var shifts = (S.state && S.state.shifts) || [];
  if (!lines.length || !shifts.length) return { empty: true, rows: [] };

  var baseDate = parseStartDate(S.state ? S.state.startDate : null);
  var bandKeys = [];
  var seenBands = {};
  shifts.forEach(function (s) {
    var bk = getBandKey(S, s.id);
    if (!seenBands[bk]) {
      seenBands[bk] = true;
      bandKeys.push(bk);
    }
  });

  var bandCounts = {};
  bandKeys.forEach(function (bk) {
    bandCounts[bk] = [];
    for (var d = 0; d < 7; d++) bandCounts[bk][d] = { M: 0, F: 0, total: 0 };
  });

  lines.forEach(function (line) {
    if (!line || !line.shiftId) return;
    if (line.isShortfall || line.function === "-") return;
    var bk = getBandKey(S, line.shiftId);
    if (!bandCounts[bk]) {
      bandCounts[bk] = [];
      for (var d = 0; d < 7; d++) bandCounts[bk][d] = { M: 0, F: 0, total: 0 };
      bandKeys.push(bk);
    }
    var lineSched = schedule[line.id] || [];
    var rotation = S.state && S.state.functionRotation ? (S.state.functionRotation[line.id] || S.state.functionRotation[String(line.id)]) : null;
    for (var dayIdx = 0; dayIdx < 7; dayIdx++) {
      if (lineSched[dayIdx] === "WORK") {
        var dayDuty = rotation ? rotation[dayIdx] : line.function;
        if (dayDuty === "-") continue;
        var calDow = weekdaySun0(addDays(baseDate, dayIdx));
        bandCounts[bk][calDow].total++;
        if (line.sex === "F") bandCounts[bk][calDow].F++;
        else if (line.sex === "M") bandCounts[bk][calDow].M++;
      }
    }
  });

  return {
    empty: false,
    rows: bandKeys.map(function (bk) {
      var cells = [];
      for (var calDow = 0; calDow < 7; calDow++) {
        var c = bandCounts[bk][calDow];
        cells.push(c.M + "M / " + c.F + "F (" + c.total + ")");
      }
      return { key: bk, label: getBandLabel(S, bk), cells: cells };
    })
  };
}

function bandKeysFor(S) {
  var shifts = (S.state && S.state.shifts) || [];
  var bandKeys = [];
  var seen = {};
  shifts.forEach(function (s) {
    var bk = getBandKey(S, s.id);
    if (!seen[bk]) {
      seen[bk] = true;
      bandKeys.push(bk);
    }
  });
  return bandKeys;
}

export function readParityChrome(S) {
  var options = getModalClassOptions(S);
  if (!S._activeParityClass) S._activeParityClass = options[0] ? options[0].key : "STSO";
  S._selectedParityBands = S._selectedParityBands || {};
  var bands = bandKeysFor(S).map(function (bk) {
    if (S._selectedParityBands[bk] === undefined) S._selectedParityBands[bk] = true;
    return { key: bk, label: getBandLabel(S, bk), checked: S._selectedParityBands[bk] !== false };
  });
  return { classKey: S._activeParityClass, options: options, bands: bands };
}

export function setActiveParityClass(S, classKey) {
  if (!S) return;
  S._activeParityClass = classKey;
  S._parityReportResult = null;
}

export function setParityBand(S, bandKey, checked) {
  if (!S) return;
  S._selectedParityBands = S._selectedParityBands || {};
  S._selectedParityBands[bandKey] = !!checked;
  S._parityReportResult = null;
}

export function parityResultView(res) {
  if (!res) return { visible: false, summary: "", rows: [], empty: "" };
  var proposals = res.proposals || [];
  if (!proposals.length) {
    var hasIssues = (res.shortfalls && res.shortfalls.length > 0) || (res.disparities && res.disparities.length > 0);
    return {
      visible: true,
      summary: res.summary || "",
      rows: [],
      empty: hasIssues
        ? "RDO pattern parity shortfalls detected. Cannot auto-balance with available lines."
        : "No RDO pattern swaps needed. Patterns are balanced."
    };
  }
  return {
    visible: true,
    summary: res.summary || "",
    empty: "",
    rows: proposals.map(function (p, idx) {
      var lA = p.lineA;
      var lB = p.lineB;
      return {
        key: String(lA.id) + ":" + String(lB.id) + ":" + idx,
        lineAId: lA.id,
        lineBId: lB.id,
        rdoA_after: p.rdoA_after,
        rdoB_after: p.rdoB_after,
        codeA: lA.lineCode || lA.id,
        sexA: lA.sex,
        shiftA: lA.shiftName || lA.shiftId,
        rdoA: formatRdos(p.rdoA_before),
        codeB: lB.lineCode || lB.id,
        sexB: lB.sex,
        shiftB: lB.shiftName || lB.shiftId,
        rdoB: formatRdos(p.rdoB_before),
        note: p.note,
        checked: true
      };
    })
  };
}

export function runParityCheck(S) {
  if (!S) return parityResultView(null);
  var cls = S._activeParityClass || "STSO";
  var sel = [];
  Object.keys(S._selectedParityBands || {}).forEach(function (bk) {
    if (S._selectedParityBands[bk]) sel.push(bk);
  });
  if (S.checkParity) S._parityReportResult = S.checkParity(cls, sel);
  return parityResultView(S._parityReportResult);
}

export function approveParitySelection(S, rows) {
  if (!S) return parityResultView(null);
  var pairs = [];
  (rows || []).forEach(function (row) {
    if (!row.checked) return;
    pairs.push({
      lineAId: row.lineAId,
      lineBId: row.lineBId,
      rdoA_after: row.rdoA_after,
      rdoB_after: row.rdoB_after
    });
  });
  if (pairs.length && S.approveParitySwaps) {
    S.approveParitySwaps(pairs);
    runParityCheck(S);
  }
  return parityResultView(S._parityReportResult);
}

export function readDfoChrome(S) {
  var options = getModalClassOptions(S);
  if (!S._activeDfoClass) S._activeDfoClass = options[0] ? options[0].key : "STSO";
  return { classKey: S._activeDfoClass, options: options };
}

export function setActiveDfoClass(S, classKey) {
  if (!S) return;
  S._activeDfoClass = classKey;
  S._dfoCertBalanceResult = null;
}

export function dfoResultView(res) {
  if (!res) return { visible: false, summary: "", mode: "", baggageCerts: 0, rows: [], empty: "" };
  if (res.mode === "baggage_reshuffle") {
    return {
      visible: true,
      summary: res.summary || "",
      mode: res.mode,
      baggageCerts: res.certCountPerShift || 0,
      rows: [],
      empty: ""
    };
  }
  var proposals = res.proposals || [];
  if (!proposals.length) {
    return {
      visible: true,
      summary: res.summary || "",
      mode: res.mode || "",
      baggageCerts: 0,
      rows: [],
      empty: "No DFO cert moves required. Shift cert counts match."
    };
  }
  return {
    visible: true,
    summary: res.summary || "",
    mode: res.mode || "",
    baggageCerts: 0,
    empty: "",
    rows: proposals.map(function (p, idx) {
      var dL = p.donorLine;
      var rL = p.receiverLine;
      return {
        idx: idx,
        sex: p.sex,
        donorCode: dL.lineCode || dL.id,
        receiverCode: rL.lineCode || rL.id,
        donorShift: p.donorShift ? (p.donorShift.name || p.donorShift.id) : "",
        receiverShift: p.receiverShift ? (p.receiverShift.name || p.receiverShift.id) : "",
        note: p.note,
        checked: true
      };
    })
  };
}

export function runDfoPropose(S) {
  if (!S) return dfoResultView(null);
  var cls = S._activeDfoClass || "STSO";
  if (S.proposeDfoCertBalance) S._dfoCertBalanceResult = S.proposeDfoCertBalance(cls);
  return dfoResultView(S._dfoCertBalanceResult);
}

export function approveDfoSelection(S, rows) {
  if (!S) return dfoResultView(null);
  var res = S._dfoCertBalanceResult;
  if (!res || !S.approveDfoCertBalance) return dfoResultView(res);
  var selected = [];
  if (res.mode === "cert_move") {
    (rows || []).forEach(function (row) {
      if (row.checked && res.proposals && res.proposals[row.idx]) selected.push(res.proposals[row.idx]);
    });
  }
  S.approveDfoCertBalance(res, selected);
  var cls = S._activeDfoClass || "STSO";
  if (S.proposeDfoCertBalance) S._dfoCertBalanceResult = S.proposeDfoCertBalance(cls);
  return dfoResultView(S._dfoCertBalanceResult);
}

function refreshMounted(S) {
  if (S.setupGenerate && typeof S.setupGenerate.refresh === "function") S.setupGenerate.refresh();
}

export function attachGenerateModal(S) {
  if (!S) return;

  S.openGenerateModal = function () {
    if (S.setupGenerate && typeof S.setupGenerate.open === "function") S.setupGenerate.open();
  };
  S.closeGenerateModal = function () {
    if (S.setupGenerate && typeof S.setupGenerate.close === "function") S.setupGenerate.close();
  };
  S.getModalClassOptions = function () { return getModalClassOptions(S); };
  S.initPerShiftTargetsForClass = function (classKey) { return initPerShiftTargetsForClass(S, classKey); };
  S.renderClassButtons = function () { refreshMounted(S); };
  S.renderTargetControls = function () { refreshMounted(S); };
  S.renderWeekdayBandsMatrix = function () { refreshMounted(S); };
  S.renderParityReportSection = function () { refreshMounted(S); };
  S.renderDfoSection = function () { refreshMounted(S); };
  S.renderGenerateModalContent = function () { refreshMounted(S); };
}
