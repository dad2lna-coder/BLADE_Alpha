import { pool, selected, teams } from '../stores/teamBuilderStore.js';
import { unassignedPool } from '../utils/pool.js';
import { lineCardHtml } from './LineCard.js';

/** Pool cards paint only while #team-pool-section is open (collapsed-by-default). */
export function isPoolExpanded() {
    const section = document.getElementById("team-pool-section");
    if (!section) return true;
    return !!section.open;
}

export function updatePoolHeaderCount() {
    const label = document.getElementById("team-pool-summary-label");
    if (!label) return;
    const k = unassignedPool().length;
    label.textContent = "Unassigned pool — " + k + " in pool (filtered)";
}

export function clearUnassignedPoolDom() {
    const el = document.getElementById("team-pool");
    if (!el) return;
    el.classList.remove("team-role-list");
    el.removeAttribute("data-role");
    el.innerHTML = "";
}

export function renderUnassignedPool() {
    if (typeof performance !== "undefined" && performance.mark) {
        performance.mark("renderUnassignedPool");
    }
    updatePoolHeaderCount();

    const el = document.getElementById("team-pool");
    if (!el) return;

    // Collapsed: do not build thousands of LineCards.
    if (!isPoolExpanded()) {
        clearUnassignedPoolDom();
        return;
    }

    if (teams.length === 0) {
        el.classList.remove("team-role-list");
        el.removeAttribute("data-role");
        el.innerHTML = '<p class="muted">Generate, then Auto-form teams</p>';
        return;
    }

    el.classList.add("team-role-list");
    el.setAttribute("data-role", "ALL");

    const list = unassignedPool();
    if (!list.length) {
        el.innerHTML = '<p class="muted">No unassigned lines match the active filters.</p>';
        return;
    }
    el.innerHTML = list.map(p => lineCardHtml(p, { selectable: true })).join("");
}

export function selectAllVisible() {
    unassignedPool().forEach(p => {
        selected[p.id] = true;
    });
}
