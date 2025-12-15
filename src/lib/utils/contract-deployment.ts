/**
 * Reusable contract deployment utilities
 * These utilities can be used across different tools for deploying contracts
 */

import type { Address } from 'viem';

// Well-known addresses
export const KNOWN_ADDRESSES = {
	// CREATE2 Deployer for deterministic deployment
	CREATE2_DEPLOYER: '0x3fab184622dc19b6109349b94811493bf2a45362' as Address,
	// CREATE2 Proxy for contract deployment
	CREATE2_PROXY: '0x4e59b44847b379578588920cA78FbF26c0B4956C' as Address,
	// Fee recipient
	FEE_RECIPIENT: '0xd9eda338cafae29b18b4a92aa5f7c646ba9cdce9' as Address
} as const;

// Common deployment constants
export const DEPLOYMENT_CONSTANTS = {
	// Funding amount for CREATE2 deployer (0.01 ETH)
	CREATE2_DEPLOYER_FUNDING: BigInt(10000000000000000),
	// Basic transfer gas limit
	TRANSFER_GAS: BigInt(21000),
	// Standard contract deployment gas limit
	DEPLOYMENT_GAS: BigInt(3000000),
	// Large contract deployment gas limit
	LARGE_DEPLOYMENT_GAS: BigInt(5000000),
	// Default salt for CREATE2 deployment
	DEFAULT_SALT: '0x0000000000000000000000000000000000000000000000000000000000000000'
} as const;

// Deployment context interface (minimal version)
export interface DeploymentContext {
	chainId: number;
	networkName: string;
	rpcUrl: string;
	blockExplorer?: string;
	sendTransaction: (
		tx: {
			to: Address;
			value: bigint;
			data: `0x${string}`;
			gas?: bigint;
		},
		onStatus?: TransactionStatusCallback
	) => Promise<`0x${string}`>;
	waitForTransaction: (
		hash: `0x${string}`,
		onStatus?: TransactionStatusCallback
	) => Promise<unknown>;
	sendRawTransaction: (
		signedTx: `0x${string}`,
		onStatus?: TransactionStatusCallback
	) => Promise<`0x${string}`>;
	t: TranslateFn;
}

// Translation function type
export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

// Transaction status callback
export type TransactionStatusCallback = (status: {
	stage: 'signing' | 'signed' | 'broadcasting' | 'broadcasted' | 'confirming' | 'confirmed';
	hash?: `0x${string}`;
	blockNumber?: bigint;
}) => void;

// Deployment step interface
export interface DeploymentStep {
	title: string;
	description: string;
	action?: (onStatus?: TransactionStatusCallback) => Promise<void>;
}

// Deployment result interface
export interface DeploymentResult {
	steps: DeploymentStep[];
	onDeploy: () => Promise<void>;
}

/**
 * Create deployment function for CREATE2 Proxy itself
 * This is the foundational contract that enables deterministic deployments
 */
export function createCREATE2ProxyDeployment(
	context: DeploymentContext,
	t: TranslateFn
): DeploymentResult {
	const DEPLOYMENT_TX =
		'0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222';

	let fundingTxHash: `0x${string}` | null = null;
	let deploymentTxHash: `0x${string}` | null = null;

	return {
		steps: [
			{
				title: t('tools.wallet_sweep.step2.content.deployment.steps.create2.fund_deployer_title'),
				description: t(
					'tools.wallet_sweep.step2.content.deployment.steps.create2.fund_deployer_description',
					{
						address: KNOWN_ADDRESSES.CREATE2_DEPLOYER
					}
				),
				action: async (onStatus) => {
					fundingTxHash = await context.sendTransaction(
						{
							to: KNOWN_ADDRESSES.CREATE2_DEPLOYER,
							value: DEPLOYMENT_CONSTANTS.CREATE2_DEPLOYER_FUNDING,
							data: '0x',
							gas: DEPLOYMENT_CONSTANTS.TRANSFER_GAS
						},
						onStatus
					);
					await context.waitForTransaction(fundingTxHash, onStatus);
				}
			},
			{
				title: t('tools.wallet_sweep.step2.content.deployment.steps.create2.deploy_contract_title'),
				description: t(
					'tools.wallet_sweep.step2.content.deployment.steps.create2.deploy_contract_description'
				),
				action: async (onStatus) => {
					deploymentTxHash = await context.sendRawTransaction(DEPLOYMENT_TX, onStatus);
					await context.waitForTransaction(deploymentTxHash, onStatus);
				}
			}
		],
		onDeploy: async () => {
			// Backward compatibility: execute all steps sequentially
			fundingTxHash = await context.sendTransaction({
				to: KNOWN_ADDRESSES.CREATE2_DEPLOYER,
				value: DEPLOYMENT_CONSTANTS.CREATE2_DEPLOYER_FUNDING,
				data: '0x'
			});
			await context.waitForTransaction(fundingTxHash);

			deploymentTxHash = await context.sendRawTransaction(DEPLOYMENT_TX);
			await context.waitForTransaction(deploymentTxHash);
		}
	};
}

/**
 * Create deployment function for contracts using CREATE2 proxy
 * This is a generic deployment pattern for any contract
 *
 * @param bytecode - Contract bytecode (including constructor if needed)
 * @param options - Deployment options
 * @param t - Translation function
 */
export function createCREATE2Deployment(
	context: DeploymentContext,
	bytecode: `0x${string}`,
	options: {
		contractName: string;
		salt?: string;
		gasLimit?: bigint;
	},
	t: TranslateFn
): DeploymentResult {
	const salt = options.salt || DEPLOYMENT_CONSTANTS.DEFAULT_SALT;
	const gasLimit = options.gasLimit || DEPLOYMENT_CONSTANTS.DEPLOYMENT_GAS;

	// Deployment data = salt (32 bytes) + bytecode
	const deploymentData = (salt + bytecode.slice(2)) as `0x${string}`;

	let deploymentTxHash: `0x${string}` | null = null;

	return {
		steps: [
			{
				title: t('tools.wallet_sweep.step2.content.deployment.steps.via_create2.deploy_title', {
					contractName: options.contractName
				}),
				description: t(
					'tools.wallet_sweep.step2.content.deployment.steps.via_create2.deploy_description',
					{
						address: KNOWN_ADDRESSES.CREATE2_PROXY
					}
				),
				action: async (onStatus) => {
					deploymentTxHash = await context.sendTransaction(
						{
							to: KNOWN_ADDRESSES.CREATE2_PROXY,
							value: BigInt(0),
							data: deploymentData,
							gas: gasLimit
						},
						onStatus
					);
					await context.waitForTransaction(deploymentTxHash, onStatus);
				}
			}
		],
		onDeploy: async () => {
			const txHash = await context.sendTransaction({
				to: KNOWN_ADDRESSES.CREATE2_PROXY,
				value: BigInt(0),
				data: deploymentData,
				gas: gasLimit
			});
			await context.waitForTransaction(txHash);
		}
	};
}

/**
 * Calculate the CREATE2 deployment address
 * Useful for verifying deterministic addresses
 */
export function calculateCREATE2Address(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_bytecode: `0x${string}`,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_salt?: string
): Address {
	// This is a simplified version - actual implementation would use keccak256
	// For now, this is a placeholder that should be implemented with proper crypto
	throw new Error('CREATE2 address calculation not yet implemented');
}
