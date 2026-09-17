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
      rotationDutyResolver: typeof S.getRotationDuty === "function" ? S.getRotationDuty : getRotationDutyLocal
    };
  }

  function getRotationDutyLocal(lineId, dayIndex) {
    const key = String(lineId);
    const rot = S.state && S.state.functionRotation && S.state.functionRotation[key];
    if (!Array.isArray(rot)) return null;
    const duty = rot[dayIndex];
    return duty === "BAG" || duty === "PAX" ? duty : null;
  }

  function setRotationDuty(lineId, dayIndex, duty) {
    var key = String(lineId);
    if (!S.state.functionRotation) S.state.functionRotation = {};
    if (!S.state.functionRotation[key]) S.state.functionRotation[key] = [];
    while (S.state.functionRotation[key].length <= dayIndex) S.state.functionRotation[key].push(null);
    S.state.functionRotation[key][dayIndex] = duty; // "BAG" | "PAX" | null
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
    if (!S.state.functionRotation) S.state.functionRotation = {};

    const cur = S.state.schedule[key][dayIndex] || "RDO";
    const bagIdentity = line.function === "BAG";
    const dfo = isDfoCapable(line);

    if (cur !== "WORK") {
      S.state.schedule[key][dayIndex] = "WORK";
      if (bagIdentity) {
        setRotationDuty(key, dayIndex, "BAG");
      } else if (dfo) {
        setRotationDuty(key, dayIndex, "PAX");
      } else {
        setRotationDuty(key, dayIndex, null);
      }
    } else if (bagIdentity) {
      S.state.schedule[key][dayIndex] = "RDO";
      setRotationDuty(key, dayIndex, null);
    } else if (dfo) {
      const duty = (typeof S.getRotationDuty === "function"
        ? S.getRotationDuty(line.id, dayIndex)
        : getRotationDutyLocal(line.id, dayIndex)) || "PAX";
      if (duty === "PAX" || !duty) {
        setRotationDuty(key, dayIndex, "BAG");
      } else {
        // BAG → RDO (locked v1: RDO → WORK+PAX → WORK+BAG → RDO)
        S.state.schedule[key][dayIndex] = "RDO";
        setRotationDuty(key, dayIndex, null);
      }
    } else {
      S.state.schedule[key][dayIndex] = "RDO";
      setRotationDuty(key, dayIndex, null);
    }

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
