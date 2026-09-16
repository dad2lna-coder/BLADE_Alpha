/** Lines Table module -- Svelte island inside the classic Lines tab.
 * Rows come from filtered/sorted getRowModels. Edits write Scheduler.state.
 */
import LinesTable from './LinesTable.svelte';

export function initLinesTable(scheduler) {
  const S = scheduler || window.Scheduler;
  if (!S) return;

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
      rotationDutyResolver: typeof S.getRotationDuty === "function" ? S.getRotationDuty : null
    };
  }

  function buildRows() {
    const lines = (S.state && Array.isArray(S.state.lines)) ? S.state.lines : [];
    const filtered = typeof S.sortLinesForView === "function" && typeof S.filterLinesForView === "function"
      ? S.sortLinesForView(S.filterLinesForView(lines))
      : lines;
    const schedule = (S.state && S.state.schedule) || {};
    // Svelte uses S.getLineRowModels which reads state internally; pass empty options as no external overrides needed
    const models = typeof S.getLineRowModels === "function"
      ? S.getLineRowModels({ teamResolver: resolvers().teamResolver, shiftResolver: resolvers().shiftResolver, rotationDutyResolver: resolvers().rotationDutyResolver })
      : [];
    return Array.isArray(models) ? models : [];
  }

  function teamOptions() {
    if (S.teams && Array.isArray(S.teams.teams)) return S.teams.teams;
    return [];
  }

  function shiftOptions() {
    return (S.state && Array.isArray(S.state.shifts)) ? S.state.shifts : [];
  }

  function applyProps(comp) {
    if (!comp || typeof comp.$set !== "function") return;
    comp.$set({
      rows: buildRows(),
      shiftOptions: shiftOptions(),
      teamOptions: teamOptions()
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
      line.function = value === "DFO" || value === "PAX" || value === "BAG" ? value : "";
    } else if (field === "emp" || field === "position") {
      if (S.applyLineEmp) S.applyLineEmp(line, value);
    } else if (field === "shift") {
      if (S.applyLineShift) S.applyLineShift(line, value);
    } else if (field === "team") {
      if (S.setLineTeam) S.setLineTeam(detail.lineId, value);
    }
    if (S.updateStatus) S.updateStatus("Updated " + (line.lineCode || detail.lineId));
    refresh();
    if ((field === "emp" || field === "position" || field === "shift") && S.renderCoverageBars) {
      S.renderCoverageBars();
    }
    if (field === "team" && S.renderTeams) S.renderTeams();
  }

  function writeDayToggle(detail) {
    if (!detail) return;
    const line = S.findLineById ? S.findLineById(detail.lineId) : null;
    const dayIndex = Number(detail.dayIndex);
    if (!line || !Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) return;
    const key = line.id;
    if (!S.state.schedule) S.state.schedule = {};
    if (!S.state.schedule[key]) S.state.schedule[key] = [];
    const cur = S.state.schedule[key][dayIndex] || "RDO";
    S.state.schedule[key][dayIndex] = cur === "WORK" ? "RDO" : "WORK";
    if (S.syncRdoDaysFromSchedule) S.syncRdoDaysFromSchedule(line);
    refresh();
    if (S.renderCoverageBars) S.renderCoverageBars();
  }

  const refresh = () => {
    try {
      const svelteComponent = root._linesTableApp;
      if (svelteComponent) {
        applyProps(svelteComponent);
      } else {
        root._linesTableApp = new LinesTable({
          target: root,
          props: {
            rows: buildRows(),
            shiftOptions: shiftOptions(),
            teamOptions: teamOptions(),
            onInlineEdit: writeInlineEdit,
            onDayToggle: writeDayToggle
          }
        });
      }
    } catch (err) {
      console.error("lines-table: refresh failed", err);
    }
  };

  refresh();

  document.addEventListener("click", (e) => {
    const btn = e.target.closest?.(".tab-btn");
    if (btn && btn.dataset.tab === "lines") refresh();
  });

  ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((event) => {
    window.addEventListener(event, refresh);
  });

  root.refresh = refresh;
}
