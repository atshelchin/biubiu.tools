import {
	Zap,
	Sparkles,
	MessageCircle,
	ArrowRightLeft,
	SendHorizontal,
	ScanSearch,
	Globe,
	TrendingUp,
	KeyRound,
	Rocket,
	Activity,
	Search,
	Image,
	Folder
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
		titleKey: 'tools.token_distribution.title',
		descriptionKey: 'tools.token_distribution.description',
		link: '/apps/token-distribution',
		status: 'active',
		color: '#F59E0B',
		features: ['Equal or Custom Amounts', 'CSV Import Ready', 'Real-time Preview'],
		stage: 'alpha'
	},
	{
		icon: ScanSearch,
		titleKey: 'tools.token_balance_scanner.title',
		descriptionKey: 'tools.token_balance_scanner.description',
		link: '/apps/token-balance-scanner',
		status: 'active',
		color: '#3B82F6',
		featureKeys: [
			'tools.token_balance_scanner.feature_1',
			'tools.token_balance_scanner.feature_2',
			'tools.token_balance_scanner.feature_3',
			'tools.token_balance_scanner.feature_4'
		],
		stage: 'alpha'
	},
	{
		icon: ArrowRightLeft,
		titleKey: 'tools.wallet_sweep.title',
		descriptionKey: 'tools.wallet_sweep.description',
		link: '/apps/wallet-sweep',
		status: 'active',
		color: '#10B981',
		featureKeys: [
			'tools.wallet_sweep.feature_1',
			'tools.wallet_sweep.feature_2',
			'tools.wallet_sweep.feature_3',
			'tools.wallet_sweep.feature_4'
		],
		stage: 'beta'
	},
	{
		icon: Sparkles,
		titleKey: 'tools.token_deployer.title',
		descriptionKey: 'tools.token_deployer.description',
		link: '/apps/token-deployer',
		status: 'active',
		color: '#10B981',
		features: ['Advanced Features', 'Tax & Anti-Bot', 'Instant Deploy'],
		stage: 'alpha'
	},
	{
		icon: Rocket,
		titleKey: 'tools.contract_deployer.title',
		descriptionKey: 'tools.contract_deployer.description',
		link: '/apps/contract-deployer',
		status: 'active',
		color: '#F59E0B',
		featureKeys: [
			'tools.contract_deployer.feature_1',
			'tools.contract_deployer.feature_2',
			'tools.contract_deployer.feature_3'
		],
		stage: 'alpha'
	},
	{
		icon: Image,
		titleKey: 'tools.nft_deployer.title',
		descriptionKey: 'tools.nft_deployer.description',
		link: '/apps/nft-deployer',
		status: 'active',
		color: '#EC4899',
		featureKeys: [
			'tools.nft_deployer.feature_1',
			'tools.nft_deployer.feature_2',
			'tools.nft_deployer.feature_3'
		],
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
		icon: Search,
		titleKey: 'tools.contract_events_scanner.title',
		descriptionKey: 'tools.contract_events_scanner.description',
		link: '/apps/contract-events-scanner',
		status: 'active',
		color: '#A855F7',
		featureKeys: [
			'tools.contract_events_scanner.feature_1',
			'tools.contract_events_scanner.feature_2',
			'tools.contract_events_scanner.feature_3'
		],
		stage: 'alpha'
	},
	{
		icon: Zap,
		titleKey: 'tools.call_master.title',
		descriptionKey: 'tools.call_master.description',
		status: 'coming-soon',
		color: '#8B5CF6',
		featureKeys: [
			'tools.call_master.feature_1',
			'tools.call_master.feature_2',
			'tools.call_master.feature_3'
		],
		stage: 'coming-soon'
	},
	{
		icon: Globe,
		titleKey: 'tools.ens_scanner.title',
		descriptionKey: 'tools.ens_scanner.description',
		link: '/apps/ens-scanner',
		status: 'active',
		color: '#EC4899',
		features: ['Pattern Generation', 'Expiry Tracking', 'Batch Scanning'],
		stage: 'alpha'
	},
	{
		icon: KeyRound,
		titleKey: 'tools.wallet_generator.title',
		descriptionKey: 'tools.wallet_generator.description',
		link: '/apps/wallet-generator',
		status: 'active',
		color: '#8B5CF6',
		features: ['HD Path Support', 'Multiple Chains', 'Export to CSV/JSON'],
		stage: 'alpha'
	},
	{
		icon: TrendingUp,
		titleKey: 'tools.dex_moonshot_trader.title',
		descriptionKey: 'tools.dex_moonshot_trader.description',
		link: '/apps/dex-moonshot-trader',
		status: 'active',
		color: '#EF4444',
		features: ['Buy & Sell Tokens', 'Adjustable Slippage', 'Multi-Chain Support'],
		stage: 'alpha'
	},
	{
		icon: Folder,
		titleKey: 'tools.nft_manager.title',
		descriptionKey: 'tools.nft_manager.description',
		link: '/apps/nft-manager',
		status: 'active',
		color: '#A855F7',
		features: ['View NFT Collections', 'Owner & Stake Mint', 'Paginated Browsing'],
		stage: 'alpha'
	},
	{
		icon: Activity,
		titleKey: 'tools.assets_monitor.title',
		descriptionKey: 'tools.assets_monitor.description',
		link: '/apps/assets-monitor',
		status: 'active',
		color: '#06B6D4',
		featureKeys: [
			'tools.assets_monitor.feature_1',
			'tools.assets_monitor.feature_2',
			'tools.assets_monitor.feature_3'
		],
		stage: 'alpha'
	}
];
