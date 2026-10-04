# BLADE Alpha — Technical Dependency & Runtime Map

> **Note:** For the primary application mapping detailing all modules, files, imports, package scripts, and caller-callee connections, see:
> 👉 **[docs/APP-MAP.md](docs/APP-MAP.md)**

This document details low-level boot flow contracts, DOM mounting protocols, module manifest bindings, host script inventories, and verification procedures for **BLADE Alpha** on **bright-garden**.

---

## 1. Host-as-Renderer Architecture

The host shell (`index.html`) is a renderer and runtime host:
1. Loads vendor libraries and core host runtime scripts (`js/constants.js`, `js/utils.js`, `js/utils/theme.js`, `js/io.js`, `js/instructions.js`, `js/main.js`, `js/console-chrome.js`, `js/intro.js`).
2. Fetches `modules/manifest.json`.
3. Mounts module panel HTML (`cfg.panel`, `cfg.reportsPanel`, `cfg.docks`) into target `#tab-*` / `#report-sub-*` DOM elements.
4. Dynamically imports each module's Vite-built single-file ESM bundle (`modules/<name>/dist/<name>.js`).
5. Executes the module's initializer function (`init*(Scheduler)`).

The host owns the shared runtime state object (`window.Scheduler`) and file Import/Export (`js/io.js`).

---

## 2. Module Inventory (`modules/manifest.json`)

| Module | Purpose | Entry Point (Dist) | Initializer |
|--------|---------|-------------------|-------------|
| `shared-utils` | Shared date and DOM primitives | `modules/shared/dist/shared-utils.js` | `initSharedUtils` |
| `shared-chrome` | Shell chrome sub-tab helpers | `modules/shared/dist/shared-chrome.js` | `initSharedChrome` |
| `shared-lines` | Line helpers | `modules/shared/dist/shared-lines.js` | `initLineHelpers` |
| `setup-panel` | Setup tab UI, shifts table, allocation & generate engine | `modules/setup-panel/dist/setup-panel.js` | `initSetupPanel` |
| `function-coverage` | Engine-only BAG/DFO/PAX function assignment | `modules/function-coverage/dist/function-coverage.js` | `initFunctionCoverage` |
| `lines-table` | Virtualized bid line table (Svelte 4 island) + row model | `modules/lines-table/dist/lines-table.js` | `initLinesTable` |
| `coverage` | 30-min heatmap matrix, shift mix, coverage cuts | `modules/coverage/dist/coverage.js` | `initCoverage` |
| `reports` | Management reports, gender equity, capacity math & mod-set board | `modules/reports/dist/reports.js` | `initReportsShell` |
| `team-builder` | Team architecture, auto-form, drag-drop boards | `modules/team-builder/dist/team-builder.js` | `initTeamBuilder` |
| `demand-capacity` | Flight volume xlsx parser & pax capacity chart | `modules/demand-capacity/dist/demand-capacity.js` | `initDemandCapacity` |
| `bid-planner` | Shift bid window scheduling, calendar rules, conflicts | `modules/bid-planner/dist/bid-planner.js` | `initBidPlanner` |

---

## 3. Build & Deployment Pipeline

- **Source Code**: All module development takes place in module source directories (`modules/<name>/`).
- **Vite Build**: Executing `npm run build:modules` runs per-module Vite configurations (`vite.<module-name>.config.mjs`) to produce standalone single-file ESM bundles in `modules/<name>/dist/`.
- **Git Tracking**: Compiled `dist/*.js` files are git-ignored (`.gitignore`), letting Vite in GitHub Actions (`.github/workflows/pages.yml`) build production bundles automatically on push.
- **Actions Workflow**: `.github/workflows/pages.yml` executes `npm install` and `npm run build:modules` before assembling the site artifact for GitHub Pages.

---

## 4. Host Script Inventory (`js/`)

Classic `js/` contains host shell runtime and chrome:

| File | Purpose |
|------|---------|
| `constants.js` | Core constants (`DEFAULT_SHIFTS`, `DEFAULT_COVERAGE`, `CREW_FUNCTIONS`) |
| `utils.js` | Cross-module primitives (`parseTime`, `formatTime`, `getShiftHours`, `cloneDeep`) |
| `utils/theme.js` | Theme toggle (Dark / Presentation) |
| `io.js` | File Import/Export (`exportSchedule`, `importSchedule`) |
| `instructions.js` | Help modal markdown text and renderer |
| `main.js` | Shell DOM tab switcher & help modal listener |
| `console-chrome.js` | Console status header/footer update |
| `intro.js` | Retro splash overlay animation |

---

## 5. Verification & Testing

- Run `npm test` to execute all unit tests across modules and utilities.
