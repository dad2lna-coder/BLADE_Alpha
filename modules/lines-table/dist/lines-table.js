var It = Object.defineProperty;
var Ft = (t, e, n) => e in t ? It(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ve = (t, e, n) => Ft(t, typeof e != "symbol" ? e + "" : e, n);
function Y() {
}
function Ot(t) {
  return t();
}
function at() {
  return /* @__PURE__ */ Object.create(null);
}
function me(t) {
  t.forEach(Ot);
}
function zt(t) {
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
function v(t) {
  return document.createElement(t);
}
function V(t) {
  return document.createTextNode(t);
}
function F() {
  return V(" ");
}
function W(t, e, n, l) {
  return t.addEventListener(e, n, l), () => t.removeEventListener(e, n, l);
}
function d(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Pt(t) {
  return Array.from(t.childNodes);
}
function q(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function A(t, e) {
  t.value = e ?? "";
}
function J(t, e, n, l) {
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
const pe = [], ut = [];
let ye = [];
const ft = [], xt = /* @__PURE__ */ Promise.resolve();
let Ue = !1;
function Gt() {
  Ue || (Ue = !0, xt.then(St));
}
function We(t) {
  ye.push(t);
}
const je = /* @__PURE__ */ new Set();
let ge = 0;
function St() {
  if (ge !== 0)
    return;
  const t = Ke;
  do {
    try {
      for (; ge < pe.length; ) {
        const e = pe[ge];
        ge++, we(e), Nt(e.$$);
      }
    } catch (e) {
      throw pe.length = 0, ge = 0, e;
    }
    for (we(null), pe.length = 0, ge = 0; ut.length; ) ut.pop()();
    for (let e = 0; e < ye.length; e += 1) {
      const n = ye[e];
      je.has(n) || (je.add(n), n());
    }
    ye.length = 0;
  } while (pe.length);
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
function Xt(t) {
  const e = [], n = [];
  ye.forEach((l) => t.indexOf(l) === -1 ? e.push(l) : n.push(l)), n.forEach((l) => l()), ye = e;
}
const Vt = /* @__PURE__ */ new Set();
function kt(t, e) {
  t && t.i && (Vt.delete(t), t.i(e));
}
function K(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function Ht(t, e) {
  t.d(1), e.delete(t.key);
}
function jt(t, e, n, l, o, i, h, R, S, p, g, m) {
  let w = t.length, b = i.length, r = w;
  const a = {};
  for (; r--; ) a[t[r].key] = r;
  const c = [], f = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), y = [];
  for (r = b; r--; ) {
    const k = m(o, i, r), T = n(k);
    let C = h.get(T);
    C ? y.push(() => C.p(k, e)) : (C = p(T, k), C.c()), f.set(T, c[r] = C), T in a && L.set(T, Math.abs(r - a[T]));
  }
  const O = /* @__PURE__ */ new Set(), P = /* @__PURE__ */ new Set();
  function x(k) {
    kt(k, 1), k.m(R, g), h.set(k.key, k), g = k.first, b--;
  }
  for (; w && b; ) {
    const k = c[b - 1], T = t[w - 1], C = k.key, j = T.key;
    k === T ? (g = k.first, w--, b--) : f.has(j) ? !h.has(C) || O.has(C) ? x(k) : P.has(j) ? w-- : L.get(C) > L.get(j) ? (P.add(C), x(k)) : (O.add(j), w--) : (S(T, h), w--);
  }
  for (; w--; ) {
    const k = t[w];
    f.has(k.key) || S(k, h);
  }
  for (; b; ) x(c[b - 1]);
  return me(y), c;
}
function Ut(t, e, n) {
  const { fragment: l, after_update: o } = t.$$;
  l && l.m(e, n), We(() => {
    const i = t.$$.on_mount.map(Ot).filter(zt);
    t.$$.on_destroy ? t.$$.on_destroy.push(...i) : me(i), t.$$.on_mount = [];
  }), o.forEach(We);
}
function Wt(t, e) {
  const n = t.$$;
  n.fragment !== null && (Xt(n.after_update), me(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function Kt(t, e) {
  t.$$.dirty[0] === -1 && (pe.push(t), Gt(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function qt(t, e, n, l, o, i, h = null, R = [-1]) {
  const S = Ke;
  we(t);
  const p = t.$$ = {
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
    context: new Map(e.context || (S ? S.$$.context : [])),
    // everything else
    callbacks: at(),
    dirty: R,
    skip_bound: !1,
    root: e.target || S.$$.root
  };
  h && h(p.root);
  let g = !1;
  if (p.ctx = n ? n(t, e.props || {}, (m, w, ...b) => {
    const r = b.length ? b[0] : w;
    return p.ctx && o(p.ctx[m], p.ctx[m] = r) && (!p.skip_bound && p.bound[m] && p.bound[m](r), g && Kt(t, m)), w;
  }) : [], p.update(), g = !0, me(p.before_update), p.fragment = l ? l(p.ctx) : !1, e.target) {
    if (e.hydrate) {
      const m = Pt(e.target);
      p.fragment && p.fragment.l(m), m.forEach(H);
    } else
      p.fragment && p.fragment.c();
    e.intro && kt(t.$$.fragment), Ut(t, e.target, e.anchor), St();
  }
  we(S);
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
    if (!zt(n))
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
      e = v("div"), e.textContent = "Classic Lines mode active", d(e, "class", "muted");
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
  let e, n, l, o, i, h = [], R = /* @__PURE__ */ new Map(), S = K(
    /*rows*/
    t[0]
  );
  const p = (m) => (
    /*row*/
    m[16].id
  );
  for (let m = 0; m < S.length; m += 1) {
    let w = dt(t, S, m), b = p(w);
    R.set(b, h[m] = mt(b, w));
  }
  let g = null;
  return S.length || (g = vt()), {
    c() {
      e = v("div"), n = v("table"), l = v("thead"), l.innerHTML = '<tr><th class="svelte-1yzw1rx">Team</th> <th class="svelte-1yzw1rx">Line</th> <th class="svelte-1yzw1rx">Shift</th> <th class="svelte-1yzw1rx">Start</th> <th class="svelte-1yzw1rx">End</th> <th class="svelte-1yzw1rx">Position</th> <th class="svelte-1yzw1rx">Emp</th> <th class="svelte-1yzw1rx">Sex</th> <th class="svelte-1yzw1rx">Function</th> <th class="svelte-1yzw1rx">RDOs</th> <th class="svelte-1yzw1rx">Paid</th> <th class="svelte-1yzw1rx">Sun</th> <th class="svelte-1yzw1rx">Mon</th> <th class="svelte-1yzw1rx">Tue</th> <th class="svelte-1yzw1rx">Wed</th> <th class="svelte-1yzw1rx">Thu</th> <th class="svelte-1yzw1rx">Fri</th> <th class="svelte-1yzw1rx">Sat</th> <th class="svelte-1yzw1rx">Hours</th></tr>', o = F(), i = v("tbody");
      for (let m = 0; m < h.length; m += 1)
        h[m].c();
      g && g.c(), d(n, "class", "data-table lines-editable svelte-1yzw1rx"), J(n, "width", "max-content"), J(n, "min-width", "1100px"), d(e, "class", "lines-virtual-root svelte-1yzw1rx"), J(e, "height", "100%"), J(e, "overflow", "auto"), J(e, "position", "relative");
    },
    m(m, w) {
      Q(m, e, w), s(e, n), s(n, l), s(n, o), s(n, i);
      for (let b = 0; b < h.length; b += 1)
        h[b] && h[b].m(i, null);
      g && g.m(i, null);
    },
    p(m, w) {
      w & /*rows, dayClass, emitDay, emitEdit, shiftOptions, shiftLabel, teamOptions*/
      61 && (S = K(
        /*rows*/
        m[0]
      ), h = jt(h, w, p, 1, m, S, R, i, Ht, mt, null, dt), !S.length && g ? g.p(m, w) : S.length ? g && (g.d(1), g = null) : (g = vt(), g.c(), g.m(i, null)));
    },
    d(m) {
      m && H(e);
      for (let w = 0; w < h.length; w += 1)
        h[w].d();
      g && g.d();
    }
  };
}
function vt(t) {
  let e;
  return {
    c() {
      e = v("tr"), e.innerHTML = '<td colspan="19" class="muted svelte-1yzw1rx">No lines — Generate or Import first.</td>';
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
function gt(t) {
  let e, n = (
    /*team*/
    (t[25].name ?? /*team*/
    t[25].id) + ""
  ), l, o;
  return {
    c() {
      e = v("option"), l = V(n), e.__value = o = /*team*/
      t[25].id, A(e, e.__value);
    },
    m(i, h) {
      Q(i, e, h), s(e, l);
    },
    p(i, h) {
      h & /*teamOptions*/
      8 && n !== (n = /*team*/
      (i[25].name ?? /*team*/
      i[25].id) + "") && q(l, n), h & /*teamOptions*/
      8 && o !== (o = /*team*/
      i[25].id) && (e.__value = o, A(e, e.__value));
    },
    d(i) {
      i && H(e);
    }
  };
}
function pt(t) {
  let e, n = wt(
    /*shift*/
    t[22]
  ) + "", l, o;
  return {
    c() {
      e = v("option"), l = V(n), e.__value = o = /*shift*/
      t[22].id, A(e, e.__value);
    },
    m(i, h) {
      Q(i, e, h), s(e, l);
    },
    p(i, h) {
      h & /*shiftOptions*/
      4 && n !== (n = wt(
        /*shift*/
        i[22]
      ) + "") && q(l, n), h & /*shiftOptions*/
      4 && o !== (o = /*shift*/
      i[22].id) && (e.__value = o, A(e, e.__value));
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
  ), l, o, i, h, R;
  function S() {
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
      e = v("td"), l = V(n), d(e, "class", o = rt(bt(
        /*row*/
        t[16]?.dayDuties?.[
          /*i*/
          t[19]
        ] ?? /*row*/
        t[16]?.days?.[
          /*i*/
          t[19]
        ]
      )) + " svelte-1yzw1rx"), d(e, "data-line-id", i = /*row*/
      t[16]?.id), d(
        e,
        "data-day-index",
        /*i*/
        t[19]
      );
    },
    m(p, g) {
      Q(p, e, g), s(e, l), h || (R = W(e, "click", S), h = !0);
    },
    p(p, g) {
      t = p, g & /*rows*/
      1 && n !== (n = /*row*/
      (t[16]?.days?.[
        /*i*/
        t[19]
      ] ?? "") + "") && q(l, n), g & /*rows, teamOptions*/
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
      )) + " svelte-1yzw1rx") && d(e, "class", o), g & /*rows, teamOptions*/
      9 && i !== (i = /*row*/
      t[16]?.id) && d(e, "data-line-id", i);
    },
    d(p) {
      p && H(e), h = !1, R();
    }
  };
}
function mt(t, e) {
  let n, l, o, i, h, R, S, p, g, m, w, b, r, a, c, f, L, y, O, P = (
    /*row*/
    (e[16]?.start ?? "") + ""
  ), x, k, T, C = (
    /*row*/
    (e[16]?.end ?? "") + ""
  ), j, qe, be, M, Z, $, ee, te, Oe, Je, Qe, ze, I, ne, le, ie, se, oe, Se, Ye, Ze, ke, G, ae, re, ue, Ae, $e, et, Re, B, fe, de, ce, _e, Le, tt, nt, Te, Ce = (
    /*row*/
    (e[16]?.rdos ?? "—") + ""
  ), Be, lt, De, Ee = (
    /*row*/
    (e[16]?.paid ?? "") + ""
  ), Pe, it, xe, Ie, Fe = (
    /*row*/
    (e[16]?.hours ?? "") + ""
  ), Ge, st, Me, Ne, ot, he = K(
    /*teamOptions*/
    e[3]
  ), D = [];
  for (let _ = 0; _ < he.length; _ += 1)
    D[_] = gt(ht(e, he, _));
  function At(..._) {
    return (
      /*change_handler*/
      e[8](
        /*row*/
        e[16],
        ..._
      )
    );
  }
  function Rt(..._) {
    return (
      /*input_handler*/
      e[9](
        /*row*/
        e[16],
        ..._
      )
    );
  }
  let ve = K(
    /*shiftOptions*/
    e[2]
  ), E = [];
  for (let _ = 0; _ < ve.length; _ += 1)
    E[_] = pt(_t(e, ve, _));
  function Lt(..._) {
    return (
      /*change_handler_1*/
      e[10](
        /*row*/
        e[16],
        ..._
      )
    );
  }
  function Tt(..._) {
    return (
      /*change_handler_2*/
      e[11](
        /*row*/
        e[16],
        ..._
      )
    );
  }
  function Ct(..._) {
    return (
      /*change_handler_3*/
      e[12](
        /*row*/
        e[16],
        ..._
      )
    );
  }
  function Dt(..._) {
    return (
      /*change_handler_4*/
      e[13](
        /*row*/
        e[16],
        ..._
      )
    );
  }
  function Et(..._) {
    return (
      /*change_handler_5*/
      e[14](
        /*row*/
        e[16],
        ..._
      )
    );
  }
  let Xe = K([0, 1, 2, 3, 4, 5, 6]), X = [];
  for (let _ = 0; _ < 7; _ += 1)
    X[_] = yt(ct(e, Xe, _));
  return {
    key: t,
    first: null,
    c() {
      n = v("tr"), l = v("td"), o = v("select"), i = v("option"), i.textContent = "—";
      for (let _ = 0; _ < D.length; _ += 1)
        D[_].c();
      S = F(), p = v("td"), g = v("input"), b = F(), r = v("td"), a = v("select"), c = v("option"), c.textContent = "—";
      for (let _ = 0; _ < E.length; _ += 1)
        E[_].c();
      y = F(), O = v("td"), x = V(P), k = F(), T = v("td"), j = V(C), qe = F(), be = v("td"), M = v("select"), Z = v("option"), Z.textContent = "—", $ = v("option"), $.textContent = "TSO", ee = v("option"), ee.textContent = "LTSO", te = v("option"), te.textContent = "STSO", Qe = F(), ze = v("td"), I = v("select"), ne = v("option"), ne.textContent = "—", le = v("option"), le.textContent = "FT", ie = v("option"), ie.textContent = "PT", se = v("option"), se.textContent = "LTSO", oe = v("option"), oe.textContent = "STSO", Ze = F(), ke = v("td"), G = v("select"), ae = v("option"), ae.textContent = "—", re = v("option"), re.textContent = "M", ue = v("option"), ue.textContent = "F", et = F(), Re = v("td"), B = v("select"), fe = v("option"), fe.textContent = "—", de = v("option"), de.textContent = "DFO", ce = v("option"), ce.textContent = "BAG", _e = v("option"), _e.textContent = "PAX", nt = F(), Te = v("td"), Be = V(Ce), lt = F(), De = v("td"), Pe = V(Ee), it = F();
      for (let _ = 0; _ < 7; _ += 1)
        X[_].c();
      xe = F(), Ie = v("td"), Ge = V(Fe), st = F(), i.__value = "", A(i, i.__value), d(o, "class", "line-edit svelte-1yzw1rx"), d(o, "data-field", "team"), d(o, "data-line-id", h = /*row*/
      e[16]?.id), d(l, "class", "svelte-1yzw1rx"), d(g, "type", "text"), d(g, "class", "line-edit line-code-input svelte-1yzw1rx"), d(g, "data-field", "lineCode"), d(g, "data-line-id", m = /*row*/
      e[16]?.id), g.value = w = /*row*/
      e[16]?.line ?? "", d(p, "class", "svelte-1yzw1rx"), c.__value = "", A(c, c.__value), d(a, "class", "line-edit svelte-1yzw1rx"), d(a, "data-field", "shift"), d(a, "data-line-id", f = /*row*/
      e[16]?.id), d(r, "class", "svelte-1yzw1rx"), d(O, "class", "svelte-1yzw1rx"), d(T, "class", "svelte-1yzw1rx"), Z.__value = "", A(Z, Z.__value), $.__value = "TSO", A($, $.__value), ee.__value = "LTSO", A(ee, ee.__value), te.__value = "STSO", A(te, te.__value), d(M, "class", "line-edit svelte-1yzw1rx"), d(M, "data-field", "position"), d(M, "data-line-id", Oe = /*row*/
      e[16]?.id), d(be, "class", "svelte-1yzw1rx"), ne.__value = "", A(ne, ne.__value), le.__value = "FT", A(le, le.__value), ie.__value = "PT", A(ie, ie.__value), se.__value = "LTSO", A(se, se.__value), oe.__value = "STSO", A(oe, oe.__value), d(I, "class", "line-edit svelte-1yzw1rx"), d(I, "data-field", "emp"), d(I, "data-line-id", Se = /*row*/
      e[16]?.id), d(ze, "class", "svelte-1yzw1rx"), ae.__value = "", A(ae, ae.__value), re.__value = "M", A(re, re.__value), ue.__value = "F", A(ue, ue.__value), d(G, "class", "line-edit svelte-1yzw1rx"), d(G, "data-field", "sex"), d(G, "data-line-id", Ae = /*row*/
      e[16]?.id), d(ke, "class", "svelte-1yzw1rx"), fe.__value = "", A(fe, fe.__value), de.__value = "DFO", A(de, de.__value), ce.__value = "BAG", A(ce, ce.__value), _e.__value = "PAX", A(_e, _e.__value), d(B, "class", "line-edit svelte-1yzw1rx"), d(B, "data-field", "function"), d(B, "data-line-id", Le = /*row*/
      e[16]?.id), d(Re, "class", "svelte-1yzw1rx"), d(Te, "class", "line-rdo-cell svelte-1yzw1rx"), d(De, "class", "svelte-1yzw1rx"), d(Ie, "class", "line-hours svelte-1yzw1rx"), d(n, "data-line-row", Me = /*row*/
      e[16]?.id), this.first = n;
    },
    m(_, z) {
      Q(_, n, z), s(n, l), s(l, o), s(o, i);
      for (let u = 0; u < D.length; u += 1)
        D[u] && D[u].m(o, null);
      N(
        o,
        /*row*/
        e[16]?.teamId ?? ""
      ), s(n, S), s(n, p), s(p, g), s(n, b), s(n, r), s(r, a), s(a, c);
      for (let u = 0; u < E.length; u += 1)
        E[u] && E[u].m(a, null);
      N(
        a,
        /*row*/
        e[16]?.shiftId ?? ""
      ), s(n, y), s(n, O), s(O, x), s(n, k), s(n, T), s(T, j), s(n, qe), s(n, be), s(be, M), s(M, Z), s(M, $), s(M, ee), s(M, te), N(
        M,
        /*row*/
        e[16]?.position ?? ""
      ), s(n, Qe), s(n, ze), s(ze, I), s(I, ne), s(I, le), s(I, ie), s(I, se), s(I, oe), N(
        I,
        /*row*/
        e[16]?.emp ?? ""
      ), s(n, Ze), s(n, ke), s(ke, G), s(G, ae), s(G, re), s(G, ue), N(
        G,
        /*row*/
        e[16]?.sex ?? ""
      ), s(n, et), s(n, Re), s(Re, B), s(B, fe), s(B, de), s(B, ce), s(B, _e), N(
        B,
        /*row*/
        e[16]?.function ?? ""
      ), s(n, nt), s(n, Te), s(Te, Be), s(n, lt), s(n, De), s(De, Pe), s(n, it);
      for (let u = 0; u < 7; u += 1)
        X[u] && X[u].m(n, null);
      s(n, xe), s(n, Ie), s(Ie, Ge), s(n, st), Ne || (ot = [
        W(o, "change", At),
        W(g, "input", Rt),
        W(a, "change", Lt),
        W(M, "change", Tt),
        W(I, "change", Ct),
        W(G, "change", Dt),
        W(B, "change", Et)
      ], Ne = !0);
    },
    p(_, z) {
      if (e = _, z & /*teamOptions*/
      8) {
        he = K(
          /*teamOptions*/
          e[3]
        );
        let u;
        for (u = 0; u < he.length; u += 1) {
          const U = ht(e, he, u);
          D[u] ? D[u].p(U, z) : (D[u] = gt(U), D[u].c(), D[u].m(o, null));
        }
        for (; u < D.length; u += 1)
          D[u].d(1);
        D.length = he.length;
      }
      if (z & /*rows, teamOptions*/
      9 && h !== (h = /*row*/
      e[16]?.id) && d(o, "data-line-id", h), z & /*rows, teamOptions*/
      9 && R !== (R = /*row*/
      e[16]?.teamId ?? "") && N(
        o,
        /*row*/
        e[16]?.teamId ?? ""
      ), z & /*rows, teamOptions*/
      9 && m !== (m = /*row*/
      e[16]?.id) && d(g, "data-line-id", m), z & /*rows, teamOptions*/
      9 && w !== (w = /*row*/
      e[16]?.line ?? "") && g.value !== w && (g.value = w), z & /*shiftOptions, shiftLabel*/
      4) {
        ve = K(
          /*shiftOptions*/
          e[2]
        );
        let u;
        for (u = 0; u < ve.length; u += 1) {
          const U = _t(e, ve, u);
          E[u] ? E[u].p(U, z) : (E[u] = pt(U), E[u].c(), E[u].m(a, null));
        }
        for (; u < E.length; u += 1)
          E[u].d(1);
        E.length = ve.length;
      }
      if (z & /*rows, teamOptions*/
      9 && f !== (f = /*row*/
      e[16]?.id) && d(a, "data-line-id", f), z & /*rows, teamOptions*/
      9 && L !== (L = /*row*/
      e[16]?.shiftId ?? "") && N(
        a,
        /*row*/
        e[16]?.shiftId ?? ""
      ), z & /*rows*/
      1 && P !== (P = /*row*/
      (e[16]?.start ?? "") + "") && q(x, P), z & /*rows*/
      1 && C !== (C = /*row*/
      (e[16]?.end ?? "") + "") && q(j, C), z & /*rows, teamOptions*/
      9 && Oe !== (Oe = /*row*/
      e[16]?.id) && d(M, "data-line-id", Oe), z & /*rows, teamOptions*/
      9 && Je !== (Je = /*row*/
      e[16]?.position ?? "") && N(
        M,
        /*row*/
        e[16]?.position ?? ""
      ), z & /*rows, teamOptions*/
      9 && Se !== (Se = /*row*/
      e[16]?.id) && d(I, "data-line-id", Se), z & /*rows, teamOptions*/
      9 && Ye !== (Ye = /*row*/
      e[16]?.emp ?? "") && N(
        I,
        /*row*/
        e[16]?.emp ?? ""
      ), z & /*rows, teamOptions*/
      9 && Ae !== (Ae = /*row*/
      e[16]?.id) && d(G, "data-line-id", Ae), z & /*rows, teamOptions*/
      9 && $e !== ($e = /*row*/
      e[16]?.sex ?? "") && N(
        G,
        /*row*/
        e[16]?.sex ?? ""
      ), z & /*rows, teamOptions*/
      9 && Le !== (Le = /*row*/
      e[16]?.id) && d(B, "data-line-id", Le), z & /*rows, teamOptions*/
      9 && tt !== (tt = /*row*/
      e[16]?.function ?? "") && N(
        B,
        /*row*/
        e[16]?.function ?? ""
      ), z & /*rows*/
      1 && Ce !== (Ce = /*row*/
      (e[16]?.rdos ?? "—") + "") && q(Be, Ce), z & /*rows*/
      1 && Ee !== (Ee = /*row*/
      (e[16]?.paid ?? "") + "") && q(Pe, Ee), z & /*dayClass, rows, emitDay*/
      33) {
        Xe = K([0, 1, 2, 3, 4, 5, 6]);
        let u;
        for (u = 0; u < 7; u += 1) {
          const U = ct(e, Xe, u);
          X[u] ? X[u].p(U, z) : (X[u] = yt(U), X[u].c(), X[u].m(n, xe));
        }
        for (; u < 7; u += 1)
          X[u].d(1);
      }
      z & /*rows*/
      1 && Fe !== (Fe = /*row*/
      (e[16]?.hours ?? "") + "") && q(Ge, Fe), z & /*rows, teamOptions*/
      9 && Me !== (Me = /*row*/
      e[16]?.id) && d(n, "data-line-row", Me);
    },
    d(_) {
      _ && H(n), He(D, _), He(E, _), He(X, _), Ne = !1, me(ot);
    }
  };
}
function $t(t) {
  let e;
  function n(i, h) {
    return (
      /*mode*/
      i[1] === "svelte" ? Zt : Yt
    );
  }
  let l = n(t), o = l(t);
  return {
    c() {
      e = v("div"), o.c(), d(e, "class", "lines-table-root svelte-1yzw1rx"), J(e, "min-height", "min(70vh, 720px)"), J(e, "height", "min(70vh, 720px)"), J(e, "width", "100%");
    },
    m(i, h) {
      Q(i, e, h), o.m(e, null);
    },
    p(i, [h]) {
      l === (l = n(i)) && o ? o.p(i, h) : (o.d(1), o = l(i), o && (o.c(), o.m(e, null)));
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
  let { rows: l = [] } = e, { mode: o = "svelte" } = e, { shiftOptions: i = [] } = e, { teamOptions: h = [] } = e, { onInlineEdit: R = null } = e, { onDayToggle: S = null } = e;
  function p(y, O, P) {
    R?.({ lineId: y, field: O, value: P });
  }
  function g(y, O) {
    S?.({ lineId: y, dayIndex: O });
  }
  const m = (y, O) => p(y?.id, "team", O.target.value), w = (y, O) => p(y?.id, "lineCode", O.target.value), b = (y, O) => p(y?.id, "shift", O.target.value), r = (y, O) => p(y?.id, "position", O.target.value), a = (y, O) => p(y?.id, "emp", O.target.value), c = (y, O) => p(y?.id, "sex", O.target.value), f = (y, O) => p(y?.id, "function", O.target.value), L = (y, O) => g(y?.id, O);
  return t.$$set = (y) => {
    "rows" in y && n(0, l = y.rows), "mode" in y && n(1, o = y.mode), "shiftOptions" in y && n(2, i = y.shiftOptions), "teamOptions" in y && n(3, h = y.teamOptions), "onInlineEdit" in y && n(6, R = y.onInlineEdit), "onDayToggle" in y && n(7, S = y.onDayToggle);
  }, [
    l,
    o,
    i,
    h,
    p,
    g,
    R,
    S,
    m,
    w,
    b,
    r,
    a,
    c,
    f,
    L
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
    const c = String(r), f = e.state && e.state.functionRotation, L = f && (f[c] || f[r]);
    if (!Array.isArray(L)) return null;
    const y = L[a];
    return y === "BAG" ? "BAG" : y === "PAX" || y === "DFO" ? "PAX" : null;
  }
  function i(r, a, c) {
    var f = String(r);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[f] || (e.state.functionRotation[f] = []); e.state.functionRotation[f].length <= a; ) e.state.functionRotation[f].push(null);
    e.state.functionRotation[f][a] = c;
  }
  function h(r) {
    if (!r) return !1;
    if (r.function === "DFO") return !0;
    const a = r.functionEligible;
    return !!(a && (a.dfo === !0 || a.DFO === !0));
  }
  function R() {
    const r = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], a = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(r)) : r, c = e.state && e.state.schedule || {}, f = typeof e.getRowModels == "function" ? e.getRowModels(a, c, l()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(l()) : [];
    return Array.isArray(f) ? f : [];
  }
  function S() {
    return e.teams && Array.isArray(e.teams.teams) ? e.teams.teams : [];
  }
  function p() {
    return e.state && Array.isArray(e.state.shifts) ? e.state.shifts : [];
  }
  function g(r) {
    if (!r || typeof r.$set != "function") return;
    const a = R();
    r.$set({
      rows: Array.isArray(a) ? a : [],
      shiftOptions: p(),
      teamOptions: S()
    });
  }
  function m(r) {
    if (!r) return;
    const a = e.findLineById ? e.findLineById(r.lineId) : null;
    if (!a) return;
    const c = r.field, f = r.value;
    c === "lineCode" ? a.lineCode = String(f || "").trim() || a.lineCode : c === "sex" ? a.sex = f === "F" ? "F" : "M" : c === "function" ? a.function = f === "DFO" || f === "PAX" || f === "BAG" ? f : "" : c === "emp" || c === "position" ? e.applyLineEmp && e.applyLineEmp(a, f) : c === "shift" ? e.applyLineShift && e.applyLineShift(a, f) : c === "team" && e.setLineTeam && e.setLineTeam(r.lineId, f), e.updateStatus && e.updateStatus("Updated " + (a.lineCode || r.lineId)), b(), (c === "emp" || c === "position" || c === "shift") && e.renderCoverageBars && e.renderCoverageBars(), c === "team" && e.renderTeams && e.renderTeams();
  }
  function w(r) {
    if (!r) return;
    const a = e.findLineById ? e.findLineById(r.lineId) : null, c = Number(r.dayIndex);
    if (!a || !Number.isInteger(c) || c < 0 || c > 6) return;
    const f = String(a.id);
    e.state.schedule || (e.state.schedule = {});
    var L = e.state.schedule[f] || e.state.schedule[a.id];
    for (Array.isArray(L) || (L = []), e.state.schedule[f] = L; e.state.schedule[f].length < 7; ) e.state.schedule[f].push("RDO");
    e.state.functionRotation || (e.state.functionRotation = {}), !e.state.functionRotation[f] && e.state.functionRotation[a.id] && (e.state.functionRotation[f] = e.state.functionRotation[a.id]);
    const y = e.state.schedule[f][c] || "RDO", O = a.function === "BAG", P = h(a);
    if (y !== "WORK")
      e.state.schedule[f][c] = "WORK", O ? i(f, c, "BAG") : P ? i(f, c, "PAX") : i(f, c, null);
    else if (O)
      e.state.schedule[f][c] = "RDO", i(f, c, null);
    else if (P) {
      var x = typeof e.getRotationDuty == "function" ? e.getRotationDuty(a.id, c) : o(a.id, c), k = x === "DFO" || x === "PAX" || !x ? "PAX" : x;
      k === "PAX" ? i(f, c, "BAG") : (e.state.schedule[f][c] = "RDO", i(f, c, null));
    } else
      e.state.schedule[f][c] = "RDO", i(f, c, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(a), b(), e.renderCoverageBars && e.renderCoverageBars();
  }
  const b = () => {
    try {
      const r = n._linesTableApp;
      if (r)
        g(r);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const a = R();
        n._linesTableApp = new tn({
          target: n,
          props: {
            rows: Array.isArray(a) ? a : [],
            shiftOptions: p(),
            teamOptions: S(),
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
