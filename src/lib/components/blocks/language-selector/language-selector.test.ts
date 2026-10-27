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

	it('inline variant: the same links unfold in place, with no popover', () => {
		component = mount(LanguageSelector, {
			target: document.body,
			props: { current: 'ca', languages, variant: 'inline' }
		});
		flushSync();
		expect(document.querySelector('[popover]')).toBeNull();
		const details = document.querySelector('details')!;
		expect(details.querySelector('summary')?.textContent).toContain('català');
		expect([...details.querySelectorAll('a')].map((link) => link.lang)).toEqual(['en', 'ca', 'es']);
	});

	it('without href: options are buttons that call onselect and close the list', () => {
		const chosen: string[] = [];
		component = mount(LanguageSelector, {
			target: document.body,
			props: {
				current: 'ca',
				languages: languages.map((language) => ({ ...language, href: undefined })),
				onselect: (locale: string) => chosen.push(locale)
			}
		});
		flushSync();
		expect(document.querySelector('a')).toBeNull();
		const panel = document.querySelector<HTMLElement>('[popover]')!;
		panel.showPopover();
		const buttons = [...panel.querySelectorAll('button')];
		expect(buttons.map((button) => button.lang)).toEqual(['en', 'ca', 'es']);
		expect(panel.querySelector('[aria-current]')?.getAttribute('lang')).toBe('ca');

		buttons[2].click();
		expect(chosen).toEqual(['es']);
		expect(panel.matches(':popover-open')).toBe(false);
	});
});
