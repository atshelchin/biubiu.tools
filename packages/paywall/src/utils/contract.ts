/**
 * Contract utilities for reading membership status
 *
 * Uses configurable contract address and ABI from initPaywall()
 */

import type { Address, PublicClient } from 'viem';
import type { MembershipStatus } from '../types';
import { getConfig } from '../config';

/** Seconds per day (for remaining days calculation) */
const SECONDS_PER_DAY = 86400;

/**
 * Read membership status from contract
 */
export async function readMembershipStatus(
	publicClient: PublicClient,
	address: Address
): Promise<MembershipStatus> {
	const config = getConfig();

	try {
		const result = await publicClient.readContract({
			address: config.contract.address,
			abi: config.contract.abi,
			functionName: config.contract.functionName,
			args: [address]
		});

		// Result is expected to be [isPremium, expiryTime, remainingTime]
		const [isPremium, expiryTime, remainingTime] = result as [boolean, bigint, bigint];

		return {
			isMember: isPremium,
			expiresAt: Number(expiryTime),
			remainingDays: Math.ceil(Number(remainingTime) / SECONDS_PER_DAY)
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
