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
| `js/constants.js` | Enums & default config parameters | `modules/shared` | Export immutable constant objects from `modules/shared/constants.js`. |
| `js/utils.js` | Helper utilities (time calculation, clone, etc.) | `modules/shared` | Move core domain utilities into `modules/shared/utils/`. |
| `js/utils/theme.js` | Dark vs. Presentation theme toggle | `modules/shared` | Convert `ThemeManager` into `modules/shared/theme.js`. |
| `js/io.js` | EXP/IMP state serialization & file save/load | `modules/shared` (or `modules/io`) | Encapsulate JSON/Excel file persistence into a dedicated IO module service. |
| `js/instructions.js` | Help modal rendering & markdown parsing | `modules/shared` | Port help modal parsing and rendering to a shared dialog component. |
| `js/main.js` | State initialization & tab switching | Shell / Core App | Retain only minimal application bootstrap loader; state management moves to central store. |
| `js/console-chrome.js` | Terminal UI status updates & footer messaging | `modules/shared` | Move RETRO terminal updates into `modules/shared/chrome.js`. |
| `js/intro.js` | CRT startup boot sequence animation | `modules/shared` | Wrap boot sequence into an isolated startup component in `modules/shared`. |

---

## 2. Event Bus Architecture

### Proposed Single Event Bus
- **Bus Name:** `EventBus` (a lightweight pub/sub event emitter instance provided by `modules/shared/bus.js`).
- **Current Status in Repository:** **Not Present**. As shown in `docs/APP-MAP.md`, the app currently relies on direct global object mutations (`window.Scheduler` / `S.*`), direct method attachments, and native DOM CustomEvents (`lines:request-render`).
- **Target Event Architecture:**
  Modules will publish typed domain events to the single `EventBus` (e.g. `lines:updated`, `schedule:generated`, `tab:changed`) rather than calling methods directly on `window.Scheduler`.

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
