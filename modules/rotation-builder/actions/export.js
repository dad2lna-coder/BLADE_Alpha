/** Excel, CSV, and the table those files are built from. */
import { rb } from "../stores/rotationStore.js";
import { toast } from "../utils/dom.js";
import { m2t, m2hhmm } from "../utils/time.js";

/* ---- 4.6 exports ----------------------------------------- */
export function sheetAOA(){
  const sh = rb.sheet;
  const head = ["CERT?","NAME","TITLE","MOD"].concat(sh.cols.map(m2hhmm));
  const rows = [head];
  const byMod = {};
  sh.people.forEach(p => (byMod[p.mod ?? "?"] = byMod[p.mod ?? "?"] || []).push(p));
  const laneOf = {};
  sh.seats.forEach(st => { if(st.laneN) (laneOf[st.mod] = laneOf[st.mod] || new Set()).add(st.laneN); });
  Object.keys(byMod).sort().forEach(mk => {
    const lanes = [...(laneOf[mk] || [])].sort((a,b)=>a-b);
    rows.push([`MODSET ${mk}` + (lanes.length ? ` — lane${lanes.length>1?"s":""} ${lanes.join(" & ")}` : ""), "", "", ""]
      .concat(sh.cols.map(()=>"")));
    byMod[mk].forEach(p => {
      const rk = p.k + "|" + p.s;
      rows.push([p.quals, p.n, p.ti, mk === "?" ? "" : "M" + mk]
        .concat((sh.grid[rk]||[]).map(c => c ? c.c : "")));
    });
  });
  return rows;
}
export function fileStem(){
  const sh = rb.sheet;
  return `Rotation_${sh.locId}_${sh.shift}_${(sh.date||"nodate").replace(/-/g,"")}`;
}
export function dl(blob, name){
  const u = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = u; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(()=>{ URL.revokeObjectURL(u); a.remove(); }, 400);
}

export function aoaToCsv(rows){
  return rows.map(r => r.map(v => {
    const s = String(v==null?"":v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s;
  }).join(",")).join("\r\n");
}

export function rotationWorkbook(XLSX){
  const sh = rb.sheet;
  const info = [
    ["Location", sh.locId], ["Shift", sh.shift], ["Date", sh.date || ""],
    ["Window", m2t(sh.cols[0]) + "–" + m2t(sh.cols[sh.cols.length-1] + rb.cfg.rules.slot)],
    ["Officers", sh.people.length], ["Positions", sh.seats.length],
    ["Seed", sh.seed], ["Generated", new Date().toLocaleString()], []
  ];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(sheetAOA());
  ws["!cols"] = [{wch:14},{wch:26},{wch:10},{wch:6}].concat(sh.cols.map(()=>({wch:6})));
  ws["!freeze"] = { xSplit:4, ySplit:1 };
  XLSX.utils.book_append_sheet(wb, ws, String(sh.shift || "Sheet").slice(0, 31));
  const d = XLSX.utils.aoa_to_sheet(info.concat((sh.diag || []).map(x => [({e:"BLOCKING",w:"WARNING",i:"INFO",g:"OK"})[x.k], String(x.m || "").replace(/<[^>]+>/g,"")])));
  d["!cols"] = [{wch:12},{wch:120}];
  XLSX.utils.book_append_sheet(wb, d, "Notes");
  return wb;
}

export function exportXlsx(){
  const XLSX = globalThis.XLSX;
  const out = XLSX.write(rotationWorkbook(XLSX), { bookType:"xlsx", type:"array" });
  dl(new Blob([out], { type:"application/octet-stream" }), fileStem() + ".xlsx");
  toast("Excel exported.", "ok");
}

export function exportCsv(){
  dl(new Blob([aoaToCsv(sheetAOA())], { type:"text/csv" }), fileStem() + ".csv");
  toast("CSV exported.", "ok");
}
