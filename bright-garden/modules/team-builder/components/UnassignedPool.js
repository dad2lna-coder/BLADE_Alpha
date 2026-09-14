import { pool, selected } from '../stores/teamBuilderStore.js';
import { unassignedPool } from '../utils/pool.js';
import { lineCardHtml } from './LineCard.js';

export function renderUnassignedPool() {
    const el = document.getElementById("team-pool");
    if (!el) return;

    el.classList.add("team-role-list");
    el.setAttribute("data-role", "ALL");

    const list = unassignedPool();
    if (pool.length === 0) {
        el.innerHTML = '<p class="muted">Generate a schedule first to populate the pool.</p>';
        return;
    }
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
