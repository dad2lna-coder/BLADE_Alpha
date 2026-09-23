/** Dates — Luxon only. weekdaySun0 matches old dayjs/JS: 0=Sun. */
function DateTime() {
  if (!window.luxon || !window.luxon.DateTime) throw new Error("luxon is not loaded");
  return window.luxon.DateTime;
}

export function now() {
  return DateTime().now();
}

export function parseStartDate(val) {
  var DT = DateTime();
  if (!val) return DT.now().startOf("day");
  if (typeof val === "string") {
    var iso = DT.fromISO(val.slice(0, 10));
    if (iso.isValid) return iso.startOf("day");
  }
  if (val && typeof val.toJSDate === "function") return DT.fromJSDate(val.toJSDate()).startOf("day");
  if (val instanceof Date) return DT.fromJSDate(val).startOf("day");
  if (val && val.isValid && val.toISODate) return val.startOf ? val.startOf("day") : val;
  return DT.now().startOf("day");
}

export function toDateInputValue(d) {
  return parseStartDate(d).toFormat("yyyy-MM-dd");
}

export function addDays(d, n) {
  return parseStartDate(d).plus({ days: n });
}

export function weekdaySun0(d) {
  return parseStartDate(d).weekday % 7;
}

export function dj(val) {
  var dt = parseStartDate(val);
  return {
    startOf: function () { return dj(dt.toISODate()); },
    format: function (fmt) {
      var map = { "YYYY-MM-DD": "yyyy-MM-dd" };
      return dt.toFormat(map[fmt] || fmt);
    },
    add: function (n) { return dj(addDays(dt, n).toISODate()); },
    day: function () { return weekdaySun0(dt); },
    toISODate: function () { return dt.toISODate(); },
    toJSDate: function () { return dt.toJSDate(); }
  };
}
