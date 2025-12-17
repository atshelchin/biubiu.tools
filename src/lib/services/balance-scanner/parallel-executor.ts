/**
 * Parallel RPC Executor
 *
 * Executes multicall batches across multiple RPCs in parallel for faster scanning.
 * Handles per-RPC rate limiting and quality tracking.
 */

import {
	createPublicClient,
	http,
	encodeFunctionData,
	decodeFunctionResult,
	type Address
} from 'viem';
import { getRPCQualityTracker, type RPCQualityTracker } from './rpc-quality';
import type { RPCEndpoint, TokenConfig, ParallelScanConfig, ScanEvent } from './types';

// Multicall3 contract address (same on all EVM chains)
const MULTICALL3_ADDRESS = '0x2055A30B00555e7cAd48b1756eac4f917781489b' as Address;

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
	},
	{
		name: 'getEthBalance',
		type: 'function',
		stateMutability: 'view',
		inputs: [{ name: 'addr', type: 'address' }],
		outputs: [{ name: 'balance', type: 'uint256' }]
	}
];

// ERC20 balanceOf ABI
const ERC20_BALANCE_ABI = [
	{
		name: 'balanceOf',
		type: 'function',
		stateMutability: 'view',
		inputs: [{ name: 'account', type: 'address' }],
		outputs: [{ name: '', type: 'uint256' }]
	}
];

/**
 * Result of a parallel batch execution
 */
export interface ParallelBatchResult {
	/** RPC URL that processed this batch */
	rpcUrl: string;
	/** RPC display name */
	rpcName: string;
	/** Whether the batch was successful overall */
	success: boolean;
	/** Individual address results */
	results: Array<{ success: boolean; balance: bigint }>;
	/** Response time in ms */
	responseTime: number;
	/** Error if batch failed */
	error?: string;
	/** Whether this was a rate limit error */
	isRateLimited?: boolean;
}

/**
 * Status of an RPC endpoint for parallel execution
 */
interface RPCStatus {
	endpoint: RPCEndpoint;
	isHealthy: boolean;
	rateLimitedUntil?: number;
	consecutiveFailures: number;
}

const RATE_LIMIT_COOLDOWN = 30000; // 30 seconds
const MAX_CONSECUTIVE_FAILURES = 3;
const MAX_BATCH_PER_RPC = 500; // Max addresses per RPC request to avoid RPC rejection

/**
 * Parallel RPC Executor
 *
 * Distributes batches across multiple RPCs for parallel execution
 */
export class ParallelRPCExecutor {
	private rpcStatuses: RPCStatus[];
	private qualityTracker: RPCQualityTracker;
	private chainId: number;
	private networkName: string;
	private networkSymbol: string;
	private config: ParallelScanConfig;
	private onEvent?: (event: ScanEvent) => void;

	constructor(options: {
		rpcEndpoints: RPCEndpoint[];
		chainId: number;
		networkName: string;
		networkSymbol: string;
		config: ParallelScanConfig;
		onEvent?: (event: ScanEvent) => void;
	}) {
		this.qualityTracker = getRPCQualityTracker();
		this.chainId = options.chainId;
		this.networkName = options.networkName;
		this.networkSymbol = options.networkSymbol;
		this.config = options.config;
		this.onEvent = options.onEvent;

		// Initialize RPC statuses sorted by quality score
		const rankedRPCs = this.qualityTracker.getRankedRPCs(options.chainId);
		const rpcScores = new Map(rankedRPCs.map((r) => [r.url, r.score]));

		// Sort by quality score (higher = better), then by priority
		const sortedEndpoints = [...options.rpcEndpoints].sort((a, b) => {
			const scoreA = rpcScores.get(a.url) ?? 50;
			const scoreB = rpcScores.get(b.url) ?? 50;
			if (scoreA !== scoreB) return scoreB - scoreA;
			return (a.priority ?? 100) - (b.priority ?? 100);
		});

		this.rpcStatuses = sortedEndpoints.map((endpoint) => ({
			endpoint,
			isHealthy: true,
			consecutiveFailures: 0
		}));
	}

	/**
	 * Get available (healthy) RPCs for parallel execution
	 */
	getAvailableRPCs(): RPCEndpoint[] {
		const now = Date.now();
		return this.rpcStatuses
			.filter((s) => s.isHealthy && (!s.rateLimitedUntil || s.rateLimitedUntil < now))
			.slice(0, this.config.maxParallelRPCs)
			.map((s) => s.endpoint);
	}

	/**
	 * Get number of available RPCs
	 */
	getAvailableCount(): number {
		return this.getAvailableRPCs().length;
	}

	/**
	 * Check if parallel mode should be used
	 */
	shouldUseParallel(batchSize: number): boolean {
		return (
			this.config.enabled &&
			this.getAvailableCount() > 1 &&
			batchSize >= this.config.minBatchSize * 2
		);
	}

	/**
	 * Execute batches in parallel across multiple RPCs
	 *
	 * @param token - Token to query
	 * @param addresses - All addresses to scan
	 * @returns Combined results from all RPCs
	 */
	async executeParallel(
		token: TokenConfig,
		addresses: Address[]
	): Promise<{
		results: Map<Address, { success: boolean; balance: bigint }>;
		rpcResults: ParallelBatchResult[];
	}> {
		const availableRPCs = this.getAvailableRPCs();
		const results = new Map<Address, { success: boolean; balance: bigint }>();
		const rpcResults: ParallelBatchResult[] = [];

		if (availableRPCs.length === 0) {
			return { results, rpcResults };
		}

		// Distribute addresses across available RPCs with max batch size limit
		// Each RPC should not receive more than MAX_BATCH_PER_RPC addresses per request
		const batches: Array<{ rpc: RPCEndpoint; addresses: Address[] }> = [];
		let addressIndex = 0;

		while (addressIndex < addresses.length) {
			for (const rpc of availableRPCs) {
				if (addressIndex >= addresses.length) break;

				const batchSize = Math.min(MAX_BATCH_PER_RPC, addresses.length - addressIndex);
				batches.push({
					rpc,
					addresses: addresses.slice(addressIndex, addressIndex + batchSize)
				});
				addressIndex += batchSize;
			}
		}

		// Execute all batches in parallel
		const batchPromises = batches.map(async ({ rpc, addresses: batchAddresses }) => {
			const rpcName = rpc.name || new URL(rpc.url).hostname;

			try {
				const startTime = Date.now();
				const batchResults = await this.executeBatchOnRPC(rpc, token, batchAddresses);
				const responseTime = Date.now() - startTime;

				// Record success
				this.markRPCSuccess(rpc.url);
				this.qualityTracker.recordSuccess(rpc.url, this.chainId, responseTime);

				// Map results
				for (let i = 0; i < batchAddresses.length; i++) {
					results.set(batchAddresses[i], batchResults[i]);
				}

				return {
					rpcUrl: rpc.url,
					rpcName,
					success: true,
					results: batchResults,
					responseTime
				} as ParallelBatchResult;
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				const isRateLimited = this.isRateLimitError(error);

				if (isRateLimited) {
					this.markRPCRateLimited(rpc.url);
					this.qualityTracker.recordRateLimit(rpc.url, this.chainId);
				} else {
					this.markRPCFailed(rpc.url);
					this.qualityTracker.recordFailure(rpc.url, this.chainId);
				}

				// Mark all addresses in this batch as failed
				for (const addr of batchAddresses) {
					results.set(addr, { success: false, balance: 0n });
				}

				return {
					rpcUrl: rpc.url,
					rpcName,
					success: false,
					results: batchAddresses.map(() => ({ success: false, balance: 0n })),
					responseTime: 0,
					error: errorMessage,
					isRateLimited
				} as ParallelBatchResult;
			}
		});

		const batchResultsArray = await Promise.all(batchPromises);
		rpcResults.push(...batchResultsArray);

		return { results, rpcResults };
	}

	/**
	 * Execute a single batch on a specific RPC
	 */
	private async executeBatchOnRPC(
		rpc: RPCEndpoint,
		token: TokenConfig,
		addresses: Address[]
	): Promise<Array<{ success: boolean; balance: bigint }>> {
		const isNative = !token.address;

		const client = createPublicClient({
			chain: {
				id: this.chainId,
				name: this.networkName,
				nativeCurrency: {
					name: this.networkSymbol,
					symbol: this.networkSymbol,
					decimals: 18
				},
				rpcUrls: {
					default: { http: [rpc.url] }
				}
			},
			transport: http(rpc.url, {
				retryCount: 0,
				timeout: 30000
			})
		});

		// Build multicall
		const calls = addresses.map((address) => ({
			target: isNative ? MULTICALL3_ADDRESS : token.address!,
			allowFailure: true,
			callData: isNative
				? encodeFunctionData({
						abi: MULTICALL3_ABI,
						functionName: 'getEthBalance',
						args: [address]
					})
				: encodeFunctionData({
						abi: ERC20_BALANCE_ABI,
						functionName: 'balanceOf',
						args: [address]
					})
		}));

		// Execute multicall
		const response = (await client.readContract({
			address: MULTICALL3_ADDRESS,
			abi: MULTICALL3_ABI,
			functionName: 'aggregate3',
			args: [calls]
		})) as unknown as Array<{ success: boolean; returnData: string }>;

		// Validate response
		if (!response || !Array.isArray(response) || response.length !== addresses.length) {
			throw new Error(
				`Invalid response: expected ${addresses.length} results, got ${response?.length || 0}`
			);
		}

		// Parse results
		return response.map((result) => {
			if (!result.success || result.returnData === '0x') {
				return { success: false, balance: 0n };
			}

			try {
				const balance = isNative
					? (decodeFunctionResult({
							abi: MULTICALL3_ABI,
							functionName: 'getEthBalance',
							data: result.returnData as `0x${string}`
						}) as bigint)
					: (decodeFunctionResult({
							abi: ERC20_BALANCE_ABI,
							functionName: 'balanceOf',
							data: result.returnData as `0x${string}`
						}) as bigint);

				return { success: true, balance };
			} catch {
				return { success: false, balance: 0n };
			}
		});
	}

	/**
	 * Check if error is a rate limit error
	 */
	private isRateLimitError(error: unknown): boolean {
		if (!(error instanceof Error)) return false;

		const message = error.message.toLowerCase();
		const rateLimitPatterns = [
			'429',
			'rate limit',
			'too many requests',
			'throttl',
			'exceeded',
			'limit exceeded',
			'quota',
			'cors',
			'failed to fetch',
			'network error',
			'econnrefused',
			'econnreset',
			'etimedout',
			'socket hang up'
		];

		return rateLimitPatterns.some((pattern) => message.includes(pattern));
	}

	/**
	 * Mark RPC as successful
	 */
	private markRPCSuccess(url: string): void {
		const status = this.rpcStatuses.find((s) => s.endpoint.url === url);
		if (status) {
			status.isHealthy = true;
			status.consecutiveFailures = 0;
		}
	}

	/**
	 * Mark RPC as failed
	 */
	private markRPCFailed(url: string): void {
		const status = this.rpcStatuses.find((s) => s.endpoint.url === url);
		if (status) {
			status.consecutiveFailures++;
			if (status.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
				status.isHealthy = false;
			}
		}
	}

	/**
	 * Mark RPC as rate limited
	 */
	private markRPCRateLimited(url: string): void {
		const status = this.rpcStatuses.find((s) => s.endpoint.url === url);
		if (status) {
			status.rateLimitedUntil = Date.now() + RATE_LIMIT_COOLDOWN;
			status.isHealthy = false;
		}
	}

	/**
	 * Reset all RPCs (for recovery)
	 */
	resetAllRPCs(): void {
		for (const status of this.rpcStatuses) {
			status.isHealthy = true;
			status.consecutiveFailures = 0;
			status.rateLimitedUntil = undefined;
		}
	}

	/**
	 * Check if all RPCs are exhausted
	 */
	isAllExhausted(): boolean {
		return this.getAvailableCount() === 0;
	}

	/**
	 * Get status summary for logging
	 */
	getStatusSummary(): string {
		const available = this.getAvailableCount();
		const total = this.rpcStatuses.length;
		return `${available}/${total} RPCs available`;
	}

	/**
	 * Emit a scan event
	 */
	private emitEvent(
		type: ScanEvent['type'],
		message: string,
		details?: Record<string, unknown>
	): void {
		if (this.onEvent) {
			this.onEvent({
				type,
				timestamp: Date.now(),
				message,
				details
			});
		}
	}
}

/**
 * Create a parallel executor instance
 */
export function createParallelExecutor(options: {
	rpcEndpoints: RPCEndpoint[];
	chainId: number;
	networkName: string;
	networkSymbol: string;
	config: ParallelScanConfig;
	onEvent?: (event: ScanEvent) => void;
}): ParallelRPCExecutor {
	return new ParallelRPCExecutor(options);
}
