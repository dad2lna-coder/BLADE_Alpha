# Bid Planner Module — Architectural & Technical Specification

## Overview
The **Bid Planner** module is a deterministic, config-driven bid scheduling engine integrated into BLADE. It calculates key milestone dates for bid operations (e.g. Leave Bids, Shift Bids) based on structured JSON rule sets and calendar configurations.

The engine operates independently of staffing lines, setup configs, function coverage, or team states.

---

## 1. Data Model

### Rules Schema (`rules.json`)
The rule configuration defines bid types, rule sets, and action sequences:

```json
{
  "bidTypes": [
    {
      "id": "leave-bid",
      "name": "Leave Bid",
      "ruleSets": [
        {
          "id": "standard-leave",
          "name": "Standard (placeholder)",
          "actions": [
            {
              "id": "announcement",
              "label": "Announcement",
              "sequence": 1,
              "offset": { "amount": 0, "unit": "calendar_days", "from": "anchor", "placeholder": true }
            },
            {
              "id": "posting",
              "label": "Posting",
              "sequence": 2,
              "offset": { "amount": 5, "unit": "business_days", "from": "announcement", "placeholder": true }
            },
            {
              "id": "conduct",
              "label": "Conduct",
              "sequence": 3,
              "offset": { "amount": 7, "unit": "calendar_days", "from": "posting", "placeholder": true }
            },
            {
              "id": "execution",
              "label": "Execution",
              "sequence": 4,
              "offset": { "amount": 10, "unit": "business_days", "from": "conduct", "placeholder": true }
            }
          ]
        }
      ]
    }
  ]
}
```

### Calendar Schema (`calendar.json`)
```json
{
  "weekendDays": [0, 6],
  "holidays": [
    { "date": "2026-01-01", "name": "New Year's Day" },
    { "date": "2026-07-04", "name": "Independence Day" },
    { "date": "2026-11-26", "name": "Thanksgiving Day" },
    { "date": "2026-12-25", "name": "Christmas Day" }
  ],
  "blackoutDates": [
    { "date": "2026-12-24", "name": "Christmas Eve Blackout" },
    { "date": "2026-12-31", "name": "New Year's Eve Blackout" }
  ]
}
```

### Schedule Row Data Record
Each action row in the generated schedule contains:
- `sequence`: Action order (1, 2, 3...)
- `action`: Labeled action name (e.g. "Posting")
- `rawDate`: Unadjusted mathematically computed date (YYYY-MM-DD)
- `requiredDate`: Final calculated date after non-silent valid business day adjustment (YYYY-MM-DD)
- `calculatedFrom`: Human-readable formula (e.g., "Announcement (+5 business_days)")
- `rule`: Applied offset rule details
- `direction`: "Forward" | "Backward"
- `adjusted`: Boolean flag (`true` if `rawDate !== requiredDate`)
- `adjustmentReason`: Explanation of adjustment (e.g. "Calculated date 2026-07-04 is a holiday. Adjusted to previous valid business day 2026-07-03.")
- `conflict`: Conflict summary if any calendar conflict exists
- `status`: Row status ("VALID", "ADJUSTED", "CONFLICT", "INCONSISTENT")
- `notes`: User notes / audit trails

---

## 2. Scheduling Algorithm

The scheduling engine uses UTC date string manipulation to ensure zero timezone drift.

### Date Helpers
- `addCalendarDays(dateStr, n)` / `subtractCalendarDays(dateStr, n)`
- `addBusinessDays(dateStr, n, calendar)` / `subtractBusinessDays(dateStr, n, calendar)`
- `isWeekend(dateStr, calendar)` / `isHoliday(dateStr, calendar)` / `isBlackoutDate(dateStr, calendar)`
- `isValidSchedulingDate(dateStr, calendar)`
- `previousValidBusinessDay(dateStr, calendar)` / `nextValidBusinessDay(dateStr, calendar)`

### Forward Calculation (from Announcement Date)
1. Set Action 1 (`Announcement`) date to Announcement Anchor (adjusted if necessary).
2. For each subsequent action $i \in [2..N]$:
   - Calculate `rawDate` = `requiredDate(i-1)` + `offset.amount` (in business or calendar days).
   - If `rawDate` lands on a weekend/holiday/blackout, adjust to `previousValidBusinessDay` (or configured rule).
   - Record `rawDate`, `requiredDate`, `adjusted`, and `adjustmentReason`.

### Backward Calculation (from Execution Date)
1. Set Action $N$ (`Execution`) date to Execution Anchor (adjusted if necessary).
2. For each preceding action $i \in [N-1 .. 1]$ in reverse sequence:
   - Calculate `rawDate` = `requiredDate(i+1)` - `offset.amount` (in business or calendar days).
   - If `rawDate` lands on a weekend/holiday/blackout, adjust to `previousValidBusinessDay` (or configured rule).
   - Record `rawDate`, `requiredDate`, `adjusted`, and `adjustmentReason`.

---

## 3. Forward / Backward Validation (Dual Anchor)

When **both** Announcement Date and Execution Date anchors are specified:
1. Compute full forward schedule from Announcement Date.
2. Compute full backward schedule from Execution Date.
3. Compare `requiredDate` for every action in the forward and backward schedules.
4. **Outcome**:
   - If all action dates match: Report `CONSISTENT` status.
   - If any action date differs: Report `DATE CONFLICT / INCONSISTENT` with explicit discrepancy details (e.g., "Posting: Forward calculates 2026-05-10, Backward calculates 2026-05-12").
   - **Crucial Rule**: The engine never silently prefers one anchor over another. Disagreements must be resolved by the user.

---

## 4. Conflict Detection Architecture

1. **Separation of Concerns**: Schedule generation runs first to compute required dates. Conflict detection runs second as a separate pass against imported calendar events, blackout dates, and holidays.
2. **Conflict Types**:
   - `same-day`: Required action falls on the same date as an existing imported calendar event.
   - `blackout`: Required action falls on a blackout date.
   - `holiday`: Required action falls on a holiday.
   - `dependency`: Action sequence or min/max offset bounds violated (e.g., manually moved action before its predecessor).
3. **No Silent Moves**: The engine will never automatically re-schedule an event due to a conflict. The user must choose a resolution action:
   - `Keep Required Date`: Retain calculated date despite conflict.
   - `Move Required Event`: Pick a new date, validate against predecessor/successor rules, show consequence preview, and explicitly accept.
   - `Keep Existing Event`: Mark action deferred or flagged.
   - `Resolve Manually`: Record audit note.

---

## 5. Non-Engine Rule Updates

A human (e.g. operations manager) can add or update bid types and rule sets without modifying engine code:
1. Open the **Rules Editor** in the Bid Planner UI panel.
2. Edit or paste the structured JSON definition following the schema.
3. Click **Apply Rules** (or **Upload Rules JSON**).
4. The system validates the schema (required fields, non-negative amounts, valid units).
5. Working copy is saved in `localStorage` (`blade-bid-planner-rules`).
6. Selecting the new Bid Type / Rule Set in the dropdown immediately uses the updated offsets for schedule calculations.
7. Click **Download Rules JSON** to export the updated configuration for source control.
