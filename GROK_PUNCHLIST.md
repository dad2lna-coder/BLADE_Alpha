# BLADE Alpha — Grok Punch List: Transition to Svelte 5

**Branch:** bright-garden  
**Date:** 2026-10-14  
**Goal:** Incremental migration from hybrid classic JS + one Svelte 4 island to Svelte 5 (runes) while preserving offline-first, modular architecture, pure engines, Tauri, and existing tests.

## Current State Summary

- Host shell (`index.html` + `js/`) creates shared mutable `window.Scheduler`.
- Modules load via `modules/manifest.json` as Vite ESM bundles that mount HTML panels and attach methods to `Scheduler`.
- Only Svelte surface: `modules/lines-table/LinesTable.svelte` (Svelte 4 style — `export let`, `$:` , `on:`, manual virtualization).
- Pure domain logic (generation, rebalance, coverage math, function coverage, bid rules) is in plain JS and relatively well-separated.
- Dependencies: svelte ^4.2.19, @sveltejs/vite-plugin-svelte ^3, @tanstack/svelte-virtual, Tauri, local vendor libs.
- Offline-first, self-contained preference must be preserved.

## Recommended Strategy

Incremental Svelte 5 migration (not big-bang). Svelte 5 is largely backward-compatible; mix legacy and runes components during transition. Keep pure engines as plain JS. Bridge via thin reactive adapter around `Scheduler` (or class with `$state`) until the shell is fully replaced.

## Punch List

### Phase 0 — Scaffolding & Tooling (1–2 days)
- [ ] Create branch from bright-garden.
- [ ] Upgrade dependencies: `svelte@^5`, `@sveltejs/vite-plugin-svelte@^4` (or current compatible).
- [ ] Verify `npm run build:modules` and `npm test` still pass after upgrade.
- [ ] Add root or shared Vite config that supports both existing modules and new Svelte code.
- [ ] Create `src/` structure for new Svelte code:
  ```
  src/
    lib/
      scheduler/     # reactive bridge + re-exports of pure engines
      components/    # shared UI primitives
      stores/        # or Scheduler class with $state fields
  ```
- [ ] Ensure Tauri packaging and GitHub Pages workflows continue to work.
- [ ] Document the reactive bridge contract (shape that mirrors current `S.state`).

### Phase 1 — Lines Table (highest leverage, already Svelte) (2–4 days)
- [ ] Convert `LinesTable.svelte` to Svelte 5 runes (`$props`, `$state`, `$derived`, event attributes).
- [ ] Replace manual spacer-row virtualization with `@tanstack/svelte-virtual` (or clean Svelte 5 equivalent).
- [ ] Move filter/sort state into component or small store; keep write-back to `Scheduler.state` initially.
- [ ] Run `npx sv migrate svelte-5` as starting point, then hand-tune.
- [ ] Verify inline edits, day duty/time edits, sorting, filtering, and coverage refresh events still work.

### Phase 2 — Shell / Chrome (3–5 days)
- [ ] Extract header, tab navigation, theme switcher, status bar, and intro splash into Svelte components.
- [ ] Keep manifest loader so unmigrated modules still mount into panels.
- [ ] Map existing theme system (`js/utils/theme.js`) to CSS custom properties consumed by Svelte components.
- [ ] Preserve F-key shortcuts and console chrome behavior.

### Phase 3 — Setup Panel (largest UI surface) (1–2 weeks)
- [ ] Split setup-panel UI into Svelte components (shifts table, FTE inputs, generate controls, modals, locks, etc.).
- [ ] Keep generation / rebalance / lock / cert / extra-position logic in existing plain JS utils.
- [ ] Bridge form state through the reactive Scheduler adapter.
- [ ] Ensure Generate pass, DFO rebalance, sex swap, schedule locks, and export still function identically.

### Phase 4 — Remaining View Modules
- [ ] Coverage heatmap (display + cuts interaction).
- [ ] Reports (management, gender, capacity math, print).
- [ ] Demand-capacity chart.
- [ ] Team builder (careful with SortableJS — use `{@attach}` / action or replace with Svelte-friendly DnD).
- [ ] Bid planner.
- [ ] Function-coverage modal and rotation builder.
- [ ] Pure engines remain plain JS throughout.

### Phase 5 — Full Shell Replacement & Cleanup
- [ ] Replace `index.html` loader with Svelte root component once most tabs are migrated.
- [ ] Retire global `window.Scheduler` mutation pattern in favor of reactive store/class.
- [ ] Update Tauri packaging and Pages workflow.
- [ ] Delete unused classic DOM rendering paths and orphan files.
- [ ] Final pass on offline/self-contained guarantees.

### Cross-Cutting
- [ ] Preserve offline-first: all libs local/vendored, no CDNs.
- [ ] Keep JSON import/export and Excel export contracts intact.
- [ ] Maintain and extend existing unit test suite; add component tests for new surfaces.
- [ ] Design: intentional, non-templated visual decisions (refine existing console/retro chrome rather than wholesale replace).
- [ ] Run full test suite and manual smoke test after each phase.

## Rough Effort

| Phase | Effort | Risk |
|-------|--------|------|
| 0. Scaffold + Svelte 5 upgrade | 1–2 days | Low |
| 1. Lines table → runes | 2–4 days | Low |
| 2. Shell/chrome | 3–5 days | Low–Medium |
| 3. Setup panel | 1–2 weeks | Medium |
| 4. Other modules | 2–4 weeks | Medium (teams DnD highest) |
| 5. Full shell + cleanup | 1 week | Medium |
| **Total (incremental)** | **~6–10 weeks** part-time | Manageable |

## Immediate Next Steps

1. Create branch from bright-garden.
2. Bump dependencies and verify builds + tests.
3. Add minimal Svelte 5 root that can coexist with existing shell.
4. Convert `LinesTable.svelte` to runes as proof-of-concept.
5. Define reactive bridge interface.

---

*Generated by Grok as part of BLADE Alpha Svelte transition scoping.*
