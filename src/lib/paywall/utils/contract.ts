/**
 * Contract utilities for reading membership status from BiuBiuPremium contract
 */

import type { Address, PublicClient } from 'viem';
import type { MembershipStatus } from '../types';
import BiuBiuPremiumABI from '../../../../static/contracts/BiuBiuPremium.json';

// BiuBiuPremium contract address (same across all chains)
export const BIUBIU_PREMIUM_CONTRACT = '0xc5c4bb399938625523250B708dc5c1e7dE4b1626' as Address;

/**
 * Read membership status from contract
 */
export async function readMembershipStatus(
	publicClient: PublicClient,
	address: Address
): Promise<MembershipStatus> {
	try {
		const result = await publicClient.readContract({
			address: BIUBIU_PREMIUM_CONTRACT,
			abi: BiuBiuPremiumABI.abi,
			functionName: 'getSubscriptionInfo',
			args: [address]
		});

		// Result is [isPremium, expiryTime, remainingTime]
		const [isPremium, expiryTime, remainingTime] = result as [boolean, bigint, bigint];

		return {
			isMember: isPremium,
			expiresAt: Number(expiryTime),
			remainingDays: Math.ceil(Number(remainingTime) / 86400)
		};
	} catch (error) {
		console.error('Failed to read membership status from contract:', error);
		// Return non-member status on error
		return {
			isMember: false,
			expiresAt: 0,
			remainingDays: 0
		};
	}
}
