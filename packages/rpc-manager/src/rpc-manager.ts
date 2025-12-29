/**
 * RPC Manager
 *
 * Handles RPC endpoint rotation, rate limiting, and health tracking.
 * Automatically rotates to healthy RPCs when one fails.
 */

import type { RPCEndpoint, RPCStatus, RPCManagerConfig } from './types.js';

const DEFAULT_RATE_LIMIT_COOLDOWN = 30000; // 30 seconds cooldown after rate limit
const DEFAULT_MAX_FAIL_COUNT = 3; // Mark as unhealthy after 3 consecutive failures
const DEFAULT_HEALTH_RECOVERY_TIME = 60000; // Try unhealthy RPC again after 1 minute

export class RPCManager {
	private endpoints: RPCStatus[];
	private currentIndex: number = 0;
	private readonly rateLimitCooldown: number;
	private readonly maxFailCount: number;
	private readonly healthRecoveryTime: number;

	constructor(rpcEndpoints: RPCEndpoint[], config: RPCManagerConfig = {}) {
		if (rpcEndpoints.length === 0) {
			throw new Error('At least one RPC endpoint is required');
		}

		this.rateLimitCooldown = config.rateLimitCooldown ?? DEFAULT_RATE_LIMIT_COOLDOWN;
		this.maxFailCount = config.maxFailCount ?? DEFAULT_MAX_FAIL_COUNT;
		this.healthRecoveryTime = config.healthRecoveryTime ?? DEFAULT_HEALTH_RECOVERY_TIME;

		// Sort by priority (lower = higher priority)
		const sorted = [...rpcEndpoints].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));

		this.endpoints = sorted.map((endpoint) => ({
			endpoint,
			isHealthy: true,
			failCount: 0
		}));
	}

	/**
	 * Get the current RPC URL to use
	 */
	getCurrentRPC(): string {
		return this.endpoints[this.currentIndex].endpoint.url;
	}

	/**
	 * Get current RPC name for logging
	 */
	getCurrentRPCName(): string {
		const status = this.endpoints[this.currentIndex];
		return status.endpoint.name || new URL(status.endpoint.url).hostname;
	}

	/**
	 * Mark current RPC as successful
	 */
	markSuccess(): void {
		const status = this.endpoints[this.currentIndex];
		status.failCount = 0;
		status.isHealthy = true;
		status.lastSuccess = Date.now();
	}

	/**
	 * Mark current RPC as failed and potentially rotate
	 * @returns true if rotated to a new RPC, false if no healthy RPCs available
	 */
	markFailed(): boolean {
		const status = this.endpoints[this.currentIndex];
		status.failCount++;
		status.lastFailure = Date.now();

		if (status.failCount >= this.maxFailCount) {
			status.isHealthy = false;
			console.log(
				`❌ RPC ${this.getCurrentRPCName()} marked as unhealthy after ${this.maxFailCount} failures`
			);
		}

		return this.rotateToHealthy();
	}

	/**
	 * Mark current RPC as rate limited
	 * @returns true if rotated to a new RPC, false if no healthy RPCs available
	 */
	markRateLimited(): boolean {
		const status = this.endpoints[this.currentIndex];
		status.rateLimitedUntil = Date.now() + this.rateLimitCooldown;
		status.isHealthy = false;
		status.failCount = this.maxFailCount; // Immediately mark as unhealthy

		console.log(
			`⚠️ RPC ${this.getCurrentRPCName()} rate limited, cooldown until ${new Date(status.rateLimitedUntil).toLocaleTimeString()}`
		);

		return this.rotateToHealthy();
	}

	/**
	 * Rotate to the next healthy RPC
	 * @returns true if found a healthy RPC, false if all exhausted
	 */
	private rotateToHealthy(): boolean {
		const now = Date.now();

		// First, check if any rate-limited RPCs have recovered
		for (const status of this.endpoints) {
			if (status.rateLimitedUntil && status.rateLimitedUntil < now) {
				status.rateLimitedUntil = undefined;
				status.isHealthy = true;
				status.failCount = 0;
				console.log(
					`🔄 RPC ${status.endpoint.name || status.endpoint.url} recovered from rate limit`
				);
			}

			// Also check if unhealthy RPCs should be retried
			if (
				!status.isHealthy &&
				status.lastFailure &&
				now - status.lastFailure > this.healthRecoveryTime
			) {
				status.isHealthy = true;
				status.failCount = 0;
				console.log(`🔄 RPC ${status.endpoint.name || status.endpoint.url} health check reset`);
			}
		}

		// Find next healthy RPC
		const startIndex = this.currentIndex;
		for (let i = 0; i < this.endpoints.length; i++) {
			const nextIndex = (startIndex + i + 1) % this.endpoints.length;
			const status = this.endpoints[nextIndex];

			if (status.isHealthy && (!status.rateLimitedUntil || status.rateLimitedUntil < now)) {
				if (nextIndex !== this.currentIndex) {
					this.currentIndex = nextIndex;
					console.log(`🔀 Switched to RPC: ${this.getCurrentRPCName()}`);
				}
				return true;
			}
		}

		console.log('⚠️ All RPCs are currently unhealthy or rate limited');
		return false;
	}

	/**
	 * Check if all RPCs are exhausted
	 */
	isAllExhausted(): boolean {
		const now = Date.now();
		return this.endpoints.every(
			(status) => !status.isHealthy || (status.rateLimitedUntil && status.rateLimitedUntil > now)
		);
	}

	/**
	 * Get estimated wait time until an RPC becomes available
	 */
	getWaitTimeUntilAvailable(): number {
		const now = Date.now();
		let minWait = Infinity;

		for (const status of this.endpoints) {
			if (status.rateLimitedUntil && status.rateLimitedUntil > now) {
				minWait = Math.min(minWait, status.rateLimitedUntil - now);
			} else if (!status.isHealthy && status.lastFailure) {
				const recoveryTime = status.lastFailure + this.healthRecoveryTime - now;
				if (recoveryTime > 0) {
					minWait = Math.min(minWait, recoveryTime);
				}
			}
		}

		return minWait === Infinity ? 0 : minWait;
	}

	/**
	 * Wait until an RPC becomes available (with timeout)
	 */
	async waitForAvailableRPC(maxWait: number = 60000): Promise<boolean> {
		const waitTime = Math.min(this.getWaitTimeUntilAvailable(), maxWait);

		if (waitTime <= 0) {
			return this.rotateToHealthy();
		}

		console.log(`⏳ Waiting ${Math.round(waitTime / 1000)}s for RPC to become available...`);
		await new Promise((resolve) => setTimeout(resolve, waitTime));

		return this.rotateToHealthy();
	}

	/**
	 * Get status report for logging
	 */
	getStatusReport(): string {
		const now = Date.now();
		const lines = ['📊 RPC Status:'];

		for (let i = 0; i < this.endpoints.length; i++) {
			const status = this.endpoints[i];
			const name = status.endpoint.name || new URL(status.endpoint.url).hostname;
			const current = i === this.currentIndex ? '→ ' : '  ';

			let state = '✅ healthy';
			if (status.rateLimitedUntil && status.rateLimitedUntil > now) {
				const remaining = Math.round((status.rateLimitedUntil - now) / 1000);
				state = `⏳ rate limited (${remaining}s)`;
			} else if (!status.isHealthy) {
				state = `❌ unhealthy (${status.failCount} failures)`;
			}

			lines.push(`${current}${name}: ${state}`);
		}

		return lines.join('\n');
	}

	/**
	 * Get number of healthy RPCs
	 */
	getHealthyCount(): number {
		const now = Date.now();
		return this.endpoints.filter(
			(s) => s.isHealthy && (!s.rateLimitedUntil || s.rateLimitedUntil < now)
		).length;
	}

	/**
	 * Get total number of RPCs
	 */
	getTotalCount(): number {
		return this.endpoints.length;
	}

	/**
	 * Check if there's at least one healthy RPC available
	 */
	hasHealthyRPC(): boolean {
		return this.getHealthyCount() > 0;
	}

	/**
	 * Reset all RPCs to healthy state (for auto-recovery)
	 * This gives all RPCs a fresh chance after waiting
	 */
	resetAllRPCs(): void {
		console.log('🔄 Resetting all RPCs to healthy state');
		for (const status of this.endpoints) {
			status.isHealthy = true;
			status.failCount = 0;
			status.rateLimitedUntil = undefined;
		}
		this.currentIndex = 0;
	}
}
