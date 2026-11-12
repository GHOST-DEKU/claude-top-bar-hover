// Dark is the default. The saved choice is applied before first paint by a tiny script in app.html.
export const theme = $state({ value: 'dark' });

export function initTheme() {
	theme.value = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function setTheme(v) {
	theme.value = v;
	document.documentElement.dataset.theme = v === 'light' ? 'light' : '';
	if (v !== 'light') delete document.documentElement.dataset.theme;
	document.querySelector('meta[name="theme-color"]')?.setAttribute('content', v === 'light' ? '#ffffff' : '#1c1e20');
	try { localStorage.setItem('tbh-theme', v); } catch (e) {}
}
