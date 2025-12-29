/**
 * Usage Quota Store
 *
 * Tracks daily usage for features with free quotas.
 * - Per-feature, per-address tracking
 * - Daily reset (by date string)
 * - Protected with checksum to prevent tampering
 */

import { get, set, del, keys } from 'idb-keyval';
import { getContext, setContext } from 'svelte';
import type { Address } from 'viem';
import type { UsageRecord, UsageQuotaStoreState } from '../types';
import { generateChecksum, verifyChecksum, createUsageChecksumData } from '../utils/checksum';
import { getTodayDate, getCutoffDate } from '../utils/date';

const USAGE_STORE_KEY = Symbol('usage-quota-store');
const CACHE_KEY_PREFIX = 'biubiu-usage';

/**
 * Generate cache key for IndexedDB
 */
function getCacheKey(address: Address, featureId: string, date: string): string {
	return `${CACHE_KEY_PREFIX}:${address.toLowerCase()}:${featureId}:${date}`;
}

/**
 * Create usage quota store
 */
export function createUsageQuotaStore() {
	let address = $state<Address | null>(null);

	/**
	 * Update address when wallet connection changes
	 */
	function setAddress(newAddress: Address | null): void {
		address = newAddress;
	}

	/**
	 * Get daily usage for a feature
	 */
	async function getDailyUsage(featureId: string): Promise<number> {
		if (!address) return 0;

		try {
			const today = getTodayDate();
			const key = getCacheKey(address, featureId, today);
			const record = await get<UsageRecord>(key);

			if (!record) return 0;

			// Verify checksum
			const checksumData = createUsageChecksumData(
				record.address,
				record.featureId,
				record.date,
				record.count
			);
			const isValid = await verifyChecksum(checksumData, record.checksum);

			if (!isValid) {
				console.warn('Usage record integrity check failed - possible tampering');
				await del(key);
				return 0;
			}

			// Check if record is for today
			if (record.date !== today) {
				// Old record, treat as 0
				return 0;
			}

			return record.count;
		} catch (error) {
			console.error('Failed to get daily usage:', error);
			return 0;
		}
	}

	/**
	 * Record usage for a feature
	 */
	async function recordUsage(featureId: string, count: number): Promise<void> {
		if (!address) return;

		try {
			const today = getTodayDate();
			const key = getCacheKey(address, featureId, today);

			// Get current count
			const currentCount = await getDailyUsage(featureId);
			const newCount = currentCount + count;

			// Generate checksum
			const checksumData = createUsageChecksumData(address, featureId, today, newCount);
			const checksum = await generateChecksum(checksumData);

			const record: UsageRecord = {
				address,
				featureId,
				date: today,
				count: newCount,
				checksum
			};

			await set(key, record);
		} catch (error) {
			console.error('Failed to record usage:', error);
		}
	}

	/**
	 * Get remaining quota for a feature
	 */
	async function getRemainingQuota(featureId: string, dailyLimit: number): Promise<number> {
		const used = await getDailyUsage(featureId);
		return Math.max(0, dailyLimit - used);
	}

	/**
	 * Clear usage for a feature (for testing/admin)
	 */
	async function clearUsage(featureId: string): Promise<void> {
		if (!address) return;

		try {
			const today = getTodayDate();
			const key = getCacheKey(address, featureId, today);
			await del(key);
		} catch (error) {
			console.error('Failed to clear usage:', error);
		}
	}

	/**
	 * Clean up old usage records (older than 7 days)
	 */
	async function cleanupOldRecords(): Promise<void> {
		try {
			const allKeys = await keys();
			const cutoffDate = getCutoffDate(7);

			for (const key of allKeys) {
				if (typeof key === 'string' && key.startsWith(CACHE_KEY_PREFIX)) {
					// Extract date from key (last segment)
					const parts = key.split(':');
					const recordDate = parts[parts.length - 1];

					if (recordDate < cutoffDate) {
						await del(key);
					}
				}
			}
		} catch (error) {
			console.error('Failed to cleanup old records:', error);
		}
	}

	const store: UsageQuotaStoreState & {
		setAddress: typeof setAddress;
		cleanupOldRecords: typeof cleanupOldRecords;
	} = {
		getDailyUsage,
		recordUsage,
		getRemainingQuota,
		clearUsage,
		setAddress,
		cleanupOldRecords
	};

	setContext(USAGE_STORE_KEY, store);

	return store;
}

/**
 * Use usage quota store from context
 */
export function useUsageQuotaStore() {
	const store = getContext<ReturnType<typeof createUsageQuotaStore>>(USAGE_STORE_KEY);
	if (!store) {
		throw new Error(
			'Usage quota store not found. Make sure to call createUsageQuotaStore() in a parent component.'
		);
	}
	return store;
}
