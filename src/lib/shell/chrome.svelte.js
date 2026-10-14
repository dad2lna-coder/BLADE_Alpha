function pad(n) {
  return n < 10 ? "0" + n : String(n);
}

/** Client shell fields. Classic Scheduler remains the source for edits and exports. */
export class ShellChrome {
  theme = $state("dark");
  tabs = $state.raw([]);
  active = $state("");
  status = $state("Loading…");
  airport = $state("—");
  operator = $state("OPERATOR");
  date = $state("--/--/----");
  time = $state("--:--:--");
  weeks = $state("1");
  staff = $state("—");
  lines = $state("0");
  navHint = $state("NAV: -");

  setTabs(tabs) {
    const list = Array.isArray(tabs) ? tabs : [];
    this.tabs = list;
    if (!this.active && list[0]) this.active = list[0].id;
    this.navHint = list.length
      ? "NAV: " + list[0].fkey + (list.length > 1 ? "-" + list[list.length - 1].fkey : "")
      : "NAV: -";
  }

  tick(now = new Date()) {
    this.time = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
    this.date = pad(now.getMonth() + 1) + "/" + pad(now.getDate()) + "/" + now.getFullYear();
  }
}

export const shell = new ShellChrome();

export function attachShell(scheduler) {
  const S = scheduler || globalThis.Scheduler;
  if (!S) return shell;
  S.shell = shell;
  S.shellOwnsChrome = true;

  if (typeof S.getTheme === "function") shell.theme = S.getTheme();

  const origApply = S.applyTheme;
  if (typeof origApply === "function" && !origApply._shellWrapped) {
    S.applyTheme = function (name) {
      const theme = origApply.apply(this, arguments);
      shell.theme = theme || (S.getTheme ? S.getTheme() : shell.theme);
      return theme;
    };
    S.applyTheme._shellWrapped = true;
  }

  const origStatus = S.updateStatus;
  if (typeof origStatus === "function" && !origStatus._shellWrapped) {
    S.updateStatus = function (msg) {
      shell.status = String(msg ?? "");
      return origStatus.apply(this, arguments);
    };
    S.updateStatus._shellWrapped = true;
  }

  const origSwitch = S.switchTab;
  if (typeof origSwitch === "function" && !origSwitch._shellWrapped) {
    S.switchTab = function (name) {
      shell.active = name;
      return origSwitch.apply(this, arguments);
    };
    S.switchTab._shellWrapped = true;
  }

  return shell;
}
