var Pt = Object.defineProperty;
var St = (t, e, n) => e in t ? Pt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ke = (t, e, n) => St(t, typeof e != "symbol" ? e + "" : e, n);
function Z() {
}
function At(t) {
  return t();
}
function st() {
  return /* @__PURE__ */ Object.create(null);
}
function me(t) {
  t.forEach(At);
}
function Ft(t) {
  return typeof t == "function";
}
function Gt(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Nt(t) {
  return Object.keys(t).length === 0;
}
function rt(t) {
  return t ?? "";
}
function c(t, e) {
  t.appendChild(e);
}
function Y(t, e, n) {
  t.insertBefore(e, n || null);
}
function j(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function He(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function R(t) {
  return document.createElement(t);
}
function H(t) {
  return document.createTextNode(t);
}
function G() {
  return H(" ");
}
function z(t, e, n, s) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n, s);
}
function v(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Wt(t) {
  return Array.from(t.childNodes);
}
function Q(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function k(t, e) {
  t.value = e ?? "";
}
function E(t, e, n, s) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
function V(t, e, n) {
  for (let s = 0; s < t.options.length; s += 1) {
    const f = t.options[s];
    if (f.__value === e) {
      f.selected = !0;
      return;
    }
  }
  t.selectedIndex = -1;
}
let ze;
function be(t) {
  ze = t;
}
const ye = [], ut = [];
let ge = [];
const ft = [], Xt = /* @__PURE__ */ Promise.resolve();
let Ue = !1;
function Vt() {
  Ue || (Ue = !0, Xt.then(Ot));
}
function qe(t) {
  ge.push(t);
}
const je = /* @__PURE__ */ new Set();
let pe = 0;
function Ot() {
  if (pe !== 0)
    return;
  const t = ze;
  do {
    try {
      for (; pe < ye.length; ) {
        const e = ye[pe];
        pe++, be(e), Kt(e.$$);
      }
    } catch (e) {
      throw ye.length = 0, pe = 0, e;
    }
    for (be(null), ye.length = 0, pe = 0; ut.length; ) ut.pop()();
    for (let e = 0; e < ge.length; e += 1) {
      const n = ge[e];
      je.has(n) || (je.add(n), n());
    }
    ge.length = 0;
  } while (ye.length);
  for (; ft.length; )
    ft.pop()();
  Ue = !1, je.clear(), be(t);
}
function Kt(t) {
  if (t.fragment !== null) {
    t.update(), me(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(qe);
  }
}
function Ht(t) {
  const e = [], n = [];
  ge.forEach((s) => t.indexOf(s) === -1 ? e.push(s) : n.push(s)), n.forEach((s) => s()), ge = e;
}
const jt = /* @__PURE__ */ new Set();
function Lt(t, e) {
  t && t.i && (jt.delete(t), t.i(e));
}
function J(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function Ut(t, e) {
  t.d(1), e.delete(t.key);
}
function qt(t, e, n, s, f, i, l, u, o, a, d, r) {
  let w = t.length, F = i.length, L = w;
  const h = {};
  for (; L--; ) h[t[L].key] = L;
  const _ = [], g = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), C = [];
  for (L = F; L--; ) {
    const O = r(f, i, L), T = n(O);
    let I = l.get(T);
    I ? C.push(() => I.p(O, e)) : (I = a(T, O), I.c()), g.set(T, _[L] = I), T in h && p.set(T, Math.abs(L - h[T]));
  }
  const B = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set();
  function A(O) {
    Lt(O, 1), O.m(u, d), l.set(O.key, O), d = O.first, F--;
  }
  for (; w && F; ) {
    const O = _[F - 1], T = t[w - 1], I = O.key, U = T.key;
    O === T ? (d = O.first, w--, F--) : g.has(U) ? !l.has(I) || B.has(I) ? A(O) : m.has(U) ? w-- : p.get(I) > p.get(U) ? (m.add(I), A(O)) : (B.add(U), w--) : (o(T, l), w--);
  }
  for (; w--; ) {
    const O = t[w];
    g.has(O.key) || o(O, l);
  }
  for (; F; ) A(_[F - 1]);
  return me(C), _;
}
function zt(t, e, n) {
  const { fragment: s, after_update: f } = t.$$;
  s && s.m(e, n), qe(() => {
    const i = t.$$.on_mount.map(At).filter(Ft);
    t.$$.on_destroy ? t.$$.on_destroy.push(...i) : me(i), t.$$.on_mount = [];
  }), f.forEach(qe);
}
function Jt(t, e) {
  const n = t.$$;
  n.fragment !== null && (Ht(n.after_update), me(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function Qt(t, e) {
  t.$$.dirty[0] === -1 && (ye.push(t), Vt(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function Yt(t, e, n, s, f, i, l = null, u = [-1]) {
  const o = ze;
  be(t);
  const a = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: i,
    update: Z,
    not_equal: f,
    bound: st(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (o ? o.$$.context : [])),
    // everything else
    callbacks: st(),
    dirty: u,
    skip_bound: !1,
    root: e.target || o.$$.root
  };
  l && l(a.root);
  let d = !1;
  if (a.ctx = n ? n(t, e.props || {}, (r, w, ...F) => {
    const L = F.length ? F[0] : w;
    return a.ctx && f(a.ctx[r], a.ctx[r] = L) && (!a.skip_bound && a.bound[r] && a.bound[r](L), d && Qt(t, r)), w;
  }) : [], a.update(), d = !0, me(a.before_update), a.fragment = s ? s(a.ctx) : !1, e.target) {
    if (e.hydrate) {
      const r = Wt(e.target);
      a.fragment && a.fragment.l(r), r.forEach(j);
    } else
      a.fragment && a.fragment.c();
    e.intro && Lt(t.$$.fragment), zt(t, e.target, e.anchor), Ot();
  }
  be(o);
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
    Ke(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Ke(this, "$$set");
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
    if (!Ft(n))
      return Z;
    const s = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return s.push(n), () => {
      const f = s.indexOf(n);
      f !== -1 && s.splice(f, 1);
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
const xt = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(xt);
function dt() {
  return {
    rdo: "#000000",
    bag: "#F4B4B4",
    dfo: "#FFF3A8",
    pax: "#A0C4FF",
    header: "#1F4E79"
  };
}
function $t(t, e) {
  if (!t) return e;
  var n = String(t).replace("#", "").trim();
  return n.length === 3 && (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]), n.length !== 6 || /[^0-9a-fA-F]/.test(n) ? e : "#" + n.toUpperCase();
}
function en(t) {
  var e = $t(t, "#FFFFFF") || "#FFFFFF", n = e.slice(1), s = parseInt(n.slice(0, 2), 16), f = parseInt(n.slice(2, 4), 16), i = parseInt(n.slice(4, 6), 16), l = (0.299 * s + 0.587 * f + 0.114 * i) / 255;
  return l < 0.45 ? "#FFFFFF" : "#111111";
}
function ct(t, e, n) {
  const s = t.slice();
  return s[18] = e[n], s;
}
function ht(t, e, n) {
  const s = t.slice();
  return s[21] = e[n], s;
}
function _t(t, e, n) {
  const s = t.slice();
  return s[24] = e[n], s;
}
function vt(t, e, n) {
  const s = t.slice();
  return s[27] = e[n], s;
}
function tn(t) {
  let e;
  return {
    c() {
      e = R("div"), e.textContent = "Classic Lines mode active", v(e, "class", "muted");
    },
    m(n, s) {
      Y(n, e, s);
    },
    p: Z,
    d(n) {
      n && j(e);
    }
  };
}
function nn(t) {
  let e, n, s, f, i, l = [], u = /* @__PURE__ */ new Map(), o = J(
    /*rows*/
    t[0]
  );
  const a = (r) => (
    /*row*/
    r[18].id
  );
  for (let r = 0; r < o.length; r += 1) {
    let w = ct(t, o, r), F = a(w);
    u.set(F, l[r] = bt(F, w));
  }
  let d = null;
  return o.length || (d = pt()), {
    c() {
      e = R("div"), n = R("table"), s = R("thead"), s.innerHTML = '<tr><th class="svelte-5u69by">Team</th> <th class="svelte-5u69by">Line</th> <th class="svelte-5u69by">Shift</th> <th class="svelte-5u69by">Start</th> <th class="svelte-5u69by">End</th> <th class="svelte-5u69by">Position</th> <th class="svelte-5u69by">Emp</th> <th class="svelte-5u69by">Sex</th> <th class="svelte-5u69by">Function</th> <th class="svelte-5u69by">RDOs</th> <th class="svelte-5u69by">Paid</th> <th class="svelte-5u69by">Sun</th> <th class="svelte-5u69by">Mon</th> <th class="svelte-5u69by">Tue</th> <th class="svelte-5u69by">Wed</th> <th class="svelte-5u69by">Thu</th> <th class="svelte-5u69by">Fri</th> <th class="svelte-5u69by">Sat</th> <th class="svelte-5u69by">Hours</th></tr>', f = G(), i = R("tbody");
      for (let r = 0; r < l.length; r += 1)
        l[r].c();
      d && d.c(), v(n, "class", "data-table lines-editable svelte-5u69by"), E(n, "width", "max-content"), E(n, "min-width", "1100px"), v(e, "class", "lines-virtual-root svelte-5u69by"), E(e, "height", "100%"), E(e, "overflow", "auto"), E(e, "position", "relative");
    },
    m(r, w) {
      Y(r, e, w), c(e, n), c(n, s), c(n, f), c(n, i);
      for (let F = 0; F < l.length; F += 1)
        l[F] && l[F].m(i, null);
      d && d.m(i, null);
    },
    p(r, w) {
      w & /*rows, dayClass, dayStyle, emitDay, emitEdit, shiftOptions, shiftLabel, teamOptions*/
      237 && (o = J(
        /*rows*/
        r[0]
      ), l = qt(l, w, a, 1, r, o, u, i, Ut, bt, null, ct), !o.length && d ? d.p(r, w) : o.length ? d && (d.d(1), d = null) : (d = pt(), d.c(), d.m(i, null)));
    },
    d(r) {
      r && j(e);
      for (let w = 0; w < l.length; w += 1)
        l[w].d();
      d && d.d();
    }
  };
}
function pt(t) {
  let e;
  return {
    c() {
      e = R("tr"), e.innerHTML = '<td colspan="19" class="muted svelte-5u69by">No lines — Generate or Import first.</td>';
    },
    m(n, s) {
      Y(n, e, s);
    },
    p: Z,
    d(n) {
      n && j(e);
    }
  };
}
function yt(t) {
  let e, n = (
    /*team*/
    (t[27].name ?? /*team*/
    t[27].id) + ""
  ), s, f;
  return {
    c() {
      e = R("option"), s = H(n), e.__value = f = /*team*/
      t[27].id, k(e, e.__value);
    },
    m(i, l) {
      Y(i, e, l), c(e, s);
    },
    p(i, l) {
      l & /*teamOptions*/
      8 && n !== (n = /*team*/
      (i[27].name ?? /*team*/
      i[27].id) + "") && Q(s, n), l & /*teamOptions*/
      8 && f !== (f = /*team*/
      i[27].id) && (e.__value = f, k(e, e.__value));
    },
    d(i) {
      i && j(e);
    }
  };
}
function gt(t) {
  let e, n = Rt(
    /*shift*/
    t[24]
  ) + "", s, f;
  return {
    c() {
      e = R("option"), s = H(n), e.__value = f = /*shift*/
      t[24].id, k(e, e.__value);
    },
    m(i, l) {
      Y(i, e, l), c(e, s);
    },
    p(i, l) {
      l & /*shiftOptions*/
      4 && n !== (n = Rt(
        /*shift*/
        i[24]
      ) + "") && Q(s, n), l & /*shiftOptions*/
      4 && f !== (f = /*shift*/
      i[24].id) && (e.__value = f, k(e, e.__value));
    },
    d(i) {
      i && j(e);
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
  ), s, f, i, l, u, o;
  function a() {
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
      e = R("td"), s = H(n), v(e, "class", f = rt(wt(
        /*row*/
        t[18]?.dayDuties?.[
          /*i*/
          t[21]
        ] ?? /*row*/
        t[18]?.days?.[
          /*i*/
          t[21]
        ]
      )) + " svelte-5u69by"), v(e, "style", i = /*dayStyle*/
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
      )), v(e, "data-line-id", l = /*row*/
      t[18]?.id), v(
        e,
        "data-day-index",
        /*i*/
        t[21]
      );
    },
    m(d, r) {
      Y(d, e, r), c(e, s), u || (o = z(e, "click", a), u = !0);
    },
    p(d, r) {
      t = d, r & /*rows*/
      1 && n !== (n = /*row*/
      (t[18]?.days?.[
        /*i*/
        t[21]
      ] ?? "") + "") && Q(s, n), r & /*rows, teamOptions*/
      9 && f !== (f = rt(wt(
        /*row*/
        t[18]?.dayDuties?.[
          /*i*/
          t[21]
        ] ?? /*row*/
        t[18]?.days?.[
          /*i*/
          t[21]
        ]
      )) + " svelte-5u69by") && v(e, "class", f), r & /*rows, teamOptions*/
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
      )) && v(e, "style", i), r & /*rows, teamOptions*/
      9 && l !== (l = /*row*/
      t[18]?.id) && v(e, "data-line-id", l);
    },
    d(d) {
      d && j(e), u = !1, o();
    }
  };
}
function bt(t, e) {
  let n, s, f, i, l, u, o, a, d, r, w, F, L, h, _, g, p, C, B, m = (
    /*row*/
    (e[18]?.start ?? "") + ""
  ), A, O, T, I = (
    /*row*/
    (e[18]?.end ?? "") + ""
  ), U, Je, Re, N, x, $, ee, te, we, Qe, Ye, Ae, S, ne, ie, le, oe, ae, Fe, Ze, xe, Oe, X, se, re, ue, Le, $e, et, De, W, fe, de, ce, he, Te, tt, nt, Ce, ke = (
    /*row*/
    (e[18]?.rdos ?? "—") + ""
  ), Se, it, Be, Ee = (
    /*row*/
    (e[18]?.paid ?? "") + ""
  ), Ge, lt, Ne, Ie, Me = (
    /*row*/
    (e[18]?.hours ?? "") + ""
  ), We, ot, Pe, Xe, at, _e = J(
    /*teamOptions*/
    e[3]
  ), M = [];
  for (let b = 0; b < _e.length; b += 1)
    M[b] = yt(vt(e, _e, b));
  function Tt(...b) {
    return (
      /*change_handler*/
      e[10](
        /*row*/
        e[18],
        ...b
      )
    );
  }
  function Ct(...b) {
    return (
      /*input_handler*/
      e[11](
        /*row*/
        e[18],
        ...b
      )
    );
  }
  let ve = J(
    /*shiftOptions*/
    e[2]
  ), P = [];
  for (let b = 0; b < ve.length; b += 1)
    P[b] = gt(_t(e, ve, b));
  function kt(...b) {
    return (
      /*change_handler_1*/
      e[12](
        /*row*/
        e[18],
        ...b
      )
    );
  }
  function Bt(...b) {
    return (
      /*change_handler_2*/
      e[13](
        /*row*/
        e[18],
        ...b
      )
    );
  }
  function Et(...b) {
    return (
      /*change_handler_3*/
      e[14](
        /*row*/
        e[18],
        ...b
      )
    );
  }
  function It(...b) {
    return (
      /*change_handler_4*/
      e[15](
        /*row*/
        e[18],
        ...b
      )
    );
  }
  function Mt(...b) {
    return (
      /*change_handler_5*/
      e[16](
        /*row*/
        e[18],
        ...b
      )
    );
  }
  let Ve = J([0, 1, 2, 3, 4, 5, 6]), K = [];
  for (let b = 0; b < 7; b += 1)
    K[b] = mt(ht(e, Ve, b));
  return {
    key: t,
    first: null,
    c() {
      n = R("tr"), s = R("td"), f = R("select"), i = R("option"), i.textContent = "—";
      for (let b = 0; b < M.length; b += 1)
        M[b].c();
      o = G(), a = R("td"), d = R("input"), F = G(), L = R("td"), h = R("select"), _ = R("option"), _.textContent = "—";
      for (let b = 0; b < P.length; b += 1)
        P[b].c();
      C = G(), B = R("td"), A = H(m), O = G(), T = R("td"), U = H(I), Je = G(), Re = R("td"), N = R("select"), x = R("option"), x.textContent = "—", $ = R("option"), $.textContent = "TSO", ee = R("option"), ee.textContent = "LTSO", te = R("option"), te.textContent = "STSO", Ye = G(), Ae = R("td"), S = R("select"), ne = R("option"), ne.textContent = "—", ie = R("option"), ie.textContent = "FT", le = R("option"), le.textContent = "PT", oe = R("option"), oe.textContent = "LTSO", ae = R("option"), ae.textContent = "STSO", xe = G(), Oe = R("td"), X = R("select"), se = R("option"), se.textContent = "—", re = R("option"), re.textContent = "M", ue = R("option"), ue.textContent = "F", et = G(), De = R("td"), W = R("select"), fe = R("option"), fe.textContent = "—", de = R("option"), de.textContent = "DFO", ce = R("option"), ce.textContent = "BAG", he = R("option"), he.textContent = "PAX", nt = G(), Ce = R("td"), Se = H(ke), it = G(), Be = R("td"), Ge = H(Ee), lt = G();
      for (let b = 0; b < 7; b += 1)
        K[b].c();
      Ne = G(), Ie = R("td"), We = H(Me), ot = G(), i.__value = "", k(i, i.__value), v(f, "class", "line-edit svelte-5u69by"), v(f, "data-field", "team"), v(f, "data-line-id", l = /*row*/
      e[18]?.id), v(s, "class", "svelte-5u69by"), v(d, "type", "text"), v(d, "class", "line-edit line-code-input svelte-5u69by"), v(d, "data-field", "lineCode"), v(d, "data-line-id", r = /*row*/
      e[18]?.id), d.value = w = /*row*/
      e[18]?.line ?? "", v(a, "class", "svelte-5u69by"), _.__value = "", k(_, _.__value), v(h, "class", "line-edit svelte-5u69by"), v(h, "data-field", "shift"), v(h, "data-line-id", g = /*row*/
      e[18]?.id), v(L, "class", "svelte-5u69by"), v(B, "class", "svelte-5u69by"), v(T, "class", "svelte-5u69by"), x.__value = "", k(x, x.__value), $.__value = "TSO", k($, $.__value), ee.__value = "LTSO", k(ee, ee.__value), te.__value = "STSO", k(te, te.__value), v(N, "class", "line-edit svelte-5u69by"), v(N, "data-field", "position"), v(N, "data-line-id", we = /*row*/
      e[18]?.id), v(Re, "class", "svelte-5u69by"), ne.__value = "", k(ne, ne.__value), ie.__value = "FT", k(ie, ie.__value), le.__value = "PT", k(le, le.__value), oe.__value = "LTSO", k(oe, oe.__value), ae.__value = "STSO", k(ae, ae.__value), v(S, "class", "line-edit svelte-5u69by"), v(S, "data-field", "emp"), v(S, "data-line-id", Fe = /*row*/
      e[18]?.id), v(Ae, "class", "svelte-5u69by"), se.__value = "", k(se, se.__value), re.__value = "M", k(re, re.__value), ue.__value = "F", k(ue, ue.__value), v(X, "class", "line-edit svelte-5u69by"), v(X, "data-field", "sex"), v(X, "data-line-id", Le = /*row*/
      e[18]?.id), v(Oe, "class", "svelte-5u69by"), fe.__value = "", k(fe, fe.__value), de.__value = "DFO", k(de, de.__value), ce.__value = "BAG", k(ce, ce.__value), he.__value = "PAX", k(he, he.__value), v(W, "class", "line-edit svelte-5u69by"), v(W, "data-field", "function"), v(W, "data-line-id", Te = /*row*/
      e[18]?.id), v(De, "class", "svelte-5u69by"), v(Ce, "class", "line-rdo-cell svelte-5u69by"), v(Be, "class", "svelte-5u69by"), v(Ie, "class", "line-hours svelte-5u69by"), v(n, "data-line-row", Pe = /*row*/
      e[18]?.id), this.first = n;
    },
    m(b, D) {
      Y(b, n, D), c(n, s), c(s, f), c(f, i);
      for (let y = 0; y < M.length; y += 1)
        M[y] && M[y].m(f, null);
      V(
        f,
        /*row*/
        e[18]?.teamId ?? ""
      ), c(n, o), c(n, a), c(a, d), c(n, F), c(n, L), c(L, h), c(h, _);
      for (let y = 0; y < P.length; y += 1)
        P[y] && P[y].m(h, null);
      V(
        h,
        /*row*/
        e[18]?.shiftId ?? ""
      ), c(n, C), c(n, B), c(B, A), c(n, O), c(n, T), c(T, U), c(n, Je), c(n, Re), c(Re, N), c(N, x), c(N, $), c(N, ee), c(N, te), V(
        N,
        /*row*/
        e[18]?.position ?? ""
      ), c(n, Ye), c(n, Ae), c(Ae, S), c(S, ne), c(S, ie), c(S, le), c(S, oe), c(S, ae), V(
        S,
        /*row*/
        e[18]?.emp ?? ""
      ), c(n, xe), c(n, Oe), c(Oe, X), c(X, se), c(X, re), c(X, ue), V(
        X,
        /*row*/
        e[18]?.sex ?? ""
      ), c(n, et), c(n, De), c(De, W), c(W, fe), c(W, de), c(W, ce), c(W, he), V(
        W,
        /*row*/
        e[18]?.function ?? ""
      ), c(n, nt), c(n, Ce), c(Ce, Se), c(n, it), c(n, Be), c(Be, Ge), c(n, lt);
      for (let y = 0; y < 7; y += 1)
        K[y] && K[y].m(n, null);
      c(n, Ne), c(n, Ie), c(Ie, We), c(n, ot), Xe || (at = [
        z(f, "change", Tt),
        z(d, "input", Ct),
        z(h, "change", kt),
        z(N, "change", Bt),
        z(S, "change", Et),
        z(X, "change", It),
        z(W, "change", Mt)
      ], Xe = !0);
    },
    p(b, D) {
      if (e = b, D & /*teamOptions*/
      8) {
        _e = J(
          /*teamOptions*/
          e[3]
        );
        let y;
        for (y = 0; y < _e.length; y += 1) {
          const q = vt(e, _e, y);
          M[y] ? M[y].p(q, D) : (M[y] = yt(q), M[y].c(), M[y].m(f, null));
        }
        for (; y < M.length; y += 1)
          M[y].d(1);
        M.length = _e.length;
      }
      if (D & /*rows, teamOptions*/
      9 && l !== (l = /*row*/
      e[18]?.id) && v(f, "data-line-id", l), D & /*rows, teamOptions*/
      9 && u !== (u = /*row*/
      e[18]?.teamId ?? "") && V(
        f,
        /*row*/
        e[18]?.teamId ?? ""
      ), D & /*rows, teamOptions*/
      9 && r !== (r = /*row*/
      e[18]?.id) && v(d, "data-line-id", r), D & /*rows, teamOptions*/
      9 && w !== (w = /*row*/
      e[18]?.line ?? "") && d.value !== w && (d.value = w), D & /*shiftOptions, shiftLabel*/
      4) {
        ve = J(
          /*shiftOptions*/
          e[2]
        );
        let y;
        for (y = 0; y < ve.length; y += 1) {
          const q = _t(e, ve, y);
          P[y] ? P[y].p(q, D) : (P[y] = gt(q), P[y].c(), P[y].m(h, null));
        }
        for (; y < P.length; y += 1)
          P[y].d(1);
        P.length = ve.length;
      }
      if (D & /*rows, teamOptions*/
      9 && g !== (g = /*row*/
      e[18]?.id) && v(h, "data-line-id", g), D & /*rows, teamOptions*/
      9 && p !== (p = /*row*/
      e[18]?.shiftId ?? "") && V(
        h,
        /*row*/
        e[18]?.shiftId ?? ""
      ), D & /*rows*/
      1 && m !== (m = /*row*/
      (e[18]?.start ?? "") + "") && Q(A, m), D & /*rows*/
      1 && I !== (I = /*row*/
      (e[18]?.end ?? "") + "") && Q(U, I), D & /*rows, teamOptions*/
      9 && we !== (we = /*row*/
      e[18]?.id) && v(N, "data-line-id", we), D & /*rows, teamOptions*/
      9 && Qe !== (Qe = /*row*/
      e[18]?.position ?? "") && V(
        N,
        /*row*/
        e[18]?.position ?? ""
      ), D & /*rows, teamOptions*/
      9 && Fe !== (Fe = /*row*/
      e[18]?.id) && v(S, "data-line-id", Fe), D & /*rows, teamOptions*/
      9 && Ze !== (Ze = /*row*/
      e[18]?.emp ?? "") && V(
        S,
        /*row*/
        e[18]?.emp ?? ""
      ), D & /*rows, teamOptions*/
      9 && Le !== (Le = /*row*/
      e[18]?.id) && v(X, "data-line-id", Le), D & /*rows, teamOptions*/
      9 && $e !== ($e = /*row*/
      e[18]?.sex ?? "") && V(
        X,
        /*row*/
        e[18]?.sex ?? ""
      ), D & /*rows, teamOptions*/
      9 && Te !== (Te = /*row*/
      e[18]?.id) && v(W, "data-line-id", Te), D & /*rows, teamOptions*/
      9 && tt !== (tt = /*row*/
      e[18]?.function ?? "") && V(
        W,
        /*row*/
        e[18]?.function ?? ""
      ), D & /*rows*/
      1 && ke !== (ke = /*row*/
      (e[18]?.rdos ?? "—") + "") && Q(Se, ke), D & /*rows*/
      1 && Ee !== (Ee = /*row*/
      (e[18]?.paid ?? "") + "") && Q(Ge, Ee), D & /*dayClass, rows, dayStyle, emitDay*/
      161) {
        Ve = J([0, 1, 2, 3, 4, 5, 6]);
        let y;
        for (y = 0; y < 7; y += 1) {
          const q = ht(e, Ve, y);
          K[y] ? K[y].p(q, D) : (K[y] = mt(q), K[y].c(), K[y].m(n, Ne));
        }
        for (; y < 7; y += 1)
          K[y].d(1);
      }
      D & /*rows*/
      1 && Me !== (Me = /*row*/
      (e[18]?.hours ?? "") + "") && Q(We, Me), D & /*rows, teamOptions*/
      9 && Pe !== (Pe = /*row*/
      e[18]?.id) && v(n, "data-line-row", Pe);
    },
    d(b) {
      b && j(n), He(M, b), He(P, b), He(K, b), Xe = !1, me(at);
    }
  };
}
function ln(t) {
  let e;
  function n(i, l) {
    return (
      /*mode*/
      i[1] === "svelte" ? nn : tn
    );
  }
  let s = n(t), f = s(t);
  return {
    c() {
      e = R("div"), f.c(), v(e, "class", "lines-table-root svelte-5u69by"), E(e, "min-height", "min(70vh, 720px)"), E(e, "height", "min(70vh, 720px)"), E(e, "width", "100%"), E(
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
    m(i, l) {
      Y(i, e, l), f.m(e, null);
    },
    p(i, [l]) {
      s === (s = n(i)) && f ? f.p(i, l) : (f.d(1), f = s(i), f && (f.c(), f.m(e, null))), l & /*exportStyle*/
      16 && E(
        e,
        "--export-rdo",
        /*exportStyle*/
        i[4]?.rdo || "#000000"
      ), l & /*exportStyle*/
      16 && E(
        e,
        "--export-bag",
        /*exportStyle*/
        i[4]?.bag || "#F4B4B4"
      ), l & /*exportStyle*/
      16 && E(
        e,
        "--export-dfo",
        /*exportStyle*/
        i[4]?.dfo || "#FFF3A8"
      ), l & /*exportStyle*/
      16 && E(
        e,
        "--export-pax",
        /*exportStyle*/
        i[4]?.pax || "#A0C4FF"
      ), l & /*exportStyle*/
      16 && E(
        e,
        "--export-header",
        /*exportStyle*/
        i[4]?.header || "#1F4E79"
      );
    },
    i: Z,
    o: Z,
    d(i) {
      i && j(e), f.d();
    }
  };
}
function Rt(t) {
  if (!t) return "";
  const e = t.name || t.id || "";
  return t.start && t.end ? (e ? e + " " : "") + "(" + t.start + "–" + t.end + ")" : t.start ? e ? e + " " + t.start : t.start : e;
}
function Dt(t) {
  const e = String(t || "").toUpperCase();
  return e === "RDO" || e === "—" || e === "-" ? "rdo" : e === "BAG" || e === "BAGS" ? "bag" : e === "DFO" ? "dfo" : e === "PAX" ? "pax" : null;
}
function wt(t) {
  const e = Dt(t);
  return e === "rdo" ? "cell-toggle cell-rdo" : e === "bag" ? "cell-toggle cell-function-duty cell-bag" : e === "dfo" ? "cell-toggle cell-function-duty cell-dfo" : e === "pax" ? "cell-toggle cell-function-duty cell-pax" : "cell-toggle cell-work";
}
function on(t, e, n) {
  let { rows: s = [] } = e, { mode: f = "svelte" } = e, { shiftOptions: i = [] } = e, { teamOptions: l = [] } = e, { exportStyle: u = dt() } = e, { onInlineEdit: o = null } = e, { onDayToggle: a = null } = e;
  function d(m) {
    const A = Dt(m);
    if (!A) return;
    const T = (u || dt())[A];
    if (T)
      return "background:" + T + ";color:" + en(T) + ";";
  }
  function r(m, A, O) {
    o?.({ lineId: m, field: A, value: O });
  }
  function w(m, A) {
    a?.({ lineId: m, dayIndex: A });
  }
  const F = (m, A) => r(m?.id, "team", A.target.value), L = (m, A) => r(m?.id, "lineCode", A.target.value), h = (m, A) => r(m?.id, "shift", A.target.value), _ = (m, A) => r(m?.id, "position", A.target.value), g = (m, A) => r(m?.id, "emp", A.target.value), p = (m, A) => r(m?.id, "sex", A.target.value), C = (m, A) => r(m?.id, "function", A.target.value), B = (m, A) => w(m?.id, A);
  return t.$$set = (m) => {
    "rows" in m && n(0, s = m.rows), "mode" in m && n(1, f = m.mode), "shiftOptions" in m && n(2, i = m.shiftOptions), "teamOptions" in m && n(3, l = m.teamOptions), "exportStyle" in m && n(4, u = m.exportStyle), "onInlineEdit" in m && n(8, o = m.onInlineEdit), "onDayToggle" in m && n(9, a = m.onDayToggle);
  }, [
    s,
    f,
    i,
    l,
    u,
    d,
    r,
    w,
    o,
    a,
    F,
    L,
    h,
    _,
    g,
    p,
    C,
    B
  ];
}
class an extends Zt {
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
function sn(t) {
  if (t = t || window.Scheduler, !t) return;
  function e(i) {
    var l = String(i || "").trim();
    if (!l) return "";
    var u = l.match(/^(\d+)$/);
    return u && Number(u[1]) < 10 ? "0" + u[1] : l;
  }
  function n(i, l) {
    var u = (i.rdoDays || []).map(Number).filter(function(a) {
      return Number.isInteger(a) && a >= 0 && a <= 6;
    }), o = u.length ? u.map(function(a) {
      return l && l[a] != null ? l[a] : String(a);
    }).join(",") : "—";
    return i.rdoHard && (o += " (hard)"), o;
  }
  function s(i, l, u) {
    return u || "WORK";
  }
  function f(i, l) {
    return l === "BAG" || l === "PAX" ? l : i.function === "BAG" ? "BAG" : i.function === "DFO" || i.function === "PAX" ? "PAX" : l === "BAG" || l === "PAX" ? l : null;
  }
  t.lineToRowModel = function(i, l, u) {
    if (u = u || {}, !i || !l) return null;
    for (var o = u.dayNames || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], a = typeof u.teamResolver == "function" ? u.teamResolver(i.id) : null, d = typeof u.shiftResolver == "function" ? u.shiftResolver(i.shiftId) : null, r = i.shiftName || d && d.name || "", w = d && d.start ? d.start : "", F = d && d.end ? d.end : "", L = i.shiftLabel || (w && F ? w + "–" + F : w || "WORK"), h = i.isStso || i.empClass === "STSO" ? "STSO" : i.isLtso || i.empClass === "LTSO" ? "LTSO" : "TSO", _ = h === "STSO" || h === "LTSO" ? "FT" : i.empClass === "PT" ? "PT" : "FT", g = i.paid || 0, p = Array.isArray(l) ? l : l[i.id] || l[String(i.id)] || [], C = [], B = [], m = 0, A = 0; A < 7; A++) {
      var O = p[A];
      if (O === "WORK") {
        m += g;
        var T = typeof u.rotationDutyResolver == "function" ? u.rotationDutyResolver(i.id, A) : null, I = s(i, T, L);
        C.push(I), B.push(f(i, T));
      } else
        C.push("RDO"), B.push("RDO");
    }
    return {
      id: i.id,
      teamId: a && a.id || "",
      shiftId: i.shiftId || "",
      team: e(a && (a.name || a.id) || ""),
      line: i.lineCode || "",
      shift: r,
      start: w,
      end: F,
      position: h,
      emp: _,
      sex: i.sex || "M",
      function: i.function || "",
      certPool: i.certPool || "",
      rdos: n(i, o),
      paid: g,
      days: C,
      dayDuties: B,
      hours: m
    };
  }, t.getRowModels = function(i, l, u) {
    return !Array.isArray(i) || !l || typeof l != "object" ? [] : i.map(function(o) {
      return t.lineToRowModel(o, l, u);
    }).filter(Boolean);
  }, t.getLineRowModels = function(i) {
    var l = t.state && Array.isArray(t.state.lines) ? t.state.lines : [], u = t.state && t.state.schedule || {}, o = Object.assign({}, i || {});
    return !o.teamResolver && typeof t.teamMetaForLine == "function" && (o.teamResolver = t.teamMetaForLine), !o.shiftResolver && typeof t.getShift == "function" && (o.shiftResolver = t.getShift), !o.rotationDutyResolver && typeof t.getRotationDuty == "function" && (o.rotationDutyResolver = t.getRotationDuty), t.getRowModels(l, u, o);
  };
}
function rn(t) {
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
      for (var a = t.state.schedule && (t.state.schedule[u.id] || t.state.schedule[o]) || [], d = Math.max(a.length, (t.state.weekCount || 1) * 7), r = 0; r < d; r++) {
        for (; t.state.functionRotation[o].length <= r; ) t.state.functionRotation[o].push(null);
        a[r] === "WORK" && (t.state.functionRotation[o][r] = "BAG");
      }
    }
  }
  function f(u) {
    if (!(!u || u.function !== "DFO")) {
      t.state.functionRotation || (t.state.functionRotation = {});
      var o = String(u.id);
      t.state.functionRotation[o] || (t.state.functionRotation[o] = []);
      for (var a = t.state.schedule && (t.state.schedule[u.id] || t.state.schedule[o]) || [], d = Math.max(a.length, (t.state.weekCount || 1) * 7), r = 0; r < d; r++) {
        for (; t.state.functionRotation[o].length <= r; ) t.state.functionRotation[o].push(null);
        a[r] === "WORK" && (t.state.functionRotation[o][r] = "DFO");
      }
    }
  }
  function i() {
    var u = document.getElementById("lines-tbody"), o = u || document.querySelector(".lines-virtual-root");
    o && u && o.querySelectorAll("td.cell-toggle").forEach(function(a) {
      var d = t.findLineById ? t.findLineById(a.getAttribute("data-line-id")) : null, r = +a.getAttribute("data-day");
      if (!(!d || isNaN(r))) {
        var w = (t.state.schedule[d.id] || t.state.schedule[String(d.id)] || [])[r] || "RDO";
        if (a.style.background = "", a.style.color = "", w !== "WORK") {
          a.className = "cell-rdo cell-toggle", a.textContent = "RDO", a.style.background = "#000", a.style.color = "#fff", a.style.opacity = "1";
          return;
        }
        var F = e(d, r), L = F === "BAG" || F === "BAGS", h = F === "DFO", _ = "";
        L ? _ = " cell-function-duty cell-bag" : h && (_ = " cell-function-duty cell-dfo"), a.className = "cell-work cell-toggle" + _, a.textContent = n(d);
      }
    });
  }
  t.paintLineColors = i;
  function l(u) {
    var o = t[u];
    if (!(typeof o != "function" || o._lineColorsWrapped)) {
      var a = function() {
        if (t.__USE_SVELTE_LINES) return o.apply(this, arguments);
        var d = o.apply(this, arguments);
        return setTimeout(i, 0), d;
      };
      a._lineColorsWrapped = !0, t[u] = a;
    }
  }
  l("renderLines"), l("renderAll"), l("generateFunctionAssignments"), t._lineColorsBound || (t._lineColorsBound = !0, document.addEventListener("change", function(u) {
    var o = u.target;
    if (!(!o || o.getAttribute("data-field") !== "function")) {
      var a = t.findLineById ? t.findLineById(o.getAttribute("data-line-id")) : null;
      a && (a.function = o.value === "DFO" || o.value === "PAX" || o.value === "BAG" ? o.value : "", a.function === "BAG" && s(a), a.function === "DFO" && f(a), t.renderLines ? t.renderLines() : i());
    }
  }));
}
function fn(t) {
  const e = t || window.Scheduler;
  if (!e) return;
  sn(e), rn(e);
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
      rotationDutyResolver: typeof e.getRotationDuty == "function" ? e.getRotationDuty : f
    };
  }
  function f(h, _) {
    const g = String(h), p = e.state && e.state.functionRotation, C = p && (p[g] || p[h]);
    if (!Array.isArray(C)) return null;
    const B = C[_];
    return B === "BAG" ? "BAG" : B === "PAX" || B === "DFO" ? "PAX" : null;
  }
  function i(h, _, g) {
    var p = String(h);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[p] || (e.state.functionRotation[p] = []); e.state.functionRotation[p].length <= _; ) e.state.functionRotation[p].push(null);
    e.state.functionRotation[p][_] = g;
  }
  function l(h) {
    if (!h) return !1;
    if (h.function === "DFO") return !0;
    const _ = h.functionEligible;
    return !!(_ && (_.dfo === !0 || _.DFO === !0));
  }
  function u() {
    const h = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], _ = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(h)) : h, g = e.state && e.state.schedule || {}, p = typeof e.getRowModels == "function" ? e.getRowModels(_, g, s()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(s()) : [];
    return Array.isArray(p) ? p : [];
  }
  function o() {
    return e.teams && Array.isArray(e.teams.teams) ? e.teams.teams : [];
  }
  function a() {
    return e.state && Array.isArray(e.state.shifts) ? e.state.shifts : [];
  }
  function d() {
    return typeof e.getExportStyle == "function" ? e.getExportStyle() : e.state && e.state.exportStyle || null;
  }
  function r(h) {
    if (!h || typeof h.$set != "function") return;
    const _ = u();
    typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), h.$set({
      rows: Array.isArray(_) ? _ : [],
      shiftOptions: a(),
      teamOptions: o(),
      exportStyle: d()
    });
  }
  function w(h) {
    if (!h) return;
    const _ = e.findLineById ? e.findLineById(h.lineId) : null;
    if (!_) return;
    const g = h.field, p = h.value;
    if (g === "lineCode")
      _.lineCode = String(p || "").trim() || _.lineCode;
    else if (g === "sex")
      _.sex = p === "F" ? "F" : "M";
    else if (g === "function")
      _.function = p === "DFO" || p === "PAX" || p === "BAG" ? p : "";
    else if (g === "certPool") {
      var C = String(p || "").trim().toUpperCase();
      _.certPool = C === "A" || C === "B" ? C : "";
    } else g === "emp" || g === "position" ? e.applyLineEmp && e.applyLineEmp(_, p) : g === "shift" ? e.applyLineShift && e.applyLineShift(_, p) : g === "team" && e.setLineTeam && e.setLineTeam(h.lineId, p);
    e.updateStatus && e.updateStatus("Updated " + (_.lineCode || h.lineId)), L(), (g === "emp" || g === "position" || g === "shift") && e.renderCoverageBars && e.renderCoverageBars(), g === "team" && e.renderTeams && e.renderTeams();
  }
  function F(h) {
    if (!h) return;
    const _ = e.findLineById ? e.findLineById(h.lineId) : null, g = Number(h.dayIndex);
    if (!_ || !Number.isInteger(g) || g < 0 || g > 6) return;
    const p = String(_.id);
    e.state.schedule || (e.state.schedule = {});
    var C = e.state.schedule[p] || e.state.schedule[_.id];
    for (Array.isArray(C) || (C = []), e.state.schedule[p] = C; e.state.schedule[p].length < 7; ) e.state.schedule[p].push("RDO");
    e.state.functionRotation || (e.state.functionRotation = {}), !e.state.functionRotation[p] && e.state.functionRotation[_.id] && (e.state.functionRotation[p] = e.state.functionRotation[_.id]);
    const B = e.state.schedule[p][g] || "RDO", m = _.function === "BAG", A = l(_);
    if (B !== "WORK")
      e.state.schedule[p][g] = "WORK", m ? i(p, g, "BAG") : A ? i(p, g, "PAX") : i(p, g, null);
    else if (m)
      e.state.schedule[p][g] = "RDO", i(p, g, null);
    else if (A) {
      var O = typeof e.getRotationDuty == "function" ? e.getRotationDuty(_.id, g) : f(_.id, g), T = O === "DFO" || O === "PAX" || !O ? "PAX" : O;
      T === "PAX" ? i(p, g, "BAG") : (e.state.schedule[p][g] = "RDO", i(p, g, null));
    } else
      e.state.schedule[p][g] = "RDO", i(p, g, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(_), L(), e.renderCoverageBars && e.renderCoverageBars();
  }
  const L = () => {
    try {
      const h = n._linesTableApp;
      if (h)
        r(h);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const _ = u();
        typeof e.applyExportCssVars == "function" && e.applyExportCssVars(), n._linesTableApp = new an({
          target: n,
          props: {
            rows: Array.isArray(_) ? _ : [],
            shiftOptions: a(),
            teamOptions: o(),
            exportStyle: d(),
            onInlineEdit: w,
            onDayToggle: F
          }
        });
      }
    } catch (h) {
      console.error("lines-table: refresh failed", h);
    }
  };
  L(), document.addEventListener("click", (h) => {
    const _ = h.target.closest?.(".tab-btn");
    _ && _.dataset.tab === "lines" && L();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((h) => {
    window.addEventListener(h, L);
  }), n.refresh = L;
}
export {
  fn as initLinesTable
};
