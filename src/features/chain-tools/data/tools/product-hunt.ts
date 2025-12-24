/**
 * Product Hunt Tools - Product launch and discovery platforms
 */
import {
	Rocket,
	Globe,
	MessageSquare,
	Newspaper,
	Users,
	Lightbulb,
	Search,
	Star,
	TrendingUp,
	Radio,
	Sparkles,
	Building2,
	Compass
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const productHuntTools: ExternalTool[] = [
	// ========== Global Product Discovery Platforms ==========
	{
		id: 'producthunt',
		name: 'Product Hunt',
		descriptionKey: 'chain-tools.tools.producthunt.description',
		url: 'https://www.producthunt.com',
		icon: Rocket,
		category: 'product-hunt',
		tags: ['product launch', 'startup', 'discovery', 'global'],
		color: '#DA552F',
		isFeatured: true
	},
	{
		id: 'hackernews',
		name: 'Hacker News',
		descriptionKey: 'chain-tools.tools.hackernews.description',
		url: 'https://news.ycombinator.com',
		icon: MessageSquare,
		category: 'product-hunt',
		tags: ['tech news', 'startup', 'show hn', 'global'],
		color: '#FF6600',
		isFeatured: true
	},
	{
		id: 'betalist',
		name: 'BetaList',
		descriptionKey: 'chain-tools.tools.betalist.description',
		url: 'https://betalist.com',
		icon: Lightbulb,
		category: 'product-hunt',
		tags: ['beta', 'startup', 'early access', 'global'],
		color: '#000000'
	},
	{
		id: 'launchingnext',
		name: 'Launching Next',
		descriptionKey: 'chain-tools.tools.launchingnext.description',
		url: 'https://www.launchingnext.com',
		icon: Rocket,
		category: 'product-hunt',
		tags: ['product launch', 'startup', 'directory', 'global'],
		color: '#6366F1'
	},
	{
		id: 'saashub',
		name: 'SaaS Hub',
		descriptionKey: 'chain-tools.tools.saashub.description',
		url: 'https://www.saashub.com',
		icon: Search,
		category: 'product-hunt',
		tags: ['saas', 'software', 'discovery', 'global'],
		color: '#3B82F6'
	},
	{
		id: 'alternativeto',
		name: 'AlternativeTo',
		descriptionKey: 'chain-tools.tools.alternativeto.description',
		url: 'https://alternativeto.net',
		icon: Compass,
		category: 'product-hunt',
		tags: ['alternatives', 'software', 'discovery', 'global'],
		color: '#E74C3C'
	},
	{
		id: 'slant',
		name: 'Slant',
		descriptionKey: 'chain-tools.tools.slant.description',
		url: 'https://www.slant.co',
		icon: Star,
		category: 'product-hunt',
		tags: ['comparison', 'recommendations', 'reviews', 'global'],
		color: '#2ECC71'
	},
	{
		id: 'theresanaiforthat',
		name: "There's An AI For That",
		descriptionKey: 'chain-tools.tools.theresanaiforthat.description',
		url: 'https://theresanaiforthat.com',
		icon: Sparkles,
		category: 'product-hunt',
		tags: ['ai', 'tools', 'directory', 'global'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'futurepedia',
		name: 'Futurepedia',
		descriptionKey: 'chain-tools.tools.futurepedia.description',
		url: 'https://www.futurepedia.io',
		icon: Sparkles,
		category: 'product-hunt',
		tags: ['ai', 'tools', 'directory', 'global'],
		color: '#10B981'
	},
	{
		id: 'toolify',
		name: 'Toolify',
		descriptionKey: 'chain-tools.tools.toolify.description',
		url: 'https://www.toolify.ai',
		icon: Sparkles,
		category: 'product-hunt',
		tags: ['ai', 'tools', 'discovery', 'global'],
		color: '#F59E0B'
	},
	{
		id: 'g2',
		name: 'G2',
		descriptionKey: 'chain-tools.tools.g2.description',
		url: 'https://www.g2.com',
		icon: Star,
		category: 'product-hunt',
		tags: ['reviews', 'software', 'b2b', 'global'],
		color: '#FF492C'
	},
	{
		id: 'capterra',
		name: 'Capterra',
		descriptionKey: 'chain-tools.tools.capterra.description',
		url: 'https://www.capterra.com',
		icon: Search,
		category: 'product-hunt',
		tags: ['reviews', 'software', 'comparison', 'global'],
		color: '#044D80'
	},
	{
		id: 'getapp',
		name: 'GetApp',
		descriptionKey: 'chain-tools.tools.getapp.description',
		url: 'https://www.getapp.com',
		icon: Search,
		category: 'product-hunt',
		tags: ['software', 'discovery', 'reviews', 'global'],
		color: '#00B4D8'
	},
	{
		id: 'trustradius',
		name: 'TrustRadius',
		descriptionKey: 'chain-tools.tools.trustradius.description',
		url: 'https://www.trustradius.com',
		icon: Star,
		category: 'product-hunt',
		tags: ['reviews', 'b2b', 'software', 'global'],
		color: '#1D4ED8'
	},

	// ========== Developer & Startup Communities ==========
	{
		id: 'indiehackers',
		name: 'Indie Hackers',
		descriptionKey: 'chain-tools.tools.indiehackers.description',
		url: 'https://www.indiehackers.com',
		icon: Users,
		category: 'product-hunt',
		tags: ['indie', 'startup', 'community', 'global'],
		color: '#0D6EFD',
		isFeatured: true
	},
	{
		id: 'devto',
		name: 'Dev.to',
		descriptionKey: 'chain-tools.tools.devto.description',
		url: 'https://dev.to',
		icon: MessageSquare,
		category: 'product-hunt',
		tags: ['developer', 'blog', 'community', 'global'],
		color: '#0A0A0A'
	},
	{
		id: 'hashnode',
		name: 'Hashnode',
		descriptionKey: 'chain-tools.tools.hashnode.description',
		url: 'https://hashnode.com',
		icon: MessageSquare,
		category: 'product-hunt',
		tags: ['developer', 'blog', 'community', 'global'],
		color: '#2962FF'
	},
	{
		id: 'reddit-startups',
		name: 'Reddit r/startups',
		descriptionKey: 'chain-tools.tools.reddit_startups.description',
		url: 'https://www.reddit.com/r/startups',
		icon: MessageSquare,
		category: 'product-hunt',
		tags: ['startup', 'community', 'feedback', 'global'],
		color: '#FF4500'
	},
	{
		id: 'reddit-sideproject',
		name: 'Reddit r/SideProject',
		descriptionKey: 'chain-tools.tools.reddit_sideproject.description',
		url: 'https://www.reddit.com/r/SideProject',
		icon: MessageSquare,
		category: 'product-hunt',
		tags: ['side project', 'indie', 'community', 'global'],
		color: '#FF4500'
	},
	{
		id: 'github-trending',
		name: 'GitHub Trending',
		descriptionKey: 'chain-tools.tools.github_trending.description',
		url: 'https://github.com/trending',
		icon: TrendingUp,
		category: 'product-hunt',
		tags: ['open source', 'developer', 'trending', 'global'],
		color: '#181717'
	},
	{
		id: 'lobsters',
		name: 'Lobsters',
		descriptionKey: 'chain-tools.tools.lobsters.description',
		url: 'https://lobste.rs',
		icon: MessageSquare,
		category: 'product-hunt',
		tags: ['tech', 'community', 'news', 'global'],
		color: '#AC130D'
	},

	// ========== Social & Content Platforms ==========
	{
		id: 'x-twitter',
		name: 'X (Twitter)',
		descriptionKey: 'chain-tools.tools.x_twitter.description',
		url: 'https://x.com',
		icon: Globe,
		category: 'product-hunt',
		tags: ['social', 'marketing', 'viral', 'global'],
		color: '#000000'
	},
	{
		id: 'linkedin',
		name: 'LinkedIn',
		descriptionKey: 'chain-tools.tools.linkedin.description',
		url: 'https://www.linkedin.com',
		icon: Users,
		category: 'product-hunt',
		tags: ['professional', 'b2b', 'networking', 'global'],
		color: '#0A66C2'
	},
	{
		id: 'medium',
		name: 'Medium',
		descriptionKey: 'chain-tools.tools.medium.description',
		url: 'https://medium.com',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['blog', 'content', 'marketing', 'global'],
		color: '#000000'
	},
	{
		id: 'youtube',
		name: 'YouTube',
		descriptionKey: 'chain-tools.tools.youtube.description',
		url: 'https://www.youtube.com',
		icon: Radio,
		category: 'product-hunt',
		tags: ['video', 'demo', 'marketing', 'global'],
		color: '#FF0000'
	},

	// ========== China ==========
	{
		id: '36kr',
		name: '36氪',
		descriptionKey: 'chain-tools.tools.36kr.description',
		url: 'https://36kr.com',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['startup', 'tech news', 'china', 'media'],
		color: '#0066FF',
		isFeatured: true
	},
	{
		id: 'sspai',
		name: '少数派',
		descriptionKey: 'chain-tools.tools.sspai.description',
		url: 'https://sspai.com',
		icon: Star,
		category: 'product-hunt',
		tags: ['apps', 'productivity', 'china', 'reviews'],
		color: '#DA282A'
	},
	{
		id: 'v2ex',
		name: 'V2EX',
		descriptionKey: 'chain-tools.tools.v2ex.description',
		url: 'https://www.v2ex.com',
		icon: MessageSquare,
		category: 'product-hunt',
		tags: ['developer', 'community', 'china', 'tech'],
		color: '#1A1A1A'
	},
	{
		id: 'appinn',
		name: '小众软件',
		descriptionKey: 'chain-tools.tools.appinn.description',
		url: 'https://www.appinn.com',
		icon: Search,
		category: 'product-hunt',
		tags: ['software', 'discovery', 'china', 'tools'],
		color: '#4CAF50'
	},
	{
		id: 'okjike',
		name: '即刻',
		descriptionKey: 'chain-tools.tools.okjike.description',
		url: 'https://okjike.com',
		icon: Users,
		category: 'product-hunt',
		tags: ['social', 'community', 'china', 'interest'],
		color: '#FFE411'
	},
	{
		id: 'zhihu',
		name: '知乎',
		descriptionKey: 'chain-tools.tools.zhihu.description',
		url: 'https://www.zhihu.com',
		icon: MessageSquare,
		category: 'product-hunt',
		tags: ['qa', 'community', 'china', 'knowledge'],
		color: '#0066FF'
	},
	{
		id: 'coolapk',
		name: '酷安',
		descriptionKey: 'chain-tools.tools.coolapk.description',
		url: 'https://www.coolapk.com',
		icon: Search,
		category: 'product-hunt',
		tags: ['android', 'apps', 'china', 'mobile'],
		color: '#11C26D'
	},
	{
		id: 'liqi',
		name: '利器',
		descriptionKey: 'chain-tools.tools.liqi.description',
		url: 'https://liqi.io',
		icon: Lightbulb,
		category: 'product-hunt',
		tags: ['tools', 'creators', 'china', 'workflow'],
		color: '#333333'
	},

	// ========== Japan ==========
	{
		id: 'moongift',
		name: 'MOONGIFT',
		descriptionKey: 'chain-tools.tools.moongift.description',
		url: 'https://www.moongift.jp',
		icon: Globe,
		category: 'product-hunt',
		tags: ['open source', 'software', 'japan', 'developer'],
		color: '#1A1A1A'
	},

	// ========== Korea ==========
	{
		id: 'disquiet',
		name: 'Disquiet',
		descriptionKey: 'chain-tools.tools.disquiet.description',
		url: 'https://disquiet.io',
		icon: Rocket,
		category: 'product-hunt',
		tags: ['product launch', 'startup', 'korea', 'community'],
		color: '#5046E5',
		isFeatured: true
	},
	{
		id: 'geeknews-korea',
		name: 'GeekNews',
		descriptionKey: 'chain-tools.tools.geeknews_korea.description',
		url: 'https://news.hada.io',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['tech news', 'developer', 'korea', 'community'],
		color: '#FF6600'
	},

	// ========== India ==========
	{
		id: 'yourstory',
		name: 'YourStory',
		descriptionKey: 'chain-tools.tools.yourstory.description',
		url: 'https://yourstory.com',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['startup', 'entrepreneurship', 'india', 'media'],
		color: '#E02020'
	},
	{
		id: 'inc42',
		name: 'Inc42',
		descriptionKey: 'chain-tools.tools.inc42.description',
		url: 'https://inc42.com',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['startup', 'tech news', 'india', 'media'],
		color: '#1A73E8'
	},

	// ========== Europe ==========
	{
		id: 'eu-startups',
		name: 'EU-Startups',
		descriptionKey: 'chain-tools.tools.eu_startups.description',
		url: 'https://www.eu-startups.com',
		icon: Building2,
		category: 'product-hunt',
		tags: ['startup', 'europe', 'news', 'funding'],
		color: '#003399'
	},
	{
		id: 'tech-eu',
		name: 'Tech.eu',
		descriptionKey: 'chain-tools.tools.tech_eu.description',
		url: 'https://tech.eu',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['tech news', 'europe', 'startup', 'media'],
		color: '#00205B'
	},
	{
		id: 'sifted',
		name: 'Sifted',
		descriptionKey: 'chain-tools.tools.sifted.description',
		url: 'https://sifted.eu',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['startup', 'europe', 'news', 'tech'],
		color: '#FF6B00'
	},

	// ========== Southeast Asia ==========
	{
		id: 'e27',
		name: 'e27',
		descriptionKey: 'chain-tools.tools.e27.description',
		url: 'https://e27.co',
		icon: Globe,
		category: 'product-hunt',
		tags: ['startup', 'southeast asia', 'news', 'community'],
		color: '#00BCD4'
	},
	{
		id: 'techinasia',
		name: 'Tech in Asia',
		descriptionKey: 'chain-tools.tools.techinasia.description',
		url: 'https://www.techinasia.com',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['tech news', 'asia', 'startup', 'media'],
		color: '#E31837'
	},
	{
		id: 'krasia',
		name: 'KrASIA',
		descriptionKey: 'chain-tools.tools.krasia.description',
		url: 'https://kr-asia.com',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['tech news', 'asia', 'startup', '36kr'],
		color: '#0066FF'
	},

	// ========== Latin America ==========
	{
		id: 'startupeable',
		name: 'Startupeable',
		descriptionKey: 'chain-tools.tools.startupeable.description',
		url: 'https://startupeable.com',
		icon: Rocket,
		category: 'product-hunt',
		tags: ['startup', 'latin america', 'community', 'spanish'],
		color: '#6366F1'
	},
	{
		id: 'contxto',
		name: 'Contxto',
		descriptionKey: 'chain-tools.tools.contxto.description',
		url: 'https://contxto.com',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['tech news', 'latin america', 'startup', 'media'],
		color: '#FF5722'
	},

	// ========== Web3 Specific Platforms ==========
	{
		id: 'alchemy-dapp-store',
		name: 'Alchemy Dapp Store',
		descriptionKey: 'chain-tools.tools.alchemy_dapp_store.description',
		url: 'https://www.alchemy.com/dapps',
		icon: Search,
		category: 'product-hunt',
		tags: ['web3', 'dapp', 'directory', 'alchemy'],
		color: '#0052FF'
	},
	{
		id: 'stateofthedapps',
		name: 'State of the DApps',
		descriptionKey: 'chain-tools.tools.stateofthedapps.description',
		url: 'https://www.stateofthedapps.com',
		icon: Globe,
		category: 'product-hunt',
		tags: ['web3', 'dapp', 'directory', 'ethereum'],
		color: '#6C5CE7'
	},
	{
		id: 'web3-career',
		name: 'Web3.Career',
		descriptionKey: 'chain-tools.tools.web3_career.description',
		url: 'https://web3.career',
		icon: Building2,
		category: 'product-hunt',
		tags: ['web3', 'jobs', 'startup', 'crypto'],
		color: '#8B5CF6'
	},
	{
		id: 'cryptorank-ico',
		name: 'CryptoRank ICO',
		descriptionKey: 'chain-tools.tools.cryptorank_ico.description',
		url: 'https://cryptorank.io/ico',
		icon: TrendingUp,
		category: 'product-hunt',
		tags: ['web3', 'ico', 'launch', 'funding'],
		color: '#00D395'
	},
	{
		id: 'icodrops',
		name: 'ICO Drops',
		descriptionKey: 'chain-tools.tools.icodrops.description',
		url: 'https://icodrops.com',
		icon: Rocket,
		category: 'product-hunt',
		tags: ['web3', 'ico', 'ido', 'launch'],
		color: '#3B82F6',
		isFeatured: true
	},
	{
		id: 'coinmarketcap-new',
		name: 'CoinMarketCap New Listings',
		descriptionKey: 'chain-tools.tools.coinmarketcap_new.description',
		url: 'https://coinmarketcap.com/new',
		icon: TrendingUp,
		category: 'product-hunt',
		tags: ['web3', 'crypto', 'new listings', 'discovery'],
		color: '#3861FB'
	},
	{
		id: 'coingecko-new',
		name: 'CoinGecko New Coins',
		descriptionKey: 'chain-tools.tools.coingecko_new.description',
		url: 'https://www.coingecko.com/en/new-cryptocurrencies',
		icon: TrendingUp,
		category: 'product-hunt',
		tags: ['web3', 'crypto', 'new coins', 'discovery'],
		color: '#8BC53F'
	},
	{
		id: 'defillama-protocols',
		name: 'DefiLlama Protocols',
		descriptionKey: 'chain-tools.tools.defillama_protocols.description',
		url: 'https://defillama.com/protocols',
		icon: Search,
		category: 'product-hunt',
		tags: ['web3', 'defi', 'protocols', 'discovery'],
		color: '#2172E5'
	},
	{
		id: 'crypto-twitter',
		name: 'Crypto Twitter (CT)',
		descriptionKey: 'chain-tools.tools.crypto_twitter.description',
		url: 'https://x.com/i/communities/1488624609016647686',
		icon: Users,
		category: 'product-hunt',
		tags: ['web3', 'social', 'community', 'marketing'],
		color: '#000000'
	},
	{
		id: 'mirror-xyz',
		name: 'Mirror',
		descriptionKey: 'chain-tools.tools.mirror_xyz.description',
		url: 'https://mirror.xyz',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['web3', 'blog', 'publishing', 'nft'],
		color: '#007AFF'
	},
	{
		id: 'paragraph-xyz',
		name: 'Paragraph',
		descriptionKey: 'chain-tools.tools.paragraph_xyz.description',
		url: 'https://paragraph.xyz',
		icon: Newspaper,
		category: 'product-hunt',
		tags: ['web3', 'newsletter', 'publishing', 'crypto'],
		color: '#000000'
	},
	{
		id: 'quest3',
		name: 'Quest3',
		descriptionKey: 'chain-tools.tools.quest3.description',
		url: 'https://quest3.xyz',
		icon: Rocket,
		category: 'product-hunt',
		tags: ['web3', 'quests', 'marketing', 'asia'],
		color: '#6366F1'
	},
	{
		id: 'zealy',
		name: 'Zealy',
		descriptionKey: 'chain-tools.tools.zealy.description',
		url: 'https://zealy.io',
		icon: Star,
		category: 'product-hunt',
		tags: ['web3', 'quests', 'community', 'marketing'],
		color: '#FFD700'
	}
];
