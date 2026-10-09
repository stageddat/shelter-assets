<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { fn } from 'storybook/test';
	import { PlusIcon } from '@lucide/svelte';
	import { Button, type ButtonProps } from './index.js';

	type Args = Omit<ButtonProps, 'children'> & { label?: string };

	const { Story } = defineMeta({
		title: 'UI/Button',
		component: Button,
		tags: ['autodocs'],
		render: template,
		argTypes: {
			variant: {
				control: 'select',
				options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link']
			},
			size: {
				control: 'select',
				options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg']
			},
			disabled: { control: 'boolean' },
			loading: { control: 'boolean' },
			label: { control: 'text' }
		},
		args: {
			label: 'Button',
			onclick: fn()
		}
	});
</script>

{#snippet template({ label, ...args }: Args)}
	<Button {...args}>{label}</Button>
{/snippet}

<Story name="Default" />

<Story name="Outline" args={{ variant: 'outline' }} />

<Story name="Secondary" args={{ variant: 'secondary' }} />

<Story name="Ghost" args={{ variant: 'ghost' }} />

<Story name="Destructive" args={{ variant: 'destructive' }} />

<Story name="Link" args={{ variant: 'link' }} />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Loading" args={{ loading: true, label: 'Saving' }} />

<Story name="All variants">
	{#snippet template({ label, ...args }: Args)}
		<div class="flex flex-wrap items-center gap-2">
			<Button {...args}>{label}</Button>
			<Button {...args} variant="outline">Outline</Button>
			<Button {...args} variant="secondary">Secondary</Button>
			<Button {...args} variant="ghost">Ghost</Button>
			<Button {...args} variant="destructive">Destructive</Button>
			<Button {...args} variant="link">Link</Button>
		</div>
	{/snippet}
</Story>

<Story name="Sizes">
	{#snippet template({ label, ...args }: Args)}
		<div class="flex items-center gap-2">
			<Button {...args} size="xs">{label}</Button>
			<Button {...args} size="sm">{label}</Button>
			<Button {...args}>{label}</Button>
			<Button {...args} size="lg">{label}</Button>
		</div>
	{/snippet}
</Story>

<Story name="With icon">
	{#snippet template({ label, ...args }: Args)}
		<div class="flex items-center gap-2">
			<Button {...args}><PlusIcon data-icon="inline-start" /> {label}</Button>
			<Button {...args} size="icon" aria-label={label}><PlusIcon /></Button>
		</div>
	{/snippet}
</Story>
