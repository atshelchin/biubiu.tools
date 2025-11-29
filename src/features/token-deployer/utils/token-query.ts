import { readContract, type Address, type PublicClient } from 'viem';
import { KNOWN_CONTRACTS } from '$lib/utils/blockchain-checker';
import type { DeployedTokenInfo } from '../types/token';

// Standard ERC20 ABI for reading token info
const ERC20_ABI = [
	{
		type: 'function',
		name: 'name',
		inputs: [],
		outputs: [{ name: '', type: 'string' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'symbol',
		inputs: [],
		outputs: [{ name: '', type: 'string' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'decimals',
		inputs: [],
		outputs: [{ name: '', type: 'uint8' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'totalSupply',
		inputs: [],
		outputs: [{ name: '', type: 'uint256' }],
		stateMutability: 'view'
	}
] as const;

const TOKEN_FACTORY_ABI = [
	{
		type: 'function',
		name: 'getUserTokens',
		inputs: [{ name: 'user', type: 'address' }],
		outputs: [{ name: '', type: 'address[]' }],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'getAllTokens',
		inputs: [],
		outputs: [{ name: '', type: 'address[]' }],
		stateMutability: 'view'
	}
] as const;

/**
 * Get token info from blockchain
 */
async function getTokenInfo(
	publicClient: PublicClient,
	tokenAddress: Address,
	chainId: number
): Promise<DeployedTokenInfo | null> {
	try {
		const [name, symbol, decimals, totalSupply] = await Promise.all([
			readContract({
				address: tokenAddress,
				abi: ERC20_ABI,
				functionName: 'name',
				// @ts-expect-error - viem types are complex
				client: publicClient
			}),
			readContract({
				address: tokenAddress,
				abi: ERC20_ABI,
				functionName: 'symbol',
				// @ts-expect-error - viem types are complex
				client: publicClient
			}),
			readContract({
				address: tokenAddress,
				abi: ERC20_ABI,
				functionName: 'decimals',
				// @ts-expect-error - viem types are complex
				client: publicClient
			}),
			readContract({
				address: tokenAddress,
				abi: ERC20_ABI,
				functionName: 'totalSupply',
				// @ts-expect-error - viem types are complex
				client: publicClient
			})
		]);

		return {
			address: tokenAddress,
			name: name as string,
			symbol: symbol as string,
			decimals: decimals as number,
			totalSupply: (totalSupply as bigint).toString(),
			deployer: '0x0000000000000000000000000000000000000000' as Address, // Will be filled by caller
			deployedAt: 0, // Will be filled by caller if available
			chainId
		};
	} catch (error) {
		console.error(`[TokenQuery] Failed to get token info for ${tokenAddress}:`, error);
		return null;
	}
}

/**
 * Get tokens deployed by a specific user
 */
export async function getUserDeployedTokens(
	publicClient: PublicClient,
	userAddress: Address,
	chainId: number
): Promise<DeployedTokenInfo[]> {
	try {
		// Get token addresses from TokenFactory
		const tokenAddresses = (await readContract({
			address: KNOWN_CONTRACTS.TOKEN_FACTORY,
			abi: TOKEN_FACTORY_ABI,
			functionName: 'getUserTokens',
			args: [userAddress],
			// @ts-expect-error - viem types are complex
			client: publicClient
		})) as Address[];

		if (!tokenAddresses || tokenAddresses.length === 0) {
			return [];
		}

		// Fetch detailed info for each token
		const tokenInfoPromises = tokenAddresses.map((address) =>
			getTokenInfo(publicClient, address, chainId)
		);
		const tokenInfos = await Promise.all(tokenInfoPromises);

		// Filter out null results and add deployer info
		return tokenInfos
			.filter((info): info is DeployedTokenInfo => info !== null)
			.map((info) => ({ ...info, deployer: userAddress }));
	} catch (error) {
		console.error('[TokenQuery] Failed to get user deployed tokens:', error);
		return [];
	}
}

/**
 * Get all deployed tokens
 */
export async function getAllDeployedTokens(
	publicClient: PublicClient,
	chainId: number
): Promise<DeployedTokenInfo[]> {
	try {
		// Get all token addresses from TokenFactory
		const tokenAddresses = (await readContract({
			address: KNOWN_CONTRACTS.TOKEN_FACTORY,
			abi: TOKEN_FACTORY_ABI,
			functionName: 'getAllTokens',
			// @ts-expect-error - viem types are complex
			client: publicClient
		})) as Address[];

		if (!tokenAddresses || tokenAddresses.length === 0) {
			return [];
		}

		// Fetch detailed info for each token
		const tokenInfoPromises = tokenAddresses.map((address) =>
			getTokenInfo(publicClient, address, chainId)
		);
		const tokenInfos = await Promise.all(tokenInfoPromises);

		// Filter out null results
		return tokenInfos.filter((info): info is DeployedTokenInfo => info !== null);
	} catch (error) {
		console.error('[TokenQuery] Failed to get all deployed tokens:', error);
		return [];
	}
}
