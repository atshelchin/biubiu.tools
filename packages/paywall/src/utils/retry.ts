/**
 * Retry Utility with Exponential Backoff
 *
 * Provides robust retry logic for RPC and network calls.
 * Uses exponential backoff with jitter to avoid thundering herd.
 */

import { getConfig } from '../config';
import { isRetryableError, RpcError, NetworkError } from '../errors';

/**
 * Options for retry behavior
 */
export interface RetryOptions {
	/** Maximum number of retry attempts */
	maxAttempts?: number;
	/** Base delay in ms */
	baseDelay?: number;
	/** Maximum delay in ms */
	maxDelay?: number;
	/** Called before each retry with attempt number and error */
	onRetry?: (attempt: number, error: Error, delay: number) => void;
	/** Custom function to determine if error is retryable */
	isRetryable?: (error: unknown) => boolean;
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt: number, baseDelay: number, maxDelay: number): number {
	// Exponential backoff: baseDelay * 2^attempt
	const exponentialDelay = baseDelay * Math.pow(2, attempt);
	// Add jitter (±25% randomization)
	const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
	// Clamp to maxDelay
	return Math.min(exponentialDelay + jitter, maxDelay);
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute a function with automatic retry on failure
 *
 * @example
 * ```ts
 * const result = await withRetry(
 *   () => fetchFromRpc(url),
 *   {
 *     maxAttempts: 3,
 *     onRetry: (attempt, error) => console.log(`Retry ${attempt}:`, error.message)
 *   }
 * );
 * ```
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
	const config = getConfig();
	const {
		maxAttempts = config.timing.maxRetryAttempts,
		baseDelay = config.timing.retryBaseDelayMs,
		maxDelay = config.timing.retryMaxDelayMs,
		onRetry,
		isRetryable: customIsRetryable
	} = options;

	let lastError: Error | undefined;

	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		try {
			return await fn();
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));

			// Check if we should retry
			const shouldRetry = customIsRetryable ? customIsRetryable(error) : isRetryableError(error);

			// Don't retry if not retryable or last attempt
			if (!shouldRetry || attempt >= maxAttempts - 1) {
				throw lastError;
			}

			// Calculate delay with exponential backoff
			const delay = calculateDelay(attempt, baseDelay, maxDelay);

			// Call retry callback if provided
			if (onRetry) {
				onRetry(attempt + 1, lastError, delay);
			}

			// Wait before retrying
			await sleep(delay);
		}
	}

	// Should never reach here, but TypeScript needs this
	throw lastError ?? new Error('Retry failed');
}

/**
 * Create a retryable RPC call wrapper
 *
 * @example
 * ```ts
 * const readContract = createRetryableRpc(
 *   () => client.readContract({ ... }),
 *   { rpcUrl: 'https://...' }
 * );
 * const result = await readContract();
 * ```
 */
export function createRetryableRpc<T>(
	fn: () => Promise<T>,
	context?: { rpcUrl?: string }
): () => Promise<T> {
	const config = getConfig();
	return () =>
		withRetry(fn, {
			maxAttempts: config.timing.maxRetryAttempts,
			onRetry: (attempt, error, delay) => {
				console.warn(
					`[RPC] Retry attempt ${attempt} after ${delay}ms:`,
					error.message,
					context?.rpcUrl ? `(${context.rpcUrl})` : ''
				);
			},
			isRetryable: (error) => {
				// RPC-specific retry logic
				if (error instanceof Error) {
					const message = error.message.toLowerCase();
					// Don't retry on explicit rejections or invalid data
					if (
						message.includes('user rejected') ||
						message.includes('invalid') ||
						message.includes('revert')
					) {
						return false;
					}
					// Retry on network/timeout errors
					if (
						message.includes('timeout') ||
						message.includes('network') ||
						message.includes('fetch') ||
						message.includes('connection')
					) {
						return true;
					}
				}
				return isRetryableError(error);
			}
		}).catch((error) => {
			// Wrap in RpcError for better error handling
			if (!(error instanceof RpcError) && !(error instanceof NetworkError)) {
				throw new RpcError('RPC_ERROR', error.message, {
					rpcUrl: context?.rpcUrl,
					cause: error
				});
			}
			throw error;
		});
}

/**
 * Execute multiple RPC calls with retry, failing fast on non-retryable errors
 */
export async function withRetryAll<T>(
	fns: Array<() => Promise<T>>,
	options: RetryOptions = {}
): Promise<T[]> {
	return Promise.all(fns.map((fn) => withRetry(fn, options)));
}
