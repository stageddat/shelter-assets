import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import Fixture from './accordion.test.svelte';

let component: ReturnType<typeof mount> | undefined;

function render(type?: 'single' | 'multiple') {
	component = mount(Fixture, { target: document.body, props: { type } });
	flushSync();
}

const item = (name: string) =>
	document.querySelector<HTMLDetailsElement>(`[data-testid="${name}"]`)!;
const toggle = (name: string) => item(name).querySelector('summary')!.click();

afterEach(() => {
	if (component) unmount(component);
	component = undefined;
});

describe('Accordion', () => {
	it('starts closed and opens an item when its trigger is clicked', () => {
		render();
		expect(item('one').open).toBe(false);
		toggle('one');
		expect(item('one').open).toBe(true);
		toggle('one');
		expect(item('one').open).toBe(false);
	});

	it('single: opening an item closes the open one', () => {
		render('single');
		toggle('one');
		toggle('two');
		expect(item('one').open).toBe(false);
		expect(item('two').open).toBe(true);
	});

	it('multiple: items open on their own', () => {
		render('multiple');
		toggle('one');
		toggle('two');
		expect(item('one').open).toBe(true);
		expect(item('two').open).toBe(true);
		expect(item('one').name).toBe('');
	});

	it('gives each single accordion its own name, so two on a page stay independent', () => {
		render('single');
		const first = item('one').name;
		const second = mount(Fixture, { target: document.body });
		flushSync();
		const names = [...document.querySelectorAll('details')].map((details) => details.name);
		unmount(second);

		expect(first).not.toBe('');
		expect(new Set(names).size).toBe(2);
	});
});
