/**
 * Contract utilities for reading membership status and pricing
 *
 * Uses configurable contract address and ABI from initPaywall()
 */

import type { Address, PublicClient } from 'viem';
import { formatEther } from 'viem';
import type { MembershipStatus, PricingInfo, FormattedPricing } from '../types';
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

/**
 * Read pricing info from contract
 * Reads DAILY_PRICE, MONTHLY_PRICE, YEARLY_PRICE, NON_MEMBER_FEE
 */
export async function readPricingInfo(publicClient: PublicClient): Promise<PricingInfo> {
	const config = getConfig();

	try {
		// Use multicall to batch read all prices in one RPC call
		const results = await publicClient.multicall({
			contracts: [
				{
					address: config.contract.address,
					abi: config.contract.abi,
					functionName: 'DAILY_PRICE'
				},
				{
					address: config.contract.address,
					abi: config.contract.abi,
					functionName: 'MONTHLY_PRICE'
				},
				{
					address: config.contract.address,
					abi: config.contract.abi,
					functionName: 'YEARLY_PRICE'
				},
				{
					address: config.contract.address,
					abi: config.contract.abi,
					functionName: 'NON_MEMBER_FEE'
				}
			]
		});

		// Extract results, using 0n as fallback for failed calls
		const dailyPrice = results[0].status === 'success' ? (results[0].result as bigint) : 0n;
		const monthlyPrice = results[1].status === 'success' ? (results[1].result as bigint) : 0n;
		const yearlyPrice = results[2].status === 'success' ? (results[2].result as bigint) : 0n;
		const nonMemberFee = results[3].status === 'success' ? (results[3].result as bigint) : 0n;

		return {
			dailyPrice,
			monthlyPrice,
			yearlyPrice,
			nonMemberFee
		};
	} catch (error) {
		console.error('Failed to read pricing info from contract:', error);
		// Return zeros on error
		return {
			dailyPrice: 0n,
			monthlyPrice: 0n,
			yearlyPrice: 0n,
			nonMemberFee: 0n
		};
	}
}

/**
 * Format pricing info to ETH strings
 */
export function formatPricing(pricing: PricingInfo): FormattedPricing {
	return {
		daily: formatEther(pricing.dailyPrice),
		monthly: formatEther(pricing.monthlyPrice),
		yearly: formatEther(pricing.yearlyPrice),
		perUse: formatEther(pricing.nonMemberFee)
	};
}

/**
 * Read and format pricing info in one call
 */
export async function readFormattedPricing(publicClient: PublicClient): Promise<FormattedPricing> {
	const pricing = await readPricingInfo(publicClient);
	return formatPricing(pricing);
}

/**
 * Read pricing info from a specific contract address
 * Useful when querying prices from different chains without global config
 */
export async function readPricingFromContract(
	publicClient: PublicClient,
	contractAddress: `0x${string}`,
	abi: readonly unknown[]
): Promise<PricingInfo> {
	try {
		// Use multicall to batch read all prices in one RPC call
		const results = await publicClient.multicall({
			contracts: [
				{
					address: contractAddress,
					abi,
					functionName: 'DAILY_PRICE'
				},
				{
					address: contractAddress,
					abi,
					functionName: 'MONTHLY_PRICE'
				},
				{
					address: contractAddress,
					abi,
					functionName: 'YEARLY_PRICE'
				},
				{
					address: contractAddress,
					abi,
					functionName: 'NON_MEMBER_FEE'
				}
			]
		});

		// Extract results, using 0n as fallback for failed calls
		const dailyPrice = results[0].status === 'success' ? (results[0].result as bigint) : 0n;
		const monthlyPrice = results[1].status === 'success' ? (results[1].result as bigint) : 0n;
		const yearlyPrice = results[2].status === 'success' ? (results[2].result as bigint) : 0n;
		const nonMemberFee = results[3].status === 'success' ? (results[3].result as bigint) : 0n;

		return {
			dailyPrice,
			monthlyPrice,
			yearlyPrice,
			nonMemberFee
		};
	} catch (error) {
		console.error('Failed to read pricing info from contract:', error);
		// Return zeros on error
		return {
			dailyPrice: 0n,
			monthlyPrice: 0n,
			yearlyPrice: 0n,
			nonMemberFee: 0n
		};
	}
}
