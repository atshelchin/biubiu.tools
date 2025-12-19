/**
 * NFT Contract Loader
 * Utilities for loading NFT contract information (ERC721/ERC1155)
 */

import { createPublicClient, http, type Address, isAddress } from 'viem';

/**
 * ERC721 ABI for basic contract info
 */
const ERC721_INFO_ABI = [
	{
		inputs: [],
		name: 'name',
		outputs: [{ name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [{ name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [{ name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ name: 'owner', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ name: 'interfaceId', type: 'bytes4' }],
		name: 'supportsInterface',
		outputs: [{ name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

/**
 * ERC1155 ABI for basic contract info
 */
const ERC1155_INFO_ABI = [
	{
		inputs: [
			{ name: 'account', type: 'address' },
			{ name: 'id', type: 'uint256' }
		],
		name: 'balanceOf',
		outputs: [{ name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ name: 'tokenId', type: 'uint256' }],
		name: 'uri',
		outputs: [{ name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ name: 'interfaceId', type: 'bytes4' }],
		name: 'supportsInterface',
		outputs: [{ name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

// EIP-165 Interface IDs
const INTERFACE_IDS = {
	ERC721: '0x80ac58cd' as const,
	ERC1155: '0xd9b67a26' as const,
	ERC721_METADATA: '0x5b5e139f' as const,
	ERC721_ENUMERABLE: '0x780e9d63' as const
};

/**
 * NFT Contract Info
 */
export interface NFTContractInfo {
	address: Address;
	name: string;
	symbol: string;
	type: 'erc721' | 'erc1155';
	totalSupply?: bigint;
	userBalance?: bigint;
	isValid: boolean;
	error?: string;
}

/**
 * Validate if a string is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
	return isAddress(address);
}

/**
 * Load NFT contract info from chain
 */
export async function loadNFTContractInfo(
	rpcUrl: string,
	contractAddress: string,
	userAddress?: string,
	expectedType?: 'erc721' | 'erc1155'
): Promise<NFTContractInfo> {
	// Validate address format
	if (!isValidAddress(contractAddress)) {
		return {
			address: contractAddress as Address,
			name: '',
			symbol: '',
			type: expectedType || 'erc721',
			isValid: false,
			error: 'Invalid contract address format'
		};
	}

	const address = contractAddress as Address;

	try {
		const client = createPublicClient({
			transport: http(rpcUrl)
		});

		// Check if contract exists (has code)
		const bytecode = await client.getBytecode({ address });
		if (!bytecode || bytecode === '0x') {
			return {
				address,
				name: '',
				symbol: '',
				type: expectedType || 'erc721',
				isValid: false,
				error: 'No contract found at this address'
			};
		}

		// Detect contract type using EIP-165
		let detectedType: 'erc721' | 'erc1155' = expectedType || 'erc721';

		try {
			const [isERC721, isERC1155] = await Promise.all([
				client.readContract({
					address,
					abi: ERC721_INFO_ABI,
					functionName: 'supportsInterface',
					args: [INTERFACE_IDS.ERC721]
				}),
				client.readContract({
					address,
					abi: ERC1155_INFO_ABI,
					functionName: 'supportsInterface',
					args: [INTERFACE_IDS.ERC1155]
				})
			]);

			if (isERC1155) {
				detectedType = 'erc1155';
			} else if (isERC721) {
				detectedType = 'erc721';
			}
		} catch {
			// If supportsInterface fails, assume it's the expected type or ERC721
			// Some older contracts don't implement EIP-165
		}

		// Load contract info based on type
		let name = '';
		let symbol = '';
		let totalSupply: bigint | undefined;
		let userBalance: bigint | undefined;

		if (detectedType === 'erc721') {
			// Load ERC721 info
			const results = await Promise.allSettled([
				client.readContract({
					address,
					abi: ERC721_INFO_ABI,
					functionName: 'name'
				}),
				client.readContract({
					address,
					abi: ERC721_INFO_ABI,
					functionName: 'symbol'
				}),
				client.readContract({
					address,
					abi: ERC721_INFO_ABI,
					functionName: 'totalSupply'
				}),
				userAddress
					? client.readContract({
							address,
							abi: ERC721_INFO_ABI,
							functionName: 'balanceOf',
							args: [userAddress as Address]
						})
					: Promise.resolve(undefined)
			]);

			name = results[0].status === 'fulfilled' ? (results[0].value as string) : 'Unknown';
			symbol = results[1].status === 'fulfilled' ? (results[1].value as string) : '???';
			totalSupply = results[2].status === 'fulfilled' ? (results[2].value as bigint) : undefined;
			userBalance = results[3].status === 'fulfilled' ? (results[3].value as bigint) : undefined;
		} else {
			// ERC1155 doesn't have name/symbol at contract level typically
			// We'll try to read them anyway as some implementations have them
			const results = await Promise.allSettled([
				client.readContract({
					address,
					abi: ERC721_INFO_ABI, // Some ERC1155 have name/symbol
					functionName: 'name'
				}),
				client.readContract({
					address,
					abi: ERC721_INFO_ABI,
					functionName: 'symbol'
				})
			]);

			name =
				results[0].status === 'fulfilled' ? (results[0].value as string) : 'ERC1155 Collection';
			symbol = results[1].status === 'fulfilled' ? (results[1].value as string) : 'ERC1155';
		}

		return {
			address,
			name,
			symbol,
			type: detectedType,
			totalSupply,
			userBalance,
			isValid: true
		};
	} catch (error) {
		return {
			address,
			name: '',
			symbol: '',
			type: expectedType || 'erc721',
			isValid: false,
			error: error instanceof Error ? error.message : 'Failed to load contract info'
		};
	}
}

/**
 * Load ERC1155 token balance for a specific token ID
 */
export async function loadERC1155Balance(
	rpcUrl: string,
	contractAddress: string,
	tokenId: bigint,
	userAddress: string
): Promise<bigint> {
	if (!isValidAddress(contractAddress) || !isValidAddress(userAddress)) {
		return BigInt(0);
	}

	try {
		const client = createPublicClient({
			transport: http(rpcUrl)
		});

		const balance = await client.readContract({
			address: contractAddress as Address,
			abi: ERC1155_INFO_ABI,
			functionName: 'balanceOf',
			args: [userAddress as Address, tokenId]
		});

		return balance;
	} catch {
		return BigInt(0);
	}
}

/**
 * Parse token IDs from comma-separated string
 */
export function parseTokenIds(input: string): bigint[] {
	if (!input.trim()) return [];

	const ids: bigint[] = [];
	const parts = input.split(',');

	for (const part of parts) {
		const trimmed = part.trim();
		if (trimmed) {
			try {
				ids.push(BigInt(trimmed));
			} catch {
				// Skip invalid numbers
			}
		}
	}

	return ids;
}
