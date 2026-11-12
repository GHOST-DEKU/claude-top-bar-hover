<script>
	import { inview } from './inview.js';
	import Logo from './Logo.svelte';
</script>

<section id="how" class="sec">
	<h2>How it works</h2>
	<p class="sub">Three things happen, and you only do the last one.</p>
	<ol class="steps">
		<li class="card" use:inview>
			<div class="vis s1" aria-hidden="true">
				<div class="tb">
					<span class="dots"><i></i><i></i><i></i></span>
					<span class="addr"></span>
					<span class="slot"><span class="ic"><Logo /></span></span>
				</div>
				<div class="ok">Added</div>
			</div>
			<h3><span class="n">1</span> Add it</h3>
			<p>Install it from the Firefox store, or load the Chrome zip. It runs only on claude.ai.</p>
		</li>
		<li class="card" use:inview>
			<div class="vis s2" aria-hidden="true">
				<div class="win">
					<div class="bar"><b></b><span></span><em></em></div>
					<i class="glow"></i>
					<div class="body"><u></u><u></u><u></u><u></u></div>
				</div>
			</div>
			<h3><span class="n">2</span> The bar steps aside</h3>
			<p>The top bar, with the sidebar button, title and Share, fades out. Your chat gets the whole window.</p>
		</li>
		<li class="card" use:inview>
			<div class="vis s3" aria-hidden="true">
				<div class="win">
					<div class="bar"><b></b><span></span><em></em></div>
					<i class="glow"></i>
					<div class="body"><u></u><u></u><u></u><u></u></div>
				</div>
				<svg class="cur" viewBox="0 0 20 20"><path d="M4 2.5 16.5 9l-5.3 1.6L9 16Z" fill="var(--ink)" stroke="var(--bg)" stroke-width="1.4" stroke-linejoin="round" /></svg>
			</div>
			<h3><span class="n">3</span> Move to the top</h3>
			<p>Move your mouse to the top edge and the bar comes back. Move away and it leaves after a short pause.</p>
		</li>
	</ol>
</section>

<style>
	.sec { max-width: 1040px; margin: 0 auto; padding: 72px 24px 24px; scroll-margin-top: 24px; }
	h2 { margin: 0; font-size: clamp(28px, 4.4vw, 40px); letter-spacing: -0.03em; font-weight: 600; text-align: center; }
	.sub { margin: 10px 0 0; text-align: center; color: var(--mut); }
	.steps { list-style: none; margin: 36px 0 0; padding: 0; display: grid; gap: 16px; grid-template-columns: repeat(3, 1fr); }
	@media (max-width: 860px) { .steps { grid-template-columns: 1fr; max-width: 460px; margin-inline: auto; } }
	.card { background: var(--surf); border: 1px solid var(--line); border-radius: 14px; padding: 16px 16px 20px; }
	.vis { position: relative; height: 150px; border-radius: 10px; background: var(--bg); border: 1px solid var(--line); overflow: hidden; margin-bottom: 18px; }
	h3 { margin: 0; font-size: 17px; letter-spacing: -0.01em; display: flex; align-items: center; gap: 10px; }
	.n { display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 7px; background: var(--accent); color: var(--on); font: 700 12px var(--font-mono); }
	.card p { margin: 8px 0 0; color: var(--mut); font-size: 14.5px; line-height: 1.5; }

	/* step 1: the toolbar icon drops in */
	.tb { position: absolute; inset: 22px 14px auto; height: 34px; display: flex; align-items: center; gap: 10px; padding: 0 10px; border: 1px solid var(--line); border-radius: 9px; background: var(--surf); }
	.dots { display: flex; gap: 4px; } .dots i { width: 7px; height: 7px; border-radius: 50%; background: var(--line); }
	.addr { flex: 1; height: 12px; border-radius: 6px; background: var(--line); opacity: 0.7; }
	.slot { width: 24px; height: 24px; border-radius: 7px; border: 1px dashed var(--line); display: grid; place-items: center; }
	.ic { display: block; width: 22px; height: 22px; opacity: 0; transform: translateY(-26px) scale(0.6); }
	.ic :global(svg) { width: 22px; height: 22px; display: block; }
	.ok { position: absolute; left: 50%; bottom: 22px; translate: -50% 0; padding: 6px 14px; border-radius: 9px; background: var(--accent); color: var(--on); font: 700 12px var(--font-mono); letter-spacing: 0.04em; text-transform: uppercase; opacity: 0; }
	:global([data-in='1']) .ic { animation: drop 4.8s var(--ease) infinite; }
	:global([data-in='1']) .ok { animation: ok 4.8s var(--ease) infinite; }
	@keyframes drop { 0%, 8% { opacity: 0; transform: translateY(-26px) scale(0.6); } 20%, 88% { opacity: 1; transform: none; } 96%, 100% { opacity: 0; transform: translateY(-26px) scale(0.6); } }
	@keyframes ok { 0%, 24% { opacity: 0; transform: translateY(8px); } 34%, 86% { opacity: 1; transform: none; } 94%, 100% { opacity: 0; transform: translateY(8px); } }

	/* steps 2 and 3: a tiny claude.ai window */
	.win { position: absolute; inset: 14px 18px 0; border: 1px solid var(--line); border-bottom: 0; border-radius: 10px 10px 0 0; background: var(--cw-bg); overflow: hidden; }
	.bar { position: absolute; z-index: 2; inset: 0 0 auto 0; height: 26px; display: flex; align-items: center; gap: 8px; padding: 0 10px; background: var(--cw-bg); border-bottom: 1px solid var(--cw-line); }
	.bar b { width: 12px; height: 10px; border-radius: 3px; background: var(--cw-sk); } .bar span { width: 48px; height: 7px; border-radius: 4px; background: var(--cw-sk); } .bar em { margin-left: auto; width: 26px; height: 12px; border-radius: 4px; border: 1px solid var(--cw-line); }
	.glow { position: absolute; z-index: 3; top: 0; left: 14%; right: 14%; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, var(--accent) 22%, var(--accent) 78%, transparent); box-shadow: 0 0 10px 1px var(--glow); opacity: 0; }
	.body { position: absolute; inset: 0; padding: 38px 14px 0; display: flex; flex-direction: column; gap: 9px; transform: translateY(-14px); }
	.body u { display: block; height: 8px; border-radius: 4px; background: var(--cw-sk); text-decoration: none; } .body u:nth-child(1) { width: 80%; } .body u:nth-child(2) { width: 92%; } .body u:nth-child(3) { width: 64%; } .body u:nth-child(4) { width: 86%; }
	/* step 2: bar leaves, glow line appears, the page slides up to fill the gap */
	:global([data-in='1']) .s2 .bar { animation: leave 5s var(--ease) infinite; }
	:global([data-in='1']) .s2 .glow { animation: glowOn 5s var(--ease) infinite; }
	:global([data-in='1']) .s2 .body { animation: fill 5s var(--ease) infinite; }
	.s2 .bar { transform: translateY(0); }
	@keyframes leave { 0%, 22% { transform: none; opacity: 1; } 38%, 86% { transform: translateY(-100%); opacity: 0; } 100% { transform: none; opacity: 1; } }
	@keyframes glowOn { 0%, 22% { opacity: 0; } 38%, 86% { opacity: 1; } 96%, 100% { opacity: 0; } }
	@keyframes fill { 0%, 22% { transform: translateY(0); } 38%, 86% { transform: translateY(-26px); } 100% { transform: translateY(0); } }
	/* step 3: bar starts hidden; the cursor reaches the top edge and the bar drops in, then it leaves */
	.s3 .bar { transform: translateY(-100%); opacity: 0; }
	.s3 .glow { opacity: 1; }
	.s3 .body { transform: translateY(-26px); }
	.cur { position: absolute; z-index: 5; width: 18px; height: 18px; left: 56%; top: 118px; }
	:global([data-in='1']) .s3 .cur { animation: cursor 5s var(--ease) infinite; }
	:global([data-in='1']) .s3 .bar { animation: arrive 5s var(--ease) infinite; }
	:global([data-in='1']) .s3 .glow { animation: glowOff 5s var(--ease) infinite; }
	:global([data-in='1']) .s3 .body { animation: push 5s var(--ease) infinite; }
	@keyframes cursor { 0%, 8% { top: 118px; } 30%, 58% { top: 14px; } 80%, 100% { top: 118px; } }
	@keyframes arrive { 0%, 28% { transform: translateY(-100%); opacity: 0; } 40%, 62% { transform: none; opacity: 1; } 74%, 100% { transform: translateY(-100%); opacity: 0; } }
	@keyframes glowOff { 0%, 28% { opacity: 1; } 40%, 62% { opacity: 0; } 74%, 100% { opacity: 1; } }
	@keyframes push { 0%, 28% { transform: translateY(-26px); } 40%, 62% { transform: translateY(0); } 74%, 100% { transform: translateY(-26px); } }
	@media (prefers-reduced-motion: reduce) {
		:global([data-in='1']) .ic, :global([data-in='1']) .ok, :global([data-in='1']) .bar, :global([data-in='1']) .glow, :global([data-in='1']) .body, :global([data-in='1']) .cur { animation: none !important; }
		.ic { opacity: 1; transform: none; } .ok { opacity: 1; } .s3 .cur { top: 14px; } .s3 .bar { transform: none; opacity: 1; } .s3 .glow { opacity: 0; } .s3 .body { transform: none; }
		.s2 .bar { opacity: 0; transform: translateY(-100%); } .s2 .glow { opacity: 1; } .s2 .body { transform: translateY(-26px); }
	}
</style>
