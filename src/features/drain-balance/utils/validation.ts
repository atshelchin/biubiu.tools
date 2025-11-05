// Validation utilities for custom networks and tokens
import { createPublicClient, http, type Address } from 'viem';
import type { Token } from '../types';

// ERC20 ABI for token info
const ERC20_ABI = [
	{
		inputs: [],
		name: 'name',
		outputs: [{ type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [{ type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [{ type: 'uint8' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

// Validate custom network
export async function validateNetwork(network: {
	name: string;
	chainId: number;
	rpcUrl: string;
	blockExplorer?: string;
}): Promise<{ isValid: boolean; error?: string; features?: string[] }> {
	try {
		// Create client
		const client = createPublicClient({
			transport: http(network.rpcUrl)
		});

		// Get chain ID from RPC
		const chainId = await client.getChainId();

		// Check if chain ID matches
		if (chainId !== network.chainId) {
			return {
				isValid: false,
				error: `Chain ID mismatch: RPC returns ${chainId}, but you entered ${network.chainId}`
			};
		}

		// Check block number (to verify RPC is working)
		const blockNumber = await client.getBlockNumber();
		if (blockNumber <= 0n) {
			return {
				isValid: false,
				error: 'RPC is not returning valid block data'
			};
		}

		// Check for supported features
		const features: string[] = [];

		try {
			// Check for EIP-1559 support (dynamic fees)
			const block = await client.getBlock({ blockTag: 'latest' });
			if (block.baseFeePerGas !== undefined) {
				features.push('EIP-1559');
			}

			// Check for EIP-7702 support
			// EIP-7702 introduces account abstraction for EOAs
			// It requires the Prague hard fork to be activated
			// We check if the chain supports the new transaction type (0x04)
			try {
				// Try to estimate gas for a potential EIP-7702 transaction
				// This is a more realistic check - chains that support EIP-7702
				// will have the necessary opcodes and transaction types
				const testAddress = '0x0000000000000000000000000000000000000000';
				const gasEstimate = await client
					.estimateGas({
						to: testAddress as `0x${string}`,
						data: '0x' as `0x${string}`,
						type: 'eip7702' as unknown as 'legacy' // Type 0x04 transaction
					})
					.catch(() => null);

				if (gasEstimate !== null) {
					features.push('EIP-7702');
				}
			} catch {
				// Chain doesn't support EIP-7702
			}

			// Check for other common EIPs
			if (block.withdrawals !== undefined) {
				features.push('EIP-4895'); // Beacon chain withdrawals
			}
		} catch (error) {
			// Some features couldn't be checked, but network is still valid
			console.warn('Could not check all network features:', error);
		}

		return {
			isValid: true,
			features
		};
	} catch (error) {
		return {
			isValid: false,
			error: error instanceof Error ? error.message : 'Failed to connect to RPC'
		};
	}
}

// Validate and fetch token info
export async function validateToken(
	tokenAddress: string,
	rpcUrl: string
): Promise<{ isValid: boolean; token?: Token; error?: string }> {
	try {
		// Clean up the address (remove spaces, convert to lowercase for comparison)
		const cleanAddress = tokenAddress.trim();

		// Validate address format (case-insensitive)
		if (!/^0x[a-fA-F0-9]{40}$/i.test(cleanAddress)) {
			return {
				isValid: false,
				error: `Invalid address format. Expected 0x followed by 40 hex characters, got: ${cleanAddress.length} characters`
			};
		}

		// Create client
		const client = createPublicClient({
			transport: http(rpcUrl)
		});

		// Check if contract exists
		const code = await client.getBytecode({ address: cleanAddress as Address });
		if (!code || code === '0x') {
			return {
				isValid: false,
				error: 'No contract found at this address'
			};
		}

		// Get token info
		try {
			const [name, symbol, decimals] = await Promise.all([
				client.readContract({
					address: cleanAddress as Address,
					abi: ERC20_ABI,
					functionName: 'name'
				}),
				client.readContract({
					address: cleanAddress as Address,
					abi: ERC20_ABI,
					functionName: 'symbol'
				}),
				client.readContract({
					address: cleanAddress as Address,
					abi: ERC20_ABI,
					functionName: 'decimals'
				})
			]);

			return {
				isValid: true,
				token: {
					address: cleanAddress as Address,
					symbol: symbol as string,
					name: name as string,
					decimals: Number(decimals),
					isCustom: true
				}
			};
		} catch {
			return {
				isValid: false,
				error: 'Contract exists but does not appear to be a standard ERC20 token'
			};
		}
	} catch (error) {
		return {
			isValid: false,
			error: error instanceof Error ? error.message : 'Failed to validate token'
		};
	}
}
