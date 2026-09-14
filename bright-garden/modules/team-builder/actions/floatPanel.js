import { teams, buildOpen, getTeamById, selected, setBuildOpen } from '../stores/teamBuilderStore.js';

let floatPanelsBound = false;

export function applyFollowMe(forceOpen = false) {
    const S = window.Scheduler; // Bridge to legacy app
    if (forceOpen) setBuildOpen(true);

    const teamsTabActive = document.querySelector("#tab-teams.active") !== null;
    const following = teams.some(t => !!t.followMe);
    const show = teamsTabActive && (following || buildOpen);
    const docks = document.getElementById("team-follow-docks");

    if (docks) {
        if (show) {
            docks.hidden = false;
            docks.classList.add("is-active");
            document.body.classList.add("team-follow-active");
            initFloatPanels();
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
        panel.style.width = "";
        panel.style.height = "";
        if (!panel.style.left && !panel.style.right) {
            if (idx === 0) {
                panel.style.right = "24rem";
                panel.style.top = "7.5rem";
            } else {
                panel.style.right = "0.75rem";
                panel.style.top = "7.5rem";
            }
        }
        const handle = panel.querySelector("[data-drag-handle]");
        if (!handle) return;

        handle.addEventListener("mousedown", (e) => {
            if (e.button !== 0 || (e.target && (e.target.tagName === "BUTTON" || e.target.closest("button")))) return;
            e.preventDefault();
            const rect = panel.getBoundingClientRect();
            const ox = e.clientX - rect.left;
            const oy = e.clientY - rect.top;
            panel.style.width = rect.width + "px";
            panel.style.height = rect.height + "px";
            panel.style.left = rect.left + "px";
            panel.style.top = rect.top + "px";
            panel.style.right = "auto";
            panel.classList.add("is-dragging");

            function onMove(ev) {
                const x = Math.max(0, Math.min(window.innerWidth - 80, ev.clientX - ox));
                const y = Math.max(0, Math.min(window.innerHeight - 40, ev.clientY - oy));
                panel.style.left = x + "px";
                panel.style.top = y + "px";
            }

            function onUp() {
                panel.classList.remove("is-dragging");
                document.removeEventListener("mousemove", onMove);
                document.removeEventListener("mouseup", onUp);
            }
            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", onUp);
        });
    });
}


export function toggleTeamPin(teamId) {
    const team = getTeamById(teamId);
    if (!team) return;
    team.followMe = !team.followMe;
    if (team.followMe) setBuildOpen(true);
}

export function closeTeamUi() {
    setBuildOpen(false);
    teams.forEach(t => { t.followMe = false; });

    for (const key in selected) {
        delete selected[key];
    }

    const md = document.getElementById("team-detail-modal");
    if (md) {
        md.style.display = "none";
        md.classList.remove("is-open");
    }
    applyFollowMe();
}
