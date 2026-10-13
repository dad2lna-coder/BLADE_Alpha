/** Roster ingestion and remarks parsing. */
import { t2m, dkey, normLoc } from "./time.js";

/* ============================================================
   Section 2: roster ingestion + remarks parsing
   ============================================================ */

const RX_RANGE = /(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})/g;

export function grabRanges(s){
  const out = []; RX_RANGE.lastIndex = 0; let m;
  while((m = RX_RANGE.exec(s))){
    const a = (+m[1])*60 + (+m[2]);
    let b = (+m[3])*60 + (+m[4]);
    if(b <= a) b += 1440;                    /* window crosses midnight */
    out.push([a,b]);
  }
  return out;
}

/**
 * Interpret the Remarks cell.
 * Returns { drop, absent:[[a,b]…], train:[[a,b]…], notes:[…] }
 *   drop  – row is a traded-away shift and must be excluded entirely
 *   absent– leave / call-off windows (blank = whole row window)
 *   train – training windows (officer is off the floor, own code)
 * SCHED OT, ALSO … and SECOND SHIFT are informational: the row's own
 * Start/End is authoritative, and other placements have their own rows.
 */
export function parseRemarks(raw){
  const res = { drop:false, absent:[], train:[], notes:[] };
  if(!raw) return res;
  const segs = String(raw).split(";").map(s => s.trim()).filter(Boolean);
  for(const seg of segs){
    const u = seg.toUpperCase();
    if(/\(STO\)/.test(u) || /^SHIFT\s+TRADED\s+AWAY/.test(u)){ res.drop = true; res.notes.push("Shift traded away"); continue; }
    if(/\(STW\)/.test(u) || /^SHIFT\s+TRADE\b/.test(u)){ res.notes.push("Shift trade (working)"); continue; }
    if(/^TRAINING\b/.test(u) || /\bAT\s+TRAINING\b/.test(u)){
      const r = grabRanges(seg);
      if(/^TRAINING\b/.test(u)){ r.length ? res.train.push(...r) : res.train.push(null); res.notes.push("Training"); }
      else res.notes.push("Also at training");
      continue;
    }
    if(/^LEAVE\s*:/.test(u)){
      const sub = (u.match(/^LEAVE\s*:\s*([A-Z\-\s]+?)(?:\s+\d{1,2}:\d{2}|$)/) || [,"LEAVE"])[1].trim();
      const r = grabRanges(seg);
      r.length ? res.absent.push(...r) : res.absent.push(null);   /* null = whole shift */
      res.notes.push("Leave: " + sub.toLowerCase());
      continue;
    }
    if(/^CALL\s*OFF/.test(u)){
      const r = grabRanges(seg);
      r.length ? res.absent.push(...r) : res.absent.push(null);
      res.notes.push("Call off");
      continue;
    }
    if(/^SCHED(ULED)?\s*OT/.test(u)){ res.notes.push("Scheduled OT"); continue; }
    if(/^SECOND\s+SHIFT/.test(u)){ res.notes.push("Second shift"); continue; }
    if(/^ALSO\b/.test(u)){ res.notes.push("Also elsewhere"); continue; }
    res.notes.push(seg);
  }
  return res;
}

/* ---- header discovery ------------------------------------ */
export function findHeaderRow(rows, want){
  const targets = Object.values(want).map(v => String(v).toLowerCase().trim());
  let best = -1, bestHits = 0;
  for(let i=0; i<Math.min(rows.length, 15); i++){
    const cells = (rows[i]||[]).map(c => String(c==null?"":c).toLowerCase().trim());
    let hits = 0;
    for(const t of targets) if(t && cells.includes(t)) hits++;
    if(hits > bestHits){ bestHits = hits; best = i; }
  }
  return { idx: best, hits: bestHits };
}

/**
 * Parse an uploaded workbook into normalised roster rows.
 * Only the mapped columns are read; any extra columns are ignored.
 */
export function ingestWorkbook(ab, cfg){
  const wb = globalThis.XLSX.read(ab, { type:"array", cellDates:true, cellText:false });
  const out = { rows:[], sheet:"", headers:[], missing:[], soft:[], unknownQuals:{}, locsSeen:{}, dates:{}, noId:false };
  let rows = null;

  for(const nm of wb.SheetNames){
    const r = globalThis.XLSX.utils.sheet_to_json(wb.Sheets[nm], { header:1, raw:true, defval:null, blankrows:false });
    if(!r.length) continue;
    const h = findHeaderRow(r, cfg.colmap);
    if(h.hits >= 4){ rows = r; out.sheet = nm; out.hdrIdx = h.idx; break; }
    if(!rows){ rows = r; out.sheet = nm; out.hdrIdx = h.idx < 0 ? 0 : h.idx; }
  }
  if(!rows) throw new Error("No readable worksheet found in that file.");

  const hdr = (rows[out.hdrIdx] || []).map(c => String(c==null?"":c).trim());
  out.headers = hdr.slice();
  const low = hdr.map(s => s.toLowerCase());
  const col = {};
  for(const key in cfg.colmap){
    const want = String(cfg.colmap[key]).toLowerCase().trim();
    let i = low.indexOf(want);
    if(i < 0) i = low.findIndex(c => c && (c.replace(/[\s_]/g,"") === want.replace(/[\s_]/g,"")));
    col[key] = i;
    if(i < 0 && ["name","loc","start","end"].includes(key)) out.missing.push(cfg.colmap[key]);
    else if(i < 0) out.soft.push(cfg.colmap[key]);
  }
  if(out.missing.length) throw new Error("Missing required column(s): " + out.missing.join(", ") + ". Check Column Mapping in Configuration.");

  out.noId = col.id < 0;

  const known = new Set(cfg.quals.map(q => String(q).toUpperCase()));
  const get = (r,k) => col[k] >= 0 ? r[col[k]] : null;

  for(let i = out.hdrIdx + 1; i < rows.length; i++){
    const r = rows[i]; if(!r || !r.length) continue;
    const nm = get(r,"name"); if(!nm) continue;

    const locRaw = get(r,"loc");
    const lo = normLoc(locRaw, cfg);
    if(!/^CKPT-/.test(lo)) continue;                      /* checkpoints only — BAG etc. dropped */

    const s = t2m(get(r,"start")), e0 = t2m(get(r,"end"));
    if(s === null || e0 === null) continue;
    const e = e0 <= s ? e0 + 1440 : e0;

    const q = String(get(r,"quals") || "").toUpperCase().replace(/^DUAL[\s\-]*/,"").replace(/\s+/g,"");
    const qs = [];
    for(const ch of q){
      if(known.has(ch)) { if(!qs.includes(ch)) qs.push(ch); }
      else if(/[A-Z0-9]/.test(ch)) out.unknownQuals[ch] = (out.unknownQuals[ch]||0)+1;
    }

    const rem = parseRemarks(get(r,"remarks"));
    if(rem.drop) continue;                                 /* shift traded away */

    const d = dkey(get(r,"date"));
    const row = {
      k: String(get(r,"id") || nm).trim(),
      n: String(nm).trim(),
      ti: String(get(r,"title") || "").trim(),
      po: String(get(r,"posn") || "").trim(),
      lo, d,
      sh: String(get(r,"shift") || "").trim().toUpperCase(),
      s, e,
      x: String(get(r,"sex") || "").trim().toUpperCase().charAt(0),
      q: qs.join(""),
      ab: rem.absent, tr: rem.train, nt: rem.notes
    };
    out.rows.push(row);
    out.locsSeen[lo] = (out.locsSeen[lo]||0)+1;
    if(d) out.dates[d] = (out.dates[d]||0)+1;
  }
  if(!out.rows.length) throw new Error("No checkpoint rows found. Verify the Location column and that the file contains CKPT- entries.");
  return out;
}
