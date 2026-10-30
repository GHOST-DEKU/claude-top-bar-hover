# Claude Top Bar on Hover

A small Chrome and Firefox extension. It hides the top bar on [claude.ai](https://claude.ai)
(the one with the sidebar button, the title, Chat and Share) and shows it only when you
move your mouse over it.

- Smooth fade in (fast) and fade out (after a short pause, so it doesn't flicker).
- Stays visible while one of its menus is open, or while you move through it with the keyboard.
- Does nothing on touch screens (they have no hover).
- Respects "reduce motion" settings.
- No permissions, no data collected, no network requests.

## Install

Build first (needs `bash` and `zip`):

```bash
./build.sh
```

This creates `dist/chrome` and `dist/firefox` (plus a `.zip` for each).

**Chrome / Edge / Brave:** open `chrome://extensions`, turn on *Developer mode*,
click *Load unpacked*, pick `dist/chrome`.

**Firefox:** open `about:debugging#/runtime/this-firefox`, click *Load Temporary Add-on*,
pick `dist/firefox/manifest.json`. (Temporary add-ons are removed when Firefox closes.
For a permanent install the add-on must be signed on addons.mozilla.org.)

## How it works

The top bar's class names on claude.ai are not stable, so the extension does not rely on them.
`content.js` looks at the top of the page and picks the element that:

1. touches the top edge of the window,
2. is bar-shaped (32 to 80 px high, at least 40% of the window wide),
3. contains a button or link.

It marks that element with `data-top-bar-hover`. `content.css` then hides it with `opacity: 0`
and shows it on `:hover`. The bar keeps its space in the layout, so nothing on the page jumps.

A `MutationObserver` re-checks when the page changes, because claude.ai is a single-page app.

## Known limits

- Detection is by shape, not by exact selector. If Claude changes its layout a lot,
  it may pick the wrong element or none. Adjust the numbers at the top of `content.js`.
- The empty strip where the bar was stays blank (the page layout is not changed on purpose).

## License

MIT
