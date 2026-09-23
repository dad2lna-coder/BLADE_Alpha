/** Import / export — file envelope only. Setup owns the snapshot. Excel lives in modules/shared/lines/excel.js */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";

  function normalizeLine(raw) {
    if (!raw || typeof raw !== "object" || raw.id == null) return null;
    return {
      id: raw.id,
      lineCode: raw.lineCode || ("Line " + String(raw.id).padStart(3, "0")),
      shiftId: raw.shiftId || "",
      shiftName: raw.shiftName || "",
      shiftLabel: raw.shiftLabel || "",
      empClass: raw.empClass || "",
      position: raw.position || raw.empClass || "",
      isLtso: Boolean(raw.isLtso),
      isStso: Boolean(raw.isStso),
      sex: raw.sex === "F" ? "F" : "M",
      function: raw.function === "DFO" || raw.function === "PAX" || raw.function === "BAG" ? raw.function : "",
      rdoDays: Array.isArray(raw.rdoDays) ? raw.rdoDays.map(Number).filter(function (x) {
        return Number.isInteger(x) && x >= 0 && x <= 6;
      }) : [],
      rdoHard: Boolean(raw.rdoHard),
      paid: S.safeNumber(raw.paid, 8, 1, 24)
    };
  }

  function normalizeTeam(raw) {
    if (!raw || typeof raw !== "object") return null;
    return {
      id: raw.id,
      name: raw.name,
      members: Array.isArray(raw.members) ? raw.members.slice() : [],
      followMe: !!raw.followMe,
      phase: raw.phase != null ? raw.phase : null,
      modSetId: raw.modSetId != null ? raw.modSetId : null
    };
  }

  function serializeTeams() {
    return (S.teams && Array.isArray(S.teams.teams))
      ? S.teams.teams.map(normalizeTeam).filter(Boolean)
      : [];
  }

  function ensureTeamsState() {
    S.teams = S.teams || { teams: [], pool: [], filters: { role: "ALL", start: "", rdo: "" }, selected: {}, sortables: [] };
    if (!Array.isArray(S.teams.teams)) S.teams.teams = [];
    return S.teams;
  }

  function normalizeSchedule(rawSchedule, validLineIds) {
    var out = {};
    if (!rawSchedule || typeof rawSchedule !== "object") return out;
    var valid = new Set(validLineIds.map(String));
    Object.keys(rawSchedule).forEach(function (key) {
      if (!valid.has(String(key))) return;
      var arr = Array.isArray(rawSchedule[key]) ? rawSchedule[key] : [];
      out[key] = arr.map(function (v) { return v === "WORK" ? "WORK" : "RDO"; });
    });
    return out;
  }

  function downloadBlob(blob, filename) {
    var a = document.createElement("a");
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  S.exportJson = function () {
    if (S.collectSetupInputs) S.collectSetupInputs();
    var startDateValue = S.toDateInputValue ? S.toDateInputValue(S.state.startDate) : null;
    var payload = {
      app: "scheduler-pre-v2",
      version: 5,
      exportedAt: new Date().toISOString(),
      config: {
        open: S.state.open,
        close: S.state.close,
        startDate: startDateValue,
        weekCount: S.state.weekCount,
        useDynamicHours: !!S.state.useDynamicHours,
        dayHours: S.state.dayHours || null,
        ftM: S.state.ftM, ftF: S.state.ftF,
        ptM: S.state.ptM, ptF: S.state.ptF,
        ltsoM: S.state.ltsoM, ltsoF: S.state.ltsoF,
        stsoM: S.state.stsoM, stsoF: S.state.stsoF,
        shifts: S.state.shifts,
        functionCoverage: S.state.functionCoverage || null,
        extraPositions: S.state.extraPositions || []
      },
      results: {
        lines: S.state.lines,
        schedule: S.state.schedule,
        mode: S.state.mode,
        issues: S.state.issues,
        functionRotation: S.state.functionRotation || {},
        teams: serializeTeams()
      }
    };
    downloadBlob(
      new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }),
      "scheduler-pre-v5-export-" + (startDateValue || "export") + ".json"
    );
    if (S.updateStatus) S.updateStatus("Exported config and results JSON.");
  };

  S.applyPayload = function (payload) {
    if (!payload || typeof payload !== "object") throw new Error("Invalid JSON payload.");
    var cfg = payload.config || payload.legacy || payload;
    var results = payload.results || payload.legacy || payload;
    S.state.open = S.isValidTimeText(cfg.open) ? cfg.open : "03:30";
    S.state.close = S.isValidTimeText(cfg.close) ? cfg.close : "23:00";
    S.state.useDynamicHours = !!cfg.useDynamicHours;
    if (Array.isArray(cfg.dayHours) && cfg.dayHours.length === 7) {
      S.state.dayHours = cfg.dayHours.map(function (dh) {
        return {
          open: S.isValidTimeText(dh && dh.open) ? dh.open : S.state.open,
          close: S.isValidTimeText(dh && dh.close) ? dh.close : S.state.close
        };
      });
    }
    S.state.weekCount = Math.floor(S.safeNumber(cfg.weekCount, 1, 1, 8));
    if (S.applyFte) {
      S.applyFte({
        ftM: cfg.ftM, ftF: cfg.ftF, ptM: cfg.ptM, ptF: cfg.ptF,
        ltsoM: cfg.ltsoM, ltsoF: cfg.ltsoF, stsoM: cfg.stsoM, stsoF: cfg.stsoF
      });
    } else {
      S.state.ftM = Math.floor(S.safeNumber(cfg.ftM, 0, 0, null));
      S.state.ftF = Math.floor(S.safeNumber(cfg.ftF, 0, 0, null));
      S.state.ptM = Math.floor(S.safeNumber(cfg.ptM, 0, 0, null));
      S.state.ptF = Math.floor(S.safeNumber(cfg.ptF, 0, 0, null));
      S.state.ltsoM = Math.floor(S.safeNumber(cfg.ltsoM, 0, 0, null));
      S.state.ltsoF = Math.floor(S.safeNumber(cfg.ltsoF, 0, 0, null));
      S.state.stsoM = Math.floor(S.safeNumber(cfg.stsoM, 0, 0, null));
      S.state.stsoF = Math.floor(S.safeNumber(cfg.stsoF, 0, 0, null));
    }
    S.state.startDate = S.parseStartDate(cfg.startDate || payload.startDate || null);
    S.state.shifts = Array.isArray(cfg.shifts) && cfg.shifts.length
      ? cfg.shifts.map(S.normalizeShift || function (s) { return s; })
      : (S.defaultShifts ? S.defaultShifts() : []);
    if (cfg.functionCoverage && typeof cfg.functionCoverage === "object") {
      S.state.functionCoverage = Object.assign(S.state.functionCoverage || {}, cfg.functionCoverage);
      if (S.ensureFunctionCoverage) S.ensureFunctionCoverage();
    }
    if (Array.isArray(cfg.extraPositions)) S.state.extraPositions = cfg.extraPositions;
    S.state.lines = Array.isArray(results.lines) ? results.lines.map(normalizeLine).filter(Boolean) : [];
    S.state.schedule = normalizeSchedule(results.schedule, S.state.lines.map(function (l) { return l.id; }));
    S.state.functionRotation = results.functionRotation && typeof results.functionRotation === "object" ? results.functionRotation : {};
    S.state.mode = typeof results.mode === "string" ? results.mode : "imported";
    S.state.issues = Array.isArray(results.issues) ? results.issues.map(String) : [];
    ensureTeamsState();
    var incomingTeams = results.teams || payload.teams;
    if (Array.isArray(incomingTeams)) {
      if (S.replaceAllTeams) S.replaceAllTeams(incomingTeams);
      else {
        S.teams.teams = incomingTeams.map(normalizeTeam).filter(Boolean);
        if (S.collectTeamPool) S.collectTeamPool();
        if (S.renderTeams) S.renderTeams();
      }
    }
    if (S.setInputValue) {
      S.setInputValue("cfg-open", S.state.open);
      S.setInputValue("cfg-close", S.state.close);
      S.setInputValue("cfg-weeks", S.state.weekCount);
      S.setInputValue("cfg-ft-m", S.state.ftM);
      S.setInputValue("cfg-ft-f", S.state.ftF);
      S.setInputValue("cfg-pt-m", S.state.ptM);
      S.setInputValue("cfg-pt-f", S.state.ptF);
      S.setInputValue("cfg-ltso-m", S.state.ltsoM);
      S.setInputValue("cfg-ltso-f", S.state.ltsoF);
      S.setInputValue("cfg-stso-m", S.state.stsoM);
      S.setInputValue("cfg-stso-f", S.state.stsoF);
    }
    var startEl = document.getElementById("cfg-start");
    if (startEl && S.toDateInputValue) startEl.value = S.toDateInputValue(S.state.startDate);
    if (S.renderShiftsTable) S.renderShiftsTable();
    if (S.renderAll) S.renderAll();
    if (S.updateStatus) {
      S.updateStatus("Imported " + (S.state.lines.length ? "config and results" : "config only") +
        " · " + S.state.lines.length + " line(s).");
    }
    window.dispatchEvent(new CustomEvent("lines:request-render"));
  };

  S.importJsonFile = function (file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (event) {
      try { S.applyPayload(JSON.parse(event.target.result)); }
      catch (err) {
        if (S.updateStatus) S.updateStatus("Import failed.");
        S.state.issues = ["Import failed: " + (err && err.message ? err.message : "Invalid JSON")];
        if (S.renderIssues) S.renderIssues();
      }
    };
    reader.readAsText(file);
  };

  S.clearAll = function () {
    S.state.lines = [];
    S.state.schedule = {};
    S.state.issues = [];
    S.state.functionRotation = {};
    S.state.mode = "—";
    if (S.teams) S.teams.teams = [];
    if (S.renderAll) S.renderAll();
    if (S.updateStatus) S.updateStatus("Cleared results. Configuration remains.");
  };
})(window.Scheduler);
