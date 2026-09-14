<script>
  /** Lines Table -- read-only export-shaped table (first 50 rows) */
  export let rows = [];

  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Columns match the export shape from lines-row-model.js
  const COLUMNS = [
    { key: "team", label: "Team" },
    { key: "line", label: "Line" },
    { key: "shift", label: "Shift" },
    { key: "start", label: "Start" },
    { key: "end", label: "End" },
    { key: "position", label: "Position" },
    { key: "emp", label: "Emp" },
    { key: "sex", label: "Sex" },
    { key: "function", label: "Function" },
    { key: "rdos", label: "RDOs" },
    { key: "paid", label: "Paid" },
    ...DAY_NAMES.map((d) => ({ key: d, label: d })),
    { key: "hours", label: "Hours" },
  ];

  function esc(text) {
    if (text == null) return "";
    return String(text)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">")
      .replace(/"/g, "'\"'")
      .replace(/'/g, "&#039;");
  }

  function cellValue(row, colKey) {
    if (DAY_NAMES.includes(colKey)) {
      const idx = DAY_NAMES.indexOf(colKey);
      return esc(row.days?.[idx] ?? "RDO");
    }
    return esc(row[colKey] ?? "");
  }
</script>

<div class="lines-table-root">
  {#if rows && rows.length}
    <table class="data-table lines-table-svelte">
      <thead>
        <tr>
          {#each COLUMNS as col}
            <th>{col.label}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rows as row}
          <tr data-line-row={row.line ?? row.line}>
            {#each COLUMNS as col}
              <td class={DAY_NAMES.includes(col.key) ? "day-cell" : ""}>
                {cellValue(row, col.key)}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p class="muted">Generate or import to build lines</p>
  {/if}
</div>

<style>
  .lines-table-root {
    width: 100%;
    overflow-x: auto;
  }
  .lines-table-svelte {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.78rem;
    table-layout: fixed;
  }
  .lines-table-svelte :global(th) {
    position: sticky;
    top: 0;
    background: var(--console-bg, #0c0c0c);
    color: var(--console-fg, #e8e8e8);
    font-weight: 600;
    text-align: left;
    padding: 0.35rem 0.5rem;
    border-bottom: 2px solid #333;
    white-space: nowrap;
    z-index: 1;
  }
  .lines-table-svelte :global(tbody tr:hover td) {
    background: rgba(255, 255, 255, 0.03);
  }
  .day-cell {
    text-align: center;
    min-width: 44px;
    max-width: 70px;
  }
</style>
