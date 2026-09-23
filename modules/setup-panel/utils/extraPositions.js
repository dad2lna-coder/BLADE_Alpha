/** Extra positions — Setup-tab list. Line building stays on generate. */
function num0(v) {
  var n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function defaultExtraBands() {
  return [{ start: "04:00", end: "20:30", min: 1 }];
}

export function attachExtraPositions(S) {
  if (!S) return;

  S.ensureExtraPositions = function () {
    if (!S.state) S.state = {};
    if (!Array.isArray(S.state.extraPositions)) S.state.extraPositions = [];
    S.state.extraPositions.forEach(function (pos, i) {
      if (!pos.id) pos.id = "extra-" + (i + 1);
      if (!pos.name) pos.name = "Position";
      pos.m = num0(pos.m); pos.f = num0(pos.f);
      if (!Array.isArray(pos.bands) || !pos.bands.length) pos.bands = defaultExtraBands();
    });
    return S.state.extraPositions;
  };

  S.readExtraPositionsFromDom = function () {
    var list = S.ensureExtraPositions();
    list.forEach(function (pos) {
      var nameEl = document.querySelector('[data-extra-name="' + pos.id + '"]');
      var mEl = document.querySelector('[data-extra-m="' + pos.id + '"]');
      var fEl = document.querySelector('[data-extra-f="' + pos.id + '"]');
      if (nameEl) pos.name = String(nameEl.value || pos.name).trim() || pos.name;
      if (mEl) pos.m = num0(mEl.value);
      if (fEl) pos.f = num0(fEl.value);
      if (!Array.isArray(pos.bands)) pos.bands = defaultExtraBands();
      for (var i = 0; i < pos.bands.length; i++) {
        var b = pos.bands[i] || {};
        ["start", "end", "min"].forEach(function (field) {
          var el = document.querySelector('[data-extra-band="' + pos.id + '"][data-extra-bi="' + i + '"][data-extra-bf="' + field + '"]');
          if (!el) return;
          if (field === "min") b[field] = num0(el.value);
          else b[field] = el.value || b[field];
        });
        pos.bands[i] = b;
      }
    });
    return list;
  };

  S.renderExtraPositions = function () {
    var host = document.getElementById("extra-pos-list");
    if (!host) return;
    var list = S.ensureExtraPositions();
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
  };

  S.addExtraPosition = function (name) {
    S.readExtraPositionsFromDom();
    var list = S.ensureExtraPositions();
    list.push({ id: "extra-" + Date.now() + "-" + (list.length + 1), name: name || "MSTI", m: 0, f: 0, bands: defaultExtraBands() });
    S.renderExtraPositions();
  };

  if (!S._extraDocBound) {
    S._extraDocBound = true;
    document.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.getAttribute) return;
      var rem = t.getAttribute("data-extra-remove");
      if (rem != null) {
        S.readExtraPositionsFromDom();
        S.state.extraPositions = S.ensureExtraPositions().filter(function (p) { return p.id !== rem; });
        S.renderExtraPositions();
        return;
      }
      var addBand = t.getAttribute("data-extra-add-band");
      if (addBand != null) {
        S.readExtraPositionsFromDom();
        var list = S.ensureExtraPositions();
        var pos = null;
        for (var i = 0; i < list.length; i++) if (list[i].id === addBand) pos = list[i];
        if (pos) {
          if (!Array.isArray(pos.bands)) pos.bands = defaultExtraBands();
          pos.bands.push({ start: "04:00", end: "20:30", min: 1 });
        }
        S.renderExtraPositions();
        return;
      }
      var bandRem = t.getAttribute("data-extra-band-remove");
      var bi = t.getAttribute("data-extra-bi");
      if (bandRem != null) {
        S.readExtraPositionsFromDom();
        var list2 = S.ensureExtraPositions();
        var p2 = null;
        for (var j = 0; j < list2.length; j++) if (list2[j].id === bandRem) p2 = list2[j];
        if (p2 && Array.isArray(p2.bands)) p2.bands.splice(+bi, 1);
        S.renderExtraPositions();
      }
    });
  }
}
