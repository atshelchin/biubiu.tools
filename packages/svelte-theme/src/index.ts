/**
 * @shelchin/svelte-theme
 *
 * Svelte 5 theme store with dark/light mode, SSR support, and cookie consent integration
 */

export { createThemeStore, useTheme, getThemeFromCookies } from './theme.svelte.js';

export type { Theme, ThemeContext, ThemeStoreOptions, UseThemeOptions } from './types.js';
