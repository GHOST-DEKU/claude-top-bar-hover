// Claude Top Bar on Hover
//
// 1. Finds the top bar(s) on claude.ai and tags them with data-top-bar-hover.
//    First choice: the `.dframe-header` element (seen on claude.ai).
//    Fallback: any wide, bar-shaped element touching the top edge that holds a button.
// 2. Watches the mouse. The real header has `pointer-events: none` (only its buttons
//    are clickable), so CSS :hover alone would not fire over empty parts of the bar.
//    Instead we tag the bar with data-top-bar-active while the mouse is inside its box.
// content.css does the hiding and showing.
//
// Debug: run localStorage.topBarHoverDebug = "1" in the page console, reload, and read
// the "[top-bar-hover]" lines in the console.

(() => {
  const ATTR = "data-top-bar-hover";
  const ACTIVE = "data-top-bar-active";
  const FOCUS = "data-top-bar-focus"; // keyboard focus inside the bar
  const COLLAPSE = "data-top-bar-collapse"; // set on <html>, see update()
  const KNOWN = ".dframe-header";
  const PROBE_Y = 24; // probe line, inside a normal 40-60px bar
  const MIN_H = 32;
  const MAX_H = 80;
  const MIN_WIDTH_RATIO = 0.4; // fallback: at least 40% of the window wide

  const GRACE_MS = 1500; // how long a tagged bar may look wrong before we untag it

  const tagged = new Set();
  const badSince = new Map(); // tagged element -> when it first stopped looking like a bar
  let timer = 0;

  let debug = false;
  try {
    debug = localStorage.getItem("topBarHoverDebug") === "1";
  } catch (_) {}
  const log = (...a) => debug && console.debug("[top-bar-hover]", Math.round(performance.now()), ...a);

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

  function tag(el) {
    // Hide at once: without this the newly tagged bar would first sit visible through
    // the fade-out delay, which looks like a flash.
    el.style.setProperty("transition", "none", "important");
    el.setAttribute(ATTR, "");
    void el.offsetWidth; // apply the hidden state now, with no transition
    el.style.removeProperty("transition");
    tagged.add(el);
    log("tag", el.tagName, el.className);
  }

  function untag(el) {
    el.removeAttribute(ATTR);
    el.removeAttribute(ACTIVE);
    el.removeAttribute(FOCUS);
    tagged.delete(el);
    log("untag", el.tagName, el.className);
  }

  function update() {
    timer = 0;

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

    // Some pages (artifact pages) place their content below the bar using an inline
    // `--bar-h` variable on <html>. Tell the CSS to zero it, so hiding the bar also
    // gives the space back instead of leaving an empty strip. Once on, it stays on
    // while a bar is tagged (the page may drop and re-set --bar-h; flipping the layout
    // back and forth would resize the whole page each time).
    const html = document.documentElement;
    const want = tagged.size > 0 && (html.hasAttribute(COLLAPSE) || html.style.getPropertyValue("--bar-h") !== "");
    if (want !== html.hasAttribute(COLLAPSE)) {
      html.toggleAttribute(COLLAPSE, want);
      log("collapse", want);
    }
  }

  function schedule() {
    if (!timer) timer = window.setTimeout(update, 50);
  }

  function setFlag(el, name, on) {
    if (on !== el.hasAttribute(name)) el.toggleAttribute(name, on);
  }
  const setActive = (el, on) => setFlag(el, ACTIVE, on);

  function onPointerMove(e) {
    if (!tagged.size) return;
    const inZone = e.clientY <= MAX_H; // cheap exit for the rest of the page
    for (const el of tagged) {
      let on = false;
      if (inZone) {
        const r = el.getBoundingClientRect();
        on =
          e.clientX >= r.left &&
          e.clientX <= r.right &&
          e.clientY >= r.top &&
          e.clientY <= r.bottom;
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

  update();
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  // Over an <iframe> (the artifact) the page gets no pointermove at all, so the last
  // "inside the bar" state would stay forever. Clear it when the pointer enters an
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
})();
