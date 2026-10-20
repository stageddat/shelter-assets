<!--
	An accordion on native <details>, with no JavaScript: the browser opens and closes each item,
	handles the keyboard and screen readers, and opens a closed item when find-in-page matches its
	text. Same parts and look as the shadcn one (bits-ui), which is the one to use where the page is
	hydrated anyway (the app) and something needs its JS (a bound `value`, controlled state).
-->
<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type AccordionType = 'single' | 'multiple';

	export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
		/** `single`: opening an item closes the others. `multiple`: each item opens on its own */
		type?: AccordionType;
		children: Snippet;
	};
</script>

<script lang="ts">
	import { setContext } from 'svelte';
	import { cn } from '$lib/utils.js';
	import { accordionContextKey, type AccordionContext } from './context.js';

	let { type = 'single', class: className, children, ...restProps }: AccordionProps = $props();

	// unique per instance and the same in the server HTML and in the browser
	const id = $props.id();

	// `single` is the browser's exclusive accordion: <details> sharing a `name` close each other
	setContext<AccordionContext>(accordionContextKey, {
		get name() {
			return type === 'single' ? `accordion-${id}` : undefined;
		}
	});
</script>

<div data-slot="accordion" class={cn('flex w-full flex-col', className)} {...restProps}>
	{@render children()}
</div>
