/**
 * Demand vs process capacity — Coverage tab module.
 * Volume from imported flight list; process capacity from S.computeLaneCapacityMatrix().
 * Read-only vs Generate / Assign / capacity math. Not FTE / coverage headcount.
 */
import { parseVolumeWorkbook } from "./parse.js";
import { demandSlots, bucketFlights, pullProcessCapacity } from "./aggregate.js";
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

function setStatus(msg) {
  var el = $("dc-status");
  if (el) el.textContent = msg;
}

function ensureHost() {
  var root = $("demand-capacity-root");
  var tab = $("tab-coverage");
  if (!root && tab) {
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
  var compute = S.computeLaneCapacityMatrix || S.computeCapacity;
  if (typeof compute !== "function") {
    return "Process capacity API is not available.";
  }
  var last = vi && vi.lastCapacity;
  if (last && last.empty) {
    return "No terminals / mod sets configured. Open Airfield to set lanes and programs, then Refresh.";
  }
  if (!vi || !vi.flights || !vi.flights.length) {
    return "Import a flight-list .xlsx (DAY_OF_WEEK, ETD, CAPACITY, PERCENT_ORIGINATING).";
  }
  return "";
}

export function refreshProcessCapacity(S) {
  var scheduler = S || window.Scheduler;
  if (!scheduler.state) scheduler.state = {};
  var vi = scheduler.state.volumeImport || (scheduler.state.volumeImport = {
    capacityMultiplier: 1,
    fileName: "",
    rowCount: 0,
    flights: [],
    demandByDow: null,
    lastCapacity: null
  });
  var slots = demandSlots(scheduler);
  var mult = multiplierFromUi(scheduler);
  vi.capacityMultiplier = mult;
  if (vi.flights && vi.flights.length && slots.length) {
    vi.demandByDow = bucketFlights(vi.flights, slots, mult);
  } else if (slots.length) {
    vi.demandByDow = null;
  }
  vi.lastCapacity = pullProcessCapacity(scheduler, slots);
  return vi.lastCapacity;
}

export function renderDemandCapacity(S) {
  var scheduler = S || window.Scheduler;
  var charts = $("dc-charts");
  var empty = $("dc-empty");
  var legend = $("dc-legend");
  var note = $("dc-cap-note");
  var vi = scheduler.state && scheduler.state.volumeImport;
  var msg = emptyMessage(scheduler, vi);
  if (empty) empty.textContent = msg;
  var last = vi && vi.lastCapacity;
  var slots = (last && last.slots) || demandSlots(scheduler);
  var hasDemand = !!(vi && vi.demandByDow && vi.demandByDow.length);
  var show = hasDemand && slots.length && !(last && last.empty);
  if (legend) legend.hidden = !show;
  if (charts) charts.hidden = !show;
  if (note && last && last.rates) {
    var r = last.rates;
    note.textContent = "Capacity from current Airfield lanes × volumePerHour (STD " +
      r.STD + " · PRE " + r.PRE + " · MIX " + r.MIX + " /lane/hr → pax / 30-min). Same series all days unless mod-set windows differ.";
  }
  if (show && charts) {
    renderDemandCharts(charts, {
      S: scheduler,
      slots: slots,
      demandByDow: vi.demandByDow,
      airportPaxBySlot: last.airportPaxBySlot || slots.map(function () { return 0; })
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
    if (!S.state) S.state = {};
    var slots = demandSlots(S);
    S.state.volumeImport = {
      capacityMultiplier: mult,
      fileName: file.name,
      rowCount: parsed.rowCount,
      skipped: parsed.skipped,
      flights: parsed.flights,
      demandByDow: bucketFlights(parsed.flights, slots, mult),
      lastCapacity: null
    };
    refreshProcessCapacity(S);
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
  var vi = S.state && S.state.volumeImport;
  refreshProcessCapacity(S);
  renderDemandCapacity(S);
  var last = S.state.volumeImport && S.state.volumeImport.lastCapacity;
  if (last && last.empty) {
    setStatus("No terminals / mod sets configured — process capacity is empty.");
    return;
  }
  if (!vi || !vi.flights || !vi.flights.length) {
    setStatus("Process capacity refreshed. Import a volume file to overlay demand.");
    return;
  }
  setStatus("Refreshed process capacity from Airfield · " + (vi.rowCount || vi.flights.length) + " flights · multiplier " + multiplierFromUi(S));
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
  offerSampleLink();
}

function wrapTab(S) {
  if (typeof S.switchTab !== "function" || S._demandCapacityTabWrapped) return;
  S._demandCapacityTabWrapped = true;
  var orig = S.switchTab;
  S.switchTab = function (name) {
    var result = orig.apply(this, arguments);
    if (name === "coverage") renderDemandCapacity(S);
    return result;
  };
}

export async function initDemandCapacity(scheduler) {
  var S = scheduler || window.Scheduler;
  await ensurePanel();
  bind(S);
  wrapTab(S);
  if (S.state && S.state.volumeImport) {
    if (!S.state.volumeImport.lastCapacity) refreshProcessCapacity(S);
    renderDemandCapacity(S);
  }
}
