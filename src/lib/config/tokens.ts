import type { ERC20Token } from '$lib/types/token';
import type { Address } from 'viem';

/**
 * Predefined ERC20 tokens grouped by chain ID
 * Note: Native tokens are auto-generated from network config in token-selector component
 */
export const PREDEFINED_TOKENS: Record<number, ERC20Token[]> = {
	// Ethereum Mainnet
	1: [
		{
			id: '1:0xdac17f958d2ee523a2206206994597c13d831ec7',
			type: 'erc20',
			address: '0xdac17f958d2ee523a2206206994597c13d831ec7' as Address,
			symbol: 'USDT',
			name: 'Tether USD',
			decimals: 6,
			chainId: 1,
			logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.svg'
		},
		{
			id: '1:0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			type: 'erc20',
			address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' as Address,
			symbol: 'USDC',
			name: 'USD Coin',
			decimals: 6,
			chainId: 1,
			logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg'
		},
		{
			id: '1:0x6b175474e89094c44da98b954eedeac495271d0f',
			type: 'erc20',
			address: '0x6b175474e89094c44da98b954eedeac495271d0f' as Address,
			symbol: 'DAI',
			name: 'Dai Stablecoin',
			decimals: 18,
			chainId: 1,
			logoUrl: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg'
		}
	],

	// BSC Mainnet
	56: [
		{
			id: '56:0x55d398326f99059ff775485246999027b3197955',
			type: 'erc20',
			address: '0x55d398326f99059ff775485246999027b3197955' as Address,
			symbol: 'USDT',
			name: 'Tether USD',
			decimals: 18,
			chainId: 56,
			logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.svg'
		},
		{
			id: '56:0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
			type: 'erc20',
			address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d' as Address,
			symbol: 'USDC',
			name: 'USD Coin',
			decimals: 18,
			chainId: 56,
			logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg'
		},
		{
			id: '56:0x2170ed0880ac9a755fd29b2688956bd959f933f8',
			type: 'erc20',
			address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8' as Address,
			symbol: 'ETH',
			name: 'Ethereum Token',
			decimals: 18,
			chainId: 56,
			logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'
		}
	],

	// Polygon Mainnet
	137: [
		{
			id: '137:0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
			type: 'erc20',
			address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f' as Address,
			symbol: 'USDT',
			name: 'Tether USD',
			decimals: 6,
			chainId: 137,
			logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.svg'
		},
		{
			id: '137:0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
			type: 'erc20',
			address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' as Address,
			symbol: 'USDC',
			name: 'USD Coin',
			decimals: 6,
			chainId: 137,
			logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg'
		},
		{
			id: '137:0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
			type: 'erc20',
			address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619' as Address,
			symbol: 'WETH',
			name: 'Wrapped Ether',
			decimals: 18,
			chainId: 137,
			logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'
		}
	],

	// Arbitrum One
	42161: [
		{
			id: '42161:0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
			type: 'erc20',
			address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9' as Address,
			symbol: 'USDT',
			name: 'Tether USD',
			decimals: 6,
			chainId: 42161,
			logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.svg'
		},
		{
			id: '42161:0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
			type: 'erc20',
			address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8' as Address,
			symbol: 'USDC',
			name: 'USD Coin',
			decimals: 6,
			chainId: 42161,
			logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg'
		}
	],

	// Optimism
	10: [
		{
			id: '10:0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
			type: 'erc20',
			address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58' as Address,
			symbol: 'USDT',
			name: 'Tether USD',
			decimals: 6,
			chainId: 10,
			logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.svg'
		},
		{
			id: '10:0x7f5c764cbc14f9669b88837ca1490cca17c31607',
			type: 'erc20',
			address: '0x7f5c764cbc14f9669b88837ca1490cca17c31607' as Address,
			symbol: 'USDC',
			name: 'USD Coin',
			decimals: 6,
			chainId: 10,
			logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg'
		}
	],

	// Sepolia Testnet
	11155111: []
};

/**
 * Get ERC20 tokens for a specific chain
 */
export function getTokensForChain(chainId: number): ERC20Token[] {
	return PREDEFINED_TOKENS[chainId] || [];
}
