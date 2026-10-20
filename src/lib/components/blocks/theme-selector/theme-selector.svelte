<script lang="ts" module>
	import type { ThemePreference } from '../../../theme-preference.js';
	import type { PopoverAlign } from '../../ui/popover/index.js';

	export type ThemeSelectorProps = {
		/** Translated name of each option; missing ones use the English name */
		labels?: Partial<Record<ThemePreference, string>>;
		/** Translated name of the control, for screen readers ("Theme") */
		label?: string;
		align?: PopoverAlign;
		class?: string;
	};
</script>

<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Palette from '@lucide/svelte/icons/palette';
	import { themePreferences } from '../../../theme-preference.js';
	import { getTheme } from '../../../themes.js';
	import { Popover } from '../../ui/popover/index.js';
	import { initThemeSelectors } from './init-theme-selectors.js';

	let {
		labels = {},
		label = 'Theme',
		align = 'end',
		class: className
	}: ThemeSelectorProps = $props();

	function nameOf(preference: ThemePreference) {
		return labels[preference] ?? (preference === 'system' ? 'System' : getTheme(preference).label);
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

<Popover {align} class={className}>
	{#snippet trigger()}
		<Palette />
		<span class="sr-only">{label}:</span>
		{#each themePreferences as preference (preference)}
			<span data-theme-label={preference}>{nameOf(preference)}</span>
		{/each}
	{/snippet}

	<div role="group" aria-label={label} class="flex flex-col">
		{#each themePreferences as preference (preference)}
			<button
				type="button"
				data-theme-option={preference}
				class="flex items-center gap-2 rounded-sm px-3 py-2 text-left hover:bg-accent"
			>
				<Check data-theme-check aria-hidden="true" class="size-4" />
				{nameOf(preference)}
			</button>
		{/each}
	</div>
</Popover>
