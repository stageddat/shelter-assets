<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import * as Accordion from './index.js';

	type Args = { type?: Accordion.AccordionType };

	const faqs = [
		{
			question: 'Is Shelter free?',
			answer: 'Yes. Shelter is open source and free to use.'
		},
		{
			question: 'Can anyone read my entries?',
			answer:
				'No. Entries are encrypted on your device before they leave it, so the server only stores data it cannot read.'
		},
		{
			question: 'Does it work offline?',
			answer: 'Yes. You can write without a connection and it syncs when you are back online.'
		}
	];

	const { Story } = defineMeta({
		title: 'UI/Accordion',
		component: Accordion.Root,
		tags: ['autodocs'],
		render: template,
		argTypes: {
			type: { control: 'inline-radio', options: ['single', 'multiple'] }
		},
		args: { type: 'single' },
		parameters: {
			docs: {
				description: {
					component:
						'Native `<details>`, no JavaScript: works rendered to static HTML. `single` uses `<details name>`, so opening an item closes the others. Find-in-page opens the item that matches. Same parts and look as the shadcn Accordion.'
				}
			}
		}
	});
</script>

{#snippet template(args: Args)}
	<div class="max-w-lg p-4">
		<Accordion.Root {...args}>
			{#each faqs as faq (faq.question)}
				<Accordion.Item>
					<Accordion.Trigger>{faq.question}</Accordion.Trigger>
					<Accordion.Content>{faq.answer}</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</div>
{/snippet}

<Story name="Single" />

<Story name="Multiple" args={{ type: 'multiple' }} />

<Story name="First item open">
	{#snippet template(args: Args)}
		<div class="max-w-lg p-4">
			<Accordion.Root {...args}>
				{#each faqs as faq, i (faq.question)}
					<Accordion.Item open={i === 0}>
						<Accordion.Trigger>{faq.question}</Accordion.Trigger>
						<Accordion.Content>{faq.answer}</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</div>
	{/snippet}
</Story>
