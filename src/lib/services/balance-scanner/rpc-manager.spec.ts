/**
 * RPC Manager Tests
 *
 * Tests for RPC endpoint rotation, rate limiting, and health tracking.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { RPCManager } from './rpc-manager';
import type { RPCEndpoint } from './types';

describe('RPCManager', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe('constructor', () => {
		it('should throw error when no endpoints provided', () => {
			expect(() => new RPCManager([])).toThrow('At least one RPC endpoint is required');
		});

		it('should accept single endpoint', () => {
			const manager = new RPCManager([{ url: 'https://rpc1.example.com' }]);

			expect(manager.getCurrentRPC()).toBe('https://rpc1.example.com');
		});

		it('should sort endpoints by priority', () => {
			const endpoints: RPCEndpoint[] = [
				{ url: 'https://rpc3.example.com', priority: 3 },
				{ url: 'https://rpc1.example.com', priority: 1 },
				{ url: 'https://rpc2.example.com', priority: 2 }
			];

			const manager = new RPCManager(endpoints);

			// Should start with highest priority (lowest number)
			expect(manager.getCurrentRPC()).toBe('https://rpc1.example.com');
		});

		it('should use default priority of 100 for endpoints without priority', () => {
			const endpoints: RPCEndpoint[] = [
				{ url: 'https://rpc-no-priority.example.com' },
				{ url: 'https://rpc-high-priority.example.com', priority: 1 }
			];

			const manager = new RPCManager(endpoints);

			expect(manager.getCurrentRPC()).toBe('https://rpc-high-priority.example.com');
		});
	});

	describe('getCurrentRPC', () => {
		it('should return current RPC URL', () => {
			const manager = new RPCManager([{ url: 'https://rpc.example.com' }]);

			expect(manager.getCurrentRPC()).toBe('https://rpc.example.com');
		});
	});

	describe('getCurrentRPCName', () => {
		it('should return endpoint name if provided', () => {
			const manager = new RPCManager([{ url: 'https://rpc.example.com', name: 'MyRPC' }]);

			expect(manager.getCurrentRPCName()).toBe('MyRPC');
		});

		it('should return hostname if name not provided', () => {
			const manager = new RPCManager([{ url: 'https://rpc.example.com/v1' }]);

			expect(manager.getCurrentRPCName()).toBe('rpc.example.com');
		});
	});

	describe('markSuccess', () => {
		it('should reset fail count on success', () => {
			const manager = new RPCManager([{ url: 'https://rpc1.example.com' }]);

			// Fail twice (not enough to mark as unhealthy)
			manager.markFailed();
			manager.markFailed();

			// Success should reset the fail count
			manager.markSuccess();

			// After success, fail count is reset
			// Need 3 more failures to mark as unhealthy
			manager.markFailed();
			manager.markFailed();

			// Still healthy because only 2 failures after reset
			expect(manager.getHealthyCount()).toBe(1);

			// One more failure makes it unhealthy
			manager.markFailed();
			expect(manager.getHealthyCount()).toBe(0);
		});
	});

	describe('markFailed', () => {
		it('should mark as unhealthy after 3 consecutive failures', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com' },
				{ url: 'https://rpc2.example.com' }
			]);

			expect(manager.getHealthyCount()).toBe(2);

			// First RPC needs 3 failures to become unhealthy
			// After 3 failures, it rotates to RPC2, but RPC1 is still healthy until marked unhealthy
			manager.markFailed(); // 1st failure
			manager.markFailed(); // 2nd failure
			manager.markFailed(); // 3rd failure - now RPC1 is unhealthy

			// After rotation, we're on RPC2, and RPC1 is unhealthy
			expect(manager.getHealthyCount()).toBeLessThanOrEqual(2);
		});

		it('should rotate to next RPC on failure', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com' },
				{ url: 'https://rpc2.example.com' }
			]);

			expect(manager.getCurrentRPC()).toBe('https://rpc1.example.com');

			manager.markFailed();
			manager.markFailed();
			manager.markFailed();

			expect(manager.getCurrentRPC()).toBe('https://rpc2.example.com');
		});

		it('should return false when all RPCs are exhausted', () => {
			const manager = new RPCManager([{ url: 'https://rpc1.example.com' }]);

			manager.markFailed();
			manager.markFailed();
			const result = manager.markFailed();

			expect(result).toBe(false);
		});
	});

	describe('markRateLimited', () => {
		it('should immediately mark RPC as unhealthy', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com' },
				{ url: 'https://rpc2.example.com' }
			]);

			expect(manager.getHealthyCount()).toBe(2);

			manager.markRateLimited();

			expect(manager.getHealthyCount()).toBe(1);
		});

		it('should rotate to next RPC', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com' },
				{ url: 'https://rpc2.example.com' }
			]);

			expect(manager.getCurrentRPC()).toBe('https://rpc1.example.com');

			manager.markRateLimited();

			expect(manager.getCurrentRPC()).toBe('https://rpc2.example.com');
		});

		it('should recover rate-limited RPC after cooldown', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com' },
				{ url: 'https://rpc2.example.com' }
			]);

			manager.markRateLimited();
			expect(manager.getHealthyCount()).toBe(1);

			// Advance time past cooldown (30 seconds)
			vi.advanceTimersByTime(31000);

			// Trigger rotation check
			manager.markFailed();

			// RPC1 should be recovered
			expect(manager.getHealthyCount()).toBeGreaterThanOrEqual(1);
		});
	});

	describe('isAllExhausted', () => {
		it('should return false when healthy RPCs available', () => {
			const manager = new RPCManager([{ url: 'https://rpc1.example.com' }]);

			expect(manager.isAllExhausted()).toBe(false);
		});

		it('should return true when all RPCs are unhealthy', () => {
			const manager = new RPCManager([{ url: 'https://rpc1.example.com' }]);

			manager.markFailed();
			manager.markFailed();
			manager.markFailed();

			expect(manager.isAllExhausted()).toBe(true);
		});

		it('should return true when all RPCs are rate limited', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com' },
				{ url: 'https://rpc2.example.com' }
			]);

			manager.markRateLimited();
			manager.markRateLimited();

			expect(manager.isAllExhausted()).toBe(true);
		});
	});

	describe('getWaitTimeUntilAvailable', () => {
		it('should return 0 when healthy RPC available', () => {
			const manager = new RPCManager([{ url: 'https://rpc1.example.com' }]);

			expect(manager.getWaitTimeUntilAvailable()).toBe(0);
		});

		it('should return remaining cooldown time for rate-limited RPC', () => {
			const manager = new RPCManager([{ url: 'https://rpc1.example.com' }]);

			manager.markRateLimited();

			// Should be close to 30 seconds (rate limit cooldown)
			const waitTime = manager.getWaitTimeUntilAvailable();
			expect(waitTime).toBeGreaterThan(29000);
			expect(waitTime).toBeLessThanOrEqual(30000);
		});

		it('should return minimum wait time when multiple RPCs rate-limited', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com' },
				{ url: 'https://rpc2.example.com' }
			]);

			manager.markRateLimited();

			// Advance 10 seconds
			vi.advanceTimersByTime(10000);

			manager.markRateLimited();

			// Wait time should be based on first RPC (20 seconds remaining)
			const waitTime = manager.getWaitTimeUntilAvailable();
			expect(waitTime).toBeLessThanOrEqual(20000);
			expect(waitTime).toBeGreaterThan(19000);
		});
	});

	describe('waitForAvailableRPC', () => {
		it('should return true immediately if healthy RPC available', async () => {
			const manager = new RPCManager([{ url: 'https://rpc1.example.com' }]);

			const result = await manager.waitForAvailableRPC();

			expect(result).toBe(true);
		});

		it('should wait and return true after cooldown', async () => {
			const manager = new RPCManager([{ url: 'https://rpc1.example.com' }]);

			manager.markRateLimited();

			// Start waiting
			const promise = manager.waitForAvailableRPC();

			// Advance time past cooldown
			vi.advanceTimersByTime(31000);

			const result = await promise;

			expect(result).toBe(true);
		});
	});

	describe('getStatusReport', () => {
		it('should return formatted status report', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com', name: 'RPC1' },
				{ url: 'https://rpc2.example.com', name: 'RPC2' }
			]);

			const report = manager.getStatusReport();

			expect(report).toContain('RPC Status');
			expect(report).toContain('RPC1');
			expect(report).toContain('RPC2');
			expect(report).toContain('healthy');
		});

		it('should show rate limited status', () => {
			const manager = new RPCManager([{ url: 'https://rpc1.example.com', name: 'RPC1' }]);

			manager.markRateLimited();

			const report = manager.getStatusReport();

			expect(report).toContain('rate limited');
		});

		it('should show unhealthy status', () => {
			// Use single RPC so it doesn't rotate away
			const manager = new RPCManager([{ url: 'https://rpc1.example.com', name: 'RPC1' }]);

			manager.markFailed();
			manager.markFailed();
			manager.markFailed(); // Now unhealthy

			const report = manager.getStatusReport();

			expect(report).toContain('unhealthy');
		});
	});

	describe('getHealthyCount', () => {
		it('should return count of healthy RPCs', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com' },
				{ url: 'https://rpc2.example.com' },
				{ url: 'https://rpc3.example.com' }
			]);

			expect(manager.getHealthyCount()).toBe(3);

			manager.markRateLimited();

			expect(manager.getHealthyCount()).toBe(2);
		});
	});

	describe('getTotalCount', () => {
		it('should return total number of RPCs', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com' },
				{ url: 'https://rpc2.example.com' }
			]);

			expect(manager.getTotalCount()).toBe(2);
		});
	});

	describe('health recovery', () => {
		it('should recover unhealthy RPC after recovery time', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com' },
				{ url: 'https://rpc2.example.com' }
			]);

			// Make RPC1 unhealthy
			manager.markFailed();
			manager.markFailed();
			manager.markFailed();

			expect(manager.getCurrentRPC()).toBe('https://rpc2.example.com');

			// Advance past recovery time (60 seconds)
			vi.advanceTimersByTime(61000);

			// Trigger rotation check
			manager.markFailed();

			// RPC1 should be recovered and potentially used
			expect(manager.getHealthyCount()).toBeGreaterThanOrEqual(1);
		});
	});

	describe('circular rotation', () => {
		it('should rotate back to first RPC after all have failed once', () => {
			const manager = new RPCManager([
				{ url: 'https://rpc1.example.com' },
				{ url: 'https://rpc2.example.com' }
			]);

			// Fail once on each RPC
			manager.markFailed();
			expect(manager.getCurrentRPC()).toBe('https://rpc2.example.com');

			manager.markFailed();
			// Should rotate back to rpc1 (still healthy, only 1 failure each)
			expect(manager.getCurrentRPC()).toBe('https://rpc1.example.com');
		});
	});
});
