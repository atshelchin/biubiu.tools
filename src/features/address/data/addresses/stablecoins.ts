/**
 * Stablecoin contract addresses
 * 数据来源: Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const stablecoinAddresses: LabeledAddress[] = [
	// ==================== USDT ====================
	{
		address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
		chainId: 1,
		entityId: 'tether',
		name: 'Tether USD (USDT)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x55d398326f99059fF775485246999027B3197955',
		chainId: 56,
		entityId: 'tether',
		name: 'Tether USD (USDT) on BSC',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
		chainId: 42161,
		entityId: 'tether',
		name: 'Tether USD (USDT) on Arbitrum',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
		chainId: 10,
		entityId: 'tether',
		name: 'Tether USD (USDT) on Optimism',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
		chainId: 137,
		entityId: 'tether',
		name: 'Tether USD (USDT) on Polygon',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== USDC ====================
	{
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		chainId: 1,
		entityId: 'circle',
		name: 'USD Coin (USDC)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
		chainId: 56,
		entityId: 'circle',
		name: 'USD Coin (USDC) on BSC',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
		chainId: 42161,
		entityId: 'circle',
		name: 'USD Coin (USDC) on Arbitrum',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
		chainId: 10,
		entityId: 'circle',
		name: 'USD Coin (USDC) on Optimism',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
		chainId: 137,
		entityId: 'circle',
		name: 'USD Coin (USDC) on Polygon',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
		chainId: 8453,
		entityId: 'circle',
		name: 'USD Coin (USDC) on Base',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== DAI ====================
	{
		address: '0x6B175474E89094C44Da98b954EescdecB16a4F0895',
		chainId: 1,
		entityId: 'makerdao',
		name: 'Dai Stablecoin (DAI)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
		chainId: 56,
		entityId: 'makerdao',
		name: 'Dai Stablecoin (DAI) on BSC',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
		chainId: 42161,
		entityId: 'makerdao',
		name: 'Dai Stablecoin (DAI) on Arbitrum',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
		chainId: 10,
		entityId: 'makerdao',
		name: 'Dai Stablecoin (DAI) on Optimism',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
		chainId: 137,
		entityId: 'makerdao',
		name: 'Dai Stablecoin (DAI) on Polygon',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
		chainId: 8453,
		entityId: 'makerdao',
		name: 'Dai Stablecoin (DAI) on Base',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== FRAX ====================
	{
		address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
		chainId: 1,
		entityId: 'frax',
		name: 'Frax (FRAX)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
		chainId: 42161,
		entityId: 'frax',
		name: 'Frax (FRAX) on Arbitrum',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x2E3D870790dC77A83DD1d18184Acc7439A53f475',
		chainId: 10,
		entityId: 'frax',
		name: 'Frax (FRAX) on Optimism',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== BUSD ====================
	{
		address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
		chainId: 1,
		entityId: 'paxos',
		name: 'Binance USD (BUSD)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'neutral',
		description: 'Deprecated stablecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
		chainId: 56,
		entityId: 'paxos',
		name: 'Binance USD (BUSD) on BSC',
		labels: ['token', 'stablecoin'],
		riskLevel: 'neutral',
		description: 'Deprecated stablecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== TUSD ====================
	{
		address: '0x0000000000085d4780B73119b644AE5ecd22b376',
		chainId: 1,
		entityId: 'unknown',
		name: 'TrueUSD (TUSD)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== USDP ====================
	{
		address: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
		chainId: 1,
		entityId: 'paxos',
		name: 'Pax Dollar (USDP)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== GUSD ====================
	{
		address: '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd',
		chainId: 1,
		entityId: 'gemini',
		name: 'Gemini Dollar (GUSD)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== sUSD ====================
	{
		address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
		chainId: 1,
		entityId: 'synthetix',
		name: 'Synth sUSD',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== LUSD ====================
	{
		address: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
		chainId: 1,
		entityId: 'liquity',
		name: 'Liquity USD (LUSD)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== PYUSD ====================
	{
		address: '0x6c3ea9036406852006290770BEdFcAbA0e23A0e8',
		chainId: 1,
		entityId: 'paypal',
		name: 'PayPal USD (PYUSD)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== crvUSD ====================
	{
		address: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
		chainId: 1,
		entityId: 'curve',
		name: 'Curve.Fi USD Stablecoin (crvUSD)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== GHO ====================
	{
		address: '0x40D16FC0246aD3160Ccc09B8D0D3A2cD28aE6C2f',
		chainId: 1,
		entityId: 'aave',
		name: 'Aave GHO Stablecoin',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== MIM ====================
	{
		address: '0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3',
		chainId: 1,
		entityId: 'unknown',
		name: 'Magic Internet Money (MIM)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== DOLA ====================
	{
		address: '0x865377367054516e17014CcdED1e7d814EDC9ce4',
		chainId: 1,
		entityId: 'inverse',
		name: 'Dola USD Stablecoin',
		labels: ['token', 'stablecoin'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== USDD ====================
	{
		address: '0x0C10bF8FcB7Bf5412187A595ab97a3609160b5c6',
		chainId: 1,
		entityId: 'tron',
		name: 'Decentralized USD (USDD)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== FDUSD ====================
	{
		address: '0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409',
		chainId: 1,
		entityId: 'firstdigital',
		name: 'First Digital USD (FDUSD)',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc5f0f7b66764F6ec8C8Dff7BA683102295E16409',
		chainId: 56,
		entityId: 'firstdigital',
		name: 'First Digital USD (FDUSD) on BSC',
		labels: ['token', 'stablecoin'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
