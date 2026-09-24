var Mt = Object.defineProperty;
var Pt = (t, e, n) => e in t ? Mt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ue = (t, e, n) => Pt(t, typeof e != "symbol" ? e + "" : e, n);
function Z() {
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
function At(t) {
  return typeof t == "function";
}
function Gt(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Nt(t) {
  return Object.keys(t).length === 0;
}
function ut(t) {
  return t ?? "";
}
function s(t, e) {
  t.appendChild(e);
}
function Y(t, e, n) {
  t.insertBefore(e, n || null);
}
function K(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function je(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function p(t) {
  return document.createElement(t);
}
function j(t) {
  return document.createTextNode(t);
}
function G() {
  return j(" ");
}
function z(t, e, n, l) {
  return t.addEventListener(e, n, l), () => t.removeEventListener(e, n, l);
}
function r(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Vt(t) {
  return Array.from(t.childNodes);
}
function Q(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function k(t, e) {
  t.value = e ?? "";
}
function L(t, e, n, l) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
function H(t, e, n) {
  for (let l = 0; l < t.options.length; l += 1) {
    const o = t.options[l];
    if (o.__value === e) {
      o.selected = !0;
      return;
    }
  }
  t.selectedIndex = -1;
}
let ze;
function be(t) {
  ze = t;
}
const ge = [], rt = [];
let ye = [];
const ft = [], Xt = /* @__PURE__ */ Promise.resolve();
let We = !1;
function Ht() {
  We || (We = !0, Xt.then(Ct));
}
function qe(t) {
  ye.push(t);
}
const Ke = /* @__PURE__ */ new Set();
let ve = 0;
function Ct() {
  if (ve !== 0)
    return;
  const t = ze;
  do {
    try {
      for (; ve < ge.length; ) {
        const e = ge[ve];
        ve++, be(e), Ut(e.$$);
      }
    } catch (e) {
      throw ge.length = 0, ve = 0, e;
    }
    for (be(null), ge.length = 0, ve = 0; rt.length; ) rt.pop()();
    for (let e = 0; e < ye.length; e += 1) {
      const n = ye[e];
      Ke.has(n) || (Ke.add(n), n());
    }
    ye.length = 0;
  } while (ge.length);
  for (; ft.length; )
    ft.pop()();
  We = !1, Ke.clear(), be(t);
}
function Ut(t) {
  if (t.fragment !== null) {
    t.update(), me(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(qe);
  }
}
function jt(t) {
  const e = [], n = [];
  ye.forEach((l) => t.indexOf(l) === -1 ? e.push(l) : n.push(l)), n.forEach((l) => l()), ye = e;
}
const Kt = /* @__PURE__ */ new Set();
function Ot(t, e) {
  t && t.i && (Kt.delete(t), t.i(e));
}
function J(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function Wt(t, e) {
  t.d(1), e.delete(t.key);
}
function qt(t, e, n, l, o, i, a, E, S, b, y, c) {
  let m = t.length, C = i.length, O = m;
  const u = {};
  for (; O--; ) u[t[O].key] = O;
  const f = [], g = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map(), M = [];
  for (O = C; O--; ) {
    const w = c(o, i, O), R = n(w);
    let D = a.get(R);
    D ? M.push(() => D.p(w, e)) : (D = b(R, w), D.c()), g.set(R, f[O] = D), R in u && _.set(R, Math.abs(O - u[R]));
  }
  const T = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Set();
  function F(w) {
    Ot(w, 1), w.m(E, y), a.set(w.key, w), y = w.first, C--;
  }
  for (; m && C; ) {
    const w = f[C - 1], R = t[m - 1], D = w.key, W = R.key;
    w === R ? (y = w.first, m--, C--) : g.has(W) ? !a.has(D) || T.has(D) ? F(w) : v.has(W) ? m-- : _.get(D) > _.get(W) ? (v.add(D), F(w)) : (T.add(W), m--) : (S(R, a), m--);
  }
  for (; m--; ) {
    const w = t[m];
    g.has(w.key) || S(w, a);
  }
  for (; C; ) F(f[C - 1]);
  return me(M), f;
}
function zt(t, e, n) {
  const { fragment: l, after_update: o } = t.$$;
  l && l.m(e, n), qe(() => {
    const i = t.$$.on_mount.map(St).filter(At);
    t.$$.on_destroy ? t.$$.on_destroy.push(...i) : me(i), t.$$.on_mount = [];
  }), o.forEach(qe);
}
function Jt(t, e) {
  const n = t.$$;
  n.fragment !== null && (jt(n.after_update), me(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function Qt(t, e) {
  t.$$.dirty[0] === -1 && (ge.push(t), Ht(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function Yt(t, e, n, l, o, i, a = null, E = [-1]) {
  const S = ze;
  be(t);
  const b = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: i,
    update: Z,
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
    dirty: E,
    skip_bound: !1,
    root: e.target || S.$$.root
  };
  a && a(b.root);
  let y = !1;
  if (b.ctx = n ? n(t, e.props || {}, (c, m, ...C) => {
    const O = C.length ? C[0] : m;
    return b.ctx && o(b.ctx[c], b.ctx[c] = O) && (!b.skip_bound && b.bound[c] && b.bound[c](O), y && Qt(t, c)), m;
  }) : [], b.update(), y = !0, me(b.before_update), b.fragment = l ? l(b.ctx) : !1, e.target) {
    if (e.hydrate) {
      const c = Vt(e.target);
      b.fragment && b.fragment.l(c), c.forEach(K);
    } else
      b.fragment && b.fragment.c();
    e.intro && Ot(t.$$.fragment), zt(t, e.target, e.anchor), Ct();
  }
  be(S);
}
class Zt {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Ue(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Ue(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    Jt(this, 1), this.$destroy = Z;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, n) {
    if (!At(n))
      return Z;
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
    this.$$set && !Nt(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const $t = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add($t);
function dt() {
  return {
    rdo: "#000000",
    bag: "#F4B4B4",
    dfo: "#FFF3A8",
    pax: "#A0C4FF",
    header: "#1F4E79"
  };
}
function xt(t, e) {
  if (!t) return e;
  var n = String(t).replace("#", "").trim();
  return n.length === 3 && (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]), n.length !== 6 || /[^0-9a-fA-F]/.test(n) ? e : "#" + n.toUpperCase();
}
function en(t) {
  var e = xt(t, "#FFFFFF") || "#FFFFFF", n = e.slice(1), l = parseInt(n.slice(0, 2), 16), o = parseInt(n.slice(2, 4), 16), i = parseInt(n.slice(4, 6), 16), a = (0.299 * l + 0.587 * o + 0.114 * i) / 255;
  return a < 0.45 ? "#FFFFFF" : "#111111";
}
function ct(t, e, n) {
  const l = t.slice();
  return l[18] = e[n], l;
}
function _t(t, e, n) {
  const l = t.slice();
  return l[21] = e[n], l;
}
function ht(t, e, n) {
  const l = t.slice();
  return l[24] = e[n], l;
}
function pt(t, e, n) {
  const l = t.slice();
  return l[27] = e[n], l;
}
function tn(t) {
  let e;
  return {
    c() {
      e = p("div"), e.textContent = "Classic Lines mode active", r(e, "class", "muted");
    },
    m(n, l) {
      Y(n, e, l);
    },
    p: Z,
    d(n) {
      n && K(e);
    }
  };
}
function nn(t) {
  let e, n, l, o, i, a = [], E = /* @__PURE__ */ new Map(), S = J(
    /*rows*/
    t[0]
  );
  const b = (c) => (
    /*row*/
    c[18].id
  );
  for (let c = 0; c < S.length; c += 1) {
    let m = ct(t, S, c), C = b(m);
    E.set(C, a[c] = bt(C, m));
  }
  let y = null;
  return S.length || (y = vt()), {
    c() {
      e = p("div"), n = p("table"), l = p("thead"), l.innerHTML = '<tr><th class="svelte-5u69by">Team</th> <th class="svelte-5u69by">Line</th> <th class="svelte-5u69by">Shift</th> <th class="svelte-5u69by">Start</th> <th class="svelte-5u69by">End</th> <th class="svelte-5u69by">Position</th> <th class="svelte-5u69by">Emp</th> <th class="svelte-5u69by">Sex</th> <th class="svelte-5u69by">Function</th> <th class="svelte-5u69by">RDOs</th> <th class="svelte-5u69by">Paid</th> <th class="svelte-5u69by">Sun</th> <th class="svelte-5u69by">Mon</th> <th class="svelte-5u69by">Tue</th> <th class="svelte-5u69by">Wed</th> <th class="svelte-5u69by">Thu</th> <th class="svelte-5u69by">Fri</th> <th class="svelte-5u69by">Sat</th> <th class="svelte-5u69by">Hours</th></tr>', o = G(), i = p("tbody");
      for (let c = 0; c < a.length; c += 1)
        a[c].c();
      y && y.c(), r(n, "class", "data-table lines-editable svelte-5u69by"), L(n, "width", "max-content"), L(n, "min-width", "1100px"), r(e, "class", "lines-virtual-root svelte-5u69by"), L(e, "height", "100%"), L(e, "overflow", "auto"), L(e, "position", "relative");
    },
    m(c, m) {
      Y(c, e, m), s(e, n), s(n, l), s(n, o), s(n, i);
      for (let C = 0; C < a.length; C += 1)
        a[C] && a[C].m(i, null);
      y && y.m(i, null);
    },
    p(c, m) {
      m & /*rows, dayClass, dayStyle, emitDay, emitEdit, shiftOptions, shiftLabel, teamOptions*/
      237 && (S = J(
        /*rows*/
        c[0]
      ), a = qt(a, m, b, 1, c, S, E, i, Wt, bt, null, ct), !S.length && y ? y.p(c, m) : S.length ? y && (y.d(1), y = null) : (y = vt(), y.c(), y.m(i, null)));
    },
    d(c) {
      c && K(e);
      for (let m = 0; m < a.length; m += 1)
        a[m].d();
      y && y.d();
    }
  };
}
function vt(t) {
  let e;
  return {
    c() {
      e = p("tr"), e.innerHTML = '<td colspan="19" class="muted svelte-5u69by">No lines — Generate or Import first.</td>';
    },
    m(n, l) {
      Y(n, e, l);
    },
    p: Z,
    d(n) {
      n && K(e);
    }
  };
}
function gt(t) {
  let e, n = (
    /*team*/
    (t[27].name ?? /*team*/
    t[27].id) + ""
  ), l, o;
  return {
    c() {
      e = p("option"), l = j(n), e.__value = o = /*team*/
      t[27].id, k(e, e.__value);
    },
    m(i, a) {
      Y(i, e, a), s(e, l);
    },
    p(i, a) {
      a & /*teamOptions*/
      8 && n !== (n = /*team*/
      (i[27].name ?? /*team*/
      i[27].id) + "") && Q(l, n), a & /*teamOptions*/
      8 && o !== (o = /*team*/
      i[27].id) && (e.__value = o, k(e, e.__value));
    },
    d(i) {
      i && K(e);
    }
  };
}
function yt(t) {
  let e, n = Ft(
    /*shift*/
    t[24]
  ) + "", l, o;
  return {
    c() {
      e = p("option"), l = j(n), e.__value = o = /*shift*/
      t[24].id, k(e, e.__value);
    },
    m(i, a) {
      Y(i, e, a), s(e, l);
    },
    p(i, a) {
      a & /*shiftOptions*/
      4 && n !== (n = Ft(
        /*shift*/
        i[24]
      ) + "") && Q(l, n), a & /*shiftOptions*/
      4 && o !== (o = /*shift*/
      i[24].id) && (e.__value = o, k(e, e.__value));
    },
    d(i) {
      i && K(e);
    }
  };
}
function mt(t) {
  let e, n = (
    /*row*/
    (t[18]?.days?.[
      /*i*/
      t[21]
    ] ?? "") + ""
  ), l, o, i, a, E, S;
  function b() {
    return (
      /*click_handler*/
      t[17](
        /*row*/
        t[18],
        /*i*/
        t[21]
      )
    );
  }
  return {
    c() {
      e = p("td"), l = j(n), r(e, "class", o = ut(wt(
        /*row*/
        t[18]?.dayDuties?.[
          /*i*/
          t[21]
        ] ?? /*row*/
        t[18]?.days?.[
          /*i*/
          t[21]
        ]
      )) + " svelte-5u69by"), r(e, "style", i = /*dayStyle*/
      t[5](
        /*row*/
        t[18]?.dayDuties?.[
          /*i*/
          t[21]
        ] ?? /*row*/
        t[18]?.days?.[
          /*i*/
          t[21]
        ]
      )), r(e, "data-line-id", a = /*row*/
      t[18]?.id), r(
        e,
        "data-day-index",
        /*i*/
        t[21]
      );
    },
    m(y, c) {
      Y(y, e, c), s(e, l), E || (S = z(e, "click", b), E = !0);
    },
    p(y, c) {
      t = y, c & /*rows*/
      1 && n !== (n = /*row*/
      (t[18]?.days?.[
        /*i*/
        t[21]
      ] ?? "") + "") && Q(l, n), c & /*rows, teamOptions*/
      9 && o !== (o = ut(wt(
        /*row*/
        t[18]?.dayDuties?.[
          /*i*/
          t[21]
        ] ?? /*row*/
        t[18]?.days?.[
          /*i*/
          t[21]
        ]
      )) + " svelte-5u69by") && r(e, "class", o), c & /*rows, teamOptions*/
      9 && i !== (i = /*dayStyle*/
      t[5](
        /*row*/
        t[18]?.dayDuties?.[
          /*i*/
          t[21]
        ] ?? /*row*/
        t[18]?.days?.[
          /*i*/
          t[21]
        ]
      )) && r(e, "style", i), c & /*rows, teamOptions*/
      9 && a !== (a = /*row*/
      t[18]?.id) && r(e, "data-line-id", a);
    },
    d(y) {
      y && K(e), E = !1, S();
    }
  };
}
function bt(t, e) {
  let n, l, o, i, a, E, S, b, y, c, m, C, O, u, f, g, _, M, T, v = (
    /*row*/
    (e[18]?.start ?? "") + ""
  ), F, w, R, D = (
    /*row*/
    (e[18]?.end ?? "") + ""
  ), W, Je, Fe, N, $, x, ee, te, we, Qe, Ye, Se, P, ne, le, ie, oe, se, Ae, Ze, $e, Ce, X, ae, ue, re, Oe, xe, et, ke, V, fe, de, ce, _e, Re, tt, nt, Ee, Le = (
    /*row*/
    (e[18]?.rdos ?? "—") + ""
  ), Pe, lt, Te, De = (
    /*row*/
    (e[18]?.paid ?? "") + ""
  ), Ge, it, Ne, Ie, Be = (
    /*row*/
    (e[18]?.hours ?? "") + ""
  ), Ve, ot, Me, Xe, st, he = J(
    /*teamOptions*/
    e[3]
  ), I = [];
  for (let h = 0; h < he.length; h += 1)
    I[h] = gt(pt(e, he, h));
  function Rt(...h) {
    return (
      /*change_handler*/
      e[10](
        /*row*/
        e[18],
        ...h
      )
    );
  }
  function Et(...h) {
    return (
      /*input_handler*/
      e[11](
        /*row*/
        e[18],
        ...h
      )
    );
  }
  let pe = J(
    /*shiftOptions*/
    e[2]
  ), B = [];
  for (let h = 0; h < pe.length; h += 1)
    B[h] = yt(ht(e, pe, h));
  function Lt(...h) {
    return (
      /*change_handler_1*/
      e[12](
        /*row*/
        e[18],
        ...h
      )
    );
  }
  function Tt(...h) {
    return (
      /*change_handler_2*/
      e[13](
        /*row*/
        e[18],
        ...h
      )
    );
  }
  function Dt(...h) {
    return (
      /*change_handler_3*/
      e[14](
        /*row*/
        e[18],
        ...h
      )
    );
  }
  function It(...h) {
    return (
      /*change_handler_4*/
      e[15](
        /*row*/
        e[18],
        ...h
      )
    );
  }
  function Bt(...h) {
    return (
      /*change_handler_5*/
      e[16](
        /*row*/
        e[18],
        ...h
      )
    );
  }
  let He = J([0, 1, 2, 3, 4, 5, 6]), U = [];
  for (let h = 0; h < 7; h += 1)
    U[h] = mt(_t(e, He, h));
  return {
    key: t,
    first: null,
    c() {
      n = p("tr"), l = p("td"), o = p("select"), i = p("option"), i.textContent = "—";
      for (let h = 0; h < I.length; h += 1)
        I[h].c();
      S = G(), b = p("td"), y = p("input"), C = G(), O = p("td"), u = p("select"), f = p("option"), f.textContent = "—";
      for (let h = 0; h < B.length; h += 1)
        B[h].c();
      M = G(), T = p("td"), F = j(v), w = G(), R = p("td"), W = j(D), Je = G(), Fe = p("td"), N = p("select"), $ = p("option"), $.textContent = "—", x = p("option"), x.textContent = "TSO", ee = p("option"), ee.textContent = "LTSO", te = p("option"), te.textContent = "STSO", Ye = G(), Se = p("td"), P = p("select"), ne = p("option"), ne.textContent = "—", le = p("option"), le.textContent = "FT", ie = p("option"), ie.textContent = "PT", oe = p("option"), oe.textContent = "LTSO", se = p("option"), se.textContent = "STSO", $e = G(), Ce = p("td"), X = p("select"), ae = p("option"), ae.textContent = "—", ue = p("option"), ue.textContent = "M", re = p("option"), re.textContent = "F", et = G(), ke = p("td"), V = p("select"), fe = p("option"), fe.textContent = "—", de = p("option"), de.textContent = "DFO", ce = p("option"), ce.textContent = "BAG", _e = p("option"), _e.textContent = "PAX", nt = G(), Ee = p("td"), Pe = j(Le), lt = G(), Te = p("td"), Ge = j(De), it = G();
      for (let h = 0; h < 7; h += 1)
        U[h].c();
      Ne = G(), Ie = p("td"), Ve = j(Be), ot = G(), i.__value = "", k(i, i.__value), r(o, "class", "line-edit svelte-5u69by"), r(o, "data-field", "team"), r(o, "data-line-id", a = /*row*/
      e[18]?.id), r(l, "class", "svelte-5u69by"), r(y, "type", "text"), r(y, "class", "line-edit line-code-input svelte-5u69by"), r(y, "data-field", "lineCode"), r(y, "data-line-id", c = /*row*/
      e[18]?.id), y.value = m = /*row*/
      e[18]?.line ?? "", r(b, "class", "svelte-5u69by"), f.__value = "", k(f, f.__value), r(u, "class", "line-edit svelte-5u69by"), r(u, "data-field", "shift"), r(u, "data-line-id", g = /*row*/
      e[18]?.id), r(O, "class", "svelte-5u69by"), r(T, "class", "svelte-5u69by"), r(R, "class", "svelte-5u69by"), $.__value = "", k($, $.__value), x.__value = "TSO", k(x, x.__value), ee.__value = "LTSO", k(ee, ee.__value), te.__value = "STSO", k(te, te.__value), r(N, "class", "line-edit svelte-5u69by"), r(N, "data-field", "position"), r(N, "data-line-id", we = /*row*/
      e[18]?.id), r(Fe, "class", "svelte-5u69by"), ne.__value = "", k(ne, ne.__value), le.__value = "FT", k(le, le.__value), ie.__value = "PT", k(ie, ie.__value), oe.__value = "LTSO", k(oe, oe.__value), se.__value = "STSO", k(se, se.__value), r(P, "class", "line-edit svelte-5u69by"), r(P, "data-field", "emp"), r(P, "data-line-id", Ae = /*row*/
      e[18]?.id), r(Se, "class", "svelte-5u69by"), ae.__value = "", k(ae, ae.__value), ue.__value = "M", k(ue, ue.__value), re.__value = "F", k(re, re.__value), r(X, "class", "line-edit svelte-5u69by"), r(X, "data-field", "sex"), r(X, "data-line-id", Oe = /*row*/
      e[18]?.id), r(Ce, "class", "svelte-5u69by"), fe.__value = "", k(fe, fe.__value), de.__value = "DFO", k(de, de.__value), ce.__value = "BAG", k(ce, ce.__value), _e.__value = "PAX", k(_e, _e.__value), r(V, "class", "line-edit svelte-5u69by"), r(V, "data-field", "function"), r(V, "data-line-id", Re = /*row*/
      e[18]?.id), r(ke, "class", "svelte-5u69by"), r(Ee, "class", "line-rdo-cell svelte-5u69by"), r(Te, "class", "svelte-5u69by"), r(Ie, "class", "line-hours svelte-5u69by"), r(n, "data-line-row", Me = /*row*/
      e[18]?.id), this.first = n;
    },
    m(h, A) {
      Y(h, n, A), s(n, l), s(l, o), s(o, i);
      for (let d = 0; d < I.length; d += 1)
        I[d] && I[d].m(o, null);
      H(
        o,
        /*row*/
        e[18]?.teamId ?? ""
      ), s(n, S), s(n, b), s(b, y), s(n, C), s(n, O), s(O, u), s(u, f);
      for (let d = 0; d < B.length; d += 1)
        B[d] && B[d].m(u, null);
      H(
        u,
        /*row*/
        e[18]?.shiftId ?? ""
      ), s(n, M), s(n, T), s(T, F), s(n, w), s(n, R), s(R, W), s(n, Je), s(n, Fe), s(Fe, N), s(N, $), s(N, x), s(N, ee), s(N, te), H(
        N,
        /*row*/
        e[18]?.position ?? ""
      ), s(n, Ye), s(n, Se), s(Se, P), s(P, ne), s(P, le), s(P, ie), s(P, oe), s(P, se), H(
        P,
        /*row*/
        e[18]?.emp ?? ""
      ), s(n, $e), s(n, Ce), s(Ce, X), s(X, ae), s(X, ue), s(X, re), H(
        X,
        /*row*/
        e[18]?.sex ?? ""
      ), s(n, et), s(n, ke), s(ke, V), s(V, fe), s(V, de), s(V, ce), s(V, _e), H(
        V,
        /*row*/
        e[18]?.function ?? ""
      ), s(n, nt), s(n, Ee), s(Ee, Pe), s(n, lt), s(n, Te), s(Te, Ge), s(n, it);
      for (let d = 0; d < 7; d += 1)
        U[d] && U[d].m(n, null);
      s(n, Ne), s(n, Ie), s(Ie, Ve), s(n, ot), Xe || (st = [
        z(o, "change", Rt),
        z(y, "input", Et),
        z(u, "change", Lt),
        z(N, "change", Tt),
        z(P, "change", Dt),
        z(X, "change", It),
        z(V, "change", Bt)
      ], Xe = !0);
    },
    p(h, A) {
      if (e = h, A & /*teamOptions*/
      8) {
        he = J(
          /*teamOptions*/
          e[3]
        );
        let d;
        for (d = 0; d < he.length; d += 1) {
          const q = pt(e, he, d);
          I[d] ? I[d].p(q, A) : (I[d] = gt(q), I[d].c(), I[d].m(o, null));
        }
        for (; d < I.length; d += 1)
          I[d].d(1);
        I.length = he.length;
      }
      if (A & /*rows, teamOptions*/
      9 && a !== (a = /*row*/
      e[18]?.id) && r(o, "data-line-id", a), A & /*rows, teamOptions*/
      9 && E !== (E = /*row*/
      e[18]?.teamId ?? "") && H(
        o,
        /*row*/
        e[18]?.teamId ?? ""
      ), A & /*rows, teamOptions*/
      9 && c !== (c = /*row*/
      e[18]?.id) && r(y, "data-line-id", c), A & /*rows, teamOptions*/
      9 && m !== (m = /*row*/
      e[18]?.line ?? "") && y.value !== m && (y.value = m), A & /*shiftOptions, shiftLabel*/
      4) {
        pe = J(
          /*shiftOptions*/
          e[2]
        );
        let d;
        for (d = 0; d < pe.length; d += 1) {
          const q = ht(e, pe, d);
          B[d] ? B[d].p(q, A) : (B[d] = yt(q), B[d].c(), B[d].m(u, null));
        }
        for (; d < B.length; d += 1)
          B[d].d(1);
        B.length = pe.length;
      }
      if (A & /*rows, teamOptions*/
      9 && g !== (g = /*row*/
      e[18]?.id) && r(u, "data-line-id", g), A & /*rows, teamOptions*/
      9 && _ !== (_ = /*row*/
      e[18]?.shiftId ?? "") && H(
        u,
        /*row*/
        e[18]?.shiftId ?? ""
      ), A & /*rows*/
      1 && v !== (v = /*row*/
      (e[18]?.start ?? "") + "") && Q(F, v), A & /*rows*/
      1 && D !== (D = /*row*/
      (e[18]?.end ?? "") + "") && Q(W, D), A & /*rows, teamOptions*/
      9 && we !== (we = /*row*/
      e[18]?.id) && r(N, "data-line-id", we), A & /*rows, teamOptions*/
      9 && Qe !== (Qe = /*row*/
      e[18]?.position ?? "") && H(
        N,
        /*row*/
        e[18]?.position ?? ""
      ), A & /*rows, teamOptions*/
      9 && Ae !== (Ae = /*row*/
      e[18]?.id) && r(P, "data-line-id", Ae), A & /*rows, teamOptions*/
      9 && Ze !== (Ze = /*row*/
      e[18]?.emp ?? "") && H(
        P,
        /*row*/
        e[18]?.emp ?? ""
      ), A & /*rows, teamOptions*/
      9 && Oe !== (Oe = /*row*/
      e[18]?.id) && r(X, "data-line-id", Oe), A & /*rows, teamOptions*/
      9 && xe !== (xe = /*row*/
      e[18]?.sex ?? "") && H(
        X,
        /*row*/
        e[18]?.sex ?? ""
      ), A & /*rows, teamOptions*/
      9 && Re !== (Re = /*row*/
      e[18]?.id) && r(V, "data-line-id", Re), A & /*rows, teamOptions*/
      9 && tt !== (tt = /*row*/
      e[18]?.function ?? "") && H(
        V,
        /*row*/
        e[18]?.function ?? ""
      ), A & /*rows*/
      1 && Le !== (Le = /*row*/
      (e[18]?.rdos ?? "—") + "") && Q(Pe, Le), A & /*rows*/
      1 && De !== (De = /*row*/
      (e[18]?.paid ?? "") + "") && Q(Ge, De), A & /*dayClass, rows, dayStyle, emitDay*/
      161) {
        He = J([0, 1, 2, 3, 4, 5, 6]);
        let d;
        for (d = 0; d < 7; d += 1) {
          const q = _t(e, He, d);
          U[d] ? U[d].p(q, A) : (U[d] = mt(q), U[d].c(), U[d].m(n, Ne));
        }
        for (; d < 7; d += 1)
          U[d].d(1);
      }
      A & /*rows*/
      1 && Be !== (Be = /*row*/
      (e[18]?.hours ?? "") + "") && Q(Ve, Be), A & /*rows, teamOptions*/
      9 && Me !== (Me = /*row*/
      e[18]?.id) && r(n, "data-line-row", Me);
    },
    d(h) {
      h && K(n), je(I, h), je(B, h), je(U, h), Xe = !1, me(st);
    }
  };
}
function ln(t) {
  let e;
  function n(i, a) {
    return (
      /*mode*/
      i[1] === "svelte" ? nn : tn
    );
  }
  let l = n(t), o = l(t);
  return {
    c() {
      e = p("div"), o.c(), r(e, "class", "lines-table-root svelte-5u69by"), L(e, "min-height", "min(70vh, 720px)"), L(e, "height", "min(70vh, 720px)"), L(e, "width", "100%"), L(
        e,
        "--export-rdo",
        /*exportStyle*/
        t[4]?.rdo || "#000000"
      ), L(
        e,
        "--export-bag",
        /*exportStyle*/
        t[4]?.bag || "#F4B4B4"
      ), L(
        e,
        "--export-dfo",
        /*exportStyle*/
        t[4]?.dfo || "#FFF3A8"
      ), L(
        e,
        "--export-pax",
        /*exportStyle*/
        t[4]?.pax || "#A0C4FF"
      ), L(
        e,
        "--export-header",
        /*exportStyle*/
        t[4]?.header || "#1F4E79"
      );
    },
    m(i, a) {
      Y(i, e, a), o.m(e, null);
    },
    p(i, [a]) {
      l === (l = n(i)) && o ? o.p(i, a) : (o.d(1), o = l(i), o && (o.c(), o.m(e, null))), a & /*exportStyle*/
      16 && L(
        e,
        "--export-rdo",
        /*exportStyle*/
        i[4]?.rdo || "#000000"
      ), a & /*exportStyle*/
      16 && L(
        e,
        "--export-bag",
        /*exportStyle*/
        i[4]?.bag || "#F4B4B4"
      ), a & /*exportStyle*/
      16 && L(
        e,
        "--export-dfo",
        /*exportStyle*/
        i[4]?.dfo || "#FFF3A8"
      ), a & /*exportStyle*/
      16 && L(
        e,
        "--export-pax",
        /*exportStyle*/
        i[4]?.pax || "#A0C4FF"
      ), a & /*exportStyle*/
      16 && L(
        e,
        "--export-header",
        /*exportStyle*/
        i[4]?.header || "#1F4E79"
      );
    },
    i: Z,
    o: Z,
    d(i) {
      i && K(e), o.d();
    }
  };
}
function Ft(t) {
  if (!t) return "";
  const e = t.name || t.id || "";
  return t.start && t.end ? (e ? e + " " : "") + "(" + t.start + "–" + t.end + ")" : t.start ? e ? e + " " + t.start : t.start : e;
}
function kt(t) {
  const e = String(t || "").toUpperCase();
  return e === "RDO" || e === "—" || e === "-" ? "rdo" : e === "BAG" || e === "BAGS" ? "bag" : e === "DFO" ? "dfo" : e === "PAX" ? "pax" : null;
}
function wt(t) {
  const e = kt(t);
  return e === "rdo" ? "cell-toggle cell-rdo" : e === "bag" ? "cell-toggle cell-function-duty cell-bag" : e === "dfo" ? "cell-toggle cell-function-duty cell-dfo" : e === "pax" ? "cell-toggle cell-function-duty cell-pax" : "cell-toggle cell-work";
}
function on(t, e, n) {
  let { rows: l = [] } = e, { mode: o = "svelte" } = e, { shiftOptions: i = [] } = e, { teamOptions: a = [] } = e, { exportStyle: E = dt() } = e, { onInlineEdit: S = null } = e, { onDayToggle: b = null } = e;
  function y(v) {
    const F = kt(v);
    if (!F) return;
    const R = (E || dt())[F];
    if (R)
      return "background:" + R + ";color:" + en(R) + ";";
  }
  function c(v, F, w) {
    S?.({ lineId: v, field: F, value: w });
  }
  function m(v, F) {
    b?.({ lineId: v, dayIndex: F });
  }
  const C = (v, F) => c(v?.id, "team", F.target.value), O = (v, F) => c(v?.id, "lineCode", F.target.value), u = (v, F) => c(v?.id, "shift", F.target.value), f = (v, F) => c(v?.id, "position", F.target.value), g = (v, F) => c(v?.id, "emp", F.target.value), _ = (v, F) => c(v?.id, "sex", F.target.value), M = (v, F) => c(v?.id, "function", F.target.value), T = (v, F) => m(v?.id, F);
  return t.$$set = (v) => {
    "rows" in v && n(0, l = v.rows), "mode" in v && n(1, o = v.mode), "shiftOptions" in v && n(2, i = v.shiftOptions), "teamOptions" in v && n(3, a = v.teamOptions), "exportStyle" in v && n(4, E = v.exportStyle), "onInlineEdit" in v && n(8, S = v.onInlineEdit), "onDayToggle" in v && n(9, b = v.onDayToggle);
  }, [
    l,
    o,
    i,
    a,
    E,
    y,
    c,
    m,
    S,
    b,
    C,
    O,
    u,
    f,
    g,
    _,
    M,
    T
  ];
}
class sn extends Zt {
  constructor(e) {
    super(), Yt(this, e, on, ln, Gt, {
      rows: 0,
      mode: 1,
      shiftOptions: 2,
      teamOptions: 3,
      exportStyle: 4,
      onInlineEdit: 8,
      onDayToggle: 9
    });
  }
}
function un(t) {
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
  function o(u, f) {
    const g = String(u), _ = e.state && e.state.functionRotation, M = _ && (_[g] || _[u]);
    if (!Array.isArray(M)) return null;
    const T = M[f];
    return T === "BAG" ? "BAG" : T === "PAX" || T === "DFO" ? "PAX" : null;
  }
  function i(u, f, g) {
    var _ = String(u);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[_] || (e.state.functionRotation[_] = []); e.state.functionRotation[_].length <= f; ) e.state.functionRotation[_].push(null);
    e.state.functionRotation[_][f] = g;
  }
  function a(u) {
    if (!u) return !1;
    if (u.function === "DFO") return !0;
    const f = u.functionEligible;
    return !!(f && (f.dfo === !0 || f.DFO === !0));
  }
  function E() {
    const u = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], f = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(u)) : u, g = e.state && e.state.schedule || {}, _ = typeof e.getRowModels == "function" ? e.getRowModels(f, g, l()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(l()) : [];
    return Array.isArray(_) ? _ : [];
  }
  function S() {
    return e.teams && Array.isArray(e.teams.teams) ? e.teams.teams : [];
  }
  function b() {
    return e.state && Array.isArray(e.state.shifts) ? e.state.shifts : [];
  }
  function y() {
    return typeof e.getExportStyle == "function" ? e.getExportStyle() : e.state && e.state.exportStyle || null;
  }
  function c(u) {
    if (!u || typeof u.$set != "function") return;
    const f = E();
    typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), u.$set({
      rows: Array.isArray(f) ? f : [],
      shiftOptions: b(),
      teamOptions: S(),
      exportStyle: y()
    });
  }
  function m(u) {
    if (!u) return;
    const f = e.findLineById ? e.findLineById(u.lineId) : null;
    if (!f) return;
    const g = u.field, _ = u.value;
    g === "lineCode" ? f.lineCode = String(_ || "").trim() || f.lineCode : g === "sex" ? f.sex = _ === "F" ? "F" : "M" : g === "function" ? f.function = _ === "DFO" || _ === "PAX" || _ === "BAG" ? _ : "" : g === "emp" || g === "position" ? e.applyLineEmp && e.applyLineEmp(f, _) : g === "shift" ? e.applyLineShift && e.applyLineShift(f, _) : g === "team" && e.setLineTeam && e.setLineTeam(u.lineId, _), e.updateStatus && e.updateStatus("Updated " + (f.lineCode || u.lineId)), O(), (g === "emp" || g === "position" || g === "shift") && e.renderCoverageBars && e.renderCoverageBars(), g === "team" && e.renderTeams && e.renderTeams();
  }
  function C(u) {
    if (!u) return;
    const f = e.findLineById ? e.findLineById(u.lineId) : null, g = Number(u.dayIndex);
    if (!f || !Number.isInteger(g) || g < 0 || g > 6) return;
    const _ = String(f.id);
    e.state.schedule || (e.state.schedule = {});
    var M = e.state.schedule[_] || e.state.schedule[f.id];
    for (Array.isArray(M) || (M = []), e.state.schedule[_] = M; e.state.schedule[_].length < 7; ) e.state.schedule[_].push("RDO");
    e.state.functionRotation || (e.state.functionRotation = {}), !e.state.functionRotation[_] && e.state.functionRotation[f.id] && (e.state.functionRotation[_] = e.state.functionRotation[f.id]);
    const T = e.state.schedule[_][g] || "RDO", v = f.function === "BAG", F = a(f);
    if (T !== "WORK")
      e.state.schedule[_][g] = "WORK", v ? i(_, g, "BAG") : F ? i(_, g, "PAX") : i(_, g, null);
    else if (v)
      e.state.schedule[_][g] = "RDO", i(_, g, null);
    else if (F) {
      var w = typeof e.getRotationDuty == "function" ? e.getRotationDuty(f.id, g) : o(f.id, g), R = w === "DFO" || w === "PAX" || !w ? "PAX" : w;
      R === "PAX" ? i(_, g, "BAG") : (e.state.schedule[_][g] = "RDO", i(_, g, null));
    } else
      e.state.schedule[_][g] = "RDO", i(_, g, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(f), O(), e.renderCoverageBars && e.renderCoverageBars();
  }
  const O = () => {
    try {
      const u = n._linesTableApp;
      if (u)
        c(u);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const f = E();
        typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), n._linesTableApp = new sn({
          target: n,
          props: {
            rows: Array.isArray(f) ? f : [],
            shiftOptions: b(),
            teamOptions: S(),
            exportStyle: y(),
            onInlineEdit: m,
            onDayToggle: C
          }
        });
      }
    } catch (u) {
      console.error("lines-table: refresh failed", u);
    }
  };
  O(), document.addEventListener("click", (u) => {
    const f = u.target.closest?.(".tab-btn");
    f && f.dataset.tab === "lines" && O();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((u) => {
    window.addEventListener(u, O);
  }), n.refresh = O;
}
export {
  un as initLinesTable
};
