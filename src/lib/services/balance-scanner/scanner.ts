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
import { getRPCQualityTracker, type RPCQualityTracker } from './rpc-quality';
import { ParallelRPCExecutor } from './parallel-executor';
import {
	type ScanState,
	type ScanStats,
	type ScannerOptions,
	type ScanCallbacks,
	type ScanEvent,
	type TokenConfig,
	type AddressBalance,
	type TokenBalance,
	type AutoRecoveryConfig,
	type ParallelScanConfig,
	DEFAULT_AUTO_RECOVERY_CONFIG,
	DEFAULT_PARALLEL_SCAN_CONFIG,
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
	private qualityTracker: RPCQualityTracker;
	private parallelExecutor: ParallelRPCExecutor | null = null;
	private callbacks: ScanCallbacks;
	private networkName: string;
	private networkSymbol: string;
	private isRunning: boolean = false;
	private shouldStop: boolean = false;
	private abortController: AbortController | null = null;
	private consecutiveErrors: number = 0;
	private autoRecoveryConfig: AutoRecoveryConfig;
	private parallelConfig: ParallelScanConfig;
	private recoveryAttempts: number = 0;
	private currentRecoveryDelay: number = 0;

	constructor(options: ScannerOptions) {
		this.rpcManager = new RPCManager(options.rpcEndpoints);
		this.qualityTracker = getRPCQualityTracker();
		this.callbacks = options.callbacks || {};
		this.networkName = options.networkName;
		this.networkSymbol = options.networkSymbol;

		// Initialize auto-recovery config
		this.autoRecoveryConfig = {
			...DEFAULT_AUTO_RECOVERY_CONFIG,
			...options.config?.autoRecovery
		};
		this.currentRecoveryDelay = this.autoRecoveryConfig.initialDelay;

		// Initialize parallel config
		this.parallelConfig = {
			...DEFAULT_PARALLEL_SCAN_CONFIG,
			...options.config?.parallel
		};

		// Create parallel executor if multiple RPCs available
		if (options.rpcEndpoints.length > 1 && this.parallelConfig.enabled) {
			this.parallelExecutor = new ParallelRPCExecutor({
				rpcEndpoints: options.rpcEndpoints,
				chainId: options.chainId,
				networkName: options.networkName,
				networkSymbol: options.networkSymbol,
				config: this.parallelConfig,
				onEvent: (event) => this.callbacks.onEvent?.(event)
			});
		}

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
		// Abort any in-flight requests
		if (this.abortController) {
			this.abortController.abort();
			this.abortController = null;
		}
		// Also abort parallel executor if active
		if (this.parallelExecutor) {
			this.parallelExecutor.abort();
		}
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
		this.abortController = new AbortController();
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
			const tokenCount = this.state.tokens.length;
			const addressCount = this.state.addresses.length;
			const totalQueries = this.state.stats.success;
			this.emitEvent(
				'scan_completed',
				`Scan completed! ${tokenCount} tokens × ${addressCount} addresses = ${totalQueries} balance queries`
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

		// Check if we should use parallel mode
		const useParallel =
			this.parallelExecutor &&
			this.parallelExecutor.shouldUseParallel(addresses.length) &&
			this.parallelExecutor.getAvailableCount() > 1;

		if (useParallel) {
			await this.scanTokenParallel(token, addresses);
			return;
		}

		// Process in batches (sequential mode)
		for (let i = 0; i < addresses.length; i += batchSize) {
			if (this.shouldStop) break;

			const batch = addresses.slice(i, i + batchSize);
			const batchNum = Math.floor(i / batchSize) + 1;
			const totalBatches = Math.ceil(addresses.length / batchSize);
			const currentRpcUrl = this.rpcManager.getCurrentRPC();
			const rpcName = this.rpcManager.getCurrentRPCName();
			const addressRange = `${i + 1}-${Math.min(i + batchSize, addresses.length)} of ${addresses.length}`;

			this.emitEvent(
				'batch_started',
				`[${token.symbol || token.id}] Batch ${batchNum}/${totalBatches} (${batch.length} addresses)`,
				{
					tokenId: token.id,
					batch: batchNum,
					total: totalBatches,
					rpcUrl: currentRpcUrl,
					rpcName,
					addressRange
				}
			);

			try {
				// Track response time for quality metrics
				const startTime = Date.now();
				const results = await this.executeBatch(token, batch);
				const responseTime = Date.now() - startTime;

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
				// Record success with response time for RPC quality tracking
				this.qualityTracker.recordSuccess(currentRpcUrl, this.state.chainId, responseTime);
				this.updateStats();
				this.resetRecoveryState(); // Reset recovery counter after successful batch

				this.emitEvent(
					'batch_completed',
					`[${token.symbol || token.id}] Batch ${batchNum}/${totalBatches}: ${successCount} success, ${failCount} failed`,
					{
						successCount,
						failCount,
						rpcUrl: currentRpcUrl,
						rpcName,
						batch: batchNum,
						total: totalBatches,
						addressRange
					}
				);

				// Report progress
				this.callbacks.onProgress?.(this.state.stats, this.state);
				this.callbacks.onStateChange?.(this.state);
			} catch (error) {
				this.consecutiveErrors++;
				const errorMessage = error instanceof Error ? error.message : String(error);

				if (isRateLimitError(error)) {
					this.emitEvent('rate_limited', `Rate limited on batch ${batchNum}. Switching RPC...`, {
						error: errorMessage,
						rpcUrl: currentRpcUrl,
						rpcName,
						batch: batchNum,
						total: totalBatches,
						addressRange,
						tokenId: token.id,
						tokenSymbol: token.symbol
					});

					const hasHealthyRPC = this.rpcManager.markRateLimited();
					// Record rate limit for RPC quality tracking
					this.qualityTracker.recordRateLimit(currentRpcUrl, this.state.chainId);

					if (!hasHealthyRPC) {
						// All RPCs exhausted - attempt auto-recovery if enabled
						const recovered = await this.attemptAutoRecovery();

						if (!recovered) {
							// Auto-recovery failed or disabled, pause the scan
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
					this.emitEvent('batch_failed', `Batch ${batchNum} failed: ${errorMessage}`, {
						error: errorMessage,
						rpcUrl: currentRpcUrl,
						rpcName,
						batch: batchNum,
						total: totalBatches,
						addressRange,
						tokenId: token.id,
						tokenSymbol: token.symbol,
						consecutiveErrors: this.consecutiveErrors
					});

					this.rpcManager.markFailed();
					// Record failure for RPC quality tracking
					this.qualityTracker.recordFailure(currentRpcUrl, this.state.chainId);

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
	 * Scan a token using parallel RPC execution
	 */
	private async scanTokenParallel(token: TokenConfig, addresses: Address[]): Promise<void> {
		if (!this.parallelExecutor) return;

		const availableRPCs = this.parallelExecutor.getAvailableCount();

		this.emitEvent(
			'batch_started',
			`[${token.symbol || token.id}] Parallel scan: ${addresses.length} addresses across ${availableRPCs} RPCs`,
			{
				tokenId: token.id,
				addressCount: addresses.length,
				parallelRPCs: availableRPCs,
				mode: 'parallel'
			}
		);

		// Execute parallel scan
		const { results, rpcResults } = await this.parallelExecutor.executeParallel(token, addresses);

		// Process results
		let successCount = 0;
		let failCount = 0;

		for (const [address, result] of results) {
			const key = getTaskKey(address, token.id);

			if (result.success) {
				this.state.taskStatus.set(key, 'success');
				this.state.balances.set(key, result.balance);
				successCount++;
			} else {
				const currentStatus = this.state.taskStatus.get(key);
				if (currentStatus !== 'success') {
					this.state.taskStatus.set(key, 'failed');
					failCount++;
				}
			}
		}

		// Log RPC-specific results
		const successfulRPCs = rpcResults.filter((r) => r.success);
		const failedRPCs = rpcResults.filter((r) => !r.success);

		if (failedRPCs.length > 0) {
			for (const failed of failedRPCs) {
				this.emitEvent(
					failed.isRateLimited ? 'rate_limited' : 'batch_failed',
					`[${token.symbol || token.id}] RPC ${failed.rpcName} failed: ${failed.error}`,
					{
						rpcUrl: failed.rpcUrl,
						rpcName: failed.rpcName,
						isRateLimited: failed.isRateLimited,
						error: failed.error
					}
				);
			}
		}

		// Check if all RPCs exhausted
		if (this.parallelExecutor.isAllExhausted()) {
			const recovered = await this.attemptAutoRecovery();
			if (!recovered) {
				this.state.isPaused = true;
				this.state.pauseReason = 'rate_limit';
				this.shouldStop = true;
				return;
			}
			// Reset parallel executor after recovery
			this.parallelExecutor.resetAllRPCs();
		}

		this.updateStats();
		this.resetRecoveryState();

		const avgResponseTime =
			successfulRPCs.length > 0
				? Math.round(
						successfulRPCs.reduce((sum, r) => sum + r.responseTime, 0) / successfulRPCs.length
					)
				: 0;

		this.emitEvent(
			'batch_completed',
			`[${token.symbol || token.id}] Parallel scan complete: ${successCount} success, ${failCount} failed (${successfulRPCs.length}/${rpcResults.length} RPCs, avg ${avgResponseTime}ms)`,
			{
				successCount,
				failCount,
				successfulRPCs: successfulRPCs.length,
				totalRPCs: rpcResults.length,
				avgResponseTime,
				mode: 'parallel'
			}
		);

		// Report progress
		this.callbacks.onProgress?.(this.state.stats, this.state);
		this.callbacks.onStateChange?.(this.state);
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

		// Create viem client with abort signal
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
				timeout: 30000,
				fetchOptions: {
					signal: this.abortController?.signal
				}
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
	 * Attempt auto-recovery when all RPCs are exhausted
	 * Returns true if recovery succeeded, false if should pause
	 */
	private async attemptAutoRecovery(): Promise<boolean> {
		const { enabled, maxAttempts, maxDelay, backoffMultiplier } = this.autoRecoveryConfig;

		// If auto-recovery is disabled, return false to trigger pause
		if (!enabled) {
			this.emitEvent('recovery_failed', 'Auto-recovery disabled. Pausing scan.');
			return false;
		}

		// Check if we've exceeded max recovery attempts
		if (this.recoveryAttempts >= maxAttempts) {
			this.emitEvent(
				'recovery_failed',
				`Max recovery attempts (${maxAttempts}) exceeded. Pausing scan.`,
				{ attempts: this.recoveryAttempts, maxAttempts }
			);
			return false;
		}

		this.recoveryAttempts++;

		this.emitEvent(
			'recovery_started',
			`All RPCs exhausted. Starting auto-recovery (attempt ${this.recoveryAttempts}/${maxAttempts})`,
			{ attempt: this.recoveryAttempts, maxAttempts }
		);

		// Calculate wait time with exponential backoff
		const waitTime = Math.min(this.currentRecoveryDelay, maxDelay);
		const waitMinutes = Math.floor(waitTime / 60000);
		const waitSeconds = Math.floor((waitTime % 60000) / 1000);
		const waitDisplay = waitMinutes > 0 ? `${waitMinutes}m ${waitSeconds}s` : `${waitSeconds}s`;

		this.emitEvent('recovery_waiting', `Waiting ${waitDisplay} before retry...`, {
			waitTime,
			attempt: this.recoveryAttempts
		});

		// Notify UI about recovery state
		this.callbacks.onStateChange?.(this.state);

		// Wait for the recovery delay
		await sleep(waitTime);

		// Check if user paused during wait
		if (this.shouldStop) {
			this.emitEvent('recovery_failed', 'Recovery cancelled by user');
			return false;
		}

		// Reset all RPCs to try again
		this.rpcManager.resetAllRPCs();

		// Try to get an available RPC
		const hasAvailableRPC = this.rpcManager.hasHealthyRPC();

		if (hasAvailableRPC) {
			this.emitEvent('recovery_success', `Recovery successful! Resuming scan with available RPC.`, {
				attempt: this.recoveryAttempts
			});

			// Reset consecutive errors since we recovered
			this.consecutiveErrors = 0;

			// Increase delay for next recovery attempt (exponential backoff)
			this.currentRecoveryDelay = Math.min(this.currentRecoveryDelay * backoffMultiplier, maxDelay);

			return true;
		}

		// Still no available RPC after reset, try waiting for one
		this.emitEvent('recovery_attempt', 'Waiting for RPC to become available...');
		const recovered = await this.rpcManager.waitForAvailableRPC();

		if (recovered) {
			this.emitEvent('recovery_success', `Recovery successful! RPC available after wait.`, {
				attempt: this.recoveryAttempts
			});

			// Reset consecutive errors since we recovered
			this.consecutiveErrors = 0;

			// Increase delay for next recovery attempt (exponential backoff)
			this.currentRecoveryDelay = Math.min(this.currentRecoveryDelay * backoffMultiplier, maxDelay);

			return true;
		}

		// Recovery failed, try again if we have attempts left
		return this.attemptAutoRecovery();
	}

	/**
	 * Reset recovery state (call after successful batch)
	 */
	private resetRecoveryState(): void {
		this.recoveryAttempts = 0;
		this.currentRecoveryDelay = this.autoRecoveryConfig.initialDelay;
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
