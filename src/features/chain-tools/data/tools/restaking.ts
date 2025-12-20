/**
 * Restaking Tools - Restaking protocols and AVS ecosystem
 *
 * Categories:
 * - Restaking Protocols
 * - Liquid Restaking Tokens (LRTs)
 * - AVS (Actively Validated Services)
 * - Restaking Analytics
 */
import { Shield, Layers, Coins, Network, TrendingUp, BarChart3, Zap, Globe } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const restakingTools: ExternalTool[] = [
	// ========== Core Restaking Protocols ==========
	{
		id: 'eigenlayer',
		name: 'EigenLayer',
		descriptionKey: 'chain_tools.tools.eigenlayer.description',
		url: 'https://eigenlayer.xyz',
		icon: Layers,
		category: 'restaking',
		tags: ['restaking', 'avs', 'ethereum', 'security'],
		chains: ['Ethereum'],
		color: '#1F0047'
	},
	{
		id: 'symbiotic',
		name: 'Symbiotic',
		descriptionKey: 'chain_tools.tools.symbiotic.description',
		url: 'https://symbiotic.fi',
		icon: Network,
		category: 'restaking',
		tags: ['restaking', 'modular', 'ethereum', 'security'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'karak',
		name: 'Karak',
		descriptionKey: 'chain_tools.tools.karak.description',
		url: 'https://karak.network',
		icon: Shield,
		category: 'restaking',
		tags: ['restaking', 'multichain', 'dss', 'security'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#FF6B35'
	},
	{
		id: 'babylon',
		name: 'Babylon',
		descriptionKey: 'chain_tools.tools.babylon.description',
		url: 'https://babylonchain.io',
		icon: Shield,
		category: 'restaking',
		tags: ['restaking', 'bitcoin', 'staking', 'security'],
		chains: ['Bitcoin'],
		color: '#F7931A'
	},
	// ========== Liquid Restaking Tokens (LRTs) ==========
	{
		id: 'etherfi',
		name: 'ether.fi (eETH)',
		descriptionKey: 'chain_tools.tools.etherfi.description',
		url: 'https://ether.fi',
		icon: Coins,
		category: 'restaking',
		tags: ['restaking', 'lrt', 'eeth', 'liquid'],
		chains: ['Ethereum'],
		color: '#735CDD'
	},
	{
		id: 'renzo-protocol',
		name: 'Renzo (ezETH)',
		descriptionKey: 'chain_tools.tools.renzo_protocol.description',
		url: 'https://renzo.xyz',
		icon: Coins,
		category: 'restaking',
		tags: ['restaking', 'lrt', 'ezeth', 'liquid'],
		chains: ['Ethereum'],
		color: '#00D395'
	},
	{
		id: 'puffer-finance',
		name: 'Puffer Finance (pufETH)',
		descriptionKey: 'chain_tools.tools.puffer_finance.description',
		url: 'https://puffer.fi',
		icon: Coins,
		category: 'restaking',
		tags: ['restaking', 'lrt', 'pufeth', 'anti-slashing'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'kelp-dao',
		name: 'Kelp DAO (rsETH)',
		descriptionKey: 'chain_tools.tools.kelp_dao.description',
		url: 'https://kelpdao.xyz',
		icon: Coins,
		category: 'restaking',
		tags: ['restaking', 'lrt', 'rseth', 'liquid'],
		chains: ['Ethereum'],
		color: '#22C55E'
	},
	{
		id: 'swell-restaking',
		name: 'Swell (rswETH)',
		descriptionKey: 'chain_tools.tools.swell_restaking.description',
		url: 'https://swellnetwork.io',
		icon: Coins,
		category: 'restaking',
		tags: ['restaking', 'lrt', 'rsweth', 'liquid'],
		chains: ['Ethereum'],
		color: '#3B82F6'
	},
	{
		id: 'eigenpie',
		name: 'Eigenpie',
		descriptionKey: 'chain_tools.tools.eigenpie.description',
		url: 'https://eigenpie.io',
		icon: Coins,
		category: 'restaking',
		tags: ['restaking', 'lrt', 'magpie', 'liquid'],
		chains: ['Ethereum'],
		color: '#EC4899'
	},
	{
		id: 'bedrock',
		name: 'Bedrock (uniETH)',
		descriptionKey: 'chain_tools.tools.bedrock.description',
		url: 'https://bedrock.rockx.com',
		icon: Coins,
		category: 'restaking',
		tags: ['restaking', 'lrt', 'unieth', 'universal'],
		chains: ['Ethereum'],
		color: '#1E1E1E'
	},
	{
		id: 'stakestone',
		name: 'StakeStone (STONE)',
		descriptionKey: 'chain_tools.tools.stakestone.description',
		url: 'https://stakestone.io',
		icon: Coins,
		category: 'restaking',
		tags: ['restaking', 'lrt', 'stone', 'omnichain'],
		chains: ['Ethereum'],
		color: '#6366F1'
	},
	{
		id: 'inception',
		name: 'Inception (inETH)',
		descriptionKey: 'chain_tools.tools.inception.description',
		url: 'https://inceptionlrt.com',
		icon: Coins,
		category: 'restaking',
		tags: ['restaking', 'lrt', 'ineth', 'flash-unstake'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	// ========== AVS (Actively Validated Services) ==========
	{
		id: 'eigenda',
		name: 'EigenDA',
		descriptionKey: 'chain_tools.tools.eigenda.description',
		url: 'https://eigenda.xyz',
		icon: Network,
		category: 'restaking',
		tags: ['avs', 'da', 'data-availability', 'eigenlayer'],
		chains: ['Ethereum'],
		color: '#1F0047'
	},
	{
		id: 'lagrange',
		name: 'Lagrange',
		descriptionKey: 'chain_tools.tools.lagrange.description',
		url: 'https://lagrange.dev',
		icon: Zap,
		category: 'restaking',
		tags: ['avs', 'coprocessor', 'zk', 'cross-chain'],
		chains: ['Ethereum'],
		color: '#00D395'
	},
	{
		id: 'espresso',
		name: 'Espresso',
		descriptionKey: 'chain_tools.tools.espresso.description',
		url: 'https://espressosys.com',
		icon: Network,
		category: 'restaking',
		tags: ['avs', 'sequencer', 'shared', 'rollup'],
		chains: ['Ethereum'],
		color: '#8B4513'
	},
	{
		id: 'hyperlane-avs',
		name: 'Hyperlane',
		descriptionKey: 'chain_tools.tools.hyperlane_avs.description',
		url: 'https://hyperlane.xyz',
		icon: Globe,
		category: 'restaking',
		tags: ['avs', 'interop', 'messaging', 'cross-chain'],
		chains: ['Ethereum'],
		color: '#2563EB'
	},
	{
		id: 'omni-avs',
		name: 'Omni Network',
		descriptionKey: 'chain_tools.tools.omni_avs.description',
		url: 'https://omni.network',
		icon: Network,
		category: 'restaking',
		tags: ['avs', 'interop', 'rollup', 'cross-chain'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'witness-chain',
		name: 'Witness Chain',
		descriptionKey: 'chain_tools.tools.witness_chain.description',
		url: 'https://witnesschain.com',
		icon: Shield,
		category: 'restaking',
		tags: ['avs', 'watchtower', 'security', 'diligence'],
		chains: ['Ethereum'],
		color: '#6366F1'
	},
	{
		id: 'altlayer-avs',
		name: 'AltLayer MACH',
		descriptionKey: 'chain_tools.tools.altlayer_avs.description',
		url: 'https://altlayer.io',
		icon: Layers,
		category: 'restaking',
		tags: ['avs', 'fast-finality', 'rollup', 'mach'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'brevis',
		name: 'Brevis',
		descriptionKey: 'chain_tools.tools.brevis.description',
		url: 'https://brevis.network',
		icon: Zap,
		category: 'restaking',
		tags: ['avs', 'coprocessor', 'zk', 'data'],
		chains: ['Ethereum'],
		color: '#FF6B35'
	},
	// ========== Restaking Analytics ==========
	{
		id: 'eigenlayer-app',
		name: 'EigenLayer App',
		descriptionKey: 'chain_tools.tools.eigenlayer_app.description',
		url: 'https://app.eigenlayer.xyz',
		icon: BarChart3,
		category: 'restaking',
		tags: ['restaking', 'staking', 'delegation', 'dashboard'],
		chains: ['Ethereum'],
		color: '#1F0047'
	},
	{
		id: 'dune-eigenlayer',
		name: 'EigenLayer Dune Dashboard',
		descriptionKey: 'chain_tools.tools.dune_eigenlayer.description',
		url: 'https://dune.com/hahahash/eigenlayer',
		icon: BarChart3,
		category: 'restaking',
		tags: ['restaking', 'analytics', 'tvl', 'data'],
		color: '#F55B3A'
	},
	{
		id: 'defillama-restaking',
		name: 'DeFiLlama Restaking',
		descriptionKey: 'chain_tools.tools.defillama_restaking.description',
		url: 'https://defillama.com/protocols/Liquid%20Restaking',
		icon: BarChart3,
		category: 'restaking',
		tags: ['restaking', 'analytics', 'lrt', 'tvl'],
		color: '#2172E5'
	},
	{
		id: 'rated-restaking',
		name: 'Rated Restaking',
		descriptionKey: 'chain_tools.tools.rated_restaking.description',
		url: 'https://rated.network',
		icon: TrendingUp,
		category: 'restaking',
		tags: ['restaking', 'operators', 'performance', 'rating'],
		color: '#6366F1'
	}
];
