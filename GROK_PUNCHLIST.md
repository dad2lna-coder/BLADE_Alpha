# BLADE Alpha — Grok Punch List: Transition to Svelte 5

**Work branch:** `svelte5-transition` (do not commit on `bright-garden`)
**Base:** `bright-garden`
**Last updated:** 2026-10-14
**HEAD:** `600910a` — generate modal in Svelte 5

Resume on `svelte5-transition`. Phases 0–2 are done. Phase 3 has forms, the shift table, the generate modal, and the RDO matrix.

## Resume here

Next slice of Phase 3, still on `svelte5-transition`:

1. Schedule locks (`scheduleLocksUi.js` / `#lock-schedules-modal`).
2. FT rebalance, DFO rebalance, and sex-swap modals.

Keep generation, rebalance, lock, cert, and extra-position logic in the existing plain JS utils. Components call those functions. They do not reimplement them.

Verify with `npm test` and `npm run build:setup-panel`. Full module build is `npm run build:modules`.

### What is already in Svelte 5

| Piece | Where | Notes |
|---|---|---|
| Tooling | `package.json`, `vite.svelte-plugin.mjs` | `svelte@^5`, plugin `^4`. Per-file runes, not a global `runes: true`. |
| Scheduler bridge | `src/lib/scheduler/bridge.svelte.js` | `$state` / `$state.raw` mirror of `Scheduler.state`. `pull`, `notify`, `patch`. Not wired into every screen yet. |
| Lines table | `modules/lines-table/LinesTable.svelte` | Runes + `@tanstack/svelte-virtual`. Host `index.js` still uses `asClassComponent` so `$set` works. |
| Shell | `src/shell/mount.js`, `src/lib/components/{ShellHeader,ThemeSwitcher,StatusBar,TabNav,ConsoleFooter,IntroSplash}.svelte`, `src/lib/shell/chrome.svelte.js` | Built to `modules/shell/dist/shell.js` (`npm run build:shell`). Manifest loader still creates panels. |
| Setup period + FTE | `PeriodForm.svelte`, `FteForm.svelte` | Same input ids (`cfg-start`, `cfg-weeks`, `cfg-ft-m`, …). `S.setupForm.pullPeriod` / `pullFte`. |
| Shift table | `ShiftsTable.svelte` | Mounted into `#shifts-tbody`. `S.setupShifts.refresh()` replaces the old `innerHTML` path. `readShiftsFromDom` still reads `data-f` / `data-pin`. |
| Generate modal | `GenerateModal.svelte`, `actions/generateModal.js` | Mounted into `#generate-modal-root`. `S.setupGenerate.open/close/refresh`. View models stay in `generateModal.js`. `S.generate`, `S.generateClass`, `S.checkParity`, `S.approveParitySwaps`, `S.proposeDfoCertBalance`, and `S.approveDfoCertBalance` are called, not copied. `getBandLabel` still exported for `parityReport.js`. |
| RDO matrix | `RdoMatrixModal.svelte`, `readRdoMatrixView` in `shiftsTable.js` | Mounted into `#rdo-matrix-root`. `S.setupRdo.open/close/refresh`. Shifts sort by start time inside `readRdoMatrixView`. Export, respin, and the rebalance/swap buttons keep their `render.js` binds. Respin modal stays classic. |

### Left classic on purpose

- Intro typewriter: `js/intro.js`. It waits for `blade-shell-ready`, then types into `#blade-term`.
- Theme persistence: `js/utils/theme.js`. `S.shellOwnsChrome` skips the old menu DOM writes. Tokens are the existing `--bg`, `--text`, `--amber`, and the rest, switched by `html[data-theme]`.
- F-keys and `switchTab`: `js/console-chrome.js` / `js/main.js`. The shell wraps `switchTab` so `shell.active` stays in sync.
- Help modal bind: `js/main.js` listens for `blade-shell-ready` because the Help button is created by the shell.
- Generate modal ids stay on the component (`#generate-modal`, `#btn-generate-all`, target/parity/DFO controls). Toolbar `#btn-generate` still calls `S.openGenerateModal()`.
- RDO matrix ids stay on the component (`#rdo-matrix-modal`, `#rdo-matrix-pos-select`, `#rdo-matrix-table-wrap`, export/respin/rebalance/swap buttons) so `bindSetupActions` still finds them. Toolbar `#btn-rdo-matrix` still calls `S.openRdoMatrixModal()`.
- Locks, rebalance, sex swap, respin modal, function coverage, cert pools, crew groups, extra positions.
- All other tabs.

### Contracts a later session must not break

- `window.Scheduler` is still the host. Svelte reads and writes it. Utils must not import Svelte.
- Shell mount order: classic scripts, then `modules/shell/dist/shell.js`, then the manifest module script. `buildNav` skips tab buttons when `Scheduler.shell` exists and calls `shell.setTabs`.
- Setup mount order: `bridgeScheduler`, then `mountSetupUi`, then `seedStartDate`, then `bindSetupActions`. Shift toolbar buttons stay in `panel.html` so those binds still find them.
- `applyFte` writes `S.state` and then `setupForm.pullFte()`. Import does the same for period and FTE.
- Module `dist/` folders are gitignored except lines-table. `npm run build:modules` must run before Pages or Tauri copy. That script now starts with `build:shell`.
- Offline and self-contained. No CDN. Do not change JSON or Excel contracts.

### Commits on this branch

```
600910a Move the generate modal into Svelte 5.
aeb53ad Move setup period, FTE, and the shift table into Svelte 5.
f908ca7 Move the ops console chrome into Svelte 5.
e66f08c Convert the lines table to Svelte 5 runes.
0fde646 Scaffold Svelte 5 on its own branch.
```

## Current state

- Host shell (`index.html` + `js/`) still creates `window.Scheduler`.
- Modules still load from `modules/manifest.json` as Vite ESM bundles.
- New Svelte lives under `src/` and is bundled into `modules/shell/dist` and `modules/setup-panel/dist`.
- Pure domain logic stays in plain JS.
- `npm test` was green after each phase above.

## Recommended strategy

Incremental Svelte 5 migration. Mix runes components with classic DOM during the transition. Keep pure engines as plain JS. Prefer the shell class and `S.setupForm` over new stores.

## Punch list

### Phase 0 — Scaffolding & Tooling
- [x] Branch `svelte5-transition` from `bright-garden`.
- [x] `svelte@^5`, `@sveltejs/vite-plugin-svelte@^4`.
- [x] `npm test` passed. `build:modules` includes `build:shell`.
- [x] `vite.svelte-plugin.mjs` shared by lines, shell, and setup.
- [x] `src/lib/scheduler`, `src/lib/components`, `src/lib/shell`, `src/shell`.
- [x] Tauri copy and Pages still run `build:modules` before packaging. No workflow edit required.
- [x] Bridge contract is `src/lib/scheduler/bridge.svelte.js`.

### Phase 1 — Lines table
- [x] Runes (`$props`, `$state`, `$derived`).
- [x] `@tanstack/svelte-virtual` instead of manual spacers.
- [x] Filter/sort stay controlled and write back through the host.
- [x] Host kept on `asClassComponent` so `$set` still works.
- [x] Lines-table edit tests passed.

### Phase 2 — Shell / chrome
- [x] Header, tabs, theme switcher, status, footer, intro splash.
- [x] Manifest loader still mounts unmigrated panels.
- [x] Theme tokens are the existing CSS variables. `S.themeTokens` lists them.
- [x] F-keys still call `switchTab`.

### Phase 3 — Setup panel
- [x] Period form, FTE counts, shift table (including RDO block/pin and day-times button).
- [x] Generate modal.
- [x] RDO matrix modal.
- [ ] Lock, rebalance, and sex-swap modals.
- [x] Generation / rebalance / lock / cert / extra-position logic still in plain JS.
- [ ] Form state fully on the scheduler bridge. Period and FTE use `S.setupForm`; shifts still commit through `readShiftsFromDom`. Generate targets still live on `S._perShiftTargets`.
- [x] Generate, DFO rebalance, sex swap, locks, and export tests still pass. Locks, rebalance, and sex-swap UIs are not converted yet.

### Phase 4 — Remaining view modules
- [ ] Coverage heatmap.
- [ ] Reports.
- [ ] Demand-capacity chart.
- [ ] Team builder. Keep SortableJS behind `{@attach}`.
- [ ] Bid planner.
- [ ] Function-coverage and rotation builder.
- [ ] Pure engines remain plain JS.

### Phase 5 — Full shell replacement and cleanup
- [ ] Svelte root replaces the `index.html` loader.
- [ ] Retire `window.Scheduler` mutation once every tab reads the bridge.
- [ ] Delete unused classic DOM paths.
- [ ] Final offline check.

### Cross-cutting
- [x] Offline-first. Libs stay local.
- [x] JSON and Excel contracts unchanged.
- [x] Existing unit tests kept green. No new component test runner yet.
- [ ] Design pass. Console chrome was moved, not restyled.
- [x] `npm test` after each phase. Manual browser smoke of the new shell and setup forms is still open.

## Rough effort

| Phase | Status | Risk |
|---|---|---|
| 0. Scaffold | Done | Low |
| 1. Lines table | Done | Low |
| 2. Shell | Done | Low–Medium |
| 3. Setup | In progress (forms, shifts, generate, RDO matrix) | Medium |
| 4. Other modules | Not started | Medium (teams DnD highest) |
| 5. Full shell + cleanup | Not started | Medium |

## Immediate next steps

1. Check out `svelte5-transition`.
2. `npm run build:modules` once so `modules/shell/dist` and `modules/setup-panel/dist` exist.
3. Convert schedule locks next. Keep rule storage and matching in `scheduleLocks.js`. The component only renders the dialog.
4. Then FT rebalance, DFO rebalance, and sex-swap modals.
5. Do not start Phase 4 until those setup dialogs are on runes and `npm test` is still green.
