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
import type {
	CookieCategory,
	ConsentPreferences,
	StoredConsent,
	CookieConsentContext,
	CookieConsentOptions
} from './types.js';

const DEFAULT_CONTEXT_KEY = 'cookie-consent-context';
const DEFAULT_STORAGE_KEY = 'cookie-consent';
const DEFAULT_VERSION = 2;
const DEFAULT_REMINDER_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Default preferences - necessary always enabled, analytics requires consent
 */
const DEFAULT_PREFERENCES: ConsentPreferences = {
	necessary: true,
	functional: true, // Now always true (merged with necessary)
	analytics: false
};

/**
 * Load consent from localStorage
 */
function loadConsent(storageKey: string, version: number): StoredConsent | null {
	if (typeof window === 'undefined') return null;

	try {
		const stored = localStorage.getItem(storageKey);
		if (!stored) return null;

		const data: StoredConsent = JSON.parse(stored);

		// Version check for future migrations
		if (data.version !== version) {
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
	storageKey: string,
	version: number,
	preferences: ConsentPreferences,
	hasInteracted: boolean,
	lastReminder?: number
): void {
	if (typeof window === 'undefined') return;

	try {
		const data: StoredConsent = {
			version,
			preferences,
			timestamp: Date.now(),
			hasInteracted,
			lastReminder
		};
		localStorage.setItem(storageKey, JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save cookie consent:', error);
	}
}

/**
 * Check if it's time to show a reminder for partial consent
 */
function shouldShowReminder(stored: StoredConsent | null, reminderInterval: number): boolean {
	if (!stored) return false;
	if (!stored.hasInteracted) return false;
	// Only show reminder if user chose necessary-only (analytics = false)
	if (stored.preferences.analytics) return false;

	const now = Date.now();
	const lastReminder = stored.lastReminder ?? stored.timestamp;
	return now - lastReminder >= reminderInterval;
}

/**
 * Clear non-consented storage when user changes preferences
 */
function clearNonConsentedStorage(preferences: ConsentPreferences): void {
	if (typeof window === 'undefined') return;

	// If analytics not consented, clear tracking data
	if (!preferences.analytics) {
		localStorage.removeItem('visited'); // User type tracking
	}
}

/**
 * Create the cookie consent store
 *
 * @example
 * ```svelte
 * <script>
 *   import { createCookieConsentStore } from '@shelchin/cookie-consent';
 *
 *   const consent = createCookieConsentStore();
 * </script>
 *
 * {#if consent.shouldShowBanner}
 *   <CookieBanner {consent} />
 * {/if}
 * ```
 */
export function createCookieConsentStore(options: CookieConsentOptions = {}): CookieConsentContext {
	const {
		storageKey = DEFAULT_STORAGE_KEY,
		version = DEFAULT_VERSION,
		reminderInterval = DEFAULT_REMINDER_INTERVAL_MS
	} = options;

	const stored = loadConsent(storageKey, version);

	let preferences = $state<ConsentPreferences>(stored?.preferences ?? { ...DEFAULT_PREFERENCES });
	let hasInteracted = $state<boolean>(stored?.hasInteracted ?? false);
	let isReminderMode = $state<boolean>(shouldShowReminder(stored, reminderInterval));
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
		saveConsent(storageKey, version, preferences, true, undefined);
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
		saveConsent(storageKey, version, preferences, true, lastReminderTime);
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
		saveConsent(storageKey, version, preferences, true, lastReminderTime);
		clearNonConsentedStorage(preferences);
	}

	function hasConsentFn(category: CookieCategory): boolean {
		return preferences[category];
	}

	function resetConsent() {
		preferences = { ...DEFAULT_PREFERENCES };
		hasInteracted = false;
		isReminderMode = false;
		lastReminderTime = undefined;
		if (typeof window !== 'undefined') {
			localStorage.removeItem(storageKey);
		}
	}

	function dismissReminder() {
		// User dismissed the reminder without changing preferences
		// Update lastReminder to postpone the next reminder
		isReminderMode = false;
		isSettingsOpen = false;
		lastReminderTime = Date.now();
		saveConsent(storageKey, version, preferences, hasInteracted, lastReminderTime);
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
		hasConsent: hasConsentFn,
		resetConsent,
		dismissReminder,
		openSettings
	};

	setContext(DEFAULT_CONTEXT_KEY, store);

	return store;
}

/**
 * Get cookie consent store from context
 *
 * @example
 * ```svelte
 * <script>
 *   import { useCookieConsent } from '@shelchin/cookie-consent';
 *
 *   const consent = useCookieConsent();
 * </script>
 *
 * <button onclick={consent.acceptAll}>Accept All</button>
 * ```
 */
export function useCookieConsent(): CookieConsentContext {
	const context = getContext<CookieConsentContext | undefined>(DEFAULT_CONTEXT_KEY);

	if (!context) {
		// Fallback for components not under consent provider
		// Returns a read-only store that checks localStorage directly
		const stored = loadConsent(DEFAULT_STORAGE_KEY, DEFAULT_VERSION);
		const isReminderMode = shouldShowReminder(stored, DEFAULT_REMINDER_INTERVAL_MS);

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
 *
 * @example
 * ```ts
 * import { checkConsent } from '@shelchin/cookie-consent';
 *
 * if (checkConsent('analytics')) {
 *   // Track user behavior
 *   trackPageView();
 * }
 * ```
 */
export function checkConsent(
	category: CookieCategory,
	options: { storageKey?: string; version?: number } = {}
): boolean {
	const { storageKey = DEFAULT_STORAGE_KEY, version = DEFAULT_VERSION } = options;

	// Necessary and functional are always allowed (essential for app)
	if (category === 'necessary' || category === 'functional') {
		return true;
	}

	if (typeof window === 'undefined') return false;

	const stored = loadConsent(storageKey, version);
	if (!stored) {
		// No consent given yet - analytics not allowed
		return false;
	}

	return stored.preferences[category];
}

/**
 * Check if user has interacted with consent banner
 *
 * @example
 * ```ts
 * import { hasConsentInteraction } from '@shelchin/cookie-consent';
 *
 * if (!hasConsentInteraction()) {
 *   // Show consent banner
 * }
 * ```
 */
export function hasConsentInteraction(
	options: { storageKey?: string; version?: number } = {}
): boolean {
	const { storageKey = DEFAULT_STORAGE_KEY, version = DEFAULT_VERSION } = options;

	if (typeof window === 'undefined') return false;

	const stored = loadConsent(storageKey, version);
	return stored?.hasInteracted ?? false;
}
