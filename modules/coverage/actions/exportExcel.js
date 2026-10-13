/** Coverage Excel: one dropdown sheet over five hidden view tables. Math stays in computeHourlyByDow. */
import { coverageTableRows } from "../utils/exportTables.js";

var VIEWS = [
  { view: "All", sheet: "d_All", stso: true, ltso: true, tso: true },
  { view: "STSO/LTSO", sheet: "d_STSO_LTSO", stso: true, ltso: true, tso: false },
  { view: "STSO", sheet: "d_STSO", stso: true, ltso: false, tso: false },
  { view: "LTSO", sheet: "d_LTSO", stso: false, ltso: true, tso: false },
  { view: "TSO", sheet: "d_TSO", stso: false, ltso: false, tso: true }
];

var VIEW_LIST = '"All,STSO/LTSO,STSO,LTSO,TSO"';

function loadExcel(cb) {
  if (typeof ExcelJS !== "undefined") { cb(); return; }
  var s = document.createElement("script");
  s.src = "lib/exceljs.min.js";
  s.onload = cb;
  document.head.appendChild(s);
}

function colLetter(n) {
  var s = "";
  while (n > 0) {
    var m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function viewFormula(row, col) {
  var addr = colLetter(col) + row;
  var names = VIEWS.map(function (v) { return '"' + v.view + '"'; }).join(",");
  var refs = VIEWS.map(function (v) { return v.sheet + "!" + addr; }).join(",");
  return "CHOOSE(MATCH($B$1,{" + names + "},0)," + refs + ")";
}

function applyColumnWidths(sheet) {
  sheet.columns.forEach(function (col, idx) {
    col.width = idx === 0 ? 14 : 12;
  });
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

function writeCoverageSheet(cover, allSheet) {
  cover.getCell("A1").value = "View";
  var sel = cover.getCell("B1");
  sel.value = "All";
  sel.dataValidation = {
    type: "list",
    allowBlank: false,
    formulae: [VIEW_LIST]
  };

  var rowCount = allSheet.rowCount;
  for (var r = 1; r <= rowCount; r++) {
    var src = allSheet.getRow(r);
    var dest = cover.getRow(r + 1);
    for (var c = 1; c <= 9; c++) {
      var srcVal = src.getCell(c).value;
      var cell = dest.getCell(c);
      if (r === 1 || c === 1) {
        cell.value = srcVal == null ? "" : srcVal;
      } else {
        cell.value = {
          formula: viewFormula(r, c),
          result: srcVal == null ? "" : srcVal
        };
      }
    }
  }
  applyColumnWidths(cover);
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
  var cover = workbook.addWorksheet("Coverage");
  cover.state = "visible";

  try {
    VIEWS.forEach(function (spec) {
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
      var sheet = workbook.addWorksheet(spec.sheet);
      sheet.state = "hidden";
      rows.forEach(function (r) { sheet.addRow(r); });
      applyColumnWidths(sheet);
    });
    writeCoverageSheet(cover, workbook.getWorksheet("d_All"));
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
