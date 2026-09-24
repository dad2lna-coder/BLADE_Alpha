/** Presentation / dark theme — conference TV vs console skin. */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";

  var STORAGE_KEY = "blade.theme";
  var THEMES = { dark: "dark", presentation: "presentation" };
  var LABELS = { dark: "Dark", presentation: "Presentation" };

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

  function menuEl() {
    return document.getElementById("theme-menu");
  }

  function btnEl() {
    return document.getElementById("btn-theme");
  }

  function setMenuOpen(open) {
    var menu = menuEl();
    var btn = btnEl();
    if (menu) {
      if (open) menu.removeAttribute("hidden");
      else menu.setAttribute("hidden", "");
    }
    if (btn) btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function isMenuOpen() {
    var menu = menuEl();
    return !!(menu && !menu.hasAttribute("hidden"));
  }

  function updateToggle(name) {
    var btn = btnEl();
    var theme = normalize(name);
    if (btn) {
      btn.textContent = "Theme";
      btn.setAttribute("aria-pressed", theme === THEMES.presentation ? "true" : "false");
      btn.setAttribute("data-theme", theme);
      btn.setAttribute("aria-label", "Theme: " + (LABELS[theme] || LABELS.dark));
    }
    var menu = menuEl();
    if (menu) {
      menu.querySelectorAll("[data-theme]").forEach(function (opt) {
        var on = opt.getAttribute("data-theme") === theme;
        opt.setAttribute("aria-selected", on ? "true" : "false");
        opt.classList.toggle("is-active", on);
      });
    }
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
      var action = el ? el.getAttribute("data-action") : "";
      if (action === "toggle-theme-menu" || (el && el.id === "btn-theme")) {
        e.preventDefault();
        setMenuOpen(!isMenuOpen());
        return;
      }
      if (action === "set-theme") {
        e.preventDefault();
        S.applyTheme(el.getAttribute("data-theme"));
        setMenuOpen(false);
        return;
      }
      if (action === "toggle-theme") {
        e.preventDefault();
        S.toggleTheme();
        setMenuOpen(false);
        return;
      }
      if (isMenuOpen() && !(e.target && e.target.closest && e.target.closest(".theme-dropdown"))) {
        setMenuOpen(false);
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMenuOpen()) {
        setMenuOpen(false);
        var btn = btnEl();
        if (btn) btn.focus();
      }
    });
  };

  S.initTheme = function () {
    S.applyTheme(S.getTheme());
    setMenuOpen(false);
    S.bindUiEvents();
  };

  document.addEventListener("DOMContentLoaded", function () {
    S.initTheme();
  });
})(window.Scheduler);
