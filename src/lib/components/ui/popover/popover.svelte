<!--
	A button that opens a floating panel, with no JavaScript: the browser's Popover API
	(`popovertarget` + `popover`) opens and closes it, closes it on Escape and on a click outside,
	and puts it above everything else. CSS anchor positioning places it under the button.
-->
<script lang="ts" module>
	import type { Snippet } from 'svelte';

	export type PopoverAlign = 'start' | 'end';

	export type PopoverProps = {
		/** Content of the button that opens the panel */
		trigger: Snippet;
		/** Content of the panel */
		children: Snippet;
		/** Which edge of the button the panel lines up with */
		align?: PopoverAlign;
		class?: string;
		panelClass?: string;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button } from '../button/index.js';

	let { trigger, children, align = 'end', class: className, panelClass }: PopoverProps = $props();

	// unique per instance and the same in the server HTML and in the browser
	const id = $props.id();
	const panelId = `popover-${id}`;
	const anchorName = `--popover-${id}`;
</script>

<div class={cn('popover-root', className)}>
	<Button variant="outline" popovertarget={panelId} style="anchor-name: {anchorName}">
		{@render trigger()}
	</Button>
	<div
		id={panelId}
		popover="auto"
		data-align={align}
		style="position-anchor: {anchorName}"
		class={cn(
			'popover-panel min-w-44 rounded-(--radius) border bg-popover p-1 text-popover-foreground shadow-md',
			panelClass
		)}
	>
		{@render children()}
	</div>
</div>

<style>
	.popover-root {
		display: contents;
	}

	/*
	 * Without anchor positioning the browser's default applies: the panel is centered on the
	 * screen, like a small dialog. It still works, just not under the button.
	 */
	@supports (position-area: bottom) {
		.popover-panel {
			margin: 0.5rem 0 0;
			position-area: bottom span-left;
			/* no room below (e.g. near the bottom of the screen): open above */
			position-try-fallbacks: flip-block;
		}
		.popover-panel[data-align='start'] {
			position-area: bottom span-right;
		}
	}

	/*
	 * Browsers without the Popover API (before 2023-2024) would show the panel always open, inside
	 * the page. Hiding the whole control is cleaner: the page keeps working without it.
	 */
	@supports not selector(:popover-open) {
		.popover-root {
			display: none;
		}
	}
</style>
