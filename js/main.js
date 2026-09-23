/** Entry point — classic scripts, works from file:// and OneDrive */
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

  function safeInit(name, fn) {
    if (typeof fn !== "function") return;
    try {
      fn();
    } catch (err) {
      console.error("Init failed:", name, err);
      if (S.updateStatus) S.updateStatus("Init warning: " + name + " failed.");
    }
  }

  function init() {
    if (S.$("cfg-start") && !S.$("cfg-start").value) {
      var d = S.parseStartDate(null);
      S.$("cfg-start").value = S.toDateInputValue(d);
      S.state.startDate = d;
    }

    document.querySelectorAll(".tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (S.switchTab) S.switchTab(btn.dataset.tab);
      });
    });

    const instructionsModal = S.$('instructions-modal');
    const instructionsBtn = S.$('btn-instructions');
    const instructionsCloseBtn = S.$('instructions-modal-close');
    const instructionsContent = S.$('instructions-content');
    if (instructionsBtn && instructionsModal && instructionsCloseBtn && instructionsContent) {
      function escapeHtml(str) {
        return String(str)
          .replace(/&/g, "&")
          .replace(/</g, "<")
          .replace(/>/g, ">");
      }
      function renderInstructions(text) {
        instructionsContent.innerHTML = "<pre>" + escapeHtml(text) + "</pre>";
        instructionsModal.style.display = "block";
      }
      function showInstructions() {
        if (S.INSTRUCTIONS_MD) {
          renderInstructions(S.INSTRUCTIONS_MD);
          return;
        }
        if (typeof fetch !== "function" || location.protocol === "file:") {
          renderInstructions(
            "Instructions file is missing from this copy of the app.\n" +
              "Keep js/instructions.js next to the other scripts."
          );
          return;
        }
        fetch("INSTRUCTIONS.md")
          .then(function (response) {
            if (!response.ok) throw new Error("Could not load INSTRUCTIONS.md");
            return response.text();
          })
          .then(renderInstructions)
          .catch(function (error) {
            console.error("Error fetching instructions:", error);
            instructionsContent.innerHTML =
              '<p style="color: red;">Could not load instructions from this folder. ' +
              "Use the bundled js/instructions.js or open via a local server.</p>";
            instructionsModal.style.display = "block";
          });
      }
      const hideInstructions = () => {
        instructionsModal.style.display = 'none';
      };
      instructionsBtn.addEventListener('click', showInstructions);
      instructionsCloseBtn.addEventListener('click', hideInstructions);
      window.addEventListener('click', (event) => {
        if (event.target === instructionsModal) {
          hideInstructions();
        }
      });
    }

    if (S.$("btn-generate")) S.$("btn-generate").addEventListener("click", function () {
      if (S.generate) S.generate();
    });
    if (S.$("btn-export")) S.$("btn-export").addEventListener("click", function () {
      if (S.exportJson) S.exportJson();
    });
    if (S.$("btn-import")) {
      S.$("btn-import").addEventListener("click", function () {
        var fileInput = S.$("file-import");
        if (fileInput) {
          fileInput.value = "";
          fileInput.click();
        }
      });
    }
    if (S.$("file-import")) {
      S.$("file-import").addEventListener("change", function (event) {
        var file = event.target.files && event.target.files[0];
        if (S.importJsonFile) S.importJsonFile(file);
      });
    }
    if (S.$("btn-clear")) S.$("btn-clear").addEventListener("click", function () {
      if (S.clearAll) S.clearAll();
    });
    if (S.$("btn-export-lines-excel")) {
      S.$("btn-export-lines-excel").addEventListener("click", function () {
        if (S.exportLinesExcel) S.exportLinesExcel();
      });
    }
    safeInit("shiftDayTimes", S.initShiftDayTimes);
    safeInit("functionCoverage", S.initFunctionCoverage);
    safeInit("reports", S.initReports);
    S.__USE_SVELTE_LINES = true;
    if (S.bindLinesUI) S.bindLinesUI();
    safeInit("capacity", S.initCapacity);

    function onNewTeam(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!S.createTeam) return;
      var t = S.createTeam();
      if (S.renderTeams) S.renderTeams();
      if (S.updateStatus) S.updateStatus("Created " + (t && t.name ? t.name : "team"));
    }

    S.onNewTeam = onNewTeam;
    ["btn-team-new", "btn-team-new-2"].forEach(function (id) {
      var btn = S.$(id);
      if (btn) btn.addEventListener("click", onNewTeam);
    });

    S.updateStatus("BLADE Alpha Build — boot 20260923d");
    if (S.renderAll) S.renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);

})(window.Scheduler);
