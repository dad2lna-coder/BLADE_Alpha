/** Configuration screen, saved sheets, briefcase, roster and projection uploads. */
import { rb, DB, defaultConfig, APP_VER } from "../stores/rotationStore.js";
import { $, el, esc, toast, confirmBox } from "../utils/dom.js";
import { t2m, m2t, todayKey, uid } from "../utils/time.js";
import { grabRanges, ingestWorkbook } from "../utils/roster.js";
import { ingestProjections } from "../utils/projections.js";
import { staffFor } from "../utils/projections.js";
import { currentWindow, fillLocSelect, fillTerms, generate, locList, renderLanes, renderSheet } from "./generate.js";
import { dl } from "./export.js";

let PRISTINE = "";
export function loadStandaloneTemplate(){
  if(typeof fetch !== "function") return Promise.resolve("");
  return fetch("Future_Modules/RotationBuilder%201.html").then(r => r.ok ? r.text() : "").then(t => {
    PRISTINE = String(t || "").replace(/^<!DOCTYPE html>\s*/i, "");
    return PRISTINE;
  }).catch(() => "");
}

/* ============================================================
   Section 5: configuration UI, persistence, bootstrap
   ============================================================ */

export function saveCfg(){ return DB.set("config", rb.cfg).then(()=>{ renderAdmin(); fillTerms(); fillLocSelect(); }); }

/* ---- 5.1 rules ------------------------------------------- */
export function renderRules(){
  const R = rb.cfg.rules;
  const set = (id,v)=>{ const e=$(id); if(e) e.value = v; };
  set("cSlot",R.slot); set("cSeamAM",R.seamAM); set("cSeamPM",R.seamPM); set("cFem",R.femPerMod);
  set("cBrkT",R.brkTarget); set("cBrkM",R.brkMax); set("cBrkH",R.brkHours); set("cLaneMin",R.laneMin);
  set("cDrop",R.dropOrder); set("cRing",R.ring);
  $("cAllowRepeat").checked = !!R.allowRepeat;
  $("cBreakClears").checked = !!R.breakClears;
  $("cFemScale").checked = !!R.femScale;
  $("cPinSingle").checked = !!R.pinSingle;
  $("cStrictShift").checked = R.strictShift !== false;
}
export function wireRules(){
  const num = { cSlot:"slot", cFem:"femPerMod", cBrkT:"brkTarget", cBrkM:"brkMax", cBrkH:"brkHours", cLaneMin:"laneMin" };
  for(const id in num) $(id).onchange = e => { rb.cfg.rules[num[id]] = +e.target.value; saveCfg(); };
  const txt = { cSeamAM:"seamAM", cSeamPM:"seamPM", cDrop:"dropOrder", cRing:"ring" };
  for(const id in txt) $(id).onchange = e => { rb.cfg.rules[txt[id]] = e.target.value.trim(); saveCfg(); };
  const chk = { cAllowRepeat:"allowRepeat", cBreakClears:"breakClears", cFemScale:"femScale", cPinSingle:"pinSingle", cStrictShift:"strictShift" };
  for(const id in chk) $(id).onchange = e => { rb.cfg.rules[chk[id]] = e.target.checked; saveCfg(); };
}

/* ---- 5.2 job titles -------------------------------------- */
export function renderTitles(){
  const box = $("titleList"); box.innerHTML = "";
  const keys = Object.keys(rb.cfg.titles).sort();
  keys.forEach(t => {
    const lab = el("label","chk");
    const cb = document.createElement("input"); cb.type="checkbox"; cb.checked = rb.cfg.titles[t] !== 0;
    cb.onchange = () => { rb.cfg.titles[t] = cb.checked ? 1 : 0; DB.set("config", rb.cfg); };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(t));
    box.appendChild(lab);
  });
}

/* ---- 5.3 locations --------------------------------------- */
export function renderLocs(){
  const box = $("locList"); box.innerHTML = "";
  locList().forEach(id => {
    const L = rb.cfg.locations[id];
    const d = el("details","acc");
    const sm = el("summary");
    sm.appendChild(document.createTextNode(id));
    const nLanes = L.mods.reduce((a,m)=>a+m.length,0);
    const cnt = el("span","scount", `T${L.t} · ${L.open}–${L.close} · ${nLanes} lane${nLanes===1?"":"s"} · ${L.mods.length} modset${L.mods.length===1?"":"s"}` +
      (L.kcm?" · KCM":"") + (L.exit && (L.exit.am||L.exit.pm) ? " · EXIT" : ""));
    sm.appendChild(cnt); d.appendChild(sm);
    const b = el("div");
    L.mods.forEach((lanes, mi) => {
      const row = el("div"); row.style.marginBottom = "6px";
      row.appendChild(el("span","lbl","Modset " + (mi+1) + (lanes.length===1 ? " — WTMD only, no Body Scanner" : "")));
      lanes.forEach(l => { const t = el("span","tag" + (l.ct?" ct":""), "Lane " + l.n + (l.ct ? " · CT" : "")); row.appendChild(t); });
      b.appendChild(row);
    });
    if(L.kcm) b.appendChild(el("div","hint","KCM window " + L.kcm.open + "–" + L.kcm.close));
    if(L.exit && (L.exit.am||L.exit.pm))
      b.appendChild(el("div","hint","Exit lane staffed on: " + [L.exit.am?"AM":"", L.exit.pm?"PM":""].filter(Boolean).join(" + ")));
    const btn = el("button","btn sm","Edit"); btn.style.marginTop = "8px";
    btn.onclick = () => openLocModal(id);
    b.appendChild(btn);
    const del = el("button","btn sm danger","Delete"); del.style.cssText = "margin-top:8px;margin-left:6px";
    del.onclick = () => confirmBox("Delete location", `Remove <b>${esc(id)}</b> from the configuration?`, () => { delete rb.cfg.locations[id]; saveCfg(); toast("Location removed."); });
    b.appendChild(del);
    d.appendChild(b); box.appendChild(d);
  });
}
let LOC_EDIT = null;
export function openLocModal(id){
  const isNew = !id;
  LOC_EDIT = { id: id || "", L: id ? JSON.parse(JSON.stringify(rb.cfg.locations[id])) : { t:"A", open:"04:00", close:"20:00", mods:[[{n:1,ct:0},{n:2,ct:0}]], kcm:null, exit:{am:0,pm:0} } };
  $("locModTitle").textContent = isNew ? "Add Location" : "Edit " + id;
  drawLocModal();
  $("ovLoc").classList.add("on");
}
export function drawLocModal(){
  const L = LOC_EDIT.L, b = $("locModBody");
  b.innerHTML = "";
  const g = el("div","g4");
  g.innerHTML =
    `<div><span class="lbl">Location ID</span><input id="lmId" value="${esc(LOC_EDIT.id)}" placeholder="CKPT-X00"></div>
     <div><span class="lbl">Terminal</span><input id="lmT" value="${esc(L.t)}" maxlength="2"></div>
     <div><span class="lbl">Open</span><input type="time" id="lmO" step="1800" value="${esc(L.open)}"></div>
     <div><span class="lbl">Close</span><input type="time" id="lmC" step="1800" value="${esc(L.close)}"></div>`;
  b.appendChild(g);

  const mw = el("div"); mw.style.marginTop = "16px";
  mw.appendChild(el("span","lbl","Modsets & Lanes"));
  L.mods.forEach((lanes, mi) => {
    const card = el("div"); card.style.cssText = "border:1px solid var(--line);border-radius:8px;padding:10px;margin-bottom:8px";
    const hd = el("div"); hd.style.cssText = "display:flex;align-items:center;gap:8px;margin-bottom:8px";
    hd.appendChild(el("b", null, "Modset " + (mi+1)));
    if(lanes.length === 1) hd.appendChild(el("span","tag","WTMD only — no Body Scanner"));
    const rmM = el("button","btn sm danger","Remove modset");
    rmM.style.marginLeft = "auto";
    rmM.onclick = () => { L.mods.splice(mi,1); drawLocModal(); };
    hd.appendChild(rmM); card.appendChild(hd);
    lanes.forEach((l, li) => {
      const r = el("div"); r.style.cssText = "display:flex;gap:8px;align-items:center;margin-bottom:5px";
      const n = document.createElement("input"); n.type="number"; n.min=1; n.max=12; n.value=l.n; n.style.width="80px";
      n.onchange = () => { l.n = +n.value; };
      const ct = document.createElement("input"); ct.type="checkbox"; ct.checked=!!l.ct; ct.style.width="auto";
      ct.onchange = () => { l.ct = ct.checked ? 1 : 0; };
      const lab = el("label","chk"); lab.appendChild(ct); lab.appendChild(document.createTextNode("CT lane (requires " + rb.cfg.ctQual + ")"));
      const rm = el("button","btn sm danger","×"); rm.onclick = () => { lanes.splice(li,1); drawLocModal(); };
      r.appendChild(el("span","hint","Lane #")); r.appendChild(n); r.appendChild(lab); r.appendChild(rm);
      card.appendChild(r);
    });
    const addL = el("button","btn sm","+ Lane");
    addL.onclick = () => { const mx = Math.max(0, ...L.mods.flat().map(x=>x.n)); lanes.push({ n:mx+1, ct:0 }); drawLocModal(); };
    card.appendChild(addL);
    mw.appendChild(card);
  });
  const addM = el("button","btn sm","+ Modset");
  addM.onclick = () => { const mx = Math.max(0, ...L.mods.flat().map(x=>x.n)); L.mods.push([{ n:mx+1, ct:0 }]); drawLocModal(); };
  mw.appendChild(addM);
  b.appendChild(mw);

  const ex = el("div"); ex.style.marginTop = "16px";
  ex.appendChild(el("span","lbl","Exit Lane — which shift's sheet carries it"));
  const rowE = el("div"); rowE.style.display = "flex"; rowE.style.gap = "16px";
  [["am","AM"],["pm","PM"]].forEach(([k,lbl]) => {
    const lab = el("label","chk"); const cb = document.createElement("input"); cb.type="checkbox";
    cb.checked = !!(L.exit && L.exit[k]); cb.style.width="auto";
    cb.onchange = () => { L.exit = L.exit || {am:0,pm:0}; L.exit[k] = cb.checked?1:0; };
    lab.appendChild(cb); lab.appendChild(document.createTextNode(lbl));
    rowE.appendChild(lab);
  });
  ex.appendChild(rowE);
  ex.appendChild(el("div","hint","A checkpoint can staff another checkpoint's exit lane — tick the shift on whichever sheet the officer should appear."));
  b.appendChild(ex);

  const kc = el("div"); kc.style.marginTop = "16px";
  kc.appendChild(el("span","lbl","KCM"));
  const kl = el("label","chk"); const kb = document.createElement("input"); kb.type="checkbox"; kb.checked=!!L.kcm; kb.style.width="auto";
  kb.onchange = () => { L.kcm = kb.checked ? { open:L.open, close:L.close } : null; drawLocModal(); };
  kl.appendChild(kb); kl.appendChild(document.createTextNode("This location has a KCM position"));
  kc.appendChild(kl);
  if(L.kcm){
    const r = el("div","g2");
    r.innerHTML = `<div><span class="lbl">KCM open</span><input type="time" id="lmKO" step="1800" value="${esc(L.kcm.open)}"></div>
                   <div><span class="lbl">KCM close</span><input type="time" id="lmKC" step="1800" value="${esc(L.kcm.close)}"></div>`;
    kc.appendChild(r);
  }
  b.appendChild(kc);
}
export function saveLocModal(){
  const L = LOC_EDIT.L;
  const id = $("lmId").value.trim().toUpperCase();
  if(!id) return toast("Location ID required.", "err");
  L.t = $("lmT").value.trim().toUpperCase();
  L.open = $("lmO").value; L.close = $("lmC").value;
  if(L.kcm && $("lmKO")) { L.kcm.open = $("lmKO").value; L.kcm.close = $("lmKC").value; }
  L.mods = L.mods.filter(m => m.length);
  if(!L.mods.length) return toast("At least one modset with one lane is required.", "err");
  if(LOC_EDIT.id && LOC_EDIT.id !== id) delete rb.cfg.locations[LOC_EDIT.id];
  rb.cfg.locations[id] = L;
  $("ovLoc").classList.remove("on");
  saveCfg(); toast("Location saved.", "ok");
}

/* ---- 5.4 positions --------------------------------------- */
export function renderPos(){
  const t = $("posTable");
  t.innerHTML = "<thead><tr><th>Family</th><th>Label</th><th>Scope</th><th>Seats</th><th></th></tr></thead>";
  const tb = el("tbody");
  rb.cfg.positions.forEach((p, i) => {
    const tr = el("tr");
    tr.innerHTML = `<td><input value="${esc(p.fam)}" data-i="${i}" data-f="fam" style="width:70px"></td>
      <td><input value="${esc(p.label)}" data-i="${i}" data-f="label"></td>
      <td><select data-i="${i}" data-f="scope">
        <option value="lane"${p.scope==="lane"?" selected":""}>lane</option>
        <option value="mod"${p.scope==="mod"?" selected":""}>modset</option>
        <option value="site"${p.scope==="site"?" selected":""}>site</option></select></td>
      <td><input type="number" min="1" max="4" value="${p.seats}" data-i="${i}" data-f="seats" style="width:60px"></td>
      <td style="text-align:right"><button class="btn sm danger" data-del="${i}">×</button></td>`;
    tb.appendChild(tr);
  });
  t.appendChild(tb);
  t.querySelectorAll("input,select").forEach(e => e.onchange = ev => {
    const i = +ev.target.dataset.i, f = ev.target.dataset.f;
    rb.cfg.positions[i][f] = f === "seats" ? +ev.target.value : ev.target.value;
    DB.set("config", rb.cfg); renderQualMap();
  });
  t.querySelectorAll("[data-del]").forEach(b => b.onclick = () => {
    rb.cfg.positions.splice(+b.dataset.del, 1); saveCfg();
  });
}

/* ---- 5.5 quals ------------------------------------------- */
export function renderQuals(){
  const box = $("qualList"); box.innerHTML = "";
  rb.cfg.quals.forEach((q, i) => {
    const t = el("span","tag x", q + " ×");
    t.title = "Remove qualification " + q;
    t.onclick = () => confirmBox("Remove qualification", `Remove <b>${esc(q)}</b>? Officers holding it will simply no longer show it.`, ()=>{ rb.cfg.quals.splice(i,1); saveCfg(); });
    box.appendChild(t);
  });
  renderQualMap();
  const u = $("unkQuals");
  const keys = Object.keys(rb.meta.unknown || {});
  if(!keys.length){ u.textContent = rb.roster.length ? "None — every character matched a known qualification." : "Upload a roster to scan."; return; }
  u.innerHTML = "";
  keys.sort((a,b)=>rb.meta.unknown[b]-rb.meta.unknown[a]).forEach(ch => {
    const t = el("span","tag x", `${ch} (${rb.meta.unknown[ch]}) +`);
    t.title = "Promote to a real qualification code";
    t.onclick = () => { if(!rb.cfg.quals.includes(ch)) rb.cfg.quals.push(ch); delete rb.meta.unknown[ch]; saveCfg(); renderQuals(); toast("Added qualification " + ch, "ok"); };
    u.appendChild(t);
  });
  u.appendChild(el("div","hint","Click a character to promote it to a qualification code. Anything left here is ignored by the engine."));
}
export function renderQualMap(){
  const t = $("qualMapTable");
  t.innerHTML = "<thead><tr><th>Position</th><th>Required qualifications (comma separated)</th></tr></thead>";
  const tb = el("tbody");
  rb.cfg.positions.forEach(p => {
    const cur = (rb.cfg.qualMap[p.fam] || []).join(",");
    const tr = el("tr");
    tr.innerHTML = `<td><b>${esc(p.fam)}</b> <span style="color:var(--tx3)">${esc(p.label)}</span></td>
                    <td><input value="${esc(cur)}" data-fam="${esc(p.fam)}" placeholder="none"></td>`;
    tb.appendChild(tr);
  });
  const tr = el("tr");
  tr.innerHTML = `<td><b>CT lanes</b> <span style="color:var(--tx3)">lane-specific seats only</span></td>
                  <td><input value="${esc(rb.cfg.ctQual)}" id="ctQualIn" style="max-width:120px"></td>`;
  tb.appendChild(tr);
  t.appendChild(tb);
  t.querySelectorAll("input[data-fam]").forEach(e => e.onchange = ev => {
    const v = ev.target.value.toUpperCase().split(",").map(x=>x.trim()).filter(Boolean);
    if(v.length) rb.cfg.qualMap[ev.target.dataset.fam] = v; else delete rb.cfg.qualMap[ev.target.dataset.fam];
    DB.set("config", rb.cfg);
  });
  const cq = $("ctQualIn");
  if(cq) cq.onchange = e => { rb.cfg.ctQual = e.target.value.trim().toUpperCase(); DB.set("config", rb.cfg); renderLanes(); };
}

/* ---- 5.6 column mapping / aliases / restrictions --------- */
export function renderMap(){
  const box = $("mapList"); box.innerHTML = "";
  const labels = { id:"Employee ID", name:"Name", title:"Job title", posn:"Position (rank sort)", loc:"Location", shift:"Shift",
                   start:"Start time", end:"End time", sex:"Sex", quals:"Quals", date:"Date", remarks:"Remarks" };
  for(const k in rb.cfg.colmap){
    const d = el("div");
    d.appendChild(el("span","lbl", labels[k] || k));
    const i = document.createElement("input");
    i.value = rb.cfg.colmap[k];
    i.onchange = () => { rb.cfg.colmap[k] = i.value.trim(); DB.set("config", rb.cfg); };
    d.appendChild(i); box.appendChild(d);
  }
}
export function renderAlias(){
  const t = $("aliasTable");
  t.innerHTML = "<thead><tr><th>Roster spelling</th><th>Canonical ID</th><th></th></tr></thead>";
  const tb = el("tbody");
  const ks = Object.keys(rb.cfg.aliases);
  if(!ks.length) tb.innerHTML = '<tr><td colspan="3" style="color:var(--tx3)">No explicit aliases. Hyphen/space and zero-padding are normalised automatically.</td></tr>';
  ks.forEach(k => {
    const tr = el("tr");
    tr.innerHTML = `<td>${esc(k)}</td><td>${esc(rb.cfg.aliases[k] || "(ignored)")}</td>
                    <td style="text-align:right"><button class="btn sm danger" data-k="${esc(k)}">×</button></td>`;
    tb.appendChild(tr);
  });
  t.appendChild(tb);
  t.querySelectorAll("[data-k]").forEach(b => b.onclick = () => { delete rb.cfg.aliases[b.dataset.k]; saveCfg(); });
}
export function renderRest(){
  const t = $("restTable");
  const ks = Object.keys(rb.cfg.restrictions || {});
  $("restEmpty").style.display = ks.length ? "none" : "block";
  t.innerHTML = ks.length ? "<thead><tr><th>KronosID</th><th>Name</th><th>Allowed positions</th><th></th></tr></thead>" : "";
  if(!ks.length) return;
  const tb = el("tbody");
  ks.forEach(k => {
    const r = rb.cfg.restrictions[k];
    const tr = el("tr");
    tr.innerHTML = `<td><code>${esc(k)}</code></td><td>${esc(r.name||"")}</td>
      <td><input value="${esc((r.allow||[]).join(", "))}" data-k="${esc(k)}"></td>
      <td style="text-align:right"><button class="btn sm danger" data-clr="${esc(k)}">Clear</button></td>`;
    tb.appendChild(tr);
  });
  t.appendChild(tb);
  t.querySelectorAll("input[data-k]").forEach(e => e.onchange = ev => {
    rb.cfg.restrictions[ev.target.dataset.k].allow = ev.target.value.toUpperCase().split(",").map(x=>x.trim()).filter(Boolean);
    DB.set("config", rb.cfg);
  });
  t.querySelectorAll("[data-clr]").forEach(b => b.onclick = () => {
    confirmBox("Clear restriction", `Remove the restriction for <b>${esc(rb.cfg.restrictions[b.dataset.clr].name||b.dataset.clr)}</b>?`,
      ()=>{ delete rb.cfg.restrictions[b.dataset.clr]; saveCfg(); toast("Restriction cleared."); });
  });
}
export function renderAdmin(){
  renderRules(); renderTitles(); renderLocs(); renderPos(); renderQuals(); renderProj();
  renderMap(); renderAlias(); renderRest(); storeInfo();
}
export function storeInfo(){
  DB.keys().then(ks => {
    const sheets = ks.filter(k => String(k).startsWith("sheet:")).length;
    $("storeInfo").innerHTML = `Roster: <b>${rb.roster.length}</b> rows${rb.meta.file ? " from " + esc(rb.meta.file) : ""}${rb.meta.when ? " · loaded " + esc(rb.meta.when) : ""}<br>Saved sheets: <b>${sheets}</b> · Locations: <b>${locList().length}</b> · Restrictions: <b>${Object.keys(rb.cfg.restrictions||{}).length}</b>`;
  });
}

/* ---- 5.7 adjustments modal ------------------------------- */
export function openAdj(){
  const locId = $("iLoc").value, date = $("iDate").value, shift = $("iShift").value;
  if(!locId) return toast("Select a location first.", "err");
  const win = currentWindow();
  const people = staffFor(rb.roster, locId, date, win.first, win.last + rb.cfg.rules.slot, rb.cfg, null, $("iShift").value);
  const t = $("adjTable");
  t.innerHTML = "<thead><tr><th>Officer</th><th>Window</th><th>Absent</th><th>Training (HH:MM-HH:MM)</th><th>Restrict to</th></tr></thead>";
  const tb = el("tbody");
  people.forEach(p => {
    const a = rb.adj[p.k] || {};
    const tr = el("tr");
    tr.innerHTML =
      `<td><b>${esc(p.n)}</b><div style="color:var(--tx3);font-size:11px">${esc(p.ti)} · ${esc(p.sex)} · ${esc(p.quals)}</div></td>
       <td style="color:var(--tx2)">${m2t(p.rawS)}–${m2t(p.rawE)}</td>
       <td><label class="chk"><input type="checkbox" data-k="${esc(p.k)}" data-f="out"${a.out?" checked":""}> out</label></td>
       <td><input data-k="${esc(p.k)}" data-f="train" value="${esc((a.train||[]).map(w=>m2t(w[0])+"-"+m2t(w[1])).join(", "))}" placeholder="e.g. 06:00-10:00"></td>
       <td><input data-k="${esc(p.k)}" data-f="restrict" value="${esc(((rb.cfg.restrictions[p.k]||{}).allow||a.restrict||[]).join(", "))}" placeholder="e.g. EXIT"></td>`;
    tb.appendChild(tr);
  });
  t.appendChild(tb);
  t.querySelectorAll("[data-k]").forEach(e => e.onchange = ev => {
    const k = ev.target.dataset.k, f = ev.target.dataset.f;
    rb.adj[k] = rb.adj[k] || {};
    if(f === "out") rb.adj[k].out = ev.target.checked;
    else if(f === "train") rb.adj[k].train = grabRanges(ev.target.value);
    else {
      const v = ev.target.value.toUpperCase().split(",").map(x=>x.trim()).filter(Boolean);
      rb.adj[k].restrict = v;
      const nm = (people.find(p=>p.k===k)||{}).n || "";
      if(v.length) rb.cfg.restrictions[k] = { name:nm, allow:v };
      else delete rb.cfg.restrictions[k];
      DB.set("config", rb.cfg);
    }
  });
  $("ovAdj").classList.add("on");
}

/* ---- 5.7b add officer to sheet --------------------------- */
let ADD_PICK = null;

export function openAdd(mode, seedFrom){
  const locId = $("iLoc").value, date = $("iDate").value;
  if(!locId) return toast("Select a location first.", "err");
  const win = currentWindow();
  if(!win || !win.cols.length) return toast("No sheet window for this location and shift.", "err");

  /* modset picker mirrors the location's real modsets */
  const L = rb.cfg.locations[locId];
  const sel = $("amMod");
  sel.innerHTML = '<option value="">Let the solver decide</option>';
  L.mods.forEach((lanes, mi) => {
    const on = lanes.filter(l => rb.lanes[l.n] !== false);
    if(!on.length) return;
    const o = el("option", null, `Modset ${mi+1} — lane${on.length>1?"s":""} ${on.map(l=>l.n).join(" & ")}`);
    o.value = String(mi + 1); sel.appendChild(o);
  });

  /* source-location filter */
  const others = [...new Set(rb.roster.filter(r => r.lo !== locId && (!date || !r.d || r.d === date)).map(r => r.lo))].sort();
  const sl = $("addSrcLoc");
  sl.innerHTML = '<option value="">All other locations</option>';
  others.forEach(o => { const op = el("option", null, o); op.value = o; sl.appendChild(op); });

  $("amStart").value = m2t(win.first);
  $("amEnd").value = m2t(win.last + rb.cfg.rules.slot);
  ADD_PICK = null;
  if(seedFrom){
    $("amName").value = ""; $("amTitle").value = seedFrom.ti || "TSO";
    $("amSex").value = seedFrom.sex || "M"; $("amQuals").value = seedFrom.quals || "";
    if(seedFrom.mod != null) $("amMod").value = String(seedFrom.mod);
  }
  document.querySelectorAll("#addSeg button").forEach(x => {
    const on = x.dataset.add === (mode === "manual" ? "manual" : "roster");
    x.classList.toggle("on", on);
  });
  $("addRoster").style.display = mode === "manual" ? "none" : "";
  $("addManual").style.display = mode === "manual" ? "" : "none";
  drawAddList(); drawAdded();
  $("ovAdd").classList.add("on");
}

export function drawAddList(){
  const locId = $("iLoc").value, date = $("iDate").value;
  const q = ($("addSearch").value || "").trim().toUpperCase();
  const src = $("addSrcLoc").value;
  const win = currentWindow();
  const box = $("addList"); box.innerHTML = "";

  const seen = {}, hits = [];
  for(const r of rb.roster){
    if(r.lo === locId) continue;
    if(date && r.d && r.d !== date) continue;
    if(src && r.lo !== src) continue;
    if(q && !(String(r.n).toUpperCase().includes(q) || String(r.ti).toUpperCase().includes(q) || String(r.q).toUpperCase().includes(q))) continue;
    const key = r.k + "|" + r.lo + "|" + r.s;
    if(seen[key]) continue; seen[key] = 1;
    hits.push(r);
    if(hits.length >= 250) break;
  }

  if(!hits.length){
    box.innerHTML = '<div style="padding:16px;color:var(--tx3);font-size:12.5px">No officers match — widen the search or check the date.</div>';
    $("addCount").textContent = "";
    return;
  }
  hits.forEach(r => {
    const d = el("div", "pick");
    d.dataset.k = r.k; d.dataset.lo = r.lo; d.dataset.s = r.s;
    d.innerHTML =
      `<div><div class="pn">${esc(r.n)}</div><div class="pd">${esc(r.ti || "—")} · ${esc(r.x || "?")} · ${esc(r.q || "no quals")}</div></div>` +
      `<div class="pr">${esc(r.lo)}<br>${m2t(r.s)}–${m2t(r.e)}</div>`;
    d.onclick = () => {
      box.querySelectorAll(".pick.on").forEach(x => x.classList.remove("on"));
      d.classList.add("on");
      ADD_PICK = r;
    };
    box.appendChild(d);
  });
  $("addCount").textContent = `${hits.length} officer${hits.length===1?"":"s"} shown` + (hits.length >= 250 ? " (first 250 — narrow the search)" : "");
}

export function drawAdded(){
  const box = $("addedList");
  if(!rb.extra.length){ box.className = "hint"; box.textContent = "None yet."; return; }
  box.className = ""; box.innerHTML = "";
  rb.extra.forEach((x, i) => {
    const t = el("span", "tag x", `${x.n} · ${x.ti}${x.mod ? " · M" + x.mod : ""}  ✕`);
    t.title = "Remove from this sheet";
    t.onclick = () => { rb.extra.splice(i, 1); drawAdded(); };
    box.appendChild(t);
  });
}

export function commitAdd(){
  const mode = $("addSeg").querySelector("button.on").dataset.add;
  const win = currentWindow();
  const modV = $("amMod").value;

  if(mode === "roster"){
    if(!ADD_PICK) return toast("Pick an officer from the list first.", "err");
    const r = ADD_PICK;
    if(rb.extra.some(x => x.k === r.k)) return toast(r.n + " is already added.", "err");
    const w0 = win.first, w1 = win.last + rb.cfg.rules.slot;
    const os = Math.max(r.s, w0), oe = Math.min(r.e, w1);
    const fits = (oe - os) >= rb.cfg.rules.slot;
    rb.extra.push({ k:r.k, n:r.n, ti:r.ti || "TSO", sex:r.x || "M", quals:r.q || "",
                   s: fits ? r.s : w0, e: fits ? r.e : w1,
                   mod: modV ? +modV : null, src: r.lo });
    if(!fits) toast(`${r.n} works ${m2t(r.s)}–${m2t(r.e)} at ${r.lo}; placed across the whole sheet window here.`, null);
    ADD_PICK = null;
    $("addList").querySelectorAll(".pick.on").forEach(x => x.classList.remove("on"));
  } else {
    const n = $("amName").value.trim();
    if(!n) return toast("Enter a name.", "err");
    const id = $("amId").value.trim() || ("MANUAL-" + uid().toUpperCase());
    if(rb.extra.some(x => x.k === id)) return toast("That employee ID is already added.", "err");
    rb.extra.push({
      k:id, n, ti:$("amTitle").value.trim() || "TSO", sex:$("amSex").value,
      quals:$("amQuals").value.trim().toUpperCase(),
      s:t2m($("amStart").value) != null ? t2m($("amStart").value) : win.first,
      e:t2m($("amEnd").value) != null ? t2m($("amEnd").value) : win.last + rb.cfg.rules.slot,
      mod: modV ? +modV : null, src: null
    });
    $("amName").value = ""; $("amId").value = "";
  }
  drawAdded();
  toast("Added. Press Add & Re-solve to place them.", "ok");
}

/* ---- 5.8 saved sheets ------------------------------------ */
export function sheetKey(loc,date,shift){ return "sheet:" + loc + "|" + (date||"nodate") + "|" + shift; }
export function refreshSaved(){
  return DB.keys().then(ks => {
    const sel = $("iSaved"); sel.innerHTML = '<option value="">— saved sheets —</option>';
    rb.savedIndex = {};
    ks.filter(k => String(k).startsWith("sheet:")).sort().forEach(k => {
      const lbl = String(k).slice(6).replace(/\|/g, "  ·  ");
      const o = el("option", null, lbl); o.value = k; sel.appendChild(o);
      rb.savedIndex[String(k).slice(6)] = true;
    });
  });
}
export function saveSheet(){
  const sh = rb.sheet; if(!sh) return;
  const payload = {
    locId: sh.locId, date: sh.date, shift: sh.shift, seed: sh.seed,
    cols: sh.cols, lanes: rb.lanes, locks: rb.locks, adj: rb.adj, extra: rb.extra,
    modOverride: rb.modOverride, removed: rb.removed,
    people: sh.people.map(p => ({ k:p.k, n:p.n, ti:p.ti, sex:p.sex, quals:p.quals, s:p.s, e:p.e, rawS:p.rawS, rawE:p.rawE, mod:p.mod, restrict:p.restrict, notes:p.notes, breaks:p.breaks, pinned:p.pinned })),
    grid: sh.grid, seats: sh.seats, diag: sh.diag, saved: new Date().toISOString()
  };
  DB.set(sheetKey(sh.locId, sh.date, sh.shift), payload)
    .then(refreshSaved).then(()=>toast("Sheet saved locally.", "ok"));
}
export function loadSheet(){
  const k = $("iSaved").value; if(!k) return toast("Pick a saved sheet.", "err");
  DB.get(k).then(p => {
    if(!p) return toast("Not found.", "err");
    rb.lanes = p.lanes || {}; rb.locks = p.locks || {}; rb.adj = p.adj || {}; rb.extra = p.extra || [];
    rb.modOverride = p.modOverride || {}; rb.removed = p.removed || {};
    rb.seed = p.seed;
    $("iLoc").value = p.locId; $("iDate").value = p.date || ""; $("iShift").value = p.shift;
    fillLocSelect();
    rb.sheet = { locId:p.locId, date:p.date, shift:p.shift, seed:p.seed, cols:p.cols, people:p.people, grid:p.grid, seats:p.seats, diag:p.diag };
    renderSheet();
    ["bXlsx","bCsv","bPrint","bSave","bReroll","bResolve","bAdjust","bClearMan","bAddOfficer"].forEach(i => $(i).disabled = false);
    toast("Sheet loaded.", "ok");
  });
}

/* ---- 5.9 briefcase / configured tool --------------------- */
export function exportBriefcase(){
  DB.keys().then(ks => Promise.all(ks.map(k => DB.get(k).then(v => [k,v]))).then(pairs => {
    const bag = { app:"rotation-builder", v:APP_VER, when:new Date().toISOString(), data:{} };
    pairs.forEach(([k,v]) => bag.data[k] = v);
    dl(new Blob([JSON.stringify(bag)], { type:"application/json" }), "RotationBuilder_Briefcase_" + todayKey() + ".json");
    toast("Briefcase exported.", "ok");
  }));
}
export function importBriefcase(file){
  const fr = new FileReader();
  fr.onload = () => {
    try{
      const bag = JSON.parse(fr.result);
      if(!bag.data) throw new Error("Not a briefcase file.");
      Promise.all(Object.keys(bag.data).map(k => DB.set(k, bag.data[k]))).then(()=>{
        toast("Briefcase imported — reloading.", "ok");
        setTimeout(()=>location.reload(), 700);
      });
    }catch(e){ toast("Import failed: " + e.message, "err"); }
  };
  fr.readAsText(file);
}
export function exportConfiguredTool(){
  const run = () => {
    if(!PRISTINE || PRISTINE.indexOf("<!--BAKED-->") < 0){
      toast("Configured tool template unavailable.", "err");
      return;
    }
    const baked = "<script id=\"bakedCfg\" type=\"application/json\">" +
                  JSON.stringify(rb.cfg).replace(/<\//g, "<\\/") + "<\/script>";
    const html = "<!DOCTYPE html>\n" + PRISTINE.replace("<!--BAKED-->", baked);
    dl(new Blob([html], { type:"text/html" }), "RotationBuilder_" + todayKey() + ".html");
    toast("Configured tool exported — share this file.", "ok");
  };
  if(PRISTINE) run();
  else loadStandaloneTemplate().then(run);
}

/* ---- 5.10 roster upload ---------------------------------- */
export function handleRoster(file){
  const fr = new FileReader();
  fr.onload = () => {
    try{
      const res = ingestWorkbook(fr.result, rb.cfg);
      rb.roster = res.rows;
      rb.meta = { file:file.name, rows:res.rows.length, when:new Date().toLocaleString(),
                 dates:Object.keys(res.dates).sort(), unknown:res.unknownQuals, locs:res.locsSeen };
      DB.set("roster", rb.roster); DB.set("rosterMeta", rb.meta);
      const d = rb.meta.dates;
      $("rosterInfo").innerHTML = `<b>${res.rows.length}</b> checkpoint rows · ${Object.keys(res.locsSeen).length} locations` +
        (d.length ? `<br>${d[0]} → ${d[d.length-1]}` : "") + `<br>${esc(file.name)}`;
      if(d.length && !$("iDate").value) $("iDate").value = d.includes(todayKey()) ? todayKey() : d[0];
      renderQuals(); storeInfo();
      if(res.noId) $("rosterInfo").innerHTML += `<br><span style="color:var(--warn)">No <b>${esc(rb.cfg.colmap.id)}</b> column — names used as keys. Persistent restrictions will not survive a name change.</span>`;
      if(res.soft && res.soft.length) $("rosterInfo").innerHTML += `<br><span style="color:var(--tx3)">Optional columns not found: ${esc(res.soft.join(", "))}</span>`;
      const unk = Object.keys(res.unknownQuals).length;
      toast(`Roster loaded — ${res.rows.length} rows` + (unk ? `, ${unk} unrecognised qual character(s)` : ""), "ok");
    }catch(e){ toast(e.message, "err"); $("rosterInfo").innerHTML = `<span style="color:var(--bad)">${esc(e.message)}</span>`; }
  };
  fr.readAsArrayBuffer(file);
}

/* ---- 5.10b projections ----------------------------------- */
export function projSummary(){
  const keys = Object.keys(rb.proj || {});
  if(!keys.length) return "None loaded — lane demand will not be checked.";
  const locs = [...new Set(keys.map(k => k.split("|")[0]))];
  const dates = [...new Set(keys.map(k => k.split("|")[1]).filter(Boolean))].sort();
  return `<b>${locs.length}</b> checkpoint${locs.length===1?"":"s"} · ` +
         (dates.length ? `${dates[0]}${dates.length>1?" → "+dates[dates.length-1]:""}` : "no dates") +
         `<br>${esc(locs.slice(0,6).join(", "))}${locs.length>6?" …":""}`;
}

export function handleProjections(file){
  const fr = new FileReader();
  fr.onload = () => {
    try{
      const res = ingestProjections(fr.result, rb.cfg);
      rb.proj = Object.assign({}, rb.proj, res.data);
      rb.projMeta = { file:file.name, when:new Date().toLocaleString(), rows:res.rows,
                     locs:res.locs, dates:res.dates, metrics:res.metrics, unmatched:res.unmatched };
      DB.set("proj", rb.proj); DB.set("projMeta", rb.projMeta);
      $("projInfo").innerHTML = projSummary();
      const um = Object.keys(res.unmatched || {});
      if(um.length) $("projInfo").innerHTML += `<br><span style="color:var(--warn)">Counted as standard: ${esc(um.join(", "))}</span>`;
      renderProj();
      toast(`Projections loaded — ${res.rows} rows, ${Object.keys(res.locs).length} checkpoint(s).`, "ok");
      if(rb.sheet) generate(false);
    }catch(e){
      toast(e.message, "err");
      $("projInfo").innerHTML = `<span style="color:var(--bad)">${esc(e.message)}</span>`;
    }
  };
  fr.readAsArrayBuffer(file);
}

export function renderProj(){
  const P = rb.cfg.proj;
  const set = (id, v) => { const e = $(id); if(e) e.value = v; };
  set("pMode", P.mode); set("pPax", P.paxPerLane); set("pPre", P.prePerLane);
  set("pPeak", P.peakFactor); set("pMin", P.minLanes);
  set("pFirst", P.firstLaneStaff); set("pExtra", P.extraLaneStaff);
  set("pStdKey", P.stdKey); set("pPreKey", P.preKey);
  const keys = Object.keys(rb.proj || {});
  set("pLoaded", keys.length ? keys.length + " checkpoint-days" : "nothing loaded");

  const step = P.paxPerLane;
  $("pExplain").innerHTML =
    `At ${step} passengers per lane per hour: up to ${step} → 1 lane, up to ${step*2} → 2, up to ${step*3} → 3, and so on, ` +
    `capped at the lanes the checkpoint physically has. ` +
    (P.mode === "standard" ? "PreCheck volume is ignored." :
     P.mode === "combined" ? "PreCheck and standard volume are added together and divided by the standard rate." :
     `PreCheck is sized separately at ${P.prePerLane} per lane per hour and added on top.`) +
    (P.peakFactor !== 1 ? ` Every hour is multiplied by ${P.peakFactor} to allow for surges inside the hour.` : "");

  const box = $("pMapList"); box.innerHTML = "";
  const labels = { date:"Date", term:"Terminal", ckpt:"Checkpoint", metric:"Metric", value:"Value", hour:"Hour of day" };
  for(const k in P.colmap){
    const d = el("div");
    d.appendChild(el("span","lbl", labels[k] || k));
    const i = document.createElement("input");
    i.value = P.colmap[k];
    i.onchange = () => { P.colmap[k] = i.value.trim(); DB.set("config", rb.cfg); };
    d.appendChild(i); box.appendChild(d);
  }
}

export function wireProj(){
  $("bProj").onclick = () => $("fProj").click();
  $("fProj").onchange = e => { if(e.target.files[0]) handleProjections(e.target.files[0]); e.target.value = ""; };
  const num = { pPax:"paxPerLane", pPre:"prePerLane", pPeak:"peakFactor", pMin:"minLanes",
                pFirst:"firstLaneStaff", pExtra:"extraLaneStaff" };
  for(const id in num) $(id).onchange = e => {
    rb.cfg.proj[num[id]] = Number(e.target.value); DB.set("config", rb.cfg); renderProj();
    if(rb.sheet) generate(false);
  };
  $("pMode").onchange = e => { rb.cfg.proj.mode = e.target.value; DB.set("config", rb.cfg); renderProj(); if(rb.sheet) generate(false); };
  $("pStdKey").onchange = e => { rb.cfg.proj.stdKey = e.target.value.trim(); DB.set("config", rb.cfg); };
  $("pPreKey").onchange = e => { rb.cfg.proj.preKey = e.target.value.trim(); DB.set("config", rb.cfg); };
}
