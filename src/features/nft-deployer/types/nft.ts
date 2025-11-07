import type { Address } from 'viem';

/**
 * Supported NFT standards
 */
export type NFTStandard = 'erc721' | 'erc721a' | 'erc1155';

/**
 * NFT Standard information
 */
export interface NFTStandardInfo {
	id: NFTStandard;
	name: string;
	description: string;
	features: string[];
	gasEfficiency: 'low' | 'medium' | 'high';
	useCases: string[];
	icon?: string;
}

/**
 * NFT basic configuration
 */
export interface NFTBasicConfig {
	name: string;
	symbol: string;
	description: string;
	baseUri?: string; // Base URI for token metadata
}

/**
 * NFT advanced settings
 */
export interface NFTAdvancedSettings {
	maxSupply?: number; // Maximum token supply (0 = unlimited)
	mintPrice?: string; // Price per mint in ETH/native token
	maxMintPerWallet?: number; // Max tokens per wallet (0 = unlimited)

	// Royalties (EIP-2981)
	royaltyEnabled: boolean;
	royaltyRecipient?: Address;
	royaltyPercentage?: number; // 0-100

	// Access control
	ownerMintOnly: boolean; // Only owner can mint
	publicMintEnabled: boolean;
	whitelistEnabled: boolean;

	// Features
	pausable: boolean; // Can pause transfers
	burnable: boolean; // Tokens can be burned
	revealable: boolean; // Support for reveal mechanism

	// ERC1155 specific
	fungible?: boolean; // For ERC1155: whether tokens are fungible
}

/**
 * Complete NFT configuration
 */
export interface NFTConfig {
	standard: NFTStandard;
	chainId: number;
	deployer: Address;
	basic: NFTBasicConfig;
	advanced: NFTAdvancedSettings;
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
	standard: NFTStandardInfo;
	basic: NFTBasicConfig;
	advanced: NFTAdvancedSettings;
	estimatedGasCost: string;
	chainId: number;
}
