/**
 * Membership Verification Worker
 *
 * Runs in background to verify cached membership status against on-chain data.
 * This prevents users from tampering with IndexedDB to fake membership.
 */

import { createPublicClient, http, type Address } from 'viem';
import { get, set, del } from 'idb-keyval';
import type { MembershipCache } from '../types';

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

const BIUBIU_PREMIUM_CONTRACT = '0xc5c4bb399938625523250B708dc5c1e7dE4b1626' as Address;
const CACHE_KEY_PREFIX = 'biubiu-membership';
const CHECKSUM_SALT = 'biubiu-paywall-v1';

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
 * Generate SHA-256 checksum
 */
async function generateChecksum(data: string): Promise<string> {
	const encoder = new TextEncoder();
	const dataWithSalt = encoder.encode(data + CHECKSUM_SALT);
	const hashBuffer = await crypto.subtle.digest('SHA-256', dataWithSalt);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Create checksum data string
 */
function createChecksumData(
	address: string,
	chainId: number,
	isMember: boolean,
	expiresAt: number,
	cachedAt: number
): string {
	return `membership:${address.toLowerCase()}:${chainId}:${isMember}:${expiresAt}:${cachedAt}`;
}

/**
 * Verify cached membership against on-chain data
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
		const result = await publicClient.readContract({
			address: BIUBIU_PREMIUM_CONTRACT,
			abi: BIUBIU_PREMIUM_ABI,
			functionName: 'getSubscriptionInfo',
			args: [address]
		});

		const [isPremium, expiryTime, remainingTime] = result;
		const onChainStatus = {
			isMember: isPremium,
			expiresAt: Number(expiryTime),
			remainingDays: Math.ceil(Number(remainingTime) / 86400)
		};

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

		// 5. Verify checksum first
		const checksumData = createChecksumData(
			cached.address,
			cached.chainId,
			cached.isMember,
			cached.expiresAt,
			cached.cachedAt
		);
		const expectedChecksum = await generateChecksum(checksumData);

		if (cached.checksum !== expectedChecksum) {
			// Checksum mismatch - cache was tampered
			console.warn('[Worker] Membership cache checksum mismatch - clearing');
			await del(cacheKey);
			return {
				type: 'verify-result',
				address,
				chainId,
				isValid: false,
				onChainStatus,
				cacheCleared: true,
				error: 'Cache integrity check failed'
			};
		}

		// 6. Compare cached vs on-chain status
		const now = Math.floor(Date.now() / 1000);

		// Case A: Cache says member, on-chain says not member
		if (cached.isMember && !isPremium) {
			console.warn('[Worker] Cache claims member but on-chain is not - clearing');
			await del(cacheKey);
			return {
				type: 'verify-result',
				address,
				chainId,
				isValid: false,
				onChainStatus,
				cacheCleared: true,
				error: 'Cached membership does not match on-chain status'
			};
		}

		// Case B: Cache expiry time doesn't match on-chain
		if (cached.expiresAt !== Number(expiryTime)) {
			// Update cache with correct on-chain data
			const newCachedAt = Date.now();
			const newChecksumData = createChecksumData(
				address,
				chainId,
				isPremium,
				Number(expiryTime),
				newCachedAt
			);
			const newChecksum = await generateChecksum(newChecksumData);

			const updatedCache: MembershipCache = {
				address,
				chainId,
				isMember: isPremium,
				expiresAt: Number(expiryTime),
				cachedAt: newCachedAt,
				checksum: newChecksum
			};

			await set(cacheKey, updatedCache);

			return {
				type: 'verify-result',
				address,
				chainId,
				isValid: false,
				onChainStatus,
				cacheCleared: false, // Updated, not cleared
				error: 'Cache expiry updated to match on-chain'
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
				error: 'Membership expired'
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
