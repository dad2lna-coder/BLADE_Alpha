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

  var POOL_KEYS = [
    "poolStsoBagM", "poolStsoBagF", "poolLtsoBagM", "poolLtsoBagF", "poolTsoBagM", "poolTsoBagF",
    "poolStsoDfoM", "poolStsoDfoF", "poolLtsoDfoM", "poolLtsoDfoF", "poolTsoDfoM", "poolTsoDfoF"
  ];
  function bagPoolTotal(fc) {
    return num0(fc.poolStsoBagM) + num0(fc.poolStsoBagF) + num0(fc.poolLtsoBagM) + num0(fc.poolLtsoBagF) +
      num0(fc.poolTsoBagM) + num0(fc.poolTsoBagF);
  }
  function dfoPoolTotal(fc) {
    return num0(fc.poolStsoDfoM) + num0(fc.poolStsoDfoF) + num0(fc.poolLtsoDfoM) + num0(fc.poolLtsoDfoF) +
      num0(fc.poolTsoDfoM) + num0(fc.poolTsoDfoF);
  }
  function syncDerivedMode(fc) {
    var bag = bagPoolTotal(fc) > 0, dfo = dfoPoolTotal(fc) > 0;
    fc.poolBag = bagPoolTotal(fc);
    fc.poolStsoDfo = num0(fc.poolStsoDfoM) + num0(fc.poolStsoDfoF);
    fc.poolLtsoDfo = num0(fc.poolLtsoDfoM) + num0(fc.poolLtsoDfoF);
    fc.poolTsoDfo = num0(fc.poolTsoDfoM) + num0(fc.poolTsoDfoF);
    fc.mode = bag && dfo ? "both" : bag ? "bag" : dfo ? "dfo" : "none";
    return fc.mode;
  }
  S.fteCapsByRoleSex = function () {
    var st = S.state || {};
    return {
      STSO: { M: num0(st.stsoM), F: num0(st.stsoF) },
      LTSO: { M: num0(st.ltsoM), F: num0(st.ltsoF) },
      TSO: { M: num0(st.ftM) + num0(st.ptM), F: num0(st.ftF) + num0(st.ptF) }
    };
  };
  S.ensureFunctionCoverage = function () {
    if (!S.state.functionCoverage) S.state.functionCoverage = {};
    var fc = S.state.functionCoverage;
    ["poolStsoDfoM","poolStsoDfoF","poolLtsoDfoM","poolLtsoDfoF","poolTsoDfoM","poolTsoDfoF",
     "poolStsoBagM","poolStsoBagF","poolLtsoBagM","poolLtsoBagF","poolTsoBagM","poolTsoBagF"].forEach(function (k) {
      if (fc[k] == null) fc[k] = 0;
    });
    if (fc.poolStsoDfo == null) fc.poolStsoDfo = num0(fc.poolStsoDfoM) + num0(fc.poolStsoDfoF);
    if (fc.poolLtsoDfo == null) fc.poolLtsoDfo = num0(fc.poolLtsoDfoM) + num0(fc.poolLtsoDfoF);
    if (fc.poolTsoDfo == null) fc.poolTsoDfo = num0(fc.poolTsoDfoM) + num0(fc.poolTsoDfoF);
    if (fc.poolBag == null) fc.poolBag = bagPoolTotal(fc);
    if (!fc.poolStsoDfoM && !fc.poolStsoDfoF && fc.poolStsoDfo) fc.poolStsoDfoM = fc.poolStsoDfo;
    if (!fc.poolLtsoDfoM && !fc.poolLtsoDfoF && fc.poolLtsoDfo) fc.poolLtsoDfoM = fc.poolLtsoDfo;
    if (!fc.poolTsoDfoM && !fc.poolTsoDfoF && fc.poolTsoDfo) fc.poolTsoDfoM = fc.poolTsoDfo;
    if (!fc.poolTsoBagM && !fc.poolTsoBagF && fc.poolBag) fc.poolTsoBagM = fc.poolBag;
    if (fc.amPmSplit == null) fc.amPmSplit = true;
    if (fc.phaseThresholdMin == null) fc.phaseThresholdMin = 15;
    if (!Array.isArray(fc.bands) || !fc.bands.length) fc.bands = defaultBands();
    delete fc.stsoIsDfo; delete fc.poolDfo; delete fc.poolPax;
    if (!S.state.functionRotation) S.state.functionRotation = {};
    syncDerivedMode(fc);
    return fc;
  };

  S.getFunctionMode = function () {
    return syncDerivedMode(S.ensureFunctionCoverage());
  };

  S.syncFunctionModeUi = function () {
    var fc = S.ensureFunctionCoverage();
    setVal("fc-pool-bag-stso-m", fc.poolStsoBagM); setVal("fc-pool-bag-stso-f", fc.poolStsoBagF);
    setVal("fc-pool-bag-ltso-m", fc.poolLtsoBagM); setVal("fc-pool-bag-ltso-f", fc.poolLtsoBagF);
    setVal("fc-pool-bag-tso-m", fc.poolTsoBagM); setVal("fc-pool-bag-tso-f", fc.poolTsoBagF);
    setVal("fc-pool-dfo-stso-m", fc.poolStsoDfoM); setVal("fc-pool-dfo-stso-f", fc.poolStsoDfoF);
    setVal("fc-pool-dfo-ltso-m", fc.poolLtsoDfoM); setVal("fc-pool-dfo-ltso-f", fc.poolLtsoDfoF);
    setVal("fc-pool-dfo-tso-m", fc.poolTsoDfoM); setVal("fc-pool-dfo-tso-f", fc.poolTsoDfoF);
    var wrap = S.$("fc-bands-wrap");
    var add = S.$("fc-add-band");
    if (wrap) wrap.style.display = "";
    if (add) add.style.display = "";
  };

  S.fillFunctionCoverageForm = function () {
    var fc = S.ensureFunctionCoverage();
    setVal("fc-phase-thr", fc.phaseThresholdMin); setChk("fc-ampm-split", fc.amPmSplit);
    S.syncFunctionModeUi();
    S.renderFunctionBandsTable(); S.updateFunctionCoveragePreview();
    if (S.renderExtraPositions) S.renderExtraPositions();
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
    if (!line) return "TSO";
    if (line.isExtra || line.extraPositionId) return line.empClass || line.position || "EXTRA";
    if (line.isStso || line.empClass === "STSO") return "STSO";
    if (line.isLtso || line.empClass === "LTSO") return "LTSO";
    return "TSO";
  };
  S.isOpsFunctionRole = function (line) {
    var role = S.lineRoleKey(line);
    return role === "STSO" || role === "LTSO" || role === "TSO";
  };
  S.lineIsDfoTagged = function (line) {
    if (!line) return false;
    if (line.isExtra || line.extraPositionId) return false;
    return line.function === "DFO" || !!(line.functionEligible && line.functionEligible.dfo);
  };
  S.getRotationDuty = function (lineId, dayIndex) {
    var rot = S.state.functionRotation || {};
    var row = rot[String(lineId)] || rot[lineId];
    if (row) {
      var cell = row[dayIndex];
      if (cell == null || cell === "") return null;
      return cell;
    }
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
    function take(id, key) { var n = readNum(id); if (n != null) fc[key] = n; }
    take("fc-pool-bag-stso-m", "poolStsoBagM"); take("fc-pool-bag-stso-f", "poolStsoBagF");
    take("fc-pool-bag-ltso-m", "poolLtsoBagM"); take("fc-pool-bag-ltso-f", "poolLtsoBagF");
    take("fc-pool-bag-tso-m", "poolTsoBagM"); take("fc-pool-bag-tso-f", "poolTsoBagF");
    take("fc-pool-dfo-stso-m", "poolStsoDfoM"); take("fc-pool-dfo-stso-f", "poolStsoDfoF");
    take("fc-pool-dfo-ltso-m", "poolLtsoDfoM"); take("fc-pool-dfo-ltso-f", "poolLtsoDfoF");
    take("fc-pool-dfo-tso-m", "poolTsoDfoM"); take("fc-pool-dfo-tso-f", "poolTsoDfoF");
    syncDerivedMode(fc);
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
    var fc = S.ensureFunctionCoverage();
    var anchors = S.computeShiftAnchors();
    var bandTxt = (fc.bands || []).map(function (b) {
      return (b.start || "?") + "-" + (b.end || "?") + " bag-need " + (b.stso || 0) + "-" + (b.ltso || 0) + "-" + (b.tso || 0);
    }).join(" | ");
    el.textContent = "BAG STSO " + fc.poolStsoBagM + "/" + fc.poolStsoBagF +
      " LTSO " + fc.poolLtsoBagM + "/" + fc.poolLtsoBagF +
      " TSO " + fc.poolTsoBagM + "/" + fc.poolTsoBagF +
      " \u00b7 DFO STSO " + fc.poolStsoDfoM + "/" + fc.poolStsoDfoF +
      " LTSO " + fc.poolLtsoDfoM + "/" + fc.poolLtsoDfoF +
      " TSO " + fc.poolTsoDfoM + "/" + fc.poolTsoDfoF +
      " \u00b7 AM " + S.slotLabel(anchors.am) + " PM " + S.slotLabel(anchors.pm) + " " + (bandTxt || "no bands");
  };
  function ensureEligible(line) {
    if (!line.functionEligible || typeof line.functionEligible !== "object") line.functionEligible = { dfo: false, bag: false, pax: false };
    return line.functionEligible;
  }
  S.capFunctionPoolsToFte = function (fc, issues) {
    fc = fc || S.ensureFunctionCoverage();
    var caps = S.fteCapsByRoleSex();
    function capPair(role, bagMKey, bagFKey, dfoMKey, dfoFKey) {
      var capM = caps[role].M, capF = caps[role].F;
      var reqBagM = num0(fc[bagMKey]), reqBagF = num0(fc[bagFKey]);
      var reqDfoM = num0(fc[dfoMKey]), reqDfoF = num0(fc[dfoFKey]);
      if (reqBagM > capM) { if (issues) issues.push("BAG " + role + " M pool " + reqBagM + " exceeds FTE " + capM + " \u2014 capped."); reqBagM = capM; }
      if (reqBagF > capF) { if (issues) issues.push("BAG " + role + " F pool " + reqBagF + " exceeds FTE " + capF + " \u2014 capped."); reqBagF = capF; }
      var remM = Math.max(0, capM - reqBagM), remF = Math.max(0, capF - reqBagF);
      if (reqDfoM > remM) { if (issues) issues.push("DFO " + role + " M pool " + reqDfoM + " exceeds remaining FTE " + remM + " after BAG \u2014 capped."); reqDfoM = remM; }
      if (reqDfoF > remF) { if (issues) issues.push("DFO " + role + " F pool " + reqDfoF + " exceeds remaining FTE " + remF + " after BAG \u2014 capped."); reqDfoF = remF; }
      fc[bagMKey] = reqBagM; fc[bagFKey] = reqBagF; fc[dfoMKey] = reqDfoM; fc[dfoFKey] = reqDfoF;
    }
    capPair("STSO", "poolStsoBagM", "poolStsoBagF", "poolStsoDfoM", "poolStsoDfoF");
    capPair("LTSO", "poolLtsoBagM", "poolLtsoBagF", "poolLtsoDfoM", "poolLtsoDfoF");
    capPair("TSO", "poolTsoBagM", "poolTsoBagF", "poolTsoDfoM", "poolTsoDfoF");
    syncDerivedMode(fc);
    return fc;
  };

  S.buildCertifiedPools = function (fc) {
    S.state.lines.forEach(function (l) {
      if (l.isExtra || l.extraPositionId) return;
      l.functionEligible = { dfo: false, bag: false, pax: false }; l.function = "";
    });
    var anchors = S.computeShiftAnchors(), thr = fc.phaseThresholdMin || 15;
    function unused(role, sex) {
      return S.state.lines.filter(function (l) {
        if (l.isExtra || l.extraPositionId) return false;
        var el = ensureEligible(l);
        return S.lineRoleKey(l) === role && l.sex === sex && !el.bag && !el.dfo;
      });
    }
    function markBag(role, sex, n) {
      if (!n || n <= 0) return { total: 0 };
      var lines = unused(role, sex).slice();
      lines.sort(function (a, b) { return S.lineStartMin(a) - S.lineStartMin(b) || String(a.id).localeCompare(String(b.id)); });
      var taken = 0;
      for (var i = 0; i < lines.length && taken < n; i++) { ensureEligible(lines[i]).bag = true; taken++; }
      return { total: taken };
    }
    function markDfo(role, sex, n) {
      if (!n || n <= 0) return { am: 0, pm: 0, total: 0 };
      var lines = unused(role, sex).slice();
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
          var el = ensureEligible(arr[i]); if (el.bag || el.dfo) continue; el.dfo = true; taken++;
        }
        return taken;
      }
      var gotAm = take(amSide, needAm), gotPm = take(pmSide, needPm), short = n - gotAm - gotPm;
      if (short > 0) gotPm += take(unused(role, sex), short);
      return { am: gotAm, pm: gotPm, total: gotAm + gotPm };
    }
    var bag = {
      stso: { m: markBag("STSO", "M", fc.poolStsoBagM).total, f: markBag("STSO", "F", fc.poolStsoBagF).total },
      ltso: { m: markBag("LTSO", "M", fc.poolLtsoBagM).total, f: markBag("LTSO", "F", fc.poolLtsoBagF).total },
      tso: { m: markBag("TSO", "M", fc.poolTsoBagM).total, f: markBag("TSO", "F", fc.poolTsoBagF).total }
    };
    bag.stso.total = bag.stso.m + bag.stso.f;
    bag.ltso.total = bag.ltso.m + bag.ltso.f;
    bag.tso.total = bag.tso.m + bag.tso.f;
    var dfo = {
      stso: markDfo("STSO", "M", fc.poolStsoDfoM), stsoF: markDfo("STSO", "F", fc.poolStsoDfoF),
      ltso: markDfo("LTSO", "M", fc.poolLtsoDfoM), ltsoF: markDfo("LTSO", "F", fc.poolLtsoDfoF),
      tso: markDfo("TSO", "M", fc.poolTsoDfoM), tsoF: markDfo("TSO", "F", fc.poolTsoDfoF)
    };
    return {
      bag: bag,
      stso: { total: dfo.stso.total + dfo.stsoF.total, am: dfo.stso.am + dfo.stsoF.am, pm: dfo.stso.pm + dfo.stsoF.pm },
      ltso: { total: dfo.ltso.total + dfo.ltsoF.total, am: dfo.ltso.am + dfo.ltsoF.am, pm: dfo.ltso.pm + dfo.ltsoF.pm },
      tso: { total: dfo.tso.total + dfo.tsoF.total, am: dfo.tso.am + dfo.tsoF.am, pm: dfo.tso.pm + dfo.tsoF.pm },
      anchors: anchors
    };
  };

  function paintAfterAssign() {
    if (S.renderCoverageBars) S.renderCoverageBars();
    if (S.renderReports) S.renderReports();
    window.dispatchEvent(new CustomEvent("lines:request-render"));
    if (!S.__USE_SVELTE_LINES && S.renderLines) S.renderLines();
  }

  S.generateFunctionAssignments = function (opts) {
    opts = opts || {};
    var fc = opts.fromGenerate ? S.ensureFunctionCoverage() : S.readFunctionBandsFromDom();
    if (!S.state.issues) S.state.issues = [];
    S.capFunctionPoolsToFte(fc, S.state.issues);
    S.state.functionRotation = {};
    (S.state.lines || []).forEach(function (l) {
      if (l.isExtra || l.extraPositionId) return;
      l.function = "";
      l.functionEligible = { dfo: false, bag: false, pax: false };
    });
    if (!S.state.lines || !S.state.lines.length) {
      paintAfterAssign();
      if (!opts.fromGenerate && S.updateStatus) S.updateStatus("Generate lines first.");
      return;
    }
    var poolStats = S.buildCertifiedPools(fc);
    var days = (S.state.weekCount || 1) * 7;
    var bagFillCount = {};
    function setDuty(lineId, dayIndex, fn) {
      var key = String(lineId);
      if (!S.state.functionRotation[key]) S.state.functionRotation[key] = [];
      while (S.state.functionRotation[key].length <= dayIndex) S.state.functionRotation[key].push(null);
      S.state.functionRotation[key][dayIndex] = fn;
      return true;
    }
    function getDuty(lineId, dayIndex) {
      var row = S.state.functionRotation[String(lineId)];
      if (!row) return null;
      var cell = row[dayIndex];
      if (cell == null || cell === "") return null;
      return cell;
    }
    function worksDay(line, d) {
      var sched = S.state.schedule[line.id] || S.state.schedule[String(line.id)] || [];
      return sched[d] === "WORK";
    }
    function bandSlots(band) {
      var start = S.timeToMin(band.start), end = S.timeToMin(band.end);
      if (end <= start) end += 1440;
      var slots = [];
      for (var m = start; m < end; m += 30) slots.push(m % 1440);
      if (!slots.length) slots.push(start % 1440);
      return slots;
    }
    function coversBand(line, d, band) {
      var slots = bandSlots(band);
      for (var i = 0; i < slots.length; i++) if (S.lineCoversSlot(line, d, slots[i])) return true;
      return false;
    }
    (S.state.lines || []).forEach(function (l) {
      if (!ensureEligible(l).bag) return;
      l.function = "BAG";
      for (var d = 0; d < days; d++) if (worksDay(l, d)) setDuty(l.id, d, "BAG");
    });
    (S.state.lines || []).forEach(function (l) {
      if (ensureEligible(l).bag) return;
      if (ensureEligible(l).dfo) l.function = "DFO";
    });
    function countBagRole(d, band, role) {
      var n = 0;
      (S.state.lines || []).forEach(function (l) {
        if (S.lineRoleKey(l) !== role) return;
        if (!worksDay(l, d) || !coversBand(l, d, band)) return;
        if (getDuty(l.id, d) === "BAG") n++;
      });
      return n;
    }
    function fillBandShortfalls(d) {
      (fc.bands || []).forEach(function (band) {
        [["STSO", band.stso || 0], ["LTSO", band.ltso || 0], ["TSO", band.tso || 0]].forEach(function (pair) {
          var role = pair[0], need = pair[1];
          if (need <= 0) return;
          var short = need - countBagRole(d, band, role);
          if (short <= 0) return;
          var cands = (S.state.lines || []).filter(function (l) {
            if (!ensureEligible(l).dfo) return false;
            if (S.lineRoleKey(l) !== role) return false;
            if (!worksDay(l, d) || !coversBand(l, d, band)) return false;
            if (getDuty(l.id, d) === "BAG") return false;
            return true;
          }).sort(function (a, b) {
            var ca = bagFillCount[String(a.id)] || 0, cb = bagFillCount[String(b.id)] || 0;
            if (ca !== cb) return ca - cb;
            return S.lineStartMin(a) - S.lineStartMin(b) || String(a.id).localeCompare(String(b.id));
          });
          for (var i = 0; i < cands.length && short > 0; i++) {
            setDuty(cands[i].id, d, "BAG");
            bagFillCount[String(cands[i].id)] = (bagFillCount[String(cands[i].id)] || 0) + 1;
            short--;
          }
        });
      });
    }
    for (var d = 0; d < days; d++) fillBandShortfalls(d);
    (S.state.lines || []).forEach(function (l) {
      if (l.isExtra || l.extraPositionId) return;
      if (ensureEligible(l).bag) return;
      if (ensureEligible(l).dfo) {
        for (var di = 0; di < days; di++) {
          if (!worksDay(l, di)) continue;
          if (!getDuty(l.id, di)) setDuty(l.id, di, "PAX");
        }
        return;
      }
      ensureEligible(l).pax = true;
      l.function = "PAX";
      for (var dj = 0; dj < days; dj++) if (worksDay(l, dj)) setDuty(l.id, dj, "PAX");
    });
    var shortfalls = [];
    for (var d2 = 0; d2 < Math.min(7, days); d2++) {
      (fc.bands || []).forEach(function (band) {
        var miss = [];
        [["STSO", band.stso || 0], ["LTSO", band.ltso || 0], ["TSO", band.tso || 0]].forEach(function (pair) {
          var role = pair[0], need = pair[1];
          if (need <= 0) return;
          var have = countBagRole(d2, band, role);
          if (have < need) miss.push(role + " " + have + "/" + need);
        });
        if (miss.length) shortfalls.push((S.DAYS[d2 % 7] || d2) + " " + band.start + "-" + band.end + ": " + miss.join(", "));
      });
    }
    if (shortfalls.length) {
      shortfalls.slice(0, 10).forEach(function (msg) { S.state.issues.push("Baggage band short: " + msg); });
      if (S.renderIssues) S.renderIssues();
    }
    paintAfterAssign();
    var msg = "BAG " + (poolStats.bag.stso.total + poolStats.bag.ltso.total + poolStats.bag.tso.total) +
      " \u00b7 DFO " + (poolStats.stso.total + poolStats.ltso.total + poolStats.tso.total) + " \u00b7 leftover PAX";
    if (shortfalls.length) msg += " \u00b7 SHORT " + shortfalls.length + " day/band(s)";
    var hint = S.$("cert-assign-hint"); if (hint) hint.textContent = msg;
    if (!opts.fromGenerate && S.updateStatus) S.updateStatus(msg);
    if (!opts.fromGenerate) S.closeFunctionCoverageModal();
  };

  function defaultExtraBands() {
    return [{ start: "04:00", end: "20:30", min: 1 }];
  }
  S.ensureExtraPositions = function () {
    if (!Array.isArray(S.state.extraPositions)) S.state.extraPositions = [];
    S.state.extraPositions.forEach(function (pos, i) {
      if (!pos.id) pos.id = "extra-" + (i + 1);
      if (!pos.name) pos.name = "Position";
      pos.m = num0(pos.m); pos.f = num0(pos.f);
      if (!Array.isArray(pos.bands) || !pos.bands.length) pos.bands = defaultExtraBands();
    });
    return S.state.extraPositions;
  };
  S.readExtraPositionsFromDom = function () {
    var list = S.ensureExtraPositions();
    list.forEach(function (pos) {
      var nameEl = document.querySelector('[data-extra-name="' + pos.id + '"]');
      var mEl = document.querySelector('[data-extra-m="' + pos.id + '"]');
      var fEl = document.querySelector('[data-extra-f="' + pos.id + '"]');
      if (nameEl) pos.name = String(nameEl.value || pos.name).trim() || pos.name;
      if (mEl) pos.m = num0(mEl.value);
      if (fEl) pos.f = num0(fEl.value);
      if (!Array.isArray(pos.bands)) pos.bands = defaultExtraBands();
      for (var i = 0; i < pos.bands.length; i++) {
        var b = pos.bands[i] || {};
        ["start", "end", "min"].forEach(function (field) {
          var el = document.querySelector('[data-extra-band="' + pos.id + '"][data-extra-bi="' + i + '"][data-extra-bf="' + field + '"]');
          if (!el) return;
          if (field === "min") b[field] = num0(el.value);
          else b[field] = el.value || b[field];
        });
        pos.bands[i] = b;
      }
    });
    return list;
  };
  S.renderExtraPositions = function () {
    var host = S.$("extra-pos-list");
    if (!host) return;
    var list = S.ensureExtraPositions();
    host.innerHTML = list.map(function (pos) {
      var rows = (pos.bands || []).map(function (b, i) {
        return "<tr>" +
          '<td><input type="time" data-extra-band="' + pos.id + '" data-extra-bi="' + i + '" data-extra-bf="start" value="' + (b.start || "04:00") + '" step="900"></td>' +
          '<td><input type="time" data-extra-band="' + pos.id + '" data-extra-bi="' + i + '" data-extra-bf="end" value="' + (b.end || "20:30") + '" step="900"></td>' +
          '<td><input type="number" min="0" max="99" data-extra-band="' + pos.id + '" data-extra-bi="' + i + '" data-extra-bf="min" value="' + (b.min != null ? b.min : 0) + '" style="width:3.5rem"></td>' +
          '<td><button type="button" class="btn btn-red btn-sm" data-extra-band-remove="' + pos.id + '" data-extra-bi="' + i + '">\u2715</button></td></tr>';
      }).join("");
      return '<div class="extra-pos-card" data-extra-card="' + pos.id + '">' +
        '<div class="fte-sex-row extra-pos-head">' +
        '<label>Name <input type="text" data-extra-name="' + pos.id + '" value="' + String(pos.name || "").replace(/"/g, "&quot;") + '" style="width:7rem"></label>' +
        '<label>Male <input type="number" min="0" data-extra-m="' + pos.id + '" value="' + num0(pos.m) + '" style="width:4.5rem"></label>' +
        '<label>Female <input type="number" min="0" data-extra-f="' + pos.id + '" value="' + num0(pos.f) + '" style="width:4.5rem"></label>' +
        '<button type="button" class="btn btn-red btn-sm" data-extra-remove="' + pos.id + '">Remove</button>' +
        '<button type="button" class="btn btn-sm" data-extra-add-band="' + pos.id + '">+ Band</button></div>' +
        '<div class="lines-scroll extra-pos-bands"><table class="data-table"><thead><tr><th>Start</th><th>End</th><th>Min</th><th></th></tr></thead><tbody>' +
        rows + "</tbody></table></div></div>";
    }).join("");
  };
  S.addExtraPosition = function (name) {
    S.readExtraPositionsFromDom();
    var list = S.ensureExtraPositions();
    list.push({ id: "extra-" + Date.now() + "-" + (list.length + 1), name: name || "MSTI", m: 0, f: 0, bands: defaultExtraBands() });
    S.renderExtraPositions();
  };
  S.buildExtraPositionLines = function () {
    var out = [];
    var list = S.ensureExtraPositions();
    var shifts = S.state.shifts || [];
    var fallback = shifts[0] || { id: "", name: "Shift", start: "04:00", end: "20:30", paid: 8, rdoHard: [] };
    list.forEach(function (pos, pi) {
      var total = num0(pos.m) + num0(pos.f);
      if (!total) return;
      if (!pos.bands || !pos.bands.length) S.state.issues.push((pos.name || "Position") + ": no coverage bands.");
      var idBase = 30000 + pi * 1000, made = 0;
      function pushSex(sex, count) {
        for (var i = 0; i < count; i++) {
          var def = shifts[made % Math.max(1, shifts.length)] || fallback;
          var workDays = (+def.paid || 8) >= 10 ? 4 : 5;
          var rdoCount = 7 - workDays;
          var hard = Array.isArray(def.rdoHard) ? def.rdoHard.map(Number).filter(function (x) { return x >= 0 && x <= 6; }) : [];
          var rdoDays = hard.length ? hard.slice(0, rdoCount) : (S.consecutiveRdos ? S.consecutiveRdos(rdoCount, (idBase + made) % 7) : [0, 6]);
          while (rdoDays.length < rdoCount) {
            for (var d = 0; d < 7 && rdoDays.length < rdoCount; d++) if (rdoDays.indexOf(d) < 0) rdoDays.push(d);
          }
          out.push({
            id: idBase + made + 1,
            lineCode: String(pos.name || "POS") + " " + String(made + 1).padStart(2, "0"),
            shiftId: def.id, shiftName: def.name,
            shiftLabel: S.shiftLabel ? S.shiftLabel(def) : ((def.start || "") + "-" + (def.end || "")),
            empClass: pos.name || "EXTRA", position: pos.name || "EXTRA",
            isLtso: false, isStso: false, isExtra: true, extraPositionId: pos.id,
            sex: sex, function: "", rdoDays: rdoDays, rdoHard: hard.length > 0, paid: def.paid || 8
          });
          made++;
        }
      }
      pushSex("M", num0(pos.m));
      pushSex("F", num0(pos.f));
    });
    return out;
  };

  S.clearLineFunctions = function () {
    (S.state.lines || []).forEach(function (l) { l.function = ""; l.functionEligible = { dfo: false, bag: false, pax: false }; });
    S.state.functionRotation = {};
  };
  S.initFunctionCoverage = function () {
    if (S._funcCoverageBound) return;
    S._funcCoverageBound = true;
    S.ensureFunctionCoverage();
    S.ensureExtraPositions();
    S.fillFunctionCoverageForm();
    S.renderExtraPositions();
    var openBtn = S.$("btn-open-func-coverage"); if (openBtn) openBtn.addEventListener("click", S.openFunctionCoverageModal);
    var closeBtn = S.$("func-coverage-close"); if (closeBtn) closeBtn.addEventListener("click", S.closeFunctionCoverageModal);
    var cancelBtn = S.$("fc-cancel"); if (cancelBtn) cancelBtn.addEventListener("click", S.closeFunctionCoverageModal);
    var saveBtn = S.$("fc-save");
    if (saveBtn) saveBtn.addEventListener("click", function () {
      S.readFunctionBandsFromDom(); S.syncFunctionModeUi(); S.renderFunctionBandsTable(); S.updateFunctionCoveragePreview();
      if (S.updateStatus) S.updateStatus("Function coverage settings saved.");
    });
    var addBtn = S.$("fc-add-band");
    if (addBtn && !addBtn._fcBound) {
      addBtn._fcBound = true;
      addBtn.addEventListener("click", function (e) {
        if (e && e.preventDefault) e.preventDefault();
        S.readFunctionBandsFromDom();
        S.ensureFunctionCoverage().bands.push({ start: "12:00", end: "16:00", stso: 0, ltso: 0, tso: 0 });
        S.renderFunctionBandsTable(); S.updateFunctionCoveragePreview();
      });
    }
    if (!S._funcDocBound) {
      S._funcDocBound = true;
      document.addEventListener("click", function (e) {
        var t = e.target; if (!t || !t.getAttribute) return;
        var rm = t.getAttribute("data-fc-remove"); if (rm == null) return;
        S.readFunctionBandsFromDom();
        var idx = +rm, bands = S.ensureFunctionCoverage().bands;
        if (idx >= 0 && idx < bands.length) { bands.splice(idx, 1); S.renderFunctionBandsTable(); S.updateFunctionCoveragePreview(); }
      });
      document.addEventListener("change", function (e) {
        var t = e.target; if (!t) return;
        if ((t.getAttribute && t.getAttribute("data-fc-band") != null) || (t.id && t.id.indexOf("fc-") === 0)) {
          S.readFunctionBandsFromDom(); S.updateFunctionCoveragePreview();
        }
      });
    }

    var addPos = S.$("btn-add-position");
    if (addPos && !addPos._extraBound) {
      addPos._extraBound = true;
      addPos.addEventListener("click", function (e) { e.preventDefault(); S.addExtraPosition("MSTI"); });
    }
    if (!S._extraDocBound) {
      S._extraDocBound = true;
      document.addEventListener("click", function (e) {
        var t = e.target; if (!t || !t.getAttribute) return;
        var rid = t.getAttribute("data-extra-remove");
        if (rid) {
          S.readExtraPositionsFromDom();
          S.state.extraPositions = S.ensureExtraPositions().filter(function (pos) { return pos.id !== rid; });
          S.renderExtraPositions();
          return;
        }
        var addB = t.getAttribute("data-extra-add-band");
        if (addB) {
          S.readExtraPositionsFromDom();
          var pos = S.ensureExtraPositions().filter(function (x) { return x.id === addB; })[0];
          if (pos) { if (!pos.bands) pos.bands = []; pos.bands.push({ start: "12:00", end: "16:00", min: 0 }); S.renderExtraPositions(); }
          return;
        }
        var rmB = t.getAttribute("data-extra-band-remove");
        if (rmB) {
          S.readExtraPositionsFromDom();
          var pos2 = S.ensureExtraPositions().filter(function (x) { return x.id === rmB; })[0];
          var bi = +t.getAttribute("data-extra-bi");
          if (pos2 && pos2.bands && bi >= 0 && bi < pos2.bands.length) { pos2.bands.splice(bi, 1); S.renderExtraPositions(); }
        }
      });
      document.addEventListener("change", function (e) {
        var t = e.target;
        if (t && t.getAttribute && (t.getAttribute("data-extra-name") || t.getAttribute("data-extra-m") || t.getAttribute("data-extra-f") || 