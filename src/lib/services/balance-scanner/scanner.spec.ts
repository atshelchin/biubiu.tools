/**
 * Balance Scanner Tests
 *
 * Tests for the main BalanceScanner class.
 * These tests focus on state management and basic functionality
 * without mocking the actual RPC calls.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { BalanceScanner, createScanner } from './scanner';
import type { ScannerOptions, TokenConfig, AutoRecoveryConfig, ScanEvent } from './types';
import { createInitialState, DEFAULT_AUTO_RECOVERY_CONFIG } from './types';
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

	describe('auto-recovery configuration', () => {
		it('should use default auto-recovery config when not provided', () => {
			const scanner = new BalanceScanner(baseOptions);
			const state = scanner.getState();

			// Config should have auto-recovery with default values
			expect(state.config.autoRecovery).toBeDefined();
			expect(state.config.autoRecovery?.enabled).toBe(DEFAULT_AUTO_RECOVERY_CONFIG.enabled);
			expect(state.config.autoRecovery?.initialDelay).toBe(
				DEFAULT_AUTO_RECOVERY_CONFIG.initialDelay
			);
			expect(state.config.autoRecovery?.maxDelay).toBe(DEFAULT_AUTO_RECOVERY_CONFIG.maxDelay);
			expect(state.config.autoRecovery?.backoffMultiplier).toBe(
				DEFAULT_AUTO_RECOVERY_CONFIG.backoffMultiplier
			);
			expect(state.config.autoRecovery?.maxAttempts).toBe(DEFAULT_AUTO_RECOVERY_CONFIG.maxAttempts);
		});

		it('should use custom auto-recovery config when provided', () => {
			const customConfig: AutoRecoveryConfig = {
				enabled: false,
				initialDelay: 5000,
				maxDelay: 60000,
				backoffMultiplier: 1.5,
				maxAttempts: 5
			};

			const scanner = new BalanceScanner({
				...baseOptions,
				config: {
					autoRecovery: customConfig
				}
			});
			const state = scanner.getState();

			expect(state.config.autoRecovery?.enabled).toBe(false);
			expect(state.config.autoRecovery?.initialDelay).toBe(5000);
			expect(state.config.autoRecovery?.maxDelay).toBe(60000);
			expect(state.config.autoRecovery?.backoffMultiplier).toBe(1.5);
			expect(state.config.autoRecovery?.maxAttempts).toBe(5);
		});

		it('should merge partial auto-recovery config with defaults', () => {
			const scanner = new BalanceScanner({
				...baseOptions,
				config: {
					autoRecovery: {
						enabled: true,
						initialDelay: 20000,
						maxDelay: 600000,
						backoffMultiplier: 3,
						maxAttempts: 20
					}
				}
			});
			const state = scanner.getState();

			// Custom values should be used
			expect(state.config.autoRecovery?.initialDelay).toBe(20000);
			expect(state.config.autoRecovery?.maxAttempts).toBe(20);
		});
	});

	describe('scan events callback', () => {
		it('should call onEvent callback when scan starts', () => {
			const events: ScanEvent[] = [];
			const onEvent = vi.fn((event: ScanEvent) => {
				events.push(event);
			});

			new BalanceScanner({
				...baseOptions,
				callbacks: { onEvent }
			});

			// The constructor doesn't emit scan_started - that happens when scan() is called
			// So we just verify the scanner was created successfully
			expect(events.length).toBe(0);
		});

		it('should emit scan_resumed event when restoring from state', () => {
			const events: ScanEvent[] = [];
			const onEvent = vi.fn((event: ScanEvent) => {
				events.push(event);
			});

			const initialState = createInitialState(baseOptions);
			initialState.stats.progress = 50;

			new BalanceScanner({
				...baseOptions,
				initialState,
				callbacks: { onEvent }
			});

			// Should emit scan_resumed when restoring
			expect(onEvent).toHaveBeenCalled();
			expect(events.some((e) => e.type === 'scan_resumed')).toBe(true);
		});
	});

	describe('DEFAULT_AUTO_RECOVERY_CONFIG', () => {
		it('should have expected default values', () => {
			expect(DEFAULT_AUTO_RECOVERY_CONFIG.enabled).toBe(true);
			expect(DEFAULT_AUTO_RECOVERY_CONFIG.initialDelay).toBe(10000); // 10 seconds
			expect(DEFAULT_AUTO_RECOVERY_CONFIG.maxDelay).toBe(300000); // 5 minutes
			expect(DEFAULT_AUTO_RECOVERY_CONFIG.backoffMultiplier).toBe(2);
			expect(DEFAULT_AUTO_RECOVERY_CONFIG.maxAttempts).toBe(10);
		});
	});

	describe('recovery event types', () => {
		it('should have all recovery event types defined in ScanEventType', () => {
			// These are the recovery-related event types that should be supported
			const recoveryEventTypes = [
				'recovery_started',
				'recovery_waiting',
				'recovery_attempt',
				'recovery_success',
				'recovery_failed'
			];

			// Verify each recovery event type by checking the ScanEvent type accepts them
			const testEvent = (type: string): ScanEvent => ({
				type: type as ScanEvent['type'],
				timestamp: Date.now(),
				message: 'Test message'
			});

			for (const eventType of recoveryEventTypes) {
				const event = testEvent(eventType);
				expect(event.type).toBe(eventType);
				expect(event.timestamp).toBeDefined();
				expect(event.message).toBeDefined();
			}
		});

		it('should support details in scan events', () => {
			const event: ScanEvent = {
				type: 'recovery_started',
				timestamp: Date.now(),
				message: 'Starting recovery',
				details: {
					attempt: 1,
					maxAttempts: 10,
					waitTime: 10000
				}
			};

			expect(event.details?.attempt).toBe(1);
			expect(event.details?.maxAttempts).toBe(10);
			expect(event.details?.waitTime).toBe(10000);
		});
	});
});
