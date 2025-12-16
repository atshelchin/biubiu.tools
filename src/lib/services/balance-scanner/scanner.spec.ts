/**
 * Balance Scanner Tests
 *
 * Tests for the main BalanceScanner class.
 * These tests focus on state management and basic functionality
 * without mocking the actual RPC calls.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BalanceScanner, createScanner } from './scanner';
import type { ScannerOptions, TokenConfig } from './types';
import { createInitialState } from './types';
import type { Address } from 'viem';

describe('BalanceScanner', () => {
	const mockAddress1 = '0x1111111111111111111111111111111111111111' as Address;
	const mockAddress2 = '0x2222222222222222222222222222222222222222' as Address;

	const mockNativeToken: TokenConfig = {
		id: '1:native',
		decimals: 18,
		chainId: 1,
		symbol: 'ETH'
	};

	const mockERC20Token: TokenConfig = {
		id: '1:0xtoken',
		address: '0x3333333333333333333333333333333333333333' as Address,
		decimals: 6,
		chainId: 1,
		symbol: 'USDT'
	};

	const baseOptions: ScannerOptions = {
		chainId: 1,
		addresses: [mockAddress1, mockAddress2],
		tokens: [mockNativeToken],
		rpcEndpoints: [{ url: 'https://rpc.example.com', name: 'TestRPC' }],
		networkName: 'Ethereum',
		networkSymbol: 'ETH'
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('createScanner factory function', () => {
		it('should create a BalanceScanner instance', () => {
			const scanner = createScanner(baseOptions);

			expect(scanner).toBeInstanceOf(BalanceScanner);
		});
	});

	describe('constructor', () => {
		it('should initialize with correct state', () => {
			const scanner = new BalanceScanner(baseOptions);

			const state = scanner.getState();

			expect(state.chainId).toBe(1);
			expect(state.addresses).toHaveLength(2);
			expect(state.tokens).toHaveLength(1);
			expect(state.isPaused).toBe(false);
		});

		it('should initialize all tasks as pending', () => {
			const scanner = new BalanceScanner(baseOptions);

			const stats = scanner.getStats();

			expect(stats.total).toBe(2); // 2 addresses × 1 token
			expect(stats.pending).toBe(2);
			expect(stats.success).toBe(0);
			expect(stats.failed).toBe(0);
		});

		it('should use custom config when provided', () => {
			const scanner = new BalanceScanner({
				...baseOptions,
				config: { batchSize: 500 }
			});

			const state = scanner.getState();

			expect(state.config.batchSize).toBe(500);
		});

		it('should restore from initial state', () => {
			const initialState = createInitialState(baseOptions);
			initialState.stats.success = 1;

			const scanner = new BalanceScanner({
				...baseOptions,
				initialState
			});

			const stats = scanner.getStats();

			expect(stats.success).toBe(1);
		});
	});

	describe('getState', () => {
		it('should return current scan state', () => {
			const scanner = new BalanceScanner(baseOptions);

			const state = scanner.getState();

			expect(state).toBeDefined();
			expect(state.sessionId).toBeDefined();
			expect(state.taskStatus).toBeInstanceOf(Map);
		});
	});

	describe('getStats', () => {
		it('should return current statistics', () => {
			const scanner = new BalanceScanner(baseOptions);

			const stats = scanner.getStats();

			expect(stats.total).toBeDefined();
			expect(stats.success).toBeDefined();
			expect(stats.failed).toBeDefined();
			expect(stats.pending).toBeDefined();
			expect(stats.progress).toBeDefined();
		});
	});

	describe('isComplete', () => {
		it('should return false when tasks are pending', () => {
			const scanner = new BalanceScanner(baseOptions);

			expect(scanner.isComplete()).toBe(false);
		});

		it('should return true when all tasks are successful', () => {
			const initialState = createInitialState(baseOptions);

			// Mark all tasks as successful
			for (const key of initialState.taskStatus.keys()) {
				initialState.taskStatus.set(key, 'success');
			}
			initialState.stats = {
				total: 2,
				success: 2,
				failed: 0,
				pending: 0,
				progress: 100
			};

			const scanner = new BalanceScanner({
				...baseOptions,
				initialState
			});

			expect(scanner.isComplete()).toBe(true);
		});

		it('should return false when there are failed tasks', () => {
			const initialState = createInitialState(baseOptions);

			// Mark one task as failed
			const keys = [...initialState.taskStatus.keys()];
			initialState.taskStatus.set(keys[0], 'success');
			initialState.taskStatus.set(keys[1], 'failed');
			initialState.stats = {
				total: 2,
				success: 1,
				failed: 1,
				pending: 0,
				progress: 50
			};

			const scanner = new BalanceScanner({
				...baseOptions,
				initialState
			});

			expect(scanner.isComplete()).toBe(false);
		});
	});

	describe('getIsRunning', () => {
		it('should return false initially', () => {
			const scanner = new BalanceScanner(baseOptions);

			expect(scanner.getIsRunning()).toBe(false);
		});
	});

	describe('pause', () => {
		it('should set paused state', () => {
			const scanner = new BalanceScanner(baseOptions);

			scanner.pause();

			const state = scanner.getState();
			expect(state.isPaused).toBe(true);
			expect(state.pauseReason).toBe('user_pause');
		});
	});

	describe('multiple tokens', () => {
		it('should create tasks for all address-token combinations', () => {
			const scanner = new BalanceScanner({
				...baseOptions,
				tokens: [mockNativeToken, mockERC20Token]
			});

			const stats = scanner.getStats();

			// 2 addresses × 2 tokens = 4 tasks
			expect(stats.total).toBe(4);
			expect(stats.pending).toBe(4);
		});
	});

	describe('resume functionality', () => {
		it('should resume from saved state with correct progress', () => {
			// Create initial state with one task already completed
			const initialState = createInitialState(baseOptions);
			const keys = [...initialState.taskStatus.keys()];
			initialState.taskStatus.set(keys[0], 'success');
			initialState.balances.set(keys[0], 1000000000000000000n);
			initialState.stats = {
				total: 2,
				success: 1,
				failed: 0,
				pending: 1,
				progress: 50
			};

			const scanner = new BalanceScanner({
				...baseOptions,
				initialState
			});

			// Should start at 50% progress
			expect(scanner.getStats().progress).toBe(50);
			expect(scanner.getStats().success).toBe(1);
			expect(scanner.getStats().pending).toBe(1);
		});
	});

	describe('state consistency', () => {
		it('should have consistent task count across stats and taskStatus', () => {
			const scanner = new BalanceScanner({
				...baseOptions,
				addresses: [mockAddress1, mockAddress2],
				tokens: [mockNativeToken, mockERC20Token]
			});

			const state = scanner.getState();
			const stats = scanner.getStats();

			// Task count should match
			expect(state.taskStatus.size).toBe(stats.total);
			expect(stats.total).toBe(4); // 2 addresses × 2 tokens
		});

		it('should generate unique session IDs', () => {
			const scanner1 = new BalanceScanner(baseOptions);
			const scanner2 = new BalanceScanner(baseOptions);

			expect(scanner1.getState().sessionId).not.toBe(scanner2.getState().sessionId);
		});
	});
});
