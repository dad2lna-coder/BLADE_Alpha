import { $, setInputValue } from "./dom.js";
import { timeToMin, minToTime, isValidTimeText, safeNumber } from "./time.js";
import { dj, parseStartDate, toDateInputValue } from "./dates.js";
import { updateStatus } from "./status.js";

export {
  $, setInputValue,
  timeToMin, minToTime, isValidTimeText, safeNumber,
  dj, parseStartDate, toDateInputValue,
  updateStatus
};

export function attachSharedUtils(S) {
  if (!S) return;
  S.$ = $;
  S.setInputValue = setInputValue;
  S.timeToMin = timeToMin;
  S.minToTime = minToTime;
  S.isValidTimeText = isValidTimeText;
  S.safeNumber = safeNumber;
  S.dj = dj;
  S.parseStartDate = parseStartDate;
  S.toDateInputValue = toDateInputValue;
  S.updateStatus = updateStatus;
  S.state = S.state || {
    lines: [],
    schedule: {},
    extraPositions: [],
    issues: [],
    shifts: [],
    functionCoverage: { mode: "none" }
  };
  S.shiftSeq = S.shiftSeq || 1;
}

export function initSharedUtils(scheduler) {
  attachSharedUtils(scheduler || window.Scheduler);
}
