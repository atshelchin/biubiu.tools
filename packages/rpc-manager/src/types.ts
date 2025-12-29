/**
 * RPC Manager Types
 */

/**
 * RPC endpoint configuration
 */
export interface RPCEndpoint {
	/** RPC URL */
	url: string;
	/** Optional display name */
	name?: string;
	/** Priority (lower = higher priority) */
	priority?: number;
}

/**
 * Internal RPC status tracking
 */
export interface RPCStatus {
	endpoint: RPCEndpoint;
	isHealthy: boolean;
	failCount: number;
	lastFailure?: number;
	lastSuccess?: number;
	rateLimitedUntil?: number;
}

/**
 * RPC Manager configuration
 */
export interface RPCManagerConfig {
	/** Cooldown time after rate limit (ms), default: 30000 */
	rateLimitCooldown?: number;
	/** Max failures before marking unhealthy, default: 3 */
	maxFailCount?: number;
	/** Time before retrying unhealthy RPC (ms), default: 60000 */
	healthRecoveryTime?: number;
}

/**
 * Quality metrics for a single RPC endpoint
 */
export interface RPCQualityMetrics {
	url: string;
	chainId: number;
	/** Total number of successful requests */
	successCount: number;
	/** Total number of failed requests */
	failCount: number;
	/** Average response time in milliseconds */
	avgResponseTime: number;
	/** Total response time for calculating average */
	totalResponseTime: number;
	/** Number of rate limit hits */
	rateLimitCount: number;
	/** Last updated timestamp */
	lastUpdated: number;
	/** Last success timestamp */
	lastSuccess?: number;
	/** Last failure timestamp */
	lastFailure?: number;
}

/**
 * Stored quality data structure
 */
export interface StoredQualityData {
	version: number;
	metrics: Record<string, RPCQualityMetrics>;
}

/**
 * RPC recommendation type
 */
export interface RPCRecommendation {
	type: 'info' | 'warning' | 'error' | 'success';
	priority: 'high' | 'medium' | 'low';
	message: string;
	actionable: boolean;
	rpcUrl?: string;
}

/**
 * RPC health summary for a chain
 */
export interface RPCHealthSummary {
	status: 'healthy' | 'warning' | 'degraded' | 'unknown';
	totalRPCs: number;
	healthyRPCs: number;
	averageScore: number;
	averageResponseTime: number;
	totalRequests: number;
}

/**
 * Quality tracker configuration
 */
export interface RPCQualityTrackerConfig {
	/** Storage key for localStorage, default: 'rpc_quality' */
	storageKey?: string;
	/** Max age for metrics in days, default: 30 */
	maxAgeDays?: number;
	/** Custom function to check if persistence is allowed, default: () => true */
	canPersist?: () => boolean;
}
