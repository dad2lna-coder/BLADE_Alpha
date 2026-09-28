/**
 * Bid Planner Import / Export Engine
 * Handles schedule and calendar export and import in Excel-compatible CSV and JSON formats.
 */

/**
 * Escapes a single CSV cell according to RFC 4180.
 */
function escapeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Parses a CSV string into an array of row string arrays.
 * Handles quoted fields containing commas or newlines.
 */
export function parseCsv(csvText) {
  if (!csvText || typeof csvText !== "string") return [];
  const text = csvText.startsWith("\uFEFF") ? csvText.slice(1) : csvText;
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // Skip escaped quote
        } else {
          insideQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = "";
      } else if (char === '\r' && nextChar === '\n') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
        i++; // Skip \n
      } else if (char === '\n' || char === '\r') {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }

  if (currentField !== "" || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows.filter((r) => r.length > 0 && r.some((cell) => cell.trim() !== ""));
}

/**
 * Exports generated schedule array to Excel-compatible CSV string.
 */
export function exportScheduleCsv(schedule) {
  if (!Array.isArray(schedule) || schedule.length === 0) return "";
  const headers = [
    "Sequence",
    "Action",
    "Required Date",
    "Calculated From",
    "Rule",
    "Direction",
    "Adjusted?",
    "Adjustment Reason",
    "Conflict",
    "Status",
    "Notes"
  ];

  const csvRows = [headers.map(escapeCsvCell).join(",")];

  for (const r of schedule) {
    const row = [
      r.sequence,
      r.action,
      r.requiredDate,
      r.calculatedFrom,
      r.rule,
      r.direction,
      r.adjusted ? "Yes" : "No",
      r.adjustmentReason,
      r.conflict,
      r.status,
      r.notes
    ];
    csvRows.push(row.map(escapeCsvCell).join(","));
  }

  return "\uFEFF" + csvRows.join("\r\n");
}

/**
 * Imports schedule from CSV string. Round-trip capable.
 */
export function importScheduleCsv(csvText) {
  const rows = parseCsv(csvText);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  const schedule = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0) continue;

    const getCol = (name) => {
      const idx = headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());
      return idx !== -1 && idx < row.length ? row[idx].trim() : "";
    };

    schedule.push({
      sequence: Number(getCol("Sequence")) || i,
      actionId: getCol("Action").toLowerCase().replace(/\s+/g, "-"),
      action: getCol("Action"),
      requiredDate: getCol("Required Date"),
      calculatedFrom: getCol("Calculated From"),
      rule: getCol("Rule"),
      direction: getCol("Direction"),
      adjusted: getCol("Adjusted?").toLowerCase() === "yes" || getCol("Adjusted?").toLowerCase() === "true",
      adjustmentReason: getCol("Adjustment Reason"),
      conflict: getCol("Conflict"),
      status: getCol("Status"),
      notes: getCol("Notes")
    });
  }

  return schedule;
}

/**
 * Exports schedule to JSON string.
 */
export function exportScheduleJson(schedule) {
  return JSON.stringify(schedule || [], null, 2);
}

/**
 * Imports schedule from JSON string.
 */
export function importScheduleJson(jsonText) {
  try {
    const parsed = JSON.parse(jsonText);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("Error parsing schedule JSON:", e);
    return [];
  }
}

/**
 * Imports external calendar events from CSV or JSON text.
 */
export function parseCalendarImport(text, format = "auto") {
  if (!text || typeof text !== "string") return [];
  const trimmed = text.trim();

  // JSON detection
  if (format === "json" || (format === "auto" && (trimmed.startsWith("[") || trimmed.startsWith("{")))) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.events)) return parsed.events;
    } catch (e) {
      console.warn("JSON parse failed for calendar import:", e);
    }
  }

  // CSV fallback
  const rows = parseCsv(trimmed);
  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  const events = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const getCol = (...names) => {
      for (const name of names) {
        const idx = headers.findIndex((h) => h.toLowerCase() === name.toLowerCase());
        if (idx !== -1 && idx < row.length && row[idx].trim() !== "") {
          return row[idx].trim();
        }
      }
      return "";
    };

    const date = getCol("Date", "Required Date", "Event Date");
    const title = getCol("Event", "Title", "Action", "Description", "Name");

    if (date) {
      events.push({
        id: `ev-${i}`,
        date,
        title: title || `Event ${i}`,
        description: getCol("Description", "Notes")
      });
    }
  }

  return events;
}
