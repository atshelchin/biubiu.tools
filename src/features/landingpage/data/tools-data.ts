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
	Link2,
	Folder,
	Activity
} from '@lucide/svelte';
import type { Component } from 'svelte';
import { getToolStatus, getToolStage, type ToolCardStage } from '../../roadmap/data/roadmap-items';

export interface Tool {
	icon: Component;
	titleKey: string;
	descriptionKey: string;
	link?: string;
	status: 'active' | 'coming-soon';
	color: string;
	featureKeys?: string[];
	features?: string[];
	stage?: ToolCardStage;
}

export const TELEGRAM_GROUP_LINK = 'https://t.me/+ABMpMG1islA4NTVl';

/**
 * Helper to create tool config with roadmap-based status
 */
function createTool(
	id: string,
	config: Omit<Tool, 'status' | 'stage'> & { status?: Tool['status']; stage?: Tool['stage'] }
): Tool {
	return {
		...config,
		status: config.status ?? getToolStatus(id),
		stage: config.stage ?? getToolStage(id)
	};
}

export const toolsConfig: Tool[] = [
	// Status and stage are automatically derived from roadmap data
	createTool('one-to-many-transfer', {
		icon: SendHorizontal,
		titleKey: 'routes/home.one-to-many-transfer.title',
		descriptionKey: 'routes/home.one-to-many-transfer.description',
		link: '/apps/one-to-many-transfer',
		color: '#F59E0B',
		featureKeys: [
			'routes/home.one-to-many-transfer.features.0',
			'routes/home.one-to-many-transfer.features.1',
			'routes/home.one-to-many-transfer.features.2'
		]
	}),
	createTool('token-balance-scanner', {
		icon: ScanSearch,
		titleKey: 'routes/home.token-balance-scanner.title',
		descriptionKey: 'routes/home.token-balance-scanner.description',
		link: '/apps/token-balance-scanner',
		color: '#3B82F6',
		featureKeys: [
			'routes/home.token-balance-scanner.features.0',
			'routes/home.token-balance-scanner.features.1',
			'routes/home.token-balance-scanner.features.2',
			'routes/home.token-balance-scanner.features.3'
		]
	}),
	createTool('wallet-sweep', {
		icon: ArrowRightLeft,
		titleKey: 'routes/home.wallet-sweep.title',
		descriptionKey: 'routes/home.wallet-sweep.description',
		link: '/apps/wallet-sweep',
		color: '#10B981',
		featureKeys: [
			'routes/home.wallet-sweep.features.0',
			'routes/home.wallet-sweep.features.1',
			'routes/home.wallet-sweep.features.2',
			'routes/home.wallet-sweep.features.3'
		]
	}),
	createTool('contract-deployer', {
		icon: Rocket,
		titleKey: 'routes/home.contract-deployer.title',
		descriptionKey: 'routes/home.contract-deployer.description',
		link: '/apps/contract-deployer',
		color: '#F59E0B',
		featureKeys: [
			'routes/home.contract-deployer.features.0',
			'routes/home.contract-deployer.features.1',
			'routes/home.contract-deployer.features.2'
		]
	}),
	createTool('contract-events-scanner', {
		icon: Search,
		titleKey: 'routes/home.contract-events-scanner.title',
		descriptionKey: 'routes/home.contract-events-scanner.description',
		link: '/apps/contract-events-scanner',
		color: '#A855F7',
		featureKeys: [
			'routes/home.contract-events-scanner.features.0',
			'routes/home.contract-events-scanner.features.1',
			'routes/home.contract-events-scanner.features.2'
		]
	}),
	createTool('call-master', {
		icon: Zap,
		titleKey: 'routes/home.call-master.title',
		descriptionKey: 'routes/home.call-master.description',
		color: '#8B5CF6',
		featureKeys: [
			'routes/home.call-master.features.0',
			'routes/home.call-master.features.1',
			'routes/home.call-master.features.2'
		]
	}),
	createTool('wallet-generator', {
		icon: KeyRound,
		titleKey: 'routes/home.wallet-generator.title',
		descriptionKey: 'routes/home.wallet-generator.description',
		link: '/apps/wallet-generator',
		color: '#8B5CF6',
		featureKeys: [
			'routes/home.wallet-generator.features.0',
			'routes/home.wallet-generator.features.1',
			'routes/home.wallet-generator.features.2'
		]
	}),
	createTool('dex-moonshot-trader', {
		icon: TrendingUp,
		titleKey: 'routes/home.dex-moonshot-trader.title',
		descriptionKey: 'routes/home.dex-moonshot-trader.description',
		link: '/apps/dex-moonshot-trader',
		color: '#EF4444',
		featureKeys: [
			'routes/home.dex-moonshot-trader.features.0',
			'routes/home.dex-moonshot-trader.features.1',
			'routes/home.dex-moonshot-trader.features.2'
		]
	}),
	// Feedback card - not in roadmap, manually set status
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
	createTool('token-deployer', {
		icon: Sparkles,
		titleKey: 'routes/home.token-deployer.title',
		descriptionKey: 'routes/home.token-deployer.description',
		link: '/apps/token-deployer',
		color: '#10B981',
		featureKeys: [
			'routes/home.token-deployer.features.0',
			'routes/home.token-deployer.features.1',
			'routes/home.token-deployer.features.2'
		]
	}),
	createTool('nft-deployer', {
		icon: Image,
		titleKey: 'routes/home.nft-deployer.title',
		descriptionKey: 'routes/home.nft-deployer.description',
		link: '/apps/nft-deployer',
		color: '#EC4899',
		featureKeys: [
			'routes/home.nft-deployer.features.0',
			'routes/home.nft-deployer.features.1',
			'routes/home.nft-deployer.features.2'
		]
	}),
	createTool('chainlist', {
		icon: Globe,
		titleKey: 'routes/home.chainlist.title',
		descriptionKey: 'routes/home.chainlist.description',
		link: '/apps/chainlist',
		color: '#6366F1',
		featureKeys: [
			'routes/home.chainlist.features.0',
			'routes/home.chainlist.features.1',
			'routes/home.chainlist.features.2'
		]
	}),
	createTool('chain-tools', {
		icon: Link2,
		titleKey: 'routes/home.chain-tools.title',
		descriptionKey: 'routes/home.chain-tools.description',
		link: '/apps/chain-tools',
		color: '#06B6D4',
		featureKeys: [
			'routes/home.chain-tools.features.0',
			'routes/home.chain-tools.features.1',
			'routes/home.chain-tools.features.2'
		]
	}),
	createTool('ens-scanner', {
		icon: Globe,
		titleKey: 'routes/apps/ens-scanner.title',
		descriptionKey: 'routes/apps/ens-scanner.description',
		link: '/apps/ens-scanner',
		color: '#EC4899',
		features: ['Pattern Generation', 'Expiry Tracking', 'Batch Scanning']
	}),
	createTool('nft-manager', {
		icon: Folder,
		titleKey: 'tools.nft_manager.title',
		descriptionKey: 'tools.nft_manager.description',
		link: '/apps/nft-manager',
		color: '#A855F7',
		features: ['View NFT Collections', 'Owner & Stake Mint', 'Paginated Browsing']
	}),
	createTool('assets-monitor', {
		icon: Activity,
		titleKey: 'routes/apps/assets-monitor.title',
		descriptionKey: 'routes/apps/assets-monitor.description',
		link: '/apps/assets-monitor',
		color: '#06B6D4',
		featureKeys: [
			'routes/apps/assets-monitor.feature_1',
			'routes/apps/assets-monitor.feature_2',
			'routes/apps/assets-monitor.feature_3'
		]
	})
];
