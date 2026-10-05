/** Pure line-to-row model mapper — export-shaped, DOM-free */
export function initRowModel(S) {
  S = S || window.Scheduler;
  if (!S) return;

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

  function resolveWorkDayText(line, duty, workLabel) {
    if (workLabel) return workLabel;
    return "WORK";
  }

  function resolveWorkDayDuty(line, duty) {
    if (duty === "TRAINING") return "TRAINING";
    if (duty === "-" || duty === "BAG" || duty === "PAX" || duty === "DFO") return duty;
    if (line.isTraining || line.trainingClass || line.empClass === "ESTI" || line.empClass === "MSTI" || line.extraName === "ESTI" || line.extraName === "MSTI") {
      return "TRAINING";
    }
    if (line.function === "BAG") return "BAG";
    if (line.function === "DFO" || line.function === "PAX") return "PAX";
    if (line.function === "-") return "-";
    return duty === "BAG" || duty === "PAX" ? duty : null;
  }

  S.lineToRowModel = function (line, schedule, options) {
    options = options || {};
    if (!line || !schedule) return null;

    var dayNames = options.dayNames || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var teamMeta = typeof options.teamResolver === "function" ? options.teamResolver(line.id) : null;
    var shift = typeof options.shiftResolver === "function" ? options.shiftResolver(line.shiftId) : null;
    var shiftName = line.shiftName || (shift && shift.name) || "";
    var start = line.startTime || (shift && shift.start ? shift.start : "");
    var end = line.endTime || (shift && shift.end ? shift.end : "");
    var defaultWorkLabel = (shift && shift.segments && shift.segments.length === 2)
      ? (shift.segments[0].start + "\u2013" + shift.segments[0].end + " / " + shift.segments[1].start + "\u2013" + shift.segments[1].end)
      : (start && end ? start + "\u2013" + end : start || "WORK");
    var workLabel = line.shiftLabel || defaultWorkLabel;
    var extra = !!(line.isExtra || line.extraPositionId);
    var position = extra
      ? (line.position || line.extraName || "TSO")
      : (line.isStso || line.empClass === "STSO" ? "STSO" :
        line.isLtso || line.empClass === "LTSO" ? "LTSO" : "TSO");
    var emp = extra
      ? (line.empClass === "PT" ? "PT" : "FT")
      : (position === "STSO" || position === "LTSO" ? "FT" :
        line.empClass === "PT" ? "PT" : "FT");
    var paid = line.paid || 0;
    var rowSchedule = Array.isArray(schedule) ? schedule :
      schedule[line.id] || (schedule[String(line.id)] || []);
    var days = [];
    var dayDuties = [];
    var dayStarts = [];
    var dayEnds = [];
    var hours = 0;

    for (var day = 0; day < 7; day++) {
      var dayCustom = line.dayTimes && line.dayTimes[String(day)];
      var times = typeof options.effectiveTimesResolver === "function"
        ? options.effectiveTimesResolver(line.shiftId, day)
        : null;
      var effStart = (dayCustom && dayCustom.start) || line.startTime || (times && times.start) || start;
      var effEnd = (dayCustom && dayCustom.end) || line.endTime || (times && times.end) || end;
      dayStarts.push(effStart);
      dayEnds.push(effEnd);

      var value = rowSchedule[day];
      if (value === "WORK") {
        hours += paid;
        var duty = typeof options.rotationDutyResolver === "function"
          ? options.rotationDutyResolver(line.id, day)
          : null;
        var text = resolveWorkDayText(line, duty, workLabel);
        days.push(text);
        dayDuties.push(resolveWorkDayDuty(line, duty) || "PAX");
      } else {
        days.push("RDO");
        dayDuties.push("OFF");
      }
    }

    return {
      id: line.id,
      teamId: (teamMeta && teamMeta.id) || "",
      shiftId: line.shiftId || "",
      team: padTeamName((teamMeta && (teamMeta.name || teamMeta.id)) || ""),
      line: line.lineCode || "",
      shift: shiftName,
      start: start,
      end: end,
      position: position,
      emp: emp,
      sex: line.sex === "F" || line.sex === "M" ? line.sex : "",
      function: line.function || "",
      certPool: line.certPool || "",
      rdos: rdoText(line, dayNames),
      paid: paid,
      days: days,
      dayDuties: dayDuties,
      dayStarts: dayStarts,
      dayEnds: dayEnds,
      hours: hours
    };
  };

  S.getRowModels = function (lines, schedule, options) {
    if (!Array.isArray(lines) || !schedule || typeof schedule !== "object") return [];
    return lines.map(function (line) {
      return S.lineToRowModel(line, schedule, options);
    }).filter(Boolean);
  };

  S.getLineRowModels = function (options) {
    var lines = (S.state && Array.isArray(S.state.lines)) ? S.state.lines : [];
    var schedule = (S.state && S.state.schedule) || {};
    var merged = Object.assign({}, options || {});
    if (!merged.teamResolver && typeof S.teamMetaForLine === "function") {
      merged.teamResolver = S.teamMetaForLine;
    }
    if (!merged.shiftResolver && typeof S.getShift === "function") {
      merged.shiftResolver = S.getShift;
    }
    if (!merged.rotationDutyResolver && typeof S.getRotationDuty === "function") {
      merged.rotationDutyResolver = S.getRotationDuty;
    }
    if (!merged.effectiveTimesResolver && typeof S.getEffectiveShiftTimes === "function") {
      merged.effectiveTimesResolver = S.getEffectiveShiftTimes;
    }
    return S.getRowModels(lines, schedule, merged);
  };
}
