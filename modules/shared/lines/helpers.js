import { parseStartDate, addDays, weekdaySun0 } from "../utils/dates.js";
import { dayLabel } from "../utils/dayLabel.js";
import { attachExcelExport } from "./excel.js";
import { attachExportStyle } from "./exportStyle.js";

export function attachLineHelpers(S) {
  if (!S) return;
  attachExportStyle(S);
  attachExcelExport(S);
  S.dayLabel = function (offset) { return dayLabel(S, offset); };
  S.linesView = S.linesView || {
    groupBy: "team", sortBy: "role", sortDir: "asc",
    filterRole: "ALL", filterShift: "", filterSex: "", filterTeam: ""
  };
  S.teamMetaForLine = function (lineId) {
    if (!S.teams || !S.teams.teams) return { order: 9999, name: "", id: "" };
    lineId = +lineId;
    for (var i = 0; i < S.teams.teams.length; i++) {
      var t = S.teams.teams[i];
      if (t.members && t.members.indexOf(lineId) !== -1) {
        return { order: i, name: t.name || t.id, id: t.id };
      }
    }
    return { order: 9999, name: "", id: "" };
  };
  S.teamNameForLine = function (lineId) { return S.teamMetaForLine(lineId).name; };
  S.lineRoleRank = function (line) {
    if (line.isStso || line.empClass === "STSO") return 0;
    if (line.isLtso || line.empClass === "LTSO") return 1;
    if (line.empClass === "FT") return 2;
    if (line.empClass === "PT") return 3;
    return 4;
  };
  S.syncRdoDaysFromSchedule = function (line) {
    if (!line) return;
    var sched = S.state.schedule[line.id] || [];
    var days = Math.min(7, (S.state.weekCount || 1) * 7);
    var base = parseStartDate(S.state.startDate);
    var set = {};
    for (var d = 0; d < days; d++) {
      if (sched[d] === "RDO") set[weekdaySun0(addDays(base, d))] = true;
    }
    line.rdoDays = Object.keys(set).map(Number).sort(function (a, b) { return a - b; });
  };
  S.rdoTextForLine = function (line) {
    var days = (line.rdoDays || []).map(function (i) { return (S.DAYS && S.DAYS[i]) || i; });
    var txt = days.length ? days.join(",") : "-";
    if (line.rdoHard) txt += " (hard)";
    return txt;
  };
  S.findLineById = function (id) {
    var want = String(id);
    var lines = (S.state && S.state.lines) || [];
    for (var i = 0; i < lines.length; i++) {
      if (String(lines[i].id) === want) return lines[i];
    }
    return null;
  };
  S.setLineTeam = function (lineId, teamId) {
    lineId = +lineId;
    if (!S.teams || !S.teams.teams) return;
    S.teams.teams.forEach(function (t) {
      t.members = (t.members || []).filter(function (m) { return m !== lineId; });
    });
    if (teamId) {
      var team = S.teams.teams.filter(function (t) { return t.id === teamId; })[0];
      if (team && team.members.indexOf(lineId) === -1) team.members.push(lineId);
    }
  };
  S.applyLineShift = function (line, shiftId) {
    var def = S.getShift && S.getShift(shiftId);
    if (!def || !line) return;
    line.shiftId = def.id;
    line.shiftName = def.name;
    line.shiftLabel = S.shiftLabel ? S.shiftLabel(def) : def.start + "-" + def.end;
    line.paid = def.paid || line.paid || 8;
  };
  S.applyLineEmp = function (line, emp) {
    if (!line) return;
    var v = String(emp == null ? "" : emp).trim();
    var extra = !!(line.isExtra || line.extraPositionId);
    if (v === "STSO") {
      line.empClass = extra ? (line.empClass || v) : "STSO";
      if (!extra) line.position = "STSO";
      line.isStso = !extra;
      line.isLtso = false;
      if (extra) {
        line.empClass = v === line.empClass ? line.empClass : line.empClass;
        line.isStso = false;
      }
      if (!extra) return;
    }
    if (!extra && v === "STSO") {
      line.empClass = "STSO";
      line.position = "STSO";
      line.isStso = true;
      line.isLtso = false;
      return;
    }
    if (!extra && v === "LTSO") {
      line.empClass = "LTSO";
      line.position = "LTSO";
      line.isStso = false;
      line.isLtso = true;
      return;
    }
    if (!extra && (v === "FT" || v === "PT" || v === "TSO")) {
      line.empClass = v === "PT" ? "PT" : "FT";
      line.position = "TSO";
      line.isStso = false;
      line.isLtso = false;
      return;
    }
    if (extra) {
      if (v) {
        line.empClass = v;
        line.position = v;
        line.extraName = v;
      }
      line.isStso = false;
      line.isLtso = false;
      return;
    }
    if (v) {
      line.empClass = v;
      line.position = v;
      line.isStso = false;
      line.isLtso = false;
    }
  };
  S.filterLinesForView = function (list) {
    var fr = S.linesView.filterRole || "ALL";
    var fs = S.linesView.filterShift || "";
    var fsex = S.linesView.filterSex || "";
    var ft = S.linesView.filterTeam || "";
    return (list || []).filter(function (line) {
      if (fr === "STSO" && !(line.isStso || line.empClass === "STSO")) return false;
      if (fr === "LTSO" && !(line.isLtso || line.empClass === "LTSO")) return false;
      if (fr === "TSO" && (line.isStso || line.isLtso || line.empClass === "STSO" || line.empClass === "LTSO")) return false;
      if (fs && String(line.shiftId) !== String(fs)) return false;
      if (fsex && line.sex !== fsex) return false;
      if (ft === "__none__") { if (S.teamMetaForLine(line.id).id) return false; }
      else if (ft && S.teamMetaForLine(line.id).id !== ft) return false;
      return true;
    });
  };
  S.sortLinesForView = function (list) {
    var groupBy = S.linesView.groupBy || "none";
    var sortBy = S.linesView.sortBy || "role";
    var dir = S.linesView.sortDir === "desc" ? -1 : 1;
    function groupKey(line) {
      if (groupBy === "team") {
        var tm = S.teamMetaForLine(line.id);
        return tm.id ? "T:" + tm.order + ":" + tm.name : "Z:unassigned";
      }
      if (groupBy === "shift") return "S:" + (line.shiftId || "");
      if (groupBy === "role") return "R:" + S.lineRoleRank(line);
      if (groupBy === "start") {
        var sh = S.getShift && S.getShift(line.shiftId);
        return "A:" + String(sh ? S.timeToMin(sh.start) : 0).padStart(4, "0");
      }
      return "";
    }
    function cmpVal(line) {
      if (sortBy === "team") return S.teamMetaForLine(line.id).order;
      if (sortBy === "role") return S.lineRoleRank(line);
      if (sortBy === "shift") {
        var sh = S.getShift && S.getShift(line.shiftId);
        return sh ? S.timeToMin(sh.start) : 0;
      }
      if (sortBy === "line") return (line.lineCode || "").toLowerCase();
      if (sortBy === "sex") return line.sex === "M" ? 0 : 1;
      return line.id;
    }
    return (list || []).slice().sort(function (a, b) {
      var ga = groupKey(a), gb = groupKey(b);
      if (ga < gb) return -1;
      if (ga > gb) return 1;
      var va = cmpVal(a), vb = cmpVal(b);
      if (typeof va === "string") {
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
      } else if (va !== vb) return (va - vb) * dir;
      return (a.id - b.id) * dir;
    });
  };
  S.renderLines = function () {
    if (S.applyExportCssVars) S.applyExportCssVars();
    var root = document.getElementById("lines-table-root");
    if (root && typeof root.refresh === "function") root.refresh();
    else window.dispatchEvent(new CustomEvent("lines:request-render"));
  };
  S.bindLinesUI = function () {
    if (S._linesUIBound) return;
    S._linesUIBound = true;
    attachExportStyle(S);
    document.addEventListener("change", function (e) {
      var t = e.target;
      if (!t) return;
      var map = {
        "lines-group-by": "groupBy",
        "lines-sort-by": "sortBy",
        "lines-sort-dir": "sortDir",
        "lines-filter-role": "filterRole",
        "lines-filter-shift": "filterShift",
        "lines-filter-sex": "filterSex",
        "lines-filter-team": "filterTeam"
      };
      if (map[t.id]) {
        S.linesView[map[t.id]] = t.value;
        S.renderLines();
      }
    });
  };
  S.getLineRowModels = function () {
    var filtered = S.sortLinesForView(S.filterLinesForView((S.state && S.state.lines) || []));
    var days = (S.state.weekCount || 1) * 7;
    return filtered.map(function (line) {
      var schedule = S.state.schedule[line.id] || [];
      var fr = S.state.functionRotation || {};
      var frLine = fr[String(line.id)] || [];
      var isBagDay = [], isDfoDay = [], isRdoDay = [], dayModels = [];
      for (var d = 0; d < days; d++) {
        var v = schedule[d] || "RDO";
        var duty = frLine[d] || line.function || null;
        var isBag = duty === "BAG" || duty === "BAGS";
        var isDfo = duty === "DFO";
        isBagDay[d] = isBag; isDfoDay[d] = isDfo; isRdoDay[d] = v !== "WORK";
        dayModels.push({
          dayIndex: d, value: v,
          duty: isBag ? "BAG" : isDfo ? "DFO" : (duty === "PAX" ? "PAX" : null),
          label: v === "WORK" ? (line.shiftLabel || "WORK") : "RDO"
        });
      }
      var hours = 0;
      for (var i = 0; i < days; i++) if (schedule[i] === "WORK") hours += line.paid || 0;
      var teamMeta = S.teamMetaForLine(line.id);
      return {
        id: line.id, lineCode: line.lineCode, shiftId: line.shiftId,
        shiftName: line.shiftName, shiftLabel: line.shiftLabel,
        empClass: line.isStso ? "STSO" : line.isLtso ? "LTSO" : line.empClass,
        sex: line.sex, function: line.function,
        rdoText: S.rdoTextForLine(line), rdoDays: line.rdoDays || [], rdoHard: line.rdoHard,
        teamName: teamMeta.name, teamId: teamMeta.id,
        days: dayModels, hours: hours,
        isBagDay: isBagDay, isDfoDay: isDfoDay, isRdoDay: isRdoDay
      };
    });
  };
}

export function initLineHelpers(scheduler) {
  attachLineHelpers(scheduler || window.Scheduler);
}
