/**
 * @shelchin/paywall
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
 * // 1. Initialize in your app's entry point
 * import { initPaywall } from '@shelchin/paywall';
 * import MyPremiumABI from './contracts/MyPremium.json';
 *
 * initPaywall({
 *   contract: {
 *     address: '0x...',
 *     abi: MyPremiumABI.abi,
 *   },
 *   cache: {
 *     membershipKeyPrefix: 'myapp-membership',
 *   },
 *   selfHostedMode: import.meta.env.VITE_SELF_HOSTED === 'true'
 * });
 *
 * // 2. Create a paywall rule for your feature
 * import { createMembershipOnlyRule } from '@shelchin/paywall';
 *
 * export const myFeaturePaywall = createMembershipOnlyRule('my-feature', {
 *   daily: 100,
 *   countBy: 'items'
 * });
 *
 * // 3. Use in a component
 * import { usePaywall } from '@shelchin/paywall';
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

// Configuration
export {
	initPaywall,
	getConfig,
	isPaywallInitialized,
	resetConfig,
	DEFAULT_CONFIG
} from './config';
export type {
	PaywallConfig,
	ContractConfig,
	CacheConfig,
	TimingConfig,
	ResolvedConfig
} from './config';

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
	UsageQuotaStoreState,
	PricingInfo,
	FormattedPricing
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
export {
	createPricingStore,
	usePricingStore,
	setPricingStore
} from './composables/use-pricing.svelte';
export type { PricingStoreState } from './composables/use-pricing.svelte';

// Rule helpers
export {
	createMembershipOnlyRule,
	createPayPerUseRule,
	createHybridRule,
	createFreeRule
} from './utils/rules';

// Contract utilities
export {
	readMembershipStatus,
	readPricingInfo,
	formatPricing,
	readFormattedPricing,
	readPricingFromContract
} from './utils/contract';

// Checksum utilities (legacy, use signature.ts for new code)
export {
	generateChecksum,
	verifyChecksum,
	createMembershipChecksumData,
	createUsageChecksumData
} from './utils/checksum';

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

// Date utilities
export { getTodayDate, getCutoffDate } from './utils/date';
