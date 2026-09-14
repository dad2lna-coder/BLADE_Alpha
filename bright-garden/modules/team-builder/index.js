/**
 * Team Builder — thin orchestrator.
 * Wires existing stores/components/actions. No new architecture.
 */
import * as store from "./stores/teamBuilderStore.js";
import { teams } from "./stores/teamBuilderStore.js";
import { autoFormTeams as runAutoForm } from "./utils/autoForm.js";
import { collectTeamPool, unassignedPool, assignedIds } from "./utils/pool.js";
import { renderTeamBoards } from "./components/TeamBoards.js";
import { renderTeamPills } from "./components/TeamPills.js";
import { renderUnassignedPool, selectAllVisible } from "./components/UnassignedPool.js";
import { renderTeamStats } from "./components/TeamStats.js";
import { renderTeamFilters } from "./components/TeamFilters.js";
import { injectAutoFormControls } from "./components/AutoFormControls.js";
import { renderPinnedSummaries } from "./components/FollowMeDock.js";
import { initSortables, syncTeamsFromDom } from "./actions/dnd.js";
import { applyFollowMe, toggleTeamPin, closeTeamUi } from "./actions/floatPanel.js";

function ensureStyles() {
  if (document.getElementById("team-builder-css")) return;
  const link = document.createElement("link");
  link.id = "team-builder-css";
  link.rel = "stylesheet";
  link.href = "modules/team-builder/styles/team-builder.css";
  document.head.appendChild(link);
}

function syncHint() {
  const hint = document.getElementById("team-count-hint");
  if (!hint) return;
  const n = (teams && teams.length) || 0;
  const m = assignedIds().size;
  const k = unassignedPool().length;
  hint.textContent = n + " team" + (n === 1 ? "" : "s") + " · " + m + " assigned · " + k + " in pool (filtered)";
}

function bridgeScheduler(S) {
  if (!S) return;
  S.teams = S.teams || {};
  S.teams.teams = teams;
  if (typeof store.syncSchedulerBridge === "function") store.syncSchedulerBridge(S);
}

function afterMutate() {
  bridgeScheduler(window.Scheduler);
  renderAll();
  if (window.Scheduler && typeof window.Scheduler.renderLines === "function") {
    window.Scheduler.renderLines();
  }
}

export function renderAll() {
  collectTeamPool();
  renderTeamPills();
  renderUnassignedPool();
  renderTeamBoards();
  renderTeamStats();
  renderTeamFilters();
  syncHint();
  applyFollowMe();
  renderPinnedSummaries();
  initSortables(function () {
    syncTeamsFromDom();
    afterMutate();
  });
}

function onAutoForm() {
  runAutoForm();
  afterMutate();
}

function bindOnce(el, type, fn) {
  if (!el || el._tbBound) return;
  el._tbBound = true;
  el.addEventListener(type, fn);
}

function handleTeamClick(e) {
  const t = e.target;
  if (!t || typeof t.closest !== "function") return;

  if (t.id === "btn-team-clear-filters" || t.closest("#btn-team-clear-filters")) {
    store.filters.role = "ALL";
    store.filters.start = "";
    store.filters.rdo = "";
    renderAll();
    return;
  }
  if (t.id === "btn-team-select-all" || t.closest("#btn-team-select-all")) {
    selectAllVisible();
    renderAll();
    return;
  }
  if (t.id === "btn-team-clear-sel" || t.closest("#btn-team-clear-sel")) {
    store.clearSelection();
    renderAll();
    return;
  }
  if (t.id === "btn-team-assign" || t.closest("#btn-team-assign")) {
    const sel = document.getElementById("team-assign-target");
    if (sel && sel.value) store.assignSelectedToTeam(sel.value);
    afterMutate();
    return;
  }

  const pinEl = t.closest("[data-pin-team]");
  if (pinEl) {
    e.preventDefault();
    toggleTeamPin(pinEl.getAttribute("data-pin-team"));
    applyFollowMe(true);
    renderPinnedSummaries();
    renderAll();
    return;
  }

  const rmMem = t.closest("[data-remove-member]");
  if (rmMem) {
    store.removeMemberFromTeam(rmMem.getAttribute("data-from-team"), rmMem.getAttribute("data-remove-member"));
    afterMutate();
    return;
  }

  const rmTeam = t.closest("[data-remove-team]");
  if (rmTeam) {
    store.removeTeam(rmTeam.getAttribute("data-remove-team"));
    afterMutate();
    return;
  }

  const follow = t.closest("[data-team-follow]");
  if (follow && (t.type === "checkbox" || t.tagName === "INPUT")) {
    const team = store.getTeamById(follow.getAttribute("data-team-follow"));
    if (team) team.followMe = !!follow.checked || !!t.checked;
    applyFollowMe();
    renderPinnedSummaries();
    renderAll();
  }
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
    renderPinnedSummaries();
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

  if (!document._tbClickBound) {
    document._tbClickBound = true;
    document.addEventListener("click", handleTeamClick);
    document.addEventListener("change", function (e) {
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
        if (window.Scheduler && window.Scheduler.renderLines) window.Scheduler.renderLines();
      } else if (t.getAttribute && t.getAttribute("data-select-line")) {
        store.selected[+t.getAttribute("data-select-line")] = !!t.checked;
      }
    });
  }
}

export function initTeamBuilder(scheduler) {
  const S = scheduler || window.Scheduler;
  ensureStyles();
  S.teams = S.teams || {};
  S.teams.teams = teams;
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
