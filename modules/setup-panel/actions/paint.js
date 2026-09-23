/** Paint function coverage bands + extra positions. Staffing export lives in utils/fte.js. */
export function paintFunctionCoverage(S) {
  if (S.ensureFunctionCoverage) S.ensureFunctionCoverage();
  if (S.fillFunctionCoverageForm) {
    try { S.fillFunctionCoverageForm(); } catch (e) {}
  }
  if (S.renderFunctionBandsTable) S.renderFunctionBandsTable();
  if (S.updateFunctionCoveragePreview) S.updateFunctionCoveragePreview();
  if (S.renderExtraPositions) {
    try { S.renderExtraPositions(); } catch (e) {}
  }
}
