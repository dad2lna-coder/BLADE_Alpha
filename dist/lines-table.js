function L(a) {
  const i = a || window.Scheduler;
  if (!i) return;
  const e = document.getElementById("lines-table-root");
  if (!e) {
    console.warn("lines-table: #lines-table-root not found");
    return;
  }
  if (e._linesTableMounted) return;
  e._linesTableMounted = !0;
  const o = () => {
    const s = typeof i.getLineRowModels == "function" ? i.getLineRowModels() : [], n = Array.isArray(s) ? s.slice(0, 50) : [];
    e._linesTableApp && (e._linesTableApp.$destroy(), e._linesTableApp = null);
    try {
      const l = new function() {
        this.$destroy = function() {
          e && e._linesTableApp === this && (e.innerHTML = "", e._linesTableMounted = !1, e._linesTableApp = null);
        };
      }();
      e._linesTableApp = new l({
        target: e,
        props: { rows: n }
      });
    } catch (l) {
      console.error("lines-table: mount failed", l), e.innerHTML = `
        <table class="data-table lines-table-svelte">
          <thead>
            <tr>
              <th>Team</th><th>Line</th><th>Shift</th><th>Start</th><th>End</th>
              <th>Position</th><th>Emp</th><th>Sex</th><th>Function</th><th>RDOs</th><th>Paid</th>
              ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((t) => `<th>${t}</th>`).join("")}
              <th>Hours</th>
            </tr>
          </thead>
          <tbody>
            ${n.map((t) => {
        const d = t.team || "", c = t.lineCode || "", h = t.shiftName || "", r = t.start || "", u = t.end || "", p = t.position || "", b = t.emp || "", f = t.sex || "", T = t.function || "", m = t.paid || 0, y = t.days || new Array(7).fill("RDO");
        t.hours;
        const A = [
          d,
          c,
          h,
          r,
          u,
          p,
          b,
          f,
          T,
          t.rdos || "—",
          m,
          ...y.map((_) => `<td>${_}</td>`)
        ].join("");
        return `<tr data-line-row="${t.line || t.id}"><td>${A}</td></tr>`;
      }).join("")}
          </tbody>
        </table>
      `;
    }
  };
  o(), document.addEventListener("click", (s) => {
    const n = s.target.closest?.(".tab-btn");
    n && n.dataset.tab === "lines" && o();
  });
}
export {
  L as initLinesTable
};
