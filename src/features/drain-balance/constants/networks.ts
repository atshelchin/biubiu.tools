import type { Network, Token } from '../types';

export const SUPPORTED_NETWORKS: Network[] = [
	{
		chainId: 1,
		name: 'Ethereum Mainnet',
		rpcUrl: 'https://eth.llamarpc.com',
		nativeCurrency: {
			name: 'Ether',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorer: 'https://etherscan.io',
		features: ['EIP-1559', 'EIP-4895']
	},
	{
		chainId: 11155111,
		name: 'Sepolia Testnet',
		rpcUrl: 'https://rpc.sepolia.org',
		nativeCurrency: {
			name: 'Sepolia ETH',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorer: 'https://sepolia.etherscan.io',
		features: ['EIP-1559', 'EIP-4895']
	},
	{
		chainId: 137,
		name: 'Polygon',
		rpcUrl: 'https://polygon-rpc.com',
		nativeCurrency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18
		},
		blockExplorer: 'https://polygonscan.com',
		features: ['EIP-1559']
	},
	{
		chainId: 56,
		name: 'BNB Chain',
		rpcUrl: 'https://bsc-dataseed1.binance.org',
		nativeCurrency: {
			name: 'BNB',
			symbol: 'BNB',
			decimals: 18
		},
		blockExplorer: 'https://bscscan.com',
		features: ['EIP-1559']
	},
	{
		chainId: 42161,
		name: 'Arbitrum One',
		rpcUrl: 'https://arb1.arbitrum.io/rpc',
		nativeCurrency: {
			name: 'Arbitrum ETH',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorer: 'https://arbiscan.io',
		features: ['EIP-1559']
	},
	{
		chainId: 10,
		name: 'Optimism',
		rpcUrl: 'https://mainnet.optimism.io',
		nativeCurrency: {
			name: 'Optimism ETH',
			symbol: 'ETH',
			decimals: 18
		},
		blockExplorer: 'https://optimistic.etherscan.io',
		features: ['EIP-1559']
	}
];

// Common tokens for each network
export const COMMON_TOKENS: Record<number, Token[]> = {
	// Ethereum Mainnet
	1: [
		{
			address: '0x0000000000000000000000000000000000000000',
			symbol: 'ETH',
			name: 'Ether',
			decimals: 18
		},
		{
			address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
			symbol: 'USDC',
			name: 'USD Coin',
			decimals: 6
		},
		{
			address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
			symbol: 'USDT',
			name: 'Tether USD',
			decimals: 6
		},
		{
			address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
			symbol: 'DAI',
			name: 'Dai Stablecoin',
			decimals: 18
		}
	],
	// Sepolia Testnet
	11155111: [
		{
			address: '0x0000000000000000000000000000000000000000',
			symbol: 'ETH',
			name: 'Sepolia ETH',
			decimals: 18
		}
	],
	// Polygon
	137: [
		{
			address: '0x0000000000000000000000000000000000000000',
			symbol: 'MATIC',
			name: 'MATIC',
			decimals: 18
		},
		{
			address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
			symbol: 'USDC',
			name: 'USD Coin',
			decimals: 6
		},
		{
			address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
			symbol: 'USDT',
			name: 'Tether USD',
			decimals: 6
		}
	],
	// BNB Chain
	56: [
		{
			address: '0x0000000000000000000000000000000000000000',
			symbol: 'BNB',
			name: 'BNB',
			decimals: 18
		},
		{
			address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
			symbol: 'USDC',
			name: 'USD Coin',
			decimals: 18
		},
		{
			address: '0x55d398326f99059fF775485246999027B3197955',
			symbol: 'USDT',
			name: 'Tether USD',
			decimals: 18
		}
	],
	// Arbitrum One
	42161: [
		{
			address: '0x0000000000000000000000000000000000000000',
			symbol: 'ETH',
			name: 'Arbitrum ETH',
			decimals: 18
		},
		{
			address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
			symbol: 'USDC',
			name: 'USD Coin',
			decimals: 6
		},
		{
			address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
			symbol: 'USDT',
			name: 'Tether USD',
			decimals: 6
		}
	],
	// Optimism
	10: [
		{
			address: '0x0000000000000000000000000000000000000000',
			symbol: 'ETH',
			name: 'Optimism ETH',
			decimals: 18
		},
		{
			address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
			symbol: 'USDC',
			name: 'USD Coin',
			decimals: 6
		},
		{
			address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
			symbol: 'USDT',
			name: 'Tether USD',
			decimals: 6
		}
	]
};
