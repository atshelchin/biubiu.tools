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
	},

	// ========== Additional AI Crypto Projects ==========
	{
		id: 'worldcoin',
		name: 'Worldcoin',
		descriptionKey: 'chain_tools.tools.worldcoin.description',
		url: 'https://worldcoin.org',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'identity', 'proof-of-personhood', 'sam-altman'],
		chains: ['Ethereum', 'Optimism'],
		color: '#000000',
		isFeatured: true
	},
	{
		id: 'morpheus-ai',
		name: 'Morpheus',
		descriptionKey: 'chain_tools.tools.morpheus_ai.description',
		url: 'https://mor.org',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'decentralized', 'compute'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#00D395'
	},
	{
		id: 'spectral-ai',
		name: 'Spectral',
		descriptionKey: 'chain_tools.tools.spectral_ai.description',
		url: 'https://spectral.finance',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'credit', 'scoring', 'onchain'],
		chains: ['Ethereum'],
		color: '#6366F1'
	},
	{
		id: 'numerai',
		name: 'Numerai',
		descriptionKey: 'chain_tools.tools.numerai.description',
		url: 'https://numer.ai',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'hedge-fund', 'data-science', 'predictions'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'dain-ai',
		name: 'DAIN',
		descriptionKey: 'chain_tools.tools.dain_ai.description',
		url: 'https://dain.org',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'solana', 'automation'],
		chains: ['Solana'],
		color: '#9945FF'
	},
	{
		id: 'vana',
		name: 'Vana',
		descriptionKey: 'chain_tools.tools.vana.description',
		url: 'https://vana.org',
		icon: Database,
		category: 'ai-crypto',
		tags: ['ai', 'data', 'ownership', 'privacy'],
		color: '#FF6B35'
	},
	{
		id: 'phala-network',
		name: 'Phala Network',
		descriptionKey: 'chain_tools.tools.phala_network.description',
		url: 'https://phala.network',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'compute', 'privacy', 'tee'],
		chains: ['Polkadot'],
		color: '#D1FF52'
	},
	{
		id: 'nosana',
		name: 'Nosana',
		descriptionKey: 'chain_tools.tools.nosana.description',
		url: 'https://nosana.io',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'gpu', 'compute', 'ci-cd'],
		chains: ['Solana'],
		color: '#7C3AED'
	},
	{
		id: 'golem',
		name: 'Golem',
		descriptionKey: 'chain_tools.tools.golem.description',
		url: 'https://golem.network',
		icon: Network,
		category: 'ai-crypto',
		tags: ['ai', 'compute', 'marketplace', 'decentralized'],
		chains: ['Ethereum'],
		color: '#0C14D4'
	},
	{
		id: 'livepeer',
		name: 'Livepeer',
		descriptionKey: 'chain_tools.tools.livepeer.description',
		url: 'https://livepeer.org',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'video', 'transcoding', 'gpu'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#00EB88'
	},
	{
		id: 'hyperbolic',
		name: 'Hyperbolic',
		descriptionKey: 'chain_tools.tools.hyperbolic.description',
		url: 'https://hyperbolic.xyz',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'inference', 'gpu', 'api'],
		color: '#8B5CF6'
	},
	{
		id: 'venice-ai',
		name: 'Venice AI',
		descriptionKey: 'chain_tools.tools.venice_ai.description',
		url: 'https://venice.ai',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'privacy', 'uncensored', 'chat'],
		color: '#1E1E1E'
	},
	{
		id: 'myshell',
		name: 'MyShell',
		descriptionKey: 'chain_tools.tools.myshell.description',
		url: 'https://myshell.ai',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'voice', 'platform'],
		chains: ['BSC'],
		color: '#8B5CF6'
	},
	{
		id: 'griffain',
		name: 'Griffain',
		descriptionKey: 'chain_tools.tools.griffain.description',
		url: 'https://griffain.com',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'solana', 'defi'],
		chains: ['Solana'],
		color: '#FFD700'
	},
	{
		id: 'arc-ai',
		name: 'Arc',
		descriptionKey: 'chain_tools.tools.arc_ai.description',
		url: 'https://arc.fun',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'rust', 'framework'],
		chains: ['Solana'],
		color: '#FF6B35'
	},
	{
		id: 'zerebro',
		name: 'Zerebro',
		descriptionKey: 'chain_tools.tools.zerebro.description',
		url: 'https://zerebro.org',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'agent', 'autonomous', 'creative'],
		chains: ['Solana'],
		color: '#8B5CF6'
	},
	{
		id: 'swarmnode',
		name: 'SwarmNode',
		descriptionKey: 'chain_tools.tools.swarmnode.description',
		url: 'https://swarmnode.ai',
		icon: Network,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'swarm', 'orchestration'],
		color: '#00D395'
	},
	{
		id: 'sentient-ai',
		name: 'Sentient',
		descriptionKey: 'chain_tools.tools.sentient_ai.description',
		url: 'https://sentient.foundation',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'open-source', 'agi', 'foundation'],
		color: '#6366F1'
	},
	{
		id: 'nous-research',
		name: 'Nous Research',
		descriptionKey: 'chain_tools.tools.nous_research.description',
		url: 'https://nousresearch.com',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'models', 'open-source', 'hermes'],
		color: '#FF4500'
	},
	{
		id: 'pond-ai',
		name: 'Pond',
		descriptionKey: 'chain_tools.tools.pond_ai.description',
		url: 'https://cryptopond.xyz',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'predictions', 'onchain', 'gnns'],
		color: '#00CED1'
	},
	{
		id: 'aioz-network',
		name: 'AIOZ Network',
		descriptionKey: 'chain_tools.tools.aioz_network.description',
		url: 'https://aioz.network',
		icon: Network,
		category: 'ai-crypto',
		tags: ['ai', 'cdn', 'streaming', 'depin'],
		chains: ['AIOZ'],
		color: '#5856D6'
	},
	{
		id: 'theoriq',
		name: 'Theoriq',
		descriptionKey: 'chain_tools.tools.theoriq.description',
		url: 'https://theoriq.ai',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'agents', 'base', 'collectives'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'ora-protocol',
		name: 'ORA Protocol',
		descriptionKey: 'chain_tools.tools.ora_protocol.description',
		url: 'https://ora.io',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'oracle', 'ml', 'onchain'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'modulus-labs',
		name: 'Modulus Labs',
		descriptionKey: 'chain_tools.tools.modulus_labs.description',
		url: 'https://modulus.xyz',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'zkml', 'proofs', 'onchain'],
		chains: ['Ethereum'],
		color: '#FF6B35'
	},
	{
		id: 'ezkl',
		name: 'EZKL',
		descriptionKey: 'chain_tools.tools.ezkl.description',
		url: 'https://ezkl.xyz',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'zkml', 'proofs', 'inference'],
		color: '#8B5CF6'
	},
	{
		id: 'giza',
		name: 'Giza',
		descriptionKey: 'chain_tools.tools.giza.description',
		url: 'https://gizatech.xyz',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'zkml', 'starknet', 'agents'],
		chains: ['StarkNet'],
		color: '#FF4500'
	},
	{
		id: 'lagrange-dao',
		name: 'Lagrange DAO',
		descriptionKey: 'chain_tools.tools.lagrange_dao.description',
		url: 'https://lagrangedao.org',
		icon: Database,
		category: 'ai-crypto',
		tags: ['ai', 'compute', 'data', 'filecoin'],
		chains: ['Filecoin'],
		color: '#0090FF'
	},
	{
		id: 'kip-protocol',
		name: 'KIP Protocol',
		descriptionKey: 'chain_tools.tools.kip_protocol.description',
		url: 'https://kip.pro',
		icon: Database,
		category: 'ai-crypto',
		tags: ['ai', 'knowledge', 'rag', 'monetization'],
		color: '#FF6B35'
	},
	{
		id: 'sahara-ai',
		name: 'Sahara AI',
		descriptionKey: 'chain_tools.tools.sahara_ai.description',
		url: 'https://saharalabs.ai',
		icon: Database,
		category: 'ai-crypto',
		tags: ['ai', 'data', 'knowledge', 'blockchain'],
		color: '#FFD700'
	},
	{
		id: 'bagel-network',
		name: 'Bagel Network',
		descriptionKey: 'chain_tools.tools.bagel_network.description',
		url: 'https://bagel.net',
		icon: Database,
		category: 'ai-crypto',
		tags: ['ai', 'data', 'ml', 'pipeline'],
		color: '#F59E0B'
	},
	{
		id: 'allora-network',
		name: 'Allora',
		descriptionKey: 'chain_tools.tools.allora_network.description',
		url: 'https://allora.network',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'intelligence', 'context', 'predictions'],
		color: '#8B5CF6'
	},
	{
		id: 'nillion',
		name: 'Nillion',
		descriptionKey: 'chain_tools.tools.nillion.description',
		url: 'https://nillion.com',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'privacy', 'compute', 'mpc'],
		color: '#00D395'
	},
	{
		id: 'arbius',
		name: 'Arbius',
		descriptionKey: 'chain_tools.tools.arbius.description',
		url: 'https://arbius.ai',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'gpu', 'mining', 'compute'],
		chains: ['Arbitrum'],
		color: '#12AAFF'
	},
	{
		id: 'crynux',
		name: 'Crynux',
		descriptionKey: 'chain_tools.tools.crynux.description',
		url: 'https://crynux.ai',
		icon: Network,
		category: 'ai-crypto',
		tags: ['ai', 'gpu', 'decentralized', 'inference'],
		color: '#6366F1'
	},
	{
		id: 'gpu-net',
		name: 'GPU.Net',
		descriptionKey: 'chain_tools.tools.gpu_net.description',
		url: 'https://gpu.net',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'gpu', 'network', 'compute'],
		color: '#00D395'
	},
	{
		id: 'aethir',
		name: 'Aethir',
		descriptionKey: 'chain_tools.tools.aethir.description',
		url: 'https://aethir.com',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'gpu', 'cloud', 'gaming'],
		chains: ['Arbitrum'],
		color: '#00CED1'
	},
	{
		id: 'spheron',
		name: 'Spheron',
		descriptionKey: 'chain_tools.tools.spheron.description',
		url: 'https://spheron.network',
		icon: Network,
		category: 'ai-crypto',
		tags: ['ai', 'compute', 'deployment', 'gpu'],
		color: '#FF6B35'
	},
	{
		id: 'clore-ai',
		name: 'Clore.ai',
		descriptionKey: 'chain_tools.tools.clore_ai.description',
		url: 'https://clore.ai',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'gpu', 'rental', 'marketplace'],
		color: '#3B82F6'
	},
	{
		id: 'theta-edge',
		name: 'Theta EdgeCloud',
		descriptionKey: 'chain_tools.tools.theta_edge.description',
		url: 'https://thetatoken.org',
		icon: Cpu,
		category: 'ai-crypto',
		tags: ['ai', 'gpu', 'video', 'edge'],
		chains: ['Theta'],
		color: '#29B6F6'
	},
	{
		id: 'nimble-network',
		name: 'Nimble',
		descriptionKey: 'chain_tools.tools.nimble_network.description',
		url: 'https://nimble.technology',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'framework', 'decentralized', 'composable'],
		color: '#8B5CF6'
	},
	{
		id: 'tensorplex',
		name: 'Tensorplex',
		descriptionKey: 'chain_tools.tools.tensorplex.description',
		url: 'https://tensorplex.ai',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'bittensor', 'staking', 'liquid'],
		chains: ['Bittensor'],
		color: '#000000'
	},
	{
		id: 'taoshi',
		name: 'Taoshi',
		descriptionKey: 'chain_tools.tools.taoshi.description',
		url: 'https://taoshi.io',
		icon: Brain,
		category: 'ai-crypto',
		tags: ['ai', 'bittensor', 'trading', 'subnet'],
		chains: ['Bittensor'],
		color: '#FF6B35'
	},
	{
		id: 'corcel',
		name: 'Corcel',
		descriptionKey: 'chain_tools.tools.corcel.description',
		url: 'https://corcel.io',
		icon: Bot,
		category: 'ai-crypto',
		tags: ['ai', 'bittensor', 'api', 'chat'],
		chains: ['Bittensor'],
		color: '#8B5CF6'
	}
];
