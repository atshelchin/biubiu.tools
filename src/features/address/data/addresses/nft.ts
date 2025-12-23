/**
 * NFT collection and marketplace addresses
 * 数据来源：OpenSea, 官方文档
 */

import type { LabeledAddress } from '../../types';

export const nftAddresses: LabeledAddress[] = [
	// ==================== NFT Marketplaces ====================
	{
		address: '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC',
		chainId: 1,
		entityId: 'opensea',
		name: 'OpenSea Seaport 1.5',
		labels: ['nft-marketplace', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x00000000000001ad428e4906aE43D8F9852d0dD6',
		chainId: 1,
		entityId: 'opensea',
		name: 'OpenSea Seaport 1.6',
		labels: ['nft-marketplace', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7f268357A8c2552623316e2562D90e642bB538E5',
		chainId: 1,
		entityId: 'opensea',
		name: 'OpenSea Wyvern Exchange',
		labels: ['nft-marketplace', 'contract'],
		riskLevel: 'safe',
		description: 'Legacy OpenSea exchange contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x29469395eAf6f95920E59F858042f0e28D98a20B',
		chainId: 1,
		entityId: 'blur',
		name: 'Blur Marketplace',
		labels: ['nft-marketplace', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x000000000000Ad05Ccc4F10045630fb830B95127',
		chainId: 1,
		entityId: 'blur',
		name: 'Blur Blend',
		labels: ['nft-marketplace', 'lending', 'contract'],
		riskLevel: 'safe',
		description: 'Blur NFT lending protocol',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x59728544B08AB483533076417FbBB2fD0B17CE3a',
		chainId: 1,
		entityId: 'looksrare',
		name: 'LooksRare Exchange',
		labels: ['nft-marketplace', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x74312363e45DCaBA76c59ec49a7Aa8A65a67EeD3',
		chainId: 1,
		entityId: 'unknown',
		name: 'X2Y2 Exchange',
		labels: ['nft-marketplace', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Blue Chip NFT Collections ====================
	{
		address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
		chainId: 1,
		entityId: 'bayc',
		name: 'Bored Ape Yacht Club',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x60E4d786628Fea6478F785A6d7e704777c86a7c6',
		chainId: 1,
		entityId: 'bayc',
		name: 'Mutant Ape Yacht Club',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xba30E5F9Bb24caa003E9f2f0497Ad287FDF95623',
		chainId: 1,
		entityId: 'bayc',
		name: 'Bored Ape Kennel Club',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
		chainId: 1,
		entityId: 'cryptopunks',
		name: 'CryptoPunks',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		description: 'One of the first NFT collections on Ethereum',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
		chainId: 1,
		entityId: 'azuki',
		name: 'Azuki',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949',
		chainId: 1,
		entityId: 'azuki',
		name: 'Beanz',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8',
		chainId: 1,
		entityId: 'pudgypenguins',
		name: 'Pudgy Penguins',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x524cAB2ec69124574082676e6F654a18df49A048',
		chainId: 1,
		entityId: 'pudgypenguins',
		name: 'Lil Pudgys',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
		chainId: 1,
		entityId: 'doodles',
		name: 'Doodles',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B',
		chainId: 1,
		entityId: 'unknown',
		name: 'CloneX',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258',
		chainId: 1,
		entityId: 'unknown',
		name: 'Otherdeed for Otherside',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
		chainId: 1,
		entityId: 'unknown',
		name: 'Moonbirds',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x059EDD72Cd353dF5106D2B9cC5ab83a52287aC3a',
		chainId: 1,
		entityId: 'unknown',
		name: 'Art Blocks',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270',
		chainId: 1,
		entityId: 'unknown',
		name: 'Art Blocks Factory',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7Bd29408f11D2bFC23c34f18275bBf23bB716Bc7',
		chainId: 1,
		entityId: 'unknown',
		name: 'Meebits',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5Af0D9827E0c53E4799BB226655A1de152A425a5',
		chainId: 1,
		entityId: 'unknown',
		name: 'Milady Maker',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xb6a37b5d14D502c3Ab17f0e35ec68fE9e5fc9D86',
		chainId: 1,
		entityId: 'unknown',
		name: 'Captainz',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xD3D9ddd0CF0A5F0BFB8f7fcEAe075DF687eAEBaB',
		chainId: 1,
		entityId: 'unknown',
		name: 'Remilio Babies',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gaming & Metaverse NFTs ====================

	{
		address: '0x5CC5B05a8A13E3fBDB0BB9FcCd98D38e50F90c38',
		chainId: 1,
		entityId: 'unknown',
		name: 'The Sandbox LAND',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== ENS Domains ====================
	// Note: ENS Base Registrar is in infrastructure.ts
	{
		address: '0x114D4603199df73e7D157787f8778E21fCd13066',
		chainId: 1,
		entityId: 'ens',
		name: 'ENS Name Wrapper',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
