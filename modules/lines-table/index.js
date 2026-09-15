/** Lines Table module -- Svelte island inside the classic Lines tab.
 * Reads row models from window.Scheduler.getLineRowModels() and renders
 * a virtualized export-shaped table. Supports Svelte 4 + TanStack Virtual.
 *
 * Feature flag: window.Scheduler.__USE_SVELTE_LINES = true enables this path.
 * When false (default), classic renderLines() runs as before.
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

  // Feature flag / classic bypass
  if (S.__USE_SVELTE_LINES === false || !S.__USE_SVELTE_LINES) {
    // Classic mode: ensure classic table is visible and Svelte is hidden
    root.innerHTML = '';
    root.style.display = 'none';
    // Make sure classic can still render
    if (S.renderLines) S.renderLines();
    return;
  }

  // Avoid double-mounting on re-init
  if (root._linesTableMounted) return;
  root._linesTableMounted = true;

  // Refresh function to recompute rows and re-mount
  const refresh = () => {
    try {
      // Pull full filtered/sorted row models from classic S
      const models = typeof S.getLineRowModels === "function"
        ? S.getLineRowModels()
        : [];

      // Set rows on the Svelte component
      const svelteComponent = root._linesTableApp;
      if (svelteComponent) {
        svelteComponent.rows = Array.isArray(models) ? models : [];
        // Trigger reactive update
        if (svelteComponent.$$ && svelteComponent.$$[Symbol.for('$bond')]) {
          svelteComponent.$$[Symbol.for('$bond')]();
        }
      } else {
        // New mount
        root._linesTableApp = new LinesTable({
          target: root,
          props: { rows: Array.isArray(models) ? models : [] }
        });
      }
    } catch (err) {
      console.error("lines-table: refresh failed", err);
      // Fallback to classic table injection
      if (S.renderLines) S.renderLines();
    }
  };

  // Initial render
  refresh();

  // Re-render on tab show
  document.addEventListener("click", (e) => {
    const btn = e.target.closest?.(".tab-btn");
    if (btn && btn.dataset.tab === "lines") {
      refresh();
    }
  });

  // Also hook into custom events dispatched from Svelte / classic
  const eventHandlers = {
    'lines:request-render': refresh,
    'lines:filter-change': refresh,
    'lines:sort-change': refresh,
    'lines:coverage-refresh': refresh,
  };

  Object.entries(eventHandlers).forEach(([event, handler]) => {
    root.addEventListener(event, handler);
  });

  // Export refresh for manual steering
  root.refresh = refresh;
  root.setRows = (newRows) => {
    root._linesTableApp.rows = newRows;
    if (root._linesTableApp.$$ && root._linesTableApp.$$[Symbol.for('$bond')]) {
      root._linesTableApp.$$[Symbol.for('$bond')]();
    }
  };
}