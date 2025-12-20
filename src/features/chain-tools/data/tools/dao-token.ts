/**
 * DAO Token Tools - Governance tokens of major DAOs and protocols
 *
 * Categories:
 * - DeFi Protocol Governance Tokens
 * - Infrastructure & L2 Governance
 * - DAO Platform Tokens
 * - NFT & Gaming Governance
 */
import {
	Coins,
	Vote,
	Landmark,
	Layers,
	Shield,
	Zap,
	Globe,
	Users,
	TrendingUp,
	Award,
	Building2,
	BarChart3,
	Repeat
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const daoTokenTools: ExternalTool[] = [
	// ========== Major DeFi Governance Tokens ==========
	{
		id: 'uni-token',
		name: 'UNI (Uniswap)',
		descriptionKey: 'chain_tools.tools.uni_token.description',
		url: 'https://app.uniswap.org/vote',
		icon: Repeat,
		category: 'dao-token',
		tags: ['governance', 'defi', 'dex', 'uniswap'],
		chains: ['Ethereum'],
		color: '#FF007A'
	},
	{
		id: 'aave-token',
		name: 'AAVE (Aave)',
		descriptionKey: 'chain_tools.tools.aave_token.description',
		url: 'https://governance.aave.com',
		icon: Landmark,
		category: 'dao-token',
		tags: ['governance', 'defi', 'lending', 'aave'],
		chains: ['Ethereum'],
		color: '#B6509E'
	},
	{
		id: 'mkr-token',
		name: 'MKR (MakerDAO)',
		descriptionKey: 'chain_tools.tools.mkr_token.description',
		url: 'https://vote.makerdao.com',
		icon: Landmark,
		category: 'dao-token',
		tags: ['governance', 'defi', 'stablecoin', 'maker'],
		chains: ['Ethereum'],
		color: '#1AAB9B'
	},
	{
		id: 'crv-token',
		name: 'CRV (Curve)',
		descriptionKey: 'chain_tools.tools.crv_token.description',
		url: 'https://dao.curve.fi',
		icon: TrendingUp,
		category: 'dao-token',
		tags: ['governance', 'defi', 'amm', 'curve', 'vecrv'],
		chains: ['Ethereum'],
		color: '#FF0000'
	},
	{
		id: 'comp-token',
		name: 'COMP (Compound)',
		descriptionKey: 'chain_tools.tools.comp_token.description',
		url: 'https://compound.finance/governance',
		icon: Landmark,
		category: 'dao-token',
		tags: ['governance', 'defi', 'lending', 'compound'],
		chains: ['Ethereum'],
		color: '#00D395'
	},
	{
		id: 'snx-token',
		name: 'SNX (Synthetix)',
		descriptionKey: 'chain_tools.tools.snx_token.description',
		url: 'https://staking.synthetix.io',
		icon: Zap,
		category: 'dao-token',
		tags: ['governance', 'defi', 'synthetic', 'synthetix'],
		chains: ['Ethereum', 'Optimism'],
		color: '#00D1FF'
	},
	{
		id: 'ldo-token',
		name: 'LDO (Lido)',
		descriptionKey: 'chain_tools.tools.ldo_token.description',
		url: 'https://lido.fi/governance',
		icon: Shield,
		category: 'dao-token',
		tags: ['governance', 'staking', 'liquid-staking', 'lido'],
		chains: ['Ethereum'],
		color: '#00A3FF'
	},
	{
		id: 'gmx-token',
		name: 'GMX (GMX)',
		descriptionKey: 'chain_tools.tools.gmx_token.description',
		url: 'https://app.gmx.io/#/earn',
		icon: TrendingUp,
		category: 'dao-token',
		tags: ['governance', 'defi', 'perps', 'gmx'],
		chains: ['Arbitrum', 'Avalanche'],
		color: '#2E67F4'
	},
	{
		id: 'bal-token',
		name: 'BAL (Balancer)',
		descriptionKey: 'chain_tools.tools.bal_token.description',
		url: 'https://vote.balancer.fi',
		icon: Layers,
		category: 'dao-token',
		tags: ['governance', 'defi', 'amm', 'balancer', 'vebal'],
		chains: ['Ethereum'],
		color: '#1E1E1E'
	},
	{
		id: 'sushi-token',
		name: 'SUSHI (SushiSwap)',
		descriptionKey: 'chain_tools.tools.sushi_token.description',
		url: 'https://forum.sushi.com',
		icon: Repeat,
		category: 'dao-token',
		tags: ['governance', 'defi', 'dex', 'sushi'],
		chains: ['Ethereum'],
		color: '#FA52A0'
	},
	{
		id: 'yfi-token',
		name: 'YFI (Yearn)',
		descriptionKey: 'chain_tools.tools.yfi_token.description',
		url: 'https://yearn.fi/veyfi',
		icon: Award,
		category: 'dao-token',
		tags: ['governance', 'defi', 'yield', 'yearn', 'veyfi'],
		chains: ['Ethereum'],
		color: '#006AE3'
	},
	{
		id: 'inch-token',
		name: '1INCH (1inch)',
		descriptionKey: 'chain_tools.tools.inch_token.description',
		url: 'https://app.1inch.io/#/1/dao/governance',
		icon: Zap,
		category: 'dao-token',
		tags: ['governance', 'defi', 'aggregator', '1inch'],
		chains: ['Ethereum'],
		color: '#1B314F'
	},
	{
		id: 'pendle-token',
		name: 'PENDLE (Pendle)',
		descriptionKey: 'chain_tools.tools.pendle_token.description',
		url: 'https://app.pendle.finance/vependle',
		icon: TrendingUp,
		category: 'dao-token',
		tags: ['governance', 'defi', 'yield', 'pendle', 'vependle'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#31D8A4'
	},
	{
		id: 'ena-token',
		name: 'ENA (Ethena)',
		descriptionKey: 'chain_tools.tools.ena_token.description',
		url: 'https://app.ethena.fi/earn',
		icon: Coins,
		category: 'dao-token',
		tags: ['governance', 'stablecoin', 'yield', 'ethena'],
		chains: ['Ethereum'],
		color: '#1E1E1E'
	},
	{
		id: 'dydx-token',
		name: 'DYDX (dYdX)',
		descriptionKey: 'chain_tools.tools.dydx_token.description',
		url: 'https://dydx.community',
		icon: TrendingUp,
		category: 'dao-token',
		tags: ['governance', 'defi', 'perps', 'dydx'],
		chains: ['dYdX'],
		color: '#6966FF'
	},
	{
		id: 'cvx-token',
		name: 'CVX (Convex)',
		descriptionKey: 'chain_tools.tools.cvx_token.description',
		url: 'https://www.convexfinance.com/vote',
		icon: TrendingUp,
		category: 'dao-token',
		tags: ['governance', 'defi', 'curve', 'convex', 'vlcvx'],
		chains: ['Ethereum'],
		color: '#3A3A3A'
	},
	{
		id: 'fxs-token',
		name: 'FXS (Frax)',
		descriptionKey: 'chain_tools.tools.fxs_token.description',
		url: 'https://app.frax.finance/governance',
		icon: Coins,
		category: 'dao-token',
		tags: ['governance', 'defi', 'stablecoin', 'frax', 'vefxs'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'blur-token',
		name: 'BLUR (Blur)',
		descriptionKey: 'chain_tools.tools.blur_token.description',
		url: 'https://blur.io',
		icon: Zap,
		category: 'dao-token',
		tags: ['governance', 'nft', 'marketplace', 'blur'],
		chains: ['Ethereum'],
		color: '#FF6B00'
	},
	{
		id: 'ape-token',
		name: 'APE (ApeCoin)',
		descriptionKey: 'chain_tools.tools.ape_token.description',
		url: 'https://apecoin.com/governance',
		icon: Award,
		category: 'dao-token',
		tags: ['governance', 'nft', 'bayc', 'apecoin'],
		chains: ['Ethereum'],
		color: '#0038FF'
	},
	{
		id: 'rpl-token',
		name: 'RPL (Rocket Pool)',
		descriptionKey: 'chain_tools.tools.rpl_token.description',
		url: 'https://vote.rocketpool.net',
		icon: Shield,
		category: 'dao-token',
		tags: ['governance', 'staking', 'ethereum', 'rocketpool'],
		chains: ['Ethereum'],
		color: '#FF6E30'
	},
	{
		id: 'morpho-token',
		name: 'MORPHO (Morpho)',
		descriptionKey: 'chain_tools.tools.morpho_token.description',
		url: 'https://app.morpho.org/governance',
		icon: Landmark,
		category: 'dao-token',
		tags: ['governance', 'defi', 'lending', 'morpho'],
		chains: ['Ethereum'],
		color: '#0052FF'
	},
	{
		id: 'rdnt-token',
		name: 'RDNT (Radiant)',
		descriptionKey: 'chain_tools.tools.rdnt_token.description',
		url: 'https://radiant.capital',
		icon: Landmark,
		category: 'dao-token',
		tags: ['governance', 'defi', 'lending', 'radiant'],
		chains: ['Arbitrum', 'BNB Chain'],
		color: '#00D395'
	},
	{
		id: 'osmo-token',
		name: 'OSMO (Osmosis)',
		descriptionKey: 'chain_tools.tools.osmo_token.description',
		url: 'https://wallet.keplr.app/chains/osmosis',
		icon: Repeat,
		category: 'dao-token',
		tags: ['governance', 'defi', 'cosmos', 'osmosis'],
		chains: ['Osmosis'],
		color: '#5E12A0'
	},
	{
		id: 'jup-token',
		name: 'JUP (Jupiter)',
		descriptionKey: 'chain_tools.tools.jup_token.description',
		url: 'https://vote.jup.ag',
		icon: Zap,
		category: 'dao-token',
		tags: ['governance', 'defi', 'solana', 'jupiter'],
		chains: ['Solana'],
		color: '#00D395'
	},
	{
		id: 'ray-token',
		name: 'RAY (Raydium)',
		descriptionKey: 'chain_tools.tools.ray_token.description',
		url: 'https://raydium.io/staking',
		icon: Repeat,
		category: 'dao-token',
		tags: ['governance', 'defi', 'solana', 'raydium'],
		chains: ['Solana'],
		color: '#3875F6'
	},
	{
		id: 'jto-token',
		name: 'JTO (Jito)',
		descriptionKey: 'chain_tools.tools.jto_token.description',
		url: 'https://gov.jito.network',
		icon: Shield,
		category: 'dao-token',
		tags: ['governance', 'staking', 'solana', 'jito', 'mev'],
		chains: ['Solana'],
		color: '#2DD4BF'
	},
	{
		id: 'orca-token',
		name: 'ORCA (Orca)',
		descriptionKey: 'chain_tools.tools.orca_token.description',
		url: 'https://www.orca.so',
		icon: Repeat,
		category: 'dao-token',
		tags: ['governance', 'defi', 'solana', 'orca'],
		chains: ['Solana'],
		color: '#FFD15C'
	},
	// ========== L2 & Infrastructure Governance ==========
	{
		id: 'arb-token',
		name: 'ARB (Arbitrum)',
		descriptionKey: 'chain_tools.tools.arb_token.description',
		url: 'https://www.tally.xyz/gov/arbitrum',
		icon: Layers,
		category: 'dao-token',
		tags: ['governance', 'l2', 'arbitrum', 'rollup'],
		chains: ['Arbitrum'],
		color: '#28A0F0'
	},
	{
		id: 'op-token',
		name: 'OP (Optimism)',
		descriptionKey: 'chain_tools.tools.op_token.description',
		url: 'https://vote.optimism.io',
		icon: Layers,
		category: 'dao-token',
		tags: ['governance', 'l2', 'optimism', 'rollup'],
		chains: ['Optimism'],
		color: '#FF0420'
	},
	{
		id: 'strk-token',
		name: 'STRK (StarkNet)',
		descriptionKey: 'chain_tools.tools.strk_token.description',
		url: 'https://governance.starknet.io',
		icon: Layers,
		category: 'dao-token',
		tags: ['governance', 'l2', 'starknet', 'zk-rollup'],
		chains: ['Starknet'],
		color: '#28286E'
	},
	{
		id: 'zk-token',
		name: 'ZK (zkSync)',
		descriptionKey: 'chain_tools.tools.zk_token.description',
		url: 'https://portal.zksync.io/governance',
		icon: Layers,
		category: 'dao-token',
		tags: ['governance', 'l2', 'zksync', 'zk-rollup'],
		chains: ['zkSync Era'],
		color: '#8C8DFC'
	},
	{
		id: 'matic-token',
		name: 'MATIC/POL (Polygon)',
		descriptionKey: 'chain_tools.tools.matic_token.description',
		url: 'https://polygon.technology/governance',
		icon: Layers,
		category: 'dao-token',
		tags: ['governance', 'l2', 'polygon', 'sidechain'],
		chains: ['Ethereum', 'Polygon'],
		color: '#8247E5'
	},
	{
		id: 'mnt-token',
		name: 'MNT (Mantle)',
		descriptionKey: 'chain_tools.tools.mnt_token.description',
		url: 'https://governance.mantle.xyz',
		icon: Layers,
		category: 'dao-token',
		tags: ['governance', 'l2', 'mantle', 'modular'],
		chains: ['Mantle'],
		color: '#000000'
	},
	{
		id: 'metis-token',
		name: 'METIS (Metis)',
		descriptionKey: 'chain_tools.tools.metis_token.description',
		url: 'https://metis.io',
		icon: Layers,
		category: 'dao-token',
		tags: ['governance', 'l2', 'metis', 'optimistic'],
		chains: ['Metis'],
		color: '#00D2FF'
	},
	// ========== DAO Infrastructure Tokens ==========
	{
		id: 'ens-token',
		name: 'ENS (Ethereum Name Service)',
		descriptionKey: 'chain_tools.tools.ens_token.description',
		url: 'https://vote.ens.domains',
		icon: Globe,
		category: 'dao-token',
		tags: ['governance', 'identity', 'domains', 'ens'],
		chains: ['Ethereum'],
		color: '#5298FF'
	},
	{
		id: 'gtc-token',
		name: 'GTC (Gitcoin)',
		descriptionKey: 'chain_tools.tools.gtc_token.description',
		url: 'https://www.tally.xyz/gov/gitcoin',
		icon: Users,
		category: 'dao-token',
		tags: ['governance', 'public-goods', 'grants', 'gitcoin'],
		chains: ['Ethereum'],
		color: '#00A885'
	},
	{
		id: 'safe-token',
		name: 'SAFE (Safe)',
		descriptionKey: 'chain_tools.tools.safe_token.description',
		url: 'https://forum.safe.global',
		icon: Shield,
		category: 'dao-token',
		tags: ['governance', 'multisig', 'wallet', 'safe'],
		chains: ['Ethereum'],
		color: '#12FF80'
	},
	{
		id: 'cow-token',
		name: 'COW (CoW Protocol)',
		descriptionKey: 'chain_tools.tools.cow_token.description',
		url: 'https://swap.cow.fi/#/1/all-tokens/WETH/COW',
		icon: Repeat,
		category: 'dao-token',
		tags: ['governance', 'defi', 'mev-protection', 'cow'],
		chains: ['Ethereum', 'Gnosis'],
		color: '#65D9FF'
	},
	{
		id: 'gno-token',
		name: 'GNO (Gnosis)',
		descriptionKey: 'chain_tools.tools.gno_token.description',
		url: 'https://www.gnosis.io',
		icon: Shield,
		category: 'dao-token',
		tags: ['governance', 'chain', 'prediction', 'gnosis'],
		chains: ['Ethereum', 'Gnosis'],
		color: '#3E6957'
	},
	// ========== Governance Platforms ==========
	{
		id: 'tally-governance',
		name: 'Tally',
		descriptionKey: 'chain_tools.tools.tally_governance.description',
		url: 'https://www.tally.xyz',
		icon: Vote,
		category: 'dao-token',
		tags: ['governance', 'voting', 'platform', 'delegation'],
		color: '#4F46E5'
	},
	{
		id: 'snapshot-governance',
		name: 'Snapshot',
		descriptionKey: 'chain_tools.tools.snapshot_governance.description',
		url: 'https://snapshot.org',
		icon: Vote,
		category: 'dao-token',
		tags: ['governance', 'voting', 'off-chain', 'gasless'],
		color: '#F3B04E'
	},
	{
		id: 'boardroom',
		name: 'Boardroom',
		descriptionKey: 'chain_tools.tools.boardroom.description',
		url: 'https://boardroom.io',
		icon: Building2,
		category: 'dao-token',
		tags: ['governance', 'voting', 'aggregator', 'analytics'],
		color: '#000000'
	},
	{
		id: 'karma-dao',
		name: 'Karma',
		descriptionKey: 'chain_tools.tools.karma_dao.description',
		url: 'https://www.karmahq.xyz',
		icon: Users,
		category: 'dao-token',
		tags: ['governance', 'reputation', 'delegates', 'analytics'],
		color: '#6366F1'
	},
	{
		id: 'messari-governance',
		name: 'Messari Governor',
		descriptionKey: 'chain_tools.tools.messari_governance.description',
		url: 'https://messari.io/governor/daos',
		icon: BarChart3,
		category: 'dao-token',
		tags: ['governance', 'analytics', 'research', 'data'],
		color: '#1F2937'
	}
];
