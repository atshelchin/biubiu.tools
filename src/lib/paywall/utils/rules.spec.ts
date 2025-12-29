/**
 * Tests for paywall rule helpers
 */

import { describe, it, expect } from 'vitest';
import {
	createMembershipOnlyRule,
	createPayPerUseRule,
	createHybridRule,
	createFreeRule
} from './rules';
import type { PaywallContext } from '../types';

// Test helper: create a minimal context for rule testing
// Rules only need isMember, dailyUsage, and itemCount - not address/chainId
const ctx = (overrides: Partial<PaywallContext> & { isMember: boolean }): PaywallContext => ({
	chainId: 1,
	address: '0x1234567890abcdef1234567890abcdef12345678',
	...overrides
});

describe('createFreeRule', () => {
	it('should always allow access', () => {
		const rule = createFreeRule('public-tool');
		const result = rule.check(ctx({ isMember: false }));
		expect(result.allowed).toBe(true);
		expect(result.freeUse).toBe(true);
	});

	it('should have correct metadata', () => {
		const rule = createFreeRule('my-feature');
		expect(rule.featureId).toBe('my-feature');
		expect(rule.type).toBe('free');
	});
});

describe('createMembershipOnlyRule', () => {
	describe('without free quota', () => {
		const rule = createMembershipOnlyRule('premium-feature');

		it('should allow members', () => {
			const result = rule.check(ctx({ isMember: true }));
			expect(result.allowed).toBe(true);
			expect(result.freeUse).toBe(true);
		});

		it('should block non-members', () => {
			const result = rule.check(ctx({ isMember: false }));
			expect(result.allowed).toBe(false);
			expect(result.reason).toBe('membership_required');
			expect(result.showUpgrade).toBe(true);
		});

		it('should have correct metadata', () => {
			expect(rule.featureId).toBe('premium-feature');
			expect(rule.type).toBe('membership_only');
		});
	});

	describe('with free quota (count by items)', () => {
		const rule = createMembershipOnlyRule('balance-scanner', {
			daily: 1000,
			countBy: 'items'
		});

		it('should allow members unlimited', () => {
			const result = rule.check(ctx({ isMember: true, dailyUsage: 5000, itemCount: 1000 }));
			expect(result.allowed).toBe(true);
			expect(result.freeUse).toBe(true);
		});

		it('should allow non-members within quota', () => {
			const result = rule.check(ctx({ isMember: false, dailyUsage: 500, itemCount: 200 }));
			expect(result.allowed).toBe(true);
			expect(result.freeUse).toBe(true);
			expect(result.message).toContain('300'); // 1000 - 500 - 200 = 300
		});

		it('should block non-members exceeding quota', () => {
			const result = rule.check(ctx({ isMember: false, dailyUsage: 900, itemCount: 200 }));
			expect(result.allowed).toBe(false);
			expect(result.reason).toBe('quota_exceeded');
			expect(result.showUpgrade).toBe(true);
		});

		it('should treat undefined dailyUsage as 0', () => {
			const result = rule.check(ctx({ isMember: false, itemCount: 500 }));
			expect(result.allowed).toBe(true);
			expect(result.freeUse).toBe(true);
		});
	});

	describe('with free quota (count by requests)', () => {
		const rule = createMembershipOnlyRule('api-feature', {
			daily: 10,
			countBy: 'request'
		});

		it('should allow within request limit', () => {
			const result = rule.check(ctx({ isMember: false, dailyUsage: 5, itemCount: 100 }));
			expect(result.allowed).toBe(true);
		});

		it('should block after request limit', () => {
			const result = rule.check(ctx({ isMember: false, dailyUsage: 10, itemCount: 100 }));
			expect(result.allowed).toBe(false);
		});
	});

	describe('custom messages', () => {
		it('should use custom membership required message', () => {
			const rule = createMembershipOnlyRule('feature', undefined, {
				message: 'Custom membership message'
			});
			const result = rule.check(ctx({ isMember: false }));
			expect(result.message).toBe('Custom membership message');
		});

		it('should use custom quota exceeded message', () => {
			const rule = createMembershipOnlyRule(
				'feature',
				{ daily: 10, countBy: 'items' },
				{ quotaExceededMessage: 'Custom quota message' }
			);
			const result = rule.check(ctx({ isMember: false, dailyUsage: 10, itemCount: 1 }));
			expect(result.message).toBe('Custom quota message');
		});
	});
});

describe('createPayPerUseRule', () => {
	describe('without free quota', () => {
		const rule = createPayPerUseRule('wallet-sweep', 0.005);

		it('should allow members free', () => {
			const result = rule.check(ctx({ isMember: true, itemCount: 10 }));
			expect(result.allowed).toBe(true);
			expect(result.freeUse).toBe(true);
		});

		it('should charge non-members per use', () => {
			const result = rule.check(ctx({ isMember: false, itemCount: 5 }));
			expect(result.allowed).toBe(true);
			expect(result.freeUse).toBe(false);
			expect(result.perUseFee).toBe(0.005);
			expect(result.totalFee).toBe(0.025); // 5 * 0.005
			expect(result.showPayPerUse).toBe(true);
			expect(result.showUpgrade).toBe(true);
		});

		it('should default itemCount to 1', () => {
			const result = rule.check(ctx({ isMember: false }));
			expect(result.totalFee).toBe(0.005);
		});

		it('should have correct metadata', () => {
			expect(rule.featureId).toBe('wallet-sweep');
			expect(rule.type).toBe('pay_per_use');
			expect(rule.perUseFee).toBe(0.005);
			expect(rule.feeInContract).toBe(true);
		});
	});

	describe('with free quota', () => {
		const rule = createPayPerUseRule('feature', 0.01, {
			freeQuota: { daily: 5, countBy: 'items' }
		});

		it('should allow within free quota', () => {
			const result = rule.check(ctx({ isMember: false, dailyUsage: 2, itemCount: 2 }));
			expect(result.allowed).toBe(true);
			expect(result.freeUse).toBe(true);
		});

		it('should charge after free quota', () => {
			const result = rule.check(ctx({ isMember: false, dailyUsage: 5, itemCount: 2 }));
			expect(result.allowed).toBe(true);
			expect(result.freeUse).toBe(false);
			expect(result.totalFee).toBe(0.02);
		});
	});

	describe('feeInContract option', () => {
		it('should default to true', () => {
			const rule = createPayPerUseRule('feature', 0.01);
			expect(rule.feeInContract).toBe(true);
		});

		it('should respect explicit false', () => {
			const rule = createPayPerUseRule('feature', 0.01, { feeInContract: false });
			expect(rule.feeInContract).toBe(false);
		});
	});
});

describe('createHybridRule', () => {
	const rule = createHybridRule('batch-transfer', {
		freeQuota: { daily: 10, countBy: 'items' },
		perUseFee: 0.003
	});

	it('should allow members unlimited free', () => {
		const result = rule.check(ctx({ isMember: true, dailyUsage: 100, itemCount: 50 }));
		expect(result.allowed).toBe(true);
		expect(result.freeUse).toBe(true);
	});

	it('should allow non-members within free quota', () => {
		const result = rule.check(ctx({ isMember: false, dailyUsage: 5, itemCount: 3 }));
		expect(result.allowed).toBe(true);
		expect(result.freeUse).toBe(true);
		expect(result.message).toContain('2'); // 10 - 5 - 3 = 2
	});

	it('should charge non-members after quota', () => {
		const result = rule.check(ctx({ isMember: false, dailyUsage: 10, itemCount: 5 }));
		expect(result.allowed).toBe(true);
		expect(result.freeUse).toBe(false);
		expect(result.perUseFee).toBe(0.003);
		expect(result.totalFee).toBe(0.015); // 5 * 0.003
		expect(result.showPayPerUse).toBe(true);
		expect(result.showUpgrade).toBe(true);
	});

	it('should have correct metadata', () => {
		expect(rule.featureId).toBe('batch-transfer');
		expect(rule.type).toBe('hybrid');
		expect(rule.perUseFee).toBe(0.003);
		expect(rule.freeQuota).toEqual({ daily: 10, countBy: 'items' });
	});
});
