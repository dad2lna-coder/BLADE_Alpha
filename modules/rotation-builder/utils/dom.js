/** DOM helpers used by the rotation panel. */
export function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
export function $(id){ return document.getElementById(id); }
export function el(tag, cls, txt){ const e=document.createElement(tag); if(cls) e.className=cls; if(txt!=null) e.textContent=txt; return e; }

let TOAST_T = null;
export function toast(msg, kind){
  const t = $("toast");
  t.textContent = msg;
  t.className = "toast on" + (kind ? " "+kind : "");
  clearTimeout(TOAST_T);
  TOAST_T = setTimeout(()=>{ t.className = "toast" + (kind?" "+kind:""); }, 2600);
}
export function confirmBox(title, body, onOk){
  $("cfTitle").textContent = title;
  $("cfBody").innerHTML = body;
  const ov = $("ovConfirm");
  ov.classList.add("on");
  const btn = $("bCfOk");
  const clone = btn.cloneNode(true);
  btn.parentNode.replaceChild(clone, btn);
  clone.onclick = ()=>{ ov.classList.remove("on"); onOk(); };
}
