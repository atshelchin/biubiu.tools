import type { NFTStandard, NFTStandardInfo } from '../types/nft';

/**
 * NFT standards configuration
 */
export const NFT_STANDARDS: Record<NFTStandard, NFTStandardInfo> = {
	erc721: {
		id: 'erc721',
		name: 'ERC-721',
		description: 'Standard NFT - Most widely adopted NFT standard',
		features: [
			'Unique tokens',
			'Full ERC-721 compliance',
			'Compatible with all marketplaces',
			'Battle-tested security'
		],
		gasEfficiency: 'medium',
		useCases: ['Art collections', 'Profile pictures', 'Gaming assets', 'Membership passes']
	},
	erc721a: {
		id: 'erc721a',
		name: 'ERC-721A',
		description: "Gas Optimized NFT - Azuki's efficient implementation",
		features: [
			'Up to 50% gas savings on batch mints',
			'ERC-721 compatible',
			'Optimized storage',
			'Popular for large collections'
		],
		gasEfficiency: 'high',
		useCases: [
			'Large PFP collections',
			'Batch minting projects',
			'Community drops',
			'High-volume collections'
		]
	},
	erc1155: {
		id: 'erc1155',
		name: 'ERC-1155',
		description: 'Multi-Token Standard - NFTs and fungible tokens in one contract',
		features: [
			'Multiple token types',
			'Batch operations',
			'Gas efficient transfers',
			'Flexible design'
		],
		gasEfficiency: 'high',
		useCases: ['Gaming items', 'Multi-edition art', 'Tickets & vouchers', 'Mixed collections']
	}
};

/**
 * Get NFT standard info by ID
 */
export function getNFTStandardInfo(standardId: NFTStandard): NFTStandardInfo {
	return NFT_STANDARDS[standardId];
}

/**
 * Get all available NFT standards
 */
export function getAllNFTStandards(): NFTStandardInfo[] {
	return Object.values(NFT_STANDARDS);
}

/**
 * Validate NFT standard
 */
export function isValidNFTStandard(standard: string): standard is NFTStandard {
	return standard in NFT_STANDARDS;
}
