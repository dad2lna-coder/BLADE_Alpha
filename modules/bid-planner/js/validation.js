/**
 * Endpoint and Manual Move Validation
 */

import { parseUtcDate, isValidSchedulingDate, getInvalidReason } from "./calendar.js";

export function validateAnchors(announcementDate, executionDate) {
  if (!announcementDate && !executionDate) {
    return { valid: false, error: "At least one anchor date (Announcement or Execution) must be provided." };
  }

  if (announcementDate && !parseUtcDate(announcementDate)) {
    return { valid: false, error: "Announcement Date must be a valid YYYY-MM-DD date." };
  }

  if (executionDate && !parseUtcDate(executionDate)) {
    return { valid: false, error: "Execution Date must be a valid YYYY-MM-DD date." };
  }

  if (announcementDate && executionDate) {
    const dAnn = parseUtcDate(announcementDate);
    const dExe = parseUtcDate(executionDate);
    if (dAnn > dExe) {
      return { valid: false, error: `Announcement Date (${announcementDate}) cannot be after Execution Date (${executionDate}).` };
    }
  }

  return { valid: true, error: null };
}

/**
 * Validates a proposed manual event move.
 * Returns consequence breakdown and whether move is valid or produces rule violations.
 */
export function validateMoveEvent(schedule, actionId, newDate, ruleSet, calendarConfig) {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    return { valid: false, error: "No active schedule to move event." };
  }

  const targetDate = parseUtcDate(newDate);
  if (!targetDate) {
    return { valid: false, error: "New date must be a valid YYYY-MM-DD date." };
  }

  const idx = schedule.findIndex((r) => r.actionId === actionId || r.action === actionId);
  if (idx === -1) {
    return { valid: false, error: `Action '${actionId}' not found in schedule.` };
  }

  const row = schedule[idx];
  const consequences = [];
  let validMove = true;

  // 1. Check if newDate falls on weekend / holiday / blackout
  if (!isValidSchedulingDate(newDate, calendarConfig)) {
    const reason = getInvalidReason(newDate, calendarConfig);
    consequences.push(`Warning: Proposed date ${newDate} is a ${reason}.`);
  }

  // 2. Predecessor check
  if (idx > 0) {
    const prevRow = schedule[idx - 1];
    const prevDate = parseUtcDate(prevRow.requiredDate);
    if (prevDate && targetDate < prevDate) {
      validMove = false;
      consequences.push(`VIOLATION: Proposed date ${newDate} precedes predecessor '${prevRow.action}' (${prevRow.requiredDate}).`);
    }
  }

  // 3. Successor check
  if (idx < schedule.length - 1) {
    const nextRow = schedule[idx + 1];
    const nextDate = parseUtcDate(nextRow.requiredDate);
    if (nextDate && targetDate > nextDate) {
      validMove = false;
      consequences.push(`VIOLATION: Proposed date ${newDate} succeeds successor '${nextRow.action}' (${nextRow.requiredDate}).`);
    }
  }

  if (validMove) {
    consequences.push(`Date change valid. '${row.action}' will be updated from ${row.requiredDate} to ${newDate}.`);
  }

  return {
    valid: validMove,
    actionId: row.actionId,
    actionLabel: row.action,
    oldDate: row.requiredDate,
    newDate,
    consequences,
    requiresExplicitAccept: true
  };
}
