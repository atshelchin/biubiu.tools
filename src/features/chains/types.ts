/**
 * Types for the EVM Chains Encyclopedia
 */

import type { Promotion } from '@/features/promotions/types';

/**
 * RPC endpoint with tracking information
 */
export interface RpcEndpoint {
	url: string;
	tracking?: 'none' | 'limited' | 'yes' | 'unspecified';
	isOpenSource?: boolean;
}

/**
 * Block explorer information
 */
export interface Explorer {
	name: string;
	url: string;
	icon?: string;
	standard?: string;
}

/**
 * Native currency information
 */
export interface NativeCurrency {
	name: string;
	symbol: string;
	decimals: number;
}

/**
 * Network feature (EIP support)
 */
export interface NetworkFeature {
	name: string;
}

/**
 * ENS configuration
 */
export interface EnsConfig {
	registry: string;
}

/**
 * Parent chain information (for L2s)
 */
export interface ParentChain {
	type: string;
	chain: string;
	bridges?: Array<{ url: string }>;
}

/**
 * Complete chain data from rpcs.json
 */
export interface Chain {
	name: string;
	chain: string;
	chainId: number;
	networkId?: number;
	shortName: string;
	chainSlug?: string;
	icon?: string;
	nativeCurrency: NativeCurrency;
	rpc: (string | RpcEndpoint)[];
	faucets: string[];
	explorers?: Explorer[];
	features?: NetworkFeature[];
	infoURL?: string;
	tvl?: number;
	isTestnet?: boolean;
	slip44?: number;
	ens?: EnsConfig;
	parent?: ParentChain;
	status?: 'active' | 'incubating' | 'deprecated';
	redFlags?: string[];
}

/**
 * Parsed RPC endpoint (normalized)
 */
export interface ParsedRpcEndpoint {
	url: string;
	tracking: 'none' | 'limited' | 'yes' | 'unspecified';
	isOpenSource: boolean;
	isWebSocket: boolean;
}

/**
 * RPC latency test result
 */
export interface RpcLatencyResult {
	url: string;
	latency: number | null; // null means failed
	blockNumber?: number;
	error?: string;
}

/**
 * Chain page SEO metadata
 */
export interface ChainPageMeta {
	title: string;
	description: string;
	keywords: string;
	canonical: string;
	type: 'website';
	image: string;
	locale: string;
}

/**
 * Chain page data returned from load function
 */
export interface ChainPageData {
	chain: Chain;
	parsedRpcs: ParsedRpcEndpoint[];
	promotions: Promotion[];
	meta: ChainPageMeta;
	structuredData: Record<string, unknown>[];
}

/**
 * Chain statistics for overview
 */
export interface ChainStats {
	totalChains: number;
	mainnetChains: number;
	testnetChains: number;
	chainsWithTvl: number;
	totalTvl: number;
}
