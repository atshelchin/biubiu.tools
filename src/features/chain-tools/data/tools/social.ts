/**
 * Social Tools - SocialFi, decentralized social, and content platforms
 */
import { Share2, MessageCircle, Orbit, Users, Newspaper, Podcast } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const socialTools: ExternalTool[] = [
	// ========== Social Protocols ==========
	{
		id: 'lens-protocol',
		name: 'Lens Protocol',
		descriptionKey: 'chain-tools.social.tools.lens_protocol.description',
		url: 'https://lens.xyz',
		icon: Share2,
		category: 'social',
		tags: ['social-graph', 'composable', 'polygon', 'decentralized'],
		chains: ['Polygon'],
		color: '#00501E',
		isFeatured: true
	},
	{
		id: 'cyberconnect',
		name: 'CyberConnect',
		descriptionKey: 'chain-tools.social.tools.cyberconnect.description',
		url: 'https://cyber.co',
		icon: Share2,
		category: 'social',
		tags: ['social-graph', 'l2', 'identity'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Optimism'],
		color: '#000000'
	},
	{
		id: 'deso',
		name: 'DeSo',
		descriptionKey: 'chain-tools.social.tools.deso.description',
		url: 'https://deso.com',
		icon: Share2,
		category: 'social',
		tags: ['l1', 'social', 'decentralized', 'blockchain'],
		chains: ['DeSo'],
		color: '#0057FF'
	},

	// ========== Social Clients ==========
	{
		id: 'warpcast',
		name: 'Warpcast',
		descriptionKey: 'chain-tools.social.tools.warpcast.description',
		url: 'https://warpcast.com',
		icon: MessageCircle,
		category: 'social',
		tags: ['farcaster', 'client', 'social', 'mobile'],
		chains: ['Optimism'],
		color: '#8A63D2'
	},
	{
		id: 'hey',
		name: 'Hey',
		descriptionKey: 'chain-tools.social.tools.hey.description',
		url: 'https://hey.xyz',
		icon: MessageCircle,
		category: 'social',
		tags: ['lens', 'social', 'decentralized', 'client'],
		chains: ['Polygon'],
		color: '#FB3A5D'
	},
	{
		id: 'orb',
		name: 'Orb',
		descriptionKey: 'chain-tools.social.tools.orb.description',
		url: 'https://orb.club',
		icon: Orbit,
		category: 'social',
		tags: ['lens', 'mobile', 'social', 'communities'],
		chains: ['Polygon'],
		color: '#6366F1'
	},
	{
		id: 'phaver',
		name: 'Phaver',
		descriptionKey: 'chain-tools.social.tools.phaver.description',
		url: 'https://phaver.com',
		icon: MessageCircle,
		category: 'social',
		tags: ['lens', 'farcaster', 'social', 'stake-to-post'],
		chains: ['Polygon', 'Optimism'],
		color: '#5D5FEF'
	},
	{
		id: 'orb-app',
		name: 'Orb',
		descriptionKey: 'chain-tools.social.tools.orb_app.description',
		url: 'https://orb.ac',
		icon: MessageCircle,
		category: 'social',
		tags: ['lens', 'social', 'professional', 'web3'],
		color: '#8B5CF6'
	},
	{
		id: 'buttrfly',
		name: 'Buttrfly',
		descriptionKey: 'chain-tools.social.tools.buttrfly.description',
		url: 'https://buttrfly.app',
		icon: MessageCircle,
		category: 'social',
		tags: ['lens', 'social', 'aggregator', 'cross-platform'],
		color: '#EC4899'
	},
	{
		id: 'firefly-social',
		name: 'Firefly',
		descriptionKey: 'chain-tools.social.tools.firefly_social.description',
		url: 'https://firefly.social',
		icon: MessageCircle,
		category: 'social',
		tags: ['aggregator', 'lens', 'farcaster', 'twitter'],
		color: '#8B5CF6'
	},

	// ========== SocialFi ==========
	{
		id: 'friend-tech',
		name: 'Friend.tech',
		descriptionKey: 'chain-tools.social.tools.friend_tech.description',
		url: 'https://www.friend.tech',
		icon: Users,
		category: 'social',
		tags: ['socialfi', 'keys', 'base', 'speculation'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'party-app',
		name: 'Party',
		descriptionKey: 'chain-tools.social.tools.party_app.description',
		url: 'https://party.app',
		icon: Users,
		category: 'social',
		tags: ['crowdfund', 'social', 'group-buying', 'nft'],
		chains: ['Ethereum', 'Base'],
		color: '#EC4899'
	},
	{
		id: 'bello-community',
		name: 'Bello',
		descriptionKey: 'chain-tools.social.tools.bello_community.description',
		url: 'https://bello.lol',
		icon: Users,
		category: 'social',
		tags: ['analytics', 'community', 'insights', 'collectors'],
		color: '#3B82F6'
	},

	// ========== Publishing & Writing ==========
	{
		id: 'mirror',
		name: 'Mirror',
		descriptionKey: 'chain-tools.social.tools.mirror.description',
		url: 'https://mirror.xyz',
		icon: Newspaper,
		category: 'social',
		tags: ['writing', 'publishing', 'nft', 'crowdfunding'],
		chains: ['Ethereum', 'Optimism'],
		color: '#007AFF'
	},
	{
		id: 'paragraph',
		name: 'Paragraph',
		descriptionKey: 'chain-tools.social.tools.paragraph.description',
		url: 'https://paragraph.xyz',
		icon: Newspaper,
		category: 'social',
		tags: ['newsletter', 'writing', 'web3', 'publishing'],
		chains: ['Ethereum', 'Base'],
		color: '#000000'
	},
	{
		id: 'kiwi-news',
		name: 'Kiwi News',
		descriptionKey: 'chain-tools.social.tools.kiwi_news.description',
		url: 'https://news.kiwistand.com',
		icon: Newspaper,
		category: 'social',
		tags: ['news', 'curation', 'community', 'web3'],
		color: '#22C55E'
	},

	// ========== Video & Streaming ==========
	{
		id: 'drakula',
		name: 'Drakula',
		descriptionKey: 'chain-tools.social.tools.drakula.description',
		url: 'https://drakula.app',
		icon: Podcast,
		category: 'social',
		tags: ['video', 'short-form', 'creator', 'farcaster'],
		chains: ['Base'],
		color: '#FF0000'
	},
	{
		id: 'tape',
		name: 'Tape',
		descriptionKey: 'chain-tools.social.tools.tape.description',
		url: 'https://tape.xyz',
		icon: Podcast,
		category: 'social',
		tags: ['video', 'lens', 'decentralized', 'creator'],
		color: '#000000'
	},
	{
		id: 'unlonely',
		name: 'Unlonely',
		descriptionKey: 'chain-tools.social.tools.unlonely.description',
		url: 'https://www.unlonely.app',
		icon: Podcast,
		category: 'social',
		tags: ['streaming', 'live', 'web3', 'community'],
		color: '#15F5BA'
	},

	// ========== Social Infrastructure ==========
	{
		id: 'link3',
		name: 'Link3',
		descriptionKey: 'chain-tools.social.tools.link3.description',
		url: 'https://link3.to',
		icon: Share2,
		category: 'social',
		tags: ['events', 'credentials', 'social', 'cyberconnect'],
		color: '#10B981'
	},
	{
		id: 'debank-hi',
		name: 'DeBank Hi',
		descriptionKey: 'chain-tools.social.tools.debank_hi.description',
		url: 'https://debank.com/hi',
		icon: MessageCircle,
		category: 'social',
		tags: ['messaging', 'wallet-based', 'social', 'defi'],
		color: '#FE815F'
	},
	{
		id: 'orbis-protocol',
		name: 'Orbis',
		descriptionKey: 'chain-tools.social.tools.orbis_protocol.description',
		url: 'https://orbis.club',
		icon: MessageCircle,
		category: 'social',
		tags: ['social', 'ceramic', 'decentralized', 'sdk'],
		color: '#4F46E5'
	},
	{
		id: 'cyberconnect-link',
		name: 'CyberConnect',
		descriptionKey: 'chain-tools.social.tools.cyberconnect_link.description',
		url: 'https://link3.to',
		icon: Share2,
		category: 'social',
		tags: ['social-graph', 'profiles', 'web3-social', 'events'],
		color: '#10B981'
	},
	{
		id: 'context-app',
		name: 'Context',
		descriptionKey: 'chain-tools.social.tools.context_app.description',
		url: 'https://context.app',
		icon: MessageCircle,
		category: 'social',
		tags: ['nft', 'social', 'discovery', 'following'],
		color: '#000000'
	},
	{
		id: 'yup-social',
		name: 'Yup',
		descriptionKey: 'chain-tools.social.tools.yup_social.description',
		url: 'https://yup.io',
		icon: MessageCircle,
		category: 'social',
		tags: ['curation', 'ratings', 'social', 'rewards'],
		color: '#00D395'
	},
	{
		id: 'zora-social',
		name: 'Zora Social',
		descriptionKey: 'chain-tools.social.tools.zora_social.description',
		url: 'https://zora.co',
		icon: MessageCircle,
		category: 'social',
		tags: ['creator', 'minting', 'social', 'nft'],
		chains: ['Zora', 'Base', 'Ethereum'],
		color: '#000000'
	},
	{
		id: 'interface-social',
		name: 'Interface',
		descriptionKey: 'chain-tools.social.tools.interface_social.description',
		url: 'https://interface.social',
		icon: MessageCircle,
		category: 'social',
		tags: ['wallet-chat', 'social', 'dms', 'crypto'],
		color: '#6366F1'
	},

	// ========== Additional Social Tools ==========
	{
		id: 'farcaster',
		name: 'Farcaster',
		descriptionKey: 'chain-tools.social.tools.farcaster.description',
		url: 'https://farcaster.xyz',
		icon: Share2,
		category: 'social',
		tags: ['protocol', 'social', 'decentralized', 'open'],
		chains: ['Optimism'],
		color: '#8A63D2'
	},
	{
		id: 'xmtp',
		name: 'XMTP',
		descriptionKey: 'chain-tools.social.tools.xmtp.description',
		url: 'https://xmtp.org',
		icon: MessageCircle,
		category: 'social',
		tags: ['messaging', 'protocol', 'e2ee', 'wallet'],
		color: '#FC4F37'
	},
	{
		id: 'push-protocol',
		name: 'Push Protocol',
		descriptionKey: 'chain-tools.social.tools.push_protocol.description',
		url: 'https://push.org',
		icon: MessageCircle,
		category: 'social',
		tags: ['notifications', 'messaging', 'web3', 'protocol'],
		chains: ['Ethereum', 'Polygon'],
		color: '#DD44B9'
	},
	{
		id: 'supercast',
		name: 'Supercast',
		descriptionKey: 'chain-tools.social.tools.supercast.description',
		url: 'https://supercast.xyz',
		icon: MessageCircle,
		category: 'social',
		tags: ['farcaster', 'client', 'premium', 'power-user'],
		chains: ['Optimism'],
		color: '#000000'
	},
	{
		id: 'neynar',
		name: 'Neynar',
		descriptionKey: 'chain-tools.social.tools.neynar.description',
		url: 'https://neynar.com',
		icon: Share2,
		category: 'social',
		tags: ['farcaster', 'api', 'infrastructure', 'developer'],
		color: '#7C65C1'
	},
	{
		id: 'airstack',
		name: 'Airstack',
		descriptionKey: 'chain-tools.social.tools.airstack.description',
		url: 'https://airstack.xyz',
		icon: Share2,
		category: 'social',
		tags: ['api', 'social-graph', 'data', 'farcaster'],
		color: '#0D76FC'
	},
	{
		id: 'pinata-farcaster',
		name: 'Pinata Farcaster Hub',
		descriptionKey: 'chain-tools.social.tools.pinata_farcaster.description',
		url: 'https://pinata.cloud/farcaster',
		icon: Share2,
		category: 'social',
		tags: ['farcaster', 'hub', 'infrastructure', 'frames'],
		color: '#6D3DF3'
	},
	{
		id: 'privy-social',
		name: 'Privy',
		descriptionKey: 'chain-tools.social.tools.privy_social.description',
		url: 'https://privy.io',
		icon: Users,
		category: 'social',
		tags: ['auth', 'embedded-wallets', 'onboarding', 'social-login'],
		color: '#69E5C2'
	},
	{
		id: 'huddle01',
		name: 'Huddle01',
		descriptionKey: 'chain-tools.social.tools.huddle01.description',
		url: 'https://huddle01.com',
		icon: Podcast,
		category: 'social',
		tags: ['video', 'meetings', 'decentralized', 'web3'],
		color: '#246BFD'
	},
	{
		id: 'moxie',
		name: 'Moxie',
		descriptionKey: 'chain-tools.social.tools.moxie.description',
		url: 'https://moxie.xyz',
		icon: Users,
		category: 'social',
		tags: ['farcaster', 'fan-tokens', 'social-economy', 'creator'],
		chains: ['Base'],
		color: '#8B5CF6'
	}
];
