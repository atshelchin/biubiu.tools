/**
 * Dependency check state module.
 *
 * This module manages the state for dependency/prerequisite checks
 * that many step-based tools perform (e.g., checking wallet connection,
 * network availability, RPC endpoints, etc.).
 *
 * ## Usage
 *
 * ```typescript
 * const appState = createAppStateContext({
 *   toolId: 'my-tool',
 *   modules: {
 *     dependencyCheck: createDependencyCheckModule
 *   }
 * });
 *
 * // In components
 * const { dependencyCheck } = getAppState();
 *
 * // Start checking
 * dependencyCheck.startChecking();
 *
 * // Finish checking
 * dependencyCheck.finishChecking(checks, summary);
 *
 * // Check if can proceed
 * if (dependencyCheck.canProceed) {
 *   // Move to next step
 * }
 * ```
 *
 * @module
 */

import type { StateModule } from '../types';
import type { DependencyCheck, DependencyCheckSummary } from '$lib/utils/blockchain-checker';

/**
 * Serializable state for persistence.
 */
export interface DependencyCheckSerializedState {
	checks: DependencyCheck[];
	summary: DependencyCheckSummary | null;
	hasChecked: boolean;
}

/**
 * Public interface for the dependency check module.
 */
export interface DependencyCheckModule extends StateModule<DependencyCheckSerializedState> {
	// Readonly state
	readonly checks: DependencyCheck[];
	readonly summary: DependencyCheckSummary | null;
	readonly isChecking: boolean;
	readonly hasChecked: boolean;

	// Derived state
	readonly canProceed: boolean;
	readonly passedCount: number;
	readonly failedCount: number;
	readonly warningCount: number;

	// Actions
	startChecking(): void;
	finishChecking(checks: DependencyCheck[], summary: DependencyCheckSummary): void;
	updateCheck(index: number, check: DependencyCheck): void;
}

/**
 * Legacy step2State interface for backwards compatibility.
 * This matches the interface used by existing feature step2-state files.
 */
export interface Step2State {
	checks: DependencyCheck[];
	summary: DependencyCheckSummary | null;
	isChecking: boolean;
	hasChecked: boolean;
	reset(): void;
}

/**
 * Create a step2State instance for dependency checking.
 * This is a simplified factory for features that only need basic dependency check state.
 *
 * @example
 * ```typescript
 * // In feature's stores/step2-state.svelte.ts
 * import { createStep2State } from '$lib/stores/modules/dependency-check.svelte';
 * export const step2State = createStep2State();
 * ```
 *
 * @returns A Step2State instance with reactive state
 */
export function createStep2State(): Step2State {
	let checks = $state<DependencyCheck[]>([]);
	let summary = $state<DependencyCheckSummary | null>(null);
	let isChecking = $state(false);
	let hasChecked = $state(false);

	return {
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
		},
		reset() {
			checks = [];
			summary = null;
			isChecking = false;
			hasChecked = false;
		}
	};
}

/**
 * Create a new dependency check module instance.
 *
 * @returns A new DependencyCheckModule instance
 */
export function createDependencyCheckModule(): DependencyCheckModule {
	// Internal state
	let checks = $state<DependencyCheck[]>([]);
	let summary = $state<DependencyCheckSummary | null>(null);
	let isChecking = $state(false);
	let hasChecked = $state(false);

	return {
		// Getters for readonly access
		get checks() {
			return checks;
		},
		get summary() {
			return summary;
		},
		get isChecking() {
			return isChecking;
		},
		get hasChecked() {
			return hasChecked;
		},

		// Derived state
		get canProceed() {
			return hasChecked && summary?.allPassed === true;
		},
		get passedCount() {
			return checks.filter((c) => c.status === 'success').length;
		},
		get failedCount() {
			return checks.filter((c) => c.status === 'error').length;
		},
		get warningCount() {
			return checks.filter((c) => c.status === 'warning').length;
		},

		// Actions
		startChecking() {
			isChecking = true;
			checks = [];
			summary = null;
		},

		finishChecking(newChecks: DependencyCheck[], newSummary: DependencyCheckSummary) {
			checks = newChecks;
			summary = newSummary;
			isChecking = false;
			hasChecked = true;
		},

		updateCheck(index: number, check: DependencyCheck) {
			if (index >= 0 && index < checks.length) {
				checks = [...checks.slice(0, index), check, ...checks.slice(index + 1)];
			}
		},

		// StateModule implementation
		reset() {
			checks = [];
			summary = null;
			isChecking = false;
			hasChecked = false;
		},

		serialize(): DependencyCheckSerializedState {
			return {
				checks,
				summary,
				hasChecked
			};
		},

		deserialize(data: DependencyCheckSerializedState) {
			if (!data) return;
			checks = data.checks ?? [];
			summary = data.summary ?? null;
			hasChecked = data.hasChecked ?? false;
			// Don't restore isChecking - always start fresh
		}
	};
}
