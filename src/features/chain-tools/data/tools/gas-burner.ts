/**
 * Gas Burner Tools - High Gas Consuming Contracts & Protocols
 *
 * Categories:
 * - Top Gas Consumers (DeFi, NFT, MEV)
 * - Gas Tracking & Analytics
 * - Popular High-Activity Protocols
 * - L2 Gas Comparison
 */
import {
	Flame,
	Zap,
	BarChart3,
	Activity,
	TrendingUp,
	Cpu,
	Coins,
	ArrowUpDown,
	Clock,
	Gauge
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const gasBurnerTools: ExternalTool[] = [
	// ========== Gas Analytics & Tracking ==========
	{
		id: 'ultrasound-money',
		name: 'ultrasound.money',
		descriptionKey: 'chain_tools.tools.ultrasound_money.description',
		url: 'https://ultrasound.money',
		icon: Flame,
		category: 'gas-burner',
		tags: ['gas', 'burn', 'eip1559', 'supply', 'analytics'],
		chains: ['Ethereum'],
		color: '#6366F1',
		isFeatured: true
	},
	{
		id: 'etherscan-gastracker',
		name: 'Etherscan Gas Tracker',
		descriptionKey: 'chain_tools.tools.etherscan_gastracker.description',
		url: 'https://etherscan.io/gastracker',
		icon: Gauge,
		category: 'gas-burner',
		tags: ['gas', 'tracker', 'gwei', 'ethereum'],
		chains: ['Ethereum'],
		color: '#21325B',
		isFeatured: true
	},
	{
		id: 'blocknative-gas',
		name: 'Blocknative Gas Estimator',
		descriptionKey: 'chain_tools.tools.blocknative_gas.description',
		url: 'https://www.blocknative.com/gas-estimator',
		icon: Activity,
		category: 'gas-burner',
		tags: ['gas', 'estimator', 'mempool', 'prediction'],
		chains: ['Ethereum'],
		color: '#1652F0'
	},
	{
		id: 'gasnow',
		name: 'GasNow',
		descriptionKey: 'chain_tools.tools.gasnow.description',
		url: 'https://www.gasnow.org',
		icon: Zap,
		category: 'gas-burner',
		tags: ['gas', 'tracker', 'real-time', 'api'],
		chains: ['Ethereum'],
		color: '#00D395'
	},
	{
		id: 'ethgas-watch',
		name: 'ETH Gas.watch',
		descriptionKey: 'chain_tools.tools.ethgas_watch.description',
		url: 'https://ethgas.watch',
		icon: Clock,
		category: 'gas-burner',
		tags: ['gas', 'alerts', 'notification', 'tracker'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'owlracle',
		name: 'Owlracle',
		descriptionKey: 'chain_tools.tools.owlracle.description',
		url: 'https://owlracle.info',
		icon: Activity,
		category: 'gas-burner',
		tags: ['gas', 'multi-chain', 'api', 'oracle'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum'],
		color: '#F59E0B'
	},
	// ========== Top Gas Burning Protocols ==========
	{
		id: 'uniswap-gas',
		name: 'Uniswap (Top Gas Burner)',
		descriptionKey: 'chain_tools.tools.uniswap_gas.description',
		url: 'https://uniswap.org',
		icon: ArrowUpDown,
		category: 'gas-burner',
		tags: ['dex', 'swap', 'amm', 'high-gas'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#FF007A',
		isFeatured: true
	},
	{
		id: 'opensea-gas',
		name: 'OpenSea (NFT Gas Leader)',
		descriptionKey: 'chain_tools.tools.opensea_gas.description',
		url: 'https://opensea.io',
		icon: Coins,
		category: 'gas-burner',
		tags: ['nft', 'marketplace', 'high-gas', 'trading'],
		chains: ['Ethereum', 'Polygon'],
		color: '#2081E2'
	},
	{
		id: 'blur-gas',
		name: 'Blur (NFT Trading Gas)',
		descriptionKey: 'chain_tools.tools.blur_gas.description',
		url: 'https://blur.io',
		icon: Coins,
		category: 'gas-burner',
		tags: ['nft', 'marketplace', 'trading', 'high-gas'],
		chains: ['Ethereum'],
		color: '#FF6B00'
	},
	{
		id: 'tether-gas',
		name: 'Tether (USDT Transfers)',
		descriptionKey: 'chain_tools.tools.tether_gas.description',
		url: 'https://tether.to',
		icon: Coins,
		category: 'gas-burner',
		tags: ['stablecoin', 'transfers', 'high-volume', 'usdt'],
		chains: ['Ethereum'],
		color: '#26A17B'
	},
	{
		id: '1inch-gas',
		name: '1inch (Aggregator Gas)',
		descriptionKey: 'chain_tools.tools.1inch_gas.description',
		url: 'https://1inch.io',
		icon: ArrowUpDown,
		category: 'gas-burner',
		tags: ['dex', 'aggregator', 'swap', 'routing'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#1C1C1C'
	},
	{
		id: 'metamask-swap-gas',
		name: 'MetaMask Swaps',
		descriptionKey: 'chain_tools.tools.metamask_swap_gas.description',
		url: 'https://metamask.io/swaps',
		icon: ArrowUpDown,
		category: 'gas-burner',
		tags: ['swap', 'aggregator', 'wallet', 'high-gas'],
		chains: ['Ethereum', 'Polygon', 'BSC'],
		color: '#E2761B'
	},
	// ========== MEV & Bot Gas Consumers ==========
	{
		id: 'flashbots-gas',
		name: 'Flashbots (MEV Gas)',
		descriptionKey: 'chain_tools.tools.flashbots_gas.description',
		url: 'https://flashbots.net',
		icon: Zap,
		category: 'gas-burner',
		tags: ['mev', 'bundle', 'private-tx', 'searcher'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'banana-gun-gas',
		name: 'Banana Gun',
		descriptionKey: 'chain_tools.tools.banana_gun_gas.description',
		url: 'https://bananagun.io',
		icon: Zap,
		category: 'gas-burner',
		tags: ['trading-bot', 'sniper', 'telegram', 'high-gas'],
		chains: ['Ethereum', 'Solana'],
		color: '#FFE135'
	},
	{
		id: 'maestro-gas',
		name: 'Maestro Bot',
		descriptionKey: 'chain_tools.tools.maestro_gas.description',
		url: 'https://www.maestrobots.com',
		icon: Cpu,
		category: 'gas-burner',
		tags: ['trading-bot', 'sniper', 'telegram', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Solana'],
		color: '#7C3AED'
	},
	{
		id: 'unibot-gas',
		name: 'Unibot',
		descriptionKey: 'chain_tools.tools.unibot_gas.description',
		url: 'https://unibot.app',
		icon: Cpu,
		category: 'gas-burner',
		tags: ['trading-bot', 'telegram', 'sniper', 'copy-trade'],
		chains: ['Ethereum', 'Solana'],
		color: '#8B5CF6'
	},
	// ========== Bridge Gas Consumers ==========
	{
		id: 'across-gas',
		name: 'Across Protocol',
		descriptionKey: 'chain_tools.tools.across_gas.description',
		url: 'https://across.to',
		icon: ArrowUpDown,
		category: 'gas-burner',
		tags: ['bridge', 'cross-chain', 'fast', 'optimistic'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'Base'],
		color: '#2FBCAF'
	},
	{
		id: 'stargate-gas',
		name: 'Stargate Finance',
		descriptionKey: 'chain_tools.tools.stargate_gas.description',
		url: 'https://stargate.finance',
		icon: ArrowUpDown,
		category: 'gas-burner',
		tags: ['bridge', 'layerzero', 'liquidity', 'omnichain'],
		chains: ['Ethereum', 'Arbitrum', 'Polygon', 'BSC'],
		color: '#000000'
	},
	// ========== L2 Gas Comparison ==========
	{
		id: 'l2fees',
		name: 'L2Fees.info',
		descriptionKey: 'chain_tools.tools.l2fees.description',
		url: 'https://l2fees.info',
		icon: BarChart3,
		category: 'gas-burner',
		tags: ['l2', 'fees', 'comparison', 'rollups'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'zkSync'],
		color: '#6366F1',
		isFeatured: true
	},
	{
		id: 'l2beat-gas',
		name: 'L2BEAT Activity',
		descriptionKey: 'chain_tools.tools.l2beat_gas.description',
		url: 'https://l2beat.com/scaling/activity',
		icon: Activity,
		category: 'gas-burner',
		tags: ['l2', 'activity', 'tps', 'analytics'],
		chains: ['Ethereum'],
		color: '#A855F7'
	},
	{
		id: 'rollup-codes',
		name: 'Rollup.codes',
		descriptionKey: 'chain_tools.tools.rollup_codes.description',
		url: 'https://rollup.codes',
		icon: Cpu,
		category: 'gas-burner',
		tags: ['l2', 'opcodes', 'gas', 'comparison'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'zkSync'],
		color: '#3B82F6'
	},
	// ========== Gas Optimization Tools ==========
	{
		id: 'flashbots-protect',
		name: 'Flashbots Protect',
		descriptionKey: 'chain_tools.tools.flashbots_protect.description',
		url: 'https://protect.flashbots.net',
		icon: Zap,
		category: 'gas-burner',
		tags: ['mev-protection', 'private-tx', 'rpc', 'gas-refund'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'txstreet',
		name: 'TxStreet',
		descriptionKey: 'chain_tools.tools.txstreet.description',
		url: 'https://txstreet.com',
		icon: Activity,
		category: 'gas-burner',
		tags: ['visualization', 'mempool', 'blocks', 'live'],
		chains: ['Ethereum', 'Bitcoin'],
		color: '#FFA500'
	},
	{
		id: 'evm-gas-profiler',
		name: 'Tenderly Gas Profiler',
		descriptionKey: 'chain_tools.tools.evm_gas_profiler.description',
		url: 'https://tenderly.co/gas-profiler',
		icon: Cpu,
		category: 'gas-burner',
		tags: ['profiler', 'optimization', 'simulation', 'debug'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#9B59B6'
	},
	// ========== Historical Gas Data ==========
	{
		id: 'etherscan-charts',
		name: 'Etherscan Gas Charts',
		descriptionKey: 'chain_tools.tools.etherscan_charts.description',
		url: 'https://etherscan.io/charts',
		icon: BarChart3,
		category: 'gas-burner',
		tags: ['charts', 'historical', 'gas-price', 'analytics'],
		chains: ['Ethereum'],
		color: '#21325B'
	},
	{
		id: 'dune-gas',
		name: 'Dune Gas Dashboards',
		descriptionKey: 'chain_tools.tools.dune_gas.description',
		url: 'https://dune.com/browse/dashboards?q=gas',
		icon: BarChart3,
		category: 'gas-burner',
		tags: ['dashboards', 'analytics', 'custom', 'sql'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#F97316'
	},
	// ========== Contract-Level Gas Analysis ==========
	{
		id: 'parsec-gas',
		name: 'Parsec Finance',
		descriptionKey: 'chain_tools.tools.parsec_gas.description',
		url: 'https://parsec.finance',
		icon: TrendingUp,
		category: 'gas-burner',
		tags: ['analytics', 'defi', 'gas', 'monitoring'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism'],
		color: '#FF6B6B'
	},
	{
		id: 'rated-network',
		name: 'Rated Network',
		descriptionKey: 'chain_tools.tools.rated_network.description',
		url: 'https://rated.network',
		icon: BarChart3,
		category: 'gas-burner',
		tags: ['staking', 'validators', 'efficiency', 'analytics'],
		chains: ['Ethereum'],
		color: '#10B981'
	}
];
