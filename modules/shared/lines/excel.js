/** Bid-lines Excel export. Duty colors come from S.state.exportStyle. */
import { getExportStyle, hexToArgb, dutyFillArgb } from "./exportStyle.js";

function loadExcel(cb) {
  if (typeof ExcelJS !== "undefined") { cb(); return; }
  var s = document.createElement("script");
  s.src = "lib/exceljs.min.js";
  s.onload = cb;
  document.head.appendChild(s);
}

function thinBlackBorder() {
  var edge = { style: "thin", color: { argb: "FF000000" } };
  return { top: edge, left: edge, bottom: edge, right: edge };
}

function applyBaseCell(cell, fillArgb, fontColor) {
  cell.alignment = { vertical: "middle", horizontal: "center", wrapText: false };
  cell.font = { name: "Calibri", size: 11, color: { argb: fontColor || "FF000000" }, bold: false };
  cell.border = thinBlackBorder();
  if (fillArgb) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: fillArgb } };
}

function dayDutyForExport(S, line, dayIndex) {
  var duty = S.getRotationDuty ? S.getRotationDuty(line.id, dayIndex) : null;
  if (duty) return duty;
  if (line.function === "BAG" || line.function === "DFO" || line.function === "PAX") return line.function;
  return null;
}

function workLabelForLine(line, sh) {
  if (line.shiftLabel) return line.shiftLabel;
  if (sh && sh.start && sh.end) return sh.start + "\u2013" + sh.end;
  if (sh && sh.start) return sh.start;
  return "WORK";
}

function exportPosition(line) {
  if (line.isStso || line.empClass === "STSO") return "STSO";
  if (line.isLtso || line.empClass === "LTSO") return "LTSO";
  return "TSO";
}

function exportEmpClass(line) {
  var p = exportPosition(line);
  if (p === "STSO" || p === "LTSO") return "FT";
  return line.empClass === "PT" ? "PT" : "FT";
}

function teamMetaForExport(S, lineId) {
  if (S.teams && Array.isArray(S.teams.teams)) {
    var wantNum = +lineId, wantStr = String(lineId);
    for (var i = 0; i < S.teams.teams.length; i++) {
      var t = S.teams.teams[i], members = t.members || [];
      for (var j = 0; j < members.length; j++) {
        if (+members[j] === wantNum || String(members[j]) === wantStr) {
          return { order: i, name: t.name || t.id, id: t.id };
        }
      }
    }
  }
  return S.teamMetaForLine ? S.teamMetaForLine(lineId) : { order: 9999, name: "", id: "" };
}

function padTeamName(name) {
  var raw = String(name || "").trim();
  if (!raw) return "";
  var m = raw.match(/^(\d+)$/);
  if (m) {
    var n = parseInt(m[1], 10);
    return n < 10 ? "0" + n : String(n);
  }
  return raw;
}

function teamNumberKey(teamMeta) {
  if (!teamMeta || !teamMeta.id) return 9999;
  var m = String(teamMeta.name || "").match(/(\d+)/);
  if (m) return parseInt(m[1], 10);
  return teamMeta.order != null && teamMeta.order < 9999 ? teamMeta.order : 9999;
}

function roleSortKey(line) {
  var p = exportPosition(line);
  return p === "STSO" ? 0 : p === "LTSO" ? 1 : 2;
}

function sortLinesForExcel(S, lines) {
  return lines.slice().sort(function (a, b) {
    var ka = teamNumberKey(teamMetaForExport(S, a.id));
    var kb = teamNumberKey(teamMetaForExport(S, b.id));
    if (ka !== kb) return ka - kb;
    var ra = roleSortKey(a), rb = roleSortKey(b);
    if (ra !== rb) return ra - rb;
    var sa = S.getShift ? S.getShift(a.shiftId) : null;
    var sb = S.getShift ? S.getShift(b.shiftId) : null;
    var sma = sa && S.timeToMin ? S.timeToMin(sa.start) : 0;
    var smb = sb && S.timeToMin ? S.timeToMin(sb.start) : 0;
    if (sma !== smb) return sma - smb;
    return String(a.lineCode || a.id).localeCompare(String(b.lineCode || b.id), undefined, { numeric: true });
  });
}

var MODSET_COLORS = ["FF2A9D8F","FFE76F51","FF6A4C93","FF90BE6D","FFF4A261","FF457B9D","FFE9C46A","FFD62828","FF2D6A4F","FF9B5DE5","FF00BBF9","FFFB5607"];
var TEAM_COLORS = ["FFBDE0FE","FFCDB4DB","FFA8DADC","FFFFC8DD","FFB5EAD7","FFFFDAC1","FFC7CEEA","FFE2F0CB","FFF8C8DC","FFD4A373","FF8ECAE6","FFFFD6A5"];

function modSetColorMap(S) {
  var map = {};
  (S.listModSets ? S.listModSets() : []).forEach(function (ms, i) {
    map[String(ms.id)] = { argb: MODSET_COLORS[i % MODSET_COLORS.length], name: ms.name, checkpoint: ms.checkpoint };
  });
  return map;
}

function teamColorMap(S, lines) {
  var map = {}, i = 0;
  lines.forEach(function (line) {
    var tm = teamMetaForExport(S, line.id);
    var key = padTeamName(tm.name || tm.id || "");
    if (!key || map[key]) return;
    map[key] = TEAM_COLORS[i++ % TEAM_COLORS.length];
  });
  return map;
}

function lineModSetId(S, line) {
  if (line.modSetId != null) return line.modSetId;
  var tm = teamMetaForExport(S, line.id);
  if (S.teams && S.teams.teams) {
    for (var i = 0; i < S.teams.teams.length; i++) {
      if (S.teams.teams[i].id === tm.id) return S.teams.teams[i].modSetId;
    }
  }
  return null;
}

function generateAndDownloadXlsx(S) {
  var lines = S.state.lines || [];
  if (!lines.length) {
    if (S.updateStatus) S.updateStatus("No lines to export.");
    return;
  }
  if (S.collectTeamPool) S.collectTeamPool();
  lines = sortLinesForExcel(S, lines);
  var style = getExportStyle(S);
  var headerFill = dutyFillArgb(style, "header") || hexToArgb(style.header) || "FF1F4E79";
  var rdoFill = dutyFillArgb(style, "rdo") || "FF000000";
  var bagFill = dutyFillArgb(style, "bag") || "FFF4B4B4";
  var dfoFill = dutyFillArgb(style, "dfo") || "FFFFF3A8";
  var paxFill = dutyFillArgb(style, "pax");
  var msMap = modSetColorMap(S);
  var tmMap = teamColorMap(S, lines);
  var days = 7;
  var dayNames = S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var metaHeaders = ["Team", "Line", "Shift", "Start", "End", "Position", "Emp", "Sex", "Function", "RDOs", "Paid"];
  var headers = metaHeaders.concat(dayNames, ["Hours"]);
  var workbook = new ExcelJS.Workbook();
  workbook.creator = "BrokeSched";
  var sheet = workbook.addWorksheet("Lines");
  var tableRows = [];
  var rowMeta = [];
  lines.forEach(function (line) {
    var teamMeta = teamMetaForExport(S, line.id);
    var teamName = padTeamName(teamMeta.name || "");
    var sh = S.getShift ? S.getShift(line.shiftId) : null;
    var rdo = S.rdoTextForLine ? S.rdoTextForLine(line) : "";
    var hours = 0, dayValues = [], dayFlags = [];
    var workText = workLabelForLine(line, sh);
    for (var i = 0; i < days; i++) {
      var sched = S.state.schedule[line.id] || S.state.schedule[String(line.id)] || [];
      var isWork = (sched[i] || "RDO") === "WORK";
      var duty = isWork ? dayDutyForExport(S, line, i) : null;
      var isBag = isWork && (duty === "BAG" || duty === "BAGS");
      var isDfo = isWork && duty === "DFO";
      var isPax = isWork && duty === "PAX";
      if (isWork) hours += line.paid || 0;
      dayValues.push(isWork ? workText : "RDO");
      var msId = lineModSetId(S, line);
      var modFill = (isWork && !isBag && !isDfo && !isPax && msId != null && msMap[String(msId)]) ? msMap[String(msId)].argb : null;
      dayFlags.push({ isRdo: !isWork, isBag: isBag, isDfo: isDfo, isPax: isPax, modFill: modFill });
    }
    tableRows.push([
      teamName, line.lineCode || "", line.shiftName || (sh && sh.name) || "",
      sh ? sh.start : "", sh ? sh.end : "", exportPosition(line), exportEmpClass(line),
      line.sex || "", line.function || "", rdo, line.paid || ""
    ].concat(dayValues, [hours]));
    rowMeta.push({ days: dayFlags, teamFill: teamName ? tmMap[teamName] : null });
  });
  sheet.addRow(headers);
  tableRows.forEach(function (r) { sheet.addRow(r); });
  var lastCol = headers.length, lastRow = tableRows.length + 1;
  var zebraLight = "FFFFFFFF", zebraGrey = "FFEDEDED";
  var headerRow = sheet.getRow(1);
  headerRow.height = 22;
  for (var c = 1; c <= lastCol; c++) {
    var hc = headerRow.getCell(c);
    applyBaseCell(hc, headerFill, "FFFFFFFF");
    hc.font.bold = true;
  }
  for (var r = 2; r <= lastRow; r++) {
    var row = sheet.getRow(r);
    row.height = 18;
    var stripe = (r % 2 === 0) ? zebraLight : zebraGrey;
    var meta = rowMeta[r - 2] || {};
    var flags = meta.days || [];
    for (var col = 1; col <= lastCol; col++) {
      var cell = row.getCell(col);
      var dayOffset = col - (metaHeaders.length + 1);
      var isDayCol = dayOffset >= 0 && dayOffset < days;
      var f = isDayCol ? flags[dayOffset] : null;
      if (f && f.isRdo) {
        applyBaseCell(cell, rdoFill, "FFFFFFFF");
        cell.font.bold = true;
      } else if (f && f.isBag) {
        applyBaseCell(cell, bagFill, "FF000000");
        cell.font.bold = true;
      } else if (f && f.isDfo) {
        applyBaseCell(cell, dfoFill, "FF000000");
        cell.font.bold = true;
      } else if (f && f.isPax && paxFill) {
        applyBaseCell(cell, paxFill, "FF000000");
        cell.font.bold = true;
      } else if (f && !f.isRdo) {
        applyBaseCell(cell, f.modFill || stripe, "FF000000");
        cell.font.bold = true;
      } else if (col === 1 && meta.teamFill) {
        applyBaseCell(cell, meta.teamFill, "FF000000");
        cell.font.bold = true;
      } else {
        applyBaseCell(cell, stripe, "FF000000");
      }
    }
  }
  sheet.columns.forEach(function (col, idx) {
    col.width = idx === 0 ? 10 : idx < 11 ? 12 : 11;
  });
  workbook.xlsx.writeBuffer().then(function (buf) {
    var blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    var a = document.createElement("a");
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = S.exportFileName ? S.exportFileName("Lines", ".xlsx") : "blade-lines.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (S.updateStatus) S.updateStatus("Exported lines Excel.");
  });
}

export function attachExcelExport(S) {
  if (!S) return;
  S.exportLinesExcel = function () {
    loadExcel(function () { generateAndDownloadXlsx(S); });
  };
}
