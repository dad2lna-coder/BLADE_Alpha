<script>
  import { shell } from "../shell/chrome.svelte.js";

  const THEMES = [
    { id: "dark", label: "Dark" },
    { id: "presentation", label: "Presentation" }
  ];

  let open = $state(false);
  let themeLabel = $derived(shell.theme === "presentation" ? "Presentation" : "Dark");

  function toggle(event) {
    event.preventDefault();
    open = !open;
  }

  function choose(id) {
    const scheduler = globalThis.Scheduler;
    if (scheduler && scheduler.applyTheme) scheduler.applyTheme(id);
    else shell.theme = id;
    open = false;
  }

  function onKey(event) {
    if (event.key === "Escape" && open) {
      open = false;
      document.getElementById("btn-theme")?.focus();
    }
  }

  function onPointer(event) {
    if (!open) return;
    const target = event.target;
    if (target instanceof Element && target.closest(".theme-dropdown")) return;
    open = false;
  }
</script>

<svelte:window onkeydown={onKey} onclick={onPointer} />

<div class="theme-dropdown">
  <button
    type="button"
    class="btn"
    id="btn-theme"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls="theme-menu"
    aria-pressed={shell.theme === "presentation"}
    aria-label={"Theme: " + themeLabel}
    data-theme={shell.theme}
    onclick={toggle}
  >Theme</button>
  <div class="theme-dropdown-menu" id="theme-menu" role="listbox" hidden={!open}>
    {#each THEMES as item (item.id)}
      <button
        type="button"
        role="option"
        class={{ "is-active": shell.theme === item.id }}
        aria-selected={shell.theme === item.id}
        onclick={() => choose(item.id)}
      >{item.label}</button>
    {/each}
  </div>
</div>
