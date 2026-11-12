<script>
	import Hero from '#lib/Hero.svelte';
	import CordDemo from '#lib/CordDemo.svelte';
	import Steps from '#lib/Steps.svelte';
	import Features from '#lib/Features.svelte';
	import Install from '#lib/Install.svelte';
	import OpenSource from '#lib/OpenSource.svelte';
	import Footer from '#lib/Footer.svelte';
</script>

<svelte:head>
	<title>Claude Top Bar on Hover</title>
	<meta name="description" content="A free Chrome and Firefox extension that hides the top bar on claude.ai and shows it only when you move your mouse to the top of the page." />
</svelte:head>

<main>
	<Hero />
	<CordDemo />
	<Steps />
	<Features />
	<Install />
	<OpenSource />
</main>
<Footer />
