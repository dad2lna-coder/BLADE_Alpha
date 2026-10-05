/**
 * Bid Planner eBid upload panel. Reads Scheduler.state — it does not keep a second line store.
 */

import {
  EBID_HEADERS,
  EBID_COLUMNS,
  rowsFromScheduler,
  rowsFromCsv,
  rowsFromJsonPayload,
  runQa,
  toCsv,
  suggestForm,
  rowToCells
} from "./ebid.js";

function el(tag, attrs, text) {
  const node = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach((key) => {
      if (key === "className") node.className = attrs[key];
      else if (key === "hidden") node.hidden = !!attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
  }
  if (text != null) node.textContent = text;
  return node;
}

export function bindEbidUI(scheduler) {
  const S = scheduler || (typeof window !== "undefined" ? window.Scheduler : null);
  const root = document.getElementById("tab-bid-planner");
  if (!root || !S || root.dataset.ebidBound === "1") return;
  const ebid = root.querySelector("#bp-ebid-root");
  const miles = root.querySelector("#bp-miles-root");
  if (!ebid || !miles) return;
  root.dataset.ebidBound = "1";

  const airportEl = ebid.querySelector("#ebid-airport");
  const eventEl = ebid.querySelector("#ebid-event");
  const startEl = ebid.querySelector("#ebid-start");
  const endEl = ebid.querySelector("#ebid-end");
  const typeEl = ebid.querySelector("#ebid-shift-type");
  const badge = ebid.querySelector("#ebid-source-badge");
  const statusEl = ebid.querySelector("#ebid-status");
  const countEl = ebid.querySelector("#ebid-row-count");
  const headEl = ebid.querySelector("#ebid-head");
  const bodyEl = ebid.querySelector("#ebid-body");
  const searchEl = ebid.querySelector("#ebid-search");
  const qaSummary = ebid.querySelector("#ebid-qa-summary");
  const qaList = ebid.querySelector("#ebid-qa-list");
  const qaDistinct = ebid.querySelector("#ebid-qa-distinct");
  const rulesBody = ebid.querySelector("#ebid-rules");
  const fileEl = ebid.querySelector("#ebid-file");

  let source = { kind: "live", label: "LIVE LINES" };
  let allRows = [];
  let query = "";

  function readForm() {
    return {
      airportCode: airportEl.value.trim().toUpperCase(),
      bidEventId: eventEl.value.trim(),
      startDate: startEl.value,
      endDate: endEl.value,
      shiftTypeMode: typeEl.value || "Airport"
    };
  }

  function fillBlanks() {
    const seed = suggestForm(S);
    if (!airportEl.value && seed.airportCode) airportEl.value = seed.airportCode;
    if (!eventEl.value && seed.bidEventId) eventEl.value = seed.bidEventId;
    if (!startEl.value && seed.startDate) startEl.value = seed.startDate;
    if (!endEl.value && seed.endDate) endEl.value = seed.endDate;
  }

  function seedAll() {
    const seed = suggestForm(S);
    airportEl.value = seed.airportCode || "";
    eventEl.value = seed.bidEventId || "";
    startEl.value = seed.startDate || "";
    endEl.value = seed.endDate || "";
    typeEl.value = "Airport";
  }

  function setStatus(text) {
    statusEl.textContent = text || "";
  }

  function renderHeaders() {
    headEl.textContent = "";
    EBID_HEADERS.forEach((label) => headEl.appendChild(el("th", null, label)));
  }

  function renderBody(rows) {
    bodyEl.textContent = "";
    countEl.textContent = String(allRows.length) + (query ? " · " + rows.length + " match" : "");
    if (!rows.length) {
      const tr = el("tr");
      const td = el("td", { colspan: "45", className: "bp-empty-msg" });
      td.textContent = allRows.length
        ? "No lines match that search."
        : "No lines in this session. Generate on Setup, then come back — or import a JSON / lines CSV as a fallback. Sample rows are not loaded.";
      tr.appendChild(td);
      bodyEl.appendChild(tr);
      return;
    }
    rows.forEach((row) => {
      const tr = el("tr");
      rowToCells(row).forEach((value, index) => {
        const td = el("td", null, value == null ? "" : String(value));
        if (index >= 27 && index <= 40 && rowToCells(row)[index - 14] === "RDO" && !value) {
          td.className = "ebid-rdo-type";
        }
        tr.appendChild(td);
      });
      bodyEl.appendChild(tr);
    });
  }

  function visibleRows() {
    const q = query.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter((row) => {
      return [
        row.bidLineId, row.workgroup, row.title, row.patDown, row.schedType,
        row.certification, row.shiftTime, row.rdos, row.publicComments
      ].join(" ").toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderQa(qa) {
    qaSummary.textContent = "";
    qaList.textContent = "";
    qaDistinct.textContent = "";
    if (qa.empty) {
      qaSummary.appendChild(el("p", { className: "bp-empty-msg" }, "No lines to check. Totals stay at zero until this session has lines."));
      return;
    }
    const cards = [
      ["Lines", String(qa.total)],
      ["Schedule", qa.ft + " FT / " + qa.pt + " PT"],
      ["Pat down", qa.male + " M / " + qa.female + " F"],
      ["Rule breaks", qa.errors + " error / " + qa.warnings + " warn"]
    ];
    const grid = el("div", { className: "ebid-stat-grid" });
    cards.forEach((pair) => {
      const card = el("div", { className: "ebid-stat" });
      card.appendChild(el("div", { className: "ebid-stat-label" }, pair[0]));
      card.appendChild(el("div", { className: "ebid-stat-value" }, pair[1]));
      grid.appendChild(card);
    });
    qaSummary.appendChild(grid);

    const shown = qa.issues.slice(0, 80);
    if (!shown.length) {
      qaList.appendChild(el("p", { className: "ebid-pass" }, "No rule breaks. RDO shift types are blank, cert pools sit in column 13, and the row is 45 columns (A–AS)."));
    } else {
      shown.forEach((issue) => {
        const row = el("div", { className: "ebid-issue ebid-issue-" + issue.level });
        row.appendChild(el("span", { className: "ebid-issue-level" }, issue.level === "error" ? "FAIL" : "WARN"));
        const text = (issue.lineId ? "Line " + issue.lineId + " — " : "") + issue.message;
        row.appendChild(el("span", null, text));
        qaList.appendChild(row);
      });
      if (qa.issues.length > shown.length) {
        qaList.appendChild(el("p", { className: "bp-subtitle" }, (qa.issues.length - shown.length) + " more not shown."));
      }
    }

    Object.keys(qa.distinct).forEach((name) => {
      const card = el("div", { className: "ebid-distinct" });
      const counts = qa.distinct[name];
      const keys = Object.keys(counts);
      card.appendChild(el("h4", null, name + " · " + keys.length));
      keys.sort((a, b) => counts[b] - counts[a] || a.localeCompare(b)).forEach((key) => {
        const item = el("div", { className: "ebid-distinct-row" });
        item.appendChild(el("span", null, key));
        item.appendChild(el("span", null, String(counts[key])));
        card.appendChild(item);
      });
      qaDistinct.appendChild(card);
    });
  }

  function renderRules() {
    if (rulesBody.dataset.ready === "1") return;
    rulesBody.dataset.ready = "1";
    EBID_COLUMNS.forEach((col) => {
      const tr = el("tr");
      tr.appendChild(el("td", null, String(col.id)));
      tr.appendChild(el("td", null, col.header));
      tr.appendChild(el("td", null, col.values));
      tr.appendChild(el("td", null, col.desc));
      rulesBody.appendChild(tr);
    });
  }

  function applyRows(rows, label) {
    allRows = rows || [];
    badge.textContent = label || source.label;
    const qa = runQa(allRows);
    renderBody(visibleRows());
    renderQa(qa);
    const liveCount = (S.state && Array.isArray(S.state.lines)) ? S.state.lines.length : 0;
    if (source.kind === "live") {
      setStatus(allRows.length
        ? allRows.length + " line(s) from this session."
        : "Session has " + liveCount + " line(s).");
    }
  }

  function refreshLive() {
    if (source.kind !== "live") return;
    fillBlanks();
    applyRows(rowsFromScheduler(S, readForm()), "LIVE LINES");
  }

  function showTab(name) {
    ["lines", "qa", "info"].forEach((id) => {
      const panel = ebid.querySelector("#ebid-tab-" + id);
      const btn = ebid.querySelector('[data-ebid-tab="' + id + '"]');
      if (panel) panel.hidden = id !== name;
      if (btn) btn.classList.toggle("active", id === name);
    });
    if (name === "info") renderRules();
  }

  function showView(name) {
    ebid.hidden = name !== "ebid";
    miles.hidden = name !== "miles";
    root.querySelectorAll("[data-bp-view]").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-bp-view") === name);
    });
    if (name === "ebid") refreshLive();
  }

  renderHeaders();
  renderRules();
  showTab("lines");
  showView("ebid");
  refreshLive();

  ebid.querySelector("#ebid-apply").addEventListener("click", () => {
    if (source.kind === "csv") {
      const parsed = rowsFromCsv(source.text, readForm());
      if (parsed.error) { setStatus(parsed.error); return; }
      applyRows(parsed.rows, source.label);
      setStatus(parsed.rows.length + " line(s) from the imported CSV.");
      return;
    }
    if (source.kind === "json") {
      const parsed = rowsFromJsonPayload(source.data, readForm());
      if (parsed.error) { setStatus(parsed.error); return; }
      applyRows(parsed.rows, source.label);
      setStatus(parsed.rows.length + " line(s) from the imported JSON.");
      return;
    }
    refreshLive();
  });

  ebid.querySelector("#ebid-live").addEventListener("click", () => {
    source = { kind: "live", label: "LIVE LINES" };
    seedAll();
    refreshLive();
    setStatus("Using the lines in this session.");
  });

  ebid.querySelector("#ebid-export").addEventListener("click", () => {
    if (!allRows.length) {
      setStatus("Nothing to export. Generate lines or import a fallback file.");
      return;
    }
    const qa = runQa(allRows);
    const csv = toCsv(allRows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const name = (eventEl.value.trim() || "eBid") + "_45Col_Import.csv";
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatus("Exported " + allRows.length + " line(s), 45 columns A–AS." +
      (qa.errors ? " QA still has " + qa.errors + " error(s)." : ""));
  });

  ebid.querySelector("#ebid-import").addEventListener("click", () => fileEl.click());
  fileEl.addEventListener("change", () => {
    const file = fileEl.files && fileEl.files[0];
    fileEl.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const name = file.name.toLowerCase();
      const tryJson = name.endsWith(".json") || /^\s*[{[]/.test(text);
      if (tryJson) {
        try {
          const data = JSON.parse(text);
          const parsed = rowsFromJsonPayload(data, readForm());
          if (!parsed.error) {
            source = { kind: "json", label: "JSON IMPORT", data: data };
            fillBlanks();
            if (data.config && data.config.startDate && !startEl.value) startEl.value = String(data.config.startDate).slice(0, 10);
            applyRows(rowsFromJsonPayload(data, readForm()).rows, "JSON IMPORT");
            setStatus("Fallback import " + file.name + " · " + allRows.length + " line(s). Live lines are unchanged.");
            return;
          }
          if (name.endsWith(".json")) {
            setStatus(parsed.error);
            return;
          }
        } catch (err) {
          if (name.endsWith(".json")) {
            setStatus("Could not read that JSON.");
            return;
          }
        }
      }
      const parsed = rowsFromCsv(text, readForm());
      if (parsed.error) {
        setStatus(parsed.error);
        return;
      }
      source = { kind: "csv", label: "CSV IMPORT", text: text };
      applyRows(parsed.rows, "CSV IMPORT");
      setStatus("Fallback import " + file.name + " · " + allRows.length + " line(s). Live lines are unchanged.");
    };
    reader.readAsText(file);
  });

  searchEl.addEventListener("input", () => {
    query = searchEl.value || "";
    renderBody(visibleRows());
  });

  ebid.querySelectorAll("[data-ebid-tab]").forEach((btn) => {
    btn.addEventListener("click", () => showTab(btn.getAttribute("data-ebid-tab")));
  });
  root.querySelectorAll("[data-bp-view]").forEach((btn) => {
    btn.addEventListener("click", () => showView(btn.getAttribute("data-bp-view")));
  });

  if (!S.renderAll || !S.renderAll._ebidWrapped) {
    const prev = S.renderAll;
    const wrapped = function () {
      if (typeof prev === "function") prev.apply(this, arguments);
      refreshLive();
    };
    wrapped._ebidWrapped = true;
    S.renderAll = wrapped;
  }

  document.addEventListener("click", (event) => {
    const btn = event.target && event.target.closest ? event.target.closest("#blade-tabs .tab-btn") : null;
    if (btn && btn.dataset.tab === "bid-planner") refreshLive();
  });
}
