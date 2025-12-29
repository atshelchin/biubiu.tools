/**
 * Signature-based Anti-Tampering Module
 *
 * Uses wallet signature + browser fingerprint for checksum generation.
 * This prevents users from forging checksums even if they know the code,
 * AND prevents copying cached data to another browser/device.
 *
 * Security layers:
 * 1. SHA-256 checksum (base protection)
 * 2. Wallet signature as personalized salt (requires private key)
 * 3. Browser fingerprint (prevents cross-device copying)
 *
 * Flow:
 * 1. First wallet connection → request signature (one-time per address)
 * 2. Signature + fingerprint stored in IndexedDB
 * 3. Combined hash used as salt for all checksums
 *
 * UX considerations:
 * - Signature requested only once per address (cached)
 * - Works across all networks (signature is chain-agnostic)
 * - Fingerprint is stable across sessions (same browser)
 */

import { get, set, del } from 'idb-keyval';
import type { Address, WalletClient } from 'viem';
import { getConfig } from '../config';
import { generateFingerprint, verifyFingerprint } from './fingerprint';

/** Signature cache key prefix */
const SIGNATURE_KEY_PREFIX = 'paywall-sig';

/** Message to sign (fixed, doesn't reveal sensitive info) */
const SIGN_MESSAGE = `Paywall Security Verification

This signature protects your membership data locally.
It will never be sent to any server.

Version: paywall-v1`;

/**
 * Cached signature data with fingerprint binding
 */
export interface SignatureCache {
	address: Address;
	signature: string;
	fingerprint: string; // Browser fingerprint at sign time
	signedAt: number;
}

/**
 * Get cache key for signature
 */
function getSignatureKey(address: Address): string {
	return `${SIGNATURE_KEY_PREFIX}:${address.toLowerCase()}`;
}

/**
 * Hash signature + fingerprint to create a deterministic salt
 */
async function hashSignatureWithFingerprint(
	signature: string,
	fingerprint: string
): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(`${signature}:${fingerprint}`);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Get cached signature for an address
 * Returns null if not found or fingerprint doesn't match
 */
export async function getCachedSignature(address: Address): Promise<SignatureCache | null> {
	try {
		const key = getSignatureKey(address);
		const cached = await get<SignatureCache>(key);

		if (!cached || cached.address.toLowerCase() !== address.toLowerCase()) {
			return null;
		}

		// Verify fingerprint matches current browser
		const fingerprintValid = await verifyFingerprint(cached.fingerprint);
		if (!fingerprintValid) {
			console.warn('[Signature] Fingerprint mismatch - cache from different device');
			// Don't delete, just return null (user might switch browsers occasionally)
			return null;
		}

		return cached;
	} catch (error) {
		console.error('Failed to get cached signature:', error);
		return null;
	}
}

/**
 * Check if valid signature exists for an address
 */
export async function hasValidSignature(address: Address): Promise<boolean> {
	const cached = await getCachedSignature(address);
	return cached !== null;
}

/**
 * Request signature from user's wallet
 * Only called once per address, result is cached with fingerprint
 */
export async function requestSignature(
	walletClient: WalletClient,
	address: Address
): Promise<SignatureCache> {
	// Check cache first
	const cached = await getCachedSignature(address);
	if (cached) {
		return cached;
	}

	// Generate fingerprint before signing
	const fingerprint = await generateFingerprint();

	// Request signature from wallet
	const signature = await walletClient.signMessage({
		account: address,
		message: SIGN_MESSAGE
	});

	// Cache the signature with fingerprint
	const cache: SignatureCache = {
		address,
		signature,
		fingerprint,
		signedAt: Date.now()
	};

	const key = getSignatureKey(address);
	await set(key, cache);

	return cache;
}

/**
 * Get personalized salt for checksum generation
 * Combines base salt with hashed (signature + fingerprint)
 *
 * @param address - User's wallet address
 * @returns Combined salt string, or base salt with fingerprint if no valid signature
 */
export async function getPersonalizedSalt(address: Address): Promise<string> {
	const config = getConfig();
	const cached = await getCachedSignature(address);

	if (!cached) {
		// Fallback to base salt + current fingerprint
		// This provides some protection even without signature
		const fingerprint = await generateFingerprint();
		return `${config.cache.checksumSalt}:fp:${fingerprint.slice(0, 8)}`;
	}

	const combinedHash = await hashSignatureWithFingerprint(cached.signature, cached.fingerprint);
	// Use first 24 chars of hash (96 bits of entropy)
	return `${config.cache.checksumSalt}:sig:${combinedHash.slice(0, 24)}`;
}

/**
 * Clear cached signature for an address
 * (for testing or if user wants to re-sign)
 */
export async function clearSignature(address: Address): Promise<void> {
	const key = getSignatureKey(address);
	await del(key);
}

/**
 * Generate checksum data string with personalized salt
 */
export async function createSecureChecksumData(
	address: Address,
	chainId: number,
	isMember: boolean,
	expiresAt: number,
	cachedAt: number
): Promise<string> {
	const salt = await getPersonalizedSalt(address);
	return `membership:${address.toLowerCase()}:${chainId}:${isMember}:${expiresAt}:${cachedAt}:${salt}`;
}

/**
 * Generate SHA-256 checksum with personalized salt
 */
export async function generateSecureChecksum(
	address: Address,
	chainId: number,
	isMember: boolean,
	expiresAt: number,
	cachedAt: number
): Promise<string> {
	const data = await createSecureChecksumData(address, chainId, isMember, expiresAt, cachedAt);
	const encoder = new TextEncoder();
	const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify checksum with personalized salt
 */
export async function verifySecureChecksum(
	address: Address,
	chainId: number,
	isMember: boolean,
	expiresAt: number,
	cachedAt: number,
	checksum: string
): Promise<boolean> {
	const expected = await generateSecureChecksum(address, chainId, isMember, expiresAt, cachedAt);
	return expected === checksum;
}
