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
function q(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function Qe(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function b(t) {
  return document.createElement(t);
}
function U(t) {
  return document.createTextNode(t);
}
function S() {
  return U(" ");
}
function j(t, e, n, s) {
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
function N(t, e, n) {
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
  const _ = {};
  for (; C--; ) _[t[C].key] = C;
  const h = [], w = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), T = [];
  for (C = F; C--; ) {
    const y = r(d, l, C), D = n(y);
    let k = i.get(D);
    k ? T.push(() => k.p(y, e)) : (k = a(D, y), k.c()), w.set(D, h[C] = k), D in _ && g.set(D, Math.abs(C - _[D]));
  }
  const B = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Set();
  function p(y) {
    Pt(y, 1), y.m(u, c), i.set(y.key, y), c = y.first, F--;
  }
  for (; A && F; ) {
    const y = h[F - 1], D = t[A - 1], k = y.key, z = D.key;
    y === D ? (c = y.first, A--, F--) : w.has(z) ? !i.has(k) || B.has(k) ? p(y) : I.has(z) ? A-- : g.get(k) > g.get(z) ? (I.add(k), p(y)) : (B.add(z), A--) : (o(D, i), A--);
  }
  for (; A--; ) {
    const y = t[A];
    w.has(y.key) || o(y, i);
  }
  for (; F; ) p(h[F - 1]);
  return Ae(T), h;
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
      a.fragment && a.fragment.l(r), r.forEach(q);
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
      e = b("div"), e.textContent = "Classic Lines mode active", v(e, "class", "muted");
    },
    m(n, s) {
      Z(n, e, s);
    },
    p: x,
    d(n) {
      n && q(e);
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
    u.set(F, i[r] = Dt(F, A));
  }
  let c = null;
  return o.length || (c = Ft()), {
    c() {
      e = b("div"), n = b("table"), s = b("thead"), s.innerHTML = '<tr><th class="svelte-5u69by">Team</th> <th class="svelte-5u69by">Line</th> <th class="svelte-5u69by">Shift</th> <th class="svelte-5u69by">Start</th> <th class="svelte-5u69by">End</th> <th class="svelte-5u69by">Position</th> <th class="svelte-5u69by">Emp</th> <th class="svelte-5u69by">Sex</th> <th class="svelte-5u69by">Function</th> <th class="svelte-5u69by">Cert pool</th> <th class="svelte-5u69by">RDOs</th> <th class="svelte-5u69by">Paid</th> <th class="svelte-5u69by">Sun</th> <th class="svelte-5u69by">Mon</th> <th class="svelte-5u69by">Tue</th> <th class="svelte-5u69by">Wed</th> <th class="svelte-5u69by">Thu</th> <th class="svelte-5u69by">Fri</th> <th class="svelte-5u69by">Sat</th> <th class="svelte-5u69by">Hours</th></tr>', d = S(), l = b("tbody");
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
      ), i = tn(i, A, a, 1, r, o, u, l, en, Dt, null, bt), !o.length && c ? c.p(r, A) : o.length ? c && (c.d(1), c = null) : (c = Ft(), c.c(), c.m(l, null)));
    },
    d(r) {
      r && q(e);
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
      e = b("tr"), e.innerHTML = '<td colspan="20" class="muted svelte-5u69by">No lines — Generate or Import first.</td>';
    },
    m(n, s) {
      Z(n, e, s);
    },
    p: x,
    d(n) {
      n && q(e);
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
      e = b("option"), s = U(n), e.__value = d = /*team*/
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
      l && q(e);
    }
  };
}
function Ct(t) {
  let e, n = Tt(
    /*shift*/
    t[25]
  ) + "", s, d;
  return {
    c() {
      e = b("option"), s = U(n), e.__value = d = /*shift*/
      t[25].id, L(e, e.__value);
    },
    m(l, i) {
      Z(l, e, i), f(e, s);
    },
    p(l, i) {
      i & /*shiftOptions*/
      4 && n !== (n = Tt(
        /*shift*/
        l[25]
      ) + "") && Y(s, n), i & /*shiftOptions*/
      4 && d !== (d = /*shift*/
      l[25].id) && (e.__value = d, L(e, e.__value));
    },
    d(l) {
      l && q(e);
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
      e = b("td"), s = U(n), v(e, "class", d = pt(kt(
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
      Z(c, e, r), f(e, s), u || (o = j(e, "click", a), u = !0);
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
      c && q(e), u = !1, o();
    }
  };
}
function Dt(t, e) {
  let n, s, d, l, i, u, o, a, c, r, A, F, C, _, h, w, g, T, B, I = (
    /*row*/
    (e[19]?.start ?? "") + ""
  ), p, y, D, k = (
    /*row*/
    (e[19]?.end ?? "") + ""
  ), z, et, Oe, W, $, ee, te, ne, Ce, tt, nt, Le, G, le, ie, oe, ae, se, De, lt, it, Te, V, re, ue, fe, ke, ot, at, Be, X, de, ce, _e, he, Ee, st, rt, Ie, K, ve, pe, ge, Pe, ut, ft, Me, Se = (
    /*row*/
    (e[19]?.rdos ?? "—") + ""
  ), Ke, dt, Ge, Ne = (
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
  function Gt(...R) {
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
  function Nt(...R) {
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
      n = b("tr"), s = b("td"), d = b("select"), l = b("option"), l.textContent = "—";
      for (let R = 0; R < P.length; R += 1)
        P[R].c();
      o = S(), a = b("td"), c = b("input"), F = S(), C = b("td"), _ = b("select"), h = b("option"), h.textContent = "—";
      for (let R = 0; R < M.length; R += 1)
        M[R].c();
      T = S(), B = b("td"), p = U(I), y = S(), D = b("td"), z = U(k), et = S(), Oe = b("td"), W = b("select"), $ = b("option"), $.textContent = "—", ee = b("option"), ee.textContent = "TSO", te = b("option"), te.textContent = "LTSO", ne = b("option"), ne.textContent = "STSO", nt = S(), Le = b("td"), G = b("select"), le = b("option"), le.textContent = "—", ie = b("option"), ie.textContent = "FT", oe = b("option"), oe.textContent = "PT", ae = b("option"), ae.textContent = "LTSO", se = b("option"), se.textContent = "STSO", it = S(), Te = b("td"), V = b("select"), re = b("option"), re.textContent = "—", ue = b("option"), ue.textContent = "M", fe = b("option"), fe.textContent = "F", at = S(), Be = b("td"), X = b("select"), de = b("option"), de.textContent = "—", ce = b("option"), ce.textContent = "DFO", _e = b("option"), _e.textContent = "BAG", he = b("option"), he.textContent = "PAX", rt = S(), Ie = b("td"), K = b("select"), ve = b("option"), ve.textContent = "—", pe = b("option"), pe.textContent = "A", ge = b("option"), ge.textContent = "B", ft = S(), Me = b("td"), Ke = U(Se), dt = S(), Ge = b("td"), He = U(Ne), ct = S();
      for (let R = 0; R < 7; R += 1)
        H[R].c();
      je = S(), We = b("td"), Ue = U(Xe), _t = S(), l.__value = "", L(l, l.__value), v(d, "class", "line-edit svelte-5u69by"), v(d, "data-field", "team"), v(d, "data-line-id", i = /*row*/
      e[19]?.id), v(s, "class", "svelte-5u69by"), v(c, "type", "text"), v(c, "class", "line-edit line-code-input svelte-5u69by"), v(c, "data-field", "lineCode"), v(c, "data-line-id", r = /*row*/
      e[19]?.id), c.value = A = /*row*/
      e[19]?.line ?? "", v(a, "class", "svelte-5u69by"), h.__value = "", L(h, h.__value), v(_, "class", "line-edit svelte-5u69by"), v(_, "data-field", "shift"), v(_, "data-line-id", w = /*row*/
      e[19]?.id), v(C, "class", "svelte-5u69by"), v(B, "class", "svelte-5u69by"), v(D, "class", "svelte-5u69by"), $.__value = "", L($, $.__value), ee.__value = "TSO", L(ee, ee.__value), te.__value = "LTSO", L(te, te.__value), ne.__value = "STSO", L(ne, ne.__value), v(W, "class", "line-edit svelte-5u69by"), v(W, "data-field", "position"), v(W, "data-line-id", Ce = /*row*/
      e[19]?.id), v(Oe, "class", "svelte-5u69by"), le.__value = "", L(le, le.__value), ie.__value = "FT", L(ie, ie.__value), oe.__value = "PT", L(oe, oe.__value), ae.__value = "LTSO", L(ae, ae.__value), se.__value = "STSO", L(se, se.__value), v(G, "class", "line-edit svelte-5u69by"), v(G, "data-field", "emp"), v(G, "data-line-id", De = /*row*/
      e[19]?.id), v(Le, "class", "svelte-5u69by"), re.__value = "", L(re, re.__value), ue.__value = "M", L(ue, ue.__value), fe.__value = "F", L(fe, fe.__value), v(V, "class", "line-edit svelte-5u69by"), v(V, "data-field", "sex"), v(V, "data-line-id", ke = /*row*/
      e[19]?.id), v(Te, "class", "svelte-5u69by"), de.__value = "", L(de, de.__value), ce.__value = "DFO", L(ce, ce.__value), _e.__value = "BAG", L(_e, _e.__value), he.__value = "PAX", L(he, he.__value), v(X, "class", "line-edit svelte-5u69by"), v(X, "data-field", "function"), v(X, "data-line-id", Ee = /*row*/
      e[19]?.id), v(Be, "class", "svelte-5u69by"), ve.__value = "", L(ve, ve.__value), pe.__value = "A", L(pe, pe.__value), ge.__value = "B", L(ge, ge.__value), v(K, "class", "line-edit svelte-5u69by"), v(K, "data-field", "certPool"), v(K, "data-line-id", Pe = /*row*/
      e[19]?.id), v(Ie, "class", "svelte-5u69by"), v(Me, "class", "line-rdo-cell svelte-5u69by"), v(Ge, "class", "svelte-5u69by"), v(We, "class", "line-hours svelte-5u69by"), v(n, "data-line-row", Ve = /*row*/
      e[19]?.id), this.first = n;
    },
    m(R, O) {
      Z(R, n, O), f(n, s), f(s, d), f(d, l);
      for (let m = 0; m < P.length; m += 1)
        P[m] && P[m].m(d, null);
      N(
        d,
        /*row*/
        e[19]?.teamId ?? ""
      ), f(n, o), f(n, a), f(a, c), f(n, F), f(n, C), f(C, _), f(_, h);
      for (let m = 0; m < M.length; m += 1)
        M[m] && M[m].m(_, null);
      N(
        _,
        /*row*/
        e[19]?.shiftId ?? ""
      ), f(n, T), f(n, B), f(B, p), f(n, y), f(n, D), f(D, z), f(n, et), f(n, Oe), f(Oe, W), f(W, $), f(W, ee), f(W, te), f(W, ne), N(
        W,
        /*row*/
        e[19]?.position ?? ""
      ), f(n, nt), f(n, Le), f(Le, G), f(G, le), f(G, ie), f(G, oe), f(G, ae), f(G, se), N(
        G,
        /*row*/
        e[19]?.emp ?? ""
      ), f(n, it), f(n, Te), f(Te, V), f(V, re), f(V, ue), f(V, fe), N(
        V,
        /*row*/
        e[19]?.sex ?? ""
      ), f(n, at), f(n, Be), f(Be, X), f(X, de), f(X, ce), f(X, _e), f(X, he), N(
        X,
        /*row*/
        e[19]?.function ?? ""
      ), f(n, rt), f(n, Ie), f(Ie, K), f(K, ve), f(K, pe), f(K, ge), N(
        K,
        /*row*/
        e[19]?.certPool ?? ""
      ), f(n, ft), f(n, Me), f(Me, Ke), f(n, dt), f(n, Ge), f(Ge, He), f(n, ct);
      for (let m = 0; m < 7; m += 1)
        H[m] && H[m].m(n, null);
      f(n, je), f(n, We), f(We, Ue), f(n, _t), qe || (ht = [
        j(d, "change", St),
        j(c, "input", Gt),
        j(_, "change", Nt),
        j(W, "change", Wt),
        j(G, "change", Xt),
        j(V, "change", Vt),
        j(X, "change", Kt),
        j(K, "change", Ht)
      ], qe = !0);
    },
    p(R, O) {
      if (e = R, O & /*teamOptions*/
      8) {
        ye = Q(
          /*teamOptions*/
          e[3]
        );
        let m;
        for (m = 0; m < ye.length; m += 1) {
          const J = At(e, ye, m);
          P[m] ? P[m].p(J, O) : (P[m] = Ot(J), P[m].c(), P[m].m(d, null));
        }
        for (; m < P.length; m += 1)
          P[m].d(1);
        P.length = ye.length;
      }
      if (O & /*rows, teamOptions*/
      9 && i !== (i = /*row*/
      e[19]?.id) && v(d, "data-line-id", i), O & /*rows, teamOptions*/
      9 && u !== (u = /*row*/
      e[19]?.teamId ?? "") && N(
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
        let m;
        for (m = 0; m < me.length; m += 1) {
          const J = wt(e, me, m);
          M[m] ? M[m].p(J, O) : (M[m] = Ct(J), M[m].c(), M[m].m(_, null));
        }
        for (; m < M.length; m += 1)
          M[m].d(1);
        M.length = me.length;
      }
      if (O & /*rows, teamOptions*/
      9 && w !== (w = /*row*/
      e[19]?.id) && v(_, "data-line-id", w), O & /*rows, teamOptions*/
      9 && g !== (g = /*row*/
      e[19]?.shiftId ?? "") && N(
        _,
        /*row*/
        e[19]?.shiftId ?? ""
      ), O & /*rows*/
      1 && I !== (I = /*row*/
      (e[19]?.start ?? "") + "") && Y(p, I), O & /*rows*/
      1 && k !== (k = /*row*/
      (e[19]?.end ?? "") + "") && Y(z, k), O & /*rows, teamOptions*/
      9 && Ce !== (Ce = /*row*/
      e[19]?.id) && v(W, "data-line-id", Ce), O & /*rows, teamOptions*/
      9 && tt !== (tt = /*row*/
      e[19]?.position ?? "") && N(
        W,
        /*row*/
        e[19]?.position ?? ""
      ), O & /*rows, teamOptions*/
      9 && De !== (De = /*row*/
      e[19]?.id) && v(G, "data-line-id", De), O & /*rows, teamOptions*/
      9 && lt !== (lt = /*row*/
      e[19]?.emp ?? "") && N(
        G,
        /*row*/
        e[19]?.emp ?? ""
      ), O & /*rows, teamOptions*/
      9 && ke !== (ke = /*row*/
      e[19]?.id) && v(V, "data-line-id", ke), O & /*rows, teamOptions*/
      9 && ot !== (ot = /*row*/
      e[19]?.sex ?? "") && N(
        V,
        /*row*/
        e[19]?.sex ?? ""
      ), O & /*rows, teamOptions*/
      9 && Ee !== (Ee = /*row*/
      e[19]?.id) && v(X, "data-line-id", Ee), O & /*rows, teamOptions*/
      9 && st !== (st = /*row*/
      e[19]?.function ?? "") && N(
        X,
        /*row*/
        e[19]?.function ?? ""
      ), O & /*rows, teamOptions*/
      9 && Pe !== (Pe = /*row*/
      e[19]?.id) && v(K, "data-line-id", Pe), O & /*rows, teamOptions*/
      9 && ut !== (ut = /*row*/
      e[19]?.certPool ?? "") && N(
        K,
        /*row*/
        e[19]?.certPool ?? ""
      ), O & /*rows*/
      1 && Se !== (Se = /*row*/
      (e[19]?.rdos ?? "—") + "") && Y(Ke, Se), O & /*rows*/
      1 && Ne !== (Ne = /*row*/
      (e[19]?.paid ?? "") + "") && Y(He, Ne), O & /*dayClass, rows, dayStyle, emitDay*/
      161) {
        ze = Q([0, 1, 2, 3, 4, 5, 6]);
        let m;
        for (m = 0; m < 7; m += 1) {
          const J = Rt(e, ze, m);
          H[m] ? H[m].p(J, O) : (H[m] = Lt(J), H[m].c(), H[m].m(n, je));
        }
        for (; m < 7; m += 1)
          H[m].d(1);
      }
      O & /*rows*/
      1 && Xe !== (Xe = /*row*/
      (e[19]?.hours ?? "") + "") && Y(Ue, Xe), O & /*rows, teamOptions*/
      9 && Ve !== (Ve = /*row*/
      e[19]?.id) && v(n, "data-line-row", Ve);
    },
    d(R) {
      R && q(n), Qe(P, R), Qe(M, R), Qe(H, R), qe = !1, Ae(ht);
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
      e = b("div"), d.c(), v(e, "class", "lines-table-root svelte-5u69by"), E(e, "min-height", "min(70vh, 720px)"), E(e, "height", "min(70vh, 720px)"), E(e, "width", "100%"), E(
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
      l && q(e), d.d();
    }
  };
}
function Tt(t) {
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
  function c(p) {
    const y = Mt(p);
    if (!y) return;
    const k = (u || mt())[y];
    if (k)
      return "background:" + k + ";color:" + fn(k) + ";";
  }
  function r(p, y, D) {
    o?.({ lineId: p, field: y, value: D });
  }
  function A(p, y) {
    a?.({ lineId: p, dayIndex: y });
  }
  const F = (p, y) => r(p?.id, "team", y.target.value), C = (p, y) => r(p?.id, "lineCode", y.target.value), _ = (p, y) => r(p?.id, "shift", y.target.value), h = (p, y) => r(p?.id, "position", y.target.value), w = (p, y) => r(p?.id, "emp", y.target.value), g = (p, y) => r(p?.id, "sex", y.target.value), T = (p, y) => r(p?.id, "function", y.target.value), B = (p, y) => r(p?.id, "certPool", y.target.value), I = (p, y) => A(p?.id, y);
  return t.$$set = (p) => {
    "rows" in p && n(0, s = p.rows), "mode" in p && n(1, d = p.mode), "shiftOptions" in p && n(2, l = p.shiftOptions), "teamOptions" in p && n(3, i = p.teamOptions), "exportStyle" in p && n(4, u = p.exportStyle), "onInlineEdit" in p && n(8, o = p.onInlineEdit), "onDayToggle" in p && n(9, a = p.onDayToggle);
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
    _,
    h,
    w,
    g,
    T,
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
    for (var o = u.dayNames || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], a = typeof u.teamResolver == "function" ? u.teamResolver(l.id) : null, c = typeof u.shiftResolver == "function" ? u.shiftResolver(l.shiftId) : null, r = l.shiftName || c && c.name || "", A = c && c.start ? c.start : "", F = c && c.end ? c.end : "", C = l.shiftLabel || (A && F ? A + "–" + F : A || "WORK"), _ = l.isStso || l.empClass === "STSO" ? "STSO" : l.isLtso || l.empClass === "LTSO" ? "LTSO" : "TSO", h = _ === "STSO" || _ === "LTSO" ? "FT" : l.empClass === "PT" ? "PT" : "FT", w = l.paid || 0, g = Array.isArray(i) ? i : i[l.id] || i[String(l.id)] || [], T = [], B = [], I = 0, p = 0; p < 7; p++) {
      var y = g[p];
      if (y === "WORK") {
        I += w;
        var D = typeof u.rotationDutyResolver == "function" ? u.rotationDutyResolver(l.id, p) : null, k = s(l, D, C);
        T.push(k), B.push(d(l, D));
      } else
        T.push("RDO"), B.push("RDO");
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
      emp: h,
      sex: l.sex || "M",
      function: l.function || "",
      certPool: l.certPool || "",
      rdos: n(l, o),
      paid: w,
      days: T,
      dayDuties: B,
      hours: I
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
        var F = e(c, r), C = F === "BAG" || F === "BAGS", _ = F === "DFO", h = "";
        C ? h = " cell-function-duty cell-bag" : _ && (h = " cell-function-duty cell-dfo"), a.className = "cell-work cell-toggle" + h, a.textContent = n(c);
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
  function d(_, h) {
    const w = String(_), g = e.state && e.state.functionRotation, T = g && (g[w] || g[_]);
    if (!Array.isArray(T)) return null;
    const B = T[h];
    return B === "BAG" ? "BAG" : B === "PAX" || B === "DFO" ? "PAX" : null;
  }
  function l(_, h, w) {
    var g = String(_);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[g] || (e.state.functionRotation[g] = []); e.state.functionRotation[g].length <= h; ) e.state.functionRotation[g].push(null);
    e.state.functionRotation[g][h] = w;
  }
  function i(_) {
    if (!_) return !1;
    if (_.function === "DFO") return !0;
    const h = _.functionEligible;
    return !!(h && (h.dfo === !0 || h.DFO === !0));
  }
  function u() {
    const _ = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], h = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(_)) : _, w = e.state && e.state.schedule || {}, g = typeof e.getRowModels == "function" ? e.getRowModels(h, w, s()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(s()) : [];
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
  function r(_) {
    if (!_ || typeof _.$set != "function") return;
    const h = u();
    typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), _.$set({
      rows: Array.isArray(h) ? h : [],
      shiftOptions: a(),
      teamOptions: o(),
      exportStyle: c()
    });
  }
  function A(_) {
    if (!_) return;
    const h = e.findLineById ? e.findLineById(_.lineId) : null;
    if (!h) return;
    const w = _.field, g = _.value;
    if (w === "lineCode")
      h.lineCode = String(g || "").trim() || h.lineCode;
    else if (w === "sex")
      h.sex = g === "F" ? "F" : "M";
    else if (w === "function")
      h.function = g === "DFO" || g === "PAX" || g === "BAG" ? g : "";
    else if (w === "certPool") {
      var T = String(g || "").trim().toUpperCase();
      h.certPool = T === "A" || T === "B" ? T : "";
    } else w === "emp" || w === "position" ? e.applyLineEmp && e.applyLineEmp(h, g) : w === "shift" ? e.applyLineShift && e.applyLineShift(h, g) : w === "team" && e.setLineTeam && e.setLineTeam(_.lineId, g);
    e.updateStatus && e.updateStatus("Updated " + (h.lineCode || _.lineId)), C(), (w === "emp" || w === "position" || w === "shift") && e.renderCoverageBars && e.renderCoverageBars(), w === "team" && e.renderTeams && e.renderTeams();
  }
  function F(_) {
    if (!_) return;
    const h = e.findLineById ? e.findLineById(_.lineId) : null, w = Number(_.dayIndex);
    if (!h || !Number.isInteger(w) || w < 0 || w > 6) return;
    const g = String(h.id);
    e.state.schedule || (e.state.schedule = {});
    var T = e.state.schedule[g] || e.state.schedule[h.id];
    for (Array.isArray(T) || (T = []), e.state.schedule[g] = T; e.state.schedule[g].length < 7; ) e.state.schedule[g].push("RDO");
    e.state.functionRotation || (e.state.functionRotation = {}), !e.state.functionRotation[g] && e.state.functionRotation[h.id] && (e.state.functionRotation[g] = e.state.functionRotation[h.id]);
    const B = e.state.schedule[g][w] || "RDO", I = h.function === "BAG", p = i(h);
    if (B !== "WORK")
      e.state.schedule[g][w] = "WORK", I ? l(g, w, "BAG") : p ? l(g, w, "PAX") : l(g, w, null);
    else if (I)
      e.state.schedule[g][w] = "RDO", l(g, w, null);
    else if (p) {
      var y = typeof e.getRotationDuty == "function" ? e.getRotationDuty(h.id, w) : d(h.id, w), D = y === "DFO" || y === "PAX" || !y ? "PAX" : y;
      D === "PAX" ? l(g, w, "BAG") : (e.state.schedule[g][w] = "RDO", l(g, w, null));
    } else
      e.state.schedule[g][w] = "RDO", l(g, w, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(h), C(), e.renderCoverageBars && e.renderCoverageBars();
  }
  const C = () => {
    try {
      const _ = n._linesTableApp;
      if (_)
        r(_);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const h = u();
        typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), n._linesTableApp = new vn({
          target: n,
          props: {
            rows: Array.isArray(h) ? h : [],
            shiftOptions: a(),
            teamOptions: o(),
            exportStyle: c(),
            onInlineEdit: A,
            onDayToggle: F
          }
        });
      }
    } catch (_) {
      console.error("lines-table: refresh failed", _);
    }
  };
  C(), document.addEventListener("click", (_) => {
    const h = _.target.closest?.(".tab-btn");
    h && h.dataset.tab === "lines" && C();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((_) => {
    window.addEventListener(_, C);
  }), n.refresh = C;
}
export {
  mn as initLinesTable
};
