import { getTeamById, teams } from '../stores/teamBuilderStore.js';

let sortables = [];

export function destroySortables() {
    (sortables || []).forEach(s => {
        try {
            s.destroy();
        } catch (e) {}
    });
    sortables = [];
}

export function syncTeamsFromDom() {
    teams.forEach(t => { t.members = []; });
    document.querySelectorAll(".team-board-list[data-team-id]").forEach(board => {
        const team = getTeamById(board.getAttribute("data-team-id"));
        if (!team) return;
        board.querySelectorAll(".team-line[data-id]").forEach(node => {
            const pid = +node.getAttribute("data-id");
            if (!isNaN(pid) && team.members.indexOf(pid) === -1) {
                team.members.push(pid);
            }
        });
    });
}

export function initSortables(onEndCallback) {
    if (typeof Sortable === "undefined" || typeof Sortable.create !== "function") {
        console.warn("Sortable.js not loaded. Drag-and-drop is disabled.");
        return;
    }
    destroySortables();

    function makeOpts(extra) {
        const opts = {
            group: { name: "teams", pull: true, put: true },
            animation: 150,
            draggable: ".team-line",
            handle: ".team-drag-handle, .team-line",
            filter: "input, button, select, label, .team-line-check",
            preventOnFilter: false,
            ghostClass: "sortable-ghost",
            chosenClass: "sortable-chosen",
            dragClass: "sortable-drag",
            forceFallback: false,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onEnd: (evt) => {
                if (evt.from === evt.to && evt.oldIndex === evt.newIndex) return;
                if (typeof onEndCallback === 'function') {
                    onEndCallback(evt);
                }
            }
        };
        if (extra) Object.assign(opts, extra);
        return opts;
    }

    document.querySelectorAll(".team-role-list").forEach(el => {
        sortables.push(Sortable.create(el, makeOpts({ sort: false })));
    });
    document.querySelectorAll(".team-board-list").forEach(el => {
        sortables.push(Sortable.create(el, makeOpts({})));
    });
}
