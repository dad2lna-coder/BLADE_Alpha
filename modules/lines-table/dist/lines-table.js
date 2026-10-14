var Da = Object.defineProperty;
var gl = (e) => {
  throw TypeError(e);
};
var Ra = (e, t, n) => t in e ? Da(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Se = (e, t, n) => Ra(e, typeof t != "symbol" ? t + "" : t, n), di = (e, t, n) => t.has(e) || gl("Cannot " + n);
var u = (e, t, n) => (di(e, t, "read from private field"), n ? n.call(e) : t.get(e)), N = (e, t, n) => t.has(e) ? gl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), C = (e, t, n, s) => (di(e, t, "write to private field"), s ? s.call(e, n) : t.set(e, n), n), F = (e, t, n) => (di(e, t, "access private method"), n);
const Ca = "5";
var zl;
typeof window < "u" && ((zl = window.__svelte ?? (window.__svelte = {})).v ?? (zl.v = /* @__PURE__ */ new Set())).add(Ca);
const Fa = 1, Ma = 2, Pl = 4, La = 8, ka = 16, Na = 1, qa = 4, za = 8, Pa = 16, Va = 1, Ba = 2, Vl = "[", zi = "[!", ml = "[?", Pi = "]", Mt = {}, re = Symbol("uninitialized"), ja = "http://www.w3.org/1999/xhtml", Bl = !1;
var Ys = Array.isArray, Wa = Array.prototype.indexOf, ts = Array.prototype.includes, Js = Array.from, Vi = Object.defineProperty, cn = Object.getOwnPropertyDescriptor, Ga = Object.getOwnPropertyDescriptors, Ha = Object.prototype, Ka = Array.prototype, jl = Object.getPrototypeOf, yl = Object.isExtensible;
const Jt = () => {
};
function Wl(e) {
  for (var t = 0; t < e.length; t++)
    e[t]();
}
function Gl() {
  var e, t, n = new Promise((s, r) => {
    e = s, t = r;
  });
  return { promise: n, resolve: e, reject: t };
}
const ue = 2, Tn = 4, Zs = 8, Bi = 1 << 24, We = 16, Xe = 32, Lt = 64, Si = 128, ji = 256, Ke = 512, ie = 1024, te = 2048, qe = 4096, de = 8192, le = 16384, tn = 32768, zs = 1 << 25, En = 65536, Ps = 1 << 17, Ua = 1 << 18, In = 1 << 19, Xa = 1 << 20, st = 1 << 25, Vs = 1 << 21, dn = 1 << 22, Ft = 1 << 23, hn = Symbol("$state"), Hl = Symbol("component"), Kl = Symbol("legacy props"), Ya = Symbol(""), Ls = Symbol("attributes"), Ti = Symbol("class"), Ei = Symbol("style"), Hn = Symbol("text"), Zn = Symbol("form reset"), cs = new class extends Error {
  constructor() {
    super(...arguments);
    Se(this, "name", "StaleReactionError");
    Se(this, "message", "The reaction that called `getAbortSignal()` was re-run or destroyed");
  }
}(), Ul = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml")
), Qs = 3, ds = 8;
function Ja() {
  console.warn("https://svelte.dev/e/derived_inert");
}
function $s(e) {
  console.warn("https://svelte.dev/e/hydration_mismatch");
}
function Za() {
  console.warn("https://svelte.dev/e/select_multiple_invalid_value");
}
function Qa() {
  console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
let H = !1;
function gt(e) {
  H = e;
}
let U;
function ye(e) {
  if (e === null)
    throw $s(), Mt;
  return U = e;
}
function er() {
  return ye(/* @__PURE__ */ ot(U));
}
function M(e) {
  if (H) {
    if (/* @__PURE__ */ ot(U) !== null)
      throw $s(), Mt;
    U = e;
  }
}
function Xl(e = 1) {
  if (H) {
    for (var t = e, n = U; t--; )
      n = /** @type {TemplateNode} */
      /* @__PURE__ */ ot(n);
    U = n;
  }
}
function Bs(e = !0) {
  for (var t = 0, n = U; ; ) {
    if (n.nodeType === ds) {
      var s = (
        /** @type {Comment} */
        n.data
      );
      if (s === Pi) {
        if (t === 0) return n;
        t -= 1;
      } else (s === Vl || s === zi || // "[1", "[2", etc. for if blocks
      s[0] === "[" && !isNaN(Number(s.slice(1)))) && (t += 1);
    }
    var r = (
      /** @type {TemplateNode} */
      /* @__PURE__ */ ot(n)
    );
    e && n.remove(), n = r;
  }
}
function Wi(e) {
  if (!e || e.nodeType !== ds)
    throw $s(), Mt;
  return (
    /** @type {Comment} */
    e.data
  );
}
function Yl(e) {
  return e === this.v;
}
function Jl(e, t) {
  return e != e ? t == t : e !== t || e !== null && typeof e == "object" || typeof e == "function";
}
function Zl(e) {
  return !Jl(e, this.v);
}
function $a() {
  throw new Error("https://svelte.dev/e/async_derived_orphan");
}
function ef(e, t, n) {
  throw new Error("https://svelte.dev/e/each_key_duplicate");
}
function tf(e) {
  throw new Error("https://svelte.dev/e/effect_in_teardown");
}
function nf() {
  throw new Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function sf(e) {
  throw new Error("https://svelte.dev/e/effect_orphan");
}
function rf() {
  throw new Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function lf() {
  throw new Error("https://svelte.dev/e/hydration_failed");
}
function of(e) {
  throw new Error("https://svelte.dev/e/props_invalid_value");
}
function af() {
  throw new Error("https://svelte.dev/e/state_descriptors_fixed");
}
function ff() {
  throw new Error("https://svelte.dev/e/state_prototype_fixed");
}
function uf() {
  throw new Error("https://svelte.dev/e/state_unsafe_mutation");
}
function cf() {
  throw new Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
let df = !1, be = null;
function An(e) {
  be = e;
}
function Ql(e, t = !1, n) {
  be = {
    p: be,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: (
      /** @type {Effect} */
      W
    ),
    l: null
  };
}
function $l(e) {
  var t = (
    /** @type {ComponentContext} */
    be
  ), n = t.e;
  if (n !== null) {
    t.e = null;
    for (var s of n)
      xo(s);
  }
  return t.i = !0, be = t.p, eo(e);
}
function eo(e = {}) {
  return Vi(e, Hl, { value: !0 }), e;
}
function to() {
  return !0;
}
let jt = [];
function no() {
  var e = jt;
  jt = [], Wl(e);
}
function mt(e) {
  if (jt.length === 0 && !Qn) {
    var t = jt;
    queueMicrotask(() => {
      t === jt && no();
    });
  }
  jt.push(e);
}
function hf() {
  for (; jt.length > 0; )
    no();
}
const vf = -7169;
function ee(e, t) {
  e.f = e.f & vf | t;
}
function Gi(e) {
  e.f & Ke || e.deps === null ? ee(e, ie) : ee(e, qe);
}
function so(e, t, n) {
  e.f & te ? t.add(e) : e.f & qe && n.add(e), ee(e, ie);
}
let bl = !1;
function ro() {
  bl || (bl = !0, document.addEventListener(
    "reset",
    (e) => {
      Promise.resolve().then(() => {
        if (!e.defaultPrevented)
          for (
            const t of
            /**@type {HTMLFormElement} */
            e.target.elements
          )
            t[Zn]?.();
      });
    },
    // In the capture phase to guarantee we get noticed of it (no possibility of stopPropagation)
    { capture: !0 }
  ));
}
function hs(e) {
  var t = V, n = W;
  ze(null), lt(null);
  try {
    return e();
  } finally {
    ze(t), lt(n);
  }
}
function io(e, t, n, s = n) {
  e.addEventListener(t, () => hs(n));
  const r = (
    /** @type {any} */
    e[Zn]
  );
  r ? e[Zn] = () => {
    r(), s(!0);
  } : e[Zn] = () => s(!0), ro();
}
function _f(e, t, n, s) {
  const r = ns;
  var i = e.filter((h) => !h.settled), l = t.map(r);
  if (n.length === 0 && i.length === 0) {
    s(l);
    return;
  }
  var o = (
    /** @type {Effect} */
    W
  ), a = pf(), f = i.length === 1 ? i[0].promise : i.length > 1 ? Promise.all(i.map((h) => h.promise)) : null;
  function c(h) {
    if (!(o.f & le)) {
      a();
      try {
        s([...l, ...h]);
      } catch (p) {
        nt(p, o);
      }
      js();
    }
  }
  var d = lo();
  if (n.length === 0) {
    f.then(() => c([])).finally(d);
    return;
  }
  function y() {
    Promise.all(n.map((h) => /* @__PURE__ */ gf(h))).then(c).catch((h) => nt(h, o)).finally(d);
  }
  f ? f.then(() => {
    if (o.f & le) {
      d();
      return;
    }
    a(), y(), js();
  }) : y();
}
function pf() {
  var e = (
    /** @type {Effect} */
    W
  ), t = V, n = be, s = (
    /** @type {Batch} */
    q
  );
  return function(i = !0) {
    lt(e), ze(t), An(n), i && !(e.f & le) && (s?.activate(), s?.apply());
  };
}
function js(e = !0) {
  lt(null), ze(null), An(null), e && q?.deactivate();
}
function lo() {
  var e = (
    /** @type {Effect} */
    W
  ), t = e.b, n = (
    /** @type {Batch} */
    q
  ), s = !!t?.is_rendered();
  return t?.update_pending_count(1, n), n.increment(s, e), () => {
    t?.update_pending_count(-1, n), n.decrement(s, e);
  };
}
// @__NO_SIDE_EFFECTS__
function ns(e) {
  var t = ue | te;
  return W !== null && (W.f |= In), {
    ctx: be,
    deps: null,
    effects: null,
    equals: Yl,
    f: t,
    fn: e,
    reactions: null,
    rv: 0,
    v: (
      /** @type {V} */
      re
    ),
    wv: 0,
    parent: W,
    ac: null
  };
}
const Kn = Symbol("obsolete");
// @__NO_SIDE_EFFECTS__
function gf(e, t, n) {
  let s = (
    /** @type {Effect | null} */
    W
  );
  s === null && $a();
  var r = (
    /** @type {Promise<V>} */
    /** @type {unknown} */
    void 0
  ), i = en(
    /** @type {V} */
    re
  ), l = !V, o = /* @__PURE__ */ new Set();
  return Rf(() => {
    var a = (
      /** @type {Effect} */
      W
    ), f = Gl();
    r = f.promise;
    try {
      Promise.resolve(e()).then(f.resolve, (h) => {
        h !== cs && f.reject(h);
      }).finally(js);
    } catch (h) {
      f.reject(h), js();
    }
    var c = (
      /** @type {Batch} */
      q
    );
    if (l) {
      if (a.f & tn)
        var d = lo();
      if (
        // boundary can be null if the async derived is inside an $effect.root not connected to the component render tree
        s.b?.is_rendered()
      )
        c.async_deriveds.get(a)?.reject(Kn);
      else
        for (const h of o.values())
          h.reject(Kn);
      o.add(f), c.async_deriveds.set(a, f);
    }
    const y = (h, p = void 0) => {
      d?.(), o.delete(f), p !== Kn && (c.activate(), p ? (i.f |= Ft, On(i, p)) : (i.f & Ft && (i.f ^= Ft), On(i, h)), c.deactivate());
    };
    f.promise.then(y, (h) => y(null, h || "unknown"));
  }), Oo(() => {
    for (const a of o)
      a.reject(Kn);
  }), new Promise((a) => {
    function f(c) {
      function d() {
        c === r ? a(i) : f(r);
      }
      c.then(d, d);
    }
    f(r);
  });
}
// @__NO_SIDE_EFFECTS__
function nn(e) {
  const t = /* @__PURE__ */ ns(e);
  return Lo(t), t;
}
// @__NO_SIDE_EFFECTS__
function oo(e) {
  const t = /* @__PURE__ */ ns(e);
  return t.equals = Zl, t;
}
function mf(e) {
  var t = e.effects;
  if (t !== null) {
    e.effects = null;
    for (var n = 0; n < t.length; n += 1)
      he(
        /** @type {Effect} */
        t[n]
      );
  }
}
function Hi(e) {
  var t, n = W, s = e.parent;
  if (!yt && s !== null && e.v !== re && // if it was never evaluated before, it's guaranteed to fail downstream, so we try to execute instead
  s.f & (le | de))
    return Ja(), e.v;
  lt(s);
  try {
    mf(e), t = zo(e);
  } finally {
    lt(n);
  }
  return t;
}
function ao(e) {
  var t = Hi(e);
  if (!e.equals(t) && (e.wv = No(), (!q?.is_fork || e.deps === null) && (q !== null ? (q.capture(e, t, !0), vn?.capture(e, t, !0)) : e.v = t, e.deps === null))) {
    ee(e, ie);
    return;
  }
  yt || (Ge !== null ? (tr() || q?.is_fork) && Ge.set(e, t) : Gi(e));
}
function yf(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && hs(() => {
        t.ac.abort(cs), t.ac = null;
      }), t.fn !== null && (t.teardown = Jt), ss(t, 0), Ji(t));
}
function fo(e) {
  if (e.effects !== null)
    for (const t of e.effects)
      t.teardown && t.fn !== null && xn(t);
}
let hi = null, sn = null, q = null, vn = null, Ge = null, Ai = null, Qn = !1, vi = !1, $n = null, ks = null;
var wl = 0;
let bf = 1;
var pn, Rt, Ht, gn, mn, yn, ht, bn, Ae, is, vt, Ve, $e, wn, Kt, K, Oi, xi, Un, Ii, uo, co, fn, wf, Xn;
const Ks = class Ks {
  constructor() {
    N(this, K);
    Se(this, "id", bf++);
    /** True as soon as `#process` was called */
    N(this, pn, !1);
    Se(this, "linked", !0);
    /** @type {Batch | null} */
    N(this, Rt, null);
    /** @type {Batch | null} */
    N(this, Ht, null);
    /** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
    Se(this, "async_deriveds", /* @__PURE__ */ new Map());
    /**
     * The current values of any signals that are updated in this batch.
     * Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
     * They keys of this map are identical to `this.#previous`
     * @type {Map<Value, [any, boolean]>}
     */
    Se(this, "current", /* @__PURE__ */ new Map());
    /**
     * The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
     * They keys of this map are identical to `this.#current`
     * @type {Map<Value, any>}
     */
    Se(this, "previous", /* @__PURE__ */ new Map());
    /**
     * When the batch is committed (and the DOM is updated), we need to remove old branches
     * and append new ones by calling the functions added inside (if/each/key/etc) blocks
     * @type {Set<(batch: Batch) => void>}
     */
    N(this, gn, /* @__PURE__ */ new Set());
    /**
     * If a fork is discarded, we need to destroy any effects that are no longer needed
     * @type {Set<(batch: Batch) => void>}
     */
    N(this, mn, /* @__PURE__ */ new Set());
    /**
     * The number of async effects that are currently in flight
     */
    N(this, yn, 0);
    /**
     * Async effects that are currently in flight, _not_ inside a pending boundary
     * @type {Map<Effect, number>}
     */
    N(this, ht, /* @__PURE__ */ new Map());
    /**
     * A deferred that resolves when the batch is committed, used with `settled()`
     * TODO replace with Promise.withResolvers once supported widely enough
     * @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
     */
    N(this, bn, null);
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
    N(this, Ae, []);
    /**
     * Effects created while this batch was active.
     * @type {Effect[]}
     */
    N(this, is, []);
    /**
     * Deferred effects (which run after async work has completed) that are DIRTY
     * @type {Set<Effect>}
     */
    N(this, vt, /* @__PURE__ */ new Set());
    /**
     * Deferred effects that are MAYBE_DIRTY
     * @type {Set<Effect>}
     */
    N(this, Ve, /* @__PURE__ */ new Set());
    /**
     * A map of branches that still exist, but will be destroyed when this batch
     * is committed — we skip over these during `process`.
     * The value contains child effects that were dirty/maybe_dirty before being reset,
     * so they can be rescheduled if the branch survives.
     * @type {Map<Effect, { d: Effect[], m: Effect[] }>}
     */
    N(this, $e, /* @__PURE__ */ new Map());
    /**
     * Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
     * @type {Set<Effect>}
     */
    N(this, wn, /* @__PURE__ */ new Set());
    Se(this, "is_fork", !1);
    N(this, Kt, !1);
    sn === null ? hi = sn = this : (C(sn, Ht, this), C(this, Rt, sn)), sn = this;
  }
  /**
   * Add an effect to the #skipped_branches map and reset its children
   * @param {Effect} effect
   */
  skip_effect(t) {
    u(this, $e).has(t) || u(this, $e).set(t, { d: [], m: [] }), u(this, wn).delete(t);
  }
  /**
   * Remove an effect from the #skipped_branches map and reschedule
   * any tracked dirty/maybe_dirty child effects
   * @param {Effect} effect
   * @param {(e: Effect) => void} callback
   */
  unskip_effect(t, n = (s) => this.schedule(s)) {
    var s = u(this, $e).get(t);
    if (s) {
      u(this, $e).delete(t);
      for (var r of s.d)
        ee(r, te), n(r);
      for (r of s.m)
        ee(r, qe), n(r);
    }
    u(this, wn).add(t);
  }
  /**
   * Associate a change to a given source with the current
   * batch, noting its previous and current values
   * @param {Value} source
   * @param {any} value
   * @param {boolean} [is_derived]
   */
  capture(t, n, s = !1) {
    t.v !== re && !this.previous.has(t) && this.previous.set(t, t.v), t.f & Ft || (this.current.set(t, [n, s]), Ge?.set(t, n)), this.is_fork || (t.v = n);
  }
  activate() {
    q = this;
  }
  deactivate() {
    q = null, Ge = null;
  }
  flush() {
    try {
      vi = !0, q = this, F(this, K, Un).call(this);
    } finally {
      wl = 0, Ai = null, $n = null, ks = null, vi = !1, q = null, Ge = null, rt.clear();
    }
  }
  discard() {
    for (const t of u(this, mn)) t(this);
    u(this, mn).clear();
    for (const t of this.async_deriveds.values())
      t.reject(Kn);
    F(this, K, Xn).call(this), u(this, bn)?.resolve();
  }
  /**
   * @param {Effect} effect
   */
  register_created_effect(t) {
    u(this, is).push(t);
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  increment(t, n) {
    if (C(this, yn, u(this, yn) + 1), t) {
      let s = u(this, ht).get(n) ?? 0;
      u(this, ht).set(n, s + 1);
    }
  }
  /**
   * @param {boolean} blocking
   * @param {Effect} effect
   */
  decrement(t, n) {
    if (C(this, yn, u(this, yn) - 1), t) {
      let s = u(this, ht).get(n) ?? 0;
      s === 1 ? u(this, ht).delete(n) : u(this, ht).set(n, s - 1);
    }
    u(this, Kt) || (C(this, Kt, !0), mt(() => {
      C(this, Kt, !1), this.linked && this.flush();
    }));
  }
  /**
   * @param {Set<Effect>} dirty_effects
   * @param {Set<Effect>} maybe_dirty_effects
   */
  transfer_effects(t, n) {
    for (const s of t)
      u(this, vt).add(s);
    for (const s of n)
      u(this, Ve).add(s);
    t.clear(), n.clear();
  }
  /** @param {(batch: Batch) => void} fn */
  oncommit(t) {
    u(this, gn).add(t);
  }
  /** @param {(batch: Batch) => void} fn */
  ondiscard(t) {
    u(this, mn).add(t);
  }
  settled() {
    return (u(this, bn) ?? C(this, bn, Gl())).promise;
  }
  static ensure() {
    if (q === null) {
      const t = q = new Ks();
      !vi && !Qn && mt(() => {
        u(t, pn) || t.flush();
      });
    }
    return q;
  }
  apply() {
    {
      Ge = null;
      return;
    }
  }
  /**
   *
   * @param {Effect} effect
   */
  schedule(t) {
    if (Ai = t, t.b?.is_pending && t.f & (Tn | Zs | Bi) && !(t.f & tn)) {
      t.b.defer_effect(t);
      return;
    }
    u(this, Ae).push(t);
  }
};
pn = new WeakMap(), Rt = new WeakMap(), Ht = new WeakMap(), gn = new WeakMap(), mn = new WeakMap(), yn = new WeakMap(), ht = new WeakMap(), bn = new WeakMap(), Ae = new WeakMap(), is = new WeakMap(), vt = new WeakMap(), Ve = new WeakMap(), $e = new WeakMap(), wn = new WeakMap(), Kt = new WeakMap(), K = new WeakSet(), Oi = function() {
  if (this.is_fork) return !0;
  for (const s of u(this, ht).keys()) {
    for (var t = s, n = !1; t.parent !== null; ) {
      if (u(this, $e).has(t)) {
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
xi = function() {
  var t = [];
  for (const i of u(this, Ae))
    if (!(i.f & le || !(i.f & (te | qe)))) {
      for (var n = i, s = !1; n.parent !== null; ) {
        n = n.parent;
        var r = n.f;
        if (r & (Lt | Xe)) {
          if (!(r & ie)) {
            s = !0;
            break;
          }
          n.f ^= ie;
        }
      }
      s || t.push(n);
    }
  return C(this, Ae, []), t;
}, Un = function() {
  var o, a, f;
  C(this, pn, !0);
  for (const c of u(this, vt))
    u(this, Ve).delete(c), ee(c, te), this.schedule(c);
  for (const c of u(this, Ve))
    ee(c, qe), this.schedule(c);
  this.apply();
  for (var t = $n = [], n = [], s = ks = []; u(this, Ae).length > 0; ) {
    wl++ > 1e3 && (F(this, K, Xn).call(this), Sf());
    for (const c of F(this, K, xi).call(this))
      try {
        F(this, K, Ii).call(this, c, t, n);
      } catch (d) {
        throw po(c), F(this, K, Oi).call(this) || this.discard(), d;
      }
  }
  if (q = null, s.length > 0) {
    var r = Ks.ensure();
    for (const c of s)
      r.schedule(c);
  }
  if ($n = null, ks = null, F(this, K, Oi).call(this)) {
    F(this, K, fn).call(this, n), F(this, K, fn).call(this, t);
    for (const [c, d] of u(this, $e))
      _o(c, d);
    s.length > 0 && /** @type {unknown} */
    F(o = q, K, Un).call(o);
    return;
  }
  const i = F(this, K, uo).call(this);
  if (i) {
    F(this, K, fn).call(this, n), F(this, K, fn).call(this, t), F(a = i, K, co).call(a, this);
    return;
  }
  u(this, vt).clear(), u(this, Ve).clear();
  for (const c of u(this, gn)) c(this);
  u(this, gn).clear(), vn = this, Sl(n), Sl(t), vn = null, u(this, bn)?.resolve();
  var l = (
    /** @type {Batch | null} */
    /** @type {unknown} */
    q
  );
  if (u(this, yn) === 0 && (u(this, Ae).length === 0 || l !== null) && F(this, K, Xn).call(this), u(this, Ae).length > 0)
    if (l !== null) {
      for (const c of u(this, Ae))
        u(l, Ae).push(c);
      C(this, Ae, []);
    } else
      l = this;
  l !== null && (rt.clear(), F(f = l, K, Un).call(f));
}, /**
 * Traverse the effect tree, executing effects or stashing
 * them for later execution as appropriate
 * @param {Effect} root
 * @param {Effect[]} effects
 * @param {Effect[]} render_effects
 */
Ii = function(t, n, s) {
  t.f ^= ie;
  for (var r = t.first; r !== null; ) {
    var i = r.f, l = (i & (Xe | Lt)) !== 0, o = l && (i & ie) !== 0, a = o || (i & de) !== 0 || u(this, $e).has(r);
    if (!a && r.fn !== null) {
      l ? r.f ^= ie : i & Tn ? n.push(r) : vs(r) && (i & We && u(this, Ve).add(r), xn(r));
      var f = r.first;
      if (f !== null) {
        r = f;
        continue;
      }
    }
    for (; r !== null; ) {
      var c = r.next;
      if (c !== null) {
        r = c;
        break;
      }
      r = r.parent;
    }
  }
}, uo = function() {
  for (var t = u(this, Rt); t !== null; ) {
    if (!t.is_fork) {
      for (const [n, [, s]] of this.current)
        if (t.current.has(n) && !s)
          return t;
    }
    t = u(t, Rt);
  }
  return null;
}, /**
 * @param {Batch} batch
 */
co = function(t) {
  var s;
  for (const [r, i] of t.current)
    !this.previous.has(r) && t.previous.has(r) && this.previous.set(r, t.previous.get(r)), this.current.set(r, i);
  for (const [r, i] of t.async_deriveds) {
    const l = this.async_deriveds.get(r);
    l && i.promise.then(l.resolve).catch(l.reject);
  }
  t.async_deriveds.clear(), this.transfer_effects(u(t, vt), u(t, Ve));
  const n = (r) => {
    var i = r.reactions;
    if (i !== null && !(r.f & ue && !(r.f & (te | qe))))
      for (const a of i) {
        var l = a.f;
        if (l & ue)
          n(
            /** @type {Derived} */
            a
          );
        else {
          var o = (
            /** @type {Effect} */
            a
          );
          l & (dn | We) && !this.async_deriveds.has(o) && (u(this, Ve).delete(o), ee(o, te), this.schedule(o));
        }
      }
  };
  for (const r of this.current.keys())
    n(r);
  this.oncommit(() => t.discard()), F(s = t, K, Xn).call(s), q = this, F(this, K, Un).call(this);
}, /**
 * @param {Effect[]} effects
 */
fn = function(t) {
  for (var n = 0; n < t.length; n += 1)
    so(t[n], u(this, vt), u(this, Ve));
}, wf = function() {
  var d, y;
  for (let h = hi; h !== null; h = u(h, Ht)) {
    var t = h.id < this.id, n = [];
    for (const [p, [w, g]] of this.current) {
      if (h.current.has(p)) {
        var s = (
          /** @type {[any, boolean]} */
          h.current.get(p)[0]
        );
        if (t && w !== s)
          h.current.set(p, [w, g]);
        else
          continue;
      }
      n.push(p);
    }
    if (t)
      for (const [p, w] of this.async_deriveds) {
        const g = h.async_deriveds.get(p);
        g && w.promise.then(g.resolve).catch(g.reject);
      }
    var r = [...h.current.keys()].filter(
      (p) => !/** @type {[any, boolean]} */
      h.current.get(p)[1]
    );
    if (!(!u(h, pn) || r.length === 0)) {
      var i = r.filter((p) => !this.current.has(p));
      if (i.length === 0)
        t && h.discard();
      else if (n.length > 0) {
        if (t)
          for (const p of u(this, wn))
            h.unskip_effect(p, (w) => {
              var g;
              w.f & (We | dn) ? h.schedule(w) : F(g = h, K, fn).call(g, [w]);
            });
        h.activate();
        var l = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Map();
        for (var a of n)
          vo(a, i, l, o);
        o = /* @__PURE__ */ new Map();
        var f = [...h.current].filter(([p, w]) => {
          const g = this.current.get(p);
          return g ? g[0] !== w[0] || g[1] !== w[1] : !0;
        }).map(([p]) => p);
        if (f.length > 0)
          for (const p of u(this, is))
            !(p.f & (le | de | Ps)) && Ki(p, f, o) && (p.f & (dn | We) ? (ee(p, te), h.schedule(p)) : u(h, vt).add(p));
        if (u(h, Ae).length > 0 && !u(h, Kt)) {
          h.apply();
          for (var c of F(d = h, K, xi).call(d))
            F(y = h, K, Ii).call(y, c, [], []);
        }
        h.deactivate();
      }
    }
  }
}, Xn = function() {
  if (this.linked) {
    var t = u(this, Rt), n = u(this, Ht);
    t === null ? hi = n : C(t, Ht, n), n === null ? sn = t : C(n, Rt, t), this.linked = !1;
  }
};
let $t = Ks;
function ho(e) {
  var t = Qn, n = vn;
  vn = null, Qn = !0;
  try {
    for (var s; ; ) {
      if (hf(), q === null)
        return (
          /** @type {T} */
          s
        );
      q.flush();
    }
  } finally {
    Qn = t, vn = n;
  }
}
function Sf() {
  try {
    rf();
  } catch (e) {
    nt(e, Ai);
  }
}
let dt = null;
function Sl(e) {
  var t = e.length;
  if (t !== 0) {
    for (var n = 0; n < t; ) {
      var s = e[n++];
      if (!(s.f & (le | de)) && vs(s) && (dt = /* @__PURE__ */ new Set(), xn(s), s.deps === null && s.first === null && s.nodes === null && s.teardown === null && s.ac === null && Co(s), dt?.size > 0)) {
        rt.clear();
        for (const r of dt) {
          if (r.f & (le | de)) continue;
          const i = [r];
          let l = r.parent;
          for (; l !== null; )
            dt.has(l) && (dt.delete(l), i.push(l)), l = l.parent;
          for (let o = i.length - 1; o >= 0; o--) {
            const a = i[o];
            a.f & (le | de) || xn(a);
          }
        }
        dt.clear();
      }
    }
    dt = null;
  }
}
function vo(e, t, n, s) {
  if (!n.has(e) && (n.add(e), e.reactions !== null))
    for (const r of e.reactions) {
      const i = r.f;
      i & ue ? vo(
        /** @type {Derived} */
        r,
        t,
        n,
        s
      ) : i & (dn | We) && !(i & te) && Ki(r, t, s) && (ee(r, te), Ui(
        /** @type {Effect} */
        r
      ));
    }
}
function Ki(e, t, n) {
  const s = n.get(e);
  if (s !== void 0) return s;
  if (e.deps !== null)
    for (const r of e.deps) {
      if (ts.call(t, r))
        return !0;
      if (r.f & ue && Ki(
        /** @type {Derived} */
        r,
        t,
        n
      ))
        return n.set(
          /** @type {Derived} */
          r,
          !0
        ), !0;
    }
  return n.set(e, !1), !1;
}
function Ui(e) {
  q.schedule(e);
}
function _o(e, t) {
  if (!(e.f & Xe && e.f & ie)) {
    e.f & te ? t.d.push(e) : e.f & qe && t.m.push(e), ee(e, ie);
    for (var n = e.first; n !== null; )
      _o(n, t), n = n.next;
  }
}
function po(e) {
  ee(e, ie);
  for (var t = e.first; t !== null; )
    po(t), t = t.next;
}
let Ws = /* @__PURE__ */ new Set();
const rt = /* @__PURE__ */ new Map();
let go = !1;
function en(e, t) {
  var n = {
    f: 0,
    // TODO ideally we could skip this altogether, but it causes type errors
    v: e,
    reactions: null,
    equals: Yl,
    rv: 0,
    wv: 0
  };
  return n;
}
// @__NO_SIDE_EFFECTS__
function ct(e, t) {
  const n = en(e);
  return Lo(n), n;
}
// @__NO_SIDE_EFFECTS__
function mo(e, t = !1, n = !0) {
  const s = en(e);
  return t || (s.equals = Zl), s;
}
function je(e, t, n = !1) {
  V !== null && // since we are untracking the function inside `$inspect.with` we need to add this check
  // to ensure we error if state is set inside an inspect effect
  (!He || V.f & Ps) && to() && V.f & (ue | We | dn | Ps) && (it === null || !it.has(e)) && uf();
  let s = n ? un(t) : t;
  return On(e, s, ks);
}
var Bt = null, Di = 0;
function On(e, t, n = null) {
  if (!e.equals(t)) {
    yt ? rt.set(e, t) : rt.has(e) || rt.set(e, e.v);
    var s = $t.ensure();
    if (s.capture(e, t), e.f & ue) {
      const r = (
        /** @type {Derived} */
        e
      );
      e.f & te && Hi(r), Ge === null && Gi(r);
    }
    e.wv = No(), Bt = null, Di = 0, yo(e, te, n), Bt = null, W !== null && W.f & ie && !(W.f & (Xe | Lt)) && (Le === null ? Lf([e]) : Le.push(e)), !s.is_fork && Ws.size > 0 && !go && Tf();
  }
  return t;
}
function Tf() {
  go = !1;
  for (const e of Ws) {
    e.f & ie && ee(e, qe);
    let t;
    try {
      t = vs(e);
    } catch {
      t = !0;
    }
    t && xn(e);
  }
  Ws.clear();
}
function es(e) {
  je(e, e.v + 1);
}
function yo(e, t, n) {
  var s = e.reactions;
  if (s !== null) {
    var r = s.length;
    if (Di += r, Di > 1e5 && Bt === null && (Bt = /* @__PURE__ */ new Set()), Bt !== null) {
      if (Bt.has(e)) return;
      Bt.add(e);
    }
    for (var i = 0; i < r; i++) {
      var l = s[i], o = l.f, a = (o & te) === 0;
      if (a && ee(l, t), o & Ps)
        Ws.add(
          /** @type {Effect} */
          l
        );
      else if (o & ue) {
        var f = (
          /** @type {Derived} */
          l
        );
        Ge?.delete(f), yo(f, qe, n);
      } else if (a) {
        var c = (
          /** @type {Effect} */
          l
        );
        o & We && dt !== null && dt.add(c), n !== null ? n.push(c) : Ui(c);
      }
    }
  }
}
function un(e) {
  if (typeof e != "object" || e === null || hn in e || Hl in e)
    return e;
  const t = jl(e);
  if (t !== Ha && t !== Ka)
    return e;
  var n = /* @__PURE__ */ new Map(), s = Ys(e), r = /* @__PURE__ */ ct(0), i = Qt, l = (o) => {
    if (Qt === i)
      return o();
    var a = V, f = Qt;
    ze(null), xl(i);
    var c = o();
    return ze(a), xl(f), c;
  };
  return s && n.set("length", /* @__PURE__ */ ct(
    /** @type {any[]} */
    e.length
  )), new Proxy(
    /** @type {any} */
    e,
    {
      defineProperty(o, a, f) {
        (!("value" in f) || f.configurable === !1 || f.enumerable === !1 || f.writable === !1) && af();
        var c = n.get(a);
        return c === void 0 ? l(() => {
          var d = /* @__PURE__ */ ct(f.value);
          return n.set(a, d), d;
        }) : je(c, f.value, !0), !0;
      },
      deleteProperty(o, a) {
        var f = n.get(a);
        if (f === void 0) {
          if (a in o) {
            const c = l(() => /* @__PURE__ */ ct(re));
            n.set(a, c), es(r);
          }
        } else
          je(f, re), es(r);
        return !0;
      },
      get(o, a, f) {
        if (a === hn)
          return e;
        var c = n.get(a), d = a in o;
        if (c === void 0 && (!d || cn(o, a)?.writable) && (c = l(() => {
          var h = un(d ? o[a] : re), p = /* @__PURE__ */ ct(h);
          return p;
        }), n.set(a, c)), c !== void 0) {
          var y = m(c);
          return y === re ? void 0 : y;
        }
        return Reflect.get(o, a, f);
      },
      getOwnPropertyDescriptor(o, a) {
        this.has?.(o, a);
        var f = Reflect.getOwnPropertyDescriptor(o, a), c = n.get(a);
        if (c !== void 0) {
          var d = m(c);
          if (d === re)
            return;
          if (f && "value" in f)
            f.value = d;
          else
            return {
              enumerable: !0,
              configurable: !0,
              value: d,
              writable: !0
            };
        }
        return f;
      },
      has(o, a) {
        if (a === hn)
          return !0;
        var f = n.get(a), c = f !== void 0 && f.v !== re || Reflect.has(o, a);
        if (f !== void 0 || W !== null && (!c || cn(o, a)?.writable)) {
          f === void 0 && (f = l(() => {
            var y = c ? un(o[a]) : re, h = /* @__PURE__ */ ct(y);
            return h;
          }), n.set(a, f));
          var d = m(f);
          if (d === re)
            return !1;
        }
        return c;
      },
      set(o, a, f, c) {
        var d = n.get(a), y = a in o;
        if (s && a === "length")
          for (var h = f; h < /** @type {Source<number>} */
          d.v; h += 1) {
            var p = n.get(h + "");
            p !== void 0 ? je(p, re) : h in o && (p = l(() => /* @__PURE__ */ ct(re)), n.set(h + "", p));
          }
        if (d === void 0)
          (!y || cn(o, a)?.writable) && (d = l(() => /* @__PURE__ */ ct(void 0)), je(d, un(f)), n.set(a, d));
        else {
          y = d.v !== re;
          var w = l(() => un(f));
          je(d, w);
        }
        var g = Reflect.getOwnPropertyDescriptor(o, a);
        if (g?.set && g.set.call(c, f), !y) {
          if (s && typeof a == "string") {
            var O = (
              /** @type {Source<number>} */
              n.get("length")
            ), E = Number(a);
            Number.isInteger(E) && E >= O.v && je(O, E + 1);
          }
          es(r);
        }
        return !0;
      },
      ownKeys(o) {
        m(r);
        var a = Reflect.ownKeys(o).filter((d) => {
          var y = n.get(d);
          return y === void 0 || y.v !== re;
        });
        for (var [f, c] of n)
          c.v !== re && !(f in o) && a.push(f);
        return a;
      },
      setPrototypeOf() {
        ff();
      }
    }
  );
}
function Tl(e) {
  try {
    if (e !== null && typeof e == "object" && hn in e)
      return e[hn];
  } catch {
  }
  return e;
}
function bo(e, t) {
  return Object.is(Tl(e), Tl(t));
}
var El, wo, So, To;
function Ri() {
  if (El === void 0) {
    El = window, wo = /Firefox/.test(navigator.userAgent);
    var e = Element.prototype, t = Node.prototype, n = Text.prototype;
    So = cn(t, "firstChild").get, To = cn(t, "nextSibling").get, yl(e) && (e[Ti] = void 0, e[Ls] = null, e[Ei] = void 0, e.__e = void 0), yl(n) && (n[Hn] = void 0);
  }
}
function Ue(e = "") {
  return document.createTextNode(e);
}
// @__NO_SIDE_EFFECTS__
function kt(e) {
  return (
    /** @type {TemplateNode | null} */
    So.call(e)
  );
}
// @__NO_SIDE_EFFECTS__
function ot(e) {
  return (
    /** @type {TemplateNode | null} */
    To.call(e)
  );
}
function L(e, t) {
  if (!H)
    return /* @__PURE__ */ kt(e);
  var n = /* @__PURE__ */ kt(U);
  if (n === null)
    n = U.appendChild(Ue());
  else if (t && n.nodeType !== Qs) {
    var s = Ue();
    return n?.before(s), ye(s), s;
  }
  return t && Xi(
    /** @type {Text} */
    n
  ), ye(n), n;
}
function Al(e, t = !1) {
  if (!H) {
    var n = /* @__PURE__ */ kt(e);
    return n instanceof Comment && n.data === "" ? /* @__PURE__ */ ot(n) : n;
  }
  if (t) {
    if (U?.nodeType !== Qs) {
      var s = Ue();
      return U?.before(s), ye(s), s;
    }
    Xi(
      /** @type {Text} */
      U
    );
  }
  return U;
}
function _e(e, t = !1) {
  if (!H)
    return /* @__PURE__ */ kt(e);
  var n = L(e, t);
  return M(e), n;
}
function S(e, t = 1, n = !1) {
  let s = H ? U : e;
  for (var r; t--; )
    r = s, s = /** @type {TemplateNode} */
    /* @__PURE__ */ ot(s);
  if (!H)
    return s;
  if (n) {
    if (s?.nodeType !== Qs) {
      var i = Ue();
      return s === null ? r?.after(i) : s.before(i), ye(i), i;
    }
    Xi(
      /** @type {Text} */
      s
    );
  }
  return ye(s), s;
}
function Eo(e) {
  e.textContent = "";
}
function Ao() {
  return !1;
}
function Ef(e, t, n) {
  return (
    /** @type {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element} */
    n ? document.createElement(e, { is: n }) : document.createElement(e)
  );
}
function Xi(e) {
  if (
    /** @type {string} */
    e.nodeValue.length < 65536
  )
    return;
  let t = e.nextSibling;
  for (; t !== null && t.nodeType === Qs; )
    t.remove(), e.nodeValue += /** @type {string} */
    t.nodeValue, t = e.nextSibling;
}
function Af(e) {
  var t = W;
  if (t === null)
    return V.f |= Ft, e;
  if (!(t.f & tn) && !(t.f & Tn))
    throw e;
  nt(e, t);
}
function nt(e, t) {
  if (e === Mt)
    throw e;
  if (!(t !== null && t.f & le)) {
    for (; t !== null; ) {
      if (t.f & Si && !(t.f & (le | zs))) {
        if (!(t.f & tn))
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
function Of(e) {
  W === null && (V === null && sf(), nf()), yt && tf();
}
function xf(e, t) {
  var n = t.last;
  n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function at(e, t) {
  var n = W;
  n !== null && n.f & de && (e |= de);
  var s = {
    ctx: be,
    deps: null,
    nodes: null,
    f: e | te | Ke,
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
  q?.register_created_effect(s);
  var r = s;
  if (e & Tn)
    $n !== null ? $n.push(s) : $t.ensure().schedule(s);
  else if (t !== null) {
    try {
      xn(s);
    } catch (l) {
      throw he(s), l;
    }
    r.deps === null && r.teardown === null && r.nodes === null && r.first === r.last && // either `null`, or a singular child
    !(r.f & In) && (r = r.first, e & We && e & En && r !== null && (r.f |= En));
  }
  if (r !== null && (r.parent = n, n !== null && xf(r, n), V !== null && V.f & ue && !(e & Lt))) {
    var i = (
      /** @type {Derived} */
      V
    );
    (i.effects ?? (i.effects = [])).push(r);
  }
  return s;
}
function tr() {
  return V !== null && !He;
}
function Oo(e) {
  const t = at(Zs, null);
  return ee(t, ie), t.teardown = e, t;
}
function If(e) {
  Of();
  var t = (
    /** @type {Effect} */
    W.f
  ), n = !V && (t & Xe) !== 0 && be !== null && !be.i;
  if (n) {
    var s = (
      /** @type {ComponentContext} */
      be
    );
    (s.e ?? (s.e = [])).push(e);
  } else
    return xo(e);
}
function xo(e) {
  return at(Tn | Xa, e);
}
function Df(e) {
  $t.ensure();
  const t = at(Lt | In, e);
  return (n = {}) => new Promise((s) => {
    n.outro ? Zt(t, () => {
      he(t), s(void 0);
    }) : (he(t), s(void 0));
  });
}
function Io(e) {
  return at(Tn, e);
}
function Rf(e) {
  return at(dn | In, e);
}
function Do(e, t = 0) {
  return at(Zs | t, e);
}
function Te(e, t = [], n = [], s = []) {
  _f(s, t, n, (r) => {
    at(Zs, () => {
      e(...r.map(m));
    });
  });
}
function Yi(e, t = 0) {
  var n = at(We | t, e);
  return n;
}
function Cf(e, t = 0) {
  var n = at(Bi | t, e);
  return n;
}
function Ce(e) {
  return at(Xe | In, e);
}
function Ro(e) {
  var t = e.teardown;
  if (t !== null) {
    const n = yt, s = V;
    Ol(!0), ze(null);
    try {
      t.call(null);
    } catch (r) {
      nt(r, e.parent);
    } finally {
      Ol(n), ze(s);
    }
  }
}
function Ji(e, t = !1) {
  var n = e.first;
  for (e.first = e.last = null; n !== null; ) {
    const r = n.ac;
    r !== null && hs(() => {
      r.abort(cs);
    });
    var s = n.next;
    n.f & Lt ? n.parent = null : he(n, t), n = s;
  }
}
function Ff(e) {
  for (var t = e.first; t !== null; ) {
    var n = t.next;
    t.f & Xe || he(t), t = n;
  }
}
function he(e, t = !0) {
  var n = !1;
  (t || e.f & Ua) && e.nodes !== null && e.nodes.end !== null && (Mf(
    e.nodes.start,
    /** @type {TemplateNode} */
    e.nodes.end
  ), n = !0), e.f |= zs, Ji(e, t && !n), ss(e, 0);
  var s = e.nodes && e.nodes.t;
  if (s !== null)
    for (const i of s)
      i.stop();
  Ro(e), e.f ^= zs, e.f |= le;
  var r = e.parent;
  r !== null && r.first !== null && Co(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Mf(e, t) {
  for (; e !== null; ) {
    var n = e === t ? null : /* @__PURE__ */ ot(e);
    e.remove(), e = n;
  }
}
function Co(e) {
  var t = e.parent, n = e.prev, s = e.next;
  n !== null && (n.next = s), s !== null && (s.prev = n), t !== null && (t.first === e && (t.first = s), t.last === e && (t.last = n));
}
function Zt(e, t, n = !0) {
  var s = [];
  e.f |= ji, Fo(e, s, !0);
  var r = () => {
    n && he(e), t && t();
  }, i = s.length;
  if (i > 0) {
    var l = () => --i || r();
    for (var o of s)
      o.out(l);
  } else
    r();
}
function Fo(e, t, n) {
  if (!(e.f & de)) {
    e.f ^= de;
    var s = e.nodes && e.nodes.t;
    if (s !== null)
      for (const o of s)
        (o.is_global || n) && t.push(o);
    for (var r = e.first; r !== null; ) {
      var i = r.next;
      if (!(r.f & Lt)) {
        var l = (r.f & En) !== 0 || // If this is a branch effect without a block effect parent,
        // it means the parent block effect was pruned. In that case,
        // transparency information was transferred to the branch effect.
        (r.f & Xe) !== 0 && (e.f & We) !== 0;
        Fo(r, t, l ? n : !1);
      }
      r = i;
    }
  }
}
function Gs(e) {
  e.f &= ~ji, Mo(e, !0);
}
function Mo(e, t) {
  if (!(e.f & ji) && e.f & de) {
    e.f ^= de, e.f & ie || (ee(e, te), $t.ensure().schedule(e));
    for (var n = e.first; n !== null; ) {
      var s = n.next, r = (n.f & En) !== 0 || (n.f & Xe) !== 0;
      Mo(n, r ? t : !1), n = s;
    }
    var i = e.nodes && e.nodes.t;
    if (i !== null)
      for (const l of i)
        (l.is_global || t) && l.in();
  }
}
function Zi(e, t) {
  if (e.nodes)
    for (var n = e.nodes.start, s = e.nodes.end; n !== null; ) {
      var r = n === s ? null : /* @__PURE__ */ ot(n);
      t.append(n), n = r;
    }
}
let yt = !1;
function Ol(e) {
  yt = e;
}
let V = null, He = !1;
function ze(e) {
  V = e;
}
let W = null;
function lt(e) {
  W = e;
}
let it = null;
function Lo(e) {
  V !== null && (V.f & Vs || V.f & ue) && (it ?? (it = /* @__PURE__ */ new Set())).add(e);
}
let me = null, Re = 0, Le = null;
function Lf(e) {
  Le = e;
}
let ko = 1, Wt = 0, Qt = Wt;
function xl(e) {
  Qt = e;
}
function No() {
  return ++ko;
}
function vs(e) {
  var t = e.f;
  if (t & te)
    return !0;
  if (t & qe) {
    for (var n = (
      /** @type {Value[]} */
      e.deps
    ), s = n.length, r = 0; r < s; r++) {
      var i = n[r];
      if (vs(
        /** @type {Derived} */
        i
      ) && ao(
        /** @type {Derived} */
        i
      ), i.wv > e.wv)
        return !0;
    }
    t & Ke && // During time traveling we don't want to reset the status so that
    // traversal of the graph in the other batches still happens
    Ge === null && ee(e, ie);
  }
  return !1;
}
function qo(e, t, n = !0) {
  var s = e.reactions;
  if (s !== null && !(it !== null && it.has(e)))
    for (var r = 0; r < s.length; r++) {
      var i = s[r];
      i.f & ue ? qo(
        /** @type {Derived} */
        i,
        t,
        !1
      ) : t === i && (n ? ee(i, te) : i.f & ie && ee(i, qe), Ui(
        /** @type {Effect} */
        i
      ));
    }
}
function zo(e) {
  var t = me, n = Re, s = Le, r = V, i = it, l = be, o = He, a = Qt, f = e.f;
  me = /** @type {null | Value[]} */
  null, Re = 0, Le = null, V = f & (Xe | Lt) ? null : e, it = null, An(e.ctx), He = !1, Qt = ++Wt, e.ac !== null && (hs(() => {
    e.ac.abort(cs);
  }), e.ac = null);
  try {
    e.f |= Vs;
    var c = (
      /** @type {Function} */
      e.fn
    ), d = c();
    e.f |= tn;
    var y = Il(e);
    if (to() && Le !== null && !He && y !== null && !(e.f & (ue | qe | te)))
      for (var h = 0; h < /** @type {Source[]} */
      Le.length; h++)
        qo(
          Le[h],
          /** @type {Effect} */
          e
        );
    if (r !== null && r !== e) {
      if (Wt++, r.deps !== null)
        for (let p = 0; p < n; p += 1)
          r.deps[p].rv = Wt;
      if (t !== null)
        for (const p of t)
          p.rv = Wt;
      Le !== null && (s === null ? s = Le : s.push(.../** @type {Source[]} */
      Le));
    }
    return e.f & Ft && (e.f ^= Ft), d;
  } catch (p) {
    return Il(e), Af(p);
  } finally {
    e.f ^= Vs, me = t, Re = n, Le = s, V = r, it = i, An(l), He = o, Qt = a;
  }
}
function Il(e) {
  var r;
  var t = e.deps, n = q?.is_fork;
  if (me !== null) {
    var s;
    if (n || ss(e, Re), t !== null && Re > 0)
      for (t.length = Re + me.length, s = 0; s < me.length; s++)
        t[Re + s] = me[s];
    else
      e.deps = t = me;
    if (tr() && e.f & Ke)
      for (s = Re; s < t.length; s++)
        ((r = t[s]).reactions ?? (r.reactions = [])).push(e);
  } else !n && t !== null && Re < t.length && (ss(e, Re), t.length = Re);
  return t;
}
function kf(e, t) {
  let n = t.reactions;
  if (n !== null) {
    var s = Wa.call(n, e);
    if (s !== -1) {
      var r = n.length - 1;
      r === 0 ? n = t.reactions = null : (n[s] = n[r], n.pop());
    }
  }
  if (n === null && t.f & ue && // Destroying a child effect while updating a parent effect can cause a dependency to appear
  // to be unused, when in fact it is used by the currently-updating parent. Checking `new_deps`
  // allows us to skip the expensive work of disconnecting and immediately reconnecting it
  (me === null || !ts.call(me, t))) {
    var i = (
      /** @type {Derived} */
      t
    );
    i.f & Ke && (i.f ^= Ke), i.v !== re && Gi(i), i.ac !== null && hs(() => {
      i.ac.abort(cs), i.ac = null, ee(i, te);
    }), yf(i), ss(i, 0);
  }
}
function ss(e, t) {
  var n = e.deps;
  if (n !== null)
    for (var s = t; s < n.length; s++)
      kf(e, n[s]);
}
function xn(e) {
  var t = e.f;
  if (!(t & le)) {
    ee(e, ie);
    var n = W;
    W = e;
    try {
      t & (We | Bi) ? Ff(e) : Ji(e), Ro(e);
      var s = zo(e);
      e.teardown = typeof s == "function" ? s : null, e.wv = ko;
      var r;
      Bl && df && e.f & te && e.deps;
    } finally {
      W = n;
    }
  }
}
async function Nf() {
  await Promise.resolve(), ho();
}
function m(e) {
  var t = e.f, n = (t & ue) !== 0;
  if (V !== null && !He) {
    var s = W !== null && (W.f & le) !== 0;
    if (!s && (it === null || !it.has(e))) {
      var r = V.deps;
      if (V.f & Vs)
        e.rv < Wt && (e.rv = Wt, me === null && r !== null && r[Re] === e ? Re++ : me === null ? me = [e] : me.push(e));
      else {
        V.deps ?? (V.deps = []), ts.call(V.deps, e) || V.deps.push(e);
        var i = e.reactions;
        i === null ? e.reactions = [V] : ts.call(i, V) || i.push(V);
      }
    }
  }
  if (yt && rt.has(e))
    return rt.get(e);
  if (n) {
    var l = (
      /** @type {Derived} */
      e
    );
    if (yt) {
      var o = l.v;
      return (!(l.f & ie) && l.reactions !== null || Vo(l)) && (o = Hi(l)), rt.set(l, o), o;
    }
    var a = (l.f & Ke) === 0 && !He && V !== null && (V.f & Ke) !== 0, f = (l.f & tn) === 0;
    vs(l) && (a && (l.f |= Ke), ao(l)), a && !f && (fo(l), Po(l));
  }
  if (Ge?.has(e))
    return Ge.get(e);
  if (e.f & Ft)
    throw e.v;
  return e.v;
}
function Po(e) {
  if (e.f |= Ke, e.deps !== null)
    for (const n of e.deps) {
      var t = n.reactions;
      t === null ? n.reactions = [e] : ts.call(t, e) || t.push(e), n.f & ue && !(n.f & Ke) && (fo(
        /** @type {Derived} */
        n
      ), Po(
        /** @type {Derived} */
        n
      ));
    }
}
function Vo(e) {
  if (e.v === re) return !0;
  if (e.deps === null) return !1;
  for (const t of e.deps)
    if (rt.has(t) || t.f & ue && Vo(
      /** @type {Derived} */
      t
    ))
      return !0;
  return !1;
}
function nr(e) {
  var t = He;
  try {
    return He = !0, e();
  } finally {
    He = t;
  }
}
const Gt = Symbol("events"), Bo = /* @__PURE__ */ new Set(), Ci = /* @__PURE__ */ new Set();
function J(e, t, n) {
  (t[Gt] ?? (t[Gt] = {}))[e] = n;
}
function qf(e) {
  for (var t = 0; t < e.length; t++)
    Bo.add(e[t]);
  for (var n of Ci)
    n(e);
}
let _i = null, pi = !1;
function Dl(e) {
  var t = this, n = (
    /** @type {Node} */
    t.ownerDocument
  ), s = e.type, r = e.composedPath?.() || [], i = (
    /** @type {null | Element} */
    r[0] || e.target
  );
  _i = e, pi || (pi = !0, setTimeout(() => {
    pi = !1, _i = null;
  }));
  var l = 0, o = _i === e && e[Gt];
  if (o) {
    var a = r.indexOf(o);
    if (a !== -1 && (t === document || t === /** @type {any} */
    window)) {
      e[Gt] = t;
      return;
    }
    var f = r.indexOf(t);
    if (f === -1)
      return;
    a <= f && (l = a);
  }
  if (i = /** @type {Element} */
  r[l] || e.target, i !== t) {
    Vi(e, "currentTarget", {
      configurable: !0,
      get() {
        return i || n;
      }
    });
    var c = V, d = W;
    ze(null), lt(null);
    try {
      for (var y, h = []; i !== null && i !== t; ) {
        try {
          var p = i[Gt]?.[s];
          p != null && (!/** @type {any} */
          i.disabled || // DOM could've been updated already by the time this is reached, so we check this as well
          // -> the target could not have been disabled because it emits the event in the first place
          e.target === i) && p.call(i, e);
        } catch (w) {
          y ? h.push(w) : y = w;
        }
        if (e.cancelBubble) break;
        l++, i = l < r.length ? (
          /** @type {Element} */
          r[l]
        ) : null;
      }
      if (y) {
        for (let w of h)
          queueMicrotask(() => {
            throw w;
          });
        throw y;
      }
    } finally {
      e[Gt] = t, delete e.currentTarget, ze(c), lt(d);
    }
  }
}
const zf = (
  // We gotta write it like this because after downleveling the pure comment may end up in the wrong location
  globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", {
    /** @param {string} html */
    createHTML: (e) => e
  })
);
function Pf(e) {
  return (
    /** @type {string} */
    zf?.createHTML(e) ?? e
  );
}
function Vf(e) {
  var t = Ef("template");
  return t.innerHTML = Pf(e.replaceAll("<!>", "<!---->")), t.content;
}
function Ns(e, t) {
  var n = (
    /** @type {Effect} */
    W
  );
  n.nodes === null && (n.nodes = { start: e, end: t, a: null, t: null });
}
// @__NO_SIDE_EFFECTS__
function Ye(e, t) {
  var n = (t & Va) !== 0, s = (t & Ba) !== 0, r, i = !e.startsWith("<!>");
  return () => {
    if (H)
      return Ns(U, null), U;
    r === void 0 && (r = Vf(i ? e : "<!>" + e), n || (r = /** @type {TemplateNode} */
    /* @__PURE__ */ kt(r)));
    var l = (
      /** @type {TemplateNode} */
      s || wo ? document.importNode(r, !0) : r.cloneNode(!0)
    );
    if (n) {
      var o = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ kt(l)
      ), a = (
        /** @type {TemplateNode} */
        l.lastChild
      );
      Ns(o, a);
    } else
      Ns(l, l);
    return l;
  };
}
function ae(e, t) {
  if (H) {
    var n = (
      /** @type {Effect & { nodes: EffectNodes }} */
      W
    );
    (!(n.f & tn) || n.nodes.end === null) && (n.nodes.end = U), er();
    return;
  }
  e !== null && e.before(
    /** @type {Node} */
    t
  );
}
const Bf = ["touchstart", "touchmove"];
function jf(e) {
  return Bf.includes(e);
}
function jo(e) {
  let t = 0, n = en(0), s;
  return () => {
    tr() && (m(n), Do(() => (t === 0 && (s = nr(() => e(() => es(n)))), t += 1, () => {
      mt(() => {
        t -= 1, t === 0 && (s?.(), s = void 0, es(n));
      });
    })));
  };
}
var Wf = En | In;
function Gf(e, t, n, s) {
  new Hf(e, t, n, s);
}
var Oe, ls, ke, Ut, fe, xe, ce, Ie, et, Xt, Ct, Sn, os, as, _t, Us, B, Wo, Go, Fi, Dt, Ho, Mi, Yn, qs, Li, ki;
class Hf {
  /**
   * @param {TemplateNode} node
   * @param {BoundaryProps} props
   * @param {((anchor: Node) => void)} children
   * @param {((error: unknown) => unknown) | undefined} [transform_error]
   */
  constructor(t, n, s, r) {
    N(this, B);
    /** @type {Boundary | null} */
    Se(this, "parent");
    Se(this, "is_pending", !1);
    /**
     * API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
     * Inherited from parent boundary, or defaults to identity.
     * @type {(error: unknown) => unknown}
     */
    Se(this, "transform_error");
    /** @type {TemplateNode} */
    N(this, Oe);
    /** @type {TemplateNode | null} */
    N(this, ls, H ? U : null);
    /** @type {BoundaryProps} */
    N(this, ke);
    /** @type {((anchor: Node) => void)} */
    N(this, Ut);
    /** @type {Effect} */
    N(this, fe);
    /** @type {Effect | null} */
    N(this, xe, null);
    /** @type {Effect | null} */
    N(this, ce, null);
    /** @type {Effect | null} */
    N(this, Ie, null);
    /** @type {DocumentFragment | null} */
    N(this, et, null);
    N(this, Xt, 0);
    N(this, Ct, 0);
    N(this, Sn, !1);
    /** @type {Set<Effect>} */
    N(this, os, /* @__PURE__ */ new Set());
    /** @type {Set<Effect>} */
    N(this, as, /* @__PURE__ */ new Set());
    /**
     * A source containing the number of pending async deriveds/expressions.
     * Only created if `$effect.pending()` is used inside the boundary,
     * otherwise updating the source results in needless `Batch.ensure()`
     * calls followed by no-op flushes
     * @type {Source<number> | null}
     */
    N(this, _t, null);
    N(this, Us, jo(() => (C(this, _t, en(u(this, Xt))), () => {
      C(this, _t, null);
    })));
    C(this, Oe, t), C(this, ke, n), C(this, Ut, (i) => {
      var l = (
        /** @type {Effect} */
        W
      );
      l.b = this, l.f |= Si, s(i);
    }), this.parent = /** @type {Effect} */
    W.b, this.transform_error = r ?? this.parent?.transform_error ?? ((i) => i), C(this, fe, Yi(() => {
      if (H) {
        const i = Wi(
          /** @type {TemplateNode} */
          u(this, ls)
        );
        er();
        const l = i === zi;
        if (i.startsWith(ml)) {
          const a = JSON.parse(i.slice(ml.length));
          F(this, B, Go).call(this, a);
        } else l ? F(this, B, Ho).call(this) : F(this, B, Wo).call(this);
      } else
        F(this, B, Mi).call(this);
    }, Wf)), H && C(this, Oe, U);
  }
  /**
   * Defer an effect inside a pending boundary until the boundary resolves
   * @param {Effect} effect
   */
  defer_effect(t) {
    so(t, u(this, os), u(this, as));
  }
  /**
   * Returns `false` if the effect exists inside a boundary whose pending snippet is shown
   * @returns {boolean}
   */
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered());
  }
  has_pending_snippet() {
    return !!u(this, ke).pending;
  }
  /**
   * Update the source that powers `$effect.pending()` inside this boundary,
   * and controls when the current `pending` snippet (if any) is removed.
   * Do not call from inside the class
   * @param {1 | -1} d
   * @param {Batch} batch
   */
  update_pending_count(t, n) {
    F(this, B, Li).call(this, t, n), C(this, Xt, u(this, Xt) + t), !(!u(this, _t) || u(this, Sn)) && (C(this, Sn, !0), mt(() => {
      C(this, Sn, !1), u(this, _t) && On(u(this, _t), u(this, Xt));
    }));
  }
  get_effect_pending() {
    return u(this, Us).call(this), m(
      /** @type {Source<number>} */
      u(this, _t)
    );
  }
  /** @param {unknown} error */
  error(t) {
    if (t === Mt || !u(this, ke).onerror && !u(this, ke).failed)
      throw t;
    q?.is_fork ? (u(this, xe) && q.skip_effect(u(this, xe)), u(this, ce) && q.skip_effect(u(this, ce)), u(this, Ie) && q.skip_effect(u(this, Ie)), q.oncommit(() => {
      F(this, B, Dt).call(this) || F(this, B, ki).call(this, t);
    })) : F(this, B, ki).call(this, t);
  }
}
Oe = new WeakMap(), ls = new WeakMap(), ke = new WeakMap(), Ut = new WeakMap(), fe = new WeakMap(), xe = new WeakMap(), ce = new WeakMap(), Ie = new WeakMap(), et = new WeakMap(), Xt = new WeakMap(), Ct = new WeakMap(), Sn = new WeakMap(), os = new WeakMap(), as = new WeakMap(), _t = new WeakMap(), Us = new WeakMap(), B = new WeakSet(), Wo = function() {
  try {
    C(this, xe, Ce(() => u(this, Ut).call(this, u(this, Oe))));
  } catch (t) {
    this.error(t);
  }
}, /**
 * @param {unknown} error The deserialized error from the server's hydration comment
 */
Go = function(t) {
  const n = u(this, ke).failed, { reset: s, invoke_onerror: r } = F(this, B, Fi).call(this, t);
  mt(r), n && C(this, Ie, Ce(() => {
    n(
      u(this, Oe),
      () => t,
      () => s
    );
  }));
}, /**
 * Creates the `reset` function for a failed boundary, along with a function
 * that invokes `onerror` with it (if provided)
 * @param {unknown} error
 * @returns {{ reset: () => void, invoke_onerror: () => void }}
 */
Fi = function(t) {
  var n = !1, s = !1;
  const r = () => {
    if (!F(this, B, Dt).call(this)) {
      if (n) {
        Qa();
        return;
      }
      n = !0, s && cf(), u(this, Ie) !== null && Zt(u(this, Ie), () => {
        C(this, Ie, null);
      }), F(this, B, qs).call(this, () => {
        F(this, B, Mi).call(this);
      });
    }
  };
  return { reset: r, invoke_onerror: () => {
    if (!F(this, B, Dt).call(this))
      try {
        s = !0, u(this, ke).onerror?.(t, r), s = !1;
      } catch (l) {
        nt(l, u(this, fe) && u(this, fe).parent);
      }
  } };
}, Dt = function() {
  return (u(this, fe).f & (le | zs)) !== 0;
}, Ho = function() {
  const t = u(this, ke).pending;
  t && (this.is_pending = !0, C(this, ce, Ce(() => t(u(this, Oe)))), mt(() => {
    if (!F(this, B, Dt).call(this)) {
      var n = C(this, et, document.createDocumentFragment()), s = Ue(), r = !1;
      if (n.append(s), C(this, xe, F(this, B, qs).call(this, () => {
        try {
          return Ce(() => u(this, Ut).call(this, s));
        } catch (i) {
          try {
            this.error(i), r = !0;
          } catch (l) {
            nt(l, u(this, fe).parent);
          }
          return null;
        }
      })), u(this, xe) === null) {
        C(this, et, null), r && F(this, B, Yn).call(
          this,
          /** @type {Batch} */
          q
        );
        return;
      }
      u(this, Ct) === 0 && (u(this, Oe).before(n), C(this, et, null), Zt(
        /** @type {Effect} */
        u(this, ce),
        () => {
          C(this, ce, null);
        }
      ), F(this, B, Yn).call(
        this,
        /** @type {Batch} */
        q
      ));
    }
  }));
}, Mi = function() {
  try {
    if (this.is_pending = this.has_pending_snippet(), C(this, Ct, 0), C(this, Xt, 0), C(this, xe, Ce(() => {
      u(this, Ut).call(this, u(this, Oe));
    })), u(this, Ct) > 0) {
      var t = C(this, et, document.createDocumentFragment());
      Zi(u(this, xe), t);
      const n = (
        /** @type {(anchor: Node) => void} */
        u(this, ke).pending
      );
      C(this, ce, Ce(() => n(u(this, Oe))));
    } else
      F(this, B, Yn).call(
        this,
        /** @type {Batch} */
        q
      );
  } catch (n) {
    this.error(n);
  }
}, /**
 * @param {Batch} batch
 */
Yn = function(t) {
  this.is_pending = !1, t.transfer_effects(u(this, os), u(this, as));
}, /**
 * @template T
 * @param {() => T} fn
 */
qs = function(t) {
  var n = W, s = V, r = be;
  lt(u(this, fe)), ze(u(this, fe)), An(u(this, fe).ctx);
  try {
    return $t.ensure(), t();
  } finally {
    lt(n), ze(s), An(r);
  }
}, /**
 * Updates the pending count associated with the currently visible pending snippet,
 * if any, such that we can replace the snippet with content once work is done
 * @param {1 | -1} d
 * @param {Batch} batch
 */
Li = function(t, n) {
  var s;
  if (!this.has_pending_snippet()) {
    this.parent && F(s = this.parent, B, Li).call(s, t, n);
    return;
  }
  C(this, Ct, u(this, Ct) + t), u(this, Ct) === 0 && (F(this, B, Yn).call(this, n), u(this, ce) && Zt(u(this, ce), () => {
    C(this, ce, null);
  }), u(this, et) && (u(this, Oe).before(u(this, et)), C(this, et, null)));
}, /**
 * @param {unknown} error
 */
ki = function(t) {
  u(this, xe) && (he(u(this, xe)), C(this, xe, null)), u(this, ce) && (he(u(this, ce)), C(this, ce, null)), u(this, Ie) && (he(u(this, Ie)), C(this, Ie, null)), H && (ye(
    /** @type {TemplateNode} */
    u(this, ls)
  ), Xl(), ye(Bs()));
  let n = u(this, ke).failed;
  const s = (r) => {
    if (F(this, B, Dt).call(this)) return;
    const { reset: i, invoke_onerror: l } = F(this, B, Fi).call(this, r);
    l(), n && !F(this, B, Dt).call(this) && C(this, Ie, F(this, B, qs).call(this, () => {
      try {
        return Ce(() => {
          var o = (
            /** @type {Effect} */
            W
          );
          o.b = this, o.f |= Si, n(
            u(this, Oe),
            () => r,
            () => i
          );
        });
      } catch (o) {
        return nt(
          o,
          /** @type {Effect} */
          u(this, fe).parent
        ), null;
      }
    }));
  };
  mt(() => {
    if (!F(this, B, Dt).call(this)) {
      var r;
      try {
        r = this.transform_error(t);
      } catch (i) {
        nt(i, u(this, fe) && u(this, fe).parent);
        return;
      }
      r !== null && typeof r == "object" && typeof /** @type {any} */
      r.then == "function" ? r.then(
        s,
        /** @param {unknown} e */
        (i) => nt(i, u(this, fe) && u(this, fe).parent)
      ) : s(r);
    }
  });
};
function pe(e, t) {
  var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
  n !== /** @type {any} */
  (e[Hn] ?? (e[Hn] = e.nodeValue)) && (e[Hn] = n, e.nodeValue = `${n}`);
}
function Ko(e, t) {
  return Uo(e, t);
}
function Kf(e, t) {
  Ri(), t.intro = t.intro ?? !1;
  const n = t.target, s = H, r = U;
  try {
    for (var i = /* @__PURE__ */ kt(n); i && (i.nodeType !== ds || /** @type {Comment} */
    i.data !== Vl); )
      i = /* @__PURE__ */ ot(i);
    if (!i)
      throw Mt;
    gt(!0), ye(
      /** @type {Comment} */
      i
    );
    const l = Uo(e, { ...t, anchor: i });
    return gt(!1), /**  @type {Exports} */
    l;
  } catch (l) {
    if (l instanceof Error && l.message.split(`
`).some((o) => o.startsWith("https://svelte.dev/e/")))
      throw l;
    return l !== Mt && console.warn("Failed to hydrate: ", l), t.recover === !1 && lf(), Ri(), Eo(n), gt(!1), Ko(e, t);
  } finally {
    gt(s), ye(r);
  }
}
const Cs = /* @__PURE__ */ new Map();
function Uo(e, { target: t, anchor: n, props: s = {}, events: r, context: i, intro: l = !0, transformError: o }) {
  Ri();
  var a = void 0, f = Df(() => {
    var c = n ?? t.appendChild(Ue());
    Gf(
      /** @type {TemplateNode} */
      c,
      {
        pending: () => {
        }
      },
      (h) => {
        Ql({});
        var p = (
          /** @type {ComponentContext} */
          be
        );
        if (i && (p.c = i), r && (s.$$events = r), H && Ns(
          /** @type {TemplateNode} */
          h,
          null
        ), a = e(h, s) || eo(), H && (W.nodes.end = U, U === null || U.nodeType !== ds || /** @type {Comment} */
        U.data !== Pi))
          throw $s(), Mt;
        $l();
      },
      o
    );
    var d = /* @__PURE__ */ new Set(), y = (h) => {
      for (var p = 0; p < h.length; p++) {
        var w = h[p];
        if (!d.has(w)) {
          d.add(w);
          var g = jf(w);
          for (const A of [t, document]) {
            var O = Cs.get(A);
            O === void 0 && (O = /* @__PURE__ */ new Map(), Cs.set(A, O));
            var E = O.get(w);
            E === void 0 ? (A.addEventListener(w, Dl, { passive: g }), O.set(w, 1)) : O.set(w, E + 1);
          }
        }
      }
    };
    return y(Js(Bo)), Ci.add(y), () => {
      for (var h of d)
        for (const g of [t, document]) {
          var p = (
            /** @type {Map<string, number>} */
            Cs.get(g)
          ), w = (
            /** @type {number} */
            p.get(h)
          );
          --w == 0 ? (g.removeEventListener(h, Dl), p.delete(h), p.size === 0 && Cs.delete(g)) : p.set(h, w);
        }
      Ci.delete(y), c !== n && c.parentNode?.removeChild(c);
    };
  });
  return Ni.set(a, f), a;
}
let Ni = /* @__PURE__ */ new WeakMap();
function Uf(e, t) {
  const n = Ni.get(e);
  return n ? (Ni.delete(e), n(t)) : Promise.resolve();
}
var Be, tt, De, Yt, fs, us, Xs;
class Xf {
  /**
   * @param {TemplateNode} anchor
   * @param {boolean} transition
   */
  constructor(t, n = !0) {
    /** @type {TemplateNode} */
    Se(this, "anchor");
    /** @type {Map<Batch, Key>} */
    N(this, Be, /* @__PURE__ */ new Map());
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
    N(this, tt, /* @__PURE__ */ new Map());
    /**
     * Similar to #onscreen with respect to the keys, but contains branches that are not yet
     * in the DOM, because their insertion is deferred.
     * @type {Map<Key, Branch>}
     */
    N(this, De, /* @__PURE__ */ new Map());
    /**
     * Keys of effects that are currently outroing
     * @type {Set<Key>}
     */
    N(this, Yt, /* @__PURE__ */ new Set());
    /**
     * Whether to pause (i.e. outro) on change, or destroy immediately.
     * This is necessary for `<svelte:element>`
     */
    N(this, fs, !0);
    /**
     * @param {Batch} batch
     */
    N(this, us, (t) => {
      if (u(this, Be).has(t)) {
        var n = (
          /** @type {Key} */
          u(this, Be).get(t)
        ), s = u(this, tt).get(n);
        if (s)
          Gs(s), u(this, Yt).delete(n);
        else {
          var r = u(this, De).get(n);
          r && (Gs(r.effect), u(this, tt).set(n, r.effect), u(this, De).delete(n), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), s = r.effect);
        }
        for (const [i, l] of u(this, Be)) {
          if (u(this, Be).delete(i), i === t)
            break;
          const o = u(this, De).get(l);
          o && (he(o.effect), u(this, De).delete(l));
        }
        for (const [i, l] of u(this, tt)) {
          if (i === n || u(this, Yt).has(i)) continue;
          const o = () => {
            if (Array.from(u(this, Be).values()).includes(i)) {
              var f = document.createDocumentFragment();
              Zi(l, f), f.append(Ue()), u(this, De).set(i, { effect: l, fragment: f });
            } else
              he(l);
            u(this, Yt).delete(i), u(this, tt).delete(i);
          };
          u(this, fs) || !s ? (u(this, Yt).add(i), Zt(l, o, !1)) : o();
        }
      }
    });
    /**
     * @param {Batch} batch
     */
    N(this, Xs, (t) => {
      u(this, Be).delete(t);
      const n = Array.from(u(this, Be).values());
      for (const [s, r] of u(this, De))
        n.includes(s) || (he(r.effect), u(this, De).delete(s));
    });
    this.anchor = t, C(this, fs, n);
  }
  /**
   *
   * @param {any} key
   * @param {null | ((target: TemplateNode) => void)} fn
   */
  ensure(t, n) {
    var s = (
      /** @type {Batch} */
      q
    ), r = Ao();
    if (n && !u(this, tt).has(t) && !u(this, De).has(t))
      if (r) {
        var i = document.createDocumentFragment(), l = Ue();
        i.append(l), u(this, De).set(t, {
          effect: Ce(() => n(l)),
          fragment: i
        });
      } else
        u(this, tt).set(
          t,
          Ce(() => n(this.anchor))
        );
    if (u(this, Be).set(s, t), r) {
      for (const [o, a] of u(this, tt))
        o === t ? s.unskip_effect(a) : s.skip_effect(a);
      for (const [o, a] of u(this, De))
        o === t ? s.unskip_effect(a.effect) : s.skip_effect(a.effect);
      s.oncommit(u(this, us)), s.ondiscard(u(this, Xs));
    } else
      H && (this.anchor = U), u(this, us).call(this, s);
  }
}
Be = new WeakMap(), tt = new WeakMap(), De = new WeakMap(), Yt = new WeakMap(), fs = new WeakMap(), us = new WeakMap(), Xs = new WeakMap();
function Bn(e, t, n = !1) {
  var s;
  H && (s = U, er());
  var r = new Xf(e), i = n ? En : 0;
  function l(o, a) {
    if (H) {
      var f = Wi(
        /** @type {TemplateNode} */
        s
      );
      if (o !== parseInt(f.substring(1))) {
        var c = Bs();
        ye(c), r.anchor = c, gt(!1), r.ensure(o, a), gt(!0);
        return;
      }
    }
    r.ensure(o, a);
  }
  Yi(() => {
    var o = !1;
    t((a, f = 0) => {
      o = !0, l(f, a);
    }), o || l(-1, null);
  }, i);
}
function Yf(e, t, n) {
  for (var s = [], r = t.length, i, l = t.length, o = 0; o < r; o++) {
    let d = t[o];
    Zt(
      d,
      () => {
        if (i) {
          if (i.pending.delete(d), i.done.add(d), i.pending.size === 0) {
            var y = (
              /** @type {Set<EachOutroGroup>} */
              e.outrogroups
            );
            qi(e, Js(i.done)), y.delete(i), y.size === 0 && (e.outrogroups = null);
          }
        } else
          l -= 1;
      },
      !1
    );
  }
  if (l === 0) {
    var a = s.length === 0 && n !== null && e.pending.size === 0;
    if (a) {
      var f = (
        /** @type {Element} */
        n
      ), c = (
        /** @type {Element} */
        f.parentNode
      );
      Eo(c), c.append(f), e.items.clear();
    }
    qi(e, t, !a);
  } else
    i = {
      pending: new Set(t),
      done: /* @__PURE__ */ new Set()
    }, (e.outrogroups ?? (e.outrogroups = /* @__PURE__ */ new Set())).add(i);
}
function qi(e, t, n = !0) {
  var s;
  if (e.pending.size > 0) {
    s = /* @__PURE__ */ new Set();
    for (const l of e.pending.values())
      for (const o of l)
        s.add(
          /** @type {EachItem} */
          e.items.get(o).e
        );
  }
  for (var r = 0; r < t.length; r++) {
    var i = t[r];
    if (s?.has(i)) {
      i.f |= st;
      const l = document.createDocumentFragment();
      Zi(i, l);
    } else
      he(t[r], n);
  }
}
var Rl;
function xt(e, t, n, s, r, i = null) {
  var l = e, o = /* @__PURE__ */ new Map(), a = (t & Pl) !== 0;
  if (a) {
    var f = (
      /** @type {Element} */
      e
    );
    l = H ? ye(/* @__PURE__ */ kt(f)) : f.appendChild(Ue());
  }
  H && er();
  var c = null, d = /* @__PURE__ */ oo(() => {
    var E = n();
    return (
      /** @type {V[]} */
      Ys(E) ? E : E == null ? [] : Js(E)
    );
  }), y = /* @__PURE__ */ new Map(), h = !0;
  function p(E) {
    if (!(O.effect.f & le)) {
      O.pending.delete(E);
      var A = m(d);
      O.fallback = c, Jf(O, A, l, t, s), c !== null && (A.length === 0 ? c.f & st ? (c.f ^= st, Jn(c, null, l)) : Gs(c) : Zt(c, () => {
        c = null;
      }));
    }
  }
  function w(E) {
    O.pending.delete(E);
  }
  var g = Yi(() => {
    var E = (
      /** @type {V[]} */
      m(d)
    ), A = E.length;
    let v = !1;
    if (H) {
      var _ = Wi(l) === zi;
      _ !== (A === 0) && (l = Bs(), ye(l), gt(!1), v = !0);
    }
    for (var T = /* @__PURE__ */ new Set(), b = (
      /** @type {Batch} */
      q
    ), x = Ao(), R = 0; R < A; R += 1) {
      H && U.nodeType === ds && /** @type {Comment} */
      U.data === Pi && (l = /** @type {Comment} */
      U, v = !0, gt(!1));
      var j = E[R], G = s(j, R), P = h ? null : o.get(G);
      P ? (P.v && On(P.v, j), P.i && On(P.i, R), x && b.unskip_effect(P.e)) : (P = Zf(
        o,
        h ? l : Rl ?? (Rl = Ue()),
        j,
        G,
        R,
        r,
        t,
        n
      ), h || (P.e.f |= st), o.set(G, P)), T.add(G);
    }
    if (A === 0 && i && !c && (h ? c = Ce(() => i(l)) : (c = Ce(() => i(Rl ?? (Rl = Ue()))), c.f |= st)), A > T.size && ef(), H && A > 0 && ye(Bs()), !h)
      if (y.set(b, T), x) {
        for (const [$, Z] of o)
          T.has($) || b.skip_effect(Z.e);
        b.oncommit(p), b.ondiscard(w);
      } else
        p(b);
    v && gt(!0), m(d);
  }), O = { effect: g, items: o, pending: y, outrogroups: null, fallback: c };
  h = !1, H && (l = U);
}
function jn(e) {
  for (; e !== null && !(e.f & Xe); )
    e = e.next;
  return e;
}
function Jf(e, t, n, s, r) {
  var i = (s & La) !== 0, l = t.length, o = e.items, a = jn(e.effect.first), f, c = null, d, y = [], h = [], p, w, g, O;
  if (i)
    for (O = 0; O < l; O += 1)
      p = t[O], w = r(p, O), g = /** @type {EachItem} */
      o.get(w).e, g.f & st || (g.nodes?.a?.measure(), (d ?? (d = /* @__PURE__ */ new Set())).add(g));
  for (O = 0; O < l; O += 1) {
    if (p = t[O], w = r(p, O), g = /** @type {EachItem} */
    o.get(w).e, e.outrogroups !== null)
      for (const j of e.outrogroups)
        j.pending.delete(g), j.done.delete(g);
    if (g.f & de && (Gs(g), i && (g.nodes?.a?.unfix(), (d ?? (d = /* @__PURE__ */ new Set())).delete(g))), g.f & st)
      if (g.f ^= st, g === a)
        Jn(g, null, n);
      else {
        var E = c ? c.next : a;
        g === e.effect.last && (e.effect.last = g.prev), g.prev && (g.prev.next = g.next), g.next && (g.next.prev = g.prev), It(e, c, g), It(e, g, E), Jn(g, E, n), c = g, y = [], h = [], a = jn(c.next);
        continue;
      }
    if (g !== a) {
      if (f !== void 0 && f.has(g)) {
        if (y.length < h.length) {
          var A = h[0], v;
          c = A.prev;
          var _ = y[0], T = y[y.length - 1];
          for (v = 0; v < y.length; v += 1)
            Jn(y[v], A, n);
          for (v = 0; v < h.length; v += 1)
            f.delete(h[v]);
          It(e, _.prev, T.next), It(e, c, _), It(e, T, A), a = A, c = T, O -= 1, y = [], h = [];
        } else
          f.delete(g), Jn(g, a, n), It(e, g.prev, g.next), It(e, g, c === null ? e.effect.first : c.next), It(e, c, g), c = g;
        continue;
      }
      for (y = [], h = []; a !== null && a !== g; )
        (f ?? (f = /* @__PURE__ */ new Set())).add(a), h.push(a), a = jn(a.next);
      if (a === null)
        continue;
    }
    g.f & st || y.push(g), c = g, a = jn(g.next);
  }
  if (e.outrogroups !== null) {
    for (const j of e.outrogroups)
      j.pending.size === 0 && (qi(e, Js(j.done)), e.outrogroups?.delete(j));
    e.outrogroups.size === 0 && (e.outrogroups = null);
  }
  if (a !== null || f !== void 0) {
    var b = [];
    if (f !== void 0)
      for (g of f)
        g.f & de || b.push(g);
    for (; a !== null; )
      !(a.f & de) && a !== e.fallback && b.push(a), a = jn(a.next);
    var x = b.length;
    if (x > 0) {
      var R = s & Pl && l === 0 ? n : null;
      if (i) {
        for (O = 0; O < x; O += 1)
          b[O].nodes?.a?.measure();
        for (O = 0; O < x; O += 1)
          b[O].nodes?.a?.fix();
      }
      Yf(e, b, R);
    }
  }
  i && mt(() => {
    if (d !== void 0)
      for (g of d)
        g.nodes?.a?.apply();
  });
}
function Zf(e, t, n, s, r, i, l, o) {
  var a = l & Fa ? l & ka ? en(n) : /* @__PURE__ */ mo(n, !1, !1) : null, f = l & Ma ? en(r) : null;
  return {
    v: a,
    i: f,
    e: Ce(() => (i(t, a ?? n, f ?? r, o), () => {
      e.delete(s);
    }))
  };
}
function Jn(e, t, n) {
  if (e.nodes)
    for (var s = e.nodes.start, r = e.nodes.end, i = t && !(t.f & st) ? (
      /** @type {EffectNodes} */
      t.nodes.start
    ) : n; s !== null; ) {
      var l = (
        /** @type {TemplateNode} */
        /* @__PURE__ */ ot(s)
      );
      if (i.before(s), s === r)
        return;
      s = l;
    }
}
function It(e, t, n) {
  t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
function Qf(e, t) {
  var n = void 0, s;
  Cf(() => {
    n !== (n = t()) && (s && (he(s), s = null), n && (s = Ce(() => {
      Io(() => (
        /** @type {(node: Element) => void} */
        n(e)
      ));
    })));
  });
}
function Xo(e) {
  var t, n, s = "";
  if (typeof e == "string" || typeof e == "number") s += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var r = e.length;
    for (t = 0; t < r; t++) e[t] && (n = Xo(e[t])) && (s && (s += " "), s += n);
  } else for (n in e) e[n] && (s && (s += " "), s += n);
  return s;
}
function $f() {
  for (var e, t, n = 0, s = "", r = arguments.length; n < r; n++) (e = arguments[n]) && (t = Xo(e)) && (s && (s += " "), s += t);
  return s;
}
function eu(e) {
  return typeof e == "object" ? $f(e) : e ?? "";
}
function tu(e, t, n) {
  var s = e == null ? "" : "" + e;
  return s = s ? s + " " + t : t, s === "" ? null : s;
}
function Cl(e, t = !1) {
  var n = t ? " !important;" : ";", s = "";
  for (var r of Object.keys(e)) {
    var i = e[r];
    i != null && i !== "" && (s += " " + r + ": " + i + n);
  }
  return s;
}
function gi(e) {
  return e[0] !== "-" || e[1] !== "-" ? e.toLowerCase() : e;
}
function nu(e, t) {
  if (t) {
    var n = "", s, r;
    if (Array.isArray(t) ? (s = t[0], r = t[1]) : s = t, e) {
      e = String(e).replaceAll(/\/\*.*?\*\//g, "").trim();
      var i = !1, l = 0, o = !1, a = [];
      s && a.push(...Object.keys(s).map(gi)), r && a.push(...Object.keys(r).map(gi));
      var f = 0, c = -1;
      const w = e.length;
      for (var d = 0; d < w; d++) {
        var y = e[d];
        if (o ? y === "/" && e[d - 1] === "*" && (o = !1) : i ? i === y && (i = !1) : y === "/" && e[d + 1] === "*" ? o = !0 : y === '"' || y === "'" ? i = y : y === "(" ? l++ : y === ")" && l--, !o && i === !1 && l === 0) {
          if (y === ":" && c === -1)
            c = d;
          else if (y === ";" || d === w - 1) {
            if (c !== -1) {
              var h = gi(e.substring(f, c).trim());
              if (!a.includes(h)) {
                y !== ";" && d++;
                var p = e.substring(f, d).trim();
                n += " " + p + ";";
              }
            }
            f = d + 1, c = -1;
          }
        }
      }
    }
    return s && (n += Cl(s)), r && (n += Cl(r, !0)), n = n.trim(), n === "" ? null : n;
  }
  return e == null ? null : String(e);
}
function su(e, t, n, s, r, i) {
  var l = (
    /** @type {any} */
    e[Ti]
  );
  if (H || l !== n || l === void 0) {
    var o = tu(n, s);
    (!H || o !== e.getAttribute("class")) && (o == null ? e.removeAttribute("class") : e.className = o), e[Ti] = n;
  }
  return i;
}
function mi(e, t = {}, n, s) {
  for (var r in n) {
    var i = n[r];
    t[r] !== i && (n[r] == null ? e.style.removeProperty(r) : e.style.setProperty(r, i, s));
  }
}
function Vt(e, t, n, s) {
  var r = (
    /** @type {any} */
    e[Ei]
  );
  if (H || r !== t) {
    var i = nu(t, s);
    (!H || i !== e.getAttribute("style")) && (i == null ? e.removeAttribute("style") : e.style.cssText = i), e[Ei] = t;
  } else s && (Array.isArray(s) ? (mi(e, n?.[0], s[0]), mi(e, n?.[1], s[1], "important")) : mi(e, n, s));
  return s;
}
function ru(e, t) {
  t ? e.hasAttribute("selected") || e.setAttribute("selected", "") : e.removeAttribute("selected");
}
function iu(e, t) {
  var n = e.__defaultValue, s = e.multiple, r = s ? n ?? [] : null;
  if (!(s && !Ys(r))) {
    e.selectedIndex;
    for (var i of e.options) {
      var l = _n(i);
      ru(
        i,
        s ? (
          /** @type {any[]} */
          r.includes(l)
        ) : bo(l, n)
      );
    }
  }
}
function Qe(e, t, n = !1) {
  if (e.multiple) {
    if (t == null)
      return;
    if (!Ys(t))
      return Za();
    for (var s of e.options)
      s.selected = t.includes(_n(s));
    return;
  }
  for (s of e.options) {
    var r = _n(s);
    if (bo(r, t)) {
      s.selected = !0;
      return;
    }
  }
  (!n || t !== void 0) && (e.selectedIndex = -1);
}
function ge(e) {
  var t = new MutationObserver((n) => {
    n.every(lu) || ("__defaultValue" in e && iu(e), "__value" in e && Qe(e, e.__value));
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
  }), Oo(() => {
    t.disconnect();
  });
}
function rn(e, t, n = t) {
  var s = /* @__PURE__ */ new WeakSet(), r = !0;
  io(e, "change", (i) => {
    var l = i ? "[selected]" : ":checked", o;
    if (e.multiple)
      o = [].map.call(e.querySelectorAll(l), _n);
    else {
      var a = e.querySelector(l) ?? // will fall back to first non-disabled option if no option is selected
      e.querySelector("option:not([disabled])");
      o = a && _n(a);
    }
    n(o), e.__value = o, q !== null && s.add(q);
  }), Io(() => {
    var i = t();
    if (e === document.activeElement) {
      var l = (
        /** @type {Batch} */
        q
      );
      if (s.has(l))
        return;
    }
    if (Qe(e, i, r), r && i === void 0) {
      var o = e.querySelector(":checked");
      o !== null && (i = _n(o), n(i));
    }
    e.__value = i, r = !1;
  });
}
function _n(e) {
  return "__value" in e ? e.__value : e.value;
}
function lu(e) {
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
const ou = Symbol("is custom element"), au = Symbol("is html"), fu = Ul ? "link" : "LINK", uu = Ul ? "progress" : "PROGRESS";
function ln(e) {
  if (H) {
    var t = !1, n = () => {
      if (!t) {
        if (t = !0, e.hasAttribute("value")) {
          var s = e.value;
          Ee(e, "value", null), e.value = s;
        }
        if (e.hasAttribute("checked")) {
          var r = e.checked;
          Ee(e, "checked", null), e.checked = r;
        }
      }
    };
    e[Zn] = n, mt(n), ro();
  }
}
function Wn(e, t) {
  var n = Yo(e);
  n.value === (n.value = // treat null and undefined the same for the initial value
  t ?? void 0) || // @ts-expect-error
  // `progress` elements always need their value set when it's `0`
  e.value === t && (t !== 0 || e.nodeName !== uu) || (e.value = t ?? "");
}
function Ee(e, t, n, s) {
  var r = Yo(e);
  H && (r[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === fu) || r[t] !== (r[t] = n) && (t === "loading" && (e[Ya] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && cu(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Yo(e) {
  return (
    /** @type {Record<string | symbol, unknown>} **/
    /** @type {any} */
    e[Ls] ?? (e[Ls] = {
      [ou]: e.nodeName.includes("-"),
      [au]: e.namespaceURI === ja
    })
  );
}
var Fl = /* @__PURE__ */ new Map();
function cu(e) {
  var t = e.getAttribute("is") || e.nodeName, n = Fl.get(t);
  if (n) return n;
  Fl.set(t, n = /* @__PURE__ */ new Set());
  for (var s, r = e, i = Element.prototype; i !== r; ) {
    s = Ga(r);
    for (var l in s)
      s[l].set && // better safe than sorry, we don't want spread attributes to mess with HTML content
      l !== "innerHTML" && l !== "textContent" && l !== "innerText" && n.add(l);
    r = jl(r);
  }
  return n;
}
function du(e, t, n = t) {
  var s = /* @__PURE__ */ new WeakSet();
  io(e, "input", async (r) => {
    var i = r ? e.defaultValue : e.value;
    if (i = yi(e) ? bi(i) : i, n(i), q !== null && s.add(q), await Nf(), i !== (i = t())) {
      var l = e.selectionStart, o = e.selectionEnd, a = e.value.length;
      if (e.value = i ?? "", o !== null) {
        var f = e.value.length;
        l === o && o === a && f > a ? (e.selectionStart = f, e.selectionEnd = f) : (e.selectionStart = l, e.selectionEnd = Math.min(o, f));
      }
    }
  }), // If we are hydrating and the value has since changed,
  // then use the updated value from the input instead.
  (H && e.defaultValue !== e.value || // If defaultValue is set, then value == defaultValue
  // TODO Svelte 6: remove input.value check and set to empty string?
  nr(t) == null && e.value) && (n(yi(e) ? bi(e.value) : e.value), q !== null && s.add(q)), Do(() => {
    var r = t();
    if (e === document.activeElement) {
      var i = (
        /** @type {Batch} */
        q
      );
      if (s.has(i))
        return;
    }
    yi(e) && r === bi(e.value) || e.type === "date" && !r && !e.value || r !== e.value && (e.value = r ?? "");
  });
}
function yi(e) {
  var t = e.type;
  return t === "number" || t === "range";
}
function bi(e) {
  return e === "" ? null : +e;
}
function Jo(e, t, n) {
  if (e == null)
    return t(void 0), n && n(void 0), Jt;
  const s = nr(
    () => e.subscribe(
      t,
      // @ts-expect-error
      n
    )
  );
  return s.unsubscribe ? () => s.unsubscribe() : s;
}
const on = [];
function hu(e, t) {
  return {
    subscribe: Zo(e, t).subscribe
  };
}
function Zo(e, t = Jt) {
  let n = null;
  const s = /* @__PURE__ */ new Set();
  function r(o) {
    if (Jl(e, o) && (e = o, n)) {
      const a = !on.length;
      for (const f of s)
        f[1](), on.push(f, e);
      if (a) {
        for (let f = 0; f < on.length; f += 2)
          on[f][0](on[f + 1]);
        on.length = 0;
      }
    }
  }
  function i(o) {
    r(o(
      /** @type {T} */
      e
    ));
  }
  function l(o, a = Jt) {
    const f = [o, a];
    return s.add(f), s.size === 1 && (n = t(r, i) || Jt), o(
      /** @type {T} */
      e
    ), () => {
      s.delete(f), s.size === 0 && n && (n(), n = null);
    };
  }
  return { set: r, update: i, subscribe: l };
}
function vu(e, t, n) {
  const s = !Array.isArray(e), r = s ? [e] : e;
  if (!r.every(Boolean))
    throw new Error("derived() expects stores as input, got a falsy value");
  const i = t.length < 2;
  return hu(n, (l, o) => {
    let a = !1;
    const f = [];
    let c = 0, d = Jt;
    const y = () => {
      if (c)
        return;
      d();
      const p = t(s ? f[0] : f, l, o);
      i ? l(p) : d = typeof p == "function" ? p : Jt;
    }, h = r.map(
      (p, w) => Jo(
        p,
        (g) => {
          f[w] = g, c &= ~(1 << w), a && y();
        },
        () => {
          c |= 1 << w;
        }
      )
    );
    return a = !0, y(), function() {
      Wl(h), d(), a = !1;
    };
  });
}
function Qo(e) {
  let t;
  return Jo(e, (n) => t = n)(), t;
}
let Fs = !1;
function _u(e) {
  var t = Fs;
  try {
    return Fs = !1, [e(), Fs];
  } finally {
    Fs = t;
  }
}
function ne(e, t, n, s) {
  var r = !0, i = (n & za) !== 0, l = (n & Pa) !== 0, o = (
    /** @type {V} */
    s
  ), a = !0, f = (
    /** @type {Derived<V> | undefined} */
    void 0
  ), c = () => l && r ? (f ?? (f = /* @__PURE__ */ ns(
    /** @type {() => V} */
    s
  )), m(f)) : (a && (a = !1, o = l ? nr(
    /** @type {() => V} */
    s
  ) : (
    /** @type {V} */
    s
  )), o);
  let d;
  if (i) {
    var y = hn in e || Kl in e;
    d = cn(e, t)?.set ?? (y && t in e ? (v) => e[t] = v : void 0);
  }
  var h, p = !1;
  i ? [h, p] = _u(() => (
    /** @type {V} */
    e[t]
  )) : h = /** @type {V} */
  e[t], h === void 0 && s !== void 0 && (h = c(), d && (of(), d(h)));
  var w;
  if (w = () => {
    var v = (
      /** @type {V} */
      e[t]
    );
    return v === void 0 ? c() : (a = !0, v);
  }, !(n & qa))
    return w;
  if (d) {
    var g = e.$$legacy;
    return (
      /** @type {() => V} */
      function(v, _) {
        return arguments.length > 0 ? ((!_ || g || p) && d(_ ? w() : v), v) : w();
      }
    );
  }
  var O = !1, E = (n & Na ? ns : oo)(() => (O = !1, w()));
  i && m(E);
  var A = (
    /** @type {Effect} */
    W
  );
  return (
    /** @type {() => V} */
    function(v, _) {
      if (arguments.length > 0) {
        const T = _ ? m(E) : i ? un(v) : v;
        return je(E, T), O = !0, o !== void 0 && (o = T), v;
      }
      return yt && O || A.f & le ? E.v : m(E);
    }
  );
}
function pu(e) {
  return class extends gu {
    /** @param {any} options */
    constructor(t) {
      super({
        component: e,
        ...t
      });
    }
  };
}
var pt, Ne;
class gu {
  /**
   * @param {ComponentConstructorOptions & {
   *  component: any;
   * }} options
   */
  constructor(t) {
    /** @type {any} */
    N(this, pt);
    /** @type {Record<string, any>} */
    N(this, Ne);
    var n = /* @__PURE__ */ new Map(), s = (i, l) => {
      var o = /* @__PURE__ */ mo(l, !1, !1);
      return n.set(i, o), o;
    };
    const r = new Proxy(
      { ...t.props || {}, $$events: {} },
      {
        get(i, l) {
          return m(n.get(l) ?? s(l, Reflect.get(i, l)));
        },
        has(i, l) {
          return l === Kl ? !0 : (m(n.get(l) ?? s(l, Reflect.get(i, l))), Reflect.has(i, l));
        },
        set(i, l, o) {
          return je(n.get(l) ?? s(l, o), o), Reflect.set(i, l, o);
        }
      }
    );
    C(this, Ne, (t.hydrate ? Kf : Ko)(t.component, {
      target: t.target,
      anchor: t.anchor,
      props: r,
      context: t.context,
      intro: t.intro ?? !1,
      recover: t.recover,
      transformError: t.transformError
    })), (!t?.props?.$$host || t.sync === !1) && ho(), C(this, pt, r.$$events);
    for (const i of Object.keys(u(this, Ne)))
      i === "$set" || i === "$destroy" || i === "$on" || Vi(this, i, {
        get() {
          return u(this, Ne)[i];
        },
        /** @param {any} value */
        set(l) {
          u(this, Ne)[i] = l;
        },
        enumerable: !0
      });
    u(this, Ne).$set = /** @param {Record<string, any>} next */
    (i) => {
      Object.assign(r, i);
    }, u(this, Ne).$destroy = () => {
      Uf(u(this, Ne));
    };
  }
  /** @param {Record<string, any>} props */
  $set(t) {
    u(this, Ne).$set(t);
  }
  /**
   * @param {string} event
   * @param {(...args: any[]) => any} callback
   * @returns {any}
   */
  $on(t, n) {
    u(this, pt)[t] = u(this, pt)[t] || [];
    const s = (...r) => n.call(this, ...r);
    return u(this, pt)[t].push(s), () => {
      u(this, pt)[t] = u(this, pt)[t].filter(
        /** @param {any} fn */
        (r) => r !== s
      );
    };
  }
  $destroy() {
    u(this, Ne).$destroy();
  }
}
pt = new WeakMap(), Ne = new WeakMap();
function mu(e) {
  return typeof e == "object" ? e.key : e;
}
function yu(e, t) {
  const n = e.length;
  return new Proxy(e, {
    get(s, r, i) {
      if (typeof r == "string") {
        const l = r.charCodeAt(0);
        if (l >= 48 && l <= 57) {
          const o = +r;
          if (Number.isInteger(o) && o >= 0 && o < n) {
            let a = s[o];
            if (typeof a != "object") {
              const f = t[o * 2];
              a = s[o] = {
                index: o,
                key: a,
                start: f,
                size: t[o * 2 + 1],
                end: f + t[o * 2 + 1],
                lane: 0
              };
            }
            return a;
          }
        }
        if (r === "length") return n;
      }
      return Reflect.get(s, r, i);
    }
  });
}
function an(e, t, n) {
  let s = n.initialDeps ?? [], r, i = !0;
  function l() {
    const o = e();
    return (o.length !== s.length || o.some((f, c) => s[c] !== f)) && (s = o, r = t(...o), n?.onChange && !(i && n.skipInitialOnChange) && n.onChange(r), i = !1), r;
  }
  return l.updateDeps = (o) => {
    s = o;
  }, l;
}
function Ml(e, t) {
  if (e === void 0)
    throw new Error("Unexpected undefined");
  return e;
}
const Ll = (e, t) => Math.abs(e - t) < 1.01, bu = (e, t, n) => {
  let s;
  return Object.assign(
    function(...r) {
      e.clearTimeout(s), s = e.setTimeout(() => t.apply(this, r), n);
    },
    {
      // The handle is closure-local, so a caller that has already
      // unsubscribed has no way to stop a queued call. Teardown paths use
      // this to drop the pending invocation instead of letting it land.
      cancel: () => {
        e.clearTimeout(s);
      }
    }
  );
};
let Gn;
const wi = () => {
  if (Gn !== void 0) return Gn;
  if (typeof navigator > "u") return Gn = !1;
  if (/iP(hone|od|ad)/.test(navigator.userAgent)) return Gn = !0;
  const e = navigator.maxTouchPoints;
  return Gn = navigator.platform === "MacIntel" && e !== void 0 && e > 0;
}, kl = (e) => {
  const { offsetWidth: t, offsetHeight: n } = e;
  return { width: t, height: n };
}, wu = (e) => e, Su = (e) => {
  const t = Math.max(e.startIndex - e.overscan, 0), s = Math.min(e.endIndex + e.overscan, e.count - 1) - t + 1, r = new Array(s);
  for (let i = 0; i < s; i++)
    r[i] = t + i;
  return r;
}, Tu = (e, t) => {
  const n = e.scrollElement;
  if (!n)
    return;
  const s = e.targetWindow;
  if (!s)
    return;
  const r = (l) => {
    const { width: o, height: a } = l;
    t({ width: Math.round(o), height: Math.round(a) });
  };
  if (r(kl(n)), !s.ResizeObserver)
    return () => {
    };
  const i = new s.ResizeObserver((l) => {
    const o = () => {
      const a = l[0];
      if (a?.borderBoxSize) {
        const f = a.borderBoxSize[0];
        if (f) {
          r({ width: f.inlineSize, height: f.blockSize });
          return;
        }
      }
      r(kl(n));
    };
    e.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(o) : o();
  });
  return i.observe(n, { box: "border-box" }), () => {
    i.unobserve(n);
  };
}, Hs = {
  passive: !0
}, Eu = typeof window > "u" ? !0 : "onscrollend" in window, Au = (e, t, n) => {
  const s = e.scrollElement;
  if (!s)
    return;
  const r = e.targetWindow;
  if (!r)
    return;
  const i = e.options.useScrollendEvent && Eu;
  let l = 0;
  const o = i ? null : bu(
    r,
    () => t(n(s), !1),
    e.options.isScrollingResetDelay
  ), a = (d) => () => {
    l = n(s), o?.(), t(l, d);
  }, f = a(!0), c = a(!1);
  return s.addEventListener("scroll", f, Hs), i && s.addEventListener("scrollend", c, Hs), () => {
    s.removeEventListener("scroll", f), i && s.removeEventListener("scrollend", c), o?.cancel();
  };
}, Ou = (e, t) => Au(e, t, (n) => {
  const { horizontal: s, isRtl: r } = e.options;
  return s ? n.scrollLeft * (r && -1 || 1) : n.scrollTop;
}), xu = (e, t, n) => {
  if (n.options.useCachedMeasurements) {
    const s = n.indexFromElement(e), r = n.options.getItemKey(s);
    return n.itemSizeCache.get(r) ?? n.options.estimateSize(s);
  }
  if (t?.borderBoxSize) {
    const s = t.borderBoxSize[0];
    if (s)
      return Math.round(
        s[n.options.horizontal ? "inlineSize" : "blockSize"]
      );
  }
  if (!t) {
    const s = n.indexFromElement(e), r = n.options.getItemKey(s), i = n.itemSizeCache.get(r);
    if (i !== void 0)
      return i;
  }
  return e[n.options.horizontal ? "offsetWidth" : "offsetHeight"];
}, Iu = (e, {
  adjustments: t = 0,
  behavior: n
}, s) => {
  var r, i;
  (i = (r = s.scrollElement) == null ? void 0 : r.scrollTo) == null || i.call(r, {
    [s.options.horizontal ? "left" : "top"]: e + t,
    behavior: n
  });
}, Du = Iu;
function Ru(e, t, n, s) {
  if (t === 0) return !1;
  const r = s(0), i = /* @__PURE__ */ new Set();
  let l = 0;
  for (; l < e; ) {
    const a = n(l);
    if (a === r) break;
    i.add(a), l++;
  }
  const o = e - l;
  if (o === 0 || o >= t) return !1;
  for (let a = 0; a < o; a++)
    if (s(a) !== n(l + a)) return !1;
  for (let a = o; a < t; a++)
    if (i.has(s(a))) return !1;
  return !0;
}
class Cu {
  constructor(t) {
    this.unsubs = [], this.scrollElement = null, this.targetWindow = null, this.isScrolling = !1, this.scrollState = null, this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache = /* @__PURE__ */ new Map(), this.itemSizeCacheVersion = 0, this.laneAssignments = /* @__PURE__ */ new Map(), this.pendingMin = null, this.prevLanes = void 0, this.lanesChangedFlag = !1, this.lanesSettling = !1, this.pendingScrollAnchor = null, this.scrollRect = null, this.scrollOffset = null, this.scrollDirection = null, this.scrollAdjustments = 0, this._iosDeferredAdjustment = 0, this._iosTouching = !1, this._iosJustTouchEnded = !1, this._iosTouchEndTimerId = null, this._intendedScrollOffset = null, this._clampedAdjustment = null, this.elementsCache = /* @__PURE__ */ new Map(), this.now = () => {
      var n, s, r;
      return ((r = (s = (n = this.targetWindow) == null ? void 0 : n.performance) == null ? void 0 : s.now) == null ? void 0 : r.call(s)) ?? Date.now();
    }, this.observer = /* @__PURE__ */ (() => {
      let n = null;
      const s = () => n || (!this.targetWindow || !this.targetWindow.ResizeObserver ? null : n = new this.targetWindow.ResizeObserver((r) => {
        r.forEach((i) => {
          const l = () => {
            const o = i.target, a = this.indexFromElement(o);
            if (!o.isConnected) {
              this.observer.unobserve(o);
              for (const [f, c] of this.elementsCache)
                if (c === o) {
                  this.elementsCache.delete(f);
                  break;
                }
              return;
            }
            this.isIndexInRange(a) && this.shouldMeasureDuringScroll(a) && this.resizeItem(
              a,
              this.options.measureElement(o, i, this)
            );
          };
          this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(l) : l();
        });
      }));
      return {
        disconnect: () => {
          var r;
          (r = s()) == null || r.disconnect(), n = null;
        },
        observe: (r) => {
          var i;
          return (i = s()) == null ? void 0 : i.observe(r, { box: "border-box" });
        },
        unobserve: (r) => {
          var i;
          return (i = s()) == null ? void 0 : i.unobserve(r);
        }
      };
    })(), this.range = null, this.setOptions = (n) => {
      var s;
      const r = {
        debug: !1,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: !1,
        getItemKey: wu,
        rangeExtractor: Su,
        onChange: () => {
        },
        measureElement: xu,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        anchorTo: "start",
        followOnAppend: !1,
        scrollEndThreshold: 1,
        isScrollingResetDelay: 150,
        enabled: !0,
        isRtl: !1,
        useScrollendEvent: !1,
        useAnimationFrameWithResizeObserver: !1,
        laneAssignmentMode: "estimate",
        useCachedMeasurements: !1
      };
      for (const d in n) {
        const y = n[d];
        y !== void 0 && (r[d] = y);
      }
      const i = this.options;
      let l = null, o = null, a = !1;
      if (i !== void 0 && i.enabled && r.enabled && r.anchorTo === "end" && this.scrollElement !== null) {
        const d = i.count, y = r.count, h = this.getMeasurements(), p = ((s = this._singleLaneMeasurements) == null ? void 0 : s.items) ?? h, w = (v) => mu(p[v]), g = d > 0 ? w(0) : null, O = d > 0 ? w(d - 1) : null;
        if (y !== d || d > 0 && y > 0 && (r.getItemKey(0) !== g || r.getItemKey(y - 1) !== O)) {
          a = !0;
          const v = d > 0 ? this.getVirtualItemForOffset(this.getScrollOffset()) ?? h[0] : null;
          v && (l = [v.key, this.getScrollOffset() - v.start]);
          const _ = r.followOnAppend === !0 ? "auto" : r.followOnAppend || null;
          _ && y > 0 && this.isAtEnd(i.scrollEndThreshold) && (d === 0 || r.getItemKey(y - 1) !== O) && (y > d || Ru(
            d,
            y,
            w,
            r.getItemKey
          )) && (o = _);
        }
      }
      this.options = r, a && (this.pendingMin = 0, this.itemSizeCacheVersion++);
      let f = !1, c = 0;
      if (l && this.scrollOffset !== null) {
        const [d, y] = l, h = this.getMeasurements(), { count: p, getItemKey: w } = this.options;
        let g = 0;
        for (; g < p && w(g) !== d; )
          g++;
        if (g < p) {
          const O = h[g];
          if (O) {
            const E = Math.max(0, O.start + y);
            !o && E !== this.scrollOffset && (c = E - this.scrollOffset, this.scrollOffset = E, f = !0);
          }
        }
      }
      (f || o) && (this.pendingScrollAnchor = [
        f ? l[0] : null,
        f ? l[1] : 0,
        o,
        c
      ]);
    }, this.notify = (n) => {
      var s, r;
      (r = (s = this.options).onChange) == null || r.call(s, this, n);
    }, this.maybeNotify = an(
      () => (this.calculateRange(), [
        this.isScrolling,
        this.range ? this.range.startIndex : null,
        this.range ? this.range.endIndex : null
      ]),
      (n) => {
        this.notify(n);
      },
      {
        key: !1,
        debug: () => this.options.debug,
        initialDeps: [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ]
      }
    ), this.cleanup = () => {
      this.unsubs.filter(Boolean).forEach((n) => n()), this.unsubs = [], this.observer.disconnect(), this.rafId != null && this.targetWindow && (this.targetWindow.cancelAnimationFrame(this.rafId), this.rafId = null), this.scrollState = null, this.isScrolling = !1, this.scrollDirection = null, this._iosDeferredAdjustment = 0, this._iosTouching = !1, this._iosJustTouchEnded = !1, this._clampedAdjustment = null, this.scrollElement = null, this.targetWindow = null;
    }, this._didMount = () => () => {
      this.cleanup();
    }, this._willUpdate = () => {
      var n, s;
      const r = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== r) {
        if (this.cleanup(), !r) {
          this.maybeNotify();
          return;
        }
        if (this.scrollElement = r, this.scrollElement && "ownerDocument" in this.scrollElement ? this.targetWindow = this.scrollElement.ownerDocument.defaultView : this.targetWindow = ((n = this.scrollElement) == null ? void 0 : n.window) ?? null, this.elementsCache.forEach((l) => {
          this.observer.observe(l);
        }), this.unsubs.push(
          this.options.observeElementRect(this, (l) => {
            this.scrollRect = l, this.maybeNotify();
          })
        ), this.unsubs.push(
          this.options.observeElementOffset(this, (l, o) => {
            if (o && this._intendedScrollOffset === null && l === this.scrollOffset)
              return;
            this._intendedScrollOffset !== null && Math.abs(l - this._intendedScrollOffset) < 1.5 && (l = this._intendedScrollOffset), this._intendedScrollOffset = null, this._clampedAdjustment !== null && Math.abs(l - this._clampedAdjustment.maxAtWrite) >= 1.5 && (this._clampedAdjustment = null), this.scrollAdjustments = 0;
            const a = this.getScrollOffset();
            this.scrollDirection = o ? a === l ? this.scrollDirection : a < l ? "forward" : "backward" : null, this.scrollOffset = l, this.isScrolling = o, this._flushIosDeferredIfReady(), this.scrollState && this.scheduleScrollReconcile(), this.maybeNotify();
          })
        ), "addEventListener" in this.scrollElement) {
          const l = this.scrollElement, o = () => {
            this._iosTouching = !0, this._iosJustTouchEnded = !1, this._iosTouchEndTimerId !== null && this.targetWindow != null && (this.targetWindow.clearTimeout(this._iosTouchEndTimerId), this._iosTouchEndTimerId = null);
          }, a = () => {
            this._iosTouching = !1, !(!wi() || this.targetWindow == null) && (this._iosJustTouchEnded = !0, this._iosTouchEndTimerId = this.targetWindow.setTimeout(() => {
              this._iosJustTouchEnded = !1, this._iosTouchEndTimerId = null, this._flushIosDeferredIfReady();
            }, 150));
          };
          l.addEventListener(
            "touchstart",
            o,
            Hs
          ), l.addEventListener(
            "touchend",
            a,
            Hs
          ), this.unsubs.push(() => {
            l.removeEventListener("touchstart", o), l.removeEventListener("touchend", a), this._iosTouchEndTimerId !== null && this.targetWindow != null && (this.targetWindow.clearTimeout(this._iosTouchEndTimerId), this._iosTouchEndTimerId = null);
          });
        }
        this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        });
      }
      const i = this.pendingScrollAnchor;
      if (this.pendingScrollAnchor = null, i && this.scrollElement && this.options.enabled) {
        const [l, o, a, f] = i;
        l !== null && !a && (wi() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded) ? f !== 0 && (this._iosDeferredAdjustment += f) : ((s = this.scrollState) == null ? void 0 : s.behavior) === "smooth" && !Ll(
          this.getScrollOffset() - f,
          this.scrollState.lastTargetOffset
        ) || this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        })), a && this.scrollToEnd({ behavior: a });
      }
      this._retryClampedAdjustment();
    }, this._retryClampedAdjustment = () => {
      if (this._clampedAdjustment === null || !this.scrollElement || !this.options.enabled)
        return;
      const { target: n, maxAtWrite: s } = this._clampedAdjustment, r = this.getMaxScrollOffset();
      r > s + 0.5 && (this._clampedAdjustment = n > r + 0.5 ? { target: n, maxAtWrite: r } : null, this._scrollToOffset(n, {
        adjustments: void 0,
        behavior: void 0
      }));
    }, this._flushIosDeferredIfReady = () => {
      if (this._iosDeferredAdjustment === 0 || this.isScrolling || this._iosTouching || this._iosJustTouchEnded) return;
      const n = this.getScrollOffset(), s = this.getMaxScrollOffset();
      if (n < 0 || n > s) return;
      if (this._iosDeferredAdjustment < 0 && n >= s - 1) {
        this._iosDeferredAdjustment = 0;
        return;
      }
      const r = this._iosDeferredAdjustment;
      this._iosDeferredAdjustment = 0, this._scrollToOffset(n, {
        adjustments: this.scrollAdjustments += r,
        behavior: void 0
      });
    }, this.rafId = null, this.getSize = () => this.options.enabled ? (this.scrollRect = this.scrollRect ?? this.options.initialRect, this.scrollRect[this.options.horizontal ? "width" : "height"]) : (this.scrollRect = null, 0), this.getScrollOffset = () => this.options.enabled ? (this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset), this.scrollOffset) : (this.scrollOffset = null, 0), this.getMeasurementOptions = an(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled,
        this.options.lanes,
        this.options.laneAssignmentMode,
        this.options.gap
      ],
      (n, s, r, i, l, o, a, f) => (this.prevLanes !== void 0 && this.prevLanes !== o && (this.lanesChangedFlag = !0), this.prevLanes = o, this.pendingMin = null, {
        count: n,
        paddingStart: s,
        scrollMargin: r,
        getItemKey: i,
        enabled: l,
        lanes: o,
        laneAssignmentMode: a,
        gap: f
      }),
      {
        key: !1
      }
    ), this.isIndexInRange = (n) => n >= 0 && n < this.options.count, this.getMeasurements = an(
      () => [this.getMeasurementOptions(), this.itemSizeCacheVersion],
      ({
        count: n,
        paddingStart: s,
        scrollMargin: r,
        getItemKey: i,
        enabled: l,
        lanes: o,
        laneAssignmentMode: a,
        gap: f
      }, c) => {
        var d;
        const y = this.itemSizeCache;
        if (!l)
          return this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), [];
        if (this.laneAssignments.size > n)
          for (const E of this.laneAssignments.keys())
            E >= n && this.laneAssignments.delete(E);
        this.lanesChangedFlag && (this.lanesChangedFlag = !1, this.lanesSettling = !0, this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), this.pendingMin = null), this.measurementsCache.length === 0 && !this.lanesSettling && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((E) => {
          this.itemSizeCache.set(E.key, E.size);
        }));
        const h = this.lanesSettling ? 0 : this.pendingMin ?? 0;
        if (this.pendingMin = null, this.lanesSettling && this.measurementsCache.length === n && (this.lanesSettling = !1), o === 1) {
          const E = n * 2;
          let A = (d = this._singleLaneMeasurements) == null ? void 0 : d.flat;
          if (!A || A.length < E) {
            const b = new Float64Array(E);
            A && h > 0 && b.set(A.subarray(0, h * 2)), A = b;
          }
          const v = h === 0 ? new Array(n) : this._singleLaneMeasurements.items.slice();
          let _;
          if (h === 0)
            _ = s + r;
          else {
            const b = h - 1;
            _ = A[b * 2] + A[b * 2 + 1] + f;
          }
          for (let b = h; b < n; b++) {
            const x = i(b);
            v[b] = x;
            const R = y.get(x), j = typeof R == "number" ? R : this.options.estimateSize(b);
            A[b * 2] = _, A[b * 2 + 1] = j, _ += j + f;
          }
          this._singleLaneMeasurements = { flat: A, items: v };
          const T = yu(v, A);
          return this.measurementsCache = T, T;
        }
        const p = this.measurementsCache.slice(0, h), w = new Array(o).fill(
          void 0
        ), g = new Float64Array(o);
        let O = 0;
        for (let E = 0; E < h; E++) {
          const A = p[E];
          A && (w[A.lane] === void 0 && O++, w[A.lane] = E, g[A.lane] = A.end);
        }
        for (let E = h; E < n; E++) {
          const A = i(E), v = this.laneAssignments.get(E);
          let _, T;
          const b = a === "estimate" || y.has(A);
          if (v !== void 0 && this.options.lanes > 1) {
            _ = v;
            const G = w[_], P = G !== void 0 ? p[G] : void 0;
            T = P ? P.end + f : s + r;
          } else if (O === o) {
            let G = 0, P = g[0], $ = w[0];
            for (let Z = 1; Z < o; Z++) {
              const Nt = g[Z];
              (Nt < P || Nt === P && w[Z] < $) && (G = Z, P = Nt, $ = w[Z]);
            }
            _ = G, T = P + f, b && this.laneAssignments.set(E, _);
          } else
            _ = E % this.options.lanes, T = s + r, b && this.laneAssignments.set(E, _);
          const x = y.get(A), R = typeof x == "number" ? x : this.options.estimateSize(E), j = T + R;
          p[E] = {
            index: E,
            start: T,
            size: R,
            end: j,
            key: A,
            lane: _
          }, w[_] === void 0 && O++, w[_] = E, g[_] = j;
        }
        return this.measurementsCache = p, p;
      },
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.calculateRange = an(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (n, s, r, i) => n.length === 0 || s === 0 ? (this.range = null, null) : (this.range = Mu(
        n,
        s,
        r,
        i,
        // Pass the typed array so binary search + forward-walk can read
        // start/end directly from Float64Array, skipping the Proxy traps.
        i === 1 && this._singleLaneMeasurements !== null ? this._singleLaneMeasurements.flat : null
      ), this.range),
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.getVirtualIndexes = an(
      () => {
        let n = null, s = null;
        const r = this.calculateRange();
        return r && (n = r.startIndex, s = r.endIndex), this.maybeNotify.updateDeps([this.isScrolling, n, s]), [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          n,
          s
        ];
      },
      (n, s, r, i, l) => i === null || l === null ? [] : n({
        startIndex: i,
        endIndex: l,
        overscan: s,
        count: r
      }),
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.indexFromElement = (n) => {
      const s = this.options.indexAttribute, r = n.getAttribute(s);
      return r ? parseInt(r, 10) : (console.warn(
        `Missing attribute name '${s}={index}' on measured element.`
      ), -1);
    }, this.shouldMeasureDuringScroll = (n) => {
      var s;
      if (!this.scrollState || this.scrollState.behavior !== "smooth")
        return !0;
      const r = this.scrollState.index ?? ((s = this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)) == null ? void 0 : s.index);
      if (r !== void 0 && this.range) {
        const i = Math.max(
          this.options.overscan,
          Math.ceil((this.range.endIndex - this.range.startIndex) / 2)
        ), l = Math.max(0, r - i), o = Math.min(
          this.options.count - 1,
          r + i
        );
        return n >= l && n <= o;
      }
      return !0;
    }, this.measureElement = (n) => {
      if (!n) {
        this.elementsCache.forEach((l, o) => {
          l.isConnected || (this.observer.unobserve(l), this.elementsCache.delete(o));
        });
        return;
      }
      const s = this.indexFromElement(n);
      if (!this.isIndexInRange(s)) return;
      const r = this.options.getItemKey(s), i = this.elementsCache.get(r);
      i !== n && (i && this.observer.unobserve(i), this.observer.observe(n), this.elementsCache.set(r, n)), (!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(s) && this.resizeItem(s, this.options.measureElement(n, void 0, this));
    }, this.resizeItem = (n, s) => {
      var r, i, l;
      if (!this.isIndexInRange(n)) return;
      let o, a, f;
      const c = (r = this._singleLaneMeasurements) == null ? void 0 : r.flat;
      if (this.options.lanes === 1 && c != null)
        f = this.options.getItemKey(n), a = c[n * 2], o = c[n * 2 + 1];
      else {
        const h = this.measurementsCache[n];
        if (!h) return;
        f = h.key, a = h.start, o = h.size;
      }
      const d = this.itemSizeCache.get(f) ?? o, y = s - d;
      if (y !== 0) {
        const h = this.options.anchorTo === "end" && ((i = this.scrollState) == null ? void 0 : i.behavior) !== "smooth" && this.getVirtualDistanceFromEnd() <= this.options.scrollEndThreshold, p = h ? this.getTotalSize() : 0, w = this.getScrollOffset() + this.scrollAdjustments, O = !this.itemSizeCache.has(f) ? (
          // First measurement: compensate any item whose top sits above the
          // fold — the estimate→actual delta must be corrected regardless of
          // scroll direction, since the whole estimated block was above it.
          a < w
        ) : (
          // Re-measurement: only compensate an item that is ENTIRELY above the
          // fold. An item that merely *spans* the fold (top above, bottom
          // below — e.g. a streaming chat message growing at its bottom)
          // changes size *below* the anchor point, so shifting scrollTop by the
          // delta would drag the viewport downward on every growth (#1218).
          // Also skip during backward scroll to avoid the "items jump while
          // scrolling up" cascade.
          a + d <= w && this.scrollDirection !== "backward"
        ), E = ((l = this.scrollState) == null ? void 0 : l.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(
          // The callback expects a VirtualItem; build one lazily only
          // when the consumer actually supplied a custom predicate.
          this.measurementsCache[n] ?? {
            index: n,
            key: f,
            start: a,
            size: o,
            end: a + o,
            lane: 0
          },
          y,
          this
        ) : O);
        (this.pendingMin === null || n < this.pendingMin) && (this.pendingMin = n), this.itemSizeCache.set(f, s), this.itemSizeCacheVersion++;
        let A = !1;
        h ? A = this.applyScrollAdjustment(
          this.getTotalSize() - p
        ) : E && (A = this.applyScrollAdjustment(y)), this.notify(A), this._retryClampedAdjustment();
      }
    }, this.getVirtualItems = an(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (n, s) => {
        const r = [];
        for (let i = 0, l = n.length; i < l; i++) {
          const o = n[i], a = s[o];
          r.push(a);
        }
        return r;
      },
      {
        key: !1,
        debug: () => this.options.debug
      }
    ), this.getVirtualItemForOffset = (n) => {
      var s;
      const r = this.getMeasurements();
      if (r.length === 0)
        return;
      const i = (s = this._singleLaneMeasurements) == null ? void 0 : s.flat, l = this.options.lanes === 1 && i != null, o = $o(
        0,
        r.length - 1,
        l ? (a) => i[a * 2] : (a) => Ml(r[a]).start,
        n
      );
      return Ml(r[o]);
    }, this.getMaxScrollOffset = () => {
      if (!this.scrollElement) return 0;
      if ("scrollHeight" in this.scrollElement)
        return this.options.horizontal ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth : this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
      {
        const n = this.scrollElement.document.documentElement;
        return this.options.horizontal ? n.scrollWidth - this.scrollElement.innerWidth : n.scrollHeight - this.scrollElement.innerHeight;
      }
    }, this.getVirtualDistanceFromEnd = () => Math.max(
      this.getTotalSize() - this.getSize() - this.getScrollOffset(),
      0
    ), this.getDistanceFromEnd = () => Math.max(this.getMaxScrollOffset() - this.getScrollOffset(), 0), this.isAtEnd = (n = this.options.scrollEndThreshold) => this.getDistanceFromEnd() <= n, this.getOffsetForAlignment = (n, s, r = 0) => {
      if (!this.scrollElement) return 0;
      const i = this.getSize(), l = this.getScrollOffset();
      s === "auto" && (s = n >= l + i ? "end" : "start"), s === "center" ? n += (r - i) / 2 : s === "end" && (n -= i);
      const o = this.getMaxScrollOffset();
      return Math.max(Math.min(o, n), 0);
    }, this.getOffsetForIndex = (n, s = "auto") => {
      n = Math.max(0, Math.min(n, this.options.count - 1));
      const r = this.getSize(), i = this.getScrollOffset(), l = this.measurementsCache[n];
      if (!l) return;
      if (s === "auto")
        if (l.end >= i + r - this.options.scrollPaddingEnd)
          s = "end";
        else if (l.start <= i + this.options.scrollPaddingStart)
          s = "start";
        else
          return [i, s];
      if (s === "end" && n === this.options.count - 1)
        return [this.getMaxScrollOffset(), s];
      const o = s === "end" ? l.end + this.options.scrollPaddingEnd : l.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(o, s, l.size),
        s
      ];
    }, this.scrollToOffset = (n, { align: s = "start", behavior: r = "auto" } = {}) => {
      this._iosDeferredAdjustment = 0;
      const i = this.getOffsetForAlignment(n, s), l = this.now();
      this.scrollState = {
        index: null,
        align: s,
        behavior: r,
        startedAt: l,
        lastTargetOffset: i,
        stableFrames: 0
      }, this._scrollToOffset(i, { adjustments: void 0, behavior: r }), this.scheduleScrollReconcile();
    }, this.scrollToIndex = (n, {
      align: s = "auto",
      behavior: r = "auto"
    } = {}) => {
      this._iosDeferredAdjustment = 0, n = Math.max(0, Math.min(n, this.options.count - 1));
      const i = this.getOffsetForIndex(n, s);
      if (!i)
        return;
      const [l, o] = i, a = this.now();
      this.scrollState = {
        index: n,
        align: o,
        behavior: r,
        startedAt: a,
        lastTargetOffset: l,
        stableFrames: 0
      }, this._scrollToOffset(l, { adjustments: void 0, behavior: r }), this.scheduleScrollReconcile();
    }, this.scrollBy = (n, { behavior: s = "auto" } = {}) => {
      const r = this.getScrollOffset() + n, i = this.now();
      this.scrollState = {
        index: null,
        align: "start",
        behavior: s,
        startedAt: i,
        lastTargetOffset: r,
        stableFrames: 0
      }, this._scrollToOffset(r, { adjustments: void 0, behavior: s }), this.scheduleScrollReconcile();
    }, this.scrollToEnd = ({ behavior: n = "auto" } = {}) => {
      if (this.options.count > 0) {
        this.scrollToIndex(this.options.count - 1, {
          align: "end",
          behavior: n
        });
        return;
      }
      this.scrollToOffset(Math.max(this.getTotalSize() - this.getSize(), 0), {
        behavior: n
      });
    }, this.getTotalSize = () => {
      var n, s;
      const r = this.getMeasurements();
      let i;
      if (r.length === 0)
        i = this.options.paddingStart;
      else if (this.options.lanes === 1) {
        const l = r.length - 1, o = (n = this._singleLaneMeasurements) == null ? void 0 : n.flat;
        o != null ? i = o[l * 2] + o[l * 2 + 1] : i = ((s = r[l]) == null ? void 0 : s.end) ?? 0;
      } else {
        const l = Array(this.options.lanes).fill(null);
        let o = r.length - 1;
        for (; o >= 0 && l.some((a) => a === null); ) {
          const a = r[o];
          l[a.lane] === null && (l[a.lane] = a.end), o--;
        }
        i = Math.max(...l.filter((a) => a !== null));
      }
      return Math.max(
        i - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    }, this.takeSnapshot = () => {
      const n = [];
      if (this.itemSizeCache.size === 0) return n;
      const s = this.getMeasurements();
      for (const r of s)
        r && this.itemSizeCache.has(r.key) && n.push({
          index: r.index,
          key: r.key,
          start: r.start,
          size: r.size,
          end: r.end,
          lane: r.lane
        });
      return n;
    }, this._scrollToOffset = (n, {
      adjustments: s,
      behavior: r
    }) => {
      this._intendedScrollOffset = n + (s ?? 0), this.options.scrollToFn(n, { behavior: r, adjustments: s }, this);
    }, this.measure = () => {
      this.pendingMin = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), this.itemSizeCacheVersion++, this.notify(!1);
    }, this.setOptions(t);
  }
  // Returns `true` when it performed a synchronous `scrollTop` write this
  // tick, `false` when the delta was zero or the write was deferred (iOS).
  // `resizeItem` uses that to decide whether the follow-up `notify` must be
  // synchronous so the grown transforms commit in the same paint (#1227).
  applyScrollAdjustment(t, n) {
    if (t === 0) return !1;
    if (wi() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded))
      return this._iosDeferredAdjustment += t, !1;
    {
      const s = this.getScrollOffset() + this.scrollAdjustments + t, r = this.scrollElement, i = r !== null && ("scrollHeight" in r || "document" in r) ? this.getMaxScrollOffset() : null;
      return this._clampedAdjustment = i !== null && s > i + 0.5 ? { target: s, maxAtWrite: i } : null, this._scrollToOffset(this.getScrollOffset(), {
        adjustments: this.scrollAdjustments += t,
        behavior: n
      }), this.scrollOffset !== null && (this.scrollOffset += this.scrollAdjustments, this.scrollOffset < 0 && (this.scrollOffset = 0), this.scrollAdjustments = 0), !0;
    }
  }
  scheduleScrollReconcile() {
    if (!this.targetWindow) {
      this.scrollState = null;
      return;
    }
    this.rafId == null && (this.rafId = this.targetWindow.requestAnimationFrame(() => {
      this.rafId = null, this.reconcileScroll();
    }));
  }
  reconcileScroll() {
    if (!this.scrollState || !this.scrollElement) return;
    if (this.now() - this.scrollState.startedAt > 5e3) {
      this.scrollState = null;
      return;
    }
    const s = this.scrollState.index != null ? this.getOffsetForIndex(this.scrollState.index, this.scrollState.align) : void 0, r = s ? s[0] : this.scrollState.lastTargetOffset, i = 1, l = r !== this.scrollState.lastTargetOffset;
    if (!l && Ll(r, this.getScrollOffset())) {
      if (this.scrollState.stableFrames++, this.scrollState.stableFrames >= i) {
        this.getScrollOffset() !== r && this._scrollToOffset(r, {
          adjustments: void 0,
          behavior: "auto"
        }), this.scrollState = null;
        return;
      }
    } else if (this.scrollState.stableFrames = 0, l) {
      const o = this.getSize() || 600, a = Math.abs(r - this.getScrollOffset()), f = this.scrollState.behavior === "smooth" && a > o;
      this.scrollState.lastTargetOffset = r, f || (this.scrollState.behavior = "auto"), this._scrollToOffset(r, {
        adjustments: void 0,
        behavior: f ? "smooth" : "auto"
      });
    }
    this.scheduleScrollReconcile();
  }
}
const $o = (e, t, n, s) => {
  for (; e <= t; ) {
    const r = (e + t) / 2 | 0, i = n(r);
    if (i < s)
      e = r + 1;
    else if (i > s)
      t = r - 1;
    else
      return r;
  }
  return e > 0 ? e - 1 : 0;
};
function Fu(e, t, n) {
  let s = 0;
  for (; s <= t; ) {
    const r = (s + t) / 2 | 0, i = e[r * 2];
    if (i < n)
      s = r + 1;
    else if (i > n)
      t = r - 1;
    else
      return r;
  }
  return s > 0 ? s - 1 : 0;
}
function Mu(e, t, n, s, r) {
  const i = e.length - 1;
  if (e.length <= s)
    return { startIndex: 0, endIndex: i };
  if (s === 1 && r !== null) {
    const f = Fu(
      r,
      i,
      n
    );
    let c = f;
    const d = n + t;
    for (; c < i && r[c * 2] + r[c * 2 + 1] < d; )
      c++;
    return { startIndex: f, endIndex: c };
  }
  let o = $o(0, i, (f) => e[f].start, n), a = o;
  if (s === 1)
    for (; a < i && e[a].end < n + t; )
      a++;
  else if (s > 1) {
    const f = Array(s).fill(0);
    for (; a < i && f.some((d) => d < n + t); ) {
      const d = e[a];
      f[d.lane] = d.end, a++;
    }
    const c = Array(s).fill(n + t);
    for (; o >= 0 && c.some((d) => d >= n); ) {
      const d = e[o];
      c[d.lane] = d.start, o--;
    }
    o = Math.max(0, o - o % s), a = Math.min(i, a + (s - 1 - a % s));
  }
  return { startIndex: o, endIndex: a };
}
function Lu(e) {
  let t;
  const n = jo((r) => {
    let i = !1;
    const l = e.subscribe((o) => {
      t = o, i && r();
    });
    return i = !0, l;
  });
  function s() {
    return tr() ? (n(), t) : Qo(e);
  }
  return "set" in e ? {
    get current() {
      return s();
    },
    set current(r) {
      e.set(r);
    }
  } : {
    get current() {
      return s();
    }
  };
}
function ku(e) {
  const t = new Cu(e), n = t.setOptions;
  let s;
  const r = (i) => {
    const l = {
      ...t.options,
      ...i,
      onChange: i.onChange
    };
    n({
      ...l,
      onChange: (o, a) => {
        s.set(o), l.onChange?.(o, a);
      }
    }), t._willUpdate(), s.set(t);
  };
  return s = Zo(t, () => (r(e), t._didMount())), vu(s, (i) => Object.assign(i, { setOptions: r }));
}
function Nu(e) {
  return ku({
    observeElementRect: Tu,
    observeElementOffset: Ou,
    scrollToFn: Du,
    ...e
  });
}
function qu() {
  return {
    rdo: "#000000",
    bag: "#F4B4B4",
    dfo: "#FFF3A8",
    pax: "#A0C4FF",
    training: "#D8B4F8",
    header: "#1F4E79"
  };
}
function zu(e, t) {
  if (!e) return t;
  var n = String(e).replace("#", "").trim();
  return n.length === 3 && (n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]), n.length !== 6 || /[^0-9a-fA-F]/.test(n) ? t : "#" + n.toUpperCase();
}
function Pu(e) {
  var t = zu(e, "#FFFFFF") || "#FFFFFF", n = t.slice(1), s = parseInt(n.slice(0, 2), 16), r = parseInt(n.slice(2, 4), 16), i = parseInt(n.slice(4, 6), 16), l = (0.299 * s + 0.587 * r + 0.114 * i) / 255;
  return l < 0.45 ? "#FFFFFF" : "#111111";
}
var Nl = /* @__PURE__ */ Ye("<option> </option>"), Vu = /* @__PURE__ */ Ye('<tr class="svelte-qst1f4"><td colspan="20" class="muted svelte-qst1f4" style="padding: 1.5rem; text-align: center;">No matching lines found.</td></tr>'), ql = /* @__PURE__ */ Ye('<tr class="spacer-row svelte-qst1f4"><td colspan="20" class="spacer-cell svelte-qst1f4"></td></tr>'), Ms = /* @__PURE__ */ Ye('<option class="svelte-qst1f4"> </option>'), Bu = /* @__PURE__ */ Ye('<div class="day-times-wrap svelte-qst1f4"><input type="time" class="day-time-input svelte-qst1f4"/> <span class="day-time-sep svelte-qst1f4">–</span> <input type="time" class="day-time-input svelte-qst1f4"/></div>'), ju = /* @__PURE__ */ Ye('<td><div class="day-cell-inner svelte-qst1f4"><select class="day-duty-select svelte-qst1f4"><option class="svelte-qst1f4">PAX</option><option class="svelte-qst1f4">BAG</option><option class="svelte-qst1f4">DFO</option><option class="svelte-qst1f4">-</option><option class="svelte-qst1f4">Training</option><option class="svelte-qst1f4">OFF</option></select> <!></div></td>'), Wu = /* @__PURE__ */ Ye('<tr class="svelte-qst1f4"><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="team"><option class="svelte-qst1f4">—</option><!></select></td><td class="svelte-qst1f4"><input type="text" class="line-edit line-code-input svelte-qst1f4" data-field="lineCode"/></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="shift"><option class="svelte-qst1f4">—</option><!></select></td><td class="svelte-qst1f4"><input type="time" class="line-edit line-time-input svelte-qst1f4" data-field="start"/></td><td class="svelte-qst1f4"><input type="time" class="line-edit line-time-input svelte-qst1f4" data-field="end"/></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="position"><option class="svelte-qst1f4">—</option><!></select></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="emp"><option class="svelte-qst1f4">—</option><!></select></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="sex"><option class="svelte-qst1f4">—</option><option class="svelte-qst1f4">M</option><option class="svelte-qst1f4">F</option></select></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="function"><option class="svelte-qst1f4">—</option><option class="svelte-qst1f4">-</option><option class="svelte-qst1f4">DFO</option><option class="svelte-qst1f4">BAG</option><option class="svelte-qst1f4">PAX</option><option class="svelte-qst1f4">TRAINING</option></select></td><td class="svelte-qst1f4"><select class="line-edit svelte-qst1f4" data-field="certPool"><option class="svelte-qst1f4">—</option><option class="svelte-qst1f4">A</option><option class="svelte-qst1f4">B</option></select></td><td class="line-rdo-cell svelte-qst1f4"> </td><td class="line-center svelte-qst1f4"> </td><!><td class="line-hours svelte-qst1f4"> </td></tr>'), Gu = /* @__PURE__ */ Ye("<!> <!> <!>", 1), Hu = /* @__PURE__ */ Ye('<div class="lines-table-header-controls svelte-qst1f4"><div class="filter-controls svelte-qst1f4"><label class="svelte-qst1f4">Search <input type="text" class="filter-input search-input svelte-qst1f4" placeholder="Search line code..."/></label> <label class="svelte-qst1f4">Role <select class="filter-select svelte-qst1f4"><option>All</option><option>STSO</option><option>LTSO</option><option>TSO (FT/PT)</option></select></label> <label class="svelte-qst1f4">Team <select class="filter-select svelte-qst1f4"><option>All</option><option>Unassigned</option><!></select></label> <label class="svelte-qst1f4">Shift <select class="filter-select svelte-qst1f4"><option>All shifts</option><!></select></label> <label class="svelte-qst1f4">Duty <select class="filter-select svelte-qst1f4"><option>All duties</option><option>BAG</option><option>PAX</option><option>DFO</option><option>-</option><option>TRAINING</option><option>OFF / RDO</option></select></label> <label class="svelte-qst1f4">On Day <select class="filter-select svelte-qst1f4"><option>Any day</option><option>Sun</option><option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option></select></label> <label class="svelte-qst1f4">Sex <select class="filter-select svelte-qst1f4"><option>All</option><option>M</option><option>F</option></select></label></div></div> <div class="lines-virtual-root svelte-qst1f4"><table class="data-table lines-editable svelte-qst1f4"><thead><tr class="svelte-qst1f4"><th class="sortable col-team svelte-qst1f4"> </th><th class="sortable col-line svelte-qst1f4"> </th><th class="sortable col-shift svelte-qst1f4"> </th><th class="sortable col-time svelte-qst1f4"> </th><th class="col-time svelte-qst1f4">End</th><th class="sortable col-pos svelte-qst1f4"> </th><th class="col-sm svelte-qst1f4">Emp</th><th class="col-sm svelte-qst1f4">Sex</th><th class="col-duty svelte-qst1f4">Duty</th><th class="col-sm svelte-qst1f4">Cert</th><th class="col-rdos svelte-qst1f4">RDOs</th><th class="col-sm svelte-qst1f4">Paid</th><th class="col-day svelte-qst1f4">Sun</th><th class="col-day svelte-qst1f4">Mon</th><th class="col-day svelte-qst1f4">Tue</th><th class="col-day svelte-qst1f4">Wed</th><th class="col-day svelte-qst1f4">Thu</th><th class="col-day svelte-qst1f4">Fri</th><th class="col-day svelte-qst1f4">Sat</th><th class="col-sm svelte-qst1f4">Hrs</th></tr></thead><tbody class="svelte-qst1f4"><!></tbody></table></div>', 1), Ku = /* @__PURE__ */ Ye('<div class="muted">Classic Lines mode active</div>'), Uu = /* @__PURE__ */ Ye('<div class="lines-table-root svelte-qst1f4"><!></div>');
function Xu(e, t) {
  Ql(t, !0);
  let n = ne(t, "rows", 19, () => []), s = ne(t, "mode", 3, "svelte"), r = ne(t, "shiftOptions", 19, () => []), i = ne(t, "teamOptions", 19, () => []), l = ne(t, "exportStyle", 3, null), o = ne(t, "onInlineEdit", 3, null);
  ne(t, "onDayToggle", 3, null);
  let a = ne(t, "onDayDutyEdit", 3, null), f = ne(t, "onDayTimeEdit", 3, null), c = ne(t, "onSort", 3, null), d = ne(t, "onFilter", 3, null), y = ne(t, "currentSortBy", 3, "role"), h = ne(t, "currentSortDir", 3, "asc"), p = ne(t, "filterRole", 15, "ALL"), w = ne(t, "filterShift", 15, ""), g = ne(t, "filterTeam", 15, ""), O = ne(t, "filterSex", 15, ""), E = ne(t, "filterDuty", 15, ""), A = ne(t, "filterDay", 15, ""), v = ne(t, "searchCode", 15, "");
  const _ = ["TSO", "LTSO", "STSO"], T = ["FT", "PT"], b = 42, x = 8, R = [0, 1, 2, 3, 4, 5, 6];
  let j = /* @__PURE__ */ ct(null), G = /* @__PURE__ */ nn(() => l() || qu());
  const P = Nu({
    count: 0,
    getScrollElement: () => m(j),
    estimateSize: () => b,
    overscan: x,
    initialRect: { width: 800, height: 600 }
  }), $ = Lu(P);
  If(() => {
    const D = n().length, k = m(j);
    Qo(P).setOptions({
      count: D,
      getScrollElement: () => k,
      estimateSize: () => b,
      overscan: x
    });
  });
  let Z = /* @__PURE__ */ nn(() => n().length ? $.current.getVirtualItems() : []), Nt = /* @__PURE__ */ nn(() => $.current.getTotalSize()), Dn = /* @__PURE__ */ nn(() => m(Z).length ? m(Z)[0].start : 0), Rn = /* @__PURE__ */ nn(() => m(Z).length ? Math.max(0, m(Nt) - m(Z)[m(Z).length - 1].end) : 0);
  function _s(D, k) {
    const se = k == null ? "" : String(k);
    return !se || D.indexOf(se) >= 0 ? D : D.concat([se]);
  }
  function ps(D) {
    if (!D) return "";
    const k = D.name || D.id || "";
    if (D.segments && Array.isArray(D.segments) && D.segments.length === 2) {
      const se = D.segments[0].start + "–" + D.segments[0].end + " / " + D.segments[1].start + "–" + D.segments[1].end;
      return (k ? k + " " : "") + "(" + se + ")";
    }
    return D.start && D.end ? (k ? k + " " : "") + "(" + D.start + "–" + D.end + ")" : D.start ? k ? k + " " + D.start : D.start : k;
  }
  function Qi(D) {
    const k = String(D || "").toUpperCase();
    return k === "RDO" || k === "—" || k === "OFF" ? "rdo" : k === "-" ? "dash" : k === "BAG" || k === "BAGS" ? "bag" : k === "DFO" ? "dfo" : k === "PAX" ? "pax" : k === "TRAINING" ? "training" : null;
  }
  function ta(D) {
    const k = Qi(D);
    return k === "rdo" ? "cell-day-col cell-rdo" : k === "bag" ? "cell-day-col cell-function-duty cell-bag" : k === "dfo" ? "cell-day-col cell-function-duty cell-dfo" : k === "pax" ? "cell-day-col cell-function-duty cell-pax" : k === "training" ? "cell-day-col cell-function-duty cell-training" : "cell-day-col cell-work";
  }
  function na(D) {
    const k = Qi(D);
    if (!k) return;
    const se = m(G)[k];
    if (se)
      return "background:" + se + ";color:" + Pu(se) + ";";
  }
  function Je(D, k, se) {
    o()?.({ lineId: D, field: k, value: se });
  }
  function sa(D, k, se) {
    a()?.({ lineId: D, dayIndex: k, duty: se });
  }
  function $i(D, k, se, ms) {
    f()?.({ lineId: D, dayIndex: k, field: se, value: ms });
  }
  function Cn(D) {
    let k = "asc";
    y() === D && (k = h() === "asc" ? "desc" : "asc"), c()?.({ sortBy: D, sortDir: k });
  }
  function qt() {
    d()?.({
      filterRole: p(),
      filterShift: w(),
      filterTeam: g(),
      filterSex: O(),
      filterDuty: E(),
      filterDay: A(),
      searchCode: v()
    });
  }
  function ra(D) {
    return je(j, D, !0), () => {
      m(j) === D && je(j, null);
    };
  }
  function Fn(D) {
    return y() !== D ? "" : h() === "asc" ? " ▲" : " ▼";
  }
  var gs = Uu();
  let el;
  var ia = L(gs);
  {
    var la = (D) => {
      var k = Hu(), se = Al(k), ms = L(se), sr = L(ms), rr = S(L(sr));
      ln(rr), M(sr);
      var ir = S(sr, 2), Mn = S(L(ir)), lr = L(Mn);
      lr.value = lr.__value = "ALL";
      var or = S(lr);
      or.value = or.__value = "STSO";
      var ar = S(or);
      ar.value = ar.__value = "LTSO";
      var tl = S(ar);
      tl.value = tl.__value = "TSO", M(Mn), ge(Mn), M(ir);
      var fr = S(ir, 2), Ln = S(L(fr)), ur = L(Ln);
      ur.value = ur.__value = "";
      var cr = S(ur);
      cr.value = cr.__value = "__none__";
      var aa = S(cr);
      xt(aa, 17, i, (oe) => oe.id, (oe, we) => {
        var ve = Nl(), zt = _e(ve, !0), Fe = {};
        Te(() => {
          pe(zt, m(we).name ?? m(we).id), Fe !== (Fe = m(we).id) && (ve.value = (ve.__value = Fe) ?? "");
        }), ae(oe, ve);
      }), M(Ln), ge(Ln), M(fr);
      var dr = S(fr, 2), kn = S(L(dr)), hr = L(kn);
      hr.value = hr.__value = "";
      var fa = S(hr);
      xt(fa, 17, r, (oe) => oe.id, (oe, we) => {
        var ve = Nl(), zt = _e(ve, !0), Fe = {};
        Te(
          (qr) => {
            pe(zt, qr), Fe !== (Fe = m(we).id) && (ve.value = (ve.__value = Fe) ?? "");
          },
          [() => ps(m(we))]
        ), ae(oe, ve);
      }), M(kn), ge(kn), M(dr);
      var vr = S(dr, 2), Nn = S(L(vr)), _r = L(Nn);
      _r.value = _r.__value = "";
      var pr = S(_r);
      pr.value = pr.__value = "BAG";
      var gr = S(pr);
      gr.value = gr.__value = "PAX";
      var mr = S(gr);
      mr.value = mr.__value = "DFO";
      var yr = S(mr);
      yr.value = yr.__value = "-";
      var br = S(yr);
      br.value = br.__value = "TRAINING";
      var nl = S(br);
      nl.value = nl.__value = "OFF", M(Nn), ge(Nn), M(vr);
      var wr = S(vr, 2), qn = S(L(wr)), Sr = L(qn);
      Sr.value = Sr.__value = "";
      var Tr = S(Sr);
      Tr.value = Tr.__value = "0";
      var Er = S(Tr);
      Er.value = Er.__value = "1";
      var Ar = S(Er);
      Ar.value = Ar.__value = "2";
      var Or = S(Ar);
      Or.value = Or.__value = "3";
      var xr = S(Or);
      xr.value = xr.__value = "4";
      var Ir = S(xr);
      Ir.value = Ir.__value = "5";
      var sl = S(Ir);
      sl.value = sl.__value = "6", M(qn), ge(qn), M(wr);
      var rl = S(wr, 2), zn = S(L(rl)), Dr = L(zn);
      Dr.value = Dr.__value = "";
      var Rr = S(Dr);
      Rr.value = Rr.__value = "M";
      var il = S(Rr);
      il.value = il.__value = "F", M(zn), ge(zn), M(rl), M(ms), M(se);
      var Cr = S(se, 2), ll = L(Cr), Fr = L(ll), ol = L(Fr), Mr = L(ol), ua = _e(Mr), Lr = S(Mr), ca = _e(Lr), kr = S(Lr), da = _e(kr), Nr = S(kr), ha = _e(Nr), al = S(Nr, 2), va = _e(al);
      Xl(14), M(ol), M(Fr);
      var fl = S(Fr), _a = L(fl);
      {
        var pa = (oe) => {
          var we = Vu();
          ae(oe, we);
        }, ga = (oe) => {
          var we = Gu(), ve = Al(we);
          {
            var zt = (Me) => {
              var Pe = ql();
              let I;
              var ft = L(Pe);
              let ut;
              M(Pe), Te(() => {
                I = Vt(Pe, "", I, { height: `${m(Dn) ?? ""}px` }), ut = Vt(ft, "", ut, { height: `${m(Dn) ?? ""}px` });
              }), ae(Me, Pe);
            };
            Bn(ve, (Me) => {
              m(Dn) > 0 && Me(zt);
            });
          }
          var Fe = S(ve, 2);
          xt(Fe, 17, () => m(Z), (Me) => n()[Me.index]?.id ?? Me.key, (Me, Pe) => {
            const I = /* @__PURE__ */ nn(() => n()[m(Pe).index]);
            var ft = Wu();
            Vt(ft, "", {}, { height: "42px" });
            var ut = L(ft), bt = L(ut), zr = L(bt);
            zr.value = zr.__value = "";
            var ya = S(zr);
            xt(ya, 17, i, (z) => z.id, (z, X) => {
              var Y = Ms(), Ze = _e(Y, !0), Q = {};
              Te(() => {
                pe(Ze, m(X).name ?? m(X).id), Q !== (Q = m(X).id) && (Y.value = (Y.__value = Q) ?? "");
              }), ae(z, Y);
            }), M(bt);
            var ys;
            ge(bt), M(ut);
            var Pr = S(ut), bs = L(Pr);
            ln(bs), M(Pr);
            var Vr = S(Pr), wt = L(Vr), Br = L(wt);
            Br.value = Br.__value = "";
            var ba = S(Br);
            xt(ba, 17, r, (z) => z.id, (z, X) => {
              var Y = Ms(), Ze = _e(Y, !0), Q = {};
              Te(
                (Pn) => {
                  pe(Ze, Pn), Q !== (Q = m(X).id) && (Y.value = (Y.__value = Q) ?? "");
                },
                [() => ps(m(X))]
              ), ae(z, Y);
            }), M(wt);
            var ws;
            ge(wt), M(Vr);
            var jr = S(Vr), Ss = L(jr);
            ln(Ss), M(jr);
            var Wr = S(jr), Ts = L(Wr);
            ln(Ts), M(Wr);
            var Gr = S(Wr), St = L(Gr), Hr = L(St);
            Hr.value = Hr.__value = "";
            var wa = S(Hr);
            xt(wa, 16, () => _s(_, m(I)?.position), (z) => z, (z, X) => {
              var Y = Ms(), Ze = _e(Y, !0), Q = {};
              Te(() => {
                pe(Ze, X), Q !== (Q = X) && (Y.value = (Y.__value = Q) ?? "");
              }), ae(z, Y);
            }), M(St);
            var Es;
            ge(St), M(Gr);
            var Kr = S(Gr), Tt = L(Kr), Ur = L(Tt);
            Ur.value = Ur.__value = "";
            var Sa = S(Ur);
            xt(Sa, 16, () => T, (z) => z, (z, X) => {
              var Y = Ms(), Ze = _e(Y, !0), Q = {};
              Te(() => {
                pe(Ze, X), Q !== (Q = X) && (Y.value = (Y.__value = Q) ?? "");
              }), ae(z, Y);
            }), M(Tt);
            var As;
            ge(Tt), M(Kr);
            var Xr = S(Kr), Et = L(Xr), Yr = L(Et);
            Yr.value = Yr.__value = "";
            var Jr = S(Yr);
            Jr.value = Jr.__value = "M";
            var ul = S(Jr);
            ul.value = ul.__value = "F", M(Et);
            var Os;
            ge(Et), M(Xr);
            var Zr = S(Xr), At = L(Zr), Qr = L(At);
            Qr.value = Qr.__value = "";
            var $r = S(Qr);
            $r.value = $r.__value = "-";
            var ei = S($r);
            ei.value = ei.__value = "DFO";
            var ti = S(ei);
            ti.value = ti.__value = "BAG";
            var ni = S(ti);
            ni.value = ni.__value = "PAX";
            var cl = S(ni);
            cl.value = cl.__value = "TRAINING", M(At);
            var xs;
            ge(At), M(Zr);
            var si = S(Zr), Ot = L(si), ri = L(Ot);
            ri.value = ri.__value = "";
            var ii = S(ri);
            ii.value = ii.__value = "A";
            var dl = S(ii);
            dl.value = dl.__value = "B", M(Ot);
            var Is;
            ge(Ot), M(si);
            var hl = S(si), Ta = _e(hl, !0), vl = S(hl), Ea = _e(vl, !0), _l = S(vl);
            xt(_l, 16, () => R, (z) => z, (z, X) => {
              var Y = ju(), Ze = L(Y), Q = L(Ze), Pn = L(Q);
              Pn.value = Pn.__value = "PAX";
              var li = S(Pn);
              li.value = li.__value = "BAG";
              var oi = S(li);
              oi.value = oi.__value = "DFO";
              var ai = S(oi);
              ai.value = ai.__value = "-";
              var fi = S(ai);
              fi.value = fi.__value = "TRAINING";
              var pl = S(fi);
              pl.value = pl.__value = "OFF", M(Q);
              var Ds;
              ge(Q);
              var xa = S(Q, 2);
              {
                var Ia = (Pt) => {
                  var Vn = Bu(), Rs = L(Vn);
                  ln(Rs);
                  var ui = S(Rs, 4);
                  ln(ui), M(Vn), Te(() => {
                    Wn(Rs, m(I)?.dayStarts?.[X] || m(I)?.start || ""), Wn(ui, m(I)?.dayEnds?.[X] || m(I)?.end || "");
                  }), J("change", Rs, (ci) => $i(m(I)?.id, X, "start", ci.target.value)), J("change", ui, (ci) => $i(m(I)?.id, X, "end", ci.target.value)), ae(Pt, Vn);
                };
                Bn(xa, (Pt) => {
                  m(I)?.dayDuties?.[X] !== "OFF" && m(I)?.days?.[X] !== "RDO" && Pt(Ia);
                });
              }
              M(Ze), M(Y), Te(
                (Pt, Vn) => {
                  su(Y, 1, Pt, "svelte-qst1f4"), Vt(Y, Vn), Ds !== (Ds = m(I)?.dayDuties?.[X] === "OFF" || m(I)?.days?.[X] === "RDO" ? "OFF" : m(I)?.dayDuties?.[X] || "PAX") && (Q.value = (Q.__value = Ds) ?? "", Qe(Q, Ds));
                },
                [
                  () => eu(ta(m(I)?.dayDuties?.[X] ?? m(I)?.days?.[X])),
                  () => na(m(I)?.dayDuties?.[X] ?? m(I)?.days?.[X])
                ]
              ), J("change", Q, (Pt) => sa(m(I)?.id, X, Pt.target.value)), ae(z, Y);
            });
            var Aa = S(_l), Oa = _e(Aa, !0);
            M(ft), Te(() => {
              Ee(ft, "data-line-row", m(I)?.id), Ee(bt, "data-line-id", m(I)?.id), ys !== (ys = m(I)?.teamId ?? "") && (bt.value = (bt.__value = ys) ?? "", Qe(bt, ys)), Ee(bs, "data-line-id", m(I)?.id), Wn(bs, m(I)?.line ?? ""), Ee(wt, "data-line-id", m(I)?.id), ws !== (ws = m(I)?.shiftId ?? "") && (wt.value = (wt.__value = ws) ?? "", Qe(wt, ws)), Ee(Ss, "data-line-id", m(I)?.id), Wn(Ss, m(I)?.start ?? ""), Ee(Ts, "data-line-id", m(I)?.id), Wn(Ts, m(I)?.end ?? ""), Ee(St, "data-line-id", m(I)?.id), Es !== (Es = m(I)?.position ?? "") && (St.value = (St.__value = Es) ?? "", Qe(St, Es)), Ee(Tt, "data-line-id", m(I)?.id), As !== (As = m(I)?.emp ?? "") && (Tt.value = (Tt.__value = As) ?? "", Qe(Tt, As)), Ee(Et, "data-line-id", m(I)?.id), Os !== (Os = m(I)?.sex ?? "") && (Et.value = (Et.__value = Os) ?? "", Qe(Et, Os)), Ee(At, "data-line-id", m(I)?.id), xs !== (xs = m(I)?.function ?? "") && (At.value = (At.__value = xs) ?? "", Qe(At, xs)), Ee(Ot, "data-line-id", m(I)?.id), Is !== (Is = m(I)?.certPool ?? "") && (Ot.value = (Ot.__value = Is) ?? "", Qe(Ot, Is)), pe(Ta, m(I)?.rdos ?? "—"), pe(Ea, m(I)?.paid ?? ""), pe(Oa, m(I)?.hours ?? "");
            }), J("change", bt, (z) => Je(m(I)?.id, "team", z.target.value)), J("change", bs, (z) => Je(m(I)?.id, "lineCode", z.target.value)), J("change", wt, (z) => Je(m(I)?.id, "shift", z.target.value)), J("change", Ss, (z) => Je(m(I)?.id, "start", z.target.value)), J("change", Ts, (z) => Je(m(I)?.id, "end", z.target.value)), J("change", St, (z) => Je(m(I)?.id, "position", z.target.value)), J("change", Tt, (z) => Je(m(I)?.id, "emp", z.target.value)), J("change", Et, (z) => Je(m(I)?.id, "sex", z.target.value)), J("change", At, (z) => Je(m(I)?.id, "function", z.target.value)), J("change", Ot, (z) => Je(m(I)?.id, "certPool", z.target.value)), ae(Me, ft);
          });
          var qr = S(Fe, 2);
          {
            var ma = (Me) => {
              var Pe = ql();
              let I;
              var ft = L(Pe);
              let ut;
              M(Pe), Te(() => {
                I = Vt(Pe, "", I, { height: `${m(Rn) ?? ""}px` }), ut = Vt(ft, "", ut, { height: `${m(Rn) ?? ""}px` });
              }), ae(Me, Pe);
            };
            Bn(qr, (Me) => {
              m(Rn) > 0 && Me(ma);
            });
          }
          ae(oe, we);
        };
        Bn(_a, (oe) => {
          n().length === 0 ? oe(pa) : oe(ga, -1);
        });
      }
      M(fl), M(ll), M(Cr), Qf(Cr, () => ra), Te(
        (oe, we, ve, zt, Fe) => {
          pe(ua, `Team${oe ?? ""}`), pe(ca, `Line${we ?? ""}`), pe(da, `Shift${ve ?? ""}`), pe(ha, `Start${zt ?? ""}`), pe(va, `Position${Fe ?? ""}`);
        },
        [
          () => Fn("team"),
          () => Fn("line"),
          () => Fn("shift"),
          () => Fn("start"),
          () => Fn("role")
        ]
      ), J("input", rr, qt), du(rr, v), J("change", Mn, qt), rn(Mn, p), J("change", Ln, qt), rn(Ln, g), J("change", kn, qt), rn(kn, w), J("change", Nn, qt), rn(Nn, E), J("change", qn, qt), rn(qn, A), J("change", zn, qt), rn(zn, O), J("click", Mr, () => Cn("team")), J("click", Lr, () => Cn("line")), J("click", kr, () => Cn("shift")), J("click", Nr, () => Cn("start")), J("click", al, () => Cn("role")), ae(D, k);
    }, oa = (D) => {
      var k = Ku();
      ae(D, k);
    };
    Bn(ia, (D) => {
      s() === "svelte" ? D(la) : D(oa, -1);
    });
  }
  M(gs), Te(() => el = Vt(gs, "", el, {
    "--export-rdo": m(G).rdo || "#000000",
    "--export-bag": m(G).bag || "#F4B4B4",
    "--export-dfo": m(G).dfo || "#FFF3A8",
    "--export-pax": m(G).pax || "#A0C4FF",
    "--export-header": m(G).header || "#1F4E79"
  })), ae(e, gs), $l();
}
qf(["input", "change", "click"]);
function Yu() {
  return typeof window < "u" && window.luxon && window.luxon.DateTime ? window.luxon.DateTime : typeof globalThis < "u" && globalThis.luxon && globalThis.luxon.DateTime ? globalThis.luxon.DateTime : null;
}
function rs(e) {
  var t = Yu();
  if (t) {
    if (!e) return t.now().startOf("day");
    if (typeof e == "string") {
      var n = t.fromISO(e.slice(0, 10));
      if (n.isValid) return n.startOf("day");
    }
    return e && typeof e.toJSDate == "function" ? t.fromJSDate(e.toJSDate()).startOf("day") : e instanceof Date ? t.fromJSDate(e).startOf("day") : e && e.isValid && e.toISODate ? e.startOf ? e.startOf("day") : e : t.now().startOf("day");
  }
  var s;
  return e ? typeof e == "string" ? s = /* @__PURE__ */ new Date(e.slice(0, 10) + "T00:00:00") : e instanceof Date ? s = new Date(e.getTime()) : e && e.toJSDate ? s = e.toJSDate() : s = /* @__PURE__ */ new Date() : s = /* @__PURE__ */ new Date(), isNaN(s.getTime()) && (s = /* @__PURE__ */ new Date()), s.setHours(0, 0, 0, 0), {
    isValid: !0,
    weekday: s.getDay() === 0 ? 7 : s.getDay(),
    startOf: function() {
      return rs(s);
    },
    plus: function(r) {
      var i = new Date(s.getTime());
      return r && r.days && i.setDate(i.getDate() + r.days), rs(i);
    },
    toFormat: function(r) {
      var i = s.getFullYear(), l = String(s.getMonth() + 1).padStart(2, "0"), o = String(s.getDate()).padStart(2, "0");
      return i + "-" + l + "-" + o;
    },
    toISODate: function() {
      var r = s.getFullYear(), i = String(s.getMonth() + 1).padStart(2, "0"), l = String(s.getDate()).padStart(2, "0");
      return r + "-" + i + "-" + l;
    },
    toJSDate: function() {
      return s;
    }
  };
}
function Ju(e, t) {
  return rs(e).plus({ days: t });
}
function Zu(e) {
  return rs(e).weekday % 7;
}
function ea(e, t) {
  var n = {};
  if (e == null || e === "") {
    for (var s = 0; s < 7; s++) n[s] = s;
    return n;
  }
  for (var r = Math.min(7, (Number(t) || 1) * 7), i = rs(e), l = 0; l < r; l++) {
    var o = Zu(Ju(i, l));
    n[o] == null && (n[o] = l);
  }
  return n;
}
function Qu(e) {
  if (e = e || window.Scheduler, !e) return;
  function t(i) {
    var l = String(i || "").trim();
    if (!l) return "";
    var o = l.match(/^(\d+)$/);
    return o && Number(o[1]) < 10 ? "0" + o[1] : l;
  }
  function n(i, l) {
    var o = (i.rdoDays || []).map(Number).filter(function(f) {
      return Number.isInteger(f) && f >= 0 && f <= 6;
    }), a = o.length ? o.map(function(f) {
      return l && l[f] != null ? l[f] : String(f);
    }).join(",") : "—";
    return i.rdoHard && (a += " (hard)"), a;
  }
  function s(i, l, o) {
    return o || "WORK";
  }
  function r(i, l) {
    return l === "TRAINING" ? "TRAINING" : l === "-" || l === "BAG" || l === "PAX" || l === "DFO" ? l : i.isTraining || i.trainingClass || i.empClass === "ESTI" || i.empClass === "MSTI" || i.extraName === "ESTI" || i.extraName === "MSTI" ? "TRAINING" : i.function === "BAG" ? "BAG" : i.function === "DFO" || i.function === "PAX" ? "PAX" : i.function === "-" ? "-" : l === "BAG" || l === "PAX" ? l : null;
  }
  e.lineToRowModel = function(i, l, o) {
    if (o = o || {}, !i || !l) return null;
    for (var a = o.dayNames || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], f = typeof o.teamResolver == "function" ? o.teamResolver(i.id) : null, c = typeof o.shiftResolver == "function" ? o.shiftResolver(i.shiftId) : null, d = i.shiftName || c && c.name || "", y = i.startTime || (c && c.start ? c.start : ""), h = i.endTime || (c && c.end ? c.end : ""), p = c && c.segments && c.segments.length === 2 ? c.segments[0].start + "–" + c.segments[0].end + " / " + c.segments[1].start + "–" + c.segments[1].end : y && h ? y + "–" + h : y || "WORK", w = i.shiftLabel || p, g = !!(i.isExtra || i.extraPositionId), O = g ? i.position || i.extraName || "TSO" : i.isStso || i.empClass === "STSO" ? "STSO" : i.isLtso || i.empClass === "LTSO" ? "LTSO" : "TSO", E = g ? i.empClass === "PT" ? "PT" : "FT" : O === "STSO" || O === "LTSO" ? "FT" : i.empClass === "PT" ? "PT" : "FT", A = i.paid || 0, v = Array.isArray(l) ? l : l[i.id] || l[String(i.id)] || [], _ = ea(
      o.startDate != null ? o.startDate : e.state && e.state.startDate,
      o.weekCount != null ? o.weekCount : e.state && e.state.weekCount
    ), T = [], b = [], x = [], R = [], j = 0, G = 0; G < 7; G++) {
      var P = _[G];
      P == null && (P = G);
      var $ = i.dayTimes && i.dayTimes[String(G)], Z = typeof o.effectiveTimesResolver == "function" ? o.effectiveTimesResolver(i.shiftId, G) : null, Nt = $ && $.start || i.startTime || Z && Z.start || y, Dn = $ && $.end || i.endTime || Z && Z.end || h;
      x.push(Nt), R.push(Dn);
      var Rn = v[P];
      if (Rn === "WORK") {
        j += A;
        var _s = typeof o.rotationDutyResolver == "function" ? o.rotationDutyResolver(i.id, P) : null, ps = s(i, _s, w);
        T.push(ps), b.push(r(i, _s) || "PAX");
      } else
        T.push("RDO"), b.push("OFF");
    }
    return {
      id: i.id,
      teamId: f && f.id || "",
      shiftId: i.shiftId || "",
      team: t(f && (f.name || f.id) || ""),
      line: i.lineCode || "",
      shift: d,
      start: y,
      end: h,
      position: O,
      emp: E,
      sex: i.sex === "F" || i.sex === "M" ? i.sex : "",
      function: i.function || "",
      certPool: i.certPool || "",
      rdos: n(i, a),
      paid: A,
      days: T,
      dayDuties: b,
      dayStarts: x,
      dayEnds: R,
      hours: j
    };
  }, e.getRowModels = function(i, l, o) {
    return !Array.isArray(i) || !l || typeof l != "object" ? [] : i.map(function(a) {
      return e.lineToRowModel(a, l, o);
    }).filter(Boolean);
  }, e.getLineRowModels = function(i) {
    var l = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], o = e.state && e.state.schedule || {}, a = Object.assign({}, i || {});
    return !a.teamResolver && typeof e.teamMetaForLine == "function" && (a.teamResolver = e.teamMetaForLine), !a.shiftResolver && typeof e.getShift == "function" && (a.shiftResolver = e.getShift), !a.rotationDutyResolver && typeof e.getRotationDuty == "function" && (a.rotationDutyResolver = e.getRotationDuty), !a.effectiveTimesResolver && typeof e.getEffectiveShiftTimes == "function" && (a.effectiveTimesResolver = e.getEffectiveShiftTimes), e.getRowModels(l, o, a);
  };
}
function $u(e) {
  if (e = e || window.Scheduler, !e) return;
  function t(o, a) {
    var f = e.getRotationDuty ? e.getRotationDuty(o.id, a) : null;
    return f || o.function || null;
  }
  e.dutyFor = t;
  function n(o) {
    if (o.shiftLabel) return o.shiftLabel;
    var a = e.getShift ? e.getShift(o.shiftId) : null;
    return a && a.start && a.end ? a.start + "–" + a.end : a && a.start ? a.start : "WORK";
  }
  function s(o) {
    if (!(!o || o.function !== "BAG")) {
      e.state.functionRotation || (e.state.functionRotation = {});
      var a = String(o.id);
      e.state.functionRotation[a] || (e.state.functionRotation[a] = []);
      for (var f = e.state.schedule && (e.state.schedule[o.id] || e.state.schedule[a]) || [], c = Math.max(f.length, (e.state.weekCount || 1) * 7), d = 0; d < c; d++) {
        for (; e.state.functionRotation[a].length <= d; ) e.state.functionRotation[a].push(null);
        f[d] === "WORK" && (e.state.functionRotation[a][d] = "BAG");
      }
    }
  }
  function r(o) {
    if (!(!o || o.function !== "DFO")) {
      e.state.functionRotation || (e.state.functionRotation = {});
      var a = String(o.id);
      e.state.functionRotation[a] || (e.state.functionRotation[a] = []);
      for (var f = e.state.schedule && (e.state.schedule[o.id] || e.state.schedule[a]) || [], c = Math.max(f.length, (e.state.weekCount || 1) * 7), d = 0; d < c; d++) {
        for (; e.state.functionRotation[a].length <= d; ) e.state.functionRotation[a].push(null);
        f[d] === "WORK" && (e.state.functionRotation[a][d] = "DFO");
      }
    }
  }
  function i() {
    var o = document.getElementById("lines-tbody"), a = o || document.querySelector(".lines-virtual-root");
    a && o && a.querySelectorAll("td.cell-toggle").forEach(function(f) {
      var c = e.findLineById ? e.findLineById(f.getAttribute("data-line-id")) : null, d = +f.getAttribute("data-day");
      if (!(!c || isNaN(d))) {
        var y = (e.state.schedule[c.id] || e.state.schedule[String(c.id)] || [])[d] || "RDO";
        if (f.style.background = "", f.style.color = "", y !== "WORK") {
          f.className = "cell-rdo cell-toggle", f.textContent = "RDO", f.style.background = "#000", f.style.color = "#fff", f.style.opacity = "1";
          return;
        }
        var h = t(c, d), p = h === "BAG" || h === "BAGS", w = h === "DFO", g = "";
        p ? g = " cell-function-duty cell-bag" : w && (g = " cell-function-duty cell-dfo"), f.className = "cell-work cell-toggle" + g, f.textContent = n(c);
      }
    });
  }
  e.paintLineColors = i;
  function l(o) {
    var a = e[o];
    if (!(typeof a != "function" || a._lineColorsWrapped)) {
      var f = function() {
        if (e.__USE_SVELTE_LINES) return a.apply(this, arguments);
        var c = a.apply(this, arguments);
        return setTimeout(i, 0), c;
      };
      f._lineColorsWrapped = !0, e[o] = f;
    }
  }
  l("renderLines"), l("renderAll"), l("generateFunctionAssignments"), e._lineColorsBound || (e._lineColorsBound = !0, document.addEventListener("change", function(o) {
    var a = o.target;
    if (!(!a || a.getAttribute("data-field") !== "function")) {
      var f = e.findLineById ? e.findLineById(a.getAttribute("data-line-id")) : null;
      f && (f.function = a.value === "DFO" || a.value === "PAX" || a.value === "BAG" || a.value === "TRAINING" || a.value === "-" ? a.value : "", f.function === "BAG" && s(f), f.function === "DFO" && r(f), e.renderLines ? e.renderLines() : i());
    }
  }));
}
const ec = pu(Xu);
function sc(e) {
  const t = e || window.Scheduler;
  if (!t) return;
  Qu(t), $u(t);
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
  function s() {
    return {
      teamResolver: typeof t.teamMetaForLine == "function" ? t.teamMetaForLine : null,
      shiftResolver: typeof t.getShift == "function" ? t.getShift : null,
      rotationDutyResolver: typeof t.getRotationDuty == "function" ? t.getRotationDuty : r,
      effectiveTimesResolver: typeof t.getEffectiveShiftTimes == "function" ? t.getEffectiveShiftTimes : null
    };
  }
  function r(v, _) {
    const T = String(v), b = t.state && t.state.functionRotation, x = b && (b[T] || b[v]);
    if (!Array.isArray(x)) return null;
    const R = x[_];
    return R === "BAG" ? "BAG" : R === "DFO" ? "DFO" : R === "PAX" ? "PAX" : R === "TRAINING" ? "TRAINING" : R === "-" ? "-" : null;
  }
  function i(v, _, T) {
    var b = String(v);
    for (t.state.functionRotation || (t.state.functionRotation = {}), t.state.functionRotation[b] || (t.state.functionRotation[b] = []); t.state.functionRotation[b].length <= _; ) t.state.functionRotation[b].push(null);
    t.state.functionRotation[b][_] = T;
  }
  function l(v) {
    var _ = ea(t.state && t.state.startDate, t.state && t.state.weekCount), T = _[v];
    return T ?? v;
  }
  function o(v) {
    if (!v) return !1;
    if (v.function === "DFO") return !0;
    const _ = v.functionEligible;
    return !!(_ && (_.dfo === !0 || _.DFO === !0));
  }
  function a() {
    const v = t.state && Array.isArray(t.state.lines) ? t.state.lines : [], _ = typeof t.sortLinesForView == "function" && typeof t.filterLinesForView == "function" ? t.sortLinesForView(t.filterLinesForView(v)) : v, T = t.state && t.state.schedule || {}, b = typeof t.getRowModels == "function" ? t.getRowModels(_, T, s()) : typeof t.getLineRowModels == "function" ? t.getLineRowModels(s()) : [];
    return Array.isArray(b) ? b : [];
  }
  function f() {
    return t.teams && Array.isArray(t.teams.teams) ? t.teams.teams : [];
  }
  function c() {
    return t.state && Array.isArray(t.state.shifts) ? t.state.shifts : [];
  }
  function d() {
    return typeof t.getExportStyle == "function" ? t.getExportStyle() : t.state && t.state.exportStyle || null;
  }
  function y(v) {
    if (!v || typeof v.$set != "function") return;
    const _ = a();
    typeof t.applyExportCssVars == "function" && t.applyExportCssVars(), v.$set({
      rows: Array.isArray(_) ? _ : [],
      shiftOptions: c(),
      teamOptions: f(),
      exportStyle: d(),
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
  function h(v) {
    if (!v) return;
    const _ = t.findLineById ? t.findLineById(v.lineId) : null;
    if (!_) return;
    const T = v.field, b = v.value;
    if (T === "lineCode")
      _.lineCode = String(b || "").trim() || _.lineCode;
    else if (T === "sex")
      _.sex = b === "F" ? "F" : "M";
    else if (T === "function")
      _.function = b === "DFO" || b === "PAX" || b === "BAG" || b === "TRAINING" || b === "-" ? b : "";
    else if (T === "certPool") {
      var x = String(b || "").trim().toUpperCase();
      _.certPool = x === "A" || x === "B" ? x : "";
    } else if (T === "emp")
      t.applyLineEmp && t.applyLineEmp(_, b);
    else if (T === "position") {
      var R = !!(_.isExtra || _.extraPositionId), j = String(b ?? "").trim();
      R ? (j && (_.position = j, _.extraName = j), _.isStso = !1, _.isLtso = !1) : t.applyLineEmp && t.applyLineEmp(_, j);
    } else if (T === "shift")
      t.applyLineShift && t.applyLineShift(_, b);
    else if (T === "team")
      t.setLineTeam && t.setLineTeam(v.lineId, b);
    else if (T === "start" || T === "end") {
      var G = String(b || "").trim();
      if (t.isValidTimeText && !t.isValidTimeText(G)) return;
      T === "start" && (_.startTime = G), T === "end" && (_.endTime = G);
      var P = t.getShift ? t.getShift(_.shiftId) : null, $ = _.startTime || (P ? P.start : ""), Z = _.endTime || (P ? P.end : "");
      _.shiftLabel = ($ || "") + "-" + (Z || "");
    }
    t.updateStatus && t.updateStatus("Updated " + (_.lineCode || v.lineId)), A(), (T === "emp" || T === "position" || T === "shift" || T === "start" || T === "end") && t.renderCoverageBars && t.renderCoverageBars(), T === "team" && t.renderTeams && t.renderTeams(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function p(v) {
    if (!v) return;
    const _ = t.findLineById ? t.findLineById(v.lineId) : null, T = Number(v.dayIndex);
    if (!_ || !Number.isInteger(T) || T < 0 || T > 6) return;
    const b = l(T), x = String(_.id);
    t.state.schedule || (t.state.schedule = {});
    var R = t.state.schedule[x] || t.state.schedule[_.id];
    for (Array.isArray(R) || (R = []), t.state.schedule[x] = R; t.state.schedule[x].length < 7; ) t.state.schedule[x].push("RDO");
    t.state.functionRotation || (t.state.functionRotation = {}), !t.state.functionRotation[x] && t.state.functionRotation[_.id] && (t.state.functionRotation[x] = t.state.functionRotation[_.id]);
    const j = t.state.schedule[x][b] || "RDO", G = _.function === "BAG", P = o(_);
    if (j !== "WORK")
      t.state.schedule[x][b] = "WORK", G ? i(x, b, "BAG") : P ? i(x, b, "PAX") : i(x, b, null);
    else if (G)
      t.state.schedule[x][b] = "RDO", i(x, b, null);
    else if (P) {
      var $ = typeof t.getRotationDuty == "function" ? t.getRotationDuty(_.id, b) : r(_.id, b), Z = $ === "DFO" || $ === "PAX" || !$ ? "PAX" : $;
      Z === "PAX" ? i(x, b, "BAG") : (t.state.schedule[x][b] = "RDO", i(x, b, null));
    } else
      t.state.schedule[x][b] = "RDO", i(x, b, null);
    t.syncRdoDaysFromSchedule && t.syncRdoDaysFromSchedule(_), A(), t.renderCoverageBars && t.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function w(v) {
    if (!v) return;
    const _ = t.findLineById ? t.findLineById(v.lineId) : null, T = Number(v.dayIndex), b = String(v.duty || "").toUpperCase();
    if (!_ || !Number.isInteger(T) || T < 0 || T > 6) return;
    const x = l(T), R = String(_.id);
    t.state.schedule || (t.state.schedule = {}), Array.isArray(t.state.schedule[R]) || (t.state.schedule[R] = Array(7).fill("RDO")), b === "OFF" || b === "RDO" || b === "" ? (t.state.schedule[R][x] = "RDO", i(R, x, null)) : (t.state.schedule[R][x] = "WORK", b === "BAG" ? i(R, x, "BAG") : b === "DFO" ? i(R, x, "DFO") : b === "TRAINING" ? i(R, x, "TRAINING") : b === "-" ? i(R, x, "-") : i(R, x, "PAX")), t.syncRdoDaysFromSchedule && t.syncRdoDaysFromSchedule(_), A(), t.renderCoverageBars && t.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
  }
  function g(v) {
    if (!v) return;
    const _ = t.findLineById ? t.findLineById(v.lineId) : null, T = Number(v.dayIndex), b = v.field, x = String(v.value || "").trim();
    if (!(!_ || !Number.isInteger(T) || T < 0 || T > 6) && !(t.isValidTimeText && !t.isValidTimeText(x))) {
      var R = t.getShift ? t.getShift(_.shiftId) : null, j = _.startTime || (R ? R.start : "08:00"), G = _.endTime || (R ? R.end : "16:30");
      _.dayTimes || (_.dayTimes = {});
      var P = String(T), $ = _.dayTimes[P] || { start: j, end: G };
      b === "start" ? _.dayTimes[P] = { start: x, end: $.end } : b === "end" && (_.dayTimes[P] = { start: $.start, end: x }), A(), t.renderCoverageBars && t.renderCoverageBars(), window.dispatchEvent(new CustomEvent("lines:coverage-refresh"));
    }
  }
  function O(v) {
    v && (t.linesView || (t.linesView = {}), v.sortBy && (t.linesView.sortBy = v.sortBy), v.sortDir && (t.linesView.sortDir = v.sortDir), A());
  }
  function E(v) {
    v && (t.linesView || (t.linesView = {}), v.filterRole !== void 0 && (t.linesView.filterRole = v.filterRole), v.filterShift !== void 0 && (t.linesView.filterShift = v.filterShift), v.filterTeam !== void 0 && (t.linesView.filterTeam = v.filterTeam), v.filterSex !== void 0 && (t.linesView.filterSex = v.filterSex), v.filterDuty !== void 0 && (t.linesView.filterDuty = v.filterDuty), v.filterDay !== void 0 && (t.linesView.filterDay = v.filterDay), v.searchCode !== void 0 && (t.linesView.searchCode = v.searchCode), A());
  }
  const A = () => {
    try {
      const v = n._linesTableApp;
      if (v)
        y(v);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const _ = a();
        typeof t.applyExportCssVars == "function" && t.applyExportCssVars(), n._linesTableApp = new ec({
          target: n,
          props: {
            rows: Array.isArray(_) ? _ : [],
            shiftOptions: c(),
            teamOptions: f(),
            exportStyle: d(),
            currentSortBy: t.linesView && t.linesView.sortBy || "role",
            currentSortDir: t.linesView && t.linesView.sortDir || "asc",
            filterRole: t.linesView && t.linesView.filterRole || "ALL",
            filterShift: t.linesView && t.linesView.filterShift || "",
            filterTeam: t.linesView && t.linesView.filterTeam || "",
            filterSex: t.linesView && t.linesView.filterSex || "",
            filterDuty: t.linesView && t.linesView.filterDuty || "",
            filterDay: t.linesView && t.linesView.filterDay || "",
            searchCode: t.linesView && t.linesView.searchCode || "",
            onInlineEdit: h,
            onDayToggle: p,
            onDayDutyEdit: w,
            onDayTimeEdit: g,
            onSort: O,
            onFilter: E
          }
        });
      }
    } catch (v) {
      console.error("lines-table: refresh failed", v);
    }
  };
  A(), t.bindLinesUI && t.bindLinesUI(), document.addEventListener("click", (v) => {
    const _ = v.target.closest?.(".tab-btn");
    _ && _.dataset.tab === "lines" && A();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((v) => {
    window.addEventListener(v, A);
  }), n.refresh = A;
}
export {
  sc as initLinesTable
};
