/** Pure coverage-table rows for Excel. One header, one row per slot, one day-total row. */

var DEFAULT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fallbackSlotLabel(mins) {
  var h = Math.floor(mins / 60);
  var mm = mins % 60;
  return String(h).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
}

function sexCell(m, f, t) {
  return (m || 0) + "/" + (f || 0) + "/" + (t != null ? t : (m || 0) + (f || 0));
}

export function coverageTableRows(computed, dayTotals, opts) {
  opts = opts || {};
  var dayNames = opts.dayNames || DEFAULT_DAYS;
  var labelOf = opts.slotLabel || fallbackSlotLabel;
  var slots = (computed && computed.slots) || [];
  var matrix = (computed && computed.matrix) || [];
  var header = ["Time"].concat(dayNames.slice(0, 7), ["Avg T"]);
  var rows = [header];

  slots.forEach(function (slot, si) {
    var row = matrix[si] || [];
    var sumT = 0;
    var cells = [typeof labelOf === "function" ? labelOf(slot) : fallbackSlotLabel(slot)];
    for (var d = 0; d < 7; d++) {
      var c = row[d] || { m: 0, f: 0, t: 0 };
      sumT += c.t || 0;
      cells.push(sexCell(c.m, c.f, c.t));
    }
    cells.push((sumT / 7).toFixed(1));
    rows.push(cells);
  });

  var totals = dayTotals || [];
  var tot = ["Day total*"];
  for (var d = 0; d < 7; d++) {
    var t = totals[d] || { m: 0, f: 0, t: 0 };
    var m = t.m || 0;
    var f = t.f || 0;
    tot.push(sexCell(m, f, t.t != null ? t.t : m + f));
  }
  tot.push("");
  rows.push(tot);
  return rows;
}
