<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Input } from '../../ui/input/index.js';
	import { Label } from './index.js';

	// necesita JS (bits-ui): solo para la app, se importa de 'shelter-assets/interactive'
	const { Story } = defineMeta({
		title: 'Interactive/Label',
		component: Label,
		tags: ['autodocs', 'needs-js']
	});
</script>

<Story name="With input" asChild>
	<div class="flex max-w-sm flex-col gap-2">
		<Label for="story-name">what should we call you?</Label>
		<Input id="story-name" placeholder="you don't have to use your real name" />
	</div>
</Story>

<Story name="Disabled input" asChild>
	<div class="flex max-w-sm flex-col gap-2">
		<Input id="story-disabled" class="peer order-2" disabled value="erik" />
		<Label for="story-disabled">username</Label>
	</div>
</Story>
