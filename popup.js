// The popup: four tabs (Home, Reveal, Style, Pages). It saves settings to storage.local
// (content.js reads them) and talks to the content script of the active tab for live info
// (is a bar there, peek timer, window height).

(() => {
  const api = typeof browser !== "undefined" ? browser : chrome;
  const $ = (s) => document.querySelector(s);

  // Keep in sync with DEFAULTS in content.js.
  const DEFAULTS = {
    on: true,
    mode: "auto",
    where: "top",
    zone: 48,
    showDelay: 0,
    hideDelay: 350,
    anim: "fade",
    speed: 240,
    sites: { chat: true, artifact: true, projects: true },
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let S = clone(DEFAULTS);
  let view = "home";
  let st = null; // live state from the content script, or null (not on claude.ai)
  let shortcut = ""; // e.g. "Alt+B"

  const app = $("#app");

  // ---------- talking to the page ----------

  const forcedTab = new URLSearchParams(location.search).get("tab"); // for testing the popup in a normal tab
  async function ask(msg) {
    try {
      let id = forcedTab ? Number(forcedTab) : null;
      if (id == null) {
        const [t] = await api.tabs.query({ active: true, currentWindow: true });
        id = t ? t.id : null;
      }
      if (id == null) return null;
      return (await api.tabs.sendMessage(id, msg)) || null;
    } catch (_) {
      return null; // not a claude.ai tab: no content script there
    }
  }

  function save(patch) {
    Object.assign(S, patch);
    api.storage.local.set(patch);
  }

  // ---------- pieces ----------

  const logo =
    '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="3" width="14" height="14" rx="3"/><path d="M3 7.5h14"/></svg>';
  const head = () =>
    `<div class="ph"><span class="logo">${logo}</span><div><b>Top Bar on Hover</b><small>claude.ai</small></div><span class="pill" id="pill"></span></div>`;
  const sw = (key, label, sub, on, extra = "") =>
    `<div class="row"><div><b>${label}${extra}</b>${sub ? `<small>${sub}</small>` : ""}</div><button class="sw" type="button" role="switch" aria-checked="${on}" aria-label="${label}" data-act="sw" data-key="${key}"></button></div>`;
  const seg = (act, cur, opts) =>
    `<div class="seg" role="group">${opts.map(([v, l]) => `<button type="button" aria-pressed="${cur === v}" data-act="${act}" data-v="${v}">${l}</button>`).join("")}</div>`;
  const rng = (key, label, min, max, step, unit) =>
    `<div class="rng"><div class="row"><label for="r-${key}">${label}</label><output data-out="${key}">${S[key]}${unit}</output></div><input id="r-${key}" type="range" min="${min}" max="${max}" step="${step}" value="${S[key]}" data-range="${key}" data-unit="${unit}"></div>`;
  const here = (k) => (st && st.pageType === k ? '<span class="here">this tab</span>' : "");
  const tile = (v, l, a) =>
    `<button class="tile" type="button" aria-pressed="${S.anim === v}" data-act="anim" data-v="${v}"><span class="demo"><i style="--a:${a}"></i></span><b>${l}</b></button>`;

  const panes = {
    home: () => `<div><p class="lab">Mode</p>${seg("mode", S.mode, [["auto", "Auto-hide"], ["always", "Always show"], ["hidden", "Shortcut"]])}</div>
      <div><p class="lab">Show it for a while</p><div class="peek"><div class="ring"><svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="66" fill="none" stroke="var(--line)" stroke-width="10"/><circle id="arc" cx="75" cy="75" r="66" fill="none" stroke="var(--accent)" stroke-width="10" stroke-linecap="round" stroke-dasharray="414.7" stroke-dashoffset="414.7"/></svg><div class="t" id="tt">Off</div></div>
        <div class="btns"><button class="btn" type="button" data-act="peek" data-sec="10">10 s</button><button class="btn" type="button" data-act="peek" data-sec="60">1 min</button><button class="btn" type="button" data-act="peek" data-sec="300">5 min</button><button class="btn p" type="button" data-act="peekstop">Hide now</button></div></div></div>
      <div><p class="lab">Room gained</p><div class="gain"><div class="big" id="gainPct"></div><p class="note" id="gainTxt"></p></div></div>`,
    reveal: () => `<div><p class="lab">Where the mouse goes</p>${seg("where", S.where, [["top", "Whole top"], ["left", "Left corner"], ["right", "Right corner"]])}</div>
      ${rng("zone", "Zone height", 12, 110, 2, " px")}${rng("showDelay", "Wait before showing", 0, 800, 50, " ms")}${rng("hideDelay", "Wait before hiding", 0, 1500, 50, " ms")}
      <p class="note">Once the bar is shown, it stays while the mouse is on it.</p>`,
    style: () => `<div><p class="lab">How it appears</p><div class="tiles">${tile("fade", "Fade", "fd")}${tile("slide", "Slide up", "sl")}${tile("blur", "Soft blur", "bl")}${tile("line", "Glow line", "lnb")}</div></div>
      ${rng("speed", "Speed", 60, 700, 20, " ms")}<p class="note">With "Reduce motion" on in your system, there is no animation.</p>`,
    pages: () => `<div><p class="lab">Where it hides</p><div class="list">${sw("s:chat", "Chats", "", S.sites.chat, here("chat"))}${sw("s:artifact", "Artifacts", "", S.sites.artifact, here("artifact"))}${sw("s:projects", "Projects", "", S.sites.projects, here("projects"))}</div></div>
      <div class="foot"><span>${
        shortcut
          ? shortcut.split("+").map((k) => `<kbd>${k}</kbd>`).join(" + ") + " shows or hides it"
          : "No shortcut set. Set one in your browser's extension shortcuts."
      }</span><button class="link" type="button" data-act="reset">Reset all</button></div>`,
  };

  function render() {
    const tabs = [["home", "Home"], ["reveal", "Reveal"], ["style", "Style"], ["pages", "Pages"]];
    app.innerHTML =
      head() +
      `<div class="pb">${sw("on", "Hide the top bar", "Show it when I move to the top", S.on)}
      <div class="seg" role="tablist" style="grid-template-columns:repeat(4,1fr)">${tabs.map(([k, l]) => `<button type="button" role="tab" aria-selected="${view === k}" aria-pressed="${view === k}" data-act="tab" data-v="${k}">${l}</button>`).join("")}</div>
      ${panes[view]()}</div>`;
    updateLive();
  }

  // ---------- live values (updated without re-rendering, so sliders keep working) ----------

  function updateLive() {
    const pill = $("#pill");
    if (pill) {
      const t = !st ? "Not on claude.ai" : !st.enabled ? "Off here" : !st.hasBar ? "No bar here" : st.pinned ? "Showing" : "Hidden";
      pill.textContent = t;
      pill.dataset.s = t;
    }
    const canPeek = !!(st && st.enabled && st.hasBar);
    document.querySelectorAll('[data-act="peek"],[data-act="peekstop"]').forEach((b) => (b.disabled = !canPeek));

    const arc = $("#arc");
    if (arc) {
      const left = st ? st.pinUntil - Date.now() : 0;
      const tt = $("#tt");
      if (left > 0 && st.pinTotal > 0) {
        arc.style.strokeDashoffset = 414.7 * (1 - left / st.pinTotal);
        const s = Math.ceil(left / 1000);
        tt.textContent = s >= 60 ? Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0") : s + " s";
      } else {
        arc.style.strokeDashoffset = 414.7;
        tt.textContent = st && st.toggled ? "On" : "Off";
      }
    }

    const g = $("#gainPct");
    if (g) {
      let pct = "", txt = "";
      if (!st) {
        pct = "–";
        txt = "Open a claude.ai tab to see your numbers.";
      } else if (!st.enabled || !st.hasBar) {
        pct = "0.0";
        txt = st.enabled ? "No top bar found on this page." : "The bar is not hidden here, so nothing is gained.";
      } else {
        pct = ((st.barH / st.winH) * 100).toFixed(1);
        txt = `more page: ${st.barH} px of ${st.winH} px are back for your content.`;
      }
      g.innerHTML = pct + (pct === "–" ? "" : "<span> %</span>");
      $("#gainTxt").textContent = txt;
    }
  }

  let polling = false;
  async function poll() {
    if (polling) return;
    polling = true;
    st = await ask({ type: "state" });
    polling = false;
    updateLive();
  }

  // ---------- events ----------

  app.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-act]");
    if (!b || b.disabled) return;
    const a = b.dataset.act, v = b.dataset.v;
    if (a === "sw") {
      const k = b.dataset.key;
      if (k === "on") save({ on: !S.on });
      else save({ sites: { ...S.sites, [k.slice(2)]: !S.sites[k.slice(2)] } });
    } else if (a === "tab") view = v;
    else if (a === "mode") save({ mode: v });
    else if (a === "where") save({ where: v });
    else if (a === "anim") {
      save({ anim: v });
      ask({ type: "peek", ms: 1400 }); // show the bar briefly so the new style is seen on the page
    } else if (a === "peek") st = (await ask({ type: "peek", ms: Number(b.dataset.sec) * 1000 })) || st;
    else if (a === "peekstop") st = (await ask({ type: "peekStop" })) || st;
    else if (a === "reset") {
      S = clone(DEFAULTS);
      await api.storage.local.set(clone(DEFAULTS));
    }
    render();
    if (a === "sw" || a === "mode" || a === "reset") setTimeout(poll, 150); // let the page react first
  });

  app.addEventListener("input", (e) => {
    const r = e.target.closest("[data-range]");
    if (!r) return;
    save({ [r.dataset.range]: Number(r.value) });
    app.querySelector(`[data-out="${r.dataset.range}"]`).textContent = r.value + r.dataset.unit;
  });
  // Letting go of the speed slider shows the bar briefly, so you see the new speed.
  app.addEventListener("change", (e) => {
    if (e.target.closest('[data-range="speed"]')) ask({ type: "peek", ms: 1400 });
  });

  // ---------- start ----------

  (async () => {
    const saved = await api.storage.local.get(DEFAULTS);
    S = { ...clone(DEFAULTS), ...saved, sites: { ...DEFAULTS.sites, ...(saved.sites || {}) } };
    try {
      const cmds = await api.commands.getAll();
      const c = cmds.find((x) => x.name === "toggle-bar");
      shortcut = c && c.shortcut ? c.shortcut : "";
    } catch (_) {}
    st = await ask({ type: "state" });
    render();
    setInterval(poll, 400);
  })();
})();
