/**
 * One-to-Many Transfer (Token Distribution) specific dependency checker
 * Orchestrates the dependency checks for token distribution tool
 */

import type { DependencyCheck } from '$lib/utils/blockchain-checker';
import {
	checkRPCEndpoint,
	checkCREATE2Proxy,
	checkBiuBiuPremium,
	checkWETH,
	checkTokenDistribution,
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
 * Run all dependency checks for one-to-many transfer (token distribution)
 * This orchestrates the check sequence specific to token distribution requirements
 *
 * Required contracts:
 * 1. RPC Endpoint - network connectivity
 * 2. CREATE2 Proxy - for deterministic contract deployment
 * 3. BiuBiuPremium - membership management (fee discount for premium users)
 * 4. WETH - wrapped ETH for delegated execute mode
 * 5. TokenDistribution - main distribution contract
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

	// 3. Check BiuBiuPremium (membership management)
	const biubiuPremiumCheck = await checkBiuBiuPremium(rpcUrl, t);
	checks.push(biubiuPremiumCheck);

	// 4. Check WETH (required for delegated execute mode)
	const wethCheck = await checkWETH(rpcUrl, t);
	checks.push(wethCheck);

	// 5. Check TokenDistribution contract
	const tokenDistributionCheck = await checkTokenDistribution(rpcUrl, t);
	checks.push(tokenDistributionCheck);

	return checks;
}
