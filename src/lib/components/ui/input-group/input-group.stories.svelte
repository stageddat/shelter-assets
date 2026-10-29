<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Copy from '@lucide/svelte/icons/copy';
	import Lock from '@lucide/svelte/icons/lock';
	import Search from '@lucide/svelte/icons/search';
	import User from '@lucide/svelte/icons/user';
	import {
		InputGroup,
		InputGroupAddon,
		InputGroupButton,
		InputGroupInput,
		InputGroupText,
		InputGroupTextarea
	} from './index.js';

	const { Story } = defineMeta({
		title: 'UI/InputGroup',
		component: InputGroup,
		tags: ['autodocs']
	});
</script>

<!-- un input con iconos, texto o botones pegados a los lados -->
<Story name="Icon" asChild>
	<InputGroup class="max-w-sm">
		<InputGroupInput placeholder="what should we call you?" aria-label="name" />
		<InputGroupAddon><User /></InputGroupAddon>
	</InputGroup>
</Story>

<Story name="Icons on both sides" asChild>
	<InputGroup class="max-w-sm">
		<InputGroupInput type="search" placeholder="search your entries" aria-label="search" />
		<InputGroupAddon><Search /></InputGroupAddon>
		<InputGroupAddon align="inline-end"><InputGroupText>12 results</InputGroupText></InputGroupAddon
		>
	</InputGroup>
</Story>

<Story name="Button" asChild>
	<InputGroup class="max-w-sm">
		<InputGroupInput value="erik" readonly aria-label="username" />
		<InputGroupAddon align="inline-end">
			<InputGroupButton size="icon-xs" aria-label="copy"><Copy /></InputGroupButton>
		</InputGroupAddon>
	</InputGroup>
</Story>

<Story name="Password" asChild>
	<InputGroup class="max-w-sm">
		<InputGroupInput type="password" placeholder="choose a password" aria-label="password" />
		<InputGroupAddon><Lock /></InputGroupAddon>
	</InputGroup>
</Story>

<Story name="Textarea" asChild>
	<InputGroup class="max-w-sm">
		<InputGroupTextarea placeholder="write about your day..." aria-label="entry" />
		<InputGroupAddon align="block-end">
			<InputGroupText class="ml-auto">0 words</InputGroupText>
		</InputGroupAddon>
	</InputGroup>
</Story>
