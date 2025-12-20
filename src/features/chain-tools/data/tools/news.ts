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
	},

	// ========== Additional News & Media ==========
	{
		id: 'chaincatcher',
		name: 'ChainCatcher',
		descriptionKey: 'chain_tools.tools.chaincatcher.description',
		url: 'https://www.chaincatcher.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'chinese', 'web3', 'research'],
		color: '#3B82F6'
	},
	{
		id: 'marsbit',
		name: 'MarsBit',
		descriptionKey: 'chain_tools.tools.marsbit.description',
		url: 'https://www.marsbit.co',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'chinese', 'crypto', 'analysis'],
		color: '#FF4500'
	},
	{
		id: 'blockbeats',
		name: 'BlockBeats',
		descriptionKey: 'chain_tools.tools.blockbeats.description',
		url: 'https://www.theblockbeats.info',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'chinese', 'web3', 'flash'],
		color: '#000000'
	},
	{
		id: 'jinse',
		name: 'Jinse Finance',
		descriptionKey: 'chain_tools.tools.jinse.description',
		url: 'https://www.jinse.cn',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'chinese', 'crypto', 'mainstream'],
		color: '#F7931A'
	},
	{
		id: 'coinpost-jp',
		name: 'CoinPost',
		descriptionKey: 'chain_tools.tools.coinpost_jp.description',
		url: 'https://coinpost.jp',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'japanese', 'crypto', 'market'],
		color: '#BC002D'
	},
	{
		id: 'coindeskjapan',
		name: 'CoinDesk Japan',
		descriptionKey: 'chain_tools.tools.coindeskjapan.description',
		url: 'https://www.coindeskjapan.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'japanese', 'crypto', 'global'],
		color: '#0052FF'
	},
	{
		id: 'coinness-kr',
		name: 'Coinness Korea',
		descriptionKey: 'chain_tools.tools.coinness_kr.description',
		url: 'https://coinness.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'korean', 'flash', 'market'],
		color: '#003478'
	},
	{
		id: 'blockmedia-kr',
		name: 'Block Media',
		descriptionKey: 'chain_tools.tools.blockmedia_kr.description',
		url: 'https://www.blockmedia.co.kr',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'korean', 'crypto', 'analysis'],
		color: '#1E40AF'
	},
	{
		id: 'ambcrypto',
		name: 'AMBCrypto',
		descriptionKey: 'chain_tools.tools.ambcrypto.description',
		url: 'https://ambcrypto.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'crypto', 'analysis', 'market'],
		color: '#6366F1'
	},
	{
		id: 'newsbtc',
		name: 'NewsBTC',
		descriptionKey: 'chain_tools.tools.newsbtc.description',
		url: 'https://newsbtc.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'bitcoin', 'trading', 'analysis'],
		color: '#F7931A'
	},
	{
		id: 'crypto-news',
		name: 'Crypto News',
		descriptionKey: 'chain_tools.tools.crypto_news.description',
		url: 'https://cryptonews.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'crypto', 'market', 'global'],
		color: '#3B82F6'
	},
	{
		id: 'u-today',
		name: 'U.Today',
		descriptionKey: 'chain_tools.tools.u_today.description',
		url: 'https://u.today',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'crypto', 'bitcoin', 'altcoins'],
		color: '#FF4500'
	},
	{
		id: 'dailycoin',
		name: 'DailyCoin',
		descriptionKey: 'chain_tools.tools.dailycoin.description',
		url: 'https://dailycoin.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'crypto', 'daily', 'market'],
		color: '#10B981'
	},
	{
		id: 'coinspeaker',
		name: 'Coinspeaker',
		descriptionKey: 'chain_tools.tools.coinspeaker.description',
		url: 'https://coinspeaker.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'crypto', 'fintech', 'blockchain'],
		color: '#8B5CF6'
	},
	{
		id: 'bitcoinmagazine',
		name: 'Bitcoin Magazine',
		descriptionKey: 'chain_tools.tools.bitcoinmagazine.description',
		url: 'https://bitcoinmagazine.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'bitcoin', 'culture', 'education'],
		color: '#F7931A',
		isFeatured: true
	},
	{
		id: 'protos',
		name: 'Protos',
		descriptionKey: 'chain_tools.tools.protos.description',
		url: 'https://protos.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'investigations', 'crypto', 'deep-dive'],
		color: '#1E40AF'
	},
	{
		id: 'web3isgoinggreat',
		name: 'Web3 Is Going Great',
		descriptionKey: 'chain_tools.tools.web3isgoinggreat.description',
		url: 'https://web3isgoinggreat.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'scams', 'hacks', 'tracker'],
		color: '#DC2626'
	},
	{
		id: 'thedefireport',
		name: 'The DeFi Report',
		descriptionKey: 'chain_tools.tools.thedefireport.description',
		url: 'https://thedefireport.io',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'defi', 'analysis', 'reports'],
		color: '#8B5CF6'
	},
	{
		id: 'cryptotvplus',
		name: 'CryptoTVPlus',
		descriptionKey: 'chain_tools.tools.cryptotvplus.description',
		url: 'https://cryptotvplus.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'african', 'crypto', 'blockchain'],
		color: '#10B981'
	},
	{
		id: 'bitcoinke',
		name: 'BitcoinKE',
		descriptionKey: 'chain_tools.tools.bitcoinke.description',
		url: 'https://bitcoinke.io',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'african', 'bitcoin', 'kenya'],
		color: '#F7931A'
	},
	{
		id: 'watcher-guru',
		name: 'Watcher Guru',
		descriptionKey: 'chain_tools.tools.watcher_guru.description',
		url: 'https://watcher.guru',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'crypto', 'shiba', 'meme'],
		color: '#FF6B35'
	},
	{
		id: 'coinpedia',
		name: 'Coinpedia',
		descriptionKey: 'chain_tools.tools.coinpedia.description',
		url: 'https://coinpedia.org',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'crypto', 'fintech', 'education'],
		color: '#3B82F6'
	},
	{
		id: 'cryptopotato',
		name: 'CryptoPotato',
		descriptionKey: 'chain_tools.tools.cryptopotato.description',
		url: 'https://cryptopotato.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'crypto', 'guides', 'trading'],
		color: '#8B5CF6'
	},
	{
		id: 'btcpulse',
		name: 'BTC Pulse',
		descriptionKey: 'chain_tools.tools.btcpulse.description',
		url: 'https://btcpulse.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'bitcoin', 'macro', 'analysis'],
		color: '#F7931A'
	},
	{
		id: 'blockonomi',
		name: 'Blockonomi',
		descriptionKey: 'chain_tools.tools.blockonomi.description',
		url: 'https://blockonomi.com',
		icon: Newspaper,
		category: 'news',
		tags: ['news', 'crypto', 'guides', 'reviews'],
		color: '#1E40AF'
	},
	{
		id: 'coincodex',
		name: 'CoinCodex',
		descriptionKey: 'chain_tools.tools.coincodex.description',
		url: 'https://coincodex.com',
		icon: TrendingUp,
		category: 'news',
		tags: ['data', 'prices', 'news', 'predictions'],
		color: '#00C853'
	},
	{
		id: 'tokeninsight',
		name: 'TokenInsight',
		descriptionKey: 'chain_tools.tools.tokeninsight.description',
		url: 'https://tokeninsight.com',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'ratings', 'reports', 'data'],
		color: '#3B82F6'
	},
	{
		id: 'artemis-xyz',
		name: 'Artemis',
		descriptionKey: 'chain_tools.tools.artemis_xyz.description',
		url: 'https://artemis.xyz',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'data', 'institutional', 'reports'],
		color: '#8B5CF6'
	},
	{
		id: 'tokenterminal-blog',
		name: 'Token Terminal Blog',
		descriptionKey: 'chain_tools.tools.tokenterminal_blog.description',
		url: 'https://tokenterminal.com/resources',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'data', 'fundamentals', 'reports'],
		color: '#000000'
	},
	{
		id: 'bitbo',
		name: 'Bitbo',
		descriptionKey: 'chain_tools.tools.bitbo.description',
		url: 'https://bitbo.io',
		icon: TrendingUp,
		category: 'news',
		tags: ['data', 'bitcoin', 'charts', 'dashboard'],
		color: '#F7931A'
	},
	{
		id: 'lookintochains',
		name: 'Look Into Chains',
		descriptionKey: 'chain_tools.tools.lookintochains.description',
		url: 'https://lookintochains.com',
		icon: TrendingUp,
		category: 'news',
		tags: ['data', 'on-chain', 'whales', 'analytics'],
		color: '#00D395'
	},
	{
		id: 'vettafi',
		name: 'VettaFi',
		descriptionKey: 'chain_tools.tools.vettafi.description',
		url: 'https://vettafi.com/topics/crypto',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'etf', 'institutional', 'crypto'],
		color: '#1E40AF'
	},
	{
		id: 'cryptohayes-blog',
		name: 'Arthur Hayes Blog',
		descriptionKey: 'chain_tools.tools.cryptohayes_blog.description',
		url: 'https://cryptohayes.medium.com',
		icon: Rss,
		category: 'news',
		tags: ['blog', 'macro', 'bitmex', 'essays'],
		color: '#000000'
	},
	{
		id: 'vitalik-blog',
		name: 'Vitalik Blog',
		descriptionKey: 'chain_tools.tools.vitalik_blog.description',
		url: 'https://vitalik.eth.limo',
		icon: Rss,
		category: 'news',
		tags: ['blog', 'ethereum', 'research', 'philosophy'],
		color: '#627EEA',
		isFeatured: true
	},
	{
		id: 'paradigm-blog',
		name: 'Paradigm Blog',
		descriptionKey: 'chain_tools.tools.paradigm_blog.description',
		url: 'https://www.paradigm.xyz/writing',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'defi', 'crypto', 'vc'],
		color: '#000000'
	},
	{
		id: 'a16zcrypto',
		name: 'a16z Crypto',
		descriptionKey: 'chain_tools.tools.a16zcrypto.description',
		url: 'https://a16zcrypto.com',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'vc', 'crypto', 'reports'],
		color: '#000000',
		isFeatured: true
	},
	{
		id: 'binanceresearch',
		name: 'Binance Research',
		descriptionKey: 'chain_tools.tools.binanceresearch.description',
		url: 'https://research.binance.com',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'reports', 'data', 'binance'],
		color: '#F0B90B'
	},
	{
		id: 'coinbaselearn',
		name: 'Coinbase Learn',
		descriptionKey: 'chain_tools.tools.coinbaselearn.description',
		url: 'https://www.coinbase.com/learn',
		icon: BookOpen,
		category: 'news',
		tags: ['education', 'crypto', 'guides', 'beginner'],
		color: '#0052FF'
	},
	{
		id: 'chainalysis-blog',
		name: 'Chainalysis Blog',
		descriptionKey: 'chain_tools.tools.chainalysis_blog.description',
		url: 'https://www.chainalysis.com/blog',
		icon: BookOpen,
		category: 'news',
		tags: ['research', 'compliance', 'on-chain', 'reports'],
		color: '#0C4A6E'
	},
	{
		id: 'ethereum-blog',
		name: 'Ethereum Foundation Blog',
		descriptionKey: 'chain_tools.tools.ethereum_blog.description',
		url: 'https://blog.ethereum.org',
		icon: Rss,
		category: 'news',
		tags: ['blog', 'ethereum', 'development', 'updates'],
		color: '#627EEA'
	}
];
