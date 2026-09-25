<script>
  import { defaultExportStyle, readableTextHex } from '../shared/lines/exportStyle.js';

  export let rows = [];
  export let mode = 'svelte'; // 'svelte' | 'classic'
  export let shiftOptions = [];
  export let teamOptions = [];
  export let exportStyle = defaultExportStyle();
  export let onInlineEdit = null;
  export let onDayToggle = null;

  function shiftLabel(opt) {
    if (!opt) return '';
    const name = opt.name || opt.id || '';
    if (opt.start && opt.end) return (name ? name + ' ' : '') + '(' + opt.start + '–' + opt.end + ')';
    if (opt.start) return name ? name + ' ' + opt.start : opt.start;
    return name;
  }

  function dutyKey(text) {
    const t = String(text || '').toUpperCase();
    if (t === 'RDO' || t === '—' || t === '-') return 'rdo';
    if (t === 'BAG' || t === 'BAGS') return 'bag';
    if (t === 'DFO') return 'dfo';
    if (t === 'PAX') return 'pax';
    return null;
  }

  function dayClass(text) {
    const key = dutyKey(text);
    if (key === 'rdo') return 'cell-toggle cell-rdo';
    if (key === 'bag') return 'cell-toggle cell-function-duty cell-bag';
    if (key === 'dfo') return 'cell-toggle cell-function-duty cell-dfo';
    if (key === 'pax') return 'cell-toggle cell-function-duty cell-pax';
    return 'cell-toggle cell-work';
  }

  function dayStyle(text) {
    const key = dutyKey(text);
    if (!key) return undefined;
    const style = exportStyle || defaultExportStyle();
    const bg = style[key];
    if (!bg) return undefined;
    return 'background:' + bg + ';color:' + readableTextHex(bg) + ';';
  }

  function emitEdit(lineId, field, value) {
    onInlineEdit?.({ lineId, field, value });
  }

  function emitDay(lineId, dayIndex) {
    onDayToggle?.({ lineId, dayIndex });
  }
</script>

<div
  class="lines-table-root"
  style="min-height: min(70vh, 720px); height: min(70vh, 720px); width: 100%; --export-rdo: {exportStyle?.rdo || '#000000'}; --export-bag: {exportStyle?.bag || '#F4B4B4'}; --export-dfo: {exportStyle?.dfo || '#FFF3A8'}; --export-pax: {exportStyle?.pax || '#A0C4FF'}; --export-header: {exportStyle?.header || '#1F4E79'};"
>
  {#if mode === 'svelte'}
    <div class="lines-virtual-root" style="height: 100%; overflow: auto; position: relative;">
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
            <th>Cert pool</th>
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
        <tbody>
          {#each rows as row (row.id)}
            <tr data-line-row={row?.id}>
              <td>
                <select class="line-edit" data-field="team" data-line-id={row?.id} value={row?.teamId ?? ''} on:change={(e) => emitEdit(row?.id, 'team', e.target.value)}>
                  <option value="">—</option>
                  {#each teamOptions as team}
                    <option value={team.id}>{team.name ?? team.id}</option>
                  {/each}
                </select>
              </td>
              <td>
                <input type="text" class="line-edit line-code-input" data-field="lineCode" data-line-id={row?.id} value={row?.line ?? ''} on:input={(e) => emitEdit(row?.id, 'lineCode', e.target.value)} />
              </td>
              <td>
                <select class="line-edit" data-field="shift" data-line-id={row?.id} value={row?.shiftId ?? ''} on:change={(e) => emitEdit(row?.id, 'shift', e.target.value)}>
                  <option value="">—</option>
                  {#each shiftOptions as shift}
                    <option value={shift.id}>{shiftLabel(shift)}</option>
                  {/each}
                </select>
              </td>
              <td>{row?.start ?? ''}</td>
              <td>{row?.end ?? ''}</td>
              <td>
                <select class="line-edit" data-field="position" data-line-id={row?.id} value={row?.position ?? ''} on:change={(e) => emitEdit(row?.id, 'position', e.target.value)}>
                  <option value="">—</option>
                  <option value="TSO">TSO</option>
                  <option value="LTSO">LTSO</option>
                  <option value="STSO">STSO</option>
                </select>
              </td>
              <td>
                <select class="line-edit" data-field="emp" data-line-id={row?.id} value={row?.emp ?? ''} on:change={(e) => emitEdit(row?.id, 'emp', e.target.value)}>
                  <option value="">—</option>
                  <option value="FT">FT</option>
                  <option value="PT">PT</option>
                  <option value="LTSO">LTSO</option>
                  <option value="STSO">STSO</option>
                </select>
              </td>
              <td>
                <select class="line-edit" data-field="sex" data-line-id={row?.id} value={row?.sex ?? ''} on:change={(e) => emitEdit(row?.id, 'sex', e.target.value)}>
                  <option value="">—</option>
                  <option value="M">M</option>
                  <option value="F">F</option>
                </select>
              </td>
              <td>
                <select class="line-edit" data-field="function" data-line-id={row?.id} value={row?.function ?? ''} on:change={(e) => emitEdit(row?.id, 'function', e.target.value)}>
                  <option value="">—</option>
                  <option value="DFO">DFO</option>
                  <option value="BAG">BAG</option>
                  <option value="PAX">PAX</option>
                </select>
              </td>
              <td>
                <select class="line-edit" data-field="certPool" data-line-id={row?.id} value={row?.certPool ?? ''} on:change={(e) => emitEdit(row?.id, 'certPool', e.target.value)}>
                  <option value="">—</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </td>
              <td class="line-rdo-cell">{row?.rdos ?? '—'}</td>
              <td>{row?.paid ?? ''}</td>
              {#each [0, 1, 2, 3, 4, 5, 6] as i}
                <td class={dayClass(row?.dayDuties?.[i] ?? row?.days?.[i])} style={dayStyle(row?.dayDuties?.[i] ?? row?.days?.[i])} data-line-id={row?.id} data-day-index={i} on:click={() => emitDay(row?.id, i)}>
                  {row?.days?.[i] ?? ''}
                </td>
              {/each}
              <td class="line-hours">{row?.hours ?? ''}</td>
            </tr>
          {:else}
            <tr><td colspan="20" class="muted">No lines — Generate or Import first.</td></tr>
          {/each}
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
    overflow-x: auto;
    position: relative;
  }
  .lines-virtual-root { position: relative; overflow: auto; height: 100%; width: 100%; }
  .lines-virtual-root table { width: max-content; min-width: 1100px; border-collapse: collapse; font-size: 0.78rem; table-layout: fixed; }
  .lines-virtual-root th { position: sticky; top: 0; background: var(--console-bg, #0c0c0c); color: var(--console-fg, #e8e8e8); font-weight: 600; text-align: left; padding: 0.35rem 0.5rem; border-bottom: 2px solid #333; white-space: nowrap; z-index: 1; }
  .lines-virtual-root td { padding: 0.35rem 0.5rem; border-bottom: 1px solid var(--border); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 3.5rem; height: 42px; line-height: 1.2; }
  .lines-virtual-root .line-edit { max-width: none; min-width: 5.5rem; height: 2.25rem; font-size: 0.85rem; }
  .lines-virtual-root .line-code-input { min-width: 6.5rem; max-width: 12rem; }
  .lines-virtual-root .cell-toggle { cursor: pointer; user-select: none; transition: all 0.15s ease; }
  .lines-virtual-root .cell-toggle:hover { filter: brightness(1.08); transform: scale(1.02); }
  .lines-virtual-root .cell-toggle:active { filter: brightness(1.25); outline: 2px solid var(--amber); }
  .lines-virtual-root .cell-work { color: var(--green); font-family: var(--mono); font-weight: 600; }
  .lines-virtual-root .cell-rdo { background: var(--export-rdo); color: var(--export-rdo-fg); font-weight: bold; cursor: pointer; }
  .lines-virtual-root .cell-function-duty { font-weight: 600; }
  .lines-virtual-root .cell-function-duty.cell-bag { background: var(--export-bag); color: var(--export-bag-fg); }
  .lines-virtual-root .cell-function-duty.cell-dfo { background: var(--export-dfo); color: var(--export-dfo-fg); }
  .lines-virtual-root .cell-function-duty.cell-pax { background: var(--export-pax); color: var(--export-pax-fg); }
  .lines-virtual-root .line-rdo-cell { white-space: nowrap; font-size: 0.8rem; cursor: pointer; }
  .lines-virtual-root .line-hours { font-weight: bold; color: var(--amber); }
  .lines-virtual-root .lines-group-row td { background: var(--panel2); color: var(--amber); font-weight: 600; border-top: 2px solid var(--border); }
  .lines-virtual-root .muted { color: var(--muted, #888); font-style: italic; }
</style>
