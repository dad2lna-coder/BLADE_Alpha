function emptyCell() {
  return {
    STSO: { M: 0, F: 0 },
    LTSO: { M: 0, F: 0 },
    TSO: { M: 0, F: 0 }
  };
}

function roleOf(S, line) {
  return S.lineRoleKey ? S.lineRoleKey(line) : "TSO";
}

function scheduleRow(S, line) {
  var sched = S.state.schedule || {};
  if (!line) return [];
  return sched[line.id] || sched[String(line.id)] || [];
}

function rotationRow(S, lineId) {
  var rot = (S.state && S.state.functionRotation) || {};
  if (rot[lineId]) return rot[lineId];
  if (rot[String(lineId)]) return rot[String(lineId)];
  var asNum = +lineId;
  if (!isNaN(asNum) && rot[asNum]) return rot[asNum];
  return null;
}

function normalizeDuty(cell) {
  if (cell == null || cell === "") return null;
  var d = String(cell).toUpperCase();
  if (d === "BAG" || d === "BAGGAGE") return "BAG";
  if (d === "PAX" || d === "PASSENGER") return "PAX";
  if (d === "DFO") return "DFO";
  return d;
}

function dutyForDay(row, off) {
  if (!row) return null;
  var cell = Array.isArray(row) ? row[off] : (row[off] != null ? row[off] : row[String(off)]);
  return normalizeDuty(cell);
}

/** True when Generate (or a later editor) has written any BAG/PAX/DFO duty cells. */
export function rotationHasAssignedDuties(S) {
  var rot = (S && S.state && S.state.functionRotation) || {};
  var keys = Object.keys(rot);
  for (var i = 0; i < keys.length; i++) {
    var row = rot[keys[i]];
    if (!row) continue;
    if (Array.isArray(row)) {
      for (var j = 0; j < row.length; j++) {
        if (normalizeDuty(row[j])) return true;
      }
    } else if (typeof row === "object") {
      var inner = Object.keys(row);
      for (var k = 0; k < inner.length; k++) {
        if (normalizeDuty(row[inner[k]])) return true;
      }
    }
  }
  return false;
}

function lineIsDfoFunction(line) {
  if (!line) return false;
  if (line.function === "DFO") return true;
  var el = line.functionEligible || {};
  return !!(el.dfo || el.DFO);
}

export function computeRoleMatrixByDow(S, opts) {
  opts = opts || {};
  var mode = opts.mode || "total"; // passenger | baggage | total | dfoPool
  var slots = S.coverageSlots();
  var base = S.state.startDate ? S.state.startDate : (S.parseStartDate ? S.parseStartDate(null) : null);
  var dowToOffset = {};
  var days = Math.min(7, (S.state.weekCount || 1) * 7);
  for (var off = 0; off < days; off++) {
    var dow;
    if (base && typeof base.add === "function") {
      dow = base.add(off, "day").day();
    } else if (base && base instanceof Date) {
      var dte = new Date(base.getTime());
      dte.setDate(dte.getDate() + off);
      dow = dte.getDay();
    } else {
      dow = off % 7;
    }
    if (dowToOffset[dow] == null) dowToOffset[dow] = off;
  }
  for (var d0 = 0; d0 < 7; d0++) {
    if (dowToOffset[d0] == null) dowToOffset[d0] = d0 % Math.max(1, days);
  }

  var matrix = slots.map(function () {
    return [0, 1, 2, 3, 4, 5, 6].map(function () {
      return emptyCell();
    });
  });

  var dutiesAssigned = rotationHasAssignedDuties(S);

  (S.state.lines || []).forEach(function (line) {
    if (!S.getShift(line.shiftId)) return;
    var role = roleOf(S, line);
    var sex = line.sex === "F" ? "F" : "M";

    if (mode === "dfoPool") {
      if (!lineIsDfoFunction(line)) return;
    }

    var rotRow = rotationRow(S, line.id);

    for (var dow = 0; dow < 7; dow++) {
      var off = dowToOffset[dow];
      if (off == null) continue;
      if (scheduleRow(S, line)[off] !== "WORK") continue;

      var duty = dutyForDay(rotRow, off);

      if (mode === "baggage") {
        // BAG duty only — DFO is a function pool, not a baggage duty.
        if (duty !== "BAG") continue;
      } else if (mode === "passenger") {
        // Generate writes "PAX" for leftover passenger days. Require that when
        // rotation is populated; treat missing/null as PAX only when no duties
        // have been assigned yet (and the UI banner explains the alias).
        if (duty === "BAG") continue;
        if (dutiesAssigned) {
          if (duty !== "PAX") continue;
        }
      }

      var times = S.getEffectiveShiftTimes
        ? S.getEffectiveShiftTimes(line.shiftId, dow)
        : { start: S.getShift(line.shiftId).start, end: S.getShift(line.shiftId).end };
      var a = S.timeToMin(times.start);
      var b = S.timeToMin(times.end);
      slots.forEach(function (slot, si) {
        if (a < slot + 30 && b > slot) {
          matrix[si][dow][role][sex]++;
        }
      });
    }
  });
  return { slots: slots, matrix: matrix, dowToOffset: dowToOffset };
}

function cellKey(c) {
  return ["STSO", "LTSO", "TSO"]
    .map(function (r) {
      return r + ":" + c[r].M + "/" + c[r].F;
    })
    .join("|");
}

function formatCell(c) {
  var m = 0, f = 0;
  ["STSO", "LTSO", "TSO"].forEach(function (r) {
    if (!c[r]) return;
    m += c[r].M || 0;
    f += c[r].F || 0;
  });
  var tot = m + f;
  if (tot === 0) return "<span class=\"muted\">\u2014</span>";
  var detail = "";
  ["STSO", "LTSO", "TSO"].forEach(function (r) {
    var rm = (c[r] && c[r].M) || 0;
    var rf = (c[r] && c[r].F) || 0;
    if (rm + rf === 0) return;
    detail +=
      "<div class=\"rpt-role\"><span class=\"rpt-role-lbl\">" + r + "</span> " +
      "<span class=\"sex-m\">" + rm + "</span>/" +
      "<span class=\"sex-f\">" + rf + "</span></div>";
  });
  return (
    "<div class=\"rpt-total\"><strong>" + tot + "</strong> " +
    "(<span class=\"sex-m\">" + m + "</span>/<span class=\"sex-f\">" + f + "</span>)</div>" +
    detail
  );
}

export function compressDeviationRows(slots, matrix) {
  var rows = [];
  var prevKey = null;
  var runStart = null;
  for (var si = 0; si < slots.length; si++) {
    var key = matrix[si].map(cellKey).join(";");
    if (key !== prevKey) {
      if (prevKey != null) {
        rows.push({
          startSlot: runStart,
          endSlot: slots[si],
          cells: matrix[si - 1]
        });
      }
      runStart = slots[si];
      prevKey = key;
    }
  }
  if (prevKey != null && runStart != null) {
    rows.push({
      startSlot: runStart,
      endSlot: slots[slots.length - 1] + 30,
      cells: matrix[matrix.length - 1]
    });
  }
  return rows;
}

export function renderDeviationReport(S, containerId, mode, title) {
  var el = S.$(containerId);
  if (!el) return;
  if (!S.state.lines || !S.state.lines.length) {
    el.innerHTML = '<p class="muted">Generate a schedule first.</p>';
    return;
  }
  var computed = S.computeRoleMatrixByDow({ mode: mode });
  var rows = S.compressDeviationRows(computed.slots, computed.matrix);
  if (!rows.length) {
    el.innerHTML = "<h3 class=\"section-title\">" + title + "</h3><p class=\"muted\">No scheduled headcount for this view. Generate lines and function assignments first.</p>";
    return;
  }
  var html =
    "<h3 class=\"section-title\">" +
    title +
    "</h3>" +
    '<div class="lines-scroll"><table class="data-table rpt-table"><thead><tr><th>Window</th>';
  var days = S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (var d = 0; d < 7; d++) html += "<th>" + (days[d] || d) + "</th>";
  html += "</tr></thead><tbody>";
  rows.forEach(function (r) {
    html +=
      "<tr><td>" +
      S.slotLabel(r.startSlot) +
      "\u2013" +
      S.slotLabel(r.endSlot % 1440) +
      "</td>";
    for (var d = 0; d < 7; d++) {
      html += "<td>" + formatCell(r.cells[d]) + "</td>";
    }
    html += "</tr>";
  });
  html += "</tbody></table></div>";
  el.innerHTML = html;
}

export function attachDeviation(S) {
  if (!S) return;
  S.computeRoleMatrixByDow = function (opts) { return computeRoleMatrixByDow(S, opts); };
  S.compressDeviationRows = compressDeviationRows;
  S.rotationHasAssignedDuties = function () { return rotationHasAssignedDuties(S); };
  S.renderDeviationReport = function (containerId, mode, title) { return renderDeviationReport(S, containerId, mode, title); };
}
