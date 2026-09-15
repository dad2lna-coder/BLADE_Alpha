var Et = Object.defineProperty;
var Ot = (e, t, n) => t in e ? Et(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ve = (e, t, n) => Ot(e, typeof t != "symbol" ? t + "" : t, n);
import { createVirtualizer as Lt } from "https://esm.sh/@tanstack/svelte-virtual@3.13.39?deps=svelte@4.2.19&target=es2022";
function ae() {
}
function ht(e) {
  return e();
}
function ot() {
  return /* @__PURE__ */ Object.create(null);
}
function ue(e) {
  e.forEach(ht);
}
function vt(e) {
  return typeof e == "function";
}
function kt(e, t) {
  return e != e ? t == t : e !== t || e && typeof e == "object" || typeof e == "function";
}
function It(e) {
  return Object.keys(e).length === 0;
}
function i(e, t) {
  e.appendChild(t);
}
function ce(e, t, n) {
  e.insertBefore(t, n || null);
}
function se(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function pt(e, t) {
  for (let n = 0; n < e.length; n += 1)
    e[n] && e[n].d(t);
}
function a(e) {
  return document.createElement(e);
}
function N(e) {
  return document.createTextNode(e);
}
function C() {
  return N(" ");
}
function R(e, t, n, l) {
  return e.addEventListener(t, n, l), () => e.removeEventListener(t, n, l);
}
function s(e, t, n) {
  n == null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function At(e) {
  return Array.from(e.childNodes);
}
function le(e, t) {
  t = "" + t, e.data !== t && (e.data = /** @type {string} */
  t);
}
function g(e, t) {
  e.value = t ?? "";
}
function w(e, t, n, l) {
  n == null ? e.style.removeProperty(t) : e.style.setProperty(t, n, "");
}
let de;
function re(e) {
  de = e;
}
function Ft() {
  if (!de) throw new Error("Function called outside component initialization");
  return de;
}
function Mt(e) {
  Ft().$$.on_mount.push(e);
}
const ie = [], Ge = [];
let oe = [];
const at = [], Pt = /* @__PURE__ */ Promise.resolve();
let Ue = !1;
function Rt() {
  Ue || (Ue = !0, Pt.then(gt));
}
function Xe(e) {
  oe.push(e);
}
const We = /* @__PURE__ */ new Set();
let ne = 0;
function gt() {
  if (ne !== 0)
    return;
  const e = de;
  do {
    try {
      for (; ne < ie.length; ) {
        const t = ie[ne];
        ne++, re(t), Dt(t.$$);
      }
    } catch (t) {
      throw ie.length = 0, ne = 0, t;
    }
    for (re(null), ie.length = 0, ne = 0; Ge.length; ) Ge.pop()();
    for (let t = 0; t < oe.length; t += 1) {
      const n = oe[t];
      We.has(n) || (We.add(n), n());
    }
    oe.length = 0;
  } while (ie.length);
  for (; at.length; )
    at.pop()();
  Ue = !1, We.clear(), re(e);
}
function Dt(e) {
  if (e.fragment !== null) {
    e.update(), ue(e.before_update);
    const t = e.dirty;
    e.dirty = [-1], e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(Xe);
  }
}
function Nt(e) {
  const t = [], n = [];
  oe.forEach((l) => e.indexOf(l) === -1 ? t.push(l) : n.push(l)), n.forEach((l) => l()), oe = t;
}
const jt = /* @__PURE__ */ new Set();
function zt(e, t) {
  e && e.i && (jt.delete(e), e.i(t));
}
function Me(e) {
  return e?.length !== void 0 ? e : Array.from(e);
}
function Ht(e, t, n) {
  const { fragment: l, after_update: r } = e.$$;
  l && l.m(t, n), Xe(() => {
    const o = e.$$.on_mount.map(ht).filter(vt);
    e.$$.on_destroy ? e.$$.on_destroy.push(...o) : ue(o), e.$$.on_mount = [];
  }), r.forEach(Xe);
}
function Bt(e, t) {
  const n = e.$$;
  n.fragment !== null && (Nt(n.after_update), ue(n.on_destroy), n.fragment && n.fragment.d(t), n.on_destroy = n.fragment = null, n.ctx = []);
}
function Vt(e, t) {
  e.$$.dirty[0] === -1 && (ie.push(e), Rt(), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function Wt(e, t, n, l, r, o, _ = null, m = [-1]) {
  const b = de;
  re(e);
  const d = e.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: o,
    update: ae,
    not_equal: r,
    bound: ot(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (b ? b.$$.context : [])),
    // everything else
    callbacks: ot(),
    dirty: m,
    skip_bound: !1,
    root: t.target || b.$$.root
  };
  _ && _(d.root);
  let v = !1;
  if (d.ctx = n ? n(e, t.props || {}, (u, h, ...$) => {
    const D = $.length ? $[0] : h;
    return d.ctx && r(d.ctx[u], d.ctx[u] = D) && (!d.skip_bound && d.bound[u] && d.bound[u](D), v && Vt(e, u)), h;
  }) : [], d.update(), v = !0, ue(d.before_update), d.fragment = l ? l(d.ctx) : !1, t.target) {
    if (t.hydrate) {
      const u = At(t.target);
      d.fragment && d.fragment.l(u), u.forEach(se);
    } else
      d.fragment && d.fragment.c();
    t.intro && zt(e.$$.fragment), Ht(e, t.target, t.anchor), gt();
  }
  re(b);
}
class Gt {
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
    Bt(this, 1), this.$destroy = ae;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(t, n) {
    if (!vt(n))
      return ae;
    const l = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return l.push(n), () => {
      const r = l.indexOf(n);
      r !== -1 && l.splice(r, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(t) {
    this.$$set && !It(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
}
const Ut = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Ut);
function st(e, t, n) {
  const l = e.slice();
  l[16] = t[n];
  const r = (
    /*rows*/
    l[0][
      /*virtualRow*/
      l[16].index
    ]
  );
  return l[17] = r, l;
}
function rt(e, t, n) {
  const l = e.slice();
  return l[20] = t[n], l;
}
function Xt(e) {
  let t;
  return {
    c() {
      t = a("div"), t.textContent = "Classic Lines mode active", s(t, "class", "muted");
    },
    m(n, l) {
      ce(n, t, l);
    },
    p: ae,
    d(n) {
      n && se(t);
    }
  };
}
function qt(e) {
  let t, n, l, r, o, _, m, b = Me(
    /*virtualizer*/
    e[3]?.getVirtualItems() ?? []
  ), d = [];
  for (let v = 0; v < b.length; v += 1)
    d[v] = ut(st(e, b, v));
  return {
    c() {
      t = a("div"), n = a("table"), l = a("thead"), l.innerHTML = '<tr><th class="svelte-1ord1h3">Team</th> <th class="svelte-1ord1h3">Line</th> <th class="svelte-1ord1h3">Shift</th> <th class="svelte-1ord1h3">Start</th> <th class="svelte-1ord1h3">End</th> <th class="svelte-1ord1h3">Position</th> <th class="svelte-1ord1h3">Emp</th> <th class="svelte-1ord1h3">Sex</th> <th class="svelte-1ord1h3">Function</th> <th class="svelte-1ord1h3">RDOs</th> <th class="svelte-1ord1h3">Paid</th> <th class="svelte-1ord1h3">Sun</th> <th class="svelte-1ord1h3">Mon</th> <th class="svelte-1ord1h3">Tue</th> <th class="svelte-1ord1h3">Wed</th> <th class="svelte-1ord1h3">Thu</th> <th class="svelte-1ord1h3">Fri</th> <th class="svelte-1ord1h3">Sat</th> <th class="svelte-1ord1h3">Hours</th></tr>', r = C(), o = a("tbody");
      for (let v = 0; v < d.length; v += 1)
        d[v].c();
      _ = C(), m = a("div"), w(o, "position", "relative"), w(o, "height", "0"), w(
        m,
        "height",
        /*virtualizer*/
        (e[3]?.getTotalSize() ?? 0) + "px"
      ), s(n, "class", "data-table lines-editable svelte-1ord1h3"), w(n, "width", "max-content"), w(n, "min-width", "1100px"), s(t, "class", "lines-virtual-root svelte-1ord1h3"), w(t, "height", "100%"), w(t, "overflow", "auto"), w(t, "position", "relative");
    },
    m(v, u) {
      ce(v, t, u), i(t, n), i(n, l), i(n, r), i(n, o);
      for (let h = 0; h < d.length; h += 1)
        d[h] && d[h].m(o, null);
      i(n, _), i(n, m), e[14](t);
    },
    p(v, u) {
      if (u & /*virtualizer, rows, getFunctionClass, handleDayToggle, getRdoText, handleInlineEdit, getShiftLabel*/
      9) {
        b = Me(
          /*virtualizer*/
          v[3]?.getVirtualItems() ?? []
        );
        let h;
        for (h = 0; h < b.length; h += 1) {
          const $ = st(v, b, h);
          d[h] ? d[h].p($, u) : (d[h] = ut($), d[h].c(), d[h].m(o, null));
        }
        for (; h < d.length; h += 1)
          d[h].d(1);
        d.length = b.length;
      }
      u & /*virtualizer*/
      8 && w(
        m,
        "height",
        /*virtualizer*/
        (v[3]?.getTotalSize() ?? 0) + "px"
      );
    },
    d(v) {
      v && se(t), pt(d, v), e[14](null);
    }
  };
}
function dt(e) {
  let t, n = (
    /*row*/
    (e[17]?.days?.find(b)?.label || "RDO") + ""
  ), l, r, o, _, m;
  function b(...u) {
    return (
      /*func*/
      e[11](
        /*day*/
        e[20],
        ...u
      )
    );
  }
  function d(...u) {
    return (
      /*func_1*/
      e[12](
        /*day*/
        e[20],
        ...u
      )
    );
  }
  function v() {
    return (
      /*click_handler*/
      e[13](
        /*row*/
        e[17],
        /*day*/
        e[20]
      )
    );
  }
  return {
    c() {
      t = a("td"), l = N(n), s(t, "class", r = "cell-toggle " + _t(
        /*row*/
        e[17]?.days?.find(d)?.duty
      ) + " svelte-1ord1h3"), s(t, "data-line-id", o = /*row*/
      e[17]?.id), s(
        t,
        "data-day",
        /*day*/
        e[20]
      );
    },
    m(u, h) {
      ce(u, t, h), i(t, l), _ || (m = R(t, "click", v), _ = !0);
    },
    p(u, h) {
      e = u, h & /*rows, virtualizer*/
      9 && n !== (n = /*row*/
      (e[17]?.days?.find(b)?.label || "RDO") + "") && le(l, n), h & /*rows, virtualizer*/
      9 && r !== (r = "cell-toggle " + _t(
        /*row*/
        e[17]?.days?.find(d)?.duty
      ) + " svelte-1ord1h3") && s(t, "class", r), h & /*rows, virtualizer*/
      9 && o !== (o = /*row*/
      e[17]?.id) && s(t, "data-line-id", o);
    },
    d(u) {
      u && se(t), _ = !1, m();
    }
  };
}
function ut(e) {
  let t, n, l, r, o, _, m, b, d, v, u, h, $, D, j, T, F, M, f, c, O, z, fe, qe, _e, he = Fe(
    /*row*/
    e[17]?.shiftId,
    /*rows*/
    e[0].shiftOptions
  ) + "", Pe, Ke, ve, pe = Fe(
    /*row*/
    e[17]?.shiftId,
    /*rows*/
    e[0].shiftOptions
  ) + "", Re, Je, ge, L, H, B, V, W, me, Qe, be, E, G, U, X, q, K, Se, Ye, ye, A, J, Q, Y, we, Ze, Te, k, Z, x, ee, te, Ce, xe, $e, Ee = ft(
    /*row*/
    e[17]?.rdoDays,
    /*row*/
    e[17]?.rdoHard
  ) + "", De, et, Oe, Le = (
    /*row*/
    e[17]?.paid + ""
  ), Ne, tt, je, ke, Ie = (
    /*row*/
    e[17]?.hours + ""
  ), ze, nt, Ae, He, lt;
  function bt(...p) {
    return (
      /*change_handler*/
      e[4](
        /*row*/
        e[17],
        ...p
      )
    );
  }
  function St(...p) {
    return (
      /*input_handler*/
      e[5](
        /*row*/
        e[17],
        ...p
      )
    );
  }
  function yt(...p) {
    return (
      /*change_handler_1*/
      e[6](
        /*row*/
        e[17],
        ...p
      )
    );
  }
  function wt(...p) {
    return (
      /*change_handler_2*/
      e[7](
        /*row*/
        e[17],
        ...p
      )
    );
  }
  function Tt(...p) {
    return (
      /*change_handler_3*/
      e[8](
        /*row*/
        e[17],
        ...p
      )
    );
  }
  function Ct(...p) {
    return (
      /*change_handler_4*/
      e[9](
        /*row*/
        e[17],
        ...p
      )
    );
  }
  function $t(...p) {
    return (
      /*change_handler_5*/
      e[10](
        /*row*/
        e[17],
        ...p
      )
    );
  }
  let Be = Me(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]), I = [];
  for (let p = 0; p < 7; p += 1)
    I[p] = dt(rt(e, Be, p));
  return {
    c() {
      t = a("tr"), n = a("td"), l = a("select"), r = a("option"), r.textContent = "—", o = a("option"), o.textContent = "T1", _ = a("option"), _.textContent = "T2", m = a("option"), m.textContent = "T3", d = C(), v = a("td"), u = a("input"), D = C(), j = a("td"), T = a("select"), F = a("option"), F.textContent = "—", M = a("option"), M.textContent = "S1 (03:30–12:00)", f = a("option"), f.textContent = "S2 (04:00–12:30)", c = a("option"), c.textContent = "S3 (12:00–20:30)", O = a("option"), O.textContent = "S4 (14:30–23:00)", z = a("option"), z.textContent = "S5 (10:30–20:00)", qe = C(), _e = a("td"), Pe = N(he), Ke = C(), ve = a("td"), Re = N(pe), Je = C(), ge = a("td"), L = a("select"), H = a("option"), H.textContent = "—", B = a("option"), B.textContent = "TSO", V = a("option"), V.textContent = "LTSO", W = a("option"), W.textContent = "STSO", Qe = C(), be = a("td"), E = a("select"), G = a("option"), G.textContent = "—", U = a("option"), U.textContent = "FT", X = a("option"), X.textContent = "PT", q = a("option"), q.textContent = "LTSO", K = a("option"), K.textContent = "STSO", Ye = C(), ye = a("td"), A = a("select"), J = a("option"), J.textContent = "—", Q = a("option"), Q.textContent = "M", Y = a("option"), Y.textContent = "F", Ze = C(), Te = a("td"), k = a("select"), Z = a("option"), Z.textContent = "—", x = a("option"), x.textContent = "DFO", ee = a("option"), ee.textContent = "BAG", te = a("option"), te.textContent = "PAX", xe = C(), $e = a("td"), De = N(Ee), et = C(), Oe = a("td"), Ne = N(Le), tt = C();
      for (let p = 0; p < 7; p += 1)
        I[p].c();
      je = C(), ke = a("td"), ze = N(Ie), nt = C(), r.__value = "", g(r, r.__value), o.__value = "T1", g(o, o.__value), _.__value = "T2", g(_, _.__value), m.__value = "T3", g(m, m.__value), s(l, "class", "line-edit svelte-1ord1h3"), s(l, "data-field", "team"), s(l, "data-line-id", b = /*row*/
      e[17]?.id), s(n, "class", "svelte-1ord1h3"), s(u, "type", "text"), s(u, "class", "line-edit line-code-input svelte-1ord1h3"), s(u, "data-field", "lineCode"), s(u, "data-line-id", h = /*row*/
      e[17]?.id), u.value = $ = /*row*/
      e[17]?.lineCode, s(v, "class", "svelte-1ord1h3"), F.__value = "", g(F, F.__value), M.__value = "S1", g(M, M.__value), f.__value = "S2", g(f, f.__value), c.__value = "S3", g(c, c.__value), O.__value = "S4", g(O, O.__value), z.__value = "S5", g(z, z.__value), s(T, "class", "line-edit svelte-1ord1h3"), s(T, "data-field", "shift"), s(T, "data-line-id", fe = /*row*/
      e[17]?.id), s(j, "class", "svelte-1ord1h3"), s(_e, "class", "svelte-1ord1h3"), s(ve, "class", "svelte-1ord1h3"), H.__value = "", g(H, H.__value), B.__value = "TSO", g(B, B.__value), V.__value = "LTSO", g(V, V.__value), W.__value = "STSO", g(W, W.__value), s(L, "class", "line-edit svelte-1ord1h3"), s(L, "data-field", "position"), s(L, "data-line-id", me = /*row*/
      e[17]?.id), s(ge, "class", "svelte-1ord1h3"), G.__value = "", g(G, G.__value), U.__value = "FT", g(U, U.__value), X.__value = "PT", g(X, X.__value), q.__value = "LTSO", g(q, q.__value), K.__value = "STSO", g(K, K.__value), s(E, "class", "line-edit svelte-1ord1h3"), s(E, "data-field", "emp"), s(E, "data-line-id", Se = /*row*/
      e[17]?.id), s(be, "class", "svelte-1ord1h3"), J.__value = "", g(J, J.__value), Q.__value = "M", g(Q, Q.__value), Y.__value = "F", g(Y, Y.__value), s(A, "class", "line-edit svelte-1ord1h3"), s(A, "data-field", "sex"), s(A, "data-line-id", we = /*row*/
      e[17]?.id), s(ye, "class", "svelte-1ord1h3"), Z.__value = "", g(Z, Z.__value), x.__value = "DFO", g(x, x.__value), ee.__value = "BAG", g(ee, ee.__value), te.__value = "PAX", g(te, te.__value), s(k, "class", "line-edit svelte-1ord1h3"), s(k, "data-field", "function"), s(k, "data-line-id", Ce = /*row*/
      e[17]?.id), s(Te, "class", "svelte-1ord1h3"), s($e, "class", "line-rdo-cell svelte-1ord1h3"), s(Oe, "class", "svelte-1ord1h3"), s(ke, "class", "line-hours svelte-1ord1h3"), w(t, "position", "absolute"), w(
        t,
        "top",
        /*virtualRow*/
        e[16].start + "px"
      ), w(t, "left", "0"), w(t, "width", "100%"), w(
        t,
        "height",
        /*virtualRow*/
        e[16].size + "px"
      ), s(t, "data-line-row", Ae = /*row*/
      e[17]?.id);
    },
    m(p, S) {
      ce(p, t, S), i(t, n), i(n, l), i(l, r), i(l, o), i(l, _), i(l, m), i(t, d), i(t, v), i(v, u), i(t, D), i(t, j), i(j, T), i(T, F), i(T, M), i(T, f), i(T, c), i(T, O), i(T, z), i(t, qe), i(t, _e), i(_e, Pe), i(t, Ke), i(t, ve), i(ve, Re), i(t, Je), i(t, ge), i(ge, L), i(L, H), i(L, B), i(L, V), i(L, W), i(t, Qe), i(t, be), i(be, E), i(E, G), i(E, U), i(E, X), i(E, q), i(E, K), i(t, Ye), i(t, ye), i(ye, A), i(A, J), i(A, Q), i(A, Y), i(t, Ze), i(t, Te), i(Te, k), i(k, Z), i(k, x), i(k, ee), i(k, te), i(t, xe), i(t, $e), i($e, De), i(t, et), i(t, Oe), i(Oe, Ne), i(t, tt);
      for (let y = 0; y < 7; y += 1)
        I[y] && I[y].m(t, null);
      i(t, je), i(t, ke), i(ke, ze), i(t, nt), He || (lt = [
        R(l, "change", bt),
        R(u, "input", St),
        R(T, "change", yt),
        R(L, "change", wt),
        R(E, "change", Tt),
        R(A, "change", Ct),
        R(k, "change", $t)
      ], He = !0);
    },
    p(p, S) {
      if (e = p, S & /*rows, virtualizer*/
      9 && b !== (b = /*row*/
      e[17]?.id) && s(l, "data-line-id", b), S & /*rows, virtualizer*/
      9 && h !== (h = /*row*/
      e[17]?.id) && s(u, "data-line-id", h), S & /*rows, virtualizer*/
      9 && $ !== ($ = /*row*/
      e[17]?.lineCode) && u.value !== $ && (u.value = $), S & /*rows, virtualizer*/
      9 && fe !== (fe = /*row*/
      e[17]?.id) && s(T, "data-line-id", fe), S & /*rows, virtualizer*/
      9 && he !== (he = Fe(
        /*row*/
        e[17]?.shiftId,
        /*rows*/
        e[0].shiftOptions
      ) + "") && le(Pe, he), S & /*rows, virtualizer*/
      9 && pe !== (pe = Fe(
        /*row*/
        e[17]?.shiftId,
        /*rows*/
        e[0].shiftOptions
      ) + "") && le(Re, pe), S & /*rows, virtualizer*/
      9 && me !== (me = /*row*/
      e[17]?.id) && s(L, "data-line-id", me), S & /*rows, virtualizer*/
      9 && Se !== (Se = /*row*/
      e[17]?.id) && s(E, "data-line-id", Se), S & /*rows, virtualizer*/
      9 && we !== (we = /*row*/
      e[17]?.id) && s(A, "data-line-id", we), S & /*rows, virtualizer*/
      9 && Ce !== (Ce = /*row*/
      e[17]?.id) && s(k, "data-line-id", Ce), S & /*rows, virtualizer*/
      9 && Ee !== (Ee = ft(
        /*row*/
        e[17]?.rdoDays,
        /*row*/
        e[17]?.rdoHard
      ) + "") && le(De, Ee), S & /*rows, virtualizer*/
      9 && Le !== (Le = /*row*/
      e[17]?.paid + "") && le(Ne, Le), S & /*getFunctionClass, rows, virtualizer, handleDayToggle*/
      9) {
        Be = Me(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
        let y;
        for (y = 0; y < 7; y += 1) {
          const it = rt(e, Be, y);
          I[y] ? I[y].p(it, S) : (I[y] = dt(it), I[y].c(), I[y].m(t, je));
        }
        for (; y < 7; y += 1)
          I[y].d(1);
      }
      S & /*rows, virtualizer*/
      9 && Ie !== (Ie = /*row*/
      e[17]?.hours + "") && le(ze, Ie), S & /*virtualizer*/
      8 && w(
        t,
        "top",
        /*virtualRow*/
        e[16].start + "px"
      ), S & /*virtualizer*/
      8 && w(
        t,
        "height",
        /*virtualRow*/
        e[16].size + "px"
      ), S & /*rows, virtualizer*/
      9 && Ae !== (Ae = /*row*/
      e[17]?.id) && s(t, "data-line-row", Ae);
    },
    d(p) {
      p && se(t), pt(I, p), He = !1, ue(lt);
    }
  };
}
function Kt(e) {
  let t;
  function n(o, _) {
    return (
      /*mode*/
      o[1] === "svelte" ? qt : Xt
    );
  }
  let l = n(e), r = l(e);
  return {
    c() {
      t = a("div"), r.c(), s(t, "class", "lines-table-root svelte-1ord1h3");
    },
    m(o, _) {
      ce(o, t, _), r.m(t, null);
    },
    p(o, [_]) {
      l === (l = n(o)) && r ? r.p(o, _) : (r.d(1), r = l(o), r && (r.c(), r.m(t, null)));
    },
    i: ae,
    o: ae,
    d(o) {
      o && se(t), r.d();
    }
  };
}
let Jt = 42;
function mt(e, t) {
  const n = new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 });
  window.dispatchEvent(n);
}
function P(e) {
  mt("lines:inline-edit-response", e);
}
function ct(e) {
  mt("lines:day-toggle-response", e);
}
function ft(e, t) {
  const n = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], l = (e || []).map(Number).filter((o) => Number.isInteger(o) && o >= 0 && o <= 6), r = l.length ? l.map((o) => n[o] || o).join(",") : "—";
  return t ? r + " (hard)" : r;
}
function Fe(e, t) {
  const n = t?.find((l) => l.id === e);
  return n && n.start && n.end ? n.start + "–" + n.end : n && n.start ? n.start : "";
}
function _t(e) {
  return e === "BAG" ? "cell-function-duty cell-bag" : e === "DFO" ? "cell-function-duty cell-dfo" : e === "PAX" ? "cell-function-duty cell-pax" : "";
}
function Qt(e, t, n) {
  let { rows: l = [] } = t, { mode: r = "svelte" } = t, o, _;
  Mt(() => {
    if (r !== "svelte") return;
    n(3, _ = Lt({
      count: l.length,
      getScrollElement: () => o,
      estimateSize: () => Jt,
      overscan: 5,
      getItemKey: (c) => l[c]?.id ?? c,
      onChange: (c, O) => {
      }
      // Optional: handle scroll position changes
    }));
    const f = {
      "lines:inline-edit": (c) => P(c.detail),
      "lines:day-toggle": (c) => ct(c.detail),
      "lines:filter-change": () => m(),
      "lines:sort-change": () => m(),
      "lines:coverage-refresh": () => m(),
      "lines:request-render": () => m()
    };
    return Object.entries(f).forEach(([c, O]) => {
      window.addEventListener(c, O);
    }), () => {
      Object.entries(f).forEach(([c, O]) => {
        window.removeEventListener(c, O);
      });
    };
  });
  function m() {
    r === "svelte" && _?.setOptions({ count: l.length });
  }
  const b = (f, c) => P({
    lineId: f?.id,
    field: "team",
    value: c.target.value
  }), d = (f, c) => P({
    lineId: f?.id,
    field: "lineCode",
    value: c.target.value
  }), v = (f, c) => P({
    lineId: f?.id,
    field: "shift",
    value: c.target.value
  }), u = (f, c) => P({
    lineId: f?.id,
    field: "position",
    value: c.target.value
  }), h = (f, c) => P({
    lineId: f?.id,
    field: "emp",
    value: c.target.value
  }), $ = (f, c) => P({
    lineId: f?.id,
    field: "sex",
    value: c.target.value
  }), D = (f, c) => P({
    lineId: f?.id,
    field: "function",
    value: c.target.value
  }), j = (f, c) => c.dayIndex === f, T = (f, c) => c.dayIndex === f, F = (f, c) => ct({ lineId: f?.id, day: c, next: "RDO" });
  function M(f) {
    Ge[f ? "unshift" : "push"](() => {
      o = f, n(2, o);
    });
  }
  return e.$$set = (f) => {
    "rows" in f && n(0, l = f.rows), "mode" in f && n(1, r = f.mode);
  }, [
    l,
    r,
    o,
    _,
    b,
    d,
    v,
    u,
    h,
    $,
    D,
    j,
    T,
    F,
    M
  ];
}
class Yt extends Gt {
  constructor(t) {
    super(), Wt(this, t, Qt, Kt, kt, { rows: 0, mode: 1 });
  }
}
function en(e) {
  const t = e || window.Scheduler;
  if (!t) return;
  const n = document.getElementById("lines-table-root");
  if (!n) {
    console.warn("lines-table: #lines-table-root not found");
    return;
  }
  if (t.__USE_SVELTE_LINES === !1 || !t.__USE_SVELTE_LINES) {
    n.innerHTML = "", n.style.display = "none", t.renderLines && t.renderLines();
    return;
  }
  if (n._linesTableMounted) return;
  n._linesTableMounted = !0;
  const l = () => {
    try {
      const o = typeof t.getLineRowModels == "function" ? t.getLineRowModels() : [], _ = n._linesTableApp;
      _ ? (_.rows = Array.isArray(o) ? o : [], _.$$ && _.$$[Symbol.for("$bond")] && _.$$[Symbol.for("$bond")]()) : n._linesTableApp = new Yt({
        target: n,
        props: { rows: Array.isArray(o) ? o : [] }
      });
    } catch (o) {
      console.error("lines-table: refresh failed", o), t.renderLines && t.renderLines();
    }
  };
  l(), document.addEventListener("click", (o) => {
    const _ = o.target.closest?.(".tab-btn");
    _ && _.dataset.tab === "lines" && l();
  }), Object.entries({
    "lines:request-render": l,
    "lines:filter-change": l,
    "lines:sort-change": l,
    "lines:coverage-refresh": l
  }).forEach(([o, _]) => {
    n.addEventListener(o, _);
  }), n.refresh = l, n.setRows = (o) => {
    n._linesTableApp.rows = o, n._linesTableApp.$$ && n._linesTableApp.$$[Symbol.for("$bond")] && n._linesTableApp.$$[Symbol.for("$bond")]();
  };
}
export {
  en as initLinesTable
};
