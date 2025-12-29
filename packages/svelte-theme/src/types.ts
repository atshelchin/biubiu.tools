/**
 * Available theme values
 */
export type Theme = 'light' | 'dark';

/**
 * Theme context interface for store
 */
export interface ThemeContext {
	/** Current theme value */
	readonly theme: Theme;

	/** Set theme to specific value */
	setTheme: (theme: Theme) => void;

	/** Toggle between light and dark */
	toggleTheme: () => void;
}

/**
 * Options for creating the theme store
 */
export interface ThemeStoreOptions {
	/** Initial theme value (default: 'light') */
	initialTheme?: Theme;

	/** Custom context key (default: 'theme-context') */
	contextKey?: string;

	/** Cookie name for persisting theme (default: 'theme') */
	cookieName?: string;

	/** LocalStorage key for persisting theme (default: 'theme') */
	storageKey?: string;

	/** Cookie max age in seconds (default: 31536000 = 1 year) */
	cookieMaxAge?: number;

	/**
	 * Custom function to check if theme can be persisted
	 * If not provided, will try to use @shelchin/cookie-consent if available
	 * Return true to allow persistence, false to prevent
	 */
	canPersist?: () => boolean;
}

/**
 * Options for useTheme hook
 */
export interface UseThemeOptions {
	/** Custom context key (default: 'theme-context') */
	contextKey?: string;
}
