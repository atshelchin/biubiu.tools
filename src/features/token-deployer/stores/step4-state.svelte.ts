import type { DeploymentResult, DeploymentStatus } from '../types/token';

interface Step4State {
	deploymentStatus: DeploymentStatus;
	deploymentResult: DeploymentResult | null;
}

function createStep4State(): Step4State {
	let deploymentStatus = $state<DeploymentStatus>('idle');
	let deploymentResult = $state<DeploymentResult | null>(null);

	return {
		get deploymentStatus() {
			return deploymentStatus;
		},
		set deploymentStatus(value: DeploymentStatus) {
			deploymentStatus = value;
		},
		get deploymentResult() {
			return deploymentResult;
		},
		set deploymentResult(value: DeploymentResult | null) {
			deploymentResult = value;
		}
	};
}

export const step4State = createStep4State();

export function resetDeployment() {
	step4State.deploymentStatus = 'idle';
	step4State.deploymentResult = null;
}
