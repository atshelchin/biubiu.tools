/**
 * Svelte 5 theme store with dark/light mode support
 * Features:
 * - SSR-safe with proper hydration
 * - Cookie and localStorage persistence
 * - Customizable persistence control
 * - System preference detection (prefers-color-scheme)
 */

import { getContext, setContext } from 'svelte';
import type { Theme, ThemeContext, ThemeStoreOptions, UseThemeOptions } from './types.js';

const DEFAULT_CONTEXT_KEY = 'theme-context';
const DEFAULT_COOKIE_NAME = 'theme';
const DEFAULT_STORAGE_KEY = 'theme';
const DEFAULT_COOKIE_MAX_AGE = 31536000; // 1 year

/**
 * Default persistence check - always allow
 */
function defaultCanPersist(): boolean {
	return true;
}

/**
 * Apply theme to document
 */
function applyTheme(theme: Theme): void {
	if (typeof window === 'undefined') return;

	if (theme === 'dark') {
		document.documentElement.setAttribute('data-theme', 'dark');
	} else {
		document.documentElement.removeAttribute('data-theme');
	}
}

/**
 * Persist theme to cookie and localStorage
 */
function persistTheme(
	theme: Theme,
	cookieName: string,
	storageKey: string,
	cookieMaxAge: number,
	canPersist: () => boolean
): void {
	if (typeof window === 'undefined') return;

	if (canPersist()) {
		document.cookie = `${cookieName}=${theme}; path=/; max-age=${cookieMaxAge}; SameSite=Lax`;
		localStorage.setItem(storageKey, theme);
	}
}

/**
 * Get theme from cookie or localStorage
 */
function getStoredTheme(cookieName: string, storageKey: string): Theme | null {
	if (typeof window === 'undefined') return null;

	// Try cookie first
	const cookieTheme = document.cookie
		.split('; ')
		.find((row) => row.startsWith(`${cookieName}=`))
		?.split('=')[1] as Theme | undefined;

	if (cookieTheme === 'dark' || cookieTheme === 'light') {
		return cookieTheme;
	}

	// Try localStorage
	const storedTheme = localStorage.getItem(storageKey) as Theme | null;
	if (storedTheme === 'dark' || storedTheme === 'light') {
		return storedTheme;
	}

	return null;
}

/**
 * Get system preferred theme
 */
function getSystemTheme(): Theme {
	if (typeof window === 'undefined') return 'light';

	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Create the theme store - call this in root layout
 *
 * @example
 * ```svelte
 * <script>
 *   import { createThemeStore } from '@shelchin/svelte-theme';
 *
 *   // Create store with initial theme from server
 *   const theme = createThemeStore({ initialTheme: data.theme });
 * </script>
 *
 * <button onclick={theme.toggleTheme}>
 *   {theme.theme === 'dark' ? 'Light' : 'Dark'} Mode
 * </button>
 * ```
 */
export function createThemeStore(options: ThemeStoreOptions = {}): ThemeContext {
	const {
		initialTheme = 'light',
		contextKey = DEFAULT_CONTEXT_KEY,
		cookieName = DEFAULT_COOKIE_NAME,
		storageKey = DEFAULT_STORAGE_KEY,
		cookieMaxAge = DEFAULT_COOKIE_MAX_AGE,
		canPersist = defaultCanPersist
	} = options;

	let currentTheme = $state<Theme>(initialTheme);

	function setTheme(newTheme: Theme) {
		currentTheme = newTheme;
		applyTheme(newTheme);
		persistTheme(newTheme, cookieName, storageKey, cookieMaxAge, canPersist);
	}

	function toggleTheme() {
		setTheme(currentTheme === 'light' ? 'dark' : 'light');
	}

	const store: ThemeContext = {
		get theme() {
			return currentTheme;
		},
		setTheme,
		toggleTheme
	};

	// Set in context for child components
	setContext(contextKey, store);

	return store;
}

/**
 * Get theme store from context - call this in child components
 *
 * @example
 * ```svelte
 * <script>
 *   import { useTheme } from '@shelchin/svelte-theme';
 *
 *   const theme = useTheme();
 * </script>
 *
 * <button onclick={theme.toggleTheme}>
 *   Current: {theme.theme}
 * </button>
 * ```
 */
export function useTheme(options: UseThemeOptions = {}): ThemeContext {
	const { contextKey = DEFAULT_CONTEXT_KEY } = options;

	const context = getContext<ThemeContext | undefined>(contextKey);

	if (context) {
		return context;
	}

	// Fallback for components not under theme provider
	// Creates a local store instance that syncs with DOM
	let localTheme = $state<Theme>('light');
	let initialized = false;

	function initTheme() {
		if (initialized || typeof window === 'undefined') return;

		initialized = true;

		// Try to get stored theme
		const storedTheme = getStoredTheme(DEFAULT_COOKIE_NAME, DEFAULT_STORAGE_KEY);

		if (storedTheme) {
			localTheme = storedTheme;
		} else {
			localTheme = getSystemTheme();
		}

		applyTheme(localTheme);
	}

	// Initialize on first call in browser
	if (typeof window !== 'undefined') {
		initTheme();
	}

	return {
		get theme() {
			return localTheme;
		},
		setTheme: (newTheme: Theme) => {
			localTheme = newTheme;
			applyTheme(newTheme);
			persistTheme(
				newTheme,
				DEFAULT_COOKIE_NAME,
				DEFAULT_STORAGE_KEY,
				DEFAULT_COOKIE_MAX_AGE,
				defaultCanPersist
			);
		},
		toggleTheme: () => {
			const newTheme: Theme = localTheme === 'light' ? 'dark' : 'light';
			localTheme = newTheme;
			applyTheme(newTheme);
			persistTheme(
				newTheme,
				DEFAULT_COOKIE_NAME,
				DEFAULT_STORAGE_KEY,
				DEFAULT_COOKIE_MAX_AGE,
				defaultCanPersist
			);
		}
	};
}

/**
 * Utility to read theme from request cookies (for SSR)
 *
 * @example
 * ```ts
 * // +layout.server.ts
 * import { getThemeFromCookies } from '@shelchin/svelte-theme';
 *
 * export const load = ({ cookies }) => {
 *   return {
 *     theme: getThemeFromCookies(cookies.get('theme'))
 *   };
 * };
 * ```
 */
export function getThemeFromCookies(
	cookieValue: string | undefined,
	defaultTheme: Theme = 'light'
): Theme {
	if (cookieValue === 'dark' || cookieValue === 'light') {
		return cookieValue;
	}
	return defaultTheme;
}
