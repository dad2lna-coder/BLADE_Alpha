<script>
  import { createVirtualizer } from '@tanstack/svelte-virtual';
  import { fromStore, get } from 'svelte/store';
  import { defaultExportStyle, readableTextHex } from '../shared/lines/exportStyle.js';

  let {
    rows = [],
    mode = 'svelte',
    shiftOptions = [],
    teamOptions = [],
    exportStyle = null,
    onInlineEdit = null,
    onDayToggle = null,
    onDayDutyEdit = null,
    onDayTimeEdit = null,
    onSort = null,
    onFilter = null,
    currentSortBy = 'role',
    currentSortDir = 'asc',
    filterRole = $bindable('ALL'),
    filterShift = $bindable(''),
    filterTeam = $bindable(''),
    filterSex = $bindable(''),
    filterDuty = $bindable(''),
    filterDay = $bindable(''),
    searchCode = $bindable('')
  } = $props();

  const BASE_POSITIONS = ['TSO', 'LTSO', 'STSO'];
  const BASE_EMPS = ['FT', 'PT'];
  const ROW_HEIGHT = 42;
  const BUFFER = 8;
  const DAY_INDEXES = [0, 1, 2, 3, 4, 5, 6];

  let scrollContainer = $state(null);
  let palette = $derived(exportStyle || defaultExportStyle());

  const virtualizerStore = createVirtualizer({
    count: 0,
    getScrollElement: () => scrollContainer,
    estimateSize: () => ROW_HEIGHT,
    overscan: BUFFER,
    initialRect: { width: 800, height: 600 }
  });
  const virtualizer = fromStore(virtualizerStore);

  $effect(() => {
    const count = rows.length;
    const element = scrollContainer;
    get(virtualizerStore).setOptions({
      count,
      getScrollElement: () => element,
      estimateSize: () => ROW_HEIGHT,
      overscan: BUFFER
    });
  });

  let virtualItems = $derived(rows.length ? virtualizer.current.getVirtualItems() : []);
  let totalSize = $derived(virtualizer.current.getTotalSize());
  let paddingTop = $derived(virtualItems.length ? virtualItems[0].start : 0);
  let paddingBottom = $derived(
    virtualItems.length ? Math.max(0, totalSize - virtualItems[virtualItems.length - 1].end) : 0
  );

  function withCurrent(base, value) {
    const v = value == null ? '' : String(value);
    if (!v) return base;
    if (base.indexOf(v) >= 0) return base;
    return base.concat([v]);
  }

  function shiftLabel(opt) {
    if (!opt) return '';
    const name = opt.name || opt.id || '';
    if (opt.segments && Array.isArray(opt.segments) && opt.segments.length === 2) {
      const segStr = opt.segments[0].start + '–' + opt.segments[0].end + ' / ' + opt.segments[1].start + '–' + opt.segments[1].end;
      return (name ? name + ' ' : '') + '(' + segStr + ')';
    }
    if (opt.start && opt.end) return (name ? name + ' ' : '') + '(' + opt.start + '–' + opt.end + ')';
    if (opt.start) return name ? name + ' ' + opt.start : opt.start;
    return name;
  }

  function dutyKey(text) {
    const t = String(text || '').toUpperCase();
    if (t === 'RDO' || t === '—' || t === 'OFF') return 'rdo';
    if (t === '-') return 'dash';
    if (t === 'BAG' || t === 'BAGS') return 'bag';
    if (t === 'DFO') return 'dfo';
    if (t === 'PAX') return 'pax';
    if (t === 'TRAINING') return 'training';
    return null;
  }

  function dayClass(text) {
    const key = dutyKey(text);
    if (key === 'rdo') return 'cell-day-col cell-rdo';
    if (key === 'bag') return 'cell-day-col cell-function-duty cell-bag';
    if (key === 'dfo') return 'cell-day-col cell-function-duty cell-dfo';
    if (key === 'pax') return 'cell-day-col cell-function-duty cell-pax';
    if (key === 'training') return 'cell-day-col cell-function-duty cell-training';
    return 'cell-day-col cell-work';
  }

  function dayStyle(text) {
    const key = dutyKey(text);
    if (!key) return undefined;
    const bg = palette[key];
    if (!bg) return undefined;
    return 'background:' + bg + ';color:' + readableTextHex(bg) + ';';
  }

  function emitEdit(lineId, field, value) {
    onInlineEdit?.({ lineId, field, value });
  }

  function emitDayDuty(lineId, dayIndex, duty) {
    onDayDutyEdit?.({ lineId, dayIndex, duty });
  }

  function emitDayTime(lineId, dayIndex, field, value) {
    onDayTimeEdit?.({ lineId, dayIndex, field, value });
  }

  function handleDayToggle(lineId, dayIndex) {
    onDayToggle?.({ lineId, dayIndex });
  }

  function handleSort(col) {
    let nextDir = 'asc';
    if (currentSortBy === col) {
      nextDir = currentSortDir === 'asc' ? 'desc' : 'asc';
    }
    onSort?.({ sortBy: col, sortDir: nextDir });
  }

  function handleFilterChange() {
    onFilter?.({
      filterRole,
      filterShift,
      filterTeam,
      filterSex,
      filterDuty,
      filterDay,
      searchCode
    });
  }

  function attachScroll(element) {
    scrollContainer = element;
    return () => {
      if (scrollContainer === element) scrollContainer = null;
    };
  }

  function sortIndicator(col) {
    if (currentSortBy !== col) return '';
    return currentSortDir === 'asc' ? ' ▲' : ' ▼';
  }
</script>

<div
  class="lines-table-root"
  style:--export-rdo={palette.rdo || '#000000'}
  style:--export-bag={palette.bag || '#F4B4B4'}
  style:--export-dfo={palette.dfo || '#FFF3A8'}
  style:--export-pax={palette.pax || '#A0C4FF'}
  style:--export-header={palette.header || '#1F4E79'}
>
  {#if mode === 'svelte'}
    <div class="lines-table-header-controls">
      <div class="filter-controls">
        <label>
          Search
          <input
            type="text"
            class="filter-input search-input"
            placeholder="Search line code..."
            bind:value={searchCode}
            oninput={handleFilterChange}
          />
        </label>
        <label>
          Role
          <select class="filter-select" bind:value={filterRole} onchange={handleFilterChange}>
            <option value="ALL">All</option>
            <option value="STSO">STSO</option>
            <option value="LTSO">LTSO</option>
            <option value="TSO">TSO (FT/PT)</option>
          </select>
        </label>
        <label>
          Team
          <select class="filter-select" bind:value={filterTeam} onchange={handleFilterChange}>
            <option value="">All</option>
            <option value="__none__">Unassigned</option>
            {#each teamOptions as team (team.id)}
              <option value={team.id}>{team.name ?? team.id}</option>
            {/each}
          </select>
        </label>
        <label>
          Shift
          <select class="filter-select" bind:value={filterShift} onchange={handleFilterChange}>
            <option value="">All shifts</option>
            {#each shiftOptions as shift (shift.id)}
              <option value={shift.id}>{shiftLabel(shift)}</option>
            {/each}
          </select>
        </label>
        <label>
          Duty
          <select class="filter-select" bind:value={filterDuty} onchange={handleFilterChange}>
            <option value="">All duties</option>
            <option value="BAG">BAG</option>
            <option value="PAX">PAX</option>
            <option value="DFO">DFO</option>
            <option value="-">-</option>
            <option value="TRAINING">TRAINING</option>
            <option value="OFF">OFF / RDO</option>
          </select>
        </label>
        <label>
          On Day
          <select class="filter-select" bind:value={filterDay} onchange={handleFilterChange}>
            <option value="">Any day</option>
            <option value="0">Sun</option>
            <option value="1">Mon</option>
            <option value="2">Tue</option>
            <option value="3">Wed</option>
            <option value="4">Thu</option>
            <option value="5">Fri</option>
            <option value="6">Sat</option>
          </select>
        </label>
        <label>
          Sex
          <select class="filter-select" bind:value={filterSex} onchange={handleFilterChange}>
            <option value="">All</option>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
        </label>
      </div>
    </div>

    <div class="lines-virtual-root" {@attach attachScroll}>
      <table class="data-table lines-editable">
        <thead>
          <tr>
            <th class="sortable col-team" onclick={() => handleSort('team')}>Team{sortIndicator('team')}</th>
            <th class="sortable col-line" onclick={() => handleSort('line')}>Line{sortIndicator('line')}</th>
            <th class="sortable col-shift" onclick={() => handleSort('shift')}>Shift{sortIndicator('shift')}</th>
            <th class="sortable col-time" onclick={() => handleSort('start')}>Start{sortIndicator('start')}</th>
            <th class="col-time">End</th>
            <th class="sortable col-pos" onclick={() => handleSort('role')}>Position{sortIndicator('role')}</th>
            <th class="col-sm">Emp</th>
            <th class="col-sm">Sex</th>
            <th class="col-duty">Duty</th>
            <th class="col-sm">Cert</th>
            <th class="col-rdos">RDOs</th>
            <th class="col-sm">Paid</th>
            <th class="col-day">Sun</th>
            <th class="col-day">Mon</th>
            <th class="col-day">Tue</th>
            <th class="col-day">Wed</th>
            <th class="col-day">Thu</th>
            <th class="col-day">Fri</th>
            <th class="col-day">Sat</th>
            <th class="col-sm">Hrs</th>
          </tr>
        </thead>
        <tbody>
          {#if rows.length === 0}
            <tr><td colspan="20" class="muted" style="padding: 1.5rem; text-align: center;">No matching lines found.</td></tr>
          {:else}
            {#if paddingTop > 0}
              <tr class="spacer-row" style:height="{paddingTop}px"><td colspan="20" class="spacer-cell" style:height="{paddingTop}px"></td></tr>
            {/if}
            {#each virtualItems as item (rows[item.index]?.id ?? item.key)}
              {@const row = rows[item.index]}
              <tr data-line-row={row?.id} style:height="{ROW_HEIGHT}px">
                <td>
                  <select class="line-edit" data-field="team" data-line-id={row?.id} value={row?.teamId ?? ''} onchange={(e) => emitEdit(row?.id, 'team', e.target.value)}>
                    <option value="">—</option>
                    {#each teamOptions as team (team.id)}
                      <option value={team.id}>{team.name ?? team.id}</option>
                    {/each}
                  </select>
                </td>
                <td>
                  <input type="text" class="line-edit line-code-input" data-field="lineCode" data-line-id={row?.id} value={row?.line ?? ''} onchange={(e) => emitEdit(row?.id, 'lineCode', e.target.value)} />
                </td>
                <td>
                  <select class="line-edit" data-field="shift" data-line-id={row?.id} value={row?.shiftId ?? ''} onchange={(e) => emitEdit(row?.id, 'shift', e.target.value)}>
                    <option value="">—</option>
                    {#each shiftOptions as shift (shift.id)}
                      <option value={shift.id}>{shiftLabel(shift)}</option>
                    {/each}
                  </select>
                </td>
                <td>
                  <input type="time" class="line-edit line-time-input" data-field="start" data-line-id={row?.id} value={row?.start ?? ''} onchange={(e) => emitEdit(row?.id, 'start', e.target.value)} />
                </td>
                <td>
                  <input type="time" class="line-edit line-time-input" data-field="end" data-line-id={row?.id} value={row?.end ?? ''} onchange={(e) => emitEdit(row?.id, 'end', e.target.value)} />
                </td>
                <td>
                  <select class="line-edit" data-field="position" data-line-id={row?.id} value={row?.position ?? ''} onchange={(e) => emitEdit(row?.id, 'position', e.target.value)}>
                    <option value="">—</option>
                    {#each withCurrent(BASE_POSITIONS, row?.position) as pos (pos)}
                      <option value={pos}>{pos}</option>
                    {/each}
                  </select>
                </td>
                <td>
                  <select class="line-edit" data-field="emp" data-line-id={row?.id} value={row?.emp ?? ''} onchange={(e) => emitEdit(row?.id, 'emp', e.target.value)}>
                    <option value="">—</option>
                    {#each BASE_EMPS as emp (emp)}
                      <option value={emp}>{emp}</option>
                    {/each}
                  </select>
                </td>
                <td>
                  <select class="line-edit" data-field="sex" data-line-id={row?.id} value={row?.sex ?? ''} onchange={(e) => emitEdit(row?.id, 'sex', e.target.value)}>
                    <option value="">—</option>
                    <option value="M">M</option>
                    <option value="F">F</option>
                  </select>
                </td>
                <td>
                  <select class="line-edit" data-field="function" data-line-id={row?.id} value={row?.function ?? ''} onchange={(e) => emitEdit(row?.id, 'function', e.target.value)}>
                    <option value="">—</option>
                    <option value="-">-</option>
                    <option value="DFO">DFO</option>
                    <option value="BAG">BAG</option>
                    <option value="PAX">PAX</option>
                    <option value="TRAINING">TRAINING</option>
                  </select>
                </td>
                <td>
                  <select class="line-edit" data-field="certPool" data-line-id={row?.id} value={row?.certPool ?? ''} onchange={(e) => emitEdit(row?.id, 'certPool', e.target.value)}>
                    <option value="">—</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                </td>
                <td class="line-rdo-cell">{row?.rdos ?? '—'}</td>
                <td class="line-center">{row?.paid ?? ''}</td>
                {#each DAY_INDEXES as i (i)}
                  <td
                    class={dayClass(row?.dayDuties?.[i] ?? row?.days?.[i])}
                    style={dayStyle(row?.dayDuties?.[i] ?? row?.days?.[i])}
                  >
                    <div class="day-cell-inner">
                      <select
                        class="day-duty-select"
                        value={row?.dayDuties?.[i] === 'OFF' || row?.days?.[i] === 'RDO' ? 'OFF' : (row?.dayDuties?.[i] || 'PAX')}
                        onchange={(e) => emitDayDuty(row?.id, i, e.target.value)}
                      >
                        <option value="PAX">PAX</option>
                        <option value="BAG">BAG</option>
                        <option value="DFO">DFO</option>
                        <option value="-">-</option>
                        <option value="TRAINING">Training</option>
                        <option value="OFF">OFF</option>
                      </select>

                      {#if row?.dayDuties?.[i] !== 'OFF' && row?.days?.[i] !== 'RDO'}
                        <div class="day-times-wrap">
                          <input
                            type="time"
                            class="day-time-input"
                            value={row?.dayStarts?.[i] || row?.start || ''}
                            onchange={(e) => emitDayTime(row?.id, i, 'start', e.target.value)}
                          />
                          <span class="day-time-sep">–</span>
                          <input
                            type="time"
                            class="day-time-input"
                            value={row?.dayEnds?.[i] || row?.end || ''}
                            onchange={(e) => emitDayTime(row?.id, i, 'end', e.target.value)}
                          />
                        </div>
                      {/if}
                    </div>
                  </td>
                {/each}
                <td class="line-hours">{row?.hours ?? ''}</td>
              </tr>
            {/each}
            {#if paddingBottom > 0}
              <tr class="spacer-row" style:height="{paddingBottom}px"><td colspan="20" class="spacer-cell" style:height="{paddingBottom}px"></td></tr>
            {/if}
          {/if}
        </tbody>
      </table>
    </div>
  {:else}
    <div class="muted">Classic Lines mode active</div>
  {/if}
</div>

<style>
  .lines-table-root {
    width: 100%;
    min-height: min(70vh, 720px);
    height: min(70vh, 720px);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--bg, #09090b);
    border: 1px solid var(--border, #27272a);
    border-radius: 6px;
  }
  .lines-table-header-controls {
    padding: 0.5rem 0.75rem;
    background: var(--panel, #18181b);
    border-bottom: 1px solid var(--border, #27272a);
  }
  .filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    font-size: 0.8rem;
  }
  .filter-controls label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    color: var(--console-fg, var(--text, #d4d4d8));
    font-weight: 500;
  }
  .filter-input, .filter-select {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    background: var(--bg, #09090b);
    color: var(--text, #f4f4f5);
    border: 1px solid var(--border, #3f3f46);
    border-radius: 4px;
  }
  .search-input {
    width: 9rem;
  }
  .lines-virtual-root {
    position: relative;
    overflow: auto;
    flex: 1;
    width: 100%;
  }
  .lines-virtual-root table {
    width: 100%;
    min-width: 1250px;
    border-collapse: collapse;
    font-size: 0.8rem;
    color: var(--text, #e4e4e7);
    table-layout: fixed;
  }
  .lines-virtual-root tr {
    height: 42px;
    min-height: 42px;
    max-height: 42px;
    box-sizing: border-box;
  }
  .lines-virtual-root tr.spacer-row,
  .lines-virtual-root tr.spacer-row td {
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    font-size: 0 !important;
    line-height: 0 !important;
    min-height: 0 !important;
    max-height: none !important;
    background: transparent !important;
  }
  .lines-virtual-root th {
    position: sticky;
    top: 0;
    background: var(--panel2, #121215);
    color: var(--amber, #f59e0b);
    font-weight: 600;
    text-align: center;
    padding: 0.5rem 0.4rem;
    border: 1px solid var(--border, #27272a);
    white-space: nowrap;
    z-index: 2;
    font-size: 0.75rem;
    letter-spacing: 0.03em;
    box-sizing: border-box;
  }
  .lines-virtual-root th.sortable {
    cursor: pointer;
    user-select: none;
  }
  .lines-virtual-root th.sortable:hover {
    background: var(--panel, #1c1c20);
    color: var(--amber, #facc15);
  }
  .lines-virtual-root td {
    padding: 0;
    border: 1px solid var(--border, #27272a);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 42px;
    min-height: 42px;
    max-height: 42px;
    box-sizing: border-box;
    text-align: center;
    font-size: 0.8rem;
    vertical-align: middle;
  }
  .lines-virtual-root tbody tr:hover {
    background: rgba(125, 125, 125, 0.08);
  }

  .lines-virtual-root .line-edit {
    background: transparent;
    border: none;
    outline: none;
    color: inherit;
    font-size: inherit;
    font-family: inherit;
    width: 100%;
    height: 100%;
    max-height: 40px;
    padding: 0 0.3rem;
    text-align: center;
    box-sizing: border-box;
    cursor: pointer;
    margin: 0;
    border-radius: 0;
  }
  .lines-virtual-root .line-edit:hover {
    background: rgba(125, 125, 125, 0.1);
  }
  .lines-virtual-root .line-edit:focus {
    background: rgba(125, 125, 125, 0.18);
    box-shadow: inset 0 0 0 1px var(--amber, #f59e0b);
  }
  .lines-virtual-root select.line-edit option {
    background: var(--panel, #18181b);
    color: var(--text, #e4e4e7);
  }
  .lines-virtual-root .line-time-input::-webkit-calendar-picker-indicator {
    filter: invert(0.8);
    cursor: pointer;
  }

  .lines-virtual-root .line-code-input {
    font-weight: 600;
  }
  .lines-virtual-root .line-center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .day-cell-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    max-height: 40px;
    width: 100%;
    padding: 1px 0;
    box-sizing: border-box;
    overflow: hidden;
  }
  .day-duty-select {
    background: transparent;
    border: none;
    outline: none;
    color: inherit;
    font-size: 0.72rem;
    line-height: 1.1;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    width: 100%;
    height: 18px;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  .day-duty-select option {
    background: var(--panel, #18181b);
    color: var(--text, #e4e4e7);
  }
  .day-times-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1px;
    font-size: 0.65rem;
    width: 100%;
    height: 16px;
    margin-top: 0;
    box-sizing: border-box;
  }
  .day-time-input {
    background: transparent;
    border: none;
    outline: none;
    color: inherit;
    font-size: 0.65rem;
    height: 16px;
    line-height: 16px;
    width: 2.7rem;
    padding: 0;
    margin: 0;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
  }
  .day-time-input::-webkit-calendar-picker-indicator {
    display: none;
  }
  .day-time-sep {
    opacity: 0.6;
    font-size: 0.65rem;
  }

  .lines-virtual-root .cell-day-col {
    vertical-align: middle;
  }
  .lines-virtual-root .cell-rdo {
    background: var(--export-rdo, #000);
    color: var(--export-rdo-fg, #888);
  }
  .lines-virtual-root .cell-function-duty.cell-bag {
    background: var(--export-bag, #f4b4b4);
    color: var(--export-bag-fg, #000);
  }
  .lines-virtual-root .cell-function-duty.cell-dfo {
    background: var(--export-dfo, #fff3a8);
    color: var(--export-dfo-fg, #000);
  }
  .lines-virtual-root .cell-function-duty.cell-pax {
    background: var(--export-pax, #a0c4ff);
    color: var(--export-pax-fg, #000);
  }
  .lines-virtual-root .cell-function-duty.cell-training {
    background: var(--export-training, #d8b4f8);
    color: var(--export-training-fg, #000);
  }

  .lines-virtual-root .line-rdo-cell {
    padding: 0 0.4rem;
    font-size: 0.78rem;
  }
  .lines-virtual-root .line-hours {
    font-weight: bold;
    color: var(--amber, #f59e0b);
  }
  .lines-virtual-root .muted {
    color: var(--muted, #888);
    font-style: italic;
  }

  .col-team { width: 4.5rem; min-width: 4rem; }
  .col-line { width: 5.5rem; min-width: 5.5rem; }
  .col-shift { width: 7rem; min-width: 6.5rem; }
  .col-time { width: 5.5rem; min-width: 5rem; }
  .col-pos { width: 5rem; min-width: 4.5rem; }
  .col-duty { width: 5.5rem; min-width: 4.5rem; }
  .col-sm { width: 3.5rem; min-width: 3.2rem; }
  .col-rdos { width: 6rem; min-width: 5.5rem; }
  .col-day { width: 7rem; min-width: 6.5rem; }
</style>
