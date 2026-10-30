# Claude Top Bar on Hover

A small Chrome and Firefox extension that hides the top bar on [claude.ai](https://claude.ai)
(sidebar button, title, Chat, Share, and so on) and shows it only when you move your mouse to
the top of the page. You get the full window for your chat or artifact, and the bar is one
mouse move away.

## Features

- **Hover to show.** Move the mouse over the top strip and the bar fades in (fast). Move away and it
  fades out after a short pause, so a quick slip of the mouse does not make it flicker.
- **No empty strip.** On pages where the bar takes up space (for example an artifact opened from inside
  Claude), the page moves up to fill the window and the bar floats over it when shown.
- **Sidebar button included.** The collapsed-sidebar button hides and shows together with the bar.
- **Stays up when you need it.** The bar stays visible while one of its menus is open (for example the
  title menu) and while you move through it with the keyboard (Tab or the arrow keys).
- **Careful with the page.** Clicks still reach whatever is under the mouse. Focus that the page itself
  sets does not pin the bar open. Touch screens (no hover) are left alone. "Reduce motion" is respected.
- **Private.** No permissions, no data collected, no network requests. It only runs on `https://claude.ai/*`.

## Install

You need `bash` and `zip` to build. Then:

```bash
git clone https://github.com/GHOST-DEKU/claude-top-bar-hover.git
cd claude-top-bar-hover
./build.sh
```

This creates `dist/chrome` and `dist/firefox` (plus a `.zip` of each).

**Chrome, Edge, Brave:**
1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and choose the `dist/chrome` folder.

**Firefox:**
1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on** and choose `dist/firefox/manifest.json`.

Firefox removes temporary add-ons when it closes. A permanent install needs the add-on to be signed on
addons.mozilla.org.

**After an update:** run `./build.sh` again, click the reload icon on the extension in
`chrome://extensions`, and refresh the Claude tab. The old version stays active until you do.

## Troubleshooting

| What you see | What to try |
|---|---|
| The bar does not hide at all | Reload the extension, then refresh the Claude tab. Check the address starts with `https://claude.ai/`. |
| The bar flickers or stays visible | Turn on the debug log (below) and open an issue with the lines it prints. |
| An empty strip is left at the top | Open an issue with the page address and the output of the snippet below. |

**Debug log.** In the page console (F12, Console tab) run:

```js
localStorage.topBarHoverDebug = "1"
```

Reload the page. The extension then prints `[top-bar-hover]` lines each time it marks or unmarks the bar.
Turn it off with `localStorage.removeItem("topBarHoverDebug")`.

**Snippet for strip problems** (prints the elements at the top-left and top-middle of the page):

```js
const d=e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return `${e.tagName.toLowerCase()} class="${String(e.className).slice(0,50)}" pos=${c.position} bg=${c.backgroundColor} top=${r.top|0} h=${r.height|0} w=${r.width|0}${e.hasAttribute('data-top-bar-hover')?' [MARKED]':''}`};for(const x of [40,innerWidth/2]){console.log('--- x='+(x|0));let e=document.elementFromPoint(x,25),i=0;while(e&&i++<12){console.log(d(e));e=e.parentElement}}
```

## How it works

Two files do the work: `content.js` (finds the bar, watches the mouse) and `content.css` (hides and shows it).

**1. Finding the bar.** `content.js` marks the bar with `data-top-bar-hover`.
First choice is the `.dframe-header` element. If Claude renames that class, it falls back to the shape of
the bar: an element that touches the top edge of the window, is 32 to 80 px high, is at least 40% of the
window wide, and contains a button. Claude is a single-page app, so a `MutationObserver` and a
once-a-second check keep this up to date. A marked bar that looks wrong for a moment is kept for 1.5
seconds, because pages briefly change their header while loading.

**2. Hiding it.** The CSS sets `opacity: 0` on the marked bar and fades it in on hover. A newly marked bar
is hidden at once, with no fade, so it does not flash.

**3. Detecting hover.** The real header ignores the mouse except on its buttons
(`pointer-events: none`), so CSS `:hover` alone would only work over the invisible buttons. The script
watches the mouse and sets `data-top-bar-active` while the pointer is inside the bar's box. The
page gets no mouse events while the pointer is over an iframe (the artifact), so this is cleared when
the pointer enters an iframe or leaves the page.

**4. Keyboard.** The bar shows when focus moves into it right after a Tab or arrow key. It does not use
`:focus-visible`, because the page moves focus into its toolbar by script, which would pin the bar open.

**5. No empty strip.**
- A bar that sits in the normal page flow is marked `data-top-bar-float`. The CSS takes it out of the
  flow (`position: absolute` at the top), so the content moves up, and gives it a solid background
  copied from the page, so it is readable over the content.
- The app's collapsed-sidebar button (`.df-collapsed-chrome`) is outside the bar. It is hidden and shown
  together with the bar.
- Some pages place their content with an inline `--bar-h` on `<html>`. There the script sets
  `data-top-bar-collapse` and the CSS moves `<main>` to the top. `--bar-h` itself is left alone,
  because on those pages the bar's own height is `var(--bar-h)`. Setting it to 0 shrinks the bar to
  nothing and starts a flicker loop.

## Known limits

- Detection depends on how claude.ai builds its page today. A big layout change could stop the bar
  from being found. The constants at the top of `content.js` are easy to adjust.
- Tested in Chromium on mock pages copied from the real page structure, and by hand on the real artifact
  page (opened directly and from inside Claude). The Firefox build uses the same code but has not been run.
- A floating bar covers the top 44 px of the page while it is shown.

## License

MIT
