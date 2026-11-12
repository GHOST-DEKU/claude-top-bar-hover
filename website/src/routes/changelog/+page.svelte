<script>
	import PageShell from '#lib/PageShell.svelte';
	import { REPO } from '#lib/links.js';
	let { data } = $props();
	const fmt = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
</script>

<svelte:head><title>Changelog · Claude Top Bar on Hover</title></svelte:head>

<PageShell title="Changelog" lead="Every release, straight from GitHub.">
	{#if data.releases.length}
		<ol class="list">
			{#each data.releases as r (r.tag)}
				<li>
					<div class="head"><h2>{r.name}</h2><time datetime={r.date}>{fmt(r.date)}</time></div>
					{#if r.items.length}
						<ul>
							{#each r.items as it}
								<li>{it.text}{#if it.url} <a href={it.url} rel="noopener">details</a>{/if}</li>
							{/each}
						</ul>
					{/if}
					<a class="more" href={r.url} rel="noopener">Release page and downloads</a>
				</li>
			{/each}
		</ol>
	{:else}
		<p class="empty">{data.failed ? 'The release list could not be loaded right now.' : 'No releases yet.'} You can always see them on the <a href="{REPO}/releases" rel="noopener">GitHub releases page</a>.</p>
	{/if}
</PageShell>

<style>
	.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
	.list > li { background: var(--surf); border: 1px solid var(--line); border-radius: 14px; padding: 20px 22px; }
	.head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
	h2 { margin: 0; font-size: 19px; letter-spacing: -0.01em; }
	time { color: var(--mut); font-size: 13.5px; }
	ul { margin: 12px 0 0; padding-left: 18px; color: var(--mut); line-height: 1.55; font-size: 14.5px; }
	ul a, .more, .empty a { color: var(--ink); text-underline-offset: 3px; }
	.more { display: inline-block; margin-top: 14px; font-size: 13.5px; }
	.empty { color: var(--mut); }
</style>
