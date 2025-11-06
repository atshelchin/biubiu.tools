/**
 * Dependency checker utilities for token-sweep
 */

import { createPublicClient, http, type Address } from 'viem';
import type {
	DependencyCheck,
	NetworkServiceCheck,
	ContractCheck,
	DependencyCheckSummary
} from '../types/dependencies';

/**
 * Known contract addresses
 */
export const KNOWN_CONTRACTS = {
	// CREATE2 Deterministic Deployment Proxy
	// https://github.com/Arachnid/deterministic-deployment-proxy
	CREATE2_PROXY: '0x4e59b44847b379578588920cA78FbF26c0B4956C' as Address,

	// Multicall3 (custom deployment address for this project)
	// https://github.com/mds1/multicall/blob/main/src/Multicall3.sol
	MULTICALL3: '0x2055A30B00555e7cAd48b1756eac4f917781489b' as Address
} as const;

/**
 * Check RPC endpoint health
 */
export async function checkRPCEndpoint(
	rpcUrl: string,
	chainId: number,
	networkName: string
): Promise<NetworkServiceCheck> {
	const startTime = Date.now();

	try {
		const client = createPublicClient({
			transport: http(rpcUrl, {
				timeout: 10000 // 10 second timeout
			})
		});

		// Try to get the latest block number
		const blockNumber = await client.getBlockNumber();
		const responseTime = Date.now() - startTime;

		// Get chain ID to verify we're connected to the right network
		const actualChainId = await client.getChainId();

		if (actualChainId !== chainId) {
			return {
				id: 'rpc-endpoint',
				type: 'network-service',
				name: 'RPC Endpoint',
				description: `${networkName} RPC connection`,
				status: 'error',
				message: `Chain ID mismatch: expected ${chainId}, got ${actualChainId}`,
				endpoint: rpcUrl,
				responseTime
			};
		}

		return {
			id: 'rpc-endpoint',
			type: 'network-service',
			name: 'RPC Endpoint',
			description: `${networkName} RPC connection`,
			status: 'success',
			message: `Connected to block #${blockNumber}`,
			endpoint: rpcUrl,
			responseTime
		};
	} catch (error) {
		const responseTime = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : String(error);

		return {
			id: 'rpc-endpoint',
			type: 'network-service',
			name: 'RPC Endpoint',
			description: `${networkName} RPC connection`,
			status: 'error',
			message: `Failed to connect: ${errorMessage}`,
			endpoint: rpcUrl,
			responseTime
		};
	}
}

/**
 * Check EIP-7702 support on the network
 * Reference: https://shelchin.com/til/how-to-detect-eip7702-support
 */
export async function checkEIP7702Support(rpcUrl: string): Promise<NetworkServiceCheck> {
	const startTime = Date.now();

	try {
		const client = createPublicClient({
			transport: http(rpcUrl, { timeout: 10000 })
		});

		// Use eth_estimateGas with EIP-7702 delegation designator
		// Code 0xef01000000000000000000000000000000000000000001 is the EIP-7702 delegation designator
		const dummyAddress = '0x0000000000000000000000000000000000000001' as Address;
		const eip7702Code = '0xef01000000000000000000000000000000000000000001' as `0x${string}`;

		// Try to estimate gas with state override that sets EIP-7702 code
		await client.estimateGas({
			account: dummyAddress,
			to: dummyAddress,
			data: '0x',
			stateOverride: [
				{
					address: dummyAddress,
					code: eip7702Code
				}
			]
		});

		const responseTime = Date.now() - startTime;

		// If we got here, the network supports EIP-7702
		return {
			id: 'eip-7702-support',
			type: 'network-service',
			name: 'EIP-7702 Support',
			description: 'Account abstraction with delegation support',
			status: 'success',
			message: 'Network supports EIP-7702 (tested via eth_estimateGas)',
			endpoint: rpcUrl,
			responseTime
		};
	} catch (error) {
		const responseTime = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : String(error);

		// Check if error is due to invalid opcode (no EIP-7702 support)
		if (errorMessage.toLowerCase().includes('invalid opcode')) {
			return {
				id: 'eip-7702-support',
				type: 'network-service',
				name: 'EIP-7702 Support',
				description: 'Account abstraction with delegation support',
				status: 'error',
				message: 'Network does not support EIP-7702 (invalid opcode)',
				endpoint: rpcUrl,
				responseTime
			};
		}

		// Other errors
		return {
			id: 'eip-7702-support',
			type: 'network-service',
			name: 'EIP-7702 Support',
			description: 'Account abstraction with delegation support',
			status: 'error',
			message: `Failed to check EIP-7702 support: ${errorMessage}`,
			endpoint: rpcUrl,
			responseTime
		};
	}
}

/**
 * Check if a contract is deployed at the given address
 */
export async function checkContractDeployment(
	rpcUrl: string,
	address: Address,
	contractName: string,
	description: string,
	options?: {
		canDeploy?: boolean;
		deployGuideUrl?: string;
	}
): Promise<ContractCheck> {
	try {
		const client = createPublicClient({
			transport: http(rpcUrl, { timeout: 10000 })
		});

		// Get contract bytecode
		const bytecode = await client.getBytecode({ address });
		const currentBlockNumber = await client.getBlockNumber();

		// If bytecode exists and is not '0x', contract is deployed
		const isDeployed = !!bytecode && bytecode !== '0x';

		if (isDeployed) {
			// Try to get the block where contract was deployed (current block as fallback)
			// Note: Getting exact deployment block would require scanning transaction history
			// For now, we'll just get the timestamp of current block as reference
			const block = await client.getBlock({ blockNumber: currentBlockNumber });
			const blockTimestamp = Number(block.timestamp);

			return {
				id: `contract-${address.toLowerCase()}`,
				type: 'contract',
				name: contractName,
				description,
				status: 'success',
				message: `Contract is deployed`,
				address,
				isDeployed: true,
				blockNumber: Number(currentBlockNumber),
				blockTimestamp,
				...options
			};
		} else {
			return {
				id: `contract-${address.toLowerCase()}`,
				type: 'contract',
				name: contractName,
				description,
				status: 'error',
				message: 'Contract not deployed at this address',
				address,
				isDeployed: false,
				...options
			};
		}
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);

		return {
			id: `contract-${address.toLowerCase()}`,
			type: 'contract',
			name: contractName,
			description,
			status: 'error',
			message: `Failed to check deployment: ${errorMessage}`,
			address,
			isDeployed: false,
			...options
		};
	}
}

/**
 * Check CREATE2 Proxy deployment
 */
export async function checkCREATE2Proxy(rpcUrl: string): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.CREATE2_PROXY,
		'CREATE2 Proxy',
		'Deterministic deployment proxy for contract creation',
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/Arachnid/deterministic-deployment-proxy'
		}
	);
}

/**
 * Check Multicall3 deployment
 */
export async function checkMulticall3(rpcUrl: string): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.MULTICALL3,
		'Multicall3',
		'Aggregate multiple contract calls into a single request',
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/mds1/multicall'
		}
	);
}

/**
 * Check biubiu membership contract
 */
export async function checkBiubiuMembership(
	rpcUrl: string,
	address: Address
): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		address,
		'Biubiu Membership',
		'Biubiu platform membership contract',
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
	address: Address
): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		address,
		'Token Sweep Contract',
		'Main contract for batch token transfer operations',
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
	membershipContractAddress?: Address,
	sweepContractAddress?: Address
): Promise<DependencyCheck[]> {
	const checks: DependencyCheck[] = [];

	// 1. Check RPC endpoint first
	const rpcCheck = await checkRPCEndpoint(rpcUrl, chainId, networkName);
	checks.push(rpcCheck);

	// If RPC failed, don't proceed with other checks
	if (rpcCheck.status === 'error') {
		return checks;
	}

	// 2. Check EIP-7702 support (CRITICAL - required for token sweep functionality)
	const eip7702Check = await checkEIP7702Support(rpcUrl);
	checks.push(eip7702Check);

	// If EIP-7702 is not supported, don't proceed with contract checks
	// as deployment and subsequent operations depend on this feature
	if (eip7702Check.status === 'error') {
		return checks;
	}

	// 3. Check CREATE2 Proxy
	const create2Check = await checkCREATE2Proxy(rpcUrl);
	checks.push(create2Check);

	// 4. Check Multicall3
	const multicallCheck = await checkMulticall3(rpcUrl);
	checks.push(multicallCheck);

	// 5. Check Biubiu Membership (if address provided)
	if (membershipContractAddress) {
		const membershipCheck = await checkBiubiuMembership(rpcUrl, membershipContractAddress);
		checks.push(membershipCheck);
	}

	// 6. Check Token Sweep Contract (if address provided)
	if (sweepContractAddress) {
		const sweepCheck = await checkTokenSweepContract(rpcUrl, sweepContractAddress);
		checks.push(sweepCheck);
	}

	return checks;
}

/**
 * Calculate summary from check results
 */
export function calculateCheckSummary(checks: DependencyCheck[]): DependencyCheckSummary {
	const total = checks.length;
	const passed = checks.filter((c) => c.status === 'success').length;
	const warnings = checks.filter((c) => c.status === 'warning').length;
	const failed = checks.filter((c) => c.status === 'error').length;

	return {
		total,
		passed,
		warnings,
		failed,
		allPassed: failed === 0 && warnings === 0
	};
}
