/**
 * Stablecoin Tools - Major stablecoins and their platforms
 *
 * Categories:
 * - USD-pegged stablecoins (centralized & decentralized)
 * - Algorithmic stablecoins
 * - Yield-bearing stablecoins
 * - Multi-collateral stablecoins
 */
import {
	CircleDollarSign,
	Landmark,
	Coins,
	Shield,
	TrendingUp,
	Globe,
	Zap,
	Lock,
	Percent,
	Building2
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const stablecoinTools: ExternalTool[] = [
	// ========== Major USD Stablecoins ==========
	{
		id: 'usdt-tether',
		name: 'Tether (USDT)',
		descriptionKey: 'chain_tools.tools.usdt_tether.description',
		url: 'https://tether.to',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'centralized', 'largest'],
		chains: ['Ethereum', 'Tron', 'BSC', 'Solana', 'Avalanche', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#26A17B',
		isFeatured: true
	},
	{
		id: 'usdc-circle',
		name: 'USD Coin (USDC)',
		descriptionKey: 'chain_tools.tools.usdc_circle.description',
		url: 'https://www.circle.com/usdc',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'regulated', 'circle'],
		chains: ['Ethereum', 'Solana', 'Avalanche', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#2775CA',
		isFeatured: true
	},
	{
		id: 'dai-makerdao',
		name: 'DAI (MakerDAO)',
		descriptionKey: 'chain_tools.tools.dai_makerdao.description',
		url: 'https://makerdao.com',
		icon: Landmark,
		category: 'stablecoin',
		tags: ['stablecoin', 'decentralized', 'collateralized', 'defi'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Gnosis'],
		color: '#F5AC37',
		isFeatured: true
	},
	{
		id: 'frax',
		name: 'Frax (FRAX)',
		descriptionKey: 'chain_tools.tools.frax.description',
		url: 'https://frax.finance',
		icon: Coins,
		category: 'stablecoin',
		tags: ['stablecoin', 'algorithmic', 'fractional', 'defi'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon', 'Avalanche'],
		color: '#000000'
	},
	{
		id: 'usde-ethena',
		name: 'USDe (Ethena)',
		descriptionKey: 'chain_tools.tools.usde_ethena.description',
		url: 'https://ethena.fi',
		icon: TrendingUp,
		category: 'stablecoin',
		tags: ['stablecoin', 'synthetic', 'yield', 'delta-neutral'],
		chains: ['Ethereum', 'Arbitrum', 'Base'],
		color: '#1E1E1E',
		isFeatured: true
	},
	{
		id: 'usdd-tron',
		name: 'USDD (Tron)',
		descriptionKey: 'chain_tools.tools.usdd_tron.description',
		url: 'https://usdd.io',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'algorithmic', 'tron'],
		chains: ['Tron', 'Ethereum', 'BSC'],
		color: '#FF0000'
	},
	{
		id: 'tusd',
		name: 'TrueUSD (TUSD)',
		descriptionKey: 'chain_tools.tools.tusd.description',
		url: 'https://trueusd.com',
		icon: Shield,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'regulated', 'audited'],
		chains: ['Ethereum', 'BSC', 'Tron', 'Avalanche'],
		color: '#2B2E7F'
	},
	{
		id: 'busd-paxos',
		name: 'Binance USD (BUSD)',
		descriptionKey: 'chain_tools.tools.busd_paxos.description',
		url: 'https://paxos.com/busd',
		icon: Building2,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'binance', 'paxos'],
		chains: ['Ethereum', 'BSC'],
		color: '#F0B90B'
	},
	{
		id: 'pyusd-paypal',
		name: 'PayPal USD (PYUSD)',
		descriptionKey: 'chain_tools.tools.pyusd_paypal.description',
		url: 'https://www.paypal.com/pyusd',
		icon: Globe,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'paypal', 'institutional'],
		chains: ['Ethereum', 'Solana'],
		color: '#003087'
	},
	{
		id: 'gusd-gemini',
		name: 'Gemini Dollar (GUSD)',
		descriptionKey: 'chain_tools.tools.gusd_gemini.description',
		url: 'https://www.gemini.com/dollar',
		icon: Shield,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'regulated', 'gemini'],
		chains: ['Ethereum'],
		color: '#00DCFA'
	},
	{
		id: 'usdp-paxos',
		name: 'Pax Dollar (USDP)',
		descriptionKey: 'chain_tools.tools.usdp_paxos.description',
		url: 'https://paxos.com/usdp',
		icon: Shield,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'regulated', 'paxos'],
		chains: ['Ethereum'],
		color: '#00522C'
	},
	// ========== Yield-Bearing Stablecoins ==========
	{
		id: 'sdai-spark',
		name: 'sDAI (Spark)',
		descriptionKey: 'chain_tools.tools.sdai_spark.description',
		url: 'https://spark.fi',
		icon: Percent,
		category: 'stablecoin',
		tags: ['stablecoin', 'yield', 'savings', 'maker'],
		chains: ['Ethereum', 'Gnosis'],
		color: '#1AAB9B'
	},
	{
		id: 'susde-ethena',
		name: 'sUSDe (Ethena)',
		descriptionKey: 'chain_tools.tools.susde_ethena.description',
		url: 'https://ethena.fi',
		icon: Percent,
		category: 'stablecoin',
		tags: ['stablecoin', 'yield', 'staking', 'ethena'],
		chains: ['Ethereum'],
		color: '#1E1E1E'
	},
	{
		id: 'sfrax',
		name: 'sFRAX (Frax)',
		descriptionKey: 'chain_tools.tools.sfrax.description',
		url: 'https://app.frax.finance/sfrax',
		icon: Percent,
		category: 'stablecoin',
		tags: ['stablecoin', 'yield', 'staking', 'frax'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	// ========== Euro & Other Currency Stablecoins ==========
	{
		id: 'eurs-stasis',
		name: 'STASIS EURO (EURS)',
		descriptionKey: 'chain_tools.tools.eurs_stasis.description',
		url: 'https://stasis.net',
		icon: Globe,
		category: 'stablecoin',
		tags: ['stablecoin', 'euro', 'eur', 'european'],
		chains: ['Ethereum', 'Polygon'],
		color: '#003399'
	},
	{
		id: 'eurc-circle',
		name: 'Euro Coin (EURC)',
		descriptionKey: 'chain_tools.tools.eurc_circle.description',
		url: 'https://www.circle.com/eurc',
		icon: Globe,
		category: 'stablecoin',
		tags: ['stablecoin', 'euro', 'eur', 'circle'],
		chains: ['Ethereum', 'Avalanche', 'Stellar'],
		color: '#2775CA'
	},
	{
		id: 'eurt-tether',
		name: 'Tether EURt',
		descriptionKey: 'chain_tools.tools.eurt_tether.description',
		url: 'https://tether.to/eurt',
		icon: Globe,
		category: 'stablecoin',
		tags: ['stablecoin', 'euro', 'eur', 'tether'],
		chains: ['Ethereum'],
		color: '#26A17B'
	},
	{
		id: 'xsgd-straitsx',
		name: 'XSGD (StraitsX)',
		descriptionKey: 'chain_tools.tools.xsgd_straitsx.description',
		url: 'https://www.straitsx.com/xsgd',
		icon: Globe,
		category: 'stablecoin',
		tags: ['stablecoin', 'sgd', 'singapore', 'asia'],
		chains: ['Ethereum', 'Polygon', 'Zilliqa'],
		color: '#0033A0'
	},
	// ========== Decentralized Stablecoins ==========
	{
		id: 'lusd-liquity',
		name: 'LUSD (Liquity)',
		descriptionKey: 'chain_tools.tools.lusd_liquity.description',
		url: 'https://www.liquity.org',
		icon: Lock,
		category: 'stablecoin',
		tags: ['stablecoin', 'decentralized', 'eth-backed', 'immutable'],
		chains: ['Ethereum'],
		color: '#2EB6EA'
	},
	{
		id: 'susd-synthetix',
		name: 'sUSD (Synthetix)',
		descriptionKey: 'chain_tools.tools.susd_synthetix.description',
		url: 'https://synthetix.io',
		icon: Zap,
		category: 'stablecoin',
		tags: ['stablecoin', 'synthetic', 'snx-backed', 'defi'],
		chains: ['Ethereum', 'Optimism'],
		color: '#00D1FF'
	},
	{
		id: 'rai-reflexer',
		name: 'RAI (Reflexer)',
		descriptionKey: 'chain_tools.tools.rai_reflexer.description',
		url: 'https://reflexer.finance',
		icon: Coins,
		category: 'stablecoin',
		tags: ['stablecoin', 'non-pegged', 'eth-backed', 'algorithmic'],
		chains: ['Ethereum'],
		color: '#239688'
	},
	{
		id: 'mim-abracadabra',
		name: 'MIM (Abracadabra)',
		descriptionKey: 'chain_tools.tools.mim_abracadabra.description',
		url: 'https://abracadabra.money',
		icon: Coins,
		category: 'stablecoin',
		tags: ['stablecoin', 'interest-bearing', 'collateral', 'defi'],
		chains: ['Ethereum', 'Arbitrum', 'Avalanche', 'Fantom'],
		color: '#7B3FE4'
	},
	{
		id: 'crvusd-curve',
		name: 'crvUSD (Curve)',
		descriptionKey: 'chain_tools.tools.crvusd_curve.description',
		url: 'https://crvusd.curve.fi',
		icon: Coins,
		category: 'stablecoin',
		tags: ['stablecoin', 'curve', 'llamma', 'soft-liquidation'],
		chains: ['Ethereum'],
		color: '#FF0000'
	},
	{
		id: 'gho-aave',
		name: 'GHO (Aave)',
		descriptionKey: 'chain_tools.tools.gho_aave.description',
		url: 'https://gho.aave.com',
		icon: Landmark,
		category: 'stablecoin',
		tags: ['stablecoin', 'aave', 'overcollateralized', 'defi'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#B6509E'
	},
	// ========== Stablecoin Aggregators & Tools ==========
	{
		id: 'defillama-stablecoins',
		name: 'DeFiLlama Stablecoins',
		descriptionKey: 'chain_tools.tools.defillama_stablecoins.description',
		url: 'https://defillama.com/stablecoins',
		icon: TrendingUp,
		category: 'stablecoin',
		tags: ['analytics', 'tracking', 'market-cap', 'data'],
		color: '#2172E5'
	},
	{
		id: 'coingecko-stablecoins',
		name: 'CoinGecko Stablecoins',
		descriptionKey: 'chain_tools.tools.coingecko_stablecoins.description',
		url: 'https://www.coingecko.com/en/categories/stablecoins',
		icon: TrendingUp,
		category: 'stablecoin',
		tags: ['analytics', 'tracking', 'rankings', 'data'],
		color: '#8DC63F'
	}
];
