<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type AccordionTriggerProps = HTMLAttributes<HTMLElement> & {
		children: Snippet;
	};
</script>

<script lang="ts">
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: AccordionTriggerProps = $props();
</script>

<!-- a <summary> that isn't display: list-item has no marker; Safari still needs the -webkit- one hidden -->
<summary
	data-slot="accordion-trigger"
	class={cn(
		'relative flex cursor-pointer list-none items-start justify-between rounded-md border border-transparent py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground [&::-webkit-details-marker]:hidden',
		className
	)}
	{...restProps}
>
	{@render children()}
	<ChevronDownIcon
		data-slot="accordion-trigger-icon"
		class="pointer-events-none shrink-0 group-open/accordion-item:hidden"
	/>
	<ChevronUpIcon
		data-slot="accordion-trigger-icon"
		class="pointer-events-none hidden shrink-0 group-open/accordion-item:inline"
	/>
</summary>
