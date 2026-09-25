let T = null;
function fn(t) {
  T = t;
}
function tt(t) {
  return t ? t.isExtra || t.extraPositionId ? t.empClass || t.position || "EXTRA" : t.isStso || t.empClass === "STSO" ? "STSO" : t.isLtso || t.empClass === "LTSO" ? "LTSO" : "TSO" : "TSO";
}
function un(t) {
  var n = tt(t);
  return n === "STSO" || n === "LTSO" || n === "TSO";
}
function ln(t) {
  return !t || t.isExtra || t.extraPositionId ? !1 : t.function === "DFO" || !!(t.functionEligible && t.functionEligible.dfo);
}
function Gt(t, n) {
  var e = T.state.functionRotation || {}, r = e[String(t)] || e[t];
  if (r) {
    var o = r[n];
    return o == null || o === "" ? null : o;
  }
  var i = null;
  if (T.state && Array.isArray(T.state.lines)) {
    for (var a = 0; a < T.state.lines.length; a++)
      if (String(T.state.lines[a].id) === String(t)) {
        i = T.state.lines[a];
        break;
      }
  }
  return i && (i.function === "BAG" || i.function === "DFO" || i.function === "PAX") ? i.function : null;
}
function P(t) {
  var n = T.getShift(t.shiftId);
  return n ? T.timeToMin(n.start) : 0;
}
function ht(t, n, e) {
  return e = e ?? 15, n = n || ut(), t <= n.am - e && t < 11 * 60 ? "Opening" : t >= n.pm + e && t >= 11 * 60 + 15 ? "Closing" : t < n.pm ? "AM" : "PM";
}
function bt(t, n, e) {
  return ht(t, n, e) === "Opening" || ht(t, n, e) === "AM";
}
function Ht(t, n, e) {
  var r = T.state.schedule[t.id] || T.state.schedule[String(t.id)];
  if (!r || r[n] !== "WORK") return !1;
  var o = n % 7, i = T.state && T.state.startDate;
  i && (o = T.weekdaySun0 && T.addDays ? T.weekdaySun0(T.addDays(i, n)) : T.dj ? T.dj(i).add(n).day() : n % 7);
  var a = T.getEffectiveShiftTimes ? T.getEffectiveShiftTimes(t.shiftId, o) : null;
  if (!a) {
    var u = T.getShift(t.shiftId);
    if (!u) return !1;
    a = { start: u.start, end: u.end };
  }
  var s = T.timeToMin(a.start), f = T.timeToMin(a.end);
  return f <= s ? e >= s || e < f : e >= s && e < f;
}
function dn(t, n) {
  if (n = n || T.ensureFunctionCoverage && T.ensureFunctionCoverage().bands || [], !Array.isArray(n) || !n.length) return null;
  for (var e = 0; e < n.length; e++) {
    var r = n[e], o = T.timeToMin(r.start), i = T.timeToMin(r.end);
    i <= o && (i += 1440);
    var a = t;
    if (i > 1440 && a < o && (a += 1440), a >= o && a < i) return r;
  }
  return null;
}
function ut() {
  var t = {};
  (T.state.lines || []).forEach(function(a) {
    var u = T.getShift(a.shiftId);
    if (u) {
      var s = T.timeToMin(u.start);
      t[s] = (t[s] || 0) + 1;
    }
  });
  var n = Object.keys(t).map(function(a) {
    return { min: +a, n: t[a] };
  }).sort(function(a, u) {
    return a.min - u.min;
  });
  if (!n.length) return { am: 8 * 60, pm: 14 * 60 };
  var e = n[0].min, r = 0;
  n.forEach(function(a) {
    a.min < 11 * 60 && a.n > r && (r = a.n, e = a.min);
  });
  var o = n[n.length - 1].min, i = 0;
  return n.forEach(function(a) {
    a.min >= 11 * 60 + 15 && a.n > i && (i = a.n, o = a.min);
  }), i === 0 && n.forEach(function(a) {
    a.min >= 12 * 60 && a.n > i && (i = a.n, o = a.min);
  }), { am: e, pm: o };
}
function cn() {
  (T.state.lines || []).forEach(function(t) {
    t.function = "", t.functionEligible = { dfo: !1, bag: !1, pax: !1 };
  }), T.state.functionRotation = {};
}
let y = null;
function Xt(t) {
  y = t;
}
function M(t) {
  return Math.max(0, Math.floor(+t || 0));
}
function nt() {
  return { STSO: {}, LTSO: {}, TSO: {} };
}
function zt(t) {
  var n = nt();
  return !t || typeof t != "object" || ["STSO", "LTSO", "TSO"].forEach(function(e) {
    var r = t[e];
    !r || typeof r != "object" || Object.keys(r).forEach(function(o) {
      if (o) {
        var i = r[o] || {}, a = M(i.min), u = i.max == null ? a : M(i.max);
        u < a && (u = a), n[e][String(o)] = { min: a, max: u };
      }
    });
  }), n;
}
function V(t) {
  var n = [], e = {};
  t && Array.isArray(t.requirementShiftIds) && t.requirementShiftIds.forEach(function(o) {
    var i = String(o || "");
    !i || e[i] || (e[i] = !0, n.push(i));
  });
  var r = t && t.requirements || {};
  return ["STSO", "LTSO", "TSO"].forEach(function(o) {
    var i = r[o] || {};
    Object.keys(i).forEach(function(a) {
      var u = String(a || "");
      !u || e[u] || (e[u] = !0, n.push(u));
    });
  }), n;
}
function Nt(t) {
  return t = t || y && y.state && y.state.functionCoverage || {}, !y || typeof y.getShift != "function" ? [] : V(t).map(function(n) {
    return y.getShift(n);
  }).filter(Boolean);
}
function I(t, n, e) {
  e = e || y && y.state && y.state.functionCoverage || {};
  var r = e.requirements && e.requirements[t] && e.requirements[t][n];
  if (!r) return { min: 0, max: 0 };
  var o = M(r.min), i = r.max == null ? o : M(r.max);
  return i < o && (i = o), { min: o, max: i };
}
function Kt(t, n, e, r, o) {
  if (o = o || y && y.state && y.state.functionCoverage, !o) return null;
  o.requirements || (o.requirements = nt()), o.requirements[t] || (o.requirements[t] = {});
  var i = M(e), a = r == null ? i : M(r);
  return a < i && (a = i), o.requirements[t][String(n)] = { min: i, max: a }, o.requirements[t][String(n)];
}
function Y(t, n, e) {
  if (e = e || {}, !y || !y.state) return [];
  var r = y.state.lines || [];
  return r.filter(function(o) {
    return !(!o || o.isExtra || o.extraPositionId || !o.shiftId || String(o.shiftId) !== String(n) || typeof y.getShift == "function" && !y.getShift(o.shiftId) || tt(o) !== t || e.sex && o.sex !== e.sex);
  });
}
function Mt() {
  var t = y && y.state && y.state.shifts || [], n = null, e = null;
  return t.forEach(function(r) {
    if (!(!r || !r.id)) {
      var o = y.timeToMin ? y.timeToMin(r.start) : 0;
      (!n || o < y.timeToMin(n.start)) && (n = r), (!e || o > y.timeToMin(e.start)) && (e = r);
    }
  }), { open: n, close: e };
}
function J(t, n) {
  return !!(t && n && String(t.shiftId) === String(n.id));
}
function Ut(t) {
  if (!t) return "";
  var n = (t.requiredMin != null ? t.requiredMin : 0) + "-" + (t.requiredMax != null ? t.requiredMax : 0);
  return t.role + " / Shift " + (t.shiftLabel || t.shiftId) + " Eligible: " + t.eligible + " Required: " + n + " Assigned: " + t.assigned + " Status: " + (t.status || "OK");
}
const En = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bindShiftsApi: Xt,
  configuredShiftIdsFromRequirements: V,
  emptyRequirements: nt,
  formatRequirementDiagnostic: Ut,
  getConfiguredFunctionShifts: Nt,
  getEligibleLinesForShift: Y,
  getShiftRequirement: I,
  lineOnShift: J,
  normalizeRequirements: zt,
  num0: M,
  openingAndClosingShifts: Mt,
  setShiftRequirement: Kt
}, Symbol.toStringTag, { value: "Module" }));
function mn(t, n) {
  var e = n.toLowerCase(), r = t[e + "Min"] != null ? M(t[e + "Min"]) : M(t[e]), o = t[e + "Max"] != null ? M(t[e + "Max"]) : r;
  return o < r && (o = r), { min: r, max: o };
}
function St(t, n, e) {
  e.push(n), t && Array.isArray(t) && t.indexOf(n) < 0 && t.push(n);
}
function Ft(t, n) {
  n = n || {};
  var e = Array.isArray(n.shifts) ? n.shifts : [], r = n.issues, o = {
    ok: !0,
    migrated: !1,
    mapped: 0,
    unmapped: [],
    ambiguous: [],
    warnings: []
  };
  if (!t || typeof t != "object") return o;
  (!t.requirements || typeof t.requirements != "object") && (t.requirements = nt()), ["STSO", "LTSO", "TSO"].forEach(function(s) {
    (!t.requirements[s] || typeof t.requirements[s] != "object") && (t.requirements[s] = {});
  });
  var i = Array.isArray(t.bands) ? t.bands : [];
  if (!i.length)
    return delete t.bands, o;
  var a = {}, u = [];
  return i.forEach(function(s) {
    if (!s || typeof s != "object" || !s.start || !s.end) {
      s && u.push(s), o.ok = !1;
      return;
    }
    var f = e.filter(function(d) {
      return d && d.start === s.start && d.end === s.end;
    });
    if (!f.length) {
      St(
        r,
        "Function coverage: legacy band " + s.start + "–" + s.end + " could not be mapped to a shift (no exact start/end match).",
        o.warnings
      ), o.unmapped.push({ start: s.start, end: s.end }), u.push(s), o.ok = !1;
      return;
    }
    if (f.length > 1) {
      St(
        r,
        "Function coverage: legacy band " + s.start + "–" + s.end + " matches multiple shifts (" + f.map(function(d) {
          return d.name || d.id;
        }).join(", ") + ") — not mapped.",
        o.warnings
      ), o.ambiguous.push({
        start: s.start,
        end: s.end,
        shiftIds: f.map(function(d) {
          return d.id;
        })
      }), u.push(s), o.ok = !1;
      return;
    }
    var l = f[0];
    if (a[l.id]) {
      St(
        r,
        "Function coverage: multiple legacy bands map to shift " + (l.name || l.id) + " — not mapped.",
        o.warnings
      ), o.ambiguous.push({ start: s.start, end: s.end, shiftId: l.id }), u.push(s), o.ok = !1;
      return;
    }
    a[l.id] = !0, ["STSO", "LTSO", "TSO"].forEach(function(d) {
      if (!t.requirements[d][l.id]) {
        var m = mn(s, d);
        t.requirements[d][l.id] = { min: m.min, max: m.max };
      }
    }), Array.isArray(t.requirementShiftIds) || (t.requirementShiftIds = []), t.requirementShiftIds.indexOf(l.id) < 0 && t.requirementShiftIds.push(l.id), o.mapped++;
  }), u.length ? t.bands = u : delete t.bands, o.migrated = o.mapped > 0, o;
}
const Ln = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  migrateFunctionCoverageConfig: Ft
}, Symbol.toStringTag, { value: "Module" }));
let O = null;
function Wt(t) {
  O = t;
}
function b(t) {
  return Math.max(0, Math.floor(+t || 0));
}
function W(t) {
  return b(t.poolStsoBagM) + b(t.poolStsoBagF) + b(t.poolLtsoBagM) + b(t.poolLtsoBagF) + b(t.poolTsoBagM) + b(t.poolTsoBagF);
}
function xt(t) {
  return b(t.poolStsoDfoM) + b(t.poolStsoDfoF) + b(t.poolLtsoDfoM) + b(t.poolLtsoDfoF) + b(t.poolTsoDfoM) + b(t.poolTsoDfoF);
}
function B() {
  O.state.functionCoverage || (O.state.functionCoverage = {});
  var t = O.state.functionCoverage;
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
  ].forEach(function(n) {
    t[n] == null && (t[n] = 0);
  }), t.poolStsoDfo == null && (t.poolStsoDfo = b(t.poolStsoDfoM) + b(t.poolStsoDfoF)), t.poolLtsoDfo == null && (t.poolLtsoDfo = b(t.poolLtsoDfoM) + b(t.poolLtsoDfoF)), t.poolTsoDfo == null && (t.poolTsoDfo = b(t.poolTsoDfoM) + b(t.poolTsoDfoF)), t.poolBag == null && (t.poolBag = W(t)), !t.poolStsoDfoM && !t.poolStsoDfoF && t.poolStsoDfo && (t.poolStsoDfoM = t.poolStsoDfo), !t.poolLtsoDfoM && !t.poolLtsoDfoF && t.poolLtsoDfo && (t.poolLtsoDfoM = t.poolLtsoDfo), !t.poolTsoDfoM && !t.poolTsoDfoF && t.poolTsoDfo && (t.poolTsoDfoM = t.poolTsoDfo), !t.poolTsoBagM && !t.poolTsoBagF && t.poolBag && (t.poolTsoBagM = t.poolBag), t.amPmSplit == null && (t.amPmSplit = !0), t.phaseThresholdMin == null && (t.phaseThresholdMin = 15), t.bias == null && (t.bias = "none"), O.state.functionRotation || (O.state.functionRotation = {}), Array.isArray(t.bands) && t.bands.length && !t._bandMigrationAttempted && (t._bandMigrationAttempted = !0, Ft(t, {
    shifts: O.state && O.state.shifts || [],
    issues: O.state && O.state.issues
  })), t.requirements = zt(t.requirements), Array.isArray(t.requirementShiftIds) || (t.requirementShiftIds = []), t.requirementShiftIds.length || ["STSO", "LTSO", "TSO"].forEach(function(n) {
    Object.keys(t.requirements[n] || {}).forEach(function(e) {
      t.requirementShiftIds.indexOf(e) < 0 && t.requirementShiftIds.push(e);
    });
  }), delete t.stsoIsDfo, delete t.poolDfo, delete t.poolPax, yt(t), t;
}
function Vt() {
  return yt(B());
}
function Ot() {
  var t = O.state || {};
  return {
    STSO: { M: b(t.stsoM), F: b(t.stsoF) },
    LTSO: { M: b(t.ltsoM), F: b(t.ltsoF) },
    TSO: { M: b(t.ftM) + b(t.ptM), F: b(t.ftF) + b(t.ptF) }
  };
}
function Dt(t, n) {
  t = t || B();
  var e = Ot();
  function r(o, i, a, u, s) {
    var f = e[o].M, l = e[o].F, d = b(t[i]), m = b(t[a]), g = b(t[u]), v = b(t[s]);
    d > f && (n && n.push("BAG " + o + " M pool " + d + " exceeds FTE " + f + " — capped."), d = f), m > l && (n && n.push("BAG " + o + " F pool " + m + " exceeds FTE " + l + " — capped."), m = l);
    var F = Math.max(0, f - d), S = Math.max(0, l - m);
    g > F && (n && n.push("DFO " + o + " M pool " + g + " exceeds remaining FTE " + F + " after BAG — capped."), g = F), v > S && (n && n.push("DFO " + o + " F pool " + v + " exceeds remaining FTE " + S + " after BAG — capped."), v = S), t[i] = d, t[a] = m, t[u] = g, t[s] = v;
  }
  return r("STSO", "poolStsoBagM", "poolStsoBagF", "poolStsoDfoM", "poolStsoDfoF"), r("LTSO", "poolLtsoBagM", "poolLtsoBagF", "poolLtsoDfoM", "poolLtsoDfoF"), r("TSO", "poolTsoBagM", "poolTsoBagF", "poolTsoDfoM", "poolTsoDfoF"), yt(t), t;
}
function yt(t) {
  var n = W(t) > 0, e = xt(t) > 0;
  return t.poolBag = W(t), t.poolStsoDfo = b(t.poolStsoDfoM) + b(t.poolStsoDfoF), t.poolLtsoDfo = b(t.poolLtsoDfoM) + b(t.poolLtsoDfoF), t.poolTsoDfo = b(t.poolTsoDfoM) + b(t.poolTsoDfoF), t.mode = n && e ? "both" : n ? "bag" : e ? "dfo" : "none", t;
}
function It(t) {
  var n = O.getShift ? O.getShift(t) : null;
  return n && O.timeToMin && n.start != null ? O.timeToMin(n.start) : 1e9;
}
function Et(t) {
  t = t || B();
  var n = O.state.lines || [];
  n.forEach(function(l) {
    l.isExtra || l.extraPositionId || (l.functionEligible = { dfo: !1, bag: !1, pax: !1 }, l.function = "");
  });
  var e = O.computeShiftAnchors(), r = t.phaseThresholdMin || 15;
  Mt();
  function o(l) {
    return (!l.functionEligible || typeof l.functionEligible != "object") && (l.functionEligible = { dfo: !1, bag: !1, pax: !1 }), l.functionEligible;
  }
  function i(l, d) {
    return n.filter(function(m) {
      if (m.isExtra || m.extraPositionId) return !1;
      var g = o(m);
      return O.lineRoleKey(m) === l && m.sex === d && !g.bag && !g.dfo;
    });
  }
  function a(l, d, m) {
    if (!m || m <= 0) return { total: 0 };
    var g = i(l, d).slice();
    g.sort(function(S, D) {
      return O.lineStartMin(S) - O.lineStartMin(D) || String(S.id).localeCompare(String(D.id));
    });
    for (var v = 0, F = 0; F < g.length && v < m; F++)
      o(g[F]).bag = !0, v++;
    return { total: v };
  }
  function u(l, d, m) {
    if (!m || m <= 0) return { am: 0, pm: 0, total: 0 };
    var g = i(l, d).slice(), v = [], F = {}, S = !1, D = t.requirements && t.requirements[l] || {};
    Object.keys(D).forEach(function(h) {
      var x = I(l, h, t);
      if (!(x.min <= 0 && x.max <= 0) && !(typeof O.getShift == "function" && !O.getShift(h))) {
        var A = String(h);
        F[A] || (F[A] = !0, v.push(A), S = !0);
      }
    }), v.length || g.forEach(function(h) {
      if (!(!h || h.shiftId == null || h.shiftId === "")) {
        var x = String(h.shiftId);
        F[x] || (F[x] = !0, v.push(x));
      }
    }), v.sort(function(h, x) {
      var A = It(h) - It(x);
      return A || String(h).localeCompare(String(x));
    });
    var E = {};
    v.forEach(function(h) {
      E[h] = [];
    }), g.forEach(function(h) {
      var x = h.shiftId != null ? String(h.shiftId) : "";
      E[x] && E[x].push(h);
    });
    function L(h) {
      h.sort(function(x, A) {
        return O.lineStartMin(x) - O.lineStartMin(A) || String(x.id).localeCompare(String(A.id));
      });
    }
    v.forEach(function(h) {
      L(E[h]);
    });
    var R = Math.min(m, g.length), Pt = v.map(function(h) {
      return S ? Math.max(I(l, h, t).min, 1) : 1;
    }), et = 0;
    Pt.forEach(function(h) {
      et += h;
    }), et || (et = 1);
    var w = [], ot = [], Rt = 0;
    v.forEach(function(h, x) {
      var A = R * Pt[x] / et, K = Math.floor(A);
      w[x] = K, Rt += K, ot.push({ i: x, frac: A - K });
    }), ot.sort(function(h, x) {
      return x.frac !== h.frac ? x.frac - h.frac : h.i - x.i;
    });
    for (var N = R - Rt, ct = 0; ct < ot.length && N > 0; ct++)
      w[ot[ct].i]++, N--;
    for (N = 0, v.forEach(function(h, x) {
      var A = E[h].length;
      w[x] > A && (N += w[x] - A, w[x] = A);
    }); N > 0; ) {
      for (var mt = -1, kt = -1, Z = 0; Z < v.length; Z++) {
        var gt = E[v[Z]].length - w[Z];
        gt <= 0 || gt > kt && (kt = gt, mt = Z);
      }
      if (mt < 0) break;
      w[mt]++, N--;
    }
    var H = [];
    if (v.forEach(function(h, x) {
      for (var A = E[h], K = w[x], it = 0; it < A.length && H.length < m && K > 0; it++) {
        var vt = o(A[it]);
        vt.bag || vt.dfo || (vt.dfo = !0, H.push(A[it]), K--);
      }
    }), H.length < m) {
      var rt = i(l, d).slice();
      L(rt);
      for (var at = 0; at < rt.length && H.length < m; at++) {
        var pt = o(rt[at]);
        pt.bag || pt.dfo || (pt.dfo = !0, H.push(rt[at]));
      }
    }
    var _t = 0, $t = 0;
    return H.forEach(function(h) {
      O.isAmSide(O.lineStartMin(h), e, r) ? _t++ : $t++;
    }), { am: _t, pm: $t, total: H.length };
  }
  var s = {
    stso: { m: a("STSO", "M", t.poolStsoBagM).total, f: a("STSO", "F", t.poolStsoBagF).total },
    ltso: { m: a("LTSO", "M", t.poolLtsoBagM).total, f: a("LTSO", "F", t.poolLtsoBagF).total },
    tso: { m: a("TSO", "M", t.poolTsoBagM).total, f: a("TSO", "F", t.poolTsoBagF).total }
  };
  s.stso.total = s.stso.m + s.stso.f, s.ltso.total = s.ltso.m + s.ltso.f, s.tso.total = s.tso.m + s.tso.f;
  var f = {
    stso: u("STSO", "M", t.poolStsoDfoM),
    stsoF: u("STSO", "F", t.poolStsoDfoF),
    ltso: u("LTSO", "M", t.poolLtsoDfoM),
    ltsoF: u("LTSO", "F", t.poolLtsoDfoF),
    tso: u("TSO", "M", t.poolTsoDfoM),
    tsoF: u("TSO", "F", t.poolTsoDfoF)
  };
  return {
    bag: s,
    stso: { total: f.stso.total + f.stsoF.total, am: f.stso.am + f.stsoF.am, pm: f.stso.pm + f.stsoF.pm },
    ltso: { total: f.ltso.total + f.ltsoF.total, am: f.ltso.am + f.ltsoF.am, pm: f.ltso.pm + f.ltsoF.pm },
    tso: { total: f.tso.total + f.tsoF.total, am: f.tso.am + f.tsoF.am, pm: f.tso.pm + f.tsoF.pm },
    anchors: e
  };
}
const An = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagPoolTotal: W,
  bindPoolsApi: Wt,
  buildCertifiedPools: Et,
  capFunctionPoolsToFte: Dt,
  dfoPoolTotal: xt,
  ensureFunctionCoverage: B,
  fteCapsByRoleSex: Ot,
  getFunctionMode: Vt
}, Symbol.toStringTag, { value: "Module" }));
let c = null;
function Zt(t) {
  c = t;
}
function C(t, n) {
  const e = c.$(t);
  e && (e.value = n);
}
function gn(t, n) {
  const e = c.$(t);
  e && (e.checked = !!n);
}
function pn(t) {
  const n = c.$(t);
  return n ? M(n.value) : null;
}
function lt() {
  const t = B();
  C("fc-pool-bag-stso-m", t.poolStsoBagM), C("fc-pool-bag-stso-f", t.poolStsoBagF), C("fc-pool-bag-ltso-m", t.poolLtsoBagM), C("fc-pool-bag-ltso-f", t.poolLtsoBagF), C("fc-pool-bag-tso-m", t.poolTsoBagM), C("fc-pool-bag-tso-f", t.poolTsoBagF), C("fc-pool-dfo-stso-m", t.poolStsoDfoM), C("fc-pool-dfo-stso-f", t.poolStsoDfoF), C("fc-pool-dfo-ltso-m", t.poolLtsoDfoM), C("fc-pool-dfo-ltso-f", t.poolLtsoDfoF), C("fc-pool-dfo-tso-m", t.poolTsoDfoM), C("fc-pool-dfo-tso-f", t.poolTsoDfoF);
  const n = c.$("fc-bands-wrap"), e = c.$("fc-add-band");
  n && (n.style.display = ""), e && (e.style.display = "");
}
function dt() {
  const t = B();
  C("fc-phase-thr", t.phaseThresholdMin), gn("fc-ampm-split", t.amPmSplit), C("fc-bias", t.bias || "none"), lt(), _(), G(), j && j();
}
function Lt() {
  dt();
  const t = c.$("func-coverage-modal");
  t && (t.style.display = "block");
}
function ft() {
  const t = c.$("func-coverage-modal");
  t && (t.style.display = "none");
}
function vn(t) {
  var n = W(t) > 0, e = xt(t) > 0;
  return t.poolBag = W(t), t.poolStsoDfo = M(t.poolStsoDfoM) + M(t.poolStsoDfoF), t.poolLtsoDfo = M(t.poolLtsoDfoM) + M(t.poolLtsoDfoF), t.poolTsoDfo = M(t.poolTsoDfoM) + M(t.poolTsoDfoF), t.mode = n && e ? "both" : n ? "bag" : e ? "dfo" : "none", t.mode;
}
function Sn(t) {
  return String(t.name || t.id || "") + " (" + (t.start || "?") + "–" + (t.end || "?") + ")";
}
function _() {
  const t = c.$("fc-bands-tbody");
  if (!t) return;
  const n = t.closest("table"), e = n && n.querySelector("thead");
  e && (e.innerHTML = "<tr><th>Shift</th><th>Start</th><th>End</th><th>STSO min</th><th>STSO max</th><th>LTSO min</th><th>LTSO max</th><th>TSO min</th><th>TSO max</th><th></th></tr>");
  const r = B(), o = c.state.shifts || [], i = V(r);
  t.innerHTML = i.map(function(a, u) {
    const s = c.getShift ? c.getShift(a) : null, f = s ? s.start : "—", l = s ? s.end : "—";
    function d(g, v) {
      var F = I(g, a, r);
      return '<td><input type="number" min="0" max="99" data-fc-req="' + u + '" data-fc-field="' + g + "-" + v + '" value="' + F[v] + '" style="width:3.5rem"></td>';
    }
    var m = o.map(function(g) {
      return '<option value="' + String(g.id).replace(/"/g, "") + '"' + (String(g.id) === String(a) ? " selected" : "") + ">" + Sn(g).replace(/</g, "<") + "</option>";
    }).join("");
    return s || (m = '<option value="' + String(a).replace(/"/g, "") + '" selected>' + String(a).replace(/</g, "<") + " (missing)</option>" + m), '<tr><td><select data-fc-req="' + u + '" data-fc-field="shiftId">' + m + '</select></td><td class="muted">' + f + '</td><td class="muted">' + l + "</td>" + d("STSO", "min") + d("STSO", "max") + d("LTSO", "min") + d("LTSO", "max") + d("TSO", "min") + d("TSO", "max") + '<td><button type="button" class="btn btn-red btn-sm" data-fc-remove="' + u + '">✕</button></td></tr>';
  }).join("");
}
function Jt() {
  return _();
}
function hn(t) {
  function n(a, u) {
    var s = pn(a);
    s != null && (t[u] = s);
  }
  n("fc-pool-bag-stso-m", "poolStsoBagM"), n("fc-pool-bag-stso-f", "poolStsoBagF"), n("fc-pool-bag-ltso-m", "poolLtsoBagM"), n("fc-pool-bag-ltso-f", "poolLtsoBagF"), n("fc-pool-bag-tso-m", "poolTsoBagM"), n("fc-pool-bag-tso-f", "poolTsoBagF"), n("fc-pool-dfo-stso-m", "poolStsoDfoM"), n("fc-pool-dfo-stso-f", "poolStsoDfoF"), n("fc-pool-dfo-ltso-m", "poolLtsoDfoM"), n("fc-pool-dfo-ltso-f", "poolLtsoDfoF"), n("fc-pool-dfo-tso-m", "poolTsoDfoM"), n("fc-pool-dfo-tso-f", "poolTsoDfoF"), vn(t);
  const e = c.$("fc-phase-thr"), r = c.$("fc-ampm-split");
  e && (t.phaseThresholdMin = M(e.value || 15)), r && (t.amPmSplit = !!r.checked);
  const o = c.$("fc-bias");
  if (o) {
    var i = o.value;
    i === "male" || i === "female" || i === "none" ? t.bias = i : t.bias = "none";
  }
}
function z() {
  const t = B();
  hn(t);
  const n = c.$("fc-bands-tbody");
  if (!n) return t;
  const e = n.querySelectorAll('[data-fc-req][data-fc-field="shiftId"]');
  if (!e.length) return t;
  const r = [], o = {}, i = nt();
  return e.forEach(function(a) {
    var u = +a.getAttribute("data-fc-req"), s = a.value;
    !s || o[s] || (o[s] = !0, r.push(s), ["STSO", "LTSO", "TSO"].forEach(function(f) {
      var l = n.querySelector('[data-fc-req="' + u + '"][data-fc-field="' + f + '-min"]'), d = n.querySelector('[data-fc-req="' + u + '"][data-fc-field="' + f + '-max"]'), m = l ? M(l.value) : 0, g = d ? M(d.value) : m;
      g < m && (g = m), i[f][s] = { min: m, max: g };
    }));
  }), t.requirements = i, t.requirementShiftIds = r, t;
}
function Qt() {
  return z();
}
function U(t) {
  z();
  const n = B(), e = c.state && c.state.shifts || [], r = V(n);
  var o = t;
  if (!o) {
    for (var i = 0; i < e.length; i++)
      if (r.indexOf(String(e[i].id)) < 0) {
        o = e[i].id;
        break;
      }
  }
  return o ? (o = String(o), r.indexOf(o) >= 0 || (n.requirementShiftIds = r.concat([o]), ["STSO", "LTSO", "TSO"].forEach(function(a) {
    Kt(a, o, 0, 0, n);
  }), _(), G()), n) : (c.updateStatus && c.updateStatus("All shifts are already listed, or no shifts are defined."), n);
}
function Yt() {
  return U();
}
function G() {
  const t = c.$("fc-preview");
  if (!t) return;
  const n = B(), e = ut(), o = V(n).map(function(u) {
    var s = c.getShift ? c.getShift(u) : null, f = I("STSO", u, n), l = I("LTSO", u, n), d = I("TSO", u, n);
    return (s ? (s.name || u) + " " + s.start + "–" + s.end : u) + " STSO " + f.min + "–" + f.max + " LTSO " + l.min + "–" + l.max + " TSO " + d.min + "–" + d.max;
  }).join(" | ");
  var i = (n.lastDiagnostics || []).map(Ut).join(" · "), a = Array.isArray(n.bands) && n.bands.length ? " · " + n.bands.length + " unmapped legacy band(s) retained" : "";
  t.textContent = "BAG STSO " + n.poolStsoBagM + "/" + n.poolStsoBagF + " LTSO " + n.poolLtsoBagM + "/" + n.poolLtsoBagF + " TSO " + n.poolTsoBagM + "/" + n.poolTsoBagF + " · DFO STSO " + n.poolStsoDfoM + "/" + n.poolStsoDfoF + " LTSO " + n.poolLtsoDfoM + "/" + n.poolLtsoDfoF + " TSO " + n.poolTsoDfoM + "/" + n.poolTsoDfoF + " · AM " + (c.slotLabel ? c.slotLabel(e.am) : "") + " PM " + (c.slotLabel ? c.slotLabel(e.pm) : "") + " " + (o || "no shift requirements") + (i ? " · " + i : "") + a;
}
function At() {
  return [{ start: "04:00", end: "20:30", min: 1 }];
}
function $() {
  return Array.isArray(c.state.extraPositions) || (c.state.extraPositions = []), c.state.extraPositions.forEach(function(t, n) {
    t.id || (t.id = "extra-" + (n + 1)), t.name || (t.name = "Position"), t.m = M(t.m), t.f = M(t.f), (!Array.isArray(t.bands) || !t.bands.length) && (t.bands = At());
  }), c.state.extraPositions;
}
function X() {
  const t = $();
  return t.forEach(function(n) {
    const e = c.$('[data-extra-name="' + n.id + '"]'), r = c.$('[data-extra-m="' + n.id + '"]'), o = c.$('[data-extra-f="' + n.id + '"]');
    e && (n.name = String(e.value || n.name).trim() || n.name), r && (n.m = M(r.value)), o && (n.f = M(o.value)), Array.isArray(n.bands) || (n.bands = At());
    for (var i = 0; i < n.bands.length; i++) {
      var a = n.bands[i] || {};
      ["start", "end", "min"].forEach(function(u) {
        var s = c.$('[data-extra-band="' + n.id + '"][data-extra-bi="' + i + '"][data-extra-bf="' + u + '"]');
        s && (u === "min" ? a[u] = M(s.value) : a[u] = s.value || a[u]);
      }), n.bands[i] = a;
    }
  }), t;
}
function j() {
  const t = c.$("extra-pos-list");
  if (!t) return;
  const n = $();
  t.innerHTML = n.map(function(e) {
    var r = (e.bands || []).map(function(o, i) {
      return '<tr><td><input type="time" data-extra-band="' + e.id + '" data-extra-bi="' + i + '" data-extra-bf="start" value="' + (o.start || "04:00") + '" step="900"></td><td><input type="time" data-extra-band="' + e.id + '" data-extra-bi="' + i + '" data-extra-bf="end" value="' + (o.end || "20:30") + '" step="900"></td><td><input type="number" min="0" max="99" data-extra-band="' + e.id + '" data-extra-bi="' + i + '" data-extra-bf="min" value="' + (o.min != null ? o.min : 0) + '" style="width:3.5rem"></td><td><button type="button" class="btn btn-red btn-sm" data-extra-band-remove="' + e.id + '" data-extra-bi="' + i + '">✕</button></td></tr>';
    }).join("");
    return '<div class="extra-pos-card" data-extra-card="' + e.id + '"><div class="fte-sex-row extra-pos-head"><label>Name <input type="text" data-extra-name="' + e.id + '" value="' + String(e.name || "").replace(/"/g, "&quot;") + '" style="width:7rem"></label><label>Male <input type="number" min="0" data-extra-m="' + e.id + '" value="' + M(e.m) + '" style="width:4.5rem"></label><label>Female <input type="number" min="0" data-extra-f="' + e.id + '" value="' + M(e.f) + '" style="width:4.5rem"></label><button type="button" class="btn btn-red btn-sm" data-extra-remove="' + e.id + '">Remove</button><button type="button" class="btn btn-sm" data-extra-add-band="' + e.id + '">+ Band</button></div><div class="lines-scroll extra-pos-bands"><table class="data-table"><thead><tr><th>Start</th><th>End</th><th>Min</th><th></th></tr></thead><tbody>' + r + "</tbody></table></div></div>";
  }).join("");
}
function Bt(t) {
  X();
  var n = $();
  n.push({ id: "extra-" + Date.now() + "-" + (n.length + 1), name: t || "MSTI", m: 0, f: 0, bands: At() }), j();
}
function tn() {
  var t = [], n = $(), e = c.state.shifts || [], r = e[0] || { id: "", name: "Shift", start: "04:00", end: "20:30", paid: 8, rdoHard: [] };
  return n.forEach(function(o, i) {
    var a = M(o.m) + M(o.f);
    if (!a) return;
    (!o.bands || !o.bands.length) && c.state.issues.push((o.name || "Position") + ": no coverage bands.");
    var u = 3e4 + i * 1e3, s = 0;
    function f(l, d) {
      for (var m = 0; m < d; m++) {
        for (var g = e[s % Math.max(1, e.length)] || r, v = (+g.paid || 8) >= 10 ? 4 : 5, F = 7 - v, S = Array.isArray(g.rdoHard) ? g.rdoHard.map(Number).filter(function(L) {
          return L >= 0 && L <= 6;
        }) : [], D = S.length ? S.slice(0, F) : c.consecutiveRdos ? c.consecutiveRdos(F, (u + s) % 7) : [0, 6]; D.length < F; )
          for (var E = 0; E < 7 && D.length < F; E++) D.indexOf(E) < 0 && D.push(E);
        t.push({
          id: u + s + 1,
          lineCode: String(o.name || "POS") + " " + String(s + 1).padStart(2, "0"),
          shiftId: g.id,
          shiftName: g.name,
          shiftLabel: c.shiftLabel ? c.shiftLabel(g) : (g.start || "") + "-" + (g.end || ""),
          empClass: o.name || "EXTRA",
          position: o.name || "EXTRA",
          isLtso: !1,
          isStso: !1,
          isExtra: !0,
          extraPositionId: o.id,
          sex: l,
          function: "",
          rdoDays: D,
          rdoHard: S.length > 0,
          paid: g.paid || 8
        }), s++;
      }
    }
    f("M", M(o.m)), f("F", M(o.f));
  }), t;
}
function nn() {
  var t = c.$("fc-add-band");
  if (!(c._funcCoverageBound && t && t._fcBound) && c.$("fc-bands-tbody")) {
    c._funcCoverageBound = !0, c.addFcShiftRequirement = U, c.addFcBand = U, c.renderFunctionShiftsTable = _, B(), $(), dt(), _(), G(), j();
    var n;
    n = c.$("btn-open-func-coverage"), n && n.addEventListener("click", function() {
      Lt();
    }), n = c.$("func-coverage-close"), n && n.addEventListener("click", function() {
      ft();
    }), n = c.$("fc-cancel"), n && n.addEventListener("click", function() {
      ft();
    }), n = c.$("fc-save"), n && n.addEventListener("click", function() {
      z(), lt(), _(), G(), c.updateStatus && c.updateStatus("Function coverage settings saved.");
    }), n = c.$("fc-add-band"), n && !n._fcBound && !n._spBound && (n._fcBound = !0, n.addEventListener("click", function(e) {
      e.preventDefault(), U();
    })), c._funcDocBound || (c._funcDocBound = !0, document.addEventListener("click", function(e) {
      var r = e.target;
      if (r && r.getAttribute && r.getAttribute("data-fc-remove") != null) {
        z();
        var o = +r.getAttribute("data-fc-remove"), i = B(), a = V(i);
        if (o >= 0 && o < a.length) {
          var u = a.splice(o, 1)[0];
          i.requirementShiftIds = a, ["STSO", "LTSO", "TSO"].forEach(function(s) {
            i.requirements[s] && delete i.requirements[s][u];
          });
        }
        _(), G();
      }
    }), document.addEventListener("change", function(e) {
      var r = e.target;
      r && (r.getAttribute && r.getAttribute("data-fc-req") != null || r.id && r.id.indexOf("fc-") === 0) && (z(), r.getAttribute("data-fc-field") === "shiftId" && _(), G());
    })), n = c.$("btn-add-position"), n && !n._extraBound && (n._extraBound = !0, n.addEventListener("click", function(e) {
      e.preventDefault(), Bt("MSTI");
    })), c._extraDocBound || (c._extraDocBound = !0, document.addEventListener("click", function(e) {
      var r = e.target;
      if (!(!r || !r.getAttribute)) {
        var o = r.getAttribute("data-extra-remove");
        if (o != null) {
          X(), c.state.extraPositions = $().filter(function(v) {
            return v.id !== o;
          }), j();
          return;
        }
        var i = r.getAttribute("data-extra-add-band");
        if (i != null) {
          X();
          for (var a = $(), u = null, s = 0; s < a.length; s++) a[s].id === i && (u = a[s]);
          u && (Array.isArray(u.bands) || (u.bands = []), u.bands.push({ start: "12:00", end: "16:00", min: 0 })), j();
          return;
        }
        var f = r.getAttribute("data-extra-band-remove"), l = r.getAttribute("data-extra-bi");
        if (f != null && l != null) {
          X();
          for (var d = $(), m = null, g = 0; g < d.length; g++) d[g].id === f && (m = d[g]);
          m && Array.isArray(m.bands) && m.bands.splice(+l, 1), j();
        }
      }
    }), document.addEventListener("change", function(e) {
      var r = e.target;
      !r || !r.getAttribute || (r.getAttribute("data-extra-name") != null || r.getAttribute("data-extra-m") != null || r.getAttribute("data-extra-f") != null || r.getAttribute("data-extra-band") != null) && X();
    }));
  }
}
const Bn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addExtraPosition: Bt,
  addFcBand: Yt,
  addFcShiftRequirement: U,
  bindBandsApi: Zt,
  bindFunctionCoverageUi: nn,
  buildExtraPositionLines: tn,
  closeFunctionCoverageModal: ft,
  ensureExtraPositions: $,
  fillFunctionCoverageForm: dt,
  openFunctionCoverageModal: Lt,
  readExtraPositionsFromDom: X,
  readFunctionBandsFromDom: Qt,
  readFunctionCoverageFromDom: z,
  renderExtraPositions: j,
  renderFunctionBandsTable: Jt,
  renderFunctionShiftsTable: _,
  syncFunctionModeUi: lt,
  updateFunctionCoveragePreview: G
}, Symbol.toStringTag, { value: "Module" }));
let p = null;
function en(t) {
  p = t;
}
function Q(t, n) {
  var e = p.state.schedule[t.id] || p.state.schedule[String(t.id)];
  return e ? e[n] === "WORK" : !1;
}
function k(t) {
  return (!t.functionEligible || typeof t.functionEligible != "object") && (t.functionEligible = { dfo: !1, bag: !1, pax: !1 }), t.functionEligible;
}
function Tt(t, n, e) {
  var r = p.state.lines || [];
  return r.filter(function(o) {
    if (o.isExtra || o.extraPositionId) return !1;
    var i = k(o);
    return tt(o) === t && o.sex === n && !i.bag && !i.dfo;
  });
}
function bn(t, n) {
  return t.slice().sort(function(e, r) {
    return n && n.bias === "male" && e.sex !== r.sex ? e.sex === "M" ? -1 : 1 : n && n.bias === "female" && e.sex !== r.sex ? e.sex === "F" ? -1 : 1 : P(e) - P(r) || String(e.id).localeCompare(String(r.id));
  });
}
function jt(t) {
  var n = p.state.functionRotation && p.state.functionRotation[String(t)];
  if (!n) return 0;
  for (var e = 0, r = 0; r < n.length; r++) n[r] === "BAG" && e++;
  return e;
}
function Tn(t, n, e, r) {
  if (!e || e <= 0) return { total: 0 };
  r = r || B();
  var o = Tt(t, n).slice();
  o.sort(function(u, s) {
    return P(u) - P(s) || String(u.id).localeCompare(String(s.id));
  });
  for (var i = 0, a = 0; a < o.length && i < e; a++)
    k(o[a]).bag = !0, i++;
  return { total: i };
}
function Mn(t, n, e, r) {
  if (!e || e <= 0) return { am: 0, pm: 0, total: 0 };
  r = r || B();
  var o = ut(), i = r.phaseThresholdMin || 15, a = Tt(t, n).slice();
  a.sort(function(S, D) {
    return P(S) - P(D) || String(S.id).localeCompare(String(D.id));
  });
  var u = a.filter(function(S) {
    return bt(P(S), o, i);
  }), s = a.filter(function(S) {
    return !bt(P(S), o, i);
  }), f = Mt();
  u.sort(function(S, D) {
    var E = J(S, f.open) ? 0 : 1, L = J(D, f.open) ? 0 : 1;
    return E !== L ? E - L : P(S) - P(D) || String(S.id).localeCompare(String(D.id));
  }), s.sort(function(S, D) {
    var E = J(S, f.close) ? 0 : 1, L = J(D, f.close) ? 0 : 1;
    return E !== L ? E - L : P(S) - P(D) || String(S.id).localeCompare(String(D.id));
  });
  var l = r.amPmSplit ? Math.ceil(e / 2) : e, d = r.amPmSplit ? Math.floor(e / 2) : 0;
  for (u.length < l && (d += l - u.length, l = u.length), s.length < d && (l = Math.min(u.length, l + (d - s.length)), d = s.length); l + d > e; )
    if (d >= l && d > 0) d--;
    else if (l > 0) l--;
    else break;
  function m(S, D) {
    for (var E = 0, L = 0; L < S.length && E < D; L++) {
      var R = k(S[L]);
      R.bag || R.dfo || (R.dfo = !0, E++);
    }
    return E;
  }
  var g = m(u, l), v = m(s, d), F = e - g - v;
  return F > 0 && (v += m(Tt(t, n), F)), { am: g, pm: v, total: g + v };
}
function wt() {
  p.renderCoverageBars && p.renderCoverageBars(), p.renderReports && p.renderReports(), typeof window < "u" && window.dispatchEvent(new CustomEvent("lines:request-render")), !p.__USE_SVELTE_LINES && p.renderLines && p.renderLines();
}
function st(t, n, e) {
  var r = String(t);
  for (p.state.functionRotation || (p.state.functionRotation = {}), p.state.functionRotation[r] || (p.state.functionRotation[r] = []); p.state.functionRotation[r].length <= n; ) p.state.functionRotation[r].push(null);
  return p.state.functionRotation[r][n] = e, !0;
}
function Fn(t, n) {
  var e = p.state.functionRotation && p.state.functionRotation[String(t)];
  if (!e) return null;
  var r = e[n];
  return r == null || r === "" ? null : r;
}
function xn(t) {
  var n = p.getShift ? p.getShift(t) : null;
  if (!n) return String(t);
  var e = n.name || t;
  return String(e).replace(":", "");
}
function On(t, n) {
  return t.slice().sort(function(e, r) {
    var o = jt(e.id), i = jt(r.id);
    if (o !== i) return o - i;
    var a = bn([e, r], n);
    return a[0] !== e ? 1 : a[0] !== r && e !== r ? -1 : String(e.id).localeCompare(String(r.id));
  });
}
function qt(t) {
  t = t || B();
  var n = [], e = {}, r = ["STSO", "LTSO", "TSO"];
  return r.forEach(function(o) {
    var i = t.requirements && t.requirements[o] || {};
    Object.keys(i).forEach(function(a) {
      var u = I(o, a, t);
      if (!(u.min <= 0 && u.max <= 0)) {
        e[o + "|" + a] = { min: u.min, max: u.max };
        var s = Y(o, a), f = s.filter(function(m) {
          var g = k(m);
          return g.dfo && !g.bag;
        }), l = s.length < u.min || f.length < u.min ? "SHORT" : "OK", d = p.getShift ? p.getShift(a) : null;
        n.push({
          role: o,
          shiftId: a,
          shiftLabel: xn(a),
          shiftStart: d ? d.start : null,
          shiftEnd: d ? d.end : null,
          missingShift: !d,
          eligible: s.length,
          requiredMin: u.min,
          requiredMax: u.max,
          assigned: Math.min(u.max, Math.max(u.min, 0), s.length),
          status: l
        });
      }
    });
  }), { diagnostics: n, configured: e };
}
function on(t, n) {
  t = t || B(), n = n || 0;
  for (var e = ["STSO", "LTSO", "TSO"], r = [], o = 0; o < n; o++)
    for (var i = 0; i < e.length; i++)
      for (var a = e[i], u = t.requirements && t.requirements[a] || {}, s = Object.keys(u), f = 0; f < s.length; f++) {
        var l = s[f], d = I(a, l, t);
        if (!(d.min <= 0 && d.max <= 0)) {
          var m = Y(a, l).filter(function(L) {
            var R = k(L);
            return Q(L, o) && !R.bag && R.dfo;
          });
          m = On(m, t);
          var g = Math.min(d.max, Math.max(d.min, 0));
          g = Math.min(g, m.length);
          for (var v = 0; v < g; v++) st(m[v].id, o, "BAG");
          if (o === 0) {
            var F = Y(a, l), S = F.filter(function(L) {
              var R = k(L);
              return R.dfo && !R.bag;
            }), D = S.filter(function(L) {
              return Q(L, 0);
            }), E = S.length < d.min || D.length < d.min ? "SHORT" : "OK";
            r.push({
              role: a,
              shiftId: l,
              requiredMin: d.min,
              requiredMax: d.max,
              eligible: F.length,
              assigned: g,
              status: E
            });
          }
        }
      }
  return r;
}
function rn(t) {
  t = t || {}, p.readFunctionBandsFromDom && p.readFunctionBandsFromDom();
  var n = B();
  if (p.state.issues || (p.state.issues = []), Dt(n, p.state.issues), p.state.functionRotation = {}, (p.state.lines || []).forEach(function(f) {
    f.isExtra || f.extraPositionId || (f.function = "", f.functionEligible = { dfo: !1, bag: !1, pax: !1 });
  }), !p.state.lines || !p.state.lines.length) {
    n.lastDiagnostics = [], wt(), !t.fromGenerate && p.updateStatus && p.updateStatus("Generate lines first.");
    return;
  }
  var e = Et(n), r = qt(n);
  n.lastDiagnostics = r.diagnostics || [];
  var o = (p.state.weekCount || 1) * 7;
  (p.state.lines || []).forEach(function(f) {
    if (k(f).bag) {
      f.function = "BAG";
      for (var l = 0; l < o; l++) Q(f, l) && st(f.id, l, "BAG");
    }
  }), (p.state.lines || []).forEach(function(f) {
    k(f).bag || k(f).dfo && (f.function = "DFO");
  });
  var i = on(n, o);
  i && i.length && (r.diagnostics || []).forEach(function(f) {
    for (var l = 0; l < i.length; l++)
      i[l].role !== f.role || i[l].shiftId !== f.shiftId || (f.assigned = i[l].assigned, i[l].status === "SHORT" && (f.status = "SHORT"));
  }), (p.state.lines || []).forEach(function(f) {
    if (!(f.isExtra || f.extraPositionId) && !k(f).bag) {
      if (k(f).dfo) {
        for (var l = 0; l < o; l++)
          Q(f, l) && (Fn(f.id, l) || st(f.id, l, "PAX"));
        return;
      }
      k(f).pax = !0, f.function = "PAX";
      for (var d = 0; d < o; d++) Q(f, d) && st(f.id, d, "PAX");
    }
  });
  var a = [];
  (r.diagnostics || []).forEach(function(f) {
    if (f.status === "SHORT") {
      var l = f.shiftStart || f.shiftLabel || f.shiftId, d = f.role + " " + l + " shift: " + f.assigned + " / " + f.requiredMin;
      a.push(d), p.state.issues.push(d);
    }
  }), a.length && p.renderIssues && p.renderIssues(), wt();
  var u = "BAG " + (e.bag.stso.total + e.bag.ltso.total + e.bag.tso.total) + " · DFO " + (e.stso.total + e.ltso.total + e.tso.total) + " · leftover PAX";
  a.length && (u += " · SHORT " + a.length);
  var s = p.$ && p.$("cert-assign-hint");
  return s && (s.textContent = u), !t.fromGenerate && p.updateStatus && p.updateStatus(u), !t.fromGenerate && p.closeFunctionCoverageModal && p.closeFunctionCoverageModal(), { diagnostics: r.diagnostics, shortfalls: a, poolStats: e };
}
const qn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyShiftFunctionRequirements: qt,
  bindAssignApi: en,
  generateFunctionAssignments: rn,
  markBag: Tn,
  markDfo: Mn,
  rotateShiftBagDuties: on
}, Symbol.toStringTag, { value: "Module" }));
let q = null;
function an(t) {
  q = t;
}
function Dn(t, n) {
  var e = Gt(t.id, n);
  return e || (t.function === "BAG" || t.function === "DFO" || t.function === "PAX" ? t.function : null);
}
function Ct(t, n, e) {
  if (e = e || {}, !q || !q.state) return 0;
  var r = 0;
  return (q.state.lines || []).forEach(function(o) {
    if (o) {
      if (!e.includeExtra) {
        if (o.isExtra || o.extraPositionId) return;
      }
      typeof q.getShift == "function" && !q.getShift(o.shiftId) || e.role && tt(o) !== e.role || Ht(o, t, n) && (e.duty && Dn(o, t) !== e.duty || r++);
    }
  }), r;
}
function sn(t) {
  if (t = t || {}, !q || !q.state) return { slots: [], cells: [] };
  for (var n = q.timeToMin ? q.timeToMin(q.state.open || "03:30") : 0, e = q.timeToMin ? q.timeToMin(q.state.close || "23:00") : 24 * 60, r = Math.floor(n / 30) * 30, o = Math.ceil(e / 30) * 30, i = [], a = r; a < o; a += 30) i.push(a);
  for (var u = t.days != null ? t.days : (q.state.weekCount || 1) * 7, s = t.roles || ["STSO", "LTSO", "TSO"], f = t.duties || ["BAG", "DFO", "PAX"], l = [], d = 0; d < u; d++)
    for (var m = 0; m < i.length; m++)
      for (var g = i[m], v = 0; v < s.length; v++)
        for (var F = 0; F < f.length; F++) {
          var S = Ct(d, g, { role: s[v], duty: f[F] });
          (S > 0 || t.includeZeros) && l.push({
            dayIndex: d,
            slotMin: g,
            role: s[v],
            function: f[F],
            count: S
          });
        }
  return { slots: i, cells: l, days: u };
}
const Cn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bindCoverageCalcApi: an,
  computeAssignedCoverage: sn,
  countAssignedAtSlot: Ct
}, Symbol.toStringTag, { value: "Module" }));
function yn(t) {
  return t = t || (typeof window < "u" ? window.Scheduler : null), t ? (fn(t), Wt(t), Xt(t), an(t), Zt(t), en(t), t.fteCapsByRoleSex = Ot, t.ensureFunctionCoverage = B, t.getFunctionMode = Vt, t.syncFunctionModeUi = lt, t.fillFunctionCoverageForm = dt, t.computeShiftAnchors = ut, t.phaseOfStart = ht, t.isAmSide = bt, t.lineStartMin = P, t.lineRoleKey = tt, t.isOpsFunctionRole = un, t.lineIsDfoTagged = ln, t.getRotationDuty = Gt, t.lineCoversSlot = Ht, t.bandForMinute = dn, t.openFunctionCoverageModal = Lt, t.closeFunctionCoverageModal = ft, t.renderFunctionBandsTable = Jt, t.renderFunctionShiftsTable = _, t.readFunctionBandsFromDom = Qt, t.readFunctionCoverageFromDom = z, t.updateFunctionCoveragePreview = G, t.capFunctionPoolsToFte = Dt, t.buildCertifiedPools = Et, t.generateFunctionAssignments = rn, t.applyShiftFunctionRequirements = qt, t.getConfiguredFunctionShifts = Nt, t.getShiftRequirement = I, t.getEligibleLinesForShift = Y, t.addFcShiftRequirement = U, t.addFcBand = Yt, t.computeAssignedCoverage = sn, t.countAssignedAtSlot = Ct, t.migrateFunctionCoverageConfig = Ft, t.ensureExtraPositions = $, t.readExtraPositionsFromDom = X, t.renderExtraPositions = j, t.addExtraPosition = Bt, t.buildExtraPositionLines = tn, t.clearLineFunctions = cn, t.initFunctionCoverage = yn, nn(), t) : null;
}
export {
  Bt as addExtraPosition,
  Yt as addFcBand,
  U as addFcShiftRequirement,
  qt as applyShiftFunctionRequirements,
  qn as assign,
  W as bagPoolTotal,
  dn as bandForMinute,
  Bn as bands,
  en as bindAssignApi,
  Zt as bindBandsApi,
  an as bindCoverageCalcApi,
  fn as bindDutyApi,
  nn as bindFunctionCoverageUi,
  Wt as bindPoolsApi,
  Xt as bindShiftsApi,
  Et as buildCertifiedPools,
  tn as buildExtraPositionLines,
  Dt as capFunctionPoolsToFte,
  cn as clearLineFunctions,
  ft as closeFunctionCoverageModal,
  sn as computeAssignedCoverage,
  ut as computeShiftAnchors,
  Ct as countAssignedAtSlot,
  Cn as coverage,
  xt as dfoPoolTotal,
  $ as ensureExtraPositions,
  B as ensureFunctionCoverage,
  dt as fillFunctionCoverageForm,
  Ot as fteCapsByRoleSex,
  rn as generateFunctionAssignments,
  Nt as getConfiguredFunctionShifts,
  Y as getEligibleLinesForShift,
  Vt as getFunctionMode,
  Gt as getRotationDuty,
  I as getShiftRequirement,
  yn as initFunctionCoverage,
  bt as isAmSide,
  un as isOpsFunctionRole,
  Ht as lineCoversSlot,
  ln as lineIsDfoTagged,
  tt as lineRoleKey,
  P as lineStartMin,
  Tn as markBag,
  Mn as markDfo,
  Ln as migrate,
  Ft as migrateFunctionCoverageConfig,
  Lt as openFunctionCoverageModal,
  ht as phaseOfStart,
  An as pools,
  X as readExtraPositionsFromDom,
  Qt as readFunctionBandsFromDom,
  z as readFunctionCoverageFromDom,
  j as renderExtraPositions,
  Jt as renderFunctionBandsTable,
  _ as renderFunctionShiftsTable,
  En as shifts,
  lt as syncFunctionModeUi,
  G as updateFunctionCoveragePreview
};
