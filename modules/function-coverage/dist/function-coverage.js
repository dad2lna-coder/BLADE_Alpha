let a = null;
function z(o) {
  a = o;
}
function r(o) {
  return Math.max(0, Math.floor(+o || 0));
}
function C(o) {
  return r(o.poolStsoBagM) + r(o.poolStsoBagF) + r(o.poolLtsoBagM) + r(o.poolLtsoBagF) + r(o.poolTsoBagM) + r(o.poolTsoBagF);
}
function G(o) {
  return r(o.poolStsoDfoM) + r(o.poolStsoDfoF) + r(o.poolLtsoDfoM) + r(o.poolLtsoDfoF) + r(o.poolTsoDfoM) + r(o.poolTsoDfoF);
}
function x() {
  a.state.functionCoverage || (a.state.functionCoverage = {});
  var o = a.state.functionCoverage;
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
  }), o.poolStsoDfo == null && (o.poolStsoDfo = r(o.poolStsoDfoM) + r(o.poolStsoDfoF)), o.poolLtsoDfo == null && (o.poolLtsoDfo = r(o.poolLtsoDfoM) + r(o.poolLtsoDfoF)), o.poolTsoDfo == null && (o.poolTsoDfo = r(o.poolTsoDfoM) + r(o.poolTsoDfoF)), o.poolBag == null && (o.poolBag = C(o)), !o.poolStsoDfoM && !o.poolStsoDfoF && o.poolStsoDfo && (o.poolStsoDfoM = o.poolStsoDfo), !o.poolLtsoDfoM && !o.poolLtsoDfoF && o.poolLtsoDfo && (o.poolLtsoDfoM = o.poolLtsoDfo), !o.poolTsoDfoM && !o.poolTsoDfoF && o.poolTsoDfo && (o.poolTsoDfoM = o.poolTsoDfo), !o.poolTsoBagM && !o.poolTsoBagF && o.poolBag && (o.poolTsoBagM = o.poolBag), o.amPmSplit == null && (o.amPmSplit = !0), o.phaseThresholdMin == null && (o.phaseThresholdMin = 15), o.bias == null && (o.bias = "none"), (!Array.isArray(o.bands) || !o.bands.length) && (o.bands = W()), delete o.stsoIsDfo, delete o.poolDfo, delete o.poolPax, a.state.functionRotation || (a.state.functionRotation = {}), R(o), o;
}
function N() {
  return R(x());
}
function q() {
  var o = a.state || {};
  return {
    STSO: { M: r(o.stsoM), F: r(o.stsoF) },
    LTSO: { M: r(o.ltsoM), F: r(o.ltsoF) },
    TSO: { M: r(o.ftM) + r(o.ptM), F: r(o.ftF) + r(o.ptF) }
  };
}
function U(o, t) {
  o = o || x();
  var e = q();
  function c(s, i, n, m, g) {
    var f = e[s].M, p = e[s].F, M = r(o[i]), u = r(o[n]), d = r(o[m]), T = r(o[g]);
    M > f && (t && t.push("BAG " + s + " M pool " + M + " exceeds FTE " + f + " — capped."), M = f), u > p && (t && t.push("BAG " + s + " F pool " + u + " exceeds FTE " + p + " — capped."), u = p);
    var v = Math.max(0, f - M), h = Math.max(0, p - u);
    d > v && (t && t.push("DFO " + s + " M pool " + d + " exceeds remaining FTE " + v + " after BAG — capped."), d = v), T > h && (t && t.push("DFO " + s + " F pool " + T + " exceeds remaining FTE " + h + " after BAG — capped."), T = h), o[i] = M, o[n] = u, o[m] = d, o[g] = T;
  }
  return c("STSO", "poolStsoBagM", "poolStsoBagF", "poolStsoDfoM", "poolStsoDfoF"), c("LTSO", "poolLtsoBagM", "poolLtsoBagF", "poolLtsoDfoM", "poolLtsoDfoF"), c("TSO", "poolTsoBagM", "poolTsoBagF", "poolTsoDfoM", "poolTsoDfoF"), R(o), o;
}
function R(o) {
  var t = C(o) > 0, e = G(o) > 0;
  return o.poolBag = C(o), o.poolStsoDfo = r(o.poolStsoDfoM) + r(o.poolStsoDfoF), o.poolLtsoDfo = r(o.poolLtsoDfoM) + r(o.poolLtsoDfoF), o.poolTsoDfo = r(o.poolTsoDfoM) + r(o.poolTsoDfoF), o.mode = t && e ? "both" : t ? "bag" : e ? "dfo" : "none", o;
}
function X(o) {
  o = o || x();
  var t = a.state.lines || [];
  t.forEach(function(p) {
    p.isExtra || p.extraPositionId || (p.functionEligible = { dfo: !1, bag: !1, pax: !1 }, p.function = "");
  });
  var e = a.computeShiftAnchors(), c = o.phaseThresholdMin || 15;
  function s(p) {
    return (!p.functionEligible || typeof p.functionEligible != "object") && (p.functionEligible = { dfo: !1, bag: !1, pax: !1 }), p.functionEligible;
  }
  function i(p, M) {
    return t.filter(function(u) {
      if (u.isExtra || u.extraPositionId) return !1;
      var d = s(u);
      return a.lineRoleKey(u) === p && u.sex === M && !d.bag && !d.dfo;
    });
  }
  function n(p, M, u) {
    if (!u || u <= 0) return { total: 0 };
    var d = i(p, M).slice();
    d.sort(function(h, b) {
      return a.lineStartMin(h) - a.lineStartMin(b) || String(h.id).localeCompare(String(b.id));
    });
    for (var T = 0, v = 0; v < d.length && T < u; v++)
      s(d[v]).bag = !0, T++;
    return { total: T };
  }
  function m(p, M, u) {
    if (!u || u <= 0) return { am: 0, pm: 0, total: 0 };
    var d = i(p, M).slice();
    d.sort(function(S, F) {
      return a.lineStartMin(S) - a.lineStartMin(F) || String(S.id).localeCompare(String(F.id));
    });
    var T = d.filter(function(S) {
      return a.isAmSide(a.lineStartMin(S), e, c);
    }), v = d.filter(function(S) {
      return !a.isAmSide(a.lineStartMin(S), e, c);
    }), h = o.bands || [], b = h[0], k = h[h.length - 1];
    function L(S, F) {
      if (!F) return !1;
      var O = a.timeToMin(F.start), D = a.getShift(S.shiftId);
      if (!D) return !1;
      var w = a.timeToMin(D.start), _ = a.timeToMin(D.end);
      return _ <= w && (_ += 1440), O >= w && O < _;
    }
    T.sort(function(S, F) {
      var O = L(S, b) ? 0 : 1, D = L(F, b) ? 0 : 1;
      return O !== D ? O - D : a.lineStartMin(S) - a.lineStartMin(F) || String(S.id).localeCompare(String(F.id));
    }), v.sort(function(S, F) {
      var O = L(S, k) ? 0 : 1, D = L(F, k) ? 0 : 1;
      return O !== D ? O - D : a.lineStartMin(S) - a.lineStartMin(F) || String(S.id).localeCompare(String(F.id));
    });
    var E = o.amPmSplit ? Math.ceil(u / 2) : u, B = o.amPmSplit ? Math.floor(u / 2) : 0;
    for (T.length < E && (B += E - T.length, E = T.length), v.length < B && (E = Math.min(T.length, E + (B - v.length)), B = v.length); E + B > u; )
      if (B >= E && B > 0) B--;
      else if (E > 0) E--;
      else break;
    function A(S, F) {
      for (var O = 0, D = 0; D < S.length && O < F; D++) {
        var w = s(S[D]);
        w.bag || w.dfo || (w.dfo = !0, O++);
      }
      return O;
    }
    var y = A(T, E), P = A(v, B), j = u - y - P;
    return j > 0 && (P += A(i(p, M), j)), { am: y, pm: P, total: y + P };
  }
  var g = {
    stso: { m: n("STSO", "M", o.poolStsoBagM).total, f: n("STSO", "F", o.poolStsoBagF).total },
    ltso: { m: n("LTSO", "M", o.poolLtsoBagM).total, f: n("LTSO", "F", o.poolLtsoBagF).total },
    tso: { m: n("TSO", "M", o.poolTsoBagM).total, f: n("TSO", "F", o.poolTsoBagF).total }
  };
  g.stso.total = g.stso.m + g.stso.f, g.ltso.total = g.ltso.m + g.ltso.f, g.tso.total = g.tso.m + g.tso.f;
  var f = {
    stso: m("STSO", "M", o.poolStsoDfoM),
    stsoF: m("STSO", "F", o.poolStsoDfoF),
    ltso: m("LTSO", "M", o.poolLtsoDfoM),
    ltsoF: m("LTSO", "F", o.poolLtsoDfoF),
    tso: m("TSO", "M", o.poolTsoDfoM),
    tsoF: m("TSO", "F", o.poolTsoDfoF)
  };
  return {
    bag: g,
    stso: { total: f.stso.total + f.stsoF.total, am: f.stso.am + f.stsoF.am, pm: f.stso.pm + f.stsoF.pm },
    ltso: { total: f.ltso.total + f.ltsoF.total, am: f.ltso.am + f.ltsoF.am, pm: f.ltso.pm + f.ltsoF.pm },
    tso: { total: f.tso.total + f.tsoF.total, am: f.tso.am + f.tsoF.am, pm: f.tso.pm + f.tsoF.pm },
    anchors: e
  };
}
function W() {
  return [
    { start: "03:30", end: "04:00", stso: 1, ltso: 1, tso: 2 },
    { start: "04:00", end: "20:30", stso: 1, ltso: 1, tso: 6 },
    { start: "20:30", end: "23:00", stso: 1, ltso: 1, tso: 3 }
  ];
}
const go = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagPoolTotal: C,
  bindPoolsApi: z,
  buildCertifiedPools: X,
  capFunctionPoolsToFte: U,
  dfoPoolTotal: G,
  ensureFunctionCoverage: x,
  fteCapsByRoleSex: q,
  getFunctionMode: N
}, Symbol.toStringTag, { value: "Module" }));
function $() {
  throw new Error("TODO function-coverage: renderFunctionBandsTable");
}
function H() {
  throw new Error("TODO function-coverage: readFunctionBandsFromDom");
}
function J() {
  throw new Error("TODO function-coverage: updateFunctionCoveragePreview");
}
function Q() {
  throw new Error("TODO function-coverage: openFunctionCoverageModal");
}
function V() {
  throw new Error("TODO function-coverage: closeFunctionCoverageModal");
}
function Y() {
  throw new Error("TODO function-coverage: fillFunctionCoverageForm");
}
function Z() {
  throw new Error("TODO function-coverage: syncFunctionModeUi");
}
function K() {
  throw new Error("TODO function-coverage: ensureExtraPositions");
}
function oo() {
  throw new Error("TODO function-coverage: readExtraPositionsFromDom");
}
function to() {
  throw new Error("TODO function-coverage: renderExtraPositions");
}
function no() {
  throw new Error("TODO function-coverage: addExtraPosition");
}
function ro() {
  throw new Error("TODO function-coverage: buildExtraPositionLines");
}
const co = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addExtraPosition: no,
  buildExtraPositionLines: ro,
  closeFunctionCoverageModal: V,
  ensureExtraPositions: K,
  fillFunctionCoverageForm: Y,
  openFunctionCoverageModal: Q,
  readExtraPositionsFromDom: oo,
  readFunctionBandsFromDom: H,
  renderExtraPositions: to,
  renderFunctionBandsTable: $,
  syncFunctionModeUi: Z,
  updateFunctionCoveragePreview: J
}, Symbol.toStringTag, { value: "Module" }));
let l = null;
function So(o) {
  l = o;
}
function eo(o) {
  return o ? o.isExtra || o.extraPositionId ? o.empClass || o.position || "EXTRA" : o.isStso || o.empClass === "STSO" ? "STSO" : o.isLtso || o.empClass === "LTSO" ? "LTSO" : "TSO" : "TSO";
}
function mo(o) {
  var t = eo(o);
  return t === "STSO" || t === "LTSO" || t === "TSO";
}
function To(o) {
  return !o || o.isExtra || o.extraPositionId ? !1 : o.function === "DFO" || !!(o.functionEligible && o.functionEligible.dfo);
}
function Fo(o, t) {
  var e = l.state.functionRotation || {}, c = e[String(o)] || e[o];
  if (c) {
    var s = c[t];
    return s == null || s === "" ? null : s;
  }
  var i = null;
  if (l.state && Array.isArray(l.state.lines)) {
    for (var n = 0; n < l.state.lines.length; n++)
      if (String(l.state.lines[n].id) === String(o)) {
        i = l.state.lines[n];
        break;
      }
  }
  return i && (i.function === "BAG" || i.function === "DFO" || i.function === "PAX") ? i.function : null;
}
function vo(o) {
  var t = l.getShift(o.shiftId);
  return t ? l.timeToMin(t.start) : 0;
}
function I(o, t, e) {
  return e = e ?? 15, t = t || io(), o <= t.am - e && o < 11 * 60 ? "Opening" : o >= t.pm + e && o >= 11 * 60 + 15 ? "Closing" : o < t.pm ? "AM" : "PM";
}
function Do(o, t, e) {
  return I(o, t, e) === "Opening" || I(o, t, e) === "AM";
}
function Mo(o, t, e) {
  var c = l.state.schedule[o.id] || l.state.schedule[String(o.id)];
  if (!c || c[t] !== "WORK") return !1;
  var s = t % 7, i = l.getEffectiveShiftTimes ? l.getEffectiveShiftTimes(o.shiftId, s) : null;
  if (!i) {
    var n = l.getShift(o.shiftId);
    if (!n) return !1;
    i = { start: n.start, end: n.end };
  }
  var m = l.timeToMin(i.start), g = l.timeToMin(i.end);
  return g <= m ? e >= m || e < g : e >= m && e < g;
}
function Oo(o, t) {
  t = t || l.ensureFunctionCoverage().bands;
  for (var e = 0; e < t.length; e++) {
    var c = t[e], s = l.timeToMin(c.start), i = l.timeToMin(c.end);
    i <= s && (i += 1440);
    var n = o;
    if (i > 1440 && n < s && (n += 1440), n >= s && n < i) return c;
  }
  return null;
}
function io() {
  var o = {};
  (l.state.lines || []).forEach(function(n) {
    var m = l.getShift(n.shiftId);
    if (m) {
      var g = l.timeToMin(m.start);
      o[g] = (o[g] || 0) + 1;
    }
  });
  var t = Object.keys(o).map(function(n) {
    return { min: +n, n: o[n] };
  }).sort(function(n, m) {
    return n.min - m.min;
  });
  if (!t.length) return { am: 8 * 60, pm: 14 * 60 };
  var e = t[0].min, c = 0;
  t.forEach(function(n) {
    n.min < 11 * 60 && n.n > c && (c = n.n, e = n.min);
  });
  var s = t[t.length - 1].min, i = 0;
  return t.forEach(function(n) {
    n.min >= 11 * 60 + 15 && n.n > i && (i = n.n, s = n.min);
  }), i === 0 && t.forEach(function(n) {
    n.min >= 12 * 60 && n.n > i && (i = n.n, s = n.min);
  }), { am: e, pm: s };
}
function ho() {
  (l.state.lines || []).forEach(function(o) {
    o.function = "", o.functionEligible = { dfo: !1, bag: !1, pax: !1 };
  }), l.state.functionRotation = {};
}
function ao() {
  throw new Error("TODO function-coverage: generateFunctionAssignments");
}
function so() {
  throw new Error("TODO function-coverage: markDfo");
}
function lo() {
  throw new Error("TODO function-coverage: markBag");
}
function fo() {
  throw new Error("TODO function-coverage: fillBandShortfalls");
}
function uo() {
  throw new Error("TODO function-coverage: bagSlotCounts");
}
function po() {
  throw new Error("TODO function-coverage: worstBagCoverage");
}
const Eo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagSlotCounts: uo,
  fillBandShortfalls: fo,
  generateFunctionAssignments: ao,
  markBag: lo,
  markDfo: so,
  worstBagCoverage: po
}, Symbol.toStringTag, { value: "Module" }));
function Bo(o) {
  return o;
}
export {
  Eo as assign,
  C as bagPoolTotal,
  Oo as bandForMinute,
  co as bands,
  So as bindDutyApi,
  z as bindPoolsApi,
  X as buildCertifiedPools,
  U as capFunctionPoolsToFte,
  ho as clearLineFunctions,
  io as computeShiftAnchors,
  G as dfoPoolTotal,
  x as ensureFunctionCoverage,
  q as fteCapsByRoleSex,
  N as getFunctionMode,
  Fo as getRotationDuty,
  Bo as initFunctionCoverage,
  Do as isAmSide,
  mo as isOpsFunctionRole,
  Mo as lineCoversSlot,
  To as lineIsDfoTagged,
  eo as lineRoleKey,
  vo as lineStartMin,
  I as phaseOfStart,
  go as pools
};
