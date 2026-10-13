/** Coverage filter listeners. Duplicate-safe. */

let bound = false;

function captureAndShare(S, runFn, kind, ext) {
  if (typeof S.captureAndShare === "function") {
    return S.captureAndShare(runFn, kind, ext);
  }
  var captured = null;
  var done = false;
  var origCreate = URL.createObjectURL;
  var proto = HTMLAnchorElement.prototype;
  var origClick = proto.click;

  function cleanup() {
    URL.createObjectURL = origCreate;
    proto.click = origClick;
  }

  function finish(blob) {
    if (done) return;
    done = true;
    cleanup();
    if (!blob) {
      if (S.updateStatus) S.updateStatus("Export produced no file.");
      return;
    }
    var name = S.exportFileName ? S.exportFileName(kind, ext) : ((kind || "Coverage") + (ext || ".xlsx"));
    if (S.isTauri && S.isTauri()) {
      return S.writeSharedFile(blob, name).then(function (ok) {
        if (!ok) {
          var a = document.createElement("a");
          a.href = origCreate.call(URL, blob);
          a.download = name;
          document.body.appendChild(a);
          origClick.call(a);
          document.body.removeChild(a);
        }
      });
    }
    var a = document.createElement("a");
    a.href = origCreate.call(URL, blob);
    a.download = name;
    document.body.appendChild(a);
    origClick.call(a);
    document.body.removeChild(a);
  }

  URL.createObjectURL = function (blob) {
    captured = blob;
    var url = origCreate.call(URL, blob);
    setTimeout(function () { finish(captured); }, 0);
    return url;
  };
  proto.click = function () {
    if (captured) return;
    return origClick.apply(this, arguments);
  };

  try {
    runFn();
  } catch (err) {
    cleanup();
    if (S.updateStatus) S.updateStatus("Export failed: " + err);
    return;
  }
  setTimeout(function () {
    if (!done && captured) finish(captured);
    else if (!done) {
      cleanup();
      if (S.updateStatus) S.updateStatus("Export timed out waiting for file.");
    }
  }, 20000);
}

export function bindCoverageUI(S) {
  if (bound) return;
  bound = true;

  function readRoles() {
    if (!S.coverageView) S.coverageView = { stso: false, ltso: false, tso: true, funcView: "all" };
    var stso = document.getElementById("cov-role-stso");
    var ltso = document.getElementById("cov-role-ltso");
    var tso = document.getElementById("cov-role-tso");
    S.coverageView.stso = !!(stso && stso.checked);
    S.coverageView.ltso = !!(ltso && ltso.checked);
    S.coverageView.tso = !!(tso && tso.checked);
    if (S.renderCoverageBars) S.renderCoverageBars();
  }

  document.addEventListener("change", function (e) {
    var t = e.target;
    if (!t) return;
    if (t.id === "cov-role-stso" || t.id === "cov-role-ltso" || t.id === "cov-role-tso") {
      readRoles();
      return;
    }
    if (t.name === "cov-func-view") {
      if (!S.coverageView) S.coverageView = { stso: false, ltso: false, tso: true, funcView: "all" };
      S.coverageView.funcView = t.value || "all";
      if (S.renderCoverageBars) S.renderCoverageBars();
    }
  });

  var exportBtn = document.getElementById("btn-export-coverage");
  if (exportBtn) {
    exportBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      captureAndShare(S, function () {
        if (S.exportCoverageExcel) S.exportCoverageExcel();
      }, "Coverage", ".xlsx");
    });
  }
}
