<script>
  let start = $state("");
  let weeks = $state(1);
  let seed = $state("random");

  function schedulerState() {
    return globalThis.Scheduler?.state || {};
  }

  export function pullPeriod() {
    const st = schedulerState();
    const S = globalThis.Scheduler;
    const date = st.startDate && S?.toDateInputValue ? S.toDateInputValue(st.startDate) : start;
    start = date || "";
    const count = Number(st.weekCount);
    weeks = Number.isFinite(count) && count > 0 ? Math.max(1, Math.min(8, count)) : 1;
    seed = st.generateSeed || "random";
  }

  function pushPeriod() {
    const S = globalThis.Scheduler;
    if (!S) return;
    if (!S.state) S.state = {};
    const count = Math.max(1, Math.min(8, Number(weeks) || 1));
    weeks = count;
    S.state.weekCount = count;
    S.state.generateSeed = String(seed || "random");
    if (start && S.parseStartDate) S.state.startDate = S.parseStartDate(start);
    if (S.refreshConsoleChrome) S.refreshConsoleChrome();
  }

  pullPeriod();
</script>

<div class="card" id="card-period">
  <div class="section-title">Schedule period</div>
  <div class="period-row">
    <label>Schedule start <input type="date" id="cfg-start" bind:value={start} onchange={pushPeriod} /></label>
    <label>Weeks <input type="number" id="cfg-weeks" min="1" max="8" style:width="4.5rem" bind:value={weeks} onchange={pushPeriod} /></label>
    <label>Generate seed <input type="text" id="cfg-generate-seed" placeholder="random" style:width="6.5rem" title="Leave as 'random' or enter a number for reproducible scheduling" bind:value={seed} onchange={pushPeriod} /></label>
  </div>
</div>
