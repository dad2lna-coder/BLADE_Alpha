'''
import { teams, buildOpen, getTeamById } from '../stores/teamBuilderStore.js';

let floatPanelsBound = false;

export function applyFollowMe(forceOpen = false) {
    const S = window.Scheduler; // Bridge to legacy app
    if(forceOpen) buildOpen = true;

    const teamsTabActive = document.querySelector("#tab-teams.active") !== null;
    const following = teams.some(t => !!t.followMe);
    const show = teamsTabActive && (following || buildOpen);
    const docks = document.getElementById("team-follow-docks");

    if (docks) {
        if (show) {
            docks.hidden = false;
            docks.classList.add("is-active");
            document.body.classList.add("team-follow-active");
            if (S && S.initFloatPanels) S.initFloatPanels();
        } else {
            docks.hidden = true;
            docks.classList.remove("is-active");
            document.body.classList.remove("team-follow-active");
        }
    }
}

export function initFloatPanels() {
    if (floatPanelsBound) return;
    floatPanelsBound = true;

    document.querySelectorAll(".team-float-panel").forEach((panel, idx) => {
        // ... (mousedown, touchstart logic from original file) ...
    });
}

export function toggleTeamPin(teamId) {
    const team = getTeamById(teamId);
    if (!team) return;
    team.followMe = !team.followMe;
    if (team.followMe) buildOpen = true;
}

export function closeTeamUi() {
    buildOpen = false;
    teams.forEach(t => { t.followMe = false; });
    
    const md = document.getElementById("team-detail-modal");
    if (md) {
        md.style.display = "none";
        md.classList.remove("is-open");
    }
    applyFollowMe();
}

'''
