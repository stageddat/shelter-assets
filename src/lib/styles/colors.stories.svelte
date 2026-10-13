<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Foundations/Colors',
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'Color tokens grouped by purpose. Values change with the theme picker in the toolbar. Pairs show a surface with its text color and their contrast (WCAG AA needs 4.5 for normal text).'
				}
			}
		}
	});

	type Pair = { name: string; bg: string; fg: string; use: string };
	type Swatch = { name: string; use: string };

	const surfaces: Pair[] = [
		{
			name: 'background',
			bg: 'background',
			fg: 'foreground',
			use: 'Page background and default text'
		},
		{ name: 'card', bg: 'card', fg: 'card-foreground', use: 'Cards, entries, panels' },
		{ name: 'popover', bg: 'popover', fg: 'popover-foreground', use: 'Menus, popovers, dialogs' },
		{ name: 'muted', bg: 'muted', fg: 'muted-foreground', use: 'Subtle areas and secondary text' }
	];

	const actions: Pair[] = [
		{
			name: 'primary',
			bg: 'primary',
			fg: 'primary-foreground',
			use: 'Main action (default button)'
		},
		{ name: 'secondary', bg: 'secondary', fg: 'secondary-foreground', use: 'Secondary actions' },
		{ name: 'accent', bg: 'accent', fg: 'accent-foreground', use: 'Hover and highlighted items' }
	];

	const sidebar: Pair[] = [
		{ name: 'sidebar', bg: 'sidebar', fg: 'sidebar-foreground', use: 'Sidebar surface' },
		{
			name: 'sidebar-primary',
			bg: 'sidebar-primary',
			fg: 'sidebar-primary-foreground',
			use: 'Active item'
		},
		{
			name: 'sidebar-accent',
			bg: 'sidebar-accent',
			fg: 'sidebar-accent-foreground',
			use: 'Hovered item'
		}
	];

	const lines: Swatch[] = [
		{ name: 'border', use: 'Borders and dividers' },
		{ name: 'input', use: 'Input borders' },
		{ name: 'ring', use: 'Focus ring' },
		{ name: 'selection', use: 'Selected text highlight' },
		{ name: 'sidebar-border', use: 'Sidebar dividers' },
		{ name: 'sidebar-ring', use: 'Sidebar focus ring' }
	];

	const feedback: Swatch[] = [
		{ name: 'destructive', use: 'Dangerous actions (delete), errors' },
		{ name: 'destructive-text', use: 'Red text on red-tinted backgrounds' }
	];

	const charts: Swatch[] = [1, 2, 3, 4, 5].map((n) => ({
		name: `chart-${n}`,
		use: `Chart series ${n}`
	}));

	const palette: Swatch[] = [
		'green',
		'peach',
		'red',
		'blue',
		'mauve',
		'pink',
		'teal',
		'sky',
		'yellow'
	].map((name) => ({ name, use: 'Extra accent (tags, icons, highlights)' }));
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let version = $state(0);
	onMount(() => {
		const observer = new MutationObserver(() => version++);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class', 'data-theme']
		});
		return () => observer.disconnect();
	});

	function value(token: string) {
		void version;
		if (typeof document === 'undefined') return '';
		return getComputedStyle(document.documentElement).getPropertyValue(`--${token}`).trim();
	}

	function rgb(color: string): [number, number, number] | null {
		const ctx = document.createElement('canvas').getContext('2d');
		if (!ctx || !color) return null;
		ctx.fillStyle = '#000';
		ctx.fillStyle = color;
		ctx.fillRect(0, 0, 1, 1);
		const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
		return [r, g, b];
	}

	function luminance([r, g, b]: [number, number, number]) {
		const channel = (v: number) => {
			v /= 255;
			return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
		};
		return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
	}

	function contrast(bg: string, fg: string) {
		if (typeof document === 'undefined') return null;
		const a = rgb(value(bg));
		const b = rgb(value(fg));
		if (!a || !b) return null;
		const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
		return (hi + 0.05) / (lo + 0.05);
	}
</script>

{#snippet pairs(title: string, items: Pair[])}
	<section class="flex flex-col gap-3">
		<h3>{title}</h3>
		<div class="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-3">
			{#each items as item (item.name)}
				{@const ratio = contrast(item.bg, item.fg)}
				<div class="overflow-hidden rounded-lg border">
					<div
						class="flex h-20 items-center justify-between px-4"
						style:background="var(--{item.bg})"
						style:color="var(--{item.fg})"
					>
						<span class="text-h4">Aa</span>
						{#if ratio}
							<span class="text-sm">{ratio.toFixed(1)} {ratio >= 4.5 ? '✓ AA' : '✗'}</span>
						{/if}
					</div>
					<div class="flex flex-col gap-0.5 px-3 py-2 text-sm">
						<code class="font-semibold">{item.bg} / {item.fg}</code>
						<span class="text-muted-foreground">{item.use}</span>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/snippet}

{#snippet swatches(title: string, items: Swatch[])}
	<section class="flex flex-col gap-3">
		<h3>{title}</h3>
		<div class="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3">
			{#each items as item (item.name)}
				<div class="overflow-hidden rounded-lg border">
					<div class="h-14" style:background="var(--{item.name})"></div>
					<div class="flex flex-col gap-0.5 px-3 py-2 text-sm">
						<code class="font-semibold">{item.name}</code>
						<code class="text-xs text-muted-foreground">{value(item.name)}</code>
						<span class="text-muted-foreground">{item.use}</span>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/snippet}

<Story name="Tokens">
	{#snippet template()}
		<div class="flex flex-col gap-8">
			{@render pairs('Surfaces and text', surfaces)}
			{@render pairs('Actions', actions)}
			{@render swatches('Feedback', feedback)}
			{@render swatches('Lines and focus', lines)}
			{@render pairs('Sidebar', sidebar)}
			{@render swatches('Charts', charts)}
			{@render swatches('Palette', palette)}
		</div>
	{/snippet}
</Story>

<Story name="Palette as text">
	{#snippet template()}
		<div class="flex flex-col gap-1">
			<p class="text-muted-foreground">The extra colors are mostly used for text and icons:</p>
			{#each palette as color (color.name)}
				<p style:color="var(--{color.name})">
					<span class="font-semibold">{color.name}</span>: Dear diary, today was a good day.
				</p>
			{/each}
		</div>
	{/snippet}
</Story>
