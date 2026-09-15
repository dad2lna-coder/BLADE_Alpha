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
| `modules/coverage/actions/render.js` | `S.computeHourlyByDow`, `S.slotLabel` | matrix + bars + shift mix | Replaces inlined `js/render.js` paint |
| `modules/coverage/actions/bind.js` | `S.coverageView` | STSO/LTSO/TSO + bag/pax filters | Removed from `bindLinesUI` |
| `modules/coverage/components/cuts.js` | generate / renderShifts wrap | cuts list + extra RDOs | `js/coverage-cuts.js` is a stub and is not loaded |

`switchTab("coverage")`, Generate, and Lines edits still call `S.renderCoverageBars`. Tauri `scripts/copy-frontend.js` copies the whole `modules/` tree.

### Module: `lines-table` (Svelte island in Lines tab)

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `modules/lines-table/index.js` | `LinesTable.svelte` (bundled by Vite) | `initLinesTable()` | Bootloader imports `modules/lines-table/dist/lines-table.js` |
| `modules/lines-table/LinesTable.svelte` | row-model keys; `teamOptions`/`shiftOptions` | Virtualized editable table | Binds row-model keys; edits via `onInlineEdit`/`onDayToggle` into index writers |

Edits dispatch `lines:request-render`. Team Builder uses that event when `S.__USE_SVELTE_LINES` is set.

### Module: `team-builder`

`initTeamBuilder` owns Teams tab DOM. Auto-form (`utils/autoForm.js`) assigns members with a `Set` of used ids and does **not** call `S.renderLines`. `onAutoForm` / `afterMutate` do one UI sync + one lines refresh (`lines:request-render` or `renderLines`). `assignSelectedToTeam` is a one-pass Set/Map bulk move; `addMemberToTeam` remains for single edits. DnD `onEnd` syncs from DOM then one `renderAll` — it does not re-enter Auto-form.

### Module: `setup-panel`

Thin bridge over classic setup helpers. Panel markup lives in `modules/setup-panel/panel.html`, mounted on `#tab-setup`.
