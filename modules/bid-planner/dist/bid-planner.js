const je = [
  {
    id: "leave-bid",
    name: "Leave Bid",
    ruleSets: [
      {
        id: "standard-leave",
        name: "Standard (placeholder)",
        actions: [
          {
            id: "announcement",
            label: "Announcement",
            sequence: 1,
            offset: {
              amount: 0,
              unit: "calendar_days",
              from: "anchor",
              placeholder: !0
            }
          },
          {
            id: "posting",
            label: "Posting",
            sequence: 2,
            offset: {
              amount: 5,
              unit: "business_days",
              from: "announcement",
              placeholder: !0
            }
          },
          {
            id: "conduct",
            label: "Conduct",
            sequence: 3,
            offset: {
              amount: 7,
              unit: "calendar_days",
              from: "posting",
              placeholder: !0
            }
          },
          {
            id: "execution",
            label: "Execution",
            sequence: 4,
            offset: {
              amount: 10,
              unit: "business_days",
              from: "conduct",
              placeholder: !0
            }
          }
        ]
      }
    ]
  },
  {
    id: "shift-bid",
    name: "Shift Bid",
    ruleSets: [
      {
        id: "small-op",
        name: "Small Operation",
        actions: [
          {
            id: "announcement",
            label: "Announcement",
            sequence: 1,
            offset: {
              amount: 0,
              unit: "calendar_days",
              from: "anchor",
              placeholder: !0
            }
          },
          {
            id: "posting",
            label: "Posting",
            sequence: 2,
            offset: {
              amount: 3,
              unit: "business_days",
              from: "announcement",
              placeholder: !0
            }
          },
          {
            id: "conduct",
            label: "Conduct",
            sequence: 3,
            offset: {
              amount: 5,
              unit: "calendar_days",
              from: "posting",
              placeholder: !0
            }
          },
          {
            id: "execution",
            label: "Execution",
            sequence: 4,
            offset: {
              amount: 7,
              unit: "business_days",
              from: "conduct",
              placeholder: !0
            }
          }
        ]
      },
      {
        id: "medium-op",
        name: "Medium Operation",
        actions: [
          {
            id: "announcement",
            label: "Announcement",
            sequence: 1,
            offset: {
              amount: 0,
              unit: "calendar_days",
              from: "anchor",
              placeholder: !0
            }
          },
          {
            id: "posting",
            label: "Posting",
            sequence: 2,
            offset: {
              amount: 5,
              unit: "business_days",
              from: "announcement",
              placeholder: !0
            }
          },
          {
            id: "conduct",
            label: "Conduct",
            sequence: 3,
            offset: {
              amount: 10,
              unit: "calendar_days",
              from: "posting",
              placeholder: !0
            }
          },
          {
            id: "execution",
            label: "Execution",
            sequence: 4,
            offset: {
              amount: 14,
              unit: "business_days",
              from: "conduct",
              placeholder: !0
            }
          }
        ]
      },
      {
        id: "large-op",
        name: "Large Operation",
        actions: [
          {
            id: "announcement",
            label: "Announcement",
            sequence: 1,
            offset: {
              amount: 0,
              unit: "calendar_days",
              from: "anchor",
              placeholder: !0
            }
          },
          {
            id: "posting",
            label: "Posting",
            sequence: 2,
            offset: {
              amount: 10,
              unit: "business_days",
              from: "announcement",
              placeholder: !0
            }
          },
          {
            id: "conduct",
            label: "Conduct",
            sequence: 3,
            offset: {
              amount: 14,
              unit: "calendar_days",
              from: "posting",
              placeholder: !0
            }
          },
          {
            id: "execution",
            label: "Execution",
            sequence: 4,
            offset: {
              amount: 21,
              unit: "business_days",
              from: "conduct",
              placeholder: !0
            }
          }
        ]
      }
    ]
  }
], _e = {
  bidTypes: je
}, Je = [
  0,
  6
], Be = [
  {
    date: "2026-01-01",
    name: "New Year's Day"
  },
  {
    date: "2026-01-19",
    name: "Martin Luther King Jr. Day"
  },
  {
    date: "2026-02-16",
    name: "Presidents' Day"
  },
  {
    date: "2026-05-25",
    name: "Memorial Day"
  },
  {
    date: "2026-06-19",
    name: "Juneteenth National Independence Day"
  },
  {
    date: "2026-07-04",
    name: "Independence Day"
  },
  {
    date: "2026-09-07",
    name: "Labor Day"
  },
  {
    date: "2026-10-12",
    name: "Columbus Day"
  },
  {
    date: "2026-11-11",
    name: "Veterans Day"
  },
  {
    date: "2026-11-26",
    name: "Thanksgiving Day"
  },
  {
    date: "2026-12-25",
    name: "Christmas Day"
  }
], Pe = [
  {
    date: "2026-11-25",
    name: "Pre-Thanksgiving Peak"
  },
  {
    date: "2026-11-27",
    name: "Post-Thanksgiving Peak"
  },
  {
    date: "2026-12-24",
    name: "Christmas Eve Peak"
  },
  {
    date: "2026-12-31",
    name: "New Year's Eve Peak"
  }
], Ye = {
  weekendDays: Je,
  holidays: Be,
  blackoutDates: Pe
}, te = "blade-bid-planner-rules", ne = "blade-bid-planner-calendar";
function ae(t) {
  if (!t || typeof t != "object") return { valid: !1, error: "Rules config must be a JSON object." };
  if (!Array.isArray(t.bidTypes) || t.bidTypes.length === 0)
    return { valid: !1, error: "Rules config must contain a non-empty 'bidTypes' array." };
  for (const e of t.bidTypes) {
    if (!e.id || !e.name || !Array.isArray(e.ruleSets) || e.ruleSets.length === 0)
      return { valid: !1, error: `Bid type '${e.name || e.id || "unnamed"}' must have id, name, and ruleSets.` };
    for (const n of e.ruleSets) {
      if (!n.id || !n.name || !Array.isArray(n.actions) || n.actions.length === 0)
        return { valid: !1, error: `Rule set '${n.name || n.id || "unnamed"}' must have id, name, and actions.` };
      for (const a of n.actions) {
        if (!a.id || !a.label || typeof a.sequence != "number")
          return { valid: !1, error: `Action '${a.label || a.id}' must have id, label, and numeric sequence.` };
        if (!a.offset || typeof a.offset.amount != "number" || a.offset.amount < 0)
          return { valid: !1, error: `Action '${a.label}' offset amount must be a non-negative number.` };
        if (!["calendar_days", "business_days"].includes(a.offset.unit))
          return { valid: !1, error: `Action '${a.label}' offset unit must be 'calendar_days' or 'business_days'.` };
      }
    }
  }
  return { valid: !0, error: null };
}
function se(t) {
  return !t || typeof t != "object" ? { valid: !1, error: "Calendar config must be a JSON object." } : Array.isArray(t.weekendDays) ? Array.isArray(t.holidays) ? Array.isArray(t.blackoutDates) ? { valid: !0, error: null } : { valid: !1, error: "Calendar config must contain a 'blackoutDates' array." } : { valid: !1, error: "Calendar config must contain a 'holidays' array." } : { valid: !1, error: "Calendar config must contain a 'weekendDays' array." };
}
function Re() {
  return JSON.parse(JSON.stringify(_e));
}
function Ne() {
  return JSON.parse(JSON.stringify(Ye));
}
function O() {
  try {
    if (typeof localStorage < "u") {
      const t = localStorage.getItem(te);
      if (t) {
        const e = JSON.parse(t);
        if (ae(e).valid) return e;
      }
    }
  } catch (t) {
    console.warn("Error loading stored bid planner rules, falling back to default:", t);
  }
  return Re();
}
function De(t) {
  const e = ae(t);
  if (!e.valid) throw new Error(e.error);
  return typeof localStorage < "u" && localStorage.setItem(te, JSON.stringify(t, null, 2)), !0;
}
function Ve() {
  return typeof localStorage < "u" && localStorage.removeItem(te), Re();
}
function U() {
  try {
    if (typeof localStorage < "u") {
      const t = localStorage.getItem(ne);
      if (t) {
        const e = JSON.parse(t);
        if (se(e).valid) return e;
      }
    }
  } catch (t) {
    console.warn("Error loading stored bid planner calendar, falling back to default:", t);
  }
  return Ne();
}
function Ee(t) {
  const e = se(t);
  if (!e.valid) throw new Error(e.error);
  return typeof localStorage < "u" && localStorage.setItem(ne, JSON.stringify(t, null, 2)), !0;
}
function He() {
  return typeof localStorage < "u" && localStorage.removeItem(ne), Ne();
}
function Ce(t, e, n) {
  if (!t || !Array.isArray(t.bidTypes)) return null;
  const a = t.bidTypes.find((r) => r.id === e);
  return !a || !Array.isArray(a.ruleSets) ? null : a.ruleSets.find((r) => r.id === n) || null;
}
function C(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim().split("-");
  if (e.length !== 3) return null;
  const n = parseInt(e[0], 10), a = parseInt(e[1], 10) - 1, r = parseInt(e[2], 10);
  if (isNaN(n) || isNaN(a) || isNaN(r)) return null;
  const l = new Date(Date.UTC(n, a, r));
  return l.getUTCFullYear() !== n || l.getUTCMonth() !== a || l.getUTCDate() !== r ? null : l;
}
function We(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getUTCFullYear(), n = String(t.getUTCMonth() + 1).padStart(2, "0"), a = String(t.getUTCDate()).padStart(2, "0");
  return `${e}-${n}-${a}`;
}
function X(t, e) {
  const n = C(t);
  return n ? (n.setUTCDate(n.getUTCDate() + e), We(n)) : t;
}
function Le(t, e) {
  return X(t, -e);
}
function re(t, e) {
  const n = C(t);
  if (!n) return !1;
  const a = n.getUTCDay();
  return (e && Array.isArray(e.weekendDays) ? e.weekendDays : [0, 6]).includes(a);
}
function Z(t, e) {
  return !e || !Array.isArray(e.holidays) ? !1 : e.holidays.some((n) => typeof n == "string" ? n === t : n && n.date === t);
}
function oe(t, e) {
  return !e || !Array.isArray(e.blackoutDates) ? !1 : e.blackoutDates.some((n) => typeof n == "string" ? n === t : n && n.date === t);
}
function _(t, e) {
  return !(!C(t) || re(t, e) || Z(t, e) || oe(t, e));
}
function Ke(t, e) {
  return !(!C(t) || re(t, e) || Z(t, e));
}
function Te(t, e, n) {
  let a = t;
  if (e === 0) return a;
  const r = e > 0 ? 1 : -1;
  let l = Math.abs(e);
  for (; l > 0; )
    a = X(a, r), Ke(a, n) && l--;
  return a;
}
function Ge(t, e, n) {
  return Te(t, -e, n);
}
function Ie(t, e) {
  let n = t;
  for (; !_(n, e); )
    n = Le(n, 1);
  return n;
}
function xe(t, e) {
  let n = t;
  for (; !_(n, e); )
    n = X(n, 1);
  return n;
}
function le(t, e) {
  const n = [];
  if (re(t, e) && n.push("weekend"), Z(t, e)) {
    const a = (e.holidays || []).find((l) => typeof l == "string" ? l === t : l && l.date === t), r = typeof a == "object" && a.name ? `holiday (${a.name})` : "holiday";
    n.push(r);
  }
  if (oe(t, e)) {
    const a = (e.blackoutDates || []).find((l) => typeof l == "string" ? l === t : l && l.date === t), r = typeof a == "object" && a.name ? `blackout date (${a.name})` : "blackout date";
    n.push(r);
  }
  return n.length > 0 ? n.join(", ") : null;
}
function Ae(t, e, n, a = "previous") {
  if (!t || !Array.isArray(t.actions) || !e) return [];
  const r = [...t.actions].sort((i, o) => i.sequence - o.sequence), l = [], u = /* @__PURE__ */ new Map();
  for (let i = 0; i < r.length; i++) {
    const o = r[i];
    let p = "", d = "";
    if (i === 0)
      p = e, d = "Announcement Anchor";
    else {
      const g = r[i - 1], $ = u.get(g.id) || e, k = o.offset || { amount: 0, unit: "calendar_days" }, q = Number(k.amount) || 0;
      k.unit === "business_days" ? (p = Te($, q, n), d = `${g.label} (+${q} business_days)`) : (p = X($, q), d = `${g.label} (+${q} calendar_days)`);
    }
    let f = p, b = !1, m = "";
    if (!_(p, n)) {
      const g = le(p, n);
      f = a === "next" ? xe(p, n) : Ie(p, n), b = !0, m = `Calculated raw date ${p} falls on ${g}. Adjusted to ${a} valid business day ${f}.`;
    }
    u.set(o.id, f), l.push({
      sequence: o.sequence,
      actionId: o.id,
      action: o.label,
      rawDate: p,
      requiredDate: f,
      calculatedFrom: d,
      rule: `${o.offset ? o.offset.amount : 0} ${o.offset ? o.offset.unit : "calendar_days"}`,
      direction: "Forward",
      adjusted: b,
      adjustmentReason: b ? m : "None",
      conflict: "",
      status: b ? "ADJUSTED" : "VALID",
      notes: o.offset && o.offset.placeholder ? "PLACEHOLDER RULE" : ""
    });
  }
  return l;
}
function $e(t, e, n, a = "previous") {
  if (!t || !Array.isArray(t.actions) || !e) return [];
  const r = [...t.actions].sort((i, o) => i.sequence - o.sequence), l = new Array(r.length), u = /* @__PURE__ */ new Map();
  for (let i = r.length - 1; i >= 0; i--) {
    const o = r[i];
    let p = "", d = "";
    if (i === r.length - 1)
      p = e, d = "Execution Anchor";
    else {
      const g = r[i + 1], $ = u.get(g.id) || e, k = g.offset || { amount: 0, unit: "calendar_days" }, q = Number(k.amount) || 0;
      k.unit === "business_days" ? (p = Ge($, q, n), d = `${g.label} (-${q} business_days)`) : (p = Le($, q), d = `${g.label} (-${q} calendar_days)`);
    }
    let f = p, b = !1, m = "";
    if (!_(p, n)) {
      const g = le(p, n);
      f = a === "next" ? xe(p, n) : Ie(p, n), b = !0, m = `Calculated raw date ${p} falls on ${g}. Adjusted to ${a} valid business day ${f}.`;
    }
    u.set(o.id, f), l[i] = {
      sequence: o.sequence,
      actionId: o.id,
      action: o.label,
      rawDate: p,
      requiredDate: f,
      calculatedFrom: d,
      rule: `${o.offset ? o.offset.amount : 0} ${o.offset ? o.offset.unit : "calendar_days"}`,
      direction: "Backward",
      adjusted: b,
      adjustmentReason: b ? m : "None",
      conflict: "",
      status: b ? "ADJUSTED" : "VALID",
      notes: o.offset && o.offset.placeholder ? "PLACEHOLDER RULE" : ""
    };
  }
  return l;
}
function ze(t, e, n, a, r = "previous") {
  if (!e && !n)
    return {
      status: "ERROR",
      message: "Please enter at least Announcement Date or Execution Date.",
      schedule: []
    };
  if (e && !n)
    return {
      status: "SUCCESS",
      overallStatus: "CONSISTENT",
      message: "Forward schedule calculated successfully.",
      schedule: Ae(t, e, a, r)
    };
  if (!e && n)
    return {
      status: "SUCCESS",
      overallStatus: "CONSISTENT",
      message: "Backward schedule calculated successfully.",
      schedule: $e(t, n, a, r)
    };
  const l = Ae(t, e, a, r), u = $e(t, n, a, r), i = [], o = [];
  for (let p = 0; p < l.length; p++) {
    const d = l[p], f = u[p];
    d.requiredDate === f.requiredDate ? o.push({
      ...d,
      direction: "Dual (Match)",
      notes: d.notes ? `${d.notes}; Forward and Backward match` : "Forward and Backward match"
    }) : (i.push({
      action: d.action,
      forwardDate: d.requiredDate,
      backwardDate: f.requiredDate
    }), o.push({
      ...d,
      direction: "Dual (Conflict)",
      conflict: `Anchor Discrepancy: Forward (${d.requiredDate}) vs Backward (${f.requiredDate})`,
      status: "INCONSISTENT",
      notes: `Forward calculated ${d.requiredDate}; Backward calculated ${f.requiredDate}`
    }));
  }
  return i.length === 0 ? {
    status: "SUCCESS",
    overallStatus: "CONSISTENT",
    message: "Forward and Backward schedules are completely consistent.",
    schedule: o
  } : {
    status: "SUCCESS",
    overallStatus: "DATE CONFLICT",
    message: `DATE CONFLICT between Announcement and Execution anchors. Disagreements: ${i.map((d) => `${d.action}: Forward=${d.forwardDate} vs Backward=${d.backwardDate}`).join("; ")}`,
    schedule: o,
    discrepancies: i
  };
}
function ke(t, e = [], n = {}) {
  if (!Array.isArray(t)) return { schedule: [], conflictCount: 0, conflicts: [] };
  const a = [];
  return {
    schedule: t.map((l, u) => {
      const i = [], o = l.requiredDate;
      if (Array.isArray(e) && e.length > 0) {
        const f = e.filter((b) => (typeof b == "string" ? b : b.date || b["Required Date"] || b.Date) === o);
        if (f.length > 0) {
          const b = f.map((m) => typeof m == "string" ? m : m.title || m.event || m.Action || m.Event || "Existing Event").join(", ");
          i.push({
            type: "same-day",
            message: `Conflicts with imported event(s): ${b}`
          });
        }
      }
      if (Z(o, n)) {
        const f = (n.holidays || []).find((m) => typeof m == "string" ? m === o : m && m.date === o), b = typeof f == "object" && f.name ? f.name : "Holiday";
        i.push({
          type: "holiday",
          message: `Falls on configured holiday (${b})`
        });
      }
      if (oe(o, n)) {
        const f = (n.blackoutDates || []).find((m) => typeof m == "string" ? m === o : m && m.date === o), b = typeof f == "object" && f.name ? f.name : "Blackout Date";
        i.push({
          type: "blackout",
          message: `Falls on configured blackout date (${b})`
        });
      }
      if (u > 0) {
        const f = t[u - 1], b = C(f.requiredDate), m = C(o);
        b && m && m < b && i.push({
          type: "dependency",
          message: `Sequence violation: Date (${o}) is prior to predecessor '${f.action}' (${f.requiredDate})`
        });
      }
      const p = i.map((f) => f.message).join("; ");
      let d = l.status;
      return i.length > 0 && (d = "CONFLICT", a.push({
        sequence: l.sequence,
        action: l.action,
        requiredDate: l.requiredDate,
        conflicts: i
      })), {
        ...l,
        conflict: p || l.conflict || "None",
        status: i.length > 0 ? "CONFLICT" : d
      };
    }),
    conflictCount: a.length,
    conflicts: a
  };
}
function Qe(t, e) {
  if (!t && !e)
    return { valid: !1, error: "At least one anchor date (Announcement or Execution) must be provided." };
  if (t && !C(t))
    return { valid: !1, error: "Announcement Date must be a valid YYYY-MM-DD date." };
  if (e && !C(e))
    return { valid: !1, error: "Execution Date must be a valid YYYY-MM-DD date." };
  if (t && e) {
    const n = C(t), a = C(e);
    if (n > a)
      return { valid: !1, error: `Announcement Date (${t}) cannot be after Execution Date (${e}).` };
  }
  return { valid: !0, error: null };
}
function Xe(t, e, n, a, r) {
  if (!Array.isArray(t) || t.length === 0)
    return { valid: !1, error: "No active schedule to move event." };
  const l = C(n);
  if (!l)
    return { valid: !1, error: "New date must be a valid YYYY-MM-DD date." };
  const u = t.findIndex((d) => d.actionId === e || d.action === e);
  if (u === -1)
    return { valid: !1, error: `Action '${e}' not found in schedule.` };
  const i = t[u], o = [];
  let p = !0;
  if (!_(n, r)) {
    const d = le(n, r);
    o.push(`Warning: Proposed date ${n} is a ${d}.`);
  }
  if (u > 0) {
    const d = t[u - 1], f = C(d.requiredDate);
    f && l < f && (p = !1, o.push(`VIOLATION: Proposed date ${n} precedes predecessor '${d.action}' (${d.requiredDate}).`));
  }
  if (u < t.length - 1) {
    const d = t[u + 1], f = C(d.requiredDate);
    f && l > f && (p = !1, o.push(`VIOLATION: Proposed date ${n} succeeds successor '${d.action}' (${d.requiredDate}).`));
  }
  return p && o.push(`Date change valid. '${i.action}' will be updated from ${i.requiredDate} to ${n}.`), {
    valid: p,
    actionId: i.actionId,
    actionLabel: i.action,
    oldDate: i.requiredDate,
    newDate: n,
    consequences: o,
    requiresExplicitAccept: !0
  };
}
function we(t) {
  if (t == null) return '""';
  const e = String(t);
  return e.includes('"') || e.includes(",") || e.includes(`
`) || e.includes("\r") ? `"${e.replace(/"/g, '""')}"` : e;
}
function Ze(t) {
  if (!t || typeof t != "string") return [];
  const e = t.startsWith("\uFEFF") ? t.slice(1) : t, n = [];
  let a = [], r = "", l = !1;
  for (let u = 0; u < e.length; u++) {
    const i = e[u], o = e[u + 1];
    l ? i === '"' ? o === '"' ? (r += '"', u++) : l = !1 : r += i : i === '"' ? l = !0 : i === "," ? (a.push(r), r = "") : i === "\r" && o === `
` ? (a.push(r), n.push(a), a = [], r = "", u++) : i === `
` || i === "\r" ? (a.push(r), n.push(a), a = [], r = "") : r += i;
  }
  return (r !== "" || a.length > 0) && (a.push(r), n.push(a)), n.filter((u) => u.length > 0 && u.some((i) => i.trim() !== ""));
}
function et(t) {
  if (!Array.isArray(t) || t.length === 0) return "";
  const n = [[
    "Sequence",
    "Action",
    "Required Date",
    "Calculated From",
    "Rule",
    "Direction",
    "Adjusted?",
    "Adjustment Reason",
    "Conflict",
    "Status",
    "Notes"
  ].map(we).join(",")];
  for (const a of t) {
    const r = [
      a.sequence,
      a.action,
      a.requiredDate,
      a.calculatedFrom,
      a.rule,
      a.direction,
      a.adjusted ? "Yes" : "No",
      a.adjustmentReason,
      a.conflict,
      a.status,
      a.notes
    ];
    n.push(r.map(we).join(","));
  }
  return "\uFEFF" + n.join(`\r
`);
}
function tt(t) {
  return JSON.stringify(t || [], null, 2);
}
function nt(t, e = "auto") {
  if (!t || typeof t != "string") return [];
  const n = t.trim();
  if (e === "json" || e === "auto" && (n.startsWith("[") || n.startsWith("{")))
    try {
      const u = JSON.parse(n);
      if (Array.isArray(u)) return u;
      if (u && Array.isArray(u.events)) return u.events;
    } catch (u) {
      console.warn("JSON parse failed for calendar import:", u);
    }
  const a = Ze(n);
  if (a.length < 2) return [];
  const r = a[0].map((u) => u.trim()), l = [];
  for (let u = 1; u < a.length; u++) {
    const i = a[u], o = (...f) => {
      for (const b of f) {
        const m = r.findIndex((g) => g.toLowerCase() === b.toLowerCase());
        if (m !== -1 && m < i.length && i[m].trim() !== "")
          return i[m].trim();
      }
      return "";
    }, p = o("Date", "Required Date", "Event Date"), d = o("Event", "Title", "Action", "Description", "Name");
    p && l.push({
      id: `ev-${u}`,
      date: p,
      title: d || `Event ${u}`,
      description: o("Description", "Notes")
    });
  }
  return l;
}
let E = [], z = [], j = null;
function at(t) {
  const e = document.getElementById("tab-bid-planner");
  if (!e) return;
  const n = e.querySelector("#bp-bid-type"), a = e.querySelector("#bp-rule-set"), r = e.querySelector("#bp-announcement-date"), l = e.querySelector("#bp-execution-date"), u = e.querySelector("#bp-adj-strategy"), i = e.querySelector("#bp-btn-generate"), o = e.querySelector("#bp-btn-clear"), p = e.querySelector("#bp-btn-import-cal"), d = e.querySelector("#bp-file-import-cal"), f = e.querySelector("#bp-btn-export-csv"), b = e.querySelector("#bp-btn-export-json"), m = e.querySelector("#bp-status-banner"), g = e.querySelector("#bp-conflict-section"), $ = e.querySelector("#bp-conflict-list"), k = e.querySelector("#bp-row-count"), q = e.querySelector("#bp-schedule-tbody"), N = e.querySelector("#bp-move-section"), R = e.querySelector("#bp-move-action-select"), J = e.querySelector("#bp-move-new-date"), ie = e.querySelector("#bp-btn-validate-move"), A = e.querySelector("#bp-move-consequences"), L = e.querySelector("#bp-btn-confirm-move"), ce = e.querySelector("#bp-btn-cancel-move"), B = e.querySelector("#bp-tab-btn-rules"), P = e.querySelector("#bp-tab-btn-calendar"), Y = e.querySelector("#bp-panel-rules-json"), V = e.querySelector("#bp-panel-calendar-json"), T = e.querySelector("#bp-json-rules"), I = e.querySelector("#bp-json-calendar"), ue = e.querySelector("#bp-btn-apply-rules"), de = e.querySelector("#bp-btn-reset-rules"), fe = e.querySelector("#bp-btn-download-rules"), pe = e.querySelector("#bp-btn-upload-rules"), H = e.querySelector("#bp-file-upload-rules"), ye = e.querySelector("#bp-btn-apply-calendar"), me = e.querySelector("#bp-btn-reset-calendar"), be = e.querySelector("#bp-btn-download-calendar"), ve = e.querySelector("#bp-btn-upload-calendar"), W = e.querySelector("#bp-file-upload-calendar");
  function K() {
    const c = O();
    n && (n.innerHTML = "", (c.bidTypes || []).forEach((s) => {
      const y = document.createElement("option");
      y.value = s.id, y.textContent = s.name, n.appendChild(y);
    }), he());
  }
  function he() {
    if (!n || !a) return;
    const c = O(), s = n.value, y = (c.bidTypes || []).find((v) => v.id === s);
    a.innerHTML = "", y && Array.isArray(y.ruleSets) && y.ruleSets.forEach((v) => {
      const h = document.createElement("option");
      h.value = v.id, h.textContent = v.name, a.appendChild(h);
    });
  }
  function F() {
    T && (T.value = JSON.stringify(O(), null, 2)), I && (I.value = JSON.stringify(U(), null, 2));
  }
  n && n.addEventListener("change", he);
  function Oe() {
    const c = O(), s = U(), y = n.value, v = a.value, h = r ? r.value : "", D = l ? l.value : "", Ue = u ? u.value : "previous", Se = Qe(h, D);
    if (!Se.valid) {
      S("conflict", Se.error);
      return;
    }
    const qe = Ce(c, y, v);
    if (!qe) {
      S("conflict", "Selected Rule Set not found in configuration.");
      return;
    }
    const x = ze(qe, h, D, s, Ue);
    if (x.status !== "SUCCESS") {
      S("conflict", x.message);
      return;
    }
    const G = ke(x.schedule, z, s);
    E = G.schedule, ee(E), ge(G.conflicts), G.conflictCount > 0 ? S("conflict", `Schedule generated with ${G.conflictCount} calendar conflict(s). Review conflict panel below.`) : x.overallStatus === "DATE CONFLICT" ? S("conflict", x.message) : S("consistent", x.message), f && (f.disabled = !1), b && (b.disabled = !1), Me();
  }
  i && i.addEventListener("click", Oe), o && o.addEventListener("click", () => {
    r && (r.value = ""), l && (l.value = ""), E = [], ee([]), m && (m.style.display = "none"), g && (g.style.display = "none"), f && (f.disabled = !0), b && (b.disabled = !0);
  });
  function ee(c) {
    if (q) {
      if (q.innerHTML = "", !Array.isArray(c) || c.length === 0) {
        q.innerHTML = '<tr><td colspan="11" class="bp-empty-msg">No schedule generated yet. Enter anchor date(s) above and click "Generate Schedule".</td></tr>', k && (k.textContent = "0 Actions");
        return;
      }
      k && (k.textContent = `${c.length} Actions`), c.forEach((s) => {
        const y = document.createElement("tr"), h = `<span class="bp-status-tag ${(s.status || "VALID").toLowerCase()}">${s.status}</span>`, D = s.adjusted ? '<span style="color:#d97706;font-weight:bold;">Yes</span>' : "No";
        y.innerHTML = `
        <td>${s.sequence}</td>
        <td><strong>${w(s.action)}</strong></td>
        <td><code style="font-weight:bold;color:#2563eb;">${w(s.requiredDate)}</code></td>
        <td>${w(s.calculatedFrom)}</td>
        <td>${w(s.rule)}</td>
        <td>${w(s.direction)}</td>
        <td>${D}</td>
        <td style="font-size:0.8rem;">${w(s.adjustmentReason)}</td>
        <td style="color:${s.conflict && s.conflict !== "None" ? "#dc2626" : "inherit"};">${w(s.conflict || "None")}</td>
        <td>${h}</td>
        <td style="font-size:0.8rem;">${w(s.notes || "")}</td>
      `, q.appendChild(y);
      });
    }
  }
  function ge(c) {
    if (!(!g || !$)) {
      if ($.innerHTML = "", !Array.isArray(c) || c.length === 0) {
        g.style.display = "none";
        return;
      }
      g.style.display = "block", c.forEach((s) => {
        const y = document.createElement("div");
        y.className = "bp-conflict-item";
        const v = s.conflicts.map((h) => h.message).join("<br>");
        y.innerHTML = `
        <div class="bp-conflict-desc">
          <strong>Seq ${s.sequence} - ${w(s.action)}</strong> (Required Date: <code>${s.requiredDate}</code>)<br>
          ${v}
        </div>
        <div class="bp-button-bar">
          <button type="button" class="btn btn-sm" data-action="keep-date" data-seq="${s.sequence}">Keep Required Date</button>
          <button type="button" class="btn btn-sm btn-cyan" data-action="move-event" data-seq="${s.sequence}">Move Required Event</button>
          <button type="button" class="btn btn-sm" data-action="keep-existing" data-seq="${s.sequence}">Keep Existing Event</button>
          <button type="button" class="btn btn-sm" data-action="resolve-manual" data-seq="${s.sequence}">Resolve Manually</button>
        </div>
      `, $.appendChild(y);
      }), $.querySelectorAll("button[data-action]").forEach((s) => {
        s.addEventListener("click", (y) => {
          const v = y.target.dataset.action, h = Number(y.target.dataset.seq);
          Fe(v, h);
        });
      });
    }
  }
  function Fe(c, s) {
    const y = E.findIndex((h) => h.sequence === s);
    if (y === -1) return;
    const v = E[y];
    if (c === "keep-date")
      v.status = "VALID (USER KEPT)", v.conflict = "User explicitly kept date despite conflict", M();
    else if (c === "move-event")
      N && (N.style.display = "block"), R && (R.value = v.actionId), J && (J.value = v.requiredDate), A && (A.style.display = "none"), L && (L.style.display = "none");
    else if (c === "keep-existing")
      v.status = "DEFERRED", v.notes = "Bid event deferred in favor of existing calendar event", v.conflict = "Deferred", M();
    else if (c === "resolve-manual") {
      const h = prompt("Enter resolution notes:", "Manually resolved");
      h !== null && (v.status = "RESOLVED", v.notes = h, v.conflict = "Resolved manually", M());
    }
  }
  function M() {
    const c = U(), s = ke(E, z, c);
    E = s.schedule, ee(E), ge(s.conflicts);
  }
  function Me() {
    R && (R.innerHTML = "", E.forEach((c) => {
      const s = document.createElement("option");
      s.value = c.actionId, s.textContent = `Seq ${c.sequence}: ${c.action} (${c.requiredDate})`, R.appendChild(s);
    }));
  }
  ie && ie.addEventListener("click", () => {
    const c = R ? R.value : "", s = J ? J.value : "", y = U(), v = O(), h = Ce(v, n.value, a.value), D = Xe(E, c, s, h, y);
    j = D, A && (A.style.display = "block", A.textContent = D.consequences.join(`
`), D.valid ? (A.style.background = "#f0fdf4", A.style.borderColor = "#86efac", A.style.color = "#166534") : (A.style.background = "#fef2f2", A.style.borderColor = "#fca5a5", A.style.color = "#991b1b")), L && (L.style.display = "inline-block");
  }), L && L.addEventListener("click", () => {
    if (!j) return;
    const { actionId: c, newDate: s } = j, y = E.find((v) => v.actionId === c);
    y && (y.requiredDate = s, y.adjusted = !0, y.adjustmentReason = `Manually moved by user to ${s}`, y.status = "MOVED", M()), N && (N.style.display = "none"), j = null;
  }), ce && ce.addEventListener("click", () => {
    N && (N.style.display = "none"), j = null;
  }), p && d && (p.addEventListener("click", () => d.click()), d.addEventListener("change", (c) => {
    const s = c.target.files[0];
    if (!s) return;
    const y = new FileReader();
    y.onload = (v) => {
      const h = v.target.result;
      z = nt(h), S("info", `Imported ${z.length} external calendar event(s).`), E.length > 0 && M();
    }, y.readAsText(s), d.value = "";
  })), f && f.addEventListener("click", () => {
    const c = et(E);
    Q(c, "bid-planner-schedule.csv", "text/csv;charset=utf-8;");
  }), b && b.addEventListener("click", () => {
    const c = tt(E);
    Q(c, "bid-planner-schedule.json", "application/json");
  }), B && P && (B.addEventListener("click", () => {
    B.classList.add("active"), P.classList.remove("active"), Y && (Y.style.display = "flex"), V && (V.style.display = "none");
  }), P.addEventListener("click", () => {
    P.classList.add("active"), B.classList.remove("active"), V && (V.style.display = "flex"), Y && (Y.style.display = "none");
  })), ue && T && ue.addEventListener("click", () => {
    try {
      const c = JSON.parse(T.value);
      De(c), K(), S("consistent", "Rules JSON validated and saved to localStorage.");
    } catch (c) {
      S("conflict", `Rules JSON error: ${c.message}`);
    }
  }), de && de.addEventListener("click", () => {
    Ve(), F(), K(), S("info", "Reset Rules configuration to bundled defaults.");
  }), fe && fe.addEventListener("click", () => {
    const c = T ? T.value : JSON.stringify(O(), null, 2);
    Q(c, "bid-planner-rules.json", "application/json");
  }), pe && H && (pe.addEventListener("click", () => H.click()), H.addEventListener("change", (c) => {
    const s = c.target.files[0];
    if (!s) return;
    const y = new FileReader();
    y.onload = (v) => {
      try {
        const h = JSON.parse(v.target.result), D = ae(h);
        if (!D.valid) throw new Error(D.error);
        De(h), F(), K(), S("consistent", "Uploaded rules JSON validated and saved.");
      } catch (h) {
        S("conflict", `Upload error: ${h.message}`);
      }
    }, y.readAsText(s), H.value = "";
  })), ye && I && ye.addEventListener("click", () => {
    try {
      const c = JSON.parse(I.value);
      Ee(c), S("consistent", "Calendar JSON validated and saved to localStorage.");
    } catch (c) {
      S("conflict", `Calendar JSON error: ${c.message}`);
    }
  }), me && me.addEventListener("click", () => {
    He(), F(), S("info", "Reset Calendar configuration to bundled defaults.");
  }), be && be.addEventListener("click", () => {
    const c = I ? I.value : JSON.stringify(U(), null, 2);
    Q(c, "bid-planner-calendar.json", "application/json");
  }), ve && W && (ve.addEventListener("click", () => W.click()), W.addEventListener("change", (c) => {
    const s = c.target.files[0];
    if (!s) return;
    const y = new FileReader();
    y.onload = (v) => {
      try {
        const h = JSON.parse(v.target.result), D = se(h);
        if (!D.valid) throw new Error(D.error);
        Ee(h), F(), S("consistent", "Uploaded calendar JSON validated and saved.");
      } catch (h) {
        S("conflict", `Upload error: ${h.message}`);
      }
    }, y.readAsText(s), W.value = "";
  }));
  function S(c, s) {
    m && (m.style.display = "block", m.className = `bp-status-banner card ${c}`, m.textContent = s);
  }
  K(), F();
}
function w(t) {
  return t == null ? "" : String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Q(t, e, n) {
  const a = new Blob([t], { type: n }), r = URL.createObjectURL(a), l = document.createElement("a");
  l.href = r, l.download = e, document.body.appendChild(l), l.click(), document.body.removeChild(l), URL.revokeObjectURL(r);
}
function st(t) {
  at();
}
export {
  st as default,
  st as initBidPlanner
};
