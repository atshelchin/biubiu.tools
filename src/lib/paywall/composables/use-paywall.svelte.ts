/**
 * usePaywall Composable
 *
 * Provides a unified API for checking paywall rules in components.
 * Combines membership status and usage quota tracking.
 */

import type { PaywallRule, PaywallResult, PaywallContext } from '../types';
import { useMembershipStore } from '../stores/membership.svelte';
import { useUsageQuotaStore } from '../stores/usage-quota.svelte';

interface UsePaywallOptions {
	/** The paywall rule to apply */
	rule: PaywallRule;
}

interface UsePaywallReturn {
	/** Check if operation is allowed */
	check(itemCount?: number): Promise<PaywallResult>;

	/** Record usage after successful operation */
	recordUsage(count: number): Promise<void>;

	/** Get current daily usage */
	getDailyUsage(): Promise<number>;

	/** Get remaining quota (if applicable) */
	getRemainingQuota(): Promise<number | null>;

	/** Current membership status */
	readonly isMember: boolean;

	/** Is membership loading */
	readonly isLoading: boolean;
}

/**
 * Create a paywall checker for a specific rule
 *
 * @example
 * ```svelte
 * <script>
 *   import { usePaywall } from '$lib/paywall/composables/use-paywall.svelte';
 *   import { balanceScannerPaywall } from '../paywall';
 *
 *   const paywall = usePaywall({ rule: balanceScannerPaywall });
 *
 *   async function handleScan() {
 *     const result = await paywall.check(addresses.length);
 *
 *     if (!result.allowed) {
 *       showUpgradeModal();
 *       return;
 *     }
 *
 *     if (!result.freeUse) {
 *       showPaymentConfirm(result);
 *       return;
 *     }
 *
 *     await doScan();
 *     await paywall.recordUsage(addresses.length);
 *   }
 * </script>
 * ```
 */
export function usePaywall(options: UsePaywallOptions): UsePaywallReturn {
	const { rule } = options;

	const membership = useMembershipStore();
	const usage = useUsageQuotaStore();

	/**
	 * Check if operation is allowed
	 */
	async function check(itemCount?: number): Promise<PaywallResult> {
		// Not connected
		if (!membership.address || !membership.chainId) {
			return {
				allowed: false,
				reason: 'not_connected',
				message: '请先连接钱包'
			};
		}

		// Get current usage
		const dailyUsage = await usage.getDailyUsage(rule.featureId);

		// Build context
		const ctx: PaywallContext = {
			isMember: membership.isMember,
			chainId: membership.chainId,
			address: membership.address,
			itemCount,
			dailyUsage
		};

		// Run rule check
		return rule.check(ctx);
	}

	/**
	 * Record usage after successful operation
	 */
	async function recordUsage(count: number): Promise<void> {
		if (rule.freeQuota) {
			await usage.recordUsage(rule.featureId, count);
		}
	}

	/**
	 * Get current daily usage
	 */
	async function getDailyUsage(): Promise<number> {
		return usage.getDailyUsage(rule.featureId);
	}

	/**
	 * Get remaining quota (null if no quota configured)
	 */
	async function getRemainingQuota(): Promise<number | null> {
		if (!rule.freeQuota) return null;
		return usage.getRemainingQuota(rule.featureId, rule.freeQuota.daily);
	}

	return {
		check,
		recordUsage,
		getDailyUsage,
		getRemainingQuota,
		get isMember() {
			return membership.isMember;
		},
		get isLoading() {
			return membership.isLoading;
		}
	};
}
