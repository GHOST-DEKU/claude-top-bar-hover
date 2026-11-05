// Claude Top Bar on Hover
//
// 1. Finds the top bar(s) on claude.ai and tags them with data-top-bar-hover.
//    First choice: the `.dframe-header` element (seen on claude.ai).
//    Fallback: any wide, bar-shaped element touching the top edge that holds a button.
// 2. Watches the mouse. The real header has `pointer-events: none` (only its buttons
//    are clickable), so CSS :hover alone would not fire over empty parts of the bar.
//    Instead we tag the bar with data-top-bar-active while the mouse is in the reveal zone.
// 3. Reads the settings saved by the popup (storage.local) and answers the popup's messages
//    (state, peek timer, shortcut toggle).
// content.css does the hiding and showing.
//
// Debug: run localStorage.topBarHoverDebug = "1" in the page console, reload, and read
// the "[top-bar-hover]" lines in the console.

(() => {
  const api = typeof browser !== "undefined" ? browser : chrome;

  const ATTR = "data-top-bar-hover";
  const ACTIVE = "data-top-bar-active";
  const FOCUS = "data-top-bar-focus"; // keyboard focus inside the bar
  const PIN = "data-top-bar-pin"; // peek timer or shortcut keeps the bar shown
  const FLOAT = "data-top-bar-float"; // bar was in the page flow: float it over the content
  const COLLAPSE = "data-top-bar-collapse"; // set on <html>, see syncCollapse()
  const ANIM = "data-tbh-anim"; // set on <html>: fade | slide | blur | line
  const KNOWN = ".dframe-header";
  const PROBE_Y = 24; // probe line, inside a normal 40-60px bar
  const MIN_H = 32;
  const MAX_H = 80;
  const MIN_WIDTH_RATIO = 0.4; // fallback: at least 40% of the window wide
  const CORNER_RATIO = 0.3; // left/right corner zones: 30% of the window width

  const GRACE_MS = 1500; // how long a tagged bar may look wrong before we untag it

  // Keep in sync with DEFAULTS in popup.js.
  const DEFAULTS = {
    on: true,
    mode: "auto", // auto | always | hidden (hidden = only the shortcut, a peek or the keyboard shows it)
    where: "top", // top | left | right
    zone: 48, // px from the top edge
    showDelay: 0, // ms
    hideDelay: 350, // ms
    anim: "fade",
    speed: 240, // ms
    sites: { chat: true, artifact: true, projects: true },
  };
  const cfg = { ...DEFAULTS, sites: { ...DEFAULTS.sites } };
  let started = false;

  const tagged = new Set();
  const badSince = new Map(); // tagged element -> when it first stopped looking like a bar
  const showTimers = new Map(); // tagged element -> pending "show after delay" timer
  let timer = 0;

  let debug = false;
  try {
    debug = localStorage.getItem("topBarHoverDebug") === "1";
  } catch (_) {}
  const log = (...a) => debug && console.debug("[top-bar-hover]", Math.round(performance.now()), ...a);

  // ---------- settings ----------

  function pageType() {
    const p = location.pathname;
    if (p.startsWith("/artifact")) return "artifact";
    if (p.startsWith("/project")) return "projects";
    return "chat";
  }
  // The bar is only managed (hidden) when the extension is on, this kind of page is ticked,
  // and the mode is not "always show".
  const enabled = () => cfg.on && cfg.sites[pageType()] !== false && cfg.mode !== "always";

  function setVar(name, value) {
    const s = document.documentElement.style;
    if (s.getPropertyValue(name) !== value) s.setProperty(name, value);
  }
  function applyVars() {
    setVar("--tbh-dur", cfg.speed + "ms");
    setVar("--tbh-hide", cfg.hideDelay + "ms");
    const html = document.documentElement;
    if (html.getAttribute(ANIM) !== cfg.anim) html.setAttribute(ANIM, cfg.anim);
  }

  function mergeSettings(s) {
    for (const k of Object.keys(DEFAULTS)) {
      if (k === "sites") cfg.sites = { ...DEFAULTS.sites, ...(s.sites || {}) };
      else if (s[k] !== undefined) cfg[k] = s[k];
    }
  }

  // ---------- finding the bar ----------

  // Touches the top edge and is bar-shaped.
  function hasBarGeometry(el, minWidth) {
    const r = el.getBoundingClientRect();
    return (
      r.top >= -2 &&
      r.top <= 2 &&
      r.height >= MIN_H &&
      r.height <= MAX_H &&
      r.width >= Math.max(minWidth, 1)
    );
  }

  // A new candidate must also hold a button/link. (An element we already tag is not
  // re-checked for that: pages briefly empty their header while re-rendering.)
  function isBarShaped(el, minWidth) {
    if (!(el instanceof HTMLElement)) return false;
    if (el === document.body || el === document.documentElement) return false;
    return (
      hasBarGeometry(el, minWidth) &&
      el.querySelector('button, a[href], [role="button"]') !== null
    );
  }

  // Fallback: look at several points along the top, walk up from what is there,
  // and keep the outermost, widest bar-shaped ancestor.
  function findByShape() {
    const w = window.innerWidth;
    const minWidth = w * MIN_WIDTH_RATIO;
    const xs = [w - 30, w - 120, w / 2, 120, 30];
    let best = null;
    let bestWidth = 0;
    for (const x of xs) {
      for (const hit of document.elementsFromPoint(x, PROBE_Y)) {
        for (let el = hit; el && el !== document.body; el = el.parentElement) {
          if (!isBarShaped(el, minWidth)) continue;
          const width = el.getBoundingClientRect().width;
          if (width >= bestWidth) {
            best = el;
            bestWidth = width;
          }
        }
      }
    }
    return best;
  }

  // A bar that sits in the normal page flow keeps its space when hidden, leaving an empty
  // strip. Float such a bar over the content instead (content.css, [data-top-bar-float]).
  // Bars that are already absolute or fixed take no space and are left alone.
  function shouldFloat(el) {
    const pos = getComputedStyle(el).position;
    return pos === "static" || pos === "relative" || pos === "sticky";
  }

  // A floating bar needs a solid background to be readable over the content: its own,
  // or else the nearest one behind it. Re-run now and then in case the theme changes.
  function syncBg(el) {
    if (!el.hasAttribute(FLOAT)) return;
    let color = "";
    for (let e = el; e && !color; e = e.parentElement) {
      const c = getComputedStyle(e).backgroundColor;
      if (c !== "rgba(0, 0, 0, 0)" && c !== "transparent") color = c;
    }
    if (color && el.style.getPropertyValue("--top-bar-hover-bg") !== color) {
      el.style.setProperty("--top-bar-hover-bg", color);
    }
  }

  function tag(el) {
    const float = shouldFloat(el); // read before we change anything
    // Hide at once: without this the newly tagged bar would first sit visible through
    // the fade-out delay, which looks like a flash.
    el.style.setProperty("transition", "none", "important");
    if (float) el.setAttribute(FLOAT, "");
    syncBg(el);
    if (pinned()) el.setAttribute(PIN, "");
    el.setAttribute(ATTR, "");
    void el.offsetWidth; // apply the hidden state now, with no transition
    el.style.removeProperty("transition");
    tagged.add(el);
    log("tag", el.tagName, el.className);
  }

  function untag(el) {
    clearTimeout(showTimers.get(el));
    showTimers.delete(el);
    el.removeAttribute(ATTR);
    el.removeAttribute(ACTIVE);
    el.removeAttribute(FOCUS);
    el.removeAttribute(PIN);
    el.removeAttribute(FLOAT);
    el.style.removeProperty("--top-bar-hover-bg");
    tagged.delete(el);
    log("untag", el.tagName, el.className);
  }

  // Some pages (artifact pages) place their content below the bar using an inline
  // `--bar-h` variable on <html>. Tell the CSS to move the content to the top, so hiding
  // the bar also gives the space back instead of leaving an empty strip. Once on, it
  // stays on while a bar is tagged (the page may drop and re-set --bar-h; flipping the
  // layout back and forth would resize the whole page each time).
  function syncCollapse() {
    const html = document.documentElement;
    const want =
      tagged.size > 0 &&
      (html.hasAttribute(COLLAPSE) || html.style.getPropertyValue("--bar-h") !== "");
    if (want !== html.hasAttribute(COLLAPSE)) {
      html.toggleAttribute(COLLAPSE, want);
      log("collapse", want);
    }
  }

  function update() {
    timer = 0;
    applyVars();

    // Extension off here (switch, page rule or "always show"): leave the page alone.
    if (!enabled()) {
      for (const el of [...tagged]) untag(el);
      syncCollapse();
      return;
    }

    // Keep what we already tag while it is still in the page and still bar-shaped.
    // A bad shape must last a while before we give up (pages animate their header).
    const now = performance.now();
    for (const el of [...tagged]) {
      if (!el.isConnected) {
        untag(el);
      } else if (hasBarGeometry(el, 0)) {
        badSince.delete(el);
      } else {
        if (!badSince.has(el)) badSince.set(el, now);
        if (now - badSince.get(el) > GRACE_MS) {
          badSince.delete(el);
          untag(el);
        }
      }
    }
    for (const el of document.querySelectorAll(KNOWN)) {
      if (!tagged.has(el) && isBarShaped(el, 0)) tag(el);
    }
    if (!tagged.size) {
      const found = findByShape();
      if (found) tag(found);
    }
    for (const el of tagged) syncBg(el);
    syncCollapse();
  }

  function schedule() {
    if (!timer) timer = window.setTimeout(update, 50);
  }

  // ---------- showing the bar ----------

  function setFlag(el, name, on) {
    if (on !== el.hasAttribute(name)) el.toggleAttribute(name, on);
  }

  // "Active" = the mouse is in the reveal zone. Showing can wait (showDelay); hiding is
  // delayed by the CSS (--tbh-hide), so it needs no timer here.
  function setActive(el, on) {
    if (on) {
      if (el.hasAttribute(ACTIVE) || showTimers.has(el)) return;
      if (!cfg.showDelay) return setFlag(el, ACTIVE, true);
      showTimers.set(
        el,
        setTimeout(() => {
          showTimers.delete(el);
          setFlag(el, ACTIVE, true);
        }, cfg.showDelay)
      );
    } else {
      clearTimeout(showTimers.get(el));
      showTimers.delete(el);
      setFlag(el, ACTIVE, false);
    }
  }

  function inZone(x, y) {
    if (y > cfg.zone) return false;
    if (cfg.where === "left") return x <= window.innerWidth * CORNER_RATIO;
    if (cfg.where === "right") return x >= window.innerWidth * (1 - CORNER_RATIO);
    return true;
  }

  function onPointerMove(e) {
    if (!tagged.size) return;
    const hover = cfg.mode === "auto"; // "hidden" mode: the mouse never shows the bar
    const near = e.clientY <= Math.max(MAX_H, cfg.zone); // cheap exit for the rest of the page
    for (const el of tagged) {
      let on = false;
      if (hover && near) {
        // Start in the zone; once shown, stay while the mouse is over the bar itself.
        const r = el.getBoundingClientRect();
        const inBar =
          e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        on = inZone(e.clientX, e.clientY) || (inBar && el.hasAttribute(ACTIVE));
      }
      setActive(el, on);
    }
  }

  function clearActive() {
    for (const el of tagged) setActive(el, false);
  }

  // Keyboard focus shows the bar. We do not use CSS :focus-visible for this: the page
  // moves focus into its toolbar by script (roving tabindex), and a script focus with
  // no mouse use also counts as :focus-visible, which would pin the bar open.
  // So: only count a focus that follows a Tab/arrow key press.
  let lastKeyNav = -Infinity; // not 0: that would count the first second after load as a key press

  // ---------- peek timer and shortcut ----------

  let pinUntil = 0;
  let pinTotal = 0;
  let toggled = false;
  let pinTimer = 0;
  let badgeTimer = 0;
  const pinned = () => toggled || pinUntil > Date.now();

  function sendBadge() {
    const left = pinUntil - Date.now();
    let text = "";
    if (left > 0) {
      const s = Math.ceil(left / 1000);
      text = s >= 60 ? Math.ceil(s / 60) + "m" : s + "s";
    }
    // The background script puts it on the toolbar icon. Ignore "no receiver" errors.
    try {
      const p = api.runtime.sendMessage({ type: "badge", text });
      if (p && p.catch) p.catch(() => {});
    } catch (_) {}
    if (left <= 0) {
      clearInterval(badgeTimer);
      badgeTimer = 0;
    }
  }

  function syncPin() {
    for (const el of tagged) setFlag(el, PIN, pinned());
    clearTimeout(pinTimer);
    if (pinUntil > Date.now()) pinTimer = setTimeout(syncPin, pinUntil - Date.now() + 20);
    if (pinUntil > Date.now() && !badgeTimer) badgeTimer = setInterval(sendBadge, 1000);
    sendBadge();
  }

  function onMessage(msg, _sender, sendResponse) {
    if (!msg || typeof msg.type !== "string") return;
    if (msg.type === "peek") {
      pinTotal = Math.max(0, Math.min(Number(msg.ms) || 0, 3600e3));
      pinUntil = Date.now() + pinTotal;
      toggled = false;
      syncPin();
    } else if (msg.type === "peekStop") {
      pinUntil = 0;
      toggled = false;
      clearActive();
      syncPin();
    } else if (msg.type === "toggle") {
      // Shortcut: show the bar; press again to hide it (also ends a running peek).
      if (pinned()) {
        toggled = false;
        pinUntil = 0;
        clearActive();
      } else {
        toggled = true;
      }
      syncPin();
    } else if (msg.type !== "state") {
      return;
    }
    const first = [...tagged][0];
    sendResponse({
      pageType: pageType(),
      enabled: enabled(),
      hasBar: tagged.size > 0,
      barH: first ? Math.round(first.getBoundingClientRect().height) : 0,
      winH: window.innerHeight,
      pinned: pinned(),
      toggled,
      pinUntil,
      pinTotal,
    });
  }

  // ---------- start ----------

  function start() {
    if (started) return;
    started = true;
    update();

    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Tab" || e.key.startsWith("Arrow")) lastKeyNav = performance.now();
      },
      true
    );
    document.addEventListener(
      "focusin",
      (e) => {
        const byKeyboard = performance.now() - lastKeyNav < 1000;
        for (const el of tagged) setFlag(el, FOCUS, byKeyboard && el.contains(e.target));
      },
      true
    );
    document.addEventListener(
      "focusout",
      (e) => {
        if (!e.relatedTarget) for (const el of tagged) setFlag(el, FOCUS, false);
      },
      true
    );

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    // Over an <iframe> (the artifact) the page gets no pointermove at all, so the last
    // "in the zone" state would stay forever. Clear it when the pointer enters an
    // iframe or leaves the page.
    document.addEventListener(
      "pointerover",
      (e) => e.target.tagName === "IFRAME" && clearActive(),
      { passive: true }
    );
    document.addEventListener("pointerout", (e) => !e.relatedTarget && clearActive(), {
      passive: true,
    });
    document.documentElement.addEventListener("mouseleave", clearActive);
    window.addEventListener("blur", clearActive);
    // claude.ai is a single-page app: the bar can be replaced at any time.
    new MutationObserver(schedule).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
    // The page may set --bar-h on <html> after we first look.
    new MutationObserver(schedule).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });
    // Safety net: a bar can appear or settle (CSS animation) with no DOM change to wake
    // the observer above, which left it visible for good.
    window.setInterval(update, 1000);
    window.addEventListener("resize", schedule);
    window.addEventListener("popstate", schedule);
  }

  api.runtime.onMessage.addListener(onMessage);
  api.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !started) return;
    const next = {};
    for (const k of Object.keys(DEFAULTS)) {
      next[k] = k in changes ? changes[k].newValue : k === "sites" ? cfg.sites : cfg[k];
    }
    mergeSettings(next);
    update();
  });

  // Wait for the saved settings before the first look, so a bar that the user switched
  // off never flashes hidden.
  api.storage.local.get(DEFAULTS).then(
    (saved) => {
      mergeSettings(saved);
      start();
    },
    () => start()
  );
})();
