/**
 * Community Tools - Discord servers & Telegram channels
 */
import {
	MessageCircle,
	Users,
	Code,
	Gamepad2,
	Shield,
	Layers2,
	Palette,
	Sparkles,
	Send,
	Newspaper,
	TrendingUp,
	Globe
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const communityTools: ExternalTool[] = [
	// ========== Major Protocol Communities ==========
	{
		id: 'discord-ethereum',
		name: 'Ethereum',
		descriptionKey: 'chain-tools.community.tools.discord_ethereum.description',
		url: 'https://discord.gg/ethereum-org',
		icon: MessageCircle,
		category: 'community',
		tags: ['protocol', 'ethereum', 'development', 'community'],
		color: '#627EEA'
	},
	{
		id: 'discord-uniswap',
		name: 'Uniswap',
		descriptionKey: 'chain-tools.community.tools.discord_uniswap.description',
		url: 'https://discord.gg/uniswap',
		icon: MessageCircle,
		category: 'community',
		tags: ['protocol', 'defi', 'dex', 'governance'],
		color: '#FF007A'
	},
	{
		id: 'discord-aave',
		name: 'Aave',
		descriptionKey: 'chain-tools.community.tools.discord_aave.description',
		url: 'https://discord.gg/aave',
		icon: MessageCircle,
		category: 'community',
		tags: ['protocol', 'defi', 'lending', 'governance'],
		color: '#B6509E'
	},
	{
		id: 'discord-chainlink',
		name: 'Chainlink',
		descriptionKey: 'chain-tools.community.tools.discord_chainlink.description',
		url: 'https://discord.gg/chainlink',
		icon: MessageCircle,
		category: 'community',
		tags: ['protocol', 'oracles', 'infrastructure', 'developer'],
		color: '#375BD2'
	},

	// ========== L2 Ecosystems ==========
	{
		id: 'discord-arbitrum',
		name: 'Arbitrum',
		descriptionKey: 'chain-tools.community.tools.discord_arbitrum.description',
		url: 'https://discord.gg/arbitrum',
		icon: Layers2,
		category: 'community',
		tags: ['l2', 'arbitrum', 'ecosystem', 'development'],
		color: '#28A0F0'
	},
	{
		id: 'discord-optimism',
		name: 'Optimism',
		descriptionKey: 'chain-tools.community.tools.discord_optimism.description',
		url: 'https://discord.gg/optimism',
		icon: Layers2,
		category: 'community',
		tags: ['l2', 'optimism', 'superchain', 'governance'],
		color: '#FF0420'
	},
	{
		id: 'discord-base',
		name: 'Base',
		descriptionKey: 'chain-tools.community.tools.discord_base.description',
		url: 'https://discord.gg/base',
		icon: Layers2,
		category: 'community',
		tags: ['l2', 'base', 'coinbase', 'development'],
		color: '#0052FF'
	},
	{
		id: 'discord-zksync',
		name: 'zkSync',
		descriptionKey: 'chain-tools.community.tools.discord_zksync.description',
		url: 'https://discord.gg/zksync',
		icon: Layers2,
		category: 'community',
		tags: ['l2', 'zksync', 'zk-rollup', 'development'],
		color: '#8C8DFC'
	},
	{
		id: 'discord-starknet',
		name: 'Starknet',
		descriptionKey: 'chain-tools.community.tools.discord_starknet.description',
		url: 'https://discord.gg/starknet',
		icon: Layers2,
		category: 'community',
		tags: ['l2', 'starknet', 'cairo', 'development'],
		color: '#29296E'
	},
	{
		id: 'discord-polygon',
		name: 'Polygon',
		descriptionKey: 'chain-tools.community.tools.discord_polygon.description',
		url: 'https://discord.gg/polygon',
		icon: Layers2,
		category: 'community',
		tags: ['l2', 'polygon', 'zkevm', 'ecosystem'],
		color: '#8247E5'
	},

	// ========== Developer Communities ==========
	{
		id: 'discord-ethglobal',
		name: 'ETHGlobal',
		descriptionKey: 'chain-tools.community.tools.discord_ethglobal.description',
		url: 'https://discord.gg/ethglobal',
		icon: Code,
		category: 'community',
		tags: ['developer', 'hackathon', 'education', 'community'],
		color: '#000000'
	},
	{
		id: 'discord-buildspace',
		name: 'Buildspace',
		descriptionKey: 'chain-tools.community.tools.discord_buildspace.description',
		url: 'https://discord.gg/buildspace',
		icon: Code,
		category: 'community',
		tags: ['developer', 'education', 'projects', 'community'],
		color: '#4ADE80'
	},
	{
		id: 'discord-alchemy',
		name: 'Alchemy',
		descriptionKey: 'chain-tools.community.tools.discord_alchemy.description',
		url: 'https://discord.gg/alchemy',
		icon: Code,
		category: 'community',
		tags: ['developer', 'infrastructure', 'api', 'support'],
		color: '#0C0C0E'
	},
	{
		id: 'discord-hardhat',
		name: 'Hardhat',
		descriptionKey: 'chain-tools.community.tools.discord_hardhat.description',
		url: 'https://discord.gg/hardhat',
		icon: Code,
		category: 'community',
		tags: ['developer', 'tooling', 'solidity', 'testing'],
		color: '#FFF100'
	},
	{
		id: 'discord-foundry',
		name: 'Foundry',
		descriptionKey: 'chain-tools.community.tools.discord_foundry.description',
		url: 'https://discord.gg/foundry',
		icon: Code,
		category: 'community',
		tags: ['developer', 'tooling', 'solidity', 'testing'],
		color: '#000000'
	},
	{
		id: 'discord-openzeppelin',
		name: 'OpenZeppelin',
		descriptionKey: 'chain-tools.community.tools.discord_openzeppelin.description',
		url: 'https://discord.gg/openzeppelin',
		icon: Code,
		category: 'community',
		tags: ['developer', 'security', 'contracts', 'standards'],
		color: '#4E5EE4'
	},
	{
		id: 'discord-thegraph',
		name: 'The Graph',
		descriptionKey: 'chain-tools.community.tools.discord_thegraph.description',
		url: 'https://discord.gg/thegraph',
		icon: Code,
		category: 'community',
		tags: ['developer', 'indexing', 'subgraphs', 'data'],
		color: '#6747ED'
	},
	{
		id: 'discord-scaffold-eth',
		name: 'Scaffold-ETH',
		descriptionKey: 'chain-tools.community.tools.discord_scaffold_eth.description',
		url: 'https://discord.gg/scaffold-eth',
		icon: Code,
		category: 'community',
		tags: ['developer', 'starter-kit', 'education', 'buidlguidl'],
		color: '#10B981'
	},

	// ========== Security Communities ==========
	{
		id: 'discord-immunefi',
		name: 'Immunefi',
		descriptionKey: 'chain-tools.community.tools.discord_immunefi.description',
		url: 'https://discord.gg/immunefi',
		icon: Shield,
		category: 'community',
		tags: ['security', 'bug-bounty', 'whitehat', 'auditing'],
		color: '#00D395'
	},
	{
		id: 'discord-code4rena',
		name: 'Code4rena',
		descriptionKey: 'chain-tools.community.tools.discord_code4rena.description',
		url: 'https://discord.gg/code4rena',
		icon: Shield,
		category: 'community',
		tags: ['security', 'audits', 'competitive', 'contests'],
		color: '#10B981'
	},
	{
		id: 'discord-sherlock',
		name: 'Sherlock',
		descriptionKey: 'chain-tools.community.tools.discord_sherlock.description',
		url: 'https://discord.gg/sherlock',
		icon: Shield,
		category: 'community',
		tags: ['security', 'audits', 'coverage', 'contests'],
		color: '#000000'
	},
	{
		id: 'discord-secureum',
		name: 'Secureum',
		descriptionKey: 'chain-tools.community.tools.discord_secureum.description',
		url: 'https://discord.gg/secureum',
		icon: Shield,
		category: 'community',
		tags: ['security', 'education', 'bootcamp', 'research'],
		color: '#8B5CF6'
	},

	// ========== NFT & Creative Communities ==========
	{
		id: 'discord-opensea',
		name: 'OpenSea',
		descriptionKey: 'chain-tools.community.tools.discord_opensea.description',
		url: 'https://discord.gg/opensea',
		icon: Palette,
		category: 'community',
		tags: ['nft', 'marketplace', 'trading', 'community'],
		color: '#2081E2'
	},
	{
		id: 'discord-blur',
		name: 'Blur',
		descriptionKey: 'chain-tools.community.tools.discord_blur.description',
		url: 'https://discord.gg/blur',
		icon: Palette,
		category: 'community',
		tags: ['nft', 'marketplace', 'trading', 'pro-traders'],
		color: '#FF6B00'
	},
	{
		id: 'discord-artblocks',
		name: 'Art Blocks',
		descriptionKey: 'chain-tools.community.tools.discord_artblocks.description',
		url: 'https://discord.gg/artblocks',
		icon: Palette,
		category: 'community',
		tags: ['nft', 'generative-art', 'collectors', 'artists'],
		color: '#000000'
	},
	{
		id: 'discord-foundation',
		name: 'Foundation',
		descriptionKey: 'chain-tools.community.tools.discord_foundation.description',
		url: 'https://discord.gg/foundation',
		icon: Palette,
		category: 'community',
		tags: ['nft', 'art', 'creators', 'collectors'],
		color: '#000000'
	},
	{
		id: 'discord-nouns',
		name: 'Nouns DAO',
		descriptionKey: 'chain-tools.community.tools.discord_nouns.description',
		url: 'https://discord.gg/nouns',
		icon: Palette,
		category: 'community',
		tags: ['nft', 'dao', 'cc0', 'governance'],
		color: '#D53C5E'
	},
	{
		id: 'discord-punks',
		name: 'CryptoPunks',
		descriptionKey: 'chain-tools.community.tools.discord_punks.description',
		url: 'https://discord.gg/cryptopunks',
		icon: Palette,
		category: 'community',
		tags: ['nft', 'og', 'collectors', 'culture'],
		color: '#648AFA'
	},
	{
		id: 'discord-bayc',
		name: 'BAYC',
		descriptionKey: 'chain-tools.community.tools.discord_bayc.description',
		url: 'https://discord.gg/bayc',
		icon: Palette,
		category: 'community',
		tags: ['nft', 'yuga', 'community', 'exclusive'],
		color: '#BBC127'
	},
	{
		id: 'discord-azuki',
		name: 'Azuki',
		descriptionKey: 'chain-tools.community.tools.discord_azuki.description',
		url: 'https://discord.gg/azuki',
		icon: Palette,
		category: 'community',
		tags: ['nft', 'anime', 'community', 'culture'],
		color: '#C7352E'
	},
	{
		id: 'discord-pudgypenguins',
		name: 'Pudgy Penguins',
		descriptionKey: 'chain-tools.community.tools.discord_pudgypenguins.description',
		url: 'https://discord.gg/pudgypenguins',
		icon: Palette,
		category: 'community',
		tags: ['nft', 'community', 'toys', 'ip'],
		color: '#6AC3F5'
	},

	// ========== Gaming Communities ==========
	{
		id: 'discord-axie',
		name: 'Axie Infinity',
		descriptionKey: 'chain-tools.community.tools.discord_axie.description',
		url: 'https://discord.gg/axie',
		icon: Gamepad2,
		category: 'community',
		tags: ['gaming', 'nft', 'play-to-earn', 'community'],
		color: '#0055D5'
	},
	{
		id: 'discord-illuvium',
		name: 'Illuvium',
		descriptionKey: 'chain-tools.community.tools.discord_illuvium.description',
		url: 'https://discord.gg/illuvium',
		icon: Gamepad2,
		category: 'community',
		tags: ['gaming', 'nft', 'aaa', 'community'],
		color: '#7B3FE4'
	},
	{
		id: 'discord-immutable',
		name: 'Immutable',
		descriptionKey: 'chain-tools.community.tools.discord_immutable.description',
		url: 'https://discord.gg/immutable',
		icon: Gamepad2,
		category: 'community',
		tags: ['gaming', 'nft', 'infrastructure', 'zkEVM'],
		color: '#00D9D9'
	},
	{
		id: 'discord-loot',
		name: 'Loot',
		descriptionKey: 'chain-tools.community.tools.discord_loot.description',
		url: 'https://discord.gg/loot',
		icon: Gamepad2,
		category: 'community',
		tags: ['gaming', 'nft', 'cc0', 'builders'],
		color: '#000000'
	},
	{
		id: 'discord-treasure',
		name: 'Treasure DAO',
		descriptionKey: 'chain-tools.community.tools.discord_treasure.description',
		url: 'https://discord.gg/treasure',
		icon: Gamepad2,
		category: 'community',
		tags: ['gaming', 'metaverse', 'arbitrum', 'ecosystem'],
		color: '#DC2626'
	},
	{
		id: 'discord-ronin',
		name: 'Ronin Network',
		descriptionKey: 'chain-tools.community.tools.discord_ronin.description',
		url: 'https://discord.gg/roninnetwork',
		icon: Gamepad2,
		category: 'community',
		tags: ['gaming', 'l2', 'axie', 'ecosystem'],
		color: '#1273EA'
	},

	// ========== DAO & Governance Communities ==========
	{
		id: 'discord-bankless',
		name: 'Bankless',
		descriptionKey: 'chain-tools.community.tools.discord_bankless.description',
		url: 'https://discord.gg/bankless',
		icon: Users,
		category: 'community',
		tags: ['dao', 'media', 'education', 'community'],
		color: '#FF0420'
	},
	{
		id: 'discord-gitcoin',
		name: 'Gitcoin',
		descriptionKey: 'chain-tools.community.tools.discord_gitcoin.description',
		url: 'https://discord.gg/gitcoin',
		icon: Users,
		category: 'community',
		tags: ['dao', 'grants', 'public-goods', 'funding'],
		color: '#00433B'
	},
	{
		id: 'discord-ens',
		name: 'ENS',
		descriptionKey: 'chain-tools.community.tools.discord_ens.description',
		url: 'https://discord.gg/ens',
		icon: Users,
		category: 'community',
		tags: ['dao', 'identity', 'domains', 'governance'],
		color: '#5298FF'
	},

	// ========== Social & Fun Communities ==========
	{
		id: 'discord-farcaster',
		name: 'Farcaster',
		descriptionKey: 'chain-tools.community.tools.discord_farcaster.description',
		url: 'https://discord.gg/farcaster',
		icon: Sparkles,
		category: 'community',
		tags: ['social', 'decentralized', 'protocol', 'builders'],
		color: '#8465CB'
	},
	{
		id: 'discord-lens',
		name: 'Lens Protocol',
		descriptionKey: 'chain-tools.community.tools.discord_lens.description',
		url: 'https://discord.gg/lens',
		icon: Sparkles,
		category: 'community',
		tags: ['social', 'decentralized', 'protocol', 'builders'],
		color: '#ABFE2C'
	},
	{
		id: 'discord-friend-tech',
		name: 'friend.tech',
		descriptionKey: 'chain-tools.community.tools.discord_friend_tech.description',
		url: 'https://discord.gg/friendtech',
		icon: Sparkles,
		category: 'community',
		tags: ['social', 'socialfi', 'base', 'community'],
		color: '#000AFF'
	},
	{
		id: 'discord-rabbithole',
		name: 'RabbitHole',
		descriptionKey: 'chain-tools.community.tools.discord_rabbithole.description',
		url: 'https://discord.gg/rabbithole',
		icon: Sparkles,
		category: 'community',
		tags: ['learn-to-earn', 'quests', 'education', 'rewards'],
		color: '#7C3AED'
	},
	{
		id: 'discord-galxe',
		name: 'Galxe',
		descriptionKey: 'chain-tools.community.tools.discord_galxe.description',
		url: 'https://discord.gg/galxe',
		icon: Sparkles,
		category: 'community',
		tags: ['credentials', 'campaigns', 'community', 'rewards'],
		color: '#000000'
	},

	// ========== Alt L1 Communities ==========
	{
		id: 'discord-solana',
		name: 'Solana',
		descriptionKey: 'chain-tools.community.tools.discord_solana.description',
		url: 'https://discord.gg/solana',
		icon: MessageCircle,
		category: 'community',
		tags: ['l1', 'solana', 'ecosystem', 'development'],
		color: '#14F195'
	},
	{
		id: 'discord-avalanche',
		name: 'Avalanche',
		descriptionKey: 'chain-tools.community.tools.discord_avalanche.description',
		url: 'https://discord.gg/avalanche',
		icon: MessageCircle,
		category: 'community',
		tags: ['l1', 'avalanche', 'subnets', 'development'],
		color: '#E84142'
	},
	{
		id: 'discord-cosmos',
		name: 'Cosmos',
		descriptionKey: 'chain-tools.community.tools.discord_cosmos.description',
		url: 'https://discord.gg/cosmos',
		icon: MessageCircle,
		category: 'community',
		tags: ['l1', 'cosmos', 'ibc', 'appchains'],
		color: '#6F7390'
	},
	{
		id: 'discord-sui',
		name: 'Sui',
		descriptionKey: 'chain-tools.community.tools.discord_sui.description',
		url: 'https://discord.gg/sui',
		icon: MessageCircle,
		category: 'community',
		tags: ['l1', 'sui', 'move', 'development'],
		color: '#6FBCF0'
	},
	{
		id: 'discord-aptos',
		name: 'Aptos',
		descriptionKey: 'chain-tools.community.tools.discord_aptos.description',
		url: 'https://discord.gg/aptos',
		icon: MessageCircle,
		category: 'community',
		tags: ['l1', 'aptos', 'move', 'development'],
		color: '#2DD8A3'
	},
	{
		id: 'discord-near',
		name: 'NEAR Protocol',
		descriptionKey: 'chain-tools.community.tools.discord_near.description',
		url: 'https://discord.gg/near',
		icon: MessageCircle,
		category: 'community',
		tags: ['l1', 'near', 'sharding', 'development'],
		color: '#00C08B'
	},
	{
		id: 'discord-ton',
		name: 'TON',
		descriptionKey: 'chain-tools.community.tools.discord_ton.description',
		url: 'https://discord.gg/ton',
		icon: MessageCircle,
		category: 'community',
		tags: ['l1', 'ton', 'telegram', 'ecosystem'],
		color: '#0098EA'
	},

	// ========== Telegram Channels ==========
	{
		id: 'tg-cointelegraph',
		name: 'Cointelegraph',
		descriptionKey: 'chain-tools.community.tools.tg_cointelegraph.description',
		url: 'https://t.me/cointelegraph',
		icon: Newspaper,
		category: 'community',
		tags: ['news', 'media', 'updates', 'english'],
		color: '#FFC107'
	},
	{
		id: 'tg-whale-alert',
		name: 'Whale Alert',
		descriptionKey: 'chain-tools.community.tools.tg_whale_alert.description',
		url: 'https://t.me/whale_alert_io',
		icon: TrendingUp,
		category: 'community',
		tags: ['alpha', 'whale', 'onchain', 'english'],
		color: '#3B82F6'
	},
	{
		id: 'tg-lookonchain',
		name: 'Lookonchain',
		descriptionKey: 'chain-tools.community.tools.tg_lookonchain.description',
		url: 'https://t.me/lookonchain',
		icon: TrendingUp,
		category: 'community',
		tags: ['alpha', 'onchain', 'analytics', 'english'],
		color: '#10B981'
	},
	{
		id: 'tg-toncoin',
		name: 'TON Community',
		descriptionKey: 'chain-tools.community.tools.tg_ton_official.description',
		url: 'https://t.me/toncoin',
		icon: Send,
		category: 'community',
		tags: ['protocol', 'l1', 'ton', 'community'],
		color: '#0098EA'
	},
	{
		id: 'tg-solana',
		name: 'Solana',
		descriptionKey: 'chain-tools.community.tools.tg_solana_ann.description',
		url: 'https://t.me/solana',
		icon: Send,
		category: 'community',
		tags: ['protocol', 'l1', 'official', 'announcements'],
		color: '#14F195'
	},
	{
		id: 'tg-arbitrum',
		name: 'Arbitrum',
		descriptionKey: 'chain-tools.community.tools.tg_arbitrum_ann.description',
		url: 'https://t.me/arbitrum',
		icon: Send,
		category: 'community',
		tags: ['protocol', 'l2', 'official', 'announcements'],
		color: '#28A0F0'
	},
	{
		id: 'tg-chaincatcher',
		name: 'ChainCatcher 链捕手',
		descriptionKey: 'chain-tools.community.tools.tg_chaincatcher.description',
		url: 'https://t.me/ChainCatcher',
		icon: Globe,
		category: 'community',
		tags: ['chinese', 'news', 'research', 'asia'],
		color: '#8B5CF6'
	},
	{
		id: 'tg-techflow',
		name: 'TechFlow 深潮',
		descriptionKey: 'chain-tools.community.tools.tg_techflow.description',
		url: 'https://t.me/TechFlowPost',
		icon: Globe,
		category: 'community',
		tags: ['chinese', 'news', 'research', 'asia'],
		color: '#10B981'
	},
	{
		id: 'tg-crypto-brazil',
		name: 'Crypto Brasil',
		descriptionKey: 'chain-tools.community.tools.tg_crypto_brazil.description',
		url: 'https://t.me/CryptoBrasil',
		icon: Users,
		category: 'community',
		tags: ['portuguese', 'brazil', 'community', 'americas'],
		color: '#22C55E'
	}
];
