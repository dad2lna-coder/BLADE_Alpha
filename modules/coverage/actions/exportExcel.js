/** Coverage Excel: All / STSO / LTSO / TSO sheets. Math stays in computeHourlyByDow. */
import { coverageTableRows } from "../utils/exportTables.js";

var SHEETS = [
  { name: "All", stso: true, ltso: true, tso: true },
  { name: "STSO", stso: true, ltso: false, tso: false },
  { name: "LTSO", stso: false, ltso: true, tso: false },
  { name: "TSO", stso: false, ltso: false, tso: true }
];

function loadExcel(cb) {
  if (typeof ExcelJS !== "undefined") { cb(); return; }
  var s = document.createElement("script");
  s.src = "lib/exceljs.min.js";
  s.onload = cb;
  document.head.appendChild(s);
}

/** Same headcount filter as actions/render.js day-total row. */
export function dayTotalsForSheet(S, computed) {
  var totals = [];
  for (var d = 0; d < 7; d++) {
    var off = computed.dowToOffset ? computed.dowToOffset[d] : null;
    if (off == null && S.parseStartDate) {
      var base = S.parseStartDate(S.state.startDate || null);
      for (var i = 0; i < Math.min(7, (S.state.weekCount || 1) * 7); i++) {
        if (S.dj ? S.dj(base).add(i).day() === d : i % 7 === d) { off = i; break; }
      }
    }
    var m = 0, f = 0;
    if (off != null) {
      S.state.lines.forEach(function (line) {
        if (!S.getShift(line.shiftId)) return;
        if ((S.state.schedule[line.id] || [])[off] !== "WORK") return;
        var filterOk = S.lineMatchesCoverageFilter
          ? S.lineMatchesCoverageFilter(line, off)
          : true;
        if (!filterOk) return;
        if (line.sex === "M") m++;
        else f++;
      });
    }
    totals.push({ m: m, f: f, t: m + f });
  }
  return totals;
}

export function buildCoverageWorkbook(S, ExcelJSImpl) {
  var Excel = ExcelJSImpl
    || (typeof ExcelJS !== "undefined" ? ExcelJS : null)
    || (typeof window !== "undefined" ? window.ExcelJS : null);
  if (!Excel) throw new Error("ExcelJS not loaded");

  var prev = S.coverageView;
  var funcView = (prev && prev.funcView) || "all";
  var workbook = new Excel.Workbook();
  workbook.creator = "BrokeSched";
  var dayNames = (S && S.DAYS) || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  try {
    SHEETS.forEach(function (spec) {
      S.coverageView = {
        stso: spec.stso,
        ltso: spec.ltso,
        tso: spec.tso,
        funcView: funcView
      };
      var computed = S.computeHourlyByDow();
      var totals = dayTotalsForSheet(S, computed);
      var rows = coverageTableRows(computed, totals, {
        dayNames: dayNames,
        slotLabel: S.slotLabel
      });
      var sheet = workbook.addWorksheet(spec.name);
      rows.forEach(function (r) { sheet.addRow(r); });
      sheet.columns.forEach(function (col, idx) {
        col.width = idx === 0 ? 14 : 12;
      });
    });
  } finally {
    S.coverageView = prev;
  }
  return workbook;
}

function downloadWorkbook(S, workbook) {
  workbook.xlsx.writeBuffer().then(function (buf) {
    var blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    var a = document.createElement("a");
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = S.exportFileName ? S.exportFileName("Coverage", ".xlsx") : "blade-coverage.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (S.updateStatus) S.updateStatus("Exported coverage Excel.");
  });
}

export function attachCoverageExport(S) {
  if (!S) return;
  S.exportCoverageExcel = function () {
    loadExcel(function () {
      var wb = buildCoverageWorkbook(S);
      downloadWorkbook(S, wb);
    });
  };
}
