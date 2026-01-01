/**
 * Platform Stats Store
 *
 * Manages platform statistics state with Svelte 5 runes
 */

import { queryPlatformStats, formatStatNumber } from './stats-service';
import type { PlatformStats, ChainContractStats, ActivityEvent, ActivityEventType } from './types';

// Demo data for preview when no real data is available
const DEMO_TOP_NETWORKS: ChainContractStats[] = [
	{
		chainId: 1,
		chainName: 'Ethereum',
		nativeSymbol: 'ETH',
		biubiuPremium: { deployed: true, totalSupply: 45n },
		tokenFactory: { deployed: true, totalUsage: 1250n },
		nftFactory: { deployed: true, totalUsage: 890n },
		tokenDistribution: { deployed: true, totalUsage: 2340n },
		tokenSweep: { deployed: true, totalUsage: 1560n },
		totalToolUsage: 6040n,
		deployedContractCount: 5,
		lastUpdated: Date.now()
	},
	{
		chainId: 56,
		chainName: 'BNB Chain',
		nativeSymbol: 'BNB',
		biubiuPremium: { deployed: true, totalSupply: 38n },
		tokenFactory: { deployed: true, totalUsage: 980n },
		nftFactory: { deployed: true, totalUsage: 720n },
		tokenDistribution: { deployed: true, totalUsage: 1890n },
		tokenSweep: { deployed: true, totalUsage: 1230n },
		totalToolUsage: 4820n,
		deployedContractCount: 5,
		lastUpdated: Date.now()
	},
	{
		chainId: 137,
		chainName: 'Polygon',
		nativeSymbol: 'MATIC',
		biubiuPremium: { deployed: true, totalSupply: 29n },
		tokenFactory: { deployed: true, totalUsage: 760n },
		nftFactory: { deployed: true, totalUsage: 540n },
		tokenDistribution: { deployed: true, totalUsage: 1450n },
		tokenSweep: { deployed: true, totalUsage: 980n },
		totalToolUsage: 3730n,
		deployedContractCount: 5,
		lastUpdated: Date.now()
	},
	{
		chainId: 42161,
		chainName: 'Arbitrum',
		nativeSymbol: 'ETH',
		biubiuPremium: { deployed: true, totalSupply: 22n },
		tokenFactory: { deployed: true, totalUsage: 650n },
		nftFactory: { deployed: true, totalUsage: 420n },
		tokenDistribution: { deployed: true, totalUsage: 1120n },
		tokenSweep: { deployed: true, totalUsage: 780n },
		totalToolUsage: 2970n,
		deployedContractCount: 5,
		lastUpdated: Date.now()
	},
	{
		chainId: 10,
		chainName: 'Optimism',
		nativeSymbol: 'ETH',
		biubiuPremium: { deployed: true, totalSupply: 18n },
		tokenFactory: { deployed: true, totalUsage: 520n },
		nftFactory: { deployed: true, totalUsage: 380n },
		tokenDistribution: { deployed: true, totalUsage: 890n },
		tokenSweep: { deployed: true, totalUsage: 650n },
		totalToolUsage: 2440n,
		deployedContractCount: 5,
		lastUpdated: Date.now()
	},
	{
		chainId: 8453,
		chainName: 'Base',
		nativeSymbol: 'ETH',
		biubiuPremium: { deployed: true, totalSupply: 15n },
		tokenFactory: { deployed: true, totalUsage: 430n },
		nftFactory: { deployed: true, totalUsage: 290n },
		tokenDistribution: { deployed: true, totalUsage: 720n },
		tokenSweep: { deployed: true, totalUsage: 510n },
		totalToolUsage: 1950n,
		deployedContractCount: 5,
		lastUpdated: Date.now()
	},
	{
		chainId: 43114,
		chainName: 'Avalanche',
		nativeSymbol: 'AVAX',
		biubiuPremium: { deployed: true, totalSupply: 12n },
		tokenFactory: { deployed: true, totalUsage: 340n },
		nftFactory: { deployed: true, totalUsage: 210n },
		tokenDistribution: { deployed: true, totalUsage: 580n },
		tokenSweep: { deployed: true, totalUsage: 390n },
		totalToolUsage: 1520n,
		deployedContractCount: 5,
		lastUpdated: Date.now()
	},
	{
		chainId: 250,
		chainName: 'Fantom',
		nativeSymbol: 'FTM',
		biubiuPremium: { deployed: true, totalSupply: 8n },
		tokenFactory: { deployed: true, totalUsage: 220n },
		nftFactory: { deployed: true, totalUsage: 150n },
		tokenDistribution: { deployed: true, totalUsage: 410n },
		tokenSweep: { deployed: true, totalUsage: 280n },
		totalToolUsage: 1060n,
		deployedContractCount: 5,
		lastUpdated: Date.now()
	}
];

// Initial state with demo data for preview
const INITIAL_STATS: PlatformStats = {
	totalPremiumSubscribers: 187n,
	totalToolUsage: 24530n,
	totalFreeUsage: 18200n,
	totalPremiumUsage: 4850n,
	totalPaidUsage: 1480n,
	activeNetworks: 8,
	totalNetworksChecked: 50,
	topNetworks: DEMO_TOP_NETWORKS,
	lastUpdated: Date.now(),
	isLoading: false
};

// Store state
let stats = $state<PlatformStats>(INITIAL_STATS);
let loadingProgress = $state({ completed: 0, total: 0 });
let refreshCooldown = $state(false);
let activityEvents = $state<ActivityEvent[]>([]);

// Simulated activity events for demo (when no real events)
const DEMO_EVENTS: Array<{
	type: ActivityEventType;
	chainId: number;
	chainName: string;
	chainIcon: string;
}> = [
	{ type: 'token_created', chainId: 1, chainName: 'Ethereum', chainIcon: 'ethereum' },
	{ type: 'nft_created', chainId: 56, chainName: 'BNB Chain', chainIcon: 'bnb' },
	{ type: 'distribution', chainId: 137, chainName: 'Polygon', chainIcon: 'polygon' },
	{ type: 'sweep', chainId: 42161, chainName: 'Arbitrum', chainIcon: 'arbitrum' },
	{ type: 'subscription', chainId: 1, chainName: 'Ethereum', chainIcon: 'ethereum' },
	{ type: 'token_created', chainId: 8453, chainName: 'Base', chainIcon: 'base' },
	{ type: 'distribution', chainId: 10, chainName: 'Optimism', chainIcon: 'optimism' },
	{ type: 'nft_created', chainId: 43114, chainName: 'Avalanche', chainIcon: 'avalanche' },
	{ type: 'sweep', chainId: 56, chainName: 'BNB Chain', chainIcon: 'bnb' },
	{ type: 'token_created', chainId: 137, chainName: 'Polygon', chainIcon: 'polygon' }
];

/**
 * Generate a random activity event for demo purposes
 */
function generateDemoEvent(): ActivityEvent {
	const template = DEMO_EVENTS[Math.floor(Math.random() * DEMO_EVENTS.length)];
	const now = Date.now();
	// Random time within last 2 minutes
	const timestamp = now - Math.floor(Math.random() * 120000);

	return {
		id: `demo-${now}-${Math.random().toString(36).slice(2, 8)}`,
		type: template.type,
		chainId: template.chainId,
		chainName: template.chainName,
		chainIcon: template.chainIcon,
		timestamp
	};
}

/**
 * Start demo activity simulation
 */
let demoInterval: ReturnType<typeof setInterval> | null = null;

function startDemoActivity() {
	if (demoInterval) return;

	// Generate initial events
	const initialEvents: ActivityEvent[] = [];
	for (let i = 0; i < 5; i++) {
		initialEvents.push(generateDemoEvent());
	}
	// Sort by timestamp descending
	initialEvents.sort((a, b) => b.timestamp - a.timestamp);
	activityEvents = initialEvents;

	// Add new events periodically (every 3-8 seconds)
	demoInterval = setInterval(
		() => {
			const newEvent = generateDemoEvent();
			newEvent.timestamp = Date.now(); // New event is "now"

			// Add to front, keep max 10 events
			activityEvents = [newEvent, ...activityEvents.slice(0, 9)];
		},
		3000 + Math.random() * 5000
	);
}

function stopDemoActivity() {
	if (demoInterval) {
		clearInterval(demoInterval);
		demoInterval = null;
	}
}

/**
 * Load platform stats
 */
async function loadStats(): Promise<void> {
	if (stats.isLoading) return;

	stats = { ...stats, isLoading: true, error: undefined };
	loadingProgress = { completed: 0, total: 0 };

	try {
		const result = await queryPlatformStats(
			{ maxChains: 50, concurrency: 10 },
			(completed, total) => {
				loadingProgress = { completed, total };
			}
		);

		stats = result;

		// Start demo activity after loading stats
		startDemoActivity();
	} catch (error) {
		stats = {
			...stats,
			isLoading: false,
			error: error instanceof Error ? error.message : 'Failed to load stats'
		};
	}
}

/**
 * Refresh stats with cooldown
 */
async function refreshStats(): Promise<void> {
	if (refreshCooldown || stats.isLoading) return;

	// Set cooldown (30 seconds)
	refreshCooldown = true;
	setTimeout(() => {
		refreshCooldown = false;
	}, 30000);

	await loadStats();
}

/**
 * Get formatted stats for display
 */
function getFormattedStats() {
	return {
		premiumSubscribers: formatStatNumber(stats.totalPremiumSubscribers),
		toolUsage: formatStatNumber(stats.totalToolUsage),
		activeNetworks: stats.activeNetworks.toString(),
		freeUsage: formatStatNumber(stats.totalFreeUsage),
		premiumUsage: formatStatNumber(stats.totalPremiumUsage),
		paidUsage: formatStatNumber(stats.totalPaidUsage)
	};
}

/**
 * Get relative time string
 */
function getRelativeTime(timestamp: number): string {
	const seconds = Math.floor((Date.now() - timestamp) / 1000);

	if (seconds < 5) return 'just now';
	if (seconds < 60) return `${seconds}s ago`;
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
	return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Get activity event icon and label
 */
function getEventDisplay(type: ActivityEventType): { icon: string; label: string } {
	switch (type) {
		case 'subscription':
			return { icon: '🎉', label: 'New Premium subscriber' };
		case 'token_created':
			return { icon: '🪙', label: 'Token created' };
		case 'nft_created':
			return { icon: '🖼️', label: 'NFT deployed' };
		case 'distribution':
			return { icon: '📤', label: 'Batch distribution' };
		case 'sweep':
			return { icon: '🧹', label: 'Token sweep' };
	}
}

/**
 * Export store interface
 */
export function useStatsStore() {
	return {
		// State (getters for reactivity)
		get stats() {
			return stats;
		},
		get loadingProgress() {
			return loadingProgress;
		},
		get refreshCooldown() {
			return refreshCooldown;
		},
		get activityEvents() {
			return activityEvents;
		},
		get formattedStats() {
			return getFormattedStats();
		},

		// Actions
		loadStats,
		refreshStats,

		// Utilities
		getRelativeTime,
		getEventDisplay,
		formatStatNumber,

		// Cleanup
		cleanup: stopDemoActivity
	};
}
