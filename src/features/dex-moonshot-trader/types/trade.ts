import type { Address } from 'viem';

/**
 * Trade type
 */
export type TradeType = 'buy' | 'sell';

/**
 * Trade status
 */
export type TradeStatus = 'idle' | 'preparing' | 'pending' | 'success' | 'error';

/**
 * Trade configuration
 */
export interface TradeConfig {
	tokenAddress: Address;
	tradeType: TradeType;
	amount: string; // Amount in ether/token units (not wei)
	slippage: number; // Slippage percentage (e.g., 0.5 for 0.5%)
	recipient?: Address; // Optional recipient address (defaults to connected wallet)
}

/**
 * Trade quote/estimation
 */
export interface TradeQuote {
	inputAmount: bigint; // Amount to send
	outputAmount: bigint; // Expected amount to receive
	minimumOutputAmount: bigint; // Minimum amount considering slippage
	priceImpact: number; // Price impact percentage
	gasEstimate: bigint;
}

/**
 * Trade execution result
 */
export interface TradeResult {
	success: boolean;
	transactionHash?: string;
	actualOutputAmount?: bigint;
	gasUsed?: bigint;
	error?: string;
}

/**
 * DEX router configuration
 */
export interface DexRouterConfig {
	routerAddress: Address;
	factoryAddress: Address;
	wethAddress: Address;
}
