// Single list of Shelter themes, shared by every site and Storybook.
// To add a theme: add its `[data-theme='id']` block in the CSS, then add it here.

export type ThemeScheme = 'light' | 'dark';

export type Theme = {
	id: string;
	label: string;
	/** Light or dark base: dark themes get the `.dark` class so `dark:` utilities apply */
	scheme: ThemeScheme;
	/** Value for `data-theme`; empty for the base light/dark palettes in `:root` and `.dark` */
	dataTheme: string;
};

export const themes = [
	{ id: 'light', label: 'Light', scheme: 'light', dataTheme: '' },
	{ id: 'dark', label: 'Dark', scheme: 'dark', dataTheme: '' },
	{ id: 'mocha-lavender', label: 'Mocha Lavender', scheme: 'dark', dataTheme: 'mocha-lavender' }
] as const satisfies readonly Theme[];

export type ThemeId = (typeof themes)[number]['id'];

export const defaultThemeId: ThemeId = 'light';

export function getTheme(id: string): Theme {
	return themes.find((theme) => theme.id === id) ?? themes[0];
}

/** Applies a theme to the document root without any library (Storybook, static pages) */
export function applyTheme(id: string, root: HTMLElement = document.documentElement) {
	const { scheme, dataTheme } = getTheme(id);
	root.classList.toggle('dark', scheme === 'dark');
	root.style.colorScheme = scheme;
	if (dataTheme) root.dataset.theme = dataTheme;
	else delete root.dataset.theme;
}
