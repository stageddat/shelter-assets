import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { themeInitScript, themeStorageKey } from '../../../theme-preference.js';
import { initThemeSelectors } from './init-theme-selectors.js';
import ThemeSelector from './theme-selector.svelte';

const root = document.documentElement;
let component: ReturnType<typeof mount> | undefined;

function renderSelector() {
	component = mount(ThemeSelector, { target: document.body, props: { labels: { dark: 'fosc' } } });
	flushSync();
}

const option = (preference: string) =>
	document.querySelector<HTMLButtonElement>(`[data-theme-option="${preference}"]`)!;
const isChecked = (preference: string) =>
	getComputedStyle(option(preference).querySelector('[data-theme-check]')!).visibility ===
	'visible';
const visibleLabels = () =>
	[...document.querySelectorAll<HTMLElement>('[data-theme-label]')]
		.filter((label) => getComputedStyle(label).display !== 'none')
		.map((label) => label.textContent);

beforeEach(() => {
	localStorage.clear();
	root.classList.remove('dark');
	delete root.dataset.theme;
	delete root.dataset.themePreference;
});

afterEach(() => {
	if (component) unmount(component);
	component = undefined;
	initThemeSelectors()();
});

describe('ThemeSelector', () => {
	it('marks the saved theme with CSS alone, before any JavaScript runs', () => {
		localStorage.setItem(themeStorageKey, 'mocha-lavender');
		new Function(themeInitScript)();
		renderSelector();
		initThemeSelectors()(); // turn the script off: only CSS is left

		expect(isChecked('mocha-lavender')).toBe(true);
		expect(isChecked('system')).toBe(false);
		expect(visibleLabels()).toEqual(['Mocha Lavender']);
	});

	it('uses the translated labels it is given', () => {
		root.dataset.themePreference = 'dark';
		renderSelector();
		expect(visibleLabels()).toEqual(['fosc']);
	});

	it('applies and saves the clicked option', async () => {
		renderSelector();
		option('dark').click();

		expect(localStorage.getItem(themeStorageKey)).toBe('dark');
		// the theme changes inside a fade (view transition), a moment later
		await vi.waitFor(() => expect(root.classList.contains('dark')).toBe(true));
		expect(isChecked('dark')).toBe(true);
	});

	it('closes the menu after picking', () => {
		renderSelector();
		const panel = document.querySelector<HTMLElement>('[popover]')!;
		panel.showPopover();
		option('light').click();
		expect(panel.matches(':popover-open')).toBe(false);
	});

	it('keeps aria-pressed in sync for screen readers', async () => {
		renderSelector();
		option('dark').click();
		await vi.waitFor(() => expect(option('dark').getAttribute('aria-pressed')).toBe('true'));
		expect(option('light').getAttribute('aria-pressed')).toBe('false');

		// changed from elsewhere (another tab, watchThemePreference): the observer catches it
		root.dataset.themePreference = 'light';
		await vi.waitFor(() => expect(option('light').getAttribute('aria-pressed')).toBe('true'));
	});
});
