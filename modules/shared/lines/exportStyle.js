export function defaultExportStyle() {
  return {
    rdo: "#000000",
    bag: "#F4B4B4",
    dfo: "#FFF3A8",
    pax: "",
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

export function getExportStyle(S) {
  var d = defaultExportStyle();
  var cur = (S.state && S.state.exportStyle) || {};
  return {
    rdo: cur.rdo || d.rdo,
    bag: cur.bag || d.bag,
    dfo: cur.dfo || d.dfo,
    pax: cur.pax || d.pax,
    header: cur.header || d.header
  };
}

export function attachExportStyle(S) {
  if (!S) return;
  if (!S.state) S.state = {};
  if (!S.state.exportStyle) S.state.exportStyle = defaultExportStyle();
  S.getExportStyle = function () { return getExportStyle(S); };

  function paint() {
    var st = getExportStyle(S);
    ["rdo", "bag", "dfo", "pax", "header"].forEach(function (key) {
      var el = document.getElementById("export-color-" + key);
      if (el) el.value = st[key] || "#ffffff";
    });
  }

  if (S._exportStyleBound) {
    paint();
    return;
  }
  S._exportStyleBound = true;
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (!t || !t.id || t.id.indexOf("export-color-") !== 0) return;
    var key = t.id.replace("export-color-", "");
    if (!S.state.exportStyle) S.state.exportStyle = defaultExportStyle();
    S.state.exportStyle[key] = t.value === "#ffffff" && key === "pax" ? "" : t.value;
  });
  paint();
}
