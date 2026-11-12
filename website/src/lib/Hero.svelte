<script>
	import { REPO, FIREFOX, CHROME_ZIP } from './links.js';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<section class="hero">
	<div class="topx">
		<span class="note">
			for Chrome and Firefox
			<svg viewBox="0 0 44 34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 4c18-4 36 2 36 22M31 20l7 8 6-9" /></svg>
		</span>
	</div>
	<h1>The bar that gets out of your way.</h1>
	<p class="lead">Hides the top bar on claude.ai and shows it only when you move your mouse to the top of the page.</p>
	<div class="cta">
		<a class="btn p" href={FIREFOX} rel="noopener">
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3.5h2.2a1.8 1.8 0 0 1 3.6 0H16v3a1.8 1.8 0 0 0 0 3.6V16H3.5v-2.2a1.8 1.8 0 0 0 0-3.6V3.5Z" transform="translate(.2 .2) scale(.98)" /></svg>
			Add to Firefox
		</a>
		<a class="btn" href={CHROME_ZIP} download>
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3v9.5M6 9l4 4 4-4M4 16.5h12" /></svg>
			Download for Chrome
		</a>
		<a class="btn" href={REPO} rel="noopener">
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 6 3 10l4 4M13 6l4 4-4 4" /></svg>
			View on GitHub
		</a>
	</div>
	<p class="meta">Free · No data collected · Runs only on claude.ai</p>
	{@render children?.()}
</section>

<style>
	.hero {
		position: relative;
		text-align: center;
		padding: 118px 6vw 34px;
		background: var(--hero);
	}
	.topx { display: flex; justify-content: center; margin-bottom: 22px; }
	.note {
		position: relative;
		display: inline-block;
		padding-bottom: 26px;
		transform: rotate(-3deg);
		font: italic 400 17px/1.2 ui-serif, Georgia, 'Times New Roman', serif;
		color: var(--mut);
	}
	.note svg {
		position: absolute;
		left: 100%;
		top: 6px;
		width: 44px;
		height: 34px;
		margin-left: 6px;
		color: var(--accent);
		overflow: visible;
	}
	.note svg path {
		stroke-dasharray: 90;
		stroke-dashoffset: 90;
		animation: draw 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards;
	}
	@keyframes draw { to { stroke-dashoffset: 0; } }
	h1 {
		margin: 0 auto;
		max-width: 12.5em;
		font-size: clamp(38px, 7.2vw, 72px);
		line-height: 1.02;
		letter-spacing: -0.03em;
		font-weight: 600;
		text-wrap: balance;
	}
	.lead {
		margin: 22px auto 0;
		max-width: 34em;
		color: var(--mut);
		font-size: clamp(16px, 2.2vw, 19px);
		line-height: 1.5;
		text-wrap: pretty;
	}
	.cta { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 30px; }
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-radius: 9px;
		padding: 12px 18px;
		font-weight: 600;
		font-size: 14.5px;
		text-decoration: none;
		color: var(--ink);
		background: var(--surf);
		border: 1px solid var(--line);
		transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease), background 0.25s;
	}
	.btn svg { width: 17px; height: 17px; flex: none; }
	.btn:hover { transform: translateY(-1px); }
	.btn:active { transform: scale(0.98); }
	.btn.p {
		background: var(--accent);
		color: var(--on);
		border-color: transparent;
		box-shadow: 0 8px 24px -10px var(--glow);
	}
	.meta { margin: 16px 0 0; font-size: 12.5px; color: var(--mut); }
	@media (max-width: 560px) {
		.hero { padding-left: 20px; padding-right: 20px; }
		.cta { flex-direction: column; align-items: center; }
		.btn { min-width: 220px; justify-content: center; }
	}
	@media (prefers-reduced-motion: reduce) {
		.note svg path { animation: none; stroke-dashoffset: 0; }
		.btn { transition: none; }
	}
</style>
