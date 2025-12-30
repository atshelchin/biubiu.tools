/**
 * L2 Tools - Layer 2 solutions and rollup frameworks
 */
import { Layers2, Hexagon, Zap, Globe } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const l2Tools: ExternalTool[] = [
	// ========== Major L2s ==========
	{
		id: 'arbitrum-one',
		name: 'Arbitrum One',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.arbitrum_one.description',
		url: 'https://arbitrum.io',
		icon: Layers2,
		category: 'l2',
		tags: ['optimistic-rollup', 'ethereum', 'scaling', 'evm'],
		chains: ['Arbitrum'],
		color: '#28A0F0'
	},
	{
		id: 'optimism',
		name: 'Optimism',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.optimism.description',
		url: 'https://www.optimism.io',
		icon: Layers2,
		category: 'l2',
		tags: ['optimistic-rollup', 'ethereum', 'superchain', 'op-stack'],
		chains: ['Optimism'],
		color: '#FF0420',
		isFeatured: true
	},
	{
		id: 'base',
		name: 'Base',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.base.description',
		url: 'https://base.org',
		icon: Hexagon,
		category: 'l2',
		tags: ['optimistic-rollup', 'coinbase', 'op-stack', 'evm'],
		chains: ['Base'],
		color: '#0052FF',
		isFeatured: true
	},

	// ========== ZK Rollups ==========
	{
		id: 'zksync-era',
		name: 'zkSync Era',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.zksync_era.description',
		url: 'https://zksync.io',
		icon: Layers2,
		category: 'l2',
		tags: ['zk-rollup', 'ethereum', 'scaling', 'account-abstraction'],
		chains: ['zkSync'],
		color: '#8C8DFC'
	},
	{
		id: 'starknet',
		name: 'Starknet',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.starknet.description',
		url: 'https://www.starknet.io',
		icon: Layers2,
		category: 'l2',
		tags: ['zk-rollup', 'ethereum', 'cairo', 'validity-proof'],
		chains: ['Starknet'],
		color: '#29296E'
	},
	{
		id: 'scroll',
		name: 'Scroll',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.scroll.description',
		url: 'https://scroll.io',
		icon: Layers2,
		category: 'l2',
		tags: ['zk-rollup', 'ethereum', 'evm-equivalent', 'zkevm'],
		chains: ['Scroll'],
		color: '#FFEEDA'
	},
	{
		id: 'linea',
		name: 'Linea',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.linea.description',
		url: 'https://linea.build',
		icon: Layers2,
		category: 'l2',
		tags: ['zk-rollup', 'consensys', 'zkevm', 'ethereum'],
		chains: ['Linea'],
		color: '#61DFFF'
	},
	{
		id: 'polygon-zkevm',
		name: 'Polygon zkEVM',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.polygon_zkevm.description',
		url: 'https://polygon.technology/polygon-zkevm',
		icon: Layers2,
		category: 'l2',
		tags: ['zk-rollup', 'polygon', 'zkevm', 'ethereum'],
		chains: ['Polygon zkEVM'],
		color: '#8247E5'
	},
	{
		id: 'taiko-l2',
		name: 'Taiko',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.taiko_l2.description',
		url: 'https://taiko.xyz',
		icon: Layers2,
		category: 'l2',
		tags: ['zk-evm', 'type-1', 'decentralized', 'ethereum'],
		chains: ['Taiko'],
		color: '#E81899'
	},

	// ========== Optimistic L2s ==========
	{
		id: 'manta-pacific',
		name: 'Manta Pacific',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.manta_pacific.description',
		url: 'https://pacific.manta.network',
		icon: Layers2,
		category: 'l2',
		tags: ['modular', 'zk', 'ethereum', 'defi'],
		chains: ['Manta Pacific'],
		color: '#00D2FF'
	},
	{
		id: 'blast-l2',
		name: 'Blast',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.blast_l2.description',
		url: 'https://blast.io',
		icon: Zap,
		category: 'l2',
		tags: ['optimistic-rollup', 'native-yield', 'ethereum'],
		chains: ['Blast'],
		color: '#FCFC03'
	},
	{
		id: 'mode',
		name: 'Mode',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.mode.description',
		url: 'https://www.mode.network',
		icon: Layers2,
		category: 'l2',
		tags: ['optimistic-rollup', 'op-stack', 'defi', 'sequencer-sharing'],
		chains: ['Mode'],
		color: '#DFFE00'
	},
	{
		id: 'mantle',
		name: 'Mantle',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.mantle.description',
		url: 'https://www.mantle.xyz',
		icon: Layers2,
		category: 'l2',
		tags: ['modular', 'ethereum', 'bitdao', 'lsd'],
		chains: ['Mantle'],
		color: '#000000'
	},

	// ========== New L2s ==========
	{
		id: 'megaeth-l2',
		name: 'MegaETH',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.megaeth_l2.description',
		url: 'https://megaeth.com',
		icon: Layers2,
		category: 'l2',
		tags: ['real-time', 'high-performance', 'l2', 'evm'],
		color: '#FF6B6B'
	},
	{
		id: 'eclipse-l2',
		name: 'Eclipse',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.eclipse_l2.description',
		url: 'https://eclipse.builders',
		icon: Layers2,
		category: 'l2',
		tags: ['svm', 'ethereum', 'solana-vm', 'modular'],
		color: '#6366F1'
	},
	{
		id: 'fuel-l2',
		name: 'Fuel',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.fuel_l2.description',
		url: 'https://fuel.network',
		icon: Layers2,
		category: 'l2',
		tags: ['modular', 'parallel', 'sway', 'execution'],
		color: '#00F58C'
	},
	{
		id: 'kinto-l2',
		name: 'Kinto',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.kinto_l2.description',
		url: 'https://kinto.xyz',
		icon: Layers2,
		category: 'l2',
		tags: ['kyc', 'compliant', 'l2', 'institutional'],
		color: '#4F46E5'
	},
	{
		id: 'morph-l2',
		name: 'Morph',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.morph_l2.description',
		url: 'https://morphl2.io',
		icon: Layers2,
		category: 'l2',
		tags: ['optimistic-zk', 'consumer', 'l2', 'hybrid'],
		color: '#22C55E'
	},
	{
		id: 'bob-l2',
		name: 'BOB',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.bob_l2.description',
		url: 'https://gobob.xyz',
		icon: Layers2,
		category: 'l2',
		tags: ['bitcoin', 'ethereum', 'hybrid', 'l2'],
		color: '#F7931A'
	},
	{
		id: 'metal-l2',
		name: 'Metal L2',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.metal_l2.description',
		url: 'https://metall2.com',
		icon: Layers2,
		category: 'l2',
		tags: ['banking', 'compliant', 'op-stack', 'l2'],
		color: '#000000'
	},
	{
		id: 'cyber-l2',
		name: 'Cyber',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.cyber_l2.description',
		url: 'https://cyber.co',
		icon: Layers2,
		category: 'l2',
		tags: ['social', 'op-stack', 'l2', 'cyberconnect'],
		color: '#7DD3FC'
	},
	{
		id: 'fraxtal-l2',
		name: 'Fraxtal',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.fraxtal_l2.description',
		url: 'https://frax.finance/fraxtal',
		icon: Layers2,
		category: 'l2',
		tags: ['frax', 'op-stack', 'l2', 'defi'],
		color: '#000000'
	},

	// ========== L2 Frameworks ==========
	{
		id: 'op-stack',
		name: 'OP Stack',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.op_stack.description',
		url: 'https://stack.optimism.io',
		icon: Layers2,
		category: 'l2',
		tags: ['framework', 'rollup', 'modular', 'superchain'],
		color: '#EF4444'
	},
	{
		id: 'orbit-chain',
		name: 'Arbitrum Orbit',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.orbit_chain.description',
		url: 'https://orbit.arbitrum.io',
		icon: Layers2,
		category: 'l2',
		tags: ['framework', 'l3', 'customizable', 'arbitrum'],
		color: '#28A0F0'
	},
	{
		id: 'polygon-cdk',
		name: 'Polygon CDK',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.polygon_cdk.description',
		url: 'https://polygon.technology/cdk',
		icon: Layers2,
		category: 'l2',
		tags: ['framework', 'zk', 'modular', 'polygon'],
		color: '#8247E5'
	},
	{
		id: 'zk-stack',
		name: 'ZK Stack',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.zk_stack.description',
		url: 'https://zkstack.io',
		icon: Layers2,
		category: 'l2',
		tags: ['framework', 'zksync', 'hyperchain', 'modular'],
		color: '#4E529A'
	},

	// ========== L2 Analytics ==========
	{
		id: 'l2-marathon',
		name: 'L2 Marathon',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.l2_marathon.description',
		url: 'https://l2marathon.com',
		icon: Layers2,
		category: 'l2',
		tags: ['analytics', 'comparison', 'l2', 'metrics'],
		color: '#6366F1'
	},
	{
		id: 'chainlist-l2',
		name: 'Chainlist',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.chainlist_l2.description',
		url: 'https://chainlist.org',
		icon: Globe,
		category: 'l2',
		tags: ['rpc', 'chainid', 'networks', 'add-network'],
		color: '#3B82F6'
	},

	// ========== Additional L2 Tools ==========
	{
		id: 'zora-l2',
		name: 'Zora',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.zora_l2.description',
		url: 'https://zora.co',
		icon: Layers2,
		category: 'l2',
		tags: ['nft', 'op-stack', 'creator', 'l2'],
		chains: ['Zora'],
		color: '#5A45FF'
	},
	{
		id: 'redstone-l2',
		name: 'Redstone',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.redstone_l2.description',
		url: 'https://redstone.xyz',
		icon: Layers2,
		category: 'l2',
		tags: ['gaming', 'onchain', 'op-stack', 'mud'],
		chains: ['Redstone'],
		color: '#FF4545'
	},
	{
		id: 'mint-l2',
		name: 'Mint',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.mint_l2.description',
		url: 'https://mintchain.io',
		icon: Layers2,
		category: 'l2',
		tags: ['nft', 'op-stack', 'l2', 'creator'],
		chains: ['Mint'],
		color: '#22C55E'
	},
	{
		id: 'ancient8-l2',
		name: 'Ancient8',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.ancient8_l2.description',
		url: 'https://ancient8.gg',
		icon: Layers2,
		category: 'l2',
		tags: ['gaming', 'op-stack', 'l2', 'infrastructure'],
		chains: ['Ancient8'],
		color: '#F59E0B'
	},
	{
		id: 'degen-l3',
		name: 'Degen Chain',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.degen_l3.description',
		url: 'https://degen.tips',
		icon: Layers2,
		category: 'l2',
		tags: ['l3', 'arbitrum-orbit', 'farcaster', 'social'],
		chains: ['Degen'],
		color: '#A855F7'
	},
	{
		id: 'l2beat',
		name: 'L2BEAT',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.l2beat.description',
		url: 'https://l2beat.com',
		icon: Layers2,
		category: 'l2',
		tags: ['analytics', 'tvl', 'risk', 'research'],
		color: '#D53A9D'
	},
	{
		id: 'superchain',
		name: 'Superchain',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.superchain.description',
		url: 'https://superchain.eco',
		icon: Layers2,
		category: 'l2',
		tags: ['ecosystem', 'op-stack', 'interop', 'network'],
		color: '#FF0420'
	},
	{
		id: 'world-chain',
		name: 'World Chain',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.world_chain.description',
		url: 'https://world.org/world-chain',
		icon: Layers2,
		category: 'l2',
		tags: ['worldcoin', 'op-stack', 'identity', 'l2'],
		chains: ['World Chain'],
		color: '#000000'
	},
	{
		id: 'lisk-l2',
		name: 'Lisk',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.lisk_l2.description',
		url: 'https://lisk.com',
		icon: Layers2,
		category: 'l2',
		tags: ['op-stack', 'sdk', 'l2', 'apps'],
		chains: ['Lisk'],
		color: '#0052FF'
	},
	{
		id: 'ink-l2',
		name: 'Ink',
		descriptionKey: 'routes/apps/chain-tools/l2.tools.ink_l2.description',
		url: 'https://inkonchain.com',
		icon: Layers2,
		category: 'l2',
		tags: ['kraken', 'op-stack', 'defi', 'l2'],
		chains: ['Ink'],
		color: '#5741D9'
	}
];
