function heat(n, peak) {
  if (!n) return "hc-0";
  if (peak && n >= peak) return "hc-high";
  if (peak && n <= peak * 0.4) return "hc-low";
  return "hc-ok";
}

function num(n) {
  if (!n) return "";
  return Math.round(n * 10) / 10;
}

function dayNames(S) {
  return S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

function setName(S, id) {
  var rec = null;
  if (S.listModSets) {
    S.listModSets().forEach(function (s) { if (String(s.id) === String(id)) rec = s; });
  }
  return rec ? rec.name : "";
}

function teamOf(S, lineId) {
  if (!S.teams || !S.teams.teams) return null;
  for (var i = 0; i < S.teams.teams.length; i++) {
    var t = S.teams.teams[i], m = t.members || [];
    for (var j = 0; j < m.length; j++) if (String(m[j]) === String(lineId)) return t;
  }
  return null;
}

function posOf(line) {
  if (line.isStso || line.empClass === "STSO") return "STSO";
  if (line.isLtso || line.empClass === "LTSO") return "LTSO";
  return "TSO";
}

export function renderModSetBoard(S) {
  var host = S.$("tab-capacity");
  if (!host) return;
  var existing = host.querySelector("#modset-board-card");
  if (existing) existing.remove();
  var names = dayNames(S);
  var lines = ((S.state && S.state.lines) || []).slice();
  lines.sort(function (a, b) {
    var ta = teamOf(S, a.id), tb = teamOf(S, b.id);
    var na = ta ? String(ta.name || ta.id) : "zzz";
    var nb = tb ? String(tb.name || tb.id) : "zzz";
    if (na !== nb) return na.localeCompare(nb, undefined, { numeric: true });
    return String(a.lineCode || a.id).localeCompare(String(b.lineCode || b.id), undefined, { numeric: true });
  });
  var head = "<tr><th>Team</th><th>Line</th><th>Pos</th><th>Sex</th><th>Fn</th>";
  names.forEach(function (d) { head += "<th>" + d + "</th>"; });
  head += "</tr>";
  var body = lines.map(function (line) {
    var team = teamOf(S, line.id);
    var html = "<td>" + (team ? (team.name || team.id) : "") + "</td><td>" + (line.lineCode || line.id) +
      "</td><td>" + posOf(line) + "</td><td>" + (line.sex || "") + "</td><td>" + (line.function || "") + "</td>";
    for (var d = 0; d < 7; d++) {
      var sched = (S.state.schedule && (S.state.schedule[line.id] || S.state.schedule[String(line.id)] || []))[d] || "RDO";
      if (sched !== "WORK") {
        html += '<td style="background:#000;color:#fff">RDO</td>';
        continue;
      }
      var msId = team && S.modSetForTeamDay ? S.modSetForTeamDay(team.id, d) : null;
      html += "<td>" + (msId != null ? (setName(S, msId) || "\u2014") : "\u2014") + "</td>";
    }
    return "<tr>" + html + "</tr>";
  }).join("") || '<tr><td class="muted" colspan="12">Generate lines and form teams first.</td></tr>';
  var card = document.createElement("div");
  card.className = "card";
  card.id = "modset-board-card";
  card.innerHTML =
    '<div class="section-title">Mod set board</div>' +
    '<p class="muted">Same rows as the Lines export. Day cells are the mod set, not the shift window. RDO is black.</p>' +
    '<div class="lines-scroll"><table class="data-table"><thead>' + head + "</thead><tbody>" + body + "</tbody></table></div>";
  host.insertBefore(card, host.firstChild);
}

export function renderCapacity(S) {
  var host = S.$("tab-capacity");
  if (!host) return;
  var sets = S.listModSets ? S.listModSets() : [];
  var matrix = S.computeLaneCapacityMatrix ? S.computeLaneCapacityMatrix() : { checkpoints: [], terminals: [], rows: [], rates: { STD: 150, PRE: 240, MIX: 195 }, peakLanes: 0, peakPax: 0 };
  var teams = (S.teams && S.teams.teams) || [];
  var days = dayNames(S);
  var dayHead = days.map(function (d) { return "<th>" + d + "</th>"; }).join("");
  var coverRows = teams.map(function (t) {
    var cells = "";
    for (var d = 0; d < 7; d++) {
      if (!S.teamWorksDay || !S.teamWorksDay(t, d)) { cells += "<td style=\"background:#000;color:#fff\">RDO</td>"; continue; }
      var ms = S.modSetForTeamDay ? S.modSetForTeamDay(t.id, d) : null;
      cells += "<td>" + (ms != null ? setName(S, ms) : "\u2014") + "</td>";
    }
    return "<tr><td>" + (t.name || t.id) + "</td>" + cells + "</tr>";
  }).join("") || '<tr><td class="muted" colspan="8">Form teams, then assign daily coverage.</td></tr>';

  var r = matrix.rates;
  var filter = (S.$("cap-filter-term") && S.$("cap-filter-term").value) || "";
  var cols = matrix.checkpoints.filter(function (c) { return !filter || String(c.terminalId) === String(filter); });
  var opts = '<option value="">All terminals</option>';
  matrix.terminals.forEach(function (t) {
    opts += '<option value="' + t.id + '"' + (String(filter) === String(t.id) ? " selected" : "") + ">" + String(t.name).replace(/</g, "<") + "</option>";
  });
  var head = "<tr><th>Time</th>";
  var seen = {};
  cols.forEach(function (c) {
    if (!seen[c.terminalId]) { seen[c.terminalId] = 1; head += '<th class="muted">' + c.terminal + "</th>"; }
    head += "<th>" + c.checkpoint + " lanes</th><th>" + c.checkpoint + " pax/30</th>";
  });
  head += "<th>Airport lanes</th><th>Airport pax/30</th></tr>";
  var body = matrix.rows.map(function (row) {
    var html = "<td>" + row.time + "</td>";
    seen = {};
    cols.forEach(function (c) {
      if (!seen[c.terminalId]) {
        seen[c.terminalId] = 1;
        var tv = row.byTerminal[c.terminalId] || { lanes: 0 };
        html += '<td class="' + heat(tv.lanes, matrix.peakLanes) + '"><strong>' + (tv.lanes || "") + "</strong></td>";
      }
      var cell = row.byCheckpoint[c.key] || { lanes: 0, pax: 0 };
      html += '<td class="' + heat(cell.lanes, matrix.peakLanes) + '">' + (cell.lanes || "") + "</td>";
      html += '<td class="' + heat(cell.pax, matrix.peakPax) + '">' + num(cell.pax) + "</td>";
    });
    html += "<td><strong>" + (row.airportLanes || "") + "</strong></td><td><strong>" + num(row.airportPax) + "</strong></td>";
    return "<tr>" + html + "</tr>";
  }).join("");

  host.innerHTML =
    '<div class="card"><div class="section-title">Daily coverage (team \u2192 mod set)</div>' +
    '<p class="muted">A team does not live on one set. Each day we take who is working and fill the hungriest sets first. Pairings can change day to day.</p>' +
    '<div class="toolbar"><button type="button" class="btn btn-amber" id="btn-assign-ms">Assign daily coverage</button>' +
    '<span class="muted" id="ms-assign-hint">Uses working members that day, not a locked home set.</span></div>' +
    '<div class="lines-scroll"><table class="data-table"><thead><tr><th>Team</th>' + dayHead + "</tr></thead><tbody>" +
    coverRows + "</tbody></table></div></div>" +
    '<div class="card"><div class="section-title">Half-hour throughput</div>' +
    '<p class="muted">STD ' + r.STD + " \u00b7 PRE " + r.PRE + " \u00b7 MIX " + r.MIX + " /lane/hr</p>" +
    '<div class="toolbar"><label>Terminal <select id="cap-filter-term">' + opts + "</select></label></div>" +
    '<div class="lines-scroll"><table class="data-table cov-matrix"><thead>' + head + "</thead><tbody>" + body + "</tbody></table></div></div>";
  var sel = S.$("cap-filter-term");
  if (sel) sel.addEventListener("change", function () { S.renderCapacity(); });
  var btn = S.$("btn-assign-ms");
  if (btn) btn.addEventListener("click", function () {
    var out = S.assignCoverageByDay ? S.assignCoverageByDay() : { message: "" };
    var hint = S.$("ms-assign-hint");
    if (hint) hint.textContent = out.message;
  });

  if (S.renderModSetBoard) S.renderModSetBoard();
}

export function attachCapacityRender(S) {
  if (!S) return;
  S.renderModSetBoard = function () { return renderModSetBoard(S); };
  S.renderCapacity = function () { return renderCapacity(S); };
}
