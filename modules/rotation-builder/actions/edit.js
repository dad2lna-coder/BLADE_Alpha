/** Per-officer edits, locks, and live validation. */
import { rb } from "../stores/rotationStore.js";
import { $, el, esc, toast, confirmBox } from "../utils/dom.js";
import { m2t } from "../utils/time.js";
import { staffFor } from "../utils/projections.js";
import { seatAllows } from "../utils/engine.js";
import { currentWindow, extraToPerson, generate, renderSheet } from "./generate.js";
import { openAdd } from "./config.js";

/* ============================================================
   Officer-level editing: swap the person on a row, or move them
   to a different modset. Both open a dropdown in place.
   ============================================================ */
export let PEDIT = null;

export function closePEdit(){
  if(!PEDIT) return;
  const { host, restore } = PEDIT;
  PEDIT = null;
  host.innerHTML = ""; restore();
}

/* Officers at this location, date and shift who are not already on the sheet. */
export function benchOfficers(){
  const sh = rb.sheet;
  if(!sh) return [];
  const win = currentWindow();
  const onSheet = {}; sh.people.forEach(p => onSheet[p.k] = 1);
  const all = staffFor(rb.roster, sh.locId, sh.date, win.first, win.last + rb.cfg.rules.slot,
                       rb.cfg, rb.adj, sh.shift);
  return all.filter(p => !onSheet[p.k]).sort((a, b) => a.n.localeCompare(b.n));
}

export function beginNameEdit(td){
  closePEdit(); if(EDITING) endEdit(true);
  const sh = rb.sheet, rk = td.dataset.rk;
  const p = sh.people.find(x => (x.k + "|" + x.s) === rk);
  if(!p) return;
  const html = td.innerHTML;

  const sel = document.createElement("select");
  sel.className = "namesel";
  const add = (v, label, group) => {
    const o = document.createElement("option");
    o.value = v; o.textContent = label;
    (group || sel).appendChild(o);
    return o;
  };
  add("__keep", p.n + "  (current)");

  const bench = benchOfficers();
  if(bench.length){
    const g = document.createElement("optgroup");
    g.label = "Swap in — not yet on this sheet";
    bench.forEach(b => add("k:" + b.k, `${b.n} · ${b.ti} · ${b.sex} · ${b.quals || "no quals"}`, g));
    sel.appendChild(g);
  }
  const g2 = document.createElement("optgroup"); g2.label = "Other";
  add("__manual", "Type a new officer…", g2);
  add("__remove", "Remove from this sheet", g2);
  sel.appendChild(g2);

  td.innerHTML = ""; td.appendChild(sel);
  PEDIT = { host: td, restore: () => { td.innerHTML = html; } };
  sel.focus();
  if(typeof sel.showPicker === "function"){ try{ sel.showPicker(); }catch(e){} }
  sel.onblur = () => closePEdit();
  sel.onkeydown = e => { if(e.key === "Escape") closePEdit(); };
  sel.onchange = () => {
    const v = sel.value;
    PEDIT = null;
    if(v === "__keep"){ td.innerHTML = html; return; }
    if(v === "__remove"){
      confirmBox("Remove officer",
        `Take <b>${esc(p.n)}</b> off this sheet? Their positions will be re-solved among everyone else.`,
        () => { removeOfficer(p); });
      td.innerHTML = html; return;
    }
    if(v === "__manual"){ td.innerHTML = html; openAdd("manual", p); return; }
    swapOfficer(p, v.slice(2));
  };
}

/* Replace the officer on a row, keeping that row's assignments as locks so
   the sheet keeps its shape — quals are re-checked and flagged, not blocked. */
export function swapOfficer(oldP, newKey){
  const sh = rb.sheet;
  const win = currentWindow();
  const cand = staffFor(rb.roster, sh.locId, sh.date, win.first, win.last + rb.cfg.rules.slot,
                        rb.cfg, rb.adj, sh.shift).find(x => x.k === newKey);
  if(!cand) return toast("That officer is no longer available.", "err");

  const oldRk = oldP.k + "|" + oldP.s;
  const row = (sh.grid[oldRk] || []).slice();

  rb.removed[oldP.k] = 1;
  rb.extra = rb.extra.filter(x => x.k !== oldP.k);
  if(oldP.mod != null) rb.modOverride[cand.k] = oldP.mod;

  rb.extra.push({ k:cand.k, n:cand.n, ti:cand.ti, sex:cand.sex, quals:cand.quals,
                 s:cand.rawS, e:cand.rawE, mod:oldP.mod, src:"swap" });

  /* carry the row's assignments onto the incoming officer */
  const person = extraToPerson(rb.extra[rb.extra.length - 1], win);
  const newRk = person.k + "|" + person.s;
  const carry = {};
  row.forEach((c, i) => { if(c && c.c && c.t !== "off") carry[i] = c.c; });
  delete rb.locks[oldRk];
  rb.locks[newRk] = carry;

  generate(false);
  toast(`${cand.n} replaced ${oldP.n} — assignments kept.`, "ok");
}

export function removeOfficer(p){
  rb.removed[p.k] = 1;
  rb.extra = rb.extra.filter(x => x.k !== p.k);
  delete rb.locks[p.k + "|" + p.s];
  generate(false);
  toast(`${p.n} removed from this sheet.`);
}

export function beginModEdit(td){
  closePEdit(); if(EDITING) endEdit(true);
  const sh = rb.sheet, rk = td.dataset.rk;
  const p = sh.people.find(x => (x.k + "|" + x.s) === rk);
  if(!p) return;
  const html = td.innerHTML;
  const mods = [...new Set(sh.seats.map(s => s.mod))].filter(m => m != null).sort((a, b) => a - b);

  const sel = document.createElement("select");
  sel.className = "modsel";
  mods.forEach(m => {
    const lanes = [...new Set(sh.seats.filter(s => s.mod === m && s.laneN).map(s => s.laneN))].sort((a,b)=>a-b);
    const o = document.createElement("option");
    o.value = String(m);
    o.textContent = `M${m} — Modset ${m}` + (lanes.length ? ` — lane${lanes.length>1?"s":""} ${lanes.join(" & ")}` : "");
    sel.appendChild(o);
  });
  const oa = document.createElement("option");
  oa.value = "__auto"; oa.textContent = "Let the solver decide";
  sel.appendChild(oa);
  sel.value = p.mod != null ? String(p.mod) : "__auto";

  td.innerHTML = ""; td.appendChild(sel);
  PEDIT = { host: td, restore: () => { td.innerHTML = html; } };
  sel.focus();
  if(typeof sel.showPicker === "function"){ try{ sel.showPicker(); }catch(e){} }
  sel.onblur = () => closePEdit();
  sel.onkeydown = e => { if(e.key === "Escape") closePEdit(); };
  sel.onchange = () => {
    const v = sel.value;
    PEDIT = null;
    if(v === "__auto") delete rb.modOverride[p.k];
    else rb.modOverride[p.k] = Number(v);
    /* their old seats belong to the old modset, so drop those locks */
    delete rb.locks[p.k + "|" + p.s];
    generate(false);
    toast(v === "__auto" ? `${p.n} — modset back to automatic.`
                         : `${p.n} moved to modset ${v}.`, "ok");
  };
}

/* Measure the frozen columns and publish their real left offsets.
   Hard-coding them drifts the moment a width, font or padding changes,
   and a drifted offset makes the frozen block sit on top of the grid. */
export function syncSticky(){
  const t = document.getElementById("sheetTable");
  if(!t) return;
  /* the modset legend strip is sticky too, so the header must sit under it */
  const lg = document.getElementById("sheetLegend");
  const lh = (lg && lg.offsetParent !== null) ? lg.getBoundingClientRect().height : 0;
  t.style.setProperty("--legendH", Math.round(lh) + "px");

  const rows = t.querySelectorAll("thead tr");
  const hs = rows[0] ? rows[0].querySelectorAll("th.hs") : [];
  let x = 0;
  hs.forEach((h, i) => {
    t.style.setProperty("--sL" + (i + 1), Math.round(x) + "px");
    x += h.getBoundingClientRect().width;
  });
  t.style.setProperty("--sWidth", Math.round(x) + "px");
  /* the demand strip is a second sticky header row, so it sits under the first */
  const r1h = rows[0] ? rows[0].getBoundingClientRect().height : 0;
  t.style.setProperty("--hdrRow1", Math.round(r1h) + "px");
}

/* Clear every assignment on one officer's row. Leave, training and
   off-shift blocks are left alone; cleared cells lock so Re-solve
   keeps them clear until the user says otherwise. */
export function clearRow(rk){
  const sh = rb.sheet; if(!sh || !sh.grid[rk]) return;
  rb.locks[rk] = rb.locks[rk] || {};
  let n = 0;
  sh.grid[rk].forEach((cell, ci) => {
    if(!cell || cell.t === "off" || cell.t === "lv" || cell.t === "trn") return;
    if(cell.c === "—" ) return;
    rb.locks[rk][ci] = "—";
    sh.grid[rk][ci] = { c:"—", t:"sur", man:1 };
    n++;
  });
  renderSheet();
  toast(n ? `Cleared ${n} position${n === 1 ? "" : "s"} — Re-solve will keep the row clear.` : "Nothing to clear on that row.", n ? "ok" : null);
}

/* ---- 4.4 manual editing — every cell is a dropdown -------- */
export let EDITING = null;

/* Options offered for one cell, grouped: this officer's own modset
   first, then every other position, then the status codes. */
export function cellGroups(rk){
  const sh = rb.sheet;
  const p = sh.people.find(x => (x.k + "|" + x.s) === rk);
  const mine = [], other = [], seen = {};
  const posLabel = f => (rb.cfg.positions.find(q => q.fam === f) || {}).label || f;
  sh.seats.forEach(st => {
    if(seen[st.code]) return; seen[st.code] = 1;
    const lbl = st.code + " — " + posLabel(st.fam) + (st.laneN ? " · lane " + st.laneN : "");
    ((p && st.mod === p.mod) ? mine : other).push([st.code, lbl]);
  });
  const g = [];
  if(mine.length) g.push([p && p.mod != null ? "Modset " + p.mod : "This modset", mine]);
  if(other.length) g.push(["Other modsets", other]);
  g.push(["Status", [["B","B — Break"],["TRN","TRN — Training"],["LV","LV — Leave / call-off"],["—","— Unassigned"]]]);
  return g;
}

export function beginEdit(td){
  if(EDITING) endEdit(true);
  const rk = td.dataset.rk, ci = +td.dataset.ci;
  const cell = rb.sheet.grid[rk][ci];
  if(cell && cell.t === "off") return;

  const sel = document.createElement("select");
  sel.className = "cellsel";
  cellGroups(rk).forEach(([label, opts]) => {
    const og = document.createElement("optgroup"); og.label = label;
    opts.forEach(([v, l]) => {
      const o = document.createElement("option");
      o.value = v; o.textContent = l;
      og.appendChild(o);
    });
    sel.appendChild(og);
  });
  const cur = cell && cell.c ? cell.c : "—";
  if(![...sel.options].some(o => o.value === cur)){
    const o = document.createElement("option"); o.value = cur; o.textContent = cur;
    sel.insertBefore(o, sel.firstChild);
  }
  sel.value = cur;

  td.textContent = ""; td.appendChild(sel);
  EDITING = { td, rk, ci, sel };
  sel.focus();
  if(typeof sel.showPicker === "function"){ try{ sel.showPicker(); }catch(e){} }

  sel.onchange = () => endEdit(true);
  sel.onblur   = () => endEdit(true);
  sel.onkeydown = e => {
    if(e.key === "Escape"){ e.preventDefault(); endEdit(false); }
    else if(e.key === "Enter"){ e.preventDefault(); endEdit(true); }
    else if(e.key === "Tab"){
      e.preventDefault();
      const next = td.nextElementSibling;
      endEdit(true);
      if(next && next.classList.contains("cel") && !next.classList.contains("off")) beginEdit(next);
    }
  };
}

export function endEdit(commit){
  if(!EDITING) return;
  const { td, rk, ci, sel } = EDITING;
  const v = commit ? String(sel.value || "").trim() : null;
  EDITING = null;

  if(commit){
    const seat = rb.sheet.seats.find(x => x.code === v || x.id === v);
    rb.locks[rk] = rb.locks[rk] || {};
    rb.locks[rk][ci] = v;
    rb.sheet.grid[rk][ci] = {
      c: v,
      t: v === "B" ? "brk" : v === "TRN" ? "trn" : v === "LV" ? "lv" : v === "—" ? "sur"
         : (seat && seat.fam === "SO") ? "so" : "on",
      id: seat ? seat.id : null, fam: seat ? seat.fam : null, man: 1
    };
  }
  const cell = rb.sheet.grid[rk][ci];
  td.className = "cel " + cell.t + (cell.man ? " man" : "");
  td.textContent = ""; td.appendChild(el("span", "cw", cell.c));

  /* Picking a position that belongs to another modset moves the officer
     there — the number on the code is the modset, so the two must agree. */
  if(commit && cell.id){
    const seat = rb.sheet.seats.find(x => x.id === cell.id);
    const p = rb.sheet.people.find(x => (x.k + "|" + x.s) === rk);
    if(seat && p && seat.mod != null && p.mod !== seat.mod){
      rb.modOverride[p.k] = seat.mod;
      p.mod = seat.mod;
      toast(`${p.n} moved to modset ${seat.mod} — ${cell.c} belongs to that modset.`, "ok");
      renderSheet();
      return;
    }
  }
  if(commit) validateAll();
}

/* ---- 4.5 live validation --------------------------------- */
export function validateAll(){
  const sh = rb.sheet; if(!sh) return;
  const cfg = rb.cfg;
  const byId = {}; sh.seats.forEach(s => byId[s.id] = s);
  const pByRk = {}; sh.people.forEach(p => pByRk[p.k + "|" + p.s] = p);
  const issues = [];

  document.querySelectorAll("#sheetTable td.cel.vio").forEach(td => td.classList.remove("vio"));

  for(let c = 0; c < sh.cols.length; c++){
    const used = {}, sexAt = {};
    for(const rk in sh.grid){
      const cell = sh.grid[rk][c]; if(!cell || !cell.c || ["B","TRN","LV","—",""].includes(cell.c)) continue;
      const p = pByRk[rk]; if(!p) continue;
      (used[cell.c] = used[cell.c] || []).push(rk);
      /* CT / qual check */
      const seat = sh.seats.find(s => s.code === cell.c && (s.mod === p.mod || true));
      if(seat && !seatAllows(cfg, p, seat)){
        markVio(rk, c);
        issues.push(`${m2t(sh.cols[c])}: ${p.n} at ${cell.c} lacks a required qualification.`);
      }
      /* consecutive repeat */
      if(!cfg.rules.allowRepeat && c > 0 && !cell.pin && !cell.forced){
        const prev = sh.grid[rk][c-1];
        if(prev && prev.c === cell.c && !["B","TRN","LV","—",""].includes(prev.c)){
          markVio(rk, c);
          issues.push(`${m2t(sh.cols[c])}: ${p.n} repeats ${cell.c} back-to-back.`);
        }
      }
      if(cell.c.startsWith("SO")) (sexAt[cell.c] = sexAt[cell.c] || []).push({ rk, sex:p.sex });
    }
    /* over-capacity on a single code */
    for(const code in used){
      const seatN = sh.seats.filter(s => s.code === code).length || 1;
      if(used[code].length > seatN){
        used[code].forEach(rk => markVio(rk, c));
        issues.push(`${m2t(sh.cols[c])}: ${used[code].length} officers on ${code} (capacity ${seatN}).`);
      }
    }
    /* SO pairing */
    for(const code in sexAt){
      const g = sexAt[code];
      if(g.length === 2 && g[0].sex === g[1].sex){
        g.forEach(x => markVio(x.rk, c));
        issues.push(`${m2t(sh.cols[c])}: ${code} has two ${g[0].sex==="F"?"female":"male"} officers — pairing requires one of each.`);
      }
    }
  }
  const box = $("liveIssues");
  if(box) box.remove();
  if(issues.length){
    const d = el("div","msg e"); d.id = "liveIssues";
    d.innerHTML = `<span><b>${issues.length} live rule violation${issues.length===1?"":"s"}:</b> ` +
      esc(issues.slice(0,6).join("  ·  ")) + (issues.length>6 ? ` … and ${issues.length-6} more.` : "") + "</span>";
    $("diagList").insertBefore(d, $("diagList").firstChild);
  }
}
export function markVio(rk, c){
  const td = document.querySelector(`#sheetTable td.cel[data-rk="${CSS.escape(rk)}"][data-ci="${c}"]`);
  if(td) td.classList.add("vio");
}
