/**
 * Shared translations module for server-side translation
 *
 * This module parses and exports translations for use in both
 * +layout.server.ts and +page.ts files for SEO metadata.
 */
import { parseLocaleModules, createServerT, type ParsedLocaleData } from '@shelchin/i18n';
import type { LocaleData } from '@shelchin/i18n';

// Parse all locale modules eagerly for server-side access
const modules = import.meta.glob<{ default: LocaleData }>('../i18n/locales/**/*.json', {
	eager: true
});

export const parsedLocales: ParsedLocaleData = parseLocaleModules(modules);

// Export translations for createServerT
export const translations = parsedLocales.translations;
export const locales = parsedLocales.locales;
export const localeMetas = parsedLocales.localeMetas;
export const namespaces = parsedLocales.namespaces;

/** Event type for createT */
export interface ServerEvent {
	url: URL;
	cookies: {
		get: (name: string) => string | undefined;
	};
}

/**
 * Create a server-side translation function from SvelteKit event
 * This is a convenience wrapper for +page.server.ts files that automatically
 * detects locale from the URL pathname.
 *
 * @example
 * // In +page.server.ts
 * import { createT } from '$i18n/translations';
 *
 * export const load: PageServerLoad = (event) => {
 *   const t = createT(event);
 *   return { title: t('page.title') };
 * };
 */
export function createT(event: ServerEvent) {
	return createServerT(translations, {
		event,
		defaultLocale: 'en',
		supportedLocales: locales
	});
}
