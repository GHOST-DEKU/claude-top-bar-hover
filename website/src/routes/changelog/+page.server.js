const API = 'https://api.github.com/repos/GHOST-DEKU/claude-top-bar-hover/releases?per_page=30';

/** Turn GitHub's generated release notes into plain bullet lines (text only, nothing is injected as HTML). */
function parseBody(body = '') {
	const items = [];
	let skip = false;
	for (const raw of body.split(/\r?\n/)) {
		const line = raw.trim();
		if (/^#{1,6}\s/.test(line)) {
			skip = /new contributors/i.test(line);
			continue;
		}
		if (skip || !line || /^\*\*full changelog\*\*/i.test(line)) continue;
		const m = line.match(/^[*-]\s+(.*)$/);
		let text = (m ? m[1] : line).trim();
		let url = null;
		const pr = text.match(/\s+by\s+@[\w-]+\s+in\s+(https:\/\/github\.com\/\S+)$/);
		if (pr) {
			url = pr[1];
			text = text.slice(0, pr.index);
		}
		items.push({ text, url });
	}
	return items;
}

export async function load({ fetch }) {
	try {
		const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'claude-top-bar-hover-site' };
		// Only used while building (in GitHub Actions it avoids rate limits). It never reaches the browser.
		if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
		const res = await fetch(API, { headers });
		if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
		const data = await res.json();
		const releases = data
			.filter((r) => !r.draft && !r.prerelease)
			.map((r) => ({ tag: r.tag_name, name: r.name || r.tag_name, date: r.published_at, url: r.html_url, items: parseBody(r.body) }));
		return { releases, failed: false };
	} catch (e) {
		console.warn('[changelog] could not load releases:', e.message);
		return { releases: [], failed: true };
	}
}
