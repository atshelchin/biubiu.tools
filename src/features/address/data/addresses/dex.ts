/**
 * DEX and AMM addresses
 * 数据来源：Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const dexAddresses: LabeledAddress[] = [
	// ==================== Uniswap V3 ====================
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
		address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap V3 NonfungiblePositionManager',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	// Uniswap on Arbitrum
	{
		address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
		chainId: 42161,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter on Arbitrum',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
		chainId: 42161,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter02 on Arbitrum',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	// Uniswap on Optimism
	{
		address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
		chainId: 10,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter on Optimism',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	// Uniswap on Base
	{
		address: '0x2626664c2603336E57B271c5C0b26F421741e481',
		chainId: 8453,
		entityId: 'uniswap',
		name: 'Uniswap V3 SwapRouter02 on Base',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Uniswap Universal Router ====================
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
		name: 'Uniswap Universal Router on Arbitrum',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
		chainId: 10,
		entityId: 'uniswap',
		name: 'Uniswap Universal Router on Optimism',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
		chainId: 8453,
		entityId: 'uniswap',
		name: 'Uniswap Universal Router on Base',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== SushiSwap ====================
	{
		address: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
		chainId: 1,
		entityId: 'sushi',
		name: 'SushiSwap Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
		chainId: 1,
		entityId: 'sushi',
		name: 'SushiSwap Factory',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
		chainId: 42161,
		entityId: 'sushi',
		name: 'SushiSwap Router on Arbitrum',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Curve Finance ====================
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
	{
		address: '0xF0d4c12A5768D806021F80a262B4d39d26C58b8D',
		chainId: 1,
		entityId: 'curve',
		name: 'Curve CRV/ETH Pool',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
		chainId: 1,
		entityId: 'curve',
		name: 'Curve 3pool',
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
		name: 'Balancer V2 Vault',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
		chainId: 42161,
		entityId: 'balancer',
		name: 'Balancer V2 Vault on Arbitrum',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
		chainId: 137,
		entityId: 'balancer',
		name: 'Balancer V2 Vault on Polygon',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== 1inch ====================
	{
		address: '0x1111111254EEB25477B68fb85Ed929f73A960582',
		chainId: 1,
		entityId: '1inch',
		name: '1inch Aggregation Router V5',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1111111254EEB25477B68fb85Ed929f73A960582',
		chainId: 42161,
		entityId: '1inch',
		name: '1inch Aggregation Router V5 on Arbitrum',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1111111254EEB25477B68fb85Ed929f73A960582',
		chainId: 10,
		entityId: '1inch',
		name: '1inch Aggregation Router V5 on Optimism',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== 0x Protocol ====================
	{
		address: '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
		chainId: 1,
		entityId: '0x',
		name: '0x Exchange Proxy',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
		chainId: 42161,
		entityId: '0x',
		name: '0x Exchange Proxy on Arbitrum',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Paraswap ====================
	{
		address: '0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57',
		chainId: 1,
		entityId: 'paraswap',
		name: 'Paraswap Augustus V6',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Kyber Network ====================
	{
		address: '0x6131B5fae19EA4f9D964eAc0408E4408b66337b5',
		chainId: 1,
		entityId: 'kyber',
		name: 'KyberSwap Aggregator',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== CoW Protocol ====================
	{
		address: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
		chainId: 1,
		entityId: 'cow',
		name: 'CoW Protocol Settlement',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Trader Joe ====================
	{
		address: '0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30',
		chainId: 43114,
		entityId: 'traderjoe',
		name: 'Trader Joe V2.1 Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30',
		chainId: 42161,
		entityId: 'traderjoe',
		name: 'Trader Joe V2.1 Router on Arbitrum',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== PancakeSwap ====================
	{
		address: '0x13f4EA83D0bd40E75C8222255bc855a974568Dd4',
		chainId: 56,
		entityId: 'pancakeswap',
		name: 'PancakeSwap SmartRouter',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
		chainId: 1,
		entityId: 'pancakeswap',
		name: 'PancakeSwap SmartRouter on Ethereum',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb',
		chainId: 42161,
		entityId: 'pancakeswap',
		name: 'PancakeSwap SmartRouter on Arbitrum',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Camelot ====================
	{
		address: '0xc873fEcbd354f5A56E00E710B90EF4201db2448d',
		chainId: 42161,
		entityId: 'camelot',
		name: 'Camelot Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== GMX ====================
	{
		address: '0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064',
		chainId: 42161,
		entityId: 'gmx',
		name: 'GMX Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x489ee077994B6658eAfA855C308275EAd8097C4A',
		chainId: 42161,
		entityId: 'gmx',
		name: 'GMX Vault',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Velodrome ====================
	{
		address: '0xa062aE8A9c5e11aaA026fc2670B0D65cCc8B2858',
		chainId: 10,
		entityId: 'velodrome',
		name: 'Velodrome V2 Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Aerodrome (Base) ====================
	{
		address: '0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43',
		chainId: 8453,
		entityId: 'aerodrome',
		name: 'Aerodrome Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Maverick ====================
	{
		address: '0x4a585E0f7C18E2C414221D6402652d5e0990E5F8',
		chainId: 1,
		entityId: 'maverick',
		name: 'Maverick V2 Router',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== DODO ====================
	{
		address: '0xa356867fDCEa8e71AEaF87805808803806231FdC',
		chainId: 1,
		entityId: 'dodo',
		name: 'DODO Approve',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Odos ====================
	{
		address: '0xCf5540fFFCdC3d510B18bFfA6098500E9a0B8f8f',
		chainId: 1,
		entityId: 'odos',
		name: 'Odos Router V2',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa669e7A0d4b3e4Fa48af2dE86BD4CD7126Be4e13',
		chainId: 42161,
		entityId: 'odos',
		name: 'Odos Router V2 on Arbitrum',
		labels: ['dex', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
