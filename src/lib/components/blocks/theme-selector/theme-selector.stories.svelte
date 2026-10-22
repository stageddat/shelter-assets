<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { ThemeSelector, type ThemeSelectorProps } from './index.js';

	const { Story } = defineMeta({
		title: 'Blocks/ThemeSelector',
		component: ThemeSelector,
		tags: ['autodocs'],
		render: template,
		argTypes: {
			variant: { control: 'inline-radio', options: ['popover', 'inline'] },
			align: { control: 'inline-radio', options: ['start', 'end'] }
		},
		parameters: {
			docs: {
				description: {
					component:
						'Picks the theme preference. Unlike the toolbar theme, it changes the whole page (`<html>`) and saves it, like on the sites. Which option is checked comes from `<html data-theme-preference>` (set by `themeInitScript`), with CSS only.'
				}
			}
		}
	});
</script>

{#snippet template(args: ThemeSelectorProps)}
	<div class="flex justify-end p-4">
		<ThemeSelector {...args} />
	</div>
{/snippet}

<Story name="Default" />

<Story
	name="Translated"
	args={{ label: 'Tema', labels: { system: 'sistema', light: 'clar', dark: 'fosc' } }}
/>

<Story name="Aligned to the start" args={{ align: 'start' }}>
	{#snippet template(args: ThemeSelectorProps)}
		<div class="p-4"><ThemeSelector {...args} /></div>
	{/snippet}
</Story>

<Story name="Inline (mobile menu)" args={{ variant: 'inline' }}>
	{#snippet template(args: ThemeSelectorProps)}
		<div class="flex max-w-xs flex-col gap-2 p-4"><ThemeSelector {...args} /></div>
	{/snippet}
</Story>
