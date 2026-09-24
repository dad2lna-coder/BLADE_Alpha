/** Reports print orchestration — window.print() + print CSS classes. */

var PRINT_ORDER = ["management", "demand", "cohesion"];
var PRINT_LABELS = {
  management: "Management Reports",
  demand: "Demand",
  cohesion: "Team Cohesion"
};

function $(id) {
  return document.getElementById(id);
}

function textOf(id) {
  var el = $(id);
  return el ? String(el.textContent || "").trim() : "";
}

function printDate() {
  var now = new Date();
  return now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function chromeBits() {
  return {
    airport: textOf("console-airport") || "\u2014",
    operator: textOf("console-operator") || "\u2014",
    date: printDate()
  };
}

function panelLabel(id) {
  var tabs = (window.Scheduler && window.Scheduler.reportSubTabs) || [];
  var i;
  for (i = 0; i < tabs.length; i++) {
    if (tabs[i].id === id) return tabs[i].label || PRINT_LABELS[id] || id;
  }
  return PRINT_LABELS[id] || id;
}

function ensureHeader(panel, reportName) {
  if (!panel) return;
  var bits = chromeBits();
  var el = panel.querySelector(":scope > .report-print-header");
  if (!el) {
    el = document.createElement("div");
    el.className = "report-print-header";
    el.setAttribute("aria-hidden", "true");
    panel.insertBefore(el, panel.firstChild);
  }
  el.textContent = bits.airport + " \u00b7 " + bits.operator + " \u00b7 " + reportName + " \u00b7 " + bits.date;
}

function fillReportBodies(S) {
  if (S.ensureReportsPrintContent) {
    S.ensureReportsPrintContent();
    return;
  }
  if (S.renderReports) S.renderReports();
  if (S.renderTeamCohesionReport) S.renderTeamCohesionReport();
  if (S.renderDemandCapacity) S.renderDemandCapacity();
}

function prepareDemand(S) {
  var panel = $("report-sub-demand");
  if (S.prepareDemandCapacityForPrint) {
    S.prepareDemandCapacityForPrint({ host: panel });
    return;
  }
  if (S.renderDemandCapacity) S.renderDemandCapacity();
}

function setPrintMode(mode) {
  var body = document.body;
  var tab = $("tab-reports");
  body.classList.remove("print-reports-current", "print-reports-all");
  if (mode === "all") body.classList.add("print-reports-all");
  else body.classList.add("print-reports-current");
  body.setAttribute("data-print", mode);
  if (tab) tab.setAttribute("data-print", mode);
}

function clearPrintMode() {
  var body = document.body;
  var tab = $("tab-reports");
  body.classList.remove("print-reports-current", "print-reports-all");
  body.removeAttribute("data-print");
  if (tab) tab.removeAttribute("data-print");
}

function restoreSub(S, previous) {
  document.querySelectorAll("#report-sub-panels .report-sub-panel").forEach(function (p) {
    p.classList.toggle("active", p.id === "report-sub-" + previous);
  });
  document.querySelectorAll("#report-subtabs .report-sub-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.subtab === previous);
  });
  if (S) S.reportSubTab = previous;
}

function runPrint(S, mode) {
  var previous = (S && S.reportSubTab) || "management";
  var prevTitle = document.title;
  var cleaned = false;
  var bits = chromeBits();

  fillReportBodies(S);
  prepareDemand(S);

  PRINT_ORDER.forEach(function (id) {
    ensureHeader($("report-sub-" + id), panelLabel(id));
  });

  if (mode === "all") {
    document.querySelectorAll("#report-sub-panels .report-sub-panel").forEach(function (p) {
      p.classList.add("active");
    });
    document.title = bits.airport + " Reports " + bits.date;
  } else {
    document.title = bits.airport + " " + panelLabel(previous) + " " + bits.date;
  }

  setPrintMode(mode);

  function cleanup() {
    if (cleaned) return;
    cleaned = true;
    window.removeEventListener("afterprint", cleanup);
    document.title = prevTitle;
    clearPrintMode();
    restoreSub(S, previous);
    if (S && S.switchReportSub) S.switchReportSub(previous);
  }

  window.addEventListener("afterprint", cleanup);
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      try {
        window.print();
      } finally {
        window.setTimeout(cleanup, 1500);
      }
    });
  });
}

function ensurePrintControls() {
  var tab = $("tab-reports");
  var nav = $("report-subtabs");
  if (!tab || !nav) return null;
  var existing = $("report-print-actions");
  if (existing) return existing;

  var bar = document.createElement("div");
  bar.id = "report-print-actions";
  bar.className = "report-print-actions";
  bar.innerHTML =
    '<button type="button" class="btn" id="btn-print-report-current">Print current</button>' +
    '<button type="button" class="btn btn-amber" id="btn-print-report-all">Print all reports</button>';
  if (nav.nextSibling) tab.insertBefore(bar, nav.nextSibling);
  else tab.appendChild(bar);
  return bar;
}

export function initReportsPrint(scheduler) {
  var S = scheduler || window.Scheduler;
  if (!S) return;
  ensurePrintControls();
  if (S._reportsPrintBound) return;
  S._reportsPrintBound = true;

  S.printCurrentReport = function () {
    runPrint(S, "current");
  };
  S.printAllReports = function () {
    runPrint(S, "all");
  };

  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target.closest("button") : null;
    if (!t) return;
    if (t.id === "btn-print-report-current") {
      e.preventDefault();
      S.printCurrentReport();
    } else if (t.id === "btn-print-report-all") {
      e.preventDefault();
      S.printAllReports();
    }
  });
}
