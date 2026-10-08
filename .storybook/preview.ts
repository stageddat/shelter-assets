import '../src/routes/layout.css';

import type { Decorator, Preview } from '@storybook/sveltekit';
import { DecoratorHelpers } from '@storybook/addon-themes';
import { applyTheme, defaultThemeId, getTheme, themes } from '../src/lib/themes.js';

const labels = Object.fromEntries(themes.map((theme) => [theme.label, theme.id]));

DecoratorHelpers.initializeThemeState(Object.keys(labels), getTheme(defaultThemeId).label);

const withShelterTheme: Decorator = (story, context) => {
	const selected = DecoratorHelpers.pluckThemeFromContext(context);
	applyTheme(labels[selected] ?? defaultThemeId);
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
