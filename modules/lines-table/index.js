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
    root._linesTableApp = new LinesTable({
      target: root,
      props: { rows }
    });
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
