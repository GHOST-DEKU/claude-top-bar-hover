<script>
	import PageShell from '#lib/PageShell.svelte';
	import { REPO } from '#lib/links.js';
	const faq = [
		['Does it read or send my chats?', 'No. The extension only looks for the top bar and watches where your mouse is. It makes no network requests at all, so nothing can be sent anywhere.'],
		['Which sites does it run on?', 'Only https://claude.ai/. It has no access to any other website.'],
		['Which permission does it ask for?', 'One: "storage", which saves your settings (mode, style, speed and so on) inside your browser. They never leave it.'],
		['Why is Chrome a manual install?', 'It is not on the Chrome Web Store, so Chrome loads it from a folder. The install guide on the home page takes about a minute. Firefox has a normal store page.'],
		['The bar does not hide. What now?', 'Reload the extension on its extensions page, then refresh the Claude tab. Also check the address starts with https://claude.ai/. If it still shows, open an issue on GitHub.'],
		['Will it work on my phone or tablet?', 'Touch screens that cannot hover are left alone on purpose, so nothing on them changes.'],
		['Alt + B types a character on my Mac.', 'On a Mac, Alt + B can type a character. Change the key at chrome://extensions/shortcuts (Firefox: Add-ons Manager, gear icon, Manage Extension Shortcuts).'],
		['What if Claude changes its design?', 'The extension first looks for the bar by its class name. If that name changes, it falls back to finding it by its shape (an element at the top edge, 32 to 80 px high, nearly full width, with a button). If something still breaks, an issue helps me fix it quickly.'],
		['Is this made by Anthropic?', 'No. It is an independent project and is not affiliated with Anthropic.']
	];
</script>

<svelte:head><title>Privacy and FAQ · Claude Top Bar on Hover</title></svelte:head>

<PageShell title="Privacy and FAQ" lead="Short version: it collects nothing and talks to no one.">
	<section class="block">
		<h2>Privacy</h2>
		<ul>
			<li><b>The extension</b> collects no data and makes no network requests. It runs only on claude.ai. The single permission it uses, "storage", keeps your settings in your own browser.</li>
			<li><b>This website</b> has no analytics, no trackers and no cookies. The only thing it saves is your light or dark choice, in your browser, and only if you change it.</li>
			<li>You can check all of this. The code is open: <a href={REPO} rel="noopener">GitHub</a>.</li>
		</ul>
	</section>
	<section class="block" id="faq">
		<h2>FAQ</h2>
		<div class="faq">
			{#each faq as [q, a]}
				<details>
					<summary>{q}</summary>
					<div class="ans"><div><p>{a}</p></div></div>
				</details>
			{/each}
		</div>
		<p class="help">Something else? <a href="{REPO}/issues" rel="noopener">Open an issue</a>.</p>
	</section>
</PageShell>

<style>
	.block { margin-bottom: 40px; }
	h2 { margin: 0 0 14px; font-size: 22px; letter-spacing: -0.02em; }
	ul { margin: 0; padding-left: 20px; color: var(--mut); line-height: 1.6; display: grid; gap: 10px; }
	ul b { color: var(--ink); font-weight: 600; }
	a { color: var(--ink); text-underline-offset: 3px; }
	.faq { display: grid; gap: 8px; }
	details { background: var(--surf); border: 1px solid var(--line); border-radius: 12px; padding: 0 18px; transition: border-color 0.3s; }
	details[open] { border-color: color-mix(in srgb, var(--accent) 40%, var(--line)); }
	summary { cursor: pointer; list-style: none; padding: 16px 0; font-weight: 600; display: flex; justify-content: space-between; gap: 16px; align-items: center; }
	summary::-webkit-details-marker { display: none; }
	summary::after { content: ''; flex: none; width: 9px; height: 9px; border-right: 2px solid var(--mut); border-bottom: 2px solid var(--mut); transform: rotate(45deg) translateY(-2px); transition: transform 0.4s var(--ease); }
	details[open] summary::after { transform: rotate(225deg) translateY(-2px); }
	/* the answer opens smoothly: grid rows animate from 0fr to 1fr */
	.ans { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.45s var(--ease); }
	details[open] .ans { grid-template-rows: 1fr; }
	.ans > div { overflow: hidden; }
	.ans p { margin: 0; padding: 0 0 16px; color: var(--mut); line-height: 1.6; }
	.help { margin-top: 18px; color: var(--mut); }
	@media (prefers-reduced-motion: reduce) { .ans, summary::after, details { transition: none; } }
</style>
