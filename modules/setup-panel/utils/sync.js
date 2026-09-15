/** DOM and scheduling sync helpers */

export function val(id, fallback) {
  const el = document.getElementById(id);
  return el && el.value != null && el.value !== "" ? el.value : fallback;
}

export function syncHoursFromAirfield(S) {
  const cfg = S.getAirportConfig && S.getAirportConfig();
  const open = (cfg && cfg.startTime) || "03:30";
  const close = (cfg && cfg.endTime) || "23:00";
  let o = document.getElementById("cfg-open");
  let c = document.getElementById("cfg-close");
  if (o) o.value = open;
  if (c) c.value = close;
  if (S.state) { S.state.open = open; S.state.close = close; }
}

export function ensureStyles() {
  if (document.getElementById("setup-panel-css")) return;
  const link = document.createElement("link");
  link.id = "setup-panel-css";
  link.rel = "stylesheet";
  link.href = "modules/setup-panel/styles/setup-panel.css";
  document.head.appendChild(link);
}
