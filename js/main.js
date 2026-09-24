/** Blade shell — tabs, header buttons, instructions. */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";

  if (!S.switchTab) {
    S.switchTab = function (name) {
      document.querySelectorAll(".tab-btn").forEach(function (b) {
        b.classList.toggle("active", b.dataset.tab === name);
      });
      document.querySelectorAll(".panel").forEach(function (p) {
        p.classList.toggle("active", p.id === "tab-" + name);
      });
    };
  }
  if (!S.renderAll) S.renderAll = function () {};

  function bindClick(id, fn) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", fn);
  }

  function init() {
    document.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest ? e.target.closest(".tab-btn") : null;
      if (btn && btn.dataset.tab && S.switchTab) S.switchTab(btn.dataset.tab);
    });

    bindClick("btn-generate", function () { if (S.generate) S.generate(); });
    bindClick("btn-export", function () { if (S.exportJson) S.exportJson(); });
    bindClick("btn-import", function () {
      var fileInput = document.getElementById("file-import");
      if (fileInput) { fileInput.value = ""; fileInput.click(); }
    });
    var fileImport = document.getElementById("file-import");
    if (fileImport) {
      fileImport.addEventListener("change", function (event) {
        var file = event.target.files && event.target.files[0];
        if (S.importJsonFile) S.importJsonFile(file);
      });
    }
    bindClick("btn-clear", function () { if (S.clearAll) S.clearAll(); });

    var modal = document.getElementById("instructions-modal");
    var btn = document.getElementById("btn-instructions");
    var closeBtn = document.getElementById("instructions-modal-close");
    var content = document.getElementById("instructions-content");
    if (btn && modal && closeBtn && content) {
      function show() {
        var text = S.INSTRUCTIONS_MD || "Instructions unavailable.";
        content.innerHTML = "<pre>" + String(text)
          .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</pre>";
        modal.style.display = "block";
      }
      btn.addEventListener("click", show);
      closeBtn.addEventListener("click", function () { modal.style.display = "none"; });
      window.addEventListener("click", function (event) {
        if (event.target === modal) modal.style.display = "none";
      });
    }

    if (S.updateStatus) S.updateStatus("BLADE Alpha Build — boot 20260924a");
    if (S.renderAll) S.renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.Scheduler);
