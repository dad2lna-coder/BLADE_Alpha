/**
 * Portfolio JSON, ICS, clipboard TSV, and ExcelJS workbook IO.
 * Sheet names match the CHAOS spec: CHAOS-Features, CHAOS-WorkItems.
 */

import { formatLocalDate, parseLocalDate } from "./dates.js";

const FEATURE_HEADERS = ["Feature Name", "Color Tag", "Compliance", "Asset Id", "Feature ID", "Initiative", "Description"];
const WORK_HEADERS = ["Work Item Name", "Due Date", "Work Item ID", "Feature", "Work Item Type"];

function cellText(value) {
  return String(value == null ? "" : value).replace(/[\t\r\n]/g, " ");
}

export function featureRows(portfolio) {
  const rows = [FEATURE_HEADERS.slice()];
  (portfolio || []).forEach((bid) => {
    rows.push([
      bid.featureName,
      "",
      "",
      "",
      "",
      bid.type,
      bid.type + " planning event for Station Category " + bid.category
    ]);
  });
  return rows;
}

export function workItemRows(portfolio) {
  const rows = [WORK_HEADERS.slice()];
  (portfolio || []).forEach((bid) => {
    (bid.milestones || []).forEach((milestone) => {
      const parts = String(milestone.currentDate || "").split("-");
      const formatted = parts.length === 3 ? parts[1] + "/" + parts[2] + "/" + parts[0] : "";
      rows.push([milestone.name, formatted, "", bid.featureName, milestone.type]);
    });
  });
  return rows;
}

export function generateMasterTSV(portfolio, type) {
  const rows = type === "features" ? featureRows(portfolio) : workItemRows(portfolio);
  return rows.map((row) => row.map(cellText).join("\t")).join("\n") + "\n";
}

export function buildIcs(portfolio) {
  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CHAOS//Bid Portfolio Engine//EN\n";
  (portfolio || []).forEach((bid) => {
    (bid.milestones || []).forEach((milestone) => {
      const stamp = String(milestone.currentDate || "").replace(/-/g, "");
      const summary = String(bid.location + " - " + milestone.name).replace(/[\r\n]/g, " ");
      ics += "BEGIN:VEVENT\nSUMMARY:" + summary + "\nDTSTART;VALUE=DATE:" + stamp + "\nDTEND;VALUE=DATE:" + stamp + "\nEND:VEVENT\n";
    });
  });
  ics += "END:VCALENDAR";
  return ics;
}

export function cellToIso(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const localMidnight = value.getHours() === 0 && value.getMinutes() === 0 && value.getSeconds() === 0;
    if (localMidnight) return formatLocalDate(value);
    const utcMidnight = value.getUTCHours() === 0 && value.getUTCMinutes() === 0 && value.getUTCSeconds() === 0;
    if (utcMidnight) {
      const month = String(value.getUTCMonth() + 1).padStart(2, "0");
      const day = String(value.getUTCDate()).padStart(2, "0");
      return value.getUTCFullYear() + "-" + month + "-" + day;
    }
    const shifted = new Date(value.getTime() + value.getTimezoneOffset() * 60000);
    return shifted.toISOString().slice(0, 10);
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    const utc = new Date(Math.round((value - 25569) * 86400000));
    if (!Number.isNaN(utc.getTime())) return formatLocalDate(new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate()));
  }
  const text = String(value == null ? "" : value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const mdy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (mdy) {
    return mdy[3] + "-" + mdy[1].padStart(2, "0") + "-" + mdy[2].padStart(2, "0");
  }
  const parsed = parseLocalDate(text);
  return parsed ? formatLocalDate(parsed) : "";
}

export function sheetToObjects(sheet) {
  const headers = [];
  const rows = [];
  if (!sheet || typeof sheet.eachRow !== "function") return rows;
  sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    const values = row.values || [];
    if (rowNumber === 1) {
      for (let i = 1; i < values.length; i += 1) headers[i] = String(values[i] == null ? "" : values[i]).trim();
      return;
    }
    const obj = {};
    let any = false;
    for (let i = 1; i < headers.length; i += 1) {
      if (!headers[i]) continue;
      obj[headers[i]] = values[i] == null ? "" : values[i];
      if (obj[headers[i]] !== "") any = true;
    }
    if (any) rows.push(obj);
  });
  return rows;
}

export function portfolioFromTables(features, workItems) {
  const base = Date.now();
  return (features || []).map((feature, index) => {
    const name = String(feature["Feature Name"] || "").trim();
    const milestones = (workItems || [])
      .filter((item) => String(item.Feature || "") === name)
      .map((item, mIdx) => ({
        id: base + index * 1000 + mIdx,
        name: String(item["Work Item Name"] || ""),
        type: String(item["Work Item Type"] || "Task"),
        currentDate: cellToIso(item["Due Date"]),
        offset: 0
      }))
      .filter((item) => item.name);
    const live = milestones.find((m) => m.name === "Live Bid Start");
    const planning = milestones.find((m) => m.name === "Review gender balance" || m.name === "Seniority Validated");
    const today = formatLocalDate(new Date());
    return {
      id: base + index,
      featureName: name,
      location: name.split(" ")[0] || "DAL",
      type: feature.Initiative || "Shift Bid",
      category: "X_I",
      duration: 1,
      anchorD0: live && live.currentDate ? live.currentDate : today,
      planningStart: planning && planning.currentDate ? planning.currentDate : today,
      fcfOpen: null,
      cyStart: null,
      scheduleStart: null,
      milestones: milestones
    };
  }).filter((bid) => bid.featureName);
}

function excelLib(ExcelJSImpl) {
  if (ExcelJSImpl) return ExcelJSImpl;
  if (typeof window !== "undefined" && window.ExcelJS) return window.ExcelJS;
  return null;
}

export async function workbookFromPortfolio(portfolio, ExcelJSImpl) {
  const Excel = excelLib(ExcelJSImpl);
  if (!Excel) throw new Error("ExcelJS is not loaded");
  const wb = new Excel.Workbook();
  wb.creator = "BLADE";
  const features = wb.addWorksheet("CHAOS-Features");
  featureRows(portfolio).forEach((row) => features.addRow(row));
  const work = wb.addWorksheet("CHAOS-WorkItems");
  workItemRows(portfolio).forEach((row) => work.addRow(row));
  return wb;
}

export async function portfolioFromWorkbook(buffer, ExcelJSImpl) {
  const Excel = excelLib(ExcelJSImpl);
  if (!Excel) throw new Error("ExcelJS is not loaded");
  const wb = new Excel.Workbook();
  await wb.xlsx.load(buffer);
  const featuresSheet = wb.getWorksheet("CHAOS-Features");
  const workSheet = wb.getWorksheet("CHAOS-WorkItems");
  if (!featuresSheet || !workSheet) {
    throw new Error("Invalid Excel file. Make sure it contains CHAOS-Features and CHAOS-WorkItems sheets.");
  }
  return portfolioFromTables(sheetToObjects(featuresSheet), sheetToObjects(workSheet));
}

export function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function downloadPortfolioExcel(portfolio, ExcelJSImpl) {
  const wb = await workbookFromPortfolio(portfolio, ExcelJSImpl);
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  downloadBlob(blob, "CHAOS_Master_Bid_Portfolio.xlsx");
}

export function downloadText(text, filename, mime) {
  downloadBlob(new Blob([text], { type: mime || "text/plain" }), filename);
}
