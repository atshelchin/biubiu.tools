/**
 * Token-sweep specific dependency checker
 * Uses generic blockchain-checker utilities
 */

import type { Address } from 'viem';
import type { DependencyCheck, ContractCheck } from '../types/dependencies';
import {
	checkRPCEndpoint as genericCheckRPC,
	checkEIP7702Support as genericCheckEIP7702,
	checkContractDeployment,
	calculateCheckSummary
} from '$lib/utils/blockchain-checker';

// Re-export calculateCheckSummary for convenience
export { calculateCheckSummary };

/**
 * Translation function type
 */
type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

/**
 * Known contract addresses for token-sweep
 */
export const KNOWN_CONTRACTS = {
	// CREATE2 Deterministic Deployment Proxy
	// https://github.com/Arachnid/deterministic-deployment-proxy
	CREATE2_PROXY: '0x4e59b44847b379578588920cA78FbF26c0B4956C' as Address,

	// Multicall3 (custom deployment address for this project)
	// https://github.com/mds1/multicall/blob/main/src/Multicall3.sol
	MULTICALL3: '0x2055A30B00555e7cAd48b1756eac4f917781489b' as Address,

	// BiuBiuPremium (membership management contract)
	// https://github.com/atshelchin/biubiu-contracts
	BIUBIU_PREMIUM: '0xc5c4bb399938625523250B708dc5c1e7dE4b1626' as Address,

	// TokenSweep (batch token transfer contract)
	// https://github.com/atshelchin/biubiu-contracts
	TOKEN_SWEEP: '0x28ab612a3a871EA203aDff9a7b0846C395529239' as Address
} as const;

/**
 * Check RPC endpoint health
 */
export async function checkRPCEndpoint(
	rpcUrl: string,
	chainId: number,
	networkName: string,
	t: TranslateFn
) {
	return genericCheckRPC(rpcUrl, chainId, networkName, t);
}

/**
 * Check EIP-7702 support
 */
export async function checkEIP7702Support(rpcUrl: string, t: TranslateFn) {
	return genericCheckEIP7702(rpcUrl, t);
}

/**
 * Check CREATE2 Proxy deployment
 */
export async function checkCREATE2Proxy(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.CREATE2_PROXY,
		'CREATE2 Proxy',
		t('tools.token_sweep.step2.content.checks.contract.create2_proxy_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/Arachnid/deterministic-deployment-proxy'
		}
	);
}

/**
 * Check Multicall3 deployment
 */
export async function checkMulticall3(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.MULTICALL3,
		'Multicall3',
		t('tools.token_sweep.step2.content.checks.contract.multicall3_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/mds1/multicall'
		}
	);
}

/**
 * Check BiuBiuPremium deployment
 */
export async function checkBiuBiuPremium(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.BIUBIU_PREMIUM,
		'BiuBiuPremium',
		t('tools.token_sweep.step2.content.checks.contract.biubiu_premium_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts'
		}
	);
}

/**
 * Check TokenSweep deployment
 */
export async function checkTokenSweep(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.TOKEN_SWEEP,
		'TokenSweep',
		t('tools.token_sweep.step2.content.checks.contract.token_sweep_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts'
		}
	);
}

/**
 * Check biubiu membership contract
 */
export async function checkBiubiuMembership(
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
 * Check token-sweep operation contract
 */
export async function checkTokenSweepContract(
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
 * Run all dependency checks for a network
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

	// 7. Check Biubiu Membership (if address provided)
	if (membershipContractAddress) {
		const membershipCheck = await checkBiubiuMembership(rpcUrl, membershipContractAddress, t);
		checks.push(membershipCheck);
	}

	// 8. Check Token Sweep Contract (if address provided)
	if (sweepContractAddress) {
		const sweepCheck = await checkTokenSweepContract(rpcUrl, sweepContractAddress, t);
		checks.push(sweepCheck);
	}

	return checks;
}
