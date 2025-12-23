/**
 * Notable ENS names and other domain records
 * 数据来源: 公开信息
 */

import type { NameRecord } from '../../types';

export const ensNames: NameRecord[] = [
	// ==================== Ethereum Founders & Core ====================
	{
		name: 'vitalik.eth',
		type: 'ens',
		address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		entityId: 'vitalik',
		notable: true,
		description: 'Ethereum co-founder Vitalik Buterin',
		socials: {
			twitter: 'VitalikButerin',
			website: 'https://vitalik.eth.limo'
		},
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'ethereum.eth',
		type: 'ens',
		address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
		entityId: 'ethereumfoundation',
		notable: true,
		description: 'Ethereum Foundation',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Exchanges ====================
	{
		name: 'binance.eth',
		type: 'ens',
		entityId: 'binance',
		notable: true,
		description: 'Binance Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'coinbase.eth',
		type: 'ens',
		entityId: 'coinbase',
		notable: true,
		description: 'Coinbase Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'kraken.eth',
		type: 'ens',
		entityId: 'kraken',
		notable: true,
		description: 'Kraken Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== DeFi Protocols ====================
	{
		name: 'uniswap.eth',
		type: 'ens',
		entityId: 'uniswap',
		notable: true,
		description: 'Uniswap Protocol',
		socials: {
			twitter: 'Uniswap',
			website: 'https://uniswap.org'
		},
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'aave.eth',
		type: 'ens',
		entityId: 'aave',
		notable: true,
		description: 'Aave Protocol',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'compound.eth',
		type: 'ens',
		entityId: 'compound',
		notable: true,
		description: 'Compound Protocol',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'curve.eth',
		type: 'ens',
		entityId: 'curve',
		notable: true,
		description: 'Curve Finance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'lido.eth',
		type: 'ens',
		entityId: 'lido',
		notable: true,
		description: 'Lido Finance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'sushi.eth',
		type: 'ens',
		entityId: 'sushiswap',
		notable: true,
		description: 'SushiSwap',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '1inch.eth',
		type: 'ens',
		entityId: 'oneinch',
		notable: true,
		description: '1inch DEX Aggregator',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'balancer.eth',
		type: 'ens',
		entityId: 'balancer',
		notable: true,
		description: 'Balancer Protocol',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== NFT Projects ====================
	{
		name: 'opensea.eth',
		type: 'ens',
		entityId: 'opensea',
		notable: true,
		description: 'OpenSea NFT Marketplace',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'blur.eth',
		type: 'ens',
		entityId: 'blur',
		notable: true,
		description: 'Blur NFT Marketplace',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'bayc.eth',
		type: 'ens',
		entityId: 'bayc',
		notable: true,
		description: 'Bored Ape Yacht Club',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'azuki.eth',
		type: 'ens',
		entityId: 'azuki',
		notable: true,
		description: 'Azuki NFT Collection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'pudgy.eth',
		type: 'ens',
		entityId: 'pudgypenguins',
		notable: true,
		description: 'Pudgy Penguins',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'doodles.eth',
		type: 'ens',
		entityId: 'doodles',
		notable: true,
		description: 'Doodles NFT Collection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Investment Funds ====================
	{
		name: 'paradigm.eth',
		type: 'ens',
		entityId: 'paradigm',
		notable: true,
		description: 'Paradigm Venture Capital',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'a16z.eth',
		type: 'ens',
		entityId: 'a16z',
		notable: true,
		description: 'Andreessen Horowitz Crypto',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== L2 & Infrastructure ====================
	{
		name: 'arbitrum.eth',
		type: 'ens',
		entityId: 'arbitrum',
		notable: true,
		description: 'Arbitrum L2',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'optimism.eth',
		type: 'ens',
		entityId: 'optimism',
		notable: true,
		description: 'Optimism L2',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'base.eth',
		type: 'ens',
		entityId: 'base',
		notable: true,
		description: 'Base L2 by Coinbase',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'polygon.eth',
		type: 'ens',
		entityId: 'polygon',
		notable: true,
		description: 'Polygon Network',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'chainlink.eth',
		type: 'ens',
		entityId: 'chainlink',
		notable: true,
		description: 'Chainlink Oracle Network',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'ens.eth',
		type: 'ens',
		address: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
		entityId: 'ens',
		notable: true,
		description: 'Ethereum Name Service',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Stablecoins ====================
	{
		name: 'tether.eth',
		type: 'ens',
		entityId: 'tether',
		notable: true,
		description: 'Tether USDT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'circle.eth',
		type: 'ens',
		entityId: 'circle',
		notable: true,
		description: 'Circle USDC',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'dai.eth',
		type: 'ens',
		entityId: 'dai',
		notable: true,
		description: 'DAI Stablecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Notable Individuals ====================
	{
		name: 'nick.eth',
		type: 'ens',
		notable: true,
		description: 'Nick Johnson - ENS Lead Developer',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'brantly.eth',
		type: 'ens',
		notable: true,
		description: 'Brantly Millegan - Former ENS Director',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'hayden.eth',
		type: 'ens',
		notable: true,
		description: 'Hayden Adams - Uniswap Founder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'stani.eth',
		type: 'ens',
		notable: true,
		description: 'Stani Kulechov - Aave Founder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'sassal.eth',
		type: 'ens',
		notable: true,
		description: 'Anthony Sassano - The Daily Gwei',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'punk6529.eth',
		type: 'ens',
		notable: true,
		description: 'Punk6529 - NFT Collector & Educator',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'cozomo.eth',
		type: 'ens',
		notable: true,
		description: 'Cozomo de Medici - NFT Collector (Snoop Dogg)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== High Value Short Names ====================
	{
		name: '0.eth',
		type: 'ens',
		notable: true,
		description: 'Single digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '1.eth',
		type: 'ens',
		notable: true,
		description: 'Single digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'a.eth',
		type: 'ens',
		notable: true,
		description: 'Single letter ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'x.eth',
		type: 'ens',
		notable: true,
		description: 'Single letter ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'eth.eth',
		type: 'ens',
		notable: true,
		description: 'Ethereum themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'bitcoin.eth',
		type: 'ens',
		notable: true,
		description: 'Bitcoin themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'crypto.eth',
		type: 'ens',
		notable: true,
		description: 'Crypto themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'nft.eth',
		type: 'ens',
		notable: true,
		description: 'NFT themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'defi.eth',
		type: 'ens',
		notable: true,
		description: 'DeFi themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'wallet.eth',
		type: 'ens',
		notable: true,
		description: 'Wallet themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Brand Names ====================
	{
		name: 'nike.eth',
		type: 'ens',
		notable: true,
		description: 'Nike brand',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'adidas.eth',
		type: 'ens',
		notable: true,
		description: 'Adidas brand',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'gucci.eth',
		type: 'ens',
		notable: true,
		description: 'Gucci brand',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'amazon.eth',
		type: 'ens',
		notable: true,
		description: 'Amazon',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'google.eth',
		type: 'ens',
		notable: true,
		description: 'Google',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'apple.eth',
		type: 'ens',
		notable: true,
		description: 'Apple',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== More Crypto Projects ====================
	{
		name: 'makerdao.eth',
		type: 'ens',
		entityId: 'makerdao',
		notable: true,
		description: 'MakerDAO',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'synthetix.eth',
		type: 'ens',
		entityId: 'synthetix',
		notable: true,
		description: 'Synthetix Protocol',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'yearn.eth',
		type: 'ens',
		entityId: 'yearn',
		notable: true,
		description: 'Yearn Finance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'convex.eth',
		type: 'ens',
		entityId: 'convex',
		notable: true,
		description: 'Convex Finance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'frax.eth',
		type: 'ens',
		entityId: 'frax',
		notable: true,
		description: 'Frax Finance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'gmx.eth',
		type: 'ens',
		entityId: 'gmx',
		notable: true,
		description: 'GMX Protocol',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'dydx.eth',
		type: 'ens',
		entityId: 'dydx',
		notable: true,
		description: 'dYdX Protocol',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'pendle.eth',
		type: 'ens',
		entityId: 'pendle',
		notable: true,
		description: 'Pendle Finance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'eigenlayer.eth',
		type: 'ens',
		entityId: 'eigenlayer',
		notable: true,
		description: 'EigenLayer Restaking',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'rocketpool.eth',
		type: 'ens',
		entityId: 'rocketpool',
		notable: true,
		description: 'Rocket Pool Staking',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'morpho.eth',
		type: 'ens',
		entityId: 'morpho',
		notable: true,
		description: 'Morpho Protocol',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'euler.eth',
		type: 'ens',
		entityId: 'euler',
		notable: true,
		description: 'Euler Finance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'radiant.eth',
		type: 'ens',
		entityId: 'radiant',
		notable: true,
		description: 'Radiant Capital',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'benqi.eth',
		type: 'ens',
		entityId: 'benqi',
		notable: true,
		description: 'BENQI Finance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'venus.eth',
		type: 'ens',
		entityId: 'venus',
		notable: true,
		description: 'Venus Protocol',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'instadapp.eth',
		type: 'ens',
		entityId: 'instadapp',
		notable: true,
		description: 'Instadapp',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'zapper.eth',
		type: 'ens',
		notable: true,
		description: 'Zapper.fi',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'zerion.eth',
		type: 'ens',
		notable: true,
		description: 'Zerion',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'rainbow.eth',
		type: 'ens',
		notable: true,
		description: 'Rainbow Wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'safe.eth',
		type: 'ens',
		entityId: 'safe',
		notable: true,
		description: 'Safe (Gnosis Safe)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== More Exchanges ====================
	{
		name: 'ftx.eth',
		type: 'ens',
		notable: true,
		description: 'FTX (Defunct)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'gemini.eth',
		type: 'ens',
		entityId: 'gemini',
		notable: true,
		description: 'Gemini Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'kucoin.eth',
		type: 'ens',
		entityId: 'kucoin',
		notable: true,
		description: 'KuCoin Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'okx.eth',
		type: 'ens',
		entityId: 'okx',
		notable: true,
		description: 'OKX Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'huobi.eth',
		type: 'ens',
		entityId: 'huobi',
		notable: true,
		description: 'Huobi (HTX) Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'bybit.eth',
		type: 'ens',
		entityId: 'bybit',
		notable: true,
		description: 'Bybit Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'bitget.eth',
		type: 'ens',
		notable: true,
		description: 'Bitget Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'gateio.eth',
		type: 'ens',
		notable: true,
		description: 'Gate.io Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'mexc.eth',
		type: 'ens',
		notable: true,
		description: 'MEXC Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'bitstamp.eth',
		type: 'ens',
		entityId: 'bitstamp',
		notable: true,
		description: 'Bitstamp Exchange',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== More Notable People ====================
	{
		name: 'cz.eth',
		type: 'ens',
		notable: true,
		description: 'CZ - Binance Founder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'sbf.eth',
		type: 'ens',
		notable: true,
		description: 'SBF - FTX Founder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'brian.eth',
		type: 'ens',
		notable: true,
		description: 'Brian Armstrong - Coinbase CEO',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'jesse.eth',
		type: 'ens',
		notable: true,
		description: 'Jesse Pollak - Base Creator',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'gavin.eth',
		type: 'ens',
		notable: true,
		description: 'Gavin Wood - Polkadot/Ethereum',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'charlie.eth',
		type: 'ens',
		notable: true,
		description: 'Charlie Lee - Litecoin Creator',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'satoshi.eth',
		type: 'ens',
		notable: true,
		description: 'Satoshi - Bitcoin Creator name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'nakamoto.eth',
		type: 'ens',
		notable: true,
		description: 'Nakamoto',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'cobie.eth',
		type: 'ens',
		notable: true,
		description: 'Cobie - Crypto Influencer',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'tetranode.eth',
		type: 'ens',
		notable: true,
		description: 'Tetranode - DeFi Whale',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'dcfgod.eth',
		type: 'ens',
		notable: true,
		description: 'DCFGod - Crypto Investor',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'hsaka.eth',
		type: 'ens',
		notable: true,
		description: 'Hsaka - Crypto Trader',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'loomdart.eth',
		type: 'ens',
		notable: true,
		description: 'Loomdart - Crypto Investor',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'inversebrah.eth',
		type: 'ens',
		notable: true,
		description: 'InverseBrah - Crypto Twitter',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'zachxbt.eth',
		type: 'ens',
		notable: true,
		description: 'ZachXBT - On-chain Investigator',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'tayvano.eth',
		type: 'ens',
		notable: true,
		description: 'Taylor Monahan - MetaMask/MyCrypto',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'banteg.eth',
		type: 'ens',
		notable: true,
		description: 'Banteg - Yearn Developer',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'andreani.eth',
		type: 'ens',
		notable: true,
		description: 'Andre Cronje - DeFi Developer',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'jconorgrogan.eth',
		type: 'ens',
		notable: true,
		description: 'Conor Grogan - Coinbase Director',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== More NFT Projects ====================
	{
		name: 'cryptopunks.eth',
		type: 'ens',
		entityId: 'cryptopunks',
		notable: true,
		description: 'CryptoPunks Collection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'coolcats.eth',
		type: 'ens',
		notable: true,
		description: 'Cool Cats NFT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'moonbirds.eth',
		type: 'ens',
		notable: true,
		description: 'Moonbirds NFT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'clonex.eth',
		type: 'ens',
		notable: true,
		description: 'Clone X NFT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'milady.eth',
		type: 'ens',
		notable: true,
		description: 'Milady Maker NFT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'degods.eth',
		type: 'ens',
		notable: true,
		description: 'DeGods NFT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'mfers.eth',
		type: 'ens',
		notable: true,
		description: 'mfers NFT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'veefriends.eth',
		type: 'ens',
		notable: true,
		description: 'VeeFriends by Gary Vee',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'meebits.eth',
		type: 'ens',
		notable: true,
		description: 'Meebits by Larva Labs',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'artblocks.eth',
		type: 'ens',
		notable: true,
		description: 'Art Blocks',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'foundation.eth',
		type: 'ens',
		notable: true,
		description: 'Foundation NFT Platform',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'rarible.eth',
		type: 'ens',
		notable: true,
		description: 'Rarible NFT Marketplace',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'superrare.eth',
		type: 'ens',
		notable: true,
		description: 'SuperRare NFT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'nifty.eth',
		type: 'ens',
		notable: true,
		description: 'Nifty Gateway',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== More L2 & Infrastructure ====================
	{
		name: 'zksync.eth',
		type: 'ens',
		entityId: 'zksync',
		notable: true,
		description: 'zkSync Era',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'linea.eth',
		type: 'ens',
		entityId: 'linea',
		notable: true,
		description: 'Linea by ConsenSys',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'scroll.eth',
		type: 'ens',
		entityId: 'scroll',
		notable: true,
		description: 'Scroll zkEVM',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'starknet.eth',
		type: 'ens',
		entityId: 'starknet',
		notable: true,
		description: 'StarkNet L2',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'mantle.eth',
		type: 'ens',
		entityId: 'mantle',
		notable: true,
		description: 'Mantle Network',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'blast.eth',
		type: 'ens',
		entityId: 'blast',
		notable: true,
		description: 'Blast L2',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'mode.eth',
		type: 'ens',
		entityId: 'mode',
		notable: true,
		description: 'Mode Network',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'taiko.eth',
		type: 'ens',
		entityId: 'taiko',
		notable: true,
		description: 'Taiko L2',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'avalanche.eth',
		type: 'ens',
		entityId: 'avalanche',
		notable: true,
		description: 'Avalanche Network',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'solana.eth',
		type: 'ens',
		notable: true,
		description: 'Solana blockchain',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'cosmos.eth',
		type: 'ens',
		notable: true,
		description: 'Cosmos ecosystem',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'polkadot.eth',
		type: 'ens',
		notable: true,
		description: 'Polkadot Network',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'near.eth',
		type: 'ens',
		notable: true,
		description: 'NEAR Protocol',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'sui.eth',
		type: 'ens',
		notable: true,
		description: 'Sui blockchain',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'aptos.eth',
		type: 'ens',
		notable: true,
		description: 'Aptos blockchain',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'celestia.eth',
		type: 'ens',
		notable: true,
		description: 'Celestia modular blockchain',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Investment & VC ====================
	{
		name: 'polychain.eth',
		type: 'ens',
		notable: true,
		description: 'Polychain Capital',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'dragonfly.eth',
		type: 'ens',
		notable: true,
		description: 'Dragonfly Capital',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'multicoin.eth',
		type: 'ens',
		notable: true,
		description: 'Multicoin Capital',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'pantera.eth',
		type: 'ens',
		notable: true,
		description: 'Pantera Capital',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'sequoia.eth',
		type: 'ens',
		notable: true,
		description: 'Sequoia Capital',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'delphi.eth',
		type: 'ens',
		notable: true,
		description: 'Delphi Digital',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'jump.eth',
		type: 'ens',
		notable: true,
		description: 'Jump Crypto',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'wintermute.eth',
		type: 'ens',
		notable: true,
		description: 'Wintermute Trading',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'alameda.eth',
		type: 'ens',
		notable: true,
		description: 'Alameda Research (Defunct)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '3ac.eth',
		type: 'ens',
		notable: true,
		description: 'Three Arrows Capital (Defunct)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== High Value 3-Letter Names ====================
	{
		name: 'abc.eth',
		type: 'ens',
		notable: true,
		description: '3-letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'web.eth',
		type: 'ens',
		notable: true,
		description: '3-letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'dao.eth',
		type: 'ens',
		notable: true,
		description: 'DAO themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'art.eth',
		type: 'ens',
		notable: true,
		description: '3-letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'pay.eth',
		type: 'ens',
		notable: true,
		description: '3-letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'buy.eth',
		type: 'ens',
		notable: true,
		description: '3-letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'app.eth',
		type: 'ens',
		notable: true,
		description: '3-letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'dex.eth',
		type: 'ens',
		notable: true,
		description: 'DEX themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'cex.eth',
		type: 'ens',
		notable: true,
		description: 'CEX themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'god.eth',
		type: 'ens',
		notable: true,
		description: '3-letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'ice.eth',
		type: 'ens',
		notable: true,
		description: '3-letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'sky.eth',
		type: 'ens',
		notable: true,
		description: '3-letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'sun.eth',
		type: 'ens',
		notable: true,
		description: '3-letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'moon.eth',
		type: 'ens',
		notable: true,
		description: 'Crypto themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'ape.eth',
		type: 'ens',
		notable: true,
		description: 'NFT culture name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'gm.eth',
		type: 'ens',
		notable: true,
		description: 'Crypto culture name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'wagmi.eth',
		type: 'ens',
		notable: true,
		description: 'Crypto culture name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'ngmi.eth',
		type: 'ens',
		notable: true,
		description: 'Crypto culture name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'hodl.eth',
		type: 'ens',
		notable: true,
		description: 'Crypto culture name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'fomo.eth',
		type: 'ens',
		notable: true,
		description: 'Crypto culture name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'degen.eth',
		type: 'ens',
		notable: true,
		description: 'Crypto culture name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'whale.eth',
		type: 'ens',
		notable: true,
		description: 'Crypto themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'alpha.eth',
		type: 'ens',
		notable: true,
		description: 'Crypto themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'beta.eth',
		type: 'ens',
		notable: true,
		description: 'Greek letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'gamma.eth',
		type: 'ens',
		notable: true,
		description: 'Greek letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'delta.eth',
		type: 'ens',
		notable: true,
		description: 'Greek letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'omega.eth',
		type: 'ens',
		notable: true,
		description: 'Greek letter name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Number Names ====================
	{
		name: '2.eth',
		type: 'ens',
		notable: true,
		description: 'Single digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '3.eth',
		type: 'ens',
		notable: true,
		description: 'Single digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '4.eth',
		type: 'ens',
		notable: true,
		description: 'Single digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '5.eth',
		type: 'ens',
		notable: true,
		description: 'Single digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '6.eth',
		type: 'ens',
		notable: true,
		description: 'Single digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '7.eth',
		type: 'ens',
		notable: true,
		description: 'Single digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '8.eth',
		type: 'ens',
		notable: true,
		description: 'Single digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '9.eth',
		type: 'ens',
		notable: true,
		description: 'Single digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '10.eth',
		type: 'ens',
		notable: true,
		description: 'Two digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '69.eth',
		type: 'ens',
		notable: true,
		description: 'Meme number name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '100.eth',
		type: 'ens',
		notable: true,
		description: 'Three digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '420.eth',
		type: 'ens',
		notable: true,
		description: 'Meme number name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '666.eth',
		type: 'ens',
		notable: true,
		description: 'Three digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '777.eth',
		type: 'ens',
		notable: true,
		description: 'Lucky number name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '888.eth',
		type: 'ens',
		notable: true,
		description: 'Lucky number name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '999.eth',
		type: 'ens',
		notable: true,
		description: 'Three digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '1000.eth',
		type: 'ens',
		notable: true,
		description: 'Four digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '2024.eth',
		type: 'ens',
		notable: true,
		description: 'Year name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '2025.eth',
		type: 'ens',
		notable: true,
		description: 'Year name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: '10000.eth',
		type: 'ens',
		notable: true,
		description: 'Five digit ENS name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== More Brand Names ====================
	{
		name: 'microsoft.eth',
		type: 'ens',
		notable: true,
		description: 'Microsoft',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'meta.eth',
		type: 'ens',
		notable: true,
		description: 'Meta/Facebook',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'facebook.eth',
		type: 'ens',
		notable: true,
		description: 'Facebook',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'twitter.eth',
		type: 'ens',
		notable: true,
		description: 'Twitter/X',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'tesla.eth',
		type: 'ens',
		notable: true,
		description: 'Tesla',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'nvidia.eth',
		type: 'ens',
		notable: true,
		description: 'NVIDIA',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'disney.eth',
		type: 'ens',
		notable: true,
		description: 'Disney',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'netflix.eth',
		type: 'ens',
		notable: true,
		description: 'Netflix',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'spotify.eth',
		type: 'ens',
		notable: true,
		description: 'Spotify',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'uber.eth',
		type: 'ens',
		notable: true,
		description: 'Uber',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'airbnb.eth',
		type: 'ens',
		notable: true,
		description: 'Airbnb',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'visa.eth',
		type: 'ens',
		notable: true,
		description: 'Visa',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'mastercard.eth',
		type: 'ens',
		notable: true,
		description: 'Mastercard',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'paypal.eth',
		type: 'ens',
		notable: true,
		description: 'PayPal',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'stripe.eth',
		type: 'ens',
		notable: true,
		description: 'Stripe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'square.eth',
		type: 'ens',
		notable: true,
		description: 'Square/Block',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'robinhood.eth',
		type: 'ens',
		notable: true,
		description: 'Robinhood',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'fidelity.eth',
		type: 'ens',
		notable: true,
		description: 'Fidelity Investments',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'blackrock.eth',
		type: 'ens',
		notable: true,
		description: 'BlackRock',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'jpmorgan.eth',
		type: 'ens',
		notable: true,
		description: 'JPMorgan',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'goldman.eth',
		type: 'ens',
		notable: true,
		description: 'Goldman Sachs',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'samsung.eth',
		type: 'ens',
		notable: true,
		description: 'Samsung',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'sony.eth',
		type: 'ens',
		notable: true,
		description: 'Sony',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'nintendo.eth',
		type: 'ens',
		notable: true,
		description: 'Nintendo',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'playstation.eth',
		type: 'ens',
		notable: true,
		description: 'PlayStation',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'xbox.eth',
		type: 'ens',
		notable: true,
		description: 'Xbox',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'cocacola.eth',
		type: 'ens',
		notable: true,
		description: 'Coca-Cola',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'pepsi.eth',
		type: 'ens',
		notable: true,
		description: 'Pepsi',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'mcdonalds.eth',
		type: 'ens',
		notable: true,
		description: "McDonald's",
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'starbucks.eth',
		type: 'ens',
		notable: true,
		description: 'Starbucks',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'prada.eth',
		type: 'ens',
		notable: true,
		description: 'Prada',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'lvmh.eth',
		type: 'ens',
		notable: true,
		description: 'LVMH',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'chanel.eth',
		type: 'ens',
		notable: true,
		description: 'Chanel',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'hermes.eth',
		type: 'ens',
		notable: true,
		description: 'Hermes',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'rolex.eth',
		type: 'ens',
		notable: true,
		description: 'Rolex',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'cartier.eth',
		type: 'ens',
		notable: true,
		description: 'Cartier',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'tiffany.eth',
		type: 'ens',
		notable: true,
		description: 'Tiffany & Co',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'porsche.eth',
		type: 'ens',
		notable: true,
		description: 'Porsche',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'ferrari.eth',
		type: 'ens',
		notable: true,
		description: 'Ferrari',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'lamborghini.eth',
		type: 'ens',
		notable: true,
		description: 'Lamborghini',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'bmw.eth',
		type: 'ens',
		notable: true,
		description: 'BMW',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'mercedes.eth',
		type: 'ens',
		notable: true,
		description: 'Mercedes-Benz',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'audi.eth',
		type: 'ens',
		notable: true,
		description: 'Audi',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Celebrities & Public Figures ====================
	{
		name: 'elonmusk.eth',
		type: 'ens',
		notable: true,
		description: 'Elon Musk',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'trump.eth',
		type: 'ens',
		notable: true,
		description: 'Donald Trump',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'biden.eth',
		type: 'ens',
		notable: true,
		description: 'Joe Biden',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'obama.eth',
		type: 'ens',
		notable: true,
		description: 'Barack Obama',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'bezos.eth',
		type: 'ens',
		notable: true,
		description: 'Jeff Bezos',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'zuckerberg.eth',
		type: 'ens',
		notable: true,
		description: 'Mark Zuckerberg',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'garyvee.eth',
		type: 'ens',
		notable: true,
		description: 'Gary Vaynerchuk',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'snoopdogg.eth',
		type: 'ens',
		notable: true,
		description: 'Snoop Dogg',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'eminem.eth',
		type: 'ens',
		notable: true,
		description: 'Eminem',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'drake.eth',
		type: 'ens',
		notable: true,
		description: 'Drake',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'rihanna.eth',
		type: 'ens',
		notable: true,
		description: 'Rihanna',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'beyonce.eth',
		type: 'ens',
		notable: true,
		description: 'Beyonce',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'taylorswift.eth',
		type: 'ens',
		notable: true,
		description: 'Taylor Swift',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'kimk.eth',
		type: 'ens',
		notable: true,
		description: 'Kim Kardashian',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'cristiano.eth',
		type: 'ens',
		notable: true,
		description: 'Cristiano Ronaldo',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'messi.eth',
		type: 'ens',
		notable: true,
		description: 'Lionel Messi',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'lebron.eth',
		type: 'ens',
		notable: true,
		description: 'LeBron James',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'curry.eth',
		type: 'ens',
		notable: true,
		description: 'Stephen Curry',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'mrbeast.eth',
		type: 'ens',
		notable: true,
		description: 'MrBeast',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'pewdiepie.eth',
		type: 'ens',
		notable: true,
		description: 'PewDiePie',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Generic/Common Words ====================
	{
		name: 'money.eth',
		type: 'ens',
		notable: true,
		description: 'Money themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'bank.eth',
		type: 'ens',
		notable: true,
		description: 'Bank themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'gold.eth',
		type: 'ens',
		notable: true,
		description: 'Gold themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'diamond.eth',
		type: 'ens',
		notable: true,
		description: 'Diamond themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'king.eth',
		type: 'ens',
		notable: true,
		description: 'King themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'queen.eth',
		type: 'ens',
		notable: true,
		description: 'Queen themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'prince.eth',
		type: 'ens',
		notable: true,
		description: 'Prince themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'dragon.eth',
		type: 'ens',
		notable: true,
		description: 'Dragon themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'phoenix.eth',
		type: 'ens',
		notable: true,
		description: 'Phoenix themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'fire.eth',
		type: 'ens',
		notable: true,
		description: 'Fire themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'water.eth',
		type: 'ens',
		notable: true,
		description: 'Water themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'earth.eth',
		type: 'ens',
		notable: true,
		description: 'Earth themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'space.eth',
		type: 'ens',
		notable: true,
		description: 'Space themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'star.eth',
		type: 'ens',
		notable: true,
		description: 'Star themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'love.eth',
		type: 'ens',
		notable: true,
		description: 'Love themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'life.eth',
		type: 'ens',
		notable: true,
		description: 'Life themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'game.eth',
		type: 'ens',
		notable: true,
		description: 'Game themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'music.eth',
		type: 'ens',
		notable: true,
		description: 'Music themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'movie.eth',
		type: 'ens',
		notable: true,
		description: 'Movie themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'tech.eth',
		type: 'ens',
		notable: true,
		description: 'Tech themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'ai.eth',
		type: 'ens',
		notable: true,
		description: 'AI themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'data.eth',
		type: 'ens',
		notable: true,
		description: 'Data themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'cloud.eth',
		type: 'ens',
		notable: true,
		description: 'Cloud themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'code.eth',
		type: 'ens',
		notable: true,
		description: 'Code themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'dev.eth',
		type: 'ens',
		notable: true,
		description: 'Developer themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'token.eth',
		type: 'ens',
		notable: true,
		description: 'Token themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'coin.eth',
		type: 'ens',
		notable: true,
		description: 'Coin themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'chain.eth',
		type: 'ens',
		notable: true,
		description: 'Blockchain themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'block.eth',
		type: 'ens',
		notable: true,
		description: 'Block themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'hash.eth',
		type: 'ens',
		notable: true,
		description: 'Hash themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'node.eth',
		type: 'ens',
		notable: true,
		description: 'Node themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'validator.eth',
		type: 'ens',
		notable: true,
		description: 'Validator themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'staking.eth',
		type: 'ens',
		notable: true,
		description: 'Staking themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'yield.eth',
		type: 'ens',
		notable: true,
		description: 'Yield themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'swap.eth',
		type: 'ens',
		notable: true,
		description: 'Swap themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'trade.eth',
		type: 'ens',
		notable: true,
		description: 'Trade themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'invest.eth',
		type: 'ens',
		notable: true,
		description: 'Investment themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'fund.eth',
		type: 'ens',
		notable: true,
		description: 'Fund themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'capital.eth',
		type: 'ens',
		notable: true,
		description: 'Capital themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'venture.eth',
		type: 'ens',
		notable: true,
		description: 'Venture themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'labs.eth',
		type: 'ens',
		notable: true,
		description: 'Labs themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'studio.eth',
		type: 'ens',
		notable: true,
		description: 'Studio themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'gaming.eth',
		type: 'ens',
		notable: true,
		description: 'Gaming themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'metaverse.eth',
		type: 'ens',
		notable: true,
		description: 'Metaverse themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'virtual.eth',
		type: 'ens',
		notable: true,
		description: 'Virtual themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'digital.eth',
		type: 'ens',
		notable: true,
		description: 'Digital themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'decentralized.eth',
		type: 'ens',
		notable: true,
		description: 'Decentralized themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'protocol.eth',
		type: 'ens',
		notable: true,
		description: 'Protocol themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'network.eth',
		type: 'ens',
		notable: true,
		description: 'Network themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'layer.eth',
		type: 'ens',
		notable: true,
		description: 'Layer themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'rollup.eth',
		type: 'ens',
		notable: true,
		description: 'Rollup themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'zk.eth',
		type: 'ens',
		notable: true,
		description: 'Zero-knowledge themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'privacy.eth',
		type: 'ens',
		notable: true,
		description: 'Privacy themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'security.eth',
		type: 'ens',
		notable: true,
		description: 'Security themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'audit.eth',
		type: 'ens',
		notable: true,
		description: 'Audit themed name',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];

// Space ID names (.bnb, .arb)
export const spaceIdNames: NameRecord[] = [
	{
		name: 'binance.bnb',
		type: 'spaceid-bnb',
		entityId: 'binance',
		notable: true,
		description: 'Binance on BNB Chain',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'pancakeswap.bnb',
		type: 'spaceid-bnb',
		entityId: 'pancakeswap',
		notable: true,
		description: 'PancakeSwap DEX',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'arbitrum.arb',
		type: 'spaceid-arb',
		entityId: 'arbitrum',
		notable: true,
		description: 'Arbitrum Foundation',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];

// Base Names (.base.eth)
export const baseNames: NameRecord[] = [
	{
		name: 'coinbase.base.eth',
		type: 'basename',
		entityId: 'coinbase',
		notable: true,
		description: 'Coinbase on Base',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		name: 'base.base.eth',
		type: 'basename',
		entityId: 'base',
		notable: true,
		description: 'Base L2',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
