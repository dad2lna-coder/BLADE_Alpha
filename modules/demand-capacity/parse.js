/**
 * Volume flight-list parse. Pure helpers + ExcelJS workbook reader.
 * Required headers (case-insensitive): DAY_OF_WEEK, ETD, CAPACITY, LOAD_FACTOR, PERCENT_ORIGINATING.
 */

export const REQUIRED_HEADERS = ["DAY_OF_WEEK", "ETD", "CAPACITY", "LOAD_FACTOR", "PERCENT_ORIGINATING"];

const DOW_NAMES = {
  sun: 0, sunday: 0,
  mon: 1, monday: 1,
  tue: 2, tues: 2, tuesday: 2,
  wed: 3, weds: 3, wednesday: 3,
  thu: 4, thur: 4, thurs: 4, thursday: 4,
  fri: 5, friday: 5,
  sat: 6, saturday: 6
};

export function normalizeHeader(value) {
  return String(value == null ? "" : value)
    .trim()
    .toUpperCase()
    .replace(/[\s\-]+/g, "_");
}

export function cellScalar(value) {
  if (value == null || value === "") return "";
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value.result != null) return cellScalar(value.result);
    if (typeof value.text === "string") return value.text;
    if (Array.isArray(value.richText)) {
      return value.richText.map(function (t) { return t && t.text ? t.text : ""; }).join("");
    }
    if (value.hyperlink && value.text) return value.text;
  }
  return value;
}

export function parseDow(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) {
    var n = Math.trunc(value);
    if (n >= 0 && n <= 6) return n;
    return null;
  }
  var s = String(value).trim().toLowerCase();
  if (!s) return null;
  if (Object.prototype.hasOwnProperty.call(DOW_NAMES, s)) return DOW_NAMES[s];
  if (/^[0-6]$/.test(s)) return Number(s);
  return null;
}

/**
 * Military int 1023 → 623 minutes (10:23). Also accepts "10:23".
 */
export function etdToMin(value) {
  if (value == null || value === "") return null;
  if (typeof value === "string" && value.indexOf(":") >= 0) {
    var parts = value.trim().split(":");
    var hh = Number(parts[0]);
    var mm = Number(parts[1]);
    if (!Number.isFinite(hh) || !Number.isFinite(mm) || mm < 0 || mm >= 60 || hh < 0) return null;
    return hh * 60 + mm;
  }
  var n = Number(cellScalar(value));
  if (!Number.isFinite(n)) return null;
  var mil = Math.round(n);
  if (mil < 0) return null;
  var h = Math.floor(mil / 100);
  var m = mil % 100;
  if (m >= 60 || h > 47) return null;
  return h * 60 + m;
}

export function parseSeats(value) {
  var n = Number(cellScalar(value));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function normalizeRate(value) {
  var n = Number(cellScalar(value));
  if (!Number.isFinite(n) || n < 0) return null;
  return n > 1 ? n / 100 : n;
}

export function parsePctOrig(value) {
  return normalizeRate(value);
}

export function parseLoadFactor(value) {
  return normalizeRate(value);
}

export function headerMapFromRow(values) {
  var map = {};
  for (var i = 0; i < values.length; i++) {
    var key = normalizeHeader(cellScalar(values[i]));
    if (key && map[key] == null) map[key] = i;
  }
  return map;
}

export function missingRequired(map) {
  return REQUIRED_HEADERS.filter(function (h) { return map[h] == null; });
}

export function parseFlightRow(values, map, multiplier) {
  var dow = parseDow(values[map.DAY_OF_WEEK]);
  var etdMin = etdToMin(values[map.ETD]);
  var seats = parseSeats(values[map.CAPACITY]);
  var loadFactor = parseLoadFactor(values[map.LOAD_FACTOR]);
  var pctOrig = parsePctOrig(values[map.PERCENT_ORIGINATING]);
  if (dow == null || etdMin == null || seats == null || loadFactor == null || pctOrig == null) return null;
  var mult = Number(multiplier);
  if (!Number.isFinite(mult) || mult < 0) mult = 1;
  return {
    dow: dow,
    etdMin: etdMin,
    seats: seats,
    loadFactor: loadFactor,
    pctOrig: pctOrig,
    volume: seats * loadFactor * pctOrig * mult
  };
}

function worksheetValues(sheet) {
  var rows = [];
  sheet.eachRow({ includeEmpty: false }, function (row) {
    var max = Math.max(row.cellCount || 0, REQUIRED_HEADERS.length);
    var values = [];
    for (var c = 1; c <= max; c++) values.push(cellScalar(row.getCell(c).value));
    rows.push(values);
  });
  return rows;
}

/**
 * Parse an already-loaded worksheet (or a plain values[][] array) into flights.
 */
export function parseVolumeRows(rows, multiplier) {
  var out = { flights: [], rowCount: 0, skipped: 0, missing: [], headerRow: 0 };
  if (!rows || !rows.length) {
    out.missing = REQUIRED_HEADERS.slice();
    return out;
  }
  var map = null;
  var headerIdx = -1;
  for (var r = 0; r < Math.min(rows.length, 20); r++) {
    var candidate = headerMapFromRow(rows[r] || []);
    var miss = missingRequired(candidate);
    if (!miss.length) { map = candidate; headerIdx = r; break; }
  }
  if (!map) {
    out.missing = missingRequired(headerMapFromRow(rows[0] || []));
    return out;
  }
  out.headerRow = headerIdx;
  var mult = Number(multiplier);
  if (!Number.isFinite(mult) || mult < 0) mult = 1;
  for (var i = headerIdx + 1; i < rows.length; i++) {
    var flight = parseFlightRow(rows[i] || [], map, mult);
    if (!flight) { out.skipped += 1; continue; }
    out.flights.push(flight);
    out.rowCount += 1;
  }
  return out;
}

export async function parseVolumeWorkbook(buffer, multiplier, ExcelJSImpl) {
  var Excel = ExcelJSImpl || (typeof window !== "undefined" ? window.ExcelJS : null);
  if (!Excel) throw new Error("ExcelJS is not loaded");
  var wb = new Excel.Workbook();
  await wb.xlsx.load(buffer);
  var sheet = wb.worksheets[0];
  if (!sheet) {
    return { flights: [], rowCount: 0, skipped: 0, missing: REQUIRED_HEADERS.slice(), headerRow: 0 };
  }
  return parseVolumeRows(worksheetValues(sheet), multiplier);
}
