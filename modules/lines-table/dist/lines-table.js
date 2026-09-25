var qt = Object.defineProperty;
var zt = (t, e, n) => e in t ? qt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var ze = (t, e, n) => zt(t, typeof e != "symbol" ? e + "" : e, n);
function ee() {
}
function It(t) {
  return t();
}
function ct() {
  return /* @__PURE__ */ Object.create(null);
}
function Re(t) {
  t.forEach(It);
}
function Pt(t) {
  return typeof t == "function";
}
function Jt(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Qt(t) {
  return Object.keys(t).length === 0;
}
function _t(t) {
  return t ?? "";
}
function v(t, e) {
  t.appendChild(e);
}
function Z(t, e, n) {
  t.insertBefore(e, n || null);
}
function Y(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function we(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function R(t) {
  return document.createElement(t);
}
function Q(t) {
  return document.createTextNode(t);
}
function G() {
  return Q(" ");
}
function $(t, e, n, o) {
  return t.addEventListener(e, n, o), () => t.removeEventListener(e, n, o);
}
function g(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Yt(t) {
  return Array.from(t.childNodes);
}
function x(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function T(t, e) {
  t.value = e ?? "";
}
function B(t, e, n, o) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
function X(t, e, n) {
  for (let o = 0; o < t.options.length; o += 1) {
    const u = t.options[o];
    if (u.__value === e) {
      u.selected = !0;
      return;
    }
  }
  t.selectedIndex = -1;
}
let Ze;
function Ae(t) {
  Ze = t;
}
const me = [], ht = [];
let be = [];
const vt = [], Zt = /* @__PURE__ */ Promise.resolve();
let Qe = !1;
function $t() {
  Qe || (Qe = !0, Zt.then(Mt));
}
function Ye(t) {
  be.push(t);
}
const Je = /* @__PURE__ */ new Set();
let ye = 0;
function Mt() {
  if (ye !== 0)
    return;
  const t = Ze;
  do {
    try {
      for (; ye < me.length; ) {
        const e = me[ye];
        ye++, Ae(e), xt(e.$$);
      }
    } catch (e) {
      throw me.length = 0, ye = 0, e;
    }
    for (Ae(null), me.length = 0, ye = 0; ht.length; ) ht.pop()();
    for (let e = 0; e < be.length; e += 1) {
      const n = be[e];
      Je.has(n) || (Je.add(n), n());
    }
    be.length = 0;
  } while (me.length);
  for (; vt.length; )
    vt.pop()();
  Qe = !1, Je.clear(), Ae(t);
}
function xt(t) {
  if (t.fragment !== null) {
    t.update(), Re(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(Ye);
  }
}
function en(t) {
  const e = [], n = [];
  be.forEach((o) => t.indexOf(o) === -1 ? e.push(o) : n.push(o)), n.forEach((o) => o()), be = e;
}
const tn = /* @__PURE__ */ new Set();
function St(t, e) {
  t && t.i && (tn.delete(t), t.i(e));
}
function z(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function nn(t, e) {
  t.d(1), e.delete(t.key);
}
function ln(t, e, n, o, u, l, i, d, s, r, _, h) {
  let A = t.length, F = l.length, D = A;
  const p = {};
  for (; D--; ) p[t[D].key] = D;
  const c = [], b = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), E = [];
  for (D = F; D--; ) {
    const L = h(u, l, D), y = n(L);
    let w = i.get(y);
    w ? E.push(() => w.p(L, e)) : (w = r(y, L), w.c()), b.set(y, c[D] = w), y in p && m.set(y, Math.abs(D - p[y]));
  }
  const k = /* @__PURE__ */ new Set(), C = /* @__PURE__ */ new Set();
  function I(L) {
    St(L, 1), L.m(d, _), i.set(L.key, L), _ = L.first, F--;
  }
  for (; A && F; ) {
    const L = c[F - 1], y = t[A - 1], w = L.key, V = y.key;
    L === y ? (_ = L.first, A--, F--) : b.has(V) ? !i.has(w) || k.has(w) ? I(L) : C.has(V) ? A-- : m.get(w) > m.get(V) ? (C.add(w), I(L)) : (k.add(V), A--) : (s(y, i), A--);
  }
  for (; A--; ) {
    const L = t[A];
    b.has(L.key) || s(L, i);
  }
  for (; F; ) I(c[F - 1]);
  return Re(E), c;
}
function on(t, e, n) {
  const { fragment: o, after_update: u } = t.$$;
  o && o.m(e, n), Ye(() => {
    const l = t.$$.on_mount.map(It).filter(Pt);
    t.$$.on_destroy ? t.$$.on_destroy.push(...l) : Re(l), t.$$.on_mount = [];
  }), u.forEach(Ye);
}
function an(t, e) {
  const n = t.$$;
  n.fragment !== null && (en(n.after_update), Re(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function sn(t, e) {
  t.$$.dirty[0] === -1 && (me.push(t), $t(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function rn(t, e, n, o, u, l, i = null, d = [-1]) {
  const s = Ze;
  Ae(t);
  const r = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: l,
    update: ee,
    not_equal: u,
    bound: ct(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (s ? s.$$.context : [])),
    // everything else
    callbacks: ct(),
    dirty: d,
    skip_bound: !1,
    root: e.target || s.$$.root
  };
  i && i(r.root);
  let _ = !1;
  if (r.ctx = n ? n(t, e.props || {}, (h, A, ...F) => {
    const D = F.length ? F[0] : A;
    return r.ctx && u(r.ctx[h], r.ctx[h] = D) && (!r.skip_bound && r.bound[h] && r.bound[h](D), _ && sn(t, h)), A;
  }) : [], r.update(), _ = !0, Re(r.before_update), r.fragment = o ? o(r.ctx) : !1, e.target) {
    if (e.hydrate) {
      const h = Yt(e.target);
      r.fragment && r.fragment.l(h), h.forEach(Y);
    } else
      r.fragment && r.fragment.c();
    e.intro && St(t.$$.fragment), on(t, e.target, e.anchor), Mt();
  }
  Ae(s);
}
class un {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    ze(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    ze(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    an(this, 1), this.$destroy = ee;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, n) {
    if (!Pt(n))
      return ee;
    const o = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return o.push(n), () => {
      const u = o.indexOf(n);
      u !== -1 && o.splice(u, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !Qt(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const fn = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(fn);
function pt() {
  return {
    rdo: "#000000",
    bag: "#F4B4B4",
    dfo: "#FFF3A8",
    pax: "#A0C4FF",
    header: "#1F4E79"
  };
}
function dn(t, e) {
  if (!t) return e;
  var n = String(t).replace("#", "").trim();
  return n.length === 3 && (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]), n.length !== 6 || /[^0-9a-fA-F]/.test(n) ? e : "#" + n.toUpperCase();
}
function cn(t) {
  var e = dn(t, "#FFFFFF") || "#FFFFFF", n = e.slice(1), o = parseInt(n.slice(0, 2), 16), u = parseInt(n.slice(2, 4), 16), l = parseInt(n.slice(4, 6), 16), i = (0.299 * o + 0.587 * u + 0.114 * l) / 255;
  return i < 0.45 ? "#FFFFFF" : "#111111";
}
function gt(t, e, n) {
  const o = t.slice();
  return o[21] = e[n], o;
}
function yt(t, e, n) {
  const o = t.slice();
  return o[24] = e[n], o;
}
function mt(t, e, n) {
  const o = t.slice();
  return o[27] = e[n], o;
}
function bt(t, e, n) {
  const o = t.slice();
  return o[30] = e[n], o;
}
function Rt(t, e, n) {
  const o = t.slice();
  return o[33] = e[n], o;
}
function wt(t, e, n) {
  const o = t.slice();
  return o[36] = e[n], o;
}
function _n(t) {
  let e;
  return {
    c() {
      e = R("div"), e.textContent = "Classic Lines mode active", g(e, "class", "muted");
    },
    m(n, o) {
      Z(n, e, o);
    },
    p: ee,
    d(n) {
      n && Y(e);
    }
  };
}
function hn(t) {
  let e, n, o, u, l, i = [], d = /* @__PURE__ */ new Map(), s = z(
    /*rows*/
    t[0]
  );
  const r = (h) => (
    /*row*/
    h[21].id
  );
  for (let h = 0; h < s.length; h += 1) {
    let A = gt(t, s, h), F = r(A);
    d.set(F, i[h] = Ct(F, A));
  }
  let _ = null;
  return s.length || (_ = At()), {
    c() {
      e = R("div"), n = R("table"), o = R("thead"), o.innerHTML = '<tr><th class="svelte-5u69by">Team</th> <th class="svelte-5u69by">Line</th> <th class="svelte-5u69by">Shift</th> <th class="svelte-5u69by">Start</th> <th class="svelte-5u69by">End</th> <th class="svelte-5u69by">Position</th> <th class="svelte-5u69by">Emp</th> <th class="svelte-5u69by">Sex</th> <th class="svelte-5u69by">Function</th> <th class="svelte-5u69by">Cert pool</th> <th class="svelte-5u69by">RDOs</th> <th class="svelte-5u69by">Paid</th> <th class="svelte-5u69by">Sun</th> <th class="svelte-5u69by">Mon</th> <th class="svelte-5u69by">Tue</th> <th class="svelte-5u69by">Wed</th> <th class="svelte-5u69by">Thu</th> <th class="svelte-5u69by">Fri</th> <th class="svelte-5u69by">Sat</th> <th class="svelte-5u69by">Hours</th></tr>', u = G(), l = R("tbody");
      for (let h = 0; h < i.length; h += 1)
        i[h].c();
      _ && _.c(), g(n, "class", "data-table lines-editable svelte-5u69by"), B(n, "width", "max-content"), B(n, "min-width", "1100px"), g(e, "class", "lines-virtual-root svelte-5u69by"), B(e, "height", "100%"), B(e, "overflow", "auto"), B(e, "position", "relative");
    },
    m(h, A) {
      Z(h, e, A), v(e, n), v(n, o), v(n, u), v(n, l);
      for (let F = 0; F < i.length; F += 1)
        i[F] && i[F].m(l, null);
      _ && _.m(l, null);
    },
    p(h, A) {
      A[0] & /*rows, dayStyle, emitDay, emitEdit, BASE_EMPS, BASE_POSITIONS, shiftOptions, teamOptions*/
      1005 && (s = z(
        /*rows*/
        h[0]
      ), i = ln(i, A, r, 1, h, s, d, l, nn, Ct, null, gt), !s.length && _ ? _.p(h, A) : s.length ? _ && (_.d(1), _ = null) : (_ = At(), _.c(), _.m(l, null)));
    },
    d(h) {
      h && Y(e);
      for (let A = 0; A < i.length; A += 1)
        i[A].d();
      _ && _.d();
    }
  };
}
function At(t) {
  let e;
  return {
    c() {
      e = R("tr"), e.innerHTML = '<td colspan="20" class="muted svelte-5u69by">No lines — Generate or Import first.</td>';
    },
    m(n, o) {
      Z(n, e, o);
    },
    p: ee,
    d(n) {
      n && Y(e);
    }
  };
}
function Ft(t) {
  let e, n = (
    /*team*/
    (t[36].name ?? /*team*/
    t[36].id) + ""
  ), o, u;
  return {
    c() {
      e = R("option"), o = Q(n), e.__value = u = /*team*/
      t[36].id, T(e, e.__value);
    },
    m(l, i) {
      Z(l, e, i), v(e, o);
    },
    p(l, i) {
      i[0] & /*teamOptions*/
      8 && n !== (n = /*team*/
      (l[36].name ?? /*team*/
      l[36].id) + "") && x(o, n), i[0] & /*teamOptions*/
      8 && u !== (u = /*team*/
      l[36].id) && (e.__value = u, T(e, e.__value));
    },
    d(l) {
      l && Y(e);
    }
  };
}
function Ot(t) {
  let e, n = Et(
    /*shift*/
    t[33]
  ) + "", o, u;
  return {
    c() {
      e = R("option"), o = Q(n), e.__value = u = /*shift*/
      t[33].id, T(e, e.__value);
    },
    m(l, i) {
      Z(l, e, i), v(e, o);
    },
    p(l, i) {
      i[0] & /*shiftOptions*/
      4 && n !== (n = Et(
        /*shift*/
        l[33]
      ) + "") && x(o, n), i[0] & /*shiftOptions*/
      4 && u !== (u = /*shift*/
      l[33].id) && (e.__value = u, T(e, e.__value));
    },
    d(l) {
      l && Y(e);
    }
  };
}
function Lt(t) {
  let e, n = (
    /*pos*/
    t[30] + ""
  ), o, u;
  return {
    c() {
      e = R("option"), o = Q(n), e.__value = u = /*pos*/
      t[30], T(e, e.__value);
    },
    m(l, i) {
      Z(l, e, i), v(e, o);
    },
    p(l, i) {
      i[0] & /*rows*/
      1 && n !== (n = /*pos*/
      l[30] + "") && x(o, n), i[0] & /*rows, teamOptions*/
      9 && u !== (u = /*pos*/
      l[30]) && (e.__value = u, T(e, e.__value));
    },
    d(l) {
      l && Y(e);
    }
  };
}
function Dt(t) {
  let e, n = (
    /*emp*/
    t[27] + ""
  ), o;
  return {
    c() {
      e = R("option"), o = Q(n), e.__value = /*emp*/
      t[27], T(e, e.__value);
    },
    m(u, l) {
      Z(u, e, l), v(e, o);
    },
    p: ee,
    d(u) {
      u && Y(e);
    }
  };
}
function kt(t) {
  let e, n = (
    /*row*/
    (t[21]?.days?.[
      /*i*/
      t[24]
    ] ?? "") + ""
  ), o, u, l, i, d, s;
  function r() {
    return (
      /*click_handler*/
      t[20](
        /*row*/
        t[21],
        /*i*/
        t[24]
      )
    );
  }
  return {
    c() {
      e = R("td"), o = Q(n), g(e, "class", u = _t(Bt(
        /*row*/
        t[21]?.dayDuties?.[
          /*i*/
          t[24]
        ] ?? /*row*/
        t[21]?.days?.[
          /*i*/
          t[24]
        ]
      )) + " svelte-5u69by"), g(e, "style", l = /*dayStyle*/
      t[7](
        /*row*/
        t[21]?.dayDuties?.[
          /*i*/
          t[24]
        ] ?? /*row*/
        t[21]?.days?.[
          /*i*/
          t[24]
        ]
      )), g(e, "data-line-id", i = /*row*/
      t[21]?.id), g(
        e,
        "data-day-index",
        /*i*/
        t[24]
      );
    },
    m(_, h) {
      Z(_, e, h), v(e, o), d || (s = $(e, "click", r), d = !0);
    },
    p(_, h) {
      t = _, h[0] & /*rows*/
      1 && n !== (n = /*row*/
      (t[21]?.days?.[
        /*i*/
        t[24]
      ] ?? "") + "") && x(o, n), h[0] & /*rows, teamOptions*/
      9 && u !== (u = _t(Bt(
        /*row*/
        t[21]?.dayDuties?.[
          /*i*/
          t[24]
        ] ?? /*row*/
        t[21]?.days?.[
          /*i*/
          t[24]
        ]
      )) + " svelte-5u69by") && g(e, "class", u), h[0] & /*rows, teamOptions*/
      9 && l !== (l = /*dayStyle*/
      t[7](
        /*row*/
        t[21]?.dayDuties?.[
          /*i*/
          t[24]
        ] ?? /*row*/
        t[21]?.days?.[
          /*i*/
          t[24]
        ]
      )) && g(e, "style", l), h[0] & /*rows, teamOptions*/
      9 && i !== (i = /*row*/
      t[21]?.id) && g(e, "data-line-id", i);
    },
    d(_) {
      _ && Y(e), d = !1, s();
    }
  };
}
function Ct(t, e) {
  let n, o, u, l, i, d, s, r, _, h, A, F, D, p, c, b, m, E, k, C = (
    /*row*/
    (e[21]?.start ?? "") + ""
  ), I, L, y, w = (
    /*row*/
    (e[21]?.end ?? "") + ""
  ), V, te, Fe, H, ne, Oe, $e, xe, Le, j, le, De, et, tt, ke, U, ie, oe, ae, Ce, nt, lt, Te, K, se, re, ue, fe, Ee, it, ot, Be, q, de, ce, _e, Ie, at, st, Pe, Me = (
    /*row*/
    (e[21]?.rdos ?? "—") + ""
  ), Ve, rt, Se, Ne = (
    /*row*/
    (e[21]?.paid ?? "") + ""
  ), Ke, ut, He, Ge, We = (
    /*row*/
    (e[21]?.hours ?? "") + ""
  ), je, ft, Xe, Ue, dt, he = z(
    /*teamOptions*/
    e[3]
  ), P = [];
  for (let f = 0; f < he.length; f += 1)
    P[f] = Ft(wt(e, he, f));
  function Gt(...f) {
    return (
      /*change_handler*/
      e[12](
        /*row*/
        e[21],
        ...f
      )
    );
  }
  function Wt(...f) {
    return (
      /*input_handler*/
      e[13](
        /*row*/
        e[21],
        ...f
      )
    );
  }
  let ve = z(
    /*shiftOptions*/
    e[2]
  ), M = [];
  for (let f = 0; f < ve.length; f += 1)
    M[f] = Ot(Rt(e, ve, f));
  function Xt(...f) {
    return (
      /*change_handler_1*/
      e[14](
        /*row*/
        e[21],
        ...f
      )
    );
  }
  let pe = z(Tt(
    /*BASE_POSITIONS*/
    e[5],
    /*row*/
    e[21]?.position
  )), S = [];
  for (let f = 0; f < pe.length; f += 1)
    S[f] = Lt(bt(e, pe, f));
  function Vt(...f) {
    return (
      /*change_handler_2*/
      e[15](
        /*row*/
        e[21],
        ...f
      )
    );
  }
  let ge = z(
    /*BASE_EMPS*/
    e[6]
  ), N = [];
  for (let f = 0; f < ge.length; f += 1)
    N[f] = Dt(mt(e, ge, f));
  function Kt(...f) {
    return (
      /*change_handler_3*/
      e[16](
        /*row*/
        e[21],
        ...f
      )
    );
  }
  function Ht(...f) {
    return (
      /*change_handler_4*/
      e[17](
        /*row*/
        e[21],
        ...f
      )
    );
  }
  function jt(...f) {
    return (
      /*change_handler_5*/
      e[18](
        /*row*/
        e[21],
        ...f
      )
    );
  }
  function Ut(...f) {
    return (
      /*change_handler_6*/
      e[19](
        /*row*/
        e[21],
        ...f
      )
    );
  }
  let qe = z([0, 1, 2, 3, 4, 5, 6]), J = [];
  for (let f = 0; f < 7; f += 1)
    J[f] = kt(yt(e, qe, f));
  return {
    key: t,
    first: null,
    c() {
      n = R("tr"), o = R("td"), u = R("select"), l = R("option"), l.textContent = "—";
      for (let f = 0; f < P.length; f += 1)
        P[f].c();
      s = G(), r = R("td"), _ = R("input"), F = G(), D = R("td"), p = R("select"), c = R("option"), c.textContent = "—";
      for (let f = 0; f < M.length; f += 1)
        M[f].c();
      E = G(), k = R("td"), I = Q(C), L = G(), y = R("td"), V = Q(w), te = G(), Fe = R("td"), H = R("select"), ne = R("option"), ne.textContent = "—";
      for (let f = 0; f < S.length; f += 1)
        S[f].c();
      xe = G(), Le = R("td"), j = R("select"), le = R("option"), le.textContent = "—";
      for (let f = 0; f < N.length; f += 1)
        N[f].c();
      tt = G(), ke = R("td"), U = R("select"), ie = R("option"), ie.textContent = "—", oe = R("option"), oe.textContent = "M", ae = R("option"), ae.textContent = "F", lt = G(), Te = R("td"), K = R("select"), se = R("option"), se.textContent = "—", re = R("option"), re.textContent = "DFO", ue = R("option"), ue.textContent = "BAG", fe = R("option"), fe.textContent = "PAX", ot = G(), Be = R("td"), q = R("select"), de = R("option"), de.textContent = "—", ce = R("option"), ce.textContent = "A", _e = R("option"), _e.textContent = "B", st = G(), Pe = R("td"), Ve = Q(Me), rt = G(), Se = R("td"), Ke = Q(Ne), ut = G();
      for (let f = 0; f < 7; f += 1)
        J[f].c();
      He = G(), Ge = R("td"), je = Q(We), ft = G(), l.__value = "", T(l, l.__value), g(u, "class", "line-edit svelte-5u69by"), g(u, "data-field", "team"), g(u, "data-line-id", i = /*row*/
      e[21]?.id), g(o, "class", "svelte-5u69by"), g(_, "type", "text"), g(_, "class", "line-edit line-code-input svelte-5u69by"), g(_, "data-field", "lineCode"), g(_, "data-line-id", h = /*row*/
      e[21]?.id), _.value = A = /*row*/
      e[21]?.line ?? "", g(r, "class", "svelte-5u69by"), c.__value = "", T(c, c.__value), g(p, "class", "line-edit svelte-5u69by"), g(p, "data-field", "shift"), g(p, "data-line-id", b = /*row*/
      e[21]?.id), g(D, "class", "svelte-5u69by"), g(k, "class", "svelte-5u69by"), g(y, "class", "svelte-5u69by"), ne.__value = "", T(ne, ne.__value), g(H, "class", "line-edit svelte-5u69by"), g(H, "data-field", "position"), g(H, "data-line-id", Oe = /*row*/
      e[21]?.id), g(Fe, "class", "svelte-5u69by"), le.__value = "", T(le, le.__value), g(j, "class", "line-edit svelte-5u69by"), g(j, "data-field", "emp"), g(j, "data-line-id", De = /*row*/
      e[21]?.id), g(Le, "class", "svelte-5u69by"), ie.__value = "", T(ie, ie.__value), oe.__value = "M", T(oe, oe.__value), ae.__value = "F", T(ae, ae.__value), g(U, "class", "line-edit svelte-5u69by"), g(U, "data-field", "sex"), g(U, "data-line-id", Ce = /*row*/
      e[21]?.id), g(ke, "class", "svelte-5u69by"), se.__value = "", T(se, se.__value), re.__value = "DFO", T(re, re.__value), ue.__value = "BAG", T(ue, ue.__value), fe.__value = "PAX", T(fe, fe.__value), g(K, "class", "line-edit svelte-5u69by"), g(K, "data-field", "function"), g(K, "data-line-id", Ee = /*row*/
      e[21]?.id), g(Te, "class", "svelte-5u69by"), de.__value = "", T(de, de.__value), ce.__value = "A", T(ce, ce.__value), _e.__value = "B", T(_e, _e.__value), g(q, "class", "line-edit svelte-5u69by"), g(q, "data-field", "certPool"), g(q, "data-line-id", Ie = /*row*/
      e[21]?.id), g(Be, "class", "svelte-5u69by"), g(Pe, "class", "line-rdo-cell svelte-5u69by"), g(Se, "class", "svelte-5u69by"), g(Ge, "class", "line-hours svelte-5u69by"), g(n, "data-line-row", Xe = /*row*/
      e[21]?.id), this.first = n;
    },
    m(f, O) {
      Z(f, n, O), v(n, o), v(o, u), v(u, l);
      for (let a = 0; a < P.length; a += 1)
        P[a] && P[a].m(u, null);
      X(
        u,
        /*row*/
        e[21]?.teamId ?? ""
      ), v(n, s), v(n, r), v(r, _), v(n, F), v(n, D), v(D, p), v(p, c);
      for (let a = 0; a < M.length; a += 1)
        M[a] && M[a].m(p, null);
      X(
        p,
        /*row*/
        e[21]?.shiftId ?? ""
      ), v(n, E), v(n, k), v(k, I), v(n, L), v(n, y), v(y, V), v(n, te), v(n, Fe), v(Fe, H), v(H, ne);
      for (let a = 0; a < S.length; a += 1)
        S[a] && S[a].m(H, null);
      X(
        H,
        /*row*/
        e[21]?.position ?? ""
      ), v(n, xe), v(n, Le), v(Le, j), v(j, le);
      for (let a = 0; a < N.length; a += 1)
        N[a] && N[a].m(j, null);
      X(
        j,
        /*row*/
        e[21]?.emp ?? ""
      ), v(n, tt), v(n, ke), v(ke, U), v(U, ie), v(U, oe), v(U, ae), X(
        U,
        /*row*/
        e[21]?.sex ?? ""
      ), v(n, lt), v(n, Te), v(Te, K), v(K, se), v(K, re), v(K, ue), v(K, fe), X(
        K,
        /*row*/
        e[21]?.function ?? ""
      ), v(n, ot), v(n, Be), v(Be, q), v(q, de), v(q, ce), v(q, _e), X(
        q,
        /*row*/
        e[21]?.certPool ?? ""
      ), v(n, st), v(n, Pe), v(Pe, Ve), v(n, rt), v(n, Se), v(Se, Ke), v(n, ut);
      for (let a = 0; a < 7; a += 1)
        J[a] && J[a].m(n, null);
      v(n, He), v(n, Ge), v(Ge, je), v(n, ft), Ue || (dt = [
        $(u, "change", Gt),
        $(_, "input", Wt),
        $(p, "change", Xt),
        $(H, "change", Vt),
        $(j, "change", Kt),
        $(U, "change", Ht),
        $(K, "change", jt),
        $(q, "change", Ut)
      ], Ue = !0);
    },
    p(f, O) {
      if (e = f, O[0] & /*teamOptions*/
      8) {
        he = z(
          /*teamOptions*/
          e[3]
        );
        let a;
        for (a = 0; a < he.length; a += 1) {
          const W = wt(e, he, a);
          P[a] ? P[a].p(W, O) : (P[a] = Ft(W), P[a].c(), P[a].m(u, null));
        }
        for (; a < P.length; a += 1)
          P[a].d(1);
        P.length = he.length;
      }
      if (O[0] & /*rows, teamOptions*/
      9 && i !== (i = /*row*/
      e[21]?.id) && g(u, "data-line-id", i), O[0] & /*rows, teamOptions*/
      9 && d !== (d = /*row*/
      e[21]?.teamId ?? "") && X(
        u,
        /*row*/
        e[21]?.teamId ?? ""
      ), O[0] & /*rows, teamOptions*/
      9 && h !== (h = /*row*/
      e[21]?.id) && g(_, "data-line-id", h), O[0] & /*rows, teamOptions*/
      9 && A !== (A = /*row*/
      e[21]?.line ?? "") && _.value !== A && (_.value = A), O[0] & /*shiftOptions*/
      4) {
        ve = z(
          /*shiftOptions*/
          e[2]
        );
        let a;
        for (a = 0; a < ve.length; a += 1) {
          const W = Rt(e, ve, a);
          M[a] ? M[a].p(W, O) : (M[a] = Ot(W), M[a].c(), M[a].m(p, null));
        }
        for (; a < M.length; a += 1)
          M[a].d(1);
        M.length = ve.length;
      }
      if (O[0] & /*rows, teamOptions*/
      9 && b !== (b = /*row*/
      e[21]?.id) && g(p, "data-line-id", b), O[0] & /*rows, teamOptions*/
      9 && m !== (m = /*row*/
      e[21]?.shiftId ?? "") && X(
        p,
        /*row*/
        e[21]?.shiftId ?? ""
      ), O[0] & /*rows*/
      1 && C !== (C = /*row*/
      (e[21]?.start ?? "") + "") && x(I, C), O[0] & /*rows*/
      1 && w !== (w = /*row*/
      (e[21]?.end ?? "") + "") && x(V, w), O[0] & /*BASE_POSITIONS, rows*/
      33) {
        pe = z(Tt(
          /*BASE_POSITIONS*/
          e[5],
          /*row*/
          e[21]?.position
        ));
        let a;
        for (a = 0; a < pe.length; a += 1) {
          const W = bt(e, pe, a);
          S[a] ? S[a].p(W, O) : (S[a] = Lt(W), S[a].c(), S[a].m(H, null));
        }
        for (; a < S.length; a += 1)
          S[a].d(1);
        S.length = pe.length;
      }
      if (O[0] & /*rows, teamOptions*/
      9 && Oe !== (Oe = /*row*/
      e[21]?.id) && g(H, "data-line-id", Oe), O[0] & /*rows, teamOptions*/
      9 && $e !== ($e = /*row*/
      e[21]?.position ?? "") && X(
        H,
        /*row*/
        e[21]?.position ?? ""
      ), O[0] & /*BASE_EMPS*/
      64) {
        ge = z(
          /*BASE_EMPS*/
          e[6]
        );
        let a;
        for (a = 0; a < ge.length; a += 1) {
          const W = mt(e, ge, a);
          N[a] ? N[a].p(W, O) : (N[a] = Dt(W), N[a].c(), N[a].m(j, null));
        }
        for (; a < N.length; a += 1)
          N[a].d(1);
        N.length = ge.length;
      }
      if (O[0] & /*rows, teamOptions*/
      9 && De !== (De = /*row*/
      e[21]?.id) && g(j, "data-line-id", De), O[0] & /*rows, teamOptions*/
      9 && et !== (et = /*row*/
      e[21]?.emp ?? "") && X(
        j,
        /*row*/
        e[21]?.emp ?? ""
      ), O[0] & /*rows, teamOptions*/
      9 && Ce !== (Ce = /*row*/
      e[21]?.id) && g(U, "data-line-id", Ce), O[0] & /*rows, teamOptions*/
      9 && nt !== (nt = /*row*/
      e[21]?.sex ?? "") && X(
        U,
        /*row*/
        e[21]?.sex ?? ""
      ), O[0] & /*rows, teamOptions*/
      9 && Ee !== (Ee = /*row*/
      e[21]?.id) && g(K, "data-line-id", Ee), O[0] & /*rows, teamOptions*/
      9 && it !== (it = /*row*/
      e[21]?.function ?? "") && X(
        K,
        /*row*/
        e[21]?.function ?? ""
      ), O[0] & /*rows, teamOptions*/
      9 && Ie !== (Ie = /*row*/
      e[21]?.id) && g(q, "data-line-id", Ie), O[0] & /*rows, teamOptions*/
      9 && at !== (at = /*row*/
      e[21]?.certPool ?? "") && X(
        q,
        /*row*/
        e[21]?.certPool ?? ""
      ), O[0] & /*rows*/
      1 && Me !== (Me = /*row*/
      (e[21]?.rdos ?? "—") + "") && x(Ve, Me), O[0] & /*rows*/
      1 && Ne !== (Ne = /*row*/
      (e[21]?.paid ?? "") + "") && x(Ke, Ne), O[0] & /*rows, dayStyle, emitDay*/
      641) {
        qe = z([0, 1, 2, 3, 4, 5, 6]);
        let a;
        for (a = 0; a < 7; a += 1) {
          const W = yt(e, qe, a);
          J[a] ? J[a].p(W, O) : (J[a] = kt(W), J[a].c(), J[a].m(n, He));
        }
        for (; a < 7; a += 1)
          J[a].d(1);
      }
      O[0] & /*rows*/
      1 && We !== (We = /*row*/
      (e[21]?.hours ?? "") + "") && x(je, We), O[0] & /*rows, teamOptions*/
      9 && Xe !== (Xe = /*row*/
      e[21]?.id) && g(n, "data-line-row", Xe);
    },
    d(f) {
      f && Y(n), we(P, f), we(M, f), we(S, f), we(N, f), we(J, f), Ue = !1, Re(dt);
    }
  };
}
function vn(t) {
  let e;
  function n(l, i) {
    return (
      /*mode*/
      l[1] === "svelte" ? hn : _n
    );
  }
  let o = n(t), u = o(t);
  return {
    c() {
      e = R("div"), u.c(), g(e, "class", "lines-table-root svelte-5u69by"), B(e, "min-height", "min(70vh, 720px)"), B(e, "height", "min(70vh, 720px)"), B(e, "width", "100%"), B(
        e,
        "--export-rdo",
        /*exportStyle*/
        t[4]?.rdo || "#000000"
      ), B(
        e,
        "--export-bag",
        /*exportStyle*/
        t[4]?.bag || "#F4B4B4"
      ), B(
        e,
        "--export-dfo",
        /*exportStyle*/
        t[4]?.dfo || "#FFF3A8"
      ), B(
        e,
        "--export-pax",
        /*exportStyle*/
        t[4]?.pax || "#A0C4FF"
      ), B(
        e,
        "--export-header",
        /*exportStyle*/
        t[4]?.header || "#1F4E79"
      );
    },
    m(l, i) {
      Z(l, e, i), u.m(e, null);
    },
    p(l, i) {
      o === (o = n(l)) && u ? u.p(l, i) : (u.d(1), u = o(l), u && (u.c(), u.m(e, null))), i[0] & /*exportStyle*/
      16 && B(
        e,
        "--export-rdo",
        /*exportStyle*/
        l[4]?.rdo || "#000000"
      ), i[0] & /*exportStyle*/
      16 && B(
        e,
        "--export-bag",
        /*exportStyle*/
        l[4]?.bag || "#F4B4B4"
      ), i[0] & /*exportStyle*/
      16 && B(
        e,
        "--export-dfo",
        /*exportStyle*/
        l[4]?.dfo || "#FFF3A8"
      ), i[0] & /*exportStyle*/
      16 && B(
        e,
        "--export-pax",
        /*exportStyle*/
        l[4]?.pax || "#A0C4FF"
      ), i[0] & /*exportStyle*/
      16 && B(
        e,
        "--export-header",
        /*exportStyle*/
        l[4]?.header || "#1F4E79"
      );
    },
    i: ee,
    o: ee,
    d(l) {
      l && Y(e), u.d();
    }
  };
}
function Tt(t, e) {
  const n = e == null ? "" : String(e);
  return !n || t.indexOf(n) >= 0 ? t : t.concat([n]);
}
function Et(t) {
  if (!t) return "";
  const e = t.name || t.id || "";
  return t.start && t.end ? (e ? e + " " : "") + "(" + t.start + "–" + t.end + ")" : t.start ? e ? e + " " + t.start : t.start : e;
}
function Nt(t) {
  const e = String(t || "").toUpperCase();
  return e === "RDO" || e === "—" || e === "-" ? "rdo" : e === "BAG" || e === "BAGS" ? "bag" : e === "DFO" ? "dfo" : e === "PAX" ? "pax" : null;
}
function Bt(t) {
  const e = Nt(t);
  return e === "rdo" ? "cell-toggle cell-rdo" : e === "bag" ? "cell-toggle cell-function-duty cell-bag" : e === "dfo" ? "cell-toggle cell-function-duty cell-dfo" : e === "pax" ? "cell-toggle cell-function-duty cell-pax" : "cell-toggle cell-work";
}
function pn(t, e, n) {
  let { rows: o = [] } = e, { mode: u = "svelte" } = e, { shiftOptions: l = [] } = e, { teamOptions: i = [] } = e, { exportStyle: d = pt() } = e, { onInlineEdit: s = null } = e, { onDayToggle: r = null } = e;
  const _ = ["TSO", "LTSO", "STSO"], h = ["FT", "PT"];
  function A(y) {
    const w = Nt(y);
    if (!w) return;
    const te = (d || pt())[w];
    if (te)
      return "background:" + te + ";color:" + cn(te) + ";";
  }
  function F(y, w, V) {
    s?.({ lineId: y, field: w, value: V });
  }
  function D(y, w) {
    r?.({ lineId: y, dayIndex: w });
  }
  const p = (y, w) => F(y?.id, "team", w.target.value), c = (y, w) => F(y?.id, "lineCode", w.target.value), b = (y, w) => F(y?.id, "shift", w.target.value), m = (y, w) => F(y?.id, "position", w.target.value), E = (y, w) => F(y?.id, "emp", w.target.value), k = (y, w) => F(y?.id, "sex", w.target.value), C = (y, w) => F(y?.id, "function", w.target.value), I = (y, w) => F(y?.id, "certPool", w.target.value), L = (y, w) => D(y?.id, w);
  return t.$$set = (y) => {
    "rows" in y && n(0, o = y.rows), "mode" in y && n(1, u = y.mode), "shiftOptions" in y && n(2, l = y.shiftOptions), "teamOptions" in y && n(3, i = y.teamOptions), "exportStyle" in y && n(4, d = y.exportStyle), "onInlineEdit" in y && n(10, s = y.onInlineEdit), "onDayToggle" in y && n(11, r = y.onDayToggle);
  }, [
    o,
    u,
    l,
    i,
    d,
    _,
    h,
    A,
    F,
    D,
    s,
    r,
    p,
    c,
    b,
    m,
    E,
    k,
    C,
    I,
    L
  ];
}
class gn extends un {
  constructor(e) {
    super(), rn(
      this,
      e,
      pn,
      vn,
      Jt,
      {
        rows: 0,
        mode: 1,
        shiftOptions: 2,
        teamOptions: 3,
        exportStyle: 4,
        onInlineEdit: 10,
        onDayToggle: 11
      },
      null,
      [-1, -1]
    );
  }
}
function yn(t) {
  if (t = t || window.Scheduler, !t) return;
  function e(l) {
    var i = String(l || "").trim();
    if (!i) return "";
    var d = i.match(/^(\d+)$/);
    return d && Number(d[1]) < 10 ? "0" + d[1] : i;
  }
  function n(l, i) {
    var d = (l.rdoDays || []).map(Number).filter(function(r) {
      return Number.isInteger(r) && r >= 0 && r <= 6;
    }), s = d.length ? d.map(function(r) {
      return i && i[r] != null ? i[r] : String(r);
    }).join(",") : "—";
    return l.rdoHard && (s += " (hard)"), s;
  }
  function o(l, i, d) {
    return d || "WORK";
  }
  function u(l, i) {
    return i === "BAG" || i === "PAX" ? i : l.function === "BAG" ? "BAG" : l.function === "DFO" || l.function === "PAX" ? "PAX" : i === "BAG" || i === "PAX" ? i : null;
  }
  t.lineToRowModel = function(l, i, d) {
    if (d = d || {}, !l || !i) return null;
    for (var s = d.dayNames || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], r = typeof d.teamResolver == "function" ? d.teamResolver(l.id) : null, _ = typeof d.shiftResolver == "function" ? d.shiftResolver(l.shiftId) : null, h = l.shiftName || _ && _.name || "", A = _ && _.start ? _.start : "", F = _ && _.end ? _.end : "", D = l.shiftLabel || (A && F ? A + "–" + F : A || "WORK"), p = !!(l.isExtra || l.extraPositionId), c = p ? l.position || l.extraName || "TSO" : l.isStso || l.empClass === "STSO" ? "STSO" : l.isLtso || l.empClass === "LTSO" ? "LTSO" : "TSO", b = p ? l.empClass === "PT" ? "PT" : "FT" : c === "STSO" || c === "LTSO" ? "FT" : l.empClass === "PT" ? "PT" : "FT", m = l.paid || 0, E = Array.isArray(i) ? i : i[l.id] || i[String(l.id)] || [], k = [], C = [], I = 0, L = 0; L < 7; L++) {
      var y = E[L];
      if (y === "WORK") {
        I += m;
        var w = typeof d.rotationDutyResolver == "function" ? d.rotationDutyResolver(l.id, L) : null, V = o(l, w, D);
        k.push(V), C.push(u(l, w));
      } else
        k.push("RDO"), C.push("RDO");
    }
    return {
      id: l.id,
      teamId: r && r.id || "",
      shiftId: l.shiftId || "",
      team: e(r && (r.name || r.id) || ""),
      line: l.lineCode || "",
      shift: h,
      start: A,
      end: F,
      position: c,
      emp: b,
      sex: l.sex || "M",
      function: l.function || "",
      certPool: l.certPool || "",
      rdos: n(l, s),
      paid: m,
      days: k,
      dayDuties: C,
      hours: I
    };
  }, t.getRowModels = function(l, i, d) {
    return !Array.isArray(l) || !i || typeof i != "object" ? [] : l.map(function(s) {
      return t.lineToRowModel(s, i, d);
    }).filter(Boolean);
  }, t.getLineRowModels = function(l) {
    var i = t.state && Array.isArray(t.state.lines) ? t.state.lines : [], d = t.state && t.state.schedule || {}, s = Object.assign({}, l || {});
    return !s.teamResolver && typeof t.teamMetaForLine == "function" && (s.teamResolver = t.teamMetaForLine), !s.shiftResolver && typeof t.getShift == "function" && (s.shiftResolver = t.getShift), !s.rotationDutyResolver && typeof t.getRotationDuty == "function" && (s.rotationDutyResolver = t.getRotationDuty), t.getRowModels(i, d, s);
  };
}
function mn(t) {
  if (t = t || window.Scheduler, !t) return;
  function e(d, s) {
    var r = t.getRotationDuty ? t.getRotationDuty(d.id, s) : null;
    return r || d.function || null;
  }
  t.dutyFor = e;
  function n(d) {
    if (d.shiftLabel) return d.shiftLabel;
    var s = t.getShift ? t.getShift(d.shiftId) : null;
    return s && s.start && s.end ? s.start + "–" + s.end : s && s.start ? s.start : "WORK";
  }
  function o(d) {
    if (!(!d || d.function !== "BAG")) {
      t.state.functionRotation || (t.state.functionRotation = {});
      var s = String(d.id);
      t.state.functionRotation[s] || (t.state.functionRotation[s] = []);
      for (var r = t.state.schedule && (t.state.schedule[d.id] || t.state.schedule[s]) || [], _ = Math.max(r.length, (t.state.weekCount || 1) * 7), h = 0; h < _; h++) {
        for (; t.state.functionRotation[s].length <= h; ) t.state.functionRotation[s].push(null);
        r[h] === "WORK" && (t.state.functionRotation[s][h] = "BAG");
      }
    }
  }
  function u(d) {
    if (!(!d || d.function !== "DFO")) {
      t.state.functionRotation || (t.state.functionRotation = {});
      var s = String(d.id);
      t.state.functionRotation[s] || (t.state.functionRotation[s] = []);
      for (var r = t.state.schedule && (t.state.schedule[d.id] || t.state.schedule[s]) || [], _ = Math.max(r.length, (t.state.weekCount || 1) * 7), h = 0; h < _; h++) {
        for (; t.state.functionRotation[s].length <= h; ) t.state.functionRotation[s].push(null);
        r[h] === "WORK" && (t.state.functionRotation[s][h] = "DFO");
      }
    }
  }
  function l() {
    var d = document.getElementById("lines-tbody"), s = d || document.querySelector(".lines-virtual-root");
    s && d && s.querySelectorAll("td.cell-toggle").forEach(function(r) {
      var _ = t.findLineById ? t.findLineById(r.getAttribute("data-line-id")) : null, h = +r.getAttribute("data-day");
      if (!(!_ || isNaN(h))) {
        var A = (t.state.schedule[_.id] || t.state.schedule[String(_.id)] || [])[h] || "RDO";
        if (r.style.background = "", r.style.color = "", A !== "WORK") {
          r.className = "cell-rdo cell-toggle", r.textContent = "RDO", r.style.background = "#000", r.style.color = "#fff", r.style.opacity = "1";
          return;
        }
        var F = e(_, h), D = F === "BAG" || F === "BAGS", p = F === "DFO", c = "";
        D ? c = " cell-function-duty cell-bag" : p && (c = " cell-function-duty cell-dfo"), r.className = "cell-work cell-toggle" + c, r.textContent = n(_);
      }
    });
  }
  t.paintLineColors = l;
  function i(d) {
    var s = t[d];
    if (!(typeof s != "function" || s._lineColorsWrapped)) {
      var r = function() {
        if (t.__USE_SVELTE_LINES) return s.apply(this, arguments);
        var _ = s.apply(this, arguments);
        return setTimeout(l, 0), _;
      };
      r._lineColorsWrapped = !0, t[d] = r;
    }
  }
  i("renderLines"), i("renderAll"), i("generateFunctionAssignments"), t._lineColorsBound || (t._lineColorsBound = !0, document.addEventListener("change", function(d) {
    var s = d.target;
    if (!(!s || s.getAttribute("data-field") !== "function")) {
      var r = t.findLineById ? t.findLineById(s.getAttribute("data-line-id")) : null;
      r && (r.function = s.value === "DFO" || s.value === "PAX" || s.value === "BAG" ? s.value : "", r.function === "BAG" && o(r), r.function === "DFO" && u(r), t.renderLines ? t.renderLines() : l());
    }
  }));
}
function Rn(t) {
  const e = t || window.Scheduler;
  if (!e) return;
  yn(e), mn(e);
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
  function o() {
    return {
      teamResolver: typeof e.teamMetaForLine == "function" ? e.teamMetaForLine : null,
      shiftResolver: typeof e.getShift == "function" ? e.getShift : null,
      rotationDutyResolver: typeof e.getRotationDuty == "function" ? e.getRotationDuty : u
    };
  }
  function u(p, c) {
    const b = String(p), m = e.state && e.state.functionRotation, E = m && (m[b] || m[p]);
    if (!Array.isArray(E)) return null;
    const k = E[c];
    return k === "BAG" ? "BAG" : k === "PAX" || k === "DFO" ? "PAX" : null;
  }
  function l(p, c, b) {
    var m = String(p);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[m] || (e.state.functionRotation[m] = []); e.state.functionRotation[m].length <= c; ) e.state.functionRotation[m].push(null);
    e.state.functionRotation[m][c] = b;
  }
  function i(p) {
    if (!p) return !1;
    if (p.function === "DFO") return !0;
    const c = p.functionEligible;
    return !!(c && (c.dfo === !0 || c.DFO === !0));
  }
  function d() {
    const p = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], c = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(p)) : p, b = e.state && e.state.schedule || {}, m = typeof e.getRowModels == "function" ? e.getRowModels(c, b, o()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(o()) : [];
    return Array.isArray(m) ? m : [];
  }
  function s() {
    return e.teams && Array.isArray(e.teams.teams) ? e.teams.teams : [];
  }
  function r() {
    return e.state && Array.isArray(e.state.shifts) ? e.state.shifts : [];
  }
  function _() {
    return typeof e.getExportStyle == "function" ? e.getExportStyle() : e.state && e.state.exportStyle || null;
  }
  function h(p) {
    if (!p || typeof p.$set != "function") return;
    const c = d();
    typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), p.$set({
      rows: Array.isArray(c) ? c : [],
      shiftOptions: r(),
      teamOptions: s(),
      exportStyle: _()
    });
  }
  function A(p) {
    if (!p) return;
    const c = e.findLineById ? e.findLineById(p.lineId) : null;
    if (!c) return;
    const b = p.field, m = p.value;
    if (b === "lineCode")
      c.lineCode = String(m || "").trim() || c.lineCode;
    else if (b === "sex")
      c.sex = m === "F" ? "F" : "M";
    else if (b === "function")
      c.function = m === "DFO" || m === "PAX" || m === "BAG" ? m : "";
    else if (b === "certPool") {
      var E = String(m || "").trim().toUpperCase();
      c.certPool = E === "A" || E === "B" ? E : "";
    } else if (b === "emp")
      e.applyLineEmp && e.applyLineEmp(c, m);
    else if (b === "position") {
      var k = !!(c.isExtra || c.extraPositionId), C = String(m ?? "").trim();
      k ? (C && (c.position = C, c.extraName = C), c.isStso = !1, c.isLtso = !1) : e.applyLineEmp && e.applyLineEmp(c, C);
    } else b === "shift" ? e.applyLineShift && e.applyLineShift(c, m) : b === "team" && e.setLineTeam && e.setLineTeam(p.lineId, m);
    e.updateStatus && e.updateStatus("Updated " + (c.lineCode || p.lineId)), D(), (b === "emp" || b === "position" || b === "shift") && e.renderCoverageBars && e.renderCoverageBars(), b === "team" && e.renderTeams && e.renderTeams();
  }
  function F(p) {
    if (!p) return;
    const c = e.findLineById ? e.findLineById(p.lineId) : null, b = Number(p.dayIndex);
    if (!c || !Number.isInteger(b) || b < 0 || b > 6) return;
    const m = String(c.id);
    e.state.schedule || (e.state.schedule = {});
    var E = e.state.schedule[m] || e.state.schedule[c.id];
    for (Array.isArray(E) || (E = []), e.state.schedule[m] = E; e.state.schedule[m].length < 7; ) e.state.schedule[m].push("RDO");
    e.state.functionRotation || (e.state.functionRotation = {}), !e.state.functionRotation[m] && e.state.functionRotation[c.id] && (e.state.functionRotation[m] = e.state.functionRotation[c.id]);
    const k = e.state.schedule[m][b] || "RDO", C = c.function === "BAG", I = i(c);
    if (k !== "WORK")
      e.state.schedule[m][b] = "WORK", C ? l(m, b, "BAG") : I ? l(m, b, "PAX") : l(m, b, null);
    else if (C)
      e.state.schedule[m][b] = "RDO", l(m, b, null);
    else if (I) {
      var L = typeof e.getRotationDuty == "function" ? e.getRotationDuty(c.id, b) : u(c.id, b), y = L === "DFO" || L === "PAX" || !L ? "PAX" : L;
      y === "PAX" ? l(m, b, "BAG") : (e.state.schedule[m][b] = "RDO", l(m, b, null));
    } else
      e.state.schedule[m][b] = "RDO", l(m, b, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(c), D(), e.renderCoverageBars && e.renderCoverageBars();
  }
  const D = () => {
    try {
      const p = n._linesTableApp;
      if (p)
        h(p);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const c = d();
        typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), n._linesTableApp = new gn({
          target: n,
          props: {
            rows: Array.isArray(c) ? c : [],
            shiftOptions: r(),
            teamOptions: s(),
            exportStyle: _(),
            onInlineEdit: A,
            onDayToggle: F
          }
        });
      }
    } catch (p) {
      console.error("lines-table: refresh failed", p);
    }
  };
  D(), document.addEventListener("click", (p) => {
    const c = p.target.closest?.(".tab-btn");
    c && c.dataset.tab === "lines" && D();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((p) => {
    window.addEventListener(p, D);
  }), n.refresh = D;
}
export {
  Rn as initLinesTable
};
