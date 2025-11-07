import type { DeploymentStatus, DeploymentResult } from '../types/nft';

/**
 * Deployment state management
 */
class DeploymentState {
	status = $state<DeploymentStatus>('idle');
	result = $state<DeploymentResult | null>(null);
	progress = $state<number>(0); // 0-100
	message = $state<string>('');

	reset() {
		this.status = 'idle';
		this.result = null;
		this.progress = 0;
		this.message = '';
	}

	setStatus(status: DeploymentStatus, message?: string) {
		this.status = status;
		if (message) {
			this.message = message;
		}
	}

	setProgress(progress: number, message?: string) {
		this.progress = Math.min(100, Math.max(0, progress));
		if (message) {
			this.message = message;
		}
	}

	setResult(result: DeploymentResult) {
		this.result = result;
		this.status = result.success ? 'completed' : 'error';
		this.progress = result.success ? 100 : 0;
	}

	get isDeploying(): boolean {
		return this.status === 'preparing' || this.status === 'deploying';
	}

	get isCompleted(): boolean {
		return this.status === 'completed';
	}

	get hasError(): boolean {
		return this.status === 'error';
	}
}

export const deploymentState = new DeploymentState();
