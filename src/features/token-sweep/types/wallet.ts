import type { Address } from 'viem';

/**
 * Wallet import method
 */
export type ImportMethod = 'mnemonic' | 'privateKey';

/**
 * Derivation path type for mnemonic
 */
export type DerivationPathType = 'sequential' | 'date';

/**
 * Date format for date-based derivation
 */
export type DateFormat = 'yyyy' | 'yyyymm' | 'yyyym' | 'yyyymmdd' | 'yyyymdd';

/**
 * Imported wallet information
 */
export interface ImportedWallet {
	id: string; // Unique identifier
	address: Address;
	derivationPath?: string; // For mnemonic-derived wallets
	hasBalance?: boolean; // Whether the wallet has any balance
	balances?: {
		native?: string;
		tokens?: Record<string, string>; // tokenAddress -> balance
	};
	[key: string]: unknown; // Allow additional properties
}

/**
 * Mnemonic import configuration
 */
export interface MnemonicImportConfig {
	mnemonic: string;
	pathType: DerivationPathType;
	// For sequential type
	startIndex?: number;
	endIndex?: number;
	// For date type
	startDate?: string;
	endDate?: string;
	dateFormat?: DateFormat;
}

/**
 * Wallet import result
 */
export interface WalletImportResult {
	success: boolean;
	wallets: ImportedWallet[];
	error?: string;
}

/**
 * Asset scan result
 */
export interface AssetScanResult {
	address: Address;
	hasBalance: boolean;
	native?: {
		balance: string;
		symbol: string;
	};
	tokens?: Array<{
		address: Address;
		symbol: string;
		balance: string;
		decimals: number;
	}>;
}
