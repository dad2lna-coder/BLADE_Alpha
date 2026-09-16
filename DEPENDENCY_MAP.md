# BLADE Alpha — Architecture & Dependency Map

This document details the boot flow, component dependencies, DOM contracts, and module system lifecycle of the **BLADE Alpha** workforce allocation platform.

Classic scripts load first (`js/render.js`, allocation, schedule, io, …), then `index.html` fetches `modules/manifest.json` and mounts each module panel + `init*(Scheduler)`.

---

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

**One-shot Generate:** `S.generate` builds lines + schedules, then if mode ≠ none calls `S.generateFunctionAssignments({ fromGenerate: true })` in the same pass. Function duties only via main Schedule Generate — no separate coverage generate control.

DFO: pooled lines mix DFO and PAX across WORK days. BAG: pooled lines are BAG on every WORK day (no PAX). Bands apply to DFO minimums and are hidden in BAG mode. Six `#fc-pool-*-m/f` inputs feed DFO or BAG pools for the active mode.

---

## Project File Inventory (verified 2026-09-15)

### Boot sequence

1. `index.html` loads `lib/*.min.js`, then `js/constants.js` → `js/state.js` → `js/utils.js` → `js/shifts.js` → `js/allocation.js` → `js/functions.js` → `js/lines-row-model.js` → `js/render.js` → `js/line-colors.js` → `js/reports.js` → `js/schedule.js` → `js/io.js` → `js/airport.js` → `js/capacity.js` → `js/modset-board.js` → `js/export-board.js` → `js/instructions.js` → `js/main.js` → `js/console-chrome.js` → `js/airfield-boot.js` → `js/intro.js`.
2. After `window.Scheduler` is ready, `index.html`'s inline `<script type="module">` fetches `modules/manifest.json` and loads each module entry (panel HTML, CSS, init).

### Top-level files

| File | Role |
|------|------|
| `index.html` | Single-page shell; mount points for all tabs |
| `vite.lines-table.config.mjs` | Vite build for Svelte lines-table island |
| `package.json` / `package-lock.json` | npm deps + scripts (`build:lines-table`, `copy-frontend`) |
| `scripts/copy-frontend.js` | Copies web assets to `dist-frontend/` |
| `test-task1.js` | Node verification of `getLineRowModels` / row-model APIs |

### `js/` — Classic scripts (IIFE onto `window.Scheduler`)

| File | Status |
|------|--------|
| `constants.js` | Shared enums |
| `state.js` | Central state object |
| `utils.js` | Time / number / DOM helpers |
| `shifts.js` | Shift CRUD & validation |
| `allocation.js` | Schedule generation algorithm |
| `functions.js` | Function coverage logic (DFO/BAG/PAX) |
| `lines-row-model.js` | Row-model mapper (`lineToRowModel`, `getRowModels`, `getLineRowModels`) |
| `render.js` | DOM rendering + UI updates + `renderLines`, `renderAll` |
| `line-colors.js` | Line color painting (RDO/BAG/DFO) |
| `reports.js` | Dashboard reports |
| `schedule.js` | Schedule state & queries |
| `io.js` | Import/Export JSON & Excel |
| `airport.js` | Airport config modal |
| `capacity.js` | Checkpoint capacity |
| `modset-board.js` | Module set board |
| `export-board.js` | Export board |
| `instructions.js` | In-app instructions loader |
| `main.js` | App init, feature-flag parsing |
| `console-chrome.js` | Console chrome UI |
| `airfield-boot.js` | Airfield boot |
| `intro.js` | Intro screen |
| `coverage-cuts.js` | Coverage cuts (kept for backward compat; module owns the real logic) |
| `team-core.js` | Removed — handled by `modules/team-builder/` |
| `team-build.js` | Removed — handled by `modules/team-builder/` |

### `modules/` — ES module islands

| Module | Entry | Init |
|--------|-------|------|
| `coverage` | `modules/coverage/index.js` | `initCoverage` |
| `lines-table` | `modules/lines-table/dist/lines-table.js` | `initLinesTable` |
| `team-builder` | `modules/team-builder/index.js` | `initTeamBuilder` |
| `setup-panel` | `modules/setup-panel/index.js` | `initSetupPanel` |

### `lib/` — Bundled vendors

`dayjs.min.js`, `Sortable.min.js`, `luxon.min.js`, `exceljs.min.js`

### `css/`

`styles.css`, `team-build.css`, `line-print.css`, `rotation-join.css`, `console.css`, `intro.css`

### Build artifacts

- `dist/` — empty (no longer used by Tauri pipeline on this branch)
- `dist-frontend/` — copied web assets (index.html, INSTRUCTIONS.md, css/, js/, lib/, modules/)
