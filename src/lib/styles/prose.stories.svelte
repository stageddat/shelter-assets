<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const sizes = ['text-sm', 'text-base', 'text-lg', 'text-xl'];

	type Args = { size: string };

	const { Story } = defineMeta({
		title: 'Foundations/Prose',
		tags: ['autodocs'],
		render: template,
		parameters: {
			docs: {
				description: {
					component:
						'Put `class="prose"` on the container of long-form text (journal entries, editor content). Spacing is in `em`, so a size class on the same container scales everything.'
				}
			}
		},
		argTypes: {
			size: {
				control: 'select',
				options: sizes,
				description: 'Font size class on the .prose container'
			}
		},
		args: { size: 'text-base' }
	});
</script>

{#snippet template({ size }: Args)}
	<article class="prose max-w-[65ch] {size}">
		<p>
			today we celebrated <strong>erik's birthday</strong>! we had dinner at his place, laughed a
			lot and played games until way too late. it was <em>such</em> a good day.
		</p>
		<p>
			the plan was a <s>quiet dinner</s> surprise party, and he <u>totally</u> suspected nothing. he
			had been talking about <a href="#prose">that little bakery</a> for weeks, so the cake came from
			there.
		</p>
		<h2>things i want to remember</h2>
		<ul>
			<li>his face when everyone shouted "surprise!"</li>
			<li>
				the games we played:
				<ul>
					<li>charades (erik is terrible at it),</li>
					<li>that card game nobody knew the rules of.</li>
				</ul>
			</li>
			<li>how <mark>grateful</mark> i felt for having these people in my life.</li>
		</ul>
		<h3>for next year</h3>
		<ol>
			<li>order the cake one week earlier.</li>
			<li>buy more candles (we ran out at 23).</li>
			<li>don't let erik pick the music.</li>
		</ol>
		<blockquote>
			<p>"another year older, but not wiser." — erik, blowing out the candles</p>
		</blockquote>
		<p>
			his wifi password is still <code>erikrules2003</code>, which says a lot about him.
		</p>
		<pre><code
				>gift ideas for next time:
  - a better board game
  - concert tickets
  - socks (he always needs socks)</code
			></pre>
		<hr />
		<p>happy birthday, erik. 🎉</p>
	</article>
{/snippet}

<Story name="Journal entry" />

<Story name="Outside prose">
	{#snippet template()}
		<div class="flex max-w-[65ch] flex-col gap-4">
			<h2 class="text-muted-foreground line-through">Plans that did not happen</h2>
			<h3 class="italic">A heading in italics, <span class="highlight">highlighted</span></h3>
			<p>
				Read the <a href="#prose" class="link">privacy notes</a> or press
				<kbd class="inline-code">Ctrl + K</kbd> to search.
			</p>
			<p class="font-semibold underline decoration-wavy">Bold, underlined and wavy</p>
			<div class="quote">A quote style on a plain div.</div>
			<div class="code-block">npm install shelter-assets</div>
			<ul class="list-disc pl-6 marker:text-muted-foreground">
				<li>A list outside prose uses Tailwind's list classes</li>
				<li>like list-disc and marker:text-muted-foreground</li>
			</ul>
		</div>
	{/snippet}
</Story>
