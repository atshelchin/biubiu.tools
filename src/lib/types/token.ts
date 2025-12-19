import type { Address } from 'viem';

/**
 * Token types
 */
export type TokenType = 'native' | 'erc20' | 'erc721' | 'erc1155';

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
 * ERC721 NFT token
 */
export interface ERC721Token extends Token {
	type: 'erc721';
	address: Address;
	tokenId?: bigint; // Specific token ID (optional, can be multiple)
}

/**
 * ERC1155 Multi-token
 */
export interface ERC1155Token extends Token {
	type: 'erc1155';
	address: Address;
	tokenId: bigint; // Token ID is required for ERC1155
}

/**
 * Union type for all token types
 */
export type AnyToken = NativeToken | ERC20Token | ERC721Token | ERC1155Token;

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
