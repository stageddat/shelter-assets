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
		align?: PopoverAlign;
		class?: string;
	};
</script>

<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import Languages from '@lucide/svelte/icons/languages';
	import { Popover } from '../../ui/popover/index.js';

	let {
		current,
		languages,
		labels = {},
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
	const currentLabel = $derived(languages.find((l) => l.locale === current)?.label ?? current);
</script>

<Popover {align} class={className} panelClass="w-56">
	{#snippet trigger()}
		<Languages />
		<span class="sr-only">{labels.language ?? 'Language'}:</span>
		<span lang={current}>{currentLabel}</span>
	{/snippet}

	{#each groups as group (group.title)}
		<p class="px-3 pt-2 pb-1 text-xs text-muted-foreground">{group.title}</p>
		<ul class="mb-1">
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
</Popover>
