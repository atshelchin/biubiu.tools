/**
 * NFT Contract ABIs
 * Simplified ABIs for deployment and basic interactions
 */

/**
 * ERC-721 Standard ABI (simplified)
 */
export const ERC721_ABI = [
	{
		inputs: [
			{ name: 'name', type: 'string' },
			{ name: 'symbol', type: 'string' }
		],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
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
		inputs: [
			{ name: 'to', type: 'address' },
			{ name: 'tokenId', type: 'uint256' }
		],
		name: 'mint',
		outputs: [],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [{ name: 'tokenId', type: 'uint256' }],
		name: 'ownerOf',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

/**
 * ERC-721A ABI (simplified, similar to ERC-721 but gas optimized)
 */
export const ERC721A_ABI = [
	{
		inputs: [
			{ name: 'name', type: 'string' },
			{ name: 'symbol', type: 'string' }
		],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
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
		inputs: [
			{ name: 'to', type: 'address' },
			{ name: 'quantity', type: 'uint256' }
		],
		name: 'mint',
		outputs: [],
		stateMutability: 'payable',
		type: 'function'
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [{ name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

/**
 * ERC-1155 ABI (simplified)
 */
export const ERC1155_ABI = [
	{
		inputs: [{ name: 'uri', type: 'string' }],
		stateMutability: 'nonpayable',
		type: 'constructor'
	},
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
		inputs: [
			{ name: 'to', type: 'address' },
			{ name: 'id', type: 'uint256' },
			{ name: 'amount', type: 'uint256' },
			{ name: 'data', type: 'bytes' }
		],
		name: 'mint',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	},
	{
		inputs: [{ name: 'tokenId', type: 'uint256' }],
		name: 'uri',
		outputs: [{ name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;
