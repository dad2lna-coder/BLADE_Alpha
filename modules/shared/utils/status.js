import { $ } from "./dom.js";

export function updateStatus(msg) {
  var el = $("status");
  if (el) el.textContent = msg;
}
