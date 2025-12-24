/**
 * Token-balance-scanner specific dependency checker
 * Orchestrates the dependency checks for token-balance-scanner tool
 */

import type { DependencyCheck } from '$lib/utils/blockchain-checker';
import {
	checkRPCEndpoint,
	checkCREATE2Proxy,
	checkMulticall3,
	checkBiuBiuPremium,
	calculateCheckSummary
} from '$lib/utils/blockchain-checker';

// Re-export for convenience
export { calculateCheckSummary };

/**
 * Translation function type - use keyof TranslationKeys for type safety
 */
import type { TranslationKeys } from '@shelchin/i18n';
type TranslateFn = (key: keyof TranslationKeys, params?: Record<string, string | number>) => string;

/**
 * Run all dependency checks for token-balance-scanner
 * This orchestrates the check sequence specific to token-balance-scanner requirements
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

	// 2. Check CREATE2 Proxy (Deterministic Deployment Proxy)
	const create2Check = await checkCREATE2Proxy(rpcUrl, t);
	checks.push(create2Check);

	// 3. Check Multicall3 (required for batch balance queries)
	const multicallCheck = await checkMulticall3(rpcUrl, t);
	checks.push(multicallCheck);

	// 4. Check BiuBiuPremium
	const biubiuPremiumCheck = await checkBiuBiuPremium(rpcUrl, t);
	checks.push(biubiuPremiumCheck);

	return checks;
}
