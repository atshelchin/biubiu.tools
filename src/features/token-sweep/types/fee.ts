import type { Address } from 'viem';

/**
 * Transaction fee per sweep (0.0025 native coin for non-members)
 */
export const SWEEP_FEE_PER_TRANSACTION = 0.0025;

/**
 * Membership verification result
 */
export interface MembershipStatus {
	isMember: boolean;
	verificationMethod?: 'direct' | 'signature'; // How membership was verified
	verifiedAddress?: Address; // The address that was verified as member
}

/**
 * Transaction mode for sweep execution
 */
export type TransactionMode = 'connected' | 'temporary';

/**
 * Temporary wallet information
 */
export interface TemporaryWallet {
	address: Address;
	privateKey: string; // Stored in browser memory only
	createdAt: number; // Timestamp
	taskId: string; // Associated task ID
	signature?: string; // Original signature used to generate this wallet
}

/**
 * Fee breakdown for sweep operation
 */
export interface FeeBreakdown {
	transactionCount: number;
	sweepFeePerTx: number; // In native coin
	totalSweepFee: number; // In native coin
	estimatedGasFee: bigint; // In wei
	totalCost: bigint; // In wei (sweep fee + gas fee)
	requiresPayment: boolean; // Whether payment is required (not a member)
}
