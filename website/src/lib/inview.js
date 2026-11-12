// Svelte action: sets data-in="1" while the element is on screen, so CSS animations only run when seen.
export function inview(node, opts = {}) {
	const io = new IntersectionObserver(
		([e]) => {
			node.dataset.in = e.isIntersecting ? '1' : '0';
			if (opts.once && e.isIntersecting) io.disconnect();
		},
		{ threshold: opts.threshold ?? 0.45 }
	);
	io.observe(node);
	return { destroy: () => io.disconnect() };
}
