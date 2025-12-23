/**
 * Additional Token Addresses - More ERC20 tokens
 * 数据来源: CoinGecko、CoinMarketCap、Etherscan
 */

import type { LabeledAddress } from '../../types';

export const moreTokenAddresses: LabeledAddress[] = [
	// ==================== Major DeFi Tokens ====================
	{
		address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
		chainId: 1,
		name: 'UNI Token',
		labels: ['token'],
		entityId: 'uniswap',
		riskLevel: 'safe',
		description: 'Uniswap governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
		chainId: 1,
		name: 'CRV Token',
		labels: ['token'],
		entityId: 'curve',
		riskLevel: 'safe',
		description: 'Curve DAO token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
		chainId: 1,
		name: 'SUSHI Token',
		labels: ['token'],
		entityId: 'sushiswap',
		riskLevel: 'safe',
		description: 'SushiSwap token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x111111111117dC0aa78b770fA6A738034120C302',
		chainId: 1,
		name: '1INCH Token',
		labels: ['token'],
		entityId: 'oneinch',
		riskLevel: 'safe',
		description: '1inch governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xba100000625a3754423978a60c9317c58a424e3D',
		chainId: 1,
		name: 'BAL Token',
		labels: ['token'],
		entityId: 'balancer',
		riskLevel: 'safe',
		description: 'Balancer governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
		chainId: 1,
		name: 'COMP Token',
		labels: ['token'],
		entityId: 'compound',
		riskLevel: 'safe',
		description: 'Compound governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
		chainId: 1,
		name: 'MKR Token',
		labels: ['token'],
		entityId: 'makerdao',
		riskLevel: 'safe',
		description: 'Maker governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
		chainId: 1,
		name: 'AAVE Token',
		labels: ['token'],
		entityId: 'aave',
		riskLevel: 'safe',
		description: 'Aave governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
		chainId: 1,
		name: 'stETH',
		labels: ['token'],
		entityId: 'lido',
		riskLevel: 'safe',
		description: 'Lido staked ETH',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
		chainId: 1,
		name: 'wstETH',
		labels: ['token'],
		entityId: 'lido',
		riskLevel: 'safe',
		description: 'Wrapped staked ETH',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
		chainId: 1,
		name: 'LDO Token',
		labels: ['token'],
		entityId: 'lido',
		riskLevel: 'safe',
		description: 'Lido DAO token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
		chainId: 1,
		name: 'cbETH',
		labels: ['token'],
		entityId: 'coinbase',
		riskLevel: 'safe',
		description: 'Coinbase Wrapped Staked ETH',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
		chainId: 1,
		name: 'rETH',
		labels: ['token'],
		entityId: 'rocketpool',
		riskLevel: 'safe',
		description: 'Rocket Pool staked ETH',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xD33526068D116cE69F19A9ee46F0bd304F21A51f',
		chainId: 1,
		name: 'RPL Token',
		labels: ['token'],
		entityId: 'rocketpool',
		riskLevel: 'safe',
		description: 'Rocket Pool token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83',
		chainId: 1,
		name: 'EIGEN Token',
		labels: ['token'],
		entityId: 'eigenlayer',
		riskLevel: 'safe',
		description: 'EigenLayer governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Wrapped Tokens ====================
	{
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		chainId: 1,
		name: 'WETH',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Wrapped Ether',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
		chainId: 1,
		name: 'WBTC',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Wrapped Bitcoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6',
		chainId: 1,
		name: 'sBTC',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Synthetix Bitcoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Major L1/L2 Tokens ====================
	{
		address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
		chainId: 1,
		name: 'MATIC Token',
		labels: ['token'],
		entityId: 'polygon',
		riskLevel: 'safe',
		description: 'Polygon native token (on Ethereum)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xB50721BCf8d664c30412Cfbc6cf7a15145234ad1',
		chainId: 1,
		name: 'ARB Token',
		labels: ['token'],
		entityId: 'arbitrum',
		riskLevel: 'safe',
		description: 'Arbitrum governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4200000000000000000000000000000000000042',
		chainId: 10,
		name: 'OP Token',
		labels: ['token'],
		entityId: 'optimism',
		riskLevel: 'safe',
		description: 'Optimism governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Oracle & Infrastructure ====================
	{
		address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
		chainId: 1,
		name: 'LINK Token',
		labels: ['token'],
		entityId: 'chainlink',
		riskLevel: 'safe',
		description: 'Chainlink token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
		chainId: 1,
		name: 'GRT Token',
		labels: ['token'],
		entityId: 'thegraph',
		riskLevel: 'safe',
		description: 'The Graph token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Popular Meme Tokens ====================
	{
		address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
		chainId: 1,
		name: 'SHIB Token',
		labels: ['token'],
		riskLevel: 'neutral',
		description: 'Shiba Inu token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
		chainId: 1,
		name: 'PEPE Token',
		labels: ['token'],
		riskLevel: 'neutral',
		description: 'Pepe memecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x163f8C2467924be0ae7B5347228CABF260318753',
		chainId: 1,
		name: 'WLD Token',
		labels: ['token'],
		riskLevel: 'neutral',
		description: 'Worldcoin token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784',
		chainId: 1,
		name: 'TRU Token',
		labels: ['token'],
		riskLevel: 'neutral',
		description: 'TrueFi token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Privacy Tokens ====================
	{
		address: '0x77777FeDdddFfC19Ff86DB637967013e6C6A116C',
		chainId: 1,
		name: 'TORN Token',
		labels: ['token'],
		riskLevel: 'warning',
		description: 'Tornado Cash governance token (sanctioned)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Synthetic Assets ====================
	{
		address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
		chainId: 1,
		name: 'SNX Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Synthetix Network Token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
		chainId: 1,
		name: 'sUSD',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Synthetix USD',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Centralized Exchange Tokens ====================
	{
		address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
		chainId: 1,
		name: 'BNB Token',
		labels: ['token'],
		entityId: 'binance',
		riskLevel: 'safe',
		description: 'BNB (ERC20 on Ethereum)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x75231F58b43240C9718Dd58B4967c5114342a86c',
		chainId: 1,
		name: 'OKB Token',
		labels: ['token'],
		entityId: 'okx',
		riskLevel: 'safe',
		description: 'OKB token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6f259637dcD74C767781E37Bc6133cd6A68aa161',
		chainId: 1,
		name: 'HT Token',
		labels: ['token'],
		entityId: 'htx',
		riskLevel: 'safe',
		description: 'Huobi Token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xf34960d9d60be18cC1D5Afc1A6F012A723a28811',
		chainId: 1,
		name: 'KCS Token',
		labels: ['token'],
		entityId: 'kucoin',
		riskLevel: 'safe',
		description: 'KuCoin Token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Other Major Tokens ====================
	{
		address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
		chainId: 1,
		name: 'YFI Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'yearn.finance governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
		chainId: 1,
		name: 'BAT Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Basic Attention Token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
		chainId: 1,
		name: 'ZRX Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: '0x Protocol token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xdd974D5C2e2928deA5F71b9825b8b646686BD200',
		chainId: 1,
		name: 'KNC Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Kyber Network Crystal',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x408e41876cCCDC0F92210600ef50372656052a38',
		chainId: 1,
		name: 'REN Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Ren Protocol token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
		chainId: 1,
		name: 'REP Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Augur Reputation token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0000000000085d4780B73119b644AE5ecd22b376',
		chainId: 1,
		name: 'TUSD Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'TrueUSD stablecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
		chainId: 1,
		name: 'USDP Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Pax Dollar',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
		chainId: 1,
		name: 'GUSD Token',
		labels: ['token'],
		entityId: 'gemini',
		riskLevel: 'safe',
		description: 'Gemini Dollar',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
		chainId: 1,
		name: 'BUSD Token',
		labels: ['token'],
		entityId: 'binance',
		riskLevel: 'safe',
		description: 'Binance USD',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b',
		chainId: 1,
		name: 'CRO Token',
		labels: ['token'],
		entityId: 'cryptocom',
		riskLevel: 'safe',
		description: 'Crypto.com Coin',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
