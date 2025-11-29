/**
 * NFT Query Utilities
 * Utilities for querying NFTs from NFTFactory contract
 */

import type { Address, PublicClient } from 'viem';
import { NFT_FACTORY_ABI } from '../contracts/abis';
import type { NFTInfo } from '../types/nft';

/**
 * Query user's NFTs with pagination
 */
export async function getUserNFTsPaginated(
	client: PublicClient,
	factoryAddress: Address,
	userAddress: Address,
	offset: number,
	limit: number
): Promise<{ nftInfos: NFTInfo[]; total: bigint }> {
	const result = await client.readContract({
		address: factoryAddress,
		abi: NFT_FACTORY_ABI,
		functionName: 'getUserNFTsInfoPaginated',
		args: [userAddress, BigInt(offset), BigInt(limit)]
	});

	return {
		nftInfos: result[0].map((info) => ({
			nftAddress: info.nftAddress,
			name: info.name,
			symbol: info.symbol,
			creator: info.creator,
			stakeToMintEnabled: info.stakeToMintEnabled,
			stakeToken: info.stakeToken
		})),
		total: result[1]
	};
}

/**
 * Query all NFTs with pagination
 */
export async function getAllNFTsPaginated(
	client: PublicClient,
	factoryAddress: Address,
	offset: number,
	limit: number
): Promise<{ nftInfos: NFTInfo[]; total: bigint }> {
	const result = await client.readContract({
		address: factoryAddress,
		abi: NFT_FACTORY_ABI,
		functionName: 'getAllNFTsInfoPaginated',
		args: [BigInt(offset), BigInt(limit)]
	});

	return {
		nftInfos: result[0].map((info) => ({
			nftAddress: info.nftAddress,
			name: info.name,
			symbol: info.symbol,
			creator: info.creator,
			stakeToMintEnabled: info.stakeToMintEnabled,
			stakeToken: info.stakeToken
		})),
		total: result[1]
	};
}

/**
 * Get NFT info by address
 */
export async function getNFTInfo(
	client: PublicClient,
	factoryAddress: Address,
	nftAddress: Address
): Promise<NFTInfo> {
	const result = await client.readContract({
		address: factoryAddress,
		abi: NFT_FACTORY_ABI,
		functionName: 'getNFTInfo',
		args: [nftAddress]
	});

	return {
		nftAddress: result.nftAddress,
		name: result.name,
		symbol: result.symbol,
		creator: result.creator,
		stakeToMintEnabled: result.stakeToMintEnabled,
		stakeToken: result.stakeToken
	};
}
