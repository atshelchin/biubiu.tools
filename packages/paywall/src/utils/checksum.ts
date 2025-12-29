/**
 * Checksum utilities for anti-tampering protection
 * Uses SHA-256 with a configurable salt to prevent data manipulation in IndexedDB
 */

import { getConfig } from '../config';

/**
 * Generate SHA-256 checksum for data verification
 */
export async function generateChecksum(data: string): Promise<string> {
	const config = getConfig();
	const encoder = new TextEncoder();
	const dataWithSalt = encoder.encode(data + config.cache.checksumSalt);
	const hashBuffer = await crypto.subtle.digest('SHA-256', dataWithSalt);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify if the checksum matches the data
 */
export async function verifyChecksum(data: string, checksum: string): Promise<boolean> {
	const computed = await generateChecksum(data);
	return computed === checksum;
}

/**
 * Create checksum data string for membership cache
 */
export function createMembershipChecksumData(
	address: string,
	chainId: number,
	isMember: boolean,
	expiresAt: number,
	cachedAt: number
): string {
	return `membership:${address.toLowerCase()}:${chainId}:${isMember}:${expiresAt}:${cachedAt}`;
}

/**
 * Create checksum data string for usage record
 */
export function createUsageChecksumData(
	address: string,
	featureId: string,
	date: string,
	count: number
): string {
	return `usage:${address.toLowerCase()}:${featureId}:${date}:${count}`;
}
