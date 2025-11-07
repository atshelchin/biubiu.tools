import type { Address } from 'viem';

/**
 * Token types
 */
export type TokenType = 'native' | 'erc20';

/**
 * Base token interface
 */
export interface Token {
	id: string; // Unique identifier (chainId:address or chainId:native)
	type: TokenType;
	symbol: string;
	name: string;
	decimals: number;
	chainId: number;
	logoUrl?: string;
	isCustom?: boolean; // Whether this is a user-added custom token
}

/**
 * Native token (ETH, BNB, MATIC, etc.)
 */
export interface NativeToken extends Token {
	type: 'native';
}

/**
 * ERC20 token
 */
export interface ERC20Token extends Token {
	type: 'erc20';
	address: Address;
}

/**
 * Token selection state
 */
export interface TokenSelection {
	chainId: number;
	selectedTokenIds: string[]; // Array of token IDs
}

/**
 * Custom token storage (saved to localStorage)
 */
export interface CustomTokenStorage {
	tokens: ERC20Token[];
	version: number; // For future migrations
}
