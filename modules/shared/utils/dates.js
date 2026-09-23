export function dj() {
  if (typeof dayjs !== "function") throw new Error("dayjs is not loaded");
  return dayjs.apply(null, arguments);
}

export function parseStartDate(val) {
  if (!val) return dj().startOf("day");
  if (typeof val === "string") return dj(val.slice(0, 10)).startOf("day");
  return dj(val).startOf("day");
}

export function toDateInputValue(d) {
  return dj(d).format("YYYY-MM-DD");
}
