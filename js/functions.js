window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";
  function defaultBands() {
    return [
      { start: "03:30", end: "04:00", stso: 1, ltso: 1, tso: 2 },
      { start: "04:00", end: "20:30", stso: 1, ltso: 1, tso: 6 },
      { start: "20:30", end: "23:00", stso: 1, ltso: 1, tso: 3 }
    ];
  }
  function num0(v) { return Math.max(0, Math.floor(+v || 0)); }
  function setVal(id, v) { var el = S.$(id); if (el) el.value = v; }
  function setChk(id, v) { var el = S.$(id); if (el) el.checked = !!v; }
  function readNum(id) { var el = S.$(id); return el ? num0(el.value) : null; }

  S.ensureFunctionCoverage = function () {
    if (!S.state.functionCoverage) S.state.functionCoverage = {};
    var fc = S.state.functionCoverage;
    if (fc.mode !== "dfo" && fc.mode !== "bag" && fc.mode !== "none") {
      if (fc.enableBag && !fc.enableDfo) fc.mode = "bag";
      else if (fc.enableDfo && !fc.enableBag) fc.mode = "dfo";
      else fc.mode = "none";
    }
    ["poolStsoDfoM","poolStsoDfoF","poolLtsoDfoM","poolLtsoDfoF","poolTsoDfoM","poolTsoDfoF",
     "poolStsoBagM","poolStsoBagF","poolLtsoBagM","poolLtsoBagF","poolTsoBagM","poolTsoBagF"].forEach(function (k) {
      if (fc[k] == null) fc[k] = 0;
    });
    if (fc.poolStsoDfo == null) fc.poolStsoDfo = fc.poolStsoDfoM + fc.poolStsoDfoF;
    if (fc.poolLtsoDfo == null) fc.poolLtsoDfo = fc.poolLtsoDfoM + fc.poolLtsoDfoF;
    if (fc.poolTsoDfo == null) fc.poolTsoDfo = fc.poolTsoDfoM + fc.poolTsoDfoF;
    if (fc.poolBag == null) fc.poolBag = fc.poolTsoBagM + fc.poolTsoBagF;
    if (!fc.poolStsoDfoM && !fc.poolStsoDfoF && fc.poolStsoDfo) fc.poolStsoDfoM = fc.poolStsoDfo;
    if (!fc.poolLtsoDfoM && !fc.poolLtsoDfoF && fc.poolLtsoDfo) fc.poolLtsoDfoM = fc.poolLtsoDfo;
    if (!fc.poolTsoDfoM && !fc.poolTsoDfoF && fc.poolTsoDfo) fc.poolTsoDfoM = fc.poolTsoDfo;
    if (!fc.poolTsoBagM && !fc.poolTsoBagF && fc.poolBag) fc.poolTsoBagM = fc.poolBag;
    if (fc.amPmSplit == null) fc.amPmSplit = true;
    if (fc.phaseThresholdMin == null) fc.phaseThresholdMin = 15;
    if (!Array.isArray(fc.bands) || !fc.bands.length) fc.bands = defaultBands();
    delete fc.stsoIsDfo; delete fc.poolDfo; delete fc.poolPax;
    if (!S.state.functionRotation) S.state.functionRotation = {};
    return fc;
  };

  S.getFunctionMode = function () {
    var fc = S.ensureFunctionCoverage();
    return fc.mode === "dfo" || fc.mode === "bag" ? fc.mode : "none";
  };

  S.syncFunctionModeUi = function () {
    var fc = S.ensureFunctionCoverage();
    var mode = S.getFunctionMode();
    setChk("fc-mode-dfo", mode === "dfo");
    setChk("fc-mode-bag", mode === "bag");
    var wrap = S.$("fc-bands-wrap");
    var add = S.$("fc-add-band");
    var hideBands = mode === "bag";
    if (wrap) wrap.style.display = hideBands ? "none" : "";
    if (add) add.style.display = hideBands ? "none" : "";
    var pools = mode === "bag"
      ? { sm: fc.poolStsoBagM, sf: fc.poolStsoBagF, lm: fc.poolLtsoBagM, lf: fc.poolLtsoBagF, tm: fc.poolTsoBagM, tf: fc.poolTsoBagF }
      : { sm: fc.poolStsoDfoM, sf: fc.poolStsoDfoF, lm: fc.poolLtsoDfoM, lf: fc.poolLtsoDfoF, tm: fc.poolTsoDfoM, tf: fc.poolTsoDfoF };
    setVal("fc-pool-stso-m", pools.sm); setVal("fc-pool-stso-f", pools.sf);
    setVal("fc-pool-ltso-m", pools.lm); setVal("fc-pool-ltso-f", pools.lf);
    setVal("fc-pool-tso-m", pools.tm); setVal("fc-pool-tso-f", pools.tf);
  };

  S.fillFunctionCoverageForm = function () {
    var fc = S.ensureFunctionCoverage();
    setVal("fc-phase-thr", fc.phaseThresholdMin); setChk("fc-ampm-split", fc.amPmSplit);
    S.syncFunctionModeUi();
    S.renderFunctionBandsTable(); S.updateFunctionCoveragePreview();
  };

  S.computeShiftAnchors = S.computeShiftAnchors || function () {
    var starts = {};
    (S.state.lines || []).forEach(function (l) {
      var sh = S.getShift(l.shiftId);
      if (!sh) return;
      var m = S.timeToMin(sh.start);
      starts[m] = (starts[m] || 0) + 1;
    });
    var entries = Object.keys(starts).map(function (k) { return { min: +k, n: starts[k] }; }).sort(function (a, b) { return a.min - b.min; });
    if (!entries.length) return { am: 8 * 60, pm: 14 * 60 };
    var am = entries[0].min, amN = 0;
    entries.forEach(function (e) { if (e.min < 11 * 60 && e.n > amN) { amN = e.n; am = e.min; } });
    var pm = entries[entries.length - 1].min, pmN = 0;
    entries.forEach(function (e) { if (e.min >= 11 * 60 + 15 && e.n > pmN) { pmN = e.n; pm = e.min; } });
    if (pmN === 0) entries.forEach(function (e) { if (e.min >= 12 * 60 && e.n > pmN) { pmN = e.n; pm = e.min; } });
    return { am: am, pm: pm };
  };
  S.phaseOfStart = function (startMin, anchors, threshold) {
    threshold = threshold != null ? threshold : 15;
    anchors = anchors || S.computeShiftAnchors();
    if (startMin <= anchors.am - threshold && startMin < 11 * 60) return "Opening";
    if (startMin >= anchors.pm + threshold && startMin >= 11 * 60 + 15) return "Closing";
    if (startMin < anchors.pm) return "AM";
    return "PM";
  };
  S.isAmSide = function (startMin, anchors, threshold) {
    return S.phaseOfStart(startMin, anchors, threshold) === "Opening" || S.phaseOfStart(startMin, anchors, threshold) === "AM";
  };
  S.lineStartMin = function (line) { var sh = S.getShift(line.shiftId); return sh ? S.timeToMin(sh.start) : 0; };
  S.lineRoleKey = function (line) {
    if (line.isStso || line.empClass === "STSO") return "STSO";
    if (line.isLtso || line.empClass === "LTSO") return "LTSO";
    return "TSO";
  };
  S.getRotationDuty = function (lineId, dayIndex) {
    var rot = S.state.functionRotation || {};
    var row = rot[String(lineId)] || rot[lineId];
    if (row && row[dayIndex] != null && row[dayIndex] !== "") return row[dayIndex];
    var line = null;
    if (S.state && Array.isArray(S.state.lines)) {
      for (var i = 0; i < S.state.lines.length; i++) {
        if (String(S.state.lines[i].id) === String(lineId)) { line = S.state.lines[i]; break; }
      }
    }
    if (line && (line.function === "BAG" || line.function === "DFO" || line.function === "PAX")) return line.function;
    return null;
  };
  S.lineCoversSlot = function (line, dayIndex, slotMin) {
    var sched = S.state.schedule[line.id] || S.state.schedule[String(line.id)];
    if (!sched || sched[dayIndex] !== "WORK") return false;
    var dow = dayIndex % 7;
    var times = S.getEffectiveShiftTimes ? S.getEffectiveShiftTimes(line.shiftId, dow) : null;
    if (!times) {
      var sh = S.getShift(line.shiftId);
      if (!sh) return false;
      times = { start: sh.start, end: sh.end };
    }
    var a = S.timeToMin(times.start), c = S.timeToMin(times.end);
    if (c <= a) return slotMin >= a || slotMin < c;
    return slotMin >= a && slotMin < c;
  };
  S.bandForMinute = function (m, bands) {
    bands = bands || S.ensureFunctionCoverage().bands;
    for (var i = 0; i < bands.length; i++) {
      var b = bands[i], s = S.timeToMin(b.start), e = S.timeToMin(b.end);
      if (e <= s) e += 1440;
      var mm = m; if (e > 1440 && mm < s) mm += 1440;
      if (mm >= s && mm < e) return b;
    }
    return null;
  };
  S.openFunctionCoverageModal = function () {
    S.fillFunctionCoverageForm();
    var modal = S.$("func-coverage-modal"); if (modal) modal.style.display = "block";
  };
  S.closeFunctionCoverageModal = function () { var modal = S.$("func-coverage-modal"); if (modal) modal.style.display = "none"; };
  S.renderFunctionBandsTable = function () {
    var tbody = S.$("fc-bands-tbody"); if (!tbody) return;
    var bands = S.ensureFunctionCoverage().bands;
    tbody.innerHTML = bands.map(function (b, i) {
      function num(key) {
        return '<td><input type="number" min="0" max="99" data-fc-band="' + i + '" data-fc-field="' + key + '" value="' + (b[key] != null ? b[key] : 0) + '" style="width:3.5rem"></td>';
      }
      return "<tr>" +
        '<td><input type="time" data-fc-band="' + i + '" data-fc-field="start" value="' + (b.start || "00:00") + '" step="900"></td>' +
        '<td><input type="time" data-fc-band="' + i + '" data-fc-field="end" value="' + (b.end || "00:00") + '" step="900"></td>' +
        num("stso") + num("ltso") + num("tso") +
        '<td><button type="button" class="btn btn-red btn-sm" data-fc-remove="' + i + '">\u2715</button></td></tr>';
    }).join("");
  };
  S.readFunctionBandsFromDom = function () {
    var fc = S.ensureFunctionCoverage();
    var dfoEl = S.$("fc-mode-dfo"), bagEl = S.$("fc-mode-bag");
    if (dfoEl || bagEl) {
      if (bagEl && bagEl.checked && !(dfoEl && dfoEl.checked)) fc.mode = "bag";
      else if (dfoEl && dfoEl.checked) fc.mode = "dfo";
      else fc.mode = "none";
    }
    var sm = readNum("fc-pool-stso-m"), sf = readNum("fc-pool-stso-f");
    var lm = readNum("fc-pool-ltso-m"), lf = readNum("fc-pool-ltso-f");
    var tm = readNum("fc-pool-tso-m"), tf = readNum("fc-pool-tso-f");
    if (fc.mode === "bag") {
      if (sm != null) fc.poolStsoBagM = sm; if (sf != null) fc.poolStsoBagF = sf;
      if (lm != null) fc.poolLtsoBagM = lm; if (lf != null) fc.poolLtsoBagF = lf;
      if (tm != null) fc.poolTsoBagM = tm; if (tf != null) fc.poolTsoBagF = tf;
      fc.poolBag = fc.poolTsoBagM + fc.poolTsoBagF + fc.poolStsoBagM + fc.poolStsoBagF + fc.poolLtsoBagM + fc.poolLtsoBagF;
    } else {
      if (sm != null) fc.poolStsoDfoM = sm; if (sf != null) fc.poolStsoDfoF = sf;
      if (lm != null) fc.poolLtsoDfoM = lm; if (lf != null) fc.poolLtsoDfoF = lf;
      if (tm != null) fc.poolTsoDfoM = tm; if (tf != null) fc.poolTsoDfoF = tf;
      fc.poolStsoDfo = fc.poolStsoDfoM + fc.poolStsoDfoF;
      fc.poolLtsoDfo = fc.poolLtsoDfoM + fc.poolLtsoDfoF;
      fc.poolTsoDfo = fc.poolTsoDfoM + fc.poolTsoDfoF;
    }
    var thr = S.$("fc-phase-thr"), split = S.$("fc-ampm-split");
    if (thr) fc.phaseThresholdMin = num0(thr.value || 15);
    if (split) fc.amPmSplit = !!split.checked;
    for (var i = 0; i < fc.bands.length; i++) {
      var b = fc.bands[i] || {};
      ["start", "end", "stso", "ltso", "tso"].forEach(function (field) {
        var el = document.querySelector('[data-fc-band="' + i + '"][data-fc-field="' + field + '"]');
        if (!el) return;
        if (field === "start" || field === "end") b[field] = el.value || b[field];
        else b[field] = num0(el.value);
      });
      fc.bands[i] = b;
    }
    fc.bands.sort(function (a, b) { return S.timeToMin(a.start) - S.timeToMin(b.start); });
    return fc;
  };
  S.updateFunctionCoveragePreview = function () {
    var el = S.$("fc-preview"); if (!el) return;
    var fc = S.ensureFunctionCoverage(), mode = S.getFunctionMode();
    var anchors = S.computeShiftAnchors();
    var bandTxt = mode === "bag" ? "bands hidden (BAG)" : (fc.bands || []).map(function (b) {
      return (b.start || "?") + "-" + (b.end || "?") + " need " + (b.stso || 0) + "-" + (b.ltso || 0) + "-" + (b.tso || 0);
    }).join(" | ");
    el.textContent = "Mode " + mode.toUpperCase() +
      " · STSO M/F " + (mode === "bag" ? fc.poolStsoBagM : fc.poolStsoDfoM) + "/" + (mode === "bag" ? fc.poolStsoBagF : fc.poolStsoDfoF) +
      " LTSO " + (mode === "bag" ? fc.poolLtsoBagM : fc.poolLtsoDfoM) + "/" + (mode === "bag" ? fc.poolLtsoBagF : fc.poolLtsoDfoF) +
      " TSO " + (mode === "bag" ? fc.poolTsoBagM : fc.poolTsoDfoM) + "/" + (mode === "bag" ? fc.poolTsoBagF : fc.poolTsoDfoF) +
      " AM " + S.slotLabel(anchors.am) + " PM " + S.slotLabel(anchors.pm) + " " + (bandTxt || "no bands");
  };
  function ensureEligible(line) {
    if (!line.functionEligible || typeof line.functionEligible !== "object") line.functionEligible = { dfo: false, bag: false, pax: false };
    return line.functionEligible;
  }
  S.buildCertifiedPools = function (fc) {
    S.state.lines.forEach(function (l) { l.functionEligible = { dfo: false, bag: false, pax: false }; l.function = ""; });
    var anchors = S.computeShiftAnchors(), thr = fc.phaseThresholdMin || 15;
    var mode = fc.mode === "bag" ? "bag" : "dfo";
    var key = mode === "bag" ? "bag" : "dfo";
    function byRoleSex(role, sex) {
      return S.state.lines.filter(function (l) { return S.lineRoleKey(l) === role && l.sex === sex; });
    }
    function markPool(role, sex, n, markKey) {
      if (!n || n <= 0) return { am: 0, pm: 0, total: 0 };
      var lines = byRoleSex(role, sex).slice();
      lines.sort(function (a, b) { return S.lineStartMin(a) - S.lineStartMin(b) || String(a.id).localeCompare(String(b.id)); });
      var amSide = lines.filter(function (l) { return S.isAmSide(S.lineStartMin(l), anchors, thr); });
      var pmSide = lines.filter(function (l) { return !S.isAmSide(S.lineStartMin(l), anchors, thr); });
      var needAm = fc.amPmSplit ? Math.ceil(n / 2) : n;
      var needPm = fc.amPmSplit ? Math.floor(n / 2) : 0;
      if (amSide.length < needAm) { needPm += needAm - amSide.length; needAm = amSide.length; }
      if (pmSide.length < needPm) { needAm = Math.min(amSide.length, needAm + (needPm - pmSide.length)); needPm = pmSide.length; }
      while (needAm + needPm > n) { if (needPm >= needAm && needPm > 0) needPm--; else if (needAm > 0) needAm--; else break; }
      function take(arr, count) {
        var taken = 0;
        for (var i = 0; i < arr.length && taken < count; i++) {
          var el = ensureEligible(arr[i]); if (el[markKey]) continue; el[markKey] = true; taken++;
        }
        return taken;
      }
      var gotAm = take(amSide, needAm), gotPm = take(pmSide, needPm), short = n - gotAm - gotPm;
      if (short > 0) gotPm += take(lines.filter(function (l) { return !ensureEligible(l)[markKey]; }), short);
      return { am: gotAm, pm: gotPm, total: gotAm + gotPm };
    }
    function both(role, m, f) {
      var a = markPool(role, "M", m, key), b = markPool(role, "F", f, key);
      return { am: a.am + b.am, pm: a.pm + b.pm, total: a.total + b.total, m: a.total, f: b.total };
    }
    if (mode === "bag") {
      return {
        stso: both("STSO", fc.poolStsoBagM, fc.poolStsoBagF),
        ltso: both("LTSO", fc.poolLtsoBagM, fc.poolLtsoBagF),
        tso: both("TSO", fc.poolTsoBagM, fc.poolTsoBagF),
        bag: both("TSO", fc.poolTsoBagM, fc.poolTsoBagF),
        anchors: anchors
      };
    }
    return {
      stso: both("STSO", fc.poolStsoDfoM, fc.poolStsoDfoF),
      ltso: both("LTSO", fc.poolLtsoDfoM, fc.poolLtsoDfoF),
      tso: both("TSO", fc.poolTsoDfoM, fc.poolTsoDfoF),
      bag: { am: 0, pm: 0, total: 0 },
      anchors: anchors
    };
  };

  function paintAfterAssign() {
    if (S.renderCoverageBars) S.renderCoverageBars();
    if (S.renderReports) S.renderReports();
    if (S.__USE_SVELTE_LINES) document.dispatchEvent(new CustomEvent("lines:request-render"));
    else if (S.renderLines) S.renderLines();
  }

  S.generateFunctionAssignments = function (opts) {
    opts = opts || {};
    var fc = opts.fromGenerate ? S.ensureFunctionCoverage() : S.readFunctionBandsFromDom();
    var mode = S.getFunctionMode();
    S.state.functionRotation = {};
    (S.state.lines || []).forEach(function (l) {
      l.function = "";
      l.functionEligible = { dfo: false, bag: false, pax: false };
    });
    if (mode === "none") {
      paintAfterAssign();
      if (!opts.fromGenerate && S.updateStatus) S.updateStatus("Function mode off — no duties assigned.");
      return;
    }
    if (!S.state.lines || !S.state.lines.length) { if (S.updateStatus) S.updateStatus("Generate lines first."); return; }
    var poolStats = S.buildCertifiedPools(fc);
    var days = (S.state.weekCount || 1) * 7;

    function setDuty(lineId, dayIndex, fn) {
      var key = String(lineId);
      if (!S.state.functionRotation[key]) S.state.functionRotation[key] = [];
      while (S.state.functionRotation[key].length <= dayIndex) S.state.functionRotation[key].push(null);
      S.state.functionRotation[key][dayIndex] = fn;
      return true;
    }
    function worksDay(line, d) {
      var sched = S.state.schedule[line.id] || S.state.schedule[String(line.id)] || [];
      return sched[d] === "WORK";
    }

    if (mode === "bag") {
      (S.state.lines || []).forEach(function (l) {
        if (!ensureEligible(l).bag) return;
        l.function = "BAG";
        for (var d = 0; d < days; d++) {
          if (worksDay(l, d)) setDuty(l.id, d, "BAG");
        }
      });
      paintAfterAssign();
      var msgB = "BAG duties on all WORK days · STSO " + poolStats.stso.total + " LTSO " + poolStats.ltso.total + " TSO " + poolStats.tso.total;
      var hintB = S.$("cert-assign-hint"); if (hintB) hintB.textContent = msgB;
      if (!opts.fromGenerate && S.updateStatus) S.updateStatus(msgB);
      if (!opts.fromGenerate) S.closeFunctionCoverageModal();
      return;
    }

    var dutyCount = {};
    function setDutyDfo(lineId, dayIndex, fn) {
      var key = String(lineId);
      if (!S.state.functionRotation[key]) S.state.functionRotation[key] = [];
      while (S.state.functionRotation[key].length <= dayIndex) S.state.functionRotation[key].push(null);
      if (S.state.functionRotation[key][dayIndex]) return false;
      S.state.functionRotation[key][dayIndex] = fn;
      dutyCount[key] = (dutyCount[key] || 0) + 1;
      return true;
    }
    function getDuty(lineId, dayIndex) {
      var row = S.state.functionRotation[String(lineId)];
      return row ? row[dayIndex] || null : null;
    }
    function bandSlots(band) {
      var start = S.timeToMin(band.start), end = S.timeToMin(band.end);
      if (end <= start) end += 1440;
      var slots = [];
      for (var m = start; m < end; m += 30) slots.push(m % 1440);
      if (!slots.length) slots.push(start % 1440);
      return slots;
    }
    function fairSort(arr) {
      return arr.slice().sort(function (a, b) {
        var ca = dutyCount[String(a.id)] || 0, cb = dutyCount[String(b.id)] || 0;
        if (ca !== cb) return ca - cb;
        return S.lineStartMin(a) - S.lineStartMin(b) || String(a.id).localeCompare(String(b.id));
      });
    }
    function countsAtSlot(d, slotMin) {
      var c = { STSO: 0, LTSO: 0, TSO: 0 };
      S.state.lines.forEach(function (l) {
        if (!worksDay(l, d) || !S.lineCoversSlot(l, d, slotMin)) return;
        var role = S.lineRoleKey(l), duty = getDuty(l.id, d);
        if (role === "STSO" && duty === "DFO") c.STSO++;
        else if (role === "LTSO" && duty === "DFO") c.LTSO++;
        else if (role === "TSO" && duty === "DFO") c.TSO++;
      });
      return c;
    }
    function wouldOvershootEarlierBands(line, d, currentBandStart) {
      var role = S.lineRoleKey(line);
      var bands = fc.bands || [];
      for (var i = 0; i < bands.length; i++) {
        var b = bands[i];
        if (S.timeToMin(b.start) >= currentBandStart) continue;
        var cap = role === "STSO" ? (b.stso || 0) : role === "LTSO" ? (b.ltso || 0) : (b.tso || 0);
        var slots = bandSlots(b);
        for (var s = 0; s < slots.length; s++) {
          if (!S.lineCoversSlot(line, d, slots[s])) continue;
          var have = countsAtSlot(d, slots[s]);
          var n = role === "STSO" ? have.STSO : role === "LTSO" ? have.LTSO : have.TSO;
          if (n >= cap) return true;
        }
      }
      return false;
    }
    function candOk(l, d, bandStart, allowOvershoot) {
      if (!ensureEligible(l).dfo) return false;
      if (getDuty(l.id, d)) return false;
      if (!allowOvershoot && wouldOvershootEarlierBands(l, d, bandStart)) return false;
      return true;
    }
    function fillBandsForDay(d, allowOvershoot) {
      (fc.bands || []).forEach(function (band) {
        var needS = band.stso || 0, needL = band.ltso || 0, needT = band.tso || 0;
        if (needS + needL + needT <= 0) return;
        var slots = bandSlots(band), bandStart = S.timeToMin(band.start), guard = 0, changed = true;
        while (changed && guard < 200) {
          changed = false; guard++;
          for (var si = 0; si < slots.length; si++) {
            var slotMin = slots[si], have = countsAtSlot(d, slotMin);
            var defS = Math.max(0, needS - have.STSO), defL = Math.max(0, needL - have.LTSO), defT = Math.max(0, needT - have.TSO);
            if (defS + defL + defT <= 0) continue;
            var covering = S.state.lines.filter(function (l) { return worksDay(l, d) && S.lineCoversSlot(l, d, slotMin); });
            if (defS > 0) {
              var stsoCands = fairSort(covering.filter(function (l) { return S.lineRoleKey(l) === "STSO" && candOk(l, d, bandStart, allowOvershoot); }));
              for (var i = 0; i < stsoCands.length && defS > 0; i++) { if (setDutyDfo(stsoCands[i].id, d, "DFO")) { defS--; changed = true; } }
            }
            if (defL > 0) {
              function takeL(arr) { for (var i = 0; i < arr.length && defL > 0; i++) { if (setDutyDfo(arr[i].id, d, "DFO")) { defL--; changed = true; } } }
              takeL(fairSort(covering.filter(function (l) { return S.lineRoleKey(l) === "LTSO" && candOk(l, d, bandStart, allowOvershoot); })));
            }
            if (defT > 0) {
              function takeT(arr) { for (var i = 0; i < arr.length && defT > 0; i++) { if (setDutyDfo(arr[i].id, d, "DFO")) { defT--; changed = true; } } }
              takeT(fairSort(covering.filter(function (l) { return S.lineRoleKey(l) === "TSO" && candOk(l, d, bandStart, allowOvershoot); })));
            }
          }
        }
      });
    }
    for (var d = 0; d < days; d++) { fillBandsForDay(d, false); fillBandsForDay(d, true); }
    (S.state.lines || []).forEach(function (l, li) {
      if (!ensureEligible(l).dfo) return;
      l.function = "DFO";
      var workIdx = 0;
      for (var di = 0; di < days; di++) {
        if (!worksDay(l, di)) continue;
        if (!getDuty(l.id, di)) {
          var mix = ((workIdx + li) % 2 === 0) ? "DFO" : "PAX";
          setDutyDfo(l.id, di, mix);
        }
        workIdx++;
      }
    });
    var shortfalls = [];
    for (var d2 = 0; d2 < Math.min(7, days); d2++) {
      (fc.bands || []).forEach(function (band) {
        var needS = band.stso || 0, needL = band.ltso || 0, needT = band.tso || 0;
        if (needS + needL + needT <= 0) return;
        var worst = { STSO: 99, LTSO: 99, TSO: 99 };
        bandSlots(band).forEach(function (slotMin) {
          var c = countsAtSlot(d2, slotMin);
          if (c.STSO < worst.STSO) worst.STSO = c.STSO;
          if (c.LTSO < worst.LTSO) worst.LTSO = c.LTSO;
          if (c.TSO < worst.TSO) worst.TSO = c.TSO;
        });
        var miss = [];
        if (worst.STSO < needS) miss.push("STSO " + worst.STSO + "/" + needS);
        if (worst.LTSO < needL) miss.push("LTSO " + worst.LTSO + "/" + needL);
        if (worst.TSO < needT) miss.push("TSO " + worst.TSO + "/" + needT);
        if (miss.length) shortfalls.push((S.DAYS[d2 % 7] || d2) + " " + band.start + "-" + band.end + ": " + miss.join(", "));
      });
    }
    paintAfterAssign();
    var msg = "DFO mix · STSO " + poolStats.stso.total + " LTSO " + poolStats.ltso.total + " TSO " + poolStats.tso.total;
    if (shortfalls.length) {
      msg += " SHORT " + shortfalls.length + " day/band(s)";
      if (S.state.issues) { shortfalls.slice(0, 10).forEach(function (s) { S.state.issues.push("DFO band: " + s); }); if (S.renderIssues) S.renderIssues(); }
    } else msg += " all band minimums met";
    var hint = S.$("cert-assign-hint"); if (hint) hint.textContent = msg;
    if (!opts.fromGenerate && S.updateStatus) S.updateStatus(msg);
    if (!opts.fromGenerate) S.closeFunctionCoverageModal();
  };
  S.generateFcAssignments = S.generateFunctionAssignments;
  S.clearLineFunctions = function () {
    (S.state.lines || []).forEach(function (l) { l.function = ""; l.functionEligible = { dfo: false, bag: false, pax: false }; });
    S.state.functionRotation = {};
  };
  S.initFunctionCoverage = function () {
    if (S._funcCoverageBound) return;
    S._funcCoverageBound = true;
    S.ensureFunctionCoverage();
    S.fillFunctionCoverageForm();
    var openBtn = S.$("btn-open-func-coverage"); if (openBtn) openBtn.addEventListener("click", S.openFunctionCoverageModal);
    var closeBtn = S.$("func-coverage-close"); if (closeBtn) closeBtn.addEventListener("click", S.closeFunctionCoverageModal);
    var cancelBtn = S.$("fc-cancel"); if (cancelBtn) cancelBtn.addEventListener("click", S.closeFunctionCoverageModal);
    var saveBtn = S.$("fc-save");
    if (saveBtn) saveBtn.addEventListener("click", function () {
      S.readFunctionBandsFromDom(); S.syncFunctionModeUi(); S.renderFunctionBandsTable(); S.updateFunctionCoveragePreview();
      if (S.updateStatus) S.updateStatus("Function coverage settings saved.");
    });
    var genBtn = S.$("fc-generate"); if (genBtn) genBtn.addEventListener("click", function () { S.generateFunctionAssignments(); });
    var addBtn = S.$("fc-add-band");
    if (addBtn) addBtn.addEventListener("click", function () {
      S.readFunctionBandsFromDom();
      S.ensureFunctionCoverage().bands.push({ start: "12:00", end: "16:00", stso: 0, ltso: 0, tso: 0 });
      S.renderFunctionBandsTable(); S.updateFunctionCoveragePreview();
    });
    document.addEventListener("click", function (e) {
      var t = e.target; if (!t || !t.getAttribute) return;
      var rm = t.getAttribute("data-fc-remove"); if (rm == null) return;
      S.readFunctionBandsFromDom();
      var idx = +rm, bands = S.ensureFunctionCoverage().bands;
      if (idx >= 0 && idx < bands.length) { bands.splice(idx, 1); S.renderFunctionBandsTable(); S.updateFunctionCoveragePreview(); }
    });
    document.addEventListener("change", function (e) {
      var t = e.target; if (!t) return;
      if (t.id === "fc-mode-dfo" || t.id === "fc-mode-bag") {
        var fc = S.ensureFunctionCoverage();
        if (t.id === "fc-mode-dfo" && t.checked) { fc.mode = "dfo"; setChk("fc-mode-bag", false); }
        else if (t.id === "fc-mode-bag" && t.checked) { fc.mode = "bag"; setChk("fc-mode-dfo", false); }
        else fc.mode = "none";
        S.syncFunctionModeUi(); S.updateFunctionCoveragePreview();
        return;
      }
      if ((t.getAttribute && t.getAttribute("data-fc-band") != null) || (t.id && t.id.indexOf("fc-") === 0)) {
        S.readFunctionBandsFromDom(); S.updateFunctionCoveragePreview();
      }
    });
  };
})(window.Scheduler);
