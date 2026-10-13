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

/* ---- location catalogue. Real checkpoints are added in Configuration. */
export const DUMMY_LOC_IDS = [
  "CKPT-A12", "CKPT-A20", "CKPT-A21", "CKPT-A35",
  "CKPT-B09", "CKPT-B30",
  "CKPT-C10", "CKPT-C11", "CKPT-C21",
  "CKPT-D18", "CKPT-D22", "CKPT-D30",
  "CKPT-E08", "CKPT-E16", "CKPT-E18", "CKPT-E33"
];

export const DEF_LOCS = {};

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
    aliases: {},
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

/** Drop the sample checkpoint catalogue from a saved config. Real IDs are kept. */
export function stripDummyLocations(cfg){
  if(!cfg) return false;
  let changed = false;
  const locs = cfg.locations;
  if(locs){
    for(const id of DUMMY_LOC_IDS){
      if(Object.prototype.hasOwnProperty.call(locs, id)){
        delete locs[id];
        changed = true;
      }
    }
  }
  if(cfg.aliases && Object.prototype.hasOwnProperty.call(cfg.aliases, "CKPT-NORTH") && cfg.aliases["CKPT-NORTH"] === ""){
    delete cfg.aliases["CKPT-NORTH"];
    changed = true;
  }
  return changed;
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
