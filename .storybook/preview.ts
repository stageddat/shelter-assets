/// <reference types="vite/client" />
import '../src/routes/layout.css';

import type { Decorator, Preview } from '@storybook/sveltekit';
import { DecoratorHelpers } from '@storybook/addon-themes';
import { defaultThemeId, themes } from '../src/lib/themes.js';
import ThemeWrapper from './ThemeWrapper.svelte';

DecoratorHelpers.initializeThemeState(
	themes.map((theme) => theme.id),
	defaultThemeId
);

// poner el tema dentro de cada cajita
const withShelterTheme: Decorator = (_story, context) => ({
	Component: ThemeWrapper,
	props: {
		theme: DecoratorHelpers.pluckThemeFromContext(context) || defaultThemeId,
		fill: context.viewMode === 'story'
	}
});

const preview: Preview = {
	decorators: [withShelterTheme],
	parameters: {
		layout: 'fullscreen',
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: 'todo'
		}
	}
};

export default preview;
