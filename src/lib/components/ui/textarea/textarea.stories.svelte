<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Textarea } from './index.js';

	const { Story } = defineMeta({
		title: 'UI/Textarea',
		component: Textarea,
		tags: ['autodocs'],
		argTypes: { disabled: { control: 'boolean' } },
		args: { placeholder: 'write about your day...', 'aria-label': 'entry' }
	});
</script>

<Story name="Default" />

<Story
	name="With value"
	args={{ value: "today was erik's birthday. we had cake and it was the best day 🎉" }}
/>

<Story name="Invalid" args={{ 'aria-invalid': true }} />

<Story name="Disabled" args={{ disabled: true }} />
