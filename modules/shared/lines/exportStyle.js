export function defaultExportStyle() {
  return {
    rdo: "#000000",
    bag: "#F4B4B4",
    dfo: "#FFF3A8",
    pax: "#A0C4FF",
    header: "#1F4E79"
  };
}

export function hexToArgb(hex) {
  if (!hex) return null;
  var h = String(hex).replace("#", "").trim();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length !== 6) return null;
  return "FF" + h.toUpperCase();
}

export function normalizeHex(hex, fallback) {
  if (!hex) return fallback || null;
  var h = String(hex).replace("#", "").trim();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length !== 6 || /[^0-9a-fA-F]/.test(h)) return fallback || null;
  return "#" + h.toUpperCase();
}

export function readableTextHex(bgHex) {
  var hex = normalizeHex(bgHex, "#FFFFFF") || "#FFFFFF";
  var h = hex.slice(1);
  var r = parseInt(h.slice(0, 2), 16);
  var g = parseInt(h.slice(2, 4), 16);
  var b = parseInt(h.slice(4, 6), 16);
  var y = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return y < 0.45 ? "#FFFFFF" : "#111111";
}

export function getExportStyle(S) {
  var d = defaultExportStyle();
  var cur = (S && S.state && S.state.exportStyle) || {};
  return {
    rdo: normalizeHex(cur.rdo, d.rdo),
    bag: normalizeHex(cur.bag, d.bag),
    dfo: normalizeHex(cur.dfo, d.dfo),
    pax: normalizeHex(cur.pax, d.pax),
    header: normalizeHex(cur.header, d.header)
  };
}

export function dutyFillHex(style, duty) {
  var st = style || defaultExportStyle();
  var key = String(duty || "").toLowerCase();
  if (key === "bags") key = "bag";
  if (key === "rdo" || key === "bag" || key === "dfo" || key === "pax" || key === "header") {
    return st[key] || defaultExportStyle()[key];
  }
  return null;
}

export function dutyFillArgb(style, duty) {
  return hexToArgb(dutyFillHex(style, duty));
}

export function applyExportCssVars(S) {
  var st = getExportStyle(S);
  var roots = [
    document.documentElement,
    document.getElementById("tab-lines"),
    document.getElementById("lines-table-root"),
    document.getElementById("lines-toolbar"),
    document.querySelector(".lines-table-root")
  ];
  ["rdo", "bag", "dfo", "pax", "header"].forEach(function (key) {
    var hex = st[key];
    var fg = readableTextHex(hex);
    roots.forEach(function (el) {
      if (!el || !el.style) return;
      el.style.setProperty("--export-" + key, hex);
      el.style.setProperty("--export-" + key + "-fg", fg);
    });
  });
}

function refreshLinesGrid(S) {
  var root = document.getElementById("lines-table-root");
  if (root && typeof root.refresh === "function") root.refresh();
  else if (S && typeof S.renderLines === "function") S.renderLines();
  else window.dispatchEvent(new CustomEvent("lines:request-render", { detail: { source: "export-style" } }));
}

function syncPickers(S) {
  var st = getExportStyle(S);
  ["rdo", "bag", "dfo", "pax", "header"].forEach(function (key) {
    var el = document.getElementById("export-color-" + key);
    if (el) el.value = st[key];
  });
}

function ensureToolbar(S) {
  var bar = document.getElementById("lines-toolbar");
  if (!bar) return false;
  if (!document.getElementById("export-style-row")) {
    var wrap = document.createElement("span");
    wrap.id = "export-style-row";
    wrap.style.marginLeft = "0.75rem";
    wrap.innerHTML =
      '<label class="muted">Export colors</label> ' +
      'RDO <input type="color" id="export-color-rdo" /> ' +
      'BAG <input type="color" id="export-color-bag" /> ' +
      'DFO <input type="color" id="export-color-dfo" /> ' +
      'PAX <input type="color" id="export-color-pax" /> ' +
      'Hdr <input type="color" id="export-color-header" />';
    bar.appendChild(wrap);
  }
  syncPickers(S);
  applyExportCssVars(S);
  return true;
}

export function attachExportStyle(S) {
  if (!S) return;
  if (!S.state) S.state = {};
  if (!S.state.exportStyle) S.state.exportStyle = defaultExportStyle();
  else {
    var merged = getExportStyle(S);
    S.state.exportStyle.rdo = merged.rdo;
    S.state.exportStyle.bag = merged.bag;
    S.state.exportStyle.dfo = merged.dfo;
    S.state.exportStyle.pax = merged.pax;
    S.state.exportStyle.header = merged.header;
  }
  S.getExportStyle = function () { return getExportStyle(S); };
  S.applyExportCssVars = function () { applyExportCssVars(S); };

  ensureToolbar(S);

  if (!S._exportStyleRetryBound) {
    S._exportStyleRetryBound = true;
    window.addEventListener("lines:request-render", function () { ensureToolbar(S); });
    document.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest && e.target.closest(".tab-btn");
      if (btn && btn.dataset.tab === "lines") ensureToolbar(S);
    });
  }

  if (S._exportStyleBound) return;
  S._exportStyleBound = true;
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (!t || !t.id || t.id.indexOf("export-color-") !== 0) return;
    var key = t.id.replace("export-color-", "");
    if (!S.state.exportStyle) S.state.exportStyle = defaultExportStyle();
    var next = normalizeHex(t.value, defaultExportStyle()[key]);
    if (!next) return;
    S.state.exportStyle[key] = next;
    applyExportCssVars(S);
    refreshLinesGrid(S);
  });
}
