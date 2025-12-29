/**
 * @deprecated Use `@shelchin/rpc-manager` instead
 * This re-export is kept for backwards compatibility
 */
export {
	RPCQualityTracker,
	getRPCQualityTracker,
	createRPCQualityTracker
} from '@shelchin/rpc-manager';

export type {
	RPCQualityMetrics,
	StoredQualityData,
	RPCRecommendation,
	RPCHealthSummary,
	RPCQualityTrackerConfig
} from '@shelchin/rpc-manager';
