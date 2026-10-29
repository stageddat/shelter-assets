<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Info from '@lucide/svelte/icons/info';
	import { Button } from '../../ui/button/index.js';
	import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './index.js';

	// necesita JS (bits-ui): solo para la app, se importa de 'shelter-assets/interactive'
	const { Story } = defineMeta({
		title: 'Interactive/Tooltip',
		component: Tooltip,
		tags: ['autodocs', 'needs-js']
	});
</script>

<Story name="Default" asChild>
	<div class="flex justify-center p-12">
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="icon" aria-label="more info">
							<Info />
						</Button>
					{/snippet}
				</TooltipTrigger>
				<TooltipContent>you don't have to use your real name</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	</div>
</Story>

<Story name="Open" asChild>
	<div class="flex justify-center p-12">
		<TooltipProvider>
			<Tooltip open>
				<TooltipTrigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline">hover me</Button>
					{/snippet}
				</TooltipTrigger>
				<TooltipContent>your entries are encrypted on this device</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	</div>
</Story>
