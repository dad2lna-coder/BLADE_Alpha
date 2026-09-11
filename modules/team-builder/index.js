/**
 * Team Builder — thin orchestrator.
 * Wires existing stores/components/actions. No new architecture.
 */
import * as store from "./stores/teamBuilderStore.js";
import { teams } from "./stores/teamBuilderStore.js";
import { autoFormTeams as runAutoForm } from "./utils/autoForm.js";
import { collectTeamPool } from "./utils/pool.js";
import { renderTeamBoards } from "./components/TeamBoards.js";
import { renderTeamPills } from "./components/TeamPills.js";
import { renderUnassignedPool, selectAllVisible } from "./components/UnassignedPool.js";
import { renderTeamStats } from "./components/TeamStats.js";
import { renderTeamFilters } from "./components/TeamFilters.js";
import { injectAutoFormControls } from "./components/AutoFormControls.js";
import { initSortables, syncTeamsFromDom } from "./actions/dnd.js";
import { applyFollowMe, toggleTeamPin, closeTeamUi } from "./actions/floatPanel.js";

function syncHint() {
  const hint = document.getElementById("team-count-hint");
  if (!hint) return;
  const n = (teams && teams.length) || 0;
  hint.textContent = n ? n + " team" + (n === 1 ? "" : "s") : "No teams yet";
}

function bridgeScheduler(S) {
  if (!S) return;
  S.teams = S.teams || {};
  S.teams.teams = teams; // SAME array reference as store
  if (typeof store.syncSchedulerBridge === "function") store.syncSchedulerBridge(S);
}

export function renderAll() {
  const S = window.Scheduler;
  collectTeamPool();
  renderTeamPills();
  renderUnassignedPool();
  renderTeamBoards();
  renderTeamStats();
  renderTeamFilters();
  syncHint();
  applyFollowMe();
  initSortables(function () {
    syncTeamsFromDom();
    bridgeScheduler(window.Scheduler);
    renderAll();
    if (window.Scheduler && typeof window.Scheduler.renderLines === "function") {
      window.Scheduler.renderLines();
    }
  });
}

function onAutoForm() {
  runAutoForm();
  const S = window.Scheduler;
  bridgeScheduler(S);
  renderAll();
  if (S && typeof S.renderLines === "function") S.renderLines();
}

function bindOnce(el, type, fn) {
  if (!el || el._tbBound) return;
  el._tbBound = true;
  el.addEventListener(type, fn);
}

function bindTeamUI() {
  bindOnce(document.getElementById("btn-team-auto-form"), "click", function (e) {
    e.preventDefault();
    onAutoForm();
  });

  bindOnce(document.getElementById("btn-team-build"), "click", function (e) {
    e.preventDefault();
    if (typeof store.setBuildOpen === "function") store.setBuildOpen(true);
    applyFollowMe(true);
  });

  bindOnce(document.getElementById("btn-build-close"), "click", function (e) {
    e.preventDefault();
    closeTeamUi();
    renderAll();
  });

  bindOnce(document.getElementById("btn-team-new-dock"), "click", function (e) {
    e.preventDefault();
    store.createTeam();
    renderAll();
  });

  const tab = document.getElementById("tab-teams");
  if (tab && !tab._tbClickBound) {
    tab._tbClickBound = true;
    tab.addEventListener("click", function (e) {
      const t = e.target;
      if (!t) return;

      if (t.id === "btn-team-clear-filters") {
        store.filters.role = "ALL";
        store.filters.start = "";
        store.filters.rdo = "";
        renderAll();
        return;
      }
      if (t.id === "btn-team-select-all") {
        selectAllVisible();
        renderAll();
        return;
      }
      if (t.id === "btn-team-clear-sel") {
        store.clearSelection();
        renderAll();
        return;
      }
      if (t.id === "btn-team-assign") {
        const sel = document.getElementById("team-assign-target");
        if (sel && sel.value) store.assignSelectedToTeam(sel.value);
        renderAll();
        const S = window.Scheduler;
        if (S && S.renderLines) S.renderLines();
        return;
      }

      const pin = t.getAttribute && t.getAttribute("data-pin-team");
      if (pin) {
        toggleTeamPin(pin);
        renderAll();
        return;
      }
      const rmTeam = t.getAttribute && t.getAttribute("data-remove-team");
      if (rmTeam) {
        store.removeTeam(rmTeam);
        renderAll();
        const S = window.Scheduler;
        if (S && S.renderLines) S.renderLines();
        return;
      }
      const follow = t.getAttribute && t.getAttribute("data-team-follow");
      if (follow && t.type === "checkbox") {
        const team = store.getTeamById(follow);
        if (team) team.followMe = !!t.checked;
        applyFollowMe();
        renderAll();
        return;
      }
      if (t.classList && t.classList.contains("team-line-check")) {
        const id = +(t.closest("[data-id]") && t.closest("[data-id]").getAttribute("data-id"));
        if (!isNaN(id)) store.selected[id] = !!t.checked;
        return;
      }
    });

    tab.addEventListener("change", function (e) {
      const t = e.target;
      if (!t) return;
      if (t.id === "team-filter-role") {
        store.filters.role = t.value || "ALL";
        renderAll();
      } else if (t.id === "team-filter-start") {
        store.filters.start = t.value || "";
        renderAll();
      } else if (t.id === "team-filter-rdo") {
        store.filters.rdo = t.value;
        renderAll();
      } else if (t.classList && t.classList.contains("team-name-input")) {
        store.renameTeam(t.getAttribute("data-team-id"), t.value);
        syncHint();
        const S = window.Scheduler;
        if (S && S.renderLines) S.renderLines();
      }
    });
  }
}

export function initTeamBuilder(scheduler) {
  const S = scheduler || window.Scheduler;
  S.teams = S.teams || {};
  S.teams.teams = teams; // never replace with a filtered copy
  if (typeof store.syncSchedulerBridge === "function") store.syncSchedulerBridge(S);

  S.createTeam = S.createTeam || function (name) {
    const t = store.createTeam(name);
    renderAll();
    return t;
  };
  S.renderTeams = renderAll;

  injectAutoFormControls();
  bindTeamUI();
  collectTeamPool();
  renderAll();
}

export { onAutoForm as autoFormTeams };
