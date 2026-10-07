/**
 * Month grid for the portfolio. Renders into a root the caller owns.
 */

const LOCATION_COLORS = ["#007bff", "#28a745", "#fd7e14", "#6f42c1", "#17a2b8", "#d63384"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function colorForLocation(location) {
  const text = String(location || "");
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % LOCATION_COLORS.length);
  return LOCATION_COLORS[index];
}

function pad(n) {
  return String(n).padStart(2, "0");
}

export function renderMonthGrid(grid, labelEl, calendarDate, portfolio, onInspect) {
  if (!grid || !calendarDate) return;
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  if (labelEl) {
    labelEl.textContent = calendarDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }
  grid.replaceChildren();

  WEEKDAYS.forEach((day) => {
    const div = document.createElement("div");
    div.className = "bp-miles-dow";
    div.textContent = day;
    grid.appendChild(div);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i += 1) {
    const padCell = document.createElement("div");
    padCell.className = "bp-miles-cell is-pad";
    grid.appendChild(padCell);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateStr = year + "-" + pad(month + 1) + "-" + pad(day);
    const cell = document.createElement("div");
    cell.className = "bp-miles-cell";
    const num = document.createElement("div");
    num.className = "bp-miles-day";
    num.textContent = String(day);
    cell.appendChild(num);

    (portfolio || []).forEach((bid) => {
      (bid.milestones || []).forEach((milestone) => {
        if (milestone.currentDate !== dateStr) return;
        const evt = document.createElement("button");
        evt.type = "button";
        evt.className = "bp-miles-event";
        let eventName = milestone.name;
        let color = colorForLocation(bid.location);
        if (milestone.name.indexOf("Live Bid") !== -1) {
          color = "#de350b";
          eventName = bid.type;
        } else if (milestone.name.indexOf("Lines Posted") !== -1) {
          color = "#6f42c1";
        }
        evt.style.backgroundColor = color;
        evt.title = bid.featureName + ": " + milestone.name;
        evt.textContent = bid.location + ": " + eventName;
        evt.addEventListener("click", () => {
          if (onInspect) onInspect(bid.id);
        });
        cell.appendChild(evt);
      });
    });
    grid.appendChild(cell);
  }
}
