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
