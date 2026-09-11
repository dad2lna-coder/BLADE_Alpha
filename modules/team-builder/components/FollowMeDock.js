import { teams } from '../stores/teamBuilderStore.js';
import { memberLine } from '../utils/pool.js';
import { sexOf } from '../utils/team.js';
import { teamSummaryHtml } from './TeamPills.js';

function pinMemberChipHtml(p) {
    const sexCls = sexOf(p) === 'F' ? 'sex-f' : 'sex-m';
    return `<div class="team-line team-line-compact" data-id="${p.id}"><span class="team-drag-handle" title="Drag">⋮⋮</span><span class="tl-role">${p.role}</span><span class="tl-sex ${sexCls}">${p.sex || '—'}</span></div>`;
}

function pinnedTeamBlockHtml(t) {
    const chips = (t.members || []).map(mid => {
        const p = memberLine(mid);
        return p ? pinMemberChipHtml(p) : '';
    }).join('');
    const listBody = chips.length ? chips : '<div class="muted" style="font-size:0.72rem;padding:0.25rem 0.2rem">drop lines</div>';

    return `<div class="team-pin-block" data-pin-block="${t.id}" style="display:flex;flex-direction:column;gap:0.25rem;min-width:0">
        ${teamSummaryHtml(t, { badge: true })}
        <div class="team-board-list" data-team-id="${t.id}" style="min-height:2.4rem;padding:0.2rem;border:1px dashed #60a5fa55">
            ${listBody}
        </div>
    </div>`;
}

export function renderPinnedSummaries() {
    const dock = document.getElementById('team-boards-follow');
    const title = document.querySelector('#team-boards-dock .section-title');
    if (title) title.textContent = 'Pinned';

    const pinned = (teams || []).filter(t => !!t.followMe);
    if (!dock) return;

    dock.innerHTML = pinned.length
      ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(8.6rem,1fr));gap:0.35rem">${pinned.map(pinnedTeamBlockHtml).join('')}</div>`
      : '<p class="muted">Pin a team pill to dock a summary here.</p>';
}
