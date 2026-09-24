/** Presentation / dark theme — conference TV vs console skin. */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";

  var STORAGE_KEY = "blade.theme";
  var THEMES = { dark: "dark", presentation: "presentation" };
  var LABELS = { dark: "Theme: Dark", presentation: "Theme: Presentation" };

  function normalize(name) {
    return name === THEMES.presentation ? THEMES.presentation : THEMES.dark;
  }

  function readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeStored(name) {
    try {
      localStorage.setItem(STORAGE_KEY, name);
    } catch (e) {}
  }

  function updateToggle(name) {
    var btn = document.getElementById("btn-theme");
    if (!btn) return;
    var presentation = name === THEMES.presentation;
    btn.textContent = LABELS[name] || LABELS.dark;
    btn.setAttribute("aria-pressed", presentation ? "true" : "false");
  }

  S.getTheme = function () {
    var fromDom = document.documentElement && document.documentElement.dataset
      ? document.documentElement.dataset.theme
      : "";
    if (fromDom === THEMES.presentation || fromDom === THEMES.dark) return fromDom;
    return normalize(readStored());
  };

  S.applyTheme = function (name) {
    var theme = normalize(name);
    document.documentElement.dataset.theme = theme;
    writeStored(theme);
    updateToggle(theme);
    return theme;
  };

  S.toggleTheme = function () {
    var next = S.getTheme() === THEMES.presentation ? THEMES.dark : THEMES.presentation;
    return S.applyTheme(next);
  };

  S.bindUiEvents = S.bindUiEvents || function () {
    if (S._themeUiBound) return;
    S._themeUiBound = true;
    document.addEventListener("click", function (e) {
      var el = e.target && e.target.closest ? e.target.closest("[data-action]") : null;
      if (!el) return;
      var action = el.getAttribute("data-action");
      if (action === "toggle-theme") {
        e.preventDefault();
        S.toggleTheme();
      }
    });
  };

  S.initTheme = function () {
    S.applyTheme(S.getTheme());
    S.bindUiEvents();
  };

  document.addEventListener("DOMContentLoaded", function () {
    S.initTheme();
  });
})(window.Scheduler);
