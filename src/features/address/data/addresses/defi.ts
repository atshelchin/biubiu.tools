/**
 * DeFi protocol addresses - DEX, Lending, Staking, Bridges
 * 数据来源：官方文档、Etherscan 验证
 */

import type { LabeledAddress } from '../../types';

export const defiAddresses: LabeledAddress[] = [
	// ==================== Uniswap ====================
	{
		address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap V2 Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
		chainId: 42161,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
		chainId: 10,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
		chainId: 137,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter02',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
		chainId: 42161,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter02',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
		chainId: 10,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter02',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
		chainId: 137,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter02',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap V3 Factory',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
		chainId: 42161,
		entityId: 'uniswap',
		name: 'Uniswap V3 Factory',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
		chainId: 10,
		entityId: 'uniswap',
		name: 'Uniswap V3 Factory',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
		chainId: 137,
		entityId: 'uniswap',
		name: 'Uniswap V3 Factory',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
		chainId: 8453,
		entityId: 'uniswap',
		name: 'Uniswap V3 Factory',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap V3 Positions NFT',
		labels: ['dex', 'defi', 'nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
		chainId: 42161,
		entityId: 'uniswap',
		name: 'Uniswap V3 Positions NFT',
		labels: ['dex', 'defi', 'nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
		chainId: 10,
		entityId: 'uniswap',
		name: 'Uniswap V3 Positions NFT',
		labels: ['dex', 'defi', 'nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
		chainId: 137,
		entityId: 'uniswap',
		name: 'Uniswap V3 Positions NFT',
		labels: ['dex', 'defi', 'nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
		chainId: 8453,
		entityId: 'uniswap',
		name: 'Uniswap V3 Positions NFT',
		labels: ['dex', 'defi', 'nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap Universal Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
		chainId: 42161,
		entityId: 'uniswap',
		name: 'Uniswap Universal Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
		chainId: 10,
		entityId: 'uniswap',
		name: 'Uniswap Universal Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
		chainId: 137,
		entityId: 'uniswap',
		name: 'Uniswap Universal Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
		chainId: 8453,
		entityId: 'uniswap',
		name: 'Uniswap Universal Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== SushiSwap ====================
	{
		address: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
		chainId: 1,
		entityId: 'sushiswap',
		name: 'SushiSwap Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
		chainId: 1,
		entityId: 'sushiswap',
		name: 'SushiSwap Factory',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd',
		chainId: 1,
		entityId: 'sushiswap',
		name: 'SushiSwap MasterChef',
		labels: ['defi', 'yield', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Curve ====================
	{
		address: '0xD51a44d3FaE010294C616388b506AcdA1bfAAE46',
		chainId: 1,
		entityId: 'curve',
		name: 'Curve Tricrypto2 Pool',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
		chainId: 1,
		entityId: 'curve',
		name: 'Curve 3Pool',
		labels: ['dex', 'defi', 'stablecoin', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
		chainId: 1,
		entityId: 'curve',
		name: 'Curve stETH Pool',
		labels: ['dex', 'defi', 'liquid-staking', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x99a58482BD75cbab83b27EC03CA68fF489b5788f',
		chainId: 1,
		entityId: 'curve',
		name: 'Curve Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== 1inch ====================
	{
		address: '0x1111111254EEB25477B68fb85Ed929f73A960582',
		chainId: 1,
		entityId: 'oneinch',
		name: '1inch AggregationRouterV5',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1111111254EEB25477B68fb85Ed929f73A960582',
		chainId: 42161,
		entityId: 'oneinch',
		name: '1inch AggregationRouterV5',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1111111254EEB25477B68fb85Ed929f73A960582',
		chainId: 10,
		entityId: 'oneinch',
		name: '1inch AggregationRouterV5',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1111111254EEB25477B68fb85Ed929f73A960582',
		chainId: 137,
		entityId: 'oneinch',
		name: '1inch AggregationRouterV5',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1111111254EEB25477B68fb85Ed929f73A960582',
		chainId: 56,
		entityId: 'oneinch',
		name: '1inch AggregationRouterV5',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1111111254EEB25477B68fb85Ed929f73A960582',
		chainId: 43114,
		entityId: 'oneinch',
		name: '1inch AggregationRouterV5',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x111111125421cA6dc452d289314280a0f8842A65',
		chainId: 1,
		entityId: 'oneinch',
		name: '1inch AggregationRouterV6',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x111111125421cA6dc452d289314280a0f8842A65',
		chainId: 42161,
		entityId: 'oneinch',
		name: '1inch AggregationRouterV6',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x111111125421cA6dc452d289314280a0f8842A65',
		chainId: 10,
		entityId: 'oneinch',
		name: '1inch AggregationRouterV6',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x111111125421cA6dc452d289314280a0f8842A65',
		chainId: 137,
		entityId: 'oneinch',
		name: '1inch AggregationRouterV6',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x111111125421cA6dc452d289314280a0f8842A65',
		chainId: 8453,
		entityId: 'oneinch',
		name: '1inch AggregationRouterV6',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Balancer ====================
	{
		address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
		chainId: 1,
		entityId: 'balancer',
		name: 'Balancer Vault',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
		chainId: 42161,
		entityId: 'balancer',
		name: 'Balancer Vault',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
		chainId: 10,
		entityId: 'balancer',
		name: 'Balancer Vault',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
		chainId: 137,
		entityId: 'balancer',
		name: 'Balancer Vault',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Aave ====================
	{
		address: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
		chainId: 1,
		entityId: 'aave',
		name: 'Aave V2 Lending Pool',
		labels: ['defi', 'lending', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
		chainId: 1,
		entityId: 'aave',
		name: 'Aave V3 Pool',
		labels: ['defi', 'lending', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
		chainId: 1,
		entityId: 'aave',
		name: 'Aave V3 Pool Addresses Provider',
		labels: ['defi', 'lending', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
		chainId: 42161,
		entityId: 'aave',
		name: 'Aave V3 Pool (Arbitrum)',
		labels: ['defi', 'lending', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
		chainId: 10,
		entityId: 'aave',
		name: 'Aave V3 Pool (Optimism)',
		labels: ['defi', 'lending', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
		chainId: 137,
		entityId: 'aave',
		name: 'Aave V3 Pool (Polygon)',
		labels: ['defi', 'lending', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
		chainId: 43114,
		entityId: 'aave',
		name: 'Aave V3 Pool (Avalanche)',
		labels: ['defi', 'lending', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Compound ====================
	{
		address: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
		chainId: 1,
		entityId: 'compound',
		name: 'Compound Comptroller',
		labels: ['defi', 'lending', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
		chainId: 1,
		entityId: 'compound',
		name: 'Compound V3 cUSDCv3',
		labels: ['defi', 'lending', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA17581A9E3356d9A858b789D68B4d866e593aE94',
		chainId: 1,
		entityId: 'compound',
		name: 'Compound V3 cWETHv3',
		labels: ['defi', 'lending', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== MakerDAO ====================
	{
		address: '0x9759A6Ac90977b93B58547b4A71c78317f391A28',
		chainId: 1,
		entityId: 'makerdao',
		name: 'MakerDAO DSR Manager',
		labels: ['defi', 'lending', 'stablecoin', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
		chainId: 1,
		entityId: 'makerdao',
		name: 'MakerDAO Vat',
		labels: ['defi', 'lending', 'stablecoin', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Lido ====================
	{
		address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
		chainId: 1,
		entityId: 'lido',
		name: 'Lido stETH',
		labels: ['defi', 'liquid-staking', 'token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
		chainId: 1,
		entityId: 'lido',
		name: 'Lido wstETH',
		labels: ['defi', 'liquid-staking', 'token', 'wrapped', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1',
		chainId: 1,
		entityId: 'lido',
		name: 'Lido Withdrawal Queue',
		labels: ['defi', 'liquid-staking', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Rocket Pool ====================
	{
		address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
		chainId: 1,
		entityId: 'rocketpool',
		name: 'Rocket Pool rETH',
		labels: ['defi', 'liquid-staking', 'token', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46',
		chainId: 1,
		entityId: 'rocketpool',
		name: 'Rocket Pool Storage',
		labels: ['defi', 'liquid-staking', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== EigenLayer ====================
	{
		address: '0x858646372CC42E1A627fcE94aa7A7033e7CF075A',
		chainId: 1,
		entityId: 'eigenlayer',
		name: 'EigenLayer Strategy Manager',
		labels: ['defi', 'liquid-staking', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A',
		chainId: 1,
		entityId: 'eigenlayer',
		name: 'EigenLayer Delegation Manager',
		labels: ['defi', 'liquid-staking', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Bridges ====================
	{
		address: '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
		chainId: 1,
		entityId: 'arbitrumbridge',
		name: 'Arbitrum Bridge',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
		chainId: 1,
		entityId: 'arbitrumbridge',
		name: 'Arbitrum Delayed Inbox',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
		chainId: 1,
		entityId: 'optimismbridge',
		name: 'Optimism Bridge',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
		chainId: 1,
		entityId: 'base',
		name: 'Base Bridge Portal',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
		chainId: 1,
		entityId: 'polygonbridge',
		name: 'Polygon zkEVM Bridge',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x32400084C286CF3E17e7B677ea9583e60a000324',
		chainId: 1,
		entityId: 'zksync',
		name: 'zkSync Era Diamond',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
		chainId: 1,
		entityId: 'scroll',
		name: 'Scroll Bridge',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5a7749f83b81B301cAb5f48EB8516B986DAef23D',
		chainId: 1,
		entityId: 'across',
		name: 'Across SpokePool',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
		chainId: 1,
		entityId: 'stargate',
		name: 'Stargate Router',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
		chainId: 42161,
		entityId: 'stargate',
		name: 'Stargate Router',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
		chainId: 10,
		entityId: 'stargate',
		name: 'Stargate Router',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
		chainId: 137,
		entityId: 'stargate',
		name: 'Stargate Router',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
		chainId: 56,
		entityId: 'stargate',
		name: 'Stargate Router',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
		chainId: 43114,
		entityId: 'stargate',
		name: 'Stargate Router',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
		chainId: 1,
		entityId: 'wormhole',
		name: 'Wormhole Bridge',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Chainlink ====================
	{
		address: '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf',
		chainId: 1,
		entityId: 'chainlink',
		name: 'Chainlink Staking Pool',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
		chainId: 1,
		entityId: 'chainlink',
		name: 'Chainlink ETH/USD Feed',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Safe (Gnosis Safe) ====================
	{
		address: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
		chainId: 1,
		entityId: 'safe',
		name: 'Safe Proxy Factory',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
		chainId: 42161,
		entityId: 'safe',
		name: 'Safe Proxy Factory',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
		chainId: 10,
		entityId: 'safe',
		name: 'Safe Proxy Factory',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
		chainId: 137,
		entityId: 'safe',
		name: 'Safe Proxy Factory',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
		chainId: 56,
		entityId: 'safe',
		name: 'Safe Proxy Factory',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
		chainId: 100,
		entityId: 'safe',
		name: 'Safe Proxy Factory',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
		chainId: 8453,
		entityId: 'safe',
		name: 'Safe Proxy Factory',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
		chainId: 1,
		entityId: 'safe',
		name: 'Safe Singleton',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
		chainId: 42161,
		entityId: 'safe',
		name: 'Safe Singleton',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
		chainId: 10,
		entityId: 'safe',
		name: 'Safe Singleton',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
		chainId: 137,
		entityId: 'safe',
		name: 'Safe Singleton',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
		chainId: 56,
		entityId: 'safe',
		name: 'Safe Singleton',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
		chainId: 100,
		entityId: 'safe',
		name: 'Safe Singleton',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
		chainId: 8453,
		entityId: 'safe',
		name: 'Safe Singleton',
		labels: ['defi', 'multisig', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== ENS ====================
	{
		address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
		chainId: 1,
		entityId: 'ens',
		name: 'ENS Registry',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x253553366Da8546fC250F225fe3d25d0C782303b',
		chainId: 1,
		entityId: 'ens',
		name: 'ENS ETH Registrar Controller',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
		chainId: 1,
		entityId: 'ens',
		name: 'ENS Public Resolver',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
