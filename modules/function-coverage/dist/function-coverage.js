let x = null;
function Sn(t) {
  x = t;
}
function ut(t) {
  return t ? t.isExtra || t.extraPositionId ? t.empClass || t.position || "EXTRA" : t.isStso || t.empClass === "STSO" ? "STSO" : t.isLtso || t.empClass === "LTSO" ? "LTSO" : "TSO" : "TSO";
}
function hn(t) {
  var n = ut(t);
  return n === "STSO" || n === "LTSO" || n === "TSO";
}
function bn(t) {
  return !t || t.isExtra || t.extraPositionId ? !1 : t.function === "DFO" || !!(t.functionEligible && t.functionEligible.dfo);
}
function Zt(t, n) {
  var e = x.state.functionRotation || {}, r = e[String(t)] || e[t];
  if (r) {
    var o = r[n];
    return o == null || o === "" ? null : o;
  }
  var i = null;
  if (x.state && Array.isArray(x.state.lines)) {
    for (var a = 0; a < x.state.lines.length; a++)
      if (String(x.state.lines[a].id) === String(t)) {
        i = x.state.lines[a];
        break;
      }
  }
  return i && (i.function === "BAG" || i.function === "DFO" || i.function === "PAX") ? i.function : null;
}
function st(t) {
  var n = x.getShift(t.shiftId);
  return n ? x.timeToMin(n.start) : 0;
}
function Lt(t, n, e) {
  return e = e ?? 15, n = n || At(), t <= n.am - e && t < 11 * 60 ? "Opening" : t >= n.pm + e && t >= 11 * 60 + 15 ? "Closing" : t < n.pm ? "AM" : "PM";
}
function Tn(t, n, e) {
  return Lt(t, n, e) === "Opening" || Lt(t, n, e) === "AM";
}
function Jt(t, n, e) {
  var r = x.state.schedule[t.id] || x.state.schedule[String(t.id)];
  if (!r || r[n] !== "WORK") return !1;
  var o = n % 7, i = x.state && x.state.startDate;
  i && (o = x.weekdaySun0 && x.addDays ? x.weekdaySun0(x.addDays(i, n)) : x.dj ? x.dj(i).add(n).day() : n % 7);
  var a = x.getEffectiveShiftTimes ? x.getEffectiveShiftTimes(t.shiftId, o) : null;
  if (!a) {
    var f = x.getShift(t.shiftId);
    if (!f) return !1;
    a = { start: f.start, end: f.end };
  }
  var s = x.timeToMin(a.start), u = x.timeToMin(a.end);
  return u <= s ? e >= s || e < u : e >= s && e < u;
}
function Mn(t, n) {
  if (n = n || x.ensureFunctionCoverage && x.ensureFunctionCoverage().bands || [], !Array.isArray(n) || !n.length) return null;
  for (var e = 0; e < n.length; e++) {
    var r = n[e], o = x.timeToMin(r.start), i = x.timeToMin(r.end);
    i <= o && (i += 1440);
    var a = t;
    if (i > 1440 && a < o && (a += 1440), a >= o && a < i) return r;
  }
  return null;
}
function At() {
  var t = {};
  (x.state.lines || []).forEach(function(a) {
    var f = x.getShift(a.shiftId);
    if (f) {
      var s = x.timeToMin(f.start);
      t[s] = (t[s] || 0) + 1;
    }
  });
  var n = Object.keys(t).map(function(a) {
    return { min: +a, n: t[a] };
  }).sort(function(a, f) {
    return a.min - f.min;
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
function Fn() {
  (x.state.lines || []).forEach(function(t) {
    t.function = "", t.functionEligible = { dfo: !1, bag: !1, pax: !1 };
  }), x.state.functionRotation = {};
}
let E = null;
function Qt(t) {
  E = t;
}
function O(t) {
  return Math.max(0, Math.floor(+t || 0));
}
function lt() {
  return { STSO: {}, LTSO: {}, TSO: {} };
}
function Yt(t) {
  var n = lt();
  return !t || typeof t != "object" || ["STSO", "LTSO", "TSO"].forEach(function(e) {
    var r = t[e];
    !r || typeof r != "object" || Object.keys(r).forEach(function(o) {
      if (o) {
        var i = r[o] || {}, a = O(i.min), f = i.max == null ? a : O(i.max);
        f < a && (f = a), n[e][String(o)] = { min: a, max: f };
      }
    });
  }), n;
}
function rt(t) {
  var n = [], e = {};
  t && Array.isArray(t.requirementShiftIds) && t.requirementShiftIds.forEach(function(o) {
    var i = String(o || "");
    !i || e[i] || (e[i] = !0, n.push(i));
  });
  var r = t && t.requirements || {};
  return ["STSO", "LTSO", "TSO"].forEach(function(o) {
    var i = r[o] || {};
    Object.keys(i).forEach(function(a) {
      var f = String(a || "");
      !f || e[f] || (e[f] = !0, n.push(f));
    });
  }), n;
}
function tn(t) {
  return t = t || E && E.state && E.state.functionCoverage || {}, !E || typeof E.getShift != "function" ? [] : rt(t).map(function(n) {
    return E.getShift(n);
  }).filter(Boolean);
}
function K(t, n, e) {
  e = e || E && E.state && E.state.functionCoverage || {};
  var r = e.requirements && e.requirements[t] && e.requirements[t][n];
  if (!r) return { min: 0, max: 0 };
  var o = O(r.min), i = r.max == null ? o : O(r.max);
  return i < o && (i = o), { min: o, max: i };
}
function nn(t, n, e, r, o) {
  if (o = o || E && E.state && E.state.functionCoverage, !o) return null;
  o.requirements || (o.requirements = lt()), o.requirements[t] || (o.requirements[t] = {});
  var i = O(e), a = r == null ? i : O(r);
  return a < i && (a = i), o.requirements[t][String(n)] = { min: i, max: a }, o.requirements[t][String(n)];
}
function ft(t, n, e) {
  if (e = e || {}, !E || !E.state) return [];
  var r = E.state.lines || [];
  return r.filter(function(o) {
    return !(!o || o.isExtra || o.extraPositionId || !o.shiftId || String(o.shiftId) !== String(n) || typeof E.getShift == "function" && !E.getShift(o.shiftId) || ut(o) !== t || e.sex && o.sex !== e.sex);
  });
}
function xn() {
  var t = E && E.state && E.state.shifts || [], n = null, e = null;
  return t.forEach(function(r) {
    if (!(!r || !r.id)) {
      var o = E.timeToMin ? E.timeToMin(r.start) : 0;
      (!n || o < E.timeToMin(n.start)) && (n = r), (!e || o > E.timeToMin(e.start)) && (e = r);
    }
  }), { open: n, close: e };
}
function On(t, n) {
  return !!(t && n && String(t.shiftId) === String(n.id));
}
function en(t) {
  if (!t) return "";
  var n = (t.requiredMin != null ? t.requiredMin : 0) + "-" + (t.requiredMax != null ? t.requiredMax : 0);
  return t.role + " / Shift " + (t.shiftLabel || t.shiftId) + " Eligible: " + t.eligible + " Required: " + n + " Assigned: " + t.assigned + " Status: " + (t.status || "OK");
}
const Hn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bindShiftsApi: Qt,
  configuredShiftIdsFromRequirements: rt,
  emptyRequirements: lt,
  formatRequirementDiagnostic: en,
  getConfiguredFunctionShifts: tn,
  getEligibleLinesForShift: ft,
  getShiftRequirement: K,
  lineOnShift: On,
  normalizeRequirements: Yt,
  num0: O,
  openingAndClosingShifts: xn,
  setShiftRequirement: nn
}, Symbol.toStringTag, { value: "Module" }));
function Dn(t, n) {
  var e = n.toLowerCase(), r = t[e + "Min"] != null ? O(t[e + "Min"]) : O(t[e]), o = t[e + "Max"] != null ? O(t[e + "Max"]) : r;
  return o < r && (o = r), { min: r, max: o };
}
function Et(t, n, e) {
  e.push(n), t && Array.isArray(t) && t.indexOf(n) < 0 && t.push(n);
}
function Bt(t, n) {
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
  (!t.requirements || typeof t.requirements != "object") && (t.requirements = lt()), ["STSO", "LTSO", "TSO"].forEach(function(s) {
    (!t.requirements[s] || typeof t.requirements[s] != "object") && (t.requirements[s] = {});
  });
  var i = Array.isArray(t.bands) ? t.bands : [];
  if (!i.length)
    return delete t.bands, o;
  var a = {}, f = [];
  return i.forEach(function(s) {
    if (!s || typeof s != "object" || !s.start || !s.end) {
      s && f.push(s), o.ok = !1;
      return;
    }
    var u = e.filter(function(l) {
      return l && l.start === s.start && l.end === s.end;
    });
    if (!u.length) {
      Et(
        r,
        "Function coverage: legacy band " + s.start + "–" + s.end + " could not be mapped to a shift (no exact start/end match).",
        o.warnings
      ), o.unmapped.push({ start: s.start, end: s.end }), f.push(s), o.ok = !1;
      return;
    }
    if (u.length > 1) {
      Et(
        r,
        "Function coverage: legacy band " + s.start + "–" + s.end + " matches multiple shifts (" + u.map(function(l) {
          return l.name || l.id;
        }).join(", ") + ") — not mapped.",
        o.warnings
      ), o.ambiguous.push({
        start: s.start,
        end: s.end,
        shiftIds: u.map(function(l) {
          return l.id;
        })
      }), f.push(s), o.ok = !1;
      return;
    }
    var d = u[0];
    if (a[d.id]) {
      Et(
        r,
        "Function coverage: multiple legacy bands map to shift " + (d.name || d.id) + " — not mapped.",
        o.warnings
      ), o.ambiguous.push({ start: s.start, end: s.end, shiftId: d.id }), f.push(s), o.ok = !1;
      return;
    }
    a[d.id] = !0, ["STSO", "LTSO", "TSO"].forEach(function(l) {
      if (!t.requirements[l][d.id]) {
        var v = Dn(s, l);
        t.requirements[l][d.id] = { min: v.min, max: v.max };
      }
    }), Array.isArray(t.requirementShiftIds) || (t.requirementShiftIds = []), t.requirementShiftIds.indexOf(d.id) < 0 && t.requirementShiftIds.push(d.id), o.mapped++;
  }), f.length ? t.bands = f : delete t.bands, o.migrated = o.mapped > 0, o;
}
const Xn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  migrateFunctionCoverageConfig: Bt
}, Symbol.toStringTag, { value: "Module" }));
let T = null;
function yn(t) {
  T = t;
}
function Ut(t) {
  var n = T.getShift ? T.getShift(t) : null;
  return n && T.timeToMin && n.start != null ? T.timeToMin(n.start) : 1e9;
}
function qt(t, n) {
  n && (T = n), t = t || (T && T.ensureFunctionCoverage ? T.ensureFunctionCoverage() : {});
  var e = T.state.lines || [];
  e.forEach(function(g) {
    g.isExtra || g.extraPositionId || (g.functionEligible = { dfo: !1, bag: !1, pax: !1 }, g.function = "");
  });
  var r = T.computeShiftAnchors(), o = t.phaseThresholdMin || 15;
  function i(g) {
    return (!g.functionEligible || typeof g.functionEligible != "object") && (g.functionEligible = { dfo: !1, bag: !1, pax: !1 }), g.functionEligible;
  }
  function a(g, F) {
    return e.filter(function(M) {
      if (M.isExtra || M.extraPositionId) return !1;
      var B = i(M);
      return T.lineRoleKey(M) === g && M.sex === F && !B.bag && !B.dfo;
    });
  }
  function f(g, F, M) {
    if (!M || M <= 0) return { total: 0 };
    var B = a(g, F).slice();
    B.sort(function(j, V) {
      return T.lineStartMin(j) - T.lineStartMin(V) || String(j.id).localeCompare(String(V.id));
    });
    for (var S = 0, y = 0; y < B.length && S < M; y++)
      i(B[y]).bag = !0, S++;
    return { total: S };
  }
  function s(g) {
    return g ? g.isPt === !0 ? !0 : String(g.empClass || "").trim().toUpperCase() === "PT" : !1;
  }
  function u(g) {
    return Math.max(0, Math.floor(+g || 0));
  }
  function d() {
    var g = u(t.poolTsoDfoPt), F = [];
    e.forEach(function(y) {
      if (!(!y || y.isExtra || y.extraPositionId) && T.lineRoleKey(y) === "TSO" && s(y)) {
        var j = i(y);
        j.bag || !j.dfo || F.push(y);
      }
    }), F.sort(function(y, j) {
      var V = T.lineStartMin(j) - T.lineStartMin(y);
      return V || String(j.id).localeCompare(String(y.id));
    });
    for (var M = 0; F.length > g; ) {
      var B = F.shift();
      i(B).dfo = !1, M++;
    }
    if (M && T.state) {
      T.state.issues || (T.state.issues = []);
      var S = "PT DFO capped to " + g;
      T.state.issues.indexOf(S) < 0 && T.state.issues.push(S);
    }
    return M;
  }
  function l(g) {
    var F = 0, M = 0;
    g.forEach(function(S) {
      F += S.am || 0, M += S.pm || 0;
    });
    var B = 0;
    return e.forEach(function(S) {
      if (!(!S || S.isExtra || S.extraPositionId) && T.lineRoleKey(S) === "TSO") {
        var y = S.functionEligible;
        y && y.dfo && !y.bag && B++;
      }
    }), { total: B, am: F, pm: M };
  }
  var v = u(t.poolTsoDfoPt);
  function p() {
    var g = 0;
    return e.forEach(function(F) {
      if (!(!F || F.isExtra || F.extraPositionId) && T.lineRoleKey(F) === "TSO" && s(F)) {
        var M = F.functionEligible;
        M && M.dfo && !M.bag && g++;
      }
    }), g;
  }
  function A(g) {
    var F = i(g);
    return F.bag || F.dfo ? !1 : s(g) ? v <= 0 ? !1 : (F.dfo = !0, v--, !0) : (F.dfo = !0, !0);
  }
  function q() {
    var g = u(t.poolTsoDfoPt);
    ["M", "F"].forEach(function(F) {
      for (; p() < g; ) {
        var M = a("TSO", F).filter(s), B = e.filter(function(S) {
          if (!S || S.isExtra || S.extraPositionId || T.lineRoleKey(S) !== "TSO" || S.sex !== F || s(S)) return !1;
          var y = i(S);
          return y.dfo && !y.bag;
        });
        if (!M.length || !B.length) break;
        M.sort(R), B.sort(function(S, y) {
          var j = T.lineStartMin(y) - T.lineStartMin(S);
          return j || String(y.id).localeCompare(String(S.id));
        }), i(B[0]).dfo = !1, i(M[0]).dfo = !0, v > 0 && v--;
      }
    });
  }
  function R(g, F) {
    var M = s(g) ? 1 : 0, B = s(F) ? 1 : 0;
    return M !== B ? M - B : T.lineStartMin(g) - T.lineStartMin(F) || String(g.id).localeCompare(String(F.id));
  }
  function I(g, F, M) {
    if (!M || M <= 0) return { am: 0, pm: 0, total: 0 };
    var B = a(g, F).slice(), S = [], y = {}, j = !1, V = t.requirements && t.requirements[g] || {};
    Object.keys(V).forEach(function(h) {
      var D = K(g, h, t);
      if (!(D.min <= 0 && D.max <= 0) && !(typeof T.getShift == "function" && !T.getShift(h))) {
        var P = String(h);
        y[P] || (y[P] = !0, S.push(P), j = !0);
      }
    }), S.length || B.forEach(function(h) {
      if (!(!h || h.shiftId == null || h.shiftId === "")) {
        var D = String(h.shiftId);
        y[D] || (y[D] = !0, S.push(D));
      }
    }), S.sort(function(h, D) {
      var P = Ut(h) - Ut(D);
      return P || String(h).localeCompare(String(D));
    });
    var Z = {};
    S.forEach(function(h) {
      Z[h] = [];
    }), B.forEach(function(h) {
      var D = h.shiftId != null ? String(h.shiftId) : "";
      Z[D] && Z[D].push(h);
    });
    function wt(h) {
      h.sort(function(D, P) {
        return g === "TSO" ? R(D, P) : T.lineStartMin(D) - T.lineStartMin(P) || String(D.id).localeCompare(String(P.id));
      });
    }
    S.forEach(function(h) {
      wt(Z[h]);
    });
    var Gt = Math.min(M, B.length), Ht = S.map(function(h) {
      return j ? Math.max(K(g, h, t).min, 1) : 1;
    }), ct = 0;
    Ht.forEach(function(h) {
      ct += h;
    }), ct || (ct = 1);
    var z = [], dt = [], Xt = 0;
    S.forEach(function(h, D) {
      var P = Gt * Ht[D] / ct, nt = Math.floor(P);
      z[D] = nt, Xt += nt, dt.push({ i: D, frac: P - nt });
    }), dt.sort(function(h, D) {
      return D.frac !== h.frac ? D.frac - h.frac : h.i - D.i;
    });
    for (var tt = Gt - Xt, St = 0; St < dt.length && tt > 0; St++)
      z[dt[St].i]++, tt--;
    for (tt = 0, S.forEach(function(h, D) {
      var P = Z[h].length;
      z[D] > P && (tt += z[D] - P, z[D] = P);
    }); tt > 0; ) {
      for (var ht = -1, Kt = -1, it = 0; it < S.length; it++) {
        var bt = Z[S[it]].length - z[it];
        bt <= 0 || bt > Kt && (Kt = bt, ht = it);
      }
      if (ht < 0) break;
      z[ht]++, tt--;
    }
    var J = [];
    if (S.forEach(function(h, D) {
      for (var P = Z[h], nt = z[D], Ot = 0; Ot < P.length && J.length < M && nt > 0; Ot++) {
        var Dt = P[Ot], yt = i(Dt);
        if (!(yt.bag || yt.dfo)) {
          if (g === "TSO") {
            if (!A(Dt)) continue;
          } else
            yt.dfo = !0;
          J.push(Dt), nt--;
        }
      }
    }), J.length < M) {
      var Tt = a(g, F).slice();
      wt(Tt);
      for (var Mt = 0; Mt < Tt.length && J.length < M; Mt++) {
        var Ft = Tt[Mt], xt = i(Ft);
        if (!(xt.bag || xt.dfo)) {
          if (g === "TSO") {
            if (!A(Ft)) continue;
          } else
            xt.dfo = !0;
          J.push(Ft);
        }
      }
    }
    var zt = 0, Nt = 0;
    return J.forEach(function(h) {
      T.isAmSide(T.lineStartMin(h), r, o) ? zt++ : Nt++;
    }), { am: zt, pm: Nt, total: J.length };
  }
  var C = {
    stso: { m: f("STSO", "M", t.poolStsoBagM).total, f: f("STSO", "F", t.poolStsoBagF).total },
    ltso: { m: f("LTSO", "M", t.poolLtsoBagM).total, f: f("LTSO", "F", t.poolLtsoBagF).total },
    tso: { m: f("TSO", "M", t.poolTsoBagM).total, f: f("TSO", "F", t.poolTsoBagF).total }
  };
  C.stso.total = C.stso.m + C.stso.f, C.ltso.total = C.ltso.m + C.ltso.f, C.tso.total = C.tso.m + C.tso.f;
  var L = {
    stso: I("STSO", "M", t.poolStsoDfoM),
    stsoF: I("STSO", "F", t.poolStsoDfoF),
    ltso: I("LTSO", "M", t.poolLtsoDfoM),
    ltsoF: I("LTSO", "F", t.poolLtsoDfoF),
    tso: I("TSO", "M", t.poolTsoDfoM),
    tsoF: I("TSO", "F", t.poolTsoDfoF)
  };
  q(), d();
  var W = l([L.tso, L.tsoF]);
  return {
    bag: C,
    stso: { total: L.stso.total + L.stsoF.total, am: L.stso.am + L.stsoF.am, pm: L.stso.pm + L.stsoF.pm },
    ltso: { total: L.ltso.total + L.ltsoF.total, am: L.ltso.am + L.ltsoF.am, pm: L.ltso.pm + L.ltsoF.pm },
    tso: W,
    anchors: r
  };
}
let w = null;
function on(t) {
  w = t, yn(t);
}
function b(t) {
  return Math.max(0, Math.floor(+t || 0));
}
function ot(t) {
  return b(t.poolStsoBagM) + b(t.poolStsoBagF) + b(t.poolLtsoBagM) + b(t.poolLtsoBagF) + b(t.poolTsoBagM) + b(t.poolTsoBagF);
}
function Pt(t) {
  return b(t.poolStsoDfoM) + b(t.poolStsoDfoF) + b(t.poolLtsoDfoM) + b(t.poolLtsoDfoF) + b(t.poolTsoDfoM) + b(t.poolTsoDfoF);
}
function k() {
  w.state.functionCoverage || (w.state.functionCoverage = {});
  var t = w.state.functionCoverage;
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
    "poolTsoBagF",
    "poolTsoDfoPt"
  ].forEach(function(n) {
    t[n] == null && (t[n] = 0);
  }), t.poolStsoDfo == null && (t.poolStsoDfo = b(t.poolStsoDfoM) + b(t.poolStsoDfoF)), t.poolLtsoDfo == null && (t.poolLtsoDfo = b(t.poolLtsoDfoM) + b(t.poolLtsoDfoF)), t.poolTsoDfo == null && (t.poolTsoDfo = b(t.poolTsoDfoM) + b(t.poolTsoDfoF)), t.poolBag == null && (t.poolBag = ot(t)), !t.poolStsoDfoM && !t.poolStsoDfoF && t.poolStsoDfo && (t.poolStsoDfoM = t.poolStsoDfo), !t.poolLtsoDfoM && !t.poolLtsoDfoF && t.poolLtsoDfo && (t.poolLtsoDfoM = t.poolLtsoDfo), !t.poolTsoDfoM && !t.poolTsoDfoF && t.poolTsoDfo && (t.poolTsoDfoM = t.poolTsoDfo), !t.poolTsoBagM && !t.poolTsoBagF && t.poolBag && (t.poolTsoBagM = t.poolBag), t.amPmSplit == null && (t.amPmSplit = !0), t.phaseThresholdMin == null && (t.phaseThresholdMin = 15), t.bias == null && (t.bias = "none"), w.state.functionRotation || (w.state.functionRotation = {}), Array.isArray(t.bands) && t.bands.length && !t._bandMigrationAttempted && (t._bandMigrationAttempted = !0, Bt(t, {
    shifts: w.state && w.state.shifts || [],
    issues: w.state && w.state.issues
  })), t.requirements = Yt(t.requirements), Array.isArray(t.requirementShiftIds) || (t.requirementShiftIds = []), t.requirementShiftIds.length || ["STSO", "LTSO", "TSO"].forEach(function(n) {
    Object.keys(t.requirements[n] || {}).forEach(function(e) {
      t.requirementShiftIds.indexOf(e) < 0 && t.requirementShiftIds.push(e);
    });
  }), delete t.stsoIsDfo, delete t.poolDfo, delete t.poolPax, kt(t), t;
}
function rn() {
  return kt(k());
}
function Ct() {
  var t = w.state || {};
  return {
    STSO: { M: b(t.stsoM), F: b(t.stsoF) },
    LTSO: { M: b(t.ltsoM), F: b(t.ltsoF) },
    TSO: { M: b(t.ftM) + b(t.ptM), F: b(t.ftF) + b(t.ptF) }
  };
}
function Rt(t, n) {
  t = t || k();
  var e = Ct();
  function r(o, i, a, f, s) {
    var u = e[o].M, d = e[o].F, l = b(t[i]), v = b(t[a]), p = b(t[f]), A = b(t[s]);
    l > u && (n && n.push("BAG " + o + " M pool " + l + " exceeds FTE " + u + " — capped."), l = u), v > d && (n && n.push("BAG " + o + " F pool " + v + " exceeds FTE " + d + " — capped."), v = d);
    var q = Math.max(0, u - l), R = Math.max(0, d - v);
    p > q && (n && n.push("DFO " + o + " M pool " + p + " exceeds remaining FTE " + q + " after BAG — capped."), p = q), A > R && (n && n.push("DFO " + o + " F pool " + A + " exceeds remaining FTE " + R + " after BAG — capped."), A = R), t[i] = l, t[a] = v, t[f] = p, t[s] = A;
  }
  return r("STSO", "poolStsoBagM", "poolStsoBagF", "poolStsoDfoM", "poolStsoDfoF"), r("LTSO", "poolLtsoBagM", "poolLtsoBagF", "poolLtsoDfoM", "poolLtsoDfoF"), r("TSO", "poolTsoBagM", "poolTsoBagF", "poolTsoDfoM", "poolTsoDfoF"), kt(t), t;
}
function kt(t) {
  var n = ot(t) > 0, e = Pt(t) > 0;
  return t.poolBag = ot(t), t.poolStsoDfo = b(t.poolStsoDfoM) + b(t.poolStsoDfoF), t.poolLtsoDfo = b(t.poolLtsoDfoM) + b(t.poolLtsoDfoF), t.poolTsoDfo = b(t.poolTsoDfoM) + b(t.poolTsoDfoF), t.mode = n && e ? "both" : n ? "bag" : e ? "dfo" : "none", t;
}
const Kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagPoolTotal: ot,
  bindPoolsApi: on,
  buildCertifiedPools: qt,
  capFunctionPoolsToFte: Rt,
  dfoPoolTotal: Pt,
  ensureFunctionCoverage: k,
  fteCapsByRoleSex: Ct,
  getFunctionMode: rn
}, Symbol.toStringTag, { value: "Module" }));
let c = null;
function an(t) {
  c = t;
}
function _(t, n) {
  const e = c.$(t);
  e && (e.value = n);
}
function En(t, n) {
  const e = c.$(t);
  e && (e.checked = !!n);
}
function Ln(t) {
  const n = c.$(t);
  return n ? O(n.value) : null;
}
function pt() {
  const t = k();
  _("fc-pool-bag-stso-m", t.poolStsoBagM), _("fc-pool-bag-stso-f", t.poolStsoBagF), _("fc-pool-bag-ltso-m", t.poolLtsoBagM), _("fc-pool-bag-ltso-f", t.poolLtsoBagF), _("fc-pool-bag-tso-m", t.poolTsoBagM), _("fc-pool-bag-tso-f", t.poolTsoBagF), _("fc-pool-dfo-stso-m", t.poolStsoDfoM), _("fc-pool-dfo-stso-f", t.poolStsoDfoF), _("fc-pool-dfo-ltso-m", t.poolLtsoDfoM), _("fc-pool-dfo-ltso-f", t.poolLtsoDfoF), _("fc-pool-dfo-tso-m", t.poolTsoDfoM), _("fc-pool-dfo-tso-f", t.poolTsoDfoF), _("fc-pool-dfo-pt", t.poolTsoDfoPt);
  const n = c.$("fc-bands-wrap"), e = c.$("fc-add-band");
  n && (n.style.display = ""), e && (e.style.display = "");
}
function vt() {
  const t = k();
  _("fc-phase-thr", t.phaseThresholdMin), En("fc-ampm-split", t.amPmSplit), _("fc-bias", t.bias || "none"), pt(), H(), N(), U && U();
}
function _t() {
  vt();
  const t = c.$("func-coverage-modal");
  t && (t.style.display = "block");
}
function gt() {
  const t = c.$("func-coverage-modal");
  t && (t.style.display = "none");
}
function An(t) {
  var n = ot(t) > 0, e = Pt(t) > 0;
  return t.poolBag = ot(t), t.poolStsoDfo = O(t.poolStsoDfoM) + O(t.poolStsoDfoF), t.poolLtsoDfo = O(t.poolLtsoDfoM) + O(t.poolLtsoDfoF), t.poolTsoDfo = O(t.poolTsoDfoM) + O(t.poolTsoDfoF), t.mode = n && e ? "both" : n ? "bag" : e ? "dfo" : "none", t.mode;
}
function Bn(t) {
  return String(t.name || t.id || "") + " (" + (t.start || "?") + "–" + (t.end || "?") + ")";
}
function H() {
  const t = c.$("fc-bands-tbody");
  if (!t) return;
  const n = t.closest("table"), e = n && n.querySelector("thead");
  e && (e.innerHTML = "<tr><th>Shift</th><th>Start</th><th>End</th><th>STSO min</th><th>STSO max</th><th>LTSO min</th><th>LTSO max</th><th>TSO min</th><th>TSO max</th><th></th></tr>");
  const r = k(), o = c.state.shifts || [], i = rt(r);
  t.innerHTML = i.map(function(a, f) {
    const s = c.getShift ? c.getShift(a) : null, u = s ? s.start : "—", d = s ? s.end : "—";
    function l(p, A) {
      var q = K(p, a, r);
      return '<td><input type="number" min="0" max="99" data-fc-req="' + f + '" data-fc-field="' + p + "-" + A + '" value="' + q[A] + '" style="width:3.5rem"></td>';
    }
    var v = o.map(function(p) {
      return '<option value="' + String(p.id).replace(/"/g, "") + '"' + (String(p.id) === String(a) ? " selected" : "") + ">" + Bn(p).replace(/</g, "<") + "</option>";
    }).join("");
    return s || (v = '<option value="' + String(a).replace(/"/g, "") + '" selected>' + String(a).replace(/</g, "<") + " (missing)</option>" + v), '<tr><td><select data-fc-req="' + f + '" data-fc-field="shiftId">' + v + '</select></td><td class="muted">' + u + '</td><td class="muted">' + d + "</td>" + l("STSO", "min") + l("STSO", "max") + l("LTSO", "min") + l("LTSO", "max") + l("TSO", "min") + l("TSO", "max") + '<td><button type="button" class="btn btn-red btn-sm" data-fc-remove="' + f + '">✕</button></td></tr>';
  }).join("");
}
function sn() {
  return H();
}
function qn(t) {
  function n(a, f) {
    var s = Ln(a);
    s != null && (t[f] = s);
  }
  n("fc-pool-bag-stso-m", "poolStsoBagM"), n("fc-pool-bag-stso-f", "poolStsoBagF"), n("fc-pool-bag-ltso-m", "poolLtsoBagM"), n("fc-pool-bag-ltso-f", "poolLtsoBagF"), n("fc-pool-bag-tso-m", "poolTsoBagM"), n("fc-pool-bag-tso-f", "poolTsoBagF"), n("fc-pool-dfo-stso-m", "poolStsoDfoM"), n("fc-pool-dfo-stso-f", "poolStsoDfoF"), n("fc-pool-dfo-ltso-m", "poolLtsoDfoM"), n("fc-pool-dfo-ltso-f", "poolLtsoDfoF"), n("fc-pool-dfo-tso-m", "poolTsoDfoM"), n("fc-pool-dfo-tso-f", "poolTsoDfoF"), n("fc-pool-dfo-pt", "poolTsoDfoPt"), An(t);
  const e = c.$("fc-phase-thr"), r = c.$("fc-ampm-split");
  e && (t.phaseThresholdMin = O(e.value || 15)), r && (t.amPmSplit = !!r.checked);
  const o = c.$("fc-bias");
  if (o) {
    var i = o.value;
    i === "male" || i === "female" || i === "none" ? t.bias = i : t.bias = "none";
  }
}
function Y() {
  const t = k();
  qn(t);
  const n = c.$("fc-bands-tbody");
  if (!n) return t;
  const e = n.querySelectorAll('[data-fc-req][data-fc-field="shiftId"]');
  if (!e.length) return t;
  const r = [], o = {}, i = lt();
  return e.forEach(function(a) {
    var f = +a.getAttribute("data-fc-req"), s = a.value;
    !s || o[s] || (o[s] = !0, r.push(s), ["STSO", "LTSO", "TSO"].forEach(function(u) {
      var d = n.querySelector('[data-fc-req="' + f + '"][data-fc-field="' + u + '-min"]'), l = n.querySelector('[data-fc-req="' + f + '"][data-fc-field="' + u + '-max"]'), v = d ? O(d.value) : 0, p = l ? O(l.value) : v;
      p < v && (p = v), i[u][s] = { min: v, max: p };
    }));
  }), t.requirements = i, t.requirementShiftIds = r, t;
}
function fn() {
  return Y();
}
function et(t) {
  Y();
  const n = k(), e = c.state && c.state.shifts || [], r = rt(n);
  var o = t;
  if (!o) {
    for (var i = 0; i < e.length; i++)
      if (r.indexOf(String(e[i].id)) < 0) {
        o = e[i].id;
        break;
      }
  }
  return o ? (o = String(o), r.indexOf(o) >= 0 || (n.requirementShiftIds = r.concat([o]), ["STSO", "LTSO", "TSO"].forEach(function(a) {
    nn(a, o, 0, 0, n);
  }), H(), N()), n) : (c.updateStatus && c.updateStatus("All shifts are already listed, or no shifts are defined."), n);
}
function un() {
  return et();
}
function N() {
  const t = c.$("fc-preview");
  if (!t) return;
  const n = k(), e = At(), o = rt(n).map(function(f) {
    var s = c.getShift ? c.getShift(f) : null, u = K("STSO", f, n), d = K("LTSO", f, n), l = K("TSO", f, n);
    return (s ? (s.name || f) + " " + s.start + "–" + s.end : f) + " STSO " + u.min + "–" + u.max + " LTSO " + d.min + "–" + d.max + " TSO " + l.min + "–" + l.max;
  }).join(" | ");
  var i = (n.lastDiagnostics || []).map(en).join(" · "), a = Array.isArray(n.bands) && n.bands.length ? " · " + n.bands.length + " unmapped legacy band(s) retained" : "";
  t.textContent = "BAG STSO " + n.poolStsoBagM + "/" + n.poolStsoBagF + " LTSO " + n.poolLtsoBagM + "/" + n.poolLtsoBagF + " TSO " + n.poolTsoBagM + "/" + n.poolTsoBagF + " · DFO STSO " + n.poolStsoDfoM + "/" + n.poolStsoDfoF + " LTSO " + n.poolLtsoDfoM + "/" + n.poolLtsoDfoF + " TSO " + n.poolTsoDfoM + "/" + n.poolTsoDfoF + " PT " + O(n.poolTsoDfoPt) + " · AM " + (c.slotLabel ? c.slotLabel(e.am) : "") + " PM " + (c.slotLabel ? c.slotLabel(e.pm) : "") + " " + (o || "no shift requirements") + (i ? " · " + i : "") + a;
}
function $t() {
  return [{ start: "04:00", end: "20:30", min: 1 }];
}
function X() {
  return Array.isArray(c.state.extraPositions) || (c.state.extraPositions = []), c.state.extraPositions.forEach(function(t, n) {
    t.id || (t.id = "extra-" + (n + 1)), t.name || (t.name = "Position"), t.m = O(t.m), t.f = O(t.f), (!Array.isArray(t.bands) || !t.bands.length) && (t.bands = $t());
  }), c.state.extraPositions;
}
function Q() {
  const t = X();
  return t.forEach(function(n) {
    const e = c.$('[data-extra-name="' + n.id + '"]'), r = c.$('[data-extra-m="' + n.id + '"]'), o = c.$('[data-extra-f="' + n.id + '"]');
    e && (n.name = String(e.value || n.name).trim() || n.name), r && (n.m = O(r.value)), o && (n.f = O(o.value)), Array.isArray(n.bands) || (n.bands = $t());
    for (var i = 0; i < n.bands.length; i++) {
      var a = n.bands[i] || {};
      ["start", "end", "min"].forEach(function(f) {
        var s = c.$('[data-extra-band="' + n.id + '"][data-extra-bi="' + i + '"][data-extra-bf="' + f + '"]');
        s && (f === "min" ? a[f] = O(s.value) : a[f] = s.value || a[f]);
      }), n.bands[i] = a;
    }
  }), t;
}
function U() {
  const t = c.$("extra-pos-list");
  if (!t) return;
  const n = X();
  t.innerHTML = n.map(function(e) {
    var r = (e.bands || []).map(function(o, i) {
      return '<tr><td><input type="time" data-extra-band="' + e.id + '" data-extra-bi="' + i + '" data-extra-bf="start" value="' + (o.start || "04:00") + '" step="900"></td><td><input type="time" data-extra-band="' + e.id + '" data-extra-bi="' + i + '" data-extra-bf="end" value="' + (o.end || "20:30") + '" step="900"></td><td><input type="number" min="0" max="99" data-extra-band="' + e.id + '" data-extra-bi="' + i + '" data-extra-bf="min" value="' + (o.min != null ? o.min : 0) + '" style="width:3.5rem"></td><td><button type="button" class="btn btn-red btn-sm" data-extra-band-remove="' + e.id + '" data-extra-bi="' + i + '">✕</button></td></tr>';
    }).join("");
    return '<div class="extra-pos-card" data-extra-card="' + e.id + '"><div class="fte-sex-row extra-pos-head"><label>Name <input type="text" data-extra-name="' + e.id + '" value="' + String(e.name || "").replace(/"/g, "&quot;") + '" style="width:7rem"></label><label>Male <input type="number" min="0" data-extra-m="' + e.id + '" value="' + O(e.m) + '" style="width:4.5rem"></label><label>Female <input type="number" min="0" data-extra-f="' + e.id + '" value="' + O(e.f) + '" style="width:4.5rem"></label><button type="button" class="btn btn-red btn-sm" data-extra-remove="' + e.id + '">Remove</button><button type="button" class="btn btn-sm" data-extra-add-band="' + e.id + '">+ Band</button></div><div class="lines-scroll extra-pos-bands"><table class="data-table"><thead><tr><th>Start</th><th>End</th><th>Min</th><th></th></tr></thead><tbody>' + r + "</tbody></table></div></div>";
  }).join("");
}
function ln(t) {
  Q();
  var n = X();
  n.push({ id: "extra-" + Date.now() + "-" + (n.length + 1), name: t || "MSTI", m: 0, f: 0, bands: $t() }), U();
}
function Pn() {
  var t = [], n = X(), e = c.state.shifts || [], r = e[0] || { id: "", name: "Shift", start: "04:00", end: "20:30", paid: 8, rdoHard: [] };
  return n.forEach(function(o, i) {
    var a = O(o.m) + O(o.f);
    if (!a) return;
    (!o.bands || !o.bands.length) && c.state.issues.push((o.name || "Position") + ": no coverage bands.");
    var f = 3e4 + i * 1e3, s = 0;
    function u(d, l) {
      for (var v = 0; v < l; v++) {
        for (var p = e[s % Math.max(1, e.length)] || r, A = (+p.paid || 8) >= 10 ? 4 : 5, q = 7 - A, R = Array.isArray(p.rdoHard) ? p.rdoHard.map(Number).filter(function(L) {
          return L >= 0 && L <= 6;
        }) : [], I = R.length ? R.slice(0, q) : c.consecutiveRdos ? c.consecutiveRdos(q, (f + s) % 7) : [0, 6]; I.length < q; )
          for (var C = 0; C < 7 && I.length < q; C++) I.indexOf(C) < 0 && I.push(C);
        t.push({
          id: f + s + 1,
          lineCode: String(o.name || "POS") + " " + String(s + 1).padStart(2, "0"),
          shiftId: p.id,
          shiftName: p.name,
          shiftLabel: c.shiftLabel ? c.shiftLabel(p) : (p.start || "") + "-" + (p.end || ""),
          empClass: o.name || "EXTRA",
          position: o.name || "EXTRA",
          isLtso: !1,
          isStso: !1,
          isExtra: !0,
          extraPositionId: o.id,
          sex: d,
          function: "",
          rdoDays: I,
          rdoHard: R.length > 0,
          paid: p.paid || 8
        }), s++;
      }
    }
    u("M", O(o.m)), u("F", O(o.f));
  }), t;
}
function cn() {
  var t = c.$("fc-add-band");
  if (!(c._funcCoverageBound && t && t._fcBound) && c.$("fc-bands-tbody")) {
    c._funcCoverageBound = !0, c.addFcShiftRequirement = et, c.addFcBand = et, c.renderFunctionShiftsTable = H, k(), X(), vt(), H(), N(), U();
    var n;
    n = c.$("btn-open-func-coverage"), n && n.addEventListener("click", function() {
      _t();
    }), n = c.$("func-coverage-close"), n && n.addEventListener("click", function() {
      gt();
    }), n = c.$("fc-cancel"), n && n.addEventListener("click", function() {
      gt();
    }), n = c.$("fc-save"), n && n.addEventListener("click", function() {
      Y(), pt(), H(), N(), c.updateStatus && c.updateStatus("Function coverage settings saved.");
    }), n = c.$("fc-add-band"), n && !n._fcBound && !n._spBound && (n._fcBound = !0, n.addEventListener("click", function(e) {
      e.preventDefault(), et();
    })), c._funcDocBound || (c._funcDocBound = !0, document.addEventListener("click", function(e) {
      var r = e.target;
      if (r && r.getAttribute && r.getAttribute("data-fc-remove") != null) {
        Y();
        var o = +r.getAttribute("data-fc-remove"), i = k(), a = rt(i);
        if (o >= 0 && o < a.length) {
          var f = a.splice(o, 1)[0];
          i.requirementShiftIds = a, ["STSO", "LTSO", "TSO"].forEach(function(s) {
            i.requirements[s] && delete i.requirements[s][f];
          });
        }
        H(), N();
      }
    }), document.addEventListener("change", function(e) {
      var r = e.target;
      r && (r.getAttribute && r.getAttribute("data-fc-req") != null || r.id && r.id.indexOf("fc-") === 0) && (Y(), r.getAttribute("data-fc-field") === "shiftId" && H(), N());
    })), n = c.$("btn-add-position"), n && !n._extraBound && (n._extraBound = !0, n.addEventListener("click", function(e) {
      e.preventDefault(), ln("MSTI");
    })), c._extraDocBound || (c._extraDocBound = !0, document.addEventListener("click", function(e) {
      var r = e.target;
      if (!(!r || !r.getAttribute)) {
        var o = r.getAttribute("data-extra-remove");
        if (o != null) {
          Q(), c.state.extraPositions = X().filter(function(A) {
            return A.id !== o;
          }), U();
          return;
        }
        var i = r.getAttribute("data-extra-add-band");
        if (i != null) {
          Q();
          for (var a = X(), f = null, s = 0; s < a.length; s++) a[s].id === i && (f = a[s]);
          f && (Array.isArray(f.bands) || (f.bands = []), f.bands.push({ start: "12:00", end: "16:00", min: 0 })), U();
          return;
        }
        var u = r.getAttribute("data-extra-band-remove"), d = r.getAttribute("data-extra-bi");
        if (u != null && d != null) {
          Q();
          for (var l = X(), v = null, p = 0; p < l.length; p++) l[p].id === u && (v = l[p]);
          v && Array.isArray(v.bands) && v.bands.splice(+d, 1), U();
        }
      }
    }), document.addEventListener("change", function(e) {
      var r = e.target;
      !r || !r.getAttribute || (r.getAttribute("data-extra-name") != null || r.getAttribute("data-extra-m") != null || r.getAttribute("data-extra-f") != null || r.getAttribute("data-extra-band") != null) && Q();
    }));
  }
}
const zn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addExtraPosition: ln,
  addFcBand: un,
  addFcShiftRequirement: et,
  bindBandsApi: an,
  bindFunctionCoverageUi: cn,
  buildExtraPositionLines: Pn,
  closeFunctionCoverageModal: gt,
  ensureExtraPositions: X,
  fillFunctionCoverageForm: vt,
  openFunctionCoverageModal: _t,
  readExtraPositionsFromDom: Q,
  readFunctionBandsFromDom: fn,
  readFunctionCoverageFromDom: Y,
  renderExtraPositions: U,
  renderFunctionBandsTable: sn,
  renderFunctionShiftsTable: H,
  syncFunctionModeUi: pt,
  updateFunctionCoveragePreview: N
}, Symbol.toStringTag, { value: "Module" }));
let m = null;
function dn(t) {
  m = t;
}
function at(t, n) {
  var e = m.state.schedule[t.id] || m.state.schedule[String(t.id)];
  return e ? e[n] === "WORK" : !1;
}
function G(t) {
  return (!t.functionEligible || typeof t.functionEligible != "object") && (t.functionEligible = { dfo: !1, bag: !1, pax: !1 }), t.functionEligible;
}
function Cn(t, n, e) {
  var r = m.state.lines || [];
  return r.filter(function(o) {
    if (o.isExtra || o.extraPositionId) return !1;
    var i = G(o);
    return ut(o) === t && o.sex === n && !i.bag && !i.dfo;
  });
}
function Rn(t, n) {
  return t.slice().sort(function(e, r) {
    return n && n.bias === "male" && e.sex !== r.sex ? e.sex === "M" ? -1 : 1 : n && n.bias === "female" && e.sex !== r.sex ? e.sex === "F" ? -1 : 1 : st(e) - st(r) || String(e.id).localeCompare(String(r.id));
  });
}
function Wt(t) {
  var n = m.state.functionRotation && m.state.functionRotation[String(t)];
  if (!n) return 0;
  for (var e = 0, r = 0; r < n.length; r++) n[r] === "BAG" && e++;
  return e;
}
function kn(t, n, e, r) {
  if (!e || e <= 0) return { total: 0 };
  r = r || k();
  var o = Cn(t, n).slice();
  o.sort(function(f, s) {
    return st(f) - st(s) || String(f.id).localeCompare(String(s.id));
  });
  for (var i = 0, a = 0; a < o.length && i < e; a++)
    G(o[a]).bag = !0, i++;
  return { total: i };
}
function _n(t, n, e, r) {
  return { am: 0, pm: 0, total: 0 };
}
function Vt() {
  m.renderCoverageBars && m.renderCoverageBars(), m.renderReports && m.renderReports(), typeof window < "u" && window.dispatchEvent(new CustomEvent("lines:request-render")), !m.__USE_SVELTE_LINES && m.renderLines && m.renderLines();
}
function mt(t, n, e) {
  var r = String(t);
  for (m.state.functionRotation || (m.state.functionRotation = {}), m.state.functionRotation[r] || (m.state.functionRotation[r] = []); m.state.functionRotation[r].length <= n; ) m.state.functionRotation[r].push(null);
  return m.state.functionRotation[r][n] = e, !0;
}
function $n(t, n) {
  var e = m.state.functionRotation && m.state.functionRotation[String(t)];
  if (!e) return null;
  var r = e[n];
  return r == null || r === "" ? null : r;
}
function In(t) {
  var n = m.getShift ? m.getShift(t) : null;
  if (!n) return String(t);
  var e = n.name || t;
  return String(e).replace(":", "");
}
function jn(t, n) {
  return t.slice().sort(function(e, r) {
    var o = Wt(e.id), i = Wt(r.id);
    if (o !== i) return o - i;
    var a = Rn([e, r], n);
    return a[0] !== e ? 1 : a[0] !== r && e !== r ? -1 : String(e.id).localeCompare(String(r.id));
  });
}
function It(t) {
  t = t || k();
  var n = [], e = {}, r = ["STSO", "LTSO", "TSO"];
  return r.forEach(function(o) {
    var i = t.requirements && t.requirements[o] || {};
    Object.keys(i).forEach(function(a) {
      var f = K(o, a, t);
      if (!(f.min <= 0 && f.max <= 0)) {
        e[o + "|" + a] = { min: f.min, max: f.max };
        var s = ft(o, a), u = s.filter(function(v) {
          var p = G(v);
          return p.dfo && !p.bag;
        }), d = s.length < f.min || u.length < f.min ? "SHORT" : "OK", l = m.getShift ? m.getShift(a) : null;
        n.push({
          role: o,
          shiftId: a,
          shiftLabel: In(a),
          shiftStart: l ? l.start : null,
          shiftEnd: l ? l.end : null,
          missingShift: !l,
          eligible: s.length,
          requiredMin: f.min,
          requiredMax: f.max,
          assigned: Math.min(f.max, Math.max(f.min, 0), s.length),
          status: d
        });
      }
    });
  }), { diagnostics: n, configured: e };
}
function mn(t, n) {
  t = t || k(), n = n || 0;
  for (var e = ["STSO", "LTSO", "TSO"], r = [], o = 0; o < n; o++)
    for (var i = 0; i < e.length; i++)
      for (var a = e[i], f = t.requirements && t.requirements[a] || {}, s = Object.keys(f), u = 0; u < s.length; u++) {
        var d = s[u], l = K(a, d, t);
        if (!(l.min <= 0 && l.max <= 0)) {
          var v = ft(a, d).filter(function(L) {
            var W = G(L);
            return at(L, o) && !W.bag && W.dfo;
          });
          v = jn(v, t);
          var p = Math.min(l.max, Math.max(l.min, 0));
          p = Math.min(p, v.length);
          for (var A = 0; A < p; A++) mt(v[A].id, o, "BAG");
          if (o === 0) {
            var q = ft(a, d), R = q.filter(function(L) {
              var W = G(L);
              return W.dfo && !W.bag;
            }), I = R.filter(function(L) {
              return at(L, 0);
            }), C = R.length < l.min || I.length < l.min ? "SHORT" : "OK";
            r.push({
              role: a,
              shiftId: d,
              requiredMin: l.min,
              requiredMax: l.max,
              eligible: q.length,
              assigned: p,
              status: C
            });
          }
        }
      }
  return r;
}
function gn(t) {
  t = t || {}, m.readFunctionBandsFromDom && m.readFunctionBandsFromDom();
  var n = k();
  if (m.state.issues || (m.state.issues = []), Rt(n, m.state.issues), m.state.functionRotation = {}, (m.state.lines || []).forEach(function(u) {
    u.isExtra || u.extraPositionId || (u.function = "", u.functionEligible = { dfo: !1, bag: !1, pax: !1 });
  }), !m.state.lines || !m.state.lines.length) {
    n.lastDiagnostics = [], Vt(), !t.fromGenerate && m.updateStatus && m.updateStatus("Generate lines first.");
    return;
  }
  var e = qt(n), r = It(n);
  n.lastDiagnostics = r.diagnostics || [];
  var o = (m.state.weekCount || 1) * 7;
  (m.state.lines || []).forEach(function(u) {
    if (G(u).bag) {
      u.function = "BAG";
      for (var d = 0; d < o; d++) at(u, d) && mt(u.id, d, "BAG");
    }
  }), (m.state.lines || []).forEach(function(u) {
    G(u).bag || G(u).dfo && (u.function = "DFO");
  });
  var i = mn(n, o);
  i && i.length && (r.diagnostics || []).forEach(function(u) {
    for (var d = 0; d < i.length; d++)
      i[d].role !== u.role || i[d].shiftId !== u.shiftId || (u.assigned = i[d].assigned, i[d].status === "SHORT" && (u.status = "SHORT"));
  }), (m.state.lines || []).forEach(function(u) {
    if (!(u.isExtra || u.extraPositionId) && !G(u).bag) {
      if (G(u).dfo) {
        for (var d = 0; d < o; d++)
          at(u, d) && ($n(u.id, d) || mt(u.id, d, "DFO"));
        return;
      }
      G(u).pax = !0, u.function = "PAX";
      for (var l = 0; l < o; l++) at(u, l) && mt(u.id, l, "PAX");
    }
  });
  var a = [];
  (r.diagnostics || []).forEach(function(u) {
    if (u.status === "SHORT") {
      var d = u.shiftStart || u.shiftLabel || u.shiftId, l = u.role + " " + d + " shift: " + u.assigned + " / " + u.requiredMin;
      a.push(l), m.state.issues.push(l);
    }
  }), a.length && m.renderIssues && m.renderIssues(), Vt();
  var f = "BAG " + (e.bag.stso.total + e.bag.ltso.total + e.bag.tso.total) + " · DFO " + (e.stso.total + e.ltso.total + e.tso.total) + " · leftover PAX";
  a.length && (f += " · SHORT " + a.length);
  var s = m.$ && m.$("cert-assign-hint");
  return s && (s.textContent = f), !t.fromGenerate && m.updateStatus && m.updateStatus(f), !t.fromGenerate && m.closeFunctionCoverageModal && m.closeFunctionCoverageModal(), { diagnostics: r.diagnostics, shortfalls: a, poolStats: e };
}
const Nn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  applyShiftFunctionRequirements: It,
  bindAssignApi: dn,
  generateFunctionAssignments: gn,
  markBag: kn,
  markDfo: _n,
  rotateShiftBagDuties: mn
}, Symbol.toStringTag, { value: "Module" }));
let $ = null;
function pn(t) {
  $ = t;
}
function wn(t, n) {
  var e = Zt(t.id, n);
  return e || (t.function === "BAG" || t.function === "DFO" || t.function === "PAX" ? t.function : null);
}
function jt(t, n, e) {
  if (e = e || {}, !$ || !$.state) return 0;
  var r = 0;
  return ($.state.lines || []).forEach(function(o) {
    if (o) {
      if (!e.includeExtra) {
        if (o.isExtra || o.extraPositionId) return;
      }
      typeof $.getShift == "function" && !$.getShift(o.shiftId) || e.role && ut(o) !== e.role || Jt(o, t, n) && (e.duty && wn(o, t) !== e.duty || r++);
    }
  }), r;
}
function vn(t) {
  if (t = t || {}, !$ || !$.state) return { slots: [], cells: [] };
  for (var n = $.timeToMin ? $.timeToMin($.state.open || "03:30") : 0, e = $.timeToMin ? $.timeToMin($.state.close || "23:00") : 24 * 60, r = Math.floor(n / 30) * 30, o = Math.ceil(e / 30) * 30, i = [], a = r; a < o; a += 30) i.push(a);
  for (var f = t.days != null ? t.days : ($.state.weekCount || 1) * 7, s = t.roles || ["STSO", "LTSO", "TSO"], u = t.duties || ["BAG", "DFO", "PAX"], d = [], l = 0; l < f; l++)
    for (var v = 0; v < i.length; v++)
      for (var p = i[v], A = 0; A < s.length; A++)
        for (var q = 0; q < u.length; q++) {
          var R = jt(l, p, { role: s[A], duty: u[q] });
          (R > 0 || t.includeZeros) && d.push({
            dayIndex: l,
            slotMin: p,
            role: s[A],
            function: u[q],
            count: R
          });
        }
  return { slots: i, cells: d, days: f };
}
const Un = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bindCoverageCalcApi: pn,
  computeAssignedCoverage: vn,
  countAssignedAtSlot: jt
}, Symbol.toStringTag, { value: "Module" }));
function Gn(t) {
  return t = t || (typeof window < "u" ? window.Scheduler : null), t ? (Sn(t), on(t), Qt(t), pn(t), an(t), dn(t), t.fteCapsByRoleSex = Ct, t.ensureFunctionCoverage = k, t.getFunctionMode = rn, t.syncFunctionModeUi = pt, t.fillFunctionCoverageForm = vt, t.computeShiftAnchors = At, t.phaseOfStart = Lt, t.isAmSide = Tn, t.lineStartMin = st, t.lineRoleKey = ut, t.isOpsFunctionRole = hn, t.lineIsDfoTagged = bn, t.getRotationDuty = Zt, t.lineCoversSlot = Jt, t.bandForMinute = Mn, t.openFunctionCoverageModal = _t, t.closeFunctionCoverageModal = gt, t.renderFunctionBandsTable = sn, t.renderFunctionShiftsTable = H, t.readFunctionBandsFromDom = fn, t.readFunctionCoverageFromDom = Y, t.updateFunctionCoveragePreview = N, t.capFunctionPoolsToFte = Rt, t.buildCertifiedPools = qt, t.generateFunctionAssignments = gn, t.applyShiftFunctionRequirements = It, t.getConfiguredFunctionShifts = tn, t.getShiftRequirement = K, t.getEligibleLinesForShift = ft, t.addFcShiftRequirement = et, t.addFcBand = un, t.computeAssignedCoverage = vn, t.countAssignedAtSlot = jt, t.migrateFunctionCoverageConfig = Bt, t.ensureExtraPositions = X, t.readExtraPositionsFromDom = Q, t.clearLineFunctions = Fn, t.initFunctionCoverage = Gn, cn(), t) : null;
}
export {
  ln as addExtraPosition,
  un as addFcBand,
  et as addFcShiftRequirement,
  It as applyShiftFunctionRequirements,
  Nn as assign,
  ot as bagPoolTotal,
  Mn as bandForMinute,
  zn as bands,
  dn as bindAssignApi,
  an as bindBandsApi,
  pn as bindCoverageCalcApi,
  Sn as bindDutyApi,
  cn as bindFunctionCoverageUi,
  on as bindPoolsApi,
  Qt as bindShiftsApi,
  qt as buildCertifiedPools,
  Pn as buildExtraPositionLines,
  Rt as capFunctionPoolsToFte,
  Fn as clearLineFunctions,
  gt as closeFunctionCoverageModal,
  vn as computeAssignedCoverage,
  At as computeShiftAnchors,
  jt as countAssignedAtSlot,
  Un as coverage,
  Pt as dfoPoolTotal,
  X as ensureExtraPositions,
  k as ensureFunctionCoverage,
  vt as fillFunctionCoverageForm,
  Ct as fteCapsByRoleSex,
  gn as generateFunctionAssignments,
  tn as getConfiguredFunctionShifts,
  ft as getEligibleLinesForShift,
  rn as getFunctionMode,
  Zt as getRotationDuty,
  K as getShiftRequirement,
  Gn as initFunctionCoverage,
  Tn as isAmSide,
  hn as isOpsFunctionRole,
  Jt as lineCoversSlot,
  bn as lineIsDfoTagged,
  ut as lineRoleKey,
  st as lineStartMin,
  kn as markBag,
  _n as markDfo,
  Xn as migrate,
  Bt as migrateFunctionCoverageConfig,
  _t as openFunctionCoverageModal,
  Lt as phaseOfStart,
  Kn as pools,
  Q as readExtraPositionsFromDom,
  fn as readFunctionBandsFromDom,
  Y as readFunctionCoverageFromDom,
  U as renderExtraPositions,
  sn as renderFunctionBandsTable,
  H as renderFunctionShiftsTable,
  Hn as shifts,
  pt as syncFunctionModeUi,
  N as updateFunctionCoveragePreview
};
