/** Reports host — nested Management / Demand / Cohesion sub-tabs. */
import { initReportsPrint } from "./print.js";

function paintReportSub(S, id) {
  if (id === "management" && S.renderReports) S.renderReports();
  if (id === "cohesion" && S.renderTeamCohesionReport) S.renderTeamCohesionReport();
  if (id === "demand" && S.renderDemandCapacity) S.renderDemandCapacity();
}

export function switchReportSub(scheduler, id) {
  var S = scheduler || window.Scheduler;
  if (!S || !id) return;
  S.reportSubTab = id;
  document.querySelectorAll("#report-subtabs .report-sub-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.subtab === id);
  });
  document.querySelectorAll("#report-sub-panels .report-sub-panel").forEach(function (p) {
    p.classList.toggle("active", p.id === "report-sub-" + id);
  });
  paintReportSub(S, id);
}

export function initReportsShell(scheduler) {
  var S = scheduler || window.Scheduler;
  if (!S) return;
  if (S.initReports) S.initReports();

  S.switchReportSub = function (id) {
    switchReportSub(S, id);
  };

  if (!S._reportSubClicksBound) {
    S._reportSubClicksBound = true;
    document.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest ? e.target.closest(".report-sub-btn") : null;
      if (!btn || !btn.dataset.subtab) return;
      S.switchReportSub(btn.dataset.subtab);
    });
  }

  var current = S.reportSubTab;
  if (!current && S.reportSubTabs && S.reportSubTabs.length) current = S.reportSubTabs[0].id;
  if (current) S.switchReportSub(current);
  initReportsPrint(S);
}
