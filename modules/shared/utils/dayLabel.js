import { parseStartDate, addDays, weekdaySun0 } from "./dates.js";

export function dayLabel(S, offset) {
  var dt = addDays(parseStartDate(S.state && S.state.startDate), offset);
  var js = dt.toJSDate();
  var days = (S && S.DAYS) || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[weekdaySun0(dt)] + " " + (js.getMonth() + 1) + "/" + js.getDate();
}
