var e = { bidTypes: [{
	id: "leave-bid",
	name: "Leave Bid",
	ruleSets: [{
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
	}]
}, {
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
}] }, t = {
	weekendDays: [0, 6],
	holidays: [
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
	],
	blackoutDates: [
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
	]
}, n = "blade-bid-planner-rules", r = "blade-bid-planner-calendar";
function i(e) {
	if (!e || typeof e != "object") return {
		valid: !1,
		error: "Rules config must be a JSON object."
	};
	if (!Array.isArray(e.bidTypes) || e.bidTypes.length === 0) return {
		valid: !1,
		error: "Rules config must contain a non-empty 'bidTypes' array."
	};
	for (let t of e.bidTypes) {
		if (!t.id || !t.name || !Array.isArray(t.ruleSets) || t.ruleSets.length === 0) return {
			valid: !1,
			error: `Bid type '${t.name || t.id || "unnamed"}' must have id, name, and ruleSets.`
		};
		for (let e of t.ruleSets) {
			if (!e.id || !e.name || !Array.isArray(e.actions) || e.actions.length === 0) return {
				valid: !1,
				error: `Rule set '${e.name || e.id || "unnamed"}' must have id, name, and actions.`
			};
			for (let t of e.actions) {
				if (!t.id || !t.label || typeof t.sequence != "number") return {
					valid: !1,
					error: `Action '${t.label || t.id}' must have id, label, and numeric sequence.`
				};
				if (!t.offset || typeof t.offset.amount != "number" || t.offset.amount < 0) return {
					valid: !1,
					error: `Action '${t.label}' offset amount must be a non-negative number.`
				};
				if (!["calendar_days", "business_days"].includes(t.offset.unit)) return {
					valid: !1,
					error: `Action '${t.label}' offset unit must be 'calendar_days' or 'business_days'.`
				};
			}
		}
	}
	return {
		valid: !0,
		error: null
	};
}
function a(e) {
	return !e || typeof e != "object" ? {
		valid: !1,
		error: "Calendar config must be a JSON object."
	} : Array.isArray(e.weekendDays) ? Array.isArray(e.holidays) ? Array.isArray(e.blackoutDates) ? {
		valid: !0,
		error: null
	} : {
		valid: !1,
		error: "Calendar config must contain a 'blackoutDates' array."
	} : {
		valid: !1,
		error: "Calendar config must contain a 'holidays' array."
	} : {
		valid: !1,
		error: "Calendar config must contain a 'weekendDays' array."
	};
}
function o() {
	return JSON.parse(JSON.stringify(e));
}
function s() {
	return JSON.parse(JSON.stringify(t));
}
function c() {
	try {
		if (typeof localStorage < "u") {
			let e = localStorage.getItem(n);
			if (e) {
				let t = JSON.parse(e);
				if (i(t).valid) return t;
			}
		}
	} catch (e) {
		console.warn("Error loading stored bid planner rules, falling back to default:", e);
	}
	return o();
}
function l(e) {
	let t = i(e);
	if (!t.valid) throw Error(t.error);
	return typeof localStorage < "u" && localStorage.setItem(n, JSON.stringify(e, null, 2)), !0;
}
function u() {
	return typeof localStorage < "u" && localStorage.removeItem(n), o();
}
function d() {
	try {
		if (typeof localStorage < "u") {
			let e = localStorage.getItem(r);
			if (e) {
				let t = JSON.parse(e);
				if (a(t).valid) return t;
			}
		}
	} catch (e) {
		console.warn("Error loading stored bid planner calendar, falling back to default:", e);
	}
	return s();
}
function f(e) {
	let t = a(e);
	if (!t.valid) throw Error(t.error);
	return typeof localStorage < "u" && localStorage.setItem(r, JSON.stringify(e, null, 2)), !0;
}
function p() {
	return typeof localStorage < "u" && localStorage.removeItem(r), s();
}
function m(e, t, n) {
	if (!e || !Array.isArray(e.bidTypes)) return null;
	let r = e.bidTypes.find((e) => e.id === t);
	return !r || !Array.isArray(r.ruleSets) ? null : r.ruleSets.find((e) => e.id === n) || null;
}
//#endregion
//#region modules/bid-planner/js/calendar.js
function h(e) {
	if (!e || typeof e != "string") return null;
	let t = e.trim().split("-");
	if (t.length !== 3) return null;
	let n = parseInt(t[0], 10), r = parseInt(t[1], 10) - 1, i = parseInt(t[2], 10);
	if (isNaN(n) || isNaN(r) || isNaN(i)) return null;
	let a = new Date(Date.UTC(n, r, i));
	return a.getUTCFullYear() !== n || a.getUTCMonth() !== r || a.getUTCDate() !== i ? null : a;
}
function g(e) {
	return !e || !(e instanceof Date) || isNaN(e.getTime()) ? "" : `${e.getUTCFullYear()}-${String(e.getUTCMonth() + 1).padStart(2, "0")}-${String(e.getUTCDate()).padStart(2, "0")}`;
}
function _(e, t) {
	let n = h(e);
	return n ? (n.setUTCDate(n.getUTCDate() + t), g(n)) : e;
}
function v(e, t) {
	return _(e, -t);
}
function y(e, t) {
	let n = h(e);
	if (!n) return !1;
	let r = n.getUTCDay();
	return (t && Array.isArray(t.weekendDays) ? t.weekendDays : [0, 6]).includes(r);
}
function b(e, t) {
	return !t || !Array.isArray(t.holidays) ? !1 : t.holidays.some((t) => typeof t == "string" ? t === e : t && t.date === e);
}
function x(e, t) {
	return !t || !Array.isArray(t.blackoutDates) ? !1 : t.blackoutDates.some((t) => typeof t == "string" ? t === e : t && t.date === e);
}
function S(e, t) {
	return !(!h(e) || y(e, t) || b(e, t) || x(e, t));
}
function C(e, t) {
	return !(!h(e) || y(e, t) || b(e, t));
}
function w(e, t, n) {
	let r = e;
	if (t === 0) return r;
	let i = t > 0 ? 1 : -1, a = Math.abs(t);
	for (; a > 0;) r = _(r, i), C(r, n) && a--;
	return r;
}
function T(e, t, n) {
	return w(e, -t, n);
}
function E(e, t) {
	let n = e;
	for (; !S(n, t);) n = v(n, 1);
	return n;
}
function D(e, t) {
	let n = e;
	for (; !S(n, t);) n = _(n, 1);
	return n;
}
function O(e, t) {
	let n = [];
	if (y(e, t) && n.push("weekend"), b(e, t)) {
		let r = (t.holidays || []).find((t) => typeof t == "string" ? t === e : t && t.date === e), i = typeof r == "object" && r.name ? `holiday (${r.name})` : "holiday";
		n.push(i);
	}
	if (x(e, t)) {
		let r = (t.blackoutDates || []).find((t) => typeof t == "string" ? t === e : t && t.date === e), i = typeof r == "object" && r.name ? `blackout date (${r.name})` : "blackout date";
		n.push(i);
	}
	return n.length > 0 ? n.join(", ") : null;
}
//#endregion
//#region modules/bid-planner/js/scheduler.js
function k(e, t, n, r = "previous") {
	if (!e || !Array.isArray(e.actions) || !t) return [];
	let i = [...e.actions].sort((e, t) => e.sequence - t.sequence), a = [], o = /* @__PURE__ */ new Map();
	for (let e = 0; e < i.length; e++) {
		let s = i[e], c = "", l = "";
		if (e === 0) c = t, l = "Announcement Anchor";
		else {
			let r = i[e - 1], a = o.get(r.id) || t, u = s.offset || {
				amount: 0,
				unit: "calendar_days"
			}, d = Number(u.amount) || 0;
			u.unit === "business_days" ? (c = w(a, d, n), l = `${r.label} (+${d} business_days)`) : (c = _(a, d), l = `${r.label} (+${d} calendar_days)`);
		}
		let u = c, d = !1, f = "";
		if (!S(c, n)) {
			let e = O(c, n);
			u = r === "next" ? D(c, n) : E(c, n), d = !0, f = `Calculated raw date ${c} falls on ${e}. Adjusted to ${r} valid business day ${u}.`;
		}
		o.set(s.id, u), a.push({
			sequence: s.sequence,
			actionId: s.id,
			action: s.label,
			rawDate: c,
			requiredDate: u,
			calculatedFrom: l,
			rule: `${s.offset ? s.offset.amount : 0} ${s.offset ? s.offset.unit : "calendar_days"}`,
			direction: "Forward",
			adjusted: d,
			adjustmentReason: d ? f : "None",
			conflict: "",
			status: d ? "ADJUSTED" : "VALID",
			notes: s.offset && s.offset.placeholder ? "PLACEHOLDER RULE" : ""
		});
	}
	return a;
}
function A(e, t, n, r = "previous") {
	if (!e || !Array.isArray(e.actions) || !t) return [];
	let i = [...e.actions].sort((e, t) => e.sequence - t.sequence), a = Array(i.length), o = /* @__PURE__ */ new Map();
	for (let e = i.length - 1; e >= 0; e--) {
		let s = i[e], c = "", l = "";
		if (e === i.length - 1) c = t, l = "Execution Anchor";
		else {
			let r = i[e + 1], a = o.get(r.id) || t, s = r.offset || {
				amount: 0,
				unit: "calendar_days"
			}, u = Number(s.amount) || 0;
			s.unit === "business_days" ? (c = T(a, u, n), l = `${r.label} (-${u} business_days)`) : (c = v(a, u), l = `${r.label} (-${u} calendar_days)`);
		}
		let u = c, d = !1, f = "";
		if (!S(c, n)) {
			let e = O(c, n);
			u = r === "next" ? D(c, n) : E(c, n), d = !0, f = `Calculated raw date ${c} falls on ${e}. Adjusted to ${r} valid business day ${u}.`;
		}
		o.set(s.id, u), a[e] = {
			sequence: s.sequence,
			actionId: s.id,
			action: s.label,
			rawDate: c,
			requiredDate: u,
			calculatedFrom: l,
			rule: `${s.offset ? s.offset.amount : 0} ${s.offset ? s.offset.unit : "calendar_days"}`,
			direction: "Backward",
			adjusted: d,
			adjustmentReason: d ? f : "None",
			conflict: "",
			status: d ? "ADJUSTED" : "VALID",
			notes: s.offset && s.offset.placeholder ? "PLACEHOLDER RULE" : ""
		};
	}
	return a;
}
function ee(e, t, n, r, i = "previous") {
	if (!t && !n) return {
		status: "ERROR",
		message: "Please enter at least Announcement Date or Execution Date.",
		schedule: []
	};
	if (t && !n) return {
		status: "SUCCESS",
		overallStatus: "CONSISTENT",
		message: "Forward schedule calculated successfully.",
		schedule: k(e, t, r, i)
	};
	if (!t && n) return {
		status: "SUCCESS",
		overallStatus: "CONSISTENT",
		message: "Backward schedule calculated successfully.",
		schedule: A(e, n, r, i)
	};
	let a = k(e, t, r, i), o = A(e, n, r, i), s = [], c = [];
	for (let e = 0; e < a.length; e++) {
		let t = a[e], n = o[e];
		t.requiredDate === n.requiredDate ? c.push({
			...t,
			direction: "Dual (Match)",
			notes: t.notes ? `${t.notes}; Forward and Backward match` : "Forward and Backward match"
		}) : (s.push({
			action: t.action,
			forwardDate: t.requiredDate,
			backwardDate: n.requiredDate
		}), c.push({
			...t,
			direction: "Dual (Conflict)",
			conflict: `Anchor Discrepancy: Forward (${t.requiredDate}) vs Backward (${n.requiredDate})`,
			status: "INCONSISTENT",
			notes: `Forward calculated ${t.requiredDate}; Backward calculated ${n.requiredDate}`
		}));
	}
	return s.length === 0 ? {
		status: "SUCCESS",
		overallStatus: "CONSISTENT",
		message: "Forward and Backward schedules are completely consistent.",
		schedule: c
	} : {
		status: "SUCCESS",
		overallStatus: "DATE CONFLICT",
		message: `DATE CONFLICT between Announcement and Execution anchors. Disagreements: ${s.map((e) => `${e.action}: Forward=${e.forwardDate} vs Backward=${e.backwardDate}`).join("; ")}`,
		schedule: c,
		discrepancies: s
	};
}
//#endregion
//#region modules/bid-planner/js/conflicts.js
function te(e, t = [], n = {}) {
	if (!Array.isArray(e)) return {
		schedule: [],
		conflictCount: 0,
		conflicts: []
	};
	let r = [];
	return {
		schedule: e.map((i, a) => {
			let o = [], s = i.requiredDate;
			if (Array.isArray(t) && t.length > 0) {
				let e = t.filter((e) => (typeof e == "string" ? e : e.date || e["Required Date"] || e.Date) === s);
				if (e.length > 0) {
					let t = e.map((e) => typeof e == "string" ? e : e.title || e.event || e.Action || e.Event || "Existing Event").join(", ");
					o.push({
						type: "same-day",
						message: `Conflicts with imported event(s): ${t}`
					});
				}
			}
			if (b(s, n)) {
				let e = (n.holidays || []).find((e) => typeof e == "string" ? e === s : e && e.date === s), t = typeof e == "object" && e.name ? e.name : "Holiday";
				o.push({
					type: "holiday",
					message: `Falls on configured holiday (${t})`
				});
			}
			if (x(s, n)) {
				let e = (n.blackoutDates || []).find((e) => typeof e == "string" ? e === s : e && e.date === s), t = typeof e == "object" && e.name ? e.name : "Blackout Date";
				o.push({
					type: "blackout",
					message: `Falls on configured blackout date (${t})`
				});
			}
			if (a > 0) {
				let t = e[a - 1], n = h(t.requiredDate), r = h(s);
				n && r && r < n && o.push({
					type: "dependency",
					message: `Sequence violation: Date (${s}) is prior to predecessor '${t.action}' (${t.requiredDate})`
				});
			}
			let c = o.map((e) => e.message).join("; "), l = i.status;
			return o.length > 0 && (l = "CONFLICT", r.push({
				sequence: i.sequence,
				action: i.action,
				requiredDate: i.requiredDate,
				conflicts: o
			})), {
				...i,
				conflict: c || i.conflict || "None",
				status: o.length > 0 ? "CONFLICT" : l
			};
		}),
		conflictCount: r.length,
		conflicts: r
	};
}
//#endregion
//#region modules/bid-planner/js/validation.js
function j(e, t) {
	return !e && !t ? {
		valid: !1,
		error: "At least one anchor date (Announcement or Execution) must be provided."
	} : e && !h(e) ? {
		valid: !1,
		error: "Announcement Date must be a valid YYYY-MM-DD date."
	} : t && !h(t) ? {
		valid: !1,
		error: "Execution Date must be a valid YYYY-MM-DD date."
	} : e && t && h(e) > h(t) ? {
		valid: !1,
		error: `Announcement Date (${e}) cannot be after Execution Date (${t}).`
	} : {
		valid: !0,
		error: null
	};
}
function M(e, t, n, r, i) {
	if (!Array.isArray(e) || e.length === 0) return {
		valid: !1,
		error: "No active schedule to move event."
	};
	let a = h(n);
	if (!a) return {
		valid: !1,
		error: "New date must be a valid YYYY-MM-DD date."
	};
	let o = e.findIndex((e) => e.actionId === t || e.action === t);
	if (o === -1) return {
		valid: !1,
		error: `Action '${t}' not found in schedule.`
	};
	let s = e[o], c = [], l = !0;
	if (!S(n, i)) {
		let e = O(n, i);
		c.push(`Warning: Proposed date ${n} is a ${e}.`);
	}
	if (o > 0) {
		let t = e[o - 1], r = h(t.requiredDate);
		r && a < r && (l = !1, c.push(`VIOLATION: Proposed date ${n} precedes predecessor '${t.action}' (${t.requiredDate}).`));
	}
	if (o < e.length - 1) {
		let t = e[o + 1], r = h(t.requiredDate);
		r && a > r && (l = !1, c.push(`VIOLATION: Proposed date ${n} succeeds successor '${t.action}' (${t.requiredDate}).`));
	}
	return l && c.push(`Date change valid. '${s.action}' will be updated from ${s.requiredDate} to ${n}.`), {
		valid: l,
		actionId: s.actionId,
		actionLabel: s.action,
		oldDate: s.requiredDate,
		newDate: n,
		consequences: c,
		requiresExplicitAccept: !0
	};
}
//#endregion
//#region modules/bid-planner/js/importExport.js
function N(e) {
	if (e == null) return "\"\"";
	let t = String(e);
	return t.includes("\"") || t.includes(",") || t.includes("\n") || t.includes("\r") ? `"${t.replace(/"/g, "\"\"")}"` : t;
}
function P(e) {
	if (!e || typeof e != "string") return [];
	let t = e.startsWith("﻿") ? e.slice(1) : e, n = [], r = [], i = "", a = !1;
	for (let e = 0; e < t.length; e++) {
		let o = t[e], s = t[e + 1];
		a ? o === "\"" ? s === "\"" ? (i += "\"", e++) : a = !1 : i += o : o === "\"" ? a = !0 : o === "," ? (r.push(i), i = "") : o === "\r" && s === "\n" ? (r.push(i), n.push(r), r = [], i = "", e++) : o === "\n" || o === "\r" ? (r.push(i), n.push(r), r = [], i = "") : i += o;
	}
	return (i !== "" || r.length > 0) && (r.push(i), n.push(r)), n.filter((e) => e.length > 0 && e.some((e) => e.trim() !== ""));
}
function ne(e) {
	if (!Array.isArray(e) || e.length === 0) return "";
	let t = [[
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
	].map(N).join(",")];
	for (let n of e) {
		let e = [
			n.sequence,
			n.action,
			n.requiredDate,
			n.calculatedFrom,
			n.rule,
			n.direction,
			n.adjusted ? "Yes" : "No",
			n.adjustmentReason,
			n.conflict,
			n.status,
			n.notes
		];
		t.push(e.map(N).join(","));
	}
	return "﻿" + t.join("\r\n");
}
function re(e) {
	return JSON.stringify(e || [], null, 2);
}
function ie(e, t = "auto") {
	if (!e || typeof e != "string") return [];
	let n = e.trim();
	if (t === "json" || t === "auto" && (n.startsWith("[") || n.startsWith("{"))) try {
		let e = JSON.parse(n);
		if (Array.isArray(e)) return e;
		if (e && Array.isArray(e.events)) return e.events;
	} catch (e) {
		console.warn("JSON parse failed for calendar import:", e);
	}
	let r = P(n);
	if (r.length < 2) return [];
	let i = r[0].map((e) => e.trim()), a = [];
	for (let e = 1; e < r.length; e++) {
		let t = r[e], n = (...e) => {
			for (let n of e) {
				let e = i.findIndex((e) => e.toLowerCase() === n.toLowerCase());
				if (e !== -1 && e < t.length && t[e].trim() !== "") return t[e].trim();
			}
			return "";
		}, o = n("Date", "Required Date", "Event Date"), s = n("Event", "Title", "Action", "Description", "Name");
		o && a.push({
			id: `ev-${e}`,
			date: o,
			title: s || `Event ${e}`,
			description: n("Description", "Notes")
		});
	}
	return a;
}
//#endregion
//#region modules/bid-planner/js/ui.js
var F = [], ae = [], I = null;
function oe(e) {
	let t = document.getElementById("tab-bid-planner");
	if (!t) return;
	let n = t.querySelector("#bp-bid-type"), r = t.querySelector("#bp-rule-set"), o = t.querySelector("#bp-announcement-date"), s = t.querySelector("#bp-execution-date"), h = t.querySelector("#bp-adj-strategy"), g = t.querySelector("#bp-btn-generate"), _ = t.querySelector("#bp-btn-clear"), v = t.querySelector("#bp-btn-import-cal"), y = t.querySelector("#bp-file-import-cal"), b = t.querySelector("#bp-btn-export-csv"), x = t.querySelector("#bp-btn-export-json"), S = t.querySelector("#bp-status-banner"), C = t.querySelector("#bp-conflict-section"), w = t.querySelector("#bp-conflict-list"), T = t.querySelector("#bp-row-count"), E = t.querySelector("#bp-schedule-tbody"), D = t.querySelector("#bp-move-section"), O = t.querySelector("#bp-move-action-select"), k = t.querySelector("#bp-move-new-date"), A = t.querySelector("#bp-btn-validate-move"), N = t.querySelector("#bp-move-consequences"), P = t.querySelector("#bp-btn-confirm-move"), oe = t.querySelector("#bp-btn-cancel-move"), R = t.querySelector("#bp-tab-btn-rules"), ce = t.querySelector("#bp-tab-btn-calendar"), z = t.querySelector("#bp-panel-rules-json"), le = t.querySelector("#bp-panel-calendar-json"), B = t.querySelector("#bp-json-rules"), V = t.querySelector("#bp-json-calendar"), H = t.querySelector("#bp-btn-apply-rules"), U = t.querySelector("#bp-btn-reset-rules"), ue = t.querySelector("#bp-btn-download-rules"), de = t.querySelector("#bp-btn-upload-rules"), W = t.querySelector("#bp-file-upload-rules"), fe = t.querySelector("#bp-btn-apply-calendar"), G = t.querySelector("#bp-btn-reset-calendar"), K = t.querySelector("#bp-btn-download-calendar"), pe = t.querySelector("#bp-btn-upload-calendar"), q = t.querySelector("#bp-file-upload-calendar");
	function me() {
		let e = c();
		n && (n.innerHTML = "", (e.bidTypes || []).forEach((e) => {
			let t = document.createElement("option");
			t.value = e.id, t.textContent = e.name, n.appendChild(t);
		}), he());
	}
	function he() {
		if (!n || !r) return;
		let e = c(), t = n.value, i = (e.bidTypes || []).find((e) => e.id === t);
		r.innerHTML = "", i && Array.isArray(i.ruleSets) && i.ruleSets.forEach((e) => {
			let t = document.createElement("option");
			t.value = e.id, t.textContent = e.name, r.appendChild(t);
		});
	}
	function J() {
		B && (B.value = JSON.stringify(c(), null, 2)), V && (V.value = JSON.stringify(d(), null, 2));
	}
	n && n.addEventListener("change", he);
	function ge() {
		let e = c(), t = d(), i = n.value, a = r.value, l = o ? o.value : "", u = s ? s.value : "", f = h ? h.value : "previous", p = j(l, u);
		if (!p.valid) {
			X("conflict", p.error);
			return;
		}
		let g = m(e, i, a);
		if (!g) {
			X("conflict", "Selected Rule Set not found in configuration.");
			return;
		}
		let _ = ee(g, l, u, t, f);
		if (_.status !== "SUCCESS") {
			X("conflict", _.message);
			return;
		}
		let v = te(_.schedule, ae, t);
		F = v.schedule, _e(F), ve(v.conflicts), v.conflictCount > 0 ? X("conflict", `Schedule generated with ${v.conflictCount} calendar conflict(s). Review conflict panel below.`) : _.overallStatus === "DATE CONFLICT" ? X("conflict", _.message) : X("consistent", _.message), b && (b.disabled = !1), x && (x.disabled = !1), be();
	}
	g && g.addEventListener("click", ge), _ && _.addEventListener("click", () => {
		o && (o.value = ""), s && (s.value = ""), F = [], _e([]), S && (S.style.display = "none"), C && (C.style.display = "none"), b && (b.disabled = !0), x && (x.disabled = !0);
	});
	function _e(e) {
		if (E) {
			if (E.innerHTML = "", !Array.isArray(e) || e.length === 0) {
				E.innerHTML = "<tr><td colspan=\"11\" class=\"bp-empty-msg\">No schedule generated yet. Enter anchor date(s) above and click \"Generate Schedule\".</td></tr>", T && (T.textContent = "0 Actions");
				return;
			}
			T && (T.textContent = `${e.length} Actions`), e.forEach((e) => {
				let t = document.createElement("tr"), n = `<span class="bp-status-tag ${(e.status || "VALID").toLowerCase()}">${e.status}</span>`, r = e.adjusted ? "<span style=\"color:#d97706;font-weight:bold;\">Yes</span>" : "No";
				t.innerHTML = `
        <td>${e.sequence}</td>
        <td><strong>${L(e.action)}</strong></td>
        <td><code style="font-weight:bold;color:#2563eb;">${L(e.requiredDate)}</code></td>
        <td>${L(e.calculatedFrom)}</td>
        <td>${L(e.rule)}</td>
        <td>${L(e.direction)}</td>
        <td>${r}</td>
        <td style="font-size:0.8rem;">${L(e.adjustmentReason)}</td>
        <td style="color:${e.conflict && e.conflict !== "None" ? "#dc2626" : "inherit"};">${L(e.conflict || "None")}</td>
        <td>${n}</td>
        <td style="font-size:0.8rem;">${L(e.notes || "")}</td>
      `, E.appendChild(t);
			});
		}
	}
	function ve(e) {
		if (C && w) {
			if (w.innerHTML = "", !Array.isArray(e) || e.length === 0) {
				C.style.display = "none";
				return;
			}
			C.style.display = "block", e.forEach((e) => {
				let t = document.createElement("div");
				t.className = "bp-conflict-item";
				let n = e.conflicts.map((e) => e.message).join("<br>");
				t.innerHTML = `
        <div class="bp-conflict-desc">
          <strong>Seq ${e.sequence} - ${L(e.action)}</strong> (Required Date: <code>${e.requiredDate}</code>)<br>
          ${n}
        </div>
        <div class="bp-button-bar">
          <button type="button" class="btn btn-sm" data-action="keep-date" data-seq="${e.sequence}">Keep Required Date</button>
          <button type="button" class="btn btn-sm btn-cyan" data-action="move-event" data-seq="${e.sequence}">Move Required Event</button>
          <button type="button" class="btn btn-sm" data-action="keep-existing" data-seq="${e.sequence}">Keep Existing Event</button>
          <button type="button" class="btn btn-sm" data-action="resolve-manual" data-seq="${e.sequence}">Resolve Manually</button>
        </div>
      `, w.appendChild(t);
			}), w.querySelectorAll("button[data-action]").forEach((e) => {
				e.addEventListener("click", (e) => {
					let t = e.target.dataset.action;
					ye(t, Number(e.target.dataset.seq));
				});
			});
		}
	}
	function ye(e, t) {
		let n = F.findIndex((e) => e.sequence === t);
		if (n === -1) return;
		let r = F[n];
		if (e === "keep-date") r.status = "VALID (USER KEPT)", r.conflict = "User explicitly kept date despite conflict", Y();
		else if (e === "move-event") D && (D.style.display = "block"), O && (O.value = r.actionId), k && (k.value = r.requiredDate), N && (N.style.display = "none"), P && (P.style.display = "none");
		else if (e === "keep-existing") r.status = "DEFERRED", r.notes = "Bid event deferred in favor of existing calendar event", r.conflict = "Deferred", Y();
		else if (e === "resolve-manual") {
			let e = prompt("Enter resolution notes:", "Manually resolved");
			e !== null && (r.status = "RESOLVED", r.notes = e, r.conflict = "Resolved manually", Y());
		}
	}
	function Y() {
		let e = d(), t = te(F, ae, e);
		F = t.schedule, _e(F), ve(t.conflicts);
	}
	function be() {
		O && (O.innerHTML = "", F.forEach((e) => {
			let t = document.createElement("option");
			t.value = e.actionId, t.textContent = `Seq ${e.sequence}: ${e.action} (${e.requiredDate})`, O.appendChild(t);
		}));
	}
	A && A.addEventListener("click", () => {
		let e = O ? O.value : "", t = k ? k.value : "", i = d(), a = m(c(), n.value, r.value), o = M(F, e, t, a, i);
		I = o, N && (N.style.display = "block", N.textContent = o.consequences.join("\n"), o.valid ? (N.style.background = "#f0fdf4", N.style.borderColor = "#86efac", N.style.color = "#166534") : (N.style.background = "#fef2f2", N.style.borderColor = "#fca5a5", N.style.color = "#991b1b")), P && (P.style.display = "inline-block");
	}), P && P.addEventListener("click", () => {
		if (!I) return;
		let { actionId: e, newDate: t } = I, n = F.find((t) => t.actionId === e);
		n && (n.requiredDate = t, n.adjusted = !0, n.adjustmentReason = `Manually moved by user to ${t}`, n.status = "MOVED", Y()), D && (D.style.display = "none"), I = null;
	}), oe && oe.addEventListener("click", () => {
		D && (D.style.display = "none"), I = null;
	}), v && y && (v.addEventListener("click", () => y.click()), y.addEventListener("change", (e) => {
		let t = e.target.files[0];
		if (!t) return;
		let n = new FileReader();
		n.onload = (e) => {
			let t = e.target.result;
			ae = ie(t), X("info", `Imported ${ae.length} external calendar event(s).`), F.length > 0 && Y();
		}, n.readAsText(t), y.value = "";
	})), b && b.addEventListener("click", () => {
		se(ne(F), "bid-planner-schedule.csv", "text/csv;charset=utf-8;");
	}), x && x.addEventListener("click", () => {
		se(re(F), "bid-planner-schedule.json", "application/json");
	}), R && ce && (R.addEventListener("click", () => {
		R.classList.add("active"), ce.classList.remove("active"), z && (z.style.display = "flex"), le && (le.style.display = "none");
	}), ce.addEventListener("click", () => {
		ce.classList.add("active"), R.classList.remove("active"), le && (le.style.display = "flex"), z && (z.style.display = "none");
	})), H && B && H.addEventListener("click", () => {
		try {
			l(JSON.parse(B.value)), me(), X("consistent", "Rules JSON validated and saved to localStorage.");
		} catch (e) {
			X("conflict", `Rules JSON error: ${e.message}`);
		}
	}), U && U.addEventListener("click", () => {
		u(), J(), me(), X("info", "Reset Rules configuration to bundled defaults.");
	}), ue && ue.addEventListener("click", () => {
		se(B ? B.value : JSON.stringify(c(), null, 2), "bid-planner-rules.json", "application/json");
	}), de && W && (de.addEventListener("click", () => W.click()), W.addEventListener("change", (e) => {
		let t = e.target.files[0];
		if (!t) return;
		let n = new FileReader();
		n.onload = (e) => {
			try {
				let t = JSON.parse(e.target.result), n = i(t);
				if (!n.valid) throw Error(n.error);
				l(t), J(), me(), X("consistent", "Uploaded rules JSON validated and saved.");
			} catch (e) {
				X("conflict", `Upload error: ${e.message}`);
			}
		}, n.readAsText(t), W.value = "";
	})), fe && V && fe.addEventListener("click", () => {
		try {
			f(JSON.parse(V.value)), X("consistent", "Calendar JSON validated and saved to localStorage.");
		} catch (e) {
			X("conflict", `Calendar JSON error: ${e.message}`);
		}
	}), G && G.addEventListener("click", () => {
		p(), J(), X("info", "Reset Calendar configuration to bundled defaults.");
	}), K && K.addEventListener("click", () => {
		se(V ? V.value : JSON.stringify(d(), null, 2), "bid-planner-calendar.json", "application/json");
	}), pe && q && (pe.addEventListener("click", () => q.click()), q.addEventListener("change", (e) => {
		let t = e.target.files[0];
		if (!t) return;
		let n = new FileReader();
		n.onload = (e) => {
			try {
				let t = JSON.parse(e.target.result), n = a(t);
				if (!n.valid) throw Error(n.error);
				f(t), J(), X("consistent", "Uploaded calendar JSON validated and saved.");
			} catch (e) {
				X("conflict", `Upload error: ${e.message}`);
			}
		}, n.readAsText(t), q.value = "";
	}));
	function X(e, t) {
		S && (S.style.display = "block", S.className = `bp-status-banner card ${e}`, S.textContent = t);
	}
	me(), J();
}
function L(e) {
	return e == null ? "" : String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function se(e, t, n) {
	let r = new Blob([e], { type: n }), i = URL.createObjectURL(r), a = document.createElement("a");
	a.href = i, a.download = t, document.body.appendChild(a), a.click(), document.body.removeChild(a), URL.revokeObjectURL(i);
}
//#endregion
//#region modules/bid-planner/js/ebid.js
var R = /* @__PURE__ */ "Airport Code.Shift Bid Event ID.Schedule Start Date.Schedule End Date.Bid Line ID.Location/Workgroup.Patdown Req.Title.Certification.Schedule Type.Shift Time.Private Bid Line Comments.Public Bid Line Comments.D01 Shift Time.D02 Shift Time.D03 Shift Time.D04 Shift Time.D05 Shift Time.D06 Shift Time.D07 Shift Time.D08 Shift Time.D09 Shift Time.D10 Shift Time.D11 Shift Time.D12 Shift Time.D13 Shift Time.D14 Shift Time.D01 Shift Type.D02 Shift Type.D03 Shift Type.D04 Shift Type.D05 Shift Type.D06 Shift Type.D07 Shift Type.D08 Shift Type.D09 Shift Type.D10 Shift Type.D11 Shift Type.D12 Shift Type.D13 Shift Type.D14 Shift Type.RDOs.Hours/Day.Hours/PP.Days/Week".split("."), ce = [
	{
		id: 1,
		header: "Airport Code",
		values: "3-letter airport code",
		desc: "3 letter airport code (e.g. ANC, LAX, SFO)."
	},
	{
		id: 2,
		header: "Shift Bid Event ID",
		values: "Text, up to 10 characters",
		desc: "Same value on every line. Identifies this shift bid at the airport. Often AIRPORT + YYYY-MM."
	},
	{
		id: 3,
		header: "Schedule Start Date",
		values: "YYYY-MM-DD",
		desc: "Date the schedule becomes effective. D01 is this calendar day, not a hard-coded Sunday."
	},
	{
		id: 4,
		header: "Schedule End Date",
		values: "YYYY-MM-DD",
		desc: "Date through which the schedule stays in effect (the bid season, not the 14-day pattern)."
	},
	{
		id: 5,
		header: "Bid Line ID",
		values: "Text, up to 8 characters",
		desc: "Unique within the airport. Default Alpha line numbers are exported as 1000 + id (Line 001 → 1001) so eBid does not sort on leading zeros. A custom line code is kept, truncated to 8."
	},
	{
		id: 6,
		header: "Location/Workgroup",
		values: "Text, up to 30 characters",
		desc: "Team or checkpoint. Numeric Alpha teams export as Team 01. Blank if the line is not on a team — not a sample name."
	},
	{
		id: 7,
		header: "Patdown Req",
		values: "Female, Male, None",
		desc: "Sex required for pat downs on this bid line."
	},
	{
		id: 8,
		header: "Title",
		values: "TSO, LTSO, ETSO, STSO, ESTI, MSTI, STI, SSA, SSTI, EMT, Single Group",
		desc: "Rank required. Emp class PT/FT is not a title."
	},
	{
		id: 9,
		header: "Certification",
		values: "PAX, BAG, DUAL",
		desc: "From the line function. BAG stays BAG, DFO exports as DUAL, PAX stays PAX. Cert pool letter is not a certification."
	},
	{
		id: 10,
		header: "Schedule Type",
		values: "FT, PT",
		desc: "Full-time or part-time. STSO and LTSO are FT. Not inferred from weekly hours."
	},
	{
		id: 11,
		header: "Shift Time",
		values: "9 chars, 19 chars, or RDO",
		desc: "Typical military span, breaks included (0400-1230). Split shifts use one space (0900-1300 1500-1900)."
	},
	{
		id: 12,
		header: "Private Bid Line Comments",
		values: "Text, up to 255 characters",
		desc: "Scheduling office only. Left blank by this export."
	},
	{
		id: 13,
		header: "Public Bid Line Comments",
		values: "Text, up to 255 characters",
		desc: "Bidder-visible. Cert pool is written here as Pool A / Pool B (column M)."
	},
	{
		id: 14,
		header: "D01–D14 Shift Time",
		values: "Military span or RDO",
		desc: "Fourteen days beginning on the schedule start date. Week 2 repeats the weekly pattern when the session only stored seven days."
	},
	{
		id: 28,
		header: "D01–D14 Shift Type",
		values: "Airport, Training, Admin/Avail, or blank",
		desc: "Blank if and only if that day's shift time is RDO. Training lines use Training. Otherwise the selected workday type."
	},
	{
		id: 42,
		header: "RDOs",
		values: "SU/MO or SU/MO WE/TH",
		desc: "Weekday abbreviations joined by /. Week 2 is omitted when it matches week 1; otherwise the weeks are separated by a space."
	},
	{
		id: 43,
		header: "Hours/Day",
		values: "Calculated",
		desc: "From the typical shift time, including splits. 30 minutes is subtracted when the gross span is 6 hours or more."
	},
	{
		id: 44,
		header: "Hours/PP",
		values: "Calculated, max 80",
		desc: "Non-RDO days in the 14-day pattern times Hours/Day, capped at 80."
	},
	{
		id: 45,
		header: "Days/Week",
		values: "5 or 5/4",
		desc: "Work days in week 1. If week 2 differs, both counts are shown (5/4)."
	}
], z = [
	"SU",
	"MO",
	"TU",
	"WE",
	"TH",
	"FR",
	"SA"
], le = [
	"Single Group",
	"TSO",
	"LTSO",
	"ETSO",
	"STSO",
	"ESTI",
	"MSTI",
	"STI",
	"SSA",
	"SSTI",
	"EMT"
], B = [
	"ESTI",
	"MSTI",
	"ETSO",
	"SSTI",
	"STSO",
	"LTSO",
	"STI",
	"SSA",
	"EMT"
], V = [
	"Airport",
	"Training",
	"Admin/Avail"
], H = /^(\d{4}-\d{4})( \d{4}-\d{4})?$/;
function U(e) {
	if (!e) return "";
	if (typeof e.toISODate == "function") {
		let t = e.toISODate();
		if (typeof t == "string" && /^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10);
	}
	if (e instanceof Date && !Number.isNaN(e.getTime())) {
		let t = e.getFullYear(), n = String(e.getMonth() + 1).padStart(2, "0"), r = String(e.getDate()).padStart(2, "0");
		return t + "-" + n + "-" + r;
	}
	let t = String(e).trim(), n = t.match(/^(\d{4}-\d{2}-\d{2})/);
	if (n) return n[1];
	let r = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	return r ? r[3] + "-" + r[1].padStart(2, "0") + "-" + r[2].padStart(2, "0") : "";
}
function ue(e, t) {
	let n = String(e || "").split("-").map(Number);
	if (n.length !== 3 || n.some((e) => !Number.isFinite(e))) return "";
	let r = new Date(Date.UTC(n[0], n[1] - 1, n[2]));
	return r.setUTCDate(r.getUTCDate() + t), r.toISOString().slice(0, 10);
}
function de(e) {
	let t = String(e || "").split("-").map(Number);
	return t.length !== 3 || t.some((e) => !Number.isFinite(e)) ? 0 : new Date(Date.UTC(t[0], t[1] - 1, t[2])).getUTCDay();
}
function W(e, t) {
	return e && /^\d{4}-\d{2}-\d{2}$/.test(e) ? de(ue(e, t)) : t % 7;
}
function fe(e) {
	if (e == null) return "";
	let t = String(e).trim().replace(/[\u2013\u2014]/g, "-"), n = t.match(/^(\d{1,2}):(\d{2})$/);
	if (n) return n[1].padStart(2, "0") + n[2];
	let r = t.match(/^(\d{3,4})$/);
	return r ? r[1].padStart(4, "0") : "";
}
function G(e) {
	if (!e) return [];
	let t = String(e).replace(/[\u2013\u2014]/g, "-").replace(/\s*\/\s*/g, " "), n = /(\d{1,2}:\d{2}|\d{3,4})\s*-\s*(\d{1,2}:\d{2}|\d{3,4})/g, r = [], i;
	for (; (i = n.exec(t)) && (r.push({
		start: i[1],
		end: i[2]
	}), r.length !== 2););
	return r;
}
function K(e) {
	if (!e || !e.length) return "";
	let t = [];
	for (let n = 0; n < Math.min(2, e.length); n++) {
		let r = fe(e[n] && e[n].start), i = fe(e[n] && e[n].end);
		if (!r || !i) return "";
		t.push(r + "-" + i);
	}
	return t.join(" ");
}
function pe(e) {
	if (!e || e === "RDO" || !H.test(e)) return 0;
	let t = 0;
	e.split(" ").forEach((e) => {
		let n = e.split("-"), r = n[0], i = n[1], a = parseInt(r.slice(0, 2), 10) * 60 + parseInt(r.slice(2), 10), o = parseInt(i.slice(0, 2), 10) * 60 + parseInt(i.slice(2), 10);
		o < a && (o += 1440), t += o - a;
	});
	let n = t / 60, r = n >= 6 ? n - .5 : n;
	return Math.round(r * 100) / 100;
}
function q(e) {
	if (!Number.isFinite(e)) return "";
	let t = Math.round(e * 100) / 100;
	return String(t);
}
function me(e, t) {
	if (!t || !e) return null;
	let n = t[e.id] == null ? t[String(e.id)] : t[e.id];
	return Array.isArray(n) ? n : null;
}
function he(e, t, n, r) {
	if (e && Array.isArray(e._weekdayCells)) {
		let t = e._weekdayCells[W(r, n)];
		return J(t, "").status;
	}
	let i = me(e, t);
	return i && i.length ? (n < i.length ? i[n] : i[n % i.length]) === "WORK" ? "WORK" : "RDO" : new Set((e && e.rdoDays ? e.rdoDays : []).map(Number)).has(W(r, n)) ? "RDO" : "WORK";
}
function J(e, t) {
	let n = String(e ?? "").trim();
	if (!n || /^rdo$/i.test(n) || /^off$/i.test(n) || n === "—" || n === "-") return {
		status: "RDO",
		span: "RDO"
	};
	let r = G(n);
	return r.length ? {
		status: "WORK",
		span: K(r) || t || ""
	} : {
		status: "WORK",
		span: t || ""
	};
}
function ge(e, t) {
	if (!e || !e.dayTimes) return null;
	let n = e.dayTimes[t] == null ? e.dayTimes[String(t)] : e.dayTimes[t];
	return !n || typeof n != "object" ? null : Array.isArray(n.segments) && n.segments.length >= 2 ? n.segments.slice(0, 2) : n.start && n.end ? [{
		start: n.start,
		end: n.end
	}] : null;
}
function _e(e, t) {
	if (t && Array.isArray(t.segments) && t.segments.length >= 2) return t.segments.slice(0, 2);
	let n = G(e && e.shiftLabel);
	return n.length >= 2 ? n : e && e.startTime && e.endTime ? [{
		start: e.startTime,
		end: e.endTime
	}] : t && t.start && t.end ? [{
		start: t.start,
		end: t.end
	}] : n.length ? n : [];
}
function ve(e, t, n, r) {
	let i = ge(e, n);
	if (i) return i;
	if (r && typeof r.getEffectiveSegments == "function" && e && e.shiftId) try {
		let t = r.getEffectiveSegments(e.shiftId, n);
		if (Array.isArray(t) && t.length) return t.slice(0, 2);
	} catch {}
	if (t && t.dayTimes) {
		let e = t.dayTimes[n] == null ? t.dayTimes[String(n)] : t.dayTimes[n];
		if (e && Array.isArray(e.segments) && e.segments.length >= 2) return e.segments.slice(0, 2);
		if (e && e.start && e.end) return [{
			start: e.start,
			end: e.end
		}];
	}
	return _e(e, t);
}
function ye(e, t) {
	if (!e) return null;
	if (t && typeof t.getShift == "function") {
		let n = t.getShift(e.shiftId);
		if (n) return n;
	}
	return (t && t.shifts || []).find((t) => t && t.id === e.shiftId) || null;
}
function Y(e, t) {
	let n = String(e && (e.lineCode || e.id) || "").trim(), r = n.replace(/^line\s+/i, "").trim(), i = e && e.id != null ? e.id : "", a = Number(i), o = i !== "" && i != null && Number.isInteger(a), s = o ? String(a).padStart(3, "0") : "", c = !r || o && (r === String(a) || r === s || n.toLowerCase() === ("line " + s).toLowerCase() || n.toLowerCase() === ("line " + String(a)).toLowerCase());
	if (c && o) {
		if (a >= 1e3 && a <= 99999999) return String(a).slice(0, 8);
		if (a >= 0 && a < 1e3) return String(1e3 + a);
	}
	if (!c && r) return r.slice(0, 8);
	if (/^\d+$/.test(r)) {
		let e = Number(r);
		if (r.length >= 4) return r.slice(0, 8);
		if (e >= 0 && e < 1e3) return String(1e3 + e);
	}
	return String(1001 + (t || 0)).slice(0, 8);
}
function be(e) {
	if (!e) return "TSO";
	if (e.isStso) return "STSO";
	if (e.isLtso) return "LTSO";
	let t = [
		e.position,
		e.extraName,
		e.empClass,
		e.trainingClass
	].filter((e) => e != null && String(e).trim() !== "").join(" ");
	if (/single\s*group/i.test(t)) return "Single Group";
	let n = t.toUpperCase();
	for (let e = 0; e < B.length; e++) {
		let t = B[e];
		if (n === t || RegExp("\\b" + t + "\\b").test(n)) return t;
	}
	return "TSO";
}
function X(e) {
	if (!e) return "FT";
	let t = String(e.empClass || "").trim().toUpperCase(), n = String(e.position || "").trim().toUpperCase();
	return e.isStso || e.isLtso || t === "STSO" || t === "LTSO" || n === "STSO" || n === "LTSO" ? "FT" : e.isPt === !0 || t === "PT" || n === "PT" ? "PT" : "FT";
}
function xe(e) {
	let t = String(e && e.function || "").trim().toUpperCase();
	return t === "BAG" || t === "BAGS" ? {
		cert: "BAG",
		defaulted: !1,
		reason: ""
	} : t === "DFO" || t === "DUAL" ? {
		cert: "DUAL",
		defaulted: !1,
		reason: ""
	} : t === "PAX" ? {
		cert: "PAX",
		defaulted: !1,
		reason: ""
	} : t === "TRAINING" ? {
		cert: "PAX",
		defaulted: !0,
		reason: "TRAINING has no eBid certification; defaulted to PAX"
	} : !t || t === "-" ? {
		cert: "PAX",
		defaulted: !0,
		reason: "Function is blank; certification defaulted to PAX"
	} : {
		cert: "PAX",
		defaulted: !0,
		reason: "Function " + t + " is not PAX, BAG, or DFO; certification defaulted to PAX"
	};
}
function Se(e) {
	let t = String(e ?? "").trim();
	if (!t) return "";
	let n = t.replace(/^pool\s*/i, "").trim(), r = (/^pool\b/i.test(t) ? n : t).toUpperCase();
	return r ? "Pool " + r : "";
}
function Ce(e) {
	let t = String(e || "").trim();
	if (!t || t === "—") return "";
	let n = t;
	return /^team\b/i.test(n) && (n = n.replace(/^team\s*/i, "").trim()), /^\d+$/.test(n) ? ("Team " + String(Number(n)).padStart(2, "0")).slice(0, 30) : /^team\b/i.test(t) ? ("Team " + n).slice(0, 30) : t.slice(0, 30);
}
function we(e) {
	let t = String(e ?? "").trim().toUpperCase();
	return t === "M" || t === "MALE" ? "Male" : t === "F" || t === "FEMALE" ? "Female" : "None";
}
function Te(e, t) {
	if (!e) return "";
	if (t && typeof t.teamResolver == "function") {
		let n = t.teamResolver(e.id);
		if (n && (n.name || n.id)) return n.name || n.id;
	}
	let n = t && t.teams || [];
	for (let t = 0; t < n.length; t++) {
		let r = n[t] && n[t].members;
		if (Array.isArray(r) && r.some((t) => String(t) === String(e.id))) return n[t].name || n[t].id || "";
	}
	return "";
}
function Ee(e) {
	if (!e) return !1;
	let t = String(e.empClass || "").toUpperCase(), n = String(e.extraName || "").toUpperCase();
	return !!(e.isTraining || e.trainingClass || e.function === "TRAINING" || t === "ESTI" || t === "MSTI" || n === "ESTI" || n === "MSTI");
}
function De(e, t, n) {
	if (Ee(t)) return "Training";
	if (e === "Admin/Avail") return "Admin/Avail";
	if (e === "Training") return "Training";
	if (e === "PandemicMix") {
		if (n === 1) return "Admin/Avail";
		if (n === 2) return "Training";
	}
	return "Airport";
}
function Oe(e, t) {
	let n = [], r = [];
	for (let i = 0; i < 14; i++) {
		if (!e[i]) continue;
		let a = z[W(t, i)] || "";
		(i < 7 ? n : r).push(a);
	}
	let i = n.join("/"), a = r.join("/");
	return i === a ? i : (i + " " + a).trim();
}
function ke(e, t, n) {
	t = t || {};
	let r = [], i = U(t.startDate);
	i || r.push("Schedule start date is blank; D01 is treated as Sunday.");
	let a = ye(e, t), o = K(_e(e, a)), s = [], c = [], l = [], u = 0;
	for (let n = 0; n < 14; n++) {
		if (he(e, t.schedule, n, i) === "RDO") {
			s.push("RDO"), c.push(""), l.push(!0);
			continue;
		}
		l.push(!1);
		let d = W(i, n), f = "";
		f = e && Array.isArray(e._weekdayCells) ? J(e._weekdayCells[d], o).span : K(ve(e, a, d, t)) || o, f || r.push("D" + String(n + 1).padStart(2, "0") + " is a work day with no shift time."), s.push(f), u += 1, c.push(De(t.shiftTypeMode, e, u));
	}
	let d = s.filter((e) => e && e !== "RDO"), f = o;
	if (d.length) {
		let e = {};
		d.forEach((t) => {
			e[t] = (e[t] || 0) + 1;
		}), f = Object.keys(e).sort((t, n) => e[n] - e[t] || t.localeCompare(n))[0];
	}
	f || (f = d.length ? "" : "RDO");
	let p = pe(f), m = s.filter((e) => e !== "RDO").length, h = Math.round(m * p * 100) / 100, g = !1;
	h > 80 && (h = 80, g = !0, r.push("Hours/PP capped at 80."));
	let _ = s.slice(0, 7).filter((e) => e !== "RDO").length, v = s.slice(7).filter((e) => e !== "RDO").length, y = xe(e);
	y.defaulted && y.reason && r.push(y.reason);
	let b = e && e.certPool != null ? String(e.certPool).trim() : "";
	b || r.push("Cert pool is blank; column 13 (Public Bid Line Comments) is empty."), e && e.sex != null && String(e.sex).trim() || r.push("Sex is blank; Patdown Req exported as None.");
	let x = Ce(Te(e, t));
	return {
		airportCode: String(t.airportCode || "").trim().toUpperCase(),
		bidEventId: String(t.bidEventId || "").trim(),
		startDate: i,
		endDate: U(t.endDate),
		bidLineId: Y(e, n),
		workgroup: x,
		patDown: we(e && e.sex),
		title: be(e),
		certification: y.cert,
		schedType: X(e),
		shiftTime: f,
		privateComments: "",
		publicComments: Se(b),
		dayShiftTimes: s,
		dayShiftTypes: c,
		rdos: Oe(l, i),
		hoursPerDay: p,
		hoursPerPP: h,
		daysPerWeek: _ === v ? String(_) : _ + "/" + v,
		capped: g,
		warnings: r,
		sourceId: e && e.id != null ? e.id : ""
	};
}
function Ae(e) {
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
		q(e.hoursPerDay),
		q(e.hoursPerPP),
		e.daysPerWeek
	];
}
function je(e) {
	return (e || []).slice().sort((e, t) => {
		let n = Number(e && e.id), r = Number(t && t.id), i = Number.isFinite(n), a = Number.isFinite(r);
		return i && a && n !== r ? n - r : i === a ? String(e && e.id).localeCompare(String(t && t.id)) : i ? -1 : 1;
	});
}
function Me(e, t) {
	return je(e).filter((e) => e && typeof e == "object").map((e, n) => ke(e, t, n));
}
function Ne(e) {
	if (!e || !/^\d{4}-\d{2}-\d{2}$/.test(e)) return "";
	let t = e.slice(0, 4) + "-12-31";
	return t < e ? e : t;
}
function Pe(e) {
	let t = e || {}, n = t.state || {}, r = U(n.startDate), i = "";
	typeof t.getAirportCode == "function" && (i = t.getAirportCode() || ""), !i && n.airportCode && (i = n.airportCode), i = String(i || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
	let a = i && r ? (i + r.slice(0, 7)).slice(0, 10) : "";
	return {
		airportCode: i,
		bidEventId: a,
		startDate: r,
		endDate: Ne(r),
		shiftTypeMode: "Airport"
	};
}
function Fe(e, t) {
	let n = e || {}, r = n.state || {}, i = t || {}, a = Pe(n);
	return {
		airportCode: i.airportCode == null ? a.airportCode : i.airportCode,
		bidEventId: i.bidEventId == null ? a.bidEventId : i.bidEventId,
		startDate: i.startDate == null ? a.startDate : i.startDate,
		endDate: i.endDate == null ? a.endDate : i.endDate,
		shiftTypeMode: i.shiftTypeMode || "Airport",
		shifts: r.shifts || [],
		schedule: r.schedule || {},
		teams: n.teams && Array.isArray(n.teams.teams) && n.teams.teams || r.teams || [],
		getShift: typeof n.getShift == "function" ? function(e) {
			return n.getShift(e);
		} : null,
		getEffectiveSegments: typeof n.getEffectiveShiftSegments == "function" ? function(e, t) {
			return n.getEffectiveShiftSegments(e, t);
		} : null,
		teamResolver: typeof n.teamMetaForLine == "function" ? n.teamMetaForLine : null
	};
}
function Ie(e, t) {
	let n = e && e.state || {};
	return Me(Array.isArray(n.lines) ? n.lines : [], Fe(e, t));
}
function Le(e) {
	let t = (e) => "\"" + (e == null ? "" : String(e)).replace(/"/g, "\"\"") + "\"", n = [R.map(t).join(",")];
	return (e || []).forEach((e) => {
		n.push(Ae(e).map(t).join(","));
	}), n.join("\r\n");
}
function Re(e) {
	return String(e || "").replace(/^\uFEFF/, "").split(/\r?\n/).filter((e) => e.trim().length > 0).map((e) => {
		let t = [], n = !1, r = "";
		for (let i = 0; i < e.length; i++) {
			let a = e[i];
			a === "\"" ? n && e[i + 1] === "\"" ? (r += "\"", i++) : n = !n : a === "," && !n ? (t.push(r.trim()), r = "") : r += a;
		}
		return t.push(r.trim()), t;
	});
}
function ze(e) {
	let t = {};
	return e.forEach((e, n) => {
		let r = String(e || "").trim().toLowerCase();
		r && t[r] == null && (t[r] = n);
	}), t;
}
function Z(e, t) {
	for (let n = 0; n < t.length; n++) if (e[t[n]] != null) return e[t[n]];
	return -1;
}
function Be(e) {
	let t = (e || []).map((e) => String(e || "").trim().toLowerCase());
	return t.indexOf("airport code") !== -1 && t.indexOf("d01 shift time") !== -1 && t.indexOf("public bid line comments") !== -1;
}
function Ve(e, t) {
	let n = e.line || "", r = n.replace(/^line\s+/i, "").trim(), i = n || t + 1;
	/^\d+$/.test(r) && (i = Number(r));
	let a = e.shift || "", o = G(a).length ? a : "";
	return {
		id: i,
		lineCode: n || String(i),
		shiftId: "",
		shiftName: o ? "" : a,
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
	let n = Re(e);
	if (n.length < 2) return {
		error: "That CSV has no line rows.",
		rows: []
	};
	let r = n[0];
	if (Be(r)) return {
		error: "That file is already a 45-column eBid export. Build the upload from the live lines instead of re-uploading an old CSV.",
		rows: []
	};
	let i = ze(r), a = {
		team: Z(i, [
			"team",
			"partner team",
			"location/workgroup",
			"workgroup"
		]),
		line: Z(i, [
			"line",
			"line id",
			"bid line id"
		]),
		shift: Z(i, ["shift"]),
		start: Z(i, ["start"]),
		end: Z(i, ["end"]),
		position: Z(i, ["position", "title"]),
		emp: Z(i, [
			"emp",
			"emp class",
			"schedule type"
		]),
		sex: Z(i, [
			"sex",
			"gender",
			"patdown req",
			"pat down req"
		]),
		fn: Z(i, [
			"function",
			"cert",
			"certification"
		]),
		certPool: Z(i, [
			"cert pool",
			"certpool",
			"public bid line comments"
		]),
		paid: Z(i, ["paid", "hours/day"]),
		sun: Z(i, ["sun"]),
		mon: Z(i, ["mon"]),
		tue: Z(i, ["tue"]),
		wed: Z(i, ["wed"]),
		thu: Z(i, ["thu"]),
		fri: Z(i, ["fri"]),
		sat: Z(i, ["sat"])
	};
	if (a.line < 0 && a.position < 0 && a.sun < 0) return {
		error: "That CSV is not a lines export (expected Line, Team, Start/End, or Sun–Sat columns).",
		rows: []
	};
	let o = [
		a.sun,
		a.mon,
		a.tue,
		a.wed,
		a.thu,
		a.fri,
		a.sat
	], s = [], c = [];
	for (let e = 1; e < n.length; e++) {
		let t = n[e];
		if (!t || t.every((e) => !String(e || "").trim())) continue;
		let r = (e) => e >= 0 && t[e] != null ? String(t[e]).trim() : "", i = {
			team: r(a.team),
			line: r(a.line),
			shift: r(a.shift),
			start: r(a.start),
			end: r(a.end),
			position: r(a.position),
			emp: r(a.emp),
			sex: r(a.sex),
			fn: r(a.fn),
			certPool: r(a.certPool),
			paid: r(a.paid),
			days: o.map(r)
		}, l = Ve(i, s.length);
		i.team && c.push({
			id: "t" + e,
			name: i.team,
			members: [l.id]
		}), s.push(l);
	}
	return {
		error: "",
		rows: Me(s, Object.assign({}, t || {}, {
			teams: c,
			schedule: {},
			shifts: []
		}))
	};
}
function Ue(e, t) {
	if (!e || typeof e != "object") return {
		error: "That JSON is empty.",
		rows: []
	};
	let n = e.results && typeof e.results == "object" ? e.results : e, r = e.config && typeof e.config == "object" ? e.config : {}, i = Array.isArray(n.lines) ? n.lines : Array.isArray(e.lines) ? e.lines : null;
	if (!i) return {
		error: "That JSON has no lines array.",
		rows: []
	};
	let a = n.schedule || e.schedule || {}, o = n.teams || e.teams || [], s = r.shifts || e.shifts || [], c = t && t.startDate || r.startDate || e.startDate || "";
	return {
		error: "",
		rows: Me(i, {
			airportCode: t && t.airportCode,
			bidEventId: t && t.bidEventId,
			startDate: c,
			endDate: t && t.endDate,
			shiftTypeMode: t && t.shiftTypeMode || "Airport",
			shifts: s,
			schedule: a,
			teams: o,
			getShift: function(e) {
				return (s || []).find((t) => t && t.id === e) || null;
			}
		})
	};
}
function Q(e, t, n, r, i) {
	e.push({
		level: t,
		code: n,
		message: r,
		lineId: i || ""
	});
}
function We(e) {
	let t = Array.isArray(e) ? e : [], n = [];
	if (!t.length) return {
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
	let r = {}, i = 0, a = 0, o = 0, s = 0, c = {
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
	function l(e, t) {
		let n = t == null || t === "" ? "(blank)" : String(t);
		c[e][n] = (c[e][n] || 0) + 1;
	}
	t.forEach((e) => {
		let t = e.bidLineId || "(no id)";
		e.schedType === "FT" ? i += 1 : e.schedType === "PT" && (a += 1), e.patDown === "Male" ? o += 1 : e.patDown === "Female" && (s += 1), l("Airport Code", e.airportCode), l("Schedule Type", e.schedType), l("Title", e.title), l("Patdown Req", e.patDown), l("Certification", e.certification), l("Public Comments (Cert Pool)", e.publicComments), l("Shift Time", e.shiftTime), l("RDOs", e.rdos), l("Hours/Day", q(e.hoursPerDay)), l("Hours/PP", q(e.hoursPerPP)), l("Days/Week", e.daysPerWeek), /^[A-Z]{3}$/.test(e.airportCode || "") || Q(n, "error", "airport", "Airport code must be 3 letters.", t), e.bidEventId ? e.bidEventId.length > 10 && Q(n, "error", "event", "Shift Bid Event ID is longer than 10 characters.", t) : Q(n, "error", "event", "Shift Bid Event ID is blank.", t), e.startDate || Q(n, "error", "start", "Schedule start date is blank.", t), e.endDate ? e.startDate && e.endDate < e.startDate && Q(n, "error", "end", "Schedule end date is before the start date.", t) : Q(n, "error", "end", "Schedule end date is blank.", t), e.bidLineId ? String(e.bidLineId).length > 8 ? Q(n, "error", "line-id", "Bid Line ID is longer than 8 characters.", t) : r[e.bidLineId] && Q(n, "error", "line-id", "Bid Line ID " + e.bidLineId + " is duplicated.", t) : Q(n, "error", "line-id", "Bid Line ID is blank.", t), e.bidLineId && (r[e.bidLineId] = !0), e.workgroup ? e.workgroup.length > 30 && Q(n, "error", "team", "Location/Workgroup is longer than 30 characters.", t) : Q(n, "warn", "team", "Location/Workgroup is blank.", t), [
			"Female",
			"Male",
			"None"
		].indexOf(e.patDown) < 0 && Q(n, "error", "patdown", "Patdown Req must be Female, Male, or None.", t), le.indexOf(e.title) < 0 && Q(n, "error", "title", "Title " + e.title + " is not an eBid title.", t), [
			"PAX",
			"BAG",
			"DUAL"
		].indexOf(e.certification) < 0 && Q(n, "error", "cert", "Certification must be PAX, BAG, or DUAL.", t), e.schedType !== "FT" && e.schedType !== "PT" && Q(n, "error", "sched", "Schedule type must be FT or PT.", t), e.shiftTime !== "RDO" && !H.test(e.shiftTime || "") && Q(n, "error", "shift", "Shift time must be 9 or 19 military characters, or RDO.", t), String(e.privateComments || "").length > 255 && Q(n, "error", "private", "Private comments exceed 255 characters.", t), String(e.publicComments || "").length > 255 && Q(n, "error", "public", "Public comments exceed 255 characters.", t);
		let c = e.dayShiftTimes || [], u = e.dayShiftTypes || [];
		(c.length !== 14 || u.length !== 14) && Q(n, "error", "days", "Expected 14 day times and 14 day types.", t);
		for (let e = 0; e < 14; e++) {
			let r = c[e], i = u[e], a = "D" + String(e + 1).padStart(2, "0");
			r !== "RDO" && !H.test(r || "") && Q(n, "error", "day-time", a + " shift time is not RDO or a 9/19-character military span.", t), r === "RDO" && i ? Q(n, "error", "rdo-type", a + " is RDO but shift type is not blank.", t) : r !== "RDO" && !i ? Q(n, "error", "rdo-type", a + " is a work day but shift type is blank.", t) : i && V.indexOf(i) < 0 && Q(n, "error", "day-type", a + " shift type " + i + " is not Airport, Training, or Admin/Avail.", t);
		}
		Number(e.hoursPerPP) > 80 && Q(n, "error", "hours", "Hours/PP is over 80.", t), (e.warnings || []).forEach((e) => Q(n, "warn", "line", e, t));
	});
	let u = n.filter((e) => e.level === "error").length, d = n.filter((e) => e.level === "warn").length;
	return {
		total: t.length,
		ft: i,
		pt: a,
		male: o,
		female: s,
		errors: u,
		warnings: d,
		issues: n,
		distinct: c,
		empty: !1
	};
}
//#endregion
//#region modules/bid-planner/js/ebidUi.js
function $(e, t, n) {
	let r = document.createElement(e);
	return t && Object.keys(t).forEach((e) => {
		e === "className" ? r.className = t[e] : e === "hidden" ? r.hidden = !!t[e] : r.setAttribute(e, t[e]);
	}), n != null && (r.textContent = n), r;
}
function Ge(e) {
	let t = e || (typeof window < "u" ? window.Scheduler : null), n = document.getElementById("tab-bid-planner");
	if (!n || !t || n.dataset.ebidBound === "1") return;
	let r = n.querySelector("#bp-ebid-root"), i = n.querySelector("#bp-miles-root");
	if (!r || !i) return;
	n.dataset.ebidBound = "1";
	let a = r.querySelector("#ebid-airport"), o = r.querySelector("#ebid-event"), s = r.querySelector("#ebid-start"), c = r.querySelector("#ebid-end"), l = r.querySelector("#ebid-shift-type"), u = r.querySelector("#ebid-source-badge"), d = r.querySelector("#ebid-status"), f = r.querySelector("#ebid-row-count"), p = r.querySelector("#ebid-head"), m = r.querySelector("#ebid-body"), h = r.querySelector("#ebid-search"), g = r.querySelector("#ebid-qa-summary"), _ = r.querySelector("#ebid-qa-list"), v = r.querySelector("#ebid-qa-distinct"), y = r.querySelector("#ebid-rules"), b = r.querySelector("#ebid-file"), x = {
		kind: "live",
		label: "LIVE LINES"
	}, S = [], C = "";
	function w() {
		return {
			airportCode: a.value.trim().toUpperCase(),
			bidEventId: o.value.trim(),
			startDate: s.value,
			endDate: c.value,
			shiftTypeMode: l.value || "Airport"
		};
	}
	function T() {
		let e = Pe(t);
		!a.value && e.airportCode && (a.value = e.airportCode), !o.value && e.bidEventId && (o.value = e.bidEventId), !s.value && e.startDate && (s.value = e.startDate), !c.value && e.endDate && (c.value = e.endDate);
	}
	function E() {
		let e = Pe(t);
		a.value = e.airportCode || "", o.value = e.bidEventId || "", s.value = e.startDate || "", c.value = e.endDate || "", l.value = "Airport";
	}
	function D(e) {
		d.textContent = e || "";
	}
	function O() {
		p.textContent = "", R.forEach((e) => p.appendChild($("th", null, e)));
	}
	function k(e) {
		if (m.textContent = "", f.textContent = String(S.length) + (C ? " · " + e.length + " match" : ""), !e.length) {
			let e = $("tr"), t = $("td", {
				colspan: "45",
				className: "bp-empty-msg"
			});
			t.textContent = S.length ? "No lines match that search." : "No lines in this session. Generate on Setup, then come back — or import a JSON / lines CSV as a fallback. Sample rows are not loaded.", e.appendChild(t), m.appendChild(e);
			return;
		}
		e.forEach((e) => {
			let t = $("tr");
			Ae(e).forEach((n, r) => {
				let i = $("td", null, n == null ? "" : String(n));
				r >= 27 && r <= 40 && Ae(e)[r - 14] === "RDO" && !n && (i.className = "ebid-rdo-type"), t.appendChild(i);
			}), m.appendChild(t);
		});
	}
	function A() {
		let e = C.trim().toLowerCase();
		return e ? S.filter((t) => [
			t.bidLineId,
			t.workgroup,
			t.title,
			t.patDown,
			t.schedType,
			t.certification,
			t.shiftTime,
			t.rdos,
			t.publicComments
		].join(" ").toLowerCase().indexOf(e) !== -1) : S;
	}
	function ee(e) {
		if (g.textContent = "", _.textContent = "", v.textContent = "", e.empty) {
			g.appendChild($("p", { className: "bp-empty-msg" }, "No lines to check. Totals stay at zero until this session has lines."));
			return;
		}
		let t = [
			["Lines", String(e.total)],
			["Schedule", e.ft + " FT / " + e.pt + " PT"],
			["Pat down", e.male + " M / " + e.female + " F"],
			["Rule breaks", e.errors + " error / " + e.warnings + " warn"]
		], n = $("div", { className: "ebid-stat-grid" });
		t.forEach((e) => {
			let t = $("div", { className: "ebid-stat" });
			t.appendChild($("div", { className: "ebid-stat-label" }, e[0])), t.appendChild($("div", { className: "ebid-stat-value" }, e[1])), n.appendChild(t);
		}), g.appendChild(n);
		let r = e.issues.slice(0, 80);
		r.length ? (r.forEach((e) => {
			let t = $("div", { className: "ebid-issue ebid-issue-" + e.level });
			t.appendChild($("span", { className: "ebid-issue-level" }, e.level === "error" ? "FAIL" : "WARN"));
			let n = (e.lineId ? "Line " + e.lineId + " — " : "") + e.message;
			t.appendChild($("span", null, n)), _.appendChild(t);
		}), e.issues.length > r.length && _.appendChild($("p", { className: "bp-subtitle" }, e.issues.length - r.length + " more not shown."))) : _.appendChild($("p", { className: "ebid-pass" }, "No rule breaks. RDO shift types are blank, cert pools sit in column 13, and the row is 45 columns (A–AS).")), Object.keys(e.distinct).forEach((t) => {
			let n = $("div", { className: "ebid-distinct" }), r = e.distinct[t], i = Object.keys(r);
			n.appendChild($("h4", null, t + " · " + i.length)), i.sort((e, t) => r[t] - r[e] || e.localeCompare(t)).forEach((e) => {
				let t = $("div", { className: "ebid-distinct-row" });
				t.appendChild($("span", null, e)), t.appendChild($("span", null, String(r[e]))), n.appendChild(t);
			}), v.appendChild(n);
		});
	}
	function te() {
		y.dataset.ready !== "1" && (y.dataset.ready = "1", ce.forEach((e) => {
			let t = $("tr");
			t.appendChild($("td", null, String(e.id))), t.appendChild($("td", null, e.header)), t.appendChild($("td", null, e.values)), t.appendChild($("td", null, e.desc)), y.appendChild(t);
		}));
	}
	function j(e, n) {
		S = e || [], u.textContent = n || x.label;
		let r = We(S);
		k(A()), ee(r);
		let i = t.state && Array.isArray(t.state.lines) ? t.state.lines.length : 0;
		x.kind === "live" && D(S.length ? S.length + " line(s) from this session." : "Session has " + i + " line(s).");
	}
	function M() {
		x.kind === "live" && (T(), j(Ie(t, w()), "LIVE LINES"));
	}
	function N(e) {
		[
			"lines",
			"qa",
			"info"
		].forEach((t) => {
			let n = r.querySelector("#ebid-tab-" + t), i = r.querySelector("[data-ebid-tab=\"" + t + "\"]");
			n && (n.hidden = t !== e), i && i.classList.toggle("active", t === e);
		}), e === "info" && te();
	}
	function P(e) {
		r.hidden = e !== "ebid", i.hidden = e !== "miles", n.querySelectorAll("[data-bp-view]").forEach((t) => {
			t.classList.toggle("active", t.getAttribute("data-bp-view") === e);
		}), e === "ebid" && M();
	}
	if (O(), te(), N("lines"), P("ebid"), M(), r.querySelector("#ebid-apply").addEventListener("click", () => {
		if (x.kind === "csv") {
			let e = He(x.text, w());
			if (e.error) {
				D(e.error);
				return;
			}
			j(e.rows, x.label), D(e.rows.length + " line(s) from the imported CSV.");
			return;
		}
		if (x.kind === "json") {
			let e = Ue(x.data, w());
			if (e.error) {
				D(e.error);
				return;
			}
			j(e.rows, x.label), D(e.rows.length + " line(s) from the imported JSON.");
			return;
		}
		M();
	}), r.querySelector("#ebid-live").addEventListener("click", () => {
		x = {
			kind: "live",
			label: "LIVE LINES"
		}, E(), M(), D("Using the lines in this session.");
	}), r.querySelector("#ebid-export").addEventListener("click", () => {
		if (!S.length) {
			D("Nothing to export. Generate lines or import a fallback file.");
			return;
		}
		let e = We(S), t = Le(S), n = new Blob([t], { type: "text/csv;charset=utf-8;" }), r = URL.createObjectURL(n), i = document.createElement("a"), a = (o.value.trim() || "eBid") + "_45Col_Import.csv";
		i.href = r, i.download = a, document.body.appendChild(i), i.click(), document.body.removeChild(i), URL.revokeObjectURL(r), D("Exported " + S.length + " line(s), 45 columns A–AS." + (e.errors ? " QA still has " + e.errors + " error(s)." : ""));
	}), r.querySelector("#ebid-import").addEventListener("click", () => b.click()), b.addEventListener("change", () => {
		let e = b.files && b.files[0];
		if (b.value = "", !e) return;
		let t = new FileReader();
		t.onload = () => {
			let n = String(t.result || ""), r = e.name.toLowerCase();
			if (r.endsWith(".json") || /^\s*[{[]/.test(n)) try {
				let t = JSON.parse(n), i = Ue(t, w());
				if (!i.error) {
					x = {
						kind: "json",
						label: "JSON IMPORT",
						data: t
					}, T(), t.config && t.config.startDate && !s.value && (s.value = String(t.config.startDate).slice(0, 10)), j(Ue(t, w()).rows, "JSON IMPORT"), D("Fallback import " + e.name + " · " + S.length + " line(s). Live lines are unchanged.");
					return;
				}
				if (r.endsWith(".json")) {
					D(i.error);
					return;
				}
			} catch {
				if (r.endsWith(".json")) {
					D("Could not read that JSON.");
					return;
				}
			}
			let i = He(n, w());
			if (i.error) {
				D(i.error);
				return;
			}
			x = {
				kind: "csv",
				label: "CSV IMPORT",
				text: n
			}, j(i.rows, "CSV IMPORT"), D("Fallback import " + e.name + " · " + S.length + " line(s). Live lines are unchanged.");
		}, t.readAsText(e);
	}), h.addEventListener("input", () => {
		C = h.value || "", k(A());
	}), r.querySelectorAll("[data-ebid-tab]").forEach((e) => {
		e.addEventListener("click", () => N(e.getAttribute("data-ebid-tab")));
	}), n.querySelectorAll("[data-bp-view]").forEach((e) => {
		e.addEventListener("click", () => P(e.getAttribute("data-bp-view")));
	}), !t.renderAll || !t.renderAll._ebidWrapped) {
		let e = t.renderAll, n = function() {
			typeof e == "function" && e.apply(this, arguments), M();
		};
		n._ebidWrapped = !0, t.renderAll = n;
	}
	document.addEventListener("click", (e) => {
		let t = e.target && e.target.closest ? e.target.closest("#blade-tabs .tab-btn") : null;
		t && t.dataset.tab === "bid-planner" && M();
	});
}
//#endregion
//#region modules/bid-planner/index.js
function Ke(e) {
	let t = e || window.Scheduler;
	Ge(t), oe(t);
}
//#endregion
export { Ke as default, Ke as initBidPlanner };
