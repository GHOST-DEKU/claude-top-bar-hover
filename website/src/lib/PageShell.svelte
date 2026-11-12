<script>
	import Footer from './Footer.svelte';
	/** @type {{title: string, lead?: string, children: import('svelte').Snippet}} */
	let { title, lead = '', children } = $props();
</script>

<main class="page">
	<header>
		<h1>{title}</h1>
		{#if lead}<p>{lead}</p>{/if}
	</header>
	{@render children()}
</main>
<Footer />

<style>
	.page { max-width: 760px; margin: 0 auto; padding: 120px 24px 24px; }
	header { margin-bottom: 32px; }
	h1 { margin: 0; font-size: clamp(32px, 5.5vw, 48px); letter-spacing: -0.03em; font-weight: 600; }
	header p { margin: 10px 0 0; color: var(--mut); font-size: 17px; }
</style>
