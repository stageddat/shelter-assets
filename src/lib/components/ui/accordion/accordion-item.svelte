<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLDetailsAttributes } from 'svelte/elements';

	export type AccordionItemProps = HTMLDetailsAttributes & {
		/** Trigger first, then Content */
		children: Snippet;
	};
</script>

<script lang="ts">
	import { getContext } from 'svelte';
	import { cn } from '$lib/utils.js';
	import { accordionContextKey, type AccordionContext } from './context.js';

	let {
		open = $bindable(false),
		class: className,
		children,
		...restProps
	}: AccordionItemProps = $props();

	// Svelte context doesn't cross Astro components: an Accordion put together in a .astro file
	// doesn't reach its items, so there a `single` accordion needs the same `name` on each item
	// (it comes in restProps and wins over this one)
	const accordion = getContext<AccordionContext | undefined>(accordionContextKey);
</script>

<details
	bind:open
	data-slot="accordion-item"
	name={accordion?.name}
	class={cn('accordion-item group/accordion-item not-last:border-b', className)}
	{...restProps}
>
	{@render children()}
</details>

<style>
	/*
	 * Open and close with the same 0.2s ease-out as the shadcn one. Needs ::details-content and
	 * interpolate-size (to animate up to `auto`); without them the item opens with no animation.
	 */
	@supports selector(::details-content) {
		.accordion-item {
			interpolate-size: allow-keywords;
		}
		.accordion-item::details-content {
			block-size: 0;
			overflow: hidden;
			transition:
				block-size 0.2s ease-out,
				content-visibility 0.2s ease-out allow-discrete;
		}
		.accordion-item[open]::details-content {
			block-size: auto;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.accordion-item::details-content {
			transition: none;
		}
	}
</style>
