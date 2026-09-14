import { selected } from '../stores/teamBuilderStore.js';
import { sexOf } from '../utils/team.js';

function lineEmpShort(p) {
    if (p.role === "STSO" || p.role === "LTSO") return p.role;
    if (p.empClass === "PT") return "PT";
    return "FT";
}

export function lineCardHtml(p, opts = {}) {
    const S = window.Scheduler; // Bridge for getShift
    const sexCls = sexOf(p) === "M" ? "sex-m" : "sex-f";
    const checked = opts.selectable && selected[p.id] ? " checked" : "";
    const removeBtn = opts.removable ? `<button type="button" class="btn btn-red btn-sm" data-remove-member="${p.id}" data-from-team="${opts.teamId || ''}">✕</button>` : "";

    if (opts.compact || opts.removable) {
        const hours = (p.start || "") + "–" + (() => { const sh = S.getShift ? S.getShift(p.shiftId) : null; return sh ? sh.end : ""; })();
        let emp = p.empClass === "PT" ? "PT" : p.empClass === "FT" ? "FT" : lineEmpShort(p);
        if (p.role === "STSO" || p.role === "LTSO") emp = p.empClass === "PT" || p.empClass === "FT" ? p.empClass : "—";
        return `<div class="team-line team-line-compact" data-id="${p.id}"><span class="team-drag-handle" title="Drag">⋮⋮</span><span class="tl-role">${p.role}</span><span class="tl-sex ${sexCls}">${p.sex || "—"}</span><span class="tl-hours muted" title="${p.shiftName || p.shiftId}">${hours}</span><span class="tl-rdo muted" title="RDO">RDO ${p.rdoLabel || "—"}</span><span class="tl-emp muted">${emp}</span>${removeBtn}</div>`;
    }

    const cb = opts.selectable ? `<label class="team-line-check"><input type="checkbox" data-select-line="${p.id}"${checked}></label>` : "";
    return `<div class="team-line" data-id="${p.id}"><span class="team-drag-handle" title="Drag to move">⋮⋮</span>${cb}<span class="team-line-code">${p.lineCode}</span><span class="badge ${S.shiftBadge ? S.shiftBadge(p.shiftId) : ''}">${p.shiftName || p.shiftId}</span><span class="muted">${p.start}</span><span class="muted">RDO ${p.rdoLabel}</span><span class="${sexCls}">${p.sex}</span><span class="muted">${p.empClass}</span></div>`;
}
