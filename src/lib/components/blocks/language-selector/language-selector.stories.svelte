<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import { LanguageSelector, type LanguageOption, type LanguageSelectorProps } from './index.js';

	const languages: LanguageOption[] = [
		{ locale: 'en', label: 'english', href: '#en', official: true },
		{ locale: 'ca', label: 'català', href: '#ca', official: true },
		{ locale: 'es', label: 'español', href: '#es', official: false },
		{ locale: 'de', label: 'deutsch', href: '#de', official: false },
		{ locale: 'ru', label: 'русский', href: '#ru', official: false }
	];

	const { Story } = defineMeta({
		title: 'Blocks/LanguageSelector',
		component: LanguageSelector,
		tags: ['autodocs'],
		render: template,
		args: { current: 'en', languages },
		argTypes: {
			current: { control: 'select', options: languages.map((l) => l.locale) },
			variant: { control: 'inline-radio', options: ['popover', 'inline'] },
			align: { control: 'inline-radio', options: ['start', 'end'] }
		}
	});
</script>

{#snippet template(args: LanguageSelectorProps)}
	<div class="flex justify-end p-4">
		<LanguageSelector {...args} />
	</div>
{/snippet}

<Story name="Default" />

<Story name="Community language selected" args={{ current: 'es' }} />

<Story
	name="Translated"
	args={{
		current: 'ca',
		labels: {
			language: 'Idioma',
			official: 'traduccions oficials',
			community: 'traduccions de la comunitat'
		}
	}}
/>

<Story name="Inline (mobile menu)" args={{ variant: 'inline' }}>
	{#snippet template(args: LanguageSelectorProps)}
		<div class="flex max-w-xs flex-col gap-2 p-4"><LanguageSelector {...args} /></div>
	{/snippet}
</Story>

<!-- sin href (la app guarda el idioma en localStorage): botones que llaman a onselect (ver Actions) -->
<Story
	name="Without links (app)"
	args={{
		languages: languages.map((language) => ({ ...language, href: undefined })),
		onselect: fn()
	}}
/>
