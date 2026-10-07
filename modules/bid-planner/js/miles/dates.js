/**
 * Local calendar dates for the portfolio month grid.
 * YYYY-MM-DD is a civil date, not a UTC instant.
 */

export const FEDERAL_HOLIDAYS_2026 = [
  "2026-01-01", "2026-01-19", "2026-02-16", "2026-05-25", "2026-06-19",
  "2026-07-03", "2026-07-04", "2026-09-07", "2026-10-12", "2026-11-11",
  "2026-11-26", "2026-12-25"
];

export function parseLocalDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.trim().slice(0, 10).split("-");
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null;
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
}

export function formatLocalDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return date.getFullYear() + "-" + month + "-" + day;
}

export function startOfToday(now) {
  const src = now instanceof Date ? now : new Date();
  return new Date(src.getFullYear(), src.getMonth(), src.getDate());
}

export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isHoliday(date) {
  return FEDERAL_HOLIDAYS_2026.indexOf(formatLocalDate(date)) !== -1;
}

/** Calendar-day difference a - b. Immune to DST. */
export function dayDiff(a, b) {
  const da = typeof a === "string" ? parseLocalDate(a) : a;
  const db = typeof b === "string" ? parseLocalDate(b) : b;
  if (!da || !db) return 0;
  const utcA = Date.UTC(da.getFullYear(), da.getMonth(), da.getDate());
  const utcB = Date.UTC(db.getFullYear(), db.getMonth(), db.getDate());
  return Math.round((utcA - utcB) / 86400000);
}

export function adjustToWorkday(date, offsetDirection) {
  const temp = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const step = offsetDirection <= 0 ? -1 : 1;
  let attempts = 0;
  while ((isWeekend(temp) || isHoliday(temp)) && attempts < 15) {
    temp.setDate(temp.getDate() + step);
    attempts += 1;
  }
  return temp;
}

/** Snap a non-Sunday schedule start back to the previous Sunday. */
export function previousSunday(dateStr) {
  const date = parseLocalDate(dateStr);
  if (!date) return dateStr;
  if (date.getDay() === 0) return formatLocalDate(date);
  const sunday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
  return formatLocalDate(sunday);
}
