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
    // Keep non-extra members; only remove ids that are extras being rebuilt,
    // matching the trainingClasses pattern: keep unless id is an extra being rebuilt.
    teams.forEach(function (t) {
      if (t === team) return;
      t.members = (t.members || []).filter(function (m) {
        // Remove member if it's an extra being rebuilt (in the "want" set)
        // but keep it if it's a non-extra line (matching trainingClasses filter logic)
        var line = S && S.state && S.state.lines && S.state.lines.find(function (l) { return +l.id === +m; });
        if (line && (line.isExtra || line.extraPositionId)) {
          // This is an extra line — remove it only if it's an extra of a different type being rebuilt
          return !want.has(+m);
        }
        // Non-extra member: keep
        return true;
      });
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
