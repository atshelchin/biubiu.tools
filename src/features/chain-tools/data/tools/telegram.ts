/**
 * Telegram Tools - Verified Web3 channels and groups
 *
 * All channels verified with member counts > 200
 * Last verified: 2024-12
 */
import { Send, Newspaper, TrendingUp, Users, Globe } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const telegramTools: ExternalTool[] = [
	// ========== Major News & Media Channels (Verified) ==========
	{
		id: 'tg-cointelegraph',
		name: 'Cointelegraph',
		descriptionKey: 'chain_tools.tools.tg_cointelegraph.description',
		url: 'https://t.me/cointelegraph',
		icon: Newspaper,
		category: 'telegram',
		tags: ['news', 'media', 'updates', 'english'],
		color: '#FFC107',
		isFeatured: true
	},
	{
		id: 'tg-whale-alert',
		name: 'Whale Alert',
		descriptionKey: 'chain_tools.tools.tg_whale_alert.description',
		url: 'https://t.me/whale_alert_io',
		icon: TrendingUp,
		category: 'telegram',
		tags: ['alpha', 'whale', 'onchain', 'english'],
		color: '#3B82F6',
		isFeatured: true
	},
	{
		id: 'tg-lookonchain',
		name: 'Lookonchain',
		descriptionKey: 'chain_tools.tools.tg_lookonchain.description',
		url: 'https://t.me/lookonchain',
		icon: TrendingUp,
		category: 'telegram',
		tags: ['alpha', 'onchain', 'analytics', 'english'],
		color: '#10B981',
		isFeatured: true
	},

	// ========== Protocol Official Channels (Verified) ==========
	{
		id: 'tg-toncoin',
		name: 'TON Community',
		descriptionKey: 'chain_tools.tools.tg_ton_official.description',
		url: 'https://t.me/toncoin',
		icon: Send,
		category: 'telegram',
		tags: ['protocol', 'l1', 'ton', 'community'],
		color: '#0098EA',
		isFeatured: true
	},
	{
		id: 'tg-solana',
		name: 'Solana',
		descriptionKey: 'chain_tools.tools.tg_solana_ann.description',
		url: 'https://t.me/solana',
		icon: Send,
		category: 'telegram',
		tags: ['protocol', 'l1', 'official', 'announcements'],
		color: '#14F195'
	},
	{
		id: 'tg-arbitrum',
		name: 'Arbitrum',
		descriptionKey: 'chain_tools.tools.tg_arbitrum_ann.description',
		url: 'https://t.me/arbitrum',
		icon: Send,
		category: 'telegram',
		tags: ['protocol', 'l2', 'official', 'announcements'],
		color: '#28A0F0'
	},

	// ========== Chinese Communities (Verified) ==========
	{
		id: 'tg-chaincatcher',
		name: 'ChainCatcher 链捕手',
		descriptionKey: 'chain_tools.tools.tg_chaincatcher.description',
		url: 'https://t.me/ChainCatcher',
		icon: Globe,
		category: 'telegram',
		tags: ['chinese', 'news', 'research', 'asia'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'tg-techflow',
		name: 'TechFlow 深潮',
		descriptionKey: 'chain_tools.tools.tg_techflow.description',
		url: 'https://t.me/TechFlowPost',
		icon: Globe,
		category: 'telegram',
		tags: ['chinese', 'news', 'research', 'asia'],
		color: '#10B981'
	},

	// ========== Regional Communities (Verified) ==========
	{
		id: 'tg-crypto-brazil',
		name: 'Crypto Brasil',
		descriptionKey: 'chain_tools.tools.tg_crypto_brazil.description',
		url: 'https://t.me/CryptoBrasil',
		icon: Users,
		category: 'telegram',
		tags: ['portuguese', 'brazil', 'community', 'americas'],
		color: '#22C55E',
		isFeatured: true
	}
];
