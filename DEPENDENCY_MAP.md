# BLADE Alpha — Architecture & Dependency Map

This document details the boot flow, component dependencies, DOM contracts, and module system lifecycle of **BLADE Alpha** on **bright-garden**.

Classic scripts load first (`js/render.js`, allocation, schedule, io, …), then `index.html` fetches `modules/manifest.json` and mounts each module panel + `init*(Scheduler)`.

Verified against tree SHA `805a40af` (2026-09-23).

---

### Module: `coverage` (Coverage tab)

Boot: classic scripts keep `coverageSlots` / `computeHourlyByDow` / `S.coverageView`. Loader injects `modules/coverage/panel.html` into empty `#tab-coverage` and calls `initCoverage(S)`.

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `modules/coverage/index.js` | render + bind + cuts | `initCoverage(S)` | Assigns `S.renderCoverageBars`, `S.renderShiftSummary`, `S.applyCoverageCutsToLines` |
| `modules/coverage/panel.html` | host `#tab-coverage` | matrix / filters / bars / shift mix / cuts card | Same IDs as classic |
| `modules/coverage/actions/render.js` | `S.computeHourlyByDow`, `S.slotLabel` | matrix + bars + shift mix | Sole Coverage UI paint; classic `js/render.js` body/handlers removed |
| `modules/coverage/actions/bind.js` | `S.coverageView` | STSO/LTSO/TSO + bag/pax/dfo filters | Removed from `bindLinesUI` |
| `modules/coverage/components/cuts.js` | generate / renderShifts wrap | cuts list + extra RDOs | `js/coverage-cuts.js` is an unused stub and is **not** in `index.html` |

`js/render.js` keeps `coverageSlots` / `computeHourlyByDow` only (stub `renderCoverageBars` until `attachRender`). Filter handlers live only in `actions/bind.js`. `switchTab("coverage")`, Generate, and Lines edits still *call* `S.renderCoverageBars`. Tauri `scripts/copy-frontend.js` copies `modules/`.

Baggage view (`funcView === "bag"`) counts BAG/DFO duties for all roles; STSO/LTSO filter checkboxes are not required.

### Module: `demand-capacity` (Demand tab)

Boot: loader injects `modules/demand-capacity/panel.html` into `#tab-demand-capacity` and calls `initDemandCapacity(S)`. Source ESM only — no dist bundle. Nav: `[F7] DEMAND`.

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `modules/demand-capacity/index.js` | ExcelJS, `S.lineCoversSlot`, `S.getRotationDuty`, `S.lineRoleKey` | `initDemandCapacity(S)` | Import volume xlsx + Refresh PAX staffing capacity; `S.state.volumeImport` |
| `modules/demand-capacity/parse.js` | `window.ExcelJS` | header/row parse | Required: DAY_OF_WEEK, ETD, CAPACITY, PERCENT_ORIGINATING |
| `modules/demand-capacity/aggregate.js` | slot list | ETD−2h volume buckets | Shared 30-min grid with staffing |
| `modules/demand-capacity/staffing.js` | coverage slot cover + PAX duty | people × 18 pax/30-min | TSO, optional LTSO; never BAG/DFO/STSO; never lane `airportPax` |
| `modules/demand-capacity/charts.js` | none | 7 stacked full-width SVGs | Sunday → Saturday |

Capacity series is qualifying PAX people covering each slot × 18 (36 pax/hour). Read-only — does not Generate, rewrite duties, or call `computeLaneCapacityMatrix`.

### Module: `lines-table` (Svelte island in Lines tab)

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `modules/lines-table/index.js` | `LinesTable.svelte` (bundled by Vite) | `initLinesTable()` | Bootloader imports `modules/lines-table/dist/lines-table.js` |
| `modules/lines-table/LinesTable.svelte` | row-model keys; `teamOptions`/`shiftOptions` | Virtualized editable table | Binds row-model keys; edits via `onInlineEdit`/`onDayToggle` into index writers |

Edits dispatch `lines:request-render`. Team Builder uses that event when `S.__USE_SVELTE_LINES` is set. Default-on in `js/main.js`; override with `?lines=classic` or `localStorage blade:lines:svelte=0`.

### Module: `team-builder`

`initTeamBuilder` owns Teams tab DOM. Auto-form (`utils/autoForm.js`) assigns members with a `Set` of used ids and does **not** call `S.renderLines`. `onAutoForm` / bulk assign use one `afterMutate` (bridge → `renderAll` → one lines refresh). DnD `onEnd` is `syncTeamsFromDom` + bridge + hint + one lines refresh — not `afterMutate`.

Unassigned pool (`#team-pool-section` / `UnassignedPool.js`) is collapsed-by-default; cards paint on expand. `renderAll` / after Auto-form keep boards, pills, stats, and Follow Me without building pool LineCards while the section is closed. Collapse clears pool DOM to free memory. Pool Sortable inits only after the first expand paint.

Team boards are compact-by-default (`TeamBoard.js`): header/counts only; LineCards and Sortable paint when that team is expanded and are destroyed/cleared on collapse. `syncTeamsFromDom` only reads painted lists so compact boards do not wipe Auto-form membership.

`js/team-core.js` still exists in the tree but is **not** loaded (`index.html` comments it out). There is no `js/team-build.js` and no `css/team-build.css`. Styles live in `modules/team-builder/styles/team-builder.css`.

### Module: `setup-panel`

Thin bridge over classic setup helpers. Panel markup lives in `modules/setup-panel/panel.html`, mounted on `#tab-setup`.

**Function coverage UI:** BAG and DFO pools are both present (Male/Female × STSO/LTSO/TSO). Copy on the panel: pools run together; leftover ops lines are PAX. `S.state.functionCoverage.mode` may still be `"none"` | `"dfo"` | `"bag"` from older saves; runtime assignment is `modules/function-coverage/lib/assign.js`.

**One-shot Generate:** `S.generate` (`js/schedule.js`) builds lines + schedules, then calls `S.generateFunctionAssignments({ fromGenerate: true })` in the same pass. There is no separate “Generate Function Assignments” button on Setup.

---

## Project File Inventory (verified 2026-09-23)

### Boot sequence

1. `index.html` loads `lib/*.min.js`, then `js/constants.js` → `js/state.js` → `js/utils.js` → `js/shifts.js` → `js/allocation.js` → `js/lines-row-model.js` → `js/render.js` → `js/line-colors.js` → `js/reports.js` → `js/schedule.js` → `js/io.js` → `js/airport.js` → `js/capacity.js` → `js/modset-board.js` → `js/export-board.js` → `js/instructions.js` → `js/main.js` → `js/console-chrome.js` → `js/airfield-boot.js` → `js/intro.js`.
2. `js/functions.js` is gone. FC bootstraps via `modules/function-coverage/` in the module loader. `js/coverage-cuts.js`, `js/team-core.js`, `js/ops-meta.js`, and `js/rotation-join.js` exist on disk and are **not** in the `index.html` script list.
3. After `window.Scheduler` is ready, `index.html`'s inline `<script type="module">` fetches `modules/manifest.json` and loads each module entry (panel HTML, CSS, init).

### Top-level files

| File | Role |
|------|------|
| `index.html` | Single-page shell; mount points for all tabs |
| `INSTRUCTIONS.md` | User guide; keep in sync with `js/instructions.js` |
| `TEAM-SETUP.md` | Windows installer + OneDrive work paths |
| `vite.lines-table.config.mjs` | Vite build for Svelte lines-table island |
| `vite.function-coverage.config.mjs` | Optional Vite bundle for FC |
| `package.json` / `package-lock.json` | npm deps + scripts (`build:lines-table`, `copy-frontend`, tests) |
| `scripts/copy-frontend.js` | Copies web assets to `dist-frontend/` |
| `test-task1.js` | Node verification of `getLineRowModels` / row-model APIs |
| `test-function-coverage.mjs` | FC assignment tests |
| `test-demand-capacity.mjs` | Demand parser / staffing tests |

### `js/` — Classic scripts (IIFE onto `window.Scheduler`)

| File | Status |
|------|--------|
| `constants.js` | Shared enums |
| `state.js` | Central state object |
| `utils.js` | Time / number / DOM helpers |
| `shifts.js` | Shift CRUD & validation |
| `allocation.js` | Headcount allocation + line builders |
| `functions.js` | **Removed** — FC logic is `modules/function-coverage/` |
| `lines-row-model.js` | Row-model mapper (`lineToRowModel`, `getRowModels`, `getLineRowModels`) |
| `render.js` | DOM rendering + UI updates + `renderLines`, `renderAll` |
| `line-colors.js` | Line color painting (RDO/BAG/DFO) |
| `reports.js` | Dashboard reports |
| `schedule.js` | `S.generate` + WORK/RDO calendars |
| `io.js` | Import/Export JSON & Excel |
| `airport.js` | Airport config modal |
| `capacity.js` | Checkpoint capacity tab |
| `modset-board.js` | Module set board |
| `export-board.js` | Export board |
| `instructions.js` | Embedded INSTRUCTIONS.md for Help modal |
| `main.js` | App init, Svelte-lines flag, button wiring |
| `console-chrome.js` | Console chrome UI |
| `airfield-boot.js` | Airfield boot / intro airport code |
| `intro.js` | Intro screen |
| `coverage-cuts.js` | Unused stub; module owns cuts |
| `team-core.js` | Present, not loaded — `modules/team-builder/` owns Teams |
| `ops-meta.js` | Present, not loaded |
| `rotation-join.js` | Present, not loaded (`css/rotation-join.css` also unused by `index.html`) |

### `modules/` — ES module islands (`modules/manifest.json`)

| Module | Entry | Init |
|--------|-------|------|
| `coverage` | `modules/coverage/index.js` | `initCoverage` |
| `demand-capacity` | `modules/demand-capacity/index.js` | `initDemandCapacity` |
| `lines-table` | `modules/lines-table/dist/lines-table.js` | `initLinesTable` |
| `team-builder` | `modules/team-builder/index.js` | `initTeamBuilder` |
| `setup-panel` | `modules/setup-panel/index.js` | `initSetupPanel` |
| `function-coverage` | `modules/function-coverage/index.js` | `initFunctionCoverage` |

`modules/function-coverage/dist/function-coverage.js` exists as a built artifact; Pages and `index.html` load the ESM `index.js` entry from the manifest.

### `lib/` — Bundled vendors

`dayjs.min.js`, `Sortable.min.js`, `luxon.min.js`, `exceljs.min.js`

### `css/` loaded by `index.html`

`styles.css`, `line-print.css`, `intro.css`, `console.css`

Not linked from the shell: `rotation-join.css`. Team styles load from the team-builder module CSS.

### Pages / Tauri copy sets

- GitHub Pages (`.github/workflows/pages.yml`): `index.html`, `css/`, `js/`, `lib/`, `modules/`, `airport/`
- `dist-frontend/` via `scripts/copy-frontend.js`: web assets for the desktop wrapper (`dist/` is unused on this branch)
