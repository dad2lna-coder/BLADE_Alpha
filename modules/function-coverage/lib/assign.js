// Shift-driven function assignment.
// Requirements are (role, shiftId, min, max) counts of generated lines —
// not 30-minute slot headcounts. Coverage slots are derived afterwards.
import { lineRoleKey } from "./duty.js";
import { lineStartMin, isAmSide, computeShiftAnchors } from "./duty.js";
import { ensureFunctionCoverage, capFunctionPoolsToFte, buildCertifiedPools } from "./pools.js";
import {
  getShiftRequirement, getEligibleLinesForShift, openingAndClosingShifts,
  lineOnShift
} from "./shifts.js";
