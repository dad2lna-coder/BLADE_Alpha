import { teams } from '../stores/teamBuilderStore.js';
import { teamPhaseInfo } from '../utils/phase.js';
import { teamBoardHtml } from './TeamBoard.js';

function teamBoardsHtml(teamsList) {
    if (!teamsList || !teamsList.length) return '<p class="muted" style="padding: 0 1rem 1rem;">No teams in this group.</p>';
    return teamsList.map(teamBoardHtml).join("");
}

export function renderTeamBoards() {
    const amTeams = [], pmTeams = [];
    (teams || []).forEach(t => {
        const info = teamPhaseInfo(t);
        if (info.phase === "PM" || info.phase === "Closing") {
            pmTeams.push(t);
        } else {
            amTeams.push(t);
        }
    });

    const amContainer = document.getElementById("team-boards-am");
    const pmContainer = document.getElementById("team-boards-pm");

    if (amContainer) amContainer.innerHTML = teamBoardsHtml(amTeams);
    if (pmContainer) pmContainer.innerHTML = teamBoardsHtml(pmTeams);
}
