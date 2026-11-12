// Small critically-tuned spring (semi-implicit Euler, sub-stepped). Used for the cord so it feels physical.
export class Spring {
	x; v = 0; t; k; d; raf = 0; last = 0; on = null; reduced;
	constructor(value, k = 230, d = 17) {
		this.x = this.t = value;
		this.k = k;
		this.d = d;
		this.reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	}
	to(target, k, d) {
		if (k) this.k = k;
		if (d) this.d = d;
		this.t = target;
		if (this.reduced) return this.snap(target);
		if (!this.raf) {
			this.last = performance.now();
			this.raf = requestAnimationFrame(this.step);
		}
	}
	snap(target) {
		cancelAnimationFrame(this.raf);
		this.raf = 0;
		this.x = this.t = target;
		this.v = 0;
		this.on?.(this.x);
	}
	step = (now) => {
		const dt = Math.min(0.05, (now - this.last) / 1000);
		this.last = now;
		const n = Math.max(1, Math.ceil(dt / 0.008));
		const h = dt / n;
		for (let i = 0; i < n; i++) {
			const a = -this.k * (this.x - this.t) - this.d * this.v;
			this.v += a * h;
			this.x += this.v * h;
		}
		this.on?.(this.x);
		if (Math.abs(this.v) < 0.02 && Math.abs(this.x - this.t) < 0.0008 * Math.max(1, Math.abs(this.t))) {
			this.x = this.t;
			this.v = 0;
			this.on?.(this.x);
			this.raf = 0;
		} else this.raf = requestAnimationFrame(this.step);
	};
	stop() {
		cancelAnimationFrame(this.raf);
		this.raf = 0;
	}
}
