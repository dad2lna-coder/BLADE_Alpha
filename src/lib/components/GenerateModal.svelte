<script>
  import {
    getModalClassOptions,
    readTargetView,
    setActiveTargetClass,
    stepTarget,
    readWeekdayView,
    readParityChrome,
    setActiveParityClass,
    setParityBand,
    runParityCheck,
    approveParitySelection,
    parityResultView,
    readDfoChrome,
    setActiveDfoClass,
    runDfoPropose,
    approveDfoSelection,
    dfoResultView
  } from "../../../modules/setup-panel/actions/generateModal.js";

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let shown = $state(false);
  let options = $state([]);
  let targetClass = $state("STSO");
  let targetInfo = $state("");
  let targetRows = $state([]);
  let weekdayEmpty = $state(true);
  let weekdayRows = $state([]);
  let parityClass = $state("STSO");
  let parityBands = $state([]);
  let parityVisible = $state(false);
  let paritySummary = $state("");
  let parityEmpty = $state("");
  let parityRows = $state([]);
  let dfoClass = $state("STSO");
  let dfoVisible = $state(false);
  let dfoSummary = $state("");
  let dfoMode = $state("");
  let dfoBaggageCerts = $state(0);
  let dfoEmpty = $state("");
  let dfoRows = $state([]);
  let dfoBaggageChecked = $state(true);

  function host() {
    return globalThis.Scheduler;
  }

  export function refresh() {
    const S = host();
    if (!S) return;
    options = getModalClassOptions(S);
    const target = readTargetView(S);
    targetClass = target.classKey;
    targetInfo = target.info;
    targetRows = target.rows;
    const week = readWeekdayView(S);
    weekdayEmpty = week.empty;
    weekdayRows = week.rows;
    const parity = readParityChrome(S);
    parityClass = parity.classKey;
    parityBands = parity.bands;
    const parityResult = parityResultView(S._parityReportResult);
    parityVisible = parityResult.visible;
    paritySummary = parityResult.summary;
    parityEmpty = parityResult.empty;
    parityRows = parityResult.rows;
    const dfo = readDfoChrome(S);
    dfoClass = dfo.classKey;
    const dfoResult = dfoResultView(S._dfoCertBalanceResult);
    dfoVisible = dfoResult.visible;
    dfoSummary = dfoResult.summary;
    dfoMode = dfoResult.mode;
    dfoBaggageCerts = dfoResult.baggageCerts;
    dfoEmpty = dfoResult.empty;
    dfoRows = dfoResult.rows;
    dfoBaggageChecked = true;
  }

  export function open() {
    shown = true;
    refresh();
  }

  export function close() {
    shown = false;
  }

  function shut(event) {
    event.preventDefault();
    close();
  }

  function generateAll(event) {
    event.preventDefault();
    const S = host();
    if (S && S.generate) S.generate();
    refresh();
  }

  function generateOne(key, event) {
    event.preventDefault();
    const S = host();
    const targets = S && S._perShiftTargets ? S._perShiftTargets[key] : null;
    if (S && S.generateClass) S.generateClass(key, targets || null);
    refresh();
  }

  function onTargetClass(event) {
    setActiveTargetClass(host(), event.currentTarget.value);
    refresh();
  }

  function onStep(shiftId, kind) {
    stepTarget(host(), shiftId, kind);
    refresh();
  }

  function onParityClass(event) {
    setActiveParityClass(host(), event.currentTarget.value);
    refresh();
  }

  function onParityBand(band, event) {
    setParityBand(host(), band.key, event.currentTarget.checked);
    refresh();
  }

  function checkParity(event) {
    event.preventDefault();
    runParityCheck(host());
    refresh();
  }

  function approveParity(event) {
    event.preventDefault();
    const picked = parityRows.some((row) => row.checked);
    approveParitySelection(host(), parityRows);
    if (picked) refresh();
  }

  function onDfoClass(event) {
    setActiveDfoClass(host(), event.currentTarget.value);
    refresh();
  }

  function proposeDfo(event) {
    event.preventDefault();
    runDfoPropose(host());
    refresh();
  }

  function approveDfo(event) {
    event.preventDefault();
    approveDfoSelection(host(), dfoRows);
    refresh();
  }
</script>

<div
  id="generate-modal"
  style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100000;align-items:center;justify-content:center"
  style:display={shown ? "flex" : "none"}
  aria-hidden={shown ? "false" : "true"}
>
  <div class="card" style="max-width:92vw;max-height:90vh;overflow:auto;margin:4vh auto;background:var(--bg-card,#fff);padding:1.25rem;border-radius:6px;box-shadow:0 4px 20px rgba(0,0,0,0.3)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;border-bottom:1px solid #ddd;padding-bottom:0.5rem">
      <h3 style="margin:0;font-size:1.2rem">Setup & Schedule Generator</h3>
      <button type="button" class="btn btn-red" id="generate-modal-close" onclick={shut}>✕</button>
    </div>

    <div class="card" style="background:var(--bg-subtle,#f8f9fa);padding:0.75rem;margin-bottom:1rem">
      <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap">
        <button type="button" class="btn btn-amber" id="btn-generate-all" onclick={generateAll}>[GEN] Full Roster Generate</button>
        <span style="font-weight:600;color:var(--muted)">Or Generate Single Class:</span>
        <div id="generate-class-buttons" style="display:flex;gap:0.5rem;flex-wrap:wrap">
          {#each options as opt (opt.key)}
            <button type="button" class="btn btn-amber btn-sm btn-generate-class" data-class-key={opt.key} onclick={(event) => generateOne(opt.key, event)}>Generate {opt.label} Only</button>
          {/each}
        </div>
      </div>
    </div>

    <div class="card" style="padding:0.75rem;margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;flex-wrap:wrap;gap:0.5rem">
        <div style="display:flex;align-items:center;gap:0.5rem">
          <h4 style="margin:0;font-size:1rem">Per-Shift Class Targets & Steppers</h4>
          <label style="font-weight:600;margin-left:0.5rem">Target Class:
            <select id="generate-target-class-select" style="padding:0.2rem 0.5rem;font-size:0.9rem" bind:value={targetClass} onchange={onTargetClass}>
              {#each options as opt (opt.key)}
                <option value={opt.key}>{opt.label}</option>
              {/each}
            </select>
          </label>
        </div>
        <div id="generate-target-headcount-info" style="font-weight:600;font-size:0.9rem;color:var(--muted)">{targetInfo}</div>
      </div>

      <div class="lines-scroll" style="max-height:30vh;border:1px solid #ddd;border-radius:4px">
        <table class="data-table" style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th>Shift</th>
              <th style="text-align:center">Male Target</th>
              <th style="text-align:center">Female Target</th>
              <th style="text-align:center">Class Total</th>
            </tr>
          </thead>
          <tbody id="generate-shift-targets-tbody">
            {#each targetRows as row (row.id)}
              <tr data-shift-id={row.id}>
                <td>
                  <strong>{row.name}</strong>
                  {#if row.time}<span class="muted"> ({row.time})</span>{/if}
                </td>
                <td style="text-align:center;white-space:nowrap">
                  <button type="button" class="btn btn-sm btn-target-m-down" data-shift-id={row.id} disabled={row.train} onclick={() => onStep(row.id, "m-")}>-</button>
                  <span style="display:inline-block;width:2rem;text-align:center;font-weight:600">{row.m}</span>
                  <button type="button" class="btn btn-sm btn-target-m-up" data-shift-id={row.id} disabled={!row.canIncM} onclick={() => onStep(row.id, "m+")}>+</button>
                </td>
                <td style="text-align:center;white-space:nowrap">
                  <button type="button" class="btn btn-sm btn-target-f-down" data-shift-id={row.id} disabled={row.train} onclick={() => onStep(row.id, "f-")}>-</button>
                  <span style="display:inline-block;width:2rem;text-align:center;font-weight:600">{row.f}</span>
                  <button type="button" class="btn btn-sm btn-target-f-up" data-shift-id={row.id} disabled={!row.canIncF} onclick={() => onStep(row.id, "f+")}>+</button>
                </td>
                <td style="text-align:center;white-space:nowrap">
                  <button type="button" class="btn btn-sm btn-target-tot-down" data-shift-id={row.id} onclick={() => onStep(row.id, "t-")}>-</button>
                  <span style="display:inline-block;width:2.5rem;text-align:center;font-weight:700">{row.total}</span>
                  <button type="button" class="btn btn-sm btn-target-tot-up" data-shift-id={row.id} disabled={!row.canIncTot} onclick={() => onStep(row.id, "t+")}>+</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card" style="padding:0.75rem;margin-bottom:1rem">
      <h4 style="margin:0 0 0.5rem 0;font-size:1rem">Weekday Band Duty Counts (Male / Female / Total)</h4>
      <div class="lines-scroll" style="max-height:30vh;border:1px solid #ddd;border-radius:4px">
        <table class="data-table" style="width:100%;border-collapse:collapse">
          <thead>
            <tr>
              <th>Band / Shift</th>
              {#each DAYS as day (day)}
                <th style="text-align:center">{day}</th>
              {/each}
            </tr>
          </thead>
          <tbody id="generate-weekday-bands-tbody">
            {#if weekdayEmpty}
              <tr><td colspan="8" class="muted" style="text-align:center">No lines generated yet. Click Generate to populate.</td></tr>
            {:else}
              {#each weekdayRows as row (row.key)}
                <tr>
                  <td><strong>{row.label}</strong></td>
                  {#each row.cells as cell, i (DAYS[i])}
                    <td style="text-align:center;font-size:0.85rem">{cell}</td>
                  {/each}
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>

    <details class="card" style="padding:0.75rem;margin-bottom:1rem">
      <summary style="font-weight:700;font-size:1rem;cursor:pointer">RDO Parity (Fairness) Report</summary>
      <p class="muted" style="margin:0.5rem 0">Identifies RDO pattern share imbalances between sexes for the selected class across chosen band groups. Proposals swap RDO patterns between lines without moving shift or sex.</p>
      <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;margin-bottom:0.75rem">
        <label style="font-weight:600">Parity Class:
          <select id="generate-parity-class-select" style="padding:0.25rem 0.5rem;font-size:0.9rem" bind:value={parityClass} onchange={onParityClass}>
            {#each options as opt (opt.key)}
              <option value={opt.key}>{opt.label}</option>
            {/each}
          </select>
        </label>
        <div style="display:flex;align-items:center;gap:0.5rem">
          <span style="font-weight:600">Bands:</span>
          <div id="generate-parity-bands-select" style="display:flex;flex-wrap:wrap;gap:0.4rem;max-height:15vh;overflow-y:auto;border:1px solid #ddd;padding:0.35rem;border-radius:4px">
            {#each parityBands as band (band.key)}
              <label style="font-weight:normal;font-size:0.85rem;white-space:nowrap">
                <input type="checkbox" class="parity-band-cb" data-band-key={band.key} checked={band.checked} onchange={(event) => onParityBand(band, event)} />
                {band.label}
              </label>
            {/each}
          </div>
        </div>
        <button type="button" class="btn btn-amber btn-sm" id="btn-generate-check-parity" onclick={checkParity}>Check Parity</button>
      </div>

      {#if parityVisible}
        <div id="generate-parity-results-wrap">
          <div id="generate-parity-summary" style="margin-bottom:0.5rem;font-weight:600;font-size:0.9rem">{paritySummary}</div>
          <div class="lines-scroll" style="max-height:25vh;border:1px solid #ddd;padding:0.5rem;border-radius:4px;margin-bottom:0.5rem">
            <table class="data-table" style="width:100%;border-collapse:collapse">
              <thead>
                <tr>
                  <th>Line A (Sex, Shift, RDO Before)</th>
                  <th>Line B (Sex, Shift, RDO Before)</th>
                  <th>Proposed RDO Swap</th>
                </tr>
              </thead>
              <tbody id="generate-parity-proposals-tbody">
                {#if parityEmpty}
                  <tr><td colspan="3" class="muted" style="text-align:center">{parityEmpty}</td></tr>
                {:else}
                  {#each parityRows as row (row.key)}
                    <tr data-line-a-id={row.lineAId} data-line-b-id={row.lineBId}>
                      <td>
                        <input type="checkbox" class="parity-swap-cb" bind:checked={row.checked} />
                        <strong>{row.codeA}</strong> ({row.sexA}, {row.shiftA}) RDO: {row.rdoA}
                      </td>
                      <td><strong>{row.codeB}</strong> ({row.sexB}, {row.shiftB}) RDO: {row.rdoB}</td>
                      <td><strong style="color:var(--amber,#d97706)">{row.note}</strong></td>
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>
          <div style="display:flex;justify-content:flex-end">
            <button type="button" class="btn btn-amber" id="btn-generate-approve-parity" onclick={approveParity}>Approve RDO Swaps</button>
          </div>
        </div>
      {/if}
    </details>

    <details class="card" style="padding:0.75rem;margin-bottom:1rem">
      <summary style="font-weight:700;font-size:1rem;cursor:pointer">DFO Cert Balance</summary>
      <p class="muted" style="margin:0.5rem 0">If DFO cert counts differ across shifts, proposes moving certs between same-sex people without moving lines. If cert counts match, proposes a baggage day reshuffle.</p>
      <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;margin-bottom:0.75rem">
        <label style="font-weight:600">DFO Class:
          <select id="generate-dfo-class-select" style="padding:0.25rem 0.5rem;font-size:0.9rem" bind:value={dfoClass} onchange={onDfoClass}>
            {#each options as opt (opt.key)}
              <option value={opt.key}>{opt.label}</option>
            {/each}
          </select>
        </label>
        <button type="button" class="btn btn-amber btn-sm" id="btn-generate-propose-dfo" onclick={proposeDfo}>Propose DFO Fix</button>
      </div>

      {#if dfoVisible}
        <div id="generate-dfo-results-wrap">
          <div id="generate-dfo-summary" style="margin-bottom:0.5rem;font-weight:600;font-size:0.9rem">{dfoSummary}</div>
          <div class="lines-scroll" style="max-height:25vh;border:1px solid #ddd;padding:0.5rem;border-radius:4px;margin-bottom:0.5rem">
            <table class="data-table" style="width:100%;border-collapse:collapse">
              <thead>
                <tr>
                  <th>Item / Line</th>
                  <th>Sex</th>
                  <th>Shift</th>
                  <th>Current Status</th>
                  <th>Proposed Change</th>
                </tr>
              </thead>
              <tbody id="generate-dfo-proposals-tbody">
                {#if dfoMode === "baggage_reshuffle"}
                  <tr>
                    <td style="text-align:center"><input type="checkbox" class="dfo-cert-swap-cb" bind:checked={dfoBaggageChecked} /></td>
                    <td><strong>Baggage Duty Rotation</strong></td>
                    <td>All</td>
                    <td>Matched per shift ({dfoBaggageCerts} certs)</td>
                    <td><strong style="color:var(--amber,#d97706)">Reshuffle baggage duty days across work days (resolveBagDuties)</strong></td>
                  </tr>
                {:else if dfoEmpty}
                  <tr><td colspan="5" class="muted" style="text-align:center">{dfoEmpty}</td></tr>
                {:else}
                  {#each dfoRows as row (`${row.donorCode}:${row.receiverCode}:${row.idx}`)}
                    <tr data-prop-idx={row.idx}>
                      <td style="text-align:center"><input type="checkbox" class="dfo-cert-swap-cb" bind:checked={row.checked} /></td>
                      <td><strong>{row.donorCode} → {row.receiverCode}</strong></td>
                      <td><span class="badge" style:background={row.sex === "M" ? "#007bff" : "#e83e8c"} style="color:#fff;padding:0.15rem 0.4rem;border-radius:3px">{row.sex}</span></td>
                      <td>{row.donorShift} ({row.donorCode}) & {row.receiverShift} ({row.receiverCode})</td>
                      <td><strong style="color:var(--amber,#d97706)">{row.note}</strong></td>
                    </tr>
                  {/each}
                {/if}
              </tbody>
            </table>
          </div>
          <div style="display:flex;justify-content:flex-end">
            <button type="button" class="btn btn-amber" id="btn-generate-approve-dfo" onclick={approveDfo}>Approve Fix</button>
          </div>
        </div>
      {/if}
    </details>

    <div style="display:flex;justify-content:flex-end;margin-top:1rem">
      <button type="button" class="btn" id="btn-generate-modal-done" onclick={shut}>Done</button>
    </div>
  </div>
</div>
