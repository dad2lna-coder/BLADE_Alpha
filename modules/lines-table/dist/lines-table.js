var It = Object.defineProperty;
var xt = (t, e, n) => e in t ? It(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Xe = (t, e, n) => xt(t, typeof e != "symbol" ? e + "" : e, n);
function Y() {
}
function St(t) {
  return t();
}
function at() {
  return /* @__PURE__ */ Object.create(null);
}
function me(t) {
  t.forEach(St);
}
function Ot(t) {
  return typeof t == "function";
}
function Ft(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Mt(t) {
  return Object.keys(t).length === 0;
}
function rt(t) {
  return t ?? "";
}
function s(t, e) {
  t.appendChild(e);
}
function Q(t, e, n) {
  t.insertBefore(e, n || null);
}
function H(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function He(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function h(t) {
  return document.createElement(t);
}
function X(t) {
  return document.createTextNode(t);
}
function x() {
  return X(" ");
}
function W(t, e, n, l) {
  return t.addEventListener(e, n, l), () => t.removeEventListener(e, n, l);
}
function f(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Bt(t) {
  return Array.from(t.childNodes);
}
function q(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function C(t, e) {
  t.value = e ?? "";
}
function J(t, e, n, l) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
function G(t, e, n) {
  for (let l = 0; l < t.options.length; l += 1) {
    const o = t.options[l];
    if (o.__value === e) {
      o.selected = !0;
      return;
    }
  }
  t.selectedIndex = -1;
}
let Ke;
function we(t) {
  Ke = t;
}
const ge = [], ut = [];
let ye = [];
const ft = [], Pt = /* @__PURE__ */ Promise.resolve();
let Ue = !1;
function Gt() {
  Ue || (Ue = !0, Pt.then(zt));
}
function We(t) {
  ye.push(t);
}
const je = /* @__PURE__ */ new Set();
let pe = 0;
function zt() {
  if (pe !== 0)
    return;
  const t = Ke;
  do {
    try {
      for (; pe < ge.length; ) {
        const e = ge[pe];
        pe++, we(e), Nt(e.$$);
      }
    } catch (e) {
      throw ge.length = 0, pe = 0, e;
    }
    for (we(null), ge.length = 0, pe = 0; ut.length; ) ut.pop()();
    for (let e = 0; e < ye.length; e += 1) {
      const n = ye[e];
      je.has(n) || (je.add(n), n());
    }
    ye.length = 0;
  } while (ge.length);
  for (; ft.length; )
    ft.pop()();
  Ue = !1, je.clear(), we(t);
}
function Nt(t) {
  if (t.fragment !== null) {
    t.update(), me(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(We);
  }
}
function Vt(t) {
  const e = [], n = [];
  ye.forEach((l) => t.indexOf(l) === -1 ? e.push(l) : n.push(l)), n.forEach((l) => l()), ye = e;
}
const Xt = /* @__PURE__ */ new Set();
function kt(t, e) {
  t && t.i && (Xt.delete(t), t.i(e));
}
function K(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function Ht(t, e) {
  t.d(1), e.delete(t.key);
}
function jt(t, e, n, l, o, i, _, R, O, y, v, m) {
  let w = t.length, k = i.length, A = w;
  const a = {};
  for (; A--; ) a[t[A].key] = A;
  const r = [], p = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), g = [];
  for (A = k; A--; ) {
    const z = m(o, i, A), L = n(z);
    let T = _.get(L);
    T ? g.push(() => T.p(z, e)) : (T = y(L, z), T.c()), p.set(L, r[A] = T), L in a && d.set(L, Math.abs(A - a[L]));
  }
  const b = /* @__PURE__ */ new Set(), B = /* @__PURE__ */ new Set();
  function V(z) {
    kt(z, 1), z.m(R, v), _.set(z.key, z), v = z.first, k--;
  }
  for (; w && k; ) {
    const z = r[k - 1], L = t[w - 1], T = z.key, j = L.key;
    z === L ? (v = z.first, w--, k--) : p.has(j) ? !_.has(T) || b.has(T) ? V(z) : B.has(j) ? w-- : d.get(T) > d.get(j) ? (B.add(T), V(z)) : (b.add(j), w--) : (O(L, _), w--);
  }
  for (; w--; ) {
    const z = t[w];
    p.has(z.key) || O(z, _);
  }
  for (; k; ) V(r[k - 1]);
  return me(g), r;
}
function Ut(t, e, n) {
  const { fragment: l, after_update: o } = t.$$;
  l && l.m(e, n), We(() => {
    const i = t.$$.on_mount.map(St).filter(Ot);
    t.$$.on_destroy ? t.$$.on_destroy.push(...i) : me(i), t.$$.on_mount = [];
  }), o.forEach(We);
}
function Wt(t, e) {
  const n = t.$$;
  n.fragment !== null && (Vt(n.after_update), me(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function Kt(t, e) {
  t.$$.dirty[0] === -1 && (ge.push(t), Gt(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function qt(t, e, n, l, o, i, _ = null, R = [-1]) {
  const O = Ke;
  we(t);
  const y = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: i,
    update: Y,
    not_equal: o,
    bound: at(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (O ? O.$$.context : [])),
    // everything else
    callbacks: at(),
    dirty: R,
    skip_bound: !1,
    root: e.target || O.$$.root
  };
  _ && _(y.root);
  let v = !1;
  if (y.ctx = n ? n(t, e.props || {}, (m, w, ...k) => {
    const A = k.length ? k[0] : w;
    return y.ctx && o(y.ctx[m], y.ctx[m] = A) && (!y.skip_bound && y.bound[m] && y.bound[m](A), v && Kt(t, m)), w;
  }) : [], y.update(), v = !0, me(y.before_update), y.fragment = l ? l(y.ctx) : !1, e.target) {
    if (e.hydrate) {
      const m = Bt(e.target);
      y.fragment && y.fragment.l(m), m.forEach(H);
    } else
      y.fragment && y.fragment.c();
    e.intro && kt(t.$$.fragment), Ut(t, e.target, e.anchor), zt();
  }
  we(O);
}
class Jt {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Xe(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Xe(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    Wt(this, 1), this.$destroy = Y;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, n) {
    if (!Ot(n))
      return Y;
    const l = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return l.push(n), () => {
      const o = l.indexOf(n);
      o !== -1 && l.splice(o, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !Mt(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const Qt = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Qt);
function dt(t, e, n) {
  const l = t.slice();
  return l[16] = e[n], l;
}
function ct(t, e, n) {
  const l = t.slice();
  return l[19] = e[n], l;
}
function _t(t, e, n) {
  const l = t.slice();
  return l[22] = e[n], l;
}
function ht(t, e, n) {
  const l = t.slice();
  return l[25] = e[n], l;
}
function Yt(t) {
  let e;
  return {
    c() {
      e = h("div"), e.textContent = "Classic Lines mode active", f(e, "class", "muted");
    },
    m(n, l) {
      Q(n, e, l);
    },
    p: Y,
    d(n) {
      n && H(e);
    }
  };
}
function Zt(t) {
  let e, n, l, o, i, _ = [], R = /* @__PURE__ */ new Map(), O = K(
    /*rows*/
    t[0]
  );
  const y = (m) => (
    /*row*/
    m[16].id
  );
  for (let m = 0; m < O.length; m += 1) {
    let w = dt(t, O, m), k = y(w);
    R.set(k, _[m] = mt(k, w));
  }
  let v = null;
  return O.length || (v = vt()), {
    c() {
      e = h("div"), n = h("table"), l = h("thead"), l.innerHTML = '<tr><th class="svelte-1yzw1rx">Team</th> <th class="svelte-1yzw1rx">Line</th> <th class="svelte-1yzw1rx">Shift</th> <th class="svelte-1yzw1rx">Start</th> <th class="svelte-1yzw1rx">End</th> <th class="svelte-1yzw1rx">Position</th> <th class="svelte-1yzw1rx">Emp</th> <th class="svelte-1yzw1rx">Sex</th> <th class="svelte-1yzw1rx">Function</th> <th class="svelte-1yzw1rx">RDOs</th> <th class="svelte-1yzw1rx">Paid</th> <th class="svelte-1yzw1rx">Sun</th> <th class="svelte-1yzw1rx">Mon</th> <th class="svelte-1yzw1rx">Tue</th> <th class="svelte-1yzw1rx">Wed</th> <th class="svelte-1yzw1rx">Thu</th> <th class="svelte-1yzw1rx">Fri</th> <th class="svelte-1yzw1rx">Sat</th> <th class="svelte-1yzw1rx">Hours</th></tr>', o = x(), i = h("tbody");
      for (let m = 0; m < _.length; m += 1)
        _[m].c();
      v && v.c(), f(n, "class", "data-table lines-editable svelte-1yzw1rx"), J(n, "width", "max-content"), J(n, "min-width", "1100px"), f(e, "class", "lines-virtual-root svelte-1yzw1rx"), J(e, "height", "100%"), J(e, "overflow", "auto"), J(e, "position", "relative");
    },
    m(m, w) {
      Q(m, e, w), s(e, n), s(n, l), s(n, o), s(n, i);
      for (let k = 0; k < _.length; k += 1)
        _[k] && _[k].m(i, null);
      v && v.m(i, null);
    },
    p(m, w) {
      w & /*rows, dayClass, emitDay, emitEdit, shiftOptions, shiftLabel, teamOptions*/
      61 && (O = K(
        /*rows*/
        m[0]
      ), _ = jt(_, w, y, 1, m, O, R, i, Ht, mt, null, dt), !O.length && v ? v.p(m, w) : O.length ? v && (v.d(1), v = null) : (v = vt(), v.c(), v.m(i, null)));
    },
    d(m) {
      m && H(e);
      for (let w = 0; w < _.length; w += 1)
        _[w].d();
      v && v.d();
    }
  };
}
function vt(t) {
  let e;
  return {
    c() {
      e = h("tr"), e.innerHTML = '<td colspan="19" class="muted svelte-1yzw1rx">No lines — Generate or Import first.</td>';
    },
    m(n, l) {
      Q(n, e, l);
    },
    p: Y,
    d(n) {
      n && H(e);
    }
  };
}
function pt(t) {
  let e, n = (
    /*team*/
    (t[25].name ?? /*team*/
    t[25].id) + ""
  ), l, o;
  return {
    c() {
      e = h("option"), l = X(n), e.__value = o = /*team*/
      t[25].id, C(e, e.__value);
    },
    m(i, _) {
      Q(i, e, _), s(e, l);
    },
    p(i, _) {
      _ & /*teamOptions*/
      8 && n !== (n = /*team*/
      (i[25].name ?? /*team*/
      i[25].id) + "") && q(l, n), _ & /*teamOptions*/
      8 && o !== (o = /*team*/
      i[25].id) && (e.__value = o, C(e, e.__value));
    },
    d(i) {
      i && H(e);
    }
  };
}
function gt(t) {
  let e, n = wt(
    /*shift*/
    t[22]
  ) + "", l, o;
  return {
    c() {
      e = h("option"), l = X(n), e.__value = o = /*shift*/
      t[22].id, C(e, e.__value);
    },
    m(i, _) {
      Q(i, e, _), s(e, l);
    },
    p(i, _) {
      _ & /*shiftOptions*/
      4 && n !== (n = wt(
        /*shift*/
        i[22]
      ) + "") && q(l, n), _ & /*shiftOptions*/
      4 && o !== (o = /*shift*/
      i[22].id) && (e.__value = o, C(e, e.__value));
    },
    d(i) {
      i && H(e);
    }
  };
}
function yt(t) {
  let e, n = (
    /*row*/
    (t[16]?.days?.[
      /*i*/
      t[19]
    ] ?? "") + ""
  ), l, o, i, _, R;
  function O() {
    return (
      /*click_handler*/
      t[15](
        /*row*/
        t[16],
        /*i*/
        t[19]
      )
    );
  }
  return {
    c() {
      e = h("td"), l = X(n), f(e, "class", o = rt(bt(
        /*row*/
        t[16]?.dayDuties?.[
          /*i*/
          t[19]
        ] ?? /*row*/
        t[16]?.days?.[
          /*i*/
          t[19]
        ]
      )) + " svelte-1yzw1rx"), f(e, "data-line-id", i = /*row*/
      t[16]?.id), f(
        e,
        "data-day-index",
        /*i*/
        t[19]
      );
    },
    m(y, v) {
      Q(y, e, v), s(e, l), _ || (R = W(e, "click", O), _ = !0);
    },
    p(y, v) {
      t = y, v & /*rows*/
      1 && n !== (n = /*row*/
      (t[16]?.days?.[
        /*i*/
        t[19]
      ] ?? "") + "") && q(l, n), v & /*rows, teamOptions*/
      9 && o !== (o = rt(bt(
        /*row*/
        t[16]?.dayDuties?.[
          /*i*/
          t[19]
        ] ?? /*row*/
        t[16]?.days?.[
          /*i*/
          t[19]
        ]
      )) + " svelte-1yzw1rx") && f(e, "class", o), v & /*rows, teamOptions*/
      9 && i !== (i = /*row*/
      t[16]?.id) && f(e, "data-line-id", i);
    },
    d(y) {
      y && H(e), _ = !1, R();
    }
  };
}
function mt(t, e) {
  let n, l, o, i, _, R, O, y, v, m, w, k, A, a, r, p, d, g, b, B = (
    /*row*/
    (e[16]?.start ?? "") + ""
  ), V, z, L, T = (
    /*row*/
    (e[16]?.end ?? "") + ""
  ), j, qe, be, F, Z, $, ee, te, Se, Je, Qe, Oe, I, ne, le, ie, se, oe, ze, Ye, Ze, ke, P, ae, re, ue, Ae, $e, et, Ce, M, fe, de, ce, _e, Re, tt, nt, Le, Te = (
    /*row*/
    (e[16]?.rdos ?? "—") + ""
  ), Me, lt, Ee, De = (
    /*row*/
    (e[16]?.paid ?? "") + ""
  ), Be, it, Pe, Ie, xe = (
    /*row*/
    (e[16]?.hours ?? "") + ""
  ), Ge, st, Fe, Ne, ot, he = K(
    /*teamOptions*/
    e[3]
  ), E = [];
  for (let c = 0; c < he.length; c += 1)
    E[c] = pt(ht(e, he, c));
  function At(...c) {
    return (
      /*change_handler*/
      e[8](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  function Ct(...c) {
    return (
      /*input_handler*/
      e[9](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  let ve = K(
    /*shiftOptions*/
    e[2]
  ), D = [];
  for (let c = 0; c < ve.length; c += 1)
    D[c] = gt(_t(e, ve, c));
  function Rt(...c) {
    return (
      /*change_handler_1*/
      e[10](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  function Lt(...c) {
    return (
      /*change_handler_2*/
      e[11](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  function Tt(...c) {
    return (
      /*change_handler_3*/
      e[12](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  function Et(...c) {
    return (
      /*change_handler_4*/
      e[13](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  function Dt(...c) {
    return (
      /*change_handler_5*/
      e[14](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  let Ve = K([0, 1, 2, 3, 4, 5, 6]), N = [];
  for (let c = 0; c < 7; c += 1)
    N[c] = yt(ct(e, Ve, c));
  return {
    key: t,
    first: null,
    c() {
      n = h("tr"), l = h("td"), o = h("select"), i = h("option"), i.textContent = "—";
      for (let c = 0; c < E.length; c += 1)
        E[c].c();
      O = x(), y = h("td"), v = h("input"), k = x(), A = h("td"), a = h("select"), r = h("option"), r.textContent = "—";
      for (let c = 0; c < D.length; c += 1)
        D[c].c();
      g = x(), b = h("td"), V = X(B), z = x(), L = h("td"), j = X(T), qe = x(), be = h("td"), F = h("select"), Z = h("option"), Z.textContent = "—", $ = h("option"), $.textContent = "TSO", ee = h("option"), ee.textContent = "LTSO", te = h("option"), te.textContent = "STSO", Qe = x(), Oe = h("td"), I = h("select"), ne = h("option"), ne.textContent = "—", le = h("option"), le.textContent = "FT", ie = h("option"), ie.textContent = "PT", se = h("option"), se.textContent = "LTSO", oe = h("option"), oe.textContent = "STSO", Ze = x(), ke = h("td"), P = h("select"), ae = h("option"), ae.textContent = "—", re = h("option"), re.textContent = "M", ue = h("option"), ue.textContent = "F", et = x(), Ce = h("td"), M = h("select"), fe = h("option"), fe.textContent = "—", de = h("option"), de.textContent = "DFO", ce = h("option"), ce.textContent = "BAG", _e = h("option"), _e.textContent = "PAX", nt = x(), Le = h("td"), Me = X(Te), lt = x(), Ee = h("td"), Be = X(De), it = x();
      for (let c = 0; c < 7; c += 1)
        N[c].c();
      Pe = x(), Ie = h("td"), Ge = X(xe), st = x(), i.__value = "", C(i, i.__value), f(o, "class", "line-edit svelte-1yzw1rx"), f(o, "data-field", "team"), f(o, "data-line-id", _ = /*row*/
      e[16]?.id), f(l, "class", "svelte-1yzw1rx"), f(v, "type", "text"), f(v, "class", "line-edit line-code-input svelte-1yzw1rx"), f(v, "data-field", "lineCode"), f(v, "data-line-id", m = /*row*/
      e[16]?.id), v.value = w = /*row*/
      e[16]?.line ?? "", f(y, "class", "svelte-1yzw1rx"), r.__value = "", C(r, r.__value), f(a, "class", "line-edit svelte-1yzw1rx"), f(a, "data-field", "shift"), f(a, "data-line-id", p = /*row*/
      e[16]?.id), f(A, "class", "svelte-1yzw1rx"), f(b, "class", "svelte-1yzw1rx"), f(L, "class", "svelte-1yzw1rx"), Z.__value = "", C(Z, Z.__value), $.__value = "TSO", C($, $.__value), ee.__value = "LTSO", C(ee, ee.__value), te.__value = "STSO", C(te, te.__value), f(F, "class", "line-edit svelte-1yzw1rx"), f(F, "data-field", "position"), f(F, "data-line-id", Se = /*row*/
      e[16]?.id), f(be, "class", "svelte-1yzw1rx"), ne.__value = "", C(ne, ne.__value), le.__value = "FT", C(le, le.__value), ie.__value = "PT", C(ie, ie.__value), se.__value = "LTSO", C(se, se.__value), oe.__value = "STSO", C(oe, oe.__value), f(I, "class", "line-edit svelte-1yzw1rx"), f(I, "data-field", "emp"), f(I, "data-line-id", ze = /*row*/
      e[16]?.id), f(Oe, "class", "svelte-1yzw1rx"), ae.__value = "", C(ae, ae.__value), re.__value = "M", C(re, re.__value), ue.__value = "F", C(ue, ue.__value), f(P, "class", "line-edit svelte-1yzw1rx"), f(P, "data-field", "sex"), f(P, "data-line-id", Ae = /*row*/
      e[16]?.id), f(ke, "class", "svelte-1yzw1rx"), fe.__value = "", C(fe, fe.__value), de.__value = "DFO", C(de, de.__value), ce.__value = "BAG", C(ce, ce.__value), _e.__value = "PAX", C(_e, _e.__value), f(M, "class", "line-edit svelte-1yzw1rx"), f(M, "data-field", "function"), f(M, "data-line-id", Re = /*row*/
      e[16]?.id), f(Ce, "class", "svelte-1yzw1rx"), f(Le, "class", "line-rdo-cell svelte-1yzw1rx"), f(Ee, "class", "svelte-1yzw1rx"), f(Ie, "class", "line-hours svelte-1yzw1rx"), f(n, "data-line-row", Fe = /*row*/
      e[16]?.id), this.first = n;
    },
    m(c, S) {
      Q(c, n, S), s(n, l), s(l, o), s(o, i);
      for (let u = 0; u < E.length; u += 1)
        E[u] && E[u].m(o, null);
      G(
        o,
        /*row*/
        e[16]?.teamId ?? ""
      ), s(n, O), s(n, y), s(y, v), s(n, k), s(n, A), s(A, a), s(a, r);
      for (let u = 0; u < D.length; u += 1)
        D[u] && D[u].m(a, null);
      G(
        a,
        /*row*/
        e[16]?.shiftId ?? ""
      ), s(n, g), s(n, b), s(b, V), s(n, z), s(n, L), s(L, j), s(n, qe), s(n, be), s(be, F), s(F, Z), s(F, $), s(F, ee), s(F, te), G(
        F,
        /*row*/
        e[16]?.position ?? ""
      ), s(n, Qe), s(n, Oe), s(Oe, I), s(I, ne), s(I, le), s(I, ie), s(I, se), s(I, oe), G(
        I,
        /*row*/
        e[16]?.emp ?? ""
      ), s(n, Ze), s(n, ke), s(ke, P), s(P, ae), s(P, re), s(P, ue), G(
        P,
        /*row*/
        e[16]?.sex ?? ""
      ), s(n, et), s(n, Ce), s(Ce, M), s(M, fe), s(M, de), s(M, ce), s(M, _e), G(
        M,
        /*row*/
        e[16]?.function ?? ""
      ), s(n, nt), s(n, Le), s(Le, Me), s(n, lt), s(n, Ee), s(Ee, Be), s(n, it);
      for (let u = 0; u < 7; u += 1)
        N[u] && N[u].m(n, null);
      s(n, Pe), s(n, Ie), s(Ie, Ge), s(n, st), Ne || (ot = [
        W(o, "change", At),
        W(v, "input", Ct),
        W(a, "change", Rt),
        W(F, "change", Lt),
        W(I, "change", Tt),
        W(P, "change", Et),
        W(M, "change", Dt)
      ], Ne = !0);
    },
    p(c, S) {
      if (e = c, S & /*teamOptions*/
      8) {
        he = K(
          /*teamOptions*/
          e[3]
        );
        let u;
        for (u = 0; u < he.length; u += 1) {
          const U = ht(e, he, u);
          E[u] ? E[u].p(U, S) : (E[u] = pt(U), E[u].c(), E[u].m(o, null));
        }
        for (; u < E.length; u += 1)
          E[u].d(1);
        E.length = he.length;
      }
      if (S & /*rows, teamOptions*/
      9 && _ !== (_ = /*row*/
      e[16]?.id) && f(o, "data-line-id", _), S & /*rows, teamOptions*/
      9 && R !== (R = /*row*/
      e[16]?.teamId ?? "") && G(
        o,
        /*row*/
        e[16]?.teamId ?? ""
      ), S & /*rows, teamOptions*/
      9 && m !== (m = /*row*/
      e[16]?.id) && f(v, "data-line-id", m), S & /*rows, teamOptions*/
      9 && w !== (w = /*row*/
      e[16]?.line ?? "") && v.value !== w && (v.value = w), S & /*shiftOptions, shiftLabel*/
      4) {
        ve = K(
          /*shiftOptions*/
          e[2]
        );
        let u;
        for (u = 0; u < ve.length; u += 1) {
          const U = _t(e, ve, u);
          D[u] ? D[u].p(U, S) : (D[u] = gt(U), D[u].c(), D[u].m(a, null));
        }
        for (; u < D.length; u += 1)
          D[u].d(1);
        D.length = ve.length;
      }
      if (S & /*rows, teamOptions*/
      9 && p !== (p = /*row*/
      e[16]?.id) && f(a, "data-line-id", p), S & /*rows, teamOptions*/
      9 && d !== (d = /*row*/
      e[16]?.shiftId ?? "") && G(
        a,
        /*row*/
        e[16]?.shiftId ?? ""
      ), S & /*rows*/
      1 && B !== (B = /*row*/
      (e[16]?.start ?? "") + "") && q(V, B), S & /*rows*/
      1 && T !== (T = /*row*/
      (e[16]?.end ?? "") + "") && q(j, T), S & /*rows, teamOptions*/
      9 && Se !== (Se = /*row*/
      e[16]?.id) && f(F, "data-line-id", Se), S & /*rows, teamOptions*/
      9 && Je !== (Je = /*row*/
      e[16]?.position ?? "") && G(
        F,
        /*row*/
        e[16]?.position ?? ""
      ), S & /*rows, teamOptions*/
      9 && ze !== (ze = /*row*/
      e[16]?.id) && f(I, "data-line-id", ze), S & /*rows, teamOptions*/
      9 && Ye !== (Ye = /*row*/
      e[16]?.emp ?? "") && G(
        I,
        /*row*/
        e[16]?.emp ?? ""
      ), S & /*rows, teamOptions*/
      9 && Ae !== (Ae = /*row*/
      e[16]?.id) && f(P, "data-line-id", Ae), S & /*rows, teamOptions*/
      9 && $e !== ($e = /*row*/
      e[16]?.sex ?? "") && G(
        P,
        /*row*/
        e[16]?.sex ?? ""
      ), S & /*rows, teamOptions*/
      9 && Re !== (Re = /*row*/
      e[16]?.id) && f(M, "data-line-id", Re), S & /*rows, teamOptions*/
      9 && tt !== (tt = /*row*/
      e[16]?.function ?? "") && G(
        M,
        /*row*/
        e[16]?.function ?? ""
      ), S & /*rows*/
      1 && Te !== (Te = /*row*/
      (e[16]?.rdos ?? "—") + "") && q(Me, Te), S & /*rows*/
      1 && De !== (De = /*row*/
      (e[16]?.paid ?? "") + "") && q(Be, De), S & /*dayClass, rows, emitDay*/
      33) {
        Ve = K([0, 1, 2, 3, 4, 5, 6]);
        let u;
        for (u = 0; u < 7; u += 1) {
          const U = ct(e, Ve, u);
          N[u] ? N[u].p(U, S) : (N[u] = yt(U), N[u].c(), N[u].m(n, Pe));
        }
        for (; u < 7; u += 1)
          N[u].d(1);
      }
      S & /*rows*/
      1 && xe !== (xe = /*row*/
      (e[16]?.hours ?? "") + "") && q(Ge, xe), S & /*rows, teamOptions*/
      9 && Fe !== (Fe = /*row*/
      e[16]?.id) && f(n, "data-line-row", Fe);
    },
    d(c) {
      c && H(n), He(E, c), He(D, c), He(N, c), Ne = !1, me(ot);
    }
  };
}
function $t(t) {
  let e;
  function n(i, _) {
    return (
      /*mode*/
      i[1] === "svelte" ? Zt : Yt
    );
  }
  let l = n(t), o = l(t);
  return {
    c() {
      e = h("div"), o.c(), f(e, "class", "lines-table-root svelte-1yzw1rx"), J(e, "min-height", "min(70vh, 720px)"), J(e, "height", "min(70vh, 720px)"), J(e, "width", "100%");
    },
    m(i, _) {
      Q(i, e, _), o.m(e, null);
    },
    p(i, [_]) {
      l === (l = n(i)) && o ? o.p(i, _) : (o.d(1), o = l(i), o && (o.c(), o.m(e, null)));
    },
    i: Y,
    o: Y,
    d(i) {
      i && H(e), o.d();
    }
  };
}
function wt(t) {
  if (!t) return "";
  const e = t.name || t.id || "";
  return t.start && t.end ? (e ? e + " " : "") + "(" + t.start + "–" + t.end + ")" : t.start ? e ? e + " " + t.start : t.start : e;
}
function bt(t) {
  const e = String(t || "").toUpperCase();
  return e === "RDO" || e === "—" ? "cell-toggle cell-rdo" : e === "BAG" ? "cell-toggle cell-function-duty cell-bag" : e === "PAX" ? "cell-toggle cell-function-duty cell-pax" : "cell-toggle cell-work";
}
function en(t, e, n) {
  let { rows: l = [] } = e, { mode: o = "svelte" } = e, { shiftOptions: i = [] } = e, { teamOptions: _ = [] } = e, { onInlineEdit: R = null } = e, { onDayToggle: O = null } = e;
  function y(g, b, B) {
    R?.({ lineId: g, field: b, value: B });
  }
  function v(g, b) {
    O?.({ lineId: g, dayIndex: b });
  }
  const m = (g, b) => y(g?.id, "team", b.target.value), w = (g, b) => y(g?.id, "lineCode", b.target.value), k = (g, b) => y(g?.id, "shift", b.target.value), A = (g, b) => y(g?.id, "position", b.target.value), a = (g, b) => y(g?.id, "emp", b.target.value), r = (g, b) => y(g?.id, "sex", b.target.value), p = (g, b) => y(g?.id, "function", b.target.value), d = (g, b) => v(g?.id, b);
  return t.$$set = (g) => {
    "rows" in g && n(0, l = g.rows), "mode" in g && n(1, o = g.mode), "shiftOptions" in g && n(2, i = g.shiftOptions), "teamOptions" in g && n(3, _ = g.teamOptions), "onInlineEdit" in g && n(6, R = g.onInlineEdit), "onDayToggle" in g && n(7, O = g.onDayToggle);
  }, [
    l,
    o,
    i,
    _,
    y,
    v,
    R,
    O,
    m,
    w,
    k,
    A,
    a,
    r,
    p,
    d
  ];
}
class tn extends Jt {
  constructor(e) {
    super(), qt(this, e, en, $t, Ft, {
      rows: 0,
      mode: 1,
      shiftOptions: 2,
      teamOptions: 3,
      onInlineEdit: 6,
      onDayToggle: 7
    });
  }
}
function ln(t) {
  const e = t || window.Scheduler;
  if (!e) return;
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
  function l() {
    return {
      teamResolver: typeof e.teamMetaForLine == "function" ? e.teamMetaForLine : null,
      shiftResolver: typeof e.getShift == "function" ? e.getShift : null,
      rotationDutyResolver: typeof e.getRotationDuty == "function" ? e.getRotationDuty : o
    };
  }
  function o(a, r) {
    const p = String(a), d = e.state && e.state.functionRotation, g = d && (d[p] || d[a]);
    if (!Array.isArray(g)) return null;
    const b = g[r];
    return b === "BAG" ? "BAG" : b === "PAX" || b === "DFO" ? "PAX" : null;
  }
  function i(a, r, p) {
    var d = String(a);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[d] || (e.state.functionRotation[d] = []); e.state.functionRotation[d].length <= r; ) e.state.functionRotation[d].push(null);
    e.state.functionRotation[d][r] = p;
  }
  function _(a) {
    if (!a) return !1;
    if (a.function === "DFO") return !0;
    const r = a.functionEligible;
    return !!(r && (r.dfo === !0 || r.DFO === !0));
  }
  function R() {
    const a = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], r = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(a)) : a, p = e.state && e.state.schedule || {}, d = typeof e.getRowModels == "function" ? e.getRowModels(r, p, l()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(l()) : [];
    return Array.isArray(d) ? d : [];
  }
  function O() {
    return e.teams && Array.isArray(e.teams.teams) ? e.teams.teams : [];
  }
  function y() {
    return e.state && Array.isArray(e.state.shifts) ? e.state.shifts : [];
  }
  function v() {
    return typeof e.getExportStyle == "function" ? e.getExportStyle() : e.state && e.state.exportStyle || null;
  }
  function m(a) {
    if (!a || typeof a.$set != "function") return;
    const r = R();
    typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), a.$set({
      rows: Array.isArray(r) ? r : [],
      shiftOptions: y(),
      teamOptions: O(),
      exportStyle: v()
    });
  }
  function w(a) {
    if (!a) return;
    const r = e.findLineById ? e.findLineById(a.lineId) : null;
    if (!r) return;
    const p = a.field, d = a.value;
    p === "lineCode" ? r.lineCode = String(d || "").trim() || r.lineCode : p === "sex" ? r.sex = d === "F" ? "F" : "M" : p === "function" ? r.function = d === "DFO" || d === "PAX" || d === "BAG" ? d : "" : p === "emp" || p === "position" ? e.applyLineEmp && e.applyLineEmp(r, d) : p === "shift" ? e.applyLineShift && e.applyLineShift(r, d) : p === "team" && e.setLineTeam && e.setLineTeam(a.lineId, d), e.updateStatus && e.updateStatus("Updated " + (r.lineCode || a.lineId)), A(), (p === "emp" || p === "position" || p === "shift") && e.renderCoverageBars && e.renderCoverageBars(), p === "team" && e.renderTeams && e.renderTeams();
  }
  function k(a) {
    if (!a) return;
    const r = e.findLineById ? e.findLineById(a.lineId) : null, p = Number(a.dayIndex);
    if (!r || !Number.isInteger(p) || p < 0 || p > 6) return;
    const d = String(r.id);
    e.state.schedule || (e.state.schedule = {});
    var g = e.state.schedule[d] || e.state.schedule[r.id];
    for (Array.isArray(g) || (g = []), e.state.schedule[d] = g; e.state.schedule[d].length < 7; ) e.state.schedule[d].push("RDO");
    e.state.functionRotation || (e.state.functionRotation = {}), !e.state.functionRotation[d] && e.state.functionRotation[r.id] && (e.state.functionRotation[d] = e.state.functionRotation[r.id]);
    const b = e.state.schedule[d][p] || "RDO", B = r.function === "BAG", V = _(r);
    if (b !== "WORK")
      e.state.schedule[d][p] = "WORK", B ? i(d, p, "BAG") : V ? i(d, p, "PAX") : i(d, p, null);
    else if (B)
      e.state.schedule[d][p] = "RDO", i(d, p, null);
    else if (V) {
      var z = typeof e.getRotationDuty == "function" ? e.getRotationDuty(r.id, p) : o(r.id, p), L = z === "DFO" || z === "PAX" || !z ? "PAX" : z;
      L === "PAX" ? i(d, p, "BAG") : (e.state.schedule[d][p] = "RDO", i(d, p, null));
    } else
      e.state.schedule[d][p] = "RDO", i(d, p, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(r), A(), e.renderCoverageBars && e.renderCoverageBars();
  }
  const A = () => {
    try {
      const a = n._linesTableApp;
      if (a)
        m(a);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const r = R();
        typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), n._linesTableApp = new tn({
          target: n,
          props: {
            rows: Array.isArray(r) ? r : [],
            shiftOptions: y(),
            teamOptions: O(),
            exportStyle: v(),
            onInlineEdit: w,
            onDayToggle: k
          }
        });
      }
    } catch (a) {
      console.error("lines-table: refresh failed", a);
    }
  };
  A(), document.addEventListener("click", (a) => {
    const r = a.target.closest?.(".tab-btn");
    r && r.dataset.tab === "lines" && A();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((a) => {
    window.addEventListener(a, A);
  }), n.refresh = A;
}
export {
  ln as initLinesTable
};
