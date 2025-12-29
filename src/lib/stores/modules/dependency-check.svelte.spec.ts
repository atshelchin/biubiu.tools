/**
 * Tests for dependency-check module.
 */

import { describe, it, expect } from 'vitest';
import { createDependencyCheckModule } from './dependency-check.svelte';
import type {
	DependencyCheck,
	DependencyCheckSummary,
	NetworkServiceCheck
} from '$lib/utils/blockchain-checker';

// Test data - DependencyCheck is NetworkServiceCheck | ContractCheck
const mockChecks: NetworkServiceCheck[] = [
	{
		id: 'wallet',
		name: 'Wallet Connected',
		description: 'Check wallet connection',
		status: 'success',
		type: 'network-service',
		message: 'Connected'
	},
	{
		id: 'network',
		name: 'Network Available',
		description: 'Check network availability',
		status: 'success',
		type: 'network-service',
		message: 'OK'
	},
	{
		id: 'rpc',
		name: 'RPC Endpoint',
		description: 'Check RPC endpoint',
		status: 'success',
		type: 'network-service',
		message: 'Responsive'
	}
];

const mockSummaryAllPassed: DependencyCheckSummary = {
	allPassed: true,
	passed: 3,
	failed: 0,
	warnings: 0,
	total: 3
};

const mockSummaryWithFailure: DependencyCheckSummary = {
	allPassed: false,
	passed: 2,
	failed: 1,
	warnings: 0,
	total: 3
};

describe('createDependencyCheckModule', () => {
	describe('initial state', () => {
		it('should have correct initial values', () => {
			const module = createDependencyCheckModule();

			expect(module.checks).toEqual([]);
			expect(module.summary).toBeNull();
			expect(module.isChecking).toBe(false);
			expect(module.hasChecked).toBe(false);
			expect(module.canProceed).toBe(false);
		});
	});

	describe('startChecking', () => {
		it('should set isChecking to true and clear previous state', () => {
			const module = createDependencyCheckModule();

			// Simulate previous check
			module.finishChecking(mockChecks, mockSummaryAllPassed);
			expect(module.hasChecked).toBe(true);

			// Start new check
			module.startChecking();

			expect(module.isChecking).toBe(true);
			expect(module.checks).toEqual([]);
			expect(module.summary).toBeNull();
		});
	});

	describe('finishChecking', () => {
		it('should update state with check results', () => {
			const module = createDependencyCheckModule();

			module.startChecking();
			module.finishChecking(mockChecks, mockSummaryAllPassed);

			expect(module.isChecking).toBe(false);
			expect(module.hasChecked).toBe(true);
			expect(module.checks).toEqual(mockChecks);
			expect(module.summary).toEqual(mockSummaryAllPassed);
		});
	});

	describe('canProceed', () => {
		it('should be true when all checks pass', () => {
			const module = createDependencyCheckModule();

			module.finishChecking(mockChecks, mockSummaryAllPassed);

			expect(module.canProceed).toBe(true);
		});

		it('should be false when some checks fail', () => {
			const module = createDependencyCheckModule();

			const failedChecks: NetworkServiceCheck[] = [
				...mockChecks.slice(0, 2),
				{
					id: 'rpc',
					name: 'RPC Endpoint',
					description: 'Check RPC endpoint',
					status: 'error',
					type: 'network-service',
					message: 'Timeout'
				}
			];

			module.finishChecking(failedChecks, mockSummaryWithFailure);

			expect(module.canProceed).toBe(false);
		});

		it('should be false when not checked yet', () => {
			const module = createDependencyCheckModule();

			expect(module.canProceed).toBe(false);
		});
	});

	describe('derived counts', () => {
		it('should calculate passed/failed/warning counts correctly', () => {
			const module = createDependencyCheckModule();

			const mixedChecks: NetworkServiceCheck[] = [
				{
					id: '1',
					name: 'Check 1',
					description: 'Desc 1',
					status: 'success',
					type: 'network-service',
					message: 'OK'
				},
				{
					id: '2',
					name: 'Check 2',
					description: 'Desc 2',
					status: 'success',
					type: 'network-service',
					message: 'OK'
				},
				{
					id: '3',
					name: 'Check 3',
					description: 'Desc 3',
					status: 'error',
					type: 'network-service',
					message: 'Error'
				},
				{
					id: '4',
					name: 'Check 4',
					description: 'Desc 4',
					status: 'warning',
					type: 'network-service',
					message: 'Warning'
				}
			];

			module.finishChecking(mixedChecks, {
				allPassed: false,
				passed: 2,
				failed: 1,
				warnings: 1,
				total: 4
			});

			expect(module.passedCount).toBe(2);
			expect(module.failedCount).toBe(1);
			expect(module.warningCount).toBe(1);
		});
	});

	describe('updateCheck', () => {
		it('should update a specific check by index', () => {
			const module = createDependencyCheckModule();

			module.finishChecking(mockChecks, mockSummaryAllPassed);

			const updatedCheck: DependencyCheck = {
				id: 'network',
				name: 'Network Available',
				description: 'Check network availability',
				status: 'error',
				type: 'network-service',
				message: 'Disconnected'
			};

			module.updateCheck(1, updatedCheck);

			expect(module.checks[1]).toEqual(updatedCheck);
			expect(module.checks[0]).toEqual(mockChecks[0]); // Unchanged
			expect(module.checks[2]).toEqual(mockChecks[2]); // Unchanged
		});

		it('should ignore invalid indices', () => {
			const module = createDependencyCheckModule();

			module.finishChecking(mockChecks, mockSummaryAllPassed);

			const originalChecks = [...module.checks];

			const dummyCheck: NetworkServiceCheck = {
				id: 'x',
				name: 'X',
				description: 'Dummy',
				status: 'success',
				type: 'network-service',
				message: ''
			};
			module.updateCheck(-1, dummyCheck);
			module.updateCheck(100, dummyCheck);

			expect(module.checks).toEqual(originalChecks);
		});
	});

	describe('reset', () => {
		it('should reset all state to initial values', () => {
			const module = createDependencyCheckModule();

			// Set up some state
			module.finishChecking(mockChecks, mockSummaryAllPassed);
			expect(module.hasChecked).toBe(true);

			// Reset
			module.reset();

			expect(module.checks).toEqual([]);
			expect(module.summary).toBeNull();
			expect(module.isChecking).toBe(false);
			expect(module.hasChecked).toBe(false);
		});
	});

	describe('serialization', () => {
		it('should serialize state correctly', () => {
			const module = createDependencyCheckModule();

			module.finishChecking(mockChecks, mockSummaryAllPassed);

			const serialized = module.serialize();

			expect(serialized).toEqual({
				checks: mockChecks,
				summary: mockSummaryAllPassed,
				hasChecked: true
			});
		});

		it('should deserialize state correctly', () => {
			const module = createDependencyCheckModule();

			module.deserialize({
				checks: mockChecks,
				summary: mockSummaryAllPassed,
				hasChecked: true
			});

			expect(module.checks).toEqual(mockChecks);
			expect(module.summary).toEqual(mockSummaryAllPassed);
			expect(module.hasChecked).toBe(true);
			expect(module.isChecking).toBe(false); // Should not restore isChecking
		});

		it('should handle null/undefined data gracefully', () => {
			const module = createDependencyCheckModule();

			// Should not throw
			module.deserialize(null as unknown as ReturnType<typeof module.serialize>);
			module.deserialize(undefined as unknown as ReturnType<typeof module.serialize>);

			expect(module.checks).toEqual([]);
		});

		it('should handle partial data', () => {
			const module = createDependencyCheckModule();

			module.deserialize({
				checks: mockChecks
			} as ReturnType<typeof module.serialize>);

			expect(module.checks).toEqual(mockChecks);
			expect(module.summary).toBeNull();
			expect(module.hasChecked).toBe(false);
		});
	});
});
