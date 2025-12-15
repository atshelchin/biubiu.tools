/**
 * Generic blockchain dependency checker utilities
 * Can be reused across different tools
 */

import { createPublicClient, http, type Address } from 'viem';

export interface CheckResult {
	id: string;
	name: string;
	description: string;
	status: 'checking' | 'success' | 'error' | 'warning';
	message?: string;
}

export interface NetworkServiceCheck extends CheckResult {
	type: 'network-service';
	endpoint?: string;
	responseTime?: number;
}

export interface ContractCheck extends CheckResult {
	type: 'contract';
	address: Address;
	isDeployed: boolean;
	blockNumber?: number;
	blockTimestamp?: number;
	canDeploy?: boolean;
	deployGuideUrl?: string;
}

export type DependencyCheck = NetworkServiceCheck | ContractCheck;

export interface DependencyCheckSummary {
	total: number;
	passed: number;
	warnings: number;
	failed: number;
	allPassed: boolean;
}

/**
 * Translation function type
 */
type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

/**
 * Check RPC endpoint health
 */
export async function checkRPCEndpoint(
	rpcUrl: string,
	chainId: number,
	networkName: string,
	t: TranslateFn
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
				name: t('tools.wallet_sweep.step2.content.checks.rpc_endpoint.name'),
				description: t('tools.wallet_sweep.step2.content.checks.rpc_endpoint.description', {
					network: networkName
				}),
				status: 'error',
				message: t('tools.wallet_sweep.step2.content.checks.rpc_endpoint.chain_id_mismatch', {
					expected: chainId,
					actual: actualChainId
				}),
				endpoint: rpcUrl,
				responseTime
			};
		}

		return {
			id: 'rpc-endpoint',
			type: 'network-service',
			name: t('tools.wallet_sweep.step2.content.checks.rpc_endpoint.name'),
			description: t('tools.wallet_sweep.step2.content.checks.rpc_endpoint.description', {
				network: networkName
			}),
			status: 'success',
			message: t('tools.wallet_sweep.step2.content.checks.rpc_endpoint.connected_to_block', {
				blockNumber: Number(blockNumber)
			}),
			endpoint: rpcUrl,
			responseTime
		};
	} catch (error) {
		const responseTime = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : String(error);

		return {
			id: 'rpc-endpoint',
			type: 'network-service',
			name: t('tools.wallet_sweep.step2.content.checks.rpc_endpoint.name'),
			description: t('tools.wallet_sweep.step2.content.checks.rpc_endpoint.description', {
				network: networkName
			}),
			status: 'error',
			message: t('tools.wallet_sweep.step2.content.checks.rpc_endpoint.failed_to_connect', {
				error: errorMessage
			}),
			endpoint: rpcUrl,
			responseTime
		};
	}
}

/**
 * Check EIP-7702 support on the network
 * Reference: https://shelchin.com/til/how-to-detect-eip7702-support
 */
export async function checkEIP7702Support(
	rpcUrl: string,
	t: TranslateFn
): Promise<NetworkServiceCheck> {
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
			name: t('tools.wallet_sweep.step2.content.checks.eip7702.name'),
			description: t('tools.wallet_sweep.step2.content.checks.eip7702.description'),
			status: 'success',
			message: t('tools.wallet_sweep.step2.content.checks.eip7702.supported'),
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
				name: t('tools.wallet_sweep.step2.content.checks.eip7702.name'),
				description: t('tools.wallet_sweep.step2.content.checks.eip7702.description'),
				status: 'error',
				message: t('tools.wallet_sweep.step2.content.checks.eip7702.not_supported'),
				endpoint: rpcUrl,
				responseTime
			};
		}

		// Other errors
		return {
			id: 'eip-7702-support',
			type: 'network-service',
			name: t('tools.wallet_sweep.step2.content.checks.eip7702.name'),
			description: t('tools.wallet_sweep.step2.content.checks.eip7702.description'),
			status: 'error',
			message: t('tools.wallet_sweep.step2.content.checks.eip7702.check_failed', {
				error: errorMessage
			}),
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
	t: TranslateFn,
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
				message: t('tools.wallet_sweep.step2.content.checks.contract.deployed'),
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
				message: t('tools.wallet_sweep.step2.content.checks.contract.not_deployed'),
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
			message: t('tools.wallet_sweep.step2.content.checks.contract.check_failed', {
				error: errorMessage
			}),
			address,
			isDeployed: false,
			...options
		};
	}
}

/**
 * Known contract addresses that can be reused across tools
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
	wallet_sweep: '0x28ab612a3a871EA203aDff9a7b0846C395529239' as Address,

	// TokenFactory (ERC20 token deployment factory)
	// https://github.com/atshelchin/biubiu-contracts
	TOKEN_FACTORY: '0xd53219D61e6F7305d5D6e23F29197F3AD58521E1' as Address,

	// NFTFactory (ERC721 NFT deployment factory with stake-to-mint support)
	// https://github.com/atshelchin/biubiu-contracts
	NFT_FACTORY: '0xB003AdCD063aAAe88A634aC65257820c1322751D' as Address
} as const;

/**
 * Create a contract checker for CREATE2 Proxy
 */
export async function checkCREATE2Proxy(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.CREATE2_PROXY,
		'CREATE2 Proxy',
		t('tools.wallet_sweep.step2.content.checks.contract.create2_proxy_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/Arachnid/deterministic-deployment-proxy'
		}
	);
}

/**
 * Create a contract checker for Multicall3
 */
export async function checkMulticall3(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.MULTICALL3,
		'Multicall3',
		t('tools.wallet_sweep.step2.content.checks.contract.multicall3_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/mds1/multicall'
		}
	);
}

/**
 * Create a contract checker for BiuBiuPremium
 */
export async function checkBiuBiuPremium(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.BIUBIU_PREMIUM,
		'BiuBiuPremium',
		t('tools.wallet_sweep.step2.content.checks.contract.biubiu_premium_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts'
		}
	);
}

/**
 * Create a contract checker for TokenSweep
 */
export async function checkTokenSweep(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.wallet_sweep,
		'TokenSweep',
		t('tools.wallet_sweep.step2.content.checks.contract.wallet_sweep_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts'
		}
	);
}

/**
 * Create a contract checker for TokenFactory
 */
export async function checkTokenFactory(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.TOKEN_FACTORY,
		'TokenFactory',
		t('tools.token_deployer.step2.content.checks.contract.token_factory_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts'
		}
	);
}

/**
 * Create a contract checker for NFTFactory
 */
export async function checkNFTFactory(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.NFT_FACTORY,
		'NFTFactory',
		t('tools.nft_deployer.step2.content.checks.contract.nft_factory_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts'
		}
	);
}

/**
 * Calculate summary from check results
 */
export function calculateCheckSummary(checks: DependencyCheck[]): DependencyCheckSummary {
	const total = checks.length;
	const passed = checks.filter((c) => c.status === 'success').length;
	const warnings = checks.filter((c) => c.status === 'warning').length;
	const failed = checks.filter((c) => c.status === 'error').length;

	// Allow warnings, only block on failures
	return {
		total,
		passed,
		warnings,
		failed,
		allPassed: failed === 0
	};
}
