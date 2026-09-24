/** Tab switch + renderAll kick. Blade chrome. */
export function attachChrome(S) {
  if (!S) return;
  S.renderIssues = function () {
    var el = document.getElementById("issues");
    if (!el) return;
    var issues = (S.state && S.state.issues) || [];
    if (!issues.length) {
      el.innerHTML = "<div class=\"alert alert-ok\">Ready.<\/div>";
      return;
    }
    el.innerHTML = issues.map(function (m) {
      return "<div class=\"alert alert-warn\">" + m + "<\/div>";
    }).join("");
  };
  S.renderAll = function () {
    if (S.renderCoverageBars) S.renderCoverageBars();
    if (S.renderShiftSummary) S.renderShiftSummary();
    if (S.renderLines) S.renderLines();
    S.renderIssues();
    if (S.refreshConsoleChrome) S.refreshConsoleChrome();
  };
  S.switchTab = function (name) {
    document.querySelectorAll("#blade-tabs .tab-btn").forEach(function (b) {
      b.classList.toggle("active", b.dataset.tab === name);
    });
    document.querySelectorAll("#blade-panels > .panel").forEach(function (p) {
      p.classList.toggle("active", p.id === "tab-" + name);
    });
    if (name === "teams" && S.renderTeams) S.renderTeams();
    if (name === "lines" && S.renderLines) S.renderLines();
    if (name === "coverage" && S.renderCoverageBars) S.renderCoverageBars();
    if (name === "reports") {
      var sub = S.reportSubTab;
      if (!sub && S.reportSubTabs && S.reportSubTabs[0]) sub = S.reportSubTabs[0].id;
      if (S.switchReportSub && sub) S.switchReportSub(sub);
      else if (S.renderReports) S.renderReports();
    }
    if (name === "capacity" && S.renderCapacity) S.renderCapacity();
    window.dispatchEvent(new CustomEvent("lines:request-render", { detail: { source: "tab-switch" } }));
  };
}

export function initSharedChrome(scheduler) {
  var S = scheduler || window.Scheduler;
  attachChrome(S);
  if (S.initReports) S.initReports();
  if (S.initCapacity) S.initCapacity();
  if (S.bindLinesUI) S.bindLinesUI();
  S.__USE_SVELTE_LINES = true;
}
