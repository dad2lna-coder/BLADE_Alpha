var jt = Object.defineProperty;
var Ut = (t, e, n) => e in t ? jt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Je = (t, e, n) => Ut(t, typeof e != "symbol" ? e + "" : e, n);
function x() {
}
function Bt(t) {
  return t();
}
function vt() {
  return /* @__PURE__ */ Object.create(null);
}
function Ae(t) {
  t.forEach(Bt);
}
function Et(t) {
  return typeof t == "function";
}
function qt(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function zt(t) {
  return Object.keys(t).length === 0;
}
function pt(t) {
  return t ?? "";
}
function f(t, e) {
  t.appendChild(e);
}
function Z(t, e, n) {
  t.insertBefore(e, n || null);
}
function z(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function Qe(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function m(t) {
  return document.createElement(t);
}
function q(t) {
  return document.createTextNode(t);
}
function S() {
  return q(" ");
}
function U(t, e, n, s) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n, s);
}
function v(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Jt(t) {
  return Array.from(t.childNodes);
}
function Y(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function L(t, e) {
  t.value = e ?? "";
}
function E(t, e, n, s) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
function G(t, e, n) {
  for (let s = 0; s < t.options.length; s += 1) {
    const d = t.options[s];
    if (d.__value === e) {
      d.selected = !0;
      return;
    }
  }
  t.selectedIndex = -1;
}
let $e;
function Fe(t) {
  $e = t;
}
const Re = [], gt = [];
let we = [];
const yt = [], Qt = /* @__PURE__ */ Promise.resolve();
let Ze = !1;
function Yt() {
  Ze || (Ze = !0, Qt.then(It));
}
function xe(t) {
  we.push(t);
}
const Ye = /* @__PURE__ */ new Set();
let be = 0;
function It() {
  if (be !== 0)
    return;
  const t = $e;
  do {
    try {
      for (; be < Re.length; ) {
        const e = Re[be];
        be++, Fe(e), Zt(e.$$);
      }
    } catch (e) {
      throw Re.length = 0, be = 0, e;
    }
    for (Fe(null), Re.length = 0, be = 0; gt.length; ) gt.pop()();
    for (let e = 0; e < we.length; e += 1) {
      const n = we[e];
      Ye.has(n) || (Ye.add(n), n());
    }
    we.length = 0;
  } while (Re.length);
  for (; yt.length; )
    yt.pop()();
  Ze = !1, Ye.clear(), Fe(t);
}
function Zt(t) {
  if (t.fragment !== null) {
    t.update(), Ae(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(xe);
  }
}
function xt(t) {
  const e = [], n = [];
  we.forEach((s) => t.indexOf(s) === -1 ? e.push(s) : n.push(s)), n.forEach((s) => s()), we = e;
}
const $t = /* @__PURE__ */ new Set();
function Pt(t, e) {
  t && t.i && ($t.delete(t), t.i(e));
}
function Q(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function en(t, e) {
  t.d(1), e.delete(t.key);
}
function tn(t, e, n, s, d, l, i, u, o, a, c, r) {
  let A = t.length, F = l.length, C = A;
  const h = {};
  for (; C--; ) h[t[C].key] = C;
  const _ = [], w = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), k = [];
  for (C = F; C--; ) {
    const p = r(d, l, C), T = n(p);
    let D = i.get(T);
    D ? k.push(() => D.p(p, e)) : (D = a(T, p), D.c()), w.set(T, _[C] = D), T in h && g.set(T, Math.abs(C - h[T]));
  }
  const B = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Set();
  function b(p) {
    Pt(p, 1), p.m(u, c), i.set(p.key, p), c = p.first, F--;
  }
  for (; A && F; ) {
    const p = _[F - 1], T = t[A - 1], D = p.key, j = T.key;
    p === T ? (c = p.first, A--, F--) : w.has(j) ? !i.has(D) || B.has(D) ? b(p) : I.has(j) ? A-- : g.get(D) > g.get(j) ? (I.add(D), b(p)) : (B.add(j), A--) : (o(T, i), A--);
  }
  for (; A--; ) {
    const p = t[A];
    w.has(p.key) || o(p, i);
  }
  for (; F; ) b(_[F - 1]);
  return Ae(k), _;
}
function nn(t, e, n) {
  const { fragment: s, after_update: d } = t.$$;
  s && s.m(e, n), xe(() => {
    const l = t.$$.on_mount.map(Bt).filter(Et);
    t.$$.on_destroy ? t.$$.on_destroy.push(...l) : Ae(l), t.$$.on_mount = [];
  }), d.forEach(xe);
}
function ln(t, e) {
  const n = t.$$;
  n.fragment !== null && (xt(n.after_update), Ae(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function on(t, e) {
  t.$$.dirty[0] === -1 && (Re.push(t), Yt(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function an(t, e, n, s, d, l, i = null, u = [-1]) {
  const o = $e;
  Fe(t);
  const a = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: l,
    update: x,
    not_equal: d,
    bound: vt(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (o ? o.$$.context : [])),
    // everything else
    callbacks: vt(),
    dirty: u,
    skip_bound: !1,
    root: e.target || o.$$.root
  };
  i && i(a.root);
  let c = !1;
  if (a.ctx = n ? n(t, e.props || {}, (r, A, ...F) => {
    const C = F.length ? F[0] : A;
    return a.ctx && d(a.ctx[r], a.ctx[r] = C) && (!a.skip_bound && a.bound[r] && a.bound[r](C), c && on(t, r)), A;
  }) : [], a.update(), c = !0, Ae(a.before_update), a.fragment = s ? s(a.ctx) : !1, e.target) {
    if (e.hydrate) {
      const r = Jt(e.target);
      a.fragment && a.fragment.l(r), r.forEach(z);
    } else
      a.fragment && a.fragment.c();
    e.intro && Pt(t.$$.fragment), nn(t, e.target, e.anchor), It();
  }
  Fe(o);
}
class sn {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Je(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Je(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    ln(this, 1), this.$destroy = x;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, n) {
    if (!Et(n))
      return x;
    const s = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return s.push(n), () => {
      const d = s.indexOf(n);
      d !== -1 && s.splice(d, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !zt(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const rn = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(rn);
function mt() {
  return {
    rdo: "#000000",
    bag: "#F4B4B4",
    dfo: "#FFF3A8",
    pax: "#A0C4FF",
    header: "#1F4E79"
  };
}
function un(t, e) {
  if (!t) return e;
  var n = String(t).replace("#", "").trim();
  return n.length === 3 && (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]), n.length !== 6 || /[^0-9a-fA-F]/.test(n) ? e : "#" + n.toUpperCase();
}
function fn(t) {
  var e = un(t, "#FFFFFF") || "#FFFFFF", n = e.slice(1), s = parseInt(n.slice(0, 2), 16), d = parseInt(n.slice(2, 4), 16), l = parseInt(n.slice(4, 6), 16), i = (0.299 * s + 0.587 * d + 0.114 * l) / 255;
  return i < 0.45 ? "#FFFFFF" : "#111111";
}
function bt(t, e, n) {
  const s = t.slice();
  return s[19] = e[n], s;
}
function Rt(t, e, n) {
  const s = t.slice();
  return s[22] = e[n], s;
}
function wt(t, e, n) {
  const s = t.slice();
  return s[25] = e[n], s;
}
function At(t, e, n) {
  const s = t.slice();
  return s[28] = e[n], s;
}
function dn(t) {
  let e;
  return {
    c() {
      e = m("div"), e.textContent = "Classic Lines mode active", v(e, "class", "muted");
    },
    m(n, s) {
      Z(n, e, s);
    },
    p: x,
    d(n) {
      n && z(e);
    }
  };
}
function cn(t) {
  let e, n, s, d, l, i = [], u = /* @__PURE__ */ new Map(), o = Q(
    /*rows*/
    t[0]
  );
  const a = (r) => (
    /*row*/
    r[19].id
  );
  for (let r = 0; r < o.length; r += 1) {
    let A = bt(t, o, r), F = a(A);
    u.set(F, i[r] = Tt(F, A));
  }
  let c = null;
  return o.length || (c = Ft()), {
    c() {
      e = m("div"), n = m("table"), s = m("thead"), s.innerHTML = '<tr><th class="svelte-5u69by">Team</th> <th class="svelte-5u69by">Line</th> <th class="svelte-5u69by">Shift</th> <th class="svelte-5u69by">Start</th> <th class="svelte-5u69by">End</th> <th class="svelte-5u69by">Position</th> <th class="svelte-5u69by">Emp</th> <th class="svelte-5u69by">Sex</th> <th class="svelte-5u69by">Function</th> <th class="svelte-5u69by">Cert pool</th> <th class="svelte-5u69by">RDOs</th> <th class="svelte-5u69by">Paid</th> <th class="svelte-5u69by">Sun</th> <th class="svelte-5u69by">Mon</th> <th class="svelte-5u69by">Tue</th> <th class="svelte-5u69by">Wed</th> <th class="svelte-5u69by">Thu</th> <th class="svelte-5u69by">Fri</th> <th class="svelte-5u69by">Sat</th> <th class="svelte-5u69by">Hours</th></tr>', d = S(), l = m("tbody");
      for (let r = 0; r < i.length; r += 1)
        i[r].c();
      c && c.c(), v(n, "class", "data-table lines-editable svelte-5u69by"), E(n, "width", "max-content"), E(n, "min-width", "1100px"), v(e, "class", "lines-virtual-root svelte-5u69by"), E(e, "height", "100%"), E(e, "overflow", "auto"), E(e, "position", "relative");
    },
    m(r, A) {
      Z(r, e, A), f(e, n), f(n, s), f(n, d), f(n, l);
      for (let F = 0; F < i.length; F += 1)
        i[F] && i[F].m(l, null);
      c && c.m(l, null);
    },
    p(r, A) {
      A & /*rows, dayClass, dayStyle, emitDay, emitEdit, shiftOptions, shiftLabel, teamOptions*/
      237 && (o = Q(
        /*rows*/
        r[0]
      ), i = tn(i, A, a, 1, r, o, u, l, en, Tt, null, bt), !o.length && c ? c.p(r, A) : o.length ? c && (c.d(1), c = null) : (c = Ft(), c.c(), c.m(l, null)));
    },
    d(r) {
      r && z(e);
      for (let A = 0; A < i.length; A += 1)
        i[A].d();
      c && c.d();
    }
  };
}
function Ft(t) {
  let e;
  return {
    c() {
      e = m("tr"), e.innerHTML = '<td colspan="20" class="muted svelte-5u69by">No lines — Generate or Import first.</td>';
    },
    m(n, s) {
      Z(n, e, s);
    },
    p: x,
    d(n) {
      n && z(e);
    }
  };
}
function Ot(t) {
  let e, n = (
    /*team*/
    (t[28].name ?? /*team*/
    t[28].id) + ""
  ), s, d;
  return {
    c() {
      e = m("option"), s = q(n), e.__value = d = /*team*/
      t[28].id, L(e, e.__value);
    },
    m(l, i) {
      Z(l, e, i), f(e, s);
    },
    p(l, i) {
      i & /*teamOptions*/
      8 && n !== (n = /*team*/
      (l[28].name ?? /*team*/
      l[28].id) + "") && Y(s, n), i & /*teamOptions*/
      8 && d !== (d = /*team*/
      l[28].id) && (e.__value = d, L(e, e.__value));
    },
    d(l) {
      l && z(e);
    }
  };
}
function Ct(t) {
  let e, n = Dt(
    /*shift*/
    t[25]
  ) + "", s, d;
  return {
    c() {
      e = m("option"), s = q(n), e.__value = d = /*shift*/
      t[25].id, L(e, e.__value);
    },
    m(l, i) {
      Z(l, e, i), f(e, s);
    },
    p(l, i) {
      i & /*shiftOptions*/
      4 && n !== (n = Dt(
        /*shift*/
        l[25]
      ) + "") && Y(s, n), i & /*shiftOptions*/
      4 && d !== (d = /*shift*/
      l[25].id) && (e.__value = d, L(e, e.__value));
    },
    d(l) {
      l && z(e);
    }
  };
}
function Lt(t) {
  let e, n = (
    /*row*/
    (t[19]?.days?.[
      /*i*/
      t[22]
    ] ?? "") + ""
  ), s, d, l, i, u, o;
  function a() {
    return (
      /*click_handler*/
      t[18](
        /*row*/
        t[19],
        /*i*/
        t[22]
      )
    );
  }
  return {
    c() {
      e = m("td"), s = q(n), v(e, "class", d = pt(kt(
        /*row*/
        t[19]?.dayDuties?.[
          /*i*/
          t[22]
        ] ?? /*row*/
        t[19]?.days?.[
          /*i*/
          t[22]
        ]
      )) + " svelte-5u69by"), v(e, "style", l = /*dayStyle*/
      t[5](
        /*row*/
        t[19]?.dayDuties?.[
          /*i*/
          t[22]
        ] ?? /*row*/
        t[19]?.days?.[
          /*i*/
          t[22]
        ]
      )), v(e, "data-line-id", i = /*row*/
      t[19]?.id), v(
        e,
        "data-day-index",
        /*i*/
        t[22]
      );
    },
    m(c, r) {
      Z(c, e, r), f(e, s), u || (o = U(e, "click", a), u = !0);
    },
    p(c, r) {
      t = c, r & /*rows*/
      1 && n !== (n = /*row*/
      (t[19]?.days?.[
        /*i*/
        t[22]
      ] ?? "") + "") && Y(s, n), r & /*rows, teamOptions*/
      9 && d !== (d = pt(kt(
        /*row*/
        t[19]?.dayDuties?.[
          /*i*/
          t[22]
        ] ?? /*row*/
        t[19]?.days?.[
          /*i*/
          t[22]
        ]
      )) + " svelte-5u69by") && v(e, "class", d), r & /*rows, teamOptions*/
      9 && l !== (l = /*dayStyle*/
      t[5](
        /*row*/
        t[19]?.dayDuties?.[
          /*i*/
          t[22]
        ] ?? /*row*/
        t[19]?.days?.[
          /*i*/
          t[22]
        ]
      )) && v(e, "style", l), r & /*rows, teamOptions*/
      9 && i !== (i = /*row*/
      t[19]?.id) && v(e, "data-line-id", i);
    },
    d(c) {
      c && z(e), u = !1, o();
    }
  };
}
function Tt(t, e) {
  let n, s, d, l, i, u, o, a, c, r, A, F, C, h, _, w, g, k, B, I = (
    /*row*/
    (e[19]?.start ?? "") + ""
  ), b, p, T, D = (
    /*row*/
    (e[19]?.end ?? "") + ""
  ), j, et, Oe, W, $, ee, te, ne, Ce, tt, nt, Le, N, le, ie, oe, ae, se, Te, lt, it, De, V, re, ue, fe, ke, ot, at, Be, X, de, ce, _e, he, Ee, st, rt, Ie, K, ve, pe, ge, Pe, ut, ft, Me, Se = (
    /*row*/
    (e[19]?.rdos ?? "—") + ""
  ), Ke, dt, Ne, Ge = (
    /*row*/
    (e[19]?.paid ?? "") + ""
  ), He, ct, je, We, Xe = (
    /*row*/
    (e[19]?.hours ?? "") + ""
  ), Ue, _t, Ve, qe, ht, ye = Q(
    /*teamOptions*/
    e[3]
  ), P = [];
  for (let R = 0; R < ye.length; R += 1)
    P[R] = Ot(At(e, ye, R));
  function St(...R) {
    return (
      /*change_handler*/
      e[10](
        /*row*/
        e[19],
        ...R
      )
    );
  }
  function Nt(...R) {
    return (
      /*input_handler*/
      e[11](
        /*row*/
        e[19],
        ...R
      )
    );
  }
  let me = Q(
    /*shiftOptions*/
    e[2]
  ), M = [];
  for (let R = 0; R < me.length; R += 1)
    M[R] = Ct(wt(e, me, R));
  function Gt(...R) {
    return (
      /*change_handler_1*/
      e[12](
        /*row*/
        e[19],
        ...R
      )
    );
  }
  function Wt(...R) {
    return (
      /*change_handler_2*/
      e[13](
        /*row*/
        e[19],
        ...R
      )
    );
  }
  function Xt(...R) {
    return (
      /*change_handler_3*/
      e[14](
        /*row*/
        e[19],
        ...R
      )
    );
  }
  function Vt(...R) {
    return (
      /*change_handler_4*/
      e[15](
        /*row*/
        e[19],
        ...R
      )
    );
  }
  function Kt(...R) {
    return (
      /*change_handler_5*/
      e[16](
        /*row*/
        e[19],
        ...R
      )
    );
  }
  function Ht(...R) {
    return (
      /*change_handler_6*/
      e[17](
        /*row*/
        e[19],
        ...R
      )
    );
  }
  let ze = Q([0, 1, 2, 3, 4, 5, 6]), H = [];
  for (let R = 0; R < 7; R += 1)
    H[R] = Lt(Rt(e, ze, R));
  return {
    key: t,
    first: null,
    c() {
      n = m("tr"), s = m("td"), d = m("select"), l = m("option"), l.textContent = "—";
      for (let R = 0; R < P.length; R += 1)
        P[R].c();
      o = S(), a = m("td"), c = m("input"), F = S(), C = m("td"), h = m("select"), _ = m("option"), _.textContent = "—";
      for (let R = 0; R < M.length; R += 1)
        M[R].c();
      k = S(), B = m("td"), b = q(I), p = S(), T = m("td"), j = q(D), et = S(), Oe = m("td"), W = m("select"), $ = m("option"), $.textContent = "—", ee = m("option"), ee.textContent = "TSO", te = m("option"), te.textContent = "LTSO", ne = m("option"), ne.textContent = "STSO", nt = S(), Le = m("td"), N = m("select"), le = m("option"), le.textContent = "—", ie = m("option"), ie.textContent = "FT", oe = m("option"), oe.textContent = "PT", ae = m("option"), ae.textContent = "LTSO", se = m("option"), se.textContent = "STSO", it = S(), De = m("td"), V = m("select"), re = m("option"), re.textContent = "—", ue = m("option"), ue.textContent = "M", fe = m("option"), fe.textContent = "F", at = S(), Be = m("td"), X = m("select"), de = m("option"), de.textContent = "—", ce = m("option"), ce.textContent = "DFO", _e = m("option"), _e.textContent = "BAG", he = m("option"), he.textContent = "PAX", rt = S(), Ie = m("td"), K = m("select"), ve = m("option"), ve.textContent = "—", pe = m("option"), pe.textContent = "A", ge = m("option"), ge.textContent = "B", ft = S(), Me = m("td"), Ke = q(Se), dt = S(), Ne = m("td"), He = q(Ge), ct = S();
      for (let R = 0; R < 7; R += 1)
        H[R].c();
      je = S(), We = m("td"), Ue = q(Xe), _t = S(), l.__value = "", L(l, l.__value), v(d, "class", "line-edit svelte-5u69by"), v(d, "data-field", "team"), v(d, "data-line-id", i = /*row*/
      e[19]?.id), v(s, "class", "svelte-5u69by"), v(c, "type", "text"), v(c, "class", "line-edit line-code-input svelte-5u69by"), v(c, "data-field", "lineCode"), v(c, "data-line-id", r = /*row*/
      e[19]?.id), c.value = A = /*row*/
      e[19]?.line ?? "", v(a, "class", "svelte-5u69by"), _.__value = "", L(_, _.__value), v(h, "class", "line-edit svelte-5u69by"), v(h, "data-field", "shift"), v(h, "data-line-id", w = /*row*/
      e[19]?.id), v(C, "class", "svelte-5u69by"), v(B, "class", "svelte-5u69by"), v(T, "class", "svelte-5u69by"), $.__value = "", L($, $.__value), ee.__value = "TSO", L(ee, ee.__value), te.__value = "LTSO", L(te, te.__value), ne.__value = "STSO", L(ne, ne.__value), v(W, "class", "line-edit svelte-5u69by"), v(W, "data-field", "position"), v(W, "data-line-id", Ce = /*row*/
      e[19]?.id), v(Oe, "class", "svelte-5u69by"), le.__value = "", L(le, le.__value), ie.__value = "FT", L(ie, ie.__value), oe.__value = "PT", L(oe, oe.__value), ae.__value = "LTSO", L(ae, ae.__value), se.__value = "STSO", L(se, se.__value), v(N, "class", "line-edit svelte-5u69by"), v(N, "data-field", "emp"), v(N, "data-line-id", Te = /*row*/
      e[19]?.id), v(Le, "class", "svelte-5u69by"), re.__value = "", L(re, re.__value), ue.__value = "M", L(ue, ue.__value), fe.__value = "F", L(fe, fe.__value), v(V, "class", "line-edit svelte-5u69by"), v(V, "data-field", "sex"), v(V, "data-line-id", ke = /*row*/
      e[19]?.id), v(De, "class", "svelte-5u69by"), de.__value = "", L(de, de.__value), ce.__value = "DFO", L(ce, ce.__value), _e.__value = "BAG", L(_e, _e.__value), he.__value = "PAX", L(he, he.__value), v(X, "class", "line-edit svelte-5u69by"), v(X, "data-field", "function"), v(X, "data-line-id", Ee = /*row*/
      e[19]?.id), v(Be, "class", "svelte-5u69by"), ve.__value = "", L(ve, ve.__value), pe.__value = "A", L(pe, pe.__value), ge.__value = "B", L(ge, ge.__value), v(K, "class", "line-edit svelte-5u69by"), v(K, "data-field", "certPool"), v(K, "data-line-id", Pe = /*row*/
      e[19]?.id), v(Ie, "class", "svelte-5u69by"), v(Me, "class", "line-rdo-cell svelte-5u69by"), v(Ne, "class", "svelte-5u69by"), v(We, "class", "line-hours svelte-5u69by"), v(n, "data-line-row", Ve = /*row*/
      e[19]?.id), this.first = n;
    },
    m(R, O) {
      Z(R, n, O), f(n, s), f(s, d), f(d, l);
      for (let y = 0; y < P.length; y += 1)
        P[y] && P[y].m(d, null);
      G(
        d,
        /*row*/
        e[19]?.teamId ?? ""
      ), f(n, o), f(n, a), f(a, c), f(n, F), f(n, C), f(C, h), f(h, _);
      for (let y = 0; y < M.length; y += 1)
        M[y] && M[y].m(h, null);
      G(
        h,
        /*row*/
        e[19]?.shiftId ?? ""
      ), f(n, k), f(n, B), f(B, b), f(n, p), f(n, T), f(T, j), f(n, et), f(n, Oe), f(Oe, W), f(W, $), f(W, ee), f(W, te), f(W, ne), G(
        W,
        /*row*/
        e[19]?.position ?? ""
      ), f(n, nt), f(n, Le), f(Le, N), f(N, le), f(N, ie), f(N, oe), f(N, ae), f(N, se), G(
        N,
        /*row*/
        e[19]?.emp ?? ""
      ), f(n, it), f(n, De), f(De, V), f(V, re), f(V, ue), f(V, fe), G(
        V,
        /*row*/
        e[19]?.sex ?? ""
      ), f(n, at), f(n, Be), f(Be, X), f(X, de), f(X, ce), f(X, _e), f(X, he), G(
        X,
        /*row*/
        e[19]?.function ?? ""
      ), f(n, rt), f(n, Ie), f(Ie, K), f(K, ve), f(K, pe), f(K, ge), G(
        K,
        /*row*/
        e[19]?.certPool ?? ""
      ), f(n, ft), f(n, Me), f(Me, Ke), f(n, dt), f(n, Ne), f(Ne, He), f(n, ct);
      for (let y = 0; y < 7; y += 1)
        H[y] && H[y].m(n, null);
      f(n, je), f(n, We), f(We, Ue), f(n, _t), qe || (ht = [
        U(d, "change", St),
        U(c, "input", Nt),
        U(h, "change", Gt),
        U(W, "change", Wt),
        U(N, "change", Xt),
        U(V, "change", Vt),
        U(X, "change", Kt),
        U(K, "change", Ht)
      ], qe = !0);
    },
    p(R, O) {
      if (e = R, O & /*teamOptions*/
      8) {
        ye = Q(
          /*teamOptions*/
          e[3]
        );
        let y;
        for (y = 0; y < ye.length; y += 1) {
          const J = At(e, ye, y);
          P[y] ? P[y].p(J, O) : (P[y] = Ot(J), P[y].c(), P[y].m(d, null));
        }
        for (; y < P.length; y += 1)
          P[y].d(1);
        P.length = ye.length;
      }
      if (O & /*rows, teamOptions*/
      9 && i !== (i = /*row*/
      e[19]?.id) && v(d, "data-line-id", i), O & /*rows, teamOptions*/
      9 && u !== (u = /*row*/
      e[19]?.teamId ?? "") && G(
        d,
        /*row*/
        e[19]?.teamId ?? ""
      ), O & /*rows, teamOptions*/
      9 && r !== (r = /*row*/
      e[19]?.id) && v(c, "data-line-id", r), O & /*rows, teamOptions*/
      9 && A !== (A = /*row*/
      e[19]?.line ?? "") && c.value !== A && (c.value = A), O & /*shiftOptions, shiftLabel*/
      4) {
        me = Q(
          /*shiftOptions*/
          e[2]
        );
        let y;
        for (y = 0; y < me.length; y += 1) {
          const J = wt(e, me, y);
          M[y] ? M[y].p(J, O) : (M[y] = Ct(J), M[y].c(), M[y].m(h, null));
        }
        for (; y < M.length; y += 1)
          M[y].d(1);
        M.length = me.length;
      }
      if (O & /*rows, teamOptions*/
      9 && w !== (w = /*row*/
      e[19]?.id) && v(h, "data-line-id", w), O & /*rows, teamOptions*/
      9 && g !== (g = /*row*/
      e[19]?.shiftId ?? "") && G(
        h,
        /*row*/
        e[19]?.shiftId ?? ""
      ), O & /*rows*/
      1 && I !== (I = /*row*/
      (e[19]?.start ?? "") + "") && Y(b, I), O & /*rows*/
      1 && D !== (D = /*row*/
      (e[19]?.end ?? "") + "") && Y(j, D), O & /*rows, teamOptions*/
      9 && Ce !== (Ce = /*row*/
      e[19]?.id) && v(W, "data-line-id", Ce), O & /*rows, teamOptions*/
      9 && tt !== (tt = /*row*/
      e[19]?.position ?? "") && G(
        W,
        /*row*/
        e[19]?.position ?? ""
      ), O & /*rows, teamOptions*/
      9 && Te !== (Te = /*row*/
      e[19]?.id) && v(N, "data-line-id", Te), O & /*rows, teamOptions*/
      9 && lt !== (lt = /*row*/
      e[19]?.emp ?? "") && G(
        N,
        /*row*/
        e[19]?.emp ?? ""
      ), O & /*rows, teamOptions*/
      9 && ke !== (ke = /*row*/
      e[19]?.id) && v(V, "data-line-id", ke), O & /*rows, teamOptions*/
      9 && ot !== (ot = /*row*/
      e[19]?.sex ?? "") && G(
        V,
        /*row*/
        e[19]?.sex ?? ""
      ), O & /*rows, teamOptions*/
      9 && Ee !== (Ee = /*row*/
      e[19]?.id) && v(X, "data-line-id", Ee), O & /*rows, teamOptions*/
      9 && st !== (st = /*row*/
      e[19]?.function ?? "") && G(
        X,
        /*row*/
        e[19]?.function ?? ""
      ), O & /*rows, teamOptions*/
      9 && Pe !== (Pe = /*row*/
      e[19]?.id) && v(K, "data-line-id", Pe), O & /*rows, teamOptions*/
      9 && ut !== (ut = /*row*/
      e[19]?.certPool ?? "") && G(
        K,
        /*row*/
        e[19]?.certPool ?? ""
      ), O & /*rows*/
      1 && Se !== (Se = /*row*/
      (e[19]?.rdos ?? "—") + "") && Y(Ke, Se), O & /*rows*/
      1 && Ge !== (Ge = /*row*/
      (e[19]?.paid ?? "") + "") && Y(He, Ge), O & /*dayClass, rows, dayStyle, emitDay*/
      161) {
        ze = Q([0, 1, 2, 3, 4, 5, 6]);
        let y;
        for (y = 0; y < 7; y += 1) {
          const J = Rt(e, ze, y);
          H[y] ? H[y].p(J, O) : (H[y] = Lt(J), H[y].c(), H[y].m(n, je));
        }
        for (; y < 7; y += 1)
          H[y].d(1);
      }
      O & /*rows*/
      1 && Xe !== (Xe = /*row*/
      (e[19]?.hours ?? "") + "") && Y(Ue, Xe), O & /*rows, teamOptions*/
      9 && Ve !== (Ve = /*row*/
      e[19]?.id) && v(n, "data-line-row", Ve);
    },
    d(R) {
      R && z(n), Qe(P, R), Qe(M, R), Qe(H, R), qe = !1, Ae(ht);
    }
  };
}
function _n(t) {
  let e;
  function n(l, i) {
    return (
      /*mode*/
      l[1] === "svelte" ? cn : dn
    );
  }
  let s = n(t), d = s(t);
  return {
    c() {
      e = m("div"), d.c(), v(e, "class", "lines-table-root svelte-5u69by"), E(e, "min-height", "min(70vh, 720px)"), E(e, "height", "min(70vh, 720px)"), E(e, "width", "100%"), E(
        e,
        "--export-rdo",
        /*exportStyle*/
        t[4]?.rdo || "#000000"
      ), E(
        e,
        "--export-bag",
        /*exportStyle*/
        t[4]?.bag || "#F4B4B4"
      ), E(
        e,
        "--export-dfo",
        /*exportStyle*/
        t[4]?.dfo || "#FFF3A8"
      ), E(
        e,
        "--export-pax",
        /*exportStyle*/
        t[4]?.pax || "#A0C4FF"
      ), E(
        e,
        "--export-header",
        /*exportStyle*/
        t[4]?.header || "#1F4E79"
      );
    },
    m(l, i) {
      Z(l, e, i), d.m(e, null);
    },
    p(l, [i]) {
      s === (s = n(l)) && d ? d.p(l, i) : (d.d(1), d = s(l), d && (d.c(), d.m(e, null))), i & /*exportStyle*/
      16 && E(
        e,
        "--export-rdo",
        /*exportStyle*/
        l[4]?.rdo || "#000000"
      ), i & /*exportStyle*/
      16 && E(
        e,
        "--export-bag",
        /*exportStyle*/
        l[4]?.bag || "#F4B4B4"
      ), i & /*exportStyle*/
      16 && E(
        e,
        "--export-dfo",
        /*exportStyle*/
        l[4]?.dfo || "#FFF3A8"
      ), i & /*exportStyle*/
      16 && E(
        e,
        "--export-pax",
        /*exportStyle*/
        l[4]?.pax || "#A0C4FF"
      ), i & /*exportStyle*/
      16 && E(
        e,
        "--export-header",
        /*exportStyle*/
        l[4]?.header || "#1F4E79"
      );
    },
    i: x,
    o: x,
    d(l) {
      l && z(e), d.d();
    }
  };
}
function Dt(t) {
  if (!t) return "";
  const e = t.name || t.id || "";
  return t.start && t.end ? (e ? e + " " : "") + "(" + t.start + "–" + t.end + ")" : t.start ? e ? e + " " + t.start : t.start : e;
}
function Mt(t) {
  const e = String(t || "").toUpperCase();
  return e === "RDO" || e === "—" || e === "-" ? "rdo" : e === "BAG" || e === "BAGS" ? "bag" : e === "DFO" ? "dfo" : e === "PAX" ? "pax" : null;
}
function kt(t) {
  const e = Mt(t);
  return e === "rdo" ? "cell-toggle cell-rdo" : e === "bag" ? "cell-toggle cell-function-duty cell-bag" : e === "dfo" ? "cell-toggle cell-function-duty cell-dfo" : e === "pax" ? "cell-toggle cell-function-duty cell-pax" : "cell-toggle cell-work";
}
function hn(t, e, n) {
  let { rows: s = [] } = e, { mode: d = "svelte" } = e, { shiftOptions: l = [] } = e, { teamOptions: i = [] } = e, { exportStyle: u = mt() } = e, { onInlineEdit: o = null } = e, { onDayToggle: a = null } = e;
  function c(b) {
    const p = Mt(b);
    if (!p) return;
    const D = (u || mt())[p];
    if (D)
      return "background:" + D + ";color:" + fn(D) + ";";
  }
  function r(b, p, T) {
    o?.({ lineId: b, field: p, value: T });
  }
  function A(b, p) {
    a?.({ lineId: b, dayIndex: p });
  }
  const F = (b, p) => r(b?.id, "team", p.target.value), C = (b, p) => r(b?.id, "lineCode", p.target.value), h = (b, p) => r(b?.id, "shift", p.target.value), _ = (b, p) => r(b?.id, "position", p.target.value), w = (b, p) => r(b?.id, "emp", p.target.value), g = (b, p) => r(b?.id, "sex", p.target.value), k = (b, p) => r(b?.id, "function", p.target.value), B = (b, p) => r(b?.id, "certPool", p.target.value), I = (b, p) => A(b?.id, p);
  return t.$$set = (b) => {
    "rows" in b && n(0, s = b.rows), "mode" in b && n(1, d = b.mode), "shiftOptions" in b && n(2, l = b.shiftOptions), "teamOptions" in b && n(3, i = b.teamOptions), "exportStyle" in b && n(4, u = b.exportStyle), "onInlineEdit" in b && n(8, o = b.onInlineEdit), "onDayToggle" in b && n(9, a = b.onDayToggle);
  }, [
    s,
    d,
    l,
    i,
    u,
    c,
    r,
    A,
    o,
    a,
    F,
    C,
    h,
    _,
    w,
    g,
    k,
    B,
    I
  ];
}
class vn extends sn {
  constructor(e) {
    super(), an(this, e, hn, _n, qt, {
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
function pn(t) {
  if (t = t || window.Scheduler, !t) return;
  function e(l) {
    var i = String(l || "").trim();
    if (!i) return "";
    var u = i.match(/^(\d+)$/);
    return u && Number(u[1]) < 10 ? "0" + u[1] : i;
  }
  function n(l, i) {
    var u = (l.rdoDays || []).map(Number).filter(function(a) {
      return Number.isInteger(a) && a >= 0 && a <= 6;
    }), o = u.length ? u.map(function(a) {
      return i && i[a] != null ? i[a] : String(a);
    }).join(",") : "—";
    return l.rdoHard && (o += " (hard)"), o;
  }
  function s(l, i, u) {
    return u || "WORK";
  }
  function d(l, i) {
    return i === "BAG" || i === "PAX" ? i : l.function === "BAG" ? "BAG" : l.function === "DFO" || l.function === "PAX" ? "PAX" : i === "BAG" || i === "PAX" ? i : null;
  }
  t.lineToRowModel = function(l, i, u) {
    if (u = u || {}, !l || !i) return null;
    for (var o = u.dayNames || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], a = typeof u.teamResolver == "function" ? u.teamResolver(l.id) : null, c = typeof u.shiftResolver == "function" ? u.shiftResolver(l.shiftId) : null, r = l.shiftName || c && c.name || "", A = c && c.start ? c.start : "", F = c && c.end ? c.end : "", C = l.shiftLabel || (A && F ? A + "–" + F : A || "WORK"), h = !!(l.isExtra || l.extraPositionId), _ = h ? l.position || l.extraName || "TSO" : l.isStso || l.empClass === "STSO" ? "STSO" : l.isLtso || l.empClass === "LTSO" ? "LTSO" : "TSO", w = h ? l.empClass && l.empClass !== "FT" ? l.empClass : l.position || l.extraName || "" : _ === "STSO" || _ === "LTSO" ? "FT" : l.empClass === "PT" ? "PT" : "FT", g = l.paid || 0, k = Array.isArray(i) ? i : i[l.id] || i[String(l.id)] || [], B = [], I = [], b = 0, p = 0; p < 7; p++) {
      var T = k[p];
      if (T === "WORK") {
        b += g;
        var D = typeof u.rotationDutyResolver == "function" ? u.rotationDutyResolver(l.id, p) : null, j = s(l, D, C);
        B.push(j), I.push(d(l, D));
      } else
        B.push("RDO"), I.push("RDO");
    }
    return {
      id: l.id,
      teamId: a && a.id || "",
      shiftId: l.shiftId || "",
      team: e(a && (a.name || a.id) || ""),
      line: l.lineCode || "",
      shift: r,
      start: A,
      end: F,
      position: _,
      emp: w,
      sex: l.sex || "M",
      function: l.function || "",
      certPool: l.certPool || "",
      rdos: n(l, o),
      paid: g,
      days: B,
      dayDuties: I,
      hours: b
    };
  }, t.getRowModels = function(l, i, u) {
    return !Array.isArray(l) || !i || typeof i != "object" ? [] : l.map(function(o) {
      return t.lineToRowModel(o, i, u);
    }).filter(Boolean);
  }, t.getLineRowModels = function(l) {
    var i = t.state && Array.isArray(t.state.lines) ? t.state.lines : [], u = t.state && t.state.schedule || {}, o = Object.assign({}, l || {});
    return !o.teamResolver && typeof t.teamMetaForLine == "function" && (o.teamResolver = t.teamMetaForLine), !o.shiftResolver && typeof t.getShift == "function" && (o.shiftResolver = t.getShift), !o.rotationDutyResolver && typeof t.getRotationDuty == "function" && (o.rotationDutyResolver = t.getRotationDuty), t.getRowModels(i, u, o);
  };
}
function gn(t) {
  if (t = t || window.Scheduler, !t) return;
  function e(u, o) {
    var a = t.getRotationDuty ? t.getRotationDuty(u.id, o) : null;
    return a || u.function || null;
  }
  t.dutyFor = e;
  function n(u) {
    if (u.shiftLabel) return u.shiftLabel;
    var o = t.getShift ? t.getShift(u.shiftId) : null;
    return o && o.start && o.end ? o.start + "–" + o.end : o && o.start ? o.start : "WORK";
  }
  function s(u) {
    if (!(!u || u.function !== "BAG")) {
      t.state.functionRotation || (t.state.functionRotation = {});
      var o = String(u.id);
      t.state.functionRotation[o] || (t.state.functionRotation[o] = []);
      for (var a = t.state.schedule && (t.state.schedule[u.id] || t.state.schedule[o]) || [], c = Math.max(a.length, (t.state.weekCount || 1) * 7), r = 0; r < c; r++) {
        for (; t.state.functionRotation[o].length <= r; ) t.state.functionRotation[o].push(null);
        a[r] === "WORK" && (t.state.functionRotation[o][r] = "BAG");
      }
    }
  }
  function d(u) {
    if (!(!u || u.function !== "DFO")) {
      t.state.functionRotation || (t.state.functionRotation = {});
      var o = String(u.id);
      t.state.functionRotation[o] || (t.state.functionRotation[o] = []);
      for (var a = t.state.schedule && (t.state.schedule[u.id] || t.state.schedule[o]) || [], c = Math.max(a.length, (t.state.weekCount || 1) * 7), r = 0; r < c; r++) {
        for (; t.state.functionRotation[o].length <= r; ) t.state.functionRotation[o].push(null);
        a[r] === "WORK" && (t.state.functionRotation[o][r] = "DFO");
      }
    }
  }
  function l() {
    var u = document.getElementById("lines-tbody"), o = u || document.querySelector(".lines-virtual-root");
    o && u && o.querySelectorAll("td.cell-toggle").forEach(function(a) {
      var c = t.findLineById ? t.findLineById(a.getAttribute("data-line-id")) : null, r = +a.getAttribute("data-day");
      if (!(!c || isNaN(r))) {
        var A = (t.state.schedule[c.id] || t.state.schedule[String(c.id)] || [])[r] || "RDO";
        if (a.style.background = "", a.style.color = "", A !== "WORK") {
          a.className = "cell-rdo cell-toggle", a.textContent = "RDO", a.style.background = "#000", a.style.color = "#fff", a.style.opacity = "1";
          return;
        }
        var F = e(c, r), C = F === "BAG" || F === "BAGS", h = F === "DFO", _ = "";
        C ? _ = " cell-function-duty cell-bag" : h && (_ = " cell-function-duty cell-dfo"), a.className = "cell-work cell-toggle" + _, a.textContent = n(c);
      }
    });
  }
  t.paintLineColors = l;
  function i(u) {
    var o = t[u];
    if (!(typeof o != "function" || o._lineColorsWrapped)) {
      var a = function() {
        if (t.__USE_SVELTE_LINES) return o.apply(this, arguments);
        var c = o.apply(this, arguments);
        return setTimeout(l, 0), c;
      };
      a._lineColorsWrapped = !0, t[u] = a;
    }
  }
  i("renderLines"), i("renderAll"), i("generateFunctionAssignments"), t._lineColorsBound || (t._lineColorsBound = !0, document.addEventListener("change", function(u) {
    var o = u.target;
    if (!(!o || o.getAttribute("data-field") !== "function")) {
      var a = t.findLineById ? t.findLineById(o.getAttribute("data-line-id")) : null;
      a && (a.function = o.value === "DFO" || o.value === "PAX" || o.value === "BAG" ? o.value : "", a.function === "BAG" && s(a), a.function === "DFO" && d(a), t.renderLines ? t.renderLines() : l());
    }
  }));
}
function mn(t) {
  const e = t || window.Scheduler;
  if (!e) return;
  pn(e), gn(e);
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
      rotationDutyResolver: typeof e.getRotationDuty == "function" ? e.getRotationDuty : d
    };
  }
  function d(h, _) {
    const w = String(h), g = e.state && e.state.functionRotation, k = g && (g[w] || g[h]);
    if (!Array.isArray(k)) return null;
    const B = k[_];
    return B === "BAG" ? "BAG" : B === "PAX" || B === "DFO" ? "PAX" : null;
  }
  function l(h, _, w) {
    var g = String(h);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[g] || (e.state.functionRotation[g] = []); e.state.functionRotation[g].length <= _; ) e.state.functionRotation[g].push(null);
    e.state.functionRotation[g][_] = w;
  }
  function i(h) {
    if (!h) return !1;
    if (h.function === "DFO") return !0;
    const _ = h.functionEligible;
    return !!(_ && (_.dfo === !0 || _.DFO === !0));
  }
  function u() {
    const h = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], _ = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(h)) : h, w = e.state && e.state.schedule || {}, g = typeof e.getRowModels == "function" ? e.getRowModels(_, w, s()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(s()) : [];
    return Array.isArray(g) ? g : [];
  }
  function o() {
    return e.teams && Array.isArray(e.teams.teams) ? e.teams.teams : [];
  }
  function a() {
    return e.state && Array.isArray(e.state.shifts) ? e.state.shifts : [];
  }
  function c() {
    return typeof e.getExportStyle == "function" ? e.getExportStyle() : e.state && e.state.exportStyle || null;
  }
  function r(h) {
    if (!h || typeof h.$set != "function") return;
    const _ = u();
    typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), h.$set({
      rows: Array.isArray(_) ? _ : [],
      shiftOptions: a(),
      teamOptions: o(),
      exportStyle: c()
    });
  }
  function A(h) {
    if (!h) return;
    const _ = e.findLineById ? e.findLineById(h.lineId) : null;
    if (!_) return;
    const w = h.field, g = h.value;
    if (w === "lineCode")
      _.lineCode = String(g || "").trim() || _.lineCode;
    else if (w === "sex")
      _.sex = g === "F" ? "F" : "M";
    else if (w === "function")
      _.function = g === "DFO" || g === "PAX" || g === "BAG" ? g : "";
    else if (w === "certPool") {
      var k = String(g || "").trim().toUpperCase();
      _.certPool = k === "A" || k === "B" ? k : "";
    } else w === "emp" || w === "position" ? e.applyLineEmp && e.applyLineEmp(_, g) : w === "shift" ? e.applyLineShift && e.applyLineShift(_, g) : w === "team" && e.setLineTeam && e.setLineTeam(h.lineId, g);
    e.updateStatus && e.updateStatus("Updated " + (_.lineCode || h.lineId)), C(), (w === "emp" || w === "position" || w === "shift") && e.renderCoverageBars && e.renderCoverageBars(), w === "team" && e.renderTeams && e.renderTeams();
  }
  function F(h) {
    if (!h) return;
    const _ = e.findLineById ? e.findLineById(h.lineId) : null, w = Number(h.dayIndex);
    if (!_ || !Number.isInteger(w) || w < 0 || w > 6) return;
    const g = String(_.id);
    e.state.schedule || (e.state.schedule = {});
    var k = e.state.schedule[g] || e.state.schedule[_.id];
    for (Array.isArray(k) || (k = []), e.state.schedule[g] = k; e.state.schedule[g].length < 7; ) e.state.schedule[g].push("RDO");
    e.state.functionRotation || (e.state.functionRotation = {}), !e.state.functionRotation[g] && e.state.functionRotation[_.id] && (e.state.functionRotation[g] = e.state.functionRotation[_.id]);
    const B = e.state.schedule[g][w] || "RDO", I = _.function === "BAG", b = i(_);
    if (B !== "WORK")
      e.state.schedule[g][w] = "WORK", I ? l(g, w, "BAG") : b ? l(g, w, "PAX") : l(g, w, null);
    else if (I)
      e.state.schedule[g][w] = "RDO", l(g, w, null);
    else if (b) {
      var p = typeof e.getRotationDuty == "function" ? e.getRotationDuty(_.id, w) : d(_.id, w), T = p === "DFO" || p === "PAX" || !p ? "PAX" : p;
      T === "PAX" ? l(g, w, "BAG") : (e.state.schedule[g][w] = "RDO", l(g, w, null));
    } else
      e.state.schedule[g][w] = "RDO", l(g, w, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(_), C(), e.renderCoverageBars && e.renderCoverageBars();
  }
  const C = () => {
    try {
      const h = n._linesTableApp;
      if (h)
        r(h);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const _ = u();
        typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), n._linesTableApp = new vn({
          target: n,
          props: {
            rows: Array.isArray(_) ? _ : [],
            shiftOptions: a(),
            teamOptions: o(),
            exportStyle: c(),
            onInlineEdit: A,
            onDayToggle: F
          }
        });
      }
    } catch (h) {
      console.error("lines-table: refresh failed", h);
    }
  };
  C(), document.addEventListener("click", (h) => {
    const _ = h.target.closest?.(".tab-btn");
    _ && _.dataset.tab === "lines" && C();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((h) => {
    window.addEventListener(h, C);
  }), n.refresh = C;
}
export {
  mn as initLinesTable
};
