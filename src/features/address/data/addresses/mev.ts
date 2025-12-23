/**
 * MEV-related Addresses - Flashbots, MEV bots, searchers
 * 数据来源: Etherscan、公开资料
 */

import type { LabeledAddress } from '../../types';

export const mevAddresses: LabeledAddress[] = [
	// ==================== Flashbots ====================
	{
		address: '0xDAFEA492D9c6733ae3d56b7Ed1ADb60692c98Bc5',
		chainId: 1,
		name: 'Flashbots Builder',
		labels: ['whale'],
		riskLevel: 'safe',
		description: 'Flashbots block builder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
		chainId: 1,
		name: 'Flashbots Relay',
		labels: ['contract'],
		riskLevel: 'safe',
		description: 'Flashbots relay for MEV protection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== MEV Boost ====================
	{
		address: '0x0000000000007F150Bd6f54c40A34d7C3d5e9f56',
		chainId: 1,
		name: 'MEV Blocker',
		labels: ['contract'],
		riskLevel: 'safe',
		description: 'MEV protection contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Known MEV Bots ====================
	{
		address: '0x00000000003b3cc22aF3aE1EAc0440BcEe416B40',
		chainId: 1,
		name: 'jaredfromsubway.eth',
		labels: ['whale'],
		riskLevel: 'warning',
		description: 'Famous MEV sandwich bot',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6b75d8AF000000e20B7a7DDf000Ba900b4009A80',
		chainId: 1,
		name: 'MEV Bot',
		labels: ['whale'],
		riskLevel: 'warning',
		description: 'Known MEV arbitrage bot',
		source: 'community',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x000000000035B5e5ad9019092C665357240f594e',
		chainId: 1,
		name: 'BeaverBuild',
		labels: ['whale'],
		riskLevel: 'safe',
		description: 'BeaverBuild block builder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5',
		chainId: 1,
		name: 'Builder 0x69',
		labels: ['whale'],
		riskLevel: 'safe',
		description: 'Builder 0x69 block builder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326',
		chainId: 1,
		name: 'rsync-builder',
		labels: ['whale'],
		riskLevel: 'safe',
		description: 'rsync block builder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xfEEfEEfeefEeFeefEEFEEfEeFeefEEFeeFEEFEeF',
		chainId: 1,
		name: 'Titan Builder',
		labels: ['whale'],
		riskLevel: 'safe',
		description: 'Titan block builder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== CoW Protocol ====================
	{
		address: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
		chainId: 1,
		name: 'CoW Protocol Settlement',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'CoW Protocol (Gnosis Protocol V2) settlement',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110',
		chainId: 1,
		name: 'CoW Protocol Vault Relayer',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'CoW Protocol vault relayer',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== More Block Builders ====================
	{
		address: '0x690B9A9E9aa1C9dB991C7721a92d351Db4FaC990',
		chainId: 1,
		entityId: 'builder',
		name: 'bloXroute Builder',
		labels: ['whale'],
		riskLevel: 'safe',
		description: 'bloXroute block builder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3B64216AD1a58f61538b4fA1B27327675Ab7ED67',
		chainId: 1,
		entityId: 'builder',
		name: 'Eden Network Builder',
		labels: ['whale'],
		riskLevel: 'safe',
		description: 'Eden Network block builder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xbAF6dC2E647aeb6F510f9e318856A1BCd66C5e19',
		chainId: 1,
		entityId: 'builder',
		name: 'Manifold Finance Builder',
		labels: ['whale'],
		riskLevel: 'safe',
		description: 'Manifold Finance block builder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x388C818CA8B9251b393131C08a736A67ccB19297',
		chainId: 1,
		entityId: 'lido',
		name: 'Lido Execution Layer Rewards Vault',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'Lido MEV rewards vault',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== MEV Protection ====================
	{
		address: '0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57',
		chainId: 1,
		entityId: 'paraswap',
		name: 'ParaSwap Augustus V6',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'ParaSwap aggregator with MEV protection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1111111254EEB25477B68fb85Ed929f73A960582',
		chainId: 1,
		entityId: '1inch',
		name: '1inch Aggregation Router V5',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: '1inch DEX aggregator with MEV protection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Known MEV Searchers ====================
	{
		address: '0x56178a0d5F301bAf6CF3e1Cd53d9863437345Bf9',
		chainId: 1,
		entityId: 'wintermute',
		name: 'Wintermute MEV',
		labels: ['whale'],
		riskLevel: 'safe',
		description: 'Wintermute trading/MEV operations',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xE8c060F8052E07423f71D445277c61AC5138A2e5',
		chainId: 1,
		entityId: 'mev',
		name: 'Mev Capital',
		labels: ['whale'],
		riskLevel: 'safe',
		description: 'MEV Capital searcher',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x98C3d3183C4b8A650614ad179A1a98be0a8d6B8E',
		chainId: 1,
		entityId: 'mev',
		name: 'MEV Bot: Sandwich',
		labels: ['whale'],
		riskLevel: 'warning',
		description: 'Known sandwich attack bot',
		source: 'community',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA69babEF1cA67A37Ffaf7a485DfFF3382056e78C',
		chainId: 1,
		entityId: 'mev',
		name: 'MEV Bot: Arbitrage',
		labels: ['whale'],
		riskLevel: 'warning',
		description: 'Known arbitrage bot',
		source: 'community',
		updatedAt: '2024-12-01'
	},

	// ==================== Flashbots Protect ====================
	{
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		chainId: 1,
		entityId: 'weth',
		name: 'WETH (Wrapped Ether)',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Wrapped Ether - commonly used in MEV',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Liquidation Bots ====================
	{
		address: '0x02777053d6764996e594c3E88AF1D58D5363a2e6',
		chainId: 1,
		entityId: 'liquidator',
		name: 'Aave Liquidation Bot',
		labels: ['whale'],
		riskLevel: 'safe',
		description: 'Known Aave liquidation bot',
		source: 'community',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f',
		chainId: 1,
		entityId: 'sushi',
		name: 'SushiSwap: BentoBox',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'SushiSwap BentoBox vault used in flash loans',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== MEV on L2 ====================
	{
		address: '0x4200000000000000000000000000000000000006',
		chainId: 10,
		entityId: 'optimism',
		name: 'WETH on Optimism',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Wrapped Ether on Optimism',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
		chainId: 42161,
		entityId: 'arbitrum',
		name: 'WETH on Arbitrum',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Wrapped Ether on Arbitrum',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];
