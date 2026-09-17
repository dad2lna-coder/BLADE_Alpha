var Kt = Object.defineProperty;
var Ht = (t, e, n) => e in t ? Kt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ue = (t, e, n) => Ht(t, typeof e != "symbol" ? e + "" : e, n);
function B() {
}
function zt(t) {
  return t();
}
function dt() {
  return /* @__PURE__ */ Object.create(null);
}
function ye(t) {
  t.forEach(zt);
}
function et(t) {
  return typeof t == "function";
}
function Rt(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Xt(t) {
  return Object.keys(t).length === 0;
}
function Lt(t, ...e) {
  if (t == null) {
    for (const s of e)
      s(void 0);
    return B;
  }
  const n = t.subscribe(...e);
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
function mt(t) {
  return t ?? "";
}
function f(t, e) {
  t.appendChild(e);
}
function te(t, e, n) {
  t.insertBefore(e, n || null);
}
function $(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function Ne(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function y(t) {
  return document.createElement(t);
}
function U(t) {
  return document.createTextNode(t);
}
function x() {
  return U(" ");
}
function Gt() {
  return U("");
}
function Y(t, e, n, s) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n, s);
}
function p(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Jt(t) {
  return Array.from(t.childNodes);
}
function ee(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function R(t, e) {
  t.value = e ?? "";
}
function D(t, e, n, s) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
function X(t, e, n) {
  for (let s = 0; s < t.options.length; s += 1) {
    const i = t.options[s];
    if (i.__value === e) {
      i.selected = !0;
      return;
    }
  }
  t.selectedIndex = -1;
}
let Ae;
function Oe(t) {
  Ae = t;
}
function Ut() {
  if (!Ae) throw new Error("Function called outside component initialization");
  return Ae;
}
function qt(t) {
  Ut().$$.on_mount.push(t);
}
const Se = [], Qe = [];
let we = [];
const gt = [], $t = /* @__PURE__ */ Promise.resolve();
let Ye = !1;
function Qt() {
  Ye || (Ye = !0, $t.then(Dt));
}
function Ze(t) {
  we.push(t);
}
const qe = /* @__PURE__ */ new Set();
let ve = 0;
function Dt() {
  if (ve !== 0)
    return;
  const t = Ae;
  do {
    try {
      for (; ve < Se.length; ) {
        const e = Se[ve];
        ve++, Oe(e), Yt(e.$$);
      }
    } catch (e) {
      throw Se.length = 0, ve = 0, e;
    }
    for (Oe(null), Se.length = 0, ve = 0; Qe.length; ) Qe.pop()();
    for (let e = 0; e < we.length; e += 1) {
      const n = we[e];
      qe.has(n) || (qe.add(n), n());
    }
    we.length = 0;
  } while (Se.length);
  for (; gt.length; )
    gt.pop()();
  Ye = !1, qe.clear(), Oe(t);
}
function Yt(t) {
  if (t.fragment !== null) {
    t.update(), ye(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(Ze);
  }
}
function Zt(t) {
  const e = [], n = [];
  we.forEach((s) => t.indexOf(s) === -1 ? e.push(s) : n.push(s)), n.forEach((s) => s()), we = e;
}
const en = /* @__PURE__ */ new Set();
function tn(t, e) {
  t && t.i && (en.delete(t), t.i(e));
}
function Z(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function nn(t, e, n) {
  const { fragment: s, after_update: i } = t.$$;
  s && s.m(e, n), Ze(() => {
    const l = t.$$.on_mount.map(zt).filter(et);
    t.$$.on_destroy ? t.$$.on_destroy.push(...l) : ye(l), t.$$.on_mount = [];
  }), i.forEach(Ze);
}
function sn(t, e) {
  const n = t.$$;
  n.fragment !== null && (Zt(n.after_update), ye(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function ln(t, e) {
  t.$$.dirty[0] === -1 && (Se.push(t), Qt(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function on(t, e, n, s, i, l, o = null, r = [-1]) {
  const a = Ae;
  Oe(t);
  const c = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: l,
    update: B,
    not_equal: i,
    bound: dt(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (a ? a.$$.context : [])),
    // everything else
    callbacks: dt(),
    dirty: r,
    skip_bound: !1,
    root: e.target || a.$$.root
  };
  o && o(c.root);
  let _ = !1;
  if (c.ctx = n ? n(t, e.props || {}, (m, O, ...w) => {
    const u = w.length ? w[0] : O;
    return c.ctx && i(c.ctx[m], c.ctx[m] = u) && (!c.skip_bound && c.bound[m] && c.bound[m](u), _ && ln(t, m)), O;
  }) : [], c.update(), _ = !0, ye(c.before_update), c.fragment = s ? s(c.ctx) : !1, e.target) {
    if (e.hydrate) {
      const m = Jt(e.target);
      c.fragment && c.fragment.l(m), m.forEach($);
    } else
      c.fragment && c.fragment.c();
    e.intro && tn(t.$$.fragment), nn(t, e.target, e.anchor), Dt();
  }
  Oe(a);
}
class rn {
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
    sn(this, 1), this.$destroy = B;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, n) {
    if (!et(n))
      return B;
    const s = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return s.push(n), () => {
      const i = s.indexOf(n);
      i !== -1 && s.splice(i, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !Xt(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const an = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(an);
function cn(t) {
  return typeof t == "object" ? t.key : t;
}
function un(t, e) {
  const n = t.length;
  return new Proxy(t, {
    get(s, i, l) {
      if (typeof i == "string") {
        const o = i.charCodeAt(0);
        if (o >= 48 && o <= 57) {
          const r = +i;
          if (Number.isInteger(r) && r >= 0 && r < n) {
            let a = s[r];
            if (typeof a != "object") {
              const c = e[r * 2];
              a = s[r] = {
                index: r,
                key: a,
                start: c,
                size: e[r * 2 + 1],
                end: c + e[r * 2 + 1],
                lane: 0
              };
            }
            return a;
          }
        }
        if (i === "length") return n;
      }
      return Reflect.get(s, i, l);
    }
  });
}
function pe(t, e, n) {
  let s = n.initialDeps ?? [], i, l = !0;
  function o() {
    var r;
    const a = process.env.NODE_ENV !== "production" && !!n.key && !!((r = n.debug) != null && r.call(n));
    let c = 0;
    a && (c = Date.now());
    const _ = t();
    if (!(_.length !== s.length || _.some((w, u) => s[u] !== w)))
      return i;
    s = _;
    let O = 0;
    if (a && (O = Date.now()), i = e(..._), a) {
      const w = Math.round((Date.now() - c) * 100) / 100, u = Math.round((Date.now() - O) * 100) / 100, h = u / 16, d = (g, E) => {
        for (g = String(g); g.length < E; )
          g = " " + g;
        return g;
      };
      console.info(
        `%c⏱ ${d(u, 5)} /${d(w, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * h, 120)
        )}deg 100% 31%);`,
        n?.key
      );
    }
    return n?.onChange && !(l && n.skipInitialOnChange) && n.onChange(i), l = !1, i;
  }
  return o.updateDeps = (r) => {
    s = r;
  }, o;
}
function _t(t, e) {
  if (t === void 0)
    throw new Error("Unexpected undefined");
  return t;
}
const vt = (t, e) => Math.abs(t - e) < 1.01, hn = (t, e, n) => {
  let s;
  return Object.assign(
    function(...i) {
      t.clearTimeout(s), s = t.setTimeout(() => e.apply(this, i), n);
    },
    {
      // The handle is closure-local, so a caller that has already
      // unsubscribed has no way to stop a queued call. Teardown paths use
      // this to drop the pending invocation instead of letting it land.
      cancel: () => {
        t.clearTimeout(s);
      }
    }
  );
};
let Ee;
const $e = () => {
  if (Ee !== void 0) return Ee;
  if (typeof navigator > "u") return Ee = !1;
  if (/iP(hone|od|ad)/.test(navigator.userAgent)) return Ee = !0;
  const t = navigator.maxTouchPoints;
  return Ee = navigator.platform === "MacIntel" && t !== void 0 && t > 0;
}, pt = (t) => {
  const { offsetWidth: e, offsetHeight: n } = t;
  return { width: e, height: n };
}, fn = (t) => t, dn = (t) => {
  const e = Math.max(t.startIndex - t.overscan, 0), s = Math.min(t.endIndex + t.overscan, t.count - 1) - e + 1, i = new Array(s);
  for (let l = 0; l < s; l++)
    i[l] = e + l;
  return i;
}, mn = (t, e) => {
  const n = t.scrollElement;
  if (!n)
    return;
  const s = t.targetWindow;
  if (!s)
    return;
  const i = (o) => {
    const { width: r, height: a } = o;
    e({ width: Math.round(r), height: Math.round(a) });
  };
  if (i(pt(n)), !s.ResizeObserver)
    return () => {
    };
  const l = new s.ResizeObserver((o) => {
    const r = () => {
      const a = o[0];
      if (a?.borderBoxSize) {
        const c = a.borderBoxSize[0];
        if (c) {
          i({ width: c.inlineSize, height: c.blockSize });
          return;
        }
      }
      i(pt(n));
    };
    t.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(r) : r();
  });
  return l.observe(n, { box: "border-box" }), () => {
    l.unobserve(n);
  };
}, Be = {
  passive: !0
}, gn = typeof window > "u" ? !0 : "onscrollend" in window, _n = (t, e, n) => {
  const s = t.scrollElement;
  if (!s)
    return;
  const i = t.targetWindow;
  if (!i)
    return;
  const l = t.options.useScrollendEvent && gn;
  let o = 0;
  const r = l ? null : hn(
    i,
    () => e(n(s), !1),
    t.options.isScrollingResetDelay
  ), a = (m) => () => {
    o = n(s), r?.(), e(o, m);
  }, c = a(!0), _ = a(!1);
  return s.addEventListener("scroll", c, Be), l && s.addEventListener("scrollend", _, Be), () => {
    s.removeEventListener("scroll", c), l && s.removeEventListener("scrollend", _), r?.cancel();
  };
}, vn = (t, e) => _n(t, e, (n) => {
  const { horizontal: s, isRtl: i } = t.options;
  return s ? n.scrollLeft * (i && -1 || 1) : n.scrollTop;
}), pn = (t, e, n) => {
  if (n.options.useCachedMeasurements) {
    const s = n.indexFromElement(t), i = n.options.getItemKey(s);
    return n.itemSizeCache.get(i) ?? n.options.estimateSize(s);
  }
  if (e?.borderBoxSize) {
    const s = e.borderBoxSize[0];
    if (s)
      return Math.round(
        s[n.options.horizontal ? "inlineSize" : "blockSize"]
      );
  }
  if (!e) {
    const s = n.indexFromElement(t), i = n.options.getItemKey(s), l = n.itemSizeCache.get(i);
    if (l !== void 0)
      return l;
  }
  return t[n.options.horizontal ? "offsetWidth" : "offsetHeight"];
}, bn = (t, {
  adjustments: e = 0,
  behavior: n
}, s) => {
  var i, l;
  (l = (i = s.scrollElement) == null ? void 0 : i.scrollTo) == null || l.call(i, {
    [s.options.horizontal ? "left" : "top"]: t + e,
    behavior: n
  });
}, Sn = bn;
function wn(t, e, n, s) {
  if (e === 0) return !1;
  const i = s(0), l = /* @__PURE__ */ new Set();
  let o = 0;
  for (; o < t; ) {
    const a = n(o);
    if (a === i) break;
    l.add(a), o++;
  }
  const r = t - o;
  if (r === 0 || r >= e) return !1;
  for (let a = 0; a < r; a++)
    if (s(a) !== n(o + a)) return !1;
  for (let a = r; a < e; a++)
    if (l.has(s(a))) return !1;
  return !0;
}
class yn {
  constructor(e) {
    this.unsubs = [], this.scrollElement = null, this.targetWindow = null, this.isScrolling = !1, this.scrollState = null, this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache = /* @__PURE__ */ new Map(), this.itemSizeCacheVersion = 0, this.laneAssignments = /* @__PURE__ */ new Map(), this.pendingMin = null, this.prevLanes = void 0, this.lanesChangedFlag = !1, this.lanesSettling = !1, this.pendingScrollAnchor = null, this.scrollRect = null, this.scrollOffset = null, this.scrollDirection = null, this.scrollAdjustments = 0, this._iosDeferredAdjustment = 0, this._iosTouching = !1, this._iosJustTouchEnded = !1, this._iosTouchEndTimerId = null, this._intendedScrollOffset = null, this._clampedAdjustment = null, this.elementsCache = /* @__PURE__ */ new Map(), this.now = () => {
      var n, s, i;
      return ((i = (s = (n = this.targetWindow) == null ? void 0 : n.performance) == null ? void 0 : s.now) == null ? void 0 : i.call(s)) ?? Date.now();
    }, this.observer = /* @__PURE__ */ (() => {
      let n = null;
      const s = () => n || (!this.targetWindow || !this.targetWindow.ResizeObserver ? null : n = new this.targetWindow.ResizeObserver((i) => {
        i.forEach((l) => {
          const o = () => {
            const r = l.target, a = this.indexFromElement(r);
            if (!r.isConnected) {
              this.observer.unobserve(r);
              for (const [c, _] of this.elementsCache)
                if (_ === r) {
                  this.elementsCache.delete(c);
                  break;
                }
              return;
            }
            this.isIndexInRange(a) && this.shouldMeasureDuringScroll(a) && this.resizeItem(
              a,
              this.options.measureElement(r, l, this)
            );
          };
          this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(o) : o();
        });
      }));
      return {
        disconnect: () => {
          var i;
          (i = s()) == null || i.disconnect(), n = null;
        },
        observe: (i) => {
          var l;
          return (l = s()) == null ? void 0 : l.observe(i, { box: "border-box" });
        },
        unobserve: (i) => {
          var l;
          return (l = s()) == null ? void 0 : l.unobserve(i);
        }
      };
    })(), this.range = null, this.setOptions = (n) => {
      var s;
      const i = {
        debug: !1,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: !1,
        getItemKey: fn,
        rangeExtractor: dn,
        onChange: () => {
        },
        measureElement: pn,
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
      for (const m in n) {
        const O = n[m];
        O !== void 0 && (i[m] = O);
      }
      const l = this.options;
      let o = null, r = null, a = !1;
      if (l !== void 0 && l.enabled && i.enabled && i.anchorTo === "end" && this.scrollElement !== null) {
        const m = l.count, O = i.count, w = this.getMeasurements(), u = ((s = this._singleLaneMeasurements) == null ? void 0 : s.items) ?? w, h = (z) => cn(u[z]), d = m > 0 ? h(0) : null, g = m > 0 ? h(m - 1) : null;
        if (O !== m || m > 0 && O > 0 && (i.getItemKey(0) !== d || i.getItemKey(O - 1) !== g)) {
          a = !0;
          const z = m > 0 ? this.getVirtualItemForOffset(this.getScrollOffset()) ?? w[0] : null;
          z && (o = [z.key, this.getScrollOffset() - z.start]);
          const C = i.followOnAppend === !0 ? "auto" : i.followOnAppend || null;
          C && O > 0 && this.isAtEnd(l.scrollEndThreshold) && (m === 0 || i.getItemKey(O - 1) !== g) && (O > m || wn(
            m,
            O,
            h,
            i.getItemKey
          )) && (r = C);
        }
      }
      this.options = i, a && (this.pendingMin = 0, this.itemSizeCacheVersion++);
      let c = !1, _ = 0;
      if (o && this.scrollOffset !== null) {
        const [m, O] = o, w = this.getMeasurements(), { count: u, getItemKey: h } = this.options;
        let d = 0;
        for (; d < u && h(d) !== m; )
          d++;
        if (d < u) {
          const g = w[d];
          if (g) {
            const E = Math.max(0, g.start + O);
            !r && E !== this.scrollOffset && (_ = E - this.scrollOffset, this.scrollOffset = E, c = !0);
          }
        }
      }
      (c || r) && (this.pendingScrollAnchor = [
        c ? o[0] : null,
        c ? o[1] : 0,
        r,
        _
      ]);
    }, this.notify = (n) => {
      var s, i;
      (i = (s = this.options).onChange) == null || i.call(s, this, n);
    }, this.maybeNotify = pe(
      () => (this.calculateRange(), [
        this.isScrolling,
        this.range ? this.range.startIndex : null,
        this.range ? this.range.endIndex : null
      ]),
      (n) => {
        this.notify(n);
      },
      {
        key: process.env.NODE_ENV !== "production" && "maybeNotify",
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
      const i = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== i) {
        if (this.cleanup(), !i) {
          this.maybeNotify();
          return;
        }
        if (this.scrollElement = i, this.scrollElement && "ownerDocument" in this.scrollElement ? this.targetWindow = this.scrollElement.ownerDocument.defaultView : this.targetWindow = ((n = this.scrollElement) == null ? void 0 : n.window) ?? null, this.elementsCache.forEach((o) => {
          this.observer.observe(o);
        }), this.unsubs.push(
          this.options.observeElementRect(this, (o) => {
            this.scrollRect = o, this.maybeNotify();
          })
        ), this.unsubs.push(
          this.options.observeElementOffset(this, (o, r) => {
            if (r && this._intendedScrollOffset === null && o === this.scrollOffset)
              return;
            this._intendedScrollOffset !== null && Math.abs(o - this._intendedScrollOffset) < 1.5 && (o = this._intendedScrollOffset), this._intendedScrollOffset = null, this._clampedAdjustment !== null && Math.abs(o - this._clampedAdjustment.maxAtWrite) >= 1.5 && (this._clampedAdjustment = null), this.scrollAdjustments = 0;
            const a = this.getScrollOffset();
            this.scrollDirection = r ? a === o ? this.scrollDirection : a < o ? "forward" : "backward" : null, this.scrollOffset = o, this.isScrolling = r, this._flushIosDeferredIfReady(), this.scrollState && this.scheduleScrollReconcile(), this.maybeNotify();
          })
        ), "addEventListener" in this.scrollElement) {
          const o = this.scrollElement, r = () => {
            this._iosTouching = !0, this._iosJustTouchEnded = !1, this._iosTouchEndTimerId !== null && this.targetWindow != null && (this.targetWindow.clearTimeout(this._iosTouchEndTimerId), this._iosTouchEndTimerId = null);
          }, a = () => {
            this._iosTouching = !1, !(!$e() || this.targetWindow == null) && (this._iosJustTouchEnded = !0, this._iosTouchEndTimerId = this.targetWindow.setTimeout(() => {
              this._iosJustTouchEnded = !1, this._iosTouchEndTimerId = null, this._flushIosDeferredIfReady();
            }, 150));
          };
          o.addEventListener(
            "touchstart",
            r,
            Be
          ), o.addEventListener(
            "touchend",
            a,
            Be
          ), this.unsubs.push(() => {
            o.removeEventListener("touchstart", r), o.removeEventListener("touchend", a), this._iosTouchEndTimerId !== null && this.targetWindow != null && (this.targetWindow.clearTimeout(this._iosTouchEndTimerId), this._iosTouchEndTimerId = null);
          });
        }
        this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        });
      }
      const l = this.pendingScrollAnchor;
      if (this.pendingScrollAnchor = null, l && this.scrollElement && this.options.enabled) {
        const [o, r, a, c] = l;
        o !== null && !a && ($e() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded) ? c !== 0 && (this._iosDeferredAdjustment += c) : ((s = this.scrollState) == null ? void 0 : s.behavior) === "smooth" && !vt(
          this.getScrollOffset() - c,
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
      const { target: n, maxAtWrite: s } = this._clampedAdjustment, i = this.getMaxScrollOffset();
      i > s + 0.5 && (this._clampedAdjustment = n > i + 0.5 ? { target: n, maxAtWrite: i } : null, this._scrollToOffset(n, {
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
      const i = this._iosDeferredAdjustment;
      this._iosDeferredAdjustment = 0, this._scrollToOffset(n, {
        adjustments: this.scrollAdjustments += i,
        behavior: void 0
      });
    }, this.rafId = null, this.getSize = () => this.options.enabled ? (this.scrollRect = this.scrollRect ?? this.options.initialRect, this.scrollRect[this.options.horizontal ? "width" : "height"]) : (this.scrollRect = null, 0), this.getScrollOffset = () => this.options.enabled ? (this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset), this.scrollOffset) : (this.scrollOffset = null, 0), this.getMeasurementOptions = pe(
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
      (n, s, i, l, o, r, a, c) => (this.prevLanes !== void 0 && this.prevLanes !== r && (this.lanesChangedFlag = !0), this.prevLanes = r, this.pendingMin = null, {
        count: n,
        paddingStart: s,
        scrollMargin: i,
        getItemKey: l,
        enabled: o,
        lanes: r,
        laneAssignmentMode: a,
        gap: c
      }),
      {
        key: !1
      }
    ), this.isIndexInRange = (n) => n >= 0 && n < this.options.count, this.getMeasurements = pe(
      () => [this.getMeasurementOptions(), this.itemSizeCacheVersion],
      ({
        count: n,
        paddingStart: s,
        scrollMargin: i,
        getItemKey: l,
        enabled: o,
        lanes: r,
        laneAssignmentMode: a,
        gap: c
      }, _) => {
        var m;
        const O = this.itemSizeCache;
        if (!o)
          return this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), [];
        if (this.laneAssignments.size > n)
          for (const E of this.laneAssignments.keys())
            E >= n && this.laneAssignments.delete(E);
        this.lanesChangedFlag && (this.lanesChangedFlag = !1, this.lanesSettling = !0, this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), this.pendingMin = null), this.measurementsCache.length === 0 && !this.lanesSettling && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((E) => {
          this.itemSizeCache.set(E.key, E.size);
        }));
        const w = this.lanesSettling ? 0 : this.pendingMin ?? 0;
        if (this.pendingMin = null, this.lanesSettling && this.measurementsCache.length === n && (this.lanesSettling = !1), r === 1) {
          const E = n * 2;
          let A = (m = this._singleLaneMeasurements) == null ? void 0 : m.flat;
          if (!A || A.length < E) {
            const M = new Float64Array(E);
            A && w > 0 && M.set(A.subarray(0, w * 2)), A = M;
          }
          const z = w === 0 ? new Array(n) : this._singleLaneMeasurements.items.slice();
          let C;
          if (w === 0)
            C = s + i;
          else {
            const M = w - 1;
            C = A[M * 2] + A[M * 2 + 1] + c;
          }
          for (let M = w; M < n; M++) {
            const P = l(M);
            z[M] = P;
            const b = O.get(P), T = typeof b == "number" ? b : this.options.estimateSize(M);
            A[M * 2] = C, A[M * 2 + 1] = T, C += T + c;
          }
          this._singleLaneMeasurements = { flat: A, items: z };
          const W = un(z, A);
          return this.measurementsCache = W, W;
        }
        const u = this.measurementsCache.slice(0, w), h = new Array(r).fill(
          void 0
        ), d = new Float64Array(r);
        let g = 0;
        for (let E = 0; E < w; E++) {
          const A = u[E];
          A && (h[A.lane] === void 0 && g++, h[A.lane] = E, d[A.lane] = A.end);
        }
        for (let E = w; E < n; E++) {
          const A = l(E), z = this.laneAssignments.get(E);
          let C, W;
          const M = a === "estimate" || O.has(A);
          if (z !== void 0 && this.options.lanes > 1) {
            C = z;
            const K = h[C], L = K !== void 0 ? u[K] : void 0;
            W = L ? L.end + c : s + i;
          } else if (g === r) {
            let K = 0, L = d[0], q = h[0];
            for (let V = 1; V < r; V++) {
              const J = d[V];
              (J < L || J === L && h[V] < q) && (K = V, L = J, q = h[V]);
            }
            C = K, W = L + c, M && this.laneAssignments.set(E, C);
          } else
            C = E % this.options.lanes, W = s + i, M && this.laneAssignments.set(E, C);
          const P = O.get(A), b = typeof P == "number" ? P : this.options.estimateSize(E), T = W + b;
          u[E] = {
            index: E,
            start: W,
            size: b,
            end: T,
            key: A,
            lane: C
          }, h[C] === void 0 && g++, h[C] = E, d[C] = T;
        }
        return this.measurementsCache = u, u;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getMeasurements",
        debug: () => this.options.debug
      }
    ), this.calculateRange = pe(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (n, s, i, l) => n.length === 0 || s === 0 ? (this.range = null, null) : (this.range = On(
        n,
        s,
        i,
        l,
        // Pass the typed array so binary search + forward-walk can read
        // start/end directly from Float64Array, skipping the Proxy traps.
        l === 1 && this._singleLaneMeasurements !== null ? this._singleLaneMeasurements.flat : null
      ), this.range),
      {
        key: process.env.NODE_ENV !== "production" && "calculateRange",
        debug: () => this.options.debug
      }
    ), this.getVirtualIndexes = pe(
      () => {
        let n = null, s = null;
        const i = this.calculateRange();
        return i && (n = i.startIndex, s = i.endIndex), this.maybeNotify.updateDeps([this.isScrolling, n, s]), [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          n,
          s
        ];
      },
      (n, s, i, l, o) => l === null || o === null ? [] : n({
        startIndex: l,
        endIndex: o,
        overscan: s,
        count: i
      }),
      {
        key: process.env.NODE_ENV !== "production" && "getVirtualIndexes",
        debug: () => this.options.debug
      }
    ), this.indexFromElement = (n) => {
      const s = this.options.indexAttribute, i = n.getAttribute(s);
      return i ? parseInt(i, 10) : (console.warn(
        `Missing attribute name '${s}={index}' on measured element.`
      ), -1);
    }, this.shouldMeasureDuringScroll = (n) => {
      var s;
      if (!this.scrollState || this.scrollState.behavior !== "smooth")
        return !0;
      const i = this.scrollState.index ?? ((s = this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)) == null ? void 0 : s.index);
      if (i !== void 0 && this.range) {
        const l = Math.max(
          this.options.overscan,
          Math.ceil((this.range.endIndex - this.range.startIndex) / 2)
        ), o = Math.max(0, i - l), r = Math.min(
          this.options.count - 1,
          i + l
        );
        return n >= o && n <= r;
      }
      return !0;
    }, this.measureElement = (n) => {
      if (!n) {
        this.elementsCache.forEach((o, r) => {
          o.isConnected || (this.observer.unobserve(o), this.elementsCache.delete(r));
        });
        return;
      }
      const s = this.indexFromElement(n);
      if (!this.isIndexInRange(s)) return;
      const i = this.options.getItemKey(s), l = this.elementsCache.get(i);
      l !== n && (l && this.observer.unobserve(l), this.observer.observe(n), this.elementsCache.set(i, n)), (!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(s) && this.resizeItem(s, this.options.measureElement(n, void 0, this));
    }, this.resizeItem = (n, s) => {
      var i, l, o;
      if (!this.isIndexInRange(n)) return;
      let r, a, c;
      const _ = (i = this._singleLaneMeasurements) == null ? void 0 : i.flat;
      if (this.options.lanes === 1 && _ != null)
        c = this.options.getItemKey(n), a = _[n * 2], r = _[n * 2 + 1];
      else {
        const w = this.measurementsCache[n];
        if (!w) return;
        c = w.key, a = w.start, r = w.size;
      }
      const m = this.itemSizeCache.get(c) ?? r, O = s - m;
      if (O !== 0) {
        const w = this.options.anchorTo === "end" && ((l = this.scrollState) == null ? void 0 : l.behavior) !== "smooth" && this.getVirtualDistanceFromEnd() <= this.options.scrollEndThreshold, u = w ? this.getTotalSize() : 0, h = this.getScrollOffset() + this.scrollAdjustments, g = !this.itemSizeCache.has(c) ? (
          // First measurement: compensate any item whose top sits above the
          // fold — the estimate→actual delta must be corrected regardless of
          // scroll direction, since the whole estimated block was above it.
          a < h
        ) : (
          // Re-measurement: only compensate an item that is ENTIRELY above the
          // fold. An item that merely *spans* the fold (top above, bottom
          // below — e.g. a streaming chat message growing at its bottom)
          // changes size *below* the anchor point, so shifting scrollTop by the
          // delta would drag the viewport downward on every growth (#1218).
          // Also skip during backward scroll to avoid the "items jump while
          // scrolling up" cascade.
          a + m <= h && this.scrollDirection !== "backward"
        ), E = ((o = this.scrollState) == null ? void 0 : o.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(
          // The callback expects a VirtualItem; build one lazily only
          // when the consumer actually supplied a custom predicate.
          this.measurementsCache[n] ?? {
            index: n,
            key: c,
            start: a,
            size: r,
            end: a + r,
            lane: 0
          },
          O,
          this
        ) : g);
        (this.pendingMin === null || n < this.pendingMin) && (this.pendingMin = n), this.itemSizeCache.set(c, s), this.itemSizeCacheVersion++;
        let A = !1;
        w ? A = this.applyScrollAdjustment(
          this.getTotalSize() - u
        ) : E && (A = this.applyScrollAdjustment(O)), this.notify(A), this._retryClampedAdjustment();
      }
    }, this.getVirtualItems = pe(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (n, s) => {
        const i = [];
        for (let l = 0, o = n.length; l < o; l++) {
          const r = n[l], a = s[r];
          i.push(a);
        }
        return i;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getVirtualItems",
        debug: () => this.options.debug
      }
    ), this.getVirtualItemForOffset = (n) => {
      var s;
      const i = this.getMeasurements();
      if (i.length === 0)
        return;
      const l = (s = this._singleLaneMeasurements) == null ? void 0 : s.flat, o = this.options.lanes === 1 && l != null, r = kt(
        0,
        i.length - 1,
        o ? (a) => l[a * 2] : (a) => _t(i[a]).start,
        n
      );
      return _t(i[r]);
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
    ), this.getDistanceFromEnd = () => Math.max(this.getMaxScrollOffset() - this.getScrollOffset(), 0), this.isAtEnd = (n = this.options.scrollEndThreshold) => this.getDistanceFromEnd() <= n, this.getOffsetForAlignment = (n, s, i = 0) => {
      if (!this.scrollElement) return 0;
      const l = this.getSize(), o = this.getScrollOffset();
      s === "auto" && (s = n >= o + l ? "end" : "start"), s === "center" ? n += (i - l) / 2 : s === "end" && (n -= l);
      const r = this.getMaxScrollOffset();
      return Math.max(Math.min(r, n), 0);
    }, this.getOffsetForIndex = (n, s = "auto") => {
      n = Math.max(0, Math.min(n, this.options.count - 1));
      const i = this.getSize(), l = this.getScrollOffset(), o = this.measurementsCache[n];
      if (!o) return;
      if (s === "auto")
        if (o.end >= l + i - this.options.scrollPaddingEnd)
          s = "end";
        else if (o.start <= l + this.options.scrollPaddingStart)
          s = "start";
        else
          return [l, s];
      if (s === "end" && n === this.options.count - 1)
        return [this.getMaxScrollOffset(), s];
      const r = s === "end" ? o.end + this.options.scrollPaddingEnd : o.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(r, s, o.size),
        s
      ];
    }, this.scrollToOffset = (n, { align: s = "start", behavior: i = "auto" } = {}) => {
      this._iosDeferredAdjustment = 0;
      const l = this.getOffsetForAlignment(n, s), o = this.now();
      this.scrollState = {
        index: null,
        align: s,
        behavior: i,
        startedAt: o,
        lastTargetOffset: l,
        stableFrames: 0
      }, this._scrollToOffset(l, { adjustments: void 0, behavior: i }), this.scheduleScrollReconcile();
    }, this.scrollToIndex = (n, {
      align: s = "auto",
      behavior: i = "auto"
    } = {}) => {
      this._iosDeferredAdjustment = 0, n = Math.max(0, Math.min(n, this.options.count - 1));
      const l = this.getOffsetForIndex(n, s);
      if (!l)
        return;
      const [o, r] = l, a = this.now();
      this.scrollState = {
        index: n,
        align: r,
        behavior: i,
        startedAt: a,
        lastTargetOffset: o,
        stableFrames: 0
      }, this._scrollToOffset(o, { adjustments: void 0, behavior: i }), this.scheduleScrollReconcile();
    }, this.scrollBy = (n, { behavior: s = "auto" } = {}) => {
      const i = this.getScrollOffset() + n, l = this.now();
      this.scrollState = {
        index: null,
        align: "start",
        behavior: s,
        startedAt: l,
        lastTargetOffset: i,
        stableFrames: 0
      }, this._scrollToOffset(i, { adjustments: void 0, behavior: s }), this.scheduleScrollReconcile();
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
      const i = this.getMeasurements();
      let l;
      if (i.length === 0)
        l = this.options.paddingStart;
      else if (this.options.lanes === 1) {
        const o = i.length - 1, r = (n = this._singleLaneMeasurements) == null ? void 0 : n.flat;
        r != null ? l = r[o * 2] + r[o * 2 + 1] : l = ((s = i[o]) == null ? void 0 : s.end) ?? 0;
      } else {
        const o = Array(this.options.lanes).fill(null);
        let r = i.length - 1;
        for (; r >= 0 && o.some((a) => a === null); ) {
          const a = i[r];
          o[a.lane] === null && (o[a.lane] = a.end), r--;
        }
        l = Math.max(...o.filter((a) => a !== null));
      }
      return Math.max(
        l - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    }, this.takeSnapshot = () => {
      const n = [];
      if (this.itemSizeCache.size === 0) return n;
      const s = this.getMeasurements();
      for (const i of s)
        i && this.itemSizeCache.has(i.key) && n.push({
          index: i.index,
          key: i.key,
          start: i.start,
          size: i.size,
          end: i.end,
          lane: i.lane
        });
      return n;
    }, this._scrollToOffset = (n, {
      adjustments: s,
      behavior: i
    }) => {
      this._intendedScrollOffset = n + (s ?? 0), this.options.scrollToFn(n, { behavior: i, adjustments: s }, this);
    }, this.measure = () => {
      this.pendingMin = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), this.itemSizeCacheVersion++, this.notify(!1);
    }, this.setOptions(e);
  }
  // Returns `true` when it performed a synchronous `scrollTop` write this
  // tick, `false` when the delta was zero or the write was deferred (iOS).
  // `resizeItem` uses that to decide whether the follow-up `notify` must be
  // synchronous so the grown transforms commit in the same paint (#1227).
  applyScrollAdjustment(e, n) {
    if (e === 0) return !1;
    if (process.env.NODE_ENV !== "production" && this.options.debug && console.info("correction", e), $e() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded))
      return this._iosDeferredAdjustment += e, !1;
    {
      const s = this.getScrollOffset() + this.scrollAdjustments + e, i = this.scrollElement, l = i !== null && ("scrollHeight" in i || "document" in i) ? this.getMaxScrollOffset() : null;
      return this._clampedAdjustment = l !== null && s > l + 0.5 ? { target: s, maxAtWrite: l } : null, this._scrollToOffset(this.getScrollOffset(), {
        adjustments: this.scrollAdjustments += e,
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
    const s = this.scrollState.index != null ? this.getOffsetForIndex(this.scrollState.index, this.scrollState.align) : void 0, i = s ? s[0] : this.scrollState.lastTargetOffset, l = 1, o = i !== this.scrollState.lastTargetOffset;
    if (!o && vt(i, this.getScrollOffset())) {
      if (this.scrollState.stableFrames++, this.scrollState.stableFrames >= l) {
        this.getScrollOffset() !== i && this._scrollToOffset(i, {
          adjustments: void 0,
          behavior: "auto"
        }), this.scrollState = null;
        return;
      }
    } else if (this.scrollState.stableFrames = 0, o) {
      const r = this.getSize() || 600, a = Math.abs(i - this.getScrollOffset()), c = this.scrollState.behavior === "smooth" && a > r;
      this.scrollState.lastTargetOffset = i, c || (this.scrollState.behavior = "auto"), this._scrollToOffset(i, {
        adjustments: void 0,
        behavior: c ? "smooth" : "auto"
      });
    }
    this.scheduleScrollReconcile();
  }
}
const kt = (t, e, n, s) => {
  for (; t <= e; ) {
    const i = (t + e) / 2 | 0, l = n(i);
    if (l < s)
      t = i + 1;
    else if (l > s)
      e = i - 1;
    else
      return i;
  }
  return t > 0 ? t - 1 : 0;
};
function En(t, e, n) {
  let s = 0;
  for (; s <= e; ) {
    const i = (s + e) / 2 | 0, l = t[i * 2];
    if (l < n)
      s = i + 1;
    else if (l > n)
      e = i - 1;
    else
      return i;
  }
  return s > 0 ? s - 1 : 0;
}
function On(t, e, n, s, i) {
  const l = t.length - 1;
  if (t.length <= s)
    return { startIndex: 0, endIndex: l };
  if (s === 1 && i !== null) {
    const c = En(
      i,
      l,
      n
    );
    let _ = c;
    const m = n + e;
    for (; _ < l && i[_ * 2] + i[_ * 2 + 1] < m; )
      _++;
    return { startIndex: c, endIndex: _ };
  }
  let r = kt(0, l, (c) => t[c].start, n), a = r;
  if (s === 1)
    for (; a < l && t[a].end < n + e; )
      a++;
  else if (s > 1) {
    const c = Array(s).fill(0);
    for (; a < l && c.some((m) => m < n + e); ) {
      const m = t[a];
      c[m.lane] = m.end, a++;
    }
    const _ = Array(s).fill(n + e);
    for (; r >= 0 && _.some((m) => m >= n); ) {
      const m = t[r];
      _[m.lane] = m.start, r--;
    }
    r = Math.max(0, r - r % s), a = Math.min(l, a + (s - 1 - a % s));
  }
  return { startIndex: r, endIndex: a };
}
const be = [];
function An(t, e) {
  return {
    subscribe: Ft(t, e).subscribe
  };
}
function Ft(t, e = B) {
  let n;
  const s = /* @__PURE__ */ new Set();
  function i(r) {
    if (Rt(t, r) && (t = r, n)) {
      const a = !be.length;
      for (const c of s)
        c[1](), be.push(c, t);
      if (a) {
        for (let c = 0; c < be.length; c += 2)
          be[c][0](be[c + 1]);
        be.length = 0;
      }
    }
  }
  function l(r) {
    i(r(t));
  }
  function o(r, a = B) {
    const c = [r, a];
    return s.add(c), s.size === 1 && (n = e(i, l) || B), r(t), () => {
      s.delete(c), s.size === 0 && n && (n(), n = null);
    };
  }
  return { set: i, update: l, subscribe: o };
}
function In(t, e, n) {
  const s = !Array.isArray(t), i = s ? [t] : t;
  if (!i.every(Boolean))
    throw new Error("derived() expects stores as input, got a falsy value");
  const l = e.length < 2;
  return An(n, (o, r) => {
    let a = !1;
    const c = [];
    let _ = 0, m = B;
    const O = () => {
      if (_)
        return;
      m();
      const u = e(s ? c[0] : c, o, r);
      l ? o(u) : m = et(u) ? u : B;
    }, w = i.map(
      (u, h) => Lt(
        u,
        (d) => {
          c[h] = d, _ &= ~(1 << h), a && O();
        },
        () => {
          _ |= 1 << h;
        }
      )
    );
    return a = !0, O(), function() {
      ye(w), m(), a = !1;
    };
  });
}
function Tn(t) {
  const e = new yn(t), n = e.setOptions;
  let s;
  const i = (l) => {
    const o = {
      ...e.options,
      ...l,
      onChange: l.onChange
    };
    n({
      ...o,
      onChange: (r, a) => {
        s.set(r), o.onChange?.(r, a);
      }
    }), e._willUpdate(), s.set(e);
  };
  return s = Ft(e, () => (i(t), e._didMount())), In(s, (l) => Object.assign(l, { setOptions: i }));
}
function Cn(t) {
  return Tn({
    observeElementRect: mn,
    observeElementOffset: vn,
    scrollToFn: Sn,
    ...t
  });
}
function bt(t, e, n) {
  const s = t.slice();
  s[20] = e[n];
  const i = (
    /*rows*/
    s[0][
      /*virtualRow*/
      s[20].index
    ]
  );
  return s[21] = i, s;
}
function St(t, e, n) {
  const s = t.slice();
  return s[24] = e[n], s;
}
function wt(t, e, n) {
  const s = t.slice();
  return s[27] = e[n], s;
}
function yt(t, e, n) {
  const s = t.slice();
  return s[30] = e[n], s;
}
function Mn(t) {
  let e;
  return {
    c() {
      e = y("div"), e.textContent = "Classic Lines mode active", p(e, "class", "muted");
    },
    m(n, s) {
      te(n, e, s);
    },
    p: B,
    d(n) {
      n && $(e);
    }
  };
}
function zn(t) {
  let e, n, s, i, l, o, r, a = (
    /*$virtualizer*/
    t[4] && Et(t)
  );
  return {
    c() {
      e = y("div"), n = y("table"), s = y("thead"), s.innerHTML = '<tr><th class="svelte-vecfw4">Team</th> <th class="svelte-vecfw4">Line</th> <th class="svelte-vecfw4">Shift</th> <th class="svelte-vecfw4">Start</th> <th class="svelte-vecfw4">End</th> <th class="svelte-vecfw4">Position</th> <th class="svelte-vecfw4">Emp</th> <th class="svelte-vecfw4">Sex</th> <th class="svelte-vecfw4">Function</th> <th class="svelte-vecfw4">RDOs</th> <th class="svelte-vecfw4">Paid</th> <th class="svelte-vecfw4">Sun</th> <th class="svelte-vecfw4">Mon</th> <th class="svelte-vecfw4">Tue</th> <th class="svelte-vecfw4">Wed</th> <th class="svelte-vecfw4">Thu</th> <th class="svelte-vecfw4">Fri</th> <th class="svelte-vecfw4">Sat</th> <th class="svelte-vecfw4">Hours</th></tr>', i = x(), l = y("tbody"), a && a.c(), o = x(), r = y("div"), D(l, "position", "relative"), D(l, "height", "0"), p(n, "class", "data-table lines-editable svelte-vecfw4"), D(n, "width", "max-content"), D(n, "min-width", "1100px"), D(
        r,
        "height",
        /*$virtualizer*/
        (t[4] ? (
          /*$virtualizer*/
          t[4].getTotalSize()
        ) : 0) + "px"
      ), p(e, "class", "lines-virtual-root svelte-vecfw4"), D(e, "height", "100%"), D(e, "overflow", "auto"), D(e, "position", "relative");
    },
    m(c, _) {
      te(c, e, _), f(e, n), f(n, s), f(n, i), f(n, l), a && a.m(l, null), f(e, o), f(e, r), t[19](e);
    },
    p(c, _) {
      /*$virtualizer*/
      c[4] ? a ? a.p(c, _) : (a = Et(c), a.c(), a.m(l, null)) : a && (a.d(1), a = null), _[0] & /*$virtualizer*/
      16 && D(
        r,
        "height",
        /*$virtualizer*/
        (c[4] ? (
          /*$virtualizer*/
          c[4].getTotalSize()
        ) : 0) + "px"
      );
    },
    d(c) {
      c && $(e), a && a.d(), t[19](null);
    }
  };
}
function Et(t) {
  let e, n = Z(
    /*$virtualizer*/
    t[4].getVirtualItems()
  ), s = [];
  for (let i = 0; i < n.length; i += 1)
    s[i] = Tt(bt(t, n, i));
  return {
    c() {
      for (let i = 0; i < s.length; i += 1)
        s[i].c();
      e = Gt();
    },
    m(i, l) {
      for (let o = 0; o < s.length; o += 1)
        s[o] && s[o].m(i, l);
      te(i, e, l);
    },
    p(i, l) {
      if (l[0] & /*$virtualizer, rows, emitDay, emitEdit, shiftOptions, teamOptions*/
      413) {
        n = Z(
          /*$virtualizer*/
          i[4].getVirtualItems()
        );
        let o;
        for (o = 0; o < n.length; o += 1) {
          const r = bt(i, n, o);
          s[o] ? s[o].p(r, l) : (s[o] = Tt(r), s[o].c(), s[o].m(e.parentNode, e));
        }
        for (; o < s.length; o += 1)
          s[o].d(1);
        s.length = n.length;
      }
    },
    d(i) {
      i && $(e), Ne(s, i);
    }
  };
}
function Ot(t) {
  let e, n = (
    /*team*/
    (t[30].name ?? /*team*/
    t[30].id) + ""
  ), s, i;
  return {
    c() {
      e = y("option"), s = U(n), e.__value = i = /*team*/
      t[30].id, R(e, e.__value);
    },
    m(l, o) {
      te(l, e, o), f(e, s);
    },
    p(l, o) {
      o[0] & /*teamOptions*/
      8 && n !== (n = /*team*/
      (l[30].name ?? /*team*/
      l[30].id) + "") && ee(s, n), o[0] & /*teamOptions*/
      8 && i !== (i = /*team*/
      l[30].id) && (e.__value = i, R(e, e.__value));
    },
    d(l) {
      l && $(e);
    }
  };
}
function At(t) {
  let e, n = Ct(
    /*shift*/
    t[27]
  ) + "", s, i;
  return {
    c() {
      e = y("option"), s = U(n), e.__value = i = /*shift*/
      t[27].id, R(e, e.__value);
    },
    m(l, o) {
      te(l, e, o), f(e, s);
    },
    p(l, o) {
      o[0] & /*shiftOptions*/
      4 && n !== (n = Ct(
        /*shift*/
        l[27]
      ) + "") && ee(s, n), o[0] & /*shiftOptions*/
      4 && i !== (i = /*shift*/
      l[27].id) && (e.__value = i, R(e, e.__value));
    },
    d(l) {
      l && $(e);
    }
  };
}
function It(t) {
  let e, n = (
    /*row*/
    (t[21]?.days?.[
      /*i*/
      t[24]
    ] ?? "") + ""
  ), s, i, l, o, r;
  function a() {
    return (
      /*click_handler*/
      t[18](
        /*row*/
        t[21],
        /*i*/
        t[24]
      )
    );
  }
  return {
    c() {
      e = y("td"), s = U(n), p(e, "class", i = mt(Mt(
        /*row*/
        t[21]?.days?.[
          /*i*/
          t[24]
        ]
      )) + " svelte-vecfw4"), p(e, "data-line-id", l = /*row*/
      t[21]?.id), p(
        e,
        "data-day-index",
        /*i*/
        t[24]
      );
    },
    m(c, _) {
      te(c, e, _), f(e, s), o || (r = Y(e, "click", a), o = !0);
    },
    p(c, _) {
      t = c, _[0] & /*rows, $virtualizer*/
      17 && n !== (n = /*row*/
      (t[21]?.days?.[
        /*i*/
        t[24]
      ] ?? "") + "") && ee(s, n), _[0] & /*rows, $virtualizer, teamOptions*/
      25 && i !== (i = mt(Mt(
        /*row*/
        t[21]?.days?.[
          /*i*/
          t[24]
        ]
      )) + " svelte-vecfw4") && p(e, "class", i), _[0] & /*rows, $virtualizer, teamOptions*/
      25 && l !== (l = /*row*/
      t[21]?.id) && p(e, "data-line-id", l);
    },
    d(c) {
      c && $(e), o = !1, r();
    }
  };
}
function Tt(t) {
  let e, n, s, i, l, o, r, a, c, _, m, O, w, u, h, d, g, E, A, z = (
    /*row*/
    (t[21]?.start ?? "") + ""
  ), C, W, M, P = (
    /*row*/
    (t[21]?.end ?? "") + ""
  ), b, T, K, L, q, V, J, ne, Ie, tt, nt, Te, j, se, ie, le, oe, re, Ce, st, it, Me, H, ae, ce, ue, ze, lt, ot, Re, N, he, fe, de, me, Le, rt, at, De, ke = (
    /*row*/
    (t[21]?.rdos ?? "—") + ""
  ), Pe, ct, Fe, xe = (
    /*row*/
    (t[21]?.paid ?? "") + ""
  ), Ke, ut, He, je, We = (
    /*row*/
    (t[21]?.hours ?? "") + ""
  ), Xe, ht, Ve, Ge, ft, ge = Z(
    /*teamOptions*/
    t[3]
  ), k = [];
  for (let S = 0; S < ge.length; S += 1)
    k[S] = Ot(yt(t, ge, S));
  function xt(...S) {
    return (
      /*change_handler*/
      t[11](
        /*row*/
        t[21],
        ...S
      )
    );
  }
  function jt(...S) {
    return (
      /*input_handler*/
      t[12](
        /*row*/
        t[21],
        ...S
      )
    );
  }
  let _e = Z(
    /*shiftOptions*/
    t[2]
  ), F = [];
  for (let S = 0; S < _e.length; S += 1)
    F[S] = At(wt(t, _e, S));
  function Wt(...S) {
    return (
      /*change_handler_1*/
      t[13](
        /*row*/
        t[21],
        ...S
      )
    );
  }
  function Vt(...S) {
    return (
      /*change_handler_2*/
      t[14](
        /*row*/
        t[21],
        ...S
      )
    );
  }
  function Nt(...S) {
    return (
      /*change_handler_3*/
      t[15](
        /*row*/
        t[21],
        ...S
      )
    );
  }
  function Bt(...S) {
    return (
      /*change_handler_4*/
      t[16](
        /*row*/
        t[21],
        ...S
      )
    );
  }
  function Pt(...S) {
    return (
      /*change_handler_5*/
      t[17](
        /*row*/
        t[21],
        ...S
      )
    );
  }
  let Je = Z([0, 1, 2, 3, 4, 5, 6]), G = [];
  for (let S = 0; S < 7; S += 1)
    G[S] = It(St(t, Je, S));
  return {
    c() {
      e = y("tr"), n = y("td"), s = y("select"), i = y("option"), i.textContent = "—";
      for (let S = 0; S < k.length; S += 1)
        k[S].c();
      r = x(), a = y("td"), c = y("input"), O = x(), w = y("td"), u = y("select"), h = y("option"), h.textContent = "—";
      for (let S = 0; S < F.length; S += 1)
        F[S].c();
      E = x(), A = y("td"), C = U(z), W = x(), M = y("td"), b = U(P), T = x(), K = y("td"), L = y("select"), q = y("option"), q.textContent = "—", V = y("option"), V.textContent = "TSO", J = y("option"), J.textContent = "LTSO", ne = y("option"), ne.textContent = "STSO", nt = x(), Te = y("td"), j = y("select"), se = y("option"), se.textContent = "—", ie = y("option"), ie.textContent = "FT", le = y("option"), le.textContent = "PT", oe = y("option"), oe.textContent = "LTSO", re = y("option"), re.textContent = "STSO", it = x(), Me = y("td"), H = y("select"), ae = y("option"), ae.textContent = "—", ce = y("option"), ce.textContent = "M", ue = y("option"), ue.textContent = "F", ot = x(), Re = y("td"), N = y("select"), he = y("option"), he.textContent = "—", fe = y("option"), fe.textContent = "DFO", de = y("option"), de.textContent = "BAG", me = y("option"), me.textContent = "PAX", at = x(), De = y("td"), Pe = U(ke), ct = x(), Fe = y("td"), Ke = U(xe), ut = x();
      for (let S = 0; S < 7; S += 1)
        G[S].c();
      He = x(), je = y("td"), Xe = U(We), ht = x(), i.__value = "", R(i, i.__value), p(s, "class", "line-edit svelte-vecfw4"), p(s, "data-field", "team"), p(s, "data-line-id", l = /*row*/
      t[21]?.id), p(n, "class", "svelte-vecfw4"), p(c, "type", "text"), p(c, "class", "line-edit line-code-input svelte-vecfw4"), p(c, "data-field", "lineCode"), p(c, "data-line-id", _ = /*row*/
      t[21]?.id), c.value = m = /*row*/
      t[21]?.line ?? "", p(a, "class", "svelte-vecfw4"), h.__value = "", R(h, h.__value), p(u, "class", "line-edit svelte-vecfw4"), p(u, "data-field", "shift"), p(u, "data-line-id", d = /*row*/
      t[21]?.id), p(w, "class", "svelte-vecfw4"), p(A, "class", "svelte-vecfw4"), p(M, "class", "svelte-vecfw4"), q.__value = "", R(q, q.__value), V.__value = "TSO", R(V, V.__value), J.__value = "LTSO", R(J, J.__value), ne.__value = "STSO", R(ne, ne.__value), p(L, "class", "line-edit svelte-vecfw4"), p(L, "data-field", "position"), p(L, "data-line-id", Ie = /*row*/
      t[21]?.id), p(K, "class", "svelte-vecfw4"), se.__value = "", R(se, se.__value), ie.__value = "FT", R(ie, ie.__value), le.__value = "PT", R(le, le.__value), oe.__value = "LTSO", R(oe, oe.__value), re.__value = "STSO", R(re, re.__value), p(j, "class", "line-edit svelte-vecfw4"), p(j, "data-field", "emp"), p(j, "data-line-id", Ce = /*row*/
      t[21]?.id), p(Te, "class", "svelte-vecfw4"), ae.__value = "", R(ae, ae.__value), ce.__value = "M", R(ce, ce.__value), ue.__value = "F", R(ue, ue.__value), p(H, "class", "line-edit svelte-vecfw4"), p(H, "data-field", "sex"), p(H, "data-line-id", ze = /*row*/
      t[21]?.id), p(Me, "class", "svelte-vecfw4"), he.__value = "", R(he, he.__value), fe.__value = "DFO", R(fe, fe.__value), de.__value = "BAG", R(de, de.__value), me.__value = "PAX", R(me, me.__value), p(N, "class", "line-edit svelte-vecfw4"), p(N, "data-field", "function"), p(N, "data-line-id", Le = /*row*/
      t[21]?.id), p(Re, "class", "svelte-vecfw4"), p(De, "class", "line-rdo-cell svelte-vecfw4"), p(Fe, "class", "svelte-vecfw4"), p(je, "class", "line-hours svelte-vecfw4"), D(e, "position", "absolute"), D(
        e,
        "top",
        /*virtualRow*/
        t[20].start + "px"
      ), D(e, "left", "0"), D(e, "width", "100%"), D(
        e,
        "height",
        /*virtualRow*/
        t[20].size + "px"
      ), p(e, "data-line-row", Ve = /*row*/
      t[21]?.id);
    },
    m(S, I) {
      te(S, e, I), f(e, n), f(n, s), f(s, i);
      for (let v = 0; v < k.length; v += 1)
        k[v] && k[v].m(s, null);
      X(
        s,
        /*row*/
        t[21]?.teamId ?? ""
      ), f(e, r), f(e, a), f(a, c), f(e, O), f(e, w), f(w, u), f(u, h);
      for (let v = 0; v < F.length; v += 1)
        F[v] && F[v].m(u, null);
      X(
        u,
        /*row*/
        t[21]?.shiftId ?? ""
      ), f(e, E), f(e, A), f(A, C), f(e, W), f(e, M), f(M, b), f(e, T), f(e, K), f(K, L), f(L, q), f(L, V), f(L, J), f(L, ne), X(
        L,
        /*row*/
        t[21]?.position ?? ""
      ), f(e, nt), f(e, Te), f(Te, j), f(j, se), f(j, ie), f(j, le), f(j, oe), f(j, re), X(
        j,
        /*row*/
        t[21]?.emp ?? ""
      ), f(e, it), f(e, Me), f(Me, H), f(H, ae), f(H, ce), f(H, ue), X(
        H,
        /*row*/
        t[21]?.sex ?? ""
      ), f(e, ot), f(e, Re), f(Re, N), f(N, he), f(N, fe), f(N, de), f(N, me), X(
        N,
        /*row*/
        t[21]?.function ?? ""
      ), f(e, at), f(e, De), f(De, Pe), f(e, ct), f(e, Fe), f(Fe, Ke), f(e, ut);
      for (let v = 0; v < 7; v += 1)
        G[v] && G[v].m(e, null);
      f(e, He), f(e, je), f(je, Xe), f(e, ht), Ge || (ft = [
        Y(s, "change", xt),
        Y(c, "input", jt),
        Y(u, "change", Wt),
        Y(L, "change", Vt),
        Y(j, "change", Nt),
        Y(H, "change", Bt),
        Y(N, "change", Pt)
      ], Ge = !0);
    },
    p(S, I) {
      if (t = S, I[0] & /*teamOptions*/
      8) {
        ge = Z(
          /*teamOptions*/
          t[3]
        );
        let v;
        for (v = 0; v < ge.length; v += 1) {
          const Q = yt(t, ge, v);
          k[v] ? k[v].p(Q, I) : (k[v] = Ot(Q), k[v].c(), k[v].m(s, null));
        }
        for (; v < k.length; v += 1)
          k[v].d(1);
        k.length = ge.length;
      }
      if (I[0] & /*rows, $virtualizer, teamOptions*/
      25 && l !== (l = /*row*/
      t[21]?.id) && p(s, "data-line-id", l), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && o !== (o = /*row*/
      t[21]?.teamId ?? "") && X(
        s,
        /*row*/
        t[21]?.teamId ?? ""
      ), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && _ !== (_ = /*row*/
      t[21]?.id) && p(c, "data-line-id", _), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && m !== (m = /*row*/
      t[21]?.line ?? "") && c.value !== m && (c.value = m), I[0] & /*shiftOptions*/
      4) {
        _e = Z(
          /*shiftOptions*/
          t[2]
        );
        let v;
        for (v = 0; v < _e.length; v += 1) {
          const Q = wt(t, _e, v);
          F[v] ? F[v].p(Q, I) : (F[v] = At(Q), F[v].c(), F[v].m(u, null));
        }
        for (; v < F.length; v += 1)
          F[v].d(1);
        F.length = _e.length;
      }
      if (I[0] & /*rows, $virtualizer, teamOptions*/
      25 && d !== (d = /*row*/
      t[21]?.id) && p(u, "data-line-id", d), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && g !== (g = /*row*/
      t[21]?.shiftId ?? "") && X(
        u,
        /*row*/
        t[21]?.shiftId ?? ""
      ), I[0] & /*rows, $virtualizer*/
      17 && z !== (z = /*row*/
      (t[21]?.start ?? "") + "") && ee(C, z), I[0] & /*rows, $virtualizer*/
      17 && P !== (P = /*row*/
      (t[21]?.end ?? "") + "") && ee(b, P), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && Ie !== (Ie = /*row*/
      t[21]?.id) && p(L, "data-line-id", Ie), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && tt !== (tt = /*row*/
      t[21]?.position ?? "") && X(
        L,
        /*row*/
        t[21]?.position ?? ""
      ), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && Ce !== (Ce = /*row*/
      t[21]?.id) && p(j, "data-line-id", Ce), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && st !== (st = /*row*/
      t[21]?.emp ?? "") && X(
        j,
        /*row*/
        t[21]?.emp ?? ""
      ), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && ze !== (ze = /*row*/
      t[21]?.id) && p(H, "data-line-id", ze), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && lt !== (lt = /*row*/
      t[21]?.sex ?? "") && X(
        H,
        /*row*/
        t[21]?.sex ?? ""
      ), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && Le !== (Le = /*row*/
      t[21]?.id) && p(N, "data-line-id", Le), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && rt !== (rt = /*row*/
      t[21]?.function ?? "") && X(
        N,
        /*row*/
        t[21]?.function ?? ""
      ), I[0] & /*rows, $virtualizer*/
      17 && ke !== (ke = /*row*/
      (t[21]?.rdos ?? "—") + "") && ee(Pe, ke), I[0] & /*rows, $virtualizer*/
      17 && xe !== (xe = /*row*/
      (t[21]?.paid ?? "") + "") && ee(Ke, xe), I[0] & /*rows, $virtualizer, emitDay*/
      273) {
        Je = Z([0, 1, 2, 3, 4, 5, 6]);
        let v;
        for (v = 0; v < 7; v += 1) {
          const Q = St(t, Je, v);
          G[v] ? G[v].p(Q, I) : (G[v] = It(Q), G[v].c(), G[v].m(e, He));
        }
        for (; v < 7; v += 1)
          G[v].d(1);
      }
      I[0] & /*rows, $virtualizer*/
      17 && We !== (We = /*row*/
      (t[21]?.hours ?? "") + "") && ee(Xe, We), I[0] & /*$virtualizer*/
      16 && D(
        e,
        "top",
        /*virtualRow*/
        t[20].start + "px"
      ), I[0] & /*$virtualizer*/
      16 && D(
        e,
        "height",
        /*virtualRow*/
        t[20].size + "px"
      ), I[0] & /*rows, $virtualizer, teamOptions*/
      25 && Ve !== (Ve = /*row*/
      t[21]?.id) && p(e, "data-line-row", Ve);
    },
    d(S) {
      S && $(e), Ne(k, S), Ne(F, S), Ne(G, S), Ge = !1, ye(ft);
    }
  };
}
function Rn(t) {
  let e;
  function n(l, o) {
    return (
      /*mode*/
      l[1] === "svelte" ? zn : Mn
    );
  }
  let s = n(t), i = s(t);
  return {
    c() {
      e = y("div"), i.c(), p(e, "class", "lines-table-root svelte-vecfw4"), D(e, "min-height", "min(70vh, 720px)"), D(e, "height", "min(70vh, 720px)"), D(e, "width", "100%");
    },
    m(l, o) {
      te(l, e, o), i.m(e, null);
    },
    p(l, o) {
      s === (s = n(l)) && i ? i.p(l, o) : (i.d(1), i = s(l), i && (i.c(), i.m(e, null)));
    },
    i: B,
    o: B,
    d(l) {
      l && $(e), i.d();
    }
  };
}
let Ln = 42;
function Ct(t) {
  if (!t) return "";
  const e = t.name || t.id || "";
  return t.start && t.end ? (e ? e + " " : "") + "(" + t.start + "–" + t.end + ")" : t.start ? e ? e + " " + t.start : t.start : e;
}
function Mt(t) {
  const e = String(t || "").toUpperCase();
  return e === "RDO" || e === "—" ? "cell-toggle cell-rdo" : e === "BAG" ? "cell-toggle cell-function-duty cell-bag" : e === "PAX" ? "cell-toggle cell-function-duty cell-pax" : "cell-toggle cell-work";
}
function Dn(t, e, n) {
  let s, i = B, l = () => (i(), i = Lt(w, (b) => n(4, s = b)), w);
  t.$$.on_destroy.push(() => i());
  let { rows: o = [] } = e, { mode: r = "svelte" } = e, { shiftOptions: a = [] } = e, { teamOptions: c = [] } = e, { onInlineEdit: _ = null } = e, { onDayToggle: m = null } = e, O, w;
  qt(() => {
    r === "svelte" && l(n(6, w = Cn({
      count: o.length,
      getScrollElement: () => O,
      estimateSize: () => Ln,
      overscan: 5,
      getItemKey: (b) => o[b]?.id ?? b
    })));
  });
  function u(b, T, K) {
    _?.({ lineId: b, field: T, value: K });
  }
  function h(b, T) {
    m?.({ lineId: b, dayIndex: T });
  }
  const d = (b, T) => u(b?.id, "team", T.target.value), g = (b, T) => u(b?.id, "lineCode", T.target.value), E = (b, T) => u(b?.id, "shift", T.target.value), A = (b, T) => u(b?.id, "position", T.target.value), z = (b, T) => u(b?.id, "emp", T.target.value), C = (b, T) => u(b?.id, "sex", T.target.value), W = (b, T) => u(b?.id, "function", T.target.value), M = (b, T) => h(b?.id, T);
  function P(b) {
    Qe[b ? "unshift" : "push"](() => {
      O = b, n(5, O);
    });
  }
  return t.$$set = (b) => {
    "rows" in b && n(0, o = b.rows), "mode" in b && n(1, r = b.mode), "shiftOptions" in b && n(2, a = b.shiftOptions), "teamOptions" in b && n(3, c = b.teamOptions), "onInlineEdit" in b && n(9, _ = b.onInlineEdit), "onDayToggle" in b && n(10, m = b.onDayToggle);
  }, t.$$.update = () => {
    t.$$.dirty[0] & /*$virtualizer, mode, rows*/
    19 && s && r === "svelte" && s.setOptions({ count: o.length });
  }, [
    o,
    r,
    a,
    c,
    s,
    O,
    w,
    u,
    h,
    _,
    m,
    d,
    g,
    E,
    A,
    z,
    C,
    W,
    M,
    P
  ];
}
class kn extends rn {
  constructor(e) {
    super(), on(
      this,
      e,
      Dn,
      Rn,
      Rt,
      {
        rows: 0,
        mode: 1,
        shiftOptions: 2,
        teamOptions: 3,
        onInlineEdit: 9,
        onDayToggle: 10
      },
      null,
      [-1, -1]
    );
  }
}
function xn(t) {
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
  function s() {
    return {
      teamResolver: typeof e.teamMetaForLine == "function" ? e.teamMetaForLine : null,
      shiftResolver: typeof e.getShift == "function" ? e.getShift : null,
      rotationDutyResolver: typeof e.getRotationDuty == "function" ? e.getRotationDuty : i
    };
  }
  function i(u, h) {
    const d = String(u), g = e.state && e.state.functionRotation && e.state.functionRotation[d];
    if (!Array.isArray(g)) return null;
    const E = g[h];
    return E === "BAG" || E === "PAX" ? E : null;
  }
  function l(u, h, d) {
    var g = String(u);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[g] || (e.state.functionRotation[g] = []); e.state.functionRotation[g].length <= h; ) e.state.functionRotation[g].push(null);
    e.state.functionRotation[g][h] = d;
  }
  function o(u) {
    if (!u) return !1;
    if (u.function === "DFO") return !0;
    const h = u.functionEligible;
    return !!(h && (h.dfo === !0 || h.DFO === !0));
  }
  function r() {
    const u = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], h = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(u)) : u, d = e.state && e.state.schedule || {}, g = typeof e.getRowModels == "function" ? e.getRowModels(h, d, s()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(s()) : [];
    return Array.isArray(g) ? g : [];
  }
  function a() {
    return e.teams && Array.isArray(e.teams.teams) ? e.teams.teams : [];
  }
  function c() {
    return e.state && Array.isArray(e.state.shifts) ? e.state.shifts : [];
  }
  function _(u) {
    if (!u || typeof u.$set != "function") return;
    const h = r();
    u.$set({
      rows: Array.isArray(h) ? h : [],
      shiftOptions: c(),
      teamOptions: a()
    });
  }
  function m(u) {
    if (!u) return;
    const h = e.findLineById ? e.findLineById(u.lineId) : null;
    if (!h) return;
    const d = u.field, g = u.value;
    d === "lineCode" ? h.lineCode = String(g || "").trim() || h.lineCode : d === "sex" ? h.sex = g === "F" ? "F" : "M" : d === "function" ? h.function = g === "DFO" || g === "PAX" || g === "BAG" ? g : "" : d === "emp" || d === "position" ? e.applyLineEmp && e.applyLineEmp(h, g) : d === "shift" ? e.applyLineShift && e.applyLineShift(h, g) : d === "team" && e.setLineTeam && e.setLineTeam(u.lineId, g), e.updateStatus && e.updateStatus("Updated " + (h.lineCode || u.lineId)), w(), (d === "emp" || d === "position" || d === "shift") && e.renderCoverageBars && e.renderCoverageBars(), d === "team" && e.renderTeams && e.renderTeams();
  }
  function O(u) {
    if (!u) return;
    const h = e.findLineById ? e.findLineById(u.lineId) : null, d = Number(u.dayIndex);
    if (!h || !Number.isInteger(d) || d < 0 || d > 6) return;
    const g = h.id;
    e.state.schedule || (e.state.schedule = {}), e.state.schedule[g] || (e.state.schedule[g] = []), e.state.functionRotation || (e.state.functionRotation = {});
    const E = e.state.schedule[g][d] || "RDO", A = h.function === "BAG", z = o(h);
    if (E !== "WORK")
      e.state.schedule[g][d] = "WORK", A ? l(g, d, "BAG") : z ? l(g, d, "PAX") : l(g, d, null);
    else if (A)
      e.state.schedule[g][d] = "RDO", l(g, d, null);
    else if (z) {
      const C = (typeof e.getRotationDuty == "function" ? e.getRotationDuty(h.id, d) : i(h.id, d)) || "PAX";
      C === "PAX" || !C ? l(g, d, "BAG") : (e.state.schedule[g][d] = "RDO", l(g, d, null));
    } else
      e.state.schedule[g][d] = "RDO", l(g, d, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(h), w(), e.renderCoverageBars && e.renderCoverageBars();
  }
  const w = () => {
    try {
      const u = n._linesTableApp;
      if (u)
        _(u);
      else {
        n.childNodes.length && (n.innerHTML = "");
        const h = r();
        n._linesTableApp = new kn({
          target: n,
          props: {
            rows: Array.isArray(h) ? h : [],
            shiftOptions: c(),
            teamOptions: a(),
            onInlineEdit: m,
            onDayToggle: O
          }
        });
      }
    } catch (u) {
      console.error("lines-table: refresh failed", u);
    }
  };
  w(), document.addEventListener("click", (u) => {
    const h = u.target.closest?.(".tab-btn");
    h && h.dataset.tab === "lines" && w();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((u) => {
    window.addEventListener(u, w);
  }), n.refresh = w;
}
export {
  xn as initLinesTable
};
