/** Consolidated Teams Module for BLADE Alpha Build - FINAL CORRECTED */

window.Scheduler = window.Scheduler || {};

(function (S) {
  "use strict";
  S.$ = S.$ || function (id) { return document.getElementById(id); };
  function sexOf(p) { return p && p.sex === "F" ? "F" : "M"; }
  var ROLES = ["TSO", "LTSO", "STSO"];
  var teamSeq = 1;
  S.teams = S.teams || { teams: [], pool: [], filters: { role: "ALL", start: "", rdo: "" }, selected: {}, sortables: [], followMe: false, buildOpen: false };
  if (!S.teams.sortables) S.teams.sortables = [];
  if (typeof S.teams.followMe !== "boolean") S.teams.followMe = false;
  if (typeof S.teams.buildOpen !== "boolean") S.teams.buildOpen = false;
  function roleOf(line) { if (line.isStso) return "STSO"; if (line.isLtso) return "LTSO"; return "TSO"; }
  function rdoKey(line) { return (line.rdoDays || []).slice().sort(function (a, b) { return a - b; }).join(","); }
  function rdoLabel(line) { var days = S.DAYS || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; var k = rdoKey(line); if (!k) return "—"; return k.split(",").map(function (i) { return days[+i] || i; }).join(","); }
  function startOf(line) { var sh = S.getShift ? S.getShift(line.shiftId) : null; return sh ? S.timeToMin(sh.start) : 0; }
  function startLabel(line) { var sh = S.getShift ? S.getShift(line.shiftId) : null; return sh ? sh.start : "—"; }
  S.teamRoleOf = roleOf; S.teamRdoKey = rdoKey; S.teamRdoLabel = rdoLabel; S.teamStartOf = startOf; S.teamStartLabel = startLabel;
