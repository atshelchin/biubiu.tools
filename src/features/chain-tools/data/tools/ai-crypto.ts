/**
 * AI Crypto Tools - AI x Crypto intersection projects
 *
 * Categories:
 * - AI Agents & Autonomous Systems
 * - Decentralized AI Infrastructure
 * - AI Data & Training
 * - AI Model Marketplaces
 */
import {
	Bot,
	Brain,
	Cpu,
	Network,
	Sparkles,
	Database,
	Zap,
	Users,
	Search,
	MessageSquare,
	Image
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const aiCryptoTools: ExternalTool[] = [
	// ========== AI Agents ==========
	{
		id: 'virtuals-protocol',
		name: 'Virtuals Protocol',
		descriptionKey: 'chain_tools.tools.virtuals_protocol.description',
		url: 'https://virtuals.io',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'gaming', 'virtual'],
		chains: ['Base'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'ai16z',
		name: 'ai16z',
		descriptionKey: 'chain_tools.tools.ai16z.description',
		url: 'https://ai16z.ai',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'eliza', 'framework'],
		chains: ['Solana'],
		color: '#000000',
		isFeatured: true
	},
	{
		id: 'truth-terminal',
		name: 'Truth Terminal',
		descriptionKey: 'chain_tools.tools.truth_terminal.description',
		url: 'https://x.com/truth_terminal',
		icon: MessageSquare,
		category: 'ai-crypto',
		tags: ['ai', 'agent', 'goat', 'meme'],
		chains: ['Solana'],
		color: '#1DA1F2'
	},
	{
		id: 'autonolas',
		name: 'Autonolas (OLAS)',
		descriptionKey: 'chain_tools.tools.autonolas.description',
		url: 'https://olas.network',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'autonomous', 'services'],
		chains: ['Ethereum', 'Gnosis'],
		color: '#7C3AED',
		isFeatured: true
	},
	{
		id: 'flock-io',
		name: 'FLock.io',
		descriptionKey: 'chain_tools.tools.flock_io.description',
		url: 'https://flock.io',
		icon: Users,
		category: 'ai-crypto',
		tags: ['ai', 'training', 'federated', 'learning'],
		chains: ['Ethereum'],
		color: '#6366F1'
	},
	// ========== AI Infrastructure ==========
	{
		id: 'render-network',
		name: 'Render Network',
		descriptionKey: 'chain_tools.tools.render_network.description',
		url: 'https://rendernetwork.com',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'gpu', 'render', 'compute'],
		chains: ['Solana'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'akash-network',
		name: 'Akash Network',
		descriptionKey: 'chain_tools.tools.akash_network.description',
		url: 'https://akash.network',
		icon: Network,
		category: 'ai-crypto',
		tags: ['ai', 'compute', 'cloud', 'decentralized'],
		chains: ['Cosmos'],
		color: '#FF4500',
		isFeatured: true
	},
	{
		id: 'io-net',
		name: 'io.net',
		descriptionKey: 'chain_tools.tools.io_net.description',
		url: 'https://io.net',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'gpu', 'compute', 'depin'],
		chains: ['Solana'],
		color: '#000000'
	},
	{
		id: 'bittensor',
		name: 'Bittensor (TAO)',
		descriptionKey: 'chain_tools.tools.bittensor.description',
		url: 'https://bittensor.com',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'ml', 'network', 'incentive'],
		chains: ['Bittensor'],
		color: '#000000',
		isFeatured: true
	},
	{
		id: 'ritual',
		name: 'Ritual',
		descriptionKey: 'chain_tools.tools.ritual.description',
		url: 'https://ritual.net',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'infra', 'coprocessor', 'ml'],
		chains: ['Ethereum'],
		color: '#1E1E1E'
	},
	{
		id: 'gensyn',
		name: 'Gensyn',
		descriptionKey: 'chain_tools.tools.gensyn.description',
		url: 'https://gensyn.ai',
		icon: Network,
		category: 'ai-crypto',
		tags: ['ai', 'training', 'compute', 'distributed'],
		chains: ['Ethereum'],
		color: '#00D395'
	},
	{
		id: 'together-ai',
		name: 'Together AI',
		descriptionKey: 'chain_tools.tools.together_ai.description',
		url: 'https://together.ai',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'inference', 'models', 'api'],
		color: '#FF6B35'
	},
	// ========== AI Data ==========
	{
		id: 'fetch-ai',
		name: 'Fetch.ai (FET)',
		descriptionKey: 'chain_tools.tools.fetch_ai.description',
		url: 'https://fetch.ai',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'data', 'automation'],
		chains: ['Ethereum', 'Fetch'],
		color: '#1D1D3B',
		isFeatured: true
	},
	{
		id: 'ocean-protocol',
		name: 'Ocean Protocol',
		descriptionKey: 'chain_tools.tools.ocean_protocol.description',
		url: 'https://oceanprotocol.com',
		icon: Database,
		category: 'ai-crypto',
		tags: ['ai', 'data', 'marketplace', 'compute'],
		chains: ['Ethereum', 'Polygon'],
		color: '#FF4092'
	},
	{
		id: 'singularitynet',
		name: 'SingularityNET (AGIX)',
		descriptionKey: 'chain_tools.tools.singularitynet.description',
		url: 'https://singularitynet.io',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'marketplace', 'agi', 'services'],
		chains: ['Ethereum', 'Cardano'],
		color: '#6C3FA0'
	},
	{
		id: 'masa',
		name: 'Masa',
		descriptionKey: 'chain_tools.tools.masa.description',
		url: 'https://masa.ai',
		icon: Database,
		category: 'ai-crypto',
		tags: ['ai', 'data', 'identity', 'network'],
		chains: ['Ethereum'],
		color: '#FF6B35'
	},
	{
		id: 'grass',
		name: 'Grass',
		descriptionKey: 'chain_tools.tools.grass.description',
		url: 'https://getgrass.io',
		icon: Network,
		category: 'ai-crypto',
		tags: ['ai', 'data', 'bandwidth', 'depin'],
		chains: ['Solana'],
		color: '#22C55E'
	},
	// ========== AI x NFT ==========
	{
		id: 'altered-state-machine',
		name: 'Altered State Machine',
		descriptionKey: 'chain_tools.tools.altered_state_machine.description',
		url: 'https://alteredstatemachine.xyz',
		icon: Sparkles,
		category: 'ai-crypto',
		tags: ['ai', 'nft', 'gaming', 'metaverse'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'alethea-ai',
		name: 'Alethea AI',
		descriptionKey: 'chain_tools.tools.alethea_ai.description',
		url: 'https://alethea.ai',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'nft', 'inft', 'generative'],
		chains: ['Ethereum'],
		color: '#00D4AA'
	},
	// ========== AI Generative ==========
	{
		id: 'midjourney-crypto',
		name: 'NFT Art Generators',
		descriptionKey: 'chain_tools.tools.nft_art_generators.description',
		url: 'https://nft.ai',
		icon: Image,
		category: 'ai-crypto',
		tags: ['ai', 'generative', 'art', 'nft'],
		color: '#EC4899'
	},
	{
		id: 'stability-ai',
		name: 'Stability AI',
		descriptionKey: 'chain_tools.tools.stability_ai.description',
		url: 'https://stability.ai',
		icon: Image,
		category: 'ai-crypto',
		tags: ['ai', 'generative', 'stable-diffusion', 'open-source'],
		color: '#8B5CF6'
	},
	// ========== AI Analytics ==========
	{
		id: 'cookie-ai',
		name: 'Cookie.fun',
		descriptionKey: 'chain_tools.tools.cookie_ai.description',
		url: 'https://cookie.fun',
		icon: Search,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'tracking', 'analytics'],
		color: '#F59E0B',
		isFeatured: true
	},
	{
		id: 'virtuals-terminal',
		name: 'Virtuals Terminal',
		descriptionKey: 'chain_tools.tools.virtuals_terminal.description',
		url: 'https://app.virtuals.io',
		icon: Zap,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'launchpad', 'base'],
		chains: ['Base'],
		color: '#8B5CF6'
	},
	{
		id: 'defillama-ai',
		name: 'DeFiLlama AI',
		descriptionKey: 'chain_tools.tools.defillama_ai.description',
		url: 'https://defillama.com/protocols/AI',
		icon: Search,
		category: 'ai-crypto',
		tags: ['ai', 'analytics', 'tvl', 'tracking'],
		color: '#2172E5'
	}
];
