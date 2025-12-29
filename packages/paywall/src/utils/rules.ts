/**
 * Helper functions for creating common paywall rules
 *
 * These functions provide convenient shortcuts for creating rules.
 * For custom logic, implement PaywallRule interface directly.
 */

import type { PaywallRule, PaywallContext, PaywallResult, QuotaConfig } from '../types';

interface MembershipOnlyOptions {
	/** Custom message when membership is required */
	message?: string;
	/** Message shown when quota is exceeded */
	quotaExceededMessage?: string;
}

/**
 * Create a "membership only" rule
 *
 * - Members: unlimited access
 * - Non-members: limited by daily quota (if configured), otherwise blocked
 *
 * @example
 * ```ts
 * // No free quota - members only
 * const rule = createMembershipOnlyRule('premium-feature');
 *
 * // With free quota
 * const rule = createMembershipOnlyRule('balance-scanner', {
 *   daily: 1000,
 *   countBy: 'items'
 * });
 * ```
 */
export function createMembershipOnlyRule(
	featureId: string,
	freeQuota?: QuotaConfig,
	options?: MembershipOnlyOptions
): PaywallRule {
	return {
		featureId,
		type: 'membership_only',
		freeQuota,

		check(ctx: PaywallContext): PaywallResult {
			// Members: unlimited access
			if (ctx.isMember) {
				return { allowed: true, freeUse: true };
			}

			// Check free quota if configured
			if (freeQuota) {
				const used = ctx.dailyUsage ?? 0;
				const requested = freeQuota.countBy === 'items' ? (ctx.itemCount ?? 1) : 1;
				const remaining = freeQuota.daily - used;
				const unit = freeQuota.countBy === 'items' ? 'items' : 'requests';

				if (requested <= remaining) {
					return {
						allowed: true,
						freeUse: true,
						messageKey: 'paywall.rules.quota_remaining',
						messageParams: { remaining: remaining - requested },
						// Legacy fallback
						message: `Daily free quota remaining: ${remaining - requested}`
					};
				}

				// Quota exceeded
				return {
					allowed: false,
					reason: 'quota_exceeded',
					messageKey: 'paywall.rules.quota_exceeded',
					messageParams: { limit: freeQuota.daily, unit },
					upgradeHintKey: 'paywall.rules.upgrade_hint',
					showUpgrade: true,
					// Legacy fallback
					message:
						options?.quotaExceededMessage ??
						`Daily free quota exhausted (${freeQuota.daily} ${unit})`,
					upgradeHint: 'Upgrade to unlock unlimited access'
				};
			}

			// No quota - membership required
			return {
				allowed: false,
				reason: 'membership_required',
				messageKey: 'paywall.rules.membership_required',
				showUpgrade: true,
				// Legacy fallback
				message: options?.message ?? 'This feature requires membership'
			};
		}
	};
}

interface PayPerUseOptions {
	/** Whether fee is collected in smart contract (default: true) */
	feeInContract?: boolean;
	/** Free quota before requiring payment */
	freeQuota?: QuotaConfig;
}

/**
 * Create a "pay per use" rule
 *
 * - Members: free access
 * - Non-members: pay per transaction/use
 *
 * @example
 * ```ts
 * const rule = createPayPerUseRule('wallet-sweep', 0.005, {
 *   feeInContract: true
 * });
 * ```
 */
export function createPayPerUseRule(
	featureId: string,
	perUseFee: number,
	options?: PayPerUseOptions
): PaywallRule {
	return {
		featureId,
		type: 'pay_per_use',
		perUseFee,
		feeInContract: options?.feeInContract ?? true,
		freeQuota: options?.freeQuota,

		check(ctx: PaywallContext): PaywallResult {
			const itemCount = ctx.itemCount ?? 1;

			// Members: free access
			if (ctx.isMember) {
				return { allowed: true, freeUse: true };
			}

			// Check free quota if configured
			if (options?.freeQuota) {
				const used = ctx.dailyUsage ?? 0;
				const requested = options.freeQuota.countBy === 'items' ? itemCount : 1;
				const remaining = options.freeQuota.daily - used;

				if (requested <= remaining) {
					return {
						allowed: true,
						freeUse: true,
						messageKey: 'paywall.rules.quota_remaining',
						messageParams: { remaining: remaining - requested },
						// Legacy fallback
						message: `Daily free quota remaining: ${remaining - requested}`
					};
				}
			}

			// Non-members: pay per use
			const totalFee = perUseFee * itemCount;
			return {
				allowed: true,
				freeUse: false,
				perUseFee,
				totalFee,
				feeInContract: options?.feeInContract ?? true,
				messageKey: 'paywall.rules.fee_info',
				messageParams: { total: totalFee.toFixed(4), count: itemCount, fee: perUseFee },
				upgradeHintKey: 'paywall.rules.upgrade_hint_cheaper',
				showUpgrade: true,
				showPayPerUse: true,
				// Legacy fallback
				message: `Fee: ${totalFee.toFixed(4)} ETH (${itemCount} × ${perUseFee} ETH)`,
				upgradeHint: 'Upgrade to member for free access'
			};
		}
	};
}

interface HybridRuleConfig {
	/** Free quota for non-members */
	freeQuota: QuotaConfig;
	/** Fee per use after quota exceeded */
	perUseFee: number;
	/** Whether fee is collected in smart contract (default: true) */
	feeInContract?: boolean;
}

/**
 * Create a "hybrid" rule
 *
 * - Members: unlimited free access
 * - Non-members: free within quota, then can pay per use or upgrade
 *
 * @example
 * ```ts
 * const rule = createHybridRule('batch-transfer', {
 *   freeQuota: { daily: 10, countBy: 'items' },
 *   perUseFee: 0.003,
 *   feeInContract: true
 * });
 * ```
 */
export function createHybridRule(featureId: string, config: HybridRuleConfig): PaywallRule {
	return {
		featureId,
		type: 'hybrid',
		freeQuota: config.freeQuota,
		perUseFee: config.perUseFee,
		feeInContract: config.feeInContract ?? true,

		check(ctx: PaywallContext): PaywallResult {
			const itemCount = ctx.itemCount ?? 1;

			// Members: unlimited free access
			if (ctx.isMember) {
				return { allowed: true, freeUse: true };
			}

			// Check free quota
			const used = ctx.dailyUsage ?? 0;
			const requested = config.freeQuota.countBy === 'items' ? itemCount : 1;
			const remaining = config.freeQuota.daily - used;

			if (requested <= remaining) {
				return {
					allowed: true,
					freeUse: true,
					messageKey: 'paywall.rules.quota_remaining',
					messageParams: { remaining: remaining - requested },
					// Legacy fallback
					message: `Daily free quota remaining: ${remaining - requested}`
				};
			}

			// Quota exceeded: can pay or upgrade
			const totalFee = config.perUseFee * itemCount;
			return {
				allowed: true,
				freeUse: false,
				perUseFee: config.perUseFee,
				totalFee,
				feeInContract: config.feeInContract ?? true,
				messageKey: 'paywall.rules.exceeded_fee_info',
				messageParams: { total: totalFee.toFixed(4) },
				upgradeHintKey: 'paywall.rules.upgrade_hint_cheaper',
				showUpgrade: true,
				showPayPerUse: true,
				// Legacy fallback
				message: `Quota exceeded, fee: ${totalFee.toFixed(4)} ETH`,
				upgradeHint: 'Upgrade for better value'
			};
		}
	};
}

/**
 * Create a "free" rule (no restrictions)
 *
 * @example
 * ```ts
 * const rule = createFreeRule('public-tool');
 * ```
 */
export function createFreeRule(featureId: string): PaywallRule {
	return {
		featureId,
		type: 'free',

		check(): PaywallResult {
			return { allowed: true, freeUse: true };
		}
	};
}
