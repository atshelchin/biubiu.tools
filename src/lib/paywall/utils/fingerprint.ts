/**
 * Browser Fingerprint Module
 *
 * Generates a stable browser fingerprint for security purposes.
 * This prevents copying IndexedDB data to another device.
 *
 * Note: This is NOT for tracking users. It's purely for local security.
 * The fingerprint never leaves the user's browser.
 *
 * Fingerprint components (privacy-friendly, no tracking):
 * - Screen resolution
 * - Color depth
 * - Timezone offset
 * - Platform
 * - Hardware concurrency
 * - Device memory (if available)
 * - Canvas fingerprint (optional, disabled by default)
 */

/**
 * Fingerprint components for hashing
 */
interface FingerprintComponents {
	screen: string;
	timezone: string;
	platform: string;
	hardware: string;
	languages: string;
}

/**
 * Check if running in browser environment
 */
function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof navigator !== 'undefined';
}

/**
 * Collect fingerprint components
 * Returns fallback values in non-browser environments (Node.js tests)
 */
function collectComponents(): FingerprintComponents {
	// Non-browser environment (Node.js tests) - return deterministic fallback
	if (!isBrowser()) {
		return {
			screen: 'server',
			timezone: '0',
			platform: 'node',
			hardware: '0-0',
			languages: 'en'
		};
	}

	const screen = [
		window.screen.width,
		window.screen.height,
		window.screen.colorDepth,
		window.devicePixelRatio || 1
	].join('x');

	const timezone = new Date().getTimezoneOffset().toString();

	// Platform info (generic, not identifying)
	const platform = navigator.platform || 'unknown';

	// Hardware info
	const hardware = [
		navigator.hardwareConcurrency || 0,
		(navigator as { deviceMemory?: number }).deviceMemory || 0
	].join('-');

	// Languages (first 3 only to avoid over-specificity)
	const languages = (navigator.languages || [navigator.language]).slice(0, 3).join(',');

	return {
		screen,
		timezone,
		platform,
		hardware,
		languages
	};
}

/**
 * Generate browser fingerprint hash
 * Returns a stable hash that identifies this browser instance
 * In non-browser environments, returns a deterministic test fingerprint
 */
export async function generateFingerprint(): Promise<string> {
	const components = collectComponents();

	// Combine all components
	const data = [
		components.screen,
		components.timezone,
		components.platform,
		components.hardware,
		components.languages
	].join('|');

	// Hash the combined data
	const encoder = new TextEncoder();
	const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// Return first 32 chars (128 bits) of the hash
	return hashArray
		.slice(0, 16)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Verify that the current browser matches a stored fingerprint
 */
export async function verifyFingerprint(storedFingerprint: string): Promise<boolean> {
	const currentFingerprint = await generateFingerprint();
	return currentFingerprint === storedFingerprint;
}

/**
 * Get a short fingerprint identifier for display/logging
 */
export async function getFingerprintShort(): Promise<string> {
	const fingerprint = await generateFingerprint();
	return fingerprint.slice(0, 8);
}
