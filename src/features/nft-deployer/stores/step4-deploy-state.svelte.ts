import type { Address } from 'viem';

/**
 * Deployment status
 */
export type DeploymentStatus = 'idle' | 'preparing' | 'deploying' | 'completed' | 'error';

/**
 * Step 4 state - Deployment
 */
class Step4DeployState {
	status = $state<DeploymentStatus>('idle');
	nftAddress = $state<Address | null>(null);
	txHash = $state<string | null>(null);
	error = $state<string | null>(null);
	deploymentCost = $state<string | null>(null);

	reset() {
		this.status = 'idle';
		this.nftAddress = null;
		this.txHash = null;
		this.error = null;
		this.deploymentCost = null;
	}

	setDeploying() {
		this.status = 'deploying';
		this.error = null;
	}

	setCompleted(address: Address, txHash: string) {
		this.status = 'completed';
		this.nftAddress = address;
		this.txHash = txHash;
		this.error = null;
	}

	setError(error: string) {
		this.status = 'error';
		this.error = error;
	}
}

export const step4DeployState = new Step4DeployState();
