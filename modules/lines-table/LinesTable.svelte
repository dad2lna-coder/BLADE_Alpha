<script>
  import { createVirtualizer } from '@tanstack/svelte-virtual';
  import { onMount, onDestroy } from 'svelte';

  export let rows = [];
  export let mode = 'svelte'; // 'svelte' | 'classic'
  export let shiftOptions = [];

  let virtualRoot;
  let virtualizer;
  let rowHeight = 42; // Match CSS for .lines-editable td height

  // Custom events to communicate with classic code
  function dispatch(event, detail) {
    const e = new CustomEvent(event, { detail, bubbles: true, composed: true });
    window.dispatchEvent(e);
  }

  onMount(() => {
    if (mode !== 'svelte') return;

    // Virtualizer configuration
    virtualizer = createVirtualizer({
      count: rows.length,
      getScrollElement: () => virtualRoot,
      estimateSize: () => rowHeight,
      overscan: 5,
      getItemKey: (index) => rows[index]?.id ?? index,
      onChange: (v, sync) => {
        // Optional: handle scroll position changes
      },
    });

    // Listen for custom events
    const handlers = {
      'lines:inline-edit': (e) => handleInlineEdit(e.detail),
      'lines:day-toggle': (e) => handleDayToggle(e.detail),
      'lines:filter-change': () => refreshRows(),
      'lines:sort-change': () => refreshRows(),
      'lines:coverage-refresh': () => refreshRows(),
      'lines:request-render': () => refreshRows(),
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      window.addEventListener(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        window.removeEventListener(event, handler);
      });
    };
  });

  function refreshRows() {
    if (mode === 'svelte') {
      virtualizer?.setOptions({ count: rows.length });
    }
  }

  function handleInlineEdit(detail) {
    dispatch('lines:inline-edit-response', detail);
  }

  function handleDayToggle(detail) {
    dispatch('lines:day-toggle-response', detail);
  }

  function getRdoText(rdoDays, rdoHard) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = (rdoDays || []).map(Number).filter(d => Number.isInteger(d) && d >= 0 && d <= 6);
    const text = days.length ? days.map(d => dayNames[d] || d).join(',') : '—';
    return rdoHard ? text + ' (hard)' : text;
  }

  function getShiftLabel(shiftId) {
    const shift = shiftOptions?.find(s => s.id === shiftId);
    if (shift && shift.start && shift.end) return shift.start + '–' + shift.end;
    if (shift && shift.start) return shift.start;
    return '';
  }

  function getFunctionClass(duty) {
    if (duty === 'BAG') return 'cell-function-duty cell-bag';
    if (duty === 'DFO') return 'cell-function-duty cell-dfo';
    if (duty === 'PAX') return 'cell-function-duty cell-pax';
    return '';
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
              <td><select
                class="line-edit"
                data-field="team"
                data-line-id={row?.id}
                on:change={(e) => handleInlineEdit({
                  lineId: row?.id,
                  field: 'team',
                  value: e.target.value
                })}
              >
                <option value="">—</option>
                <option value="T1">T1</option>
                <option value="T2">T2</option>
                <option value="T3">T3</option>
              </select></td>

              <td><input
                type="text"
                class="line-edit line-code-input"
                data-field="lineCode"
                data-line-id={row?.id}
                value={row?.lineCode}
                on:input={(e) => handleInlineEdit({
                  lineId: row?.id,
                  field: 'lineCode',
                  value: e.target.value
                })}
              /></td>

              <td><select
                class="line-edit"
                data-field="shift"
                data-line-id={row?.id}
                on:change={(e) => handleInlineEdit({
                  lineId: row?.id,
                  field: 'shift',
                  value: e.target.value
                })}
              >
                <option value="">—</option>
                <option value="S1">S1 (03:30–12:00)</option>
                <option value="S2">S2 (04:00–12:30)</option>
                <option value="S3">S3 (12:00–20:30)</option>
                <option value="S4">S4 (14:30–23:00)</option>
                <option value="S5">S5 (10:30–20:00)</option>
              </select></td>

              <td>{getShiftLabel(row?.shiftId)}</td>
              <td>{getShiftLabel(row?.shiftId)}</td>

              <td><select
                class="line-edit"
                data-field="position"
                data-line-id={row?.id}
                on:change={(e) => handleInlineEdit({
                  lineId: row?.id,
                  field: 'position',
                  value: e.target.value
                })}
              >
                <option value="">—</option>
                <option value="TSO">TSO</option>
                <option value="LTSO">LTSO</option>
                <option value="STSO">STSO</option>
              </select></td>

              <td><select
                class="line-edit"
                data-field="emp"
                data-line-id={row?.id}
                on:change={(e) => handleInlineEdit({
                  lineId: row?.id,
                  field: 'emp',
                  value: e.target.value
                })}
              >
                <option value="">—</option>
                <option value="FT">FT</option>
                <option value="PT">PT</option>
                <option value="LTSO">LTSO</option>
                <option value="STSO">STSO</option>
              </select></td>

              <td><select
                class="line-edit"
                data-field="sex"
                data-line-id={row?.id}
                on:change={(e) => handleInlineEdit({
                  lineId: row?.id,
                  field: 'sex',
                  value: e.target.value
                })}
              >
                <option value="">—</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select></td>

              <td><select
                class="line-edit"
                data-field="function"
                data-line-id={row?.id}
                on:change={(e) => handleInlineEdit({
                  lineId: row?.id,
                  field: 'function',
                  value: e.target.value
                })}
              >
                <option value="">—</option>
                <option value="DFO">DFO</option>
                <option value="BAG">BAG</option>
                <option value="PAX">PAX</option>
              </select></td>

              <td class="line-rdo-cell">{getRdoText(row?.rdoDays, row?.rdoHard)}</td>

              <td>{row?.paid}</td>

              {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
                <td
                  class="cell-toggle {getFunctionClass(row?.days?.find(d => d.dayIndex === day)?.duty)}"
                  data-line-id={row?.id}
                  data-day={day}
                  on:click={() => handleDayToggle({
                    lineId: row?.id,
                    day: day,
                    next: 'RDO'
                  })}
                >
                  {row?.days?.find(d => d.dayIndex === day)?.label || 'RDO'}
                </td>
              {/each}

              <td class="line-hours">{row?.hours}</td>
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

<style>
  .lines-table-root {
    width: 100%;
    overflow-x: auto;
    position: relative;
  }

  .lines-virtual-root {
    position: relative;
    overflow: auto;
    height: 100%;
    width: 100%;
  }

  .lines-virtual-root table {
    width: max-content;
    min-width: 1100px;
    border-collapse: collapse;
    font-size: 0.78rem;
    table-layout: fixed;
    position: relative;
  }

  .lines-virtual-root th {
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

  .lines-virtual-root td {
    padding: 0.35rem 0.5rem;
    border-bottom: 1px solid var(--border);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 3.5rem;
    height: 42px;
    line-height: 1.2;
  }

  .lines-virtual-root .line-edit {
    max-width: none;
    min-width: 5.5rem;
    height: 2.25rem;
    font-size: 0.85rem;
  }

  .lines-virtual-root .line-code-input {
    min-width: 6.5rem;
    max-width: 12rem;
  }

  .lines-virtual-root .cell-toggle {
    cursor: pointer;
    user-select: none;
    transition: all 0.15s ease;
  }

  .lines-virtual-root .cell-toggle:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: scale(1.02);
  }

  .lines-virtual-root .cell-toggle:active {
    filter: brightness(1.25);
    outline: 2px solid var(--amber);
  }

  .lines-virtual-root .cell-work {
    color: var(--green);
    font-family: var(--mono);
    font-weight: 600;
  }

  .lines-virtual-root .cell-rdo {
    background: #000;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
  }

  .lines-virtual-root .cell-function-duty {
    font-weight: 600;
  }

  .lines-virtual-root .cell-function-duty.cell-bag {
    background: #f4b4b4;
    color: #111;
  }

  .lines-virtual-root .cell-function-duty.cell-dfo {
    background: #ffc000;
    color: #111;
  }

  .lines-virtual-root .cell-function-duty.cell-pax {
    background: #a0c4ff;
    color: #111;
  }

  .lines-virtual-root .line-rdo-cell {
    white-space: nowrap;
    font-size: 0.8rem;
    cursor: pointer;
  }

  .lines-virtual-root .line-hours {
    font-weight: bold;
    color: var(--amber);
  }

  .lines-virtual-root .lines-group-row td {
    background: var(--panel2);
    color: var(--amber);
    font-weight: 600;
    border-top: 2px solid var(--border);
  }
</style>