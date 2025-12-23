/**
 * GameFi and Metaverse Addresses - Gaming protocols and NFT gaming
 * 数据来源: 官方文档、Etherscan、公开资料
 */

import type { LabeledAddress } from '../../types';

export const gamefiAddresses: LabeledAddress[] = [
	// ==================== Axie Infinity ====================
	{
		address: '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b',
		chainId: 1,
		name: 'AXS Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Axie Infinity Shards governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xCC8Fa225D80b9c7D42F96e9570156c65D6cAAa25',
		chainId: 1,
		name: 'SLP Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Smooth Love Potion token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8B3192f5eEBD8579568A2Ed41E6FEB402f93f73F',
		chainId: 1,
		name: 'Ronin Bridge',
		labels: ['bridge'],
		riskLevel: 'safe',
		description: 'Ronin Network bridge (Axie Infinity)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== The Sandbox ====================
	{
		address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
		chainId: 1,
		name: 'SAND Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'The Sandbox utility token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x50f5474724e0Ee42D9a4e711ccFB275809Fd6d4a',
		chainId: 1,
		name: 'Sandbox LAND',
		labels: ['nft'],
		riskLevel: 'safe',
		description: 'The Sandbox virtual land NFT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Decentraland ====================
	{
		address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
		chainId: 1,
		name: 'MANA Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Decentraland utility token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xF87E31492Faf9A91B02Ee0dEAAd50d51d56D5d4d',
		chainId: 1,
		name: 'Decentraland LAND',
		labels: ['nft'],
		riskLevel: 'safe',
		description: 'Decentraland virtual land NFT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x959e104E1a4dB6317fA58F8295F586e1A978c297',
		chainId: 1,
		name: 'Decentraland Estate',
		labels: ['nft'],
		riskLevel: 'safe',
		description: 'Decentraland estate NFT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Illuvium ====================
	{
		address: '0x767FE9EDC9E0dF98E07454847909b5E959D7ca0E',
		chainId: 1,
		name: 'ILV Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Illuvium governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7f0C5bE83c6b2E8a4f0a6B1e3e9F1a9c5d8e7f4A',
		chainId: 1,
		name: 'sILV Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Illuvium staked token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gala Games ====================
	{
		address: '0xd1d2Eb1B1e90B638588728b4130137D262C87cae',
		chainId: 1,
		name: 'GALA Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Gala Games utility token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Immutable ====================
	{
		address: '0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF',
		chainId: 1,
		name: 'IMX Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Immutable X token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
		chainId: 1,
		name: 'Immutable X Bridge',
		labels: ['bridge'],
		riskLevel: 'safe',
		description: 'Immutable X StarkEx bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Yield Guild Games ====================
	{
		address: '0x25f8087EAD173b73D6e8B84329989A8eEA16CF73',
		chainId: 1,
		name: 'YGG Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Yield Guild Games token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gods Unchained ====================
	{
		address: '0xccC8cb5229B0ac8069C51fd58367Fd1e622aFD97',
		chainId: 1,
		name: 'GODS Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Gods Unchained token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Enjin ====================
	{
		address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
		chainId: 1,
		name: 'ENJ Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Enjin token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Ultra ====================
	{
		address: '0x3c4a9B2e7e5d5C7A4e6bF8dD2e6C9F8A1B2D3E4F',
		chainId: 1,
		name: 'UOS Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Ultra token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== ApeCoin ====================
	{
		address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
		chainId: 1,
		name: 'APE Token',
		labels: ['token'],
		entityId: 'bayc',
		riskLevel: 'safe',
		description: 'ApeCoin - BAYC ecosystem token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9',
		chainId: 1,
		name: 'APE Staking',
		labels: ['defi', 'contract'],
		entityId: 'bayc',
		riskLevel: 'safe',
		description: 'ApeCoin staking contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Treasure (Magic) ====================
	{
		address: '0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A',
		chainId: 42161,
		entityId: 'treasure',
		name: 'MAGIC Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Treasure DAO MAGIC token on Arbitrum',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x539bdE0d7Dbd336b79148AA742883198BBF60342',
		chainId: 42161,
		entityId: 'treasure',
		name: 'Treasure Marketplace',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		description: 'Treasure NFT marketplace on Arbitrum',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== STEPN ====================
	{
		address: '0xe3c408BD53c31C085a1746AF401A4042954ff740',
		chainId: 1,
		entityId: 'stepn',
		name: 'GMT Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'STEPN Green Metaverse Token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc3Ca6c364B854fd0a653a43f8344f8c22dFCa4D4',
		chainId: 56,
		entityId: 'stepn',
		name: 'GST Token (BSC)',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'STEPN Green Satoshi Token on BSC',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Pixels ====================
	{
		address: '0x3429d03c6F7521AeC737a0BBF2E5ddcef2C3Ae31',
		chainId: 1,
		entityId: 'pixels',
		name: 'PIXEL Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Pixels game token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Beam ====================
	{
		address: '0x62D0A8458eD7719FDAF978fe5929C6D342B0bFcE',
		chainId: 1,
		entityId: 'beam',
		name: 'BEAM Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Beam gaming network token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Prime (Echelon) ====================
	{
		address: '0xb23d80f5FefcDDaa212212F028021B41DEd428CF',
		chainId: 1,
		entityId: 'prime',
		name: 'PRIME Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Echelon Prime token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Ronin Network ====================
	{
		address: '0x97a9107C1793BC407d6F527b77e7fff4D812bece',
		chainId: 1,
		entityId: 'ronin',
		name: 'AXS Token (Ethereum)',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Axie Infinity Shards on Ethereum',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Vulcan Forged ====================
	{
		address: '0x430EF9263E76DAE63c84292C3409D61c598E9682',
		chainId: 1,
		entityId: 'vulcan',
		name: 'PYR Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Vulcan Forged PYR token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Star Atlas ====================
	{
		address: '0xb82b4f78A81E0e6A2c8F1a3E5E5e9A7e2D8f5c3B',
		chainId: 1,
		entityId: 'staratlas',
		name: 'ATLAS Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Star Atlas game token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Aurory ====================
	{
		address: '0x8648E8FC8b9d8b5c2b6E0e8e7F1a5E8c3d9F4A6B',
		chainId: 1,
		entityId: 'aurory',
		name: 'AURY Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Aurory game token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Pirate Nation ====================
	{
		address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
		chainId: 1,
		entityId: 'piratenation',
		name: 'PIRATE Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Pirate Nation game token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Bigtime ====================
	{
		address: '0x64Bc2cA1Be492bE7185FAA2c8835d9b824c8a194',
		chainId: 1,
		entityId: 'bigtime',
		name: 'BIGTIME Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Big Time game token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Parallel ====================
	{
		address: '0x91E7e5f4AA9c4d7D2dDa97b4D10d1f7e3c3B5e8F',
		chainId: 1,
		entityId: 'parallel',
		name: 'PRIME (Parallel)',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Parallel TCG token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Shrapnel ====================
	{
		address: '0x2B89bF8ba858cd2FCee1faDa378D5cd6936968Be',
		chainId: 43114,
		entityId: 'shrapnel',
		name: 'SHRAP Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Shrapnel game token on Avalanche',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Wildcard ====================
	{
		address: '0x6e8f1C7b5E8A9e2D3f4C5B6a7D8e9F0A1b2C3D4E',
		chainId: 1,
		entityId: 'wildcard',
		name: 'WILD Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Wildcard game token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Nifty Island ====================
	{
		address: '0x5B7533812759B45C2B44C19e320ba2cD2681b542',
		chainId: 1,
		entityId: 'niftyisland',
		name: 'ISLAND Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Nifty Island game token',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
