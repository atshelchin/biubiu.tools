/**
 * Server-side i18n utilities for page load functions
 * Used in +page.ts and +page.server.ts files for SEO data generation
 */

// Eager load all translations for server-side usage
const localeModules = import.meta.glob('./locales/**/*.json', { eager: true });

type TranslationData = Record<string, unknown>;
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
		// Path format: ./locales/en/common.json
		const match = path.match(/\/locales\/([^/]+)\/([^/]+)\.json$/);
		if (match && match[1] === locale) {
			const namespace = match[2];
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
