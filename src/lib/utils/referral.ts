import { get, set } from 'idb-keyval';
const REFERRAL_KEY = 'biubiu-referral';
const REFERRAL_EXPIRY_DAYS = 90;

/**
 * Ethereum zero address - used to mark direct visits (no referrer)
 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const;

export interface ReferralData {
	address: string;
	timestamp: number;
	expiresAt: number;
	checksum: string; // SHA256 hash of address for integrity verification
}

/**
 * Generate SHA256 checksum for address verification
 */
async function generateChecksum(address: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(address.toLowerCase());
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify if the checksum matches the address
 */
async function verifyChecksum(address: string, checksum: string): Promise<boolean> {
	const computed = await generateChecksum(address);
	return computed === checksum;
}

/**
 * Get the referral address from IndexedDB if valid
 */
export async function getReferralAddress(): Promise<string | null> {
	try {
		const data = await get<ReferralData>(REFERRAL_KEY);
		if (!data) return null;

		// Verify checksum to prevent tampering
		const isValid = await verifyChecksum(data.address, data.checksum);
		if (!isValid) {
			console.warn('Referral data integrity check failed - possible tampering detected');
			await clearReferral();
			return null;
		}

		// Check if expired
		if (Date.now() > data.expiresAt) {
			await clearReferral();
			return null;
		}

		return data.address;
	} catch (error) {
		console.error('Failed to get referral address:', error);
		return null;
	}
}

/**
 * Set referral address in IndexedDB (only if not already set)
 * @param address - The referrer's wallet address
 * @returns true if successfully set, false if already exists
 */
export async function setReferralAddress(address: string): Promise<boolean> {
	try {
		// Check if referral already exists
		const existing = await getReferralAddress();
		if (existing) {
			console.log('Referral already exists, not overwriting');
			return false;
		}

		const now = Date.now();
		const expiresAt = now + REFERRAL_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
		const checksum = await generateChecksum(address);

		const data: ReferralData = {
			address,
			timestamp: now,
			expiresAt,
			checksum
		};

		await set(REFERRAL_KEY, data);
		return true;
	} catch (error) {
		console.error('Failed to set referral address:', error);
		return false;
	}
}

/**
 * Clear referral data from IndexedDB
 */
export async function clearReferral(): Promise<void> {
	try {
		await set(REFERRAL_KEY, null);
	} catch (error) {
		console.error('Failed to clear referral:', error);
	}
}

/**
 * Generate referral URL with the given address
 */
export function generateReferralUrl(address: string): string {
	const url = new URL(window.location.href);
	url.searchParams.set('ref', address);
	return url.toString();
}

/**
 * Extract referral address from URL query parameters
 */
export function getReferralFromUrl(): string | null {
	if (typeof window === 'undefined') return null;

	const params = new URLSearchParams(window.location.search);
	return params.get('ref');
}

/**
 * Initialize referral system - check URL and store if needed
 * Should be called on app load
 * If no referral exists, sets ZERO_ADDRESS to lock the slot and prevent future referrals
 */
export async function initializeReferral(): Promise<void> {
	// Check if referral already exists
	const existing = await getReferralAddress();
	if (existing !== null) {
		// Already has a referral (or zero address), do nothing
		return;
	}

	// First visit: set referral from URL or zero address
	const refFromUrl = getReferralFromUrl();
	await setReferralAddress(refFromUrl || ZERO_ADDRESS);
}

/**
 * Check if user has a valid referrer (not zero address)
 * Use this when processing payments to determine commission
 */
export async function getValidReferrer(): Promise<string | null> {
	const address = await getReferralAddress();
	if (!address || address === ZERO_ADDRESS) {
		return null; // No referrer, platform gets 100%
	}
	return address; // Has referrer, pay 50% commission
}
