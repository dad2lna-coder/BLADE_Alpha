let m = null;
function K(o) {
  m = o;
}
function l(o) {
  return Math.max(0, Math.floor(+o || 0));
}
function $(o) {
  return l(o.poolStsoBagM) + l(o.poolStsoBagF) + l(o.poolLtsoBagM) + l(o.poolLtsoBagF) + l(o.poolTsoBagM) + l(o.poolTsoBagF);
}
function G(o) {
  return l(o.poolStsoDfoM) + l(o.poolStsoDfoF) + l(o.poolLtsoDfoM) + l(o.poolLtsoDfoF) + l(o.poolTsoDfoM) + l(o.poolTsoDfoF);
}
function A() {
  m.state.functionCoverage || (m.state.functionCoverage = {});
  var o = m.state.functionCoverage;
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
  ].forEach(function(t) {
    o[t] == null && (o[t] = 0);
  }), o.poolStsoDfo == null && (o.poolStsoDfo = l(o.poolStsoDfoM) + l(o.poolStsoDfoF)), o.poolLtsoDfo == null && (o.poolLtsoDfo = l(o.poolLtsoDfoM) + l(o.poolLtsoDfoF)), o.poolTsoDfo == null && (o.poolTsoDfo = l(o.poolTsoDfoM) + l(o.poolTsoDfoF)), o.poolBag == null && (o.poolBag = $(o)), !o.poolStsoDfoM && !o.poolStsoDfoF && o.poolStsoDfo && (o.poolStsoDfoM = o.poolStsoDfo), !o.poolLtsoDfoM && !o.poolLtsoDfoF && o.poolLtsoDfo && (o.poolLtsoDfoM = o.poolLtsoDfo), !o.poolTsoDfoM && !o.poolTsoDfoF && o.poolTsoDfo && (o.poolTsoDfoM = o.poolTsoDfo), !o.poolTsoBagM && !o.poolTsoBagF && o.poolBag && (o.poolTsoBagM = o.poolBag), o.amPmSplit == null && (o.amPmSplit = !0), o.phaseThresholdMin == null && (o.phaseThresholdMin = 15), o.bias == null && (o.bias = "none"), (!Array.isArray(o.bands) || !o.bands.length) && (o.bands = ao()), delete o.stsoIsDfo, delete o.poolDfo, delete o.poolPax, m.state.functionRotation || (m.state.functionRotation = {}), H(o), o;
}
function oo() {
  return H(A());
}
function U() {
  var o = m.state || {};
  return {
    STSO: { M: l(o.stsoM), F: l(o.stsoF) },
    LTSO: { M: l(o.ltsoM), F: l(o.ltsoF) },
    TSO: { M: l(o.ftM) + l(o.ptM), F: l(o.ftF) + l(o.ptF) }
  };
}
function to(o, t) {
  o = o || A();
  var n = U();
  function s(e, r, a, u, i) {
    var f = n[e].M, p = n[e].F, F = l(o[r]), c = l(o[a]), g = l(o[u]), h = l(o[i]);
    F > f && (t && t.push("BAG " + e + " M pool " + F + " exceeds FTE " + f + " — capped."), F = f), c > p && (t && t.push("BAG " + e + " F pool " + c + " exceeds FTE " + p + " — capped."), c = p);
    var M = Math.max(0, f - F), D = Math.max(0, p - c);
    g > M && (t && t.push("DFO " + e + " M pool " + g + " exceeds remaining FTE " + M + " after BAG — capped."), g = M), h > D && (t && t.push("DFO " + e + " F pool " + h + " exceeds remaining FTE " + D + " after BAG — capped."), h = D), o[r] = F, o[a] = c, o[u] = g, o[i] = h;
  }
  return s("STSO", "poolStsoBagM", "poolStsoBagF", "poolStsoDfoM", "poolStsoDfoF"), s("LTSO", "poolLtsoBagM", "poolLtsoBagF", "poolLtsoDfoM", "poolLtsoDfoF"), s("TSO", "poolTsoBagM", "poolTsoBagF", "poolTsoDfoM", "poolTsoDfoF"), H(o), o;
}
function H(o) {
  var t = $(o) > 0, n = G(o) > 0;
  return o.poolBag = $(o), o.poolStsoDfo = l(o.poolStsoDfoM) + l(o.poolStsoDfoF), o.poolLtsoDfo = l(o.poolLtsoDfoM) + l(o.poolLtsoDfoF), o.poolTsoDfo = l(o.poolTsoDfoM) + l(o.poolTsoDfoF), o.mode = t && n ? "both" : t ? "bag" : n ? "dfo" : "none", o;
}
function no(o) {
  o = o || A();
  var t = m.state.lines || [];
  t.forEach(function(p) {
    p.isExtra || p.extraPositionId || (p.functionEligible = { dfo: !1, bag: !1, pax: !1 }, p.function = "");
  });
  var n = m.computeShiftAnchors(), s = o.phaseThresholdMin || 15;
  function e(p) {
    return (!p.functionEligible || typeof p.functionEligible != "object") && (p.functionEligible = { dfo: !1, bag: !1, pax: !1 }), p.functionEligible;
  }
  function r(p, F) {
    return t.filter(function(c) {
      if (c.isExtra || c.extraPositionId) return !1;
      var g = e(c);
      return m.lineRoleKey(c) === p && c.sex === F && !g.bag && !g.dfo;
    });
  }
  function a(p, F, c) {
    if (!c || c <= 0) return { total: 0 };
    var g = r(p, F).slice();
    g.sort(function(D, L) {
      return m.lineStartMin(D) - m.lineStartMin(L) || String(D.id).localeCompare(String(L.id));
    });
    for (var h = 0, M = 0; M < g.length && h < c; M++)
      e(g[M]).bag = !0, h++;
    return { total: h };
  }
  function u(p, F, c) {
    if (!c || c <= 0) return { am: 0, pm: 0, total: 0 };
    var g = r(p, F).slice();
    g.sort(function(v, T) {
      return m.lineStartMin(v) - m.lineStartMin(T) || String(v.id).localeCompare(String(T.id));
    });
    var h = g.filter(function(v) {
      return m.isAmSide(m.lineStartMin(v), n, s);
    }), M = g.filter(function(v) {
      return !m.isAmSide(m.lineStartMin(v), n, s);
    }), D = o.bands || [], L = D[0], P = D[D.length - 1];
    function w(v, T) {
      if (!T) return !1;
      var O = m.timeToMin(T.start), x = m.getShift(v.shiftId);
      if (!x) return !1;
      var C = m.timeToMin(x.start), q = m.timeToMin(x.end);
      return q <= C && (q += 1440), O >= C && O < q;
    }
    h.sort(function(v, T) {
      var O = w(v, L) ? 0 : 1, x = w(T, L) ? 0 : 1;
      return O !== x ? O - x : m.lineStartMin(v) - m.lineStartMin(T) || String(v.id).localeCompare(String(T.id));
    }), M.sort(function(v, T) {
      var O = w(v, P) ? 0 : 1, x = w(T, P) ? 0 : 1;
      return O !== x ? O - x : m.lineStartMin(v) - m.lineStartMin(T) || String(v.id).localeCompare(String(T.id));
    });
    var E = o.amPmSplit ? Math.ceil(c / 2) : c, y = o.amPmSplit ? Math.floor(c / 2) : 0;
    for (h.length < E && (y += E - h.length, E = h.length), M.length < y && (E = Math.min(h.length, E + (y - M.length)), y = M.length); E + y > c; )
      if (y >= E && y > 0) y--;
      else if (E > 0) E--;
      else break;
    function _(v, T) {
      for (var O = 0, x = 0; x < v.length && O < T; x++) {
        var C = e(v[x]);
        C.bag || C.dfo || (C.dfo = !0, O++);
      }
      return O;
    }
    var I = _(h, E), k = _(M, y), X = c - I - k;
    return X > 0 && (k += _(r(p, F), X)), { am: I, pm: k, total: I + k };
  }
  var i = {
    stso: { m: a("STSO", "M", o.poolStsoBagM).total, f: a("STSO", "F", o.poolStsoBagF).total },
    ltso: { m: a("LTSO", "M", o.poolLtsoBagM).total, f: a("LTSO", "F", o.poolLtsoBagF).total },
    tso: { m: a("TSO", "M", o.poolTsoBagM).total, f: a("TSO", "F", o.poolTsoBagF).total }
  };
  i.stso.total = i.stso.m + i.stso.f, i.ltso.total = i.ltso.m + i.ltso.f, i.tso.total = i.tso.m + i.tso.f;
  var f = {
    stso: u("STSO", "M", o.poolStsoDfoM),
    stsoF: u("STSO", "F", o.poolStsoDfoF),
    ltso: u("LTSO", "M", o.poolLtsoDfoM),
    ltsoF: u("LTSO", "F", o.poolLtsoDfoF),
    tso: u("TSO", "M", o.poolTsoDfoM),
    tsoF: u("TSO", "F", o.poolTsoDfoF)
  };
  return {
    bag: i,
    stso: { total: f.stso.total + f.stsoF.total, am: f.stso.am + f.stsoF.am, pm: f.stso.pm + f.stsoF.pm },
    ltso: { total: f.ltso.total + f.ltsoF.total, am: f.ltso.am + f.ltsoF.am, pm: f.ltso.pm + f.ltsoF.pm },
    tso: { total: f.tso.total + f.tsoF.total, am: f.tso.am + f.tsoF.am, pm: f.tso.pm + f.tsoF.pm },
    anchors: n
  };
}
function ao() {
  return [
    { start: "03:30", end: "04:00", stso: 1, ltso: 1, tso: 2 },
    { start: "04:00", end: "20:30", stso: 1, ltso: 1, tso: 6 },
    { start: "20:30", end: "23:00", stso: 1, ltso: 1, tso: 3 }
  ];
}
const To = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagPoolTotal: $,
  bindPoolsApi: K,
  buildCertifiedPools: no,
  capFunctionPoolsToFte: to,
  dfoPoolTotal: G,
  ensureFunctionCoverage: A,
  fteCapsByRoleSex: U,
  getFunctionMode: oo
}, Symbol.toStringTag, { value: "Module" }));
let S = null;
function Fo(o) {
  S = o;
}
function eo(o) {
  return o ? o.isExtra || o.extraPositionId ? o.empClass || o.position || "EXTRA" : o.isStso || o.empClass === "STSO" ? "STSO" : o.isLtso || o.empClass === "LTSO" ? "LTSO" : "TSO" : "TSO";
}
function Do(o) {
  var t = eo(o);
  return t === "STSO" || t === "LTSO" || t === "TSO";
}
function Bo(o) {
  return !o || o.isExtra || o.extraPositionId ? !1 : o.function === "DFO" || !!(o.functionEligible && o.functionEligible.dfo);
}
function xo(o, t) {
  var n = S.state.functionRotation || {}, s = n[String(o)] || n[o];
  if (s) {
    var e = s[t];
    return e == null || e === "" ? null : e;
  }
  var r = null;
  if (S.state && Array.isArray(S.state.lines)) {
    for (var a = 0; a < S.state.lines.length; a++)
      if (String(S.state.lines[a].id) === String(o)) {
        r = S.state.lines[a];
        break;
      }
  }
  return r && (r.function === "BAG" || r.function === "DFO" || r.function === "PAX") ? r.function : null;
}
function Oo(o) {
  var t = S.getShift(o.shiftId);
  return t ? S.timeToMin(t.start) : 0;
}
function z(o, t, n) {
  return n = n ?? 15, t = t || V(), o <= t.am - n && o < 11 * 60 ? "Opening" : o >= t.pm + n && o >= 11 * 60 + 15 ? "Closing" : o < t.pm ? "AM" : "PM";
}
function Lo(o, t, n) {
  return z(o, t, n) === "Opening" || z(o, t, n) === "AM";
}
function Eo(o, t, n) {
  var s = S.state.schedule[o.id] || S.state.schedule[String(o.id)];
  if (!s || s[t] !== "WORK") return !1;
  var e = t % 7, r = S.getEffectiveShiftTimes ? S.getEffectiveShiftTimes(o.shiftId, e) : null;
  if (!r) {
    var a = S.getShift(o.shiftId);
    if (!a) return !1;
    r = { start: a.start, end: a.end };
  }
  var u = S.timeToMin(r.start), i = S.timeToMin(r.end);
  return i <= u ? n >= u || n < i : n >= u && n < i;
}
function yo(o, t) {
  t = t || S.ensureFunctionCoverage().bands;
  for (var n = 0; n < t.length; n++) {
    var s = t[n], e = S.timeToMin(s.start), r = S.timeToMin(s.end);
    r <= e && (r += 1440);
    var a = o;
    if (r > 1440 && a < e && (a += 1440), a >= e && a < r) return s;
  }
  return null;
}
function V() {
  var o = {};
  (S.state.lines || []).forEach(function(a) {
    var u = S.getShift(a.shiftId);
    if (u) {
      var i = S.timeToMin(u.start);
      o[i] = (o[i] || 0) + 1;
    }
  });
  var t = Object.keys(o).map(function(a) {
    return { min: +a, n: o[a] };
  }).sort(function(a, u) {
    return a.min - u.min;
  });
  if (!t.length) return { am: 8 * 60, pm: 14 * 60 };
  var n = t[0].min, s = 0;
  t.forEach(function(a) {
    a.min < 11 * 60 && a.n > s && (s = a.n, n = a.min);
  });
  var e = t[t.length - 1].min, r = 0;
  return t.forEach(function(a) {
    a.min >= 11 * 60 + 15 && a.n > r && (r = a.n, e = a.min);
  }), r === 0 && t.forEach(function(a) {
    a.min >= 12 * 60 && a.n > r && (r = a.n, e = a.min);
  }), { am: n, pm: e };
}
function Ao() {
  (S.state.lines || []).forEach(function(o) {
    o.function = "", o.functionEligible = { dfo: !1, bag: !1, pax: !1 };
  }), S.state.functionRotation = {};
}
let d = null;
function ro(o) {
  d = o;
}
function b(o) {
  return Math.max(0, Math.floor(+o || 0));
}
function B(o, t) {
  const n = d.$(o);
  n && (n.value = t);
}
function io(o, t) {
  const n = d.$(o);
  n && (n.checked = !!t);
}
function so(o) {
  const t = d.$(o);
  return t ? b(t.value) : null;
}
function W() {
  const o = A();
  B("fc-pool-bag-stso-m", o.poolStsoBagM), B("fc-pool-bag-stso-f", o.poolStsoBagF), B("fc-pool-bag-ltso-m", o.poolLtsoBagM), B("fc-pool-bag-ltso-f", o.poolLtsoBagF), B("fc-pool-bag-tso-m", o.poolTsoBagM), B("fc-pool-bag-tso-f", o.poolTsoBagF), B("fc-pool-dfo-stso-m", o.poolStsoDfoM), B("fc-pool-dfo-stso-f", o.poolStsoDfoF), B("fc-pool-dfo-ltso-m", o.poolLtsoDfoM), B("fc-pool-dfo-ltso-f", o.poolLtsoDfoF), B("fc-pool-dfo-tso-m", o.poolTsoDfoM), B("fc-pool-dfo-tso-f", o.poolTsoDfoF);
  const t = d.$("fc-bands-wrap"), n = d.$("fc-add-band");
  t && (t.style.display = ""), n && (n.style.display = "");
}
function J() {
  const o = A();
  B("fc-phase-thr", o.phaseThresholdMin), io("fc-ampm-split", o.amPmSplit), B("fc-bias", o.bias || "none"), W(), Q(), Y(), j && j();
}
function lo() {
  J();
  const o = d.$("func-coverage-modal");
  o && (o.style.display = "block");
}
function fo() {
  const o = d.$("func-coverage-modal");
  o && (o.style.display = "none");
}
function uo(o) {
  var t = $(o) > 0, n = G(o) > 0;
  return o.poolBag = $(o), o.poolStsoDfo = b(o.poolStsoDfoM) + b(o.poolStsoDfoF), o.poolLtsoDfo = b(o.poolLtsoDfoM) + b(o.poolLtsoDfoF), o.poolTsoDfo = b(o.poolTsoDfoM) + b(o.poolTsoDfoF), o.mode = t && n ? "both" : t ? "bag" : n ? "dfo" : "none", o.mode;
}
function Q() {
  const o = d.$("fc-bands-tbody");
  if (!o) return;
  const t = A().bands;
  o.innerHTML = t.map(function(n, s) {
    function e(r) {
      return '<td><input type="number" min="0" max="99" data-fc-band="' + s + '" data-fc-field="' + r + '" value="' + (n[r] != null ? n[r] : 0) + '" style="width:3.5rem"></td>';
    }
    return '<tr><td><input type="time" data-fc-band="' + s + '" data-fc-field="start" value="' + (n.start || "00:00") + '" step="900"></td><td><input type="time" data-fc-band="' + s + '" data-fc-field="end" value="' + (n.end || "00:00") + '" step="900"></td>' + e("stso") + e("ltso") + e("tso") + '<td><button type="button" class="btn btn-red btn-sm" data-fc-remove="' + s + '">✕</button></td></tr>';
  }).join("");
}
function po() {
  const o = A();
  function t(i, f) {
    var p = so(i);
    p != null && (o[f] = p);
  }
  t("fc-pool-bag-stso-m", "poolStsoBagM"), t("fc-pool-bag-stso-f", "poolStsoBagF"), t("fc-pool-bag-ltso-m", "poolLtsoBagM"), t("fc-pool-bag-ltso-f", "poolLtsoBagF"), t("fc-pool-bag-tso-m", "poolTsoBagM"), t("fc-pool-bag-tso-f", "poolTsoBagF"), t("fc-pool-dfo-stso-m", "poolStsoDfoM"), t("fc-pool-dfo-stso-f", "poolStsoDfoF"), t("fc-pool-dfo-ltso-m", "poolLtsoDfoM"), t("fc-pool-dfo-ltso-f", "poolLtsoDfoF"), t("fc-pool-dfo-tso-m", "poolTsoDfoM"), t("fc-pool-dfo-tso-f", "poolTsoDfoF"), uo(o);
  const n = d.$("fc-phase-thr"), s = d.$("fc-ampm-split");
  n && (o.phaseThresholdMin = b(n.value || 15)), s && (o.amPmSplit = !!s.checked);
  const e = d.$("fc-bias");
  if (e) {
    var r = e.value;
    r === "male" || r === "female" || r === "none" ? o.bias = r : o.bias = "none";
  }
  for (var a = 0; a < o.bands.length; a++) {
    var u = o.bands[a] || {};
    ["start", "end", "stso", "ltso", "tso"].forEach(function(i) {
      var f = document.querySelector('[data-fc-band="' + a + '"][data-fc-field="' + i + '"]');
      f && (i === "start" || i === "end" ? u[i] = f.value || u[i] : u[i] = b(f.value));
    }), o.bands[a] = u;
  }
  return o.bands.sort(function(i, f) {
    return d.timeToMin(i.start) - d.timeToMin(f.start);
  }), o;
}
function Y() {
  const o = d.$("fc-preview");
  if (!o) return;
  const t = A(), n = V(), s = (t.bands || []).map(function(e) {
    return (e.start || "?") + "-" + (e.end || "?") + " bag-need " + (e.stso || 0) + "-" + (e.ltso || 0) + "-" + (e.tso || 0);
  }).join(" | ");
  o.textContent = "BAG STSO " + t.poolStsoBagM + "/" + t.poolStsoBagF + " LTSO " + t.poolLtsoBagM + "/" + t.poolLtsoBagF + " TSO " + t.poolTsoBagM + "/" + t.poolTsoBagF + " · DFO STSO " + t.poolStsoDfoM + "/" + t.poolStsoDfoF + " LTSO " + t.poolLtsoDfoM + "/" + t.poolLtsoDfoF + " TSO " + t.poolTsoDfoM + "/" + t.poolTsoDfoF + " · AM " + d.slotLabel(n.am) + " PM " + d.slotLabel(n.pm) + " " + (s || "no bands");
}
function N() {
  return [{ start: "04:00", end: "20:30", min: 1 }];
}
function R() {
  return Array.isArray(d.state.extraPositions) || (d.state.extraPositions = []), d.state.extraPositions.forEach(function(o, t) {
    o.id || (o.id = "extra-" + (t + 1)), o.name || (o.name = "Position"), o.m = b(o.m), o.f = b(o.f), (!Array.isArray(o.bands) || !o.bands.length) && (o.bands = N());
  }), d.state.extraPositions;
}
function Z() {
  const o = R();
  return o.forEach(function(t) {
    const n = d.$('[data-extra-name="' + t.id + '"]'), s = d.$('[data-extra-m="' + t.id + '"]'), e = d.$('[data-extra-f="' + t.id + '"]');
    n && (t.name = String(n.value || t.name).trim() || t.name), s && (t.m = b(s.value)), e && (t.f = b(e.value)), Array.isArray(t.bands) || (t.bands = N());
    for (var r = 0; r < t.bands.length; r++) {
      var a = t.bands[r] || {};
      ["start", "end", "min"].forEach(function(u) {
        var i = d.$('[data-extra-band="' + t.id + '"][data-extra-bi="' + r + '"][data-extra-bf="' + u + '"]');
        i && (u === "min" ? a[u] = b(i.value) : a[u] = i.value || a[u]);
      }), t.bands[r] = a;
    }
  }), o;
}
function j() {
  const o = d.$("extra-pos-list");
  if (!o) return;
  const t = R();
  o.innerHTML = t.map(function(n) {
    var s = (n.bands || []).map(function(e, r) {
      return '<tr><td><input type="time" data-extra-band="' + n.id + '" data-extra-bi="' + r + '" data-extra-bf="start" value="' + (e.start || "04:00") + '" step="900"></td><td><input type="time" data-extra-band="' + n.id + '" data-extra-bi="' + r + '" data-extra-bf="end" value="' + (e.end || "20:30") + '" step="900"></td><td><input type="number" min="0" max="99" data-extra-band="' + n.id + '" data-extra-bi="' + r + '" data-extra-bf="min" value="' + (e.min != null ? e.min : 0) + '" style="width:3.5rem"></td><td><button type="button" class="btn btn-red btn-sm" data-extra-band-remove="' + n.id + '" data-extra-bi="' + r + '">✕</button></td></tr>';
    }).join("");
    return '<div class="extra-pos-card" data-extra-card="' + n.id + '"><div class="fte-sex-row extra-pos-head"><label>Name <input type="text" data-extra-name="' + n.id + '" value="' + String(n.name || "").replace(/"/g, "&quot;") + '" style="width:7rem"></label><label>Male <input type="number" min="0" data-extra-m="' + n.id + '" value="' + b(n.m) + '" style="width:4.5rem"></label><label>Female <input type="number" min="0" data-extra-f="' + n.id + '" value="' + b(n.f) + '" style="width:4.5rem"></label><button type="button" class="btn btn-red btn-sm" data-extra-remove="' + n.id + '">Remove</button><button type="button" class="btn btn-sm" data-extra-add-band="' + n.id + '">+ Band</button></div><div class="lines-scroll extra-pos-bands"><table class="data-table"><thead><tr><th>Start</th><th>End</th><th>Min</th><th></th></tr></thead><tbody>' + s + "</tbody></table></div></div>";
  }).join("");
}
function co(o) {
  Z();
  var t = R();
  t.push({ id: "extra-" + Date.now() + "-" + (t.length + 1), name: o || "MSTI", m: 0, f: 0, bands: N() }), j();
}
function mo() {
  var o = [], t = R(), n = d.state.shifts || [], s = n[0] || { id: "", name: "Shift", start: "04:00", end: "20:30", paid: 8, rdoHard: [] };
  return t.forEach(function(e, r) {
    var a = b(e.m) + b(e.f);
    if (!a) return;
    (!e.bands || !e.bands.length) && d.state.issues.push((e.name || "Position") + ": no coverage bands.");
    var u = 3e4 + r * 1e3, i = 0;
    function f(p, F) {
      for (var c = 0; c < F; c++) {
        for (var g = n[i % Math.max(1, n.length)] || s, h = (+g.paid || 8) >= 10 ? 4 : 5, M = 7 - h, D = Array.isArray(g.rdoHard) ? g.rdoHard.map(Number).filter(function(w) {
          return w >= 0 && w <= 6;
        }) : [], L = D.length ? D.slice(0, M) : d.consecutiveRdos ? d.consecutiveRdos(M, (u + i) % 7) : [0, 6]; L.length < M; )
          for (var P = 0; P < 7 && L.length < M; P++) L.indexOf(P) < 0 && L.push(P);
        o.push({
          id: u + i + 1,
          lineCode: String(e.name || "POS") + " " + String(i + 1).padStart(2, "0"),
          shiftId: g.id,
          shiftName: g.name,
          shiftLabel: d.shiftLabel ? d.shiftLabel(g) : (g.start || "") + "-" + (g.end || ""),
          empClass: e.name || "EXTRA",
          position: e.name || "EXTRA",
          isLtso: !1,
          isStso: !1,
          isExtra: !0,
          extraPositionId: e.id,
          sex: p,
          function: "",
          rdoDays: L,
          rdoHard: D.length > 0,
          paid: g.paid || 8
        }), i++;
      }
    }
    f("M", b(e.m)), f("F", b(e.f));
  }), o;
}
const Po = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addExtraPosition: co,
  bindBandsApi: ro,
  buildExtraPositionLines: mo,
  closeFunctionCoverageModal: fo,
  ensureExtraPositions: R,
  fillFunctionCoverageForm: J,
  openFunctionCoverageModal: lo,
  readExtraPositionsFromDom: Z,
  readFunctionBandsFromDom: po,
  renderExtraPositions: j,
  renderFunctionBandsTable: Q,
  syncFunctionModeUi: W,
  updateFunctionCoveragePreview: Y
}, Symbol.toStringTag, { value: "Module" }));
function go() {
  throw new Error("TODO function-coverage: generateFunctionAssignments");
}
function So() {
  throw new Error("TODO function-coverage: markDfo");
}
function bo() {
  throw new Error("TODO function-coverage: markBag");
}
function vo() {
  throw new Error("TODO function-coverage: fillBandShortfalls");
}
function Mo() {
  throw new Error("TODO function-coverage: bagSlotCounts");
}
function ho() {
  throw new Error("TODO function-coverage: worstBagCoverage");
}
const wo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagSlotCounts: Mo,
  fillBandShortfalls: vo,
  generateFunctionAssignments: go,
  markBag: bo,
  markDfo: So,
  worstBagCoverage: ho
}, Symbol.toStringTag, { value: "Module" }));
function Co(o) {
  return bindDutyApi(o), bindPoolsApi(o), bindBandsApi(o), o;
}
export {
  co as addExtraPosition,
  wo as assign,
  $ as bagPoolTotal,
  yo as bandForMinute,
  Po as bands,
  ro as bindBandsApi,
  Fo as bindDutyApi,
  K as bindPoolsApi,
  no as buildCertifiedPools,
  mo as buildExtraPositionLines,
  to as capFunctionPoolsToFte,
  Ao as clearLineFunctions,
  fo as closeFunctionCoverageModal,
  V as computeShiftAnchors,
  G as dfoPoolTotal,
  R as ensureExtraPositions,
  A as ensureFunctionCoverage,
  J as fillFunctionCoverageForm,
  U as fteCapsByRoleSex,
  oo as getFunctionMode,
  xo as getRotationDuty,
  Co as initFunctionCoverage,
  Lo as isAmSide,
  Do as isOpsFunctionRole,
  Eo as lineCoversSlot,
  Bo as lineIsDfoTagged,
  eo as lineRoleKey,
  Oo as lineStartMin,
  lo as openFunctionCoverageModal,
  z as phaseOfStart,
  To as pools,
  Z as readExtraPositionsFromDom,
  po as readFunctionBandsFromDom,
  j as renderExtraPositions,
  Q as renderFunctionBandsTable,
  W as syncFunctionModeUi,
  Y as updateFunctionCoveragePreview
};
