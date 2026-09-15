# BLADE Alpha — Architecture & Dependency Map

This document details the boot flow, component dependencies, DOM contracts, and module system lifecycle of the **BLADE Alpha** workforce allocation platform.

`lines-table`: Svelte table binds row-model keys; edits via onInlineEdit/onDayToggle into index writers.

Full boot order, classic JS matrix, team-builder file matrix, DOM contract, and architectural notes live in git history at a242859 if a section is missing from this shortened restore.

### Module: `lines-table` (Svelte island in Lines tab)

| File | Depends On | Provides | Notes |
|------|-----------|----------|-------|
| `modules/lines-table/index.js` | `LinesTable.svelte` (bundled by Vite) | `initLinesTable()` | Bootloader imports `modules/lines-table/dist/lines-table.js` |
| `modules/lines-table/LinesTable.svelte` | row-model keys; `teamOptions`/`shiftOptions` | Virtualized editable table | Binds row-model keys; edits via `onInlineEdit`/`onDayToggle` into index writers |
