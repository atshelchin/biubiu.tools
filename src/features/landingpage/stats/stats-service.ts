/**
 * Platform Statistics Service
 *
 * Queries contract usage data from multiple chains using Multicall3
 * Handles gracefully when contracts are not deployed on certain chains
 */

import {
	createPublicClient,
	http,
	encodeFunctionData,
	decodeFunctionResult,
	type Address
} from 'viem';
import { getChainsByTvl, parseRpcEndpoints, getHttpRpcs } from '@/features/chains/data/chains';
import {
	CONTRACT_ADDRESSES,
	DEFAULT_STATS_CONFIG,
	type ChainContractStats,
	type PlatformStats,
	type StatsQueryConfig
} from './types';

// Multicall3 ABI (minimal)
const MULTICALL3_ABI = [
	{
		name: 'aggregate3',
		type: 'function',
		stateMutability: 'payable',
		inputs: [
			{
				name: 'calls',
				type: 'tuple[]',
				components: [
					{ name: 'target', type: 'address' },
					{ name: 'allowFailure', type: 'bool' },
					{ name: 'callData', type: 'bytes' }
				]
			}
		],
		outputs: [
			{
				name: 'returnData',
				type: 'tuple[]',
				components: [
					{ name: 'success', type: 'bool' },
					{ name: 'returnData', type: 'bytes' }
				]
			}
		]
	}
] as const;

// ERC721 totalSupply ABI
const ERC721_TOTAL_SUPPLY_ABI = [
	{
		name: 'totalSupply',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ name: '', type: 'uint256' }]
	}
] as const;

// Usage stats ABI (shared by TokenFactory, NFTFactory, TokenDistribution, TokenSweep)
const USAGE_STATS_ABI = [
	{
		name: 'totalFreeUsage',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ name: '', type: 'uint256' }]
	},
	{
		name: 'totalPremiumUsage',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ name: '', type: 'uint256' }]
	},
	{
		name: 'totalPaidUsage',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ name: '', type: 'uint256' }]
	}
] as const;

/**
 * Build multicall data for querying all contract stats
 * Returns 13 calls total:
 * - 1 for BiuBiuPremium.totalSupply
 * - 3 for each of 4 tool contracts (totalFreeUsage, totalPremiumUsage, totalPaidUsage)
 */
function buildMulticallData(): Array<{
	target: Address;
	allowFailure: true;
	callData: `0x${string}`;
}> {
	const totalSupplyCallData = encodeFunctionData({
		abi: ERC721_TOTAL_SUPPLY_ABI,
		functionName: 'totalSupply'
	});

	const freeUsageCallData = encodeFunctionData({
		abi: USAGE_STATS_ABI,
		functionName: 'totalFreeUsage'
	});

	const premiumUsageCallData = encodeFunctionData({
		abi: USAGE_STATS_ABI,
		functionName: 'totalPremiumUsage'
	});

	const paidUsageCallData = encodeFunctionData({
		abi: USAGE_STATS_ABI,
		functionName: 'totalPaidUsage'
	});

	return [
		// BiuBiuPremium - totalSupply (index 0)
		{
			target: CONTRACT_ADDRESSES.BIUBIU_PREMIUM,
			allowFailure: true,
			callData: totalSupplyCallData
		},

		// TokenFactory - freeUsage, premiumUsage, paidUsage (index 1-3)
		{ target: CONTRACT_ADDRESSES.TOKEN_FACTORY, allowFailure: true, callData: freeUsageCallData },
		{
			target: CONTRACT_ADDRESSES.TOKEN_FACTORY,
			allowFailure: true,
			callData: premiumUsageCallData
		},
		{ target: CONTRACT_ADDRESSES.TOKEN_FACTORY, allowFailure: true, callData: paidUsageCallData },

		// NFTFactory - freeUsage, premiumUsage, paidUsage (index 4-6)
		{ target: CONTRACT_ADDRESSES.NFT_FACTORY, allowFailure: true, callData: freeUsageCallData },
		{ target: CONTRACT_ADDRESSES.NFT_FACTORY, allowFailure: true, callData: premiumUsageCallData },
		{ target: CONTRACT_ADDRESSES.NFT_FACTORY, allowFailure: true, callData: paidUsageCallData },

		// TokenDistribution - freeUsage, premiumUsage, paidUsage (index 7-9)
		{
			target: CONTRACT_ADDRESSES.TOKEN_DISTRIBUTION,
			allowFailure: true,
			callData: freeUsageCallData
		},
		{
			target: CONTRACT_ADDRESSES.TOKEN_DISTRIBUTION,
			allowFailure: true,
			callData: premiumUsageCallData
		},
		{
			target: CONTRACT_ADDRESSES.TOKEN_DISTRIBUTION,
			allowFailure: true,
			callData: paidUsageCallData
		},

		// TokenSweep - freeUsage, premiumUsage, paidUsage (index 10-12)
		{ target: CONTRACT_ADDRESSES.TOKEN_SWEEP, allowFailure: true, callData: freeUsageCallData },
		{ target: CONTRACT_ADDRESSES.TOKEN_SWEEP, allowFailure: true, callData: premiumUsageCallData },
		{ target: CONTRACT_ADDRESSES.TOKEN_SWEEP, allowFailure: true, callData: paidUsageCallData }
	];
}

/**
 * Decode a uint256 result from multicall response
 */
function decodeUint256Result(
	result: { success: boolean; returnData: `0x${string}` },
	abi: typeof ERC721_TOTAL_SUPPLY_ABI | typeof USAGE_STATS_ABI,
	functionName: 'totalSupply' | 'totalFreeUsage' | 'totalPremiumUsage' | 'totalPaidUsage'
): { success: boolean; value: bigint } {
	if (!result.success || result.returnData === '0x' || result.returnData.length < 66) {
		return { success: false, value: 0n };
	}

	try {
		const value = decodeFunctionResult({
			abi,
			functionName,
			data: result.returnData
		}) as bigint;
		return { success: true, value };
	} catch {
		return { success: false, value: 0n };
	}
}

/**
 * Query stats for a single chain
 */
async function queryChainStats(
	chainId: number,
	chainName: string,
	chainIcon: string | undefined,
	nativeSymbol: string,
	rpcUrl: string,
	timeout: number
): Promise<ChainContractStats | null> {
	const client = createPublicClient({
		chain: {
			id: chainId,
			name: chainName,
			nativeCurrency: { name: nativeSymbol, symbol: nativeSymbol, decimals: 18 },
			rpcUrls: { default: { http: [rpcUrl] } }
		},
		transport: http(rpcUrl, { retryCount: 0, timeout })
	});

	const calls = buildMulticallData();

	try {
		const response = await client.readContract({
			address: CONTRACT_ADDRESSES.MULTICALL3,
			abi: MULTICALL3_ABI,
			functionName: 'aggregate3',
			args: [calls]
		});

		// Type assertion for response
		const results = response as unknown as Array<{ success: boolean; returnData: `0x${string}` }>;

		if (!results || results.length !== 13) {
			return null;
		}

		// Parse results
		const premium = decodeUint256Result(results[0], ERC721_TOTAL_SUPPLY_ABI, 'totalSupply');

		const tokenFactoryFree = decodeUint256Result(results[1], USAGE_STATS_ABI, 'totalFreeUsage');
		const tokenFactoryPremium = decodeUint256Result(
			results[2],
			USAGE_STATS_ABI,
			'totalPremiumUsage'
		);
		const tokenFactoryPaid = decodeUint256Result(results[3], USAGE_STATS_ABI, 'totalPaidUsage');

		const nftFactoryFree = decodeUint256Result(results[4], USAGE_STATS_ABI, 'totalFreeUsage');
		const nftFactoryPremium = decodeUint256Result(results[5], USAGE_STATS_ABI, 'totalPremiumUsage');
		const nftFactoryPaid = decodeUint256Result(results[6], USAGE_STATS_ABI, 'totalPaidUsage');

		const distributionFree = decodeUint256Result(results[7], USAGE_STATS_ABI, 'totalFreeUsage');
		const distributionPremium = decodeUint256Result(
			results[8],
			USAGE_STATS_ABI,
			'totalPremiumUsage'
		);
		const distributionPaid = decodeUint256Result(results[9], USAGE_STATS_ABI, 'totalPaidUsage');

		const sweepFree = decodeUint256Result(results[10], USAGE_STATS_ABI, 'totalFreeUsage');
		const sweepPremium = decodeUint256Result(results[11], USAGE_STATS_ABI, 'totalPremiumUsage');
		const sweepPaid = decodeUint256Result(results[12], USAGE_STATS_ABI, 'totalPaidUsage');

		// Build contract stats
		const tokenFactoryDeployed = tokenFactoryFree.success;
		const nftFactoryDeployed = nftFactoryFree.success;
		const distributionDeployed = distributionFree.success;
		const sweepDeployed = sweepFree.success;

		const tokenFactoryTotal =
			tokenFactoryFree.value + tokenFactoryPremium.value + tokenFactoryPaid.value;
		const nftFactoryTotal = nftFactoryFree.value + nftFactoryPremium.value + nftFactoryPaid.value;
		const distributionTotal =
			distributionFree.value + distributionPremium.value + distributionPaid.value;
		const sweepTotal = sweepFree.value + sweepPremium.value + sweepPaid.value;

		const totalToolUsage = tokenFactoryTotal + nftFactoryTotal + distributionTotal + sweepTotal;

		// Count deployed contracts
		let deployedCount = 0;
		if (premium.success) deployedCount++;
		if (tokenFactoryDeployed) deployedCount++;
		if (nftFactoryDeployed) deployedCount++;
		if (distributionDeployed) deployedCount++;
		if (sweepDeployed) deployedCount++;

		// Skip chains with no contracts deployed
		if (deployedCount === 0) {
			return null;
		}

		return {
			chainId,
			chainName,
			chainIcon,
			nativeSymbol,
			biubiuPremium: { deployed: premium.success, totalSupply: premium.value },
			tokenFactory: {
				deployed: tokenFactoryDeployed,
				totalUsage: tokenFactoryTotal,
				freeUsage: tokenFactoryFree.value,
				premiumUsage: tokenFactoryPremium.value,
				paidUsage: tokenFactoryPaid.value
			},
			nftFactory: {
				deployed: nftFactoryDeployed,
				totalUsage: nftFactoryTotal,
				freeUsage: nftFactoryFree.value,
				premiumUsage: nftFactoryPremium.value,
				paidUsage: nftFactoryPaid.value
			},
			tokenDistribution: {
				deployed: distributionDeployed,
				totalUsage: distributionTotal,
				freeUsage: distributionFree.value,
				premiumUsage: distributionPremium.value,
				paidUsage: distributionPaid.value
			},
			tokenSweep: {
				deployed: sweepDeployed,
				totalUsage: sweepTotal,
				freeUsage: sweepFree.value,
				premiumUsage: sweepPremium.value,
				paidUsage: sweepPaid.value
			},
			totalToolUsage,
			deployedContractCount: deployedCount,
			lastUpdated: Date.now()
		};
	} catch {
		// Multicall3 not deployed or RPC error
		return null;
	}
}

/**
 * Process chains in parallel with concurrency limit
 */
async function processWithConcurrency<T, R>(
	items: T[],
	processor: (item: T) => Promise<R>,
	concurrency: number
): Promise<R[]> {
	const results: R[] = [];
	const executing: Promise<void>[] = [];

	for (const item of items) {
		const promise = processor(item).then((result) => {
			results.push(result);
		});

		executing.push(promise);

		if (executing.length >= concurrency) {
			await Promise.race(executing);
			// Remove completed promises
			const completed = executing.filter((p) => {
				let resolved = false;
				p.then(() => {
					resolved = true;
				});
				return !resolved;
			});
			executing.length = 0;
			executing.push(...completed);
		}
	}

	await Promise.all(executing);
	return results;
}

/**
 * Query platform stats from all supported chains
 */
export async function queryPlatformStats(
	config: Partial<StatsQueryConfig> = {},
	onProgress?: (completed: number, total: number) => void
): Promise<PlatformStats> {
	const finalConfig = { ...DEFAULT_STATS_CONFIG, ...config };
	const { maxChains, timeoutPerChain, concurrency, includeTestnets } = finalConfig;

	// Get chains sorted by TVL
	const chains = getChainsByTvl(maxChains).filter((chain) => includeTestnets || !chain.isTestnet);

	const totalChains = chains.length;
	let completedChains = 0;

	// Query each chain
	const chainResults = await processWithConcurrency(
		chains,
		async (chain) => {
			// Get HTTP RPC endpoints
			const parsedRpcs = parseRpcEndpoints(chain);
			const httpRpcs = getHttpRpcs(parsedRpcs);

			if (httpRpcs.length === 0) {
				completedChains++;
				onProgress?.(completedChains, totalChains);
				return null;
			}

			// Try first available RPC
			const rpcUrl = httpRpcs[0].url;

			const result = await queryChainStats(
				chain.chainId,
				chain.name,
				chain.icon,
				chain.nativeCurrency?.symbol || 'ETH',
				rpcUrl,
				timeoutPerChain
			);

			completedChains++;
			onProgress?.(completedChains, totalChains);

			return result;
		},
		concurrency
	);

	// Filter out null results and aggregate
	const validResults = chainResults.filter(
		(result): result is ChainContractStats => result !== null
	);

	// Sort by total usage descending
	validResults.sort((a, b) => {
		const aTotal = Number(a.totalToolUsage);
		const bTotal = Number(b.totalToolUsage);
		return bTotal - aTotal;
	});

	// Aggregate stats
	let totalPremiumSubscribers = 0n;
	let totalToolUsage = 0n;
	let totalFreeUsage = 0n;
	let totalPremiumUsage = 0n;
	let totalPaidUsage = 0n;

	for (const chain of validResults) {
		totalPremiumSubscribers += chain.biubiuPremium.totalSupply;
		totalToolUsage += chain.totalToolUsage;

		totalFreeUsage +=
			(chain.tokenFactory.freeUsage || 0n) +
			(chain.nftFactory.freeUsage || 0n) +
			(chain.tokenDistribution.freeUsage || 0n) +
			(chain.tokenSweep.freeUsage || 0n);

		totalPremiumUsage +=
			(chain.tokenFactory.premiumUsage || 0n) +
			(chain.nftFactory.premiumUsage || 0n) +
			(chain.tokenDistribution.premiumUsage || 0n) +
			(chain.tokenSweep.premiumUsage || 0n);

		totalPaidUsage +=
			(chain.tokenFactory.paidUsage || 0n) +
			(chain.nftFactory.paidUsage || 0n) +
			(chain.tokenDistribution.paidUsage || 0n) +
			(chain.tokenSweep.paidUsage || 0n);
	}

	return {
		totalPremiumSubscribers,
		totalToolUsage,
		totalFreeUsage,
		totalPremiumUsage,
		totalPaidUsage,
		activeNetworks: validResults.length,
		totalNetworksChecked: totalChains,
		topNetworks: validResults.slice(0, 20),
		lastUpdated: Date.now(),
		isLoading: false
	};
}

/**
 * Format large numbers for display
 */
export function formatStatNumber(value: bigint | number): string {
	const num = typeof value === 'bigint' ? Number(value) : value;

	if (num >= 1_000_000) {
		return `${(num / 1_000_000).toFixed(1)}M`;
	}
	if (num >= 1_000) {
		return `${(num / 1_000).toFixed(1)}K`;
	}
	return num.toLocaleString();
}
