/**
 * Types for platform statistics
 */

import type { Address } from 'viem';

/**
 * Contract addresses (same on all EVM chains via CREATE2)
 */
export const CONTRACT_ADDRESSES = {
	MULTICALL3: '0x2055A30B00555e7cAd48b1756eac4f917781489b' as Address,
	BIUBIU_PREMIUM: '0x61Ae52Bb677847853DB30091ccc32d9b68878B71' as Address,
	TOKEN_FACTORY: '0xe731602Ff2C355Ca0e6CE68932AFaA6ff973aE79' as Address,
	NFT_FACTORY: '0x917e63eD2FA8BF71d11BAF6cAdcaC65098a68499' as Address,
	TOKEN_DISTRIBUTION: '0x57A2dB6B6cf17a1b9B7F1B9e269e88A180291221' as Address,
	TOKEN_SWEEP: '0x34bb5CE9B48bEb31ed3763e80DD0d93cb7C8842b' as Address
} as const;

/**
 * Contract deployment status and usage data
 */
export interface ContractStats {
	deployed: boolean;
	totalUsage: bigint;
	freeUsage?: bigint;
	premiumUsage?: bigint;
	paidUsage?: bigint;
}

/**
 * Stats for a single chain
 */
export interface ChainContractStats {
	chainId: number;
	chainName: string;
	chainIcon?: string;
	nativeSymbol: string;

	// Individual contract stats
	biubiuPremium: { deployed: boolean; totalSupply: bigint };
	tokenFactory: ContractStats;
	nftFactory: ContractStats;
	tokenDistribution: ContractStats;
	tokenSweep: ContractStats;

	// Aggregated stats
	totalToolUsage: bigint;
	deployedContractCount: number;
	lastUpdated: number;
}

/**
 * Global platform stats aggregated from all chains
 */
export interface PlatformStats {
	// Premium subscribers (sum of all chains)
	totalPremiumSubscribers: bigint;

	// Tool usage (sum of all chains)
	totalToolUsage: bigint;
	totalFreeUsage: bigint;
	totalPremiumUsage: bigint;
	totalPaidUsage: bigint;

	// Network stats
	activeNetworks: number;
	totalNetworksChecked: number;

	// Top networks by usage
	topNetworks: ChainContractStats[];

	// Metadata
	lastUpdated: number;
	isLoading: boolean;
	error?: string;
}

/**
 * Live activity event types
 */
export type ActivityEventType =
	| 'subscription'
	| 'token_created'
	| 'nft_created'
	| 'distribution'
	| 'sweep';

/**
 * Live activity event
 */
export interface ActivityEvent {
	id: string;
	type: ActivityEventType;
	chainId: number;
	chainName: string;
	chainIcon?: string;
	timestamp: number;
	txHash?: string;
	details?: {
		tokenName?: string;
		recipientCount?: number;
		walletCount?: number;
	};
}

/**
 * Query configuration
 */
export interface StatsQueryConfig {
	// Maximum number of chains to query
	maxChains: number;
	// Timeout per chain query (ms)
	timeoutPerChain: number;
	// Maximum concurrent queries
	concurrency: number;
	// Whether to include testnets
	includeTestnets: boolean;
}

export const DEFAULT_STATS_CONFIG: StatsQueryConfig = {
	maxChains: 50,
	timeoutPerChain: 10000,
	concurrency: 10,
	includeTestnets: false
};
