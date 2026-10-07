/** Consecutive RDO block. A pin is always off and is not required to sit inside the block. */

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

/** Circular windows of `length` that contain every pin. Used when the pin cannot sit outside the block. */
function blocksContaining(pins, length) {
  var blocks = [];
  if (pins.length > length) return blocks;
  for (var start = 0; start < 7; start++) {
    var block = [];
    var missing = false;
    for (var i = 0; i < length; i++) block.push((start + i) % 7);
    for (var p = 0; p < pins.length; p++) {
      if (block.indexOf(pins[p]) < 0) { missing = true; break; }
    }
    if (!missing) blocks.push(block);
  }
  return blocks;
}

/** Circular windows of `length`. */
function allBlocks(length) {
  var blocks = [];
  for (var start = 0; start < 7; start++) {
    var block = [];
    for (var i = 0; i < length; i++) block.push((start + i) % 7);
    blocks.push(block);
  }
  return blocks;
}

function unionCount(block, pins) {
  var n = block.length;
  for (var i = 0; i < pins.length; i++) {
    if (block.indexOf(pins[i]) < 0) n++;
  }
  return n;
}

/**
 * Windows for this block.
 * No pin: every consecutive window. Flex fills the rest.
 * Pin with room (4×10 block 2): the pair stays off the pin, so Tue + Fri–Sat is legal.
 * Pin with no room (5×8 block 2): the pair has to include the pin.
 */
function windowsFor(pins, blockSize, count) {
  if (!pins.length) return allBlocks(blockSize);
  var all = allBlocks(blockSize);
  var disjoint = [];
  var covering = [];
  for (var i = 0; i < all.length; i++) {
    var w = all[i];
    if (unionCount(w, pins) > count) continue;
    var misses = true;
    var covers = true;
    for (var p = 0; p < pins.length; p++) {
      if (w.indexOf(pins[p]) < 0) covers = false;
      else misses = false;
    }
    if (misses) disjoint.push(w);
    else if (covers) covering.push(w);
  }
  if (disjoint.length) return disjoint;
  if (covering.length) return covering;
  return blocksContaining(pins, blockSize);
}

function withPins(block, pins) {
  var days = block.slice();
  for (var i = 0; i < pins.length; i++) {
    if (days.indexOf(pins[i]) < 0) days.push(pins[i]);
  }
  return days;
}

/** Flex days rotate through the open days. They do not start at Sunday. */
function pickFromList(free, count, seed) {
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

function pickFlex(taken, count, seed) {
  var free = [];
  for (var d = 0; d < 7; d++) if (taken.indexOf(d) < 0) free.push(d);
  return pickFromList(free, count, seed);
}

function dayKey(days) {
  return sortDays(days).join("-");
}

function nonPinDays(days, pins) {
  var out = [];
  for (var i = 0; i < days.length; i++) {
    if (pins.indexOf(days[i]) < 0) out.push(days[i]);
  }
  return out;
}

function sharesNonPin(days, pins, avoid) {
  var extra = nonPinDays(days, pins);
  for (var i = 0; i < extra.length; i++) {
    if (avoid.indexOf(extra[i]) >= 0) return true;
  }
  return false;
}

function protectPartnerDays(block, pins, windows, avoid) {
  var protect = [];
  var mine = nonPinDays(block, pins);
  var mineKey = dayKey(block);
  for (var i = 0; i < windows.length; i++) {
    var other = windows[i];
    if (dayKey(other) === mineKey) continue;
    if (sharesNonPin(other, pins, avoid) || sharesNonPin(other, pins, mine)) continue;
    var extra = nonPinDays(other, pins);
    for (var j = 0; j < extra.length; j++) {
      var d = extra[j];
      if (protect.indexOf(d) < 0 && block.indexOf(d) < 0 && avoid.indexOf(d) < 0) protect.push(d);
    }
  }
  return protect;
}

function pickExclusiveFlex(block, avoid, protect, count, seed) {
  var safe = [];
  var fallback = [];
  for (var d = 0; d < 7; d++) {
    if (block.indexOf(d) >= 0 || avoid.indexOf(d) >= 0) continue;
    if (protect.indexOf(d) >= 0) fallback.push(d);
    else safe.push(d);
  }
  var out = pickFromList(safe, count, seed);
  if (out.length < count) {
    var extra = pickFromList(fallback, count - out.length, seed + 5);
    for (var i = 0; i < extra.length; i++) out.push(extra[i]);
  }
  return out;
}

function readAvoid(opts) {
  if (!opts || !Array.isArray(opts.avoidDays)) return null;
  var avoid = [];
  opts.avoidDays.forEach(function (d) {
    var n = Number(d);
    if (Number.isInteger(n) && n >= 0 && n <= 6 && avoid.indexOf(n) < 0) avoid.push(n);
  });
  return avoid;
}

/**
 * Place RDOs when a block size is set.
 * Returns null when this shift is not in the block model.
 * The pin is always off. On a 4×10 the consecutive pair does not have to include it
 * (Tue + Fri–Sat). On a 5×8 the two RDOs are the pair, so the pin sits inside it.
 * opts.avoidDays (STSO only): non-pin days must miss those days. Seed still picks the
 * window; a shared non-pin day loses to the next legal one.
 */
export function assignBlockRdos(shift, rdoCount, seed, opts) {
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
  var windows = windowsFor(pins, blockSize, count);
  if (!windows.length) {
    return {
      ok: false,
      error: "checked days do not fit in a " + blockSize + "-day block",
      rdoDays: [],
      hard: false,
      mode: "block",
      block: [],
      flex: [],
      pins: pins
    };
  }
  var avoid = readAvoid(opts);
  var block;
  var flex = [];
  if (!avoid) {
    block = windows[s % windows.length].slice();
  } else {
    block = null;
    for (var i = 0; i < windows.length; i++) {
      var w = windows[(s + i) % windows.length];
      if (sharesNonPin(w, pins, avoid)) continue;
      var baseTry = withPins(w, pins);
      var needTry = count - baseTry.length;
      var picked = [];
      if (needTry > 0) {
        var protect = protectPartnerDays(w, pins, windows, avoid);
        picked = pickExclusiveFlex(baseTry, avoid, protect, needTry, s + 3);
        if (picked.length < needTry) continue;
      }
      block = w.slice();
      flex = picked;
      break;
    }
    if (!block) {
      return {
        ok: false,
        error: "no RDO window left without a shared non-pin day",
        rdoDays: [],
        hard: false,
        mode: "block",
        block: [],
        flex: [],
        pins: pins.slice()
      };
    }
  }
  var days = withPins(block, pins);
  if (!avoid && count - days.length > 0) flex = pickFlex(days, count - days.length, s + 3);
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

/** Callers may copy rdoDays only when this is true. Empty days pad to Fri+Sat. */
export function placedRdosOk(placed) {
  if (!placed || placed.ok === false) return false;
  return !!(placed.rdoDays && placed.rdoDays.length);
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
    if (placedRdosOk(placed)) {
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
