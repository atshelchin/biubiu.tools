/**
 * Paywall System
 *
 * A flexible paywall system for managing membership and usage quotas.
 *
 * Security features:
 * - SHA-256 checksum for data integrity
 * - Wallet signature as personalized salt (prevents checksum forgery)
 * - Browser fingerprint (prevents cross-device copying)
 * - Safe verification (RPC failures don't delete valid cache)
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

// Error types
export {
	PaywallError,
	NetworkError,
	RpcError,
	ContractError,
	CacheError,
	WalletError,
	VerificationError,
	isPaywallError,
	isRetryableError,
	toPaywallError
} from './errors';
export type { PaywallErrorCode } from './errors';

// Constants
export {
	VERIFY_INTERVAL_MS,
	INITIAL_VERIFY_DELAY_MS,
	SECONDS_PER_DAY,
	MAX_RETRY_ATTEMPTS,
	RETRY_BASE_DELAY_MS,
	RETRY_MAX_DELAY_MS,
	CACHE_KEY_PREFIX,
	USAGE_KEY_PREFIX,
	CHECKSUM_SALT,
	BIUBIU_PREMIUM_CONTRACT
} from './constants';

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
export { readMembershipStatus } from './utils/contract';

// Checksum utilities (legacy, use signature.ts for new code)
export { generateChecksum, verifyChecksum } from './utils/checksum';

// Signature-based security (recommended)
export {
	requestSignature,
	hasValidSignature,
	getCachedSignature,
	clearSignature,
	getPersonalizedSalt,
	generateSecureChecksum,
	verifySecureChecksum
} from './utils/signature';
export type { SignatureCache } from './utils/signature';

// Browser fingerprint
export { generateFingerprint, verifyFingerprint, getFingerprintShort } from './utils/fingerprint';

// Retry utilities
export { withRetry, createRetryableRpc, withRetryAll } from './utils/retry';
export type { RetryOptions } from './utils/retry';
