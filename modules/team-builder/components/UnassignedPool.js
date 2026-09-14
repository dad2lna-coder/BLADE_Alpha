import { pool, selected, teams } from '../stores/teamBuilderStore.js';
import { unassignedPool } from '../utils/pool.js';
import { lineCardHtml } from './LineCard.js';

export function renderUnassignedPool() {
    const el = document.getElementById("team-pool");
    if (!el) return;

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
