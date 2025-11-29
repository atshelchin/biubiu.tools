import type { Address, PublicClient, WalletClient } from 'viem';
import { parseEther, formatEther, encodeFunctionData, decodeFunctionResult } from 'viem';
import { MOONSHOT_TOKEN_ABI, MOONSHOT_FACTORY_ABI } from '../contracts/moonshot-abi';
import type { MoonshotTokenInfo, MoonshotQuote } from '../types/moonshot';

// Multicall3 address (same on all chains)
const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11' as Address;

const MULTICALL3_ABI = [
	{
		inputs: [
			{
				components: [
					{ name: 'target', type: 'address' },
					{ name: 'allowFailure', type: 'bool' },
					{ name: 'callData', type: 'bytes' }
				],
				name: 'calls',
				type: 'tuple[]'
			}
		],
		name: 'aggregate3',
		outputs: [
			{
				components: [
					{ name: 'success', type: 'bool' },
					{ name: 'returnData', type: 'bytes' }
				],
				name: 'returnData',
				type: 'tuple[]'
			}
		],
		stateMutability: 'payable',
		type: 'function'
	}
] as const;

/**
 * Service for interacting with Moonshot contracts
 */
export class MoonshotService {
	constructor(
		private publicClient: PublicClient,
		private walletClient: WalletClient | null,
		private factoryAddress: Address
	) {}

	/**
	 * Get detailed info about a Moonshot token using Multicall3
	 */
	async getTokenInfo(tokenAddress: Address): Promise<MoonshotTokenInfo> {
		// Prepare multicall calls
		const calls = [
			{
				target: tokenAddress,
				allowFailure: false,
				callData: encodeFunctionData({
					abi: MOONSHOT_TOKEN_ABI,
					functionName: 'name'
				})
			},
			{
				target: tokenAddress,
				allowFailure: false,
				callData: encodeFunctionData({
					abi: MOONSHOT_TOKEN_ABI,
					functionName: 'symbol'
				})
			},
			{
				target: tokenAddress,
				allowFailure: false,
				callData: encodeFunctionData({
					abi: MOONSHOT_TOKEN_ABI,
					functionName: 'decimals'
				})
			},
			{
				target: tokenAddress,
				allowFailure: false,
				callData: encodeFunctionData({
					abi: MOONSHOT_TOKEN_ABI,
					functionName: 'totalSupply'
				})
			},
			{
				target: tokenAddress,
				allowFailure: false,
				callData: encodeFunctionData({
					abi: MOONSHOT_TOKEN_ABI,
					functionName: 'virtualTokenReserves'
				})
			},
			{
				target: tokenAddress,
				allowFailure: false,
				callData: encodeFunctionData({
					abi: MOONSHOT_TOKEN_ABI,
					functionName: 'virtualCollateralReserves'
				})
			},
			{
				target: tokenAddress,
				allowFailure: false,
				callData: encodeFunctionData({
					abi: MOONSHOT_TOKEN_ABI,
					functionName: 'virtualCollateralReservesInitial'
				})
			},
			{
				target: tokenAddress,
				allowFailure: false,
				callData: encodeFunctionData({
					abi: MOONSHOT_TOKEN_ABI,
					functionName: 'getMarketCap'
				})
			},
			{
				target: tokenAddress,
				allowFailure: false,
				callData: encodeFunctionData({
					abi: MOONSHOT_TOKEN_ABI,
					functionName: 'getCurveProgressBps'
				})
			},
			{
				target: tokenAddress,
				allowFailure: false,
				callData: encodeFunctionData({
					abi: MOONSHOT_TOKEN_ABI,
					functionName: 'tradingStopped'
				})
			}
		];

		// Execute multicall
		const results = (await this.publicClient.readContract({
			address: MULTICALL3_ADDRESS,
			abi: MULTICALL3_ABI,
			functionName: 'aggregate3',
			args: [calls]
		})) as Array<{ success: boolean; returnData: `0x${string}` }>;

		// Decode results
		const name = decodeFunctionResult({
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'name',
			data: results[0].returnData
		}) as string;

		const symbol = decodeFunctionResult({
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'symbol',
			data: results[1].returnData
		}) as string;

		const decimals = decodeFunctionResult({
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'decimals',
			data: results[2].returnData
		}) as number;

		const totalSupply = decodeFunctionResult({
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'totalSupply',
			data: results[3].returnData
		}) as bigint;

		const virtualTokenReserves = decodeFunctionResult({
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'virtualTokenReserves',
			data: results[4].returnData
		}) as bigint;

		const virtualCollateralReserves = decodeFunctionResult({
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'virtualCollateralReserves',
			data: results[5].returnData
		}) as bigint;

		const virtualCollateralReservesInitial = decodeFunctionResult({
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'virtualCollateralReservesInitial',
			data: results[6].returnData
		}) as bigint;

		const marketCap = decodeFunctionResult({
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'getMarketCap',
			data: results[7].returnData
		}) as bigint;

		const curveProgressBps = decodeFunctionResult({
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'getCurveProgressBps',
			data: results[8].returnData
		}) as bigint;

		const tradingStopped = decodeFunctionResult({
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'tradingStopped',
			data: results[9].returnData
		}) as boolean;

		return {
			address: tokenAddress,
			name,
			symbol,
			decimals,
			totalSupply,
			virtualTokenReserves,
			virtualCollateralReserves,
			virtualCollateralReservesInitial,
			marketCap,
			curveProgressBps,
			tradingStopped
		};
	}

	/**
	 * Get quote for buying tokens with exact ETH input
	 */
	async getBuyQuoteExactIn(
		tokenAddress: Address,
		ethAmount: string | bigint
	): Promise<MoonshotQuote> {
		const tokenInfo = await this.getTokenInfo(tokenAddress);
		const amountIn = typeof ethAmount === 'string' ? parseEther(ethAmount) : ethAmount;

		const [amountOut, fee] = (await this.publicClient.readContract({
			address: tokenAddress,
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'getAmountOutAndFee',
			args: [
				amountIn,
				tokenInfo.virtualCollateralReserves,
				tokenInfo.virtualTokenReserves,
				true // payment token (ETH) is in
			]
		})) as [bigint, bigint];

		const priceImpact = this.calculatePriceImpact(
			amountIn,
			tokenInfo.virtualCollateralReserves,
			amountOut,
			tokenInfo.virtualTokenReserves
		);

		return {
			amountOut,
			fee,
			totalCost: amountIn,
			priceImpact
		};
	}

	/**
	 * Get quote for buying exact amount of tokens
	 */
	async getBuyQuoteExactOut(tokenAddress: Address, tokenAmount: bigint): Promise<MoonshotQuote> {
		const tokenInfo = await this.getTokenInfo(tokenAddress);

		const [amountIn, fee] = (await this.publicClient.readContract({
			address: tokenAddress,
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'getAmountInAndFee',
			args: [
				tokenAmount,
				tokenInfo.virtualCollateralReserves,
				tokenInfo.virtualTokenReserves,
				false // payment token (ETH) is not out
			]
		})) as [bigint, bigint];

		const totalCost = amountIn + fee;

		const priceImpact = this.calculatePriceImpact(
			totalCost,
			tokenInfo.virtualCollateralReserves,
			tokenAmount,
			tokenInfo.virtualTokenReserves
		);

		return {
			amountOut: tokenAmount,
			fee,
			totalCost,
			priceImpact
		};
	}

	/**
	 * Get quote for selling exact amount of tokens
	 */
	async getSellQuoteExactIn(tokenAddress: Address, tokenAmount: bigint): Promise<MoonshotQuote> {
		const tokenInfo = await this.getTokenInfo(tokenAddress);

		const [amountOut, fee] = (await this.publicClient.readContract({
			address: tokenAddress,
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'getAmountOutAndFee',
			args: [
				tokenAmount,
				tokenInfo.virtualTokenReserves,
				tokenInfo.virtualCollateralReserves,
				false // payment token (ETH) is not in
			]
		})) as [bigint, bigint];

		const priceImpact = this.calculatePriceImpact(
			tokenAmount,
			tokenInfo.virtualTokenReserves,
			amountOut,
			tokenInfo.virtualCollateralReserves
		);

		return {
			amountOut: amountOut - fee,
			fee,
			totalCost: tokenAmount,
			priceImpact
		};
	}

	/**
	 * Get quote for selling tokens to receive exact ETH
	 */
	async getSellQuoteExactOut(
		tokenAddress: Address,
		ethAmount: string | bigint
	): Promise<MoonshotQuote> {
		const tokenInfo = await this.getTokenInfo(tokenAddress);
		const amountOut = typeof ethAmount === 'string' ? parseEther(ethAmount) : ethAmount;

		const [amountIn, fee] = (await this.publicClient.readContract({
			address: tokenAddress,
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'getAmountInAndFee',
			args: [
				amountOut,
				tokenInfo.virtualTokenReserves,
				tokenInfo.virtualCollateralReserves,
				true // payment token (ETH) is out
			]
		})) as [bigint, bigint];

		const priceImpact = this.calculatePriceImpact(
			amountIn,
			tokenInfo.virtualTokenReserves,
			amountOut,
			tokenInfo.virtualCollateralReserves
		);

		return {
			amountOut,
			fee,
			totalCost: amountIn,
			priceImpact
		};
	}

	/**
	 * Execute buy with exact ETH input
	 */
	async buyExactIn(
		tokenAddress: Address,
		ethAmount: string | bigint,
		minTokensOut: bigint,
		userAddress: Address
	): Promise<string> {
		if (!this.walletClient) {
			throw new Error('Wallet client not available');
		}

		const value = typeof ethAmount === 'string' ? parseEther(ethAmount) : ethAmount;

		const hash = await this.walletClient.writeContract({
			address: this.factoryAddress,
			abi: MOONSHOT_FACTORY_ABI,
			functionName: 'buyExactIn',
			args: [tokenAddress, minTokensOut],
			value,
			account: userAddress,
			chain: this.walletClient.chain
		});

		return hash;
	}

	/**
	 * Execute buy for exact token amount
	 */
	async buyExactOut(
		tokenAddress: Address,
		tokenAmount: bigint,
		maxEthIn: string,
		userAddress: Address
	): Promise<string> {
		if (!this.walletClient) {
			throw new Error('Wallet client not available');
		}

		const value = parseEther(maxEthIn);

		const hash = await this.walletClient.writeContract({
			address: this.factoryAddress,
			abi: MOONSHOT_FACTORY_ABI,
			functionName: 'buyExactOut',
			args: [tokenAddress, tokenAmount, value],
			value,
			account: userAddress,
			chain: this.walletClient.chain
		});

		return hash;
	}

	/**
	 * Execute sell with exact token input
	 */
	async sellExactIn(
		tokenAddress: Address,
		tokenAmount: bigint,
		minEthOut: bigint,
		userAddress: Address
	): Promise<string> {
		if (!this.walletClient) {
			throw new Error('Wallet client not available');
		}

		// First check and approve if needed
		await this.ensureApproval(tokenAddress, tokenAmount, userAddress);

		const minCollateral = minEthOut;

		const hash = await this.walletClient.writeContract({
			address: this.factoryAddress,
			abi: MOONSHOT_FACTORY_ABI,
			functionName: 'sellExactIn',
			args: [tokenAddress, tokenAmount, minCollateral],
			account: userAddress,
			chain: this.walletClient.chain
		});

		return hash;
	}

	/**
	 * Execute sell for exact ETH output
	 */
	async sellExactOut(
		tokenAddress: Address,
		maxTokensIn: bigint,
		ethAmount: string,
		userAddress: Address
	): Promise<string> {
		if (!this.walletClient) {
			throw new Error('Wallet client not available');
		}

		// First check and approve if needed
		await this.ensureApproval(tokenAddress, maxTokensIn, userAddress);

		const collateralAmount = parseEther(ethAmount);

		const hash = await this.walletClient.writeContract({
			address: this.factoryAddress,
			abi: MOONSHOT_FACTORY_ABI,
			functionName: 'sellExactOut',
			args: [tokenAddress, maxTokensIn, collateralAmount],
			account: userAddress,
			chain: this.walletClient.chain
		});

		return hash;
	}

	/**
	 * Check token allowance and approve if needed
	 */
	private async ensureApproval(
		tokenAddress: Address,
		amount: bigint,
		userAddress: Address
	): Promise<void> {
		const allowance = (await this.publicClient.readContract({
			address: tokenAddress,
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'allowance',
			args: [userAddress, this.factoryAddress]
		})) as bigint;

		if (allowance < amount) {
			if (!this.walletClient) {
				throw new Error('Wallet client not available');
			}

			// Approve max amount for better UX
			const maxApproval = BigInt(
				'0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
			);

			const hash = await this.walletClient.writeContract({
				address: tokenAddress,
				abi: MOONSHOT_TOKEN_ABI,
				functionName: 'approve',
				args: [this.factoryAddress, maxApproval],
				account: userAddress,
				chain: this.walletClient.chain
			});

			// Wait for approval transaction
			await this.publicClient.waitForTransactionReceipt({ hash });
		}
	}

	/**
	 * Calculate price impact percentage
	 */
	private calculatePriceImpact(
		amountIn: bigint,
		reserveIn: bigint,
		amountOut: bigint,
		reserveOut: bigint
	): number {
		// Price impact = (1 - (reserveOut / (reserveOut + amountOut)) / (reserveIn / (reserveIn + amountIn))) * 100
		// Simplified: approximate price impact based on reserve change
		const reserveInChange = Number(amountIn) / Number(reserveIn);
		const reserveOutChange = Number(amountOut) / Number(reserveOut);

		const impact = ((reserveInChange + reserveOutChange) / 2) * 100;
		return Math.min(impact, 100); // Cap at 100%
	}

	/**
	 * Get user's ETH balance
	 */
	async getEthBalance(userAddress: Address): Promise<bigint> {
		return await this.publicClient.getBalance({ address: userAddress });
	}

	/**
	 * Get user's token balance
	 */
	async getTokenBalance(tokenAddress: Address, userAddress: Address): Promise<bigint> {
		return (await this.publicClient.readContract({
			address: tokenAddress,
			abi: MOONSHOT_TOKEN_ABI,
			functionName: 'balanceOf',
			args: [userAddress]
		})) as bigint;
	}
}

/**
 * Helper to format ETH amount for display
 */
export function formatEthAmount(amount: bigint, decimals = 6): string {
	const formatted = formatEther(amount);
	const parts = formatted.split('.');
	if (parts.length === 1) return formatted;
	return `${parts[0]}.${parts[1].slice(0, decimals)}`;
}

/**
 * Helper to format token amount for display
 */
export function formatTokenAmount(amount: bigint, decimals: number, displayDecimals = 6): string {
	const divisor = BigInt(10 ** decimals);
	const whole = amount / divisor;
	const fraction = amount % divisor;
	const fractionStr = fraction.toString().padStart(decimals, '0').slice(0, displayDecimals);
	return `${whole}.${fractionStr}`;
}

/**
 * Apply slippage to amount
 */
export function applySlippage(amount: bigint, slippagePercent: number, isMinimum: boolean): bigint {
	const slippageBps = BigInt(Math.floor(slippagePercent * 100)); // Convert to basis points
	const bps = BigInt(10000);

	if (isMinimum) {
		// For minimum amounts, subtract slippage
		return (amount * (bps - slippageBps)) / bps;
	} else {
		// For maximum amounts, add slippage
		return (amount * (bps + slippageBps)) / bps;
	}
}
