<script>
  import { createVirtualizer } from '@tanstack/svelte-virtual';
  import { onMount } from 'svelte';

  export let rows = [];
  export let mode = 'svelte'; // 'svelte' | 'classic'
  export let shiftOptions = [];
  export let teamOptions = [];
  export let onInlineEdit = null;
  export let onDayToggle = null;

  let virtualRoot;
  let virtualizer;
  let rowHeight = 42; // Match CSS for .lines-editable td height

  onMount(() => {
    if (mode !== 'svelte') return;

    virtualizer = createVirtualizer({
      count: rows.length,
      getScrollElement: () => virtualRoot,
      estimateSize: () => rowHeight,
      overscan: 5,
      getItemKey: (index) => rows[index]?.id ?? index,
    });
  });

  $: if (virtualizer && mode === 'svelte') {
    virtualizer.setOptions({ count: rows.length });
  }

  function shiftLabel(opt) {
    if (!opt) return '';
    const name = opt.name || opt.id || '';
    if (opt.start && opt.end) return (name ? name + ' ' : '') + '(' + opt.start + '–' + opt.end + ')';
    if (opt.start) return name ? name + ' ' + opt.start : opt.start;
    return name;
  }

  function dayClass(text, fn) {
    const t = String(text || '').toUpperCase();
    if (t === 'RDO' || t === '—') return 'cell-toggle cell-rdo';
    if (fn === 'BAG') return 'cell-toggle cell-function-duty cell-bag';
    if (fn === 'DFO') return 'cell-toggle cell-function-duty cell-dfo';
    if (fn === 'PAX') return 'cell-toggle cell-function-duty cell-pax';
    return 'cell-toggle cell-work';
  }

  function emitEdit(lineId, field, value) {
    onInlineEdit?.({ lineId, field, value });
  }

  function emitDay(lineId, dayIndex) {
    onDayToggle?.({ lineId, dayIndex });
  }
</script>

<div class="lines-table-root">
  {#if mode === 'svelte'}
    <div
      class="lines-virtual-root"
      bind:this={virtualRoot}
      style="height: 100%; overflow: auto; position: relative;"
    >
      <table class="data-table lines-editable" style="width: max-content; min-width: 1100px;">
        <thead>
          <tr>
            <th>Team</th>
            <th>Line</th>
            <th>Shift</th>
            <th>Start</th>
            <th>End</th>
            <th>Position</th>
            <th>Emp</th>
            <th>Sex</th>
            <th>Function</th>
            <th>RDOs</th>
            <th>Paid</th>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody style="position: relative; height: 0;">
          {#each virtualizer?.getVirtualItems() ?? [] as virtualRow}
            {@const row = rows[virtualRow.index]}
            <tr
              style="position: absolute; top: {virtualRow.start}px; left: 0; width: 100%; height: {virtualRow.size}px;"
              data-line-row={row?.id}
            >
              <td>
                <select
                  class="line-edit"
                  data-field="team"
                  data-line-id={row?.id}
                  value={row?.teamId ?? ''}
                  on:change={(e) => emitEdit(row?.id, 'team', e.target.value)}
                >
                  <option value="">—</option>
                  {#each teamOptions as team}
                    <option value={team.id}>{team.name ?? team.id}</option>
                  {/each}
                </select>
              </td>

              <td>
                <input
                  type="text"
                  class="line-edit line-code-input"
                  data-field="lineCode"
                  data-line-id={row?.id}
                  value={row?.line ?? ''}
                  on:input={(e) => emitEdit(row?.id, 'lineCode', e.target.value)}
                />
              </td>

              <td>
                <select
                  class="line-edit"
                  data-field="shift"
                  data-line-id={row?.id}
                  value={row?.shiftId ?? ''}
                  on:change={(e) => emitEdit(row?.id, 'shift', e.target.value)}
                >
                  <option value="">—</option>
                  {#each shiftOptions as shift}
                    <option value={shift.id}>{shiftLabel(shift)}</option>
                  {/each}
                </select>
              </td>

              <td>{row?.start ?? ''}</td>
              <td>{row?.end ?? ''}</td>

              <td>
                <select
                  class="line-edit"
                  data-field="position"
                  data-line-id={row?.id}
                  value={row?.position ?? ''}
                  on:change={(e) => emitEdit(row?.id, 'position', e.target.value)}
                >
                  <option value="">—</option>
                  <option value="TSO">TSO</option>
                  <option value="LTSO">LTSO</option>
                  <option value="STSO">STSO</option>
                </select>
              </td>

              <td>
                <select
                  class="line-edit"
                  data-field="emp"
                  data-line-id={row?.id}
                  value={row?.emp ?? ''}
                  on:change={(e) => emitEdit(row?.id, 'emp', e.target.value)}
                >
                  <option value="">—</option>
                  <option value="FT">FT</option>
                  <option value="PT">PT</option>
                  <option value="LTSO">LTSO</option>
                  <option value="STSO">STSO</option>
                </select>
              </td>

              <td>
                <select
                  class="line-edit"
                  data-field="sex"
                  data-line-id={row?.id}
                  value={row?.sex ?? ''}
                  on:change={(e) => emitEdit(row?.id, 'sex', e.target.value)}
                >
                  <option value="">—</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
              </td>

              <td>
                <select
                  class="line-edit"
                  data-field="function"
                  data-line-id={row?.id}
                  value={row?.function ?? ''}
                  on:change={(e) => emitEdit(row?.id, 'function', e.target.value)}
                >
                  <option value="">—</option>
                  <option value="DFO">DFO</option>
                  <option value="BAG">BAG</option>
                  <option value="PAX">PAX</option>
                </select>
              </td>

              <td class="line-rdo-cell">{row?.rdos ?? '—'}</td>

              <td>{row?.paid ?? ''}</td>

              {#each [0, 1, 2, 3, 4, 5, 6] as i}
                <td
                  class={dayClass(row?.days?.[i], row?.function)}
                  data-line-id={row?.id}
                  data-day-index={i}
                  on:click={() => emitDay(row?.id, i)}
                >
                  {row?.days?.[i] ?? ''}
                </td>
              {/each}

              <td class="line-hours">{row?.hours ?? ''}</td>
            </tr>
          {/each}
        </tbody>
        <div style="height: {(virtualizer?.getTotalSize() ?? 0)}px;"></div>
      </table>
    </div>
  {:else}
    <div class="muted">Classic Lines mode active</div>
  {/if}
</div>
