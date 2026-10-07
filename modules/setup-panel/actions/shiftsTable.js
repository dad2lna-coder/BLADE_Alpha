/** Setup-tab shifts table + day-times modal. */
import { assignRdoDays, normalizeRdoMode, normalizeConstraintDay } from "../utils/shiftMath.js";
export function attachShiftsTable(S) {
  if (!S) return;

  S.rdoModeHtml = function (shift) {
    var mode = normalizeRdoMode(shift);
    var day = normalizeConstraintDay(shift);
    var on = mode !== "off";
    var id = String(shift && shift.id || "shift").replace(/[^A-Za-z0-9_-]/g, "");
    var days = S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var modes = [
      { value: "off", label: "Off" },
      { value: "4x10", label: "4×10" },
      { value: "5x8", label: "5×8" }
    ];
    var modeHtml = modes.map(function (opt) {
      var checked = mode === opt.value ? " checked" : "";
      return (
        '<label class="rdo-mode-opt" title="' + (opt.value === "off"
          ? "Legacy hard RDOs and soft consecutive days"
          : opt.value === "4x10"
            ? "Pin the constraint day off. Other two RDOs are a rotating consecutive pair."
            : "Two RDOs stay in the window around the constraint day. Patterns rotate by line.") + '">' +
        '<input type="radio" name="rdo-mode-' + id + '" data-f="rdoMode" value="' + opt.value + '"' + checked + " />" +
        "<span>" + opt.label + "</span></label>"
      );
    }).join("");
    var dayHtml = days.map(function (label, d) {
      var checked = day === d ? " checked" : "";
      var dis = on ? "" : " disabled";
      return (
        '<label class="rdo-chk" title="Constraint day ' + label + '">' +
        '<input type="radio" name="rdo-c-' + id + '" data-constraint="' + d + '"' + checked + dis + " />" +
        "<span>" + label.charAt(0) + "</span></label>"
      );
    }).join("");
    return (
      '<div class="rdo-mode" data-on="' + (on ? "1" : "0") + '">' +
      '<div class="rdo-mode-switch" role="radiogroup" aria-label="RDO mode">' + modeHtml + "</div>" +
      '<div class="rdo-mode-day">' +
      '<span class="rdo-mode-kicker">Day</span>' +
      '<div class="rdo-row rdo-constraint" role="radiogroup" aria-label="Constraint day">' + dayHtml + "</div>" +
      "</div></div>"
    );
  };

  S.rdoChecksHtml = function (selected) {
    var set = new Set((selected || []).map(Number));
    return (S.DAYS || []).map(function (label, d) {
      return (
        '<label class="rdo-chk" title="' + label + '">' +
        '<input type="checkbox" data-rdo="' + d + '"' + (set.has(d) ? " checked" : "") + " />" +
        "<span>" + label.charAt(0) + "</span></label>"
      );
    }).join("");
  };

  S.readShiftsFromDom = function () {
    if (typeof document === "undefined") return S.state.shifts;
    var rows = document.querySelectorAll("#shifts-tbody tr[data-shift-id]");
    if (!rows.length) return S.state.shifts;
    var next = [];
    rows.forEach(function (tr) {
      var id = tr.getAttribute("data-shift-id");
      var existing = S.getShift ? S.getShift(id) : null;
      var name = (tr.querySelector("[data-f=name]") && tr.querySelector("[data-f=name]").value.trim()) || id;
      var start = (tr.querySelector("[data-f=start]") && tr.querySelector("[data-f=start]").value) || "05:00";
      var end = (tr.querySelector("[data-f=end]") && tr.querySelector("[data-f=end]").value) || "13:30";
      var start2El = tr.querySelector("[data-f=start2]");
      var end2El = tr.querySelector("[data-f=end2]");
      var start2 = start2El ? start2El.value : "";
      var end2 = end2El ? end2El.value : "";

      var segments = null;
      if (start2 && end2 && S.isValidTimeText(start) && S.isValidTimeText(end) && S.isValidTimeText(start2) && S.isValidTimeText(end2)) {
        var m0s = S.timeToMin(start), m0e = S.timeToMin(end);
        var m1s = S.timeToMin(start2), m1e = S.timeToMin(end2);
        if (m0e > m0s && m1e > m1s && m1s > m0e) {
          segments = [
            { start: start, end: end },
            { start: start2, end: end2 }
          ];
        }
      }

      var paid = +(tr.querySelector("[data-f=paid]") && tr.querySelector("[data-f=paid]").value);
      if (!paid || paid <= 0) {
        if (segments) {
          var m1 = S.timeToMin(segments[0].end) - S.timeToMin(segments[0].start);
          var m2 = S.timeToMin(segments[1].end) - S.timeToMin(segments[1].start);
          paid = Math.max(1, Math.round(((m1 + m2) / 60) * 2) / 2);
        } else {
          var mins = S.timeToMin(end) - S.timeToMin(start);
          paid = Math.max(1, Math.round((mins / 60) * 2) / 2);
        }
      }
      var force = Math.max(0, Math.floor(+(tr.querySelector("[data-f=force]") && tr.querySelector("[data-f=force]").value) || 0));
      var ltsoForce = Math.max(0, Math.floor(+(tr.querySelector("[data-f=ltsoForce]") && tr.querySelector("[data-f=ltsoForce]").value) || 0));
      var stsoForce = Math.max(0, Math.floor(+(tr.querySelector("[data-f=stsoForce]") && tr.querySelector("[data-f=stsoForce]").value) || 0));
      var rdoHard = [];
      for (var d = 0; d < 7; d++) {
        var cb = tr.querySelector('[data-rdo="' + d + '"]');
        if (cb && cb.checked) rdoHard.push(d);
      }
      var modeEl = tr.querySelector('input[data-f="rdoMode"]:checked');
      var rdoMode = normalizeRdoMode(modeEl ? modeEl.value : (existing && existing.rdoMode));
      var cEl = tr.querySelector("input[data-constraint]:checked");
      var rdoConstraint = cEl ? Number(cEl.getAttribute("data-constraint")) : normalizeConstraintDay(existing);
      if (rdoMode !== "off" && rdoConstraint == null) rdoConstraint = 2;
      var dayTimes = existing && existing.dayTimes ? existing.dayTimes : null;
      var phaseEl = tr.querySelector("[data-f=phase]");
      var phase = (phaseEl && phaseEl.value) || (existing && existing.phase) || "auto";
      var cgEl = tr.querySelector("[data-f=crewGroupId]");
      var crewGroupId = (cgEl && cgEl.value) || (existing && existing.crewGroupId) || "";

      var sObj = {
        id: id, name: name, start: segments ? segments[0].start : start, end: segments ? segments[1].end : end, paid: paid,
        force: force, ltsoForce: ltsoForce, stsoForce: stsoForce, rdoHard: rdoHard,
        rdoMode: rdoMode, rdoConstraint: rdoConstraint,
        dayTimes: dayTimes, phase: phase, crewGroupId: crewGroupId
      };
      if (segments) sObj.segments = segments;
      next.push(sObj);
    });
    S.state.shifts = next;
    return next;
  };

  S.renderCrewGroupsUI = function () {
    var container = document.getElementById("crew-groups-list");
    if (!container) return;
    var groups = S.state.shiftCrewGroups || [];
    var shifts = S.state.shifts || [];
    if (!groups.length) {
      container.innerHTML = '<p class="muted" style="margin:0">No crew groups defined. Shifts default to individual shift bands.</p>';
      return;
    }
    container.innerHTML = groups.map(function (cg) {
      var memberCheckboxes = shifts.map(function (s) {
        var isChecked = (s.crewGroupId === cg.id) || (cg.shiftIds && cg.shiftIds.indexOf(s.id) !== -1);
        return '<label style="display:inline-flex;align-items:center;gap:0.25rem;margin-right:0.75rem;font-size:0.85rem">' +
          '<input type="checkbox" class="cg-shift-cb" data-cg-id="' + cg.id + '" data-shift-id="' + s.id + '"' + (isChecked ? ' checked' : '') + ' />' +
          (s.name || s.id) + '</label>';
      }).join('');

      return '<div class="card" style="margin:0;padding:0.5rem 0.75rem;background:var(--bg-subtle, #f8f9fa)">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem">' +
          '<strong>' + (cg.name || cg.id) + '</strong>' +
          '<button type="button" class="btn btn-red btn-cg-del" data-cg-id="' + cg.id + '" style="padding:0.1rem 0.4rem;font-size:0.75rem">Delete group</button>' +
        '</div>' +
        '<div>' + memberCheckboxes + '</div>' +
      '</div>';
    }).join('');

    container.querySelectorAll('.btn-cg-del').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cgId = btn.getAttribute('data-cg-id');
        S.state.shiftCrewGroups = (S.state.shiftCrewGroups || []).filter(function (g) { return g.id !== cgId; });
        (S.state.shifts || []).forEach(function (s) {
          if (s.crewGroupId === cgId) s.crewGroupId = '';
        });
        S.renderCrewGroupsUI();
        S.renderShiftsTable();
      });
    });

    container.querySelectorAll('.cg-shift-cb').forEach(function (cb) {
      cb.addEventListener('change', function () {
        var cgId = cb.getAttribute('data-cg-id');
        var sId = cb.getAttribute('data-shift-id');
        var shift = (S.state.shifts || []).find(function (s) { return s.id === sId; });
        if (shift) {
          if (cb.checked) {
            shift.crewGroupId = cgId;
          } else if (shift.crewGroupId === cgId) {
            shift.crewGroupId = '';
          }
        }
        var group = (S.state.shiftCrewGroups || []).find(function (g) { return g.id === cgId; });
        if (group) {
          group.shiftIds = (S.state.shifts || [])
            .filter(function (s) { return s.crewGroupId === cgId; })
            .map(function (s) { return s.id; });
        }
        S.renderShiftsTable();
      });
    });
  };

  S.renderShiftsTable = function () {
    var tbody = document.getElementById("shifts-tbody");
    if (!tbody) return;
    var groups = S.state.shiftCrewGroups || [];
    tbody.innerHTML = (S.state.shifts || []).map(function (s) {
      var hasDyn = S.shiftHasDayOverrides && S.shiftHasDayOverrides(s.id);
      var daysCls = hasDyn ? "btn btn-amber" : "btn";
      var daysTitle = hasDyn ? "Has per-day time overrides" : "Set different start/end per day of week";

      var cgOptions = '<option value="">(None / Solo)</option>' + groups.map(function (g) {
        var sel = (s.crewGroupId === g.id) ? ' selected' : '';
        return '<option value="' + g.id + '"' + sel + '>' + (g.name || g.id) + '</option>';
      }).join('');

      var isSplit = !!(s.segments && s.segments.length === 2);
      var start1 = isSplit ? s.segments[0].start : s.start;
      var end1 = isSplit ? s.segments[0].end : s.end;
      var start2 = isSplit ? s.segments[1].start : "";
      var end2 = isSplit ? s.segments[1].end : "";

      return (
        '<tr data-shift-id="' + s.id + '">' +
        '<td><input type="text" data-f="name" value="' + String(s.name).replace(/"/g, "&quot;") + '" style="width:5.5rem" /></td>' +
        '<td><input type="time" data-f="start" value="' + start1 + '" /></td>' +
        '<td><input type="time" data-f="end" value="' + end1 + '" /></td>' +
        '<td><input type="time" data-f="start2" value="' + start2 + '" placeholder="Seg 2 start" /></td>' +
        '<td><input type="time" data-f="end2" value="' + end2 + '" placeholder="Seg 2 end" /></td>' +
        '<td><select data-f="phase">' +
          '<option value="auto"' + ((s.phase || "auto") === "auto" ? " selected" : "") + '>Auto</option>' +
          '<option value="opening"' + (s.phase === "opening" ? " selected" : "") + '>Opening</option>' +
          '<option value="am"' + (s.phase === "am" ? " selected" : "") + '>AM</option>' +
          '<option value="pm"' + (s.phase === "pm" ? " selected" : "") + '>PM</option>' +
          '<option value="closing"' + (s.phase === "closing" ? " selected" : "") + '>Closing</option>' +
        '</select></td>' +
        '<td><input type="number" data-f="paid" min="1" step="0.5" value="' + s.paid + '" style="width:4rem" /></td>' +
        '<td><input type="number" data-f="force" min="0" value="' + (s.force || 0) + '" style="width:4rem" title="TSO force" /></td>' +
        '<td><input type="number" data-f="ltsoForce" min="0" value="' + (s.ltsoForce || 0) + '" style="width:4rem" title="LTSO force" /></td>' +
        '<td><input type="number" data-f="stsoForce" min="0" value="' + (s.stsoForce || 0) + '" style="width:4rem" title="STSO force" /></td>' +
        '<td><div class="rdo-row">' + S.rdoChecksHtml(s.rdoHard) + "</div></td>" +
        "<td>" + S.rdoModeHtml(s) + "</td>" +
        '<td style="white-space:nowrap">' +
          '<button type="button" class="' + daysCls + '" data-day-times="' + s.id + '" title="' + daysTitle + '">Day times…</button> ' +
          '<button type="button" class="btn btn-red" data-remove="' + s.id + '">✕</button>' +
        '</td>' +
        '<td><select data-f="crewGroupId">' + cgOptions + '</select></td>' +
        '</tr>'
      );
    }).join("");

    tbody.querySelectorAll('input[data-f="rdoMode"]').forEach(function (radio) {
      radio.addEventListener("change", function () {
        var tr = radio.closest("tr");
        if (!tr || !radio.checked) return;
        var on = radio.value !== "off";
        var wrap = tr.querySelector(".rdo-mode");
        if (wrap) wrap.setAttribute("data-on", on ? "1" : "0");
        var days = tr.querySelectorAll("input[data-constraint]");
        days.forEach(function (c) { c.disabled = !on; });
        if (on && !tr.querySelector("input[data-constraint]:checked")) {
          var tue = tr.querySelector('input[data-constraint="2"]');
          if (tue) tue.checked = true;
        }
      });
    });

    tbody.querySelectorAll("select[data-f=crewGroupId]").forEach(function (sel) {
      sel.addEventListener("change", function () {
        S.readShiftsFromDom();
        S.renderCrewGroupsUI();
      });
    });

    tbody.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        S.readShiftsFromDom();
        var id = btn.getAttribute("data-remove");
        S.state.shifts = S.state.shifts.filter(function (s) { return s.id !== id; });
        S.renderShiftsTable();
      });
    });
    tbody.querySelectorAll("[data-day-times]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        S.readShiftsFromDom();
        S.openShiftDayTimesModal(btn.getAttribute("data-day-times"));
      });
    });
  };

  S.addShift = function () {
    if (!S.state) return;
    S.readShiftsFromDom();
    S.shiftSeq = S.shiftSeq || ((S.state.shifts || []).length + 1);
    var id = "S" + S.shiftSeq++;
    S.state.shifts = S.state.shifts || [];
    S.state.shifts.push({
      id: id, name: "Shift", start: "08:00", end: "16:30", paid: 8,
      force: 0, ltsoForce: 0, stsoForce: 0, rdoHard: [],
      rdoMode: "off", rdoConstraint: null
    });
    S.renderShiftsTable();
  };

  S._editingDayTimesShiftId = null;

  S.openShiftDayTimesModal = function (shiftId) {
    var s = S.getShift(shiftId);
    if (!s) return;
    S._editingDayTimesShiftId = shiftId;
    var modal = document.getElementById("shift-day-times-modal");
    var title = document.getElementById("shift-day-times-title");
    var isSplit = !!(s.segments && s.segments.length === 2);
    var baseLabel = isSplit
      ? (s.segments[0].start + "\u2013" + s.segments[0].end + " / " + s.segments[1].start + "\u2013" + s.segments[1].end)
      : (s.start + "\u2013" + s.end);
    if (title) title.textContent = "Day times for " + (s.name || s.id) + " (base " + baseLabel + ")";
    var tbody = document.getElementById("shift-day-times-tbody");
    if (!tbody) return;
    var days = S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dt = s.dayTimes || {};
    tbody.innerHTML = days.map(function (name, i) {
      var ov = dt[String(i)];
      var useOverride = !!(ov && (ov.start || ov.segments));
      var ovSplit = !!(ov && ov.segments && ov.segments.length === 2);
      var startVal = ovSplit ? ov.segments[0].start : (ov ? ov.start : (isSplit ? s.segments[0].start : s.start));
      var endVal = ovSplit ? ov.segments[0].end : (ov ? ov.end : (isSplit ? s.segments[0].end : s.end));
      var start2Val = ovSplit ? ov.segments[1].start : (isSplit ? s.segments[1].start : "");
      var end2Val = ovSplit ? ov.segments[1].end : (isSplit ? s.segments[1].end : "");

      return "<tr data-dow=\"" + i + "\">" +
        "<td><strong>" + name + "</strong></td>" +
        "<td><label class=\"rdo-chk\" style=\"flex-direction:row;gap:0.35rem\">" +
        "<input type=\"checkbox\" data-sdt=\"use\" " + (useOverride ? "checked" : "") + "> Override</label></td>" +
        "<td><input type=\"time\" data-sdt=\"start\" value=\"" + startVal + "\" step=\"900\" " + (useOverride ? "" : "disabled") + "></td>" +
        "<td><input type=\"time\" data-sdt=\"end\" value=\"" + endVal + "\" step=\"900\" " + (useOverride ? "" : "disabled") + "></td>" +
        "<td><input type=\"time\" data-sdt=\"start2\" value=\"" + start2Val + "\" step=\"900\" placeholder=\"Seg 2 start\" " + (useOverride ? "" : "disabled") + "></td>" +
        "<td><input type=\"time\" data-sdt=\"end2\" value=\"" + end2Val + "\" step=\"900\" placeholder=\"Seg 2 end\" " + (useOverride ? "" : "disabled") + "></td>" +
        "<td class=\"muted\" data-sdt=\"dur\"></td></tr>";
    }).join("");
    S.updateShiftDayTimesDurations();
    if (modal) { modal.style.display = "block"; modal.setAttribute("aria-hidden", "false"); }
  };

  S.closeShiftDayTimesModal = function () {
    var modal = document.getElementById("shift-day-times-modal");
    if (modal) { modal.style.display = "none"; modal.setAttribute("aria-hidden", "true"); }
    S._editingDayTimesShiftId = null;
  };

  S.updateShiftDayTimesDurations = function () {
    document.querySelectorAll("#shift-day-times-tbody tr[data-dow]").forEach(function (tr) {
      var use = tr.querySelector("[data-sdt=use]");
      var startEl = tr.querySelector("[data-sdt=start]");
      var endEl = tr.querySelector("[data-sdt=end]");
      var start2El = tr.querySelector("[data-sdt=start2]");
      var end2El = tr.querySelector("[data-sdt=end2]");
      var durEl = tr.querySelector("[data-sdt=dur]");
      if (!use || !startEl || !endEl || !durEl) return;
      var disabled = !use.checked;
      startEl.disabled = disabled;
      endEl.disabled = disabled;
      if (start2El) start2El.disabled = disabled;
      if (end2El) end2El.disabled = disabled;
      if (!use.checked) { durEl.textContent = "base"; durEl.style.color = "var(--muted)"; return; }

      var s1 = S.timeToMin(startEl.value);
      var e1 = S.timeToMin(endEl.value);
      var hasSeg2 = start2El && end2El && start2El.value && end2El.value;
      if (hasSeg2) {
        var s2 = S.timeToMin(start2El.value);
        var e2 = S.timeToMin(end2El.value);
        if (e1 <= s1 || e2 <= s2 || s2 <= e1) {
          durEl.textContent = "Invalid";
          durEl.style.color = "var(--red)";
          return;
        }
        var mins = (e1 - s1) + (e2 - s2);
        var h = Math.floor(mins / 60);
        var m = mins % 60;
        durEl.textContent = h + "h" + (m ? " " + m + "m" : "");
        durEl.style.color = "";
      } else {
        if (e1 <= s1) { durEl.textContent = "Invalid"; durEl.style.color = "var(--red)"; }
        else {
          var mins1 = e1 - s1;
          var h1 = Math.floor(mins1 / 60);
          var m1 = mins1 % 60;
          durEl.textContent = h1 + "h" + (m1 ? " " + m1 + "m" : "");
          durEl.style.color = "";
        }
      }
    });
  };

  S.exportAllRdoMatrixCsv = function () {
    var lines = (S.state && S.state.lines) || [];
    if (!lines.length) {
      if (S.updateStatus) S.updateStatus("No generated lines to export.");
      return;
    }

    var days = S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    function formatRdoPattern(rdoDays) {
      if (!rdoDays || !rdoDays.length) return "None";
      var sorted = rdoDays.slice().map(Number).sort(function (a, b) { return a - b; });
      return sorted.map(function (d) { return days[d] || d; }).join("-");
    }

    // Filter to sexed lines (skip ESTI/MSTI or lines without sex)
    var sexedLines = lines.filter(function (l) {
      if (l.isTraining || (l.empClass === "ESTI" || l.empClass === "MSTI")) return false;
      var s = (l.sex || "").toUpperCase();
      return s === "M" || s === "F";
    });

    if (!sexedLines.length) {
      if (S.updateStatus) S.updateStatus("No sexed position lines available for CSV export.");
      return;
    }

    // Collect all active RDO patterns across all sexed lines
    var rdoPatternsMap = {};
    sexedLines.forEach(function (l) {
      var pat = formatRdoPattern(l.rdoDays);
      rdoPatternsMap[pat] = true;
    });
    var rdoPatterns = Object.keys(rdoPatternsMap).sort();

    // Group lines by Position x Shift x Sex
    var groupsMap = {};
    sexedLines.forEach(function (l) {
      var pos = l.extraName || (l.isStso ? "STSO" : (l.isLtso ? "LTSO" : (l.empClass === "PT" ? "PT TSO" : "FT TSO")));
      var shiftName = l.shiftName || l.shiftLabel || l.shiftId || "Shift";
      var sex = (l.sex || "").toUpperCase();
      var key = pos + "||" + shiftName + "||" + sex;
      if (!groupsMap[key]) groupsMap[key] = { pos: pos, shift: shiftName, sex: sex, lines: [] };
      groupsMap[key].lines.push(l);
    });

    var rows = [];
    // Header
    rows.push(["Position", "Shift", "Sex"].concat(rdoPatterns).join(","));

    function shiftStartMinutes(shiftName, sampleLine) {
      var sh = S.getShift ? S.getShift(sampleLine ? sampleLine.shiftId : "") : null;
      if (!sh && S.state && S.state.shifts) {
        sh = S.state.shifts.find(function (s) { return s.name === shiftName || s.id === shiftName; });
      }
      if (sh && sh.start && S.timeToMin) return S.timeToMin(sh.start);
      if (sampleLine && sampleLine.startTime && S.timeToMin) return S.timeToMin(sampleLine.startTime);
      // Fallback: match 4 digits HHMM or HH:MM in shiftName
      var m = String(shiftName).match(/(\d{2}):?(\d{2})/);
      if (m) return (+m[1] || 0) * 60 + (+m[2] || 0);
      return 0;
    }

    var sortedKeys = Object.keys(groupsMap).sort(function (aKey, bKey) {
      var a = groupsMap[aKey], b = groupsMap[bKey];
      var posCmp = String(a.pos).localeCompare(String(b.pos));
      if (posCmp !== 0) return posCmp;
      var aStart = shiftStartMinutes(a.shift, a.lines[0]);
      var bStart = shiftStartMinutes(b.shift, b.lines[0]);
      if (aStart !== bStart) return aStart - bStart;
      if (a.sex !== b.sex) return a.sex === "M" ? -1 : 1;
      return 0;
    });

    sortedKeys.forEach(function (key) {
      var g = groupsMap[key];
      var countsByPat = {};
      g.lines.forEach(function (l) {
        var pat = formatRdoPattern(l.rdoDays);
        countsByPat[pat] = (countsByPat[pat] || 0) + 1;
      });
      var lineRow = ['"' + g.pos + '"', '"' + g.shift + '"', g.sex];
      rdoPatterns.forEach(function (pat) {
        lineRow.push(countsByPat[pat] || 0);
      });
      rows.push(lineRow.join(","));
    });

    var csvText = rows.join("\n");
    var blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    var filename = "RDO_Sex_Matrix_All.csv";
    if (S.saveBlob) {
      S.saveBlob(blob, filename);
    } else if (typeof document !== "undefined") {
      var a = document.createElement("a");
      var url = URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    if (S.updateStatus) S.updateStatus("Exported unfiltered RDO x Sex matrix CSV.");
  };

  S.saveShiftDayTimes = function () {
    var s = S.getShift(S._editingDayTimesShiftId);
    if (!s) { S.closeShiftDayTimesModal(); return; }
    var dayTimes = {};
    document.querySelectorAll("#shift-day-times-tbody tr[data-dow]").forEach(function (tr) {
      var i = tr.getAttribute("data-dow");
      var use = tr.querySelector("[data-sdt=use]");
      var startEl = tr.querySelector("[data-sdt=start]");
      var endEl = tr.querySelector("[data-sdt=end]");
      var start2El = tr.querySelector("[data-sdt=start2]");
      var end2El = tr.querySelector("[data-sdt=end2]");
      if (!use || !use.checked || !startEl || !endEl) return;
      if (!S.isValidTimeText(startEl.value) || !S.isValidTimeText(endEl.value)) return;
      var s1Val = startEl.value, e1Val = endEl.value;
      var s2Val = start2El ? start2El.value : "";
      var e2Val = end2El ? end2El.value : "";

      if (s2Val && e2Val && S.isValidTimeText(s2Val) && S.isValidTimeText(e2Val)) {
        var m1s = S.timeToMin(s1Val), m1e = S.timeToMin(e1Val);
        var m2s = S.timeToMin(s2Val), m2e = S.timeToMin(e2Val);
        if (m1e > m1s && m2e > m2s && m2s > m1e) {
          dayTimes[String(i)] = {
            start: s1Val, end: e2Val,
            segments: [
              { start: s1Val, end: e1Val },
              { start: s2Val, end: e2Val }
            ]
          };
          return;
        }
      }
      if (S.timeToMin(e1Val) <= S.timeToMin(s1Val)) return;
      if (!s.segments && s1Val === s.start && e1Val === s.end) return;
      dayTimes[String(i)] = { start: s1Val, end: e1Val };
    });
    s.dayTimes = Object.keys(dayTimes).length ? dayTimes : null;
    S.closeShiftDayTimesModal();
    S.renderShiftsTable();
    if (S.updateStatus) S.updateStatus("Updated day times for " + (s.name || s.id));
    if (S.renderAll) S.renderAll();
  };

  S.openRdoMatrixModal = function () {
    var modal = typeof document !== "undefined" ? document.getElementById("rdo-matrix-modal") : null;
    if (modal) { modal.style.display = "flex"; modal.setAttribute("aria-hidden", "false"); }
    S.renderRdoMatrixModal();
  };

  S.closeRdoMatrixModal = function () {
    var modal = typeof document !== "undefined" ? document.getElementById("rdo-matrix-modal") : null;
    if (modal) { modal.style.display = "none"; modal.setAttribute("aria-hidden", "true"); }
  };

  S.openRdoRespinModal = function () {
    var modal = typeof document !== "undefined" ? document.getElementById("rdo-respin-modal") : null;
    if (modal) { modal.style.display = "flex"; modal.setAttribute("aria-hidden", "false"); }
    S.renderRdoRespinSlices();
  };

  S.closeRdoRespinModal = function () {
    var modal = typeof document !== "undefined" ? document.getElementById("rdo-respin-modal") : null;
    if (modal) { modal.style.display = "none"; modal.setAttribute("aria-hidden", "true"); }
  };

  S.renderRdoRespinSlices = function () {
    var listEl = document.getElementById("rdo-respin-slices-list");
    if (!listEl) return;
    var lines = (S.state && S.state.lines) || [];
    if (!lines.length) {
      listEl.innerHTML = '<p class="muted" style="margin:0">No generated lines available.</p>';
      return;
    }

    var sexedLines = lines.filter(function (l) {
      if (l.isTraining || (l.empClass === "ESTI" || l.empClass === "MSTI")) return false;
      var s = (l.sex || "").toUpperCase();
      return s === "M" || s === "F";
    });

    // Group slices by Position x Shift x Sex
    var sliceMap = {};
    sexedLines.forEach(function (l) {
      var pos = l.extraName || (l.isStso ? "STSO" : (l.isLtso ? "LTSO" : (l.empClass === "PT" ? "PT TSO" : "FT TSO")));
      var shiftName = l.shiftName || l.shiftLabel || l.shiftId || "Shift";
      var sex = (l.sex || "").toUpperCase();
      var key = shiftName + " · " + pos + " · " + sex;
      if (!sliceMap[key]) sliceMap[key] = { key: key, count: 0 };
      sliceMap[key].count++;
    });

    var keys = Object.keys(sliceMap).sort();
    if (!keys.length) {
      listEl.innerHTML = '<p class="muted" style="margin:0">No slices available.</p>';
      return;
    }

    listEl.innerHTML = keys.map(function (k) {
      var info = sliceMap[k];
      return '<label style="display:flex;align-items:center;gap:0.5rem;font-size:0.9rem;cursor:pointer">' +
        '<input type="checkbox" class="respin-slice-cb" data-slice-key="' + k.replace(/"/g, "&quot;") + '" checked />' +
        '<span><strong>' + info.key + '</strong> <span class="muted">(' + info.count + ' line' + (info.count > 1 ? 's' : '') + ')</span></span>' +
        '</label>';
    }).join("");
  };

  S.respinSelectedSlices = function (selectedKeys, opts) {
    var options = opts || {};
    if (!selectedKeys || !selectedKeys.length) {
      if (S.updateStatus) S.updateStatus("No slices selected for respin.");
      return;
    }
    var selectedSet = new Set(selectedKeys);
    var lines = (S.state && S.state.lines) || [];
    if (!lines.length) return;

    var days = (S.state && S.state.weekCount ? S.state.weekCount * 7 : 7);

    // Group target lines by selected slice key
    var targetGroups = {};
    lines.forEach(function (l) {
      if (l.isTraining || (l.empClass === "ESTI" || l.empClass === "MSTI")) return;
      var pos = l.extraName || (l.isStso ? "STSO" : (l.isLtso ? "LTSO" : (l.empClass === "PT" ? "PT TSO" : "FT TSO")));
      var shiftName = l.shiftName || l.shiftLabel || l.shiftId || "Shift";
      var sex = (l.sex || "").toUpperCase();
      var key = shiftName + " · " + pos + " · " + sex;
      if (selectedSet.has(key)) {
        if (!targetGroups[key]) targetGroups[key] = [];
        targetGroups[key].push(l);
      }
    });

    if (!options.keepSeed) {
      S._respinNonce = (S._respinNonce || 0) + 1;
    }
    var nonce = options.nonce !== undefined ? options.nonce : (S._respinNonce || 0);

    // Use active generate seed PRNG or fallback to state generateSeed
    var seedBase = (S.state && typeof S.state.activeSeed === "number")
      ? S.state.activeSeed
      : (S.state && S.state.generateSeed && S.state.generateSeed !== "random" ? parseInt(S.state.generateSeed, 10) : 42);
    if (!Number.isFinite(seedBase)) seedBase = 42;

    var respinCount = 0;
    Object.keys(targetGroups).forEach(function (key, groupIdx) {
      var gLines = targetGroups[key];
      if (!gLines.length) return;

      // PRNG per slice key incorporating respin nonce for fresh entropy on each click
      var prngSeed = (Math.abs(seedBase) + groupIdx * 7919 + nonce * 10007 + 1337) >>> 0;
      var prng = function () {
        var t = (prngSeed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };

      // Fisher-Yates shuffle seed indices and apply random offset
      var seedPool = [];
      for (var sIdx = 0; sIdx < gLines.length; sIdx++) {
        seedPool.push(sIdx % 7);
      }
      for (var i = seedPool.length - 1; i > 0; i--) {
        var j = Math.floor(prng() * (i + 1));
        var temp = seedPool[i];
        seedPool[i] = seedPool[j];
        seedPool[j] = temp;
      }
      var offset = Math.floor(prng() * 7);

      gLines.forEach(function (l, idx) {
        var rdoSeed = (seedPool[idx] + offset) % 7;
        var workDays = S.targetWorkDays ? S.targetWorkDays(l.shiftId, l.empClass) : ((+l.paid || 8) >= 10 ? 4 : 5);
        var rdoCount = Math.max(1, 7 - workDays);
        var sh = S.getShift ? S.getShift(l.shiftId) : null;
        var placed = assignRdoDays(S, sh || {}, rdoCount, rdoSeed);
        if (placed.mode !== "off") {
          l.rdoDays = placed.rdoDays;
          l.rdoHard = false;
        } else {
        var hard = (sh && Array.isArray(sh.rdoHard) && sh.rdoHard.length > 0)
          ? sh.rdoHard.map(Number).filter(function (x) { return x >= 0 && x <= 6; })
          : (l.rdoHard && Array.isArray(l.rdoDays) ? l.rdoDays : []);

        if (hard.length > 0) {
          var rDays = hard.slice();
          if (rDays.length < rdoCount) {
            for (var d = 0; d < 7 && rDays.length < rdoCount; d++) {
              var cand = (rdoSeed + d) % 7;
              if (rDays.indexOf(cand) < 0) rDays.push(cand);
            }
          }
          l.rdoDays = rDays;
          l.rdoHard = true;
        } else if (S.consecutiveRdos) {
          l.rdoDays = S.consecutiveRdos(rdoCount, rdoSeed);
          l.rdoHard = false;
        } else {
          l.rdoDays = [(rdoSeed) % 7, (rdoSeed + 1) % 7];
          l.rdoHard = false;
        }
        }

        // Update schedule array for this line
        if (S.buildScheduleForLine) {
          S.state.schedule[l.id] = S.buildScheduleForLine(l, days);
        }
        respinCount++;
      });
    });

    // Refresh UI & Matrix
    if (S.renderRdoMatrixModal) S.renderRdoMatrixModal();
    if (S.renderAll) S.renderAll();
    if (S.renderLines) S.renderLines();
    if (S.updateStatus) S.updateStatus("Respun RDOs for " + respinCount + " line(s) across " + Object.keys(targetGroups).length + " slice(s).");
  };

  S.renderRdoMatrixModal = function () {
    var selectEl = typeof document !== "undefined" ? document.getElementById("rdo-matrix-pos-select") : null;
    var tableWrap = typeof document !== "undefined" ? document.getElementById("rdo-matrix-table-wrap") : null;
    if (!tableWrap) return;

    var lines = (S.state && S.state.lines) || [];
    if (!lines.length) {
      tableWrap.innerHTML = '<p class="muted">No generated schedule lines available. Click <strong>GENERATE</strong> first.</p>';
      return;
    }

    // Dynamic position options (skipping ESTI/MSTI which have no sex breakdown)
    var posOptions = ["STSO", "LTSO", "TSO", "FT TSO", "PT TSO"];
    lines.forEach(function (l) {
      var name = l.extraName || l.position || l.empClass;
      if (name && posOptions.indexOf(name) === -1 && name !== "FT" && name !== "PT") {
        if (name !== "ESTI" && name !== "MSTI") {
          posOptions.push(name);
        }
      }
    });

    var currentFilter = selectEl ? selectEl.value : "";
    if (!currentFilter) currentFilter = "STSO";

    if (selectEl) {
      selectEl.innerHTML = posOptions.map(function (opt) {
        var sel = opt === currentFilter ? " selected" : "";
        return '<option value="' + opt + '"' + sel + '>' + opt + '</option>';
      }).join("");
    }

    function lineMatches(l, filter) {
      var f = (filter || "STSO").toUpperCase();
      if (f === "STSO") return l.isStso || l.position === "STSO" || l.empClass === "STSO";
      if (f === "LTSO") return l.isLtso || l.position === "LTSO" || l.empClass === "LTSO";
      if (f === "TSO") return (l.position === "TSO" || l.empClass === "FT" || l.empClass === "PT") && !l.isExtra && !l.isTraining;
      if (f === "FT TSO" || f === "FT") return l.empClass === "FT" && !l.isExtra && !l.isTraining;
      if (f === "PT TSO" || f === "PT") return l.empClass === "PT" && !l.isExtra && !l.isTraining;
      var lPos = (l.position || l.extraName || l.empClass || "").toUpperCase();
      return lPos === f;
    }

    var matchingLines = lines.filter(function (l) { return lineMatches(l, currentFilter); });
    if (!matchingLines.length) {
      tableWrap.innerHTML = '<p class="muted">No lines found for position class <strong>' + currentFilter + '</strong>.</p>';
      return;
    }

    var days = S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    function formatRdoPattern(rdoDays) {
      if (!rdoDays || !rdoDays.length) return "None";
      var sorted = rdoDays.slice().map(Number).sort(function (a, b) { return a - b; });
      return sorted.map(function (d) { return days[d] || d; }).join("-");
    }

    // Collect all active RDO patterns across matching lines
    var rdoPatternsMap = {};
    matchingLines.forEach(function (l) {
      var pat = formatRdoPattern(l.rdoDays);
      rdoPatternsMap[pat] = true;
    });
    var rdoPatterns = Object.keys(rdoPatternsMap).sort();

    // Group matching lines by Shift Name
    var shiftsMap = {};
    matchingLines.forEach(function (l) {
      var shiftName = l.shiftName || l.shiftLabel || l.shiftId || "Shift";
      if (!shiftsMap[shiftName]) shiftsMap[shiftName] = [];
      shiftsMap[shiftName].push(l);
    });

    function getShiftMinutes(shiftName, sampleLine) {
      var sh = S.getShift ? S.getShift(sampleLine ? sampleLine.shiftId : "") : null;
      if (!sh && S.state && S.state.shifts) {
        sh = S.state.shifts.find(function (s) { return s.name === shiftName || s.id === shiftName; });
      }
      if (sh && sh.start && S.timeToMin) return S.timeToMin(sh.start);
      if (sampleLine && sampleLine.startTime && S.timeToMin) return S.timeToMin(sampleLine.startTime);
      var m = String(shiftName).match(/(\d{2}):?(\d{2})/);
      if (m) return (+m[1] || 0) * 60 + (+m[2] || 0);
      return 0;
    }

    var sortedShiftNames = Object.keys(shiftsMap).sort(function (aName, bName) {
      var aMins = getShiftMinutes(aName, shiftsMap[aName][0]);
      var bMins = getShiftMinutes(bName, shiftsMap[bName][0]);
      return aMins - bMins;
    });

    var rowsHtml = [];
    sortedShiftNames.forEach(function (shiftName) {
      var sLines = shiftsMap[shiftName];
      ["M", "F"].forEach(function (sex) {
        var sexLines = sLines.filter(function (l) { return (l.sex || "").toUpperCase() === sex; });
        var countsByPattern = {};
        sexLines.forEach(function (l) {
          var pat = formatRdoPattern(l.rdoDays);
          countsByPattern[pat] = (countsByPattern[pat] || 0) + 1;
        });

        var cellCts = rdoPatterns.map(function (pat) {
          var ct = countsByPattern[pat] || 0;
          return '<td style="text-align:center;' + (ct > 0 ? "font-weight:bold" : "opacity:0.4") + '">' + ct + '</td>';
        }).join("");

        rowsHtml.push(
          '<tr>' +
          '<td><strong>' + shiftName + '</strong></td>' +
          '<td><span class="badge" style="background:' + (sex === "M" ? "#007bff" : "#e83e8c") + ';color:#fff;padding:0.15rem 0.4rem;border-radius:3px">' + sex + '</span></td>' +
          cellCts +
          '</tr>'
        );
      });
    });

    var headerCells = rdoPatterns.map(function (pat) {
      return '<th style="text-align:center">' + pat + '</th>';
    }).join("");

    tableWrap.innerHTML =
      '<table class="data-table" style="width:100%;border-collapse:collapse">' +
      '<thead><tr><th>Shift</th><th>Sex</th>' + headerCells + '</tr></thead>' +
      '<tbody>' + rowsHtml.join("") + '</tbody>' +
      '</table>';
  };

  S.initShiftDayTimes = function () {
    if (S._sdtBound) return;
    S._sdtBound = true;
    var closeBtn = document.getElementById("shift-day-times-close");
    if (closeBtn) closeBtn.addEventListener("click", S.closeShiftDayTimesModal);
    var cancelBtn = document.getElementById("btn-sdt-cancel");
    if (cancelBtn) cancelBtn.addEventListener("click", S.closeShiftDayTimesModal);
    var saveBtn = document.getElementById("btn-sdt-save");
    if (saveBtn) saveBtn.addEventListener("click", S.saveShiftDayTimes);
    var clearBtn = document.getElementById("btn-sdt-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        var s = S.getShift(S._editingDayTimesShiftId);
        document.querySelectorAll("#shift-day-times-tbody tr[data-dow]").forEach(function (tr) {
          var use = tr.querySelector("[data-sdt=use]");
          var startEl = tr.querySelector("[data-sdt=start]");
          var endEl = tr.querySelector("[data-sdt=end]");
          if (use) use.checked = false;
          if (startEl && s) startEl.value = s.start;
          if (endEl && s) endEl.value = s.end;
        });
        S.updateShiftDayTimesDurations();
      });
    }
    document.addEventListener("change", function (e) {
      if (!e.target) return;
      var attr = e.target.getAttribute("data-sdt");
      if (attr !== "use" && attr !== "start" && attr !== "end") return;
      if (attr === "use") {
        var tr = e.target.closest("tr");
        var s = S.getShift(S._editingDayTimesShiftId);
        if (tr && s && !e.target.checked) {
          var startEl = tr.querySelector("[data-sdt=start]");
          var endEl = tr.querySelector("[data-sdt=end]");
          if (startEl) startEl.value = s.start;
          if (endEl) endEl.value = s.end;
        }
      }
      S.updateShiftDayTimesDurations();
    });
    var modal = document.getElementById("shift-day-times-modal");
    if (modal) modal.addEventListener("click", function (e) {
      if (e.target === modal) S.closeShiftDayTimesModal();
    });
  };
}
