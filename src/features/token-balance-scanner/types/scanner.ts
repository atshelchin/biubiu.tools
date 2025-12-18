import type { Address } from 'viem';
import type { NativeToken, ERC20Token } from '$lib/types/token';
import type {
	ScanState,
	ScanStats,
	ScanEvent,
	AddressBalance as BaseAddressBalance
} from '$lib/services/balance-scanner/types';

// Re-export types from balance-scanner service
export type { ScanState, ScanStats, ScanEvent };

/**
 * Extended address balance with label support
 */
export interface AddressBalance extends BaseAddressBalance {
	label?: string;
}

/**
 * Wallet balance information (legacy - for backward compatibility)
 */
export interface WalletBalance {
	address: Address;
	label?: string;
	balances: TokenBalance[];
	totalValueUsd?: number;
}

/**
 * Token balance for a specific wallet
 */
export interface TokenBalance {
	token: NativeToken | ERC20Token;
	balance: string; // Raw balance
	formattedBalance: string; // Human readable balance
	valueUsd?: number;
}

/**
 * Scan configuration
 */
export interface ScanConfig {
	wallets: Address[];
	tokens: (NativeToken | ERC20Token)[];
	chainId: number;
}

/**
 * Scan result summary
 */
export interface ScanSummary {
	totalWallets: number;
	walletsWithBalance: number;
	totalTokens: number;
	tokenTotals: TokenTotal[];
	scanDuration: number; // milliseconds
	successCount: number;
	failureCount: number;
}

/**
 * Token total across all wallets
 */
export interface TokenTotal {
	tokenId: string;
	symbol: string;
	name: string;
	decimals: number;
	totalBalance: bigint;
	formattedTotal: string;
	walletsWithBalance: number;
}

/**
 * Scan status
 */
export type ScanStatus = 'idle' | 'scanning' | 'paused' | 'completed' | 'error';

/**
 * Scan progress (extended from balance-scanner)
 */
export interface ScanProgress {
	current: number;
	total: number;
	percentage: number;
	currentWallet?: Address;
	currentToken?: string;
	// Additional fields from balance-scanner
	success?: number;
	failed?: number;
	pending?: number;
}

/**
 * Export format
 */
export type ExportFormat = 'csv' | 'json' | 'excel';

/**
 * Wallet import method
 */
export type WalletImportMethod = 'manual' | 'paste' | 'file';

/**
 * Balance filter options
 */
export interface BalanceFilter {
	/** Filter by balance status */
	balanceStatus: 'all' | 'has_balance' | 'no_balance';
	/** Filter by specific token (tokenId or 'all') */
	tokenId: string;
	/** Minimum balance for selected token (optional) */
	minBalance?: string;
	/** Maximum balance for selected token (optional) */
	maxBalance?: string;
}

/**
 * Default filter
 */
export const DEFAULT_BALANCE_FILTER: BalanceFilter = {
	balanceStatus: 'all',
	tokenId: 'all'
};

/**
 * Pagination state
 */
export interface PaginationState {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * Sort state for table columns
 */
export interface SortState {
	columnId: string | null;
	direction: SortDirection;
}

/**
 * Default pagination
 */
export const DEFAULT_PAGINATION: PaginationState = {
	page: 1,
	pageSize: 50,
	totalItems: 0,
	totalPages: 0
};

/**
 * Resumable session info (for recovery prompt)
 */
export interface ResumableSession {
	sessionId: string;
	chainId: number;
	addressCount: number;
	tokenCount: number;
	progress: number;
	startedAt: number;
	lastActivityAt: number;
	isPaused: boolean;
	pauseReason?: string;
}
