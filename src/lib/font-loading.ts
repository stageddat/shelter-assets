// Decides when the page can use 'Playpen Sans Calt' (see styles/fonts.css).
// The calt files are 3x heavier, so the first visit uses the light ones and downloads the calt
// ones when the browser is idle. Later page loads find them cached and use them from the start.
// The font never changes while the page is shown, so it doesn't cause layout shift (CLS).

/** localStorage key that remembers the calt files were downloaded (so they are likely cached) */
export const fontCaltStorageKey = 'shelter-font-calt';

// Connections fast enough to try the calt files on the first visit (~133 KB in ~100ms).
// Only Chromium has navigator.connection; elsewhere this is never true.
const fastDownlinkMbps = 5;
const fastRttMs = 100;

// how long the calt download waits after the page is loaded
const downloadDelayMs = 2000;

/**
 * Put it inline in <head>, like themeInitScript: `<script>{fontInitScript}</script>`
 * - calt files downloaded before, or a fast connection: use them right away. Their
 *   `font-display: optional` makes the browser skip them if they aren't ready in ~100ms
 *   (evicted from the cache, slower than expected), so the worst case is the light font.
 * - after the page loads, when the browser is idle: download them for the next page load.
 * - data saver on: never download them.
 */
export const fontInitScript = `(function () {
	var connection = navigator.connection || {};
	if (connection.saveData) return;
	var key = ${JSON.stringify(fontCaltStorageKey)};
	var cached = false;
	try { cached = localStorage.getItem(key) === '1'; } catch (e) {}
	var fast = connection.downlink >= ${fastDownlinkMbps} && connection.rtt <= ${fastRttMs};
	if (cached || fast) document.documentElement.dataset.font = 'calt';

	function download() {
		// the text decides which files are needed (latin, cyrillic...) through their unicode-range.
		// innerText only has the visible text: "русский" in a closed language menu shouldn't
		// download the cyrillic file
		document.fonts.load('1em "Playpen Sans Calt"', document.body.innerText || ' ').then(
			function (faces) {
				if (!faces.length) return;
				try { localStorage.setItem(key, '1'); } catch (e) {}
			},
			function () {}
		);
	}
	// 'load' can fire before the first paint on fast connections, so it also waits for the fonts
	// in use and a few seconds, so it never competes with what the page needs first
	addEventListener('load', function () {
		document.fonts.ready.then(function () {
			setTimeout(function () {
				(window.requestIdleCallback || setTimeout)(download);
			}, ${downloadDelayMs});
		});
	});
})();`;
