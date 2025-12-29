/**
 * Step Tool Definition Helper
 *
 * Provides a typed helper function to define step-based tools with validation.
 *
 * Note: This is specifically for step-based tools (wizard-style UIs with
 * multiple steps, wallet connection, dependency checks, etc.).
 * Not all features in the features/ directory need to use this.
 */

import type { StepToolDefinition } from './types';

/**
 * Define a step-based tool with type checking and validation.
 *
 * Use this for tools that have:
 * - Multi-step wizard interface
 * - Wallet connection requirement
 * - Dependency checks
 * - Step-based navigation (sidebar, content, footer)
 *
 * @example
 * ```typescript
 * export const walletSweepTool = defineStepTool({
 *   id: 'wallet-sweep',
 *   i18nPrefix: 'wallet-sweep',
 *   steps: [
 *     { label: 'wallet-sweep.seo.step_1_name', description: 'wallet-sweep.seo.step_1_description' },
 *     { label: 'wallet-sweep.seo.step_2_name', description: 'wallet-sweep.seo.step_2_description' },
 *     // ...
 *   ],
 *   stepComponents,
 *   walletConnect: {
 *     chains: [mainnet, polygon, base, bsc],
 *     storageKey: 'biubiu-tools-wallet-sweep'
 *   },
 *   dependencyChecks: ['rpc', 'eip7702', 'create2', 'multicall3', 'biubiu-premium', 'token-sweep'],
 *   paywall: { type: 'pay-per-use', fee: 0.005 }
 * });
 * ```
 */
export function defineStepTool(definition: StepToolDefinition): StepToolDefinition {
	// Validate required fields
	if (!definition.id) {
		throw new Error('Step tool definition must have an id');
	}
	if (!definition.i18nPrefix) {
		throw new Error('Step tool definition must have an i18nPrefix');
	}
	if (!definition.steps || definition.steps.length === 0) {
		throw new Error('Step tool definition must have at least one step');
	}
	if (!definition.stepComponents) {
		throw new Error('Step tool definition must have stepComponents');
	}

	// Validate step components match step count
	const stepCount = definition.steps.length;
	const { sidebar, content, footer } = definition.stepComponents;

	if (sidebar.length !== stepCount) {
		throw new Error(
			`Step tool ${definition.id}: sidebar components (${sidebar.length}) don't match step count (${stepCount})`
		);
	}
	if (content.length !== stepCount) {
		throw new Error(
			`Step tool ${definition.id}: content components (${content.length}) don't match step count (${stepCount})`
		);
	}
	if (footer.length !== stepCount) {
		throw new Error(
			`Step tool ${definition.id}: footer components (${footer.length}) don't match step count (${stepCount})`
		);
	}

	return definition;
}
