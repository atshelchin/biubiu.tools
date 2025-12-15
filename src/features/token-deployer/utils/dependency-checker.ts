/**
 * Token-deployer specific dependency checker
 * Orchestrates the dependency checks for token-deployer tool
 */

import type { DependencyCheck } from '../types/dependencies';
import {
	checkRPCEndpoint,
	checkCREATE2Proxy,
	checkMulticall3,
	checkBiuBiuPremium,
	checkTokenFactory,
	calculateCheckSummary,
	KNOWN_CONTRACTS
} from '$lib/utils/blockchain-checker';

// Re-export for convenience
export { calculateCheckSummary, KNOWN_CONTRACTS };

/**
 * Translation function type
 */
type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

/**
 * Run all dependency checks for token-deployer
 * This orchestrates the check sequence specific to token-deployer requirements
 *
 * Dependencies:
 * - RPC Endpoint: Network connectivity
 * - CREATE2 Proxy: Deterministic deployment for cross-chain consistency
 * - Multicall3: Batch contract calls for efficiency
 * - BiuBiuPremium: Membership verification for premium features
 * - TokenFactory: Token deployment factory contract
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

	// 2. Check CREATE2 Proxy (CRITICAL - required for deterministic deployment)
	const create2Check = await checkCREATE2Proxy(rpcUrl, t);
	checks.push(create2Check);

	// 3. Check Multicall3 (CRITICAL - required for batch operations)
	const multicallCheck = await checkMulticall3(rpcUrl, t);
	checks.push(multicallCheck);

	// 4. Check BiuBiuPremium (OPTIONAL - for premium features)
	const biubiuPremiumCheck = await checkBiuBiuPremium(rpcUrl, t);
	checks.push(biubiuPremiumCheck);

	// 5. Check TokenFactory (CRITICAL - the main factory contract)
	const tokenFactoryCheck = await checkTokenFactory(rpcUrl, t);
	checks.push(tokenFactoryCheck);

	return checks;
}
