<script>
  import { readRdoMatrixView } from "../../../modules/setup-panel/actions/shiftsTable.js";

  let shown = $state(false);
  let filter = $state("STSO");
  let options = $state(["STSO", "LTSO", "TSO", "FT TSO", "PT TSO"]);
  let kind = $state("no-lines");
  let patterns = $state([]);
  let rows = $state([]);

  function host() {
    return globalThis.Scheduler;
  }

  export function refresh() {
    const select = typeof document !== "undefined" ? document.getElementById("rdo-matrix-pos-select") : null;
    const picked = select && select.value ? select.value : filter;
    const view = readRdoMatrixView(host() || { state: {} }, picked);
    options = view.options;
    filter = view.filter;
    kind = view.kind;
    patterns = view.patterns;
    rows = view.rows;
  }

  export function open() {
    shown = true;
    refresh();
  }

  export function close() {
    shown = false;
  }
</script>

<div
  id="rdo-matrix-modal"
  style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:99999;align-items:center;justify-content:center"
  style:display={shown ? "flex" : "none"}
  aria-hidden={shown ? "false" : "true"}
>
  <div class="card" style="max-width:90vw;max-height:85vh;overflow:auto;margin:5vh auto;background:var(--bg-card,#fff);padding:1.25rem;border-radius:6px;box-shadow:0 4px 20px rgba(0,0,0,0.25)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;border-bottom:1px solid #ddd;padding-bottom:0.5rem">
      <h3 style="margin:0;font-size:1.15rem">RDO × Sex Matrix</h3>
      <button type="button" class="btn btn-red" id="rdo-matrix-close">✕</button>
    </div>
    <div class="toolbar" style="margin-bottom:1rem;display:flex;align-items:center;justify-content:space-between;gap:0.75rem;flex-wrap:wrap">
      <label style="font-weight:600">Position Class:
        <select id="rdo-matrix-pos-select" style="padding:0.25rem 0.5rem;font-size:0.9rem" bind:value={filter}>
          {#each options as opt (opt)}
            <option value={opt}>{opt}</option>
          {/each}
        </select>
      </label>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
        <button type="button" class="btn" id="btn-rdo-export-all">Export CSV (All)</button>
        <button type="button" class="btn btn-amber" id="btn-rdo-respin-open">Respin RDOs…</button>
        <button type="button" class="btn btn-amber" id="btn-rebalance-pt-modal">Rebalance PT TSO shifts</button>
        <button type="button" class="btn btn-amber" id="btn-rebalance-ft-modal">Rebalance shifts…</button>
        <button type="button" class="btn btn-amber" id="btn-rebalance-dfo-modal">Rebalance DFO…</button>
        <button type="button" class="btn btn-amber" id="btn-swap-sex-modal">Swap M/F between shifts…</button>
      </div>
    </div>
    <div id="rdo-matrix-table-wrap" class="lines-scroll" style="max-height:60vh">
      {#if kind === "no-lines"}
        <p class="muted">No generated schedule lines available. Click <strong>GENERATE</strong> first.</p>
      {:else if kind === "no-match"}
        <p class="muted">No lines found for position class <strong>{filter}</strong>.</p>
      {:else}
        <table class="data-table" style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th>Shift</th>
              <th>Sex</th>
              {#each patterns as pat (pat)}
                <th style="text-align:center">{pat}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each rows as row (row.key)}
              <tr>
                <td><strong>{row.shift}</strong></td>
                <td>
                  <span class="badge" style:background={row.sex === "M" ? "#007bff" : "#e83e8c"} style="color:#fff;padding:0.15rem 0.4rem;border-radius:3px">{row.sex}</span>
                </td>
                {#each row.counts as count, i (patterns[i])}
                  <td style="text-align:center" style:font-weight={count > 0 ? "bold" : "normal"} style:opacity={count > 0 ? "1" : "0.4"}>{count}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    </div>
  </div>
</div>
