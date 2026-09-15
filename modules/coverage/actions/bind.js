/** Coverage filter listeners. Duplicate-safe. */

let bound = false;

export function bindCoverageUI(S) {
  if (bound) return;
  bound = true;

  function readRoles() {
    if (!S.coverageView) S.coverageView = { stso: false, ltso: false, tso: true, funcView: "all" };
    var stso = document.getElementById("cov-role-stso");
    var ltso = document.getElementById("cov-role-ltso");
    var tso = document.getElementById("cov-role-tso");
    S.coverageView.stso = !!(stso && stso.checked);
    S.coverageView.ltso = !!(ltso && ltso.checked);
    S.coverageView.tso = !!(tso && tso.checked);
    if (S.renderCoverageBars) S.renderCoverageBars();
  }

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (!t) return;
    if (t.id === "cov-role-stso" || t.id === "cov-role-ltso" || t.id === "cov-role-tso") {
      readRoles();
      return;
    }
    if (t.name === "cov-func-view") {
      if (!S.coverageView) S.coverageView = { stso: false, ltso: false, tso: true, funcView: "all" };
      S.coverageView.funcView = t.value || "all";
      if (S.renderCoverageBars) S.renderCoverageBars();
    }
  });
}
