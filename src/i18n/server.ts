/**
 * Server-side i18n utilities for page load functions
 * Used in +page.ts and +page.server.ts files for SEO data generation
 */

// Eager load all translations for server-side usage
const localeModules = import.meta.glob('./locales/**/*.json', { eager: true });

type TranslationData = Record<string, unknown>;
type NamespaceData = Record<string, Record<string, unknown>>;

/**
 * Extract namespace from file path
 * Supports both flat structure (locales/en/common.json) and nested structure (locales/en/routes/wallet-sweep.json)
 * @param path - File path like ./locales/en/common.json or ./locales/en/routes/wallet-sweep.json
 * @param locale - The locale to match
 * @returns namespace name or null if not matching
 */
function extractNamespaceFromPath(path: string, locale: string): string | null {
	// Match pattern: /locales/{locale}/[subdir/]{namespace}.json
	const match = path.match(new RegExp(`/locales/${locale}/(.+)\\.json$`));
	if (!match) return null;

	// Get the last part of the path as namespace (e.g., "routes/wallet-sweep" -> "wallet-sweep")
	const fullPath = match[1];
	const parts = fullPath.split('/');
	return parts[parts.length - 1];
}

/**
 * Load specific namespaces for a locale (for SSR preloading)
 * @param locale - The locale to load (e.g., 'en', 'zh')
 * @param namespaces - Array of namespace names to load
 * @returns Object with namespace data
 */
export function loadNamespaces(locale: string, namespaces: string[]): NamespaceData {
	const result: NamespaceData = {};

	for (const [path, module] of Object.entries(localeModules)) {
		const namespace = extractNamespaceFromPath(path, locale);
		if (namespace && namespaces.includes(namespace)) {
			result[namespace] = (module as { default: Record<string, unknown> }).default;
		}
	}

	return result;
}

/**
 * Get preloaded namespace data for client-side injection
 * Used in +page.ts to pass translations to components for client-side navigation
 * @param locale - The locale to load
 * @param namespaces - Array of namespace names to load
 * @returns Object in the format { locale: { namespace: data } }
 */
export function getPreloadedTranslations(
	locale: string,
	namespaces: string[]
): Record<string, NamespaceData> {
	return { [locale]: loadNamespaces(locale, namespaces) };
}
type InterpolationParams = Record<string, string | number>;
interface DefaultValueParams {
	defaultValue: string;
}
type TranslationParams = InterpolationParams | DefaultValueParams;

function getNestedValue(obj: TranslationData, path: string): string | undefined {
	const keys = path.split('.');
	let current: unknown = obj;

	for (const key of keys) {
		if (current && typeof current === 'object' && key in current) {
			current = (current as Record<string, unknown>)[key];
		} else {
			return undefined;
		}
	}

	return typeof current === 'string' ? current : undefined;
}

/**
 * Interpolate parameters into translation string
 * Supports {key} syntax
 */
function interpolate(template: string, params: Record<string, string | number>): string {
	return template.replace(/\{(\w+)\}/g, (match, key) => {
		return key in params ? String(params[key]) : match;
	});
}

/**
 * Create a translation function for server-side usage
 * @param locale - The locale to use (e.g., 'en', 'zh')
 * @returns A translation function t(key, params?) that returns the translated string
 */
export function createServerT(locale: string): (key: string, params?: TranslationParams) => string {
	// Load all translations for the locale
	const translations: Record<string, TranslationData> = {};

	for (const [path, module] of Object.entries(localeModules)) {
		const namespace = extractNamespaceFromPath(path, locale);
		if (namespace) {
			translations[namespace] = (module as { default: TranslationData }).default;
		}
	}

	return function t(key: string, params?: TranslationParams): string {
		const isDefaultValueParams = (p: TranslationParams): p is DefaultValueParams =>
			'defaultValue' in p;
		const defaultValue = params && isDefaultValueParams(params) ? params.defaultValue : undefined;

		// Key format: namespace.path.to.value (e.g., wallet-sweep.seo.title)
		const dotIndex = key.indexOf('.');
		let value: string | undefined;

		if (dotIndex === -1) {
			// No namespace, try common
			if (translations['common']) {
				value = getNestedValue(translations['common'], key);
			}
		} else {
			const namespace = key.substring(0, dotIndex);
			const rest = key.substring(dotIndex + 1);

			if (translations[namespace]) {
				value = getNestedValue(translations[namespace], rest);
			}
		}

		// Return default value or key if not found
		if (value === undefined) {
			return defaultValue !== undefined ? defaultValue : key;
		}

		// Interpolate params if provided (excluding defaultValue)
		if (params && !isDefaultValueParams(params)) {
			return interpolate(value, params);
		}

		return value;
	};
}
