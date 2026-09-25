# BLADE Alpha — Architecture & Dependency Map

This document details the boot flow, component dependencies, DOM contracts, module system lifecycle, and **Host-as-Renderer** architecture of **BLADE Alpha** on **bright-garden**.

---

## 1. Host-as-Renderer Architecture

The host shell (`index.html`) is a renderer and runtime host:
1. Loads vendor libraries and core host runtime scripts (`js/constants.js`, `js/utils.js`, `js/utils/theme.js`, `js/io.js`, `js/instructions.js`, `js/main.js`, `js/console-chrome.js`, `js/intro.js`).
2. Fetches `modules/manifest.json`.
3. Mounts module panel HTML (`cfg.panel`, `cfg.reportsPanel`, `cfg.docks`) into target `#tab-*` / `#report-sub-*` DOM elements.
4. Dynamically imports each module's Vite-built single-file ESM bundle (`modules/<name>/dist/<name>.js`).
5. Executes the module's initializer function (`init*(Scheduler)`).

The host owns **one** shared runtime state object (`window.Scheduler`) and file Import/Export (`js/io.js`). It does **not** house feature boards, domain logic, or tab rendering in classic `js/`.

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

---

## 3. Build & Deployment Pipeline

- **Source Code**: All module development takes place in module source directories (`modules/<name>/`).
- **Vite Build**: Executing `npm run build:modules` runs per-module Vite configurations (`vite.<module-name>.config.mjs`) to produce standalone single-file ESM bundles in `modules/<name>/dist/<name>.js`.
- **Git Tracking**: Compiled `dist/*.js` files are git-ignored (`.gitignore`), letting Vite in GitHub Actions (`.github/workflows/pages.yml`) build production bundles automatically on push.
- **Actions Workflow**: `.github/workflows/pages.yml` executes `npm install` and `npm run build:modules` before assembling the site artifact for GitHub Pages.

---

## 4. Host Script Inventory (`js/`)

Classic `js/` contains only host shell runtime and chrome:

| File | Purpose |
|------|---------|
| `constants.js` | Core enums and constants (`ROLES`, `DAYS`, `SEXES`) |
| `utils.js` | Cross-module primitives (`S.$`, `S.timeToMin`, `S.slotLabel`) |
| `utils/theme.js` | Theme toggle (Dark / Presentation) |
| `io.js` | File Import/Export (`exportState`, `importState`, `exportExcel`) |
| `instructions.js` | Help modal markdown text |
| `main.js` | Thin shell DOM tab switcher & help modal listener |
| `console-chrome.js` | Console status header/footer update |
| `intro.js` | Retro splash overlay animation |

All legacy feature scripts (`allocation.js`, `capacity.js`, `export-board.js`, `line-colors.js`, `lines-row-model.js`, `modset-board.js`, `reports.js`, `rotation-join.js`, `schedule.js`, `shifts.js`) have been removed from `js/` and absorbed into their respective owner modules.

---

## 5. Verification & Testing

- `node test-task1.js`: Verifies `lineToRowModel` and `getLineRowModels` exports in `modules/lines-table/row-model.js`.
- `node test-function-coverage.mjs`: Verifies function coverage engine and pool initialization.
- `node test-demand-capacity.mjs`: Verifies flight volume parser and staffing capacity calculations.
