/** RDO Parity (Fairness) Report and Swap Proposal Engine.
 *  Identifies sex imbalances across RDO patterns on shifts/bands and proposes
 *  swapping RDO patterns between lines of different sexes without changing shift or sex.
 */
import { getBandKey } from "./buildLines.js";
import { getBandLabel } from "../actions/generateModal.js";
import { formatRdos } from "./rebalanceDfo.js";

export function getParityLinesForClass(S, classKey) {
  var lines = (S && S.state && S.state.lines) || [];
  return lines.filter(function (l) {
    return S.belongsToClass ? S.belongsToClass(l, classKey) : false;
  });
}

export function rdoPatternKey(rdoDays) {
  if (!Array.isArray(rdoDays) || !rdoDays.length) return "none";
  return rdoDays.slice().map(Number).sort(function (a, b) { return a - b; }).join("-");
}

function isWeekendPattern(rdoDays) {
  if (!Array.isArray(rdoDays)) return false;
  return rdoDays.indexOf(0) >= 0 || rdoDays.indexOf(6) >= 0;
}

function getShiftHalf(S, shiftId) {
  var shifts = (S && S.state && S.state.shifts) || [];
  var sh = shifts.find(function (s) { return s.id === shiftId; });
  if (!sh || !sh.start) return "AM";
  var startMin = S.timeToMin ? S.timeToMin(sh.start) : 210;
  // Strictly by start time: before 11:00 (660 min) is AM half, 11:00 and later is PM half
  return startMin < 660 ? "AM" : "PM";
}

export function checkParity(S, classKey, selectedBandKeys) {
  if (!S || !S.state) return { disparities: [], proposals: [], summary: "No Scheduler state" };

  if (classKey === "STSO") {
    return {
      disparities: [],
      proposals: [],
      summary: "STSO parity check not applicable under half-day RDO parity rules (LTSO & TSO only)."
    };
  }

  var lines = getParityLinesForClass(S, classKey);
  if (!lines.length) {
    return { disparities: [], proposals: [], summary: "No lines found for class " + classKey };
  }

  // Filter lines by selected bands
  var bandSet = new Set(Array.isArray(selectedBandKeys) && selectedBandKeys.length ? selectedBandKeys : []);
  var targetLines = lines.filter(function (l) {
    if (!l.shiftId) return false;
    if (l.isShortfall || l.function === "-") return false;
    var bk = getBandKey(S, l.shiftId);
    return bandSet.size === 0 || bandSet.has(bk);
  });

  if (!targetLines.length) {
    return { disparities: [], proposals: [], summary: "No active lines match the selected bands." };
  }

  // Find all unique RDO patterns across this class
  var patternMap = {};
  targetLines.forEach(function (l) {
    var pk = rdoPatternKey(l.rdoDays);
    if (!patternMap[pk]) {
      patternMap[pk] = {
        patternKey: pk,
        rdoDays: (l.rdoDays || []).slice(),
        isWeekend: isWeekendPattern(l.rdoDays),
        countM: 0,
        countF: 0
      };
    }
    if (l.sex === "M") patternMap[pk].countM++;
    else if (l.sex === "F") patternMap[pk].countF++;
  });

  var allPatterns = Object.keys(patternMap).map(function (k) { return patternMap[k]; });

  // Separate patterns: weekend patterns first, then midweek-only; higher total imbalance first
  allPatterns.sort(function (a, b) {
    if (a.isWeekend && !b.isWeekend) return -1;
    if (!a.isWeekend && b.isWeekend) return 1;
    var devA = Math.abs(a.countM - a.countF);
    var devB = Math.abs(b.countM - b.countF);
    if (devA !== devB) return devB - devA;
    return a.patternKey.localeCompare(b.patternKey);
  });

  var proposals = [];
  var disparities = [];
  var shortfalls = [];
  var pairedLineIds = new Set();

  // Initialize working counts per half and pattern
  var workingCounts = {};
  var halves = ["AM", "PM"];

  halves.forEach(function (half) {
    allPatterns.forEach(function (pat) {
      var halfLines = targetLines.filter(function (l) {
        return getShiftHalf(S, l.shiftId) === half && !(S.isLineScheduleLocked && S.isLineScheduleLocked(l));
      });
      var patLines = halfLines.filter(function (l) { return rdoPatternKey(l.rdoDays) === pat.patternKey; });
      workingCounts[half + "|" + pat.patternKey] = {
        M: patLines.filter(function (l) { return l.sex === "M"; }).length,
        F: patLines.filter(function (l) { return l.sex === "F"; }).length
      };
    });
  });

  // Evaluate each pattern across AM and PM halves
  allPatterns.forEach(function (pat) {
    halves.forEach(function (half) {
      var halfLines = targetLines.filter(function (l) {
        return getShiftHalf(S, l.shiftId) === half && !(S.isLineScheduleLocked && S.isLineScheduleLocked(l));
      });

      var wcKey = half + "|" + pat.patternKey;
      var wc = workingCounts[wcKey] || { M: 0, F: 0 };
      var countM = wc.M;
      var countF = wc.F;

      var halfLabel = half === "AM" ? "Morning half (<11:00)" : "Afternoon half (>=11:00)";
      var patLabel = formatRdos(pat.rdoDays);

      // 1:1 parity means M and F counts match (e.g. 2M & 2F is fine, 1M & 1F is fine).
      if (countM === countF && countM > 0) {
        return;
      }

      disparities.push({
        half: half,
        patternKey: pat.patternKey,
        rdoDays: pat.rdoDays,
        countM: countM,
        countF: countF
      });

      if (countM === 0 && countF === 0) {
        // Empty half for this pattern: need a 1:1 pair (1 Male and 1 Female assigned to pat.rdoDays)
        var donorF0 = halfLines.find(function (l) {
          return l.sex === "F" && rdoPatternKey(l.rdoDays) !== pat.patternKey && !pairedLineIds.has(l.id);
        });
        var donorM0 = halfLines.find(function (l) {
          return l.sex === "M" && rdoPatternKey(l.rdoDays) !== pat.patternKey && !pairedLineIds.has(l.id);
        });

        if (donorF0 && donorM0) {
          var pkF0 = rdoPatternKey(donorF0.rdoDays);
          var pkM0 = rdoPatternKey(donorM0.rdoDays);

          pairedLineIds.add(donorF0.id);
          pairedLineIds.add(donorM0.id);

          proposals.push({
            lineA: donorF0,
            lineB: donorM0,
            half: half,
            rdoA_before: donorF0.rdoDays,
            rdoB_before: donorM0.rdoDays,
            rdoA_after: pat.rdoDays,
            rdoB_after: pat.rdoDays,
            note: half + " half: Assign pattern " + patLabel + " to " + (donorF0.lineCode || donorF0.id) + " (F) & " + (donorM0.lineCode || donorM0.id) + " (M)"
          });

          workingCounts[wcKey].M++;
          workingCounts[wcKey].F++;
          if (workingCounts[half + "|" + pkF0]) workingCounts[half + "|" + pkF0].F--;
          if (workingCounts[half + "|" + pkM0]) workingCounts[half + "|" + pkM0].M--;
        } else {
          if (!donorM0) shortfalls.push(halfLabel + " short of 1 Male on pattern " + patLabel);
          if (!donorF0) shortfalls.push(halfLabel + " short of 1 Female on pattern " + patLabel);
        }
      } else if (countM > countF) {
        // Surplus males on pat: swap 1 Male on pat with 1 Female on another pattern in this half
        var diff = countM - countF;
        for (var i = 0; i < Math.ceil(diff / 2); i++) {
          var donorM_pat = halfLines.find(function (l) {
            return l.sex === "M" && rdoPatternKey(l.rdoDays) === pat.patternKey && !pairedLineIds.has(l.id);
          });

          // Prefer a Female on a pattern with female surplus
          var donorF_other = halfLines.find(function (l) {
            if (l.sex !== "F" || rdoPatternKey(l.rdoDays) === pat.patternKey || pairedLineIds.has(l.id)) return false;
            var otherPk = rdoPatternKey(l.rdoDays);
            var otherWc = workingCounts[half + "|" + otherPk] || { M: 0, F: 0 };
            return otherWc.F > otherWc.M || otherWc.F > 1;
          });

          if (!donorF_other) {
            donorF_other = halfLines.find(function (l) {
              return l.sex === "F" && rdoPatternKey(l.rdoDays) !== pat.patternKey && !pairedLineIds.has(l.id);
            });
          }

          if (donorM_pat && donorF_other) {
            var otherPk1 = rdoPatternKey(donorF_other.rdoDays);
            var otherRdos1 = donorF_other.rdoDays;

            pairedLineIds.add(donorM_pat.id);
            pairedLineIds.add(donorF_other.id);

            proposals.push({
              lineA: donorF_other,
              lineB: donorM_pat,
              half: half,
              rdoA_before: donorF_other.rdoDays,
              rdoB_before: donorM_pat.rdoDays,
              rdoA_after: pat.rdoDays,
              rdoB_after: otherRdos1,
              note: half + " half: Swap RDOs so " + (donorF_other.lineCode || donorF_other.id) + " (F) gains pattern " + patLabel + " from " + (donorM_pat.lineCode || donorM_pat.id) + " (M)"
            });

            workingCounts[wcKey].M--;
            workingCounts[wcKey].F++;
            if (workingCounts[half + "|" + otherPk1]) {
              workingCounts[half + "|" + otherPk1].M++;
              workingCounts[half + "|" + otherPk1].F--;
            }
          } else {
            shortfalls.push(halfLabel + " short of Female line to balance Male surplus on pattern " + patLabel);
            break;
          }
        }
      } else if (countF > countM) {
        // Surplus females on pat: swap 1 Female on pat with 1 Male on another pattern in this half
        var diffF = countF - countM;
        for (var j = 0; j < Math.ceil(diffF / 2); j++) {
          var donorF_pat = halfLines.find(function (l) {
            return l.sex === "F" && rdoPatternKey(l.rdoDays) === pat.patternKey && !pairedLineIds.has(l.id);
          });

          // Prefer a Male on a pattern with male surplus
          var donorM_other = halfLines.find(function (l) {
            if (l.sex !== "M" || rdoPatternKey(l.rdoDays) === pat.patternKey || pairedLineIds.has(l.id)) return false;
            var otherPk = rdoPatternKey(l.rdoDays);
            var otherWc = workingCounts[half + "|" + otherPk] || { M: 0, F: 0 };
            return otherWc.M > otherWc.F || otherWc.M > 1;
          });

          if (!donorM_other) {
            donorM_other = halfLines.find(function (l) {
              return l.sex === "M" && rdoPatternKey(l.rdoDays) !== pat.patternKey && !pairedLineIds.has(l.id);
            });
          }

          if (donorF_pat && donorM_other) {
            var otherPk2 = rdoPatternKey(donorM_other.rdoDays);
            var otherRdos2 = donorM_other.rdoDays;

            pairedLineIds.add(donorF_pat.id);
            pairedLineIds.add(donorM_other.id);

            proposals.push({
              lineA: donorF_pat,
              lineB: donorM_other,
              half: half,
              rdoA_before: donorF_pat.rdoDays,
              rdoB_before: donorM_other.rdoDays,
              rdoA_after: otherRdos2,
              rdoB_after: pat.rdoDays,
              note: half + " half: Swap RDOs so " + (donorM_other.lineCode || donorM_other.id) + " (M) gains pattern " + patLabel + " from " + (donorF_pat.lineCode || donorF_pat.id) + " (F)"
            });

            workingCounts[wcKey].F--;
            workingCounts[wcKey].M++;
            if (workingCounts[half + "|" + otherPk2]) {
              workingCounts[half + "|" + otherPk2].F++;
              workingCounts[half + "|" + otherPk2].M--;
            }
          } else {
            shortfalls.push(halfLabel + " short of Male line to balance Female surplus on pattern " + patLabel);
            break;
          }
        }
      }
    });
  });

  var summaryMsg = "";
  if (shortfalls.length > 0) {
    summaryMsg = "Class " + classKey + " parity shortfalls: " + shortfalls.join("; ");
  } else if (disparities.length > 0) {
    summaryMsg = "Class " + classKey + ": " + disparities.length + " pattern disparity/disparities found across halves. Proposed swaps to achieve 1M & 1F per pattern in each half.";
  } else {
    summaryMsg = "Class " + classKey + ": Patterns are balanced (1M & 1F per pattern in each half).";
  }

  return {
    disparities: disparities,
    shortfalls: shortfalls,
    proposals: proposals,
    summary: summaryMsg
  };
}

export function approveParitySwaps(S, swapPairs) {
  if (!S || !S.state || !Array.isArray(swapPairs) || !swapPairs.length) return false;

  var lines = S.state.lines || [];
  var days = (S.state.weekCount || 1) * 7;
  var count = 0;

  swapPairs.forEach(function (pair) {
    var lA = lines.find(function (l) { return String(l.id) === String(pair.lineAId); });
    var lB = lines.find(function (l) { return String(l.id) === String(pair.lineBId); });
    if (!lA || !lB) return;

    var newRdoA = pair.rdoA_after;
    var newRdoB = pair.rdoB_after;

    if (Array.isArray(newRdoA) && Array.isArray(newRdoB)) {
      lA.rdoDays = newRdoA.slice();
      lB.rdoDays = newRdoB.slice();

      if (S.buildScheduleForLine && S.state.schedule) {
        S.state.schedule[lA.id] = S.buildScheduleForLine(lA, days);
        S.state.schedule[lB.id] = S.buildScheduleForLine(lB, days);
      }

      // Rebuild functionRotation so duty days follow new work / RDO days
      if (S.state.functionRotation) {
        var rotA = [];
        var rotB = [];
        var schedA = S.state.schedule[lA.id] || [];
        var schedB = S.state.schedule[lB.id] || [];
        var dutyA = lA.function || "PAX";
        var dutyB = lB.function || "PAX";

        for (var d = 0; d < days; d++) {
          rotA[d] = schedA[d] === "WORK" ? dutyA : "OFF";
          rotB[d] = schedB[d] === "WORK" ? dutyB : "OFF";
        }
        S.state.functionRotation[lA.id] = rotA;
        S.state.functionRotation[lB.id] = rotB;
      }

      count++;
    }
  });

  if (count > 0) {
    if (S.updateStatus) S.updateStatus("Approved " + count + " RDO parity pattern swap(s).");
    if (S.renderAll) S.renderAll();
    if (S.__USE_SVELTE_LINES && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("lines:request-render"));
    } else if (S.renderLines) S.renderLines();
    return true;
  }
  return false;
}

export function attachParityReport(S) {
  if (!S) return;
  S.checkParity = function (classKey, selectedBandKeys) { return checkParity(S, classKey, selectedBandKeys); };
  S.approveParitySwaps = function (swapPairs) { return approveParitySwaps(S, swapPairs); };
}
