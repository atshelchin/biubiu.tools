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
		descriptionKey: 'trends.tools.crunchbase_crypto.description',
		url: 'https://www.crunchbase.com/hub/crypto-companies',
		icon: DollarSign,
		category: 'trends',
		tags: ['vc', 'funding', 'deals', 'database'],
		color: '#0288D1'
	},
	{
		id: 'cryptorank-funding',
		name: 'CryptoRank Funding',
		descriptionKey: 'trends.tools.cryptorank_funding.description',
		url: 'https://cryptorank.io/funding-rounds',
		icon: DollarSign,
		category: 'trends',
		tags: ['vc', 'funding', 'rounds', 'analytics'],
		color: '#8B5CF6'
	},
	{
		id: 'rootdata-funding',
		name: 'RootData',
		descriptionKey: 'trends.tools.rootdata_funding.description',
		url: 'https://www.rootdata.com',
		icon: BarChart3,
		category: 'trends',
		tags: ['vc', 'funding', 'projects', 'database'],
		color: '#6366F1'
	},
	{
		id: 'defilama-raises',
		name: 'DefiLlama Raises',
		descriptionKey: 'trends.tools.defilama_raises.description',
		url: 'https://defillama.com/raises',
		icon: DollarSign,
		category: 'trends',
		tags: ['vc', 'defi', 'funding', 'timeline'],
		color: '#2172E5'
	},
	{
		id: 'messari-funding',
		name: 'Messari Fundraising',
		descriptionKey: 'trends.tools.messari_funding.description',
		url: 'https://messari.io/research/fundraising',
		icon: FileText,
		category: 'trends',
		tags: ['vc', 'research', 'funding', 'analysis'],
		color: '#3B82F6'
	},
	{
		id: 'dove-metrics',
		name: 'Dove Metrics',
		descriptionKey: 'trends.tools.dove_metrics.description',
		url: 'https://www.dovemetrics.com',
		icon: BarChart3,
		category: 'trends',
		tags: ['vc', 'funding', 'reports', 'quarterly'],
		color: '#10B981'
	},
	{
		id: 'galaxy-research',
		name: 'Galaxy Research',
		descriptionKey: 'trends.tools.galaxy_research.description',
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
		descriptionKey: 'trends.tools.kaito_ai.description',
		url: 'https://kaito.ai',
		icon: Flame,
		category: 'trends',
		tags: ['ai', 'trends', 'social', 'analytics'],
		color: '#FF6B35'
	},
	{
		id: 'lunarcrush',
		name: 'LunarCrush',
		descriptionKey: 'trends.tools.lunarcrush.description',
		url: 'https://lunarcrush.com',
		icon: Globe,
		category: 'trends',
		tags: ['social', 'sentiment', 'trends', 'analytics'],
		color: '#5B21B6'
	},
	{
		id: 'santiment',
		name: 'Santiment',
		descriptionKey: 'trends.tools.santiment.description',
		url: 'https://santiment.net',
		icon: BarChart3,
		category: 'trends',
		tags: ['on-chain', 'social', 'sentiment', 'analytics'],
		color: '#14C393'
	},
	{
		id: 'artemis-xyz',
		name: 'Artemis',
		descriptionKey: 'trends.tools.artemis_xyz.description',
		url: 'https://artemis.xyz',
		icon: TrendingUp,
		category: 'trends',
		tags: ['analytics', 'fundamental', 'metrics', 'compare'],
		color: '#6366F1'
	},
	{
		id: 'coinglass-trends',
		name: 'CoinGlass',
		descriptionKey: 'trends.tools.coinglass_trends.description',
		url: 'https://www.coinglass.com',
		icon: BarChart3,
		category: 'trends',
		tags: ['derivatives', 'funding', 'liquidations', 'open-interest'],
		color: '#00D395'
	},
	{
		id: 'cryptoquant-trends',
		name: 'CryptoQuant',
		descriptionKey: 'trends.tools.cryptoquant_trends.description',
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
		descriptionKey: 'trends.tools.ethereum_magicians.description',
		url: 'https://ethereum-magicians.org',
		icon: MessageSquare,
		category: 'trends',
		tags: ['ethereum', 'eip', 'governance', 'discussion'],
		color: '#627EEA'
	},
	{
		id: 'ethresear-ch',
		name: 'ethresear.ch',
		descriptionKey: 'trends.tools.ethresear_ch.description',
		url: 'https://ethresear.ch',
		icon: Lightbulb,
		category: 'trends',
		tags: ['ethereum', 'research', 'scaling', 'cryptography'],
		color: '#1C1C1C'
	},
	{
		id: 'github-trending-sol',
		name: 'GitHub Trending (Solidity)',
		descriptionKey: 'trends.tools.github_trending_sol.description',
		url: 'https://github.com/trending/solidity',
		icon: TrendingUp,
		category: 'trends',
		tags: ['github', 'solidity', 'trending', 'opensource'],
		color: '#1F2937'
	},
	{
		id: 'paradigm-research',
		name: 'Paradigm Research',
		descriptionKey: 'trends.tools.paradigm_research.description',
		url: 'https://www.paradigm.xyz/writing',
		icon: FileText,
		category: 'trends',
		tags: ['research', 'vc', 'technical', 'crypto-native'],
		color: '#000000'
	},
	{
		id: 'a16z-research',
		name: 'a16z crypto Research',
		descriptionKey: 'trends.tools.a16z_research.description',
		url: 'https://a16zcrypto.com/research',
		icon: FileText,
		category: 'trends',
		tags: ['research', 'vc', 'regulatory', 'technical'],
		color: '#FF6B35'
	},
	{
		id: 'flashbots-writings',
		name: 'Flashbots Writings',
		descriptionKey: 'trends.tools.flashbots_writings.description',
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
		descriptionKey: 'trends.tools.modular_narrative.description',
		url: 'https://celestia.org',
		icon: Target,
		category: 'trends',
		tags: ['modular', 'da', 'celestia', 'narrative'],
		color: '#7C3AED'
	},
	{
		id: 'btcfi-narrative',
		name: 'BTCFi Ecosystem',
		descriptionKey: 'trends.tools.btcfi_narrative.description',
		url: 'https://stacks.co',
		icon: Flame,
		category: 'trends',
		tags: ['bitcoin', 'defi', 'ordinals', 'narrative'],
		color: '#F7931A'
	},
	{
		id: 'intent-narrative',
		name: 'Intents & Chain Abstraction',
		descriptionKey: 'trends.tools.intent_narrative.description',
		url: 'https://www.anoma.net',
		icon: Lightbulb,
		category: 'trends',
		tags: ['intents', 'chain-abstraction', 'ux', 'narrative'],
		color: '#8B5CF6'
	},
	{
		id: 'depin-narrative',
		name: 'DePIN Ecosystem',
		descriptionKey: 'trends.tools.depin_narrative.description',
		url: 'https://www.depindd.com',
		icon: Globe,
		category: 'trends',
		tags: ['depin', 'infrastructure', 'iot', 'narrative'],
		color: '#10B981'
	},
	{
		id: 'socialfi-narrative',
		name: 'SocialFi Trends',
		descriptionKey: 'trends.tools.socialfi_narrative.description',
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
		descriptionKey: 'trends.tools.theblock_research.description',
		url: 'https://www.theblock.co/research',
		icon: Newspaper,
		category: 'trends',
		tags: ['research', 'reports', 'data', 'institutional'],
		color: '#000000'
	},
	// {
	// 	id: 'delphi-digital',
	// 	name: 'Delphi Digital',
	// 	descriptionKey: 'trends.tools.delphi_digital.description',
	// 	url: 'https://delphidigital.io',
	// 	icon: FileText,
	// 	category: 'trends',
	// 	tags: ['research', 'reports', 'institutional', 'deep-dive'],
	// 	color: '#F97316',
	//
	// },
	{
		id: 'bankless-hq',
		name: 'Bankless',
		descriptionKey: 'trends.tools.bankless_hq.description',
		url: 'https://www.bankless.com',
		icon: Newspaper,
		category: 'trends',
		tags: ['media', 'podcast', 'defi', 'ethereum'],
		color: '#FF0420'
	},
	{
		id: 'unchained-crypto',
		name: 'Unchained',
		descriptionKey: 'trends.tools.unchained_crypto.description',
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
		descriptionKey: 'trends.tools.ethglobal_events.description',
		url: 'https://ethglobal.com',
		icon: Calendar,
		category: 'trends',
		tags: ['hackathon', 'events', 'ethereum', 'builders'],
		color: '#000000'
	},
	{
		id: 'devcon-ethereum',
		name: 'Devcon',
		descriptionKey: 'trends.tools.devcon_ethereum.description',
		url: 'https://devcon.org',
		icon: Calendar,
		category: 'trends',
		tags: ['conference', 'ethereum', 'developers', 'annual'],
		color: '#627EEA'
	},
	{
		id: 'consensus-coindesk',
		name: 'Consensus',
		descriptionKey: 'trends.tools.consensus_coindesk.description',
		url: 'https://consensus.coindesk.com',
		icon: Calendar,
		category: 'trends',
		tags: ['conference', 'industry', 'networking', 'annual'],
		color: '#0033A0'
	},
	{
		id: 'token2049',
		name: 'TOKEN2049',
		descriptionKey: 'trends.tools.token2049.description',
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
		descriptionKey: 'trends.tools.developerreport.description',
		url: 'https://www.developerreport.com',
		icon: BarChart3,
		category: 'trends',
		tags: ['developers', 'metrics', 'report', 'annual'],
		color: '#6366F1'
	},
	{
		id: 'tokenterminal-dev',
		name: 'Token Terminal',
		descriptionKey: 'trends.tools.tokenterminal_dev.description',
		url: 'https://tokenterminal.com',
		icon: BarChart3,
		category: 'trends',
		tags: ['analytics', 'fundamentals', 'revenue', 'metrics'],
		color: '#1E40AF'
	}
];
