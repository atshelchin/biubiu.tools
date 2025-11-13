import type { Address } from 'viem';
import { recoverAddress, keccak256, toHex } from 'viem';
import type { MembershipStatus, FeeBreakdown } from '../types/fee';
import { SWEEP_FEE_PER_TRANSACTION } from '../types/fee';

/**
 * Mock membership list - In production, this would be fetched from a smart contract or API
 * For now, we use a hardcoded list for demonstration
 */
const MOCK_MEMBERS: Set<string> = new Set([
	// Add some test addresses (all lowercase)
	'0x0000000000000000000000000000000000000001',
	'0x0000000000000000000000000000000000000002'
]);

/**
 * Check if an address is a member (direct check)
 *
 * @param address - Address to check
 * @returns Membership status
 */
export function checkMembershipDirect(address: Address): MembershipStatus {
	const isMember = MOCK_MEMBERS.has(address.toLowerCase());

	return {
		isMember,
		verificationMethod: 'direct',
		verifiedAddress: address
	};
}

/**
 * Check membership via signature verification
 * Verifies if the signer address (recovered from signature) is a member
 *
 * @param taskId - Task identifier
 * @param signature - Signature to verify
 * @param message - Original message that was signed
 * @returns Membership status
 */
export async function checkMembershipViaSignature(
	taskId: string,
	signature: `0x${string}`,
	message: string
): Promise<MembershipStatus> {
	try {
		// Recover the address that signed the message
		const signerAddress = await recoverAddress({
			hash: keccak256(toHex(message)),
			signature
		});

		// Check if the signer is a member
		const isMember = MOCK_MEMBERS.has(signerAddress.toLowerCase());

		return {
			isMember,
			verificationMethod: 'signature',
			verifiedAddress: signerAddress
		};
	} catch (error) {
		console.error('Signature verification failed:', error);
		return {
			isMember: false
		};
	}
}

/**
 * Check if user qualifies for free transactions (membership check)
 * Checks both:
 * 1. Direct: Is the transaction sender (msg.sender) a member?
 * 2. Signature: Is the address recovered from (taskId + signature) a member?
 *
 * @param senderAddress - The address sending the transaction (msg.sender)
 * @param taskId - Task identifier
 * @param signature - Optional signature for verification
 * @param signMessage - Original message that was signed (if signature provided)
 * @returns Membership status
 */
export async function checkMembership(
	senderAddress: Address,
	taskId: string,
	signature?: `0x${string}`,
	signMessage?: string
): Promise<MembershipStatus> {
	// First check: Is the sender address directly a member?
	const directCheck = checkMembershipDirect(senderAddress);
	if (directCheck.isMember) {
		return directCheck;
	}

	// Second check: If signature provided, check if signer is a member
	if (signature && signMessage) {
		const signatureCheck = await checkMembershipViaSignature(taskId, signature, signMessage);
		if (signatureCheck.isMember) {
			return signatureCheck;
		}
	}

	// Not a member via either method
	return {
		isMember: false
	};
}

/**
 * Calculate fee breakdown for a sweep operation
 *
 * @param transactionCount - Number of transactions to execute
 * @param estimatedGasPerTx - Estimated gas per transaction in wei
 * @param isMember - Whether the user is a member
 * @returns Fee breakdown
 */
export function calculateFeeBreakdown(
	transactionCount: number,
	estimatedGasPerTx: bigint,
	isMember: boolean
): FeeBreakdown {
	// Sweep fee (only for non-members)
	const sweepFeePerTx = isMember ? 0 : SWEEP_FEE_PER_TRANSACTION;
	const totalSweepFee = sweepFeePerTx * transactionCount;

	// Convert sweep fee to wei (assuming 18 decimals for native coin)
	const sweepFeeInWei = BigInt(Math.floor(totalSweepFee * 1e18));

	// Total gas fee
	const totalGasFee = estimatedGasPerTx * BigInt(transactionCount);

	// Total cost = sweep fee + gas fee
	const totalCost = sweepFeeInWei + totalGasFee;

	return {
		transactionCount,
		sweepFeePerTx,
		totalSweepFee,
		estimatedGasFee: totalGasFee,
		totalCost,
		requiresPayment: !isMember
	};
}

/**
 * Format fee for display
 *
 * @param fee - Fee in wei
 * @param symbol - Token symbol (e.g., 'ETH', 'BNB')
 * @returns Formatted string
 */
export function formatFee(fee: bigint, symbol: string): string {
	const feeInEther = Number(fee) / 1e18;
	return `${feeInEther.toFixed(6)} ${symbol}`;
}

/**
 * Add a member to the membership list (admin function - for testing only)
 * In production, this would be managed by a smart contract
 *
 * @param address - Address to add as member
 */
export function addMember(address: Address): void {
	MOCK_MEMBERS.add(address.toLowerCase());
}

/**
 * Remove a member from the membership list (admin function - for testing only)
 *
 * @param address - Address to remove from membership
 */
export function removeMember(address: Address): void {
	MOCK_MEMBERS.delete(address.toLowerCase());
}

/**
 * Check if address is in mock member list (for testing/debugging)
 *
 * @param address - Address to check
 * @returns True if in mock member list
 */
export function isMockMember(address: Address): boolean {
	return MOCK_MEMBERS.has(address.toLowerCase());
}
