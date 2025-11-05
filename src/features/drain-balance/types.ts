export interface Network {
	chainId: number;
	name: string;
	rpcUrl: string;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
	blockExplorer?: string;
	isCustom?: boolean; // Mark custom networks
	features?: string[]; // Supported features like 'EIP-7702', 'EIP-1559', etc.
}

export interface Token {
	address: string;
	symbol: string;
	name: string;
	decimals: number;
	isCustom?: boolean; // Mark custom tokens
	isNative?: boolean; // Mark native gas token
}

export interface WalletInfo {
	privateKey: string;
	address: string;
	balances: Record<string, bigint>; // token address -> balance
	isValid: boolean;
}

export interface DrainConfig {
	network: Network;
	tokens: Token[];
	targetAddress: string;
	wallets: WalletInfo[];
}

export interface TransactionResult {
	hash: string;
	status: 'pending' | 'success' | 'failed';
	error?: string;
}

export interface ExecutionResult {
	batchId: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	success: boolean;
	timestamp: number;
	transactionHash?: string;
	error?: string;
	gasUsed?: bigint;
	totalValue?: bigint;
	walletCount?: number;
	wallets?: WalletInfo[];
	addresses?: string[];
	privateKeys?: string[];
	batchData?: {
		privateKeys: string[];
		targetAddress: string;
		tokens: Token[];
		network: Network;
	};
}
