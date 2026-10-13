/** Event binding and startup. Does not read scheduler.state. */
import { RB_DEMO } from "../data/rbDemo.js";
import { rb, DB, defaultConfig, stripDummyLocations } from "../stores/rotationStore.js";
import { esc, toast, confirmBox, $ } from "../utils/dom.js";
import { t2m, m2t, todayKey } from "../utils/time.js";
import { solve, sheetWindow, buildSeats, buildRings } from "../utils/engine.js";
import { staffFor, ingestProjections, laneDemand, lanesFor, staffableLanes } from "../utils/projections.js";
import { ingestWorkbook } from "../utils/roster.js";
import { fillLocSelect, fillTerms, generate, renderLanes, renderSheet, locList, currentWindow, extraToPerson } from "./generate.js";
import { beginEdit, endEdit, validateAll, clearRow, syncSticky, beginNameEdit, beginModEdit, swapOfficer, removeOfficer, benchOfficers, closePEdit, PEDIT, EDITING } from "./edit.js";
import { sheetAOA, exportCsv, exportXlsx } from "./export.js";
import { dl } from "./export.js";
import {
  loadStandaloneTemplate, renderAdmin, wireRules, wireProj, saveCfg, openLocModal, saveLocModal,
  openAdd, commitAdd, refreshSaved, saveSheet, loadSheet, exportBriefcase, importBriefcase,
  exportConfiguredTool, handleRoster, handleProjections, projSummary, openAdj, drawAddList
} from "./config.js";

export function wire(){
    document.querySelectorAll("#rb-app .tab").forEach(b => b.onclick = () => {
    document.querySelectorAll("#rb-app .tab").forEach(x => x.classList.remove("on"));
    b.classList.add("on");
    const v = b.dataset.v;
    $("buildView").classList.toggle("on", v === "build");
    $("adminView").classList.toggle("on", v === "admin");
    $("sideBar").style.display = v === "build" ? "" : "none";
  });
  document.querySelectorAll("[data-close]").forEach(b => b.onclick = e => e.target.closest(".ov").classList.remove("on"));
  document.querySelectorAll(".ov").forEach(o => o.onclick = e => { if(e.target === o) o.classList.remove("on"); });

  $("bUpload").onclick = () => $("fRoster").click();
  if($("bDemo")) $("bDemo").onclick = () => loadDemo(true);
  $("fRoster").onchange = e => { if(e.target.files[0]) handleRoster(e.target.files[0]); e.target.value = ""; };
  $("iTerm").onchange = fillLocSelect;
  $("iLoc").onchange = () => {
    rb.lanes = {}; rb.extra = []; rb.modOverride = {}; rb.removed = {}; renderLanes();
    const L = rb.cfg.locations[$("iLoc").value];
    if(L){ $("iStart").value = ""; $("iEnd").value = ""; }
  };
  $("iShift").onchange = () => { $("shiftHint").textContent = $("iShift").value === "AM"
      ? `AM ends ${rb.cfg.rules.seamAM}` : `PM starts ${rb.cfg.rules.seamPM} · carries the AM seam if saved`; };
  $("bGen").onclick = () => generate(true);
  $("bReroll").onclick = () => { rb.locks = {}; generate(true); };
  $("bResolve").onclick = () => generate(false);
  $("bClearMan").onclick = () => { rb.locks = {}; generate(false); toast("Manual edits and cleared rows restored."); };
  $("bAdjust").onclick = openAdj;
  $("bAddOfficer").onclick = () => openAdd();
  $("bAddApply").onclick = () => { commitAdd(); if(rb.extra.length){ $("ovAdd").classList.remove("on"); generate(false); } };
  $("addSearch").oninput = drawAddList;
  $("addSrcLoc").onchange = drawAddList;
  document.querySelectorAll("#addSeg button").forEach(b => b.onclick = () => {
    document.querySelectorAll("#addSeg button").forEach(x => x.classList.remove("on"));
    b.classList.add("on");
    $("addRoster").style.display = b.dataset.add === "roster" ? "" : "none";
    $("addManual").style.display = b.dataset.add === "manual" ? "" : "none";
  });
  $("diagToggle").onclick = () => {
    rb.diagMin = !rb.diagMin;
    $("diagPanel").classList.toggle("min", rb.diagMin);
    DB.set("diagMin", rb.diagMin);
  };
  $("bAdjApply").onclick = () => { $("ovAdj").classList.remove("on"); generate(false); };
  $("bXlsx").onclick = exportXlsx;
  $("bCsv").onclick = exportCsv;
  $("bPrint").onclick = () => window.print();
  $("bSave").onclick = saveSheet;
  $("bLoad").onclick = loadSheet;
  $("bDelSheet").onclick = () => {
    const k = $("iSaved").value; if(!k) return toast("Pick a saved sheet.", "err");
    confirmBox("Delete sheet", "Remove <b>" + esc(String(k).slice(6)) + "</b> from local storage?", ()=>DB.del(k).then(refreshSaved).then(()=>toast("Deleted.")));
  };
  $("bAddLoc").onclick = () => openLocModal(null);
  $("bLocSave").onclick = saveLocModal;
  $("bAddPos").onclick = () => { rb.cfg.positions.push({ fam:"NEW", label:"New position", scope:"lane", seats:1 }); saveCfg(); };
  $("bAddQual").onclick = () => {
    const v = $("iNewQual").value.trim().toUpperCase();
    if(!v) return;
    if(!rb.cfg.quals.includes(v)) rb.cfg.quals.push(v);
    $("iNewQual").value = ""; saveCfg();
  };
  $("bAddAlias").onclick = () => {
    const f = $("iAliasFrom").value.trim().toUpperCase();
    if(!f) return;
    rb.cfg.aliases[f] = $("iAliasTo").value.trim().toUpperCase();
    $("iAliasFrom").value = ""; $("iAliasTo").value = ""; saveCfg();
  };
  $("bExpCfg").onclick = () => dl(new Blob([JSON.stringify(rb.cfg,null,2)],{type:"application/json"}), "RotationConfig_" + todayKey() + ".json");
  $("bImpCfg").onclick = () => $("fCfg").click();
  $("fCfg").onchange = e => {
    const f = e.target.files[0]; if(!f) return;
    const fr = new FileReader();
    fr.onload = () => { try{ rb.cfg = Object.assign(defaultConfig(), JSON.parse(fr.result)); saveCfg(); toast("Configuration imported.", "ok"); }
                        catch(x){ toast("Invalid config file.", "err"); } };
    fr.readAsText(f); e.target.value = "";
  };
  $("bResetCfg").onclick = () => confirmBox("Reset configuration", "Restore all rules, locations, positions and qualifications to defaults? Saved sheets and the roster are kept.", ()=>{ rb.cfg = defaultConfig(); saveCfg(); toast("Defaults restored.", "ok"); });
  $("bBuildTool").onclick = exportConfiguredTool;
  $("bExpAll").onclick = exportBriefcase;
  $("bImpAll").onclick = () => $("fAll").click();
  $("fAll").onchange = e => { if(e.target.files[0]) importBriefcase(e.target.files[0]); e.target.value = ""; };
  $("bWipe").onclick = () => confirmBox("Wipe local data", "Delete the roster, all saved sheets and the configuration from this browser. This cannot be undone.", ()=>{
    DB.keys().then(ks => Promise.all(ks.map(k => DB.del(k)))).then(()=>{ toast("Local data wiped."); setTimeout(()=>location.reload(), 600); });
  });
  wireRules(); wireProj();

  document.addEventListener("click", e => {
    const clr = e.target.closest("[data-clear]");
    if(clr){ e.preventDefault(); clearRow(clr.dataset.clear); return; }
    if(rb.sheet){
      const nameTd = e.target.closest("#sheetTable td.name");
      if(nameTd && !nameTd.querySelector("select")){ beginNameEdit(nameTd); return; }
      const modTd = e.target.closest("#sheetTable td.modcol");
      if(modTd && !modTd.querySelector("select")){ beginModEdit(modTd); return; }
    }
    if(PEDIT && !e.target.closest("select")) closePEdit();
    const td = e.target.closest("td.cel");
    document.querySelectorAll("td.cel.sel").forEach(x => x.classList.remove("sel"));
    if(!td || !rb.sheet) return;
    if(td.classList.contains("off")) return;
    if(td.querySelector("select")) return;
    td.classList.add("sel");
    beginEdit(td);
  });
  document.addEventListener("keydown", e => {
    if(EDITING) return;
    const sel = document.querySelector("td.cel.sel");
    if(sel && (e.key === "Enter" || e.key === "F2")){ e.preventDefault(); beginEdit(sel); }
    if(e.key === "Escape" && $("ovAdd").classList.contains("on")) $("ovAdd").classList.remove("on");
  });
  window.addEventListener("beforeprint", () => { if(EDITING) endEdit(true); });
  let _rz = null;
  window.addEventListener("resize", () => { clearTimeout(_rz); _rz = setTimeout(syncSticky, 120); });
}

export function loadDemo(persist){
  if(!window.RB_DEMO || !RB_DEMO.roster){ toast("Demo data missing.", "err"); return; }
  rb.roster = RB_DEMO.roster;
  rb.meta = Object.assign({}, RB_DEMO.meta);
  rb.proj = RB_DEMO.proj;
  rb.projMeta = Object.assign({}, RB_DEMO.projMeta || {});
  if(persist !== false){
    DB.set("roster", rb.roster); DB.set("rosterMeta", rb.meta);
    DB.set("proj", rb.proj); DB.set("projMeta", rb.projMeta);
  }
  const d = (rb.meta.dates || []);
  $("rosterInfo").innerHTML = "<b>" + rb.roster.length + "</b> checkpoint rows · demo roster" +
    (d.length ? "<br>" + d[0] : "") + "<br>(baked demo)";
  $("projInfo").innerHTML = (typeof projSummary === "function") ? projSummary() : "Demo projections loaded.";
  if(d.length) $("iDate").value = d[0];
  fillTerms(); fillLocSelect();
  if($("iLoc") && !$("iLoc").value){
    const first = $("iLoc").querySelector("option[value]:not([value=''])");
    if(first){ $("iLoc").value = first.value; $("iLoc").dispatchEvent(new Event("change")); }
  }
  if($("iShift")) $("iShift").value = "AM";
  toast("Demo roster loaded — pick Generate.", "ok");
  syncBladeChrome();
}

export function syncBladeChrome(){
  const d = $("iDate") && $("iDate").value;
  const sh = $("iShift") && $("iShift").value;
  if($("bladeDate") && d) $("bladeDate").textContent = d;
  if($("bladeShift") && sh) $("bladeShift").textContent = sh;
  if($("bladeRows")) $("bladeRows").textContent = (rb.roster && rb.roster.length) ? rb.roster.length : 0;
}

export function boot(){
  const baked = document.getElementById("bakedCfg");
  let bakedCfg = null;
  if(baked){ try{ bakedCfg = JSON.parse(baked.textContent); }catch(e){} }

  DB.get("diagMin").then(v => { rb.diagMin = !!v; }).catch(()=>{});

  DB.get("config").then(c => {
    rb.cfg = Object.assign(defaultConfig(), bakedCfg || {}, c || {});
    rb.cfg.rules = Object.assign(defaultConfig().rules, (bakedCfg&&bakedCfg.rules)||{}, (c&&c.rules)||{});
    const stripped = stripDummyLocations(rb.cfg);
    if((!c && bakedCfg) || stripped) DB.set("config", rb.cfg);
    return Promise.all([DB.get("roster"), DB.get("rosterMeta"), DB.get("proj"), DB.get("projMeta")]);
  }).then(([r, m, pj, pm]) => {
    if((!r || !r.length) && window.RB_DEMO && RB_DEMO.roster){
      r = RB_DEMO.roster; m = RB_DEMO.meta;
    }
    if(!pj && window.RB_DEMO && RB_DEMO.proj){
      pj = RB_DEMO.proj; pm = RB_DEMO.projMeta;
    }
    if((!r || !r.length) && window.RB_DEMO && RB_DEMO.roster){
      r = RB_DEMO.roster; m = RB_DEMO.meta;
    }
    if(!pj && window.RB_DEMO && RB_DEMO.proj){
      pj = RB_DEMO.proj; pm = RB_DEMO.projMeta;
    }
    if((!r || !r.length) && window.RB_DEMO && RB_DEMO.roster){
      r = RB_DEMO.roster; m = RB_DEMO.meta;
    }
    if(!pj && window.RB_DEMO && RB_DEMO.proj){
      pj = RB_DEMO.proj; pm = RB_DEMO.projMeta;
    }
    if((!r || !r.length) && window.RB_DEMO && RB_DEMO.roster){
      r = RB_DEMO.roster; m = RB_DEMO.meta;
    }
    if(!pj && window.RB_DEMO && RB_DEMO.proj){
      pj = RB_DEMO.proj; pm = RB_DEMO.projMeta;
    }
    if((!r || !r.length) && window.RB_DEMO && RB_DEMO.roster){
      r = RB_DEMO.roster; m = RB_DEMO.meta;
    }
    if(!pj && window.RB_DEMO && RB_DEMO.proj){
      pj = RB_DEMO.proj; pm = RB_DEMO.projMeta;
    }
    if(pj){ rb.proj = pj; rb.projMeta = pm || {}; }
    if(r && r.length){ rb.roster = r; rb.meta = m || rb.meta;
      const d = (rb.meta.dates||[]);
      $("rosterInfo").innerHTML = `<b>${r.length}</b> checkpoint rows${rb.meta.locs?" · "+Object.keys(rb.meta.locs).length+" locations":""}` +
        (d.length ? `<br>${d[0]} → ${d[d.length-1]}` : "") + (rb.meta.file ? `<br>${esc(rb.meta.file)}` : "");
      if(d.length) $("iDate").value = d.includes(todayKey()) ? todayKey() : d[0];
    }
    fillTerms(); fillLocSelect(); renderAdmin(); wire(); refreshSaved();
    $("projInfo").innerHTML = projSummary();
    if(!$("iDate").value) $("iDate").value = todayKey();
    if(rb.roster && rb.roster.length && $("iLoc") && !$("iLoc").value){
      $("iLoc").value = ($("iLoc").querySelector("option[value]:not([value=''])") || {}).value || "";
      $("iLoc").dispatchEvent(new Event("change"));
    }
    if(rb.roster && rb.roster.length && $("iLoc") && !$("iLoc").value){
      $("iLoc").value = ($("iLoc").querySelector("option[value]:not([value=''])") || {}).value || "";
      $("iLoc").dispatchEvent(new Event("change"));
    }
    if(rb.roster && rb.roster.length && $("iLoc") && !$("iLoc").value){
      $("iLoc").value = ($("iLoc").querySelector("option[value]:not([value=''])") || {}).value || "";
      $("iLoc").dispatchEvent(new Event("change"));
    }
    if(rb.roster && rb.roster.length && $("iLoc") && !$("iLoc").value){
      $("iLoc").value = ($("iLoc").querySelector("option[value]:not([value=''])") || {}).value || "";
      $("iLoc").dispatchEvent(new Event("change"));
    }
    if(rb.roster && rb.roster.length && $("iLoc") && !$("iLoc").value){
      $("iLoc").value = ($("iLoc").querySelector("option[value]:not([value=''])") || {}).value || "";
      $("iLoc").dispatchEvent(new Event("change"));
    }
    $("iShift").dispatchEvent(new Event("change"));
    syncBladeChrome();

  }).catch(e => {
    console.error(e);
    fillTerms(); fillLocSelect(); renderAdmin(); wire();
    toast("Local storage unavailable — the tool still runs, but nothing will persist.", "err");
  });
}


export function publishRotationDebug(){
  if(typeof window === "undefined") return;
  window.RB_DEMO = RB_DEMO;
  window.RB = { rb, generate, solve, renderSheet, sheetAOA, exportCsv, exportXlsx,
    exportConfiguredTool, ingestWorkbook, staffFor, sheetWindow,
    buildSeats, buildRings, beginEdit, endEdit, validateAll, m2t, t2m, DB,
    clearRow, openAdd, commitAdd, extraToPerson, syncSticky,
    beginNameEdit, beginModEdit, swapOfficer, removeOfficer, benchOfficers,
    ingestProjections, laneDemand, lanesFor, staffableLanes, handleProjections };
}

export function attachRotation(scheduler){
  void scheduler;
  if(typeof window !== "undefined") window.RB_DEMO = RB_DEMO;
  loadStandaloneTemplate();
}

export function bindRotation(scheduler){
  void scheduler;
  publishRotationDebug();
  boot();
}
