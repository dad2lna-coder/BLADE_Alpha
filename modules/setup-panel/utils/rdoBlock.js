/** Consecutive RDO block + optional pin + flex days. No legacy fallback. */

function sortDays(days) {
  return days.slice().sort(function (a, b) { return a - b; });
}

export function normalizeRdoBlock(raw) {
  var v = raw;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    if (raw.rdoBlock == null || raw.rdoBlock === "") return null;
    v = raw.rdoBlock;
  }
  var n = Number(v);
  if (n === 2 || n === 3 || n === 4) return n;
  return null;
}

export function normalizeRdoPins(raw) {
  var list = null;
  if (Array.isArray(raw)) list = raw;
  else if (raw && typeof raw === "object") {
    if (Array.isArray(raw.rdoPins)) list = raw.rdoPins;
    else if (raw.rdoPin != null && raw.rdoPin !== "") list = [raw.rdoPin];
    else list = [];
  }
  if (!list) return [];
  var out = [];
  list.forEach(function (d) {
    var n = Number(d);
    if (Number.isInteger(n) && n >= 0 && n <= 6 && out.indexOf(n) < 0) out.push(n);
  });
  return out.sort(function (a, b) { return a - b; });
}

function pinRequired(raw) {
  if (!raw || typeof raw !== "object") return false;
  return raw.rdoPinRequired === true || raw.rdoPinRequired === 1 || raw.rdoPinRequired === "true" || raw.rdoPinRequired === "1";
}

function blocksAvoiding(avoid, length) {
  var blocks = [];
  for (var start = 0; start < 7; start++) {
    var block = [];
    var hits = false;
    for (var i = 0; i < length; i++) {
      var d = (start + i) % 7;
      if (avoid.indexOf(d) >= 0) { hits = true; break; }
      block.push(d);
    }
    if (!hits) blocks.push(block);
  }
  return blocks;
}

/** Flex days rotate through the open days. They do not start at Sunday. */
function pickFlex(taken, count, seed) {
  var free = [];
  for (var d = 0; d < 7; d++) if (taken.indexOf(d) < 0) free.push(d);
  var out = [];
  if (!free.length || count <= 0) return out;
  var n = free.length;
  var step = n > 1 ? Math.max(1, Math.floor(n / Math.max(count, 1))) : 1;
  var idx = Math.abs(seed) % n;
  var guard = 0;
  while (out.length < count && out.length < n && guard < n * 3) {
    var pick = free[idx % n];
    if (out.indexOf(pick) < 0) out.push(pick);
    idx += step;
    guard++;
  }
  return out;
}

/**
 * Place RDOs when a block size is set.
 * Returns null when this shift is not in the block model.
 * Pin days are always included and are never used as block days.
 */
export function assignBlockRdos(shift, rdoCount, seed) {
  var blockSize = normalizeRdoBlock(shift);
  if (!blockSize) return null;
  var pins = normalizeRdoPins(shift);
  var s = Number(seed);
  if (!Number.isFinite(s)) s = 0;
  s = Math.abs(Math.floor(s));
  var count = Math.max(1, Math.min(6, rdoCount || 2));
  if (pinRequired(shift) && !pins.length) {
    return {
      ok: false,
      error: "pin is required but no day is set",
      rdoDays: [],
      hard: false,
      mode: "block",
      block: [],
      flex: [],
      pins: []
    };
  }
  var windows = blocksAvoiding(pins, blockSize);
  if (!windows.length) {
    return {
      ok: false,
      error: "a " + blockSize + "-day block does not fit without using the pin",
      rdoDays: [],
      hard: false,
      mode: "block",
      block: [],
      flex: [],
      pins: pins
    };
  }
  var block = windows[s % windows.length].slice();
  var days = pins.slice();
  block.forEach(function (d) {
    if (days.indexOf(d) < 0) days.push(d);
  });
  var flexNeed = count - days.length;
  var flex = [];
  if (flexNeed > 0) flex = pickFlex(days, flexNeed, s + 3);
  flex.forEach(function (d) {
    if (days.indexOf(d) < 0) days.push(d);
  });
  return {
    ok: true,
    rdoDays: sortDays(days),
    hard: false,
    mode: "block",
    block: sortDays(block),
    flex: sortDays(flex),
    pins: pins.slice(),
    exceeds: days.length > count
  };
}

/** Issues for a locked line whose pin is no longer in its RDOs. Others are kept. */
export function lockedRdoNotes(S, lines) {
  var issues = [];
  var kept = 0;
  (lines || []).forEach(function (l) {
    if (!l) return;
    var sh = S && S.getShift ? S.getShift(l.shiftId) : null;
    if (!sh || !normalizeRdoBlock(sh)) return;
    var pins = normalizeRdoPins(sh);
    var have = (l.rdoDays || []).map(Number);
    var missing = pins.filter(function (d) { return have.indexOf(d) < 0; });
    if (!missing.length) { kept++; return; }
    var count = 2;
    if (S.rdoCountForShift) count = S.rdoCountForShift(sh, l.empClass || "FT");
    else if (S.targetWorkDays) count = Math.max(1, 7 - S.targetWorkDays(sh.id, l.empClass || "FT"));
    var seed = Math.abs(Number(l.id) || 0) % 7;
    var placed = assignBlockRdos(sh, count, seed);
    var label = l.lineCode || l.id || "line";
    if (placed && placed.ok && placed.rdoDays.length) {
      l.rdoDays = placed.rdoDays;
      l.rdoHard = false;
      issues.push(label + ": locked RDOs refreshed to include the pin.");
    } else {
      issues.push(label + ": locked line is missing the pin and was not given a legacy pattern.");
    }
  });
  if (kept) issues.push(kept + " locked line(s) kept their RDOs.");
  return issues;
}
