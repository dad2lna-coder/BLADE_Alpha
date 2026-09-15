# BLADE Alpha — Architecture & Dependency Map

This document details the boot flow, component dependencies, DOM contracts, and module system lifecycle of the **BLADE Alpha** workforce allocation platform.

`lines-table`: Svelte table binds row-model keys; edits via onInlineEdit/onDayToggle into index writers.

### Module: `coverage` (Coverage tab)

Boot: classic scripts (`js/render.js` keeps `coverageSlots` / `computeHourlyByDow` / `S.coverageView`) then the module loader. Loader injects `modules/coverage/panel.html` into empty `#tab-coverage` and calls `initCoverage(S)`.

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `modules/coverage/index.js` | render + bind + cuts | `initCoverage(S)` | Assigns `S.renderCoverageBars`, `S.renderShiftSummary`, `S.applyCoverageCutsToLines` |
| `modules/coverage/panel.html` | host `#tab-coverage` | matrix / filters / bars / shift mix / cuts card | Same IDs as classic (`coverage-matrix-*`, `cov-role-*`, `cov-func-view`, `coverage-bars`, `shift-summary-body`) |
| `modules/coverage/actions/render.js` | `S.computeHourlyByDow`, `S.slotLabel` | matrix + bars + shift mix | Replaces inlined body formerly in `js/render.js` |
| `modules/coverage/actions/bind.js` | `S.coverageView` | STSO/LTSO/TSO + bag/pax filters | Removed from `bindLinesUI` |
| `modules/coverage/components/cuts.js` | generate / renderShifts wrap | cuts list + apply extra RDOs | `js/coverage-cuts.js` is a deprecated stub and is not loaded |

`switchTab("coverage")`, Generate, and Lines edits still call `S.renderCoverageBars`. Tauri `scripts/copy-frontend.js` copies the whole `modules/` tree.

Full boot order, classic JS matrix, team-builder file matrix, DOM contract, and architectural notes live in git history at a242859 if a section is missing from this shortened restore.

### Module: `lines-table` (Svelte island in Lines tab)

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `modules/lines-table/index.js` | `LinesTable.svelte` (bundled by Vite) | `initLinesTable()` | Bootloader imports `modules/lines-table/dist/lines-table.js` |
| `modules/lines-table/LinesTable.svelte` | row-model keys; `teamOptions`/`shiftOptions` | Virtualized editable table | Binds row-model keys; edits via `onInlineEdit`/`onDayToggle` into index writers |
