/**
 * DeFi Tools - Decentralized Finance protocols and platforms
 */
import {
	Repeat,
	Landmark,
	Zap,
	Activity,
	Droplets,
	CircleDollarSign,
	Banknote,
	LineChart,
	TrendingUp,
	Layers,
	Gauge,
	Percent,
	DollarSign,
	Sparkles,
	Box,
	Hexagon,
	Flame,
	Target,
	RefreshCw,
	Coins,
	Award,
	Hash,
	GitBranch,
	Globe,
	Shield
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const defiTools: ExternalTool[] = [
	// ========== Core DEXs & AMMs ==========
	{
		id: 'uniswap',
		name: 'Uniswap',
		descriptionKey: 'chain_tools.tools.uniswap.description',
		url: 'https://app.uniswap.org',
		icon: Repeat,
		category: 'defi',
		tags: ['swap', 'dex', 'amm', 'liquidity'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#FF007A',
		isFeatured: true
	},
	{
		id: 'aave',
		name: 'Aave',
		descriptionKey: 'chain_tools.tools.aave.description',
		url: 'https://app.aave.com',
		icon: Landmark,
		category: 'defi',
		tags: ['lending', 'borrowing', 'defi', 'yield'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche'],
		color: '#B6509E',
		isFeatured: true
	},
	{
		id: '1inch',
		name: '1inch',
		descriptionKey: 'chain_tools.tools.1inch.description',
		url: 'https://app.1inch.io',
		icon: Zap,
		category: 'defi',
		tags: ['aggregator', 'swap', 'dex', 'best-price'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#1B314F'
	},
	{
		id: 'curve',
		name: 'Curve',
		descriptionKey: 'chain_tools.tools.curve.description',
		url: 'https://curve.fi',
		icon: Activity,
		category: 'defi',
		tags: ['stablecoin', 'swap', 'amm', 'yield'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#FF0000'
	},
	{
		id: 'lido',
		name: 'Lido',
		descriptionKey: 'chain_tools.tools.lido.description',
		url: 'https://lido.fi',
		icon: Droplets,
		category: 'defi',
		tags: ['staking', 'liquid-staking', 'eth', 'steth'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#00A3FF'
	},
	{
		id: 'compound',
		name: 'Compound',
		descriptionKey: 'chain_tools.tools.compound.description',
		url: 'https://compound.finance',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['lending', 'borrowing', 'defi', 'interest'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Base'],
		color: '#00D395'
	},
	{
		id: 'maker',
		name: 'MakerDAO',
		descriptionKey: 'chain_tools.tools.maker.description',
		url: 'https://makerdao.com',
		icon: Banknote,
		category: 'defi',
		tags: ['stablecoin', 'dai', 'cdp', 'lending'],
		chains: ['Ethereum'],
		color: '#1AAB9B'
	},
	{
		id: 'gmx',
		name: 'GMX',
		descriptionKey: 'chain_tools.tools.gmx.description',
		url: 'https://gmx.io',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'trading', 'derivatives', 'leverage'],
		chains: ['Arbitrum', 'Avalanche'],
		color: '#2D42FC'
	},
	{
		id: 'pancakeswap',
		name: 'PancakeSwap',
		descriptionKey: 'chain_tools.tools.pancakeswap.description',
		url: 'https://pancakeswap.finance',
		icon: Repeat,
		category: 'defi',
		tags: ['swap', 'dex', 'bsc', 'amm'],
		chains: ['BSC', 'Ethereum', 'Arbitrum', 'Base'],
		color: '#1FC7D4'
	},
	{
		id: 'sushiswap',
		name: 'SushiSwap',
		descriptionKey: 'chain_tools.tools.sushiswap.description',
		url: 'https://www.sushi.com',
		icon: Repeat,
		category: 'defi',
		tags: ['swap', 'dex', 'amm', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche'],
		color: '#FA52A0'
	},
	{
		id: 'balancer',
		name: 'Balancer',
		descriptionKey: 'chain_tools.tools.balancer.description',
		url: 'https://balancer.fi',
		icon: Activity,
		category: 'defi',
		tags: ['amm', 'pool', 'liquidity', 'weighted'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#1E1E1E'
	},
	{
		id: 'eigenlayer',
		name: 'EigenLayer',
		descriptionKey: 'chain_tools.tools.eigenlayer.description',
		url: 'https://eigenlayer.xyz',
		icon: Layers,
		category: 'defi',
		tags: ['restaking', 'avs', 'security', 'ethereum'],
		chains: ['Ethereum'],
		color: '#6C5CE7'
	},

	// ========== Perpetuals & Derivatives ==========
	{
		id: 'dydx',
		name: 'dYdX',
		descriptionKey: 'chain_tools.tools.dydx.description',
		url: 'https://dydx.exchange',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'derivatives', 'trading', 'margin'],
		chains: ['dYdX Chain'],
		color: '#6966FF'
	},
	{
		id: 'convex',
		name: 'Convex Finance',
		descriptionKey: 'chain_tools.tools.convex.description',
		url: 'https://www.convexfinance.com',
		icon: TrendingUp,
		category: 'defi',
		tags: ['yield', 'curve', 'boost', 'staking'],
		chains: ['Ethereum'],
		color: '#3A3A3A'
	},
	{
		id: 'yearn',
		name: 'Yearn Finance',
		descriptionKey: 'chain_tools.tools.yearn.description',
		url: 'https://yearn.fi',
		icon: Target,
		category: 'defi',
		tags: ['yield', 'vault', 'auto-compound', 'strategy'],
		chains: ['Ethereum', 'Fantom', 'Arbitrum'],
		color: '#006AE3'
	},
	{
		id: 'pendle',
		name: 'Pendle',
		descriptionKey: 'chain_tools.tools.pendle.description',
		url: 'https://www.pendle.finance',
		icon: Percent,
		category: 'defi',
		tags: ['yield', 'tokenization', 'pt', 'yt'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#26BFBF'
	},
	{
		id: 'radiant',
		name: 'Radiant Capital',
		descriptionKey: 'chain_tools.tools.radiant.description',
		url: 'https://radiant.capital',
		icon: Flame,
		category: 'defi',
		tags: ['lending', 'omnichain', 'layerzero'],
		chains: ['Arbitrum', 'BSC'],
		color: '#00D4FF'
	},
	{
		id: 'morpho',
		name: 'Morpho',
		descriptionKey: 'chain_tools.tools.morpho.description',
		url: 'https://morpho.org',
		icon: Hexagon,
		category: 'defi',
		tags: ['lending', 'optimized', 'p2p', 'rates'],
		chains: ['Ethereum', 'Base'],
		color: '#1F77B4'
	},
	{
		id: 'frax',
		name: 'Frax Finance',
		descriptionKey: 'chain_tools.tools.frax.description',
		url: 'https://frax.finance',
		icon: DollarSign,
		category: 'defi',
		tags: ['stablecoin', 'frax', 'algorithmic', 'lending'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism'],
		color: '#000000'
	},
	{
		id: 'rocketpool',
		name: 'Rocket Pool',
		descriptionKey: 'chain_tools.tools.rocketpool.description',
		url: 'https://rocketpool.net',
		icon: Sparkles,
		category: 'defi',
		tags: ['staking', 'eth', 'decentralized', 'node'],
		chains: ['Ethereum'],
		color: '#FF6D32'
	},
	{
		id: 'venus',
		name: 'Venus Protocol',
		descriptionKey: 'chain_tools.tools.venus.description',
		url: 'https://venus.io',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['lending', 'borrowing', 'bsc'],
		chains: ['BSC'],
		color: '#F7B52C'
	},
	{
		id: 'trader-joe',
		name: 'Trader Joe',
		descriptionKey: 'chain_tools.tools.trader_joe.description',
		url: 'https://traderjoexyz.com',
		icon: Repeat,
		category: 'defi',
		tags: ['dex', 'avalanche', 'liquidity-book'],
		chains: ['Avalanche', 'Arbitrum', 'BSC'],
		color: '#F2545B'
	},
	{
		id: 'camelot',
		name: 'Camelot',
		descriptionKey: 'chain_tools.tools.camelot.description',
		url: 'https://camelot.exchange',
		icon: Award,
		category: 'defi',
		tags: ['dex', 'arbitrum', 'launchpad'],
		chains: ['Arbitrum'],
		color: '#AA8929'
	},
	{
		id: 'velodrome',
		name: 'Velodrome',
		descriptionKey: 'chain_tools.tools.velodrome.description',
		url: 'https://velodrome.finance',
		icon: Gauge,
		category: 'defi',
		tags: ['dex', 'optimism', 've-tokenomics'],
		chains: ['Optimism'],
		color: '#4C82FB'
	},
	{
		id: 'aerodrome',
		name: 'Aerodrome',
		descriptionKey: 'chain_tools.tools.aerodrome.description',
		url: 'https://aerodrome.finance',
		icon: Gauge,
		category: 'defi',
		tags: ['dex', 'base', 've-tokenomics'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'maverick',
		name: 'Maverick',
		descriptionKey: 'chain_tools.tools.maverick.description',
		url: 'https://mav.xyz',
		icon: Activity,
		category: 'defi',
		tags: ['dex', 'concentrated-liquidity', 'dynamic'],
		chains: ['Ethereum', 'zkSync', 'Base'],
		color: '#8F47FF'
	},
	{
		id: 'spark',
		name: 'Spark Protocol',
		descriptionKey: 'chain_tools.tools.spark.description',
		url: 'https://spark.fi',
		icon: Sparkles,
		category: 'defi',
		tags: ['lending', 'dai', 'makerdao', 'borrowing'],
		chains: ['Ethereum'],
		color: '#F5AC37'
	},
	{
		id: 'instadapp',
		name: 'Instadapp',
		descriptionKey: 'chain_tools.tools.instadapp.description',
		url: 'https://instadapp.io',
		icon: Box,
		category: 'defi',
		tags: ['aggregator', 'dashboard', 'smart-accounts'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#3F75FF'
	},
	{
		id: 'sommelier',
		name: 'Sommelier',
		descriptionKey: 'chain_tools.tools.sommelier.description',
		url: 'https://www.sommelier.finance',
		icon: Target,
		category: 'defi',
		tags: ['vault', 'strategy', 'yield'],
		chains: ['Ethereum'],
		color: '#8884D8'
	},

	// ========== Lending & Borrowing Extended ==========
	{
		id: 'euler',
		name: 'Euler Finance',
		descriptionKey: 'chain_tools.tools.euler.description',
		url: 'https://www.euler.finance',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['lending', 'permissionless', 'risk-management'],
		chains: ['Ethereum'],
		color: '#E4E7EC'
	},
	{
		id: 'benqi',
		name: 'BENQI',
		descriptionKey: 'chain_tools.tools.benqi.description',
		url: 'https://benqi.fi',
		icon: Banknote,
		category: 'defi',
		tags: ['lending', 'liquid-staking', 'avalanche'],
		chains: ['Avalanche'],
		color: '#00CFFF'
	},
	{
		id: 'silo',
		name: 'Silo Finance',
		descriptionKey: 'chain_tools.tools.silo.description',
		url: 'https://www.silo.finance',
		icon: Box,
		category: 'defi',
		tags: ['lending', 'isolated-markets', 'risk-isolation'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#4B7BF5'
	},
	{
		id: 'abracadabra',
		name: 'Abracadabra',
		descriptionKey: 'chain_tools.tools.abracadabra.description',
		url: 'https://abracadabra.money',
		icon: Sparkles,
		category: 'defi',
		tags: ['lending', 'mim', 'leverage', 'cauldrons'],
		chains: ['Ethereum', 'Arbitrum', 'Avalanche'],
		color: '#7B3FE4'
	},
	{
		id: 'alchemix',
		name: 'Alchemix',
		descriptionKey: 'chain_tools.tools.alchemix.description',
		url: 'https://alchemix.fi',
		icon: Flame,
		category: 'defi',
		tags: ['self-repaying', 'loans', 'yield', 'alUSD'],
		chains: ['Ethereum', 'Optimism'],
		color: '#F5C94C'
	},
	{
		id: 'exactly',
		name: 'Exactly Protocol',
		descriptionKey: 'chain_tools.tools.exactly.description',
		url: 'https://exact.ly',
		icon: Target,
		category: 'defi',
		tags: ['lending', 'fixed-rate', 'variable-rate'],
		chains: ['Ethereum', 'Optimism'],
		color: '#0066FF'
	},

	// ========== DEXs & AMMs Extended ==========
	{
		id: 'kyberswap',
		name: 'KyberSwap',
		descriptionKey: 'chain_tools.tools.kyberswap.description',
		url: 'https://kyberswap.com',
		icon: Repeat,
		category: 'defi',
		tags: ['dex', 'aggregator', 'elastic-pools'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#31CB9E'
	},
	{
		id: 'odos',
		name: 'Odos',
		descriptionKey: 'chain_tools.tools.odos.description',
		url: 'https://odos.xyz',
		icon: GitBranch,
		category: 'defi',
		tags: ['aggregator', 'smart-routing', 'multi-input'],
		chains: ['Ethereum', 'Arbitrum', 'Polygon', 'Optimism'],
		color: '#7C3AED'
	},
	{
		id: 'openocean',
		name: 'OpenOcean',
		descriptionKey: 'chain_tools.tools.openocean.description',
		url: 'https://openocean.finance',
		icon: Globe,
		category: 'defi',
		tags: ['aggregator', 'cross-chain', 'best-price'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Avalanche'],
		color: '#1B68D1'
	},
	{
		id: 'hashflow',
		name: 'Hashflow',
		descriptionKey: 'chain_tools.tools.hashflow.description',
		url: 'https://www.hashflow.com',
		icon: Hash,
		category: 'defi',
		tags: ['dex', 'rfq', 'mev-protected', 'cross-chain'],
		chains: ['Ethereum', 'Arbitrum', 'Polygon', 'Avalanche'],
		color: '#3B82F6'
	},
	{
		id: 'syncswap',
		name: 'SyncSwap',
		descriptionKey: 'chain_tools.tools.syncswap.description',
		url: 'https://syncswap.xyz',
		icon: RefreshCw,
		category: 'defi',
		tags: ['dex', 'zksync', 'concentrated-liquidity'],
		chains: ['zkSync Era'],
		color: '#2ED5A8'
	},
	{
		id: 'mute',
		name: 'Mute.io',
		descriptionKey: 'chain_tools.tools.mute.description',
		url: 'https://mute.io',
		icon: Activity,
		category: 'defi',
		tags: ['dex', 'zksync', 'amplifier'],
		chains: ['zkSync Era'],
		color: '#00D4FF'
	},
	{
		id: 'spacefi',
		name: 'SpaceFi',
		descriptionKey: 'chain_tools.tools.spacefi.description',
		url: 'https://spacefi.io',
		icon: Sparkles,
		category: 'defi',
		tags: ['dex', 'zksync', 'farm'],
		chains: ['zkSync Era'],
		color: '#1F1F1F'
	},
	{
		id: 'ramses',
		name: 'Ramses Exchange',
		descriptionKey: 'chain_tools.tools.ramses.description',
		url: 'https://www.ramses.exchange',
		icon: Gauge,
		category: 'defi',
		tags: ['dex', 'arbitrum', 've-tokenomics'],
		chains: ['Arbitrum'],
		color: '#F7931A'
	},
	{
		id: 'thena',
		name: 'THENA',
		descriptionKey: 'chain_tools.tools.thena.description',
		url: 'https://thena.fi',
		icon: Gauge,
		category: 'defi',
		tags: ['dex', 'bsc', 've-tokenomics'],
		chains: ['BSC'],
		color: '#CD7F32'
	},
	{
		id: 'baseswap',
		name: 'BaseSwap',
		descriptionKey: 'chain_tools.tools.baseswap.description',
		url: 'https://baseswap.fi',
		icon: Repeat,
		category: 'defi',
		tags: ['dex', 'base', 'farm'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'woofi',
		name: 'WOOFi',
		descriptionKey: 'chain_tools.tools.woofi.description',
		url: 'https://fi.woo.org',
		icon: TrendingUp,
		category: 'defi',
		tags: ['dex', 'cross-chain', 'low-slippage'],
		chains: ['Ethereum', 'Arbitrum', 'Polygon', 'BSC'],
		color: '#21C7A8'
	},

	// ========== Perpetuals & Derivatives Extended ==========
	{
		id: 'gains',
		name: 'Gains Network',
		descriptionKey: 'chain_tools.tools.gains.description',
		url: 'https://gains.trade',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'leverage', 'synthetic'],
		chains: ['Polygon', 'Arbitrum'],
		color: '#5C28A9'
	},
	{
		id: 'level',
		name: 'Level Finance',
		descriptionKey: 'chain_tools.tools.level.description',
		url: 'https://level.finance',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'leverage', 'bsc'],
		chains: ['BSC', 'Arbitrum'],
		color: '#E6D465'
	},
	{
		id: 'mux',
		name: 'MUX Protocol',
		descriptionKey: 'chain_tools.tools.mux.description',
		url: 'https://mux.network',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'aggregator', 'leverage'],
		chains: ['Arbitrum', 'BSC', 'Avalanche'],
		color: '#4EA8DE'
	},
	{
		id: 'vertex',
		name: 'Vertex Protocol',
		descriptionKey: 'chain_tools.tools.vertex.description',
		url: 'https://vertexprotocol.com',
		icon: Activity,
		category: 'defi',
		tags: ['perpetuals', 'spot', 'money-market'],
		chains: ['Arbitrum'],
		color: '#8B5CF6'
	},
	{
		id: 'hyperliquid',
		name: 'Hyperliquid',
		descriptionKey: 'chain_tools.tools.hyperliquid.description',
		url: 'https://hyperliquid.xyz',
		icon: Zap,
		category: 'defi',
		tags: ['perpetuals', 'orderbook', 'l1'],
		chains: ['Hyperliquid'],
		color: '#00FF88'
	},
	{
		id: 'aevo',
		name: 'Aevo',
		descriptionKey: 'chain_tools.tools.aevo.description',
		url: 'https://www.aevo.xyz',
		icon: LineChart,
		category: 'defi',
		tags: ['options', 'perpetuals', 'orderbook'],
		chains: ['Aevo L2'],
		color: '#FFD700'
	},
	{
		id: 'lyra',
		name: 'Lyra Finance',
		descriptionKey: 'chain_tools.tools.lyra.description',
		url: 'https://www.lyra.finance',
		icon: LineChart,
		category: 'defi',
		tags: ['options', 'amm', 'derivatives'],
		chains: ['Optimism', 'Arbitrum'],
		color: '#38BDF8'
	},
	{
		id: 'dopex',
		name: 'Dopex',
		descriptionKey: 'chain_tools.tools.dopex.description',
		url: 'https://www.dopex.io',
		icon: Target,
		category: 'defi',
		tags: ['options', 'ssov', 'atlantic'],
		chains: ['Arbitrum'],
		color: '#4ECDC4'
	},
	{
		id: 'premia',
		name: 'Premia',
		descriptionKey: 'chain_tools.tools.premia.description',
		url: 'https://premia.blue',
		icon: LineChart,
		category: 'defi',
		tags: ['options', 'vaults', 'defi'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#0066FF'
	},

	// ========== Yield & Vaults ==========
	{
		id: 'beefy',
		name: 'Beefy Finance',
		descriptionKey: 'chain_tools.tools.beefy.description',
		url: 'https://beefy.com',
		icon: TrendingUp,
		category: 'defi',
		tags: ['yield', 'auto-compound', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#5A8F35'
	},
	{
		id: 'harvest',
		name: 'Harvest Finance',
		descriptionKey: 'chain_tools.tools.harvest.description',
		url: 'https://harvest.finance',
		icon: TrendingUp,
		category: 'defi',
		tags: ['yield', 'farming', 'auto-compound'],
		chains: ['Ethereum', 'Polygon', 'BSC'],
		color: '#F2A52B'
	},
	{
		id: 'pickle',
		name: 'Pickle Finance',
		descriptionKey: 'chain_tools.tools.pickle.description',
		url: 'https://pickle.finance',
		icon: TrendingUp,
		category: 'defi',
		tags: ['yield', 'jars', 'farms'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#48BB78'
	},
	{
		id: 'concentrator',
		name: 'Concentrator',
		descriptionKey: 'chain_tools.tools.concentrator.description',
		url: 'https://concentrator.aladdin.club',
		icon: Target,
		category: 'defi',
		tags: ['yield', 'curve', 'convex', 'boost'],
		chains: ['Ethereum'],
		color: '#F97316'
	},
	{
		id: 'conic',
		name: 'Conic Finance',
		descriptionKey: 'chain_tools.tools.conic.description',
		url: 'https://conic.finance',
		icon: Activity,
		category: 'defi',
		tags: ['yield', 'curve', 'omnipool'],
		chains: ['Ethereum'],
		color: '#9333EA'
	},
	{
		id: 'sturdy',
		name: 'Sturdy Finance',
		descriptionKey: 'chain_tools.tools.sturdy.description',
		url: 'https://sturdy.finance',
		icon: Shield,
		category: 'defi',
		tags: ['lending', 'yield', 'interest-free'],
		chains: ['Ethereum', 'Fantom'],
		color: '#4F46E5'
	},

	// ========== Liquid Staking ==========
	{
		id: 'stakewise',
		name: 'StakeWise',
		descriptionKey: 'chain_tools.tools.stakewise.description',
		url: 'https://stakewise.io',
		icon: TrendingUp,
		category: 'defi',
		tags: ['staking', 'liquid', 'oseth'],
		chains: ['Ethereum'],
		color: '#6B21A8'
	},
	{
		id: 'frax-ether',
		name: 'Frax Ether',
		descriptionKey: 'chain_tools.tools.frax_ether.description',
		url: 'https://frax.finance/frxeth',
		icon: TrendingUp,
		category: 'defi',
		tags: ['staking', 'liquid', 'frxeth', 'sfrxeth'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'stader',
		name: 'Stader Labs',
		descriptionKey: 'chain_tools.tools.stader.description',
		url: 'https://www.staderlabs.com',
		icon: TrendingUp,
		category: 'defi',
		tags: ['staking', 'liquid', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'BSC'],
		color: '#60A5FA'
	},
	{
		id: 'mantle-lsp',
		name: 'Mantle LSP',
		descriptionKey: 'chain_tools.tools.mantle_lsp.description',
		url: 'https://meth.mantle.xyz',
		icon: TrendingUp,
		category: 'defi',
		tags: ['staking', 'liquid', 'meth'],
		chains: ['Ethereum', 'Mantle'],
		color: '#000000'
	},
	{
		id: 'renzo',
		name: 'Renzo Protocol',
		descriptionKey: 'chain_tools.tools.renzo.description',
		url: 'https://www.renzoprotocol.com',
		icon: Layers,
		category: 'defi',
		tags: ['restaking', 'ezeth', 'eigenlayer'],
		chains: ['Ethereum'],
		color: '#6366F1'
	},
	{
		id: 'etherfi',
		name: 'ether.fi',
		descriptionKey: 'chain_tools.tools.etherfi.description',
		url: 'https://www.ether.fi',
		icon: Layers,
		category: 'defi',
		tags: ['staking', 'restaking', 'eeth'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'puffer',
		name: 'Puffer Finance',
		descriptionKey: 'chain_tools.tools.puffer.description',
		url: 'https://www.puffer.fi',
		icon: Shield,
		category: 'defi',
		tags: ['restaking', 'pufeth', 'eigenlayer'],
		chains: ['Ethereum'],
		color: '#00D4AA'
	},
	{
		id: 'kelp',
		name: 'Kelp DAO',
		descriptionKey: 'chain_tools.tools.kelp.description',
		url: 'https://kelpdao.xyz',
		icon: Layers,
		category: 'defi',
		tags: ['restaking', 'rseth', 'eigenlayer'],
		chains: ['Ethereum'],
		color: '#22C55E'
	},

	// ========== Stablecoins ==========
	{
		id: 'liquity',
		name: 'Liquity',
		descriptionKey: 'chain_tools.tools.liquity.description',
		url: 'https://www.liquity.org',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['stablecoin', 'lusd', 'borrowing', 'collateral'],
		chains: ['Ethereum'],
		color: '#2EB6EA'
	},
	{
		id: 'reflexer',
		name: 'Reflexer',
		descriptionKey: 'chain_tools.tools.reflexer.description',
		url: 'https://reflexer.finance',
		icon: RefreshCw,
		category: 'defi',
		tags: ['rai', 'stablecoin', 'algorithmic', 'non-pegged'],
		chains: ['Ethereum'],
		color: '#4AE3A7'
	},
	{
		id: 'mstable',
		name: 'mStable',
		descriptionKey: 'chain_tools.tools.mstable.description',
		url: 'https://mstable.org',
		icon: Coins,
		category: 'defi',
		tags: ['stablecoin', 'savings', 'meta-asset', 'yield'],
		chains: ['Ethereum', 'Polygon'],
		color: '#000000'
	},
	{
		id: 'raft',
		name: 'Raft',
		descriptionKey: 'chain_tools.tools.raft.description',
		url: 'https://raft.fi',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['stablecoin', 'r-stablecoin', 'lsd', 'borrowing'],
		chains: ['Ethereum'],
		color: '#0052FF'
	},
	{
		id: 'prisma',
		name: 'Prisma Finance',
		descriptionKey: 'chain_tools.tools.prisma.description',
		url: 'https://prismafinance.com',
		icon: Hexagon,
		category: 'defi',
		tags: ['stablecoin', 'mkusd', 'lsd', 'curve'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'gravita',
		name: 'Gravita Protocol',
		descriptionKey: 'chain_tools.tools.gravita.description',
		url: 'https://www.gravitaprotocol.com',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['stablecoin', 'grai', 'lsd', 'borrowing'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#1E40AF'
	},
	{
		id: 'gyroscope',
		name: 'Gyroscope',
		descriptionKey: 'chain_tools.tools.gyroscope.description',
		url: 'https://gyro.finance',
		icon: RefreshCw,
		category: 'defi',
		tags: ['stablecoin', 'gysd', 'reserve', 'metastablecoin'],
		chains: ['Ethereum', 'Polygon'],
		color: '#00D395'
	},
	{
		id: 'origin-dollar',
		name: 'Origin Dollar',
		descriptionKey: 'chain_tools.tools.origin_dollar.description',
		url: 'https://www.ousd.com',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['stablecoin', 'ousd', 'yield', 'rebasing'],
		chains: ['Ethereum'],
		color: '#0074F0'
	},
	{
		id: 'angle',
		name: 'Angle Protocol',
		descriptionKey: 'chain_tools.tools.angle.description',
		url: 'https://angle.money',
		icon: Coins,
		category: 'defi',
		tags: ['stablecoin', 'euro', 'ageur', 'forex'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#FF6B00'
	},

	// ========== Aggregators ==========
	{
		id: 'paraswap',
		name: 'ParaSwap',
		descriptionKey: 'chain_tools.tools.paraswap.description',
		url: 'https://paraswap.io',
		icon: Repeat,
		category: 'defi',
		tags: ['aggregator', 'swap', 'dex', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism', 'Avalanche'],
		color: '#0058F7'
	},
	{
		id: 'matcha',
		name: 'Matcha',
		descriptionKey: 'chain_tools.tools.matcha.description',
		url: 'https://matcha.xyz',
		icon: Repeat,
		category: 'defi',
		tags: ['aggregator', 'swap', '0x', 'dex'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism', 'Avalanche'],
		color: '#22C55E'
	},
	{
		id: 'cowswap',
		name: 'CoW Swap',
		descriptionKey: 'chain_tools.tools.cowswap.description',
		url: 'https://swap.cow.fi',
		icon: Repeat,
		category: 'defi',
		tags: ['aggregator', 'mev-protection', 'swap', 'batch-auction'],
		chains: ['Ethereum', 'Gnosis'],
		color: '#012F6A'
	},
	{
		id: 'bebop',
		name: 'Bebop',
		descriptionKey: 'chain_tools.tools.bebop.description',
		url: 'https://bebop.xyz',
		icon: Repeat,
		category: 'defi',
		tags: ['aggregator', 'swap', 'multi-token', 'gasless'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'BSC'],
		color: '#6366F1'
	},
	{
		id: 'dodo',
		name: 'DODO',
		descriptionKey: 'chain_tools.tools.dodo.description',
		url: 'https://dodoex.io',
		icon: Repeat,
		category: 'defi',
		tags: ['dex', 'pmm', 'liquidity', 'crowdpooling'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum'],
		color: '#FFE804'
	},
	{
		id: 'clipper',
		name: 'Clipper',
		descriptionKey: 'chain_tools.tools.clipper.description',
		url: 'https://clipper.exchange',
		icon: Repeat,
		category: 'defi',
		tags: ['dex', 'retail', 'small-trades', 'low-slippage'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#00D395'
	},
	{
		id: 'woofi-pro',
		name: 'WOOFi Pro',
		descriptionKey: 'chain_tools.tools.woofi_pro.description',
		url: 'https://pro.woo.org',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'trading', 'orderbook', 'derivatives'],
		chains: ['Arbitrum'],
		color: '#00C8B0'
	},

	// ========== Vaults Extended ==========
	{
		id: 'bentobox',
		name: 'BentoBox',
		descriptionKey: 'chain_tools.tools.bentobox.description',
		url: 'https://app.sushi.com/bentobox',
		icon: Box,
		category: 'defi',
		tags: ['vault', 'yield', 'lending', 'sushi'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#0E0F23'
	},
	{
		id: 'ribbon',
		name: 'Ribbon Finance',
		descriptionKey: 'chain_tools.tools.ribbon.description',
		url: 'https://app.ribbon.finance',
		icon: TrendingUp,
		category: 'defi',
		tags: ['options', 'vault', 'structured-products', 'yield'],
		chains: ['Ethereum', 'Avalanche', 'Solana'],
		color: '#FC0A54'
	},
	{
		id: 'opyn',
		name: 'Opyn',
		descriptionKey: 'chain_tools.tools.opyn.description',
		url: 'https://www.opyn.co',
		icon: Target,
		category: 'defi',
		tags: ['options', 'derivatives', 'hedging', 'squeeth'],
		chains: ['Ethereum'],
		color: '#2CE49A'
	},
	{
		id: 'notional',
		name: 'Notional Finance',
		descriptionKey: 'chain_tools.tools.notional.description',
		url: 'https://notional.finance',
		icon: Percent,
		category: 'defi',
		tags: ['fixed-rate', 'lending', 'borrowing', 'yield'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#33F8B8'
	},
	{
		id: 'goldfinch',
		name: 'Goldfinch',
		descriptionKey: 'chain_tools.tools.goldfinch.description',
		url: 'https://goldfinch.finance',
		icon: Coins,
		category: 'defi',
		tags: ['real-world', 'lending', 'credit', 'emerging-markets'],
		chains: ['Ethereum'],
		color: '#F9D54B'
	},
	{
		id: 'maple',
		name: 'Maple Finance',
		descriptionKey: 'chain_tools.tools.maple.description',
		url: 'https://maple.finance',
		icon: Landmark,
		category: 'defi',
		tags: ['institutional', 'lending', 'credit', 'undercollateralized'],
		chains: ['Ethereum', 'Solana'],
		color: '#1E40AF'
	},
	{
		id: 'truefi',
		name: 'TrueFi',
		descriptionKey: 'chain_tools.tools.truefi.description',
		url: 'https://truefi.io',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['uncollateralized', 'lending', 'institutional', 'credit'],
		chains: ['Ethereum', 'Optimism'],
		color: '#1A5BFF'
	},
	{
		id: 'tokemak',
		name: 'Tokemak',
		descriptionKey: 'chain_tools.tools.tokemak.description',
		url: 'https://www.tokemak.xyz',
		icon: Droplets,
		category: 'defi',
		tags: ['liquidity', 'reactor', 'yield', 'lp'],
		chains: ['Ethereum'],
		color: '#00D1FF'
	},
	{
		id: 'olympus',
		name: 'Olympus DAO',
		descriptionKey: 'chain_tools.tools.olympus.description',
		url: 'https://app.olympusdao.finance',
		icon: Landmark,
		category: 'defi',
		tags: ['ohm', 'bonding', 'staking', 'reserve-currency'],
		chains: ['Ethereum'],
		color: '#708B96'
	},
	{
		id: 'jones-dao',
		name: 'Jones DAO',
		descriptionKey: 'chain_tools.tools.jones_dao.description',
		url: 'https://www.jonesdao.io',
		icon: TrendingUp,
		category: 'defi',
		tags: ['options', 'vault', 'yield', 'arbitrum'],
		chains: ['Arbitrum'],
		color: '#E87B35'
	},
	{
		id: 'umami',
		name: 'Umami Finance',
		descriptionKey: 'chain_tools.tools.umami.description',
		url: 'https://umami.finance',
		icon: Activity,
		category: 'defi',
		tags: ['yield', 'glp', 'vault', 'arbitrum'],
		chains: ['Arbitrum'],
		color: '#8B5CF6'
	},
	{
		id: 'rage-trade',
		name: 'Rage Trade',
		descriptionKey: 'chain_tools.tools.rage_trade.description',
		url: 'https://www.rage.trade',
		icon: Flame,
		category: 'defi',
		tags: ['perpetuals', 'delta-neutral', 'yield', 'arbitrum'],
		chains: ['Arbitrum'],
		color: '#EF4444'
	},
	{
		id: 'vela',
		name: 'Vela Exchange',
		descriptionKey: 'chain_tools.tools.vela.description',
		url: 'https://www.vela.exchange',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'trading', 'leverage', 'derivatives'],
		chains: ['Arbitrum'],
		color: '#0EA5E9'
	},
	{
		id: 'y2k',
		name: 'Y2K Finance',
		descriptionKey: 'chain_tools.tools.y2k.description',
		url: 'https://www.y2k.finance',
		icon: Shield,
		category: 'defi',
		tags: ['depeg', 'insurance', 'hedging', 'stablecoin'],
		chains: ['Arbitrum'],
		color: '#10B981'
	},
	{
		id: 'kwenta',
		name: 'Kwenta',
		descriptionKey: 'chain_tools.tools.kwenta.description',
		url: 'https://kwenta.io',
		icon: TrendingUp,
		category: 'defi',
		tags: ['perpetuals', 'synthetix', 'trading', 'derivatives'],
		chains: ['Optimism'],
		color: '#FFD75E'
	},
	{
		id: 'polynomial',
		name: 'Polynomial',
		descriptionKey: 'chain_tools.tools.polynomial.description',
		url: 'https://polynomial.fi',
		icon: Activity,
		category: 'defi',
		tags: ['options', 'vault', 'synthetix', 'yield'],
		chains: ['Optimism'],
		color: '#7C3AED'
	},

	// ========== Restaking ==========
	{
		id: 'symbiotic_restaking',
		name: 'Symbiotic',
		descriptionKey: 'chain_tools.tools.symbiotic_restaking.description',
		url: 'https://symbiotic.fi',
		icon: TrendingUp,
		category: 'defi',
		tags: ['restaking', 'modular', 'permissionless', 'security'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'karak',
		name: 'Karak',
		descriptionKey: 'chain_tools.tools.karak.description',
		url: 'https://karak.network',
		icon: TrendingUp,
		category: 'defi',
		tags: ['restaking', 'universal', 'multichain', 'security'],
		chains: ['Ethereum', 'Arbitrum', 'BNB Chain'],
		color: '#F97316'
	},
	{
		id: 'ether_fi',
		name: 'Ether.fi',
		descriptionKey: 'chain_tools.tools.ether_fi.description',
		url: 'https://ether.fi',
		icon: TrendingUp,
		category: 'defi',
		tags: ['liquid-restaking', 'eeth', 'non-custodial', 'defi'],
		chains: ['Ethereum'],
		color: '#6366F1',
		isFeatured: true
	},
	{
		id: 'swell',
		name: 'Swell',
		descriptionKey: 'chain_tools.tools.swell.description',
		url: 'https://swellnetwork.io',
		icon: TrendingUp,
		category: 'defi',
		tags: ['liquid-restaking', 'sweth', 'rsweth', 'defi'],
		chains: ['Ethereum'],
		color: '#0EA5E9'
	},

	// ========== Yield Optimization ==========
	{
		id: 'equilibria',
		name: 'Equilibria',
		descriptionKey: 'chain_tools.tools.equilibria.description',
		url: 'https://equilibria.fi',
		icon: TrendingUp,
		category: 'defi',
		tags: ['yield', 'pendle', 'boosted', 'vaults'],
		chains: ['Ethereum', 'Arbitrum', 'BNB Chain'],
		color: '#8B5CF6'
	},

	// ========== Solana DeFi ==========
	{
		id: 'kamino-finance',
		name: 'Kamino Finance',
		descriptionKey: 'chain_tools.tools.kamino_finance.description',
		url: 'https://kamino.finance',
		icon: TrendingUp,
		category: 'defi',
		tags: ['lending', 'liquidity', 'solana', 'automated'],
		chains: ['Solana'],
		color: '#6366F1'
	},
	{
		id: 'marginfi',
		name: 'marginfi',
		descriptionKey: 'chain_tools.tools.marginfi.description',
		url: 'https://marginfi.com',
		icon: TrendingUp,
		category: 'defi',
		tags: ['lending', 'borrowing', 'solana', 'defi'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'drift-protocol',
		name: 'Drift Protocol',
		descriptionKey: 'chain_tools.tools.drift_protocol.description',
		url: 'https://drift.trade',
		icon: TrendingUp,
		category: 'defi',
		tags: ['perpetuals', 'trading', 'solana', 'orderbook'],
		chains: ['Solana'],
		color: '#E879F9'
	},

	// ========== RWA & Institutional ==========
	{
		id: 'ondo-finance',
		name: 'Ondo Finance',
		descriptionKey: 'chain_tools.tools.ondo_finance.description',
		url: 'https://ondo.finance',
		icon: Landmark,
		category: 'defi',
		tags: ['rwa', 'tokenization', 'treasury', 'institutional'],
		chains: ['Ethereum', 'Polygon'],
		color: '#1E40AF'
	},
	{
		id: 'morpho-blue',
		name: 'Morpho Blue',
		descriptionKey: 'chain_tools.tools.morpho_blue.description',
		url: 'https://morpho.org',
		icon: Landmark,
		category: 'defi',
		tags: ['lending', 'permissionless', 'modular', 'vaults'],
		chains: ['Ethereum', 'Base'],
		color: '#0EA5E9'
	},
	{
		id: 'gearbox-protocol',
		name: 'Gearbox Protocol',
		descriptionKey: 'chain_tools.tools.gearbox_protocol.description',
		url: 'https://gearbox.fi',
		icon: TrendingUp,
		category: 'defi',
		tags: ['leverage', 'composable', 'credit', 'farming'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#7C3AED'
	},
	{
		id: 'extra-finance',
		name: 'Extra Finance',
		descriptionKey: 'chain_tools.tools.extra_finance.description',
		url: 'https://extra.finance',
		icon: TrendingUp,
		category: 'defi',
		tags: ['leverage', 'farming', 'optimism', 'base'],
		chains: ['Optimism', 'Base'],
		color: '#EF4444'
	},
	{
		id: 'fluid-protocol',
		name: 'Fluid',
		descriptionKey: 'chain_tools.tools.fluid_protocol.description',
		url: 'https://fluid.instadapp.io',
		icon: Droplets,
		category: 'defi',
		tags: ['lending', 'dex', 'smart-collateral', 'instadapp'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#3B82F6'
	},
	{
		id: 'reserve-protocol',
		name: 'Reserve Protocol',
		descriptionKey: 'chain_tools.tools.reserve_protocol.description',
		url: 'https://reserve.org',
		icon: Coins,
		category: 'defi',
		tags: ['stablecoin', 'rtoken', 'asset-backed', 'permissionless'],
		chains: ['Ethereum', 'Base'],
		color: '#10B981'
	},
	{
		id: 'term-finance',
		name: 'Term Finance',
		descriptionKey: 'chain_tools.tools.term_finance.description',
		url: 'https://term.finance',
		icon: Landmark,
		category: 'defi',
		tags: ['lending', 'fixed-rate', 'institutional', 'auctions'],
		chains: ['Ethereum'],
		color: '#F59E0B'
	}
];
