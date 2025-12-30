/**
 * MEV Tools - Maximal Extractable Value infrastructure and protection
 *
 * Categories:
 * - MEV Protection & Private Transactions
 * - Block Builders & Searchers
 * - MEV Research & Analytics
 * - Flashbots Ecosystem
 */
import {
	Zap,
	Shield,
	Eye,
	BarChart3,
	Lock,
	Rocket,
	Search,
	Network,
	Activity,
	Code
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const mevTools: ExternalTool[] = [
	// ========== MEV Protection ==========
	{
		id: 'flashbots-protect',
		name: 'Flashbots Protect',
		descriptionKey: 'chain-tools.mev.tools.flashbots_protect.description',
		url: 'https://protect.flashbots.net',
		icon: Shield,
		category: 'mev',
		tags: ['mev', 'protection', 'flashbots', 'private-tx'],
		chains: ['Ethereum'],
		color: '#FF6B35'
	},
	{
		id: 'mev-blocker',
		name: 'MEV Blocker',
		descriptionKey: 'chain-tools.mev.tools.mev_blocker.description',
		url: 'https://mevblocker.io',
		icon: Lock,
		category: 'mev',
		tags: ['mev', 'protection', 'cow', 'private-tx'],
		chains: ['Ethereum'],
		color: '#65D9FF'
	},
	{
		id: 'cow-mev-protection',
		name: 'CoW Protocol MEV Protection',
		descriptionKey: 'chain-tools.mev.tools.cow_mev_protection.description',
		url: 'https://swap.cow.fi',
		icon: Shield,
		category: 'mev',
		tags: ['mev', 'protection', 'cow', 'batch-auction'],
		chains: ['Ethereum', 'Gnosis'],
		color: '#65D9FF'
	},
	{
		id: 'merkle-private-pool',
		name: 'Merkle Private Pool',
		descriptionKey: 'chain-tools.mev.tools.merkle_private_pool.description',
		url: 'https://merkle.io',
		icon: Lock,
		category: 'mev',
		tags: ['mev', 'protection', 'private-pool', 'merkle'],
		chains: ['Ethereum'],
		color: '#6366F1'
	},
	// ========== Block Builders ==========
	{
		id: 'flashbots-builder',
		name: 'Flashbots Builder',
		descriptionKey: 'chain-tools.mev.tools.flashbots_builder.description',
		url: 'https://flashbots.net',
		icon: Rocket,
		category: 'mev',
		tags: ['mev', 'builder', 'flashbots', 'pbs'],
		chains: ['Ethereum'],
		color: '#FF6B35'
	},
	{
		id: 'beaverbuild',
		name: 'Beaverbuild',
		descriptionKey: 'chain-tools.mev.tools.beaverbuild.description',
		url: 'https://beaverbuild.org',
		icon: Rocket,
		category: 'mev',
		tags: ['mev', 'builder', 'pbs', 'block-building'],
		chains: ['Ethereum'],
		color: '#8B4513'
	},
	{
		id: 'titan-builder',
		name: 'Titan Builder',
		descriptionKey: 'chain-tools.mev.tools.titan_builder.description',
		url: 'https://titanbuilder.xyz',
		icon: Rocket,
		category: 'mev',
		tags: ['mev', 'builder', 'pbs', 'block-building'],
		chains: ['Ethereum'],
		color: '#6366F1'
	},
	{
		id: 'rsync-builder',
		name: 'rsync Builder',
		descriptionKey: 'chain-tools.mev.tools.rsync_builder.description',
		url: 'https://rsync.xyz',
		icon: Rocket,
		category: 'mev',
		tags: ['mev', 'builder', 'pbs', 'block-building'],
		chains: ['Ethereum'],
		color: '#10B981'
	},
	// ========== MEV Analytics ==========
	{
		id: 'flashbots-transparency',
		name: 'Flashbots Transparency Dashboard',
		descriptionKey: 'chain-tools.mev.tools.flashbots_transparency.description',
		url: 'https://transparency.flashbots.net',
		icon: BarChart3,
		category: 'mev',
		tags: ['mev', 'analytics', 'transparency', 'data'],
		chains: ['Ethereum'],
		color: '#FF6B35'
	},
	{
		id: 'mev-explore',
		name: 'MEV-Explore',
		descriptionKey: 'chain-tools.mev.tools.mev_explore.description',
		url: 'https://explore.flashbots.net',
		icon: Search,
		category: 'mev',
		tags: ['mev', 'analytics', 'explorer', 'data'],
		chains: ['Ethereum'],
		color: '#FF6B35'
	},
	{
		id: 'eigenphi-mev',
		name: 'EigenPhi MEV',
		descriptionKey: 'chain-tools.mev.tools.eigenphi_mev.description',
		url: 'https://eigenphi.io',
		icon: Eye,
		category: 'mev',
		tags: ['mev', 'analytics', 'tracking', 'defi'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'mev-watch',
		name: 'MEV Watch',
		descriptionKey: 'chain-tools.mev.tools.mev_watch.description',
		url: 'https://mevwatch.info',
		icon: Eye,
		category: 'mev',
		tags: ['mev', 'censorship', 'ofac', 'analytics'],
		chains: ['Ethereum'],
		color: '#EF4444'
	},
	{
		id: 'zeromev',
		name: 'ZeroMEV',
		descriptionKey: 'chain-tools.mev.tools.zeromev.description',
		url: 'https://zeromev.org',
		icon: Activity,
		category: 'mev',
		tags: ['mev', 'analytics', 'extraction', 'data'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'relayscan',
		name: 'Relayscan',
		descriptionKey: 'chain-tools.mev.tools.relayscan.description',
		url: 'https://relayscan.io',
		icon: Network,
		category: 'mev',
		tags: ['mev', 'relay', 'pbs', 'analytics'],
		chains: ['Ethereum'],
		color: '#3B82F6'
	},
	{
		id: 'mevboost-pics',
		name: 'mevboost.pics',
		descriptionKey: 'chain-tools.mev.tools.mevboost_pics.description',
		url: 'https://mevboost.pics',
		icon: BarChart3,
		category: 'mev',
		tags: ['mev', 'analytics', 'mev-boost', 'visualization'],
		chains: ['Ethereum'],
		color: '#6366F1'
	},
	// ========== MEV Infrastructure ==========
	{
		id: 'mev-boost',
		name: 'MEV-Boost',
		descriptionKey: 'chain-tools.mev.tools.mev_boost.description',
		url: 'https://boost.flashbots.net',
		icon: Zap,
		category: 'mev',
		tags: ['mev', 'pbs', 'validators', 'infrastructure'],
		chains: ['Ethereum'],
		color: '#FF6B35'
	},
	{
		id: 'suave',
		name: 'SUAVE',
		descriptionKey: 'chain-tools.mev.tools.suave.description',
		url: 'https://suave.flashbots.net',
		icon: Network,
		category: 'mev',
		tags: ['mev', 'suave', 'flashbots', 'future'],
		chains: ['Ethereum'],
		color: '#FF6B35'
	},
	{
		id: 'mev-share',
		name: 'MEV-Share',
		descriptionKey: 'chain-tools.mev.tools.mev_share.description',
		url: 'https://docs.flashbots.net/flashbots-mev-share/overview',
		icon: Zap,
		category: 'mev',
		tags: ['mev', 'mev-share', 'redistribution', 'flashbots'],
		chains: ['Ethereum'],
		color: '#FF6B35'
	},
	// ========== Solana MEV ==========
	{
		id: 'jito-mev',
		name: 'Jito MEV',
		descriptionKey: 'chain-tools.mev.tools.jito_mev.description',
		url: 'https://jito.wtf',
		icon: Zap,
		category: 'mev',
		tags: ['mev', 'solana', 'jito', 'tips'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'jito-bundles',
		name: 'Jito Bundles',
		descriptionKey: 'chain-tools.mev.tools.jito_bundles.description',
		url: 'https://jito-labs.gitbook.io/mev',
		icon: Code,
		category: 'mev',
		tags: ['mev', 'solana', 'bundles', 'searchers'],
		chains: ['Solana'],
		color: '#14F195'
	}
];
