let D = null;
function Ft(t) {
  D = t;
}
function v(t) {
  return Math.max(0, Math.floor(+t || 0));
}
function j(t) {
  return v(t.poolStsoBagM) + v(t.poolStsoBagF) + v(t.poolLtsoBagM) + v(t.poolLtsoBagF) + v(t.poolTsoBagM) + v(t.poolTsoBagF);
}
function Y(t) {
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
  }), t.poolStsoDfo == null && (t.poolStsoDfo = v(t.poolStsoDfoM) + v(t.poolStsoDfoF)), t.poolLtsoDfo == null && (t.poolLtsoDfo = v(t.poolLtsoDfoM) + v(t.poolLtsoDfoF)), t.poolTsoDfo == null && (t.poolTsoDfo = v(t.poolTsoDfoM) + v(t.poolTsoDfoF)), t.poolBag == null && (t.poolBag = j(t)), !t.poolStsoDfoM && !t.poolStsoDfoF && t.poolStsoDfo && (t.poolStsoDfoM = t.poolStsoDfo), !t.poolLtsoDfoM && !t.poolLtsoDfoF && t.poolLtsoDfo && (t.poolLtsoDfoM = t.poolLtsoDfo), !t.poolTsoDfoM && !t.poolTsoDfoF && t.poolTsoDfo && (t.poolTsoDfoM = t.poolTsoDfo), !t.poolTsoBagM && !t.poolTsoBagF && t.poolBag && (t.poolTsoBagM = t.poolBag), t.amPmSplit == null && (t.amPmSplit = !0), t.phaseThresholdMin == null && (t.phaseThresholdMin = 15), t.bias == null && (t.bias = "none"), (!Array.isArray(t.bands) || !t.bands.length) && (t.bands = ht()), delete t.stsoIsDfo, delete t.poolDfo, delete t.poolPax, D.state.functionRotation || (D.state.functionRotation = {}), J(t), t;
}
function bt() {
  return J(C());
}
function rt() {
  var t = D.state || {};
  return {
    STSO: { M: v(t.stsoM), F: v(t.stsoF) },
    LTSO: { M: v(t.ltsoM), F: v(t.ltsoF) },
    TSO: { M: v(t.ftM) + v(t.ptM), F: v(t.ftF) + v(t.ptF) }
  };
}
function st(t, o) {
  t = t || C();
  var n = rt();
  function i(a, r, e, f, l) {
    var d = n[a].M, s = n[a].F, c = v(t[r]), p = v(t[e]), g = v(t[f]), S = v(t[l]);
    c > d && (o && o.push("BAG " + a + " M pool " + c + " exceeds FTE " + d + " — capped."), c = d), p > s && (o && o.push("BAG " + a + " F pool " + p + " exceeds FTE " + s + " — capped."), p = s);
    var b = Math.max(0, d - c), m = Math.max(0, s - p);
    g > b && (o && o.push("DFO " + a + " M pool " + g + " exceeds remaining FTE " + b + " after BAG — capped."), g = b), S > m && (o && o.push("DFO " + a + " F pool " + S + " exceeds remaining FTE " + m + " after BAG — capped."), S = m), t[r] = c, t[e] = p, t[f] = g, t[l] = S;
  }
  return i("STSO", "poolStsoBagM", "poolStsoBagF", "poolStsoDfoM", "poolStsoDfoF"), i("LTSO", "poolLtsoBagM", "poolLtsoBagF", "poolLtsoDfoM", "poolLtsoDfoF"), i("TSO", "poolTsoBagM", "poolTsoBagF", "poolTsoDfoM", "poolTsoDfoF"), J(t), t;
}
function J(t) {
  var o = j(t) > 0, n = Y(t) > 0;
  return t.poolBag = j(t), t.poolStsoDfo = v(t.poolStsoDfoM) + v(t.poolStsoDfoF), t.poolLtsoDfo = v(t.poolLtsoDfoM) + v(t.poolLtsoDfoF), t.poolTsoDfo = v(t.poolTsoDfoM) + v(t.poolTsoDfoF), t.mode = o && n ? "both" : o ? "bag" : n ? "dfo" : "none", t;
}
function lt(t) {
  t = t || C();
  var o = D.state.lines || [];
  o.forEach(function(s) {
    s.isExtra || s.extraPositionId || (s.functionEligible = { dfo: !1, bag: !1, pax: !1 }, s.function = "");
  });
  var n = D.computeShiftAnchors(), i = t.phaseThresholdMin || 15;
  function a(s) {
    return (!s.functionEligible || typeof s.functionEligible != "object") && (s.functionEligible = { dfo: !1, bag: !1, pax: !1 }), s.functionEligible;
  }
  function r(s, c) {
    return o.filter(function(p) {
      if (p.isExtra || p.extraPositionId) return !1;
      var g = a(p);
      return D.lineRoleKey(p) === s && p.sex === c && !g.bag && !g.dfo;
    });
  }
  function e(s, c, p) {
    if (!p || p <= 0) return { total: 0 };
    var g = r(s, c).slice();
    g.sort(function(m, h) {
      return D.lineStartMin(m) - D.lineStartMin(h) || String(m.id).localeCompare(String(h.id));
    });
    for (var S = 0, b = 0; b < g.length && S < p; b++)
      a(g[b]).bag = !0, S++;
    return { total: S };
  }
  function f(s, c, p) {
    if (!p || p <= 0) return { am: 0, pm: 0, total: 0 };
    var g = r(s, c).slice();
    g.sort(function(A, y) {
      return D.lineStartMin(A) - D.lineStartMin(y) || String(A.id).localeCompare(String(y.id));
    });
    var S = g.filter(function(A) {
      return D.isAmSide(D.lineStartMin(A), n, i);
    }), b = g.filter(function(A) {
      return !D.isAmSide(D.lineStartMin(A), n, i);
    }), m = t.bands || [], h = m[0], B = m[m.length - 1];
    function M(A, y) {
      if (!y) return !1;
      var R = D.timeToMin(y.start), $ = D.getShift(A.shiftId);
      if (!$) return !1;
      var _ = D.timeToMin($.start), z = D.timeToMin($.end);
      return z <= _ && (z += 1440), R >= _ && R < z;
    }
    S.sort(function(A, y) {
      var R = M(A, h) ? 0 : 1, $ = M(y, h) ? 0 : 1;
      return R !== $ ? R - $ : D.lineStartMin(A) - D.lineStartMin(y) || String(A.id).localeCompare(String(y.id));
    }), b.sort(function(A, y) {
      var R = M(A, B) ? 0 : 1, $ = M(y, B) ? 0 : 1;
      return R !== $ ? R - $ : D.lineStartMin(A) - D.lineStartMin(y) || String(A.id).localeCompare(String(y.id));
    });
    var T = t.amPmSplit ? Math.ceil(p / 2) : p, E = t.amPmSplit ? Math.floor(p / 2) : 0;
    for (S.length < T && (E += T - S.length, T = S.length), b.length < E && (T = Math.min(S.length, T + (E - b.length)), E = b.length); T + E > p; )
      if (E >= T && E > 0) E--;
      else if (T > 0) T--;
      else break;
    function L(A, y) {
      for (var R = 0, $ = 0; $ < A.length && R < y; $++) {
        var _ = a(A[$]);
        _.bag || _.dfo || (_.dfo = !0, R++);
      }
      return R;
    }
    var k = L(S, T), G = L(b, E), nt = p - k - G;
    return nt > 0 && (G += L(r(s, c), nt)), { am: k, pm: G, total: k + G };
  }
  var l = {
    stso: { m: e("STSO", "M", t.poolStsoBagM).total, f: e("STSO", "F", t.poolStsoBagF).total },
    ltso: { m: e("LTSO", "M", t.poolLtsoBagM).total, f: e("LTSO", "F", t.poolLtsoBagF).total },
    tso: { m: e("TSO", "M", t.poolTsoBagM).total, f: e("TSO", "F", t.poolTsoBagF).total }
  };
  l.stso.total = l.stso.m + l.stso.f, l.ltso.total = l.ltso.m + l.ltso.f, l.tso.total = l.tso.m + l.tso.f;
  var d = {
    stso: f("STSO", "M", t.poolStsoDfoM),
    stsoF: f("STSO", "F", t.poolStsoDfoF),
    ltso: f("LTSO", "M", t.poolLtsoDfoM),
    ltsoF: f("LTSO", "F", t.poolLtsoDfoF),
    tso: f("TSO", "M", t.poolTsoDfoM),
    tsoF: f("TSO", "F", t.poolTsoDfoF)
  };
  return {
    bag: l,
    stso: { total: d.stso.total + d.stsoF.total, am: d.stso.am + d.stsoF.am, pm: d.stso.pm + d.stsoF.pm },
    ltso: { total: d.ltso.total + d.ltsoF.total, am: d.ltso.am + d.ltsoF.am, pm: d.ltso.pm + d.ltsoF.pm },
    tso: { total: d.tso.total + d.tsoF.total, am: d.tso.am + d.tsoF.am, pm: d.tso.pm + d.tsoF.pm },
    anchors: n
  };
}
function ht() {
  return [
    { start: "03:30", end: "04:00", stso: 1, ltso: 1, tso: 2 },
    { start: "04:00", end: "20:30", stso: 1, ltso: 1, tso: 6 },
    { start: "20:30", end: "23:00", stso: 1, ltso: 1, tso: 3 }
  ];
}
const Rt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagPoolTotal: j,
  bindPoolsApi: Ft,
  buildCertifiedPools: lt,
  capFunctionPoolsToFte: st,
  dfoPoolTotal: Y,
  ensureFunctionCoverage: C,
  fteCapsByRoleSex: rt,
  getFunctionMode: bt
}, Symbol.toStringTag, { value: "Module" }));
let x = null;
function wt(t) {
  x = t;
}
function U(t) {
  return t ? t.isExtra || t.extraPositionId ? t.empClass || t.position || "EXTRA" : t.isStso || t.empClass === "STSO" ? "STSO" : t.isLtso || t.empClass === "LTSO" ? "LTSO" : "TSO" : "TSO";
}
function kt(t) {
  var o = U(t);
  return o === "STSO" || o === "LTSO" || o === "TSO";
}
function It(t) {
  return !t || t.isExtra || t.extraPositionId ? !1 : t.function === "DFO" || !!(t.functionEligible && t.functionEligible.dfo);
}
function Mt(t, o) {
  var n = x.state.functionRotation || {}, i = n[String(t)] || n[t];
  if (i) {
    var a = i[o];
    return a == null || a === "" ? null : a;
  }
  var r = null;
  if (x.state && Array.isArray(x.state.lines)) {
    for (var e = 0; e < x.state.lines.length; e++)
      if (String(x.state.lines[e].id) === String(t)) {
        r = x.state.lines[e];
        break;
      }
  }
  return r && (r.function === "BAG" || r.function === "DFO" || r.function === "PAX") ? r.function : null;
}
function w(t) {
  var o = x.getShift(t.shiftId);
  return o ? x.timeToMin(o.start) : 0;
}
function at(t, o, n) {
  return n = n ?? 15, o = o || Q(), t <= o.am - n && t < 11 * 60 ? "Opening" : t >= o.pm + n && t >= 11 * 60 + 15 ? "Closing" : t < o.pm ? "AM" : "PM";
}
function et(t, o, n) {
  return at(t, o, n) === "Opening" || at(t, o, n) === "AM";
}
function K(t, o, n) {
  var i = x.state.schedule[t.id] || x.state.schedule[String(t.id)];
  if (!i || i[o] !== "WORK") return !1;
  var a = o % 7, r = x.getEffectiveShiftTimes ? x.getEffectiveShiftTimes(t.shiftId, a) : null;
  if (!r) {
    var e = x.getShift(t.shiftId);
    if (!e) return !1;
    r = { start: e.start, end: e.end };
  }
  var f = x.timeToMin(r.start), l = x.timeToMin(r.end);
  return l <= f ? n >= f || n < l : n >= f && n < l;
}
function Gt(t, o) {
  o = o || x.ensureFunctionCoverage().bands;
  for (var n = 0; n < o.length; n++) {
    var i = o[n], a = x.timeToMin(i.start), r = x.timeToMin(i.end);
    r <= a && (r += 1440);
    var e = t;
    if (r > 1440 && e < a && (e += 1440), e >= a && e < r) return i;
  }
  return null;
}
function Q() {
  var t = {};
  (x.state.lines || []).forEach(function(e) {
    var f = x.getShift(e.shiftId);
    if (f) {
      var l = x.timeToMin(f.start);
      t[l] = (t[l] || 0) + 1;
    }
  });
  var o = Object.keys(t).map(function(e) {
    return { min: +e, n: t[e] };
  }).sort(function(e, f) {
    return e.min - f.min;
  });
  if (!o.length) return { am: 8 * 60, pm: 14 * 60 };
  var n = o[0].min, i = 0;
  o.forEach(function(e) {
    e.min < 11 * 60 && e.n > i && (i = e.n, n = e.min);
  });
  var a = o[o.length - 1].min, r = 0;
  return o.forEach(function(e) {
    e.min >= 11 * 60 + 15 && e.n > r && (r = e.n, a = e.min);
  }), r === 0 && o.forEach(function(e) {
    e.min >= 12 * 60 && e.n > r && (r = e.n, a = e.min);
  }), { am: n, pm: a };
}
function _t() {
  (x.state.lines || []).forEach(function(t) {
    t.function = "", t.functionEligible = { dfo: !1, bag: !1, pax: !1 };
  }), x.state.functionRotation = {};
}
let F = null;
function Tt(t) {
  F = t;
}
function P(t) {
  return Math.max(0, Math.floor(+t || 0));
}
function O(t, o) {
  const n = F.$(t);
  n && (n.value = o);
}
function Dt(t, o) {
  const n = F.$(t);
  n && (n.checked = !!o);
}
function xt(t) {
  const o = F.$(t);
  return o ? P(o.value) : null;
}
function ft() {
  const t = C();
  O("fc-pool-bag-stso-m", t.poolStsoBagM), O("fc-pool-bag-stso-f", t.poolStsoBagF), O("fc-pool-bag-ltso-m", t.poolLtsoBagM), O("fc-pool-bag-ltso-f", t.poolLtsoBagF), O("fc-pool-bag-tso-m", t.poolTsoBagM), O("fc-pool-bag-tso-f", t.poolTsoBagF), O("fc-pool-dfo-stso-m", t.poolStsoDfoM), O("fc-pool-dfo-stso-f", t.poolStsoDfoF), O("fc-pool-dfo-ltso-m", t.poolLtsoDfoM), O("fc-pool-dfo-ltso-f", t.poolLtsoDfoF), O("fc-pool-dfo-tso-m", t.poolTsoDfoM), O("fc-pool-dfo-tso-f", t.poolTsoDfoF);
  const o = F.$("fc-bands-wrap"), n = F.$("fc-add-band");
  o && (o.style.display = ""), n && (n.style.display = "");
}
function ut() {
  const t = C();
  O("fc-phase-thr", t.phaseThresholdMin), Dt("fc-ampm-split", t.amPmSplit), O("fc-bias", t.bias || "none"), ft(), pt(), gt(), N && N();
}
function Bt() {
  ut();
  const t = F.$("func-coverage-modal");
  t && (t.style.display = "block");
}
function dt() {
  const t = F.$("func-coverage-modal");
  t && (t.style.display = "none");
}
function Et(t) {
  var o = j(t) > 0, n = Y(t) > 0;
  return t.poolBag = j(t), t.poolStsoDfo = P(t.poolStsoDfoM) + P(t.poolStsoDfoF), t.poolLtsoDfo = P(t.poolLtsoDfoM) + P(t.poolLtsoDfoF), t.poolTsoDfo = P(t.poolTsoDfoM) + P(t.poolTsoDfoF), t.mode = o && n ? "both" : o ? "bag" : n ? "dfo" : "none", t.mode;
}
function pt() {
  const t = F.$("fc-bands-tbody");
  if (!t) return;
  const o = C().bands;
  t.innerHTML = o.map(function(n, i) {
    function a(r) {
      return '<td><input type="number" min="0" max="99" data-fc-band="' + i + '" data-fc-field="' + r + '" value="' + (n[r] != null ? n[r] : 0) + '" style="width:3.5rem"></td>';
    }
    return '<tr><td><input type="time" data-fc-band="' + i + '" data-fc-field="start" value="' + (n.start || "00:00") + '" step="900"></td><td><input type="time" data-fc-band="' + i + '" data-fc-field="end" value="' + (n.end || "00:00") + '" step="900"></td>' + a("stso") + a("ltso") + a("tso") + '<td><button type="button" class="btn btn-red btn-sm" data-fc-remove="' + i + '">✕</button></td></tr>';
  }).join("");
}
function ct() {
  const t = C();
  function o(l, d) {
    var s = xt(l);
    s != null && (t[d] = s);
  }
  o("fc-pool-bag-stso-m", "poolStsoBagM"), o("fc-pool-bag-stso-f", "poolStsoBagF"), o("fc-pool-bag-ltso-m", "poolLtsoBagM"), o("fc-pool-bag-ltso-f", "poolLtsoBagF"), o("fc-pool-bag-tso-m", "poolTsoBagM"), o("fc-pool-bag-tso-f", "poolTsoBagF"), o("fc-pool-dfo-stso-m", "poolStsoDfoM"), o("fc-pool-dfo-stso-f", "poolStsoDfoF"), o("fc-pool-dfo-ltso-m", "poolLtsoDfoM"), o("fc-pool-dfo-ltso-f", "poolLtsoDfoF"), o("fc-pool-dfo-tso-m", "poolTsoDfoM"), o("fc-pool-dfo-tso-f", "poolTsoDfoF"), Et(t);
  const n = F.$("fc-phase-thr"), i = F.$("fc-ampm-split");
  n && (t.phaseThresholdMin = P(n.value || 15)), i && (t.amPmSplit = !!i.checked);
  const a = F.$("fc-bias");
  if (a) {
    var r = a.value;
    r === "male" || r === "female" || r === "none" ? t.bias = r : t.bias = "none";
  }
  for (var e = 0; e < t.bands.length; e++) {
    var f = t.bands[e] || {};
    ["start", "end", "stso", "ltso", "tso"].forEach(function(l) {
      var d = document.querySelector('[data-fc-band="' + e + '"][data-fc-field="' + l + '"]');
      d && (l === "start" || l === "end" ? f[l] = d.value || f[l] : f[l] = P(d.value));
    }), t.bands[e] = f;
  }
  return t.bands.sort(function(l, d) {
    return F.timeToMin(l.start) - F.timeToMin(d.start);
  }), t;
}
function gt() {
  const t = F.$("fc-preview");
  if (!t) return;
  const o = C(), n = Q(), i = (o.bands || []).map(function(a) {
    return (a.start || "?") + "-" + (a.end || "?") + " bag-need " + (a.stso || 0) + "-" + (a.ltso || 0) + "-" + (a.tso || 0);
  }).join(" | ");
  t.textContent = "BAG STSO " + o.poolStsoBagM + "/" + o.poolStsoBagF + " LTSO " + o.poolLtsoBagM + "/" + o.poolLtsoBagF + " TSO " + o.poolTsoBagM + "/" + o.poolTsoBagF + " · DFO STSO " + o.poolStsoDfoM + "/" + o.poolStsoDfoF + " LTSO " + o.poolLtsoDfoM + "/" + o.poolLtsoDfoF + " TSO " + o.poolTsoDfoM + "/" + o.poolTsoDfoF + " · AM " + F.slotLabel(n.am) + " PM " + F.slotLabel(n.pm) + " " + (i || "no bands");
}
function Z() {
  return [{ start: "04:00", end: "20:30", min: 1 }];
}
function q() {
  return Array.isArray(F.state.extraPositions) || (F.state.extraPositions = []), F.state.extraPositions.forEach(function(t, o) {
    t.id || (t.id = "extra-" + (o + 1)), t.name || (t.name = "Position"), t.m = P(t.m), t.f = P(t.f), (!Array.isArray(t.bands) || !t.bands.length) && (t.bands = Z());
  }), F.state.extraPositions;
}
function mt() {
  const t = q();
  return t.forEach(function(o) {
    const n = F.$('[data-extra-name="' + o.id + '"]'), i = F.$('[data-extra-m="' + o.id + '"]'), a = F.$('[data-extra-f="' + o.id + '"]');
    n && (o.name = String(n.value || o.name).trim() || o.name), i && (o.m = P(i.value)), a && (o.f = P(a.value)), Array.isArray(o.bands) || (o.bands = Z());
    for (var r = 0; r < o.bands.length; r++) {
      var e = o.bands[r] || {};
      ["start", "end", "min"].forEach(function(f) {
        var l = F.$('[data-extra-band="' + o.id + '"][data-extra-bi="' + r + '"][data-extra-bf="' + f + '"]');
        l && (f === "min" ? e[f] = P(l.value) : e[f] = l.value || e[f]);
      }), o.bands[r] = e;
    }
  }), t;
}
function N() {
  const t = F.$("extra-pos-list");
  if (!t) return;
  const o = q();
  t.innerHTML = o.map(function(n) {
    var i = (n.bands || []).map(function(a, r) {
      return '<tr><td><input type="time" data-extra-band="' + n.id + '" data-extra-bi="' + r + '" data-extra-bf="start" value="' + (a.start || "04:00") + '" step="900"></td><td><input type="time" data-extra-band="' + n.id + '" data-extra-bi="' + r + '" data-extra-bf="end" value="' + (a.end || "20:30") + '" step="900"></td><td><input type="number" min="0" max="99" data-extra-band="' + n.id + '" data-extra-bi="' + r + '" data-extra-bf="min" value="' + (a.min != null ? a.min : 0) + '" style="width:3.5rem"></td><td><button type="button" class="btn btn-red btn-sm" data-extra-band-remove="' + n.id + '" data-extra-bi="' + r + '">✕</button></td></tr>';
    }).join("");
    return '<div class="extra-pos-card" data-extra-card="' + n.id + '"><div class="fte-sex-row extra-pos-head"><label>Name <input type="text" data-extra-name="' + n.id + '" value="' + String(n.name || "").replace(/"/g, "&quot;") + '" style="width:7rem"></label><label>Male <input type="number" min="0" data-extra-m="' + n.id + '" value="' + P(n.m) + '" style="width:4.5rem"></label><label>Female <input type="number" min="0" data-extra-f="' + n.id + '" value="' + P(n.f) + '" style="width:4.5rem"></label><button type="button" class="btn btn-red btn-sm" data-extra-remove="' + n.id + '">Remove</button><button type="button" class="btn btn-sm" data-extra-add-band="' + n.id + '">+ Band</button></div><div class="lines-scroll extra-pos-bands"><table class="data-table"><thead><tr><th>Start</th><th>End</th><th>Min</th><th></th></tr></thead><tbody>' + i + "</tbody></table></div></div>";
  }).join("");
}
function Pt(t) {
  mt();
  var o = q();
  o.push({ id: "extra-" + Date.now() + "-" + (o.length + 1), name: t || "MSTI", m: 0, f: 0, bands: Z() }), N();
}
function At() {
  var t = [], o = q(), n = F.state.shifts || [], i = n[0] || { id: "", name: "Shift", start: "04:00", end: "20:30", paid: 8, rdoHard: [] };
  return o.forEach(function(a, r) {
    var e = P(a.m) + P(a.f);
    if (!e) return;
    (!a.bands || !a.bands.length) && F.state.issues.push((a.name || "Position") + ": no coverage bands.");
    var f = 3e4 + r * 1e3, l = 0;
    function d(s, c) {
      for (var p = 0; p < c; p++) {
        for (var g = n[l % Math.max(1, n.length)] || i, S = (+g.paid || 8) >= 10 ? 4 : 5, b = 7 - S, m = Array.isArray(g.rdoHard) ? g.rdoHard.map(Number).filter(function(M) {
          return M >= 0 && M <= 6;
        }) : [], h = m.length ? m.slice(0, b) : F.consecutiveRdos ? F.consecutiveRdos(b, (f + l) % 7) : [0, 6]; h.length < b; )
          for (var B = 0; B < 7 && h.length < b; B++) h.indexOf(B) < 0 && h.push(B);
        t.push({
          id: f + l + 1,
          lineCode: String(a.name || "POS") + " " + String(l + 1).padStart(2, "0"),
          shiftId: g.id,
          shiftName: g.name,
          shiftLabel: F.shiftLabel ? F.shiftLabel(g) : (g.start || "") + "-" + (g.end || ""),
          empClass: a.name || "EXTRA",
          position: a.name || "EXTRA",
          isLtso: !1,
          isStso: !1,
          isExtra: !0,
          extraPositionId: a.id,
          sex: s,
          function: "",
          rdoDays: h,
          rdoHard: m.length > 0,
          paid: g.paid || 8
        }), l++;
      }
    }
    d("M", P(a.m)), d("F", P(a.f));
  }), t;
}
const jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addExtraPosition: Pt,
  bindBandsApi: Tt,
  buildExtraPositionLines: At,
  closeFunctionCoverageModal: dt,
  ensureExtraPositions: q,
  fillFunctionCoverageForm: ut,
  openFunctionCoverageModal: Bt,
  readExtraPositionsFromDom: mt,
  readFunctionBandsFromDom: ct,
  renderExtraPositions: N,
  renderFunctionBandsTable: pt,
  syncFunctionModeUi: ft,
  updateFunctionCoveragePreview: gt
}, Symbol.toStringTag, { value: "Module" }));
let u = null;
function Lt(t) {
  u = t;
}
function tt(t) {
  var o = u.timeToMin(t.start), n = u.timeToMin(t.end);
  n <= o && (n += 1440);
  for (var i = [], a = o; a < n; a += 30) i.push(a % 1440);
  return i;
}
function X(t, o) {
  var n = u.state.schedule[t.id] || u.state.schedule[String(t.id)];
  return n ? n[o] === "WORK" : !1;
}
function ot(t, o, n) {
  for (var i = tt(o), a = [], r = 0; r < i.length; r++) a.push(0);
  return (u.state.lines || []).forEach(function(e) {
    if (U(e) === n && !(!X(e, t) || Mt(e.id, t) !== "BAG"))
      for (var f = 0; f < i.length; f++)
        K(e, t, i[f]) && a[f]++;
  }), a;
}
function vt(t, o, n) {
  var i = tt(o);
  if (!i.length) return 0;
  for (var a = ot(t, o, n), r = a[0], e = 1; e < a.length; e++) a[e] < r && (r = a[e]);
  return r;
}
function I(t) {
  return (!t.functionEligible || typeof t.functionEligible != "object") && (t.functionEligible = { dfo: !1, bag: !1, pax: !1 }), t.functionEligible;
}
function V(t, o, n) {
  var i = u.state.lines || [];
  return i.filter(function(a) {
    if (a.isExtra || a.extraPositionId) return !1;
    var r = I(a);
    return U(a) === t && a.sex === o && !r.bag && !r.dfo;
  });
}
function yt(t, o, n, i) {
  if (!n || n <= 0) return { total: 0 };
  i = i || C();
  var a = V(t, o).slice();
  a.sort(function(f, l) {
    return w(f) - w(l) || String(f.id).localeCompare(String(l.id));
  });
  for (var r = 0, e = 0; e < a.length && r < n; e++)
    I(a[e]).bag = !0, r++;
  return { total: r };
}
function Ot(t, o, n, i) {
  if (!n || n <= 0) return { am: 0, pm: 0, total: 0 };
  i = i || C();
  var a = Q(), r = i.phaseThresholdMin || 15, e = V(t, o).slice();
  e.sort(function(M, T) {
    return w(M) - w(T) || String(M.id).localeCompare(String(T.id));
  });
  var f = e.filter(function(M) {
    return et(w(M), a, r);
  }), l = e.filter(function(M) {
    return !et(w(M), a, r);
  }), d = i.bands || [], s = d[0], c = d[d.length - 1];
  function p(M, T) {
    if (!T) return !1;
    var E = u.timeToMin(T.start), L = u.getShift(M.shiftId);
    if (!L) return !1;
    var k = u.timeToMin(L.start), G = u.timeToMin(L.end);
    return G <= k && (G += 1440), E >= k && E < G;
  }
  f.sort(function(M, T) {
    var E = p(M, s) ? 0 : 1, L = p(T, s) ? 0 : 1;
    return E !== L ? E - L : w(M) - w(T) || String(M.id).localeCompare(String(T.id));
  }), l.sort(function(M, T) {
    var E = p(M, c) ? 0 : 1, L = p(T, c) ? 0 : 1;
    return E !== L ? E - L : w(M) - w(T) || String(M.id).localeCompare(String(T.id));
  });
  var g = i.amPmSplit ? Math.ceil(n / 2) : n, S = i.amPmSplit ? Math.floor(n / 2) : 0;
  for (f.length < g && (S += g - f.length, g = f.length), l.length < S && (g = Math.min(f.length, g + (S - l.length)), S = l.length); g + S > n; )
    if (S >= g && S > 0) S--;
    else if (g > 0) g--;
    else break;
  function b(M, T) {
    for (var E = 0, L = 0; L < M.length && E < T; L++) {
      var k = I(M[L]);
      k.bag || k.dfo || (k.dfo = !0, E++);
    }
    return E;
  }
  var m = b(f, g), h = b(l, S), B = n - m - h;
  return B > 0 && (h += b(V(t, o), B)), { am: m, pm: h, total: m + h };
}
function it() {
  u.renderCoverageBars && u.renderCoverageBars(), u.renderReports && u.renderReports(), window.dispatchEvent(new CustomEvent("lines:request-render")), !u.__USE_SVELTE_LINES && u.renderLines && u.renderLines();
}
function H(t, o, n) {
  var i = String(t);
  for (u.state.functionRotation || (u.state.functionRotation = {}), u.state.functionRotation[i] || (u.state.functionRotation[i] = []); u.state.functionRotation[i].length <= o; ) u.state.functionRotation[i].push(null);
  return u.state.functionRotation[i][o] = n, !0;
}
function W(t, o) {
  var n = u.state.functionRotation[String(t)];
  if (!n) return null;
  var i = n[o];
  return i == null || i === "" ? null : i;
}
function St(t, o, n) {
  o = o || C(), n = n || {};
  var i = (u.state.weekCount || 1) * 7;
  (o.bands || []).forEach(function(a) {
    [["STSO", a.stso || 0], ["LTSO", a.ltso || 0], ["TSO", a.tso || 0]].forEach(function(r) {
      var e = r[0], f = r[1];
      if (f <= 0) return;
      for (var l = tt(a), d = ot(t, a, e), s = [], c = 0; c < l.length; c++) s.push(f - d[c]);
      var p = s.reduce(function(m, h) {
        return m + h;
      }, 0);
      if (p <= 0) return;
      function g(m) {
        for (var h = 0, B = 0; B < i; B++)
          W(m.id, B) === "BAG" && h++;
        return h + (n[String(m.id)] || 0);
      }
      for (; p > 0; ) {
        var S = (u.state.lines || []).filter(function(m) {
          if (!I(m).dfo || U(m) !== e || !X(m, t) || W(m.id, t) === "BAG") return !1;
          for (var h = !1, B = 0; B < l.length; B++)
            if (K(m, t, l[B]) && d[B] < f) {
              h = !0;
              break;
            }
          return !!h;
        }).sort(function(m, h) {
          var B = g(m), M = g(h);
          if (B !== M) return B - M;
          if (o.bias === "male") {
            if (m.sex !== h.sex) return m.sex === "M" ? -1 : 1;
          } else if (o.bias === "female" && m.sex !== h.sex)
            return m.sex === "F" ? -1 : 1;
          return w(m) - w(h) || String(m.id).localeCompare(String(h.id));
        });
        if (!S.length) break;
        var b = S[0];
        H(b.id, t, "BAG"), n[String(b.id)] = (n[String(b.id)] || 0) + 1;
        for (var c = 0; c < l.length; c++)
          K(b, t, l[c]) && (d[c]++, s[c]--, p--);
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
    it(), !t.fromGenerate && u.updateStatus && u.updateStatus("Generate lines first.");
    return;
  }
  var n = lt(o), i = (u.state.weekCount || 1) * 7, a = {};
  (u.state.lines || []).forEach(function(s) {
    if (I(s).bag) {
      s.function = "BAG";
      for (var c = 0; c < i; c++) X(s, c) && H(s.id, c, "BAG");
    }
  }), (u.state.lines || []).forEach(function(s) {
    I(s).bag || I(s).dfo && (s.function = "DFO");
  });
  for (var r = 0; r < i; r++) St(r, o, a);
  (u.state.lines || []).forEach(function(s) {
    if (!(s.isExtra || s.extraPositionId) && !I(s).bag) {
      if (I(s).dfo) {
        for (var c = 0; c < i; c++)
          X(s, c) && (W(s.id, c) || H(s.id, c, "PAX"));
        return;
      }
      I(s).pax = !0, s.function = "PAX";
      for (var p = 0; p < i; p++) X(s, p) && H(s.id, p, "PAX");
    }
  });
  for (var e = [], f = 0; f < Math.min(7, i); f++)
    (o.bands || []).forEach(function(s) {
      var c = [];
      [["STSO", s.stso || 0], ["LTSO", s.ltso || 0], ["TSO", s.tso || 0]].forEach(function(p) {
        var g = p[0], S = p[1];
        if (!(S <= 0)) {
          var b = vt(f, s, g);
          b < S && c.push(g + " " + b + "/" + S);
        }
      }), c.length && e.push((u.DAYS[f % 7] || f) + " " + s.start + "-" + s.end + ": " + c.join(", "));
    });
  e.length && (e.slice(0, 10).forEach(function(s) {
    u.state.issues.push("Baggage band short: " + s);
  }), u.renderIssues && u.renderIssues()), it();
  var l = "BAG " + (n.bag.stso.total + n.bag.ltso.total + n.bag.tso.total) + " · DFO " + (n.stso.total + n.ltso.total + n.tso.total) + " · leftover PAX";
  e.length && (l += " · SHORT " + e.length + " day/band(s)");
  var d = u.$("cert-assign-hint");
  d && (d.textContent = l), !t.fromGenerate && u.updateStatus && u.updateStatus(l), t.fromGenerate || dt();
}
const Xt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagSlotCounts: ot,
  bindAssignApi: Lt,
  fillBandShortfalls: St,
  generateFunctionAssignments: Ct,
  markBag: yt,
  markDfo: Ot,
  worstBagCoverage: vt
}, Symbol.toStringTag, { value: "Module" }));
function $t(t) {
  return bindDutyApi(t), bindPoolsApi(t), bindBandsApi(t), bindAssignApi(t), t.fteCapsByRoleSex = fteCapsByRoleSex, t.ensureFunctionCoverage = ensureFunctionCoverage, t.getFunctionMode = getFunctionMode, t.syncFunctionModeUi = syncFunctionModeUi, t.fillFunctionCoverageForm = fillFunctionCoverageForm, t.computeShiftAnchors = computeShiftAnchors, t.phaseOfStart = phaseOfStart, t.isAmSide = isAmSide, t.lineStartMin = lineStartMin, t.lineRoleKey = lineRoleKey, t.isOpsFunctionRole = isOpsFunctionRole, t.lineIsDfoTagged = lineIsDfoTagged, t.getRotationDuty = getRotationDuty, t.lineCoversSlot = lineCoversSlot, t.bandForMinute = bandForMinute, t.openFunctionCoverageModal = openFunctionCoverageModal, t.closeFunctionCoverageModal = closeFunctionCoverageModal, t.renderFunctionBandsTable = renderFunctionBandsTable, t.readFunctionBandsFromDom = readFunctionBandsFromDom, t.updateFunctionCoveragePreview = updateFunctionCoveragePreview, t.capFunctionPoolsToFte = capFunctionPoolsToFte, t.buildCertifiedPools = buildCertifiedPools, t.generateFunctionAssignments = generateFunctionAssignments, t.ensureExtraPositions = ensureExtraPositions, t.readExtraPositionsFromDom = readExtraPositionsFromDom, t.renderExtraPositions = renderExtraPositions, t.addExtraPosition = addExtraPosition, t.buildExtraPositionLines = buildExtraPositionLines, t.clearLineFunctions = clearLineFunctions, t.initFunctionCoverage = $t, t;
}
export {
  Pt as addExtraPosition,
  Xt as assign,
  j as bagPoolTotal,
  ot as bagSlotCounts,
  Gt as bandForMinute,
  jt as bands,
  Lt as bindAssignApi,
  Tt as bindBandsApi,
  wt as bindDutyApi,
  Ft as bindPoolsApi,
  lt as buildCertifiedPools,
  At as buildExtraPositionLines,
  st as capFunctionPoolsToFte,
  _t as clearLineFunctions,
  dt as closeFunctionCoverageModal,
  Q as computeShiftAnchors,
  Y as dfoPoolTotal,
  q as ensureExtraPositions,
  C as ensureFunctionCoverage,
  St as fillBandShortfalls,
  ut as fillFunctionCoverageForm,
  rt as fteCapsByRoleSex,
  Ct as generateFunctionAssignments,
  bt as getFunctionMode,
  Mt as getRotationDuty,
  $t as initFunctionCoverage,
  et as isAmSide,
  kt as isOpsFunctionRole,
  K as lineCoversSlot,
  It as lineIsDfoTagged,
  U as lineRoleKey,
  w as lineStartMin,
  yt as markBag,
  Ot as markDfo,
  Bt as openFunctionCoverageModal,
  at as phaseOfStart,
  Rt as pools,
  mt as readExtraPositionsFromDom,
  ct as readFunctionBandsFromDom,
  N as renderExtraPositions,
  pt as renderFunctionBandsTable,
  ft as syncFunctionModeUi,
  gt as updateFunctionCoveragePreview,
  vt as worstBagCoverage
};
