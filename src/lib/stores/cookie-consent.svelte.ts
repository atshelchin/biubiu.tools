/**
 * Cookie Consent Store
 * Manages user consent for different types of cookies/storage
 * Compliant with GDPR, CCPA, and other privacy regulations
 *
 * Categories:
 * - necessary: Essential for app functionality (theme, RPC metrics, session data) - always enabled
 * - analytics: UTM tracking, user behavior tracking - requires consent
 *
 * Note: "functional" is kept for backwards compatibility but treated same as "necessary"
 */
import { getContext, setContext } from 'svelte';

const CONSENT_CONTEXT_KEY = 'cookie-consent-context';
const CONSENT_STORAGE_KEY = 'cookie-consent';
const CONSENT_VERSION = 2; // Bumped version to reset old consents

/**
 * Cookie categories based on purpose
 * Note: 'functional' is deprecated and treated as 'necessary'
 */
export type CookieCategory = 'necessary' | 'functional' | 'analytics';

/**
 * User's consent preferences
 */
export interface ConsentPreferences {
	necessary: boolean; // Always true, includes theme/RPC/session data
	functional: boolean; // Deprecated - always true (same as necessary)
	analytics: boolean; // UTM tracking, user behavior
}

/**
 * Stored consent data structure
 */
interface StoredConsent {
	version: number;
	preferences: ConsentPreferences;
	timestamp: number;
	hasInteracted: boolean; // User has made a choice
	lastReminder?: number; // Last time we showed a reminder for partial consent
}

/**
 * Default preferences - necessary always enabled, analytics requires consent
 */
const DEFAULT_PREFERENCES: ConsentPreferences = {
	necessary: true,
	functional: true, // Now always true (merged with necessary)
	analytics: false
};

// Reminder interval: 7 days in milliseconds
const REMINDER_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

interface CookieConsentContext {
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
 * Load consent from localStorage
 */
function loadConsent(): StoredConsent | null {
	if (typeof window === 'undefined') return null;

	try {
		const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
		if (!stored) return null;

		const data: StoredConsent = JSON.parse(stored);

		// Version check for future migrations
		if (data.version !== CONSENT_VERSION) {
			console.warn('Cookie consent version mismatch, resetting...');
			return null;
		}

		return data;
	} catch (error) {
		console.error('Failed to load cookie consent:', error);
		return null;
	}
}

/**
 * Save consent to localStorage
 */
function saveConsent(
	preferences: ConsentPreferences,
	hasInteracted: boolean,
	lastReminder?: number
): void {
	if (typeof window === 'undefined') return;

	try {
		const data: StoredConsent = {
			version: CONSENT_VERSION,
			preferences,
			timestamp: Date.now(),
			hasInteracted,
			lastReminder
		};
		localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save cookie consent:', error);
	}
}

/**
 * Check if it's time to show a reminder for partial consent
 */
function shouldShowReminder(stored: StoredConsent | null): boolean {
	if (!stored) return false;
	if (!stored.hasInteracted) return false;
	// Only show reminder if user chose necessary-only (analytics = false)
	if (stored.preferences.analytics) return false;

	const now = Date.now();
	const lastReminder = stored.lastReminder ?? stored.timestamp;
	return now - lastReminder >= REMINDER_INTERVAL_MS;
}

/**
 * Clear non-consented storage when user changes preferences
 */
function clearNonConsentedStorage(preferences: ConsentPreferences): void {
	if (typeof window === 'undefined') return;

	// If functional cookies not consented, clear theme preference
	if (!preferences.functional) {
		// Don't clear theme cookie - it's needed for basic functionality
		// But we won't track it for analytics
	}

	// If analytics not consented, clear tracking data
	if (!preferences.analytics) {
		localStorage.removeItem('visited'); // User type tracking
	}
}

/**
 * Create the cookie consent store
 */
export function createCookieConsentStore() {
	const stored = loadConsent();

	let preferences = $state<ConsentPreferences>(stored?.preferences ?? { ...DEFAULT_PREFERENCES });
	let hasInteracted = $state<boolean>(stored?.hasInteracted ?? false);
	let isReminderMode = $state<boolean>(shouldShowReminder(stored));
	let lastReminderTime = $state<number | undefined>(stored?.lastReminder);
	let isSettingsOpen = $state<boolean>(false); // For manual settings opening

	function acceptAll() {
		preferences = {
			necessary: true,
			functional: true, // Always true
			analytics: true
		};
		hasInteracted = true;
		isReminderMode = false;
		isSettingsOpen = false;
		saveConsent(preferences, true, undefined);
	}

	function acceptNecessaryOnly() {
		preferences = {
			necessary: true,
			functional: true, // Always true (necessary for app functionality)
			analytics: false
		};
		hasInteracted = true;
		isReminderMode = false;
		isSettingsOpen = false;
		// Set lastReminder to now when user chooses necessary-only
		lastReminderTime = Date.now();
		saveConsent(preferences, true, lastReminderTime);
		clearNonConsentedStorage(preferences);
	}

	function acceptCustom(prefs: Partial<ConsentPreferences>) {
		preferences = {
			necessary: true, // Always required
			functional: true, // Always true (necessary for app functionality)
			analytics: prefs.analytics ?? false
		};
		hasInteracted = true;
		isReminderMode = false;
		isSettingsOpen = false;
		// Set lastReminder if analytics is still false
		if (!prefs.analytics) {
			lastReminderTime = Date.now();
		} else {
			lastReminderTime = undefined;
		}
		saveConsent(preferences, true, lastReminderTime);
		clearNonConsentedStorage(preferences);
	}

	function hasConsent(category: CookieCategory): boolean {
		return preferences[category];
	}

	function resetConsent() {
		preferences = { ...DEFAULT_PREFERENCES };
		hasInteracted = false;
		isReminderMode = false;
		lastReminderTime = undefined;
		if (typeof window !== 'undefined') {
			localStorage.removeItem(CONSENT_STORAGE_KEY);
		}
	}

	function dismissReminder() {
		// User dismissed the reminder without changing preferences
		// Update lastReminder to postpone the next reminder
		isReminderMode = false;
		isSettingsOpen = false;
		lastReminderTime = Date.now();
		saveConsent(preferences, hasInteracted, lastReminderTime);
	}

	function openSettings() {
		// Open the banner to allow user to change their preferences
		// This implements the GDPR right to withdraw consent
		isSettingsOpen = true;
	}

	const store: CookieConsentContext = {
		get preferences() {
			return preferences;
		},
		get hasInteracted() {
			return hasInteracted;
		},
		get shouldShowBanner() {
			// Show if: never interacted OR it's time for a reminder OR user manually opened settings
			return !hasInteracted || isReminderMode || isSettingsOpen;
		},
		get isReminder() {
			return isReminderMode;
		},
		acceptAll,
		acceptNecessaryOnly,
		acceptCustom,
		hasConsent,
		resetConsent,
		dismissReminder,
		openSettings
	};

	setContext(CONSENT_CONTEXT_KEY, store);

	return store;
}

/**
 * Get cookie consent store from context
 */
export function useCookieConsent(): CookieConsentContext {
	const context = getContext<CookieConsentContext | undefined>(CONSENT_CONTEXT_KEY);

	if (!context) {
		// Fallback for components not under consent provider
		// Returns a read-only store that checks localStorage directly
		const stored = loadConsent();
		const isReminderMode = shouldShowReminder(stored);

		return {
			get preferences() {
				return stored?.preferences ?? { ...DEFAULT_PREFERENCES };
			},
			get hasInteracted() {
				return stored?.hasInteracted ?? false;
			},
			get shouldShowBanner() {
				return !(stored?.hasInteracted ?? false) || isReminderMode;
			},
			get isReminder() {
				return isReminderMode;
			},
			acceptAll: () => console.warn('Cookie consent store not initialized'),
			acceptNecessaryOnly: () => console.warn('Cookie consent store not initialized'),
			acceptCustom: () => console.warn('Cookie consent store not initialized'),
			hasConsent: (category: CookieCategory) => {
				// Necessary and functional are always true
				if (category === 'necessary' || category === 'functional') return true;
				return stored?.preferences?.[category] ?? false;
			},
			resetConsent: () => console.warn('Cookie consent store not initialized'),
			dismissReminder: () => console.warn('Cookie consent store not initialized'),
			openSettings: () => console.warn('Cookie consent store not initialized')
		};
	}

	return context;
}

/**
 * Check consent directly without context (for use in utility functions)
 * This is useful for checking consent in non-component code
 *
 * Note: 'necessary' and 'functional' always return true as they are
 * essential for app functionality. Only 'analytics' requires explicit consent.
 */
export function checkConsent(category: CookieCategory): boolean {
	// Necessary and functional are always allowed (essential for app)
	if (category === 'necessary' || category === 'functional') {
		return true;
	}

	if (typeof window === 'undefined') return false;

	const stored = loadConsent();
	if (!stored) {
		// No consent given yet - analytics not allowed
		return false;
	}

	return stored.preferences[category];
}

/**
 * Check if user has interacted with consent banner
 */
export function hasConsentInteraction(): boolean {
	if (typeof window === 'undefined') return false;

	const stored = loadConsent();
	return stored?.hasInteracted ?? false;
}
