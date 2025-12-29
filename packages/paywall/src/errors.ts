/**
 * Paywall Error Classes
 *
 * Provides fine-grained error types for better error handling and debugging.
 * Each error type has a specific code that can be used for i18n and analytics.
 */

/**
 * Error codes for paywall operations
 */
export type PaywallErrorCode =
	// Network errors
	| 'NETWORK_ERROR' // General network failure
	| 'RPC_ERROR' // RPC endpoint failure
	| 'RPC_TIMEOUT' // RPC request timeout
	| 'RPC_RATE_LIMITED' // RPC rate limit exceeded
	// Contract errors
	| 'CONTRACT_ERROR' // General contract error
	| 'CONTRACT_NOT_FOUND' // Contract not deployed on chain
	| 'CONTRACT_CALL_FAILED' // Contract call reverted
	// Cache errors
	| 'CACHE_READ_ERROR' // Failed to read from IndexedDB
	| 'CACHE_WRITE_ERROR' // Failed to write to IndexedDB
	| 'CACHE_INTEGRITY_ERROR' // Checksum verification failed
	| 'CACHE_EXPIRED' // Cached data has expired
	// Wallet errors
	| 'WALLET_NOT_CONNECTED' // No wallet connected
	| 'WALLET_REJECTED' // User rejected transaction
	| 'INSUFFICIENT_FUNDS' // Not enough balance
	// Verification errors
	| 'VERIFICATION_FAILED' // Background verification failed
	| 'VERIFICATION_MISMATCH'; // Cache doesn't match on-chain

/**
 * Base class for all paywall errors
 */
export class PaywallError extends Error {
	readonly code: PaywallErrorCode;
	readonly isRetryable: boolean;
	readonly originalError?: Error;

	constructor(
		code: PaywallErrorCode,
		message: string,
		options?: {
			isRetryable?: boolean;
			cause?: Error;
		}
	) {
		super(message);
		this.name = 'PaywallError';
		this.code = code;
		this.isRetryable = options?.isRetryable ?? false;
		this.originalError = options?.cause;

		// Maintain proper stack trace in V8 environments
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, PaywallError);
		}
	}

	/**
	 * Get i18n key for this error
	 */
	get i18nKey(): string {
		return `paywall.errors.${this.code.toLowerCase()}`;
	}
}

/**
 * Network-related errors (retryable)
 */
export class NetworkError extends PaywallError {
	constructor(message: string, cause?: Error) {
		super('NETWORK_ERROR', message, { isRetryable: true, cause });
		this.name = 'NetworkError';
	}
}

/**
 * RPC-specific errors
 */
export class RpcError extends PaywallError {
	readonly rpcUrl?: string;
	readonly statusCode?: number;

	constructor(
		code: 'RPC_ERROR' | 'RPC_TIMEOUT' | 'RPC_RATE_LIMITED',
		message: string,
		options?: {
			rpcUrl?: string;
			statusCode?: number;
			cause?: Error;
		}
	) {
		super(code, message, {
			isRetryable: code !== 'RPC_RATE_LIMITED',
			cause: options?.cause
		});
		this.name = 'RpcError';
		this.rpcUrl = options?.rpcUrl;
		this.statusCode = options?.statusCode;
	}
}

/**
 * Contract interaction errors
 */
export class ContractError extends PaywallError {
	readonly contractAddress?: string;
	readonly functionName?: string;

	constructor(
		code: 'CONTRACT_ERROR' | 'CONTRACT_NOT_FOUND' | 'CONTRACT_CALL_FAILED',
		message: string,
		options?: {
			contractAddress?: string;
			functionName?: string;
			cause?: Error;
		}
	) {
		super(code, message, { isRetryable: false, cause: options?.cause });
		this.name = 'ContractError';
		this.contractAddress = options?.contractAddress;
		this.functionName = options?.functionName;
	}
}

/**
 * Cache-related errors
 */
export class CacheError extends PaywallError {
	readonly cacheKey?: string;

	constructor(
		code: 'CACHE_READ_ERROR' | 'CACHE_WRITE_ERROR' | 'CACHE_INTEGRITY_ERROR' | 'CACHE_EXPIRED',
		message: string,
		options?: {
			cacheKey?: string;
			cause?: Error;
		}
	) {
		super(code, message, {
			isRetryable: code === 'CACHE_READ_ERROR' || code === 'CACHE_WRITE_ERROR',
			cause: options?.cause
		});
		this.name = 'CacheError';
		this.cacheKey = options?.cacheKey;
	}
}

/**
 * Wallet-related errors (not retryable)
 */
export class WalletError extends PaywallError {
	constructor(
		code: 'WALLET_NOT_CONNECTED' | 'WALLET_REJECTED' | 'INSUFFICIENT_FUNDS',
		message: string,
		cause?: Error
	) {
		super(code, message, { isRetryable: false, cause });
		this.name = 'WalletError';
	}
}

/**
 * Verification errors
 */
export class VerificationError extends PaywallError {
	readonly onChainStatus?: {
		isMember: boolean;
		expiresAt: number;
	};
	readonly cachedStatus?: {
		isMember: boolean;
		expiresAt: number;
	};

	constructor(
		code: 'VERIFICATION_FAILED' | 'VERIFICATION_MISMATCH',
		message: string,
		options?: {
			onChainStatus?: { isMember: boolean; expiresAt: number };
			cachedStatus?: { isMember: boolean; expiresAt: number };
			cause?: Error;
		}
	) {
		super(code, message, { isRetryable: code === 'VERIFICATION_FAILED', cause: options?.cause });
		this.name = 'VerificationError';
		this.onChainStatus = options?.onChainStatus;
		this.cachedStatus = options?.cachedStatus;
	}
}

/**
 * Type guard to check if an error is a PaywallError
 */
export function isPaywallError(error: unknown): error is PaywallError {
	return error instanceof PaywallError;
}

/**
 * Type guard to check if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
	if (isPaywallError(error)) {
		return error.isRetryable;
	}
	// Network errors are generally retryable
	if (error instanceof TypeError && error.message.includes('fetch')) {
		return true;
	}
	return false;
}

/**
 * Convert unknown error to PaywallError
 */
export function toPaywallError(error: unknown): PaywallError {
	if (isPaywallError(error)) {
		return error;
	}

	if (error instanceof Error) {
		// Detect common error patterns
		const message = error.message.toLowerCase();

		if (message.includes('fetch') || message.includes('network')) {
			return new NetworkError(error.message, error);
		}

		if (message.includes('rpc') || message.includes('json-rpc')) {
			return new RpcError('RPC_ERROR', error.message, { cause: error });
		}

		if (message.includes('contract') || message.includes('revert')) {
			return new ContractError('CONTRACT_ERROR', error.message, { cause: error });
		}

		if (message.includes('indexeddb') || message.includes('idb')) {
			return new CacheError('CACHE_READ_ERROR', error.message, { cause: error });
		}

		if (message.includes('user rejected') || message.includes('denied')) {
			return new WalletError('WALLET_REJECTED', error.message, error);
		}

		return new PaywallError('NETWORK_ERROR', error.message, { cause: error });
	}

	return new PaywallError('NETWORK_ERROR', String(error));
}
