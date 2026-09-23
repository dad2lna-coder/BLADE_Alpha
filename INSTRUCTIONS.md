# BLADE Alpha — Schedule Builder Instructions

## Overview
BLADE Alpha is a browser staffing scheduler for TSO, LTSO, and STSO bid lines. It runs from this repo (or the GitHub Pages build). Schedule data stays in the page until you Export.

Use a local web server or the live demo. Opening `index.html` as a `file://` page loads the classic scripts, but tab modules (Setup, Coverage, Demand, Teams) need `fetch` and will not mount.

Nav keys shown in the chrome: **[F1] SETUP**, **[F2] COVERAGE**, **[F7] DEMAND**, **[F3] LINES**, **[F4] TEAMS**, **[F5] REPORTS**, **[F6] CAPACITY**.

---

## Step 1: Setup Tab

### 1.1 Schedule period
- Set **Schedule start** and **Weeks** (1–8). Default is **1 week** (7 days).
- Operating open/close default to **03:30–23:00**. Those fields are hidden on Setup; change airport hours in **[CFG] AIRFIELD**.

### 1.2 Staffing (FTE)
Open the **FTE** fold and set headcount by sex:
- **FT TSO** / **PT TSO** — operational officers
- **LTSO** / **STSO** — lead and supervisory pools
- Optional **+ Add position** for extra non-TSO jobs
- **Save staffing** writes FTE + function-coverage pools only. It does **not** build lines.

### 1.3 Function coverage
Open the **Function coverage** fold.
- **BAG pool** and **DFO pool** both run. Each is Male/Female × STSO/LTSO/TSO, carved from FTE.
- Leftover operational lines become **PAX**.
- BAG-pool lines stay BAG on every WORK day.
- DFO-pool lines mix DFO identity with PAX; shift min/max can place BAG duties on some DFO work days.
- Min/max on the bands table are **counts of generated lines per role and shift**, not 30-minute headcount.
- Optional: phase threshold, 50/50 AM–PM split, shortfall bias, **+ Add shift** rows.

There is no separate “Generate Function Assignments” control. **[GEN] GENERATE** builds lines and then assigns functions in the same pass.

### 1.4 Shifts
- **+ Add shift** and set name, start, end, paid hours, TSO / LTSO / STSO force, hard RDOs (Sun–Sat), and per-day time overrides.

### 1.5 Generate
- Click **[GEN] GENERATE** in the top bar.
- Review any notes under the Setup issues list, then open Coverage and Lines.

---

## Step 2: Coverage Tab

- 30-minute matrix by day of week (Sun–Sat).
- Filters: STSO / LTSO / TSO and All / DFO / Baggage / PAX.
- **Coverage cuts** drop a percent of matching lines on selected weekdays (whole shift; no mid-day split). Generate again after adding cuts.
- Typical-day bars and a shift-mix table.

---

## Step 3: Demand Tab

Optional passenger-volume check. Does not rewrite lines.

1. Import a flight-list `.xlsx` with columns **DAY_OF_WEEK**, **ETD**, **CAPACITY**, **PERCENT_ORIGINATING**.
2. Generate lines first.
3. Click **Refresh**.

Volume is spread from ETD − 120 through ETD − 30. Capacity is qualifying **PAX** people on the slot × 18 pax / 30 min (TSOs; optionally LTSOs). BAG, DFO, and STSO do not count.

---

## Step 4: Teams Tab

1. Set architecture counts: STSO / LTSO / TSO per team (defaults 1 / 1 / 6).
2. Click **Auto-form teams**. Matching RDO patterns are grouped; leftovers stay in **Unassigned pool**.
3. Expand the pool (collapsed by default) and drag cards onto AM/PM team boards.
4. Boards are compact until expanded. **+ New team** and **Build** are for extra teams and the follow-me / build docks.

---

## Step 5: Lines Tab

- Virtualized table (Svelte by default) of each bid line: role, shift, team, RDOs, duties.
- Filters: role, shift, sex, team.
- Click cells to tweak when the table is in edit mode.
- **Export Excel (.xlsx)** downloads the published lines.

To force the older DOM table: `?lines=classic` or `localStorage.setItem('blade:lines:svelte','0')`.

---

## Step 6: Reports and Capacity

- **Reports** — passenger / baggage-DFO / total / DFO-pool views, gender mix, team cohesion.
- **Capacity** — checkpoint lane math from Airfield config (TSO per program, lanes, supervisor seats). Open **[CFG] AIRFIELD** first.

---

## Import / Export

- **[EXP] EXPORT** / **[IMP] IMPORT** — full config + lines as JSON.
- Lines tab **Export Excel** — spreadsheet only.
- **[CLR] CLEAR** wipes the current session.

On the Windows/Tauri work install, files go under the shared Schedule Builder folder. See **TEAM-SETUP.md**. GitHub Pages is the web preview, not the official work copy.

---

## Complete workflow

```
Setup
  1. Start date + weeks
  2. FTE by role and sex
  3. BAG + DFO pools and shift min/max
  4. Shifts and forces
  5. [GEN] GENERATE  (lines + function duties)
       ↓
Coverage — heatmap, cuts, shift mix
Demand — optional volume xlsx vs PAX capacity
Teams — architecture, Auto-form, drag from Unassigned pool
Lines — review, edit, Export Excel
Reports / Capacity — management views
Export JSON if you need to reload later
```

---

## Tips

- Generate after changing FTE, shifts, pools, or coverage cuts.
- BAG and DFO pools are carved from the same FTE; leftover ops lines are PAX.
- Unassigned pool cards are not built until you expand that section.
- Compact team boards do not paint member cards until expanded; that is intentional.

---

## Support

GitHub issues: https://github.com/dad2lna-coder/BLADE_Alpha/issues
