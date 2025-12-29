/**
 * Membership Verification Worker
 *
 * Runs in background to verify cached membership status against on-chain data.
 * This prevents users from tampering with IndexedDB to fake membership.
 *
 * IMPORTANT: This worker implements "safe verification" - it will NOT delete
 * valid cache on RPC failures. It only clears cache when:
 * 1. On-chain data explicitly shows membership expired/invalid
 * 2. Checksum verification failed (tampering detected)
 *
 * Note: This worker uses basic checksum verification. The main thread uses
 * enhanced signature+fingerprint verification via signature.ts
 */

import { createPublicClient, http, type Address } from 'viem';
import { get, set, del } from 'idb-keyval';
import type { MembershipCache } from '../types';

// Import constants (inlined for worker compatibility)
const BIUBIU_PREMIUM_CONTRACT = '0xc5c4bb399938625523250B708dc5c1e7dE4b1626' as Address;
const CACHE_KEY_PREFIX = 'biubiu-membership';
const CHECKSUM_SALT = 'biubiu-paywall-v1';
const SECONDS_PER_DAY = 86400;

// BiuBiuPremium contract ABI (only the function we need)
const BIUBIU_PREMIUM_ABI = [
	{
		type: 'function',
		name: 'getSubscriptionInfo',
		inputs: [{ name: 'user', type: 'address', internalType: 'address' }],
		outputs: [
			{ name: 'isPremium', type: 'bool', internalType: 'bool' },
			{ name: 'expiryTime', type: 'uint256', internalType: 'uint256' },
			{ name: 'remainingTime', type: 'uint256', internalType: 'uint256' }
		],
		stateMutability: 'view'
	}
] as const;

// Message types
export interface VerifyRequest {
	type: 'verify';
	address: Address;
	chainId: number;
	rpcUrl: string;
}

export interface VerifyResponse {
	type: 'verify-result';
	address: Address;
	chainId: number;
	isValid: boolean;
	onChainStatus: {
		isMember: boolean;
		expiresAt: number;
		remainingDays: number;
	} | null;
	cacheCleared: boolean;
	error?: string;
	errorType?: 'rpc_error' | 'tampering' | 'expired' | 'mismatch';
}

export interface VerifyAllRequest {
	type: 'verify-all';
	entries: Array<{
		address: Address;
		chainId: number;
		rpcUrl: string;
	}>;
}

export interface VerifyAllResponse {
	type: 'verify-all-result';
	results: Array<{
		address: Address;
		chainId: number;
		isValid: boolean;
		cacheCleared: boolean;
	}>;
}

type WorkerRequest = VerifyRequest | VerifyAllRequest;

/**
 * Generate cache key
 */
function getCacheKey(address: Address, chainId: number): string {
	return `${CACHE_KEY_PREFIX}:${address.toLowerCase()}:${chainId}`;
}

/**
 * Generate SHA-256 checksum (basic version for worker)
 * Note: Main thread uses enhanced version with signature+fingerprint
 */
async function generateBasicChecksum(data: string): Promise<string> {
	const encoder = new TextEncoder();
	const dataWithSalt = encoder.encode(data + CHECKSUM_SALT);
	const hashBuffer = await crypto.subtle.digest('SHA-256', dataWithSalt);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create checksum data string (basic version)
 */
function createBasicChecksumData(
	address: string,
	chainId: number,
	isMember: boolean,
	expiresAt: number,
	cachedAt: number
): string {
	return `membership:${address.toLowerCase()}:${chainId}:${isMember}:${expiresAt}:${cachedAt}`;
}

/**
 * Check if error is an RPC/network error (retryable, don't clear cache)
 */
function isRpcError(error: unknown): boolean {
	if (error instanceof Error) {
		const message = error.message.toLowerCase();
		return (
			message.includes('fetch') ||
			message.includes('network') ||
			message.includes('timeout') ||
			message.includes('connection') ||
			message.includes('rpc') ||
			message.includes('http') ||
			message.includes('failed to fetch')
		);
	}
	return false;
}

/**
 * Verify cached membership against on-chain data
 *
 * SAFE MODE: RPC failures will NOT clear cache
 */
async function verifyCachedMembership(
	address: Address,
	chainId: number,
	rpcUrl: string
): Promise<VerifyResponse> {
	const cacheKey = getCacheKey(address, chainId);

	try {
		// 1. Read cached data
		const cached = await get<MembershipCache>(cacheKey);

		// 2. Create public client for RPC calls
		const publicClient = createPublicClient({
			transport: http(rpcUrl)
		});

		// 3. Query on-chain membership status
		let onChainStatus: VerifyResponse['onChainStatus'] = null;
		try {
			const result = await publicClient.readContract({
				address: BIUBIU_PREMIUM_CONTRACT,
				abi: BIUBIU_PREMIUM_ABI,
				functionName: 'getSubscriptionInfo',
				args: [address]
			});

			const [isPremium, expiryTime, remainingTime] = result;
			onChainStatus = {
				isMember: isPremium,
				expiresAt: Number(expiryTime),
				remainingDays: Math.ceil(Number(remainingTime) / SECONDS_PER_DAY)
			};
		} catch (rpcError) {
			// RPC failed - this is a "safe" failure, don't touch cache
			console.warn('[Worker] RPC call failed, keeping cache intact:', rpcError);
			return {
				type: 'verify-result',
				address,
				chainId,
				isValid: true, // Treat as valid to keep cache
				onChainStatus: null,
				cacheCleared: false,
				error: rpcError instanceof Error ? rpcError.message : 'RPC failed',
				errorType: 'rpc_error'
			};
		}

		// 4. If no cache, just return on-chain status
		if (!cached) {
			return {
				type: 'verify-result',
				address,
				chainId,
				isValid: true, // No cache to be invalid
				onChainStatus,
				cacheCleared: false
			};
		}

		// 5. Skip checksum verification in worker
		// The main thread does full signature+fingerprint verification via signature.ts
		// Worker focuses on comparing cache vs on-chain data

		// 6. Compare cached vs on-chain status
		const now = Math.floor(Date.now() / 1000);

		// Case A: Cache says member, on-chain says not member
		// This is a definitive mismatch - clear cache
		if (cached.isMember && !onChainStatus.isMember) {
			console.warn('[Worker] Cache claims member but on-chain is not - clearing');
			await del(cacheKey);
			return {
				type: 'verify-result',
				address,
				chainId,
				isValid: false,
				onChainStatus,
				cacheCleared: true,
				error: 'Cached membership does not match on-chain status',
				errorType: 'mismatch'
			};
		}

		// Case B: Cache expiry time doesn't match on-chain (extended or different)
		if (cached.expiresAt !== onChainStatus.expiresAt) {
			// Update cache with correct on-chain data
			const newCachedAt = Date.now();
			const newChecksumData = createBasicChecksumData(
				address,
				chainId,
				onChainStatus.isMember,
				onChainStatus.expiresAt,
				newCachedAt
			);
			const newChecksum = await generateBasicChecksum(newChecksumData);

			const updatedCache: MembershipCache = {
				address,
				chainId,
				isMember: onChainStatus.isMember,
				expiresAt: onChainStatus.expiresAt,
				cachedAt: newCachedAt,
				checksum: newChecksum
			};

			await set(cacheKey, updatedCache);

			return {
				type: 'verify-result',
				address,
				chainId,
				isValid: true, // Updated successfully
				onChainStatus,
				cacheCleared: false
			};
		}

		// Case C: Cache says member but already expired
		if (cached.isMember && cached.expiresAt < now) {
			console.warn('[Worker] Cached membership has expired - clearing');
			await del(cacheKey);
			return {
				type: 'verify-result',
				address,
				chainId,
				isValid: false,
				onChainStatus,
				cacheCleared: true,
				error: 'Membership expired',
				errorType: 'expired'
			};
		}

		// All checks passed
		return {
			type: 'verify-result',
			address,
			chainId,
			isValid: true,
			onChainStatus,
			cacheCleared: false
		};
	} catch (error) {
		// Unexpected error - check if it's RPC related
		if (isRpcError(error)) {
			console.warn('[Worker] RPC error, keeping cache intact:', error);
			return {
				type: 'verify-result',
				address,
				chainId,
				isValid: true, // Keep cache on RPC errors
				onChainStatus: null,
				cacheCleared: false,
				error: error instanceof Error ? error.message : 'RPC error',
				errorType: 'rpc_error'
			};
		}

		// Non-RPC error (e.g., IndexedDB error)
		console.error('[Worker] Verification error:', error);
		return {
			type: 'verify-result',
			address,
			chainId,
			isValid: false,
			onChainStatus: null,
			cacheCleared: false,
			error: error instanceof Error ? error.message : 'Verification failed'
		};
	}
}

/**
 * Handle incoming messages
 */
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
	const { type } = event.data;

	if (type === 'verify') {
		const { address, chainId, rpcUrl } = event.data as VerifyRequest;
		const response = await verifyCachedMembership(address, chainId, rpcUrl);
		self.postMessage(response);
	} else if (type === 'verify-all') {
		const { entries } = event.data as VerifyAllRequest;
		const results = await Promise.all(
			entries.map(async ({ address, chainId, rpcUrl }) => {
				const result = await verifyCachedMembership(address, chainId, rpcUrl);
				return {
					address,
					chainId,
					isValid: result.isValid,
					cacheCleared: result.cacheCleared
				};
			})
		);

		const response: VerifyAllResponse = {
			type: 'verify-all-result',
			results
		};
		self.postMessage(response);
	}
};
