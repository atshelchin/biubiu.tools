/**
 * Chain data utilities
 * Loads and processes chain data from rpcs.json
 */

import type { Chain, ParsedRpcEndpoint, ChainStats, RpcEndpoint } from '../types';

// Import raw chain data
import rawChains from '../../../../static/rpcs.json';

/**
 * All chains from rpcs.json
 */
export const allChains: Chain[] = rawChains as Chain[];

/**
 * Get chain by chainId
 */
export function getChainById(chainId: number): Chain | undefined {
	return allChains.find((c) => c.chainId === chainId);
}

/**
 * Get chain by slug (chainSlug or shortName)
 */
export function getChainBySlug(slug: string): Chain | undefined {
	const lowerSlug = slug.toLowerCase();
	return allChains.find(
		(c) => c.chainSlug?.toLowerCase() === lowerSlug || c.shortName?.toLowerCase() === lowerSlug
	);
}

/**
 * Get all mainnet chains (non-testnet)
 */
export function getMainnetChains(): Chain[] {
	return allChains.filter((c) => !c.isTestnet);
}

/**
 * Get all testnet chains
 */
export function getTestnetChains(): Chain[] {
	return allChains.filter((c) => c.isTestnet === true);
}

/**
 * Get chains sorted by TVL (descending)
 */
export function getChainsByTvl(limit?: number): Chain[] {
	const sorted = allChains
		.filter((c) => c.tvl && c.tvl > 0 && !c.isTestnet)
		.sort((a, b) => (b.tvl || 0) - (a.tvl || 0));
	return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get chain statistics
 */
export function getChainStats(): ChainStats {
	const mainnetChains = allChains.filter((c) => !c.isTestnet);
	const testnetChains = allChains.filter((c) => c.isTestnet === true);
	const chainsWithTvl = mainnetChains.filter((c) => c.tvl && c.tvl > 0);
	const totalTvl = chainsWithTvl.reduce((sum, c) => sum + (c.tvl || 0), 0);

	return {
		totalChains: allChains.length,
		mainnetChains: mainnetChains.length,
		testnetChains: testnetChains.length,
		chainsWithTvl: chainsWithTvl.length,
		totalTvl
	};
}

/**
 * Parse RPC endpoints to normalized format
 */
export function parseRpcEndpoints(chain: Chain): ParsedRpcEndpoint[] {
	return chain.rpc.map((rpc) => {
		if (typeof rpc === 'string') {
			return {
				url: rpc,
				tracking: 'unspecified' as const,
				isOpenSource: false,
				isWebSocket: rpc.startsWith('wss://')
			};
		}
		const endpoint = rpc as RpcEndpoint;
		return {
			url: endpoint.url,
			tracking: endpoint.tracking || 'unspecified',
			isOpenSource: endpoint.isOpenSource || false,
			isWebSocket: endpoint.url.startsWith('wss://')
		};
	});
}

/**
 * Filter RPC endpoints by tracking preference
 */
export function filterRpcsByTracking(
	rpcs: ParsedRpcEndpoint[],
	allowedTracking: ('none' | 'limited' | 'yes' | 'unspecified')[]
): ParsedRpcEndpoint[] {
	return rpcs.filter((rpc) => allowedTracking.includes(rpc.tracking));
}

/**
 * Get HTTP-only RPC endpoints
 */
export function getHttpRpcs(rpcs: ParsedRpcEndpoint[]): ParsedRpcEndpoint[] {
	return rpcs.filter((rpc) => !rpc.isWebSocket);
}

/**
 * Get WebSocket-only RPC endpoints
 */
export function getWsRpcs(rpcs: ParsedRpcEndpoint[]): ParsedRpcEndpoint[] {
	return rpcs.filter((rpc) => rpc.isWebSocket);
}

/**
 * Format TVL for display
 */
export function formatTvl(tvl: number): string {
	if (tvl >= 1_000_000_000) {
		return `$${(tvl / 1_000_000_000).toFixed(2)}B`;
	}
	if (tvl >= 1_000_000) {
		return `$${(tvl / 1_000_000).toFixed(2)}M`;
	}
	if (tvl >= 1_000) {
		return `$${(tvl / 1_000).toFixed(2)}K`;
	}
	return `$${tvl.toFixed(2)}`;
}

/**
 * Get chain URL slug (for routing)
 */
export function getChainSlug(chain: Chain): string {
	return chain.chainSlug || chain.shortName || chain.chainId.toString();
}

/**
 * Search chains by name, symbol, or chainId
 */
export function searchChains(query: string, chains: Chain[] = allChains): Chain[] {
	const lowerQuery = query.toLowerCase().trim();
	if (!lowerQuery) return chains;

	return chains.filter((chain) => {
		const searchableText = [
			chain.name,
			chain.chain,
			chain.shortName,
			chain.chainSlug,
			chain.chainId.toString(),
			chain.nativeCurrency?.symbol
		]
			.filter(Boolean)
			.join(' ')
			.toLowerCase();

		return searchableText.includes(lowerQuery);
	});
}
