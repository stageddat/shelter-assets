import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

// poner nombre de shelter en lugar de storybook
addons.setConfig({
	theme: create({
		base: 'light',
		brandTitle: 'shelter design',
		brandUrl: 'https://shelter.cat',
		brandTarget: '_blank'
	})
});
