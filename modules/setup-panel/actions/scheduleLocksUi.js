/** Schedule Locks modal. The component renders the dialog.
 *  Matching and storage stay on Scheduler.state.scheduleLocks.
 */

function classLabel(S, key) {
  if (!key || key === "ALL") return "All Classes";
  var classes = S.getAvailableClasses ? S.getAvailableClasses() : [];
  var match = classes.find(function (c) { return c.key === key; });
  return match ? match.label : key;
}

function shiftLabelText(S, shiftId) {
  if (!shiftId) return "Any Shift";
  var shifts = (S.state && S.state.shifts) || [];
  var s = shifts.find(function (x) { return x.id === shiftId; });
  if (!s) return "Shift " + shiftId + " (deleted)";
  var lbl = S.shiftLabel ? S.shiftLabel(s) : ((s.start || "") + "–" + (s.end || ""));
  return (s.name || s.id) + " (" + lbl + ")";
}

function sexLabel(sex) {
  if (!sex || sex === "ALL") return "All";
  return sex === "M" ? "Male (M)" : "Female (F)";
}

export function readLockForm(S) {
  var classes = [{ key: "ALL", label: "All Classes" }];
  var avail = S && S.getAvailableClasses ? S.getAvailableClasses() : [];
  avail.forEach(function (c) { classes.push({ key: c.key, label: c.label }); });
  var shifts = (S && S.state && S.state.shifts) || [];
  var shiftOptions = [{ id: "", label: "All Shifts" }];
  shifts.forEach(function (s) {
    var label = S.shiftLabel ? S.shiftLabel(s) : ((s.start || "") + "–" + (s.end || ""));
    shiftOptions.push({ id: s.id, label: (s.name || s.id) + " (" + label + ")" });
  });
  return { classes: classes, shifts: shiftOptions };
}

export function readLockRuleRows(S) {
  var rules = (S && S.state && S.state.scheduleLocks) || [];
  var lines = (S && S.state && S.state.lines) || [];
  return rules.map(function (rule) {
    var matching = lines.filter(function (line) {
      return S.lineMatchesLockRule ? S.lineMatchesLockRule(line, rule) : false;
    }).length;
    return {
      id: rule.id,
      classText: classLabel(S, rule.classKey),
      sexText: sexLabel(rule.sex),
      shiftText: shiftLabelText(S, rule.shiftId),
      matching: matching
    };
  });
}

export function pushLockRule(S, classKey, sex, shiftId) {
  if (!S.state) S.state = {};
  var rule = {
    id: "LOCK_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
    classKey: classKey || "ALL",
    sex: sex || "ALL",
    shiftId: shiftId ? shiftId : null
  };
  S.state.scheduleLocks = S.state.scheduleLocks || [];
  S.state.scheduleLocks.push(rule);
  return rule;
}

export function removeLockRule(S, ruleId) {
  if (!S || !S.state || !S.state.scheduleLocks) return;
  S.state.scheduleLocks = S.state.scheduleLocks.filter(function (rule) { return rule.id !== ruleId; });
}

export function clearLockRules(S) {
  if (S && S.state) S.state.scheduleLocks = [];
}

export function renderLockRulesList(S) {
  if (S && S.setupLocks && typeof S.setupLocks.refresh === "function") {
    S.setupLocks.refresh();
    return;
  }
  var container = typeof document !== "undefined" ? document.getElementById("lock-rules-list") : null;
  if (!container) return;
  var rows = readLockRuleRows(S);
  if (!rows.length) {
    container.textContent = "";
    var empty = document.createElement("p");
    empty.className = "muted";
    empty.style.margin = "0";
    empty.textContent = "No lock rules defined. All generated lines move freely.";
    container.appendChild(empty);
    return;
  }
  container.textContent = "";
  rows.forEach(function (row) {
    var wrap = document.createElement("div");
    wrap.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0.75rem;background:var(--bg-subtle,#f8f9fa);border:1px solid #ddd;border-radius:4px;gap:0.75rem";
    var text = document.createElement("div");
    text.style.cssText = "flex:1;font-size:0.88rem";
    text.textContent = "Class: " + row.classText + " · Gender: " + row.sexText + " · Shift: " + row.shiftText + " (" + row.matching + ")";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-sm btn-red btn-del-lock-rule";
    btn.setAttribute("data-rule-id", row.id);
    btn.textContent = "Remove";
    btn.addEventListener("click", function () {
      removeLockRule(S, row.id);
      renderLockRulesList(S);
    });
    wrap.appendChild(text);
    wrap.appendChild(btn);
    container.appendChild(wrap);
  });
}

export function addLockRule(S) {
  var classSelect = typeof document !== "undefined" ? document.getElementById("lock-rule-class") : null;
  var sexSelect = typeof document !== "undefined" ? document.getElementById("lock-rule-sex") : null;
  var shiftSelect = typeof document !== "undefined" ? document.getElementById("lock-rule-shift") : null;
  pushLockRule(
    S,
    classSelect ? classSelect.value : "ALL",
    sexSelect ? sexSelect.value : "ALL",
    shiftSelect && shiftSelect.value ? shiftSelect.value : null
  );
  renderLockRulesList(S);
}

export function openLockSchedulesModal(S) {
  if (S && S.setupLocks && typeof S.setupLocks.open === "function") {
    S.setupLocks.open();
    return;
  }
  var modal = typeof document !== "undefined" ? document.getElementById("lock-schedules-modal") : null;
  if (!modal) return;
  renderLockRulesList(S);
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

export function closeLockSchedulesModal() {
  var modal = typeof document !== "undefined" ? document.getElementById("lock-schedules-modal") : null;
  if (modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }
}

export function attachScheduleLocksUi(S) {
  if (!S) return;
  S.openLockSchedulesModal = function () { openLockSchedulesModal(S); };
  S.closeLockSchedulesModal = function () {
    if (S.setupLocks && typeof S.setupLocks.close === "function") S.setupLocks.close();
    else closeLockSchedulesModal();
  };
  S.renderLockRulesList = function () { renderLockRulesList(S); };
  S.addLockRule = function () { addLockRule(S); };

  if (typeof document === "undefined") return;

  function bindEvents() {
    var openBtn = document.getElementById("btn-lock-schedules");
    if (openBtn && !openBtn._lockedBound) {
      openBtn._lockedBound = true;
      openBtn.addEventListener("click", function () { S.openLockSchedulesModal(); });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindEvents);
  } else {
    bindEvents();
  }
}
