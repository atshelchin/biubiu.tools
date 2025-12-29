/**
 * Membership Store
 *
 * Manages membership status with IndexedDB caching.
 * - Each chainId has independent membership status
 * - Cached until expiry (no periodic refresh needed)
 * - Protected with checksum to prevent tampering
 */

import { get, set, del } from 'idb-keyval';
import { getContext, setContext } from 'svelte';
import type { Address, PublicClient } from 'viem';
import type { MembershipCache, MembershipStoreState } from '../types';
import { generateChecksum, verifyChecksum, createMembershipChecksumData } from '../utils/checksum';
import { readMembershipStatus } from '../utils/contract';
import { verifyMembership } from '../composables/use-membership-verifier';

const MEMBERSHIP_STORE_KEY = Symbol('membership-store');
const CACHE_KEY_PREFIX = 'biubiu-membership';

// Background verification interval (5 minutes)
const VERIFY_INTERVAL_MS = 5 * 60 * 1000;

/**
 * Generate cache key for IndexedDB
 */
function getCacheKey(address: Address, chainId: number): string {
	return `${CACHE_KEY_PREFIX}:${address.toLowerCase()}:${chainId}`;
}

/**
 * Create membership store
 */
export function createMembershipStore() {
	// Reactive state
	let isMember = $state(false);
	let expiresAt = $state<number | null>(null);
	let remainingDays = $state(0);
	let isLoading = $state(false);
	let isVerifying = $state(false);
	let lastVerified = $state<number | null>(null);
	let chainId = $state<number | null>(null);
	let address = $state<Address | null>(null);
	let publicClient = $state<PublicClient | null>(null);
	let rpcUrl = $state<string | null>(null);
	let verifyIntervalId: ReturnType<typeof setInterval> | null = null;

	/**
	 * Load membership from cache
	 */
	async function loadFromCache(): Promise<MembershipCache | null> {
		if (!address || !chainId) return null;

		try {
			const key = getCacheKey(address, chainId);
			const cached = await get<MembershipCache>(key);

			if (!cached) return null;

			// Verify checksum
			const checksumData = createMembershipChecksumData(
				cached.address,
				cached.chainId,
				cached.isMember,
				cached.expiresAt,
				cached.cachedAt
			);
			const isValid = await verifyChecksum(checksumData, cached.checksum);

			if (!isValid) {
				console.warn('Membership cache integrity check failed - possible tampering');
				await del(key);
				return null;
			}

			// Check if expired
			const now = Math.floor(Date.now() / 1000);
			if (cached.expiresAt > 0 && cached.expiresAt < now) {
				// Membership expired, clear cache
				await del(key);
				return null;
			}

			return cached;
		} catch (error) {
			console.error('Failed to load membership from cache:', error);
			return null;
		}
	}

	/**
	 * Save membership to cache
	 */
	async function saveToCache(data: { isMember: boolean; expiresAt: number }): Promise<void> {
		if (!address || !chainId) return;

		try {
			const key = getCacheKey(address, chainId);
			const cachedAt = Date.now();

			const checksumData = createMembershipChecksumData(
				address,
				chainId,
				data.isMember,
				data.expiresAt,
				cachedAt
			);
			const checksum = await generateChecksum(checksumData);

			const cache: MembershipCache = {
				address,
				chainId,
				isMember: data.isMember,
				expiresAt: data.expiresAt,
				cachedAt,
				checksum
			};

			await set(key, cache);
		} catch (error) {
			console.error('Failed to save membership to cache:', error);
		}
	}

	/**
	 * Fetch membership status from contract
	 */
	async function fetchFromContract(): Promise<void> {
		if (!publicClient || !address) return;

		isLoading = true;

		try {
			const status = await readMembershipStatus(publicClient, address);

			isMember = status.isMember;
			expiresAt = status.expiresAt;
			remainingDays = status.remainingDays;

			// Cache the result
			await saveToCache({
				isMember: status.isMember,
				expiresAt: status.expiresAt
			});
		} catch (error) {
			console.error('Failed to fetch membership from contract:', error);
			isMember = false;
			expiresAt = null;
			remainingDays = 0;
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Initialize or update with new connection info
	 */
	async function update(
		newAddress: Address | null,
		newChainId: number | null,
		newPublicClient: PublicClient | null,
		newRpcUrl?: string | null
	): Promise<void> {
		const addressChanged = newAddress !== address;
		const chainChanged = newChainId !== chainId;

		address = newAddress;
		chainId = newChainId;
		publicClient = newPublicClient;
		rpcUrl = newRpcUrl ?? null;

		// Clear state if disconnected
		if (!newAddress || !newChainId) {
			stopBackgroundVerification();
			isMember = false;
			expiresAt = null;
			remainingDays = 0;
			lastVerified = null;
			return;
		}

		// If address or chain changed, reload membership
		if (addressChanged || chainChanged) {
			lastVerified = null;

			// Try cache first
			const cached = await loadFromCache();

			if (cached && cached.isMember) {
				// Valid cache exists
				isMember = cached.isMember;
				expiresAt = cached.expiresAt;
				const now = Math.floor(Date.now() / 1000);
				remainingDays = Math.max(0, Math.ceil((cached.expiresAt - now) / 86400));

				// Start background verification to validate cache
				if (rpcUrl) {
					startBackgroundVerification();
				}
			} else {
				// No cache or not a member, fetch from contract
				await fetchFromContract();
			}
		}
	}

	/**
	 * Force refresh from contract
	 */
	async function refresh(): Promise<void> {
		await fetchFromContract();
	}

	/**
	 * Verify cached membership against on-chain data using Web Worker
	 */
	async function verifyWithWorker(): Promise<boolean> {
		if (!address || !chainId || !rpcUrl) return true;

		// Don't verify if recently verified
		if (lastVerified && Date.now() - lastVerified < VERIFY_INTERVAL_MS) {
			return true;
		}

		isVerifying = true;

		try {
			const result = await verifyMembership(address, chainId, rpcUrl);

			lastVerified = Date.now();

			if (!result.isValid) {
				console.warn('[Membership] Verification failed:', result.error);

				// Update state from on-chain data if available
				if (result.onChainStatus) {
					isMember = result.onChainStatus.isMember;
					expiresAt = result.onChainStatus.expiresAt;
					remainingDays = result.onChainStatus.remainingDays;
				} else if (result.cacheCleared) {
					// Cache was cleared, fetch fresh
					await fetchFromContract();
				}

				return false;
			}

			return true;
		} catch (error) {
			console.error('[Membership] Verification error:', error);
			return false;
		} finally {
			isVerifying = false;
		}
	}

	/**
	 * Start background verification interval
	 */
	function startBackgroundVerification(): void {
		stopBackgroundVerification();

		// Initial verification after short delay
		setTimeout(() => {
			verifyWithWorker();
		}, 5000);

		// Periodic verification
		verifyIntervalId = setInterval(() => {
			verifyWithWorker();
		}, VERIFY_INTERVAL_MS);
	}

	/**
	 * Stop background verification
	 */
	function stopBackgroundVerification(): void {
		if (verifyIntervalId) {
			clearInterval(verifyIntervalId);
			verifyIntervalId = null;
		}
	}

	/**
	 * Clear membership state and cache
	 */
	async function clear(): Promise<void> {
		stopBackgroundVerification();

		if (address && chainId) {
			const key = getCacheKey(address, chainId);
			await del(key);
		}

		isMember = false;
		expiresAt = null;
		remainingDays = 0;
		lastVerified = null;
	}

	const store: MembershipStoreState & {
		update: typeof update;
		verifyWithWorker: typeof verifyWithWorker;
		startBackgroundVerification: typeof startBackgroundVerification;
		stopBackgroundVerification: typeof stopBackgroundVerification;
		readonly isVerifying: boolean;
		readonly lastVerified: number | null;
	} = {
		get isMember() {
			return isMember;
		},
		get expiresAt() {
			return expiresAt;
		},
		get remainingDays() {
			return remainingDays;
		},
		get isLoading() {
			return isLoading;
		},
		get chainId() {
			return chainId;
		},
		get address() {
			return address;
		},
		get isVerifying() {
			return isVerifying;
		},
		get lastVerified() {
			return lastVerified;
		},
		update,
		refresh,
		clear,
		verifyWithWorker,
		startBackgroundVerification,
		stopBackgroundVerification
	};

	setContext(MEMBERSHIP_STORE_KEY, store);

	return store;
}

/**
 * Use membership store from context
 */
export function useMembershipStore() {
	const store = getContext<ReturnType<typeof createMembershipStore>>(MEMBERSHIP_STORE_KEY);
	if (!store) {
		throw new Error(
			'Membership store not found. Make sure to call createMembershipStore() in a parent component.'
		);
	}
	return store;
}
