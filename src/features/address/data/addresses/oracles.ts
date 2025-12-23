/**
 * Oracle and data provider addresses
 * 数据来源: Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const oracleAddresses: LabeledAddress[] = [
	// ==================== Chainlink ====================
	{
		address: '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf',
		chainId: 1,
		entityId: 'chainlink',
		name: 'Chainlink Feed Registry',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
		chainId: 1,
		entityId: 'chainlink',
		name: 'Chainlink ETH/USD',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xAc559F25B1619171CbC396a50854A3240b6A4e99',
		chainId: 1,
		entityId: 'chainlink',
		name: 'Chainlink BTC/USD',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
		chainId: 1,
		entityId: 'chainlink',
		name: 'Chainlink USDC/USD',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
		chainId: 1,
		entityId: 'chainlink',
		name: 'Chainlink Token (LINK)',
		labels: ['token', 'oracle'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x271682DEB8C4E0901D1a1550aD2e64D568E69909',
		chainId: 1,
		entityId: 'chainlink',
		name: 'Chainlink VRF Coordinator V2',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
		chainId: 42161,
		entityId: 'chainlink',
		name: 'Chainlink Token (LINK) on Arbitrum',
		labels: ['token', 'oracle'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6',
		chainId: 10,
		entityId: 'chainlink',
		name: 'Chainlink Token (LINK) on Optimism',
		labels: ['token', 'oracle'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xb0897686c545045aFc77CF20eC7A532E3120E0F1',
		chainId: 137,
		entityId: 'chainlink',
		name: 'Chainlink Token (LINK) on Polygon',
		labels: ['token', 'oracle'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Pyth Network ====================
	{
		address: '0x4305FB66699C3B2702D4d05CF36551390A4c69C6',
		chainId: 1,
		entityId: 'pyth',
		name: 'Pyth Oracle',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xff1a0f4744e8582DF1aE09D5611b887B6a12925C',
		chainId: 42161,
		entityId: 'pyth',
		name: 'Pyth Oracle on Arbitrum',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xff1a0f4744e8582DF1aE09D5611b887B6a12925C',
		chainId: 10,
		entityId: 'pyth',
		name: 'Pyth Oracle on Optimism',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA2aa501b19aff244D90cc15a4Cf739D2725B5729',
		chainId: 8453,
		entityId: 'pyth',
		name: 'Pyth Oracle on Base',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Tellor ====================
	{
		address: '0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0',
		chainId: 1,
		entityId: 'tellor',
		name: 'Tellor Oracle',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5',
		chainId: 1,
		entityId: 'tellor',
		name: 'Tellor Tributes (TRB)',
		labels: ['token', 'oracle'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== API3 ====================
	{
		address: '0x0b38210ea11411557c13457D4dA7dC6ea731B88a',
		chainId: 1,
		entityId: 'api3',
		name: 'API3 Token',
		labels: ['token', 'oracle'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Band Protocol ====================
	{
		address: '0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55',
		chainId: 1,
		entityId: 'band',
		name: 'Band Protocol Token',
		labels: ['token', 'oracle'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== UMA Protocol ====================
	{
		address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
		chainId: 1,
		entityId: 'uma',
		name: 'UMA Token',
		labels: ['token', 'oracle'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA0Ae6609447e57a42c51B50EAe921D701823FFAe',
		chainId: 1,
		entityId: 'uma',
		name: 'UMA Optimistic Oracle V2',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== RedStone ====================
	{
		address: '0x981AB570AC289938F296b975C524B66FBF1B8774',
		chainId: 1,
		entityId: 'redstone',
		name: 'RedStone Price Feed',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Chronicle ====================
	{
		address: '0x64DE91F5A373Cd4c28de3600cB34C7C6cE410C85',
		chainId: 1,
		entityId: 'chronicle',
		name: 'Chronicle ETH/USD Oracle',
		labels: ['oracle', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
