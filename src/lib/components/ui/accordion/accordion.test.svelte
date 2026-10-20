<!-- fixture for accordion.test.ts -->
<script lang="ts">
	import * as Accordion from './index.js';

	let { type }: { type?: Accordion.AccordionType } = $props();
</script>

<Accordion.Root {type}>
	{#each ['one', 'two'] as item (item)}
		<Accordion.Item data-testid={item}>
			<Accordion.Trigger>{item}</Accordion.Trigger>
			<Accordion.Content>{item} content</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
