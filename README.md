# BLADE_Alpha

**Offline staffing scheduler.**

BLADE Alpha builds airport security bid lines (TSO / LTSO / STSO) in the browser. Core scheduling stays local. Tab panels load as ES modules from `modules/manifest.json`, so use a local server or the GitHub Pages demo rather than a raw `file://` open.

[![GitHub Pages](https://img.shields.io/badge/live-GitHub%20Pages-blue?logo=github)](https://dad2lna-coder.github.io/BLADE_Alpha/)
![Built with](https://img.shields.io/badge/built%20with-HTML%2FJS%2FCSS%20%2B%20modules-orange)

---

## Quick Start

### Run locally

```bash
git clone https://github.com/dad2lna-coder/BLADE_Alpha.git
cd BLADE_Alpha
git checkout bright-garden
npm install
npm run build:modules
python3 -m http.server 8000
# open http://localhost:8000
```

Classic scripts also run if you double-click `index.html`, but tab modules mount from `modules/manifest.json` dist entries and need HTTP.

### Live demo

https://dad2lna-coder.github.io/BLADE_Alpha/

That URL is GitHub Pages from **bright-garden** (see `.github/workflows/pages.yml`). GitHub Actions automatically builds all Vite module bundles via `npm run build:modules` on deploy.

---

## Features

### Tab workflow

| Tab | Purpose |
| --- | --- |
| **[F1] Setup** | Weeks, FTE by role/sex, BAG + DFO pools, shifts, Generate |
| **[F2] Lines** | Virtualized bid-line table (Svelte island); Excel export |
| **[F3] Coverage** | 30-minute headcount matrix, coverage cuts, shift mix |
| **[F4] Reports** | Passenger / bag-DFO / total / pool dashboards & capacity math |
| **[F5] Teams** | Architecture, auto-form by RDO, drag-drop boards |
| **[F6] Capacity** | Checkpoint lane demand & mod-set board |
| **[F7] Demand** | Import flight-volume xlsx vs PAX staffing capacity |

### Core capabilities

- Generate balanced lines from shift force + FTE, with RDO patterns and gender balance
- Function duties (BAG / DFO / PAX) assigned in the same **[GEN] GENERATE** pass
- Team auto-form by RDO; unassigned pool + AM/PM boards
- JSON import/export of the full session; Excel export of lines
- Optional volume vs capacity overlay on Demand
- Airfield modal for airport hours, terminals, checkpoints

---

## Architecture (Host as Renderer)

The host shell (`index.html` + thin `js/` runtime) acts purely as a renderer:
1. Loads `modules/manifest.json`
2. Mounts each module's Vite-built single-file `dist/*.js` into its tab/panel slot
3. Owns the single shared `Scheduler` state store and EXP/IMP (`js/io.js`)
4. Owns shell chrome (intro, console header/footer, instructions modal, theme)

Every feature (Setup UI + generate/allocation, Lines grid + row-model + line-colors, Coverage, Reports + capacity math, Teams, Demand) lives in its owning module's source and ships as a Vite-built ESM dist bundle.

```
BLADE_Alpha/
├── index.html                 # Shell, tab nav, module loader
├── README.md
├── INSTRUCTIONS.md            # User guide
├── DEPENDENCY_MAP.md          # Architecture, boot flow, module contracts
├── package.json               # Vite module build scripts + dev deps
│
├── css/                       # Console chrome, print, intro
├── js/                        # Host shell scripts (constants, utils, io, main, chrome)
├── lib/                       # Vendor libs (Sortable, luxon, ExcelJS)
├── modules/
│   ├── manifest.json          # Module manifest pointing to dist/*.js entries
│   ├── setup-panel/           # Setup tab UI, shift math, allocation & generate engine
│   ├── function-coverage/     # Engine-only function duty assignment (BAG/DFO/PAX)
│   ├── lines-table/           # Svelte 4 virtualized table island + row model
│   ├── coverage/              # 30-min heatmap, shift mix, coverage cuts
│   ├── reports/               # Management reports, capacity math & mod-set board
│   ├── team-builder/          # Team architecture, auto-form, drag-drop boards
│   └── demand-capacity/       # Flight volume xlsx parser & pax capacity overlay
└── .github/workflows/
    ├── pages.yml              # Pages workflow (runs npm run build:modules)
    └── rebuild-lines-table.yml
```

Details: [DEPENDENCY_MAP.md](DEPENDENCY_MAP.md).

---

## Development

### Commands

```bash
npm install
npm run build:modules            # Builds Vite ESM dists for all modules
npm run test:function-coverage  # Run function coverage engine test
npm run test:demand-capacity     # Run demand parser test
node test-task1.js              # Run lines row model test
```

---

## License & Support

https://dad2lna-coder.github.io/BLADE_Alpha/

**v0.2 · bright-garden · docs synced Sep 2026**
