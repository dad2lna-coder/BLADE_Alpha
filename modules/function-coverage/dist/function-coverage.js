function g() {
  throw new Error("TODO function-coverage: ensureFunctionCoverage");
}
function l() {
  throw new Error("TODO function-coverage: getFunctionMode");
}
function O() {
  throw new Error("TODO function-coverage: fteCapsByRoleSex");
}
function v() {
  throw new Error("TODO function-coverage: capFunctionPoolsToFte");
}
function d() {
  throw new Error("TODO function-coverage: buildCertifiedPools");
}
function w() {
  throw new Error("TODO function-coverage: syncDerivedMode");
}
function T() {
  throw new Error("TODO function-coverage: bagPoolTotal");
}
function m() {
  throw new Error("TODO function-coverage: dfoPoolTotal");
}
const k = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagPoolTotal: T,
  buildCertifiedPools: d,
  capFunctionPoolsToFte: v,
  dfoPoolTotal: m,
  ensureFunctionCoverage: g,
  fteCapsByRoleSex: O,
  getFunctionMode: l,
  syncDerivedMode: w
}, Symbol.toStringTag, { value: "Module" }));
function E() {
  throw new Error("TODO function-coverage: renderFunctionBandsTable");
}
function S() {
  throw new Error("TODO function-coverage: readFunctionBandsFromDom");
}
function h() {
  throw new Error("TODO function-coverage: updateFunctionCoveragePreview");
}
function D() {
  throw new Error("TODO function-coverage: openFunctionCoverageModal");
}
function F() {
  throw new Error("TODO function-coverage: closeFunctionCoverageModal");
}
function p() {
  throw new Error("TODO function-coverage: fillFunctionCoverageForm");
}
function P() {
  throw new Error("TODO function-coverage: syncFunctionModeUi");
}
function C() {
  throw new Error("TODO function-coverage: ensureExtraPositions");
}
function b() {
  throw new Error("TODO function-coverage: readExtraPositionsFromDom");
}
function y() {
  throw new Error("TODO function-coverage: renderExtraPositions");
}
function x() {
  throw new Error("TODO function-coverage: addExtraPosition");
}
function M() {
  throw new Error("TODO function-coverage: buildExtraPositionLines");
}
const I = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addExtraPosition: x,
  buildExtraPositionLines: M,
  closeFunctionCoverageModal: F,
  ensureExtraPositions: C,
  fillFunctionCoverageForm: p,
  openFunctionCoverageModal: D,
  readExtraPositionsFromDom: b,
  readFunctionBandsFromDom: S,
  renderExtraPositions: y,
  renderFunctionBandsTable: E,
  syncFunctionModeUi: P,
  updateFunctionCoveragePreview: h
}, Symbol.toStringTag, { value: "Module" }));
let r = null;
function z(n) {
  r = n;
}
function K(n) {
  return n ? n.isExtra || n.extraPositionId ? n.empClass || n.position || "EXTRA" : n.isStso || n.empClass === "STSO" ? "STSO" : n.isLtso || n.empClass === "LTSO" ? "LTSO" : "TSO" : "TSO";
}
function N(n) {
  var t = r.lineRoleKey(n);
  return t === "STSO" || t === "LTSO" || t === "TSO";
}
function U(n) {
  return !n || n.isExtra || n.extraPositionId ? !1 : n.function === "DFO" || !!(n.functionEligible && n.functionEligible.dfo);
}
function X(n, t) {
  var e = r.state.functionRotation || {}, a = e[String(n)] || e[n];
  if (a) {
    var u = a[t];
    return u == null || u === "" ? null : u;
  }
  var i = null;
  if (r.state && Array.isArray(r.state.lines)) {
    for (var o = 0; o < r.state.lines.length; o++)
      if (String(r.state.lines[o].id) === String(n)) {
        i = r.state.lines[o];
        break;
      }
  }
  return i && (i.function === "BAG" || i.function === "DFO" || i.function === "PAX") ? i.function : null;
}
function G(n) {
  var t = r.getShift(n.shiftId);
  return t ? r.timeToMin(t.start) : 0;
}
function s(n, t, e) {
  return e = e ?? 15, t = t || r.computeShiftAnchors(), n <= t.am - e && n < 11 * 60 ? "Opening" : n >= t.pm + e && n >= 11 * 60 + 15 ? "Closing" : n < t.pm ? "AM" : "PM";
}
function W(n, t, e) {
  return s(n, t, e) === "Opening" || s(n, t, e) === "AM";
}
function q(n, t, e) {
  var a = r.state.schedule[n.id] || r.state.schedule[String(n.id)];
  if (!a || a[t] !== "WORK") return !1;
  var u = t % 7, i = r.getEffectiveShiftTimes ? r.getEffectiveShiftTimes(n.shiftId, u) : null;
  if (!i) {
    var o = r.getShift(n.shiftId);
    if (!o) return !1;
    i = { start: o.start, end: o.end };
  }
  var f = r.timeToMin(i.start), c = r.timeToMin(i.end);
  return c <= f ? e >= f || e < c : e >= f && e < c;
}
function H(n, t) {
  t = t || r.ensureFunctionCoverage().bands;
  for (var e = 0; e < t.length; e++) {
    var a = t[e], u = r.timeToMin(a.start), i = r.timeToMin(a.end);
    i <= u && (i += 1440);
    var o = n;
    if (i > 1440 && o < u && (o += 1440), o >= u && o < i) return a;
  }
  return null;
}
function J() {
  var n = {};
  (r.state.lines || []).forEach(function(o) {
    var f = r.getShift(o.shiftId);
    if (f) {
      var c = r.timeToMin(f.start);
      n[c] = (n[c] || 0) + 1;
    }
  });
  var t = Object.keys(n).map(function(o) {
    return { min: +o, n: n[o] };
  }).sort(function(o, f) {
    return o.min - f.min;
  });
  if (!t.length) return { am: 8 * 60, pm: 14 * 60 };
  var e = t[0].min, a = 0;
  t.forEach(function(o) {
    o.min < 11 * 60 && o.n > a && (a = o.n, e = o.min);
  });
  var u = t[t.length - 1].min, i = 0;
  return t.forEach(function(o) {
    o.min >= 11 * 60 + 15 && o.n > i && (i = o.n, u = o.min);
  }), i === 0 && t.forEach(function(o) {
    o.min >= 12 * 60 && o.n > i && (i = o.n, u = o.min);
  }), { am: e, pm: u };
}
function Q() {
  (r.state.lines || []).forEach(function(n) {
    n.function = "", n.functionEligible = { dfo: !1, bag: !1, pax: !1 };
  }), r.state.functionRotation = {};
}
function A() {
  throw new Error("TODO function-coverage: generateFunctionAssignments");
}
function B() {
  throw new Error("TODO function-coverage: markDfo");
}
function _() {
  throw new Error("TODO function-coverage: markBag");
}
function R() {
  throw new Error("TODO function-coverage: fillBandShortfalls");
}
function j() {
  throw new Error("TODO function-coverage: bagSlotCounts");
}
function L() {
  throw new Error("TODO function-coverage: worstBagCoverage");
}
const V = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bagSlotCounts: j,
  fillBandShortfalls: R,
  generateFunctionAssignments: A,
  markBag: _,
  markDfo: B,
  worstBagCoverage: L
}, Symbol.toStringTag, { value: "Module" }));
function Y(n) {
  return n;
}
export {
  V as assign,
  H as bandForMinute,
  I as bands,
  z as bindDutyApi,
  Q as clearLineFunctions,
  J as computeShiftAnchors,
  X as getRotationDuty,
  Y as initFunctionCoverage,
  W as isAmSide,
  N as isOpsFunctionRole,
  q as lineCoversSlot,
  U as lineIsDfoTagged,
  K as lineRoleKey,
  G as lineStartMin,
  s as phaseOfStart,
  k as pools
};
