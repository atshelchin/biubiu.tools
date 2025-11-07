import type { Address } from 'viem';

/**
 * Token basic configuration
 */
export interface TokenBasicConfig {
	name: string;
	symbol: string;
	decimals: number;
	initialSupply: string;
}

/**
 * Token advanced parameters
 */
export interface TokenAdvancedParams {
	// Supply management
	maxSupply?: string; // Max supply (empty = unlimited)
	mintable: boolean; // Can mint new tokens
	burnable: boolean; // Can burn tokens

	// Access control
	pausable: boolean; // Can pause transfers
	blacklistable: boolean; // Can blacklist addresses

	// Tax/Fee
	taxEnabled: boolean;
	buyTax?: number; // 0-100%
	sellTax?: number; // 0-100%
	taxReceiver?: Address;

	// Anti-bot
	maxTransactionAmount?: string; // Max tokens per transaction
	maxWalletAmount?: string; // Max tokens per wallet
	tradingDelay?: number; // Seconds between trades
}

/**
 * Complete token configuration
 */
export interface TokenConfig {
	chainId: number;
	deployer: Address;
	basic: TokenBasicConfig;
	advanced: TokenAdvancedParams;
}

/**
 * Deployment status
 */
export type DeploymentStatus = 'idle' | 'preparing' | 'deploying' | 'completed' | 'error';

/**
 * Deployment result
 */
export interface DeploymentResult {
	success: boolean;
	contractAddress?: Address;
	transactionHash?: string;
	deploymentCost?: string;
	gasUsed?: bigint;
	error?: string;
	timestamp?: number;
}

/**
 * Deployment summary for preview
 */
export interface DeploymentSummary {
	basic: TokenBasicConfig;
	advanced: TokenAdvancedParams;
	estimatedGasCost: string;
	chainId: number;
	networkName: string;
}
