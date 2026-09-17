var Dt = Object.defineProperty;
var Ft = (t, e, n) => e in t ? Dt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ve = (t, e, n) => Ft(t, typeof e != "symbol" ? e + "" : e, n);
function Y() {
}
function zt(t) {
  return t();
}
function at() {
  return /* @__PURE__ */ Object.create(null);
}
function me(t) {
  t.forEach(zt);
}
function St(t) {
  return typeof t == "function";
}
function Mt(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Bt(t) {
  return Object.keys(t).length === 0;
}
function rt(t) {
  return t ?? "";
}
function s(t, e) {
  t.appendChild(e);
}
function J(t, e, n) {
  t.insertBefore(e, n || null);
}
function V(t) {
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
function F() {
  return X(" ");
}
function U(t, e, n, l) {
  return t.addEventListener(e, n, l), () => t.removeEventListener(e, n, l);
}
function f(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function xt(t) {
  return Array.from(t.childNodes);
}
function K(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function O(t, e) {
  t.value = e ?? "";
}
function q(t, e, n, l) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
function N(t, e, n) {
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
function Nt() {
  Ue || (Ue = !0, Pt.then(kt));
}
function We(t) {
  ye.push(t);
}
const je = /* @__PURE__ */ new Set();
let pe = 0;
function kt() {
  if (pe !== 0)
    return;
  const t = Ke;
  do {
    try {
      for (; pe < ge.length; ) {
        const e = ge[pe];
        pe++, we(e), Gt(e.$$);
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
function Gt(t) {
  if (t.fragment !== null) {
    t.update(), me(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(We);
  }
}
function Xt(t) {
  const e = [], n = [];
  ye.forEach((l) => t.indexOf(l) === -1 ? e.push(l) : n.push(l)), n.forEach((l) => l()), ye = e;
}
const Vt = /* @__PURE__ */ new Set();
function Ot(t, e) {
  t && t.i && (Vt.delete(t), t.i(e));
}
function W(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function Ht(t, e) {
  t.d(1), e.delete(t.key);
}
function jt(t, e, n, l, o, i, _, T, k, g, p, m) {
  let w = t.length, b = i.length, r = w;
  const a = {};
  for (; r--; ) a[t[r].key] = r;
  const d = [], v = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), y = [];
  for (r = b; r--; ) {
    const L = m(o, i, r), C = n(L);
    let R = _.get(C);
    R ? y.push(() => R.p(L, e)) : (R = g(C, L), R.c()), v.set(C, d[r] = R), C in a && I.set(C, Math.abs(r - a[C]));
  }
  const z = /* @__PURE__ */ new Set(), x = /* @__PURE__ */ new Set();
  function Q(L) {
    Ot(L, 1), L.m(T, p), _.set(L.key, L), p = L.first, b--;
  }
  for (; w && b; ) {
    const L = d[b - 1], C = t[w - 1], R = L.key, H = C.key;
    L === C ? (p = L.first, w--, b--) : v.has(H) ? !_.has(R) || z.has(R) ? Q(L) : x.has(H) ? w-- : I.get(R) > I.get(H) ? (x.add(R), Q(L)) : (z.add(H), w--) : (k(C, _), w--);
  }
  for (; w--; ) {
    const L = t[w];
    v.has(L.key) || k(L, _);
  }
  for (; b; ) Q(d[b - 1]);
  return me(y), d;
}
function Ut(t, e, n) {
  const { fragment: l, after_update: o } = t.$$;
  l && l.m(e, n), We(() => {
    const i = t.$$.on_mount.map(zt).filter(St);
    t.$$.on_destroy ? t.$$.on_destroy.push(...i) : me(i), t.$$.on_mount = [];
  }), o.forEach(We);
}
function Wt(t, e) {
  const n = t.$$;
  n.fragment !== null && (Xt(n.after_update), me(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function Kt(t, e) {
  t.$$.dirty[0] === -1 && (ge.push(t), Nt(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function qt(t, e, n, l, o, i, _ = null, T = [-1]) {
  const k = Ke;
  we(t);
  const g = t.$$ = {
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
    context: new Map(e.context || (k ? k.$$.context : [])),
    // everything else
    callbacks: at(),
    dirty: T,
    skip_bound: !1,
    root: e.target || k.$$.root
  };
  _ && _(g.root);
  let p = !1;
  if (g.ctx = n ? n(t, e.props || {}, (m, w, ...b) => {
    const r = b.length ? b[0] : w;
    return g.ctx && o(g.ctx[m], g.ctx[m] = r) && (!g.skip_bound && g.bound[m] && g.bound[m](r), p && Kt(t, m)), w;
  }) : [], g.update(), p = !0, me(g.before_update), g.fragment = l ? l(g.ctx) : !1, e.target) {
    if (e.hydrate) {
      const m = xt(e.target);
      g.fragment && g.fragment.l(m), m.forEach(V);
    } else
      g.fragment && g.fragment.c();
    e.intro && Ot(t.$$.fragment), Ut(t, e.target, e.anchor), kt();
  }
  we(k);
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
    Ve(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Ve(this, "$$set");
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
    if (!St(n))
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
    this.$$set && !Bt(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
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
      J(n, e, l);
    },
    p: Y,
    d(n) {
      n && V(e);
    }
  };
}
function Zt(t) {
  let e, n, l, o, i, _ = [], T = /* @__PURE__ */ new Map(), k = W(
    /*rows*/
    t[0]
  );
  const g = (m) => (
    /*row*/
    m[16].id
  );
  for (let m = 0; m < k.length; m += 1) {
    let w = dt(t, k, m), b = g(w);
    T.set(b, _[m] = mt(b, w));
  }
  let p = null;
  return k.length || (p = vt()), {
    c() {
      e = h("div"), n = h("table"), l = h("thead"), l.innerHTML = '<tr><th class="svelte-1yzw1rx">Team</th> <th class="svelte-1yzw1rx">Line</th> <th class="svelte-1yzw1rx">Shift</th> <th class="svelte-1yzw1rx">Start</th> <th class="svelte-1yzw1rx">End</th> <th class="svelte-1yzw1rx">Position</th> <th class="svelte-1yzw1rx">Emp</th> <th class="svelte-1yzw1rx">Sex</th> <th class="svelte-1yzw1rx">Function</th> <th class="svelte-1yzw1rx">RDOs</th> <th class="svelte-1yzw1rx">Paid</th> <th class="svelte-1yzw1rx">Sun</th> <th class="svelte-1yzw1rx">Mon</th> <th class="svelte-1yzw1rx">Tue</th> <th class="svelte-1yzw1rx">Wed</th> <th class="svelte-1yzw1rx">Thu</th> <th class="svelte-1yzw1rx">Fri</th> <th class="svelte-1yzw1rx">Sat</th> <th class="svelte-1yzw1rx">Hours</th></tr>', o = F(), i = h("tbody");
      for (let m = 0; m < _.length; m += 1)
        _[m].c();
      p && p.c(), f(n, "class", "data-table lines-editable svelte-1yzw1rx"), q(n, "width", "max-content"), q(n, "min-width", "1100px"), f(e, "class", "lines-virtual-root svelte-1yzw1rx"), q(e, "height", "100%"), q(e, "overflow", "auto"), q(e, "position", "relative");
    },
    m(m, w) {
      J(m, e, w), s(e, n), s(n, l), s(n, o), s(n, i);
      for (let b = 0; b < _.length; b += 1)
        _[b] && _[b].m(i, null);
      p && p.m(i, null);
    },
    p(m, w) {
      w & /*rows, dayClass, emitDay, emitEdit, shiftOptions, shiftLabel, teamOptions*/
      61 && (k = W(
        /*rows*/
        m[0]
      ), _ = jt(_, w, g, 1, m, k, T, i, Ht, mt, null, dt), !k.length && p ? p.p(m, w) : k.length ? p && (p.d(1), p = null) : (p = vt(), p.c(), p.m(i, null)));
    },
    d(m) {
      m && V(e);
      for (let w = 0; w < _.length; w += 1)
        _[w].d();
      p && p.d();
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
      J(n, e, l);
    },
    p: Y,
    d(n) {
      n && V(e);
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
      t[25].id, O(e, e.__value);
    },
    m(i, _) {
      J(i, e, _), s(e, l);
    },
    p(i, _) {
      _ & /*teamOptions*/
      8 && n !== (n = /*team*/
      (i[25].name ?? /*team*/
      i[25].id) + "") && K(l, n), _ & /*teamOptions*/
      8 && o !== (o = /*team*/
      i[25].id) && (e.__value = o, O(e, e.__value));
    },
    d(i) {
      i && V(e);
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
      t[22].id, O(e, e.__value);
    },
    m(i, _) {
      J(i, e, _), s(e, l);
    },
    p(i, _) {
      _ & /*shiftOptions*/
      4 && n !== (n = wt(
        /*shift*/
        i[22]
      ) + "") && K(l, n), _ & /*shiftOptions*/
      4 && o !== (o = /*shift*/
      i[22].id) && (e.__value = o, O(e, e.__value));
    },
    d(i) {
      i && V(e);
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
  ), l, o, i, _, T;
  function k() {
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
    m(g, p) {
      J(g, e, p), s(e, l), _ || (T = U(e, "click", k), _ = !0);
    },
    p(g, p) {
      t = g, p & /*rows*/
      1 && n !== (n = /*row*/
      (t[16]?.days?.[
        /*i*/
        t[19]
      ] ?? "") + "") && K(l, n), p & /*rows, teamOptions*/
      9 && o !== (o = rt(bt(
        /*row*/
        t[16]?.days?.[
          /*i*/
          t[19]
        ]
      )) + " svelte-1yzw1rx") && f(e, "class", o), p & /*rows, teamOptions*/
      9 && i !== (i = /*row*/
      t[16]?.id) && f(e, "data-line-id", i);
    },
    d(g) {
      g && V(e), _ = !1, T();
    }
  };
}
function mt(t, e) {
  let n, l, o, i, _, T, k, g, p, m, w, b, r, a, d, v, I, y, z, x = (
    /*row*/
    (e[16]?.start ?? "") + ""
  ), Q, L, C, R = (
    /*row*/
    (e[16]?.end ?? "") + ""
  ), H, qe, be, M, Z, $, ee, te, ze, Je, Qe, Se, D, ne, le, ie, se, oe, ke, Ye, Ze, Oe, P, ae, re, ue, Le, $e, et, Te, B, fe, de, ce, _e, Ce, tt, nt, Re, Ae = (
    /*row*/
    (e[16]?.rdos ?? "—") + ""
  ), Be, lt, Ee, Ie = (
    /*row*/
    (e[16]?.paid ?? "") + ""
  ), xe, it, Pe, De, Fe = (
    /*row*/
    (e[16]?.hours ?? "") + ""
  ), Ne, st, Me, Ge, ot, he = W(
    /*teamOptions*/
    e[3]
  ), A = [];
  for (let c = 0; c < he.length; c += 1)
    A[c] = pt(ht(e, he, c));
  function Lt(...c) {
    return (
      /*change_handler*/
      e[8](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  function Tt(...c) {
    return (
      /*input_handler*/
      e[9](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  let ve = W(
    /*shiftOptions*/
    e[2]
  ), E = [];
  for (let c = 0; c < ve.length; c += 1)
    E[c] = gt(_t(e, ve, c));
  function Ct(...c) {
    return (
      /*change_handler_1*/
      e[10](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  function Rt(...c) {
    return (
      /*change_handler_2*/
      e[11](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  function At(...c) {
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
  function It(...c) {
    return (
      /*change_handler_5*/
      e[14](
        /*row*/
        e[16],
        ...c
      )
    );
  }
  let Xe = W([0, 1, 2, 3, 4, 5, 6]), G = [];
  for (let c = 0; c < 7; c += 1)
    G[c] = yt(ct(e, Xe, c));
  return {
    key: t,
    first: null,
    c() {
      n = h("tr"), l = h("td"), o = h("select"), i = h("option"), i.textContent = "—";
      for (let c = 0; c < A.length; c += 1)
        A[c].c();
      k = F(), g = h("td"), p = h("input"), b = F(), r = h("td"), a = h("select"), d = h("option"), d.textContent = "—";
      for (let c = 0; c < E.length; c += 1)
        E[c].c();
      y = F(), z = h("td"), Q = X(x), L = F(), C = h("td"), H = X(R), qe = F(), be = h("td"), M = h("select"), Z = h("option"), Z.textContent = "—", $ = h("option"), $.textContent = "TSO", ee = h("option"), ee.textContent = "LTSO", te = h("option"), te.textContent = "STSO", Qe = F(), Se = h("td"), D = h("select"), ne = h("option"), ne.textContent = "—", le = h("option"), le.textContent = "FT", ie = h("option"), ie.textContent = "PT", se = h("option"), se.textContent = "LTSO", oe = h("option"), oe.textContent = "STSO", Ze = F(), Oe = h("td"), P = h("select"), ae = h("option"), ae.textContent = "—", re = h("option"), re.textContent = "M", ue = h("option"), ue.textContent = "F", et = F(), Te = h("td"), B = h("select"), fe = h("option"), fe.textContent = "—", de = h("option"), de.textContent = "DFO", ce = h("option"), ce.textContent = "BAG", _e = h("option"), _e.textContent = "PAX", nt = F(), Re = h("td"), Be = X(Ae), lt = F(), Ee = h("td"), xe = X(Ie), it = F();
      for (let c = 0; c < 7; c += 1)
        G[c].c();
      Pe = F(), De = h("td"), Ne = X(Fe), st = F(), i.__value = "", O(i, i.__value), f(o, "class", "line-edit svelte-1yzw1rx"), f(o, "data-field", "team"), f(o, "data-line-id", _ = /*row*/
      e[16]?.id), f(l, "class", "svelte-1yzw1rx"), f(p, "type", "text"), f(p, "class", "line-edit line-code-input svelte-1yzw1rx"), f(p, "data-field", "lineCode"), f(p, "data-line-id", m = /*row*/
      e[16]?.id), p.value = w = /*row*/
      e[16]?.line ?? "", f(g, "class", "svelte-1yzw1rx"), d.__value = "", O(d, d.__value), f(a, "class", "line-edit svelte-1yzw1rx"), f(a, "data-field", "shift"), f(a, "data-line-id", v = /*row*/
      e[16]?.id), f(r, "class", "svelte-1yzw1rx"), f(z, "class", "svelte-1yzw1rx"), f(C, "class", "svelte-1yzw1rx"), Z.__value = "", O(Z, Z.__value), $.__value = "TSO", O($, $.__value), ee.__value = "LTSO", O(ee, ee.__value), te.__value = "STSO", O(te, te.__value), f(M, "class", "line-edit svelte-1yzw1rx"), f(M, "data-field", "position"), f(M, "data-line-id", ze = /*row*/
      e[16]?.id), f(be, "class", "svelte-1yzw1rx"), ne.__value = "", O(ne, ne.__value), le.__value = "FT", O(le, le.__value), ie.__value = "PT", O(ie, ie.__value), se.__value = "LTSO", O(se, se.__value), oe.__value = "STSO", O(oe, oe.__value), f(D, "class", "line-edit svelte-1yzw1rx"), f(D, "data-field", "emp"), f(D, "data-line-id", ke = /*row*/
      e[16]?.id), f(Se, "class", "svelte-1yzw1rx"), ae.__value = "", O(ae, ae.__value), re.__value = "M", O(re, re.__value), ue.__value = "F", O(ue, ue.__value), f(P, "class", "line-edit svelte-1yzw1rx"), f(P, "data-field", "sex"), f(P, "data-line-id", Le = /*row*/
      e[16]?.id), f(Oe, "class", "svelte-1yzw1rx"), fe.__value = "", O(fe, fe.__value), de.__value = "DFO", O(de, de.__value), ce.__value = "BAG", O(ce, ce.__value), _e.__value = "PAX", O(_e, _e.__value), f(B, "class", "line-edit svelte-1yzw1rx"), f(B, "data-field", "function"), f(B, "data-line-id", Ce = /*row*/
      e[16]?.id), f(Te, "class", "svelte-1yzw1rx"), f(Re, "class", "line-rdo-cell svelte-1yzw1rx"), f(Ee, "class", "svelte-1yzw1rx"), f(De, "class", "line-hours svelte-1yzw1rx"), f(n, "data-line-row", Me = /*row*/
      e[16]?.id), this.first = n;
    },
    m(c, S) {
      J(c, n, S), s(n, l), s(l, o), s(o, i);
      for (let u = 0; u < A.length; u += 1)
        A[u] && A[u].m(o, null);
      N(
        o,
        /*row*/
        e[16]?.teamId ?? ""
      ), s(n, k), s(n, g), s(g, p), s(n, b), s(n, r), s(r, a), s(a, d);
      for (let u = 0; u < E.length; u += 1)
        E[u] && E[u].m(a, null);
      N(
        a,
        /*row*/
        e[16]?.shiftId ?? ""
      ), s(n, y), s(n, z), s(z, Q), s(n, L), s(n, C), s(C, H), s(n, qe), s(n, be), s(be, M), s(M, Z), s(M, $), s(M, ee), s(M, te), N(
        M,
        /*row*/
        e[16]?.position ?? ""
      ), s(n, Qe), s(n, Se), s(Se, D), s(D, ne), s(D, le), s(D, ie), s(D, se), s(D, oe), N(
        D,
        /*row*/
        e[16]?.emp ?? ""
      ), s(n, Ze), s(n, Oe), s(Oe, P), s(P, ae), s(P, re), s(P, ue), N(
        P,
        /*row*/
        e[16]?.sex ?? ""
      ), s(n, et), s(n, Te), s(Te, B), s(B, fe), s(B, de), s(B, ce), s(B, _e), N(
        B,
        /*row*/
        e[16]?.function ?? ""
      ), s(n, nt), s(n, Re), s(Re, Be), s(n, lt), s(n, Ee), s(Ee, xe), s(n, it);
      for (let u = 0; u < 7; u += 1)
        G[u] && G[u].m(n, null);
      s(n, Pe), s(n, De), s(De, Ne), s(n, st), Ge || (ot = [
        U(o, "change", Lt),
        U(p, "input", Tt),
        U(a, "change", Ct),
        U(M, "change", Rt),
        U(D, "change", At),
        U(P, "change", Et),
        U(B, "change", It)
      ], Ge = !0);
    },
    p(c, S) {
      if (e = c, S & /*teamOptions*/
      8) {
        he = W(
          /*teamOptions*/
          e[3]
        );
        let u;
        for (u = 0; u < he.length; u += 1) {
          const j = ht(e, he, u);
          A[u] ? A[u].p(j, S) : (A[u] = pt(j), A[u].c(), A[u].m(o, null));
        }
        for (; u < A.length; u += 1)
          A[u].d(1);
        A.length = he.length;
      }
      if (S & /*rows, teamOptions*/
      9 && _ !== (_ = /*row*/
      e[16]?.id) && f(o, "data-line-id", _), S & /*rows, teamOptions*/
      9 && T !== (T = /*row*/
      e[16]?.teamId ?? "") && N(
        o,
        /*row*/
        e[16]?.teamId ?? ""
      ), S & /*rows, teamOptions*/
      9 && m !== (m = /*row*/
      e[16]?.id) && f(p, "data-line-id", m), S & /*rows, teamOptions*/
      9 && w !== (w = /*row*/
      e[16]?.line ?? "") && p.value !== w && (p.value = w), S & /*shiftOptions, shiftLabel*/
      4) {
        ve = W(
          /*shiftOptions*/
          e[2]
        );
        let u;
        for (u = 0; u < ve.length; u += 1) {
          const j = _t(e, ve, u);
          E[u] ? E[u].p(j, S) : (E[u] = gt(j), E[u].c(), E[u].m(a, null));
        }
        for (; u < E.length; u += 1)
          E[u].d(1);
        E.length = ve.length;
      }
      if (S & /*rows, teamOptions*/
      9 && v !== (v = /*row*/
      e[16]?.id) && f(a, "data-line-id", v), S & /*rows, teamOptions*/
      9 && I !== (I = /*row*/
      e[16]?.shiftId ?? "") && N(
        a,
        /*row*/
        e[16]?.shiftId ?? ""
      ), S & /*rows*/
      1 && x !== (x = /*row*/
      (e[16]?.start ?? "") + "") && K(Q, x), S & /*rows*/
      1 && R !== (R = /*row*/
      (e[16]?.end ?? "") + "") && K(H, R), S & /*rows, teamOptions*/
      9 && ze !== (ze = /*row*/
      e[16]?.id) && f(M, "data-line-id", ze), S & /*rows, teamOptions*/
      9 && Je !== (Je = /*row*/
      e[16]?.position ?? "") && N(
        M,
        /*row*/
        e[16]?.position ?? ""
      ), S & /*rows, teamOptions*/
      9 && ke !== (ke = /*row*/
      e[16]?.id) && f(D, "data-line-id", ke), S & /*rows, teamOptions*/
      9 && Ye !== (Ye = /*row*/
      e[16]?.emp ?? "") && N(
        D,
        /*row*/
        e[16]?.emp ?? ""
      ), S & /*rows, teamOptions*/
      9 && Le !== (Le = /*row*/
      e[16]?.id) && f(P, "data-line-id", Le), S & /*rows, teamOptions*/
      9 && $e !== ($e = /*row*/
      e[16]?.sex ?? "") && N(
        P,
        /*row*/
        e[16]?.sex ?? ""
      ), S & /*rows, teamOptions*/
      9 && Ce !== (Ce = /*row*/
      e[16]?.id) && f(B, "data-line-id", Ce), S & /*rows, teamOptions*/
      9 && tt !== (tt = /*row*/
      e[16]?.function ?? "") && N(
        B,
        /*row*/
        e[16]?.function ?? ""
      ), S & /*rows*/
      1 && Ae !== (Ae = /*row*/
      (e[16]?.rdos ?? "—") + "") && K(Be, Ae), S & /*rows*/
      1 && Ie !== (Ie = /*row*/
      (e[16]?.paid ?? "") + "") && K(xe, Ie), S & /*dayClass, rows, emitDay*/
      33) {
        Xe = W([0, 1, 2, 3, 4, 5, 6]);
        let u;
        for (u = 0; u < 7; u += 1) {
          const j = ct(e, Xe, u);
          G[u] ? G[u].p(j, S) : (G[u] = yt(j), G[u].c(), G[u].m(n, Pe));
        }
        for (; u < 7; u += 1)
          G[u].d(1);
      }
      S & /*rows*/
      1 && Fe !== (Fe = /*row*/
      (e[16]?.hours ?? "") + "") && K(Ne, Fe), S & /*rows, teamOptions*/
      9 && Me !== (Me = /*row*/
      e[16]?.id) && f(n, "data-line-row", Me);
    },
    d(c) {
      c && V(n), He(A, c), He(E, c), He(G, c), Ge = !1, me(ot);
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
      e = h("div"), o.c(), f(e, "class", "lines-table-root svelte-1yzw1rx"), q(e, "min-height", "min(70vh, 720px)"), q(e, "height", "min(70vh, 720px)"), q(e, "width", "100%");
    },
    m(i, _) {
      J(i, e, _), o.m(e, null);
    },
    p(i, [_]) {
      l === (l = n(i)) && o ? o.p(i, _) : (o.d(1), o = l(i), o && (o.c(), o.m(e, null)));
    },
    i: Y,
    o: Y,
    d(i) {
      i && V(e), o.d();
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
  let { rows: l = [] } = e, { mode: o = "svelte" } = e, { shiftOptions: i = [] } = e, { teamOptions: _ = [] } = e, { onInlineEdit: T = null } = e, { onDayToggle: k = null } = e;
  function g(y, z, x) {
    T?.({ lineId: y, field: z, value: x });
  }
  function p(y, z) {
    k?.({ lineId: y, dayIndex: z });
  }
  const m = (y, z) => g(y?.id, "team", z.target.value), w = (y, z) => g(y?.id, "lineCode", z.target.value), b = (y, z) => g(y?.id, "shift", z.target.value), r = (y, z) => g(y?.id, "position", z.target.value), a = (y, z) => g(y?.id, "emp", z.target.value), d = (y, z) => g(y?.id, "sex", z.target.value), v = (y, z) => g(y?.id, "function", z.target.value), I = (y, z) => p(y?.id, z);
  return t.$$set = (y) => {
    "rows" in y && n(0, l = y.rows), "mode" in y && n(1, o = y.mode), "shiftOptions" in y && n(2, i = y.shiftOptions), "teamOptions" in y && n(3, _ = y.teamOptions), "onInlineEdit" in y && n(6, T = y.onInlineEdit), "onDayToggle" in y && n(7, k = y.onDayToggle);
  }, [
    l,
    o,
    i,
    _,
    g,
    p,
    T,
    k,
    m,
    w,
    b,
    r,
    a,
    d,
    v,
    I
  ];
}
class tn extends Jt {
  constructor(e) {
    super(), qt(this, e, en, $t, Mt, {
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
  function o(r, a) {
    const d = String(r), v = e.state && e.state.functionRotation && e.state.functionRotation[d];
    if (!Array.isArray(v)) return null;
    const I = v[a];
    return I === "BAG" || I === "PAX" ? I : null;
  }
  function i(r, a, d) {
    var v = String(r);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[v] || (e.state.functionRotation[v] = []); e.state.functionRotation[v].length <= a; ) e.state.functionRotation[v].push(null);
    e.state.functionRotation[v][a] = d;
  }
  function _(r) {
    if (!r) return !1;
    if (r.function === "DFO") return !0;
    const a = r.functionEligible;
    return !!(a && (a.dfo === !0 || a.DFO === !0));
  }
  function T() {
    const r = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], a = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(r)) : r, d = e.state && e.state.schedule || {}, v = typeof e.getRowModels == "function" ? e.getRowModels(a, d, l()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(l()) : [];
    return Array.isArray(v) ? v : [];
  }
  function k() {
    return e.teams && Array.isArray(e.teams.teams) ? e.teams.teams : [];
  }
  function g() {
    return e.state && Array.isArray(e.state.shifts) ? e.state.shifts : [];
  }
  function p(r) {
    if (!r || typeof r.$set != "function") return;
    const a = T();
    r.$set({
      rows: Array.isArray(a) ? a : [],
      shiftOptions: g(),
      teamOptions: k()
    });
  }
  function m(r) {
    if (!r) return;
    const a = e.findLineById ? e.findLineById(r.lineId) : null;
    if (!a) return;
    const d = r.field, v = r.value;
    d === "lineCode" ? a.lineCode = String(v || "").trim() || a.lineCode : d === "sex" ? a.sex = v === "F" ? "F" : "M" : d === "function" ? a.function = v === "DFO" || v === "PAX" || v === "BAG" ? v : "" : d === "emp" || d === "position" ? e.applyLineEmp && e.applyLineEmp(a, v) : d === "shift" ? e.applyLineShift && e.applyLineShift(a, v) : d === "team" && e.setLineTeam && e.setLineTeam(r.lineId, v), e.updateStatus && e.updateStatus("Updated " + (a.lineCode || r.lineId)), b(), (d === "emp" || d === "position" || d === "shift") && e.renderCoverageBars && e.renderCoverageBars(), d === "team" && e.renderTeams && e.renderTeams();
  }
  function w(r) {
    if (!r) return;
    const a = e.findLineById ? e.findLineById(r.lineId) : null, d = Number(r.dayIndex);
    if (!a || !Number.isInteger(d) || d < 0 || d > 6) return;
    const v = a.id;
    e.state.schedule || (e.state.schedule = {}), e.state.schedule[v] || (e.state.schedule[v] = []), e.state.functionRotation || (e.state.functionRotation = {});
    const I = e.state.schedule[v][d] || "RDO", y = a.function === "BAG", z = _(a);
    if (I !== "WORK")
      e.state.schedule[v][d] = "WORK", y ? i(v, d, "BAG") : z ? i(v, d, "PAX") : i(v, d, null);
    else if (y)
      e.state.schedule[v][d] = "RDO", i(v, d, null);
    else if (z) {
      const x = (typeof e.getRotationDuty == "function" ? e.getRotationDuty(a.id, d) : o(a.id, d)) || "PAX";
      x === "PAX" || !x ? i(v, d, "BAG") : (e.state.schedule[v][d] = "RDO", i(v, d, null));
    } else
      e.state.schedule[v][d] = "RDO", i(v, d, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(a), b(), e.renderCoverageBars && e.renderCoverageBars();
  }
  const b = () => {
    try {
      const r = n._linesTableApp;
      if (r)
        p(r);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const a = T();
        n._linesTableApp = new tn({
          target: n,
          props: {
            rows: Array.isArray(a) ? a : [],
            shiftOptions: g(),
            teamOptions: k(),
            onInlineEdit: m,
            onDayToggle: w
          }
        });
      }
    } catch (r) {
      console.error("lines-table: refresh failed", r);
    }
  };
  b(), document.addEventListener("click", (r) => {
    const a = r.target.closest?.(".tab-btn");
    a && a.dataset.tab === "lines" && b();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((r) => {
    window.addEventListener(r, b);
  }), n.refresh = b;
}
export {
  ln as initLinesTable
};
