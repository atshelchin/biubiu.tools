/**
 * Balance Scanner
 *
 * Robust balance scanner that:
 * - Tracks progress at the address level
 * - Auto-retries failed tasks
 * - Handles rate limiting gracefully
 * - Never loses data
 * - Provides real-time logging
 */

import {
	createPublicClient,
	http,
	encodeFunctionData,
	decodeFunctionResult,
	type Address
} from 'viem';
import { RPCManager } from './rpc-manager';
import {
	type ScanState,
	type ScanStats,
	type ScannerOptions,
	type ScanCallbacks,
	type ScanEvent,
	type TokenConfig,
	type AddressBalance,
	type TokenBalance,
	createInitialState,
	getTaskKey,
	calculateProgress
} from './types';

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
 * Detect if an error is a rate limit error
 */
function isRateLimitError(error: unknown): boolean {
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
 * Format balance for display
 */
function formatBalance(balance: bigint, decimals: number): string {
	if (balance === 0n) return '0';

	const str = balance.toString().padStart(decimals + 1, '0');
	const intPart = str.slice(0, -decimals) || '0';
	const decPart = str.slice(-decimals).replace(/0+$/, '');

	return decPart ? `${intPart}.${decPart}` : intPart;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Balance Scanner Class
 */
export class BalanceScanner {
	private state: ScanState;
	private rpcManager: RPCManager;
	private callbacks: ScanCallbacks;
	private networkName: string;
	private networkSymbol: string;
	private isRunning: boolean = false;
	private shouldStop: boolean = false;
	private consecutiveErrors: number = 0;

	constructor(options: ScannerOptions) {
		this.rpcManager = new RPCManager(options.rpcEndpoints);
		this.callbacks = options.callbacks || {};
		this.networkName = options.networkName;
		this.networkSymbol = options.networkSymbol;

		// Initialize or restore state
		if (options.initialState) {
			this.state = options.initialState;
			this.emitEvent('scan_resumed', `Resuming scan from ${this.state.stats.progress}%`);
		} else {
			this.state = createInitialState(options);
		}
	}

	/**
	 * Get current state (for persistence)
	 */
	getState(): ScanState {
		return this.state;
	}

	/**
	 * Get current stats
	 */
	getStats(): ScanStats {
		return this.state.stats;
	}

	/**
	 * Check if scan is complete
	 */
	isComplete(): boolean {
		return this.state.stats.pending === 0 && this.state.stats.failed === 0;
	}

	/**
	 * Check if scan is running
	 */
	getIsRunning(): boolean {
		return this.isRunning;
	}

	/**
	 * Pause the scan
	 */
	pause(): void {
		this.shouldStop = true;
		this.state.isPaused = true;
		this.state.pauseReason = 'user_pause';
	}

	/**
	 * Start or resume the scan
	 */
	async scan(): Promise<AddressBalance[]> {
		if (this.isRunning) {
			throw new Error('Scan is already running');
		}

		this.isRunning = true;
		this.shouldStop = false;
		this.state.isPaused = false;
		this.state.pauseReason = undefined;

		this.emitEvent('scan_started', `Starting scan of ${this.state.addresses.length} addresses`);

		try {
			await this.runScanLoop();
		} finally {
			this.isRunning = false;
		}

		return this.buildResults();
	}

	/**
	 * Main scan loop
	 */
	private async runScanLoop(): Promise<void> {
		while (!this.shouldStop && !this.isComplete()) {
			// Get pending tasks
			const pendingTasks = this.getPendingTasks();

			if (pendingTasks.length === 0) {
				// Check for failed tasks to retry
				const failedTasks = this.getFailedTasks();
				if (failedTasks.length === 0) {
					break; // All done!
				}

				// Reset failed tasks for retry
				this.emitEvent('retrying', `Retrying ${failedTasks.length} failed tasks`);
				for (const task of failedTasks) {
					const key = getTaskKey(task.address, task.tokenId);
					this.state.taskStatus.set(key, 'pending');
				}
				this.updateStats();
				continue;
			}

			// Group tasks by token for efficient batching
			const tasksByToken = this.groupTasksByToken(pendingTasks);

			for (const [tokenId, addresses] of tasksByToken) {
				if (this.shouldStop) break;

				const token = this.state.tokens.find((t) => t.id === tokenId);
				if (!token) continue;

				await this.scanTokenForAddresses(token, addresses);
			}
		}

		if (this.isComplete()) {
			this.emitEvent(
				'scan_completed',
				`Scan completed! ${this.state.stats.success} balances retrieved`
			);
			this.callbacks.onComplete?.(this.buildResults());
		} else if (this.state.isPaused) {
			this.emitEvent('scan_paused', `Scan paused: ${this.state.pauseReason}`);
			this.callbacks.onPause?.(this.state.pauseReason || 'unknown', this.state);
		}
	}

	/**
	 * Scan a specific token for a list of addresses
	 */
	private async scanTokenForAddresses(token: TokenConfig, addresses: Address[]): Promise<void> {
		const { batchSize, rateLimitDelay, retryDelay, maxConsecutiveErrors } = this.state.config;

		// Process in batches
		for (let i = 0; i < addresses.length; i += batchSize) {
			if (this.shouldStop) break;

			const batch = addresses.slice(i, i + batchSize);
			const batchNum = Math.floor(i / batchSize) + 1;
			const totalBatches = Math.ceil(addresses.length / batchSize);

			this.emitEvent(
				'batch_started',
				`[${token.symbol || token.id}] Batch ${batchNum}/${totalBatches} (${batch.length} addresses)`,
				{ tokenId: token.id, batch: batchNum, total: totalBatches }
			);

			try {
				const results = await this.executeBatch(token, batch);

				// Process results
				let successCount = 0;
				let failCount = 0;

				for (let j = 0; j < batch.length; j++) {
					const address = batch[j];
					const result = results[j];
					const key = getTaskKey(address, token.id);

					if (result.success) {
						this.state.taskStatus.set(key, 'success');
						this.state.balances.set(key, result.balance);
						successCount++;
					} else {
						// Mark as failed for retry
						const currentStatus = this.state.taskStatus.get(key);
						if (currentStatus !== 'success') {
							this.state.taskStatus.set(key, 'failed');
							failCount++;
						}
					}
				}

				this.consecutiveErrors = 0;
				this.rpcManager.markSuccess();
				this.updateStats();

				this.emitEvent(
					'batch_completed',
					`[${token.symbol || token.id}] Batch ${batchNum}/${totalBatches}: ${successCount} success, ${failCount} failed`,
					{ successCount, failCount }
				);

				// Report progress
				this.callbacks.onProgress?.(this.state.stats, this.state);
				this.callbacks.onStateChange?.(this.state);
			} catch (error) {
				this.consecutiveErrors++;

				if (isRateLimitError(error)) {
					this.emitEvent('rate_limited', `Rate limited on batch ${batchNum}. Switching RPC...`, {
						error: error instanceof Error ? error.message : String(error)
					});

					const hasHealthyRPC = this.rpcManager.markRateLimited();

					if (!hasHealthyRPC) {
						// All RPCs exhausted, wait and retry
						this.emitEvent('rate_limited', 'All RPCs rate limited. Waiting for recovery...');
						const recovered = await this.rpcManager.waitForAvailableRPC();

						if (!recovered) {
							// Still no available RPC, pause the scan
							this.state.isPaused = true;
							this.state.pauseReason = 'rate_limit';
							this.shouldStop = true;
							return;
						}
					}

					// Mark batch addresses as failed for retry
					for (const address of batch) {
						const key = getTaskKey(address, token.id);
						const currentStatus = this.state.taskStatus.get(key);
						if (currentStatus !== 'success') {
							this.state.taskStatus.set(key, 'failed');
						}
					}
					this.updateStats();

					// Add delay before retry
					await sleep(rateLimitDelay);
				} else {
					// Non-rate-limit error
					this.emitEvent(
						'batch_failed',
						`Batch ${batchNum} failed: ${error instanceof Error ? error.message : String(error)}`,
						{ error: error instanceof Error ? error.message : String(error) }
					);

					this.rpcManager.markFailed();

					// Mark batch as failed for retry
					for (const address of batch) {
						const key = getTaskKey(address, token.id);
						const currentStatus = this.state.taskStatus.get(key);
						if (currentStatus !== 'success') {
							this.state.taskStatus.set(key, 'failed');
						}
					}
					this.updateStats();

					// Check if too many consecutive errors
					if (this.consecutiveErrors >= maxConsecutiveErrors) {
						this.emitEvent(
							'scan_paused',
							`Paused after ${this.consecutiveErrors} consecutive errors`
						);
						this.state.isPaused = true;
						this.state.pauseReason = 'error';
						this.shouldStop = true;
						return;
					}

					await sleep(retryDelay);
				}
			}
		}
	}

	/**
	 * Execute a batch of balance queries via multicall
	 */
	private async executeBatch(
		token: TokenConfig,
		addresses: Address[]
	): Promise<Array<{ success: boolean; balance: bigint }>> {
		const rpcUrl = this.rpcManager.getCurrentRPC();
		const isNative = !token.address;

		// Create viem client
		const client = createPublicClient({
			chain: {
				id: this.state.chainId,
				name: this.networkName,
				nativeCurrency: {
					name: this.networkSymbol,
					symbol: this.networkSymbol,
					decimals: 18
				},
				rpcUrls: {
					default: { http: [rpcUrl] }
				}
			},
			transport: http(rpcUrl, {
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
	 * Get tasks that are still pending
	 */
	private getPendingTasks(): Array<{ address: Address; tokenId: string }> {
		const tasks: Array<{ address: Address; tokenId: string }> = [];

		for (const address of this.state.addresses) {
			for (const token of this.state.tokens) {
				const key = getTaskKey(address, token.id);
				if (this.state.taskStatus.get(key) === 'pending') {
					tasks.push({ address, tokenId: token.id });
				}
			}
		}

		return tasks;
	}

	/**
	 * Get tasks that failed and need retry
	 */
	private getFailedTasks(): Array<{ address: Address; tokenId: string }> {
		const tasks: Array<{ address: Address; tokenId: string }> = [];

		for (const address of this.state.addresses) {
			for (const token of this.state.tokens) {
				const key = getTaskKey(address, token.id);
				if (this.state.taskStatus.get(key) === 'failed') {
					tasks.push({ address, tokenId: token.id });
				}
			}
		}

		return tasks;
	}

	/**
	 * Group tasks by token for efficient batching
	 */
	private groupTasksByToken(
		tasks: Array<{ address: Address; tokenId: string }>
	): Map<string, Address[]> {
		const grouped = new Map<string, Address[]>();

		for (const task of tasks) {
			const addresses = grouped.get(task.tokenId) || [];
			addresses.push(task.address);
			grouped.set(task.tokenId, addresses);
		}

		return grouped;
	}

	/**
	 * Update statistics
	 */
	private updateStats(): void {
		let success = 0;
		let failed = 0;
		let pending = 0;

		for (const status of this.state.taskStatus.values()) {
			if (status === 'success') success++;
			else if (status === 'failed') failed++;
			else pending++;
		}

		this.state.stats = {
			total: this.state.taskStatus.size,
			success,
			failed,
			pending,
			progress: calculateProgress({
				total: this.state.taskStatus.size,
				success,
				failed,
				pending,
				progress: 0
			})
		};

		this.state.lastActivityAt = Date.now();
	}

	/**
	 * Build final results
	 */
	private buildResults(): AddressBalance[] {
		const results: AddressBalance[] = [];

		for (const address of this.state.addresses) {
			const balances: TokenBalance[] = [];
			let hasBalance = false;

			for (const token of this.state.tokens) {
				const key = getTaskKey(address, token.id);
				const balance = this.state.balances.get(key);

				if (balance !== undefined) {
					balances.push({
						tokenId: token.id,
						balance,
						formatted: formatBalance(balance, token.decimals)
					});

					if (balance > 0n) {
						hasBalance = true;
					}
				}
			}

			results.push({
				address,
				balances,
				hasBalance
			});
		}

		return results;
	}

	/**
	 * Emit a scan event
	 */
	private emitEvent(
		type: ScanEvent['type'],
		message: string,
		details?: Record<string, unknown>
	): void {
		const event: ScanEvent = {
			type,
			timestamp: Date.now(),
			message,
			details
		};

		// Always log to console
		const timestamp = new Date().toLocaleTimeString();
		console.log(`[${timestamp}] ${message}`);

		// Call callback
		this.callbacks.onEvent?.(event);
	}
}

/**
 * Create a new scanner instance
 */
export function createScanner(options: ScannerOptions): BalanceScanner {
	return new BalanceScanner(options);
}
