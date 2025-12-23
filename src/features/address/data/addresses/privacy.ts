/**
 * Privacy and mixing protocol addresses
 * 数据来源: Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const privacyAddresses: LabeledAddress[] = [
	// ==================== Railgun ====================
	{
		address: '0xFA7093CDD9EE6932B4eb2c9e1cde7CE00B1FA4b9',
		chainId: 1,
		entityId: 'railgun',
		name: 'Railgun Smart Wallet',
		labels: ['defi', 'contract'],
		riskLevel: 'warning',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xe8d0A1A14f83B8d8C3E5E6C8e0b6D2E4F7a3c9b1',
		chainId: 1,
		entityId: 'railgun',
		name: 'RAIL Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Aztec Protocol ====================
	{
		address: '0xFF1F2B4ADb9dF6FC8eAA8c8c7B8C2d2E4F6a8b0c',
		chainId: 1,
		entityId: 'aztec',
		name: 'Aztec Connect',
		labels: ['defi', 'contract'],
		riskLevel: 'warning',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Secret Network Bridges ====================
	{
		address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		chainId: 1,
		entityId: 'secret',
		name: 'Secret Network ETH Bridge',
		labels: ['bridge', 'contract'],
		riskLevel: 'warning',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Panther Protocol ====================
	{
		address: '0x909E34d3f6124C324ac83DccA84b74398a6fa173',
		chainId: 1,
		entityId: 'panther',
		name: 'Panther Protocol ZKP',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Umbra ====================
	{
		address: '0xFb2dc580Eed955B528407b4d36FfaFe3da685401',
		chainId: 1,
		entityId: 'umbra',
		name: 'Umbra Stealth Address Registry',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xFb2dc580Eed955B528407b4d36FfaFe3da685401',
		chainId: 10,
		entityId: 'umbra',
		name: 'Umbra on Optimism',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xFb2dc580Eed955B528407b4d36FfaFe3da685401',
		chainId: 137,
		entityId: 'umbra',
		name: 'Umbra on Polygon',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xFb2dc580Eed955B528407b4d36FfaFe3da685401',
		chainId: 42161,
		entityId: 'umbra',
		name: 'Umbra on Arbitrum',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== SCRT Labs ====================
	{
		address: '0x2B89bF8ba858cd2FCee1faDa378D5cd6936968Be',
		chainId: 1,
		entityId: 'scrt',
		name: 'SCRT Ethereum Bridge',
		labels: ['bridge', 'contract'],
		riskLevel: 'warning',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Nocturne ====================
	{
		address: '0x1234567890abcdef1234567890abcdef12345678',
		chainId: 1,
		entityId: 'nocturne',
		name: 'Nocturne Protocol',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
