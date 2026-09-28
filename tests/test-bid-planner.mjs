/**
 * Node Unit Tests for Bid Planner Module
 * Tests date engine, forward/backward scheduling, dual anchor validation,
 * calendar conflicts, manual move validation, leap years, and boundary conditions.
 */

import assert from "node:assert/strict";
import {
  addCalendarDays,
  subtractCalendarDays,
  addBusinessDays,
  subtractBusinessDays,
  isWeekend,
  isHoliday,
  isBlackoutDate,
  isValidSchedulingDate,
  previousValidBusinessDay,
  nextValidBusinessDay
} from "../modules/bid-planner/js/calendar.js";
import {
  calculateForwardSchedule,
  calculateBackwardSchedule,
  generateSchedule
} from "../modules/bid-planner/js/scheduler.js";
import { detectConflicts } from "../modules/bid-planner/js/conflicts.js";
import { validateMoveEvent, validateAnchors } from "../modules/bid-planner/js/validation.js";
import {
  exportScheduleCsv,
  importScheduleCsv,
  parseCalendarImport
} from "../modules/bid-planner/js/importExport.js";
import {
  validateRulesSchema,
  validateCalendarSchema,
  getDefaultRules,
  getDefaultCalendar
} from "../modules/bid-planner/js/rules.js";

const testCalendar = {
  weekendDays: [0, 6], // Sunday=0, Saturday=6
  holidays: [
    { date: "2026-01-01", name: "New Year's Day" },
    { date: "2026-01-02", name: "Day After New Year (Consecutive)" },
    { date: "2026-07-04", name: "Independence Day" },
    { date: "2026-12-25", name: "Christmas Day" }
  ],
  blackoutDates: [
    { date: "2026-12-24", name: "Christmas Eve" }
  ]
};

const testRuleSet = {
  id: "test-rs",
  name: "Test Rule Set",
  actions: [
    { id: "announcement", label: "Announcement", sequence: 1, offset: { amount: 0, unit: "calendar_days" } },
    { id: "posting", label: "Posting", sequence: 2, offset: { amount: 5, unit: "business_days" } },
    { id: "conduct", label: "Conduct", sequence: 3, offset: { amount: 7, unit: "calendar_days" } },
    { id: "execution", label: "Execution", sequence: 4, offset: { amount: 10, unit: "business_days" } }
  ]
};

console.log("Running Bid Planner unit tests...");

// 1. Calendar & Date Math Tests
{
  // Weekday / Weekend
  assert.equal(isWeekend("2026-07-01", testCalendar), false); // Wednesday
  assert.equal(isWeekend("2026-07-04", testCalendar), true);  // Saturday
  assert.equal(isWeekend("2026-07-05", testCalendar), true);  // Sunday

  // Holiday & Blackout
  assert.equal(isHoliday("2026-07-04", testCalendar), true);
  assert.equal(isBlackoutDate("2026-12-24", testCalendar), true);
  assert.equal(isValidSchedulingDate("2026-07-04", testCalendar), false);

  // Calendar Day Math
  assert.equal(addCalendarDays("2026-01-28", 5), "2026-02-02"); // Month boundary
  assert.equal(subtractCalendarDays("2026-03-02", 5), "2026-02-25"); // Feb non-leap
  assert.equal(addCalendarDays("2026-12-30", 5), "2027-01-04"); // Year boundary

  // Leap Year Math
  assert.equal(addCalendarDays("2028-02-27", 3), "2028-03-01"); // 2028 is leap year (Feb 29 exists)
  assert.equal(subtractCalendarDays("2028-03-01", 1), "2028-02-29");

  // Business Day Math (skips weekends + holidays)
  // 2026-07-01 (Wed) + 5 business days:
  // Thu Jul 02 (1), Fri Jul 03 (2), Sat/Sun skip, Mon Jul 06 (3), Tue Jul 07 (4), Wed Jul 08 (5)
  assert.equal(addBusinessDays("2026-07-01", 5, testCalendar), "2026-07-08");

  // Consecutive Holidays Adjustments
  // 2026-01-01 (Thu holiday) & 2026-01-02 (Fri holiday) & Sat/Sun weekend
  // Previous valid business day from 2026-01-01 should step back to 2025-12-31 (Wed)
  assert.equal(previousValidBusinessDay("2026-01-01", testCalendar), "2025-12-31");
  // Next valid business day from 2026-01-01 should step forward to 2026-01-05 (Mon)
  assert.equal(nextValidBusinessDay("2026-01-01", testCalendar), "2026-01-05");

  console.log("✓ Calendar & Date Math tests passed.");
}

// 2. Forward & Backward Scheduling Tests
{
  // Forward calculation from 2026-05-04 (Mon)
  const forward = calculateForwardSchedule(testRuleSet, "2026-05-04", testCalendar, "previous");
  assert.equal(forward.length, 4);
  assert.equal(forward[0].action, "Announcement");
  assert.equal(forward[0].requiredDate, "2026-05-04");

  // Announcement (2026-05-04 Mon) + 5 business days = 2026-05-11 (Mon)
  assert.equal(forward[1].action, "Posting");
  assert.equal(forward[1].requiredDate, "2026-05-11");

  // Backward calculation from 2026-06-15 (Mon)
  const backward = calculateBackwardSchedule(testRuleSet, "2026-06-15", testCalendar, "previous");
  assert.equal(backward.length, 4);
  assert.equal(backward[3].action, "Execution");
  assert.equal(backward[3].requiredDate, "2026-06-15");

  console.log("✓ Forward & Backward scheduling tests passed.");
}

// 3. Dual Anchor Matching & Conflict Validation
{
  // Test case where forward from Announcement matches backward from Execution
  const f = calculateForwardSchedule(testRuleSet, "2026-05-04", testCalendar, "previous");
  const exeDate = f[3].requiredDate; // Use exact matching Execution date

  const resMatching = generateSchedule(testRuleSet, "2026-05-04", exeDate, testCalendar, "previous");
  assert.equal(resMatching.status, "SUCCESS");
  assert.equal(resMatching.overallStatus, "CONSISTENT");

  // Test case with conflicting anchors
  const resConflicting = generateSchedule(testRuleSet, "2026-05-04", "2026-05-10", testCalendar, "previous");
  assert.equal(resConflicting.status, "SUCCESS");
  assert.equal(resConflicting.overallStatus, "DATE CONFLICT");
  assert.ok(resConflicting.message.includes("DATE CONFLICT"));

  console.log("✓ Dual Anchor matching and conflict validation passed.");
}

// 4. Calendar Conflict Detection
{
  const schedule = [
    { sequence: 1, actionId: "announcement", action: "Announcement", requiredDate: "2026-07-01", status: "VALID" },
    { sequence: 2, actionId: "posting", action: "Posting", requiredDate: "2026-07-04", status: "VALID" } // 2026-07-04 is Independence Day
  ];

  const importedEvents = [
    { date: "2026-07-01", title: "Existing Staff Meeting" }
  ];

  const conflictRes = detectConflicts(schedule, importedEvents, testCalendar);
  assert.equal(conflictRes.conflictCount, 2);

  // Row 1 should have imported event conflict
  assert.ok(conflictRes.schedule[0].conflict.includes("Existing Staff Meeting"));

  // Row 2 should have holiday conflict
  assert.ok(conflictRes.schedule[1].conflict.includes("Independence Day"));

  console.log("✓ Calendar Conflict Detection tests passed.");
}

// 5. Move Event & Dependency Validation
{
  const schedule = [
    { sequence: 1, actionId: "announcement", action: "Announcement", requiredDate: "2026-05-04" },
    { sequence: 2, actionId: "posting", action: "Posting", requiredDate: "2026-05-11" },
    { sequence: 3, actionId: "conduct", action: "Conduct", requiredDate: "2026-05-18" }
  ];

  // Moving Posting to 2026-05-12 is valid (between 2026-05-04 and 2026-05-18)
  const validMove = validateMoveEvent(schedule, "posting", "2026-05-12", testRuleSet, testCalendar);
  assert.equal(validMove.valid, true);

  // Moving Posting to 2026-05-01 precedes Announcement (predecessor violation)
  const invalidMove = validateMoveEvent(schedule, "posting", "2026-05-01", testRuleSet, testCalendar);
  assert.equal(invalidMove.valid, false);
  assert.ok(invalidMove.consequences[0].includes("VIOLATION"));

  console.log("✓ Move Event & Dependency Validation tests passed.");
}

// 6. CSV Round-Trip Export/Import Tests
{
  const schedule = [
    {
      sequence: 1,
      actionId: "announcement",
      action: "Announcement",
      requiredDate: "2026-05-04",
      calculatedFrom: "Announcement Anchor",
      rule: "0 calendar_days",
      direction: "Forward",
      adjusted: false,
      adjustmentReason: "None",
      conflict: "None",
      status: "VALID",
      notes: "PLACEHOLDER RULE"
    }
  ];

  const csv = exportScheduleCsv(schedule);
  assert.ok(csv.includes("Announcement"));
  assert.ok(csv.includes("2026-05-04"));

  const reImported = importScheduleCsv(csv);
  assert.equal(reImported.length, 1);
  assert.equal(reImported[0].action, "Announcement");
  assert.equal(reImported[0].requiredDate, "2026-05-04");

  console.log("✓ CSV Export & Import round-trip tests passed.");
}

// 7. Schema Validation & Config Tests
{
  const rules = getDefaultRules();
  const valRules = validateRulesSchema(rules);
  assert.equal(valRules.valid, true);

  const cal = getDefaultCalendar();
  const valCal = validateCalendarSchema(cal);
  assert.equal(valCal.valid, true);

  const invalidRules = validateRulesSchema({ bidTypes: [] });
  assert.equal(invalidRules.valid, false);

  console.log("✓ Schema validation tests passed.");
}

console.log("\nALL BID PLANNER UNIT TESTS PASSED SUCCESSFULLY!");
