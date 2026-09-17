/**
 * Demand / Volume tab — originating pax vs PAX TSO (optional LTSO) staffing capacity.
 * Capacity = qualifying people × 18 pax / 30-min (36 pax/hour). Read-only.
 */
import { parseVolumeWorkbook } from "./parse.js";
import { bucketFlights } from "./aggregate.js";
import { demandSlots, computeStaffCapacity, capacityLegend, normalizeRoleMode } from "./staffing.js";
import { renderDemandCharts } from "./charts.js";

function $(id) {
  return document.getElementById(id);
}

function multiplierFromUi(S) {
  var el = $("dc-capacity-multiplier");
  var n = el ? Number(el.value) : NaN;
  if (!Number.isFinite(n) || n < 0) {
    if (S && S.state && S.state.volumeImport && Number.isFinite(S.state.volumeImport.capacityMultiplier)) {
      return S.state.volumeImport.capacityMultiplier;
    }
    return 1;
  }
  return n;
}

function roleModeFromUi(S) {
  var checked = document.querySelector('input[name="dc-roles"]:checked');
  if (checked && checked.value) return normalizeRoleMode(checked.value);
  if (S && S.state && S.state.volumeImport && S.state.volumeImport.roleMode) {
    return normalizeRoleMode(S.state.volumeImport.roleMode);
  }
  return "tso";
}

function setStatus(msg) {
  var el = $("dc-status");
  if (el) el.textContent = msg;
}

function ensureHost() {
  var tab = $("tab-demand-capacity");
  if (!tab) return null;
  var root = $("demand-capacity-root");
  if (!root) {
    root = document.createElement("div");
    root.id = "demand-capacity-root";
    tab.appendChild(root);
  }
  return root;
}

async function ensurePanel() {
  var root = ensureHost();
  if (!root) return null;
  if ($("dc-import")) return root;
  try {
    var r = await fetch("modules/demand-capacity/panel.html");
    if (r.ok) root.innerHTML = await r.text();
  } catch (e) {}
  return root;
}

function emptyMessage(S, vi) {
  var last = vi && vi.lastCapacity;
  if (!vi || !vi.flights || !vi.flights.length) {
    return "Import a flight-list .xlsx (DAY_OF_WEEK, ETD, CAPACITY, LOAD_FACTOR, PERCENT_ORIGINATING).";
  }
  if (last && last.empty) {
    return "No bid lines yet. Generate a schedule, then Refresh. Capacity is PAX TSOs covering each slot × 18 pax / 30-min.";
  }
  return "";
}

function ensureState(S) {
  if (!S.state) S.state = {};
  if (!S.state.volumeImport) {
    S.state.volumeImport = {
      capacityMultiplier: 1,
      roleMode: "tso",
      fileName: "",
      rowCount: 0,
      flights: [],
      demandByDow: null,
      lastCapacity: null
    };
  }
  return S.state.volumeImport;
}

export function refreshStaffCapacity(S) {
  var scheduler = S || window.Scheduler;
  var vi = ensureState(scheduler);
  var slots = demandSlots(scheduler);
  var mult = multiplierFromUi(scheduler);
  var mode = roleModeFromUi(scheduler);
  vi.capacityMultiplier = mult;
  vi.roleMode = mode;
  if (vi.flights && vi.flights.length && slots.length) {
    vi.demandByDow = bucketFlights(vi.flights, slots, mult);
  }
  vi.lastCapacity = computeStaffCapacity(scheduler, slots, mode);
  return vi.lastCapacity;
}

export function renderDemandCapacity(S) {
  var scheduler = S || window.Scheduler;
  var charts = $("dc-charts");
  var empty = $("dc-empty");
  var legend = $("dc-legend");
  var note = $("dc-cap-note");
  var capLegend = $("dc-cap-legend-label");
  var vi = scheduler.state && scheduler.state.volumeImport;
  var msg = emptyMessage(scheduler, vi);
  if (empty) empty.textContent = msg;
  var last = vi && vi.lastCapacity;
  var slots = (last && last.slots) || demandSlots(scheduler);
  var hasDemand = !!(vi && vi.demandByDow && vi.demandByDow.length);
  var hasCap = !!(last && last.capacityByDow && !last.empty);
  var show = slots.length && (hasDemand || hasCap);
  var capLabel = capacityLegend(last && last.roleMode);
  if (legend) legend.hidden = !show;
  if (charts) charts.hidden = !show;
  if (capLegend) capLegend.textContent = capLabel;
  if (note && last) {
    note.textContent = capLabel + " = PAX people covering the slot × " +
      (last.paxPerSlot || 18) + " pax / 30-min (" + (last.paxPerHour || 36) + " pax/hour).";
  }
  if (show && charts) {
    renderDemandCharts(charts, {
      S: scheduler,
      slots: slots,
      demandByDow: (vi && vi.demandByDow) || [],
      capacityByDow: (last && last.capacityByDow) || [],
      capLabel: capLabel
    });
  } else if (charts) {
    charts.innerHTML = "";
  }
}

async function onImport(S) {
  var input = $("dc-file");
  var file = input && input.files && input.files[0];
  if (!file) {
    setStatus("Choose a volume .xlsx first.");
    return;
  }
  if (typeof window.ExcelJS === "undefined") {
    setStatus("ExcelJS is not loaded.");
    return;
  }
  var mult = multiplierFromUi(S);
  setStatus("Reading " + file.name + "…");
  try {
    var buf = await file.arrayBuffer();
    var parsed = await parseVolumeWorkbook(buf, 1, window.ExcelJS);
    if (parsed.missing && parsed.missing.length) {
      setStatus("Missing headers: " + parsed.missing.join(", ") + ".");
      return;
    }
    var vi = ensureState(S);
    var slots = demandSlots(S);
    vi.capacityMultiplier = mult;
    vi.roleMode = roleModeFromUi(S);
    vi.fileName = file.name;
    vi.rowCount = parsed.rowCount;
    vi.skipped = parsed.skipped;
    vi.flights = parsed.flights;
    vi.demandByDow = bucketFlights(parsed.flights, slots, mult);
    refreshStaffCapacity(S);
    renderDemandCapacity(S);
    var bits = ["Imported " + file.name, parsed.rowCount + " flights"];
    if (parsed.skipped) bits.push(parsed.skipped + " skipped");
    bits.push("multiplier " + mult);
    setStatus(bits.join(" · "));
    if (S.updateStatus) S.updateStatus("Volume import: " + parsed.rowCount + " flights from " + file.name);
  } catch (err) {
    setStatus("Import failed: " + (err && err.message ? err.message : err));
  }
}

function onRefresh(S) {
  var vi = ensureState(S);
  refreshStaffCapacity(S);
  renderDemandCapacity(S);
  var last = vi.lastCapacity;
  var capLabel = capacityLegend(vi.roleMode);
  if (last && last.empty) {
    setStatus("No bid lines — Generate first. " + capLabel + " is PAX people × 18 pax / 30-min.");
    return;
  }
  if (!vi.flights || !vi.flights.length) {
    setStatus(capLabel + " refreshed from current PAX staffing. Import a volume file to overlay demand.");
    return;
  }
  setStatus("Refreshed " + capLabel + " · " + (vi.rowCount || vi.flights.length) + " flights · multiplier " + multiplierFromUi(S));
}

function onRoleToggle(S) {
  var vi = ensureState(S);
  vi.roleMode = roleModeFromUi(S);
  if (!vi.lastCapacity && !(vi.flights && vi.flights.length)) return;
  refreshStaffCapacity(S);
  renderDemandCapacity(S);
  setStatus(capacityLegend(vi.roleMode) + " — toggle applied, no re-import.");
}

function offerSampleLink() {
  var status = $("dc-status");
  if (!status || $("dc-sample-link")) return;
  fetch("samples/VOLDummy.xlsx", { method: "HEAD" }).then(function (r) {
    if (!r.ok || $("dc-sample-link")) return;
    var a = document.createElement("a");
    a.id = "dc-sample-link";
    a.href = "samples/VOLDummy.xlsx";
    a.download = "VOLDummy.xlsx";
    a.textContent = "Download sample volume file";
    a.style.marginLeft = "0.75rem";
    status.parentNode.appendChild(a);
  }).catch(function () {});
}

function bind(S) {
  if (S._demandCapacityBound) return;
  var importBtn = $("dc-import");
  var refreshBtn = $("dc-refresh");
  if (!importBtn || !refreshBtn) return;
  S._demandCapacityBound = true;
  importBtn.addEventListener("click", function () { onImport(S); });
  refreshBtn.addEventListener("click", function () { onRefresh(S); });
  var file = $("dc-file");
  if (file) {
    file.addEventListener("change", function () {
      if (file.files && file.files[0]) setStatus("Ready to import " + file.files[0].name);
    });
  }
  document.querySelectorAll('input[name="dc-roles"]').forEach(function (el) {
    el.addEventListener("change", function () { onRoleToggle(S); });
  });
  offerSampleLink();
}

function wrapTab(S) {
  if (typeof S.switchTab !== "function" || S._demandCapacityTabWrapped) return;
  S._demandCapacityTabWrapped = true;
  var orig = S.switchTab;
  S.switchTab = function (name) {
    var result = orig.apply(this, arguments);
    if (name === "demand-capacity") renderDemandCapacity(S);
    return result;
  };
}

export async function initDemandCapacity(scheduler) {
  var S = scheduler || window.Scheduler;
  await ensurePanel();
  bind(S);
  wrapTab(S);
  if (S.state && S.state.volumeImport) {
    if (!S.state.volumeImport.lastCapacity) refreshStaffCapacity(S);
    renderDemandCapacity(S);
  }
}
