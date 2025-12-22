// Geo-blocking store for client-side region detection
import { getContext, setContext } from 'svelte';

const GEO_BLOCK_CONTEXT_KEY = 'geo-block-context';

// Blocked countries list (ISO 3166-1 alpha-2 codes)
const BLOCKED_COUNTRIES = new Set([
	'CN', // China (Mainland)
	'RU', // Russia
	'KP', // North Korea
	'IR', // Iran
	'SY', // Syria
	'CU' // Cuba
]);

interface GeoBlockContext {
	isBlocked: boolean;
	isChecking: boolean;
	countryCode: string | null;
}

export function createGeoBlockStore() {
	let isBlocked = $state(false);
	let isChecking = $state(true);
	let countryCode = $state<string | null>(null);

	async function checkRegion() {
		if (typeof window === 'undefined') {
			isChecking = false;
			return;
		}

		try {
			// Use Cloudflare's trace endpoint - most reliable when on Cloudflare
			const response = await fetch('/cdn-cgi/trace');
			const text = await response.text();

			// Parse the trace response
			const lines = text.split('\n');
			for (const line of lines) {
				if (line.startsWith('loc=')) {
					const code = line.substring(4).trim();
					countryCode = code;
					isBlocked = BLOCKED_COUNTRIES.has(code);
					break;
				}
			}
		} catch {
			// Fallback to ip-api.com if Cloudflare trace fails (e.g., local dev)
			try {
				const response = await fetch('https://ipapi.co/json/');
				const data = await response.json();
				countryCode = data.country_code || null;
				if (countryCode) {
					isBlocked = BLOCKED_COUNTRIES.has(countryCode);
				}
			} catch {
				// If all detection fails, don't block (fail open)
				console.warn('Geo detection failed, allowing access');
				isBlocked = false;
			}
		} finally {
			isChecking = false;
		}
	}

	// Start checking immediately
	checkRegion();

	const store: GeoBlockContext = {
		get isBlocked() {
			return isBlocked;
		},
		get isChecking() {
			return isChecking;
		},
		get countryCode() {
			return countryCode;
		}
	};

	setContext(GEO_BLOCK_CONTEXT_KEY, store);
	return store;
}

export function useGeoBlock(): GeoBlockContext {
	const context = getContext<GeoBlockContext | undefined>(GEO_BLOCK_CONTEXT_KEY);

	if (!context) {
		// Return a safe default if not in context
		return {
			isBlocked: false,
			isChecking: false,
			countryCode: null
		};
	}

	return context;
}
