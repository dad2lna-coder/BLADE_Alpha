<script>
  let ftM = $state(10);
  let ftF = $state(10);
  let ptM = $state(4);
  let ptF = $state(4);
  let ptHours = $state(4);
  let ptDays = $state(3);
  let ltsoM = $state(1);
  let ltsoF = $state(1);
  let stsoM = $state(2);
  let stsoF = $state(2);
  let esti = $state(0);
  let msti = $state(0);

  function num(value, fallback) {
    if (value == null || value === "") return fallback;
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  export function pullFte() {
    const st = globalThis.Scheduler?.state || {};
    ftM = num(st.ftM, 10);
    ftF = num(st.ftF, 10);
    ptM = num(st.ptM, 4);
    ptF = num(st.ptF, 4);
    ptHours = num(st.ptHoursPerDay, 4);
    ptDays = num(st.ptDaysPerWeek, 3);
    ltsoM = num(st.ltsoM, 1);
    ltsoF = num(st.ltsoF, 1);
    stsoM = num(st.stsoM, 2);
    stsoF = num(st.stsoF, 2);
    esti = num(st.esti, 0);
    msti = num(st.msti, 0);
  }

  function pushFte() {
    const S = globalThis.Scheduler;
    if (!S?.applyFte) return;
    S.applyFte({
      ftM, ftF, ptM, ptF,
      ptHoursPerDay: ptHours,
      ptDaysPerWeek: ptDays,
      ltsoM, ltsoF, stsoM, stsoF, esti, msti
    });
  }

  pullFte();
</script>

<div class="fte-block">
  <div class="fte-role">FT TSO</div>
  <div class="fte-sex-row">
    <label>Male <input type="number" id="cfg-ft-m" min="0" style:width="4.5rem" bind:value={ftM} onchange={pushFte} /></label>
    <label>Female <input type="number" id="cfg-ft-f" min="0" style:width="4.5rem" bind:value={ftF} onchange={pushFte} /></label>
  </div>
  <div class="fte-role">PT TSO</div>
  <div class="fte-sex-row">
    <label>Male <input type="number" id="cfg-pt-m" min="0" style:width="4.5rem" bind:value={ptM} onchange={pushFte} /></label>
    <label>Female <input type="number" id="cfg-pt-f" min="0" style:width="4.5rem" bind:value={ptF} onchange={pushFte} /></label>
  </div>
  <div class="fte-sex-row">
    <label>Hours/day <input type="number" id="cfg-pt-hours" min="1" max="12" style:width="4.5rem" bind:value={ptHours} onchange={pushFte} /></label>
    <label>Days/week <input type="number" id="cfg-pt-days" min="1" max="6" style:width="4.5rem" bind:value={ptDays} onchange={pushFte} /></label>
  </div>
  <div class="fte-role">LTSO</div>
  <div class="fte-sex-row">
    <label>Male <input type="number" id="cfg-ltso-m" min="0" style:width="4.5rem" bind:value={ltsoM} onchange={pushFte} /></label>
    <label>Female <input type="number" id="cfg-ltso-f" min="0" style:width="4.5rem" bind:value={ltsoF} onchange={pushFte} /></label>
  </div>
  <div class="fte-role">STSO</div>
  <div class="fte-sex-row">
    <label>Male <input type="number" id="cfg-stso-m" min="0" style:width="4.5rem" bind:value={stsoM} onchange={pushFte} /></label>
    <label>Female <input type="number" id="cfg-stso-f" min="0" style:width="4.5rem" bind:value={stsoF} onchange={pushFte} /></label>
  </div>
  <div class="fte-role">Training dept</div>
  <p class="muted fte-note">ESTI and MSTI are training classes — no sex, not ops FTE, not drawn from FT/PT TSO pools. Use these counts; do not add them as extra positions.</p>
  <div class="fte-sex-row">
    <label>ESTI <input type="number" id="cfg-esti" min="0" style:width="4.5rem" bind:value={esti} onchange={pushFte} /></label>
    <label>MSTI <input type="number" id="cfg-msti" min="0" style:width="4.5rem" bind:value={msti} onchange={pushFte} /></label>
  </div>
</div>
