<script>
  import { normalizeRdoBlock, normalizeRdoPins } from "../../../modules/setup-panel/utils/rdoBlock.js";

  const PHASES = [
    ["auto", "Auto"],
    ["opening", "Opening"],
    ["am", "AM"],
    ["pm", "PM"],
    ["closing", "Closing"]
  ];
  const SHORT_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const BLOCKS = [2, 3, 4];

  let rows = $state([]);
  let groups = $state([]);

  function pinsFor(shift) {
    let pins = normalizeRdoPins(shift);
    if (shift && !Array.isArray(shift.rdoPins) && !normalizeRdoBlock(shift) && Array.isArray(shift.rdoHard)) {
      pins = shift.rdoHard.map(Number).filter((day) => day >= 0 && day <= 6);
    }
    return pins;
  }

  function snapshot() {
    const S = globalThis.Scheduler;
    const shifts = (S && S.state && S.state.shifts) || [];
    groups = (S && S.state && S.state.shiftCrewGroups) || [];
    rows = shifts.map((shift) => {
      const split = !!(shift.segments && shift.segments.length === 2);
      return {
        id: shift.id,
        name: shift.name || "",
        start: split ? shift.segments[0].start : (shift.start || ""),
        end: split ? shift.segments[0].end : (shift.end || ""),
        start2: split ? shift.segments[1].start : "",
        end2: split ? shift.segments[1].end : "",
        phase: shift.phase || "auto",
        paid: shift.paid,
        force: shift.force || 0,
        ltsoForce: shift.ltsoForce || 0,
        stsoForce: shift.stsoForce || 0,
        rdoBlock: normalizeRdoBlock(shift) || 2,
        pins: pinsFor(shift),
        rdoPinRequired: !!shift.rdoPinRequired,
        crewGroupId: shift.crewGroupId || "",
        dayOverride: !!(S && S.shiftHasDayOverrides && S.shiftHasDayOverrides(shift.id))
      };
    });
  }

  export function refresh() {
    snapshot();
  }

  function commit(after) {
    const S = globalThis.Scheduler;
    if (S && S.readShiftsFromDom) S.readShiftsFromDom();
    if (after) after(S);
  }

  function togglePin(row, day, checked) {
    const next = row.pins.filter((pin) => pin !== day);
    if (checked) next.push(day);
    row.pins = next.sort((a, b) => a - b);
    commit();
  }

  function removeShift(id) {
    commit((S) => {
      if (!S || !S.state) return;
      S.state.shifts = (S.state.shifts || []).filter((shift) => shift.id !== id);
      if (S.renderShiftsTable) S.renderShiftsTable();
    });
  }

  function openDays(id) {
    commit((S) => {
      if (S && S.openShiftDayTimesModal) S.openShiftDayTimesModal(id);
    });
  }

  function crewChanged() {
    commit((S) => {
      if (S && S.renderCrewGroupsUI) S.renderCrewGroupsUI();
    });
  }

  snapshot();
</script>

{#each rows as row (row.id)}
  <tr data-shift-id={row.id}>
    <td><input type="text" data-f="name" style:width="5.5rem" bind:value={row.name} onchange={() => commit()} /></td>
    <td><input type="time" data-f="start" bind:value={row.start} onchange={() => commit()} /></td>
    <td><input type="time" data-f="end" bind:value={row.end} onchange={() => commit()} /></td>
    <td><input type="time" data-f="start2" placeholder="Seg 2 start" bind:value={row.start2} onchange={() => commit()} /></td>
    <td><input type="time" data-f="end2" placeholder="Seg 2 end" bind:value={row.end2} onchange={() => commit()} /></td>
    <td>
      <select data-f="phase" bind:value={row.phase} onchange={() => commit()}>
        {#each PHASES as phase (phase[0])}
          <option value={phase[0]}>{phase[1]}</option>
        {/each}
      </select>
    </td>
    <td><input type="number" data-f="paid" min="1" step="0.5" style:width="4rem" bind:value={row.paid} onchange={() => commit()} /></td>
    <td><input type="number" data-f="force" min="0" style:width="4rem" title="TSO force" bind:value={row.force} onchange={() => commit()} /></td>
    <td><input type="number" data-f="ltsoForce" min="0" style:width="4rem" title="LTSO force" bind:value={row.ltsoForce} onchange={() => commit()} /></td>
    <td><input type="number" data-f="stsoForce" min="0" style:width="4rem" title="STSO force" bind:value={row.stsoForce} onchange={() => commit()} /></td>
    <td>
      <div class="rdo-block rdo-mode" data-missing={row.rdoPinRequired && row.pins.length === 0 ? "1" : "0"}>
        <div class="rdo-mode-switch" role="radiogroup" aria-label="Consecutive RDO block">
          {#each BLOCKS as block (block)}
            <label class="rdo-mode-opt" title={"Consecutive block of " + block + " days"}>
              <input type="radio" name={"rdo-block-" + row.id} data-f="rdoBlock" value={block} bind:group={row.rdoBlock} onchange={() => commit()} />
              <span>{block}</span>
            </label>
          {/each}
        </div>
        <label class="rdo-pin-req" title="Checked days are always off. The consecutive block does not have to include them. Turn this on with no day checked and generate fails instead of inventing a pattern.">
          <input type="checkbox" data-f="rdoPinRequired" bind:checked={row.rdoPinRequired} onchange={() => commit()} />
          <span>Pin</span>
        </label>
        <div class="rdo-row rdo-constraint" role="group" aria-label="Always off">
          {#each SHORT_DAYS as short, day (short)}
            <label class="rdo-chk" title={short + " is always off. It does not have to sit next to the consecutive block."}>
              <input type="checkbox" data-pin={day} checked={row.pins.includes(day)} onchange={(event) => togglePin(row, day, event.currentTarget.checked)} />
              <span>{short}</span>
            </label>
          {/each}
        </div>
      </div>
    </td>
    <td class="shift-actions">
      <button
        type="button"
        class={["btn", { "btn-amber": row.dayOverride }]}
        data-day-times={row.id}
        title={row.dayOverride ? "Has per-day time overrides" : "Set different start/end per day of week"}
        onclick={() => openDays(row.id)}
      >Day times…</button>
      <button type="button" class="btn btn-red" data-remove={row.id} onclick={() => removeShift(row.id)}>✕</button>
    </td>
    <td>
      <select data-f="crewGroupId" bind:value={row.crewGroupId} onchange={crewChanged}>
        <option value="">(None / Solo)</option>
        {#each groups as group (group.id)}
          <option value={group.id}>{group.name || group.id}</option>
        {/each}
      </select>
    </td>
  </tr>
{/each}
