/** Cert pool config + Generate assignment. Legacy assignCertifications is unused. */

export function defaultCertPoolConfig() {
  return {
    pools: ["A", "B"],
    targetBPercent: 45,
    functionMap: { DFO: "B", BAG: "", PAX: "" }
  };
}

export function normalizeCertPoolConfig(raw) {
  var seed = defaultCertPoolConfig();
  if (!raw || typeof raw !== "object") return seed;
  var pools = Array.isArray(raw.pools)
    ? raw.pools.map(function (p) { return String(p == null ? "" : p).trim(); }).filter(Boolean)
    : seed.pools.slice();
  if (pools.indexOf("A") < 0) pools.unshift("A");
  if (pools.indexOf("B") < 0) pools.push("B");
  var pct = Number(raw.targetBPercent);
  if (!Number.isFinite(pct)) pct = seed.targetBPercent;
  pct = Math.max(0, Math.min(100, pct));
  var mapIn = raw.functionMap && typeof raw.functionMap === "object" ? raw.functionMap : {};
  var functionMap = {
    DFO: normalizeMapTarget(mapIn.DFO, seed.functionMap.DFO),
    BAG: normalizeMapTarget(mapIn.BAG, seed.functionMap.BAG),
    PAX: normalizeMapTarget(mapIn.PAX, seed.functionMap.PAX)
  };
  return { pools: pools, targetBPercent: pct, functionMap: functionMap };
}

function normalizeMapTarget(value, fallback) {
  if (value == null || value === "") return fallback == null ? "" : fallback;
  var s = String(value).trim();
  if (!s || s.toLowerCase() === "none") return "";
  return s;
}

export function normalizeCertPoolLabel(raw) {
  if (raw == null) return "";
  return String(raw).trim();
}

export function lineCertPosition(line) {
  if (!line) return "";
  if (line.isExtra || line.extraPositionId) return "";
  if (line.isStso || line.empClass === "STSO") return "STSO";
  if (line.isLtso || line.empClass === "LTSO") return "LTSO";
  if (line.empClass === "FT" || line.empClass === "PT" || line.empClass === "TSO" || !line.empClass) {
    return "TSO";
  }
  return "";
}

export function isOpsCertLine(line) {
  var pos = lineCertPosition(line);
  return pos === "STSO" || pos === "LTSO" || pos === "TSO";
}

export function certSliceKey(line) {
  var pos = lineCertPosition(line);
  if (!pos) return "";
  var sex = line && line.sex === "F" ? "F" : "M";
  return pos + ":" + sex;
}

function mappedPoolForFunction(fn, cfg) {
  var key = String(fn || "").toUpperCase();
  if (key !== "DFO" && key !== "BAG" && key !== "PAX") return "";
  var mapped = cfg && cfg.functionMap ? cfg.functionMap[key] : "";
  return mapped ? String(mapped) : "";
}

export function assignCertPoolsToLines(lines, cfg, shiftStartMin) {
  cfg = normalizeCertPoolConfig(cfg);
  var list = Array.isArray(lines) ? lines : [];
  var startMinOf = typeof shiftStartMin === "function" ? shiftStartMin : function () { return 0; };
  var slices = {};

  list.forEach(function (line) {
    if (!line) return;
    if (!isOpsCertLine(line)) {
      line.certPool = "";
      return;
    }
    var key = certSliceKey(line);
    if (!slices[key]) slices[key] = [];
    slices[key].push(line);
  });

  Object.keys(slices).forEach(function (key) {
    var slice = slices[key];
    var n = slice.length;
    var needB = Math.round(n * (cfg.targetBPercent / 100));
    slice.forEach(function (line) {
      var mapped = mappedPoolForFunction(line.function, cfg);
      line.certPool = mapped || "";
    });
    var haveB = slice.filter(function (l) { return l.certPool === "B"; }).length;
    if (haveB < needB) {
      var rest = slice.filter(function (l) { return l.certPool !== "B"; });
      rest.sort(function (a, b) {
        var sa = startMinOf(a);
        var sb = startMinOf(b);
        if (sa !== sb) return sa - sb;
        return (a.id || 0) - (b.id || 0);
      });
      var want = needB - haveB;
      for (var i = 0; i < rest.length && i < want; i++) rest[i].certPool = "B";
    }
    slice.forEach(function (line) {
      if (!line.certPool) line.certPool = "A";
    });
  });
  return list;
}

export function ensureCertPoolConfig(S) {
  if (!S.state) S.state = {};
  S.state.certPool = normalizeCertPoolConfig(S.state.certPool);
  return S.state.certPool;
}

export function readCertPoolFromDom(S) {
  ensureCertPoolConfig(S);
  var pctEl = typeof document !== "undefined" ? document.getElementById("cfg-cert-pool-b-pct") : null;
  var dfoEl = typeof document !== "undefined" ? document.getElementById("cfg-cert-map-dfo") : null;
  var bagEl = typeof document !== "undefined" ? document.getElementById("cfg-cert-map-bag") : null;
  var paxEl = typeof document !== "undefined" ? document.getElementById("cfg-cert-map-pax") : null;
  var raw = {
    pools: ["A", "B"],
    targetBPercent: pctEl ? pctEl.value : S.state.certPool.targetBPercent,
    functionMap: {
      DFO: dfoEl ? dfoEl.value : S.state.certPool.functionMap.DFO,
      BAG: bagEl ? bagEl.value : S.state.certPool.functionMap.BAG,
      PAX: paxEl ? paxEl.value : S.state.certPool.functionMap.PAX
    }
  };
  S.state.certPool = normalizeCertPoolConfig(raw);
  return S.state.certPool;
}

export function fillCertPoolForm(S) {
  var cfg = ensureCertPoolConfig(S);
  function put(id, v) {
    if (typeof document === "undefined") return;
    var el = document.getElementById(id);
    if (el && v != null) el.value = v;
  }
  put("cfg-cert-pool-b-pct", cfg.targetBPercent);
  put("cfg-cert-map-dfo", cfg.functionMap.DFO || "none");
  put("cfg-cert-map-bag", cfg.functionMap.BAG || "none");
  put("cfg-cert-map-pax", cfg.functionMap.PAX || "none");
}

export function assignCertPools(S) {
  if (!S || !S.state) return;
  ensureCertPoolConfig(S);
  if (typeof document !== "undefined" && document.getElementById("cfg-cert-pool-b-pct")) {
    readCertPoolFromDom(S);
  }
  assignCertPoolsToLines(S.state.lines || [], S.state.certPool, function (line) {
    if (S.getShift && S.timeToMin) {
      var sh = S.getShift(line.shiftId);
      return sh ? S.timeToMin(sh.start) : 0;
    }
    return 0;
  });
}

export function attachCertPools(S) {
  if (!S) return;
  S.defaultCertPoolConfig = defaultCertPoolConfig;
  S.normalizeCertPoolConfig = normalizeCertPoolConfig;
  S.ensureCertPoolConfig = ensureCertPoolConfig;
  S.readCertPoolFromDom = readCertPoolFromDom;
  S.fillCertPoolForm = fillCertPoolForm;
  S.assignCertPools = assignCertPools;
  S.assignCertPoolsToLines = assignCertPoolsToLines;
  ensureCertPoolConfig(S);
}

/** Legacy cert max form — kept with Setup because generate still can call it. */
export function readCertConfigFromDom(S) {
  var dfoEl = document.getElementById("cfg-cert-dfo");
  var paxEl = document.getElementById("cfg-cert-pax");
  var bagEl = document.getElementById("cfg-cert-bag");
  var dfoOn = document.getElementById("cfg-cert-dfo-on");
  var bagOn = document.getElementById("cfg-cert-bag-on");
  S.state.certDfoMax = Math.max(0, Math.floor(+(dfoEl && dfoEl.value) || 0));
  S.state.certPaxMax = Math.max(0, Math.floor(+(paxEl && paxEl.value) || 0));
  S.state.certBagMax = Math.max(0, Math.floor(+(bagEl && bagEl.value) || 0));
  S.state.certDfoEnabled = !dfoOn || !!dfoOn.checked;
  S.state.certBagEnabled = !bagOn || !!bagOn.checked;
}

export function clearLineFunctions(S) {
  (S.state.lines || []).forEach(function (l) { l.function = ""; });
}

export function assignCertifications(S) {
  readCertConfigFromDom(S);
  if (!S.state.lines || !S.state.lines.length) {
    if (S.updateStatus) S.updateStatus("Generate lines first, then assign certifications.");
    return;
  }
  clearLineFunctions(S);
  var need = [];
  if (S.state.certDfoEnabled && S.state.certDfoMax > 0) {
    for (var i = 0; i < S.state.certDfoMax; i++) need.push("DFO");
  }
  if (S.state.certPaxMax > 0) {
    for (var j = 0; j < S.state.certPaxMax; j++) need.push("PAX");
  }
  if (S.state.certBagEnabled && S.state.certBagMax > 0) {
    for (var k = 0; k < S.state.certBagMax; k++) need.push("BAG");
  }
  if (!need.length) {
    if (S.renderLines) S.renderLines();
    if (S.updateStatus) S.updateStatus("No certification targets (max 0 or disabled). Functions cleared.");
    return;
  }
  var eligible = S.state.lines.filter(function (l) {
    return !l.isStso && !l.isLtso && l.empClass !== "STSO" && l.empClass !== "LTSO";
  });
  eligible.sort(function (a, b) {
    var sa = S.getShift ? S.getShift(a.shiftId) : null;
    var sb = S.getShift ? S.getShift(b.shiftId) : null;
    var ma = sa ? S.timeToMin(sa.start) : 0;
    var mb = sb ? S.timeToMin(sb.start) : 0;
    if (ma !== mb) return ma - mb;
    if (a.sex !== b.sex) return a.sex === "F" ? -1 : 1;
    return (a.id || 0) - (b.id || 0);
  });
  var assigned = { DFO: 0, PAX: 0, BAG: 0 };
  var used = {};
  var ei = 0;
  need.forEach(function (fn) {
    var tries = 0;
    while (tries < eligible.length) {
      var line = eligible[ei % eligible.length];
      ei++; tries++;
      if (!line || used[line.id]) continue;
      if (line.function) continue;
      line.function = fn;
      used[line.id] = true;
      assigned[fn]++;
      return;
    }
  });
  if (S.renderLines) S.renderLines();
  if (S.renderTeams) S.renderTeams();
  var hint = document.getElementById("cert-assign-hint");
  var msg = "Assigned DFO " + assigned.DFO + " \u00b7 PAX " + assigned.PAX + " \u00b7 BAG " + assigned.BAG + " (schedules unchanged)";
  if (hint) hint.textContent = msg;
  if (S.updateStatus) S.updateStatus(msg);
}
