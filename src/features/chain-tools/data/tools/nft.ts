/**
 * NFT Tools - NFT marketplaces, analytics, and utilities
 */
import {
	Image,
	Coins,
	Gem,
	Radio,
	Settings,
	Activity,
	Eye,
	Banknote,
	Sparkles,
	Link2,
	Trophy,
	BadgeCheck,
	Lock,
	Globe
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const nftTools: ExternalTool[] = [
	// ========== Major Marketplaces ==========
	{
		id: 'opensea',
		name: 'OpenSea',
		descriptionKey: 'nft.tools.opensea.description',
		url: 'https://opensea.io',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'nft', 'trading', 'collections'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#2081E2',
		isFeatured: true
	},
	{
		id: 'blur',
		name: 'Blur',
		descriptionKey: 'nft.tools.blur.description',
		url: 'https://blur.io',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'nft', 'trading', 'pro-traders'],
		chains: ['Ethereum', 'Blast'],
		color: '#FF6B00',
		isFeatured: true
	},
	{
		id: 'reservoir',
		name: 'Reservoir',
		descriptionKey: 'nft.tools.reservoir.description',
		url: 'https://reservoir.tools',
		icon: Coins,
		category: 'nft',
		tags: ['api', 'nft', 'aggregator', 'developers'],
		color: '#8B5CF6'
	},
	{
		id: 'magic-eden',
		name: 'Magic Eden',
		descriptionKey: 'nft.tools.magic_eden.description',
		url: 'https://magiceden.io',
		icon: Gem,
		category: 'nft',
		tags: ['marketplace', 'nft', 'bitcoin', 'ordinals'],
		chains: ['Ethereum', 'Polygon', 'Bitcoin'],
		color: '#E42575'
	},
	{
		id: 'rarible',
		name: 'Rarible',
		descriptionKey: 'nft.tools.rarible.description',
		url: 'https://rarible.com',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'nft', 'create', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'Tezos'],
		color: '#FEDA03'
	},
	{
		id: 'zora',
		name: 'Zora',
		descriptionKey: 'nft.tools.zora.description',
		url: 'https://zora.co',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'mint', 'create', 'hyperstructure'],
		chains: ['Ethereum', 'Zora Network', 'Base'],
		color: '#000000'
	},
	{
		id: 'foundation',
		name: 'Foundation',
		descriptionKey: 'nft.tools.foundation.description',
		url: 'https://foundation.app',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'art', 'creator', 'auction'],
		chains: ['Ethereum'],
		color: '#000000'
	},

	// ========== Music & Media NFTs ==========
	{
		id: 'sound-xyz',
		name: 'Sound.xyz',
		descriptionKey: 'nft.tools.sound_xyz.description',
		url: 'https://www.sound.xyz',
		icon: Radio,
		category: 'nft',
		tags: ['music', 'nft', 'artist', 'web3'],
		chains: ['Ethereum', 'Optimism'],
		color: '#1DB954'
	},

	// ========== Creator Tools ==========
	{
		id: 'manifold',
		name: 'Manifold',
		descriptionKey: 'nft.tools.manifold.description',
		url: 'https://manifold.xyz',
		icon: Settings,
		category: 'nft',
		tags: ['creator', 'smart-contract', 'mint', 'tools'],
		chains: ['Ethereum', 'Optimism', 'Base'],
		color: '#7C3AED'
	},

	// ========== Analytics ==========
	{
		id: 'icy-tools',
		name: 'icy.tools',
		descriptionKey: 'nft.tools.icy_tools.description',
		url: 'https://icy.tools',
		icon: Activity,
		category: 'nft',
		tags: ['analytics', 'trending', 'mints', 'whales'],
		color: '#00B4D8'
	},
	{
		id: 'nftnerds',
		name: 'NFTNerds',
		descriptionKey: 'nft.tools.nftnerds.description',
		url: 'https://nftnerds.ai',
		icon: Eye,
		category: 'nft',
		tags: ['analytics', 'sniping', 'rarity', 'trading'],
		color: '#FF6B6B'
	},

	// ========== NFT-Fi ==========
	{
		id: 'sudoswap',
		name: 'Sudoswap',
		descriptionKey: 'nft.tools.sudoswap.description',
		url: 'https://sudoswap.xyz',
		icon: Image,
		category: 'nft',
		tags: ['amm', 'nft', 'liquidity', 'trading'],
		chains: ['Ethereum'],
		color: '#0066FF'
	},
	{
		id: 'caviar',
		name: 'Caviar',
		descriptionKey: 'nft.tools.caviar.description',
		url: 'https://goerli.caviar.sh',
		icon: Image,
		category: 'nft',
		tags: ['amm', 'nft', 'fractionalization', 'liquidity'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'nftx',
		name: 'NFTX',
		descriptionKey: 'nft.tools.nftx.description',
		url: 'https://nftx.io',
		icon: Image,
		category: 'nft',
		tags: ['vault', 'nft', 'liquidity', 'fractionalization'],
		chains: ['Ethereum'],
		color: '#FC5C7D'
	},
	{
		id: 'floor-protocol',
		name: 'Floor Protocol',
		descriptionKey: 'nft.tools.floor_protocol.description',
		url: 'https://flooring.io',
		icon: Image,
		category: 'nft',
		tags: ['fractionalization', 'nft', 'micro-tokens', 'liquidity'],
		chains: ['Ethereum'],
		color: '#7C3AED'
	},
	{
		id: 'tessera',
		name: 'Tessera',
		descriptionKey: 'nft.tools.tessera.description',
		url: 'https://tessera.co',
		icon: Image,
		category: 'nft',
		tags: ['fractionalization', 'nft', 'collective', 'ownership'],
		chains: ['Ethereum'],
		color: '#000000'
	},

	// ========== NFT Lending ==========
	{
		id: 'nftfi',
		name: 'NFTfi',
		descriptionKey: 'nft.tools.nftfi.description',
		url: 'https://nftfi.com',
		icon: Banknote,
		category: 'nft',
		tags: ['lending', 'loans', 'collateral'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'arcade',
		name: 'Arcade',
		descriptionKey: 'nft.tools.arcade.description',
		url: 'https://arcade.xyz',
		icon: Banknote,
		category: 'nft',
		tags: ['lending', 'loans', 'wrapped-collections'],
		chains: ['Ethereum'],
		color: '#7C3AED'
	},
	{
		id: 'unlockd',
		name: 'Unlockd',
		descriptionKey: 'nft.tools.unlockd.description',
		url: 'https://unlockd.finance',
		icon: Lock,
		category: 'nft',
		tags: ['lending', 'nft-fi', 'borrowing', 'liquidity'],
		chains: ['Ethereum'],
		color: '#F97316'
	},

	// ========== Launch & Allowlist ==========
	{
		id: 'premint',
		name: 'PREMINT',
		descriptionKey: 'nft.tools.premint.description',
		url: 'https://www.premint.xyz',
		icon: Image,
		category: 'nft',
		tags: ['allowlist', 'nft', 'whitelist', 'launch'],
		chains: ['Ethereum', 'Polygon'],
		color: '#FF6B6B'
	},
	{
		id: 'mintfun',
		name: 'mint.fun',
		descriptionKey: 'nft.tools.mintfun.description',
		url: 'https://mint.fun',
		icon: Sparkles,
		category: 'nft',
		tags: ['minting', 'discovery', 'trending', 'free-mints'],
		color: '#FF6B6B'
	},

	// ========== Creator Tools Extended ==========
	{
		id: 'bueno',
		name: 'Bueno',
		descriptionKey: 'nft.tools.bueno.description',
		url: 'https://bueno.art',
		icon: Image,
		category: 'nft',
		tags: ['generator', 'nft', 'art', 'no-code'],
		color: '#0A0A0A'
	},
	{
		id: 'highlight',
		name: 'Highlight',
		descriptionKey: 'nft.tools.highlight.description',
		url: 'https://highlight.xyz',
		icon: Image,
		category: 'nft',
		tags: ['minting', 'nft', 'creator', 'tools'],
		chains: ['Ethereum', 'Base', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#000000'
	},
	{
		id: 'transient-labs',
		name: 'Transient Labs',
		descriptionKey: 'nft.tools.transient_labs.description',
		url: 'https://transientlabs.xyz',
		icon: Image,
		category: 'nft',
		tags: ['smart-contract', 'nft', 'creator', 'tools'],
		chains: ['Ethereum', 'Base', 'Arbitrum'],
		color: '#00D9FF'
	},
	{
		id: 'decent-xyz',
		name: 'Decent',
		descriptionKey: 'nft.tools.decent_xyz.description',
		url: 'https://decent.xyz',
		icon: Image,
		category: 'nft',
		tags: ['cross-chain', 'nft', 'minting', 'bridge'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#6366F1'
	},

	// ========== Utilities ==========
	{
		id: 'tokenproof',
		name: 'Tokenproof',
		descriptionKey: 'nft.tools.tokenproof.description',
		url: 'https://tokenproof.xyz',
		icon: BadgeCheck,
		category: 'nft',
		tags: ['verification', 'nft', 'events', 'gating'],
		color: '#8B5CF6'
	},
	{
		id: 'delegate-cash',
		name: 'Delegate.cash',
		descriptionKey: 'nft.tools.delegate_cash.description',
		url: 'https://delegate.cash',
		icon: Link2,
		category: 'nft',
		tags: ['delegation', 'nft', 'security', 'hot-wallet'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#000000'
	},
	{
		id: 'warm-xyz',
		name: 'Warm.xyz',
		descriptionKey: 'nft.tools.warm_xyz.description',
		url: 'https://warm.xyz',
		icon: Link2,
		category: 'nft',
		tags: ['delegation', 'nft', 'linking', 'wallets'],
		chains: ['Ethereum'],
		color: '#FF6B6B'
	},

	// ========== Quest & Learn ==========
	{
		id: 'layer3-quests',
		name: 'Layer3',
		descriptionKey: 'nft.tools.layer3_quests.description',
		url: 'https://layer3.xyz',
		icon: Trophy,
		category: 'nft',
		tags: ['quests', 'learn', 'earn', 'credentials'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#4F46E5'
	},
	{
		id: 'rabbithole',
		name: 'RabbitHole',
		descriptionKey: 'nft.tools.rabbithole.description',
		url: 'https://rabbithole.gg',
		icon: Trophy,
		category: 'nft',
		tags: ['quests', 'credentials', 'learn', 'earn'],
		chains: ['Ethereum', 'Polygon', 'Optimism', 'Arbitrum'],
		color: '#8B5CF6'
	},

	// ========== Solana & Other Chains ==========
	{
		id: 'tensor',
		name: 'Tensor',
		descriptionKey: 'nft.tools.tensor.description',
		url: 'https://tensor.trade',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'solana', 'trading', 'amm'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'hyperspace',
		name: 'Hyperspace',
		descriptionKey: 'nft.tools.hyperspace.description',
		url: 'https://hyperspace.xyz',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'solana', 'aggregator'],
		chains: ['Solana'],
		color: '#8B5CF6'
	},
	{
		id: 'tradeport',
		name: 'Tradeport',
		descriptionKey: 'nft.tools.tradeport.description',
		url: 'https://tradeport.xyz',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'sui', 'aptos', 'move'],
		chains: ['Sui', 'Aptos'],
		color: '#0EA5E9'
	},
	{
		id: 'campfire',
		name: 'Campfire',
		descriptionKey: 'nft.tools.campfire.description',
		url: 'https://campfire.exchange',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'avalanche', 'nft'],
		chains: ['Avalanche'],
		color: '#E84142'
	},
	{
		id: 'paintswap',
		name: 'PaintSwap',
		descriptionKey: 'nft.tools.paintswap.description',
		url: 'https://paintswap.finance',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'fantom', 'sonic', 'nft'],
		chains: ['Fantom', 'Sonic'],
		color: '#1969FF'
	},

	// ========== Ordinals & Bitcoin ==========
	{
		id: 'ordinals-market',
		name: 'Ordinals Market',
		descriptionKey: 'nft.tools.ordinals_market.description',
		url: 'https://ordinals.market',
		icon: Image,
		category: 'nft',
		tags: ['ordinals', 'bitcoin', 'inscriptions', 'marketplace'],
		chains: ['Bitcoin'],
		color: '#F7931A'
	},
	{
		id: 'magic-eden-ordinals',
		name: 'Magic Eden Ordinals',
		descriptionKey: 'nft.tools.magic_eden_ordinals.description',
		url: 'https://magiceden.io/ordinals',
		icon: Image,
		category: 'nft',
		tags: ['ordinals', 'bitcoin', 'marketplace', 'runes'],
		chains: ['Bitcoin'],
		color: '#E42575'
	},

	// ========== Art Platforms ==========
	{
		id: 'exchange-art',
		name: 'Exchange Art',
		descriptionKey: 'nft.tools.exchange_art.description',
		url: 'https://exchange.art',
		icon: Image,
		category: 'nft',
		tags: ['art', 'solana', 'curated', '1-of-1'],
		chains: ['Solana'],
		color: '#000000'
	},
	{
		id: 'formfunction',
		name: 'Formfunction',
		descriptionKey: 'nft.tools.formfunction.description',
		url: 'https://formfunction.xyz',
		icon: Image,
		category: 'nft',
		tags: ['art', 'solana', 'creators', 'auctions'],
		chains: ['Solana'],
		color: '#6366F1'
	},
	{
		id: 'jpg-store',
		name: 'JPG Store',
		descriptionKey: 'nft.tools.jpg_store.description',
		url: 'https://jpg.store',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'cardano', 'nft', 'trading'],
		chains: ['Cardano'],
		color: '#0033AD'
	},

	// ========== Galleries & Display ==========
	{
		id: 'oncyber',
		name: 'Oncyber',
		descriptionKey: 'nft.tools.oncyber.description',
		url: 'https://oncyber.io',
		icon: Globe,
		category: 'nft',
		tags: ['gallery', 'metaverse', '3d', 'exhibitions'],
		color: '#8B5CF6'
	},

	// ========== Trading & Aggregation ==========
	{
		id: 'nft-trader',
		name: 'NFT Trader',
		descriptionKey: 'nft.tools.nft_trader.description',
		url: 'https://nfttrader.io',
		icon: Image,
		category: 'nft',
		tags: ['swaps', 'p2p', 'otc', 'trading'],
		chains: ['Ethereum', 'Polygon'],
		color: '#EC4899'
	},
	{
		id: 'looksrare',
		name: 'LooksRare',
		descriptionKey: 'nft.tools.looksrare.description',
		url: 'https://looksrare.org',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'rewards', 'community'],
		chains: ['Ethereum'],
		color: '#0CE466'
	},
	{
		id: 'x2y2',
		name: 'X2Y2',
		descriptionKey: 'nft.tools.x2y2.description',
		url: 'https://x2y2.io',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'low-fees', 'bulk'],
		chains: ['Ethereum'],
		color: '#1968FC'
	},
	{
		id: 'gem',
		name: 'Gem (OpenSea Pro)',
		descriptionKey: 'nft.tools.gem.description',
		url: 'https://pro.opensea.io',
		icon: Image,
		category: 'nft',
		tags: ['aggregator', 'bulk-buy', 'sweep'],
		chains: ['Ethereum'],
		color: '#2081E2'
	},

	// ========== Community & Engagement ==========
	{
		id: 'snag-solutions',
		name: 'Snag Solutions',
		descriptionKey: 'nft.tools.snag_solutions.description',
		url: 'https://snagsolutions.io',
		icon: Image,
		category: 'nft',
		tags: ['loyalty', 'staking', 'rewards', 'engagement'],
		chains: ['Ethereum', 'Polygon', 'Solana'],
		color: '#22C55E'
	},
	{
		id: 'icy-marketplace',
		name: 'Icy.tools Marketplace',
		descriptionKey: 'nft.tools.icy_marketplace.description',
		url: 'https://icy.tools',
		icon: Image,
		category: 'nft',
		tags: ['analytics', 'trending', 'discovery', 'alerts'],
		chains: ['Ethereum'],
		color: '#06B6D4'
	}
];
