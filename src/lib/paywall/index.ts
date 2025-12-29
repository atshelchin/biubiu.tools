/**
 * Paywall System
 *
 * A flexible paywall system for managing membership and usage quotas.
 *
 * @example
 * ```ts
 * // In a feature's paywall.ts
 * import { createMembershipOnlyRule } from '$lib/paywall';
 *
 * export const myFeaturePaywall = createMembershipOnlyRule('my-feature', {
 *   daily: 100,
 *   countBy: 'items'
 * });
 *
 * // In a component
 * import { usePaywall } from '$lib/paywall';
 * import { myFeaturePaywall } from './paywall';
 *
 * const paywall = usePaywall({ rule: myFeaturePaywall });
 *
 * async function handleAction() {
 *   const result = await paywall.check(itemCount);
 *   if (!result.allowed) {
 *     // Show upgrade modal
 *     return;
 *   }
 *   // Proceed with action
 * }
 * ```
 */

// Types
export type {
	MembershipStatus,
	MembershipCache,
	UsageRecord,
	QuotaConfig,
	PaywallType,
	PaywallContext,
	PaywallDenyReason,
	PaywallResult,
	PaywallRule,
	MembershipStoreState,
	UsageQuotaStoreState
} from './types';

// Stores
export { createMembershipStore, useMembershipStore } from './stores/membership.svelte';
export { createUsageQuotaStore, useUsageQuotaStore } from './stores/usage-quota.svelte';

// Composables
export { usePaywall } from './composables/use-paywall.svelte';
export {
	verifyMembership,
	verifyAllMemberships,
	terminateVerifier
} from './composables/use-membership-verifier';

// Rule helpers
export {
	createMembershipOnlyRule,
	createPayPerUseRule,
	createHybridRule,
	createFreeRule
} from './utils/rules';

// Contract utilities
export { BIUBIU_PREMIUM_CONTRACT, readMembershipStatus } from './utils/contract';

// Checksum utilities (for advanced use)
export { generateChecksum, verifyChecksum } from './utils/checksum';
