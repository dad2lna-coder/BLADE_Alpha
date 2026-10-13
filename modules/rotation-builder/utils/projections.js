/** Passenger projections and the staff list for one sheet. */
import { rb } from "../stores/rotationStore.js";
import { dkey, normLoc } from "./time.js";
import { findHeaderRow } from "./roster.js";
import { presentAt, sheetWindow, buildSeats } from "./engine.js";

/* ============================================================
   Section 2b: passenger projections → lane demand
   ============================================================ */

/* Projection files name checkpoints bare ("A21"), the rest of the tool
   uses canonical IDs ("CKPT-A21"). Accept either. */
export function normProjLoc(raw, cfg){
  if(raw == null) return "";
  const s = String(raw).trim().toUpperCase();
  const direct = normLoc(s, cfg);
  if(/^CKPT-/.test(direct)) return direct;
  const m = s.match(/^([A-E])[\s\-_]*0?(\d{1,3})$/);
  if(m) return "CKPT-" + m[1] + String(+m[2]).padStart(2, "0");
  return direct;
}

export function projHour(v){
  if(v == null) return null;
  if(v instanceof Date) return v.getHours();
  if(typeof v === "number") return v < 1 ? Math.round(v * 24) : Math.floor(v);
  const m = String(v).trim().match(/^(\d{1,2})/);
  return m ? +m[1] : null;
}

/**
 * Parse a projections workbook into
 *   { "CKPT-A21|2026-08-20": { 3:{std,pre}, 4:{std,pre}, … } }
 * Metric names are matched loosely so "Standard Projection",
 * "Std Projection" and "STANDARD" all land in the same bucket.
 */
export function ingestProjections(ab, cfg){
  const P = cfg.proj, cm = P.colmap;
  const wb = globalThis.XLSX.read(ab, { type:"array", cellDates:true, cellText:false });
  const out = { data:{}, rows:0, locs:{}, dates:{}, metrics:{}, unmatched:{} };
  let rows = null, hdrIdx = 0;

  for(const nm of wb.SheetNames){
    const r = globalThis.XLSX.utils.sheet_to_json(wb.Sheets[nm], { header:1, raw:true, defval:null, blankrows:false });
    if(!r.length) continue;
    const h = findHeaderRow(r, cm);
    if(h.hits >= 4){ rows = r; hdrIdx = h.idx; break; }
    if(!rows){ rows = r; hdrIdx = Math.max(0, h.idx); }
  }
  if(!rows) throw new Error("No readable worksheet in that projections file.");

  const hdr = (rows[hdrIdx] || []).map(c => String(c == null ? "" : c).trim().toLowerCase());
  const col = {};
  for(const k in cm){
    const want = String(cm[k]).trim().toLowerCase();
    let i = hdr.indexOf(want);
    if(i < 0) i = hdr.findIndex(c => c && c.replace(/[\s_]/g,"") === want.replace(/[\s_]/g,""));
    col[k] = i;
  }
  const missing = ["ckpt","value","hour"].filter(k => col[k] < 0).map(k => cm[k]);
  if(missing.length) throw new Error("Projections file is missing column(s): " + missing.join(", ") +
    ". Set the names under Configuration → Passenger Projections.");

  const stdRx = new RegExp(P.stdKey.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"), "i");
  const preRx = new RegExp(P.preKey.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"), "i");

  for(let i = hdrIdx + 1; i < rows.length; i++){
    const r = rows[i]; if(!r || !r.length) continue;
    const lo = normProjLoc(r[col.ckpt], cfg);
    if(!/^CKPT-/.test(lo)) continue;
    const hr = projHour(r[col.hour]);
    if(hr == null) continue;
    const val = Number(r[col.value]);
    if(!isFinite(val)) continue;
    const dk = col.date >= 0 ? dkey(r[col.date]) : "";
    const metric = col.metric >= 0 ? String(r[col.metric] || "").trim() : "";

    const key = lo + "|" + dk;
    const slot = (out.data[key] = out.data[key] || {});
    const cell = (slot[hr] = slot[hr] || { std:0, pre:0 });
    if(preRx.test(metric)) cell.pre += val;
    else if(stdRx.test(metric) || !metric) cell.std += val;
    else { out.unmatched[metric] = (out.unmatched[metric] || 0) + 1; cell.std += val; }

    out.rows++;
    out.locs[lo] = (out.locs[lo] || 0) + 1;
    if(dk) out.dates[dk] = (out.dates[dk] || 0) + 1;
    if(metric) out.metrics[metric] = (out.metrics[metric] || 0) + 1;
  }
  if(!out.rows) throw new Error("No usable projection rows found — check the Checkpoint column.");
  return out;
}

/* Lanes needed for one hour's passenger count. */
export function lanesFor(cell, cfg){
  const P = cfg.proj;
  const std = (cell && cell.std) || 0, pre = (cell && cell.pre) || 0;
  const f = P.peakFactor || 1;
  let need;
  if(P.mode === "combined")      need = Math.ceil(((std + pre) * f) / Math.max(1, P.paxPerLane));
  else if(P.mode === "separate") need = Math.ceil((std * f) / Math.max(1, P.paxPerLane)) +
                                        Math.ceil((pre * f) / Math.max(1, P.prePerLane));
  else                           need = Math.ceil((std * f) / Math.max(1, P.paxPerLane));
  return { need, std, pre, pax: P.mode === "standard" ? std : std + pre };
}

/* How many lanes a given headcount can actually run. */
export function staffableLanes(n, cfg){
  const P = cfg.proj;
  const a = Math.max(1, P.firstLaneStaff || 5), b = Math.max(1, P.extraLaneStaff || 3);
  if(n < a) return 0;
  return 1 + Math.floor((n - a) / b);
}

/**
 * Per-column lane demand for the sheet on screen.
 * Returns one entry per time column, plus an hour-level roll-up.
 */
export function laneDemand(sh, cfg, projStore){
  const key = sh.locId + "|" + (sh.date || "");
  const table = (projStore && (projStore[key] || projStore[sh.locId + "|"])) || null;
  const slot = cfg.rules.slot;
  const openLanes = new Set(sh.seats.filter(s => s.laneN).map(s => s.laneN));
  const physical = (cfg.locations[sh.locId].mods || []).reduce((n, m) => n + m.length, 0);

  const perCol = sh.cols.map((t, ci) => {
    const hr = Math.floor((t % 1440) / 60);
    const cell = table ? table[hr] : null;
    const L = lanesFor(cell, cfg);
    const onFloor = sh.people.filter(p =>
      presentAt(p, t, slot) === "on" && (p.breaks || []).indexOf(ci) < 0).length;
    const need = table ? Math.max(cfg.proj.minLanes || 0, Math.min(L.need, physical)) : null;
    return { ci, t, hr, pax: L.pax, std: L.std, pre: L.pre,
             need, uncapped: table ? L.need : null,
             open: openLanes.size, staffable: staffableLanes(onFloor, cfg),
             onFloor, physical };
  });

  const hours = {};
  perCol.forEach(c => {
    const h = hours[c.hr] = hours[c.hr] || { hr:c.hr, pax:c.pax, need:c.need, uncapped:c.uncapped,
                                             open:c.open, staffable:c.staffable, physical:c.physical,
                                             from:c.t, to:c.t + slot };
    h.to = c.t + slot;
    h.staffable = Math.min(h.staffable, c.staffable);
    h.onFloor = Math.min(h.onFloor == null ? c.onFloor : h.onFloor, c.onFloor);
  });
  return { perCol, hours: Object.values(hours).sort((a,b) => a.from - b.from), has: !!table, key };
}

/**
 * Build the working staff list for one sheet: everyone whose row window
 * overlaps the sheet window at this location on this date.
 */
export function staffFor(roster, loc, date, w0, w1, cfg, adj, shift){
  const out = [];
  const seen = {};
  /* Strict shift matching: an AM sheet shows AM officers only, a PM sheet PM
     only. Without this an AM officer working past 11:00 lands on the PM sheet
     just because the clock overlaps. Rows with a blank Shift are always kept. */
  const want = String(shift || "").toUpperCase();
  for(const r of roster){
    if(r.lo !== loc) continue;
    if(date && r.d && r.d !== date) continue;
    if(cfg.rules.strictShift !== false && want && r.sh && r.sh !== want) continue;
    const s = Math.max(r.s, w0), e = Math.min(r.e, w1);
    if(e - s < cfg.rules.slot) continue;

    const a = adj && adj[r.k] ? adj[r.k] : null;
    if(a && a.out) continue;

    /* absence windows (null = whole row window) */
    const abs = [];
    for(const w of r.ab) abs.push(w === null ? [r.s, r.e] : w);
    if(a && a.absent) for(const w of a.absent) abs.push(w);

    const trn = [];
    for(const w of r.tr) trn.push(w === null ? [r.s, r.e] : w);
    if(a && a.train) for(const w of a.train) trn.push(w);

    /* fully absent across the whole visible window? drop from the sheet */
    let covered = true;
    for(let t = s; t < e; t += cfg.rules.slot){
      let hit = false;
      for(const w of abs) if(t >= w[0] && t < w[1]) { hit = true; break; }
      if(!hit){ covered = false; break; }
    }
    if(covered && abs.length) continue;

    const key = r.k + "|" + r.s + "|" + r.e;
    if(seen[key]) continue;
    seen[key] = 1;

    const rest = (cfg.restrictions && cfg.restrictions[r.k]) || (a && a.restrict ? { allow:a.restrict } : null);

    out.push({
      k: r.k, n: r.n, ti: r.ti, po: r.po, sex: r.x, quals: r.q,
      s, e, rawS: r.s, rawE: r.e,
      abs, trn, notes: r.nt.slice(),
      restrict: rest && rest.allow && rest.allow.length ? rest.allow.slice() : null,
      pinned: false, mod: null, seat: null,
      preferMod: null,
      shift: r.sh || ""
    });
  }
      /* rank order: TSO -> essential LTSO -> other LTSO, then surname */
  let essentialQuals = [];
  if (typeof document !== "undefined") {
  try {
    const gv = id => { const e = document.getElementById(id); return e ? e.value : ""; };
    const shiftVal = gv("iShift") || "AM";
    const win = sheetWindow(cfg, cfg.locations[loc], shiftVal, gv("iStart"), gv("iEnd"));
    const activeLanes = rb.lanes;
    const seats = buildSeats(cfg, loc, cfg.locations[loc], shiftVal, win, activeLanes);
    
    const reqQuals = new Set();
    for (const seat of seats) {
      const r = cfg.qualMap && cfg.qualMap[seat.fam];
      if (r) for (const q of r) reqQuals.add(q);
      if (seat.ct && cfg.ctQual) reqQuals.add(cfg.ctQual);
    }

    const tsoQuals = new Set(
      out.filter(p => !p.ti.toUpperCase().startsWith("LTSO") && !p.ti.toUpperCase().startsWith("STSO"))
         .flatMap(p => (p.quals || "").split(""))
    );
    essentialQuals = [...reqQuals].filter(q => !tsoQuals.has(q));
  } catch (err) {
    console.warn("Seeding qualification order fallback failed", err);
  }
  }

  const rankOf = p => {
    const t = p.ti.toUpperCase();
    if (!t.startsWith("LTSO") && !t.startsWith("STSO")) return 1; // TSO = highest priority
    if (essentialQuals.some(q => (p.quals || "").includes(q))) return 2; // Essential LTSO
    return 3; // Non-essential LTSO
  };

  out.sort((a,b) => rankOf(a) - rankOf(b) || a.n.localeCompare(b.n));
  return out;
}
