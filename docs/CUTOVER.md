# BLADE Cutover Plan: Monolithic JS to ESM Modules, Single Bus, and Svelte

> **IMPORTANT DISCLAIMER & NOTICE:**
> This document is a **wishlist / future plan** describing a proposed future architecture.
> It **does NOT** describe the current state of the application.
> The current application architecture and wiring are documented in **[docs/APP-MAP.md](APP-MAP.md)**.

---

## 1. Monolithic JS File Migration & Module Ownership

The current monolithic files in `js/` will be absorbed into specific ESM modules as follows:

| Monolithic Script | Current Behavior / Ownership | Target Owning Module | Proposed Absorption Strategy |
|---|---|---|---|
| `js/constants.js` | Array constants `Scheduler.DAYS` and `Scheduler.BADGES` | `modules/shared` | Export constant arrays from `modules/shared/constants.js`. |
| `js/utils.js` | Helper utilities (`S.$`, `timeToMin`, `minToTime`, `safeNumber`, `isValidTimeText`, `setInputValue`, `updateStatus`, `parseStartDate`, `toDateInputValue`, `dj`) | `modules/shared` | Move domain utilities into `modules/shared/utils/`. |
| `js/utils/theme.js` | Theme toggling (`getTheme`, `applyTheme`, `toggleTheme`, `initTheme`) | `modules/shared` | Move theme methods into `modules/shared/theme.js`. |
| `js/io.js` | State export/import (`exportJson`, `importJsonFile`, `applyPayload`, `clearAll`) | `modules/shared` | Encapsulate JSON state serialization into `modules/shared/io.js`. |
| `js/instructions.js` | Embedded text copy `Scheduler.INSTRUCTIONS_MD` | `modules/shared` | Move instructions copy and markdown parser into `modules/shared/instructions.js`. |
| `js/main.js` | Tab switching logic (`Scheduler.switchTab`) and `#instructions-modal` display | Shell / Host Loader | Retain only minimal shell loader; tab state management moves to host store. |
| `js/console-chrome.js` | Console header/footer updates (`refreshConsoleChrome`, `hookConsoleIo`) & `__TAURI__` IPC | `modules/shared` | Move console chrome updates and Tauri IPC into `modules/shared/chrome.js`. |
| `js/intro.js` | Retro CRT boot animation and `blade-intro-done` event | `modules/shared` | Move startup boot sequence into `modules/shared/intro.js`. |

---

## 2. Event Bus Architecture

### Proposed Single Event Bus
- **Bus Name:** `EventBus` (a lightweight pub/sub event emitter instance provided by `modules/shared/bus.js`).
- **Current Status in Repository:** **Not Present**. As shown in `docs/APP-MAP.md`, the app currently relies on direct global object mutations (`window.Scheduler` / `S.*`), direct method attachments, and native DOM CustomEvents (`lines:request-render`, `lines:filter-change`, `lines:sort-change`, `lines:coverage-refresh`, `blade-intro-done`, `setup:mounted`).
- **Target Event Architecture:**
  Modules will publish typed domain events to the single `EventBus` (e.g. `lines:updated`, `schedule:generated`, `tab:changed`) rather than attaching methods to `window.Scheduler`.

---

## 3. Svelte Cutover Order

The repository currently contains exactly one Svelte 4 component: `modules/lines-table/LinesTable.svelte`.

The migration to full Svelte UI screens will proceed sequentially, one screen per step, in the following order:

1. **`modules/lines-table/LinesTable.svelte`** *(Completed / Existing Island)*
   - Virtualized bid line table view with inline editing and pattern coloring.
2. **`Setup` Screen (`modules/setup-panel`)**
   - Port `#tab-setup` HTML and action handlers to Svelte components (`SetupPanel.svelte`, `ShiftsTable.svelte`, `FteInputs.svelte`).
3. **`Coverage` Screen (`modules/coverage`)**
   - Port 30-minute headcount heatmap matrix and shift mix summary to `CoveragePanel.svelte`.
4. **`Teams` Screen (`modules/team-builder`)**
   - Port drag-and-drop team assignment boards and docks to `TeamBuilderPanel.svelte`.
5. **`Reports` Screen (`modules/reports`)**
   - Port executive management dashboard, gender balance, and shift deviation views to `ReportsPanel.svelte`.
6. **`Demand` Screen (`modules/demand-capacity`)**
   - Port passenger demand vs. staffing capacity chart to `DemandCapacityPanel.svelte`.
7. **`Bid Planner` Screen (`modules/bid-planner`)**
   - Port shift bid scheduling rules, conflict viewer, and calendar matrix to `BidPlannerPanel.svelte`.
