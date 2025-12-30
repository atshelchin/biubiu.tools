/**
 * Analytics Tools - Data analytics, dashboards, and market intelligence
 */
import {
	BarChart3,
	PieChart,
	Eye,
	Database,
	Activity,
	Scan,
	LineChart,
	FileText,
	Flame,
	Layers
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const analyticsTools: ExternalTool[] = [
	// ========== Core Analytics Platforms ==========
	{
		id: 'dune',
		name: 'Dune Analytics',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.dune.description',
		url: 'https://dune.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['analytics', 'data', 'sql', 'dashboard', 'visualization'],
		color: '#F0603A',
		isFeatured: true
	},
	{
		id: 'defillama',
		name: 'DefiLlama',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.defillama.description',
		url: 'https://defillama.com',
		icon: PieChart,
		category: 'analytics',
		tags: ['tvl', 'defi', 'analytics', 'protocols'],
		color: '#2775CA',
		isFeatured: true
	},
	{
		id: 'nansen',
		name: 'Nansen',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.nansen.description',
		url: 'https://www.nansen.ai',
		icon: Eye,
		category: 'analytics',
		tags: ['wallet', 'analytics', 'smart-money', 'labels'],
		color: '#3861FB',
		isFeatured: true
	},
	{
		id: 'arkham',
		name: 'Arkham Intelligence',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.arkham.description',
		url: 'https://platform.arkhamintelligence.com',
		icon: Database,
		category: 'analytics',
		tags: ['wallet', 'tracking', 'intelligence', 'labels'],
		color: '#000000'
	},

	// ========== Token & Market Analytics ==========
	{
		id: 'token-terminal',
		name: 'Token Terminal',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.token_terminal.description',
		url: 'https://tokenterminal.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['metrics', 'revenue', 'fundamentals', 'protocols'],
		color: '#00C2FF'
	},
	{
		id: 'ultrasound',
		name: 'ultrasound.money',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.ultrasound.description',
		url: 'https://ultrasound.money',
		icon: Activity,
		category: 'analytics',
		tags: ['eth', 'burn', 'supply', 'issuance'],
		color: '#7C3AED'
	},
	{
		id: 'coingecko',
		name: 'CoinGecko',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.coingecko.description',
		url: 'https://www.coingecko.com',
		icon: PieChart,
		category: 'analytics',
		tags: ['price', 'market-cap', 'tokens', 'charts'],
		color: '#8DC63F'
	},
	{
		id: 'coinmarketcap',
		name: 'CoinMarketCap',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.coinmarketcap.description',
		url: 'https://coinmarketcap.com',
		icon: LineChart,
		category: 'analytics',
		tags: ['price', 'market-cap', 'ranking'],
		color: '#3861FB'
	},

	// ========== On-Chain Analytics ==========
	{
		id: 'glassnode',
		name: 'Glassnode',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.glassnode.description',
		url: 'https://glassnode.com',
		icon: Database,
		category: 'analytics',
		tags: ['on-chain', 'metrics', 'bitcoin', 'ethereum'],
		color: '#1EB67F'
	},
	{
		id: 'santiment',
		name: 'Santiment',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.santiment.description',
		url: 'https://santiment.net',
		icon: Activity,
		category: 'analytics',
		tags: ['on-chain', 'social', 'sentiment', 'signals'],
		color: '#14C393'
	},

	// ========== DEX Analytics ==========
	{
		id: 'dexscreener',
		name: 'DEX Screener',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.dexscreener.description',
		url: 'https://dexscreener.com',
		icon: Scan,
		category: 'analytics',
		tags: ['dex', 'charts', 'pairs', 'real-time'],
		color: '#00E396'
	},
	{
		id: 'defined',
		name: 'Defined.fi',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.defined.description',
		url: 'https://www.defined.fi',
		icon: BarChart3,
		category: 'analytics',
		tags: ['dex', 'analytics', 'tokens', 'trending'],
		color: '#FF6B6B'
	},
	{
		id: 'bubblemaps',
		name: 'Bubblemaps',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.bubblemaps.description',
		url: 'https://bubblemaps.io',
		icon: PieChart,
		category: 'analytics',
		tags: ['holder', 'distribution', 'visualization', 'whales'],
		color: '#8B5CF6'
	},

	// ========== L2 Analytics ==========
	{
		id: 'l2beat',
		name: 'L2BEAT',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.l2beat.description',
		url: 'https://l2beat.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['l2', 'rollup', 'tvl', 'risk'],
		color: '#7E41CC'
	},
	{
		id: 'growthepie',
		name: 'growthepie',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.growthepie.description',
		url: 'https://growthepie.xyz',
		icon: PieChart,
		category: 'analytics',
		tags: ['l2', 'analytics', 'comparison', 'metrics'],
		color: '#A3E635'
	},

	// ========== Research Platforms ==========
	{
		id: 'messari',
		name: 'Messari',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.messari.description',
		url: 'https://messari.io',
		icon: FileText,
		category: 'analytics',
		tags: ['research', 'data', 'reports', 'fundamentals'],
		color: '#FFFFFF'
	},

	// ========== Data Platforms ==========
	{
		id: 'tokenterminal',
		name: 'Token Terminal',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.tokenterminal.description',
		url: 'https://tokenterminal.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['fundamentals', 'revenue', 'metrics', 'finance'],
		color: '#050505'
	},
	{
		id: 'artemis',
		name: 'Artemis',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.artemis.description',
		url: 'https://app.artemis.xyz',
		icon: BarChart3,
		category: 'analytics',
		tags: ['fundamentals', 'revenue', 'developer-activity'],
		color: '#FF6B35'
	},
	{
		id: 'dappradar',
		name: 'DappRadar',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.dappradar.description',
		url: 'https://dappradar.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['dapp', 'ranking', 'nft', 'defi'],
		color: '#7C3AED'
	},
	{
		id: 'ethburned',
		name: 'Watch The Burn',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.ethburned.description',
		url: 'https://watchtheburn.com',
		icon: Flame,
		category: 'analytics',
		tags: ['ethereum', 'eip1559', 'burn', 'gas'],
		color: '#F97316'
	},
	{
		id: 'parsec',
		name: 'Parsec Finance',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.parsec.description',
		url: 'https://parsec.fi',
		icon: BarChart3,
		category: 'analytics',
		tags: ['defi', 'dashboard', 'alerts', 'pro'],
		color: '#7C3AED'
	},
	{
		id: 'eigenexplorer',
		name: 'EigenExplorer',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.eigenexplorer.description',
		url: 'https://eigenexplorer.com',
		icon: Layers,
		category: 'analytics',
		tags: ['eigenlayer', 'restaking', 'avs', 'operators'],
		color: '#1E0555'
	},

	// ========== SQL & Dashboard Platforms ==========
	{
		id: 'flipside',
		name: 'Flipside Crypto',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.flipside.description',
		url: 'https://flipsidecrypto.xyz',
		icon: BarChart3,
		category: 'analytics',
		tags: ['analytics', 'sql', 'data', 'dashboard'],
		color: '#00C2FF'
	},
	{
		id: 'footprint',
		name: 'Footprint Analytics',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.footprint.description',
		url: 'https://www.footprint.network',
		icon: BarChart3,
		category: 'analytics',
		tags: ['analytics', 'no-code', 'dashboard', 'data'],
		color: '#5C5CFF'
	},
	{
		id: 'defi-pulse',
		name: 'DeFi Pulse',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.defi_pulse.description',
		url: 'https://defipulse.com',
		icon: Activity,
		category: 'analytics',
		tags: ['tvl', 'defi', 'rankings', 'analytics'],
		color: '#00D395'
	},

	// ========== Fee Analytics ==========
	{
		id: 'l2fees',
		name: 'L2Fees',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.l2fees.description',
		url: 'https://l2fees.info',
		icon: BarChart3,
		category: 'analytics',
		tags: ['l2', 'fees', 'comparison', 'gas'],
		color: '#4F46E5'
	},
	{
		id: 'cryptofees',
		name: 'CryptoFees',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.cryptofees.description',
		url: 'https://cryptofees.info',
		icon: BarChart3,
		category: 'analytics',
		tags: ['fees', 'revenue', 'protocols', 'analytics'],
		color: '#00D395'
	},

	// ========== Wallet & Whale Tracking ==========
	{
		id: 'watchers',
		name: 'Watchers',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.watchers.description',
		url: 'https://watchers.pro',
		icon: Eye,
		category: 'analytics',
		tags: ['whale', 'tracking', 'alerts', 'wallets'],
		color: '#6366F1'
	},
	{
		id: 'cielo',
		name: 'Cielo',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.cielo.description',
		url: 'https://cielo.finance',
		icon: Eye,
		category: 'analytics',
		tags: ['wallet', 'tracking', 'feed', 'social'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#3B82F6'
	},

	// ========== APIs & SDKs ==========
	{
		id: 'zerion-api',
		name: 'Zerion DeFi SDK',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.zerion_api.description',
		url: 'https://developers.zerion.io',
		icon: BarChart3,
		category: 'analytics',
		tags: ['api', 'portfolio', 'defi', 'sdk'],
		color: '#2962FF'
	},
	{
		id: 'sim-farm',
		name: 'DeFi Simulator',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.sim_farm.description',
		url: 'https://simfarm.co',
		icon: Activity,
		category: 'analytics',
		tags: ['simulation', 'yield', 'farming', 'calculator'],
		color: '#10B981'
	},
	{
		id: 'openbb',
		name: 'OpenBB',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.openbb.description',
		url: 'https://openbb.co',
		icon: BarChart3,
		category: 'analytics',
		tags: ['terminal', 'research', 'analysis', 'open-source'],
		color: '#14B8A6'
	},

	// ========== Yield Analytics ==========
	{
		id: 'defillama_yields',
		name: 'DefiLlama Yields',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.defillama_yields.description',
		url: 'https://defillama.com/yields',
		icon: BarChart3,
		category: 'analytics',
		tags: ['yields', 'apy', 'farming', 'comparison'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BNB Chain'],
		color: '#2172E5'
	},
	{
		id: 'defilabs',
		name: 'DeFi Labs',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.defilabs.description',
		url: 'https://defilabs.gg',
		icon: BarChart3,
		category: 'analytics',
		tags: ['analytics', 'whale', 'smart-money', 'tracking'],
		chains: ['Ethereum', 'Solana'],
		color: '#F97316'
	},
	{
		id: 'chainanalytics',
		name: 'Chain Analytics',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.chainanalytics.description',
		url: 'https://chainanalytics.xyz',
		icon: BarChart3,
		category: 'analytics',
		tags: ['analytics', 'dashboards', 'custom', 'data'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#3B82F6'
	},

	// ========== Indexing & Data Infrastructure ==========
	{
		id: 'the_graph',
		name: 'The Graph',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.the_graph.description',
		url: 'https://thegraph.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['indexing', 'subgraph', 'api', 'decentralized'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BNB Chain', 'Avalanche'],
		color: '#6747ED'
	},
	{
		id: 'space_and_time',
		name: 'Space and Time',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.space_and_time.description',
		url: 'https://spaceandtime.io',
		icon: BarChart3,
		category: 'analytics',
		tags: ['data-warehouse', 'zk', 'sql', 'verifiable'],
		chains: ['Ethereum', 'Polygon', 'Sui', 'Avalanche'],
		color: '#7C3AED'
	},
	{
		id: 'allium',
		name: 'Allium',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.allium.description',
		url: 'https://allium.so',
		icon: BarChart3,
		category: 'analytics',
		tags: ['data', 'analytics', 'enterprise', 'real-time'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Solana'],
		color: '#F97316'
	},
	{
		id: 'sentio',
		name: 'Sentio',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.sentio.description',
		url: 'https://sentio.xyz',
		icon: BarChart3,
		category: 'analytics',
		tags: ['observability', 'monitoring', 'debugging', 'multichain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BNB Chain', 'Aptos', 'Sui'],
		color: '#3B82F6'
	},

	// ========== New Analytics Tools ==========
	{
		id: 'cookie3',
		name: 'Cookie3',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.cookie3.description',
		url: 'https://cookie3.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['marketing', 'attribution', 'web3', 'analytics'],
		color: '#F97316'
	},
	{
		id: 'chainbeat',
		name: 'ChainBeat',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.chainbeat.description',
		url: 'https://chainbeat.io',
		icon: BarChart3,
		category: 'analytics',
		tags: ['dashboards', 'metrics', 'protocols', 'tracking'],
		color: '#8B5CF6'
	},
	{
		id: 'bitquery',
		name: 'Bitquery',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.bitquery.description',
		url: 'https://bitquery.io',
		icon: BarChart3,
		category: 'analytics',
		tags: ['api', 'graphql', 'multichain', 'data'],
		color: '#3B82F6'
	},
	{
		id: 'whale-alert',
		name: 'Whale Alert',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.whale_alert.description',
		url: 'https://whale-alert.io',
		icon: BarChart3,
		category: 'analytics',
		tags: ['whale', 'tracking', 'alerts', 'transfers'],
		color: '#06B6D4'
	},
	{
		id: 'intotheblock',
		name: 'IntoTheBlock',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.intotheblock.description',
		url: 'https://intotheblock.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['signals', 'indicators', 'defi', 'on-chain'],
		color: '#10B981'
	},
	{
		id: 'laevitas',
		name: 'Laevitas',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.laevitas.description',
		url: 'https://laevitas.ch',
		icon: LineChart,
		category: 'analytics',
		tags: ['derivatives', 'options', 'futures', 'analytics'],
		color: '#EF4444'
	},
	{
		id: 'kaiko',
		name: 'Kaiko',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.kaiko.description',
		url: 'https://kaiko.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['market-data', 'institutional', 'api', 'pricing'],
		color: '#1E40AF'
	},
	{
		id: 'amberdata',
		name: 'Amberdata',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.amberdata.description',
		url: 'https://amberdata.io',
		icon: BarChart3,
		category: 'analytics',
		tags: ['api', 'defi', 'market-data', 'enterprise'],
		color: '#F59E0B'
	},
	{
		id: 'blockpour',
		name: 'Blockpour',
		descriptionKey: 'routes/apps/chain-tools/analytics.tools.blockpour.description',
		url: 'https://blockpour.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['real-time', 'streaming', 'multichain', 'api'],
		color: '#7C3AED'
	}
];
