# BLADE Alpha — Architecture & Dependency Map

This document details the boot flow, component dependencies, DOM contracts, and module system lifecycle of the **BLADE Alpha** workforce allocation platform.

Classic scripts load first (`js/render.js`, allocation, schedule, io, …), then `index.html` fetches `modules/manifest.json` and mounts each module panel + `init*(Scheduler)`.

Full classic JS matrix, team-builder file matrix, and older DOM notes live in git history at `a242859` if a section is missing here.

### Module: `coverage` (Coverage tab)

Boot: classic scripts keep `coverageSlots` / `computeHourlyByDow` / `S.coverageView`. Loader injects `modules/coverage/panel.html` into empty `#tab-coverage` and calls `initCoverage(S)`.

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `modules/coverage/index.js` | render + bind + cuts | `initCoverage(S)` | Assigns `S.renderCoverageBars`, `S.renderShiftSummary`, `S.applyCoverageCutsToLines` |
| `modules/coverage/panel.html` | host `#tab-coverage` | matrix / filters / bars / shift mix / cuts card | Same IDs as classic |
| `modules/coverage/actions/render.js` | `S.computeHourlyByDow`, `S.slotLabel` | matrix + bars + shift mix | Sole Coverage UI paint; classic `js/render.js` body/handlers removed |
| `modules/coverage/actions/bind.js` | `S.coverageView` | STSO/LTSO/TSO + bag/pax filters | Removed from `bindLinesUI` |
| `modules/coverage/components/cuts.js` | generate / renderShifts wrap | cuts list + extra RDOs | `js/coverage-cuts.js` is a stub and is not loaded |

`js/render.js` keeps `coverageSlots` / `computeHourlyByDow` only (stub `renderCoverageBars` until `attachRender`). Filter handlers live only in `actions/bind.js`. `switchTab("coverage")`, Generate, and Lines edits still *call* `S.renderCoverageBars`. Tauri `scripts/copy-frontend.js` copies `modules/`.

Baggage view (`funcView === "bag"`) counts BAG/DFO duties for all roles; STSO/LTSO filter checkboxes are not required.

### Module: `lines-table` (Svelte island in Lines tab)

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `modules/lines-table/index.js` | `LinesTable.svelte` (bundled by Vite) | `initLinesTable()` | Bootloader imports `modules/lines-table/dist/lines-table.js` |
| `modules/lines-table/LinesTable.svelte` | row-model keys; `teamOptions`/`shiftOptions` | Virtualized editable table | Binds row-model keys; edits via `onInlineEdit`/`onDayToggle` into index writers |

Edits dispatch `lines:request-render`. Team Builder uses that event when `S.__USE_SVELTE_LINES` is set.

### Module: `team-builder`

`initTeamBuilder` owns Teams tab DOM. Auto-form (`utils/autoForm.js`) assigns members with a `Set` of used ids and does **not** call `S.renderLines`. `onAutoForm` / bulk assign use one `afterMutate` (bridge → `renderAll` → one lines refresh). DnD `onEnd` is `syncTeamsFromDom` + bridge + hint + one lines refresh — not `afterMutate`.

Unassigned pool (`#team-pool-section` / `UnassignedPool.js`) is collapsed-by-default; cards paint on expand. `renderAll` / after Auto-form keep boards, pills, stats, and Follow Me without building pool LineCards while the section is closed. Collapse clears pool DOM to free memory. Pool Sortable inits only after the first expand paint.

Team boards are compact-by-default (`TeamBoard.js`): header/counts only; LineCards and Sortable paint when that team is expanded and are destroyed/cleared on collapse. `syncTeamsFromDom` only reads painted lists so compact boards do not wipe Auto-form membership.

### Module: `setup-panel`

Thin bridge over classic setup helpers. Panel markup lives in `modules/setup-panel/panel.html`, mounted on `#tab-setup`.

Function coverage mode is exclusive: `#fc-mode-dfo` / `#fc-mode-bag` / neither. Stored as `S.state.functionCoverage.mode` = `"none"` | `"dfo"` | `"bag"`.

**One-shot Generate:** `S.generate` builds lines + schedules, then if mode ≠ none calls `S.generateFunctionAssignments({ fromGenerate: true })` in the same pass. Standalone `#fc-generate` (“Re-assign functions”) is the same assigner for power users — not a second engine.

DFO: pooled lines mix DFO and PAX across WORK days. BAG: pooled lines are BAG on every WORK day (no PAX). Bands apply to DFO minimums and are hidden in BAG mode.
