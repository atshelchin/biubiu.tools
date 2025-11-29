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
export const NFT_FACTORY_ABI = [
	{
		type: 'function',
		name: 'allNFTs',
		inputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address'
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'allNFTsLength',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'createERC721',
		inputs: [
			{
				name: 'name',
				type: 'string',
				internalType: 'string'
			},
			{
				name: 'symbol',
				type: 'string',
				internalType: 'string'
			},
			{
				name: 'baseURI',
				type: 'string',
				internalType: 'string'
			},
			{
				name: 'publicMintEnabled',
				type: 'bool',
				internalType: 'bool'
			},
			{
				name: 'stakeToMintEnabled',
				type: 'bool',
				internalType: 'bool'
			},
			{
				name: 'stakeToken',
				type: 'address',
				internalType: 'address'
			},
			{
				name: 'stakeAmount',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address'
			}
		],
		stateMutability: 'nonpayable'
	},
	{
		type: 'function',
		name: 'getAllNFTs',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address[]',
				internalType: 'address[]'
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'getAllNFTsInfoPaginated',
		inputs: [
			{
				name: 'offset',
				type: 'uint256',
				internalType: 'uint256'
			},
			{
				name: 'limit',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		outputs: [
			{
				name: 'nftInfos',
				type: 'tuple[]',
				internalType: 'struct NFTFactory.NFTInfo[]',
				components: [
					{
						name: 'nftAddress',
						type: 'address',
						internalType: 'address'
					},
					{
						name: 'name',
						type: 'string',
						internalType: 'string'
					},
					{
						name: 'symbol',
						type: 'string',
						internalType: 'string'
					},
					{
						name: 'creator',
						type: 'address',
						internalType: 'address'
					},
					{
						name: 'stakeToMintEnabled',
						type: 'bool',
						internalType: 'bool'
					},
					{
						name: 'stakeToken',
						type: 'address',
						internalType: 'address'
					}
				]
			},
			{
				name: 'total',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'getAllNFTsPaginated',
		inputs: [
			{
				name: 'offset',
				type: 'uint256',
				internalType: 'uint256'
			},
			{
				name: 'limit',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		outputs: [
			{
				name: 'nfts',
				type: 'address[]',
				internalType: 'address[]'
			},
			{
				name: 'total',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'getNFTInfo',
		inputs: [
			{
				name: 'nftAddress',
				type: 'address',
				internalType: 'address'
			}
		],
		outputs: [
			{
				name: 'info',
				type: 'tuple',
				internalType: 'struct NFTFactory.NFTInfo',
				components: [
					{
						name: 'nftAddress',
						type: 'address',
						internalType: 'address'
					},
					{
						name: 'name',
						type: 'string',
						internalType: 'string'
					},
					{
						name: 'symbol',
						type: 'string',
						internalType: 'string'
					},
					{
						name: 'creator',
						type: 'address',
						internalType: 'address'
					},
					{
						name: 'stakeToMintEnabled',
						type: 'bool',
						internalType: 'bool'
					},
					{
						name: 'stakeToken',
						type: 'address',
						internalType: 'address'
					}
				]
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'getUserNFTs',
		inputs: [
			{
				name: 'user',
				type: 'address',
				internalType: 'address'
			}
		],
		outputs: [
			{
				name: '',
				type: 'address[]',
				internalType: 'address[]'
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'getUserNFTsInfoPaginated',
		inputs: [
			{
				name: 'user',
				type: 'address',
				internalType: 'address'
			},
			{
				name: 'offset',
				type: 'uint256',
				internalType: 'uint256'
			},
			{
				name: 'limit',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		outputs: [
			{
				name: 'nftInfos',
				type: 'tuple[]',
				internalType: 'struct NFTFactory.NFTInfo[]',
				components: [
					{
						name: 'nftAddress',
						type: 'address',
						internalType: 'address'
					},
					{
						name: 'name',
						type: 'string',
						internalType: 'string'
					},
					{
						name: 'symbol',
						type: 'string',
						internalType: 'string'
					},
					{
						name: 'creator',
						type: 'address',
						internalType: 'address'
					},
					{
						name: 'stakeToMintEnabled',
						type: 'bool',
						internalType: 'bool'
					},
					{
						name: 'stakeToken',
						type: 'address',
						internalType: 'address'
					}
				]
			},
			{
				name: 'total',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'getUserNFTsPaginated',
		inputs: [
			{
				name: 'user',
				type: 'address',
				internalType: 'address'
			},
			{
				name: 'offset',
				type: 'uint256',
				internalType: 'uint256'
			},
			{
				name: 'limit',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		outputs: [
			{
				name: 'nfts',
				type: 'address[]',
				internalType: 'address[]'
			},
			{
				name: 'total',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'userNFTs',
		inputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address'
			},
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'address'
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'function',
		name: 'userNFTsLength',
		inputs: [
			{
				name: 'user',
				type: 'address',
				internalType: 'address'
			}
		],
		outputs: [
			{
				name: '',
				type: 'uint256',
				internalType: 'uint256'
			}
		],
		stateMutability: 'view'
	},
	{
		type: 'event',
		name: 'NFTCreated',
		inputs: [
			{
				name: 'nftAddress',
				type: 'address',
				indexed: true,
				internalType: 'address'
			},
			{
				name: 'creator',
				type: 'address',
				indexed: true,
				internalType: 'address'
			},
			{
				name: 'name',
				type: 'string',
				indexed: false,
				internalType: 'string'
			},
			{
				name: 'symbol',
				type: 'string',
				indexed: false,
				internalType: 'string'
			},
			{
				name: 'stakeToMintEnabled',
				type: 'bool',
				indexed: false,
				internalType: 'bool'
			},
			{
				name: 'stakeToken',
				type: 'address',
				indexed: false,
				internalType: 'address'
			}
		],
		anonymous: false
	}
] as const;
