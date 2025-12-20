/**
 * Airdrop Token Tools - Historical valuable airdrops and airdrop tracking tools
 *
 * Categories:
 * - Major Historical Airdrops
 * - Recent Significant Airdrops
 * - Airdrop Tracking & Farming Tools
 * - Potential Upcoming Airdrops
 */
import {
	Gift,
	Coins,
	TrendingUp,
	Search,
	Bell,
	Calendar,
	Target,
	Star,
	Zap,
	Award,
	Layers,
	Globe
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const airdropTokenTools: ExternalTool[] = [
	// ========== Legendary Airdrops (Historical) ==========
	{
		id: 'airdrop-uni',
		name: 'UNI Airdrop (2020)',
		descriptionKey: 'chain_tools.tools.airdrop_uni.description',
		url: 'https://etherscan.io/token/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
		icon: Gift,
		category: 'airdrop-token',
		tags: ['airdrop', 'uniswap', 'defi', '2020', 'legendary'],
		chains: ['Ethereum'],
		color: '#FF007A',
		isFeatured: true
	},
	{
		id: 'airdrop-ens',
		name: 'ENS Airdrop (2021)',
		descriptionKey: 'chain_tools.tools.airdrop_ens.description',
		url: 'https://etherscan.io/token/0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',
		icon: Globe,
		category: 'airdrop-token',
		tags: ['airdrop', 'ens', 'identity', '2021', 'domains'],
		chains: ['Ethereum'],
		color: '#5298FF',
		isFeatured: true
	},
	{
		id: 'airdrop-dydx',
		name: 'dYdX Airdrop (2021)',
		descriptionKey: 'chain_tools.tools.airdrop_dydx.description',
		url: 'https://etherscan.io/token/0x92d6c1e31e14520e676a687f0a93788b716beff5',
		icon: TrendingUp,
		category: 'airdrop-token',
		tags: ['airdrop', 'dydx', 'perps', '2021', 'trading'],
		chains: ['Ethereum'],
		color: '#6966FF'
	},
	{
		id: 'airdrop-1inch',
		name: '1inch Airdrop (2020)',
		descriptionKey: 'chain_tools.tools.airdrop_1inch.description',
		url: 'https://etherscan.io/token/0x111111111117dc0aa78b770fa6a738034120c302',
		icon: Zap,
		category: 'airdrop-token',
		tags: ['airdrop', '1inch', 'aggregator', '2020', 'defi'],
		chains: ['Ethereum'],
		color: '#1B314F'
	},
	{
		id: 'airdrop-ldo',
		name: 'LDO Airdrop (2022)',
		descriptionKey: 'chain_tools.tools.airdrop_ldo.description',
		url: 'https://etherscan.io/token/0x5a98fcbea516cf06857215779fd812ca3bef1b32',
		icon: Coins,
		category: 'airdrop-token',
		tags: ['airdrop', 'lido', 'staking', '2022', 'liquid-staking'],
		chains: ['Ethereum'],
		color: '#00A3FF'
	},
	// ========== L2 & Infrastructure Airdrops ==========
	{
		id: 'airdrop-op',
		name: 'OP Airdrop (2022)',
		descriptionKey: 'chain_tools.tools.airdrop_op.description',
		url: 'https://optimistic.etherscan.io/token/0x4200000000000000000000000000000000000042',
		icon: Layers,
		category: 'airdrop-token',
		tags: ['airdrop', 'optimism', 'l2', '2022', 'rollup'],
		chains: ['Optimism'],
		color: '#FF0420',
		isFeatured: true
	},
	{
		id: 'airdrop-arb',
		name: 'ARB Airdrop (2023)',
		descriptionKey: 'chain_tools.tools.airdrop_arb.description',
		url: 'https://arbiscan.io/token/0x912CE59144191C1204E64559FE8253a0e49E6548',
		icon: Layers,
		category: 'airdrop-token',
		tags: ['airdrop', 'arbitrum', 'l2', '2023', 'rollup'],
		chains: ['Arbitrum'],
		color: '#28A0F0',
		isFeatured: true
	},
	{
		id: 'airdrop-blur',
		name: 'BLUR Airdrop (2023)',
		descriptionKey: 'chain_tools.tools.airdrop_blur.description',
		url: 'https://etherscan.io/token/0x5283d291dbcf85356a21ba090e6db59121208b44',
		icon: Star,
		category: 'airdrop-token',
		tags: ['airdrop', 'blur', 'nft', '2023', 'marketplace'],
		chains: ['Ethereum'],
		color: '#FF6B00'
	},
	{
		id: 'airdrop-strk',
		name: 'STRK Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_strk.description',
		url: 'https://www.starknet.io/en/content/starknet-provisions-program',
		icon: Layers,
		category: 'airdrop-token',
		tags: ['airdrop', 'starknet', 'l2', '2024', 'zk'],
		chains: ['Starknet'],
		color: '#28286E'
	},
	{
		id: 'airdrop-zk',
		name: 'ZK Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_zk.description',
		url: 'https://claim.zknation.io',
		icon: Layers,
		category: 'airdrop-token',
		tags: ['airdrop', 'zksync', 'l2', '2024', 'zk'],
		chains: ['zkSync Era'],
		color: '#8C8DFC'
	},
	{
		id: 'airdrop-jup',
		name: 'JUP Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_jup.description',
		url: 'https://jup.ag',
		icon: Zap,
		category: 'airdrop-token',
		tags: ['airdrop', 'jupiter', 'solana', '2024', 'aggregator'],
		chains: ['Solana'],
		color: '#00D395',
		isFeatured: true
	},
	{
		id: 'airdrop-w',
		name: 'W Airdrop (Wormhole 2024)',
		descriptionKey: 'chain_tools.tools.airdrop_w.description',
		url: 'https://wormhole.com',
		icon: Globe,
		category: 'airdrop-token',
		tags: ['airdrop', 'wormhole', 'bridge', '2024', 'cross-chain'],
		chains: ['Solana', 'Ethereum'],
		color: '#0CC5B6'
	},
	{
		id: 'airdrop-ena',
		name: 'ENA Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_ena.description',
		url: 'https://ethena.fi',
		icon: Coins,
		category: 'airdrop-token',
		tags: ['airdrop', 'ethena', 'stablecoin', '2024', 'yield'],
		chains: ['Ethereum'],
		color: '#1E1E1E'
	},
	{
		id: 'airdrop-eigen',
		name: 'EIGEN Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_eigen.description',
		url: 'https://claims.eigenfoundation.org',
		icon: Layers,
		category: 'airdrop-token',
		tags: ['airdrop', 'eigenlayer', 'restaking', '2024', 'avs'],
		chains: ['Ethereum'],
		color: '#1F0047',
		isFeatured: true
	},
	{
		id: 'airdrop-pyth',
		name: 'PYTH Airdrop (2023)',
		descriptionKey: 'chain_tools.tools.airdrop_pyth.description',
		url: 'https://pyth.network',
		icon: Zap,
		category: 'airdrop-token',
		tags: ['airdrop', 'pyth', 'oracle', '2023', 'solana'],
		chains: ['Solana'],
		color: '#6941C6'
	},
	{
		id: 'airdrop-tnsr',
		name: 'TNSR Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_tnsr.description',
		url: 'https://tensor.trade',
		icon: Star,
		category: 'airdrop-token',
		tags: ['airdrop', 'tensor', 'nft', '2024', 'solana'],
		chains: ['Solana'],
		color: '#FF6B00'
	},
	{
		id: 'airdrop-kmno',
		name: 'KMNO Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_kmno.description',
		url: 'https://kamino.finance',
		icon: Coins,
		category: 'airdrop-token',
		tags: ['airdrop', 'kamino', 'defi', '2024', 'solana'],
		chains: ['Solana'],
		color: '#6366F1'
	},
	{
		id: 'airdrop-parcl',
		name: 'PARCL Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_parcl.description',
		url: 'https://parcl.co',
		icon: TrendingUp,
		category: 'airdrop-token',
		tags: ['airdrop', 'parcl', 'real-estate', '2024', 'solana'],
		chains: ['Solana'],
		color: '#00D395'
	},
	{
		id: 'airdrop-wen',
		name: 'WEN Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_wen.description',
		url: 'https://wenwencoin.com',
		icon: Gift,
		category: 'airdrop-token',
		tags: ['airdrop', 'wen', 'meme', '2024', 'solana'],
		chains: ['Solana'],
		color: '#F59E0B'
	},
	{
		id: 'airdrop-omni',
		name: 'OMNI Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_omni.description',
		url: 'https://omni.network',
		icon: Layers,
		category: 'airdrop-token',
		tags: ['airdrop', 'omni', 'restaking', '2024', 'interop'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'airdrop-alt',
		name: 'ALT Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_alt.description',
		url: 'https://altlayer.io',
		icon: Layers,
		category: 'airdrop-token',
		tags: ['airdrop', 'altlayer', 'rollup', '2024', 'restaking'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'airdrop-manta',
		name: 'MANTA Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_manta.description',
		url: 'https://manta.network',
		icon: Layers,
		category: 'airdrop-token',
		tags: ['airdrop', 'manta', 'l2', '2024', 'modular'],
		chains: ['Manta Pacific'],
		color: '#00D2FF'
	},
	{
		id: 'airdrop-dym',
		name: 'DYM Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_dym.description',
		url: 'https://dymension.xyz',
		icon: Layers,
		category: 'airdrop-token',
		tags: ['airdrop', 'dymension', 'rollapp', '2024', 'cosmos'],
		chains: ['Dymension'],
		color: '#FF6B35'
	},
	{
		id: 'airdrop-zetachain',
		name: 'ZETA Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_zetachain.description',
		url: 'https://zetachain.com',
		icon: Globe,
		category: 'airdrop-token',
		tags: ['airdrop', 'zetachain', 'omnichain', '2024', 'cross-chain'],
		chains: ['ZetaChain'],
		color: '#00D395'
	},
	{
		id: 'airdrop-ethfi',
		name: 'ETHFI Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_ethfi.description',
		url: 'https://ether.fi',
		icon: Coins,
		category: 'airdrop-token',
		tags: ['airdrop', 'etherfi', 'liquid-staking', '2024', 'restaking'],
		chains: ['Ethereum'],
		color: '#735CDD',
		isFeatured: true
	},
	{
		id: 'airdrop-renzo',
		name: 'REZ Airdrop (2024)',
		descriptionKey: 'chain_tools.tools.airdrop_renzo.description',
		url: 'https://renzo.xyz',
		icon: Coins,
		category: 'airdrop-token',
		tags: ['airdrop', 'renzo', 'restaking', '2024', 'eigenlayer'],
		chains: ['Ethereum'],
		color: '#00D395'
	},
	{
		id: 'airdrop-puffer',
		name: 'PUFFER (Potential)',
		descriptionKey: 'chain_tools.tools.airdrop_puffer.description',
		url: 'https://puffer.fi',
		icon: Calendar,
		category: 'airdrop-token',
		tags: ['potential', 'puffer', 'restaking', 'upcoming', 'eigenlayer'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'airdrop-kelp',
		name: 'KELP (Potential)',
		descriptionKey: 'chain_tools.tools.airdrop_kelp.description',
		url: 'https://kelpdao.xyz',
		icon: Calendar,
		category: 'airdrop-token',
		tags: ['potential', 'kelp', 'restaking', 'upcoming', 'eigenlayer'],
		chains: ['Ethereum'],
		color: '#22C55E'
	},
	{
		id: 'airdrop-swell',
		name: 'SWELL (Potential)',
		descriptionKey: 'chain_tools.tools.airdrop_swell.description',
		url: 'https://swellnetwork.io',
		icon: Calendar,
		category: 'airdrop-token',
		tags: ['potential', 'swell', 'liquid-staking', 'upcoming', 'restaking'],
		chains: ['Ethereum'],
		color: '#3B82F6'
	},
	// ========== DeFi Protocol Airdrops ==========
	{
		id: 'airdrop-cow',
		name: 'COW Airdrop (2022)',
		descriptionKey: 'chain_tools.tools.airdrop_cow.description',
		url: 'https://etherscan.io/token/0xdef1ca1fb7fbcdc777520aa7f396b4e015f497ab',
		icon: Coins,
		category: 'airdrop-token',
		tags: ['airdrop', 'cow', 'mev', '2022', 'defi'],
		chains: ['Ethereum'],
		color: '#65D9FF'
	},
	{
		id: 'airdrop-hop',
		name: 'HOP Airdrop (2022)',
		descriptionKey: 'chain_tools.tools.airdrop_hop.description',
		url: 'https://etherscan.io/token/0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc',
		icon: Gift,
		category: 'airdrop-token',
		tags: ['airdrop', 'hop', 'bridge', '2022', 'l2'],
		chains: ['Ethereum'],
		color: '#D562BE'
	},
	{
		id: 'airdrop-safe',
		name: 'SAFE Airdrop (2022)',
		descriptionKey: 'chain_tools.tools.airdrop_safe.description',
		url: 'https://etherscan.io/token/0x5afe3855358e112b5647b952709e6165e1c1eeee',
		icon: Award,
		category: 'airdrop-token',
		tags: ['airdrop', 'safe', 'multisig', '2022', 'wallet'],
		chains: ['Ethereum'],
		color: '#12FF80'
	},
	{
		id: 'airdrop-matic-pol',
		name: 'MATIC/POL Migration',
		descriptionKey: 'chain_tools.tools.airdrop_matic_pol.description',
		url: 'https://polygon.technology/blog/introducing-pol-the-next-generation-of-matic',
		icon: Layers,
		category: 'airdrop-token',
		tags: ['migration', 'polygon', 'matic', 'pol', 'upgrade'],
		chains: ['Polygon'],
		color: '#8247E5'
	},
	// ========== Airdrop Tracking Tools ==========
	{
		id: 'earndrop',
		name: 'Earndrop',
		descriptionKey: 'chain_tools.tools.earndrop.description',
		url: 'https://earndrop.io',
		icon: Search,
		category: 'airdrop-token',
		tags: ['airdrop', 'tracking', 'eligibility', 'checker'],
		color: '#6366F1',
		isFeatured: true
	},
	{
		id: 'defillama-airdrops',
		name: 'DeFiLlama Airdrops',
		descriptionKey: 'chain_tools.tools.defillama_airdrops.description',
		url: 'https://defillama.com/airdrops',
		icon: Gift,
		category: 'airdrop-token',
		tags: ['airdrop', 'tracking', 'upcoming', 'data'],
		color: '#2172E5'
	},
	{
		id: 'airdrop-alert',
		name: 'Airdrop Alert',
		descriptionKey: 'chain_tools.tools.airdrop_alert.description',
		url: 'https://airdropalert.com',
		icon: Bell,
		category: 'airdrop-token',
		tags: ['airdrop', 'alerts', 'upcoming', 'news'],
		color: '#FF6B35'
	},
	{
		id: 'airdrops-io',
		name: 'Airdrops.io',
		descriptionKey: 'chain_tools.tools.airdrops_io.description',
		url: 'https://airdrops.io',
		icon: Gift,
		category: 'airdrop-token',
		tags: ['airdrop', 'tracking', 'upcoming', 'guide'],
		color: '#00D395'
	},
	{
		id: 'airdrop-farmer',
		name: 'Layer3 Quests',
		descriptionKey: 'chain_tools.tools.airdrop_farmer.description',
		url: 'https://layer3.xyz',
		icon: Target,
		category: 'airdrop-token',
		tags: ['airdrop', 'quests', 'farming', 'rewards'],
		color: '#F59E0B'
	},
	{
		id: 'galxe-campaigns',
		name: 'Galxe Campaigns',
		descriptionKey: 'chain_tools.tools.galxe_campaigns.description',
		url: 'https://galxe.com',
		icon: Star,
		category: 'airdrop-token',
		tags: ['airdrop', 'quests', 'credentials', 'rewards'],
		color: '#000000'
	},
	{
		id: 'rabbithole-quests',
		name: 'RabbitHole',
		descriptionKey: 'chain_tools.tools.rabbithole_quests.description',
		url: 'https://rabbithole.gg',
		icon: Target,
		category: 'airdrop-token',
		tags: ['airdrop', 'quests', 'learn', 'earn'],
		color: '#7C3AED'
	},
	{
		id: 'zealy-quests',
		name: 'Zealy',
		descriptionKey: 'chain_tools.tools.zealy_quests.description',
		url: 'https://zealy.io',
		icon: Star,
		category: 'airdrop-token',
		tags: ['airdrop', 'community', 'quests', 'rewards'],
		color: '#6366F1'
	},
	// ========== Potential Upcoming Airdrops ==========
	{
		id: 'potential-scroll',
		name: 'Scroll (Potential)',
		descriptionKey: 'chain_tools.tools.potential_scroll.description',
		url: 'https://scroll.io',
		icon: Calendar,
		category: 'airdrop-token',
		tags: ['potential', 'scroll', 'l2', 'zk', 'upcoming'],
		chains: ['Scroll'],
		color: '#FFEEDA'
	},
	{
		id: 'potential-linea',
		name: 'Linea (Potential)',
		descriptionKey: 'chain_tools.tools.potential_linea.description',
		url: 'https://linea.build',
		icon: Calendar,
		category: 'airdrop-token',
		tags: ['potential', 'linea', 'l2', 'consensys', 'upcoming'],
		chains: ['Linea'],
		color: '#121212'
	},
	{
		id: 'potential-blast',
		name: 'BLAST (Launched)',
		descriptionKey: 'chain_tools.tools.potential_blast.description',
		url: 'https://blast.io',
		icon: Zap,
		category: 'airdrop-token',
		tags: ['airdrop', 'blast', 'l2', 'yield', '2024'],
		chains: ['Blast'],
		color: '#FCFC03'
	},
	{
		id: 'potential-berachain',
		name: 'Berachain (Potential)',
		descriptionKey: 'chain_tools.tools.potential_berachain.description',
		url: 'https://berachain.com',
		icon: Calendar,
		category: 'airdrop-token',
		tags: ['potential', 'berachain', 'l1', 'pol', 'upcoming'],
		color: '#754C24'
	},
	{
		id: 'potential-monad',
		name: 'Monad (Potential)',
		descriptionKey: 'chain_tools.tools.potential_monad.description',
		url: 'https://monad.xyz',
		icon: Calendar,
		category: 'airdrop-token',
		tags: ['potential', 'monad', 'l1', 'evm', 'upcoming'],
		color: '#836EF9'
	},
	{
		id: 'potential-fuel',
		name: 'Fuel (Potential)',
		descriptionKey: 'chain_tools.tools.potential_fuel.description',
		url: 'https://fuel.network',
		icon: Calendar,
		category: 'airdrop-token',
		tags: ['potential', 'fuel', 'modular', 'execution', 'upcoming'],
		color: '#00F58C'
	}
];
