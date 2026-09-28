/**
 * Bid Planner Conflict Detection Engine
 * Compares calculated schedule rows against imported calendar events and config bounds.
 */

import { isHoliday, isBlackoutDate, parseUtcDate } from "./calendar.js";

/**
 * Evaluates conflicts for a generated schedule against imported calendar events and calendar config.
 * Never silently changes calculated dates.
 */
export function detectConflicts(schedule, calendarEvents = [], calendarConfig = {}) {
  if (!Array.isArray(schedule)) return { schedule: [], conflictCount: 0, conflicts: [] };

  const conflictsFound = [];
  const updatedSchedule = schedule.map((row, idx) => {
    const rowConflicts = [];
    const dateStr = row.requiredDate;

    // 1. Check imported calendar events
    if (Array.isArray(calendarEvents) && calendarEvents.length > 0) {
      const matchingEvents = calendarEvents.filter((e) => {
        const evDate = typeof e === "string" ? e : (e.date || e["Required Date"] || e.Date);
        return evDate === dateStr;
      });

      if (matchingEvents.length > 0) {
        const eventNames = matchingEvents
          .map((e) => (typeof e === "string" ? e : e.title || e.event || e.Action || e.Event || "Existing Event"))
          .join(", ");
        rowConflicts.push({
          type: "same-day",
          message: `Conflicts with imported event(s): ${eventNames}`
        });
      }
    }

    // 2. Check Holiday conflict
    if (isHoliday(dateStr, calendarConfig)) {
      const hol = (calendarConfig.holidays || []).find((h) => (typeof h === "string" ? h === dateStr : h && h.date === dateStr));
      const holName = typeof hol === "object" && hol.name ? hol.name : "Holiday";
      rowConflicts.push({
        type: "holiday",
        message: `Falls on configured holiday (${holName})`
      });
    }

    // 3. Check Blackout Date conflict
    if (isBlackoutDate(dateStr, calendarConfig)) {
      const blk = (calendarConfig.blackoutDates || []).find((b) => (typeof b === "string" ? b === dateStr : b && b.date === dateStr));
      const blkName = typeof blk === "object" && blk.name ? blk.name : "Blackout Date";
      rowConflicts.push({
        type: "blackout",
        message: `Falls on configured blackout date (${blkName})`
      });
    }

    // 4. Check Sequence Dependency conflict
    if (idx > 0) {
      const prevRow = schedule[idx - 1];
      const prevDate = parseUtcDate(prevRow.requiredDate);
      const currDate = parseUtcDate(dateStr);
      if (prevDate && currDate && currDate < prevDate) {
        rowConflicts.push({
          type: "dependency",
          message: `Sequence violation: Date (${dateStr}) is prior to predecessor '${prevRow.action}' (${prevRow.requiredDate})`
        });
      }
    }

    const conflictSummary = rowConflicts.map((c) => c.message).join("; ");
    let status = row.status;
    if (rowConflicts.length > 0) {
      status = "CONFLICT";
      conflictsFound.push({
        sequence: row.sequence,
        action: row.action,
        requiredDate: row.requiredDate,
        conflicts: rowConflicts
      });
    }

    return {
      ...row,
      conflict: conflictSummary ? conflictSummary : row.conflict || "None",
      status: rowConflicts.length > 0 ? "CONFLICT" : status
    };
  });

  return {
    schedule: updatedSchedule,
    conflictCount: conflictsFound.length,
    conflicts: conflictsFound
  };
}
