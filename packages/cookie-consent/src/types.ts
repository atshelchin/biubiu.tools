/**
 * Cookie categories based on purpose
 * Note: 'functional' is deprecated and treated as 'necessary'
 */
export type CookieCategory = 'necessary' | 'functional' | 'analytics';

/**
 * User's consent preferences
 */
export interface ConsentPreferences {
	/** Always true - essential for app functionality */
	necessary: boolean;
	/** Deprecated - always true (same as necessary) */
	functional: boolean;
	/** UTM tracking, user behavior - requires consent */
	analytics: boolean;
}

/**
 * Stored consent data structure
 */
export interface StoredConsent {
	version: number;
	preferences: ConsentPreferences;
	timestamp: number;
	/** User has made a choice */
	hasInteracted: boolean;
	/** Last time we showed a reminder for partial consent */
	lastReminder?: number;
}

/**
 * Cookie consent context interface
 */
export interface CookieConsentContext {
	/** Current consent preferences */
	readonly preferences: ConsentPreferences;
	/** Whether user has made a consent choice */
	readonly hasInteracted: boolean;
	/** Whether the consent banner should be shown */
	readonly shouldShowBanner: boolean;
	/** Whether this is a reminder (user previously chose necessary only) */
	readonly isReminder: boolean;
	/** Accept all cookies */
	acceptAll: () => void;
	/** Accept only necessary cookies */
	acceptNecessaryOnly: () => void;
	/** Accept custom selection */
	acceptCustom: (prefs: Partial<ConsentPreferences>) => void;
	/** Check if a specific category is consented */
	hasConsent: (category: CookieCategory) => boolean;
	/** Reset consent (for testing/debugging) */
	resetConsent: () => void;
	/** Dismiss reminder without changing preferences */
	dismissReminder: () => void;
	/** Open the consent banner to change preferences (for GDPR right to withdraw consent) */
	openSettings: () => void;
}

/**
 * Configuration options for the cookie consent store
 */
export interface CookieConsentOptions {
	/** Storage key for localStorage (default: 'cookie-consent') */
	storageKey?: string;
	/** Consent version - bump to reset old consents (default: 1) */
	version?: number;
	/** Reminder interval in milliseconds (default: 7 days) */
	reminderInterval?: number;
}
