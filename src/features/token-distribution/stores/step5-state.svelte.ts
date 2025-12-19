import type { DistributionStatus } from '@/features/token-distribution/types/distribution';
import type { Address } from 'viem';

/**
 * Transaction result for tracking individual transfers
 */
export interface TransactionResult {
	recipientAddress: Address;
	recipientLabel?: string;
	amount?: string;
	tokenId?: bigint;
	success: boolean;
	hash?: `0x${string}`;
	error?: string;
	timestamp: number;
}

/**
 * Distribution progress state
 */
export interface DistributionProgress {
	currentIndex: number;
	totalCount: number;
	percentage: number;
	currentRecipient?: string;
	phase: 'idle' | 'preparing' | 'approving' | 'executing' | 'completed' | 'paused' | 'error';
	message: string;
}

/**
 * Module-level state for Step 5 (Confirm & Execute Distribution)
 * Shared across all step components
 */
class Step5State {
	// Execution status
	status = $state<DistributionStatus>('idle');

	// Progress tracking
	progress = $state<DistributionProgress>({
		currentIndex: 0,
		totalCount: 0,
		percentage: 0,
		phase: 'idle',
		message: ''
	});

	// Transaction results
	results = $state<TransactionResult[]>([]);

	// Error state
	errorMessage = $state<string>('');

	// Pause/Resume state
	isPaused = $state<boolean>(false);
	pauseReason = $state<string>('');

	// Session ID for resume capability
	sessionId = $state<string>('');

	// Last checkpoint index (for resume)
	checkpointIndex = $state<number>(0);

	/**
	 * Initialize a new distribution session
	 */
	initSession(totalCount: number): string {
		const sessionId = `dist-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
		this.sessionId = sessionId;
		this.status = 'preparing';
		this.progress = {
			currentIndex: 0,
			totalCount,
			percentage: 0,
			phase: 'preparing',
			message: 'Preparing distribution...'
		};
		this.results = [];
		this.errorMessage = '';
		this.isPaused = false;
		this.pauseReason = '';
		this.checkpointIndex = 0;
		return sessionId;
	}

	/**
	 * Update progress during execution
	 */
	updateProgress(
		currentIndex: number,
		phase: DistributionProgress['phase'],
		message: string,
		currentRecipient?: string
	) {
		const percentage =
			this.progress.totalCount > 0
				? Math.round((currentIndex / this.progress.totalCount) * 100)
				: 0;

		this.progress = {
			currentIndex,
			totalCount: this.progress.totalCount,
			percentage,
			phase,
			message,
			currentRecipient
		};

		if (phase === 'executing') {
			this.status = 'executing';
		}
	}

	/**
	 * Add a transaction result
	 */
	addResult(result: TransactionResult) {
		this.results = [...this.results, result];

		// Update checkpoint on successful transactions
		if (result.success) {
			this.checkpointIndex = this.progress.currentIndex;
		}
	}

	/**
	 * Pause execution (e.g., for gas refill or user request)
	 */
	pause(reason: string) {
		this.isPaused = true;
		this.pauseReason = reason;
		this.progress = {
			...this.progress,
			phase: 'paused',
			message: reason
		};
	}

	/**
	 * Resume execution from pause
	 */
	resume() {
		this.isPaused = false;
		this.pauseReason = '';
		this.progress = {
			...this.progress,
			phase: 'executing',
			message: 'Resuming distribution...'
		};
	}

	/**
	 * Mark distribution as completed
	 */
	complete() {
		this.status = 'completed';
		const successCount = this.results.filter((r) => r.success).length;
		const failCount = this.results.filter((r) => !r.success).length;

		this.progress = {
			...this.progress,
			currentIndex: this.progress.totalCount,
			percentage: 100,
			phase: 'completed',
			message: `Distribution completed! ${successCount} successful, ${failCount} failed`
		};
	}

	/**
	 * Set error state
	 */
	setError(message: string) {
		this.status = 'error';
		this.errorMessage = message;
		this.progress = {
			...this.progress,
			phase: 'error',
			message
		};
	}

	/**
	 * Get summary statistics
	 */
	get summary() {
		const successCount = this.results.filter((r) => r.success).length;
		const failCount = this.results.filter((r) => !r.success).length;
		const pendingCount = this.progress.totalCount - this.results.length;

		return {
			total: this.progress.totalCount,
			success: successCount,
			failed: failCount,
			pending: pendingCount,
			completed: this.progress.totalCount > 0 && pendingCount === 0
		};
	}

	/**
	 * Check if can resume from checkpoint
	 */
	get canResume(): boolean {
		return (
			(this.isPaused || this.status === 'error') &&
			this.checkpointIndex < this.progress.totalCount &&
			this.sessionId !== ''
		);
	}

	/**
	 * Get index to resume from
	 */
	get resumeFromIndex(): number {
		// Resume from the last successful transaction + 1
		return this.checkpointIndex;
	}

	/**
	 * Reset all state
	 */
	reset() {
		this.status = 'idle';
		this.progress = {
			currentIndex: 0,
			totalCount: 0,
			percentage: 0,
			phase: 'idle',
			message: ''
		};
		this.results = [];
		this.errorMessage = '';
		this.isPaused = false;
		this.pauseReason = '';
		this.sessionId = '';
		this.checkpointIndex = 0;
	}
}

export const step5State = new Step5State();
