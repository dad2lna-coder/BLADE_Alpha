import { teams, createTeam, pool } from "../stores/teamBuilderStore.js";
import { collectTeamPool } from "./pool.js";

export function extraTypeOf(lineOrPool) {
  if (!lineOrPool) return "";
  if (lineOrPool.extraName) return String(lineOrPool.extraName);
  if (lineOrPool.position && (lineOrPool.isExtra || lineOrPool.extraPositionId)) {
    return String(lineOrPool.position);
  }
  if (lineOrPool.empClass && lineOrPool.empClass !== "FT" && lineOrPool.empClass !== "PT" &&
      lineOrPool.empClass !== "TSO" && lineOrPool.empClass !== "LTSO" && lineOrPool.empClass !== "STSO") {
    if (lineOrPool.isExtra || lineOrPool.extraPositionId || lineOrPool.role && lineOrPool.role !== "TSO") {
      return String(lineOrPool.empClass);
    }
  }
  if (lineOrPool.isExtra || lineOrPool.extraPositionId) {
    return String(lineOrPool.empClass || lineOrPool.role || "EXTRA");
  }
  return "";
}

export function isExtraPerson(p) {
  return !!(p && (p.isExtra || p.extraPositionId));
}

export function formExtraTypeTeams() {
  const S = typeof window !== "undefined" ? window.Scheduler : null;
  collectTeamPool();
  const extras = pool.filter(function (p) { return isExtraPerson(p); });
  const byType = {};
  extras.forEach(function (p) {
    const key = extraTypeOf(p) || "EXTRA";
    if (!byType[key]) byType[key] = [];
    byType[key].push(p.id);
  });

  Object.keys(byType).forEach(function (typeName) {
    let team = teams.find(function (t) { return t.extraGroup === typeName || t.name === typeName; });
    if (!team) {
      team = createTeam(typeName);
      team.extraGroup = typeName;
      team.name = typeName;
    } else {
      team.extraGroup = typeName;
      team.name = typeName;
    }
    const want = new Set(byType[typeName].map(Number));
    teams.forEach(function (t) {
      if (t === team) return;
      t.members = (t.members || []).filter(function (m) { return !want.has(+m); });
    });
    team.members = byType[typeName].map(Number);
  });

  teams.forEach(function (t) {
    if (!t.extraGroup) return;
    if (!byType[t.extraGroup] || !byType[t.extraGroup].length) {
      t.members = [];
    }
  });

  if (S && S.teams) S.teams.teams = teams;
  return teams.filter(function (t) { return !!t.extraGroup; });
}
