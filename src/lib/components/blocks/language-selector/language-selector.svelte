<!--
	Language menu with no JavaScript: every option is a link to the same page in another language.
	It doesn't know about any i18n library; each site passes its languages, links and texts.
-->
<script lang="ts" module>
	import type { PopoverAlign } from '../../ui/popover/index.js';

	export type LanguageOption = {
		/** BCP 47 code: 'en', 'es'... */
		locale: string;
		/** Name in its own language: 'english', 'español'... */
		label: string;
		/** The current page in this language */
		href: string;
		/** Translated by the team; the rest are translated by the community */
		official: boolean;
	};

	export type LanguageSelectorProps = {
		current: string;
		languages: LanguageOption[];
		/** Translated texts; missing ones are in English */
		labels?: { language?: string; official?: string; community?: string };
		/**
		 * `popover`: a button that opens a floating list. `inline`: the list unfolds in place,
		 * pushing what's below (e.g. inside a mobile menu); takes the full width it's given
		 */
		variant?: 'popover' | 'inline';
		/** Which edge of the button the list lines up with (`popover` only) */
		align?: PopoverAlign;
		class?: string;
	};
</script>

<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Languages from '@lucide/svelte/icons/languages';
	import { cn } from '$lib/utils.js';
	import { AccordionItem, AccordionTrigger } from '../../ui/accordion/index.js';
	import { Popover } from '../../ui/popover/index.js';

	let {
		current,
		languages,
		labels = {},
		variant = 'popover',
		align = 'end',
		class: className
	}: LanguageSelectorProps = $props();

	const groups = $derived(
		[
			{
				title: labels.official ?? 'official translations',
				items: languages.filter((l) => l.official)
			},
			{
				title: labels.community ?? 'community translations',
				items: languages.filter((l) => !l.official)
			}
		].filter((group) => group.items.length > 0)
	);
	// unique per instance and the same in the server HTML and in the browser
	const id = $props.id();

	const currentLabel = $derived(languages.find((l) => l.locale === current)?.label ?? current);
</script>

{#snippet currentLanguage()}
	<Languages />
	<span class="sr-only">{labels.language ?? 'language'}:</span>
	<span lang={current}>{currentLabel}</span>
{/snippet}

{#snippet list()}
	{#each groups as group, i (group.title)}
		<!-- the title names its list for screen readers ("official translations, list, 3 items") -->
		<p id="{id}-group-{i}" class="px-3 pt-2 pb-1 text-xs text-muted-foreground">{group.title}</p>
		<ul aria-labelledby="{id}-group-{i}" class="mb-1">
			{#each group.items as language (language.locale)}
				<li>
					<a
						href={language.href}
						hreflang={language.locale}
						lang={language.locale}
						aria-current={language.locale === current ? 'page' : undefined}
						class="flex items-center gap-2 rounded-sm px-3 py-2 hover:bg-accent aria-[current=page]:font-semibold"
					>
						<Check
							aria-hidden="true"
							class={['size-4', language.locale !== current && 'invisible']}
						/>
						{language.label}
					</a>
				</li>
			{/each}
		</ul>
	{/each}
{/snippet}

{#if variant === 'inline'}
	<AccordionItem class={cn('w-full rounded-button border px-3', className)}>
		<AccordionTrigger
			class="items-center gap-2 py-2.5 text-base hover:no-underline [&_svg:not([data-slot])]:size-4"
		>
			<span class="flex items-center gap-2">{@render currentLanguage()}</span>
		</AccordionTrigger>
		<!-- not AccordionContent: it styles links as text links, and these are options -->
		<div class="pb-2 text-base">{@render list()}</div>
	</AccordionItem>
{:else}
	<Popover {align} class={className} panelClass="w-56">
		{#snippet trigger()}
			{@render currentLanguage()}
		{/snippet}
		{@render list()}
	</Popover>
{/if}
