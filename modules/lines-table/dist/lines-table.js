var Zl = Object.defineProperty;
var _s = (e) => {
  throw TypeError(e);
};
var Ql = (e, t, n) => t in e ? Zl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var qe = (e, t, n) => Ql(e, typeof t != "symbol" ? t + "" : t, n), ii = (e, t, n) => t.has(e) || _s("Cannot " + n);
var h = (e, t, n) => (ii(e, t, "read from private field"), n ? n.call(e) : t.get(e)), W = (e, t, n) => t.has(e) ? _s("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), ce = (e, t, n, r) => (ii(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n), Y = (e, t, n) => (ii(e, t, "access private method"), n);
const $l = "5";
var Is;
typeof window < "u" && ((Is = window.__svelte ?? (window.__svelte = {})).v ?? (Is.v = /* @__PURE__ */ new Set())).add($l);
let Vt = !1, ea = !1;
function ta() {
  Vt = !0;
}
ta();
const na = 1, ra = 2, qs = 4, ia = 8, sa = 16, la = 1, aa = 2, oa = 4, fa = 8, ua = 16, ca = 1, va = 2, da = {}, ne = Symbol("uninitialized"), _a = "http://www.w3.org/1999/xhtml", Ls = !1;
var lr = Array.isArray, ha = Array.prototype.indexOf, ln = Array.prototype.includes, Si = Array.from, Cs = Object.defineProperty, Yn = Object.getOwnPropertyDescriptor, Ns = Object.getOwnPropertyDescriptors, pa = Object.prototype, ya = Array.prototype, Ei = Object.getPrototypeOf;
const ga = () => {
};
function ma(e) {
  return e();
}
function _i(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function ks() {
  var e, t, n = new Promise((r, s) => {
    e = r, t = s;
  });
  return { promise: n, resolve: e, reject: t };
}
const ae = 2, Pt = 4, bn = 8, Ms = 1 << 24, Ae = 16, Fe = 32, Et = 64, ba = 128, Di = 256, Oe = 512, te = 1024, z = 2048, me = 4096, ue = 8192, le = 16384, Gt = 32768, Jn = 1 << 25, an = 65536, Zn = 1 << 17, Ta = 1 << 18, ar = 1 << 19, Bs = 1 << 20, ke = 1 << 25, Qn = 1 << 21, Ft = 1 << 22, st = 1 << 23, Ye = Symbol("$state"), Ps = Symbol("component"), wa = Symbol("legacy props"), Sa = Symbol(""), si = Symbol("attributes"), hs = Symbol("class"), ps = Symbol("style"), Hn = Symbol("text"), Kn = Symbol("form reset"), Tn = new class extends Error {
  constructor() {
    super(...arguments);
    qe(this, "name", "StaleReactionError");
    qe(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}(), Ea = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
);
function Da() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function Aa() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Vs(e) {
  return e === this.v;
}
function Ra(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Gs(e) {
  return !Ra(e, this.v);
}
function xa(e) {
  throw new Error("https://svelte.dev/e/lifecycle_outside_component");
}
function Oa() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function Fa(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function Ia(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function qa() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function La(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function Ca() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Na(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function ka() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function Ma() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ba() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
let U = null;
function $n(e) {
  U = e;
}
function Pa(e, t = !1, n) {
  U = {
    p: U,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: (
      /** @type {Effect} */
      M
    ),
    l: Vt && !t ? { s: null, u: null, $: [] } : null
  };
}
function Va(e) {
  var t = (
    /** @type {ComponentContext} */
    U
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var r of n)
      sl(r);
  }
  return t.i = !0, U = t.p, Hs(e);
}
function Hs(e = {}) {
  return Cs(e, Ps, { value: !0 }), e;
}
function wn() {
  return !Vt || U !== null && U.l === null;
}
let gt = [];
function Ws() {
  var e = gt;
  gt = [], _i(e);
}
function er(e) {
  if (gt.length === 0 && !nn) {
    var t = gt;
    queueMicrotask(() => {
      t === gt && Ws();
    });
  }
  gt.push(e);
}
function Ga() {
  for (; gt.length > 0; )
    Ws();
}
const Ha = -7169;
function j(e, t) {
  e.f = e.f & Ha | t;
}
function Ai(e) {
  e.f & Oe || e.deps === null ? j(e, te) : j(e, me);
}
function Wa(e, t, n) {
  e.f & z ? t.add(e) : e.f & me && n.add(e), j(e, te);
}
let ys = !1;
function Ua() {
  ys || (ys = !0, document.addEventListener(
    "reset",
    (e) => {
      Promise.resolve().then(() => {
        if (!e.defaultPrevented)
          for (
            const t of
            /**@type {HTMLFormElement} */
            e.target.elements
          )
            t[Kn]?.();
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
    { capture: !0 }
  ));
}
function Ht(e) {
  var t = q, n = M;
  Pe(null), Ve(null);
  try {
    return e();
  } finally {
    Pe(t), Ve(n);
  }
}
function Us(e, t, n, r = n) {
  e.addEventListener(t, () => Ht(n));
  const s = (
    /** @type {any} */
    e[Kn]
  );
  s ? e[Kn] = () => {
    s(), r(!0);
  } : e[Kn] = () => r(!0), Ua();
}
function Xa(e, t, n, r) {
  const s = wn() ? on : Ri;
  var i = e.filter((v) => !v.settled), o = t.map(s);
  if (n.length === 0 && i.length === 0) {
    r(o);
    return;
  }
  var l = (
    /** @type {Effect} */
    M
  ), a = ja(), u = i.length === 1 ? i[0].promise : i.length > 1 ? Promise.all(i.map((v) => v.promise)) : null;
  function c(v) {
    if (!(l.f & le)) {
      a();
      try {
        r([...o, ...v]);
      } catch (T) {
        dn(T, l);
      }
      tr();
    }
  }
  var y = Xs();
  if (n.length === 0) {
    u.then(() => c([])).finally(y);
    return;
  }
  function w() {
    Promise.all(n.map((v) => /* @__PURE__ */ Ya(v))).then(c).catch((v) => dn(v, l)).finally(y);
  }
  u ? u.then(() => {
    if (l.f & le) {
      y();
      return;
    }
    a(), w(), tr();
  }) : w();
}
function ja() {
  var e = (
    /** @type {Effect} */
    M
  ), t = q, n = U, r = (
    /** @type {Batch} */
    L
  );
  return function(i = !0) {
    Ve(e), Pe(t), $n(n), i && !(e.f & le) && (r?.activate(), r?.apply());
  };
}
function tr(e = !0) {
  Ve(null), Pe(null), $n(null), e && L?.deactivate();
}
function Xs() {
  var e = (
    /** @type {Effect} */
    M
  ), t = e.b, n = (
    /** @type {Batch} */
    L
  ), r = !!t?.is_rendered();
  return t?.update_pending_count(1, n), n.increment(r, e), () => {
    t?.update_pending_count(-1, n), n.decrement(r, e);
  };
}
// @__NO_SIDE_EFFECTS__
function on(e) {
  var t = ae | z;
  return M !== null && (M.f |= ar), {
    ctx: U,
    deps: null,
    effects: null,
    equals: Vs,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      ne
    ),
    wv: 0,
    parent: M,
    ac: null
  };
}
const Qt = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function Ya(e, t, n) {
  let r = (
    /** @type {Effect | null} */
    M
  );
  r === null && Oa();
  var s = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), i = un(
    /** @type {V} */
    ne
  ), o = !q, l = /* @__PURE__ */ new Set();
  return vo(() => {
    var a = (
      /** @type {Effect} */
      M
    ), u = ks();
    s = u.promise;
    try {
      Promise.resolve(e()).then(u.resolve, (v) => {
        v !== Tn && u.reject(v);
      }).finally(tr);
    } catch (v) {
      u.reject(v), tr();
    }
    var c = (
      /** @type {Batch} */
      L
    );
    if (o) {
      if (a.f & Gt)
        var y = Xs();
      if (
        // boundary can be null if the async derived is inside an $effect.root not connected to the component render tree
        r.b?.is_rendered()
      )
        c.async_deriveds.get(a)?.reject(Qt);
      else
        for (const v of l.values())
          v.reject(Qt);
      l.add(u), c.async_deriveds.set(a, u);
    }
    const w = (v, T = void 0) => {
      y?.(), l.delete(u), T !== Qt && (c.activate(), T ? (i.f |= st, cn(i, T)) : (i.f & st && (i.f ^= st), cn(i, v)), c.deactivate());
    };
    u.promise.then(w, (v) => w(null, v || "unknown"));
  }), Ii(() => {
    for (const a of l)
      a.reject(Qt);
  }), new Promise((a) => {
    function u(c) {
      function y() {
        c === s ? a(i) : u(s);
      }
      c.then(y, y);
    }
    u(s);
  });
}
// @__NO_SIDE_EFFECTS__
function Ri(e) {
  const t = /* @__PURE__ */ on(e);
  return t.equals = Gs, t;
}
function Ka(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      Ke(
        /** @type {Effect} */
        t[n]
      );
  }
}
function xi(e) {
  var t, n = M, r = e.parent;
  if (!ze && r !== null && e.v !== ne && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
  r.f & (le | ue))
    return Da(), e.v;
  Ve(r);
  try {
    Ka(e), t = pl(e);
  } finally {
    Ve(n);
  }
  return t;
}
function js(e) {
  var t = xi(e);
  if (!e.equals(t) && (e.wv = _l(), (!L?.is_fork || e.deps === null) && (L !== null ? (L.capture(e, t, !0), It?.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    j(e, te);
    return;
  }
  ze || (Re !== null ? (il() || L?.is_fork) && Re.set(e, t) : Ai(e));
}
function za(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && Ht(() => {
        t.ac.abort(Tn), t.ac = null;
      }), t.fn !== null && (t.teardown = ga), hn(t, 0), qi(t));
}
function Ys(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && t.fn !== null && Dt(t);
}
let li = null, At = null, L = null, It = null, Re = null, hi = null, nn = !1, ai = !1, rn = null, zn = null;
var gs = 0;
let Ja = 1;
var Lt, it, bt, Ct, Nt, kt, Xe, Mt, pe, yn, je, Ee, Ce, Bt, Tt, C, pi, yi, $t, gi, Ks, zs, xt, Za, en;
const ir = class ir {
  constructor() {
    W(this, C);
    qe(this, "id", Ja++);
    /** True as soon as `#process` was called */
    W(this, Lt, !1);
    qe(this, "linked", !0);
    /** @type {Batch | null} */
    W(this, it, null);
    /** @type {Batch | null} */
    W(this, bt, null);
    /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
    qe(this, "async_deriveds", /* @__PURE__ */ new Map());
    /**
     * The current values of any signals that are updated in this batch.
     * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Value, [any, boolean]>}
     */
    qe(this, "current", /* @__PURE__ */ new Map());
    /**
     * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Value, any>}
     */
    qe(this, "previous", /* @__PURE__ */ new Map());
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<(batch: Batch) => void>}
     */
    W(this, Ct, /* @__PURE__ */ new Set());
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    W(this, Nt, /* @__PURE__ */ new Set());
    /**
     * The number of async effects that are currently in flight
     */
    W(this, kt, 0);
    /**
     * Async effects that are currently in flight, _not_ inside a pending boundary
     * @type {Map<Effect, number>}
     */
    W(this, Xe, /* @__PURE__ */ new Map());
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    W(this, Mt, null);
    /**
     * Effects that were scheduled in this batch but not yet 'resolved' into the
     * root effects that need to be flushed. Resolving — the upwards traversal that
     * marks the path to each effect on the shared effect tree (see #resolve) — is
     * deferred until the batch is processed, so that the markers are created and
     * consumed within a single traversal. Scheduling into other batches (which can
     * happen concurrently, e.g. while a batch is committed) can therefore never
     * observe (and be confused by) this batch's markers.
     * May contain duplicates — deduplication happens during resolving
     * @type {Effect[]}
     */
    W(this, pe, []);
    /**
     * Effects created while this batch was active.
     * @type {Effect[]}
     */
    W(this, yn, []);
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Set<Effect>}
     */
    W(this, je, /* @__PURE__ */ new Set());
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Set<Effect>}
     */
    W(this, Ee, /* @__PURE__ */ new Set());
    /**
     * A map of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`.
     * The value contains child effects that were dirty/maybe_dirty before being reset,
     * so they can be rescheduled if the branch survives.
     * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
     */
    W(this, Ce, /* @__PURE__ */ new Map());
    /**
     * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
     * @type {Set<Effect>}
     */
    W(this, Bt, /* @__PURE__ */ new Set());
    qe(this, "is_fork", !1);
    W(this, Tt, !1);
    At === null ? li = At = this : (ce(At, bt, this), ce(this, it, At)), At = this;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    h(this, Ce).has(t) || h(this, Ce).set(t, { d: [], m: [] }), h(this, Bt).delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, n = (r) => this.schedule(r)) {
    var r = h(this, Ce).get(t);
    if (r) {
      h(this, Ce).delete(t);
      for (var s of r.d)
        j(s, z), n(s);
      for (s of r.m)
        j(s, me), n(s);
    }
    h(this, Bt).add(t);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, n, r = !1) {
    t.v !== ne && !this.previous.has(t) && this.previous.set(t, t.v), t.f & st || (this.current.set(t, [n, r]), Re?.set(t, n)), this.is_fork || (t.v = n);
  }
  activate() {
    L = this;
  }
  deactivate() {
    L = null, Re = null;
  }
  flush() {
    try {
      ai = !0, L = this, Y(this, C, $t).call(this);
    } finally {
      gs = 0, hi = null, rn = null, zn = null, ai = !1, L = null, Re = null, Me.clear();
    }
  }
  discard() {
    for (const t of h(this, Nt)) t(this);
    h(this, Nt).clear();
    for (const t of this.async_deriveds.values())
      t.reject(Qt);
    Y(this, C, en).call(this), h(this, Mt)?.resolve();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    h(this, yn).push(t);
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(t, n) {
    if (ce(this, kt, h(this, kt) + 1), t) {
      let r = h(this, Xe).get(n) ?? 0;
      h(this, Xe).set(n, r + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, n) {
    if (ce(this, kt, h(this, kt) - 1), t) {
      let r = h(this, Xe).get(n) ?? 0;
      r === 1 ? h(this, Xe).delete(n) : h(this, Xe).set(n, r - 1);
    }
    h(this, Tt) || (ce(this, Tt, !0), er(() => {
      ce(this, Tt, !1), this.linked && this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, n) {
    for (const r of t)
      h(this, je).add(r);
    for (const r of n)
      h(this, Ee).add(r);
    t.clear(), n.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    h(this, Ct).add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    h(this, Nt).add(t);
  }
  settled() {
    return (h(this, Mt) ?? ce(this, Mt, ks())).promise;
  }
  static ensure() {
    if (L === null) {
      const t = L = new ir();
      !ai && !nn && er(() => {
        h(t, Lt) || t.flush();
      });
    }
    return L;
  }
  apply() {
    {
      Re = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    if (hi = t, t.b?.is_pending && t.f & (Pt | bn | Ms) && !(t.f & Gt)) {
      t.b.defer_effect(t);
      return;
    }
    h(this, pe).push(t);
  }
};
Lt = new WeakMap(), it = new WeakMap(), bt = new WeakMap(), Ct = new WeakMap(), Nt = new WeakMap(), kt = new WeakMap(), Xe = new WeakMap(), Mt = new WeakMap(), pe = new WeakMap(), yn = new WeakMap(), je = new WeakMap(), Ee = new WeakMap(), Ce = new WeakMap(), Bt = new WeakMap(), Tt = new WeakMap(), C = new WeakSet(), pi = function() {
  if (this.is_fork) return !0;
  for (const r of h(this, Xe).keys()) {
    for (var t = r, n = !1; t.parent !== null; ) {
      if (h(this, Ce).has(t)) {
        n = !0;
        break;
      }
      t = t.parent;
    }
    if (!n)
      return !0;
  }
  return !1;
}, /**
 * Convert the effects that were scheduled in this batch into the root effects
 * that need to be traversed, marking the path to each effect (by clearing the
 * `CLEAN` flag on ancestor branches) so that the traversal can find them.
 * This happens right before traversal rather than at scheduling time, so that
 * the markers left on the (shared) effect tree are created and consumed within
 * a single traversal — scheduling into other batches can never observe them
 * @returns {Effect[]}
 */
yi = function() {
  var t = [];
  for (const i of h(this, pe))
    if (!(i.f & le || !(i.f & (z | me)))) {
      for (var n = i, r = !1; n.parent !== null; ) {
        n = n.parent;
        var s = n.f;
        if (s & (Et | Fe)) {
          if (!(s & te)) {
            r = !0;
            break;
          }
          n.f ^= te;
        }
      }
      r || t.push(n);
    }
  return ce(this, pe, []), t;
}, $t = function() {
  var l, a, u;
  ce(this, Lt, !0);
  for (const c of h(this, je))
    h(this, Ee).delete(c), j(c, z), this.schedule(c);
  for (const c of h(this, Ee))
    j(c, me), this.schedule(c);
  this.apply();
  for (var t = rn = [], n = [], r = zn = []; h(this, pe).length > 0; ) {
    gs++ > 1e3 && (Y(this, C, en).call(this), $a());
    for (const c of Y(this, C, yi).call(this))
      try {
        Y(this, C, gi).call(this, c, t, n);
      } catch (y) {
        throw Qs(c), Y(this, C, pi).call(this) || this.discard(), y;
      }
  }
  if (L = null, r.length > 0) {
    var s = ir.ensure();
    for (const c of r)
      s.schedule(c);
  }
  if (rn = null, zn = null, Y(this, C, pi).call(this)) {
    Y(this, C, xt).call(this, n), Y(this, C, xt).call(this, t);
    for (const [c, y] of h(this, Ce))
      Zs(c, y);
    r.length > 0 && /** @type {unknown} */
    Y(l = L, C, $t).call(l);
    return;
  }
  const i = Y(this, C, Ks).call(this);
  if (i) {
    Y(this, C, xt).call(this, n), Y(this, C, xt).call(this, t), Y(a = i, C, zs).call(a, this);
    return;
  }
  h(this, je).clear(), h(this, Ee).clear();
  for (const c of h(this, Ct)) c(this);
  h(this, Ct).clear(), It = this, ms(n), ms(t), It = null, h(this, Mt)?.resolve();
  var o = (
    /** @type {Batch | null} */
    /** @type {unknown} */
    L
  );
  if (h(this, kt) === 0 && (h(this, pe).length === 0 || o !== null) && Y(this, C, en).call(this), h(this, pe).length > 0)
    if (o !== null) {
      for (const c of h(this, pe))
        h(o, pe).push(c);
      ce(this, pe, []);
    } else
      o = this;
  o !== null && (Me.clear(), Y(u = o, C, $t).call(u));
}, /**
 * Traverse the effect tree, executing effects or stashing
 * them for later execution as appropriate
 * @param {Effect} root
 * @param {Effect[]} effects
 * @param {Effect[]} render_effects
 */
gi = function(t, n, r) {
  t.f ^= te;
  for (var s = t.first; s !== null; ) {
    var i = s.f, o = (i & (Fe | Et)) !== 0, l = o && (i & te) !== 0, a = l || (i & ue) !== 0 || h(this, Ce).has(s);
    if (!a && s.fn !== null) {
      o ? s.f ^= te : i & Pt ? n.push(s) : Wt(s) && (i & Ae && h(this, Ee).add(s), Dt(s));
      var u = s.first;
      if (u !== null) {
        s = u;
        continue;
      }
    }
    for (; s !== null; ) {
      var c = s.next;
      if (c !== null) {
        s = c;
        break;
      }
      s = s.parent;
    }
  }
}, Ks = function() {
  for (var t = h(this, it); t !== null; ) {
    if (!t.is_fork) {
      for (const [n, [, r]] of this.current)
        if (t.current.has(n) && !r)
          return t;
    }
    t = h(t, it);
  }
  return null;
}, /**
 * @param {Batch} batch
 */
zs = function(t) {
  var r;
  for (const [s, i] of t.current)
    !this.previous.has(s) && t.previous.has(s) && this.previous.set(s, t.previous.get(s)), this.current.set(s, i);
  for (const [s, i] of t.async_deriveds) {
    const o = this.async_deriveds.get(s);
    o && i.promise.then(o.resolve).catch(o.reject);
  }
  t.async_deriveds.clear(), this.transfer_effects(h(t, je), h(t, Ee));
  const n = (s) => {
    var i = s.reactions;
    if (i !== null && !(s.f & ae && !(s.f & (z | me))))
      for (const a of i) {
        var o = a.f;
        if (o & ae)
          n(
            /** @type {Derived} */
            a
          );
        else {
          var l = (
            /** @type {Effect} */
            a
          );
          o & (Ft | Ae) && !this.async_deriveds.has(l) && (h(this, Ee).delete(l), j(l, z), this.schedule(l));
        }
      }
  };
  for (const s of this.current.keys())
    n(s);
  this.oncommit(() => t.discard()), Y(r = t, C, en).call(r), L = this, Y(this, C, $t).call(this);
}, /**
 * @param {Effect[]} effects
 */
xt = function(t) {
  for (var n = 0; n < t.length; n += 1)
    Wa(t[n], h(this, je), h(this, Ee));
}, Za = function() {
  var y, w;
  for (let v = li; v !== null; v = h(v, bt)) {
    var t = v.id < this.id, n = [];
    for (const [T, [O, g]] of this.current) {
      if (v.current.has(T)) {
        var r = (
          /** @type {[any, boolean]} */
          v.current.get(T)[0]
        );
        if (t && O !== r)
          v.current.set(T, [O, g]);
        else
          continue;
      }
      n.push(T);
    }
    if (t)
      for (const [T, O] of this.async_deriveds) {
        const g = v.async_deriveds.get(T);
        g && O.promise.then(g.resolve).catch(g.reject);
      }
    var s = [...v.current.keys()].filter(
      (T) => !/** @type {[any, boolean]} */
      v.current.get(T)[1]
    );
    if (!(!h(v, Lt) || s.length === 0)) {
      var i = s.filter((T) => !this.current.has(T));
      if (i.length === 0)
        t && v.discard();
      else if (n.length > 0) {
        if (t)
          for (const T of h(this, Bt))
            v.unskip_effect(T, (O) => {
              var g;
              O.f & (Ae | Ft) ? v.schedule(O) : Y(g = v, C, xt).call(g, [O]);
            });
        v.activate();
        var o = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Map();
        for (var a of n)
          Js(a, i, o, l);
        l = /* @__PURE__ */ new Map();
        var u = [...v.current].filter(([T, O]) => {
          const g = this.current.get(T);
          return g ? g[0] !== O[0] || g[1] !== O[1] : !0;
        }).map(([T]) => T);
        if (u.length > 0)
          for (const T of h(this, yn))
            !(T.f & (le | ue | Zn)) && Oi(T, u, l) && (T.f & (Ft | Ae) ? (j(T, z), v.schedule(T)) : h(v, je).add(T));
        if (h(v, pe).length > 0 && !h(v, Tt)) {
          v.apply();
          for (var c of Y(y = v, C, yi).call(y))
            Y(w = v, C, gi).call(w, c, [], []);
        }
        v.deactivate();
      }
    }
  }
}, en = function() {
  if (this.linked) {
    var t = h(this, it), n = h(this, bt);
    t === null ? li = n : ce(t, bt, n), n === null ? At = t : ce(n, it, t), this.linked = !1;
  }
};
let fn = ir;
function Qa(e) {
  var t = nn, n = It;
  It = null, nn = !0;
  try {
    for (var r; ; ) {
      if (Ga(), L === null)
        return (
          /** @type {T} */
          r
        );
      L.flush();
    }
  } finally {
    nn = t, It = n;
  }
}
function $a() {
  try {
    Ca();
  } catch (e) {
    dn(e, hi);
  }
}
let Ue = null;
function ms(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var r = e[n++];
      if (!(r.f & (le | ue)) && Wt(r) && (Ue = /* @__PURE__ */ new Set(), Dt(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && fl(r), Ue?.size > 0)) {
        Me.clear();
        for (const s of Ue) {
          if (s.f & (le | ue)) continue;
          const i = [s];
          let o = s.parent;
          for (; o !== null; )
            Ue.has(o) && (Ue.delete(o), i.push(o)), o = o.parent;
          for (let l = i.length - 1; l >= 0; l--) {
            const a = i[l];
            a.f & (le | ue) || Dt(a);
          }
        }
        Ue.clear();
      }
    }
    Ue = null;
  }
}
function Js(e, t, n, r) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const s of e.reactions) {
      const i = s.f;
      i & ae ? Js(
        /** @type {Derived} */
        s,
        t,
        n,
        r
      ) : i & (Ft | Ae) && !(i & z) && Oi(s, t, r) && (j(s, z), Fi(
        /** @type {Effect} */
        s
      ));
    }
}
function Oi(e, t, n) {
  const r = n.get(e);
  if (r !== void 0) return r;
  if (e.deps !== null)
    for (const s of e.deps) {
      if (ln.call(t, s))
        return !0;
      if (s.f & ae && Oi(
        /** @type {Derived} */
        s,
        t,
        n
      ))
        return n.set(
          /** @type {Derived} */
          s,
          !0
        ), !0;
    }
  return n.set(e, !1), !1;
}
function Fi(e) {
  L.schedule(e);
}
function Zs(e, t) {
  if (!(e.f & Fe && e.f & te)) {
    e.f & z ? t.d.push(e) : e.f & me && t.m.push(e), j(e, te);
    for (var n = e.first; n !== null; )
      Zs(n, t), n = n.next;
  }
}
function Qs(e) {
  j(e, te);
  for (var t = e.first; t !== null; )
    Qs(t), t = t.next;
}
let nr = /* @__PURE__ */ new Set();
const Me = /* @__PURE__ */ new Map();
let $s = !1;
function un(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Vs,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function $e(e, t) {
  const n = un(e);
  return po(n), n;
}
// @__NO_SIDE_EFFECTS__
function Se(e, t = !1, n = !0) {
  var s;
  const r = un(e);
  return t || (r.equals = Gs), Vt && n && U !== null && U.l !== null && ((s = U.l).s ?? (s.s = [])).push(r), r;
}
function eo(e, t) {
  return ee(
    e,
    E(() => f(e))
  ), t;
}
function ee(e, t, n = !1) {
  q !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!xe || q.f & Zn) && wn() && q.f & (ae | Ae | Ft | Zn) && (Be === null || !Be.has(e)) && Ba();
  let r = n ? Ot(t) : t;
  return cn(e, r, zn);
}
var yt = null, mi = 0;
function cn(e, t, n = null) {
  if (!e.equals(t)) {
    ze ? Me.set(e, t) : Me.has(e) || Me.set(e, e.v);
    var r = fn.ensure();
    if (r.capture(e, t), e.f & ae) {
      const s = (
        /** @type {Derived} */
        e
      );
      e.f & z && xi(s), Re === null && Ai(s);
    }
    e.wv = _l(), yt = null, mi = 0, el(e, z, n), yt = null, wn() && M !== null && M.f & te && !(M.f & (Fe | Et)) && (Te === null ? yo([e]) : Te.push(e)), !r.is_fork && nr.size > 0 && !$s && to();
  }
  return t;
}
function to() {
  $s = !1;
  for (const e of nr) {
    e.f & te && j(e, me);
    let t;
    try {
      t = Wt(e);
    } catch {
      t = !0;
    }
    t && Dt(e);
  }
  nr.clear();
}
function oi(e) {
  ee(e, e.v + 1);
}
function el(e, t, n) {
  var r = e.reactions;
  if (r !== null) {
    var s = wn(), i = r.length;
    if (mi += i, mi > 1e5 && yt === null && (yt = /* @__PURE__ */ new Set()), yt !== null) {
      if (yt.has(e)) return;
      yt.add(e);
    }
    for (var o = 0; o < i; o++) {
      var l = r[o], a = l.f;
      if (!(!s && l === M)) {
        var u = (a & z) === 0;
        if (u && j(l, t), a & Zn)
          nr.add(
            /** @type {Effect} */
            l
          );
        else if (a & ae) {
          var c = (
            /** @type {Derived} */
            l
          );
          Re?.delete(c), el(c, me, n);
        } else if (u) {
          var y = (
            /** @type {Effect} */
            l
          );
          a & Ae && Ue !== null && Ue.add(y), n !== null ? n.push(y) : Fi(y);
        }
      }
    }
  }
}
function Ot(e) {
  if (typeof e != "object" || e === null || Ye in e || Ps in e)
    return e;
  const t = Ei(e);
  if (t !== pa && t !== ya)
    return e;
  var n = /* @__PURE__ */ new Map(), r = lr(e), s = /* @__PURE__ */ $e(0), i = St, o = (l) => {
    if (St === i)
      return l();
    var a = q, u = St;
    Pe(null), ws(i);
    var c = l();
    return Pe(a), ws(u), c;
  };
  return r && n.set("length", /* @__PURE__ */ $e(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(l, a, u) {
        (!("value" in u) || u.configurable === !1 || u.enumerable === !1 || u.writable === !1) && ka();
        var c = n.get(a);
        return c === void 0 ? o(() => {
          var y = /* @__PURE__ */ $e(u.value);
          return n.set(a, y), y;
        }) : ee(c, u.value, !0), !0;
      },
      deleteProperty(l, a) {
        var u = n.get(a);
        if (u === void 0) {
          if (a in l) {
            const c = o(() => /* @__PURE__ */ $e(ne));
            n.set(a, c), oi(s);
          }
        } else
          ee(u, ne), oi(s);
        return !0;
      },
      get(l, a, u) {
        if (a === Ye)
          return e;
        var c = n.get(a), y = a in l;
        if (c === void 0 && (!y || Yn(l, a)?.writable) && (c = o(() => {
          var v = Ot(y ? l[a] : ne), T = /* @__PURE__ */ $e(v);
          return T;
        }), n.set(a, c)), c !== void 0) {
          var w = f(c);
          return w === ne ? void 0 : w;
        }
        return Reflect.get(l, a, u);
      },
      getOwnPropertyDescriptor(l, a) {
        this.has?.(l, a);
        var u = Reflect.getOwnPropertyDescriptor(l, a), c = n.get(a);
        if (c !== void 0) {
          var y = f(c);
          if (y === ne)
            return;
          if (u && "value" in u)
            u.value = y;
          else
            return {
              enumerable: !0,
              configurable: !0,
              value: y,
              writable: !0
            };
        }
        return u;
      },
      has(l, a) {
        if (a === Ye)
          return !0;
        var u = n.get(a), c = u !== void 0 && u.v !== ne || Reflect.has(l, a);
        if (u !== void 0 || M !== null && (!c || Yn(l, a)?.writable)) {
          u === void 0 && (u = o(() => {
            var w = c ? Ot(l[a]) : ne, v = /* @__PURE__ */ $e(w);
            return v;
          }), n.set(a, u));
          var y = f(u);
          if (y === ne)
            return !1;
        }
        return c;
      },
      set(l, a, u, c) {
        var y = n.get(a), w = a in l;
        if (r && a === "length")
          for (var v = u; v < /** @type {Source<number>} */
          y.v; v += 1) {
            var T = n.get(v + "");
            T !== void 0 ? ee(T, ne) : v in l && (T = o(() => /* @__PURE__ */ $e(ne)), n.set(v + "", T));
          }
        if (y === void 0)
          (!w || Yn(l, a)?.writable) && (y = o(() => /* @__PURE__ */ $e(void 0)), ee(y, Ot(u)), n.set(a, y));
        else {
          w = y.v !== ne;
          var O = o(() => Ot(u));
          ee(y, O);
        }
        var g = Reflect.getOwnPropertyDescriptor(l, a);
        if (g?.set && g.set.call(c, u), !w) {
          if (r && typeof a == "string") {
            var F = (
              /** @type {Source<number>} */
              n.get("length")
            ), B = Number(a);
            Number.isInteger(B) && B >= F.v && ee(F, B + 1);
          }
          oi(s);
        }
        return !0;
      },
      ownKeys(l) {
        f(s);
        var a = Reflect.ownKeys(l).filter((y) => {
          var w = n.get(y);
          return w === void 0 || w.v !== ne;
        });
        for (var [u, c] of n)
          c.v !== ne && !(u in l) && a.push(u);
        return a;
      },
      setPrototypeOf() {
        Ma();
      }
    }
  );
}
function bs(e) {
  try {
    if (e !== null && typeof e == "object" && Ye in e)
      return e[Ye];
  } catch {
  }
  return e;
}
function tl(e, t) {
  return Object.is(bs(e), bs(t));
}
var no, ro, io;
function sn(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function vn(e) {
  return (
    /** @type {TemplateNode | null} */
    ro.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function Sn(e) {
  return (
    /** @type {TemplateNode | null} */
    io.call(e)
  );
}
function x(e, t) {
  return /* @__PURE__ */ vn(e);
}
function so(e, t = !1) {
  {
    var n = /* @__PURE__ */ vn(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ Sn(n) : n;
  }
}
function se(e, t = !1) {
  return /* @__PURE__ */ vn(e);
}
function b(e, t = 1, n = !1) {
  let r = e;
  for (; t--; )
    r = /** @type {TemplateNode} */
    /* @__PURE__ */ Sn(r);
  return r;
}
function lo(e) {
  e.textContent = "";
}
function nl() {
  return !1;
}
function ao(e, t, n) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    n ? document.createElement(e, { is: n }) : document.createElement(e)
  );
}
function oo(e) {
  var t = M;
  if (t === null)
    return q.f |= st, e;
  if (!(t.f & Gt) && !(t.f & Pt))
    throw e;
  dn(e, t);
}
function dn(e, t) {
  if (e === da)
    throw e;
  if (!(t !== null && t.f & le)) {
    for (; t !== null; ) {
      if (t.f & ba && !(t.f & (le | Jn))) {
        if (!(t.f & Gt))
          throw e;
        try {
          t.b.error(e);
          return;
        } catch (n) {
          e = n;
        }
      }
      t = t.parent;
    }
    throw e;
  }
}
function rl(e) {
  M === null && (q === null && La(), qa()), ze && Ia();
}
function fo(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function Je(e, t) {
  var n = M;
  n !== null && n.f & ue && (e |= ue);
  var r = {
    ctx: U,
    deps: null,
    nodes: null,
    f: e | z | Oe,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: n,
    b: n && n.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null
  };
  L?.register_created_effect(r);
  var s = r;
  if (e & Pt)
    rn !== null ? rn.push(r) : fn.ensure().schedule(r);
  else if (t !== null) {
    try {
      Dt(r);
    } catch (o) {
      throw Ke(r), o;
    }
    s.deps === null && s.teardown === null && s.nodes === null && s.first === s.last && // either `null`, or a singular child
    !(s.f & ar) && (s = s.first, e & Ae && e & an && s !== null && (s.f |= an));
  }
  if (s !== null && (s.parent = n, n !== null && fo(s, n), q !== null && q.f & ae && !(e & Et))) {
    var i = (
      /** @type {Derived} */
      q
    );
    (i.effects ?? (i.effects = [])).push(s);
  }
  return r;
}
function il() {
  return q !== null && !xe;
}
function Ii(e) {
  const t = Je(bn, null);
  return j(t, te), t.teardown = e, t;
}
function bi(e) {
  rl();
  var t = (
    /** @type {Effect} */
    M.f
  ), n = !q && (t & Fe) !== 0 && U !== null && !U.i;
  if (n) {
    var r = (
      /** @type {ComponentContext} */
      U
    );
    (r.e ?? (r.e = [])).push(e);
  } else
    return sl(e);
}
function sl(e) {
  return Je(Pt | Bs, e);
}
function uo(e) {
  return rl(), Je(bn | Bs, e);
}
function ll(e) {
  return Je(Pt, e);
}
function et(e, t) {
  var n = (
    /** @type {ComponentContextLegacy} */
    U
  ), r = { effect: null, ran: !1, deps: e };
  n.l.$.push(r), r.effect = or(() => {
    if (e(), !r.ran) {
      r.ran = !0;
      var s = (
        /** @type {Effect} */
        M
      );
      try {
        Ve(s.parent), E(t);
      } finally {
        Ve(s);
      }
    }
  });
}
function co() {
  var e = (
    /** @type {ComponentContextLegacy} */
    U
  );
  or(() => {
    for (var t of e.l.$) {
      t.deps();
      var n = t.effect;
      n.f & te && n.deps !== null && j(n, me), Wt(n) && Dt(n), t.ran = !1;
    }
  });
}
function vo(e) {
  return Je(Ft | ar, e);
}
function or(e, t = 0) {
  return Je(bn | t, e);
}
function he(e, t = [], n = [], r = []) {
  Xa(r, t, n, (s) => {
    Je(bn, () => {
      e(...s.map(f));
    });
  });
}
function al(e, t = 0) {
  var n = Je(Ae | t, e);
  return n;
}
function _n(e) {
  return Je(Fe | ar, e);
}
function ol(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = ze, r = q;
    Ts(!0), Pe(null);
    try {
      t.call(null);
    } catch (s) {
      dn(s, e.parent);
    } finally {
      Ts(n), Pe(r);
    }
  }
}
function qi(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const s = n.ac;
    s !== null && Ht(() => {
      s.abort(Tn);
    });
    var r = n.next;
    n.f & Et ? n.parent = null : Ke(n, t), n = r;
  }
}
function _o(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    t.f & Fe || Ke(t), t = n;
  }
}
function Ke(e, t = !0) {
  var n = !1;
  (t || e.f & Ta) && e.nodes !== null && e.nodes.end !== null && (ho(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), e.f |= Jn, qi(e, t && !n), hn(e, 0);
  var r = e.nodes && e.nodes.t;
  if (r !== null)
    for (const i of r)
      i.stop();
  ol(e), e.f ^= Jn, e.f |= le;
  var s = e.parent;
  s !== null && s.first !== null && fl(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function ho(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ Sn(e);
    e.remove(), e = n;
  }
}
function fl(e) {
  var t = e.parent, n = e.prev, r = e.next;
  n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Li(e, t, n = !0) {
  var r = [];
  e.f |= Di, ul(e, r, !0);
  var s = () => {
    n && Ke(e), t && t();
  }, i = r.length;
  if (i > 0) {
    var o = () => --i || s();
    for (var l of r)
      l.out(o);
  } else
    s();
}
function ul(e, t, n) {
  if (!(e.f & ue)) {
    e.f ^= ue;
    var r = e.nodes && e.nodes.t;
    if (r !== null)
      for (const l of r)
        (l.is_global || n) && t.push(l);
    for (var s = e.first; s !== null; ) {
      var i = s.next;
      if (!(s.f & Et)) {
        var o = (s.f & an) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (s.f & Fe) !== 0 && (e.f & Ae) !== 0;
        ul(s, t, o ? n : !1);
      }
      s = i;
    }
  }
}
function rr(e) {
  e.f &= ~Di, cl(e, !0);
}
function cl(e, t) {
  if (!(e.f & Di) && e.f & ue) {
    e.f ^= ue, e.f & te || (j(e, z), fn.ensure().schedule(e));
    for (var n = e.first; n !== null; ) {
      var r = n.next, s = (n.f & an) !== 0 || (n.f & Fe) !== 0;
      cl(n, s ? t : !1), n = r;
    }
    var i = e.nodes && e.nodes.t;
    if (i !== null)
      for (const o of i)
        (o.is_global || t) && o.in();
  }
}
function vl(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, r = e.nodes.end; n !== null; ) {
      var s = n === r ? null : /* @__PURE__ */ Sn(n);
      t.append(n), n = s;
    }
}
let ze = !1;
function Ts(e) {
  ze = e;
}
let q = null, xe = !1;
function Pe(e) {
  q = e;
}
let M = null;
function Ve(e) {
  M = e;
}
let Be = null;
function po(e) {
  q !== null && (q.f & Qn || q.f & ae) && (Be ?? (Be = /* @__PURE__ */ new Set())).add(e);
}
let _e = null, ge = 0, Te = null;
function yo(e) {
  Te = e;
}
let dl = 1, mt = 0, St = mt;
function ws(e) {
  St = e;
}
function _l() {
  return ++dl;
}
function Wt(e) {
  var t = e.f;
  if (t & z)
    return !0;
  if (t & me) {
    for (var n = (
      /** @type {Value[]} */
      e.deps
    ), r = n.length, s = 0; s < r; s++) {
      var i = n[s];
      if (Wt(
        /** @type {Derived} */
        i
      ) && js(
        /** @type {Derived} */
        i
      ), i.wv > e.wv)
        return !0;
    }
    t & Oe && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Re === null && j(e, te);
  }
  return !1;
}
function hl(e, t, n = !0) {
  var r = e.reactions;
  if (r !== null && !(Be !== null && Be.has(e)))
    for (var s = 0; s < r.length; s++) {
      var i = r[s];
      i.f & ae ? hl(
        /** @type {Derived} */
        i,
        t,
        !1
      ) : t === i && (n ? j(i, z) : i.f & te && j(i, me), Fi(
        /** @type {Effect} */
        i
      ));
    }
}
function pl(e) {
  var t = _e, n = ge, r = Te, s = q, i = Be, o = U, l = xe, a = St, u = e.f;
  _e = /** @type {null | Value[]} */
  null, ge = 0, Te = null, q = u & (Fe | Et) ? null : e, Be = null, $n(e.ctx), xe = !1, St = ++mt, e.ac !== null && (Ht(() => {
    e.ac.abort(Tn);
  }), e.ac = null);
  try {
    e.f |= Qn;
    var c = (
      /** @type {Function} */
      e.fn
    ), y = c();
    e.f |= Gt;
    var w = Ss(e);
    if (wn() && Te !== null && !xe && w !== null && !(e.f & (ae | me | z)))
      for (var v = 0; v < /** @type {Source[]} */
      Te.length; v++)
        hl(
          Te[v],
          /** @type {Effect} */
          e
        );
    if (s !== null && s !== e) {
      if (mt++, s.deps !== null)
        for (let T = 0; T < n; T += 1)
          s.deps[T].rv = mt;
      if (t !== null)
        for (const T of t)
          T.rv = mt;
      Te !== null && (r === null ? r = Te : r.push(.../** @type {Source[]} */
      Te));
    }
    return e.f & st && (e.f ^= st), y;
  } catch (T) {
    return Ss(e), oo(T);
  } finally {
    e.f ^= Qn, _e = t, ge = n, Te = r, q = s, Be = i, $n(o), xe = l, St = a;
  }
}
function Ss(e) {
  var s;
  var t = e.deps, n = L?.is_fork;
  if (_e !== null) {
    var r;
    if (n || hn(e, ge), t !== null && ge > 0)
      for (t.length = ge + _e.length, r = 0; r < _e.length; r++)
        t[ge + r] = _e[r];
    else
      e.deps = t = _e;
    if (il() && e.f & Oe)
      for (r = ge; r < t.length; r++)
        ((s = t[r]).reactions ?? (s.reactions = [])).push(e);
  } else !n && t !== null && ge < t.length && (hn(e, ge), t.length = ge);
  return t;
}
function go(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var r = ha.call(n, e);
    if (r !== -1) {
      var s = n.length - 1;
      s === 0 ? n = t.reactions = null : (n[r] = n[s], n.pop());
    }
  }
  if (n === null && t.f & ae && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (_e === null || !ln.call(_e, t))) {
    var i = (
      /** @type {Derived} */
      t
    );
    i.f & Oe && (i.f ^= Oe), i.v !== ne && Ai(i), i.ac !== null && Ht(() => {
      i.ac.abort(Tn), i.ac = null, j(i, z);
    }), za(i), hn(i, 0);
  }
}
function hn(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var r = t; r < n.length; r++)
      go(e, n[r]);
}
function Dt(e) {
  var t = e.f;
  if (!(t & le)) {
    j(e, te);
    var n = M;
    M = e;
    try {
      t & (Ae | Ms) ? _o(e) : qi(e), ol(e);
      var r = pl(e);
      e.teardown = typeof r == "function" ? r : null, e.wv = dl;
      var s;
      Ls && ea && e.f & z && e.deps;
    } finally {
      M = n;
    }
  }
}
async function mo() {
  await Promise.resolve(), Qa();
}
function f(e) {
  var t = e.f, n = (t & ae) !== 0;
  if (q !== null && !xe) {
    var r = M !== null && (M.f & le) !== 0;
    if (!r && (Be === null || !Be.has(e))) {
      var s = q.deps;
      if (q.f & Qn)
        e.rv < mt && (e.rv = mt, _e === null && s !== null && s[ge] === e ? ge++ : _e === null ? _e = [e] : _e.push(e));
      else {
        q.deps ?? (q.deps = []), ln.call(q.deps, e) || q.deps.push(e);
        var i = e.reactions;
        i === null ? e.reactions = [q] : ln.call(i, q) || i.push(q);
      }
    }
  }
  if (ze && Me.has(e))
    return Me.get(e);
  if (n) {
    var o = (
      /** @type {Derived} */
      e
    );
    if (ze) {
      var l = o.v;
      return (!(o.f & te) && o.reactions !== null || gl(o)) && (l = xi(o)), Me.set(o, l), l;
    }
    var a = (o.f & Oe) === 0 && !xe && q !== null && (q.f & Oe) !== 0, u = (o.f & Gt) === 0;
    Wt(o) && (a && (o.f |= Oe), js(o)), a && !u && (Ys(o), yl(o));
  }
  if (Re?.has(e))
    return Re.get(e);
  if (e.f & st)
    throw e.v;
  return e.v;
}
function yl(e) {
  if (e.f |= Oe, e.deps !== null)
    for (const n of e.deps) {
      var t = n.reactions;
      t === null ? n.reactions = [e] : ln.call(t, e) || t.push(e), n.f & ae && !(n.f & Oe) && (Ys(
        /** @type {Derived} */
        n
      ), yl(
        /** @type {Derived} */
        n
      ));
    }
}
function gl(e) {
  if (e.v === ne) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (Me.has(t) || t.f & ae && gl(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function E(e) {
  var t = xe;
  try {
    return xe = !0, e();
  } finally {
    xe = t;
  }
}
function rt(e) {
  if (!(typeof e != "object" || !e || e instanceof EventTarget)) {
    if (Ye in e)
      Ti(e);
    else if (!Array.isArray(e))
      for (let t in e) {
        const n = e[t];
        typeof n == "object" && n && Ye in n && Ti(n);
      }
  }
}
function Ti(e, t = /* @__PURE__ */ new Set()) {
  if (typeof e == "object" && e !== null && // We don't want to traverse DOM elements
  !(e instanceof EventTarget) && !t.has(e)) {
    t.add(e), e instanceof Date && e.getTime();
    for (let r in e)
      try {
        Ti(e[r], t);
      } catch {
      }
    const n = Ei(e);
    if (n !== Object.prototype && n !== Array.prototype && n !== Map.prototype && n !== Set.prototype && n !== Date.prototype) {
      const r = Ns(n);
      for (let s in r) {
        const i = r[s].get;
        if (i)
          try {
            i.call(e);
          } catch {
          }
      }
    }
  }
}
const Wn = Symbol("events");
function bo(e, t, n, r = {}) {
  function s(i) {
    if (r.capture || To.call(t, i), !i.cancelBubble)
      return Ht(() => n?.call(this, i));
  }
  return e.startsWith("pointer") || e.startsWith("touch") || e === "wheel" ? (s.__removed = !1, er(() => {
    s.__removed || t.addEventListener(e, s, r);
  })) : t.addEventListener(e, s, r), s;
}
function G(e, t, n, r, s) {
  var i = { capture: r, passive: s }, o = bo(e, t, n, i);
  (t === document.body || // @ts-ignore
  t === window || // @ts-ignore
  t === document || // Firefox has quirky behavior, it can happen that we still get "canplay" events when the element is already removed
  t instanceof HTMLMediaElement) && Ii(() => {
    o.__removed = !0, t.removeEventListener(e, o, i);
  });
}
let fi = null, ui = !1;
function To(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), r = e.type, s = e.composedPath?.() || [], i = (
    /** @type {null | Element} */
    s[0] || e.target
  );
  fi = e, ui || (ui = !0, setTimeout(() => {
    ui = !1, fi = null;
  }));
  var o = 0, l = fi === e && e[Wn];
  if (l) {
    var a = s.indexOf(l);
    if (a !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[Wn] = t;
      return;
    }
    var u = s.indexOf(t);
    if (u === -1)
      return;
    a <= u && (o = a);
  }
  if (i = /** @type {Element} */
  s[o] || e.target, i !== t) {
    Cs(e, "currentTarget", {
      configurable: !0,
      get() {
        return i || n;
      }
    });
    var c = q, y = M;
    Pe(null), Ve(null);
    try {
      for (var w, v = []; i !== null && i !== t; ) {
        try {
          var T = i[Wn]?.[r];
          T != null && (!/** @type {any} */
          i.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === i) && T.call(i, e);
        } catch (O) {
          w ? v.push(O) : w = O;
        }
        if (e.cancelBubble) break;
        o++, i = o < s.length ? (
          /** @type {Element} */
          s[o]
        ) : null;
      }
      if (w) {
        for (let O of v)
          queueMicrotask(() => {
            throw O;
          });
        throw w;
      }
    } finally {
      e[Wn] = t, delete e.currentTarget, Pe(c), Ve(y);
    }
  }
}
const wo = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function So(e) {
  return (
    /** @type {string} */
    wo?.createHTML(e) ?? e
  );
}
function Eo(e) {
  var t = ao("template");
  return t.innerHTML = So(e.replaceAll("<!>", "<!---->")), t.content;
}
function Es(e, t) {
  var n = (
    /** @type {Effect} */
    M
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function Ge(e, t) {
  var n = (t & ca) !== 0, r = (t & va) !== 0, s, i = !e.startsWith("<!>");
  return () => {
    s === void 0 && (s = Eo(i ? e : "<!>" + e), n || (s = /** @type {TemplateNode} */
    /* @__PURE__ */ vn(s)));
    var o = (
      /** @type {TemplateNode} */
      r || no ? document.importNode(s, !0) : s.cloneNode(!0)
    );
    if (n) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ vn(o)
      ), a = (
        /** @type {TemplateNode} */
        o.lastChild
      );
      Es(l, a);
    } else
      Es(o, o);
    return o;
  };
}
function fe(e, t) {
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
function ve(e, t) {
  var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
  n !== /** @type {any} */
  (e[Hn] ?? (e[Hn] = e.nodeValue)) && (e[Hn] = n, e.nodeValue = `${n}`);
}
var De, Ne, ye, wt, gn, mn, sr;
class Do {
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, n = !0) {
    /** @type {TemplateNode} */
    qe(this, "anchor");
    /** @type {Map<Batch, Key>} */
    W(this, De, /* @__PURE__ */ new Map());
    /**
     * Map of keys to effects that are currently rendered in the DOM.
     * These effects are visible and actively part of the document tree.
     * Example:
     * ```
     * {#if condition}
     * 	foo
     * {:else}
     * 	bar
     * {/if}
     * ```
     * Can result in the entries `true->Effect` and `false->Effect`
     * @type {Map<Key, Effect>}
     */
    W(this, Ne, /* @__PURE__ */ new Map());
    /**
     * Similar to #onscreen with respect to the keys, but contains branches that are not yet
     * in the DOM, because their insertion is deferred.
     * @type {Map<Key, Branch>}
     */
    W(this, ye, /* @__PURE__ */ new Map());
    /**
     * Keys of effects that are currently outroing
     * @type {Set<Key>}
     */
    W(this, wt, /* @__PURE__ */ new Set());
    /**
     * Whether to pause (i.e. outro) on change, or destroy immediately.
     * This is necessary for `<svelte:element>`
     */
    W(this, gn, !0);
    /**
     * @param {Batch} batch
     */
    W(this, mn, (t) => {
      if (h(this, De).has(t)) {
        var n = (
          /** @type {Key} */
          h(this, De).get(t)
        ), r = h(this, Ne).get(n);
        if (r)
          rr(r), h(this, wt).delete(n);
        else {
          var s = h(this, ye).get(n);
          s && (rr(s.effect), h(this, Ne).set(n, s.effect), h(this, ye).delete(n), s.fragment.lastChild.remove(), this.anchor.before(s.fragment), r = s.effect);
        }
        for (const [i, o] of h(this, De)) {
          if (h(this, De).delete(i), i === t)
            break;
          const l = h(this, ye).get(o);
          l && (Ke(l.effect), h(this, ye).delete(o));
        }
        for (const [i, o] of h(this, Ne)) {
          if (i === n || h(this, wt).has(i)) continue;
          const l = () => {
            if (Array.from(h(this, De).values()).includes(i)) {
              var u = document.createDocumentFragment();
              vl(o, u), u.append(sn()), h(this, ye).set(i, { effect: o, fragment: u });
            } else
              Ke(o);
            h(this, wt).delete(i), h(this, Ne).delete(i);
          };
          h(this, gn) || !r ? (h(this, wt).add(i), Li(o, l, !1)) : l();
        }
      }
    });
    /**
     * @param {Batch} batch
     */
    W(this, sr, (t) => {
      h(this, De).delete(t);
      const n = Array.from(h(this, De).values());
      for (const [r, s] of h(this, ye))
        n.includes(r) || (Ke(s.effect), h(this, ye).delete(r));
    });
    this.anchor = t, ce(this, gn, n);
  }
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, n) {
    var r = (
      /** @type {Batch} */
      L
    ), s = nl();
    if (n && !h(this, Ne).has(t) && !h(this, ye).has(t))
      if (s) {
        var i = document.createDocumentFragment(), o = sn();
        i.append(o), h(this, ye).set(t, {
          effect: _n(() => n(o)),
          fragment: i
        });
      } else
        h(this, Ne).set(
          t,
          _n(() => n(this.anchor))
        );
    if (h(this, De).set(r, t), s) {
      for (const [l, a] of h(this, Ne))
        l === t ? r.unskip_effect(a) : r.skip_effect(a);
      for (const [l, a] of h(this, ye))
        l === t ? r.unskip_effect(a.effect) : r.skip_effect(a.effect);
      r.oncommit(h(this, mn)), r.ondiscard(h(this, sr));
    } else
      h(this, mn).call(this, r);
  }
}
De = new WeakMap(), Ne = new WeakMap(), ye = new WeakMap(), wt = new WeakMap(), gn = new WeakMap(), mn = new WeakMap(), sr = new WeakMap();
function Ao(e) {
  U === null && xa(), Vt && U.l !== null ? Ro(U).m.push(e) : bi(() => {
    const t = E(e);
    if (typeof t == "function") return (
      /** @type {() => void} */
      t
    );
  });
}
function Ro(e) {
  var t = (
    /** @type {ComponentContextLegacy} */
    e.l
  );
  return t.u ?? (t.u = { a: [], b: [], m: [] });
}
function Un(e, t, n = !1) {
  var r = new Do(e), s = n ? an : 0;
  function i(o, l) {
    r.ensure(o, l);
  }
  al(() => {
    var o = !1;
    t((l, a = 0) => {
      o = !0, i(a, l);
    }), o || i(-1, null);
  }, s);
}
function ht(e, t) {
  return t;
}
function xo(e, t, n) {
  for (var r = [], s = t.length, i, o = t.length, l = 0; l < s; l++) {
    let y = t[l];
    Li(
      y,
      () => {
        if (i) {
          if (i.pending.delete(y), i.done.add(y), i.pending.size === 0) {
            var w = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            wi(e, Si(i.done)), w.delete(i), w.size === 0 && (e.outrogroups = null);
          }
        } else
          o -= 1;
      },
      !1
    );
  }
  if (o === 0) {
    var a = r.length === 0 && n !== null && e.pending.size === 0;
    if (a) {
      var u = (
        /** @type {Element} */
        n
      ), c = (
        /** @type {Element} */
        u.parentNode
      );
      lo(c), c.append(u), e.items.clear();
    }
    wi(e, t, !a);
  } else
    i = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ?? (e.outrogroups = /* @__PURE__ */ new Set())).add(i);
}
function wi(e, t, n = !0) {
  var r;
  if (e.pending.size > 0) {
    r = /* @__PURE__ */ new Set();
    for (const o of e.pending.values())
      for (const l of o)
        r.add(
          /** @type {EachItem} */
          e.items.get(l).e
        );
  }
  for (var s = 0; s < t.length; s++) {
    var i = t[s];
    if (r?.has(i)) {
      i.f |= ke;
      const o = document.createDocumentFragment();
      vl(i, o);
    } else
      Ke(t[s], n);
  }
}
var Ds;
function tt(e, t, n, r, s, i = null) {
  var o = e, l = /* @__PURE__ */ new Map(), a = (t & qs) !== 0;
  if (a) {
    var u = (
      /** @type {Element} */
      e
    );
    o = u.appendChild(sn());
  }
  var c = null, y = /* @__PURE__ */ Ri(() => {
    var B = n();
    return (
      /** @type {V[]} */
      lr(B) ? B : B == null ? [] : Si(B)
    );
  }), w = /* @__PURE__ */ new Map(), v = !0;
  function T(B) {
    if (!(F.effect.f & le)) {
      F.pending.delete(B);
      var P = f(y);
      F.fallback = c, Oo(F, P, o, t, r), c !== null && (P.length === 0 ? c.f & ke ? (c.f ^= ke, tn(c, null, o)) : rr(c) : Li(c, () => {
        c = null;
      }));
    }
  }
  function O(B) {
    F.pending.delete(B);
  }
  var g = al(() => {
    for (var B = (
      /** @type {V[]} */
      f(y)
    ), P = B.length, d = /* @__PURE__ */ new Set(), p = (
      /** @type {Batch} */
      L
    ), S = nl(), m = 0; m < P; m += 1) {
      var D = B[m], I = r(D, m), N = v ? null : l.get(I);
      N ? (N.v && cn(N.v, D), N.i && cn(N.i, m), S && p.unskip_effect(N.e)) : (N = Fo(
        l,
        v ? o : Ds ?? (Ds = sn()),
        D,
        I,
        m,
        s,
        t,
        n
      ), v || (N.e.f |= ke), l.set(I, N)), d.add(I);
    }
    if (P === 0 && i && !c && (v ? c = _n(() => i(o)) : (c = _n(() => i(Ds ?? (Ds = sn()))), c.f |= ke)), P > d.size && Fa(), !v)
      if (w.set(p, d), S) {
        for (const [J, Z] of l)
          d.has(J) || p.skip_effect(Z.e);
        p.oncommit(T), p.ondiscard(O);
      } else
        T(p);
    f(y);
  }), F = { effect: g, items: l, pending: w, outrogroups: null, fallback: c };
  v = !1;
}
function Jt(e) {
  for (; e !== null && !(e.f & Fe); )
    e = e.next;
  return e;
}
function Oo(e, t, n, r, s) {
  var i = (r & ia) !== 0, o = t.length, l = e.items, a = Jt(e.effect.first), u, c = null, y, w = [], v = [], T, O, g, F;
  if (i)
    for (F = 0; F < o; F += 1)
      T = t[F], O = s(T, F), g = /** @type {EachItem} */
      l.get(O).e, g.f & ke || (g.nodes?.a?.measure(), (y ?? (y = /* @__PURE__ */ new Set())).add(g));
  for (F = 0; F < o; F += 1) {
    if (T = t[F], O = s(T, F), g = /** @type {EachItem} */
    l.get(O).e, e.outrogroups !== null)
      for (const N of e.outrogroups)
        N.pending.delete(g), N.done.delete(g);
    if (g.f & ue && (rr(g), i && (g.nodes?.a?.unfix(), (y ?? (y = /* @__PURE__ */ new Set())).delete(g))), g.f & ke)
      if (g.f ^= ke, g === a)
        tn(g, null, n);
      else {
        var B = c ? c.next : a;
        g === e.effect.last && (e.effect.last = g.prev), g.prev && (g.prev.next = g.next), g.next && (g.next.prev = g.prev), nt(e, c, g), nt(e, g, B), tn(g, B, n), c = g, w = [], v = [], a = Jt(c.next);
        continue;
      }
    if (g !== a) {
      if (u !== void 0 && u.has(g)) {
        if (w.length < v.length) {
          var P = v[0], d;
          c = P.prev;
          var p = w[0], S = w[w.length - 1];
          for (d = 0; d < w.length; d += 1)
            tn(w[d], P, n);
          for (d = 0; d < v.length; d += 1)
            u.delete(v[d]);
          nt(e, p.prev, S.next), nt(e, c, p), nt(e, S, P), a = P, c = S, F -= 1, w = [], v = [];
        } else
          u.delete(g), tn(g, a, n), nt(e, g.prev, g.next), nt(e, g, c === null ? e.effect.first : c.next), nt(e, c, g), c = g;
        continue;
      }
      for (w = [], v = []; a !== null && a !== g; )
        (u ?? (u = /* @__PURE__ */ new Set())).add(a), v.push(a), a = Jt(a.next);
      if (a === null)
        continue;
    }
    g.f & ke || w.push(g), c = g, a = Jt(g.next);
  }
  if (e.outrogroups !== null) {
    for (const N of e.outrogroups)
      N.pending.size === 0 && (wi(e, Si(N.done)), e.outrogroups?.delete(N));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (a !== null || u !== void 0) {
    var m = [];
    if (u !== void 0)
      for (g of u)
        g.f & ue || m.push(g);
    for (; a !== null; )
      !(a.f & ue) && a !== e.fallback && m.push(a), a = Jt(a.next);
    var D = m.length;
    if (D > 0) {
      var I = r & qs && o === 0 ? n : null;
      if (i) {
        for (F = 0; F < D; F += 1)
          m[F].nodes?.a?.measure();
        for (F = 0; F < D; F += 1)
          m[F].nodes?.a?.fix();
      }
      xo(e, m, I);
    }
  }
  i && er(() => {
    if (y !== void 0)
      for (g of y)
        g.nodes?.a?.apply();
  });
}
function Fo(e, t, n, r, s, i, o, l) {
  var a = o & na ? o & sa ? un(n) : /* @__PURE__ */ Se(n, !1, !1) : null, u = o & ra ? un(s) : null;
  return {
    v: a,
    i: u,
    e: _n(() => (i(t, a ?? n, u ?? s, l), () => {
      e.delete(r);
    }))
  };
}
function tn(e, t, n) {
  if (e.nodes)
    for (var r = e.nodes.start, s = e.nodes.end, i = t && !(t.f & ke) ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : n; r !== null; ) {
      var o = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ Sn(r)
      );
      if (i.before(r), r === s)
        return;
      r = o;
    }
}
function nt(e, t, n) {
  t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function ml(e) {
  var t, n, r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var s = e.length;
    for (t = 0; t < s; t++) e[t] && (n = ml(e[t])) && (r && (r += " "), r += n);
  } else for (n in e) e[n] && (r && (r += " "), r += n);
  return r;
}
function Io() {
  for (var e, t, n = 0, r = "", s = arguments.length; n < s; n++) (e = arguments[n]) && (t = ml(e)) && (r && (r += " "), r += t);
  return r;
}
function qo(e) {
  return typeof e == "object" ? Io(e) : e ?? "";
}
function Lo(e, t, n) {
  var r = e == null ? "" : "" + e;
  return r = r ? r + " " + t : t, r === "" ? null : r;
}
function Co(e, t) {
  return e == null ? null : String(e);
}
function No(e, t, n, r, s, i) {
  var o = (
    /** @type {any} */
    e[hs]
  );
  if (o !== n || o === void 0) {
    var l = Lo(n, r);
    l == null ? e.removeAttribute("class") : e.className = l, e[hs] = n;
  }
  return i;
}
function pt(e, t, n, r) {
  var s = (
    /** @type {any} */
    e[ps]
  );
  if (s !== t) {
    var i = Co(t);
    i == null ? e.removeAttribute("style") : e.style.cssText = i, e[ps] = t;
  }
  return r;
}
function ko(e, t) {
  t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function Mo(e, t) {
  var n = e.__defaultValue, r = e.multiple, s = r ? n ?? [] : null;
  if (!(r && !lr(s))) {
    e.selectedIndex;
    for (var i of e.options) {
      var o = qt(i);
      ko(
        i,
        r ? (
          /** @type {any[]} */
          s.includes(o)
        ) : tl(o, n)
      );
    }
  }
}
function Le(e, t, n = !1) {
  if (e.multiple) {
    if (t == null)
      return;
    if (!lr(t))
      return Aa();
    for (var r of e.options)
      r.selected = t.includes(qt(r));
    return;
  }
  for (r of e.options) {
    var s = qt(r);
    if (tl(s, t)) {
      r.selected = !0;
      return;
    }
  }
  (!n || t !== void 0) && (e.selectedIndex = -1);
}
function de(e) {
  var t = new MutationObserver((n) => {
    n.every(Bo) || ("__defaultValue" in e && Mo(e), "__value" in e && Le(e, e.__value));
  });
  t.observe(e, {
    // Listen to option element changes
    childList: !0,
    subtree: !0,
    // because of <optgroup>
    // Listen to option element value attribute changes
    // (doesn't get notified of select value changes,
    // because that property is not reflected as an attribute)
    attributes: !0,
    attributeFilter: ["value"]
  }), Ii(() => {
    t.disconnect();
  });
}
function Rt(e, t, n = t) {
  var r = /* @__PURE__ */ new WeakSet(), s = !0;
  Us(e, "change", (i) => {
    var o = i ? "[selected]" : ":checked", l;
    if (e.multiple)
      l = [].map.call(e.querySelectorAll(o), qt);
    else {
      var a = e.querySelector(o) ?? // will fall back to first non-disabled option if no option is selected
      e.querySelector("option:not([disabled])");
      l = a && qt(a);
    }
    n(l), e.__value = l, L !== null && r.add(L);
  }), ll(() => {
    var i = t();
    if (e === document.activeElement) {
      var o = (
        /** @type {Batch} */
        L
      );
      if (r.has(o))
        return;
    }
    if (Le(e, i, s), s && i === void 0) {
      var l = e.querySelector(":checked");
      l !== null && (i = qt(l), n(i));
    }
    e.__value = i, s = !1;
  });
}
function qt(e) {
  return "__value" in e ? e.__value : e.value;
}
function Bo(e) {
  if (
    /** @type {Element} */
    e.target.closest("selectedcontent") !== null
  )
    return !0;
  if (e.type === "childList") {
    var t = [...e.addedNodes, ...e.removedNodes];
    return t.length > 0 && t.every((n) => n.nodeName === "SELECTEDCONTENT");
  }
  return !1;
}
const Po = Symbol("is custom element"), Vo = Symbol("is html"), Go = Ea ? "progress" : "PROGRESS";
function Zt(e, t) {
  var n = bl(e);
  n.value === (n.value = // treat null and undefined the same for the initial value
  t ?? void 0) || // @ts-expect-error
  // `progress` elements always need their value set when it's `0`
  e.value === t && (t !== 0 || e.nodeName !== Go) || (e.value = t ?? "");
}
function we(e, t, n, r) {
  var s = bl(e);
  s[t] !== (s[t] = n) && (t === "loading" && (e[Sa] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Ho(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function bl(e) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    /** @type {any} */
    e[si] ?? (e[si] = {
      [Po]: e.nodeName.includes("-"),
      [Vo]: e.namespaceURI === _a
    })
  );
}
var As = /* @__PURE__ */ new Map();
function Ho(e) {
  var t = e.getAttribute("is") || e.nodeName, n = As.get(t);
  if (n) return n;
  As.set(t, n = /* @__PURE__ */ new Set());
  for (var r, s = e, i = Element.prototype; i !== s; ) {
    r = Ns(s);
    for (var o in r)
      r[o].set && // better safe than sorry, we don't want spread attributes to mess with HTML content
      o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
    s = Ei(s);
  }
  return n;
}
function Wo(e, t, n = t) {
  var r = /* @__PURE__ */ new WeakSet();
  Us(e, "input", async (s) => {
    var i = s ? e.defaultValue : e.value;
    if (i = ci(e) ? vi(i) : i, n(i), L !== null && r.add(L), await mo(), i !== (i = t())) {
      var o = e.selectionStart, l = e.selectionEnd, a = e.value.length;
      if (e.value = i ?? "", l !== null) {
        var u = e.value.length;
        o === l && l === a && u > a ? (e.selectionStart = u, e.selectionEnd = u) : (e.selectionStart = o, e.selectionEnd = Math.min(l, u));
      }
    }
  }), // If we are hydrating and the value has since changed,
  // then use the updated value from the input instead.
  // If defaultValue is set, then value == defaultValue
  // TODO Svelte 6: remove input.value check and set to empty string?
  E(t) == null && e.value && (n(ci(e) ? vi(e.value) : e.value), L !== null && r.add(L)), or(() => {
    var s = t();
    if (e === document.activeElement) {
      var i = (
        /** @type {Batch} */
        L
      );
      if (r.has(i))
        return;
    }
    ci(e) && s === vi(e.value) || e.type === "date" && !s && !e.value || s !== e.value && (e.value = s ?? "");
  });
}
function ci(e) {
  var t = e.type;
  return t === "number" || t === "range";
}
function vi(e) {
  return e === "" ? null : +e;
}
function di(e, t) {
  return e === t || e?.[Ye] === t;
}
function Uo(e = Hs(), t, n, r) {
  var s = (
    /** @type {ComponentContext} */
    U.r
  ), i = (
    /** @type {Effect} */
    M
  );
  return ll(() => {
    var o, l;
    return or(() => {
      o = l, l = [], E(() => {
        di(n(...l), e) || (t(e, ...l), o && di(n(...o), e) && t(null, ...o));
      });
    }), () => {
      let a = i;
      for (; a !== s && a.parent !== null && a.parent.f & Jn; )
        a = a.parent;
      const u = () => {
        l && di(n(...l), e) && t(null, ...l);
      }, c = a.teardown;
      a.teardown = () => {
        u(), c?.();
      };
    };
  }), e;
}
function Xo(e = !1) {
  const t = (
    /** @type {ComponentContextLegacy} */
    U
  ), n = t.l.u;
  if (!n) return;
  let r = () => rt(t.s);
  if (e) {
    let s = 0, i = (
      /** @type {Record<string, any>} */
      {}
    );
    const o = /* @__PURE__ */ on(() => {
      let l = !1;
      const a = t.s;
      for (const u in a)
        a[u] !== i[u] && (i[u] = a[u], l = !0);
      return l && s++, s;
    });
    r = () => f(o);
  }
  n.b.length && uo(() => {
    Rs(t, r), _i(n.b);
  }), bi(() => {
    const s = E(() => n.m.map(ma));
    return () => {
      for (const i of s)
        typeof i == "function" && i();
    };
  }), n.a.length && bi(() => {
    Rs(t, r), _i(n.a);
  });
}
function Rs(e, t) {
  if (e.l.s)
    for (const n of e.l.s) f(n);
  t();
}
let Xn = !1;
function jo(e) {
  var t = Xn;
  try {
    return Xn = !1, [e(), Xn];
  } finally {
    Xn = t;
  }
}
function $(e, t, n, r) {
  var s = !Vt || (n & aa) !== 0, i = (n & fa) !== 0, o = (n & ua) !== 0, l = (
    /** @type {V} */
    r
  ), a = !0, u = (
    /** @type {Derived<V> | undefined} */
    void 0
  ), c = () => o && s ? (u ?? (u = /* @__PURE__ */ on(
    /** @type {() => V} */
    r
  )), f(u)) : (a && (a = !1, l = o ? E(
    /** @type {() => V} */
    r
  ) : (
    /** @type {V} */
    r
  )), l);
  let y;
  if (i) {
    var w = Ye in e || wa in e;
    y = Yn(e, t)?.set ?? (w && t in e ? (d) => e[t] = d : void 0);
  }
  var v, T = !1;
  i ? [v, T] = jo(() => (
    /** @type {V} */
    e[t]
  )) : v = /** @type {V} */
  e[t], v === void 0 && r !== void 0 && (v = c(), y && (s && Na(), y(v)));
  var O;
  if (s ? O = () => {
    var d = (
      /** @type {V} */
      e[t]
    );
    return d === void 0 ? c() : (a = !0, d);
  } : O = () => {
    var d = (
      /** @type {V} */
      e[t]
    );
    return d !== void 0 && (l = /** @type {V} */
    void 0), d === void 0 ? l : d;
  }, s && !(n & oa))
    return O;
  if (y) {
    var g = e.$$legacy;
    return (
      /** @type {() => V} */
      function(d, p) {
        return arguments.length > 0 ? ((!s || !p || g || T) && y(p ? O() : d), d) : O();
      }
    );
  }
  var F = !1, B = (n & la ? on : Ri)(() => (F = !1, O()));
  i && f(B);
  var P = (
    /** @type {Effect} */
    M
  );
  return (
    /** @type {() => V} */
    function(d, p) {
      if (arguments.length > 0) {
        const S = p ? f(B) : s && i ? Ot(d) : d;
        return ee(B, S), F = !0, l !== void 0 && (l = S), d;
      }
      return ze && F || P.f & le ? B.v : f(B);
    }
  );
}
function xs() {
  return {
    rdo: "#000000",
    bag: "#F4B4B4",
    dfo: "#FFF3A8",
    pax: "#A0C4FF",
    training: "#D8B4F8",
    header: "#1F4E79"
  };
}
function Yo(e, t) {
  if (!e) return t;
  var n = String(e).replace("#", "").trim();
  return n.length === 3 && (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]), n.length !== 6 || /[^0-9a-fA-F]/.test(n) ? t : "#" + n.toUpperCase();
}
function Ko(e) {
  var t = Yo(e, "#FFFFFF") || "#FFFFFF", n = t.slice(1), r = parseInt(n.slice(0, 2), 16), s = parseInt(n.slice(2, 4), 16), i = parseInt(n.slice(4, 6), 16), o = (0.299 * r + 0.587 * s + 0.114 * i) / 255;
  return o < 0.45 ? "#FFFFFF" : "#111111";
}
var Os = /* @__PURE__ */ Ge("<option> </option>"), Fs = /* @__PURE__ */ Ge('<tr class="spacer-row svelte-qst1f4"><td colspan="20" class="spacer-cell svelte-qst1f4"></td></tr>'), jn = /* @__PURE__ */ Ge('<option class="svelte-qst1f4"> </option>'), zo = /* @__PURE__ */ Ge('<div class="day-times-wrap svelte-qst1f4"><input type="time" class="day-time-input svelte-qst1f4"/> <span class="day-time-sep svelte-qst1f4">–</span> <input type="time" class="day-time-input svelte-qst1f4"/></div>'), Jo = /* @__PURE__ */ Ge('<td><div class="day-cell-inner svelte-qst1f4"><select class="day-duty-select svelte-qst1f4"><option class="svelte-qst1f4">PAX</option><option class="svelte-qst1f4">BAG</option><option class="svelte-qst1f4">DFO</option><option class="svelte-qst1f4">-</option><option class="svelte-qst1f4">Training</option><option class="svelte-qst1f4">OFF</option></select> <!></div></td>'), Zo = /* @__PURE__ */ Ge('<tr class="svelte-qst1f4"><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="team"><option class="svelte-qst1f4">—</option><!></select></td><td class="svelte-qst1f4"><input type="text" class="line-edit line-code-input svelte-qst1f4" data-field="lineCode"/></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="shift"><option class="svelte-qst1f4">—</option><!></select></td><td class="svelte-qst1f4"><input type="time" class="line-edit line-time-input svelte-qst1f4" data-field="start"/></td><td class="svelte-qst1f4"><input type="time" class="line-edit line-time-input svelte-qst1f4" data-field="end"/></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="position"><option class="svelte-qst1f4">—</option><!></select></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="emp"><option class="svelte-qst1f4">—</option><!></select></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="sex"><option class="svelte-qst1f4">—</option><option class="svelte-qst1f4">M</option><option class="svelte-qst1f4">F</option></select></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="function"><option class="svelte-qst1f4">—</option><option class="svelte-qst1f4">-</option><option class="svelte-qst1f4">DFO</option><option class="svelte-qst1f4">BAG</option><option class="svelte-qst1f4">PAX</option><option class="svelte-qst1f4">TRAINING</option></select></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="certPool"><option class="svelte-qst1f4">—</option><option class="svelte-qst1f4">A</option><option class="svelte-qst1f4">B</option></select></td><td class="line-rdo-cell svelte-qst1f4"> </td><td class="line-center svelte-qst1f4"> </td><!><td class="line-hours svelte-qst1f4"> </td></tr>'), Qo = /* @__PURE__ */ Ge('<tr class="svelte-qst1f4"><td colspan="20" class="muted svelte-qst1f4" style="padding: 1.5rem; text-align: center;">No matching lines found.</td></tr>'), $o = /* @__PURE__ */ Ge('<div class="lines-table-header-controls svelte-qst1f4"><div class="filter-controls svelte-qst1f4"><label class="svelte-qst1f4">Search <input type="text" class="filter-input search-input svelte-qst1f4" placeholder="Search line code..."/></label> <label class="svelte-qst1f4">Role <select class="filter-select svelte-qst1f4"><option>All</option><option>STSO</option><option>LTSO</option><option>TSO (FT/PT)</option></select></label> <label class="svelte-qst1f4">Team <select class="filter-select svelte-qst1f4"><option>All</option><option>Unassigned</option><!></select></label> <label class="svelte-qst1f4">Shift <select class="filter-select svelte-qst1f4"><option>All shifts</option><!></select></label> <label class="svelte-qst1f4">Duty <select class="filter-select svelte-qst1f4"><option>All duties</option><option>BAG</option><option>PAX</option><option>DFO</option><option>-</option><option>TRAINING</option><option>OFF / RDO</option></select></label> <label class="svelte-qst1f4">On Day <select class="filter-select svelte-qst1f4"><option>Any day</option><option>Sun</option><option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option></select></label> <label class="svelte-qst1f4">Sex <select class="filter-select svelte-qst1f4"><option>All</option><option>M</option><option>F</option></select></label></div></div> <div class="lines-virtual-root svelte-qst1f4"><table class="data-table lines-editable svelte-qst1f4"><thead><tr class="svelte-qst1f4"><th class="sortable col-team svelte-qst1f4"> </th><th class="sortable col-line svelte-qst1f4"> </th><th class="sortable col-shift svelte-qst1f4"> </th><th class="sortable col-time svelte-qst1f4"> </th><th class="col-time svelte-qst1f4">End</th><th class="sortable col-pos svelte-qst1f4"> </th><th class="col-sm svelte-qst1f4">Emp</th><th class="col-sm svelte-qst1f4">Sex</th><th class="col-duty svelte-qst1f4">Duty</th><th class="col-sm svelte-qst1f4">Cert</th><th class="col-rdos svelte-qst1f4">RDOs</th><th class="col-sm svelte-qst1f4">Paid</th><th class="col-day svelte-qst1f4">Sun</th><th class="col-day svelte-qst1f4">Mon</th><th class="col-day svelte-qst1f4">Tue</th><th class="col-day svelte-qst1f4">Wed</th><th class="col-day svelte-qst1f4">Thu</th><th class="col-day svelte-qst1f4">Fri</th><th class="col-day svelte-qst1f4">Sat</th><th class="col-sm svelte-qst1f4">Hrs</th></tr></thead><tbody class="svelte-qst1f4"><!><!><!></tbody></table></div>', 1), ef = /* @__PURE__ */ Ge('<div class="muted">Classic Lines mode active</div>'), tf = /* @__PURE__ */ Ge('<div class="lines-table-root svelte-qst1f4"><!></div>');
function nf(e, t) {
  Pa(t, !1);
  const n = /* @__PURE__ */ Se(), r = /* @__PURE__ */ Se(), s = /* @__PURE__ */ Se(), i = /* @__PURE__ */ Se(), o = /* @__PURE__ */ Se(), l = /* @__PURE__ */ Se(), a = /* @__PURE__ */ Se();
  let u = $(t, "rows", 24, () => []), c = $(
    t,
    "mode",
    8,
    "svelte"
    // 'svelte' | 'classic'
  ), y = $(t, "shiftOptions", 24, () => []), w = $(t, "teamOptions", 24, () => []), v = $(t, "exportStyle", 24, xs), T = $(t, "onInlineEdit", 8, null);
  $(t, "onDayToggle", 8, null);
  let O = $(t, "onDayDutyEdit", 8, null), g = $(t, "onDayTimeEdit", 8, null), F = $(t, "onSort", 8, null), B = $(t, "onFilter", 8, null), P = $(t, "currentSortBy", 8, "role"), d = $(t, "currentSortDir", 8, "asc"), p = $(t, "filterRole", 12, "ALL"), S = $(t, "filterShift", 12, ""), m = $(t, "filterTeam", 12, ""), D = $(t, "filterSex", 12, ""), I = $(t, "filterDuty", 12, ""), N = $(t, "filterDay", 12, ""), J = $(t, "searchCode", 12, "");
  const Z = ["TSO", "LTSO", "STSO"], ie = ["FT", "PT"];
  function Ie(A, R) {
    const oe = R == null ? "" : String(R);
    return !oe || A.indexOf(oe) >= 0 ? A : A.concat([oe]);
  }
  function En(A) {
    if (!A) return "";
    const R = A.name || A.id || "";
    if (A.segments && Array.isArray(A.segments) && A.segments.length === 2) {
      const oe = A.segments[0].start + "–" + A.segments[0].end + " / " + A.segments[1].start + "–" + A.segments[1].end;
      return (R ? R + " " : "") + "(" + oe + ")";
    }
    return A.start && A.end ? (R ? R + " " : "") + "(" + A.start + "–" + A.end + ")" : A.start ? R ? R + " " + A.start : A.start : R;
  }
  function Dn(A) {
    const R = String(A || "").toUpperCase();
    return R === "RDO" || R === "—" || R === "OFF" ? "rdo" : R === "-" ? "dash" : R === "BAG" || R === "BAGS" ? "bag" : R === "DFO" ? "dfo" : R === "PAX" ? "pax" : R === "TRAINING" ? "training" : null;
  }
  function fr(A) {
    const R = Dn(A);
    return R === "rdo" ? "cell-day-col cell-rdo" : R === "bag" ? "cell-day-col cell-function-duty cell-bag" : R === "dfo" ? "cell-day-col cell-function-duty cell-dfo" : R === "pax" ? "cell-day-col cell-function-duty cell-pax" : R === "training" ? "cell-day-col cell-function-duty cell-training" : "cell-day-col cell-work";
  }
  function An(A) {
    const R = Dn(A);
    if (!R) return;
    const at = (v() || xs())[R];
    if (at)
      return "background:" + at + ";color:" + Ko(at) + ";";
  }
  function be(A, R, oe) {
    T()?.({ lineId: A, field: R, value: oe });
  }
  function wl(A, R, oe) {
    O()?.({ lineId: A, dayIndex: R, duty: oe });
  }
  function Ci(A, R, oe, at) {
    g()?.({ lineId: A, dayIndex: R, field: oe, value: at });
  }
  function Ut(A) {
    let R = "asc";
    P() === A && (R = d() === "asc" ? "desc" : "asc"), F()?.({ sortBy: A, sortDir: R });
  }
  function lt() {
    B()?.({
      filterRole: p(),
      filterShift: S(),
      filterTeam: m(),
      filterSex: D(),
      filterDuty: I(),
      filterDay: N(),
      searchCode: J()
    });
  }
  function Xt(A) {
    return P() !== A ? "" : d() === "asc" ? " ▲" : " ▼";
  }
  const jt = 42, Ni = 8;
  let Ze = /* @__PURE__ */ Se(0), Yt = /* @__PURE__ */ Se(600), He = /* @__PURE__ */ Se();
  function Sl(A) {
    ee(Ze, A.target.scrollTop);
  }
  Ao(() => {
    f(He) && ee(Yt, f(He).clientHeight || 600);
  }), et(() => rt(u()), () => {
    ee(n, u().length);
  }), et(() => f(n), () => {
    ee(r, f(n) * jt);
  }), et(
    () => (f(He), f(r), f(Ze), f(Yt)),
    () => {
      f(He) && f(r) >= 0 && f(Ze) > f(r) && (eo(He, f(He).scrollTop = Math.max(0, f(r) - f(Yt))), ee(Ze, f(He).scrollTop));
    }
  ), et(() => f(Ze), () => {
    ee(s, Math.max(0, Math.floor(f(Ze) / jt) - Ni));
  }), et(() => (f(n), f(Ze), f(Yt)), () => {
    ee(i, Math.min(f(n), Math.ceil((f(Ze) + f(Yt)) / jt) + Ni));
  }), et(
    () => (rt(u()), f(s), f(i)),
    () => {
      ee(o, u().slice(f(s), f(i)));
    }
  ), et(() => f(s), () => {
    ee(l, f(s) * jt);
  }), et(() => (f(r), f(i)), () => {
    ee(a, Math.max(0, f(r) - f(i) * jt));
  }), co(), Xo();
  var ur = tf(), El = x(ur);
  {
    var Dl = (A) => {
      var R = $o(), oe = so(R), at = x(oe), ki = x(at), Mi = b(x(ki)), Bi = b(ki, 2), Rn = b(x(Bi)), cr = x(Rn);
      cr.value = cr.__value = "ALL";
      var vr = b(cr);
      vr.value = vr.__value = "STSO";
      var dr = b(vr);
      dr.value = dr.__value = "LTSO";
      var Pi = b(dr);
      Pi.value = Pi.__value = "TSO", de(Rn);
      var Vi = b(Bi, 2), xn = b(x(Vi)), _r = x(xn);
      _r.value = _r.__value = "";
      var hr = b(_r);
      hr.value = hr.__value = "__none__";
      var Rl = b(hr);
      tt(Rl, 1, w, ht, (K, _) => {
        var Q = Os(), Qe = se(Q, !0), re = {};
        he(() => {
          ve(Qe, (f(_), E(() => f(_).name ?? f(_).id))), re !== (re = (f(_), E(() => f(_).id))) && (Q.value = (Q.__value = re) ?? "");
        }), fe(K, Q);
      }), de(xn);
      var Gi = b(Vi, 2), On = b(x(Gi)), pr = x(On);
      pr.value = pr.__value = "";
      var xl = b(pr);
      tt(xl, 1, y, ht, (K, _) => {
        var Q = Os(), Qe = se(Q, !0), re = {};
        he(
          (Kt) => {
            ve(Qe, Kt), re !== (re = (f(_), E(() => f(_).id))) && (Q.value = (Q.__value = re) ?? "");
          },
          [
            () => (f(_), E(() => En(f(_))))
          ]
        ), fe(K, Q);
      }), de(On);
      var Hi = b(Gi, 2), Fn = b(x(Hi)), yr = x(Fn);
      yr.value = yr.__value = "";
      var gr = b(yr);
      gr.value = gr.__value = "BAG";
      var mr = b(gr);
      mr.value = mr.__value = "PAX";
      var br = b(mr);
      br.value = br.__value = "DFO";
      var Tr = b(br);
      Tr.value = Tr.__value = "-";
      var wr = b(Tr);
      wr.value = wr.__value = "TRAINING";
      var Wi = b(wr);
      Wi.value = Wi.__value = "OFF", de(Fn);
      var Ui = b(Hi, 2), In = b(x(Ui)), Sr = x(In);
      Sr.value = Sr.__value = "";
      var Er = b(Sr);
      Er.value = Er.__value = "0";
      var Dr = b(Er);
      Dr.value = Dr.__value = "1";
      var Ar = b(Dr);
      Ar.value = Ar.__value = "2";
      var Rr = b(Ar);
      Rr.value = Rr.__value = "3";
      var xr = b(Rr);
      xr.value = xr.__value = "4";
      var Or = b(xr);
      Or.value = Or.__value = "5";
      var Xi = b(Or);
      Xi.value = Xi.__value = "6", de(In);
      var Ol = b(Ui, 2), qn = b(x(Ol)), Fr = x(qn);
      Fr.value = Fr.__value = "";
      var Ir = b(Fr);
      Ir.value = Ir.__value = "M";
      var ji = b(Ir);
      ji.value = ji.__value = "F", de(qn);
      var qr = b(oe, 2), Fl = x(qr), Yi = x(Fl), Il = x(Yi), Lr = x(Il), ql = se(Lr), Cr = b(Lr), Ll = se(Cr), Nr = b(Cr), Cl = se(Nr), kr = b(Nr), Nl = se(kr), Ki = b(kr, 2), kl = se(Ki), Ml = b(Yi), zi = x(Ml);
      {
        var Bl = (K) => {
          var _ = Fs(), Q = se(_);
          he(() => {
            pt(_, `height: ${f(l) ?? ""}px;`), pt(Q, `height: ${f(l) ?? ""}px;`);
          }), fe(K, _);
        };
        Un(zi, (K) => {
          f(l) > 0 && K(Bl);
        });
      }
      var Ji = b(zi);
      tt(
        Ji,
        1,
        () => f(o),
        (K) => K.id,
        (K, _) => {
          var Q = Zo();
          pt(Q, "height: 42px;");
          var Qe = x(Q), re = x(Qe), Kt = x(re);
          Kt.value = Kt.__value = "";
          var Gl = b(Kt);
          tt(Gl, 1, w, ht, (V, k) => {
            var H = jn(), We = se(H, !0), X = {};
            he(() => {
              ve(We, (f(k), E(() => f(k).name ?? f(k).id))), X !== (X = (f(k), E(() => f(k).id))) && (H.value = (H.__value = X) ?? "");
            }), fe(V, H);
          });
          var Ln;
          de(re);
          var Zi = b(Qe), Mr = x(Zi), Qi = b(Zi), ot = x(Qi), Br = x(ot);
          Br.value = Br.__value = "";
          var Hl = b(Br);
          tt(Hl, 1, y, ht, (V, k) => {
            var H = jn(), We = se(H, !0), X = {};
            he(
              (zt) => {
                ve(We, zt), X !== (X = (f(k), E(() => f(k).id))) && (H.value = (H.__value = X) ?? "");
              },
              [
                () => (f(k), E(() => En(f(k))))
              ]
            ), fe(V, H);
          });
          var Cn;
          de(ot);
          var $i = b(Qi), Pr = x($i), es = b($i), Vr = x(es), ts = b(es), ft = x(ts), Gr = x(ft);
          Gr.value = Gr.__value = "";
          var Wl = b(Gr);
          tt(
            Wl,
            1,
            () => (f(_), E(() => Ie(Z, f(_)?.position))),
            ht,
            (V, k) => {
              var H = jn(), We = se(H, !0), X = {};
              he(() => {
                ve(We, f(k)), X !== (X = f(k)) && (H.value = (H.__value = X) ?? "");
              }), fe(V, H);
            }
          );
          var Nn;
          de(ft);
          var ns = b(ts), ut = x(ns), Hr = x(ut);
          Hr.value = Hr.__value = "";
          var Ul = b(Hr);
          tt(Ul, 1, () => ie, ht, (V, k) => {
            var H = jn(), We = se(H, !0), X = {};
            he(() => {
              ve(We, f(k)), X !== (X = f(k)) && (H.value = (H.__value = X) ?? "");
            }), fe(V, H);
          });
          var kn;
          de(ut);
          var rs = b(ns), ct = x(rs), Wr = x(ct);
          Wr.value = Wr.__value = "";
          var Ur = b(Wr);
          Ur.value = Ur.__value = "M";
          var is = b(Ur);
          is.value = is.__value = "F";
          var Mn;
          de(ct);
          var ss = b(rs), vt = x(ss), Xr = x(vt);
          Xr.value = Xr.__value = "";
          var jr = b(Xr);
          jr.value = jr.__value = "-";
          var Yr = b(jr);
          Yr.value = Yr.__value = "DFO";
          var Kr = b(Yr);
          Kr.value = Kr.__value = "BAG";
          var zr = b(Kr);
          zr.value = zr.__value = "PAX";
          var ls = b(zr);
          ls.value = ls.__value = "TRAINING";
          var Bn;
          de(vt);
          var as = b(ss), dt = x(as), Jr = x(dt);
          Jr.value = Jr.__value = "";
          var Zr = b(Jr);
          Zr.value = Zr.__value = "A";
          var os = b(Zr);
          os.value = os.__value = "B";
          var Pn;
          de(dt);
          var fs = b(as), Xl = se(fs, !0), us = b(fs), jl = se(us, !0), cs = b(us);
          tt(cs, 0, () => [0, 1, 2, 3, 4, 5, 6], ht, (V, k) => {
            var H = Jo(), We = x(H), X = x(We), zt = x(X);
            zt.value = zt.__value = "PAX";
            var Qr = b(zt);
            Qr.value = Qr.__value = "BAG";
            var $r = b(Qr);
            $r.value = $r.__value = "DFO";
            var ei = b($r);
            ei.value = ei.__value = "-";
            var ti = b(ei);
            ti.value = ti.__value = "TRAINING";
            var vs = b(ti);
            vs.value = vs.__value = "OFF";
            var Vn;
            de(X);
            var zl = b(X, 2);
            {
              var Jl = (_t) => {
                var Gn = zo(), ni = x(Gn), ds = b(ni, 4);
                he(() => {
                  Zt(ni, (f(_), E(() => f(_)?.dayStarts?.[k] || f(_)?.start || ""))), Zt(ds, (f(_), E(() => f(_)?.dayEnds?.[k] || f(_)?.end || "")));
                }), G("change", ni, (ri) => Ci(f(_)?.id, k, "start", ri.target.value)), G("change", ds, (ri) => Ci(f(_)?.id, k, "end", ri.target.value)), fe(_t, Gn);
              };
              Un(zl, (_t) => {
                f(_), E(() => f(_)?.dayDuties?.[k] !== "OFF" && f(_)?.days?.[k] !== "RDO") && _t(Jl);
              });
            }
            he(
              (_t, Gn) => {
                No(H, 1, _t, "svelte-qst1f4"), pt(H, Gn), Vn !== (Vn = (f(_), E(() => f(_)?.dayDuties?.[k] === "OFF" || f(_)?.days?.[k] === "RDO" ? "OFF" : f(_)?.dayDuties?.[k] || "PAX"))) && (X.value = (X.__value = Vn) ?? "", Le(X, Vn));
              },
              [
                () => qo((f(_), E(() => fr(f(_)?.dayDuties?.[k] ?? f(_)?.days?.[k])))),
                () => (f(_), E(() => An(f(_)?.dayDuties?.[k] ?? f(_)?.days?.[k])))
              ]
            ), G("change", X, (_t) => wl(f(_)?.id, k, _t.target.value)), fe(V, H);
          });
          var Yl = b(cs), Kl = se(Yl, !0);
          he(() => {
            we(Q, "data-line-row", (f(_), E(() => f(_)?.id))), we(re, "data-line-id", (f(_), E(() => f(_)?.id))), Ln !== (Ln = (f(_), E(() => f(_)?.teamId ?? ""))) && (re.value = (re.__value = Ln) ?? "", Le(re, Ln)), we(Mr, "data-line-id", (f(_), E(() => f(_)?.id))), Zt(Mr, (f(_), E(() => f(_)?.line ?? ""))), we(ot, "data-line-id", (f(_), E(() => f(_)?.id))), Cn !== (Cn = (f(_), E(() => f(_)?.shiftId ?? ""))) && (ot.value = (ot.__value = Cn) ?? "", Le(ot, Cn)), we(Pr, "data-line-id", (f(_), E(() => f(_)?.id))), Zt(Pr, (f(_), E(() => f(_)?.start ?? ""))), we(Vr, "data-line-id", (f(_), E(() => f(_)?.id))), Zt(Vr, (f(_), E(() => f(_)?.end ?? ""))), we(ft, "data-line-id", (f(_), E(() => f(_)?.id))), Nn !== (Nn = (f(_), E(() => f(_)?.position ?? ""))) && (ft.value = (ft.__value = Nn) ?? "", Le(ft, Nn)), we(ut, "data-line-id", (f(_), E(() => f(_)?.id))), kn !== (kn = (f(_), E(() => f(_)?.emp ?? ""))) && (ut.value = (ut.__value = kn) ?? "", Le(ut, kn)), we(ct, "data-line-id", (f(_), E(() => f(_)?.id))), Mn !== (Mn = (f(_), E(() => f(_)?.sex ?? ""))) && (ct.value = (ct.__value = Mn) ?? "", Le(ct, Mn)), we(vt, "data-line-id", (f(_), E(() => f(_)?.id))), Bn !== (Bn = (f(_), E(() => f(_)?.function ?? ""))) && (vt.value = (vt.__value = Bn) ?? "", Le(vt, Bn)), we(dt, "data-line-id", (f(_), E(() => f(_)?.id))), Pn !== (Pn = (f(_), E(() => f(_)?.certPool ?? ""))) && (dt.value = (dt.__value = Pn) ?? "", Le(dt, Pn)), ve(Xl, (f(_), E(() => f(_)?.rdos ?? "—"))), ve(jl, (f(_), E(() => f(_)?.paid ?? ""))), ve(Kl, (f(_), E(() => f(_)?.hours ?? "")));
          }), G("change", re, (V) => be(f(_)?.id, "team", V.target.value)), G("change", Mr, (V) => be(f(_)?.id, "lineCode", V.target.value)), G("change", ot, (V) => be(f(_)?.id, "shift", V.target.value)), G("change", Pr, (V) => be(f(_)?.id, "start", V.target.value)), G("change", Vr, (V) => be(f(_)?.id, "end", V.target.value)), G("change", ft, (V) => be(f(_)?.id, "position", V.target.value)), G("change", ut, (V) => be(f(_)?.id, "emp", V.target.value)), G("change", ct, (V) => be(f(_)?.id, "sex", V.target.value)), G("change", vt, (V) => be(f(_)?.id, "function", V.target.value)), G("change", dt, (V) => be(f(_)?.id, "certPool", V.target.value)), fe(K, Q);
        },
        (K) => {
          var _ = Qo();
          fe(K, _);
        }
      );
      var Pl = b(Ji);
      {
        var Vl = (K) => {
          var _ = Fs(), Q = se(_);
          he(() => {
            pt(_, `height: ${f(a) ?? ""}px;`), pt(Q, `height: ${f(a) ?? ""}px;`);
          }), fe(K, _);
        };
        Un(Pl, (K) => {
          f(a) > 0 && K(Vl);
        });
      }
      Uo(qr, (K) => ee(He, K), () => f(He)), he(
        (K, _, Q, Qe, re) => {
          ve(ql, `Team${K ?? ""}`), ve(Ll, `Line${_ ?? ""}`), ve(Cl, `Shift${Q ?? ""}`), ve(Nl, `Start${Qe ?? ""}`), ve(kl, `Position${re ?? ""}`);
        },
        [
          () => E(() => Xt("team")),
          () => E(() => Xt("line")),
          () => E(() => Xt("shift")),
          () => E(() => Xt("start")),
          () => E(() => Xt("role"))
        ]
      ), Wo(Mi, J), G("input", Mi, lt), Rt(Rn, p), G("change", Rn, lt), Rt(xn, m), G("change", xn, lt), Rt(On, S), G("change", On, lt), Rt(Fn, I), G("change", Fn, lt), Rt(In, N), G("change", In, lt), Rt(qn, D), G("change", qn, lt), G("click", Lr, () => Ut("team")), G("click", Cr, () => Ut("line")), G("click", Nr, () => Ut("shift")), G("click", kr, () => Ut("start")), G("click", Ki, () => Ut("role")), G("scroll", qr, Sl), fe(A, R);
    }, Al = (A) => {
      var R = ef();
      fe(A, R);
    };
    Un(El, (A) => {
      c() === "svelte" ? A(Dl) : A(Al, -1);
    });
  }
  he(() => pt(ur, `min-height: min(70vh, 720px); height: min(70vh, 720px); width: 100%; --export-rdo: ${rt(v()), E(() => v()?.rdo || "#000000") ?? ""}; --export-bag: ${rt(v()), E(() => v()?.bag || "#F4B4B4") ?? ""}; --export-dfo: ${rt(v()), E(() => v()?.dfo || "#FFF3A8") ?? ""}; --export-pax: ${rt(v()), E(() => v()?.pax || "#A0C4FF") ?? ""}; --export-header: ${rt(v()), E(() => v()?.header || "#1F4E79") ?? ""};`)), fe(e, ur), Va();
}
function rf() {
  return typeof window < "u" && window.luxon && window.luxon.DateTime ? window.luxon.DateTime : typeof globalThis < "u" && globalThis.luxon && globalThis.luxon.DateTime ? globalThis.luxon.DateTime : null;
}
function pn(e) {
  var t = rf();
  if (t) {
    if (!e) return t.now().startOf("day");
    if (typeof e == "string") {
      var n = t.fromISO(e.slice(0, 10));
      if (n.isValid) return n.startOf("day");
    }
    return e && typeof e.toJSDate == "function" ? t.fromJSDate(e.toJSDate()).startOf("day") : e instanceof Date ? t.fromJSDate(e).startOf("day") : e && e.isValid && e.toISODate ? e.startOf ? e.startOf("day") : e : t.now().startOf("day");
  }
  var r;
  return e ? typeof e == "string" ? r = /* @__PURE__ */ new Date(e.slice(0, 10) + "T00:00:00") : e instanceof Date ? r = new Date(e.getTime()) : e && e.toJSDate ? r = e.toJSDate() : r = /* @__PURE__ */ new Date() : r = /* @__PURE__ */ new Date(), isNaN(r.getTime()) && (r = /* @__PURE__ */ new Date()), r.setHours(0, 0, 0, 0), {
    isValid: !0,
    weekday: r.getDay() === 0 ? 7 : r.getDay(),
    startOf: function() {
      return pn(r);
    },
    plus: function(s) {
      var i = new Date(r.getTime());
      return s && s.days && i.setDate(i.getDate() + s.days), pn(i);
    },
    toFormat: function(s) {
      var i = r.getFullYear(), o = String(r.getMonth() + 1).padStart(2, "0"), l = String(r.getDate()).padStart(2, "0");
      return i + "-" + o + "-" + l;
    },
    toISODate: function() {
      var s = r.getFullYear(), i = String(r.getMonth() + 1).padStart(2, "0"), o = String(r.getDate()).padStart(2, "0");
      return s + "-" + i + "-" + o;
    },
    toJSDate: function() {
      return r;
    }
  };
}
function sf(e, t) {
  return pn(e).plus({ days: t });
}
function lf(e) {
  return pn(e).weekday % 7;
}
function Tl(e, t) {
  var n = {};
  if (e == null || e === "") {
    for (var r = 0; r < 7; r++) n[r] = r;
    return n;
  }
  for (var s = Math.min(7, (Number(t) || 1) * 7), i = pn(e), o = 0; o < s; o++) {
    var l = lf(sf(i, o));
    n[l] == null && (n[l] = o);
  }
  return n;
}
function af(e) {
  if (e = e || window.Scheduler, !e) return;
  function t(i) {
    var o = String(i || "").trim();
    if (!o) return "";
    var l = o.match(/^(\d+)$/);
    return l && Number(l[1]) < 10 ? "0" + l[1] : o;
  }
  function n(i, o) {
    var l = (i.rdoDays || []).map(Number).filter(function(u) {
      return Number.isInteger(u) && u >= 0 && u <= 6;
    }), a = l.length ? l.map(function(u) {
      return o && o[u] != null ? o[u] : String(u);
    }).join(",") : "—";
    return i.rdoHard && (a += " (hard)"), a;
  }
  function r(i, o, l) {
    return l || "WORK";
  }
  function s(i, o) {
    return o === "TRAINING" ? "TRAINING" : o === "-" || o === "BAG" || o === "PAX" || o === "DFO" ? o : i.isTraining || i.trainingClass || i.empClass === "ESTI" || i.empClass === "MSTI" || i.extraName === "ESTI" || i.extraName === "MSTI" ? "TRAINING" : i.function === "BAG" ? "BAG" : i.function === "DFO" || i.function === "PAX" ? "PAX" : i.function === "-" ? "-" : o === "BAG" || o === "PAX" ? o : null;
  }
  e.lineToRowModel = function(i, o, l) {
    if (l = l || {}, !i || !o) return null;
    for (var a = l.dayNames || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], u = typeof l.teamResolver == "function" ? l.teamResolver(i.id) : null, c = typeof l.shiftResolver == "function" ? l.shiftResolver(i.shiftId) : null, y = i.shiftName || c && c.name || "", w = i.startTime || (c && c.start ? c.start : ""), v = i.endTime || (c && c.end ? c.end : ""), T = c && c.segments && c.segments.length === 2 ? c.segments[0].start + "–" + c.segments[0].end + " / " + c.segments[1].start + "–" + c.segments[1].end : w && v ? w + "–" + v : w || "WORK", O = i.shiftLabel || T, g = !!(i.isExtra || i.extraPositionId), F = g ? i.position || i.extraName || "TSO" : i.isStso || i.empClass === "STSO" ? "STSO" : i.isLtso || i.empClass === "LTSO" ? "LTSO" : "TSO", B = g ? i.empClass === "PT" ? "PT" : "FT" : F === "STSO" || F === "LTSO" ? "FT" : i.empClass === "PT" ? "PT" : "FT", P = i.paid || 0, d = Array.isArray(o) ? o : o[i.id] || o[String(i.id)] || [], p = Tl(
      l.startDate != null ? l.startDate : e.state && e.state.startDate,
      l.weekCount != null ? l.weekCount : e.state && e.state.weekCount
    ), S = [], m = [], D = [], I = [], N = 0, J = 0; J < 7; J++) {
      var Z = p[J];
      Z == null && (Z = J);
      var ie = i.dayTimes && i.dayTimes[String(J)], Ie = typeof l.effectiveTimesResolver == "function" ? l.effectiveTimesResolver(i.shiftId, J) : null, En = ie && ie.start || i.startTime || Ie && Ie.start || w, Dn = ie && ie.end || i.endTime || Ie && Ie.end || v;
      D.push(En), I.push(Dn);
      var fr = d[Z];
      if (fr === "WORK") {
        N += P;
        var An = typeof l.rotationDutyResolver == "function" ? l.rotationDutyResolver(i.id, Z) : null, be = r(i, An, O);
        S.push(be), m.push(s(i, An) || "PAX");
      } else
        S.push("RDO"), m.push("OFF");
    }
    return {
      id: i.id,
      teamId: u && u.id || "",
      shiftId: i.shiftId || "",
      team: t(u && (u.name || u.id) || ""),
      line: i.lineCode || "",
      shift: y,
      start: w,
      end: v,
      position: F,
      emp: B,
      sex: i.sex === "F" || i.sex === "M" ? i.sex : "",
      function: i.function || "",
      certPool: i.certPool || "",
      rdos: n(i, a),
      paid: P,
      days: S,
      dayDuties: m,
      dayStarts: D,
      dayEnds: I,
      hours: N
    };
  }, e.getRowModels = function(i, o, l) {
    return !Array.isArray(i) || !o || typeof o != "object" ? [] : i.map(function(a) {
      return e.lineToRowModel(a, o, l);
    }).filter(Boolean);
  }, e.getLineRowModels = function(i) {
    var o = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], l = e.state && e.state.schedule || {}, a = Object.assign({}, i || {});
    return !a.teamResolver && typeof e.teamMetaForLine == "function" && (a.teamResolver = e.teamMetaForLine), !a.shiftResolver && typeof e.getShift == "function" && (a.shiftResolver = e.getShift), !a.rotationDutyResolver && typeof e.getRotationDuty == "function" && (a.rotationDutyResolver = e.getRotationDuty), !a.effectiveTimesResolver && typeof e.getEffectiveShiftTimes == "function" && (a.effectiveTimesResolver = e.getEffectiveShiftTimes), e.getRowModels(o, l, a);
  };
}
function of(e) {
  if (e = e || window.Scheduler, !e) return;
  function t(l, a) {
    var u = e.getRotationDuty ? e.getRotationDuty(l.id, a) : null;
    return u || l.function || null;
  }
  e.dutyFor = t;
  function n(l) {
    if (l.shiftLabel) return l.shiftLabel;
    var a = e.getShift ? e.getShift(l.shiftId) : null;
    return a && a.start && a.end ? a.start + "–" + a.end : a && a.start ? a.start : "WORK";
  }
  function r(l) {
    if (!(!l || l.function !== "BAG")) {
      e.state.functionRotation || (e.state.functionRotation = {});
      var a = String(l.id);
      e.state.functionRotation[a] || (e.state.functionRotation[a] = []);
      for (var u = e.state.schedule && (e.state.schedule[l.id] || e.state.schedule[a]) || [], c = Math.max(u.length, (e.state.weekCount || 1) * 7), y = 0; y < c; y++) {
        for (; e.state.functionRotation[a].length <= y; ) e.state.functionRotation[a].push(null);
        u[y] === "WORK" && (e.state.functionRotation[a][y] = "BAG");
      }
    }
  }
  function s(l) {
    if (!(!l || l.function !== "DFO")) {
      e.state.functionRotation || (e.state.functionRotation = {});
      var a = String(l.id);
      e.state.functionRotation[a] || (e.state.functionRotation[a] = []);
      for (var u = e.state.schedule && (e.state.schedule[l.id] || e.state.schedule[a]) || [], c = Math.max(u.length, (e.state.weekCount || 1) * 7), y = 0; y < c; y++) {
        for (; e.state.functionRotation[a].length <= y; ) e.state.functionRotation[a].push(null);
        u[y] === "WORK" && (e.state.functionRotation[a][y] = "DFO");
      }
    }
  }
  function i() {
    var l = document.getElementById("lines-tbody"), a = l || document.querySelector(".lines-virtual-root");
    a && l && a.querySelectorAll("td.cell-toggle").forEach(function(u) {
      var c = e.findLineById ? e.findLineById(u.getAttribute("data-line-id")) : null, y = +u.getAttribute("data-day");
      if (!(!c || isNaN(y))) {
        var w = (e.state.schedule[c.id] || e.state.schedule[String(c.id)] || [])[y] || "RDO";
        if (u.style.background = "", u.style.color = "", w !== "WORK") {
          u.className = "cell-rdo cell-toggle", u.textContent = "RDO", u.style.background = "#000", u.style.color = "#fff", u.style.opacity = "1";
          return;
        }
        var v = t(c, y), T = v === "BAG" || v === "BAGS", O = v === "DFO", g = "";
        T ? g = " cell-function-duty cell-bag" : O && (g = " cell-function-duty cell-dfo"), u.className = "cell-work cell-toggle" + g, u.textContent = n(c);
      }
    });
  }
  e.paintLineColors = i;
  function o(l) {
    var a = e[l];
    if (!(typeof a != "function" || a._lineColorsWrapped)) {
      var u = function() {
        if (e.__USE_SVELTE_LINES) return a.apply(this, arguments);
        var c = a.apply(this, arguments);
        return setTimeout(i, 0), c;
      };
      u._lineColorsWrapped = !0, e[l] = u;
    }
  }
  o("renderLines"), o("renderAll"), o("generateFunctionAssignments"), e._lineColorsBound || (e._lineColorsBound = !0, document.addEventListener("change", function(l) {
    var a = l.target;
    if (!(!a || a.getAttribute("data-field") !== "function")) {
      var u = e.findLineById ? e.findLineById(a.getAttribute("data-line-id")) : null;
      u && (u.function = a.value === "DFO" || a.value === "PAX" || a.value === "BAG" || a.value === "TRAINING" || a.value === "-" ? a.value : "", u.function === "BAG" && r(u), u.function === "DFO" && s(u), e.renderLines ? e.renderLines() : i());
    }
  }));
}
function cf(e) {
  const t = e || window.Scheduler;
  if (!t) return;
  af(t), of(t);
  const n = document.getElementById("lines-table-root");
  if (!n) {
    console.warn("lines-table: #lines-table-root not found");
    return;
  }
  if (t.__USE_SVELTE_LINES === !1) {
    n.innerHTML = "", n.style.display = "none", t.renderLines && t.renderLines();
    return;
  }
  if (n._linesTableMounted) return;
  n._linesTableMounted = !0;
  function r() {
    return {
      teamResolver: typeof t.teamMetaForLine == "function" ? t.teamMetaForLine : null,
      shiftResolver: typeof t.getShift == "function" ? t.getShift : null,
      rotationDutyResolver: typeof t.getRotationDuty == "function" ? t.getRotationDuty : s,
      effectiveTimesResolver: typeof t.getEffectiveShiftTimes == "function" ? t.getEffectiveShiftTimes : null
    };
  }
  function s(d, p) {
    const S = String(d), m = t.state && t.state.functionRotation, D = m && (m[S] || m[d]);
    if (!Array.isArray(D)) return null;
    const I = D[p];
    return I === "BAG" ? "BAG" : I === "DFO" ? "DFO" : I === "PAX" ? "PAX" : I === "TRAINING" ? "TRAINING" : I === "-" ? "-" : null;
  }
  function i(d, p, S) {
    var m = String(d);
    for (t.state.functionRotation || (t.state.functionRotation = {}), t.state.functionRotation[m] || (t.state.functionRotation[m] = []); t.state.functionRotation[m].length <= p; ) t.state.functionRotation[m].push(null);
    t.state.functionRotation[m][p] = S;
  }
  function o(d) {
    var p = Tl(t.state && t.state.startDate, t.state && t.state.weekCount), S = p[d];
    return S ?? d;
  }
  function l(d) {
    if (!d) return !1;
    if (d.function === "DFO") return !0;
    const p = d.functionEligible;
    return !!(p && (p.dfo === !0 || p.DFO === !0));
  }
  function a() {
    const d = t.state && Array.isArray(t.state.lines) ? t.state.lines : [], p = typeof t.sortLinesForView == "function" && typeof t.filterLinesForView == "function" ? t.sortLinesForView(t.filterLinesForView(d)) : d, S = t.state && t.state.schedule || {}, m = typeof t.getRowModels == "function" ? t.getRowModels(p, S, r()) : typeof t.getLineRowModels == "function" ? t.getLineRowModels(r()) : [];
    return Array.isArray(m) ? m : [];
  }
  function u() {
    return t.teams && Array.isArray(t.teams.teams) ? t.teams.teams : [];
  }
  function c() {
    return t.state && Array.isArray(t.state.shifts) ? t.state.shifts : [];
  }
  function y() {
    return typeof t.getExportStyle == "function" ? t.getExportStyle() : t.state && t.state.exportStyle || null;
  }
  function w(d) {
    if (!d || typeof d.$set != "function") return;
    const p = a();
    typeof t.applyExportCssVars == "function" && t.applyExportCssVars(), d.$set({
      rows: Array.isArray(p) ? p : [],
      shiftOptions: c(),
      teamOptions: u(),
      exportStyle: y(),
      currentSortBy: t.linesView && t.linesView.sortBy || "role",
      currentSortDir: t.linesView && t.linesView.sortDir || "asc",
      filterRole: t.linesView && t.linesView.filterRole || "ALL",
      filterShift: t.linesView && t.linesView.filterShift || "",
      filterTeam: t.linesView && t.linesView.filterTeam || "",
      filterSex: t.linesView && t.linesView.filterSex || "",
      filterDuty: t.linesView && t.linesView.filterDuty || "",
      filterDay: t.linesView && t.linesView.filterDay || "",
      searchCode: t.linesView && t.linesView.searchCode || ""
    });
  }
  function v(d) {
    if (!d) return;
    const p = t.findLineById ? t.findLineById(d.lineId) : null;
    if (!p) return;
    const S = d.field, m = d.value;
    if (S === "lineCode")
      p.lineCode = String(m || "").trim() || p.lineCode;
    else if (S === "sex")
      p.sex = m === "F" ? "F" : "M";
    else if (S === "function")
      p.function = m === "DFO" || m === "PAX" || m === "BAG" || m === "TRAINING" || m === "-" ? m : "";
    else if (S === "certPool") {
      var D = String(m || "").trim().toUpperCase();
      p.certPool = D === "A" || D === "B" ? D : "";
    } else if (S === "emp")
      t.applyLineEmp && t.applyLineEmp(p, m);
    else if (S === "position") {
      var I = !!(p.isExtra || p.extraPositionId), N = String(m ?? "").trim();
      I ? (N && (p.position = N, p.extraName = N), p.isStso = !1, p.isLtso = !1) : t.applyLineEmp && t.applyLineEmp(p, N);
    } else if (S === "shift")
      t.applyLineShift && t.applyLineShift(p, m);
    else if (S === "team")
      t.setLineTeam && t.setLineTeam(d.lineId, m);
    else if (S === "start" || S === "end") {
      var J = String(m || "").trim();
      if (t.isValidTimeText && !t.isValidTimeText(J)) return;
      S === "start" && (p.startTime = J), S === "end" && (p.endTime = J);
      var Z = t.getShift ? t.getShift(p.shiftId) : null, ie = p.startTime || (Z ? Z.start : ""), Ie = p.endTime || (Z ? Z.end : "");
      p.shiftLabel = (ie || "") + "-" + (Ie || "");
    }
    t.updateStatus && t.updateStatus("Updated " + (p.lineCode || d.lineId)), P(), (S === "emp" || S === "position" || S === "shift" || S === "start" || S === "end") && t.renderCoverageBars && t.renderCoverageBars(), S === "team" && t.renderTeams && t.renderTeams(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function T(d) {
    if (!d) return;
    const p = t.findLineById ? t.findLineById(d.lineId) : null, S = Number(d.dayIndex);
    if (!p || !Number.isInteger(S) || S < 0 || S > 6) return;
    const m = o(S), D = String(p.id);
    t.state.schedule || (t.state.schedule = {});
    var I = t.state.schedule[D] || t.state.schedule[p.id];
    for (Array.isArray(I) || (I = []), t.state.schedule[D] = I; t.state.schedule[D].length < 7; ) t.state.schedule[D].push("RDO");
    t.state.functionRotation || (t.state.functionRotation = {}), !t.state.functionRotation[D] && t.state.functionRotation[p.id] && (t.state.functionRotation[D] = t.state.functionRotation[p.id]);
    const N = t.state.schedule[D][m] || "RDO", J = p.function === "BAG", Z = l(p);
    if (N !== "WORK")
      t.state.schedule[D][m] = "WORK", J ? i(D, m, "BAG") : Z ? i(D, m, "PAX") : i(D, m, null);
    else if (J)
      t.state.schedule[D][m] = "RDO", i(D, m, null);
    else if (Z) {
      var ie = typeof t.getRotationDuty == "function" ? t.getRotationDuty(p.id, m) : s(p.id, m), Ie = ie === "DFO" || ie === "PAX" || !ie ? "PAX" : ie;
      Ie === "PAX" ? i(D, m, "BAG") : (t.state.schedule[D][m] = "RDO", i(D, m, null));
    } else
      t.state.schedule[D][m] = "RDO", i(D, m, null);
    t.syncRdoDaysFromSchedule && t.syncRdoDaysFromSchedule(p), P(), t.renderCoverageBars && t.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function O(d) {
    if (!d) return;
    const p = t.findLineById ? t.findLineById(d.lineId) : null, S = Number(d.dayIndex), m = String(d.duty || "").toUpperCase();
    if (!p || !Number.isInteger(S) || S < 0 || S > 6) return;
    const D = o(S), I = String(p.id);
    t.state.schedule || (t.state.schedule = {}), Array.isArray(t.state.schedule[I]) || (t.state.schedule[I] = Array(7).fill("RDO")), m === "OFF" || m === "RDO" || m === "" ? (t.state.schedule[I][D] = "RDO", i(I, D, null)) : (t.state.schedule[I][D] = "WORK", m === "BAG" ? i(I, D, "BAG") : m === "DFO" ? i(I, D, "DFO") : m === "TRAINING" ? i(I, D, "TRAINING") : m === "-" ? i(I, D, "-") : i(I, D, "PAX")), t.syncRdoDaysFromSchedule && t.syncRdoDaysFromSchedule(p), P(), t.renderCoverageBars && t.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function g(d) {
    if (!d) return;
    const p = t.findLineById ? t.findLineById(d.lineId) : null, S = Number(d.dayIndex), m = d.field, D = String(d.value || "").trim();
    if (!(!p || !Number.isInteger(S) || S < 0 || S > 6) && !(t.isValidTimeText && !t.isValidTimeText(D))) {
      var I = t.getShift ? t.getShift(p.shiftId) : null, N = p.startTime || (I ? I.start : "08:00"), J = p.endTime || (I ? I.end : "16:30");
      p.dayTimes || (p.dayTimes = {});
      var Z = String(S), ie = p.dayTimes[Z] || { start: N, end: J };
      m === "start" ? p.dayTimes[Z] = { start: D, end: ie.end } : m === "end" && (p.dayTimes[Z] = { start: ie.start, end: D }), P(), t.renderCoverageBars && t.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
    }
  }
  function F(d) {
    d && (t.linesView || (t.linesView = {}), d.sortBy && (t.linesView.sortBy = d.sortBy), d.sortDir && (t.linesView.sortDir = d.sortDir), P());
  }
  function B(d) {
    d && (t.linesView || (t.linesView = {}), d.filterRole !== void 0 && (t.linesView.filterRole = d.filterRole), d.filterShift !== void 0 && (t.linesView.filterShift = d.filterShift), d.filterTeam !== void 0 && (t.linesView.filterTeam = d.filterTeam), d.filterSex !== void 0 && (t.linesView.filterSex = d.filterSex), d.filterDuty !== void 0 && (t.linesView.filterDuty = d.filterDuty), d.filterDay !== void 0 && (t.linesView.filterDay = d.filterDay), d.searchCode !== void 0 && (t.linesView.searchCode = d.searchCode), P());
  }
  const P = () => {
    try {
      const d = n._linesTableApp;
      if (d)
        w(d);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const p = a();
        typeof t.applyExportCssVars == "function" && t.applyExportCssVars(), n._linesTableApp = new nf({
          target: n,
          props: {
            rows: Array.isArray(p) ? p : [],
            shiftOptions: c(),
            teamOptions: u(),
            exportStyle: y(),
            currentSortBy: t.linesView && t.linesView.sortBy || "role",
            currentSortDir: t.linesView && t.linesView.sortDir || "asc",
            filterRole: t.linesView && t.linesView.filterRole || "ALL",
            filterShift: t.linesView && t.linesView.filterShift || "",
            filterTeam: t.linesView && t.linesView.filterTeam || "",
            filterSex: t.linesView && t.linesView.filterSex || "",
            filterDuty: t.linesView && t.linesView.filterDuty || "",
            filterDay: t.linesView && t.linesView.filterDay || "",
            searchCode: t.linesView && t.linesView.searchCode || "",
            onInlineEdit: v,
            onDayToggle: T,
            onDayDutyEdit: O,
            onDayTimeEdit: g,
            onSort: F,
            onFilter: B
          }
        });
      }
    } catch (d) {
      console.error("lines-table: refresh failed", d);
    }
  };
  P(), t.bindLinesUI && t.bindLinesUI(), document.addEventListener("click", (d) => {
    const p = d.target.closest?.(".tab-btn");
    p && p.dataset.tab === "lines" && P();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((d) => {
    window.addEventListener(d, P);
  }), n.refresh = P;
}
export {
  cf as initLinesTable
};
