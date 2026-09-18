# Function Coverage Module Analysis

## 1) S.* exports in `js/functions.js` with line numbers (29 total)

```
037:  S.fteCapsByRoleSex
045:  S.ensureFunctionCoverage
070:  S.getFunctionMode
074:  S.syncFunctionModeUi
088:  S.fillFunctionCoverageForm
097:  S.computeShiftAnchors  (fallback: S.computeShiftAnchors || fn)
114:  S.phaseOfStart
122:  S.isAmSide
125:  S.lineStartMin
126:  S.lineRoleKey
133:  S.isOpsFunctionRole
137:  S.lineIsDfoTagged
142:  S.getRotationDuty
159:  S.lineCoversSlot
173:  S.bandForMinute
183:  S.openFunctionCoverageModal
187:  S.closeFunctionCoverageModal
188:  S.renderFunctionBandsTable
202:  S.readFunctionBandsFromDom
234:  S.updateFunctionCoveragePreview
253:  S.capFunctionPoolsToFte
274:  S.buildCertifiedPools
373:  S.generateFunctionAssignments
549:  S.ensureExtraPositions
559:  S.readExtraPositionsFromDom
582:  S.renderExtraPositions
605:  S.addExtraPosition
611:  S.buildExtraPositionLines
649:  S.clearLineFunctions
653:  S.initFunctionCoverage
```

---

## 2) Proposed `modules/function-coverage/` tree (ESM)

Pattern follows `modules/coverage/` and `modules/setup-panel/` (public `initXxx(scheduler)` entry, private `lib/` subfolders).

```
modules/function-coverage/
├── index.js                  # ESM public API — initFunctionCoveragePanel(scheduler)
├── lib/
│   ├── pools.js              # Pool data + FTE capping
│   ├── bands.js              # Band/position UI
│   ├── duty.js               # Duty/role/shift math
│   └── assign.js             # generateFunctionAssignments core
└── ui/                       # Svelte components (empty until migration)
```

**Vite pattern to copy (from `vite.lines-table.config.mjs`):**

```js
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@tanstack/svelte-virtual": resolve(__dirname, "node_modules/@tanstack/svelte-virtual/dist/index.js"),
      "@tanstack/virtual-core": resolve(__dirname, "node_modules/@tanstack/virtual-core/dist/esm/index.js"),
    },
  },
  build: {
    target: "es2020",
    module: true,
    outDir: "modules/function-coverage/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "modules/function-coverage/index.js"),
      name: "FunctionCoverage",
      formats: ["es"],
      fileName: "function-coverage",
    },
    rollupOptions: {
      output: {
        entryFileNames: "function-coverage.js",
        assetFileNames: "function-coverage.[ext]",
      },
    },
  },
});
```

Package script: `"build:function-coverage": "vite build --config vite.function-coverage.config.mjs"`

---

## 3) Symbol → file map

### Coverage (`modules/coverage/**`) — symbols on `S`

| Symbol | Covered by |
|--------|------------|
| `S.$(id)` | actions/bind.js, actions/render.js, components/cuts.js |
| `S.state (rw)` | all three dirs |
| `S.coverageView (r/w)` | actions/bind.js |
| `S.DAYS` | index.js |
| `S.slotLabel(min)` | index.js |
| `S.computeHourlyByDow()` | actions/render.js |
| `S.shiftBadge(id)` | index.js |
| `S.parseStartDate?` | index.js, components/cuts.js |
| `S.add(day)` | index.js |
| `S.renderCoverageBars()` | index.js, actions/bind.js |
| `S.renderShiftSummary()` | actions/render.js |
| `S.lineRoleKey(line)` | components/cuts.js |
| `S.getShift(id)` | components/cuts.js |
| `S.buildScheduleForLine` | components/cuts.js |
| `S.applyCoverageCutsToLines` | index.js, components/cuts.js |
| `S.generate` | components/cuts.js |
| `S.renderShifts` | components/cuts.js |
| `S.updateStatus(msg)` | components/cuts.js |
| `S.renderAll()` | components/cuts.js |

### Generate (`js/functions.js:373` `S.generateFunctionAssignments`) — symbols on `S`

| Symbol | Context |
|--------|---------|
| `S.ensureFunctionCoverage()` | 375, 434, 378, etc. |
| `S.readFunctionBandsFromDom()` | 375, 258, 265, etc. |
| `S.capFunctionPoolsToFte()` | 384 |
| `S.buildCertifiedPools()` | 387 |
| `S.timeToMin()` | 242, 279, 282, 400, 402, ... |
| `S.getShift()` | 277, 278, 329, 330, 389 |
| `S.lineRoleKey()` | 126, 134, 335, 337, 392, 395, 401, 408, ... |
| `S.getEffectiveShiftTimes?` | 160, 162 |
| `S.computeShiftAnchors()` | 531 (paintAfterAssign), 98 |
| `S.isAmSide()` | 122, 321, 323, 328, 332, 334, 364, 369 |
| `S.phaseOfStart()` | 114, 320, 322, 327, 331, 333, 363, 368 |
| `S.lineStartMin()` | 125, 316, 318, 361, 363, 366, 368, 369, 371 |
| `S.lineCoversSlot()` | 159, 399, 411, 415 |
| `S.bandForMinute()` | 173, 325, 326, 329, 330, 335, 337, 340, 346, 351, 356, 361, 363, 366, 368, 369, 371 |
| `S.slotLabel()` | 532 |
| `S.__USE_SVELTE_LINES` | 526 |
| `S.renderCoverageBars()` | 531 (paintAfterAssign) |
| `S.renderReports()` | 532 (paintAfterAssign) |
| `S.renderLines()` | 534 (paintAfterAssign, conditional) |
| `S.renderIssues()` | 478 |
| `S.updateStatus()` | 386, 542, 543 |
| `S.closeFunctionCoverageModal()` | 543 |
| `S.renderAll()` | 533 (paintAfterAssign) |
| `window.dispatchEvent(...)` | 533 (paintAfterAssign) |

### Setup (`modules/setup-panel/**`) — symbols on `S`

| Symbol | Covered by |
|--------|------------|
| `S.rebuildSetupTab` | bridge.js:9-10, index.js:47 |
| `S.syncHoursFromAirfield()` | bridge.js:11, render.js:4, sync.js |
| `S.paintFunctionCoverage()` | bridge.js:12, render.js:5, paint.js |
| `S.renderShiftsTable()` | bridge.js:13, render.js:8, paint.js |
| `S.readShiftsFromDom()` | bridge.js:14 |
| `S.shiftSeq` | bridge.js:17 |
| `S.snapshotFte()` | bridge.js:18, fte.js |
| `S.applyFte()` | bridge.js:19, fte.js |
| `S.initFunctionCoverage()` | index.js:14-18 (guarded) |
| `S.fillFunctionCoverageForm()` | index.js:16-17, paint.js:12-15 |
| `S._funcCoverageBound` | index.js:19-27 |
| `S.addFcBand()` | render.js:59-60, index.js:36 |
| `S.applyPayload()` | render.js:68-80 (wrapped) |
| `S._fcImportPatch` | render.js:68, 81 |
| `S.readFunctionBandsFromDom()` | render.js:61, paint.js:17 |
| `S.ensureFunctionCoverage()` | render.js:62, paint.js:11 |
| `S.renderFunctionBandsTable()` | render.js:63, paint.js:13 |
| `S.updateFunctionCoveragePreview()` | render.js:64, paint.js:14 |
| `S.renderCoverageBars()` | bind.js:30 |
| `S.coverageView (r/w)` | bind.js:14-21 |
| `S.state (rw)` | sync.js:8-9, fte.js:10-19, paint.js:21, etc. |
| `S.getAirportConfig()` | sync.js:5 |
| `S.exportStaffingConfig()` | paint.js:15-36 |
| `S.saveBlob()` | paint.js:32 |
| `S.exportFileName()` | paint.js:32 |
| `S.updateStatus()` | paint.js:35 |
| `S.dj` | paint.js:24 (dayjs read) |

---

### Note: Coverage/Generate/Setup overlap

Several symbols are **redundant** across the three areas:

| Symbol | Covered by |
|--------|------------|
| `S.state` | All three |
| `S.updateStatus()` | Coverage (cuts.js), Generate (542), Setup (paint.js) |
| `S.renderCoverageBars()` | Coverage (bind.js, paint.js in Setup), Generate (paintAfterAssign) |
| `S.ensureFunctionCoverage()` | Coverage (via init), Generate, Setup (paint.js) |
| `S.renderFunctionBandsTable()` | Coverage (bound), Generate, Setup |
| `S.readFunctionBandsFromDom()` | Coverage, Generate, Setup |

This overlap is intentional—`generateFunctionAssignments` is the orchestration function at `373` and needs read/write access to all function-coverage state; Coverage module provides the helper functions; Setup panel provides the UI bridge.