/**
 * Contract-deployer specific dependency checker
 * Orchestrates the dependency checks for contract-deployer tool
 */

import type { DependencyCheck } from '$lib/utils/blockchain-checker';
import {
	checkRPCEndpoint,
	checkCREATE2Proxy,
	calculateCheckSummary,
	KNOWN_CONTRACTS
} from '$lib/utils/blockchain-checker';

// Re-export for convenience
export { calculateCheckSummary, KNOWN_CONTRACTS };

// Re-export types for backwards compatibility
export type { DependencyCheck };

// CREATE2 Proxy address (deterministic across all networks)
export const CREATE2_PROXY_ADDRESS = KNOWN_CONTRACTS.CREATE2_PROXY;

/**
 * Translation function type - use keyof TranslationKeys for type safety
 */
import type { TranslationKeys } from '@shelchin/i18n';
type TranslateFn = (key: keyof TranslationKeys, params?: Record<string, string | number>) => string;

/**
 * Run all dependency checks for contract-deployer
 * This orchestrates the check sequence specific to contract-deployer requirements
 */
export async function checkAllDependencies(
	rpcUrl: string,
	chainId: number,
	networkName: string,
	t: TranslateFn
): Promise<DependencyCheck[]> {
	const checks: DependencyCheck[] = [];

	// 1. Check RPC endpoint first
	const rpcCheck = await checkRPCEndpoint(rpcUrl, chainId, networkName, t);
	checks.push(rpcCheck);

	// If RPC failed, don't proceed with other checks
	if (rpcCheck.status === 'error') {
		return checks;
	}

	// 2. Check CREATE2 Proxy (required for deterministic deployment)
	const create2Check = await checkCREATE2Proxy(rpcUrl, t);
	checks.push(create2Check);

	return checks;
}
