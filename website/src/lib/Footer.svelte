<script>
	import { resolve } from '$app/paths';
	import { REPO, FIREFOX, VERSION } from './links.js';
</script>

<footer>
	<div class="in">
		<span>Claude Top Bar on Hover · v{VERSION}</span>
		<nav aria-label="Footer">
			<a href={resolve('/changelog/')}>Changelog</a>
			<a href={resolve('/privacy/')}>Privacy &amp; FAQ</a>
			<a href={FIREFOX} rel="noopener">Firefox Add-ons</a>
			<a href={REPO} rel="noopener">GitHub</a>
		</nav>
	</div>
	<p>An independent project. Not made by or affiliated with Anthropic. "Claude" is a trademark of Anthropic.</p>
</footer>

<style>
	footer { max-width: 1040px; margin: 56px auto 0; padding: 24px 24px 40px; border-top: 1px solid var(--line); color: var(--mut); font-size: 13.5px; }
	.in { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px 24px; }
	nav { display: flex; flex-wrap: wrap; gap: 6px 20px; }
	a { color: var(--mut); text-decoration: none; transition: color 0.25s; } a:hover { color: var(--ink); }
	p { margin: 14px 0 0; font-size: 12.5px; }
</style>
