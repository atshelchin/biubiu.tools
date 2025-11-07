import type { NFTConfig } from '../types/nft';

/**
 * Build complete NFT configuration from all steps
 */
export function buildNFTConfig(
	deployer: `0x${string}`,
	chainId: number,
	standard: 'erc721' | 'erc721a' | 'erc1155',
	basic: {
		name: string;
		symbol: string;
		description: string;
		baseUri?: string;
	},
	advanced: {
		maxSupply?: number;
		mintPrice?: string;
		maxMintPerWallet?: number;
		royaltyEnabled: boolean;
		royaltyRecipient?: `0x${string}`;
		royaltyPercentage?: number;
		ownerMintOnly: boolean;
		publicMintEnabled: boolean;
		whitelistEnabled: boolean;
		pausable: boolean;
		burnable: boolean;
		revealable: boolean;
		fungible?: boolean;
	}
): NFTConfig {
	return {
		standard,
		chainId,
		deployer,
		basic,
		advanced
	};
}

/**
 * Validate NFT configuration before deployment
 */
export function validateNFTConfig(config: NFTConfig): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	// Validate basic info
	if (!config.basic.name || config.basic.name.trim().length === 0) {
		errors.push('Collection name is required');
	}

	if (!config.basic.symbol || config.basic.symbol.trim().length === 0) {
		errors.push('Symbol is required');
	}

	if (!config.basic.description || config.basic.description.trim().length === 0) {
		errors.push('Description is required');
	}

	// Validate advanced settings
	if (config.advanced.maxSupply && config.advanced.maxSupply < 0) {
		errors.push('Max supply cannot be negative');
	}

	if (config.advanced.mintPrice) {
		const price = parseFloat(config.advanced.mintPrice);
		if (isNaN(price) || price < 0) {
			errors.push('Mint price must be a valid positive number');
		}
	}

	if (config.advanced.maxMintPerWallet && config.advanced.maxMintPerWallet < 0) {
		errors.push('Max mint per wallet cannot be negative');
	}

	// Validate royalty settings
	if (config.advanced.royaltyEnabled) {
		if (!config.advanced.royaltyRecipient) {
			errors.push('Royalty recipient address is required when royalties are enabled');
		} else if (!/^0x[a-fA-F0-9]{40}$/.test(config.advanced.royaltyRecipient)) {
			errors.push('Invalid royalty recipient address');
		}

		if (
			config.advanced.royaltyPercentage !== undefined &&
			(config.advanced.royaltyPercentage < 0 || config.advanced.royaltyPercentage > 100)
		) {
			errors.push('Royalty percentage must be between 0 and 100');
		}
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}

/**
 * Generate deployment summary
 */
export function generateDeploymentSummary(config: NFTConfig) {
	const features: string[] = [];

	if (config.advanced.maxSupply) {
		features.push(`Max Supply: ${config.advanced.maxSupply.toLocaleString()}`);
	}

	if (config.advanced.mintPrice && parseFloat(config.advanced.mintPrice) > 0) {
		features.push(`Mint Price: ${config.advanced.mintPrice} ETH`);
	}

	if (config.advanced.royaltyEnabled && config.advanced.royaltyPercentage) {
		features.push(`Royalty: ${config.advanced.royaltyPercentage}%`);
	}

	if (config.advanced.pausable) {
		features.push('Pausable');
	}

	if (config.advanced.burnable) {
		features.push('Burnable');
	}

	if (config.advanced.revealable) {
		features.push('Revealable');
	}

	if (config.advanced.ownerMintOnly) {
		features.push('Owner Mint Only');
	}

	if (config.advanced.whitelistEnabled) {
		features.push('Whitelist Enabled');
	}

	return {
		standard: config.standard.toUpperCase(),
		name: config.basic.name,
		symbol: config.basic.symbol,
		features,
		chainId: config.chainId
	};
}

/**
 * Estimate transaction cost
 */
export function estimateTxCost(
	gasLimit: bigint,
	gasPrice: bigint
): {
	wei: bigint;
	gwei: string;
	eth: string;
} {
	const wei = gasLimit * gasPrice;
	const gwei = (Number(wei) / 1e9).toFixed(2);
	const eth = (Number(wei) / 1e18).toFixed(6);

	return { wei, gwei, eth };
}
