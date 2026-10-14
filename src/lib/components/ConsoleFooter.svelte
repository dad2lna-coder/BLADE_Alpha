<script>
  import { shell } from "../shell/chrome.svelte.js";
</script>

<footer class="console-footer">
  <span>SYSTEM STATUS: <b>READY</b></span>
  <span>LINES GENERATED: <b id="console-lines">{shell.lines}</b></span>
  <span id="console-nav-hint">{shell.navHint}</span>
</footer>
