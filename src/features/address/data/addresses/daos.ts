/**
 * DAO Addresses - Governance tokens and treasury wallets
 * 数据来源: 官方文档、Etherscan
 */

import type { LabeledAddress } from '../../types';

export const daoAddresses: LabeledAddress[] = [
	// ==================== Uniswap DAO ====================
	{
		address: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
		chainId: 1,
		name: 'Uniswap Timelock',
		labels: ['dao', 'contract'],
		entityId: 'uniswap',
		riskLevel: 'safe',
		description: 'Uniswap governance timelock',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
		chainId: 1,
		name: 'Uniswap Treasury',
		labels: ['dao', 'foundation'],
		entityId: 'uniswap',
		riskLevel: 'safe',
		description: 'Uniswap DAO treasury',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Aave DAO ====================
	{
		address: '0xEC568fffba86c094cf06b22134B23074DFE2252c',
		chainId: 1,
		name: 'Aave Governance V2',
		labels: ['dao', 'contract'],
		entityId: 'aave',
		riskLevel: 'safe',
		description: 'Aave governance contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x25F2226B597E8F9514B3F68F00f494cF4f286491',
		chainId: 1,
		name: 'Aave Treasury',
		labels: ['dao', 'foundation'],
		entityId: 'aave',
		riskLevel: 'safe',
		description: 'Aave DAO treasury',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c',
		chainId: 1,
		name: 'Aave Ecosystem Reserve',
		labels: ['dao', 'foundation'],
		entityId: 'aave',
		riskLevel: 'safe',
		description: 'Aave ecosystem reserve',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Compound DAO ====================
	{
		address: '0xc0Da02939E1441F497fd74F78cE7Decb17B66529',
		chainId: 1,
		name: 'Compound Governor Bravo',
		labels: ['dao', 'contract'],
		entityId: 'compound',
		riskLevel: 'safe',
		description: 'Compound governance contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B',
		chainId: 1,
		name: 'Compound Comptroller',
		labels: ['dao', 'defi', 'contract'],
		entityId: 'compound',
		riskLevel: 'safe',
		description: 'Compound Comptroller (admin)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== MakerDAO ====================
	{
		address: '0x0a3f6849f78076aefaDf113F5BED87720274dDC0',
		chainId: 1,
		name: 'MakerDAO DSChief',
		labels: ['dao', 'contract'],
		entityId: 'makerdao',
		riskLevel: 'safe',
		description: 'MakerDAO governance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBE8E3e3618f7474F8cB1d074A26afFef007E98FB',
		chainId: 1,
		name: 'MakerDAO Pause Proxy',
		labels: ['dao', 'contract'],
		entityId: 'makerdao',
		riskLevel: 'safe',
		description: 'MakerDAO executive actions',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Curve DAO ====================
	{
		address: '0x40907540d8a6C65c637785e8f8B742ae6b0b9968',
		chainId: 1,
		name: 'Curve DAO',
		labels: ['dao', 'contract'],
		entityId: 'curve',
		riskLevel: 'safe',
		description: 'Curve DAO voting',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2',
		chainId: 1,
		name: 'Curve Vote Escrow',
		labels: ['dao', 'contract'],
		entityId: 'curve',
		riskLevel: 'safe',
		description: 'veCRV contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Lido DAO ====================
	{
		address: '0x2e59A20f205bB85a89C53f1936454680651E618e',
		chainId: 1,
		name: 'Lido DAO Voting',
		labels: ['dao', 'contract'],
		entityId: 'lido',
		riskLevel: 'safe',
		description: 'Lido DAO voting app',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xb9d7934878b5fb9610b3fe8a5e441e8fad7e293f',
		chainId: 1,
		name: 'Lido DAO Agent',
		labels: ['dao', 'contract'],
		entityId: 'lido',
		riskLevel: 'safe',
		description: 'Lido Aragon agent',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gitcoin DAO ====================
	{
		address: '0xDbD27635A534A3d3169Ef0498beB56fB9c937489',
		chainId: 1,
		name: 'Gitcoin Governor',
		labels: ['dao', 'contract'],
		riskLevel: 'safe',
		description: 'Gitcoin DAO governance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F',
		chainId: 1,
		name: 'GTC Token',
		labels: ['dao', 'token'],
		riskLevel: 'safe',
		description: 'Gitcoin governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== ENS DAO ====================
	{
		address: '0x323A76393544d5ecca80cd6ef2A560C6a395b7E3',
		chainId: 1,
		name: 'ENS Governor',
		labels: ['dao', 'contract'],
		entityId: 'ens',
		riskLevel: 'safe',
		description: 'ENS DAO governance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4f2083f5fBede34C2714aFfb3105539775f7FE64',
		chainId: 1,
		name: 'ENS DAO Wallet',
		labels: ['dao', 'foundation', 'multisig'],
		entityId: 'ens',
		riskLevel: 'safe',
		description: 'ENS DAO multisig wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Arbitrum DAO ====================
	{
		address: '0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9',
		chainId: 42161,
		name: 'Arbitrum DAO Treasury',
		labels: ['dao', 'foundation'],
		entityId: 'arbitrumbridge',
		riskLevel: 'safe',
		description: 'Arbitrum DAO treasury on Arbitrum',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x789fC99093B09aD01C34DC7251D0C89ce743e5a4',
		chainId: 42161,
		name: 'Arbitrum Governor',
		labels: ['dao', 'contract'],
		entityId: 'arbitrumbridge',
		riskLevel: 'safe',
		description: 'Arbitrum DAO governance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Optimism DAO ====================
	{
		address: '0x2501c477D0A35545a387Aa4A3EEe4292A9a8B3F0',
		chainId: 10,
		name: 'Optimism Treasury',
		labels: ['dao', 'foundation'],
		entityId: 'optimismbridge',
		riskLevel: 'safe',
		description: 'Optimism Collective treasury',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xcDF27F107725988f2261Ce2256bDfCdE8B382B10',
		chainId: 10,
		name: 'Optimism Governor',
		labels: ['dao', 'contract'],
		entityId: 'optimismbridge',
		riskLevel: 'safe',
		description: 'Optimism DAO governance',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Nouns DAO ====================
	{
		address: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
		chainId: 1,
		name: 'Nouns DAO Treasury',
		labels: ['dao', 'foundation', 'nft'],
		riskLevel: 'safe',
		description: 'Nouns DAO treasury',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
		chainId: 1,
		name: 'Nouns NFT',
		labels: ['dao', 'nft', 'contract'],
		riskLevel: 'safe',
		description: 'Nouns NFT contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gnosis DAO ====================
	{
		address: '0x0DA0C3e52C977Ed3cBc641fF02DD271c3ED55aFe',
		chainId: 1,
		name: 'Gnosis DAO Treasury',
		labels: ['dao', 'foundation'],
		entityId: 'safe',
		riskLevel: 'safe',
		description: 'GnosisDAO treasury',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Balancer DAO ====================
	{
		address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
		chainId: 1,
		name: 'Balancer Vault',
		labels: ['dao', 'defi', 'contract'],
		entityId: 'balancer',
		riskLevel: 'safe',
		description: 'Balancer V2 vault',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f',
		chainId: 1,
		name: 'Balancer DAO Treasury',
		labels: ['dao', 'foundation'],
		entityId: 'balancer',
		riskLevel: 'safe',
		description: 'Balancer DAO multisig',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== SushiSwap DAO ====================
	{
		address: '0xe94B5EEC1fA96CEecbD33EF5Baa8d00E4493F4f3',
		chainId: 1,
		name: 'Sushi Operations Multisig',
		labels: ['dao', 'multisig'],
		entityId: 'sushiswap',
		riskLevel: 'safe',
		description: 'SushiSwap operations wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== 1inch DAO ====================
	{
		address: '0x7951c7ef839e26F63DA87a42C9a87986507f1c07',
		chainId: 1,
		name: '1inch DAO Treasury',
		labels: ['dao', 'foundation'],
		entityId: '1inch',
		riskLevel: 'safe',
		description: '1inch DAO treasury',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
