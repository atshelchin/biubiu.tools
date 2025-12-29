/**
 * Paywall Configuration
 *
 * Provides a flexible configuration system for the paywall package.
 * All settings can be customized by the consuming application.
 */

import type { Abi, Address } from 'viem';

/**
 * Contract configuration for membership verification
 */
export interface ContractConfig {
	/** Contract address for membership verification */
	address: Address;
	/** Contract ABI (must include getSubscriptionInfo function) */
	abi: Abi;
	/** Function name to call for subscription info (default: 'getSubscriptionInfo') */
	functionName?: string;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
	/** Key prefix for IndexedDB storage (default: 'paywall-membership') */
	membershipKeyPrefix?: string;
	/** Key prefix for usage records (default: 'paywall-usage') */
	usageKeyPrefix?: string;
	/** Salt for checksum generation (default: 'paywall-v1') */
	checksumSalt?: string;
}

/**
 * Timing configuration
 */
export interface TimingConfig {
	/** Background verification interval in ms (default: 180000 = 3 min) */
	verifyIntervalMs?: number;
	/** Initial verification delay after cache load in ms (default: 5000) */
	initialVerifyDelayMs?: number;
	/** Maximum retry attempts for RPC calls (default: 3) */
	maxRetryAttempts?: number;
	/** Base delay for exponential backoff in ms (default: 1000) */
	retryBaseDelayMs?: number;
	/** Maximum delay between retries in ms (default: 10000) */
	retryMaxDelayMs?: number;
}

/**
 * Full paywall configuration
 */
export interface PaywallConfig {
	/** Contract configuration (required) */
	contract: ContractConfig;
	/** Cache configuration (optional) */
	cache?: CacheConfig;
	/** Timing configuration (optional) */
	timing?: TimingConfig;
	/** Self-hosted mode - bypass all checks (default: false) */
	selfHostedMode?: boolean;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
	cache: {
		membershipKeyPrefix: 'paywall-membership',
		usageKeyPrefix: 'paywall-usage',
		checksumSalt: 'paywall-v1'
	},
	timing: {
		verifyIntervalMs: 3 * 60 * 1000, // 3 minutes
		initialVerifyDelayMs: 5 * 1000, // 5 seconds
		maxRetryAttempts: 3,
		retryBaseDelayMs: 1000,
		retryMaxDelayMs: 10000
	},
	selfHostedMode: false
} as const;

/**
 * Resolved configuration with all defaults applied
 */
export interface ResolvedConfig {
	contract: ContractConfig & { functionName: string };
	cache: Required<CacheConfig>;
	timing: Required<TimingConfig>;
	selfHostedMode: boolean;
}

// Global configuration storage
let globalConfig: ResolvedConfig | null = null;

/**
 * Initialize the paywall with configuration
 *
 * @example
 * ```ts
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
 * ```
 */
export function initPaywall(config: PaywallConfig): void {
	globalConfig = {
		contract: {
			...config.contract,
			functionName: config.contract.functionName ?? 'getSubscriptionInfo'
		},
		cache: {
			membershipKeyPrefix:
				config.cache?.membershipKeyPrefix ?? DEFAULT_CONFIG.cache.membershipKeyPrefix,
			usageKeyPrefix: config.cache?.usageKeyPrefix ?? DEFAULT_CONFIG.cache.usageKeyPrefix,
			checksumSalt: config.cache?.checksumSalt ?? DEFAULT_CONFIG.cache.checksumSalt
		},
		timing: {
			verifyIntervalMs: config.timing?.verifyIntervalMs ?? DEFAULT_CONFIG.timing.verifyIntervalMs,
			initialVerifyDelayMs:
				config.timing?.initialVerifyDelayMs ?? DEFAULT_CONFIG.timing.initialVerifyDelayMs,
			maxRetryAttempts: config.timing?.maxRetryAttempts ?? DEFAULT_CONFIG.timing.maxRetryAttempts,
			retryBaseDelayMs: config.timing?.retryBaseDelayMs ?? DEFAULT_CONFIG.timing.retryBaseDelayMs,
			retryMaxDelayMs: config.timing?.retryMaxDelayMs ?? DEFAULT_CONFIG.timing.retryMaxDelayMs
		},
		selfHostedMode: config.selfHostedMode ?? DEFAULT_CONFIG.selfHostedMode
	};
}

/**
 * Get the current paywall configuration
 * Throws if initPaywall() hasn't been called
 */
export function getConfig(): ResolvedConfig {
	if (!globalConfig) {
		throw new Error('Paywall not initialized. Call initPaywall() before using paywall features.');
	}
	return globalConfig;
}

/**
 * Check if paywall is initialized
 */
export function isPaywallInitialized(): boolean {
	return globalConfig !== null;
}

/**
 * Reset configuration (mainly for testing)
 */
export function resetConfig(): void {
	globalConfig = null;
}
