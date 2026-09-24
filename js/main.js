/** Blade shell — tabs, header buttons, instructions. */
window.Scheduler = window.Scheduler || {};
(function (S) {
  "use strict";

  if (!S.switchTab) {
    S.switchTab = function (name) {
      document.querySelectorAll("#blade-tabs .tab-btn").forEach(function (b) {
        b.classList.toggle("active", b.dataset.tab === name);
      });
      document.querySelectorAll("#blade-panels > .panel").forEach(function (p) {
        p.classList.toggle("active", p.id === "tab-" + name);
      });
    };
  }
  if (!S.renderAll) S.renderAll = function () {};

  function init() {
    document.addEventListener("click", function (e) {
      var sub = e.target && e.target.closest ? e.target.closest(".report-sub-btn") : null;
      if (sub && sub.dataset.subtab && S.switchReportSub) {
        S.switchReportSub(sub.dataset.subtab);
        return;
      }
      var btn = e.target && e.target.closest ? e.target.closest("#blade-tabs .tab-btn") : null;
      if (btn && btn.dataset.tab && S.switchTab) S.switchTab(btn.dataset.tab);
    });

    // GEN/EXP/IMP/CLR + #file-import bind after Setup panel mount
    // (modules/setup-panel bindSetupActions). Header only keeps HLP.

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

    if (S.updateStatus) S.updateStatus("BLADE Alpha Build — boot 20260924b");
    if (S.renderAll) S.renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.Scheduler);
