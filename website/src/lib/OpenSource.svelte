<script>
	import { REPO } from './links.js';
</script>

<section id="open-source" class="sec">
	<div class="card">
		<h2>Open source, and small enough to read</h2>
		<p>The whole extension is a few files of plain JavaScript and CSS, under the MIT license. Read it, change it, or report a problem on GitHub.</p>
		<div class="row">
			<a class="btn" href={REPO} rel="noopener">View the code</a>
			<a class="btn" href="{REPO}/issues" rel="noopener">Report an issue</a>
		</div>
	</div>
</section>

<style>
	.sec { max-width: 1040px; margin: 0 auto; padding: 72px 24px 24px; }
	.card { text-align: center; background: var(--surf); border: 1px solid var(--line); border-radius: 18px; padding: clamp(28px, 6vw, 56px) 24px; background-image: var(--hero); }
	h2 { margin: 0 auto; max-width: 16em; font-size: clamp(24px, 3.8vw, 34px); letter-spacing: -0.03em; font-weight: 600; text-wrap: balance; }
	p { margin: 12px auto 0; max-width: 34em; color: var(--mut); line-height: 1.55; }
	.row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 24px; }
	.btn { display: inline-flex; border-radius: 9px; padding: 11px 17px; font-weight: 600; font-size: 14.5px; text-decoration: none; color: var(--ink); background: var(--bg); border: 1px solid var(--line); transition: transform 0.35s var(--ease); }
	.btn:hover { transform: translateY(-1px); } .btn:active { transform: scale(0.98); }
</style>
