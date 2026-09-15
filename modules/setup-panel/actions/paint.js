/** Paint function coverage bands + bind save staffing */
export function paintFunctionCoverage(S) {
  if (S.ensureFunctionCoverage) S.ensureFunctionCoverage();
  if (S.fillFunctionCoverageForm) {
    try { S.fillFunctionCoverageForm(); } catch (e) {}
  }
  if (S.renderFunctionBandsTable) S.renderFunctionBandsTable();
  if (S.updateFunctionCoveragePreview) S.updateFunctionCoveragePreview();
  if (S && !S.exportStaffingConfig) {
    S.exportStaffingConfig = function () {
      if (S.readFunctionBandsFromDom) S.readFunctionBandsFromDom();
      var fc = S.ensureFunctionCoverage ? S.ensureFunctionCoverage() : (S.state && S.state.functionCoverage) || {};
      var payload = {
        app: "scheduler-pre-v2",
        kind: "staffing",
        version: 5,
        exportedAt: S.dj ? S.dj().toISOString() : new Date().toISOString(),
        config: {
          ftM: S.state.ftM, ftF: S.state.ftF, ptM: S.state.ptM, ptF: S.state.ptF,
          ltsoM: S.state.ltsoM, ltsoF: S.state.ltsoF, stsoM: S.state.stsoM, stsoF: S.state.stsoF,
          functionCoverage: fc
        }
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      if (S.saveBlob) {
        S.saveBlob(blob, (S.exportFileName && S.exportFileName("Staffing", ".json")) || "staffing.json");
      } else {
        var a = document.createElement("a");
        var url = URL.createObjectURL(blob);
        a.href = url; a.download = "staffing-config.json";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      if (S.updateStatus) S.updateStatus("Saved staffing + function coverage (BAG+DFO pools).");
    };
  }
  let save = document.getElementById("btn-save-staffing");
  if (save && !save._bound) {
    save._bound = true;
    save.addEventListener("click", function () {
      if (S.exportStaffingConfig) S.exportStaffingConfig();
    });
  }
}
