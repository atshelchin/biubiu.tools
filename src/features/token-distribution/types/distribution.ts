import type { Address } from 'viem';
import type { AnyToken } from '$lib/types/token';
import type { Recipient } from './recipient';

/**
 * Distribution token type category (for UI selection)
 */
export type DistributionTokenType = 'native' | 'erc20' | 'erc721' | 'erc1155';

/**
 * Distribution amount mode
 */
export type DistributionAmountMode = 'equal' | 'custom' | 'random';

/**
 * Distribution configuration
 */
export interface DistributionConfig {
	sourceWallet: Address; // Connected wallet address
	token: AnyToken; // Token to distribute (Native, ERC20, ERC721, or ERC1155)
	amountMode: DistributionAmountMode;
	totalAmount?: string; // Total amount to distribute (for equal mode)
	amountPerRecipient?: string; // Amount per recipient (for equal mode)
	recipients: Recipient[]; // Recipients with optional custom amounts
	chainId: number;
	gasLimit?: bigint;
	maxFeePerGas?: bigint;
	maxPriorityFeePerGas?: bigint;
}

/**
 * Distribution transaction
 */
export interface DistributionTransaction {
	to: Address;
	value?: bigint;
	data?: `0x${string}`;
	gasLimit: bigint;
	recipient: Recipient;
	estimatedCost: bigint;
}

/**
 * Distribution execution status
 */
export type DistributionStatus = 'idle' | 'preparing' | 'executing' | 'completed' | 'error';

/**
 * Distribution result
 */
export interface DistributionResult {
	success: boolean;
	totalSent: string;
	successCount: number;
	failureCount: number;
	transactions: {
		recipient: Recipient;
		hash?: string;
		success: boolean;
		error?: string;
	}[];
	totalGasUsed?: bigint;
	error?: string;
}

/**
 * Distribution summary
 */
export interface DistributionSummary {
	token: AnyToken;
	recipientCount: number;
	totalAmount: string;
	estimatedGasCost: string;
	estimatedTotalCost: string; // totalAmount + gas (for native token)
}

/**
 * Execution mode for distribution
 * - self: User signs each transaction individually (batch signing)
 * - delegated: User signs authorization, anyone can execute batches
 */
export type ExecutionMode = 'self' | 'delegated';

/**
 * Token type enum matching contract constants
 */
export const TOKEN_TYPE_ENUM = {
	WETH: 0, // WETH (wrapped ETH for native-like distribution)
	ERC20: 1,
	ERC721: 2,
	ERC1155: 3
} as const;

export type TokenTypeEnum = (typeof TOKEN_TYPE_ENUM)[keyof typeof TOKEN_TYPE_ENUM];

/**
 * Distribution authorization for delegated mode (EIP-712)
 * Matches the contract's DistributionAuth struct
 */
export interface DistributionAuth {
	uuid: `0x${string}`; // bytes32 - Unique identifier
	token: Address; // Token contract address (or WETH for native)
	tokenType: TokenTypeEnum; // Token type enum
	tokenId: bigint; // Token ID for ERC721/1155 (0 for fungible)
	totalAmount: bigint; // Total amount to distribute
	totalBatches: bigint; // Total number of batches
	merkleRoot: `0x${string}`; // Merkle root of all batch leaves
	deadline: bigint; // Unix timestamp for auth expiry
}

/**
 * Delegated distribution session
 * Contains all data needed to execute distribution in batches
 */
export interface DelegatedSession {
	sessionId: string;
	auth: DistributionAuth;
	signature: `0x${string}`;
	batches: DelegatedBatch[];
	createdAt: number;
	expiresAt: number;
	status: 'pending' | 'partial' | 'completed' | 'expired';
}

/**
 * Single batch in delegated distribution
 */
export interface DelegatedBatch {
	batchId: number;
	recipients: DelegatedRecipient[];
	proof: `0x${string}`[];
	status: 'pending' | 'executing' | 'completed' | 'failed';
	txHash?: `0x${string}`;
	error?: string;
}

/**
 * Recipient in delegated distribution (contract format)
 */
export interface DelegatedRecipient {
	to: Address;
	value: bigint;
}
