# Virtualized Lines Table Plan

## Problem
The Lines tab renders all staff lines as table rows. With large schedules (hundreds of staff), this causes performance issues in DOM layout and repaint.

## Goal
Implement virtual scrolling for the Lines table body while preserving:
- Existing filtering and sorting UI
- Export to Excel functionality (full dataset)
- Line coloring (RDO/BAG/DFO)
- Grouping, sorting, and filtering controls
- No breaking changes to existing API (S.state.lines, renderLines, etc.)

## Component Boundaries
1. **VirtualScrollContainer** (new): wraps the tbody, manages visible window.
2. **LinesTableHeader** (existing thead): unchanged.
3. **LinesTableRow** (existing row renderer): unchanged but used only for visible rows.
4. **LinesToolbar** (existing): unchanged.
5. **Export Button** (existing): unchanged.

## Data Flow
1. S.state.lines remains the source of truth (full dataset).
2. `filterLinesForView()` and `sortLinesForView()` produce `visibleLines` (filtered/sorted full list).
3. Virtual scroll calculates:
   - `startIndex` = Math.floor(scrollTop / rowHeight)
   - `endIndex` = startIndex + viewportRows + buffer (typically 2-3 extra rows each side)
4. Only rows `[startIndex, endIndex)` are rendered into the tbody.
5. A spacer element (absolutely positioned) above/below the tbody maintains scroll height:
   - `spacerBefore.height = startIndex * rowHeight`
   - `spacerAfter.height = (totalLines - endIndex) * rowHeight`
6. On scroll, requestAnimationFrame updates the rendered slice and spacers.
7. Row height is constant (can be measured from first rendered row or set via CSS).

## CSS Strategy
- `.lines-scroll-wide`: `position: relative; overflow: auto;`
- Virtual container inside: `position: relative; height: 100%;`
- Spacer elements: `position: absolute; top: 0; left: 0; right: 0;`
- Tbody: `position: relative;`
- Each row: `position: absolute; top: ${index * rowHeight}px; left: 0; right: 0;` (or use transform: translateY)
- Alternatively, use `transform: translateY` on a inner wrapper for better performance.
- Ensure no layout thrashing: read scrollTop, then write transforms in same RAF.

## Integration Steps
1. In `renderLines()` (render.js):
   - Compute `filteredSorted = S.sortLinesForView(S.filterLinesForView(S.state.lines))`
   - Determine viewport metrics (clientHeight, rowHeight via first row or constant ~48px).
   - Calculate visible range.
   - Render only visible rows into tbody (reuse existing row template).
   - Update spacer heights.
   - Bind scroll listener (if not already) using passive event.
2. Modify `bindLinesUI()` to also attach scroll listener to the lines-scroll element.
3. Ensure line-colors.js works: after updating visible rows, call `paintLinesTable()` (it currently queries tbody children; will work because we fill tbody with visible rows). However, note that line-colors.js expects all rows? It loops over tbody children; with virtualization, only visible rows are present. This is fine because off-screen rows are not painted until they become visible (and then they will be painted on next render cycle). If immediate painting is needed, we can call it after each render cycle.
4. Export functionality: `export-board.js` uses `S.state.lines` directly (or a slice). It is unchanged because it operates on the full dataset, not the rendered table.
5. Testing: Verify filters, sorting, grouping still work. Verify scrollbar reflects total count. Verify performance with large datasets.

## Risks & Mitigation
- **Variable row height**: Assume fixed height; if content varies, measure max height and use consistent.
- **Scroll jerkiness**: Use requestAnimationFrame and translateY to avoid layout thrashing.
- **Resizing**: Recalculate viewport on window resize and lines-scroll resize (use ResizeObserver if available).
- **Group rows**: If grouping is enabled (via lines-group-by), we need to render group headers as special rows. The virtual scroll must account for group headers having different height. Solution: treat each group header and its lines as a section with variable height; more complex. For simplicity, we can disable grouping when line count exceeds a threshold, or implement variable-height virtualization (more complex). Given the existing UI, grouping is via a dropdown; we can measure each rendered element's actual height.

## Implementation Outline (Pseudo)
```javascript
// In renderLines()
const container = S.$('lines-scroll-wide'); // or the scroll container
const tbody = S.$('lines-tbody');
const thead = S.$('lines-thead');
const filteredSorted = S.sortLinesForView(S.filterLinesForView(S.state.lines));
const total = filteredSorted.length;
const rowHeight = 48; // px, could be measured
const viewportHeight = container.clientHeight;
const visibleCount = Math.ceil(viewportHeight / rowHeight) + 2; // buffer
const scrollTop = container.scrollTop;
const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 1);
const endIndex = Math.min(total, startIndex + visibleCount);

// Render rows [startIndex, endIndex)
let rowsHtml = '';
for (let i = startIndex; i < endIndex; i++) {
  const line = filteredSorted[i];
  rowsHtml += renderLineRow(line, i); // existing row renderer
}
tbody.innerHTML = rowsHtml;

// Update spacers (create if not exist)
let spacerBefore = S.$('lines-spacer-before');
if (!spacerBefore) {
  spacerBefore = document.createElement('div');
  spacerBefore.className = 'lines-spacer';
  spacerBefore.id = 'lines-spacer-before';
  container.insertBefore(spacerBefore, container.firstChild);
}
let spacerAfter = S.$('lines-spacer-after');
if (!spacerAfter) {
  spacerAfter = document.createElement('div');
  spacerAfter.className = 'lines-spacer';
  spacerAfter.id = 'lines-spacer-after';
  container.appendChild(spacerAfter);
}
spacerBefore.style.height = `${startIndex * rowHeight}px`;
spacerAfter.style.height = `${(total - endIndex) * rowHeight}px';

// Ensure tbody positioned correctly (if using absolute positioning for rows)
// If using transform, set tbody.style.transform = `translateY(${startIndex * rowHeight}px)`;

// Line colors: call after update
if (S.paintLineColors) S.paintLineColors();
```

## Files to Modify
- `js/render.js`: replace `renderLines()` function, adjust `bindLinesUI()`.
- `js/line-colors.js`: ensure it works with virtual rows (may need to call after each virtual update).
- `index.html`: no change unless we need to add spacer elements (they will be inserted by JS).
- `css/styles.css`: add styles for `.lines-spacer` and positioning.

## Verification
- Export Excel still exports all lines.
- Filters update correctly and reset scroll to top.
- Sorting updates correctly.
- Grouping (if used) works; if problematic, we may need to enhance variable-height virtualization.