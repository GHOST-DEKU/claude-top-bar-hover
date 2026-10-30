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

`content.js` finds the bar and marks it with `data-top-bar-hover`:

1. First choice: the `.dframe-header` element (the header seen on claude.ai).
2. Fallback, if that class is ever renamed: any element that touches the top edge of the
   window, is bar-shaped (32 to 80 px high, at least 40% of the window wide) and contains a button.

`content.css` hides the marked element with `opacity: 0`. The bar is not removed or moved.

On pages that reserve room for the bar with an inline `--bar-h` variable on `<html>`
(artifact pages), the script sets `data-top-bar-collapse` on `<html>` and the CSS zeroes
`--bar-h`. The content then moves up to use the full height, and the bar floats over it
(with the page background) when shown. On other pages the bar keeps its place in the layout.

The real header ignores the mouse except on its buttons (`pointer-events: none`), so CSS `:hover`
alone would only fire over the invisible buttons. The script therefore watches the mouse and sets
`data-top-bar-active` while the pointer is inside the bar's box. Clicks still go to whatever
is under the pointer, as before.

A `MutationObserver` re-checks when the page changes, because claude.ai is a single-page app.

## Known limits

- The behavior was tested on a mock page copied from the real header's structure, not on
  every claude.ai page. If Claude changes its layout a lot, the bar may not be found.
  Adjust the constants at the top of `content.js`.

## License

MIT
