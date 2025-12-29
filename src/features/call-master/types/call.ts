import type { Address, Abi } from 'viem';

export interface ContractCall {
	id: string;
	contractAddress: Address;
	functionName: string;
	args: unknown[];
	value?: bigint;
}

export interface ContractInfo {
	address: Address;
	abi: Abi;
	name?: string;
}

export interface CallResult {
	callId: string;
	success: boolean;
	result?: unknown;
	error?: string;
	txHash?: string;
	gasUsed?: bigint;
}

export type CallMode = 'read' | 'write' | 'batch';
