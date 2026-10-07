/**
 * CHAOS milestone templates. Leave and shift bids only.
 * Dates land on the anchors from the portfolio form, then shift off weekends
 * and the 2026 federal holiday list. Implement Bid keeps the schedule start.
 */

import { adjustToWorkday, dayDiff, formatLocalDate, parseLocalDate, startOfToday } from "./dates.js";

const LEAVE_ITEMS = [
  { name: "Seniority Validated", anchor: "planning", offset: 0, type: "Task" },
  { name: "Initial Meeting", anchor: "planning", offset: 1, type: "Meeting" },
  { name: "Draft Bidlines", anchor: "planning", offset: 1, type: "Task" },
  { name: "Meet with Leadership Team", anchor: "planning", offset: 1, type: "Meeting" },
  { name: "Bid Announcement Letter", anchor: "live", offset: -33, type: "Task" },
  { name: "Seniority Posted", anchor: "live", offset: -32, type: "Task" },
  { name: "Scheduling Committee Meeting", anchor: "live", offset: -32, type: "Meeting" },
  { name: "CBA/TSA validation", anchor: "live", offset: -32, type: "Task" },
  { name: "Review DAT/Bid Line limits", anchor: "live", offset: -32, type: "Task" },
  { name: "AFSD-S Approval", anchor: "live", offset: -32, type: "Task" },
  { name: "AFGE & Live bid Attendee ID'd", anchor: "live", offset: -32, type: "Task" },
  { name: "Phone Line Verified", anchor: "live", offset: -32, type: "Task" },
  { name: "FSD Approval", anchor: "live", offset: -27, type: "Task" },
  { name: "Bid Lines Posted", anchor: "live", offset: -22, type: "Task" },
  { name: "AFGE Rep Notified", anchor: "live", offset: -31, type: "Task" },
  { name: "Proxy Forms Returned to SOO", anchor: "live", offset: -6, type: "Task" },
  { name: "Live Bid Start", anchor: "live", offset: 0, type: "Task" }
];

const SHIFT_ITEMS = [
  { name: "Review gender balance", anchor: "planning", offset: 0, type: "Task" },
  { name: "Review AM/PM balance", anchor: "planning", offset: 0, type: "Task" },
  { name: "Draft Bid lines", anchor: "planning", offset: 0, type: "Task" },
  { name: "TSO/LTSO/STSO Seniority Validated", anchor: "planning", offset: 3, type: "Task" },
  { name: "TSO/LTSO/STSO Seniority Posted (Initial)", anchor: "planning", offset: 4, type: "Task" },
  { name: "AM Scheduling Committee Meeting", anchor: "planning", offset: 5, type: "Meeting" },
  { name: "Meet with Managers", anchor: "planning", offset: 6, type: "Meeting" },
  { name: "PM Scheduling Committee Meeting", anchor: "live", offset: -29, type: "Meeting" },
  { name: "Leadership Strategy & Guidance Meeting", anchor: "live", offset: -27, type: "Meeting" },
  { name: "AFSD-S/DAFSD-S Approval", anchor: "live", offset: -14, type: "Task" },
  { name: "FSD Approval", anchor: "live", offset: -14, type: "Task" },
  { name: "Conduct Bid Briefings", anchor: "live", offset: -18, type: "Meeting" },
  { name: "Bid Announcement Letter Posted", anchor: "live", offset: -14, type: "Task" },
  { name: "TSO/LTSO/STSO Seniority posted (Final)", anchor: "live", offset: -14, type: "Task" },
  { name: "Bid Lines Posted", anchor: "live", offset: -14, type: "Task" },
  { name: "Bid Letters Sent", anchor: "live", offset: -14, type: "Task" },
  { name: "Live bid Attendee ID'd", anchor: "live", offset: -11, type: "Task" },
  { name: "Proxy Forms Returned to SOO", anchor: "live", offset: -5, type: "Task" },
  { name: "Phone Line Verified", anchor: "live", offset: -1, type: "Task" },
  { name: "Room Setup complete", anchor: "live", offset: -1, type: "Task" },
  { name: "Live Bid Start", anchor: "live", offset: 0, type: "Task" }
];

let idSeq = 0;
function nextId() {
  idSeq += 1;
  return Date.now() * 1000 + (idSeq % 1000);
}

function cloneItems(list) {
  return list.map((item) => ({
    name: item.name,
    anchor: item.anchor,
    offset: item.offset,
    type: item.type
  }));
}

export function milestoneTemplates(bid) {
  const leave = bid.type === "Leave Bid";
  const items = leave ? cloneItems(LEAVE_ITEMS) : cloneItems(SHIFT_ITEMS);
  const duration = Math.max(1, parseInt(bid.duration, 10) || 1);
  if (duration > 1) {
    for (let i = 2; i <= duration; i += 1) {
      items.push({
        name: leave ? "Live Bid Day " + i : "Live Bid Day " + i + " /Results Posted",
        anchor: "live",
        offset: i - 1,
        type: "Task"
      });
    }
  }
  if (leave) {
    if (bid.category === "III_IV") {
      items.push({ name: "Spoke Phone Bid (Stage 1)", anchor: "live", offset: 7, type: "Task" });
      items.push({ name: "Spoke Phone Bid (Stage 2)", anchor: "live", offset: 8, type: "Task" });
    }
    items.push({ name: "First Come First Serve Open", anchor: "fcf", offset: 0, type: "Task" });
  } else {
    items.push({
      name: "Implement Bid",
      anchor: "implementation",
      offset: bid.category === "III_IV" ? 21 : 28,
      type: "Task"
    });
  }
  return items;
}

function resolveToday(today) {
  if (today instanceof Date) return startOfToday(today);
  if (typeof today === "string") return parseLocalDate(today) || startOfToday();
  return startOfToday();
}

export function recalculateBidMilestones(bid, today) {
  const now = resolveToday(today);
  const anchorD0 = parseLocalDate(bid.anchorD0);
  const anchorPlanning = parseLocalDate(bid.planningStart);
  const items = milestoneTemplates(bid);
  bid.milestones = items.map((item) => {
    let target = null;
    if (item.anchor === "planning") {
      target = anchorPlanning ? new Date(anchorPlanning.getTime()) : new Date(now.getTime());
      target.setDate(target.getDate() + item.offset);
    } else if (item.anchor === "fcf") {
      target = parseLocalDate(bid.fcfOpen) || new Date(now.getTime());
    } else if (item.anchor === "implementation") {
      target = parseLocalDate(bid.scheduleStart) || new Date(now.getTime());
    } else {
      target = anchorD0 ? new Date(anchorD0.getTime()) : new Date(now.getTime());
      target.setDate(target.getDate() + item.offset);
    }
    if (target < now) target = new Date(now.getTime());
    if (item.name !== "Implement Bid") {
      target = adjustToWorkday(target, item.offset || -1);
    }
    return {
      id: nextId(),
      name: item.name,
      type: item.type,
      offset: item.offset || 0,
      currentDate: formatLocalDate(target)
    };
  });
  return bid;
}

export function createBid(input) {
  const loc = String(input.location || "DAL").toUpperCase().trim() || "DAL";
  const type = input.type === "Shift Bid" ? "Shift Bid" : "Leave Bid";
  const bid = {
    id: nextId(),
    featureName: loc + " CY27 " + (type === "Leave Bid" ? "Annual Leave" : "Operational") + " Bid",
    location: loc,
    type: type,
    category: input.category === "III_IV" ? "III_IV" : "X_I",
    duration: Math.max(1, parseInt(input.duration, 10) || 1),
    anchorD0: input.anchorD0,
    planningStart: input.planningStart,
    fcfOpen: type === "Leave Bid" ? (input.fcfOpen || null) : null,
    cyStart: type === "Leave Bid" ? (input.cyStart || null) : null,
    scheduleStart: type === "Shift Bid" ? (input.scheduleStart || null) : null,
    milestones: []
  };
  return recalculateBidMilestones(bid, input.today);
}

export function offsetLabel(bid, item) {
  const diff = dayDiff(item.currentDate, bid.anchorD0);
  return "Live Bid Start " + (diff >= 0 ? "+" : "") + diff + " Days";
}

export function milestoneCompliance(bid, item) {
  if (item.name === "Bid Lines Posted") {
    const live = (bid.milestones || []).find((m) => m.name.indexOf("Live Bid Start") !== -1);
    if (live) {
      const diff = dayDiff(live.currentDate, item.currentDate);
      const required = bid.type === "Leave Bid" ? 10 : 14;
      if (diff < required) {
        return {
          compliant: false,
          msg: "CBA Violation (Requires " + required + " days notice, got " + diff + ")"
        };
      }
    }
  }
  if (item.name === "Implement Bid") {
    const live = (bid.milestones || []).find((m) => m.name.indexOf("Live Bid Start") !== -1);
    if (live) {
      const diff = dayDiff(item.currentDate, live.currentDate);
      const required = bid.category === "III_IV" ? 21 : 28;
      if (diff < required) {
        return {
          compliant: false,
          msg: "Buffer Deficit (Requires " + required + " days, got " + diff + ")"
        };
      }
    }
  }
  if (item.name === "First Come First Serve Open" && bid.cyStart) {
    if (dayDiff(item.currentDate, bid.cyStart) >= 0) {
      return { compliant: false, msg: "FCFS must be before CY Start" };
    }
  }
  return { compliant: true, msg: "Compliant" };
}

export function applyMilestoneDate(bid, milestoneId, dateVal, today) {
  const milestone = (bid.milestones || []).find((m) => String(m.id) === String(milestoneId));
  if (!milestone) return false;
  milestone.currentDate = dateVal;
  if (milestone.name === "Live Bid Start") {
    bid.anchorD0 = dateVal;
    recalculateBidMilestones(bid, today);
  } else if (milestone.name === "Review gender balance" || milestone.name === "Seniority Validated") {
    bid.planningStart = dateVal;
    recalculateBidMilestones(bid, today);
  }
  return true;
}
