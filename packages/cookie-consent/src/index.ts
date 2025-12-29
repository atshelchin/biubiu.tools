/**
 * @shelchin/cookie-consent
 *
 * Svelte 5 cookie consent management with GDPR/CCPA compliance
 * Uses Svelte 5 runes for reactive state management
 */

export {
	createCookieConsentStore,
	useCookieConsent,
	checkConsent,
	hasConsentInteraction
} from './cookie-consent.svelte.js';

export type {
	CookieCategory,
	ConsentPreferences,
	StoredConsent,
	CookieConsentContext,
	CookieConsentOptions
} from './types.js';
