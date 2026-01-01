/**
 * Roadmap Items Data
 * All tools with their development status and roadmap information
 */
import type { RoadmapItem } from '../types';

export const roadmapItems: RoadmapItem[] = [
	// ===== Alpha (2025-Q4) =====
	{
		id: 'chain-tools',
		nameKey: 'routes/home.chain-tools.title',
		descriptionKey: 'routes/home.chain-tools.description',
		link: '/apps/chain-tools',
		stage: 'alpha',
		nextStage: 'beta',
		expectedDate: '2025-Q4',
		stability: 'unstable',
		targetAudience: ['everyone'],
		recommendation: 'recommended',
		completionPercent: 80,
		color: '#06B6D4',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'chainlist',
		nameKey: 'routes/home.chainlist.title',
		descriptionKey: 'routes/home.chainlist.description',
		link: '/apps/chainlist',
		stage: 'alpha',
		nextStage: 'beta',
		expectedDate: '2025-Q4',
		stability: 'unstable',
		targetAudience: ['everyone'],
		recommendation: 'recommended',
		completionPercent: 75,
		color: '#6366F1',
		lastUpdated: '2026-01-01'
	},

	// ===== Development (2026-Q1) =====
	{
		id: 'one-to-many-transfer',
		nameKey: 'routes/home.one-to-many-transfer.title',
		descriptionKey: 'routes/home.one-to-many-transfer.description',
		link: '/apps/one-to-many-transfer',
		stage: 'development',
		nextStage: 'alpha',
		expectedDate: '2026-Q1',
		stability: 'unstable',
		targetAudience: ['early-adopter', 'developer'],
		recommendation: 'caution',
		completionPercent: 55,
		color: '#F59E0B',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'token-balance-scanner',
		nameKey: 'routes/home.token-balance-scanner.title',
		descriptionKey: 'routes/home.token-balance-scanner.description',
		link: '/apps/token-balance-scanner',
		stage: 'development',
		nextStage: 'alpha',
		expectedDate: '2026-Q1',
		stability: 'unstable',
		targetAudience: ['early-adopter', 'developer'],
		recommendation: 'caution',
		completionPercent: 60,
		color: '#3B82F6',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'wallet-sweep',
		nameKey: 'routes/home.wallet-sweep.title',
		descriptionKey: 'routes/home.wallet-sweep.description',
		link: '/apps/wallet-sweep',
		stage: 'development',
		nextStage: 'alpha',
		expectedDate: '2026-Q1',
		stability: 'unstable',
		targetAudience: ['early-adopter', 'developer'],
		recommendation: 'caution',
		completionPercent: 65,
		color: '#10B981',
		lastUpdated: '2026-01-01'
	},

	// ===== Planning (2026-Q2) =====
	{
		id: 'contract-deployer',
		nameKey: 'routes/home.contract-deployer.title',
		descriptionKey: 'routes/home.contract-deployer.description',
		link: '/apps/contract-deployer',
		stage: 'planning',
		nextStage: 'development',
		expectedDate: '2026-Q2',
		stability: 'experimental',
		targetAudience: ['developer'],
		recommendation: 'not-recommended',
		completionPercent: 30,
		color: '#F59E0B',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'contract-events-scanner',
		nameKey: 'routes/home.contract-events-scanner.title',
		descriptionKey: 'routes/home.contract-events-scanner.description',
		link: '/apps/contract-events-scanner',
		stage: 'planning',
		nextStage: 'development',
		expectedDate: '2026-Q2',
		stability: 'experimental',
		targetAudience: ['developer'],
		recommendation: 'not-recommended',
		completionPercent: 25,
		color: '#A855F7',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'call-master',
		nameKey: 'routes/home.call-master.title',
		descriptionKey: 'routes/home.call-master.description',
		link: '/apps/call-master',
		stage: 'planning',
		nextStage: 'development',
		expectedDate: '2026-Q2',
		stability: 'experimental',
		targetAudience: ['developer'],
		recommendation: 'not-recommended',
		completionPercent: 10,
		color: '#8B5CF6',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'wallet-generator',
		nameKey: 'routes/home.wallet-generator.title',
		descriptionKey: 'routes/home.wallet-generator.description',
		link: '/apps/wallet-generator',
		stage: 'planning',
		nextStage: 'development',
		expectedDate: '2026-Q2',
		stability: 'experimental',
		targetAudience: ['early-adopter', 'developer'],
		recommendation: 'not-recommended',
		completionPercent: 40,
		color: '#8B5CF6',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'dex-moonshot-trader',
		nameKey: 'routes/home.dex-moonshot-trader.title',
		descriptionKey: 'routes/home.dex-moonshot-trader.description',
		link: '/apps/dex-moonshot-trader',
		stage: 'planning',
		nextStage: 'development',
		expectedDate: '2026-Q2',
		stability: 'experimental',
		targetAudience: ['early-adopter'],
		recommendation: 'not-recommended',
		completionPercent: 20,
		color: '#EF4444',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'token-deployer',
		nameKey: 'routes/home.token-deployer.title',
		descriptionKey: 'routes/home.token-deployer.description',
		link: '/apps/token-deployer',
		stage: 'planning',
		nextStage: 'development',
		expectedDate: '2026-Q2',
		stability: 'experimental',
		targetAudience: ['developer'],
		recommendation: 'not-recommended',
		completionPercent: 35,
		color: '#10B981',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'nft-deployer',
		nameKey: 'routes/home.nft-deployer.title',
		descriptionKey: 'routes/home.nft-deployer.description',
		link: '/apps/nft-deployer',
		stage: 'planning',
		nextStage: 'development',
		expectedDate: '2026-Q2',
		stability: 'experimental',
		targetAudience: ['developer'],
		recommendation: 'not-recommended',
		completionPercent: 30,
		color: '#EC4899',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'ens-scanner',
		nameKey: 'routes/apps/ens-scanner.title',
		descriptionKey: 'routes/apps/ens-scanner.description',
		link: '/apps/ens-scanner',
		stage: 'planning',
		nextStage: 'development',
		expectedDate: '2026-Q2',
		stability: 'experimental',
		targetAudience: ['early-adopter'],
		recommendation: 'not-recommended',
		completionPercent: 25,
		color: '#EC4899',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'nft-manager',
		nameKey: 'tools.nft_manager.title',
		descriptionKey: 'tools.nft_manager.description',
		link: '/apps/nft-manager',
		stage: 'planning',
		nextStage: 'development',
		expectedDate: '2026-Q2',
		stability: 'experimental',
		targetAudience: ['early-adopter'],
		recommendation: 'not-recommended',
		completionPercent: 20,
		color: '#A855F7',
		lastUpdated: '2026-01-01'
	},
	{
		id: 'assets-monitor',
		nameKey: 'routes/apps/assets-monitor.title',
		descriptionKey: 'routes/apps/assets-monitor.description',
		link: '/apps/assets-monitor',
		stage: 'planning',
		nextStage: 'development',
		expectedDate: '2026-Q2',
		stability: 'experimental',
		targetAudience: ['early-adopter', 'power-user'],
		recommendation: 'not-recommended',
		completionPercent: 30,
		color: '#06B6D4',
		lastUpdated: '2026-01-01'
	}
];

/**
 * Get roadmap item by ID
 */
export function getRoadmapItem(id: string): RoadmapItem | undefined {
	return roadmapItems.find((item) => item.id === id);
}

/**
 * Get roadmap items by stage
 */
export function getRoadmapItemsByStage(stage: RoadmapItem['stage']): RoadmapItem[] {
	return roadmapItems.filter((item) => item.stage === stage);
}

/**
 * Get roadmap items sorted by completion
 */
export function getRoadmapItemsSortedByCompletion(): RoadmapItem[] {
	return [...roadmapItems].sort((a, b) => b.completionPercent - a.completionPercent);
}

/**
 * Tool card stage type used by homepage
 */
export type ToolCardStage = 'coming-soon' | 'alpha' | 'beta' | 'stable' | 'new';

/**
 * Tool status type used by step-based-app (status-badge.svelte)
 */
export type ToolStatus = 'coming_soon' | 'alpha' | 'beta' | 'stable' | 'new' | 'deprecated';

/**
 * Convert DevStage to tool card stage format (for homepage cards)
 */
export function devStageToToolCardStage(stage: RoadmapItem['stage']): ToolCardStage {
	switch (stage) {
		case 'planning':
		case 'development':
			return 'coming-soon';
		case 'alpha':
			return 'alpha';
		case 'beta':
			return 'beta';
		case 'stable':
			return 'stable';
		case 'deprecated':
			return 'stable'; // deprecated tools are still considered stable
		default:
			return 'coming-soon';
	}
}

/**
 * Convert DevStage to ToolStatus format (for development notice in tool pages)
 */
export function devStageToToolStatus(stage: RoadmapItem['stage']): ToolStatus {
	switch (stage) {
		case 'planning':
		case 'development':
			return 'coming_soon';
		case 'alpha':
			return 'alpha';
		case 'beta':
			return 'beta';
		case 'stable':
			return 'stable';
		case 'deprecated':
			return 'deprecated';
		default:
			return 'coming_soon';
	}
}

/**
 * Get tool card status from roadmap (active/coming-soon)
 */
export function getToolStatus(id: string): 'active' | 'coming-soon' {
	const item = getRoadmapItem(id);
	if (!item) return 'active';
	// planning stage means coming-soon, others are active
	return item.stage === 'planning' ? 'coming-soon' : 'active';
}

/**
 * Get tool card stage from roadmap
 */
export function getToolStage(id: string): ToolCardStage | undefined {
	const item = getRoadmapItem(id);
	if (!item) return undefined;
	return devStageToToolCardStage(item.stage);
}

/**
 * Get tool page status from roadmap (for development notice)
 */
export function getToolPageStatus(id: string): ToolStatus | undefined {
	const item = getRoadmapItem(id);
	if (!item) return undefined;
	return devStageToToolStatus(item.stage);
}

/**
 * Get roadmap item by link path
 */
export function getRoadmapItemByLink(link: string): RoadmapItem | undefined {
	return roadmapItems.find((item) => item.link === link);
}
