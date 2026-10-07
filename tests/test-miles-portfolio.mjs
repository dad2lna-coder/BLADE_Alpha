/**
 * Portfolio calendar: milestone math, persistence, and CHAOS table shape.
 */

import assert from "node:assert/strict";
import { dayDiff, previousSunday } from "../modules/bid-planner/js/miles/dates.js";
import {
  createBid,
  milestoneCompliance,
  recalculateBidMilestones
} from "../modules/bid-planner/js/miles/milestones.js";
import { createPortfolioStore, PORTFOLIO_KEY } from "../modules/bid-planner/js/miles/portfolio.js";
import {
  buildIcs,
  cellToIso,
  featureRows,
  generateMasterTSV,
  portfolioFromTables,
  workItemRows
} from "../modules/bid-planner/js/miles/importExport.js";

function byName(bid, name) {
  return bid.milestones.find((item) => item.name === name);
}

const today = "2026-01-01";

{
  const bid = createBid({
    location: "dal",
    type: "Leave Bid",
    category: "X_I",
    duration: 1,
    anchorD0: "2026-10-14",
    planningStart: "2026-09-01",
    fcfOpen: "2026-12-20",
    cyStart: "2027-01-01",
    today
  });
  assert.equal(bid.location, "DAL");
  assert.equal(bid.featureName, "DAL CY27 Annual Leave Bid");
  assert.equal(byName(bid, "Seniority Validated").currentDate, "2026-09-01");
  assert.equal(byName(bid, "Bid Announcement Letter").currentDate, "2026-09-11");
  assert.equal(byName(bid, "Live Bid Start").currentDate, "2026-10-14");
  assert.equal(byName(bid, "First Come First Serve Open").currentDate, "2026-12-18");
  assert.equal(milestoneCompliance(bid, byName(bid, "Bid Lines Posted")).compliant, true);
  assert.equal(byName(bid, "Spoke Phone Bid (Stage 1)"), undefined);
}

{
  const bid = createBid({
    location: "SPS",
    type: "Leave Bid",
    category: "III_IV",
    duration: 3,
    anchorD0: "2026-10-14",
    planningStart: "2026-09-01",
    fcfOpen: "2026-12-20",
    cyStart: "2026-12-18",
    today
  });
  assert.equal(byName(bid, "Live Bid Day 2").currentDate, "2026-10-15");
  assert.equal(byName(bid, "Live Bid Day 3").currentDate, "2026-10-16");
  assert.ok(byName(bid, "Spoke Phone Bid (Stage 2)"));
  const fcfs = byName(bid, "First Come First Serve Open");
  assert.equal(milestoneCompliance(bid, fcfs).compliant, false);
}

{
  const bid = createBid({
    location: "DFW",
    type: "Shift Bid",
    category: "X_I",
    duration: 1,
    anchorD0: "2026-10-14",
    planningStart: "2026-09-01",
    scheduleStart: "2026-11-15",
    today
  });
  assert.equal(bid.featureName, "DFW CY27 Operational Bid");
  const impl = byName(bid, "Implement Bid");
  assert.equal(impl.currentDate, "2026-11-15");
  assert.equal(impl.offset, 28);
  assert.equal(milestoneCompliance(bid, impl).compliant, true);
  bid.scheduleStart = "2026-10-20";
  recalculateBidMilestones(bid, today);
  assert.equal(milestoneCompliance(bid, byName(bid, "Implement Bid")).compliant, false);
}

{
  const bid = createBid({
    location: "DAL",
    type: "Leave Bid",
    category: "X_I",
    duration: 1,
    anchorD0: "2026-10-14",
    planningStart: "2026-09-01",
    fcfOpen: "2026-12-20",
    cyStart: "2027-01-01",
    today: "2026-10-07"
  });
  assert.equal(byName(bid, "Bid Announcement Letter").currentDate, "2026-10-07");
  assert.equal(byName(bid, "Live Bid Start").currentDate, "2026-10-14");
}

{
  assert.equal(dayDiff("2026-11-02", "2026-10-31"), 2);
  assert.equal(previousSunday("2026-11-16"), "2026-11-15");
  assert.equal(previousSunday("2026-11-15"), "2026-11-15");
  assert.equal(cellToIso("10/14/2026"), "2026-10-14");
  assert.equal(cellToIso(new Date(Date.UTC(2026, 9, 14))), "2026-10-14");
}

{
  const mem = new Map();
  const storage = {
    getItem: (key) => (mem.has(key) ? mem.get(key) : null),
    setItem: (key, value) => mem.set(key, value)
  };
  const store = createPortfolioStore(storage);
  const bid = createBid({
    location: "DAL",
    type: "Shift Bid",
    category: "III_IV",
    duration: 1,
    anchorD0: "2026-10-14",
    planningStart: "2026-09-01",
    scheduleStart: "2026-11-08",
    today
  });
  store.add(bid);
  assert.equal(byName(bid, "Implement Bid").offset, 21);
  const again = createPortfolioStore(storage);
  assert.equal(again.list().length, 1);
  assert.equal(again.list()[0].featureName, bid.featureName);
  assert.ok(mem.get(PORTFOLIO_KEY).includes("DAL CY27"));
  again.remove(bid.id);
  assert.equal(again.list().length, 0);
}

{
  const bid = createBid({
    location: "DAL",
    type: "Leave Bid",
    category: "X_I",
    duration: 1,
    anchorD0: "2026-10-14",
    planningStart: "2026-09-01",
    fcfOpen: "2026-12-20",
    cyStart: "2027-01-01",
    today
  });
  const features = featureRows([bid]);
  const work = workItemRows([bid]);
  assert.equal(features[0][0], "Feature Name");
  assert.equal(features[1][5], "Leave Bid");
  assert.equal(work[1][1].split("/").length, 3);
  const tsv = generateMasterTSV([bid], "workitems");
  assert.ok(tsv.startsWith("Work Item Name\tDue Date\t"));
  const ics = buildIcs([bid]);
  assert.ok(ics.includes("BEGIN:VEVENT"));
  assert.ok(ics.includes("DAL - Live Bid Start"));
  const imported = portfolioFromTables(
    [{ "Feature Name": bid.featureName, Initiative: bid.type }],
    work.slice(1).map((row) => ({
      "Work Item Name": row[0],
      "Due Date": row[1],
      Feature: row[3],
      "Work Item Type": row[4]
    }))
  );
  assert.equal(imported.length, 1);
  assert.equal(imported[0].location, "DAL");
  assert.equal(imported[0].anchorD0, "2026-10-14");
  assert.ok(imported[0].milestones.length > 5);
}

console.log("miles portfolio tests passed");
