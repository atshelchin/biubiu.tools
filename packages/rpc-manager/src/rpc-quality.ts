/**
 * RPC Quality Tracking
 *
 * Tracks RPC endpoint quality metrics (success rate, response time, etc.)
 * and persists them to localStorage for future use.
 */

import type {
	RPCQualityMetrics,
	StoredQualityData,
	RPCRecommendation,
	RPCHealthSummary,
	RPCQualityTrackerConfig
} from './types.js';

const DEFAULT_STORAGE_KEY = 'rpc_quality';
const DEFAULT_STORAGE_VERSION = 1;
const DEFAULT_MAX_AGE_DAYS = 30;

/**
 * Get storage key for an RPC endpoint
 */
function getKey(url: string, chainId: number): string {
	return `${chainId}:${url}`;
}

/**
 * Extract hostname from URL
 */
function getHostname(url: string): string {
	try {
		return new URL(url).hostname;
	} catch {
		return url;
	}
}

/**
 * RPC Quality Tracker
 *
 * Tracks and persists RPC quality metrics across sessions.
 */
export class RPCQualityTracker {
	private data: StoredQualityData;
	private pendingUpdates: Map<string, RPCQualityMetrics> = new Map();
	private saveDebounceTimer: ReturnType<typeof setTimeout> | null = null;
	private readonly storageKey: string;
	private readonly maxAgeDays: number;
	private readonly canPersist: () => boolean;

	constructor(config: RPCQualityTrackerConfig = {}) {
		this.storageKey = config.storageKey ?? DEFAULT_STORAGE_KEY;
		this.maxAgeDays = config.maxAgeDays ?? DEFAULT_MAX_AGE_DAYS;
		this.canPersist = config.canPersist ?? (() => true);
		this.data = this.loadQualityData();
	}

	/**
	 * Load quality data from localStorage
	 */
	private loadQualityData(): StoredQualityData {
		if (typeof window === 'undefined' || !this.canPersist()) {
			return { version: DEFAULT_STORAGE_VERSION, metrics: {} };
		}

		try {
			const stored = localStorage.getItem(this.storageKey);
			if (stored) {
				const data = JSON.parse(stored) as StoredQualityData;
				if (data.version === DEFAULT_STORAGE_VERSION) {
					// Clean up old entries
					const now = Date.now();
					const maxAge = this.maxAgeDays * 24 * 60 * 60 * 1000;
					for (const key of Object.keys(data.metrics)) {
						if (now - data.metrics[key].lastUpdated > maxAge) {
							delete data.metrics[key];
						}
					}
					return data;
				}
			}
		} catch (e) {
			console.warn('Failed to load RPC quality data:', e);
		}
		return { version: DEFAULT_STORAGE_VERSION, metrics: {} };
	}

	/**
	 * Save quality data to localStorage
	 */
	private saveQualityData(): void {
		if (typeof window === 'undefined' || !this.canPersist()) {
			return;
		}

		try {
			localStorage.setItem(this.storageKey, JSON.stringify(this.data));
		} catch (e) {
			console.warn('Failed to save RPC quality data:', e);
		}
	}

	/**
	 * Get metrics for an RPC endpoint
	 */
	getMetrics(url: string, chainId: number): RPCQualityMetrics | undefined {
		const key = getKey(url, chainId);
		return this.pendingUpdates.get(key) || this.data.metrics[key];
	}

	/**
	 * Get or create metrics for an RPC endpoint
	 */
	private getOrCreateMetrics(url: string, chainId: number): RPCQualityMetrics {
		const key = getKey(url, chainId);
		let metrics = this.pendingUpdates.get(key) || this.data.metrics[key];

		if (!metrics) {
			metrics = {
				url,
				chainId,
				successCount: 0,
				failCount: 0,
				avgResponseTime: 0,
				totalResponseTime: 0,
				rateLimitCount: 0,
				lastUpdated: Date.now()
			};
		}

		return { ...metrics };
	}

	/**
	 * Record a successful request
	 */
	recordSuccess(url: string, chainId: number, responseTimeMs: number): void {
		const metrics = this.getOrCreateMetrics(url, chainId);
		metrics.successCount++;
		metrics.totalResponseTime += responseTimeMs;
		metrics.avgResponseTime = metrics.totalResponseTime / metrics.successCount;
		metrics.lastUpdated = Date.now();
		metrics.lastSuccess = Date.now();

		this.queueUpdate(url, chainId, metrics);
	}

	/**
	 * Record a failed request
	 */
	recordFailure(url: string, chainId: number): void {
		const metrics = this.getOrCreateMetrics(url, chainId);
		metrics.failCount++;
		metrics.lastUpdated = Date.now();
		metrics.lastFailure = Date.now();

		this.queueUpdate(url, chainId, metrics);
	}

	/**
	 * Record a rate limit hit
	 */
	recordRateLimit(url: string, chainId: number): void {
		const metrics = this.getOrCreateMetrics(url, chainId);
		metrics.rateLimitCount++;
		metrics.failCount++;
		metrics.lastUpdated = Date.now();
		metrics.lastFailure = Date.now();

		this.queueUpdate(url, chainId, metrics);
	}

	/**
	 * Queue an update for debounced saving
	 */
	private queueUpdate(url: string, chainId: number, metrics: RPCQualityMetrics): void {
		const key = getKey(url, chainId);
		this.pendingUpdates.set(key, metrics);
		this.scheduleSave();
	}

	/**
	 * Schedule a debounced save
	 */
	private scheduleSave(): void {
		if (this.saveDebounceTimer) {
			clearTimeout(this.saveDebounceTimer);
		}
		this.saveDebounceTimer = setTimeout(() => {
			this.flush();
		}, 1000); // Save after 1 second of inactivity
	}

	/**
	 * Flush pending updates to storage
	 */
	flush(): void {
		if (this.saveDebounceTimer) {
			clearTimeout(this.saveDebounceTimer);
			this.saveDebounceTimer = null;
		}

		// Merge pending updates into data
		for (const [key, metrics] of this.pendingUpdates) {
			this.data.metrics[key] = metrics;
		}
		this.pendingUpdates.clear();

		// Save to localStorage
		this.saveQualityData();
	}

	/**
	 * Calculate success rate for an RPC
	 */
	getSuccessRate(url: string, chainId: number): number {
		const metrics = this.getMetrics(url, chainId);
		if (!metrics || metrics.successCount + metrics.failCount === 0) {
			return 0;
		}
		return metrics.successCount / (metrics.successCount + metrics.failCount);
	}

	/**
	 * Get quality score for an RPC (0-100)
	 * Considers success rate, response time, and rate limits
	 */
	getQualityScore(url: string, chainId: number): number {
		const metrics = this.getMetrics(url, chainId);
		if (!metrics || metrics.successCount + metrics.failCount === 0) {
			return 50; // Default score for unknown RPCs
		}

		const totalRequests = metrics.successCount + metrics.failCount;
		const successRate = metrics.successCount / totalRequests;

		// Weight factors
		const successWeight = 0.6;
		const responseTimeWeight = 0.3;
		const rateLimitWeight = 0.1;

		// Success rate score (0-100)
		const successScore = successRate * 100;

		// Response time score (faster = better, cap at 2000ms)
		const responseTimeScore = Math.max(0, 100 - (metrics.avgResponseTime / 2000) * 100);

		// Rate limit penalty (fewer = better)
		const rateLimitRate = metrics.rateLimitCount / totalRequests;
		const rateLimitScore = Math.max(0, 100 - rateLimitRate * 200);

		return Math.round(
			successScore * successWeight +
				responseTimeScore * responseTimeWeight +
				rateLimitScore * rateLimitWeight
		);
	}

	/**
	 * Get the best RPC for a chain based on quality metrics
	 * Returns undefined if no RPCs have been used for this chain
	 */
	getBestRPC(chainId: number): { url: string; score: number } | undefined {
		let bestUrl: string | undefined;
		let bestScore = -1;

		for (const metrics of Object.values(this.data.metrics)) {
			if (metrics.chainId !== chainId) continue;
			if (metrics.successCount + metrics.failCount < 5) continue; // Need at least 5 requests

			const score = this.getQualityScore(metrics.url, chainId);
			if (score > bestScore) {
				bestScore = score;
				bestUrl = metrics.url;
			}
		}

		return bestUrl ? { url: bestUrl, score: bestScore } : undefined;
	}

	/**
	 * Get all RPCs ranked by quality for a chain
	 */
	getRankedRPCs(
		chainId: number
	): Array<{ url: string; score: number; metrics: RPCQualityMetrics }> {
		const rpcs: Array<{ url: string; score: number; metrics: RPCQualityMetrics }> = [];

		for (const metrics of Object.values(this.data.metrics)) {
			if (metrics.chainId !== chainId) continue;

			rpcs.push({
				url: metrics.url,
				score: this.getQualityScore(metrics.url, chainId),
				metrics
			});
		}

		// Sort by score descending
		return rpcs.sort((a, b) => b.score - a.score);
	}

	/**
	 * Clear all quality data
	 */
	clear(): void {
		this.data = { version: DEFAULT_STORAGE_VERSION, metrics: {} };
		this.pendingUpdates.clear();
		if (typeof window !== 'undefined') {
			try {
				localStorage.removeItem(this.storageKey);
			} catch (e) {
				console.warn('Failed to clear RPC quality data:', e);
			}
		}
	}

	/**
	 * Clear quality data for a specific chain
	 */
	clearForChain(chainId: number): void {
		for (const key of Object.keys(this.data.metrics)) {
			if (this.data.metrics[key].chainId === chainId) {
				delete this.data.metrics[key];
			}
		}
		this.saveQualityData();
	}

	/**
	 * Export quality data for debugging
	 */
	exportData(): StoredQualityData {
		// Merge pending updates first
		const exportData = { ...this.data, metrics: { ...this.data.metrics } };
		for (const [key, metrics] of this.pendingUpdates) {
			exportData.metrics[key] = metrics;
		}
		return exportData;
	}

	/**
	 * Generate smart RPC recommendations based on quality data
	 */
	getRecommendations(chainId: number): RPCRecommendation[] {
		const recommendations: RPCRecommendation[] = [];
		const rankedRPCs = this.getRankedRPCs(chainId);

		if (rankedRPCs.length === 0) {
			// No data yet - recommend adding more RPCs
			recommendations.push({
				type: 'info',
				priority: 'medium',
				message: 'No RPC quality data yet. Start scanning to collect metrics.',
				actionable: false
			});
			return recommendations;
		}

		// Check for poor performing RPCs
		const poorRPCs = rankedRPCs.filter((r) => r.score < 40);
		const goodRPCs = rankedRPCs.filter((r) => r.score >= 70);

		// Recommendation: Replace poor RPCs
		for (const rpc of poorRPCs) {
			const successRate = this.getSuccessRate(rpc.url, chainId);
			const hostname = getHostname(rpc.url);

			if (rpc.metrics.rateLimitCount > 5) {
				recommendations.push({
					type: 'warning',
					priority: 'high',
					message: `${hostname} has frequent rate limits (${rpc.metrics.rateLimitCount} times). Consider using a private RPC.`,
					actionable: true,
					rpcUrl: rpc.url
				});
			} else if (successRate < 0.5) {
				recommendations.push({
					type: 'error',
					priority: 'high',
					message: `${hostname} has low success rate (${Math.round(successRate * 100)}%). Consider removing it.`,
					actionable: true,
					rpcUrl: rpc.url
				});
			} else if (rpc.metrics.avgResponseTime > 3000) {
				recommendations.push({
					type: 'warning',
					priority: 'medium',
					message: `${hostname} is slow (avg ${Math.round(rpc.metrics.avgResponseTime)}ms). Consider replacing it.`,
					actionable: true,
					rpcUrl: rpc.url
				});
			}
		}

		// Recommendation: Add more RPCs for redundancy
		if (goodRPCs.length < 2 && rankedRPCs.length < 3) {
			recommendations.push({
				type: 'info',
				priority: 'medium',
				message: 'Add more RPC endpoints for better reliability and parallel scanning.',
				actionable: false
			});
		}

		// Recommendation: Best RPC suggestion
		if (goodRPCs.length > 0) {
			const best = goodRPCs[0];
			const hostname = getHostname(best.url);
			recommendations.push({
				type: 'success',
				priority: 'low',
				message: `${hostname} is performing well (score: ${best.score}, avg: ${Math.round(best.metrics.avgResponseTime)}ms).`,
				actionable: false,
				rpcUrl: best.url
			});
		}

		// Check for all RPCs being rate limited recently
		const recentlyRateLimited = rankedRPCs.filter((r) => {
			const lastFailure = r.metrics.lastFailure || 0;
			const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
			return r.metrics.rateLimitCount > 0 && lastFailure > fiveMinutesAgo;
		});

		if (recentlyRateLimited.length === rankedRPCs.length && rankedRPCs.length > 0) {
			recommendations.push({
				type: 'error',
				priority: 'high',
				message: 'All RPCs are being rate limited. Wait a few minutes or add private RPCs.',
				actionable: false
			});
		}

		// Sort by priority
		const priorityOrder = { high: 0, medium: 1, low: 2 };
		recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

		return recommendations;
	}

	/**
	 * Get a summary of RPC health for a chain
	 */
	getHealthSummary(chainId: number): RPCHealthSummary {
		const rankedRPCs = this.getRankedRPCs(chainId);

		if (rankedRPCs.length === 0) {
			return {
				status: 'unknown',
				totalRPCs: 0,
				healthyRPCs: 0,
				averageScore: 0,
				averageResponseTime: 0,
				totalRequests: 0
			};
		}

		const healthyRPCs = rankedRPCs.filter((r) => r.score >= 60).length;
		const averageScore = Math.round(
			rankedRPCs.reduce((sum, r) => sum + r.score, 0) / rankedRPCs.length
		);
		const averageResponseTime = Math.round(
			rankedRPCs.reduce((sum, r) => sum + r.metrics.avgResponseTime, 0) / rankedRPCs.length
		);
		const totalRequests = rankedRPCs.reduce(
			(sum, r) => sum + r.metrics.successCount + r.metrics.failCount,
			0
		);

		let status: RPCHealthSummary['status'] = 'healthy';
		if (averageScore < 40 || healthyRPCs === 0) {
			status = 'degraded';
		} else if (averageScore < 60 || healthyRPCs < rankedRPCs.length / 2) {
			status = 'warning';
		}

		return {
			status,
			totalRPCs: rankedRPCs.length,
			healthyRPCs,
			averageScore,
			averageResponseTime,
			totalRequests
		};
	}
}

// Singleton instance
let qualityTracker: RPCQualityTracker | null = null;

/**
 * Get the singleton RPC quality tracker instance
 */
export function getRPCQualityTracker(config?: RPCQualityTrackerConfig): RPCQualityTracker {
	if (!qualityTracker) {
		qualityTracker = new RPCQualityTracker(config);
	}
	return qualityTracker;
}

/**
 * Create a new RPC quality tracker instance (non-singleton)
 */
export function createRPCQualityTracker(config?: RPCQualityTrackerConfig): RPCQualityTracker {
	return new RPCQualityTracker(config);
}
