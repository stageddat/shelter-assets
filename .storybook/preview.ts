import '../src/routes/layout.css';

import type { Decorator, Preview } from '@storybook/sveltekit';
import { DecoratorHelpers } from '@storybook/addon-themes';

const themes: Record<string, { mode: 'light' | 'dark'; theme?: string }> = {
	light: { mode: 'light' },
	dark: { mode: 'dark' },
	'mocha lavender': { mode: 'dark', theme: 'mocha-lavender' }
};
const defaultTheme = 'light';

DecoratorHelpers.initializeThemeState(Object.keys(themes), defaultTheme);

const withShelterTheme: Decorator = (story, context) => {
	const selected = DecoratorHelpers.pluckThemeFromContext(context) || defaultTheme;
	const { mode, theme } = themes[selected] ?? themes[defaultTheme];
	const root = document.documentElement;

	root.classList.toggle('dark', mode === 'dark');
	if (theme) root.dataset.theme = theme;
	else delete root.dataset.theme;

	return story();
};

const preview: Preview = {
	decorators: [withShelterTheme],
	parameters: {
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
