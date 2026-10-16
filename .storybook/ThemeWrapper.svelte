<!--
	crea un elemento html que hace un wrap a los elementos del showcase
	para evitar poner el tema en el html general
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getTheme } from '../src/lib/themes.js';

	let {
		theme,
		fill = false,
		children
	}: { theme: string; fill?: boolean; children?: Snippet } = $props();

	const selected = $derived(getTheme(theme));
</script>

<div
	class="shelter-theme"
	class:fill
	class:dark={selected.scheme === 'dark'}
	data-theme={selected.dataTheme || undefined}
	style:color-scheme={selected.scheme}
>
	{@render children?.()}
</div>

<style>
	.shelter-theme {
		background: var(--background);
		color: var(--foreground);
		font-family: var(--font-sans);
		padding: 1rem;
		border-radius: var(--radius);
	}
	.fill {
		min-height: 100vh;
		border-radius: 0;
	}
	:global(body ::selection) {
		background: Highlight;
		color: HighlightText;
	}
	.shelter-theme :global(::selection) {
		background: var(--selection);
		color: var(--foreground);
	}
</style>
