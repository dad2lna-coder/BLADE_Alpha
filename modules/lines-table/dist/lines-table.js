var Bt = Object.defineProperty;
var Pt = (e, t, n) => t in e ? Bt(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Xe = (e, t, n) => Pt(e, typeof t != "symbol" ? t + "" : t, n);
function P() {
}
function Mt(e) {
  return e();
}
function ft() {
  return /* @__PURE__ */ Object.create(null);
}
function Oe(e) {
  e.forEach(Mt);
}
function et(e) {
  return typeof e == "function";
}
function zt(e, t) {
  return e != e ? t == t : e !== t || e && typeof e == "object" || typeof e == "function";
}
function Kt(e) {
  return Object.keys(e).length === 0;
}
function Ht(e, ...t) {
  if (e == null) {
    for (const s of t)
      s(void 0);
    return P;
  }
  const n = e.subscribe(...t);
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
function mt(e) {
  return e ?? "";
}
function f(e, t) {
  e.appendChild(t);
}
function te(e, t, n) {
  e.insertBefore(t, n || null);
}
function ee(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function Ne(e, t) {
  for (let n = 0; n < e.length; n += 1)
    e[n] && e[n].d(t);
}
function b(e) {
  return document.createElement(e);
}
function X(e) {
  return document.createTextNode(e);
}
function k() {
  return X(" ");
}
function Y(e, t, n, s) {
  return e.addEventListener(t, n, s), () => e.removeEventListener(t, n, s);
}
function p(e, t, n) {
  n == null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Jt(e) {
  return Array.from(e.childNodes);
}
function $(e, t) {
  t = "" + t, e.data !== t && (e.data = /** @type {string} */
  t);
}
function M(e, t) {
  e.value = t ?? "";
}
function D(e, t, n, s) {
  n == null ? e.style.removeProperty(t) : e.style.setProperty(t, n, "");
}
function B(e, t, n) {
  for (let s = 0; s < e.options.length; s += 1) {
    const i = e.options[s];
    if (i.__value === t) {
      i.selected = !0;
      return;
    }
  }
  e.selectedIndex = -1;
}
let Ie;
function we(e) {
  Ie = e;
}
function Ut() {
  if (!Ie) throw new Error("Function called outside component initialization");
  return Ie;
}
function qt(e) {
  Ut().$$.on_mount.push(e);
}
const be = [], Ye = [];
let Ee = [];
const gt = [], Xt = /* @__PURE__ */ Promise.resolve();
let Ze = !1;
function Gt() {
  Ze || (Ze = !0, Xt.then(Lt));
}
function $e(e) {
  Ee.push(e);
}
const Ge = /* @__PURE__ */ new Set();
let pe = 0;
function Lt() {
  if (pe !== 0)
    return;
  const e = Ie;
  do {
    try {
      for (; pe < be.length; ) {
        const t = be[pe];
        pe++, we(t), Qt(t.$$);
      }
    } catch (t) {
      throw be.length = 0, pe = 0, t;
    }
    for (we(null), be.length = 0, pe = 0; Ye.length; ) Ye.pop()();
    for (let t = 0; t < Ee.length; t += 1) {
      const n = Ee[t];
      Ge.has(n) || (Ge.add(n), n());
    }
    Ee.length = 0;
  } while (be.length);
  for (; gt.length; )
    gt.pop()();
  Ze = !1, Ge.clear(), we(e);
}
function Qt(e) {
  if (e.fragment !== null) {
    e.update(), Oe(e.before_update);
    const t = e.dirty;
    e.dirty = [-1], e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach($e);
  }
}
function Yt(e) {
  const t = [], n = [];
  Ee.forEach((s) => e.indexOf(s) === -1 ? t.push(s) : n.push(s)), n.forEach((s) => s()), Ee = t;
}
const Zt = /* @__PURE__ */ new Set();
function $t(e, t) {
  e && e.i && (Zt.delete(e), e.i(t));
}
function Z(e) {
  return e?.length !== void 0 ? e : Array.from(e);
}
function en(e, t, n) {
  const { fragment: s, after_update: i } = e.$$;
  s && s.m(t, n), $e(() => {
    const l = e.$$.on_mount.map(Mt).filter(et);
    e.$$.on_destroy ? e.$$.on_destroy.push(...l) : Oe(l), e.$$.on_mount = [];
  }), i.forEach($e);
}
function tn(e, t) {
  const n = e.$$;
  n.fragment !== null && (Yt(n.after_update), Oe(n.on_destroy), n.fragment && n.fragment.d(t), n.on_destroy = n.fragment = null, n.ctx = []);
}
function nn(e, t) {
  e.$$.dirty[0] === -1 && (be.push(e), Gt(), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function sn(e, t, n, s, i, l, o = null, r = [-1]) {
  const a = Ie;
  we(e);
  const c = e.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: l,
    update: P,
    not_equal: i,
    bound: ft(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || (a ? a.$$.context : [])),
    // everything else
    callbacks: ft(),
    dirty: r,
    skip_bound: !1,
    root: t.target || a.$$.root
  };
  o && o(c.root);
  let h = !1;
  if (c.ctx = n ? n(e, t.props || {}, (u, d, ...m) => {
    const g = m.length ? m[0] : d;
    return c.ctx && i(c.ctx[u], c.ctx[u] = g) && (!c.skip_bound && c.bound[u] && c.bound[u](g), h && nn(e, u)), d;
  }) : [], c.update(), h = !0, Oe(c.before_update), c.fragment = s ? s(c.ctx) : !1, t.target) {
    if (t.hydrate) {
      const u = Jt(t.target);
      c.fragment && c.fragment.l(u), u.forEach(ee);
    } else
      c.fragment && c.fragment.c();
    t.intro && $t(e.$$.fragment), en(e, t.target, t.anchor), Lt();
  }
  we(a);
}
class ln {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Xe(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    Xe(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    tn(this, 1), this.$destroy = P;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(t, n) {
    if (!et(n))
      return P;
    const s = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return s.push(n), () => {
      const i = s.indexOf(n);
      i !== -1 && s.splice(i, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(t) {
    this.$$set && !Kt(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
}
const on = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(on);
function rn(e) {
  return typeof e == "object" ? e.key : e;
}
function an(e, t) {
  const n = e.length;
  return new Proxy(e, {
    get(s, i, l) {
      if (typeof i == "string") {
        const o = i.charCodeAt(0);
        if (o >= 48 && o <= 57) {
          const r = +i;
          if (Number.isInteger(r) && r >= 0 && r < n) {
            let a = s[r];
            if (typeof a != "object") {
              const c = t[r * 2];
              a = s[r] = {
                index: r,
                key: a,
                start: c,
                size: t[r * 2 + 1],
                end: c + t[r * 2 + 1],
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
function ve(e, t, n) {
  let s = n.initialDeps ?? [], i, l = !0;
  function o() {
    var r;
    const a = process.env.NODE_ENV !== "production" && !!n.key && !!((r = n.debug) != null && r.call(n));
    let c = 0;
    a && (c = Date.now());
    const h = e();
    if (!(h.length !== s.length || h.some((m, g) => s[g] !== m)))
      return i;
    s = h;
    let d = 0;
    if (a && (d = Date.now()), i = t(...h), a) {
      const m = Math.round((Date.now() - c) * 100) / 100, g = Math.round((Date.now() - d) * 100) / 100, y = g / 16, T = (C, O) => {
        for (C = String(C); C.length < O; )
          C = " " + C;
        return C;
      };
      console.info(
        `%c⏱ ${T(g, 5)} /${T(m, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * y, 120)
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
function _t(e, t) {
  if (e === void 0)
    throw new Error("Unexpected undefined");
  return e;
}
const pt = (e, t) => Math.abs(e - t) < 1.01, cn = (e, t, n) => {
  let s;
  return Object.assign(
    function(...i) {
      e.clearTimeout(s), s = e.setTimeout(() => t.apply(this, i), n);
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
let ye;
const Qe = () => {
  if (ye !== void 0) return ye;
  if (typeof navigator > "u") return ye = !1;
  if (/iP(hone|od|ad)/.test(navigator.userAgent)) return ye = !0;
  const e = navigator.maxTouchPoints;
  return ye = navigator.platform === "MacIntel" && e !== void 0 && e > 0;
}, vt = (e) => {
  const { offsetWidth: t, offsetHeight: n } = e;
  return { width: t, height: n };
}, un = (e) => e, hn = (e) => {
  const t = Math.max(e.startIndex - e.overscan, 0), s = Math.min(e.endIndex + e.overscan, e.count - 1) - t + 1, i = new Array(s);
  for (let l = 0; l < s; l++)
    i[l] = t + l;
  return i;
}, dn = (e, t) => {
  const n = e.scrollElement;
  if (!n)
    return;
  const s = e.targetWindow;
  if (!s)
    return;
  const i = (o) => {
    const { width: r, height: a } = o;
    t({ width: Math.round(r), height: Math.round(a) });
  };
  if (i(vt(n)), !s.ResizeObserver)
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
      i(vt(n));
    };
    e.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(r) : r();
  });
  return l.observe(n, { box: "border-box" }), () => {
    l.unobserve(n);
  };
}, Be = {
  passive: !0
}, fn = typeof window > "u" ? !0 : "onscrollend" in window, mn = (e, t, n) => {
  const s = e.scrollElement;
  if (!s)
    return;
  const i = e.targetWindow;
  if (!i)
    return;
  const l = e.options.useScrollendEvent && fn;
  let o = 0;
  const r = l ? null : cn(
    i,
    () => t(n(s), !1),
    e.options.isScrollingResetDelay
  ), a = (u) => () => {
    o = n(s), r?.(), t(o, u);
  }, c = a(!0), h = a(!1);
  return s.addEventListener("scroll", c, Be), l && s.addEventListener("scrollend", h, Be), () => {
    s.removeEventListener("scroll", c), l && s.removeEventListener("scrollend", h), r?.cancel();
  };
}, gn = (e, t) => mn(e, t, (n) => {
  const { horizontal: s, isRtl: i } = e.options;
  return s ? n.scrollLeft * (i && -1 || 1) : n.scrollTop;
}), _n = (e, t, n) => {
  if (n.options.useCachedMeasurements) {
    const s = n.indexFromElement(e), i = n.options.getItemKey(s);
    return n.itemSizeCache.get(i) ?? n.options.estimateSize(s);
  }
  if (t?.borderBoxSize) {
    const s = t.borderBoxSize[0];
    if (s)
      return Math.round(
        s[n.options.horizontal ? "inlineSize" : "blockSize"]
      );
  }
  if (!t) {
    const s = n.indexFromElement(e), i = n.options.getItemKey(s), l = n.itemSizeCache.get(i);
    if (l !== void 0)
      return l;
  }
  return e[n.options.horizontal ? "offsetWidth" : "offsetHeight"];
}, pn = (e, {
  adjustments: t = 0,
  behavior: n
}, s) => {
  var i, l;
  (l = (i = s.scrollElement) == null ? void 0 : i.scrollTo) == null || l.call(i, {
    [s.options.horizontal ? "left" : "top"]: e + t,
    behavior: n
  });
}, vn = pn;
function Sn(e, t, n, s) {
  if (t === 0) return !1;
  const i = s(0), l = /* @__PURE__ */ new Set();
  let o = 0;
  for (; o < e; ) {
    const a = n(o);
    if (a === i) break;
    l.add(a), o++;
  }
  const r = e - o;
  if (r === 0 || r >= t) return !1;
  for (let a = 0; a < r; a++)
    if (s(a) !== n(o + a)) return !1;
  for (let a = r; a < t; a++)
    if (l.has(s(a))) return !1;
  return !0;
}
class bn {
  constructor(t) {
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
              for (const [c, h] of this.elementsCache)
                if (h === r) {
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
        getItemKey: un,
        rangeExtractor: hn,
        onChange: () => {
        },
        measureElement: _n,
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
      for (const u in n) {
        const d = n[u];
        d !== void 0 && (i[u] = d);
      }
      const l = this.options;
      let o = null, r = null, a = !1;
      if (l !== void 0 && l.enabled && i.enabled && i.anchorTo === "end" && this.scrollElement !== null) {
        const u = l.count, d = i.count, m = this.getMeasurements(), g = ((s = this._singleLaneMeasurements) == null ? void 0 : s.items) ?? m, y = (L) => rn(g[L]), T = u > 0 ? y(0) : null, C = u > 0 ? y(u - 1) : null;
        if (d !== u || u > 0 && d > 0 && (i.getItemKey(0) !== T || i.getItemKey(d - 1) !== C)) {
          a = !0;
          const L = u > 0 ? this.getVirtualItemForOffset(this.getScrollOffset()) ?? m[0] : null;
          L && (o = [L.key, this.getScrollOffset() - L.start]);
          const A = i.followOnAppend === !0 ? "auto" : i.followOnAppend || null;
          A && d > 0 && this.isAtEnd(l.scrollEndThreshold) && (u === 0 || i.getItemKey(d - 1) !== C) && (d > u || Sn(
            u,
            d,
            y,
            i.getItemKey
          )) && (r = A);
        }
      }
      this.options = i, a && (this.pendingMin = 0, this.itemSizeCacheVersion++);
      let c = !1, h = 0;
      if (o && this.scrollOffset !== null) {
        const [u, d] = o, m = this.getMeasurements(), { count: g, getItemKey: y } = this.options;
        let T = 0;
        for (; T < g && y(T) !== u; )
          T++;
        if (T < g) {
          const C = m[T];
          if (C) {
            const O = Math.max(0, C.start + d);
            !r && O !== this.scrollOffset && (h = O - this.scrollOffset, this.scrollOffset = O, c = !0);
          }
        }
      }
      (c || r) && (this.pendingScrollAnchor = [
        c ? o[0] : null,
        c ? o[1] : 0,
        r,
        h
      ]);
    }, this.notify = (n) => {
      var s, i;
      (i = (s = this.options).onChange) == null || i.call(s, this, n);
    }, this.maybeNotify = ve(
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
            this._iosTouching = !1, !(!Qe() || this.targetWindow == null) && (this._iosJustTouchEnded = !0, this._iosTouchEndTimerId = this.targetWindow.setTimeout(() => {
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
        o !== null && !a && (Qe() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded) ? c !== 0 && (this._iosDeferredAdjustment += c) : ((s = this.scrollState) == null ? void 0 : s.behavior) === "smooth" && !pt(
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
    }, this.rafId = null, this.getSize = () => this.options.enabled ? (this.scrollRect = this.scrollRect ?? this.options.initialRect, this.scrollRect[this.options.horizontal ? "width" : "height"]) : (this.scrollRect = null, 0), this.getScrollOffset = () => this.options.enabled ? (this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset), this.scrollOffset) : (this.scrollOffset = null, 0), this.getMeasurementOptions = ve(
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
    ), this.isIndexInRange = (n) => n >= 0 && n < this.options.count, this.getMeasurements = ve(
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
      }, h) => {
        var u;
        const d = this.itemSizeCache;
        if (!o)
          return this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), [];
        if (this.laneAssignments.size > n)
          for (const O of this.laneAssignments.keys())
            O >= n && this.laneAssignments.delete(O);
        this.lanesChangedFlag && (this.lanesChangedFlag = !1, this.lanesSettling = !0, this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), this.pendingMin = null), this.measurementsCache.length === 0 && !this.lanesSettling && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((O) => {
          this.itemSizeCache.set(O.key, O.size);
        }));
        const m = this.lanesSettling ? 0 : this.pendingMin ?? 0;
        if (this.pendingMin = null, this.lanesSettling && this.measurementsCache.length === n && (this.lanesSettling = !1), r === 1) {
          const O = n * 2;
          let w = (u = this._singleLaneMeasurements) == null ? void 0 : u.flat;
          if (!w || w.length < O) {
            const E = new Float64Array(O);
            w && m > 0 && E.set(w.subarray(0, m * 2)), w = E;
          }
          const L = m === 0 ? new Array(n) : this._singleLaneMeasurements.items.slice();
          let A;
          if (m === 0)
            A = s + i;
          else {
            const E = m - 1;
            A = w[E * 2] + w[E * 2 + 1] + c;
          }
          for (let E = m; E < n; E++) {
            const V = l(E);
            L[E] = V;
            const U = d.get(V), G = typeof U == "number" ? U : this.options.estimateSize(E);
            w[E * 2] = A, w[E * 2 + 1] = G, A += G + c;
          }
          this._singleLaneMeasurements = { flat: w, items: L };
          const v = an(L, w);
          return this.measurementsCache = v, v;
        }
        const g = this.measurementsCache.slice(0, m), y = new Array(r).fill(
          void 0
        ), T = new Float64Array(r);
        let C = 0;
        for (let O = 0; O < m; O++) {
          const w = g[O];
          w && (y[w.lane] === void 0 && C++, y[w.lane] = O, T[w.lane] = w.end);
        }
        for (let O = m; O < n; O++) {
          const w = l(O), L = this.laneAssignments.get(O);
          let A, v;
          const E = a === "estimate" || d.has(w);
          if (L !== void 0 && this.options.lanes > 1) {
            A = L;
            const H = y[A], z = H !== void 0 ? g[H] : void 0;
            v = z ? z.end + c : s + i;
          } else if (C === r) {
            let H = 0, z = T[0], q = y[0];
            for (let j = 1; j < r; j++) {
              const J = T[j];
              (J < z || J === z && y[j] < q) && (H = j, z = J, q = y[j]);
            }
            A = H, v = z + c, E && this.laneAssignments.set(O, A);
          } else
            A = O % this.options.lanes, v = s + i, E && this.laneAssignments.set(O, A);
          const V = d.get(w), U = typeof V == "number" ? V : this.options.estimateSize(O), G = v + U;
          g[O] = {
            index: O,
            start: v,
            size: U,
            end: G,
            key: w,
            lane: A
          }, y[A] === void 0 && C++, y[A] = O, T[A] = G;
        }
        return this.measurementsCache = g, g;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getMeasurements",
        debug: () => this.options.debug
      }
    ), this.calculateRange = ve(
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
    ), this.getVirtualIndexes = ve(
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
      const h = (i = this._singleLaneMeasurements) == null ? void 0 : i.flat;
      if (this.options.lanes === 1 && h != null)
        c = this.options.getItemKey(n), a = h[n * 2], r = h[n * 2 + 1];
      else {
        const m = this.measurementsCache[n];
        if (!m) return;
        c = m.key, a = m.start, r = m.size;
      }
      const u = this.itemSizeCache.get(c) ?? r, d = s - u;
      if (d !== 0) {
        const m = this.options.anchorTo === "end" && ((l = this.scrollState) == null ? void 0 : l.behavior) !== "smooth" && this.getVirtualDistanceFromEnd() <= this.options.scrollEndThreshold, g = m ? this.getTotalSize() : 0, y = this.getScrollOffset() + this.scrollAdjustments, C = !this.itemSizeCache.has(c) ? (
          // First measurement: compensate any item whose top sits above the
          // fold — the estimate→actual delta must be corrected regardless of
          // scroll direction, since the whole estimated block was above it.
          a < y
        ) : (
          // Re-measurement: only compensate an item that is ENTIRELY above the
          // fold. An item that merely *spans* the fold (top above, bottom
          // below — e.g. a streaming chat message growing at its bottom)
          // changes size *below* the anchor point, so shifting scrollTop by the
          // delta would drag the viewport downward on every growth (#1218).
          // Also skip during backward scroll to avoid the "items jump while
          // scrolling up" cascade.
          a + u <= y && this.scrollDirection !== "backward"
        ), O = ((o = this.scrollState) == null ? void 0 : o.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(
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
          d,
          this
        ) : C);
        (this.pendingMin === null || n < this.pendingMin) && (this.pendingMin = n), this.itemSizeCache.set(c, s), this.itemSizeCacheVersion++;
        let w = !1;
        m ? w = this.applyScrollAdjustment(
          this.getTotalSize() - g
        ) : O && (w = this.applyScrollAdjustment(d)), this.notify(w), this._retryClampedAdjustment();
      }
    }, this.getVirtualItems = ve(
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
      const l = (s = this._singleLaneMeasurements) == null ? void 0 : s.flat, o = this.options.lanes === 1 && l != null, r = Dt(
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
    }, this.setOptions(t);
  }
  // Returns `true` when it performed a synchronous `scrollTop` write this
  // tick, `false` when the delta was zero or the write was deferred (iOS).
  // `resizeItem` uses that to decide whether the follow-up `notify` must be
  // synchronous so the grown transforms commit in the same paint (#1227).
  applyScrollAdjustment(t, n) {
    if (t === 0) return !1;
    if (process.env.NODE_ENV !== "production" && this.options.debug && console.info("correction", t), Qe() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded))
      return this._iosDeferredAdjustment += t, !1;
    {
      const s = this.getScrollOffset() + this.scrollAdjustments + t, i = this.scrollElement, l = i !== null && ("scrollHeight" in i || "document" in i) ? this.getMaxScrollOffset() : null;
      return this._clampedAdjustment = l !== null && s > l + 0.5 ? { target: s, maxAtWrite: l } : null, this._scrollToOffset(this.getScrollOffset(), {
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
    const s = this.scrollState.index != null ? this.getOffsetForIndex(this.scrollState.index, this.scrollState.align) : void 0, i = s ? s[0] : this.scrollState.lastTargetOffset, l = 1, o = i !== this.scrollState.lastTargetOffset;
    if (!o && pt(i, this.getScrollOffset())) {
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
const Dt = (e, t, n, s) => {
  for (; e <= t; ) {
    const i = (e + t) / 2 | 0, l = n(i);
    if (l < s)
      e = i + 1;
    else if (l > s)
      t = i - 1;
    else
      return i;
  }
  return e > 0 ? e - 1 : 0;
};
function En(e, t, n) {
  let s = 0;
  for (; s <= t; ) {
    const i = (s + t) / 2 | 0, l = e[i * 2];
    if (l < n)
      s = i + 1;
    else if (l > n)
      t = i - 1;
    else
      return i;
  }
  return s > 0 ? s - 1 : 0;
}
function On(e, t, n, s, i) {
  const l = e.length - 1;
  if (e.length <= s)
    return { startIndex: 0, endIndex: l };
  if (s === 1 && i !== null) {
    const c = En(
      i,
      l,
      n
    );
    let h = c;
    const u = n + t;
    for (; h < l && i[h * 2] + i[h * 2 + 1] < u; )
      h++;
    return { startIndex: c, endIndex: h };
  }
  let r = Dt(0, l, (c) => e[c].start, n), a = r;
  if (s === 1)
    for (; a < l && e[a].end < n + t; )
      a++;
  else if (s > 1) {
    const c = Array(s).fill(0);
    for (; a < l && c.some((u) => u < n + t); ) {
      const u = e[a];
      c[u.lane] = u.end, a++;
    }
    const h = Array(s).fill(n + t);
    for (; r >= 0 && h.some((u) => u >= n); ) {
      const u = e[r];
      h[u.lane] = u.start, r--;
    }
    r = Math.max(0, r - r % s), a = Math.min(l, a + (s - 1 - a % s));
  }
  return { startIndex: r, endIndex: a };
}
const Se = [];
function yn(e, t) {
  return {
    subscribe: Ft(e, t).subscribe
  };
}
function Ft(e, t = P) {
  let n;
  const s = /* @__PURE__ */ new Set();
  function i(r) {
    if (zt(e, r) && (e = r, n)) {
      const a = !Se.length;
      for (const c of s)
        c[1](), Se.push(c, e);
      if (a) {
        for (let c = 0; c < Se.length; c += 2)
          Se[c][0](Se[c + 1]);
        Se.length = 0;
      }
    }
  }
  function l(r) {
    i(r(e));
  }
  function o(r, a = P) {
    const c = [r, a];
    return s.add(c), s.size === 1 && (n = t(i, l) || P), r(e), () => {
      s.delete(c), s.size === 0 && n && (n(), n = null);
    };
  }
  return { set: i, update: l, subscribe: o };
}
function wn(e, t, n) {
  const s = !Array.isArray(e), i = s ? [e] : e;
  if (!i.every(Boolean))
    throw new Error("derived() expects stores as input, got a falsy value");
  const l = t.length < 2;
  return yn(n, (o, r) => {
    let a = !1;
    const c = [];
    let h = 0, u = P;
    const d = () => {
      if (h)
        return;
      u();
      const g = t(s ? c[0] : c, o, r);
      l ? o(g) : u = et(g) ? g : P;
    }, m = i.map(
      (g, y) => Ht(
        g,
        (T) => {
          c[y] = T, h &= ~(1 << y), a && d();
        },
        () => {
          h |= 1 << y;
        }
      )
    );
    return a = !0, d(), function() {
      Oe(m), u(), a = !1;
    };
  });
}
function In(e) {
  const t = new bn(e), n = t.setOptions;
  let s;
  const i = (l) => {
    const o = {
      ...t.options,
      ...l,
      onChange: l.onChange
    };
    n({
      ...o,
      onChange: (r, a) => {
        s.set(r), o.onChange?.(r, a);
      }
    }), t._willUpdate(), s.set(t);
  };
  return s = Ft(t, () => (i(e), t._didMount())), wn(s, (l) => Object.assign(l, { setOptions: i }));
}
function Tn(e) {
  return In({
    observeElementRect: dn,
    observeElementOffset: gn,
    scrollToFn: vn,
    ...e
  });
}
function St(e, t, n) {
  const s = e.slice();
  s[19] = t[n];
  const i = (
    /*rows*/
    s[0][
      /*virtualRow*/
      s[19].index
    ]
  );
  return s[20] = i, s;
}
function bt(e, t, n) {
  const s = e.slice();
  return s[23] = t[n], s;
}
function Et(e, t, n) {
  const s = e.slice();
  return s[26] = t[n], s;
}
function Ot(e, t, n) {
  const s = e.slice();
  return s[29] = t[n], s;
}
function An(e) {
  let t;
  return {
    c() {
      t = b("div"), t.textContent = "Classic Lines mode active", p(t, "class", "muted");
    },
    m(n, s) {
      te(n, t, s);
    },
    p: P,
    d(n) {
      n && ee(t);
    }
  };
}
function Cn(e) {
  let t, n, s, i, l, o, r, a = Z(
    /*virtualizer*/
    e[4]?.getVirtualItems() ?? []
  ), c = [];
  for (let h = 0; h < a.length; h += 1)
    c[h] = Tt(St(e, a, h));
  return {
    c() {
      t = b("div"), n = b("table"), s = b("thead"), s.innerHTML = '<tr><th class="svelte-t914cf">Team</th> <th class="svelte-t914cf">Line</th> <th class="svelte-t914cf">Shift</th> <th class="svelte-t914cf">Start</th> <th class="svelte-t914cf">End</th> <th class="svelte-t914cf">Position</th> <th class="svelte-t914cf">Emp</th> <th class="svelte-t914cf">Sex</th> <th class="svelte-t914cf">Function</th> <th class="svelte-t914cf">RDOs</th> <th class="svelte-t914cf">Paid</th> <th class="svelte-t914cf">Sun</th> <th class="svelte-t914cf">Mon</th> <th class="svelte-t914cf">Tue</th> <th class="svelte-t914cf">Wed</th> <th class="svelte-t914cf">Thu</th> <th class="svelte-t914cf">Fri</th> <th class="svelte-t914cf">Sat</th> <th class="svelte-t914cf">Hours</th></tr>', i = k(), l = b("tbody");
      for (let h = 0; h < c.length; h += 1)
        c[h].c();
      o = k(), r = b("div"), D(l, "position", "relative"), D(l, "height", "0"), D(
        r,
        "height",
        /*virtualizer*/
        (e[4]?.getTotalSize() ?? 0) + "px"
      ), p(n, "class", "data-table lines-editable svelte-t914cf"), D(n, "width", "max-content"), D(n, "min-width", "1100px"), p(t, "class", "lines-virtual-root svelte-t914cf"), D(t, "height", "100%"), D(t, "overflow", "auto"), D(t, "position", "relative");
    },
    m(h, u) {
      te(h, t, u), f(t, n), f(n, s), f(n, i), f(n, l);
      for (let d = 0; d < c.length; d += 1)
        c[d] && c[d].m(l, null);
      f(n, o), f(n, r), e[18](t);
    },
    p(h, u) {
      if (u[0] & /*virtualizer, rows, emitDay, emitEdit, shiftOptions, teamOptions*/
      221) {
        a = Z(
          /*virtualizer*/
          h[4]?.getVirtualItems() ?? []
        );
        let d;
        for (d = 0; d < a.length; d += 1) {
          const m = St(h, a, d);
          c[d] ? c[d].p(m, u) : (c[d] = Tt(m), c[d].c(), c[d].m(l, null));
        }
        for (; d < c.length; d += 1)
          c[d].d(1);
        c.length = a.length;
      }
      u[0] & /*virtualizer*/
      16 && D(
        r,
        "height",
        /*virtualizer*/
        (h[4]?.getTotalSize() ?? 0) + "px"
      );
    },
    d(h) {
      h && ee(t), Ne(c, h), e[18](null);
    }
  };
}
function yt(e) {
  let t, n = (
    /*team*/
    (e[29].name ?? /*team*/
    e[29].id) + ""
  ), s, i;
  return {
    c() {
      t = b("option"), s = X(n), t.__value = i = /*team*/
      e[29].id, M(t, t.__value);
    },
    m(l, o) {
      te(l, t, o), f(t, s);
    },
    p(l, o) {
      o[0] & /*teamOptions*/
      8 && n !== (n = /*team*/
      (l[29].name ?? /*team*/
      l[29].id) + "") && $(s, n), o[0] & /*teamOptions*/
      8 && i !== (i = /*team*/
      l[29].id) && (t.__value = i, M(t, t.__value));
    },
    d(l) {
      l && ee(t);
    }
  };
}
function wt(e) {
  let t, n = At(
    /*shift*/
    e[26]
  ) + "", s, i;
  return {
    c() {
      t = b("option"), s = X(n), t.__value = i = /*shift*/
      e[26].id, M(t, t.__value);
    },
    m(l, o) {
      te(l, t, o), f(t, s);
    },
    p(l, o) {
      o[0] & /*shiftOptions*/
      4 && n !== (n = At(
        /*shift*/
        l[26]
      ) + "") && $(s, n), o[0] & /*shiftOptions*/
      4 && i !== (i = /*shift*/
      l[26].id) && (t.__value = i, M(t, t.__value));
    },
    d(l) {
      l && ee(t);
    }
  };
}
function It(e) {
  let t, n = (
    /*row*/
    (e[20]?.days?.[
      /*i*/
      e[23]
    ] ?? "") + ""
  ), s, i, l, o, r;
  function a() {
    return (
      /*click_handler*/
      e[17](
        /*row*/
        e[20],
        /*i*/
        e[23]
      )
    );
  }
  return {
    c() {
      t = b("td"), s = X(n), p(t, "class", i = mt(Ct(
        /*row*/
        e[20]?.days?.[
          /*i*/
          e[23]
        ],
        /*row*/
        e[20]?.function
      )) + " svelte-t914cf"), p(t, "data-line-id", l = /*row*/
      e[20]?.id), p(
        t,
        "data-day-index",
        /*i*/
        e[23]
      );
    },
    m(c, h) {
      te(c, t, h), f(t, s), o || (r = Y(t, "click", a), o = !0);
    },
    p(c, h) {
      e = c, h[0] & /*rows, virtualizer*/
      17 && n !== (n = /*row*/
      (e[20]?.days?.[
        /*i*/
        e[23]
      ] ?? "") + "") && $(s, n), h[0] & /*rows, virtualizer, teamOptions*/
      25 && i !== (i = mt(Ct(
        /*row*/
        e[20]?.days?.[
          /*i*/
          e[23]
        ],
        /*row*/
        e[20]?.function
      )) + " svelte-t914cf") && p(t, "class", i), h[0] & /*rows, virtualizer, teamOptions*/
      25 && l !== (l = /*row*/
      e[20]?.id) && p(t, "data-line-id", l);
    },
    d(c) {
      c && ee(t), o = !1, r();
    }
  };
}
function Tt(e) {
  let t, n, s, i, l, o, r, a, c, h, u, d, m, g, y, T, C, O, w, L = (
    /*row*/
    (e[20]?.start ?? "") + ""
  ), A, v, E, V = (
    /*row*/
    (e[20]?.end ?? "") + ""
  ), U, G, H, z, q, j, J, ne, Te, tt, nt, Ae, x, se, ie, le, oe, re, Ce, st, it, Me, N, ae, ce, ue, ze, lt, ot, Le, W, he, de, fe, me, De, rt, at, Fe, Re = (
    /*row*/
    (e[20]?.rdos ?? "—") + ""
  ), Pe, ct, ke, xe = (
    /*row*/
    (e[20]?.paid ?? "") + ""
  ), Ke, ut, He, je, We = (
    /*row*/
    (e[20]?.hours ?? "") + ""
  ), Je, ht, Ve, Ue, dt, ge = Z(
    /*teamOptions*/
    e[3]
  ), F = [];
  for (let S = 0; S < ge.length; S += 1)
    F[S] = yt(Ot(e, ge, S));
  function Rt(...S) {
    return (
      /*change_handler*/
      e[10](
        /*row*/
        e[20],
        ...S
      )
    );
  }
  function kt(...S) {
    return (
      /*input_handler*/
      e[11](
        /*row*/
        e[20],
        ...S
      )
    );
  }
  let _e = Z(
    /*shiftOptions*/
    e[2]
  ), R = [];
  for (let S = 0; S < _e.length; S += 1)
    R[S] = wt(Et(e, _e, S));
  function xt(...S) {
    return (
      /*change_handler_1*/
      e[12](
        /*row*/
        e[20],
        ...S
      )
    );
  }
  function jt(...S) {
    return (
      /*change_handler_2*/
      e[13](
        /*row*/
        e[20],
        ...S
      )
    );
  }
  function Wt(...S) {
    return (
      /*change_handler_3*/
      e[14](
        /*row*/
        e[20],
        ...S
      )
    );
  }
  function Vt(...S) {
    return (
      /*change_handler_4*/
      e[15](
        /*row*/
        e[20],
        ...S
      )
    );
  }
  function Nt(...S) {
    return (
      /*change_handler_5*/
      e[16](
        /*row*/
        e[20],
        ...S
      )
    );
  }
  let qe = Z([0, 1, 2, 3, 4, 5, 6]), K = [];
  for (let S = 0; S < 7; S += 1)
    K[S] = It(bt(e, qe, S));
  return {
    c() {
      t = b("tr"), n = b("td"), s = b("select"), i = b("option"), i.textContent = "—";
      for (let S = 0; S < F.length; S += 1)
        F[S].c();
      r = k(), a = b("td"), c = b("input"), d = k(), m = b("td"), g = b("select"), y = b("option"), y.textContent = "—";
      for (let S = 0; S < R.length; S += 1)
        R[S].c();
      O = k(), w = b("td"), A = X(L), v = k(), E = b("td"), U = X(V), G = k(), H = b("td"), z = b("select"), q = b("option"), q.textContent = "—", j = b("option"), j.textContent = "TSO", J = b("option"), J.textContent = "LTSO", ne = b("option"), ne.textContent = "STSO", nt = k(), Ae = b("td"), x = b("select"), se = b("option"), se.textContent = "—", ie = b("option"), ie.textContent = "FT", le = b("option"), le.textContent = "PT", oe = b("option"), oe.textContent = "LTSO", re = b("option"), re.textContent = "STSO", it = k(), Me = b("td"), N = b("select"), ae = b("option"), ae.textContent = "—", ce = b("option"), ce.textContent = "M", ue = b("option"), ue.textContent = "F", ot = k(), Le = b("td"), W = b("select"), he = b("option"), he.textContent = "—", de = b("option"), de.textContent = "DFO", fe = b("option"), fe.textContent = "BAG", me = b("option"), me.textContent = "PAX", at = k(), Fe = b("td"), Pe = X(Re), ct = k(), ke = b("td"), Ke = X(xe), ut = k();
      for (let S = 0; S < 7; S += 1)
        K[S].c();
      He = k(), je = b("td"), Je = X(We), ht = k(), i.__value = "", M(i, i.__value), p(s, "class", "line-edit svelte-t914cf"), p(s, "data-field", "team"), p(s, "data-line-id", l = /*row*/
      e[20]?.id), p(n, "class", "svelte-t914cf"), p(c, "type", "text"), p(c, "class", "line-edit line-code-input svelte-t914cf"), p(c, "data-field", "lineCode"), p(c, "data-line-id", h = /*row*/
      e[20]?.id), c.value = u = /*row*/
      e[20]?.line ?? "", p(a, "class", "svelte-t914cf"), y.__value = "", M(y, y.__value), p(g, "class", "line-edit svelte-t914cf"), p(g, "data-field", "shift"), p(g, "data-line-id", T = /*row*/
      e[20]?.id), p(m, "class", "svelte-t914cf"), p(w, "class", "svelte-t914cf"), p(E, "class", "svelte-t914cf"), q.__value = "", M(q, q.__value), j.__value = "TSO", M(j, j.__value), J.__value = "LTSO", M(J, J.__value), ne.__value = "STSO", M(ne, ne.__value), p(z, "class", "line-edit svelte-t914cf"), p(z, "data-field", "position"), p(z, "data-line-id", Te = /*row*/
      e[20]?.id), p(H, "class", "svelte-t914cf"), se.__value = "", M(se, se.__value), ie.__value = "FT", M(ie, ie.__value), le.__value = "PT", M(le, le.__value), oe.__value = "LTSO", M(oe, oe.__value), re.__value = "STSO", M(re, re.__value), p(x, "class", "line-edit svelte-t914cf"), p(x, "data-field", "emp"), p(x, "data-line-id", Ce = /*row*/
      e[20]?.id), p(Ae, "class", "svelte-t914cf"), ae.__value = "", M(ae, ae.__value), ce.__value = "M", M(ce, ce.__value), ue.__value = "F", M(ue, ue.__value), p(N, "class", "line-edit svelte-t914cf"), p(N, "data-field", "sex"), p(N, "data-line-id", ze = /*row*/
      e[20]?.id), p(Me, "class", "svelte-t914cf"), he.__value = "", M(he, he.__value), de.__value = "DFO", M(de, de.__value), fe.__value = "BAG", M(fe, fe.__value), me.__value = "PAX", M(me, me.__value), p(W, "class", "line-edit svelte-t914cf"), p(W, "data-field", "function"), p(W, "data-line-id", De = /*row*/
      e[20]?.id), p(Le, "class", "svelte-t914cf"), p(Fe, "class", "line-rdo-cell svelte-t914cf"), p(ke, "class", "svelte-t914cf"), p(je, "class", "line-hours svelte-t914cf"), D(t, "position", "absolute"), D(
        t,
        "top",
        /*virtualRow*/
        e[19].start + "px"
      ), D(t, "left", "0"), D(t, "width", "100%"), D(
        t,
        "height",
        /*virtualRow*/
        e[19].size + "px"
      ), p(t, "data-line-row", Ve = /*row*/
      e[20]?.id);
    },
    m(S, I) {
      te(S, t, I), f(t, n), f(n, s), f(s, i);
      for (let _ = 0; _ < F.length; _ += 1)
        F[_] && F[_].m(s, null);
      B(
        s,
        /*row*/
        e[20]?.teamId ?? ""
      ), f(t, r), f(t, a), f(a, c), f(t, d), f(t, m), f(m, g), f(g, y);
      for (let _ = 0; _ < R.length; _ += 1)
        R[_] && R[_].m(g, null);
      B(
        g,
        /*row*/
        e[20]?.shiftId ?? ""
      ), f(t, O), f(t, w), f(w, A), f(t, v), f(t, E), f(E, U), f(t, G), f(t, H), f(H, z), f(z, q), f(z, j), f(z, J), f(z, ne), B(
        z,
        /*row*/
        e[20]?.position ?? ""
      ), f(t, nt), f(t, Ae), f(Ae, x), f(x, se), f(x, ie), f(x, le), f(x, oe), f(x, re), B(
        x,
        /*row*/
        e[20]?.emp ?? ""
      ), f(t, it), f(t, Me), f(Me, N), f(N, ae), f(N, ce), f(N, ue), B(
        N,
        /*row*/
        e[20]?.sex ?? ""
      ), f(t, ot), f(t, Le), f(Le, W), f(W, he), f(W, de), f(W, fe), f(W, me), B(
        W,
        /*row*/
        e[20]?.function ?? ""
      ), f(t, at), f(t, Fe), f(Fe, Pe), f(t, ct), f(t, ke), f(ke, Ke), f(t, ut);
      for (let _ = 0; _ < 7; _ += 1)
        K[_] && K[_].m(t, null);
      f(t, He), f(t, je), f(je, Je), f(t, ht), Ue || (dt = [
        Y(s, "change", Rt),
        Y(c, "input", kt),
        Y(g, "change", xt),
        Y(z, "change", jt),
        Y(x, "change", Wt),
        Y(N, "change", Vt),
        Y(W, "change", Nt)
      ], Ue = !0);
    },
    p(S, I) {
      if (e = S, I[0] & /*teamOptions*/
      8) {
        ge = Z(
          /*teamOptions*/
          e[3]
        );
        let _;
        for (_ = 0; _ < ge.length; _ += 1) {
          const Q = Ot(e, ge, _);
          F[_] ? F[_].p(Q, I) : (F[_] = yt(Q), F[_].c(), F[_].m(s, null));
        }
        for (; _ < F.length; _ += 1)
          F[_].d(1);
        F.length = ge.length;
      }
      if (I[0] & /*rows, virtualizer, teamOptions*/
      25 && l !== (l = /*row*/
      e[20]?.id) && p(s, "data-line-id", l), I[0] & /*rows, virtualizer, teamOptions*/
      25 && o !== (o = /*row*/
      e[20]?.teamId ?? "") && B(
        s,
        /*row*/
        e[20]?.teamId ?? ""
      ), I[0] & /*rows, virtualizer, teamOptions*/
      25 && h !== (h = /*row*/
      e[20]?.id) && p(c, "data-line-id", h), I[0] & /*rows, virtualizer, teamOptions*/
      25 && u !== (u = /*row*/
      e[20]?.line ?? "") && c.value !== u && (c.value = u), I[0] & /*shiftOptions*/
      4) {
        _e = Z(
          /*shiftOptions*/
          e[2]
        );
        let _;
        for (_ = 0; _ < _e.length; _ += 1) {
          const Q = Et(e, _e, _);
          R[_] ? R[_].p(Q, I) : (R[_] = wt(Q), R[_].c(), R[_].m(g, null));
        }
        for (; _ < R.length; _ += 1)
          R[_].d(1);
        R.length = _e.length;
      }
      if (I[0] & /*rows, virtualizer, teamOptions*/
      25 && T !== (T = /*row*/
      e[20]?.id) && p(g, "data-line-id", T), I[0] & /*rows, virtualizer, teamOptions*/
      25 && C !== (C = /*row*/
      e[20]?.shiftId ?? "") && B(
        g,
        /*row*/
        e[20]?.shiftId ?? ""
      ), I[0] & /*rows, virtualizer*/
      17 && L !== (L = /*row*/
      (e[20]?.start ?? "") + "") && $(A, L), I[0] & /*rows, virtualizer*/
      17 && V !== (V = /*row*/
      (e[20]?.end ?? "") + "") && $(U, V), I[0] & /*rows, virtualizer, teamOptions*/
      25 && Te !== (Te = /*row*/
      e[20]?.id) && p(z, "data-line-id", Te), I[0] & /*rows, virtualizer, teamOptions*/
      25 && tt !== (tt = /*row*/
      e[20]?.position ?? "") && B(
        z,
        /*row*/
        e[20]?.position ?? ""
      ), I[0] & /*rows, virtualizer, teamOptions*/
      25 && Ce !== (Ce = /*row*/
      e[20]?.id) && p(x, "data-line-id", Ce), I[0] & /*rows, virtualizer, teamOptions*/
      25 && st !== (st = /*row*/
      e[20]?.emp ?? "") && B(
        x,
        /*row*/
        e[20]?.emp ?? ""
      ), I[0] & /*rows, virtualizer, teamOptions*/
      25 && ze !== (ze = /*row*/
      e[20]?.id) && p(N, "data-line-id", ze), I[0] & /*rows, virtualizer, teamOptions*/
      25 && lt !== (lt = /*row*/
      e[20]?.sex ?? "") && B(
        N,
        /*row*/
        e[20]?.sex ?? ""
      ), I[0] & /*rows, virtualizer, teamOptions*/
      25 && De !== (De = /*row*/
      e[20]?.id) && p(W, "data-line-id", De), I[0] & /*rows, virtualizer, teamOptions*/
      25 && rt !== (rt = /*row*/
      e[20]?.function ?? "") && B(
        W,
        /*row*/
        e[20]?.function ?? ""
      ), I[0] & /*rows, virtualizer*/
      17 && Re !== (Re = /*row*/
      (e[20]?.rdos ?? "—") + "") && $(Pe, Re), I[0] & /*rows, virtualizer*/
      17 && xe !== (xe = /*row*/
      (e[20]?.paid ?? "") + "") && $(Ke, xe), I[0] & /*rows, virtualizer, emitDay*/
      145) {
        qe = Z([0, 1, 2, 3, 4, 5, 6]);
        let _;
        for (_ = 0; _ < 7; _ += 1) {
          const Q = bt(e, qe, _);
          K[_] ? K[_].p(Q, I) : (K[_] = It(Q), K[_].c(), K[_].m(t, He));
        }
        for (; _ < 7; _ += 1)
          K[_].d(1);
      }
      I[0] & /*rows, virtualizer*/
      17 && We !== (We = /*row*/
      (e[20]?.hours ?? "") + "") && $(Je, We), I[0] & /*virtualizer*/
      16 && D(
        t,
        "top",
        /*virtualRow*/
        e[19].start + "px"
      ), I[0] & /*virtualizer*/
      16 && D(
        t,
        "height",
        /*virtualRow*/
        e[19].size + "px"
      ), I[0] & /*rows, virtualizer, teamOptions*/
      25 && Ve !== (Ve = /*row*/
      e[20]?.id) && p(t, "data-line-row", Ve);
    },
    d(S) {
      S && ee(t), Ne(F, S), Ne(R, S), Ne(K, S), Ue = !1, Oe(dt);
    }
  };
}
function Mn(e) {
  let t;
  function n(l, o) {
    return (
      /*mode*/
      l[1] === "svelte" ? Cn : An
    );
  }
  let s = n(e), i = s(e);
  return {
    c() {
      t = b("div"), i.c(), p(t, "class", "lines-table-root svelte-t914cf");
    },
    m(l, o) {
      te(l, t, o), i.m(t, null);
    },
    p(l, o) {
      s === (s = n(l)) && i ? i.p(l, o) : (i.d(1), i = s(l), i && (i.c(), i.m(t, null)));
    },
    i: P,
    o: P,
    d(l) {
      l && ee(t), i.d();
    }
  };
}
let zn = 42;
function At(e) {
  if (!e) return "";
  const t = e.name || e.id || "";
  return e.start && e.end ? (t ? t + " " : "") + "(" + e.start + "–" + e.end + ")" : e.start ? t ? t + " " + e.start : e.start : t;
}
function Ct(e, t) {
  const n = String(e || "").toUpperCase();
  return n === "RDO" || n === "—" ? "cell-toggle cell-rdo" : t === "BAG" ? "cell-toggle cell-function-duty cell-bag" : t === "DFO" ? "cell-toggle cell-function-duty cell-dfo" : t === "PAX" ? "cell-toggle cell-function-duty cell-pax" : "cell-toggle cell-work";
}
function Ln(e, t, n) {
  let { rows: s = [] } = t, { mode: i = "svelte" } = t, { shiftOptions: l = [] } = t, { teamOptions: o = [] } = t, { onInlineEdit: r = null } = t, { onDayToggle: a = null } = t, c, h;
  qt(() => {
    i === "svelte" && n(4, h = Tn({
      count: s.length,
      getScrollElement: () => c,
      estimateSize: () => zn,
      overscan: 5,
      getItemKey: (v) => s[v]?.id ?? v
    }));
  });
  function u(v, E, V) {
    r?.({ lineId: v, field: E, value: V });
  }
  function d(v, E) {
    a?.({ lineId: v, dayIndex: E });
  }
  const m = (v, E) => u(v?.id, "team", E.target.value), g = (v, E) => u(v?.id, "lineCode", E.target.value), y = (v, E) => u(v?.id, "shift", E.target.value), T = (v, E) => u(v?.id, "position", E.target.value), C = (v, E) => u(v?.id, "emp", E.target.value), O = (v, E) => u(v?.id, "sex", E.target.value), w = (v, E) => u(v?.id, "function", E.target.value), L = (v, E) => d(v?.id, E);
  function A(v) {
    Ye[v ? "unshift" : "push"](() => {
      c = v, n(5, c);
    });
  }
  return e.$$set = (v) => {
    "rows" in v && n(0, s = v.rows), "mode" in v && n(1, i = v.mode), "shiftOptions" in v && n(2, l = v.shiftOptions), "teamOptions" in v && n(3, o = v.teamOptions), "onInlineEdit" in v && n(8, r = v.onInlineEdit), "onDayToggle" in v && n(9, a = v.onDayToggle);
  }, e.$$.update = () => {
    e.$$.dirty[0] & /*virtualizer, mode, rows*/
    19 && h && i === "svelte" && h.setOptions({ count: s.length });
  }, [
    s,
    i,
    l,
    o,
    h,
    c,
    u,
    d,
    r,
    a,
    m,
    g,
    y,
    T,
    C,
    O,
    w,
    L,
    A
  ];
}
class Dn extends ln {
  constructor(t) {
    super(), sn(
      this,
      t,
      Ln,
      Mn,
      zt,
      {
        rows: 0,
        mode: 1,
        shiftOptions: 2,
        teamOptions: 3,
        onInlineEdit: 8,
        onDayToggle: 9
      },
      null,
      [-1, -1]
    );
  }
}
function Rn(e) {
  const t = e || window.Scheduler;
  if (!t) return;
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
      rotationDutyResolver: typeof t.getRotationDuty == "function" ? t.getRotationDuty : null
    };
  }
  function i() {
    const u = t.state && Array.isArray(t.state.lines) ? t.state.lines : [], d = typeof t.sortLinesForView == "function" && typeof t.filterLinesForView == "function" ? t.sortLinesForView(t.filterLinesForView(u)) : u, m = t.state && t.state.schedule || {}, g = typeof t.getRowModels == "function" ? t.getRowModels(d, m, s()) : typeof t.getLineRowModels == "function" ? t.getLineRowModels(s()) : [];
    return Array.isArray(g) ? g : [];
  }
  function l() {
    return t.teams && Array.isArray(t.teams.teams) ? t.teams.teams : [];
  }
  function o() {
    return t.state && Array.isArray(t.state.shifts) ? t.state.shifts : [];
  }
  function r(u) {
    !u || typeof u.$set != "function" || u.$set({
      rows: i(),
      shiftOptions: o(),
      teamOptions: l()
    });
  }
  function a(u) {
    if (!u) return;
    const d = t.findLineById ? t.findLineById(u.lineId) : null;
    if (!d) return;
    const m = u.field, g = u.value;
    m === "lineCode" ? d.lineCode = String(g || "").trim() || d.lineCode : m === "sex" ? d.sex = g === "F" ? "F" : "M" : m === "function" ? d.function = g === "DFO" || g === "PAX" || g === "BAG" ? g : "" : m === "emp" || m === "position" ? t.applyLineEmp && t.applyLineEmp(d, g) : m === "shift" ? t.applyLineShift && t.applyLineShift(d, g) : m === "team" && t.setLineTeam && t.setLineTeam(u.lineId, g), t.updateStatus && t.updateStatus("Updated " + (d.lineCode || u.lineId)), h(), (m === "emp" || m === "position" || m === "shift") && t.renderCoverageBars && t.renderCoverageBars(), m === "team" && t.renderTeams && t.renderTeams();
  }
  function c(u) {
    if (!u) return;
    const d = t.findLineById ? t.findLineById(u.lineId) : null, m = Number(u.dayIndex);
    if (!d || !Number.isInteger(m) || m < 0 || m > 6) return;
    const g = d.id;
    t.state.schedule || (t.state.schedule = {}), t.state.schedule[g] || (t.state.schedule[g] = []);
    const y = t.state.schedule[g][m] || "RDO";
    t.state.schedule[g][m] = y === "WORK" ? "RDO" : "WORK", t.syncRdoDaysFromSchedule && t.syncRdoDaysFromSchedule(d), h(), t.renderCoverageBars && t.renderCoverageBars();
  }
  const h = () => {
    try {
      const u = n._linesTableApp;
      u ? r(u) : n._linesTableApp = new Dn({
        target: n,
        props: {
          rows: i(),
          shiftOptions: o(),
          teamOptions: l(),
          onInlineEdit: a,
          onDayToggle: c
        }
      });
    } catch (u) {
      console.error("lines-table: refresh failed", u);
    }
  };
  h(), document.addEventListener("click", (u) => {
    const d = u.target.closest?.(".tab-btn");
    d && d.dataset.tab === "lines" && h();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((u) => {
    window.addEventListener(u, h);
  }), n.refresh = h;
}
export {
  Rn as initLinesTable
};
