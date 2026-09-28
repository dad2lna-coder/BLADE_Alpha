import { attachDeviation } from "./deviation.js";
import { attachGenderBalance } from "./gender-balance.js";
import { attachCohesion } from "./cohesion.js";

export function initReportsMath(S) {
  S = S || window.Scheduler;
  if (!S) return;

  S.reportsView = S.reportsView || {
    which: "passenger", // passenger | baggage | total | dfoPool
    skewThreshold: 5,
    phaseThresholdMin: 30
  };

  attachDeviation(S);
  attachGenderBalance(S);
  attachCohesion(S);

  S.renderReports = function () {
    var which = S.reportsView.which || "passenger";
    var map = {
      passenger: ["report-main", "passenger", "Passenger coverage"],
      baggage: ["report-main", "baggage", "Baggage coverage"],
      total: ["report-main", "total", "Total coverage (everybody)"],
      dfoPool: ["report-main", "dfoPool", "DFO pool"]
    };
    var cfg = map[which] || map.passenger;
    var banner = typeof document !== "undefined" ? document.getElementById("report-duty-banner") : null;
    if (banner) {
      var hasLines = !!(S.state && S.state.lines && S.state.lines.length);
      var dutiesAssigned = S.rotationHasAssignedDuties ? S.rotationHasAssignedDuties() : false;
      if (hasLines && !dutiesAssigned) {
        banner.hidden = false;
        banner.textContent = "Function duties not assigned — Baggage will be empty until Generate assigns BAG/PAX.";
      } else {
        banner.hidden = true;
        banner.textContent = "";
      }
    }
    S.renderDeviationReport(cfg[0], cfg[1], cfg[2]);
    S.renderGenderBalanceReports();
    S.renderTeamCohesionReport();
  };

  S.initReports = function () {
    if (S._reportsBound) return;
    S._reportsBound = true;
    document.addEventListener("change", function (e) {
      var t = e.target;
      if (!t) return;
      if (t.name === "report-which") {
        S.reportsView.which = t.value;
        S.renderReports();
      }
      if (t.id === "report-skew-thr") {
        S.reportsView.skewThreshold = Math.max(1, +t.value || 5);
        S.renderReports();
      }
      if (t.id === "report-phase-thr") {
        S.reportsView.phaseThresholdMin = Math.max(0, +t.value || 30);
        S.renderReports();
      }
    });
  };
}
