import { pool, selected } from '../stores/teamBuilderStore.js';
import { unassignedPool, groupPoolByRole } from '../utils/pool.js';
import { lineCardHtml } from './LineCard.js';

const ROLES = ["TSO", "LTSO", "STSO"];

export function renderUnassignedPool() {
    const el = document.getElementById("team-pool");
    if (!el) return;

    const groups = groupPoolByRole(unassignedPool());
    el.innerHTML = "";

    ROLES.forEach(role => {
        const list = groups[role];
        const column = document.createElement('div');
        column.className = 'team-role-group';
        const title = document.createElement('div');
        title.className = 'team-role-title';
        title.innerHTML = `${role} <span class="muted">(${list.length})</span>`;
        const roleList = document.createElement('div');
        roleList.className = 'team-role-list';
        roleList.setAttribute('data-role', role);
        roleList.innerHTML = list.length > 0 ? list.map(p => lineCardHtml(p, { selectable: true })).join("") : '<p class="muted" style="text-align: center; padding: 1rem;">(empty)</p>';
        column.appendChild(title);
        column.appendChild(roleList);
        el.appendChild(column);
    });

    if (unassignedPool().length === 0 && pool.length > 0) {
        el.innerHTML = '<p class="muted" style="grid-column: 1 / -1;">No unassigned lines match the active filters.</p>';
    } else if (pool.length === 0) {
        el.innerHTML = '<p class="muted" style="grid-column: 1 / -1;">Generate a schedule first to populate the pool.</p>';
    }
}

export function selectAllVisible() {
    unassignedPool().forEach(p => {
        selected[p.id] = true;
    });
}
