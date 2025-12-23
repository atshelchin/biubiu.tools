/**
 * More Exchange Addresses - Additional verified exchange wallets
 * 数据来源：Etherscan Labels、官方公告
 */

import type { LabeledAddress } from '../../types';

export const moreExchangeAddresses: LabeledAddress[] = [
	// ==================== Binance Additional ====================

	{
		address: '0x564286362092D8e7936f0549571a803B203aAceD',
		chainId: 1,
		name: 'Binance 9',
		labels: ['exchange', 'cex'],
		entityId: 'binance',
		riskLevel: 'safe',
		description: 'Binance Hot Wallet 9',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Coinbase Additional ====================

	{
		address: '0x3cD751E6b0078Be393132286c442345e5DC49699',
		chainId: 1,
		name: 'Coinbase 6',
		labels: ['exchange', 'cex'],
		entityId: 'coinbase',
		riskLevel: 'safe',
		description: 'Coinbase Wallet 6',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Kraken Additional ====================

	{
		address: '0x0A869d79a7052C7f1b55a8EbAbbEa3420F0D1E13',
		chainId: 1,
		name: 'Kraken 3',
		labels: ['exchange', 'cex'],
		entityId: 'kraken',
		riskLevel: 'safe',
		description: 'Kraken Hot Wallet 3',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xE853c56864A2ebe4576a807D26Fdc4A0adA51919',
		chainId: 1,
		name: 'Kraken 4',
		labels: ['exchange', 'cex'],
		entityId: 'kraken',
		riskLevel: 'safe',
		description: 'Kraken Hot Wallet 4',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== OKX Additional ====================
	{
		address: '0x98EC059Dc3aDFBdd63429454aeB0c990FBA4A128',
		chainId: 1,
		name: 'OKX 2',
		labels: ['exchange', 'cex'],
		entityId: 'okx',
		riskLevel: 'safe',
		description: 'OKX Hot Wallet 2',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== HTX/Huobi Additional ====================
	{
		address: '0x18709E89BD403F470088aBDAcEbE86CC60dda12e',
		chainId: 1,
		name: 'HTX 2',
		labels: ['exchange', 'cex'],
		entityId: 'htx',
		riskLevel: 'safe',
		description: 'HTX Hot Wallet 2',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	{
		address: '0x5C985E89DDe482eFE97ea9f1950aD149Eb73829B',
		chainId: 1,
		name: 'HTX 5',
		labels: ['exchange', 'cex'],
		entityId: 'htx',
		riskLevel: 'safe',
		description: 'HTX Hot Wallet 5',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gate.io ====================

	{
		address: '0xD793281182a0e3E023116004778F45c29fc14F19',
		chainId: 1,
		name: 'Gate.io 3',
		labels: ['exchange', 'cex'],
		entityId: 'gateio',
		riskLevel: 'safe',
		description: 'Gate.io Cold Wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Bitfinex ====================

	{
		address: '0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828',
		chainId: 1,
		name: 'Bitfinex 2',
		labels: ['exchange', 'cex'],
		entityId: 'bitfinex',
		riskLevel: 'safe',
		description: 'Bitfinex Cold Wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x742d35Cc6634C0532925a3b844Bc9e7595f5B7C8',
		chainId: 1,
		name: 'Bitfinex Cold 2',
		labels: ['exchange', 'cex', 'whale'],
		entityId: 'bitfinex',
		riskLevel: 'safe',
		description: 'Bitfinex Large Cold Wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gemini ====================
	{
		address: '0xD24400ae8BfEBb18cA49Be86258a3C749cf46853',
		chainId: 1,
		name: 'Gemini 1',
		labels: ['exchange', 'cex'],
		entityId: 'gemini',
		riskLevel: 'safe',
		description: 'Gemini Hot Wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	{
		address: '0x07ee55aa48bb72dcc6e9d78256648910de513eca',
		chainId: 1,
		name: 'Gemini 3',
		labels: ['exchange', 'cex'],
		entityId: 'gemini',
		riskLevel: 'safe',
		description: 'Gemini Hot Wallet 3',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Bitstamp ====================
	{
		address: '0x00bDb5699745f5b860228c8f939ABF1b9Ae374eD',
		chainId: 1,
		name: 'Bitstamp 1',
		labels: ['exchange', 'cex'],
		entityId: 'bitstamp',
		riskLevel: 'safe',
		description: 'Bitstamp Hot Wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1522900b6dafac587d499a862861c0869be6e428',
		chainId: 1,
		name: 'Bitstamp 2',
		labels: ['exchange', 'cex'],
		entityId: 'bitstamp',
		riskLevel: 'safe',
		description: 'Bitstamp Cold Wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Crypto.com ====================

	{
		address: '0xcffad3200574698b78f32232aa9d63eabd290703',
		chainId: 1,
		name: 'Crypto.com 3',
		labels: ['exchange', 'cex'],
		entityId: 'cryptocom',
		riskLevel: 'safe',
		description: 'Crypto.com Custody',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
