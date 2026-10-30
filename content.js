// Claude Top Bar on Hover
//
// 1. Finds the top bar(s) on claude.ai and tags them with data-top-bar-hover.
//    First choice: the `.dframe-header` element (seen on claude.ai).
//    Fallback: any wide, bar-shaped element touching the top edge that holds a button.
// 2. Watches the mouse. The real header has `pointer-events: none` (only its buttons
//    are clickable), so CSS :hover alone would not fire over empty parts of the bar.
//    Instead we tag the bar with data-top-bar-active while the mouse is inside its box.
// content.css does the hiding and showing.

(() => {
  const ATTR = "data-top-bar-hover";
  const ACTIVE = "data-top-bar-active";
  const COLLAPSE = "data-top-bar-collapse"; // set on <html>, see update()
  const KNOWN = ".dframe-header";
  const PROBE_Y = 24; // probe line, inside a normal 40-60px bar
  const MIN_H = 32;
  const MAX_H = 80;
  const MIN_WIDTH_RATIO = 0.4; // fallback: at least 40% of the window wide

  const tagged = new Set();
  let timer = 0;

  // Touches the top edge, bar-shaped, at least `minWidth` wide, holds a button/link.
  function isBarShaped(el, minWidth) {
    if (!(el instanceof HTMLElement)) return false;
    if (el === document.body || el === document.documentElement) return false;
    const r = el.getBoundingClientRect();
    return (
      r.top >= -2 &&
      r.top <= 2 &&
      r.height >= MIN_H &&
      r.height <= MAX_H &&
      r.width >= Math.max(minWidth, 1) &&
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
    return best ? [best] : [];
  }

  function findBars() {
    const known = [...document.querySelectorAll(KNOWN)].filter((el) =>
      isBarShaped(el, 0)
    );
    return known.length ? known : findByShape();
  }

  function update() {
    timer = 0;
    const next = new Set(findBars());
    for (const el of tagged) {
      if (next.has(el)) continue;
      el.removeAttribute(ATTR);
      el.removeAttribute(ACTIVE);
      tagged.delete(el);
    }
    for (const el of next) {
      if (tagged.has(el)) continue;
      el.setAttribute(ATTR, "");
      tagged.add(el);
    }
    // Some pages (artifact pages) place their content below the bar using an inline
    // `--bar-h` variable on <html>. Tell the CSS to zero it, so hiding the bar also
    // gives the space back instead of leaving an empty strip.
    const html = document.documentElement;
    html.toggleAttribute(
      COLLAPSE,
      tagged.size > 0 && html.style.getPropertyValue("--bar-h") !== ""
    );
  }

  function schedule() {
    if (!timer) timer = window.setTimeout(update, 150);
  }

  function setActive(el, on) {
    if (on !== el.hasAttribute(ACTIVE)) el.toggleAttribute(ACTIVE, on);
  }

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

  update();
  document.addEventListener("pointermove", onPointerMove, { passive: true });
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
  window.addEventListener("resize", schedule);
  window.addEventListener("popstate", schedule);
})();
