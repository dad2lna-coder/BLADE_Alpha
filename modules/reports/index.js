/** Reports shell — tab host only. Nested report sub-tabs are NAV-2. */
export function initReportsShell(scheduler) {
  var S = scheduler || window.Scheduler;
  if (S && typeof S.initReports === "function") S.initReports();
}
