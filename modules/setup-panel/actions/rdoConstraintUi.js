/** One RDO control: block length 2–4 and optional pin days. */
import { normalizeRdoBlock, normalizeRdoPins } from "../utils/rdoBlock.js";

export function rdoConstraintHtml(S, shift) {
  var block = normalizeRdoBlock(shift) || 2;
  var pins = new Set(normalizeRdoPins(shift));
  if (shift && !Array.isArray(shift.rdoPins) && !normalizeRdoBlock(shift) && Array.isArray(shift.rdoHard)) {
    pins = new Set(shift.rdoHard.map(Number).filter(function (d) { return d >= 0 && d <= 6; }));
  }
  var required = !!(shift && shift.rdoPinRequired);
  var id = String(shift && shift.id || "shift").replace(/[^A-Za-z0-9_-]/g, "");
  var days = (S && S.DAYS) || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var missing = required && pins.size === 0;
  var blocks = [2, 3, 4].map(function (n) {
    return (
      '<label class="rdo-mode-opt" title="Consecutive block of ' + n + ' days">' +
      '<input type="radio" name="rdo-block-' + id + '" data-f="rdoBlock" value="' + n + '"' + (block === n ? " checked" : "") + " />" +
      "<span>" + n + "</span></label>"
    );
  }).join("");
  var dayHtml = days.map(function (label, d) {
    return (
      '<label class="rdo-chk" title="Pin ' + label + ' off">' +
      '<input type="checkbox" data-pin="' + d + '"' + (pins.has(d) ? " checked" : "") + " />" +
      "<span>" + label.charAt(0) + "</span></label>"
    );
  }).join("");
  return (
    '<div class="rdo-block rdo-mode" data-missing="' + (missing ? "1" : "0") + '">' +
    '<div class="rdo-mode-switch" role="radiogroup" aria-label="Consecutive RDO block">' + blocks + "</div>" +
    '<label class="rdo-pin-req" title="Every line is off the checked days. Leave the days empty and this fails generate instead of inventing a pattern.">' +
    '<input type="checkbox" data-f="rdoPinRequired"' + (required ? " checked" : "") + " />" +
    "<span>Pin</span></label>" +
    '<div class="rdo-row rdo-constraint" role="group" aria-label="Pin days">' + dayHtml + "</div>" +
    "</div>"
  );
}

export function readRdoConstraint(tr) {
  var blockEl = tr.querySelector('input[data-f="rdoBlock"]:checked');
  var block = normalizeRdoBlock(blockEl ? blockEl.value : 2) || 2;
  var pins = [];
  for (var d = 0; d < 7; d++) {
    var cb = tr.querySelector('input[data-pin="' + d + '"]');
    if (cb && cb.checked) pins.push(d);
  }
  var reqEl = tr.querySelector('input[data-f="rdoPinRequired"]');
  var rdoPinRequired = !!(reqEl && reqEl.checked);
  return { rdoBlock: block, rdoPins: pins, rdoPinRequired: rdoPinRequired, rdoHard: pins.slice() };
}

export function syncRdoConstraintRow(tr) {
  if (!tr) return;
  var wrap = tr.querySelector(".rdo-block");
  if (!wrap) return;
  var req = tr.querySelector('input[data-f="rdoPinRequired"]');
  var any = tr.querySelector("input[data-pin]:checked");
  wrap.setAttribute("data-missing", req && req.checked && !any ? "1" : "0");
}
