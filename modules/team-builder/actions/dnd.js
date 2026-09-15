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
    // Only rewrite members for lists that currently have LineCards.
    // Compact boards keep store membership (empty DOM must not wipe Auto-form).
    document.querySelectorAll(".team-board-list[data-members-painted=\"1\"]").forEach(board => {
        const team = getTeamById(board.getAttribute("data-team-id"));
        if (!team) return;
        const next = [];
        board.querySelectorAll(".team-line[data-id]").forEach(node => {
            const pid = +node.getAttribute("data-id");
            if (!isNaN(pid) && next.indexOf(pid) === -1) next.push(pid);
        });
        team.members = next;
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
    // Compact lists have no LineCards and no data-members-painted.
    document.querySelectorAll(".team-board-list[data-members-painted=\"1\"]").forEach(el => {
        sortables.push(Sortable.create(el, makeOpts({})));
    });
}
