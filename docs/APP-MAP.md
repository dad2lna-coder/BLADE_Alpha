# BLADE Application Map

This document records how the BLADE Alpha application (`dad2lna-coder/BLADE_Alpha` @ `bright-garden`) is currently wired. It lists every module under `modules/`, every monolithic `js/` file, their entry points, owned behaviors, imports/exports, build configurations, and inter-module connections.

---

## 1. Monolithic Boot Files (`js/`)

These classic scripts are loaded globally via `<script>` tags in `index.html` before ESM module loading begins.

### 1.1 `js/constants.js`
- **Entry / Type:** Global script loaded in `index.html`.
- **Owns:** Global default configuration constants (`DEFAULT_SHIFTS`, `DEFAULT_COVERAGE`, `DEFAULT_LINE_GEN_PARAMS`, `DEFAULT_DEMAND_GRAPH`, `CREW_FUNCTIONS`, `DEFAULT_AIRPORT`).
- **Imports:** None.
- **Exports / Connections:** Attaches `DEFAULT_SHIFTS`, `DEFAULT_COVERAGE`, `DEFAULT_LINE_GEN_PARAMS`, etc. to `window`. Used by `js/main.js`, `js/io.js`, and `modules/setup-panel/index.js`.

### 1.2 `js/utils.js`
- **Entry / Type:** Global script loaded in `index.html`.
- **Owns:** Core domain helper utilities (time parsing, shift duration calculations, line data model validation, RDO formatting, deep object cloning).
- **Imports:** Uses `luxon` (`window.luxon`) loaded via `lib/luxon.min.js`.
- **Exports / Connections:** Attaches helper functions (e.g., `parseTime`, `formatTime`, `getShiftHours`, `cloneDeep`) to `window`. Called across monolithic scripts and modules.

### 1.3 `js/utils/theme.js`
- **Entry / Type:** Global script loaded in `index.html`.
- **Owns:** Application theme switching (Dark vs. Presentation mode).
- **Imports:** None.
- **Exports / Connections:** Attaches theme toggling functions to `window.ThemeManager`. Listens to click events on DOM elements with `data-action="toggle-theme-menu"` and `data-action="set-theme"`.

### 1.4 `js/io.js`
- **Entry / Type:** Global script loaded in `index.html`.
- **Owns:** Application state persistence, EXP/IMP state file serialization/deserialization, and file download/upload handlers.
- **Imports:** None.
- **Exports / Connections:** Attaches `exportSchedule()`, `importSchedule()`, and IO helper utilities to `window.Scheduler` / `window`.

### 1.5 `js/instructions.js`
- **Entry / Type:** Global script loaded in `index.html`.
- **Owns:** Help modal rendering and Markdown-style documentation parsing for the in-app help modal.
- **Imports:** None.
- **Exports / Connections:** Attaches `openInstructionsModal()` to `window`. Connects to DOM id `#btn-instructions` and `#instructions-modal`.

### 1.6 `js/main.js`
- **Entry / Type:** Global script loaded in `index.html`.
- **Owns:** Root `window.Scheduler` state store initialisation, topbar metadata rendering (`#console-airport`, `#console-operator`, `#console-date`, `#console-time`, `#console-weeks`, `#console-staff`), global keyboard shortcuts, and tab switching handlers.
- **Imports:** `js/constants.js`, `js/utils.js`, `js/io.js`.
- **Exports / Connections:** Instantiates `window.Scheduler` global state object. Exposes global hooks (`Scheduler.renderAll`, `Scheduler.switchTab`).

### 1.7 `js/console-chrome.js`
- **Entry / Type:** Global script loaded in `index.html`.
- **Owns:** RETRO terminal console UI elements, status bar chip updates (`#console-lines`, `#console-nav-hint`), and console footer messaging.
- **Imports:** None.
- **Exports / Connections:** Attaches `Scheduler.hookConsoleIo()` and console status updating methods to `window.Scheduler`.

### 1.8 `js/intro.js`
- **Entry / Type:** Global script loaded in `index.html`.
- **Owns:** "CHAOS BASIC V2" retro startup boot sequence animation and CRT boot screen display.
- **Imports:** None.
- **Exports / Connections:** Binds to DOM id `#blade-intro`. Auto-executes boot animation on page load, removing `#blade-intro` from DOM upon keypress or completion.

---

## 2. Dynamic Module Loader (`index.html`)

At the bottom of `index.html`, an inline `<script type="module">` block acts as the application host/shell loader:
1. Fetches `modules/manifest.json`.
2. Awaits initialization of `window.Scheduler` from `js/main.js`.
3. Constructs primary tab navigation (`#blade-tabs`) and panel section hosts (`#blade-panels`).
4. Constructs sub-tab navigation for the Reports panel (`#report-subtabs`, `#report-sub-panels`).
5. For each manifest entry:
   - Injects declared CSS stylesheets into `<head>`.
   - Fetches and injects HTML templates (`panel`, `reportsPanel`, `docks`) into their designated DOM mount points.
   - Dynamically imports the compiled JavaScript ESM entry bundle (`import(cfg.entry)`).
   - Invokes the module's initialization function (e.g. `mod[cfg.init](Scheduler)`).

---

## 3. Application Modules (`modules/`)

### 3.1 `shared`
- **Build / Config:** `npm run build:shared` (runs `vite build --config vite.shared.config.mjs`).
- **Entry Files:**
  - `modules/shared/utils/index.js` → `modules/shared/dist/shared-utils.js` (`initSharedUtils`)
  - `modules/shared/chrome.js` → `modules/shared/dist/shared-chrome.js` (`initSharedChrome`)
  - `modules/shared/lines/helpers.js` → `modules/shared/dist/shared-lines.js` (`initLineHelpers`)
- **Owns:** Cross-module shared utilities (time formatting, DOM helpers, status notifications, line helper utilities, ExcelJS export styling).
- **Files Included:**
  - `modules/shared/chrome.js`
  - `modules/shared/utils/index.js`, `dates.js`, `dayLabel.js`, `dom.js`, `status.js`, `time.js`
  - `modules/shared/lines/helpers.js`, `excel.js`, `exportStyle.js`
- **Imports:** `lib/exceljs.min.js` (global `ExcelJS`), `lib/luxon.min.js` (global `luxon`).
- **Connections:** Attaches utilities to `Scheduler.utils`, `Scheduler.chrome`, and `Scheduler.lines`.

### 3.2 `setup-panel`
- **Build / Config:** `npm run build:setup-panel` (runs `vite build --config vite.setup-panel.config.mjs`).
- **Entry File:** `modules/setup-panel/index.js` → `modules/setup-panel/dist/setup-panel.js` (`initSetupPanel`).
- **Owns:** Roster parameters setup, shift creation/editing, headcount inputs, class schedule generation, DFO rebalancing, sex-swap proposals, schedule locks, and setup UI rendering (`#tab-setup`).
- **Files Included:**
  - `modules/setup-panel/panel.html`
  - `modules/setup-panel/index.js`
  - `modules/setup-panel/stores/setupStore.js`
  - `modules/setup-panel/actions/`: `allocation.js`, `bridge.js`, `exportBoard.js`, `generate.js`, `generateModal.js`, `paint.js`, `render.js`, `scheduleLocksUi.js`, `shiftsTable.js`
  - `modules/setup-panel/utils/`: `airportStub.js`, `buildLines.js`, `certAssign.js`, `certs.js`, `certsLegacy.js`, `classGenerate.js`, `dfoCertBalance.js`, `extraPositions.js`, `fte.js`, `headcounts.js`, `parityReport.js`, `rebalanceDfo.js`, `rebalanceFt.js`, `rebalancePt.js`, `scheduleLocks.js`, `shiftMath.js`, `slots.js`, `swapSex.js`, `sync.js`, `trainingClasses.js`
- **Imports:** `modules/shared/lines/helpers.js`, `modules/shared/utils/dom.js`, `modules/shared/utils/time.js`, `modules/shared/lines/excel.js`.
- **Connections:** Mounted into DOM `#tab-setup`. Attaches setup actions to `Scheduler.setup` and `S.setup`. Binds events to buttons inside `#tab-setup`.

### 3.3 `lines-table` (Svelte Island)
- **Build / Config:** `npm run build:lines-table` (runs `vite build --config vite.lines-table.config.mjs`).
- **Entry File:** `modules/lines-table/index.js` → `modules/lines-table/dist/lines-table.js` (`initLinesTable`).
- **Owns:** Virtualized bid line table view, line search/filtering, inline schedule editing, line pattern coloring, and row model transformations.
- **Files Included:**
  - `modules/lines-table/panel.html`
  - `modules/lines-table/index.js`
  - `modules/lines-table/LinesTable.svelte` (Only Svelte 4 component in the repository)
  - `modules/lines-table/row-model.js`
  - `modules/lines-table/line-colors.js`
- **Imports:** `@tanstack/svelte-virtual`, `svelte`, `modules/shared/lines/helpers.js`.
- **Connections:** Mounted into DOM `#tab-lines`. Instantiates Svelte component `LinesTable` on `#lines-table-root`. Subscribes to `Scheduler.on('linesChanged')` and `Scheduler.on('tabChanged')`.

### 3.4 `coverage`
- **Build / Config:** `npm run build:coverage` (runs `vite build --config vite.coverage.config.mjs`).
- **Entry File:** `modules/coverage/index.js` → `modules/coverage/dist/coverage.js` (`initCoverage`).
- **Owns:** Hourly coverage matrix display, staffing vs requirement calculations, coverage cut proposals, and coverage grid interactions (`#tab-coverage`).
- **Files Included:**
  - `modules/coverage/panel.html`
  - `modules/coverage/index.js`
  - `modules/coverage/actions/bind.js`, `render.js`
  - `modules/coverage/components/cuts.js`
  - `modules/coverage/utils/hourly.js`
- **Imports:** `modules/shared/utils/dom.js`, `modules/shared/utils/time.js`.
- **Connections:** Mounted into DOM `#tab-coverage`. Attaches functions to `Scheduler.coverage`.

### 3.5 `team-builder`
- **Build / Config:** `npm run build:team-builder` (runs `vite build --config vite.team-builder.config.mjs`).
- **Entry File:** `modules/team-builder/index.js` → `modules/team-builder/dist/team-builder.js` (`initTeamBuilder`).
- **Owns:** Drag-and-drop team assignment board, team filters, team statistics, floating dock controls, and Team Cohesion report view (`#tab-teams` and `#report-sub-cohesion`).
- **Files Included:**
  - `modules/team-builder/panel.html`, `docks.html`
  - `modules/team-builder/index.js`
  - `modules/team-builder/stores/teamBuilderStore.js`
  - `modules/team-builder/actions/dnd.js`, `floatPanel.js`
  - `modules/team-builder/components/AutoFormControls.js`, `FollowMeDock.js`, `LineCard.js`, `OddityBanner.js`, `TeamBoard.js`, `TeamBoards.js`, `TeamFilters.js`, `TeamPills.js`, `TeamStats.js`, `UnassignedPool.js`
  - `modules/team-builder/utils/autoForm.js`, `extraTeams.js`, `phase.js`, `pool.js`, `team.js`, `time.js`
- **Imports:** `lib/Sortable.min.js` (global `Sortable`), `modules/shared/utils/dom.js`.
- **Connections:** Mounted into DOM `#tab-teams` and `#report-sub-cohesion`. Attaches to `Scheduler.teamBuilder`. Binds Drag-and-Drop listeners via SortableJS.

### 3.6 `reports`
- **Build / Config:** `npm run build:reports` (runs `vite build --config vite.reports.config.mjs`).
- **Entry File:** `modules/reports/index.js` → `modules/reports/dist/reports.js` (`initReportsShell`).
- **Owns:** Management reports shell navigation, gender balance report, shift deviation report, daily capacity math/rendering, and report print formatting (`#tab-reports`).
- **Files Included:**
  - `modules/reports/panel.html`, `management.html`, `cohesion.html`
  - `modules/reports/index.js`
  - `modules/reports/capacity-math.js`, `capacity-render.js`, `cohesion.js`, `deviation.js`, `gender-balance.js`, `mod-set-day.js`, `print.js`, `reports-math.js`
- **Imports:** `modules/shared/utils/dom.js`, `modules/shared/lines/helpers.js`.
- **Connections:** Mounted into DOM `#tab-reports` and sub-panels `#report-sub-management`. Attaches to `Scheduler.reports`.

### 3.7 `demand-capacity`
- **Build / Config:** `npm run build:demand-capacity` (runs `vite build --config vite.demand-capacity.config.mjs`).
- **Entry File:** `modules/demand-capacity/index.js` → `modules/demand-capacity/dist/demand-capacity.js` (`initDemandCapacity`).
- **Owns:** Passenger demand vs staffing capacity chart rendering, flight schedule aggregation, and staffing requirement curve parsing (`#report-sub-demand`).
- **Files Included:**
  - `modules/demand-capacity/panel.html`
  - `modules/demand-capacity/index.js`
  - `modules/demand-capacity/aggregate.js`, `charts.js`, `parse.js`, `staffing.js`
- **Imports:** `modules/shared/utils/dom.js`, `modules/shared/utils/time.js`.
- **Connections:** Mounted into DOM `#report-sub-demand`. Attaches to `Scheduler.demandCapacity`.

### 3.8 `function-coverage`
- **Build / Config:** `npm run build:function-coverage` (runs `vite build --config vite.function-coverage.config.mjs`).
- **Entry File:** `modules/function-coverage/index.js` → `modules/function-coverage/dist/function-coverage.js` (`initFunctionCoverage`).
- **Owns:** Function-level staffing band math, duty assignment rules, certified pool math, and function coverage matrix logic.
- **Files Included:**
  - `modules/function-coverage/index.js`
  - `modules/function-coverage/lib/assign.js`, `bands.js`, `certifiedPools.js`, `coverage.js`, `duty.js`, `extras.js`, `migrate.js`, `pools.js`, `shifts.js`
- **Imports:** `modules/shared/lines/helpers.js`.
- **Connections:** Headless module (no primary panel mount). Attaches functions to `Scheduler.functionCoverage`. Called by setup, coverage, and reports.

### 3.9 `bid-planner`
- **Build / Config:** `npm run build:bid-planner` (runs `vite build --config vite.bid-planner.config.mjs`).
- **Entry File:** `modules/bid-planner/index.js` → `modules/bid-planner/dist/bid-planner.js` (`initBidPlanner`).
- **Owns:** Shift bid window scheduling, seniority-based bidding rules, bid conflict validation, calendar rendering, and bid import/export (`#tab-bid-planner`).
- **Files Included:**
  - `modules/bid-planner/panel.html`, `README.md`
  - `modules/bid-planner/config/calendar.json`, `rules.json`
  - `modules/bid-planner/index.js`
  - `modules/bid-planner/js/calendar.js`, `conflicts.js`, `importExport.js`, `rules.js`, `scheduler.js`, `ui.js`, `validation.js`
- **Imports:** `modules/shared/utils/dom.js`, `modules/shared/utils/dates.js`.
- **Connections:** Mounted into DOM `#tab-bid-planner`. Attaches functions to `Scheduler.bidPlanner`.

---

## 4. Build Scripts and Vite Configurations

### Package.json Scripts
- `npm run build:shared`: `vite build --config vite.shared.config.mjs`
- `npm run build:setup-panel`: `vite build --config vite.setup-panel.config.mjs`
- `npm run build:lines-table`: `vite build --config vite.lines-table.config.mjs`
- `npm run build:coverage`: `vite build --config vite.coverage.config.mjs`
- `npm run build:team-builder`: `vite build --config vite.team-builder.config.mjs`
- `npm run build:reports`: `vite build --config vite.reports.config.mjs`
- `npm run build:demand-capacity`: `vite build --config vite.demand-capacity.config.mjs`
- `npm run build:function-coverage`: `vite build --config vite.function-coverage.config.mjs`
- `npm run build:bid-planner`: `vite build --config vite.bid-planner.config.mjs`
- `npm run build:modules`: Executes all individual module build commands in sequence.

---

## 5. Connection Matrix Summary

| Caller / Host | Callee / Target | Interface Type | Description |
|---|---|---|---|
| `index.html` (Loader) | `modules/manifest.json` | `fetch` HTTP request | Loads module definitions and tab priority ordering |
| `index.html` (Loader) | Module Entries | Dynamic ESM `import()` | Dynamically imports module bundles based on `manifest.json` |
| `index.html` | `window.Scheduler` | Global object polling | Awaits global `Scheduler` object initialization before boot |
| `js/main.js` | `window.Scheduler` | `S.*` Attachment | Initializes central `Scheduler` state object |
| `js/io.js` | `window.Scheduler` | `S.*` Attachment | Attaches schedule export/import methods (`Scheduler.exportSchedule`) |
| `js/console-chrome.js` | `window.Scheduler` | `S.*` Attachment | Attaches status bar / console update hooks |
| `modules/setup-panel` | `window.Scheduler` | `S.*` Attachment / DOM Event | Attaches `Scheduler.setup`, binds UI buttons in `#tab-setup` |
| `modules/lines-table` | `window.Scheduler` | `S.*` Event Listener | Subscribes to `Scheduler.on('linesChanged')` to re-render Svelte island |
| `modules/team-builder` | `window.Scheduler` | `S.*` Attachment / DOM Event | Attaches `Scheduler.teamBuilder`, manages drag-and-drop in `#tab-teams` |
| `modules/coverage` | `window.Scheduler` | `S.*` Attachment / DOM Event | Attaches `Scheduler.coverage`, manages hourly matrix in `#tab-coverage` |
| `modules/reports` | `window.Scheduler` | `S.*` Attachment / DOM Event | Attaches `Scheduler.reports`, manages report sub-tabs in `#tab-reports` |
| `modules/demand-capacity` | `window.Scheduler` | `S.*` Attachment / DOM Event | Attaches `Scheduler.demandCapacity`, renders charts in `#report-sub-demand` |
| `modules/function-coverage` | `window.Scheduler` | `S.*` Attachment | Attaches `Scheduler.functionCoverage` for coverage calculation |
| `modules/bid-planner` | `window.Scheduler` | `S.*` Attachment / DOM Event | Attaches `Scheduler.bidPlanner`, renders bid planner in `#tab-bid-planner` |

---

## 6. Unused / Orphaned Files Audit

An audit was performed across all code files in the repository using search tools (e.g. `grep -rn <filename> .` and AST/string search scripts):

1. **`modules/lines-table/lines-table.js`**
   - **Status:** Unused / Orphan Stub.
   - **Verification Search:** `grep -rn "lines-table.js" .`
   - **Note:** Contains explicit comment: `"// Orphan stub — not the Vite entry. Entry is index.js → dist/lines-table.js."`.

2. **`modules/function-coverage/lib/extras.js`**
   - **Status:** Unused file.
   - **Verification Search:** `grep -rn "extras.js" .` and search for exported functions (`extraPositions`, `generateExtraLines`).
   - **Note:** Contains helper functions for extra position generation that are not imported by any active module.

3. **`modules/team-builder/components/OddityBanner.js`**
   - **Status:** Unused file.
   - **Verification Search:** `grep -rn "OddityBanner" .`
   - **Note:** Component `refreshTeamOddityBanner` is defined but never imported or invoked by `team-builder/index.js` or any other file.

4. **`modules/team-builder/utils/extraTeams.js`**
   - **Status:** Unused file.
   - **Verification Search:** `grep -rn "extraTeams" .`
   - **Note:** Contains team utility helpers not imported in `modules/team-builder/index.js`.
