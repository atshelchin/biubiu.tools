/**
 * Wallet-sweep specific dependency checker
 * Orchestrates the dependency checks for wallet-sweep tool
 */

import type { Address } from 'viem';
import type { DependencyCheck, ContractCheck } from '../types/dependencies';
import {
	checkRPCEndpoint,
	checkEIP7702Support,
	checkCREATE2Proxy,
	checkMulticall3,
	checkBiuBiuPremium,
	checkTokenSweep,
	checkContractDeployment,
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
 * Check custom biubiu membership contract (if provided)
 */
async function checkBiubiuMembership(
	rpcUrl: string,
	address: Address,
	t: TranslateFn
): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		address,
		'Biubiu Membership',
		t('tools.token_sweep.step2.content.checks.contract.biubiu_membership_description'),
		t,
		{
			canDeploy: false,
			deployGuideUrl: undefined
		}
	);
}

/**
 * Check custom wallet-sweep operation contract (if provided)
 */
async function checkTokenSweepContract(
	rpcUrl: string,
	address: Address,
	t: TranslateFn
): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		address,
		'Token Sweep Contract',
		t('tools.token_sweep.step2.content.checks.contract.token_sweep_contract_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: undefined // Will be added when contract is ready
		}
	);
}

/**
 * Run all dependency checks for wallet-sweep
 * This orchestrates the check sequence specific to wallet-sweep requirements
 */
export async function checkAllDependencies(
	rpcUrl: string,
	chainId: number,
	networkName: string,
	t: TranslateFn,
	membershipContractAddress?: Address,
	sweepContractAddress?: Address
): Promise<DependencyCheck[]> {
	const checks: DependencyCheck[] = [];

	// 1. Check RPC endpoint first
	const rpcCheck = await checkRPCEndpoint(rpcUrl, chainId, networkName, t);
	checks.push(rpcCheck);

	// If RPC failed, don't proceed with other checks
	if (rpcCheck.status === 'error') {
		return checks;
	}

	// 2. Check EIP-7702 support (CRITICAL - required for token sweep functionality)
	const eip7702Check = await checkEIP7702Support(rpcUrl, t);
	checks.push(eip7702Check);

	// If EIP-7702 is not supported, don't proceed with contract checks
	// as deployment and subsequent operations depend on this feature
	if (eip7702Check.status === 'error') {
		return checks;
	}

	// 3. Check CREATE2 Proxy
	const create2Check = await checkCREATE2Proxy(rpcUrl, t);
	checks.push(create2Check);

	// 4. Check Multicall3
	const multicallCheck = await checkMulticall3(rpcUrl, t);
	checks.push(multicallCheck);

	// 5. Check BiuBiuPremium
	const biubiuPremiumCheck = await checkBiuBiuPremium(rpcUrl, t);
	checks.push(biubiuPremiumCheck);

	// 6. Check TokenSweep
	const tokenSweepCheck = await checkTokenSweep(rpcUrl, t);
	checks.push(tokenSweepCheck);

	// 7. Check Biubiu Membership (if custom address provided)
	if (membershipContractAddress) {
		const membershipCheck = await checkBiubiuMembership(rpcUrl, membershipContractAddress, t);
		checks.push(membershipCheck);
	}

	// 8. Check Token Sweep Contract (if custom address provided)
	if (sweepContractAddress) {
		const sweepCheck = await checkTokenSweepContract(rpcUrl, sweepContractAddress, t);
		checks.push(sweepCheck);
	}

	return checks;
}
