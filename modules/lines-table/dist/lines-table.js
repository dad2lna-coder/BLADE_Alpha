var Tn = Object.defineProperty;
var Cn = (t, e, n) => e in t ? Tn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Nt = (t, e, n) => Cn(t, typeof e != "symbol" ? e + "" : e, n);
function it() {
}
function vn(t) {
  return t();
}
function Wt() {
  return /* @__PURE__ */ Object.create(null);
}
function at(t) {
  t.forEach(vn);
}
function pn(t) {
  return typeof t == "function";
}
function bn(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Fn(t) {
  return Object.keys(t).length === 0;
}
function Ht(t) {
  return t ?? "";
}
function i(t, e) {
  t.appendChild(e);
}
function ce(t, e, n) {
  t.insertBefore(e, n || null);
}
function ue(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function _t(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function o(t) {
  return document.createElement(t);
}
function de(t) {
  return document.createTextNode(t);
}
function I() {
  return de(" ");
}
function P(t, e, n, a) {
  return t.addEventListener(e, n, a), () => t.removeEventListener(e, n, a);
}
function s(t, e, n) {
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
function Z(t, e, n, a) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
function J(t, e, n) {
  for (let a = 0; a < t.options.length; a += 1) {
    const r = t.options[a];
    if (r.__value === e) {
      r.selected = !0;
      return;
    }
  }
  (!n || e !== void 0) && (t.selectedIndex = -1);
}
function wt(t) {
  const e = t.querySelector(":checked");
  return e && e.__value;
}
let zt;
function Ot(t) {
  zt = t;
}
function An() {
  if (!zt) throw new Error("Function called outside component initialization");
  return zt;
}
function Sn(t) {
  An().$$.on_mount.push(t);
}
const Ct = [], Pt = [];
let Ft = [];
const Kt = [], On = /* @__PURE__ */ Promise.resolve();
let Gt = !1;
function zn() {
  Gt || (Gt = !0, On.then(mn));
}
function et(t) {
  Ft.push(t);
}
const Mt = /* @__PURE__ */ new Set();
let Tt = 0;
function mn() {
  if (Tt !== 0)
    return;
  const t = zt;
  do {
    try {
      for (; Tt < Ct.length; ) {
        const e = Ct[Tt];
        Tt++, Ot(e), In(e.$$);
      }
    } catch (e) {
      throw Ct.length = 0, Tt = 0, e;
    }
    for (Ot(null), Ct.length = 0, Tt = 0; Pt.length; ) Pt.pop()();
    for (let e = 0; e < Ft.length; e += 1) {
      const n = Ft[e];
      Mt.has(n) || (Mt.add(n), n());
    }
    Ft.length = 0;
  } while (Ct.length);
  for (; Kt.length; )
    Kt.pop()();
  Gt = !1, Mt.clear(), Ot(t);
}
function In(t) {
  if (t.fragment !== null) {
    t.update(), at(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(et);
  }
}
function En(t) {
  const e = [], n = [];
  Ft.forEach((a) => t.indexOf(a) === -1 ? e.push(a) : n.push(a)), n.forEach((a) => a()), Ft = e;
}
const kn = /* @__PURE__ */ new Set();
function yn(t, e) {
  t && t.i && (kn.delete(t), t.i(e));
}
function De(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function Ln(t, e) {
  t.d(1), e.delete(t.key);
}
function Bn(t, e, n, a, r, l, u, _, h, d, y, F) {
  let O = t.length, R = l.length, V = O;
  const M = {};
  for (; V--; ) M[t[V].key] = V;
  const X = [], z = /* @__PURE__ */ new Map(), W = /* @__PURE__ */ new Map(), N = [];
  for (V = R; V--; ) {
    const f = F(r, l, V), D = n(f);
    let b = u.get(D);
    b ? N.push(() => b.p(f, e)) : (b = d(D, f), b.c()), z.set(D, X[V] = b), D in M && W.set(D, Math.abs(V - M[D]));
  }
  const p = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Set();
  function w(f) {
    yn(f, 1), f.m(_, y), u.set(f.key, f), y = f.first, R--;
  }
  for (; O && R; ) {
    const f = X[R - 1], D = t[O - 1], b = f.key, L = D.key;
    f === D ? (y = f.first, O--, R--) : z.has(L) ? !u.has(b) || p.has(b) ? w(f) : c.has(L) ? O-- : W.get(b) > W.get(L) ? (c.add(b), w(f)) : (p.add(L), O--) : (h(D, u), O--);
  }
  for (; O--; ) {
    const f = t[O];
    z.has(f.key) || h(f, u);
  }
  for (; R; ) w(X[R - 1]);
  return at(N), X;
}
function Vn(t, e, n) {
  const { fragment: a, after_update: r } = t.$$;
  a && a.m(e, n), et(() => {
    const l = t.$$.on_mount.map(vn).filter(pn);
    t.$$.on_destroy ? t.$$.on_destroy.push(...l) : at(l), t.$$.on_mount = [];
  }), r.forEach(et);
}
function Nn(t, e) {
  const n = t.$$;
  n.fragment !== null && (En(n.after_update), at(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function Mn(t, e) {
  t.$$.dirty[0] === -1 && (Ct.push(t), zn(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function Pn(t, e, n, a, r, l, u = null, _ = [-1]) {
  const h = zt;
  Ot(t);
  const d = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: l,
    update: it,
    not_equal: r,
    bound: Wt(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (h ? h.$$.context : [])),
    // everything else
    callbacks: Wt(),
    dirty: _,
    skip_bound: !1,
    root: e.target || h.$$.root
  };
  u && u(d.root);
  let y = !1;
  if (d.ctx = n ? n(t, e.props || {}, (F, O, ...R) => {
    const V = R.length ? R[0] : O;
    return d.ctx && r(d.ctx[F], d.ctx[F] = V) && (!d.skip_bound && d.bound[F] && d.bound[F](V), y && Mn(t, F)), O;
  }) : [], d.update(), y = !0, at(d.before_update), d.fragment = a ? a(d.ctx) : !1, e.target) {
    if (e.hydrate) {
      const F = Rn(e.target);
      d.fragment && d.fragment.l(F), F.forEach(ue);
    } else
      d.fragment && d.fragment.c();
    e.intro && yn(t.$$.fragment), Vn(t, e.target, e.anchor), mn();
  }
  Ot(h);
}
class Gn {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Nt(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Nt(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    Nn(this, 1), this.$destroy = it;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, n) {
    if (!pn(n))
      return it;
    const a = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return a.push(n), () => {
      const r = a.indexOf(n);
      r !== -1 && a.splice(r, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !Fn(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const Xn = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Xn);
function Ut() {
  return {
    rdo: "#000000",
    bag: "#F4B4B4",
    dfo: "#FFF3A8",
    pax: "#A0C4FF",
    training: "#D8B4F8",
    header: "#1F4E79"
  };
}
function Wn(t, e) {
  if (!t) return e;
  var n = String(t).replace("#", "").trim();
  return n.length === 3 && (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]), n.length !== 6 || /[^0-9a-fA-F]/.test(n) ? e : "#" + n.toUpperCase();
}
function Hn(t) {
  var e = Wn(t, "#FFFFFF") || "#FFFFFF", n = e.slice(1), a = parseInt(n.slice(0, 2), 16), r = parseInt(n.slice(2, 4), 16), l = parseInt(n.slice(4, 6), 16), u = (0.299 * a + 0.587 * r + 0.114 * l) / 255;
  return u < 0.45 ? "#FFFFFF" : "#111111";
}
function Jt(t, e, n) {
  const a = t.slice();
  return a[67] = e[n], a;
}
function Yt(t, e, n) {
  const a = t.slice();
  return a[70] = e[n], a;
}
function jt(t, e, n) {
  const a = t.slice();
  return a[73] = e[n], a;
}
function qt(t, e, n) {
  const a = t.slice();
  return a[76] = e[n], a;
}
function Qt(t, e, n) {
  const a = t.slice();
  return a[79] = e[n], a;
}
function Zt(t, e, n) {
  const a = t.slice();
  return a[82] = e[n], a;
}
function xt(t, e, n) {
  const a = t.slice();
  return a[79] = e[n], a;
}
function $t(t, e, n) {
  const a = t.slice();
  return a[82] = e[n], a;
}
function Kn(t) {
  let e;
  return {
    c() {
      e = o("div"), e.textContent = "Classic Lines mode active", s(e, "class", "muted");
    },
    m(n, a) {
      ce(n, e, a);
    },
    p: it,
    d(n) {
      n && ue(e);
    }
  };
}
function Un(t) {
  let e, n, a, r, l, u, _, h, d, y, F, O, R, V, M, X, z, W, N, p, c, w, f, D, b, L, H, E, G, Q, q, ae, j, we, Te, Se, ee, Me, K, Ce, le, Le, x, _e, he, ge, Be, st, Ue, je, U, ve, pe, me, Ve, fe, ye, Je, S, Ye, qe, te, Pe, be, Ge, Xe, ot, Qe, g, A, ie, Ne, rt, Ze, ht, ut, gt, xe, ft, tt, dt, nt, Rt, We, se, vt, Et, He, oe, pt, kt, mt, $e, ne, Lt, Ke, re, yt, Bt, Oe, At, ze = [], Ie = /* @__PURE__ */ new Map(), m, B, v, $ = De(
    /*teamOptions*/
    t[9]
  ), Fe = [];
  for (let C = 0; C < $.length; C += 1)
    Fe[C] = en($t(t, $, C));
  let Dt = De(
    /*shiftOptions*/
    t[8]
  ), Re = [];
  for (let C = 0; C < Dt.length; C += 1)
    Re[C] = tn(xt(t, Dt, C));
  let Ee = (
    /*offsetY*/
    t[13] > 0 && nn(t)
  ), ct = De(
    /*visibleRows*/
    t[14]
  );
  const Xt = (C) => (
    /*row*/
    C[67].id
  );
  for (let C = 0; C < ct.length; C += 1) {
    let Y = Jt(t, ct, C), k = Xt(Y);
    Ie.set(k, ze[C] = dn(k, Y));
  }
  let Ae = null;
  ct.length || (Ae = ln());
  let ke = (
    /*paddingBottom*/
    t[12] > 0 && cn(t)
  );
  return {
    c() {
      e = o("div"), n = o("div"), a = o("label"), r = de(`Search
          `), l = o("input"), u = I(), _ = o("label"), h = de(`Role
          `), d = o("select"), y = o("option"), y.textContent = "All", F = o("option"), F.textContent = "STSO", O = o("option"), O.textContent = "LTSO", R = o("option"), R.textContent = "TSO (FT/PT)", V = I(), M = o("label"), X = de(`Team
          `), z = o("select"), W = o("option"), W.textContent = "All", N = o("option"), N.textContent = "Unassigned";
      for (let C = 0; C < Fe.length; C += 1)
        Fe[C].c();
      p = I(), c = o("label"), w = de(`Shift
          `), f = o("select"), D = o("option"), D.textContent = "All shifts";
      for (let C = 0; C < Re.length; C += 1)
        Re[C].c();
      b = I(), L = o("label"), H = de(`Duty
          `), E = o("select"), G = o("option"), G.textContent = "All duties", Q = o("option"), Q.textContent = "BAG", q = o("option"), q.textContent = "PAX", ae = o("option"), ae.textContent = "DFO", j = o("option"), j.textContent = "-", we = o("option"), we.textContent = "TRAINING", Te = o("option"), Te.textContent = "OFF / RDO", Se = I(), ee = o("label"), Me = de(`On Day
          `), K = o("select"), Ce = o("option"), Ce.textContent = "Any day", le = o("option"), le.textContent = "Sun", Le = o("option"), Le.textContent = "Mon", x = o("option"), x.textContent = "Tue", _e = o("option"), _e.textContent = "Wed", he = o("option"), he.textContent = "Thu", ge = o("option"), ge.textContent = "Fri", Be = o("option"), Be.textContent = "Sat", st = I(), Ue = o("label"), je = de(`Sex
          `), U = o("select"), ve = o("option"), ve.textContent = "All", pe = o("option"), pe.textContent = "M", me = o("option"), me.textContent = "F", Ve = I(), fe = o("div"), ye = o("table"), Je = o("thead"), S = o("tr"), Ye = o("th"), Ye.textContent = `Team${/*sortIndicator*/
      t[23]("team")}`, qe = I(), te = o("th"), te.textContent = `Line${/*sortIndicator*/
      t[23]("line")}`, Pe = I(), be = o("th"), be.textContent = `Shift${/*sortIndicator*/
      t[23]("shift")}`, Ge = I(), Xe = o("th"), Xe.textContent = `Start${/*sortIndicator*/
      t[23]("start")}`, ot = I(), Qe = o("th"), Qe.textContent = "End", g = I(), A = o("th"), A.textContent = `Position${/*sortIndicator*/
      t[23]("role")}`, ie = I(), Ne = o("th"), Ne.textContent = "Emp", rt = I(), Ze = o("th"), Ze.textContent = "Sex", ht = I(), ut = o("th"), ut.textContent = "Duty", gt = I(), xe = o("th"), xe.textContent = "Cert", ft = I(), tt = o("th"), tt.textContent = "RDOs", dt = I(), nt = o("th"), nt.textContent = "Paid", Rt = I(), We = o("th"), We.textContent = "Sun", se = I(), vt = o("th"), vt.textContent = "Mon", Et = I(), He = o("th"), He.textContent = "Tue", oe = I(), pt = o("th"), pt.textContent = "Wed", kt = I(), mt = o("th"), mt.textContent = "Thu", $e = I(), ne = o("th"), ne.textContent = "Fri", Lt = I(), Ke = o("th"), Ke.textContent = "Sat", re = I(), yt = o("th"), yt.textContent = "Hrs", Bt = I(), Oe = o("tbody"), Ee && Ee.c(), At = I();
      for (let C = 0; C < ze.length; C += 1)
        ze[C].c();
      Ae && Ae.c(), m = I(), ke && ke.c(), s(l, "type", "text"), s(l, "class", "filter-input search-input svelte-a7gd0z"), s(l, "placeholder", "Search line code..."), s(a, "class", "svelte-a7gd0z"), y.__value = "ALL", T(y, y.__value), F.__value = "STSO", T(F, F.__value), O.__value = "LTSO", T(O, O.__value), R.__value = "TSO", T(R, R.__value), s(d, "class", "filter-select svelte-a7gd0z"), /*filterRole*/
      t[0] === void 0 && et(() => (
        /*select0_change_handler*/
        t[41].call(d)
      )), s(_, "class", "svelte-a7gd0z"), W.__value = "", T(W, W.__value), N.__value = "__none__", T(N, N.__value), s(z, "class", "filter-select svelte-a7gd0z"), /*filterTeam*/
      t[2] === void 0 && et(() => (
        /*select1_change_handler*/
        t[42].call(z)
      )), s(M, "class", "svelte-a7gd0z"), D.__value = "", T(D, D.__value), s(f, "class", "filter-select svelte-a7gd0z"), /*filterShift*/
      t[1] === void 0 && et(() => (
        /*select2_change_handler*/
        t[43].call(f)
      )), s(c, "class", "svelte-a7gd0z"), G.__value = "", T(G, G.__value), Q.__value = "BAG", T(Q, Q.__value), q.__value = "PAX", T(q, q.__value), ae.__value = "DFO", T(ae, ae.__value), j.__value = "-", T(j, j.__value), we.__value = "TRAINING", T(we, we.__value), Te.__value = "OFF", T(Te, Te.__value), s(E, "class", "filter-select svelte-a7gd0z"), /*filterDuty*/
      t[4] === void 0 && et(() => (
        /*select3_change_handler*/
        t[44].call(E)
      )), s(L, "class", "svelte-a7gd0z"), Ce.__value = "", T(Ce, Ce.__value), le.__value = "0", T(le, le.__value), Le.__value = "1", T(Le, Le.__value), x.__value = "2", T(x, x.__value), _e.__value = "3", T(_e, _e.__value), he.__value = "4", T(he, he.__value), ge.__value = "5", T(ge, ge.__value), Be.__value = "6", T(Be, Be.__value), s(K, "class", "filter-select svelte-a7gd0z"), /*filterDay*/
      t[5] === void 0 && et(() => (
        /*select4_change_handler*/
        t[45].call(K)
      )), s(ee, "class", "svelte-a7gd0z"), ve.__value = "", T(ve, ve.__value), pe.__value = "M", T(pe, pe.__value), me.__value = "F", T(me, me.__value), s(U, "class", "filter-select svelte-a7gd0z"), /*filterSex*/
      t[3] === void 0 && et(() => (
        /*select5_change_handler*/
        t[46].call(U)
      )), s(Ue, "class", "svelte-a7gd0z"), s(n, "class", "filter-controls svelte-a7gd0z"), s(e, "class", "lines-table-header-controls svelte-a7gd0z"), s(Ye, "class", "sortable col-team svelte-a7gd0z"), s(te, "class", "sortable col-line svelte-a7gd0z"), s(be, "class", "sortable col-shift svelte-a7gd0z"), s(Xe, "class", "sortable col-time svelte-a7gd0z"), s(Qe, "class", "col-time svelte-a7gd0z"), s(A, "class", "sortable col-pos svelte-a7gd0z"), s(Ne, "class", "col-sm svelte-a7gd0z"), s(Ze, "class", "col-sm svelte-a7gd0z"), s(ut, "class", "col-duty svelte-a7gd0z"), s(xe, "class", "col-sm svelte-a7gd0z"), s(tt, "class", "col-rdos svelte-a7gd0z"), s(nt, "class", "col-sm svelte-a7gd0z"), s(We, "class", "col-day svelte-a7gd0z"), s(vt, "class", "col-day svelte-a7gd0z"), s(He, "class", "col-day svelte-a7gd0z"), s(pt, "class", "col-day svelte-a7gd0z"), s(mt, "class", "col-day svelte-a7gd0z"), s(ne, "class", "col-day svelte-a7gd0z"), s(Ke, "class", "col-day svelte-a7gd0z"), s(yt, "class", "col-sm svelte-a7gd0z"), s(S, "class", "svelte-a7gd0z"), s(ye, "class", "data-table lines-editable svelte-a7gd0z"), s(fe, "class", "lines-virtual-root svelte-a7gd0z");
    },
    m(C, Y) {
      ce(C, e, Y), i(e, n), i(n, a), i(a, r), i(a, l), T(
        l,
        /*searchCode*/
        t[6]
      ), i(n, u), i(n, _), i(_, h), i(_, d), i(d, y), i(d, F), i(d, O), i(d, R), J(
        d,
        /*filterRole*/
        t[0],
        !0
      ), i(n, V), i(n, M), i(M, X), i(M, z), i(z, W), i(z, N);
      for (let k = 0; k < Fe.length; k += 1)
        Fe[k] && Fe[k].m(z, null);
      J(
        z,
        /*filterTeam*/
        t[2],
        !0
      ), i(n, p), i(n, c), i(c, w), i(c, f), i(f, D);
      for (let k = 0; k < Re.length; k += 1)
        Re[k] && Re[k].m(f, null);
      J(
        f,
        /*filterShift*/
        t[1],
        !0
      ), i(n, b), i(n, L), i(L, H), i(L, E), i(E, G), i(E, Q), i(E, q), i(E, ae), i(E, j), i(E, we), i(E, Te), J(
        E,
        /*filterDuty*/
        t[4],
        !0
      ), i(n, Se), i(n, ee), i(ee, Me), i(ee, K), i(K, Ce), i(K, le), i(K, Le), i(K, x), i(K, _e), i(K, he), i(K, ge), i(K, Be), J(
        K,
        /*filterDay*/
        t[5],
        !0
      ), i(n, st), i(n, Ue), i(Ue, je), i(Ue, U), i(U, ve), i(U, pe), i(U, me), J(
        U,
        /*filterSex*/
        t[3],
        !0
      ), ce(C, Ve, Y), ce(C, fe, Y), i(fe, ye), i(ye, Je), i(Je, S), i(S, Ye), i(S, qe), i(S, te), i(S, Pe), i(S, be), i(S, Ge), i(S, Xe), i(S, ot), i(S, Qe), i(S, g), i(S, A), i(S, ie), i(S, Ne), i(S, rt), i(S, Ze), i(S, ht), i(S, ut), i(S, gt), i(S, xe), i(S, ft), i(S, tt), i(S, dt), i(S, nt), i(S, Rt), i(S, We), i(S, se), i(S, vt), i(S, Et), i(S, He), i(S, oe), i(S, pt), i(S, kt), i(S, mt), i(S, $e), i(S, ne), i(S, Lt), i(S, Ke), i(S, re), i(S, yt), i(ye, Bt), i(ye, Oe), Ee && Ee.m(Oe, null), i(Oe, At);
      for (let k = 0; k < ze.length; k += 1)
        ze[k] && ze[k].m(Oe, null);
      Ae && Ae.m(Oe, null), i(Oe, m), ke && ke.m(Oe, null), t[65](fe), B || (v = [
        P(
          l,
          "input",
          /*input_input_handler*/
          t[40]
        ),
        P(
          l,
          "input",
          /*handleFilterChange*/
          t[22]
        ),
        P(
          d,
          "change",
          /*select0_change_handler*/
          t[41]
        ),
        P(
          d,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        P(
          z,
          "change",
          /*select1_change_handler*/
          t[42]
        ),
        P(
          z,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        P(
          f,
          "change",
          /*select2_change_handler*/
          t[43]
        ),
        P(
          f,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        P(
          E,
          "change",
          /*select3_change_handler*/
          t[44]
        ),
        P(
          E,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        P(
          K,
          "change",
          /*select4_change_handler*/
          t[45]
        ),
        P(
          K,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        P(
          U,
          "change",
          /*select5_change_handler*/
          t[46]
        ),
        P(
          U,
          "change",
          /*handleFilterChange*/
          t[22]
        ),
        P(
          Ye,
          "click",
          /*click_handler*/
          t[47]
        ),
        P(
          te,
          "click",
          /*click_handler_1*/
          t[48]
        ),
        P(
          be,
          "click",
          /*click_handler_2*/
          t[49]
        ),
        P(
          Xe,
          "click",
          /*click_handler_3*/
          t[50]
        ),
        P(
          A,
          "click",
          /*click_handler_4*/
          t[51]
        ),
        P(
          fe,
          "scroll",
          /*handleScroll*/
          t[24]
        )
      ], B = !0);
    },
    p(C, Y) {
      if (Y[0] & /*searchCode*/
      64 && l.value !== /*searchCode*/
      C[6] && T(
        l,
        /*searchCode*/
        C[6]
      ), Y[0] & /*filterRole*/
      1 && J(
        d,
        /*filterRole*/
        C[0]
      ), Y[0] & /*teamOptions*/
      512) {
        $ = De(
          /*teamOptions*/
          C[9]
        );
        let k;
        for (k = 0; k < $.length; k += 1) {
          const St = $t(C, $, k);
          Fe[k] ? Fe[k].p(St, Y) : (Fe[k] = en(St), Fe[k].c(), Fe[k].m(z, null));
        }
        for (; k < Fe.length; k += 1)
          Fe[k].d(1);
        Fe.length = $.length;
      }
      if (Y[0] & /*filterTeam, teamOptions*/
      516 && J(
        z,
        /*filterTeam*/
        C[2]
      ), Y[0] & /*shiftOptions*/
      256) {
        Dt = De(
          /*shiftOptions*/
          C[8]
        );
        let k;
        for (k = 0; k < Dt.length; k += 1) {
          const St = xt(C, Dt, k);
          Re[k] ? Re[k].p(St, Y) : (Re[k] = tn(St), Re[k].c(), Re[k].m(f, null));
        }
        for (; k < Re.length; k += 1)
          Re[k].d(1);
        Re.length = Dt.length;
      }
      Y[0] & /*filterShift, shiftOptions*/
      258 && J(
        f,
        /*filterShift*/
        C[1]
      ), Y[0] & /*filterDuty*/
      16 && J(
        E,
        /*filterDuty*/
        C[4]
      ), Y[0] & /*filterDay*/
      32 && J(
        K,
        /*filterDay*/
        C[5]
      ), Y[0] & /*filterSex*/
      8 && J(
        U,
        /*filterSex*/
        C[3]
      ), /*offsetY*/
      C[13] > 0 ? Ee ? Ee.p(C, Y) : (Ee = nn(C), Ee.c(), Ee.m(Oe, At)) : Ee && (Ee.d(1), Ee = null), Y[0] & /*visibleRows, dayStyle, emitDayTime, emitDayDuty, emitEdit, BASE_EMPS, BASE_POSITIONS, shiftOptions, teamOptions*/
      2081536 && (ct = De(
        /*visibleRows*/
        C[14]
      ), ze = Bn(ze, Y, Xt, 1, C, ct, Ie, Oe, Ln, dn, m, Jt), !ct.length && Ae ? Ae.p(C, Y) : ct.length ? Ae && (Ae.d(1), Ae = null) : (Ae = ln(), Ae.c(), Ae.m(Oe, m))), /*paddingBottom*/
      C[12] > 0 ? ke ? ke.p(C, Y) : (ke = cn(C), ke.c(), ke.m(Oe, null)) : ke && (ke.d(1), ke = null);
    },
    d(C) {
      C && (ue(e), ue(Ve), ue(fe)), _t(Fe, C), _t(Re, C), Ee && Ee.d();
      for (let Y = 0; Y < ze.length; Y += 1)
        ze[Y].d();
      Ae && Ae.d(), ke && ke.d(), t[65](null), B = !1, at(v);
    }
  };
}
function en(t) {
  let e, n = (
    /*team*/
    (t[82].name ?? /*team*/
    t[82].id) + ""
  ), a, r;
  return {
    c() {
      e = o("option"), a = de(n), e.__value = r = /*team*/
      t[82].id, T(e, e.__value);
    },
    m(l, u) {
      ce(l, e, u), i(e, a);
    },
    p(l, u) {
      u[0] & /*teamOptions*/
      512 && n !== (n = /*team*/
      (l[82].name ?? /*team*/
      l[82].id) + "") && lt(a, n), u[0] & /*teamOptions*/
      512 && r !== (r = /*team*/
      l[82].id) && (e.__value = r, T(e, e.__value));
    },
    d(l) {
      l && ue(e);
    }
  };
}
function tn(t) {
  let e, n = Vt(
    /*shift*/
    t[79]
  ) + "", a, r;
  return {
    c() {
      e = o("option"), a = de(n), e.__value = r = /*shift*/
      t[79].id, T(e, e.__value);
    },
    m(l, u) {
      ce(l, e, u), i(e, a);
    },
    p(l, u) {
      u[0] & /*shiftOptions*/
      256 && n !== (n = Vt(
        /*shift*/
        l[79]
      ) + "") && lt(a, n), u[0] & /*shiftOptions*/
      256 && r !== (r = /*shift*/
      l[79].id) && (e.__value = r, T(e, e.__value));
    },
    d(l) {
      l && ue(e);
    }
  };
}
function nn(t) {
  let e, n;
  return {
    c() {
      e = o("tr"), n = o("td"), s(n, "colspan", "20"), s(n, "class", "spacer-cell svelte-a7gd0z"), Z(
        n,
        "height",
        /*offsetY*/
        t[13] + "px"
      ), s(e, "class", "spacer-row svelte-a7gd0z"), Z(
        e,
        "height",
        /*offsetY*/
        t[13] + "px"
      );
    },
    m(a, r) {
      ce(a, e, r), i(e, n);
    },
    p(a, r) {
      r[0] & /*offsetY*/
      8192 && Z(
        n,
        "height",
        /*offsetY*/
        a[13] + "px"
      ), r[0] & /*offsetY*/
      8192 && Z(
        e,
        "height",
        /*offsetY*/
        a[13] + "px"
      );
    },
    d(a) {
      a && ue(e);
    }
  };
}
function ln(t) {
  let e;
  return {
    c() {
      e = o("tr"), e.innerHTML = '<td colspan="20" class="muted svelte-a7gd0z" style="padding: 1.5rem; text-align: center;">No matching lines found.</td>', s(e, "class", "svelte-a7gd0z");
    },
    m(n, a) {
      ce(n, e, a);
    },
    p: it,
    d(n) {
      n && ue(e);
    }
  };
}
function an(t) {
  let e, n = (
    /*team*/
    (t[82].name ?? /*team*/
    t[82].id) + ""
  ), a, r;
  return {
    c() {
      e = o("option"), a = de(n), e.__value = r = /*team*/
      t[82].id, T(e, e.__value), s(e, "class", "svelte-a7gd0z");
    },
    m(l, u) {
      ce(l, e, u), i(e, a);
    },
    p(l, u) {
      u[0] & /*teamOptions*/
      512 && n !== (n = /*team*/
      (l[82].name ?? /*team*/
      l[82].id) + "") && lt(a, n), u[0] & /*teamOptions*/
      512 && r !== (r = /*team*/
      l[82].id) && (e.__value = r, T(e, e.__value));
    },
    d(l) {
      l && ue(e);
    }
  };
}
function sn(t) {
  let e, n = Vt(
    /*shift*/
    t[79]
  ) + "", a, r;
  return {
    c() {
      e = o("option"), a = de(n), e.__value = r = /*shift*/
      t[79].id, T(e, e.__value), s(e, "class", "svelte-a7gd0z");
    },
    m(l, u) {
      ce(l, e, u), i(e, a);
    },
    p(l, u) {
      u[0] & /*shiftOptions*/
      256 && n !== (n = Vt(
        /*shift*/
        l[79]
      ) + "") && lt(a, n), u[0] & /*shiftOptions*/
      256 && r !== (r = /*shift*/
      l[79].id) && (e.__value = r, T(e, e.__value));
    },
    d(l) {
      l && ue(e);
    }
  };
}
function on(t) {
  let e, n = (
    /*pos*/
    t[76] + ""
  ), a, r;
  return {
    c() {
      e = o("option"), a = de(n), e.__value = r = /*pos*/
      t[76], T(e, e.__value), s(e, "class", "svelte-a7gd0z");
    },
    m(l, u) {
      ce(l, e, u), i(e, a);
    },
    p(l, u) {
      u[0] & /*visibleRows*/
      16384 && n !== (n = /*pos*/
      l[76] + "") && lt(a, n), u[0] & /*visibleRows, teamOptions*/
      16896 && r !== (r = /*pos*/
      l[76]) && (e.__value = r, T(e, e.__value));
    },
    d(l) {
      l && ue(e);
    }
  };
}
function rn(t) {
  let e, n = (
    /*emp*/
    t[73] + ""
  ), a;
  return {
    c() {
      e = o("option"), a = de(n), e.__value = /*emp*/
      t[73], T(e, e.__value), s(e, "class", "svelte-a7gd0z");
    },
    m(r, l) {
      ce(r, e, l), i(e, a);
    },
    p: it,
    d(r) {
      r && ue(e);
    }
  };
}
function un(t) {
  let e, n, a, r, l, u, _, h, d, y;
  function F(...R) {
    return (
      /*change_handler_11*/
      t[63](
        /*row*/
        t[67],
        /*i*/
        t[70],
        ...R
      )
    );
  }
  function O(...R) {
    return (
      /*change_handler_12*/
      t[64](
        /*row*/
        t[67],
        /*i*/
        t[70],
        ...R
      )
    );
  }
  return {
    c() {
      e = o("div"), n = o("input"), r = I(), l = o("span"), l.textContent = "–", u = I(), _ = o("input"), s(n, "type", "time"), s(n, "class", "day-time-input svelte-a7gd0z"), n.value = a = /*row*/
      t[67]?.dayStarts?.[
        /*i*/
        t[70]
      ] || /*row*/
      t[67]?.start || "", s(l, "class", "day-time-sep svelte-a7gd0z"), s(_, "type", "time"), s(_, "class", "day-time-input svelte-a7gd0z"), _.value = h = /*row*/
      t[67]?.dayEnds?.[
        /*i*/
        t[70]
      ] || /*row*/
      t[67]?.end || "", s(e, "class", "day-times-wrap svelte-a7gd0z");
    },
    m(R, V) {
      ce(R, e, V), i(e, n), i(e, r), i(e, l), i(e, u), i(e, _), d || (y = [
        P(n, "change", F),
        P(_, "change", O)
      ], d = !0);
    },
    p(R, V) {
      t = R, V[0] & /*visibleRows, teamOptions*/
      16896 && a !== (a = /*row*/
      t[67]?.dayStarts?.[
        /*i*/
        t[70]
      ] || /*row*/
      t[67]?.start || "") && n.value !== a && (n.value = a), V[0] & /*visibleRows, teamOptions*/
      16896 && h !== (h = /*row*/
      t[67]?.dayEnds?.[
        /*i*/
        t[70]
      ] || /*row*/
      t[67]?.end || "") && _.value !== h && (_.value = h);
    },
    d(R) {
      R && ue(e), d = !1, at(y);
    }
  };
}
function fn(t) {
  let e, n, a, r, l, u, _, h, d, y, F, O, R, V, M;
  function X(...W) {
    return (
      /*change_handler_10*/
      t[62](
        /*row*/
        t[67],
        /*i*/
        t[70],
        ...W
      )
    );
  }
  let z = (
    /*row*/
    t[67]?.dayDuties?.[
      /*i*/
      t[70]
    ] !== "OFF" && /*row*/
    t[67]?.days?.[
      /*i*/
      t[70]
    ] !== "RDO" && un(t)
  );
  return {
    c() {
      e = o("td"), n = o("div"), a = o("select"), r = o("option"), r.textContent = "PAX", l = o("option"), l.textContent = "BAG", u = o("option"), u.textContent = "DFO", _ = o("option"), _.textContent = "-", h = o("option"), h.textContent = "Training", d = o("option"), d.textContent = "OFF", F = I(), z && z.c(), r.__value = "PAX", T(r, r.__value), s(r, "class", "svelte-a7gd0z"), l.__value = "BAG", T(l, l.__value), s(l, "class", "svelte-a7gd0z"), u.__value = "DFO", T(u, u.__value), s(u, "class", "svelte-a7gd0z"), _.__value = "-", T(_, _.__value), s(_, "class", "svelte-a7gd0z"), h.__value = "TRAINING", T(h, h.__value), s(h, "class", "svelte-a7gd0z"), d.__value = "OFF", T(d, d.__value), s(d, "class", "svelte-a7gd0z"), s(a, "class", "day-duty-select svelte-a7gd0z"), s(n, "class", "day-cell-inner svelte-a7gd0z"), s(e, "class", O = Ht(gn(
        /*row*/
        t[67]?.dayDuties?.[
          /*i*/
          t[70]
        ] ?? /*row*/
        t[67]?.days?.[
          /*i*/
          t[70]
        ]
      )) + " svelte-a7gd0z"), s(e, "style", R = /*dayStyle*/
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
    m(W, N) {
      ce(W, e, N), i(e, n), i(n, a), i(a, r), i(a, l), i(a, u), i(a, _), i(a, h), i(a, d), J(
        a,
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
      ), i(n, F), z && z.m(n, null), V || (M = P(a, "change", X), V = !0);
    },
    p(W, N) {
      t = W, N[0] & /*visibleRows, teamOptions*/
      16896 && y !== (y = /*row*/
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
      )) && J(
        a,
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
      ] !== "RDO" ? z ? z.p(t, N) : (z = un(t), z.c(), z.m(n, null)) : z && (z.d(1), z = null), N[0] & /*visibleRows, teamOptions*/
      16896 && O !== (O = Ht(gn(
        /*row*/
        t[67]?.dayDuties?.[
          /*i*/
          t[70]
        ] ?? /*row*/
        t[67]?.days?.[
          /*i*/
          t[70]
        ]
      )) + " svelte-a7gd0z") && s(e, "class", O), N[0] & /*visibleRows, teamOptions*/
      16896 && R !== (R = /*dayStyle*/
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
      )) && s(e, "style", R);
    },
    d(W) {
      W && ue(e), z && z.d(), V = !1, M();
    }
  };
}
function dn(t, e) {
  let n, a, r, l, u, _, h, d, y, F, O, R, V, M, X, z, W, N, p, c, w, f, D, b, L, H, E, G, Q, q, ae, j, we, Te, Se, ee, Me, K, Ce, le, Le, x, _e, he, ge, Be, st, Ue, je, U, ve, pe, me, Ve, fe, ye, Je, S, Ye, qe, te, Pe, be, Ge, Xe, ot, Qe, g, A = (
    /*row*/
    (e[67]?.rdos ?? "—") + ""
  ), ie, Ne, rt, Ze = (
    /*row*/
    (e[67]?.paid ?? "") + ""
  ), ht, ut, gt, xe, ft = (
    /*row*/
    (e[67]?.hours ?? "") + ""
  ), tt, dt, nt, Rt, We = De(
    /*teamOptions*/
    e[9]
  ), se = [];
  for (let m = 0; m < We.length; m += 1)
    se[m] = an(Zt(e, We, m));
  function vt(...m) {
    return (
      /*change_handler*/
      e[52](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  function Et(...m) {
    return (
      /*change_handler_1*/
      e[53](
        /*row*/
        e[67],
        ...m
      )
    );
  }
  let He = De(
    /*shiftOptions*/
    e[8]
  ), oe = [];
  for (let m = 0; m < He.length; m += 1)
    oe[m] = sn(Qt(e, He, m));
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
  function kt(...m) {
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
  let $e = De(hn(
    /*BASE_POSITIONS*/
    e[15],
    /*row*/
    e[67]?.position
  )), ne = [];
  for (let m = 0; m < $e.length; m += 1)
    ne[m] = on(qt(e, $e, m));
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
  let Ke = De(
    /*BASE_EMPS*/
    e[16]
  ), re = [];
  for (let m = 0; m < Ke.length; m += 1)
    re[m] = rn(jt(e, Ke, m));
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
  function Oe(...m) {
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
  let ze = De([0, 1, 2, 3, 4, 5, 6]), Ie = [];
  for (let m = 0; m < 7; m += 1)
    Ie[m] = fn(Yt(e, ze, m));
  return {
    key: t,
    first: null,
    c() {
      n = o("tr"), a = o("td"), r = o("select"), l = o("option"), l.textContent = "—";
      for (let m = 0; m < se.length; m += 1)
        se[m].c();
      h = I(), d = o("td"), y = o("input"), R = I(), V = o("td"), M = o("select"), X = o("option"), X.textContent = "—";
      for (let m = 0; m < oe.length; m += 1)
        oe[m].c();
      N = I(), p = o("td"), c = o("input"), D = I(), b = o("td"), L = o("input"), G = I(), Q = o("td"), q = o("select"), ae = o("option"), ae.textContent = "—";
      for (let m = 0; m < ne.length; m += 1)
        ne[m].c();
      Te = I(), Se = o("td"), ee = o("select"), Me = o("option"), Me.textContent = "—";
      for (let m = 0; m < re.length; m += 1)
        re[m].c();
      le = I(), Le = o("td"), x = o("select"), _e = o("option"), _e.textContent = "—", he = o("option"), he.textContent = "M", ge = o("option"), ge.textContent = "F", Ue = I(), je = o("td"), U = o("select"), ve = o("option"), ve.textContent = "—", pe = o("option"), pe.textContent = "-", me = o("option"), me.textContent = "DFO", Ve = o("option"), Ve.textContent = "BAG", fe = o("option"), fe.textContent = "PAX", ye = o("option"), ye.textContent = "TRAINING", Ye = I(), qe = o("td"), te = o("select"), Pe = o("option"), Pe.textContent = "—", be = o("option"), be.textContent = "A", Ge = o("option"), Ge.textContent = "B", Qe = I(), g = o("td"), ie = de(A), Ne = I(), rt = o("td"), ht = de(Ze), ut = I();
      for (let m = 0; m < 7; m += 1)
        Ie[m].c();
      gt = I(), xe = o("td"), tt = de(ft), l.__value = "", T(l, l.__value), s(l, "class", "svelte-a7gd0z"), s(r, "class", "line-edit svelte-a7gd0z"), s(r, "data-field", "team"), s(r, "data-line-id", u = /*row*/
      e[67]?.id), s(a, "class", "svelte-a7gd0z"), s(y, "type", "text"), s(y, "class", "line-edit line-code-input svelte-a7gd0z"), s(y, "data-field", "lineCode"), s(y, "data-line-id", F = /*row*/
      e[67]?.id), y.value = O = /*row*/
      e[67]?.line ?? "", s(d, "class", "svelte-a7gd0z"), X.__value = "", T(X, X.__value), s(X, "class", "svelte-a7gd0z"), s(M, "class", "line-edit svelte-a7gd0z"), s(M, "data-field", "shift"), s(M, "data-line-id", z = /*row*/
      e[67]?.id), s(V, "class", "svelte-a7gd0z"), s(c, "type", "time"), s(c, "class", "line-edit line-time-input svelte-a7gd0z"), s(c, "data-field", "start"), s(c, "data-line-id", w = /*row*/
      e[67]?.id), c.value = f = /*row*/
      e[67]?.start ?? "", s(p, "class", "svelte-a7gd0z"), s(L, "type", "time"), s(L, "class", "line-edit line-time-input svelte-a7gd0z"), s(L, "data-field", "end"), s(L, "data-line-id", H = /*row*/
      e[67]?.id), L.value = E = /*row*/
      e[67]?.end ?? "", s(b, "class", "svelte-a7gd0z"), ae.__value = "", T(ae, ae.__value), s(ae, "class", "svelte-a7gd0z"), s(q, "class", "line-edit svelte-a7gd0z"), s(q, "data-field", "position"), s(q, "data-line-id", j = /*row*/
      e[67]?.id), s(Q, "class", "svelte-a7gd0z"), Me.__value = "", T(Me, Me.__value), s(Me, "class", "svelte-a7gd0z"), s(ee, "class", "line-edit svelte-a7gd0z"), s(ee, "data-field", "emp"), s(ee, "data-line-id", K = /*row*/
      e[67]?.id), s(Se, "class", "svelte-a7gd0z"), _e.__value = "", T(_e, _e.__value), s(_e, "class", "svelte-a7gd0z"), he.__value = "M", T(he, he.__value), s(he, "class", "svelte-a7gd0z"), ge.__value = "F", T(ge, ge.__value), s(ge, "class", "svelte-a7gd0z"), s(x, "class", "line-edit svelte-a7gd0z"), s(x, "data-field", "sex"), s(x, "data-line-id", Be = /*row*/
      e[67]?.id), s(Le, "class", "svelte-a7gd0z"), ve.__value = "", T(ve, ve.__value), s(ve, "class", "svelte-a7gd0z"), pe.__value = "-", T(pe, pe.__value), s(pe, "class", "svelte-a7gd0z"), me.__value = "DFO", T(me, me.__value), s(me, "class", "svelte-a7gd0z"), Ve.__value = "BAG", T(Ve, Ve.__value), s(Ve, "class", "svelte-a7gd0z"), fe.__value = "PAX", T(fe, fe.__value), s(fe, "class", "svelte-a7gd0z"), ye.__value = "TRAINING", T(ye, ye.__value), s(ye, "class", "svelte-a7gd0z"), s(U, "class", "line-edit svelte-a7gd0z"), s(U, "data-field", "function"), s(U, "data-line-id", Je = /*row*/
      e[67]?.id), s(je, "class", "svelte-a7gd0z"), Pe.__value = "", T(Pe, Pe.__value), s(Pe, "class", "svelte-a7gd0z"), be.__value = "A", T(be, be.__value), s(be, "class", "svelte-a7gd0z"), Ge.__value = "B", T(Ge, Ge.__value), s(Ge, "class", "svelte-a7gd0z"), s(te, "class", "line-edit svelte-a7gd0z"), s(te, "data-field", "certPool"), s(te, "data-line-id", Xe = /*row*/
      e[67]?.id), s(qe, "class", "svelte-a7gd0z"), s(g, "class", "line-rdo-cell svelte-a7gd0z"), s(rt, "class", "line-center svelte-a7gd0z"), s(xe, "class", "line-hours svelte-a7gd0z"), s(n, "data-line-row", dt = /*row*/
      e[67]?.id), Z(n, "height", bt + "px"), s(n, "class", "svelte-a7gd0z"), this.first = n;
    },
    m(m, B) {
      ce(m, n, B), i(n, a), i(a, r), i(r, l);
      for (let v = 0; v < se.length; v += 1)
        se[v] && se[v].m(r, null);
      J(
        r,
        /*row*/
        e[67]?.teamId ?? ""
      ), i(n, h), i(n, d), i(d, y), i(n, R), i(n, V), i(V, M), i(M, X);
      for (let v = 0; v < oe.length; v += 1)
        oe[v] && oe[v].m(M, null);
      J(
        M,
        /*row*/
        e[67]?.shiftId ?? ""
      ), i(n, N), i(n, p), i(p, c), i(n, D), i(n, b), i(b, L), i(n, G), i(n, Q), i(Q, q), i(q, ae);
      for (let v = 0; v < ne.length; v += 1)
        ne[v] && ne[v].m(q, null);
      J(
        q,
        /*row*/
        e[67]?.position ?? ""
      ), i(n, Te), i(n, Se), i(Se, ee), i(ee, Me);
      for (let v = 0; v < re.length; v += 1)
        re[v] && re[v].m(ee, null);
      J(
        ee,
        /*row*/
        e[67]?.emp ?? ""
      ), i(n, le), i(n, Le), i(Le, x), i(x, _e), i(x, he), i(x, ge), J(
        x,
        /*row*/
        e[67]?.sex ?? ""
      ), i(n, Ue), i(n, je), i(je, U), i(U, ve), i(U, pe), i(U, me), i(U, Ve), i(U, fe), i(U, ye), J(
        U,
        /*row*/
        e[67]?.function ?? ""
      ), i(n, Ye), i(n, qe), i(qe, te), i(te, Pe), i(te, be), i(te, Ge), J(
        te,
        /*row*/
        e[67]?.certPool ?? ""
      ), i(n, Qe), i(n, g), i(g, ie), i(n, Ne), i(n, rt), i(rt, ht), i(n, ut);
      for (let v = 0; v < 7; v += 1)
        Ie[v] && Ie[v].m(n, null);
      i(n, gt), i(n, xe), i(xe, tt), nt || (Rt = [
        P(r, "change", vt),
        P(y, "change", Et),
        P(M, "change", pt),
        P(c, "change", kt),
        P(L, "change", mt),
        P(q, "change", Lt),
        P(ee, "change", yt),
        P(x, "change", Bt),
        P(U, "change", Oe),
        P(te, "change", At)
      ], nt = !0);
    },
    p(m, B) {
      if (e = m, B[0] & /*teamOptions*/
      512) {
        We = De(
          /*teamOptions*/
          e[9]
        );
        let v;
        for (v = 0; v < We.length; v += 1) {
          const $ = Zt(e, We, v);
          se[v] ? se[v].p($, B) : (se[v] = an($), se[v].c(), se[v].m(r, null));
        }
        for (; v < se.length; v += 1)
          se[v].d(1);
        se.length = We.length;
      }
      if (B[0] & /*visibleRows, teamOptions*/
      16896 && u !== (u = /*row*/
      e[67]?.id) && s(r, "data-line-id", u), B[0] & /*visibleRows, teamOptions*/
      16896 && _ !== (_ = /*row*/
      e[67]?.teamId ?? "") && J(
        r,
        /*row*/
        e[67]?.teamId ?? ""
      ), B[0] & /*visibleRows, teamOptions*/
      16896 && F !== (F = /*row*/
      e[67]?.id) && s(y, "data-line-id", F), B[0] & /*visibleRows, teamOptions*/
      16896 && O !== (O = /*row*/
      e[67]?.line ?? "") && y.value !== O && (y.value = O), B[0] & /*shiftOptions*/
      256) {
        He = De(
          /*shiftOptions*/
          e[8]
        );
        let v;
        for (v = 0; v < He.length; v += 1) {
          const $ = Qt(e, He, v);
          oe[v] ? oe[v].p($, B) : (oe[v] = sn($), oe[v].c(), oe[v].m(M, null));
        }
        for (; v < oe.length; v += 1)
          oe[v].d(1);
        oe.length = He.length;
      }
      if (B[0] & /*visibleRows, teamOptions*/
      16896 && z !== (z = /*row*/
      e[67]?.id) && s(M, "data-line-id", z), B[0] & /*visibleRows, teamOptions*/
      16896 && W !== (W = /*row*/
      e[67]?.shiftId ?? "") && J(
        M,
        /*row*/
        e[67]?.shiftId ?? ""
      ), B[0] & /*visibleRows, teamOptions*/
      16896 && w !== (w = /*row*/
      e[67]?.id) && s(c, "data-line-id", w), B[0] & /*visibleRows, teamOptions*/
      16896 && f !== (f = /*row*/
      e[67]?.start ?? "") && c.value !== f && (c.value = f), B[0] & /*visibleRows, teamOptions*/
      16896 && H !== (H = /*row*/
      e[67]?.id) && s(L, "data-line-id", H), B[0] & /*visibleRows, teamOptions*/
      16896 && E !== (E = /*row*/
      e[67]?.end ?? "") && L.value !== E && (L.value = E), B[0] & /*BASE_POSITIONS, visibleRows*/
      49152) {
        $e = De(hn(
          /*BASE_POSITIONS*/
          e[15],
          /*row*/
          e[67]?.position
        ));
        let v;
        for (v = 0; v < $e.length; v += 1) {
          const $ = qt(e, $e, v);
          ne[v] ? ne[v].p($, B) : (ne[v] = on($), ne[v].c(), ne[v].m(q, null));
        }
        for (; v < ne.length; v += 1)
          ne[v].d(1);
        ne.length = $e.length;
      }
      if (B[0] & /*visibleRows, teamOptions*/
      16896 && j !== (j = /*row*/
      e[67]?.id) && s(q, "data-line-id", j), B[0] & /*visibleRows, teamOptions*/
      16896 && we !== (we = /*row*/
      e[67]?.position ?? "") && J(
        q,
        /*row*/
        e[67]?.position ?? ""
      ), B[0] & /*BASE_EMPS*/
      65536) {
        Ke = De(
          /*BASE_EMPS*/
          e[16]
        );
        let v;
        for (v = 0; v < Ke.length; v += 1) {
          const $ = jt(e, Ke, v);
          re[v] ? re[v].p($, B) : (re[v] = rn($), re[v].c(), re[v].m(ee, null));
        }
        for (; v < re.length; v += 1)
          re[v].d(1);
        re.length = Ke.length;
      }
      if (B[0] & /*visibleRows, teamOptions*/
      16896 && K !== (K = /*row*/
      e[67]?.id) && s(ee, "data-line-id", K), B[0] & /*visibleRows, teamOptions*/
      16896 && Ce !== (Ce = /*row*/
      e[67]?.emp ?? "") && J(
        ee,
        /*row*/
        e[67]?.emp ?? ""
      ), B[0] & /*visibleRows, teamOptions*/
      16896 && Be !== (Be = /*row*/
      e[67]?.id) && s(x, "data-line-id", Be), B[0] & /*visibleRows, teamOptions*/
      16896 && st !== (st = /*row*/
      e[67]?.sex ?? "") && J(
        x,
        /*row*/
        e[67]?.sex ?? ""
      ), B[0] & /*visibleRows, teamOptions*/
      16896 && Je !== (Je = /*row*/
      e[67]?.id) && s(U, "data-line-id", Je), B[0] & /*visibleRows, teamOptions*/
      16896 && S !== (S = /*row*/
      e[67]?.function ?? "") && J(
        U,
        /*row*/
        e[67]?.function ?? ""
      ), B[0] & /*visibleRows, teamOptions*/
      16896 && Xe !== (Xe = /*row*/
      e[67]?.id) && s(te, "data-line-id", Xe), B[0] & /*visibleRows, teamOptions*/
      16896 && ot !== (ot = /*row*/
      e[67]?.certPool ?? "") && J(
        te,
        /*row*/
        e[67]?.certPool ?? ""
      ), B[0] & /*visibleRows*/
      16384 && A !== (A = /*row*/
      (e[67]?.rdos ?? "—") + "") && lt(ie, A), B[0] & /*visibleRows*/
      16384 && Ze !== (Ze = /*row*/
      (e[67]?.paid ?? "") + "") && lt(ht, Ze), B[0] & /*visibleRows, dayStyle, emitDayTime, emitDayDuty*/
      1720320) {
        ze = De([0, 1, 2, 3, 4, 5, 6]);
        let v;
        for (v = 0; v < 7; v += 1) {
          const $ = Yt(e, ze, v);
          Ie[v] ? Ie[v].p($, B) : (Ie[v] = fn($), Ie[v].c(), Ie[v].m(n, gt));
        }
        for (; v < 7; v += 1)
          Ie[v].d(1);
      }
      B[0] & /*visibleRows*/
      16384 && ft !== (ft = /*row*/
      (e[67]?.hours ?? "") + "") && lt(tt, ft), B[0] & /*visibleRows, teamOptions*/
      16896 && dt !== (dt = /*row*/
      e[67]?.id) && s(n, "data-line-row", dt);
    },
    d(m) {
      m && ue(n), _t(se, m), _t(oe, m), _t(ne, m), _t(re, m), _t(Ie, m), nt = !1, at(Rt);
    }
  };
}
function cn(t) {
  let e, n;
  return {
    c() {
      e = o("tr"), n = o("td"), s(n, "colspan", "20"), s(n, "class", "spacer-cell svelte-a7gd0z"), Z(
        n,
        "height",
        /*paddingBottom*/
        t[12] + "px"
      ), s(e, "class", "spacer-row svelte-a7gd0z"), Z(
        e,
        "height",
        /*paddingBottom*/
        t[12] + "px"
      );
    },
    m(a, r) {
      ce(a, e, r), i(e, n);
    },
    p(a, r) {
      r[0] & /*paddingBottom*/
      4096 && Z(
        n,
        "height",
        /*paddingBottom*/
        a[12] + "px"
      ), r[0] & /*paddingBottom*/
      4096 && Z(
        e,
        "height",
        /*paddingBottom*/
        a[12] + "px"
      );
    },
    d(a) {
      a && ue(e);
    }
  };
}
function Jn(t) {
  let e;
  function n(l, u) {
    return (
      /*mode*/
      l[7] === "svelte" ? Un : Kn
    );
  }
  let a = n(t), r = a(t);
  return {
    c() {
      e = o("div"), r.c(), s(e, "class", "lines-table-root svelte-a7gd0z"), Z(e, "min-height", "min(70vh, 720px)"), Z(e, "height", "min(70vh, 720px)"), Z(e, "width", "100%"), Z(
        e,
        "--export-rdo",
        /*exportStyle*/
        t[10]?.rdo || "#000000"
      ), Z(
        e,
        "--export-bag",
        /*exportStyle*/
        t[10]?.bag || "#F4B4B4"
      ), Z(
        e,
        "--export-dfo",
        /*exportStyle*/
        t[10]?.dfo || "#FFF3A8"
      ), Z(
        e,
        "--export-pax",
        /*exportStyle*/
        t[10]?.pax || "#A0C4FF"
      ), Z(
        e,
        "--export-header",
        /*exportStyle*/
        t[10]?.header || "#1F4E79"
      );
    },
    m(l, u) {
      ce(l, e, u), r.m(e, null);
    },
    p(l, u) {
      a === (a = n(l)) && r ? r.p(l, u) : (r.d(1), r = a(l), r && (r.c(), r.m(e, null))), u[0] & /*exportStyle*/
      1024 && Z(
        e,
        "--export-rdo",
        /*exportStyle*/
        l[10]?.rdo || "#000000"
      ), u[0] & /*exportStyle*/
      1024 && Z(
        e,
        "--export-bag",
        /*exportStyle*/
        l[10]?.bag || "#F4B4B4"
      ), u[0] & /*exportStyle*/
      1024 && Z(
        e,
        "--export-dfo",
        /*exportStyle*/
        l[10]?.dfo || "#FFF3A8"
      ), u[0] & /*exportStyle*/
      1024 && Z(
        e,
        "--export-pax",
        /*exportStyle*/
        l[10]?.pax || "#A0C4FF"
      ), u[0] & /*exportStyle*/
      1024 && Z(
        e,
        "--export-header",
        /*exportStyle*/
        l[10]?.header || "#1F4E79"
      );
    },
    i: it,
    o: it,
    d(l) {
      l && ue(e), r.d();
    }
  };
}
const bt = 42, _n = 8;
function hn(t, e) {
  const n = e == null ? "" : String(e);
  return !n || t.indexOf(n) >= 0 ? t : t.concat([n]);
}
function Vt(t) {
  if (!t) return "";
  const e = t.name || t.id || "";
  if (t.segments && Array.isArray(t.segments) && t.segments.length === 2) {
    const n = t.segments[0].start + "–" + t.segments[0].end + " / " + t.segments[1].start + "–" + t.segments[1].end;
    return (e ? e + " " : "") + "(" + n + ")";
  }
  return t.start && t.end ? (e ? e + " " : "") + "(" + t.start + "–" + t.end + ")" : t.start ? e ? e + " " + t.start : t.start : e;
}
function Dn(t) {
  const e = String(t || "").toUpperCase();
  return e === "RDO" || e === "—" || e === "OFF" ? "rdo" : e === "-" ? "dash" : e === "BAG" || e === "BAGS" ? "bag" : e === "DFO" ? "dfo" : e === "PAX" ? "pax" : e === "TRAINING" ? "training" : null;
}
function gn(t) {
  const e = Dn(t);
  return e === "rdo" ? "cell-day-col cell-rdo" : e === "bag" ? "cell-day-col cell-function-duty cell-bag" : e === "dfo" ? "cell-day-col cell-function-duty cell-dfo" : e === "pax" ? "cell-day-col cell-function-duty cell-pax" : e === "training" ? "cell-day-col cell-function-duty cell-training" : "cell-day-col cell-work";
}
function Yn(t, e, n) {
  let a, r, l, u, _, h, d, { rows: y = [] } = e, { mode: F = "svelte" } = e, { shiftOptions: O = [] } = e, { teamOptions: R = [] } = e, { exportStyle: V = Ut() } = e, { onInlineEdit: M = null } = e, { onDayToggle: X = null } = e, { onDayDutyEdit: z = null } = e, { onDayTimeEdit: W = null } = e, { onSort: N = null } = e, { onFilter: p = null } = e, { currentSortBy: c = "role" } = e, { currentSortDir: w = "asc" } = e, { filterRole: f = "ALL" } = e, { filterShift: D = "" } = e, { filterTeam: b = "" } = e, { filterSex: L = "" } = e, { filterDuty: H = "" } = e, { filterDay: E = "" } = e, { searchCode: G = "" } = e;
  const Q = ["TSO", "LTSO", "STSO"], q = ["FT", "PT"];
  function ae(g) {
    const A = Dn(g);
    if (!A) return;
    const Ne = (V || Ut())[A];
    if (Ne)
      return "background:" + Ne + ";color:" + Hn(Ne) + ";";
  }
  function j(g, A, ie) {
    M?.({ lineId: g, field: A, value: ie });
  }
  function we(g, A, ie) {
    z?.({ lineId: g, dayIndex: A, duty: ie });
  }
  function Te(g, A, ie, Ne) {
    W?.({ lineId: g, dayIndex: A, field: ie, value: Ne });
  }
  function Se(g) {
    let A = "asc";
    c === g && (A = w === "asc" ? "desc" : "asc"), N?.({ sortBy: g, sortDir: A });
  }
  function ee() {
    p?.({
      filterRole: f,
      filterShift: D,
      filterTeam: b,
      filterSex: L,
      filterDuty: H,
      filterDay: E,
      searchCode: G
    });
  }
  function Me(g) {
    return c !== g ? "" : w === "asc" ? " ▲" : " ▼";
  }
  let K = 0, Ce = 600, le;
  function Le(g) {
    n(34, K = g.target.scrollTop);
  }
  Sn(() => {
    le && n(35, Ce = le.clientHeight || 600);
  });
  function x() {
    G = this.value, n(6, G);
  }
  function _e() {
    f = wt(this), n(0, f);
  }
  function he() {
    b = wt(this), n(2, b), n(9, R);
  }
  function ge() {
    D = wt(this), n(1, D), n(8, O);
  }
  function Be() {
    H = wt(this), n(4, H);
  }
  function st() {
    E = wt(this), n(5, E);
  }
  function Ue() {
    L = wt(this), n(3, L);
  }
  const je = () => Se("team"), U = () => Se("line"), ve = () => Se("shift"), pe = () => Se("start"), me = () => Se("role"), Ve = (g, A) => j(g?.id, "team", A.target.value), fe = (g, A) => j(g?.id, "lineCode", A.target.value), ye = (g, A) => j(g?.id, "shift", A.target.value), Je = (g, A) => j(g?.id, "start", A.target.value), S = (g, A) => j(g?.id, "end", A.target.value), Ye = (g, A) => j(g?.id, "position", A.target.value), qe = (g, A) => j(g?.id, "emp", A.target.value), te = (g, A) => j(g?.id, "sex", A.target.value), Pe = (g, A) => j(g?.id, "function", A.target.value), be = (g, A) => j(g?.id, "certPool", A.target.value), Ge = (g, A, ie) => we(g?.id, A, ie.target.value), Xe = (g, A, ie) => Te(g?.id, A, "start", ie.target.value), ot = (g, A, ie) => Te(g?.id, A, "end", ie.target.value);
  function Qe(g) {
    Pt[g ? "unshift" : "push"](() => {
      le = g, n(11, le), n(37, r), n(34, K), n(35, Ce), n(39, a), n(25, y);
    });
  }
  return t.$$set = (g) => {
    "rows" in g && n(25, y = g.rows), "mode" in g && n(7, F = g.mode), "shiftOptions" in g && n(8, O = g.shiftOptions), "teamOptions" in g && n(9, R = g.teamOptions), "exportStyle" in g && n(10, V = g.exportStyle), "onInlineEdit" in g && n(26, M = g.onInlineEdit), "onDayToggle" in g && n(27, X = g.onDayToggle), "onDayDutyEdit" in g && n(28, z = g.onDayDutyEdit), "onDayTimeEdit" in g && n(29, W = g.onDayTimeEdit), "onSort" in g && n(30, N = g.onSort), "onFilter" in g && n(31, p = g.onFilter), "currentSortBy" in g && n(32, c = g.currentSortBy), "currentSortDir" in g && n(33, w = g.currentSortDir), "filterRole" in g && n(0, f = g.filterRole), "filterShift" in g && n(1, D = g.filterShift), "filterTeam" in g && n(2, b = g.filterTeam), "filterSex" in g && n(3, L = g.filterSex), "filterDuty" in g && n(4, H = g.filterDuty), "filterDay" in g && n(5, E = g.filterDay), "searchCode" in g && n(6, G = g.searchCode);
  }, t.$$.update = () => {
    t.$$.dirty[0] & /*rows*/
    33554432 && n(39, a = y.length), t.$$.dirty[1] & /*totalRows*/
    256 && n(37, r = a * bt), t.$$.dirty[0] & /*scrollContainer*/
    2048 | t.$$.dirty[1] & /*totalHeight, scrollTop, viewportHeight*/
    88 && le && r >= 0 && K > r && (n(11, le.scrollTop = Math.max(0, r - Ce), le), n(34, K = le.scrollTop)), t.$$.dirty[1] & /*scrollTop*/
    8 && n(38, l = Math.max(0, Math.floor(K / bt) - _n)), t.$$.dirty[1] & /*totalRows, scrollTop, viewportHeight*/
    280 && n(36, u = Math.min(a, Math.ceil((K + Ce) / bt) + _n)), t.$$.dirty[0] & /*rows*/
    33554432 | t.$$.dirty[1] & /*startIndex, endIndex*/
    160 && n(14, _ = y.slice(l, u)), t.$$.dirty[1] & /*startIndex*/
    128 && n(13, h = l * bt), t.$$.dirty[1] & /*totalHeight, endIndex*/
    96 && n(12, d = Math.max(0, r - u * bt));
  }, [
    f,
    D,
    b,
    L,
    H,
    E,
    G,
    F,
    O,
    R,
    V,
    le,
    d,
    h,
    _,
    Q,
    q,
    ae,
    j,
    we,
    Te,
    Se,
    ee,
    Me,
    Le,
    y,
    M,
    X,
    z,
    W,
    N,
    p,
    c,
    w,
    K,
    Ce,
    u,
    r,
    l,
    a,
    x,
    _e,
    he,
    ge,
    Be,
    st,
    Ue,
    je,
    U,
    ve,
    pe,
    me,
    Ve,
    fe,
    ye,
    Je,
    S,
    Ye,
    qe,
    te,
    Pe,
    be,
    Ge,
    Xe,
    ot,
    Qe
  ];
}
class jn extends Gn {
  constructor(e) {
    super(), Pn(
      this,
      e,
      Yn,
      Jn,
      bn,
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
function qn() {
  return typeof window < "u" && window.luxon && window.luxon.DateTime ? window.luxon.DateTime : typeof globalThis < "u" && globalThis.luxon && globalThis.luxon.DateTime ? globalThis.luxon.DateTime : null;
}
function It(t) {
  var e = qn();
  if (e) {
    if (!t) return e.now().startOf("day");
    if (typeof t == "string") {
      var n = e.fromISO(t.slice(0, 10));
      if (n.isValid) return n.startOf("day");
    }
    return t && typeof t.toJSDate == "function" ? e.fromJSDate(t.toJSDate()).startOf("day") : t instanceof Date ? e.fromJSDate(t).startOf("day") : t && t.isValid && t.toISODate ? t.startOf ? t.startOf("day") : t : e.now().startOf("day");
  }
  var a;
  return t ? typeof t == "string" ? a = /* @__PURE__ */ new Date(t.slice(0, 10) + "T00:00:00") : t instanceof Date ? a = new Date(t.getTime()) : t && t.toJSDate ? a = t.toJSDate() : a = /* @__PURE__ */ new Date() : a = /* @__PURE__ */ new Date(), isNaN(a.getTime()) && (a = /* @__PURE__ */ new Date()), a.setHours(0, 0, 0, 0), {
    isValid: !0,
    weekday: a.getDay() === 0 ? 7 : a.getDay(),
    startOf: function() {
      return It(a);
    },
    plus: function(r) {
      var l = new Date(a.getTime());
      return r && r.days && l.setDate(l.getDate() + r.days), It(l);
    },
    toFormat: function(r) {
      var l = a.getFullYear(), u = String(a.getMonth() + 1).padStart(2, "0"), _ = String(a.getDate()).padStart(2, "0");
      return l + "-" + u + "-" + _;
    },
    toISODate: function() {
      var r = a.getFullYear(), l = String(a.getMonth() + 1).padStart(2, "0"), u = String(a.getDate()).padStart(2, "0");
      return r + "-" + l + "-" + u;
    },
    toJSDate: function() {
      return a;
    }
  };
}
function Qn(t, e) {
  return It(t).plus({ days: e });
}
function Zn(t) {
  return It(t).weekday % 7;
}
function wn(t, e) {
  var n = {};
  if (t == null || t === "") {
    for (var a = 0; a < 7; a++) n[a] = a;
    return n;
  }
  for (var r = Math.min(7, (Number(e) || 1) * 7), l = It(t), u = 0; u < r; u++) {
    var _ = Zn(Qn(l, u));
    n[_] == null && (n[_] = u);
  }
  return n;
}
function xn(t) {
  if (t = t || window.Scheduler, !t) return;
  function e(l) {
    var u = String(l || "").trim();
    if (!u) return "";
    var _ = u.match(/^(\d+)$/);
    return _ && Number(_[1]) < 10 ? "0" + _[1] : u;
  }
  function n(l, u) {
    var _ = (l.rdoDays || []).map(Number).filter(function(d) {
      return Number.isInteger(d) && d >= 0 && d <= 6;
    }), h = _.length ? _.map(function(d) {
      return u && u[d] != null ? u[d] : String(d);
    }).join(",") : "—";
    return l.rdoHard && (h += " (hard)"), h;
  }
  function a(l, u, _) {
    return _ || "WORK";
  }
  function r(l, u) {
    return u === "TRAINING" ? "TRAINING" : u === "-" || u === "BAG" || u === "PAX" || u === "DFO" ? u : l.isTraining || l.trainingClass || l.empClass === "ESTI" || l.empClass === "MSTI" || l.extraName === "ESTI" || l.extraName === "MSTI" ? "TRAINING" : l.function === "BAG" ? "BAG" : l.function === "DFO" || l.function === "PAX" ? "PAX" : l.function === "-" ? "-" : u === "BAG" || u === "PAX" ? u : null;
  }
  t.lineToRowModel = function(l, u, _) {
    if (_ = _ || {}, !l || !u) return null;
    for (var h = _.dayNames || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], d = typeof _.teamResolver == "function" ? _.teamResolver(l.id) : null, y = typeof _.shiftResolver == "function" ? _.shiftResolver(l.shiftId) : null, F = l.shiftName || y && y.name || "", O = l.startTime || (y && y.start ? y.start : ""), R = l.endTime || (y && y.end ? y.end : ""), V = y && y.segments && y.segments.length === 2 ? y.segments[0].start + "–" + y.segments[0].end + " / " + y.segments[1].start + "–" + y.segments[1].end : O && R ? O + "–" + R : O || "WORK", M = l.shiftLabel || V, X = !!(l.isExtra || l.extraPositionId), z = X ? l.position || l.extraName || "TSO" : l.isStso || l.empClass === "STSO" ? "STSO" : l.isLtso || l.empClass === "LTSO" ? "LTSO" : "TSO", W = X ? l.empClass === "PT" ? "PT" : "FT" : z === "STSO" || z === "LTSO" ? "FT" : l.empClass === "PT" ? "PT" : "FT", N = l.paid || 0, p = Array.isArray(u) ? u : u[l.id] || u[String(l.id)] || [], c = wn(
      _.startDate != null ? _.startDate : t.state && t.state.startDate,
      _.weekCount != null ? _.weekCount : t.state && t.state.weekCount
    ), w = [], f = [], D = [], b = [], L = 0, H = 0; H < 7; H++) {
      var E = c[H];
      E == null && (E = H);
      var G = l.dayTimes && l.dayTimes[String(H)], Q = typeof _.effectiveTimesResolver == "function" ? _.effectiveTimesResolver(l.shiftId, H) : null, q = G && G.start || l.startTime || Q && Q.start || O, ae = G && G.end || l.endTime || Q && Q.end || R;
      D.push(q), b.push(ae);
      var j = p[E];
      if (j === "WORK") {
        L += N;
        var we = typeof _.rotationDutyResolver == "function" ? _.rotationDutyResolver(l.id, E) : null, Te = a(l, we, M);
        w.push(Te), f.push(r(l, we) || "PAX");
      } else
        w.push("RDO"), f.push("OFF");
    }
    return {
      id: l.id,
      teamId: d && d.id || "",
      shiftId: l.shiftId || "",
      team: e(d && (d.name || d.id) || ""),
      line: l.lineCode || "",
      shift: F,
      start: O,
      end: R,
      position: z,
      emp: W,
      sex: l.sex === "F" || l.sex === "M" ? l.sex : "",
      function: l.function || "",
      certPool: l.certPool || "",
      rdos: n(l, h),
      paid: N,
      days: w,
      dayDuties: f,
      dayStarts: D,
      dayEnds: b,
      hours: L
    };
  }, t.getRowModels = function(l, u, _) {
    return !Array.isArray(l) || !u || typeof u != "object" ? [] : l.map(function(h) {
      return t.lineToRowModel(h, u, _);
    }).filter(Boolean);
  }, t.getLineRowModels = function(l) {
    var u = t.state && Array.isArray(t.state.lines) ? t.state.lines : [], _ = t.state && t.state.schedule || {}, h = Object.assign({}, l || {});
    return !h.teamResolver && typeof t.teamMetaForLine == "function" && (h.teamResolver = t.teamMetaForLine), !h.shiftResolver && typeof t.getShift == "function" && (h.shiftResolver = t.getShift), !h.rotationDutyResolver && typeof t.getRotationDuty == "function" && (h.rotationDutyResolver = t.getRotationDuty), !h.effectiveTimesResolver && typeof t.getEffectiveShiftTimes == "function" && (h.effectiveTimesResolver = t.getEffectiveShiftTimes), t.getRowModels(u, _, h);
  };
}
function $n(t) {
  if (t = t || window.Scheduler, !t) return;
  function e(_, h) {
    var d = t.getRotationDuty ? t.getRotationDuty(_.id, h) : null;
    return d || _.function || null;
  }
  t.dutyFor = e;
  function n(_) {
    if (_.shiftLabel) return _.shiftLabel;
    var h = t.getShift ? t.getShift(_.shiftId) : null;
    return h && h.start && h.end ? h.start + "–" + h.end : h && h.start ? h.start : "WORK";
  }
  function a(_) {
    if (!(!_ || _.function !== "BAG")) {
      t.state.functionRotation || (t.state.functionRotation = {});
      var h = String(_.id);
      t.state.functionRotation[h] || (t.state.functionRotation[h] = []);
      for (var d = t.state.schedule && (t.state.schedule[_.id] || t.state.schedule[h]) || [], y = Math.max(d.length, (t.state.weekCount || 1) * 7), F = 0; F < y; F++) {
        for (; t.state.functionRotation[h].length <= F; ) t.state.functionRotation[h].push(null);
        d[F] === "WORK" && (t.state.functionRotation[h][F] = "BAG");
      }
    }
  }
  function r(_) {
    if (!(!_ || _.function !== "DFO")) {
      t.state.functionRotation || (t.state.functionRotation = {});
      var h = String(_.id);
      t.state.functionRotation[h] || (t.state.functionRotation[h] = []);
      for (var d = t.state.schedule && (t.state.schedule[_.id] || t.state.schedule[h]) || [], y = Math.max(d.length, (t.state.weekCount || 1) * 7), F = 0; F < y; F++) {
        for (; t.state.functionRotation[h].length <= F; ) t.state.functionRotation[h].push(null);
        d[F] === "WORK" && (t.state.functionRotation[h][F] = "DFO");
      }
    }
  }
  function l() {
    var _ = document.getElementById("lines-tbody"), h = _ || document.querySelector(".lines-virtual-root");
    h && _ && h.querySelectorAll("td.cell-toggle").forEach(function(d) {
      var y = t.findLineById ? t.findLineById(d.getAttribute("data-line-id")) : null, F = +d.getAttribute("data-day");
      if (!(!y || isNaN(F))) {
        var O = (t.state.schedule[y.id] || t.state.schedule[String(y.id)] || [])[F] || "RDO";
        if (d.style.background = "", d.style.color = "", O !== "WORK") {
          d.className = "cell-rdo cell-toggle", d.textContent = "RDO", d.style.background = "#000", d.style.color = "#fff", d.style.opacity = "1";
          return;
        }
        var R = e(y, F), V = R === "BAG" || R === "BAGS", M = R === "DFO", X = "";
        V ? X = " cell-function-duty cell-bag" : M && (X = " cell-function-duty cell-dfo"), d.className = "cell-work cell-toggle" + X, d.textContent = n(y);
      }
    });
  }
  t.paintLineColors = l;
  function u(_) {
    var h = t[_];
    if (!(typeof h != "function" || h._lineColorsWrapped)) {
      var d = function() {
        if (t.__USE_SVELTE_LINES) return h.apply(this, arguments);
        var y = h.apply(this, arguments);
        return setTimeout(l, 0), y;
      };
      d._lineColorsWrapped = !0, t[_] = d;
    }
  }
  u("renderLines"), u("renderAll"), u("generateFunctionAssignments"), t._lineColorsBound || (t._lineColorsBound = !0, document.addEventListener("change", function(_) {
    var h = _.target;
    if (!(!h || h.getAttribute("data-field") !== "function")) {
      var d = t.findLineById ? t.findLineById(h.getAttribute("data-line-id")) : null;
      d && (d.function = h.value === "DFO" || h.value === "PAX" || h.value === "BAG" || h.value === "TRAINING" || h.value === "-" ? h.value : "", d.function === "BAG" && a(d), d.function === "DFO" && r(d), t.renderLines ? t.renderLines() : l());
    }
  }));
}
function tl(t) {
  const e = t || window.Scheduler;
  if (!e) return;
  xn(e), $n(e);
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
  function a() {
    return {
      teamResolver: typeof e.teamMetaForLine == "function" ? e.teamMetaForLine : null,
      shiftResolver: typeof e.getShift == "function" ? e.getShift : null,
      rotationDutyResolver: typeof e.getRotationDuty == "function" ? e.getRotationDuty : r,
      effectiveTimesResolver: typeof e.getEffectiveShiftTimes == "function" ? e.getEffectiveShiftTimes : null
    };
  }
  function r(p, c) {
    const w = String(p), f = e.state && e.state.functionRotation, D = f && (f[w] || f[p]);
    if (!Array.isArray(D)) return null;
    const b = D[c];
    return b === "BAG" ? "BAG" : b === "DFO" ? "DFO" : b === "PAX" ? "PAX" : b === "TRAINING" ? "TRAINING" : b === "-" ? "-" : null;
  }
  function l(p, c, w) {
    var f = String(p);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[f] || (e.state.functionRotation[f] = []); e.state.functionRotation[f].length <= c; ) e.state.functionRotation[f].push(null);
    e.state.functionRotation[f][c] = w;
  }
  function u(p) {
    var c = wn(e.state && e.state.startDate, e.state && e.state.weekCount), w = c[p];
    return w ?? p;
  }
  function _(p) {
    if (!p) return !1;
    if (p.function === "DFO") return !0;
    const c = p.functionEligible;
    return !!(c && (c.dfo === !0 || c.DFO === !0));
  }
  function h() {
    const p = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], c = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(p)) : p, w = e.state && e.state.schedule || {}, f = typeof e.getRowModels == "function" ? e.getRowModels(c, w, a()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(a()) : [];
    return Array.isArray(f) ? f : [];
  }
  function d() {
    return e.teams && Array.isArray(e.teams.teams) ? e.teams.teams : [];
  }
  function y() {
    return e.state && Array.isArray(e.state.shifts) ? e.state.shifts : [];
  }
  function F() {
    return typeof e.getExportStyle == "function" ? e.getExportStyle() : e.state && e.state.exportStyle || null;
  }
  function O(p) {
    if (!p || typeof p.$set != "function") return;
    const c = h();
    typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), p.$set({
      rows: Array.isArray(c) ? c : [],
      shiftOptions: y(),
      teamOptions: d(),
      exportStyle: F(),
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
  function R(p) {
    if (!p) return;
    const c = e.findLineById ? e.findLineById(p.lineId) : null;
    if (!c) return;
    const w = p.field, f = p.value;
    if (w === "lineCode")
      c.lineCode = String(f || "").trim() || c.lineCode;
    else if (w === "sex")
      c.sex = f === "F" ? "F" : "M";
    else if (w === "function")
      c.function = f === "DFO" || f === "PAX" || f === "BAG" || f === "TRAINING" || f === "-" ? f : "";
    else if (w === "certPool") {
      var D = String(f || "").trim().toUpperCase();
      c.certPool = D === "A" || D === "B" ? D : "";
    } else if (w === "emp")
      e.applyLineEmp && e.applyLineEmp(c, f);
    else if (w === "position") {
      var b = !!(c.isExtra || c.extraPositionId), L = String(f ?? "").trim();
      b ? (L && (c.position = L, c.extraName = L), c.isStso = !1, c.isLtso = !1) : e.applyLineEmp && e.applyLineEmp(c, L);
    } else if (w === "shift")
      e.applyLineShift && e.applyLineShift(c, f);
    else if (w === "team")
      e.setLineTeam && e.setLineTeam(p.lineId, f);
    else if (w === "start" || w === "end") {
      var H = String(f || "").trim();
      if (e.isValidTimeText && !e.isValidTimeText(H)) return;
      w === "start" && (c.startTime = H), w === "end" && (c.endTime = H);
      var E = e.getShift ? e.getShift(c.shiftId) : null, G = c.startTime || (E ? E.start : ""), Q = c.endTime || (E ? E.end : "");
      c.shiftLabel = (G || "") + "-" + (Q || "");
    }
    e.updateStatus && e.updateStatus("Updated " + (c.lineCode || p.lineId)), N(), (w === "emp" || w === "position" || w === "shift" || w === "start" || w === "end") && e.renderCoverageBars && e.renderCoverageBars(), w === "team" && e.renderTeams && e.renderTeams(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function V(p) {
    if (!p) return;
    const c = e.findLineById ? e.findLineById(p.lineId) : null, w = Number(p.dayIndex);
    if (!c || !Number.isInteger(w) || w < 0 || w > 6) return;
    const f = u(w), D = String(c.id);
    e.state.schedule || (e.state.schedule = {});
    var b = e.state.schedule[D] || e.state.schedule[c.id];
    for (Array.isArray(b) || (b = []), e.state.schedule[D] = b; e.state.schedule[D].length < 7; ) e.state.schedule[D].push("RDO");
    e.state.functionRotation || (e.state.functionRotation = {}), !e.state.functionRotation[D] && e.state.functionRotation[c.id] && (e.state.functionRotation[D] = e.state.functionRotation[c.id]);
    const L = e.state.schedule[D][f] || "RDO", H = c.function === "BAG", E = _(c);
    if (L !== "WORK")
      e.state.schedule[D][f] = "WORK", H ? l(D, f, "BAG") : E ? l(D, f, "PAX") : l(D, f, null);
    else if (H)
      e.state.schedule[D][f] = "RDO", l(D, f, null);
    else if (E) {
      var G = typeof e.getRotationDuty == "function" ? e.getRotationDuty(c.id, f) : r(c.id, f), Q = G === "DFO" || G === "PAX" || !G ? "PAX" : G;
      Q === "PAX" ? l(D, f, "BAG") : (e.state.schedule[D][f] = "RDO", l(D, f, null));
    } else
      e.state.schedule[D][f] = "RDO", l(D, f, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(c), N(), e.renderCoverageBars && e.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function M(p) {
    if (!p) return;
    const c = e.findLineById ? e.findLineById(p.lineId) : null, w = Number(p.dayIndex), f = String(p.duty || "").toUpperCase();
    if (!c || !Number.isInteger(w) || w < 0 || w > 6) return;
    const D = u(w), b = String(c.id);
    e.state.schedule || (e.state.schedule = {}), Array.isArray(e.state.schedule[b]) || (e.state.schedule[b] = Array(7).fill("RDO")), f === "OFF" || f === "RDO" || f === "" ? (e.state.schedule[b][D] = "RDO", l(b, D, null)) : (e.state.schedule[b][D] = "WORK", f === "BAG" ? l(b, D, "BAG") : f === "DFO" ? l(b, D, "DFO") : f === "TRAINING" ? l(b, D, "TRAINING") : f === "-" ? l(b, D, "-") : l(b, D, "PAX")), e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(c), N(), e.renderCoverageBars && e.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function X(p) {
    if (!p) return;
    const c = e.findLineById ? e.findLineById(p.lineId) : null, w = Number(p.dayIndex), f = p.field, D = String(p.value || "").trim();
    if (!(!c || !Number.isInteger(w) || w < 0 || w > 6) && !(e.isValidTimeText && !e.isValidTimeText(D))) {
      var b = e.getShift ? e.getShift(c.shiftId) : null, L = c.startTime || (b ? b.start : "08:00"), H = c.endTime || (b ? b.end : "16:30");
      c.dayTimes || (c.dayTimes = {});
      var E = String(w), G = c.dayTimes[E] || { start: L, end: H };
      f === "start" ? c.dayTimes[E] = { start: D, end: G.end } : f === "end" && (c.dayTimes[E] = { start: G.start, end: D }), N(), e.renderCoverageBars && e.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
    }
  }
  function z(p) {
    p && (e.linesView || (e.linesView = {}), p.sortBy && (e.linesView.sortBy = p.sortBy), p.sortDir && (e.linesView.sortDir = p.sortDir), N());
  }
  function W(p) {
    p && (e.linesView || (e.linesView = {}), p.filterRole !== void 0 && (e.linesView.filterRole = p.filterRole), p.filterShift !== void 0 && (e.linesView.filterShift = p.filterShift), p.filterTeam !== void 0 && (e.linesView.filterTeam = p.filterTeam), p.filterSex !== void 0 && (e.linesView.filterSex = p.filterSex), p.filterDuty !== void 0 && (e.linesView.filterDuty = p.filterDuty), p.filterDay !== void 0 && (e.linesView.filterDay = p.filterDay), p.searchCode !== void 0 && (e.linesView.searchCode = p.searchCode), N());
  }
  const N = () => {
    try {
      const p = n._linesTableApp;
      if (p)
        O(p);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const c = h();
        typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), n._linesTableApp = new jn({
          target: n,
          props: {
            rows: Array.isArray(c) ? c : [],
            shiftOptions: y(),
            teamOptions: d(),
            exportStyle: F(),
            currentSortBy: e.linesView && e.linesView.sortBy || "role",
            currentSortDir: e.linesView && e.linesView.sortDir || "asc",
            filterRole: e.linesView && e.linesView.filterRole || "ALL",
            filterShift: e.linesView && e.linesView.filterShift || "",
            filterTeam: e.linesView && e.linesView.filterTeam || "",
            filterSex: e.linesView && e.linesView.filterSex || "",
            filterDuty: e.linesView && e.linesView.filterDuty || "",
            filterDay: e.linesView && e.linesView.filterDay || "",
            searchCode: e.linesView && e.linesView.searchCode || "",
            onInlineEdit: R,
            onDayToggle: V,
            onDayDutyEdit: M,
            onDayTimeEdit: X,
            onSort: z,
            onFilter: W
          }
        });
      }
    } catch (p) {
      console.error("lines-table: refresh failed", p);
    }
  };
  N(), e.bindLinesUI && e.bindLinesUI(), document.addEventListener("click", (p) => {
    const c = p.target.closest?.(".tab-btn");
    c && c.dataset.tab === "lines" && N();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((p) => {
    window.addEventListener(p, N);
  }), n.refresh = N;
}
export {
  tl as initLinesTable
};
