/**
 * Tests for usePaywall composable
 *
 * Tests the integration of membership and usage quota stores
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { PaywallRule, PaywallContext, PaywallResult } from '../types';

// Mock stores
const mockMembershipStore = {
	isMember: false,
	isLoading: false,
	address: null as string | null,
	chainId: null as number | null
};

const mockUsageStore = {
	getDailyUsage: vi.fn(),
	recordUsage: vi.fn(),
	getRemainingQuota: vi.fn()
};

vi.mock('../stores/membership.svelte', () => ({
	useMembershipStore: () => mockMembershipStore
}));

vi.mock('../stores/usage-quota.svelte', () => ({
	useUsageQuotaStore: () => mockUsageStore
}));

// Import after mocking
import { usePaywall } from './use-paywall.svelte';

describe('usePaywall', () => {
	const mockAddress = '0x1234567890abcdef1234567890abcdef12345678';

	// Test rule factory
	function createTestRule(overrides: Partial<PaywallRule> = {}): PaywallRule {
		return {
			featureId: 'test-feature',
			type: 'membership_only',
			check: vi.fn((ctx: PaywallContext): PaywallResult => {
				if (ctx.isMember) {
					return { allowed: true, freeUse: true };
				}
				return {
					allowed: false,
					reason: 'membership_required',
					message: 'Membership required'
				};
			}),
			...overrides
		};
	}

	beforeEach(() => {
		vi.clearAllMocks();
		mockMembershipStore.isMember = false;
		mockMembershipStore.isLoading = false;
		mockMembershipStore.address = null;
		mockMembershipStore.chainId = null;
		mockUsageStore.getDailyUsage.mockResolvedValue(0);
		mockUsageStore.getRemainingQuota.mockResolvedValue(1000);
	});

	describe('check', () => {
		it('should return not_connected when wallet not connected', async () => {
			const rule = createTestRule();
			const paywall = usePaywall({ rule });

			const result = await paywall.check();

			expect(result.allowed).toBe(false);
			expect(result.reason).toBe('not_connected');
		});

		it('should pass context to rule check', async () => {
			mockMembershipStore.address = mockAddress;
			mockMembershipStore.chainId = 1;
			mockMembershipStore.isMember = true;
			mockUsageStore.getDailyUsage.mockResolvedValue(500);

			const checkFn = vi.fn().mockReturnValue({ allowed: true, freeUse: true });
			const rule = createTestRule({ check: checkFn });

			const paywall = usePaywall({ rule });
			await paywall.check(100);

			expect(checkFn).toHaveBeenCalledWith({
				isMember: true,
				chainId: 1,
				address: mockAddress,
				itemCount: 100,
				dailyUsage: 500
			});
		});

		it('should allow members', async () => {
			mockMembershipStore.address = mockAddress;
			mockMembershipStore.chainId = 1;
			mockMembershipStore.isMember = true;

			const rule = createTestRule();
			const paywall = usePaywall({ rule });

			const result = await paywall.check();

			expect(result.allowed).toBe(true);
			expect(result.freeUse).toBe(true);
		});

		it('should block non-members for membership_only rule', async () => {
			mockMembershipStore.address = mockAddress;
			mockMembershipStore.chainId = 1;
			mockMembershipStore.isMember = false;

			const rule = createTestRule();
			const paywall = usePaywall({ rule });

			const result = await paywall.check();

			expect(result.allowed).toBe(false);
			expect(result.reason).toBe('membership_required');
		});
	});

	describe('recordUsage', () => {
		it('should record usage when rule has freeQuota', async () => {
			mockMembershipStore.address = mockAddress;
			mockMembershipStore.chainId = 1;

			const rule = createTestRule({
				freeQuota: { daily: 1000, countBy: 'items' }
			});
			const paywall = usePaywall({ rule });

			await paywall.recordUsage(100);

			expect(mockUsageStore.recordUsage).toHaveBeenCalledWith('test-feature', 100);
		});

		it('should not record usage when rule has no freeQuota', async () => {
			mockMembershipStore.address = mockAddress;
			mockMembershipStore.chainId = 1;

			const rule = createTestRule();
			const paywall = usePaywall({ rule });

			await paywall.recordUsage(100);

			expect(mockUsageStore.recordUsage).not.toHaveBeenCalled();
		});
	});

	describe('getDailyUsage', () => {
		it('should get daily usage for feature', async () => {
			mockUsageStore.getDailyUsage.mockResolvedValue(500);

			const rule = createTestRule();
			const paywall = usePaywall({ rule });

			const usage = await paywall.getDailyUsage();

			expect(usage).toBe(500);
			expect(mockUsageStore.getDailyUsage).toHaveBeenCalledWith('test-feature');
		});
	});

	describe('getRemainingQuota', () => {
		it('should return null when no freeQuota configured', async () => {
			const rule = createTestRule();
			const paywall = usePaywall({ rule });

			const remaining = await paywall.getRemainingQuota();

			expect(remaining).toBe(null);
			expect(mockUsageStore.getRemainingQuota).not.toHaveBeenCalled();
		});

		it('should return remaining quota when freeQuota configured', async () => {
			mockUsageStore.getRemainingQuota.mockResolvedValue(700);

			const rule = createTestRule({
				freeQuota: { daily: 1000, countBy: 'items' }
			});
			const paywall = usePaywall({ rule });

			const remaining = await paywall.getRemainingQuota();

			expect(remaining).toBe(700);
			expect(mockUsageStore.getRemainingQuota).toHaveBeenCalledWith('test-feature', 1000);
		});
	});

	describe('reactive properties', () => {
		it('should expose isMember from membership store', () => {
			mockMembershipStore.isMember = true;

			const rule = createTestRule();
			const paywall = usePaywall({ rule });

			expect(paywall.isMember).toBe(true);

			mockMembershipStore.isMember = false;
			expect(paywall.isMember).toBe(false);
		});

		it('should expose isLoading from membership store', () => {
			mockMembershipStore.isLoading = true;

			const rule = createTestRule();
			const paywall = usePaywall({ rule });

			expect(paywall.isLoading).toBe(true);
		});
	});

	describe('integration scenarios', () => {
		it('should handle quota-based rule', async () => {
			mockMembershipStore.address = mockAddress;
			mockMembershipStore.chainId = 1;
			mockMembershipStore.isMember = false;
			mockUsageStore.getDailyUsage.mockResolvedValue(800);

			const rule: PaywallRule = {
				featureId: 'scanner',
				type: 'membership_only',
				freeQuota: { daily: 1000, countBy: 'items' },
				check: (ctx) => {
					if (ctx.isMember) return { allowed: true, freeUse: true };

					const used = ctx.dailyUsage ?? 0;
					const requested = ctx.itemCount ?? 1;
					const remaining = 1000 - used;

					if (requested <= remaining) {
						return { allowed: true, freeUse: true };
					}
					return {
						allowed: false,
						reason: 'quota_exceeded',
						message: 'Quota exceeded'
					};
				}
			};

			const paywall = usePaywall({ rule });

			// Request within quota
			const result1 = await paywall.check(100);
			expect(result1.allowed).toBe(true);

			// Request exceeding quota
			const result2 = await paywall.check(300);
			expect(result2.allowed).toBe(false);
			expect(result2.reason).toBe('quota_exceeded');
		});

		it('should handle pay-per-use rule', async () => {
			mockMembershipStore.address = mockAddress;
			mockMembershipStore.chainId = 1;
			mockMembershipStore.isMember = false;

			const rule: PaywallRule = {
				featureId: 'sweep',
				type: 'pay_per_use',
				perUseFee: 0.005,
				feeInContract: true,
				check: (ctx) => {
					if (ctx.isMember) return { allowed: true, freeUse: true };

					const itemCount = ctx.itemCount ?? 1;
					return {
						allowed: true,
						freeUse: false,
						perUseFee: 0.005,
						totalFee: 0.005 * itemCount,
						feeInContract: true,
						showPayPerUse: true
					};
				}
			};

			const paywall = usePaywall({ rule });

			const result = await paywall.check(10);

			expect(result.allowed).toBe(true);
			expect(result.freeUse).toBe(false);
			expect(result.totalFee).toBe(0.05);
			expect(result.showPayPerUse).toBe(true);
		});
	});
});
