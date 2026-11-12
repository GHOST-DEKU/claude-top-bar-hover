<script>
	import PageShell from '#lib/PageShell.svelte';
	import { asset } from '$app/paths';
	import { theme } from '#lib/theme.svelte.js';

	const shots = [
		{ id: 'home', t: 'Home', d: 'Choose the mode, keep the bar shown for 10 seconds, 1 minute or 5 minutes, and see how much more page you gain.' },
		{ id: 'reveal', t: 'Reveal', d: 'Choose where the mouse must go (whole top, left corner or right corner) and how long it waits to show and hide.' },
		{ id: 'style', t: 'Style', d: 'Fade, slide up, soft blur or glow line, plus a speed slider. Picking one shows it right away.' },
		{ id: 'pages', t: 'Pages', d: 'Turn hiding on or off for Chats, Artifacts and Projects separately.' }
	];
	const src = (id) => asset(`/screenshots/popup-${id}-${theme.value === 'light' ? 'light' : 'dark'}.png`);

	let dlg;
	let cur = $state(0);
	let opener = null;
	const open = (i, e) => {
		cur = i;
		opener = e.currentTarget;
		dlg.showModal();
	};
	const step = (n) => (cur = (cur + n + shots.length) % shots.length);
	function key(e) {
		if (e.key === 'ArrowRight') step(1);
		else if (e.key === 'ArrowLeft') step(-1);
	}
</script>

<svelte:head><title>Screenshots · Claude Top Bar on Hover</title></svelte:head>

<PageShell title="Screenshots" lead="The extension's settings popup. These are rendered from the real popup code, with sample numbers.">
	<ul class="grid">
		{#each shots as s, i (s.id)}
			<li>
				<button type="button" class="shot" onclick={(e) => open(i, e)} aria-label="Enlarge: {s.t} tab">
					<img src={src(s.id)} alt="The {s.t} tab of the popup" width="340" height="366" loading="lazy" />
				</button>
				<h2>{s.t}</h2>
				<p>{s.d}</p>
			</li>
		{/each}
	</ul>
</PageShell>

<dialog bind:this={dlg} onkeydown={key} onclose={() => opener?.focus()} onclick={(e) => e.target === dlg && dlg.close()} aria-label="Screenshot viewer">
	<div class="box">
		<img src={src(shots[cur].id)} alt="The {shots[cur].t} tab of the popup, enlarged" />
		<div class="bar">
			<button type="button" onclick={() => step(-1)} aria-label="Previous">←</button>
			<span>{shots[cur].t} · {cur + 1} of {shots.length}</span>
			<button type="button" onclick={() => step(1)} aria-label="Next">→</button>
			<button type="button" class="x" onclick={() => dlg.close()}>Close</button>
		</div>
	</div>
</dialog>

<style>
	.grid { list-style: none; margin: 0; padding: 0; display: grid; gap: 28px 20px; grid-template-columns: repeat(2, 1fr); }
	@media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
	.shot { display: block; width: 100%; padding: 0; border: 1px solid var(--line); border-radius: 14px; overflow: hidden; background: var(--surf); cursor: zoom-in; transition: transform 0.5s var(--ease), border-color 0.3s; }
	.shot:hover { transform: translateY(-3px); border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); }
	.shot img { display: block; width: 100%; height: auto; }
	h2 { margin: 14px 0 0; font-size: 17px; }
	p { margin: 6px 0 0; color: var(--mut); font-size: 14.5px; line-height: 1.5; }
	dialog { border: 0; padding: 0; background: transparent; max-width: 94vw; max-height: 94vh; color: var(--ink); overflow: visible; }
	dialog::backdrop { background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(6px); }
	.box { display: grid; gap: 12px; justify-items: center; }
	.box img { max-height: 78vh; max-width: 92vw; width: auto; height: auto; border-radius: 14px; border: 1px solid var(--line); background: var(--surf); }
	.bar { display: flex; align-items: center; gap: 10px; padding: 8px; background: var(--surf); border: 1px solid var(--line); border-radius: 12px; font-size: 13.5px; }
	.bar button { border: 1px solid var(--line); background: var(--bg); color: var(--ink); border-radius: 8px; padding: 6px 12px; font: inherit; cursor: pointer; }
	.bar span { min-width: 8em; text-align: center; color: var(--mut); }
	.x { margin-left: 6px; }
	dialog[open] { animation: pop 0.4s var(--ease); }
	@keyframes pop { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: none; } }
	@media (prefers-reduced-motion: reduce) { dialog[open], .shot { animation: none; transition: none; } }
</style>
