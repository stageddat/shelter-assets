<!--
	Dev tool: shows the active Tailwind breakpoint in a corner. Pure CSS, 0 JS.
	Each site decides when to render it (only in dev), the library doesn't know the environment.
-->
<script lang="ts" module>
	export type BreakpointIndicatorProps = { class?: string };
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let { class: className }: BreakpointIndicatorProps = $props();
</script>

<div
	aria-hidden="true"
	class={cn(
		'pointer-events-none fixed bottom-2 left-2 z-50 rounded bg-black/80 px-2 py-1 font-mono text-base text-white select-none',
		className
	)}
>
	<span class="block sm:hidden">xs</span>
	<span class="hidden sm:block md:hidden">sm</span>
	<span class="hidden md:block lg:hidden">md</span>
	<span class="hidden lg:block xl:hidden">lg</span>
	<span class="hidden xl:block 2xl:hidden">xl</span>
	<span class="hidden 2xl:block">2xl</span>
</div>
