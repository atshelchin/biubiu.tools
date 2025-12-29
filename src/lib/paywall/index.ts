/**
 * @deprecated Use `@shelchin/paywall` instead
 * This re-export is kept for backwards compatibility
 */
export {
	// Configuration
	initPaywall,
	getConfig,
	isPaywallInitialized,
	resetConfig,
	DEFAULT_CONFIG,
	// Stores
	createMembershipStore,
	useMembershipStore,
	createUsageQuotaStore,
	useUsageQuotaStore,
	// Composables
	usePaywall,
	verifyMembership,
	verifyAllMemberships,
	terminateVerifier,
	// Rule helpers
	createMembershipOnlyRule,
	createPayPerUseRule,
	createHybridRule,
	createFreeRule,
	// Contract utilities
	readMembershipStatus,
	// Checksum utilities
	generateChecksum,
	verifyChecksum,
	createMembershipChecksumData,
	createUsageChecksumData,
	// Signature-based security
	requestSignature,
	hasValidSignature,
	getCachedSignature,
	clearSignature,
	getPersonalizedSalt,
	generateSecureChecksum,
	verifySecureChecksum,
	// Browser fingerprint
	generateFingerprint,
	verifyFingerprint,
	getFingerprintShort,
	// Retry utilities
	withRetry,
	createRetryableRpc,
	withRetryAll,
	// Date utilities
	getTodayDate,
	getCutoffDate,
	// Error classes
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
} from '@shelchin/paywall';

export type {
	// Configuration types
	PaywallConfig,
	ContractConfig,
	CacheConfig,
	TimingConfig,
	ResolvedConfig,
	// Types
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
	// Error types
	PaywallErrorCode,
	// Signature types
	SignatureCache,
	// Retry types
	RetryOptions
} from '@shelchin/paywall';

// Re-export app-specific constants from the local constants file
// These are specific to biubiu.tools and should not be in the package
export {
	SELF_HOSTED_MODE,
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
