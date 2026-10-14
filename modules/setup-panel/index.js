/** Setup Panel — owns Setup-tab inputs, shifts table, extra positions, staffing export. */
import { ensureStyles } from "./utils/sync.js";
import { bridgeScheduler } from "./actions/bridge.js";
import { renderAll, bindSetupActions } from "./actions/render.js";
import { attachExtraPositions } from "./utils/extraPositions.js";
import { attachTrainingClasses } from "./utils/trainingClasses.js";
import { mount } from "svelte";
import PeriodForm from "../../src/lib/components/PeriodForm.svelte";
import FteForm from "../../src/lib/components/FteForm.svelte";
import ShiftsTable from "../../src/lib/components/ShiftsTable.svelte";
import GenerateModal from "../../src/lib/components/GenerateModal.svelte";

let _boundDomContentLoaded = false;

function mountSetupUi(S) {
  const period = document.getElementById("setup-period-root");
  const fte = document.getElementById("setup-fte-root");
  const shifts = document.getElementById("shifts-tbody");
  if (!S.setupForm) S.setupForm = {};
  if (period && !period.dataset.setupMounted) {
    period.dataset.setupMounted = "1";
    const api = mount(PeriodForm, { target: period });
    S.setupForm.pullPeriod = function () { api.pullPeriod(); };
  }
  if (fte && !fte.dataset.setupMounted) {
    fte.dataset.setupMounted = "1";
    const api = mount(FteForm, { target: fte });
    S.setupForm.pullFte = function () { api.pullFte(); };
  }
  if (shifts && !S.setupShifts) {
    S.setupShifts = mount(ShiftsTable, { target: shifts });
  }
  const generate = document.getElementById("generate-modal-root");
  if (generate && !generate.dataset.setupMounted) {
    generate.dataset.setupMounted = "1";
    S.setupGenerate = mount(GenerateModal, { target: generate });
  }
}

function seedStartDate(S) {
  if (!S.state) S.state = {};
  if (!S.state.startDate && S.parseStartDate) S.state.startDate = S.parseStartDate(null);
  if (S.setupForm && typeof S.setupForm.pullPeriod === "function") {
    S.setupForm.pullPeriod();
    return;
  }
  var el = document.getElementById("cfg-start");
  if (!el || el.value || !S.toDateInputValue) return;
  el.value = S.toDateInputValue(S.state.startDate);
}

export function initSetupPanel(scheduler) {
  const S = scheduler || window.Scheduler;
  ensureStyles();
  try {
    bridgeScheduler(S);
  } catch (err) {
    console.error("initSetupPanel", err);
    if (S && S.updateStatus) S.updateStatus("Setup generate failed to attach — check console.");
    throw err;
  }

  var origRenderAll = S.renderAll;
  S.renderAll = function () {
    renderAll(S);
    if (typeof origRenderAll === "function" && origRenderAll !== S.renderAll) {
      try { origRenderAll.apply(this, arguments); } catch (e) {}
    }
  };

  mountSetupUi(S);
  seedStartDate(S);

  if (!_boundDomContentLoaded) {
    _boundDomContentLoaded = true;
    document.addEventListener("DOMContentLoaded", function () {
      seedStartDate(S);
      renderAll(S);
      setTimeout(function () { renderAll(S); }, 400);
    });
  }

  window.addEventListener("blade-intro-done", function () {
    renderAll(S);
    setTimeout(function () { renderAll(S); }, 200);
  });

  bindSetupActions(S);
  if (typeof S.hookConsoleIo === "function") S.hookConsoleIo();
  window.dispatchEvent(new CustomEvent("setup:mounted"));
  if (S.initShiftDayTimes) S.initShiftDayTimes();

  if (typeof S.initFunctionCoverage === "function") {
    var addBtn = document.getElementById("fc-add-band");
    if (!S._funcCoverageBound || (addBtn && !addBtn._fcBound)) {
      S._funcCoverageBound = false;
      S.initFunctionCoverage(S);
    } else if (S.fillFunctionCoverageForm) {
      try { S.fillFunctionCoverageForm(); } catch (e) {}
    }
  }
  // Setup owns extra-type cards + line build; reclaim if FC rebound the helpers.
  attachExtraPositions(S);
  attachTrainingClasses(S);

  renderAll(S);
}
