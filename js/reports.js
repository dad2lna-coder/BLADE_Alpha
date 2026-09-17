/** Management reports — deviation tables + gender balance analysis */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";

  S.reportsView = S.reportsView || {
    which: "passenger", // passenger | baggage | total | dfoPool
    skewThreshold: 5,
    phaseThresholdMin: 30
  };

  function emptyCell() {
    return {
      STSO: { M: 0, F: 0 },
      LTSO: { M: 0, F: 0 },
      TSO: { M: 0, F: 0 }
    };
  }

  function roleOf(line) {
    return S.lineRoleKey ? S.lineRoleKey(line) : "TSO";
  }

  /** Detailed headcount matrix: slots × 7 days × roles × sex */
  S.computeRoleMatrixByDow = function (opts) {
    opts = opts || {};
    var mode = opts.mode || "total"; // passenger | baggage | total | dfoPool
    var slots = S.coverageSlots();
    var base = S.state.startDate ? S.state.startDate : (S.parseStartDate ? S.parseStartDate(null) : null);
    var dowToOffset = {};
    var days = Math.min(7, (S.state.weekCount || 1) * 7);
    for (var off = 0; off < days; off++) {
      var dow;
      if (base && typeof base.add === "function") {
        dow = base.add(off, "day").day();
      } else if (base && base instanceof Date) {
        var dte = new Date(base.getTime());
        dte.setDate(dte.getDate() + off);
        dow = dte.getDay();
      } else {
        dow = off % 7;
      }
      if (dowToOffset[dow] == null) dowToOffset[dow] = off;
    }
    for (var d0 = 0; d0 < 7; d0++) {
      if (dowToOffset[d0] == null) dowToOffset[d0] = d0 % Math.max(1, days);
    }

    var matrix = slots.map(function () {
      return [0, 1, 2, 3, 4, 5, 6].map(function () {
        return emptyCell();
      });
    });

    S.state.lines.forEach(function (line) {
      if (!S.getShift(line.shiftId)) return;
      var role = roleOf(line);
      var sex = line.sex === "F" ? "F" : "M";

      if (mode === "dfoPool") {
        var el = line.functionEligible || {};
        if (!el.dfo) return;
      }

      for (var dow = 0; dow < 7; dow++) {
        var off = dowToOffset[dow];
        if (off == null) continue;
        if ((S.state.schedule[line.id] || [])[off] !== "WORK") continue;

        if (mode === "baggage") {
          var rotMap = S.state.functionRotation || {};
          var rotRow = rotMap[line.id] || rotMap[String(line.id)];
          var duty = rotRow ? (rotRow[off] || null) : null;
          if (duty !== "BAG" && duty !== "DFO") continue;
        } else if (mode === "passenger") {
          var rotMapP = S.state.functionRotation || {};
          var rotRowP = rotMapP[line.id] || rotMapP[String(line.id)];
          var dutyP = rotRowP ? (rotRowP[off] || null) : null;
          if (dutyP === "BAG" || dutyP === "DFO") continue;
        }

        var times = S.getEffectiveShiftTimes
          ? S.getEffectiveShiftTimes(line.shiftId, dow)
          : { start: S.getShift(line.shiftId).start, end: S.getShift(line.shiftId).end };
        var a = S.timeToMin(times.start);
        var b = S.timeToMin(times.end);
        slots.forEach(function (slot, si) {
          if (a < slot + 30 && b > slot) {
            matrix[si][dow][role][sex]++;
          }
        });
      }
    });
    return { slots: slots, matrix: matrix, dowToOffset: dowToOffset };
  };

  function cellKey(c) {
    return ["STSO", "LTSO", "TSO"]
      .map(function (r) {
        return r + ":" + c[r].M + "/" + c[r].F;
      })
      .join("|");
  }

  function formatCell(c) {
    var m = 0, f = 0;
    ["STSO", "LTSO", "TSO"].forEach(function (r) {
      if (!c[r]) return;
      m += c[r].M || 0;
      f += c[r].F || 0;
    });
    var tot = m + f;
    if (tot === 0) return "<span class=\"muted\">\u2014</span>";
    var detail = "";
    ["STSO", "LTSO", "TSO"].forEach(function (r) {
      var rm = (c[r] && c[r].M) || 0;
      var rf = (c[r] && c[r].F) || 0;
      if (rm + rf === 0) return;
      detail +=
        "<div class=\"rpt-role\"><span class=\"rpt-role-lbl\">" + r + "</span> " +
        "<span class=\"sex-m\">" + rm + "</span>/" +
        "<span class=\"sex-f\">" + rf + "</span></div>";
    });
    return (
      "<div class=\"rpt-total\"><strong>" + tot + "</strong> " +
      "(<span class=\"sex-m\">" + m + "</span>/<span class=\"sex-f\">" + f + "</span>)</div>" +
      detail
    );
  }

  S.compressDeviationRows = function (slots, matrix) {
    var rows = [];
    var prevKey = null;
    var runStart = null;
    for (var si = 0; si < slots.length; si++) {
      var key = matrix[si].map(cellKey).join(";");
      if (key !== prevKey) {
        if (prevKey != null) {
          rows.push({
            startSlot: runStart,
            endSlot: slots[si],
            cells: matrix[si - 1]
          });
        }
        runStart = slots[si];
        prevKey = key;
      }
    }
    if (prevKey != null && runStart != null) {
      rows.push({
        startSlot: runStart,
        endSlot: slots[slots.length - 1] + 30,
        cells: matrix[matrix.length - 1]
      });
    }
    return rows;
  };

  S.renderDeviationReport = function (containerId, mode, title) {
    var el = S.$(containerId);
    if (!el) return;
    if (!S.state.lines.length) {
      el.innerHTML = '<p class="muted">Generate a schedule first.</p>';
      return;
    }
    var computed = S.computeRoleMatrixByDow({ mode: mode });
    var rows = S.compressDeviationRows(computed.slots, computed.matrix);
    if (!rows.length) {
      el.innerHTML = "<h3 class=\"section-title\">" + title + "</h3><p class=\"muted\">No scheduled headcount for this view. Generate lines and function assignments first.</p>";
      return;
    }
    var html =
      "<h3 class=\"section-title\">" +
      title +
      "</h3>" +
      '<div class="lines-scroll"><table class="data-table rpt-table"><thead><tr><th>Window</th>';
    for (var d = 0; d < 7; d++) html += "<th>" + (S.DAYS[d] || d) + "</th>";
    html += "</tr></thead><tbody>";
    rows.forEach(function (r) {
      html +=
        "<tr><td>" +
        S.slotLabel(r.startSlot) +
        "\u2013" +
        S.slotLabel(r.endSlot % 1440) +
        "</td>";
      for (var d = 0; d < 7; d++) {
        html += "<td>" + formatCell(r.cells[d]) + "</td>";
      }
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    el.innerHTML = html;
  };

  S.computeShiftAnchors = function () {
    var starts = {};
    (S.state.lines || []).forEach(function (l) {
      var sh = S.getShift(l.shiftId);
      if (!sh) return;
      var m = S.timeToMin(sh.start);
      starts[m] = (starts[m] || 0) + 1;
    });
    var entries = Object.keys(starts)
      .map(function (k) {
        return { min: +k, n: starts[k] };
      })
      .sort(function (a, b) {
        return a.min - b.min;
      });
    if (!entries.length) return { am: 8 * 60, pm: 14 * 60 };
    var am = entries[0].min;
    var amN = 0;
    entries.forEach(function (e) {
      if (e.min < 12 * 60 && e.n > amN) {
        amN = e.n;
        am = e.min;
      }
    });
    var pm = entries[entries.length - 1].min;
    var pmN = 0;
    entries.forEach(function (e) {
      if (e.min >= 12 * 60 && e.n > pmN) {
        pmN = e.n;
        pm = e.min;
      }
    });
    return { am: am, pm: pm };
  };

  S.phaseOfStart = function (startMin, anchors, threshold) {
    threshold = threshold != null ? threshold : 30;
    if (startMin <= anchors.am - threshold && startMin < 11 * 60) return "Opening";
    if (startMin < anchors.pm - threshold) return "AM";
    if (startMin <= anchors.pm + threshold) return "PM";
    return "Closing";
  };

  S.renderGenderBalanceReports = function () {
    var el = S.$("report-gender");
    if (!el) return;
    if (!S.state.lines.length) {
      el.innerHTML = '<p class="muted">Generate a schedule first.</p>';
      return;
    }
    var thr = S.reportsView.phaseThresholdMin || 30;
    var skewThr = S.reportsView.skewThreshold || 5;
    var anchors = S.computeShiftAnchors();

    var totalM = 0;
    var totalF = 0;
    S.state.lines.forEach(function (l) {
      if (l.sex === "F") totalF++;
      else totalM++;
    });
    var overallFPct = totalM + totalF ? Math.round((100 * totalF) / (totalM + totalF)) : 0;

    var phases = ["Opening", "AM", "PM", "Closing"];
    var phaseDay = {};
    phases.forEach(function (p) {
      phaseDay[p] = [0, 1, 2, 3, 4, 5, 6].map(function () {
        return { M: 0, F: 0 };
      });
    });

    var base = S.state.startDate ? S.state.startDate : (S.parseStartDate ? S.parseStartDate(null) : null);
    var dowToOffset = {};
    var days = Math.min(7, (S.state.weekCount || 1) * 7);
    for (var off = 0; off < days; off++) {
      var dow;
      if (base && typeof base.add === "function") dow = base.add(off, "day").day();
      else dow = off % 7;
      if (dowToOffset[dow] == null) dowToOffset[dow] = off;
    }
    for (var d0 = 0; d0 < 7; d0++) {
      if (dowToOffset[d0] == null) dowToOffset[d0] = d0 % Math.max(1, days);
    }

    S.state.lines.forEach(function (l) {
      var sh = S.getShift(l.shiftId);
      if (!sh) return;
      var phase;
      if (sh.phase && sh.phase !== "auto") {
        var map = { opening: "Opening", am: "AM", pm: "PM", closing: "Closing" };
        phase = map[sh.phase] || "AM";
      } else {
        phase = S.phaseOfStart(S.timeToMin(sh.start), anchors, thr);
      }
      var sex = l.sex === "F" ? "F" : "M";
      for (var dow = 0; dow < 7; dow++) {
        var off = dowToOffset[dow];
        if (off == null) continue;
        if ((S.state.schedule[l.id] || [])[off] !== "WORK") continue;
        phaseDay[phase][dow][sex]++;
      }
    });

    var html =
      '<h3 class="section-title">Gender balance by shift phase</h3>' +
      '<p class="muted">AM anchor ' +
      S.slotLabel(anchors.am) +
      " \u00b7 PM anchor " +
      S.slotLabel(anchors.pm) +
      " \u00b7 threshold \u00b1" +
      thr +
      " min \u00b7 overall F% " +
      overallFPct +
      " \u00b7 skew flag >" +
      skewThr +
      " pts</p>" +
      '<div class="lines-scroll"><table class="data-table"><thead><tr><th>Phase</th>';
    for (var d = 0; d < 7; d++) html += "<th>" + S.DAYS[d] + "</th>";
    html += "</tr></thead><tbody>";
    phases.forEach(function (p) {
      html += "<tr><td><strong>" + p + "</strong></td>";
      for (var d = 0; d < 7; d++) {
        var cell = phaseDay[p][d];
        var t = cell.M + cell.F;
        var fPct = t ? Math.round((100 * cell.F) / t) : 0;
        var skew = Math.abs(fPct - overallFPct) > skewThr;
        html +=
          "<td class=\"" +
          (skew ? "hc-high" : "") +
          '">' +
          fPct +
          "% F" +
          (skew ? " \u26a0" : "") +
          " <span class=\"muted\">(" +
          cell.M +
          "M/" +
          cell.F +
          "F)</span></td>";
      }
      html += "</tr>";
    });
    html += "</tbody></table></div>";

    var dfoAM = { M: 0, F: 0 };
    var dfoPM = { M: 0, F: 0 };
    S.state.lines.forEach(function (l) {
      var elig = l.functionEligible || {};
      if (!elig.dfo) return;
      var sh = S.getShift(l.shiftId);
      if (!sh) return;
      var start = S.timeToMin(sh.start);
      var sex = l.sex === "F" ? "F" : "M";
      var thr = (S.state.functionCoverage && S.state.functionCoverage.phaseThresholdMin) || 15;
      if (S.isAmSide ? S.isAmSide(start, anchors, thr) : start < anchors.pm) dfoAM[sex]++;
      else dfoPM[sex]++;
    });
    function pctF(b) {
      var t = b.M + b.F;
      return t ? Math.round((100 * b.F) / t) : 0;
    }
    html +=
      '<h3 class="section-title" style="margin-top:1rem">DFO certified pool by AM/PM</h3>' +
      '<table class="data-table"><thead><tr><th>Window</th><th>Male</th><th>Female</th><th>F%</th></tr></thead><tbody>' +
      "<tr><td>AM (start before " +
      S.slotLabel(anchors.pm) +
      ")</td><td>" +
      dfoAM.M +
      "</td><td>" +
      dfoAM.F +
      "</td><td>" +
      pctF(dfoAM) +
      "%</td></tr>" +
      "<tr><td>PM (start at/after " +
      S.slotLabel(anchors.pm) +
      ")</td><td>" +
      dfoPM.M +
      "</td><td>" +
      dfoPM.F +
      "</td><td>" +
      pctF(dfoPM) +
      "%</td></tr></tbody></table>";

    var rdoM = [0, 0, 0, 0, 0, 0, 0];
    var rdoF = [0, 0, 0, 0, 0, 0, 0];
    S.state.lines.forEach(function (l) {
      var arr = l.sex === "F" ? rdoF : rdoM;
      (l.rdoDays || []).forEach(function (d) {
        if (d >= 0 && d <= 6) arr[d]++;
      });
    });
    html +=
      '<h3 class="section-title" style="margin-top:1rem">RDO pattern equity by gender</h3>' +
      '<table class="data-table"><thead><tr><th>Sex</th>';
    for (var d = 0; d < 7; d++) html += "<th>" + S.DAYS[d] + "</th>";
    html += "<th>Total</th></tr></thead><tbody>";
    function rdoRow(label, arr) {
      var sum = arr.reduce(function (a, b) { return a + b; }, 0);
      var row = "<tr><td><strong>" + label + "</strong></td>";
      arr.forEach(function (n) {
        row += "<td>" + n + (sum ? " <span class=\"muted\">(" + Math.round((100 * n) / sum) + "%)</span>" : "") + "</td>";
      });
      row += "<td>" + sum + "</td></tr>";
      return row;
    }
    html += rdoRow("Male", rdoM) + rdoRow("Female", rdoF) + "</tbody></table>";
    el.innerHTML = html;
  };

  function lineByMemberId(id) {
    var lines = (S.state && S.state.lines) || [];
    var i;
    for (i = 0; i < lines.length; i++) {
      if (lines[i].id === id || String(lines[i].id) === String(id)) return lines[i];
    }
    return null;
  }

  function shiftIntervalMins(shiftId, dow) {
    var times;
    if (S.getEffectiveShiftTimes) times = S.getEffectiveShiftTimes(shiftId, dow);
    else {
      var sh = S.getShift ? S.getShift(shiftId) : null;
      times = sh ? { start: sh.start, end: sh.end } : null;
    }
    if (!times) return null;
    var a = S.timeToMin(times.start);
    var b = S.timeToMin(times.end);
    if (a == null || b == null || isNaN(a) || isNaN(b)) return null;
    if (b <= a) b += 1440;
    return { a: a, b: b };
  }

  function overlapHours(intA, intB) {
    if (!intA || !intB) return 0;
    var lo = Math.max(intA.a, intB.a);
    var hi = Math.min(intA.b, intB.b);
    if (hi <= lo) return 0;
    return (hi - lo) / 60;
  }

  S.teamSupervisorLine = function (team) {
    var members = (team && team.members) || [];
    var first = null;
    var i, line, role;
    for (i = 0; i < members.length; i++) {
      line = lineByMemberId(members[i]);
      if (!line) continue;
      if (!first) first = line;
      role = roleOf(line);
      if (role === "STSO") return line;
    }
    return first;
  };

  S.lineScheduledHours = function (line) {
    if (!line) return 0;
    var days = ((S.state && S.state.weekCount) || 1) * 7;
    var sched = (S.state && S.state.schedule && S.state.schedule[line.id]) || [];
    var hours = 0;
    var off, dow, iv;
    for (off = 0; off < days; off++) {
      if (sched[off] !== "WORK") continue;
      dow = off % 7;
      iv = shiftIntervalMins(line.shiftId, dow);
      if (!iv) continue;
      hours += (iv.b - iv.a) / 60;
    }
    return hours;
  };

  S.lineOverlapHoursWith = function (line, supervisorLine) {
    if (!line || !supervisorLine) return 0;
    var days = ((S.state && S.state.weekCount) || 1) * 7;
    var schedA = (S.state && S.state.schedule && S.state.schedule[line.id]) || [];
    var schedB = (S.state && S.state.schedule && S.state.schedule[supervisorLine.id]) || [];
    var hours = 0;
    var off, dow;
    for (off = 0; off < days; off++) {
      if (schedA[off] !== "WORK" || schedB[off] !== "WORK") continue;
      dow = off % 7;
      hours += overlapHours(shiftIntervalMins(line.shiftId, dow), shiftIntervalMins(supervisorLine.shiftId, dow));
    }
    return hours;
  };

  S.computeTeamCohesion = function (team) {
    var name = (team && (team.name || team.id)) || "Team";
    var members = (team && team.members) || [];
    var stso = 0, ltso = 0, tso = 0;
    var i, line, role;
    for (i = 0; i < members.length; i++) {
      line = lineByMemberId(members[i]);
      if (!line) continue;
      role = roleOf(line);
      if (role === "STSO") stso++;
      else if (role === "LTSO") ltso++;
      else tso++;
    }
    var supervisor = S.teamSupervisorLine(team);
    var cohesionPct = null;
    if (supervisor && members.length) {
      var ratios = [];
      for (i = 0; i < members.length; i++) {
        line = lineByMemberId(members[i]);
        if (!line) continue;
        if (line.id === supervisor.id) continue;
        var den = S.lineScheduledHours(line);
        if (!den) continue;
        ratios.push(S.lineOverlapHoursWith(line, supervisor) / den);
      }
      if (ratios.length) {
        var sum = 0;
        for (i = 0; i < ratios.length; i++) sum += ratios[i];
        cohesionPct = (sum / ratios.length) * 100;
      }
    }
    return { name: name, stso: stso, ltso: ltso, tso: tso, cohesionPct: cohesionPct };
  };

  // Pair/group cohesion: retrofit later.

  S.renderTeamCohesionReport = function () {
    var el = S.$("report-cohesion");
    if (!el) return;
    var teams = (S.teams && S.teams.teams) || [];
    if (!teams.length) {
      el.innerHTML = "<p class=\"muted\">No teams yet.</p>";
      return;
    }
    var html =
      "<div class=\"lines-scroll\"><table class=\"data-table\"><thead><tr>" +
      "<th>Team name</th><th>STSO count</th><th>LTSO count</th><th>TSO count</th><th>Cohesion %</th>" +
      "</tr></thead><tbody>";
    teams.forEach(function (team) {
      var row = S.computeTeamCohesion(team);
      var pct;
      if (row.cohesionPct == null) pct = "\u2014";
      else if (Math.abs(row.cohesionPct - Math.round(row.cohesionPct)) < 0.05) pct = String(Math.round(row.cohesionPct));
      else pct = row.cohesionPct.toFixed(1);
      html +=
        "<tr><td>" +
        String(row.name).replace(/[&<>]/g, function (c) {
          return { "&": "&", "<": "<", ">": ">" }[c];
        }) +
        "</td><td>" +
        row.stso +
        "</td><td>" +
        row.ltso +
        "</td><td>" +
        row.tso +
        "</td><td>" +
        pct +
        "</td></tr>";
    });
    html += "</tbody></table></div>";
    el.innerHTML = html;
  };

  S.renderReports = function () {
    var which = S.reportsView.which || "passenger";
    var map = {
      passenger: ["report-main", "passenger", "Passenger coverage"],
      baggage: ["report-main", "baggage", "Baggage / DFO duty coverage"],
      total: ["report-main", "total", "Total coverage (everybody)"],
      dfoPool: ["report-main", "dfoPool", "DFO allocated pool (certified)"]
    };
    var cfg = map[which] || map.passenger;
    S.renderDeviationReport(cfg[0], cfg[1], cfg[2]);
    S.renderGenderBalanceReports();
    S.renderTeamCohesionReport();
  };

  S.initReports = function () {
    if (S._reportsBound) return;
    S._reportsBound = true;
    document.addEventListener("change", function (e) {
      var t = e.target;
      if (!t) return;
      if (t.name === "report-which") {
        S.reportsView.which = t.value;
        S.renderReports();
      }
      if (t.id === "report-skew-thr") {
        S.reportsView.skewThreshold = Math.max(1, +t.value || 5);
        S.renderReports();
      }
      if (t.id === "report-phase-thr") {
        S.reportsView.phaseThresholdMin = Math.max(0, +t.value || 30);
        S.renderReports();
      }
    });
  };
})(window.Scheduler);
