/**
 * Rules & Calendar Config Manager
 * Handles default loading, schema validation, localStorage persistence, and JSON upload/download.
 */

import defaultRules from "../config/rules.json" with { type: "json" };
import defaultCalendar from "../config/calendar.json" with { type: "json" };

const STORAGE_KEY_RULES = "blade-bid-planner-rules";
const STORAGE_KEY_CALENDAR = "blade-bid-planner-calendar";

export function validateRulesSchema(obj) {
  if (!obj || typeof obj !== "object") return { valid: false, error: "Rules config must be a JSON object." };
  if (!Array.isArray(obj.bidTypes) || obj.bidTypes.length === 0) {
    return { valid: false, error: "Rules config must contain a non-empty 'bidTypes' array." };
  }
  for (const bt of obj.bidTypes) {
    if (!bt.id || !bt.name || !Array.isArray(bt.ruleSets) || bt.ruleSets.length === 0) {
      return { valid: false, error: `Bid type '${bt.name || bt.id || "unnamed"}' must have id, name, and ruleSets.` };
    }
    for (const rs of bt.ruleSets) {
      if (!rs.id || !rs.name || !Array.isArray(rs.actions) || rs.actions.length === 0) {
        return { valid: false, error: `Rule set '${rs.name || rs.id || "unnamed"}' must have id, name, and actions.` };
      }
      for (const act of rs.actions) {
        if (!act.id || !act.label || typeof act.sequence !== "number") {
          return { valid: false, error: `Action '${act.label || act.id}' must have id, label, and numeric sequence.` };
        }
        if (!act.offset || typeof act.offset.amount !== "number" || act.offset.amount < 0) {
          return { valid: false, error: `Action '${act.label}' offset amount must be a non-negative number.` };
        }
        if (!["calendar_days", "business_days"].includes(act.offset.unit)) {
          return { valid: false, error: `Action '${act.label}' offset unit must be 'calendar_days' or 'business_days'.` };
        }
      }
    }
  }
  return { valid: true, error: null };
}

export function validateCalendarSchema(obj) {
  if (!obj || typeof obj !== "object") return { valid: false, error: "Calendar config must be a JSON object." };
  if (!Array.isArray(obj.weekendDays)) {
    return { valid: false, error: "Calendar config must contain a 'weekendDays' array." };
  }
  if (!Array.isArray(obj.holidays)) {
    return { valid: false, error: "Calendar config must contain a 'holidays' array." };
  }
  if (!Array.isArray(obj.blackoutDates)) {
    return { valid: false, error: "Calendar config must contain a 'blackoutDates' array." };
  }
  return { valid: true, error: null };
}

export function getDefaultRules() {
  return JSON.parse(JSON.stringify(defaultRules));
}

export function getDefaultCalendar() {
  return JSON.parse(JSON.stringify(defaultCalendar));
}

export function getWorkingRules() {
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY_RULES);
      if (raw) {
        const parsed = JSON.parse(raw);
        const val = validateRulesSchema(parsed);
        if (val.valid) return parsed;
      }
    }
  } catch (e) {
    console.warn("Error loading stored bid planner rules, falling back to default:", e);
  }
  return getDefaultRules();
}

export function saveWorkingRules(rulesObj) {
  const val = validateRulesSchema(rulesObj);
  if (!val.valid) throw new Error(val.error);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY_RULES, JSON.stringify(rulesObj, null, 2));
  }
  return true;
}

export function resetRulesToDefault() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_RULES);
  }
  return getDefaultRules();
}

export function getWorkingCalendar() {
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(STORAGE_KEY_CALENDAR);
      if (raw) {
        const parsed = JSON.parse(raw);
        const val = validateCalendarSchema(parsed);
        if (val.valid) return parsed;
      }
    }
  } catch (e) {
    console.warn("Error loading stored bid planner calendar, falling back to default:", e);
  }
  return getDefaultCalendar();
}

export function saveWorkingCalendar(calObj) {
  const val = validateCalendarSchema(calObj);
  if (!val.valid) throw new Error(val.error);
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY_CALENDAR, JSON.stringify(calObj, null, 2));
  }
  return true;
}

export function resetCalendarToDefault() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(STORAGE_KEY_CALENDAR);
  }
  return getDefaultCalendar();
}

export function findRuleSet(rulesObj, bidTypeId, ruleSetId) {
  if (!rulesObj || !Array.isArray(rulesObj.bidTypes)) return null;
  const bt = rulesObj.bidTypes.find((b) => b.id === bidTypeId);
  if (!bt || !Array.isArray(bt.ruleSets)) return null;
  return bt.ruleSets.find((rs) => rs.id === ruleSetId) || null;
}
