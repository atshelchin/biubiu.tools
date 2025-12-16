/**
 * Balance Scanner Types Tests
 *
 * Tests for helper functions in types.ts
 */

import { describe, it, expect } from 'vitest';
import {
	getTaskKey,
	parseTaskKey,
	generateSessionId,
	calculateProgress,
	createInitialState,
	serializeState,
	deserializeState,
	DEFAULT_SCAN_CONFIG,
	type ScannerOptions,
	type ScanStats
} from './types';
import type { Address } from 'viem';

describe('types.ts helper functions', () => {
	describe('getTaskKey', () => {
		it('should generate correct task key', () => {
			const address = '0x1234567890abcdef1234567890abcdef12345678' as Address;
			const tokenId = '1:native';

			const key = getTaskKey(address, tokenId);

			expect(key).toBe('0x1234567890abcdef1234567890abcdef12345678:1:native');
		});

		it('should lowercase the address', () => {
			const address = '0xABCDEF1234567890ABCDEF1234567890ABCDEF12' as Address;
			const tokenId = '1:0xtoken';

			const key = getTaskKey(address, tokenId);

			expect(key).toBe('0xabcdef1234567890abcdef1234567890abcdef12:1:0xtoken');
		});
	});

	describe('parseTaskKey', () => {
		it('should parse task key correctly', () => {
			const key = '0x1234567890abcdef1234567890abcdef12345678:1:native';

			const result = parseTaskKey(key);

			expect(result.address).toBe('0x1234567890abcdef1234567890abcdef12345678');
			expect(result.tokenId).toBe('1:native');
		});

		it('should handle ERC20 token ids with colons', () => {
			const key = '0xaddr:1:0xtoken';

			const result = parseTaskKey(key);

			expect(result.address).toBe('0xaddr');
			// Note: current implementation only splits on first colon
			expect(result.tokenId).toBe('1:0xtoken');
		});
	});

	describe('generateSessionId', () => {
		it('should generate unique session IDs', () => {
			const id1 = generateSessionId();
			const id2 = generateSessionId();

			expect(id1).not.toBe(id2);
		});

		it('should start with "scan_"', () => {
			const id = generateSessionId();

			expect(id.startsWith('scan_')).toBe(true);
		});

		it('should contain timestamp', () => {
			const before = Date.now();
			const id = generateSessionId();
			const after = Date.now();

			// Extract timestamp from ID (format: scan_TIMESTAMP_RANDOM)
			const parts = id.split('_');
			const timestamp = parseInt(parts[1], 10);

			expect(timestamp).toBeGreaterThanOrEqual(before);
			expect(timestamp).toBeLessThanOrEqual(after);
		});
	});

	describe('calculateProgress', () => {
		it('should return 0 for empty stats', () => {
			const stats: ScanStats = {
				total: 0,
				success: 0,
				failed: 0,
				pending: 0,
				progress: 0
			};

			expect(calculateProgress(stats)).toBe(0);
		});

		it('should calculate correct percentage', () => {
			const stats: ScanStats = {
				total: 100,
				success: 50,
				failed: 10,
				pending: 40,
				progress: 0
			};

			expect(calculateProgress(stats)).toBe(50);
		});

		it('should return 100 when all tasks are successful', () => {
			const stats: ScanStats = {
				total: 100,
				success: 100,
				failed: 0,
				pending: 0,
				progress: 0
			};

			expect(calculateProgress(stats)).toBe(100);
		});

		it('should round to nearest integer', () => {
			const stats: ScanStats = {
				total: 3,
				success: 1,
				failed: 0,
				pending: 2,
				progress: 0
			};

			expect(calculateProgress(stats)).toBe(33);
		});
	});

	describe('createInitialState', () => {
		const baseOptions: ScannerOptions = {
			chainId: 1,
			addresses: [
				'0x1111111111111111111111111111111111111111' as Address,
				'0x2222222222222222222222222222222222222222' as Address
			],
			tokens: [
				{ id: '1:native', decimals: 18, chainId: 1, symbol: 'ETH' },
				{
					id: '1:0xtoken',
					address: '0xtoken' as Address,
					decimals: 6,
					chainId: 1,
					symbol: 'USDT'
				}
			],
			rpcEndpoints: [{ url: 'https://rpc.example.com' }],
			networkName: 'Ethereum',
			networkSymbol: 'ETH'
		};

		it('should create state with correct addresses and tokens', () => {
			const state = createInitialState(baseOptions);

			expect(state.addresses).toHaveLength(2);
			expect(state.tokens).toHaveLength(2);
			expect(state.chainId).toBe(1);
		});

		it('should initialize all tasks as pending', () => {
			const state = createInitialState(baseOptions);

			// 2 addresses × 2 tokens = 4 tasks
			expect(state.taskStatus.size).toBe(4);

			for (const status of state.taskStatus.values()) {
				expect(status).toBe('pending');
			}
		});

		it('should calculate correct initial stats', () => {
			const state = createInitialState(baseOptions);

			expect(state.stats.total).toBe(4);
			expect(state.stats.pending).toBe(4);
			expect(state.stats.success).toBe(0);
			expect(state.stats.failed).toBe(0);
			expect(state.stats.progress).toBe(0);
		});

		it('should use default config when not provided', () => {
			const state = createInitialState(baseOptions);

			expect(state.config.batchSize).toBe(DEFAULT_SCAN_CONFIG.batchSize);
			expect(state.config.maxRetries).toBe(DEFAULT_SCAN_CONFIG.maxRetries);
		});

		it('should merge custom config with defaults', () => {
			const state = createInitialState({
				...baseOptions,
				config: { batchSize: 500 }
			});

			expect(state.config.batchSize).toBe(500);
			expect(state.config.maxRetries).toBe(DEFAULT_SCAN_CONFIG.maxRetries);
		});

		it('should generate unique session ID', () => {
			const state1 = createInitialState(baseOptions);
			const state2 = createInitialState(baseOptions);

			expect(state1.sessionId).not.toBe(state2.sessionId);
		});

		it('should set timestamps', () => {
			const before = Date.now();
			const state = createInitialState(baseOptions);
			const after = Date.now();

			expect(state.startedAt).toBeGreaterThanOrEqual(before);
			expect(state.startedAt).toBeLessThanOrEqual(after);
			expect(state.lastActivityAt).toBeGreaterThanOrEqual(before);
			expect(state.lastActivityAt).toBeLessThanOrEqual(after);
		});

		it('should not be paused initially', () => {
			const state = createInitialState(baseOptions);

			expect(state.isPaused).toBe(false);
			expect(state.pauseReason).toBeUndefined();
		});
	});

	describe('serializeState and deserializeState', () => {
		const baseOptions: ScannerOptions = {
			chainId: 1,
			addresses: ['0x1111111111111111111111111111111111111111' as Address],
			tokens: [{ id: '1:native', decimals: 18, chainId: 1, symbol: 'ETH' }],
			rpcEndpoints: [{ url: 'https://rpc.example.com' }],
			networkName: 'Ethereum',
			networkSymbol: 'ETH'
		};

		it('should serialize and deserialize state correctly', () => {
			const originalState = createInitialState(baseOptions);

			const serialized = serializeState(originalState);
			const deserialized = deserializeState(serialized);

			expect(deserialized.sessionId).toBe(originalState.sessionId);
			expect(deserialized.chainId).toBe(originalState.chainId);
			expect(deserialized.addresses).toEqual(originalState.addresses);
			expect(deserialized.tokens).toEqual(originalState.tokens);
		});

		it('should preserve Map data structures', () => {
			const originalState = createInitialState(baseOptions);

			const serialized = serializeState(originalState);
			const deserialized = deserializeState(serialized);

			expect(deserialized.taskStatus).toBeInstanceOf(Map);
			expect(deserialized.balances).toBeInstanceOf(Map);
		});

		it('should preserve bigint balances', () => {
			const originalState = createInitialState(baseOptions);
			const key = getTaskKey(baseOptions.addresses[0], baseOptions.tokens[0].id);
			originalState.balances.set(key, 1000000000000000000n); // 1 ETH

			const serialized = serializeState(originalState);
			const deserialized = deserializeState(serialized);

			expect(deserialized.balances.get(key)).toBe(1000000000000000000n);
		});

		it('should produce valid JSON string', () => {
			const state = createInitialState(baseOptions);
			const serialized = serializeState(state);

			expect(() => JSON.parse(serialized)).not.toThrow();
		});
	});

	describe('DEFAULT_SCAN_CONFIG', () => {
		it('should have reasonable default values', () => {
			expect(DEFAULT_SCAN_CONFIG.batchSize).toBeGreaterThan(0);
			expect(DEFAULT_SCAN_CONFIG.maxRetries).toBeGreaterThan(0);
			expect(DEFAULT_SCAN_CONFIG.retryDelay).toBeGreaterThan(0);
			expect(DEFAULT_SCAN_CONFIG.rateLimitDelay).toBeGreaterThan(0);
			expect(DEFAULT_SCAN_CONFIG.maxConsecutiveErrors).toBeGreaterThan(0);
		});
	});
});
