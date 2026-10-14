const SCALAR_DEFAULTS = {
  airportCode: "",
  operator: "",
  open: "03:30",
  close: "23:00",
  useDynamicHours: false,
  weekCount: 1,
  generateSeed: "random",
  activeSeed: "",
  mode: "—",
  ftM: 0,
  ftF: 0,
  ptM: 0,
  ptF: 0,
  ptHoursPerDay: 4,
  ptDaysPerWeek: 3,
  ltsoM: 0,
  ltsoF: 0,
  stsoM: 0,
  stsoF: 0,
  esti: 0,
  msti: 0,
  certDfoMax: 0,
  certPaxMax: 0,
  certBagMax: 0,
  certDfoEnabled: true,
  certBagEnabled: true
};

function scalar(state, key) {
  const value = state[key];
  return value == null ? SCALAR_DEFAULTS[key] : value;
}

function rawObject(value) {
  return value && typeof value === "object" ? { ...value } : {};
}

function rawArray(value) {
  return Array.isArray(value) ? value.slice() : [];
}

/** Mirrors window.Scheduler.state. Host stays source of truth. */
export class SchedulerBridge {
  revision = $state(0);

  airportCode = $state("");
  operator = $state("");
  open = $state("03:30");
  close = $state("23:00");
  useDynamicHours = $state(false);
  weekCount = $state(1);
  generateSeed = $state("random");
  activeSeed = $state("");
  mode = $state("—");
  ftM = $state(0);
  ftF = $state(0);
  ptM = $state(0);
  ptF = $state(0);
  ptHoursPerDay = $state(4);
  ptDaysPerWeek = $state(3);
  ltsoM = $state(0);
  ltsoF = $state(0);
  stsoM = $state(0);
  stsoF = $state(0);
  esti = $state(0);
  msti = $state(0);
  certDfoMax = $state(0);
  certPaxMax = $state(0);
  certBagMax = $state(0);
  certDfoEnabled = $state(true);
  certBagEnabled = $state(true);

  lines = $state.raw([]);
  schedule = $state.raw({});
  shifts = $state.raw([]);
  shiftCrewGroups = $state.raw([]);
  scheduleLocks = $state.raw([]);
  extraPositions = $state.raw([]);
  issues = $state.raw([]);
  functionCoverage = $state.raw({});
  functionRotation = $state.raw({});
  certPool = $state.raw({});
  dayHours = $state.raw(null);
  startDate = $state.raw(null);
  coverageCuts = $state.raw([]);
  volumeImport = $state.raw(null);
  exportStyle = $state.raw({});
  airportConfig = $state.raw({});
  teamDayMod = $state.raw(null);

  constructor(scheduler) {
    this.scheduler = scheduler;
    this.pull();
  }

  pull() {
    const state = this.scheduler?.state || {};
    this.airportCode = scalar(state, "airportCode");
    this.operator = scalar(state, "operator");
    this.open = scalar(state, "open");
    this.close = scalar(state, "close");
    this.useDynamicHours = scalar(state, "useDynamicHours");
    this.weekCount = scalar(state, "weekCount");
    this.generateSeed = scalar(state, "generateSeed");
    this.activeSeed = scalar(state, "activeSeed");
    this.mode = scalar(state, "mode");
    this.ftM = scalar(state, "ftM");
    this.ftF = scalar(state, "ftF");
    this.ptM = scalar(state, "ptM");
    this.ptF = scalar(state, "ptF");
    this.ptHoursPerDay = scalar(state, "ptHoursPerDay");
    this.ptDaysPerWeek = scalar(state, "ptDaysPerWeek");
    this.ltsoM = scalar(state, "ltsoM");
    this.ltsoF = scalar(state, "ltsoF");
    this.stsoM = scalar(state, "stsoM");
    this.stsoF = scalar(state, "stsoF");
    this.esti = scalar(state, "esti");
    this.msti = scalar(state, "msti");
    this.certDfoMax = scalar(state, "certDfoMax");
    this.certPaxMax = scalar(state, "certPaxMax");
    this.certBagMax = scalar(state, "certBagMax");
    this.certDfoEnabled = scalar(state, "certDfoEnabled");
    this.certBagEnabled = scalar(state, "certBagEnabled");
    this.lines = rawArray(state.lines);
    this.shifts = rawArray(state.shifts);
    this.shiftCrewGroups = rawArray(state.shiftCrewGroups);
    this.scheduleLocks = rawArray(state.scheduleLocks);
    this.extraPositions = rawArray(state.extraPositions);
    this.issues = rawArray(state.issues);
    this.coverageCuts = rawArray(state.coverageCuts);
    this.schedule = rawObject(state.schedule);
    this.functionCoverage = rawObject(state.functionCoverage);
    this.functionRotation = rawObject(state.functionRotation);
    this.certPool = rawObject(state.certPool);
    this.exportStyle = rawObject(state.exportStyle);
    this.airportConfig = rawObject(state.airportConfig);
    this.dayHours = Array.isArray(state.dayHours) ? state.dayHours.slice() : null;
    this.startDate = state.startDate ?? null;
    this.volumeImport = state.volumeImport ?? null;
    this.teamDayMod = state.teamDayMod ?? null;
    this.revision += 1;
  }

  notify() {
    this.pull();
  }

  patch(partial) {
    if (!partial || typeof partial !== "object") return;
    if (!this.scheduler.state) this.scheduler.state = {};
    Object.assign(this.scheduler.state, partial);
    this.pull();
  }
}

export function attachBridge(scheduler = globalThis.Scheduler) {
  if (!scheduler) throw new Error("Scheduler is not available");
  if (!scheduler.svelteBridge) scheduler.svelteBridge = new SchedulerBridge(scheduler);
  return scheduler.svelteBridge;
}
