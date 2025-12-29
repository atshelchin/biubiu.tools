import {
	// Zap,
	// Sparkles,
	MessageCircle,
	ArrowRightLeft,
	SendHorizontal,
	ScanSearch,
	// TrendingUp,
	// KeyRound,
	// Rocket,
	// Search,
	// Image,
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
		titleKey: 'home.one-to-many-transfer.title',
		descriptionKey: 'home.one-to-many-transfer.description',
		link: '/apps/one-to-many-transfer',
		status: 'active',
		color: '#F59E0B',
		featureKeys: [
			'home.one-to-many-transfer.features.0',
			'home.one-to-many-transfer.features.1',
			'home.one-to-many-transfer.features.2'
		],
		stage: 'alpha'
	},
	{
		icon: ScanSearch,
		titleKey: 'home.token-balance-scanner.title',
		descriptionKey: 'home.token-balance-scanner.description',
		link: '/apps/token-balance-scanner',
		status: 'active',
		color: '#3B82F6',
		featureKeys: [
			'home.token-balance-scanner.features.0',
			'home.token-balance-scanner.features.1',
			'home.token-balance-scanner.features.2',
			'home.token-balance-scanner.features.3'
		],
		stage: 'alpha'
	},
	{
		icon: ArrowRightLeft,
		titleKey: 'home.wallet-sweep.title',
		descriptionKey: 'home.wallet-sweep.description',
		link: '/apps/wallet-sweep',
		status: 'active',
		color: '#10B981',
		featureKeys: [
			'home.wallet-sweep.features.0',
			'home.wallet-sweep.features.1',
			'home.wallet-sweep.features.2',
			'home.wallet-sweep.features.3'
		],
		stage: 'beta'
	},

	// {
	// 	icon: Rocket,
	// 	titleKey: 'home.contract-deployer.title',
	// 	descriptionKey: 'home.contract-deployer.description',
	// 	link: '/apps/contract-deployer',
	// 	status: 'active',
	// 	color: '#F59E0B',
	// 	featureKeys: [
	// 		'home.contract-deployer.features.0',
	// 		'home.contract-deployer.features.1',
	// 		'home.contract-deployer.features.2'
	// 	],
	// 	stage: 'alpha'
	// },
	// {
	// 	icon: Search,
	// 	titleKey: 'home.contract-events-scanner.title',
	// 	descriptionKey: 'home.contract-events-scanner.description',
	// 	link: '/apps/contract-events-scanner',
	// 	status: 'active',
	// 	color: '#A855F7',
	// 	featureKeys: [
	// 		'home.contract-events-scanner.features.0',
	// 		'home.contract-events-scanner.features.1',
	// 		'home.contract-events-scanner.features.2'
	// 	],
	// 	stage: 'alpha'
	// },
	// {
	// 	icon: Zap,
	// 	titleKey: 'home.call-master.title',
	// 	descriptionKey: 'home.call-master.description',
	// 	status: 'coming-soon',
	// 	color: '#8B5CF6',
	// 	featureKeys: [
	// 		'home.call-master.features.0',
	// 		'home.call-master.features.1',
	// 		'home.call-master.features.2'
	// 	],
	// 	stage: 'coming-soon'
	// },
	// {
	// 	icon: KeyRound,
	// 	titleKey: 'home.wallet-generator.title',
	// 	descriptionKey: 'home.wallet-generator.description',
	// 	link: '/apps/wallet-generator',
	// 	status: 'active',
	// 	color: '#8B5CF6',
	// 	featureKeys: [
	// 		'home.wallet-generator.features.0',
	// 		'home.wallet-generator.features.1',
	// 		'home.wallet-generator.features.2'
	// 	],
	// 	stage: 'alpha'
	// },
	// {
	// 	icon: TrendingUp,
	// 	titleKey: 'home.dex-moonshot-trader.title',
	// 	descriptionKey: 'home.dex-moonshot-trader.description',
	// 	link: '/apps/dex-moonshot-trader',
	// 	status: 'active',
	// 	color: '#EF4444',
	// 	featureKeys: [
	// 		'home.dex-moonshot-trader.features.0',
	// 		'home.dex-moonshot-trader.features.1',
	// 		'home.dex-moonshot-trader.features.2'
	// 	],
	// 	stage: 'alpha'
	// },
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

	// {
	// 	icon: Sparkles,
	// 	titleKey: 'home.token-deployer.title',
	// 	descriptionKey: 'home.token-deployer.description',
	// 	link: '/apps/token-deployer',
	// 	status: 'active',
	// 	color: '#10B981',
	// 	featureKeys: [
	// 		'home.token-deployer.features.0',
	// 		'home.token-deployer.features.1',
	// 		'home.token-deployer.features.2'
	// 	],
	// 	stage: 'alpha'
	// },

	// {
	// 	icon: Image,
	// 	titleKey: 'home.nft-deployer.title',
	// 	descriptionKey: 'home.nft-deployer.description',
	// 	link: '/apps/nft-deployer',
	// 	status: 'active',
	// 	color: '#EC4899',
	// 	featureKeys: [
	// 		'home.nft-deployer.features.0',
	// 		'home.nft-deployer.features.1',
	// 		'home.nft-deployer.features.2'
	// 	],
	// 	stage: 'alpha'
	// },
	{
		icon: Globe,
		titleKey: 'home.chainlist.title',
		descriptionKey: 'home.chainlist.description',
		link: '/apps/chainlist',
		status: 'active',
		color: '#6366F1',
		featureKeys: [
			'home.chainlist.features.0',
			'home.chainlist.features.1',
			'home.chainlist.features.2'
		],
		stage: 'alpha'
	},
	{
		icon: Link2,
		titleKey: 'home.chain-tools.title',
		descriptionKey: 'home.chain-tools.description',
		link: '/apps/chain-tools',
		status: 'active',
		color: '#06B6D4',
		featureKeys: [
			'home.chain-tools.features.0',
			'home.chain-tools.features.1',
			'home.chain-tools.features.2'
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
