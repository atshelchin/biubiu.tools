/**
 * Moonshot Token Contract ABI
 * Based on the MoonshotToken.sol contract
 */
export const MOONSHOT_TOKEN_ABI = [
	// View functions
	{
		name: 'name',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'string' }]
	},
	{
		name: 'symbol',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'string' }]
	},
	{
		name: 'decimals',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint8' }]
	},
	{
		name: 'totalSupply',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint256' }]
	},
	{
		name: 'balanceOf',
		type: 'function',
		stateMutability: 'view',
		inputs: [{ name: 'account', type: 'address' }],
		outputs: [{ type: 'uint256' }]
	},
	{
		name: 'virtualTokenReserves',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint256' }]
	},
	{
		name: 'virtualCollateralReserves',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint256' }]
	},
	{
		name: 'virtualCollateralReservesInitial',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint256' }]
	},
	{
		name: 'getMarketCap',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint256' }]
	},
	{
		name: 'getCurveProgressBps',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'uint256' }]
	},
	{
		name: 'tradingStopped',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'bool' }]
	},
	{
		name: 'factory',
		type: 'function',
		stateMutability: 'view',
		inputs: [],
		outputs: [{ type: 'address' }]
	},
	{
		name: 'getAmountOutAndFee',
		type: 'function',
		stateMutability: 'view',
		inputs: [
			{ name: '_amountIn', type: 'uint256' },
			{ name: '_reserveIn', type: 'uint256' },
			{ name: '_reserveOut', type: 'uint256' },
			{ name: '_paymentTokenIsIn', type: 'bool' }
		],
		outputs: [
			{ name: 'amountOut', type: 'uint256' },
			{ name: 'fee', type: 'uint256' }
		]
	},
	{
		name: 'getAmountInAndFee',
		type: 'function',
		stateMutability: 'view',
		inputs: [
			{ name: '_amountOut', type: 'uint256' },
			{ name: '_reserveIn', type: 'uint256' },
			{ name: '_reserveOut', type: 'uint256' },
			{ name: '_paymentTokenIsOut', type: 'bool' }
		],
		outputs: [
			{ name: 'amountIn', type: 'uint256' },
			{ name: 'fee', type: 'uint256' }
		]
	},
	// ERC20 functions
	{
		name: 'approve',
		type: 'function',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: 'spender', type: 'address' },
			{ name: 'amount', type: 'uint256' }
		],
		outputs: [{ type: 'bool' }]
	},
	{
		name: 'allowance',
		type: 'function',
		stateMutability: 'view',
		inputs: [
			{ name: 'owner', type: 'address' },
			{ name: 'spender', type: 'address' }
		],
		outputs: [{ type: 'uint256' }]
	}
] as const;

/**
 * Moonshot Factory Contract ABI
 * Based on the MoonshotFactory.sol contract
 */
export const MOONSHOT_FACTORY_ABI = [
	// View functions
	{
		name: 'moonshotTokens',
		type: 'function',
		stateMutability: 'view',
		inputs: [{ name: '', type: 'uint256' }],
		outputs: [{ type: 'address' }]
	},
	{
		name: 'readyForMigration',
		type: 'function',
		stateMutability: 'view',
		inputs: [{ name: '', type: 'address' }],
		outputs: [{ type: 'bool' }]
	},
	// Trade functions
	{
		name: 'buyExactIn',
		type: 'function',
		stateMutability: 'payable',
		inputs: [
			{ name: '_token', type: 'address' },
			{ name: '_amountOutMin', type: 'uint256' }
		],
		outputs: []
	},
	{
		name: 'buyExactOut',
		type: 'function',
		stateMutability: 'payable',
		inputs: [
			{ name: '_token', type: 'address' },
			{ name: '_tokenAmount', type: 'uint256' },
			{ name: '_maxCollateralAmount', type: 'uint256' }
		],
		outputs: []
	},
	{
		name: 'sellExactIn',
		type: 'function',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: '_token', type: 'address' },
			{ name: '_tokenAmount', type: 'uint256' },
			{ name: '_amountCollateralMin', type: 'uint256' }
		],
		outputs: []
	},
	{
		name: 'sellExactOut',
		type: 'function',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: '_token', type: 'address' },
			{ name: '_tokenAmountMax', type: 'uint256' },
			{ name: '_amountCollateral', type: 'uint256' }
		],
		outputs: []
	},
	// Events
	{
		name: 'BuyExactIn',
		type: 'event',
		anonymous: false,
		inputs: [
			{ name: 'buyer', type: 'address', indexed: true },
			{ name: 'token', type: 'address', indexed: true },
			{ name: 'tokensOut', type: 'uint256', indexed: false },
			{ name: 'circulatingSupply', type: 'uint256', indexed: false },
			{ name: 'collateralToPayWithFee', type: 'uint256', indexed: false },
			{ name: 'helioFee', type: 'uint256', indexed: false },
			{ name: 'dexFee', type: 'uint256', indexed: false },
			{ name: 'curveProgress', type: 'uint256', indexed: false }
		]
	},
	{
		name: 'BuyExactOut',
		type: 'event',
		anonymous: false,
		inputs: [
			{ name: 'buyer', type: 'address', indexed: true },
			{ name: 'token', type: 'address', indexed: true },
			{ name: 'tokenAmount', type: 'uint256', indexed: false },
			{ name: 'circulatingSupply', type: 'uint256', indexed: false },
			{ name: 'collateralToPayWithFee', type: 'uint256', indexed: false },
			{ name: 'refund', type: 'uint256', indexed: false },
			{ name: 'helioFee', type: 'uint256', indexed: false },
			{ name: 'dexFee', type: 'uint256', indexed: false },
			{ name: 'curveProgress', type: 'uint256', indexed: false }
		]
	},
	{
		name: 'SellExactIn',
		type: 'event',
		anonymous: false,
		inputs: [
			{ name: 'seller', type: 'address', indexed: true },
			{ name: 'token', type: 'address', indexed: true },
			{ name: 'tokenAmount', type: 'uint256', indexed: false },
			{ name: 'circulatingSupply', type: 'uint256', indexed: false },
			{ name: 'collateralToReceiveMinusFee', type: 'uint256', indexed: false },
			{ name: 'helioFee', type: 'uint256', indexed: false },
			{ name: 'dexFee', type: 'uint256', indexed: false },
			{ name: 'curveProgress', type: 'uint256', indexed: false }
		]
	},
	{
		name: 'SellExactOut',
		type: 'event',
		anonymous: false,
		inputs: [
			{ name: 'seller', type: 'address', indexed: true },
			{ name: 'token', type: 'address', indexed: true },
			{ name: 'tokensOut', type: 'uint256', indexed: false },
			{ name: 'circulatingSupply', type: 'uint256', indexed: false },
			{ name: 'collateralToReceiveMinusFee', type: 'uint256', indexed: false },
			{ name: 'helioFee', type: 'uint256', indexed: false },
			{ name: 'dexFee', type: 'uint256', indexed: false },
			{ name: 'curveProgress', type: 'uint256', indexed: false }
		]
	}
] as const;
