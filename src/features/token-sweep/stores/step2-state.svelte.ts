/**
 * Shared state for Step 2 dependency checks
 * Module-level state is shared across all component instances automatically
 */

import type { DependencyCheck, DependencyCheckSummary } from '../types/dependencies';

// Module-level state - automatically shared across all imports
let checks = $state<DependencyCheck[]>([]);
let summary = $state<DependencyCheckSummary | null>(null);
let isChecking = $state(false);
let hasChecked = $state(false);

export const step2State = {
	get checks() {
		return checks;
	},
	set checks(value: DependencyCheck[]) {
		checks = value;
	},
	get summary() {
		return summary;
	},
	set summary(value: DependencyCheckSummary | null) {
		summary = value;
	},
	get isChecking() {
		return isChecking;
	},
	set isChecking(value: boolean) {
		isChecking = value;
	},
	get hasChecked() {
		return hasChecked;
	},
	set hasChecked(value: boolean) {
		hasChecked = value;
	}
};
