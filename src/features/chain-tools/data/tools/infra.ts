/**
 * Infra Tools - RPC providers, node services, storage, and infrastructure
 */
import {
	Network,
	HardDrive,
	Zap,
	Globe,
	Database,
	Bell,
	MessageSquare,
	Link2,
	Server,
	Shield
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const infraTools: ExternalTool[] = [
	// ========== RPC Providers ==========
	{
		id: 'ankr',
		name: 'Ankr',
		descriptionKey: 'infra.tools.ankr.description',
		url: 'https://www.ankr.com',
		icon: Network,
		category: 'infra',
		tags: ['rpc', 'staking', 'node', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Avalanche', 'Fantom'],
		color: '#356DF3'
	},
	{
		id: 'chainstack',
		name: 'Chainstack',
		descriptionKey: 'infra.tools.chainstack.description',
		url: 'https://chainstack.com',
		icon: HardDrive,
		category: 'infra',
		tags: ['rpc', 'node', 'enterprise', 'managed'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Solana', 'Avalanche'],
		color: '#1B1464'
	},
	{
		id: 'blast-api',
		name: 'Blast API',
		descriptionKey: 'infra.tools.blast_api.description',
		url: 'https://blastapi.io',
		icon: Zap,
		category: 'infra',
		tags: ['rpc', 'api', 'decentralized', 'fast'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Avalanche'],
		color: '#FCFC03'
	},
	{
		id: 'grove',
		name: 'Grove (POKT)',
		descriptionKey: 'infra.tools.grove.description',
		url: 'https://grove.city',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'decentralized', 'relay', 'infrastructure'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#10B981'
	},
	{
		id: 'drpc',
		name: 'dRPC',
		descriptionKey: 'infra.tools.drpc.description',
		url: 'https://drpc.org',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'decentralized', 'multi-chain', 'infrastructure'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#6366F1'
	},
	{
		id: 'nodies',
		name: 'Nodies',
		descriptionKey: 'infra.tools.nodies.description',
		url: 'https://nodies.app',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'node', 'multi-chain', 'infrastructure'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche'],
		color: '#EF4444'
	},
	{
		id: 'llamanodes',
		name: 'LlamaNodes',
		descriptionKey: 'infra.tools.llamanodes.description',
		url: 'https://llamanodes.com',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'privacy', 'multi-chain', 'infrastructure'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'BSC'],
		color: '#14B8A6'
	},
	{
		id: 'tenderly-node',
		name: 'Tenderly Node',
		descriptionKey: 'infra.tools.tenderly_node.description',
		url: 'https://tenderly.co/web3-gateway',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'node', 'simulation', 'infrastructure'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#7C3AED'
	},
	{
		id: 'getblock',
		name: 'GetBlock',
		descriptionKey: 'infra.tools.getblock.description',
		url: 'https://getblock.io',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'node', 'multi-chain', 'infrastructure'],
		color: '#FF4444'
	},
	{
		id: 'public-node',
		name: 'PublicNode',
		descriptionKey: 'infra.tools.public_node.description',
		url: 'https://publicnode.com',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'free', 'public', 'infrastructure'],
		color: '#22C55E'
	},

	// ========== Solana RPC Providers ==========
	{
		id: 'helius-rpc',
		name: 'Helius',
		descriptionKey: 'infra.tools.helius_rpc.description',
		url: 'https://helius.dev',
		icon: Server,
		category: 'infra',
		tags: ['solana', 'rpc', 'webhooks', 'api'],
		chains: ['Solana'],
		color: '#F97316'
	},
	{
		id: 'triton-rpc',
		name: 'Triton',
		descriptionKey: 'infra.tools.triton_rpc.description',
		url: 'https://triton.one',
		icon: Server,
		category: 'infra',
		tags: ['solana', 'rpc', 'geyser', 'enterprise'],
		chains: ['Solana'],
		color: '#0EA5E9'
	},
	{
		id: 'syndica-rpc',
		name: 'Syndica',
		descriptionKey: 'infra.tools.syndica_rpc.description',
		url: 'https://syndica.io',
		icon: Server,
		category: 'infra',
		tags: ['solana', 'rpc', 'chainstream', 'infrastructure'],
		chains: ['Solana'],
		color: '#8B5CF6'
	},

	// ========== Multi-chain RPC ==========
	{
		id: 'lava-network',
		name: 'Lava Network',
		descriptionKey: 'infra.tools.lava_network.description',
		url: 'https://lavanet.xyz',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'decentralized', 'multichain', 'aggregator'],
		color: '#EF4444'
	},
	{
		id: 'erpc-network',
		name: 'eRPC',
		descriptionKey: 'infra.tools.erpc_network.description',
		url: 'https://erpc.cloud',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'fault-tolerant', 'load-balancer', 'caching'],
		color: '#22C55E'
	},
	{
		id: 'thirdweb-rpc',
		name: 'thirdweb RPC',
		descriptionKey: 'infra.tools.thirdweb_rpc.description',
		url: 'https://thirdweb.com/rpc',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'free', 'multichain', 'reliable'],
		color: '#A855F7'
	},
	{
		id: 'tatum-rpc',
		name: 'Tatum',
		descriptionKey: 'infra.tools.tatum_rpc.description',
		url: 'https://tatum.io',
		icon: Server,
		category: 'infra',
		tags: ['api', 'multichain', 'sdk', 'infrastructure'],
		color: '#3B82F6'
	},
	{
		id: 'chainstack-rpc',
		name: 'Chainstack',
		descriptionKey: 'infra.tools.chainstack_rpc.description',
		url: 'https://chainstack.com',
		icon: Server,
		category: 'infra',
		tags: ['nodes', 'rpc', 'multichain', 'enterprise'],
		color: '#000000'
	},
	{
		id: 'blockpi',
		name: 'BlockPI',
		descriptionKey: 'infra.tools.blockpi.description',
		url: 'https://blockpi.io',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'multichain', 'distributed', 'infrastructure'],
		color: '#6366F1'
	},
	{
		id: 'nodereal',
		name: 'NodeReal',
		descriptionKey: 'infra.tools.nodereal.description',
		url: 'https://nodereal.io',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'bnb-chain', 'api', 'infrastructure'],
		chains: ['BNB Chain', 'Ethereum', 'Polygon'],
		color: '#00C853'
	},

	// ========== Decentralized Storage ==========
	{
		id: 'ipfs',
		name: 'IPFS',
		descriptionKey: 'infra.tools.ipfs.description',
		url: 'https://ipfs.tech',
		icon: Globe,
		category: 'infra',
		tags: ['storage', 'decentralized', 'pinning', 'content-addressing'],
		color: '#65C2CB'
	},
	{
		id: 'arweave',
		name: 'Arweave',
		descriptionKey: 'infra.tools.arweave.description',
		url: 'https://www.arweave.org',
		icon: HardDrive,
		category: 'infra',
		tags: ['storage', 'permanent', 'permaweb'],
		color: '#222326'
	},
	{
		id: 'filecoin',
		name: 'Filecoin',
		descriptionKey: 'infra.tools.filecoin.description',
		url: 'https://filecoin.io',
		icon: HardDrive,
		category: 'infra',
		tags: ['storage', 'decentralized', 'incentivized'],
		color: '#0090FF'
	},
	{
		id: 'ceramic',
		name: 'Ceramic',
		descriptionKey: 'infra.tools.ceramic.description',
		url: 'https://ceramic.network',
		icon: Database,
		category: 'infra',
		tags: ['storage', 'streams', 'composable', 'identity'],
		color: '#FF5733'
	},

	// ========== Messaging & Notifications ==========
	{
		id: 'push-protocol',
		name: 'Push Protocol',
		descriptionKey: 'infra.tools.push_protocol.description',
		url: 'https://push.org',
		icon: Bell,
		category: 'infra',
		tags: ['messaging', 'notifications', 'web3-native'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum'],
		color: '#DD44B9'
	},
	{
		id: 'xmtp',
		name: 'XMTP',
		descriptionKey: 'infra.tools.xmtp.description',
		url: 'https://xmtp.org',
		icon: MessageSquare,
		category: 'infra',
		tags: ['messaging', 'e2e-encrypted', 'wallet-to-wallet'],
		chains: ['Ethereum'],
		color: '#FC4F37'
	},
	{
		id: 'walletconnect',
		name: 'WalletConnect',
		descriptionKey: 'infra.tools.walletconnect.description',
		url: 'https://walletconnect.com',
		icon: Link2,
		category: 'infra',
		tags: ['connection', 'protocol', 'multi-chain', 'standard'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Solana'],
		color: '#3B99FC'
	},

	// ========== MEV Protection ==========
	{
		id: 'flashbots-protect',
		name: 'Flashbots Protect',
		descriptionKey: 'infra.tools.flashbots_protect.description',
		url: 'https://protect.flashbots.net',
		icon: Shield,
		category: 'infra',
		tags: ['mev', 'protection', 'rpc', 'privacy'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'mev-blocker',
		name: 'MEV Blocker',
		descriptionKey: 'infra.tools.mev_blocker.description',
		url: 'https://mevblocker.io',
		icon: Shield,
		category: 'infra',
		tags: ['mev', 'protection', 'rpc', 'rebates'],
		chains: ['Ethereum'],
		color: '#FF4500'
	},

	// ========== Oracles ==========
	{
		id: 'switchboard',
		name: 'Switchboard',
		descriptionKey: 'infra.tools.switchboard.description',
		url: 'https://switchboard.xyz',
		icon: Server,
		category: 'infra',
		tags: ['oracle', 'solana', 'vrf', 'price-feeds'],
		chains: ['Solana', 'Aptos', 'Sui', 'CoreDAO'],
		color: '#00D1FF'
	},
	{
		id: 'dia',
		name: 'DIA',
		descriptionKey: 'infra.tools.dia.description',
		url: 'https://diadata.org',
		icon: Server,
		category: 'infra',
		tags: ['oracle', 'transparent', 'customizable', 'nft-floor'],
		chains: ['Ethereum', 'Polygon', 'BNB Chain', 'Arbitrum', 'Fantom'],
		color: '#FF6B6B'
	},
	{
		id: 'band_protocol',
		name: 'Band Protocol',
		descriptionKey: 'infra.tools.band_protocol.description',
		url: 'https://bandprotocol.com',
		icon: Server,
		category: 'infra',
		tags: ['oracle', 'cross-chain', 'cosmos', 'price-feeds'],
		chains: ['Ethereum', 'BNB Chain', 'Fantom', 'Cosmos'],
		color: '#516AFF'
	},
	{
		id: 'tellor',
		name: 'Tellor',
		descriptionKey: 'infra.tools.tellor.description',
		url: 'https://tellor.io',
		icon: Server,
		category: 'infra',
		tags: ['oracle', 'decentralized', 'dispute', 'crypto-native'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Gnosis'],
		color: '#20D47B'
	}
];
