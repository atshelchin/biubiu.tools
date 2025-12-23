/**
 * Cross-chain and interoperability protocol addresses
 * 数据来源: Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const crossChainAddresses: LabeledAddress[] = [
	// ==================== LayerZero ====================
	{
		address: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
		chainId: 1,
		entityId: 'layerzero',
		name: 'LayerZero Endpoint V1',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1a44076050125825900e736c501f859c50fE728c',
		chainId: 1,
		entityId: 'layerzero',
		name: 'LayerZero Endpoint V2',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6985884C4392D348587B19cb9eAAf157F13271cd',
		chainId: 1,
		entityId: 'layerzero',
		name: 'LayerZero Token (ZRO)',
		labels: ['token', 'bridge'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
		chainId: 42161,
		entityId: 'layerzero',
		name: 'LayerZero Endpoint on Arbitrum',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
		chainId: 10,
		entityId: 'layerzero',
		name: 'LayerZero Endpoint on Optimism',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Wormhole ====================
	{
		address: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
		chainId: 1,
		entityId: 'wormhole',
		name: 'Wormhole Core Bridge',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
		chainId: 1,
		entityId: 'wormhole',
		name: 'Wormhole Token Bridge',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x85E4dC16f18A8C2Fe6D4a0Fae52fDaAD934e47f7',
		chainId: 1,
		entityId: 'wormhole',
		name: 'W Token (Wormhole)',
		labels: ['token', 'bridge'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Axelar ====================
	{
		address: '0x4F4495243837681061C4743b74B3eEdf548D56A5',
		chainId: 1,
		entityId: 'axelar',
		name: 'Axelar Gateway',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x467719aD09025FcC6cF6F8311755809d45a5E5f3',
		chainId: 1,
		entityId: 'axelar',
		name: 'AXL Token',
		labels: ['token', 'bridge'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Hyperlane ====================
	{
		address: '0x35231d4c2D8B8ADcB5617A638A0c4548684c7C70',
		chainId: 1,
		entityId: 'hyperlane',
		name: 'Hyperlane Mailbox',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Connext ====================
	{
		address: '0x8898B472C54c31894e3B9bb83cEA802a5d0e63C6',
		chainId: 1,
		entityId: 'connext',
		name: 'Connext Diamond',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xFE67A4450907459c3e1FFf623aA927dD4e28c67a',
		chainId: 1,
		entityId: 'connext',
		name: 'NEXT Token',
		labels: ['token', 'bridge'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Celer ====================
	{
		address: '0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820',
		chainId: 1,
		entityId: 'celer',
		name: 'cBridge V2',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4f9254C83EB525f9FCf346490bbb3ed28a81C667',
		chainId: 1,
		entityId: 'celer',
		name: 'CELR Token',
		labels: ['token', 'bridge'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== deBridge ====================
	{
		address: '0x43dE2d77BF8027e25dBD179B491e8d64f38398aA',
		chainId: 1,
		entityId: 'debridge',
		name: 'deBridge Gate',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xaD6D458402F60fD3Bd25163575031ACDce07538D',
		chainId: 1,
		entityId: 'debridge',
		name: 'DBR Token',
		labels: ['token', 'bridge'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Socket ====================
	{
		address: '0x3a23F943181408EAC424116Af7b7790c94Cb97a5',
		chainId: 1,
		entityId: 'socket',
		name: 'Socket Gateway',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Synapse ====================
	{
		address: '0x2796317b0fF8538F253012862c06787Adfb8cEb6',
		chainId: 1,
		entityId: 'synapse',
		name: 'Synapse Bridge',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0f2D719407FdBeFF09D87557AbB7232601FD9F29',
		chainId: 1,
		entityId: 'synapse',
		name: 'SYN Token',
		labels: ['token', 'bridge'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Multichain (Legacy) ====================
	{
		address: '0x6b7a87899490EcE95443e979cA9485CBE7E71522',
		chainId: 1,
		entityId: 'multichain',
		name: 'Multichain Router V4',
		labels: ['bridge', 'contract'],
		riskLevel: 'danger',
		description: 'Multichain protocol was compromised - avoid use',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Hop Protocol ====================
	{
		address: '0xb8901acB165ed027E32754E0FFe830802919727f',
		chainId: 1,
		entityId: 'hop',
		name: 'Hop Protocol Bridge',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC',
		chainId: 1,
		entityId: 'hop',
		name: 'HOP Token',
		labels: ['token', 'bridge'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Across Protocol ====================
	{
		address: '0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5',
		chainId: 1,
		entityId: 'across',
		name: 'Across SpokePool',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F',
		chainId: 1,
		entityId: 'across',
		name: 'ACX Token',
		labels: ['token', 'bridge'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Squid Router ====================
	{
		address: '0xce16F69375520ab01377ce7B88f5BA8C48F8D666',
		chainId: 1,
		entityId: 'squid',
		name: 'Squid Router',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Li.Fi ====================
	{
		address: '0x1231DEB6f5749EF6cE6943a275A1D3E7486F4EaE',
		chainId: 1,
		entityId: 'lifi',
		name: 'LiFi Diamond',
		labels: ['bridge', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Chainlink CCIP ====================
	{
		address: '0x80226fc0Ee2b096224EeAc085Bb9a8cba1146f7D',
		chainId: 1,
		entityId: 'chainlink',
		name: 'CCIP Router',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Zetachain ====================
	{
		address: '0xf091867EC603A6628eD83D274E835539D82e9cc8',
		chainId: 1,
		entityId: 'zetachain',
		name: 'ZetaChain Connector',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xf091867EC603A6628eD83D274E835539D82e9cc8',
		chainId: 1,
		entityId: 'zetachain',
		name: 'ZETA Token',
		labels: ['token', 'bridge'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
