import { createPublicClient, http, namehash, type Address } from 'viem';
import { mainnet } from 'viem/chains';
import type { ENSNameInfo, ScanProgress, ENSStatus } from '../types/ens';

// ENS Registry contract address on mainnet
const ENS_REGISTRY_ADDRESS = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as Address;

// ENS Base Registrar contract address (for .eth names)
const ENS_BASE_REGISTRAR_ADDRESS = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85' as Address;

// ENS Registry ABI (minimal)
const ENS_REGISTRY_ABI = [
	{
		inputs: [{ name: 'node', type: 'bytes32' }],
		name: 'owner',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ name: 'node', type: 'bytes32' }],
		name: 'resolver',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

// ENS Base Registrar ABI (minimal, for expiry)
const ENS_BASE_REGISTRAR_ABI = [
	{
		inputs: [{ name: 'id', type: 'uint256' }],
		name: 'nameExpires',
		outputs: [{ name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ name: 'id', type: 'uint256' }],
		name: 'ownerOf',
		outputs: [{ name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [{ name: 'id', type: 'uint256' }],
		name: 'available',
		outputs: [{ name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

/**
 * Get token ID from ENS name (keccak256 hash)
 */
function getTokenId(name: string): bigint {
	// Remove .eth if present
	const cleanName = name.replace('.eth', '').toLowerCase();
	// For .eth names, the token ID is keccak256(label)
	const hash = namehash(cleanName);
	return BigInt(hash);
}

/**
 * Scan a single ENS name
 */
export async function scanENSName(name: string, rpcUrl: string): Promise<ENSNameInfo> {
	const cleanName = name.toLowerCase().trim().replace('.eth', '');
	const fullName = `${cleanName}.eth`;

	try {
		const client = createPublicClient({
			chain: mainnet,
			transport: http(rpcUrl)
		});

		// Get token ID
		const tokenId = getTokenId(cleanName);

		// Check if available
		const isAvailable = await client.readContract({
			address: ENS_BASE_REGISTRAR_ADDRESS,
			abi: ENS_BASE_REGISTRAR_ABI,
			functionName: 'available',
			args: [tokenId]
		});

		if (isAvailable) {
			return {
				name: cleanName,
				fullName,
				status: 'available'
			};
		}

		// Get owner
		let owner: Address | undefined;
		try {
			owner = await client.readContract({
				address: ENS_BASE_REGISTRAR_ADDRESS,
				abi: ENS_BASE_REGISTRAR_ABI,
				functionName: 'ownerOf',
				args: [tokenId]
			});
		} catch (error) {
			// If ownerOf fails, the name might be in grace period or expired
			owner = undefined;
		}

		// Get expiry date
		const expiryTimestamp = await client.readContract({
			address: ENS_BASE_REGISTRAR_ADDRESS,
			abi: ENS_BASE_REGISTRAR_ABI,
			functionName: 'nameExpires',
			args: [tokenId]
		});

		const expiryDate = Number(expiryTimestamp) * 1000; // Convert to milliseconds
		const now = Date.now();
		const daysUntilExpiry = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));

		// Determine status
		let status: ENSStatus;
		const GRACE_PERIOD_DAYS = 90;

		if (expiryDate < now) {
			// Check if in grace period (90 days after expiry)
			const daysSinceExpiry = Math.floor((now - expiryDate) / (1000 * 60 * 60 * 24));
			if (daysSinceExpiry <= GRACE_PERIOD_DAYS) {
				status = 'grace-period';
			} else {
				status = 'expired';
			}
		} else {
			status = 'registered';
		}

		// Get resolver
		const node = namehash(fullName);
		let resolver: Address | undefined;
		try {
			resolver = await client.readContract({
				address: ENS_REGISTRY_ADDRESS,
				abi: ENS_REGISTRY_ABI,
				functionName: 'resolver',
				args: [node as `0x${string}`]
			});
		} catch (error) {
			resolver = undefined;
		}

		return {
			name: cleanName,
			fullName,
			status,
			owner,
			expiryDate,
			resolver,
			daysUntilExpiry
		};
	} catch (error) {
		console.error(`Failed to scan ${fullName}:`, error);
		return {
			name: cleanName,
			fullName,
			status: 'error',
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Scan multiple ENS names
 */
export async function scanMultipleENSNames(
	names: string[],
	rpcUrl: string,
	onProgress?: (progress: ScanProgress) => void
): Promise<ENSNameInfo[]> {
	const results: ENSNameInfo[] = [];
	const total = names.length;

	for (let i = 0; i < names.length; i++) {
		const name = names[i];

		// Report progress
		if (onProgress) {
			onProgress({
				current: i + 1,
				total,
				percentage: Math.round(((i + 1) / total) * 100),
				currentName: name
			});
		}

		try {
			const result = await scanENSName(name, rpcUrl);
			results.push(result);

			// Small delay to avoid rate limiting
			if (i < names.length - 1) {
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		} catch (error) {
			console.error(`Failed to scan ${name}:`, error);
			results.push({
				name,
				fullName: `${name}.eth`,
				status: 'error',
				error: error instanceof Error ? error.message : 'Unknown error'
			});
		}
	}

	return results;
}

/**
 * Export to CSV
 */
export function exportToCSV(names: ENSNameInfo[]): string {
	const lines: string[] = [];

	// Header
	lines.push(
		'Name,Status,Owner,Expiry Date,Days Until Expiry,Resolver,Registration Date'
			.split(',')
			.join(',')
	);

	// Data rows
	for (const name of names) {
		const expiryDateStr = name.expiryDate
			? new Date(name.expiryDate).toISOString().split('T')[0]
			: '';
		const regDateStr = name.registrationDate
			? new Date(name.registrationDate).toISOString().split('T')[0]
			: '';

		lines.push(
			[
				name.fullName,
				name.status,
				name.owner || '',
				expiryDateStr,
				name.daysUntilExpiry?.toString() || '',
				name.resolver || '',
				regDateStr
			].join(',')
		);
	}

	return lines.join('\n');
}

/**
 * Export to JSON
 */
export function exportToJSON(names: ENSNameInfo[]): string {
	return JSON.stringify(names, null, 2);
}
