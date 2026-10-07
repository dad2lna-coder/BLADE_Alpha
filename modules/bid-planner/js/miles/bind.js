/**
 * Thin miles-view binder. Queries stay inside #bp-miles-root.
 * Does not read or write the staffing session.
 */

import { renderMonthGrid } from "./calendar-grid.js";
import { formatLocalDate, parseLocalDate, previousSunday, startOfToday } from "./dates.js";
import {
  buildIcs,
  downloadPortfolioExcel,
  downloadText,
  generateMasterTSV,
  portfolioFromWorkbook
} from "./importExport.js";
import {
  applyMilestoneDate,
  createBid,
  milestoneCompliance,
  offsetLabel
} from "./milestones.js";
import { createPortfolioStore } from "./portfolio.js";

function q(root, name) {
  return root.querySelector('[data-miles="' + name + '"]');
}

function field(labelText, type, name, value) {
  const label = document.createElement("label");
  label.textContent = labelText;
  const input = document.createElement("input");
  input.type = type;
  input.dataset.miles = name;
  if (value) input.value = value;
  label.appendChild(input);
  return label;
}

function renderDynamic(miles) {
  const box = q(miles, "dynamic");
  const typeEl = q(miles, "bid-type");
  if (!box || !typeEl) return;
  box.replaceChildren();
  if (typeEl.value === "Leave Bid") {
    box.appendChild(field("FCFS Open", "date", "fcf", "2026-12-20"));
    box.appendChild(field("CY Start Date", "date", "cy", "2027-01-01"));
    return;
  }
  const label = field("Schedule Start Date", "date", "schedule", "2026-11-15");
  const input = label.querySelector("input");
  input.addEventListener("change", () => {
    const snapped = previousSunday(input.value);
    if (snapped && snapped !== input.value) {
      input.value = snapped;
      const status = q(miles, "status");
      if (status) status.textContent = "Schedule Start Date must be a Sunday. Moved to " + snapped + ".";
    }
  });
  box.appendChild(label);
}

function renderPortfolio(listEl, items, handlers) {
  listEl.replaceChildren();
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "bp-miles-empty";
    empty.textContent = "No bids in the portfolio yet.";
    listEl.appendChild(empty);
    return;
  }
  items.forEach((bid) => {
    const row = document.createElement("div");
    row.className = "bp-miles-item";
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = bid.featureName;
    const meta = document.createElement("span");
    meta.textContent = "Cat " + bid.category + " · Live Bid Start " + bid.anchorD0;
    copy.appendChild(title);
    copy.appendChild(meta);
    const actions = document.createElement("div");
    actions.className = "bp-miles-item-actions";
    const inspect = document.createElement("button");
    inspect.type = "button";
    inspect.className = "bp-miles-btn bp-miles-btn-muted";
    inspect.textContent = "Inspect";
    inspect.addEventListener("click", () => handlers.inspect(bid.id));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "bp-miles-btn bp-miles-btn-danger";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => handlers.remove(bid.id));
    actions.appendChild(inspect);
    actions.appendChild(remove);
    row.appendChild(copy);
    row.appendChild(actions);
    listEl.appendChild(row);
  });
}

function renderInspection(miles, bid) {
  const panel = q(miles, "inspect");
  const title = q(miles, "inspect-title");
  const body = q(miles, "inspect-body");
  if (!panel || !body) return;
  if (!bid) {
    panel.hidden = true;
    body.replaceChildren();
    return;
  }
  panel.hidden = false;
  if (title) title.textContent = "Inspecting Milestones for " + bid.featureName;
  bid.milestones.sort((a, b) => (a.currentDate < b.currentDate ? -1 : a.currentDate > b.currentDate ? 1 : 0));
  body.replaceChildren();
  bid.milestones.forEach((item) => {
    const tr = document.createElement("tr");
    const nameCell = document.createElement("td");
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "bp-miles-name";
    nameInput.value = item.name;
    nameInput.dataset.id = String(item.id);
    nameInput.dataset.field = "name";
    nameCell.appendChild(nameInput);

    const typeCell = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "bp-miles-badge";
    badge.textContent = item.type;
    typeCell.appendChild(badge);

    const dateCell = document.createElement("td");
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = item.currentDate;
    dateInput.dataset.id = String(item.id);
    dateInput.dataset.field = "date";
    dateCell.appendChild(dateInput);

    const offsetCell = document.createElement("td");
    offsetCell.className = "bp-miles-offset";
    offsetCell.textContent = offsetLabel(bid, item);

    const statusCell = document.createElement("td");
    const result = milestoneCompliance(bid, item);
    const pill = document.createElement("span");
    pill.className = "bp-miles-badge " + (result.compliant ? "is-ok" : "is-bad");
    pill.textContent = result.msg;
    statusCell.appendChild(pill);

    const actionCell = document.createElement("td");
    const del = document.createElement("button");
    del.type = "button";
    del.className = "bp-miles-btn bp-miles-btn-danger";
    del.textContent = "Delete";
    del.dataset.id = String(item.id);
    del.dataset.field = "delete";
    actionCell.appendChild(del);

    tr.appendChild(nameCell);
    tr.appendChild(typeCell);
    tr.appendChild(dateCell);
    tr.appendChild(offsetCell);
    tr.appendChild(statusCell);
    tr.appendChild(actionCell);
    body.appendChild(tr);
  });
}

function monthOf(dateStr, fallback) {
  const parsed = parseLocalDate(dateStr);
  if (!parsed) return fallback;
  return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
}

export function bindMilesUI(scheduler) {
  void scheduler;
  const tab = document.getElementById("tab-bid-planner");
  if (!tab) return;
  const miles = tab.querySelector("#bp-miles-root");
  if (!miles || miles.dataset.milesBound === "1") return;
  miles.dataset.milesBound = "1";

  const store = createPortfolioStore();
  let activeId = null;
  const today = startOfToday();
  const first = store.list()[0];
  let calendarDate = monthOf(first && first.anchorD0, new Date(today.getFullYear(), today.getMonth(), 1));

  const planning = q(miles, "planning");
  if (planning && !planning.value) planning.value = formatLocalDate(today);
  renderDynamic(miles);

  function setStatus(message) {
    const status = q(miles, "status");
    if (status) status.textContent = message || "";
  }

  function activeBid() {
    return store.list().find((bid) => String(bid.id) === String(activeId)) || null;
  }

  function paint() {
    const items = store.list();
    renderPortfolio(q(miles, "portfolio"), items, {
      inspect: function (id) {
        activeId = id;
        const bid = activeBid();
        if (bid) calendarDate = monthOf(bid.anchorD0, calendarDate);
        paint();
      },
      remove: function (id) {
        store.remove(id);
        if (String(activeId) === String(id)) activeId = null;
        setStatus("Removed from the portfolio.");
        paint();
      }
    });
    renderMonthGrid(q(miles, "grid"), q(miles, "month"), calendarDate, items, (id) => {
      activeId = id;
      renderInspection(miles, activeBid());
    });
    renderInspection(miles, activeBid());
  }

  q(miles, "bid-type").addEventListener("change", () => renderDynamic(miles));

  q(miles, "add").addEventListener("click", () => {
    const type = q(miles, "bid-type").value;
    const anchor = q(miles, "anchor").value;
    const plan = q(miles, "planning").value;
    if (!anchor || !plan) {
      setStatus("Please supply both Live Bid Start and Planning Start dates.");
      return;
    }
    const fcf = q(miles, "fcf");
    const cy = q(miles, "cy");
    const schedule = q(miles, "schedule");
    if (type === "Leave Bid" && (!fcf || !fcf.value || !cy || !cy.value)) {
      setStatus("Leave bids need an FCFS Open date and a CY Start Date.");
      return;
    }
    if (type === "Shift Bid" && (!schedule || !schedule.value)) {
      setStatus("Shift bids need a Sunday Schedule Start Date.");
      return;
    }
    const bid = createBid({
      location: q(miles, "location").value,
      type: type,
      category: q(miles, "airport-cat").value,
      duration: q(miles, "duration").value,
      anchorD0: anchor,
      planningStart: plan,
      fcfOpen: fcf ? fcf.value : "",
      cyStart: cy ? cy.value : "",
      scheduleStart: schedule ? schedule.value : "",
      today: today
    });
    store.add(bid);
    activeId = bid.id;
    calendarDate = monthOf(bid.anchorD0, calendarDate);
    setStatus("Added " + bid.featureName + ".");
    paint();
  });

  q(miles, "prev").addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    paint();
  });
  q(miles, "next").addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    paint();
  });

  q(miles, "export-json").addEventListener("click", () => {
    const items = store.list();
    if (!items.length) {
      setStatus("Portfolio is empty. Nothing to export.");
      return;
    }
    downloadText(JSON.stringify(items, null, 2), "chaos_portfolio.json", "application/json");
    setStatus("Exported portfolio JSON.");
  });

  q(miles, "ics").addEventListener("click", () => {
    const items = store.list();
    if (!items.length) {
      setStatus("Portfolio is empty. Nothing to export.");
      return;
    }
    downloadText(buildIcs(items), "chaos_master_schedule.ics", "text/calendar");
    setStatus("Exported the master calendar.");
  });

  q(miles, "print").addEventListener("click", () => window.print());
  q(miles, "print-list").addEventListener("click", () => window.print());

  function copyTsv(type) {
    const items = store.list();
    if (!items.length) {
      setStatus("Portfolio is empty. Nothing to copy.");
      return;
    }
    const tsv = generateMasterTSV(items, type);
    const label = type === "features" ? "CHAOS-Features" : "CHAOS-WorkItems";
    const done = () => setStatus(label + " copied to clipboard.");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(tsv).then(done).catch(() => {
        downloadText(tsv, label + ".tsv", "text/tab-separated-values");
        setStatus("Clipboard blocked. Downloaded " + label + " instead.");
      });
      return;
    }
    downloadText(tsv, label + ".tsv", "text/tab-separated-values");
    setStatus("Downloaded " + label + ".");
  }

  q(miles, "copy-features").addEventListener("click", () => copyTsv("features"));
  q(miles, "copy-work").addEventListener("click", () => copyTsv("workitems"));

  q(miles, "export-excel").addEventListener("click", () => {
    const items = store.list();
    if (!items.length) {
      setStatus("No schedules added to compile yet.");
      return;
    }
    downloadPortfolioExcel(items).then(() => {
      setStatus("Downloaded CHAOS_Master_Bid_Portfolio.xlsx.");
    }).catch((err) => {
      setStatus(err && err.message ? err.message : "Excel export failed.");
    });
  });

  const jsonFile = q(miles, "json-file");
  q(miles, "import-json").addEventListener("click", () => jsonFile.click());
  jsonFile.addEventListener("change", () => {
    const file = jsonFile.files && jsonFile.files[0];
    jsonFile.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result || ""));
        if (!Array.isArray(imported)) {
          setStatus("Invalid JSON format. Please import a valid portfolio file.");
          return;
        }
        store.replace(imported);
        activeId = imported[0] ? imported[0].id : null;
        if (imported[0]) calendarDate = monthOf(imported[0].anchorD0, calendarDate);
        setStatus("Portfolio successfully imported.");
        paint();
      } catch (err) {
        setStatus("Error parsing JSON file: " + (err && err.message ? err.message : "invalid"));
      }
    };
    reader.readAsText(file);
  });

  const excelFile = q(miles, "excel-file");
  q(miles, "import-excel").addEventListener("click", () => excelFile.click());
  excelFile.addEventListener("change", () => {
    const file = excelFile.files && excelFile.files[0];
    excelFile.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      portfolioFromWorkbook(reader.result).then((imported) => {
        store.replace(imported);
        activeId = imported[0] ? imported[0].id : null;
        if (imported[0]) calendarDate = monthOf(imported[0].anchorD0, calendarDate);
        setStatus("Portfolio successfully imported from Excel.");
        paint();
      }).catch((err) => {
        setStatus(err && err.message ? err.message : "Error processing Excel file.");
      });
    };
    reader.readAsArrayBuffer(file);
  });

  q(miles, "inspect-body").addEventListener("change", (event) => {
    const input = event.target;
    if (!input || !input.dataset) return;
    const bid = activeBid();
    if (!bid) return;
    if (input.dataset.field === "name") {
      const milestone = bid.milestones.find((m) => String(m.id) === input.dataset.id);
      if (milestone) milestone.name = input.value;
      store.touch();
      renderMonthGrid(q(miles, "grid"), q(miles, "month"), calendarDate, store.list(), (id) => {
        activeId = id;
        paint();
      });
      return;
    }
    if (input.dataset.field === "date") {
      applyMilestoneDate(bid, input.dataset.id, input.value, today);
      store.touch();
      paint();
    }
  });

  q(miles, "inspect-body").addEventListener("click", (event) => {
    const btn = event.target && event.target.closest ? event.target.closest("button") : null;
    if (!btn || btn.dataset.field !== "delete") return;
    const bid = activeBid();
    if (!bid) return;
    bid.milestones = bid.milestones.filter((m) => String(m.id) !== btn.dataset.id);
    store.touch();
    paint();
  });

  paint();
}
