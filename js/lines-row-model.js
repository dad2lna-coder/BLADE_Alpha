/** Pure line-to-row model mapper — export-shaped, DOM-free */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";

  function padTeamName(name) {
    var raw = String(name || "").trim();
    if (!raw) return "";
    var match = raw.match(/^(\d+)$/);
    return match && Number(match[1]) < 10 ? "0" + match[1] : raw;
  }

  function rdoText(line, dayNames) {
    var days = (line.rdoDays || []).map(Number).filter(function (day) {
      return Number.isInteger(day) && day >= 0 && day <= 6;
    });
    var text = days.length ? days.map(function (day) {
      return dayNames && dayNames[day] != null ? dayNames[day] : String(day);
    }).join(",") : "\u2014";
    if (line.rdoHard) text += " (hard)";
    return text;
  }

  /**
   * Convert one line and its schedule into an export-shaped row model.
   * The mapper has no DOM or application-state dependencies. Optional
   * resolvers provide the same lookups used by the existing export.
   */
  S.lineToRowModel = function (line, schedule, options) {
    options = options || {};
    if (!line || !schedule) return null;

    var dayNames = options.dayNames || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var teamMeta = typeof options.teamResolver === "function" ? options.teamResolver(line.id) : null;
    var shift = typeof options.shiftResolver === "function" ? options.shiftResolver(line.shiftId) : null;
    var shiftName = line.shiftName || (shift && shift.name) || "";
    var start = shift && shift.start ? shift.start : "";
    var end = shift && shift.end ? shift.end : "";
    var workLabel = line.shiftLabel || (start && end ? start + "\u2013" + end : start || "WORK");
    var position = line.isStso || line.empClass === "STSO" ? "STSO" :
      line.isLtso || line.empClass === "LTSO" ? "LTSO" : "TSO";
    var emp = position === "STSO" || position === "LTSO" ? "FT" :
      line.empClass === "PT" ? "PT" : "FT";
    var paid = line.paid || 0;
    var rowSchedule = Array.isArray(schedule) ? schedule :
      schedule[line.id] || (schedule[String(line.id)] || []);
    var days = [];
    var hours = 0;

    for (var day = 0; day < 7; day++) {
      var value = rowSchedule[day];
      if (value === "WORK") {
        hours += paid;
        var duty = typeof options.rotationDutyResolver === "function"
          ? options.rotationDutyResolver(line.id, day)
          : null;
        days.push(duty || line.function === "BAG" || line.function === "DFO" || line.function === "PAX"
          ? duty || line.function
          : workLabel);
      } else {
        days.push("RDO");
      }
    }

    return {
      team: padTeamName((teamMeta && (teamMeta.name || teamMeta.id)) || ""),
      line: line.lineCode || "",
      shift: shiftName,
      start: start,
      end: end,
      position: position,
      emp: emp,
      sex: line.sex || "M",
      function: line.function || "",
      rdos: rdoText(line, dayNames),
      paid: paid,
      days: days,
      hours: hours
    };
  };

  /** Map all lines to seven-day row models without reading S.state. */
  S.getRowModels = function (lines, schedule, options) {
    if (!Array.isArray(lines) || !schedule) return [];
    return lines.map(function (line) {
      return S.lineToRowModel(line, schedule, options);
    }).filter(Boolean);
  };

  /**
   * Build row models for all lines using S.state.
   * Thin Scheduler-bound helper; pure mapper stays unchanged.
   */
  S.getLineRowModels = function (options) {
    var lines = (S.state && Array.isArray(S.state.lines)) ? S.state.lines : [];
    var schedule = (S.state && S.state.schedule) || [];
    var merged = Object.assign({}, options || {});
    if (!merged.teamResolver && typeof S.teamMetaForLine === "function") {
      merged.teamResolver = S.teamMetaForLine;
    }
    if (!merged.shiftResolver && typeof S.getShift === "function") {
      merged.shiftResolver = S.getShift;
    }
    return S.getRowModels(lines, schedule, merged);
  };
})(window.Scheduler);
