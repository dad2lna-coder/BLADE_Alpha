/** Bid-lines Excel export. */
function loadExcel(cb) {
  if (typeof ExcelJS !== "undefined") { cb(); return; }
  var s = document.createElement("script");
  s.src = "lib/exceljs.min.js";
  s.onload = cb;
  document.head.appendChild(s);
}

function pos(line) {
  if (line.isStso || line.empClass === "STSO") return "STSO";
  if (line.isLtso || line.empClass === "LTSO") return "LTSO";
  return "TSO";
}

export function attachExcelExport(S) {
  if (!S) return;
  S.exportLinesExcel = function () {
    loadExcel(function () {
      var lines = (S.state && S.state.lines) || [];
      if (!lines.length) {
        if (S.updateStatus) S.updateStatus("No lines to export.");
        return;
      }
      var days = S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      var headers = ["Team", "Line", "Shift", "Start", "End", "Position", "Emp", "Sex", "Function", "RDOs", "Paid"].concat(days, ["Hours"]);
      var wb = new ExcelJS.Workbook();
      var sheet = wb.addWorksheet("Lines");
      sheet.addRow(headers);
      lines.forEach(function (line) {
        var tm = S.teamMetaForLine ? S.teamMetaForLine(line.id) : { name: "" };
        var sh = S.getShift ? S.getShift(line.shiftId) : null;
        var sched = (S.state.schedule[line.id] || S.state.schedule[String(line.id)] || []);
        var hours = 0;
        var dayVals = [];
        for (var i = 0; i < 7; i++) {
          var work = sched[i] === "WORK";
          if (work) hours += line.paid || 0;
          dayVals.push(work ? (line.shiftLabel || (sh && sh.start) || "WORK") : "RDO");
        }
        sheet.addRow([
          tm.name || "", line.lineCode || "", line.shiftName || (sh && sh.name) || "",
          sh ? sh.start : "", sh ? sh.end : "", pos(line),
          (pos(line) === "STSO" || pos(line) === "LTSO") ? "FT" : (line.empClass === "PT" ? "PT" : "FT"),
          line.sex || "", line.function || "",
          S.rdoTextForLine ? S.rdoTextForLine(line) : "", line.paid || ""
        ].concat(dayVals, [hours]));
      });
      wb.xlsx.writeBuffer().then(function (buf) {
        var blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        var a = document.createElement("a");
        var url = URL.createObjectURL(blob);
        a.href = url;
        a.download = (S.exportFileName ? S.exportFileName("Lines", ".xlsx") : "blade-lines.xlsx");
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  };
}
