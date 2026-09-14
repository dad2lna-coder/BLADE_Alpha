var ee = Object.defineProperty;
var te = (e, t, n) => t in e ? ee(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var x = (e, t, n) => te(e, typeof t != "symbol" ? t + "" : t, n);
function p() {
}
function V(e) {
  return e();
}
function N() {
  return /* @__PURE__ */ Object.create(null);
}
function E(e) {
  e.forEach(V);
}
function W(e) {
  return typeof e == "function";
}
function ne(e, t) {
  return e != e ? t == t : e !== t || e && typeof e == "object" || typeof e == "function";
}
function le(e) {
  return Object.keys(e).length === 0;
}
function oe(e) {
  return e ?? "";
}
function y(e, t) {
  e.appendChild(t);
}
function S(e, t, n) {
  e.insertBefore(t, n || null);
}
function b(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function O(e, t) {
  for (let n = 0; n < e.length; n += 1)
    e[n] && e[n].d(t);
}
function _(e) {
  return document.createElement(e);
}
function q(e) {
  return document.createTextNode(e);
}
function G() {
  return q(" ");
}
function v(e, t, n) {
  n == null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function ie(e) {
  return Array.from(e.childNodes);
}
function re(e, t) {
  t = "" + t, e.data !== t && (e.data = /** @type {string} */
  t);
}
let C;
function w(e) {
  C = e;
}
const m = [], j = [];
let k = [];
const R = [], ce = /* @__PURE__ */ Promise.resolve();
let L = !1;
function se() {
  L || (L = !0, ce.then(Y));
}
function M(e) {
  k.push(e);
}
const A = /* @__PURE__ */ new Set();
let g = 0;
function Y() {
  if (g !== 0)
    return;
  const e = C;
  do {
    try {
      for (; g < m.length; ) {
        const t = m[g];
        g++, w(t), ae(t.$$);
      }
    } catch (t) {
      throw m.length = 0, g = 0, t;
    }
    for (w(null), m.length = 0, g = 0; j.length; ) j.pop()();
    for (let t = 0; t < k.length; t += 1) {
      const n = k[t];
      A.has(n) || (A.add(n), n());
    }
    k.length = 0;
  } while (m.length);
  for (; R.length; )
    R.pop()();
  L = !1, A.clear(), w(e);
}
function ae(e) {
  if (e.fragment !== null) {
    e.update(), E(e.before_update);
    const t = e.dirty;
    e.dirty = [-1], e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(M);
  }
}
function ue(e) {
  const t = [], n = [];
  k.forEach((l) => e.indexOf(l) === -1 ? t.push(l) : n.push(l)), n.forEach((l) => l()), k = t;
}
const fe = /* @__PURE__ */ new Set();
function de(e, t) {
  e && e.i && (fe.delete(e), e.i(t));
}
function $(e) {
  return e?.length !== void 0 ? e : Array.from(e);
}
function he(e, t, n) {
  const { fragment: l, after_update: r } = e.$$;
  l && l.m(t, n), M(() => {
    const i = e.$$.on_mount.map(V).filter(W);
    e.$$.on_destroy ? e.$$.on_destroy.push(...i) : E(i), e.$$.on_mount = [];
  }), r.forEach(M);
}
function _e(e, t) {
  const n = e.$$;
  n.fragment !== null && (ue(n.after_update), E(n.on_destroy), n.fragment && n.fragment.d(t), n.on_destroy = n.fragment = null, n.ctx = []);
}
function pe(e, t) {
  e.$$.dirty[0] === -1 && (m.push(e), se(), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function be(e, t, n, l, r, i, a = null, o = [-1]) {
  const u = C;
  w(e);
  const s = e.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: i,
    update: p,
    not_equal: r,
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
    dirty: o,
    skip_bound: !1,
    root: t.target || u.$$.root
  };
  a && a(s.root);
  let f = !1;
  if (s.ctx = n ? n(e, t.props || {}, (d, c, ...h) => {
    const T = h.length ? h[0] : c;
    return s.ctx && r(s.ctx[d], s.ctx[d] = T) && (!s.skip_bound && s.bound[d] && s.bound[d](T), f && pe(e, d)), c;
  }) : [], s.update(), f = !0, E(s.before_update), s.fragment = l ? l(s.ctx) : !1, t.target) {
    if (t.hydrate) {
      const d = ie(t.target);
      s.fragment && s.fragment.l(d), d.forEach(b);
    } else
      s.fragment && s.fragment.c();
    t.intro && de(e.$$.fragment), he(e, t.target, t.anchor), Y();
  }
  w(u);
}
class ge {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    x(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    x(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    _e(this, 1), this.$destroy = p;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(t, n) {
    if (!W(n))
      return p;
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
    this.$$set && !le(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
}
const me = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(me);
function P(e, t, n) {
  const l = e.slice();
  return l[4] = t[n], l;
}
function D(e, t, n) {
  const l = e.slice();
  return l[7] = t[n], l;
}
function F(e, t, n) {
  const l = e.slice();
  return l[7] = t[n], l;
}
function ye(e) {
  let t;
  return {
    c() {
      t = _("p"), t.textContent = "Generate or import to build lines", v(t, "class", "muted");
    },
    m(n, l) {
      S(n, t, l);
    },
    p,
    d(n) {
      n && b(t);
    }
  };
}
function $e(e) {
  let t, n, l, r, i, a = $(
    /*COLUMNS*/
    e[2]
  ), o = [];
  for (let f = 0; f < a.length; f += 1)
    o[f] = B(F(e, a, f));
  let u = $(
    /*rows*/
    e[0]
  ), s = [];
  for (let f = 0; f < u.length; f += 1)
    s[f] = I(P(e, u, f));
  return {
    c() {
      t = _("table"), n = _("thead"), l = _("tr");
      for (let f = 0; f < o.length; f += 1)
        o[f].c();
      r = G(), i = _("tbody");
      for (let f = 0; f < s.length; f += 1)
        s[f].c();
      v(t, "class", "data-table lines-table-svelte svelte-u16cro");
    },
    m(f, d) {
      S(f, t, d), y(t, n), y(n, l);
      for (let c = 0; c < o.length; c += 1)
        o[c] && o[c].m(l, null);
      y(t, r), y(t, i);
      for (let c = 0; c < s.length; c += 1)
        s[c] && s[c].m(i, null);
    },
    p(f, d) {
      if (d & /*COLUMNS*/
      4) {
        a = $(
          /*COLUMNS*/
          f[2]
        );
        let c;
        for (c = 0; c < a.length; c += 1) {
          const h = F(f, a, c);
          o[c] ? o[c].p(h, d) : (o[c] = B(h), o[c].c(), o[c].m(l, null));
        }
        for (; c < o.length; c += 1)
          o[c].d(1);
        o.length = a.length;
      }
      if (d & /*rows, COLUMNS, DAY_NAMES, cellValue*/
      15) {
        u = $(
          /*rows*/
          f[0]
        );
        let c;
        for (c = 0; c < u.length; c += 1) {
          const h = P(f, u, c);
          s[c] ? s[c].p(h, d) : (s[c] = I(h), s[c].c(), s[c].m(i, null));
        }
        for (; c < s.length; c += 1)
          s[c].d(1);
        s.length = u.length;
      }
    },
    d(f) {
      f && b(t), O(o, f), O(s, f);
    }
  };
}
function B(e) {
  let t;
  return {
    c() {
      t = _("th"), t.textContent = `${/*col*/
      e[7].label}`;
    },
    m(n, l) {
      S(n, t, l);
    },
    p,
    d(n) {
      n && b(t);
    }
  };
}
function H(e) {
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
      t = _("td"), l = q(n), v(t, "class", oe(
        /*DAY_NAMES*/
        e[1].includes(
          /*col*/
          e[7].key
        ) ? "day-cell" : ""
      ) + " svelte-u16cro");
    },
    m(r, i) {
      S(r, t, i), y(t, l);
    },
    p(r, i) {
      i & /*rows*/
      1 && n !== (n = /*cellValue*/
      r[3](
        /*row*/
        r[4],
        /*col*/
        r[7].key
      ) + "") && re(l, n);
    },
    d(r) {
      r && b(t);
    }
  };
}
function I(e) {
  let t, n, l, r = $(
    /*COLUMNS*/
    e[2]
  ), i = [];
  for (let a = 0; a < r.length; a += 1)
    i[a] = H(D(e, r, a));
  return {
    c() {
      t = _("tr");
      for (let a = 0; a < i.length; a += 1)
        i[a].c();
      n = G(), v(t, "data-line-row", l = /*row*/
      e[4].line ?? /*row*/
      e[4].id);
    },
    m(a, o) {
      S(a, t, o);
      for (let u = 0; u < i.length; u += 1)
        i[u] && i[u].m(t, null);
      y(t, n);
    },
    p(a, o) {
      if (o & /*DAY_NAMES, COLUMNS, cellValue, rows*/
      15) {
        r = $(
          /*COLUMNS*/
          a[2]
        );
        let u;
        for (u = 0; u < r.length; u += 1) {
          const s = D(a, r, u);
          i[u] ? i[u].p(s, o) : (i[u] = H(s), i[u].c(), i[u].m(t, n));
        }
        for (; u < i.length; u += 1)
          i[u].d(1);
        i.length = r.length;
      }
      o & /*rows*/
      1 && l !== (l = /*row*/
      a[4].line ?? /*row*/
      a[4].id) && v(t, "data-line-row", l);
    },
    d(a) {
      a && b(t), O(i, a);
    }
  };
}
function ke(e) {
  let t;
  function n(i, a) {
    return (
      /*rows*/
      i[0] && /*rows*/
      i[0].length ? $e : ye
    );
  }
  let l = n(e), r = l(e);
  return {
    c() {
      t = _("div"), r.c(), v(t, "class", "lines-table-root svelte-u16cro");
    },
    m(i, a) {
      S(i, t, a), r.m(t, null);
    },
    p(i, [a]) {
      l === (l = n(i)) && r ? r.p(i, a) : (r.d(1), r = l(i), r && (r.c(), r.m(t, null)));
    },
    i: p,
    o: p,
    d(i) {
      i && b(t), r.d();
    }
  };
}
function U(e) {
  return e == null ? "" : String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function ve(e, t, n) {
  let { rows: l = [] } = t;
  const r = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], i = [
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
    ...r.map((o) => ({ key: o, label: o })),
    { key: "hours", label: "Hours" }
  ];
  function a(o, u) {
    if (r.includes(u)) {
      const s = r.indexOf(u);
      return U(o.days?.[s] ?? "RDO");
    }
    return U(o[u] ?? "");
  }
  return e.$$set = (o) => {
    "rows" in o && n(0, l = o.rows);
  }, [l, r, i, a];
}
class Se extends ge {
  constructor(t) {
    super(), be(this, t, ve, ke, ne, { rows: 0 });
  }
}
function Te(e) {
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
    const r = typeof t.getLineRowModels == "function" ? t.getLineRowModels() : [], i = Array.isArray(r) ? r.slice(0, 50) : [];
    n._linesTableApp && (n._linesTableApp.$destroy(), n._linesTableApp = null);
    try {
      n._linesTableApp = new Se({
        target: n,
        props: { rows: i }
      });
    } catch (a) {
      console.error("lines-table: mount failed", a), n.innerHTML = `
        <table class="data-table lines-table-svelte">
          <thead>
            <tr>
              <th>Team</th><th>Line</th><th>Shift</th><th>Start</th><th>End</th>
              <th>Position</th><th>Emp</th><th>Sex</th><th>Function</th><th>RDOs</th><th>Paid</th>
              ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((o) => `<th>${o}</th>`).join("")}
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            ${i.map((o) => {
        const u = o.team || "", s = o.lineCode || "", f = o.shiftName || "", d = o.start || "", c = o.end || "", h = o.position || "", T = o.emp || "", z = o.sex || "", J = o.function || "", Q = o.paid || 0, X = o.days || new Array(7).fill("RDO");
        o.hours;
        const Z = [
          u,
          s,
          f,
          d,
          c,
          h,
          T,
          z,
          J,
          o.rdos || "—",
          Q,
          ...X.map((K) => `<td>${K}</td>`)
        ].join("");
        return `<tr data-line-row="${o.line || o.id}"><td>${Z}</td></tr>`;
      }).join("")}
          </tbody>
        </table>
      `;
    }
  };
  l(), document.addEventListener("click", (r) => {
    const i = r.target.closest?.(".tab-btn");
    i && i.dataset.tab === "lines" && l();
  });
}
export {
  Te as initLinesTable
};
