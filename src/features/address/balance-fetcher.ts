/**
 * Balance Fetcher - Fetch native token balance via RPC
 * Client-side utility for fetching balance without API quota
 */

import { createPublicClient, http, formatEther, getAddress, type Address } from 'viem';
import {
	mainnet,
	base,
	arbitrum,
	optimism,
	polygon,
	bsc,
	avalanche,
	fantom,
	gnosis,
	zkSync,
	linea,
	scroll,
	mantle,
	blast,
	mode,
	taiko
} from 'viem/chains';
import type {Chain} from "viem"

// Chain configs with RPC endpoints
const CHAIN_CONFIGS: Record<
	number,
	{ chain: Chain; rpcs: string[]; symbol: string; decimals: number }
> = {
	1: {
		chain: mainnet,
		rpcs: [
			'https://eth.llamarpc.com',
			'https://ethereum.publicnode.com',
			'https://rpc.ankr.com/eth'
		],
		symbol: 'ETH',
		decimals: 18
	},
	8453: {
		chain: base,
		rpcs: ['https://base.llamarpc.com', 'https://base.publicnode.com', 'https://base.drpc.org'],
		symbol: 'ETH',
		decimals: 18
	},
	42161: {
		chain: arbitrum,
		rpcs: [
			'https://arbitrum.llamarpc.com',
			'https://arbitrum-one.publicnode.com',
			'https://arb1.arbitrum.io/rpc'
		],
		symbol: 'ETH',
		decimals: 18
	},
	10: {
		chain: optimism,
		rpcs: [
			'https://optimism.llamarpc.com',
			'https://optimism.publicnode.com',
			'https://mainnet.optimism.io'
		],
		symbol: 'ETH',
		decimals: 18
	},
	137: {
		chain: polygon,
		rpcs: [
			'https://polygon.llamarpc.com',
			'https://polygon-bor.publicnode.com',
			'https://polygon-rpc.com'
		],
		symbol: 'MATIC',
		decimals: 18
	},
	56: {
		chain: bsc,
		rpcs: [
			'https://bsc.llamarpc.com',
			'https://bsc.publicnode.com',
			'https://bsc-dataseed.binance.org'
		],
		symbol: 'BNB',
		decimals: 18
	},
	43114: {
		chain: avalanche,
		rpcs: [
			'https://avalanche.llamarpc.com',
			'https://avalanche-c-chain.publicnode.com',
			'https://api.avax.network/ext/bc/C/rpc'
		],
		symbol: 'AVAX',
		decimals: 18
	},
	250: {
		chain: fantom,
		rpcs: [
			'https://fantom.publicnode.com',
			'https://rpc.ftm.tools',
			'https://rpcapi.fantom.network'
		],
		symbol: 'FTM',
		decimals: 18
	},
	100: {
		chain: gnosis,
		rpcs: [
			'https://gnosis.publicnode.com',
			'https://rpc.gnosischain.com',
			'https://gnosis.drpc.org'
		],
		symbol: 'xDAI',
		decimals: 18
	},
	324: {
		chain: zkSync,
		rpcs: ['https://mainnet.era.zksync.io', 'https://zksync.drpc.org'],
		symbol: 'ETH',
		decimals: 18
	},
	59144: {
		chain: linea,
		rpcs: ['https://linea.drpc.org', 'https://rpc.linea.build'],
		symbol: 'ETH',
		decimals: 18
	},
	534352: {
		chain: scroll,
		rpcs: ['https://scroll.drpc.org', 'https://rpc.scroll.io'],
		symbol: 'ETH',
		decimals: 18
	},
	5000: {
		chain: mantle,
		rpcs: ['https://rpc.mantle.xyz', 'https://mantle.drpc.org'],
		symbol: 'MNT',
		decimals: 18
	},
	81457: {
		chain: blast,
		rpcs: ['https://rpc.blast.io', 'https://blast.drpc.org'],
		symbol: 'ETH',
		decimals: 18
	},
	34443: {
		chain: mode,
		rpcs: ['https://mainnet.mode.network', 'https://mode.drpc.org'],
		symbol: 'ETH',
		decimals: 18
	},
	167000: {
		chain: taiko,
		rpcs: ['https://rpc.taiko.xyz', 'https://taiko.drpc.org'],
		symbol: 'ETH',
		decimals: 18
	}
};

export interface BalanceResult {
	balance: string; // Formatted balance (e.g., "1.234")
	balanceRaw: bigint; // Raw balance in wei
	symbol: string; // Token symbol (e.g., "ETH")
	isContract: boolean;
	error?: string;
}

/**
 * Normalize address to checksum format
 * Handles lowercase, uppercase, or mixed case addresses
 */
export function normalizeAddress(address: string): Address {
	try {
		// getAddress will convert any valid hex address to checksum format
		return getAddress(address.trim());
	} catch {
		// If getAddress fails, return as-is (will likely fail later)
		return address as Address;
	}
}

/**
 * Fetch native token balance for an address on a specific chain
 */
export async function fetchBalance(
	address: string,
	chainId: number
): Promise<BalanceResult | null> {
	const config = CHAIN_CONFIGS[chainId];
	if (!config) {
		return {
			balance: '0',
			balanceRaw: 0n,
			symbol: 'ETH',
			isContract: false,
			error: 'Unsupported chain'
		};
	}

	// Normalize address to checksum format (handles lowercase/uppercase addresses)
	const normalizedAddress = normalizeAddress(address);

	for (const rpc of config.rpcs) {
		try {
			const client = createPublicClient({
				chain: config.chain,
				transport: http(rpc, {
					timeout: 10000,
					retryCount: 1
				})
			});

			// Fetch balance and bytecode in parallel
			const [balance, bytecode] = await Promise.all([
				client.getBalance({ address: normalizedAddress }),
				client.getCode({ address: normalizedAddress })
			]);

			return {
				balance: formatEther(balance),
				balanceRaw: balance,
				symbol: config.symbol,
				isContract: Boolean(bytecode && bytecode !== '0x')
			};
		} catch {
			// Try next RPC
			continue;
		}
	}

	return {
		balance: '0',
		balanceRaw: 0n,
		symbol: config.symbol,
		isContract: false,
		error: 'Failed to fetch balance'
	};
}

/**
 * Format balance for display
 */
export function formatBalance(balance: string, maxDecimals = 4): string {
	const num = parseFloat(balance);
	if (num === 0) return '0';
	if (num < 0.0001) return '< 0.0001';
	return num.toFixed(maxDecimals).replace(/\.?0+$/, '');
}

/**
 * Get native token symbol for a chain
 */
export function getNativeSymbol(chainId: number): string {
	return CHAIN_CONFIGS[chainId]?.symbol || 'ETH';
}
