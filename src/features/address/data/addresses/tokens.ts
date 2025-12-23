/**
 * Token contract addresses - Stablecoins, Major Tokens, Memecoins
 * 数据来源: CoinGecko, 官方文档
 */

import type { LabeledAddress } from '../../types';

export const tokenAddresses: LabeledAddress[] = [
	// ==================== Stablecoins ====================
	{
		address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
		chainId: 1,
		entityId: 'tether',
		name: 'USDT (Tether)',
		labels: ['token', 'stablecoin', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		chainId: 1,
		entityId: 'circle',
		name: 'USDC',
		labels: ['token', 'stablecoin', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6B175474E89094C44Da98b954EescdeCB5BE3830',
		chainId: 1,
		entityId: 'dai',
		name: 'DAI',
		labels: ['token', 'stablecoin', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
		chainId: 1,
		entityId: 'unknown',
		name: 'BUSD (Binance USD)',
		labels: ['token', 'stablecoin', 'contract'],
		riskLevel: 'warning',
		description: 'BUSD has been deprecated',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
		chainId: 1,
		entityId: 'frax',
		name: 'FRAX',
		labels: ['token', 'stablecoin', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
		chainId: 1,
		entityId: 'unknown',
		name: 'USDP (Pax Dollar)',
		labels: ['token', 'stablecoin', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0000000000085d4780B73119b644AE5ecd22b376',
		chainId: 1,
		entityId: 'unknown',
		name: 'TUSD (TrueUSD)',
		labels: ['token', 'stablecoin', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c',
		chainId: 1,
		entityId: 'circle',
		name: 'EURC',
		labels: ['token', 'stablecoin', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
		chainId: 1,
		entityId: 'dai',
		name: 'sDAI (Savings DAI)',
		labels: ['token', 'stablecoin', 'yield', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
		chainId: 1,
		entityId: 'unknown',
		name: 'sUSD (Synthetix USD)',
		labels: ['token', 'stablecoin', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Wrapped Tokens ====================
	{
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		chainId: 1,
		entityId: 'system',
		name: 'WETH (Wrapped Ether)',
		labels: ['token', 'wrapped', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
		chainId: 1,
		entityId: 'unknown',
		name: 'WBTC (Wrapped Bitcoin)',
		labels: ['token', 'wrapped', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
		chainId: 1,
		entityId: 'coinbase',
		name: 'cbBTC (Coinbase Wrapped BTC)',
		labels: ['token', 'wrapped', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xfE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6',
		chainId: 1,
		entityId: 'unknown',
		name: 'sBTC (Synthetix BTC)',
		labels: ['token', 'wrapped', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Major Tokens ====================
	{
		address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
		chainId: 1,
		entityId: 'chainlink',
		name: 'LINK (Chainlink)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
		chainId: 1,
		entityId: 'uniswap',
		name: 'UNI (Uniswap)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
		chainId: 1,
		entityId: 'aave',
		name: 'AAVE',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
		chainId: 1,
		entityId: 'makerdao',
		name: 'MKR (Maker)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
		chainId: 1,
		entityId: 'compound',
		name: 'COMP (Compound)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
		chainId: 1,
		entityId: 'sushiswap',
		name: 'SUSHI',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
		chainId: 1,
		entityId: 'curve',
		name: 'CRV (Curve)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
		chainId: 1,
		entityId: 'lido',
		name: 'LDO (Lido DAO)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
		chainId: 1,
		entityId: 'ens',
		name: 'ENS',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
		chainId: 1,
		entityId: 'thegraph',
		name: 'GRT (The Graph)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
		chainId: 1,
		entityId: 'gnosis',
		name: 'GNO (Gnosis)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5aFE3855358E112B5647B952709E6165e1c1eEEe',
		chainId: 1,
		entityId: 'safe',
		name: 'SAFE',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
		chainId: 42161,
		entityId: 'arbitrum',
		name: 'ARB (Arbitrum)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4200000000000000000000000000000000000042',
		chainId: 10,
		entityId: 'optimism',
		name: 'OP (Optimism)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
		chainId: 1,
		entityId: 'polygon',
		name: 'MATIC (Polygon)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
		chainId: 1,
		entityId: 'unknown',
		name: 'BAT (Basic Attention Token)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
		chainId: 1,
		entityId: 'unknown',
		name: 'MANA (Decentraland)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
		chainId: 1,
		entityId: 'binance',
		name: 'BNB (on Ethereum)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
		chainId: 1,
		entityId: 'unknown',
		name: 'SHIB (Shiba Inu)',
		labels: ['token', 'memecoin', 'contract'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Memecoins ====================
	{
		address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
		chainId: 1,
		entityId: 'unknown',
		name: 'PEPE',
		labels: ['token', 'memecoin', 'contract'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x163f8C2467924be0ae7B5347228CABF260318753',
		chainId: 1,
		entityId: 'unknown',
		name: 'WLD (Worldcoin)',
		labels: ['token', 'contract'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
		chainId: 1,
		entityId: 'unknown',
		name: 'APE (ApeCoin)',
		labels: ['token', 'contract'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
		chainId: 1,
		entityId: 'unknown',
		name: 'SAND (The Sandbox)',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1f52145666C862eD3E2f1Da213d479E61b2892af',
		chainId: 1,
		entityId: 'unknown',
		name: 'FLOKI',
		labels: ['token', 'memecoin', 'contract'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xb131f4A55907B10d1F0A50d8ab8FA09EC342cd74',
		chainId: 1,
		entityId: 'unknown',
		name: 'MEME',
		labels: ['token', 'memecoin', 'contract'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a',
		chainId: 1,
		entityId: 'unknown',
		name: 'MOG',
		labels: ['token', 'memecoin', 'contract'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== L2 Native Tokens on Ethereum ====================
	{
		address: '0x5283D291DBCF85356A21bA090E6db59121208b44',
		chainId: 1,
		entityId: 'blur',
		name: 'BLUR',
		labels: ['token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xFe2e637202056d30016725477c5da089Ab0A043A',
		chainId: 1,
		entityId: 'unknown',
		name: 'sETH2 (StakeWise)',
		labels: ['token', 'liquid-staking', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
		chainId: 1,
		entityId: 'coinbase',
		name: 'cbETH (Coinbase Staked ETH)',
		labels: ['token', 'liquid-staking', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xac3E018457B222d93114458476f3E3416Abbe38F',
		chainId: 1,
		entityId: 'frax',
		name: 'sfrxETH (Staked Frax Ether)',
		labels: ['token', 'liquid-staking', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa35b1B31Ce002FBF2058D22F30f95D405200A15b',
		chainId: 1,
		entityId: 'unknown',
		name: 'ETHx (Stader)',
		labels: ['token', 'liquid-staking', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38',
		chainId: 1,
		entityId: 'unknown',
		name: 'osETH (StakeWise)',
		labels: ['token', 'liquid-staking', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
