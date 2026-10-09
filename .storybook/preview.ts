/// <reference types="vite/client" />
import '../src/routes/layout.css';

import type { Decorator, Preview } from '@storybook/sveltekit';
import { DecoratorHelpers } from '@storybook/addon-themes';
import { applyTheme, defaultThemeId, themes } from '../src/lib/themes.js';

DecoratorHelpers.initializeThemeState(
	themes.map((theme) => theme.id),
	defaultThemeId
);

const withShelterTheme: Decorator = (story, context) => {
	applyTheme(DecoratorHelpers.pluckThemeFromContext(context) || defaultThemeId);
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
