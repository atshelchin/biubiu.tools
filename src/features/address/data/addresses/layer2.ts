/**
 * Layer 2 Network Addresses - L2 bridges, rollups, and infrastructure
 * 数据来源: 官方文档、Etherscan、公开资料
 */

import type { LabeledAddress } from '../../types';

export const layer2Addresses: LabeledAddress[] = [
	// ==================== Arbitrum ====================
	{
		address: '0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
		chainId: 1,
		name: 'Arbitrum One Bridge',
		labels: ['bridge'],
		entityId: 'arbitrum',
		riskLevel: 'safe',
		description: 'Arbitrum One official bridge contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
		chainId: 1,
		name: 'Arbitrum Delayed Inbox',
		labels: ['bridge', 'contract'],
		entityId: 'arbitrum',
		riskLevel: 'safe',
		description: 'Arbitrum One delayed inbox',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6',
		chainId: 1,
		name: 'Arbitrum Outbox',
		labels: ['bridge', 'contract'],
		entityId: 'arbitrum',
		riskLevel: 'safe',
		description: 'Arbitrum One outbox for L2->L1 messages',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xcEe284F754E854890e311e3280b767F80797180d',
		chainId: 1,
		name: 'Arbitrum: Sequencer Inbox',
		labels: ['contract'],
		entityId: 'arbitrum',
		riskLevel: 'safe',
		description: 'Arbitrum One sequencer inbox',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC1Ebd02f738644983b6C4B2d440b8e77DdE276Bd',
		chainId: 1,
		name: 'Arbitrum Nova Bridge',
		labels: ['bridge'],
		entityId: 'arbitrum',
		riskLevel: 'safe',
		description: 'Arbitrum Nova bridge contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Optimism ====================
	{
		address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
		chainId: 1,
		name: 'Optimism Gateway',
		labels: ['bridge'],
		entityId: 'optimism',
		riskLevel: 'safe',
		description: 'Optimism L1 Standard Bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
		chainId: 1,
		name: 'Optimism Portal',
		labels: ['bridge', 'contract'],
		entityId: 'optimism',
		riskLevel: 'safe',
		description: 'Optimism Portal for deposits/withdrawals',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5E4e65926BA27467555EB562121fac00D24E9dD2',
		chainId: 1,
		name: 'Optimism: Cross Domain Messenger',
		labels: ['contract'],
		entityId: 'optimism',
		riskLevel: 'safe',
		description: 'Optimism L1 cross domain messenger',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xdfe97868233d1aa22e815a266982f2cf17685a27',
		chainId: 1,
		name: 'Optimism: L2 Output Oracle',
		labels: ['contract'],
		entityId: 'optimism',
		riskLevel: 'safe',
		description: 'Optimism L2 output oracle',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Base ====================
	{
		address: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
		chainId: 1,
		name: 'Base Portal',
		labels: ['bridge'],
		entityId: 'base',
		riskLevel: 'safe',
		description: 'Base L1 Optimism Portal',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
		chainId: 1,
		name: 'Base: Standard Bridge',
		labels: ['bridge'],
		entityId: 'base',
		riskLevel: 'safe',
		description: 'Base L1 Standard Bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x866E82a600A1414e583f7F13623F1aC5d58b0Afa',
		chainId: 1,
		name: 'Base: L2 Output Oracle',
		labels: ['contract'],
		entityId: 'base',
		riskLevel: 'safe',
		description: 'Base L2 output oracle',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== zkSync Era ====================
	{
		address: '0x32400084C286CF3E17e7B677ea9583e60a000324',
		chainId: 1,
		name: 'zkSync Era Diamond Proxy',
		labels: ['bridge', 'contract'],
		entityId: 'zksync',
		riskLevel: 'safe',
		description: 'zkSync Era main contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063',
		chainId: 1,
		name: 'zkSync Era: L1 ERC20 Bridge',
		labels: ['bridge'],
		entityId: 'zksync',
		riskLevel: 'safe',
		description: 'zkSync Era ERC20 bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Polygon ====================
	{
		address: '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77',
		chainId: 1,
		name: 'Polygon Bridge',
		labels: ['bridge'],
		entityId: 'polygon',
		riskLevel: 'safe',
		description: 'Polygon PoS bridge contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x401F6c983eA34274ec46f84D70b31C151321188b',
		chainId: 1,
		name: 'Polygon Plasma Bridge',
		labels: ['bridge'],
		entityId: 'polygon',
		riskLevel: 'safe',
		description: 'Polygon Plasma bridge contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
		chainId: 1,
		name: 'Polygon zkEVM Bridge',
		labels: ['bridge'],
		entityId: 'polygon',
		riskLevel: 'safe',
		description: 'Polygon zkEVM bridge contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Starknet ====================
	{
		address: '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
		chainId: 1,
		name: 'Starknet Core Contract',
		labels: ['contract'],
		entityId: 'starknet',
		riskLevel: 'safe',
		description: 'Starknet core contract on Ethereum',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419',
		chainId: 1,
		name: 'Starknet ETH Bridge',
		labels: ['bridge'],
		entityId: 'starknet',
		riskLevel: 'safe',
		description: 'Starknet ETH bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0437465dfb5B79726e35F08559B0cBea55bb585C',
		chainId: 1,
		name: 'Starknet USDC Bridge',
		labels: ['bridge'],
		entityId: 'starknet',
		riskLevel: 'safe',
		description: 'Starknet USDC bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Scroll ====================
	{
		address: '0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
		chainId: 1,
		name: 'Scroll Gateway Router',
		labels: ['bridge'],
		riskLevel: 'safe',
		description: 'Scroll L1 gateway router',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367',
		chainId: 1,
		name: 'Scroll Messenger',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'Scroll L1 messenger',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Linea ====================
	{
		address: '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
		chainId: 1,
		name: 'Linea Bridge',
		labels: ['bridge'],
		riskLevel: 'safe',
		description: 'Linea L1 bridge contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec',
		chainId: 1,
		name: 'Linea Message Service',
		labels: ['contract'],
		riskLevel: 'safe',
		description: 'Linea L1 message service',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Mantle ====================
	{
		address: '0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012',
		chainId: 1,
		name: 'Mantle L1 Bridge',
		labels: ['bridge'],
		riskLevel: 'safe',
		description: 'Mantle L1 standard bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Blast ====================
	{
		address: '0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d',
		chainId: 1,
		name: 'Blast Bridge',
		labels: ['bridge'],
		riskLevel: 'safe',
		description: 'Blast L1 bridge contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Mode ====================
	{
		address: '0x735aDBbE72226BD52e818E7181953f42E3b0FF21',
		chainId: 1,
		name: 'Mode Portal',
		labels: ['bridge'],
		riskLevel: 'safe',
		description: 'Mode Network L1 portal',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Taiko ====================
	{
		address: '0x06a9Ab27c7e2255df1815E6CC0168d7755Feb19a',
		chainId: 1,
		name: 'Taiko Bridge',
		labels: ['bridge'],
		riskLevel: 'safe',
		description: 'Taiko L1 bridge contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
