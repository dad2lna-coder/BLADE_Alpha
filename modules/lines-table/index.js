/** Lines Table module -- Svelte island inside the classic Lines tab.
 * Rows come from filtered/sorted getRowModels. Edits write Scheduler.state.
 */
import LinesTable from './LinesTable.svelte';
import { initRowModel, dowToScheduleOffset } from './row-model.js';
import { initLineColors } from './line-colors.js';

export function initLinesTable(scheduler) {
  const S = scheduler || window.Scheduler;
  if (!S) return;

  initRowModel(S);
  initLineColors(S);

  const root = document.getElementById("lines-table-root");
  if (!root) {
    console.warn("lines-table: #lines-table-root not found");
    return;
  }

  if (S.__USE_SVELTE_LINES === false) {
    root.innerHTML = '';
    root.style.display = 'none';
    if (S.renderLines) S.renderLines();
    return;
  }

  if (root._linesTableMounted) return;
  root._linesTableMounted = true;

  function resolvers() {
    return {
      teamResolver: typeof S.teamMetaForLine === "function" ? S.teamMetaForLine : null,
      shiftResolver: typeof S.getShift === "function" ? S.getShift : null,
      rotationDutyResolver: typeof S.getRotationDuty === "function" ? S.getRotationDuty : getRotationDutyLocal,
      effectiveTimesResolver: typeof S.getEffectiveShiftTimes === "function" ? S.getEffectiveShiftTimes : null
    };
  }

  function getRotationDutyLocal(lineId, dayIndex) {
    const key = String(lineId);
    const rot = S.state && S.state.functionRotation;
    const arr = rot && (rot[key] || rot[lineId]);
    if (!Array.isArray(arr)) return null;
    const duty = arr[dayIndex];
    if (duty === "BAG") return "BAG";
    if (duty === "DFO") return "DFO";
    if (duty === "PAX") return "PAX";
    if (duty === "TRAINING") return "TRAINING";
    if (duty === "-") return "-";
    return null;
  }

  function setRotationDuty(lineId, dayIndex, duty) {
    var key = String(lineId);
    if (!S.state.functionRotation) S.state.functionRotation = {};
    if (!S.state.functionRotation[key]) S.state.functionRotation[key] = [];
    while (S.state.functionRotation[key].length <= dayIndex) S.state.functionRotation[key].push(null);
    S.state.functionRotation[key][dayIndex] = duty; // "BAG" | "PAX" | "DFO" | null
  }

  function scheduleOffsetForColumn(dow) {
    var map = dowToScheduleOffset(S.state && S.state.startDate, S.state && S.state.weekCount);
    var off = map[dow];
    return off == null ? dow : off;
  }

  function isDfoCapable(line) {
    if (!line) return false;
    if (line.function === "DFO") return true;
    const elig = line.functionEligible;
    return !!(elig && (elig.dfo === true || elig.DFO === true));
  }

  function buildRows() {
    const lines = (S.state && Array.isArray(S.state.lines)) ? S.state.lines : [];
    const filtered = typeof S.sortLinesForView === "function" && typeof S.filterLinesForView === "function"
      ? S.sortLinesForView(S.filterLinesForView(lines))
      : lines;
    const schedule = (S.state && S.state.schedule) || {};
    const models = typeof S.getRowModels === "function"
      ? S.getRowModels(filtered, schedule, resolvers())
      : (typeof S.getLineRowModels === "function"
          ? S.getLineRowModels(resolvers())
          : []);
    return Array.isArray(models) ? models : [];
  }

  function teamOptions() {
    if (S.teams && Array.isArray(S.teams.teams)) return S.teams.teams;
    return [];
  }

  function shiftOptions() {
    return (S.state && Array.isArray(S.state.shifts)) ? S.state.shifts : [];
  }

  function currentExportStyle() {
    if (typeof S.getExportStyle === "function") return S.getExportStyle();
    return (S.state && S.state.exportStyle) || null;
  }

  function applyProps(comp) {
    if (!comp || typeof comp.$set !== "function") return;
    const nextRows = buildRows();
    if (typeof S.applyExportCssVars === "function") S.applyExportCssVars();
    comp.$set({
      rows: Array.isArray(nextRows) ? nextRows : [],
      shiftOptions: shiftOptions(),
      teamOptions: teamOptions(),
      exportStyle: currentExportStyle(),
      currentSortBy: (S.linesView && S.linesView.sortBy) || 'role',
      currentSortDir: (S.linesView && S.linesView.sortDir) || 'asc',
      filterRole: (S.linesView && S.linesView.filterRole) || 'ALL',
      filterShift: (S.linesView && S.linesView.filterShift) || '',
      filterTeam: (S.linesView && S.linesView.filterTeam) || '',
      filterSex: (S.linesView && S.linesView.filterSex) || '',
      filterDuty: (S.linesView && S.linesView.filterDuty) || '',
      filterDay: (S.linesView && S.linesView.filterDay) || '',
      searchCode: (S.linesView && S.linesView.searchCode) || ''
    });
  }

  function writeInlineEdit(detail) {
    if (!detail) return;
    const line = S.findLineById ? S.findLineById(detail.lineId) : null;
    if (!line) return;
    const field = detail.field;
    const value = detail.value;
    if (field === "lineCode") {
      line.lineCode = String(value || "").trim() || line.lineCode;
    } else if (field === "sex") {
      line.sex = value === "F" ? "F" : "M";
    } else if (field === "function") {
      line.function = value === "DFO" || value === "PAX" || value === "BAG" || value === "TRAINING" || value === "-" ? value : "";
    } else if (field === "certPool") {
      var pool = String(value || "").trim().toUpperCase();
      line.certPool = pool === "A" || pool === "B" ? pool : "";
    } else if (field === "emp") {
      if (S.applyLineEmp) S.applyLineEmp(line, value);
    } else if (field === "position") {
      var extraPos = !!(line.isExtra || line.extraPositionId);
      var pos = String(value == null ? "" : value).trim();
      if (extraPos) {
        if (pos) {
          line.position = pos;
          line.extraName = pos;
        }
        line.isStso = false;
        line.isLtso = false;
      } else if (S.applyLineEmp) {
        S.applyLineEmp(line, pos);
      }
    } else if (field === "shift") {
      if (S.applyLineShift) S.applyLineShift(line, value);
    } else if (field === "team") {
      if (S.setLineTeam) S.setLineTeam(detail.lineId, value);
    } else if (field === "start" || field === "end") {
      var timeVal = String(value || "").trim();
      if (S.isValidTimeText && !S.isValidTimeText(timeVal)) return;
      if (field === "start") line.startTime = timeVal;
      if (field === "end") line.endTime = timeVal;
      var shift = S.getShift ? S.getShift(line.shiftId) : null;
      var curStart = line.startTime || (shift ? shift.start : "");
      var curEnd = line.endTime || (shift ? shift.end : "");
      line.shiftLabel = (curStart || "") + "-" + (curEnd || "");
    }
    if (S.updateStatus) S.updateStatus("Updated " + (line.lineCode || detail.lineId));
    refresh();
    if ((field === "emp" || field === "position" || field === "shift" || field === "start" || field === "end") && S.renderCoverageBars) {
      S.renderCoverageBars();
    }
    if (field === "team" && S.renderTeams) S.renderTeams();
    window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }

  function writeDayToggle(detail) {
    if (!detail) return;
    const line = S.findLineById ? S.findLineById(detail.lineId) : null;
    const dayIndex = Number(detail.dayIndex);
    if (!line || !Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) return;
    const off = scheduleOffsetForColumn(dayIndex);
    const key = String(line.id);
    if (!S.state.schedule) S.state.schedule = {};
    var existing = S.state.schedule[key] || S.state.schedule[line.id];
    if (!Array.isArray(existing)) existing = [];
    S.state.schedule[key] = existing;
    while (S.state.schedule[key].length < 7) S.state.schedule[key].push("RDO");
    if (!S.state.functionRotation) S.state.functionRotation = {};
    if (!S.state.functionRotation[key] && S.state.functionRotation[line.id]) {
      S.state.functionRotation[key] = S.state.functionRotation[line.id];
    }

    const cur = S.state.schedule[key][off] || "RDO";
    const bagIdentity = line.function === "BAG";
    const dfo = isDfoCapable(line);

    if (cur !== "WORK") {
      S.state.schedule[key][off] = "WORK";
      if (bagIdentity) {
        setRotationDuty(key, off, "BAG");
      } else if (dfo) {
        setRotationDuty(key, off, "PAX");
      } else {
        setRotationDuty(key, off, null);
      }
    } else if (bagIdentity) {
      S.state.schedule[key][off] = "RDO";
      setRotationDuty(key, off, null);
    } else if (dfo) {
      var rawDuty = (typeof S.getRotationDuty === "function"
        ? S.getRotationDuty(line.id, off)
        : getRotationDutyLocal(line.id, off));
      var duty = rawDuty === "DFO" || rawDuty === "PAX" || !rawDuty ? "PAX" : rawDuty;
      if (duty === "PAX") {
        setRotationDuty(key, off, "BAG");
      } else {
        S.state.schedule[key][off] = "RDO";
        setRotationDuty(key, off, null);
      }
    } else {
      S.state.schedule[key][off] = "RDO";
      setRotationDuty(key, off, null);
    }

    if (S.syncRdoDaysFromSchedule) S.syncRdoDaysFromSchedule(line);
    refresh();
    if (S.renderCoverageBars) S.renderCoverageBars();
    window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }

  function writeDayDutyEdit(detail) {
    if (!detail) return;
    const line = S.findLineById ? S.findLineById(detail.lineId) : null;
    const dayIndex = Number(detail.dayIndex);
    const duty = String(detail.duty || "").toUpperCase();
    if (!line || !Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) return;
    const off = scheduleOffsetForColumn(dayIndex);

    const key = String(line.id);
    if (!S.state.schedule) S.state.schedule = {};
    if (!Array.isArray(S.state.schedule[key])) {
      S.state.schedule[key] = Array(7).fill("RDO");
    }

    if (duty === "OFF" || duty === "RDO" || duty === "") {
      S.state.schedule[key][off] = "RDO";
      setRotationDuty(key, off, null);
    } else {
      S.state.schedule[key][off] = "WORK";
      if (duty === "BAG") setRotationDuty(key, off, "BAG");
      else if (duty === "DFO") setRotationDuty(key, off, "DFO");
      else if (duty === "TRAINING") setRotationDuty(key, off, "TRAINING");
      else if (duty === "-") setRotationDuty(key, off, "-");
      else setRotationDuty(key, off, "PAX");
    }

    if (S.syncRdoDaysFromSchedule) S.syncRdoDaysFromSchedule(line);
    refresh();
    if (S.renderCoverageBars) S.renderCoverageBars();
    window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }

  function writeDayTimeEdit(detail) {
    if (!detail) return;
    const line = S.findLineById ? S.findLineById(detail.lineId) : null;
    const dayIndex = Number(detail.dayIndex);
    const field = detail.field;
    const timeVal = String(detail.value || "").trim();
    if (!line || !Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) return;
    if (S.isValidTimeText && !S.isValidTimeText(timeVal)) return;

    var shift = S.getShift ? S.getShift(line.shiftId) : null;
    var baseStart = line.startTime || (shift ? shift.start : "08:00");
    var baseEnd = line.endTime || (shift ? shift.end : "16:30");

    if (!line.dayTimes) line.dayTimes = {};
    var dowKey = String(dayIndex);
    var curTimes = line.dayTimes[dowKey] || { start: baseStart, end: baseEnd };

    if (field === "start") {
      line.dayTimes[dowKey] = { start: timeVal, end: curTimes.end };
    } else if (field === "end") {
      line.dayTimes[dowKey] = { start: curTimes.start, end: timeVal };
    }

    refresh();
    if (S.renderCoverageBars) S.renderCoverageBars();
    window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }

  function handleSort(detail) {
    if (!detail) return;
    if (!S.linesView) S.linesView = {};
    if (detail.sortBy) S.linesView.sortBy = detail.sortBy;
    if (detail.sortDir) S.linesView.sortDir = detail.sortDir;
    refresh();
  }

  function handleFilter(detail) {
    if (!detail) return;
    if (!S.linesView) S.linesView = {};
    if (detail.filterRole !== undefined) S.linesView.filterRole = detail.filterRole;
    if (detail.filterShift !== undefined) S.linesView.filterShift = detail.filterShift;
    if (detail.filterTeam !== undefined) S.linesView.filterTeam = detail.filterTeam;
    if (detail.filterSex !== undefined) S.linesView.filterSex = detail.filterSex;
    if (detail.filterDuty !== undefined) S.linesView.filterDuty = detail.filterDuty;
    if (detail.filterDay !== undefined) S.linesView.filterDay = detail.filterDay;
    if (detail.searchCode !== undefined) S.linesView.searchCode = detail.searchCode;
    refresh();
  }

  const refresh = () => {
    try {
      const svelteComponent = root._linesTableApp;
      if (svelteComponent) {
        applyProps(svelteComponent);
      } else {
        if (root.childNodes.length) root.innerHTML = '';
        const nextRows = buildRows();
        if (typeof S.applyExportCssVars === "function") S.applyExportCssVars();
        root._linesTableApp = new LinesTable({
          target: root,
          props: {
            rows: Array.isArray(nextRows) ? nextRows : [],
            shiftOptions: shiftOptions(),
            teamOptions: teamOptions(),
            exportStyle: currentExportStyle(),
            currentSortBy: (S.linesView && S.linesView.sortBy) || 'role',
            currentSortDir: (S.linesView && S.linesView.sortDir) || 'asc',
            filterRole: (S.linesView && S.linesView.filterRole) || 'ALL',
            filterShift: (S.linesView && S.linesView.filterShift) || '',
            filterTeam: (S.linesView && S.linesView.filterTeam) || '',
            filterSex: (S.linesView && S.linesView.filterSex) || '',
            filterDuty: (S.linesView && S.linesView.filterDuty) || '',
            filterDay: (S.linesView && S.linesView.filterDay) || '',
            searchCode: (S.linesView && S.linesView.searchCode) || '',
            onInlineEdit: writeInlineEdit,
            onDayToggle: writeDayToggle,
            onDayDutyEdit: writeDayDutyEdit,
            onDayTimeEdit: writeDayTimeEdit,
            onSort: handleSort,
            onFilter: handleFilter
          }
        });
      }
    } catch (err) {
      console.error("lines-table: refresh failed", err);
    }
  };

  refresh();

  if (S.bindLinesUI) S.bindLinesUI();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest?.(".tab-btn");
    if (btn && btn.dataset.tab === "lines") refresh();
  });

  ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((event) => {
    window.addEventListener(event, refresh);
  });

  root.refresh = refresh;
}
