var Bt = Object.defineProperty;
var Pt = (t, e, n) => e in t ? Bt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var Ue = (t, e, n) => Pt(t, typeof e != "symbol" ? e + "" : e, n);
function P() {
}
function Mt(t) {
  return t();
}
function dt() {
  return /* @__PURE__ */ Object.create(null);
}
function Ee(t) {
  t.forEach(Mt);
}
function et(t) {
  return typeof t == "function";
}
function zt(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Kt(t) {
  return Object.keys(t).length === 0;
}
function Ht(t, ...e) {
  if (t == null) {
    for (const s of e)
      s(void 0);
    return P;
  }
  const n = t.subscribe(...e);
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
function mt(t) {
  return t ?? "";
}
function d(t, e) {
  t.appendChild(e);
}
function te(t, e, n) {
  t.insertBefore(e, n || null);
}
function ee(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function Ne(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function O(t) {
  return document.createElement(t);
}
function U(t) {
  return document.createTextNode(t);
}
function F() {
  return U(" ");
}
function Y(t, e, n, s) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n, s);
}
function S(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Xt(t) {
  return Array.from(t.childNodes);
}
function $(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function z(t, e) {
  t.value = e ?? "";
}
function L(t, e, n, s) {
  n == null ? t.style.removeProperty(e) : t.style.setProperty(e, n, "");
}
function B(t, e, n) {
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
function we(t) {
  Ae = t;
}
function Gt() {
  if (!Ae) throw new Error("Function called outside component initialization");
  return Ae;
}
function Jt(t) {
  Gt().$$.on_mount.push(t);
}
const be = [], Ye = [];
let ye = [];
const gt = [], Ut = /* @__PURE__ */ Promise.resolve();
let Ze = !1;
function qt() {
  Ze || (Ze = !0, Ut.then(Rt));
}
function $e(t) {
  ye.push(t);
}
const qe = /* @__PURE__ */ new Set();
let pe = 0;
function Rt() {
  if (pe !== 0)
    return;
  const t = Ae;
  do {
    try {
      for (; pe < be.length; ) {
        const e = be[pe];
        pe++, we(e), Qt(e.$$);
      }
    } catch (e) {
      throw be.length = 0, pe = 0, e;
    }
    for (we(null), be.length = 0, pe = 0; Ye.length; ) Ye.pop()();
    for (let e = 0; e < ye.length; e += 1) {
      const n = ye[e];
      qe.has(n) || (qe.add(n), n());
    }
    ye.length = 0;
  } while (be.length);
  for (; gt.length; )
    gt.pop()();
  Ze = !1, qe.clear(), we(t);
}
function Qt(t) {
  if (t.fragment !== null) {
    t.update(), Ee(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach($e);
  }
}
function Yt(t) {
  const e = [], n = [];
  ye.forEach((s) => t.indexOf(s) === -1 ? e.push(s) : n.push(s)), n.forEach((s) => s()), ye = e;
}
const Zt = /* @__PURE__ */ new Set();
function $t(t, e) {
  t && t.i && (Zt.delete(t), t.i(e));
}
function Z(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function en(t, e, n) {
  const { fragment: s, after_update: i } = t.$$;
  s && s.m(e, n), $e(() => {
    const l = t.$$.on_mount.map(Mt).filter(et);
    t.$$.on_destroy ? t.$$.on_destroy.push(...l) : Ee(l), t.$$.on_mount = [];
  }), i.forEach($e);
}
function tn(t, e) {
  const n = t.$$;
  n.fragment !== null && (Yt(n.after_update), Ee(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function nn(t, e) {
  t.$$.dirty[0] === -1 && (be.push(t), qt(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function sn(t, e, n, s, i, l, o = null, r = [-1]) {
  const a = Ae;
  we(t);
  const c = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: l,
    update: P,
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
  let f = !1;
  if (c.ctx = n ? n(t, e.props || {}, (h, p, ...E) => {
    const u = E.length ? E[0] : p;
    return c.ctx && i(c.ctx[h], c.ctx[h] = u) && (!c.skip_bound && c.bound[h] && c.bound[h](u), f && nn(t, h)), p;
  }) : [], c.update(), f = !0, Ee(c.before_update), c.fragment = s ? s(c.ctx) : !1, e.target) {
    if (e.hydrate) {
      const h = Xt(e.target);
      c.fragment && c.fragment.l(h), h.forEach(ee);
    } else
      c.fragment && c.fragment.c();
    e.intro && $t(t.$$.fragment), en(t, e.target, e.anchor), Rt();
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
    tn(this, 1), this.$destroy = P;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, n) {
    if (!et(n))
      return P;
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
    this.$$set && !Kt(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const on = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(on);
function rn(t) {
  return typeof t == "object" ? t.key : t;
}
function an(t, e) {
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
function ve(t, e, n) {
  let s = n.initialDeps ?? [], i, l = !0;
  function o() {
    var r;
    const a = process.env.NODE_ENV !== "production" && !!n.key && !!((r = n.debug) != null && r.call(n));
    let c = 0;
    a && (c = Date.now());
    const f = t();
    if (!(f.length !== s.length || f.some((E, u) => s[u] !== E)))
      return i;
    s = f;
    let p = 0;
    if (a && (p = Date.now()), i = e(...f), a) {
      const E = Math.round((Date.now() - c) * 100) / 100, u = Math.round((Date.now() - p) * 100) / 100, m = u / 16, g = (_, w) => {
        for (_ = String(_); _.length < w; )
          _ = " " + _;
        return _;
      };
      console.info(
        `%c⏱ ${g(u, 5)} /${g(E, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * m, 120)
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
const pt = (t, e) => Math.abs(t - e) < 1.01, cn = (t, e, n) => {
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
let Oe;
const Qe = () => {
  if (Oe !== void 0) return Oe;
  if (typeof navigator > "u") return Oe = !1;
  if (/iP(hone|od|ad)/.test(navigator.userAgent)) return Oe = !0;
  const t = navigator.maxTouchPoints;
  return Oe = navigator.platform === "MacIntel" && t !== void 0 && t > 0;
}, vt = (t) => {
  const { offsetWidth: e, offsetHeight: n } = t;
  return { width: e, height: n };
}, un = (t) => t, hn = (t) => {
  const e = Math.max(t.startIndex - t.overscan, 0), s = Math.min(t.endIndex + t.overscan, t.count - 1) - e + 1, i = new Array(s);
  for (let l = 0; l < s; l++)
    i[l] = e + l;
  return i;
}, fn = (t, e) => {
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
    t.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(r) : r();
  });
  return l.observe(n, { box: "border-box" }), () => {
    l.unobserve(n);
  };
}, Be = {
  passive: !0
}, dn = typeof window > "u" ? !0 : "onscrollend" in window, mn = (t, e, n) => {
  const s = t.scrollElement;
  if (!s)
    return;
  const i = t.targetWindow;
  if (!i)
    return;
  const l = t.options.useScrollendEvent && dn;
  let o = 0;
  const r = l ? null : cn(
    i,
    () => e(n(s), !1),
    t.options.isScrollingResetDelay
  ), a = (h) => () => {
    o = n(s), r?.(), e(o, h);
  }, c = a(!0), f = a(!1);
  return s.addEventListener("scroll", c, Be), l && s.addEventListener("scrollend", f, Be), () => {
    s.removeEventListener("scroll", c), l && s.removeEventListener("scrollend", f), r?.cancel();
  };
}, gn = (t, e) => mn(t, e, (n) => {
  const { horizontal: s, isRtl: i } = t.options;
  return s ? n.scrollLeft * (i && -1 || 1) : n.scrollTop;
}), _n = (t, e, n) => {
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
}, pn = (t, {
  adjustments: e = 0,
  behavior: n
}, s) => {
  var i, l;
  (l = (i = s.scrollElement) == null ? void 0 : i.scrollTo) == null || l.call(i, {
    [s.options.horizontal ? "left" : "top"]: t + e,
    behavior: n
  });
}, vn = pn;
function Sn(t, e, n, s) {
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
class bn {
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
              for (const [c, f] of this.elementsCache)
                if (f === r) {
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
      for (const h in n) {
        const p = n[h];
        p !== void 0 && (i[h] = p);
      }
      const l = this.options;
      let o = null, r = null, a = !1;
      if (l !== void 0 && l.enabled && i.enabled && i.anchorTo === "end" && this.scrollElement !== null) {
        const h = l.count, p = i.count, E = this.getMeasurements(), u = ((s = this._singleLaneMeasurements) == null ? void 0 : s.items) ?? E, m = (M) => rn(u[M]), g = h > 0 ? m(0) : null, _ = h > 0 ? m(h - 1) : null;
        if (p !== h || h > 0 && p > 0 && (i.getItemKey(0) !== g || i.getItemKey(p - 1) !== _)) {
          a = !0;
          const M = h > 0 ? this.getVirtualItemForOffset(this.getScrollOffset()) ?? E[0] : null;
          M && (o = [M.key, this.getScrollOffset() - M.start]);
          const C = i.followOnAppend === !0 ? "auto" : i.followOnAppend || null;
          C && p > 0 && this.isAtEnd(l.scrollEndThreshold) && (h === 0 || i.getItemKey(p - 1) !== _) && (p > h || Sn(
            h,
            p,
            m,
            i.getItemKey
          )) && (r = C);
        }
      }
      this.options = i, a && (this.pendingMin = 0, this.itemSizeCacheVersion++);
      let c = !1, f = 0;
      if (o && this.scrollOffset !== null) {
        const [h, p] = o, E = this.getMeasurements(), { count: u, getItemKey: m } = this.options;
        let g = 0;
        for (; g < u && m(g) !== h; )
          g++;
        if (g < u) {
          const _ = E[g];
          if (_) {
            const w = Math.max(0, _.start + p);
            !r && w !== this.scrollOffset && (f = w - this.scrollOffset, this.scrollOffset = w, c = !0);
          }
        }
      }
      (c || r) && (this.pendingScrollAnchor = [
        c ? o[0] : null,
        c ? o[1] : 0,
        r,
        f
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
      }, f) => {
        var h;
        const p = this.itemSizeCache;
        if (!o)
          return this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), [];
        if (this.laneAssignments.size > n)
          for (const w of this.laneAssignments.keys())
            w >= n && this.laneAssignments.delete(w);
        this.lanesChangedFlag && (this.lanesChangedFlag = !1, this.lanesSettling = !0, this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), this.pendingMin = null), this.measurementsCache.length === 0 && !this.lanesSettling && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((w) => {
          this.itemSizeCache.set(w.key, w.size);
        }));
        const E = this.lanesSettling ? 0 : this.pendingMin ?? 0;
        if (this.pendingMin = null, this.lanesSettling && this.measurementsCache.length === n && (this.lanesSettling = !1), r === 1) {
          const w = n * 2;
          let I = (h = this._singleLaneMeasurements) == null ? void 0 : h.flat;
          if (!I || I.length < w) {
            const A = new Float64Array(w);
            I && E > 0 && A.set(I.subarray(0, E * 2)), I = A;
          }
          const M = E === 0 ? new Array(n) : this._singleLaneMeasurements.items.slice();
          let C;
          if (E === 0)
            C = s + i;
          else {
            const A = E - 1;
            C = I[A * 2] + I[A * 2 + 1] + c;
          }
          for (let A = E; A < n; A++) {
            const V = l(A);
            M[A] = V;
            const G = p.get(V), q = typeof G == "number" ? G : this.options.estimateSize(A);
            I[A * 2] = C, I[A * 2 + 1] = q, C += q + c;
          }
          this._singleLaneMeasurements = { flat: I, items: M };
          const b = an(M, I);
          return this.measurementsCache = b, b;
        }
        const u = this.measurementsCache.slice(0, E), m = new Array(r).fill(
          void 0
        ), g = new Float64Array(r);
        let _ = 0;
        for (let w = 0; w < E; w++) {
          const I = u[w];
          I && (m[I.lane] === void 0 && _++, m[I.lane] = w, g[I.lane] = I.end);
        }
        for (let w = E; w < n; w++) {
          const I = l(w), M = this.laneAssignments.get(w);
          let C, b;
          const A = a === "estimate" || p.has(I);
          if (M !== void 0 && this.options.lanes > 1) {
            C = M;
            const H = m[C], R = H !== void 0 ? u[H] : void 0;
            b = R ? R.end + c : s + i;
          } else if (_ === r) {
            let H = 0, R = g[0], J = m[0];
            for (let j = 1; j < r; j++) {
              const X = g[j];
              (X < R || X === R && m[j] < J) && (H = j, R = X, J = m[j]);
            }
            C = H, b = R + c, A && this.laneAssignments.set(w, C);
          } else
            C = w % this.options.lanes, b = s + i, A && this.laneAssignments.set(w, C);
          const V = p.get(I), G = typeof V == "number" ? V : this.options.estimateSize(w), q = b + G;
          u[w] = {
            index: w,
            start: b,
            size: G,
            end: q,
            key: I,
            lane: C
          }, m[C] === void 0 && _++, m[C] = w, g[C] = q;
        }
        return this.measurementsCache = u, u;
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
      (n, s, i, l) => n.length === 0 || s === 0 ? (this.range = null, null) : (this.range = En(
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
      const f = (i = this._singleLaneMeasurements) == null ? void 0 : i.flat;
      if (this.options.lanes === 1 && f != null)
        c = this.options.getItemKey(n), a = f[n * 2], r = f[n * 2 + 1];
      else {
        const E = this.measurementsCache[n];
        if (!E) return;
        c = E.key, a = E.start, r = E.size;
      }
      const h = this.itemSizeCache.get(c) ?? r, p = s - h;
      if (p !== 0) {
        const E = this.options.anchorTo === "end" && ((l = this.scrollState) == null ? void 0 : l.behavior) !== "smooth" && this.getVirtualDistanceFromEnd() <= this.options.scrollEndThreshold, u = E ? this.getTotalSize() : 0, m = this.getScrollOffset() + this.scrollAdjustments, _ = !this.itemSizeCache.has(c) ? (
          // First measurement: compensate any item whose top sits above the
          // fold — the estimate→actual delta must be corrected regardless of
          // scroll direction, since the whole estimated block was above it.
          a < m
        ) : (
          // Re-measurement: only compensate an item that is ENTIRELY above the
          // fold. An item that merely *spans* the fold (top above, bottom
          // below — e.g. a streaming chat message growing at its bottom)
          // changes size *below* the anchor point, so shifting scrollTop by the
          // delta would drag the viewport downward on every growth (#1218).
          // Also skip during backward scroll to avoid the "items jump while
          // scrolling up" cascade.
          a + h <= m && this.scrollDirection !== "backward"
        ), w = ((o = this.scrollState) == null ? void 0 : o.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(
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
          p,
          this
        ) : _);
        (this.pendingMin === null || n < this.pendingMin) && (this.pendingMin = n), this.itemSizeCache.set(c, s), this.itemSizeCacheVersion++;
        let I = !1;
        E ? I = this.applyScrollAdjustment(
          this.getTotalSize() - u
        ) : w && (I = this.applyScrollAdjustment(p)), this.notify(I), this._retryClampedAdjustment();
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
      const l = (s = this._singleLaneMeasurements) == null ? void 0 : s.flat, o = this.options.lanes === 1 && l != null, r = Lt(
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
    if (process.env.NODE_ENV !== "production" && this.options.debug && console.info("correction", e), Qe() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded))
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
const Lt = (t, e, n, s) => {
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
function yn(t, e, n) {
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
function En(t, e, n, s, i) {
  const l = t.length - 1;
  if (t.length <= s)
    return { startIndex: 0, endIndex: l };
  if (s === 1 && i !== null) {
    const c = yn(
      i,
      l,
      n
    );
    let f = c;
    const h = n + e;
    for (; f < l && i[f * 2] + i[f * 2 + 1] < h; )
      f++;
    return { startIndex: c, endIndex: f };
  }
  let r = Lt(0, l, (c) => t[c].start, n), a = r;
  if (s === 1)
    for (; a < l && t[a].end < n + e; )
      a++;
  else if (s > 1) {
    const c = Array(s).fill(0);
    for (; a < l && c.some((h) => h < n + e); ) {
      const h = t[a];
      c[h.lane] = h.end, a++;
    }
    const f = Array(s).fill(n + e);
    for (; r >= 0 && f.some((h) => h >= n); ) {
      const h = t[r];
      f[h.lane] = h.start, r--;
    }
    r = Math.max(0, r - r % s), a = Math.min(l, a + (s - 1 - a % s));
  }
  return { startIndex: r, endIndex: a };
}
const Se = [];
function On(t, e) {
  return {
    subscribe: Dt(t, e).subscribe
  };
}
function Dt(t, e = P) {
  let n;
  const s = /* @__PURE__ */ new Set();
  function i(r) {
    if (zt(t, r) && (t = r, n)) {
      const a = !Se.length;
      for (const c of s)
        c[1](), Se.push(c, t);
      if (a) {
        for (let c = 0; c < Se.length; c += 2)
          Se[c][0](Se[c + 1]);
        Se.length = 0;
      }
    }
  }
  function l(r) {
    i(r(t));
  }
  function o(r, a = P) {
    const c = [r, a];
    return s.add(c), s.size === 1 && (n = e(i, l) || P), r(t), () => {
      s.delete(c), s.size === 0 && n && (n(), n = null);
    };
  }
  return { set: i, update: l, subscribe: o };
}
function wn(t, e, n) {
  const s = !Array.isArray(t), i = s ? [t] : t;
  if (!i.every(Boolean))
    throw new Error("derived() expects stores as input, got a falsy value");
  const l = e.length < 2;
  return On(n, (o, r) => {
    let a = !1;
    const c = [];
    let f = 0, h = P;
    const p = () => {
      if (f)
        return;
      h();
      const u = e(s ? c[0] : c, o, r);
      l ? o(u) : h = et(u) ? u : P;
    }, E = i.map(
      (u, m) => Ht(
        u,
        (g) => {
          c[m] = g, f &= ~(1 << m), a && p();
        },
        () => {
          f |= 1 << m;
        }
      )
    );
    return a = !0, p(), function() {
      Ee(E), h(), a = !1;
    };
  });
}
function An(t) {
  const e = new bn(t), n = e.setOptions;
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
  return s = Dt(e, () => (i(t), e._didMount())), wn(s, (l) => Object.assign(l, { setOptions: i }));
}
function In(t) {
  return An({
    observeElementRect: fn,
    observeElementOffset: gn,
    scrollToFn: vn,
    ...t
  });
}
function St(t, e, n) {
  const s = t.slice();
  s[19] = e[n];
  const i = (
    /*rows*/
    s[0][
      /*virtualRow*/
      s[19].index
    ]
  );
  return s[20] = i, s;
}
function bt(t, e, n) {
  const s = t.slice();
  return s[23] = e[n], s;
}
function yt(t, e, n) {
  const s = t.slice();
  return s[26] = e[n], s;
}
function Et(t, e, n) {
  const s = t.slice();
  return s[29] = e[n], s;
}
function Tn(t) {
  let e;
  return {
    c() {
      e = O("div"), e.textContent = "Classic Lines mode active", S(e, "class", "muted");
    },
    m(n, s) {
      te(n, e, s);
    },
    p: P,
    d(n) {
      n && ee(e);
    }
  };
}
function Cn(t) {
  let e, n, s, i, l, o, r, a = Z(
    /*virtualizer*/
    t[4]?.getVirtualItems() ?? []
  ), c = [];
  for (let f = 0; f < a.length; f += 1)
    c[f] = It(St(t, a, f));
  return {
    c() {
      e = O("div"), n = O("table"), s = O("thead"), s.innerHTML = '<tr><th class="svelte-t914cf">Team</th> <th class="svelte-t914cf">Line</th> <th class="svelte-t914cf">Shift</th> <th class="svelte-t914cf">Start</th> <th class="svelte-t914cf">End</th> <th class="svelte-t914cf">Position</th> <th class="svelte-t914cf">Emp</th> <th class="svelte-t914cf">Sex</th> <th class="svelte-t914cf">Function</th> <th class="svelte-t914cf">RDOs</th> <th class="svelte-t914cf">Paid</th> <th class="svelte-t914cf">Sun</th> <th class="svelte-t914cf">Mon</th> <th class="svelte-t914cf">Tue</th> <th class="svelte-t914cf">Wed</th> <th class="svelte-t914cf">Thu</th> <th class="svelte-t914cf">Fri</th> <th class="svelte-t914cf">Sat</th> <th class="svelte-t914cf">Hours</th></tr>', i = F(), l = O("tbody");
      for (let f = 0; f < c.length; f += 1)
        c[f].c();
      o = F(), r = O("div"), L(l, "position", "relative"), L(l, "height", "0"), L(
        r,
        "height",
        /*virtualizer*/
        (t[4]?.getTotalSize() ?? 0) + "px"
      ), S(n, "class", "data-table lines-editable svelte-t914cf"), L(n, "width", "max-content"), L(n, "min-width", "1100px"), S(e, "class", "lines-virtual-root svelte-t914cf"), L(e, "height", "100%"), L(e, "overflow", "auto"), L(e, "position", "relative");
    },
    m(f, h) {
      te(f, e, h), d(e, n), d(n, s), d(n, i), d(n, l);
      for (let p = 0; p < c.length; p += 1)
        c[p] && c[p].m(l, null);
      d(n, o), d(n, r), t[18](e);
    },
    p(f, h) {
      if (h[0] & /*virtualizer, rows, emitDay, emitEdit, shiftOptions, teamOptions*/
      221) {
        a = Z(
          /*virtualizer*/
          f[4]?.getVirtualItems() ?? []
        );
        let p;
        for (p = 0; p < a.length; p += 1) {
          const E = St(f, a, p);
          c[p] ? c[p].p(E, h) : (c[p] = It(E), c[p].c(), c[p].m(l, null));
        }
        for (; p < c.length; p += 1)
          c[p].d(1);
        c.length = a.length;
      }
      h[0] & /*virtualizer*/
      16 && L(
        r,
        "height",
        /*virtualizer*/
        (f[4]?.getTotalSize() ?? 0) + "px"
      );
    },
    d(f) {
      f && ee(e), Ne(c, f), t[18](null);
    }
  };
}
function Ot(t) {
  let e, n = (
    /*team*/
    (t[29].name ?? /*team*/
    t[29].id) + ""
  ), s, i;
  return {
    c() {
      e = O("option"), s = U(n), e.__value = i = /*team*/
      t[29].id, z(e, e.__value);
    },
    m(l, o) {
      te(l, e, o), d(e, s);
    },
    p(l, o) {
      o[0] & /*teamOptions*/
      8 && n !== (n = /*team*/
      (l[29].name ?? /*team*/
      l[29].id) + "") && $(s, n), o[0] & /*teamOptions*/
      8 && i !== (i = /*team*/
      l[29].id) && (e.__value = i, z(e, e.__value));
    },
    d(l) {
      l && ee(e);
    }
  };
}
function wt(t) {
  let e, n = Tt(
    /*shift*/
    t[26]
  ) + "", s, i;
  return {
    c() {
      e = O("option"), s = U(n), e.__value = i = /*shift*/
      t[26].id, z(e, e.__value);
    },
    m(l, o) {
      te(l, e, o), d(e, s);
    },
    p(l, o) {
      o[0] & /*shiftOptions*/
      4 && n !== (n = Tt(
        /*shift*/
        l[26]
      ) + "") && $(s, n), o[0] & /*shiftOptions*/
      4 && i !== (i = /*shift*/
      l[26].id) && (e.__value = i, z(e, e.__value));
    },
    d(l) {
      l && ee(e);
    }
  };
}
function At(t) {
  let e, n = (
    /*row*/
    (t[20]?.days?.[
      /*i*/
      t[23]
    ] ?? "") + ""
  ), s, i, l, o, r;
  function a() {
    return (
      /*click_handler*/
      t[17](
        /*row*/
        t[20],
        /*i*/
        t[23]
      )
    );
  }
  return {
    c() {
      e = O("td"), s = U(n), S(e, "class", i = mt(Ct(
        /*row*/
        t[20]?.days?.[
          /*i*/
          t[23]
        ]
      )) + " svelte-t914cf"), S(e, "data-line-id", l = /*row*/
      t[20]?.id), S(
        e,
        "data-day-index",
        /*i*/
        t[23]
      );
    },
    m(c, f) {
      te(c, e, f), d(e, s), o || (r = Y(e, "click", a), o = !0);
    },
    p(c, f) {
      t = c, f[0] & /*rows, virtualizer*/
      17 && n !== (n = /*row*/
      (t[20]?.days?.[
        /*i*/
        t[23]
      ] ?? "") + "") && $(s, n), f[0] & /*rows, virtualizer, teamOptions*/
      25 && i !== (i = mt(Ct(
        /*row*/
        t[20]?.days?.[
          /*i*/
          t[23]
        ]
      )) + " svelte-t914cf") && S(e, "class", i), f[0] & /*rows, virtualizer, teamOptions*/
      25 && l !== (l = /*row*/
      t[20]?.id) && S(e, "data-line-id", l);
    },
    d(c) {
      c && ee(e), o = !1, r();
    }
  };
}
function It(t) {
  let e, n, s, i, l, o, r, a, c, f, h, p, E, u, m, g, _, w, I, M = (
    /*row*/
    (t[20]?.start ?? "") + ""
  ), C, b, A, V = (
    /*row*/
    (t[20]?.end ?? "") + ""
  ), G, q, H, R, J, j, X, ne, Ie, tt, nt, Te, x, se, ie, le, oe, re, Ce, st, it, Me, N, ae, ce, ue, ze, lt, ot, Re, W, he, fe, de, me, Le, rt, at, De, ke = (
    /*row*/
    (t[20]?.rdos ?? "—") + ""
  ), Pe, ct, Fe, xe = (
    /*row*/
    (t[20]?.paid ?? "") + ""
  ), Ke, ut, He, je, We = (
    /*row*/
    (t[20]?.hours ?? "") + ""
  ), Xe, ht, Ve, Ge, ft, ge = Z(
    /*teamOptions*/
    t[3]
  ), D = [];
  for (let y = 0; y < ge.length; y += 1)
    D[y] = Ot(Et(t, ge, y));
  function kt(...y) {
    return (
      /*change_handler*/
      t[10](
        /*row*/
        t[20],
        ...y
      )
    );
  }
  function Ft(...y) {
    return (
      /*input_handler*/
      t[11](
        /*row*/
        t[20],
        ...y
      )
    );
  }
  let _e = Z(
    /*shiftOptions*/
    t[2]
  ), k = [];
  for (let y = 0; y < _e.length; y += 1)
    k[y] = wt(yt(t, _e, y));
  function xt(...y) {
    return (
      /*change_handler_1*/
      t[12](
        /*row*/
        t[20],
        ...y
      )
    );
  }
  function jt(...y) {
    return (
      /*change_handler_2*/
      t[13](
        /*row*/
        t[20],
        ...y
      )
    );
  }
  function Wt(...y) {
    return (
      /*change_handler_3*/
      t[14](
        /*row*/
        t[20],
        ...y
      )
    );
  }
  function Vt(...y) {
    return (
      /*change_handler_4*/
      t[15](
        /*row*/
        t[20],
        ...y
      )
    );
  }
  function Nt(...y) {
    return (
      /*change_handler_5*/
      t[16](
        /*row*/
        t[20],
        ...y
      )
    );
  }
  let Je = Z([0, 1, 2, 3, 4, 5, 6]), K = [];
  for (let y = 0; y < 7; y += 1)
    K[y] = At(bt(t, Je, y));
  return {
    c() {
      e = O("tr"), n = O("td"), s = O("select"), i = O("option"), i.textContent = "—";
      for (let y = 0; y < D.length; y += 1)
        D[y].c();
      r = F(), a = O("td"), c = O("input"), p = F(), E = O("td"), u = O("select"), m = O("option"), m.textContent = "—";
      for (let y = 0; y < k.length; y += 1)
        k[y].c();
      w = F(), I = O("td"), C = U(M), b = F(), A = O("td"), G = U(V), q = F(), H = O("td"), R = O("select"), J = O("option"), J.textContent = "—", j = O("option"), j.textContent = "TSO", X = O("option"), X.textContent = "LTSO", ne = O("option"), ne.textContent = "STSO", nt = F(), Te = O("td"), x = O("select"), se = O("option"), se.textContent = "—", ie = O("option"), ie.textContent = "FT", le = O("option"), le.textContent = "PT", oe = O("option"), oe.textContent = "LTSO", re = O("option"), re.textContent = "STSO", it = F(), Me = O("td"), N = O("select"), ae = O("option"), ae.textContent = "—", ce = O("option"), ce.textContent = "M", ue = O("option"), ue.textContent = "F", ot = F(), Re = O("td"), W = O("select"), he = O("option"), he.textContent = "—", fe = O("option"), fe.textContent = "DFO", de = O("option"), de.textContent = "BAG", me = O("option"), me.textContent = "PAX", at = F(), De = O("td"), Pe = U(ke), ct = F(), Fe = O("td"), Ke = U(xe), ut = F();
      for (let y = 0; y < 7; y += 1)
        K[y].c();
      He = F(), je = O("td"), Xe = U(We), ht = F(), i.__value = "", z(i, i.__value), S(s, "class", "line-edit svelte-t914cf"), S(s, "data-field", "team"), S(s, "data-line-id", l = /*row*/
      t[20]?.id), S(n, "class", "svelte-t914cf"), S(c, "type", "text"), S(c, "class", "line-edit line-code-input svelte-t914cf"), S(c, "data-field", "lineCode"), S(c, "data-line-id", f = /*row*/
      t[20]?.id), c.value = h = /*row*/
      t[20]?.line ?? "", S(a, "class", "svelte-t914cf"), m.__value = "", z(m, m.__value), S(u, "class", "line-edit svelte-t914cf"), S(u, "data-field", "shift"), S(u, "data-line-id", g = /*row*/
      t[20]?.id), S(E, "class", "svelte-t914cf"), S(I, "class", "svelte-t914cf"), S(A, "class", "svelte-t914cf"), J.__value = "", z(J, J.__value), j.__value = "TSO", z(j, j.__value), X.__value = "LTSO", z(X, X.__value), ne.__value = "STSO", z(ne, ne.__value), S(R, "class", "line-edit svelte-t914cf"), S(R, "data-field", "position"), S(R, "data-line-id", Ie = /*row*/
      t[20]?.id), S(H, "class", "svelte-t914cf"), se.__value = "", z(se, se.__value), ie.__value = "FT", z(ie, ie.__value), le.__value = "PT", z(le, le.__value), oe.__value = "LTSO", z(oe, oe.__value), re.__value = "STSO", z(re, re.__value), S(x, "class", "line-edit svelte-t914cf"), S(x, "data-field", "emp"), S(x, "data-line-id", Ce = /*row*/
      t[20]?.id), S(Te, "class", "svelte-t914cf"), ae.__value = "", z(ae, ae.__value), ce.__value = "M", z(ce, ce.__value), ue.__value = "F", z(ue, ue.__value), S(N, "class", "line-edit svelte-t914cf"), S(N, "data-field", "sex"), S(N, "data-line-id", ze = /*row*/
      t[20]?.id), S(Me, "class", "svelte-t914cf"), he.__value = "", z(he, he.__value), fe.__value = "DFO", z(fe, fe.__value), de.__value = "BAG", z(de, de.__value), me.__value = "PAX", z(me, me.__value), S(W, "class", "line-edit svelte-t914cf"), S(W, "data-field", "function"), S(W, "data-line-id", Le = /*row*/
      t[20]?.id), S(Re, "class", "svelte-t914cf"), S(De, "class", "line-rdo-cell svelte-t914cf"), S(Fe, "class", "svelte-t914cf"), S(je, "class", "line-hours svelte-t914cf"), L(e, "position", "absolute"), L(
        e,
        "top",
        /*virtualRow*/
        t[19].start + "px"
      ), L(e, "left", "0"), L(e, "width", "100%"), L(
        e,
        "height",
        /*virtualRow*/
        t[19].size + "px"
      ), S(e, "data-line-row", Ve = /*row*/
      t[20]?.id);
    },
    m(y, T) {
      te(y, e, T), d(e, n), d(n, s), d(s, i);
      for (let v = 0; v < D.length; v += 1)
        D[v] && D[v].m(s, null);
      B(
        s,
        /*row*/
        t[20]?.teamId ?? ""
      ), d(e, r), d(e, a), d(a, c), d(e, p), d(e, E), d(E, u), d(u, m);
      for (let v = 0; v < k.length; v += 1)
        k[v] && k[v].m(u, null);
      B(
        u,
        /*row*/
        t[20]?.shiftId ?? ""
      ), d(e, w), d(e, I), d(I, C), d(e, b), d(e, A), d(A, G), d(e, q), d(e, H), d(H, R), d(R, J), d(R, j), d(R, X), d(R, ne), B(
        R,
        /*row*/
        t[20]?.position ?? ""
      ), d(e, nt), d(e, Te), d(Te, x), d(x, se), d(x, ie), d(x, le), d(x, oe), d(x, re), B(
        x,
        /*row*/
        t[20]?.emp ?? ""
      ), d(e, it), d(e, Me), d(Me, N), d(N, ae), d(N, ce), d(N, ue), B(
        N,
        /*row*/
        t[20]?.sex ?? ""
      ), d(e, ot), d(e, Re), d(Re, W), d(W, he), d(W, fe), d(W, de), d(W, me), B(
        W,
        /*row*/
        t[20]?.function ?? ""
      ), d(e, at), d(e, De), d(De, Pe), d(e, ct), d(e, Fe), d(Fe, Ke), d(e, ut);
      for (let v = 0; v < 7; v += 1)
        K[v] && K[v].m(e, null);
      d(e, He), d(e, je), d(je, Xe), d(e, ht), Ge || (ft = [
        Y(s, "change", kt),
        Y(c, "input", Ft),
        Y(u, "change", xt),
        Y(R, "change", jt),
        Y(x, "change", Wt),
        Y(N, "change", Vt),
        Y(W, "change", Nt)
      ], Ge = !0);
    },
    p(y, T) {
      if (t = y, T[0] & /*teamOptions*/
      8) {
        ge = Z(
          /*teamOptions*/
          t[3]
        );
        let v;
        for (v = 0; v < ge.length; v += 1) {
          const Q = Et(t, ge, v);
          D[v] ? D[v].p(Q, T) : (D[v] = Ot(Q), D[v].c(), D[v].m(s, null));
        }
        for (; v < D.length; v += 1)
          D[v].d(1);
        D.length = ge.length;
      }
      if (T[0] & /*rows, virtualizer, teamOptions*/
      25 && l !== (l = /*row*/
      t[20]?.id) && S(s, "data-line-id", l), T[0] & /*rows, virtualizer, teamOptions*/
      25 && o !== (o = /*row*/
      t[20]?.teamId ?? "") && B(
        s,
        /*row*/
        t[20]?.teamId ?? ""
      ), T[0] & /*rows, virtualizer, teamOptions*/
      25 && f !== (f = /*row*/
      t[20]?.id) && S(c, "data-line-id", f), T[0] & /*rows, virtualizer, teamOptions*/
      25 && h !== (h = /*row*/
      t[20]?.line ?? "") && c.value !== h && (c.value = h), T[0] & /*shiftOptions*/
      4) {
        _e = Z(
          /*shiftOptions*/
          t[2]
        );
        let v;
        for (v = 0; v < _e.length; v += 1) {
          const Q = yt(t, _e, v);
          k[v] ? k[v].p(Q, T) : (k[v] = wt(Q), k[v].c(), k[v].m(u, null));
        }
        for (; v < k.length; v += 1)
          k[v].d(1);
        k.length = _e.length;
      }
      if (T[0] & /*rows, virtualizer, teamOptions*/
      25 && g !== (g = /*row*/
      t[20]?.id) && S(u, "data-line-id", g), T[0] & /*rows, virtualizer, teamOptions*/
      25 && _ !== (_ = /*row*/
      t[20]?.shiftId ?? "") && B(
        u,
        /*row*/
        t[20]?.shiftId ?? ""
      ), T[0] & /*rows, virtualizer*/
      17 && M !== (M = /*row*/
      (t[20]?.start ?? "") + "") && $(C, M), T[0] & /*rows, virtualizer*/
      17 && V !== (V = /*row*/
      (t[20]?.end ?? "") + "") && $(G, V), T[0] & /*rows, virtualizer, teamOptions*/
      25 && Ie !== (Ie = /*row*/
      t[20]?.id) && S(R, "data-line-id", Ie), T[0] & /*rows, virtualizer, teamOptions*/
      25 && tt !== (tt = /*row*/
      t[20]?.position ?? "") && B(
        R,
        /*row*/
        t[20]?.position ?? ""
      ), T[0] & /*rows, virtualizer, teamOptions*/
      25 && Ce !== (Ce = /*row*/
      t[20]?.id) && S(x, "data-line-id", Ce), T[0] & /*rows, virtualizer, teamOptions*/
      25 && st !== (st = /*row*/
      t[20]?.emp ?? "") && B(
        x,
        /*row*/
        t[20]?.emp ?? ""
      ), T[0] & /*rows, virtualizer, teamOptions*/
      25 && ze !== (ze = /*row*/
      t[20]?.id) && S(N, "data-line-id", ze), T[0] & /*rows, virtualizer, teamOptions*/
      25 && lt !== (lt = /*row*/
      t[20]?.sex ?? "") && B(
        N,
        /*row*/
        t[20]?.sex ?? ""
      ), T[0] & /*rows, virtualizer, teamOptions*/
      25 && Le !== (Le = /*row*/
      t[20]?.id) && S(W, "data-line-id", Le), T[0] & /*rows, virtualizer, teamOptions*/
      25 && rt !== (rt = /*row*/
      t[20]?.function ?? "") && B(
        W,
        /*row*/
        t[20]?.function ?? ""
      ), T[0] & /*rows, virtualizer*/
      17 && ke !== (ke = /*row*/
      (t[20]?.rdos ?? "—") + "") && $(Pe, ke), T[0] & /*rows, virtualizer*/
      17 && xe !== (xe = /*row*/
      (t[20]?.paid ?? "") + "") && $(Ke, xe), T[0] & /*rows, virtualizer, emitDay*/
      145) {
        Je = Z([0, 1, 2, 3, 4, 5, 6]);
        let v;
        for (v = 0; v < 7; v += 1) {
          const Q = bt(t, Je, v);
          K[v] ? K[v].p(Q, T) : (K[v] = At(Q), K[v].c(), K[v].m(e, He));
        }
        for (; v < 7; v += 1)
          K[v].d(1);
      }
      T[0] & /*rows, virtualizer*/
      17 && We !== (We = /*row*/
      (t[20]?.hours ?? "") + "") && $(Xe, We), T[0] & /*virtualizer*/
      16 && L(
        e,
        "top",
        /*virtualRow*/
        t[19].start + "px"
      ), T[0] & /*virtualizer*/
      16 && L(
        e,
        "height",
        /*virtualRow*/
        t[19].size + "px"
      ), T[0] & /*rows, virtualizer, teamOptions*/
      25 && Ve !== (Ve = /*row*/
      t[20]?.id) && S(e, "data-line-row", Ve);
    },
    d(y) {
      y && ee(e), Ne(D, y), Ne(k, y), Ne(K, y), Ge = !1, Ee(ft);
    }
  };
}
function Mn(t) {
  let e;
  function n(l, o) {
    return (
      /*mode*/
      l[1] === "svelte" ? Cn : Tn
    );
  }
  let s = n(t), i = s(t);
  return {
    c() {
      e = O("div"), i.c(), S(e, "class", "lines-table-root svelte-t914cf");
    },
    m(l, o) {
      te(l, e, o), i.m(e, null);
    },
    p(l, o) {
      s === (s = n(l)) && i ? i.p(l, o) : (i.d(1), i = s(l), i && (i.c(), i.m(e, null)));
    },
    i: P,
    o: P,
    d(l) {
      l && ee(e), i.d();
    }
  };
}
let zn = 42;
function Tt(t) {
  if (!t) return "";
  const e = t.name || t.id || "";
  return t.start && t.end ? (e ? e + " " : "") + "(" + t.start + "–" + t.end + ")" : t.start ? e ? e + " " + t.start : t.start : e;
}
function Ct(t) {
  const e = String(t || "").toUpperCase();
  return e === "RDO" || e === "—" ? "cell-toggle cell-rdo" : e === "BAG" ? "cell-toggle cell-function-duty cell-bag" : e === "PAX" ? "cell-toggle cell-function-duty cell-pax" : "cell-toggle cell-work";
}
function Rn(t, e, n) {
  let { rows: s = [] } = e, { mode: i = "svelte" } = e, { shiftOptions: l = [] } = e, { teamOptions: o = [] } = e, { onInlineEdit: r = null } = e, { onDayToggle: a = null } = e, c, f;
  Jt(() => {
    i === "svelte" && n(4, f = In({
      count: s.length,
      getScrollElement: () => c,
      estimateSize: () => zn,
      overscan: 5,
      getItemKey: (b) => s[b]?.id ?? b
    }));
  });
  function h(b, A, V) {
    r?.({ lineId: b, field: A, value: V });
  }
  function p(b, A) {
    a?.({ lineId: b, dayIndex: A });
  }
  const E = (b, A) => h(b?.id, "team", A.target.value), u = (b, A) => h(b?.id, "lineCode", A.target.value), m = (b, A) => h(b?.id, "shift", A.target.value), g = (b, A) => h(b?.id, "position", A.target.value), _ = (b, A) => h(b?.id, "emp", A.target.value), w = (b, A) => h(b?.id, "sex", A.target.value), I = (b, A) => h(b?.id, "function", A.target.value), M = (b, A) => p(b?.id, A);
  function C(b) {
    Ye[b ? "unshift" : "push"](() => {
      c = b, n(5, c);
    });
  }
  return t.$$set = (b) => {
    "rows" in b && n(0, s = b.rows), "mode" in b && n(1, i = b.mode), "shiftOptions" in b && n(2, l = b.shiftOptions), "teamOptions" in b && n(3, o = b.teamOptions), "onInlineEdit" in b && n(8, r = b.onInlineEdit), "onDayToggle" in b && n(9, a = b.onDayToggle);
  }, t.$$.update = () => {
    t.$$.dirty[0] & /*virtualizer, mode, rows*/
    19 && f && i === "svelte" && f.setOptions({ count: s.length });
  }, [
    s,
    i,
    l,
    o,
    f,
    c,
    h,
    p,
    r,
    a,
    E,
    u,
    m,
    g,
    _,
    w,
    I,
    M,
    C
  ];
}
class Ln extends ln {
  constructor(e) {
    super(), sn(
      this,
      e,
      Rn,
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
function kn(t) {
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
  function i(u, m) {
    const g = String(u), _ = e.state && e.state.functionRotation && e.state.functionRotation[g];
    if (!Array.isArray(_)) return null;
    const w = _[m];
    return w === "BAG" || w === "PAX" ? w : null;
  }
  function l(u, m, g) {
    var _ = String(u);
    for (e.state.functionRotation || (e.state.functionRotation = {}), e.state.functionRotation[_] || (e.state.functionRotation[_] = []); e.state.functionRotation[_].length <= m; ) e.state.functionRotation[_].push(null);
    e.state.functionRotation[_][m] = g;
  }
  function o(u) {
    if (!u) return !1;
    if (u.function === "DFO") return !0;
    const m = u.functionEligible;
    return !!(m && (m.dfo === !0 || m.DFO === !0));
  }
  function r() {
    const u = e.state && Array.isArray(e.state.lines) ? e.state.lines : [], m = typeof e.sortLinesForView == "function" && typeof e.filterLinesForView == "function" ? e.sortLinesForView(e.filterLinesForView(u)) : u, g = e.state && e.state.schedule || {}, _ = typeof e.getRowModels == "function" ? e.getRowModels(m, g, s()) : typeof e.getLineRowModels == "function" ? e.getLineRowModels(s()) : [];
    return Array.isArray(_) ? _ : [];
  }
  function a() {
    return e.teams && Array.isArray(e.teams.teams) ? e.teams.teams : [];
  }
  function c() {
    return e.state && Array.isArray(e.state.shifts) ? e.state.shifts : [];
  }
  function f(u) {
    !u || typeof u.$set != "function" || u.$set({
      rows: r(),
      shiftOptions: c(),
      teamOptions: a()
    });
  }
  function h(u) {
    if (!u) return;
    const m = e.findLineById ? e.findLineById(u.lineId) : null;
    if (!m) return;
    const g = u.field, _ = u.value;
    g === "lineCode" ? m.lineCode = String(_ || "").trim() || m.lineCode : g === "sex" ? m.sex = _ === "F" ? "F" : "M" : g === "function" ? m.function = _ === "DFO" || _ === "PAX" || _ === "BAG" ? _ : "" : g === "emp" || g === "position" ? e.applyLineEmp && e.applyLineEmp(m, _) : g === "shift" ? e.applyLineShift && e.applyLineShift(m, _) : g === "team" && e.setLineTeam && e.setLineTeam(u.lineId, _), e.updateStatus && e.updateStatus("Updated " + (m.lineCode || u.lineId)), E(), (g === "emp" || g === "position" || g === "shift") && e.renderCoverageBars && e.renderCoverageBars(), g === "team" && e.renderTeams && e.renderTeams();
  }
  function p(u) {
    if (!u) return;
    const m = e.findLineById ? e.findLineById(u.lineId) : null, g = Number(u.dayIndex);
    if (!m || !Number.isInteger(g) || g < 0 || g > 6) return;
    const _ = m.id;
    e.state.schedule || (e.state.schedule = {}), e.state.schedule[_] || (e.state.schedule[_] = []), e.state.functionRotation || (e.state.functionRotation = {});
    const w = e.state.schedule[_][g] || "RDO", I = m.function === "BAG", M = o(m);
    if (w !== "WORK")
      e.state.schedule[_][g] = "WORK", I ? l(_, g, "BAG") : M ? l(_, g, "PAX") : l(_, g, null);
    else if (I)
      e.state.schedule[_][g] = "RDO", l(_, g, null);
    else if (M) {
      const C = (typeof e.getRotationDuty == "function" ? e.getRotationDuty(m.id, g) : i(m.id, g)) || "PAX";
      C === "PAX" || !C ? l(_, g, "BAG") : (e.state.schedule[_][g] = "RDO", l(_, g, null));
    } else
      e.state.schedule[_][g] = "RDO", l(_, g, null);
    e.syncRdoDaysFromSchedule && e.syncRdoDaysFromSchedule(m), E(), e.renderCoverageBars && e.renderCoverageBars();
  }
  const E = () => {
    try {
      const u = n._linesTableApp;
      u ? f(u) : n._linesTableApp = new Ln({
        target: n,
        props: {
          rows: r(),
          shiftOptions: c(),
          teamOptions: a(),
          onInlineEdit: h,
          onDayToggle: p
        }
      });
    } catch (u) {
      console.error("lines-table: refresh failed", u);
    }
  };
  E(), document.addEventListener("click", (u) => {
    const m = u.target.closest?.(".tab-btn");
    m && m.dataset.tab === "lines" && E();
  }), ["lines:request-render", "lines:filter-change", "lines:sort-change", "lines:coverage-refresh"].forEach((u) => {
    window.addEventListener(u, E);
  }), n.refresh = E;
}
export {
  kn as initLinesTable
};
