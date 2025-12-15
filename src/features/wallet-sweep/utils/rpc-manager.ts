/**
 * RPC Manager for handling rate limits and automatic failover
 */

export interface RPCEndpoint {
	url: string;
	isPrimary: boolean;
}

interface RPCStatus {
	url: string;
	isRateLimited: boolean;
	rateLimitTime?: number; // Timestamp when rate limit was detected
	failCount: number;
}

const RATE_LIMIT_COOLDOWN = 60000; // 60 seconds cooldown after rate limit
const MAX_FAIL_COUNT = 3; // Max consecutive failures before marking as bad

export class RPCManager {
	private endpoints: RPCEndpoint[];
	private statusMap: Map<string, RPCStatus>;
	private currentIndex: number;

	constructor(endpoints: RPCEndpoint[]) {
		this.endpoints = endpoints;
		this.statusMap = new Map();
		this.currentIndex = 0;

		// Initialize status for all endpoints
		endpoints.forEach((ep) => {
			this.statusMap.set(ep.url, {
				url: ep.url,
				isRateLimited: false,
				failCount: 0
			});
		});

		// Start with primary endpoint if available
		const primaryIndex = endpoints.findIndex((ep) => ep.isPrimary);
		if (primaryIndex >= 0) {
			this.currentIndex = primaryIndex;
		}
	}

	/**
	 * Get current RPC URL
	 */
	getCurrentRPC(): string {
		return this.endpoints[this.currentIndex].url;
	}

	/**
	 * Get all available (not rate limited) RPC URLs
	 */
	getAvailableRPCs(): string[] {
		const now = Date.now();
		return this.endpoints
			.filter((ep) => {
				const status = this.statusMap.get(ep.url);
				if (!status) return true;

				// Check if cooldown period has passed
				if (status.isRateLimited && status.rateLimitTime) {
					const timeSinceLimit = now - status.rateLimitTime;
					if (timeSinceLimit > RATE_LIMIT_COOLDOWN) {
						// Cooldown period passed, reset rate limit
						status.isRateLimited = false;
						status.rateLimitTime = undefined;
						status.failCount = 0;
						return true;
					}
					return false;
				}

				// Check if too many failures
				return status.failCount < MAX_FAIL_COUNT;
			})
			.map((ep) => ep.url);
	}

	/**
	 * Mark current RPC as rate limited and switch to next available
	 * Returns true if switched successfully, false if all RPCs are rate limited
	 */
	markRateLimitedAndSwitch(): boolean {
		const currentUrl = this.getCurrentRPC();
		const status = this.statusMap.get(currentUrl);

		if (status) {
			status.isRateLimited = true;
			status.rateLimitTime = Date.now();
			status.failCount++;
			console.log(`⚠️ RPC ${currentUrl} marked as rate limited (fail count: ${status.failCount})`);
		}

		return this.switchToNextAvailable();
	}

	/**
	 * Mark current RPC as failed (non-rate-limit error)
	 */
	markFailed(): void {
		const currentUrl = this.getCurrentRPC();
		const status = this.statusMap.get(currentUrl);

		if (status) {
			status.failCount++;
			console.log(`❌ RPC ${currentUrl} failed (fail count: ${status.failCount})`);
		}
	}

	/**
	 * Mark current RPC as successful (reset fail count)
	 */
	markSuccess(): void {
		const currentUrl = this.getCurrentRPC();
		const status = this.statusMap.get(currentUrl);

		if (status) {
			status.failCount = 0;
			status.isRateLimited = false;
			status.rateLimitTime = undefined;
		}
	}

	/**
	 * Switch to next available RPC
	 * Returns true if switched successfully, false if no available RPCs
	 */
	private switchToNextAvailable(): boolean {
		const availableRPCs = this.getAvailableRPCs();

		if (availableRPCs.length === 0) {
			console.log('❌ All RPCs are rate limited or failed');
			return false;
		}

		// Find next available RPC
		for (let i = 1; i < this.endpoints.length; i++) {
			const nextIndex = (this.currentIndex + i) % this.endpoints.length;
			const nextUrl = this.endpoints[nextIndex].url;

			if (availableRPCs.includes(nextUrl)) {
				this.currentIndex = nextIndex;
				console.log(`✅ Switched to RPC: ${nextUrl}`);
				return true;
			}
		}

		return false;
	}

	/**
	 * Check if all RPCs are exhausted (rate limited or failed)
	 */
	isAllExhausted(): boolean {
		return this.getAvailableRPCs().length === 0;
	}

	/**
	 * Get status report for debugging
	 */
	getStatusReport(): string {
		const lines: string[] = ['RPC Status Report:'];
		this.endpoints.forEach((ep, index) => {
			const status = this.statusMap.get(ep.url);
			const isCurrent = index === this.currentIndex;
			const marker = isCurrent ? '→' : ' ';
			const rateLimitInfo = status?.isRateLimited
				? ` [RATE LIMITED at ${new Date(status.rateLimitTime!).toLocaleTimeString()}]`
				: '';
			const failInfo = status?.failCount ? ` [Fails: ${status.failCount}]` : '';
			lines.push(`${marker} ${ep.url}${rateLimitInfo}${failInfo}`);
		});
		return lines.join('\n');
	}

	/**
	 * Reset all rate limits (for manual user intervention)
	 */
	resetAllLimits(): void {
		this.statusMap.forEach((status) => {
			status.isRateLimited = false;
			status.rateLimitTime = undefined;
			status.failCount = 0;
		});
		console.log('🔄 All RPC rate limits have been reset');
	}
}
