/**
 * Step 2 state management for NFT Deployer
 * Manages dependency checks
 */

import type { DependencyCheck, DependencyCheckSummary } from '$lib/utils/blockchain-checker';

/**
 * Step 2 state - Dependency checks
 */
class Step2CheckDepsState {
	isChecking = $state<boolean>(false);
	hasChecked = $state<boolean>(false);
	checks = $state<DependencyCheck[]>([]);
	summary = $state<DependencyCheckSummary | null>(null);

	reset() {
		this.isChecking = false;
		this.hasChecked = false;
		this.checks = [];
		this.summary = null;
	}
}

export const step2CheckDepsState = new Step2CheckDepsState();
