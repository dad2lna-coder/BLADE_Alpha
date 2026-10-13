/** Rotation Builder state, defaults, and IndexedDB (rotationBuilder / kv). */
export const APP_VER = "1.0.0";

/* ---- position families ---------------------------------- */
export const DEF_POS = [
  { fam:"T",    label:"TDC",          scope:"lane", seats:1 },
  { fam:"D",    label:"Divest",       scope:"lane", seats:1 },
  { fam:"P",    label:"PSO",          scope:"lane", seats:1 },
  { fam:"X",    label:"X-ray",        scope:"lane", seats:1 },
  { fam:"SO",   label:"Body Scanner", scope:"mod",  seats:2 },
  { fam:"M",    label:"WTMD",         scope:"mod",  seats:1 },
  { fam:"KCM",  label:"KCM",          scope:"site", seats:1 },
  { fam:"EXIT", label:"Exit Lane",    scope:"site", seats:1 }
];

export const DEF_QUALS = ["1","2","3","4","6","8","9","0","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","X","Z"];

/* ---- location catalogue (derived from supplied parameters) */
const L = (t,open,close,mods,kcm,exit)=>({t,open,close,mods,kcm:kcm||null,exit:exit||{am:0,pm:0}});
const lane = (n,ct)=>({n,ct:ct?1:0});

export const DEF_LOCS = {
  "CKPT-A12": L("A","04:00","20:00",[[lane(1,1),lane(2,0)],[lane(3,0)]]),
  "CKPT-A20": L("A","03:30","20:00",[[lane(1,0),lane(2,0)]]),
  "CKPT-A21": L("A","03:00","22:30",[[lane(1,0),lane(2,0)],[lane(3,0),lane(4,0)]],{open:"03:00",close:"20:00"}),
  "CKPT-A35": L("A","04:30","20:00",[[lane(1,0),lane(2,0)],[lane(3,0)]]),
  "CKPT-B09": L("B","04:30","21:00",[[lane(1,1),lane(2,0)],[lane(3,0)]]),
  "CKPT-B30": L("B","04:30","22:45",[[lane(1,0),lane(2,0)],[lane(3,0)]],{open:"04:30",close:"19:00"}),
  "CKPT-C10": L("C","05:00","13:00",[[lane(1,0),lane(2,0)]],null,{am:1,pm:0}),
  "CKPT-C11": L("C","04:00","21:00",[[lane(1,0),lane(2,0)]],{open:"03:30",close:"21:00"},{am:0,pm:1}),
  "CKPT-C21": L("C","03:30","22:30",[[lane(1,0),lane(2,1)],[lane(3,0),lane(4,0)],[lane(5,0)]]),
  "CKPT-D18": L("D","04:00","23:00",[[lane(1,0),lane(2,0)],[lane(3,0)]],null,{am:1,pm:1}),
  "CKPT-D22": L("D","05:00","21:00",[[lane(1,0),lane(2,0)],[lane(3,1),lane(4,0)],[lane(5,0),lane(6,0)]],{open:"05:00",close:"21:00"}),
  "CKPT-D30": L("D","03:30","23:00",[[lane(1,0),lane(2,0)],[lane(3,0),lane(4,0)]],null,{am:1,pm:1}),
  "CKPT-E08": L("E","03:45","20:30",[[lane(1,0),lane(2,0)],[lane(3,0)]]),
  "CKPT-E16": L("E","04:00","20:00",[[lane(1,0),lane(2,0)]],{open:"04:00",close:"19:00"}),
  "CKPT-E18": L("E","03:00","23:00",[[lane(1,1),lane(2,0)],[lane(3,0),lane(4,0)]]),
  "CKPT-E33": L("E","04:00","20:30",[[lane(1,0),lane(2,0)]])
};

export const DEF_TITLES = { TSO:1, LTSO:1, STSO:0, "Phase 1":1, "TSO/DFO":1, "TSO DFO":1, "LTSO/DFO":1, ESTI:1, CCO:0, SCCO:0, MSTI:0, PA:0, TSM:0, Officer:0, ETSO:0 };

export const DEF_MAP = { id:"KronosID", name:"EmployeeName", title:"Job Title", posn:"Position",
                  loc:"Location", shift:"Shift", start:"Start", end:"End",
                  sex:"Sex", quals:"Quals", date:"Date", remarks:"Remarks" };

export function defaultConfig(){
  return {
    v: APP_VER,
    rules: {
      slot: 30, seamAM: "11:00", seamPM: "11:30",
      femPerMod: 4, brkTarget: 1, brkMax: 2, brkHours: 6, laneMin: 5,
      allowRepeat: false, breakClears: true, femScale: true, pinSingle: true, strictShift: true,
      dropOrder: "M,X,D,P,EXIT,KCM,T,SO",
      ring: "M,SO-A,P-A,X-A,D-A,T-A,EXIT,SO-B,P-B,X-B,D-B,T-B,KCM"
    },
    positions: JSON.parse(JSON.stringify(DEF_POS)),
    quals: DEF_QUALS.slice(),
    qualMap: {},                    /* per-position quals; CT lanes handled by ctQual */
    ctQual: "Z",
    locations: JSON.parse(JSON.stringify(DEF_LOCS)),
    titles: Object.assign({}, DEF_TITLES),
    colmap: Object.assign({}, DEF_MAP),
    aliases: { "CKPT-NORTH":"" },
    proj: {
      mode: "standard",        /* standard | combined | separate */
      paxPerLane: 150,         /* standard-screening throughput, pax per lane per hour */
      prePerLane: 260,         /* PreCheck throughput per lane per hour */
      peakFactor: 1.0,         /* multiplier for within-the-hour surges */
      minLanes: 1,             /* lanes to keep open while the location is open */
      firstLaneStaff: 5,       /* officers to run one lane: TDC, Divest, X-ray, PSO, WTMD */
      extraLaneStaff: 3,       /* each additional lane in a modset: Divest, X-ray, PSO */
      warnAt: 1,               /* short by this many lanes before warning */
      colmap: { date:"Date", term:"Terminal", ckpt:"Checkpoint",
                metric:"Metrics", value:"Sum of Value", hour:"Hour of Day" },
      stdKey: "Standard", preKey: "PreCheck"
    },
    restrictions: {}
  };
}

/* ---- tiny IndexedDB wrapper ------------------------------ */
export const DB = (()=>{
  let db=null;
  function open(){
    return new Promise((res,rej)=>{
      if(db) return res(db);
      const rq = indexedDB.open("rotationBuilder", 1);
      rq.onupgradeneeded = e => {
        const d = e.target.result;
        if(!d.objectStoreNames.contains("kv")) d.createObjectStore("kv");
      };
      rq.onsuccess = e => { db = e.target.result; res(db); };
      rq.onerror = e => rej(e.target.error);
    });
  }
  function tx(mode){ return open().then(d => d.transaction("kv", mode).objectStore("kv")); }
  return {
    get(k){ return tx("readonly").then(s => new Promise((res,rej)=>{
      const r = s.get(k); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); })); },
    set(k,v){ return tx("readwrite").then(s => new Promise((res,rej)=>{
      const r = s.put(v,k); r.onsuccess=()=>res(true); r.onerror=()=>rej(r.error); })); },
    del(k){ return tx("readwrite").then(s => new Promise((res,rej)=>{
      const r = s.delete(k); r.onsuccess=()=>res(true); r.onerror=()=>rej(r.error); })); },
    keys(){ return tx("readonly").then(s => new Promise((res,rej)=>{
      const r = s.getAllKeys(); r.onsuccess=()=>res(r.result||[]); r.onerror=()=>rej(r.error); })); }
  };
})();

export const rb = {
  cfg: defaultConfig(),
  roster: [],
  meta: { file:"", rows:0, when:"", dates:[], unknown:{} },
  sheet: null,
  locks: {},
  adj: {},
  lanes: {},
  extra: [],
  proj: {},
  projMeta: {},
  modOverride: {},
  removed: {},
  seed: 0,
  diagMin: false
};
