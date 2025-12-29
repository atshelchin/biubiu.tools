/**
 * Tests for membership store
 *
 * Uses mocked IndexedDB and contract interactions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get, del } from 'idb-keyval';

// Mock idb-keyval
vi.mock('idb-keyval', () => ({
	get: vi.fn(),
	set: vi.fn(),
	del: vi.fn()
}));

// Mock svelte context
vi.mock('svelte', () => ({
	getContext: vi.fn(),
	setContext: vi.fn()
}));

// Mock contract utilities
vi.mock('../utils/contract', () => ({
	readMembershipStatus: vi.fn()
}));

// Mock membership verifier
vi.mock('../composables/use-membership-verifier', () => ({
	verifyMembership: vi.fn()
}));

// Mock signature utilities - use deterministic salt for testing
vi.mock('../utils/signature', () => ({
	generateSecureChecksum: vi.fn(async (address, chainId, isMember, expiresAt, cachedAt) => {
		// Simple deterministic checksum for testing
		const data = `test:${address}:${chainId}:${isMember}:${expiresAt}:${cachedAt}`;
		const encoder = new TextEncoder();
		const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	}),
	verifySecureChecksum: vi.fn(async (address, chainId, isMember, expiresAt, cachedAt, checksum) => {
		// Generate expected checksum and compare
		const data = `test:${address}:${chainId}:${isMember}:${expiresAt}:${cachedAt}`;
		const encoder = new TextEncoder();
		const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const expected = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
		return expected === checksum;
	})
}));

// Import mocked functions for generating test checksums
import { generateSecureChecksum } from '../utils/signature';

// Import after mocking
import { createMembershipStore } from './membership.svelte';
import { readMembershipStatus } from '../utils/contract';
import { verifyMembership } from '../composables/use-membership-verifier';

describe('MembershipStore', () => {
	const mockAddress = '0x1234567890abcdef1234567890abcdef12345678' as const;
	const chainId = 1;
	const mockPublicClient = {} as never;
	const mockRpcUrl = 'https://eth.example.com';

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date('2024-12-29T12:00:00Z'));
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('initial state', () => {
		it('should have default values', () => {
			const store = createMembershipStore();

			expect(store.isMember).toBe(false);
			expect(store.expiresAt).toBe(null);
			expect(store.remainingDays).toBe(0);
			expect(store.isLoading).toBe(false);
			expect(store.chainId).toBe(null);
			expect(store.address).toBe(null);
		});
	});

	describe('update', () => {
		it('should clear state when disconnected', async () => {
			const store = createMembershipStore();

			// First connect
			vi.mocked(get).mockResolvedValue(undefined);
			vi.mocked(readMembershipStatus).mockResolvedValue({
				isMember: true,
				expiresAt: Math.floor(Date.now() / 1000) + 86400 * 30,
				remainingDays: 30
			});

			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);
			expect(store.isMember).toBe(true);

			// Then disconnect
			await store.update(null, null, null);
			expect(store.isMember).toBe(false);
			expect(store.expiresAt).toBe(null);
			expect(store.remainingDays).toBe(0);
		});

		it('should load from cache if valid member', async () => {
			const expiresAt = Math.floor(Date.now() / 1000) + 86400 * 30;
			const cachedAt = Date.now() - 1000;

			// Use mocked generateSecureChecksum to create a valid checksum
			const checksum = await generateSecureChecksum(
				mockAddress,
				chainId,
				true,
				expiresAt,
				cachedAt
			);

			vi.mocked(get).mockResolvedValue({
				address: mockAddress,
				chainId,
				isMember: true,
				expiresAt,
				cachedAt,
				checksum
			});

			const store = createMembershipStore();
			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);

			expect(store.isMember).toBe(true);
			expect(store.expiresAt).toBe(expiresAt);
			expect(readMembershipStatus).not.toHaveBeenCalled();
		});

		it('should fetch from contract if no cache', async () => {
			vi.mocked(get).mockResolvedValue(undefined);
			vi.mocked(readMembershipStatus).mockResolvedValue({
				isMember: true,
				expiresAt: Math.floor(Date.now() / 1000) + 86400 * 30,
				remainingDays: 30
			});

			const store = createMembershipStore();
			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);

			expect(readMembershipStatus).toHaveBeenCalled();
			expect(store.isMember).toBe(true);
		});

		it('should fetch from contract if cache is not member', async () => {
			const expiresAt = 0;
			const cachedAt = Date.now() - 1000;

			// Use mocked generateSecureChecksum to create a valid checksum
			const checksum = await generateSecureChecksum(
				mockAddress,
				chainId,
				false,
				expiresAt,
				cachedAt
			);

			vi.mocked(get).mockResolvedValue({
				address: mockAddress,
				chainId,
				isMember: false,
				expiresAt,
				cachedAt,
				checksum
			});

			vi.mocked(readMembershipStatus).mockResolvedValue({
				isMember: false,
				expiresAt: 0,
				remainingDays: 0
			});

			const store = createMembershipStore();
			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);

			expect(readMembershipStatus).toHaveBeenCalled();
		});

		it('should invalidate cache with bad checksum', async () => {
			vi.mocked(get).mockResolvedValue({
				address: mockAddress,
				chainId,
				isMember: true,
				expiresAt: Math.floor(Date.now() / 1000) + 86400 * 30,
				cachedAt: Date.now() - 1000,
				checksum: 'invalid-checksum'
			});

			vi.mocked(readMembershipStatus).mockResolvedValue({
				isMember: false,
				expiresAt: 0,
				remainingDays: 0
			});

			const store = createMembershipStore();
			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);

			expect(del).toHaveBeenCalled();
			expect(readMembershipStatus).toHaveBeenCalled();
		});

		it('should invalidate expired cache', async () => {
			const expiresAt = Math.floor(Date.now() / 1000) - 86400; // Expired yesterday
			const cachedAt = Date.now() - 86400 * 2 * 1000;

			// Use mocked generateSecureChecksum to create a valid checksum
			const checksum = await generateSecureChecksum(
				mockAddress,
				chainId,
				true,
				expiresAt,
				cachedAt
			);

			vi.mocked(get).mockResolvedValue({
				address: mockAddress,
				chainId,
				isMember: true,
				expiresAt,
				cachedAt,
				checksum
			});

			vi.mocked(readMembershipStatus).mockResolvedValue({
				isMember: false,
				expiresAt: 0,
				remainingDays: 0
			});

			const store = createMembershipStore();
			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);

			expect(del).toHaveBeenCalled();
		});
	});

	describe('refresh', () => {
		it('should fetch from contract', async () => {
			vi.mocked(get).mockResolvedValue(undefined);
			vi.mocked(readMembershipStatus).mockResolvedValue({
				isMember: true,
				expiresAt: Math.floor(Date.now() / 1000) + 86400 * 30,
				remainingDays: 30
			});

			const store = createMembershipStore();
			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);

			vi.mocked(readMembershipStatus).mockClear();

			await store.refresh();
			expect(readMembershipStatus).toHaveBeenCalled();
		});
	});

	describe('clear', () => {
		it('should clear state and cache', async () => {
			vi.mocked(get).mockResolvedValue(undefined);
			vi.mocked(readMembershipStatus).mockResolvedValue({
				isMember: true,
				expiresAt: Math.floor(Date.now() / 1000) + 86400 * 30,
				remainingDays: 30
			});

			const store = createMembershipStore();
			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);

			expect(store.isMember).toBe(true);

			await store.clear();

			expect(store.isMember).toBe(false);
			expect(store.expiresAt).toBe(null);
			expect(del).toHaveBeenCalled();
		});
	});

	describe('verifyWithWorker', () => {
		it('should update state from on-chain data when verification fails', async () => {
			vi.mocked(get).mockResolvedValue(undefined);
			vi.mocked(readMembershipStatus).mockResolvedValue({
				isMember: true,
				expiresAt: Math.floor(Date.now() / 1000) + 86400 * 30,
				remainingDays: 30
			});

			vi.mocked(verifyMembership).mockResolvedValue({
				type: 'verify-result',
				address: mockAddress,
				chainId,
				isValid: false,
				onChainStatus: {
					isMember: false,
					expiresAt: 0,
					remainingDays: 0
				},
				cacheCleared: true,
				error: 'Cache mismatch'
			});

			const store = createMembershipStore();
			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);

			const result = await store.verifyWithWorker();

			expect(result).toBe(false);
			expect(store.isMember).toBe(false);
		});

		it('should return true when verification passes', async () => {
			vi.mocked(get).mockResolvedValue(undefined);
			vi.mocked(readMembershipStatus).mockResolvedValue({
				isMember: true,
				expiresAt: Math.floor(Date.now() / 1000) + 86400 * 30,
				remainingDays: 30
			});

			vi.mocked(verifyMembership).mockResolvedValue({
				type: 'verify-result',
				address: mockAddress,
				chainId,
				isValid: true,
				onChainStatus: {
					isMember: true,
					expiresAt: Math.floor(Date.now() / 1000) + 86400 * 30,
					remainingDays: 30
				},
				cacheCleared: false
			});

			const store = createMembershipStore();
			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);

			const result = await store.verifyWithWorker();

			expect(result).toBe(true);
			expect(store.isMember).toBe(true);
		});

		it('should skip verification if recently verified', async () => {
			vi.mocked(get).mockResolvedValue(undefined);
			vi.mocked(readMembershipStatus).mockResolvedValue({
				isMember: true,
				expiresAt: Math.floor(Date.now() / 1000) + 86400 * 30,
				remainingDays: 30
			});

			vi.mocked(verifyMembership).mockResolvedValue({
				type: 'verify-result',
				address: mockAddress,
				chainId,
				isValid: true,
				onChainStatus: null,
				cacheCleared: false
			});

			const store = createMembershipStore();
			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);

			// First verification
			await store.verifyWithWorker();
			expect(verifyMembership).toHaveBeenCalledTimes(1);

			// Second verification (within interval) - should skip
			await store.verifyWithWorker();
			expect(verifyMembership).toHaveBeenCalledTimes(1);

			// Advance time past interval (3 minutes = 180000ms)
			vi.advanceTimersByTime(3 * 60 * 1000 + 1000);

			// Third verification - should run
			await store.verifyWithWorker();
			expect(verifyMembership).toHaveBeenCalledTimes(2);
		});
	});

	describe('background verification', () => {
		it('should start and stop background verification', async () => {
			vi.mocked(get).mockResolvedValue(undefined);
			vi.mocked(readMembershipStatus).mockResolvedValue({
				isMember: true,
				expiresAt: Math.floor(Date.now() / 1000) + 86400 * 30,
				remainingDays: 30
			});

			vi.mocked(verifyMembership).mockResolvedValue({
				type: 'verify-result',
				address: mockAddress,
				chainId,
				isValid: true,
				onChainStatus: null,
				cacheCleared: false
			});

			const store = createMembershipStore();
			await store.update(mockAddress, chainId, mockPublicClient, mockRpcUrl);

			store.startBackgroundVerification();

			// Initial verification after 5 seconds - need to flush promises
			await vi.advanceTimersByTimeAsync(5000);
			expect(verifyMembership).toHaveBeenCalledTimes(1);

			// Stop background verification
			store.stopBackgroundVerification();

			// Advance time - no more verifications
			await vi.advanceTimersByTimeAsync(10 * 60 * 1000);
			expect(verifyMembership).toHaveBeenCalledTimes(1);
		});
	});
});
