// Geo-blocking store for client-side region detection
import { getContext, setContext } from 'svelte';
import { browser } from '$app/environment';

const GEO_BLOCK_CONTEXT_KEY = 'geo-block-context';

// Blocked countries list (ISO 3166-1 alpha-2 codes)
const BLOCKED_COUNTRIES = new Set([
	'CN', // China (Mainland)
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
		let detected = false;

		// Try Cloudflare's trace endpoint first (works when deployed to Cloudflare)
		try {
			const response = await fetch('/cdn-cgi/trace');
			if (response.ok) {
				const text = await response.text();
				const lines = text.split('\n');
				for (const line of lines) {
					if (line.startsWith('loc=')) {
						const code = line.substring(4).trim();
						countryCode = code;
						isBlocked = BLOCKED_COUNTRIES.has(code);
						detected = true;
						break;
					}
				}
			}
		} catch {
			// Cloudflare trace not available
		}

		// Fallback to external IP detection APIs
		if (!detected) {
			// Try multiple APIs in order of reliability
			const apis = [
				{
					url: 'https://api.country.is',
					getCode: (data: { country?: string }) => data.country
				},
				{
					// ip-api.com only works over HTTP (free tier)
					url:
						window.location.protocol === 'http:'
							? 'http://ip-api.com/json/?fields=countryCode'
							: null,
					getCode: (data: { countryCode?: string }) => data.countryCode
				}
			];

			for (const api of apis) {
				if (!api.url) continue;
				try {
					const response = await fetch(api.url);
					if (response.ok) {
						const data = await response.json();
						const code = api.getCode(data);
						if (code) {
							countryCode = code;
							isBlocked = BLOCKED_COUNTRIES.has(code);
							detected = true;
							break;
						}
					}
				} catch {
					// Try next API
				}
			}
		}

		// If all detection fails, don't block (fail open)
		if (!detected) {
			console.warn('Geo detection failed, allowing access');
			isBlocked = false;
		}

		isChecking = false;
	}

	// Only check on client side
	if (browser) {
		checkRegion();
	} else {
		isChecking = false;
	}

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
