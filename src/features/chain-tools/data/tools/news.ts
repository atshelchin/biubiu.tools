/**
 * News Tools - Web3 project funding news, events, and media
 */
import { Newspaper, Rss, Radio, Mic2, TrendingUp, BookOpen } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const newsTools: ExternalTool[] = [
	// ========== Major Crypto News ==========
	{
		id: 'theblock',
		name: 'The Block',
		descriptionKey: 'chain_tools.tools.theblock.description',
		url: 'https://www.theblock.co',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'research', 'funding', 'data'],
		color: '#000000',
		isFeatured: true
	},
	{
		id: 'coindesk',
		name: 'CoinDesk',
		descriptionKey: 'chain_tools.tools.coindesk.description',
		url: 'https://www.coindesk.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'media', 'crypto', 'bitcoin'],
		color: '#0052FF'
	},
	{
		id: 'cointelegraph',
		name: 'Cointelegraph',
		descriptionKey: 'chain_tools.tools.cointelegraph.description',
		url: 'https://cointelegraph.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'media', 'blockchain', 'crypto'],
		color: '#FFD700'
	},
	{
		id: 'decrypt',
		name: 'Decrypt',
		descriptionKey: 'chain_tools.tools.decrypt.description',
		url: 'https://decrypt.co',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'guides', 'crypto', 'web3'],
		color: '#00DC82'
	},
	{
		id: 'blockworks',
		name: 'Blockworks',
		descriptionKey: 'chain_tools.tools.blockworks.description',
		url: 'https://blockworks.co',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'research', 'institutional', 'defi'],
		color: '#6366F1'
	},
	{
		id: 'dlnews',
		name: 'DL News',
		descriptionKey: 'chain_tools.tools.dlnews.description',
		url: 'https://www.dlnews.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'investigations', 'crypto', 'defi'],
		color: '#000000'
	},

	// ========== Funding Focused News ==========
	{
		id: 'rootdata',
		name: 'RootData',
		descriptionKey: 'chain_tools.tools.rootdata.description',
		url: 'https://www.rootdata.com',
		icon: TrendingUp,
		category: 'news',
		tags: ['funding', 'database', 'research', 'web3'],
		color: '#3B82F6',
		isFeatured: true
	},
	{
		id: 'cryptorank',
		name: 'CryptoRank',
		descriptionKey: 'chain_tools.tools.cryptorank.description',
		url: 'https://cryptorank.io',
		icon: TrendingUp,
		category: 'news',
		tags: ['funding', 'ico', 'research', 'analytics'],
		color: '#8B5CF6'
	},
	{
		id: 'messari',
		name: 'Messari',
		descriptionKey: 'chain_tools.tools.messari.description',
		url: 'https://messari.io',
		icon: TrendingUp,
		category: 'news',
		tags: ['research', 'data', 'funding', 'reports'],
		color: '#0052FF'
	},
	{
		id: 'dove-metrics',
		name: 'Dove Metrics',
		descriptionKey: 'chain_tools.tools.dove_metrics.description',
		url: 'https://www.dovemetrics.com',
		icon: TrendingUp,
		category: 'news',
		tags: ['funding', 'tracker', 'vc', 'deals'],
		color: '#10B981'
	},
	{
		id: 'crypto-fundraising',
		name: 'Crypto Fundraising',
		descriptionKey: 'chain_tools.tools.crypto_fundraising.description',
		url: 'https://crypto-fundraising.info',
		icon: TrendingUp,
		category: 'news',
		tags: ['funding', 'rounds', 'tracker', 'news'],
		color: '#F59E0B'
	},

	// ========== Newsletters ==========
	{
		id: 'bankless',
		name: 'Bankless',
		descriptionKey: 'chain_tools.tools.bankless.description',
		url: 'https://www.bankless.com',
		icon: Rss,
		category: 'news',
		tags: ['newsletter', 'podcast', 'defi', 'education'],
		color: '#FF0420',
		isFeatured: true
	},
	{
		id: 'defiant',
		name: 'The Defiant',
		descriptionKey: 'chain_tools.tools.defiant.description',
		url: 'https://thedefiant.io',
		icon: Rss,
		category: 'news',
		tags: ['newsletter', 'defi', 'news', 'video'],
		color: '#8B5CF6'
	},
	{
		id: 'week-in-ethereum',
		name: 'Week in Ethereum',
		descriptionKey: 'chain_tools.tools.week_in_ethereum.description',
		url: 'https://weekinethereumnews.com',
		icon: Rss,
		category: 'news',
		tags: ['newsletter', 'ethereum', 'weekly', 'development'],
		color: '#627EEA'
	},
	{
		id: 'rekt-news',
		name: 'Rekt',
		descriptionKey: 'chain_tools.tools.rekt_news.description',
		url: 'https://rekt.news',
		icon: Rss,
		category: 'news',
		tags: ['security', 'hacks', 'investigations', 'defi'],
		color: '#DC2626'
	},
	{
		id: 'milk-road',
		name: 'Milk Road',
		descriptionKey: 'chain_tools.tools.milk_road.description',
		url: 'https://www.milkroad.com',
		icon: Rss,
		category: 'news',
		tags: ['newsletter', 'daily', 'crypto', 'beginner'],
		color: '#F59E0B'
	},
	{
		id: 'daily-gwei',
		name: 'The Daily Gwei',
		descriptionKey: 'chain_tools.tools.daily_gwei.description',
		url: 'https://www.thedailygwei.com',
		icon: Rss,
		category: 'news',
		tags: ['newsletter', 'ethereum', 'daily', 'analysis'],
		color: '#3B82F6'
	},

	// ========== Podcasts ==========
	{
		id: 'unchained-podcast',
		name: 'Unchained',
		descriptionKey: 'chain_tools.tools.unchained_podcast.description',
		url: 'https://unchainedcrypto.com',
		icon: Mic2,
		category: 'news',
		tags: ['podcast', 'interviews', 'crypto', 'news'],
		color: '#EC4899'
	},
	{
		id: 'epicenter',
		name: 'Epicenter',
		descriptionKey: 'chain_tools.tools.epicenter.description',
		url: 'https://epicenter.tv',
		icon: Mic2,
		category: 'news',
		tags: ['podcast', 'blockchain', 'interviews', 'research'],
		color: '#10B981'
	},
	{
		id: 'zero-knowledge',
		name: 'Zero Knowledge',
		descriptionKey: 'chain_tools.tools.zero_knowledge.description',
		url: 'https://zeroknowledge.fm',
		icon: Mic2,
		category: 'news',
		tags: ['podcast', 'zk', 'technical', 'research'],
		color: '#6366F1'
	},
	{
		id: 'bell-curve',
		name: 'Bell Curve',
		descriptionKey: 'chain_tools.tools.bell_curve.description',
		url: 'https://www.bellcurvepodcast.com',
		icon: Mic2,
		category: 'news',
		tags: ['podcast', 'defi', 'crypto', 'analysis'],
		color: '#8B5CF6'
	},

	// ========== Research & Analysis ==========
	{
		id: 'delphi-digital',
		name: 'Delphi Digital',
		descriptionKey: 'chain_tools.tools.delphi_digital.description',
		url: 'https://delphidigital.io',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'reports', 'institutional', 'analysis'],
		color: '#3B82F6',
		isFeatured: true
	},
	{
		id: 'galaxy-research',
		name: 'Galaxy Research',
		descriptionKey: 'chain_tools.tools.galaxy_research.description',
		url: 'https://www.galaxy.com/research',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'institutional', 'reports', 'data'],
		color: '#000000'
	},
	{
		id: 'nansen-research',
		name: 'Nansen Research',
		descriptionKey: 'chain_tools.tools.nansen_research.description',
		url: 'https://research.nansen.ai',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'onchain', 'data', 'reports'],
		color: '#0052FF'
	},
	{
		id: 'glassnode-insights',
		name: 'Glassnode Insights',
		descriptionKey: 'chain_tools.tools.glassnode_insights.description',
		url: 'https://insights.glassnode.com',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'onchain', 'bitcoin', 'analytics'],
		color: '#00D395'
	},

	// ========== Community & Aggregators ==========
	{
		id: 'crypto-panic',
		name: 'CryptoPanic',
		descriptionKey: 'chain_tools.tools.crypto_panic.description',
		url: 'https://cryptopanic.com',
		icon: Radio,
		category: 'news',
		tags: ['aggregator', 'news', 'sentiment', 'social'],
		color: '#DC2626'
	},
	{
		id: 'crypto-slate',
		name: 'CryptoSlate',
		descriptionKey: 'chain_tools.tools.crypto_slate.description',
		url: 'https://cryptoslate.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'data', 'events', 'research'],
		color: '#1E40AF'
	},
	{
		id: 'bitcoinist',
		name: 'Bitcoinist',
		descriptionKey: 'chain_tools.tools.bitcoinist.description',
		url: 'https://bitcoinist.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'bitcoin', 'crypto', 'analysis'],
		color: '#F7931A'
	},
	{
		id: 'beincrypto',
		name: 'BeInCrypto',
		descriptionKey: 'chain_tools.tools.beincrypto.description',
		url: 'https://beincrypto.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'crypto', 'guides', 'analysis'],
		color: '#00C853'
	},
	{
		id: 'cryptobriefing',
		name: 'Crypto Briefing',
		descriptionKey: 'chain_tools.tools.cryptobriefing.description',
		url: 'https://cryptobriefing.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'research', 'reviews', 'defi'],
		color: '#6366F1'
	},

	// ========== Asian Crypto News ==========
	{
		id: 'foresight-news',
		name: 'Foresight News',
		descriptionKey: 'chain_tools.tools.foresight_news.description',
		url: 'https://foresightnews.pro',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'chinese', 'research', 'web3'],
		color: '#3B82F6'
	},
	{
		id: 'odaily',
		name: 'Odaily',
		descriptionKey: 'chain_tools.tools.odaily.description',
		url: 'https://www.odaily.news',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'chinese', 'crypto', 'blockchain'],
		color: '#1E40AF'
	},
	{
		id: 'panews',
		name: 'PANews',
		descriptionKey: 'chain_tools.tools.panews.description',
		url: 'https://www.panewslab.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'chinese', 'web3', 'analysis'],
		color: '#8B5CF6'
	},
	{
		id: 'techflow',
		name: 'TechFlow',
		descriptionKey: 'chain_tools.tools.techflow.description',
		url: 'https://www.techflowpost.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'chinese', 'research', 'deep-dive'],
		color: '#10B981'
	},
	{
		id: 'wu-blockchain',
		name: 'Wu Blockchain',
		descriptionKey: 'chain_tools.tools.wu_blockchain.description',
		url: 'https://wublock.substack.com',
		icon: Rss,
		category: 'news',
		tags: ['newsletter', 'chinese', 'mining', 'asia'],
		color: '#000000'
	}
];
