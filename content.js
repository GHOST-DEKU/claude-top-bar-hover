// Claude Top Bar on Hover
// Finds the top bar on claude.ai by its position and content (not by class
// names, which change often) and tags it. content.css does the hiding.

(() => {
  const ATTR = "data-top-bar-hover";
  const PROBE_Y = 24; // probe line, inside a normal 40-60px bar
  const MIN_H = 32;
  const MAX_H = 80;
  const MIN_WIDTH_RATIO = 0.4; // bar must span at least 40% of the window

  let current = null;
  let timer = 0;

  // A "top bar" = touches the top edge, bar-shaped, wide, and has a button/link.
  function looksLikeBar(el) {
    if (!(el instanceof HTMLElement)) return false;
    if (el === document.body || el === document.documentElement) return false;
    const r = el.getBoundingClientRect();
    return (
      r.top >= -2 &&
      r.top <= 2 &&
      r.height >= MIN_H &&
      r.height <= MAX_H &&
      r.width >= window.innerWidth * MIN_WIDTH_RATIO &&
      el.querySelector('button, a[href], [role="button"]') !== null
    );
  }

  // Look at several points along the top, walk up from what is there,
  // and keep the widest bar-shaped ancestor.
  function findBar() {
    const w = window.innerWidth;
    const xs = [w - 30, w - 120, w / 2, 120, 30];
    let best = null;
    let bestWidth = 0;
    for (const x of xs) {
      for (const hit of document.elementsFromPoint(x, PROBE_Y)) {
        for (let el = hit; el && el !== document.body; el = el.parentElement) {
          if (!looksLikeBar(el)) continue;
          const width = el.getBoundingClientRect().width;
          if (width > bestWidth) {
            best = el;
            bestWidth = width;
          }
        }
      }
    }
    return best;
  }

  function update() {
    timer = 0;
    if (current && current.isConnected && looksLikeBar(current)) return;
    const next = findBar();
    if (next === current) return;
    if (current) current.removeAttribute(ATTR);
    current = next;
    if (current) current.setAttribute(ATTR, "");
  }

  function schedule() {
    if (!timer) timer = window.setTimeout(update, 150);
  }

  update();
  // claude.ai is a single-page app: the bar can be replaced at any time.
  new MutationObserver(schedule).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  window.addEventListener("resize", schedule);
  window.addEventListener("popstate", schedule);
})();
