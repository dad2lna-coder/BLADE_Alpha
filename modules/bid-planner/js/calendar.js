/**
 * Calendar Helpers & Deterministic Date Engine for Bid Planner
 * All dates handled as YYYY-MM-DD UTC strings to prevent timezone drift.
 */

export function parseUtcDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.trim().split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  const date = new Date(Date.UTC(year, month, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) {
    return null; // Invalid date (e.g. 2025-02-31)
  }
  return date;
}

export function formatUtcDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addCalendarDays(dateStr, n) {
  const date = parseUtcDate(dateStr);
  if (!date) return dateStr;
  date.setUTCDate(date.getUTCDate() + n);
  return formatUtcDate(date);
}

export function subtractCalendarDays(dateStr, n) {
  return addCalendarDays(dateStr, -n);
}

export function isWeekend(dateStr, calendar) {
  const date = parseUtcDate(dateStr);
  if (!date) return false;
  const day = date.getUTCDay();
  const weekendDays = (calendar && Array.isArray(calendar.weekendDays)) ? calendar.weekendDays : [0, 6];
  return weekendDays.includes(day);
}

export function isHoliday(dateStr, calendar) {
  if (!calendar || !Array.isArray(calendar.holidays)) return false;
  return calendar.holidays.some((h) => {
    if (typeof h === "string") return h === dateStr;
    return h && h.date === dateStr;
  });
}

export function isBlackoutDate(dateStr, calendar) {
  if (!calendar || !Array.isArray(calendar.blackoutDates)) return false;
  return calendar.blackoutDates.some((b) => {
    if (typeof b === "string") return b === dateStr;
    return b && b.date === dateStr;
  });
}

export function isValidSchedulingDate(dateStr, calendar) {
  if (!parseUtcDate(dateStr)) return false;
  if (isWeekend(dateStr, calendar)) return false;
  if (isHoliday(dateStr, calendar)) return false;
  if (isBlackoutDate(dateStr, calendar)) return false;
  return true;
}

export function isBusinessDay(dateStr, calendar) {
  if (!parseUtcDate(dateStr)) return false;
  if (isWeekend(dateStr, calendar)) return false;
  if (isHoliday(dateStr, calendar)) return false;
  return true;
}

export function addBusinessDays(dateStr, n, calendar) {
  let current = dateStr;
  if (n === 0) return current;
  const step = n > 0 ? 1 : -1;
  let remaining = Math.abs(n);
  while (remaining > 0) {
    current = addCalendarDays(current, step);
    if (isBusinessDay(current, calendar)) {
      remaining--;
    }
  }
  return current;
}

export function subtractBusinessDays(dateStr, n, calendar) {
  return addBusinessDays(dateStr, -n, calendar);
}

export function previousValidBusinessDay(dateStr, calendar) {
  let current = dateStr;
  while (!isValidSchedulingDate(current, calendar)) {
    current = subtractCalendarDays(current, 1);
  }
  return current;
}

export function nextValidBusinessDay(dateStr, calendar) {
  let current = dateStr;
  while (!isValidSchedulingDate(current, calendar)) {
    current = addCalendarDays(current, 1);
  }
  return current;
}

export function getInvalidReason(dateStr, calendar) {
  const reasons = [];
  if (isWeekend(dateStr, calendar)) reasons.push("weekend");
  if (isHoliday(dateStr, calendar)) {
    const hol = (calendar.holidays || []).find((h) => (typeof h === "string" ? h === dateStr : h && h.date === dateStr));
    const name = typeof hol === "object" && hol.name ? `holiday (${hol.name})` : "holiday";
    reasons.push(name);
  }
  if (isBlackoutDate(dateStr, calendar)) {
    const blk = (calendar.blackoutDates || []).find((b) => (typeof b === "string" ? b === dateStr : b && b.date === dateStr));
    const name = typeof blk === "object" && blk.name ? `blackout date (${blk.name})` : "blackout date";
    reasons.push(name);
  }
  return reasons.length > 0 ? reasons.join(", ") : null;
}
