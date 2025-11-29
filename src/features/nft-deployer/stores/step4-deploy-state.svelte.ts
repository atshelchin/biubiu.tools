import type { Address } from 'viem';

/**
 * Deployment status
 */
export type DeploymentStatus = 'idle' | 'preparing' | 'deploying' | 'completed' | 'error';

/**
 * Step 4 state - Deployment
 */
class Step4DeployState {
	deploymentStatus = $state<DeploymentStatus>('idle');
	deployedAddress = $state<Address | null>(null);
	transactionHash = $state<string | null>(null);
	error = $state<string | null>(null);
	gasEstimate = $state<bigint | null>(null);

	reset() {
		this.deploymentStatus = 'idle';
		this.deployedAddress = null;
		this.transactionHash = null;
		this.error = null;
		this.gasEstimate = null;
	}

	setDeploying() {
		this.deploymentStatus = 'deploying';
		this.error = null;
	}

	setCompleted(address: Address, txHash: string) {
		this.deploymentStatus = 'completed';
		this.deployedAddress = address;
		this.transactionHash = txHash;
		this.error = null;
	}

	setError(error: string) {
		this.deploymentStatus = 'error';
		this.error = error;
	}
}

export const step4DeployState = new Step4DeployState();
