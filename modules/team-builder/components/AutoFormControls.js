import { formOpts } from '../stores/teamBuilderStore.js';

export function injectAutoFormControls() {
    const bar = document.getElementById("team-architecture");
    if (!bar || document.getElementById("form-start-window")) return;

    const wrap = document.createElement("span");
    wrap.className = "team-form-opts";
    wrap.style.cssText = "display:inline-flex;flex-wrap:wrap;gap:0.6rem;align-items:center;";
    wrap.innerHTML = `
        <label title="Treat nearby start times as the same crew window">Start window (min)
            <input type="number" id="form-start-window" min="0" max="180" step="15" value="${formOpts.startWindowMin}" style="width:4rem">
        </label>
        <label class="follow-me-label" title="Also place people who share at least one RDO day and fall in the start window">
            <input type="checkbox" id="form-allow-one-rdo"> Allow 1 matching RDO
        </label>`;

    const hint = document.getElementById("arch-hint");
    if (hint) {
        bar.insertBefore(wrap, hint);
    } else {
        bar.appendChild(wrap);
    }

    document.getElementById("form-start-window").addEventListener("change", function () {
        formOpts.startWindowMin = Math.max(0, Math.min(180, +this.value || 0));
    });
    document.getElementById("form-allow-one-rdo").addEventListener("change", function () {
        formOpts.allowOneRdo = !!this.checked;
    });
}
