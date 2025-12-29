/**
 * Tests for usage quota store
 *
 * Uses fake-indexeddb to mock IndexedDB operations
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get, set, del, keys } from 'idb-keyval';
import { generateChecksum, createUsageChecksumData } from '../utils/checksum';

// Mock idb-keyval
vi.mock('idb-keyval', () => ({
	get: vi.fn(),
	set: vi.fn(),
	del: vi.fn(),
	keys: vi.fn(),
	clear: vi.fn()
}));

// Mock svelte context
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn()
}));

// Import after mocking
import { createUsageQuotaStore } from './usage-quota.svelte';

describe('UsageQuotaStore', () => {
	const mockAddress = '0x1234567890abcdef1234567890abcdef12345678' as const;
	const featureId = 'balance-scanner';

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-12-29T12:00:00Z'));
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('getDailyUsage', () => {
		it('should return 0 when no address is set', async () => {
			const store = createUsageQuotaStore();
			const usage = await store.getDailyUsage(featureId);
			expect(usage).toBe(0);
		});

		it('should return 0 when no record exists', async () => {
			vi.mocked(get).mockResolvedValue(undefined);

			const store = createUsageQuotaStore();
			store.setAddress(mockAddress);

			const usage = await store.getDailyUsage(featureId);
			expect(usage).toBe(0);
		});

		it('should return count from valid record', async () => {
			const checksumData = createUsageChecksumData(mockAddress, featureId, '2024-12-29', 500);
			const checksum = await generateChecksum(checksumData);

			vi.mocked(get).mockResolvedValue({
				address: mockAddress,
				featureId,
				date: '2024-12-29',
				count: 500,
				checksum
			});

			const store = createUsageQuotaStore();
			store.setAddress(mockAddress);

			const usage = await store.getDailyUsage(featureId);
			expect(usage).toBe(500);
		});

		it('should return 0 for tampered record', async () => {
			vi.mocked(get).mockResolvedValue({
				address: mockAddress,
				featureId,
				date: '2024-12-29',
				count: 500,
				checksum: 'invalid-checksum'
			});

			const store = createUsageQuotaStore();
			store.setAddress(mockAddress);

			const usage = await store.getDailyUsage(featureId);
			expect(usage).toBe(0);
			expect(del).toHaveBeenCalled();
		});

		it('should return 0 for old record (different date)', async () => {
			const checksumData = createUsageChecksumData(mockAddress, featureId, '2024-12-28', 500);
			const checksum = await generateChecksum(checksumData);

			vi.mocked(get).mockResolvedValue({
				address: mockAddress,
				featureId,
				date: '2024-12-28', // Yesterday
				count: 500,
				checksum
			});

			const store = createUsageQuotaStore();
			store.setAddress(mockAddress);

			const usage = await store.getDailyUsage(featureId);
			expect(usage).toBe(0);
		});
	});

	describe('recordUsage', () => {
		it('should not record when no address is set', async () => {
			const store = createUsageQuotaStore();
			await store.recordUsage(featureId, 100);
			expect(set).not.toHaveBeenCalled();
		});

		it('should record new usage', async () => {
			vi.mocked(get).mockResolvedValue(undefined);

			const store = createUsageQuotaStore();
			store.setAddress(mockAddress);

			await store.recordUsage(featureId, 100);

			expect(set).toHaveBeenCalledWith(
				expect.stringContaining('biubiu-usage'),
				expect.objectContaining({
					address: mockAddress,
					featureId,
					date: '2024-12-29',
					count: 100
				})
			);
		});

		it('should accumulate usage', async () => {
			const checksumData = createUsageChecksumData(mockAddress, featureId, '2024-12-29', 200);
			const checksum = await generateChecksum(checksumData);

			vi.mocked(get).mockResolvedValue({
				address: mockAddress,
				featureId,
				date: '2024-12-29',
				count: 200,
				checksum
			});

			const store = createUsageQuotaStore();
			store.setAddress(mockAddress);

			await store.recordUsage(featureId, 100);

			expect(set).toHaveBeenCalledWith(
				expect.any(String),
				expect.objectContaining({
					count: 300 // 200 + 100
				})
			);
		});
	});

	describe('getRemainingQuota', () => {
		it('should return full quota when no usage', async () => {
			vi.mocked(get).mockResolvedValue(undefined);

			const store = createUsageQuotaStore();
			store.setAddress(mockAddress);

			const remaining = await store.getRemainingQuota(featureId, 1000);
			expect(remaining).toBe(1000);
		});

		it('should return remaining quota', async () => {
			const checksumData = createUsageChecksumData(mockAddress, featureId, '2024-12-29', 300);
			const checksum = await generateChecksum(checksumData);

			vi.mocked(get).mockResolvedValue({
				address: mockAddress,
				featureId,
				date: '2024-12-29',
				count: 300,
				checksum
			});

			const store = createUsageQuotaStore();
			store.setAddress(mockAddress);

			const remaining = await store.getRemainingQuota(featureId, 1000);
			expect(remaining).toBe(700);
		});

		it('should return 0 when quota exceeded', async () => {
			const checksumData = createUsageChecksumData(mockAddress, featureId, '2024-12-29', 1500);
			const checksum = await generateChecksum(checksumData);

			vi.mocked(get).mockResolvedValue({
				address: mockAddress,
				featureId,
				date: '2024-12-29',
				count: 1500,
				checksum
			});

			const store = createUsageQuotaStore();
			store.setAddress(mockAddress);

			const remaining = await store.getRemainingQuota(featureId, 1000);
			expect(remaining).toBe(0);
		});
	});

	describe('clearUsage', () => {
		it('should delete usage record', async () => {
			const store = createUsageQuotaStore();
			store.setAddress(mockAddress);

			await store.clearUsage(featureId);

			expect(del).toHaveBeenCalledWith(expect.stringContaining('biubiu-usage'));
		});
	});

	describe('cleanupOldRecords', () => {
		it('should delete records older than 7 days', async () => {
			vi.mocked(keys).mockResolvedValue([
				'biubiu-usage:0x123:feature:2024-12-29', // Today - keep
				'biubiu-usage:0x123:feature:2024-12-22', // 7 days ago - keep
				'biubiu-usage:0x123:feature:2024-12-21', // 8 days ago - delete
				'biubiu-usage:0x123:feature:2024-12-15' // 14 days ago - delete
			]);

			const store = createUsageQuotaStore();
			await store.cleanupOldRecords();

			expect(del).toHaveBeenCalledTimes(2);
			expect(del).toHaveBeenCalledWith('biubiu-usage:0x123:feature:2024-12-21');
			expect(del).toHaveBeenCalledWith('biubiu-usage:0x123:feature:2024-12-15');
		});

		it('should ignore non-usage keys', async () => {
			vi.mocked(keys).mockResolvedValue([
				'biubiu-membership:0x123:1',
				'other-key',
				'biubiu-usage:0x123:feature:2024-12-15'
			]);

			const store = createUsageQuotaStore();
			await store.cleanupOldRecords();

			expect(del).toHaveBeenCalledTimes(1);
			expect(del).toHaveBeenCalledWith('biubiu-usage:0x123:feature:2024-12-15');
		});
	});

	describe('setAddress', () => {
		it('should update address', async () => {
			vi.mocked(get).mockResolvedValue(undefined);

			const store = createUsageQuotaStore();

			// Initially no address
			const usage1 = await store.getDailyUsage(featureId);
			expect(usage1).toBe(0);
			expect(get).not.toHaveBeenCalled();

			// Set address
			store.setAddress(mockAddress);
			await store.getDailyUsage(featureId);
			expect(get).toHaveBeenCalled();
		});

		it('should handle null address', async () => {
			const store = createUsageQuotaStore();
			store.setAddress(mockAddress);
			store.setAddress(null);

			const usage = await store.getDailyUsage(featureId);
			expect(usage).toBe(0);
		});
	});
});
