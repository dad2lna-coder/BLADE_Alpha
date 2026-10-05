var wn = Object.defineProperty;
var Dn = (t, e, n) => e in t ? wn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Vt = (t, e, n) => Dn(t, typeof e != "symbol" ? e + "" : e, n);
function it() {
}
function vn(t) {
  return t();
}
function Xt() {
  return /* @__PURE__ */ Object.create(null);
}
function at(t) {
  t.forEach(vn);
}
function gn(t) {
  return typeof t == "function";
}
function Tn(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Cn(t) {
  return Object.keys(t).length === 0;
}
function Wt(t) {
  return t ?? "";
}
function i(t, e) {
  t.appendChild(e);
}
function de(t, e, n) {
  t.insertBefore(e, n || null);
}
function re(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function _t(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function o(t) {
  return document.createElement(t);
}
function fe(t) {
  return document.createTextNode(t);
}
function z() {
  return fe(" ");
}
function G(t, e, n, s) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n, s);
}
function a(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Rn(t) {
  return Array.from(t.childNodes);
}
function lt(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function T(t, e) {
  t.value = e ?? "";
}
function J(t, e, n, s) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
function U(t, e, n) {
  for (let s = 0; s < t.options.length; s += 1) {
    const r = t.options[s];
    if (r.__value === e) {
      r.selected = !0;
      return;
    }
  }
  (!n || e !== void 0) && (t.selectedIndex = -1);
}
function Dt(t) {
  const e = t.querySelector(":checked");
  return e && e.__value;
}
let zt;
function Ot(t) {
  zt = t;
}
function bn() {
  if (!zt) throw new Error("Function called outside component initialization");
  return zt;
}
function Fn(t) {
  bn().$$.on_mount.push(t);
}
const Ct = [], Pt = [];
let bt = [];
const Ht = [], An = /* @__PURE__ */ Promise.resolve();
let Mt = !1;
function Sn() {
  Mt || (Mt = !0, An.then(pn));
}
function et(t) {
  bt.push(t);
}
const Nt = /* @__PURE__ */ new Set();
let Tt = 0;
function pn() {
  if (Tt !== 0)
    return;
  const t = zt;
  do {
    try {
      for (; Tt < Ct.length; ) {
        const e = Ct[Tt];
        Tt++, Ot(e), On(e.$$);
      }
    } catch (e) {
      throw Ct.length = 0, Tt = 0, e;
    }
    for (Ot(null), Ct.length = 0, Tt = 0; Pt.length; ) Pt.pop()();
    for (let e = 0; e < bt.length; e += 1) {
      const n = bt[e];
      Nt.has(n) || (Nt.add(n), n());
    }
    bt.length = 0;
  } while (Ct.length);
  for (; Ht.length; )
    Ht.pop()();
  Mt = !1, Nt.clear(), Ot(t);
}
function On(t) {
  if (t.fragment !== null) {
    t.update(), at(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(et);
  }
}
function zn(t) {
  const e = [], n = [];
  bt.forEach((s) => t.indexOf(s) === -1 ? e.push(s) : n.push(s)), n.forEach((s) => s()), bt = e;
}
const In = /* @__PURE__ */ new Set();
function mn(t, e) {
  t && t.i && (In.delete(t), t.i(e));
}
function ye(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function En(t, e) {
  t.d(1), e.delete(t.key);
}
function Ln(t, e, n, s, r, l, u, g, c, f, D, R) {
  let S = t.length, b = l.length, V = S;
  const M = {};
  for (; V--; ) M[t[V].key] = V;
  const W = [], O = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), d = [];
  for (V = b; V--; ) {
    const w = R(r, l, V), I = n(w);
    let P = u.get(I);
    P ? d.push(() => P.p(w, e)) : (P = f(I, w), P.c()), O.set(I, W[V] = P), I in M && N.set(I, Math.abs(V - M[I]));
  }
  const p = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set();
  function y(w) {
    mn(w, 1), w.m(g, D), u.set(w.key, w), D = w.first, b--;
  }
  for (; S && b; ) {
    const w = W[b - 1], I = t[S - 1], P = w.key, E = I.key;
    w === I ? (D = w.first, S--, b--) : O.has(E) ? !u.has(P) || p.has(P) ? y(w) : v.has(E) ? S-- : N.get(P) > N.get(E) ? (v.add(P), y(w)) : (p.add(E), S--) : (c(I, u), S--);
  }
  for (; S--; ) {
    const w = t[S];
    O.has(w.key) || c(w, u);
  }
  for (; b; ) y(W[b - 1]);
  return at(d), W;
}
function Bn(t, e, n) {
  const { fragment: s, after_update: r } = t.$$;
  s && s.m(e, n), et(() => {
    const l = t.$$.on_mount.map(vn).filter(gn);
    t.$$.on_destroy ? t.$$.on_destroy.push(...l) : at(l), t.$$.on_mount = [];
  }), r.forEach(et);
}
function kn(t, e) {
  const n = t.$$;
  n.fragment !== null && (zn(n.after_update), at(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function Vn(t, e) {
  t.$$.dirty[0] === -1 && (Ct.push(t), Sn(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function Nn(t, e, n, s, r, l, u = null, g = [-1]) {
  const c = zt;
  Ot(t);
  const f = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: l,
    update: it,
    not_equal: r,
    bound: Xt(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (c ? c.$$.context : [])),
    // everything else
    callbacks: Xt(),
    dirty: g,
    skip_bound: !1,
    root: e.target || c.$$.root
  };
  u && u(f.root);
  let D = !1;
  if (f.ctx = n ? n(t, e.props || {}, (R, S, ...b) => {
    const V = b.length ? b[0] : S;
    return f.ctx && r(f.ctx[R], f.ctx[R] = V) && (!f.skip_bound && f.bound[R] && f.bound[R](V), D && Vn(t, R)), S;
  }) : [], f.update(), D = !0, at(f.before_update), f.fragment = s ? s(f.ctx) : !1, e.target) {
    if (e.hydrate) {
      const R = Rn(e.target);
      f.fragment && f.fragment.l(R), R.forEach(re);
    } else
      f.fragment && f.fragment.c();
    e.intro && mn(t.$$.fragment), Bn(t, e.target, e.anchor), pn();
  }
  Ot(c);
}
class Pn {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Vt(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Vt(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    kn(this, 1), this.$destroy = it;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, n) {
    if (!gn(n))
      return it;
    const s = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return s.push(n), () => {
      const r = s.indexOf(n);
      r !== -1 && s.splice(r, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !Cn(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const Mn = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Mn);
function Kt() {
  return {
    rdo: "#000000",
    bag: "#F4B4B4",
    dfo: "#FFF3A8",
    pax: "#A0C4FF",
    training: "#D8B4F8",
    header: "#1F4E79"
  };
}
function Gn(t, e) {
  if (!t) return e;
  var n = String(t).replace("#", "").trim();
  return n.length === 3 && (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]), n.length !== 6 || /[^0-9a-fA-F]/.test(n) ? e : "#" + n.toUpperCase();
}
function Xn(t) {
  var e = Gn(t, "#FFFFFF") || "#FFFFFF", n = e.slice(1), s = parseInt(n.slice(0, 2), 16), r = parseInt(n.slice(2, 4), 16), l = parseInt(n.slice(4, 6), 16), u = (0.299 * s + 0.587 * r + 0.114 * l) / 255;
  return u < 0.45 ? "#FFFFFF" : "#111111";
}
function Ut(t, e, n) {
  const s = t.slice();
  return s[67] = e[n], s;
}
function jt(t, e, n) {
  const s = t.slice();
  return s[70] = e[n], s;
}
function qt(t, e, n) {
  const s = t.slice();
  return s[73] = e[n], s;
}
function Yt(t, e, n) {
  const s = t.slice();
  return s[76] = e[n], s;
}
function Jt(t, e, n) {
  const s = t.slice();
  return s[79] = e[n], s;
}
function Qt(t, e, n) {
  const s = t.slice();
  return s[82] = e[n], s;
}
function Zt(t, e, n) {
  const s = t.slice();
  return s[79] = e[n], s;
}
function xt(t, e, n) {
  const s = t.slice();
  return s[82] = e[n], s;
}
function Wn(t) {
  let e;
  return {
    c() {
      e = o("div"), e.textContent = "Classic Lines mode active", a(e, "class", "muted");
    },
    m(n, s) {
      de(n, e, s);
    },
    p: it,
    d(n) {
      n && re(e);
    }
  };
}
function Hn(t) {
  let e, n, s, r, l, u, g, c, f, D, R, S, b, V, M, W, O, N, d, p, v, y, w, I, P, E, X, k, te, we, Y, ne, q, Ne, Ee, Fe, x, Pe, H, De, le, Le, Q, ce, _e, he, Be, st, Ue, Ye, K, ve, ge, pe, ke, ue, me, je, A, qe, Je, $, Me, Te, Ge, Xe, ot, Qe, _, F, ie, Ve, rt, Ze, ht, ut, vt, xe, ft, tt, dt, nt, Ft, We, ae, gt, It, He, se, pt, Et, mt, $e, ee, Lt, Ke, oe, yt, Bt, Ae, At, Se = [], Oe = /* @__PURE__ */ new Map(), m, B, h, Z = ye(
    /*teamOptions*/
    t[9]
  ), Ce = [];
  for (let C = 0; C < Z.length; C += 1)
    Ce[C] = $t(xt(t, Z, C));
  let wt = ye(
    /*shiftOptions*/
    t[8]
  ), Re = [];
  for (let C = 0; C < wt.length; C += 1)
    Re[C] = en(Zt(t, wt, C));
  let ze = (
    /*offsetY*/
    t[13] > 0 && tn(t)
  ), ct = ye(
    /*visibleRows*/
    t[14]
  );
  const Gt = (C) => (
    /*row*/
    C[67].id
  );
  for (let C = 0; C < ct.length; C += 1) {
    let j = Ut(t, ct, C), L = Gt(j);
    Oe.set(L, Se[C] = fn(L, j));
  }
  let be = null;
  ct.length || (be = nn());
  let Ie = (
    /*paddingBottom*/
    t[12] > 0 && dn(t)
  );
  return {
    c() {
      e = o("div"), n = o("div"), s = o("label"), r = fe(`Search
          `), l = o("input"), u = z(), g = o("label"), c = fe(`Role
          `), f = o("select"), D = o("option"), D.textContent = "All", R = o("option"), R.textContent = "STSO", S = o("option"), S.textContent = "LTSO", b = o("option"), b.textContent = "TSO (FT/PT)", V = z(), M = o("label"), W = fe(`Team
          `), O = o("select"), N = o("option"), N.textContent = "All", d = o("option"), d.textContent = "Unassigned";
      for (let C = 0; C < Ce.length; C += 1)
        Ce[C].c();
      p = z(), v = o("label"), y = fe(`Shift
          `), w = o("select"), I = o("option"), I.textContent = "All shifts";
      for (let C = 0; C < Re.length; C += 1)
        Re[C].c();
      P = z(), E = o("label"), X = fe(`Duty
          `), k = o("select"), te = o("option"), te.textContent = "All duties", we = o("option"), we.textContent = "BAG", Y = o("option"), Y.textContent = "PAX", ne = o("option"), ne.textContent = "DFO", q = o("option"), q.textContent = "-", Ne = o("option"), Ne.textContent = "TRAINING", Ee = o("option"), Ee.textContent = "OFF / RDO", Fe = z(), x = o("label"), Pe = fe(`On Day
          `), H = o("select"), De = o("option"), De.textContent = "Any day", le = o("option"), le.textContent = "Sun", Le = o("option"), Le.textContent = "Mon", Q = o("option"), Q.textContent = "Tue", ce = o("option"), ce.textContent = "Wed", _e = o("option"), _e.textContent = "Thu", he = o("option"), he.textContent = "Fri", Be = o("option"), Be.textContent = "Sat", st = z(), Ue = o("label"), Ye = fe(`Sex
          `), K = o("select"), ve = o("option"), ve.textContent = "All", ge = o("option"), ge.textContent = "M", pe = o("option"), pe.textContent = "F", ke = z(), ue = o("div"), me = o("table"), je = o("thead"), A = o("tr"), qe = o("th"), qe.textContent = `Team${/*sortIndicator*/
      t[23]("team")}`, Je = z(), $ = o("th"), $.textContent = `Line${/*sortIndicator*/
      t[23]("line")}`, Me = z(), Te = o("th"), Te.textContent = `Shift${/*sortIndicator*/
      t[23]("shift")}`, Ge = z(), Xe = o("th"), Xe.textContent = `Start${/*sortIndicator*/
      t[23]("start")}`, ot = z(), Qe = o("th"), Qe.textContent = "End", _ = z(), F = o("th"), F.textContent = `Position${/*sortIndicator*/
      t[23]("role")}`, ie = z(), Ve = o("th"), Ve.textContent = "Emp", rt = z(), Ze = o("th"), Ze.textContent = "Sex", ht = z(), ut = o("th"), ut.textContent = "Duty", vt = z(), xe = o("th"), xe.textContent = "Cert", ft = z(), tt = o("th"), tt.textContent = "RDOs", dt = z(), nt = o("th"), nt.textContent = "Paid", Ft = z(), We = o("th"), We.textContent = "Sun", ae = z(), gt = o("th"), gt.textContent = "Mon", It = z(), He = o("th"), He.textContent = "Tue", se = z(), pt = o("th"), pt.textContent = "Wed", Et = z(), mt = o("th"), mt.textContent = "Thu", $e = z(), ee = o("th"), ee.textContent = "Fri", Lt = z(), Ke = o("th"), Ke.textContent = "Sat", oe = z(), yt = o("th"), yt.textContent = "Hrs", Bt = z(), Ae = o("tbody"), ze && ze.c(), At = z();
      for (let C = 0; C < Se.length; C += 1)
        Se[C].c();
      be && be.c(), m = z(), Ie && Ie.c(), a(l, "type", "text"), a(l, "class", "filter-input search-input svelte-a7gd0z"), a(l, "placeholder", "Search line code..."), a(s, "class", "svelte-a7gd0z"), D.__value = "ALL", T(D, D.__value), R.__value = "STSO", T(R, R.__value), S.__value = "LTSO", T(S, S.__value), b.__value = "TSO", T(b, b.__value), a(f, "class", "filter-select svelte-a7gd0z"), /*filterRole*/
      t[0] === void 0 && et(() => (
        /*select0_change_handler*/
        t[41].call(f)
      )), a(g, "class", "svelte-a7gd0z"), N.__value = "", T(N, N.__value), d.__value = "__none__", T(d, d.__value), a(O, "class", "filter-select svelte-a7gd0z"), /*filterTeam*/
      t[2] === void 0 && et(() => (
        /*select1_change_handler*/
        t[42].call(O)
      )), a(M, "class", "svelte-a7gd0z"), I.__value = "", T(I, I.__value), a(w, "class", "filter-select svelte-a7gd0z"), /*filterShift*/
      t[1] === void 0 && et(() => (
        /*select2_change_handler*/
        t[43].call(w)
      )), a(v, "class", "svelte-a7gd0z"), te.__value = "", T(te, te.__value), we.__value = "BAG", T(we, we.__value), Y.__value = "PAX", T(Y, Y.__value), ne.__value = "DFO", T(ne, ne.__value), q.__value = "-", T(q, q.__value), Ne.__value = "TRAINING", T(Ne, Ne.__value), Ee.__value = "OFF", T(Ee, Ee.__value), a(k, "class", "filter-select svelte-a7gd0z"), /*filterDuty*/
      t[4] === void 0 && et(() => (
        /*select3_change_handler*/
        t[44].call(k)
      )), a(E, "class", "svelte-a7gd0z"), De.__value = "", T(De, De.__value), le.__value = "0", T(le, le.__value), Le.__value = "1", T(Le, Le.__value), Q.__value = "2", T(Q, Q.__value), ce.__value = "3", T(ce, ce.__value), _e.__value = "4", T(_e, _e.__value), he.__value = "5", T(he, he.__value), Be.__value = "6", T(Be, Be.__value), a(H, "class", "filter-select svelte-a7gd0z"), /*filterDay*/
      t[5] === void 0 && et(() => (
        /*select4_change_handler*/
        t[45].call(H)
      )), a(x, "class", "svelte-a7gd0z"), ve.__value = "", T(ve, ve.__value), ge.__value = "M", T(ge, ge.__value), pe.__value = "F", T(pe, pe.__value), a(K, "class", "filter-select svelte-a7gd0z"), /*filterSex*/
      t[3] === void 0 && et(() => (
        /*select5_change_handler*/
        t[46].call(K)
      )), a(Ue, "class", "svelte-a7gd0z"), a(n, "class", "filter-controls svelte-a7gd0z"), a(e, "class", "lines-table-header-controls svelte-a7gd0z"), a(qe, "class", "sortable col-team svelte-a7gd0z"), a($, "class", "sortable col-line svelte-a7gd0z"), a(Te, "class", "sortable col-shift svelte-a7gd0z"), a(Xe, "class", "sortable col-time svelte-a7gd0z"), a(Qe, "class", "col-time svelte-a7gd0z"), a(F, "class", "sortable col-pos svelte-a7gd0z"), a(Ve, "class", "col-sm svelte-a7gd0z"), a(Ze, "class", "col-sm svelte-a7gd0z"), a(ut, "class", "col-duty svelte-a7gd0z"), a(xe, "class", "col-sm svelte-a7gd0z"), a(tt, "class", "col-rdos svelte-a7gd0z"), a(nt, "class", "col-sm svelte-a7gd0z"), a(We, "class", "col-day svelte-a7gd0z"), a(gt, "class", "col-day svelte-a7gd0z"), a(He, "class", "col-day svelte-a7gd0z"), a(pt, "class", "col-day svelte-a7gd0z"), a(mt, "class", "col-day svelte-a7gd0z"), a(ee, "class", "col-day svelte-a7gd0z"), a(Ke, "class", "col-day svelte-a7gd0z"), a(yt, "class", "col-sm svelte-a7gd0z"), a(A, "class", "svelte-a7gd0z"), a(me, "class", "data-table lines-editable svelte-a7gd0z"), a(ue, "class", "lines-virtual-root svelte-a7gd0z");
    },
    m(C, j) {
      de(C, e, j), i(e, n), i(n, s), i(s, r), i(s, l), T(
        l,
        /*searchCode*/
        t[6]
      ), i(n, u), i(n, g), i(g, c), i(g, f), i(f, D), i(f, R), i(f, S), i(f, b), U(
        f,
        /*filterRole*/
        t[0],
        !0
      ), i(n, V), i(n, M), i(M, W), i(M, O), i(O, N), i(O, d);
      for (let L = 0; L < Ce.length; L += 1)
        Ce[L] && Ce[L].m(O, null);
      U(
        O,
        /*filterTeam*/
        t[2],
        !0
      ), i(n, p), i(n, v), i(v, y), i(v, w), i(w, I);
      for (let L = 0; L < Re.length; L += 1)
        Re[L] && Re[L].m(w, null);
      U(
        w,
        /*filterShift*/
        t[1],
        !0
      ), i(n, P), i(n, E), i(E, X), i(E, k), i(k, te), i(k, we), i(k, Y), i(k, ne), i(k, q), i(k, Ne), i(k, Ee), U(
        k,
        /*filterDuty*/
        t[4],
        !0
      ), i(n, Fe), i(n, x), i(x, Pe), i(x, H), i(H, De), i(H, le), i(H, Le), i(H, Q), i(H, ce), i(H, _e), i(H, he), i(H, Be), U(
        H,
        /*filterDay*/
        t[5],
        !0
      ), i(n, st), i(n, Ue), i(Ue, Ye), i(Ue, K), i(K, ve), i(K, ge), i(K, pe), U(
        K,
        /*filterSex*/
        t[3],
        !0
      ), de(C, ke, j), de(C, ue, j), i(ue, me), i(me, je), i(je, A), i(A, qe), i(A, Je), i(A, $), i(A, Me), i(A, Te), i(A, Ge), i(A, Xe), i(A, ot), i(A, Qe), i(A, _), i(A, F), i(A, ie), i(A, Ve), i(A, rt), i(A, Ze), i(A, ht), i(A, ut), i(A, vt), i(A, xe), i(A, ft), i(A, tt), i(A, dt), i(A, nt), i(A, Ft), i(A, We), i(A, ae), i(A, gt), i(A, It), i(A, He), i(A, se), i(A, pt), i(A, Et), i(A, mt), i(A, $e), i(A, ee), i(A, Lt), i(A, Ke), i(A, oe), i(A, yt), i(me, Bt), i(me, Ae), ze && ze.m(Ae, null), i(Ae, At);
      for (let L = 0; L < Se.length; L += 1)
        Se[L] && Se[L].m(Ae, null);
      be && be.m(Ae, null), i(Ae, m), Ie && Ie.m(Ae, null), t[65](ue), B || (h = [
        G(
          l,
          "input",
          /*input_input_handler*/
          t[40]
        ),
        G(
          l,
          "input",
          /*handleFilterChange*/
          t[22]
        ),
        G(
          f,
          "change",
          /*select0_change_handler*/
          t[41]
        ),
        G(
          f,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        G(
          O,
          "change",
          /*select1_change_handler*/
          t[42]
        ),
        G(
          O,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        G(
          w,
          "change",
          /*select2_change_handler*/
          t[43]
        ),
        G(
          w,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        G(
          k,
          "change",
          /*select3_change_handler*/
          t[44]
        ),
        G(
          k,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        G(
          H,
          "change",
          /*select4_change_handler*/
          t[45]
        ),
        G(
          H,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        G(
          K,
          "change",
          /*select5_change_handler*/
          t[46]
        ),
        G(
          K,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        G(
          qe,
          "click",
          /*click_handler*/
          t[47]
        ),
        G(
          $,
          "click",
          /*click_handler_1*/
          t[48]
        ),
        G(
          Te,
          "click",
          /*click_handler_2*/
          t[49]
        ),
        G(
          Xe,
          "click",
          /*click_handler_3*/
          t[50]
        ),
        G(
          F,
          "click",
          /*click_handler_4*/
          t[51]
        ),
        G(
          ue,
          "scroll",
          /*handleScroll*/
          t[24]
        )
      ], B = !0);
    },
    p(C, j) {
      if (j[0] & /*searchCode*/
      64 && l.value !== /*searchCode*/
      C[6] && T(
        l,
        /*searchCode*/
        C[6]
      ), j[0] & /*filterRole*/
      1 && U(
        f,
        /*filterRole*/
        C[0]
      ), j[0] & /*teamOptions*/
      512) {
        Z = ye(
          /*teamOptions*/
          C[9]
        );
        let L;
        for (L = 0; L < Z.length; L += 1) {
          const St = xt(C, Z, L);
          Ce[L] ? Ce[L].p(St, j) : (Ce[L] = $t(St), Ce[L].c(), Ce[L].m(O, null));
        }
        for (; L < Ce.length; L += 1)
          Ce[L].d(1);
        Ce.length = Z.length;
      }
      if (j[0] & /*filterTeam, teamOptions*/
      516 && U(
        O,
        /*filterTeam*/
        C[2]
      ), j[0] & /*shiftOptions*/
      256) {
        wt = ye(
          /*shiftOptions*/
          C[8]
        );
        let L;
        for (L = 0; L < wt.length; L += 1) {
          const St = Zt(C, wt, L);
          Re[L] ? Re[L].p(St, j) : (Re[L] = en(St), Re[L].c(), Re[L].m(w, null));
        }
        for (; L < Re.length; L += 1)
          Re[L].d(1);
        Re.length = wt.length;
      }
      j[0] & /*filterShift, shiftOptions*/
      258 && U(
        w,
        /*filterShift*/
        C[1]
      ), j[0] & /*filterDuty*/
      16 && U(
        k,
        /*filterDuty*/
        C[4]
      ), j[0] & /*filterDay*/
      32 && U(
        H,
        /*filterDay*/
        C[5]
      ), j[0] & /*filterSex*/
      8 && U(
        K,
        /*filterSex*/
        C[3]
      ), /*offsetY*/
      C[13] > 0 ? ze ? ze.p(C, j) : (ze = tn(C), ze.c(), ze.m(Ae, At)) : ze && (ze.d(1), ze = null), j[0] & /*visibleRows, dayStyle, emitDayTime, emitDayDuty, emitEdit, BASE_EMPS, BASE_POSITIONS, shiftOptions, teamOptions*/
      2081536 && (ct = ye(
        /*visibleRows*/
        C[14]
      ), Se = Ln(Se, j, Gt, 1, C, ct, Oe, Ae, En, fn, m, Ut), !ct.length && be ? be.p(C, j) : ct.length ? be && (be.d(1), be = null) : (be = nn(), be.c(), be.m(Ae, m))), /*paddingBottom*/
      C[12] > 0 ? Ie ? Ie.p(C, j) : (Ie = dn(C), Ie.c(), Ie.m(Ae, null)) : Ie && (Ie.d(1), Ie = null);
    },
    d(C) {
      C && (re(e), re(ke), re(ue)), _t(Ce, C), _t(Re, C), ze && ze.d();
      for (let j = 0; j < Se.length; j += 1)
        Se[j].d();
      be && be.d(), Ie && Ie.d(), t[65](null), B = !1, at(h);
    }
  };
}
function $t(t) {
  let e, n = (
    /*team*/
    (t[82].name ?? /*team*/
    t[82].id) + ""
  ), s, r;
  return {
    c() {
      e = o("option"), s = fe(n), e.__value = r = /*team*/
      t[82].id, T(e, e.__value);
    },
    m(l, u) {
      de(l, e, u), i(e, s);
    },
    p(l, u) {
      u[0] & /*teamOptions*/
      512 && n !== (n = /*team*/
      (l[82].name ?? /*team*/
      l[82].id) + "") && lt(s, n), u[0] & /*teamOptions*/
      512 && r !== (r = /*team*/
      l[82].id) && (e.__value = r, T(e, e.__value));
    },
    d(l) {
      l && re(e);
    }
  };
}
function en(t) {
  let e, n = kt(
    /*shift*/
    t[79]
  ) + "", s, r;
  return {
    c() {
      e = o("option"), s = fe(n), e.__value = r = /*shift*/
      t[79].id, T(e, e.__value);
    },
    m(l, u) {
      de(l, e, u), i(e, s);
    },
    p(l, u) {
      u[0] & /*shiftOptions*/
      256 && n !== (n = kt(
        /*shift*/
        l[79]
      ) + "") && lt(s, n), u[0] & /*shiftOptions*/
      256 && r !== (r = /*shift*/
      l[79].id) && (e.__value = r, T(e, e.__value));
    },
    d(l) {
      l && re(e);
    }
  };
}
function tn(t) {
  let e, n;
  return {
    c() {
      e = o("tr"), n = o("td"), a(n, "colspan", "20"), a(n, "class", "spacer-cell svelte-a7gd0z"), J(
        n,
        "height",
        /*offsetY*/
        t[13] + "px"
      ), a(e, "class", "spacer-row svelte-a7gd0z"), J(
        e,
        "height",
        /*offsetY*/
        t[13] + "px"
      );
    },
    m(s, r) {
      de(s, e, r), i(e, n);
    },
    p(s, r) {
      r[0] & /*offsetY*/
      8192 && J(
        n,
        "height",
        /*offsetY*/
        s[13] + "px"
      ), r[0] & /*offsetY*/
      8192 && J(
        e,
        "height",
        /*offsetY*/
        s[13] + "px"
      );
    },
    d(s) {
      s && re(e);
    }
  };
}
function nn(t) {
  let e;
  return {
    c() {
      e = o("tr"), e.innerHTML = '<td colspan="20" class="muted svelte-a7gd0z" style="padding: 1.5rem; text-align: center;">No matching lines found.</td>', a(e, "class", "svelte-a7gd0z");
    },
    m(n, s) {
      de(n, e, s);
    },
    p: it,
    d(n) {
      n && re(e);
    }
  };
}
function ln(t) {
  let e, n = (
    /*team*/
    (t[82].name ?? /*team*/
    t[82].id) + ""
  ), s, r;
  return {
    c() {
      e = o("option"), s = fe(n), e.__value = r = /*team*/
      t[82].id, T(e, e.__value), a(e, "class", "svelte-a7gd0z");
    },
    m(l, u) {
      de(l, e, u), i(e, s);
    },
    p(l, u) {
      u[0] & /*teamOptions*/
      512 && n !== (n = /*team*/
      (l[82].name ?? /*team*/
      l[82].id) + "") && lt(s, n), u[0] & /*teamOptions*/
      512 && r !== (r = /*team*/
      l[82].id) && (e.__value = r, T(e, e.__value));
    },
    d(l) {
      l && re(e);
    }
  };
}
function an(t) {
  let e, n = kt(
    /*shift*/
    t[79]
  ) + "", s, r;
  return {
    c() {
      e = o("option"), s = fe(n), e.__value = r = /*shift*/
      t[79].id, T(e, e.__value), a(e, "class", "svelte-a7gd0z");
    },
    m(l, u) {
      de(l, e, u), i(e, s);
    },
    p(l, u) {
      u[0] & /*shiftOptions*/
      256 && n !== (n = kt(
        /*shift*/
        l[79]
      ) + "") && lt(s, n), u[0] & /*shiftOptions*/
      256 && r !== (r = /*shift*/
      l[79].id) && (e.__value = r, T(e, e.__value));
    },
    d(l) {
      l && re(e);
    }
  };
}
function sn(t) {
  let e, n = (
    /*pos*/
    t[76] + ""
  ), s, r;
  return {
    c() {
      e = o("option"), s = fe(n), e.__value = r = /*pos*/
      t[76], T(e, e.__value), a(e, "class", "svelte-a7gd0z");
    },
    m(l, u) {
      de(l, e, u), i(e, s);
    },
    p(l, u) {
      u[0] & /*visibleRows*/
      16384 && n !== (n = /*pos*/
      l[76] + "") && lt(s, n), u[0] & /*visibleRows, teamOptions*/
      16896 && r !== (r = /*pos*/
      l[76]) && (e.__value = r, T(e, e.__value));
    },
    d(l) {
      l && re(e);
    }
  };
}
function on(t) {
  let e, n = (
    /*emp*/
    t[73] + ""
  ), s;
  return {
    c() {
      e = o("option"), s = fe(n), e.__value = /*emp*/
      t[73], T(e, e.__value), a(e, "class", "svelte-a7gd0z");
    },
    m(r, l) {
      de(r, e, l), i(e, s);
    },
    p: it,
    d(r) {
      r && re(e);
    }
  };
}
function rn(t) {
  let e, n, s, r, l, u, g, c, f, D;
  function R(...b) {
    return (
      /*change_handler_11*/
      t[63](
        /*row*/
        t[67],
        /*i*/
        t[70],
        ...b
      )
    );
  }
  function S(...b) {
    return (
      /*change_handler_12*/
      t[64](
        /*row*/
        t[67],
        /*i*/
        t[70],
        ...b
      )
    );
  }
  return {
    c() {
      e = o("div"), n = o("input"), r = z(), l = o("span"), l.textContent = "–", u = z(), g = o("input"), a(n, "type", "time"), a(n, "class", "day-time-input svelte-a7gd0z"), n.value = s = /*row*/
      t[67]?.dayStarts?.[
        /*i*/
        t[70]
      ] || /*row*/
      t[67]?.start || "", a(l, "class", "day-time-sep svelte-a7gd0z"), a(g, "type", "time"), a(g, "class", "day-time-input svelte-a7gd0z"), g.value = c = /*row*/
      t[67]?.dayEnds?.[
        /*i*/
        t[70]
      ] || /*row*/
      t[67]?.end || "", a(e, "class", "day-times-wrap svelte-a7gd0z");
    },
    m(b, V) {
      de(b, e, V), i(e, n), i(e, r), i(e, l), i(e, u), i(e, g), f || (D = [
        G(n, "change", R),
        G(g, "change", S)
      ], f = !0);
    },
    p(b, V) {
      t = b, V[0] & /*visibleRows, teamOptions*/
      16896 && s !== (s = /*row*/
      t[67]?.dayStarts?.[
        /*i*/
        t[70]
      ] || /*row*/
      t[67]?.start || "") && n.value !== s && (n.value = s), V[0] & /*visibleRows, teamOptions*/
      16896 && c !== (c = /*row*/
      t[67]?.dayEnds?.[
        /*i*/
        t[70]
      ] || /*row*/
      t[67]?.end || "") && g.value !== c && (g.value = c);
    },
    d(b) {
      b && re(e), f = !1, at(D);
    }
  };
}
function un(t) {
  let e, n, s, r, l, u, g, c, f, D, R, S, b, V, M;
  function W(...N) {
    return (
      /*change_handler_10*/
      t[62](
        /*row*/
        t[67],
        /*i*/
        t[70],
        ...N
      )
    );
  }
  let O = (
    /*row*/
    t[67]?.dayDuties?.[
      /*i*/
      t[70]
    ] !== "OFF" && /*row*/
    t[67]?.days?.[
      /*i*/
      t[70]
    ] !== "RDO" && rn(t)
  );
  return {
    c() {
      e = o("td"), n = o("div"), s = o("select"), r = o("option"), r.textContent = "PAX", l = o("option"), l.textContent = "BAG", u = o("option"), u.textContent = "DFO", g = o("option"), g.textContent = "-", c = o("option"), c.textContent = "Training", f = o("option"), f.textContent = "OFF", R = z(), O && O.c(), r.__value = "PAX", T(r, r.__value), a(r, "class", "svelte-a7gd0z"), l.__value = "BAG", T(l, l.__value), a(l, "class", "svelte-a7gd0z"), u.__value = "DFO", T(u, u.__value), a(u, "class", "svelte-a7gd0z"), g.__value = "-", T(g, g.__value), a(g, "class", "svelte-a7gd0z"), c.__value = "TRAINING", T(c, c.__value), a(c, "class", "svelte-a7gd0z"), f.__value = "OFF", T(f, f.__value), a(f, "class", "svelte-a7gd0z"), a(s, "class", "day-duty-select svelte-a7gd0z"), a(n, "class", "day-cell-inner svelte-a7gd0z"), a(e, "class", S = Wt(hn(
        /*row*/
        t[67]?.dayDuties?.[
          /*i*/
          t[70]
        ] ?? /*row*/
        t[67]?.days?.[
          /*i*/
          t[70]
        ]
      )) + " svelte-a7gd0z"), a(e, "style", b = /*dayStyle*/
      t[17](
        /*row*/
        t[67]?.dayDuties?.[
          /*i*/
          t[70]
        ] ?? /*row*/
        t[67]?.days?.[
          /*i*/
          t[70]
        ]
      ));
    },
    m(N, d) {
      de(N, e, d), i(e, n), i(n, s), i(s, r), i(s, l), i(s, u), i(s, g), i(s, c), i(s, f), U(
        s,
        /*row*/
        t[67]?.dayDuties?.[
          /*i*/
          t[70]
        ] === "OFF" || /*row*/
        t[67]?.days?.[
          /*i*/
          t[70]
        ] === "RDO" ? "OFF" : (
          /*row*/
          t[67]?.dayDuties?.[
            /*i*/
            t[70]
          ] || "PAX"
        )
      ), i(n, R), O && O.m(n, null), V || (M = G(s, "change", W), V = !0);
    },
    p(N, d) {
      t = N, d[0] & /*visibleRows, teamOptions*/
      16896 && D !== (D = /*row*/
      t[67]?.dayDuties?.[
        /*i*/
        t[70]
      ] === "OFF" || /*row*/
      t[67]?.days?.[
        /*i*/
        t[70]
      ] === "RDO" ? "OFF" : (
        /*row*/
        t[67]?.dayDuties?.[
          /*i*/
          t[70]
        ] || "PAX"
      )) && U(
        s,
        /*row*/
        t[67]?.dayDuties?.[
          /*i*/
          t[70]
        ] === "OFF" || /*row*/
        t[67]?.days?.[
          /*i*/
          t[70]
        ] === "RDO" ? "OFF" : (
          /*row*/
          t[67]?.dayDuties?.[
            /*i*/
            t[70]
          ] || "PAX"
        )
      ), /*row*/
      t[67]?.dayDuties?.[
        /*i*/
        t[70]
      ] !== "OFF" && /*row*/
      t[67]?.days?.[
        /*i*/
        t[70]
      ] !== "RDO" ? O ? O.p(t, d) : (O = rn(t), O.c(), O.m(n, null)) : O && (O.d(1), O = null), d[0] & /*visibleRows, teamOptions*/
      16896 && S !== (S = Wt(hn(
        /*row*/
        t[67]?.dayDuties?.[
          /*i*/
          t[70]
        ] ?? /*row*/
        t[67]?.days?.[
          /*i*/
          t[70]
        ]
      )) + " svelte-a7gd0z") && a(e, "class", S), d[0] & /*visibleRows, teamOptions*/
      16896 && b !== (b = /*dayStyle*/
      t[17](
        /*row*/
        t[67]?.dayDuties?.[
          /*i*/
          t[70]
        ] ?? /*row*/
        t[67]?.days?.[
          /*i*/
          t[70]
        ]
      )) && a(e, "style", b);
    },
    d(N) {
      N && re(e), O && O.d(), V = !1, M();
    }
  };
}
function fn(t, e) {
  let n, s, r, l, u, g, c, f, D, R, S, b, V, M, W, O, N, d, p, v, y, w, I, P, E, X, k, te, we, Y, ne, q, Ne, Ee, Fe, x, Pe, H, De, le, Le, Q, ce, _e, he, Be, st, Ue, Ye, K, ve, ge, pe, ke, ue, me, je, A, qe, Je, $, Me, Te, Ge, Xe, ot, Qe, _, F = (
    /*row*/
    (e[67]?.rdos ?? "—") + ""
  ), ie, Ve, rt, Ze = (
    /*row*/
    (e[67]?.paid ?? "") + ""
  ), ht, ut, vt, xe, ft = (
    /*row*/
    (e[67]?.hours ?? "") + ""
  ), tt, dt, nt, Ft, We = ye(
    /*teamOptions*/
    e[9]
  ), ae = [];
  for (let m = 0; m < We.length; m += 1)
    ae[m] = ln(Qt(e, We, m));
  function gt(...m) {
    return (
      /*change_handler*/
      e[52](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  function It(...m) {
    return (
      /*change_handler_1*/
      e[53](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  let He = ye(
    /*shiftOptions*/
    e[8]
  ), se = [];
  for (let m = 0; m < He.length; m += 1)
    se[m] = an(Jt(e, He, m));
  function pt(...m) {
    return (
      /*change_handler_2*/
      e[54](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  function Et(...m) {
    return (
      /*change_handler_3*/
      e[55](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  function mt(...m) {
    return (
      /*change_handler_4*/
      e[56](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  let $e = ye(_n(
    /*BASE_POSITIONS*/
    e[15],
    /*row*/
    e[67]?.position
  )), ee = [];
  for (let m = 0; m < $e.length; m += 1)
    ee[m] = sn(Yt(e, $e, m));
  function Lt(...m) {
    return (
      /*change_handler_5*/
      e[57](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  let Ke = ye(
    /*BASE_EMPS*/
    e[16]
  ), oe = [];
  for (let m = 0; m < Ke.length; m += 1)
    oe[m] = on(qt(e, Ke, m));
  function yt(...m) {
    return (
      /*change_handler_6*/
      e[58](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  function Bt(...m) {
    return (
      /*change_handler_7*/
      e[59](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  function Ae(...m) {
    return (
      /*change_handler_8*/
      e[60](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  function At(...m) {
    return (
      /*change_handler_9*/
      e[61](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  let Se = ye([0, 1, 2, 3, 4, 5, 6]), Oe = [];
  for (let m = 0; m < 7; m += 1)
    Oe[m] = un(jt(e, Se, m));
  return {
    key: t,
    first: null,
    c() {
      n = o("tr"), s = o("td"), r = o("select"), l = o("option"), l.textContent = "—";
      for (let m = 0; m < ae.length; m += 1)
        ae[m].c();
      c = z(), f = o("td"), D = o("input"), b = z(), V = o("td"), M = o("select"), W = o("option"), W.textContent = "—";
      for (let m = 0; m < se.length; m += 1)
        se[m].c();
      d = z(), p = o("td"), v = o("input"), I = z(), P = o("td"), E = o("input"), te = z(), we = o("td"), Y = o("select"), ne = o("option"), ne.textContent = "—";
      for (let m = 0; m < ee.length; m += 1)
        ee[m].c();
      Ee = z(), Fe = o("td"), x = o("select"), Pe = o("option"), Pe.textContent = "—";
      for (let m = 0; m < oe.length; m += 1)
        oe[m].c();
      le = z(), Le = o("td"), Q = o("select"), ce = o("option"), ce.textContent = "—", _e = o("option"), _e.textContent = "M", he = o("option"), he.textContent = "F", Ue = z(), Ye = o("td"), K = o("select"), ve = o("option"), ve.textContent = "—", ge = o("option"), ge.textContent = "-", pe = o("option"), pe.textContent = "DFO", ke = o("option"), ke.textContent = "BAG", ue = o("option"), ue.textContent = "PAX", me = o("option"), me.textContent = "TRAINING", qe = z(), Je = o("td"), $ = o("select"), Me = o("option"), Me.textContent = "—", Te = o("option"), Te.textContent = "A", Ge = o("option"), Ge.textContent = "B", Qe = z(), _ = o("td"), ie = fe(F), Ve = z(), rt = o("td"), ht = fe(Ze), ut = z();
      for (let m = 0; m < 7; m += 1)
        Oe[m].c();
      vt = z(), xe = o("td"), tt = fe(ft), l.__value = "", T(l, l.__value), a(l, "class", "svelte-a7gd0z"), a(r, "class", "line-edit svelte-a7gd0z"), a(r, "data-field", "team"), a(r, "data-line-id", u = /*row*/
      e[67]?.id), a(s, "class", "svelte-a7gd0z"), a(D, "type", "text"), a(D, "class", "line-edit line-code-input svelte-a7gd0z"), a(D, "data-field", "lineCode"), a(D, "data-line-id", R = /*row*/
      e[67]?.id), D.value = S = /*row*/
      e[67]?.line ?? "", a(f, "class", "svelte-a7gd0z"), W.__value = "", T(W, W.__value), a(W, "class", "svelte-a7gd0z"), a(M, "class", "line-edit svelte-a7gd0z"), a(M, "data-field", "shift"), a(M, "data-line-id", O = /*row*/
      e[67]?.id), a(V, "class", "svelte-a7gd0z"), a(v, "type", "time"), a(v, "class", "line-edit line-time-input svelte-a7gd0z"), a(v, "data-field", "start"), a(v, "data-line-id", y = /*row*/
      e[67]?.id), v.value = w = /*row*/
      e[67]?.start ?? "", a(p, "class", "svelte-a7gd0z"), a(E, "type", "time"), a(E, "class", "line-edit line-time-input svelte-a7gd0z"), a(E, "data-field", "end"), a(E, "data-line-id", X = /*row*/
      e[67]?.id), E.value = k = /*row*/
      e[67]?.end ?? "", a(P, "class", "svelte-a7gd0z"), ne.__value = "", T(ne, ne.__value), a(ne, "class", "svelte-a7gd0z"), a(Y, "class", "line-edit svelte-a7gd0z"), a(Y, "data-field", "position"), a(Y, "data-line-id", q = /*row*/
      e[67]?.id), a(we, "class", "svelte-a7gd0z"), Pe.__value = "", T(Pe, Pe.__value), a(Pe, "class", "svelte-a7gd0z"), a(x, "class", "line-edit svelte-a7gd0z"), a(x, "data-field", "emp"), a(x, "data-line-id", H = /*row*/
      e[67]?.id), a(Fe, "class", "svelte-a7gd0z"), ce.__value = "", T(ce, ce.__value), a(ce, "class", "svelte-a7gd0z"), _e.__value = "M", T(_e, _e.__value), a(_e, "class", "svelte-a7gd0z"), he.__value = "F", T(he, he.__value), a(he, "class", "svelte-a7gd0z"), a(Q, "class", "line-edit svelte-a7gd0z"), a(Q, "data-field", "sex"), a(Q, "data-line-id", Be = /*row*/
      e[67]?.id), a(Le, "class", "svelte-a7gd0z"), ve.__value = "", T(ve, ve.__value), a(ve, "class", "svelte-a7gd0z"), ge.__value = "-", T(ge, ge.__value), a(ge, "class", "svelte-a7gd0z"), pe.__value = "DFO", T(pe, pe.__value), a(pe, "class", "svelte-a7gd0z"), ke.__value = "BAG", T(ke, ke.__value), a(ke, "class", "svelte-a7gd0z"), ue.__value = "PAX", T(ue, ue.__value), a(ue, "class", "svelte-a7gd0z"), me.__value = "TRAINING", T(me, me.__value), a(me, "class", "svelte-a7gd0z"), a(K, "class", "line-edit svelte-a7gd0z"), a(K, "data-field", "function"), a(K, "data-line-id", je = /*row*/
      e[67]?.id), a(Ye, "class", "svelte-a7gd0z"), Me.__value = "", T(Me, Me.__value), a(Me, "class", "svelte-a7gd0z"), Te.__value = "A", T(Te, Te.__value), a(Te, "class", "svelte-a7gd0z"), Ge.__value = "B", T(Ge, Ge.__value), a(Ge, "class", "svelte-a7gd0z"), a($, "class", "line-edit svelte-a7gd0z"), a($, "data-field", "certPool"), a($, "data-line-id", Xe = /*row*/
      e[67]?.id), a(Je, "class", "svelte-a7gd0z"), a(_, "class", "line-rdo-cell svelte-a7gd0z"), a(rt, "class", "line-center svelte-a7gd0z"), a(xe, "class", "line-hours svelte-a7gd0z"), a(n, "data-line-row", dt = /*row*/
      e[67]?.id), J(n, "height", Rt + "px"), a(n, "class", "svelte-a7gd0z"), this.first = n;
    },
    m(m, B) {
      de(m, n, B), i(n, s), i(s, r), i(r, l);
      for (let h = 0; h < ae.length; h += 1)
        ae[h] && ae[h].m(r, null);
      U(
        r,
        /*row*/
        e[67]?.teamId ?? ""
      ), i(n, c), i(n, f), i(f, D), i(n, b), i(n, V), i(V, M), i(M, W);
      for (let h = 0; h < se.length; h += 1)
        se[h] && se[h].m(M, null);
      U(
        M,
        /*row*/
        e[67]?.shiftId ?? ""
      ), i(n, d), i(n, p), i(p, v), i(n, I), i(n, P), i(P, E), i(n, te), i(n, we), i(we, Y), i(Y, ne);
      for (let h = 0; h < ee.length; h += 1)
        ee[h] && ee[h].m(Y, null);
      U(
        Y,
        /*row*/
        e[67]?.position ?? ""
      ), i(n, Ee), i(n, Fe), i(Fe, x), i(x, Pe);
      for (let h = 0; h < oe.length; h += 1)
        oe[h] && oe[h].m(x, null);
      U(
        x,
        /*row*/
        e[67]?.emp ?? ""
      ), i(n, le), i(n, Le), i(Le, Q), i(Q, ce), i(Q, _e), i(Q, he), U(
        Q,
        /*row*/
        e[67]?.sex ?? ""
      ), i(n, Ue), i(n, Ye), i(Ye, K), i(K, ve), i(K, ge), i(K, pe), i(K, ke), i(K, ue), i(K, me), U(
        K,
        /*row*/
        e[67]?.function ?? ""
      ), i(n, qe), i(n, Je), i(Je, $), i($, Me), i($, Te), i($, Ge), U(
        $,
        /*row*/
        e[67]?.certPool ?? ""
      ), i(n, Qe), i(n, _), i(_, ie), i(n, Ve), i(n, rt), i(rt, ht), i(n, ut);
      for (let h = 0; h < 7; h += 1)
        Oe[h] && Oe[h].m(n, null);
      i(n, vt), i(n, xe), i(xe, tt), nt || (Ft = [
        G(r, "change", gt),
        G(D, "change", It),
        G(M, "change", pt),
        G(v, "change", Et),
        G(E, "change", mt),
        G(Y, "change", Lt),
        G(x, "change", yt),
        G(Q, "change", Bt),
        G(K, "change", Ae),
        G($, "change", At)
      ], nt = !0);
    },
    p(m, B) {
      if (e = m, B[0] & /*teamOptions*/
      512) {
        We = ye(
          /*teamOptions*/
          e[9]
        );
        let h;
        for (h = 0; h < We.length; h += 1) {
          const Z = Qt(e, We, h);
          ae[h] ? ae[h].p(Z, B) : (ae[h] = ln(Z), ae[h].c(), ae[h].m(r, null));
        }
        for (; h < ae.length; h += 1)
          ae[h].d(1);
        ae.length = We.length;
      }
      if (B[0] & /*visibleRows, teamOptions*/
      16896 && u !== (u = /*row*/
      e[67]?.id) && a(r, "data-line-id", u), B[0] & /*visibleRows, teamOptions*/
      16896 && g !== (g = /*row*/
      e[67]?.teamId ?? "") && U(
        r,
        /*row*/
        e[67]?.teamId ?? ""
      ), B[0] & /*visibleRows, teamOptions*/
      16896 && R !== (R = /*row*/
      e[67]?.id) && a(D, "data-line-id", R), B[0] & /*visibleRows, teamOptions*/
      16896 && S !== (S = /*row*/
      e[67]?.line ?? "") && D.value !== S && (D.value = S), B[0] & /*shiftOptions*/
      256) {
        He = ye(
          /*shiftOptions*/
          e[8]
        );
        let h;
        for (h = 0; h < He.length; h += 1) {
          const Z = Jt(e, He, h);
          se[h] ? se[h].p(Z, B) : (se[h] = an(Z), se[h].c(), se[h].m(M, null));
        }
        for (; h < se.length; h += 1)
          se[h].d(1);
        se.length = He.length;
      }
      if (B[0] & /*visibleRows, teamOptions*/
      16896 && O !== (O = /*row*/
      e[67]?.id) && a(M, "data-line-id", O), B[0] & /*visibleRows, teamOptions*/
      16896 && N !== (N = /*row*/
      e[67]?.shiftId ?? "") && U(
        M,
        /*row*/
        e[67]?.shiftId ?? ""
      ), B[0] & /*visibleRows, teamOptions*/
      16896 && y !== (y = /*row*/
      e[67]?.id) && a(v, "data-line-id", y), B[0] & /*visibleRows, teamOptions*/
      16896 && w !== (w = /*row*/
      e[67]?.start ?? "") && v.value !== w && (v.value = w), B[0] & /*visibleRows, teamOptions*/
      16896 && X !== (X = /*row*/
      e[67]?.id) && a(E, "data-line-id", X), B[0] & /*visibleRows, teamOptions*/
      16896 && k !== (k = /*row*/
      e[67]?.end ?? "") && E.value !== k && (E.value = k), B[0] & /*BASE_POSITIONS, visibleRows*/
      49152) {
        $e = ye(_n(
          /*BASE_POSITIONS*/
          e[15],
          /*row*/
          e[67]?.position
        ));
        let h;
        for (h = 0; h < $e.length; h += 1) {
          const Z = Yt(e, $e, h);
          ee[h] ? ee[h].p(Z, B) : (ee[h] = sn(Z), ee[h].c(), ee[h].m(Y, null));
        }
        for (; h < ee.length; h += 1)
          ee[h].d(1);
        ee.length = $e.length;
      }
      if (B[0] & /*visibleRows, teamOptions*/
      16896 && q !== (q = /*row*/
      e[67]?.id) && a(Y, "data-line-id", q), B[0] & /*visibleRows, teamOptions*/
      16896 && Ne !== (Ne = /*row*/
      e[67]?.position ?? "") && U(
        Y,
        /*row*/
        e[67]?.position ?? ""
      ), B[0] & /*BASE_EMPS*/
      65536) {
        Ke = ye(
          /*BASE_EMPS*/
          e[16]
        );
        let h;
        for (h = 0; h < Ke.length; h += 1) {
          const Z = qt(e, Ke, h);
          oe[h] ? oe[h].p(Z, B) : (oe[h] = on(Z), oe[h].c(), oe[h].m(x, null));
        }
        for (; h < oe.length; h += 1)
          oe[h].d(1);
        oe.length = Ke.length;
      }
      if (B[0] & /*visibleRows, teamOptions*/
      16896 && H !== (H = /*row*/
      e[67]?.id) && a(x, "data-line-id", H), B[0] & /*visibleRows, teamOptions*/
      16896 && De !== (De = /*row*/
      e[67]?.emp ?? "") && U(
        x,
        /*row*/
        e[67]?.emp ?? ""
      ), B[0] & /*visibleRows, teamOptions*/
      16896 && Be !== (Be = /*row*/
      e[67]?.id) && a(Q, "data-line-id", Be), B[0] & /*visibleRows, teamOptions*/
      16896 && st !== (st = /*row*/
      e[67]?.sex ?? "") && U(
        Q,
        /*row*/
        e[67]?.sex ?? ""
      ), B[0] & /*visibleRows, teamOptions*/
      16896 && je !== (je = /*row*/
      e[67]?.id) && a(K, "data-line-id", je), B[0] & /*visibleRows, teamOptions*/
      16896 && A !== (A = /*row*/
      e[67]?.function ?? "") && U(
        K,
        /*row*/
        e[67]?.function ?? ""
      ), B[0] & /*visibleRows, teamOptions*/
      16896 && Xe !== (Xe = /*row*/
      e[67]?.id) && a($, "data-line-id", Xe), B[0] & /*visibleRows, teamOptions*/
      16896 && ot !== (ot = /*row*/
      e[67]?.certPool ?? "") && U(
        $,
        /*row*/
        e[67]?.certPool ?? ""
      ), B[0] & /*visibleRows*/
      16384 && F !== (F = /*row*/
      (e[67]?.rdos ?? "—") + "") && lt(ie, F), B[0] & /*visibleRows*/
      16384 && Ze !== (Ze = /*row*/
      (e[67]?.paid ?? "") + "") && lt(ht, Ze), B[0] & /*visibleRows, dayStyle, emitDayTime, emitDayDuty*/
      1720320) {
        Se = ye([0, 1, 2, 3, 4, 5, 6]);
        let h;
        for (h = 0; h < 7; h += 1) {
          const Z = jt(e, Se, h);
          Oe[h] ? Oe[h].p(Z, B) : (Oe[h] = un(Z), Oe[h].c(), Oe[h].m(n, vt));
        }
        for (; h < 7; h += 1)
          Oe[h].d(1);
      }
      B[0] & /*visibleRows*/
      16384 && ft !== (ft = /*row*/
      (e[67]?.hours ?? "") + "") && lt(tt, ft), B[0] & /*visibleRows, teamOptions*/
      16896 && dt !== (dt = /*row*/
      e[67]?.id) && a(n, "data-line-row", dt);
    },
    d(m) {
      m && re(n), _t(ae, m), _t(se, m), _t(ee, m), _t(oe, m), _t(Oe, m), nt = !1, at(Ft);
    }
  };
}
function dn(t) {
  let e, n;
  return {
    c() {
      e = o("tr"), n = o("td"), a(n, "colspan", "20"), a(n, "class", "spacer-cell svelte-a7gd0z"), J(
        n,
        "height",
        /*paddingBottom*/
        t[12] + "px"
      ), a(e, "class", "spacer-row svelte-a7gd0z"), J(
        e,
        "height",
        /*paddingBottom*/
        t[12] + "px"
      );
    },
    m(s, r) {
      de(s, e, r), i(e, n);
    },
    p(s, r) {
      r[0] & /*paddingBottom*/
      4096 && J(
        n,
        "height",
        /*paddingBottom*/
        s[12] + "px"
      ), r[0] & /*paddingBottom*/
      4096 && J(
        e,
        "height",
        /*paddingBottom*/
        s[12] + "px"
      );
    },
    d(s) {
      s && re(e);
    }
  };
}
function Kn(t) {
  let e;
  function n(l, u) {
    return (
      /*mode*/
      l[7] === "svelte" ? Hn : Wn
    );
  }
  let s = n(t), r = s(t);
  return {
    c() {
      e = o("div"), r.c(), a(e, "class", "lines-table-root svelte-a7gd0z"), J(e, "min-height", "min(70vh, 720px)"), J(e, "height", "min(70vh, 720px)"), J(e, "width", "100%"), J(
        e,
        "--export-rdo",
        /*exportStyle*/
        t[10]?.rdo || "#000000"
      ), J(
        e,
        "--export-bag",
        /*exportStyle*/
        t[10]?.bag || "#F4B4B4"
      ), J(
        e,
        "--export-dfo",
        /*exportStyle*/
        t[10]?.dfo || "#FFF3A8"
      ), J(
        e,
        "--export-pax",
        /*exportStyle*/
        t[10]?.pax || "#A0C4FF"
      ), J(
        e,
        "--export-header",
        /*exportStyle*/
        t[10]?.header || "#1F4E79"
      );
    },
    m(l, u) {
      de(l, e, u), r.m(e, null);
    },
    p(l, u) {
      s === (s = n(l)) && r ? r.p(l, u) : (r.d(1), r = s(l), r && (r.c(), r.m(e, null))), u[0] & /*exportStyle*/
      1024 && J(
        e,
        "--export-rdo",
        /*exportStyle*/
        l[10]?.rdo || "#000000"
      ), u[0] & /*exportStyle*/
      1024 && J(
        e,
        "--export-bag",
        /*exportStyle*/
        l[10]?.bag || "#F4B4B4"
      ), u[0] & /*exportStyle*/
      1024 && J(
        e,
        "--export-dfo",
        /*exportStyle*/
        l[10]?.dfo || "#FFF3A8"
      ), u[0] & /*exportStyle*/
      1024 && J(
        e,
        "--export-pax",
        /*exportStyle*/
        l[10]?.pax || "#A0C4FF"
      ), u[0] & /*exportStyle*/
      1024 && J(
        e,
        "--export-header",
        /*exportStyle*/
        l[10]?.header || "#1F4E79"
      );
    },
    i: it,
    o: it,
    d(l) {
      l && re(e), r.d();
    }
  };
}
const Rt = 42, cn = 8;
function _n(t, e) {
  const n = e == null ? "" : String(e);
  return !n || t.indexOf(n) >= 0 ? t : t.concat([n]);
}
function kt(t) {
  if (!t) return "";
  const e = t.name || t.id || "";
  if (t.segments && Array.isArray(t.segments) && t.segments.length === 2) {
    const n = t.segments[0].start + "–" + t.segments[0].end + " / " + t.segments[1].start + "–" + t.segments[1].end;
    return (e ? e + " " : "") + "(" + n + ")";
  }
  return t.start && t.end ? (e ? e + " " : "") + "(" + t.start + "–" + t.end + ")" : t.start ? e ? e + " " + t.start : t.start : e;
}
function yn(t) {
  const e = String(t || "").toUpperCase();
  return e === "RDO" || e === "—" || e === "OFF" ? "rdo" : e === "-" ? "dash" : e === "BAG" || e === "BAGS" ? "bag" : e === "DFO" ? "dfo" : e === "PAX" ? "pax" : e === "TRAINING" ? "training" : null;
}
function hn(t) {
  const e = yn(t);
  return e === "rdo" ? "cell-day-col cell-rdo" : e === "bag" ? "cell-day-col cell-function-duty cell-bag" : e === "dfo" ? "cell-day-col cell-function-duty cell-dfo" : e === "pax" ? "cell-day-col cell-function-duty cell-pax" : e === "training" ? "cell-day-col cell-function-duty cell-training" : "cell-day-col cell-work";
}
function Un(t, e, n) {
  let s, r, l, u, g, c, f, { rows: D = [] } = e, { mode: R = "svelte" } = e, { shiftOptions: S = [] } = e, { teamOptions: b = [] } = e, { exportStyle: V = Kt() } = e, { onInlineEdit: M = null } = e, { onDayToggle: W = null } = e, { onDayDutyEdit: O = null } = e, { onDayTimeEdit: N = null } = e, { onSort: d = null } = e, { onFilter: p = null } = e, { currentSortBy: v = "role" } = e, { currentSortDir: y = "asc" } = e, { filterRole: w = "ALL" } = e, { filterShift: I = "" } = e, { filterTeam: P = "" } = e, { filterSex: E = "" } = e, { filterDuty: X = "" } = e, { filterDay: k = "" } = e, { searchCode: te = "" } = e;
  const we = ["TSO", "LTSO", "STSO"], Y = ["FT", "PT"];
  function ne(_) {
    const F = yn(_);
    if (!F) return;
    const Ve = (V || Kt())[F];
    if (Ve)
      return "background:" + Ve + ";color:" + Xn(Ve) + ";";
  }
  function q(_, F, ie) {
    M?.({ lineId: _, field: F, value: ie });
  }
  function Ne(_, F, ie) {
    O?.({ lineId: _, dayIndex: F, duty: ie });
  }
  function Ee(_, F, ie, Ve) {
    N?.({ lineId: _, dayIndex: F, field: ie, value: Ve });
  }
  function Fe(_) {
    let F = "asc";
    v === _ && (F = y === "asc" ? "desc" : "asc"), d?.({ sortBy: _, sortDir: F });
  }
  function x() {
    p?.({
      filterRole: w,
      filterShift: I,
      filterTeam: P,
      filterSex: E,
      filterDuty: X,
      filterDay: k,
      searchCode: te
    });
  }
  function Pe(_) {
    return v !== _ ? "" : y === "asc" ? " ▲" : " ▼";
  }
  let H = 0, De = 600, le;
  function Le(_) {
    n(34, H = _.target.scrollTop);
  }
  Fn(() => {
    le && n(35, De = le.clientHeight || 600);
  });
  function Q() {
    te = this.value, n(6, te);
  }
  function ce() {
    w = Dt(this), n(0, w);
  }
  function _e() {
    P = Dt(this), n(2, P), n(9, b);
  }
  function he() {
    I = Dt(this), n(1, I), n(8, S);
  }
  function Be() {
    X = Dt(this), n(4, X);
  }
  function st() {
    k = Dt(this), n(5, k);
  }
  function Ue() {
    E = Dt(this), n(3, E);
  }
  const Ye = () => Fe("team"), K = () => Fe("line"), ve = () => Fe("shift"), ge = () => Fe("start"), pe = () => Fe("role"), ke = (_, F) => q(_?.id, "team", F.target.value), ue = (_, F) => q(_?.id, "lineCode", F.target.value), me = (_, F) => q(_?.id, "shift", F.target.value), je = (_, F) => q(_?.id, "start", F.target.value), A = (_, F) => q(_?.id, "end", F.target.value), qe = (_, F) => q(_?.id, "position", F.target.value), Je = (_, F) => q(_?.id, "emp", F.target.value), $ = (_, F) => q(_?.id, "sex", F.target.value), Me = (_, F) => q(_?.id, "function", F.target.value), Te = (_, F) => q(_?.id, "certPool", F.target.value), Ge = (_, F, ie) => Ne(_?.id, F, ie.target.value), Xe = (_, F, ie) => Ee(_?.id, F, "start", ie.target.value), ot = (_, F, ie) => Ee(_?.id, F, "end", ie.target.value);
  function Qe(_) {
    Pt[_ ? "unshift" : "push"](() => {
      le = _, n(11, le), n(37, r), n(34, H), n(35, De), n(39, s), n(25, D);
    });
  }
  return t.$$set = (_) => {
    "rows" in _ && n(25, D = _.rows), "mode" in _ && n(7, R = _.mode), "shiftOptions" in _ && n(8, S = _.shiftOptions), "teamOptions" in _ && n(9, b = _.teamOptions), "exportStyle" in _ && n(10, V = _.exportStyle), "onInlineEdit" in _ && n(26, M = _.onInlineEdit), "onDayToggle" in _ && n(27, W = _.onDayToggle), "onDayDutyEdit" in _ && n(28, O = _.onDayDutyEdit), "onDayTimeEdit" in _ && n(29, N = _.onDayTimeEdit), "onSort" in _ && n(30, d = _.onSort), "onFilter" in _ && n(31, p = _.onFilter), "currentSortBy" in _ && n(32, v = _.currentSortBy), "currentSortDir" in _ && n(33, y = _.currentSortDir), "filterRole" in _ && n(0, w = _.filterRole), "filterShift" in _ && n(1, I = _.filterShift), "filterTeam" in _ && n(2, P = _.filterTeam), "filterSex" in _ && n(3, E = _.filterSex), "filterDuty" in _ && n(4, X = _.filterDuty), "filterDay" in _ && n(5, k = _.filterDay), "searchCode" in _ && n(6, te = _.searchCode);
  }, t.$$.update = () => {
    t.$$.dirty[0] & /*rows*/
    33554432 && n(39, s = D.length), t.$$.dirty[1] & /*totalRows*/
    256 && n(37, r = s * Rt), t.$$.dirty[0] & /*scrollContainer*/
    2048 | t.$$.dirty[1] & /*totalHeight, scrollTop, viewportHeight*/
    88 && le && r >= 0 && H > r && (n(11, le.scrollTop = Math.max(0, r - De), le), n(34, H = le.scrollTop)), t.$$.dirty[1] & /*scrollTop*/
    8 && n(38, l = Math.max(0, Math.floor(H / Rt) - cn)), t.$$.dirty[1] & /*totalRows, scrollTop, viewportHeight*/
    280 && n(36, u = Math.min(s, Math.ceil((H + De) / Rt) + cn)), t.$$.dirty[0] & /*rows*/
    33554432 | t.$$.dirty[1] & /*startIndex, endIndex*/
    160 && n(14, g = D.slice(l, u)), t.$$.dirty[1] & /*startIndex*/
    128 && n(13, c = l * Rt), t.$$.dirty[1] & /*totalHeight, endIndex*/
    96 && n(12, f = Math.max(0, r - u * Rt));
  }, [
    w,
    I,
    P,
    E,
    X,
    k,
    te,
    R,
    S,
    b,
    V,
    le,
    f,
    c,
    g,
    we,
    Y,
    ne,
    q,
    Ne,
    Ee,
    Fe,
    x,
    Pe,
    Le,
    D,
    M,
    W,
    O,
    N,
    d,
    p,
    v,
    y,
    H,
    De,
    u,
    r,
    l,
    s,
    Q,
    ce,
    _e,
    he,
    Be,
    st,
    Ue,
    Ye,
    K,
    ve,
    ge,
    pe,
    ke,
    ue,
    me,
    je,
    A,
    qe,
    Je,
    $,
    Me,
    Te,
    Ge,
    Xe,
    ot,
    Qe
  ];
}
class jn extends Pn {
  constructor(e) {
    super(), Nn(
      this,
      e,
      Un,
      Kn,
      Tn,
      {
        rows: 25,
        mode: 7,
        shiftOptions: 8,
        teamOptions: 9,
        exportStyle: 10,
        onInlineEdit: 26,
        onDayToggle: 27,
        onDayDutyEdit: 28,
        onDayTimeEdit: 29,
        onSort: 30,
        onFilter: 31,
        currentSortBy: 32,
        currentSortDir: 33,
        filterRole: 0,
        filterShift: 1,
        filterTeam: 2,
        filterSex: 3,
        filterDuty: 4,
        filterDay: 5,
        searchCode: 6
      },
      null,
      [-1, -1, -1]
    );
  }
}
function qn(t) {
  if (t = t || window.Scheduler, !t) return;
  function e(l) {
    var u = String(l || "").trim();
    if (!u) return "";
    var g = u.match(/^(\d+)$/);
    return g && Number(g[1]) < 10 ? "0" + g[1] : u;
  }
  function n(l, u) {
    var g = (l.rdoDays || []).map(Number).filter(function(f) {
      return Number.isInteger(f) && f >= 0 && f <= 6;
    }), c = g.length ? g.map(function(f) {
      return u && u[f] != null ? u[f] : String(f);
    }).join(",") : "—";
    return l.rdoHard && (c += " (hard)"), c;
  }
  function s(l, u, g) {
    return g || "WORK";
  }
  function r(l, u) {
    return u === "TRAINING" ? "TRAINING" : u === "-" || u === "BAG" || u === "PAX" || u === "DFO" ? u : l.isTraining || l.trainingClass || l.empClass === "ESTI" || l.empClass === "MSTI" || l.extraName === "ESTI" || l.extraName === "MSTI" ? "TRAINING" : l.function === "BAG" ? "BAG" : l.function === "DFO" || l.function === "PAX" ? "PAX" : l.function === "-" ? "-" : u === "BAG" || u === "PAX" ? u : null;
  }
  t.lineToRowModel = function(l, u, g) {
    if (g = g || {}, !l || !u) return null;
    for (var c = g.dayNames || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], f = typeof g.teamResolver == "function" ? g.teamResolver(l.id) : null, D = typeof g.shiftResolver == "function" ? g.shiftResolver(l.shiftId) : null, R = l.shiftName || D && D.name || "", S = l.startTime || (D && D.start ? D.start : ""), b = l.endTime || (D && D.end ? D.end : ""), V = D && D.segments && D.segments.length === 2 ? D.segments[0].start + "–" + D.segments[0].end + " / " + D.segments[1].start + "–" + D.segments[1].end : S && b ? S + "–" + b : S || "WORK", M = l.shiftLabel || V, W = !!(l.isExtra || l.extraPositionId), O = W ? l.position || l.extraName || "TSO" : l.isStso || l.empClass === "STSO" ? "STSO" : l.isLtso || l.empClass === "LTSO" ? "LTSO" : "TSO", N = W ? l.empClass === "PT" ? "PT" : "FT" : O === "STSO" || O === "LTSO" ? "FT" : l.empClass === "PT" ? "PT" : "FT", d = l.paid || 0, p = Array.isArray(u) ? u : u[l.id] || u[String(l.id)] || [], v = [], y = [], w = [], I = [], P = 0, E = 0; E < 7; E++) {
      var X = l.dayTimes && l.dayTimes[String(E)], k = typeof g.effectiveTimesResolver == "function" ? g.effectiveTimesResolver(l.shiftId, E) : null, te = X && X.start || l.startTime || k && k.start || S, we = X && X.end || l.endTime || k && k.end || b;
      w.push(te), I.push(we);
      var Y = p[E];
      if (Y === "WORK") {
        P += d;
        var ne = typeof g.rotationDutyResolver == "function" ? g.rotationDutyResolver(l.id, E) : null, q = s(l, ne, M);
        v.push(q), y.push(r(l, ne) || "PAX");
      } else
        v.push("RDO"), y.push("OFF");
    }
    return {
      id: l.id,
      teamId: f && f.id || "",
      shiftId: l.shiftId || "",
      team: e(f && (f.name || f.id) || ""),
      line: l.lineCode || "",
      shift: R,
      start: S,
      end: b,
      position: O,
      emp: N,
      sex: l.sex === "F" || l.sex === "M" ? l.sex : "",
      function: l.function || "",
      certPool: l.certPool || "",
      rdos: n(l, c),
      paid: d,
      days: v,
      dayDuties: y,
      dayStarts: w,
      dayEnds: I,
      hours: P
    };
  }, t.getRowModels = function(l, u, g) {
    return !Array.isArray(l) || !u || typeof u != "object" ? [] : l.map(function(c) {
      return t.lineToRowModel(c, u, g);
    }).filter(Boolean);
  }, t.getLineRowModels = function(l) {
    var u = t.state && Array.isArray(t.state.lines) ? t.state.lines : [], g = t.state && t.state.schedule || {}, c = Object.assign({}, l || {});
    return !c.teamResolver && typeof t.teamMetaForLine == "function" && (c.teamResolver = t.teamMetaForLine), !c.shiftResolver && typeof t.getShift == "function" && (c.shiftResolver = t.getShift), !c.rotationDutyResolver && typeof t.getRotationDuty == "function" && (c.rotationDutyResolver = t.getRotationDuty), !c.effectiveTimesResolver && typeof t.getEffectiveShiftTimes == "function" && (c.effectiveTimesResolver = t.getEffectiveShiftTimes), t.getRowModels(u, g, c);
  };
}
function Yn(t) {
  if (t = t || window.Scheduler, !t) return;
  function e(g, c) {
    var f = t.getRotationDuty ? t.getRotationDuty(g.id, c) : null;
    return f || g.function || null;
  }
  t.dutyFor = e;
  function n(g) {
    if (g.shiftLabel) return g.shiftLabel;
    var c = t.getShift ? t.getShift(g.shiftId) : null;
    return c && c.start && c.end ? c.start + "–" + c.end : c && c.start ? c.start : "WORK";
  }
  function s(g) {
    if (!(!g || g.function !== "BAG")) {
      t.state.functionRotation || (t.state.functionRotation = {});
      var c = String(g.id);
      t.state.functionRotation[c] || (t.state.functionRotation[c] = []);
      for (var f = t.state.schedule && (t.state.schedule[g.id] || t.state.schedule[c]) || [], D = Math.max(f.length, (t.state.weekCount || 1) * 7), R = 0; R < D; R++) {
        for (; t.state.functionRotation[c].length <= R; ) t.state.functionRotation[c].push(null);
        f[R] === "WORK" && (t.state.functionRotation[c][R] = "BAG");
      }
    }
  }
  function r(g) {
    if (!(!g || g.function !== "DFO")) {
      t.state.functionRotation || (t.state.functionRotation = {});
      var c = String(g.id);
      t.state.functionRotation[c] || (t.state.functionRotation[c] = []);
      for (var f = t.state.schedule && (t.state.schedule[g.id] || t.state.schedule[c]) || [], D = Math.max(f.length, (t.state.weekCount || 1) * 7), R = 0; R < D; R++) {
        for (; t.state.functionRotation[c].length <= R; ) t.state.functionRotation[c].push(null);
        f[R] === "WORK" && (t.state.functionRotation[c][R] = "DFO");
      }
    }
  }
  function l() {
    var g = document.getElementById("lines-tbody"), c = g || document.querySelector(".lines-virtual-root");
    c && g && c.querySelectorAll("td.cell-toggle").forEach(function(f) {
      var D = t.findLineById ? t.findLineById(f.getAttribute("data-line-id")) : null, R = +f.getAttribute("data-day");
      if (!(!D || isNaN(R))) {
        var S = (t.state.schedule[D.id] || t.state.schedule[String(D.id)] || [])[R] || "RDO";
        if (f.style.background = "", f.style.color = "", S !== "WORK") {
          f.className = "cell-rdo cell-toggle", f.textContent = "RDO", f.style.background = "#000", f.style.color = "#fff", f.style.opacity = "1";
          return;
        }
        var b = e(D, R), V = b === "BAG" || b === "BAGS", M = b === "DFO", W = "";
        V ? W = " cell-function-duty cell-bag" : M && (W = " cell-function-duty cell-dfo"), f.className = "cell-work cell-toggle" + W, f.textContent = n(D);
      }
    });
  }
  t.paintLineColors = l;
  function u(g) {
    var c = t[g];
    if (!(typeof c != "function" || c._lineColorsWrapped)) {
      var f = function() {
        if (t.__USE_SVELTE_LINES) return c.apply(this, arguments);
        var D = c.apply(this, arguments);
        return setTimeout(l, 0), D;
      };
      f._lineColorsWrapped = !0, t[g] = f;
    }
  }
  u("renderLines"), u("renderAll"), u("generateFunctionAssignments"), t._lineColorsBound || (t._lineColorsBound = !0, document.addEventListener("change", function(g) {
    var c = g.target;
    if (!(!c || c.getAttribute("data-field") !== "function")) {
      var f = t.findLineById ? t.findLineById(c.getAttribute("data-line-id")) : null;
      f && (f.function = c.value === "DFO" || c.value === "PAX" || c.value === "BAG" || c.value === "TRAINING" || c.value === "-" ? c.value : "", f.function === "BAG" && s(f), f.function === "DFO" && r(f), t.renderLines ? t.renderLines() : l());
    }
  }));
}
function Qn(t) {
  const e = t || window.Scheduler;
  if (!e) return;
  qn(e), Yn(e);
  const n = document.getElementById("lines-table-root");
  if (!n) {
    console.warn("lines-table: #lines-table-root not found");
    return;
  }
  if (e.__USE_SVELTE_LINES === !1) {
    n.innerHTML = "", n.style.display = "none", e.renderLines && e.renderLines();
    return;
  }
  if (n._linesTableMounted) return;
  n._linesTableMounted = !0;
  function s() {
    return {
      teamResolver: typeof e.teamMetaForLine == "function" ? e.teamMetaForLine : null,
      shiftResolver: typeof e.getShift == "function" ? e.getShift : null,
      rotationDutyResolver: typeof e.getRotationDuty == "function" ? e.getRotationDuty : r,
      effectiveTimesResolver: typeof e.getEffectiveShiftTimes == "function" ? e.getEffectiveShiftTimes : null
    };
  }
  function r(d, p) {
    const v = String(d), y = e.state && e.state.functionRotation, w = y && (y[v] || y[d]);
    if (!Array.isArray(w)) return null;
    const I = w[p];
    return I === "BAG" ? "BAG" : I === "DFO" ? "DFO" : I === "PAX" ? "PAX" : I === "TRAINING" ? "TRAINING" : I === "-" ? "-" : null;
  }
  function l(d, p, v) {
    var y = String(d);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[y] || (e.state.functionRotation[y] = []); e.state.functionRotation[y].length <= p; ) e.state.functionRotation[y].push(null);
    e.state.functionRotation[y][p] = v;
  }
  function u(d) {
    if (!d) return !1;
    if (d.function === "DFO") return !0;
    const p = d.functionEligible;
    return !!(p && (p.dfo === !0 || p.DFO === !0));
  }
  function g() {
    const d = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], p = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(d)) : d, v = e.state && e.state.schedule || {}, y = typeof e.getRowModels == "function" ? e.getRowModels(p, v, s()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(s()) : [];
    return Array.isArray(y) ? y : [];
  }
  function c() {
    return e.teams && Array.isArray(e.teams.teams) ? e.teams.teams : [];
  }
  function f() {
    return e.state && Array.isArray(e.state.shifts) ? e.state.shifts : [];
  }
  function D() {
    return typeof e.getExportStyle == "function" ? e.getExportStyle() : e.state && e.state.exportStyle || null;
  }
  function R(d) {
    if (!d || typeof d.$set != "function") return;
    const p = g();
    typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), d.$set({
      rows: Array.isArray(p) ? p : [],
      shiftOptions: f(),
      teamOptions: c(),
      exportStyle: D(),
      currentSortBy: e.linesView && e.linesView.sortBy || "role",
      currentSortDir: e.linesView && e.linesView.sortDir || "asc",
      filterRole: e.linesView && e.linesView.filterRole || "ALL",
      filterShift: e.linesView && e.linesView.filterShift || "",
      filterTeam: e.linesView && e.linesView.filterTeam || "",
      filterSex: e.linesView && e.linesView.filterSex || "",
      filterDuty: e.linesView && e.linesView.filterDuty || "",
      filterDay: e.linesView && e.linesView.filterDay || "",
      searchCode: e.linesView && e.linesView.searchCode || ""
    });
  }
  function S(d) {
    if (!d) return;
    const p = e.findLineById ? e.findLineById(d.lineId) : null;
    if (!p) return;
    const v = d.field, y = d.value;
    if (v === "lineCode")
      p.lineCode = String(y || "").trim() || p.lineCode;
    else if (v === "sex")
      p.sex = y === "F" ? "F" : "M";
    else if (v === "function")
      p.function = y === "DFO" || y === "PAX" || y === "BAG" || y === "TRAINING" || y === "-" ? y : "";
    else if (v === "certPool") {
      var w = String(y || "").trim().toUpperCase();
      p.certPool = w === "A" || w === "B" ? w : "";
    } else if (v === "emp")
      e.applyLineEmp && e.applyLineEmp(p, y);
    else if (v === "position") {
      var I = !!(p.isExtra || p.extraPositionId), P = String(y ?? "").trim();
      I ? (P && (p.position = P, p.extraName = P), p.isStso = !1, p.isLtso = !1) : e.applyLineEmp && e.applyLineEmp(p, P);
    } else if (v === "shift")
      e.applyLineShift && e.applyLineShift(p, y);
    else if (v === "team")
      e.setLineTeam && e.setLineTeam(d.lineId, y);
    else if (v === "start" || v === "end") {
      var E = String(y || "").trim();
      if (e.isValidTimeText && !e.isValidTimeText(E)) return;
      v === "start" && (p.startTime = E), v === "end" && (p.endTime = E);
      var X = e.getShift ? e.getShift(p.shiftId) : null, k = p.startTime || (X ? X.start : ""), te = p.endTime || (X ? X.end : "");
      p.shiftLabel = (k || "") + "-" + (te || "");
    }
    e.updateStatus && e.updateStatus("Updated " + (p.lineCode || d.lineId)), N(), (v === "emp" || v === "position" || v === "shift" || v === "start" || v === "end") && e.renderCoverageBars && e.renderCoverageBars(), v === "team" && e.renderTeams && e.renderTeams(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function b(d) {
    if (!d) return;
    const p = e.findLineById ? e.findLineById(d.lineId) : null, v = Number(d.dayIndex);
    if (!p || !Number.isInteger(v) || v < 0 || v > 6) return;
    const y = String(p.id);
    e.state.schedule || (e.state.schedule = {});
    var w = e.state.schedule[y] || e.state.schedule[p.id];
    for (Array.isArray(w) || (w = []), e.state.schedule[y] = w; e.state.schedule[y].length < 7; ) e.state.schedule[y].push("RDO");
    e.state.functionRotation || (e.state.functionRotation = {}), !e.state.functionRotation[y] && e.state.functionRotation[p.id] && (e.state.functionRotation[y] = e.state.functionRotation[p.id]);
    const I = e.state.schedule[y][v] || "RDO", P = p.function === "BAG", E = u(p);
    if (I !== "WORK")
      e.state.schedule[y][v] = "WORK", P ? l(y, v, "BAG") : E ? l(y, v, "PAX") : l(y, v, null);
    else if (P)
      e.state.schedule[y][v] = "RDO", l(y, v, null);
    else if (E) {
      var X = typeof e.getRotationDuty == "function" ? e.getRotationDuty(p.id, v) : r(p.id, v), k = X === "DFO" || X === "PAX" || !X ? "PAX" : X;
      k === "PAX" ? l(y, v, "BAG") : (e.state.schedule[y][v] = "RDO", l(y, v, null));
    } else
      e.state.schedule[y][v] = "RDO", l(y, v, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(p), N(), e.renderCoverageBars && e.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function V(d) {
    if (!d) return;
    const p = e.findLineById ? e.findLineById(d.lineId) : null, v = Number(d.dayIndex), y = String(d.duty || "").toUpperCase();
    if (!p || !Number.isInteger(v) || v < 0 || v > 6) return;
    const w = String(p.id);
    e.state.schedule || (e.state.schedule = {}), Array.isArray(e.state.schedule[w]) || (e.state.schedule[w] = Array(7).fill("RDO")), y === "OFF" || y === "RDO" || y === "" ? (e.state.schedule[w][v] = "RDO", l(w, v, null)) : (e.state.schedule[w][v] = "WORK", y === "BAG" ? l(w, v, "BAG") : y === "DFO" ? l(w, v, "DFO") : y === "TRAINING" ? l(w, v, "TRAINING") : y === "-" ? l(w, v, "-") : l(w, v, "PAX")), e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(p), N(), e.renderCoverageBars && e.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function M(d) {
    if (!d) return;
    const p = e.findLineById ? e.findLineById(d.lineId) : null, v = Number(d.dayIndex), y = d.field, w = String(d.value || "").trim();
    if (!(!p || !Number.isInteger(v) || v < 0 || v > 6) && !(e.isValidTimeText && !e.isValidTimeText(w))) {
      var I = e.getShift ? e.getShift(p.shiftId) : null, P = p.startTime || (I ? I.start : "08:00"), E = p.endTime || (I ? I.end : "16:30");
      p.dayTimes || (p.dayTimes = {});
      var X = String(v), k = p.dayTimes[X] || { start: P, end: E };
      y === "start" ? p.dayTimes[X] = { start: w, end: k.end } : y === "end" && (p.dayTimes[X] = { start: k.start, end: w }), N(), e.renderCoverageBars && e.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
    }
  }
  function W(d) {
    d && (e.linesView || (e.linesView = {}), d.sortBy && (e.linesView.sortBy = d.sortBy), d.sortDir && (e.linesView.sortDir = d.sortDir), N());
  }
  function O(d) {
    d && (e.linesView || (e.linesView = {}), d.filterRole !== void 0 && (e.linesView.filterRole = d.filterRole), d.filterShift !== void 0 && (e.linesView.filterShift = d.filterShift), d.filterTeam !== void 0 && (e.linesView.filterTeam = d.filterTeam), d.filterSex !== void 0 && (e.linesView.filterSex = d.filterSex), d.filterDuty !== void 0 && (e.linesView.filterDuty = d.filterDuty), d.filterDay !== void 0 && (e.linesView.filterDay = d.filterDay), d.searchCode !== void 0 && (e.linesView.searchCode = d.searchCode), N());
  }
  const N = () => {
    try {
      const d = n._linesTableApp;
      if (d)
        R(d);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const p = g();
        typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), n._linesTableApp = new jn({
          target: n,
          props: {
            rows: Array.isArray(p) ? p : [],
            shiftOptions: f(),
            teamOptions: c(),
            exportStyle: D(),
            currentSortBy: e.linesView && e.linesView.sortBy || "role",
            currentSortDir: e.linesView && e.linesView.sortDir || "asc",
            filterRole: e.linesView && e.linesView.filterRole || "ALL",
            filterShift: e.linesView && e.linesView.filterShift || "",
            filterTeam: e.linesView && e.linesView.filterTeam || "",
            filterSex: e.linesView && e.linesView.filterSex || "",
            filterDuty: e.linesView && e.linesView.filterDuty || "",
            filterDay: e.linesView && e.linesView.filterDay || "",
            searchCode: e.linesView && e.linesView.searchCode || "",
            onInlineEdit: S,
            onDayToggle: b,
            onDayDutyEdit: V,
            onDayTimeEdit: M,
            onSort: W,
            onFilter: O
          }
        });
      }
    } catch (d) {
      console.error("lines-table: refresh failed", d);
    }
  };
  N(), e.bindLinesUI && e.bindLinesUI(), document.addEventListener("click", (d) => {
    const p = d.target.closest?.(".tab-btn");
    p && p.dataset.tab === "lines" && N();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((d) => {
    window.addEventListener(d, N);
  }), n.refresh = N;
}
export {
  Qn as initLinesTable
};
