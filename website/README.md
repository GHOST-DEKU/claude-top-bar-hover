# Website

The project site for Claude Top Bar on Hover. SvelteKit (static), Tailwind CSS, no tracking.

```bash
cd website
npm ci
npm run dev            # http://localhost:5173
BASE_PATH=/claude-top-bar-hover npm run build   # what GitHub Actions runs
```

- Colours and shapes copy the extension popup (`src/routes/layout.css`). Dark is the default.
- The version number comes from `../manifest.json`.
- The changelog page is read from GitHub releases while building. If GitHub cannot be reached it shows a link instead.
- `static/screenshots/` are real renders of `popup.html` (with sample numbers).
- Deploys with `.github/workflows/pages.yml`. One-time setup: Settings > Pages > Source: GitHub Actions.
