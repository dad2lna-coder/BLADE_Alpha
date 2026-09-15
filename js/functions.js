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

  S.fteCapsByRoleSex = function () {
    var st = S.state || {};
    return {
      STSO: { M: num0(st.stsoM), F: num0(st.stsoF) },
      LTSO: { M: num0(st.ltsoM), F: num0(st.ltsoF) },
      TSO: { M: num0(st.ftM) + num0(st.ptM), F: num0(st.ftF) + num0(st.ptF) }
    };
  };

  function syncDerivedMode(fc) {
    var bag = bagPoolTotal(fc) > 0;
    var dfo = dfoPoolTotal(fc) > 0;
    fc.poolBag = bagPoolTotal(fc);
    fc.poolStsoDfo = num0(fc.poolStsoDfoM) + num0(fc.poolStsoDfoF);
    fc.poolLtsoDfo = num0(fc.poolLtsoDfoM) + num0(fc.poolLtsoDfoF);
    fc.poolTsoDfo = num0(fc.poolTsoDfoM) + num0(fc.poolTsoDfoF);
    if (bag && dfo) fc.mode = "both";
    else if (bag) fc.mode = "bag";
    else if (dfo) fc.mode = "dfo";
    else fc.mode = "none";
    return fc.mode;
  }

  S.ensureFunctionCoverage = function () {
    if (!S.state.functionCoverage) S.state.functionCoverage = {};
    var fc = S.state.functionCoverage;
    POOL_KEYS.forEach(function (k) {
      if (fc[k] == null) fc[k] = 0;
    });
    if (fc.poolStsoDfo == null) fc.poolStsoDfo = num0(fc.poolStsoDfoM) + num0(fc.poolStsoDfoF);
    if (fc.poolLtsoDfo == null) fc.poolLtsoDfo = num0(fc.poolLtsoDfoM) + num0(fc.poolLtsoDfoF);
    if (fc.poolTsoDfo == null) fc.poolTsoDfo = num0(fc.poolTsoDfoM) + num0(fc.poolTsoDfoF);
    if (fc.poolBag == null) fc.poolBag = bagPoolTotal(fc);
    if (!fc.poolStsoDfoM && !fc.poolStsoDfoF && fc.poolStsoDfo) fc.poolStsoDfoM = fc.poolStsoDfo;
    if (!fc.poolLtsoDfoM && !fc.poolLtsoDfoF && fc.poolLtsoDfo) fc.poolLtsoDfoM = fc.poolLtsoDfo;
    if (!fc.poolTsoDfoM && !fc.poolTsoDfoF && fc.poolTsoDfo) fc.poolTsoDfoM = fc.poolTsoDfo;
    if (!fc.poolTsoBagM && !fc.poolTsoBagF && !fc.poolStsoBagM && !fc.poolLtsoBagM && fc.poolBag) fc.poolTsoBagM = fc.poolBag;
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
  };
