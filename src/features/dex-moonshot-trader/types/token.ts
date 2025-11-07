import type { Address } from 'viem';

/**
 * Token information from contract
 */
export interface TokenInfo {
	address: Address;
	name: string;
	symbol: string;
	decimals: number;
	balance: bigint; // User's token balance
	totalSupply?: bigint;
}

/**
 * Token validation result
 */
export interface TokenValidationResult {
	isValid: boolean;
	token?: TokenInfo;
	error?: string;
}
