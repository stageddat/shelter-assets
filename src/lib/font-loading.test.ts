import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fontCaltStorageKey, fontInitScript } from './font-loading.js';

const root = document.documentElement;

function mockConnection(connection: object | undefined) {
	// navigator.connection isn't in TypeScript's types: it only exists in Chromium
	const prototype = Navigator.prototype as unknown as { connection: object | undefined };
	vi.spyOn(prototype, 'connection', 'get').mockReturnValue(connection);
}

// runs the script and returns its 'load' handler, so each test triggers only its own
function runInitScript() {
	let onLoad: (() => void) | undefined;
	vi.spyOn(window, 'addEventListener').mockImplementation((type, listener) => {
		if (type === 'load') onLoad = listener as () => void;
	});
	new Function(fontInitScript)();
	vi.mocked(window.addEventListener).mockRestore();
	return onLoad;
}

function mockFontsLoad(faces: FontFace[]) {
	return vi.spyOn(document.fonts, 'load').mockResolvedValue(faces);
}

// the download waits for an idle moment; here it happens right away
function runIdleCallbacksNow() {
	vi.spyOn(window, 'requestIdleCallback').mockImplementation((callback) => {
		callback({ didTimeout: false, timeRemaining: () => 50 });
		return 0;
	});
}

beforeEach(() => {
	localStorage.clear();
	delete root.dataset.font;
	mockConnection({ downlink: 1.5, rtt: 300, saveData: false });
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe('fontInitScript', () => {
	it('starts with the light font on a first visit', () => {
		runInitScript();
		expect(root.dataset.font).toBeUndefined();
	});

	it('uses calt when it was downloaded before', () => {
		localStorage.setItem(fontCaltStorageKey, '1');
		runInitScript();
		expect(root.dataset.font).toBe('calt');
	});

	it('tries calt on a first visit with a fast connection', () => {
		mockConnection({ downlink: 10, rtt: 50, saveData: false });
		runInitScript();
		expect(root.dataset.font).toBe('calt');
	});

	it('uses the light font when the connection is unknown (Firefox, Safari)', () => {
		mockConnection(undefined);
		expect(runInitScript).not.toThrow();
		expect(root.dataset.font).toBeUndefined();
	});

	it('does nothing with data saver on, even if calt was downloaded', () => {
		localStorage.setItem(fontCaltStorageKey, '1');
		mockConnection({ downlink: 10, rtt: 50, saveData: true });
		const onLoad = runInitScript();
		expect(root.dataset.font).toBeUndefined();
		expect(onLoad).toBeUndefined();
	});

	it('still works when localStorage throws', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		expect(runInitScript).not.toThrow();
		expect(root.dataset.font).toBeUndefined();
	});
});

describe('fontInitScript download', () => {
	it('downloads calt a while after the page loads and remembers it', async () => {
		runIdleCallbacksNow();
		const load = mockFontsLoad([new FontFace('Playpen Sans Calt', 'url(x)')]);
		const onLoad = runInitScript();

		vi.useFakeTimers({ toFake: ['setTimeout'] });
		onLoad?.();
		await document.fonts.ready;
		expect(load).not.toHaveBeenCalled();
		vi.advanceTimersByTime(2000);
		vi.useRealTimers();
		expect(load).toHaveBeenCalledWith('1em "Playpen Sans Calt"', expect.any(String));

		await vi.waitFor(() => expect(localStorage.getItem(fontCaltStorageKey)).toBe('1'));
		// the current page doesn't change
		expect(root.dataset.font).toBeUndefined();
	});

	it("doesn't remember it when nothing was downloaded", async () => {
		runIdleCallbacksNow();
		const load = mockFontsLoad([]);
		const onLoad = runInitScript();

		vi.useFakeTimers({ toFake: ['setTimeout'] });
		onLoad?.();
		await document.fonts.ready;
		vi.advanceTimersByTime(2000);
		vi.useRealTimers();
		expect(load).toHaveBeenCalled();
		await Promise.resolve();
		expect(localStorage.getItem(fontCaltStorageKey)).toBeNull();
	});
});
