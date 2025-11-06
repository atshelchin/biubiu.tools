/**
 * Contract deployment configuration types
 */

import type { Address, Hex } from 'viem';

/**
 * Constructor argument type
 */
export interface ConstructorArg {
	name: string;
	type: string; // e.g., 'address', 'uint256', 'string', 'bytes32[]'
	value: string | number | boolean | bigint;
}

/**
 * Deployment function context
 */
export interface DeploymentContext {
	chainId: number;
	networkName: string;
	rpcUrl: string;
	blockExplorer?: string;
	// Wallet methods from connectStore
	sendTransaction: (params: {
		to: Address;
		value: bigint;
		data: `0x${string}`;
		gas?: bigint;
	}) => Promise<`0x${string}`>;
	waitForTransaction: (hash: `0x${string}`) => Promise<unknown>;
	sendRawTransaction: (signedTx: `0x${string}`) => Promise<`0x${string}`>;
}

/**
 * Deployment step for UI
 */
export interface DeploymentStep {
	title: string;
	description: string;
	action?: () => Promise<void>;
}

/**
 * Custom deployment function
 * Should return deployment steps for the UI to execute
 */
export type DeploymentFunction = (context: DeploymentContext) => Promise<{
	steps: DeploymentStep[];
	onDeploy: () => Promise<void>;
}>;

/**
 * Contract deployment configuration
 */
export interface ContractDeploymentConfig {
	// Contract identification
	contractName: string;
	contractAddress: Address;
	description: string;

	// Deployment configuration
	bytecode?: Hex; // Contract bytecode (for reference)
	constructorArgs?: ConstructorArg[]; // Constructor arguments (for reference)

	// Custom deployment function
	deployFunction?: DeploymentFunction;

	// UI configuration
	canDeploy: boolean;
	deployGuideUrl?: string;
}

/**
 * Deployment configuration registry
 */
export type DeploymentConfigRegistry = Record<Address, ContractDeploymentConfig>;
