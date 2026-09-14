/** Lines Table module -- Svelte island inside the classic Lines tab.
 * Reads row models from window.Scheduler.getLineRowModels() and renders
 * a read-only export-shaped table for the first 50 rows.
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

  // Avoid double-mounting on re-init
  if (root._linesTableMounted) return;
  root._linesTableMounted = true;

  // Refresh function to recompute rows and re-mount
  const refresh = () => {
    const models = typeof S.getLineRowModels === "function"
      ? S.getLineRowModels()
      : [];
    const rows = Array.isArray(models) ? models.slice(0, 50) : [];

    // Clean up any previous Svelte instance
    if (root._linesTableApp) {
      root._linesTableApp.$destroy();
      root._linesTableApp = null;
    }

    // Mount new Svelte component using Svelte 4 API
    try {
      root._linesTableApp = new LinesTable({
        target: root,
        props: { rows }
      });
    } catch (err) {
      console.error("lines-table: mount failed", err);
      // Fallback: inject static HTML
      root.innerHTML = `
        <table class="data-table lines-table-svelte">
          <thead>
            <tr>
              <th>Team</th><th>Line</th><th>Shift</th><th>Start</th><th>End</th>
              <th>Position</th><th>Emp</th><th>Sex</th><th>Function</th><th>RDOs</th><th>Paid</th>
              ${["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => `<th>${d}</th>`).join("")}
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => {
              const team = row.team || "";
              const line = row.lineCode || "";
              const shift = row.shiftName || "";
              const start = row.start || "";
              const end = row.end || "";
              const position = row.position || "";
              const emp = row.emp || "";
              const sex = row.sex || "";
              const func = row.function || "";
              const paid = row.paid || 0;
              const days = row.days || new Array(7).fill("RDO");
              const hours = row.hours || 0;
              const cells = [
                team, line, shift, start, end, position, emp, sex, func,
                row.rdos || "—", paid,
                ...days.map(d => `<td>${d}</td>`)
              ].join("");
              return `<tr data-line-row="${row.line || row.id}"><td>${cells}</td></tr>`;
            }).join("")}
          </tbody>
        </table>
      `;
    }
  };

  refresh();

  // Re-render on tab show
  document.addEventListener("click", (e) => {
    const btn = e.target.closest?.(".tab-btn");
    if (btn && btn.dataset.tab === "lines") {
      refresh();
    }
  });
}