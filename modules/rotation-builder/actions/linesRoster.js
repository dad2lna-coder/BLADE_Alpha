/** One-way load: generated lines become the rotation roster. Reads scheduler only when called. */
import { rb, DB } from "../stores/rotationStore.js";
import { $, esc, toast } from "../utils/dom.js";
import { linesToRoster } from "../utils/linesToRoster.js";

function rosterLabel(meta) {
  return (meta && (meta.source || meta.file)) || "";
}

export function paintRosterInfo() {
  const info = $("rosterInfo");
  if (!info || !rb.meta) return;
  const d = rb.meta.dates || [];
  const locs = rb.meta.locs ? Object.keys(rb.meta.locs).length : 0;
  const label = rosterLabel(rb.meta);
  info.innerHTML = `<b>${rb.roster.length}</b> checkpoint rows` +
    (locs ? ` · ${locs} locations` : "") +
    (d.length ? `<br>${d[0]} → ${d[d.length - 1]}` : "") +
    (label ? `<br>${esc(label)}` : "");
}

/**
 * Replace rb.roster with PAX work-day rows from the current generated lines.
 * Does not write scheduler state, and does not append to an existing roster.
 */
export function useGeneratedLines(scheduler) {
  const S = scheduler || (typeof window !== "undefined" ? window.Scheduler : null);
  try {
    const lines = S && S.state ? S.state.lines : null;
    const locEl = $("iLoc");
    const locId = locEl ? locEl.value : "";
    const seamAM = rb.cfg && rb.cfg.rules ? rb.cfg.rules.seamAM : "";
    const { rows, dates } = linesToRoster({
      lines,
      schedule: S && S.state ? S.state.schedule : null,
      rotationDuty: (id, offset) => (S && S.getRotationDuty ? S.getRotationDuty(id, offset) : null),
      startDate: S && S.state ? S.state.startDate : null,
      weekCount: S && S.state ? S.state.weekCount : 0,
      segmentsFor: (line, dow) => (S && S.getEffectiveShiftSegments ? S.getEffectiveShiftSegments(line.shiftId, dow) : null),
      roleOf: (line) => (S && S.lineRoleKey ? S.lineRoleKey(line) : "TSO"),
      locId,
      seamAM
    });
    rb.roster = rows;
    rb.meta = {
      file: "BLADE lines",
      source: "BLADE lines",
      rows: rows.length,
      when: new Date().toLocaleString(),
      dates,
      unknown: {}
    };
    DB.set("roster", rb.roster);
    DB.set("rosterMeta", rb.meta);
    paintRosterInfo();
    const dateEl = $("iDate");
    if (dateEl && dates.length && dates.indexOf(dateEl.value) < 0) dateEl.value = dates[0];
    toast("Using generated lines — " + rows.length + " rows.", "ok");
  } catch (e) {
    toast(e && e.message ? e.message : String(e), "err");
  }
}
