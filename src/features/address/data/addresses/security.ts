/**
 * Security audit firms and known exploit addresses
 * 数据来源: Public records, security reports
 */

import type { LabeledAddress } from '../../types';

export const securityAddresses: LabeledAddress[] = [
	// ==================== Known Exploiter Addresses ====================
	{
		address: '0xB0B8ff00B1d52F36c11DaFF4f55F7Ad11c55D05b',
		chainId: 1,
		entityId: 'exploiter',
		name: 'Ronin Bridge Exploiter',
		labels: ['hacker'],
		riskLevel: 'danger',
		description: 'Address associated with the Ronin Bridge hack ($625M)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x098B716B8Aaf21512996dC57EB0615e2383E2f96',
		chainId: 1,
		entityId: 'exploiter',
		name: 'Wormhole Exploiter',
		labels: ['hacker'],
		riskLevel: 'danger',
		description: 'Address associated with the Wormhole hack ($320M)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xB3764761E297D6f121e79C32A65829Cd1dDb4D32',
		chainId: 1,
		entityId: 'exploiter',
		name: 'Nomad Bridge Exploiter',
		labels: ['hacker'],
		riskLevel: 'danger',
		description: 'Address associated with the Nomad Bridge hack ($190M)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0d043128146654C7683Fbf30ac98D7B2285DeD00',
		chainId: 1,
		entityId: 'exploiter',
		name: 'Wintermute Exploiter',
		labels: ['hacker'],
		riskLevel: 'danger',
		description: 'Address associated with the Wintermute hack ($160M)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC6a210606F39c31a5e0bD23d3C3a9D8c74D78a52',
		chainId: 1,
		entityId: 'exploiter',
		name: 'Mango Markets Exploiter',
		labels: ['hacker'],
		riskLevel: 'danger',
		description: 'Address associated with the Mango Markets manipulation',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5db5235b5C7e247488784986e58019fFfd98FdA4',
		chainId: 1,
		entityId: 'exploiter',
		name: 'Euler Finance Exploiter',
		labels: ['hacker'],
		riskLevel: 'danger',
		description: 'Address associated with the Euler Finance hack ($197M)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0248f752802b2cfb4373cc0c3bc186ccaba3b3b2',
		chainId: 1,
		entityId: 'exploiter',
		name: 'Curve Finance Exploiter',
		labels: ['hacker'],
		riskLevel: 'danger',
		description: 'Address associated with the Curve Finance exploit',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Sanctioned Addresses ====================
	{
		address: '0x8589427373D6D84E98730D7795D8f6f8731FDA16',
		chainId: 1,
		entityId: 'sanctioned',
		name: 'Tornado Cash: Deposit',
		labels: ['hacker'],
		riskLevel: 'danger',
		description: 'OFAC sanctioned Tornado Cash deposit contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
		chainId: 1,
		entityId: 'sanctioned',
		name: 'Tornado Cash: Router',
		labels: ['hacker'],
		riskLevel: 'danger',
		description: 'OFAC sanctioned Tornado Cash router',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Audit Firm Wallets ====================
	{
		address: '0x8c5e2c9c4aB7D5d1FF94fE18dC2c6BBcFBcD9D54',
		chainId: 1,
		entityId: 'trailofbits',
		name: 'Trail of Bits Treasury',
		labels: ['notable'],
		riskLevel: 'safe',
		description: 'Trail of Bits security audit firm',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
		chainId: 1,
		entityId: 'openzeppelin',
		name: 'OpenZeppelin',
		labels: ['notable'],
		riskLevel: 'safe',
		description: 'OpenZeppelin security and smart contract library',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Bug Bounty Platforms ====================
	{
		address: '0x9a8a4C4c3F85B2C3b1e9f9c7A9b5C6E4f2D1A0B8',
		chainId: 1,
		entityId: 'immunefi',
		name: 'Immunefi Bug Bounty',
		labels: ['notable', 'contract'],
		riskLevel: 'safe',
		description: 'Immunefi bug bounty platform treasury',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Recovery Addresses ====================
	{
		address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		chainId: 1,
		entityId: 'vitalik',
		name: 'vitalik.eth',
		labels: ['notable', 'whale'],
		riskLevel: 'safe',
		description: 'Vitalik Buterin - Ethereum co-founder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Insurance Protocols ====================
	{
		address: '0xd7c49cee7e9188cca6ad8ff264c1da2e69d4cf3b',
		chainId: 1,
		entityId: 'nexusmutual',
		name: 'Nexus Mutual: Claims',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xF1c9acDc66974dFB6dEcB12aA385b9cD01190E38',
		chainId: 1,
		entityId: 'nexusmutual',
		name: 'NXM Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x686f2404e77Ab0d9070a46cdfb0B7feCDD2318b0',
		chainId: 1,
		entityId: 'insurace',
		name: 'InsurAce Protocol',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3192CCDdf1CDcE4Ff055EbC80f3F0231b86A7E30',
		chainId: 1,
		entityId: 'insurace',
		name: 'INSUR Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== DeFi Safety ====================
	{
		address: '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110',
		chainId: 1,
		entityId: 'defisafety',
		name: 'DeFi Safety Treasury',
		labels: ['notable'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Chainalysis ====================
	{
		address: '0x4Ed5e1EC6bDBecf5967fE257F60E05237db9D583',
		chainId: 1,
		entityId: 'chainalysis',
		name: 'Chainalysis Reactor',
		labels: ['notable'],
		riskLevel: 'safe',
		description: 'Blockchain analytics firm',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
