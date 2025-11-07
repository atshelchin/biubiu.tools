import type { Address } from 'viem';
import type { NativeToken, ERC20Token } from '$lib/types/token';

/**
 * Wallet balance information
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
	totalTokens: number;
	totalValueUsd: number;
	scanDuration: number; // milliseconds
	successCount: number;
	failureCount: number;
}

/**
 * Scan status
 */
export type ScanStatus = 'idle' | 'scanning' | 'completed' | 'error';

/**
 * Scan progress
 */
export interface ScanProgress {
	current: number;
	total: number;
	percentage: number;
	currentWallet?: Address;
	currentToken?: string;
}

/**
 * Export format
 */
export type ExportFormat = 'csv' | 'json' | 'excel';

/**
 * Wallet import method
 */
export type WalletImportMethod = 'manual' | 'paste' | 'file';
