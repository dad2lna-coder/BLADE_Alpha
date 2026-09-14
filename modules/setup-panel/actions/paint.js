/** Paint function coverage bands + bind save staffing */
export function paintFunctionCoverage(S) {
  if (S.ensureFunctionCoverage) S.ensureFunctionCoverage();
  if (S.fillFunctionCoverageForm) {
    try { S.fillFunctionCoverageForm(); } catch (e) {}
  }
  if (S.renderFunctionBandsTable) S.renderFunctionBandsTable();
  if (S.updateFunctionCoveragePreview) S.updateFunctionCoveragePreview();
  let save = document.getElementById("btn-save-staffing");
  if (save && !save._bound) {
    save._bound = true;
    save.addEventListener("click", function () {
      if (S.exportStaffingConfig) S.exportStaffingConfig();
    });
  }
}