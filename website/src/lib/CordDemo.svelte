<script>
	import { onMount } from 'svelte';
	import MockWindow from './MockWindow.svelte';
	import { Spring } from './spring.js';

	const RANGE = 46; // px the ring travels between "bar shown" and "bar rolled up"
	const BASE = 34; // px of cord showing when the bar is shown
	const PULL = 14; // px of pull that counts as a real pull
	const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
	// Rubber band: past either end the cord stretches, but with resistance.
	const soft = (x) => (x > 1 ? 1 + Math.min(0.5, (x - 1) * 0.4) : x < 0 ? Math.max(-0.5, x * 0.4) : x);

	let t = $state(0);
	const len = $derived(BASE + RANGE * clamp(t, -0.5, 1.5));
	const hidden = $derived(t >= 0.5);

	let root;
	let drag = $state(false);
	let touched = false;
	let sy = 0, s0 = 0, moved = 0;
	const sp = new Spring(0, 230, 17);
	sp.on = (v) => (t = v);

	function pointerdown(e) {
		if (e.button > 0) return;
		touched = true;
		drag = true;
		moved = 0;
		sy = e.clientY;
		sp.stop();
		s0 = clamp(sp.x, 0, 1);
		e.currentTarget.setPointerCapture(e.pointerId);
		e.preventDefault();
	}
	function pointermove(e) {
		if (!drag) return;
		const dy = e.clientY - sy;
		moved = Math.max(moved, Math.abs(dy));
		sp.x = soft(s0 + dy / RANGE);
		sp.v = 0;
		sp.on(sp.x);
	}
	function pointerup(e) {
		if (!drag) return;
		drag = false;
		try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
		const dy = e.clientY - sy;
		const flip = moved < 5 || (s0 < 0.5 ? dy >= PULL : Math.abs(dy) >= PULL);
		const open = flip ? (s0 < 0.5 ? 1 : 0) : s0 < 0.5 ? 0 : 1;
		sp.t = open;
		sp.to(open, 230, 17);
	}
	function keydown(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			touched = true;
			sp.to(sp.t >= 0.5 ? 0 : 1, 230, 17);
		}
	}

	onMount(() => {
		// First look: when the window scrolls into view, pull the cord once so people see what it does.
		const timers = [];
		const io = new IntersectionObserver(
			(es) => {
				if (!es[0].isIntersecting) return;
				io.disconnect();
				timers.push(setTimeout(() => !touched && sp.to(0.62, 170, 22), 500));
				timers.push(setTimeout(() => !touched && sp.to(1, 230, 15), 900));
			},
			{ threshold: 0.5 }
		);
		io.observe(root);
		return () => {
			io.disconnect();
			timers.forEach(clearTimeout);
			sp.stop();
		};
	});
</script>

<section class="demo" aria-label="Interactive demo: pull the cord to roll up the top bar">
	<div class="cmp" bind:this={root}>
		<MockWindow {t} />
		<div class="cord" class:drag style="--len:{len.toFixed(2)}px">
			<div class="cord-line"></div>
			<button
				class="cord-ring"
				type="button"
				aria-label="Pull cord to hide the top bar"
				aria-pressed={hidden}
				onpointerdown={pointerdown}
				onpointermove={pointermove}
				onpointerup={pointerup}
				onpointercancel={pointerup}
				onkeydown={keydown}
			></button>
		</div>
	</div>
	<div class="labels" aria-hidden="true">
		<span class:on={!hidden}><i></i>Bar shown</span>
		<span class:on={hidden}>Bar rolled up<i></i></span>
	</div>
	<p class="cap">Pull the cord down (or press Enter on it). Pull again to bring the bar back.</p>
</section>

<style>
	.demo { padding: 10px 5vw 30px; }
	.cmp {
		container: cmp / inline-size; position: relative; height: 330px; max-width: 820px; margin: 0 auto;
		border-radius: 16px; overflow: hidden; border: 1px solid var(--line);
		box-shadow: 0 30px 70px -30px rgba(0, 0, 0, 0.7), 0 0 0 6px color-mix(in srgb, var(--surf) 60%, transparent);
		touch-action: pan-y; user-select: none; -webkit-user-select: none; background: var(--cw-bg); isolation: isolate;
	}
	@media (max-width: 560px) { .cmp { height: 300px; } }
	@media (min-width: 900px) { .cmp { height: 350px; } }
	.cord { position: absolute; z-index: 7; top: 0; left: 64%; width: 44px; margin-left: -22px; height: 150px; touch-action: none; }
	@container cmp (max-width: 560px) { .cord { left: 34%; } }
	.cord-line {
		position: absolute; left: 50%; top: 0; width: 2px; margin-left: -1px; height: 200px;
		translate: 0 calc(var(--len) - 200px); background: linear-gradient(var(--cw-mut), var(--cw-ink)); border-radius: 2px; will-change: translate;
	}
	.cord-ring {
		position: absolute; left: 50%; top: 0; translate: 0 var(--len); will-change: translate, transform;
		width: 28px; height: 28px; margin: -3px 0 0 -14px; border-radius: 50%; border: 3px solid var(--cw-ink);
		background: var(--cw-bg); cursor: grab; padding: 0; box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35); transition: transform 0.25s var(--ease);
	}
	.cord-ring::after { content: ''; position: absolute; inset: -14px; }
	.cord-ring:active, .cord.drag .cord-ring { cursor: grabbing; transform: scale(1.12); }
	.labels {
		display: flex; justify-content: space-between; max-width: 820px; margin: 14px auto 0;
		font: 600 11.5px var(--font-mono); letter-spacing: 0.04em; text-transform: uppercase; color: var(--mut);
	}
	.labels span { transition: color 0.3s, opacity 0.3s; display: flex; align-items: center; gap: 7px; opacity: 0.55; }
	.labels span.on { color: var(--accent); opacity: 1; }
	.labels i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
	.cap { max-width: 820px; margin: 10px auto 0; text-align: center; color: var(--mut); font-size: 13px; }
	@media (prefers-reduced-motion: reduce) { .cord-ring, .labels span { transition: none; } }
</style>
