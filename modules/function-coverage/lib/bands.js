let api = null;

import { ensureFunctionCoverage, bagPoolTotal, dfoPoolTotal } from "./pools.js";
import { computeShiftAnchors } from "./duty.js";

export function bindBandsApi(scheduler) {
  api = scheduler;
}

function num0(v) { return Math.max(0, Math.floor(+v || 0)); }
function setVal(id, v) { const el = api.$(id); if (el) el.value = v; }
function setChk(id, v) { const el = api.$(id); if (el) el.checked = !!v; }
function readNum(id) { const el = api.$(id); return el ? num0(el.value) : null; }

export function syncFunctionModeUi() {
  const fc = ensureFunctionCoverage();
  setVal("fc-pool-bag-stso-m", fc.poolStsoBagM); setVal("fc-pool-bag-stso-f", fc.poolStsoBagF);
  setVal("fc-pool-bag-ltso-m", fc.poolLtsoBagM); setVal("fc-pool-bag-ltso-f", fc.poolLtsoBagF);
  setVal("fc-pool-bag-tso-m", fc.poolTsoBagM); setVal("fc-pool-bag-tso-f", fc.poolTsoBagF);
  setVal("fc-pool-dfo-stso-m", fc.poolStsoDfoM); setVal("fc-pool-dfo-stso-f", fc.poolStsoDfoF);
  setVal("fc-pool-dfo-ltso-m", fc.poolLtsoDfoM); setVal("fc-pool-dfo-ltso-f", fc.poolLtsoDfoF);
  setVal("fc-pool-dfo-tso-m", fc.poolTsoDfoM); setVal("fc-pool-dfo-tso-f", fc.poolTsoDfoF);
  const wrap = api.$("fc-bands-wrap");
  const add = api.$("fc-add-band");
  if (wrap) wrap.style.display = "";
  if (add) add.style.display = "";
}

export function fillFunctionCoverageForm() {
  const fc = ensureFunctionCoverage();
  setVal("fc-phase-thr", fc.phaseThresholdMin); setChk("fc-ampm-split", fc.amPmSplit);
  setVal("fc-bias", fc.bias || "none");
  syncFunctionModeUi();
  renderFunctionBandsTable();
  updateFunctionCoveragePreview();
  if (renderExtraPositions) renderExtraPositions();
}

export function openFunctionCoverageModal() {
  fillFunctionCoverageForm();
  const modal = api.$("func-coverage-modal");
  if (modal) modal.style.display = "block";
}

export function closeFunctionCoverageModal() {
  const modal = api.$("func-coverage-modal");
  if (modal) modal.style.display = "none";
}

function syncDerivedMode(fc) {
  var bag = bagPoolTotal(fc) > 0, dfo = dfoPoolTotal(fc) > 0;
  fc.poolBag = bagPoolTotal(fc);
  fc.poolStsoDfo = num0(fc.poolStsoDfoM) + num0(fc.poolStsoDfoF);
  fc.poolLtsoDfo = num0(fc.poolLtsoDfoM) + num0(fc.poolLtsoDfoF);
  fc.poolTsoDfo = num0(fc.poolTsoDfoM) + num0(fc.poolTsoDfoF);
  fc.mode = bag && dfo ? "both" : bag ? "bag" : dfo ? "dfo" : "none";
  return fc.mode;
}

export function renderFunctionBandsTable() {
  const tbody = api.$("fc-bands-tbody"); if (!tbody) return;
  const bands = ensureFunctionCoverage().bands;
  tbody.innerHTML = bands.map(function (b, i) {
    function num(key) {
      return '<td><input type="number" min="0" max="99" data-fc-band="' + i + '" data-fc-field="' + key + '" value="' + (b[key] != null ? b[key] : 0) + '" style="width:3.5rem"></td>';
    }
    return "<tr>" +
      '<td><input type="time" data-fc-band="' + i + '" data-fc-field="start" value="' + (b.start || "00:00") + '" step="900"></td>' +
      '<td><input type="time" data-fc-band="' + i + '" data-fc-field="end" value="' + (b.end || "00:00") + '" step="900"></td>' +
      num("stso") + num("ltso") + num("tso") +
      '<td><button type="button" class="btn btn-red btn-sm" data-fc-remove="' + i + '">\u2715</button></td></tr>';
  }).join("");
}

export function readFunctionBandsFromDom() {
  const fc = ensureFunctionCoverage();
  function take(id, key) { var n = readNum(id); if (n != null) fc[key] = n; }
  take("fc-pool-bag-stso-m", "poolStsoBagM"); take("fc-pool-bag-stso-f", "poolStsoBagF");
  take("fc-pool-bag-ltso-m", "poolLtsoBagM"); take("fc-pool-bag-ltso-f", "poolLtsoBagF");
  take("fc-pool-bag-tso-m", "poolTsoBagM"); take("fc-pool-bag-tso-f", "poolTsoBagF");
  take("fc-pool-dfo-stso-m", "poolStsoDfoM"); take("fc-pool-dfo-stso-f", "poolStsoDfoF");
  take("fc-pool-dfo-ltso-m", "poolLtsoDfoM"); take("fc-pool-dfo-ltso-f", "poolLtsoDfoF");
  take("fc-pool-dfo-tso-m", "poolTsoDfoM"); take("fc-pool-dfo-tso-f", "poolTsoDfoF");
  syncDerivedMode(fc);
  const thr = api.$("fc-phase-thr"), split = api.$("fc-ampm-split");
  if (thr) fc.phaseThresholdMin = num0(thr.value || 15);
  if (split) fc.amPmSplit = !!split.checked;
  const biasEl = api.$("fc-bias");
  if (biasEl) {
    var v = biasEl.value;
    if (v === "male" || v === "female" || v === "none") fc.bias = v;
    else fc.bias = "none";
  }
  for (var i = 0; i < fc.bands.length; i++) {
    var b = fc.bands[i] || {};
    ["start", "end", "stso", "ltso", "tso"].forEach(function (field) {
      var el = document.querySelector('[data-fc-band="' + i + '"][data-fc-field="' + field + '"]');
      if (!el) return;
      if (field === "start" || field === "end") b[field] = el.value || b[field];
      else b[field] = num0(el.value);
    });
    fc.bands[i] = b;
  }
  fc.bands.sort(function (a, b) { return api.timeToMin(a.start) - api.timeToMin(b.start); });
  return fc;
}

export function updateFunctionCoveragePreview() {
  const el = api.$("fc-preview"); if (!el) return;
  const fc = ensureFunctionCoverage();
  const anchors = computeShiftAnchors();
  const bandTxt = (fc.bands || []).map(function (b) {
    return (b.start || "?") + "-" + (b.end || "?") + " bag-need " + (b.stso || 0) + "-" + (b.ltso || 0) + "-" + (b.tso || 0);
  }).join(" | ");
  el.textContent = "BAG STSO " + fc.poolStsoBagM + "/" + fc.poolStsoBagF +
    " LTSO " + fc.poolLtsoBagM + "/" + fc.poolLtsoBagF +
    " TSO " + fc.poolTsoBagM + "/" + fc.poolTsoBagF +
    " \u00b7 DFO STSO " + fc.poolStsoDfoM + "/" + fc.poolStsoDfoF +
    " LTSO " + fc.poolLtsoDfoM + "/" + fc.poolLtsoDfoF +
    " TSO " + fc.poolTsoDfoM + "/" + fc.poolTsoDfoF +
    " \u00b7 AM " + api.slotLabel(anchors.am) + " PM " + api.slotLabel(anchors.pm) + " " + (bandTxt || "no bands");
}

function defaultExtraBands() {
  return [{ start: "04:00", end: "20:30", min: 1 }];
}

export function ensureExtraPositions() {
  if (!Array.isArray(api.state.extraPositions)) api.state.extraPositions = [];
  api.state.extraPositions.forEach(function (pos, i) {
    if (!pos.id) pos.id = "extra-" + (i + 1);
    if (!pos.name) pos.name = "Position";
    pos.m = num0(pos.m); pos.f = num0(pos.f);
    if (!Array.isArray(pos.bands) || !pos.bands.length) pos.bands = defaultExtraBands();
  });
  return api.state.extraPositions;
}

export function readExtraPositionsFromDom() {
  const list = ensureExtraPositions();
  list.forEach(function (pos) {
    const nameEl = api.$('[data-extra-name="' + pos.id + '"]');
    const mEl = api.$('[data-extra-m="' + pos.id + '"]');
    const fEl = api.$('[data-extra-f="' + pos.id + '"]');
    if (nameEl) pos.name = String(nameEl.value || pos.name).trim() || pos.name;
    if (mEl) pos.m = num0(mEl.value);
    if (fEl) pos.f = num0(fEl.value);
    if (!Array.isArray(pos.bands)) pos.bands = defaultExtraBands();
    for (var i = 0; i < pos.bands.length; i++) {
      var b = pos.bands[i] || {};
      ["start", "end", "min"].forEach(function (field) {
        var el = api.$('[data-extra-band="' + pos.id + '"][data-extra-bi="' + i + '"][data-extra-bf="' + field + '"]');
        if (!el) return;
        if (field === "min") b[field] = num0(el.value);
        else b[field] = el.value || b[field];
      });
      pos.bands[i] = b;
    }
  });
  return list;
}

export function renderExtraPositions() {
  const host = api.$("extra-pos-list");
  if (!host) return;
  const list = ensureExtraPositions();
  host.innerHTML = list.map(function (pos) {
    var rows = (pos.bands || []).map(function (b, i) {
      return "<tr>" +
        '<td><input type="time" data-extra-band="' + pos.id + '" data-extra-bi="' + i + '" data-extra-bf="start" value="' + (b.start || "04:00") + '" step="900"></td>' +
        '<td><input type="time" data-extra-band="' + pos.id + '" data-extra-bi="' + i + '" data-extra-bf="end" value="' + (b.end || "20:30") + '" step="900"></td>' +
        '<td><input type="number" min="0" max="99" data-extra-band="' + pos.id + '" data-extra-bi="' + i + '" data-extra-bf="min" value="' + (b.min != null ? b.min : 0) + '" style="width:3.5rem"></td>' +
        '<td><button type="button" class="btn btn-red btn-sm" data-extra-band-remove="' + pos.id + '" data-extra-bi="' + i + '">\u2715</button></td></tr>';
    }).join("");
    return '<div class="extra-pos-card" data-extra-card="' + pos.id + '">' +
      '<div class="fte-sex-row extra-pos-head">' +
      '<label>Name <input type="text" data-extra-name="' + pos.id + '" value="' + String(pos.name || "").replace(/"/g, "&quot;") + '" style="width:7rem"></label>' +
      '<label>Male <input type="number" min="0" data-extra-m="' + pos.id + '" value="' + num0(pos.m) + '" style="width:4.5rem"></label>' +
      '<label>Female <input type="number" min="0" data-extra-f="' + pos.id + '" value="' + num0(pos.f) + '" style="width:4.5rem"></label>' +
      '<button type="button" class="btn btn-red btn-sm" data-extra-remove="' + pos.id + '">Remove</button>' +
      '<button type="button" class="btn btn-sm" data-extra-add-band="' + pos.id + '">+ Band</button></div>' +
      '<div class="lines-scroll extra-pos-bands"><table class="data-table"><thead><tr><th>Start</th><th>End</th><th>Min</th><th></th></tr></thead><tbody>' +
      rows + "</tbody></table></div></div>";
  }).join("");
}

export function addExtraPosition(name) {
  readExtraPositionsFromDom();
  var list = ensureExtraPositions();
  list.push({ id: "extra-" + Date.now() + "-" + (list.length + 1), name: name || "MSTI", m: 0, f: 0, bands: defaultExtraBands() });
  renderExtraPositions();
}

export function buildExtraPositionLines() {
  var out = [];
  var list = ensureExtraPositions();
  var shifts = api.state.shifts || [];
  var fallback = shifts[0] || { id: "", name: "Shift", start: "04:00", end: "20:30", paid: 8, rdoHard: [] };
  list.forEach(function (pos, pi) {
    var total = num0(pos.m) + num0(pos.f);
    if (!total) return;
    if (!pos.bands || !pos.bands.length) api.state.issues.push((pos.name || "Position") + ": no coverage bands.");
    var idBase = 30000 + pi * 1000, made = 0;
    function pushSex(sex, count) {
      for (var i = 0; i < count; i++) {
        var def = shifts[made % Math.max(1, shifts.length)] || fallback;
        var workDays = (+def.paid || 8) >= 10 ? 4 : 5;
        var rdoCount = 7 - workDays;
        var hard = Array.isArray(def.rdoHard) ? def.rdoHard.map(Number).filter(function (x) { return x >= 0 && x <= 6; }) : [];
        var rdoDays = hard.length ? hard.slice(0, rdoCount) : (api.consecutiveRdos ? api.consecutiveRdos(rdoCount, (idBase + made) % 7) : [0, 6]);
        while (rdoDays.length < rdoCount) {
          for (var d = 0; d < 7 && rdoDays.length < rdoCount; d++) if (rdoDays.indexOf(d) < 0) rdoDays.push(d);
        }
        out.push({
          id: idBase + made + 1,
          lineCode: String(pos.name || "POS") + " " + String(made + 1).padStart(2, "0"),
          shiftId: def.id, shiftName: def.name,
          shiftLabel: api.shiftLabel ? api.shiftLabel(def) : ((def.start || "") + "-" + (def.end || "")),
          empClass: pos.name || "EXTRA", position: pos.name || "EXTRA",
          isLtso: false, isStso: false, isExtra: true, extraPositionId: pos.id,
          sex: sex, function: "", rdoDays: rdoDays, rdoHard: hard.length > 0, paid: def.paid || 8
        });
        made++;
      }
    }
    pushSex("M", num0(pos.m));
    pushSex("F", num0(pos.f));
  });
  return out;
}