<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Input } from './index.js';

	const { Story } = defineMeta({
		title: 'UI/Input',
		component: Input,
		tags: ['autodocs'],
		argTypes: {
			type: { control: 'select', options: ['text', 'password', 'email', 'search', 'file'] },
			disabled: { control: 'boolean' }
		},
		args: { placeholder: 'what should we call you?', 'aria-label': 'name' }
	});
</script>

<Story name="Default" />

<Story name="With value" args={{ value: 'erik' }} />

<Story name="Password" args={{ type: 'password', value: 'cake-1234', 'aria-label': 'password' }} />

<Story name="Invalid" args={{ value: 'e', 'aria-invalid': true }} />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="File" args={{ type: 'file', 'aria-label': 'backup file' }} />
