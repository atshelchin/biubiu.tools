/**
 * Trends Tools - Hot Topics, VC Investments & Developer Discussions
 *
 * Categories:
 * - VC Investment Tracking (by funding amount)
 * - Crypto Narratives & Trends
 * - Developer Discussions
 * - Research & Reports
 * - Trend Analytics
 */
import {
	TrendingUp,
	Flame,
	DollarSign,
	Newspaper,
	BarChart3,
	Users,
	FileText,
	Globe,
	Lightbulb,
	Calendar,
	MessageSquare,
	Target
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const trendsTools: ExternalTool[] = [
	// ========== VC Investment Tracking ==========
	{
		id: 'crunchbase-crypto',
		name: 'Crunchbase Crypto',
		descriptionKey: 'chain_tools.tools.crunchbase_crypto.description',
		url: 'https://www.crunchbase.com/hub/crypto-companies',
		icon: DollarSign,
		category: 'trends',
		tags: ['vc', 'funding', 'deals', 'database'],
		color: '#0288D1',
		isFeatured: true
	},
	{
		id: 'cryptorank-funding',
		name: 'CryptoRank Funding',
		descriptionKey: 'chain_tools.tools.cryptorank_funding.description',
		url: 'https://cryptorank.io/funding-rounds',
		icon: DollarSign,
		category: 'trends',
		tags: ['vc', 'funding', 'rounds', 'analytics'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'rootdata-funding',
		name: 'RootData',
		descriptionKey: 'chain_tools.tools.rootdata_funding.description',
		url: 'https://www.rootdata.com',
		icon: BarChart3,
		category: 'trends',
		tags: ['vc', 'funding', 'projects', 'database'],
		color: '#6366F1',
		isFeatured: true
	},
	{
		id: 'defilama-raises',
		name: 'DefiLlama Raises',
		descriptionKey: 'chain_tools.tools.defilama_raises.description',
		url: 'https://defillama.com/raises',
		icon: DollarSign,
		category: 'trends',
		tags: ['vc', 'defi', 'funding', 'timeline'],
		color: '#2172E5'
	},
	{
		id: 'messari-funding',
		name: 'Messari Fundraising',
		descriptionKey: 'chain_tools.tools.messari_funding.description',
		url: 'https://messari.io/research/fundraising',
		icon: FileText,
		category: 'trends',
		tags: ['vc', 'research', 'funding', 'analysis'],
		color: '#3B82F6'
	},
	{
		id: 'dove-metrics',
		name: 'Dove Metrics',
		descriptionKey: 'chain_tools.tools.dove_metrics.description',
		url: 'https://www.dovemetrics.com',
		icon: BarChart3,
		category: 'trends',
		tags: ['vc', 'funding', 'reports', 'quarterly'],
		color: '#10B981'
	},
	{
		id: 'galaxy-research',
		name: 'Galaxy Research',
		descriptionKey: 'chain_tools.tools.galaxy_research.description',
		url: 'https://www.galaxy.com/research',
		icon: FileText,
		category: 'trends',
		tags: ['research', 'vc', 'institutional', 'reports'],
		color: '#7C3AED'
	},
	// ========== Trend & Narrative Tracking ==========
	{
		id: 'kaito-ai',
		name: 'Kaito AI',
		descriptionKey: 'chain_tools.tools.kaito_ai.description',
		url: 'https://kaito.ai',
		icon: Flame,
		category: 'trends',
		tags: ['ai', 'trends', 'social', 'analytics'],
		color: '#FF6B35',
		isFeatured: true
	},
	{
		id: 'lunarcrush',
		name: 'LunarCrush',
		descriptionKey: 'chain_tools.tools.lunarcrush.description',
		url: 'https://lunarcrush.com',
		icon: Globe,
		category: 'trends',
		tags: ['social', 'sentiment', 'trends', 'analytics'],
		color: '#5B21B6'
	},
	{
		id: 'santiment',
		name: 'Santiment',
		descriptionKey: 'chain_tools.tools.santiment.description',
		url: 'https://santiment.net',
		icon: BarChart3,
		category: 'trends',
		tags: ['on-chain', 'social', 'sentiment', 'analytics'],
		color: '#14C393'
	},
	{
		id: 'artemis-xyz',
		name: 'Artemis',
		descriptionKey: 'chain_tools.tools.artemis_xyz.description',
		url: 'https://artemis.xyz',
		icon: TrendingUp,
		category: 'trends',
		tags: ['analytics', 'fundamental', 'metrics', 'compare'],
		color: '#6366F1'
	},
	{
		id: 'coinglass-trends',
		name: 'CoinGlass',
		descriptionKey: 'chain_tools.tools.coinglass_trends.description',
		url: 'https://www.coinglass.com',
		icon: BarChart3,
		category: 'trends',
		tags: ['derivatives', 'funding', 'liquidations', 'open-interest'],
		color: '#00D395'
	},
	{
		id: 'cryptoquant-trends',
		name: 'CryptoQuant',
		descriptionKey: 'chain_tools.tools.cryptoquant_trends.description',
		url: 'https://cryptoquant.com',
		icon: BarChart3,
		category: 'trends',
		tags: ['on-chain', 'exchange', 'flows', 'analytics'],
		color: '#2563EB'
	},
	// ========== Developer Discussions & Research ==========
	{
		id: 'ethereum-magicians',
		name: 'Ethereum Magicians',
		descriptionKey: 'chain_tools.tools.ethereum_magicians.description',
		url: 'https://ethereum-magicians.org',
		icon: MessageSquare,
		category: 'trends',
		tags: ['ethereum', 'eip', 'governance', 'discussion'],
		color: '#627EEA',
		isFeatured: true
	},
	{
		id: 'ethresear-ch',
		name: 'ethresear.ch',
		descriptionKey: 'chain_tools.tools.ethresear_ch.description',
		url: 'https://ethresear.ch',
		icon: Lightbulb,
		category: 'trends',
		tags: ['ethereum', 'research', 'scaling', 'cryptography'],
		color: '#1C1C1C',
		isFeatured: true
	},
	{
		id: 'github-trending-sol',
		name: 'GitHub Trending (Solidity)',
		descriptionKey: 'chain_tools.tools.github_trending_sol.description',
		url: 'https://github.com/trending/solidity',
		icon: TrendingUp,
		category: 'trends',
		tags: ['github', 'solidity', 'trending', 'opensource'],
		color: '#1F2937'
	},
	{
		id: 'paradigm-research',
		name: 'Paradigm Research',
		descriptionKey: 'chain_tools.tools.paradigm_research.description',
		url: 'https://www.paradigm.xyz/writing',
		icon: FileText,
		category: 'trends',
		tags: ['research', 'vc', 'technical', 'crypto-native'],
		color: '#000000'
	},
	{
		id: 'a16z-research',
		name: 'a16z crypto Research',
		descriptionKey: 'chain_tools.tools.a16z_research.description',
		url: 'https://a16zcrypto.com/research',
		icon: FileText,
		category: 'trends',
		tags: ['research', 'vc', 'regulatory', 'technical'],
		color: '#FF6B35'
	},
	{
		id: 'flashbots-writings',
		name: 'Flashbots Writings',
		descriptionKey: 'chain_tools.tools.flashbots_writings.description',
		url: 'https://writings.flashbots.net',
		icon: Lightbulb,
		category: 'trends',
		tags: ['mev', 'research', 'pbs', 'ethereum'],
		color: '#000000'
	},
	// ========== Hot Narratives 2024-2025 ==========
	{
		id: 'modular-narrative',
		name: 'Modular Stack',
		descriptionKey: 'chain_tools.tools.modular_narrative.description',
		url: 'https://celestia.org',
		icon: Target,
		category: 'trends',
		tags: ['modular', 'da', 'celestia', 'narrative'],
		color: '#7C3AED'
	},
	{
		id: 'btcfi-narrative',
		name: 'BTCFi Ecosystem',
		descriptionKey: 'chain_tools.tools.btcfi_narrative.description',
		url: 'https://stacks.co',
		icon: Flame,
		category: 'trends',
		tags: ['bitcoin', 'defi', 'ordinals', 'narrative'],
		color: '#F7931A'
	},
	{
		id: 'intent-narrative',
		name: 'Intents & Chain Abstraction',
		descriptionKey: 'chain_tools.tools.intent_narrative.description',
		url: 'https://www.anoma.net',
		icon: Lightbulb,
		category: 'trends',
		tags: ['intents', 'chain-abstraction', 'ux', 'narrative'],
		color: '#8B5CF6'
	},
	{
		id: 'depin-narrative',
		name: 'DePIN Ecosystem',
		descriptionKey: 'chain_tools.tools.depin_narrative.description',
		url: 'https://www.depindd.com',
		icon: Globe,
		category: 'trends',
		tags: ['depin', 'infrastructure', 'iot', 'narrative'],
		color: '#10B981',
		isFeatured: true
	},
	{
		id: 'socialfi-narrative',
		name: 'SocialFi Trends',
		descriptionKey: 'chain_tools.tools.socialfi_narrative.description',
		url: 'https://farcaster.xyz',
		icon: Users,
		category: 'trends',
		tags: ['socialfi', 'farcaster', 'lens', 'narrative'],
		color: '#8B5CF6'
	},
	// ========== Trend Reports & Newsletters ==========
	{
		id: 'theblock-research',
		name: 'The Block Research',
		descriptionKey: 'chain_tools.tools.theblock_research.description',
		url: 'https://www.theblock.co/research',
		icon: Newspaper,
		category: 'trends',
		tags: ['research', 'reports', 'data', 'institutional'],
		color: '#000000'
	},
	// {
	// 	id: 'delphi-digital',
	// 	name: 'Delphi Digital',
	// 	descriptionKey: 'chain_tools.tools.delphi_digital.description',
	// 	url: 'https://delphidigital.io',
	// 	icon: FileText,
	// 	category: 'trends',
	// 	tags: ['research', 'reports', 'institutional', 'deep-dive'],
	// 	color: '#F97316',
	// 	isFeatured: true
	// },
	{
		id: 'bankless-hq',
		name: 'Bankless',
		descriptionKey: 'chain_tools.tools.bankless_hq.description',
		url: 'https://www.bankless.com',
		icon: Newspaper,
		category: 'trends',
		tags: ['media', 'podcast', 'defi', 'ethereum'],
		color: '#FF0420'
	},
	{
		id: 'unchained-crypto',
		name: 'Unchained',
		descriptionKey: 'chain_tools.tools.unchained_crypto.description',
		url: 'https://unchainedcrypto.com',
		icon: Newspaper,
		category: 'trends',
		tags: ['media', 'podcast', 'news', 'interviews'],
		color: '#1E40AF'
	},
	// ========== Events & Conferences ==========
	{
		id: 'ethglobal-events',
		name: 'ETHGlobal',
		descriptionKey: 'chain_tools.tools.ethglobal_events.description',
		url: 'https://ethglobal.com',
		icon: Calendar,
		category: 'trends',
		tags: ['hackathon', 'events', 'ethereum', 'builders'],
		color: '#000000'
	},
	{
		id: 'devcon-ethereum',
		name: 'Devcon',
		descriptionKey: 'chain_tools.tools.devcon_ethereum.description',
		url: 'https://devcon.org',
		icon: Calendar,
		category: 'trends',
		tags: ['conference', 'ethereum', 'developers', 'annual'],
		color: '#627EEA'
	},
	{
		id: 'consensus-coindesk',
		name: 'Consensus',
		descriptionKey: 'chain_tools.tools.consensus_coindesk.description',
		url: 'https://consensus.coindesk.com',
		icon: Calendar,
		category: 'trends',
		tags: ['conference', 'industry', 'networking', 'annual'],
		color: '#0033A0'
	},
	{
		id: 'token2049',
		name: 'TOKEN2049',
		descriptionKey: 'chain_tools.tools.token2049.description',
		url: 'https://token2049.com',
		icon: Calendar,
		category: 'trends',
		tags: ['conference', 'asia', 'networking', 'industry'],
		color: '#FF6B35'
	},
	// ========== Developer Activity Tracking ==========
	{
		id: 'developerreport',
		name: 'Electric Capital Dev Report',
		descriptionKey: 'chain_tools.tools.developerreport.description',
		url: 'https://www.developerreport.com',
		icon: BarChart3,
		category: 'trends',
		tags: ['developers', 'metrics', 'report', 'annual'],
		color: '#6366F1',
		isFeatured: true
	},
	{
		id: 'tokenterminal-dev',
		name: 'Token Terminal',
		descriptionKey: 'chain_tools.tools.tokenterminal_dev.description',
		url: 'https://tokenterminal.com',
		icon: BarChart3,
		category: 'trends',
		tags: ['analytics', 'fundamentals', 'revenue', 'metrics'],
		color: '#1E40AF'
	}
];
