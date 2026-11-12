<script>
	import { onMount } from 'svelte';
	import { theme, initTheme, setTheme } from './theme.svelte.js';
	onMount(initTheme);
	const light = $derived(theme.value === 'light');
</script>

<button
	type="button"
	class="toggle"
	role="switch"
	aria-checked={light}
	aria-label="Light theme"
	onclick={() => setTheme(light ? 'dark' : 'light')}
>
	<span class="knob" class:on={light}>
		{#if light}
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="3.2" /><path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4" /></svg>
		{:else}
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 11.6A6.6 6.6 0 0 1 8.4 3.5a6.6 6.6 0 1 0 8.1 8.1Z" /></svg>
		{/if}
	</span>
</button>

<style>
	.toggle {
		position: relative;
		width: 52px;
		height: 30px;
		padding: 0;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--surf);
		color: var(--ink);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.knob {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: var(--accent);
		color: var(--on);
		translate: 0 0;
		transition: translate 0.45s var(--ease);
	}
	.knob.on { translate: 22px 0; }
	.knob svg { width: 14px; height: 14px; }
	@media (prefers-reduced-motion: reduce) { .knob { transition: none; } }
</style>
