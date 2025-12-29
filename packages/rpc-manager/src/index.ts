/**
 * @shelchin/rpc-manager
 *
 * RPC endpoint manager with rotation, rate limiting, health tracking, and quality metrics.
 */

// Main classes
export { RPCManager } from './rpc-manager.js';
export {
	RPCQualityTracker,
	getRPCQualityTracker,
	createRPCQualityTracker
} from './rpc-quality.js';

// Types
export type {
	RPCEndpoint,
	RPCStatus,
	RPCManagerConfig,
	RPCQualityMetrics,
	StoredQualityData,
	RPCRecommendation,
	RPCHealthSummary,
	RPCQualityTrackerConfig
} from './types.js';
