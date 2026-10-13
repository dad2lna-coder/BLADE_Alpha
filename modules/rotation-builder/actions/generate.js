/** Selectors, generate, and sheet render. */
import { rb } from "../stores/rotationStore.js";
import { $, el, esc, toast } from "../utils/dom.js";
import { m2t, m2hhmm } from "../utils/time.js";
import { sheetWindow, solve } from "../utils/engine.js";
import { staffFor, laneDemand } from "../utils/projections.js";
import { syncSticky, validateAll } from "./edit.js";

/* ---- 4.1 selectors --------------------------------------- */
export function locList(){
  return Object.keys(rb.cfg.locations).sort();
}
export function fillLocSelect(){
  const term = $("iTerm").value;
  const sel = $("iLoc"), cur = sel.value;
  sel.innerHTML = '<option value="">Select location…</option>';
  locList().forEach(id => {
    const L = rb.cfg.locations[id];
    if(term && L.t !== term) return;
    const o = el("option", null, id + "  ·  " + L.open + "–" + L.close);
    o.value = id; sel.appendChild(o);
  });
  if(cur && sel.querySelector(`option[value="${cur}"]`)) sel.value = cur;
  renderLanes();
}
export function fillTerms(){
  const sel = $("iTerm"), t = [...new Set(locList().map(id => rb.cfg.locations[id].t))].sort();
  sel.innerHTML = '<option value="">All terminals</option>';
  t.forEach(x => { const o = el("option", null, "Terminal " + x); o.value = x; sel.appendChild(o); });
}
export function renderLanes(){
  const box = $("laneToggles"), id = $("iLoc").value;
  box.innerHTML = "";
  if(!id){ box.className = "hint"; box.textContent = "Select a location."; return; }
  box.className = "";
  const L = rb.cfg.locations[id];
  L.mods.forEach((lanes, mi) => {
    const h = el("div", "hint", "Modset " + (mi+1) + (lanes.length === 1 ? "  (WTMD only — no Body Scanner)" : ""));
    h.style.margin = "6px 0 2px"; box.appendChild(h);
    lanes.forEach(l => {
      const lab = el("label", "chk");
      const cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = rb.lanes[l.n] !== false;
      cb.onchange = () => { rb.lanes[l.n] = cb.checked; };
      lab.appendChild(cb);
      lab.appendChild(document.createTextNode("Lane " + l.n));
      if(l.ct){ const t = el("span", "tag ct", "CT · " + rb.cfg.ctQual); t.style.marginLeft = "4px"; lab.appendChild(t); }
      box.appendChild(lab);
    });
  });
}

/* ---- 4.2 generation -------------------------------------- */
export function currentWindow(){
  const id = $("iLoc").value; if(!id) return null;
  return sheetWindow(rb.cfg, rb.cfg.locations[id], $("iShift").value, $("iStart").value, $("iEnd").value);
}

export function generate(newSeed){
  const locId = $("iLoc").value, date = $("iDate").value, shift = $("iShift").value;
  if(!locId) return toast("Select a location first.", "err");
  if(!rb.roster.length) return toast("Upload a roster first.", "err");

  const loc = rb.cfg.locations[locId];
  const win = sheetWindow(rb.cfg, loc, shift, $("iStart").value, $("iEnd").value);
  if(!win.cols.length) return toast("That shift window produces no columns for this location.", "err");

  let people = staffFor(rb.roster, locId, date, win.first, win.last + rb.cfg.rules.slot, rb.cfg, rb.adj, shift);
  people = people.filter(p => !rb.removed[p.k]);
  const titles = rb.cfg.titles;
  const usable = people.filter(p => titles[p.ti] !== 0);
  const excluded = people.length - usable.length;
  if(!usable.length) return toast("No officers found for that location, date and shift.", "err");

  if(newSeed !== false) rb.seed = (Math.random() * 1e9) | 0;

  /* seam import: pull the AM sheet's 11:00 assignment forward */
  let seamNote = null;
  if(shift === "PM"){
    const am = rb.savedIndex && rb.savedIndex[locId + "|" + date + "|AM"];
    if(am) seamNote = am;
  }

  /* officers added by hand join the pool before the solve */
  const extras = (rb.extra || []).map(x => extraToPerson(x, win));
  const roster = usable.concat(extras);

  const res = solve(rb.cfg, {
    locId, loc, shift, win, activeLanes: rb.lanes,
    people: roster, seed: rb.seed, locks: rb.locks, modOverride: rb.modOverride
  });
  if(res.error) return toast(res.error, "err");

  if(excluded) res.diag.unshift({ k:"i", m:`${excluded} roster row${excluded===1?"":"s"} excluded by job-title filter (Configuration → Job Titles in Rotation).` });
  if(shift === "PM" && seamNote)
    res.diag.unshift({ k:"i", m:`Seam: an AM sheet exists for this location and date. Crossover officers' 11:00 position and break counts were carried forward.` });
  else if(shift === "PM")
    res.diag.unshift({ k:"w", m:`Seam: no saved AM sheet for this location and date, so the PM sheet starts from a clean reset. Officers crossing 11:00 may receive an extra break.` });

  res.locId = locId; res.date = date; res.shift = shift;
  rb.sheet = res;
  renderSheet();
  if(extras.length) res.diag.unshift({ k:"i", m:`${extras.length} officer${extras.length===1?"":"s"} added to this sheet by hand: ${esc(extras.map(p=>p.n).join(", "))}.` });
  ["bXlsx","bCsv","bPrint","bSave","bReroll","bResolve","bAdjust","bClearMan","bAddOfficer"].forEach(i => $(i).disabled = false);
  toast("Rotation generated — " + res.cols.length + " columns, " + roster.length + " officers.", "ok");
}

/* ---- 4.3 render ------------------------------------------ */
export function modClass(m){ return "m" + (((Number(m) - 1) % 3) + 1); }

/* Convert a hand-added record into a solver-ready person. */
export function extraToPerson(x, win){
  const slot = rb.cfg.rules.slot;
  const w0 = win.first, w1 = win.last + slot;
  /* An officer pulled in from elsewhere carries that location's hours, which
     may not overlap this sheet at all (a PM row dropped onto an AM sheet).
     An empty intersection would render every cell off-shift and unclickable,
     so fall back to the whole sheet window — they are being reassigned here. */
  let s0 = x.s != null ? Math.max(x.s, w0) : w0;
  let e0 = x.e != null ? Math.min(x.e, w1) : w1;
  if(e0 - s0 < slot){ s0 = w0; e0 = w1; }
  return {
    k: x.k, n: x.n, ti: x.ti || "TSO", po: "", sex: x.sex || "M", quals: x.quals || "",
    s: s0, e: e0, rawS: s0, rawE: e0,
    abs: [], trn: [], notes: [x.src ? ("Added from " + x.src) : "Added manually"],
    restrict: null, pinned: false, mod: null, seat: null,
    preferMod: x.mod != null ? Number(x.mod) : null,
    added: 1, shift: ""
  };
}

export function renderSheet(){
  const sh = rb.sheet, wrap = $("sheetWrap");
  $("emptyState").style.display = "none";
  const old = document.getElementById("sheetTable"); if(old) old.remove();

  /* New logic to identify rows that are entirely off-shift */
  const isRowOff = (rk) => {
      if (!sh.grid[rk]) return false;
      for (const cell of sh.grid[rk]) {
          if (cell && cell.t !== 'off') return false;
      }
      return true;
  };

  const slot = rb.cfg.rules.slot;
  const wEnd = sh.cols[sh.cols.length - 1] + slot;
  const posLabel = f => (rb.cfg.positions.find(p => p.fam === f) || {}).label || f;

  /* ---------- print header ---------- */
  $("printHead").innerHTML =
    `<h1>${esc(sh.locId)} — ${esc(sh.shift)} Rotation</h1>` +
    `<div class="pl">${esc(sh.date || "(no date)")} &nbsp;·&nbsp; ${m2t(sh.cols[0])}–${m2t(wEnd)} ` +
    `&nbsp;·&nbsp; ${sh.people.length} officers &nbsp;·&nbsp; generated ${new Date().toLocaleString()}</div>`;
  $("printLegend").innerHTML =
    "<b>Legend:</b> " + [...new Set(sh.seats.map(s =>
      `${s.code} = ${posLabel(s.fam)}${s.laneN ? " (lane " + s.laneN + ")" : s.mod ? " (modset " + s.mod + ")" : ""}`))].join(" &nbsp;·&nbsp; ") +
    " &nbsp;·&nbsp; B = Break &nbsp;·&nbsp; TRN = Training &nbsp;·&nbsp; LV = Leave/Call-off &nbsp;·&nbsp; — = Unassigned";

  /* ---------- group officers by modset ---------- */
  const byMod = {};
  sh.people.forEach(p => {
    const key = (p.mod == null ? "?" : String(p.mod));
    (byMod[key] = byMod[key] || []).push(p);
  });
  const modKeys = Object.keys(byMod).sort((a, b) =>
    (a === "?" ? 99 : +a) - (b === "?" ? 99 : +b));

  /* lanes and seat codes owned by each modset */
  const laneOf = {}, codeOf = {};
  sh.seats.forEach(s => {
    if(s.laneN) (laneOf[s.mod] = laneOf[s.mod] || new Set()).add(s.laneN);
    (codeOf[s.mod] = codeOf[s.mod] || new Set()).add(s.code);
  });
  const laneText = m => {
    const l = [...(laneOf[m] || [])].sort((a, b) => a - b);
    return l.length ? ("Lane" + (l.length > 1 ? "s " : " ") + l.join(" & ")) : "no lanes";
  };

  /* ---------- modset legend strip ---------- */
  const lg = $("sheetLegend");
  lg.style.display = "flex"; lg.innerHTML = "";
  modKeys.filter(k => k !== "?").forEach(k => {
    const m = +k, codes = [...(codeOf[m] || [])];
    const t = el("span", "modtag");
    t.innerHTML = `<span class="sw" style="background:var(--${modClass(m)})"></span>` +
      `<b>Modset ${m}</b> · ${esc(laneText(m))} · ${codes.length} position${codes.length === 1 ? "" : "s"} · ` +
      `${byMod[k].length} officer${byMod[k].length === 1 ? "" : "s"}`;
    t.title = "Positions: " + codes.join(", ");
    lg.appendChild(t);
  });
  if(byMod["?"]){
    const t = el("span", "modtag");
    t.innerHTML = `<span class="sw" style="background:var(--tx3)"></span><b>Unassigned</b> · ${byMod["?"].length} officer(s)`;
    lg.appendChild(t);
  }

  /* ---------- table ---------- */
  const t = el("table", "sheet"); t.id = "sheetTable";
  const th = el("thead"), hr = el("tr");
  hr.appendChild(el("th", "hs h-tool", ""));
  hr.appendChild(el("th", "hs h-cert", "CERT?"));
  hr.appendChild(el("th", "hs h-name", "NAME"));
  hr.appendChild(el("th", "hs h-mod", "MOD"));
  sh.cols.forEach(c => hr.appendChild(el("th", null, m2hhmm(c))));
  th.appendChild(hr);

  /* ---- demand strip: lanes the projections call for, hour by hour ---- */
  const dem = laneDemand(sh, rb.cfg, rb.proj);
  sh.demand = dem;
  if(dem.has){
    const dr = el("tr", "demand");
    const lbl = el("th", "hs h-tool", ""); dr.appendChild(lbl);
    const l2 = el("th", "hs h-cert", "LANES REQ"); dr.appendChild(l2);
    const l3 = el("th", "hs h-name", "");
    l3.innerHTML = '<span style="font:600 10.5px var(--f);color:var(--tx3);text-transform:none;letter-spacing:0">' +
      'from projections · open vs required</span>';
    dr.appendChild(l3);
    dr.appendChild(el("th", "hs h-mod", ""));
    dem.perCol.forEach(c => {
      const cell = el("th", "dm");
      const short = c.need != null && c.open < c.need;
      const unstaffed = c.need != null && c.staffable < c.need;
      if(short) cell.classList.add("bad");
      else if(unstaffed) cell.classList.add("warn");
      else if(c.need != null) cell.classList.add("ok");
      cell.textContent = c.need == null ? "–" : String(c.need);
      cell.title = `${m2t(c.t)}–${m2t(c.t + rb.cfg.rules.slot)}\n` +
        `Projected ${c.pax} passengers this hour\n` +
        `Lanes required ${c.need}${c.uncapped > c.physical ? " (demand says " + c.uncapped + ", only " + c.physical + " exist)" : ""}\n` +
        `Lanes open ${c.open} · staff supports ${c.staffable} (${c.onFloor} on the floor)`;
      dr.appendChild(cell);
    });
    th.appendChild(dr);
  }
  t.appendChild(th);

  const nCols = sh.cols.length + 4;
  const tb = el("tbody");

  modKeys.forEach((mk, mi) => {
    /* modset band */
    const band = el("tr", "band");
    const bc = el("td"); bc.colSpan = nCols;
    const known = mk !== "?";
    bc.innerHTML = `<span class="bandin">` +
      `<span class="bar" style="background:var(--${known ? modClass(mk) : "tx3"})"></span>` +
      (known
        ? `Modset ${esc(mk)}<span class="lanes">${esc(laneText(+mk))} · ${byMod[mk].length} officer${byMod[mk].length === 1 ? "" : "s"}${(codeOf[+mk] && !codeOf[+mk].has("SO" + mk)) ? " · no Body Scanner" : ""}</span>`
        : `Unassigned<span class="lanes">${byMod[mk].length} officer(s) with no modset</span>`) +
      `</span>`;
    band.appendChild(bc); tb.appendChild(band);

     byMod[mk].forEach((p, pi) => {
  const rk = p.k + "|" + p.s;
  const isOff = (sh.grid[rk] || []).every(cell => !cell || cell.t === "off"); /* ADD */
  const tr = el("tr", known ? modClass(mk) : "");
  if (isOff) tr.classList.add("off-row");                                    /* ADD */
  if(pi === byMod[mk].length - 1 && mi < modKeys.length - 1) tr.classList.add("mline");
  tr.dataset.rk = rk;


      const c0 = el("td", "tool");
      const btn = el("button", "rowclear");
      btn.title = "Clear every position on this row";
      btn.dataset.clear = rk;
      btn.innerHTML = '<svg class="ic sm"><use href="#i-eraser"/></svg>';
      c0.appendChild(btn); tr.appendChild(c0);

      const c1 = el("td", "cert", p.quals || "—");
      c1.title = "Qualifications: " + (p.quals || "none");
      tr.appendChild(c1);

      const c2 = el("td", "name");
      c2.dataset.rk = rk; c2.dataset.pk = p.k;
      const nm = el("span", "nm", p.n);
      nm.classList.add("editable");
      const sb = el("span", "sb", `${p.ti || "—"} · ${p.sex || "?"} · ${m2t(p.rawS)}–${m2t(p.rawE)}` +
        (p.added ? " · added" : "") + (p.restrict ? " · RESTRICTED" : "") + (p.pinned ? " · pinned" : ""));
      c2.appendChild(nm); c2.appendChild(sb);
      c2.title = `${p.n} · ${p.sex} · modset ${p.mod == null ? "—" : p.mod} · ${m2t(p.rawS)}–${m2t(p.rawE)}` +
        (p.restrict ? ` · RESTRICTED: ${p.restrict.join(", ")}` : "") +
        (p.notes && p.notes.length ? ` · ${p.notes.join("; ")}` : "");
      tr.appendChild(c2);

      const c3 = el("td", "modcol");
      c3.dataset.rk = rk; c3.dataset.pk = p.k;
      const chip = el("span", "modchip editable " + (known ? modClass(mk) : "mx"), known ? "M" + mk : "—");
      chip.title = known ? `Modset ${mk} — ${laneText(+mk)} — click to move this officer`
                         : "No modset assigned — click to place";
      c3.appendChild(chip); tr.appendChild(c3);

      (sh.grid[rk] || []).forEach((cell, ci) => {
        const td = el("td", "cel " + (cell ? cell.t : "off"));
        td.dataset.rk = rk; td.dataset.ci = ci;
        if(cell && cell.man) td.classList.add("man");
        if(cell && cell.c && cell.t !== "off")
          td.title = `${p.n} · ${m2t(sh.cols[ci])}–${m2t(sh.cols[ci] + slot)} · ${cell.fam ? posLabel(cell.fam) : cell.c}`;
        td.appendChild(el("span", "cw", cell ? cell.c : ""));
        tr.appendChild(td);
      });
      tb.appendChild(tr);
    });

  });
  t.appendChild(tb);
  wrap.insertBefore(t, $("printLegend"));

  /* ---------- meta pills ---------- */
  const nE = sh.diag.filter(d => d.k === "e").length, nW = sh.diag.filter(d => d.k === "w").length;
  const nMods = modKeys.filter(k => k !== "?").length;
  $("sheetMeta").innerHTML =
    `<span class="pill ac"><b>${esc(sh.locId)}</b> ${esc(sh.shift)}</span>` +
    `<span class="pill">${esc(sh.date || "no date")}</span>` +
    `<span class="pill">${m2t(sh.cols[0])}–${m2t(wEnd)}</span>` +
    `<span class="pill"><b>${sh.people.length}</b> officers</span>` +
    `<span class="pill"><b>${nMods}</b> modset${nMods === 1 ? "" : "s"} · <b>${sh.seats.length}</b> positions</span>` +
    (nE ? `<span class="pill bad">${nE} blocking</span>` : "") +
    (nW ? `<span class="pill warn">${nW} warning${nW === 1 ? "" : "s"}</span>` : "") +
    (!nE && !nW ? `<span class="pill ok">clean</span>` : "") +
    `<span class="pill">seed ${sh.seed}</span>`;

  /* ---------- projection diagnostics ---------- */
  if(dem.has){
    const P = rb.cfg.proj;
    const shortHrs = dem.hours.filter(h => h.open < h.need);
    const understaffed = dem.hours.filter(h => h.open >= h.need && h.staffable < h.need);
    const overCap = dem.hours.filter(h => h.uncapped > h.physical);
    const slack = dem.hours.filter(h => h.need != null && h.open > h.need);

    const fmt = hs => hs.map(h => `${m2t(h.from)} (${h.pax} pax → ${h.need} lane${h.need===1?"":"s"}, ${h.open} open)`).join(" · ");
    if(shortHrs.length)
      sh.diag.unshift({ k:"e", m:`<b>Lanes short of projected demand:</b> ${fmt(shortHrs)}. Open more lanes or expect queues.` });
    if(overCap.length)
      sh.diag.unshift({ k:"e", m:`<b>Demand exceeds this checkpoint:</b> ` +
        overCap.map(h => `${m2t(h.from)} needs ${h.uncapped} lanes, only ${h.physical} exist`).join(" · ") +
        `. Divert passengers or open another checkpoint.` });
    if(understaffed.length)
      sh.diag.push({ k:"w", m:`<b>Lanes open but not staffable:</b> ` +
        understaffed.map(h => `${m2t(h.from)} needs ${h.need}, staff supports ${h.staffable}`).join(" · ") +
        `. Based on ${P.firstLaneStaff} officers for the first lane and ${P.extraLaneStaff} for each extra.` });
    if(slack.length)
      sh.diag.push({ k:"i", m:`<b>Lanes available to close:</b> ` +
        slack.map(h => `${m2t(h.from)}–${m2t(h.to)} needs ${h.need} of ${h.open}`).join(" · ") + `.` });
    const pk = dem.hours.reduce((a, h) => (h.pax > (a ? a.pax : -1) ? h : a), null);
    if(pk) sh.diag.push({ k:"i", m:`Peak hour ${m2t(pk.from)}–${m2t(pk.to)}: <b>${pk.pax} passengers</b>, ${pk.need} lane${pk.need===1?"":"s"} required. Throughput assumed ${P.paxPerLane}/lane/hour${P.peakFactor!==1?`, peak factor ${P.peakFactor}`:""}.` });
  } else if(Object.keys(rb.proj || {}).length){
    sh.diag.push({ k:"i", m:`No passenger projections loaded for ${esc(sh.locId)} on ${esc(sh.date || "this date")}.` });
  }

  /* ---------- diagnostics ---------- */
  const dl = $("diagList"); dl.innerHTML = "";
  const rank = { e:0, w:1, i:2, g:3 };
  const icon = { e:"i-alert", w:"i-alert", i:"i-info", g:"i-check" };
  sh.diag.slice().sort((a, b) => rank[a.k] - rank[b.k]).forEach(d => {
    const m = el("div", "msg " + d.k);
    m.innerHTML = `<svg class="ic sm"><use href="#${icon[d.k] || "i-info"}"/></svg><span>${d.m}</span>`;
    dl.appendChild(m);
  });
  const counts = { e:nE, w:nW, i:sh.diag.filter(d=>d.k==="i").length, g:sh.diag.filter(d=>d.k==="g").length };
  $("diagCount").innerHTML =
    (counts.e ? `<span class="cnt e">${counts.e} blocking</span> ` : "") +
    (counts.w ? `<span class="cnt w">${counts.w} warning</span> ` : "") +
    (counts.i ? `<span class="cnt i">${counts.i} info</span> ` : "") +
    (counts.g ? `<span class="cnt g">all clear</span>` : "");
  syncSticky();
  $("diagPanel").style.display = "flex";
  $("diagPanel").classList.toggle("min", !!rb.diagMin);
  $("legendBar").style.display = "flex";
  validateAll();
}
