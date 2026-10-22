// The only JavaScript a ThemeSelector needs: picking an option and moving around the menu with
// the keyboard. Plain DOM code, so the same function works in a Svelte app and on a static page
// (Astro renders the selector to HTML with no Svelte in the browser). Which option looks selected
// is CSS (see theme-selector.svelte), so it is right from the first frame, before this runs.
//
// Keyboard follows the WAI-ARIA menu button pattern: opening moves focus to the checked option,
// arrows move it (and wrap), Home/End jump to the ends, Tab closes the menu. Escape and the click
// outside are the browser's (Popover API), which also gives focus back to the button.

import { isThemePreference, setThemePreference } from '../../../theme-preference.js';

const menuSelector = '[data-theme-menu]';
const optionSelector = '[data-theme-option]';

let stop: (() => void) | undefined;

const optionsOf = (menu: Element) => [...menu.querySelectorAll<HTMLElement>(optionSelector)];

// screen readers can't see the CSS check mark, so the state also goes in aria-checked. The
// checked option is also the one Tab reaches (the inline variant is a radio group; in the
// popover menu focus is moved by onToggle instead)
function syncChecked() {
	const current = document.documentElement.dataset.themePreference;
	for (const option of document.querySelectorAll(optionSelector)) {
		const checked = option.getAttribute('data-theme-option') === current;
		option.setAttribute('aria-checked', String(checked));
		option.setAttribute('tabindex', checked ? '0' : '-1');
	}
}

function onClick(event: MouseEvent) {
	const option = event.target instanceof Element ? event.target.closest(optionSelector) : null;
	const preference = option?.getAttribute('data-theme-option');
	if (!option || !isThemePreference(preference)) return;
	// close the menu first, so the theme fade doesn't capture it open
	option.closest<HTMLElement>('[popover]')?.hidePopover();
	const inline = option.closest('details');
	if (inline) inline.open = false;
	setThemePreference(preference);
}

// opening the popover menu moves focus into it (menu button pattern). Only popovers: the inline
// variant's <details> also fires `toggle`, but there focus stays on its button.
// `toggle` doesn't bubble: this listens in the capture phase
function onToggle(event: Event) {
	if (!(event instanceof ToggleEvent) || event.newState !== 'open') return;
	const popover = event.target instanceof HTMLElement && event.target.popover ? event.target : null;
	const menu = popover?.querySelector(menuSelector);
	if (!menu) return;
	const options = optionsOf(menu);
	(options.find((option) => option.ariaChecked === 'true') ?? options[0])?.focus();
}

const moves: Record<string, (index: number, count: number) => number> = {
	ArrowDown: (index, count) => (index + 1) % count,
	ArrowUp: (index, count) => (index - 1 + count) % count,
	Home: () => 0,
	End: (_, count) => count - 1
};

function onKeydown(event: KeyboardEvent) {
	const option = event.target instanceof HTMLElement ? event.target.closest(optionSelector) : null;
	const menu = option?.closest(menuSelector);
	if (!option || !menu) return;

	if (event.key === 'Tab') {
		// focus goes back to the button, and Tab carries on from there
		option.closest<HTMLElement>('[popover]')?.hidePopover();
		return;
	}

	const move = moves[event.key];
	if (!move) return;
	event.preventDefault();
	const options = optionsOf(menu);
	options[move(options.indexOf(option as HTMLElement), options.length)]?.focus();
}

/**
 * Makes every ThemeSelector on the page work, including ones added later (listeners on the
 * document). Safe to call more than once. Returns a function that stops it (for tests).
 */
export function initThemeSelectors() {
	syncChecked();
	if (stop) return stop;

	// the preference can also change from another tab or the OS (watchThemePreference)
	const observer = new MutationObserver(syncChecked);
	observer.observe(document.documentElement, { attributeFilter: ['data-theme-preference'] });
	document.addEventListener('click', onClick);
	document.addEventListener('keydown', onKeydown);
	document.addEventListener('toggle', onToggle, true);

	stop = () => {
		observer.disconnect();
		document.removeEventListener('click', onClick);
		document.removeEventListener('keydown', onKeydown);
		document.removeEventListener('toggle', onToggle, true);
		stop = undefined;
	};
	return stop;
}
