<script lang="ts" module>
	import type { ThemePreference } from '../../../theme-preference.js';
	import type { PopoverAlign } from '../../ui/popover/index.js';

	export type ThemeSelectorProps = {
		/** Translated name of each option; missing ones use the English name */
		labels?: Partial<Record<ThemePreference, string>>;
		/** Translated name of the control, for screen readers ("theme") */
		label?: string;
		/**
		 * `popover`: a button that opens a floating menu. `inline`: the options unfold in place,
		 * pushing what's below (e.g. inside a mobile menu); takes the full width it's given
		 */
		variant?: 'popover' | 'inline';
		/** Which edge of the button the menu lines up with (`popover` only) */
		align?: PopoverAlign;
		class?: string;
	};
</script>

<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Palette from '@lucide/svelte/icons/palette';
	import { themePreferences } from '../../../theme-preference.js';
	import { getTheme } from '../../../themes.js';
	import { cn } from '$lib/utils.js';
	import { AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion/index.js';
	import { Popover } from '../../ui/popover/index.js';
	import { initThemeSelectors } from './init-theme-selectors.js';

	let {
		labels = {},
		label = 'theme',
		variant = 'popover',
		align = 'end',
		class: className
	}: ThemeSelectorProps = $props();

	function nameOf(preference: ThemePreference) {
		return labels[preference] ?? (preference === 'system' ? 'system' : getTheme(preference).label);
	}

	// The HTML is the same for everyone (the landing is built once), but each visitor has their own
	// theme. themeInitScript writes it in <html data-theme-preference>, and these rules show the
	// matching name and check mark. One rule per option, built from the theme list. The defaults
	// (everything hidden) live here too, so it works without Tailwind's utilities.
	const selectedStyles =
		'[data-theme-label]{display:none}[data-theme-check]{visibility:hidden}' +
		themePreferences
			.map(
				(p) =>
					`html[data-theme-preference=${p}] [data-theme-label=${p}]{display:inline}` +
					`html[data-theme-preference=${p}] [data-theme-option=${p}] [data-theme-check]{visibility:visible}`
			)
			.join('');

	// in a Svelte app the selector works on its own; a static page calls initThemeSelectors() itself
	$effect(() => {
		initThemeSelectors();
	});
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- built above from the theme list, no user input -->
{@html `<style>${selectedStyles}</style>`}

{#snippet current()}
	<Palette />
	<span class="sr-only">{label}:</span>
	{#each themePreferences as preference (preference)}
		<span data-theme-label={preference}>{nameOf(preference)}</span>
	{/each}
{/snippet}

<!-- keyboard (arrows, Home/End, Tab) and aria-checked come from initThemeSelectors -->
{#snippet options(inline: boolean)}
	<div
		role={inline ? 'radiogroup' : 'menu'}
		aria-label={label}
		data-theme-menu
		class="flex flex-col"
	>
		{#each themePreferences as preference (preference)}
			<button
				type="button"
				role={inline ? 'radio' : 'menuitemradio'}
				aria-checked="false"
				tabindex="-1"
				data-theme-option={preference}
				class="flex items-center gap-2 rounded-sm px-3 py-2 text-left outline-none hover:bg-accent focus-visible:bg-accent"
			>
				<Check data-theme-check aria-hidden="true" class="size-4" />
				{nameOf(preference)}
			</button>
		{/each}
	</div>
{/snippet}

{#if variant === 'inline'}
	<AccordionItem class={cn('w-full rounded-button border px-3', className)}>
		<AccordionTrigger
			class="items-center gap-2 py-2.5 text-base hover:no-underline [&_svg:not([data-slot])]:size-4"
		>
			<span class="flex items-center gap-2">{@render current()}</span>
		</AccordionTrigger>
		<AccordionContent class="pb-2 text-base">{@render options(true)}</AccordionContent>
	</AccordionItem>
{:else}
	<Popover haspopup="menu" {align} class={className}>
		{#snippet trigger()}
			{@render current()}
		{/snippet}
		{@render options(false)}
	</Popover>
{/if}
