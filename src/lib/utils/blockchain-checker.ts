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
	docUrl?: string; // URL to documentation about this check
}

export interface NetworkServiceCheck extends CheckResult {
	type: 'network-service';
	endpoint?: string;
	responseTime?: number;
	/** Whether the user needs to configure RPC endpoint (e.g., no RPC URL provided) */
	needsRpcConfig?: boolean;
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
 * Translation function type - use keyof TranslationKeys for type safety
 */
import type { TranslationKeys } from '@shelchin/i18n';
type TranslateFn = (key: keyof TranslationKeys, params?: Record<string, string | number>) => string;

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
				name: t('wallet-sweep.step2.content.checks.rpc_endpoint.name'),
				description: t('wallet-sweep.step2.content.checks.rpc_endpoint.description', {
					network: networkName
				}),
				status: 'error',
				message: t('wallet-sweep.step2.content.checks.rpc_endpoint.chain_id_mismatch', {
					expected: chainId,
					actual: actualChainId
				}),
				endpoint: rpcUrl,
				responseTime,
				docUrl: ''
			};
		}

		return {
			id: 'rpc-endpoint',
			type: 'network-service',
			name: t('wallet-sweep.step2.content.checks.rpc_endpoint.name'),
			description: t('wallet-sweep.step2.content.checks.rpc_endpoint.description', {
				network: networkName
			}),
			status: 'success',
			message: t('wallet-sweep.step2.content.checks.rpc_endpoint.connected_to_block', {
				blockNumber: Number(blockNumber)
			}),
			endpoint: rpcUrl,
			responseTime,
			docUrl: ''
		};
	} catch (error) {
		const responseTime = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : String(error);

		// Check if the error is due to missing RPC URL
		const isNoRpcConfigured =
			errorMessage.includes('No URL was provided') || !rpcUrl || rpcUrl.trim() === '';

		// For RPC endpoint check, always allow configuration (whether missing or unavailable)
		// This helps users switch to a better RPC when current one is rate-limited, down, etc.
		const needsRpcConfig = true;

		// Use specific message for missing RPC config vs connection failure
		const message = isNoRpcConfigured
			? t('wallet-sweep.step2.content.checks.rpc_endpoint.no_rpc_configured')
			: t('wallet-sweep.step2.content.checks.rpc_endpoint.failed_to_connect', {
					error: errorMessage
				});

		return {
			id: 'rpc-endpoint',
			type: 'network-service',
			name: t('wallet-sweep.step2.content.checks.rpc_endpoint.name'),
			description: t('wallet-sweep.step2.content.checks.rpc_endpoint.description', {
				network: networkName
			}),
			status: 'error',
			message,
			endpoint: rpcUrl,
			responseTime,
			needsRpcConfig
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
			name: t('wallet-sweep.step2.content.checks.eip7702.name'),
			description: t('wallet-sweep.step2.content.checks.eip7702.description'),
			status: 'success',
			message: t('wallet-sweep.step2.content.checks.eip7702.supported'),
			// endpoint: rpcUrl,
			responseTime,
			docUrl: 'https://eips.ethereum.org/EIPS/eip-7702'
		};
	} catch (error) {
		const responseTime = Date.now() - startTime;
		const errorMessage = error instanceof Error ? error.message : String(error);
		const errorLower = errorMessage.toLowerCase();

		// 1. Check if error is due to invalid opcode (chain definitely doesn't support EIP-7702)
		if (errorLower.includes('invalid opcode')) {
			return {
				id: 'eip-7702-support',
				type: 'network-service',
				name: t('wallet-sweep.step2.content.checks.eip7702.name'),
				description: t('wallet-sweep.step2.content.checks.eip7702.description'),
				status: 'error',
				message: t('wallet-sweep.step2.content.checks.eip7702.not_supported'),
				endpoint: rpcUrl,
				responseTime
				// needsRpcConfig: false - chain doesn't support, changing RPC won't help
			};
		}

		// 2. Check if error is due to RPC not supporting state override (RPC capability issue)
		// Common patterns: "too many arguments", "invalid parameters", "unsupported method"
		const isRpcCapabilityError =
			errorLower.includes('too many arguments') ||
			errorLower.includes('invalid parameters') ||
			errorLower.includes('unsupported') ||
			errorLower.includes('not supported') ||
			errorLower.includes('unknown method');

		if (isRpcCapabilityError) {
			return {
				id: 'eip-7702-support',
				type: 'network-service',
				name: t('wallet-sweep.step2.content.checks.eip7702.name'),
				description: t('wallet-sweep.step2.content.checks.eip7702.description'),
				status: 'error',
				message: t('wallet-sweep.step2.content.checks.eip7702.rpc_not_capable'),
				endpoint: rpcUrl,
				responseTime,
				needsRpcConfig: true // User should try a different RPC
			};
		}

		// 3. Other errors (network timeout, rate limit, etc.) - also suggest RPC config
		return {
			id: 'eip-7702-support',
			type: 'network-service',
			name: t('wallet-sweep.step2.content.checks.eip7702.name'),
			description: t('wallet-sweep.step2.content.checks.eip7702.description'),
			status: 'error',
			message: t('wallet-sweep.step2.content.checks.eip7702.check_failed', {
				error: errorMessage
			}),
			endpoint: rpcUrl,
			responseTime,
			needsRpcConfig: true // Network errors can be fixed by trying different RPC
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
		docUrl?: string;
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
				message: t('wallet-sweep.step2.content.checks.contract.deployed'),
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
				message: t('wallet-sweep.step2.content.checks.contract.not_deployed'),
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
			message: t('wallet-sweep.step2.content.checks.contract.check_failed', {
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
	NFT_FACTORY: '0xB003AdCD063aAAe88A634aC65257820c1322751D' as Address,

	// WETH (Wrapped ETH for TokenDistribution delegated mode)
	// Custom CREATE2 deployed, same address on all chains
	// https://github.com/atshelchin/biubiu-contracts
	WETH: '0xe3E75C1fe9AE82993FEb6F9CA2e9627aaE1e3d18' as Address,

	// TokenDistribution (batch distribute tokens/NFTs to multiple recipients)
	// Custom CREATE2 deployed, same address on all chains
	// https://github.com/atshelchin/biubiu-contracts commit 8212ca1
	TOKEN_DISTRIBUTION: '0xD35cE8751e46D518D4bb650e271696903BaFF70C' as Address
} as const;

/**
 * Create a contract checker for CREATE2 Proxy
 */
export async function checkCREATE2Proxy(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.CREATE2_PROXY,
		'Deterministic Deployment Proxy',
		t('wallet-sweep.step2.content.checks.contract.create2_proxy_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/Arachnid/deterministic-deployment-proxy',
			docUrl: 'https://github.com/Arachnid/deterministic-deployment-proxy'
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
		t('wallet-sweep.step2.content.checks.contract.multicall3_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/mds1/multicall',
			docUrl: 'https://github.com/mds1/multicall3'
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
		t('wallet-sweep.step2.content.checks.contract.biubiu_premium_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts',
			docUrl: 'https://github.com/atshelchin/biubiu-contracts/blob/main/src/BiuBiuPremium.sol'
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
		t('wallet-sweep.step2.content.checks.contract.wallet_sweep_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts',
			docUrl: 'https://github.com/atshelchin/biubiu-contracts/blob/main/src/TokenSweep.sol'
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
		t('token-deployer.step2.content.checks.contract.token_factory_description'),
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
		t('nft-deployer.step2.content.checks.contract.nft_factory_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts'
		}
	);
}

/**
 * Create a contract checker for WETH (used in TokenDistribution delegated mode)
 */
export async function checkWETH(rpcUrl: string, t: TranslateFn): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.WETH,
		'WETH',
		t('one-to-many-transfer.step2.content.checks.contract.weth_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts',
			docUrl: 'https://github.com/atshelchin/biubiu-contracts/blob/main/src/WETH.sol'
		}
	);
}

/**
 * Create a contract checker for TokenDistribution
 */
export async function checkTokenDistribution(
	rpcUrl: string,
	t: TranslateFn
): Promise<ContractCheck> {
	return checkContractDeployment(
		rpcUrl,
		KNOWN_CONTRACTS.TOKEN_DISTRIBUTION,
		'TokenDistribution',
		t('one-to-many-transfer.step2.content.checks.contract.token_distribution_description'),
		t,
		{
			canDeploy: true,
			deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts',
			docUrl: 'https://github.com/atshelchin/biubiu-contracts/blob/main/src/TokenDistribution.sol'
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
