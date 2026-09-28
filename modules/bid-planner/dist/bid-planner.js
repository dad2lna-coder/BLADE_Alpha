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
function we() {
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
  return we();
}
function qe(t) {
  const e = ae(t);
  if (!e.valid) throw new Error(e.error);
  return typeof localStorage < "u" && localStorage.setItem(te, JSON.stringify(t, null, 2)), !0;
}
function Ve() {
  return typeof localStorage < "u" && localStorage.removeItem(te), we();
}
function j() {
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
function Ae(t, e, n) {
  if (!t || !Array.isArray(t.bidTypes)) return null;
  const a = t.bidTypes.find((l) => l.id === e);
  return !a || !Array.isArray(a.ruleSets) ? null : a.ruleSets.find((l) => l.id === n) || null;
}
function A(t) {
  if (!t || typeof t != "string") return null;
  const e = t.trim().split("-");
  if (e.length !== 3) return null;
  const n = parseInt(e[0], 10), a = parseInt(e[1], 10) - 1, l = parseInt(e[2], 10);
  if (isNaN(n) || isNaN(a) || isNaN(l)) return null;
  const s = new Date(Date.UTC(n, a, l));
  return s.getUTCFullYear() !== n || s.getUTCMonth() !== a || s.getUTCDate() !== l ? null : s;
}
function We(t) {
  if (!t || !(t instanceof Date) || isNaN(t.getTime())) return "";
  const e = t.getUTCFullYear(), n = String(t.getUTCMonth() + 1).padStart(2, "0"), a = String(t.getUTCDate()).padStart(2, "0");
  return `${e}-${n}-${a}`;
}
function X(t, e) {
  const n = A(t);
  return n ? (n.setUTCDate(n.getUTCDate() + e), We(n)) : t;
}
function Le(t, e) {
  return X(t, -e);
}
function re(t, e) {
  const n = A(t);
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
  return !(!A(t) || re(t, e) || Z(t, e) || oe(t, e));
}
function Ke(t, e) {
  return !(!A(t) || re(t, e) || Z(t, e));
}
function Te(t, e, n) {
  let a = t;
  if (e === 0) return a;
  const l = e > 0 ? 1 : -1;
  let s = Math.abs(e);
  for (; s > 0; )
    a = X(a, l), Ke(a, n) && s--;
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
    const a = (e.holidays || []).find((s) => typeof s == "string" ? s === t : s && s.date === t), l = typeof a == "object" && a.name ? `holiday (${a.name})` : "holiday";
    n.push(l);
  }
  if (oe(t, e)) {
    const a = (e.blackoutDates || []).find((s) => typeof s == "string" ? s === t : s && s.date === t), l = typeof a == "object" && a.name ? `blackout date (${a.name})` : "blackout date";
    n.push(l);
  }
  return n.length > 0 ? n.join(", ") : null;
}
function Ce(t, e, n, a = "previous") {
  if (!t || !Array.isArray(t.actions) || !e) return [];
  const l = [...t.actions].sort((c, r) => c.sequence - r.sequence), s = [], u = /* @__PURE__ */ new Map();
  for (let c = 0; c < l.length; c++) {
    const r = l[c];
    let p = "", d = "";
    if (c === 0)
      p = e, d = "Announcement Anchor";
    else {
      const g = l[c - 1], $ = u.get(g.id) || e, k = r.offset || { amount: 0, unit: "calendar_days" }, q = Number(k.amount) || 0;
      k.unit === "business_days" ? (p = Te($, q, n), d = `${g.label} (+${q} business_days)`) : (p = X($, q), d = `${g.label} (+${q} calendar_days)`);
    }
    let f = p, v = !1, b = "";
    if (!_(p, n)) {
      const g = le(p, n);
      f = a === "next" ? xe(p, n) : Ie(p, n), v = !0, b = `Calculated raw date ${p} falls on ${g}. Adjusted to ${a} valid business day ${f}.`;
    }
    u.set(r.id, f), s.push({
      sequence: r.sequence,
      actionId: r.id,
      action: r.label,
      rawDate: p,
      requiredDate: f,
      calculatedFrom: d,
      rule: `${r.offset ? r.offset.amount : 0} ${r.offset ? r.offset.unit : "calendar_days"}`,
      direction: "Forward",
      adjusted: v,
      adjustmentReason: v ? b : "None",
      conflict: "",
      status: v ? "ADJUSTED" : "VALID",
      notes: r.offset && r.offset.placeholder ? "PLACEHOLDER RULE" : ""
    });
  }
  return s;
}
function $e(t, e, n, a = "previous") {
  if (!t || !Array.isArray(t.actions) || !e) return [];
  const l = [...t.actions].sort((c, r) => c.sequence - r.sequence), s = new Array(l.length), u = /* @__PURE__ */ new Map();
  for (let c = l.length - 1; c >= 0; c--) {
    const r = l[c];
    let p = "", d = "";
    if (c === l.length - 1)
      p = e, d = "Execution Anchor";
    else {
      const g = l[c + 1], $ = u.get(g.id) || e, k = g.offset || { amount: 0, unit: "calendar_days" }, q = Number(k.amount) || 0;
      k.unit === "business_days" ? (p = Ge($, q, n), d = `${g.label} (-${q} business_days)`) : (p = Le($, q), d = `${g.label} (-${q} calendar_days)`);
    }
    let f = p, v = !1, b = "";
    if (!_(p, n)) {
      const g = le(p, n);
      f = a === "next" ? xe(p, n) : Ie(p, n), v = !0, b = `Calculated raw date ${p} falls on ${g}. Adjusted to ${a} valid business day ${f}.`;
    }
    u.set(r.id, f), s[c] = {
      sequence: r.sequence,
      actionId: r.id,
      action: r.label,
      rawDate: p,
      requiredDate: f,
      calculatedFrom: d,
      rule: `${r.offset ? r.offset.amount : 0} ${r.offset ? r.offset.unit : "calendar_days"}`,
      direction: "Backward",
      adjusted: v,
      adjustmentReason: v ? b : "None",
      conflict: "",
      status: v ? "ADJUSTED" : "VALID",
      notes: r.offset && r.offset.placeholder ? "PLACEHOLDER RULE" : ""
    };
  }
  return s;
}
function ze(t, e, n, a, l = "previous") {
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
      schedule: Ce(t, e, a, l)
    };
  if (!e && n)
    return {
      status: "SUCCESS",
      overallStatus: "CONSISTENT",
      message: "Backward schedule calculated successfully.",
      schedule: $e(t, n, a, l)
    };
  const s = Ce(t, e, a, l), u = $e(t, n, a, l), c = [], r = [];
  for (let p = 0; p < s.length; p++) {
    const d = s[p], f = u[p];
    d.requiredDate === f.requiredDate ? r.push({
      ...d,
      direction: "Dual (Match)",
      notes: d.notes ? `${d.notes}; Forward and Backward match` : "Forward and Backward match"
    }) : (c.push({
      action: d.action,
      forwardDate: d.requiredDate,
      backwardDate: f.requiredDate
    }), r.push({
      ...d,
      direction: "Dual (Conflict)",
      conflict: `Anchor Discrepancy: Forward (${d.requiredDate}) vs Backward (${f.requiredDate})`,
      status: "INCONSISTENT",
      notes: `Forward calculated ${d.requiredDate}; Backward calculated ${f.requiredDate}`
    }));
  }
  return c.length === 0 ? {
    status: "SUCCESS",
    overallStatus: "CONSISTENT",
    message: "Forward and Backward schedules are completely consistent.",
    schedule: r
  } : {
    status: "SUCCESS",
    overallStatus: "DATE CONFLICT",
    message: `DATE CONFLICT between Announcement and Execution anchors. Disagreements: ${c.map((d) => `${d.action}: Forward=${d.forwardDate} vs Backward=${d.backwardDate}`).join("; ")}`,
    schedule: r,
    discrepancies: c
  };
}
function ke(t, e = [], n = {}) {
  if (!Array.isArray(t)) return { schedule: [], conflictCount: 0, conflicts: [] };
  const a = [];
  return {
    schedule: t.map((s, u) => {
      const c = [], r = s.requiredDate, p = s.userResolved && s.resolvedForDate === r;
      if (Array.isArray(e) && e.length > 0) {
        const f = e.filter((v) => (typeof v == "string" ? v : v.date || v["Required Date"] || v.Date) === r);
        if (f.length > 0) {
          const v = f.map((b) => typeof b == "string" ? b : b.title || b.event || b.Action || b.Event || "Existing Event").join(", ");
          c.push({
            type: "same-day",
            message: `Conflicts with imported event(s): ${v}`
          });
        }
      }
      if (Z(r, n)) {
        const f = (n.holidays || []).find((b) => typeof b == "string" ? b === r : b && b.date === r), v = typeof f == "object" && f.name ? f.name : "Holiday";
        c.push({
          type: "holiday",
          message: `Falls on configured holiday (${v})`
        });
      }
      if (oe(r, n)) {
        const f = (n.blackoutDates || []).find((b) => typeof b == "string" ? b === r : b && b.date === r), v = typeof f == "object" && f.name ? f.name : "Blackout Date";
        c.push({
          type: "blackout",
          message: `Falls on configured blackout date (${v})`
        });
      }
      if (u > 0) {
        const f = t[u - 1], v = A(f.requiredDate), b = A(r);
        v && b && b < v && c.push({
          type: "dependency",
          message: `Sequence violation: Date (${r}) is prior to predecessor '${f.action}' (${f.requiredDate})`
        });
      }
      const d = c.map((f) => f.message).join("; ");
      return s.userResolved && s.resolvedForDate !== r && (s.userResolved = !1, s.resolvedForDate = null), c.length > 0 && !s.userResolved ? (a.push({
        sequence: s.sequence,
        action: s.action,
        requiredDate: s.requiredDate,
        conflicts: c
      }), {
        ...s,
        conflict: d,
        status: "CONFLICT"
      }) : {
        ...s,
        conflict: p ? s.conflict : d || "None",
        status: p ? s.status : s.status === "CONFLICT" ? "VALID" : s.status
      };
    }),
    conflictCount: a.length,
    conflicts: a
  };
}
function Qe(t, e) {
  if (!t && !e)
    return { valid: !1, error: "At least one anchor date (Announcement or Execution) must be provided." };
  if (t && !A(t))
    return { valid: !1, error: "Announcement Date must be a valid YYYY-MM-DD date." };
  if (e && !A(e))
    return { valid: !1, error: "Execution Date must be a valid YYYY-MM-DD date." };
  if (t && e) {
    const n = A(t), a = A(e);
    if (n > a)
      return { valid: !1, error: `Announcement Date (${t}) cannot be after Execution Date (${e}).` };
  }
  return { valid: !0, error: null };
}
function Xe(t, e, n, a, l) {
  if (!Array.isArray(t) || t.length === 0)
    return { valid: !1, error: "No active schedule to move event." };
  const s = A(n);
  if (!s)
    return { valid: !1, error: "New date must be a valid YYYY-MM-DD date." };
  const u = t.findIndex((d) => d.actionId === e || d.action === e);
  if (u === -1)
    return { valid: !1, error: `Action '${e}' not found in schedule.` };
  const c = t[u], r = [];
  let p = !0;
  if (!_(n, l)) {
    const d = le(n, l);
    r.push(`Warning: Proposed date ${n} is a ${d}.`);
  }
  if (u > 0) {
    const d = t[u - 1], f = A(d.requiredDate);
    f && s < f && (p = !1, r.push(`VIOLATION: Proposed date ${n} precedes predecessor '${d.action}' (${d.requiredDate}).`));
  }
  if (u < t.length - 1) {
    const d = t[u + 1], f = A(d.requiredDate);
    f && s > f && (p = !1, r.push(`VIOLATION: Proposed date ${n} succeeds successor '${d.action}' (${d.requiredDate}).`));
  }
  return p && r.push(`Date change valid. '${c.action}' will be updated from ${c.requiredDate} to ${n}.`), {
    valid: p,
    actionId: c.actionId,
    actionLabel: c.action,
    oldDate: c.requiredDate,
    newDate: n,
    consequences: r,
    requiresExplicitAccept: !0
  };
}
function Re(t) {
  if (t == null) return '""';
  const e = String(t);
  return e.includes('"') || e.includes(",") || e.includes(`
`) || e.includes("\r") ? `"${e.replace(/"/g, '""')}"` : e;
}
function Ze(t) {
  if (!t || typeof t != "string") return [];
  const e = t.startsWith("\uFEFF") ? t.slice(1) : t, n = [];
  let a = [], l = "", s = !1;
  for (let u = 0; u < e.length; u++) {
    const c = e[u], r = e[u + 1];
    s ? c === '"' ? r === '"' ? (l += '"', u++) : s = !1 : l += c : c === '"' ? s = !0 : c === "," ? (a.push(l), l = "") : c === "\r" && r === `
` ? (a.push(l), n.push(a), a = [], l = "", u++) : c === `
` || c === "\r" ? (a.push(l), n.push(a), a = [], l = "") : l += c;
  }
  return (l !== "" || a.length > 0) && (a.push(l), n.push(a)), n.filter((u) => u.length > 0 && u.some((c) => c.trim() !== ""));
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
  ].map(Re).join(",")];
  for (const a of t) {
    const l = [
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
    n.push(l.map(Re).join(","));
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
  const l = a[0].map((u) => u.trim()), s = [];
  for (let u = 1; u < a.length; u++) {
    const c = a[u], r = (...f) => {
      for (const v of f) {
        const b = l.findIndex((g) => g.toLowerCase() === v.toLowerCase());
        if (b !== -1 && b < c.length && c[b].trim() !== "")
          return c[b].trim();
      }
      return "";
    }, p = r("Date", "Required Date", "Event Date"), d = r("Event", "Title", "Action", "Description", "Name");
    p && s.push({
      id: `ev-${u}`,
      date: p,
      title: d || `Event ${u}`,
      description: r("Description", "Notes")
    });
  }
  return s;
}
let E = [], z = [], F = null;
function at(t) {
  const e = document.getElementById("tab-bid-planner");
  if (!e) return;
  const n = e.querySelector("#bp-bid-type"), a = e.querySelector("#bp-rule-set"), l = e.querySelector("#bp-announcement-date"), s = e.querySelector("#bp-execution-date"), u = e.querySelector("#bp-adj-strategy"), c = e.querySelector("#bp-btn-generate"), r = e.querySelector("#bp-btn-clear"), p = e.querySelector("#bp-btn-import-cal"), d = e.querySelector("#bp-file-import-cal"), f = e.querySelector("#bp-btn-export-csv"), v = e.querySelector("#bp-btn-export-json"), b = e.querySelector("#bp-status-banner"), g = e.querySelector("#bp-conflict-section"), $ = e.querySelector("#bp-conflict-list"), k = e.querySelector("#bp-row-count"), q = e.querySelector("#bp-schedule-tbody"), L = e.querySelector("#bp-move-section"), N = e.querySelector("#bp-move-action-select"), J = e.querySelector("#bp-move-new-date"), ie = e.querySelector("#bp-btn-validate-move"), C = e.querySelector("#bp-move-consequences"), R = e.querySelector("#bp-btn-confirm-move"), ce = e.querySelector("#bp-btn-cancel-move"), B = e.querySelector("#bp-tab-btn-rules"), P = e.querySelector("#bp-tab-btn-calendar"), Y = e.querySelector("#bp-panel-rules-json"), V = e.querySelector("#bp-panel-calendar-json"), T = e.querySelector("#bp-json-rules"), I = e.querySelector("#bp-json-calendar"), ue = e.querySelector("#bp-btn-apply-rules"), de = e.querySelector("#bp-btn-reset-rules"), fe = e.querySelector("#bp-btn-download-rules"), pe = e.querySelector("#bp-btn-upload-rules"), H = e.querySelector("#bp-file-upload-rules"), ye = e.querySelector("#bp-btn-apply-calendar"), me = e.querySelector("#bp-btn-reset-calendar"), be = e.querySelector("#bp-btn-download-calendar"), ve = e.querySelector("#bp-btn-upload-calendar"), W = e.querySelector("#bp-file-upload-calendar");
  function K() {
    const i = O();
    n && (n.innerHTML = "", (i.bidTypes || []).forEach((o) => {
      const y = document.createElement("option");
      y.value = o.id, y.textContent = o.name, n.appendChild(y);
    }), he());
  }
  function he() {
    if (!n || !a) return;
    const i = O(), o = n.value, y = (i.bidTypes || []).find((m) => m.id === o);
    a.innerHTML = "", y && Array.isArray(y.ruleSets) && y.ruleSets.forEach((m) => {
      const h = document.createElement("option");
      h.value = m.id, h.textContent = m.name, a.appendChild(h);
    });
  }
  function M() {
    T && (T.value = JSON.stringify(O(), null, 2)), I && (I.value = JSON.stringify(j(), null, 2));
  }
  n && n.addEventListener("change", he);
  function Oe() {
    const i = O(), o = j(), y = n.value, m = a.value, h = l ? l.value : "", D = s ? s.value : "", Ue = u ? u.value : "previous", Se = Qe(h, D);
    if (!Se.valid) {
      S("conflict", Se.error);
      return;
    }
    const De = Ae(i, y, m);
    if (!De) {
      S("conflict", "Selected Rule Set not found in configuration.");
      return;
    }
    const x = ze(De, h, D, o, Ue);
    if (x.status !== "SUCCESS") {
      S("conflict", x.message);
      return;
    }
    const G = ke(x.schedule, z, o);
    E = G.schedule, ee(E), ge(G.conflicts), G.conflictCount > 0 ? S("conflict", `Schedule generated with ${G.conflictCount} calendar conflict(s). Review conflict panel below.`) : x.overallStatus === "DATE CONFLICT" ? S("conflict", x.message) : S("consistent", x.message), f && (f.disabled = !1), v && (v.disabled = !1), Me();
  }
  c && c.addEventListener("click", Oe), r && r.addEventListener("click", () => {
    l && (l.value = ""), s && (s.value = ""), E = [], ee([]), b && (b.style.display = "none"), g && (g.style.display = "none"), f && (f.disabled = !0), v && (v.disabled = !0);
  });
  function ee(i) {
    if (q) {
      if (q.innerHTML = "", !Array.isArray(i) || i.length === 0) {
        q.innerHTML = '<tr><td colspan="11" class="bp-empty-msg">No schedule generated yet. Enter anchor date(s) above and click "Generate Schedule".</td></tr>', k && (k.textContent = "0 Actions");
        return;
      }
      k && (k.textContent = `${i.length} Actions`), i.forEach((o) => {
        const y = document.createElement("tr"), h = `<span class="bp-status-tag ${(o.status || "VALID").toLowerCase().replace(/[^a-z0-9]/g, "-")}">${o.status}</span>`, D = o.adjusted ? '<span style="color:#d97706;font-weight:bold;">Yes</span>' : "No";
        y.innerHTML = `
        <td>${o.sequence}</td>
        <td><strong>${w(o.action)}</strong></td>
        <td><code style="font-weight:bold;color:#2563eb;">${w(o.requiredDate)}</code></td>
        <td>${w(o.calculatedFrom)}</td>
        <td>${w(o.rule)}</td>
        <td>${w(o.direction)}</td>
        <td>${D}</td>
        <td style="font-size:0.8rem;">${w(o.adjustmentReason)}</td>
        <td style="color:${o.conflict && o.conflict !== "None" ? "#dc2626" : "inherit"};">${w(o.conflict || "None")}</td>
        <td>${h}</td>
        <td style="font-size:0.8rem;">${w(o.notes || "")}</td>
      `, q.appendChild(y);
      });
    }
  }
  function ge(i) {
    if (!(!g || !$)) {
      if ($.innerHTML = "", !Array.isArray(i) || i.length === 0) {
        g.style.display = "none";
        return;
      }
      g.style.display = "block", i.forEach((o) => {
        const y = document.createElement("div");
        y.className = "bp-conflict-item";
        const m = o.conflicts.map((h) => h.message).join("<br>");
        y.innerHTML = `
        <div class="bp-conflict-desc">
          <strong>Seq ${o.sequence} - ${w(o.action)}</strong> (Required Date: <code>${o.requiredDate}</code>)<br>
          ${m}
        </div>
        <div class="bp-button-bar">
          <button type="button" class="btn btn-sm" data-action="keep-date" data-seq="${o.sequence}">Keep Required Date</button>
          <button type="button" class="btn btn-sm btn-cyan" data-action="move-event" data-seq="${o.sequence}">Move Required Event</button>
          <button type="button" class="btn btn-sm" data-action="keep-existing" data-seq="${o.sequence}">Keep Existing Event</button>
          <button type="button" class="btn btn-sm" data-action="resolve-manual" data-seq="${o.sequence}">Resolve Manually</button>
        </div>
      `, $.appendChild(y);
      }), $.querySelectorAll("button[data-action]").forEach((o) => {
        o.addEventListener("click", (y) => {
          const m = y.target.dataset.action, h = Number(y.target.dataset.seq);
          Fe(m, h);
        });
      });
    }
  }
  function Fe(i, o) {
    const y = E.findIndex((h) => h.sequence === o);
    if (y === -1) return;
    const m = E[y];
    if (i === "keep-date")
      m.status = "VALID (USER KEPT)", m.conflict = "User explicitly kept date despite conflict", m.userResolved = !0, m.resolvedForDate = m.requiredDate, U();
    else if (i === "move-event")
      L && (L.style.display = "block"), N && (N.value = m.actionId), J && (J.value = m.requiredDate), C && (C.style.display = "none"), R && (R.style.display = "none");
    else if (i === "keep-existing")
      m.status = "DEFERRED", m.notes = "Bid event deferred in favor of existing calendar event", m.conflict = "Deferred", m.userResolved = !0, m.resolvedForDate = m.requiredDate, U();
    else if (i === "resolve-manual") {
      const h = prompt("Enter resolution notes:", "Manually resolved");
      h !== null && (m.status = "RESOLVED", m.notes = h, m.conflict = "Resolved manually", m.userResolved = !0, m.resolvedForDate = m.requiredDate, U());
    }
  }
  function U() {
    const i = j(), o = ke(E, z, i);
    E = o.schedule, ee(E), ge(o.conflicts);
  }
  function Me() {
    N && (N.innerHTML = "", E.forEach((i) => {
      const o = document.createElement("option");
      o.value = i.actionId, o.textContent = `Seq ${i.sequence}: ${i.action} (${i.requiredDate})`, N.appendChild(o);
    }));
  }
  ie && ie.addEventListener("click", () => {
    const i = N ? N.value : "", o = J ? J.value : "", y = j(), m = O(), h = Ae(m, n.value, a.value), D = Xe(E, i, o, h, y);
    F = D, C && (C.style.display = "block", C.textContent = D.consequences.join(`
`), D.valid ? (C.style.background = "#f0fdf4", C.style.borderColor = "#86efac", C.style.color = "#166534") : (C.style.background = "#fef2f2", C.style.borderColor = "#fca5a5", C.style.color = "#991b1b")), R && (D.valid ? (R.style.display = "inline-block", R.removeAttribute("disabled")) : (R.style.display = "none", R.setAttribute("disabled", "true")));
  }), R && R.addEventListener("click", () => {
    if (!F || !F.valid) return;
    const { actionId: i, newDate: o } = F, y = E.find((m) => m.actionId === i);
    y && (y.requiredDate = o, y.adjusted = !0, y.adjustmentReason = `Manually moved by user to ${o}`, y.status = "MOVED", y.userResolved = !0, y.resolvedForDate = o, U()), L && (L.style.display = "none"), F = null;
  }), ce && ce.addEventListener("click", () => {
    L && (L.style.display = "none"), F = null;
  }), p && d && (p.addEventListener("click", () => d.click()), d.addEventListener("change", (i) => {
    const o = i.target.files[0];
    if (!o) return;
    const y = new FileReader();
    y.onload = (m) => {
      const h = m.target.result;
      z = nt(h), S("info", `Imported ${z.length} external calendar event(s).`), E.length > 0 && U();
    }, y.readAsText(o), d.value = "";
  })), f && f.addEventListener("click", () => {
    const i = et(E);
    Q(i, "bid-planner-schedule.csv", "text/csv;charset=utf-8;");
  }), v && v.addEventListener("click", () => {
    const i = tt(E);
    Q(i, "bid-planner-schedule.json", "application/json");
  }), B && P && (B.addEventListener("click", () => {
    B.classList.add("active"), P.classList.remove("active"), Y && (Y.style.display = "flex"), V && (V.style.display = "none");
  }), P.addEventListener("click", () => {
    P.classList.add("active"), B.classList.remove("active"), V && (V.style.display = "flex"), Y && (Y.style.display = "none");
  })), ue && T && ue.addEventListener("click", () => {
    try {
      const i = JSON.parse(T.value);
      qe(i), K(), S("consistent", "Rules JSON validated and saved to localStorage.");
    } catch (i) {
      S("conflict", `Rules JSON error: ${i.message}`);
    }
  }), de && de.addEventListener("click", () => {
    Ve(), M(), K(), S("info", "Reset Rules configuration to bundled defaults.");
  }), fe && fe.addEventListener("click", () => {
    const i = T ? T.value : JSON.stringify(O(), null, 2);
    Q(i, "bid-planner-rules.json", "application/json");
  }), pe && H && (pe.addEventListener("click", () => H.click()), H.addEventListener("change", (i) => {
    const o = i.target.files[0];
    if (!o) return;
    const y = new FileReader();
    y.onload = (m) => {
      try {
        const h = JSON.parse(m.target.result), D = ae(h);
        if (!D.valid) throw new Error(D.error);
        qe(h), M(), K(), S("consistent", "Uploaded rules JSON validated and saved.");
      } catch (h) {
        S("conflict", `Upload error: ${h.message}`);
      }
    }, y.readAsText(o), H.value = "";
  })), ye && I && ye.addEventListener("click", () => {
    try {
      const i = JSON.parse(I.value);
      Ee(i), S("consistent", "Calendar JSON validated and saved to localStorage.");
    } catch (i) {
      S("conflict", `Calendar JSON error: ${i.message}`);
    }
  }), me && me.addEventListener("click", () => {
    He(), M(), S("info", "Reset Calendar configuration to bundled defaults.");
  }), be && be.addEventListener("click", () => {
    const i = I ? I.value : JSON.stringify(j(), null, 2);
    Q(i, "bid-planner-calendar.json", "application/json");
  }), ve && W && (ve.addEventListener("click", () => W.click()), W.addEventListener("change", (i) => {
    const o = i.target.files[0];
    if (!o) return;
    const y = new FileReader();
    y.onload = (m) => {
      try {
        const h = JSON.parse(m.target.result), D = se(h);
        if (!D.valid) throw new Error(D.error);
        Ee(h), M(), S("consistent", "Uploaded calendar JSON validated and saved.");
      } catch (h) {
        S("conflict", `Upload error: ${h.message}`);
      }
    }, y.readAsText(o), W.value = "";
  }));
  function S(i, o) {
    b && (b.style.display = "block", b.className = `bp-status-banner card ${i}`, b.textContent = o);
  }
  K(), M();
}
function w(t) {
  return t == null ? "" : String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function Q(t, e, n) {
  const a = new Blob([t], { type: n }), l = URL.createObjectURL(a), s = document.createElement("a");
  s.href = l, s.download = e, document.body.appendChild(s), s.click(), document.body.removeChild(s), URL.revokeObjectURL(l);
}
function st(t) {
  at();
}
export {
  st as default,
  st as initBidPlanner
};
