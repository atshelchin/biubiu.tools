/**
 * Layer 2 infrastructure and rollup addresses
 * 数据来源：Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const l2InfraAddresses: LabeledAddress[] = [
	// ==================== Arbitrum ====================
	{
		address: '0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
		chainId: 1,
		entityId: 'arbitrum',
		name: 'Arbitrum Delayed Inbox',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x667e23ABd27E623c11d4CC00ca3EC4d0bD63337a',
		chainId: 1,
		entityId: 'arbitrum',
		name: 'Arbitrum Outbox',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	{
		address: '0xC12BA48c781F6e392B49Db2E25Cd0c28cD77531A',
		chainId: 1,
		entityId: 'arbitrum',
		name: 'Arbitrum Sequencer Inbox',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Optimism ====================
	{
		address: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
		chainId: 1,
		entityId: 'optimism',
		name: 'Optimism L1 Cross Domain Messenger',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
		chainId: 1,
		entityId: 'optimism',
		name: 'Optimism Gateway',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
		chainId: 1,
		entityId: 'optimism',
		name: 'Optimism Portal',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4200000000000000000000000000000000000007',
		chainId: 10,
		entityId: 'optimism',
		name: 'L2 Cross Domain Messenger',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Base ====================
	{
		address: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
		chainId: 1,
		entityId: 'base',
		name: 'Base Portal',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x866E82a600A1414e583f7F13623F1aC5d58b0Afa',
		chainId: 1,
		entityId: 'base',
		name: 'Base L1 Standard Bridge',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== zkSync Era ====================
	{
		address: '0x32400084C286CF3E17e7B677ea9583e60a000324',
		chainId: 1,
		entityId: 'zksync',
		name: 'zkSync Era Diamond Proxy',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x57891966931Eb4Bb6FB81430E6cE0A03AAbDe063',
		chainId: 1,
		entityId: 'zksync',
		name: 'zkSync Era Bridge',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5A7d6b2F92C77FAD6CCaBd7EE0624E64907Eaf3E',
		chainId: 1,
		entityId: 'zksync',
		name: 'ZK Token',
		labels: ['token', 'layer2'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Polygon zkEVM ====================
	{
		address: '0x2a3DD3EB832aF982ec71669E178424b10Dca2EDe',
		chainId: 1,
		entityId: 'polygon',
		name: 'Polygon zkEVM Bridge',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5132A183E9F3CB7C848b0AAC5Ae0c4f0491B7aB2',
		chainId: 1,
		entityId: 'polygon',
		name: 'Polygon zkEVM Rollup',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Scroll ====================
	{
		address: '0xa13BAF47339d63B743e7Da8741db5456DAc1E556',
		chainId: 1,
		entityId: 'scroll',
		name: 'Scroll Gateway Router',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367',
		chainId: 1,
		entityId: 'scroll',
		name: 'Scroll Chain',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Linea ====================
	{
		address: '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
		chainId: 1,
		entityId: 'linea',
		name: 'Linea Message Service',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x504A330327A089d8364C4ab3811Ee26976d388ce',
		chainId: 1,
		entityId: 'linea',
		name: 'Linea Token Bridge',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Mantle ====================
	{
		address: '0x95fC37A27a2f68e3A647CDc081F0A89bb47c3012',
		chainId: 1,
		entityId: 'mantle',
		name: 'Mantle Token Bridge',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3c3a81e81dc49A522A592e7622A7E711c06bf354',
		chainId: 1,
		entityId: 'mantle',
		name: 'MNT Token',
		labels: ['token', 'layer2'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Blast ====================
	{
		address: '0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d',
		chainId: 1,
		entityId: 'blast',
		name: 'Blast Bridge',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xb1a5700fA2358173Fe465e6eA4Ff52E36e88E2ad',
		chainId: 1,
		entityId: 'blast',
		name: 'BLAST Token',
		labels: ['token', 'layer2'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Mode ====================
	{
		address: '0x735aDBbE72226BD52e818E7181953f42E3b0FF21',
		chainId: 1,
		entityId: 'mode',
		name: 'Mode Portal',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Manta Pacific ====================
	{
		address: '0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622',
		chainId: 1,
		entityId: 'manta',
		name: 'Manta Pacific Bridge',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x95CeF13441Be50d20cA4558CC0a27B601aC544E5',
		chainId: 1,
		entityId: 'manta',
		name: 'MANTA Token',
		labels: ['token', 'layer2'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Taiko ====================
	{
		address: '0x1670000000000000000000000000000000010001',
		chainId: 1,
		entityId: 'taiko',
		name: 'Taiko L1 Contract',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa9d23408b9bA935c230493c40C73824Df71A0975',
		chainId: 1,
		entityId: 'taiko',
		name: 'TAIKO Token',
		labels: ['token', 'layer2'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Starknet ====================
	{
		address: '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
		chainId: 1,
		entityId: 'starknet',
		name: 'Starknet Core Contract',
		labels: ['layer2', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419',
		chainId: 1,
		entityId: 'starknet',
		name: 'StarkGate ETH Bridge',
		labels: ['layer2', 'bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766',
		chainId: 1,
		entityId: 'starknet',
		name: 'STRK Token',
		labels: ['token', 'layer2'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Loopring ====================
	{
		address: '0x674bdf20A0F284D710BC40872100128e2d66Bd3f',
		chainId: 1,
		entityId: 'loopring',
		name: 'Loopring Exchange V2',
		labels: ['layer2', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
		chainId: 1,
		entityId: 'loopring',
		name: 'LRC Token',
		labels: ['token', 'layer2'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Immutable X ====================
	{
		address: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
		chainId: 1,
		entityId: 'immutable',
		name: 'Immutable X Core',
		labels: ['layer2', 'nft', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF',
		chainId: 1,
		entityId: 'immutable',
		name: 'IMX Token',
		labels: ['token', 'layer2'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
