# Lines Table DOM Audit

## Overview
This audit identifies all DOM selectors, CSS classes, event listeners, and data dependencies that touch the Lines table (lines-tbody, lines-thead, data-line-row, cell-toggle, line-edit, line-rdo-cell, line-hours, lines-scroll, lines-editable, lines-view prefs, line-colors.js wraps). Also checks allocation/coverage/reports/teams for derived consumers of schedule or lines.

## 1. DOM Selectors & Classes

### Core Table Structure
- **lines-tbody** - Main lines table body (ID selector)
  - Source: render.js:421, line-colors.js:43, index.html:48
  - Status: **MUST STAY** - Core data table container

- **lines-thead** - Lines table header (ID selector)
  - Source: render.js:421, index.html:48
  - Status: **MUST STAY** - Header for column definitions

- **data-line-row** - Table row attribute selector
  - Source: render.js:592
  - Status: **MUST STAY** - Identifies table rows for lines data

### Interactive Elements
- **cell-toggle** - Clickable table cells (class selector)
  - Source: render.js:566, 579, 759, 763; line-colors.js:45,53,66; css/styles.css:804,810
  - Status: **MUST STAY** - Core toggle functionality for RDO/WORK cells

- **line-edit** - Editable fields (class selector)
  - Source: render.js:593,601,604,607,611
  - Status: **MUST STAY** - Input/select fields for line editing

- **line-rdo-cell** - RDO display cells (class selector)
  - Source: render.js:617,632; line-colors.js:45,53,66; css/styles.css:814
  - Status: **MUST STAY** - Displays RDO status and text

- **line-hours** - Hours display cells (class selector)
  - Source: render.js:619,632
  - Status: **MUST STAY** - Shows calculated hours for each line

### Scroll & Layout Containers
- **lines-scroll** - Scrollable container (class selector)
  - Source: render.js:430, 488; index.html:48,54; css/styles.css:279
  - Status: **MUST STAY** - Provides scrolling for large tables

- **lines-scroll-wide** - Wide scrollable variant
  - Source: index.html:48; css/styles.css:594; plans/virtual-lines-plan.md:65,66
  - Status: **MUST STAY** - Layout for wide line tables

- **lines-editable** - Editable table styling (class selector)
  - Source: css/styles.css:597,602,603,609,613,784,790,794
  - Status: **MUST STAY** - Styling for editable lines table

### Line Preferences
- **lines-view** - Preference storage keys
  - Source: render.js:279 (S.linesView object)
  - Status: **NEEDS UPDATE HOOK** - Preferences management needs audit

## 2. Event Listeners

### Lines Table Events
- **click** - Cell toggle events
  - Source: render.js:732 (bound to document)
  - Target: `.cell-toggle` elements
  - Status: **MUST STAY** - Core toggle functionality

- **change** - Form field updates
  - Source: render.js:647 (bound to document)
  - Target: `.line-edit` elements
  - Status: **MUST STAY** - Line editing persistence

- **DOMContentLoaded** - Initialization triggers
  - Source: line-colors.js:97; main.js:144
  - Status: **MUST STAY** - Ensures DOM readiness

### Wrapped Functions (line-colors.js)
- **renderLines** - Wrapped for color painting
  - Source: line-colors.js:82
  - Status: **NEEDS UPDATE HOOK** - Color painting side-effect

- **renderAll** - Wrapped for color persistence
  - Source: line-colors.js:83
  - Status: **NEEDS UPDATE HOOK** - Color persistence across renders

- **generateFunctionAssignments** - Wrapped for color sync
  - Source: line-colors.js:84
  - Status: **NEEDS UPDATE HOOK** - Color sync with function assignments

## 3. Data Dependencies

### State Access Patterns

#### Direct State Access
- **S.state.lines** - Lines array access
  - Source: render.js:73,80,105,159,159,212,480,559,626,637; line-colors.js:45
  - Status: **MUST STAY** - Primary data source for lines table

- **S.state.schedule** - Schedule object access
  - Source: render.js:80,161,559,561; line-colors.js:49,66; functions.js:73
  - Status: **MUST STAY** - Schedule data drives table display

- **S.state.functionRotation** - Function rotation mapping
  - Source: line-colors.js:20-41; functions.js:22-46; io.js:94
  - Status: **MUST STAY** - Function color assignments

- **S.state.teamDayMod** - Team daily mod assignments
  - Source: capacity.js:83; line-colors.js:66
  - Status: **MUST STAY** - Coverage assignments display

### Derived Consumer Functions

#### Rendering Functions
- **S.renderLines()** - Primary table renderer
  - Source: render.js:420, calls lines table generation
  - Status: **MUST STAY** - Table generation core

- **S.renderAll()** - Unified renderer
  - Source: render.js:790; console-chrome.js:253
  - Status: **MUST STAY** - Main render coordinator

#### Data Processing Functions
- **S.computeHourlyByDow()** - Hours calculation
  - Source: render.js:37; calls lines table data processing
  - Status: **MUST STAY** - Hours display logic

- **S.syncRdoDaysFromSchedule()** - RDO sync function
  - Source: render.js:286; called from toggle handler
  - Status: **NEEDS UPDATE HOOK** - RDO state synchronization

- **S.refreshLineRowDerived()** - Row derived data refresh
  - Source: render.js:626; called from toggle handler
  - Status: **NEEDS UPDATE HOOK** - Derived data refresh

#### Team/Coverage Functions
- **S.teamWorksDay()** - Team work status checker
  - Source: capacity.js:74; calls schedule data for lines
  - Status: **MUST STAY** - Determines team participation

- **S.memberWorks()** - Individual work status
  - Source: capacity.js:69; reads schedule for lines
  - Status: **MUST STAY** - Checks individual line schedule

- **S.teamMemberCounts()** - Team composition analysis
  - Source: team-core.js:94; aggregates lines data
  - Status: **MUST STAY** - Team statistics display

## 4. External Dependencies

### Allocation Module
- **allocation.js** - Uses lines and schedule data
  - Lines: tsoLines array, S.state.lines
  - Schedule: S.state.schedule access patterns
  - Status: **MUST STAY** - Allocation calculations depend on lines data

### Coverage Cuts Module
- **coverage-cuts.js** - Schedule management
  - Lines: S.state.lines array filtering
  - Schedule: S.state.schedule creation/modification
  - Status: **MUST STAY** - Coverage logic uses lines data

### Export Board Module
- **export-board.js** - Lines export functionality
  - Lines: S.state.lines array processing
  - Schedule: S.state.schedule mapping for export
  - Status: **MUST STAY** - Export depends on lines display data

### Functions Module
- **functions.js** - Function assignment logic
  - Lines: S.state.lines array filtering for roles
  - Schedule: S.state.schedule integration
  - functionRotation: S.state.functionRotation mapping
  - Status: **MUST STAY** - Function assignments drive colors

### IO Module
- **io.js** - Import/export state management
  - Lines: S.state.lines array persistence
  - Schedule: S.state.schedule persistence
  - functionRotation: S.state.functionRotation persistence
  - Status: **MUST STAY** - State storage includes lines data

### Schedule Module
- **schedule.js** - Schedule generation
  - Lines: S.state.lines array processing for scheduling
  - Schedule: S.state.schedule creation/modification
  - Status: **MUST STAY** - Schedule generation core

### Team Core Module
- **team-core.js** - Team management
  - Lines: S.state.lines array for pool management
  - Status: **MUST STAY** - Team assignment uses lines data

### Shifts Module
- **shifts.js** - Shift management
  - Indirect lines dependency via S.renderAll()
  - Status: **MUST STAY** - UI integration

## 5. DOM API Usage Analysis

### Element Access Patterns
- **document.getElementById()** - ID-based access
  - Used for: lines-tbody, lines-thead, status elements
  - Status: **MUST STAY** - Essential for DOM manipulation

- **document.querySelectorAll()** - CSS selector-based access
  - Used for: .cell-toggle, .line-edit elements
  - Status: **MUST STAY** - Batch element operations

- **element.closest()** - Ancestor traversal
  - Used in: render.js:746 for finding cell-toggle
  - Status: **MUST STAY** - Event delegation targeting

### Property Manipulation
- **classList** - CSS class management
  - Used for: cell state toggling, active states
  - Status: **MUST STAY** - Visual state management

- **innerHTML** - Content injection
  - Used in: render.js for table generation
  - Status: **MUST STAY** - Dynamic table building

- **textContent** - Text content updates
  - Used for: status displays, hour values
  - Status: **MUST STAY** - User feedback

## 6. Dependency Status Summary

### Critical Path (MUST STAY)
✅ Core DOM selectors (lines-tbody, lines-thead, data-line-row)  
✅ Interactive elements (cell-toggle, line-edit, line-rdo-cell)  
✅ Layout containers (lines-scroll, lines-editable)  
✅ State data access (state.lines, state.schedule)  
✅ Rendering functions (renderLines, renderAll)  
✅ External consumers (allocation, coverage-cuts, export, functions, io, schedule, team-core)

### Requires Update Hook (NEEDS REVIEW)
⚠️ line-colors.js function wrappers - need audit of color painting logic  
⚠️ syncRdoDaysFromSchedule - RDO state synchronization  
⚠️ refreshLineRowDerived - Derived data refresh mechanism

## 7. Recommendations

### Immediate Actions
1. **Preserve core DOM structure** - All core selectors must remain for functionality
2. **Audit line-colors.js wrapping** - Ensure color painting doesn't break updates
3. **Review update hooks** - Verify RDO sync and derived refresh mechanisms

### Long-term Considerations
1. **Preference management** - lines-view prefs need structured update handling
2. **Function assignment integration** - Ensure color updates sync with function changes
3. **Team/schedule coupling** - Monitor for circular dependencies

## 8. Files Requiring Further Review
- **line-colors.js** - Color painting logic and wrapping strategy
- **render.js** - syncRdoDaysFromSchedule and refreshLineRowDerived functions
- **All consumer modules** - Verify proper update hook integration

---
*Audit completed: 2026-09-14*
*Status: Core dependencies identified, update hooks pending review*