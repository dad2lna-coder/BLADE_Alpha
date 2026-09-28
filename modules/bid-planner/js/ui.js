/**
 * Bid Planner UI Controller
 * Scoped strictly inside #tab-bid-planner.
 */

import {
  getWorkingRules,
  saveWorkingRules,
  resetRulesToDefault,
  getWorkingCalendar,
  saveWorkingCalendar,
  resetCalendarToDefault,
  findRuleSet,
  validateRulesSchema,
  validateCalendarSchema
} from "./rules.js";
import { generateSchedule } from "./scheduler.js";
import { detectConflicts } from "./conflicts.js";
import { validateMoveEvent, validateAnchors } from "./validation.js";
import {
  exportScheduleCsv,
  exportScheduleJson,
  parseCalendarImport
} from "./importExport.js";

let activeSchedule = [];
let activeCalendarEvents = [];
let pendingMoveValidation = null;

export function bindBidPlannerUI(scheduler) {
  const root = document.getElementById("tab-bid-planner");
  if (!root) return;

  // Form Elements
  const elBidType = root.querySelector("#bp-bid-type");
  const elRuleSet = root.querySelector("#bp-rule-set");
  const elAnnouncementDate = root.querySelector("#bp-announcement-date");
  const elExecutionDate = root.querySelector("#bp-execution-date");
  const elAdjStrategy = root.querySelector("#bp-adj-strategy");

  // Action Buttons
  const btnGenerate = root.querySelector("#bp-btn-generate");
  const btnClear = root.querySelector("#bp-btn-clear");
  const btnImportCal = root.querySelector("#bp-btn-import-cal");
  const fileImportCal = root.querySelector("#bp-file-import-cal");
  const btnExportCsv = root.querySelector("#bp-btn-export-csv");
  const btnExportJson = root.querySelector("#bp-btn-export-json");

  // Status & Display
  const statusBanner = root.querySelector("#bp-status-banner");
  const conflictSection = root.querySelector("#bp-conflict-section");
  const conflictList = root.querySelector("#bp-conflict-list");
  const rowCountChip = root.querySelector("#bp-row-count");
  const scheduleTbody = root.querySelector("#bp-schedule-tbody");

  // Move Section Elements
  const moveSection = root.querySelector("#bp-move-section");
  const moveActionSelect = root.querySelector("#bp-move-action-select");
  const moveNewDate = root.querySelector("#bp-move-new-date");
  const btnValidateMove = root.querySelector("#bp-btn-validate-move");
  const moveConsequences = root.querySelector("#bp-move-consequences");
  const btnConfirmMove = root.querySelector("#bp-btn-confirm-move");
  const btnCancelMove = root.querySelector("#bp-btn-cancel-move");

  // Config Editor Elements
  const tabBtnRules = root.querySelector("#bp-tab-btn-rules");
  const tabBtnCalendar = root.querySelector("#bp-tab-btn-calendar");
  const panelRules = root.querySelector("#bp-panel-rules-json");
  const panelCalendar = root.querySelector("#bp-panel-calendar-json");
  const jsonRulesText = root.querySelector("#bp-json-rules");
  const jsonCalendarText = root.querySelector("#bp-json-calendar");

  const btnApplyRules = root.querySelector("#bp-btn-apply-rules");
  const btnResetRules = root.querySelector("#bp-btn-reset-rules");
  const btnDownloadRules = root.querySelector("#bp-btn-download-rules");
  const btnUploadRules = root.querySelector("#bp-btn-upload-rules");
  const fileUploadRules = root.querySelector("#bp-file-upload-rules");

  const btnApplyCalendar = root.querySelector("#bp-btn-apply-calendar");
  const btnResetCalendar = root.querySelector("#bp-btn-reset-calendar");
  const btnDownloadCalendar = root.querySelector("#bp-btn-download-calendar");
  const btnUploadCalendar = root.querySelector("#bp-btn-upload-calendar");
  const fileUploadCalendar = root.querySelector("#bp-file-upload-calendar");

  // Initialize Select Dropdowns
  function refreshSelects() {
    const rules = getWorkingRules();
    if (!elBidType) return;
    elBidType.innerHTML = "";
    (rules.bidTypes || []).forEach((bt) => {
      const opt = document.createElement("option");
      opt.value = bt.id;
      opt.textContent = bt.name;
      elBidType.appendChild(opt);
    });

    populateRuleSets();
  }

  function populateRuleSets() {
    if (!elBidType || !elRuleSet) return;
    const rules = getWorkingRules();
    const selectedBtId = elBidType.value;
    const bt = (rules.bidTypes || []).find((b) => b.id === selectedBtId);

    elRuleSet.innerHTML = "";
    if (bt && Array.isArray(bt.ruleSets)) {
      bt.ruleSets.forEach((rs) => {
        const opt = document.createElement("option");
        opt.value = rs.id;
        opt.textContent = rs.name;
        elRuleSet.appendChild(opt);
      });
    }
  }

  function syncConfigTextareas() {
    if (jsonRulesText) jsonRulesText.value = JSON.stringify(getWorkingRules(), null, 2);
    if (jsonCalendarText) jsonCalendarText.value = JSON.stringify(getWorkingCalendar(), null, 2);
  }

  if (elBidType) {
    elBidType.addEventListener("change", populateRuleSets);
  }

  // Generate Schedule Handler
  function handleGenerateSchedule() {
    const rules = getWorkingRules();
    const calendar = getWorkingCalendar();
    const bidTypeId = elBidType.value;
    const ruleSetId = elRuleSet.value;
    const announcementDate = elAnnouncementDate ? elAnnouncementDate.value : "";
    const executionDate = elExecutionDate ? elExecutionDate.value : "";
    const strategy = elAdjStrategy ? elAdjStrategy.value : "previous";

    const anchorVal = validateAnchors(announcementDate, executionDate);
    if (!anchorVal.valid) {
      showStatusBanner("conflict", anchorVal.error);
      return;
    }

    const ruleSet = findRuleSet(rules, bidTypeId, ruleSetId);
    if (!ruleSet) {
      showStatusBanner("conflict", "Selected Rule Set not found in configuration.");
      return;
    }

    const res = generateSchedule(ruleSet, announcementDate, executionDate, calendar, strategy);
    if (res.status !== "SUCCESS") {
      showStatusBanner("conflict", res.message);
      return;
    }

    // Conflict detection pass
    const conflictRes = detectConflicts(res.schedule, activeCalendarEvents, calendar);
    activeSchedule = conflictRes.schedule;

    renderScheduleTable(activeSchedule);
    renderConflicts(conflictRes.conflicts);

    if (conflictRes.conflictCount > 0) {
      showStatusBanner("conflict", `Schedule generated with ${conflictRes.conflictCount} calendar conflict(s). Review conflict panel below.`);
    } else if (res.overallStatus === "DATE CONFLICT") {
      showStatusBanner("conflict", res.message);
    } else {
      showStatusBanner("consistent", res.message);
    }

    if (btnExportCsv) btnExportCsv.disabled = false;
    if (btnExportJson) btnExportJson.disabled = false;
    populateMoveSelect();
  }

  if (btnGenerate) {
    btnGenerate.addEventListener("click", handleGenerateSchedule);
  }

  if (btnClear) {
    btnClear.addEventListener("click", () => {
      if (elAnnouncementDate) elAnnouncementDate.value = "";
      if (elExecutionDate) elExecutionDate.value = "";
      activeSchedule = [];
      renderScheduleTable([]);
      if (statusBanner) statusBanner.style.display = "none";
      if (conflictSection) conflictSection.style.display = "none";
      if (btnExportCsv) btnExportCsv.disabled = true;
      if (btnExportJson) btnExportJson.disabled = true;
    });
  }

  // Render Table
  function renderScheduleTable(schedule) {
    if (!scheduleTbody) return;
    scheduleTbody.innerHTML = "";

    if (!Array.isArray(schedule) || schedule.length === 0) {
      scheduleTbody.innerHTML = `<tr><td colspan="11" class="bp-empty-msg">No schedule generated yet. Enter anchor date(s) above and click "Generate Schedule".</td></tr>`;
      if (rowCountChip) rowCountChip.textContent = "0 Actions";
      return;
    }

    if (rowCountChip) rowCountChip.textContent = `${schedule.length} Actions`;

    schedule.forEach((r) => {
      const tr = document.createElement("tr");

      const statusClass = (r.status || "VALID").toLowerCase();
      const statusTag = `<span class="bp-status-tag ${statusClass}">${r.status}</span>`;
      const adjustedTag = r.adjusted ? `<span style="color:#d97706;font-weight:bold;">Yes</span>` : "No";

      tr.innerHTML = `
        <td>${r.sequence}</td>
        <td><strong>${escapeHtml(r.action)}</strong></td>
        <td><code style="font-weight:bold;color:#2563eb;">${escapeHtml(r.requiredDate)}</code></td>
        <td>${escapeHtml(r.calculatedFrom)}</td>
        <td>${escapeHtml(r.rule)}</td>
        <td>${escapeHtml(r.direction)}</td>
        <td>${adjustedTag}</td>
        <td style="font-size:0.8rem;">${escapeHtml(r.adjustmentReason)}</td>
        <td style="color:${r.conflict && r.conflict !== 'None' ? '#dc2626' : 'inherit'};">${escapeHtml(r.conflict || 'None')}</td>
        <td>${statusTag}</td>
        <td style="font-size:0.8rem;">${escapeHtml(r.notes || '')}</td>
      `;

      scheduleTbody.appendChild(tr);
    });
  }

  // Render Conflicts Section
  function renderConflicts(conflicts) {
    if (!conflictSection || !conflictList) return;
    conflictList.innerHTML = "";

    if (!Array.isArray(conflicts) || conflicts.length === 0) {
      conflictSection.style.display = "none";
      return;
    }

    conflictSection.style.display = "block";

    conflicts.forEach((c) => {
      const item = document.createElement("div");
      item.className = "bp-conflict-item";

      const conflictMsgs = c.conflicts.map((x) => x.message).join("<br>");

      item.innerHTML = `
        <div class="bp-conflict-desc">
          <strong>Seq ${c.sequence} - ${escapeHtml(c.action)}</strong> (Required Date: <code>${c.requiredDate}</code>)<br>
          ${conflictMsgs}
        </div>
        <div class="bp-button-bar">
          <button type="button" class="btn btn-sm" data-action="keep-date" data-seq="${c.sequence}">Keep Required Date</button>
          <button type="button" class="btn btn-sm btn-cyan" data-action="move-event" data-seq="${c.sequence}">Move Required Event</button>
          <button type="button" class="btn btn-sm" data-action="keep-existing" data-seq="${c.sequence}">Keep Existing Event</button>
          <button type="button" class="btn btn-sm" data-action="resolve-manual" data-seq="${c.sequence}">Resolve Manually</button>
        </div>
      `;

      conflictList.appendChild(item);
    });

    // Bind Conflict Action Buttons
    conflictList.querySelectorAll("button[data-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const actionType = e.target.dataset.action;
        const seq = Number(e.target.dataset.seq);
        handleConflictResolution(actionType, seq);
      });
    });
  }

  function handleConflictResolution(actionType, seq) {
    const rowIdx = activeSchedule.findIndex((r) => r.sequence === seq);
    if (rowIdx === -1) return;
    const row = activeSchedule[rowIdx];

    if (actionType === "keep-date") {
      row.status = "VALID (USER KEPT)";
      row.conflict = "User explicitly kept date despite conflict";
      reEvaluateActiveSchedule();
    } else if (actionType === "move-event") {
      if (moveSection) moveSection.style.display = "block";
      if (moveActionSelect) moveActionSelect.value = row.actionId;
      if (moveNewDate) moveNewDate.value = row.requiredDate;
      if (moveConsequences) moveConsequences.style.display = "none";
      if (btnConfirmMove) btnConfirmMove.style.display = "none";
    } else if (actionType === "keep-existing") {
      row.status = "DEFERRED";
      row.notes = "Bid event deferred in favor of existing calendar event";
      row.conflict = "Deferred";
      reEvaluateActiveSchedule();
    } else if (actionType === "resolve-manual") {
      const note = prompt("Enter resolution notes:", "Manually resolved");
      if (note !== null) {
        row.status = "RESOLVED";
        row.notes = note;
        row.conflict = "Resolved manually";
        reEvaluateActiveSchedule();
      }
    }
  }

  function reEvaluateActiveSchedule() {
    const calendar = getWorkingCalendar();
    const conflictRes = detectConflicts(activeSchedule, activeCalendarEvents, calendar);
    activeSchedule = conflictRes.schedule;
    renderScheduleTable(activeSchedule);
    renderConflicts(conflictRes.conflicts);
  }

  // Populate Move Event Dropdown
  function populateMoveSelect() {
    if (!moveActionSelect) return;
    moveActionSelect.innerHTML = "";
    activeSchedule.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r.actionId;
      opt.textContent = `Seq ${r.sequence}: ${r.action} (${r.requiredDate})`;
      moveActionSelect.appendChild(opt);
    });
  }

  // Validate Move Event Handler
  if (btnValidateMove) {
    btnValidateMove.addEventListener("click", () => {
      const actionId = moveActionSelect ? moveActionSelect.value : "";
      const newDate = moveNewDate ? moveNewDate.value : "";
      const calendar = getWorkingCalendar();
      const rules = getWorkingRules();
      const ruleSet = findRuleSet(rules, elBidType.value, elRuleSet.value);

      const val = validateMoveEvent(activeSchedule, actionId, newDate, ruleSet, calendar);
      pendingMoveValidation = val;

      if (moveConsequences) {
        moveConsequences.style.display = "block";
        moveConsequences.textContent = val.consequences.join("\n");
        if (val.valid) {
          moveConsequences.style.background = "#f0fdf4";
          moveConsequences.style.borderColor = "#86efac";
          moveConsequences.style.color = "#166534";
        } else {
          moveConsequences.style.background = "#fef2f2";
          moveConsequences.style.borderColor = "#fca5a5";
          moveConsequences.style.color = "#991b1b";
        }
      }

      if (btnConfirmMove) {
        btnConfirmMove.style.display = "inline-block";
      }
    });
  }

  if (btnConfirmMove) {
    btnConfirmMove.addEventListener("click", () => {
      if (!pendingMoveValidation) return;
      const { actionId, newDate } = pendingMoveValidation;
      const row = activeSchedule.find((r) => r.actionId === actionId);
      if (row) {
        row.requiredDate = newDate;
        row.adjusted = true;
        row.adjustmentReason = `Manually moved by user to ${newDate}`;
        row.status = "MOVED";
        reEvaluateActiveSchedule();
      }
      if (moveSection) moveSection.style.display = "none";
      pendingMoveValidation = null;
    });
  }

  if (btnCancelMove) {
    btnCancelMove.addEventListener("click", () => {
      if (moveSection) moveSection.style.display = "none";
      pendingMoveValidation = null;
    });
  }

  // Calendar Import Handler
  if (btnImportCal && fileImportCal) {
    btnImportCal.addEventListener("click", () => fileImportCal.click());
    fileImportCal.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        activeCalendarEvents = parseCalendarImport(text);
        showStatusBanner("info", `Imported ${activeCalendarEvents.length} external calendar event(s).`);
        if (activeSchedule.length > 0) {
          reEvaluateActiveSchedule();
        }
      };
      reader.readAsText(file);
      fileImportCal.value = "";
    });
  }

  // Export Schedule CSV/JSON
  if (btnExportCsv) {
    btnExportCsv.addEventListener("click", () => {
      const csvStr = exportScheduleCsv(activeSchedule);
      downloadFile(csvStr, "bid-planner-schedule.csv", "text/csv;charset=utf-8;");
    });
  }

  if (btnExportJson) {
    btnExportJson.addEventListener("click", () => {
      const jsonStr = exportScheduleJson(activeSchedule);
      downloadFile(jsonStr, "bid-planner-schedule.json", "application/json");
    });
  }

  // Config Editor Tabs & Actions
  if (tabBtnRules && tabBtnCalendar) {
    tabBtnRules.addEventListener("click", () => {
      tabBtnRules.classList.add("active");
      tabBtnCalendar.classList.remove("active");
      if (panelRules) panelRules.style.display = "flex";
      if (panelCalendar) panelCalendar.style.display = "none";
    });

    tabBtnCalendar.addEventListener("click", () => {
      tabBtnCalendar.classList.add("active");
      tabBtnRules.classList.remove("active");
      if (panelCalendar) panelCalendar.style.display = "flex";
      if (panelRules) panelRules.style.display = "none";
    });
  }

  if (btnApplyRules && jsonRulesText) {
    btnApplyRules.addEventListener("click", () => {
      try {
        const parsed = JSON.parse(jsonRulesText.value);
        saveWorkingRules(parsed);
        refreshSelects();
        showStatusBanner("consistent", "Rules JSON validated and saved to localStorage.");
      } catch (err) {
        showStatusBanner("conflict", `Rules JSON error: ${err.message}`);
      }
    });
  }

  if (btnResetRules) {
    btnResetRules.addEventListener("click", () => {
      const def = resetRulesToDefault();
      syncConfigTextareas();
      refreshSelects();
      showStatusBanner("info", "Reset Rules configuration to bundled defaults.");
    });
  }

  if (btnDownloadRules) {
    btnDownloadRules.addEventListener("click", () => {
      const text = jsonRulesText ? jsonRulesText.value : JSON.stringify(getWorkingRules(), null, 2);
      downloadFile(text, "bid-planner-rules.json", "application/json");
    });
  }

  if (btnUploadRules && fileUploadRules) {
    btnUploadRules.addEventListener("click", () => fileUploadRules.click());
    fileUploadRules.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          const val = validateRulesSchema(parsed);
          if (!val.valid) throw new Error(val.error);
          saveWorkingRules(parsed);
          syncConfigTextareas();
          refreshSelects();
          showStatusBanner("consistent", "Uploaded rules JSON validated and saved.");
        } catch (err) {
          showStatusBanner("conflict", `Upload error: ${err.message}`);
        }
      };
      reader.readAsText(file);
      fileUploadRules.value = "";
    });
  }

  if (btnApplyCalendar && jsonCalendarText) {
    btnApplyCalendar.addEventListener("click", () => {
      try {
        const parsed = JSON.parse(jsonCalendarText.value);
        saveWorkingCalendar(parsed);
        showStatusBanner("consistent", "Calendar JSON validated and saved to localStorage.");
      } catch (err) {
        showStatusBanner("conflict", `Calendar JSON error: ${err.message}`);
      }
    });
  }

  if (btnResetCalendar) {
    btnResetCalendar.addEventListener("click", () => {
      resetCalendarToDefault();
      syncConfigTextareas();
      showStatusBanner("info", "Reset Calendar configuration to bundled defaults.");
    });
  }

  if (btnDownloadCalendar) {
    btnDownloadCalendar.addEventListener("click", () => {
      const text = jsonCalendarText ? jsonCalendarText.value : JSON.stringify(getWorkingCalendar(), null, 2);
      downloadFile(text, "bid-planner-calendar.json", "application/json");
    });
  }

  if (btnUploadCalendar && fileUploadCalendar) {
    btnUploadCalendar.addEventListener("click", () => fileUploadCalendar.click());
    fileUploadCalendar.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          const val = validateCalendarSchema(parsed);
          if (!val.valid) throw new Error(val.error);
          saveWorkingCalendar(parsed);
          syncConfigTextareas();
          showStatusBanner("consistent", "Uploaded calendar JSON validated and saved.");
        } catch (err) {
          showStatusBanner("conflict", `Upload error: ${err.message}`);
        }
      };
      reader.readAsText(file);
      fileUploadCalendar.value = "";
    });
  }

  function showStatusBanner(type, message) {
    if (!statusBanner) return;
    statusBanner.style.display = "block";
    statusBanner.className = `bp-status-banner card ${type}`;
    statusBanner.textContent = message;
  }

  refreshSelects();
  syncConfigTextareas();
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
