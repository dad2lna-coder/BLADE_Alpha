# BLADE Alpha — Lines Tab Svelte Cutover Implementation Checklist

## Executive Summary
Replace the classic vanilla-JS Lines table (`render.js::renderLines()` + `line-colors.js`) with a Svelte 4 island (`modules/lines-table/`) that uses **TanStack Virtual** (`@tanstack/svelte-virtual@3.13.39`, Svelte 4 pinned). Preserve all existing state mutations, event hooks, and classic bypass safety.

---

## 1. Build & Load Pipeline

| Step | Action | Verification |
|------|--------|--------------|
| 1.1 | Add `modules/lines-table/src/LinesTable.svelte` (Svelte 4 component) | `npm run build:lines-table` emits `modules/lines-table/dist/lines-table.js` + CSS |
| 1.2 | Update `vite.lines-table.config.mjs` to output **single ESM bundle** (`format: "es"`, no external `svelte`/`@tanstack/*`) | Bundle loads via `<script type="module">` in `index.html` |
| 1.3 | Add **dynamic import** in `index.html` after `js/main.js`: `import('/modules/lines-table/dist/lines-table.js').then(m => m.initLinesTable(window.Scheduler))` | Svelte island mounts into `#lines-table-root` on Lines tab show |
| 1.4 | Add `#lines-table-root` container in `index.html` (replaces current `lines-tbody` block) — see DOM mapping below | Classic table hidden; Svelte root shown |

---

## 2. DOM Mapping — Classic → Svelte

| Classic Selector | Svelte Equivalent | Notes |
|------------------|-------------------|-------|
| `#lines-thead` | `<thead>` inside Svelte component | Keep header in Svelte for virtual scroll alignment |
| `#lines-tbody` | **Removed** — replaced by virtualized `<tbody>` | TanStack Virtual renders only visible rows |
| `.lines-scroll-wide` | Svelte component root `div` with `overflow:auto` | Virtualizer `getScrollElement` returns this |
| `#lines-table-root` | **New** mount point (empty `<div>` in HTML) | Svelte `target: root` |
| `.line-edit` selects/inputs | Svelte `<select>`/`<input>` with `bind:value` | Emit `line-change` CustomEvent → classic handler |
| `.cell-toggle` (RDO/WORK click) | Svelte row cell `@click` handler | Emit `cell-toggle` CustomEvent → classic handler |
| `.lines-group-row` | Svelte group header rows (virtualized separately) | Treat as 0-height or fixed-height items in virtualizer |

**HTML change** (index.html Lines panel):
```html
<!-- REMOVE: <div class="lines-scroll lines-scroll-wide"><table class="data-table lines-editable"><thead id="lines-thead"></thead><tbody id="lines-tbody"></tbody></table></div> -->
<!-- ADD: -->
<div id="lines-table-root" class="lines-table-root"></div>
<!-- Keep #lines-toolbar above (filters) — classic controls stay -->
```

---

## 3. State Mutation / Refresh Hooks — Exact Signature

All hooks are **CustomEvents** dispatched on `window` (or `document`) so classic code can listen without import coupling.  
Classic side: `document.addEventListener('lines:hook-name', handler)`.

| Hook | When Fired | Payload | Classic Consumer |
|------|------------|---------|------------------|
| `lines:request-render` | Any classic mutation that needs table refresh (Generate, Import, Filter change, Tab show) | `{ source: 'generate' \| 'import' \| 'filter' \| 'tab-show' \| 'inline-edit' \| 'day-toggle' \| 'coverage-refresh' }` | Svelte: `window.addEventListener('lines:request-render', refresh)` |
| `lines:inline-edit` | User commits an inline edit (select/input blur or Enter) | `{ lineId: number, field: 'lineCode' \| 'shift' \| 'emp' \| 'sex' \| 'function' \| 'team', value: string \| number }` | Classic: `bindLinesUI` change handler logic |
| `lines:day-toggle` | User clicks a day cell (RDO↔WORK) | `{ lineId: number, day: number, next: 'WORK' \| 'RDO' }` | Classic: click handler in `bindLinesUI` |
| `lines:filter-change` | Toolbar filter dropdown changes | `{ filterRole, filterShift, filterSex, filterTeam }` | Classic: `bindLinesUI` change listeners |
| `lines:sort-change` | Group/sort/order dropdown changes | `{ groupBy, sortBy, sortDir }` | Classic: `bindLinesUI` change listeners |
| `lines:coverage-refresh` | Coverage matrix/bars re-rendered (affects line colors) | `{}` | Svelte: calls `S.paintLineColors()` or re-fetches row models |
| `lines:scroll-index` | Virtual scroll changed (for debug/sync) | `{ startIndex, endIndex, total }` | Optional — analytics |

**Classic → Svelte data pull** (no push):  
Svelte calls `S.getLineRowModels()` (must exist on `window.Scheduler`) to get **full filtered/sorted array** of row models.  
Row model shape (matching `render.js` row data + color flags):
```ts
interface LineRowModel {
  id: number;
  lineCode: string;
  shiftId: string;
  shiftName: string;
  shiftLabel: string;
  empClass: 'FT'|'PT'|'LTSO'|'STSO';
  sex: 'M'|'F';
  function: 'DFO'|'PAX'|'BAG'|'';
  rdoText: string;          // "Mon,Wed (hard)"
  rdoDays: number[];
  rdoHard: boolean;
  teamName: string;
  teamId: string;
  days: Array<{
    dayIndex: number;
    value: 'WORK'|'RDO';
    duty: 'BAG'|'DFO'|'PAX'|null;
    label: string;          // shiftLabel or "WORK"
  }>;
  hours: number;
  // color flags (from line-colors.js logic)
  isBagDay: boolean[];
  isDfoDay: boolean[];
  isRdoDay: boolean[];
}
```

**Svelte must call** `S.getLineRowModels()` on every `lines:request-render` and on mount.

---

## 4. Classic Bypass / Safety Net

| Mechanism | Implementation |
|-----------|----------------|
| **Feature flag** | `window.Scheduler.__USE_SVELTE_LINES = false` (default `false` until validated). Toggle via `?lines=svelte` URL param in `main.js` init. |
| **Classic render guard** | In `render.js::renderLines()`: `if (S.__USE_SVELTE_LINES) return;` — early exit, zero DOM work. |
| **Svelte mount guard** | In `modules/lines-table/index.js::initLinesTable()`: `if (!S.__USE_SVELTE_LINES) return;` — no mount, no listeners. |
| **Fallback** | If Svelte mount throws, catch → `console.error` → `S.__USE_SVELTE_LINES = false` → `S.renderLines()` (classic). |
| **Dev override** | `localStorage.setItem('blade:lines:svelte', '1')` forces Svelte; `'0'` forces classic. Read in `main.js` before init. |

---

## 5. Integration Points — Per Feature

### 5.1 Inline Edits (select/input in toolbar + row cells)
- **Classic**: `bindLinesUI` change listener on `.line-edit` → mutates `S.state.lines[i]` → `S.renderLines()`.
- **Svelte**: Row components emit `lines:inline-edit` on `blur`/`Enter`. Classic listener applies mutation, then dispatches `lines:request-render` with `{source:'inline-edit'}`.
- **Hook**: `document.addEventListener('lines:inline-edit', e => { /* classic mutate */ S.renderAll(); /* or */ window.dispatchEvent(new CustomEvent('lines:request-render', {detail:{source:'inline-edit'}})); })`

### 5.2 Day Toggles (RDO ↔ WORK cell click)
- **Classic**: Delegated click on `.cell-toggle` → mutates `S.state.schedule[lineId][day]` → `S.syncRdoDaysFromSchedule(line)` → `S.refreshLineRowDerived(line.id)` → `S.renderCoverageBars()`.
- **Svelte**: Row cell `@click` emits `lines:day-toggle`. Classic listener does mutation + `S.refreshLineRowDerived` + `S.renderCoverageBars()` + `lines:request-render`.
- **Critical**: `S.syncRdoDaysFromSchedule` and `S.refreshLineRowDerived` **must remain in classic** (source of truth).

### 5.3 Filters (toolbar dropdowns)
- **Classic**: `bindLinesUI` change on `#lines-filter-role`, `#lines-filter-shift`, etc. → updates `S.linesView` → `S.renderLines()`.
- **Svelte**: Toolbar **stays classic** (no port). Filters change → classic updates `S.linesView` → dispatches `lines:request-render` → Svelte re-fetches `getLineRowModels()` (which internally uses `S.filterLinesForView` + `S.sortLinesForView`).
- **Hook**: `lines:filter-change` fired by classic for any external sync.

### 5.4 Generate / Import
- **Generate**: `S.generate()` (classic) → creates lines + schedule → at end dispatches `lines:request-render {source:'generate'}`.
- **Import**: `S.applyPayload()` → mutates state → dispatches `lines:request-render {source:'import'}`.
- **Coverage cuts** (`coverage-cuts.js::wrapGenerate`): after `S.applyCoverageCutsToLines()` → `S.renderAll()` → also dispatches `lines:request-render`.

### 5.5 Tab Show (Lines tab activated)
- **Classic**: `S.switchTab('lines')` → calls `S.renderLines()`.
- **Svelte**: `initLinesTable` already listens for tab-btn click on `data-tab="lines"` and calls `refresh()` (which calls `getLineRowModels()` + remounts).
- **Add**: In `S.switchTab`, after panel toggle, dispatch `lines:request-render {source:'tab-show'}` for safety.

### 5.6 Coverage / Count Refreshes
- **Classic**: `S.renderCoverageBars()` called after day-toggle, generate, import, filter change.
- **Svelte**: Listens to `lines:coverage-refresh` (dispatched by classic after `renderCoverageBars`) → re-fetches row models (duty flags may have changed) → re-renders visible rows only.
- **Line colors**: `S.paintLineColors()` (line-colors.js) currently paints via DOM query. **Replace** with: row model includes `isBagDay[]`, `isDfoDay[]`, `isRdoDay[]` computed by `getLineRowModels()` using same logic as `line-colors.js::dutyFor()`. Svelte applies CSS classes directly — no DOM scraping.

---

## 6. Virtual Scroll Implementation (TanStack Virtual)

```ts
// LinesTable.svelte (key excerpts)
<script lang="ts">
  import { createVirtualizer } from '@tanstack/svelte-virtual';
  import { onMount, onDestroy } from 'svelte';

  export let rows: LineRowModel[] = []; // full filtered/sorted array from getLineRowModels()

  const parentRef = $state<HTMLDivElement>();
  const ROW_HEIGHT = 42; // match CSS .lines-editable td height

  const virtualizer = createVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
    getItemKey: (index) => rows[index]?.id ?? index,
  });

  // Recompute when rows array reference changes
  $effect(() => {
    virtualizer.setOptions({ count: rows.length });
  });

  function handleDayToggle(lineId: number, day: number, next: 'WORK'|'RDO') {
    window.dispatchEvent(new CustomEvent('lines:day-toggle', { detail: { lineId, day, next } }));
  }
  function handleInlineEdit(lineId: number, field: string, value: any) {
    window.dispatchEvent(new CustomEvent('lines:inline-edit', { detail: { lineId, field, value } }));
  }
</script>

<div class="lines-virtual-root" bind:this={parentRef} style="height:100%;overflow:auto">
  <table class="data-table lines-editable">
    <thead>...static header...</thead>
    <tbody>
      {#each virtualizer.getVirtualItems() as virtualRow}
        <tr style="position:absolute;top:{virtualRow.start}px;left:0;right:0;height:{virtualRow.size}px"
            data-line-row={rows[virtualRow.index].id}>
          <!-- render cells from rows[virtualRow.index] -->
          <td class="cell-toggle" on:click={() => handleDayToggle(...)}>...</td>
          <td><select bind:value={...} on:blur={() => handleInlineEdit(...)}>...</select></td>
          ...
        </tr>
      {/each}
    </tbody>
  </table>
  <div style="height:{virtualizer.getTotalSize()}px"></div> <!-- spacer -->
</div>
```

---

## 7. `getLineRowModels()` — Classic Implementation (Add to `render.js` or `state.js`)

```js
// Add to window.Scheduler (e.g., in render.js after renderLines definition)
S.getLineRowModels = function () {
  var filtered = S.sortLinesForView(S.filterLinesForView(S.state.lines));
  var days = (S.state.weekCount || 1) * 7;
  return filtered.map(function (line) {
    var schedule = S.state.schedule[line.id] || [];
    var fr = S.state.functionRotation || {};
    var frLine = fr[String(line.id)] || [];
    var isBagDay = [], isDfoDay = [], isRdoDay = [];
    var dayModels = [];
    for (var d = 0; d < days; d++) {
      var v = schedule[d] || 'RDO';
      var duty = frLine[d] || line.function || null;
      var isBag = duty === 'BAG' || duty === 'BAGS';
      var isDfo = duty === 'DFO';
      var isRdo = v !== 'WORK';
      isBagDay[d] = isBag;
      isDfoDay[d] = isDfo;
      isRdoDay[d] = isRdo;
      dayModels.push({
        dayIndex: d,
        value: v,
        duty: isBag ? 'BAG' : isDfo ? 'DFO' : (duty === 'PAX' ? 'PAX' : null),
        label: v === 'WORK' ? (line.shiftLabel || 'WORK') : 'RDO'
      });
    }
    var hours = 0;
    for (var d = 0; d < days; d++) if (schedule[d] === 'WORK') hours += line.paid || 0;
    var teamMeta = S.teamMetaForLine(line.id);
    return {
      id: line.id,
      lineCode: line.lineCode,
      shiftId: line.shiftId,
      shiftName: line.shiftName,
      shiftLabel: line.shiftLabel,
      empClass: line.isStso ? 'STSO' : line.isLtso ? 'LTSO' : line.empClass,
      sex: line.sex,
      function: line.function,
      rdoText: S.rdoTextForLine(line),
      rdoDays: line.rdoDays || [],
      rdoHard: line.rdoHard,
      teamName: teamMeta.name,
      teamId: teamMeta.id,
      days: dayModels,
      hours: hours,
      isBagDay: isBagDay,
      isDfoDay: isDfoDay,
      isRdoDay: isRdoDay
    };
  });
};
```

---

## 8. CSS Additions (append to `css/styles.css`)

```css
/* Svelte Lines Table Virtual Root */
.lines-table-root { height: min(80vh, 960px); width: 100%; }
.lines-virtual-root { position: relative; height: 100%; overflow: auto; }
.lines-virtual-root table { width: max-content; min-width: 1100px; }
.lines-virtual-root tbody tr { position: absolute; left: 0; right: 0; }
.lines-virtual-root td, .lines-virtual-root th { padding: 0.4rem 0.5rem; white-space: nowrap; }
.lines-virtual-root .cell-toggle { cursor: pointer; min-width: 3.5rem; }
.lines-virtual-root .line-edit { min-height: 2.25rem; font-size: 0.85rem; min-width: 5.5rem; }
.lines-virtual-root .line-code-input { min-width: 6.5rem; max-width: 12rem; }
.lines-virtual-root .lines-group-row td { background: var(--panel2); color: var(--amber); border-top: 2px solid var(--border); }
.lines-virtual-root .cell-rdo { background: #000; color: #fff; }
.lines-virtual-root .cell-work { color: var(--green); font-family: var(--mono); }
.lines-virtual-root .cell-function-duty.cell-bag { background: #f4b4b4 !important; color: #111; box-shadow: inset 0 0 0 1px #c07070; }
.lines-virtual-root .cell-function-duty.cell-dfo { background: #ffc000 !important; color: #111; box-shadow: inset 0 0 0 1px #c49200; }
```

---

## 9. Acceptance Criteria (Definition of Done)

| # | Criterion | Test |
|---|-----------|------|
| 1 | Classic table hidden when `?lines=svelte` or flag on | Load app with flag → no classic `<tbody>` rendered |
| 2 | Svelte island mounts on Lines tab show | Click F3 → table appears with 50+ rows |
| 3 | Virtual scroll works (scrollbar reflects total) | 200 lines → scrollbar thumb ~25% height |
| 4 | Inline edits persist → classic state | Change shift dropdown → `S.state.lines[i].shiftId` updated |
| 5 | Day toggles persist → classic state + coverage refresh | Click RDO cell → `S.state.schedule[id][day]` flips → coverage bars update |
| 6 | Filters (role/shift/sex/team) work | Select filter → row count updates instantly |
| 7 | Group/Sort/Order dropdowns work | Change group-by → group headers appear |
| 8 | Generate → table populates | Click [GEN] GENERATE → lines appear |
| 9 | Import → table populates | Import JSON → lines appear |
|10 | Coverage cuts → extra RDOs reflected | Add cut → Generate → RDOs added on selected days |
|11 | Export Excel unchanged | Click Export Excel → .xlsx contains all lines (full dataset) |
|12 | Line colors (RDO black, BAG red, DFO yellow) match classic | Visual compare with classic |
|13 | Classic bypass works (flag off) | `?lines=classic` → original render.js path, zero Svelte load |
|14 | No console errors | DevTools clean on all flows |
|15 | Performance: 500 lines, 60fps scroll | Chrome Performance tab — no layout thrashing |

---

## 10. File Touch List (No Edits Yet — For Planning)

| File | Change Type |
|------|-------------|
| `modules/lines-table/src/LinesTable.svelte` | **Create** — main component |
| `modules/lines-table/index.js` | **Update** — mount logic, `getLineRowModels` consumer |
| `vite.lines-table.config.mjs` | **Verify** — outputs single ESM bundle |
| `index.html` | **Edit** — replace `#lines-tbody` block with `#lines-table-root`; add dynamic import |
| `js/render.js` | **Add** — `S.getLineRowModels()` function; early-return in `renderLines()` if flag on |
| `js/main.js` | **Add** — read `localStorage`/URL flag → set `S.__USE_SVELTE_LINES` |
| `js/line-colors.js` | **Deprecate** — no DOM painting; logic moves to `getLineRowModels()` |
| `css/styles.css` | **Append** — virtual root + row styles |
| `js/io.js` | **Verify** — import/export still use `S.state.lines` (unchanged) |
| `js/coverage-cuts.js` | **Verify** — dispatches `lines:request-render` after cuts applied |

---

## 11. Rollback Plan

1. Set `localStorage.setItem('blade:lines:svelte', '0')` or remove `?lines=svelte`.
2. Classic `renderLines()` runs (guarded by `if (!S.__USE_SVELTE_LINES)`).
3. Svelte bundle never loaded (dynamic import skipped).
4. Zero data loss — classic state unchanged.

---

*Generated: 2026-09-15 | For BLADE Alpha Lines Tab Svelte Cutover*