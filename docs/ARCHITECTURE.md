# BLADE Alpha — System Architecture & Repository Map

> **Note:** For the complete, detailed application wiring map recording entry points, file ownership, imports/exports, build configs, and caller-callee connections, see **[docs/APP-MAP.md](APP-MAP.md)**.

---

## 1. System Overview

BLADE (Browser-based Local Airport Duty Engine) Alpha is an offline-first browser application for airport security staffing scheduling (TSO, LTSO, STSO bid lines). Core scheduling runs client-side in the browser. Feature tab panels load as ES modules from `modules/manifest.json`, interacting with a single shared runtime state object (`window.Scheduler`).

---

## 2. Host Shell & Module Loader (`index.html`)

The host shell consists of `index.html` and supporting host scripts in `js/`. `index.html` acts as the runtime host and module renderer:

1. **Host Script Loading:** `index.html` loads vendor libraries (`lib/luxon.min.js`, `lib/Sortable.min.js`, `lib/exceljs.min.js`) and host runtime scripts (`js/constants.js`, `js/utils.js`, `js/utils/theme.js`, `js/io.js`, `js/instructions.js`, `js/main.js`, `js/console-chrome.js`, `js/intro.js`).
2. **Manifest Fetching:** In the inline `<script type="module">` block, the shell fetches `modules/manifest.json`.
3. **Tab & Panel Mounting:**
   - `tabModules()` and `buildNav()` parse top-level `tab` definitions in `modules/manifest.json` and generate navigation items inside `#blade-tabs` and panel elements inside `#blade-panels`.
   - `reportSubModules()` and `buildReportHost()` parse `reportsSubTab` definitions and construct sub-tab buttons and `#report-sub-*` containers inside `#tab-reports`.
4. **Module Bundle Execution:** For each entry in `modules/manifest.json`:
   - Injects stylesheets listed in `cfg.css` into `<head>`.
   - Fetches HTML templates (`cfg.panel`, `cfg.reportsPanel`, `cfg.docks`) and mounts them into target selectors (`cfg.mount`, `cfg.reportsMount`).
   - Dynamically imports the compiled Vite ESM bundle (`import(cfg.entry)`).
   - Executes the module's initializer function (`mod[cfg.init](Scheduler)`).

---

## 3. Module Inventory

Every module directory in `modules/` is registered in `modules/manifest.json`:

| Manifest Key | Folder Path | Mount Target | Source Entry File | Factual Purpose in Code |
| :--- | :--- | :--- | :--- | :--- |
| `shared-utils`<br>`shared-chrome`<br>`shared-lines` | `modules/shared/` | Shared Host Runtime (No Tab Mount) | `modules/shared/utils/index.js`<br>`modules/shared/chrome.js`<br>`modules/shared/lines/helpers.js` | Shared date/DOM primitives (`initSharedUtils`), console status updates (`initSharedChrome`), and line helpers (`initLineHelpers`). |
| `setup-panel` | `modules/setup-panel/` | `#tab-setup`<br>`[F1] SETUP` | `modules/setup-panel/index.js` | Setup tab UI for start date, week count, FTE headcount by role/sex, shifts table, DFO rebalance, sex swap, schedule locks, and shift generation. |
| `function-coverage` | `modules/function-coverage/` | Engine Service (No Tab Mount) | `modules/function-coverage/index.js` | Standalone engine for carving BAG/DFO certified pools and assigning operational duties during line generation. |
| `lines-table` | `modules/lines-table/` | `#tab-lines`<br>`[F2] LINES` | `modules/lines-table/index.js` | Virtualized bid-line table (Svelte 4 island using TanStack Virtual) with filtering, cell toggles, and row model transformations. |
| `coverage` | `modules/coverage/` | `#tab-coverage`<br>`[F3] COVERAGE` | `modules/coverage/index.js` | 30-minute headcount heatmap matrix, shift mix summary, and weekday coverage cut rules. |
| `reports` | `modules/reports/` | `#tab-reports`<br>`#report-sub-management` | `modules/reports/index.js` | Management reports shell, executive summary dashboard, gender mix metrics, shift deviation, and capacity math. |
| `team-builder` | `modules/team-builder/` | `#tab-teams`<br>`#report-sub-cohesion` | `modules/team-builder/index.js` | Drag-and-drop team assignment boards, team filters, team stats, floating dock controls, and Team Cohesion report view. |
| `demand-capacity` | `modules/demand-capacity/` | `#report-sub-demand` | `modules/demand-capacity/index.js` | Flight schedule aggregation and passenger demand vs TSO/LTSO staffing capacity chart. |
| `bid-planner` | `modules/bid-planner/` | `#tab-bid-planner`<br>`[F7] BID PLANNER` | `modules/bid-planner/index.js` | Shift bid window scheduling, seniority-based bidding rules, conflict validation, and calendar rendering. |

---

## 4. Host Script Inventory (`js/`)

Host scripts in `js/` provide core runtime primitives and chrome functionality:

| File Path | Active Status | Code Purpose |
| :--- | :--- | :--- |
| `js/constants.js` | **Active** | Defines global default constants (`DEFAULT_SHIFTS`, `DEFAULT_COVERAGE`, `CREW_FUNCTIONS`, etc.). |
| `js/utils.js` | **Active** | Provides cross-module utility functions (`parseTime`, `formatTime`, `getShiftHours`, `cloneDeep`). |
| `js/utils/theme.js` | **Active** | Handles theme switching (Dark / Presentation mode). |
| `js/io.js` | **Active** | Implements session JSON import/export (`exportSchedule`, `importSchedule`). |
| `js/instructions.js` | **Active** | Contains Markdown text content and renderer for user help modal. |
| `js/main.js` | **Active** | Initializes `window.Scheduler` runtime state object, topbar metadata, and tab switching handlers. |
| `js/console-chrome.js` | **Active** | Updates console status bar headers and footers. |
| `js/intro.js` | **Active** | Controls retro splash overlay animation on initial boot. |

---

## 5. Build & Deployment Pipeline

*   **Vite Module Build Script:** `package.json` defines `"build:modules"`, which executes per-module Vite configurations (`vite.<module-name>.config.mjs`) for all modules.
*   **Distribution Output:** Each build produces single-file ESM bundles under `modules/<module-name>/dist/`. Compiled `dist/` directories are git-ignored (`.gitignore`).
*   **GitHub Actions Workflow:** `.github/workflows/pages.yml` triggers on pushes to `bright-garden`, executing `npm install` and `npm run build:modules` to assemble and deploy the site artifact to GitHub Pages.
