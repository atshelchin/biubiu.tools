import type { Chain } from '../types/chain';

export interface AddChainResult {
	success: boolean;
	error?: string;
}

/**
 * Check if wallet is available (MetaMask or other EIP-1193 provider)
 */
export function isWalletAvailable(): boolean {
	return typeof window !== 'undefined' && Boolean(window.ethereum);
}

/**
 * Add a chain to the user's wallet using wallet_addEthereumChain
 */
export async function addChainToWallet(chain: Chain): Promise<AddChainResult> {
	if (!isWalletAvailable()) {
		return {
			success: false,
			error: 'No wallet detected. Please install MetaMask or another Web3 wallet.'
		};
	}

	// Filter out WebSocket URLs - wallets typically only accept HTTP(S) URLs
	const httpRpcUrls = chain.rpc
		.filter((rpc) => rpc.url.startsWith('http://') || rpc.url.startsWith('https://'))
		.map((rpc) => rpc.url);

	if (httpRpcUrls.length === 0) {
		return {
			success: false,
			error: 'No HTTP RPC URLs available for this chain'
		};
	}

	const explorerUrls = chain.explorers?.map((e) => e.url) ?? [];

	try {
		await window.ethereum!.request({
			method: 'wallet_addEthereumChain',
			params: [
				{
					chainId: `0x${chain.chainId.toString(16)}`,
					chainName: chain.name,
					nativeCurrency: {
						name: chain.nativeCurrency.name,
						symbol: chain.nativeCurrency.symbol,
						decimals: chain.nativeCurrency.decimals
					},
					rpcUrls: httpRpcUrls,
					blockExplorerUrls: explorerUrls.length > 0 ? explorerUrls : undefined
				}
			]
		});

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			// User rejected the request
			if ((error as { code?: number }).code === 4001) {
				return {
					success: false,
					error: 'User rejected the request'
				};
			}

			return {
				success: false,
				error: error.message
			};
		}

		return {
			success: false,
			error: 'Failed to add chain to wallet'
		};
	}
}

/**
 * Switch to a chain in the user's wallet
 */
export async function switchToChain(chainId: number): Promise<AddChainResult> {
	if (!isWalletAvailable()) {
		return {
			success: false,
			error: 'No wallet detected'
		};
	}

	try {
		await window.ethereum!.request({
			method: 'wallet_switchEthereumChain',
			params: [{ chainId: `0x${chainId.toString(16)}` }]
		});

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			// Chain not added yet (error code 4902)
			if ((error as { code?: number }).code === 4902) {
				return {
					success: false,
					error: 'Chain not found in wallet. Please add it first.'
				};
			}

			// User rejected
			if ((error as { code?: number }).code === 4001) {
				return {
					success: false,
					error: 'User rejected the request'
				};
			}

			return {
				success: false,
				error: error.message
			};
		}

		return {
			success: false,
			error: 'Failed to switch chain'
		};
	}
}

/**
 * Format Chain ID for display (hex format)
 */
export function formatChainIdHex(chainId: number): string {
	return `0x${chainId.toString(16)}`;
}
