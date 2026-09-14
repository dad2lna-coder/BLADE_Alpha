var z = Object.defineProperty;
var J = (e, t, n) => t in e ? z(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var E = (e, t, n) => J(e, typeof t != "symbol" ? t + "" : t, n);
function p() {
}
function q(e) {
  return e();
}
function N() {
  return /* @__PURE__ */ Object.create(null);
}
function A(e) {
  e.forEach(q);
}
function G(e) {
  return typeof e == "function";
}
function Q(e, t) {
  return e != e ? t == t : e !== t || e && typeof e == "object" || typeof e == "function";
}
function X(e) {
  return Object.keys(e).length === 0;
}
function Z(e) {
  return e ?? "";
}
function y(e, t) {
  e.appendChild(t);
}
function v(e, t, n) {
  e.insertBefore(t, n || null);
}
function b(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function x(e, t) {
  for (let n = 0; n < e.length; n += 1)
    e[n] && e[n].d(t);
}
function _(e) {
  return document.createElement(e);
}
function H(e) {
  return document.createTextNode(e);
}
function W() {
  return H(" ");
}
function w(e, t, n) {
  n == null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function K(e) {
  return Array.from(e.childNodes);
}
function ee(e, t) {
  t = "" + t, e.data !== t && (e.data = /** @type {string} */
  t);
}
let M;
function S(e) {
  M = e;
}
const m = [], R = [];
let $ = [];
const j = [], te = /* @__PURE__ */ Promise.resolve();
let O = !1;
function ne() {
  O || (O = !0, te.then(Y));
}
function L(e) {
  $.push(e);
}
const T = /* @__PURE__ */ new Set();
let g = 0;
function Y() {
  if (g !== 0)
    return;
  const e = M;
  do {
    try {
      for (; g < m.length; ) {
        const t = m[g];
        g++, S(t), le(t.$$);
      }
    } catch (t) {
      throw m.length = 0, g = 0, t;
    }
    for (S(null), m.length = 0, g = 0; R.length; ) R.pop()();
    for (let t = 0; t < $.length; t += 1) {
      const n = $[t];
      T.has(n) || (T.add(n), n());
    }
    $.length = 0;
  } while (m.length);
  for (; j.length; )
    j.pop()();
  O = !1, T.clear(), S(e);
}
function le(e) {
  if (e.fragment !== null) {
    e.update(), A(e.before_update);
    const t = e.dirty;
    e.dirty = [-1], e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(L);
  }
}
function re(e) {
  const t = [], n = [];
  $.forEach((l) => e.indexOf(l) === -1 ? t.push(l) : n.push(l)), n.forEach((l) => l()), $ = t;
}
const oe = /* @__PURE__ */ new Set();
function ie(e, t) {
  e && e.i && (oe.delete(e), e.i(t));
}
function k(e) {
  return e?.length !== void 0 ? e : Array.from(e);
}
function ce(e, t, n) {
  const { fragment: l, after_update: o } = e.$$;
  l && l.m(t, n), L(() => {
    const r = e.$$.on_mount.map(q).filter(G);
    e.$$.on_destroy ? e.$$.on_destroy.push(...r) : A(r), e.$$.on_mount = [];
  }), o.forEach(L);
}
function se(e, t) {
  const n = e.$$;
  n.fragment !== null && (re(n.after_update), A(n.on_destroy), n.fragment && n.fragment.d(t), n.on_destroy = n.fragment = null, n.ctx = []);
}
function ue(e, t) {
  e.$$.dirty[0] === -1 && (m.push(e), ne(), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function fe(e, t, n, l, o, r, s = null, f = [-1]) {
  const u = M;
  S(e);
  const c = e.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: r,
    update: p,
    not_equal: o,
    bound: N(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (u ? u.$$.context : [])),
    // everything else
    callbacks: N(),
    dirty: f,
    skip_bound: !1,
    root: t.target || u.$$.root
  };
  s && s(c.root);
  let a = !1;
  if (c.ctx = n ? n(e, t.props || {}, (d, i, ...h) => {
    const C = h.length ? h[0] : i;
    return c.ctx && o(c.ctx[d], c.ctx[d] = C) && (!c.skip_bound && c.bound[d] && c.bound[d](C), a && ue(e, d)), i;
  }) : [], c.update(), a = !0, A(c.before_update), c.fragment = l ? l(c.ctx) : !1, t.target) {
    if (t.hydrate) {
      const d = K(t.target);
      c.fragment && c.fragment.l(d), d.forEach(b);
    } else
      c.fragment && c.fragment.c();
    t.intro && ie(e.$$.fragment), ce(e, t.target, t.anchor), Y();
  }
  S(u);
}
class ae {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    E(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    E(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    se(this, 1), this.$destroy = p;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(t, n) {
    if (!G(n))
      return p;
    const l = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return l.push(n), () => {
      const o = l.indexOf(n);
      o !== -1 && l.splice(o, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(t) {
    this.$$set && !X(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
}
const de = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(de);
function P(e, t, n) {
  const l = e.slice();
  return l[4] = t[n], l;
}
function B(e, t, n) {
  const l = e.slice();
  return l[7] = t[n], l;
}
function D(e, t, n) {
  const l = e.slice();
  return l[7] = t[n], l;
}
function _e(e) {
  let t;
  return {
    c() {
      t = _("p"), t.textContent = "Generate or import to build lines", w(t, "class", "muted");
    },
    m(n, l) {
      v(n, t, l);
    },
    p,
    d(n) {
      n && b(t);
    }
  };
}
function he(e) {
  let t, n, l, o, r, s = k(
    /*COLUMNS*/
    e[2]
  ), f = [];
  for (let a = 0; a < s.length; a += 1)
    f[a] = I(D(e, s, a));
  let u = k(
    /*rows*/
    e[0]
  ), c = [];
  for (let a = 0; a < u.length; a += 1)
    c[a] = U(P(e, u, a));
  return {
    c() {
      t = _("table"), n = _("thead"), l = _("tr");
      for (let a = 0; a < f.length; a += 1)
        f[a].c();
      o = W(), r = _("tbody");
      for (let a = 0; a < c.length; a += 1)
        c[a].c();
      w(t, "class", "data-table lines-table-svelte svelte-u16cro");
    },
    m(a, d) {
      v(a, t, d), y(t, n), y(n, l);
      for (let i = 0; i < f.length; i += 1)
        f[i] && f[i].m(l, null);
      y(t, o), y(t, r);
      for (let i = 0; i < c.length; i += 1)
        c[i] && c[i].m(r, null);
    },
    p(a, d) {
      if (d & /*COLUMNS*/
      4) {
        s = k(
          /*COLUMNS*/
          a[2]
        );
        let i;
        for (i = 0; i < s.length; i += 1) {
          const h = D(a, s, i);
          f[i] ? f[i].p(h, d) : (f[i] = I(h), f[i].c(), f[i].m(l, null));
        }
        for (; i < f.length; i += 1)
          f[i].d(1);
        f.length = s.length;
      }
      if (d & /*rows, COLUMNS, DAY_NAMES, cellValue*/
      15) {
        u = k(
          /*rows*/
          a[0]
        );
        let i;
        for (i = 0; i < u.length; i += 1) {
          const h = P(a, u, i);
          c[i] ? c[i].p(h, d) : (c[i] = U(h), c[i].c(), c[i].m(r, null));
        }
        for (; i < c.length; i += 1)
          c[i].d(1);
        c.length = u.length;
      }
    },
    d(a) {
      a && b(t), x(f, a), x(c, a);
    }
  };
}
function I(e) {
  let t;
  return {
    c() {
      t = _("th"), t.textContent = `${/*col*/
      e[7].label}`;
    },
    m(n, l) {
      v(n, t, l);
    },
    p,
    d(n) {
      n && b(t);
    }
  };
}
function F(e) {
  let t, n = (
    /*cellValue*/
    e[3](
      /*row*/
      e[4],
      /*col*/
      e[7].key
    ) + ""
  ), l;
  return {
    c() {
      t = _("td"), l = H(n), w(t, "class", Z(
        /*DAY_NAMES*/
        e[1].includes(
          /*col*/
          e[7].key
        ) ? "day-cell" : ""
      ) + " svelte-u16cro");
    },
    m(o, r) {
      v(o, t, r), y(t, l);
    },
    p(o, r) {
      r & /*rows*/
      1 && n !== (n = /*cellValue*/
      o[3](
        /*row*/
        o[4],
        /*col*/
        o[7].key
      ) + "") && ee(l, n);
    },
    d(o) {
      o && b(t);
    }
  };
}
function U(e) {
  let t, n, l, o = k(
    /*COLUMNS*/
    e[2]
  ), r = [];
  for (let s = 0; s < o.length; s += 1)
    r[s] = F(B(e, o, s));
  return {
    c() {
      t = _("tr");
      for (let s = 0; s < r.length; s += 1)
        r[s].c();
      n = W(), w(t, "data-line-row", l = /*row*/
      e[4].line ?? /*row*/
      e[4].id);
    },
    m(s, f) {
      v(s, t, f);
      for (let u = 0; u < r.length; u += 1)
        r[u] && r[u].m(t, null);
      y(t, n);
    },
    p(s, f) {
      if (f & /*DAY_NAMES, COLUMNS, cellValue, rows*/
      15) {
        o = k(
          /*COLUMNS*/
          s[2]
        );
        let u;
        for (u = 0; u < o.length; u += 1) {
          const c = B(s, o, u);
          r[u] ? r[u].p(c, f) : (r[u] = F(c), r[u].c(), r[u].m(t, n));
        }
        for (; u < r.length; u += 1)
          r[u].d(1);
        r.length = o.length;
      }
      f & /*rows*/
      1 && l !== (l = /*row*/
      s[4].line ?? /*row*/
      s[4].id) && w(t, "data-line-row", l);
    },
    d(s) {
      s && b(t), x(r, s);
    }
  };
}
function pe(e) {
  let t;
  function n(r, s) {
    return (
      /*rows*/
      r[0] && /*rows*/
      r[0].length ? he : _e
    );
  }
  let l = n(e), o = l(e);
  return {
    c() {
      t = _("div"), o.c(), w(t, "class", "lines-table-root svelte-u16cro");
    },
    m(r, s) {
      v(r, t, s), o.m(t, null);
    },
    p(r, [s]) {
      l === (l = n(r)) && o ? o.p(r, s) : (o.d(1), o = l(r), o && (o.c(), o.m(t, null)));
    },
    i: p,
    o: p,
    d(r) {
      r && b(t), o.d();
    }
  };
}
function V(e) {
  return e == null ? "" : String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function be(e, t, n) {
  let { rows: l = [] } = t;
  const o = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], r = [
    { key: "team", label: "Team" },
    { key: "line", label: "Line" },
    { key: "shift", label: "Shift" },
    { key: "start", label: "Start" },
    { key: "end", label: "End" },
    { key: "position", label: "Position" },
    { key: "emp", label: "Emp" },
    { key: "sex", label: "Sex" },
    { key: "function", label: "Function" },
    { key: "rdos", label: "RDOs" },
    { key: "paid", label: "Paid" },
    ...o.map((f) => ({ key: f, label: f })),
    { key: "hours", label: "Hours" }
  ];
  function s(f, u) {
    if (o.includes(u)) {
      const c = o.indexOf(u);
      return V(f.days?.[c] ?? "RDO");
    }
    return V(f[u] ?? "");
  }
  return e.$$set = (f) => {
    "rows" in f && n(0, l = f.rows);
  }, [l, o, r, s];
}
class ge extends ae {
  constructor(t) {
    super(), fe(this, t, be, pe, Q, { rows: 0 });
  }
}
function ye(e) {
  const t = e || window.Scheduler;
  if (!t) return;
  const n = document.getElementById("lines-table-root");
  if (!n) {
    console.warn("lines-table: #lines-table-root not found");
    return;
  }
  if (n._linesTableMounted) return;
  n._linesTableMounted = !0;
  const l = () => {
    const o = typeof t.getLineRowModels == "function" ? t.getLineRowModels() : [], r = Array.isArray(o) ? o.slice(0, 50) : [];
    n._linesTableApp && (n._linesTableApp.$destroy(), n._linesTableApp = null), n._linesTableApp = new ge({
      target: n,
      props: { rows: r }
    });
  };
  l(), document.addEventListener("click", (o) => {
    const r = o.target.closest?.(".tab-btn");
    r && r.dataset.tab === "lines" && l();
  });
}
export {
  ye as initLinesTable
};
