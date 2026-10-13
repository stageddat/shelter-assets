<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
	const looks = ['same as level', 'text-h1', 'text-h2', 'text-h3', 'text-h4', 'text-h5', 'text-h6'];

	type Args = { text: string; level: (typeof levels)[number]; look: string };

	const { Story } = defineMeta({
		title: 'Foundations/Typography',
		tags: ['autodocs'],
		render: template,
		argTypes: {
			text: { control: 'text', description: 'Heading text' },
			level: {
				control: 'select',
				options: levels,
				description: 'HTML tag: the page structure (screen readers, SEO)'
			},
			look: {
				control: 'select',
				options: looks,
				description: 'Optional class: only changes how it looks'
			}
		},
		args: {
			text: 'Dear diary',
			level: 'h1',
			look: 'same as level'
		}
	});
</script>

{#snippet template({ text, level, look }: Args)}
	<svelte:element this={level} class={look === 'same as level' ? undefined : look}>
		{text}
	</svelte:element>
{/snippet}

<Story name="Playground" />

<Story name="Headings">
	{#snippet template()}
		<div class="flex max-w-xl flex-col gap-4">
			<h1>Heading 1: Dear diary</h1>
			<h2>Heading 2: Dear diary</h2>
			<h3>Heading 3: Dear diary</h3>
			<h4>Heading 4: Dear diary</h4>
			<h5>Heading 5: Dear diary</h5>
			<h6>Heading 6: Dear diary</h6>
			<p>Body text: Dear diary</p>
		</div>
	{/snippet}
</Story>

<Story name="Level vs look">
	{#snippet template()}
		<div class="flex max-w-xl flex-col gap-4">
			<h1>Page title (h1)</h1>
			<h2 class="text-h4 text-muted-foreground">Section label (h2 that looks like h4)</h2>
			<p>The heading level is the page structure; the class is only how it looks.</p>
		</div>
	{/snippet}
</Story>
