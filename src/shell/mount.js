import { mount } from "svelte";
import IntroSplash from "../lib/components/IntroSplash.svelte";
import ShellHeader from "../lib/components/ShellHeader.svelte";
import StatusBar from "../lib/components/StatusBar.svelte";
import TabNav from "../lib/components/TabNav.svelte";
import ConsoleFooter from "../lib/components/ConsoleFooter.svelte";
import { attachShell } from "../lib/shell/chrome.svelte.js";

const S = window.Scheduler || (window.Scheduler = {});
attachShell(S);

function place(id, component) {
  const target = document.getElementById(id);
  if (!target) {
    console.warn("shell: missing #" + id);
    return;
  }
  mount(component, { target });
}

place("blade-intro-root", IntroSplash);
place("blade-header-root", ShellHeader);
place("blade-status-root", StatusBar);
place("blade-tabs", TabNav);
place("blade-footer-root", ConsoleFooter);

if (typeof S.refreshConsoleChrome === "function") S.refreshConsoleChrome();
window.dispatchEvent(new CustomEvent("blade-shell-ready"));
