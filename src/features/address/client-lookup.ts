/**
 * Client-side Address/ENS Lookup via RPC
 * Fetches basic data for unlisted addresses and ENS names
 * No API quota needed - uses public RPC endpoints only
 */

import { createPublicClient, http, isAddress, namehash, type Address, formatEther } from 'viem';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

// Public Ethereum RPC endpoints
const RPC_ENDPOINTS = [
	'https://eth.llamarpc.com',
	'https://ethereum.publicnode.com',
	'https://rpc.ankr.com/eth',
	'https://cloudflare-eth.com'
];

// ENS Contracts
const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as Address;
const ENS_RESOLVER_ABI = [
	{
		inputs: [{ name: 'node', type: 'bytes32' }],
		name: 'addr',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

const ENS_REGISTRY_ABI = [
	{
		inputs: [{ name: 'node', type: 'bytes32' }],
		name: 'resolver',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

export interface LookupResult {
	type: 'address' | 'ens';
	address: string;
	ensName?: string;
	balance?: string; // Formatted ETH balance
	isContract?: boolean;
	error?: string;
}

function createClient(rpcIndex = 0) {
	return createPublicClient({
		chain: mainnet,
		transport: http(RPC_ENDPOINTS[rpcIndex], {
			timeout: 10000,
			retryCount: 1
		})
	});
}

/**
 * Check if a string looks like an ENS name
 */
export function isENSName(input: string): boolean {
	return input.endsWith('.eth') && input.length > 4;
}

/**
 * Lookup address data via RPC (balance, isContract)
 */
async function lookupAddress(address: Address): Promise<LookupResult> {
	for (let i = 0; i < RPC_ENDPOINTS.length; i++) {
		try {
			const client = createClient(i);

			// Fetch balance and bytecode in parallel
			const [balance, bytecode] = await Promise.all([
				client.getBalance({ address }),
				client.getCode({ address })
			]);

			return {
				type: 'address',
				address,
				balance: formatEther(balance),
				isContract: Boolean(bytecode && bytecode !== '0x')
			};
		} catch {
			continue;
		}
	}

	return {
		type: 'address',
		address,
		error: 'Failed to fetch address data'
	};
}

/**
 * Resolve ENS name to address and get basic data
 */
async function lookupENS(ensName: string): Promise<LookupResult> {
	let normalizedName: string;
	try {
		normalizedName = normalize(ensName);
	} catch {
		return {
			type: 'ens',
			address: '',
			ensName,
			error: 'Invalid ENS name'
		};
	}

	const node = namehash(normalizedName);

	for (let i = 0; i < RPC_ENDPOINTS.length; i++) {
		try {
			const client = createClient(i);

			// Get resolver address
			const resolverAddress = await client.readContract({
				address: ENS_REGISTRY,
				abi: ENS_REGISTRY_ABI,
				functionName: 'resolver',
				args: [node]
			});

			if (!resolverAddress || resolverAddress === '0x0000000000000000000000000000000000000000') {
				return {
					type: 'ens',
					address: '',
					ensName,
					error: 'ENS name not registered or has no resolver'
				};
			}

			// Get resolved address
			const address = await client.readContract({
				address: resolverAddress,
				abi: ENS_RESOLVER_ABI,
				functionName: 'addr',
				args: [node]
			});

			if (!address || address === '0x0000000000000000000000000000000000000000') {
				return {
					type: 'ens',
					address: '',
					ensName,
					error: 'ENS name has no address record'
				};
			}

			// Get balance for the resolved address
			const balance = await client.getBalance({ address });

			return {
				type: 'ens',
				address,
				ensName,
				balance: formatEther(balance)
			};
		} catch {
			continue;
		}
	}

	return {
		type: 'ens',
		address: '',
		ensName,
		error: 'Failed to resolve ENS name'
	};
}

/**
 * Main lookup function - detects input type and fetches data
 * @param input Address (0x...) or ENS name (.eth)
 * @returns LookupResult with address data
 */
export async function clientLookup(input: string): Promise<LookupResult | null> {
	const trimmed = input.trim().toLowerCase();

	// Check if it's an Ethereum address
	if (isAddress(trimmed)) {
		return lookupAddress(trimmed as Address);
	}

	// Check if it's an ENS name
	if (isENSName(trimmed)) {
		return lookupENS(trimmed);
	}

	// Not a valid address or ENS name
	return null;
}

/**
 * Get a display-friendly link for the lookup result
 */
export function getLookupLink(result: LookupResult): string {
	if (result.ensName) {
		return `/name/${result.ensName}`;
	}
	// Default to Ethereum mainnet (chainId 1)
	return `/address/1/${result.address}`;
}
