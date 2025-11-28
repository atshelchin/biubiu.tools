import type { Address } from 'viem';

export interface ContractDeploymentConfig {
	bytecode: string;
	abi: string; // JSON or Human-readable ABI
	constructorArgs: string[]; // Raw string inputs from user
	salt: string; // For CREATE2 deterministic deployment
}

export interface DeploymentResult {
	success: boolean;
	contractAddress?: Address;
	transactionHash?: string;
	error?: string;
}

export interface ConstructorParam {
	name: string;
	type: string;
	value: string;
}
