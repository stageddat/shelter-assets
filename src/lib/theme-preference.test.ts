import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { themes } from './themes.js';
import {
	applyThemePreference,
	getThemePreference,
	resolveThemePreference,
	setThemePreference,
	themeInitScript,
	themeStorageKey,
	watchThemePreference
} from './theme-preference.js';

const root = document.documentElement;

function rootState() {
	return {
		dark: root.classList.contains('dark'),
		dataTheme: root.dataset.theme,
		colorScheme: root.style.colorScheme,
		preference: root.dataset.themePreference
	};
}

function resetRoot() {
	root.classList.remove('dark');
	delete root.dataset.theme;
	root.style.colorScheme = '';
	delete root.dataset.themePreference;
}

function runInitScript() {
	new Function(themeInitScript)();
}

function mockSystemDark(dark: boolean) {
	const real = window.matchMedia.bind(window);
	vi.spyOn(window, 'matchMedia').mockImplementation((query) =>
		query === '(prefers-color-scheme: dark)'
			? ({ ...real(query), matches: dark, media: query } as MediaQueryList)
			: real(query)
	);
}

beforeEach(() => {
	localStorage.clear();
	resetRoot();
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('resolveThemePreference', () => {
	it('follows the system for "system"', () => {
		expect(resolveThemePreference('system', true)).toBe('dark');
		expect(resolveThemePreference('system', false)).toBe('light');
	});

	it('keeps a fixed theme whatever the system says', () => {
		expect(resolveThemePreference('mocha-lavender', false)).toBe('mocha-lavender');
		expect(resolveThemePreference('light', true)).toBe('light');
	});
});

describe('getThemePreference', () => {
	it('is "system" when nothing is saved', () => {
		expect(getThemePreference()).toBe('system');
	});

	it('ignores values that are not a theme', () => {
		localStorage.setItem(themeStorageKey, 'not-a-theme');
		expect(getThemePreference()).toBe('system');
	});

	it('returns the saved theme', () => {
		localStorage.setItem(themeStorageKey, 'mocha-lavender');
		expect(getThemePreference()).toBe('mocha-lavender');
	});
});

describe('setThemePreference', () => {
	it('saves the preference and applies the theme', () => {
		setThemePreference('mocha-lavender', { transition: 'instant' });
		expect(localStorage.getItem(themeStorageKey)).toBe('mocha-lavender');
		expect(rootState()).toEqual({
			dark: true,
			dataTheme: 'mocha-lavender',
			colorScheme: 'dark',
			preference: 'mocha-lavender'
		});
	});

	it('removes the previous data-theme when switching to a base theme', () => {
		setThemePreference('mocha-lavender', { transition: 'instant' });
		setThemePreference('light', { transition: 'instant' });
		expect(rootState()).toEqual({
			dark: false,
			dataTheme: undefined,
			colorScheme: 'light',
			preference: 'light'
		});
	});

	it('resolves "system" with the OS setting', () => {
		mockSystemDark(true);
		setThemePreference('system', { transition: 'instant' });
		expect(rootState().dark).toBe(true);
		// the preference stays 'system', not the theme it resolved to
		expect(rootState().preference).toBe('system');
	});
});

describe('themeInitScript', () => {
	// the inline script has its own copy of the logic, so it must give the same result
	it.each(['system', ...themes.map((theme) => theme.id)] as const)(
		'applies "%s" exactly like applyThemePreference',
		(preference) => {
			mockSystemDark(true);
			applyThemePreference(preference);
			const expected = rootState();
			resetRoot();

			localStorage.setItem(themeStorageKey, preference);
			runInitScript();
			expect(rootState()).toEqual(expected);
		}
	);

	it('follows the system when nothing is saved', () => {
		mockSystemDark(true);
		runInitScript();
		expect(rootState()).toEqual({
			dark: true,
			dataTheme: undefined,
			colorScheme: 'dark',
			preference: 'system'
		});
	});

	it('ignores unknown and tricky saved values', () => {
		mockSystemDark(false);
		for (const value of ['not-a-theme', 'constructor', '__proto__']) {
			localStorage.setItem(themeStorageKey, value);
			expect(runInitScript).not.toThrow();
			expect(rootState().colorScheme).toBe('light');
			expect(rootState().preference).toBe('system');
		}
	});

	it('still works when localStorage throws', () => {
		mockSystemDark(true);
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		expect(runInitScript).not.toThrow();
		expect(rootState().dark).toBe(true);
	});
});

describe('watchThemePreference', () => {
	it('applies a theme changed in another tab', () => {
		const onChange = vi.fn();
		const stop = watchThemePreference(onChange);

		// another tab saved a new theme: this tab only gets the storage event
		localStorage.setItem(themeStorageKey, 'dark');
		window.dispatchEvent(new StorageEvent('storage', { key: themeStorageKey }));

		expect(rootState().dark).toBe(true);
		expect(onChange).toHaveBeenCalledWith('dark');
		stop();
	});

	it('ignores changes to other keys', () => {
		const onChange = vi.fn();
		const stop = watchThemePreference(onChange);
		window.dispatchEvent(new StorageEvent('storage', { key: 'something-else' }));
		expect(onChange).not.toHaveBeenCalled();
		stop();
	});

	it('stops listening after cleanup', () => {
		const onChange = vi.fn();
		watchThemePreference(onChange)();
		window.dispatchEvent(new StorageEvent('storage', { key: themeStorageKey }));
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('applyThemePreference', () => {
	it('does not save anything', () => {
		applyThemePreference('dark');
		expect(localStorage.getItem(themeStorageKey)).toBeNull();
		expect(rootState().dark).toBe(true);
	});
});
