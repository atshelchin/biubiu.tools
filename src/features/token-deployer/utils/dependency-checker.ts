/**
 * Token-deployer dependency checker
 * Uses the shared dependency runner with declarative configuration
 */

import {
	runDependencyChecks,
	getPresetConfig,
	calculateCheckSummary,
	type DependencyCheck,
	type DependencyCheckContext
} from '$lib/utils/dependency-runner';
import { KNOWN_CONTRACTS } from '$lib/utils/blockchain-checker';
import type { TranslationKeys } from '@shelchin/i18n';

// Re-export for convenience
export { calculateCheckSummary, KNOWN_CONTRACTS };

type TranslateFn = (key: keyof TranslationKeys, params?: Record<string, string | number>) => string;

/**
 * Run all dependency checks for token-deployer
 */
export async function checkAllDependencies(
	rpcUrl: string,
	chainId: number,
	networkName: string,
	t: TranslateFn
): Promise<DependencyCheck[]> {
	const context: DependencyCheckContext = { rpcUrl, chainId, networkName, t };
	return runDependencyChecks(getPresetConfig('token-deployer'), context);
}
