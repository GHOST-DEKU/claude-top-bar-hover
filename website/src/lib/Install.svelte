<script>
	import { REPO, FIREFOX, CHROME_ZIP } from './links.js';
	const steps = [
		['Download the zip', 'Use the button above. It is always the newest release.'],
		['Unzip it', 'You need a folder that has manifest.json right inside it.'],
		['Open the extensions page', 'Type chrome://extensions in the address bar (edge://extensions in Edge, brave://extensions in Brave).'],
		['Turn on Developer mode', 'The switch is at the top right of that page.'],
		['Click Load unpacked', 'Choose the folder from step 2. Then refresh your Claude tab.']
	];
</script>

<section id="install" class="sec">
	<h2>Install</h2>
	<p class="sub">Firefox has a store page. Chrome, Edge and Brave load it by hand, which takes about a minute.</p>
	<div class="cols">
		<div class="card">
			<h3>Firefox</h3>
			<p>Install it from the Firefox Add-ons page, and Firefox keeps it updated for you.</p>
			<a class="btn p" href={FIREFOX} rel="noopener">Add to Firefox</a>
		</div>
		<div class="card">
			<h3>Chrome, Edge, Brave</h3>
			<p>These browsers need the zip loaded as an unpacked extension.</p>
			<a class="btn" href={CHROME_ZIP} download>Download for Chrome</a>
			<ol class="how">
				{#each steps as [t, d], i}
					<li><span class="n">{i + 1}</span><div><b>{t}</b><small>{d}</small></div></li>
				{/each}
			</ol>
			<p class="note">After an update: download the new zip, replace the folder, click the reload icon on the extension, then refresh the Claude tab. The <a href="{REPO}/releases" rel="noopener">releases page</a> lists every version.</p>
		</div>
	</div>
</section>

<style>
	.sec { max-width: 1040px; margin: 0 auto; padding: 72px 24px 24px; scroll-margin-top: 24px; }
	h2 { margin: 0; font-size: clamp(28px, 4.4vw, 40px); letter-spacing: -0.03em; font-weight: 600; text-align: center; }
	.sub { margin: 10px auto 0; max-width: 36em; text-align: center; color: var(--mut); }
	.cols { margin-top: 36px; display: grid; gap: 16px; grid-template-columns: 1fr 1.5fr; align-items: start; }
	@media (max-width: 860px) { .cols { grid-template-columns: 1fr; } }
	.card { background: var(--surf); border: 1px solid var(--line); border-radius: 14px; padding: 22px; }
	h3 { margin: 0; font-size: 18px; letter-spacing: -0.01em; }
	.card > p { margin: 8px 0 16px; color: var(--mut); font-size: 14.5px; line-height: 1.5; }
	.btn { display: inline-flex; align-items: center; border-radius: 9px; padding: 11px 17px; font-weight: 600; font-size: 14.5px; text-decoration: none; color: var(--ink); background: var(--bg); border: 1px solid var(--line); transition: transform 0.35s var(--ease); }
	.btn:hover { transform: translateY(-1px); } .btn:active { transform: scale(0.98); }
	.btn.p { background: var(--accent); color: var(--on); border-color: transparent; }
	.how { list-style: none; margin: 22px 0 0; padding: 0; display: grid; gap: 14px; }
	.how li { display: flex; gap: 12px; align-items: flex-start; }
	.n { flex: none; display: grid; place-items: center; width: 24px; height: 24px; border-radius: 7px; background: var(--bg); border: 1px solid var(--line); font: 700 12px var(--font-mono); color: var(--accent); }
	.how b { display: block; font-size: 14.5px; } .how small { display: block; margin-top: 2px; color: var(--mut); font-size: 13.5px; line-height: 1.45; }
	.note { margin: 20px 0 0 !important; padding-top: 16px; border-top: 1px solid var(--line); font-size: 13.5px !important; }
	.note a { color: var(--ink); text-underline-offset: 3px; }
</style>
