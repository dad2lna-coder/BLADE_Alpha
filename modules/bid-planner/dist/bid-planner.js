const it = [
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
], at = {
  bidTypes: it
}, ot = [
  0,
  6
], lt = [
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
], ct = [
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
], dt = {
  weekendDays: ot,
  holidays: lt,
  blackoutDates: ct
}, Ee = "blade-bid-planner-rules", ke = "blade-bid-planner-calendar";
function Le(e) {
  if (!e || typeof e != "object") return { valid: !1, error: "Rules config must be a JSON object." };
  if (!Array.isArray(e.bidTypes) || e.bidTypes.length === 0)
    return { valid: !1, error: "Rules config must contain a non-empty 'bidTypes' array." };
  for (const t of e.bidTypes) {
    if (!t.id || !t.name || !Array.isArray(t.ruleSets) || t.ruleSets.length === 0)
      return { valid: !1, error: `Bid type '${t.name || t.id || "unnamed"}' must have id, name, and ruleSets.` };
    for (const n of t.ruleSets) {
      if (!n.id || !n.name || !Array.isArray(n.actions) || n.actions.length === 0)
        return { valid: !1, error: `Rule set '${n.name || n.id || "unnamed"}' must have id, name, and actions.` };
      for (const r of n.actions) {
        if (!r.id || !r.label || typeof r.sequence != "number")
          return { valid: !1, error: `Action '${r.label || r.id}' must have id, label, and numeric sequence.` };
        if (!r.offset || typeof r.offset.amount != "number" || r.offset.amount < 0)
          return { valid: !1, error: `Action '${r.label}' offset amount must be a non-negative number.` };
        if (!["calendar_days", "business_days"].includes(r.offset.unit))
          return { valid: !1, error: `Action '${r.label}' offset unit must be 'calendar_days' or 'business_days'.` };
      }
    }
  }
  return { valid: !0, error: null };
}
function qe(e) {
  return !e || typeof e != "object" ? { valid: !1, error: "Calendar config must be a JSON object." } : Array.isArray(e.weekendDays) ? Array.isArray(e.holidays) ? Array.isArray(e.blackoutDates) ? { valid: !0, error: null } : { valid: !1, error: "Calendar config must contain a 'blackoutDates' array." } : { valid: !1, error: "Calendar config must contain a 'holidays' array." } : { valid: !1, error: "Calendar config must contain a 'weekendDays' array." };
}
function Ve() {
  return JSON.parse(JSON.stringify(at));
}
function Ge() {
  return JSON.parse(JSON.stringify(dt));
}
function se() {
  try {
    if (typeof localStorage < "u") {
      const e = localStorage.getItem(Ee);
      if (e) {
        const t = JSON.parse(e);
        if (Le(t).valid) return t;
      }
    }
  } catch (e) {
    console.warn("Error loading stored bid planner rules, falling back to default:", e);
  }
  return Ve();
}
function Fe(e) {
  const t = Le(e);
  if (!t.valid) throw new Error(t.error);
  return typeof localStorage < "u" && localStorage.setItem(Ee, JSON.stringify(e, null, 2)), !0;
}
function ut() {
  return typeof localStorage < "u" && localStorage.removeItem(Ee), Ve();
}
function le() {
  try {
    if (typeof localStorage < "u") {
      const e = localStorage.getItem(ke);
      if (e) {
        const t = JSON.parse(e);
        if (qe(t).valid) return t;
      }
    }
  } catch (e) {
    console.warn("Error loading stored bid planner calendar, falling back to default:", e);
  }
  return Ge();
}
function xe(e) {
  const t = qe(e);
  if (!t.valid) throw new Error(t.error);
  return typeof localStorage < "u" && localStorage.setItem(ke, JSON.stringify(e, null, 2)), !0;
}
function ft() {
  return typeof localStorage < "u" && localStorage.removeItem(ke), Ge();
}
function Me(e, t, n) {
  if (!e || !Array.isArray(e.bidTypes)) return null;
  const r = e.bidTypes.find((s) => s.id === t);
  return !r || !Array.isArray(r.ruleSets) ? null : r.ruleSets.find((s) => s.id === n) || null;
}
function H(e) {
  if (!e || typeof e != "string") return null;
  const t = e.trim().split("-");
  if (t.length !== 3) return null;
  const n = parseInt(t[0], 10), r = parseInt(t[1], 10) - 1, s = parseInt(t[2], 10);
  if (isNaN(n) || isNaN(r) || isNaN(s)) return null;
  const i = new Date(Date.UTC(n, r, s));
  return i.getUTCFullYear() !== n || i.getUTCMonth() !== r || i.getUTCDate() !== s ? null : i;
}
function pt(e) {
  if (!e || !(e instanceof Date) || isNaN(e.getTime())) return "";
  const t = e.getUTCFullYear(), n = String(e.getUTCMonth() + 1).padStart(2, "0"), r = String(e.getUTCDate()).padStart(2, "0");
  return `${t}-${n}-${r}`;
}
function be(e, t) {
  const n = H(e);
  return n ? (n.setUTCDate(n.getUTCDate() + t), pt(n)) : e;
}
function Xe(e, t) {
  return be(e, -t);
}
function Ne(e, t) {
  const n = H(e);
  if (!n) return !1;
  const r = n.getUTCDay();
  return (t && Array.isArray(t.weekendDays) ? t.weekendDays : [0, 6]).includes(r);
}
function Se(e, t) {
  return !t || !Array.isArray(t.holidays) ? !1 : t.holidays.some((n) => typeof n == "string" ? n === e : n && n.date === e);
}
function Re(e, t) {
  return !t || !Array.isArray(t.blackoutDates) ? !1 : t.blackoutDates.some((n) => typeof n == "string" ? n === e : n && n.date === e);
}
function de(e, t) {
  return !(!H(e) || Ne(e, t) || Se(e, t) || Re(e, t));
}
function mt(e, t) {
  return !(!H(e) || Ne(e, t) || Se(e, t));
}
function Ke(e, t, n) {
  let r = e;
  if (t === 0) return r;
  const s = t > 0 ? 1 : -1;
  let i = Math.abs(t);
  for (; i > 0; )
    r = be(r, s), mt(r, n) && i--;
  return r;
}
function ht(e, t, n) {
  return Ke(e, -t, n);
}
function ze(e, t) {
  let n = e;
  for (; !de(n, t); )
    n = Xe(n, 1);
  return n;
}
function Qe(e, t) {
  let n = e;
  for (; !de(n, t); )
    n = be(n, 1);
  return n;
}
function we(e, t) {
  const n = [];
  if (Ne(e, t) && n.push("weekend"), Se(e, t)) {
    const r = (t.holidays || []).find((i) => typeof i == "string" ? i === e : i && i.date === e), s = typeof r == "object" && r.name ? `holiday (${r.name})` : "holiday";
    n.push(s);
  }
  if (Re(e, t)) {
    const r = (t.blackoutDates || []).find((i) => typeof i == "string" ? i === e : i && i.date === e), s = typeof r == "object" && r.name ? `blackout date (${r.name})` : "blackout date";
    n.push(s);
  }
  return n.length > 0 ? n.join(", ") : null;
}
function Be(e, t, n, r = "previous") {
  if (!e || !Array.isArray(e.actions) || !t) return [];
  const s = [...e.actions].sort((l, d) => l.sequence - d.sequence), i = [], o = /* @__PURE__ */ new Map();
  for (let l = 0; l < s.length; l++) {
    const d = s[l];
    let f = "", m = "";
    if (l === 0)
      f = t, m = "Announcement Anchor";
    else {
      const g = s[l - 1], k = o.get(g.id) || t, L = d.offset || { amount: 0, unit: "calendar_days" }, C = Number(L.amount) || 0;
      L.unit === "business_days" ? (f = Ke(k, C, n), m = `${g.label} (+${C} business_days)`) : (f = be(k, C), m = `${g.label} (+${C} calendar_days)`);
    }
    let p = f, a = !1, u = "";
    if (!de(f, n)) {
      const g = we(f, n);
      p = r === "next" ? Qe(f, n) : ze(f, n), a = !0, u = `Calculated raw date ${f} falls on ${g}. Adjusted to ${r} valid business day ${p}.`;
    }
    o.set(d.id, p), i.push({
      sequence: d.sequence,
      actionId: d.id,
      action: d.label,
      rawDate: f,
      requiredDate: p,
      calculatedFrom: m,
      rule: `${d.offset ? d.offset.amount : 0} ${d.offset ? d.offset.unit : "calendar_days"}`,
      direction: "Forward",
      adjusted: a,
      adjustmentReason: a ? u : "None",
      conflict: "",
      status: a ? "ADJUSTED" : "VALID",
      notes: d.offset && d.offset.placeholder ? "PLACEHOLDER RULE" : ""
    });
  }
  return i;
}
function Ue(e, t, n, r = "previous") {
  if (!e || !Array.isArray(e.actions) || !t) return [];
  const s = [...e.actions].sort((l, d) => l.sequence - d.sequence), i = new Array(s.length), o = /* @__PURE__ */ new Map();
  for (let l = s.length - 1; l >= 0; l--) {
    const d = s[l];
    let f = "", m = "";
    if (l === s.length - 1)
      f = t, m = "Execution Anchor";
    else {
      const g = s[l + 1], k = o.get(g.id) || t, L = g.offset || { amount: 0, unit: "calendar_days" }, C = Number(L.amount) || 0;
      L.unit === "business_days" ? (f = ht(k, C, n), m = `${g.label} (-${C} business_days)`) : (f = Xe(k, C), m = `${g.label} (-${C} calendar_days)`);
    }
    let p = f, a = !1, u = "";
    if (!de(f, n)) {
      const g = we(f, n);
      p = r === "next" ? Qe(f, n) : ze(f, n), a = !0, u = `Calculated raw date ${f} falls on ${g}. Adjusted to ${r} valid business day ${p}.`;
    }
    o.set(d.id, p), i[l] = {
      sequence: d.sequence,
      actionId: d.id,
      action: d.label,
      rawDate: f,
      requiredDate: p,
      calculatedFrom: m,
      rule: `${d.offset ? d.offset.amount : 0} ${d.offset ? d.offset.unit : "calendar_days"}`,
      direction: "Backward",
      adjusted: a,
      adjustmentReason: a ? u : "None",
      conflict: "",
      status: a ? "ADJUSTED" : "VALID",
      notes: d.offset && d.offset.placeholder ? "PLACEHOLDER RULE" : ""
    };
  }
  return i;
}
function yt(e, t, n, r, s = "previous") {
  if (!t && !n)
    return {
      status: "ERROR",
      message: "Please enter at least Announcement Date or Execution Date.",
      schedule: []
    };
  if (t && !n)
    return {
      status: "SUCCESS",
      overallStatus: "CONSISTENT",
      message: "Forward schedule calculated successfully.",
      schedule: Be(e, t, r, s)
    };
  if (!t && n)
    return {
      status: "SUCCESS",
      overallStatus: "CONSISTENT",
      message: "Backward schedule calculated successfully.",
      schedule: Ue(e, n, r, s)
    };
  const i = Be(e, t, r, s), o = Ue(e, n, r, s), l = [], d = [];
  for (let f = 0; f < i.length; f++) {
    const m = i[f], p = o[f];
    m.requiredDate === p.requiredDate ? d.push({
      ...m,
      direction: "Dual (Match)",
      notes: m.notes ? `${m.notes}; Forward and Backward match` : "Forward and Backward match"
    }) : (l.push({
      action: m.action,
      forwardDate: m.requiredDate,
      backwardDate: p.requiredDate
    }), d.push({
      ...m,
      direction: "Dual (Conflict)",
      conflict: `Anchor Discrepancy: Forward (${m.requiredDate}) vs Backward (${p.requiredDate})`,
      status: "INCONSISTENT",
      notes: `Forward calculated ${m.requiredDate}; Backward calculated ${p.requiredDate}`
    }));
  }
  return l.length === 0 ? {
    status: "SUCCESS",
    overallStatus: "CONSISTENT",
    message: "Forward and Backward schedules are completely consistent.",
    schedule: d
  } : {
    status: "SUCCESS",
    overallStatus: "DATE CONFLICT",
    message: `DATE CONFLICT between Announcement and Execution anchors. Disagreements: ${l.map((m) => `${m.action}: Forward=${m.forwardDate} vs Backward=${m.backwardDate}`).join("; ")}`,
    schedule: d,
    discrepancies: l
  };
}
function je(e, t = [], n = {}) {
  if (!Array.isArray(e)) return { schedule: [], conflictCount: 0, conflicts: [] };
  const r = [];
  return {
    schedule: e.map((i, o) => {
      const l = [], d = i.requiredDate;
      if (Array.isArray(t) && t.length > 0) {
        const p = t.filter((a) => (typeof a == "string" ? a : a.date || a["Required Date"] || a.Date) === d);
        if (p.length > 0) {
          const a = p.map((u) => typeof u == "string" ? u : u.title || u.event || u.Action || u.Event || "Existing Event").join(", ");
          l.push({
            type: "same-day",
            message: `Conflicts with imported event(s): ${a}`
          });
        }
      }
      if (Se(d, n)) {
        const p = (n.holidays || []).find((u) => typeof u == "string" ? u === d : u && u.date === d), a = typeof p == "object" && p.name ? p.name : "Holiday";
        l.push({
          type: "holiday",
          message: `Falls on configured holiday (${a})`
        });
      }
      if (Re(d, n)) {
        const p = (n.blackoutDates || []).find((u) => typeof u == "string" ? u === d : u && u.date === d), a = typeof p == "object" && p.name ? p.name : "Blackout Date";
        l.push({
          type: "blackout",
          message: `Falls on configured blackout date (${a})`
        });
      }
      if (o > 0) {
        const p = e[o - 1], a = H(p.requiredDate), u = H(d);
        a && u && u < a && l.push({
          type: "dependency",
          message: `Sequence violation: Date (${d}) is prior to predecessor '${p.action}' (${p.requiredDate})`
        });
      }
      const f = l.map((p) => p.message).join("; ");
      let m = i.status;
      return l.length > 0 && (m = "CONFLICT", r.push({
        sequence: i.sequence,
        action: i.action,
        requiredDate: i.requiredDate,
        conflicts: l
      })), {
        ...i,
        conflict: f || i.conflict || "None",
        status: l.length > 0 ? "CONFLICT" : m
      };
    }),
    conflictCount: r.length,
    conflicts: r
  };
}
function bt(e, t) {
  if (!e && !t)
    return { valid: !1, error: "At least one anchor date (Announcement or Execution) must be provided." };
  if (e && !H(e))
    return { valid: !1, error: "Announcement Date must be a valid YYYY-MM-DD date." };
  if (t && !H(t))
    return { valid: !1, error: "Execution Date must be a valid YYYY-MM-DD date." };
  if (e && t) {
    const n = H(e), r = H(t);
    if (n > r)
      return { valid: !1, error: `Announcement Date (${e}) cannot be after Execution Date (${t}).` };
  }
  return { valid: !0, error: null };
}
function St(e, t, n, r, s) {
  if (!Array.isArray(e) || e.length === 0)
    return { valid: !1, error: "No active schedule to move event." };
  const i = H(n);
  if (!i)
    return { valid: !1, error: "New date must be a valid YYYY-MM-DD date." };
  const o = e.findIndex((m) => m.actionId === t || m.action === t);
  if (o === -1)
    return { valid: !1, error: `Action '${t}' not found in schedule.` };
  const l = e[o], d = [];
  let f = !0;
  if (!de(n, s)) {
    const m = we(n, s);
    d.push(`Warning: Proposed date ${n} is a ${m}.`);
  }
  if (o > 0) {
    const m = e[o - 1], p = H(m.requiredDate);
    p && i < p && (f = !1, d.push(`VIOLATION: Proposed date ${n} precedes predecessor '${m.action}' (${m.requiredDate}).`));
  }
  if (o < e.length - 1) {
    const m = e[o + 1], p = H(m.requiredDate);
    p && i > p && (f = !1, d.push(`VIOLATION: Proposed date ${n} succeeds successor '${m.action}' (${m.requiredDate}).`));
  }
  return f && d.push(`Date change valid. '${l.action}' will be updated from ${l.requiredDate} to ${n}.`), {
    valid: f,
    actionId: l.actionId,
    actionLabel: l.action,
    oldDate: l.requiredDate,
    newDate: n,
    consequences: d,
    requiresExplicitAccept: !0
  };
}
function _e(e) {
  if (e == null) return '""';
  const t = String(e);
  return t.includes('"') || t.includes(",") || t.includes(`
`) || t.includes("\r") ? `"${t.replace(/"/g, '""')}"` : t;
}
function gt(e) {
  if (!e || typeof e != "string") return [];
  const t = e.startsWith("\uFEFF") ? e.slice(1) : e, n = [];
  let r = [], s = "", i = !1;
  for (let o = 0; o < t.length; o++) {
    const l = t[o], d = t[o + 1];
    i ? l === '"' ? d === '"' ? (s += '"', o++) : i = !1 : s += l : l === '"' ? i = !0 : l === "," ? (r.push(s), s = "") : l === "\r" && d === `
` ? (r.push(s), n.push(r), r = [], s = "", o++) : l === `
` || l === "\r" ? (r.push(s), n.push(r), r = [], s = "") : s += l;
  }
  return (s !== "" || r.length > 0) && (r.push(s), n.push(r)), n.filter((o) => o.length > 0 && o.some((l) => l.trim() !== ""));
}
function vt(e) {
  if (!Array.isArray(e) || e.length === 0) return "";
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
  ].map(_e).join(",")];
  for (const r of e) {
    const s = [
      r.sequence,
      r.action,
      r.requiredDate,
      r.calculatedFrom,
      r.rule,
      r.direction,
      r.adjusted ? "Yes" : "No",
      r.adjustmentReason,
      r.conflict,
      r.status,
      r.notes
    ];
    n.push(s.map(_e).join(","));
  }
  return "\uFEFF" + n.join(`\r
`);
}
function Dt(e) {
  return JSON.stringify(e || [], null, 2);
}
function Tt(e, t = "auto") {
  if (!e || typeof e != "string") return [];
  const n = e.trim();
  if (t === "json" || t === "auto" && (n.startsWith("[") || n.startsWith("{")))
    try {
      const o = JSON.parse(n);
      if (Array.isArray(o)) return o;
      if (o && Array.isArray(o.events)) return o.events;
    } catch (o) {
      console.warn("JSON parse failed for calendar import:", o);
    }
  const r = gt(n);
  if (r.length < 2) return [];
  const s = r[0].map((o) => o.trim()), i = [];
  for (let o = 1; o < r.length; o++) {
    const l = r[o], d = (...p) => {
      for (const a of p) {
        const u = s.findIndex((g) => g.toLowerCase() === a.toLowerCase());
        if (u !== -1 && u < l.length && l[u].trim() !== "")
          return l[u].trim();
      }
      return "";
    }, f = d("Date", "Required Date", "Event Date"), m = d("Event", "Title", "Action", "Description", "Name");
    f && i.push({
      id: `ev-${o}`,
      date: f,
      title: m || `Event ${o}`,
      description: d("Description", "Notes")
    });
  }
  return i;
}
let _ = [], pe = [], ce = null;
function Ct(e) {
  const t = document.getElementById("tab-bid-planner");
  if (!t) return;
  const n = t.querySelector("#bp-bid-type"), r = t.querySelector("#bp-rule-set"), s = t.querySelector("#bp-announcement-date"), i = t.querySelector("#bp-execution-date"), o = t.querySelector("#bp-adj-strategy"), l = t.querySelector("#bp-btn-generate"), d = t.querySelector("#bp-btn-clear"), f = t.querySelector("#bp-btn-import-cal"), m = t.querySelector("#bp-file-import-cal"), p = t.querySelector("#bp-btn-export-csv"), a = t.querySelector("#bp-btn-export-json"), u = t.querySelector("#bp-status-banner"), g = t.querySelector("#bp-conflict-section"), k = t.querySelector("#bp-conflict-list"), L = t.querySelector("#bp-row-count"), C = t.querySelector("#bp-schedule-tbody"), $ = t.querySelector("#bp-move-section"), O = t.querySelector("#bp-move-action-select"), J = t.querySelector("#bp-move-new-date"), B = t.querySelector("#bp-btn-validate-move"), A = t.querySelector("#bp-move-consequences"), D = t.querySelector("#bp-btn-confirm-move"), U = t.querySelector("#bp-btn-cancel-move"), W = t.querySelector("#bp-tab-btn-rules"), Y = t.querySelector("#bp-tab-btn-calendar"), F = t.querySelector("#bp-panel-rules-json"), ne = t.querySelector("#bp-panel-calendar-json"), V = t.querySelector("#bp-json-rules"), G = t.querySelector("#bp-json-calendar"), ue = t.querySelector("#bp-btn-apply-rules"), ie = t.querySelector("#bp-btn-reset-rules"), Z = t.querySelector("#bp-btn-download-rules"), X = t.querySelector("#bp-btn-upload-rules"), ee = t.querySelector("#bp-file-upload-rules"), ae = t.querySelector("#bp-btn-apply-calendar"), c = t.querySelector("#bp-btn-reset-calendar"), b = t.querySelector("#bp-btn-download-calendar"), w = t.querySelector("#bp-btn-upload-calendar"), q = t.querySelector("#bp-file-upload-calendar");
  function E() {
    const y = se();
    n && (n.innerHTML = "", (y.bidTypes || []).forEach((h) => {
      const S = document.createElement("option");
      S.value = h.id, S.textContent = h.name, n.appendChild(S);
    }), I());
  }
  function I() {
    if (!n || !r) return;
    const y = se(), h = n.value, S = (y.bidTypes || []).find((v) => v.id === h);
    r.innerHTML = "", S && Array.isArray(S.ruleSets) && S.ruleSets.forEach((v) => {
      const T = document.createElement("option");
      T.value = v.id, T.textContent = v.name, r.appendChild(T);
    });
  }
  function P() {
    V && (V.value = JSON.stringify(se(), null, 2)), G && (G.value = JSON.stringify(le(), null, 2));
  }
  n && n.addEventListener("change", I);
  function te() {
    const y = se(), h = le(), S = n.value, v = r.value, T = s ? s.value : "", j = i ? i.value : "", st = o ? o.value : "previous", Pe = bt(T, j);
    if (!Pe.valid) {
      M("conflict", Pe.error);
      return;
    }
    const $e = Me(y, S, v);
    if (!$e) {
      M("conflict", "Selected Rule Set not found in configuration.");
      return;
    }
    const re = yt($e, T, j, h, st);
    if (re.status !== "SUCCESS") {
      M("conflict", re.message);
      return;
    }
    const fe = je(re.schedule, pe, h);
    _ = fe.schedule, K(_), z(fe.conflicts), fe.conflictCount > 0 ? M("conflict", `Schedule generated with ${fe.conflictCount} calendar conflict(s). Review conflict panel below.`) : re.overallStatus === "DATE CONFLICT" ? M("conflict", re.message) : M("consistent", re.message), p && (p.disabled = !1), a && (a.disabled = !1), rt();
  }
  l && l.addEventListener("click", te), d && d.addEventListener("click", () => {
    s && (s.value = ""), i && (i.value = ""), _ = [], K([]), u && (u.style.display = "none"), g && (g.style.display = "none"), p && (p.disabled = !0), a && (a.disabled = !0);
  });
  function K(y) {
    if (C) {
      if (C.innerHTML = "", !Array.isArray(y) || y.length === 0) {
        C.innerHTML = '<tr><td colspan="11" class="bp-empty-msg">No schedule generated yet. Enter anchor date(s) above and click "Generate Schedule".</td></tr>', L && (L.textContent = "0 Actions");
        return;
      }
      L && (L.textContent = `${y.length} Actions`), y.forEach((h) => {
        const S = document.createElement("tr"), T = `<span class="bp-status-tag ${(h.status || "VALID").toLowerCase()}">${h.status}</span>`, j = h.adjusted ? '<span style="color:#d97706;font-weight:bold;">Yes</span>' : "No";
        S.innerHTML = `
        <td>${h.sequence}</td>
        <td><strong>${Q(h.action)}</strong></td>
        <td><code style="font-weight:bold;color:#2563eb;">${Q(h.requiredDate)}</code></td>
        <td>${Q(h.calculatedFrom)}</td>
        <td>${Q(h.rule)}</td>
        <td>${Q(h.direction)}</td>
        <td>${j}</td>
        <td style="font-size:0.8rem;">${Q(h.adjustmentReason)}</td>
        <td style="color:${h.conflict && h.conflict !== "None" ? "#dc2626" : "inherit"};">${Q(h.conflict || "None")}</td>
        <td>${T}</td>
        <td style="font-size:0.8rem;">${Q(h.notes || "")}</td>
      `, C.appendChild(S);
      });
    }
  }
  function z(y) {
    if (!(!g || !k)) {
      if (k.innerHTML = "", !Array.isArray(y) || y.length === 0) {
        g.style.display = "none";
        return;
      }
      g.style.display = "block", y.forEach((h) => {
        const S = document.createElement("div");
        S.className = "bp-conflict-item";
        const v = h.conflicts.map((T) => T.message).join("<br>");
        S.innerHTML = `
        <div class="bp-conflict-desc">
          <strong>Seq ${h.sequence} - ${Q(h.action)}</strong> (Required Date: <code>${h.requiredDate}</code>)<br>
          ${v}
        </div>
        <div class="bp-button-bar">
          <button type="button" class="btn btn-sm" data-action="keep-date" data-seq="${h.sequence}">Keep Required Date</button>
          <button type="button" class="btn btn-sm btn-cyan" data-action="move-event" data-seq="${h.sequence}">Move Required Event</button>
          <button type="button" class="btn btn-sm" data-action="keep-existing" data-seq="${h.sequence}">Keep Existing Event</button>
          <button type="button" class="btn btn-sm" data-action="resolve-manual" data-seq="${h.sequence}">Resolve Manually</button>
        </div>
      `, k.appendChild(S);
      }), k.querySelectorAll("button[data-action]").forEach((h) => {
        h.addEventListener("click", (S) => {
          const v = S.target.dataset.action, T = Number(S.target.dataset.seq);
          nt(v, T);
        });
      });
    }
  }
  function nt(y, h) {
    const S = _.findIndex((T) => T.sequence === h);
    if (S === -1) return;
    const v = _[S];
    if (y === "keep-date")
      v.status = "VALID (USER KEPT)", v.conflict = "User explicitly kept date despite conflict", oe();
    else if (y === "move-event")
      $ && ($.style.display = "block"), O && (O.value = v.actionId), J && (J.value = v.requiredDate), A && (A.style.display = "none"), D && (D.style.display = "none");
    else if (y === "keep-existing")
      v.status = "DEFERRED", v.notes = "Bid event deferred in favor of existing calendar event", v.conflict = "Deferred", oe();
    else if (y === "resolve-manual") {
      const T = prompt("Enter resolution notes:", "Manually resolved");
      T !== null && (v.status = "RESOLVED", v.notes = T, v.conflict = "Resolved manually", oe());
    }
  }
  function oe() {
    const y = le(), h = je(_, pe, y);
    _ = h.schedule, K(_), z(h.conflicts);
  }
  function rt() {
    O && (O.innerHTML = "", _.forEach((y) => {
      const h = document.createElement("option");
      h.value = y.actionId, h.textContent = `Seq ${y.sequence}: ${y.action} (${y.requiredDate})`, O.appendChild(h);
    }));
  }
  B && B.addEventListener("click", () => {
    const y = O ? O.value : "", h = J ? J.value : "", S = le(), v = se(), T = Me(v, n.value, r.value), j = St(_, y, h, T, S);
    ce = j, A && (A.style.display = "block", A.textContent = j.consequences.join(`
`), j.valid ? (A.style.background = "#f0fdf4", A.style.borderColor = "#86efac", A.style.color = "#166534") : (A.style.background = "#fef2f2", A.style.borderColor = "#fca5a5", A.style.color = "#991b1b")), D && (D.style.display = "inline-block");
  }), D && D.addEventListener("click", () => {
    if (!ce) return;
    const { actionId: y, newDate: h } = ce, S = _.find((v) => v.actionId === y);
    S && (S.requiredDate = h, S.adjusted = !0, S.adjustmentReason = `Manually moved by user to ${h}`, S.status = "MOVED", oe()), $ && ($.style.display = "none"), ce = null;
  }), U && U.addEventListener("click", () => {
    $ && ($.style.display = "none"), ce = null;
  }), f && m && (f.addEventListener("click", () => m.click()), m.addEventListener("change", (y) => {
    const h = y.target.files[0];
    if (!h) return;
    const S = new FileReader();
    S.onload = (v) => {
      const T = v.target.result;
      pe = Tt(T), M("info", `Imported ${pe.length} external calendar event(s).`), _.length > 0 && oe();
    }, S.readAsText(h), m.value = "";
  })), p && p.addEventListener("click", () => {
    const y = vt(_);
    me(y, "bid-planner-schedule.csv", "text/csv;charset=utf-8;");
  }), a && a.addEventListener("click", () => {
    const y = Dt(_);
    me(y, "bid-planner-schedule.json", "application/json");
  }), W && Y && (W.addEventListener("click", () => {
    W.classList.add("active"), Y.classList.remove("active"), F && (F.style.display = "flex"), ne && (ne.style.display = "none");
  }), Y.addEventListener("click", () => {
    Y.classList.add("active"), W.classList.remove("active"), ne && (ne.style.display = "flex"), F && (F.style.display = "none");
  })), ue && V && ue.addEventListener("click", () => {
    try {
      const y = JSON.parse(V.value);
      Fe(y), E(), M("consistent", "Rules JSON validated and saved to localStorage.");
    } catch (y) {
      M("conflict", `Rules JSON error: ${y.message}`);
    }
  }), ie && ie.addEventListener("click", () => {
    ut(), P(), E(), M("info", "Reset Rules configuration to bundled defaults.");
  }), Z && Z.addEventListener("click", () => {
    const y = V ? V.value : JSON.stringify(se(), null, 2);
    me(y, "bid-planner-rules.json", "application/json");
  }), X && ee && (X.addEventListener("click", () => ee.click()), ee.addEventListener("change", (y) => {
    const h = y.target.files[0];
    if (!h) return;
    const S = new FileReader();
    S.onload = (v) => {
      try {
        const T = JSON.parse(v.target.result), j = Le(T);
        if (!j.valid) throw new Error(j.error);
        Fe(T), P(), E(), M("consistent", "Uploaded rules JSON validated and saved.");
      } catch (T) {
        M("conflict", `Upload error: ${T.message}`);
      }
    }, S.readAsText(h), ee.value = "";
  })), ae && G && ae.addEventListener("click", () => {
    try {
      const y = JSON.parse(G.value);
      xe(y), M("consistent", "Calendar JSON validated and saved to localStorage.");
    } catch (y) {
      M("conflict", `Calendar JSON error: ${y.message}`);
    }
  }), c && c.addEventListener("click", () => {
    ft(), P(), M("info", "Reset Calendar configuration to bundled defaults.");
  }), b && b.addEventListener("click", () => {
    const y = G ? G.value : JSON.stringify(le(), null, 2);
    me(y, "bid-planner-calendar.json", "application/json");
  }), w && q && (w.addEventListener("click", () => q.click()), q.addEventListener("change", (y) => {
    const h = y.target.files[0];
    if (!h) return;
    const S = new FileReader();
    S.onload = (v) => {
      try {
        const T = JSON.parse(v.target.result), j = qe(T);
        if (!j.valid) throw new Error(j.error);
        xe(T), P(), M("consistent", "Uploaded calendar JSON validated and saved.");
      } catch (T) {
        M("conflict", `Upload error: ${T.message}`);
      }
    }, S.readAsText(h), q.value = "";
  }));
  function M(y, h) {
    u && (u.style.display = "block", u.className = `bp-status-banner card ${y}`, u.textContent = h);
  }
  E(), P();
}
function Q(e) {
  return e == null ? "" : String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function me(e, t, n) {
  const r = new Blob([e], { type: n }), s = URL.createObjectURL(r), i = document.createElement("a");
  i.href = s, i.download = t, document.body.appendChild(i), i.click(), document.body.removeChild(i), URL.revokeObjectURL(s);
}
const Ze = [
  "Airport Code",
  "Shift Bid Event ID",
  "Schedule Start Date",
  "Schedule End Date",
  "Bid Line ID",
  "Location/Workgroup",
  "Patdown Req",
  "Title",
  "Certification",
  "Schedule Type",
  "Shift Time",
  "Private Bid Line Comments",
  "Public Bid Line Comments",
  "D01 Shift Time",
  "D02 Shift Time",
  "D03 Shift Time",
  "D04 Shift Time",
  "D05 Shift Time",
  "D06 Shift Time",
  "D07 Shift Time",
  "D08 Shift Time",
  "D09 Shift Time",
  "D10 Shift Time",
  "D11 Shift Time",
  "D12 Shift Time",
  "D13 Shift Time",
  "D14 Shift Time",
  "D01 Shift Type",
  "D02 Shift Type",
  "D03 Shift Type",
  "D04 Shift Type",
  "D05 Shift Type",
  "D06 Shift Type",
  "D07 Shift Type",
  "D08 Shift Type",
  "D09 Shift Type",
  "D10 Shift Type",
  "D11 Shift Type",
  "D12 Shift Type",
  "D13 Shift Type",
  "D14 Shift Type",
  "RDOs",
  "Hours/Day",
  "Hours/PP",
  "Days/Week"
], At = [
  { id: 1, header: "Airport Code", values: "3-letter airport code", desc: "3 letter airport code (e.g. ANC, LAX, SFO)." },
  { id: 2, header: "Shift Bid Event ID", values: "Full bid event name, up to 100 characters", desc: "Same value on every line. Must match the Bid Event name in eBid. The v3 sheet says 10 characters; this export keeps the full name you type." },
  { id: 3, header: "Schedule Start Date", values: "YYYY-MM-DD", desc: "Date the schedule becomes effective. D01 is this calendar day, not a hard-coded Sunday." },
  { id: 4, header: "Schedule End Date", values: "YYYY-MM-DD", desc: "Date through which the schedule stays in effect (the bid season, not the 14-day pattern)." },
  { id: 5, header: "Bid Line ID", values: "Text, up to 8 characters", desc: "Unique within the airport. Default Alpha line numbers are exported as 1000 + id (Line 001 → 1001) so eBid does not sort on leading zeros. A custom line code is kept, truncated to 8." },
  { id: 6, header: "Location/Workgroup", values: "Text, up to 30 characters", desc: "Team or checkpoint. Numeric Alpha teams export as Team 01. Blank if the line is not on a team — not a sample name." },
  { id: 7, header: "Patdown Req", values: "Female, Male, None", desc: "Sex required for pat downs on this bid line." },
  { id: 8, header: "Title", values: "TSO, LTSO, ETSO, STSO, ESTI, MSTI, STI, SSA, SSTI, EMT, Single Group", desc: "Rank required. Emp class PT/FT is not a title." },
  { id: 9, header: "Certification", values: "PAX, BAG, DUAL", desc: "From the line function. BAG stays BAG, DFO exports as DUAL, PAX stays PAX. Cert pool letter is not a certification." },
  { id: 10, header: "Schedule Type", values: "FT, PT", desc: "Full-time or part-time. STSO and LTSO are FT. Not inferred from weekly hours." },
  { id: 11, header: "Shift Time", values: "9 chars, 19 chars, or RDO", desc: "Typical military span, breaks included (0400-1230). Split shifts use one space (0900-1300 1500-1900)." },
  { id: 12, header: "Private Bid Line Comments", values: "Text, up to 255 characters", desc: "Scheduling office only. Left blank by this export." },
  { id: 13, header: "Public Bid Line Comments", values: "Text, up to 255 characters", desc: "Bidder-visible. Cert pool is written here as Pool A / Pool B (column M)." },
  { id: 14, header: "D01–D14 Shift Time", values: "Military span or RDO", desc: "Fourteen days beginning on the schedule start date. Week 2 repeats the weekly pattern when the session only stored seven days." },
  { id: 28, header: "D01–D14 Shift Type", values: "Airport, Training, Admin/Avail, or blank", desc: "Blank if and only if that day's shift time is RDO. Training lines use Training. Otherwise the selected workday type." },
  { id: 42, header: "RDOs", values: "SU/MO or SU/MO WE/TH", desc: "Weekday abbreviations joined by /. Week 2 is omitted when it matches week 1; otherwise the weeks are separated by a space." },
  { id: 43, header: "Hours/Day", values: "Calculated", desc: "From the typical shift time, including splits. 30 minutes is subtracted when the gross span is 6 hours or more." },
  { id: 44, header: "Hours/PP", values: "Calculated, max 80", desc: "Non-RDO days in the 14-day pattern times Hours/Day, capped at 80." },
  { id: 45, header: "Days/Week", values: "5 or 5/4", desc: "Work days in week 1. If week 2 differs, both counts are shown (5/4)." }
], Et = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"], kt = ["Single Group", "TSO", "LTSO", "ETSO", "STSO", "ESTI", "MSTI", "STI", "SSA", "SSTI", "EMT"], Je = ["ESTI", "MSTI", "ETSO", "SSTI", "STSO", "LTSO", "STI", "SSA", "EMT"], Lt = ["Airport", "Training", "Admin/Avail"], ve = /^(\d{4}-\d{4})( \d{4}-\d{4})?$/;
function De(e) {
  if (!e) return "";
  if (typeof e.toISODate == "function") {
    const s = e.toISODate();
    if (typeof s == "string" && /^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  }
  if (e instanceof Date && !Number.isNaN(e.getTime())) {
    const s = e.getFullYear(), i = String(e.getMonth() + 1).padStart(2, "0"), o = String(e.getDate()).padStart(2, "0");
    return s + "-" + i + "-" + o;
  }
  const t = String(e).trim(), n = t.match(/^(\d{4}-\d{2}-\d{2})/);
  if (n) return n[1];
  const r = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  return r ? r[3] + "-" + r[1].padStart(2, "0") + "-" + r[2].padStart(2, "0") : "";
}
function qt(e, t) {
  const n = String(e || "").split("-").map(Number);
  if (n.length !== 3 || n.some((s) => !Number.isFinite(s))) return "";
  const r = new Date(Date.UTC(n[0], n[1] - 1, n[2]));
  return r.setUTCDate(r.getUTCDate() + t), r.toISOString().slice(0, 10);
}
function Nt(e) {
  const t = String(e || "").split("-").map(Number);
  return t.length !== 3 || t.some((n) => !Number.isFinite(n)) ? 0 : new Date(Date.UTC(t[0], t[1] - 1, t[2])).getUTCDay();
}
function he(e, t) {
  return e && /^\d{4}-\d{2}-\d{2}$/.test(e) ? Nt(qt(e, t)) : t % 7;
}
function We(e) {
  if (e == null) return "";
  const t = String(e).trim().replace(/[\u2013\u2014]/g, "-"), n = t.match(/^(\d{1,2}):(\d{2})$/);
  if (n) return n[1].padStart(2, "0") + n[2];
  const r = t.match(/^(\d{3,4})$/);
  return r ? r[1].padStart(4, "0") : "";
}
function Ie(e) {
  if (!e) return [];
  const t = String(e).replace(/[\u2013\u2014]/g, "-").replace(/\s*\/\s*/g, " "), n = /(\d{1,2}:\d{2}|\d{3,4})\s*-\s*(\d{1,2}:\d{2}|\d{3,4})/g, r = [];
  let s;
  for (; (s = n.exec(t)) && (r.push({ start: s[1], end: s[2] }), r.length !== 2); )
    ;
  return r;
}
function Te(e) {
  if (!e || !e.length) return "";
  const t = [];
  for (let n = 0; n < Math.min(2, e.length); n++) {
    const r = We(e[n] && e[n].start), s = We(e[n] && e[n].end);
    if (!r || !s) return "";
    t.push(r + "-" + s);
  }
  return t.join(" ");
}
function Rt(e) {
  if (!e || e === "RDO" || !ve.test(e)) return 0;
  let t = 0;
  e.split(" ").forEach((s) => {
    const i = s.split("-"), o = i[0], l = i[1];
    let d = parseInt(o.slice(0, 2), 10) * 60 + parseInt(o.slice(2), 10), f = parseInt(l.slice(0, 2), 10) * 60 + parseInt(l.slice(2), 10);
    f < d && (f += 24 * 60), t += f - d;
  });
  const n = t / 60, r = n >= 6 ? n - 0.5 : n;
  return Math.round(r * 100) / 100;
}
function ye(e) {
  if (!Number.isFinite(e)) return "";
  const t = Math.round(e * 100) / 100;
  return String(t);
}
function wt(e, t) {
  if (!t || !e) return null;
  const n = t[e.id] != null ? t[e.id] : t[String(e.id)];
  return Array.isArray(n) ? n : null;
}
function It(e, t, n, r) {
  if (e && Array.isArray(e._weekdayCells)) {
    const o = e._weekdayCells[he(r, n)];
    return et(o, "").status;
  }
  const s = wt(e, t);
  return s && s.length ? (n < s.length ? s[n] : s[n % s.length]) === "WORK" ? "WORK" : "RDO" : new Set((e && e.rdoDays ? e.rdoDays : []).map(Number)).has(he(r, n)) ? "RDO" : "WORK";
}
function et(e, t) {
  const n = String(e ?? "").trim();
  if (!n || /^rdo$/i.test(n) || /^off$/i.test(n) || n === "—" || n === "-")
    return { status: "RDO", span: "RDO" };
  const r = Ie(n);
  return r.length ? { status: "WORK", span: Te(r) || t || "" } : { status: "WORK", span: t || "" };
}
function Ot(e, t) {
  if (!e || !e.dayTimes) return null;
  const n = e.dayTimes[t] != null ? e.dayTimes[t] : e.dayTimes[String(t)];
  return !n || typeof n != "object" ? null : Array.isArray(n.segments) && n.segments.length >= 2 ? n.segments.slice(0, 2) : n.start && n.end ? [{ start: n.start, end: n.end }] : null;
}
function tt(e, t) {
  if (t && Array.isArray(t.segments) && t.segments.length >= 2) return t.segments.slice(0, 2);
  const n = Ie(e && e.shiftLabel);
  return n.length >= 2 ? n : e && e.startTime && e.endTime ? [{ start: e.startTime, end: e.endTime }] : t && t.start && t.end ? [{ start: t.start, end: t.end }] : n.length ? n : [];
}
function Pt(e, t, n, r) {
  const s = Ot(e, n);
  if (s) return s;
  if (r && typeof r.getEffectiveSegments == "function" && e && e.shiftId)
    try {
      const i = r.getEffectiveSegments(e.shiftId, n);
      if (Array.isArray(i) && i.length) return i.slice(0, 2);
    } catch {
    }
  if (t && t.dayTimes) {
    const i = t.dayTimes[n] != null ? t.dayTimes[n] : t.dayTimes[String(n)];
    if (i && Array.isArray(i.segments) && i.segments.length >= 2) return i.segments.slice(0, 2);
    if (i && i.start && i.end) return [{ start: i.start, end: i.end }];
  }
  return tt(e, t);
}
function $t(e, t) {
  if (!e) return null;
  if (t && typeof t.getShift == "function") {
    const r = t.getShift(e.shiftId);
    if (r) return r;
  }
  return (t && t.shifts || []).find((r) => r && r.id === e.shiftId) || null;
}
function Ft(e, t) {
  const n = String(e && (e.lineCode || e.id) || "").trim(), r = n.replace(/^line\s+/i, "").trim(), s = e && e.id != null ? e.id : "", i = Number(s), o = s !== "" && s != null && Number.isInteger(i), l = o ? String(i).padStart(3, "0") : "", d = !r || o && (r === String(i) || r === l || n.toLowerCase() === ("line " + l).toLowerCase() || n.toLowerCase() === ("line " + String(i)).toLowerCase());
  if (d && o) {
    if (i >= 1e3 && i <= 99999999) return String(i).slice(0, 8);
    if (i >= 0 && i < 1e3) return String(1e3 + i);
  }
  if (!d && r) return r.slice(0, 8);
  if (/^\d+$/.test(r)) {
    const f = Number(r);
    if (r.length >= 4) return r.slice(0, 8);
    if (f >= 0 && f < 1e3) return String(1e3 + f);
  }
  return String(1001 + (t || 0)).slice(0, 8);
}
function xt(e) {
  if (!e) return "TSO";
  if (e.isStso) return "STSO";
  if (e.isLtso) return "LTSO";
  const t = [e.position, e.extraName, e.empClass, e.trainingClass].filter((r) => r != null && String(r).trim() !== "").join(" ");
  if (/single\s*group/i.test(t)) return "Single Group";
  const n = t.toUpperCase();
  for (let r = 0; r < Je.length; r++) {
    const s = Je[r];
    if (n === s || new RegExp("\\b" + s + "\\b").test(n)) return s;
  }
  return "TSO";
}
function Mt(e) {
  if (!e) return "FT";
  const t = String(e.empClass || "").trim().toUpperCase(), n = String(e.position || "").trim().toUpperCase();
  return e.isStso || e.isLtso || t === "STSO" || t === "LTSO" || n === "STSO" || n === "LTSO" ? "FT" : e.isPt === !0 || t === "PT" || n === "PT" ? "PT" : "FT";
}
function Bt(e) {
  const t = String(e && e.function || "").trim().toUpperCase();
  return t === "BAG" || t === "BAGS" ? { cert: "BAG", defaulted: !1, reason: "" } : t === "DFO" || t === "DUAL" ? { cert: "DUAL", defaulted: !1, reason: "" } : t === "PAX" ? { cert: "PAX", defaulted: !1, reason: "" } : t === "TRAINING" ? { cert: "PAX", defaulted: !0, reason: "TRAINING has no eBid certification; defaulted to PAX" } : !t || t === "-" ? { cert: "PAX", defaulted: !0, reason: "Function is blank; certification defaulted to PAX" } : { cert: "PAX", defaulted: !0, reason: "Function " + t + " is not PAX, BAG, or DFO; certification defaulted to PAX" };
}
function Ut(e) {
  const t = String(e ?? "").trim();
  if (!t) return "";
  const n = t.replace(/^pool\s*/i, "").trim(), r = (/^pool\b/i.test(t) ? n : t).toUpperCase();
  return r ? "Pool " + r : "";
}
function jt(e) {
  const t = String(e || "").trim();
  if (!t || t === "—") return "";
  let n = t;
  return /^team\b/i.test(n) && (n = n.replace(/^team\s*/i, "").trim()), /^\d+$/.test(n) ? ("Team " + String(Number(n)).padStart(2, "0")).slice(0, 30) : /^team\b/i.test(t) ? ("Team " + n).slice(0, 30) : t.slice(0, 30);
}
function _t(e) {
  const t = String(e ?? "").trim().toUpperCase();
  return t === "M" || t === "MALE" ? "Male" : t === "F" || t === "FEMALE" ? "Female" : "None";
}
function Jt(e, t) {
  if (!e) return "";
  if (t && typeof t.teamResolver == "function") {
    const r = t.teamResolver(e.id);
    if (r && (r.name || r.id)) return r.name || r.id;
  }
  const n = t && t.teams || [];
  for (let r = 0; r < n.length; r++) {
    const s = n[r] && n[r].members;
    if (Array.isArray(s) && s.some((i) => String(i) === String(e.id)))
      return n[r].name || n[r].id || "";
  }
  return "";
}
function Wt(e) {
  if (!e) return !1;
  const t = String(e.empClass || "").toUpperCase(), n = String(e.extraName || "").toUpperCase();
  return !!(e.isTraining || e.trainingClass || e.function === "TRAINING" || t === "ESTI" || t === "MSTI" || n === "ESTI" || n === "MSTI");
}
function Ht(e, t, n) {
  if (Wt(t)) return "Training";
  if (e === "Admin/Avail") return "Admin/Avail";
  if (e === "Training") return "Training";
  if (e === "PandemicMix") {
    if (n === 1) return "Admin/Avail";
    if (n === 2) return "Training";
  }
  return "Airport";
}
function Yt(e, t) {
  const n = [], r = [];
  for (let o = 0; o < 14; o++) {
    if (!e[o]) continue;
    const l = Et[he(t, o)] || "";
    (o < 7 ? n : r).push(l);
  }
  const s = n.join("/"), i = r.join("/");
  return s === i ? s : (s + " " + i).trim();
}
function Vt(e, t, n) {
  t = t || {};
  const r = [], s = De(t.startDate);
  s || r.push("Schedule start date is blank; D01 is treated as Sunday.");
  const i = $t(e, t), o = Te(tt(e, i)), l = [], d = [], f = [];
  let m = 0;
  for (let D = 0; D < 14; D++) {
    if (It(e, t.schedule, D, s) === "RDO") {
      l.push("RDO"), d.push(""), f.push(!0);
      continue;
    }
    f.push(!1);
    const W = he(s, D);
    let Y = "";
    e && Array.isArray(e._weekdayCells) ? Y = et(e._weekdayCells[W], o).span : Y = Te(Pt(e, i, W, t)) || o, Y || r.push("D" + String(D + 1).padStart(2, "0") + " is a work day with no shift time."), l.push(Y), m += 1, d.push(Ht(t.shiftTypeMode, e, m));
  }
  const p = l.filter((D) => D && D !== "RDO");
  let a = o;
  if (p.length) {
    const D = {};
    p.forEach((U) => {
      D[U] = (D[U] || 0) + 1;
    }), a = Object.keys(D).sort((U, W) => D[W] - D[U] || U.localeCompare(W))[0];
  }
  a || (a = p.length ? "" : "RDO");
  const u = Rt(a), g = l.filter((D) => D !== "RDO").length;
  let k = Math.round(g * u * 100) / 100, L = !1;
  k > 80 && (k = 80, L = !0, r.push("Hours/PP capped at 80."));
  const C = l.slice(0, 7).filter((D) => D !== "RDO").length, $ = l.slice(7).filter((D) => D !== "RDO").length, O = Bt(e);
  O.defaulted && O.reason && r.push(O.reason);
  const J = e && e.certPool != null ? String(e.certPool).trim() : "";
  J || r.push("Cert pool is blank; column 13 (Public Bid Line Comments) is empty."), (e && e.sex != null ? String(e.sex).trim() : "") || r.push("Sex is blank; Patdown Req exported as None.");
  const A = jt(Jt(e, t));
  return {
    airportCode: String(t.airportCode || "").trim().toUpperCase(),
    bidEventId: String(t.bidEventId || "").trim(),
    startDate: s,
    endDate: De(t.endDate),
    bidLineId: Ft(e, n),
    workgroup: A,
    patDown: _t(e && e.sex),
    title: xt(e),
    certification: O.cert,
    schedType: Mt(e),
    shiftTime: a,
    privateComments: "",
    publicComments: Ut(J),
    dayShiftTimes: l,
    dayShiftTypes: d,
    rdos: Yt(f, s),
    hoursPerDay: u,
    hoursPerPP: k,
    daysPerWeek: C === $ ? String(C) : C + "/" + $,
    capped: L,
    warnings: r,
    sourceId: e && e.id != null ? e.id : ""
  };
}
function Ce(e) {
  return [
    e.airportCode,
    e.bidEventId,
    e.startDate,
    e.endDate,
    e.bidLineId,
    e.workgroup,
    e.patDown,
    e.title,
    e.certification,
    e.schedType,
    e.shiftTime,
    e.privateComments,
    e.publicComments,
    ...e.dayShiftTimes,
    ...e.dayShiftTypes,
    e.rdos,
    ye(e.hoursPerDay),
    ye(e.hoursPerPP),
    e.daysPerWeek
  ];
}
function Gt(e) {
  return (e || []).slice().sort((t, n) => {
    const r = Number(t && t.id), s = Number(n && n.id), i = Number.isFinite(r), o = Number.isFinite(s);
    return i && o && r !== s ? r - s : i !== o ? i ? -1 : 1 : String(t && t.id).localeCompare(String(n && n.id));
  });
}
function Oe(e, t) {
  return Gt(e).filter((n) => n && typeof n == "object").map((n, r) => Vt(n, t, r));
}
function Xt(e) {
  if (!e || !/^\d{4}-\d{2}-\d{2}$/.test(e)) return "";
  const t = e.slice(0, 4) + "-12-31";
  return t < e ? e : t;
}
function Ae(e) {
  const t = e || {}, n = t.state || {}, r = De(n.startDate);
  let s = "";
  typeof t.getAirportCode == "function" && (s = t.getAirportCode() || ""), !s && n.airportCode && (s = n.airportCode), s = String(s || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
  const i = s && r ? (s + r.slice(0, 7)).slice(0, 10) : "";
  return {
    airportCode: s,
    bidEventId: i,
    startDate: r,
    endDate: Xt(r),
    shiftTypeMode: "Airport"
  };
}
function Kt(e, t) {
  const n = e || {}, r = n.state || {}, s = t || {}, i = Ae(n);
  return {
    airportCode: s.airportCode != null ? s.airportCode : i.airportCode,
    bidEventId: s.bidEventId != null ? s.bidEventId : i.bidEventId,
    startDate: s.startDate != null ? s.startDate : i.startDate,
    endDate: s.endDate != null ? s.endDate : i.endDate,
    shiftTypeMode: s.shiftTypeMode || "Airport",
    shifts: r.shifts || [],
    schedule: r.schedule || {},
    teams: n.teams && Array.isArray(n.teams.teams) && n.teams.teams || r.teams || [],
    getShift: typeof n.getShift == "function" ? function(o) {
      return n.getShift(o);
    } : null,
    getEffectiveSegments: typeof n.getEffectiveShiftSegments == "function" ? function(o, l) {
      return n.getEffectiveShiftSegments(o, l);
    } : null,
    teamResolver: typeof n.teamMetaForLine == "function" ? n.teamMetaForLine : null
  };
}
function zt(e, t) {
  const n = e && e.state || {}, r = Array.isArray(n.lines) ? n.lines : [];
  return Oe(r, Kt(e, t));
}
function Qt(e) {
  const t = (r) => '"' + (r == null ? "" : String(r)).replace(/"/g, '""') + '"', n = [Ze.map(t).join(",")];
  return (e || []).forEach((r) => {
    n.push(Ce(r).map(t).join(","));
  }), n.join(`\r
`);
}
function Zt(e) {
  return String(e || "").replace(/^\uFEFF/, "").split(/\r?\n/).filter((r) => r.trim().length > 0).map((r) => {
    const s = [];
    let i = !1, o = "";
    for (let l = 0; l < r.length; l++) {
      const d = r[l];
      d === '"' ? i && r[l + 1] === '"' ? (o += '"', l++) : i = !i : d === "," && !i ? (s.push(o.trim()), o = "") : o += d;
    }
    return s.push(o.trim()), s;
  });
}
function en(e) {
  const t = {};
  return e.forEach((n, r) => {
    const s = String(n || "").trim().toLowerCase();
    s && t[s] == null && (t[s] = r);
  }), t;
}
function x(e, t) {
  for (let n = 0; n < t.length; n++)
    if (e[t[n]] != null) return e[t[n]];
  return -1;
}
function tn(e) {
  const t = (e || []).map((n) => String(n || "").trim().toLowerCase());
  return t.indexOf("airport code") !== -1 && t.indexOf("d01 shift time") !== -1 && t.indexOf("public bid line comments") !== -1;
}
function nn(e, t) {
  const n = e.line || "", r = n.replace(/^line\s+/i, "").trim();
  let s = n || t + 1;
  /^\d+$/.test(r) && (s = Number(r));
  const i = e.shift || "", o = Ie(i).length ? i : "";
  return {
    id: s,
    lineCode: n || String(s),
    shiftId: "",
    shiftName: o ? "" : i,
    shiftLabel: o || e.shiftLabel || "",
    startTime: e.start || "",
    endTime: e.end || "",
    position: e.position || "",
    empClass: e.emp || "",
    sex: e.sex || "",
    function: e.fn || "",
    certPool: e.certPool || "",
    paid: e.paid || "",
    isTraining: String(e.fn || "").toUpperCase() === "TRAINING",
    _weekdayCells: e.days
  };
}
function He(e, t) {
  const n = Zt(e);
  if (n.length < 2) return { error: "That CSV has no line rows.", rows: [] };
  const r = n[0];
  if (tn(r))
    return {
      error: "That file is already a 45-column eBid export. Build the upload from the live lines instead of re-uploading an old CSV.",
      rows: []
    };
  const s = en(r), i = {
    team: x(s, ["team", "partner team", "location/workgroup", "workgroup"]),
    line: x(s, ["line", "line id", "bid line id"]),
    shift: x(s, ["shift"]),
    start: x(s, ["start"]),
    end: x(s, ["end"]),
    position: x(s, ["position", "title"]),
    emp: x(s, ["emp", "emp class", "schedule type"]),
    sex: x(s, ["sex", "gender", "patdown req", "pat down req"]),
    fn: x(s, ["function", "cert", "certification"]),
    certPool: x(s, ["cert pool", "certpool", "public bid line comments"]),
    paid: x(s, ["paid", "hours/day"]),
    sun: x(s, ["sun"]),
    mon: x(s, ["mon"]),
    tue: x(s, ["tue"]),
    wed: x(s, ["wed"]),
    thu: x(s, ["thu"]),
    fri: x(s, ["fri"]),
    sat: x(s, ["sat"])
  };
  if (i.line < 0 && i.position < 0 && i.sun < 0)
    return { error: "That CSV is not a lines export (expected Line, Team, Start/End, or Sun–Sat columns).", rows: [] };
  const o = [i.sun, i.mon, i.tue, i.wed, i.thu, i.fri, i.sat], l = [], d = [];
  for (let m = 1; m < n.length; m++) {
    const p = n[m];
    if (!p || p.every((k) => !String(k || "").trim())) continue;
    const a = (k) => k >= 0 && p[k] != null ? String(p[k]).trim() : "", u = {
      team: a(i.team),
      line: a(i.line),
      shift: a(i.shift),
      start: a(i.start),
      end: a(i.end),
      position: a(i.position),
      emp: a(i.emp),
      sex: a(i.sex),
      fn: a(i.fn),
      certPool: a(i.certPool),
      paid: a(i.paid),
      days: o.map(a)
    }, g = nn(u, l.length);
    u.team && d.push({ id: "t" + m, name: u.team, members: [g.id] }), l.push(g);
  }
  const f = Object.assign({}, t || {}, { teams: d, schedule: {}, shifts: [] });
  return { error: "", rows: Oe(l, f) };
}
function ge(e, t) {
  if (!e || typeof e != "object") return { error: "That JSON is empty.", rows: [] };
  const n = e.results && typeof e.results == "object" ? e.results : e, r = e.config && typeof e.config == "object" ? e.config : {}, s = Array.isArray(n.lines) ? n.lines : Array.isArray(e.lines) ? e.lines : null;
  if (!s) return { error: "That JSON has no lines array.", rows: [] };
  const i = n.schedule || e.schedule || {}, o = n.teams || e.teams || [], l = r.shifts || e.shifts || [], d = t && t.startDate || r.startDate || e.startDate || "", f = {
    airportCode: t && t.airportCode,
    bidEventId: t && t.bidEventId,
    startDate: d,
    endDate: t && t.endDate,
    shiftTypeMode: t && t.shiftTypeMode || "Airport",
    shifts: l,
    schedule: i,
    teams: o,
    getShift: function(m) {
      return (l || []).find((p) => p && p.id === m) || null;
    }
  };
  return { error: "", rows: Oe(s, f) };
}
function N(e, t, n, r, s) {
  e.push({ level: t, code: n, message: r, lineId: s });
}
function Ye(e) {
  const t = Array.isArray(e) ? e : [], n = [];
  if (!t.length)
    return {
      total: 0,
      ft: 0,
      pt: 0,
      male: 0,
      female: 0,
      errors: 0,
      warnings: 0,
      issues: [],
      distinct: {},
      empty: !0
    };
  const r = {};
  let s = 0, i = 0, o = 0, l = 0;
  const d = {
    "Airport Code": {},
    "Schedule Type": {},
    Title: {},
    "Patdown Req": {},
    Certification: {},
    "Public Comments (Cert Pool)": {},
    "Shift Time": {},
    RDOs: {},
    "Hours/Day": {},
    "Hours/PP": {},
    "Days/Week": {}
  };
  function f(a, u) {
    const g = u == null || u === "" ? "(blank)" : String(u);
    d[a][g] = (d[a][g] || 0) + 1;
  }
  t.forEach((a) => {
    const u = a.bidLineId || "(no id)";
    a.schedType === "FT" ? s += 1 : a.schedType === "PT" && (i += 1), a.patDown === "Male" ? o += 1 : a.patDown === "Female" && (l += 1), f("Airport Code", a.airportCode), f("Schedule Type", a.schedType), f("Title", a.title), f("Patdown Req", a.patDown), f("Certification", a.certification), f("Public Comments (Cert Pool)", a.publicComments), f("Shift Time", a.shiftTime), f("RDOs", a.rdos), f("Hours/Day", ye(a.hoursPerDay)), f("Hours/PP", ye(a.hoursPerPP)), f("Days/Week", a.daysPerWeek), /^[A-Z]{3}$/.test(a.airportCode || "") || N(n, "error", "airport", "Airport code must be 3 letters.", u), a.bidEventId ? a.bidEventId.length > 100 && N(n, "error", "event", "Shift Bid Event ID is longer than 100 characters.", u) : N(n, "error", "event", "Shift Bid Event ID is blank.", u), a.startDate || N(n, "error", "start", "Schedule start date is blank.", u), a.endDate ? a.startDate && a.endDate < a.startDate && N(n, "error", "end", "Schedule end date is before the start date.", u) : N(n, "error", "end", "Schedule end date is blank.", u), a.bidLineId ? String(a.bidLineId).length > 8 ? N(n, "error", "line-id", "Bid Line ID is longer than 8 characters.", u) : r[a.bidLineId] && N(n, "error", "line-id", "Bid Line ID " + a.bidLineId + " is duplicated.", u) : N(n, "error", "line-id", "Bid Line ID is blank.", u), a.bidLineId && (r[a.bidLineId] = !0), a.workgroup ? a.workgroup.length > 30 && N(n, "error", "team", "Location/Workgroup is longer than 30 characters.", u) : N(n, "warn", "team", "Location/Workgroup is blank.", u), ["Female", "Male", "None"].indexOf(a.patDown) < 0 && N(n, "error", "patdown", "Patdown Req must be Female, Male, or None.", u), kt.indexOf(a.title) < 0 && N(n, "error", "title", "Title " + a.title + " is not an eBid title.", u), ["PAX", "BAG", "DUAL"].indexOf(a.certification) < 0 && N(n, "error", "cert", "Certification must be PAX, BAG, or DUAL.", u), a.schedType !== "FT" && a.schedType !== "PT" && N(n, "error", "sched", "Schedule type must be FT or PT.", u), a.shiftTime !== "RDO" && !ve.test(a.shiftTime || "") && N(n, "error", "shift", "Shift time must be 9 or 19 military characters, or RDO.", u), String(a.privateComments || "").length > 255 && N(n, "error", "private", "Private comments exceed 255 characters.", u), String(a.publicComments || "").length > 255 && N(n, "error", "public", "Public comments exceed 255 characters.", u);
    const g = a.dayShiftTimes || [], k = a.dayShiftTypes || [];
    (g.length !== 14 || k.length !== 14) && N(n, "error", "days", "Expected 14 day times and 14 day types.", u);
    for (let L = 0; L < 14; L++) {
      const C = g[L], $ = k[L], O = "D" + String(L + 1).padStart(2, "0");
      C !== "RDO" && !ve.test(C || "") && N(n, "error", "day-time", O + " shift time is not RDO or a 9/19-character military span.", u), C === "RDO" && $ ? N(n, "error", "rdo-type", O + " is RDO but shift type is not blank.", u) : C !== "RDO" && !$ ? N(n, "error", "rdo-type", O + " is a work day but shift type is blank.", u) : $ && Lt.indexOf($) < 0 && N(n, "error", "day-type", O + " shift type " + $ + " is not Airport, Training, or Admin/Avail.", u);
    }
    Number(a.hoursPerPP) > 80 && N(n, "error", "hours", "Hours/PP is over 80.", u), (a.warnings || []).forEach((L) => N(n, "warn", "line", L, u));
  });
  const m = n.filter((a) => a.level === "error").length, p = n.filter((a) => a.level === "warn").length;
  return {
    total: t.length,
    ft: s,
    pt: i,
    male: o,
    female: l,
    errors: m,
    warnings: p,
    issues: n,
    distinct: d,
    empty: !1
  };
}
function R(e, t, n) {
  const r = document.createElement(e);
  return t && Object.keys(t).forEach((s) => {
    s === "className" ? r.className = t[s] : s === "hidden" ? r.hidden = !!t[s] : r.setAttribute(s, t[s]);
  }), n != null && (r.textContent = n), r;
}
function rn(e) {
  const t = e || (typeof window < "u" ? window.Scheduler : null), n = document.getElementById("tab-bid-planner");
  if (!n || !t || n.dataset.ebidBound === "1") return;
  const r = n.querySelector("#bp-ebid-root"), s = n.querySelector("#bp-miles-root");
  if (!r || !s) return;
  n.dataset.ebidBound = "1";
  const i = r.querySelector("#ebid-airport"), o = r.querySelector("#ebid-event"), l = r.querySelector("#ebid-start"), d = r.querySelector("#ebid-end"), f = r.querySelector("#ebid-shift-type"), m = r.querySelector("#ebid-source-badge"), p = r.querySelector("#ebid-status"), a = r.querySelector("#ebid-row-count"), u = r.querySelector("#ebid-head"), g = r.querySelector("#ebid-body"), k = r.querySelector("#ebid-search"), L = r.querySelector("#ebid-qa-summary"), C = r.querySelector("#ebid-qa-list"), $ = r.querySelector("#ebid-qa-distinct"), O = r.querySelector("#ebid-rules"), J = r.querySelector("#ebid-file");
  let B = { kind: "live", label: "LIVE LINES" }, A = [], D = "";
  function U() {
    return {
      airportCode: i.value.trim().toUpperCase(),
      bidEventId: o.value.trim(),
      startDate: l.value,
      endDate: d.value,
      shiftTypeMode: f.value || "Airport"
    };
  }
  function W() {
    const c = Ae(t);
    !i.value && c.airportCode && (i.value = c.airportCode), !o.value && c.bidEventId && (o.value = c.bidEventId), !l.value && c.startDate && (l.value = c.startDate), !d.value && c.endDate && (d.value = c.endDate);
  }
  function Y() {
    const c = Ae(t);
    i.value = c.airportCode || "", o.value = c.bidEventId || "", l.value = c.startDate || "", d.value = c.endDate || "", f.value = "Airport";
  }
  function F(c) {
    p.textContent = c || "";
  }
  function ne() {
    u.textContent = "", Ze.forEach((c) => u.appendChild(R("th", null, c)));
  }
  function V(c) {
    if (g.textContent = "", a.textContent = String(A.length) + (D ? " · " + c.length + " match" : ""), !c.length) {
      const b = R("tr"), w = R("td", { colspan: "45", className: "bp-empty-msg" });
      w.textContent = A.length ? "No lines match that search." : "No lines in this session. Generate on Setup, then come back — or import a JSON / lines CSV as a fallback. Sample rows are not loaded.", b.appendChild(w), g.appendChild(b);
      return;
    }
    c.forEach((b) => {
      const w = R("tr");
      Ce(b).forEach((q, E) => {
        const I = R("td", null, q == null ? "" : String(q));
        E >= 27 && E <= 40 && Ce(b)[E - 14] === "RDO" && !q && (I.className = "ebid-rdo-type"), w.appendChild(I);
      }), g.appendChild(w);
    });
  }
  function G() {
    const c = D.trim().toLowerCase();
    return c ? A.filter((b) => [
      b.bidLineId,
      b.workgroup,
      b.title,
      b.patDown,
      b.schedType,
      b.certification,
      b.shiftTime,
      b.rdos,
      b.publicComments
    ].join(" ").toLowerCase().indexOf(c) !== -1) : A;
  }
  function ue(c) {
    if (L.textContent = "", C.textContent = "", $.textContent = "", c.empty) {
      L.appendChild(R("p", { className: "bp-empty-msg" }, "No lines to check. Totals stay at zero until this session has lines."));
      return;
    }
    const b = [
      ["Lines", String(c.total)],
      ["Schedule", c.ft + " FT / " + c.pt + " PT"],
      ["Pat down", c.male + " M / " + c.female + " F"],
      ["Rule breaks", c.errors + " error / " + c.warnings + " warn"]
    ], w = R("div", { className: "ebid-stat-grid" });
    b.forEach((E) => {
      const I = R("div", { className: "ebid-stat" });
      I.appendChild(R("div", { className: "ebid-stat-label" }, E[0])), I.appendChild(R("div", { className: "ebid-stat-value" }, E[1])), w.appendChild(I);
    }), L.appendChild(w);
    const q = c.issues.slice(0, 80);
    q.length ? (q.forEach((E) => {
      const I = R("div", { className: "ebid-issue ebid-issue-" + E.level });
      I.appendChild(R("span", { className: "ebid-issue-level" }, E.level === "error" ? "FAIL" : "WARN"));
      const P = (E.lineId ? "Line " + E.lineId + " — " : "") + E.message;
      I.appendChild(R("span", null, P)), C.appendChild(I);
    }), c.issues.length > q.length && C.appendChild(R("p", { className: "bp-subtitle" }, c.issues.length - q.length + " more not shown."))) : C.appendChild(R("p", { className: "ebid-pass" }, "No rule breaks. RDO shift types are blank, cert pools sit in column 13, and the row is 45 columns (A–AS).")), Object.keys(c.distinct).forEach((E) => {
      const I = R("div", { className: "ebid-distinct" }), P = c.distinct[E], te = Object.keys(P);
      I.appendChild(R("h4", null, E + " · " + te.length)), te.sort((K, z) => P[z] - P[K] || K.localeCompare(z)).forEach((K) => {
        const z = R("div", { className: "ebid-distinct-row" });
        z.appendChild(R("span", null, K)), z.appendChild(R("span", null, String(P[K]))), I.appendChild(z);
      }), $.appendChild(I);
    });
  }
  function ie() {
    O.dataset.ready !== "1" && (O.dataset.ready = "1", At.forEach((c) => {
      const b = R("tr");
      b.appendChild(R("td", null, String(c.id))), b.appendChild(R("td", null, c.header)), b.appendChild(R("td", null, c.values)), b.appendChild(R("td", null, c.desc)), O.appendChild(b);
    }));
  }
  function Z(c, b) {
    A = c || [], m.textContent = b || B.label;
    const w = Ye(A);
    V(G()), ue(w);
    const q = t.state && Array.isArray(t.state.lines) ? t.state.lines.length : 0;
    B.kind === "live" && F(A.length ? A.length + " line(s) from this session." : "Session has " + q + " line(s).");
  }
  function X() {
    B.kind === "live" && (W(), Z(zt(t, U()), "LIVE LINES"));
  }
  function ee(c) {
    ["lines", "qa", "info"].forEach((b) => {
      const w = r.querySelector("#ebid-tab-" + b), q = r.querySelector('[data-ebid-tab="' + b + '"]');
      w && (w.hidden = b !== c), q && q.classList.toggle("active", b === c);
    }), c === "info" && ie();
  }
  function ae(c) {
    r.hidden = c !== "ebid", s.hidden = c !== "miles", n.querySelectorAll("[data-bp-view]").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-bp-view") === c);
    }), c === "ebid" && X();
  }
  if (ne(), ie(), ee("lines"), ae("ebid"), X(), r.querySelector("#ebid-apply").addEventListener("click", () => {
    if (B.kind === "csv") {
      const c = He(B.text, U());
      if (c.error) {
        F(c.error);
        return;
      }
      Z(c.rows, B.label), F(c.rows.length + " line(s) from the imported CSV.");
      return;
    }
    if (B.kind === "json") {
      const c = ge(B.data, U());
      if (c.error) {
        F(c.error);
        return;
      }
      Z(c.rows, B.label), F(c.rows.length + " line(s) from the imported JSON.");
      return;
    }
    X();
  }), r.querySelector("#ebid-live").addEventListener("click", () => {
    B = { kind: "live", label: "LIVE LINES" }, Y(), X(), F("Using the lines in this session.");
  }), r.querySelector("#ebid-export").addEventListener("click", () => {
    if (!A.length) {
      F("Nothing to export. Generate lines or import a fallback file.");
      return;
    }
    const c = Ye(A), b = Qt(A), w = new Blob([b], { type: "text/csv;charset=utf-8;" }), q = URL.createObjectURL(w), E = document.createElement("a"), I = (o.value.trim() || "eBid") + "_45Col_Import.csv";
    E.href = q, E.download = I, document.body.appendChild(E), E.click(), document.body.removeChild(E), URL.revokeObjectURL(q), F("Exported " + A.length + " line(s), 45 columns A–AS." + (c.errors ? " QA still has " + c.errors + " error(s)." : ""));
  }), r.querySelector("#ebid-import").addEventListener("click", () => J.click()), J.addEventListener("change", () => {
    const c = J.files && J.files[0];
    if (J.value = "", !c) return;
    const b = new FileReader();
    b.onload = () => {
      const w = String(b.result || ""), q = c.name.toLowerCase();
      if (q.endsWith(".json") || /^\s*[{[]/.test(w))
        try {
          const P = JSON.parse(w), te = ge(P, U());
          if (!te.error) {
            B = { kind: "json", label: "JSON IMPORT", data: P }, W(), P.config && P.config.startDate && !l.value && (l.value = String(P.config.startDate).slice(0, 10)), Z(ge(P, U()).rows, "JSON IMPORT"), F("Fallback import " + c.name + " · " + A.length + " line(s). Live lines are unchanged.");
            return;
          }
          if (q.endsWith(".json")) {
            F(te.error);
            return;
          }
        } catch {
          if (q.endsWith(".json")) {
            F("Could not read that JSON.");
            return;
          }
        }
      const I = He(w, U());
      if (I.error) {
        F(I.error);
        return;
      }
      B = { kind: "csv", label: "CSV IMPORT", text: w }, Z(I.rows, "CSV IMPORT"), F("Fallback import " + c.name + " · " + A.length + " line(s). Live lines are unchanged.");
    }, b.readAsText(c);
  }), k.addEventListener("input", () => {
    D = k.value || "", V(G());
  }), r.querySelectorAll("[data-ebid-tab]").forEach((c) => {
    c.addEventListener("click", () => ee(c.getAttribute("data-ebid-tab")));
  }), n.querySelectorAll("[data-bp-view]").forEach((c) => {
    c.addEventListener("click", () => ae(c.getAttribute("data-bp-view")));
  }), !t.renderAll || !t.renderAll._ebidWrapped) {
    const c = t.renderAll, b = function() {
      typeof c == "function" && c.apply(this, arguments), X();
    };
    b._ebidWrapped = !0, t.renderAll = b;
  }
  document.addEventListener("click", (c) => {
    const b = c.target && c.target.closest ? c.target.closest("#blade-tabs .tab-btn") : null;
    b && b.dataset.tab === "bid-planner" && X();
  });
}
function sn(e) {
  const t = e || window.Scheduler;
  rn(t), Ct();
}
export {
  sn as default,
  sn as initBidPlanner
};
