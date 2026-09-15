var Dt = Object.defineProperty;
var Rt = (t, s, e) => s in t ? Dt(t, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : t[s] = e;
var Je = (t, s, e) => Rt(t, typeof s != "symbol" ? s + "" : s, e);
function k() {
}
function Ot(t) {
  return t();
}
function ct() {
  return /* @__PURE__ */ Object.create(null);
}
function ve(t) {
  t.forEach(Ot);
}
function Ze(t) {
  return typeof t == "function";
}
function yt(t, s) {
  return t != t ? s == s : t !== s || t && typeof t == "object" || typeof t == "function";
}
function Wt(t) {
  return Object.keys(t).length === 0;
}
function $t(t, ...s) {
  if (t == null) {
    for (const n of s)
      n(void 0);
    return k;
  }
  const e = t.subscribe(...s);
  return e.unsubscribe ? () => e.unsubscribe() : e;
}
function u(t, s) {
  t.appendChild(s);
}
function ye(t, s, e) {
  t.insertBefore(s, e || null);
}
function Se(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function wt(t, s) {
  for (let e = 0; e < t.length; e += 1)
    t[e] && t[e].d(s);
}
function _(t) {
  return document.createElement(t);
}
function X(t) {
  return document.createTextNode(t);
}
function x() {
  return X(" ");
}
function q(t, s, e, n) {
  return t.addEventListener(s, e, n), () => t.removeEventListener(s, e, n);
}
function p(t, s, e) {
  e == null ? t.removeAttribute(s) : t.getAttribute(s) !== e && t.setAttribute(s, e);
}
function Nt(t) {
  return Array.from(t.childNodes);
}
function ge(t, s) {
  s = "" + s, t.data !== s && (t.data = /** @type {string} */
  s);
}
function A(t, s) {
  t.value = s ?? "";
}
function z(t, s, e, n) {
  e == null ? t.style.removeProperty(s) : t.style.setProperty(s, e, "");
}
let Oe;
function Ee(t) {
  Oe = t;
}
function Vt() {
  if (!Oe) throw new Error("Function called outside component initialization");
  return Oe;
}
function Pt(t) {
  Vt().$$.on_mount.push(t);
}
const _e = [], Ge = [];
let pe = [];
const ut = [], Kt = /* @__PURE__ */ Promise.resolve();
let Qe = !1;
function Bt() {
  Qe || (Qe = !0, Kt.then(Tt));
}
function Ye(t) {
  pe.push(t);
}
const Ue = /* @__PURE__ */ new Set();
let de = 0;
function Tt() {
  if (de !== 0)
    return;
  const t = Oe;
  do {
    try {
      for (; de < _e.length; ) {
        const s = _e[de];
        de++, Ee(s), Ht(s.$$);
      }
    } catch (s) {
      throw _e.length = 0, de = 0, s;
    }
    for (Ee(null), _e.length = 0, de = 0; Ge.length; ) Ge.pop()();
    for (let s = 0; s < pe.length; s += 1) {
      const e = pe[s];
      Ue.has(e) || (Ue.add(e), e());
    }
    pe.length = 0;
  } while (_e.length);
  for (; ut.length; )
    ut.pop()();
  Qe = !1, Ue.clear(), Ee(t);
}
function Ht(t) {
  if (t.fragment !== null) {
    t.update(), ve(t.before_update);
    const s = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, s), t.after_update.forEach(Ye);
  }
}
function qt(t) {
  const s = [], e = [];
  pe.forEach((n) => t.indexOf(n) === -1 ? s.push(n) : e.push(n)), e.forEach((n) => n()), pe = s;
}
const Jt = /* @__PURE__ */ new Set();
function Ut(t, s) {
  t && t.i && (Jt.delete(t), t.i(s));
}
function $e(t) {
  return t?.length !== void 0 ? t : Array.from(t);
}
function Xt(t, s, e) {
  const { fragment: n, after_update: i } = t.$$;
  n && n.m(s, e), Ye(() => {
    const l = t.$$.on_mount.map(Ot).filter(Ze);
    t.$$.on_destroy ? t.$$.on_destroy.push(...l) : ve(l), t.$$.on_mount = [];
  }), i.forEach(Ye);
}
function Gt(t, s) {
  const e = t.$$;
  e.fragment !== null && (qt(e.after_update), ve(e.on_destroy), e.fragment && e.fragment.d(s), e.on_destroy = e.fragment = null, e.ctx = []);
}
function Qt(t, s) {
  t.$$.dirty[0] === -1 && (_e.push(t), Bt(), t.$$.dirty.fill(0)), t.$$.dirty[s / 31 | 0] |= 1 << s % 31;
}
function Yt(t, s, e, n, i, l, o = null, r = [-1]) {
  const a = Oe;
  Ee(t);
  const h = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: l,
    update: k,
    not_equal: i,
    bound: ct(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(s.context || (a ? a.$$.context : [])),
    // everything else
    callbacks: ct(),
    dirty: r,
    skip_bound: !1,
    root: s.target || a.$$.root
  };
  o && o(h.root);
  let d = !1;
  if (h.ctx = e ? e(t, s.props || {}, (c, f, ...S) => {
    const O = S.length ? S[0] : f;
    return h.ctx && i(h.ctx[c], h.ctx[c] = O) && (!h.skip_bound && h.bound[c] && h.bound[c](O), d && Qt(t, c)), f;
  }) : [], h.update(), d = !0, ve(h.before_update), h.fragment = n ? n(h.ctx) : !1, s.target) {
    if (s.hydrate) {
      const c = Nt(s.target);
      h.fragment && h.fragment.l(c), c.forEach(Se);
    } else
      h.fragment && h.fragment.c();
    s.intro && Ut(t.$$.fragment), Xt(t, s.target, s.anchor), Tt();
  }
  Ee(a);
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
    Gt(this, 1), this.$destroy = k;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(s, e) {
    if (!Ze(e))
      return k;
    const n = this.$$.callbacks[s] || (this.$$.callbacks[s] = []);
    return n.push(e), () => {
      const i = n.indexOf(e);
      i !== -1 && n.splice(i, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(s) {
    this.$$set && !Wt(s) && (this.$$.skip_bound = !0, this.$$set(s), this.$$.skip_bound = !1);
  }
}
const es = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(es);
function ts(t) {
  return typeof t == "object" ? t.key : t;
}
function ss(t, s) {
  const e = t.length;
  return new Proxy(t, {
    get(n, i, l) {
      if (typeof i == "string") {
        const o = i.charCodeAt(0);
        if (o >= 48 && o <= 57) {
          const r = +i;
          if (Number.isInteger(r) && r >= 0 && r < e) {
            let a = n[r];
            if (typeof a != "object") {
              const h = s[r * 2];
              a = n[r] = {
                index: r,
                key: a,
                start: h,
                size: s[r * 2 + 1],
                end: h + s[r * 2 + 1],
                lane: 0
              };
            }
            return a;
          }
        }
        if (i === "length") return e;
      }
      return Reflect.get(n, i, l);
    }
  });
}
function fe(t, s, e) {
  let n = e.initialDeps ?? [], i, l = !0;
  function o() {
    var r;
    const a = process.env.NODE_ENV !== "production" && !!e.key && !!((r = e.debug) != null && r.call(e));
    let h = 0;
    a && (h = Date.now());
    const d = t();
    if (!(d.length !== n.length || d.some((S, O) => n[O] !== S)))
      return i;
    n = d;
    let f = 0;
    if (a && (f = Date.now()), i = s(...d), a) {
      const S = Math.round((Date.now() - h) * 100) / 100, O = Math.round((Date.now() - f) * 100) / 100, y = O / 16, E = (I, v) => {
        for (I = String(I); I.length < v; )
          I = " " + I;
        return I;
      };
      console.info(
        `%c⏱ ${E(O, 5)} /${E(S, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * y, 120)
        )}deg 100% 31%);`,
        e?.key
      );
    }
    return e?.onChange && !(l && e.skipInitialOnChange) && e.onChange(i), l = !1, i;
  }
  return o.updateDeps = (r) => {
    n = r;
  }, o;
}
function dt(t, s) {
  if (t === void 0)
    throw new Error("Unexpected undefined");
  return t;
}
const ft = (t, s) => Math.abs(t - s) < 1.01, ns = (t, s, e) => {
  let n;
  return Object.assign(
    function(...i) {
      t.clearTimeout(n), n = t.setTimeout(() => s.apply(this, i), e);
    },
    {
      // The handle is closure-local, so a caller that has already
      // unsubscribed has no way to stop a queued call. Teardown paths use
      // this to drop the pending invocation instead of letting it land.
      cancel: () => {
        t.clearTimeout(n);
      }
    }
  );
};
let be;
const Xe = () => {
  if (be !== void 0) return be;
  if (typeof navigator > "u") return be = !1;
  if (/iP(hone|od|ad)/.test(navigator.userAgent)) return be = !0;
  const t = navigator.maxTouchPoints;
  return be = navigator.platform === "MacIntel" && t !== void 0 && t > 0;
}, mt = (t) => {
  const { offsetWidth: s, offsetHeight: e } = t;
  return { width: s, height: e };
}, is = (t) => t, ls = (t) => {
  const s = Math.max(t.startIndex - t.overscan, 0), n = Math.min(t.endIndex + t.overscan, t.count - 1) - s + 1, i = new Array(n);
  for (let l = 0; l < n; l++)
    i[l] = s + l;
  return i;
}, os = (t, s) => {
  const e = t.scrollElement;
  if (!e)
    return;
  const n = t.targetWindow;
  if (!n)
    return;
  const i = (o) => {
    const { width: r, height: a } = o;
    s({ width: Math.round(r), height: Math.round(a) });
  };
  if (i(mt(e)), !n.ResizeObserver)
    return () => {
    };
  const l = new n.ResizeObserver((o) => {
    const r = () => {
      const a = o[0];
      if (a?.borderBoxSize) {
        const h = a.borderBoxSize[0];
        if (h) {
          i({ width: h.inlineSize, height: h.blockSize });
          return;
        }
      }
      i(mt(e));
    };
    t.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(r) : r();
  });
  return l.observe(e, { box: "border-box" }), () => {
    l.unobserve(e);
  };
}, Ne = {
  passive: !0
}, rs = typeof window > "u" ? !0 : "onscrollend" in window, as = (t, s, e) => {
  const n = t.scrollElement;
  if (!n)
    return;
  const i = t.targetWindow;
  if (!i)
    return;
  const l = t.options.useScrollendEvent && rs;
  let o = 0;
  const r = l ? null : ns(
    i,
    () => s(e(n), !1),
    t.options.isScrollingResetDelay
  ), a = (c) => () => {
    o = e(n), r?.(), s(o, c);
  }, h = a(!0), d = a(!1);
  return n.addEventListener("scroll", h, Ne), l && n.addEventListener("scrollend", d, Ne), () => {
    n.removeEventListener("scroll", h), l && n.removeEventListener("scrollend", d), r?.cancel();
  };
}, hs = (t, s) => as(t, s, (e) => {
  const { horizontal: n, isRtl: i } = t.options;
  return n ? e.scrollLeft * (i && -1 || 1) : e.scrollTop;
}), cs = (t, s, e) => {
  if (e.options.useCachedMeasurements) {
    const n = e.indexFromElement(t), i = e.options.getItemKey(n);
    return e.itemSizeCache.get(i) ?? e.options.estimateSize(n);
  }
  if (s?.borderBoxSize) {
    const n = s.borderBoxSize[0];
    if (n)
      return Math.round(
        n[e.options.horizontal ? "inlineSize" : "blockSize"]
      );
  }
  if (!s) {
    const n = e.indexFromElement(t), i = e.options.getItemKey(n), l = e.itemSizeCache.get(i);
    if (l !== void 0)
      return l;
  }
  return t[e.options.horizontal ? "offsetWidth" : "offsetHeight"];
}, us = (t, {
  adjustments: s = 0,
  behavior: e
}, n) => {
  var i, l;
  (l = (i = n.scrollElement) == null ? void 0 : i.scrollTo) == null || l.call(i, {
    [n.options.horizontal ? "left" : "top"]: t + s,
    behavior: e
  });
}, ds = us;
function fs(t, s, e, n) {
  if (s === 0) return !1;
  const i = n(0), l = /* @__PURE__ */ new Set();
  let o = 0;
  for (; o < t; ) {
    const a = e(o);
    if (a === i) break;
    l.add(a), o++;
  }
  const r = t - o;
  if (r === 0 || r >= s) return !1;
  for (let a = 0; a < r; a++)
    if (n(a) !== e(o + a)) return !1;
  for (let a = r; a < s; a++)
    if (l.has(n(a))) return !1;
  return !0;
}
class ms {
  constructor(s) {
    this.unsubs = [], this.scrollElement = null, this.targetWindow = null, this.isScrolling = !1, this.scrollState = null, this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache = /* @__PURE__ */ new Map(), this.itemSizeCacheVersion = 0, this.laneAssignments = /* @__PURE__ */ new Map(), this.pendingMin = null, this.prevLanes = void 0, this.lanesChangedFlag = !1, this.lanesSettling = !1, this.pendingScrollAnchor = null, this.scrollRect = null, this.scrollOffset = null, this.scrollDirection = null, this.scrollAdjustments = 0, this._iosDeferredAdjustment = 0, this._iosTouching = !1, this._iosJustTouchEnded = !1, this._iosTouchEndTimerId = null, this._intendedScrollOffset = null, this._clampedAdjustment = null, this.elementsCache = /* @__PURE__ */ new Map(), this.now = () => {
      var e, n, i;
      return ((i = (n = (e = this.targetWindow) == null ? void 0 : e.performance) == null ? void 0 : n.now) == null ? void 0 : i.call(n)) ?? Date.now();
    }, this.observer = /* @__PURE__ */ (() => {
      let e = null;
      const n = () => e || (!this.targetWindow || !this.targetWindow.ResizeObserver ? null : e = new this.targetWindow.ResizeObserver((i) => {
        i.forEach((l) => {
          const o = () => {
            const r = l.target, a = this.indexFromElement(r);
            if (!r.isConnected) {
              this.observer.unobserve(r);
              for (const [h, d] of this.elementsCache)
                if (d === r) {
                  this.elementsCache.delete(h);
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
          (i = n()) == null || i.disconnect(), e = null;
        },
        observe: (i) => {
          var l;
          return (l = n()) == null ? void 0 : l.observe(i, { box: "border-box" });
        },
        unobserve: (i) => {
          var l;
          return (l = n()) == null ? void 0 : l.unobserve(i);
        }
      };
    })(), this.range = null, this.setOptions = (e) => {
      var n;
      const i = {
        debug: !1,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: !1,
        getItemKey: is,
        rangeExtractor: ls,
        onChange: () => {
        },
        measureElement: cs,
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
      for (const c in e) {
        const f = e[c];
        f !== void 0 && (i[c] = f);
      }
      const l = this.options;
      let o = null, r = null, a = !1;
      if (l !== void 0 && l.enabled && i.enabled && i.anchorTo === "end" && this.scrollElement !== null) {
        const c = l.count, f = i.count, S = this.getMeasurements(), O = ((n = this._singleLaneMeasurements) == null ? void 0 : n.items) ?? S, y = (C) => ts(O[C]), E = c > 0 ? y(0) : null, I = c > 0 ? y(c - 1) : null;
        if (f !== c || c > 0 && f > 0 && (i.getItemKey(0) !== E || i.getItemKey(f - 1) !== I)) {
          a = !0;
          const C = c > 0 ? this.getVirtualItemForOffset(this.getScrollOffset()) ?? S[0] : null;
          C && (o = [C.key, this.getScrollOffset() - C.start]);
          const m = i.followOnAppend === !0 ? "auto" : i.followOnAppend || null;
          m && f > 0 && this.isAtEnd(l.scrollEndThreshold) && (c === 0 || i.getItemKey(f - 1) !== I) && (f > c || fs(
            c,
            f,
            y,
            i.getItemKey
          )) && (r = m);
        }
      }
      this.options = i, a && (this.pendingMin = 0, this.itemSizeCacheVersion++);
      let h = !1, d = 0;
      if (o && this.scrollOffset !== null) {
        const [c, f] = o, S = this.getMeasurements(), { count: O, getItemKey: y } = this.options;
        let E = 0;
        for (; E < O && y(E) !== c; )
          E++;
        if (E < O) {
          const I = S[E];
          if (I) {
            const v = Math.max(0, I.start + f);
            !r && v !== this.scrollOffset && (d = v - this.scrollOffset, this.scrollOffset = v, h = !0);
          }
        }
      }
      (h || r) && (this.pendingScrollAnchor = [
        h ? o[0] : null,
        h ? o[1] : 0,
        r,
        d
      ]);
    }, this.notify = (e) => {
      var n, i;
      (i = (n = this.options).onChange) == null || i.call(n, this, e);
    }, this.maybeNotify = fe(
      () => (this.calculateRange(), [
        this.isScrolling,
        this.range ? this.range.startIndex : null,
        this.range ? this.range.endIndex : null
      ]),
      (e) => {
        this.notify(e);
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
      this.unsubs.filter(Boolean).forEach((e) => e()), this.unsubs = [], this.observer.disconnect(), this.rafId != null && this.targetWindow && (this.targetWindow.cancelAnimationFrame(this.rafId), this.rafId = null), this.scrollState = null, this.isScrolling = !1, this.scrollDirection = null, this._iosDeferredAdjustment = 0, this._iosTouching = !1, this._iosJustTouchEnded = !1, this._clampedAdjustment = null, this.scrollElement = null, this.targetWindow = null;
    }, this._didMount = () => () => {
      this.cleanup();
    }, this._willUpdate = () => {
      var e, n;
      const i = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== i) {
        if (this.cleanup(), !i) {
          this.maybeNotify();
          return;
        }
        if (this.scrollElement = i, this.scrollElement && "ownerDocument" in this.scrollElement ? this.targetWindow = this.scrollElement.ownerDocument.defaultView : this.targetWindow = ((e = this.scrollElement) == null ? void 0 : e.window) ?? null, this.elementsCache.forEach((o) => {
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
            this._iosTouching = !1, !(!Xe() || this.targetWindow == null) && (this._iosJustTouchEnded = !0, this._iosTouchEndTimerId = this.targetWindow.setTimeout(() => {
              this._iosJustTouchEnded = !1, this._iosTouchEndTimerId = null, this._flushIosDeferredIfReady();
            }, 150));
          };
          o.addEventListener(
            "touchstart",
            r,
            Ne
          ), o.addEventListener(
            "touchend",
            a,
            Ne
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
        const [o, r, a, h] = l;
        o !== null && !a && (Xe() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded) ? h !== 0 && (this._iosDeferredAdjustment += h) : ((n = this.scrollState) == null ? void 0 : n.behavior) === "smooth" && !ft(
          this.getScrollOffset() - h,
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
      const { target: e, maxAtWrite: n } = this._clampedAdjustment, i = this.getMaxScrollOffset();
      i > n + 0.5 && (this._clampedAdjustment = e > i + 0.5 ? { target: e, maxAtWrite: i } : null, this._scrollToOffset(e, {
        adjustments: void 0,
        behavior: void 0
      }));
    }, this._flushIosDeferredIfReady = () => {
      if (this._iosDeferredAdjustment === 0 || this.isScrolling || this._iosTouching || this._iosJustTouchEnded) return;
      const e = this.getScrollOffset(), n = this.getMaxScrollOffset();
      if (e < 0 || e > n) return;
      if (this._iosDeferredAdjustment < 0 && e >= n - 1) {
        this._iosDeferredAdjustment = 0;
        return;
      }
      const i = this._iosDeferredAdjustment;
      this._iosDeferredAdjustment = 0, this._scrollToOffset(e, {
        adjustments: this.scrollAdjustments += i,
        behavior: void 0
      });
    }, this.rafId = null, this.getSize = () => this.options.enabled ? (this.scrollRect = this.scrollRect ?? this.options.initialRect, this.scrollRect[this.options.horizontal ? "width" : "height"]) : (this.scrollRect = null, 0), this.getScrollOffset = () => this.options.enabled ? (this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset == "function" ? this.options.initialOffset() : this.options.initialOffset), this.scrollOffset) : (this.scrollOffset = null, 0), this.getMeasurementOptions = fe(
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
      (e, n, i, l, o, r, a, h) => (this.prevLanes !== void 0 && this.prevLanes !== r && (this.lanesChangedFlag = !0), this.prevLanes = r, this.pendingMin = null, {
        count: e,
        paddingStart: n,
        scrollMargin: i,
        getItemKey: l,
        enabled: o,
        lanes: r,
        laneAssignmentMode: a,
        gap: h
      }),
      {
        key: !1
      }
    ), this.isIndexInRange = (e) => e >= 0 && e < this.options.count, this.getMeasurements = fe(
      () => [this.getMeasurementOptions(), this.itemSizeCacheVersion],
      ({
        count: e,
        paddingStart: n,
        scrollMargin: i,
        getItemKey: l,
        enabled: o,
        lanes: r,
        laneAssignmentMode: a,
        gap: h
      }, d) => {
        var c;
        const f = this.itemSizeCache;
        if (!o)
          return this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), [];
        if (this.laneAssignments.size > e)
          for (const v of this.laneAssignments.keys())
            v >= e && this.laneAssignments.delete(v);
        this.lanesChangedFlag && (this.lanesChangedFlag = !1, this.lanesSettling = !0, this.measurementsCache = [], this._singleLaneMeasurements = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), this.pendingMin = null), this.measurementsCache.length === 0 && !this.lanesSettling && (this.measurementsCache = this.options.initialMeasurementsCache, this.measurementsCache.forEach((v) => {
          this.itemSizeCache.set(v.key, v.size);
        }));
        const S = this.lanesSettling ? 0 : this.pendingMin ?? 0;
        if (this.pendingMin = null, this.lanesSettling && this.measurementsCache.length === e && (this.lanesSettling = !1), r === 1) {
          const v = e * 2;
          let b = (c = this._singleLaneMeasurements) == null ? void 0 : c.flat;
          if (!b || b.length < v) {
            const T = new Float64Array(v);
            b && S > 0 && T.set(b.subarray(0, S * 2)), b = T;
          }
          const C = S === 0 ? new Array(e) : this._singleLaneMeasurements.items.slice();
          let m;
          if (S === 0)
            m = n + i;
          else {
            const T = S - 1;
            m = b[T * 2] + b[T * 2 + 1] + h;
          }
          for (let T = S; T < e; T++) {
            const B = l(T);
            C[T] = B;
            const $ = f.get(B), N = typeof $ == "number" ? $ : this.options.estimateSize(T);
            b[T * 2] = m, b[T * 2 + 1] = N, m += N + h;
          }
          this._singleLaneMeasurements = { flat: b, items: C };
          const g = ss(C, b);
          return this.measurementsCache = g, g;
        }
        const O = this.measurementsCache.slice(0, S), y = new Array(r).fill(
          void 0
        ), E = new Float64Array(r);
        let I = 0;
        for (let v = 0; v < S; v++) {
          const b = O[v];
          b && (y[b.lane] === void 0 && I++, y[b.lane] = v, E[b.lane] = b.end);
        }
        for (let v = S; v < e; v++) {
          const b = l(v), C = this.laneAssignments.get(v);
          let m, g;
          const T = a === "estimate" || f.has(b);
          if (C !== void 0 && this.options.lanes > 1) {
            m = C;
            const K = y[m], V = K !== void 0 ? O[K] : void 0;
            g = V ? V.end + h : n + i;
          } else if (I === r) {
            let K = 0, V = E[0], J = y[0];
            for (let F = 1; F < r; F++) {
              const U = E[F];
              (U < V || U === V && y[F] < J) && (K = F, V = U, J = y[F]);
            }
            m = K, g = V + h, T && this.laneAssignments.set(v, m);
          } else
            m = v % this.options.lanes, g = n + i, T && this.laneAssignments.set(v, m);
          const B = f.get(b), $ = typeof B == "number" ? B : this.options.estimateSize(v), N = g + $;
          O[v] = {
            index: v,
            start: g,
            size: $,
            end: N,
            key: b,
            lane: m
          }, y[m] === void 0 && I++, y[m] = v, E[m] = N;
        }
        return this.measurementsCache = O, O;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getMeasurements",
        debug: () => this.options.debug
      }
    ), this.calculateRange = fe(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (e, n, i, l) => e.length === 0 || n === 0 ? (this.range = null, null) : (this.range = _s(
        e,
        n,
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
    ), this.getVirtualIndexes = fe(
      () => {
        let e = null, n = null;
        const i = this.calculateRange();
        return i && (e = i.startIndex, n = i.endIndex), this.maybeNotify.updateDeps([this.isScrolling, e, n]), [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          e,
          n
        ];
      },
      (e, n, i, l, o) => l === null || o === null ? [] : e({
        startIndex: l,
        endIndex: o,
        overscan: n,
        count: i
      }),
      {
        key: process.env.NODE_ENV !== "production" && "getVirtualIndexes",
        debug: () => this.options.debug
      }
    ), this.indexFromElement = (e) => {
      const n = this.options.indexAttribute, i = e.getAttribute(n);
      return i ? parseInt(i, 10) : (console.warn(
        `Missing attribute name '${n}={index}' on measured element.`
      ), -1);
    }, this.shouldMeasureDuringScroll = (e) => {
      var n;
      if (!this.scrollState || this.scrollState.behavior !== "smooth")
        return !0;
      const i = this.scrollState.index ?? ((n = this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)) == null ? void 0 : n.index);
      if (i !== void 0 && this.range) {
        const l = Math.max(
          this.options.overscan,
          Math.ceil((this.range.endIndex - this.range.startIndex) / 2)
        ), o = Math.max(0, i - l), r = Math.min(
          this.options.count - 1,
          i + l
        );
        return e >= o && e <= r;
      }
      return !0;
    }, this.measureElement = (e) => {
      if (!e) {
        this.elementsCache.forEach((o, r) => {
          o.isConnected || (this.observer.unobserve(o), this.elementsCache.delete(r));
        });
        return;
      }
      const n = this.indexFromElement(e);
      if (!this.isIndexInRange(n)) return;
      const i = this.options.getItemKey(n), l = this.elementsCache.get(i);
      l !== e && (l && this.observer.unobserve(l), this.observer.observe(e), this.elementsCache.set(i, e)), (!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(n) && this.resizeItem(n, this.options.measureElement(e, void 0, this));
    }, this.resizeItem = (e, n) => {
      var i, l, o;
      if (!this.isIndexInRange(e)) return;
      let r, a, h;
      const d = (i = this._singleLaneMeasurements) == null ? void 0 : i.flat;
      if (this.options.lanes === 1 && d != null)
        h = this.options.getItemKey(e), a = d[e * 2], r = d[e * 2 + 1];
      else {
        const S = this.measurementsCache[e];
        if (!S) return;
        h = S.key, a = S.start, r = S.size;
      }
      const c = this.itemSizeCache.get(h) ?? r, f = n - c;
      if (f !== 0) {
        const S = this.options.anchorTo === "end" && ((l = this.scrollState) == null ? void 0 : l.behavior) !== "smooth" && this.getVirtualDistanceFromEnd() <= this.options.scrollEndThreshold, O = S ? this.getTotalSize() : 0, y = this.getScrollOffset() + this.scrollAdjustments, I = !this.itemSizeCache.has(h) ? (
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
          a + c <= y && this.scrollDirection !== "backward"
        ), v = ((o = this.scrollState) == null ? void 0 : o.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(
          // The callback expects a VirtualItem; build one lazily only
          // when the consumer actually supplied a custom predicate.
          this.measurementsCache[e] ?? {
            index: e,
            key: h,
            start: a,
            size: r,
            end: a + r,
            lane: 0
          },
          f,
          this
        ) : I);
        (this.pendingMin === null || e < this.pendingMin) && (this.pendingMin = e), this.itemSizeCache.set(h, n), this.itemSizeCacheVersion++;
        let b = !1;
        S ? b = this.applyScrollAdjustment(
          this.getTotalSize() - O
        ) : v && (b = this.applyScrollAdjustment(f)), this.notify(b), this._retryClampedAdjustment();
      }
    }, this.getVirtualItems = fe(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (e, n) => {
        const i = [];
        for (let l = 0, o = e.length; l < o; l++) {
          const r = e[l], a = n[r];
          i.push(a);
        }
        return i;
      },
      {
        key: process.env.NODE_ENV !== "production" && "getVirtualItems",
        debug: () => this.options.debug
      }
    ), this.getVirtualItemForOffset = (e) => {
      var n;
      const i = this.getMeasurements();
      if (i.length === 0)
        return;
      const l = (n = this._singleLaneMeasurements) == null ? void 0 : n.flat, o = this.options.lanes === 1 && l != null, r = It(
        0,
        i.length - 1,
        o ? (a) => l[a * 2] : (a) => dt(i[a]).start,
        e
      );
      return dt(i[r]);
    }, this.getMaxScrollOffset = () => {
      if (!this.scrollElement) return 0;
      if ("scrollHeight" in this.scrollElement)
        return this.options.horizontal ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth : this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
      {
        const e = this.scrollElement.document.documentElement;
        return this.options.horizontal ? e.scrollWidth - this.scrollElement.innerWidth : e.scrollHeight - this.scrollElement.innerHeight;
      }
    }, this.getVirtualDistanceFromEnd = () => Math.max(
      this.getTotalSize() - this.getSize() - this.getScrollOffset(),
      0
    ), this.getDistanceFromEnd = () => Math.max(this.getMaxScrollOffset() - this.getScrollOffset(), 0), this.isAtEnd = (e = this.options.scrollEndThreshold) => this.getDistanceFromEnd() <= e, this.getOffsetForAlignment = (e, n, i = 0) => {
      if (!this.scrollElement) return 0;
      const l = this.getSize(), o = this.getScrollOffset();
      n === "auto" && (n = e >= o + l ? "end" : "start"), n === "center" ? e += (i - l) / 2 : n === "end" && (e -= l);
      const r = this.getMaxScrollOffset();
      return Math.max(Math.min(r, e), 0);
    }, this.getOffsetForIndex = (e, n = "auto") => {
      e = Math.max(0, Math.min(e, this.options.count - 1));
      const i = this.getSize(), l = this.getScrollOffset(), o = this.measurementsCache[e];
      if (!o) return;
      if (n === "auto")
        if (o.end >= l + i - this.options.scrollPaddingEnd)
          n = "end";
        else if (o.start <= l + this.options.scrollPaddingStart)
          n = "start";
        else
          return [l, n];
      if (n === "end" && e === this.options.count - 1)
        return [this.getMaxScrollOffset(), n];
      const r = n === "end" ? o.end + this.options.scrollPaddingEnd : o.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(r, n, o.size),
        n
      ];
    }, this.scrollToOffset = (e, { align: n = "start", behavior: i = "auto" } = {}) => {
      this._iosDeferredAdjustment = 0;
      const l = this.getOffsetForAlignment(e, n), o = this.now();
      this.scrollState = {
        index: null,
        align: n,
        behavior: i,
        startedAt: o,
        lastTargetOffset: l,
        stableFrames: 0
      }, this._scrollToOffset(l, { adjustments: void 0, behavior: i }), this.scheduleScrollReconcile();
    }, this.scrollToIndex = (e, {
      align: n = "auto",
      behavior: i = "auto"
    } = {}) => {
      this._iosDeferredAdjustment = 0, e = Math.max(0, Math.min(e, this.options.count - 1));
      const l = this.getOffsetForIndex(e, n);
      if (!l)
        return;
      const [o, r] = l, a = this.now();
      this.scrollState = {
        index: e,
        align: r,
        behavior: i,
        startedAt: a,
        lastTargetOffset: o,
        stableFrames: 0
      }, this._scrollToOffset(o, { adjustments: void 0, behavior: i }), this.scheduleScrollReconcile();
    }, this.scrollBy = (e, { behavior: n = "auto" } = {}) => {
      const i = this.getScrollOffset() + e, l = this.now();
      this.scrollState = {
        index: null,
        align: "start",
        behavior: n,
        startedAt: l,
        lastTargetOffset: i,
        stableFrames: 0
      }, this._scrollToOffset(i, { adjustments: void 0, behavior: n }), this.scheduleScrollReconcile();
    }, this.scrollToEnd = ({ behavior: e = "auto" } = {}) => {
      if (this.options.count > 0) {
        this.scrollToIndex(this.options.count - 1, {
          align: "end",
          behavior: e
        });
        return;
      }
      this.scrollToOffset(Math.max(this.getTotalSize() - this.getSize(), 0), {
        behavior: e
      });
    }, this.getTotalSize = () => {
      var e, n;
      const i = this.getMeasurements();
      let l;
      if (i.length === 0)
        l = this.options.paddingStart;
      else if (this.options.lanes === 1) {
        const o = i.length - 1, r = (e = this._singleLaneMeasurements) == null ? void 0 : e.flat;
        r != null ? l = r[o * 2] + r[o * 2 + 1] : l = ((n = i[o]) == null ? void 0 : n.end) ?? 0;
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
      const e = [];
      if (this.itemSizeCache.size === 0) return e;
      const n = this.getMeasurements();
      for (const i of n)
        i && this.itemSizeCache.has(i.key) && e.push({
          index: i.index,
          key: i.key,
          start: i.start,
          size: i.size,
          end: i.end,
          lane: i.lane
        });
      return e;
    }, this._scrollToOffset = (e, {
      adjustments: n,
      behavior: i
    }) => {
      this._intendedScrollOffset = e + (n ?? 0), this.options.scrollToFn(e, { behavior: i, adjustments: n }, this);
    }, this.measure = () => {
      this.pendingMin = null, this.itemSizeCache.clear(), this.laneAssignments.clear(), this.itemSizeCacheVersion++, this.notify(!1);
    }, this.setOptions(s);
  }
  // Returns `true` when it performed a synchronous `scrollTop` write this
  // tick, `false` when the delta was zero or the write was deferred (iOS).
  // `resizeItem` uses that to decide whether the follow-up `notify` must be
  // synchronous so the grown transforms commit in the same paint (#1227).
  applyScrollAdjustment(s, e) {
    if (s === 0) return !1;
    if (process.env.NODE_ENV !== "production" && this.options.debug && console.info("correction", s), Xe() && (this.isScrolling || this._iosTouching || this._iosJustTouchEnded))
      return this._iosDeferredAdjustment += s, !1;
    {
      const n = this.getScrollOffset() + this.scrollAdjustments + s, i = this.scrollElement, l = i !== null && ("scrollHeight" in i || "document" in i) ? this.getMaxScrollOffset() : null;
      return this._clampedAdjustment = l !== null && n > l + 0.5 ? { target: n, maxAtWrite: l } : null, this._scrollToOffset(this.getScrollOffset(), {
        adjustments: this.scrollAdjustments += s,
        behavior: e
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
    const n = this.scrollState.index != null ? this.getOffsetForIndex(this.scrollState.index, this.scrollState.align) : void 0, i = n ? n[0] : this.scrollState.lastTargetOffset, l = 1, o = i !== this.scrollState.lastTargetOffset;
    if (!o && ft(i, this.getScrollOffset())) {
      if (this.scrollState.stableFrames++, this.scrollState.stableFrames >= l) {
        this.getScrollOffset() !== i && this._scrollToOffset(i, {
          adjustments: void 0,
          behavior: "auto"
        }), this.scrollState = null;
        return;
      }
    } else if (this.scrollState.stableFrames = 0, o) {
      const r = this.getSize() || 600, a = Math.abs(i - this.getScrollOffset()), h = this.scrollState.behavior === "smooth" && a > r;
      this.scrollState.lastTargetOffset = i, h || (this.scrollState.behavior = "auto"), this._scrollToOffset(i, {
        adjustments: void 0,
        behavior: h ? "smooth" : "auto"
      });
    }
    this.scheduleScrollReconcile();
  }
}
const It = (t, s, e, n) => {
  for (; t <= s; ) {
    const i = (t + s) / 2 | 0, l = e(i);
    if (l < n)
      t = i + 1;
    else if (l > n)
      s = i - 1;
    else
      return i;
  }
  return t > 0 ? t - 1 : 0;
};
function gs(t, s, e) {
  let n = 0;
  for (; n <= s; ) {
    const i = (n + s) / 2 | 0, l = t[i * 2];
    if (l < e)
      n = i + 1;
    else if (l > e)
      s = i - 1;
    else
      return i;
  }
  return n > 0 ? n - 1 : 0;
}
function _s(t, s, e, n, i) {
  const l = t.length - 1;
  if (t.length <= n)
    return { startIndex: 0, endIndex: l };
  if (n === 1 && i !== null) {
    const h = gs(
      i,
      l,
      e
    );
    let d = h;
    const c = e + s;
    for (; d < l && i[d * 2] + i[d * 2 + 1] < c; )
      d++;
    return { startIndex: h, endIndex: d };
  }
  let r = It(0, l, (h) => t[h].start, e), a = r;
  if (n === 1)
    for (; a < l && t[a].end < e + s; )
      a++;
  else if (n > 1) {
    const h = Array(n).fill(0);
    for (; a < l && h.some((c) => c < e + s); ) {
      const c = t[a];
      h[c.lane] = c.end, a++;
    }
    const d = Array(n).fill(e + s);
    for (; r >= 0 && d.some((c) => c >= e); ) {
      const c = t[r];
      d[c.lane] = c.start, r--;
    }
    r = Math.max(0, r - r % n), a = Math.min(l, a + (n - 1 - a % n));
  }
  return { startIndex: r, endIndex: a };
}
const me = [];
function ps(t, s) {
  return {
    subscribe: At(t, s).subscribe
  };
}
function At(t, s = k) {
  let e;
  const n = /* @__PURE__ */ new Set();
  function i(r) {
    if (yt(t, r) && (t = r, e)) {
      const a = !me.length;
      for (const h of n)
        h[1](), me.push(h, t);
      if (a) {
        for (let h = 0; h < me.length; h += 2)
          me[h][0](me[h + 1]);
        me.length = 0;
      }
    }
  }
  function l(r) {
    i(r(t));
  }
  function o(r, a = k) {
    const h = [r, a];
    return n.add(h), n.size === 1 && (e = s(i, l) || k), r(t), () => {
      n.delete(h), n.size === 0 && e && (e(), e = null);
    };
  }
  return { set: i, update: l, subscribe: o };
}
function vs(t, s, e) {
  const n = !Array.isArray(t), i = n ? [t] : t;
  if (!i.every(Boolean))
    throw new Error("derived() expects stores as input, got a falsy value");
  const l = s.length < 2;
  return ps(e, (o, r) => {
    let a = !1;
    const h = [];
    let d = 0, c = k;
    const f = () => {
      if (d)
        return;
      c();
      const O = s(n ? h[0] : h, o, r);
      l ? o(O) : c = Ze(O) ? O : k;
    }, S = i.map(
      (O, y) => $t(
        O,
        (E) => {
          h[y] = E, d &= ~(1 << y), a && f();
        },
        () => {
          d |= 1 << y;
        }
      )
    );
    return a = !0, f(), function() {
      ve(S), c(), a = !1;
    };
  });
}
function Ss(t) {
  const s = new ms(t), e = s.setOptions;
  let n;
  const i = (l) => {
    const o = {
      ...s.options,
      ...l,
      onChange: l.onChange
    };
    e({
      ...o,
      onChange: (r, a) => {
        n.set(r), o.onChange?.(r, a);
      }
    }), s._willUpdate(), n.set(s);
  };
  return n = At(s, () => (i(t), s._didMount())), vs(n, (l) => Object.assign(l, { setOptions: i }));
}
function bs(t) {
  return Ss({
    observeElementRect: os,
    observeElementOffset: hs,
    scrollToFn: ds,
    ...t
  });
}
function gt(t, s, e) {
  const n = t.slice();
  n[18] = s[e];
  const i = (
    /*rows*/
    n[0][
      /*virtualRow*/
      n[18].index
    ]
  );
  return n[19] = i, n;
}
function _t(t, s, e) {
  const n = t.slice();
  return n[22] = s[e], n;
}
function Es(t) {
  let s;
  return {
    c() {
      s = _("div"), s.textContent = "Classic Lines mode active", p(s, "class", "muted");
    },
    m(e, n) {
      ye(e, s, n);
    },
    p: k,
    d(e) {
      e && Se(s);
    }
  };
}
function Os(t) {
  let s, e, n, i, l, o, r, a = $e(
    /*virtualizer*/
    t[3]?.getVirtualItems() ?? []
  ), h = [];
  for (let d = 0; d < a.length; d += 1)
    h[d] = vt(gt(t, a, d));
  return {
    c() {
      s = _("div"), e = _("table"), n = _("thead"), n.innerHTML = '<tr><th class="svelte-1j5i27r">Team</th> <th class="svelte-1j5i27r">Line</th> <th class="svelte-1j5i27r">Shift</th> <th class="svelte-1j5i27r">Start</th> <th class="svelte-1j5i27r">End</th> <th class="svelte-1j5i27r">Position</th> <th class="svelte-1j5i27r">Emp</th> <th class="svelte-1j5i27r">Sex</th> <th class="svelte-1j5i27r">Function</th> <th class="svelte-1j5i27r">RDOs</th> <th class="svelte-1j5i27r">Paid</th> <th class="svelte-1j5i27r">Sun</th> <th class="svelte-1j5i27r">Mon</th> <th class="svelte-1j5i27r">Tue</th> <th class="svelte-1j5i27r">Wed</th> <th class="svelte-1j5i27r">Thu</th> <th class="svelte-1j5i27r">Fri</th> <th class="svelte-1j5i27r">Sat</th> <th class="svelte-1j5i27r">Hours</th></tr>', i = x(), l = _("tbody");
      for (let d = 0; d < h.length; d += 1)
        h[d].c();
      o = x(), r = _("div"), z(l, "position", "relative"), z(l, "height", "0"), z(
        r,
        "height",
        /*virtualizer*/
        (t[3]?.getTotalSize() ?? 0) + "px"
      ), p(e, "class", "data-table lines-editable svelte-1j5i27r"), z(e, "width", "max-content"), z(e, "min-width", "1100px"), p(s, "class", "lines-virtual-root svelte-1j5i27r"), z(s, "height", "100%"), z(s, "overflow", "auto"), z(s, "position", "relative");
    },
    m(d, c) {
      ye(d, s, c), u(s, e), u(e, n), u(e, i), u(e, l);
      for (let f = 0; f < h.length; f += 1)
        h[f] && h[f].m(l, null);
      u(e, o), u(e, r), t[16](s);
    },
    p(d, c) {
      if (c & /*virtualizer, rows, getFunctionClass, handleDayToggle, getRdoText, handleInlineEdit, getShiftLabel*/
      25) {
        a = $e(
          /*virtualizer*/
          d[3]?.getVirtualItems() ?? []
        );
        let f;
        for (f = 0; f < a.length; f += 1) {
          const S = gt(d, a, f);
          h[f] ? h[f].p(S, c) : (h[f] = vt(S), h[f].c(), h[f].m(l, null));
        }
        for (; f < h.length; f += 1)
          h[f].d(1);
        h.length = a.length;
      }
      c & /*virtualizer*/
      8 && z(
        r,
        "height",
        /*virtualizer*/
        (d[3]?.getTotalSize() ?? 0) + "px"
      );
    },
    d(d) {
      d && Se(s), wt(h, d), t[16](null);
    }
  };
}
function pt(t) {
  let s, e = (
    /*row*/
    (t[19]?.days?.find(a)?.label || "RDO") + ""
  ), n, i, l, o, r;
  function a(...c) {
    return (
      /*func*/
      t[13](
        /*day*/
        t[22],
        ...c
      )
    );
  }
  function h(...c) {
    return (
      /*func_1*/
      t[14](
        /*day*/
        t[22],
        ...c
      )
    );
  }
  function d() {
    return (
      /*click_handler*/
      t[15](
        /*row*/
        t[19],
        /*day*/
        t[22]
      )
    );
  }
  return {
    c() {
      s = _("td"), n = X(e), p(s, "class", i = "cell-toggle " + Et(
        /*row*/
        t[19]?.days?.find(h)?.duty
      ) + " svelte-1j5i27r"), p(s, "data-line-id", l = /*row*/
      t[19]?.id), p(
        s,
        "data-day",
        /*day*/
        t[22]
      );
    },
    m(c, f) {
      ye(c, s, f), u(s, n), o || (r = q(s, "click", d), o = !0);
    },
    p(c, f) {
      t = c, f & /*rows, virtualizer*/
      9 && e !== (e = /*row*/
      (t[19]?.days?.find(a)?.label || "RDO") + "") && ge(n, e), f & /*rows, virtualizer*/
      9 && i !== (i = "cell-toggle " + Et(
        /*row*/
        t[19]?.days?.find(h)?.duty
      ) + " svelte-1j5i27r") && p(s, "class", i), f & /*rows, virtualizer*/
      9 && l !== (l = /*row*/
      t[19]?.id) && p(s, "data-line-id", l);
    },
    d(c) {
      c && Se(s), o = !1, r();
    }
  };
}
function vt(t) {
  let s, e, n, i, l, o, r, a, h, d, c, f, S, O, y, E, I, v, b, C, m, g, T, B, $, N = (
    /*getShiftLabel*/
    t[4](
      /*row*/
      t[19]?.shiftId
    ) + ""
  ), K, V, J, F = (
    /*getShiftLabel*/
    t[4](
      /*row*/
      t[19]?.shiftId
    ) + ""
  ), U, et, we, D, G, Q, Y, Z, Te, tt, Ie, L, ee, te, se, ne, ie, Ae, st, Ce, P, le, oe, re, Me, nt, je, R, ae, he, ce, ue, ze, it, xe, Le = bt(
    /*row*/
    t[19]?.rdoDays,
    /*row*/
    t[19]?.rdoHard
  ) + "", Ve, lt, ke, Fe = (
    /*row*/
    t[19]?.paid + ""
  ), Pe, ot, Ke, De, Re = (
    /*row*/
    t[19]?.hours + ""
  ), Be, rt, We, He, at;
  function Mt(...w) {
    return (
      /*change_handler*/
      t[6](
        /*row*/
        t[19],
        ...w
      )
    );
  }
  function jt(...w) {
    return (
      /*input_handler*/
      t[7](
        /*row*/
        t[19],
        ...w
      )
    );
  }
  function zt(...w) {
    return (
      /*change_handler_1*/
      t[8](
        /*row*/
        t[19],
        ...w
      )
    );
  }
  function xt(...w) {
    return (
      /*change_handler_2*/
      t[9](
        /*row*/
        t[19],
        ...w
      )
    );
  }
  function Lt(...w) {
    return (
      /*change_handler_3*/
      t[10](
        /*row*/
        t[19],
        ...w
      )
    );
  }
  function kt(...w) {
    return (
      /*change_handler_4*/
      t[11](
        /*row*/
        t[19],
        ...w
      )
    );
  }
  function Ft(...w) {
    return (
      /*change_handler_5*/
      t[12](
        /*row*/
        t[19],
        ...w
      )
    );
  }
  let qe = $e(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]), W = [];
  for (let w = 0; w < 7; w += 1)
    W[w] = pt(_t(t, qe, w));
  return {
    c() {
      s = _("tr"), e = _("td"), n = _("select"), i = _("option"), i.textContent = "—", l = _("option"), l.textContent = "T1", o = _("option"), o.textContent = "T2", r = _("option"), r.textContent = "T3", h = x(), d = _("td"), c = _("input"), O = x(), y = _("td"), E = _("select"), I = _("option"), I.textContent = "—", v = _("option"), v.textContent = "S1 (03:30–12:00)", b = _("option"), b.textContent = "S2 (04:00–12:30)", C = _("option"), C.textContent = "S3 (12:00–20:30)", m = _("option"), m.textContent = "S4 (14:30–23:00)", g = _("option"), g.textContent = "S5 (10:30–20:00)", B = x(), $ = _("td"), K = X(N), V = x(), J = _("td"), U = X(F), et = x(), we = _("td"), D = _("select"), G = _("option"), G.textContent = "—", Q = _("option"), Q.textContent = "TSO", Y = _("option"), Y.textContent = "LTSO", Z = _("option"), Z.textContent = "STSO", tt = x(), Ie = _("td"), L = _("select"), ee = _("option"), ee.textContent = "—", te = _("option"), te.textContent = "FT", se = _("option"), se.textContent = "PT", ne = _("option"), ne.textContent = "LTSO", ie = _("option"), ie.textContent = "STSO", st = x(), Ce = _("td"), P = _("select"), le = _("option"), le.textContent = "—", oe = _("option"), oe.textContent = "M", re = _("option"), re.textContent = "F", nt = x(), je = _("td"), R = _("select"), ae = _("option"), ae.textContent = "—", he = _("option"), he.textContent = "DFO", ce = _("option"), ce.textContent = "BAG", ue = _("option"), ue.textContent = "PAX", it = x(), xe = _("td"), Ve = X(Le), lt = x(), ke = _("td"), Pe = X(Fe), ot = x();
      for (let w = 0; w < 7; w += 1)
        W[w].c();
      Ke = x(), De = _("td"), Be = X(Re), rt = x(), i.__value = "", A(i, i.__value), l.__value = "T1", A(l, l.__value), o.__value = "T2", A(o, o.__value), r.__value = "T3", A(r, r.__value), p(n, "class", "line-edit svelte-1j5i27r"), p(n, "data-field", "team"), p(n, "data-line-id", a = /*row*/
      t[19]?.id), p(e, "class", "svelte-1j5i27r"), p(c, "type", "text"), p(c, "class", "line-edit line-code-input svelte-1j5i27r"), p(c, "data-field", "lineCode"), p(c, "data-line-id", f = /*row*/
      t[19]?.id), c.value = S = /*row*/
      t[19]?.lineCode, p(d, "class", "svelte-1j5i27r"), I.__value = "", A(I, I.__value), v.__value = "S1", A(v, v.__value), b.__value = "S2", A(b, b.__value), C.__value = "S3", A(C, C.__value), m.__value = "S4", A(m, m.__value), g.__value = "S5", A(g, g.__value), p(E, "class", "line-edit svelte-1j5i27r"), p(E, "data-field", "shift"), p(E, "data-line-id", T = /*row*/
      t[19]?.id), p(y, "class", "svelte-1j5i27r"), p($, "class", "svelte-1j5i27r"), p(J, "class", "svelte-1j5i27r"), G.__value = "", A(G, G.__value), Q.__value = "TSO", A(Q, Q.__value), Y.__value = "LTSO", A(Y, Y.__value), Z.__value = "STSO", A(Z, Z.__value), p(D, "class", "line-edit svelte-1j5i27r"), p(D, "data-field", "position"), p(D, "data-line-id", Te = /*row*/
      t[19]?.id), p(we, "class", "svelte-1j5i27r"), ee.__value = "", A(ee, ee.__value), te.__value = "FT", A(te, te.__value), se.__value = "PT", A(se, se.__value), ne.__value = "LTSO", A(ne, ne.__value), ie.__value = "STSO", A(ie, ie.__value), p(L, "class", "line-edit svelte-1j5i27r"), p(L, "data-field", "emp"), p(L, "data-line-id", Ae = /*row*/
      t[19]?.id), p(Ie, "class", "svelte-1j5i27r"), le.__value = "", A(le, le.__value), oe.__value = "M", A(oe, oe.__value), re.__value = "F", A(re, re.__value), p(P, "class", "line-edit svelte-1j5i27r"), p(P, "data-field", "sex"), p(P, "data-line-id", Me = /*row*/
      t[19]?.id), p(Ce, "class", "svelte-1j5i27r"), ae.__value = "", A(ae, ae.__value), he.__value = "DFO", A(he, he.__value), ce.__value = "BAG", A(ce, ce.__value), ue.__value = "PAX", A(ue, ue.__value), p(R, "class", "line-edit svelte-1j5i27r"), p(R, "data-field", "function"), p(R, "data-line-id", ze = /*row*/
      t[19]?.id), p(je, "class", "svelte-1j5i27r"), p(xe, "class", "line-rdo-cell svelte-1j5i27r"), p(ke, "class", "svelte-1j5i27r"), p(De, "class", "line-hours svelte-1j5i27r"), z(s, "position", "absolute"), z(
        s,
        "top",
        /*virtualRow*/
        t[18].start + "px"
      ), z(s, "left", "0"), z(s, "width", "100%"), z(
        s,
        "height",
        /*virtualRow*/
        t[18].size + "px"
      ), p(s, "data-line-row", We = /*row*/
      t[19]?.id);
    },
    m(w, M) {
      ye(w, s, M), u(s, e), u(e, n), u(n, i), u(n, l), u(n, o), u(n, r), u(s, h), u(s, d), u(d, c), u(s, O), u(s, y), u(y, E), u(E, I), u(E, v), u(E, b), u(E, C), u(E, m), u(E, g), u(s, B), u(s, $), u($, K), u(s, V), u(s, J), u(J, U), u(s, et), u(s, we), u(we, D), u(D, G), u(D, Q), u(D, Y), u(D, Z), u(s, tt), u(s, Ie), u(Ie, L), u(L, ee), u(L, te), u(L, se), u(L, ne), u(L, ie), u(s, st), u(s, Ce), u(Ce, P), u(P, le), u(P, oe), u(P, re), u(s, nt), u(s, je), u(je, R), u(R, ae), u(R, he), u(R, ce), u(R, ue), u(s, it), u(s, xe), u(xe, Ve), u(s, lt), u(s, ke), u(ke, Pe), u(s, ot);
      for (let j = 0; j < 7; j += 1)
        W[j] && W[j].m(s, null);
      u(s, Ke), u(s, De), u(De, Be), u(s, rt), He || (at = [
        q(n, "change", Mt),
        q(c, "input", jt),
        q(E, "change", zt),
        q(D, "change", xt),
        q(L, "change", Lt),
        q(P, "change", kt),
        q(R, "change", Ft)
      ], He = !0);
    },
    p(w, M) {
      if (t = w, M & /*rows, virtualizer*/
      9 && a !== (a = /*row*/
      t[19]?.id) && p(n, "data-line-id", a), M & /*rows, virtualizer*/
      9 && f !== (f = /*row*/
      t[19]?.id) && p(c, "data-line-id", f), M & /*rows, virtualizer*/
      9 && S !== (S = /*row*/
      t[19]?.lineCode) && c.value !== S && (c.value = S), M & /*rows, virtualizer*/
      9 && T !== (T = /*row*/
      t[19]?.id) && p(E, "data-line-id", T), M & /*rows, virtualizer*/
      9 && N !== (N = /*getShiftLabel*/
      t[4](
        /*row*/
        t[19]?.shiftId
      ) + "") && ge(K, N), M & /*rows, virtualizer*/
      9 && F !== (F = /*getShiftLabel*/
      t[4](
        /*row*/
        t[19]?.shiftId
      ) + "") && ge(U, F), M & /*rows, virtualizer*/
      9 && Te !== (Te = /*row*/
      t[19]?.id) && p(D, "data-line-id", Te), M & /*rows, virtualizer*/
      9 && Ae !== (Ae = /*row*/
      t[19]?.id) && p(L, "data-line-id", Ae), M & /*rows, virtualizer*/
      9 && Me !== (Me = /*row*/
      t[19]?.id) && p(P, "data-line-id", Me), M & /*rows, virtualizer*/
      9 && ze !== (ze = /*row*/
      t[19]?.id) && p(R, "data-line-id", ze), M & /*rows, virtualizer*/
      9 && Le !== (Le = bt(
        /*row*/
        t[19]?.rdoDays,
        /*row*/
        t[19]?.rdoHard
      ) + "") && ge(Ve, Le), M & /*rows, virtualizer*/
      9 && Fe !== (Fe = /*row*/
      t[19]?.paid + "") && ge(Pe, Fe), M & /*getFunctionClass, rows, virtualizer, handleDayToggle*/
      9) {
        qe = $e(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
        let j;
        for (j = 0; j < 7; j += 1) {
          const ht = _t(t, qe, j);
          W[j] ? W[j].p(ht, M) : (W[j] = pt(ht), W[j].c(), W[j].m(s, Ke));
        }
        for (; j < 7; j += 1)
          W[j].d(1);
      }
      M & /*rows, virtualizer*/
      9 && Re !== (Re = /*row*/
      t[19]?.hours + "") && ge(Be, Re), M & /*virtualizer*/
      8 && z(
        s,
        "top",
        /*virtualRow*/
        t[18].start + "px"
      ), M & /*virtualizer*/
      8 && z(
        s,
        "height",
        /*virtualRow*/
        t[18].size + "px"
      ), M & /*rows, virtualizer*/
      9 && We !== (We = /*row*/
      t[19]?.id) && p(s, "data-line-row", We);
    },
    d(w) {
      w && Se(s), wt(W, w), He = !1, ve(at);
    }
  };
}
function ys(t) {
  let s;
  function e(l, o) {
    return (
      /*mode*/
      l[1] === "svelte" ? Os : Es
    );
  }
  let n = e(t), i = n(t);
  return {
    c() {
      s = _("div"), i.c(), p(s, "class", "lines-table-root svelte-1j5i27r");
    },
    m(l, o) {
      ye(l, s, o), i.m(s, null);
    },
    p(l, [o]) {
      n === (n = e(l)) && i ? i.p(l, o) : (i.d(1), i = n(l), i && (i.c(), i.m(s, null)));
    },
    i: k,
    o: k,
    d(l) {
      l && Se(s), i.d();
    }
  };
}
let ws = 42;
function Ct(t, s) {
  const e = new CustomEvent(t, { detail: s, bubbles: !0, composed: !0 });
  window.dispatchEvent(e);
}
function H(t) {
  Ct("lines:inline-edit-response", t);
}
function St(t) {
  Ct("lines:day-toggle-response", t);
}
function bt(t, s) {
  const e = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], n = (t || []).map(Number).filter((l) => Number.isInteger(l) && l >= 0 && l <= 6), i = n.length ? n.map((l) => e[l] || l).join(",") : "—";
  return s ? i + " (hard)" : i;
}
function Et(t) {
  return t === "BAG" ? "cell-function-duty cell-bag" : t === "DFO" ? "cell-function-duty cell-dfo" : t === "PAX" ? "cell-function-duty cell-pax" : "";
}
function Ts(t, s, e) {
  let { rows: n = [] } = s, { mode: i = "svelte" } = s, { shiftOptions: l = [] } = s, o, r;
  Pt(() => {
    if (i !== "svelte") return;
    e(3, r = bs({
      count: n.length,
      getScrollElement: () => o,
      estimateSize: () => ws,
      overscan: 5,
      getItemKey: (g) => n[g]?.id ?? g,
      onChange: (g, T) => {
      }
      // Optional: handle scroll position changes
    }));
    const m = {
      "lines:inline-edit": (g) => H(g.detail),
      "lines:day-toggle": (g) => St(g.detail),
      "lines:filter-change": () => a(),
      "lines:sort-change": () => a(),
      "lines:coverage-refresh": () => a(),
      "lines:request-render": () => a()
    };
    return Object.entries(m).forEach(([g, T]) => {
      window.addEventListener(g, T);
    }), () => {
      Object.entries(m).forEach(([g, T]) => {
        window.removeEventListener(g, T);
      });
    };
  });
  function a() {
    i === "svelte" && r?.setOptions({ count: n.length });
  }
  function h(m) {
    const g = l?.find((T) => T.id === m);
    return g && g.start && g.end ? g.start + "–" + g.end : g && g.start ? g.start : "";
  }
  const d = (m, g) => H({
    lineId: m?.id,
    field: "team",
    value: g.target.value
  }), c = (m, g) => H({
    lineId: m?.id,
    field: "lineCode",
    value: g.target.value
  }), f = (m, g) => H({
    lineId: m?.id,
    field: "shift",
    value: g.target.value
  }), S = (m, g) => H({
    lineId: m?.id,
    field: "position",
    value: g.target.value
  }), O = (m, g) => H({
    lineId: m?.id,
    field: "emp",
    value: g.target.value
  }), y = (m, g) => H({
    lineId: m?.id,
    field: "sex",
    value: g.target.value
  }), E = (m, g) => H({
    lineId: m?.id,
    field: "function",
    value: g.target.value
  }), I = (m, g) => g.dayIndex === m, v = (m, g) => g.dayIndex === m, b = (m, g) => St({ lineId: m?.id, day: g, next: "RDO" });
  function C(m) {
    Ge[m ? "unshift" : "push"](() => {
      o = m, e(2, o);
    });
  }
  return t.$$set = (m) => {
    "rows" in m && e(0, n = m.rows), "mode" in m && e(1, i = m.mode), "shiftOptions" in m && e(5, l = m.shiftOptions);
  }, [
    n,
    i,
    o,
    r,
    h,
    l,
    d,
    c,
    f,
    S,
    O,
    y,
    E,
    I,
    v,
    b,
    C
  ];
}
class Is extends Zt {
  constructor(s) {
    super(), Yt(this, s, Ts, ys, yt, { rows: 0, mode: 1, shiftOptions: 5 });
  }
}
function Cs(t) {
  const s = t || window.Scheduler;
  if (!s) return;
  const e = document.getElementById("lines-table-root");
  if (!e) {
    console.warn("lines-table: #lines-table-root not found");
    return;
  }
  if (s.__USE_SVELTE_LINES === !1 || !s.__USE_SVELTE_LINES) {
    e.innerHTML = "", e.style.display = "none", s.renderLines && s.renderLines();
    return;
  }
  if (e._linesTableMounted) return;
  e._linesTableMounted = !0;
  const n = () => {
    try {
      const l = typeof s.getLineRowModels == "function" ? s.getLineRowModels() : [], o = e._linesTableApp;
      o ? (o.rows = Array.isArray(l) ? l : [], o.$$ && o.$$[Symbol.for("$bond")] && o.$$[Symbol.for("$bond")]()) : e._linesTableApp = new Is({
        target: e,
        props: {
          rows: Array.isArray(l) ? l : [],
          shiftOptions: Array.isArray(s.state.shifts) ? s.state.shifts : []
        }
      });
    } catch (l) {
      console.error("lines-table: refresh failed", l), s.renderLines && s.renderLines();
    }
  };
  n(), document.addEventListener("click", (l) => {
    const o = l.target.closest?.(".tab-btn");
    o && o.dataset.tab === "lines" && n();
  }), Object.entries({
    "lines:request-render": n,
    "lines:filter-change": n,
    "lines:sort-change": n,
    "lines:coverage-refresh": n
  }).forEach(([l, o]) => {
    e.addEventListener(l, o);
  }), e.refresh = n, e.setRows = (l) => {
    e._linesTableApp.rows = l, e._linesTableApp.$$ && e._linesTableApp.$$[Symbol.for("$bond")] && e._linesTableApp.$$[Symbol.for("$bond")]();
  };
}
export {
  Cs as initLinesTable
};
