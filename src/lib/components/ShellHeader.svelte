<script>
  import ThemeSwitcher from "./ThemeSwitcher.svelte";
  import { shell } from "../shell/chrome.svelte.js";
</script>

<header class="topbar">
  <div class="console-mast">
    <div class="brand">
      <img class="pres-dal" src="assets/dal-mark.png" alt="Dallas Love Field" />
      <div class="brand-copy">
        <div class="brand-title">Blade Airport Ops <span class="brand-ver">v2</span></div>
        <div class="brand-sub">Workforce Allocation System</div>
      </div>
    </div>
    <div class="topbar-actions">
      <button class="btn" id="btn-instructions" type="button">Help</button>
      <ThemeSwitcher />
    </div>
  </div>
  <div class="console-meta-strip">
    <div class="console-meta">Airport: <b id="console-airport">{shell.airport}</b></div>
    <div class="console-meta">Operator: <b id="console-operator">{shell.operator}</b></div>
    <div class="console-meta">Date: <b id="console-date">{shell.date}</b></div>
    <div class="console-meta">System time: <b id="console-time">{shell.time}</b></div>
    <div class="console-meta">Schedule weeks: <b id="console-weeks">{shell.weeks}</b></div>
    <div class="console-meta">Staff total: <b id="console-staff">{shell.staff}</b></div>
    <div class="console-status-chip">STATUS: READY</div>
  </div>
</header>
