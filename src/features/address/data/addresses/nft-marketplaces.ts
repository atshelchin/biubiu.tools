/**
 * NFT marketplace and infrastructure addresses
 * 数据来源: Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const nftMarketplaceAddresses: LabeledAddress[] = [
	// ==================== OpenSea ====================
	{
		address: '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC',
		chainId: 1,
		entityId: 'opensea',
		name: 'OpenSea Seaport 1.5',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x00000000000001ad428e4906aE43D8F9852d0dD6',
		chainId: 1,
		entityId: 'opensea',
		name: 'OpenSea Seaport 1.6',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x00000000006c3852cbEf3e08E8dF289169EdE581',
		chainId: 1,
		entityId: 'opensea',
		name: 'OpenSea Seaport 1.1',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC',
		chainId: 137,
		entityId: 'opensea',
		name: 'OpenSea Seaport on Polygon',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC',
		chainId: 42161,
		entityId: 'opensea',
		name: 'OpenSea Seaport on Arbitrum',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC',
		chainId: 10,
		entityId: 'opensea',
		name: 'OpenSea Seaport on Optimism',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC',
		chainId: 8453,
		entityId: 'opensea',
		name: 'OpenSea Seaport on Base',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Blur ====================
	{
		address: '0x5Af0D9827E0c53E4799BB226655A1de152A425a5',
		chainId: 1,
		entityId: 'blur',
		name: 'Blur Marketplace',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xB772d5C5F4A2Eef67dfbc89AA658D2711341b8E5',
		chainId: 1,
		entityId: 'blur',
		name: 'Blur Token (BLUR)',
		labels: ['token', 'nft'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x29469395eAf6f95920E59F858042f0e28D98a20B',
		chainId: 1,
		entityId: 'blur',
		name: 'Blur Blend (NFT Lending)',
		labels: ['nft', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== LooksRare ====================
	{
		address: '0x0000000000E655fAe4d56241588680F86E3b2377',
		chainId: 1,
		entityId: 'looksrare',
		name: 'LooksRare V2 Exchange',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xf4d2888d29D722226FafA5d9B24F9164c092421E',
		chainId: 1,
		entityId: 'looksrare',
		name: 'LOOKS Token',
		labels: ['token', 'nft'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== X2Y2 ====================
	{
		address: '0x74312363e45DCaBA76c59ec49a7Aa8A65a67EeD3',
		chainId: 1,
		entityId: 'x2y2',
		name: 'X2Y2 Exchange',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1E4EDE388cbc9F4b5c79681B7f94d36a11ABEBC9',
		chainId: 1,
		entityId: 'x2y2',
		name: 'X2Y2 Token',
		labels: ['token', 'nft'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Rarible ====================
	{
		address: '0x9757F2d2b135150BBeb65308D4a91804107cd8D6',
		chainId: 1,
		entityId: 'rarible',
		name: 'Rarible Exchange V2',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xFca59Cd816aB1eaD66534D82bc21E7515cE441CF',
		chainId: 1,
		entityId: 'rarible',
		name: 'RARI Token',
		labels: ['token', 'nft'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Foundation ====================
	{
		address: '0xcF0949a9Dbb6e0A4f1aDF0D23f38c7a3F2e5e75e',
		chainId: 1,
		entityId: 'foundation',
		name: 'Foundation NFT Market',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== SuperRare ====================
	{
		address: '0xb932a70A57673d89f4acfFBE830E8ed7f75Fb9e0',
		chainId: 1,
		entityId: 'superrare',
		name: 'SuperRare Bazaar',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xba5BDe662c17e2aDFF1075610382B9B691296350',
		chainId: 1,
		entityId: 'superrare',
		name: 'RARE Token',
		labels: ['token', 'nft'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Sudoswap ====================
	{
		address: '0xB16c1342E617A5B6E4b631EB114483FDB289c0A4',
		chainId: 1,
		entityId: 'sudoswap',
		name: 'Sudoswap Factory',
		labels: ['nft', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3446Dd70B2D52A6Bf4a5a192D9b0A161295aB7F9',
		chainId: 1,
		entityId: 'sudoswap',
		name: 'SUDO Token',
		labels: ['token', 'nft'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Zora ====================
	{
		address: '0x76c5855e93bd498b6331652854C4E3a8f8f8f0e7',
		chainId: 1,
		entityId: 'zora',
		name: 'Zora Marketplace',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1111772d6f3C2fe5035A9e15a0C4fEBd4c1cBf45',
		chainId: 1,
		entityId: 'zora',
		name: 'Zora Creator',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Reservoir ====================
	{
		address: '0x178A86D36D89c7FDeBeA90b739605da7B131ff6A',
		chainId: 1,
		entityId: 'reservoir',
		name: 'Reservoir Router',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Element ====================
	{
		address: '0x20F780A973856B93f63670377900C1d2a50a77c4',
		chainId: 1,
		entityId: 'element',
		name: 'Element NFT Exchange',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Manifold ====================
	{
		address: '0x3a3548e060Be10c2614d0a4Cb0c03CC9093fD799',
		chainId: 1,
		entityId: 'manifold',
		name: 'Manifold Creator Core',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Magic Eden ====================
	{
		address: '0xA7b8597f0554150F94F1891C545A81f89E6E15BC',
		chainId: 1,
		entityId: 'magiceden',
		name: 'Magic Eden Ethereum',
		labels: ['nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== NFTfi ====================
	{
		address: '0x8252Df1d8b29057d1Afe3062bf5a64D503152BC8',
		chainId: 1,
		entityId: 'nftfi',
		name: 'NFTfi Lending V2',
		labels: ['nft', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Arcade ====================
	{
		address: '0x81b2F8Fc75Bab64A6b144aa6d2fAa127B4Fa7fD9',
		chainId: 1,
		entityId: 'arcade',
		name: 'Arcade NFT Lending',
		labels: ['nft', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== BendDAO ====================
	{
		address: '0x0d02755a5700414B26FF040e1dE35D337DF56218',
		chainId: 1,
		entityId: 'benddao',
		name: 'BendDAO Lending Pool',
		labels: ['nft', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0d415b8A29F12eaa2B15D6CE35A0f7e62a7e11e2',
		chainId: 1,
		entityId: 'benddao',
		name: 'BEND Token',
		labels: ['token', 'nft'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== JPEG'd ====================
	{
		address: '0xE80C0cd204D654CEbe8dd64A4857cAb6Be8345a3',
		chainId: 1,
		entityId: 'jpegd',
		name: 'JPEG Token',
		labels: ['token', 'nft'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== ParaSpace ====================
	{
		address: '0x638a98BBB92a7582d07C52ff407D49664DC8b3Ee',
		chainId: 1,
		entityId: 'paraspace',
		name: 'ParaSpace Pool',
		labels: ['nft', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
