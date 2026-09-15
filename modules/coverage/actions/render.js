/** Coverage matrix + bars + shift mix. Calculation helpers stay on Scheduler. */

export function renderCoverageBars(S) {
  var head = S.$("coverage-matrix-head");
  var body = S.$("coverage-matrix-body");
  var bars = S.$("coverage-bars");
  var summary = S.$("coverage-summary");
  if (!head || !body) return;
  if (!S.state.lines.length) {
    head.innerHTML = "";
    body.innerHTML = '<tr><td class="muted">Generate or import a schedule to see 30-minute headcount by day.</td></tr>';
    if (bars) bars.innerHTML = "";
    if (summary) summary.textContent = "Generate or import to compute staffing by 30-minute slot and day.";
    renderShiftSummary(S);
    return;
  }
  var computed = S.computeHourlyByDow();
  var slots = computed.slots;
  var matrix = computed.matrix;
  var allVals = [];
  matrix.forEach(function (row) {
    row.forEach(function (c) { allVals.push(c.t); });
  });
  var lo = Math.min.apply(null, allVals);
  var hi = Math.max.apply(null, allVals);
  var avg = allVals.reduce(function (a, b) { return a + b; }, 0) / Math.max(1, allVals.length);

  var hr = "<tr><th>Time</th>";
  for (var d = 0; d < 7; d++) {
    hr += "<th>" + S.DAYS[d] + '<br><span class="muted" style="font-weight:400">M/F/T</span></th>';
  }
  hr += "<th>Avg T</th></tr>";
  head.innerHTML = hr;

  body.innerHTML = slots.map(function (slot, si) {
    var row = matrix[si];
    var rowAvg = row.reduce(function (a, c) { return a + c.t; }, 0) / 7;
    var cells = "<td>" + S.slotLabel(slot) + "</td>";
    for (var d = 0; d < 7; d++) {
      var c = row[d];
      var cls = "hc-ok";
      if (c.t === 0) cls = "hc-0";
      else if (c.t < avg * 0.75) cls = "hc-low";
      else if (c.t > avg * 1.25) cls = "hc-high";
      cells +=
        '<td class="' + cls + '" title="Male ' + c.m + " · Female " + c.f + " · Total " + c.t + '">' +
        '<span class="sex-m">' + c.m + "</span>/" +
        '<span class="sex-f">' + c.f + "</span>/" +
        c.t + "</td>";
    }
    cells += '<td class="muted">' + rowAvg.toFixed(1) + "</td>";
    return "<tr>" + cells + "</tr>";
  }).join("");

  var tot = "<tr><td><strong>Day total*</strong></td>";
  for (var d = 0; d < 7; d++) {
    var base = S.state.startDate ? S.state.startDate : S.parseStartDate(null);
    var off = null;
    for (var i = 0; i < Math.min(7, (S.state.weekCount || 1) * 7); i++) {
      if (base.add(i, "day").day() === d) { off = i; break; }
    }
    var m = 0, f = 0;
    if (off != null) {
      S.state.lines.forEach(function (line) {
        if (line.isLtso || line.isStso) return;
        if ((S.state.schedule[line.id] || [])[off] === "WORK") {
          if (line.sex === "M") m++;
          else f++;
        }
      });
    }
    tot +=
      "<td><strong><span class=\"sex-m\">" + m + "</span>/<span class=\"sex-f\">" + f + "</span>/" + (m + f) + "</strong></td>";
  }
  tot += "<td></td></tr>";
  body.innerHTML += tot;

  if (summary) {
    summary.innerHTML =
      '<span class="sex-legend">' +
      '<i class="sw-m"></i><span class="sex-m">Male</span> ' +
      '<i class="sw-f"></i><span class="sex-f">Female</span> ' +
      "· cells are TSO <strong>M/F/Total</strong></span> · " +
      "30-min TSO total " + lo + "–" + hi + " (avg " + avg.toFixed(1) + "). " +
      "*Day total = TSO on WORK that weekday.";
  }

  if (bars) {
    var slotSex = slots.map(function (slot, si) {
      var m = 0, f = 0;
      matrix[si].forEach(function (c) { m += c.m; f += c.f; });
      return { m: m / 7, f: f / 7, t: (m + f) / 7 };
    });
    var maxT = Math.max(1, Math.max.apply(null, slotSex.map(function (x) { return x.t; })));
    bars.innerHTML = slots.map(function (slot, si) {
      var x = slotSex[si];
      var pctM = maxT > 0 ? (100 * x.m) / maxT : 0;
      var pctF = maxT > 0 ? (100 * x.f) / maxT : 0;
      return (
        '<div class="cov-row"><span>' + S.slotLabel(slot) + "</span>" +
        '<div class="cov-track">' +
        '<div class="cov-fill-m" style="width:' + pctM.toFixed(2) + '%"></div>' +
        '<div class="cov-fill-f" style="width:' + pctF.toFixed(2) + '%"></div>' +
        "</div>" +
        '<span><span class="sex-m">' + x.m.toFixed(1) + "</span>/" +
        '<span class="sex-f">' + x.f.toFixed(1) + "</span>/" +
        x.t.toFixed(1) + "</span></div>"
      );
    }).join("");
  }

  renderShiftSummary(S);
}

export function renderShiftSummary(S) {
  var tbody = S.$("shift-summary-body");
  if (!tbody) return;
  var counts = {};
  S.state.lines.forEach(function (l) {
    var k = l.shiftId + "|" + l.empClass + "|" + (l.sex || "?");
    counts[k] = (counts[k] || 0) + 1;
  });
  var rows = [];
  S.state.shifts.forEach(function (s) {
    var ftm = counts[s.id + "|FT|M"] || 0;
    var ftf = counts[s.id + "|FT|F"] || 0;
    var ptm = counts[s.id + "|PT|M"] || 0;
    var ptf = counts[s.id + "|PT|F"] || 0;
    var ltm = counts[s.id + "|LTSO|M"] || 0;
    var ltf = counts[s.id + "|LTSO|F"] || 0;
    var stm = counts[s.id + "|STSO|M"] || 0;
    var stf = counts[s.id + "|STSO|F"] || 0;
    var tsoTot = ftm + ftf + ptm + ptf;
    var supTot = ltm + ltf + stm + stf;
    var all = tsoTot + supTot;
    if (all === 0) return;
    var forceNote =
      (s.force > 0 ? " TSO×" + s.force : "") +
      (s.ltsoForce > 0 ? " LTSO×" + s.ltsoForce : "") +
      (s.stsoForce > 0 ? " STSO×" + s.stsoForce : "");
    rows.push(
      "<tr><td><span class=\"badge " + S.shiftBadge(s.id) + "\">" + s.name + "</span></td><td>" +
      s.start + "–" + s.end + "</td>" +
      '<td><span class="sex-m">' + ftm + '</span>/<span class="sex-f">' + ftf + "</span></td>" +
      '<td><span class="sex-m">' + ptm + '</span>/<span class="sex-f">' + ptf + "</span></td>" +
      '<td><span class="sex-m">' + ltm + '</span>/<span class="sex-f">' + ltf + "</span></td>" +
      '<td><span class="sex-m">' + stm + '</span>/<span class="sex-f">' + stf + "</span></td>" +
      "<td>" + tsoTot + "</td>" +
      "<td>" + all + (forceNote ? ' <span class="muted">(' + forceNote.trim() + ")</span>" : "") + "</td></tr>"
    );
  });
  tbody.innerHTML = rows.join("") || '<tr><td colspan="8" class="muted">No lines yet</td></tr>';
}

export function attachRender(S) {
  S.renderCoverageBars = function () { renderCoverageBars(S); };
  S.renderShiftSummary = function () { renderShiftSummary(S); };
}
