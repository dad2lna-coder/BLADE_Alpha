# BLADE_Alpha

**Offline staffing scheduler.**

BLADE Alpha builds airport security bid lines (TSO / LTSO / STSO) in the browser. Core scheduling stays local. Tab panels load as ES modules from this repo, so use a local server or the GitHub Pages demo rather than a raw `file://` open.

[![GitHub Pages](https://img.shields.io/badge/live-GitHub%20Pages-blue?logo=github)](https://dad2lna-coder.github.io/BLADE_Alpha/)
![Built with](https://img.shields.io/badge/built%20with-HTML%2FJS%2FCSS%20%2B%20modules-orange)

---

## Quick Start

### Run locally

```bash
git clone https://github.com/dad2lna-coder/BLADE_Alpha.git
cd BLADE_Alpha
git checkout bright-garden
python -m http.server 8000
# open http://localhost:8000
```

Classic scripts also run if you double-click `index.html`, but Setup, Coverage, Demand, and Teams mount from `modules/manifest.json` and need HTTP.

### Live demo

https://dad2lna-coder.github.io/BLADE_Alpha/

That URL is GitHub Pages from **bright-garden** (see `.github/workflows/pages.yml`). It does **not** track **main**. **main** is the Windows / Tauri app line. Workplace install and OneDrive export paths are in [TEAM-SETUP.md](TEAM-SETUP.md).

---

## Features

### Tab workflow

| Tab | Purpose |
| --- | --- |
| **[F1] Setup** | Weeks, FTE by role/sex, BAG + DFO pools, shifts |
| **[F2] Coverage** | 30-minute headcount matrix, coverage cuts, shift mix |
| **[F7] Demand** | Import flight-volume xlsx vs PAX staffing capacity |
| **[F3] Lines** | Bid-line table (Svelte island by default); Excel export |
| **[F4] Teams** | Architecture, auto-form by RDO, drag-drop boards |
| **[F5] Reports** | Passenger / bag-DFO / total / pool dashboards |
| **[F6] Capacity** | Checkpoint lane demand from Airfield config |

### Core capabilities

- Generate balanced lines from shift force + FTE, with RDO patterns and gender balance
- Function duties (BAG / DFO / PAX) assigned in the same **[GEN] GENERATE** pass
- Team auto-form by RDO; unassigned pool + AM/PM boards
- JSON import/export of the full session; Excel export of lines
- Optional volume vs capacity overlay on Demand
- Airfield modal for airport hours, terminals, checkpoints

Scheduling math does not call a backend. Module HTML/JS still has to be served over HTTP.

---

## Architecture

Classic IIFE scripts attach to `window.Scheduler`. After that, `index.html` fetches `modules/manifest.json` and mounts each panel.

```
BLADE_Alpha/
├── index.html                 # Shell, tabs, script + module loader
├── README.md
├── INSTRUCTIONS.md            # User guide (also embedded in js/instructions.js)
├── DEPENDENCY_MAP.md          # Boot order and module contracts
├── TEAM-SETUP.md              # Windows / OneDrive work install
├── package.json               # Vite island builds + Tauri scripts
│
├── css/                       # Console chrome, print, intro
├── js/                        # Classic Scheduler scripts (see DEPENDENCY_MAP)
├── lib/                       # dayjs, Sortable, luxon, ExcelJS
├── modules/
│   ├── manifest.json
│   ├── setup-panel/
│   ├── coverage/
│   ├── demand-capacity/
│   ├── function-coverage/     # SoT for BAG/DFO/PAX assignment
│   ├── lines-table/           # Svelte island + dist bundle
│   └── team-builder/
├── airport/airfield.json
├── scripts/copy-frontend.js   # Tauri frontend copy
└── src-tauri/                 # Desktop wrapper (main-line workflow)
```

Removed from the live boot path (files may still sit in `js/`): `functions.js`, `team-build.js`, `team-core.js`, `coverage-cuts.js`. Function coverage lives in `modules/function-coverage/`. Teams live in `modules/team-builder/`.

Details: [DEPENDENCY_MAP.md](DEPENDENCY_MAP.md).

---

## How it works

```
Setup (FTE, pools, shifts)
        ↓
[GEN] GENERATE → lines + schedules + function duties
        ↓
Coverage / Demand review
        ↓
Teams (auto-form + drag-drop)
        ↓
Lines Excel + JSON export
```

Generate (`js/schedule.js`):

1. Read period, FTE, and shifts from the Setup DOM
2. Allocate TSO / LTSO / STSO counts from each shift's force
3. Build bid lines and a WORK/RDO calendar for `weeks × 7` days
4. Call `generateFunctionAssignments({ fromGenerate: true })` when the function-coverage module is loaded
5. Paint Coverage and Lines

BAG-pool lines are BAG on every WORK day. DFO-pool lines keep DFO identity; leftover ops lines are PAX. Shift min/max can rotate BAG duties onto DFO work days.

---

## Usage (short)

**Setup** — start date, 1–8 weeks, FTE folds, BAG + DFO pools, shift table, then **[GEN] GENERATE**.

**Coverage** — role and function filters; optional coverage cuts (whole shift, selected weekdays).

**Demand** — xlsx columns `DAY_OF_WEEK`, `ETD`, `CAPACITY`, `PERCENT_ORIGINATING`. Capacity = PAX people on the slot × 18 pax / 30 min.

**Lines** — filter and export. Svelte table is on unless `?lines=classic` or `blade:lines:svelte=0`.

**Teams** — set STSO/LTSO/TSO architecture, Auto-form teams, expand Unassigned pool to drag.

**Airfield** — **[CFG] AIRFIELD** for hours, terminals, lanes used by the Capacity tab.

Full click-path: [INSTRUCTIONS.md](INSTRUCTIONS.md) or **[HLP] INSTRUCTIONS** in the app.

---

## Development

### Stack

- Classic scripts: IIFE on `window.Scheduler` (no bundler for the shell)
- Modules: native ESM loaded from `modules/manifest.json`
- Islands: Svelte 4 + Vite for `lines-table` (and a function-coverage Vite config if you rebuild that bundle)
- Vendors in `lib/`: dayjs, Sortable.js, Luxon, ExcelJS

### Commands

```bash
npm install
npm run build:lines-table        # modules/lines-table/dist/*
npm run build:function-coverage  # optional FC bundle
npm run test:function-coverage
npm run test:demand-capacity
npm run copy-frontend            # dist-frontend/ for Tauri
```

Pages deploy copies `index.html`, `css/`, `js/`, `lib/`, `modules/`, and `airport/` only.

### Common edits

- New Setup field: `modules/setup-panel/panel.html` + `js/state.js` + the module that reads it
- Allocator: `js/allocation.js` and `js/schedule.js`
- Function duties: `modules/function-coverage/lib/`
- Theme: `css/styles.css` and `css/console.css`

---

## Known limitations

- Module tabs need HTTP (`file://` will not fetch `modules/manifest.json`)
- Re-Generate replaces lines; manual line/team edits are not merged automatically
- Coverage-cut and team-builder edge cases still need a careful Generate → review pass
- Large rosters: pool cards paint only after the Unassigned section is expanded
- Dark console theme only

---

## Requirements

Chrome / Edge / Firefox current, or Safari 16+. Serve over `http://localhost` or Pages.

---

## Contributing

https://github.com/dad2lna-coder/BLADE_Alpha/issues

Workplace desktop install: [TEAM-SETUP.md](TEAM-SETUP.md).

**v0.2 · bright-garden · docs synced Sep 2026**
