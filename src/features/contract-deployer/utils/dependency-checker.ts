import type { PublicClient, Address } from 'viem';

// CREATE2 Proxy address (deterministic across all networks)
export const CREATE2_PROXY_ADDRESS = '0x4e59b44847b379578588920cA78FbF26c0B4956C' as Address;

export interface DependencyCheckResult {
	name: string;
	address: Address;
	exists: boolean;
	error?: string;
}

/**
 * Check if CREATE2 Proxy contract exists on the current network
 */
export async function checkCreate2Proxy(
	publicClient: PublicClient
): Promise<DependencyCheckResult> {
	try {
		const bytecode = await publicClient.getBytecode({
			address: CREATE2_PROXY_ADDRESS
		});

		return {
			name: 'CREATE2 Proxy',
			address: CREATE2_PROXY_ADDRESS,
			exists: Boolean(bytecode && bytecode !== '0x')
		};
	} catch (error) {
		return {
			name: 'CREATE2 Proxy',
			address: CREATE2_PROXY_ADDRESS,
			exists: false,
			error: error instanceof Error ? error.message : String(error)
		};
	}
}

/**
 * Check all required dependencies
 */
export async function checkAllDependencies(
	publicClient: PublicClient
): Promise<DependencyCheckResult[]> {
	const results = await Promise.all([checkCreate2Proxy(publicClient)]);
	return results;
}
