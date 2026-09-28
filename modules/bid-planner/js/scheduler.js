/**
 * Bid Planner Scheduler Engine
 * Performs deterministic forward, backward, and dual-anchor schedule calculations.
 */

import {
  addCalendarDays,
  subtractCalendarDays,
  addBusinessDays,
  subtractBusinessDays,
  isValidSchedulingDate,
  previousValidBusinessDay,
  nextValidBusinessDay,
  getInvalidReason
} from "./calendar.js";

/**
 * Calculates forward schedule starting from announcement anchor.
 */
export function calculateForwardSchedule(ruleSet, announcementDate, calendarConfig, adjustmentStrategy = "previous") {
  if (!ruleSet || !Array.isArray(ruleSet.actions) || !announcementDate) return [];
  const actions = [...ruleSet.actions].sort((a, b) => a.sequence - b.sequence);
  const schedule = [];
  const dateMap = new Map(); // actionId -> requiredDate

  for (let i = 0; i < actions.length; i++) {
    const act = actions[i];
    let rawDate = "";
    let calculatedFromStr = "";

    if (i === 0) {
      rawDate = announcementDate;
      calculatedFromStr = "Announcement Anchor";
    } else {
      const prevAct = actions[i - 1];
      const prevDate = dateMap.get(prevAct.id) || announcementDate;
      const offset = act.offset || { amount: 0, unit: "calendar_days" };
      const amount = Number(offset.amount) || 0;

      if (offset.unit === "business_days") {
        rawDate = addBusinessDays(prevDate, amount, calendarConfig);
        calculatedFromStr = `${prevAct.label} (+${amount} business_days)`;
      } else {
        rawDate = addCalendarDays(prevDate, amount);
        calculatedFromStr = `${prevAct.label} (+${amount} calendar_days)`;
      }
    }

    let requiredDate = rawDate;
    let adjusted = false;
    let adjustmentReason = "";

    if (!isValidSchedulingDate(rawDate, calendarConfig)) {
      const invalidReason = getInvalidReason(rawDate, calendarConfig);
      requiredDate = adjustmentStrategy === "next"
        ? nextValidBusinessDay(rawDate, calendarConfig)
        : previousValidBusinessDay(rawDate, calendarConfig);
      adjusted = true;
      adjustmentReason = `Calculated raw date ${rawDate} falls on ${invalidReason}. Adjusted to ${adjustmentStrategy} valid business day ${requiredDate}.`;
    }

    dateMap.set(act.id, requiredDate);

    schedule.push({
      sequence: act.sequence,
      actionId: act.id,
      action: act.label,
      rawDate,
      requiredDate,
      calculatedFrom: calculatedFromStr,
      rule: `${act.offset ? act.offset.amount : 0} ${act.offset ? act.offset.unit : "calendar_days"}`,
      direction: "Forward",
      adjusted,
      adjustmentReason: adjusted ? adjustmentReason : "None",
      conflict: "",
      status: adjusted ? "ADJUSTED" : "VALID",
      notes: act.offset && act.offset.placeholder ? "PLACEHOLDER RULE" : ""
    });
  }

  return schedule;
}

/**
 * Calculates backward schedule starting from execution anchor.
 */
export function calculateBackwardSchedule(ruleSet, executionDate, calendarConfig, adjustmentStrategy = "previous") {
  if (!ruleSet || !Array.isArray(ruleSet.actions) || !executionDate) return [];
  const actions = [...ruleSet.actions].sort((a, b) => a.sequence - b.sequence);
  const schedule = new Array(actions.length);
  const dateMap = new Map(); // actionId -> requiredDate

  for (let i = actions.length - 1; i >= 0; i--) {
    const act = actions[i];
    let rawDate = "";
    let calculatedFromStr = "";

    if (i === actions.length - 1) {
      rawDate = executionDate;
      calculatedFromStr = "Execution Anchor";
    } else {
      const nextAct = actions[i + 1];
      const nextDate = dateMap.get(nextAct.id) || executionDate;
      const offset = nextAct.offset || { amount: 0, unit: "calendar_days" };
      const amount = Number(offset.amount) || 0;

      if (offset.unit === "business_days") {
        rawDate = subtractBusinessDays(nextDate, amount, calendarConfig);
        calculatedFromStr = `${nextAct.label} (-${amount} business_days)`;
      } else {
        rawDate = subtractCalendarDays(nextDate, amount);
        calculatedFromStr = `${nextAct.label} (-${amount} calendar_days)`;
      }
    }

    let requiredDate = rawDate;
    let adjusted = false;
    let adjustmentReason = "";

    if (!isValidSchedulingDate(rawDate, calendarConfig)) {
      const invalidReason = getInvalidReason(rawDate, calendarConfig);
      requiredDate = adjustmentStrategy === "next"
        ? nextValidBusinessDay(rawDate, calendarConfig)
        : previousValidBusinessDay(rawDate, calendarConfig);
      adjusted = true;
      adjustmentReason = `Calculated raw date ${rawDate} falls on ${invalidReason}. Adjusted to ${adjustmentStrategy} valid business day ${requiredDate}.`;
    }

    dateMap.set(act.id, requiredDate);

    schedule[i] = {
      sequence: act.sequence,
      actionId: act.id,
      action: act.label,
      rawDate,
      requiredDate,
      calculatedFrom: calculatedFromStr,
      rule: `${act.offset ? act.offset.amount : 0} ${act.offset ? act.offset.unit : "calendar_days"}`,
      direction: "Backward",
      adjusted,
      adjustmentReason: adjusted ? adjustmentReason : "None",
      conflict: "",
      status: adjusted ? "ADJUSTED" : "VALID",
      notes: act.offset && act.offset.placeholder ? "PLACEHOLDER RULE" : ""
    };
  }

  return schedule;
}

/**
 * Dual-anchor generator and validation.
 * Computes forward from announcement and backward from execution.
 * Reports CONSISTENT or DATE CONFLICT.
 */
export function generateSchedule(ruleSet, announcementDate, executionDate, calendarConfig, adjustmentStrategy = "previous") {
  if (!announcementDate && !executionDate) {
    return {
      status: "ERROR",
      message: "Please enter at least Announcement Date or Execution Date.",
      schedule: []
    };
  }

  if (announcementDate && !executionDate) {
    const schedule = calculateForwardSchedule(ruleSet, announcementDate, calendarConfig, adjustmentStrategy);
    return {
      status: "SUCCESS",
      overallStatus: "CONSISTENT",
      message: "Forward schedule calculated successfully.",
      schedule
    };
  }

  if (!announcementDate && executionDate) {
    const schedule = calculateBackwardSchedule(ruleSet, executionDate, calendarConfig, adjustmentStrategy);
    return {
      status: "SUCCESS",
      overallStatus: "CONSISTENT",
      message: "Backward schedule calculated successfully.",
      schedule
    };
  }

  // Dual anchors provided: perform both forward and backward
  const forwardSchedule = calculateForwardSchedule(ruleSet, announcementDate, calendarConfig, adjustmentStrategy);
  const backwardSchedule = calculateBackwardSchedule(ruleSet, executionDate, calendarConfig, adjustmentStrategy);

  const discrepancies = [];
  const mergedSchedule = [];

  for (let i = 0; i < forwardSchedule.length; i++) {
    const f = forwardSchedule[i];
    const b = backwardSchedule[i];

    if (f.requiredDate === b.requiredDate) {
      mergedSchedule.push({
        ...f,
        direction: "Dual (Match)",
        notes: f.notes ? `${f.notes}; Forward and Backward match` : "Forward and Backward match"
      });
    } else {
      discrepancies.push({
        action: f.action,
        forwardDate: f.requiredDate,
        backwardDate: b.requiredDate
      });
      mergedSchedule.push({
        ...f,
        direction: "Dual (Conflict)",
        conflict: `Anchor Discrepancy: Forward (${f.requiredDate}) vs Backward (${b.requiredDate})`,
        status: "INCONSISTENT",
        notes: `Forward calculated ${f.requiredDate}; Backward calculated ${b.requiredDate}`
      });
    }
  }

  if (discrepancies.length === 0) {
    return {
      status: "SUCCESS",
      overallStatus: "CONSISTENT",
      message: "Forward and Backward schedules are completely consistent.",
      schedule: mergedSchedule
    };
  } else {
    const desc = discrepancies.map((d) => `${d.action}: Forward=${d.forwardDate} vs Backward=${d.backwardDate}`).join("; ");
    return {
      status: "SUCCESS",
      overallStatus: "DATE CONFLICT",
      message: `DATE CONFLICT between Announcement and Execution anchors. Disagreements: ${desc}`,
      schedule: mergedSchedule,
      discrepancies
    };
  }
}
