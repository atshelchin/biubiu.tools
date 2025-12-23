/**
 * Bridge Addresses - Cross-chain bridges and their contracts
 * 数据来源: 官方文档、Etherscan
 */

import type { LabeledAddress } from '../../types';

export const bridgeAddresses: LabeledAddress[] = [
	// ==================== Across Protocol ====================
	{
		address: '0x4D9079Bb4165aeb4084c526a32695dCfd2F77381',
		chainId: 1,
		name: 'Across SpokePool',
		labels: ['bridge', 'contract'],
		entityId: 'across',
		riskLevel: 'safe',
		description: 'Across Protocol spoke pool for Ethereum',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc186fA914353c44b2E33eBE05f21846F1048bEda',
		chainId: 1,
		name: 'Across HubPool',
		labels: ['bridge', 'contract'],
		entityId: 'across',
		riskLevel: 'safe',
		description: 'Across Protocol hub pool',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Stargate ====================
	{
		address: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
		chainId: 1,
		name: 'Stargate Router',
		labels: ['bridge', 'contract'],
		entityId: 'stargate',
		riskLevel: 'safe',
		description: 'Stargate Finance router',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xdf0770dF86a8034b3EFEf0A1Bb3c889B8332FF56',
		chainId: 1,
		name: 'Stargate USDC Pool',
		labels: ['bridge', 'defi'],
		entityId: 'stargate',
		riskLevel: 'safe',
		description: 'Stargate USDC liquidity pool',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x38EA452219524Bb87e18dE1C24D3bB59510BD783',
		chainId: 1,
		name: 'Stargate USDT Pool',
		labels: ['bridge', 'defi'],
		entityId: 'stargate',
		riskLevel: 'safe',
		description: 'Stargate USDT liquidity pool',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x101816545F6bd2b1076434B54383a1E633390A2E',
		chainId: 1,
		name: 'Stargate ETH Pool',
		labels: ['bridge', 'defi'],
		entityId: 'stargate',
		riskLevel: 'safe',
		description: 'Stargate ETH liquidity pool',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Hop Protocol ====================
	{
		address: '0x3666f603Cc164936C1b87e207F36BEBa4AC5f18a',
		chainId: 1,
		name: 'Hop USDC Bridge',
		labels: ['bridge', 'contract'],
		entityId: 'hop',
		riskLevel: 'safe',
		description: 'Hop Protocol USDC bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3E4a3a4796d16c0Cd582C382691998f7c06420B6',
		chainId: 1,
		name: 'Hop USDT Bridge',
		labels: ['bridge', 'contract'],
		entityId: 'hop',
		riskLevel: 'safe',
		description: 'Hop Protocol USDT bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xb8901acB165ed027E32754E0FFe830802919727f',
		chainId: 1,
		name: 'Hop ETH Bridge',
		labels: ['bridge', 'contract'],
		entityId: 'hop',
		riskLevel: 'safe',
		description: 'Hop Protocol ETH bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Synapse ====================
	{
		address: '0x2796317b0fF8538F253012862c06787Adfb8cEb6',
		chainId: 1,
		name: 'Synapse Bridge',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'Synapse Protocol bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1116898DdA4015eD8dDefb84b6e8Bc24528Af2d8',
		chainId: 1,
		name: 'Synapse SYN Token',
		labels: ['bridge', 'token'],
		riskLevel: 'safe',
		description: 'Synapse Protocol governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Multichain (defunct) ====================
	{
		address: '0x23ddd3e3692d1861Ed57EDE224608875809e127f',
		chainId: 1,
		name: 'Multichain Router',
		labels: ['bridge', 'contract'],
		riskLevel: 'danger',
		description: 'Multichain router (DEFUNCT - lost funds)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Portal (Wormhole) ====================
	{
		address: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
		chainId: 1,
		name: 'Portal Token Bridge',
		labels: ['bridge', 'contract'],
		entityId: 'wormhole',
		riskLevel: 'safe',
		description: 'Wormhole Portal token bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
		chainId: 1,
		name: 'Wormhole Core',
		labels: ['bridge', 'contract'],
		entityId: 'wormhole',
		riskLevel: 'safe',
		description: 'Wormhole core messaging',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Celer ====================
	{
		address: '0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820',
		chainId: 1,
		name: 'Celer cBridge',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'Celer cBridge contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4066D196A423b2b3B8B054f4F40efB47a74E200C',
		chainId: 1,
		name: 'Celer CELR Token',
		labels: ['bridge', 'token'],
		riskLevel: 'safe',
		description: 'Celer Network token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== deBridge ====================
	{
		address: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA',
		chainId: 1,
		name: 'deBridge Gate',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'deBridge cross-chain gate',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Socket/Bungee ====================
	{
		address: '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
		chainId: 1,
		name: 'Socket Gateway',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'Socket/Bungee gateway',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Li.Fi ====================
	{
		address: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
		chainId: 1,
		name: 'LiFi Diamond',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'LiFi aggregator diamond proxy',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Connext ====================
	{
		address: '0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6',
		chainId: 1,
		name: 'Connext Bridge',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'Connext NXTP bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Orbiter ====================
	{
		address: '0x80C67432656d59144cEFf962E8fAF8926599bCF8',
		chainId: 1,
		name: 'Orbiter Bridge',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'Orbiter Finance bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xE4eDb277e41dc89aB076a1F049f4a3EfA700bCE8',
		chainId: 1,
		name: 'Orbiter Maker',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'Orbiter market maker',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Hyperlane ====================
	{
		address: '0xc005dc82818d67AF737725bD4bf75435d065D239',
		chainId: 1,
		name: 'Hyperlane Mailbox',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'Hyperlane messaging mailbox',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Axelar ====================
	{
		address: '0x4F4495243837681061C4743b74B3eEdf548D56A5',
		chainId: 1,
		name: 'Axelar Gateway',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'Axelar cross-chain gateway',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x467719aD09025FcC6cF6F8311755809d45a5E5f3',
		chainId: 1,
		name: 'Axelar AXL Token',
		labels: ['bridge', 'token'],
		riskLevel: 'safe',
		description: 'Axelar network token',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
