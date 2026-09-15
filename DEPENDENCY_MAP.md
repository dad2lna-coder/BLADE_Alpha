# BLADE Alpha — Architecture & Dependency Map

This document details the boot flow, component dependencies, DOM contracts, and module system lifecycle of the **BLADE Alpha** workforce allocation platform.

---

## 1. Boot Order

The application initializes in three distinct phases: host document parsing, classic runtime bootstrap, and dynamic module loading.

1. **`<!DOCTYPE html>` & Head Parsing**
   - Stylesheets load synchronously (blocking render):
     - `css/styles.css` (global layout, forms, tables, card theme)
     - `css/line-print.css` (bidding print-sheet media query rules)
     - `css/intro.css` (retro CRT console bezel & scanlines)
     - `css/console.css` (console masthead & terminal chrome)
2. **DOM Skeleton Rendering**
   - Introductory screen (`#blade-intro`)
   - Header masthead & action buttons (`.topbar`)
   - Tab navigation (`.tabs`: Setup, Coverage, Lines, Teams, Reports, Capacity)
   - Panel shells (`#tab-setup`, `#tab-coverage`, `#tab-lines`, `#tab-teams`, `#tab-capacity`, `#tab-reports`)
   - Modal templates (`#airport-config-modal`, `#shift-day-times-modal`, `#team-detail-modal`, `#instructions-modal`)
   - Console footer (`.console-footer`)
3. **Vendor Libraries (Synchronous `<script>` execution)**
   - `lib/dayjs.min.js` → `window.dayjs` (date manipulation helper)
   - `lib/Sortable.min.js` → `window.Sortable` (HTML5 drag-and-drop primitives)
   - `lib/luxon.min.js` → `window.luxon` (time-zone & duration math)
   - `lib/exceljs.min.js` → `window.ExcelJS` (bidding schedule `.xlsx` exporter)
4. **Classic JS Layer (Synchronous scripts registering on `window.Scheduler` as `S`)**
   - `js/constants.js` → `S.DAYS`, `S.BADGES`, `S.defaultShifts()`
   - `js/state.js` → `S.state` (lines, schedule, shifts, config), `S.shiftSeq`
   - `js/utils.js` → `S.$()`, `S.timeToMin()`, `S.minToTime()`, `S.safeNumber()`, `S.dj()`
   - `js/shifts.js` → `S.getShift()`, `S.readShiftsFromDom()`, `S.renderShiftsTable()`
   - `js/allocation.js` → `S.buildLines()`, `S.assignCertifications()`
   - `js/functions.js` → `S.ensureFunctionCoverage()`, `S.generateFunctionAssignments()`
   - `js/lines-row-model.js` → `S.lineToRowModel`, `S.getRowModels`, `S.getLineRowModels`
   - `js/render.js` → `S.renderAll()`, `S.renderLines()`, `S.switchTab()`, `S.findLineById()`, `S.setLineTeam()`, `S.teamMetaForLine()`
   - `js/line-colors.js` → wraps `S.renderLines` & `S.renderAll` for RDO badge background colors
   - `js/reports.js` → renders staffing breakdown and gender parity analytics
   - `js/schedule.js` → `S.generate()`, `S.buildScheduleForLine()`
   - `js/io.js` → `S.exportJson()`, `S.applyPayload()`, `S.exportLinesExcel()`
   - `js/airport.js` → `S.getAirportConfig()`
   - `js/capacity.js` → `S.teamSexCounts()`, `S.teamWorksDay()`, `S.modSetForTeamDay()`
   - `js/modset-board.js` → mod-set board rendering
   - `js/export-board.js` → board view export
   - `js/instructions.js` → modal instructions logic
   - `js/main.js` → executes `S.init()`, binds tab switching, triggers initial `S.renderAll()`
   - `js/console-chrome.js` → wraps `S.renderAll` to refresh masthead counters
   - `js/airfield-boot.js` → airfield configuration bootstrap
   - `js/setup-ui.js` → `S.rebuildSetupTab()`, `S.snapshotFte()` — **deprecated: replaced by `modules/setup-panel/`**
   - `js/intro.js` → CRT intro terminal emulator, emits `blade-intro-done`
   - `js/coverage-cuts.js` → line coverage cut calculations
5. **Dynamic Module Bootloader (`<script type="module">` deferred execution)**
   - Fetches `modules/manifest.json`.
   - Polls until `window.Scheduler` is confirmed initialized.
   - For each configured manifest entry:
     - Injects referenced CSS stylesheets (e.g. `team-builder.css`) via `<link data-module-css="...">`.
     - Injects HTML fragments (e.g. `panel.html` into `#tab-teams`, `docks.html` into `<body>`) **only when both `panel` and `mount` are present**.
     - Imports module entry point via absolute resolution: `import(new URL(cfg.entry, window.location.href).href)`.
     - Executes exported initializer (`initTeamBuilder(Scheduler)` or `init(Scheduler)`).
   - `lines-table` has no HTML/CSS injection — its Svelte component is pre-bundled into `modules/lines-table/dist/lines-table.js` and mounts directly into `#lines-table-root` via `initLinesTable`.

---

## 2. Boot Flow & Architecture

See prior mermaid in repo history; host boot → classic JS → module loader → team-builder + lines-table.

---

## 3. Component & File Dependency Matrix

### Host & Core Infrastructure

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `index.html` | Vendor libs, `css/*.css`, `js/*.js`, `modules/manifest.json` | Core page scaffold, tab shells, module loader | `#tab-teams` is host-only placeholder |
| `scripts/copy-frontend.js` | Node `fs`, `path` | Builds `dist-frontend/` for Tauri desktop package | Copies `index.html`, `css/`, `js/`, `lib/`, `modules/` |
| `modules/manifest.json` | — | Declarative schema for pluggable UI modules | Configures `team-builder` and `lines-table` assets and mount targets |

### Classic Runtime (`window.Scheduler`)

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `js/constants.js` | — | `S.DAYS`, `S.BADGES`, `S.defaultShifts()` | Core lookup dictionaries |
| `js/state.js` | — | `S.state`, `S.shiftSeq` | Central state tree (lines, schedule, shifts, config) |
| `js/utils.js` | `window.dayjs` | `S.$()`, `S.timeToMin()`, `S.minToTime()`, `S.dj()` | DOM and time calculation helpers |
| `js/shifts.js` | `S.state`, `S.$` | `S.getShift()`, `S.renderShiftsTable()` | Shift lookup and table rendering |
| `js/allocation.js` | `S.state` | `S.buildLines()`, `S.assignCertifications()` | Line generation engine |
| `js/functions.js` | `S.state` | `S.ensureFunctionCoverage()` | PAX/BAG/DFO duty assignment |
| `js/lines-row-model.js` | callers (resolvers) | `S.lineToRowModel`, `S.getRowModels`, `S.getLineRowModels` | Pure mapper; optional `S.getLineRowModels` reads `S.state` |
| `js/render.js` | `S.state`, `S.teams` | `S.renderAll()`, `S.renderLines()`, `S.switchTab()` | Global render coordination |
| `js/schedule.js` | `S.state`, DOM inputs | `S.generate()`, `S.buildScheduleForLine()` | Schedule engine |
| `js/capacity.js` | `S.teams`, `S.switchTab` | `S.teamSexCounts()`, `S.teamWorksDay()` | Daily checkpoint capacity calculations |
| `js/main.js` | All classic `js/*.js` | `S.init()`, tab click bindings | Final synchronous bootstrap step |

### Module: `lines-table` (Svelte island in Lines tab)

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `modules/lines-table/index.js` | `LinesTable.svelte` (bundled by Vite) | `initLinesTable()` | No dynamic import — entry is the pre-bundled dist file; bootloader imports `modules/lines-table/dist/lines-table.js` |
| `modules/lines-table/LinesTable.svelte` | row-model keys (`id`, `teamId`, `shiftId`, `line`, `days[]`, …); `teamOptions`/`shiftOptions` | Virtualized editable table | Binds row-model keys; edits via `onInlineEdit`/`onDayToggle` into index writers; bundled by `vite.lines-table.config.mjs` |
