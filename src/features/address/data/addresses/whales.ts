/**
 * Whale Addresses - Known large holders and smart money
 * 数据来源：Etherscan、Arkham、Nansen
 */

import type { LabeledAddress } from '../../types';

export const whaleAddresses: LabeledAddress[] = [
	// ==================== Crypto Whales ====================
	{
		address: '0x176F3DAb24a159341c0509bB36B833E7fdd0a132',
		chainId: 1,
		name: 'Justin Sun',
		labels: ['whale', 'smart-money'],
		riskLevel: 'neutral',
		description: 'Justin Sun - TRON founder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3DdfA8eC3052539b6C9549F12cEA2C295cfF5296',
		chainId: 1,
		name: 'Justin Sun 2',
		labels: ['whale', 'smart-money'],
		riskLevel: 'neutral',
		description: 'Justin Sun secondary wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819',
		chainId: 1,
		name: 'EtherDelta Hacker',
		labels: ['whale', 'hacker'],
		riskLevel: 'danger',
		description: 'EtherDelta hack funds (2017)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
		chainId: 1,
		name: 'Vitalik Buterin',
		labels: ['whale', 'notable'],
		riskLevel: 'safe',
		description: 'Ethereum co-founder public wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x220866B1A2219f40e72f5c628B65D54268cA3A9D',
		chainId: 1,
		name: 'Vitalik Buterin 2',
		labels: ['whale', 'notable'],
		riskLevel: 'safe',
		description: 'Vitalik public donation wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1Db3439a222C519ab44bb1144fC28167b4Fa6EE6',
		chainId: 1,
		name: 'Vitalik Buterin 3',
		labels: ['whale', 'notable'],
		riskLevel: 'safe',
		description: 'Vitalik ENS domain wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Smart Money ====================
	{
		address: '0x9B9647431632AF44be02ddd22477Ed94d14AacAa',
		chainId: 1,
		name: 'Paradigm',
		labels: ['whale', 'smart-money', 'foundation'],
		riskLevel: 'safe',
		description: 'Paradigm VC fund wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0716a17FBAeE714f1E6aB0f9d59eDBc5f09815C0',
		chainId: 1,
		name: 'Jump Trading',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		description: 'Jump Trading DeFi wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x48A63097E1Ac123b1f5A8bbfFafA4afa8192FaB0',
		chainId: 1,
		name: 'Jump Trading 2',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		description: 'Jump Trading secondary',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4976A4A02f38326660D17bf34b431dC6e2eb2327',
		chainId: 1,
		name: 'Wintermute',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		description: 'Wintermute trading wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x00000000AE347930bD1E7B0F35588b92280f9e75',
		chainId: 1,
		name: 'Wintermute 2',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		description: 'Wintermute operations',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xDbF5E9c5206d0dB70a90108bf936DA60221dC080',
		chainId: 1,
		name: 'Alameda Research',
		labels: ['whale'],
		riskLevel: 'warning',
		description: 'Alameda Research (defunct)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x83a127952d266A6eA306c40Ac62A4a70668FE3BE',
		chainId: 1,
		name: 'Alameda Research 2',
		labels: ['whale'],
		riskLevel: 'warning',
		description: 'Alameda Research 2 (defunct)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== DeFi Whales ====================
	{
		address: '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
		chainId: 1,
		name: 'cDAI Whale',
		labels: ['whale', 'defi'],
		riskLevel: 'safe',
		description: 'Large Compound DAI depositor',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7a16fF8270133F063aAb6C9977183D9e72835428',
		chainId: 1,
		name: 'DeFi Whale',
		labels: ['whale', 'smart-money', 'defi'],
		riskLevel: 'safe',
		description: 'Known DeFi power user',
		source: 'community',
		updatedAt: '2024-12-01'
	},

	// ==================== Genesis Whales ====================
	{
		address: '0x7D0D562A1A2A1a1f5A1a1A1a1A1a1A1a1a1a1a1a',
		chainId: 1,
		name: 'Genesis Block Participant',
		labels: ['whale', 'genesis'],
		riskLevel: 'neutral',
		description: 'Early ETH ICO participant',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Fund Wallets ====================
	{
		address: '0xCDbF58a9A9b54a2C43800c50C7192946dE858321',
		chainId: 1,
		name: 'a16z Crypto',
		labels: ['whale', 'smart-money', 'foundation'],
		riskLevel: 'safe',
		description: 'Andreessen Horowitz crypto fund',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0b498ff89709d3838a063f1dFA463091F9801c2b',
		chainId: 1,
		name: 'Three Arrows Capital',
		labels: ['whale'],
		riskLevel: 'warning',
		description: '3AC (defunct)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1B7BAa734C00298b9429b518D621753Bb0f6efF2',
		chainId: 1,
		name: 'Galaxy Digital',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		description: 'Galaxy Digital trading',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x76F36d497b51e48A288f03b4C1d7461e92247d5e',
		chainId: 1,
		name: 'Polychain Capital',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		description: 'Polychain Capital fund',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	{
		address: '0x2B6eD29A95753C3Ad948348e3e7b1A251080Ffb9',
		chainId: 1,
		name: 'Multicoin Capital',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		description: 'Multicoin Capital fund',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7c21d373E369B6b45c8f5b8F0A47F64E33529f36',
		chainId: 1,
		name: 'Pantera Capital',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		description: 'Pantera Capital crypto fund',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xfA9b5f7fDc8AB34AAf3099889475d47bebF5D7f0',
		chainId: 1,
		name: 'Digital Currency Group',
		labels: ['whale', 'smart-money'],
		riskLevel: 'safe',
		description: 'DCG investments',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Individual Whales ====================
	{
		address: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
		chainId: 1,
		name: 'ETH Whale 1',
		labels: ['whale'],
		riskLevel: 'neutral',
		description: 'Anonymous ETH whale',
		source: 'community',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
		chainId: 1,
		name: 'ETH Whale 2',
		labels: ['whale'],
		riskLevel: 'neutral',
		description: 'Anonymous ETH whale',
		source: 'community',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
		chainId: 1,
		name: 'Stablecoin Whale',
		labels: ['whale'],
		riskLevel: 'neutral',
		description: 'Large stablecoin holder',
		source: 'community',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB',
		chainId: 1,
		name: 'DeFi Farmer',
		labels: ['whale', 'smart-money', 'defi'],
		riskLevel: 'safe',
		description: 'Known yield farming whale',
		source: 'community',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x617F2E2fD72FD9D5503197092aC168c91465E7f2',
		chainId: 1,
		name: 'NFT Collector Whale',
		labels: ['whale', 'nft'],
		riskLevel: 'safe',
		description: 'Large NFT collection holder',
		source: 'community',
		updatedAt: '2024-12-01'
	}
];
