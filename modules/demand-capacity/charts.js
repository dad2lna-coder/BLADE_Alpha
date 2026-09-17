/**
 * Seven-day SVG charts: volume demand vs process capacity (same pax/30 unit).
 */

var DAY_TITLES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function slotLabel(mins, S) {
  if (S && typeof S.slotLabel === "function") return S.slotLabel(mins);
  var m = ((mins % 1440) + 1440) % 1440;
  var h = Math.floor(m / 60);
  var mm = m % 60;
  return String(h).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
}

function fmt(n) {
  if (!Number.isFinite(n)) return "0";
  if (Math.abs(n - Math.round(n)) < 0.05) return String(Math.round(n));
  return (Math.round(n * 10) / 10).toFixed(1);
}

function yTicks(max) {
  if (!(max > 0)) return [0, 1];
  var raw = max / 4;
  var mag = Math.pow(10, Math.floor(Math.log10(raw)));
  var nice = mag;
  if (raw / mag > 5) nice = mag * 5;
  else if (raw / mag > 2) nice = mag * 2;
  var ticks = [];
  for (var v = 0; v <= max + nice * 0.01; v += nice) ticks.push(v);
  if (ticks[ticks.length - 1] < max) ticks.push(ticks[ticks.length - 1] + nice);
  return ticks;
}

function polyline(xs, ys, x0, y0, x1, y1, max) {
  if (!xs.length) return "";
  var w = x1 - x0;
  var h = y1 - y0;
  var n = xs.length;
  var parts = [];
  for (var i = 0; i < n; i++) {
    var x = n === 1 ? (x0 + w / 2) : (x0 + (i / (n - 1)) * w);
    var y = y1 - (max > 0 ? (ys[i] / max) * h : 0);
    parts.push((i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1));
  }
  return parts.join(" ");
}

function areaPath(xs, ys, x0, y0, x1, y1, max) {
  var line = polyline(xs, ys, x0, y0, x1, y1, max);
  if (!line) return "";
  var w = x1 - x0;
  var n = xs.length;
  var lastX = n === 1 ? (x0 + w / 2) : x1;
  return line + " L" + lastX.toFixed(1) + " " + y1.toFixed(1) + " L" + x0.toFixed(1) + " " + y1.toFixed(1) + " Z";
}

function drawDaySvg(opts) {
  var W = opts.width || 640;
  var H = opts.height || 196;
  var padL = 44;
  var padR = 12;
  var padT = 18;
  var padB = 28;
  var x0 = padL;
  var y0 = padT;
  var x1 = W - padR;
  var y1 = H - padB;
  var volume = opts.volume || [];
  var capacity = opts.capacity || [];
  var n = Math.max(volume.length, capacity.length, 1);
  var xs = [];
  var vol = [];
  var cap = [];
  var max = 1;
  for (var i = 0; i < n; i++) {
    xs.push(i);
    var v = Number(volume[i]) || 0;
    var c = Number(capacity[i]) || 0;
    vol.push(v);
    cap.push(c);
    if (v > max) max = v;
    if (c > max) max = c;
  }
  max = max * 1.08;
  var ticks = yTicks(max);
  var axisMax = ticks[ticks.length - 1] || max;
  var volD = areaPath(xs, vol, x0, y0, x1, y1, axisMax);
  var volL = polyline(xs, vol, x0, y0, x1, y1, axisMax);
  var capL = polyline(xs, cap, x0, y0, x1, y1, axisMax);

  var grid = "";
  for (var t = 0; t < ticks.length; t++) {
    var gy = y1 - (axisMax > 0 ? (ticks[t] / axisMax) * (y1 - y0) : 0);
    grid += '<line x1="' + x0 + '" y1="' + gy.toFixed(1) + '" x2="' + x1 + '" y2="' + gy.toFixed(1) + '" class="dc-grid" />';
    grid += '<text x="' + (x0 - 6) + '" y="' + (gy + 3).toFixed(1) + '" class="dc-ytick" text-anchor="end">' + fmt(ticks[t]) + "</text>";
  }

  var labels = opts.labels || [];
  var step = 1;
  if (labels.length > 12) step = 4;
  else if (labels.length > 8) step = 2;
  var xlabels = "";
  for (var li = 0; li < labels.length; li += step) {
    var lx = n === 1 ? (x0 + (x1 - x0) / 2) : (x0 + (li / Math.max(n - 1, 1)) * (x1 - x0));
    xlabels += '<text x="' + lx.toFixed(1) + '" y="' + (H - 8) + '" class="dc-xtick" text-anchor="middle">' + labels[li] + "</text>";
  }

  var hoverW = n > 1 ? ((x1 - x0) / (n - 1)) : (x1 - x0);
  var hits = "";
  for (var hi = 0; hi < n; hi++) {
    var hx = n === 1 ? (x0 + (x1 - x0) / 2) : (x0 + (hi / (n - 1)) * (x1 - x0));
    var title = (labels[hi] || "") +
      " · Volume " + fmt(vol[hi]) +
      " · Process capacity " + fmt(cap[hi]);
    hits += '<rect class="dc-hit" data-i="' + hi + '" x="' + (hx - hoverW / 2).toFixed(1) +
      '" y="' + y0 + '" width="' + Math.max(hoverW, 6).toFixed(1) + '" height="' + (y1 - y0).toFixed(1) +
      '"><title>' + title + "</title></rect>";
  }

  return (
    '<svg class="dc-svg" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="' + opts.title +
    ': originating volume versus process capacity">' +
    "<title>" + opts.title + " — volume vs process capacity (pax / 30 min)</title>" +
    grid +
    '<line x1="' + x0 + '" y1="' + y1 + '" x2="' + x1 + '" y2="' + y1 + '" class="dc-axis" />' +
    '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + y1 + '" class="dc-axis" />' +
    (volD ? '<path d="' + volD + '" class="dc-vol-fill" />' : "") +
    (volL ? '<path d="' + volL + '" class="dc-vol-line" />' : "") +
    (capL ? '<path d="' + capL + '" class="dc-cap-line" />' : "") +
    xlabels +
    hits +
    "</svg>"
  );
}

export function renderDemandCharts(host, opts) {
  if (!host) return;
  var S = opts.S;
  var slots = opts.slots || [];
  var demandByDow = opts.demandByDow || [];
  var airportPaxBySlot = opts.airportPaxBySlot || [];
  var labels = slots.map(function (m) { return slotLabel(m, S); });
  var html = "";
  for (var d = 0; d < 7; d++) {
    var title = DAY_TITLES[d] || ("Day " + d);
    html += '<figure class="dc-day">' +
      '<figcaption class="dc-day-title">' + title + "</figcaption>" +
      drawDaySvg({
        title: title,
        labels: labels,
        volume: demandByDow[d] || slots.map(function () { return 0; }),
        capacity: airportPaxBySlot
      }) +
      "</figure>";
  }
  host.innerHTML = html;
}

export { DAY_TITLES };
