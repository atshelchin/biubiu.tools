/**
 * Stats module exports
 */

export { useStatsStore } from './stats-store.svelte';
export { queryPlatformStats, formatStatNumber } from './stats-service';
export type {
	PlatformStats,
	ChainContractStats,
	ContractStats,
	ActivityEvent,
	ActivityEventType,
	StatsQueryConfig
} from './types';
export { CONTRACT_ADDRESSES, DEFAULT_STATS_CONFIG } from './types';
