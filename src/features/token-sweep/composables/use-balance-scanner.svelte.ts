import { createPublicClient, http } from 'viem';
import {
	scanMultipleWalletsResumable,
	RateLimitError,
	type ScanState
} from '@/features/token-sweep/utils/balance-scanner';
import type { ImportedWallet } from '@/features/token-sweep/types/wallet';
import type { ERC20Token, Token } from '$lib/types/token';
import { SvelteMap } from 'svelte/reactivity';

interface ScanBalancesParams {
	wallets: ImportedWallet[];
	selectedTokens: Token[];
	currentChainId: number;
	rpcUrl: string;
	networkName: string;
	networkSymbol: string;
	onProgress: (progress: number) => void;
	onRateLimitError?: (error: RateLimitError, state: ScanState) => void;
	initialState?: ScanState;
}

export function useBalanceScanner() {
	async function scanBalances(params: ScanBalancesParams) {
		const {
			wallets,
			selectedTokens,
			currentChainId,
			rpcUrl,
			networkName,
			networkSymbol,
			onProgress,
			onRateLimitError,
			initialState
		} = params;

		// Create chain object for viem
		const chain = {
			id: currentChainId,
			name: networkName,
			nativeCurrency: {
				name: networkSymbol,
				symbol: networkSymbol,
				decimals: 18
			},
			rpcUrls: {
				default: {
					http: [rpcUrl]
				}
			}
		} as const;

		// Create public client
		const publicClient = createPublicClient({
			chain,
			transport: http(rpcUrl)
		});

		// Prepare token addresses for scanning
		const tokenAddresses = selectedTokens.map((token) => ({
			address: token.type === 'erc20' ? (token as ERC20Token).address : undefined,
			decimals: token.decimals,
			chainId: token.chainId,
			tokenId: token.id
		}));

		// Use resumable scan with rate limit handling
		const { results, state } = await scanMultipleWalletsResumable(
			publicClient,
			wallets,
			tokenAddresses,
			currentChainId,
			(progress) => {
				onProgress(progress.percentage);
			},
			onRateLimitError,
			initialState
		);

		// Format results for storage
		const updates = new SvelteMap<
			string,
			{ hasBalance: boolean; balances?: { native?: string; tokens?: Record<string, string> } }
		>();

		for (const [address, result] of results.entries()) {
			const balances: { native?: string; tokens?: Record<string, string> } = {
				tokens: {}
			};

			// Format balances for storage
			for (const balance of result.balances) {
				if (balance.tokenId.endsWith(':native')) {
					balances.native = balance.formatted;
				} else {
					balances.tokens![balance.tokenId] = balance.formatted;
				}
			}

			updates.set(address.toLowerCase(), {
				hasBalance: result.hasBalance,
				balances
			});
		}

		return { updates, state };
	}

	return {
		scanBalances
	};
}
