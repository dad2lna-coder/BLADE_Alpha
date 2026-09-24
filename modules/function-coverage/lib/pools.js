let api = null;

import { normalizeRequirements, getShiftRequirement } from "./shifts.js";
import { migrateFunctionCoverageConfig } from "./migrate.js";

export function bindPoolsApi(scheduler) {
  api = scheduler;
}

// Local helper (classic equivalent, not exported)
function num0(v) { return Math.max(0, Math.floor(+v || 0)); }

// Exported: bag pool total from classic
export function bagPoolTotal(fc) {
  return num0(fc.poolStsoBagM) + num0(fc.poolStsoBagF) + num0(fc.poolLtsoBagM) + num0(fc.poolLtsoBagF) +
    num0(fc.poolTsoBagM) + num0(fc.poolTsoBagF);
}

// Exported: dfo pool total from classic
export function dfoPoolTotal(fc) {
  return num0(fc.poolStsoDfoM) + num0(fc.poolStsoDfoF) + num0(fc.poolLtsoDfoM) + num0(fc.poolLtsoDfoF) +
    num0(fc.poolTsoDfoM) + num0(fc.poolTsoDfoF);
}
