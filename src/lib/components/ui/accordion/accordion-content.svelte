<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type AccordionContentProps = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: AccordionContentProps = $props();
</script>

<!-- like shadcn, `class` goes on the inner div -->
<div data-slot="accordion-content" class="overflow-hidden text-base" {...restProps}>
	<div class={cn('pt-0 pb-4 [&_a]:link [&_p:not(:last-child)]:mb-4', className)}>
		{@render children()}
	</div>
</div>
