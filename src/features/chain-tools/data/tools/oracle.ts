/**
 * Oracle Tools - Price oracle protocols and data feeds
 *
 * Categories:
 * - Decentralized oracle networks
 * - Price feed providers
 * - Data aggregators
 * - Cross-chain oracles
 */
import {
	Activity,
	Radio,
	Database,
	Zap,
	Globe,
	Shield,
	Link,
	BarChart3,
	Cpu,
	Network,
	Timer,
	Eye
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const oracleTools: ExternalTool[] = [
	// ========== Major Decentralized Oracles ==========
	{
		id: 'chainlink',
		name: 'Chainlink',
		descriptionKey: 'chain_tools.tools.chainlink.description',
		url: 'https://chain.link',
		icon: Link,
		category: 'oracle',
		tags: ['oracle', 'price-feed', 'decentralized', 'vrf', 'ccip'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'BSC', 'Base'],
		color: '#375BD2',
		isFeatured: true
	},
	{
		id: 'chainlink-data-feeds',
		name: 'Chainlink Data Feeds',
		descriptionKey: 'chain_tools.tools.chainlink_data_feeds.description',
		url: 'https://data.chain.link',
		icon: BarChart3,
		category: 'oracle',
		tags: ['oracle', 'price-feed', 'real-time', 'dashboard'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'BSC'],
		color: '#375BD2'
	},
	{
		id: 'pyth-network',
		name: 'Pyth Network',
		descriptionKey: 'chain_tools.tools.pyth_network.description',
		url: 'https://pyth.network',
		icon: Activity,
		category: 'oracle',
		tags: ['oracle', 'price-feed', 'high-frequency', 'solana'],
		chains: ['Solana', 'Ethereum', 'Arbitrum', 'Optimism', 'Base', 'Sui', 'Aptos'],
		color: '#6941C6',
		isFeatured: true
	},
	{
		id: 'pyth-price-feeds',
		name: 'Pyth Price Feeds',
		descriptionKey: 'chain_tools.tools.pyth_price_feeds.description',
		url: 'https://pyth.network/price-feeds',
		icon: BarChart3,
		category: 'oracle',
		tags: ['oracle', 'price-feed', 'dashboard', 'explorer'],
		chains: ['Solana', 'Ethereum', 'Arbitrum', 'Sui', 'Aptos'],
		color: '#6941C6'
	},
	{
		id: 'band-protocol',
		name: 'Band Protocol',
		descriptionKey: 'chain_tools.tools.band_protocol.description',
		url: 'https://bandprotocol.com',
		icon: Radio,
		category: 'oracle',
		tags: ['oracle', 'cross-chain', 'cosmos', 'data'],
		chains: ['Ethereum', 'BSC', 'Cosmos', 'Fantom'],
		color: '#4520E6'
	},
	{
		id: 'api3',
		name: 'API3',
		descriptionKey: 'chain_tools.tools.api3.description',
		url: 'https://api3.org',
		icon: Cpu,
		category: 'oracle',
		tags: ['oracle', 'first-party', 'airnode', 'dao'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'BSC'],
		color: '#7950DD'
	},
	{
		id: 'dia-data',
		name: 'DIA Data',
		descriptionKey: 'chain_tools.tools.dia_data.description',
		url: 'https://diadata.org',
		icon: Database,
		category: 'oracle',
		tags: ['oracle', 'open-source', 'nft-oracle', 'defi'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche', 'Fantom'],
		color: '#FF4081'
	},
	{
		id: 'tellor',
		name: 'Tellor',
		descriptionKey: 'chain_tools.tools.tellor.description',
		url: 'https://tellor.io',
		icon: Shield,
		category: 'oracle',
		tags: ['oracle', 'decentralized', 'permissionless', 'staking'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Gnosis'],
		color: '#20DF92'
	},
	{
		id: 'uma-protocol',
		name: 'UMA Protocol',
		descriptionKey: 'chain_tools.tools.uma_protocol.description',
		url: 'https://uma.xyz',
		icon: Globe,
		category: 'oracle',
		tags: ['oracle', 'optimistic', 'dispute', 'synthetic'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Boba'],
		color: '#FF4A4A'
	},
	{
		id: 'redstone-oracles',
		name: 'RedStone Oracles',
		descriptionKey: 'chain_tools.tools.redstone_oracles.description',
		url: 'https://redstone.finance',
		icon: Zap,
		category: 'oracle',
		tags: ['oracle', 'modular', 'lsts', 'defi'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon', 'Base', 'zkSync'],
		color: '#FD4040'
	},
	{
		id: 'chronicle-labs',
		name: 'Chronicle Labs',
		descriptionKey: 'chain_tools.tools.chronicle_labs.description',
		url: 'https://chroniclelabs.org',
		icon: Timer,
		category: 'oracle',
		tags: ['oracle', 'maker', 'scalable', 'defi'],
		chains: ['Ethereum', 'Gnosis', 'Polygon', 'Arbitrum'],
		color: '#1AAB9B'
	},
	{
		id: 'umbrella-network',
		name: 'Umbrella Network',
		descriptionKey: 'chain_tools.tools.umbrella_network.description',
		url: 'https://umb.network',
		icon: Shield,
		category: 'oracle',
		tags: ['oracle', 'layer2', 'scalable', 'community'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Avalanche'],
		color: '#00D395'
	},
	{
		id: 'flux-protocol',
		name: 'Flux Protocol',
		descriptionKey: 'chain_tools.tools.flux_protocol.description',
		url: 'https://fluxprotocol.org',
		icon: Network,
		category: 'oracle',
		tags: ['oracle', 'cross-chain', 'near', 'scalable'],
		chains: ['NEAR', 'Ethereum', 'Aurora'],
		color: '#7B68EE'
	},
	{
		id: 'supra-oracles',
		name: 'Supra Oracles',
		descriptionKey: 'chain_tools.tools.supra_oracles.description',
		url: 'https://supra.com',
		icon: Zap,
		category: 'oracle',
		tags: ['oracle', 'fast', 'vrf', 'dora'],
		chains: ['Ethereum', 'Arbitrum', 'Polygon', 'Avalanche', 'BSC', 'Sui', 'Aptos'],
		color: '#FF6B35'
	},
	// ========== Specialized Oracles ==========
	{
		id: 'chainlink-vrf',
		name: 'Chainlink VRF',
		descriptionKey: 'chain_tools.tools.chainlink_vrf.description',
		url: 'https://chain.link/vrf',
		icon: Shield,
		category: 'oracle',
		tags: ['vrf', 'randomness', 'gaming', 'nft'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche', 'BSC'],
		color: '#375BD2'
	},
	{
		id: 'chainlink-automation',
		name: 'Chainlink Automation',
		descriptionKey: 'chain_tools.tools.chainlink_automation.description',
		url: 'https://chain.link/automation',
		icon: Cpu,
		category: 'oracle',
		tags: ['automation', 'keeper', 'smart-contract', 'trigger'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'BSC'],
		color: '#375BD2'
	},
	{
		id: 'chainlink-ccip',
		name: 'Chainlink CCIP',
		descriptionKey: 'chain_tools.tools.chainlink_ccip.description',
		url: 'https://chain.link/cross-chain',
		icon: Network,
		category: 'oracle',
		tags: ['cross-chain', 'messaging', 'interoperability', 'bridge'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche', 'Base'],
		color: '#375BD2'
	},
	{
		id: 'chainlink-functions',
		name: 'Chainlink Functions',
		descriptionKey: 'chain_tools.tools.chainlink_functions.description',
		url: 'https://chain.link/functions',
		icon: Cpu,
		category: 'oracle',
		tags: ['serverless', 'api', 'compute', 'web2'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche'],
		color: '#375BD2'
	},
	// ========== Oracle Aggregators & Tools ==========
	{
		id: 'defillama-oracles',
		name: 'DeFiLlama Oracles',
		descriptionKey: 'chain_tools.tools.defillama_oracles.description',
		url: 'https://defillama.com/oracles',
		icon: Eye,
		category: 'oracle',
		tags: ['analytics', 'tracking', 'tvs', 'data'],
		color: '#2172E5'
	},
	{
		id: 'oracle-dao',
		name: 'Oracle DAO',
		descriptionKey: 'chain_tools.tools.oracle_dao.description',
		url: 'https://oracle.io',
		icon: Shield,
		category: 'oracle',
		tags: ['governance', 'standards', 'security', 'community'],
		color: '#6366F1'
	}
];
