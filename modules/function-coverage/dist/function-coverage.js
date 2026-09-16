let D = null;
function ht(t) {
  D = t;
}
function v(t) {
  return Math.max(0, Math.floor(+t || 0));
}
function j(t) {
  return v(t.poolStsoBagM) + v(t.poolStsoBagF) + v(t.poolLtsoBagM) + v(t.poolLtsoBagF) + v(t.poolTsoBagM) + v(t.poolTsoBagF);
}
function J(t) {
  return v(t.poolStsoDfoM) + v(t.poolStsoDfoF) + v(t.poolLtsoDfoM) + v(t.poolLtsoDfoF) + v(t.poolTsoDfoM) + v(t.poolTsoDfoF);
}
function C() {
  D.state.functionCoverage || (D.state.functionCoverage = {});
  var t = D.state.functionCoverage;
  return [
    "poolStsoDfoM",
    "poolStsoDfoF",
    "poolLtsoDfoM",
    "poolLtsoDfoF",
    "poolTsoDfoM",
    "poolTsoDfoF",
    "poolStsoBagM",
    "poolStsoBagF",
    "poolLtsoBagM",
    "poolLtsoBagF",
    "poolTsoBagM",
    "poolTsoBagF"
  ].forEach(function(o) {
    t[o] == null && (t[o] = 0);
  }), t.poolStsoDfo == null && (t.poolStsoDfo = v(t.poolStsoDfoM) + v(t.poolStsoDfoF)), t.poolLtsoDfo == null && (t.poolLtsoDfo = v(t.poolLtsoDfoM) + v(t.poolLtsoDfoF)), t.poolTsoDfo == null && (t.poolTsoDfo = v(t.poolTsoDfoM) + v(t.poolTsoDfoF)), t.poolBag == null && (t.poolBag = j(t)), !t.poolStsoDfoM && !t.poolStsoDfoF && t.poolStsoDfo && (t.poolStsoDfoM = t.poolStsoDfo), !t.poolLtsoDfoM && !t.poolLtsoDfoF && t.poolLtsoDfo && (t.poolLtsoDfoM = t.poolLtsoDfo), !t.poolTsoDfoM && !t.poolTsoDfoF && t.poolTsoDfo && (t.poolTsoDfoM = t.poolTsoDfo), !t.poolTsoBagM && !t.poolTsoBagF && t.poolBag && (t.poolTsoBagM = t.poolBag), t.amPmSplit == null && (t.amPmSplit = !0), t.phaseThresholdMin == null && (t.phaseThresholdMin = 15), t.bias == null && (t.bias = "none"), (!Array.isArray(t.bands) || !t.bands.length) && (t.bands = Mt()), delete t.stsoIsDfo, delete t.poolDfo, delete t.poolPax, D.state.functionRotation || (D.state.functionRotation = {}), K(t), t;
}
function bt() {
  return K(C());
}
function it() {
  var t = D.state || {};
  return {
    STSO: { M: v(t.stsoM), F: v(t.stsoF) },
    LTSO: { M: v(t.ltsoM), F: v(t.ltsoF) },
    TSO: { M: v(t.ftM) + v(t.ptM), F: v(t.ftF) + v(t.ptF) }
  };
}
function st(t, o) {
  t = t || C();
  var n = it();
  function r(a, i, e, l, f) {
    var d = n[a].M, s = n[a].F, c = v(t[i]), p = v(t[e]), m = v(t[l]), S = v(t[f]);
    c > d && (o && o.push("BAG " + a + " M pool " + c + " exceeds FTE " + d + " — capped."), c = d), p > s && (o && o.push("BAG " + a + " F pool " + p + " exceeds FTE " + s + " — capped."), p = s);
    var b = Math.max(0, d - c), g = Math.max(0, s - p);
    m > b && (o && o.push("DFO " + a + " M pool " + m + " exceeds remaining FTE " + b + " after BAG — capped."), m = b), S > g && (o && o.push("DFO " + a + " F pool " + S + " exceeds remaining FTE " + g + " after BAG — capped."), S = g), t[i] = c, t[e] = p, t[l] = m, t[f] = S;
  }
  return r("STSO", "poolStsoBagM", "poolStsoBagF", "poolStsoDfoM", "poolStsoDfoF"), r("LTSO", "poolLtsoBagM", "poolLtsoBagF", "poolLtsoDfoM", "poolLtsoDfoF"), r("TSO", "poolTsoBagM", "poolTsoBagF", "poolTsoDfoM", "poolTsoDfoF"), K(t), t;
}
function K(t) {
  var o = j(t) > 0, n = J(t) > 0;
  return t.poolBag = j(t), t.poolStsoDfo = v(t.poolStsoDfoM) + v(t.poolStsoDfoF), t.poolLtsoDfo = v(t.poolLtsoDfoM) + v(t.poolLtsoDfoF), t.poolTsoDfo = v(t.poolTsoDfoM) + v(t.poolTsoDfoF), t.mode = o && n ? "both" : o ? "bag" : n ? "dfo" : "none", t;
}
function ft(t) {
  t = t || C();
  var o = D.state.lines || [];
  o.forEach(function(s) {
    s.isExtra || s.extraPositionId || (s.functionEligible = { dfo: !1, bag: !1, pax: !1 }, s.function = "");
  });
  var n = D.computeShiftAnchors(), r = t.phaseThresholdMin || 15;
  function a(s) {
    return (!s.functionEligible || typeof s.functionEligible != "object") && (s.functionEligible = { dfo: !1, bag: !1, pax: !1 }), s.functionEligible;
  }
  function i(s, c) {
    return o.filter(function(p) {
      if (p.isExtra || p.extraPositionId) return !1;
      var m = a(p);
      return D.lineRoleKey(p) === s && p.sex === c && !m.bag && !m.dfo;
    });
  }
  function e(s, c, p) {
    if (!p || p <= 0) return { total: 0 };
    var m = i(s, c).slice();
    m.sort(function(g, M) {
      return D.lineStartMin(g) - D.lineStartMin(M) || String(g.id).localeCompare(String(M.id));
    });
    for (var S = 0, b = 0; b < m.length && S < p; b++)
      a(m[b]).bag = !0, S++;
    return { total: S };
  }
  function l(s, c, p) {
    if (!p || p <= 0) return { am: 0, pm: 0, total: 0 };
    var m = i(s, c).slice();
    m.sort(function(A, y) {
      return D.lineStartMin(A) - D.lineStartMin(y) || String(A.id).localeCompare(String(y.id));
    });
    var S = m.filter(function(A) {
      return D.isAmSide(D.lineStartMin(A), n, r);
    }), b = m.filter(function(A) {
      return !D.isAmSide(D.lineStartMin(A), n, r);
    }), g = t.bands || [], M = g[0], x = g[g.length - 1];
    function T(A, y) {
      if (!y) return !1;
      var w = D.timeToMin(y.start), R = D.getShift(A.shiftId);
      if (!R) return !1;
      var _ = D.timeToMin(R.start), U = D.timeToMin(R.end);
      return U <= _ && (U += 1440), w >= _ && w < U;
    }
    S.sort(function(A, y) {
      var w = T(A, M) ? 0 : 1, R = T(y, M) ? 0 : 1;
      return w !== R ? w - R : D.lineStartMin(A) - D.lineStartMin(y) || String(A.id).localeCompare(String(y.id));
    }), b.sort(function(A, y) {
      var w = T(A, x) ? 0 : 1, R = T(y, x) ? 0 : 1;
      return w !== R ? w - R : D.lineStartMin(A) - D.lineStartMin(y) || String(A.id).localeCompare(String(y.id));
    });
    var F = t.amPmSplit ? Math.ceil(p / 2) : p, E = t.amPmSplit ? Math.floor(p / 2) : 0;
    for (S.length < F && (E += F - S.length, F = S.length), b.length < E && (F = Math.min(S.length, F + (E - b.length)), E = b.length); F + E > p; )
      if (E >= F && E > 0) E--;
      else if (F > 0) F--;
      else break;
    function O(A, y) {
      for (var w = 0, R = 0; R < A.length && w < y; R++) {
        var _ = a(A[R]);
        _.bag || _.dfo || (_.dfo = !0, w++);
      }
      return w;
    }
    var k = O(S, F), I = O(b, E), nt = p - k - I;
    return nt > 0 && (I += O(i(s, c), nt)), { am: k, pm: I, total: k + I };
  }
  var f = {
    stso: { m: e("STSO", "M", t.poolStsoBagM).total, f: e("STSO", "F", t.poolStsoBagF).total },
    ltso: { m: e("LTSO", "M", t.poolLtsoBagM).total, f: e("LTSO", "F", t.poolLtsoBagF).total },
    tso: { m: e("TSO", "M", t.poolTsoBagM).total, f: e("TSO", "F", t.poolTsoBagF).total }
  };
  f.stso.total = f.stso.m + f.stso.f, f.ltso.total = f.ltso.m + f.ltso.f, f.tso.total = f.tso.m + f.tso.f;
  var d = {
    stso: l("STSO", "M", t.poolStsoDfoM),
    stsoF: l("STSO", "F", t.poolStsoDfoF),
    ltso: l("LTSO", "M", t.poolLtsoDfoM),
    ltsoF: l("LTSO", "F", t.poolLtsoDfoF),
    tso: l("TSO", "M", t.poolTsoDfoM),
    tsoF: l("TSO", "F", t.poolTsoDfoF)
  };
  return {
    bag: f,
    stso: { total: d.stso.total + d.stsoF.total, am: d.stso.am + d.stsoF.am, pm: d.stso.pm + d.stsoF.pm },
    ltso: { total: d.ltso.total + d.ltsoF.total, am: d.ltso.am + d.ltsoF.am, pm: d.ltso.pm + d.ltsoF.pm },
    tso: { total: d.tso.total + d.tsoF.total, am: d.tso.am + d.tsoF.am, pm: d.tso.pm + d.tsoF.pm },
    anchors: n
  };
}
function Mt() {
  return [
    { start: "03:30", end: "04:00", stso: 1, ltso: 1, tso: 2 },
    { start: "04:00", end: "20:30", stso: 1, ltso: 1, tso: 6 },
    { start: "20:30", end: "23:00", stso: 1, ltso: 1, tso: 3 }
  ];
}
const Rt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagPoolTotal: j,
  bindPoolsApi: ht,
  buildCertifiedPools: ft,
  capFunctionPoolsToFte: st,
  dfoPoolTotal: J,
  ensureFunctionCoverage: C,
  fteCapsByRoleSex: it,
  getFunctionMode: bt
}, Symbol.toStringTag, { value: "Module" }));
let B = null;
function wt(t) {
  B = t;
}
function z(t) {
  return t ? t.isExtra || t.extraPositionId ? t.empClass || t.position || "EXTRA" : t.isStso || t.empClass === "STSO" ? "STSO" : t.isLtso || t.empClass === "LTSO" ? "LTSO" : "TSO" : "TSO";
}
function $t(t) {
  var o = z(t);
  return o === "STSO" || o === "LTSO" || o === "TSO";
}
function kt(t) {
  return !t || t.isExtra || t.extraPositionId ? !1 : t.function === "DFO" || !!(t.functionEligible && t.functionEligible.dfo);
}
function Tt(t, o) {
  var n = B.state.functionRotation || {}, r = n[String(t)] || n[t];
  if (r) {
    var a = r[o];
    return a == null || a === "" ? null : a;
  }
  var i = null;
  if (B.state && Array.isArray(B.state.lines)) {
    for (var e = 0; e < B.state.lines.length; e++)
      if (String(B.state.lines[e].id) === String(t)) {
        i = B.state.lines[e];
        break;
      }
  }
  return i && (i.function === "BAG" || i.function === "DFO" || i.function === "PAX") ? i.function : null;
}
function $(t) {
  var o = B.getShift(t.shiftId);
  return o ? B.timeToMin(o.start) : 0;
}
function at(t, o, n) {
  return n = n ?? 15, o = o || Q(), t <= o.am - n && t < 11 * 60 ? "Opening" : t >= o.pm + n && t >= 11 * 60 + 15 ? "Closing" : t < o.pm ? "AM" : "PM";
}
function et(t, o, n) {
  return at(t, o, n) === "Opening" || at(t, o, n) === "AM";
}
function V(t, o, n) {
  var r = B.state.schedule[t.id] || B.state.schedule[String(t.id)];
  if (!r || r[o] !== "WORK") return !1;
  var a = o % 7, i = B.getEffectiveShiftTimes ? B.getEffectiveShiftTimes(t.shiftId, a) : null;
  if (!i) {
    var e = B.getShift(t.shiftId);
    if (!e) return !1;
    i = { start: e.start, end: e.end };
  }
  var l = B.timeToMin(i.start), f = B.timeToMin(i.end);
  return f <= l ? n >= l || n < f : n >= l && n < f;
}
function Gt(t, o) {
  o = o || B.ensureFunctionCoverage().bands;
  for (var n = 0; n < o.length; n++) {
    var r = o[n], a = B.timeToMin(r.start), i = B.timeToMin(r.end);
    i <= a && (i += 1440);
    var e = t;
    if (i > 1440 && e < a && (e += 1440), e >= a && e < i) return r;
  }
  return null;
}
function Q() {
  var t = {};
  (B.state.lines || []).forEach(function(e) {
    var l = B.getShift(e.shiftId);
    if (l) {
      var f = B.timeToMin(l.start);
      t[f] = (t[f] || 0) + 1;
    }
  });
  var o = Object.keys(t).map(function(e) {
    return { min: +e, n: t[e] };
  }).sort(function(e, l) {
    return e.min - l.min;
  });
  if (!o.length) return { am: 8 * 60, pm: 14 * 60 };
  var n = o[0].min, r = 0;
  o.forEach(function(e) {
    e.min < 11 * 60 && e.n > r && (r = e.n, n = e.min);
  });
  var a = o[o.length - 1].min, i = 0;
  return o.forEach(function(e) {
    e.min >= 11 * 60 + 15 && e.n > i && (i = e.n, a = e.min);
  }), i === 0 && o.forEach(function(e) {
    e.min >= 12 * 60 && e.n > i && (i = e.n, a = e.min);
  }), { am: n, pm: a };
}
function It() {
  (B.state.lines || []).forEach(function(t) {
    t.function = "", t.functionEligible = { dfo: !1, bag: !1, pax: !1 };
  }), B.state.functionRotation = {};
}
let h = null;
function Ft(t) {
  h = t;
}
function L(t) {
  return Math.max(0, Math.floor(+t || 0));
}
function P(t, o) {
  const n = h.$(t);
  n && (n.value = o);
}
function Dt(t, o) {
  const n = h.$(t);
  n && (n.checked = !!o);
}
function Bt(t) {
  const o = h.$(t);
  return o ? L(o.value) : null;
}
function lt() {
  const t = C();
  P("fc-pool-bag-stso-m", t.poolStsoBagM), P("fc-pool-bag-stso-f", t.poolStsoBagF), P("fc-pool-bag-ltso-m", t.poolLtsoBagM), P("fc-pool-bag-ltso-f", t.poolLtsoBagF), P("fc-pool-bag-tso-m", t.poolTsoBagM), P("fc-pool-bag-tso-f", t.poolTsoBagF), P("fc-pool-dfo-stso-m", t.poolStsoDfoM), P("fc-pool-dfo-stso-f", t.poolStsoDfoF), P("fc-pool-dfo-ltso-m", t.poolLtsoDfoM), P("fc-pool-dfo-ltso-f", t.poolLtsoDfoF), P("fc-pool-dfo-tso-m", t.poolTsoDfoM), P("fc-pool-dfo-tso-f", t.poolTsoDfoF);
  const o = h.$("fc-bands-wrap"), n = h.$("fc-add-band");
  o && (o.style.display = ""), n && (n.style.display = "");
}
function ut() {
  const t = C();
  P("fc-phase-thr", t.phaseThresholdMin), Dt("fc-ampm-split", t.amPmSplit), P("fc-bias", t.bias || "none"), lt(), pt(), mt(), N && N();
}
function xt() {
  ut();
  const t = h.$("func-coverage-modal");
  t && (t.style.display = "block");
}
function dt() {
  const t = h.$("func-coverage-modal");
  t && (t.style.display = "none");
}
function Et(t) {
  var o = j(t) > 0, n = J(t) > 0;
  return t.poolBag = j(t), t.poolStsoDfo = L(t.poolStsoDfoM) + L(t.poolStsoDfoF), t.poolLtsoDfo = L(t.poolLtsoDfoM) + L(t.poolLtsoDfoF), t.poolTsoDfo = L(t.poolTsoDfoM) + L(t.poolTsoDfoF), t.mode = o && n ? "both" : o ? "bag" : n ? "dfo" : "none", t.mode;
}
function pt() {
  const t = h.$("fc-bands-tbody");
  if (!t) return;
  const o = C().bands;
  t.innerHTML = o.map(function(n, r) {
    function a(i) {
      return '<td><input type="number" min="0" max="99" data-fc-band="' + r + '" data-fc-field="' + i + '" value="' + (n[i] != null ? n[i] : 0) + '" style="width:3.5rem"></td>';
    }
    return '<tr><td><input type="time" data-fc-band="' + r + '" data-fc-field="start" value="' + (n.start || "00:00") + '" step="900"></td><td><input type="time" data-fc-band="' + r + '" data-fc-field="end" value="' + (n.end || "00:00") + '" step="900"></td>' + a("stso") + a("ltso") + a("tso") + '<td><button type="button" class="btn btn-red btn-sm" data-fc-remove="' + r + '">✕</button></td></tr>';
  }).join("");
}
function ct() {
  const t = C();
  function o(f, d) {
    var s = Bt(f);
    s != null && (t[d] = s);
  }
  o("fc-pool-bag-stso-m", "poolStsoBagM"), o("fc-pool-bag-stso-f", "poolStsoBagF"), o("fc-pool-bag-ltso-m", "poolLtsoBagM"), o("fc-pool-bag-ltso-f", "poolLtsoBagF"), o("fc-pool-bag-tso-m", "poolTsoBagM"), o("fc-pool-bag-tso-f", "poolTsoBagF"), o("fc-pool-dfo-stso-m", "poolStsoDfoM"), o("fc-pool-dfo-stso-f", "poolStsoDfoF"), o("fc-pool-dfo-ltso-m", "poolLtsoDfoM"), o("fc-pool-dfo-ltso-f", "poolLtsoDfoF"), o("fc-pool-dfo-tso-m", "poolTsoDfoM"), o("fc-pool-dfo-tso-f", "poolTsoDfoF"), Et(t);
  const n = h.$("fc-phase-thr"), r = h.$("fc-ampm-split");
  n && (t.phaseThresholdMin = L(n.value || 15)), r && (t.amPmSplit = !!r.checked);
  const a = h.$("fc-bias");
  if (a) {
    var i = a.value;
    i === "male" || i === "female" || i === "none" ? t.bias = i : t.bias = "none";
  }
  for (var e = 0; e < t.bands.length; e++) {
    var l = t.bands[e] || {};
    ["start", "end", "stso", "ltso", "tso"].forEach(function(f) {
      var d = document.querySelector('[data-fc-band="' + e + '"][data-fc-field="' + f + '"]');
      d && (f === "start" || f === "end" ? l[f] = d.value || l[f] : l[f] = L(d.value));
    }), t.bands[e] = l;
  }
  return t.bands.sort(function(f, d) {
    return h.timeToMin(f.start) - h.timeToMin(d.start);
  }), t;
}
function mt() {
  const t = h.$("fc-preview");
  if (!t) return;
  const o = C(), n = Q(), r = (o.bands || []).map(function(a) {
    return (a.start || "?") + "-" + (a.end || "?") + " bag-need " + (a.stso || 0) + "-" + (a.ltso || 0) + "-" + (a.tso || 0);
  }).join(" | ");
  t.textContent = "BAG STSO " + o.poolStsoBagM + "/" + o.poolStsoBagF + " LTSO " + o.poolLtsoBagM + "/" + o.poolLtsoBagF + " TSO " + o.poolTsoBagM + "/" + o.poolTsoBagF + " · DFO STSO " + o.poolStsoDfoM + "/" + o.poolStsoDfoF + " LTSO " + o.poolLtsoDfoM + "/" + o.poolLtsoDfoF + " TSO " + o.poolTsoDfoM + "/" + o.poolTsoDfoF + " · AM " + h.slotLabel(n.am) + " PM " + h.slotLabel(n.pm) + " " + (r || "no bands");
}
function Z() {
  return [{ start: "04:00", end: "20:30", min: 1 }];
}
function q() {
  return Array.isArray(h.state.extraPositions) || (h.state.extraPositions = []), h.state.extraPositions.forEach(function(t, o) {
    t.id || (t.id = "extra-" + (o + 1)), t.name || (t.name = "Position"), t.m = L(t.m), t.f = L(t.f), (!Array.isArray(t.bands) || !t.bands.length) && (t.bands = Z());
  }), h.state.extraPositions;
}
function gt() {
  const t = q();
  return t.forEach(function(o) {
    const n = h.$('[data-extra-name="' + o.id + '"]'), r = h.$('[data-extra-m="' + o.id + '"]'), a = h.$('[data-extra-f="' + o.id + '"]');
    n && (o.name = String(n.value || o.name).trim() || o.name), r && (o.m = L(r.value)), a && (o.f = L(a.value)), Array.isArray(o.bands) || (o.bands = Z());
    for (var i = 0; i < o.bands.length; i++) {
      var e = o.bands[i] || {};
      ["start", "end", "min"].forEach(function(l) {
        var f = h.$('[data-extra-band="' + o.id + '"][data-extra-bi="' + i + '"][data-extra-bf="' + l + '"]');
        f && (l === "min" ? e[l] = L(f.value) : e[l] = f.value || e[l]);
      }), o.bands[i] = e;
    }
  }), t;
}
function N() {
  const t = h.$("extra-pos-list");
  if (!t) return;
  const o = q();
  t.innerHTML = o.map(function(n) {
    var r = (n.bands || []).map(function(a, i) {
      return '<tr><td><input type="time" data-extra-band="' + n.id + '" data-extra-bi="' + i + '" data-extra-bf="start" value="' + (a.start || "04:00") + '" step="900"></td><td><input type="time" data-extra-band="' + n.id + '" data-extra-bi="' + i + '" data-extra-bf="end" value="' + (a.end || "20:30") + '" step="900"></td><td><input type="number" min="0" max="99" data-extra-band="' + n.id + '" data-extra-bi="' + i + '" data-extra-bf="min" value="' + (a.min != null ? a.min : 0) + '" style="width:3.5rem"></td><td><button type="button" class="btn btn-red btn-sm" data-extra-band-remove="' + n.id + '" data-extra-bi="' + i + '">✕</button></td></tr>';
    }).join("");
    return '<div class="extra-pos-card" data-extra-card="' + n.id + '"><div class="fte-sex-row extra-pos-head"><label>Name <input type="text" data-extra-name="' + n.id + '" value="' + String(n.name || "").replace(/"/g, "&quot;") + '" style="width:7rem"></label><label>Male <input type="number" min="0" data-extra-m="' + n.id + '" value="' + L(n.m) + '" style="width:4.5rem"></label><label>Female <input type="number" min="0" data-extra-f="' + n.id + '" value="' + L(n.f) + '" style="width:4.5rem"></label><button type="button" class="btn btn-red btn-sm" data-extra-remove="' + n.id + '">Remove</button><button type="button" class="btn btn-sm" data-extra-add-band="' + n.id + '">+ Band</button></div><div class="lines-scroll extra-pos-bands"><table class="data-table"><thead><tr><th>Start</th><th>End</th><th>Min</th><th></th></tr></thead><tbody>' + r + "</tbody></table></div></div>";
  }).join("");
}
function Lt(t) {
  gt();
  var o = q();
  o.push({ id: "extra-" + Date.now() + "-" + (o.length + 1), name: t || "MSTI", m: 0, f: 0, bands: Z() }), N();
}
function At() {
  var t = [], o = q(), n = h.state.shifts || [], r = n[0] || { id: "", name: "Shift", start: "04:00", end: "20:30", paid: 8, rdoHard: [] };
  return o.forEach(function(a, i) {
    var e = L(a.m) + L(a.f);
    if (!e) return;
    (!a.bands || !a.bands.length) && h.state.issues.push((a.name || "Position") + ": no coverage bands.");
    var l = 3e4 + i * 1e3, f = 0;
    function d(s, c) {
      for (var p = 0; p < c; p++) {
        for (var m = n[f % Math.max(1, n.length)] || r, S = (+m.paid || 8) >= 10 ? 4 : 5, b = 7 - S, g = Array.isArray(m.rdoHard) ? m.rdoHard.map(Number).filter(function(T) {
          return T >= 0 && T <= 6;
        }) : [], M = g.length ? g.slice(0, b) : h.consecutiveRdos ? h.consecutiveRdos(b, (l + f) % 7) : [0, 6]; M.length < b; )
          for (var x = 0; x < 7 && M.length < b; x++) M.indexOf(x) < 0 && M.push(x);
        t.push({
          id: l + f + 1,
          lineCode: String(a.name || "POS") + " " + String(f + 1).padStart(2, "0"),
          shiftId: m.id,
          shiftName: m.name,
          shiftLabel: h.shiftLabel ? h.shiftLabel(m) : (m.start || "") + "-" + (m.end || ""),
          empClass: a.name || "EXTRA",
          position: a.name || "EXTRA",
          isLtso: !1,
          isStso: !1,
          isExtra: !0,
          extraPositionId: a.id,
          sex: s,
          function: "",
          rdoDays: M,
          rdoHard: g.length > 0,
          paid: m.paid || 8
        }), f++;
      }
    }
    d("M", L(a.m)), d("F", L(a.f));
  }), t;
}
const _t = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addExtraPosition: Lt,
  bindBandsApi: Ft,
  buildExtraPositionLines: At,
  closeFunctionCoverageModal: dt,
  ensureExtraPositions: q,
  fillFunctionCoverageForm: ut,
  openFunctionCoverageModal: xt,
  readExtraPositionsFromDom: gt,
  readFunctionBandsFromDom: ct,
  renderExtraPositions: N,
  renderFunctionBandsTable: pt,
  syncFunctionModeUi: lt,
  updateFunctionCoveragePreview: mt
}, Symbol.toStringTag, { value: "Module" }));
let u = null;
function Ot(t) {
  u = t;
}
function tt(t) {
  var o = u.timeToMin(t.start), n = u.timeToMin(t.end);
  n <= o && (n += 1440);
  for (var r = [], a = o; a < n; a += 30) r.push(a % 1440);
  return r;
}
function X(t, o) {
  var n = u.state.schedule[t.id] || u.state.schedule[String(t.id)];
  return n ? n[o] === "WORK" : !1;
}
function ot(t, o, n) {
  for (var r = tt(o), a = [], i = 0; i < r.length; i++) a.push(0);
  return (u.state.lines || []).forEach(function(e) {
    if (z(e) === n && !(!X(e, t) || Tt(e.id, t) !== "BAG"))
      for (var l = 0; l < r.length; l++)
        V(e, t, r[l]) && a[l]++;
  }), a;
}
function vt(t, o, n) {
  var r = tt(o);
  if (!r.length) return 0;
  for (var a = ot(t, o, n), i = a[0], e = 1; e < a.length; e++) a[e] < i && (i = a[e]);
  return i;
}
function G(t) {
  return (!t.functionEligible || typeof t.functionEligible != "object") && (t.functionEligible = { dfo: !1, bag: !1, pax: !1 }), t.functionEligible;
}
function W(t, o, n) {
  var r = u.state.lines || [];
  return r.filter(function(a) {
    if (a.isExtra || a.extraPositionId) return !1;
    var i = G(a);
    return z(a) === t && a.sex === o && !i.bag && !i.dfo;
  });
}
function yt(t, o, n, r) {
  if (!n || n <= 0) return { total: 0 };
  r = r || C();
  var a = W(t, o).slice();
  a.sort(function(l, f) {
    return $(l) - $(f) || String(l.id).localeCompare(String(f.id));
  });
  for (var i = 0, e = 0; e < a.length && i < n; e++)
    G(a[e]).bag = !0, i++;
  return { total: i };
}
function Pt(t, o, n, r) {
  if (!n || n <= 0) return { am: 0, pm: 0, total: 0 };
  r = r || C();
  var a = Q(), i = r.phaseThresholdMin || 15, e = W(t, o).slice();
  e.sort(function(T, F) {
    return $(T) - $(F) || String(T.id).localeCompare(String(F.id));
  });
  var l = e.filter(function(T) {
    return et($(T), a, i);
  }), f = e.filter(function(T) {
    return !et($(T), a, i);
  }), d = r.bands || [], s = d[0], c = d[d.length - 1];
  function p(T, F) {
    if (!F) return !1;
    var E = u.timeToMin(F.start), O = u.getShift(T.shiftId);
    if (!O) return !1;
    var k = u.timeToMin(O.start), I = u.timeToMin(O.end);
    return I <= k && (I += 1440), E >= k && E < I;
  }
  l.sort(function(T, F) {
    var E = p(T, s) ? 0 : 1, O = p(F, s) ? 0 : 1;
    return E !== O ? E - O : $(T) - $(F) || String(T.id).localeCompare(String(F.id));
  }), f.sort(function(T, F) {
    var E = p(T, c) ? 0 : 1, O = p(F, c) ? 0 : 1;
    return E !== O ? E - O : $(T) - $(F) || String(T.id).localeCompare(String(F.id));
  });
  var m = r.amPmSplit ? Math.ceil(n / 2) : n, S = r.amPmSplit ? Math.floor(n / 2) : 0;
  for (l.length < m && (S += m - l.length, m = l.length), f.length < S && (m = Math.min(l.length, m + (S - f.length)), S = f.length); m + S > n; )
    if (S >= m && S > 0) S--;
    else if (m > 0) m--;
    else break;
  function b(T, F) {
    for (var E = 0, O = 0; O < T.length && E < F; O++) {
      var k = G(T[O]);
      k.bag || k.dfo || (k.dfo = !0, E++);
    }
    return E;
  }
  var g = b(l, m), M = b(f, S), x = n - g - M;
  return x > 0 && (M += b(W(t, o), x)), { am: g, pm: M, total: g + M };
}
function rt() {
  u.renderCoverageBars && u.renderCoverageBars(), u.renderReports && u.renderReports(), window.dispatchEvent(new CustomEvent("lines:request-render")), !u.__USE_SVELTE_LINES && u.renderLines && u.renderLines();
}
function H(t, o, n) {
  var r = String(t);
  for (u.state.functionRotation || (u.state.functionRotation = {}), u.state.functionRotation[r] || (u.state.functionRotation[r] = []); u.state.functionRotation[r].length <= o; ) u.state.functionRotation[r].push(null);
  return u.state.functionRotation[r][o] = n, !0;
}
function Y(t, o) {
  var n = u.state.functionRotation[String(t)];
  if (!n) return null;
  var r = n[o];
  return r == null || r === "" ? null : r;
}
function St(t, o, n) {
  o = o || C(), n = n || {};
  var r = (u.state.weekCount || 1) * 7;
  (o.bands || []).forEach(function(a) {
    [["STSO", a.stso || 0], ["LTSO", a.ltso || 0], ["TSO", a.tso || 0]].forEach(function(i) {
      var e = i[0], l = i[1];
      if (l <= 0) return;
      for (var f = tt(a), d = ot(t, a, e), s = [], c = 0; c < f.length; c++) s.push(l - d[c]);
      var p = s.reduce(function(g, M) {
        return g + M;
      }, 0);
      if (p <= 0) return;
      function m(g) {
        for (var M = 0, x = 0; x < r; x++)
          Y(g.id, x) === "BAG" && M++;
        return M + (n[String(g.id)] || 0);
      }
      for (; p > 0; ) {
        var S = (u.state.lines || []).filter(function(g) {
          if (!G(g).dfo || z(g) !== e || !X(g, t) || Y(g.id, t) === "BAG") return !1;
          for (var M = !1, x = 0; x < f.length; x++)
            if (V(g, t, f[x]) && d[x] < l) {
              M = !0;
              break;
            }
          return !!M;
        }).sort(function(g, M) {
          var x = m(g), T = m(M);
          if (x !== T) return x - T;
          if (o.bias === "male") {
            if (g.sex !== M.sex) return g.sex === "M" ? -1 : 1;
          } else if (o.bias === "female" && g.sex !== M.sex)
            return g.sex === "F" ? -1 : 1;
          return $(g) - $(M) || String(g.id).localeCompare(String(M.id));
        });
        if (!S.length) break;
        var b = S[0];
        H(b.id, t, "BAG"), n[String(b.id)] = (n[String(b.id)] || 0) + 1;
        for (var c = 0; c < f.length; c++)
          V(b, t, f[c]) && (d[c]++, s[c]--, p--);
      }
    });
  });
}
function Ct(t) {
  t = t || {};
  var o = t.fromGenerate ? C() : ct() || C();
  if (u.state.issues || (u.state.issues = []), st(o, u.state.issues), u.state.functionRotation = {}, (u.state.lines || []).forEach(function(s) {
    s.isExtra || s.extraPositionId || (s.function = "", s.functionEligible = { dfo: !1, bag: !1, pax: !1 });
  }), !u.state.lines || !u.state.lines.length) {
    rt(), !t.fromGenerate && u.updateStatus && u.updateStatus("Generate lines first.");
    return;
  }
  var n = ft(o), r = (u.state.weekCount || 1) * 7, a = {};
  (u.state.lines || []).forEach(function(s) {
    if (G(s).bag) {
      s.function = "BAG";
      for (var c = 0; c < r; c++) X(s, c) && H(s.id, c, "BAG");
    }
  }), (u.state.lines || []).forEach(function(s) {
    G(s).bag || G(s).dfo && (s.function = "DFO");
  });
  for (var i = 0; i < r; i++) St(i, o, a);
  (u.state.lines || []).forEach(function(s) {
    if (!(s.isExtra || s.extraPositionId) && !G(s).bag) {
      if (G(s).dfo) {
        for (var c = 0; c < r; c++)
          X(s, c) && (Y(s.id, c) || H(s.id, c, "PAX"));
        return;
      }
      G(s).pax = !0, s.function = "PAX";
      for (var p = 0; p < r; p++) X(s, p) && H(s.id, p, "PAX");
    }
  });
  for (var e = [], l = 0; l < Math.min(7, r); l++)
    (o.bands || []).forEach(function(s) {
      var c = [];
      [["STSO", s.stso || 0], ["LTSO", s.ltso || 0], ["TSO", s.tso || 0]].forEach(function(p) {
        var m = p[0], S = p[1];
        if (!(S <= 0)) {
          var b = vt(l, s, m);
          b < S && c.push(m + " " + b + "/" + S);
        }
      }), c.length && e.push((u.DAYS[l % 7] || l) + " " + s.start + "-" + s.end + ": " + c.join(", "));
    });
  e.length && (e.slice(0, 10).forEach(function(s) {
    u.state.issues.push("Baggage band short: " + s);
  }), u.renderIssues && u.renderIssues()), rt();
  var f = "BAG " + (n.bag.stso.total + n.bag.ltso.total + n.bag.tso.total) + " · DFO " + (n.stso.total + n.ltso.total + n.tso.total) + " · leftover PAX";
  e.length && (f += " · SHORT " + e.length + " day/band(s)");
  var d = u.$("cert-assign-hint");
  d && (d.textContent = f), !t.fromGenerate && u.updateStatus && u.updateStatus(f), t.fromGenerate || dt();
}
const jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagSlotCounts: ot,
  bindAssignApi: Ot,
  fillBandShortfalls: St,
  generateFunctionAssignments: Ct,
  markBag: yt,
  markDfo: Pt,
  worstBagCoverage: vt
}, Symbol.toStringTag, { value: "Module" }));
function Xt(t) {
  return bindDutyApi(t), bindPoolsApi(t), bindBandsApi(t), bindAssignApi(t), t;
}
export {
  Lt as addExtraPosition,
  jt as assign,
  j as bagPoolTotal,
  ot as bagSlotCounts,
  Gt as bandForMinute,
  _t as bands,
  Ot as bindAssignApi,
  Ft as bindBandsApi,
  wt as bindDutyApi,
  ht as bindPoolsApi,
  ft as buildCertifiedPools,
  At as buildExtraPositionLines,
  st as capFunctionPoolsToFte,
  It as clearLineFunctions,
  dt as closeFunctionCoverageModal,
  Q as computeShiftAnchors,
  J as dfoPoolTotal,
  q as ensureExtraPositions,
  C as ensureFunctionCoverage,
  St as fillBandShortfalls,
  ut as fillFunctionCoverageForm,
  it as fteCapsByRoleSex,
  Ct as generateFunctionAssignments,
  bt as getFunctionMode,
  Tt as getRotationDuty,
  Xt as initFunctionCoverage,
  et as isAmSide,
  $t as isOpsFunctionRole,
  V as lineCoversSlot,
  kt as lineIsDfoTagged,
  z as lineRoleKey,
  $ as lineStartMin,
  yt as markBag,
  Pt as markDfo,
  xt as openFunctionCoverageModal,
  at as phaseOfStart,
  Rt as pools,
  gt as readExtraPositionsFromDom,
  ct as readFunctionBandsFromDom,
  N as renderExtraPositions,
  pt as renderFunctionBandsTable,
  lt as syncFunctionModeUi,
  mt as updateFunctionCoveragePreview,
  vt as worstBagCoverage
};
