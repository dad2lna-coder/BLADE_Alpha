<script>
  import {
    readLockForm,
    readLockRuleRows,
    pushLockRule,
    removeLockRule,
    clearLockRules
  } from "../../../modules/setup-panel/actions/scheduleLocksUi.js";

  let shown = $state(false);
  let classKey = $state("ALL");
  let sex = $state("ALL");
  let shiftId = $state("");
  let classes = $state([{ key: "ALL", label: "All Classes" }]);
  let shifts = $state([{ id: "", label: "All Shifts" }]);
  let rules = $state([]);

  function host() {
    return globalThis.Scheduler;
  }

  export function refresh() {
    const S = host() || { state: {} };
    const form = readLockForm(S);
    classes = form.classes;
    shifts = form.shifts;
    if (!classes.some((item) => item.key === classKey)) classKey = "ALL";
    if (!shifts.some((item) => item.id === shiftId)) shiftId = "";
    rules = readLockRuleRows(S);
  }

  export function open() {
    shown = true;
    refresh();
  }

  export function close() {
    shown = false;
  }

  function shut(event) {
    event.preventDefault();
    close();
  }

  function addRule(event) {
    event.preventDefault();
    const S = host();
    if (!S) return;
    pushLockRule(S, classKey, sex, shiftId);
    refresh();
  }

  function removeRule(id) {
    removeLockRule(host(), id);
    refresh();
  }

  function clearRules(event) {
    event.preventDefault();
    clearLockRules(host());
    refresh();
  }
</script>

<div
  id="lock-schedules-modal"
  style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:100000;align-items:center;justify-content:center"
  style:display={shown ? "flex" : "none"}
  aria-hidden={shown ? "false" : "true"}
>
  <div class="card" style="max-width:80vw;max-height:85vh;overflow:auto;margin:7vh auto;background:var(--bg-card,#fff);padding:1.25rem;border-radius:6px;box-shadow:0 4px 20px rgba(0,0,0,0.3)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;border-bottom:1px solid #ddd;padding-bottom:0.5rem">
      <h3 style="margin:0;font-size:1.1rem">Lock Schedules</h3>
      <button type="button" class="btn btn-red" id="lock-schedules-close" onclick={shut}>✕</button>
    </div>
    <p class="muted" style="margin:0 0 0.75rem">Stacked rules protect matching lines' shift assignments across GENERATE, rebalance, and sex swap.</p>

    <div class="card" style="background:var(--bg-subtle,#f8f9fa);padding:0.75rem;margin-bottom:1rem">
      <div style="display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap">
        <label style="font-weight:600">Class:
          <select id="lock-rule-class" style="padding:0.25rem 0.5rem;font-size:0.9rem" bind:value={classKey}>
            {#each classes as item (item.key)}
              <option value={item.key}>{item.label}</option>
            {/each}
          </select>
        </label>
        <label style="font-weight:600">Gender:
          <select id="lock-rule-sex" style="padding:0.25rem 0.5rem;font-size:0.9rem" bind:value={sex}>
            <option value="ALL">All</option>
            <option value="M">Male (M)</option>
            <option value="F">Female (F)</option>
          </select>
        </label>
        <label style="font-weight:600">Shift:
          <select id="lock-rule-shift" style="padding:0.25rem 0.5rem;font-size:0.9rem" bind:value={shiftId}>
            {#each shifts as item (item.id)}
              <option value={item.id}>{item.label}</option>
            {/each}
          </select>
        </label>
        <button type="button" class="btn btn-amber" id="btn-add-lock-rule" onclick={addRule}>+ Add Rule</button>
      </div>
    </div>

    <div style="margin-bottom:0.75rem;display:flex;justify-content:space-between;align-items:center">
      <h4 style="margin:0;font-size:0.95rem">Active Lock Rules</h4>
      <button type="button" class="btn btn-sm btn-red" id="btn-clear-lock-rules" onclick={clearRules}>Clear All Rules</button>
    </div>

    <div id="lock-rules-list" style="display:flex;flex-direction:column;gap:0.5rem;max-height:40vh;overflow-y:auto;border:1px solid #ddd;padding:0.75rem;border-radius:4px">
      {#if rules.length === 0}
        <p class="muted" style="margin:0">No lock rules defined. All generated lines move freely.</p>
      {:else}
        {#each rules as rule (rule.id)}
          <div style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0.75rem;background:var(--bg-subtle,#f8f9fa);border:1px solid #ddd;border-radius:4px;gap:0.75rem">
            <div style="flex:1;font-size:0.88rem">
              <div><strong>Class:</strong> {rule.classText} · <strong>Gender:</strong> {rule.sexText} · <strong>Shift:</strong> {rule.shiftText}</div>
              <div style="font-size:0.8rem;margin-top:0.2rem">
                {#if rule.matching > 0}
                  <strong>{rule.matching} matching line{rule.matching > 1 ? "s" : ""}</strong>
                {:else}
                  <span class="muted">(0 matching lines)</span>
                {/if}
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-red btn-del-lock-rule" data-rule-id={rule.id} onclick={() => removeRule(rule.id)}>Remove</button>
          </div>
        {/each}
      {/if}
    </div>

    <div style="margin-top:1rem;display:flex;justify-content:flex-end">
      <button type="button" class="btn" id="btn-lock-schedules-done" onclick={shut}>Done</button>
    </div>
  </div>
</div>
