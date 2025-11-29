import type { Address } from 'viem';

/**
 * Moonshot token extended info
 */
export interface MoonshotTokenInfo {
	address: Address;
	name: string;
	symbol: string;
	decimals: number;
	totalSupply: bigint;
	virtualTokenReserves: bigint;
	virtualCollateralReserves: bigint;
	virtualCollateralReservesInitial: bigint; // Initial collateral reserves (used to calculate raised amount)
	marketCap: bigint;
	curveProgressBps: bigint; // Progress in basis points (0-10000)
	tradingStopped: boolean;
}

/**
 * Trade quote result
 */
export interface MoonshotQuote {
	amountOut: bigint;
	fee: bigint;
	totalCost: bigint; // For buys: ETH needed. For sells: tokens needed
	priceImpact: number; // Percentage
}

/**
 * Trade execution mode
 */
export type TradeMode = 'exactIn' | 'exactOut';
