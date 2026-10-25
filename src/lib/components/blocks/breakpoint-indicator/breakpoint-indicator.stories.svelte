<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { BreakpointIndicator } from './index.js';

	const { Story } = defineMeta({
		title: 'Blocks/BreakpointIndicator',
		component: BreakpointIndicator,
		tags: ['autodocs']
	});
</script>

<!-- cambia el viewport de storybook para verlo cambiar -->
<Story name="Default" />
