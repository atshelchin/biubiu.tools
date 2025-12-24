import type { LayoutServerLoad } from './$types.js';
import { extractLocaleFromPathname, extractLocaleFromCookie } from '$utils/common';

const supportedLocales = ['en', 'zh'];

// Eager load all translations for SSR
const localeModules = import.meta.glob('../i18n/locales/**/*.json', { eager: true });

function loadTranslationsForLocale(locale: string): Record<string, Record<string, unknown>> {
	const translations: Record<string, Record<string, unknown>> = {};

	for (const [path, module] of Object.entries(localeModules)) {
		// Path format: ../i18n/locales/en/common.json
		const match = path.match(/\/locales\/([^/]+)\/([^/]+)\.json$/);
		if (match && match[1] === locale) {
			const namespace = match[2];
			translations[namespace] = (module as { default: Record<string, unknown> }).default;
		}
	}

	return translations;
}

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const detectedLocale =
		extractLocaleFromPathname(url.pathname) || extractLocaleFromCookie(cookies) || 'en';

	const locale = supportedLocales.includes(detectedLocale) ? detectedLocale : 'en';

	// Preload translations for SSR - format: { locale: { namespace: data } }
	const namespaceData = loadTranslationsForLocale(locale);
	const translations = { [locale]: namespaceData };

	// Read theme from cookie, default to 'light'
	const theme = (cookies.get('theme') || 'light') as 'light' | 'dark';

	return {
		locale,
		translations,
		theme
	};
};
