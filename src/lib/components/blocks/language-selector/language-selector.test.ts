import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import LanguageSelector, { type LanguageOption } from './language-selector.svelte';

const languages: LanguageOption[] = [
	{ locale: 'en', label: 'english', href: '/', official: true },
	{ locale: 'ca', label: 'català', href: '/ca/', official: true },
	{ locale: 'es', label: 'español', href: '/es/', official: false }
];

let component: ReturnType<typeof mount> | undefined;

function renderSelector(props: Partial<{ current: string; languages: LanguageOption[] }> = {}) {
	component = mount(LanguageSelector, {
		target: document.body,
		props: { current: 'ca', languages, ...props }
	});
	flushSync();
}

afterEach(() => {
	if (component) unmount(component);
	component = undefined;
});

describe('LanguageSelector', () => {
	it('links every language to its page', () => {
		renderSelector();
		const links = [...document.querySelectorAll('a')];
		expect(links.map((link) => [link.lang, link.getAttribute('href')])).toEqual([
			['en', '/'],
			['ca', '/ca/'],
			['es', '/es/']
		]);
	});

	it('marks the current language', () => {
		renderSelector();
		expect(document.querySelector('[aria-current="page"]')?.getAttribute('lang')).toBe('ca');
		expect(document.querySelector('[popovertarget]')?.textContent).toContain('català');
	});

	it('groups official and community translations, and hides empty groups', () => {
		renderSelector();
		expect([...document.querySelectorAll('p')].map((p) => p.textContent)).toEqual([
			'official translations',
			'community translations'
		]);
		unmount(component!);

		renderSelector({ languages: languages.filter((l) => l.official) });
		expect([...document.querySelectorAll('p')].map((p) => p.textContent)).toEqual([
			'official translations'
		]);
	});

	it('names each list with its group title, for screen readers', () => {
		renderSelector();
		const names = [...document.querySelectorAll('ul')].map(
			(list) => document.getElementById(list.getAttribute('aria-labelledby')!)?.textContent
		);
		expect(names).toEqual(['official translations', 'community translations']);
	});
});
