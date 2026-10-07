/**
 * Portfolio persistence. One list for the miles view — not the staffing session.
 */

export const PORTFOLIO_KEY = "blade.bid-planner.portfolio";

function storageOf(storage) {
  if (storage) return storage;
  if (typeof localStorage !== "undefined") return localStorage;
  return null;
}

export function readPortfolio(storage) {
  const src = storageOf(storage);
  if (!src) return [];
  try {
    const raw = src.getItem(PORTFOLIO_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

export function writePortfolio(list, storage) {
  const src = storageOf(storage);
  if (!src) return;
  src.setItem(PORTFOLIO_KEY, JSON.stringify(Array.isArray(list) ? list : []));
}

export function createPortfolioStore(storage) {
  let items = readPortfolio(storage);
  function commit() {
    writePortfolio(items, storage);
  }
  return {
    list: function () { return items; },
    replace: function (next) {
      items = Array.isArray(next) ? next.slice() : [];
      commit();
    },
    add: function (bid) {
      items.push(bid);
      commit();
    },
    remove: function (id) {
      items = items.filter((bid) => String(bid.id) !== String(id));
      commit();
    },
    touch: function () { commit(); }
  };
}
