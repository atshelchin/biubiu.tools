/**
 * Derivatives and perpetual protocol addresses
 * 数据来源: Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const derivativesAddresses: LabeledAddress[] = [
	// ==================== dYdX ====================
	{
		address: '0x92D6C1e31e14520e676a687F0a93788B716BEff5',
		chainId: 1,
		entityId: 'dydx',
		name: 'dYdX Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1E0447b19BB6EcFdAe1e4AE1694b0C3659614e4e',
		chainId: 1,
		entityId: 'dydx',
		name: 'dYdX StarkEx Perpetual',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Synthetix ====================
	{
		address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
		chainId: 1,
		entityId: 'synthetix',
		name: 'Synthetix Network Token (SNX)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd711709eFc452152B7ad11DbD01ed4B69c6bAd7a',
		chainId: 1,
		entityId: 'synthetix',
		name: 'Synthetix Proxy',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4',
		chainId: 10,
		entityId: 'synthetix',
		name: 'Synthetix (SNX) on Optimism',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd3D10556F14a7023b12A485C94B6a1F5f9f6b5E1',
		chainId: 10,
		entityId: 'synthetix',
		name: 'Synthetix Perps Market',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Perpetual Protocol ====================
	{
		address: '0xbC396689893D065F41bc2C6EcbeE5e0085233447',
		chainId: 1,
		entityId: 'perpetual',
		name: 'Perpetual Protocol Token (PERP)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xaD3A9f25cEE6e1C2f1A7EF1C78D2c8bc4A54C2C8',
		chainId: 10,
		entityId: 'perpetual',
		name: 'Perpetual Protocol Clearing House',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gains Network ====================
	{
		address: '0x18c11FD286C5EC11c3b683Caa813B77f5163A122',
		chainId: 137,
		entityId: 'gains',
		name: 'Gains Network Token (GNS)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x18c11FD286C5EC11c3b683Caa813B77f5163A122',
		chainId: 42161,
		entityId: 'gains',
		name: 'Gains Network Token (GNS) on Arbitrum',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Kwenta ====================
	{
		address: '0x920Cf626a271321C151D027030D5d08aF699456b',
		chainId: 10,
		entityId: 'kwenta',
		name: 'Kwenta Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Lyra ====================
	{
		address: '0x01BA67AAC7f75f647D94220Cc98FB30FCc5105Bf',
		chainId: 10,
		entityId: 'lyra',
		name: 'Lyra Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Ribbon Finance ====================
	{
		address: '0x6123B0049F904d730dB3C36a31167D9d4121fA6B',
		chainId: 1,
		entityId: 'ribbon',
		name: 'Ribbon Finance Token (RBN)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x65a833afDc250D9d38f8CD9bC2B1E3132dB13B2F',
		chainId: 1,
		entityId: 'ribbon',
		name: 'Ribbon ETH Theta Vault',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Opyn ====================
	{
		address: '0x7C06792Af1632E77cb27a558Dc0885338F4Bdf8E',
		chainId: 1,
		entityId: 'opyn',
		name: 'Opyn Controller',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Dopex ====================
	{
		address: '0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55',
		chainId: 42161,
		entityId: 'dopex',
		name: 'Dopex Token (DPX)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x32Eb7902D4134bf98A28b963D26de779AF92A212',
		chainId: 42161,
		entityId: 'dopex',
		name: 'Dopex rDPX Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Hegic ====================
	{
		address: '0x584bC13c7D411c00c01A62e8019472dE68768430',
		chainId: 1,
		entityId: 'hegic',
		name: 'Hegic Token (HEGIC)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Premia ====================
	{
		address: '0x6399C842dD2bE3dE30BF99Bc7D1bBF6Fa3650E70',
		chainId: 1,
		entityId: 'premia',
		name: 'Premia Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x51fC0f6660482Ea73330E414eFd7808811a57Fa2',
		chainId: 42161,
		entityId: 'premia',
		name: 'Premia Token on Arbitrum',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Vertex ====================
	{
		address: '0x95146881b86B3ee99e63705eC87AfE29Fcc044D9',
		chainId: 42161,
		entityId: 'vertex',
		name: 'Vertex Token (VRTX)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xbB16BEB4a0A5D44F5aF56a71a032F42e9d4e8b3f',
		chainId: 42161,
		entityId: 'vertex',
		name: 'Vertex Endpoint',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== HMX ====================
	{
		address: '0x83D6c8C06AC276465e4c92E7aC8C23740F435140',
		chainId: 42161,
		entityId: 'hmx',
		name: 'HMX Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Level Finance ====================
	{
		address: '0xB64E280e9D1B5DbEc4AcceDb2257A87b400DB149',
		chainId: 56,
		entityId: 'level',
		name: 'Level Token (LVL)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== MUX Protocol ====================
	{
		address: '0xddCEa799fF1699e98EDF118e0629A974Df7DF012',
		chainId: 42161,
		entityId: 'mux',
		name: 'MUX Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Pika Protocol ====================
	{
		address: '0x9A601C5bb360811d96A23689066af316a30c3027',
		chainId: 10,
		entityId: 'pika',
		name: 'Pika Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Cap Finance ====================
	{
		address: '0x031d35296154279DC1984dCD93E392b1f946737b',
		chainId: 42161,
		entityId: 'cap',
		name: 'Cap Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
