import {
	Zap,
	Sparkles,
	MessageCircle,
	ArrowRightLeft,
	SendHorizontal,
	ScanSearch,
	TrendingUp,
	KeyRound,
	Rocket,
	Search,
	Image,
	Globe,
	Link2
} from '@lucide/svelte';
import type { Component } from 'svelte';

export interface Tool {
	icon: Component;
	titleKey: string;
	descriptionKey: string;
	link?: string;
	status: 'active' | 'coming-soon';
	color: string;
	featureKeys?: string[];
	features?: string[];
	stage?: 'coming-soon' | 'alpha' | 'beta' | 'stable' | 'new';
}

export const TELEGRAM_GROUP_LINK = 'https://t.me/+ABMpMG1islA4NTVl';

export const toolsConfig: Tool[] = [
	{
		icon: SendHorizontal,
		titleKey: 'one-to-many-transfer.title',
		descriptionKey: 'one-to-many-transfer.description',
		link: '/apps/one-to-many-transfer',
		status: 'active',
		color: '#F59E0B',
		featureKeys: [
			'one-to-many-transfer.seo.feature_3',
			'one-to-many-transfer.seo.feature_4',
			'one-to-many-transfer.seo.feature_5'
		],
		stage: 'alpha'
	},
	{
		icon: ScanSearch,
		titleKey: 'token-balance-scanner.title',
		descriptionKey: 'token-balance-scanner.description',
		link: '/apps/token-balance-scanner',
		status: 'active',
		color: '#3B82F6',
		featureKeys: [
			'token-balance-scanner.feature_1',
			'token-balance-scanner.feature_2',
			'token-balance-scanner.feature_3',
			'token-balance-scanner.feature_4'
		],
		stage: 'alpha'
	},
	{
		icon: ArrowRightLeft,
		titleKey: 'wallet-sweep.title',
		descriptionKey: 'wallet-sweep.description',
		link: '/apps/wallet-sweep',
		status: 'active',
		color: '#10B981',
		featureKeys: [
			'wallet-sweep.feature_1',
			'wallet-sweep.feature_2',
			'wallet-sweep.feature_3',
			'wallet-sweep.feature_4'
		],
		stage: 'beta'
	},

	{
		icon: Rocket,
		titleKey: 'contract-deployer.title',
		descriptionKey: 'contract-deployer.description',
		link: '/apps/contract-deployer',
		status: 'active',
		color: '#F59E0B',
		featureKeys: [
			'contract-deployer.feature_1',
			'contract-deployer.feature_2',
			'contract-deployer.feature_3'
		],
		stage: 'alpha'
	},
	{
		icon: Search,
		titleKey: 'contract-events-scanner.title',
		descriptionKey: 'contract-events-scanner.description',
		link: '/apps/contract-events-scanner',
		status: 'active',
		color: '#A855F7',
		featureKeys: [
			'contract-events-scanner.feature_1',
			'contract-events-scanner.feature_2',
			'contract-events-scanner.feature_3'
		],
		stage: 'alpha'
	},
	{
		icon: Zap,
		titleKey: 'call-master.title',
		descriptionKey: 'call-master.description',
		status: 'coming-soon',
		color: '#8B5CF6',
		featureKeys: ['call-master.feature_1', 'call-master.feature_2', 'call-master.feature_3'],
		stage: 'coming-soon'
	},
	{
		icon: KeyRound,
		titleKey: 'wallet-generator.title',
		descriptionKey: 'wallet-generator.description',
		link: '/apps/wallet-generator',
		status: 'active',
		color: '#8B5CF6',
		features: ['HD Path Support', 'Multiple Chains', 'Export to EXCEL/CSV/JSON'],
		stage: 'alpha'
	},
	{
		icon: TrendingUp,
		titleKey: 'dex-moonshot-trader.title',
		descriptionKey: 'dex-moonshot-trader.description',
		link: '/apps/dex-moonshot-trader',
		status: 'active',
		color: '#EF4444',
		features: ['Buy & Sell Tokens', 'Adjustable Slippage', 'Multi-Chain Support'],
		stage: 'alpha'
	},
	{
		icon: MessageCircle,
		titleKey: 'tools.feedback_card.title',
		descriptionKey: 'tools.feedback_card.description',
		link: TELEGRAM_GROUP_LINK,
		status: 'active',
		color: '#06B6D4',
		featureKeys: [
			'tools.feedback_card.feature_1',
			'tools.feedback_card.feature_2',
			'tools.feedback_card.feature_3'
		]
	},

	{
		icon: Sparkles,
		titleKey: 'token-deployer.title',
		descriptionKey: 'token-deployer.description',
		link: '/apps/token-deployer',
		status: 'active',
		color: '#10B981',
		features: ['Advanced Features', 'Tax & Anti-Bot', 'Instant Deploy'],
		stage: 'alpha'
	},

	{
		icon: Image,
		titleKey: 'nft-deployer.title',
		descriptionKey: 'nft-deployer.description',
		link: '/apps/nft-deployer',
		status: 'active',
		color: '#EC4899',
		featureKeys: ['nft-deployer.feature_1', 'nft-deployer.feature_2', 'nft-deployer.feature_3'],
		stage: 'alpha'
	},
	{
		icon: Globe,
		titleKey: 'chainlist.title',
		descriptionKey: 'chainlist.description',
		link: '/apps/chainlist',
		status: 'active',
		color: '#6366F1',
		featureKeys: ['chainlist.feature_1', 'chainlist.feature_2', 'chainlist.feature_3'],
		stage: 'alpha'
	},
	{
		icon: Link2,
		titleKey: 'chain-tools.title',
		descriptionKey: 'chain-tools.subtitle',
		link: '/apps/chain-tools',
		status: 'active',
		color: '#06B6D4',
		featureKeys: [
			'chain-tools.seo.feature_1',
			'chain-tools.seo.feature_2',
			'chain-tools.seo.feature_3'
		],
		stage: 'new'
	}
	// {
	// 	icon: Globe,
	// 	titleKey: 'ens-scanner.title',
	// 	descriptionKey: 'ens-scanner.description',
	// 	link: '/apps/ens-scanner',
	// 	status: 'active',
	// 	color: '#EC4899',
	// 	features: ['Pattern Generation', 'Expiry Tracking', 'Batch Scanning'],
	// 	stage: 'alpha'
	// },

	// {
	// 	icon: Folder,
	// 	titleKey: 'tools.nft_manager.title',
	// 	descriptionKey: 'tools.nft_manager.description',
	// 	link: '/apps/nft-manager',
	// 	status: 'active',
	// 	color: '#A855F7',
	// 	features: ['View NFT Collections', 'Owner & Stake Mint', 'Paginated Browsing'],
	// 	stage: 'alpha'
	// },
	// {
	// 	icon: Activity,
	// 	titleKey: 'assets-monitor.title',
	// 	descriptionKey: 'assets-monitor.description',
	// 	link: '/apps/assets-monitor',
	// 	status: 'active',
	// 	color: '#06B6D4',
	// 	featureKeys: [
	// 		'assets-monitor.feature_1',
	// 		'assets-monitor.feature_2',
	// 		'assets-monitor.feature_3'
	// 	],
	// 	stage: 'alpha'
	// }
];
