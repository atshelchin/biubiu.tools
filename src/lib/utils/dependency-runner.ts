/**
 * Declarative dependency runner
 *
 * This module provides a configuration-based approach to running dependency checks.
 * Instead of writing imperative code for each feature, you declare what checks are needed.
 *
 * @example
 * ```typescript
 * // In feature's dependency config
 * export const dependencyConfig: DependencyConfig = {
 *   checks: ['rpc', 'create2', 'multicall3', 'biubiu-premium']
 * };
 *
 * // Run checks
 * const results = await runDependencyChecks(dependencyConfig, context);
 * ```
 */

import type { TranslationKeys } from '@shelchin/i18n';
import type { DependencyCheck } from './blockchain-checker';
import {
	checkRPCEndpoint,
	checkEIP7702Support,
	checkCREATE2Proxy,
	checkMulticall3,
	checkBiuBiuPremium,
	checkTokenSweep,
	checkTokenFactory,
	checkNFTFactory,
	checkWETH,
	checkTokenDistribution,
	calculateCheckSummary
} from './blockchain-checker';

// Re-export for convenience
export { calculateCheckSummary };
export type { DependencyCheck };

/**
 * Available check types
 */
export type CheckType =
	| 'rpc'
	| 'eip7702'
	| 'create2'
	| 'multicall3'
	| 'biubiu-premium'
	| 'token-sweep'
	| 'token-factory'
	| 'nft-factory'
	| 'weth'
	| 'token-distribution';

/**
 * Checks that should block further checks if they fail
 */
const BLOCKING_CHECKS: CheckType[] = ['rpc', 'eip7702'];

/**
 * Translation function type
 */
type TranslateFn = (key: keyof TranslationKeys, params?: Record<string, string | number>) => string;

/**
 * Context for running dependency checks
 */
export interface DependencyCheckContext {
	rpcUrl: string;
	chainId: number;
	networkName: string;
	t: TranslateFn;
}

/**
 * Custom check function type
 */
export type CustomCheckFn = (
	rpcUrl: string,
	t: TranslateFn,
	context: DependencyCheckContext
) => Promise<DependencyCheck>;

/**
 * Configuration for dependency checks
 */
export interface DependencyConfig {
	/**
	 * List of checks to run in order.
	 * Checks will be executed sequentially.
	 * If a blocking check fails, subsequent checks will be skipped.
	 */
	checks: CheckType[];
}

/**
 * Extended configuration with custom checks
 */
export interface ExtendedDependencyConfig extends DependencyConfig {
	/**
	 * Additional custom checks to run after the standard checks
	 */
	customChecks?: CustomCheckFn[];
}

/**
 * Map of check types to their implementation functions
 */
const CHECK_IMPLEMENTATIONS: Record<
	CheckType,
	(rpcUrl: string, t: TranslateFn, context: DependencyCheckContext) => Promise<DependencyCheck>
> = {
	rpc: (_, t, ctx) => checkRPCEndpoint(ctx.rpcUrl, ctx.chainId, ctx.networkName, t),
	eip7702: (rpcUrl, t) => checkEIP7702Support(rpcUrl, t),
	create2: (rpcUrl, t) => checkCREATE2Proxy(rpcUrl, t),
	multicall3: (rpcUrl, t) => checkMulticall3(rpcUrl, t),
	'biubiu-premium': (rpcUrl, t) => checkBiuBiuPremium(rpcUrl, t),
	'token-sweep': (rpcUrl, t) => checkTokenSweep(rpcUrl, t),
	'token-factory': (rpcUrl, t) => checkTokenFactory(rpcUrl, t),
	'nft-factory': (rpcUrl, t) => checkNFTFactory(rpcUrl, t),
	weth: (rpcUrl, t) => checkWETH(rpcUrl, t),
	'token-distribution': (rpcUrl, t) => checkTokenDistribution(rpcUrl, t)
};

/**
 * Run dependency checks based on configuration
 *
 * @param config - The dependency configuration
 * @param context - The context for running checks (rpcUrl, chainId, etc.)
 * @returns Array of dependency check results
 */
export async function runDependencyChecks(
	config: DependencyConfig | ExtendedDependencyConfig,
	context: DependencyCheckContext
): Promise<DependencyCheck[]> {
	const results: DependencyCheck[] = [];
	let shouldStop = false;

	// Run standard checks
	for (const checkType of config.checks) {
		const checkFn = CHECK_IMPLEMENTATIONS[checkType];
		if (!checkFn) {
			console.warn(`Unknown check type: ${checkType}`);
			continue;
		}

		const result = await checkFn(context.rpcUrl, context.t, context);
		results.push(result);

		// Stop if a blocking check fails
		if (BLOCKING_CHECKS.includes(checkType) && result.status === 'error') {
			shouldStop = true;
			break;
		}
	}

	// Run custom checks if no blocking failure
	if (!shouldStop && 'customChecks' in config && config.customChecks) {
		for (const customCheck of config.customChecks) {
			const result = await customCheck(context.rpcUrl, context.t, context);
			results.push(result);
		}
	}

	return results;
}

/**
 * Pre-defined check configurations for common use cases
 */
export const PRESET_CONFIGS = {
	/** Basic checks: RPC only */
	basic: {
		checks: ['rpc'] as CheckType[]
	},

	/** Contract deployer: RPC + CREATE2 */
	'contract-deployer': {
		checks: ['rpc', 'create2'] as CheckType[]
	},

	/** Token balance scanner: RPC + CREATE2 + Multicall3 + Premium */
	'token-balance-scanner': {
		checks: ['rpc', 'create2', 'multicall3', 'biubiu-premium'] as CheckType[]
	},

	/** Wallet sweep: Full EIP-7702 checks */
	'wallet-sweep': {
		checks: [
			'rpc',
			'eip7702',
			'create2',
			'multicall3',
			'biubiu-premium',
			'token-sweep'
		] as CheckType[]
	},

	/** Token deployer: RPC + CREATE2 + Multicall3 + Premium + Token Factory */
	'token-deployer': {
		checks: ['rpc', 'create2', 'multicall3', 'biubiu-premium', 'token-factory'] as CheckType[]
	},

	/** NFT deployer: RPC + CREATE2 + Multicall3 + Premium + NFT Factory */
	'nft-deployer': {
		checks: ['rpc', 'create2', 'multicall3', 'biubiu-premium', 'nft-factory'] as CheckType[]
	},

	/** Token distribution: RPC + CREATE2 + Premium + WETH + Distribution */
	'token-distribution': {
		checks: ['rpc', 'create2', 'biubiu-premium', 'weth', 'token-distribution'] as CheckType[]
	}
} as const;

/**
 * Get preset config by feature ID
 */
export function getPresetConfig(featureId: keyof typeof PRESET_CONFIGS): DependencyConfig {
	return PRESET_CONFIGS[featureId];
}
