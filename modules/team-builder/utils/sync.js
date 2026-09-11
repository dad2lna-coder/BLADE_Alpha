import { teams } from '../stores/teamBuilderStore.js';

// Helper to find a line in the legacy state by its ID
export function getLineById(lines, id) {
    const numId = +id;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].id === numId) {
            return lines[i];
        }
    }
    return null;
}

// The core function to write team assignments back to the main application
export function writeAssignmentsToLegacyState(legacyLines) {
    if (!legacyLines || !Array.isArray(legacyLines)) return;

    // Create a map for quick lookups of which line is on which team
    const lineToTeamMap = new Map();
    teams.forEach(team => {
        team.members.forEach(memberId => {
            lineToTeamMap.set(+memberId, { teamId: team.id, teamName: team.name });
        });
    });

    // Iterate through the main application's state and update each line
    legacyLines.forEach(line => {
        const assignment = lineToTeamMap.get(line.id);
        if (assignment) {
            // If the line is on a team in our module, update its properties
            line.teamId = assignment.teamId;
            line.teamName = assignment.teamName;
        } else {
            // If the line is NOT on any team, clear its properties
            delete line.teamId;
            delete line.teamName;
        }
    });
}
