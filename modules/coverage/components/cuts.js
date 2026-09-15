/** Coverage cuts UI + applyCoverageCutsToLines. */

function $(id) { return document.getElementById(id); }
function uid() {
  return "cut-" + Date.now().toString(36) + Math.floor(Math.random() * 1000);
}
function dayNames() { return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; }

function ensureState(S) {
  if (!S.state) S.state = {};
  if (!Array.isArray(S.state.coverageCuts)) S.state.coverageCuts = [];
  return S.state.coverageCuts;
}

function lineRole(S, line) {
  if (S.lineRoleKey) return S.lineRoleKey(line);
  if (line.isStso || line.empClass === "STSO") return "STSO";
  if (line.isLtso || line.empClass === "LTSO") return "LTSO";
  return "TSO";
}

function cutMatchesLine(S, cut, line) {
  if (!cut || !cut.enabled || !line) return false;
  if (cut.shiftId && line.shiftId !== cut.shiftId) return false;
  var role = lineRole(S, line);
  if (cut.roles && cut.roles[role] === false) return false;
  var sx = line.sex === "F" ? "F" : "M";
  if (cut.sexes && cut.sexes[sx] === false) return false;
  return true;
}

function addUniqueDay(arr, d) {
  if (arr.indexOf(d) < 0) arr.push(d);
  return arr;
}

export function applyCoverageCutsToLines(S) {
  var cuts = ensureState(S).filter(function (c) {
    return c.enabled && +c.pct > 0 && c.shiftId && (c.days || []).length;
  });
  var lines = (S.state && S.state.lines) || [];
  if (!cuts.length || !lines.length) return 0;
  var touched = 0;
  var daysN = (S.state.weekCount || 1) * 7;
  var base = S.state.startDate ? S.state.startDate : (S.parseStartDate ? S.parseStartDate(null) : null);

  cuts.forEach(function (cut) {
    var pct = Math.max(0, Math.min(90, +cut.pct || 0));
    var wantDays = (cut.days || []).map(Number);
    var bucket = {};
    lines.forEach(function (line) {
      if (!cutMatchesLine(S, cut, line)) return;
      var key = lineRole(S, line) + "|" + (line.sex === "F" ? "F" : "M");
      if (!bucket[key]) bucket[key] = [];
      bucket[key].push(line);
    });
    Object.keys(bucket).forEach(function (key) {
      var group = bucket[key].slice().sort(function (a, b) { return (a.id || 0) - (b.id || 0); });
      var nTouch = Math.round(group.length * pct / 100);
      if (nTouch < 1 && pct >= 10 && group.length >= 2) nTouch = 1;
      group.slice(0, nTouch).forEach(function (line) {
        var rd = Array.isArray(line.rdoDays) ? line.rdoDays.slice() : [];
        var before = rd.slice().sort().join(",");
        wantDays.forEach(function (d) { addUniqueDay(rd, d); });
        rd.sort(function (a, b) { return a - b; });
        if (rd.join(",") === before) return;
        line.rdoDays = rd;
        if (S.buildScheduleForLine) {
          S.state.schedule = S.state.schedule || {};
          S.state.schedule[line.id] = S.buildScheduleForLine(line, daysN);
        } else if (S.state.schedule && S.state.schedule[line.id] && base && base.add) {
          for (var off = 0; off < daysN; off++) {
            var dow = base.add(off, "day").day();
            if (wantDays.indexOf(dow) >= 0) S.state.schedule[line.id][off] = "RDO";
          }
        }
        touched++;
      });
    });
  });
  if (touched && S.state.issues) {
    S.state.issues.push("Coverage cuts: " + touched + " line(s) given extra RDO day(s). Shift times unchanged.");
  }
  return touched;
}

export function fillShiftSelect(S) {
  var sel = $("cut-shift");
  if (!sel) return;
  var shifts = (S.state && S.state.shifts) || [];
  sel.innerHTML = shifts.map(function (s) {
    return '<option value="' + s.id + '">' + (s.name || s.id) + "</option>";
  }).join("") || '<option value="">No shifts</option>';
}

export function renderCutList(S) {
  var box = $("coverage-cuts-list");
  if (!box) return;
  var cuts = ensureState(S);
  if (!cuts.length) {
    box.innerHTML = "No cuts. Pick a shift and days, then Generate.";
    return;
  }
  box.innerHTML = cuts.map(function (c) {
    var roles = ["STSO", "LTSO", "TSO"].filter(function (r) { return c.roles && c.roles[r]; }).join("/") || "—";
    var sexes = ["M", "F"].filter(function (x) { return c.sexes && c.sexes[x]; }).join("/") || "—";
    var sh = (S.getShift && S.getShift(c.shiftId) && S.getShift(c.shiftId).name) || c.shiftId || "?";
    var days = (c.days || []).map(function (d) { return dayNames()[d]; }).join(" ");
    return '<div style="display:flex;gap:0.6rem;align-items:center;flex-wrap:wrap;margin:0.25rem 0">' +
      '<button type="button" class="btn" data-cut-toggle="' + c.id + '">' + (c.enabled ? "ON" : "off") + "</button>" +
      "<span><b>−" + c.pct + "%</b> " + sh + " · " + roles + " · " + sexes + " · " + days + "</span>" +
      '<button type="button" class="btn" data-cut-del="' + c.id + '">Remove</button></div>';
  }).join("");
}

function addCutFromForm(S) {
  var days = [];
  document.querySelectorAll("[data-cut-day]").forEach(function (el) {
    if (el.checked) days.push(+el.getAttribute("data-cut-day"));
  });
  if (!days.length) {
    if (S.updateStatus) S.updateStatus("Pick at least one day for the cut.");
    return;
  }
  var shiftEl = $("cut-shift");
  if (!shiftEl || !shiftEl.value) {
    if (S.updateStatus) S.updateStatus("Add a shift first.");
    return;
  }
  ensureState(S).push({
    id: uid(),
    enabled: true,
    kind: "shift",
    shiftId: shiftEl.value,
    pct: Math.max(5, Math.min(90, +$("cut-pct").value || 20)),
    roles: {
      STSO: !!$("cut-role-stso").checked,
      LTSO: !!$("cut-role-ltso").checked,
      TSO: !!$("cut-role-tso").checked
    },
    sexes: { M: !!$("cut-sex-m").checked, F: !!$("cut-sex-f").checked },
    days: days
  });
  renderCutList(S);
  if (S.updateStatus) S.updateStatus("Cut saved. Generate to apply extra RDOs on those days.");
}

function removeCut(S, id) {
  S.state.coverageCuts = ensureState(S).filter(function (c) { return c.id !== id; });
  renderCutList(S);
}
function toggleCut(S, id) {
  ensureState(S).forEach(function (c) { if (c.id === id) c.enabled = !c.enabled; });
  renderCutList(S);
}

let cutsBound = false;

export function initCuts(S) {
  var daysHost = $("cut-days");
  if (daysHost && !daysHost.getAttribute("data-cut-days-ready")) {
    daysHost.setAttribute("data-cut-days-ready", "1");
    daysHost.innerHTML = dayNames().map(function (n, i) {
      return '<label class="follow-me-label"><input type="checkbox" data-cut-day="' + i + '" /> ' + n + "</label>";
    }).join("");
  }

  if (!cutsBound) {
    cutsBound = true;
    var addBtn = $("btn-cut-add");
    if (addBtn) addBtn.addEventListener("click", function () { addCutFromForm(S); });
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.getAttribute) return;
      if (t.getAttribute("data-cut-del")) removeCut(S, t.getAttribute("data-cut-del"));
      if (t.getAttribute("data-cut-toggle")) toggleCut(S, t.getAttribute("data-cut-toggle"));
    });
  }

  fillShiftSelect(S);
  renderCutList(S);

  if (typeof S.generate === "function" && !S.generate._cutsApplyWrapped) {
    var orig = S.generate;
    S.generate = function () {
      var r = orig.apply(this, arguments);
      var n = S.applyCoverageCutsToLines();
      if (n && S.renderAll) S.renderAll();
      if (n && S.updateStatus) {
        S.updateStatus("Coverage cuts: " + n + " line(s) extra RDO on selected days. Shift times unchanged.");
      }
      if (n && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("lines:request-render", { detail: { source: "coverage-cuts" } }));
      }
      return r;
    };
    S.generate._cutsApplyWrapped = true;
  }

  if (typeof S.renderShifts === "function" && !S.renderShifts._cutSel) {
    var rs = S.renderShifts;
    S.renderShifts = function () {
      var out = rs.apply(this, arguments);
      fillShiftSelect(S);
      return out;
    };
    S.renderShifts._cutSel = true;
  }
}
