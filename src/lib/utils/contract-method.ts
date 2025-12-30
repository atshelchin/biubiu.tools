/**
 * Contract Method Selector
 *
 * Utility to select between paid and free contract methods
 * based on selfHostedMode configuration.
 *
 * When selfHostedMode is enabled (for self-hosted/forked deployments),
 * the Free version of contract methods will be used, which bypass
 * the payment requirements while still providing the same functionality.
 */

import { getConfig, isPaywallInitialized } from '@shelchin/paywall';

/**
 * Check if the app is running in self-hosted mode
 * In self-hosted mode, free contract methods should be used
 */
export function isSelfHostedMode(): boolean {
	if (!isPaywallInitialized()) {
		return false;
	}
	return getConfig().selfHostedMode;
}

/**
 * Get the appropriate contract method name based on mode
 *
 * @param paidMethod - The paid/default method name (e.g., 'createToken')
 * @returns The appropriate method name ('createToken' or 'createTokenFree')
 *
 * @example
 * ```ts
 * const methodName = getContractMethod('createToken');
 * // Returns 'createToken' in normal mode
 * // Returns 'createTokenFree' in self-hosted mode
 *
 * encodeFunctionData({
 *   abi,
 *   functionName: methodName,
 *   args: [...]
 * });
 * ```
 */
export function getContractMethod(paidMethod: string): string {
	if (isSelfHostedMode()) {
		return `${paidMethod}Free`;
	}
	return paidMethod;
}

/**
 * Mapping of paid methods to their free counterparts
 * This is useful for documentation and type safety
 */
export const CONTRACT_METHODS = {
	// TokenFactory
	createToken: { paid: 'createToken', free: 'createTokenFree' },

	// NFTFactory
	createERC721: { paid: 'createERC721', free: 'createERC721Free' },

	// TokenSweep
	multicall: { paid: 'multicall', free: 'multicallFree' },

	// TokenDistribution
	distribute: { paid: 'distribute', free: 'distributeFree' },
	distributeWithAuth: { paid: 'distributeWithAuth', free: 'distributeWithAuthFree' }
} as const;

export type ContractMethodName = keyof typeof CONTRACT_METHODS;
