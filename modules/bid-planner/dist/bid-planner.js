//#region modules/bid-planner/js/miles/calendar-grid.js
var e = [
	"#007bff",
	"#28a745",
	"#fd7e14",
	"#6f42c1",
	"#17a2b8",
	"#d63384"
], t = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
function n(t) {
	let n = String(t || ""), r = 0;
	for (let e = 0; e < n.length; e += 1) r = n.charCodeAt(e) + ((r << 5) - r);
	return e[Math.abs(r % e.length)];
}
function r(e) {
	return String(e).padStart(2, "0");
}
function i(e, i, a, o, s) {
	if (!e || !a) return;
	let c = a.getFullYear(), l = a.getMonth();
	i && (i.textContent = a.toLocaleDateString("en-US", {
		month: "long",
		year: "numeric"
	})), e.replaceChildren(), t.forEach((t) => {
		let n = document.createElement("div");
		n.className = "bp-miles-dow", n.textContent = t, e.appendChild(n);
	});
	let u = new Date(c, l, 1).getDay(), d = new Date(c, l + 1, 0).getDate();
	for (let t = 0; t < u; t += 1) {
		let t = document.createElement("div");
		t.className = "bp-miles-cell is-pad", e.appendChild(t);
	}
	for (let t = 1; t <= d; t += 1) {
		let i = c + "-" + r(l + 1) + "-" + r(t), a = document.createElement("div");
		a.className = "bp-miles-cell";
		let u = document.createElement("div");
		u.className = "bp-miles-day", u.textContent = String(t), a.appendChild(u), (o || []).forEach((e) => {
			(e.milestones || []).forEach((t) => {
				if (t.currentDate !== i) return;
				let r = document.createElement("button");
				r.type = "button", r.className = "bp-miles-event";
				let o = t.name, c = n(e.location);
				t.name.indexOf("Live Bid") === -1 ? t.name.indexOf("Lines Posted") !== -1 && (c = "#6f42c1") : (c = "#de350b", o = e.type), r.style.backgroundColor = c, r.title = e.featureName + ": " + t.name, r.textContent = e.location + ": " + o, r.addEventListener("click", () => {
					s && s(e.id);
				}), a.appendChild(r);
			});
		}), e.appendChild(a);
	}
}
//#endregion
//#region modules/bid-planner/js/miles/dates.js
var a = [
	"2026-01-01",
	"2026-01-19",
	"2026-02-16",
	"2026-05-25",
	"2026-06-19",
	"2026-07-03",
	"2026-07-04",
	"2026-09-07",
	"2026-10-12",
	"2026-11-11",
	"2026-11-26",
	"2026-12-25"
];
function o(e) {
	if (!e || typeof e != "string") return null;
	let t = e.trim().slice(0, 10).split("-");
	if (t.length !== 3) return null;
	let n = parseInt(t[0], 10), r = parseInt(t[1], 10) - 1, i = parseInt(t[2], 10);
	if (!Number.isFinite(n) || !Number.isFinite(r) || !Number.isFinite(i)) return null;
	let a = new Date(n, r, i);
	return a.getFullYear() !== n || a.getMonth() !== r || a.getDate() !== i ? null : a;
}
function s(e) {
	if (!(e instanceof Date) || Number.isNaN(e.getTime())) return "";
	let t = String(e.getMonth() + 1).padStart(2, "0"), n = String(e.getDate()).padStart(2, "0");
	return e.getFullYear() + "-" + t + "-" + n;
}
function c(e) {
	let t = e instanceof Date ? e : /* @__PURE__ */ new Date();
	return new Date(t.getFullYear(), t.getMonth(), t.getDate());
}
function l(e) {
	let t = e.getDay();
	return t === 0 || t === 6;
}
function u(e) {
	return a.indexOf(s(e)) !== -1;
}
function d(e, t) {
	let n = typeof e == "string" ? o(e) : e, r = typeof t == "string" ? o(t) : t;
	if (!n || !r) return 0;
	let i = Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()), a = Date.UTC(r.getFullYear(), r.getMonth(), r.getDate());
	return Math.round((i - a) / 864e5);
}
function f(e, t) {
	let n = new Date(e.getFullYear(), e.getMonth(), e.getDate()), r = t <= 0 ? -1 : 1, i = 0;
	for (; (l(n) || u(n)) && i < 15;) n.setDate(n.getDate() + r), i += 1;
	return n;
}
function p(e) {
	let t = o(e);
	return t ? t.getDay() === 0 ? s(t) : s(new Date(t.getFullYear(), t.getMonth(), t.getDate() - t.getDay())) : e;
}
//#endregion
//#region modules/bid-planner/js/miles/importExport.js
var m = [
	"Feature Name",
	"Color Tag",
	"Compliance",
	"Asset Id",
	"Feature ID",
	"Initiative",
	"Description"
], h = [
	"Work Item Name",
	"Due Date",
	"Work Item ID",
	"Feature",
	"Work Item Type"
];
function g(e) {
	return String(e ?? "").replace(/[\t\r\n]/g, " ");
}
function _(e) {
	let t = [m.slice()];
	return (e || []).forEach((e) => {
		t.push([
			e.featureName,
			"",
			"",
			"",
			"",
			e.type,
			e.type + " planning event for Station Category " + e.category
		]);
	}), t;
}
function v(e) {
	let t = [h.slice()];
	return (e || []).forEach((e) => {
		(e.milestones || []).forEach((n) => {
			let r = String(n.currentDate || "").split("-"), i = r.length === 3 ? r[1] + "/" + r[2] + "/" + r[0] : "";
			t.push([
				n.name,
				i,
				"",
				e.featureName,
				n.type
			]);
		});
	}), t;
}
function y(e, t) {
	return (t === "features" ? _(e) : v(e)).map((e) => e.map(g).join("	")).join("\n") + "\n";
}
function b(e) {
	let t = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CHAOS//Bid Portfolio Engine//EN\n";
	return (e || []).forEach((e) => {
		(e.milestones || []).forEach((n) => {
			let r = String(n.currentDate || "").replace(/-/g, ""), i = String(e.location + " - " + n.name).replace(/[\r\n]/g, " ");
			t += "BEGIN:VEVENT\nSUMMARY:" + i + "\nDTSTART;VALUE=DATE:" + r + "\nDTEND;VALUE=DATE:" + r + "\nEND:VEVENT\n";
		});
	}), t += "END:VCALENDAR", t;
}
function x(e) {
	if (e instanceof Date && !Number.isNaN(e.getTime())) {
		if (e.getHours() === 0 && e.getMinutes() === 0 && e.getSeconds() === 0) return s(e);
		if (e.getUTCHours() === 0 && e.getUTCMinutes() === 0 && e.getUTCSeconds() === 0) {
			let t = String(e.getUTCMonth() + 1).padStart(2, "0"), n = String(e.getUTCDate()).padStart(2, "0");
			return e.getUTCFullYear() + "-" + t + "-" + n;
		}
		return new Date(e.getTime() + e.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
	}
	if (typeof e == "number" && Number.isFinite(e)) {
		let t = new Date(Math.round((e - 25569) * 864e5));
		if (!Number.isNaN(t.getTime())) return s(new Date(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()));
	}
	let t = String(e ?? "").trim();
	if (/^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10);
	let n = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
	if (n) return n[3] + "-" + n[1].padStart(2, "0") + "-" + n[2].padStart(2, "0");
	let r = o(t);
	return r ? s(r) : "";
}
function S(e) {
	let t = [], n = [];
	return !e || typeof e.eachRow != "function" || e.eachRow({ includeEmpty: !1 }, (e, r) => {
		let i = e.values || [];
		if (r === 1) {
			for (let e = 1; e < i.length; e += 1) t[e] = String(i[e] == null ? "" : i[e]).trim();
			return;
		}
		let a = {}, o = !1;
		for (let e = 1; e < t.length; e += 1) t[e] && (a[t[e]] = i[e] == null ? "" : i[e], a[t[e]] !== "" && (o = !0));
		o && n.push(a);
	}), n;
}
function C(e, t) {
	let n = Date.now();
	return (e || []).map((e, r) => {
		let i = String(e["Feature Name"] || "").trim(), a = (t || []).filter((e) => String(e.Feature || "") === i).map((e, t) => ({
			id: n + r * 1e3 + t,
			name: String(e["Work Item Name"] || ""),
			type: String(e["Work Item Type"] || "Task"),
			currentDate: x(e["Due Date"]),
			offset: 0
		})).filter((e) => e.name), o = a.find((e) => e.name === "Live Bid Start"), c = a.find((e) => e.name === "Review gender balance" || e.name === "Seniority Validated"), l = s(/* @__PURE__ */ new Date());
		return {
			id: n + r,
			featureName: i,
			location: i.split(" ")[0] || "DAL",
			type: e.Initiative || "Shift Bid",
			category: "X_I",
			duration: 1,
			anchorD0: o && o.currentDate ? o.currentDate : l,
			planningStart: c && c.currentDate ? c.currentDate : l,
			fcfOpen: null,
			cyStart: null,
			scheduleStart: null,
			milestones: a
		};
	}).filter((e) => e.featureName);
}
function w(e) {
	return e || (typeof window < "u" && window.ExcelJS ? window.ExcelJS : null);
}
async function T(e, t) {
	let n = w(t);
	if (!n) throw Error("ExcelJS is not loaded");
	let r = new n.Workbook();
	r.creator = "BLADE";
	let i = r.addWorksheet("CHAOS-Features");
	_(e).forEach((e) => i.addRow(e));
	let a = r.addWorksheet("CHAOS-WorkItems");
	return v(e).forEach((e) => a.addRow(e)), r;
}
async function ee(e, t) {
	let n = w(t);
	if (!n) throw Error("ExcelJS is not loaded");
	let r = new n.Workbook();
	await r.xlsx.load(e);
	let i = r.getWorksheet("CHAOS-Features"), a = r.getWorksheet("CHAOS-WorkItems");
	if (!i || !a) throw Error("Invalid Excel file. Make sure it contains CHAOS-Features and CHAOS-WorkItems sheets.");
	return C(S(i), S(a));
}
function E(e, t) {
	let n = document.createElement("a"), r = URL.createObjectURL(e);
	n.href = r, n.download = t, document.body.appendChild(n), n.click(), document.body.removeChild(n), URL.revokeObjectURL(r);
}
async function te(e, t) {
	let n = await (await T(e, t)).xlsx.writeBuffer();
	E(new Blob([n], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), "CHAOS_Master_Bid_Portfolio.xlsx");
}
function D(e, t, n) {
	E(new Blob([e], { type: n || "text/plain" }), t);
}
//#endregion
//#region modules/bid-planner/js/miles/milestones.js
var O = [
	{
		name: "Seniority Validated",
		anchor: "planning",
		offset: 0,
		type: "Task"
	},
	{
		name: "Initial Meeting",
		anchor: "planning",
		offset: 1,
		type: "Meeting"
	},
	{
		name: "Draft Bidlines",
		anchor: "planning",
		offset: 1,
		type: "Task"
	},
	{
		name: "Meet with Leadership Team",
		anchor: "planning",
		offset: 1,
		type: "Meeting"
	},
	{
		name: "Bid Announcement Letter",
		anchor: "live",
		offset: -33,
		type: "Task"
	},
	{
		name: "Seniority Posted",
		anchor: "live",
		offset: -32,
		type: "Task"
	},
	{
		name: "Scheduling Committee Meeting",
		anchor: "live",
		offset: -32,
		type: "Meeting"
	},
	{
		name: "CBA/TSA validation",
		anchor: "live",
		offset: -32,
		type: "Task"
	},
	{
		name: "Review DAT/Bid Line limits",
		anchor: "live",
		offset: -32,
		type: "Task"
	},
	{
		name: "AFSD-S Approval",
		anchor: "live",
		offset: -32,
		type: "Task"
	},
	{
		name: "AFGE & Live bid Attendee ID'd",
		anchor: "live",
		offset: -32,
		type: "Task"
	},
	{
		name: "Phone Line Verified",
		anchor: "live",
		offset: -32,
		type: "Task"
	},
	{
		name: "FSD Approval",
		anchor: "live",
		offset: -27,
		type: "Task"
	},
	{
		name: "Bid Lines Posted",
		anchor: "live",
		offset: -22,
		type: "Task"
	},
	{
		name: "AFGE Rep Notified",
		anchor: "live",
		offset: -31,
		type: "Task"
	},
	{
		name: "Proxy Forms Returned to SOO",
		anchor: "live",
		offset: -6,
		type: "Task"
	},
	{
		name: "Live Bid Start",
		anchor: "live",
		offset: 0,
		type: "Task"
	}
], k = [
	{
		name: "Review gender balance",
		anchor: "planning",
		offset: 0,
		type: "Task"
	},
	{
		name: "Review AM/PM balance",
		anchor: "planning",
		offset: 0,
		type: "Task"
	},
	{
		name: "Draft Bid lines",
		anchor: "planning",
		offset: 0,
		type: "Task"
	},
	{
		name: "TSO/LTSO/STSO Seniority Validated",
		anchor: "planning",
		offset: 3,
		type: "Task"
	},
	{
		name: "TSO/LTSO/STSO Seniority Posted (Initial)",
		anchor: "planning",
		offset: 4,
		type: "Task"
	},
	{
		name: "AM Scheduling Committee Meeting",
		anchor: "planning",
		offset: 5,
		type: "Meeting"
	},
	{
		name: "Meet with Managers",
		anchor: "planning",
		offset: 6,
		type: "Meeting"
	},
	{
		name: "PM Scheduling Committee Meeting",
		anchor: "live",
		offset: -29,
		type: "Meeting"
	},
	{
		name: "Leadership Strategy & Guidance Meeting",
		anchor: "live",
		offset: -27,
		type: "Meeting"
	},
	{
		name: "AFSD-S/DAFSD-S Approval",
		anchor: "live",
		offset: -14,
		type: "Task"
	},
	{
		name: "FSD Approval",
		anchor: "live",
		offset: -14,
		type: "Task"
	},
	{
		name: "Conduct Bid Briefings",
		anchor: "live",
		offset: -18,
		type: "Meeting"
	},
	{
		name: "Bid Announcement Letter Posted",
		anchor: "live",
		offset: -14,
		type: "Task"
	},
	{
		name: "TSO/LTSO/STSO Seniority posted (Final)",
		anchor: "live",
		offset: -14,
		type: "Task"
	},
	{
		name: "Bid Lines Posted",
		anchor: "live",
		offset: -14,
		type: "Task"
	},
	{
		name: "Bid Letters Sent",
		anchor: "live",
		offset: -14,
		type: "Task"
	},
	{
		name: "Live bid Attendee ID'd",
		anchor: "live",
		offset: -11,
		type: "Task"
	},
	{
		name: "Proxy Forms Returned to SOO",
		anchor: "live",
		offset: -5,
		type: "Task"
	},
	{
		name: "Phone Line Verified",
		anchor: "live",
		offset: -1,
		type: "Task"
	},
	{
		name: "Room Setup complete",
		anchor: "live",
		offset: -1,
		type: "Task"
	},
	{
		name: "Live Bid Start",
		anchor: "live",
		offset: 0,
		type: "Task"
	}
], A = 0;
function j() {
	return A += 1, Date.now() * 1e3 + A % 1e3;
}
function M(e) {
	return e.map((e) => ({
		name: e.name,
		anchor: e.anchor,
		offset: e.offset,
		type: e.type
	}));
}
function N(e) {
	let t = e.type === "Leave Bid", n = M(t ? O : k), r = Math.max(1, parseInt(e.duration, 10) || 1);
	if (r > 1) for (let e = 2; e <= r; e += 1) n.push({
		name: t ? "Live Bid Day " + e : "Live Bid Day " + e + " /Results Posted",
		anchor: "live",
		offset: e - 1,
		type: "Task"
	});
	return t ? (e.category === "III_IV" && (n.push({
		name: "Spoke Phone Bid (Stage 1)",
		anchor: "live",
		offset: 7,
		type: "Task"
	}), n.push({
		name: "Spoke Phone Bid (Stage 2)",
		anchor: "live",
		offset: 8,
		type: "Task"
	})), n.push({
		name: "First Come First Serve Open",
		anchor: "fcf",
		offset: 0,
		type: "Task"
	})) : n.push({
		name: "Implement Bid",
		anchor: "implementation",
		offset: e.category === "III_IV" ? 21 : 28,
		type: "Task"
	}), n;
}
function P(e) {
	return e instanceof Date ? c(e) : typeof e == "string" && o(e) || c();
}
function F(e, t) {
	let n = P(t), r = o(e.anchorD0), i = o(e.planningStart);
	return e.milestones = N(e).map((t) => {
		let a = null;
		return t.anchor === "planning" ? (a = i ? new Date(i.getTime()) : new Date(n.getTime()), a.setDate(a.getDate() + t.offset)) : t.anchor === "fcf" ? a = o(e.fcfOpen) || new Date(n.getTime()) : t.anchor === "implementation" ? a = o(e.scheduleStart) || new Date(n.getTime()) : (a = r ? new Date(r.getTime()) : new Date(n.getTime()), a.setDate(a.getDate() + t.offset)), a < n && (a = new Date(n.getTime())), t.name !== "Implement Bid" && (a = f(a, t.offset || -1)), {
			id: j(),
			name: t.name,
			type: t.type,
			offset: t.offset || 0,
			currentDate: s(a)
		};
	}), e;
}
function ne(e) {
	let t = String(e.location || "DAL").toUpperCase().trim() || "DAL", n = e.type === "Shift Bid" ? "Shift Bid" : "Leave Bid";
	return F({
		id: j(),
		featureName: t + " CY27 " + (n === "Leave Bid" ? "Annual Leave" : "Operational") + " Bid",
		location: t,
		type: n,
		category: e.category === "III_IV" ? "III_IV" : "X_I",
		duration: Math.max(1, parseInt(e.duration, 10) || 1),
		anchorD0: e.anchorD0,
		planningStart: e.planningStart,
		fcfOpen: n === "Leave Bid" && e.fcfOpen || null,
		cyStart: n === "Leave Bid" && e.cyStart || null,
		scheduleStart: n === "Shift Bid" && e.scheduleStart || null,
		milestones: []
	}, e.today);
}
function re(e, t) {
	let n = d(t.currentDate, e.anchorD0);
	return "Live Bid Start " + (n >= 0 ? "+" : "") + n + " Days";
}
function ie(e, t) {
	if (t.name === "Bid Lines Posted") {
		let n = (e.milestones || []).find((e) => e.name.indexOf("Live Bid Start") !== -1);
		if (n) {
			let r = d(n.currentDate, t.currentDate), i = e.type === "Leave Bid" ? 10 : 14;
			if (r < i) return {
				compliant: !1,
				msg: "CBA Violation (Requires " + i + " days notice, got " + r + ")"
			};
		}
	}
	if (t.name === "Implement Bid") {
		let n = (e.milestones || []).find((e) => e.name.indexOf("Live Bid Start") !== -1);
		if (n) {
			let r = d(t.currentDate, n.currentDate), i = e.category === "III_IV" ? 21 : 28;
			if (r < i) return {
				compliant: !1,
				msg: "Buffer Deficit (Requires " + i + " days, got " + r + ")"
			};
		}
	}
	return t.name === "First Come First Serve Open" && e.cyStart && d(t.currentDate, e.cyStart) >= 0 ? {
		compliant: !1,
		msg: "FCFS must be before CY Start"
	} : {
		compliant: !0,
		msg: "Compliant"
	};
}
function ae(e, t, n, r) {
	let i = (e.milestones || []).find((e) => String(e.id) === String(t));
	return i ? (i.currentDate = n, i.name === "Live Bid Start" ? (e.anchorD0 = n, F(e, r)) : (i.name === "Review gender balance" || i.name === "Seniority Validated") && (e.planningStart = n, F(e, r)), !0) : !1;
}
//#endregion
//#region modules/bid-planner/js/miles/portfolio.js
var oe = "blade.bid-planner.portfolio";
function se(e) {
	return e || (typeof localStorage < "u" ? localStorage : null);
}
function ce(e) {
	let t = se(e);
	if (!t) return [];
	try {
		let e = t.getItem(oe);
		if (!e) return [];
		let n = JSON.parse(e);
		return Array.isArray(n) ? n : [];
	} catch {
		return [];
	}
}
function le(e, t) {
	let n = se(t);
	n && n.setItem(oe, JSON.stringify(Array.isArray(e) ? e : []));
}
function ue(e) {
	let t = ce(e);
	function n() {
		le(t, e);
	}
	return {
		list: function() {
			return t;
		},
		replace: function(e) {
			t = Array.isArray(e) ? e.slice() : [], n();
		},
		add: function(e) {
			t.push(e), n();
		},
		remove: function(e) {
			t = t.filter((t) => String(t.id) !== String(e)), n();
		},
		touch: function() {
			n();
		}
	};
}
//#endregion
//#region modules/bid-planner/js/miles/bind.js
function I(e, t) {
	return e.querySelector("[data-miles=\"" + t + "\"]");
}
function L(e, t, n, r) {
	let i = document.createElement("label");
	i.textContent = e;
	let a = document.createElement("input");
	return a.type = t, a.dataset.miles = n, r && (a.value = r), i.appendChild(a), i;
}
function R(e) {
	let t = I(e, "dynamic"), n = I(e, "bid-type");
	if (!t || !n) return;
	if (t.replaceChildren(), n.value === "Leave Bid") {
		t.appendChild(L("FCFS Open", "date", "fcf", "2026-12-20")), t.appendChild(L("CY Start Date", "date", "cy", "2027-01-01"));
		return;
	}
	let r = L("Schedule Start Date", "date", "schedule", "2026-11-15"), i = r.querySelector("input");
	i.addEventListener("change", () => {
		let t = p(i.value);
		if (t && t !== i.value) {
			i.value = t;
			let n = I(e, "status");
			n && (n.textContent = "Schedule Start Date must be a Sunday. Moved to " + t + ".");
		}
	}), t.appendChild(r);
}
function de(e, t, n) {
	if (e.replaceChildren(), !t.length) {
		let t = document.createElement("p");
		t.className = "bp-miles-empty", t.textContent = "No bids in the portfolio yet.", e.appendChild(t);
		return;
	}
	t.forEach((t) => {
		let r = document.createElement("div");
		r.className = "bp-miles-item";
		let i = document.createElement("div"), a = document.createElement("strong");
		a.textContent = t.featureName;
		let o = document.createElement("span");
		o.textContent = "Cat " + t.category + " · Live Bid Start " + t.anchorD0, i.appendChild(a), i.appendChild(o);
		let s = document.createElement("div");
		s.className = "bp-miles-item-actions";
		let c = document.createElement("button");
		c.type = "button", c.className = "bp-miles-btn bp-miles-btn-muted", c.textContent = "Inspect", c.addEventListener("click", () => n.inspect(t.id));
		let l = document.createElement("button");
		l.type = "button", l.className = "bp-miles-btn bp-miles-btn-danger", l.textContent = "Remove", l.addEventListener("click", () => n.remove(t.id)), s.appendChild(c), s.appendChild(l), r.appendChild(i), r.appendChild(s), e.appendChild(r);
	});
}
function z(e, t) {
	let n = I(e, "inspect"), r = I(e, "inspect-title"), i = I(e, "inspect-body");
	if (n && i) {
		if (!t) {
			n.hidden = !0, i.replaceChildren();
			return;
		}
		n.hidden = !1, r && (r.textContent = "Inspecting Milestones for " + t.featureName), t.milestones.sort((e, t) => e.currentDate < t.currentDate ? -1 : +(e.currentDate > t.currentDate)), i.replaceChildren(), t.milestones.forEach((e) => {
			let n = document.createElement("tr"), r = document.createElement("td"), a = document.createElement("input");
			a.type = "text", a.className = "bp-miles-name", a.value = e.name, a.dataset.id = String(e.id), a.dataset.field = "name", r.appendChild(a);
			let o = document.createElement("td"), s = document.createElement("span");
			s.className = "bp-miles-badge", s.textContent = e.type, o.appendChild(s);
			let c = document.createElement("td"), l = document.createElement("input");
			l.type = "date", l.value = e.currentDate, l.dataset.id = String(e.id), l.dataset.field = "date", c.appendChild(l);
			let u = document.createElement("td");
			u.className = "bp-miles-offset", u.textContent = re(t, e);
			let d = document.createElement("td"), f = ie(t, e), p = document.createElement("span");
			p.className = "bp-miles-badge " + (f.compliant ? "is-ok" : "is-bad"), p.textContent = f.msg, d.appendChild(p);
			let m = document.createElement("td"), h = document.createElement("button");
			h.type = "button", h.className = "bp-miles-btn bp-miles-btn-danger", h.textContent = "Delete", h.dataset.id = String(e.id), h.dataset.field = "delete", m.appendChild(h), n.appendChild(r), n.appendChild(o), n.appendChild(c), n.appendChild(u), n.appendChild(d), n.appendChild(m), i.appendChild(n);
		});
	}
}
function B(e, t) {
	let n = o(e);
	return n ? new Date(n.getFullYear(), n.getMonth(), 1) : t;
}
function fe(e) {
	let t = document.getElementById("tab-bid-planner");
	if (!t) return;
	let n = t.querySelector("#bp-miles-root");
	if (!n || n.dataset.milesBound === "1") return;
	n.dataset.milesBound = "1";
	let r = ue(), a = null, o = c(), l = r.list()[0], u = B(l && l.anchorD0, new Date(o.getFullYear(), o.getMonth(), 1)), d = I(n, "planning");
	d && !d.value && (d.value = s(o)), R(n);
	function f(e) {
		let t = I(n, "status");
		t && (t.textContent = e || "");
	}
	function p() {
		return r.list().find((e) => String(e.id) === String(a)) || null;
	}
	function m() {
		let e = r.list();
		de(I(n, "portfolio"), e, {
			inspect: function(e) {
				a = e;
				let t = p();
				t && (u = B(t.anchorD0, u)), m();
			},
			remove: function(e) {
				r.remove(e), String(a) === String(e) && (a = null), f("Removed from the portfolio."), m();
			}
		}), i(I(n, "grid"), I(n, "month"), u, e, (e) => {
			a = e, z(n, p());
		}), z(n, p());
	}
	I(n, "bid-type").addEventListener("change", () => R(n)), I(n, "add").addEventListener("click", () => {
		let e = I(n, "bid-type").value, t = I(n, "anchor").value, i = I(n, "planning").value;
		if (!t || !i) {
			f("Please supply both Live Bid Start and Planning Start dates.");
			return;
		}
		let s = I(n, "fcf"), c = I(n, "cy"), l = I(n, "schedule");
		if (e === "Leave Bid" && (!s || !s.value || !c || !c.value)) {
			f("Leave bids need an FCFS Open date and a CY Start Date.");
			return;
		}
		if (e === "Shift Bid" && (!l || !l.value)) {
			f("Shift bids need a Sunday Schedule Start Date.");
			return;
		}
		let d = ne({
			location: I(n, "location").value,
			type: e,
			category: I(n, "airport-cat").value,
			duration: I(n, "duration").value,
			anchorD0: t,
			planningStart: i,
			fcfOpen: s ? s.value : "",
			cyStart: c ? c.value : "",
			scheduleStart: l ? l.value : "",
			today: o
		});
		r.add(d), a = d.id, u = B(d.anchorD0, u), f("Added " + d.featureName + "."), m();
	}), I(n, "prev").addEventListener("click", () => {
		u.setMonth(u.getMonth() - 1), m();
	}), I(n, "next").addEventListener("click", () => {
		u.setMonth(u.getMonth() + 1), m();
	}), I(n, "export-json").addEventListener("click", () => {
		let e = r.list();
		if (!e.length) {
			f("Portfolio is empty. Nothing to export.");
			return;
		}
		D(JSON.stringify(e, null, 2), "chaos_portfolio.json", "application/json"), f("Exported portfolio JSON.");
	}), I(n, "ics").addEventListener("click", () => {
		let e = r.list();
		if (!e.length) {
			f("Portfolio is empty. Nothing to export.");
			return;
		}
		D(b(e), "chaos_master_schedule.ics", "text/calendar"), f("Exported the master calendar.");
	}), I(n, "print").addEventListener("click", () => window.print()), I(n, "print-list").addEventListener("click", () => window.print());
	function h(e) {
		let t = r.list();
		if (!t.length) {
			f("Portfolio is empty. Nothing to copy.");
			return;
		}
		let n = y(t, e), i = e === "features" ? "CHAOS-Features" : "CHAOS-WorkItems", a = () => f(i + " copied to clipboard.");
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(n).then(a).catch(() => {
				D(n, i + ".tsv", "text/tab-separated-values"), f("Clipboard blocked. Downloaded " + i + " instead.");
			});
			return;
		}
		D(n, i + ".tsv", "text/tab-separated-values"), f("Downloaded " + i + ".");
	}
	I(n, "copy-features").addEventListener("click", () => h("features")), I(n, "copy-work").addEventListener("click", () => h("workitems")), I(n, "export-excel").addEventListener("click", () => {
		let e = r.list();
		if (!e.length) {
			f("No schedules added to compile yet.");
			return;
		}
		te(e).then(() => {
			f("Downloaded CHAOS_Master_Bid_Portfolio.xlsx.");
		}).catch((e) => {
			f(e && e.message ? e.message : "Excel export failed.");
		});
	});
	let g = I(n, "json-file");
	I(n, "import-json").addEventListener("click", () => g.click()), g.addEventListener("change", () => {
		let e = g.files && g.files[0];
		if (g.value = "", !e) return;
		let t = new FileReader();
		t.onload = () => {
			try {
				let e = JSON.parse(String(t.result || ""));
				if (!Array.isArray(e)) {
					f("Invalid JSON format. Please import a valid portfolio file.");
					return;
				}
				r.replace(e), a = e[0] ? e[0].id : null, e[0] && (u = B(e[0].anchorD0, u)), f("Portfolio successfully imported."), m();
			} catch (e) {
				f("Error parsing JSON file: " + (e && e.message ? e.message : "invalid"));
			}
		}, t.readAsText(e);
	});
	let _ = I(n, "excel-file");
	I(n, "import-excel").addEventListener("click", () => _.click()), _.addEventListener("change", () => {
		let e = _.files && _.files[0];
		if (_.value = "", !e) return;
		let t = new FileReader();
		t.onload = () => {
			ee(t.result).then((e) => {
				r.replace(e), a = e[0] ? e[0].id : null, e[0] && (u = B(e[0].anchorD0, u)), f("Portfolio successfully imported from Excel."), m();
			}).catch((e) => {
				f(e && e.message ? e.message : "Error processing Excel file.");
			});
		}, t.readAsArrayBuffer(e);
	}), I(n, "inspect-body").addEventListener("change", (e) => {
		let t = e.target;
		if (!t || !t.dataset) return;
		let s = p();
		if (s) {
			if (t.dataset.field === "name") {
				let e = s.milestones.find((e) => String(e.id) === t.dataset.id);
				e && (e.name = t.value), r.touch(), i(I(n, "grid"), I(n, "month"), u, r.list(), (e) => {
					a = e, m();
				});
				return;
			}
			t.dataset.field === "date" && (ae(s, t.dataset.id, t.value, o), r.touch(), m());
		}
	}), I(n, "inspect-body").addEventListener("click", (e) => {
		let t = e.target && e.target.closest ? e.target.closest("button") : null;
		if (!t || t.dataset.field !== "delete") return;
		let n = p();
		n && (n.milestones = n.milestones.filter((e) => String(e.id) !== t.dataset.id), r.touch(), m());
	}), m();
}
//#endregion
//#region modules/bid-planner/js/ebid.js
var pe = /* @__PURE__ */ "Airport Code.Shift Bid Event ID.Schedule Start Date.Schedule End Date.Bid Line ID.Location/Workgroup.Patdown Req.Title.Certification.Schedule Type.Shift Time.Private Bid Line Comments.Public Bid Line Comments.D01 Shift Time.D02 Shift Time.D03 Shift Time.D04 Shift Time.D05 Shift Time.D06 Shift Time.D07 Shift Time.D08 Shift Time.D09 Shift Time.D10 Shift Time.D11 Shift Time.D12 Shift Time.D13 Shift Time.D14 Shift Time.D01 Shift Type.D02 Shift Type.D03 Shift Type.D04 Shift Type.D05 Shift Type.D06 Shift Type.D07 Shift Type.D08 Shift Type.D09 Shift Type.D10 Shift Type.D11 Shift Type.D12 Shift Type.D13 Shift Type.D14 Shift Type.RDOs.Hours/Day.Hours/PP.Days/Week".split("."), me = [
	{
		id: 1,
		header: "Airport Code",
		values: "3-letter airport code",
		desc: "3 letter airport code (e.g. ANC, LAX, SFO)."
	},
	{
		id: 2,
		header: "Shift Bid Event ID",
		values: "Full bid event name, up to 100 characters",
		desc: "Same value on every line. Must match the Bid Event name in eBid. The v3 sheet says 10 characters; this export keeps the full name you type."
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
		desc: "The Line column from the lines table, unchanged (Line 001 stays Line 001). Unique within the airport. eBid allows 8 characters."
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
], he = [
	"SU",
	"MO",
	"TU",
	"WE",
	"TH",
	"FR",
	"SA"
], ge = [
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
], _e = [
	"ESTI",
	"MSTI",
	"ETSO",
	"SSTI",
	"STSO",
	"LTSO",
	"STI",
	"SSA",
	"EMT"
], ve = [
	"Airport",
	"Training",
	"Admin/Avail"
], V = /^(\d{4}-\d{4})( \d{4}-\d{4})?$/;
function H(e) {
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
function ye(e, t) {
	let n = String(e || "").split("-").map(Number);
	if (n.length !== 3 || n.some((e) => !Number.isFinite(e))) return "";
	let r = new Date(Date.UTC(n[0], n[1] - 1, n[2]));
	return r.setUTCDate(r.getUTCDate() + t), r.toISOString().slice(0, 10);
}
function be(e) {
	let t = String(e || "").split("-").map(Number);
	return t.length !== 3 || t.some((e) => !Number.isFinite(e)) ? 0 : new Date(Date.UTC(t[0], t[1] - 1, t[2])).getUTCDay();
}
function U(e, t) {
	return e && /^\d{4}-\d{2}-\d{2}$/.test(e) ? be(ye(e, t)) : t % 7;
}
function xe(e) {
	if (e == null) return "";
	let t = String(e).trim().replace(/[\u2013\u2014]/g, "-"), n = t.match(/^(\d{1,2}):(\d{2})$/);
	if (n) return n[1].padStart(2, "0") + n[2];
	let r = t.match(/^(\d{3,4})$/);
	return r ? r[1].padStart(4, "0") : "";
}
function W(e) {
	if (!e) return [];
	let t = String(e).replace(/[\u2013\u2014]/g, "-").replace(/\s*\/\s*/g, " "), n = /(\d{1,2}:\d{2}|\d{3,4})\s*-\s*(\d{1,2}:\d{2}|\d{3,4})/g, r = [], i;
	for (; (i = n.exec(t)) && (r.push({
		start: i[1],
		end: i[2]
	}), r.length !== 2););
	return r;
}
function G(e) {
	if (!e || !e.length) return "";
	let t = [];
	for (let n = 0; n < Math.min(2, e.length); n++) {
		let r = xe(e[n] && e[n].start), i = xe(e[n] && e[n].end);
		if (!r || !i) return "";
		t.push(r + "-" + i);
	}
	return t.join(" ");
}
function Se(e) {
	if (!e || e === "RDO" || !V.test(e)) return 0;
	let t = 0;
	e.split(" ").forEach((e) => {
		let n = e.split("-"), r = n[0], i = n[1], a = parseInt(r.slice(0, 2), 10) * 60 + parseInt(r.slice(2), 10), o = parseInt(i.slice(0, 2), 10) * 60 + parseInt(i.slice(2), 10);
		o < a && (o += 1440), t += o - a;
	});
	let n = t / 60, r = n >= 6 ? n - .5 : n;
	return Math.round(r * 100) / 100;
}
function K(e) {
	if (!Number.isFinite(e)) return "";
	let t = Math.round(e * 100) / 100;
	return String(t);
}
function Ce(e, t) {
	if (!t || !e) return null;
	let n = t[e.id] == null ? t[String(e.id)] : t[e.id];
	return Array.isArray(n) ? n : null;
}
function we(e, t, n, r) {
	if (e && Array.isArray(e._weekdayCells)) {
		let t = e._weekdayCells[U(r, n)];
		return Te(t, "").status;
	}
	let i = Ce(e, t);
	return i && i.length ? (n < i.length ? i[n] : i[n % i.length]) === "WORK" ? "WORK" : "RDO" : new Set((e && e.rdoDays ? e.rdoDays : []).map(Number)).has(U(r, n)) ? "RDO" : "WORK";
}
function Te(e, t) {
	let n = String(e ?? "").trim();
	if (!n || /^rdo$/i.test(n) || /^off$/i.test(n) || n === "—" || n === "-") return {
		status: "RDO",
		span: "RDO"
	};
	let r = W(n);
	return r.length ? {
		status: "WORK",
		span: G(r) || t || ""
	} : {
		status: "WORK",
		span: t || ""
	};
}
function Ee(e, t) {
	if (!e || !e.dayTimes) return null;
	let n = e.dayTimes[t] == null ? e.dayTimes[String(t)] : e.dayTimes[t];
	return !n || typeof n != "object" ? null : Array.isArray(n.segments) && n.segments.length >= 2 ? n.segments.slice(0, 2) : n.start && n.end ? [{
		start: n.start,
		end: n.end
	}] : null;
}
function De(e, t) {
	if (t && Array.isArray(t.segments) && t.segments.length >= 2) return t.segments.slice(0, 2);
	let n = W(e && e.shiftLabel);
	return n.length >= 2 ? n : e && e.startTime && e.endTime ? [{
		start: e.startTime,
		end: e.endTime
	}] : t && t.start && t.end ? [{
		start: t.start,
		end: t.end
	}] : n.length ? n : [];
}
function Oe(e, t, n, r) {
	let i = Ee(e, n);
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
	return De(e, t);
}
function ke(e, t) {
	if (!e) return null;
	if (t && typeof t.getShift == "function") {
		let n = t.getShift(e.shiftId);
		if (n) return n;
	}
	return (t && t.shifts || []).find((t) => t && t.id === e.shiftId) || null;
}
function Ae(e, t) {
	return String(e && e.lineCode || "").trim() || (e && e.id != null ? String(e.id).trim() : "") || String((t || 0) + 1);
}
function je(e) {
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
	for (let e = 0; e < _e.length; e++) {
		let t = _e[e];
		if (n === t || RegExp("\\b" + t + "\\b").test(n)) return t;
	}
	return "TSO";
}
function Me(e) {
	if (!e) return "FT";
	let t = String(e.empClass || "").trim().toUpperCase(), n = String(e.position || "").trim().toUpperCase();
	return e.isStso || e.isLtso || t === "STSO" || t === "LTSO" || n === "STSO" || n === "LTSO" ? "FT" : e.isPt === !0 || t === "PT" || n === "PT" ? "PT" : "FT";
}
function Ne(e) {
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
function Pe(e) {
	let t = String(e ?? "").trim();
	if (!t) return "";
	let n = t.replace(/^pool\s*/i, "").trim(), r = (/^pool\b/i.test(t) ? n : t).toUpperCase();
	return r ? "Pool " + r : "";
}
function Fe(e) {
	let t = String(e || "").trim();
	if (!t || t === "—") return "";
	let n = t;
	return /^team\b/i.test(n) && (n = n.replace(/^team\s*/i, "").trim()), /^\d+$/.test(n) ? ("Team " + String(Number(n)).padStart(2, "0")).slice(0, 30) : /^team\b/i.test(t) ? ("Team " + n).slice(0, 30) : t.slice(0, 30);
}
function Ie(e) {
	let t = String(e ?? "").trim().toUpperCase();
	return t === "M" || t === "MALE" ? "Male" : t === "F" || t === "FEMALE" ? "Female" : "None";
}
function Le(e, t) {
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
function Re(e) {
	if (!e) return !1;
	let t = String(e.empClass || "").toUpperCase(), n = String(e.extraName || "").toUpperCase();
	return !!(e.isTraining || e.trainingClass || e.function === "TRAINING" || t === "ESTI" || t === "MSTI" || n === "ESTI" || n === "MSTI");
}
function ze(e, t, n) {
	if (Re(t)) return "Training";
	if (e === "Admin/Avail") return "Admin/Avail";
	if (e === "Training") return "Training";
	if (e === "PandemicMix") {
		if (n === 1) return "Admin/Avail";
		if (n === 2) return "Training";
	}
	return "Airport";
}
function Be(e, t) {
	let n = [], r = [];
	for (let i = 0; i < 14; i++) {
		if (!e[i]) continue;
		let a = he[U(t, i)] || "";
		(i < 7 ? n : r).push(a);
	}
	let i = n.join("/"), a = r.join("/");
	return i === a ? i : (i + " " + a).trim();
}
function Ve(e, t, n) {
	t = t || {};
	let r = [], i = H(t.startDate);
	i || r.push("Schedule start date is blank; D01 is treated as Sunday.");
	let a = ke(e, t), o = G(De(e, a)), s = [], c = [], l = [], u = 0;
	for (let n = 0; n < 14; n++) {
		if (we(e, t.schedule, n, i) === "RDO") {
			s.push("RDO"), c.push(""), l.push(!0);
			continue;
		}
		l.push(!1);
		let d = U(i, n), f = "";
		f = e && Array.isArray(e._weekdayCells) ? Te(e._weekdayCells[d], o).span : G(Oe(e, a, d, t)) || o, f || r.push("D" + String(n + 1).padStart(2, "0") + " is a work day with no shift time."), s.push(f), u += 1, c.push(ze(t.shiftTypeMode, e, u));
	}
	let d = s.filter((e) => e && e !== "RDO"), f = o;
	if (d.length) {
		let e = {};
		d.forEach((t) => {
			e[t] = (e[t] || 0) + 1;
		}), f = Object.keys(e).sort((t, n) => e[n] - e[t] || t.localeCompare(n))[0];
	}
	f || (f = d.length ? "" : "RDO");
	let p = Se(f), m = s.filter((e) => e !== "RDO").length, h = Math.round(m * p * 100) / 100, g = !1;
	h > 80 && (h = 80, g = !0, r.push("Hours/PP capped at 80."));
	let _ = s.slice(0, 7).filter((e) => e !== "RDO").length, v = s.slice(7).filter((e) => e !== "RDO").length, y = Ne(e);
	y.defaulted && y.reason && r.push(y.reason);
	let b = e && e.certPool != null ? String(e.certPool).trim() : "";
	b || r.push("Cert pool is blank; column 13 (Public Bid Line Comments) is empty."), e && e.sex != null && String(e.sex).trim() || r.push("Sex is blank; Patdown Req exported as None.");
	let x = Fe(Le(e, t));
	return {
		airportCode: String(t.airportCode || "").trim().toUpperCase(),
		bidEventId: String(t.bidEventId || "").trim(),
		startDate: i,
		endDate: H(t.endDate),
		bidLineId: Ae(e, n),
		workgroup: x,
		patDown: Ie(e && e.sex),
		title: je(e),
		certification: y.cert,
		schedType: Me(e),
		shiftTime: f,
		privateComments: "",
		publicComments: Pe(b),
		dayShiftTimes: s,
		dayShiftTypes: c,
		rdos: Be(l, i),
		hoursPerDay: p,
		hoursPerPP: h,
		daysPerWeek: _ === v ? String(_) : _ + "/" + v,
		capped: g,
		warnings: r,
		sourceId: e && e.id != null ? e.id : ""
	};
}
function q(e) {
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
		K(e.hoursPerDay),
		K(e.hoursPerPP),
		e.daysPerWeek
	];
}
function He(e) {
	return (e || []).slice().sort((e, t) => {
		let n = Number(e && e.id), r = Number(t && t.id), i = Number.isFinite(n), a = Number.isFinite(r);
		return i && a && n !== r ? n - r : i === a ? String(e && e.id).localeCompare(String(t && t.id)) : i ? -1 : 1;
	});
}
function J(e, t) {
	return He(e).filter((e) => e && typeof e == "object").map((e, n) => Ve(e, t, n));
}
function Ue(e) {
	if (!e || !/^\d{4}-\d{2}-\d{2}$/.test(e)) return "";
	let t = e.slice(0, 4) + "-12-31";
	return t < e ? e : t;
}
function Y(e) {
	let t = e || {}, n = t.state || {}, r = H(n.startDate), i = "";
	typeof t.getAirportCode == "function" && (i = t.getAirportCode() || ""), !i && n.airportCode && (i = n.airportCode), i = String(i || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3);
	let a = i && r ? (i + r.slice(0, 7)).slice(0, 10) : "";
	return {
		airportCode: i,
		bidEventId: a,
		startDate: r,
		endDate: Ue(r),
		shiftTypeMode: "Airport"
	};
}
function We(e, t) {
	let n = e || {}, r = n.state || {}, i = t || {}, a = Y(n);
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
function Ge(e, t) {
	let n = e && e.state || {};
	return J(Array.isArray(n.lines) ? n.lines : [], We(e, t));
}
function Ke(e) {
	let t = (e) => "\"" + (e == null ? "" : String(e)).replace(/"/g, "\"\"") + "\"", n = [pe.map(t).join(",")];
	return (e || []).forEach((e) => {
		n.push(q(e).map(t).join(","));
	}), n.join("\r\n");
}
function qe(e) {
	return String(e || "").replace(/^\uFEFF/, "").split(/\r?\n/).filter((e) => e.trim().length > 0).map((e) => {
		let t = [], n = !1, r = "";
		for (let i = 0; i < e.length; i++) {
			let a = e[i];
			a === "\"" ? n && e[i + 1] === "\"" ? (r += "\"", i++) : n = !n : a === "," && !n ? (t.push(r.trim()), r = "") : r += a;
		}
		return t.push(r.trim()), t;
	});
}
function Je(e) {
	let t = {};
	return e.forEach((e, n) => {
		let r = String(e || "").trim().toLowerCase();
		r && t[r] == null && (t[r] = n);
	}), t;
}
function X(e, t) {
	for (let n = 0; n < t.length; n++) if (e[t[n]] != null) return e[t[n]];
	return -1;
}
function Ye(e) {
	let t = (e || []).map((e) => String(e || "").trim().toLowerCase());
	return t.indexOf("airport code") !== -1 && t.indexOf("d01 shift time") !== -1 && t.indexOf("public bid line comments") !== -1;
}
function Xe(e, t) {
	let n = e.line || "", r = n.replace(/^line\s+/i, "").trim(), i = n || t + 1;
	/^\d+$/.test(r) && (i = Number(r));
	let a = e.shift || "", o = W(a).length ? a : "";
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
function Ze(e, t) {
	let n = qe(e);
	if (n.length < 2) return {
		error: "That CSV has no line rows.",
		rows: []
	};
	let r = n[0];
	if (Ye(r)) return {
		error: "That file is already a 45-column eBid export. Build the upload from the live lines instead of re-uploading an old CSV.",
		rows: []
	};
	let i = Je(r), a = {
		team: X(i, [
			"team",
			"partner team",
			"location/workgroup",
			"workgroup"
		]),
		line: X(i, [
			"line",
			"line id",
			"bid line id"
		]),
		shift: X(i, ["shift"]),
		start: X(i, ["start"]),
		end: X(i, ["end"]),
		position: X(i, ["position", "title"]),
		emp: X(i, [
			"emp",
			"emp class",
			"schedule type"
		]),
		sex: X(i, [
			"sex",
			"gender",
			"patdown req",
			"pat down req"
		]),
		fn: X(i, [
			"function",
			"cert",
			"certification"
		]),
		certPool: X(i, [
			"cert pool",
			"certpool",
			"public bid line comments"
		]),
		paid: X(i, ["paid", "hours/day"]),
		sun: X(i, ["sun"]),
		mon: X(i, ["mon"]),
		tue: X(i, ["tue"]),
		wed: X(i, ["wed"]),
		thu: X(i, ["thu"]),
		fri: X(i, ["fri"]),
		sat: X(i, ["sat"])
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
		}, l = Xe(i, s.length);
		i.team && c.push({
			id: "t" + e,
			name: i.team,
			members: [l.id]
		}), s.push(l);
	}
	return {
		error: "",
		rows: J(s, Object.assign({}, t || {}, {
			teams: c,
			schedule: {},
			shifts: []
		}))
	};
}
function Z(e, t) {
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
		rows: J(i, {
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
function Qe(e) {
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
		e.schedType === "FT" ? i += 1 : e.schedType === "PT" && (a += 1), e.patDown === "Male" ? o += 1 : e.patDown === "Female" && (s += 1), l("Airport Code", e.airportCode), l("Schedule Type", e.schedType), l("Title", e.title), l("Patdown Req", e.patDown), l("Certification", e.certification), l("Public Comments (Cert Pool)", e.publicComments), l("Shift Time", e.shiftTime), l("RDOs", e.rdos), l("Hours/Day", K(e.hoursPerDay)), l("Hours/PP", K(e.hoursPerPP)), l("Days/Week", e.daysPerWeek), /^[A-Z]{3}$/.test(e.airportCode || "") || Q(n, "error", "airport", "Airport code must be 3 letters.", t), e.bidEventId ? e.bidEventId.length > 100 && Q(n, "error", "event", "Shift Bid Event ID is longer than 100 characters.", t) : Q(n, "error", "event", "Shift Bid Event ID is blank.", t), e.startDate || Q(n, "error", "start", "Schedule start date is blank.", t), e.endDate ? e.startDate && e.endDate < e.startDate && Q(n, "error", "end", "Schedule end date is before the start date.", t) : Q(n, "error", "end", "Schedule end date is blank.", t), e.bidLineId ? String(e.bidLineId).length > 8 ? Q(n, "error", "line-id", "Bid Line ID is longer than 8 characters.", t) : r[e.bidLineId] && Q(n, "error", "line-id", "Bid Line ID " + e.bidLineId + " is duplicated.", t) : Q(n, "error", "line-id", "Bid Line ID is blank.", t), e.bidLineId && (r[e.bidLineId] = !0), e.workgroup ? e.workgroup.length > 30 && Q(n, "error", "team", "Location/Workgroup is longer than 30 characters.", t) : Q(n, "warn", "team", "Location/Workgroup is blank.", t), [
			"Female",
			"Male",
			"None"
		].indexOf(e.patDown) < 0 && Q(n, "error", "patdown", "Patdown Req must be Female, Male, or None.", t), ge.indexOf(e.title) < 0 && Q(n, "error", "title", "Title " + e.title + " is not an eBid title.", t), [
			"PAX",
			"BAG",
			"DUAL"
		].indexOf(e.certification) < 0 && Q(n, "error", "cert", "Certification must be PAX, BAG, or DUAL.", t), e.schedType !== "FT" && e.schedType !== "PT" && Q(n, "error", "sched", "Schedule type must be FT or PT.", t), e.shiftTime !== "RDO" && !V.test(e.shiftTime || "") && Q(n, "error", "shift", "Shift time must be 9 or 19 military characters, or RDO.", t), String(e.privateComments || "").length > 255 && Q(n, "error", "private", "Private comments exceed 255 characters.", t), String(e.publicComments || "").length > 255 && Q(n, "error", "public", "Public comments exceed 255 characters.", t);
		let c = e.dayShiftTimes || [], u = e.dayShiftTypes || [];
		(c.length !== 14 || u.length !== 14) && Q(n, "error", "days", "Expected 14 day times and 14 day types.", t);
		for (let e = 0; e < 14; e++) {
			let r = c[e], i = u[e], a = "D" + String(e + 1).padStart(2, "0");
			r !== "RDO" && !V.test(r || "") && Q(n, "error", "day-time", a + " shift time is not RDO or a 9/19-character military span.", t), r === "RDO" && i ? Q(n, "error", "rdo-type", a + " is RDO but shift type is not blank.", t) : r !== "RDO" && !i ? Q(n, "error", "rdo-type", a + " is a work day but shift type is blank.", t) : i && ve.indexOf(i) < 0 && Q(n, "error", "day-type", a + " shift type " + i + " is not Airport, Training, or Admin/Avail.", t);
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
function $e(e) {
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
		let e = Y(t);
		!a.value && e.airportCode && (a.value = e.airportCode), !o.value && e.bidEventId && (o.value = e.bidEventId), !s.value && e.startDate && (s.value = e.startDate), !c.value && e.endDate && (c.value = e.endDate);
	}
	function ee() {
		let e = Y(t);
		a.value = e.airportCode || "", o.value = e.bidEventId || "", s.value = e.startDate || "", c.value = e.endDate || "", l.value = "Airport";
	}
	function E(e) {
		d.textContent = e || "";
	}
	function te() {
		p.textContent = "", pe.forEach((e) => p.appendChild($("th", null, e)));
	}
	function D(e) {
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
			q(e).forEach((n, r) => {
				let i = $("td", null, n == null ? "" : String(n));
				r >= 27 && r <= 40 && q(e)[r - 14] === "RDO" && !n && (i.className = "ebid-rdo-type"), t.appendChild(i);
			}), m.appendChild(t);
		});
	}
	function O() {
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
	function k(e) {
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
	function A() {
		y.dataset.ready !== "1" && (y.dataset.ready = "1", me.forEach((e) => {
			let t = $("tr");
			t.appendChild($("td", null, String(e.id))), t.appendChild($("td", null, e.header)), t.appendChild($("td", null, e.values)), t.appendChild($("td", null, e.desc)), y.appendChild(t);
		}));
	}
	function j(e, n) {
		S = e || [], u.textContent = n || x.label;
		let r = Qe(S);
		D(O()), k(r);
		let i = t.state && Array.isArray(t.state.lines) ? t.state.lines.length : 0;
		x.kind === "live" && E(S.length ? S.length + " line(s) from this session." : "Session has " + i + " line(s).");
	}
	function M() {
		x.kind === "live" && (T(), j(Ge(t, w()), "LIVE LINES"));
	}
	function N(e) {
		[
			"lines",
			"qa",
			"info"
		].forEach((t) => {
			let n = r.querySelector("#ebid-tab-" + t), i = r.querySelector("[data-ebid-tab=\"" + t + "\"]");
			n && (n.hidden = t !== e), i && i.classList.toggle("active", t === e);
		}), e === "info" && A();
	}
	function P(e) {
		r.hidden = e !== "ebid", i.hidden = e !== "miles", n.querySelectorAll("[data-bp-view]").forEach((t) => {
			t.classList.toggle("active", t.getAttribute("data-bp-view") === e);
		}), e === "ebid" && M();
	}
	if (te(), A(), N("lines"), P("ebid"), M(), r.querySelector("#ebid-apply").addEventListener("click", () => {
		if (x.kind === "csv") {
			let e = Ze(x.text, w());
			if (e.error) {
				E(e.error);
				return;
			}
			j(e.rows, x.label), E(e.rows.length + " line(s) from the imported CSV.");
			return;
		}
		if (x.kind === "json") {
			let e = Z(x.data, w());
			if (e.error) {
				E(e.error);
				return;
			}
			j(e.rows, x.label), E(e.rows.length + " line(s) from the imported JSON.");
			return;
		}
		M();
	}), r.querySelector("#ebid-live").addEventListener("click", () => {
		x = {
			kind: "live",
			label: "LIVE LINES"
		}, ee(), M(), E("Using the lines in this session.");
	}), r.querySelector("#ebid-export").addEventListener("click", () => {
		if (!S.length) {
			E("Nothing to export. Generate lines or import a fallback file.");
			return;
		}
		let e = Qe(S), t = Ke(S), n = new Blob([t], { type: "text/csv;charset=utf-8;" }), r = URL.createObjectURL(n), i = document.createElement("a"), a = (o.value.trim() || "eBid") + "_45Col_Import.csv";
		i.href = r, i.download = a, document.body.appendChild(i), i.click(), document.body.removeChild(i), URL.revokeObjectURL(r), E("Exported " + S.length + " line(s), 45 columns A–AS." + (e.errors ? " QA still has " + e.errors + " error(s)." : ""));
	}), r.querySelector("#ebid-import").addEventListener("click", () => b.click()), b.addEventListener("change", () => {
		let e = b.files && b.files[0];
		if (b.value = "", !e) return;
		let t = new FileReader();
		t.onload = () => {
			let n = String(t.result || ""), r = e.name.toLowerCase();
			if (r.endsWith(".json") || /^\s*[{[]/.test(n)) try {
				let t = JSON.parse(n), i = Z(t, w());
				if (!i.error) {
					x = {
						kind: "json",
						label: "JSON IMPORT",
						data: t
					}, T(), t.config && t.config.startDate && !s.value && (s.value = String(t.config.startDate).slice(0, 10)), j(Z(t, w()).rows, "JSON IMPORT"), E("Fallback import " + e.name + " · " + S.length + " line(s). Live lines are unchanged.");
					return;
				}
				if (r.endsWith(".json")) {
					E(i.error);
					return;
				}
			} catch {
				if (r.endsWith(".json")) {
					E("Could not read that JSON.");
					return;
				}
			}
			let i = Ze(n, w());
			if (i.error) {
				E(i.error);
				return;
			}
			x = {
				kind: "csv",
				label: "CSV IMPORT",
				text: n
			}, j(i.rows, "CSV IMPORT"), E("Fallback import " + e.name + " · " + S.length + " line(s). Live lines are unchanged.");
		}, t.readAsText(e);
	}), h.addEventListener("input", () => {
		C = h.value || "", D(O());
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
function et(e) {
	let t = e || window.Scheduler;
	$e(t), fe(t);
}
//#endregion
export { et as default, et as initBidPlanner };
