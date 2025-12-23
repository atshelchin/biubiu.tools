/**
 * Notable addresses - 知名人物钱包、基金会、DAO、特殊地址
 * 数据来源：公开信息、官方公告
 */

import type { LabeledAddress } from '../../types';

export const notableAddresses: LabeledAddress[] = [
	// ==================== 特殊系统地址 ====================
	{
		address: '0x0000000000000000000000000000000000000000',
		chainId: 1,
		entityId: 'system',
		name: 'Null Address (Zero Address)',
		labels: ['null', 'burn'],
		riskLevel: 'neutral',
		description: 'The zero address, often used for burning tokens',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x000000000000000000000000000000000000dEaD',
		chainId: 1,
		entityId: 'system',
		name: 'Dead Address (Burn Address)',
		labels: ['burn'],
		riskLevel: 'neutral',
		description: 'Common burn address used to permanently remove tokens from circulation',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
		chainId: 1,
		entityId: 'system',
		name: 'Native ETH Placeholder',
		labels: ['null'],
		riskLevel: 'neutral',
		description: 'Placeholder address used to represent native ETH in smart contracts',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Ethereum Foundation ====================
	{
		address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
		chainId: 1,
		entityId: 'ethereumfoundation',
		name: 'Ethereum Foundation',
		labels: ['foundation', 'multisig'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x9eE457023bB3De16D51A003a247BaEaD7fce313D',
		chainId: 1,
		entityId: 'ethereumfoundation',
		name: 'Ethereum Foundation Wallet 2',
		labels: ['foundation'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Vitalik Buterin ====================
	{
		address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		chainId: 1,
		entityId: 'vitalik',
		name: 'Vitalik Buterin (vitalik.eth)',
		labels: ['whale', 'eoa'],
		riskLevel: 'safe',
		description: 'Primary wallet of Ethereum co-founder Vitalik Buterin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x220866B1A2219f40e72f5c628B65D54268cA3A9D',
		chainId: 1,
		entityId: 'vitalik',
		name: 'Vitalik Buterin Wallet 2',
		labels: ['whale', 'eoa'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6',
		chainId: 1,
		entityId: 'vitalik',
		name: 'Vitalik Buterin Wallet 3',
		labels: ['whale', 'eoa'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Investment Funds ====================
	{
		address: '0x0716a17FBAeE714f1E6aB0f9d59edbC5f09815C0',
		chainId: 1,
		entityId: 'paradigm',
		name: 'Paradigm',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6B44ba0a126a2A1a8aa6cD1AdeeD002e141Bcd44',
		chainId: 1,
		entityId: 'paradigm',
		name: 'Paradigm Wallet 2',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x05e793cE0C6027323Ac150F6d45C2344d28B6019',
		chainId: 1,
		entityId: 'a16z',
		name: 'a16z Crypto',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x66B870dDf78c975af5Cd8EDC6De25eca81791DE1',
		chainId: 1,
		entityId: 'a16z',
		name: 'a16z Crypto Wallet 2',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xCE1F6ec212c059F0C2b0e08D0b9D8FB8Fb3B5e12',
		chainId: 1,
		entityId: 'jump',
		name: 'Jump Trading',
		labels: ['whale', 'smart-money', 'mev'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x00000000AE347930bD1E7B0F35588b92280f9e75',
		chainId: 1,
		entityId: 'wintermute',
		name: 'Wintermute',
		labels: ['whale', 'smart-money', 'mev'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4f3a120E72C76c22ae802D129F599BFDbc31cb81',
		chainId: 1,
		entityId: 'wintermute',
		name: 'Wintermute Wallet 2',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Protocol Treasury / DAO ====================

	{
		address: '0x25dCf7b4c93D9c0e5E2f5B2E48cf4e1Aeb2C8C4F',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap Grants',
		labels: ['dao'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c',
		chainId: 1,
		entityId: 'lido',
		name: 'Lido DAO Treasury',
		labels: ['dao', 'multisig'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	{
		address: '0x0048a3c9f81ECB2A02F20b0e1dA0caC9C17B6D2d',
		chainId: 1,
		entityId: 'aave',
		name: 'Aave Collector',
		labels: ['dao'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	{
		address: '0x4B4e140D1f131fdaD6fb59C13AF796fD194e4135',
		chainId: 1,
		entityId: 'arbitrum',
		name: 'Arbitrum DAO Treasury',
		labels: ['dao', 'multisig'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x2501c477D0A35545a387Aa4A3EEe4292A9a8B3F0',
		chainId: 10,
		entityId: 'optimism',
		name: 'Optimism Foundation',
		labels: ['foundation', 'multisig'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== L2 Foundations ====================
	{
		address: '0xFa7D2a996Ac6350f4b56C043112Da0366a59b74c',
		chainId: 42161,
		entityId: 'arbitrum',
		name: 'Arbitrum Foundation',
		labels: ['foundation', 'multisig'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBC3ed535CB598CB3a70c09e7e3f6a0a4A5f8E3c0',
		chainId: 8453,
		entityId: 'base',
		name: 'Base Team',
		labels: ['foundation'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== MEV Bots (Known) ====================
	{
		address: '0x000000000035B5e5ad9019092C665357240f594e',
		chainId: 1,
		entityId: 'unknown',
		name: 'jaredfromsubway.eth',
		labels: ['mev', 'whale'],
		riskLevel: 'warning',
		description: 'Famous MEV bot known for sandwich attacks',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6F1cDbBb4d53d226CF4B917bF768B94acbAB6168',
		chainId: 1,
		entityId: 'unknown',
		name: 'Flashbots Builder',
		labels: ['mev', 'contract'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Multi-chain Deployers ====================
	{
		address: '0x4e59b44847b379578588920cA78FbF26c0B4956C',
		chainId: 1,
		entityId: 'system',
		name: 'CREATE2 Deployer',
		labels: ['deployer', 'contract'],
		riskLevel: 'safe',
		description: 'Deterministic deployment proxy used across chains',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xce0042B868300000d44A59004Da54A005ffdcf9f',
		chainId: 1,
		entityId: 'system',
		name: 'Arachnid CREATE2 Factory',
		labels: ['deployer', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Early Ethereum Contributors ====================
	{
		address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
		chainId: 1,
		entityId: 'vitalik',
		name: 'Vitalik Cold Wallet (Early)',
		labels: ['whale', 'genesis'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963',
		chainId: 1,
		entityId: 'unknown',
		name: 'Poloniex Legacy',
		labels: ['exchange', 'cex'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
