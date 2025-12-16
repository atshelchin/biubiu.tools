/**
 * Token-balance-scanner specific dependency checker
 * Orchestrates the dependency checks for token-balance-scanner tool
 * Only checks RPC endpoint and Multicall3 (no EIP-7702, CREATE2, BiuBiuPremium, TokenSweep)
 */

import type { DependencyCheck } from '$lib/utils/blockchain-checker';
import {
	checkRPCEndpoint,
	checkMulticall3,
	calculateCheckSummary
} from '$lib/utils/blockchain-checker';

// Re-export for convenience
export { calculateCheckSummary };

/**
 * Translation function type
 */
type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

/**
 * Run all dependency checks for token-balance-scanner
 * This orchestrates the check sequence specific to token-balance-scanner requirements
 * Only checks RPC endpoint and Multicall3 (simpler than wallet-sweep)
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

	// 2. Check Multicall3 (required for batch balance queries)
	const multicallCheck = await checkMulticall3(rpcUrl, t);
	checks.push(multicallCheck);

	return checks;
}
