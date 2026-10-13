/** Time, dates, location ids, seeded shuffle. */
/* ---- time helpers ---------------------------------------- */
export function t2m(t){
  if(t===null||t===undefined||t==="") return null;
  if(typeof t === "number"){ // excel fraction of a day
    if(t>0 && t<1) return Math.round(t*1440);
    return Math.round(t);
  }
  if(t instanceof Date) return t.getHours()*60 + t.getMinutes();
  const s = String(t).trim();
  let m = s.match(/^(\d{1,2}):(\d{2})/);
  if(m) return (+m[1])*60 + (+m[2]);
  m = s.match(/^(\d{1,2})(\d{2})$/);
  if(m) return (+m[1])*60 + (+m[2]);
  return null;
}
export function m2t(m){
  if(m===null||m===undefined) return "";
  m = ((m % 1440) + 1440) % 1440;
  return String(Math.floor(m/60)).padStart(2,"0") + ":" + String(m%60).padStart(2,"0");
}
export function m2hhmm(m){ return m2t(m).replace(":",""); }
export function snapDown(m,step){ return Math.floor(m/step)*step; }
export function snapUp(m,step){ return Math.ceil(m/step)*step; }
export function ovl(a1,a2,b1,b2){ return a1 < b2 && b1 < a2; }

export function dkey(d){
  if(!d) return "";
  if(d instanceof Date && !isNaN(d)){
    return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  }
  const s = String(d).trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(m) return m[1]+"-"+m[2]+"-"+m[3];
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if(m) return m[3]+"-"+String(+m[1]).padStart(2,"0")+"-"+String(+m[2]).padStart(2,"0");
  const p = new Date(s);
  return isNaN(p) ? "" : dkey(p);
}
export function todayKey(){ return dkey(new Date()); }

/* ---- location normalisation ------------------------------ */
export function normLoc(raw, cfg){
  if(raw===null||raw===undefined) return "";
  let s = String(raw).trim().toUpperCase().replace(/\s+/g," ");
  if(cfg && cfg.aliases){
    for(const k in cfg.aliases){
      if(k.toUpperCase() === s) return cfg.aliases[k];
    }
  }
  const m = s.match(/^CKPT[\s\-_]*([A-E])[\s\-_]*0*(\d{1,3})\s*$/);
  if(m) return "CKPT-" + m[1] + String(+m[2]).padStart(2,"0");
  return s;
}

export function uid(){ return Math.random().toString(36).slice(2,10); }

/* seeded PRNG (mulberry32) — same seed ⇒ same sheet */
export function rng(seed){
  let a = seed >>> 0;
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle(arr, rnd){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){ const j = Math.floor(rnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
