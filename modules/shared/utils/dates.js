/** Dates — Luxon only. */
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
  return DT.now().startOf("day");
}

export function toDateInputValue(d) {
  var dt = parseStartDate(d);
  return dt.toFormat("yyyy-MM-dd");
}

/** Compat for classic S.dj().startOf().format() callers. */
export function dj(val) {
  var dt = val == null || val === "" ? DateTime().now() : parseStartDate(val);
  return {
    startOf: function () { return dj(dt.toISODate()); },
    format: function (fmt) {
      var map = { "YYYY-MM-DD": "yyyy-MM-dd", "YYYY": "yyyy", "MM": "MM", "DD": "dd" };
      return dt.toFormat(map[fmt] || fmt);
    },
    toISODate: function () { return dt.toISODate(); },
    toJSDate: function () { return dt.toJSDate(); },
    add: function (n, unit) {
      var obj = {};
      obj[unit === "day" ? "days" : unit] = n;
      return dj(dt.plus(obj).toISODate());
    },
    day: function () { return dt.weekday % 7; }
  };
}
