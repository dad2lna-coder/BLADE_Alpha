/** Setup-tab shifts table + day-times modal. */
export function attachShiftsTable(S) {
  if (!S) return;

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
    var rows = document.querySelectorAll("#shifts-tbody tr[data-shift-id]");
    if (!rows.length) return S.state.shifts;
    var next = [];
    rows.forEach(function (tr) {
      var id = tr.getAttribute("data-shift-id");
      var existing = S.getShift ? S.getShift(id) : null;
      var name = (tr.querySelector("[data-f=name]") && tr.querySelector("[data-f=name]").value.trim()) || id;
      var start = (tr.querySelector("[data-f=start]") && tr.querySelector("[data-f=start]").value) || "05:00";
      var end = (tr.querySelector("[data-f=end]") && tr.querySelector("[data-f=end]").value) || "13:30";
      var paid = +(tr.querySelector("[data-f=paid]") && tr.querySelector("[data-f=paid]").value);
      if (!paid || paid <= 0) {
        var mins = S.timeToMin(end) - S.timeToMin(start);
        paid = Math.max(1, Math.round((mins / 60) * 2) / 2);
      }
      var force = Math.max(0, Math.floor(+(tr.querySelector("[data-f=force]") && tr.querySelector("[data-f=force]").value) || 0));
      var ltsoForce = Math.max(0, Math.floor(+(tr.querySelector("[data-f=ltsoForce]") && tr.querySelector("[data-f=ltsoForce]").value) || 0));
      var stsoForce = Math.max(0, Math.floor(+(tr.querySelector("[data-f=stsoForce]") && tr.querySelector("[data-f=stsoForce]").value) || 0));
      var rdoHard = [];
      for (var d = 0; d < 7; d++) {
        var cb = tr.querySelector('[data-rdo="' + d + '"]');
        if (cb && cb.checked) rdoHard.push(d);
      }
      var dayTimes = existing && existing.dayTimes ? existing.dayTimes : null;
      var phaseEl = tr.querySelector("[data-f=phase]");
      var phase = (phaseEl && phaseEl.value) || (existing && existing.phase) || "auto";
      next.push({
        id: id, name: name, start: start, end: end, paid: paid,
        force: force, ltsoForce: ltsoForce, stsoForce: stsoForce, rdoHard: rdoHard,
        dayTimes: dayTimes, phase: phase
      });
    });
    S.state.shifts = next;
    return next;
  };

  S.renderShiftsTable = function () {
    var tbody = document.getElementById("shifts-tbody");
    if (!tbody) return;
    tbody.innerHTML = (S.state.shifts || []).map(function (s) {
      var hasDyn = S.shiftHasDayOverrides && S.shiftHasDayOverrides(s.id);
      var daysCls = hasDyn ? "btn btn-amber" : "btn";
      var daysTitle = hasDyn ? "Has per-day time overrides" : "Set different start/end per day of week";
      return (
        '<tr data-shift-id="' + s.id + '">' +
        '<td><input type="text" data-f="name" value="' + String(s.name).replace(/"/g, "&quot;") + '" style="width:5.5rem" /></td>' +
        '<td><input type="time" data-f="start" value="' + s.start + '" /></td>' +
        '<td><input type="time" data-f="end" value="' + s.end + '" /></td>' +
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
        '<td style="white-space:nowrap">' +
          '<button type="button" class="' + daysCls + '" data-day-times="' + s.id + '" title="' + daysTitle + '">Day times…</button> ' +
          '<button type="button" class="btn btn-red" data-remove="' + s.id + '">✕</button>' +
        '</td></tr>'
      );
    }).join("");

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
      force: 0, ltsoForce: 0, stsoForce: 0, rdoHard: []
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
    if (title) title.textContent = "Day times for " + (s.name || s.id) + " (base " + s.start + "\u2013" + s.end + ")";
    var tbody = document.getElementById("shift-day-times-tbody");
    if (!tbody) return;
    var days = S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var dt = s.dayTimes || {};
    tbody.innerHTML = days.map(function (name, i) {
      var ov = dt[String(i)];
      var useOverride = !!(ov && ov.start && ov.end);
      var startVal = useOverride ? ov.start : s.start;
      var endVal = useOverride ? ov.end : s.end;
      return "<tr data-dow=\"" + i + "\">" +
        "<td><strong>" + name + "</strong></td>" +
        "<td><label class=\"rdo-chk\" style=\"flex-direction:row;gap:0.35rem\">" +
        "<input type=\"checkbox\" data-sdt=\"use\" " + (useOverride ? "checked" : "") + "> Override</label></td>" +
        "<td><input type=\"time\" data-sdt=\"start\" value=\"" + startVal + "\" step=\"900\" " + (useOverride ? "" : "disabled") + "></td>" +
        "<td><input type=\"time\" data-sdt=\"end\" value=\"" + endVal + "\" step=\"900\" " + (useOverride ? "" : "disabled") + "></td>" +
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
      var durEl = tr.querySelector("[data-sdt=dur]");
      if (!use || !startEl || !endEl || !durEl) return;
      startEl.disabled = !use.checked;
      endEl.disabled = !use.checked;
      if (!use.checked) { durEl.textContent = "base"; durEl.style.color = "var(--muted)"; return; }
      var o = S.timeToMin(startEl.value);
      var c = S.timeToMin(endEl.value);
      if (c <= o) { durEl.textContent = "Invalid"; durEl.style.color = "var(--red)"; }
      else {
        var mins = c - o;
        var h = Math.floor(mins / 60);
        var m = mins % 60;
        durEl.textContent = h + "h" + (m ? " " + m + "m" : "");
        durEl.style.color = "";
      }
    });
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
      if (!use || !use.checked || !startEl || !endEl) return;
      if (!S.isValidTimeText(startEl.value) || !S.isValidTimeText(endEl.value)) return;
      if (S.timeToMin(endEl.value) <= S.timeToMin(startEl.value)) return;
      if (startEl.value === s.start && endEl.value === s.end) return;
      dayTimes[String(i)] = { start: startEl.value, end: endEl.value };
    });
    s.dayTimes = Object.keys(dayTimes).length ? dayTimes : null;
    S.closeShiftDayTimesModal();
    S.renderShiftsTable();
    if (S.updateStatus) S.updateStatus("Updated day times for " + (s.name || s.id));
    if (S.renderAll) S.renderAll();
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
