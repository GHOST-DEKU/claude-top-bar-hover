<script>
	import { inview } from './inview.js';
	const items = [
		{ id: 'hover', t: 'Hover to show', d: 'Move the mouse to the top and the bar fades in fast. Move away and it leaves after a short pause, so a quick slip does not make it flicker.' },
		{ id: 'styles', t: 'Four ways to appear', d: 'Fade, slide up, soft blur, or a glow line that stays at the top while the bar is hidden. Pick one and see it at once.' },
		{ id: 'peek', t: 'Peek timer and Alt + B', d: 'Keep the bar shown for 10 seconds, 1 minute or 5 minutes, or press Alt + B to show or hide it. You can change the key.' },
		{ id: 'strip', t: 'No empty strip', d: 'Where the bar took up space, the page moves up to fill the window. The bar floats over it when shown.' },
		{ id: 'care', t: 'Careful with the page', d: 'The bar stays up while a menu is open or when you move through it with the keyboard. Clicks still reach what is under the mouse.' },
		{ id: 'private', t: 'Private by design', d: 'No data collected and no network requests. It runs only on claude.ai, and its settings stay in your browser.' }
	];
</script>

<section id="features" class="sec">
	<h2>What it does</h2>
	<p class="sub">Small, quiet, and built around one idea.</p>
	<ul class="grid">
		{#each items as f (f.id)}
			<li class="card" use:inview={{ threshold: 0.3 }}>
				<div class="ico" aria-hidden="true">
					{#if f.id === 'hover'}
						<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="24" height="22" rx="4" /><path class="bar" d="M4 11h24" /><path class="arr" d="M16 22v-6m-3 3 3-3 3 3" /></svg>
					{:else if f.id === 'styles'}
						<svg viewBox="0 0 32 32" fill="currentColor"><rect class="d1" x="4" y="13" width="5" height="6" rx="2.5" /><rect class="d2" x="11.5" y="13" width="5" height="6" rx="2.5" /><rect class="d3" x="19" y="13" width="5" height="6" rx="2.5" /><rect class="d4" x="26" y="13" width="3" height="6" rx="1.5" /></svg>
					{:else if f.id === 'peek'}
						<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="16" cy="17" r="10" /><path d="M16 17V11" /><path class="hand" d="M16 17h5" /><path d="M13 4h6" /></svg>
					{:else if f.id === 'strip'}
						<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="24" height="22" rx="4" /><g class="fill"><path d="M9 14h14M9 19h10M9 24h12" /></g></svg>
					{:else if f.id === 'care'}
						<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="26" height="16" rx="4" /><path class="key" d="M9 16h2M14 16h4M21 16h2" /></svg>
					{:else}
						<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3.5 26 7v8c0 6-4.2 10.4-10 13-5.8-2.6-10-7-10-13V7Z" /><path class="tick" d="m11.5 15.5 3.3 3.3 6-6.3" /></svg>
					{/if}
				</div>
				<h3>{f.t}</h3>
				<p>{f.d}</p>
			</li>
		{/each}
	</ul>
</section>

<style>
	.sec { max-width: 1040px; margin: 0 auto; padding: 72px 24px 24px; scroll-margin-top: 24px; }
	h2 { margin: 0; font-size: clamp(28px, 4.4vw, 40px); letter-spacing: -0.03em; font-weight: 600; text-align: center; }
	.sub { margin: 10px 0 0; text-align: center; color: var(--mut); }
	.grid { list-style: none; margin: 36px 0 0; padding: 0; display: grid; gap: 14px; grid-template-columns: repeat(3, 1fr); }
	@media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } }
	@media (max-width: 560px) { .grid { grid-template-columns: 1fr; } }
	.card { background: var(--surf); border: 1px solid var(--line); border-radius: 14px; padding: 20px; transition: transform 0.5s var(--ease), border-color 0.3s; }
	.card:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); }
	.ico { width: 40px; height: 40px; border-radius: 10px; display: grid; place-items: center; background: var(--bg); border: 1px solid var(--line); color: var(--accent); margin-bottom: 14px; }
	.ico svg { width: 24px; height: 24px; overflow: visible; }
	h3 { margin: 0; font-size: 16.5px; letter-spacing: -0.01em; }
	p { margin: 8px 0 0; color: var(--mut); font-size: 14.5px; line-height: 1.5; }
	/* each icon moves in a way that matches what the feature does, on hover or when scrolled to */
	.card:hover .arr { animation: up 0.9s var(--ease); }
	@keyframes up { 0% { transform: translateY(5px); opacity: 0; } 100% { transform: none; opacity: 1; } }
	.card:hover .d1 { animation: dim 1.2s infinite 0s; } .card:hover .d2 { animation: dim 1.2s infinite 0.15s; } .card:hover .d3 { animation: dim 1.2s infinite 0.3s; } .card:hover .d4 { animation: dim 1.2s infinite 0.45s; }
	@keyframes dim { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
	.card:hover .hand { transform-origin: 16px 17px; animation: tick 1.6s linear infinite; }
	@keyframes tick { to { transform: rotate(360deg); } }
	.card:hover .fill { animation: rise 0.9s var(--ease); }
	@keyframes rise { 0% { transform: translateY(5px); } 100% { transform: none; } }
	.card:hover .key { stroke-dasharray: 3 5; animation: type 0.9s linear infinite; }
	@keyframes type { to { stroke-dashoffset: -16; } }
	.tick { stroke-dasharray: 22; stroke-dashoffset: 0; }
	.card:hover .tick { animation: draw 0.7s var(--ease); }
	@keyframes draw { 0% { stroke-dashoffset: 22; } 100% { stroke-dashoffset: 0; } }
	@media (prefers-reduced-motion: reduce) { .card, .card * { animation: none !important; transition: none !important; } }
</style>
