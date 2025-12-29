/**
 * Wallet-sweep dependency checker
 * Uses the shared dependency runner with declarative configuration
 */

import type { Address } from 'viem';
import {
	runDependencyChecks,
	getPresetConfig,
	calculateCheckSummary,
	type DependencyCheck,
	type DependencyCheckContext,
	type CustomCheckFn,
	type ExtendedDependencyConfig
} from '$lib/utils/dependency-runner';
import {
	checkContractDeployment,
	KNOWN_CONTRACTS,
	type ContractCheck
} from '$lib/utils/blockchain-checker';
import type { TranslationKeys } from '@shelchin/i18n';

// Re-export for convenience
export { calculateCheckSummary, KNOWN_CONTRACTS };

type TranslateFn = (key: keyof TranslationKeys, params?: Record<string, string | number>) => string;

/**
 * Create a custom check for biubiu membership contract
 */
function createMembershipCheck(address: Address): CustomCheckFn {
	return async (rpcUrl, t): Promise<ContractCheck> => {
		return checkContractDeployment(
			rpcUrl,
			address,
			'Biubiu Membership',
			t('wallet-sweep.step2.content.checks.contract.biubiu_membership_description'),
			t,
			{ canDeploy: false }
		);
	};
}

/**
 * Create a custom check for token sweep contract
 */
function createSweepContractCheck(address: Address): CustomCheckFn {
	return async (rpcUrl, t): Promise<ContractCheck> => {
		return checkContractDeployment(
			rpcUrl,
			address,
			'Token Sweep Contract',
			t('wallet-sweep.step2.content.checks.contract.wallet_sweep_contract_description'),
			t,
			{ canDeploy: true }
		);
	};
}

/**
 * Run all dependency checks for wallet-sweep
 */
export async function checkAllDependencies(
	rpcUrl: string,
	chainId: number,
	networkName: string,
	t: TranslateFn,
	membershipContractAddress?: Address,
	sweepContractAddress?: Address
): Promise<DependencyCheck[]> {
	const context: DependencyCheckContext = { rpcUrl, chainId, networkName, t };

	// Build custom checks based on provided addresses
	const customChecks: CustomCheckFn[] = [];
	if (membershipContractAddress) {
		customChecks.push(createMembershipCheck(membershipContractAddress));
	}
	if (sweepContractAddress) {
		customChecks.push(createSweepContractCheck(sweepContractAddress));
	}

	const config: ExtendedDependencyConfig = {
		...getPresetConfig('wallet-sweep'),
		customChecks: customChecks.length > 0 ? customChecks : undefined
	};

	return runDependencyChecks(config, context);
}
