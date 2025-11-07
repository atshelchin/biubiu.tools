/**
 * Wallet Generator Types
 */

// Input source type for wallet generation
export type InputSourceType = 'mnemonic' | 'xpub' | 'secret';

// Blockchain type
export type BlockchainType = 'ethereum' | 'bitcoin';

// HD path configuration preset
export interface HDPathConfig {
	name: string;
	path: string;
	description: string;
	blockchain: BlockchainType;
}

// Common HD path presets
export const HD_PATH_PRESETS: Record<BlockchainType, HDPathConfig[]> = {
	ethereum: [
		{
			name: 'Ethereum (Default)',
			path: "m/44'/60'/0'/0",
			description: 'Standard Ethereum derivation path (BIP44)',
			blockchain: 'ethereum'
		},
		{
			name: 'Ethereum (Ledger)',
			path: "m/44'/60'/0'",
			description: 'Ledger hardware wallet path',
			blockchain: 'ethereum'
		},
		{
			name: 'Ethereum (Legacy)',
			path: "m/44'/60'/0'/0/0",
			description: 'Legacy Ethereum path',
			blockchain: 'ethereum'
		}
	],
	bitcoin: [
		{
			name: 'Bitcoin (Default)',
			path: "m/44'/0'/0'/0",
			description: 'Standard Bitcoin derivation path (BIP44)',
			blockchain: 'bitcoin'
		},
		{
			name: 'Bitcoin (SegWit)',
			path: "m/49'/0'/0'/0",
			description: 'SegWit P2SH derivation path (BIP49)',
			blockchain: 'bitcoin'
		},
		{
			name: 'Bitcoin (Native SegWit)',
			path: "m/84'/0'/0'/0",
			description: 'Native SegWit Bech32 path (BIP84)',
			blockchain: 'bitcoin'
		}
	]
};

// Input source configuration
export interface InputSourceConfig {
	type: InputSourceType;
	value: string;
	isValid: boolean;
}

// Wallet generator configuration
export interface WalletGeneratorConfig {
	inputSource: InputSourceConfig;
	blockchain: BlockchainType;
	hdPath: string;
	count: number;
	startIndex: number;
	useWorker: boolean;
}

// Generated wallet data
export interface GeneratedWallet {
	index: number;
	address: string;
	privateKey: string;
	path: string;
	publicKey?: string;
}

// Generation progress
export interface GenerationProgress {
	current: number;
	total: number;
	percentage: number;
	isGenerating: boolean;
}

// Export format type
export type ExportFormat = 'csv' | 'json';

// Export data structure
export interface ExportData {
	generatedAt: string;
	blockchain: BlockchainType;
	hdPath: string;
	wallets: GeneratedWallet[];
}
