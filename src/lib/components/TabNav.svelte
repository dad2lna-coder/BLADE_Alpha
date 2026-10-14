<script>
  import { shell } from "../shell/chrome.svelte.js";

  function select(id) {
    const scheduler = globalThis.Scheduler;
    if (scheduler && scheduler.switchTab) scheduler.switchTab(id);
    else shell.active = id;
  }
</script>

{#each shell.tabs as tab (tab.id)}
  <button
    type="button"
    class={["tab-btn", { active: shell.active === tab.id }]}
    data-tab={tab.id}
    data-fkey={tab.fkey}
    onclick={() => select(tab.id)}
  >[{tab.fkey}] {tab.label}</button>
{/each}
