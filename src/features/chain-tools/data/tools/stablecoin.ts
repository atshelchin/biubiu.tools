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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.usdt_tether.description',
		url: 'https://tether.to',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'centralized', 'largest'],
		chains: ['Ethereum', 'Tron', 'BSC', 'Solana', 'Avalanche', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#26A17B'
	},
	{
		id: 'usdc-circle',
		name: 'USD Coin (USDC)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.usdc_circle.description',
		url: 'https://www.circle.com/usdc',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'regulated', 'circle'],
		chains: ['Ethereum', 'Solana', 'Avalanche', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#2775CA'
	},
	{
		id: 'dai-makerdao',
		name: 'DAI (MakerDAO)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.dai_makerdao.description',
		url: 'https://makerdao.com',
		icon: Landmark,
		category: 'stablecoin',
		tags: ['stablecoin', 'decentralized', 'collateralized', 'defi'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Gnosis'],
		color: '#F5AC37'
	},
	{
		id: 'frax',
		name: 'Frax (FRAX)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.frax.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.usde_ethena.description',
		url: 'https://ethena.fi',
		icon: TrendingUp,
		category: 'stablecoin',
		tags: ['stablecoin', 'synthetic', 'yield', 'delta-neutral'],
		chains: ['Ethereum', 'Arbitrum', 'Base'],
		color: '#1E1E1E'
	},
	{
		id: 'usdd-tron',
		name: 'USDD (Tron)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.usdd_tron.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.tusd.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.busd_paxos.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.pyusd_paypal.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.gusd_gemini.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.usdp_paxos.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.sdai_spark.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.susde_ethena.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.sfrax.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.eurs_stasis.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.eurc_circle.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.eurt_tether.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.xsgd_straitsx.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.lusd_liquity.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.susd_synthetix.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.rai_reflexer.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.mim_abracadabra.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.crvusd_curve.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.gho_aave.description',
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
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.defillama_stablecoins.description',
		url: 'https://defillama.com/stablecoins',
		icon: TrendingUp,
		category: 'stablecoin',
		tags: ['analytics', 'tracking', 'market-cap', 'data'],
		color: '#2172E5'
	},
	{
		id: 'coingecko-stablecoins',
		name: 'CoinGecko Stablecoins',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.coingecko_stablecoins.description',
		url: 'https://www.coingecko.com/en/categories/stablecoins',
		icon: TrendingUp,
		category: 'stablecoin',
		tags: ['analytics', 'tracking', 'rankings', 'data'],
		color: '#8DC63F'
	},

	// ========== Additional Stablecoins ==========
	{
		id: 'fdusd',
		name: 'First Digital USD (FDUSD)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.fdusd.description',
		url: 'https://firstdigitallabs.com',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'hong-kong', 'binance'],
		chains: ['Ethereum', 'BSC'],
		color: '#00D395'
	},
	{
		id: 'usual-usd0',
		name: 'USD0 (Usual)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.usual_usd0.description',
		url: 'https://usual.money',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'rwa', 'yield', 'treasury'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'mountain-usdm',
		name: 'USDM (Mountain)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.mountain_usdm.description',
		url: 'https://mountainprotocol.com',
		icon: Percent,
		category: 'stablecoin',
		tags: ['stablecoin', 'yield', 'treasury', 'rebasing'],
		chains: ['Ethereum', 'Polygon', 'Base'],
		color: '#7C3AED'
	},
	{
		id: 'ageur-angle',
		name: 'EURA (Angle)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.ageur_angle.description',
		url: 'https://angle.money',
		icon: Globe,
		category: 'stablecoin',
		tags: ['stablecoin', 'euro', 'defi', 'angle'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#FF6B35'
	},
	{
		id: 'mkusd-prisma',
		name: 'mkUSD (Prisma)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.mkusd_prisma.description',
		url: 'https://prismafinance.com',
		icon: Coins,
		category: 'stablecoin',
		tags: ['stablecoin', 'lst-backed', 'defi', 'prisma'],
		chains: ['Ethereum'],
		color: '#3B82F6'
	},
	{
		id: 'ultra-usd',
		name: 'Ultra USDu',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.ultra_usd.description',
		url: 'https://www.ultraissuance.com',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'institutional'],
		chains: ['Ethereum'],
		color: '#6366F1'
	},
	{
		id: 'dola-inverse',
		name: 'DOLA (Inverse)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.dola_inverse.description',
		url: 'https://inverse.finance',
		icon: Coins,
		category: 'stablecoin',
		tags: ['stablecoin', 'defi', 'fed', 'lending'],
		chains: ['Ethereum', 'Optimism', 'Arbitrum'],
		color: '#5865F2'
	},
	{
		id: 'hai-reflexer',
		name: "HAI (Let's Get HAI)",
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.hai_reflexer.description',
		url: 'https://letsgethai.com',
		icon: Coins,
		category: 'stablecoin',
		tags: ['stablecoin', 'optimism', 'rai-fork', 'defi'],
		chains: ['Optimism'],
		color: '#FF0420'
	},
	{
		id: 'usdk-okx',
		name: 'USDK (OKX)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.usdk_okx.description',
		url: 'https://www.okx.com',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'usd', 'okx', 'regulated'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'zusd-zeta',
		name: 'ZUSD (Zeta)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.zusd_zeta.description',
		url: 'https://zetachain.com',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'zetachain', 'omnichain'],
		chains: ['ZetaChain'],
		color: '#00D395'
	},
	{
		id: 'bob-stablecoin',
		name: 'BOB',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.bob_stablecoin.description',
		url: 'https://bob.money',
		icon: Coins,
		category: 'stablecoin',
		tags: ['stablecoin', 'multichain', 'optimistic'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#F7931A'
	},
	{
		id: 'usdx-kava',
		name: 'USDX (Kava)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.usdx_kava.description',
		url: 'https://kava.io',
		icon: Coins,
		category: 'stablecoin',
		tags: ['stablecoin', 'kava', 'cosmos', 'collateralized'],
		chains: ['Kava'],
		color: '#FF564F'
	},
	{
		id: 'isc-interest',
		name: 'ISC (Interest)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.isc_interest.description',
		url: 'https://interestprotocol.io',
		icon: Percent,
		category: 'stablecoin',
		tags: ['stablecoin', 'sui', 'overcollateralized'],
		chains: ['Sui'],
		color: '#6FBCF0'
	},
	{
		id: 'cusd-celo',
		name: 'cUSD (Celo)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.cusd_celo.description',
		url: 'https://celo.org',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'celo', 'mobile', 'emerging'],
		chains: ['Celo'],
		color: '#35D07F'
	},
	{
		id: 'ceur-celo',
		name: 'cEUR (Celo)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.ceur_celo.description',
		url: 'https://celo.org',
		icon: Globe,
		category: 'stablecoin',
		tags: ['stablecoin', 'euro', 'celo', 'mobile'],
		chains: ['Celo'],
		color: '#35D07F'
	},
	{
		id: 'flexusd',
		name: 'flexUSD',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.flexusd.description',
		url: 'https://coinflex.com',
		icon: Percent,
		category: 'stablecoin',
		tags: ['stablecoin', 'yield', 'interest'],
		chains: ['Ethereum', 'BSC'],
		color: '#3B82F6'
	},
	{
		id: 'alusd-alchemix',
		name: 'alUSD (Alchemix)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.alusd_alchemix.description',
		url: 'https://alchemix.fi',
		icon: Zap,
		category: 'stablecoin',
		tags: ['stablecoin', 'self-repaying', 'yield', 'defi'],
		chains: ['Ethereum', 'Optimism', 'Arbitrum'],
		color: '#F5C400'
	},
	{
		id: 'usd-plus',
		name: 'USD+ (Overnight)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.usd_plus.description',
		url: 'https://overnight.fi',
		icon: Percent,
		category: 'stablecoin',
		tags: ['stablecoin', 'yield', 'delta-neutral', 'defi'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'Base', 'Polygon'],
		color: '#2775CA'
	},
	{
		id: 'ust-wormhole',
		name: 'UST (Wormhole)',
		descriptionKey: 'routes/apps/chain-tools/stablecoin.tools.ust_wormhole.description',
		url: 'https://wormhole.com',
		icon: CircleDollarSign,
		category: 'stablecoin',
		tags: ['stablecoin', 'bridge', 'wormhole', 'wrapped'],
		chains: ['Ethereum', 'Solana'],
		color: '#8B5CF6'
	}
];
