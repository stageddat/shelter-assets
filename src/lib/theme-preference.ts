// Remembers the theme the user picked and applies it, in any site (Svelte, Astro, plain HTML).
// The preference is one value: a theme id ('dark', 'mocha-lavender'...) or 'system',
// which follows the OS light/dark setting.

import { applyTheme, themes, type ThemeId } from './themes.js';

/** localStorage key that holds the preference */
export const themeStorageKey = 'shelter-theme';

export type ThemePreference = ThemeId | 'system';

export const defaultThemePreference: ThemePreference = 'system';

const darkQuery = '(prefers-color-scheme: dark)';

export function isThemePreference(value: unknown): value is ThemePreference {
	return value === 'system' || themes.some((theme) => theme.id === value);
}

/** The theme a preference means right now: 'system' becomes 'light' or 'dark' */
export function resolveThemePreference(preference: ThemePreference, prefersDark: boolean): ThemeId {
	if (preference !== 'system') return preference;
	return prefersDark ? 'dark' : 'light';
}

/** The saved preference, or the default if there is none (or storage is blocked) */
export function getThemePreference(): ThemePreference {
	try {
		const saved = localStorage.getItem(themeStorageKey);
		return isThemePreference(saved) ? saved : defaultThemePreference;
	} catch {
		// private windows and blocked site data can make localStorage throw
		return defaultThemePreference;
	}
}

export type ThemeTransition = 'fade' | 'instant';

/** Saves the preference and applies it to the page */
export function setThemePreference(
	preference: ThemePreference,
	{ transition = 'fade' }: { transition?: ThemeTransition } = {}
) {
	try {
		localStorage.setItem(themeStorageKey, preference);
	} catch {
		// still apply it, it just won't be remembered
	}
	applyThemePreference(preference, transition);
}

/** Applies a preference to the page without saving it */
export function applyThemePreference(
	preference: ThemePreference,
	transition: ThemeTransition = 'instant'
) {
	const theme = resolveThemePreference(preference, matchMedia(darkQuery).matches);
	const apply = () => withoutCssTransitions(() => applyTheme(theme));

	const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (transition === 'fade' && !reducedMotion && document.startViewTransition) {
		// the browser crossfades a snapshot of the old page into the new one,
		// so everything changes at the same pace
		document.startViewTransition(apply);
	} else {
		apply();
	}
}

/**
 * Keeps the page in sync while it is open:
 * - another tab changes the theme (the `storage` event only fires in the *other* tabs)
 * - the OS switches light/dark, when the preference is 'system'
 * Returns a function that stops listening.
 */
export function watchThemePreference(onChange?: (preference: ThemePreference) => void) {
	const media = matchMedia(darkQuery);

	const onStorage = (event: StorageEvent) => {
		// key is null when the whole storage is cleared
		if (event.key !== null && event.key !== themeStorageKey) return;
		const preference = getThemePreference();
		applyThemePreference(preference);
		onChange?.(preference);
	};

	const onSystemChange = () => {
		const preference = getThemePreference();
		if (preference === 'system') applyThemePreference(preference, 'fade');
	};

	window.addEventListener('storage', onStorage);
	media.addEventListener('change', onSystemChange);
	return () => {
		window.removeEventListener('storage', onStorage);
		media.removeEventListener('change', onSystemChange);
	};
}

// Components with `transition` (like Button) would animate to the new colors at their own
// pace while the rest changes at once. Turning transitions off for one frame avoids that.
function withoutCssTransitions(change: () => void) {
	const style = document.createElement('style');
	style.textContent = '*,*::before,*::after{transition:none!important}';
	document.head.appendChild(style);
	change();
	// reading a computed style forces the browser to apply the new colors now, without transitions
	void getComputedStyle(document.documentElement).color;
	requestAnimationFrame(() => style.remove());
}

// Same as applyThemePreference(getThemePreference()), as a tiny standalone script for <head>.
// It must run before the page is painted, so the first frame already has the right theme
// (otherwise dark themes flash white on load). It can't import anything, so the theme list
// is written into it here, and theme-preference.test.ts checks it matches applyTheme.
const themeData = Object.fromEntries(
	themes.map((theme) => [theme.id, [theme.scheme, theme.dataTheme]])
);

/** Put it inline and first in <head>: `<script>{themeInitScript}</script>` */
export const themeInitScript = `(function () {
	var themes = ${JSON.stringify(themeData)};
	var preference = null;
	try { preference = localStorage.getItem(${JSON.stringify(themeStorageKey)}); } catch (e) {}
	var id = Object.prototype.hasOwnProperty.call(themes, preference)
		? preference
		: matchMedia(${JSON.stringify(darkQuery)}).matches ? 'dark' : 'light';
	var root = document.documentElement;
	root.classList.toggle('dark', themes[id][0] === 'dark');
	root.style.colorScheme = themes[id][0];
	if (themes[id][1]) root.dataset.theme = themes[id][1];
})();`;
