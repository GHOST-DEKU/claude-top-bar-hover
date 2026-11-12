<script>
	// A drawn copy of the claude.ai window (no screenshot, so it stays sharp and follows light/dark).
	// t = 0: top bar visible. t = 1: top bar rolled up out of the way.
	/** @type {{t: number}} */
	let { t } = $props();
	const to = $derived(Math.min(1, Math.max(0, t)));
</script>

<div class="cw" style="--t:{t.toFixed(4)};--to:{to.toFixed(4)}">
	<div class="cw-rail" aria-hidden="true"><i></i><i></i><i></i><b></b></div>
	<div class="cw-main">
		<div class="cw-bar" aria-hidden="true">
			<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="14" height="12" rx="3" /><path d="M8 4v12" /></svg>
			<span class="cw-title">Launch plan</span>
			<span class="cw-share">Share</span>
		</div>
		<i class="cw-glow" aria-hidden="true"></i>
		<div class="cw-chat" aria-hidden="true">
			<div class="u">Turn these notes into a launch plan.</div>
			<div class="a">
				<svg viewBox="0 0 16 16"><path d="M8 1.5 9.6 6.4 14.5 8 9.6 9.6 8 14.5 6.4 9.6 1.5 8 6.4 6.4Z" fill="#d97757" /></svg>
				<div class="sk"><i style="width:96%"></i><i style="width:88%"></i><i style="width:93%"></i><i style="width:58%"></i></div>
			</div>
			<div class="u">Make it five steps.</div>
			<div class="a">
				<svg viewBox="0 0 16 16"><path d="M8 1.5 9.6 6.4 14.5 8 9.6 9.6 8 14.5 6.4 9.6 1.5 8 6.4 6.4Z" fill="#d97757" /></svg>
				<div class="sk"><b></b><i style="width:90%"></i><i style="width:82%"></i><i style="width:74%"></i><i style="width:86%"></i></div>
			</div>
		</div>
		<div class="cw-in" aria-hidden="true"><span>Reply to Claude…</span><em></em></div>
	</div>
</div>

<style>
	.cw {
		--bar: 44px; --px: 22px; --rail: 56px;
		position: absolute; inset: 0; display: grid; grid-template-columns: var(--rail) 1fr;
		background: var(--cw-bg); color: var(--cw-ink); font: 13px/1.4 var(--font-sans); overflow: hidden;
	}
	@container cmp (max-width: 560px) {
		.cw { --rail: 0px; --px: 16px; }
		.cw-rail { border-right: 0; }
		.cw-chat .u { max-width: 62%; }
	}
	.cw-rail { min-width: 0; overflow: hidden; background: var(--cw-rail); border-right: 1px solid var(--cw-line); display: flex; flex-direction: column; align-items: center; gap: 12px; padding-top: 14px; }
	.cw-rail i { width: 22px; height: 22px; border-radius: 7px; background: var(--cw-sk); }
	.cw-rail b { margin-top: auto; margin-bottom: 14px; width: 26px; height: 26px; border-radius: 50%; background: var(--cw-bub); border: 1px solid var(--cw-line); }
	.cw-main { position: relative; overflow: hidden; }
	.cw-bar {
		will-change: transform, opacity; position: absolute; z-index: 3; left: 0; right: 0; top: 0; height: var(--bar);
		display: flex; align-items: center; gap: 10px; padding: 0 14px; background: var(--cw-bg); border-bottom: 1px solid var(--cw-line);
		transform: translateY(calc(var(--t) * -100%)); opacity: calc(1 - var(--to));
		box-shadow: 0 6px 18px -8px rgba(0, 0, 0, calc(var(--to) * 0.45));
	}
	.cw-bar svg { width: 18px; height: 18px; color: var(--cw-mut); flex: none; }
	.cw-title { font-weight: 600; color: var(--cw-ink); }
	.cw-share { margin-left: auto; border: 1px solid var(--cw-line); border-radius: 8px; padding: 3px 10px; font-size: 12px; color: var(--cw-ink); }
	.cw-glow { position: absolute; z-index: 4; top: 0; left: 12%; right: 12%; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, #d97757 22%, #d97757 78%, transparent); box-shadow: 0 0 12px 1px rgba(217, 119, 87, 0.7); opacity: calc(var(--to) * 0.95); }
	.cw-chat {
		position: absolute; left: 0; right: 0; top: 0; bottom: 72px;
		padding: calc(var(--bar) * (1 - var(--t)) + 16px) var(--px) 0; overflow: hidden;
		-webkit-mask-image: linear-gradient(#000 calc(100% - 26px), transparent); mask-image: linear-gradient(#000 calc(100% - 26px), transparent);
	}
	.cw-chat .u { margin: 0 0 14px auto; width: max-content; max-width: 82%; padding: 8px 13px; border-radius: 14px 14px 4px 14px; background: var(--cw-bub); }
	.cw-chat .a { display: flex; gap: 10px; margin: 0 0 16px; }
	.cw-chat .a > svg { width: 16px; height: 16px; flex: none; margin-top: 1px; }
	.sk { flex: 1; display: flex; flex-direction: column; gap: 9px; padding-top: 3px; }
	.sk i { display: block; height: 9px; border-radius: 5px; background: var(--cw-sk); }
	.sk b { display: block; height: 12px; width: 34%; border-radius: 6px; background: color-mix(in srgb, var(--cw-ink) 22%, var(--cw-sk)); margin-bottom: 2px; }
	.cw-in { position: absolute; left: var(--px); right: var(--px); bottom: 16px; height: 46px; border: 1px solid var(--cw-line); border-radius: 14px; background: var(--cw-bg); display: flex; align-items: center; justify-content: space-between; padding: 0 8px 0 14px; color: var(--cw-mut); box-shadow: 0 8px 24px -14px rgba(0, 0, 0, 0.5); }
	.cw-in em { width: 28px; height: 28px; border-radius: 9px; background: #d97757; display: block; }
</style>
