import { getContext, setContext } from 'svelte';
import type { StepManager } from './step-indicator.svelte';

const STEP_CONTEXT_KEY = Symbol('step-manager');

/**
 * Set the step manager in the context
 * Call this in the parent component that manages steps
 */
export function setStepManager(stepManager: StepManager) {
	setContext(STEP_CONTEXT_KEY, stepManager);
}

/**
 * Get the step manager from the context
 * Call this in child components that need access to step management
 */
export function useStepManager(): StepManager {
	const stepManager = getContext<StepManager>(STEP_CONTEXT_KEY);

	if (!stepManager) {
		throw new Error(
			'useStepManager must be called within a component that has setStepManager in its parent'
		);
	}

	return stepManager;
}
