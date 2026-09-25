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

function extraOps(line) {
  return !!(line && (line.isExtra || line.extraPositionId) && line.opsFte);
}

export function lineCertPosition(line) {
  if (!line) return "";
  if (line.isExtra || line.extraPositionId) {
    if (!line.opsFte) return "";
    return String(line.extraName || line.position || "").trim();
  }
  if (line.isStso || line.empClass === "STSO") return "STSO";
  if (line.isLtso || line.empClass === "LTSO") return "LTSO";
  if (line.empClass === "FT" || line.empClass === "PT" || line.empClass === "TSO" || !line.empClass) {
    return "TSO";
  }
  return "";
}

export function isOpsCertLine(line) {
  var pos = lineCertPosition(line);
  return !!pos;
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

function parseMin(v, timeToMin) {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof timeToMin === "function") {
    var n = timeToMin(v);
    if (Number.isFinite(n)) return n;
  }
  var s = String(v || "");
  var m = s.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return 0;
  return (+m[1]) * 60 + (+m[2]);
}

function lineWorksDay(line, day, schedule) {
  if (!schedule) return true;
  var arr = schedule[line.id] || schedule[String(line.id)];
  if (!Array.isArray(arr) || !arr.length) return true;
  return (arr[day] || "RDO") === "WORK";
}

function shiftWindow(line, ctx) {
  var sh = ctx.getShift ? ctx.getShift(line.shiftId) : null;
  var start = parseMin(sh && sh.start, ctx.timeToMin);
  var end = parseMin(sh && sh.end, ctx.timeToMin);
  if (end <= start) end += 24 * 60;
  return { start: start, end: end };
}

function coversHour(line, day, hour, ctx) {
  if (!lineWorksDay(line, day, ctx.schedule)) return false;
  var win = shiftWindow(line, ctx);
  var h = hour;
  if (h < win.start && win.end > 24 * 60) h += 24 * 60;
  return h >= win.start && h < win.end;
}

function dayOpenClose(day, ctx) {
  var open = ctx.openMin;
  var close = ctx.closeMin;
  if (ctx.dayHours && ctx.dayHours[day]) {
    open = parseMin(ctx.dayHours[day].open, ctx.timeToMin);
    close = parseMin(ctx.dayHours[day].close, ctx.timeToMin);
  }
  if (!Number.isFinite(open)) open = 0;
  if (!Number.isFinite(close) || close <= open) close = open + 24 * 60;
  return { open: open, close: close };
}

function hourList(ctx, slice) {
  var hours = [];
  var seen = {};
  for (var d = 0; d < 7; d++) {
    var oc = dayOpenClose(d, ctx);
    var start = oc.open;
    var end = oc.close;
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      slice.forEach(function (line) {
        var win = shiftWindow(line, ctx);
        if (win.start < start || start === 0) start = win.start;
        if (win.end > end) end = win.end;
      });
    }
    for (var h = start; h < end; h += 60) {
      var key = d + ":" + h;
      if (seen[key]) continue;
      seen[key] = true;
      hours.push({ day: d, hour: h });
    }
  }
  return hours;
}

function hourIsShort(slot, slice, cfg, ctx) {
  var present = [];
  slice.forEach(function (line) {
    if (coversHour(line, slot.day, slot.hour, ctx)) present.push(line);
  });
  if (!present.length) return false;
  var haveB = present.filter(function (l) { return l.certPool === "B"; }).length;
  var needB = Math.ceil(present.length * (cfg.targetBPercent / 100) - 1e-9);
  return haveB < needB;
}

function fillSliceByHour(slice, cfg, ctx) {
  slice.forEach(function (line) {
    var mapped = mappedPoolForFunction(line.function, cfg);
    line.certPool = mapped || "";
  });
  var slots = hourList(ctx, slice);
  var guard = 0;
  var max = slice.length * 8;
  while (guard++ < max) {
    var shortSlots = slots.filter(function (slot) {
      return hourIsShort(slot, slice, cfg, ctx);
    });
    if (!shortSlots.length) break;
    var best = null;
    var bestScore = 0;
    slice.forEach(function (line) {
      if (line.certPool) return;
      var score = 0;
      shortSlots.forEach(function (slot) {
        if (coversHour(line, slot.day, slot.hour, ctx)) score++;
      });
      if (score > bestScore) {
        bestScore = score;
        best = line;
      } else if (score === bestScore && score > 0 && best && (line.id || 0) < (best.id || 0)) {
        best = line;
      }
    });
    if (!best || bestScore <= 0) break;
    best.certPool = "B";
  }
  slice.forEach(function (line) {
    if (!line.certPool) line.certPool = "A";
  });
}

export function assignCertPoolsToLines(lines, cfg, shiftStartMin) {
  cfg = normalizeCertPoolConfig(cfg);
  var list = Array.isArray(lines) ? lines : [];
  var ctx = typeof shiftStartMin === "function"
    ? { startMinOf: shiftStartMin, schedule: null, getShift: null, timeToMin: null, openMin: 0, closeMin: 24 * 60, dayHours: null }
    : (shiftStartMin && typeof shiftStartMin === "object" ? shiftStartMin : {});
  if (!ctx.startMinOf) {
    ctx.startMinOf = function () { return 0; };
  }
  var slices = {};

  list.forEach(function (line) {
    if (!line) return;
    if (line.isExtra || line.extraPositionId) {
      if (!line.opsFte) {
        line.certPool = "";
        return;
      }
    }
    var key = certSliceKey(line);
    if (!key) {
      line.certPool = "";
      return;
    }
    if (!slices[key]) slices[key] = [];
    slices[key].push(line);
  });

  Object.keys(slices).forEach(function (key) {
    fillSliceByHour(slices[key], cfg, ctx);
  });

  list.forEach(function (line) {
    if (!line) return;
    var extra = !!(line.isExtra || line.extraPositionId);
    if (extra && !line.opsFte) {
      line.certPool = "";
      return;
    }
    if (!extra && !line.certPool) line.certPool = "A";
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
  var openMin = S.timeToMin && S.state.open ? S.timeToMin(S.state.open) : 0;
  var closeMin = S.timeToMin && S.state.close ? S.timeToMin(S.state.close) : 24 * 60;
  assignCertPoolsToLines(S.state.lines || [], S.state.certPool, {
    startMinOf: function (line) {
      if (S.getShift && S.timeToMin) {
        var sh = S.getShift(line.shiftId);
        return sh ? S.timeToMin(sh.start) : 0;
      }
      return 0;
    },
    getShift: S.getShift,
    timeToMin: S.timeToMin,
    schedule: S.state.schedule || {},
    openMin: openMin,
    closeMin: closeMin,
    dayHours: S.state.useDynamicHours ? S.state.dayHours : null
  });
}

export function attachCertPools(S) {
  if (!S) return;
  S.defaultCertPoolConfig = defaultCertPoolConfig;
  S.normalizeCertPoolConfig = normalizeCertPoolConfig;
  S.ensureCertPoolConfig = function () { return ensureCertPoolConfig(S); };
  S.readCertPoolFromDom = function () { return readCertPoolFromDom(S); };
  S.fillCertPoolForm = function () { return fillCertPoolForm(S); };
  S.assignCertPools = function () { return assignCertPools(S); };
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
