<script>
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import Logo from './Logo.svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	const ZONE = 66; // px from the top edge that count as "the top of the page"
	let open = $state(false);
	let navEl;
	let tShow = 0;
	let tHide = 0;

	function show(delay = 70) {
		clearTimeout(tHide);
		tHide = 0;
		if (!open && !tShow)
			tShow = setTimeout(() => {
				tShow = 0;
				open = true;
			}, delay);
	}
	function hide(delay = 420) {
		clearTimeout(tShow);
		tShow = 0;
		if (open && !tHide)
			tHide = setTimeout(() => {
				tHide = 0;
				open = false;
			}, delay);
	}

	onMount(() => {
		const inside = (e) => e.clientY < ZONE || (open && navEl?.contains(e.target));
		const move = (e) => {
			if (e.pointerType === 'touch') return;
			inside(e) ? show() : hide();
		};
		const down = (e) => {
			if (e.pointerType !== 'touch') return;
			if (e.clientY < ZONE) {
				clearTimeout(tHide);
				tHide = 0;
				open = true;
			} else if (!navEl?.contains(e.target)) hide(0);
		};
		const up = (e) => {
			if (e.pointerType === 'touch' && open) hide(1800);
		};
		const leave = () => hide();
		const scroll = () => {
			if (open && !navEl?.matches(':hover, :focus-within')) hide(0);
		};
		addEventListener('pointermove', move, { passive: true });
		addEventListener('pointerdown', down, { passive: true });
		addEventListener('pointerup', up, { passive: true });
		addEventListener('pointercancel', up, { passive: true });
		document.documentElement.addEventListener('pointerleave', leave);
		addEventListener('scroll', scroll, { passive: true });
		return () => {
			removeEventListener('pointermove', move);
			removeEventListener('pointerdown', down);
			removeEventListener('pointerup', up);
			removeEventListener('pointercancel', up);
			document.documentElement.removeEventListener('pointerleave', leave);
			removeEventListener('scroll', scroll);
			clearTimeout(tShow);
			clearTimeout(tHide);
		};
	});

	const links = [
		['#how', 'How it works'],
		['#features', 'Features'],
		['#install', 'Install'],
		['/screenshots/', 'Screenshots'],
		['/changelog/', 'Changelog'],
		['/privacy/', 'Privacy & FAQ']
	];
	const href = (h) => (h.startsWith('#') ? `${resolve('/')}${h}` : resolve(h));
</script>

<!-- Glow line navbar: only a thin glowing line shows at the top edge. The bar drops down when the
     pointer reaches the top of the page (or on touch-and-hold at the top, or keyboard focus). -->
<header
	bind:this={navEl}
	class="nav"
	data-open={open ? '1' : '0'}
	onfocusin={() => show(0)}
	onfocusout={(e) => {
		if (!e.currentTarget.contains(e.relatedTarget)) hide(120);
	}}
>
	<nav class="nav-in" aria-label="Main">
		<a class="brand" href={resolve('/')}>
			<Logo />
			<span>Top Bar on Hover</span>
		</a>
		<ul class="links">
			{#each links as [h, label]}
				<li><a href={href(h)}>{label}</a></li>
			{/each}
		</ul>
		<ThemeToggle />
		<a class="get" href="{resolve('/')}#install">Get it</a>
	</nav>
	<i class="glowline" aria-hidden="true"></i>
</header>

<style>
	.nav {
		position: fixed;
		z-index: 50;
		inset: 0 0 auto 0;
		pointer-events: none;
	}
	.nav-in {
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 14px;
		height: 60px;
		padding: 0 24px;
		color: var(--ink);
		background: color-mix(in srgb, var(--bg) 80%, transparent);
		backdrop-filter: blur(20px) saturate(1.5);
		-webkit-backdrop-filter: blur(20px) saturate(1.5);
		border-bottom: 1px solid var(--line);
		transform: translateY(-101%);
		transition: transform 0.6s var(--ease);
		will-change: transform;
	}
	.nav[data-open='1'] .nav-in { transform: none; }
	.brand {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 650;
		letter-spacing: -0.01em;
		white-space: nowrap;
		color: inherit;
		text-decoration: none;
		margin-right: auto;
	}
	.links { display: flex; gap: 4px; list-style: none; margin: 0 8px 0 0; padding: 0; }
	.links a {
		display: block;
		padding: 7px 11px;
		border-radius: 8px;
		color: var(--mut);
		font-size: 13.5px;
		text-decoration: none;
		transition: background 0.25s, color 0.25s;
	}
	.links a:hover { background: color-mix(in srgb, var(--ink) 8%, transparent); color: var(--ink); }
	.get {
		background: var(--accent);
		color: var(--on);
		font-weight: 600;
		font-size: 13.5px;
		border-radius: 9px;
		padding: 8px 15px;
		white-space: nowrap;
		text-decoration: none;
	}
	.glowline {
		position: absolute;
		top: 0;
		left: 7%;
		right: 7%;
		height: 2px;
		border-radius: 2px;
		background: linear-gradient(90deg, transparent, var(--accent) 22%, var(--accent) 78%, transparent);
		box-shadow: 0 0 16px 1px var(--glow);
		transition: opacity 0.35s, transform 0.6s var(--ease);
	}
	.nav[data-open='1'] .glowline { opacity: 0; transform: scaleX(0.6); }
	@media (max-width: 720px) {
		.links { display: none; }
		.nav-in { padding: 0 16px; }
	}
	@media (prefers-reduced-motion: reduce) {
		.nav-in, .glowline { transition-duration: 0.01s; }
	}
</style>
