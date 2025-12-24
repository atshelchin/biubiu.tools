/**
 * Legendary Token Tools - Tokens that have grown 10x-100x+ from launch and still active
 *
 * Categories:
 * - 100x+ Legendary Tokens (from launch to ATH or current)
 * - 10x-100x Major Growth Tokens
 * - Ecosystem Tokens with Strong Growth
 */
import {
	Rocket,
	TrendingUp,
	Crown,
	Gem,
	Star,
	Flame,
	Zap,
	Award,
	Target,
	Sparkles
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const legendaryTokenTools: ExternalTool[] = [
	// ========== 100x+ Legendary Tokens ==========
	{
		id: 'legend-bnb',
		name: 'BNB (Binance)',
		descriptionKey: 'chain-tools.tools.legend_bnb.description',
		url: 'https://www.binance.com/en/bnb',
		icon: Crown,
		category: 'legendary-token',
		tags: ['100x', 'exchange', 'binance', 'ecosystem', 'legendary'],
		chains: ['BNB Chain'],
		color: '#F0B90B'
	},
	{
		id: 'legend-sol',
		name: 'SOL (Solana)',
		descriptionKey: 'chain-tools.tools.legend_sol.description',
		url: 'https://solana.com',
		icon: Rocket,
		category: 'legendary-token',
		tags: ['100x', 'l1', 'solana', 'high-performance', 'legendary'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'legend-matic',
		name: 'MATIC/POL (Polygon)',
		descriptionKey: 'chain-tools.tools.legend_matic.description',
		url: 'https://polygon.technology',
		icon: Gem,
		category: 'legendary-token',
		tags: ['100x', 'l2', 'polygon', 'scaling', 'legendary'],
		chains: ['Polygon'],
		color: '#8247E5'
	},
	{
		id: 'legend-avax',
		name: 'AVAX (Avalanche)',
		descriptionKey: 'chain-tools.tools.legend_avax.description',
		url: 'https://www.avax.network',
		icon: TrendingUp,
		category: 'legendary-token',
		tags: ['100x', 'l1', 'avalanche', 'subnets', 'legendary'],
		chains: ['Avalanche'],
		color: '#E84142'
	},
	{
		id: 'legend-link',
		name: 'LINK (Chainlink)',
		descriptionKey: 'chain-tools.tools.legend_link.description',
		url: 'https://chain.link',
		icon: Star,
		category: 'legendary-token',
		tags: ['100x', 'oracle', 'chainlink', 'infrastructure', 'legendary'],
		chains: ['Ethereum'],
		color: '#375BD2'
	},
	{
		id: 'legend-uni',
		name: 'UNI (Uniswap)',
		descriptionKey: 'chain-tools.tools.legend_uni.description',
		url: 'https://uniswap.org',
		icon: Sparkles,
		category: 'legendary-token',
		tags: ['10x', 'defi', 'dex', 'airdrop', 'legendary'],
		chains: ['Ethereum'],
		color: '#FF007A'
	},
	{
		id: 'legend-aave',
		name: 'AAVE (Aave)',
		descriptionKey: 'chain-tools.tools.legend_aave.description',
		url: 'https://aave.com',
		icon: TrendingUp,
		category: 'legendary-token',
		tags: ['10x', 'defi', 'lending', 'lend-migration', 'legendary'],
		chains: ['Ethereum'],
		color: '#B6509E'
	},
	{
		id: 'legend-ftm',
		name: 'FTM (Fantom)',
		descriptionKey: 'chain-tools.tools.legend_ftm.description',
		url: 'https://fantom.foundation',
		icon: Flame,
		category: 'legendary-token',
		tags: ['100x', 'l1', 'fantom', 'dag', 'legendary'],
		chains: ['Fantom'],
		color: '#1969FF'
	},
	{
		id: 'legend-atom',
		name: 'ATOM (Cosmos)',
		descriptionKey: 'chain-tools.tools.legend_atom.description',
		url: 'https://cosmos.network',
		icon: Star,
		category: 'legendary-token',
		tags: ['10x', 'l0', 'cosmos', 'ibc', 'interchain'],
		chains: ['Cosmos Hub'],
		color: '#2E3148'
	},
	{
		id: 'legend-near',
		name: 'NEAR (NEAR Protocol)',
		descriptionKey: 'chain-tools.tools.legend_near.description',
		url: 'https://near.org',
		icon: Gem,
		category: 'legendary-token',
		tags: ['10x', 'l1', 'near', 'sharding', 'legendary'],
		chains: ['NEAR'],
		color: '#00C08B'
	},
	{
		id: 'legend-inj',
		name: 'INJ (Injective)',
		descriptionKey: 'chain-tools.tools.legend_inj.description',
		url: 'https://injective.com',
		icon: Rocket,
		category: 'legendary-token',
		tags: ['100x', 'defi', 'injective', 'cosmos', 'legendary'],
		chains: ['Injective'],
		color: '#00F2FE'
	},
	{
		id: 'legend-ton',
		name: 'TON (Toncoin)',
		descriptionKey: 'chain-tools.tools.legend_ton.description',
		url: 'https://ton.org',
		icon: Zap,
		category: 'legendary-token',
		tags: ['100x', 'l1', 'ton', 'telegram', 'legendary'],
		chains: ['TON'],
		color: '#0098EA'
	},
	{
		id: 'legend-sui',
		name: 'SUI (Sui)',
		descriptionKey: 'chain-tools.tools.legend_sui.description',
		url: 'https://sui.io',
		icon: Star,
		category: 'legendary-token',
		tags: ['10x', 'l1', 'sui', 'move', 'legendary'],
		chains: ['Sui'],
		color: '#4DA2FF'
	},
	{
		id: 'legend-apt',
		name: 'APT (Aptos)',
		descriptionKey: 'chain-tools.tools.legend_apt.description',
		url: 'https://aptosfoundation.org',
		icon: Gem,
		category: 'legendary-token',
		tags: ['10x', 'l1', 'aptos', 'move', 'legendary'],
		chains: ['Aptos'],
		color: '#2DD8A3'
	},
	{
		id: 'legend-sei',
		name: 'SEI (Sei)',
		descriptionKey: 'chain-tools.tools.legend_sei.description',
		url: 'https://sei.io',
		icon: Zap,
		category: 'legendary-token',
		tags: ['10x', 'l1', 'sei', 'trading', 'legendary'],
		chains: ['Sei'],
		color: '#9B1C1C'
	},
	// ========== DeFi 10x+ Tokens ==========
	{
		id: 'legend-mkr',
		name: 'MKR (MakerDAO)',
		descriptionKey: 'chain-tools.tools.legend_mkr.description',
		url: 'https://makerdao.com',
		icon: Award,
		category: 'legendary-token',
		tags: ['10x', 'defi', 'stablecoin', 'maker', 'legendary'],
		chains: ['Ethereum'],
		color: '#1AAB9B'
	},
	{
		id: 'legend-snx',
		name: 'SNX (Synthetix)',
		descriptionKey: 'chain-tools.tools.legend_snx.description',
		url: 'https://synthetix.io',
		icon: TrendingUp,
		category: 'legendary-token',
		tags: ['10x', 'defi', 'synthetic', 'synthetix', 'legendary'],
		chains: ['Ethereum', 'Optimism'],
		color: '#00D1FF'
	},
	{
		id: 'legend-crv',
		name: 'CRV (Curve)',
		descriptionKey: 'chain-tools.tools.legend_crv.description',
		url: 'https://curve.fi',
		icon: Star,
		category: 'legendary-token',
		tags: ['10x', 'defi', 'amm', 'stableswap', 'legendary'],
		chains: ['Ethereum'],
		color: '#FF0000'
	},
	{
		id: 'legend-gmx',
		name: 'GMX (GMX)',
		descriptionKey: 'chain-tools.tools.legend_gmx.description',
		url: 'https://gmx.io',
		icon: Rocket,
		category: 'legendary-token',
		tags: ['10x', 'defi', 'perps', 'arbitrum', 'legendary'],
		chains: ['Arbitrum', 'Avalanche'],
		color: '#2E67F4'
	},
	{
		id: 'legend-pendle',
		name: 'PENDLE (Pendle)',
		descriptionKey: 'chain-tools.tools.legend_pendle.description',
		url: 'https://pendle.finance',
		icon: Flame,
		category: 'legendary-token',
		tags: ['100x', 'defi', 'yield', 'points', 'legendary'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#31D8A4'
	},
	{
		id: 'legend-rune',
		name: 'RUNE (THORChain)',
		descriptionKey: 'chain-tools.tools.legend_rune.description',
		url: 'https://thorchain.org',
		icon: Zap,
		category: 'legendary-token',
		tags: ['100x', 'defi', 'cross-chain', 'swap', 'legendary'],
		chains: ['THORChain'],
		color: '#33FF99'
	},
	{
		id: 'legend-dydx',
		name: 'DYDX (dYdX)',
		descriptionKey: 'chain-tools.tools.legend_dydx.description',
		url: 'https://dydx.exchange',
		icon: TrendingUp,
		category: 'legendary-token',
		tags: ['10x', 'defi', 'perps', 'cosmos', 'legendary'],
		chains: ['dYdX Chain'],
		color: '#6966FF'
	},
	// ========== Meme & Community 100x+ ==========
	{
		id: 'legend-shib',
		name: 'SHIB (Shiba Inu)',
		descriptionKey: 'chain-tools.tools.legend_shib.description',
		url: 'https://shibatoken.com',
		icon: Flame,
		category: 'legendary-token',
		tags: ['1000x', 'meme', 'shiba', 'community', 'legendary'],
		chains: ['Ethereum'],
		color: '#FFA409'
	},
	{
		id: 'legend-pepe',
		name: 'PEPE',
		descriptionKey: 'chain-tools.tools.legend_pepe.description',
		url: 'https://www.pepe.vip',
		icon: Sparkles,
		category: 'legendary-token',
		tags: ['1000x', 'meme', 'pepe', '2023', 'legendary'],
		chains: ['Ethereum'],
		color: '#4CAF50'
	},
	{
		id: 'legend-bonk',
		name: 'BONK',
		descriptionKey: 'chain-tools.tools.legend_bonk.description',
		url: 'https://bonkcoin.com',
		icon: Rocket,
		category: 'legendary-token',
		tags: ['1000x', 'meme', 'solana', 'community', 'legendary'],
		chains: ['Solana'],
		color: '#F9A825'
	},
	{
		id: 'legend-wif',
		name: 'WIF (dogwifhat)',
		descriptionKey: 'chain-tools.tools.legend_wif.description',
		url: 'https://dogwifcoin.org',
		icon: Sparkles,
		category: 'legendary-token',
		tags: ['1000x', 'meme', 'solana', '2024', 'legendary'],
		chains: ['Solana'],
		color: '#C2A36B'
	},
	{
		id: 'legend-floki',
		name: 'FLOKI',
		descriptionKey: 'chain-tools.tools.legend_floki.description',
		url: 'https://floki.com',
		icon: Flame,
		category: 'legendary-token',
		tags: ['100x', 'meme', 'floki', 'ecosystem', 'legendary'],
		chains: ['Ethereum', 'BNB Chain'],
		color: '#D4924B'
	},
	// ========== Infrastructure 10x+ ==========
	{
		id: 'legend-arb',
		name: 'ARB (Arbitrum)',
		descriptionKey: 'chain-tools.tools.legend_arb.description',
		url: 'https://arbitrum.io',
		icon: Gem,
		category: 'legendary-token',
		tags: ['10x', 'l2', 'arbitrum', 'rollup', 'legendary'],
		chains: ['Arbitrum'],
		color: '#28A0F0'
	},
	{
		id: 'legend-op',
		name: 'OP (Optimism)',
		descriptionKey: 'chain-tools.tools.legend_op.description',
		url: 'https://optimism.io',
		icon: Star,
		category: 'legendary-token',
		tags: ['10x', 'l2', 'optimism', 'superchain', 'legendary'],
		chains: ['Optimism'],
		color: '#FF0420'
	},
	{
		id: 'legend-stx',
		name: 'STX (Stacks)',
		descriptionKey: 'chain-tools.tools.legend_stx.description',
		url: 'https://stacks.co',
		icon: Zap,
		category: 'legendary-token',
		tags: ['10x', 'bitcoin', 'smart-contracts', 'l2', 'legendary'],
		chains: ['Stacks'],
		color: '#5546FF'
	},
	{
		id: 'legend-tia',
		name: 'TIA (Celestia)',
		descriptionKey: 'chain-tools.tools.legend_tia.description',
		url: 'https://celestia.org',
		icon: Star,
		category: 'legendary-token',
		tags: ['10x', 'modular', 'da', 'celestia', 'legendary'],
		chains: ['Celestia'],
		color: '#7B2BF9'
	},
	{
		id: 'legend-jup',
		name: 'JUP (Jupiter)',
		descriptionKey: 'chain-tools.tools.legend_jup.description',
		url: 'https://jup.ag',
		icon: Rocket,
		category: 'legendary-token',
		tags: ['10x', 'defi', 'aggregator', 'solana', 'legendary'],
		chains: ['Solana'],
		color: '#00D395'
	},
	{
		id: 'legend-pyth',
		name: 'PYTH (Pyth Network)',
		descriptionKey: 'chain-tools.tools.legend_pyth.description',
		url: 'https://pyth.network',
		icon: Target,
		category: 'legendary-token',
		tags: ['10x', 'oracle', 'pyth', 'data', 'legendary'],
		chains: ['Solana', 'Ethereum'],
		color: '#6941C6'
	},
	{
		id: 'legend-render',
		name: 'RNDR (Render)',
		descriptionKey: 'chain-tools.tools.legend_render.description',
		url: 'https://rendernetwork.com',
		icon: Sparkles,
		category: 'legendary-token',
		tags: ['100x', 'ai', 'gpu', 'render', 'legendary'],
		chains: ['Solana'],
		color: '#8B5CF6'
	},
	{
		id: 'legend-fet',
		name: 'FET (Fetch.ai)',
		descriptionKey: 'chain-tools.tools.legend_fet.description',
		url: 'https://fetch.ai',
		icon: Zap,
		category: 'legendary-token',
		tags: ['100x', 'ai', 'agents', 'fetch', 'legendary'],
		chains: ['Ethereum'],
		color: '#1D1D3B'
	},
	// ========== GameFi & NFT 100x+ ==========
	{
		id: 'legend-axs',
		name: 'AXS (Axie Infinity)',
		descriptionKey: 'chain-tools.tools.legend_axs.description',
		url: 'https://axieinfinity.com',
		icon: Flame,
		category: 'legendary-token',
		tags: ['100x', 'gamefi', 'axie', 'play-to-earn', 'legendary'],
		chains: ['Ronin'],
		color: '#1273EA'
	},
	{
		id: 'legend-sand',
		name: 'SAND (Sandbox)',
		descriptionKey: 'chain-tools.tools.legend_sand.description',
		url: 'https://sandbox.game',
		icon: Star,
		category: 'legendary-token',
		tags: ['100x', 'metaverse', 'gaming', 'land', 'legendary'],
		chains: ['Ethereum'],
		color: '#04ADBF'
	},
	{
		id: 'legend-mana',
		name: 'MANA (Decentraland)',
		descriptionKey: 'chain-tools.tools.legend_mana.description',
		url: 'https://decentraland.org',
		icon: Gem,
		category: 'legendary-token',
		tags: ['100x', 'metaverse', 'virtual-world', 'land', 'legendary'],
		chains: ['Ethereum'],
		color: '#FF2D55'
	},
	{
		id: 'legend-gala',
		name: 'GALA (Gala Games)',
		descriptionKey: 'chain-tools.tools.legend_gala.description',
		url: 'https://gala.games',
		icon: Sparkles,
		category: 'legendary-token',
		tags: ['100x', 'gaming', 'ecosystem', 'play-to-earn', 'legendary'],
		chains: ['Ethereum', 'GalaChain'],
		color: '#F59E0B'
	},
	{
		id: 'legend-imx',
		name: 'IMX (Immutable)',
		descriptionKey: 'chain-tools.tools.legend_imx.description',
		url: 'https://immutable.com',
		icon: Rocket,
		category: 'legendary-token',
		tags: ['10x', 'gaming', 'nft', 'l2', 'legendary'],
		chains: ['Immutable X', 'Immutable zkEVM'],
		color: '#00BFBF'
	},
	{
		id: 'legend-blur',
		name: 'BLUR (Blur)',
		descriptionKey: 'chain-tools.tools.legend_blur.description',
		url: 'https://blur.io',
		icon: Flame,
		category: 'legendary-token',
		tags: ['10x', 'nft', 'marketplace', 'airdrop', 'legendary'],
		chains: ['Ethereum'],
		color: '#FF6B00'
	},
	// ========== Tracking & Analytics ==========
	{
		id: 'coingecko-gainers',
		name: 'CoinGecko Top Gainers',
		descriptionKey: 'chain-tools.tools.coingecko_gainers.description',
		url: 'https://www.coingecko.com/en/crypto-gainers-losers',
		icon: TrendingUp,
		category: 'legendary-token',
		tags: ['analytics', 'gainers', 'tracking', 'data'],
		color: '#8DC63F'
	},
	{
		id: 'dexscreener-trending',
		name: 'DEXScreener Trending',
		descriptionKey: 'chain-tools.tools.dexscreener_trending.description',
		url: 'https://dexscreener.com/trending',
		icon: Flame,
		category: 'legendary-token',
		tags: ['analytics', 'trending', 'dex', 'tracking'],
		color: '#00C853'
	},
	{
		id: 'messari-screener',
		name: 'Messari Screener',
		descriptionKey: 'chain-tools.tools.messari_screener.description',
		url: 'https://messari.io/screener',
		icon: Target,
		category: 'legendary-token',
		tags: ['analytics', 'screener', 'research', 'data'],
		color: '#1F2937'
	}
];
