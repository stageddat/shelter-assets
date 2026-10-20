// The only JavaScript a ThemeSelector needs: picking an option. Plain DOM code, so the same
// function works in a Svelte app and on a static page (Astro renders the selector to HTML with
// no Svelte in the browser). Which option looks selected is CSS (see theme-selector.svelte),
// so it is right from the first frame, before this runs.

import { isThemePreference, setThemePreference } from '../../../theme-preference.js';

const optionSelector = '[data-theme-option]';

let stop: (() => void) | undefined;

// screen readers can't see the CSS check mark, so the state also goes in aria-pressed
function syncPressed() {
	const current = document.documentElement.dataset.themePreference;
	for (const option of document.querySelectorAll(optionSelector)) {
		option.setAttribute(
			'aria-pressed',
			String(option.getAttribute('data-theme-option') === current)
		);
	}
}

function onClick(event: MouseEvent) {
	const option = event.target instanceof Element ? event.target.closest(optionSelector) : null;
	const preference = option?.getAttribute('data-theme-option');
	if (!option || !isThemePreference(preference)) return;
	// close the menu first, so the theme fade doesn't capture it open
	option.closest<HTMLElement>('[popover]')?.hidePopover();
	setThemePreference(preference);
}

/**
 * Makes every ThemeSelector on the page work, including ones added later (one listener on the
 * document). Safe to call more than once. Returns a function that stops it (for tests).
 */
export function initThemeSelectors() {
	syncPressed();
	if (stop) return stop;

	// the preference can also change from another tab or the OS (watchThemePreference)
	const observer = new MutationObserver(syncPressed);
	observer.observe(document.documentElement, { attributeFilter: ['data-theme-preference'] });
	document.addEventListener('click', onClick);

	stop = () => {
		observer.disconnect();
		document.removeEventListener('click', onClick);
		stop = undefined;
	};
	return stop;
}
